export type MarketCategory =
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface ChartPoint {
  time: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
}

export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  category: 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds' | 'etfs';
  marketCategory: MarketCategory;
  price: number;
  change: number;
  changePercent: number;
  currency?: string;
  countryCode?: string;
  badge?: {
    text: string;
    bgColor: string;
    textColor?: string;
  };
  technicalRating: TechnicalRating;
  sparkline: number[]; // Normalized or raw points for mini sparkline
  chartData: {
    '1D': ChartPoint[];
    '5D': ChartPoint[];
    '1M': ChartPoint[];
    '1Y': ChartPoint[];
  };
  details: {
    open: number;
    high: number;
    low: number;
    volume: string;
    prevClose: number;
    dayRange: [number, number];
    yearRange: [number, number];
    peRatio?: number | string;
    marketCap?: string;
    dividendYield?: string;
    beta?: number;
    description: string;
  };
}

export interface MoverItem {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  changeValue?: number;
  badgeText: string;
  badgeBg: string;
  badgeTextColor: string;
  instrumentId: string;
}
