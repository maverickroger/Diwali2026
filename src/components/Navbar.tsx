import React from 'react';
import {
  ShoppingCart,
  Heart,
  Sparkles,
  MapPin,
  ShieldCheck,
  Languages,
  Lock,
  Flame,
  Gift,
  Store,
} from 'lucide-react';
import { SiteSettings, Language } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  language: Language;
  onLanguageToggle: () => void;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenGiftBox: () => void;
  onOpenCatalog: () => void;
  currentView: 'catalog' | 'wishlist';
  onOpenAdmin: () => void;
  isFestiveMode: boolean;
  onToggleThemeMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  cartCount,
  cartTotal,
  wishlistCount,
  language,
  onLanguageToggle,
  onOpenCart,
  onOpenWishlist,
  onOpenGiftBox,
  onOpenCatalog,
  currentView,
  onOpenAdmin,
  isFestiveMode,
}) => {
  const isHi = language === 'hi';

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 text-gray-800 transition-colors shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={onOpenCatalog}
            title={isHi ? 'मुख्य स्टोर पर जाएं' : 'Go to Storefront'}
          >
            <div className="relative group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Flame className="w-5.5 h-5.5 text-amber-600" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-gray-900 font-festive flex items-center gap-1.5">
                  {isHi ? 'हरा पटाखा स्टोर' : 'Green Pataka Store'}
                </h1>
                <span className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3" />
                  PESO Certified
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                <span className="truncate max-w-[180px] sm:max-w-xs">
                  {isHi && settings.stallLocationHindi ? settings.stallLocationHindi : settings.stallLocation}
                </span>
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200 text-xs">
            <button
              type="button"
              id="nav-catalog-btn"
              onClick={onOpenCatalog}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                currentView === 'catalog'
                  ? 'bg-amber-500 text-black shadow font-bold'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>{isHi ? 'पटाखा कैटलॉग' : 'Catalog'}</span>
            </button>

            <button
              type="button"
              id="nav-giftbox-btn"
              onClick={onOpenGiftBox}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold text-gray-500 hover:text-amber-700 hover:bg-gray-100 transition-all"
            >
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>{isHi ? 'गिफ्ट बॉक्स बनाएं' : 'Build Gift Box'}</span>
            </button>

            <button
              type="button"
              id="nav-wishlist-page-btn"
              onClick={onOpenWishlist}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                currentView === 'wishlist'
                  ? 'bg-red-50 text-red-600 border border-red-200 font-bold'
                  : 'text-gray-500 hover:text-red-600 hover:bg-gray-100'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : ''}`} />
              <span>{isHi ? 'पसंदीदा' : 'Wishlist'}</span>
              {wishlistCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white font-mono text-[10px]">
                  {wishlistCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Toggle */}
            <button
              id="language-toggle-btn"
              onClick={onLanguageToggle}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-medium text-amber-700 transition-colors shadow-sm"
              title="Toggle Language (English / हिन्दी)"
            >
              <Languages className="w-3.5 h-3.5 text-amber-600" />
              <span>{isHi ? 'EN' : 'हिन्दी'}</span>
            </button>

            {/* Mobile / Tablet Wishlist Button */}
            <button
              id="wishlist-toggle-btn"
              onClick={onOpenWishlist}
              className={`relative p-2 sm:px-3 sm:py-2 rounded-lg border transition-colors flex items-center gap-1.5 ${
                currentView === 'wishlist'
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
              }`}
              title="Dedicated Wishlist Page / पसंदीदा"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
              <span className="hidden sm:inline md:hidden text-xs">{isHi ? 'विशलिस्ट' : 'Wishlist'}</span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger with Live Running Total */}
            <button
              id="cart-drawer-trigger-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-semibold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all transform active:scale-95"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-black" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-[10px] uppercase font-bold tracking-wider text-black/80 hidden xs:inline">
                  {isHi ? 'ऑर्डर कार्ट' : 'Live Cart'}
                </span>
                <span className="font-extrabold text-black font-mono">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </button>

            {/* Admin Key (Discreet) */}
            <button
              id="admin-access-btn"
              onClick={onOpenAdmin}
              className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-gray-100 transition-colors"
              title="Stall Owner Admin Portal"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
