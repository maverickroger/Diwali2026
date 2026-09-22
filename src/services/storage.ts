import { Product, CartItem, SiteSettings, CustomerReview, AnalyticsData } from '../types';
import { SEED_PRODUCTS, INITIAL_SITE_SETTINGS, INITIAL_REVIEWS } from '../data/seedProducts';

const STORAGE_KEYS = {
  PRODUCTS: 'diwali_pataka_products_v1',
  CART: 'diwali_pataka_cart_v1',
  WISHLIST: 'diwali_pataka_wishlist_v1',
  SETTINGS: 'diwali_pataka_settings_v1',
  REVIEWS: 'diwali_pataka_reviews_v1',
  ANALYTICS: 'diwali_pataka_analytics_v1',
  VISITOR_ID: 'diwali_pataka_visitor_id_v1',
  SESSION_LOGGED: 'diwali_pataka_session_logged_v1',
};

// Event dispatched when storage changes so UI updates instantly
export const STORAGE_UPDATE_EVENT = 'pataka_store_updated';

function triggerStoreUpdate(key: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(STORAGE_UPDATE_EVENT, { detail: { key } }));
  }
}

// ---------------- PRODUCTS ----------------

export function getProducts(): Product[] {
  if (typeof window === 'undefined') return SEED_PRODUCTS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_PRODUCTS;
  } catch (err) {
    console.error('Error reading products from storage:', err);
    return SEED_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    triggerStoreUpdate('products');
  } catch (err) {
    console.error('Error saving products:', err);
  }
}

export function addProduct(product: Omit<Product, 'id' | 'viewCount' | 'cartAddCount'>): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: `custom-${Date.now()}`,
    viewCount: 0,
    cartAddCount: 0,
  };
  const updated = [newProduct, ...products];
  saveProducts(updated);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): void {
  const products = getProducts();
  const updated = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveProducts(updated);
}

export function deleteProduct(id: string): void {
  const products = getProducts();
  const updated = products.filter((p) => p.id !== id);
  saveProducts(updated);
}

export function duplicateProduct(id: string): Product | null {
  const products = getProducts();
  const target = products.find((p) => p.id === id);
  if (!target) return null;

  const clone: Product = {
    ...target,
    id: `${target.id}-copy-${Date.now().toString().slice(-4)}`,
    name: `${target.name} (Copy)`,
    nameHindi: `${target.nameHindi} (कॉपी)`,
    viewCount: 0,
    cartAddCount: 0,
    isNewThisYear: true,
  };

  const updated = [clone, ...products];
  saveProducts(updated);
  return clone;
}

export function bulkUpdatePrices(percentageChange: number, categoryId?: string): number {
  const products = getProducts();
  let affectedCount = 0;
  const multiplier = 1 + percentageChange / 100;

  const updated = products.map((p) => {
    if (!categoryId || categoryId === 'all' || p.category === categoryId) {
      affectedCount++;
      return {
        ...p,
        pricePerPiece: Math.max(1, Math.round(p.pricePerPiece * multiplier)),
        pricePerBox: Math.max(1, Math.round(p.pricePerBox * multiplier)),
      };
    }
    return p;
  });

  saveProducts(updated);
  return affectedCount;
}

export function resetToSeedCatalog(): void {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SEED_PRODUCTS));
  triggerStoreUpdate('products');
}

// ---------------- CART ----------------

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error reading cart:', err);
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    triggerStoreUpdate('cart');
  } catch (err) {
    console.error('Error saving cart:', err);
  }
}

export function addToCart(product: Product, variant: 'piece' | 'box', quantity: number = 1): void {
  const cart = getCart();
  const cartItemId = `${product.id}-${variant}`;
  const existingIndex = cart.findIndex((item) => item.id === cartItemId);
  const unitPrice = variant === 'piece' ? product.pricePerPiece : product.pricePerBox;

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: cartItemId,
      productId: product.id,
      productName: product.name,
      productNameHindi: product.nameHindi,
      variant,
      quantity,
      unitPrice,
      boxQuantity: product.boxQuantity,
      image: product.image,
    });
  }

  saveCart(cart);
  recordProductCartAdd(product.id, quantity);
}

export function updateCartQuantity(cartItemId: string, delta: number): void {
  const cart = getCart();
  const existing = cart.find((item) => item.id === cartItemId);
  if (!existing) return;

  const newQty = existing.quantity + delta;
  if (newQty <= 0) {
    removeFromCart(cartItemId);
  } else {
    existing.quantity = newQty;
    saveCart(cart);
  }
}

export function removeFromCart(cartItemId: string): void {
  const cart = getCart();
  const filtered = cart.filter((item) => item.id !== cartItemId);
  saveCart(filtered);
}

export function clearCart(): void {
  saveCart([]);
}

// ---------------- WISHLIST ----------------

export function getWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function toggleWishlist(productId: string): boolean {
  const wishlist = getWishlist();
  let next: string[];
  let isAdded: boolean;
  if (wishlist.includes(productId)) {
    next = wishlist.filter((id) => id !== productId);
    isAdded = false;
  } else {
    next = [...wishlist, productId];
    isAdded = true;
  }
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(next));
  triggerStoreUpdate('wishlist');
  return isAdded;
}

// ---------------- SITE SETTINGS ----------------

export function getSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') return INITIAL_SITE_SETTINGS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SITE_SETTINGS));
      return INITIAL_SITE_SETTINGS;
    }
    return { ...INITIAL_SITE_SETTINGS, ...JSON.parse(data) };
  } catch {
    return INITIAL_SITE_SETTINGS;
  }
}

export function saveSiteSettings(settings: SiteSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  triggerStoreUpdate('settings');
}

// ---------------- REVIEWS ----------------

