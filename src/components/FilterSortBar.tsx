import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { SoundLevel, Language } from '../types';

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'sound-asc'
  | 'sound-desc'
  | 'popular';

interface FilterSortBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedSound: SoundLevel | 'all';
  onSoundChange: (sound: SoundLevel | 'all') => void;
  onlyBestSellers: boolean;
  onToggleBestSellers: () => void;
  onlyNew: boolean;
  onToggleNew: () => void;
  onlyInStock: boolean;
  onToggleInStock: () => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalProductsFound: number;
  language: Language;
}

export const FilterSortBar: React.FC<FilterSortBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedSound,
  onSoundChange,
  onlyBestSellers,
  onToggleBestSellers,
  onlyNew,
  onToggleNew,
  onlyInStock,
  onToggleInStock,
  sortOption,
  onSortChange,
  totalProductsFound,
  language,
}) => {
  const isHi = language === 'hi';

  return (
    <div
      id="filter-sort-controls-bar"
      className="bg-white border border-gray-200 rounded-2xl p-3.5 sm:p-4 mb-6 shadow-sm space-y-3"
    >
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="product-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isHi ? 'पटाखा खोजें (उदा: सुतली, अनार, चकरी, स्काई शॉट)...' : 'Search crackers (e.g. Sutli, Anar, Chakri, Sky Shot)...'}
            className="w-full bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium whitespace-nowrap">
            <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">{isHi ? 'क्रमबद्ध:' : 'Sort:'}</span>
          </div>
          <select
            id="sort-products-select"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-white border border-gray-200 focus:border-amber-500 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-sm"
          >
            <option value="featured">{isHi ? 'सुझाए गए (Featured)' : 'Featured & Handpicked'}</option>
            <option value="popular">{isHi ? 'सबसे ज्यादा लोकप्रिय' : 'Most Popular (Views/Cart)'}</option>
            <option value="price-asc">{isHi ? 'दाम: कम से ज्यादा (₹)' : 'Price: Low to High'}</option>
            <option value="price-desc">{isHi ? 'दाम: ज्यादा से कम (₹)' : 'Price: High to Low'}</option>
            <option value="sound-asc">{isHi ? 'आवाज: धीमी से तेज' : 'Sound: Low to High'}</option>
            <option value="sound-desc">{isHi ? 'आवाज: तेज से धीमी' : 'Sound: High to Low'}</option>
          </select>
        </div>
      </div>

      {/* Filter Badges & Quick Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-xs">
        {/* Sound Level Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-gray-500 flex items-center gap-1 text-[11px] font-medium mr-1">
            <Volume2 className="w-3.5 h-3.5 text-amber-500" />
            {isHi ? 'आवाज स्तर:' : 'Sound:'}
          </span>

          {(['all', 'Low', 'Medium', 'High'] as const).map((level) => {
            const isSelected = selectedSound === level;
            const label =
              level === 'all'
                ? isHi ? 'सभी' : 'All'
                : level === 'Low'
                ? isHi ? 'धीमी' : 'Low'
                : level === 'Medium'
                ? isHi ? 'मध्यम' : 'Medium'
                : isHi ? 'तेज' : 'High';

            return (
              <button
                key={level}
                onClick={() => onSoundChange(level)}
                className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] font-semibold border ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-sm'
                    : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-sm'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Feature Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Best Seller Toggle */}
          <button
            onClick={onToggleBestSellers}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
              onlyBestSellers
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold shadow-sm'
                : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <span>⭐</span>
            <span>{isHi ? 'बेस्टसेलर' : 'Best Sellers'}</span>
          </button>

          {/* New This Year */}
          <button
            onClick={onToggleNew}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
              onlyNew
                ? 'bg-cyan-50 border-cyan-200 text-cyan-800 font-bold shadow-sm'
                : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <Sparkles className="w-3 h-3 text-cyan-500" />
            <span>{isHi ? 'इस साल नया' : 'New This Year'}</span>
          </button>

          {/* In Stock Only */}
          <button
            onClick={onToggleInStock}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
              onlyInStock
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold shadow-sm'
                : 'bg-white border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>{isHi ? 'उपलब्ध केवल' : 'In Stock Only'}</span>
          </button>

          {/* Count tag */}
          <span className="text-[11px] text-gray-400 font-medium ml-1">
            {totalProductsFound} {isHi ? 'आइटम' : 'patakas'}
          </span>
        </div>
      </div>
    </div>
  );
};
