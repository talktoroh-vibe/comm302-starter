import React, { useState } from 'react';
import { Instrument, ChartPoint } from '../types/market';
import { X, Bookmark, BookmarkCheck, TrendingUp, TrendingDown, BarChart2, Activity, DollarSign } from 'lucide-react';

interface SymbolModalProps {
  instrument: Instrument | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (instrument: Instrument) => void;
}

type Timeframe = '1D' | '5D' | '1M' | '1Y';
type ChartStyle = 'line' | 'candlestick';

export const SymbolModal: React.FC<SymbolModalProps> = ({
  instrument,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  if (!instrument) return null;

  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('line');
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);
  const [orderType, setOrderType] = useState<'BUY' | 'SELL' | null>(null);
  const [orderShares, setOrderShares] = useState<number>(10);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  const isPositive = instrument.change >= 0;
  const chartPoints = instrument.chartData[timeframe] || instrument.chartData['1D'];

  // Min and max for chart scale
  const prices = chartPoints.map((p) => p.price);
  const minPrice = Math.min(...prices) * 0.998;
  const maxPrice = Math.max(...prices) * 1.002;
  const priceRange = maxPrice - minPrice || 1;

  // SVG dimensions
  const svgWidth = 720;
  const svgHeight = 260;
  const chartBottom = svgHeight - 40;

  // Convert points to SVG coordinates
  const svgCoords = chartPoints.map((pt, idx) => {
    const x = (idx / (chartPoints.length - 1)) * svgWidth;
    const y = chartBottom - ((pt.price - minPrice) / priceRange) * (chartBottom - 20);
    return { x, y, pt };
  });

  const linePath = svgCoords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  const areaPath = `${linePath} L ${svgWidth} ${chartBottom} L 0 ${chartBottom} Z`;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
    const pointIdx = Math.round(ratio * (chartPoints.length - 1));
    if (chartPoints[pointIdx]) {
      setHoveredPoint(chartPoints[pointIdx]);
    }
  };

  const handleExecuteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const total = (instrument.price * orderShares).toFixed(2);
    setOrderSuccessMsg(
      `Filled: ${orderType} ${orderShares} shares of ${instrument.symbol} @ $${instrument.price.toFixed(2)} (Total: $${total})`
    );
    setTimeout(() => {
      setOrderType(null);
      setOrderSuccessMsg(null);
    }, 2800);
  };

  const dayRange = instrument.details.dayRange;
  const yearRange = instrument.details.yearRange;
  const dayProgress = Math.max(
    0,
    Math.min(100, ((instrument.price - dayRange[0]) / (dayRange[1] - dayRange[0])) * 100)
  );
  const yearProgress = Math.max(
    0,
    Math.min(100, ((instrument.price - yearRange[0]) / (yearRange[1] - yearRange[0])) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#e0e3eb] flex flex-col no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#e0e3eb] flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            {instrument.countryCode ? (
              <span className="w-8 h-6 bg-slate-100 rounded-sm flex items-center justify-center text-xs font-bold border border-slate-300">
                {instrument.countryCode}
              </span>
            ) : instrument.badge ? (
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-xs"
                style={{ backgroundColor: instrument.badge.bgColor }}
              >
                {instrument.badge.text}
              </span>
            ) : null}

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#131722]">{instrument.symbol}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#f0f3fa] text-[#6a6d78] font-medium">
                  {instrument.category.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#6a6d78]">{instrument.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(instrument)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                isWatchlisted
                  ? 'bg-blue-50 border-blue-200 text-[#2962ff]'
                  : 'bg-white border-[#e0e3eb] text-[#131722] hover:bg-[#f0f3fa]'
              }`}
            >
              {isWatchlisted ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-[#2962ff]" />
                  <span>In Watchlist</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-slate-500" />
                  <span>+ Watchlist</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-[#f0f3fa] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Price Overview Banner */}
          <div className="flex flex-wrap items-baseline justify-between gap-4 pb-4 border-b border-[#f0f3fa]">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#131722] font-mono tabular-nums">
                  {instrument.price >= 10
                    ? instrument.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : instrument.price.toFixed(5)}
                </span>
                <span className="text-sm text-[#6a6d78]">USD</span>

                <div
                  className={`flex items-center gap-1 text-sm font-semibold px-2.5 py-1 rounded-md font-mono tabular-nums ${
                    isPositive
                      ? 'text-[#089981] bg-[#089981]/10'
                      : 'text-[#f23645] bg-[#f23645]/10'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {instrument.change.toFixed(2)} ({isPositive ? '+' : ''}
                    {instrument.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <div className="text-xs text-[#6a6d78] mt-1">
                {hoveredPoint
                  ? `At ${hoveredPoint.time}: $${hoveredPoint.price.toFixed(2)}`
                  : 'Real-time aggregated global feeds · Market Open'}
              </div>
            </div>

            {/* Quick Action Trading Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOrderType('BUY')}
                className="px-5 py-2 bg-[#089981] hover:bg-[#07806c] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
              >
                Buy {instrument.symbol}
              </button>
              <button
                onClick={() => setOrderType('SELL')}
                className="px-5 py-2 bg-[#f23645] hover:bg-[#d42d3a] text-white text-xs font-bold rounded-lg shadow-sm transition-all"
              >
                Sell
              </button>
            </div>
          </div>

          {/* Paper Trade Form Drawer */}
          {orderType && (
            <div className="p-4 bg-[#f8f9fd] border border-[#e0e3eb] rounded-2xl animate-in slide-in-from-top-2 duration-150">
              {orderSuccessMsg ? (
                <div className="text-center py-2 text-sm font-semibold text-[#089981]">
                  ✓ {orderSuccessMsg}
                </div>
              ) : (
                <form onSubmit={handleExecuteOrder} className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        orderType === 'BUY'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      Instant {orderType} Order
                    </span>
                    <label className="text-xs text-[#6a6d78] flex items-center gap-1.5">
                      Units:
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={orderShares}
                        onChange={(e) => setOrderShares(Math.max(1, Number(e.target.value)))}
                        className="w-20 px-2 py-1 text-xs border border-[#e0e3eb] rounded-md font-mono text-[#131722] bg-white"
                      />
                    </label>
                    <span className="text-xs text-[#6a6d78] font-mono">
                      Est. Total: ${(instrument.price * orderShares).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className={`px-4 py-1.5 text-xs font-bold text-white rounded-lg transition-colors ${
                        orderType === 'BUY' ? 'bg-[#089981] hover:bg-[#07806c]' : 'bg-[#f23645] hover:bg-[#d42d3a]'
                      }`}
                    >
                      Confirm {orderType}
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderType(null)}
                      className="px-3 py-1.5 text-xs text-[#6a6d78] hover:text-[#131722]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Interactive Chart Container */}
          <div className="border border-[#e0e3eb] rounded-2xl p-4 bg-white shadow-xs">
            {/* Chart Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-2 border-b border-[#f0f3fa]">
              <div className="flex items-center gap-1 bg-[#f0f3fa] p-1 rounded-lg">
                {(['1D', '5D', '1M', '1Y'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                      timeframe === tf
                        ? 'bg-white text-[#131722] shadow-xs'
                        : 'text-[#6a6d78] hover:text-[#131722]'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChartStyle('line')}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                    chartStyle === 'line'
                      ? 'bg-[#2962ff]/10 text-[#2962ff]'
                      : 'text-[#6a6d78] hover:bg-[#f0f3fa]'
                  }`}
                  title="Line Chart"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Line</span>
                </button>
                <button
                  onClick={() => setChartStyle('candlestick')}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                    chartStyle === 'candlestick'
                      ? 'bg-[#2962ff]/10 text-[#2962ff]'
                      : 'text-[#6a6d78] hover:bg-[#f0f3fa]'
                  }`}
                  title="Candlestick Chart"
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Candles</span>
                </button>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div className="relative w-full h-[260px] select-none">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-full cursor-crosshair overflow-visible"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={isPositive ? '#089981' : '#f23645'}
                      stopOpacity="0.25"
                    />
                    <stop
                      offset="100%"
                      stopColor={isPositive ? '#089981' : '#f23645'}
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
                  const y = chartBottom * ratio;
                  const priceLabel = maxPrice - ratio * priceRange;
                  return (
                    <g key={ratio}>
                      <line
                        x1="0"
                        y1={y}
                        x2={svgWidth}
                        y2={y}
                        stroke="#f0f3fa"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={svgWidth - 5}
                        y={y - 4}
                        textAnchor="end"
                        fontSize="10"
                        fill="#9ca3af"
                        className="font-mono"
                      >
                        {priceLabel >= 10 ? priceLabel.toFixed(1) : priceLabel.toFixed(4)}
                      </text>
                    </g>
                  );
                })}

                {/* Candlestick view vs Line view */}
                {chartStyle === 'candlestick' ? (
                  chartPoints.map((pt, i) => {
                    const x = (i / (chartPoints.length - 1)) * svgWidth;
                    const candleOpen = pt.open ?? pt.price;
                    const candleClose = pt.close ?? pt.price;
                    const candleHigh = pt.high ?? Math.max(candleOpen, candleClose);
                    const candleLow = pt.low ?? Math.min(candleOpen, candleClose);

                    const yHigh = chartBottom - ((candleHigh - minPrice) / priceRange) * (chartBottom - 20);
                    const yLow = chartBottom - ((candleLow - minPrice) / priceRange) * (chartBottom - 20);
                    const yOpen = chartBottom - ((candleOpen - minPrice) / priceRange) * (chartBottom - 20);
                    const yClose = chartBottom - ((candleClose - minPrice) / priceRange) * (chartBottom - 20);

                    const isUp = candleClose >= candleOpen;
                    const candleColor = isUp ? '#089981' : '#f23645';

                    return (
                      <g key={i}>
                        {/* Wick */}
                        <line
                          x1={x}
                          y1={yHigh}
                          x2={x}
                          y2={yLow}
                          stroke={candleColor}
                          strokeWidth="1.5"
                        />
                        {/* Body */}
                        <rect
                          x={x - 4}
                          y={Math.min(yOpen, yClose)}
                          width="8"
                          height={Math.max(2, Math.abs(yClose - yOpen))}
                          fill={candleColor}
                          rx="1"
                        />
                      </g>
                    );
                  })
                ) : (
                  <>
                    {/* Area fill */}
                    <path d={areaPath} fill="url(#chartGradient)" />
                    {/* Stroke line */}
                    <path
                      d={linePath}
                      fill="none"
                      stroke={isPositive ? '#089981' : '#f23645'}
                      strokeWidth="2.5"
                    />
                  </>
                )}

                {/* Volume histogram bars at bottom */}
                {chartPoints.map((pt, i) => {
                  const x = (i / (chartPoints.length - 1)) * svgWidth;
                  const volHeight = ((pt.volume || 100000) / 600000) * 35;
                  return (
                    <rect
                      key={`vol-${i}`}
                      x={x - 3}
                      y={chartBottom - volHeight}
                      width="6"
                      height={volHeight}
                      fill="#e0e3eb"
                      opacity="0.6"
                    />
                  );
                })}

                {/* Hover crosshair */}
                {hoveredPoint && (
                  <g>
                    {(() => {
                      const idx = chartPoints.indexOf(hoveredPoint);
                      const ptCoord = svgCoords[idx];
                      if (!ptCoord) return null;
                      return (
                        <>
                          <line
                            x1={ptCoord.x}
                            y1="0"
                            x2={ptCoord.x}
                            y2={chartBottom}
                            stroke="#6a6d78"
                            strokeWidth="1"
                            strokeDasharray="3 3"
                          />
                          <circle
                            cx={ptCoord.x}
                            cy={ptCoord.y}
                            r="5"
                            fill={isPositive ? '#089981' : '#f23645'}
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                        </>
                      );
                    })()}
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Technical Summary Gauge & Key Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Technical Rating Gauge */}
            <div className="border border-[#e0e3eb] rounded-2xl p-4 bg-[#f8f9fd]">
              <h4 className="text-xs font-bold text-[#6a6d78] uppercase tracking-wider mb-3">
                Technical Analysis Rating
              </h4>
              <div className="text-center py-3">
                <div
                  className={`text-2xl font-bold mb-1 ${
                    instrument.technicalRating.includes('Buy')
                      ? 'text-[#089981]'
                      : instrument.technicalRating.includes('Sell')
                      ? 'text-[#f23645]'
                      : 'text-[#6a6d78]'
                  }`}
                >
                  {instrument.technicalRating}
                </div>
                <div className="text-xs text-[#6a6d78]">Summary of 26 technical indicators</div>

                {/* Speedometer Bar */}
                <div className="mt-4 flex gap-1 h-2 rounded-full overflow-hidden bg-slate-200">
                  <div
                    className={`flex-1 ${
                      instrument.technicalRating === 'Strong Sell'
                        ? 'bg-[#f23645]'
                        : 'bg-slate-300'
                    }`}
                  />
                  <div
                    className={`flex-1 ${
                      instrument.technicalRating === 'Sell' ? 'bg-[#f23645]' : 'bg-slate-300'
                    }`}
                  />
                  <div
                    className={`flex-1 ${
                      instrument.technicalRating === 'Neutral' ? 'bg-amber-400' : 'bg-slate-300'
                    }`}
                  />
                  <div
                    className={`flex-1 ${
                      instrument.technicalRating === 'Buy' ? 'bg-[#089981]' : 'bg-slate-300'
                    }`}
                  />
                  <div
                    className={`flex-1 ${
                      instrument.technicalRating === 'Strong Buy'
                        ? 'bg-[#089981]'
                        : 'bg-slate-300'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-[#6a6d78] mt-1.5">
                  <span>Strong Sell</span>
                  <span>Neutral</span>
                  <span>Strong Buy</span>
                </div>
              </div>
            </div>

            {/* Ranges & Volume */}
            <div className="border border-[#e0e3eb] rounded-2xl p-4 bg-[#f8f9fd] space-y-3.5">
              <h4 className="text-xs font-bold text-[#6a6d78] uppercase tracking-wider">
                Price Ranges
              </h4>

              {/* Day Range */}
              <div>
                <div className="flex justify-between text-xs text-[#6a6d78] mb-1 font-mono">
                  <span>Day's Low: ${dayRange[0].toFixed(2)}</span>
                  <span>High: ${dayRange[1].toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2962ff] h-full rounded-full"
                    style={{ width: `${dayProgress}%` }}
                  />
                </div>
              </div>

              {/* 52-Week Range */}
              <div>
                <div className="flex justify-between text-xs text-[#6a6d78] mb-1 font-mono">
                  <span>52W Low: ${yearRange[0].toFixed(2)}</span>
                  <span>52W High: ${yearRange[1].toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${yearProgress}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-between text-xs text-[#131722] border-t border-[#e0e3eb]">
                <span className="text-[#6a6d78]">Volume:</span>
                <span className="font-semibold font-mono">{instrument.details.volume}</span>
              </div>
            </div>

            {/* Key Statistics */}
            <div className="border border-[#e0e3eb] rounded-2xl p-4 bg-[#f8f9fd] space-y-2 text-xs">
              <h4 className="font-bold text-[#6a6d78] uppercase tracking-wider mb-2">
                Key Fundamentals
              </h4>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-[#6a6d78]">Open</span>
                <span className="font-semibold font-mono text-[#131722]">
                  ${instrument.details.open.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-[#6a6d78]">Prev Close</span>
                <span className="font-semibold font-mono text-[#131722]">
                  ${instrument.details.prevClose.toFixed(2)}
                </span>
              </div>
              {instrument.details.marketCap && (
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-[#6a6d78]">Market Cap</span>
                  <span className="font-semibold font-mono text-[#131722]">
                    {instrument.details.marketCap}
                  </span>
                </div>
              )}
              {instrument.details.peRatio && (
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-[#6a6d78]">P/E Ratio</span>
                  <span className="font-semibold font-mono text-[#131722]">
                    {instrument.details.peRatio}
                  </span>
                </div>
              )}
              {instrument.details.beta && (
                <div className="flex justify-between py-1">
                  <span className="text-[#6a6d78]">Beta</span>
                  <span className="font-semibold font-mono text-[#131722]">
                    {instrument.details.beta}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="text-xs leading-relaxed text-[#6a6d78] pt-2">
            <span className="font-semibold text-[#131722]">About {instrument.name}: </span>
            {instrument.details.description}
          </div>
        </div>
      </div>
    </div>
  );
};
