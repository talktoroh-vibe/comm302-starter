import React, { useState } from 'react';
import { Instrument } from '../types/market';
import { ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface WorldIndicesTableProps {
  indices: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
  priceFlashMap?: Record<string, 'up' | 'down' | null>;
}

type SortField = 'symbol' | 'price' | 'change' | 'changePercent';
type SortOrder = 'asc' | 'desc';

export const WorldIndicesTable: React.FC<WorldIndicesTableProps> = ({
  indices,
  onSelectInstrument,
  priceFlashMap = {},
}) => {
  const [showAll, setShowAll] = useState(false);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const displayedList = [...indices].sort((a, b) => {
    if (!sortField) return 0;
    let comparison = 0;
    if (sortField === 'symbol') {
      comparison = a.symbol.localeCompare(b.symbol);
    } else {
      comparison = a[sortField] - b[sortField];
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const visibleRows = showAll ? displayedList : displayedList.slice(0, 5);

  const getRatingStyle = (rating: string) => {
    switch (rating) {
      case 'Strong Buy':
        return 'text-[#2962ff] font-semibold';
      case 'Buy':
        return 'text-[#089981] font-semibold';
      case 'Sell':
      case 'Strong Sell':
        return 'text-[#f23645] font-semibold';
      default:
        return 'text-[#6a6d78] font-medium';
    }
  };

  return (
    <section className="mb-16" data-purpose="world-indices-table">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => visibleRows[0] && onSelectInstrument(visibleRows[0])}
          className="group inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#131722] hover:text-[#2962ff] transition-colors focus:outline-none"
        >
          <span>World indices</span>
          <ChevronRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm font-semibold text-[#2962ff] hover:underline focus:outline-none flex items-center gap-1"
        >
          {showAll ? 'Show less ←' : 'See all major indices →'}
        </button>
      </div>

      {/* Indices Table */}
      <div className="overflow-x-auto border border-[#e0e3eb] rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#e0e3eb] bg-[#f8f9fd] text-[#6a6d78] text-xs font-semibold uppercase tracking-wider select-none">
              <th
                className="py-3.5 px-6 cursor-pointer hover:text-[#131722]"
                onClick={() => handleSort('symbol')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Index Symbol</span>
                  {sortField === 'symbol' ? (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5" />
                    )
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>
              <th className="py-3.5 px-6">Name</th>
              <th
                className="py-3.5 px-6 text-right cursor-pointer hover:text-[#131722]"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Last Price</span>
                  {sortField === 'price' ? (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5" />
                    )
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>
              <th
                className="py-3.5 px-6 text-right cursor-pointer hover:text-[#131722]"
                onClick={() => handleSort('change')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Change</span>
                  {sortField === 'change' ? (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5" />
                    )
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>
              <th
                className="py-3.5 px-6 text-right cursor-pointer hover:text-[#131722]"
                onClick={() => handleSort('changePercent')}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Chg %</span>
                  {sortField === 'changePercent' ? (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5" />
                    )
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>
              <th className="py-3.5 px-6 text-center">Technical Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f3fa]">
            {visibleRows.map((row) => {
              const isPositive = row.change >= 0;
              const flashClass =
                priceFlashMap[row.id] === 'up'
                  ? 'animate-flash-green'
                  : priceFlashMap[row.id] === 'down'
                  ? 'animate-flash-red'
                  : '';

              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectInstrument(row)}
                  className={`hover:bg-[#f8f9fd] transition-colors cursor-pointer group ${flashClass}`}
                >
                  <td className="py-3.5 px-6 font-bold text-[#131722] flex items-center gap-2 group-hover:text-[#2962ff] transition-colors">
                    {row.countryCode && (
                      <span className="w-6 h-4 bg-slate-100 rounded-xs flex items-center justify-center text-[10px] font-bold border border-slate-300 text-slate-700">
                        {row.countryCode}
                      </span>
                    )}
                    <span>{row.symbol}</span>
                  </td>
                  <td className="py-3.5 px-6 text-[#6a6d78] font-medium">{row.name}</td>
                  <td className="py-3.5 px-6 text-right font-semibold text-[#131722] font-mono tabular-nums">
                    {row.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    className={`py-3.5 px-6 text-right font-semibold font-mono tabular-nums ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {row.change.toFixed(2)}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-semibold font-mono tabular-nums ${
                        isPositive
                          ? 'bg-[#089981]/10 text-[#089981]'
                          : 'bg-[#f23645]/10 text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {row.changePercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <span className={`text-xs ${getRatingStyle(row.technicalRating)}`}>
                      {row.technicalRating}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
