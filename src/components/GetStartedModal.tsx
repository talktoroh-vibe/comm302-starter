import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2400);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#e0e3eb] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-[#f0f3fa] rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto" />
            <h3 className="text-2xl font-bold text-[#131722]">Welcome to TradingView!</h3>
            <p className="text-xs text-[#6a6d78]">
              Your instant market access workspace has been activated for <strong className="text-[#131722]">{email}</strong>.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex p-3 bg-blue-50 text-[#2962ff] rounded-2xl mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#131722] tracking-tight">
                Get started with TradingView
              </h3>
              <p className="text-xs text-[#6a6d78] mt-1">
                Track global markets, customize interactive screeners, and deploy technical strategies.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-[#f8f9fd] rounded-xl text-xs text-[#131722]">
                <Zap className="w-4 h-4 text-[#2962ff] shrink-0" />
                <span>Real-time feeds across 100+ global exchanges</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#f8f9fd] rounded-xl text-xs text-[#131722]">
                <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero-latency charting engine with technical indicators</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#f8f9fd] rounded-xl text-xs text-[#131722]">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Free cloud watchlists synced across all devices</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 text-sm border border-[#e0e3eb] rounded-xl outline-none focus:border-[#2962ff] focus:ring-2 focus:ring-blue-100"
              />
              <button
                type="submit"
                className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#1e53e5] via-[#2962ff] to-[#a855f7] rounded-xl hover:shadow-lg transition-all"
              >
                Create free account
              </button>
            </form>

            <p className="text-[11px] text-[#6a6d78] text-center">
              By continuing, you agree to our Terms of Service & Privacy Policy. No credit card required.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
