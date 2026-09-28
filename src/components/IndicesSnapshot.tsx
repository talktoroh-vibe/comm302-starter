import React from 'react';
import { Instrument } from '../types/market';
import { ChevronRight } from 'lucide-react';

interface IndicesSnapshotProps {
  indices: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
  priceFlashMap?: Record<string, 'up' | 'down' | null>;
}

export const IndicesSnapshot: React.FC<IndicesSnapshotProps> = ({
  indices,
  onSelectInstrument,
  priceFlashMap = {},
}) => {
  return (
    <section className="mb-16" data-purpose="indices-snapshot">
      {/* Section Title Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => indices[0] && onSelectInstrument(indices[0])}
          className="group inline-flex items-center gap-1.5 text-2xl md:text-3xl font-bold tracking-tight text-[#131722] hover:text-[#2962ff] transition-colors focus:outline-none"
        >
          <span>Indices</span>
          <ChevronRight className="w-6 h-6 stroke-[3] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Indices Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {indices.map((item) => {
          const isPositive = item.change >= 0;
          const flashClass =
            priceFlashMap[item.id] === 'up'
              ? 'animate-flash-green'
              : priceFlashMap[item.id] === 'down'
              ? 'animate-flash-red'
              : '';

          return (
            <div
              key={item.id}
              onClick={() => onSelectInstrument(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectInstrument(item);
                }
              }}
              className={`bg-[#f8f9fd] hover:bg-[#f0f3fa] border border-[#e0e3eb]/60 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-sm cursor-pointer group select-none ${flashClass}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Badge */}
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-sm shrink-0"
                    style={{ backgroundColor: item.badge?.bgColor || '#2962ff' }}
                  >
                    {item.badge?.text || item.symbol.slice(0, 3)}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors">
                      {item.symbol}
                    </h3>
                    <span className="text-xs text-[#6a6d78] font-medium block">
                      {item.name}
                    </span>
                  </div>
                </div>

                {/* Sparkline SVG preview */}
                <div className="w-24 h-10 shrink-0">
                  <svg
                    className={`w-full h-full fill-none ${
                      isPositive ? 'stroke-[#089981]' : 'stroke-[#f23645]'
                    }`}
                    strokeWidth="2"
                    viewBox="0 0 100 40"
                  >
                    {item.symbol === 'S&P 500' ? (
                      <path d="M0 32 Q 20 35, 35 22 T 65 14 T 100 4" />
                    ) : item.symbol === 'Nasdaq 100' ? (
                      <path d="M0 36 Q 25 38, 45 18 T 75 16 T 100 2" />
                    ) : item.symbol === 'Dow 30' ? (
                      <path d="M0 6 Q 30 10, 50 20 T 75 22 T 100 34" />
                    ) : (
                      // Dynamic SVG sparkline for other symbols
                      <polyline
                        points={item.sparkline
                          .map((val, idx) => {
                            const x = (idx / (item.sparkline.length - 1)) * 100;
                            return `${x},${val}`;
                          })
                          .join(' ')}
                      />
                    )}
                  </svg>
                </div>
              </div>

              {/* Bottom numbers & change badge */}
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-bold text-[#131722] font-mono tabular-nums">
                  {item.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <div
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md font-mono tabular-nums ${
                    isPositive
                      ? 'text-[#089981] bg-[#089981]/10'
                      : 'text-[#f23645] bg-[#f23645]/10'
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5 fill-current shrink-0"
                    viewBox="0 0 20 20"
                  >
                    {isPositive ? (
                      <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                    ) : (
                      <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                    )}
                  </svg>
                  <span>
                    {isPositive ? '+' : ''}
                    {item.change.toFixed(2)} ({isPositive ? '+' : ''}
                    {item.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
