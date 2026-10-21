import React from 'react';
import { ArrowRight, BatteryCharging, CheckCircle, ChevronRight, Recycle, ShieldCheck, Sparkles, Truck } from 'lucide-react';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreCatalog: () => void;
  onViewRecyclers: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onExploreCatalog,
  onViewRecyclers,
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        {/* 2-Column Balanced Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Proposition & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 rounded-md px-2.5 py-1 w-fit mb-4">
              <Recycle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Government & CPCB Certified E-Waste Recovery</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 tracking-tight leading-[1.15] text-balance">
              Recycle your electronics. Earn rewards. Protect the planet.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
              Don't let old phones, dead laptops, swollen batteries, and tangled cables end up in regular landfills. Book doorstep collection in under 60 seconds, hand over to verified collectors, and receive instant cash payouts or partner gift vouchers.
            </p>

            {/* Core Value Adjacency */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-700">
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900 block">Free Doorstep Pickup</span>
                  <span className="text-neutral-500">Scheduled at your convenient time</span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900 block">R2v3 Certified Recyclers</span>
                  <span className="text-neutral-500">Safe lithium handling & data wipe</span>
                </div>
              </div>
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-neutral-50 border border-neutral-100">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-900 block">Instant Reward Points</span>
                  <span className="text-neutral-500">Cash via UPI, bank, or brand vouchers</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenBooking}
                className="px-6 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] rounded-lg shadow-sm transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>Book Doorstep Pickup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreCatalog}
                className="px-5 py-3 text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 active:scale-[0.99] rounded-lg transition-all whitespace-nowrap"
              >
                Check E-Waste Cash Values
              </button>
              <button
                onClick={onViewRecyclers}
                className="px-4 py-3 text-xs font-medium text-emerald-800 hover:text-emerald-900 hover:underline flex items-center gap-1 whitespace-nowrap"
              >
                <span>View Authorized Centers</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative flex items-center">
            <div className="w-full h-full min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 shadow-sm relative group">
              <img
                src="/src/assets/images/hero_ewaste_recycling_1792430542218.jpg"
                alt="Authorized e-waste circular economy disassembly and recycling workspace"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  // Fallback container in case image is missing
                  e.currentTarget.style.display = 'none';
                  const fb = e.currentTarget.nextElementSibling;
                  if (fb) fb.classList.remove('hidden');
                }}
              />
              {/* Fallback container */}
              <div className="hidden absolute inset-0 bg-gradient-to-br from-emerald-900 to-slate-900 p-8 flex flex-col justify-end text-white">
                <Recycle className="w-12 h-12 text-emerald-400 mb-3" />
                <h3 className="text-xl font-bold">Circular Electronics Recovery</h3>
                <p className="text-xs text-neutral-300 mt-1">
                  Reclaiming gold, copper, and precious metals while neutralizing lithium battery hazards.
                </p>
              </div>

              {/* Verified Process floating tag */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-neutral-200 rounded-lg p-3 text-xs text-neutral-800 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-neutral-900">Doorstep Verification & Data Sanitization</span>
                </div>
                <span className="text-neutral-500 font-mono text-[11px]">ISO 14001</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Proof & Impact Strip */}
        <div className="mt-12 pt-8 border-t border-neutral-100 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
              18,450 kg
            </span>
            <span className="text-xs font-medium text-neutral-500 mt-1">
              CO₂ Emissions Prevented
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
              4,210 kg
            </span>
            <span className="text-xs font-medium text-neutral-500 mt-1">
              Hazardous E-Waste Diverted
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
              100%
            </span>
            <span className="text-xs font-medium text-neutral-500 mt-1">
              R2v3 / CPCB Authorized Plants
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tabular-nums">
              ₹3,42,800+
            </span>
            <span className="text-xs font-medium text-neutral-500 mt-1">
              Direct Household Payouts Awarded
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
