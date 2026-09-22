import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Product,
  CartItem,
  SiteSettings,
  AnalyticsData,
  Language,
  ProductVariant,
  SoundLevel,
} from './types';
import {
  loadProducts,
  saveProducts,
  loadSettings,
  saveSettings,
  loadCart,
  saveCart,
  addToCartStorage,
  updateCartItemQuantityStorage,
  removeCartItemStorage,
  clearCartStorage,
  loadWishlist,
  toggleWishlistStorage,
  loadAnalytics,
  recordPageView,
  recordProductView,
  recordCartAdd,
} from './services/storage';
import { seedCategories } from './data/seedProducts';
import { FestiveBanner } from './components/FestiveBanner';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilter } from './components/CategoryFilter';
import { FilterSortBar, SortOption } from './components/FilterSortBar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { GiftBoxBuilderModal } from './components/GiftBoxBuilderModal';
import { SurpriseMeModal } from './components/SurpriseMeModal';
import { StallTrustSection } from './components/StallTrustSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';

export default function App() {
  // Core Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(loadSettings());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>(loadAnalytics());

  // Preferences & Localization
  const [language, setLanguage] = useState<Language>('en');
  const [isFestiveMode, setIsFestiveMode] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<'catalog' | 'wishlist'>('catalog');

  // Filters & Sorting
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSound, setSelectedSound] = useState<SoundLevel | 'all'>('all');
  const [onlyBestSellers, setOnlyBestSellers] = useState<boolean>(false);
  const [onlyNew, setOnlyNew] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [sortOption, setSortOption] = useState<SortOption>('featured');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isGiftBoxOpen, setIsGiftBoxOpen] = useState<boolean>(false);
  const [isSurpriseMeOpen, setIsSurpriseMeOpen] = useState<boolean>(false);

  const catalogRef = useRef<HTMLDivElement>(null);

  // Initialize Data
  useEffect(() => {
    const loadedProds = loadProducts();
    setProducts(loadedProds);
    setCart(loadCart());
    setWishlist(loadWishlist());
    setAnalytics(loadAnalytics());

    // Record page view analytics
    recordPageView();

    // Check URL parameters for direct product link (?product=xyz)
    const urlParams = new URLSearchParams(window.location.search);
    const productIdFromUrl = urlParams.get('product');
    if (productIdFromUrl) {
      const match = loadedProds.find((p: Product) => p.id === productIdFromUrl);
      if (match) {
        setSelectedProduct(match);
        recordProductView(match.id);
      }
    }

    // Auto-detect seasonal theme based on date (Diwali season = Oct - Nov)
    const now = new Date();
    const currentMonth = now.getMonth(); // 9 = Oct, 10 = Nov
    if (currentMonth === 9 || currentMonth === 10) {
      setIsFestiveMode(true);
    }
  }, []);

  // Sync cart running totals
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Handle Add to Cart
  const handleAddToCart = (product: Product, variant: ProductVariant, quantity: number) => {
    const updated = addToCartStorage(product, variant, quantity);
    setCart(updated);
    recordCartAdd(product.id);
    setAnalytics(loadAnalytics());
  };

  // Handle Custom Bundle (Gift Box or Surprise Me) Added to Cart
  const handleAddCustomBundleToCart = (bundleItem: CartItem) => {
    const current = loadCart();
    const updated = [...current, bundleItem];
    saveCart(updated);
    setCart(updated);
  };

  // Update Cart Quantity
  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    const updated = updateCartItemQuantityStorage(cartItemId, delta);
    setCart(updated);
  };

  // Remove Cart Item
  const handleRemoveCartItem = (cartItemId: string) => {
    const updated = removeCartItemStorage(cartItemId);
    setCart(updated);
  };

  // Clear Cart
  const handleClearCart = () => {
    clearCartStorage();
    setCart([]);
  };

  // Toggle Wishlist
  const handleToggleWishlist = (productId: string) => {
    const updated = toggleWishlistStorage(productId);
    setWishlist(updated);
  };

  // View Product Detail
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    recordProductView(product.id);
    setAnalytics(loadAnalytics());

    // Update URL query string smoothly without reload
    const newUrl = `${window.location.pathname}?product=${product.id}`;
    window.history.replaceState({ path: newUrl }, '', newUrl);
  };

  // Close Product Detail
  const handleCloseProductModal = () => {
    setSelectedProduct(null);
    window.history.replaceState({}, '', window.location.pathname);
  };

  // Admin: Save Product
  const handleSaveProduct = (product: Product) => {
    const existingIndex = products.findIndex((p) => p.id === product.id);
    let updated: Product[];
    if (existingIndex >= 0) {
      updated = [...products];
      updated[existingIndex] = product;
    } else {
      updated = [product, ...products];
    }
    setProducts(updated);
    saveProducts(updated);
  };

  // Admin: Delete Product
  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    setProducts(updated);
    saveProducts(updated);
  };

  // Admin: Duplicate Product (Requirement 16)
  const handleDuplicateProduct = (product: Product) => {
    const duplicate: Product = {
      ...product,
      id: `pataka-${Date.now()}`,
      name: `${product.name} (Copy)`,
      nameHindi: product.nameHindi ? `${product.nameHindi} (कॉपी)` : '',
      isNewThisYear: true,
      viewCount: 0,
      cartAddCount: 0,
    };
    const updated = [duplicate, ...products];
    setProducts(updated);
    saveProducts(updated);
  };

  // Admin: Bulk Update Prices (Requirement 17)
  const handleBulkUpdatePrices = (percentage: number, categoryId = 'all') => {
    const multiplier = 1 + percentage / 100;
    const updated = products.map((p) => {
      if (categoryId === 'all' || p.category === categoryId) {
        return {
          ...p,
          pricePerPiece: Math.max(1, Math.round(p.pricePerPiece * multiplier)),
          pricePerBox: Math.max(5, Math.round(p.pricePerBox * multiplier)),
        };
      }
      return p;
    });
    setProducts(updated);
    saveProducts(updated);
  };

  // Admin: Update Settings
  const handleUpdateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Scroll to catalog
  const handleScrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Wishlist view filter
    if (currentView === 'wishlist') {
      result = result.filter((p) => wishlist.includes(p.id));
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameHindi?.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.shortDescriptionHindi?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sound level filter
    if (selectedSound !== 'all') {
      result = result.filter((p) => p.soundLevel === selectedSound);
    }

    // Toggles
    if (onlyBestSellers) {
      result = result.filter((p) => p.isBestSeller);
    }
    if (onlyNew) {
      result = result.filter((p) => p.isNewThisYear);
    }
    if (onlyInStock) {
      result = result.filter((p) => p.inStock);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.pricePerPiece - b.pricePerPiece;
        case 'price-desc':
          return b.pricePerPiece - a.pricePerPiece;
        case 'sound-asc': {
          const soundWeight = { Low: 1, Medium: 2, High: 3 };
          return soundWeight[a.soundLevel] - soundWeight[b.soundLevel];
        }
        case 'sound-desc': {
          const soundWeight = { Low: 1, Medium: 2, High: 3 };
          return soundWeight[b.soundLevel] - soundWeight[a.soundLevel];
        }
        case 'popular':
          return (b.cartAddCount || 0) + (b.viewCount || 0) - ((a.cartAddCount || 0) + (a.viewCount || 0));
        case 'featured':
        default:
          // Best sellers first, then available stock, then new
          if (a.isBestSeller && !b.isBestSeller) return -1;
          if (!a.isBestSeller && b.isBestSeller) return 1;
          if (a.inStock && !b.inStock) return -1;
          if (!a.inStock && b.inStock) return 1;
          return 0;
      }
    });

    return result;
  }, [
    products,
    selectedCategory,
    searchQuery,
    selectedSound,
    onlyBestSellers,
    onlyNew,
    onlyInStock,
    sortOption,
    currentView,
    wishlist,
  ]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedSound('all');
    setOnlyBestSellers(false);
    setOnlyNew(false);
    setOnlyInStock(false);
    setSortOption('featured');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-950">
      {/* Festive Countdown Banner */}
      <FestiveBanner
        settings={settings}
        language={language}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Navbar */}
      <Navbar
        settings={settings}
        cartCount={cartItemCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        language={language}
        onLanguageToggle={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setCurrentView('wishlist')}
        onOpenGiftBox={() => setIsGiftBoxOpen(true)}
        onOpenCatalog={() => setCurrentView('catalog')}
        currentView={currentView}
        onOpenAdmin={() => setIsAdminOpen(true)}
        isFestiveMode={isFestiveMode}
      />

      {/* Hero Section */}
      <HeroSection
        language={language}
        onOpenGiftBoxBuilder={() => setIsGiftBoxOpen(true)}
        onOpenSurpriseMe={() => setIsSurpriseMeOpen(true)}
        onScrollToCatalog={handleScrollToCatalog}
        isFestiveMode={isFestiveMode}
      />

      {/* Main Catalog Section */}
      <main ref={catalogRef} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {currentView === 'wishlist' ? (
          <div className="mb-8 p-6 bg-amber-50 rounded-2xl border border-amber-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-festive flex items-center gap-2">
                <span>❤️</span>
                <span>{language === 'hi' ? 'आपकी पसंदीदा सूची' : 'Your Personal Wishlist'}</span>
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {language === 'hi' 
                  ? 'यहां आपके द्वारा सहेजे गए पसंदीदा पटाखे हैं। इन्हें सीधे यहाँ से कार्ट में जोड़ें!' 
                  : 'Here are all the premium fireworks you saved. Add them directly to your WhatsApp cart!'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('catalog')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors self-start sm:self-auto"
            >
              {language === 'hi' ? '← पूरा कैटलॉग देखें' : '← Back to Catalog'}
            </button>
          </div>
        ) : null}

        {/* Category Navigation Bar */}
        <div className="mb-4">
          <CategoryFilter
            categories={seedCategories}
            selectedCategory={selectedCategory}
            onSelectCategory={(id) => setSelectedCategory(id)}
            categoryCounts={categoryCounts}
            language={language}
          />
        </div>

        {/* Filter and Sort Bar */}
        <FilterSortBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedSound={selectedSound}
          onSoundChange={setSelectedSound}
          onlyBestSellers={onlyBestSellers}
          onToggleBestSellers={() => setOnlyBestSellers((b) => !b)}
          onlyNew={onlyNew}
          onToggleNew={() => setOnlyNew((n) => !n)}
          onlyInStock={onlyInStock}
          onToggleInStock={() => setOnlyInStock((i) => !i)}
          sortOption={sortOption}
          onSortChange={setSortOption}
          totalProductsFound={filteredProducts.length}
          language={language}
        />

        {/* Product Catalog Grid */}
        <ProductGrid
          products={filteredProducts}
          wishlistIds={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onAddToCart={handleAddToCart}
          onSelectProduct={handleSelectProduct}
          onResetFilters={handleResetFilters}
          language={language}
        />
      </main>

      {/* Trust & Stall Location Section */}
      <StallTrustSection settings={settings} language={language} />

      {/* Customer Testimonials & Reviews */}
      <TestimonialsSection language={language} />

      {/* Footer */}
      <Footer
        settings={settings}
        language={language}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        allProducts={products}
        isWishlisted={selectedProduct ? wishlist.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={handleSelectProduct}
        onClose={handleCloseProductModal}
        language={language}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        settings={settings}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        language={language}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistIds={wishlist}
        products={products}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        language={language}
      />

      <GiftBoxBuilderModal
        isOpen={isGiftBoxOpen}
        onClose={() => setIsGiftBoxOpen(false)}
        products={products}
        onAddCustomBundleToCart={handleAddCustomBundleToCart}
        language={language}
      />

      <SurpriseMeModal
        isOpen={isSurpriseMeOpen}
        onClose={() => setIsSurpriseMeOpen(false)}
        products={products}
        onAddCustomBundleToCart={handleAddCustomBundleToCart}
        language={language}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        settings={settings}
        analytics={analytics}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onDuplicateProduct={handleDuplicateProduct}
        onBulkUpdatePrices={handleBulkUpdatePrices}
        onUpdateSettings={handleUpdateSettings}
        language={language}
      />
    </div>
  );
}
