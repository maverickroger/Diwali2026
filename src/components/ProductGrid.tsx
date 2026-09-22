import React from 'react';
import { Product, ProductVariant, Language } from '../types';
import { ProductCard } from './ProductCard';
import { Sparkles, RefreshCw } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  wishlistIds: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onSelectProduct: (product: Product) => void;
  onResetFilters: () => void;
  language: Language;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onResetFilters,
  language,
}) => {
  const isHi = language === 'hi';

  if (products.length === 0) {
    return (
      <div
        id="empty-product-grid"
        className="bg-[#090E1B] border border-gray-800 rounded-3xl p-12 text-center max-w-lg mx-auto my-12"
      >
        <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center text-3xl mb-4">
          ✨
        </div>
        <h3 className="text-lg font-bold text-white font-festive">
          {isHi ? 'कोई पटाखा नहीं मिला' : 'No Crackers Match Your Filters'}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-gray-400">
          {isHi
            ? 'कृपया फिल्टर बदलकर देखें या सर्च शब्द साफ करें।'
            : 'Try broadening your search or resetting sound and category filters.'}
        </p>
        <button
          onClick={onResetFilters}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{isHi ? 'सभी फिल्टर हटाएं' : 'Reset All Filters'}</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="product-catalog-grid"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isWishlisted={wishlistIds.includes(product.id)}
          onToggleWishlist={onToggleWishlist}
          onAddToCart={onAddToCart}
          onSelectProduct={onSelectProduct}
          language={language}
        />
      ))}
    </div>
  );
};