export function getReviews(): CustomerReview[] {
  if (typeof window === 'undefined') return INITIAL_REVIEWS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(data);
  } catch {
    return INITIAL_REVIEWS;
  }
}

export function addReview(review: Omit<CustomerReview, 'id'>): void {
  const reviews = getReviews();
  const newRev: CustomerReview = { ...review, id: `rev-${Date.now()}` };
  const updated = [newRev, ...reviews];
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
  triggerStoreUpdate('reviews');
}

export function deleteReview(id: string): void {
  const reviews = getReviews();
  const updated = reviews.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
  triggerStoreUpdate('reviews');
}

// ---------------- ANALYTICS ----------------

export function getAnalytics(): AnalyticsData {
  const defaultAnalytics: AnalyticsData = {
    hourlyVisits: {
      0: 4, 1: 1, 2: 0, 3: 0, 4: 0, 5: 2, 6: 8, 7: 15,
      8: 24, 9: 45, 10: 68, 11: 82, 12: 95, 13: 88, 14: 76,
      15: 90, 16: 120, 17: 165, 18: 210, 19: 250, 20: 280, 21: 220,
      22: 140, 23: 65,
    },
    totalViews: 840,
    totalCartAdds: 310,
    totalOrdersGenerated: 78,
    newVisitors: 450,
    returningVisitors: 280,
  };

  if (typeof window === 'undefined') return defaultAnalytics;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(defaultAnalytics));
      return defaultAnalytics;
    }
    return JSON.parse(data);
  } catch {
    return defaultAnalytics;
  }
}

export function saveAnalytics(analytics: AnalyticsData): void {
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  triggerStoreUpdate('analytics');
}

export function recordProductView(productId: string): void {
  // Update in products
  const products = getProducts();
  const target = products.find((p) => p.id === productId);
  if (target) {
    target.viewCount = (target.viewCount || 0) + 1;
    saveProducts(products);
  }

  // Update in analytics
  const analytics = getAnalytics();
  analytics.totalViews = (analytics.totalViews || 0) + 1;
  const currentHour = new Date().getHours();
  analytics.hourlyVisits[currentHour] = (analytics.hourlyVisits[currentHour] || 0) + 1;
  saveAnalytics(analytics);
}

export function recordProductCartAdd(productId: string, quantity: number = 1): void {
  const products = getProducts();
  const target = products.find((p) => p.id === productId);
  if (target) {
    target.cartAddCount = (target.cartAddCount || 0) + quantity;
    saveProducts(products);
  }

  const analytics = getAnalytics();
  analytics.totalCartAdds = (analytics.totalCartAdds || 0) + quantity;
  saveAnalytics(analytics);
}

export function recordOrderCheckout(cart: CartItem[]): void {
  const analytics = getAnalytics();
  analytics.totalOrdersGenerated = (analytics.totalOrdersGenerated || 0) + 1;
  saveAnalytics(analytics);

  // Increment orderCount on products
  const products = getProducts();
  cart.forEach((item) => {
    const prod = products.find((p) => p.id === item.productId);
    if (prod) {
      prod.orderCount = (prod.orderCount || 0) + item.quantity;
    }
  });
  saveProducts(products);
}

export function trackVisitorSession(): void {
  if (typeof window === 'undefined') return;
  const isLoggedThisSession = sessionStorage.getItem(STORAGE_KEYS.SESSION_LOGGED);
  if (isLoggedThisSession) return;

  const visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  const analytics = getAnalytics();

  if (!visitorId) {
    // New visitor
    const newId = `vis_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, newId);
    analytics.newVisitors = (analytics.newVisitors || 0) + 1;
  } else {
    // Returning visitor
    analytics.returningVisitors = (analytics.returningVisitors || 0) + 1;
  }

  const currentHour = new Date().getHours();
  analytics.hourlyVisits[currentHour] = (analytics.hourlyVisits[currentHour] || 0) + 1;
  saveAnalytics(analytics);
  sessionStorage.setItem(STORAGE_KEYS.SESSION_LOGGED, 'true');
}

// ---------------- EXPORT ALIASES ----------------
export const loadProducts = getProducts;
export const loadSettings = getSiteSettings;
export const saveSettings = saveSiteSettings;
export const loadCart = getCart;
export const addToCartStorage = (product: Product, variant: 'piece' | 'box', quantity: number = 1): CartItem[] => {
  addToCart(product, variant, quantity);
  return getCart();
};
export const updateCartItemQuantityStorage = (cartItemId: string, delta: number): CartItem[] => {
  updateCartQuantity(cartItemId, delta);
  return getCart();
};
export const removeCartItemStorage = (cartItemId: string): CartItem[] => {
  removeFromCart(cartItemId);
  return getCart();
};
export const clearCartStorage = (): void => {
  clearCart();
};
export const loadWishlist = getWishlist;
export const toggleWishlistStorage = (productId: string): string[] => {
  toggleWishlist(productId);
  return getWishlist();
};
export const loadAnalytics = (): AnalyticsData => {
  const a = getAnalytics();
  const prods = getProducts();
  const productViews: Record<string, number> = {};
  const productCartAdds: Record<string, number> = {};
  prods.forEach((p) => {
    productViews[p.id] = p.viewCount || 0;
    productCartAdds[p.id] = p.cartAddCount || 0;
  });

  return {
    ...a,
    pageViews: a.totalViews,
    uniqueVisitors: a.newVisitors + a.returningVisitors,
    cartAdditions: a.totalCartAdds,
    ordersInitiated: a.totalOrdersGenerated,
    productViews,
    productCartAdds,
    hourlyTraffic: a.hourlyVisits,
  };
};
export const recordPageView = trackVisitorSession;
export const recordCartAdd = recordProductCartAdd;
