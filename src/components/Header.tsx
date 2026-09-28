import React, { useState, useEffect } from 'react';
import { Search, Globe, User, Bookmark, Check, Menu, X, Radio } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenWatchlist: () => void;
  watchlistCount: number;
  liveUpdatesEnabled: boolean;
  onToggleLiveUpdates: () => void;
  onGetStarted: () => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenWatchlist,
  watchlistCount,
  liveUpdatesEnabled,
  onToggleLiveUpdates,
  onGetStarted,
  activeNav,
  setActiveNav,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const languages = [
    { code: 'EN', name: 'English (US)' },
    { code: 'DE', name: 'Deutsch' },
    { code: 'FR', name: 'Français' },
    { code: 'ES', name: 'Español' },
    { code: 'JA', name: '日本語' },
    { code: 'ZH', name: '简体中文' },
  ];

  const navLinks = ['Products', 'Community', 'Markets', 'Brokers', 'More'];

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#f0f3fa] h-[72px] px-4 md:px-8 flex items-center justify-between transition-colors">
      {/* Left: Brand + Search */}
      <div className="flex items-center gap-6">
        {/* TradingView Geometric Logo */}
        <button
          onClick={() => setActiveNav('Markets')}
          aria-label="TradingView Home"
          className="flex items-center text-black hover:opacity-80 transition-opacity focus:outline-none"
        >
          <svg
            className="text-black"
            fill="none"
            height="28"
            viewBox="0 0 36 28"
            width="36"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M12.4444 0H0V28H12.4444V0ZM23.5556 8.55556H15.1111V28H23.5556V8.55556ZM36 17.1111H27.5556V28H36V17.1111Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </button>

        {/* Search Bar Pill (Ctrl+K) */}
        <div className="relative hidden sm:flex items-center">
          <button
            onClick={onOpenSearch}
            className="flex items-center w-52 md:w-64 h-10 px-3.5 bg-[#f0f3fa] hover:bg-[#e4e7f0] rounded-full cursor-pointer transition-colors text-[#6a6d78] text-sm group text-left"
          >
            <Search className="w-4 h-4 mr-2.5 text-[#6a6d78] group-hover:text-[#131722] transition-colors" />
            <span className="font-normal select-none truncate text-[#6a6d78] group-hover:text-[#131722]">
              Search (Ctrl+K)
            </span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium tracking-tight text-[#131722]">
          {navLinks.map((item) => {
            const isActive = activeNav === item;
            return (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`relative py-2 transition-colors focus:outline-none ${
                  isActive ? 'text-[#2962ff] font-semibold' : 'text-[#131722] hover:text-[#2962ff]'
                }`}
              >
                {item}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2962ff] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right: Live Toggle, Watchlist, Language, Profile, CTA Button */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Real-time Ticker Simulation Indicator */}
        <button
          onClick={onToggleLiveUpdates}
          title={liveUpdatesEnabled ? 'Market Feed: Live (click to pause)' : 'Market Feed: Paused (click to resume)'}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
            liveUpdatesEnabled
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              liveUpdatesEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
            }`}
          />
          <span className="font-mono text-[11px]">{liveUpdatesEnabled ? 'LIVE' : 'PAUSED'}</span>
        </button>

        {/* Watchlist Quick Access */}
        <button
          onClick={onOpenWatchlist}
          className="relative p-2 text-[#131722] hover:bg-[#f0f3fa] rounded-full transition-colors focus:outline-none"
          title="Open Watchlist"
        >
          <Bookmark className="w-5 h-5" />
          {watchlistCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#2962ff] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              {watchlistCount}
            </span>
          )}
        </button>

        {/* Language Picker Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#131722] hover:text-[#2962ff] px-2 py-1.5 rounded transition-colors focus:outline-none"
            title="Select language"
          >
            <Globe className="w-4 h-4 text-[#131722]" />
            <span>{currentLang}</span>
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-[#e0e3eb] rounded-xl shadow-lg py-1.5 z-50 text-xs font-medium">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setCurrentLang(l.code);
                    setLangDropdownOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-[#f0f3fa] flex items-center justify-between text-[#131722]"
                >
                  <span>{l.name}</span>
                  {currentLang === l.code && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile Avatar Button */}
        <button
          onClick={onOpenWatchlist}
          className="p-2 text-[#131722] hover:bg-[#f0f3fa] rounded-full transition-colors focus:outline-none"
          title="Account & Watchlist"
        >
          <User className="w-5 h-5 text-[#131722]" />
        </button>

        {/* CTA 'Get started' Button */}
        <button
          onClick={onGetStarted}
          className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#1e53e5] via-[#2962ff] to-[#a855f7] rounded-full hover:shadow-md hover:opacity-95 transition-all whitespace-nowrap active:scale-95"
        >
          Get started
        </button>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#131722] hover:bg-[#f0f3fa] rounded-full"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-white border-b border-[#e0e3eb] shadow-xl p-4 flex flex-col gap-3 z-50">
          <div className="sm:hidden mb-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="flex items-center w-full h-10 px-3.5 bg-[#f0f3fa] rounded-full text-[#6a6d78] text-sm"
            >
              <Search className="w-4 h-4 mr-2" />
              <span>Search symbols (Ctrl+K)</span>
            </button>
          </div>
          {navLinks.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveNav(item);
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 rounded-lg text-sm font-semibold ${
                activeNav === item ? 'bg-[#2962ff]/10 text-[#2962ff]' : 'text-[#131722]'
              }`}
            >
              {item}
            </button>
          ))}
          <div className="pt-2 border-t border-[#f0f3fa] flex items-center justify-between">
            <button
              onClick={onToggleLiveUpdates}
              className="text-xs text-slate-600 flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              Live Simulation: {liveUpdatesEnabled ? 'Active' : 'Off'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
