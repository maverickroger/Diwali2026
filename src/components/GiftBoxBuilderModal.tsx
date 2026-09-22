import React, { useState } from 'react';
import { X, Gift, Plus, Minus, Check, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';
import { Product, ProductVariant, Language, CartItem } from '../types';
import { fireCelebrationBurst } from '../utils/fireworks';

interface GiftBoxItemEntry {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface GiftBoxBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddCustomBundleToCart: (bundleItem: CartItem) => void;
  language: Language;
}

export const GiftBoxBuilderModal: React.FC<GiftBoxBuilderModalProps> = ({
  isOpen,
  onClose,
  products,
  onAddCustomBundleToCart,
  language,
}) => {
  if (!isOpen) return null;

  const isHi = language === 'hi';

  const [targetBudget, setTargetBudget] = useState<number>(2500);
  const [customBudgetInput, setCustomBudgetInput] = useState<string>('');
  const [boxName, setBoxName] = useState<string>(isHi ? 'पारिवारिक दिवाली गिफ्ट बॉक्स' : 'Family Diwali Hamper');
  const [selectedItems, setSelectedItems] = useState<Record<string, GiftBoxItemEntry>>({});

  const presetBudgets = [1000, 2000, 3000, 5000];

  const handleUpdateItem = (product: Product, variant: ProductVariant, delta: number) => {
    const key = `${product.id}-${variant}`;
    const existing = selectedItems[key];
    const currentQty = existing ? existing.quantity : 0;
    const nextQty = currentQty + delta;

    const next = { ...selectedItems };
    if (nextQty <= 0) {
      delete next[key];
    } else {
      next[key] = {
        product,
        variant,
        quantity: nextQty,
      };
    }
    setSelectedItems(next);
  };

  const currentTotal = Object.values(selectedItems).reduce((sum, entry) => {
    const price = entry.variant === 'piece' ? entry.product.pricePerPiece : entry.product.pricePerBox;
    return sum + price * entry.quantity;
  }, 0);

  const budgetDifference = targetBudget - currentTotal;
  const progressPercent = Math.min(100, Math.round((currentTotal / targetBudget) * 100));

  const handleAddBundleToCart = () => {
    const itemsList = Object.values(selectedItems);
    if (itemsList.length === 0) return;

    // Detailed description of contents
    const detailedDescription = itemsList
      .map(
        (i) =>
          `${i.quantity}x ${i.product.name} (${i.variant === 'box' ? `Box of ${i.product.boxQuantity}` : 'Piece'} @ ₹${i.variant === 'piece' ? i.product.pricePerPiece : i.product.pricePerBox})`
      )
      .join(', ');

    const bundleCartItem: CartItem = {
      id: `giftbox-${Date.now()}`,
      productId: 'custom-gift-box',
      productName: 'Custom Gift Box',
      productNameHindi: 'कस्टम गिफ्ट बॉक्स',
      variant: 'box',
      quantity: 1,
      unitPrice: currentTotal,
      boxQuantity: itemsList.reduce((acc, i) => acc + i.quantity, 0),
      image: itemsList[0]?.product.image || products[0]?.image || '',
      description: `Includes: ${detailedDescription}`,
      isGiftBox: true,
      boxName: boxName.trim() || 'Custom Gift Box',
      giftBoxContents: itemsList.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        variant: i.variant,
        quantity: i.quantity,
        unitPrice: i.variant === 'piece' ? i.product.pricePerPiece : i.product.pricePerBox,
      })),
    };

    onAddCustomBundleToCart(bundleCartItem);
    fireCelebrationBurst();
    onClose();
  };

  return (
    <div
      id="gift-box-builder-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="gift-box-builder-modal-content"
        className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl my-auto text-gray-900 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm border border-amber-100">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 font-festive flex items-center gap-2">
                <span>{isHi ? 'अपना खुद का गिफ्ट बॉक्स तैयार करें' : 'Build Your Own Diwali Gift Box'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-sans font-bold">
                  Custom Hamper
                </span>
              </h2>
              <p className="text-xs text-gray-500">
                {isHi
                  ? 'अपना बजट चुनें, पटाखे चुनें और पूरे परिवार के लिए एक खास पैक बनाएं!'
                  : 'Pick your budget, hand-select your favorite crackers, and add as one custom box.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Budget & Box Name Controls Bar */}
        <div className="p-4 sm:p-5 bg-gray-50 border-b border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Target Budget Selector */}
          <div>
            <label className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1.5">
              {isHi ? '1. लक्षित बजट (Target Budget):' : '1. Choose Target Budget:'}
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {presetBudgets.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setTargetBudget(b);
                    setCustomBudgetInput('');
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all border ${
                    targetBudget === b
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  ₹{b}
                </button>
              ))}

              <input
                type="number"
                placeholder={isHi ? 'कस्टम ₹' : 'Custom ₹'}
                value={customBudgetInput}
                onChange={(e) => {
                  setCustomBudgetInput(e.target.value);
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val) && val > 0) {
                    setTargetBudget(val);
                  }
                }}
                className="w-24 bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          {/* Custom Hamper Name */}
          <div>
            <label className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1.5">
              {isHi ? '2. गिफ्ट बॉक्स का नाम (Box Label):' : '2. Name Your Gift Box:'}
            </label>
            <input
              type="text"
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
              placeholder="e.g. Sharma Family Grand Hamper"
              className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Live Budget Progress Bar */}
        <div className="px-4 sm:px-6 py-3 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-1">
            <span className="text-gray-600 flex items-center gap-1.5">
              <span>{isHi ? 'वर्तमान बॉक्स मूल्य:' : 'Box Value:'}</span>
              <strong className="text-amber-700 font-mono text-sm">₹{currentTotal}</strong>
              <span className="text-gray-400">/ ₹{targetBudget}</span>
            </span>

            {budgetDifference >= 0 ? (
              <span className="text-emerald-600 font-mono text-xs font-bold">
                ₹{budgetDifference} {isHi ? 'बजट शेष' : 'remaining'}
              </span>
            ) : (
              <span className="text-amber-700 font-mono text-xs font-bold">
                +₹{Math.abs(budgetDifference)} {isHi ? 'बजट से अधिक' : 'over budget'}
              </span>
            )}
          </div>

          <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                progressPercent > 100 ? 'bg-amber-500' : 'bg-gradient-to-r from-emerald-500 to-amber-500'
              }`}
              style={{ width: `${Math.min(100, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Product Selection Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-gray-50">
          {products.map((prod) => {
            const pieceKey = `${prod.id}-piece`;
            const boxKey = `${prod.id}-box`;
            const pieceQty = selectedItems[pieceKey]?.quantity || 0;
            const boxQty = selectedItems[boxKey]?.quantity || 0;

            return (
              <div
                key={prod.id}
                className="bg-white border border-gray-200 rounded-2xl p-3 flex flex-col justify-between hover:border-amber-300 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-12 h-12 rounded-xl object-cover bg-gray-50 shrink-0 border border-gray-100"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-gray-950 truncate font-festive">
                      {isHi && prod.nameHindi ? prod.nameHindi : prod.name}
                    </h4>
                    <span className="text-[10px] text-amber-700 uppercase font-semibold">
                      {prod.category} • {prod.soundLevel}
                    </span>
                  </div>
                </div>

                {/* Select Pieces or Boxes */}
                <div className="mt-3 space-y-1.5 pt-2 border-t border-gray-100">
                  {/* Single Piece Counter */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 text-[11px]">
                      Piece (₹{prod.pricePerPiece})
                    </span>
                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateItem(prod, 'piece', -1)}
                        className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded hover:bg-white transition-colors"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold text-gray-800">
                        {pieceQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateItem(prod, 'piece', 1)}
                        className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded hover:bg-white transition-colors"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  {/* Full Box Counter */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 text-[11px]">
                      Box ({prod.boxQuantity}pc, ₹{prod.pricePerBox})
                    </span>
                    <div className="flex items-center bg-gray-50 border border-gray-100 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateItem(prod, 'box', -1)}
                        className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded hover:bg-white transition-colors"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-bold text-gray-800">
                        {boxQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateItem(prod, 'box', 1)}
                        className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded hover:bg-white transition-colors"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs text-gray-400">
              {Object.keys(selectedItems).length} {isHi ? 'किस्में चुनी गईं' : 'cracker types in box'}
            </div>
            <div className="text-lg font-bold text-amber-700 font-mono">
              ₹{currentTotal.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>

            <button
              id="add-gift-bundle-to-cart-btn"
              onClick={handleAddBundleToCart}
              disabled={Object.keys(selectedItems).length === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                Object.keys(selectedItems).length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>
                {isHi
                  ? `गिफ्ट बॉक्स कार्ट में जोड़ें (₹${currentTotal})`
                  : `Add Custom Box to Cart (₹${currentTotal})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
