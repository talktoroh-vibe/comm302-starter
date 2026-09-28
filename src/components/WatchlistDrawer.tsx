import React from 'react';
import { Instrument } from '../types/market';
import { X, Trash2, BookmarkCheck, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: Instrument[];
  onSelectInstrument: (instrument: Instrument) => void;
  onRemoveFromWatchlist: (instrumentId: string) => void;
  onAddDefaultItems: () => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlist,
  onSelectInstrument,
  onRemoveFromWatchlist,
  onAddDefaultItems,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-[#e0e3eb] flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e0e3eb] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-[#2962ff]" />
            <h3 className="text-lg font-bold text-[#131722]">My Watchlist</h3>
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
              {watchlist.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-[#f0f3fa] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
          {watchlist.length === 0 ? (
            <div className="text-center py-16 px-4">
              <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-base font-semibold text-[#131722] mb-1">Your Watchlist is empty</p>
              <p className="text-xs text-[#6a6d78] mb-6">
                Click "+ Watchlist" on any stock, index, crypto, or forex card to track real-time changes here.
              </p>
              <button
                onClick={onAddDefaultItems}
                className="px-4 py-2 bg-[#2962ff] text-white text-xs font-semibold rounded-full hover:bg-[#1e53e5] transition-colors"
              >
                Track S&P 500, NVDA & BTC
              </button>
            </div>
          ) : (
            watchlist.map((item) => {
              const isPositive = item.change >= 0;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectInstrument(item);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-[#e0e3eb]/80 hover:border-[#2962ff] hover:bg-[#f8f9fd] cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    {item.badge ? (
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                        style={{ backgroundColor: item.badge.bgColor }}
                      >
                        {item.badge.text}
                      </span>
                    ) : item.countryCode ? (
                      <span className="w-8 h-5 bg-slate-100 rounded text-[10px] font-bold border border-slate-300 flex items-center justify-center">
                        {item.countryCode}
                      </span>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {item.symbol.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-bold text-[#131722] group-hover:text-[#2962ff] transition-colors">
                        {item.symbol}
                      </div>
                      <div className="text-xs text-[#6a6d78] truncate max-w-[130px]">
                        {item.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-bold text-[#131722] font-mono tabular-nums">
                        ${item.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-semibold font-mono flex items-center justify-end gap-0.5 ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(item.id);
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                      title="Remove from watchlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {watchlist.length > 0 && (
          <div className="p-4 border-t border-[#e0e3eb] bg-[#f8f9fd] flex items-center justify-between text-xs text-[#6a6d78]">
            <span>Updates in real-time</span>
            <button
              onClick={onClose}
              className="font-semibold text-[#2962ff] hover:underline flex items-center gap-1"
            >
              Close <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
