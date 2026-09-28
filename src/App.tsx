/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  PRIMARY_INDICES,
  WORLD_INDICES_DATA,
  HIGHEST_VOLUME_STOCKS,
  STOCK_GAINERS,
  STOCK_LOSERS,
  CRYPTO_COINS,
  CURRENCY_PAIRS,
  ALL_INSTRUMENTS,
} from './data/marketData';
import { MarketCategory, Instrument } from './types/market';
import { Header } from './components/Header';
import { CategoryFilterBar } from './components/CategoryFilterBar';
import { IndicesSnapshot } from './components/IndicesSnapshot';
import { WorldIndicesTable } from './components/WorldIndicesTable';
import { USStocksMovers } from './components/USStocksMovers';
import { CryptoAndForex } from './components/CryptoAndForex';
import { SymbolModal } from './components/SymbolModal';
import { SearchModal } from './components/SearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { GetStartedModal } from './components/GetStartedModal';
import { Footer } from './components/Footer';
import { ChevronDown, Check } from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('US stocks');
  const [activeNav, setActiveNav] = useState('Markets');
  const [selectedRegion, setSelectedRegion] = useState('Everywhere');
  const [regionMenuOpen, setRegionMenuOpen] = useState(false);

  // Modals and Drawers
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);

  // Live price ticker simulator
  const [liveUpdatesEnabled, setLiveUpdatesEnabled] = useState(true);
  const [priceFlashMap, setPriceFlashMap] = useState<Record<string, 'up' | 'down' | null>>({});

  // Dynamic instrument states
  const [indices, setIndices] = useState<Instrument[]>(PRIMARY_INDICES);
  const [worldIndices, setWorldIndices] = useState<Instrument[]>(WORLD_INDICES_DATA);
  const [volumeStocks, setVolumeStocks] = useState<Instrument[]>(HIGHEST_VOLUME_STOCKS);
  const [gainers, setGainers] = useState<Instrument[]>(STOCK_GAINERS);
  const [losers, setLosers] = useState<Instrument[]>(STOCK_LOSERS);
  const [cryptoList, setCryptoList] = useState<Instrument[]>(CRYPTO_COINS);
  const [forexList, setForexList] = useState<Instrument[]>(CURRENCY_PAIRS);

  // Watchlist state with localStorage
  const [watchlist, setWatchlist] = useState<Instrument[]>(() => {
    try {
      const saved = localStorage.getItem('tv_markets_watchlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [PRIMARY_INDICES[0], HIGHEST_VOLUME_STOCKS[0], CRYPTO_COINS[0]];
  });

  useEffect(() => {
    try {
      localStorage.setItem('tv_markets_watchlist', JSON.stringify(watchlist));
    } catch {
      // Fallback
    }
  }, [watchlist]);

  // Live price fluctuation simulation
  useEffect(() => {
    if (!liveUpdatesEnabled) return;

    const interval = setInterval(() => {
      // Pick 1-2 random pools to perturb
      const rand = Math.random();
      const flashUpdates: Record<string, 'up' | 'down' | null> = {};

      const updateItem = (item: Instrument): Instrument => {
        const deltaPercent = (Math.random() * 0.4 - 0.19) / 100; // ±0.2%
        const delta = item.price * deltaPercent;
        const newPrice = Number((item.price + delta).toFixed(item.price < 10 ? 4 : 2));
        const newChange = Number((item.change + delta).toFixed(2));
        const newChangePct = Number(
          ((newChange / (newPrice - newChange)) * 100).toFixed(2)
        );

        flashUpdates[item.id] = delta >= 0 ? 'up' : 'down';

        return {
          ...item,
          price: newPrice,
          change: newChange,
          changePercent: newChangePct,
        };
      };

      if (rand < 0.35) {
        setIndices((prev) => {
          const targetIdx = Math.floor(Math.random() * prev.length);
          return prev.map((item, idx) => (idx === targetIdx ? updateItem(item) : item));
        });
      } else if (rand < 0.65) {
        setVolumeStocks((prev) => {
          const targetIdx = Math.floor(Math.random() * prev.length);
          return prev.map((item, idx) => (idx === targetIdx ? updateItem(item) : item));
        });
      } else if (rand < 0.85) {
        setCryptoList((prev) => {
          const targetIdx = Math.floor(Math.random() * prev.length);
          return prev.map((item, idx) => (idx === targetIdx ? updateItem(item) : item));
        });
      } else {
        setWorldIndices((prev) => {
          const targetIdx = Math.floor(Math.random() * prev.length);
          return prev.map((item, idx) => (idx === targetIdx ? updateItem(item) : item));
        });
      }

      setPriceFlashMap(flashUpdates);

      // Clear flash after 800ms
      setTimeout(() => {
        setPriceFlashMap({});
      }, 850);
    }, 2800);

    return () => clearInterval(interval);
  }, [liveUpdatesEnabled]);

  // Keep modal selected instrument synced with live prices
  useEffect(() => {
    if (!selectedInstrument) return;
    const all = [
      ...indices,
      ...worldIndices,
      ...volumeStocks,
      ...gainers,
      ...losers,
      ...cryptoList,
      ...forexList,
    ];
    const fresh = all.find((item) => item.id === selectedInstrument.id);
    if (fresh && fresh.price !== selectedInstrument.price) {
      setSelectedInstrument(fresh);
    }
  }, [indices, worldIndices, volumeStocks, gainers, losers, cryptoList, forexList, selectedInstrument]);

  const handleToggleWatchlist = (instrument: Instrument) => {
    setWatchlist((prev) => {
      const exists = prev.some((i) => i.id === instrument.id);
      if (exists) {
        return prev.filter((i) => i.id !== instrument.id);
      } else {
        return [...prev, instrument];
      }
    });
  };

  const handleRemoveFromWatchlist = (instrumentId: string) => {
    setWatchlist((prev) => prev.filter((i) => i.id !== instrumentId));
  };

  const handleAddDefaultWatchlist = () => {
    setWatchlist([PRIMARY_INDICES[0], HIGHEST_VOLUME_STOCKS[0], CRYPTO_COINS[0]]);
  };

  const isCurrentWatchlisted = Boolean(
    selectedInstrument && watchlist.some((w) => w.id === selectedInstrument.id)
  );

  const regionOptions = [
    { label: 'Everywhere', desc: 'All Global Exchanges' },
    { label: 'Americas', desc: 'US, Canada, Mexico' },
    { label: 'Europe', desc: 'UK, Germany, France, Switzerland' },
    { label: 'Asia-Pacific', desc: 'Japan, Hong Kong, Australia' },
  ];

  // Primary highlight indices based on selected category
  const activeSnapshotIndices =
    activeCategory === 'Crypto'
      ? cryptoList.slice(0, 3)
      : activeCategory === 'Forex'
      ? forexList.slice(0, 3)
      : activeCategory === 'World stocks'
      ? worldIndices.slice(0, 3)
      : indices;

  return (
    <div className="min-h-screen font-sans flex flex-col justify-between bg-white text-[#131722] selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <Header
        onOpenSearch={() => setSearchOpen(true)}
        onOpenWatchlist={() => setWatchlistOpen(true)}
        watchlistCount={watchlist.length}
        liveUpdatesEnabled={liveUpdatesEnabled}
        onToggleLiveUpdates={() => setLiveUpdatesEnabled(!liveUpdatesEnabled)}
        onGetStarted={() => setGetStartedOpen(true)}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
      />

      {/* Main Content */}
      <main className="grow max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <section className="text-center pt-4 pb-10" data-purpose="hero-title">
          <div className="relative inline-block">
            <button
              onClick={() => setRegionMenuOpen(!regionMenuOpen)}
              className="inline-flex items-center justify-center gap-3 cursor-pointer group focus:outline-none"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#131722] text-balance">
                Markets, {selectedRegion.toLowerCase()}
              </h1>
              <ChevronDown className="w-8 h-8 sm:w-10 sm:h-10 text-[#131722] stroke-[3] group-hover:translate-y-1 transition-transform" />
            </button>

            {/* Region Selector Dropdown */}
            {regionMenuOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-white border border-[#e0e3eb] rounded-2xl shadow-xl py-2 z-30 text-left">
                <div className="px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#6a6d78]">
                  Select Market Region
                </div>
                {regionOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      setSelectedRegion(opt.label);
                      setRegionMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 hover:bg-[#f0f3fa] text-xs flex items-center justify-between text-[#131722] transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-sm">{opt.label}</div>
                      <div className="text-[11px] text-[#6a6d78]">{opt.desc}</div>
                    </div>
                    {selectedRegion === opt.label && (
                      <Check className="w-4 h-4 text-[#2962ff]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SubCategory Filter Pills Bar */}
        <CategoryFilterBar
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
        />

        {/* Primary Indices Overview (S&P 500, Nasdaq 100, Dow 30) */}
        <IndicesSnapshot
          indices={activeSnapshotIndices}
          onSelectInstrument={(item) => setSelectedInstrument(item)}
          priceFlashMap={priceFlashMap}
        />

        {/* World Indices Section */}
        <WorldIndicesTable
          indices={worldIndices}
          onSelectInstrument={(item) => setSelectedInstrument(item)}
          priceFlashMap={priceFlashMap}
        />

        {/* US Stocks & Movers Section (Highest Volume, Gainers, Losers) */}
        <USStocksMovers
          highestVolume={volumeStocks}
          gainers={gainers}
          losers={losers}
          onSelectInstrument={(item) => setSelectedInstrument(item)}
          priceFlashMap={priceFlashMap}
        />

        {/* Crypto and Forex Summary */}
        <CryptoAndForex
          cryptoCoins={cryptoList}
          currencyPairs={forexList}
          onSelectInstrument={(item) => setSelectedInstrument(item)}
          priceFlashMap={priceFlashMap}
        />
      </main>

      {/* Footer */}
      <Footer onNavClick={(link) => setActiveNav(link)} />

      {/* Interactive Symbol Inspector Modal */}
      <SymbolModal
        instrument={selectedInstrument}
        onClose={() => setSelectedInstrument(null)}
        isWatchlisted={isCurrentWatchlisted}
        onToggleWatchlist={handleToggleWatchlist}
      />

      {/* Command Palette Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        instruments={ALL_INSTRUMENTS}
        onSelectInstrument={(item) => setSelectedInstrument(item)}
      />

      {/* Watchlist Slide-out Drawer */}
      <WatchlistDrawer
        isOpen={watchlistOpen}
        onClose={() => setWatchlistOpen(false)}
        watchlist={watchlist}
        onSelectInstrument={(item) => setSelectedInstrument(item)}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
        onAddDefaultItems={handleAddDefaultWatchlist}
      />

      {/* "Get Started" Modal */}
      <GetStartedModal
        isOpen={getStartedOpen}
        onClose={() => setGetStartedOpen(false)}
      />
    </div>
  );
}
