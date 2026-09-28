import React, { useState, useEffect, useRef } from 'react';
import { Instrument } from '../types/market';
import { Search, X, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  instruments: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  instruments,
  onSelectInstrument,
}) => {
  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'stocks' | 'crypto' | 'forex' | 'indices'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = instruments.filter((item) => {
    const matchesCategory =
      filterCategory === 'all' || item.category === filterCategory;
    const matchesQuery =
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      onSelectInstrument(filtered[selectedIndex]);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#e0e3eb] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#e0e3eb] gap-3">
          <Search className="w-5 h-5 text-[#6a6d78]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search symbols, indices, crypto, forex..."
            className="w-full text-base outline-none text-[#131722] placeholder:text-[#6a6d78] bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-[#f0f3fa] rounded-full text-[#6a6d78]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[11px] font-mono text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">
            ESC
          </span>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-[#f0f3fa] bg-[#f8f9fd] overflow-x-auto no-scrollbar text-xs font-medium">
          {(['all', 'stocks', 'crypto', 'forex', 'indices'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-full capitalize transition-colors ${
                filterCategory === cat
                  ? 'bg-[#131722] text-white font-semibold'
                  : 'text-[#6a6d78] hover:bg-[#e4e7f0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto flex-1 p-2 divide-y divide-[#f0f3fa] no-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#6a6d78] text-sm">
              No matching symbols found for "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isPositive = item.change >= 0;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectInstrument(item);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-xl cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-[#f0f3fa]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-[#131722]">{item.symbol}</div>
                      <div className="text-xs text-[#6a6d78] truncate max-w-xs">{item.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-[#131722] font-mono tabular-nums">
                      ${item.price.toFixed(2)}
                    </div>
                    <div
                      className={`text-xs font-semibold font-mono flex items-center justify-end gap-1 ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <span>
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 border-t border-[#e0e3eb] bg-[#f8f9fd] text-[11px] text-[#6a6d78] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Showing {filtered.length} instruments</span>
        </div>
      </div>
    </div>
  );
};
