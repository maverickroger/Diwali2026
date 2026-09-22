import React, { useState } from 'react';
import {
  Heart,
  Share2,
  Plus,
  Minus,
  ShoppingCart,
  Sparkles,
  Volume2,
  Package,
  Check,
} from 'lucide-react';
import { Product, ProductVariant, Language } from '../types';
import { fireCelebrationBurst } from '../utils/fireworks';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  language: Language;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  language,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>('piece');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const isHi = language === 'hi';

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
    const shareTitle = `${product.name} — Diwali Pataka Storefront`;
    const shareText = `Check out ${product.name} (₹${product.pricePerPiece}/pc, ₹${product.pricePerBox}/box) at our Diwali Stall!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    onAddToCart(product, selectedVariant, quantity);
    fireCelebrationBurst();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const soundBadgeColor =
    product.soundLevel === 'Low'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
      : product.soundLevel === 'Medium'
      ? 'bg-amber-50 text-amber-800 border-amber-100'
      : 'bg-red-50 text-red-700 border-red-100';

  const currentPrice =
    selectedVariant === 'piece' ? product.pricePerPiece : product.pricePerBox;

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white border border-gray-200/80 hover:border-amber-400/80 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col cursor-pointer"
    >
      {/* Top Media Container */}
      <div className="relative aspect-[4/3] w-full bg-gray-50 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Subtle light vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-black/10 pointer-events-none" />

        {/* Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm">
              <span>⭐</span> {isHi ? 'बेस्टसेलर' : 'Best Seller'}
            </span>
          )}
          {product.isNewThisYear && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500 text-white shadow-sm">
              <Sparkles className="w-2.5 h-2.5" /> {isHi ? 'नया 2026' : 'New This Year'}
            </span>
          )}
          {!product.inStock && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
              {isHi ? 'स्टॉक खत्म' : 'Out of Stock'}
            </span>
          )}
        </div>

        {/* Wishlist & Share buttons */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <button
            id={`share-btn-${product.id}`}
            onClick={handleShare}
            className="p-2 rounded-full bg-white/95 hover:bg-white text-gray-600 hover:text-amber-600 border border-gray-100 transition-colors shadow-sm"
            title={copiedLink ? 'Link Copied!' : 'Share Product'}
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          <button
            id={`wishlist-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className="p-2 rounded-full bg-white/95 hover:bg-white border border-gray-100 transition-colors shadow-sm"
            title="Wishlist"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            />
          </button>
        </div>

        {/* Sound Intensity Meter Badge */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${soundBadgeColor}`}
          >
            <Volume2 className="w-3 h-3" />
            <span>
              {isHi
                ? product.soundLevel === 'Low'
                  ? 'धीमी आवाज'
                  : product.soundLevel === 'Medium'
                  ? 'मध्यम आवाज'
                  : 'तेज धमाका'
                : `${product.soundLevel} Sound`}
            </span>
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1 font-festive">
                {isHi && product.nameHindi ? product.nameHindi : product.name}
              </h3>
              {isHi && product.nameHindi && (
                <p className="text-[11px] text-gray-500 font-sans">{product.name}</p>
              )}
            </div>
          </div>

          <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {isHi && product.shortDescriptionHindi ? product.shortDescriptionHindi : product.shortDescription}
          </p>
        </div>

        {/* Dual Pricing Display */}
        <div className="mt-3.5 pt-3 border-t border-gray-100">
          <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider mb-1.5">
            {isHi ? 'पारदर्शी मूल्य (दाम)' : 'Transparent Pricing'}
          </div>

          {/* Pricing Tabs / Selector */}
          <div className="grid grid-cols-2 gap-1.5 bg-gray-50 p-1 rounded-xl border border-gray-100">
            {/* Per Piece Option */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedVariant('piece');
              }}
              className={`p-1.5 rounded-lg text-left transition-all ${
                selectedVariant === 'piece'
                  ? 'bg-white border border-amber-300 text-amber-950 shadow-sm font-bold'
                  : 'text-gray-500 hover:text-gray-800 border border-transparent'
              }`}
            >
              <div className="text-[10px] font-medium">{isHi ? 'प्रति पीस' : 'Per Piece'}</div>
              <div className="text-xs sm:text-sm font-bold text-gray-900 font-mono">
                ₹{product.pricePerPiece}
              </div>
            </button>

            {/* Per Box Option */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedVariant('box');
              }}
              className={`p-1.5 rounded-lg text-left transition-all ${
                selectedVariant === 'box'
                  ? 'bg-white border border-amber-300 text-amber-950 shadow-sm font-bold'
                  : 'text-gray-500 hover:text-gray-800 border border-transparent'
              }`}
            >
              <div className="text-[10px] font-medium flex items-center justify-between">
                <span>{isHi ? 'प्रति डब्बा' : 'Per Box'}</span>
                <span className="text-[9px] text-amber-600 font-mono">({product.boxQuantity}pc)</span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-gray-900 font-mono">
                ₹{product.pricePerBox}
              </div>
            </button>
          </div>

          {/* Action Row: Quantity & Add to Cart */}
          <div className="mt-3 flex items-center gap-2">
            {/* Quantity Selector */}
            <div
              className="flex items-center bg-gray-50 border border-gray-100 rounded-xl p-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded-lg hover:bg-white transition-colors"
                title="Decrease"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-7 text-center text-xs font-mono font-bold text-gray-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded-lg hover:bg-white transition-colors"
                title="Increase"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              id={`add-to-cart-btn-${product.id}`}
              disabled={!product.inStock}
              onClick={handleAdd}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                !product.inStock
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  : justAdded
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm active:scale-95'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isHi ? 'कार्ट में जोड़ा!' : 'Added!'}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>
                    {product.inStock
                      ? `${isHi ? 'जोड़ें' : 'Add'} ₹${currentPrice * quantity}`
                      : isHi ? 'स्टॉक नहीं' : 'Sold Out'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
