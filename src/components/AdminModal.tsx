import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Plus,
  Edit2,
  Trash2,
  Copy,
  TrendingUp,
  QrCode,
  Settings as SettingsIcon,
  Percent,
  Check,
  AlertCircle,
  BarChart3,
  Users,
  Eye,
  ShoppingCart,
  Printer,
  Sparkles,
  Download,
} from 'lucide-react';
import { Product, SiteSettings, Language, AnalyticsData, SoundLevel } from '../types';
import { generateQrDataUrl } from '../utils/qr';
import { getProductPlaceholderSvg } from '../data/seedProducts';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  settings: SiteSettings;
  analytics: AnalyticsData;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onDuplicateProduct: (product: Product) => void;
  onBulkUpdatePrices: (percentage: number, categoryId?: string) => void;
  onUpdateSettings: (newSettings: SiteSettings) => void;
  language: Language;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  products,
  settings,
  analytics,
  onSaveProduct,
  onDeleteProduct,
  onDuplicateProduct,
  onBulkUpdatePrices,
  onUpdateSettings,
  language,
}) => {
  const isHi = language === 'hi';

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'catalog' | 'bulk' | 'analytics' | 'qr' | 'settings'>('catalog');

  // Product Editing / Creation State
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isEditingExisting, setIsEditingExisting] = useState<boolean>(false);

  // Bulk Price Update State
  const [bulkPercentage, setBulkPercentage] = useState<number>(10);
  const [bulkCategory, setBulkCategory] = useState<string>('all');
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState<string>('');

  // Settings Edit State
  const [tempSettings, setTempSettings] = useState<SiteSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState<boolean>(false);

  // QR Code Data URL
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  useEffect(() => {
    setTempSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (activeTab === 'qr') {
      const siteUrl = window.location.origin + window.location.pathname;
      generateQrDataUrl(siteUrl).then((url) => setQrCodeDataUrl(url));
    }
  }, [activeTab]);

  if (!isOpen) return null;

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === settings.adminPassword || passwordInput === 'diwali2026') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError(isHi ? 'गलत पासवर्ड! (डिफ़ॉल्ट: diwali2026)' : 'Incorrect password! (Default: diwali2026)');
    }
  };

  // Open Create Product
  const handleStartCreateProduct = () => {
    const newId = `pataka-${Date.now()}`;
    const initialSvg = getProductPlaceholderSvg('New Cracker', 'sound', 'High');

    setEditingProduct({
      id: newId,
      name: '',
      nameHindi: '',
      shortDescription: '',
      shortDescriptionHindi: '',
      pricePerPiece: 50,
      pricePerBox: 450,
      boxQuantity: 10,
      soundLevel: 'Medium',
      category: 'sound',
      inStock: true,
      isBestSeller: false,
      isNewThisYear: true,
      image: initialSvg,
      viewCount: 0,
      cartAddCount: 0,
    });
    setIsEditingExisting(false);
  };

  // Open Edit Product
  const handleStartEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsEditingExisting(true);
  };

  // Save Product Form
  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;

    // If image is missing or empty, regenerate placeholder
    const image =
      editingProduct.image ||
      getProductPlaceholderSvg(
        editingProduct.name,
        editingProduct.category || 'sparklers',
        editingProduct.soundLevel || 'Medium'
      );

    const fullProduct: Product = {
      id: editingProduct.id || `pataka-${Date.now()}`,
      name: editingProduct.name,
      nameHindi: editingProduct.nameHindi || editingProduct.name,
      shortDescription: editingProduct.shortDescription || '',
      shortDescriptionHindi: editingProduct.shortDescriptionHindi || '',
      pricePerPiece: Number(editingProduct.pricePerPiece) || 10,
      pricePerBox: Number(editingProduct.pricePerBox) || 100,
      boxQuantity: Number(editingProduct.boxQuantity) || 10,
      soundLevel: (editingProduct.soundLevel as SoundLevel) || 'Medium',
      category: editingProduct.category || 'sparklers',
      inStock: editingProduct.inStock ?? true,
      isBestSeller: editingProduct.isBestSeller ?? false,
      isNewThisYear: editingProduct.isNewThisYear ?? false,
      image,
      relatedProductIds: editingProduct.relatedProductIds || [],
      viewCount: editingProduct.viewCount || 0,
      cartAddCount: editingProduct.cartAddCount || 0,
    };

    onSaveProduct(fullProduct);
    setEditingProduct(null);
  };

  // Execute Bulk Price
  const handleExecuteBulkPrice = () => {
    onBulkUpdatePrices(bulkPercentage, bulkCategory);
    setBulkSuccessMsg(
      isHi
        ? `सफलतापूर्वक ${bulkPercentage > 0 ? '+' : ''}${bulkPercentage}% दाम अपडेट किए गए!`
        : `Successfully updated prices by ${bulkPercentage > 0 ? '+' : ''}${bulkPercentage}%!`
    );
    setTimeout(() => setBulkSuccessMsg(''), 3000);
  };

  // Save Settings Form
  const handleSaveSettingsForm = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Print Stall QR Code
  const handlePrintQr = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${settings.businessName} - Stall QR Code</title>
          <style>
            body {
              font-family: sans-serif;
              text-align: center;
              padding: 40px;
              color: #111;
            }
            .banner {
              background: #B91C1C;
              color: #FFF;
              padding: 16px;
              border-radius: 8px;
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 24px;
            }
            .qr-img {
              width: 320px;
              height: 320px;
              margin: 0 auto;
              display: block;
              border: 4px solid #F59E0B;
              border-radius: 12px;
              padding: 8px;
            }
            .subtitle {
              font-size: 18px;
              color: #4B5563;
              margin-top: 16px;
            }
            .stall {
              font-size: 22px;
              font-weight: bold;
              color: #111;
              margin-top: 8px;
            }
            .wa {
              font-size: 16px;
              color: #059669;
              font-weight: bold;
              margin-top: 8px;
            }
          </style>
        </head>
        <body>
          <div class="banner">✨ ${settings.businessName} ✨</div>
          <img src="${qrCodeDataUrl}" class="qr-img" alt="Stall QR Code" />
          <div class="subtitle">📱 Scan this QR code to browse full cracker catalog on your phone!</div>
          <div class="stall">📍 ${settings.stallLocation}</div>
          <div class="wa">💬 WhatsApp Orders: ${settings.whatsappPhone}</div>
          <p style="font-size: 12px; color: #9CA3AF; margin-top: 30px;">Direct WhatsApp Checkout • CSIR-NEERI Green Certified Crackers</p>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      id="admin-modal-overlay"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="admin-modal-container"
        className="relative w-full max-w-5xl bg-[#090E1B] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl my-auto text-gray-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-800 bg-[#060913] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-festive flex items-center gap-2">
                <span>{isHi ? 'स्टॉल स्वामी एडमिन पोर्टल' : 'Stall Owner Admin Portal'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                  Owner Dashboard
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">
                {isHi ? 'कैटलॉग, थोक दाम अपडेट, स्टॉल क्यूआर व एनालिटिक्स' : 'Manage products, bulk price changes, analytics & stall QR code'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Password Barrier if not authenticated */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto my-auto space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center text-3xl">
              🔐
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-festive">
                {isHi ? 'सुरक्षित एडमिन लॉगिन' : 'Admin Authorization Required'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {isHi ? 'कृपया स्टॉल एडमिन पासवर्ड दर्ज करें।' : 'Enter the stall manager password to access settings.'}
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password (default: diwali2026)"
                className="w-full bg-[#05070E] border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 font-mono text-center"
                autoFocus
              />

              {authError && (
                <p className="text-xs text-red-400 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{authError}</span>
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
              >
                {isHi ? 'एडमिन में प्रवेश करें' : 'Unlock Admin Portal'}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Authenticated Nav Tabs */}
            <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 bg-[#060913] border-b border-gray-800 overflow-x-auto no-scrollbar text-xs">
              <button
                onClick={() => {
                  setActiveTab('catalog');
                  setEditingProduct(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 font-semibold transition-colors shrink-0 ${
                  activeTab === 'catalog'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isHi ? 'पटाखा कैटलॉग' : 'Product Catalog'} ({products.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('bulk');
                  setEditingProduct(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 font-semibold transition-colors shrink-0 ${
                  activeTab === 'bulk'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <Percent className="w-3.5 h-3.5" />
                <span>{isHi ? 'थोक दाम अपडेट' : 'Bulk Price Update'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('analytics');
                  setEditingProduct(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 font-semibold transition-colors shrink-0 ${
                  activeTab === 'analytics'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{isHi ? 'बिक्री एनालिटिक्स' : 'Analytics & Traffic'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('qr');
                  setEditingProduct(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 font-semibold transition-colors shrink-0 ${
                  activeTab === 'qr'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{isHi ? 'स्टॉल क्यूआर कोड' : 'Printable Stall QR'}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setEditingProduct(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 font-semibold transition-colors shrink-0 ${
                  activeTab === 'settings'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                <span>{isHi ? 'स्टोर सेटिंग्स' : 'Store Settings'}</span>
              </button>
            </div>

            {/* Tab 1: Product Catalog Management */}
            {activeTab === 'catalog' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {editingProduct ? (
                  // Product Edit Form
                  <form onSubmit={handleSaveProductForm} className="bg-[#05070E] border border-gray-800 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                      <h3 className="text-sm font-bold text-amber-300">
                        {isEditingExisting
                          ? isHi ? 'पटाखा एडिट करें' : 'Edit Cracker Details'
                          : isHi ? 'नया पटाखा जोड़ें' : 'Add New Cracker'}
                      </h3>
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="text-xs text-gray-400 hover:text-gray-200"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name English */}
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">Product Name (English) *</label>
                        <input
                          type="text"
                          required
                          value={editingProduct.name || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                          placeholder="e.g. 50-Shot Sky Symphony"
                        />
                      </div>

                      {/* Name Hindi */}
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">Product Name (Hindi)</label>
                        <input
                          type="text"
                          value={editingProduct.nameHindi || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, nameHindi: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                          placeholder="उदा: 50-शॉट स्काई सिम्फनी"
                        />
                      </div>

                      {/* Price Per Piece */}
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">Price Per Piece (₹) *</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.pricePerPiece ?? ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, pricePerPiece: Number(e.target.value) })}
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>

                      {/* Price Per Box */}
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">Price Per Box (₹) *</label>
                        <input
                          type="number"
                          required
                          value={editingProduct.pricePerBox ?? ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, pricePerBox: Number(e.target.value) })}
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>

                      {/* Pieces in Box */}
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">Quantity per Box (pcs)</label>
                        <input
                          type="number"
                          value={editingProduct.boxQuantity ?? 10}
                          onChange={(e) => setEditingProduct({ ...editingProduct, boxQuantity: Number(e.target.value) })}
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        />
                      </div>

                      {/* Sound Level */}
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">Sound Intensity Level</label>
                        <select
                          value={editingProduct.soundLevel || 'Medium'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, soundLevel: e.target.value as SoundLevel })}
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="Low">Low (Fountains, Sparklers)</option>
                          <option value="Medium">Medium (Pop, Spinners, Whistles)</option>
                          <option value="High">High (Sutli, Sky Shots, Bombs)</option>
                        </select>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">Category</label>
                        <select
                          value={editingProduct.category || 'sparklers'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="sparklers">Sparklers / Phuljhari</option>
                          <option value="chakri">Chakri / Ground Spinners</option>
                          <option value="anar">Anar / Flower Pots</option>
                          <option value="rockets">Rockets / Whistlers</option>
                          <option value="sound">Sound / Bombs &amp; Ladi</option>
                          <option value="multishots">Aerial &amp; Sky Shots</option>
                          <option value="kids">Kids Special &amp; Novelty</option>
                          <option value="giftboxes">Gift Boxes &amp; Hampers</option>
                        </select>
                      </div>

                      {/* Image SVG Data / URL */}
                      <div>
                        <label className="text-[11px] text-gray-400 block mb-1">Product Artwork (SVG / Image URL)</label>
                        <input
                          type="text"
                          value={editingProduct.image || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                          placeholder="Auto-generated or custom SVG data URI"
                        />
                      </div>
                    </div>

                    {/* Short Description */}
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Short Description</label>
                      <textarea
                        rows={2}
                        value={editingProduct.shortDescription || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white"
                        placeholder="Description of visual burst, sparks, colors..."
                      />
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-800 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.inStock ?? true}
                          onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                          className="rounded text-amber-500"
                        />
                        <span className="text-gray-200">In Stock</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.isBestSeller ?? false}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                          className="rounded text-amber-500"
                        />
                        <span className="text-gray-200">⭐ Popular / Best Seller</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProduct.isNewThisYear ?? false}
                          onChange={(e) => setEditingProduct({ ...editingProduct, isNewThisYear: e.target.checked })}
                          className="rounded text-amber-500"
                        />
                        <span className="text-gray-200">✨ New This Year</span>
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20"
                      >
                        {isHi ? 'प्रोडक्ट सेव करें' : 'Save Product'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        {isHi ? 'कुल 23+ पटाखे उपलब्ध हैं।' : 'Showing all products in catalog. Tap edit, duplicate or toggle in-stock.'}
                      </p>
                      <button
                        onClick={handleStartCreateProduct}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow-md transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isHi ? 'नया पटाखा जोड़ें' : 'Add New Product'}</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {products.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-[#05070E] border border-gray-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 hover:border-gray-700 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover bg-gray-900 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-bold text-xs text-white">{prod.name}</h4>
                                {prod.isBestSeller && <span className="text-[10px] text-amber-400">⭐</span>}
                                {prod.isNewThisYear && <span className="text-[10px] text-cyan-400">✨</span>}
                              </div>
                              <p className="text-[11px] text-amber-400 font-mono">
                                ₹{prod.pricePerPiece}/pc • ₹{prod.pricePerBox}/box
                              </p>
                            </div>
                          </div>

                          {/* In Stock toggle badge */}
                          <button
                            onClick={() => onSaveProduct({ ...prod, inStock: !prod.inStock })}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                              prod.inStock
                                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30'
                                : 'bg-red-950/80 text-red-400 border-red-500/30'
                            }`}
                          >
                            {prod.inStock ? '🟢 In Stock' : '🔴 Sold Out'}
                          </button>

                          {/* Actions: Edit, Duplicate, Delete */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleStartEditProduct(prod)}
                              className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => onDuplicateProduct(prod)}
                              className="p-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-amber-400 transition-colors"
                              title="Duplicate product (Requirement 16)"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => onDeleteProduct(prod.id)}
                              className="p-2 rounded-lg bg-gray-900 hover:bg-red-950 text-gray-400 hover:text-red-400 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Tab 2: Bulk Price Update Tool (Requirement 17) */}
            {activeTab === 'bulk' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-2xl mx-auto">
                <div className="bg-[#05070E] border border-gray-800 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Percent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white font-festive">
                        {isHi ? 'थोक मूल्य संशोधन (Bulk Price Update)' : 'Bulk Price Update Tool'}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {isHi
                          ? 'सभी पटाखों या किसी विशेष श्रेणी के दाम एक क्लिक में X% बढ़ाएं या घटाएं।'
                          : 'Increase or decrease prices across the entire catalog or per category by a fixed percentage.'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                        Percentage Change (%):
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={bulkPercentage}
                          onChange={(e) => setBulkPercentage(Number(e.target.value))}
                          className="w-32 bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white font-mono text-center"
                          placeholder="e.g. 10 or -5"
                        />
                        <div className="flex items-center gap-2">
                          {[-10, -5, 5, 10, 15, 20].map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setBulkPercentage(p)}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border ${
                                bulkPercentage === p
                                  ? 'bg-amber-500 text-black border-amber-400'
                                  : 'bg-gray-900 border-gray-800 text-gray-400'
                              }`}
                            >
                              {p > 0 ? `+${p}%` : `${p}%`}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-gray-300 block mb-1.5">
                        Apply To Category:
                      </label>
                      <select
                        value={bulkCategory}
                        onChange={(e) => setBulkCategory(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="all">Entire Catalog (All 23+ Products)</option>
                        <option value="sparklers">Sparklers / Phuljhari Only</option>
                        <option value="chakri">Chakri / Ground Spinners Only</option>
                        <option value="anar">Anar / Flower Pots Only</option>
                        <option value="rockets">Rockets Only</option>
                        <option value="sound">Sound / Bombs Only</option>
                        <option value="multishots">Aerial Sky Shots Only</option>
                        <option value="kids">Kids Special Only</option>
                      </select>
                    </div>

                    {bulkSuccessMsg && (
                      <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>{bulkSuccessMsg}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleExecuteBulkPrice}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-98"
                    >
                      Apply {bulkPercentage > 0 ? `+${bulkPercentage}%` : `${bulkPercentage}%`} Price Change Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Basic Analytics (Requirement 18) */}
            {activeTab === 'analytics' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#05070E] border border-gray-800 rounded-2xl p-4">
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-blue-400" />
                      <span>Total Page Views</span>
                    </p>
                    <p className="text-xl font-bold text-white font-mono mt-1">
                      {(analytics.pageViews ?? analytics.totalViews ?? 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-[#05070E] border border-gray-800 rounded-2xl p-4">
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <span>Unique Visitors</span>
                    </p>
                    <p className="text-xl font-bold text-white font-mono mt-1">
                      {(analytics.uniqueVisitors ?? (analytics.newVisitors + analytics.returningVisitors)).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-[#05070E] border border-gray-800 rounded-2xl p-4">
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <ShoppingCart className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Total Cart Additions</span>
                    </p>
                    <p className="text-xl font-bold text-white font-mono mt-1">
                      {(analytics.cartAdditions ?? analytics.totalCartAdds ?? 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-[#05070E] border border-gray-800 rounded-2xl p-4">
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                      <span>WhatsApp Checkouts</span>
                    </p>
                    <p className="text-xl font-bold text-amber-400 font-mono mt-1">
                      {(analytics.ordersInitiated ?? analytics.totalOrdersGenerated ?? 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Conversion Drop-off: Most Viewed vs Most Added */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#05070E] border border-gray-800 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Most Viewed Crackers</span>
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(analytics.productViews || {})
                        .sort(([, a], [, b]) => (b as number) - (a as number))
                        .slice(0, 6)
                        .map(([id, views]) => {
                          const prod = products.find((p) => p.id === id);
                          return (
                            <div key={id} className="flex items-center justify-between text-xs">
                              <span className="text-gray-300 truncate max-w-[200px]">
                                {prod ? prod.name : id}
                              </span>
                              <span className="font-mono text-gray-400 font-semibold">{views as number} views</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div className="bg-[#05070E] border border-gray-800 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Most Added to Cart (Conversion Leader)</span>
                    </h4>
                    <div className="space-y-2">
                      {Object.entries(analytics.productCartAdds || {})
                        .sort(([, a], [, b]) => (b as number) - (a as number))
                        .slice(0, 6)
                        .map(([id, adds]) => {
                          const prod = products.find((p) => p.id === id);
                          return (
                            <div key={id} className="flex items-center justify-between text-xs">
                              <span className="text-gray-300 truncate max-w-[200px]">
                                {prod ? prod.name : id}
                              </span>
                              <span className="font-mono text-emerald-400 font-semibold">{adds as number} adds</span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                {/* Peak Browsing Hours (Hourly Traffic Breakdown) */}
                <div className="bg-[#05070E] border border-gray-800 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Peak Browsing Hours (24-Hour Activity Breakdown)</span>
                  </h4>
                  <div className="grid grid-cols-12 gap-1 h-24 items-end pt-4">
                    {Array.from({ length: 24 }).map((_, h) => {
                      const hourly = analytics.hourlyTraffic || analytics.hourlyVisits || {};
                      const count = hourly[h] || 0;
                      const max = Math.max(...Object.values(hourly), 1);
                      const heightPercent = Math.max(8, Math.round((count / max) * 100));

                      return (
                        <div key={h} className="flex flex-col items-center gap-1 group relative">
                          <div
                            className="w-full bg-amber-500/70 group-hover:bg-amber-400 rounded-t transition-all"
                            style={{ height: `${heightPercent}%` }}
                          />
                          <span className="text-[9px] text-gray-500 font-mono">
                            {h % 4 === 0 ? `${h}h` : ''}
                          </span>

                          {/* Tooltip */}
                          <div className="absolute -top-7 bg-black text-[10px] text-amber-300 px-1.5 py-0.5 rounded border border-gray-700 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                            {h}:00 - {count} hits
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Printable Stall QR Code (Requirement 26) */}
            {activeTab === 'qr' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-center max-w-xl mx-auto">
                <div className="bg-[#05070E] border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
                    <QrCode className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white font-festive">
                      {settings.businessName}
                    </h3>
                    <p className="text-xs text-amber-300 mt-0.5 font-medium">
                      📍 {settings.stallLocation}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 max-w-sm mx-auto">
                      {isHi
                        ? 'इस QR कोड को प्रिंट करके अपने स्टॉल के काउंटर पर लगाएं। ग्राहक अपने फोन से स्कैन करके सीधे कैटलॉग देख सकेंगे।'
                        : 'Print and display this QR code at your stall counter so customers can scan and browse the entire digital catalog on their phones.'}
                    </p>
                  </div>

                  {qrCodeDataUrl ? (
                    <div className="inline-block p-4 bg-white rounded-2xl shadow-2xl border-4 border-amber-500">
                      <img
                        src={qrCodeDataUrl}
                        alt="Stall QR Code"
                        className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
                      />
                      <p className="text-[11px] font-bold text-black mt-2">
                        SCAN TO BROWSE &amp; ORDER
                      </p>
                    </div>
                  ) : (
                    <div className="w-56 h-56 bg-gray-900 animate-pulse mx-auto rounded-2xl" />
                  )}

                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handlePrintQr}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg transition-colors"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{isHi ? 'प्रिंट स्टॉल पोस्टर' : 'Print Stall Counter Poster'}</span>
                    </button>

                    {qrCodeDataUrl && (
                      <a
                        href={qrCodeDataUrl}
                        download="stall-diwali-qr.png"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 hover:text-white text-xs font-semibold transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PNG</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Store Settings */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettingsForm} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-w-2xl mx-auto">
                <div className="bg-[#05070E] border border-gray-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-amber-300 pb-2 border-b border-gray-800">
                    Business Profile &amp; WhatsApp Configuration
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Business Name (English)</label>
                      <input
                        type="text"
                        value={tempSettings.businessName}
                        onChange={(e) => setTempSettings({ ...tempSettings, businessName: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Business Name (Hindi)</label>
                      <input
                        type="text"
                        value={tempSettings.businessNameHindi || ''}
                        onChange={(e) => setTempSettings({ ...tempSettings, businessNameHindi: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">WhatsApp Phone (for Checkouts) *</label>
                      <input
                        type="text"
                        value={tempSettings.whatsappPhone}
                        onChange={(e) => setTempSettings({ ...tempSettings, whatsappPhone: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                        placeholder="+919876543210"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={tempSettings.contactPhone}
                        onChange={(e) => setTempSettings({ ...tempSettings, contactPhone: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Minimum Order Amount (₹)</label>
                      <input
                        type="number"
                        value={tempSettings.minOrderAmount}
                        onChange={(e) => setTempSettings({ ...tempSettings, minOrderAmount: Number(e.target.value) })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Diwali Countdown Date</label>
                      <input
                        type="date"
                        value={tempSettings.diwaliDate}
                        onChange={(e) => setTempSettings({ ...tempSettings, diwaliDate: e.target.value })}
                        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Stall Location / Landmark</label>
                    <input
                      type="text"
                      value={tempSettings.stallLocation}
                      onChange={(e) => setTempSettings({ ...tempSettings, stallLocation: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Stall Working Hours</label>
                    <input
                      type="text"
                      value={tempSettings.businessHours}
                      onChange={(e) => setTempSettings({ ...tempSettings, businessHours: e.target.value })}
                      className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>

                  {settingsSaved && (
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Settings successfully saved and live!</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-lg transition-colors"
                    >
                      Save Store Settings
                    </button>
                  </div>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
