import React from 'react';
import {
  Sparkles,
  Wand2,
  Disc3,
  Rocket,
  Flame,
  Volume2,
  Smile,
  Layers,
  LucideIcon,
} from 'lucide-react';
import { Category, Language } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  categoryCounts: Record<string, number>;
  language: Language;
}

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Wand2,
  Disc3,
  Rocket,
  Flame,
  Volume2,
  Smile,
  Layers,
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  categoryCounts,
  language,
}) => {
  const isHi = language === 'hi';

  return (
    <div id="category-filter-container" className="w-full py-3 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 sm:gap-3 min-w-max pb-1">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = iconMap[cat.icon] || Sparkles;
          const count = categoryCounts[cat.id] ?? 0;

          return (
            <button
              key={cat.id}
              id={`category-btn-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                isSelected
                  ? 'bg-amber-500 text-black border-amber-400 shadow-md scale-102 font-bold'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-950 shadow-sm'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-amber-500'}`} />
              <span>{isHi && cat.nameHindi ? cat.nameHindi : cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-black/20 text-black' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
