import React, { useState } from 'react';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Share2,
  ArrowLeft,
  Sparkles,
  Check,
  Package,
  Volume2,
  Plus,
  Minus,
} from 'lucide-react';
import { Product, ProductVariant, Language } from '../types';
import { fireCelebrationBurst } from '../utils/fireworks';
import { createWhatsAppUrl } from '../utils/whatsapp';

interface WishlistPageProps {
  wishlistIds: string[];
  products: Product[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  onBackToStore: () => void;
  language: Language;
  stallPhone: string;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  wishlistIds,
  products,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onBackToStore,
  language,
  stallPhone,
}) => {
  const isHi = language === 'hi';
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  // Local state for each card's selected variant & quantity
  const [selectedVariants, setSelectedVariants] = useState<Record<string, ProductVariant>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const getVariant = (id: string): ProductVariant => selectedVariants[id] || 'piece';
  const getQty = (id: string): number => quantities[id] || 1;

  const handleVariantChange = (id: string, variant: ProductVariant) => {
    setSelectedVariants((prev) => ({ ...prev, [id]: variant }));
  };

  const handleQtyChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      return { ...prev, [id]: Math.max(1, current + delta) };
    });
  };

  const handleAddSingle = (p: Product) => {
    if (!p.inStock) return;
    const variant = getVariant(p.id);
    const qty = getQty(p.id);
    onAddToCart(p, variant, qty);
    fireCelebrationBurst();
    setRecentlyAddedId(p.id);
    setTimeout(() => setRecentlyAddedId(null), 1500);
  };

  const handleAddAllToCart = () => {
    const available = wishlistedProducts.filter((p) => p.inStock);
    if (available.length === 0) return;

    available.forEach((p) => {
      const variant = getVariant(p.id);
      const qty = getQty(p.id);
      onAddToCart(p, variant, qty);
    });
    fireCelebrationBurst();
  };

  const handleClearWishlist = () => {
    if (window.confirm(isHi ? 'क्या आप पूरी पसंदीदा सूची खाली करना चाहते हैं?' : 'Are you sure you want to clear your entire wishlist?')) {
      wishlistedProducts.forEach((p) => onToggleWishlist(p.id));
    }
  };

  const handleShareWishlistWhatsApp = () => {
    if (wishlistedProducts.length === 0) return;
    const lines: string[] = [
      `🪔 *${isHi ? 'मेरी दिवाली पटाखों की विशलिस्ट' : 'My Diwali Firecracker Wishlist'}* 🪔`,
      `✨ ${isHi ? 'मेरे द्वारा चुने गए पसंदीदा पटाखे:' : 'Handpicked Diwali Crackers:'}`,
      '────────────────────────',
    ];

    wishlistedProducts.forEach((p, idx) => {
      const name = isHi && p.nameHindi ? p.nameHindi : p.name;
      lines.push(`${idx + 1}. *${name}* - ₹${p.pricePerPiece}/pc (₹${p.pricePerBox}/box)`);
    });

    lines.push('────────────────────────');
    lines.push(`Total Items: ${wishlistedProducts.length}`);
    lines.push(`Check them out at our Diwali Storefront! 🎆`);

    const shareMessage = lines.join('\n');
    const shareUrl = createWhatsAppUrl(stallPhone, shareMessage);
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  // Calculate estimated total value of wishlisted items (summing 1 piece each)
  const estimatedPieceTotal = wishlistedProducts.reduce((sum, p) => sum + p.pricePerPiece, 0);
  const estimatedBoxTotal = wishlistedProducts.reduce((sum, p) => sum + p.pricePerBox, 0);

  return (
    <div id="dedicated-wishlist-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Breadcrumb / Back button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          id="wishlist-back-to-store-btn"
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors py-1 px-3 rounded-lg hover:bg-amber-500/10 border border-amber-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isHi ? '← मुख्य स्टोर पर वापस जाएं' : '← Back to Storefront Catalog'}</span>
        </button>

        <span className="text-[11px] text-gray-500 hidden sm:inline">
          {isHi ? 'ब्राउज़र लोकल स्टोरेज में सुरक्षित' : 'Persisted in Browser Local Storage'}
        </span>
      </div>

      {/* Page Hero / Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-red-950/40 via-[#0A0F1D] to-amber-950/40 border border-amber-500/25 p-6 sm:p-8 mb-8 overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold">
              <Heart className="w-3.5 h-3.5 fill-red-400" />
              <span>{isHi ? 'पर्सनल विशलिस्ट' : 'Personal Wishlist'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-festive tracking-tight">
              {isHi ? 'आपकी पसंदीदा दिवाली पटाखे सूची' : 'Your Diwali Fireworks Wishlist'}
            </h1>
            <p className="text-sm text-gray-300 max-w-xl leading-relaxed">
              {isHi
                ? 'आपके द्वारा सेव किए गए सभी पसंदीदा पटाखे यहां सुरक्षित हैं। आप सीधे यहां से सब कार्ट में जोड़ सकते हैं या व्हाट्सएप पर शेयर कर सकते हैं।'
                : 'All your favorite saved crackers stored in your browser. Move items directly to your WhatsApp cart or share your wishlist with friends & family.'}
            </p>
          </div>

          {/* Statistics summary card */}
          {wishlistedProducts.length > 0 && (
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-[#060913]/90 border border-gray-800 rounded-2xl p-4 shrink-0 shadow-lg">
              <div className="pr-4 border-r border-gray-800 text-center">
                <span className="text-xs text-gray-400 block font-medium">{isHi ? 'कुल पटाखे' : 'Saved Items'}</span>
                <span className="text-2xl font-extrabold text-white font-mono">{wishlistedProducts.length}</span>
              </div>
              <div className="pl-2">
                <span className="text-[11px] text-gray-400 block">{isHi ? 'अनुमानित मूल्य (Pieces):' : 'Est. Value (Pieces):'}</span>
                <span className="text-base font-bold text-amber-400 font-mono">₹{estimatedPieceTotal.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-gray-500 block">
                  (₹{estimatedBoxTotal.toLocaleString('en-IN')} {isHi ? 'यदि सभी डिब्बे लें' : 'if all boxes'})
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Bar */}
        {wishlistedProducts.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-800/80 flex flex-wrap items-center gap-3">
            <button
              id="wishlist-add-all-btn"
              onClick={handleAddAllToCart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isHi ? 'सभी उपलब्ध पटाखे कार्ट में जोड़ें' : 'Add All In-Stock to Cart'}</span>
            </button>

            <button
              id="wishlist-share-whatsapp-btn"
              onClick={handleShareWishlistWhatsApp}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-semibold text-xs sm:text-sm transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{isHi ? 'व्हाट्सएप पर शेयर करें' : 'Share Wishlist on WhatsApp'}</span>
            </button>

            <button
              id="wishlist-clear-btn"
              onClick={handleClearWishlist}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs font-medium ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isHi ? 'पूरी सूची हटाएं' : 'Clear Wishlist'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content: Products Grid or Empty State */}
      {wishlistedProducts.length === 0 ? (
        <div className="py-16 px-4 text-center rounded-3xl bg-[#090E1B] border border-gray-800 max-w-2xl mx-auto space-y-5">
          <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 text-red-400 flex items-center justify-center text-4xl shadow-inner">
            🤍
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-festive">
              {isHi ? 'आपकी पसंदीदा सूची खाली है' : 'Your Wishlist is Currently Empty'}
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
              {isHi
                ? 'कैटलॉग में किसी भी पटाखे के ऊपर बने दिल (❤️) के निशान पर क्लिक करें। वे यहां आपके ब्राउज़र में हमेशा सेव रहेंगे।'
                : 'Browse our 23+ authentic Diwali firecrackers. Tap the heart icon (❤️) on any cracker card or detail modal to save it here for later reference.'}
            </p>
          </div>

          <div className="pt-2">
            <button
              id="empty-wishlist-browse-btn"
              onClick={onBackToStore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isHi ? 'पटाखा कैटलॉग देखें' : 'Explore Pataka Catalog'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {wishlistedProducts.map((p) => {
            const variant = getVariant(p.id);
            const qty = getQty(p.id);
            const currentPrice = variant === 'piece' ? p.pricePerPiece : p.pricePerBox;
            const isJustAdded = recentlyAddedId === p.id;

            return (
              <div
                key={p.id}
                id={`wishlist-item-${p.id}`}
                className="bg-[#090E1B] border border-gray-800 hover:border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 shadow-lg hover:shadow-amber-500/10 group"
              >
                <div>
                  {/* Image & Quick Remove */}
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-[#05070E] mb-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      onClick={() => onSelectProduct(p)}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Remove button */}
                    <button
                      id={`wishlist-remove-btn-${p.id}`}
                      onClick={() => onToggleWishlist(p.id)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-black/70 hover:bg-black text-red-400 hover:text-red-300 border border-white/10 transition-colors shadow-md"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Stock / Best Seller Badge */}
                    <div className="absolute bottom-2 left-2 flex gap-1">
                      {p.isBestSeller && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                          ⭐ Best Seller
                        </span>
                      )}
                      {!p.inStock && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Sound */}
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h3
                        onClick={() => onSelectProduct(p)}
                        className="font-bold text-sm text-white font-festive hover:text-amber-400 cursor-pointer line-clamp-1"
                      >
                        {isHi && p.nameHindi ? p.nameHindi : p.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 line-clamp-1">
                        {isHi && p.shortDescriptionHindi ? p.shortDescriptionHindi : p.shortDescription}
                      </p>
                    </div>

                    <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                      {p.soundLevel}
                    </span>
                  </div>

                  {/* Variant Selector Pill */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#05070E] rounded-xl border border-gray-800 mb-3 mt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleVariantChange(p.id, 'piece')}
                      className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
                        variant === 'piece'
                          ? 'bg-amber-500 text-black font-bold shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>{isHi ? 'पीस' : 'Piece'}</span>
                      <span className="block font-mono text-[11px]">₹{p.pricePerPiece}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleVariantChange(p.id, 'box')}
                      className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
                        variant === 'box'
                          ? 'bg-amber-500 text-black font-bold shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>{isHi ? 'डब्बा' : 'Box'}</span>
                      <span className="block font-mono text-[11px]">₹{p.pricePerBox}</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Quantity & Add to Cart button */}
                <div className="pt-2 border-t border-gray-800/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium">{isHi ? 'मात्रा:' : 'Qty:'}</span>
                    <div className="flex items-center bg-[#05070E] border border-gray-800 rounded-lg p-0.5">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(p.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="w-7 text-center font-mono font-bold text-white text-xs">{qty}</span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(p.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <span className="font-mono font-bold text-amber-300">
                      ₹{currentPrice * qty}
                    </span>
                  </div>

                  <button
                    type="button"
                    id={`wishlist-add-cart-btn-${p.id}`}
                    disabled={!p.inStock}
                    onClick={() => handleAddSingle(p)}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md ${
                      !p.inStock
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        : isJustAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 hover:bg-amber-400 text-black active:scale-95'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{isHi ? 'कार्ट में जोड़ा!' : 'Added to Cart!'}</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>
                          {p.inStock
                            ? isHi
                              ? 'कार्ट में जोड़ें'
                              : 'Add to Cart'
                            : isHi
                            ? 'स्टॉक खत्म'
                            : 'Sold Out'}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
