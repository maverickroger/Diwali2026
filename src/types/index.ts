export type SoundLevel = 'Low' | 'Medium' | 'High';

export type ProductVariant = 'piece' | 'box';

export interface Product {
  id: string;
  name: string;
  nameHindi: string;
  category: string;
  pricePerPiece: number;
  pricePerBox: number;
  boxQuantity: number; // e.g. 10 pcs per box
  shortDescription: string;
  shortDescriptionHindi: string;
  soundLevel: SoundLevel;
  image: string;
  inStock: boolean;
  isBestSeller: boolean;
  isNewThisYear: boolean;
  relatedProductIds: string[];
  viewCount: number;
  cartAddCount: number;
  orderCount?: number;
  isGreenCertified?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameHindi: string;
  icon: string;
  description: string;
}

export interface CartItem {
  id: string; // unique id per cart entry (e.g. `${productId}-${variant}`)
  productId: string;
  productName: string;
  productNameHindi: string;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
  boxQuantity: number;
  image: string;
  description?: string; // Detailed description of contents (especially for Custom Gift Box)
  isGiftBox?: boolean;
  boxName?: string;
  giftBoxContents?: Array<{
    productId: string;
    productName: string;
    variant: ProductVariant;
    quantity: number;
    unitPrice: number;
  }>;
}

export interface CustomGiftBoxItem {
  productId: string;
  productName: string;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
}

export interface CustomGiftBox {
  id: string;
  boxName: string;
  budget: number;
  totalPrice: number;
  items: CustomGiftBoxItem[];
}

export interface SiteSettings {
  businessName: string;
  businessNameHindi: string;
  whatsappPhone: string; // e.g. "+919876543210"
  contactPhone?: string;
  stallLocation: string;
  stallLocationHindi: string;
  businessHours: string;
  businessHoursHindi: string;
  minOrderAmount: number;
  diwaliDate: string; // ISO date string e.g. "2026-11-08"
  currencySymbol: string;
  adminPin: string;
  adminPassword?: string;
  festiveThemeMode: 'auto' | 'festive' | 'neutral';
}

export interface CustomerReview {
  id: string;
  customerName: string;
  location: string;
  rating: number;
  quote: string;
  quoteHindi: string;
  year: number;
}

export interface AnalyticsData {
  hourlyVisits: Record<number, number>; // 0 to 23
  totalViews: number;
  totalCartAdds: number;
  totalOrdersGenerated: number;
  newVisitors: number;
  returningVisitors: number;
  // Aliases for admin analytics dashboard convenience
  pageViews?: number;
  uniqueVisitors?: number;
  cartAdditions?: number;
  ordersInitiated?: number;
  productViews?: Record<string, number>;
  productCartAdds?: Record<string, number>;
  hourlyTraffic?: Record<number, number>;
}

export type Language = 'en' | 'hi';
