import React from 'react';
import { MarketCategory } from '../types/market';

interface CategoryFilterBarProps {
  activeCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
}

const CATEGORIES: MarketCategory[] = [
  'US stocks',
  'World stocks',
  'Crypto',
  'Futures',
  'Forex',
  'Government bonds',
  'Corporate bonds',
  'ETFs',
  'Economy',
];

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <section className="mb-10 overflow-x-auto no-scrollbar py-2" data-purpose="market-category-filters">
      <div className="flex items-center gap-1.5 md:gap-2 min-w-max mx-auto justify-start md:justify-center p-1.5 border border-[#e0e3eb] rounded-full bg-white shadow-sm w-fit">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-4 md:px-5 py-2 rounded-full text-xs md:text-sm transition-all focus:outline-none whitespace-nowrap ${
                isActive
                  ? 'bg-[#131722] text-white font-semibold shadow-inner'
                  : 'font-medium text-[#131722] hover:bg-[#f0f3fa] text-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </section>
  );
};
