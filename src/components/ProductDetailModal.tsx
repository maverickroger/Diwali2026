import React, { useState } from 'react';
import {
  X,
  Heart,
  Share2,
  Plus,
  Minus,
  ShoppingCart,
  ShieldCheck,
  Volume2,
  Sparkles,
  Check,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Product, ProductVariant, Language } from '../types';
import { fireCelebrationBurst } from '../utils/fireworks';

interface ProductDetailModalProps {
  product: Product | null;
  allProducts: Product[];
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  onClose: () => void;
  language: Language;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  allProducts,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onClose,
  language,
}) => {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>('piece');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  const isHi = language === 'hi';

  const relatedProducts = allProducts.filter((p) =>
    product.relatedProductIds?.includes(p.id)
  );

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
    const shareTitle = `${product.name} — Diwali Pataka Storefront`;
    const shareText = `Check out ${product.name} at our Diwali Stall! ₹${product.pricePerPiece}/pc or ₹${product.pricePerBox}/box.`;

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        return;
      } catch {
        // Fallback
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

  const handleAdd = () => {
    if (!product.inStock) return;
    onAddToCart(product, selectedVariant, quantity);
    fireCelebrationBurst();
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const currentPrice =
    selectedVariant === 'piece' ? product.pricePerPiece : product.pricePerBox;

  return (
    <div
      id="product-detail-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="product-detail-modal-content"
        className="relative w-full max-w-3xl bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl my-auto text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close & Share bar */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-gray-700 hover:text-amber-600 border border-gray-200 shadow-sm transition-colors"
            title={copiedLink ? 'Link Copied!' : 'Share Product Link'}
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onToggleWishlist(product.id)}
            className="p-2.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md border border-gray-200 shadow-sm transition-colors"
            title="Wishlist"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            />
          </button>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-gray-400 hover:text-gray-700 border border-gray-200 shadow-sm transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Product Artwork & Badges */}
          <div className="relative aspect-square md:aspect-auto bg-gray-50 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-200">
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[340px] w-auto object-contain rounded-2xl drop-shadow-md"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-1.5">
              {product.isBestSeller && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-sm">
                  ⭐ {isHi ? 'बेस्टसेलर' : 'Best Seller'}
                </span>
              )}
              {product.isNewThisYear && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500 text-white shadow-sm">
                  ✨ {isHi ? 'नया 2026' : 'New This Year'}
                </span>
              )}
              {!product.inStock && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                  {isHi ? 'स्टॉक समाप्त' : 'Out of Stock'}
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Green PESO
              </span>
            </div>
          </div>

          {/* Right: Product Details & Buying Controls */}
          <div className="p-6 flex flex-col justify-between space-y-5 bg-white">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-700 font-bold uppercase tracking-wider">
                <span>{product.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  {product.soundLevel} Sound
                </span>
              </div>

              <h2 className="mt-1 text-2xl font-bold text-gray-950 font-festive">
                {isHi && product.nameHindi ? product.nameHindi : product.name}
              </h2>
              {isHi && product.nameHindi && (
                <p className="text-xs text-gray-500">{product.name}</p>
              )}

              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {isHi && product.shortDescriptionHindi
                  ? product.shortDescriptionHindi
                  : product.shortDescription}
              </p>

              {/* Safety & Handling Tip */}
              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2 leading-relaxed">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-800">
                    {isHi ? 'सुरक्षा दिशानिर्देश:' : 'Safety Protocol:'}
                  </span>{' '}
                  {isHi
                    ? 'खुले मैदान में जलाएं। पास में पानी की बाल्टी रखें। बच्चों को बड़ों की निगरानी में ही पटाखा जलाने दें।'
                    : 'Ignite in open outdoor space with a long agarbatti. Keep a bucket of water/sand nearby. Supervise children.'}
                </div>
              </div>

              {/* Dual Pricing Selector */}
              <div className="mt-5 space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  {isHi ? 'पैकिंग विकल्प चुनें:' : 'Select Purchase Unit:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedVariant('piece')}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      selectedVariant === 'piece'
                        ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm font-bold'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xs text-gray-400 font-medium">
                      {isHi ? 'प्रति पीस (Single)' : 'Per Piece (Loose)'}
                    </div>
                    <div className="text-lg font-bold text-gray-900 font-mono mt-0.5">
                      ₹{product.pricePerPiece}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedVariant('box')}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      selectedVariant === 'box'
                        ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm font-bold'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xs text-gray-400 font-medium flex items-center justify-between">
                      <span>{isHi ? 'पूरा डब्बा (Box)' : 'Full Box'}</span>
                      <span className="text-[10px] text-amber-600 font-mono font-bold">
                        ({product.boxQuantity} pcs)
                      </span>
                    </div>
                    <div className="text-lg font-bold text-gray-900 font-mono mt-0.5">
                      ₹{product.pricePerBox}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions: Quantity & Add */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded-lg hover:bg-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-mono font-bold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded-lg hover:bg-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  id="detail-modal-add-to-cart-btn"
                  disabled={!product.inStock}
                  onClick={handleAdd}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-sm ${
                    !product.inStock
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                      : justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isHi ? 'कार्ट में जोड़ दिया गया!' : 'Added to Cart!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>
                        {product.inStock
                          ? `${isHi ? 'कार्ट में जोड़ें' : 'Add to WhatsApp Cart'} • ₹${currentPrice * quantity}`
                          : isHi ? 'स्टॉक में नहीं' : 'Sold Out'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Explicit Wishlist Toggle Button */}
              <button
                type="button"
                id="detail-modal-wishlist-toggle-btn"
                onClick={() => onToggleWishlist(product.id)}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100/60'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                <span>
                  {isWishlisted
                    ? isHi
                      ? '✓ आपकी पसंदीदा सूची में सुरक्षित (क्लिक करके हटाएं)'
                      : '✓ In Your Wishlist (Click to remove)'
                    : isHi
                    ? 'पसंदीदा सूची में जोड़ें (Add to Wishlist)'
                    : 'Add to Personal Wishlist'}
                </span>
              </button>

              {/* Related Items ("Pairs Well With") */}
              {relatedProducts.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isHi ? 'इसके साथ और क्या लें (Pairs Well With):' : 'Pairs Well With (Stall Recommendations):'}</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {relatedProducts.slice(0, 3).map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => onSelectProduct(rel)}
                        className="bg-white hover:bg-gray-50 border border-gray-200 hover:border-amber-300 p-2 rounded-xl cursor-pointer transition-colors flex items-center gap-2 group shadow-sm"
                      >
                        <img
                          src={rel.image}
                          alt={rel.name}
                          className="w-8 h-8 rounded-lg object-cover bg-gray-50"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold text-gray-800 truncate group-hover:text-amber-800">
                            {isHi && rel.nameHindi ? rel.nameHindi : rel.name}
                          </p>
                          <p className="text-[10px] text-amber-700 font-mono font-bold">
                            ₹{rel.pricePerPiece}/pc
                          </p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-amber-500 shrink-0 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
