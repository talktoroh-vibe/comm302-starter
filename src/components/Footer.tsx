import React from 'react';

interface FooterProps {
  onNavClick?: (link: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  const footerLinks = [
    'Markets',
    'Screeners',
    'Community Ideas',
    'Pine Script™',
    'Help Center',
    'Terms of Service',
    'Privacy Policy',
  ];

  return (
    <footer className="border-t border-[#e0e3eb] bg-[#f8f9fd] pt-12 pb-8 text-[#6a6d78] text-xs mt-auto">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#e0e3eb]">
          <div className="flex items-center gap-3">
            <svg className="text-black" fill="none" height="24" viewBox="0 0 36 28" width="30">
              <path
                clipRule="evenodd"
                d="M12.4444 0H0V28H12.4444V0ZM23.5556 8.55556H15.1111V28H23.5556V8.55556ZM36 17.1111H27.5556V28H36V17.1111Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
            <span className="text-sm font-bold text-[#131722]">TradingView</span>
            <span className="text-xs text-[#6a6d78]">Look first / Then leap.</span>
          </div>

          <div className="flex flex-wrap gap-6 text-xs font-medium text-[#131722]">
            {footerLinks.map((link) => (
              <button
                key={link}
                onClick={() => onNavClick?.(link)}
                className="hover:text-[#2962ff] transition-colors focus:outline-none"
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] leading-relaxed max-w-3xl text-left">
            Market data is provided for informational purposes only and is not intended for trading purposes. TradingView does not verify any data and disclaims any obligation to do so. Quotations may be delayed.
          </p>
          <p className="text-[11px] whitespace-nowrap">
            © 2025 TradingView, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
