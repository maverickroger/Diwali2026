import React from 'react';
import { X, Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Product, ProductVariant, Language } from '../types';
import { fireCelebrationBurst } from '../utils/fireworks';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  language: Language;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onToggleWishlist,
  onAddToCart,
  language,
}) => {
  if (!isOpen) return null;

  const isHi = language === 'hi';
  const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));

  const handleAddAllToCart = () => {
    wishlistedProducts.forEach((p) => {
      if (p.inStock) {
        onAddToCart(p, 'piece', 1);
      }
    });
    fireCelebrationBurst();
  };

  return (
    <div
      id="wishlist-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        id="wishlist-drawer-panel"
        className="w-full max-w-md bg-white border-l border-gray-100 h-full flex flex-col shadow-2xl text-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-red-500" />
            </div>
            <div>
              <h2 className="font-bold text-base text-gray-950 font-festive flex items-center gap-2">
                <span>{isHi ? 'आपकी पसंदीदा सूची' : 'Your Wishlist'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700 font-mono font-bold">
                  {wishlistedProducts.length}
                </span>
              </h2>
              <p className="text-[11px] text-gray-500">
                {isHi ? 'ब्राउज़र में सुरक्षित, कोई लॉगिन आवश्यक नहीं' : 'Locally saved in your browser'}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {wishlistedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-3xl shadow-sm">
                🤍
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 font-festive">
                  {isHi ? 'पसंदीदा सूची अभी खाली है' : 'Your wishlist is empty'}
                </h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                  {isHi
                    ? 'पटाखों पर दिए गए दिल के निशान पर क्लिक करके उन्हें बाद के लिए सेव करें।'
                    : 'Tap the heart icon on any cracker to save it here for later.'}
                </p>
              </div>
            </div>
          ) : (
            wishlistedProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white border border-gray-200/80 rounded-2xl p-3 flex items-center gap-3 transition-colors hover:border-amber-300 shadow-sm"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-14 h-14 rounded-xl object-cover bg-gray-50 shrink-0 border border-gray-100"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate font-festive">
                      {isHi && p.nameHindi ? p.nameHindi : p.name}
                    </h4>
                    <button
                      onClick={() => onToggleWishlist(p.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-xs font-mono text-amber-700 font-bold mt-0.5">
                    ₹{p.pricePerPiece} / pc • ₹{p.pricePerBox} / box
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">
                      {p.soundLevel} Sound
                    </span>

                    <button
                      onClick={() => {
                        onAddToCart(p, 'piece', 1);
                        fireCelebrationBurst();
                      }}
                      disabled={!p.inStock}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>{isHi ? 'कार्ट में डालें' : 'Add to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {wishlistedProducts.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-white">
            <button
              onClick={handleAddAllToCart}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-sm active:scale-98 transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{isHi ? 'सभी को कार्ट में डालें' : 'Add All to Cart'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
