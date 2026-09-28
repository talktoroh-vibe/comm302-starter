import React, { useState } from 'react';
import { Instrument } from '../types/market';
import { ChevronRight } from 'lucide-react';

interface CryptoAndForexProps {
  cryptoCoins: Instrument[];
  currencyPairs: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
  priceFlashMap?: Record<string, 'up' | 'down' | null>;
}

export const CryptoAndForex: React.FC<CryptoAndForexProps> = ({
  cryptoCoins,
  currencyPairs,
  onSelectInstrument,
  priceFlashMap = {},
}) => {
  const [expandCrypto, setExpandCrypto] = useState(false);
  const [expandForex, setExpandForex] = useState(false);

  return (
    <section className="mb-14" data-purpose="crypto-forex-summary">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Crypto Overview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => cryptoCoins[0] && onSelectInstrument(cryptoCoins[0])}
              className="group inline-flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#131722] hover:text-[#2962ff] focus:outline-none"
            >
              <span>Crypto coins</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setExpandCrypto(!expandCrypto)}
              className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer focus:outline-none"
            >
              {expandCrypto ? 'Show top' : 'All coins'}
            </button>
          </div>

          <div className="border border-[#e0e3eb] rounded-2xl p-4 bg-white divide-y divide-[#f0f3fa]">
            {cryptoCoins.slice(0, expandCrypto ? 6 : 3).map((coin) => {
              const isPositive = coin.change >= 0;
              const flashClass =
                priceFlashMap[coin.id] === 'up'
                  ? 'animate-flash-green'
                  : priceFlashMap[coin.id] === 'down'
                  ? 'animate-flash-red'
                  : '';

              return (
                <div
                  key={coin.id}
                  onClick={() => onSelectInstrument(coin)}
                  className={`py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-lg px-2 transition-colors ${flashClass}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full text-white flex items-center justify-center font-bold text-xs shrink-0 select-none ${
                        coin.symbol === 'SOLUSD'
                          ? 'bg-gradient-to-tr from-purple-600 to-teal-400 text-[10px]'
                          : ''
                      }`}
                      style={{
                        backgroundColor:
                          coin.symbol !== 'SOLUSD' ? coin.badge?.bgColor || '#f7931a' : undefined,
                      }}
                    >
                      {coin.badge?.text || coin.symbol.slice(0, 1)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#131722]">{coin.symbol}</div>
                      <div className="text-xs text-[#6a6d78]">{coin.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#131722] font-mono tabular-nums">
                      ${coin.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div
                      className={`text-xs font-semibold font-mono tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {coin.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Major Forex Pairs */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => currencyPairs[0] && onSelectInstrument(currencyPairs[0])}
              className="group inline-flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#131722] hover:text-[#2962ff] focus:outline-none"
            >
              <span>Currencies</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => setExpandForex(!expandForex)}
              className="text-xs font-semibold text-[#2962ff] hover:underline cursor-pointer focus:outline-none"
            >
              {expandForex ? 'Show top' : 'All pairs'}
            </button>
          </div>

          <div className="border border-[#e0e3eb] rounded-2xl p-4 bg-white divide-y divide-[#f0f3fa]">
            {currencyPairs.slice(0, expandForex ? 6 : 3).map((fx) => {
              const isPositive = fx.change >= 0;
              const flashClass =
                priceFlashMap[fx.id] === 'up'
                  ? 'animate-flash-green'
                  : priceFlashMap[fx.id] === 'down'
                  ? 'animate-flash-red'
                  : '';

              return (
                <div
                  key={fx.id}
                  onClick={() => onSelectInstrument(fx)}
                  className={`py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-lg px-2 transition-colors ${flashClass}`}
                >
                  <div>
                    <div className="text-sm font-bold text-[#131722]">{fx.symbol}</div>
                    <div className="text-xs text-[#6a6d78]">{fx.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-[#131722] font-mono tabular-nums">
                      {fx.price >= 10 ? fx.price.toFixed(3) : fx.price.toFixed(5)}
                    </div>
                    <div
                      className={`text-xs font-semibold font-mono tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {fx.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
