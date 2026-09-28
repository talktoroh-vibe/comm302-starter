import React, { useState } from 'react';
import { Instrument } from '../types/market';
import { ChevronRight } from 'lucide-react';

interface USStocksMoversProps {
  highestVolume: Instrument[];
  gainers: Instrument[];
  losers: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
  priceFlashMap?: Record<string, 'up' | 'down' | null>;
}

export const USStocksMovers: React.FC<USStocksMoversProps> = ({
  highestVolume,
  gainers,
  losers,
  onSelectInstrument,
  priceFlashMap = {},
}) => {
  const [expandVolume, setExpandVolume] = useState(false);
  const [expandGainers, setExpandGainers] = useState(false);
  const [expandLosers, setExpandLosers] = useState(false);

  return (
    <section className="mb-16" data-purpose="us-stocks-movers">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => highestVolume[0] && onSelectInstrument(highestVolume[0])}
          className="group inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight text-[#131722] hover:text-[#2962ff] transition-colors focus:outline-none"
        >
          <span>US stocks</span>
          <ChevronRight className="w-5 h-5 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Stocks 3-Column Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Most Active / Highest Volume */}
        <div className="border border-[#e0e3eb] rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-[#131722]">Highest volume</h4>
              <button
                onClick={() => setExpandVolume(!expandVolume)}
                className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer focus:outline-none"
              >
                {expandVolume ? 'Show less' : 'View more'}
              </button>
            </div>

            <div className="space-y-4">
              {highestVolume.slice(0, expandVolume ? 6 : 4).map((item) => {
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
                    className={`flex items-center justify-between cursor-pointer hover:opacity-85 transition-opacity p-1.5 -mx-1.5 rounded-lg hover:bg-[#f8f9fd] ${flashClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full font-bold flex items-center justify-center text-xs shrink-0 select-none"
                        style={{
                          backgroundColor: item.badge?.bgColor || '#f0f3fa',
                          color: item.badge?.textColor || '#131722',
                        }}
                      >
                        {item.badge?.text || item.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#131722]">{item.symbol}</div>
                        <div className="text-xs text-[#6a6d78]">{item.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#131722] font-mono tabular-nums">
                        ${item.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-semibold font-mono tabular-nums ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 2: Top Gainers */}
        <div className="border border-[#e0e3eb] rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-[#131722]">Stock gainers</h4>
              <button
                onClick={() => setExpandGainers(!expandGainers)}
                className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer focus:outline-none"
              >
                {expandGainers ? 'Show less' : 'View all'}
              </button>
            </div>

            <div className="space-y-4">
              {gainers.slice(0, expandGainers ? 6 : 4).map((item) => {
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
                    className={`flex items-center justify-between cursor-pointer hover:opacity-85 transition-opacity p-1.5 -mx-1.5 rounded-lg hover:bg-[#f8f9fd] ${flashClass}`}
                  >
                    <div>
                      <div className="text-sm font-bold text-[#131722]">{item.symbol}</div>
                      <div className="text-xs text-[#6a6d78]">{item.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#131722] font-mono tabular-nums">
                        ${item.price.toFixed(2)}
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-[#089981]/15 text-[#089981] font-mono tabular-nums">
                        +{item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 3: Top Losers */}
        <div className="border border-[#e0e3eb] rounded-2xl p-5 bg-white shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-[#131722]">Stock losers</h4>
              <button
                onClick={() => setExpandLosers(!expandLosers)}
                className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer focus:outline-none"
              >
                {expandLosers ? 'Show less' : 'View all'}
              </button>
            </div>

            <div className="space-y-4">
              {losers.slice(0, expandLosers ? 6 : 4).map((item) => {
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
                    className={`flex items-center justify-between cursor-pointer hover:opacity-85 transition-opacity p-1.5 -mx-1.5 rounded-lg hover:bg-[#f8f9fd] ${flashClass}`}
                  >
                    <div>
                      <div className="text-sm font-bold text-[#131722]">{item.symbol}</div>
                      <div className="text-xs text-[#6a6d78]">{item.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#131722] font-mono tabular-nums">
                        ${item.price.toFixed(2)}
                      </div>
                      <span className="inline-block px-2 py-0.5 rounded text-xs font-bold bg-[#f23645]/15 text-[#f23645] font-mono tabular-nums">
                        {item.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
