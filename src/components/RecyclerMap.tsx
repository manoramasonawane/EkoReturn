import React, { useState } from 'react';
import { Check, CheckCircle2, ChevronRight, Clock, ExternalLink, Filter, MapPin, Navigation, Phone, Search, ShieldCheck, Star } from 'lucide-react';
import { AUTHORIZED_RECYCLERS, EWASTE_CATEGORIES } from '../data/mockData';
import { AuthorizedRecycler } from '../types';

interface RecyclerMapProps {
  onSelectRecyclerForBooking?: (recyclerId: string) => void;
}

export const RecyclerMap: React.FC<RecyclerMapProps> = ({
  onSelectRecyclerForBooking,
}) => {
  const [selectedRecycler, setSelectedRecycler] = useState<AuthorizedRecycler>(AUTHORIZED_RECYCLERS[0]);
  const [filterCertification, setFilterCertification] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecyclers = AUTHORIZED_RECYCLERS.filter((rec) => {
    const matchesCert = filterCertification === 'all' || rec.certification === filterCertification;
    const matchesSearch =
      rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCert && matchesSearch;
  });

  return (
    <section className="py-8 bg-neutral-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-emerald-800 tracking-wider uppercase block mb-1">
              Authorized E-Waste Network
            </span>
            <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
              Verified Collection Centers & Recyclers
            </h2>
            <p className="text-xs text-neutral-600 max-w-2xl mt-1">
              All partner facilities hold valid Central Pollution Control Board (CPCB) authorizations, R2v3, and e-Stewards certifications to guarantee zero illegal dumping and safe chemical handling.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by area or facility..."
              className="w-full text-xs pl-9 pr-3 py-2 border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Filter tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-neutral-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['all', 'R2v3', 'e-Stewards', 'CPCB Authorized', 'ISO 14001'].map((cert) => (
            <button
              key={cert}
              onClick={() => setFilterCertification(cert)}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap font-medium ${
                filterCertification === cert
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              {cert === 'all' ? 'All Certified' : cert}
            </button>
          ))}
        </div>

        {/* 2-Column: Interactive City Map Visualization & Recycler Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Map Visualizer */}
          <div className="lg:col-span-7 bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 shadow-md">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">Bengaluru Metropolitan E-Waste Hub Map</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {filteredRecyclers.length} Licensed Nodes
              </span>
            </div>

            {/* Simulated Map Canvas */}
            <div className="h-[380px] bg-neutral-950 relative overflow-hidden flex items-center justify-center">
              {/* City grid layout */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

              {/* Major arterial roads */}
              <svg className="absolute inset-0 w-full h-full text-neutral-800" stroke="currentColor" strokeWidth="2.5" fill="none">
                <path d="M 50 50 Q 200 180 550 150" />
                <path d="M 120 350 L 320 200 L 480 320" />
                <path d="M 320 30 L 320 350" strokeDasharray="4 4" />
                <path d="M 50 200 L 580 200" strokeDasharray="3 3" />
              </svg>

              {/* Pins on map for each recycler */}
              {filteredRecyclers.map((rec, idx) => {
                const isSelected = rec.id === selectedRecycler.id;
                // Distribute pins stylistically
                const offsets = [
                  { left: '68%', top: '65%' },
                  { left: '26%', top: '28%' },
                  { left: '78%', top: '35%' },
                  { left: '55%', top: '75%' },
                ];
                const pos = offsets[idx % offsets.length];

                return (
                  <button
                    key={rec.id}
                    onClick={() => setSelectedRecycler(rec)}
                    style={{ left: pos.left, top: pos.top }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group focus:outline-none transition-transform ${
                      isSelected ? 'scale-125 z-20' : 'scale-100 z-10 hover:scale-110'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full border-2 shadow-lg transition-colors ${
                        isSelected
                          ? 'bg-emerald-500 border-white text-neutral-950 ring-4 ring-emerald-500/30'
                          : 'bg-neutral-800 border-emerald-400 text-white'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/80 text-white mt-1 border border-neutral-700 whitespace-nowrap">
                      {rec.name.split(' ')[0]} ({rec.certification})
                    </span>
                  </button>
                );
              })}

              {/* User location pin */}
              <div className="absolute left-[45%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                <div className="w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-blue-500/30 animate-pulse" />
                <span className="text-[9px] text-blue-300 font-mono mt-1 bg-neutral-900/90 px-1 rounded">
                  Your Location
                </span>
              </div>
            </div>

            {/* Selected Recycler Map Bar */}
            <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-xs text-white">
              <div>
                <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider block">
                  Active Facility Node
                </span>
                <span className="font-bold text-neutral-100">{selectedRecycler.name}</span>
                <span className="text-neutral-400 block text-[11px]">{selectedRecycler.address}</span>
              </div>
              <div className="text-right">
                <span className="font-mono text-emerald-400 font-bold block tabular-nums">
                  {selectedRecycler.materialRecoveryRatePercent}% Recovery
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {selectedRecycler.certification}
                </span>
              </div>
            </div>
          </div>

          {/* Recycler Cards Column */}
          <div className="lg:col-span-5 space-y-3">
            {filteredRecyclers.map((rec) => {
              const isSelected = rec.id === selectedRecycler.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecycler(rec)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-600 bg-white ring-2 ring-emerald-600/20 shadow-sm'
                      : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">{rec.name}</h4>
                      <span className="font-mono text-[10px] text-neutral-500 block">
                        License: {rec.licenseNumber}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                      {rec.certification}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 mb-2">
                    {rec.address}, {rec.city}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-500 border-t border-neutral-100 pt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {rec.operatingHours}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-neutral-400" />
                      {rec.contactPhone}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-2">
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      ✓ Zero-landfill safe extraction
                    </span>
                    <span className="font-mono font-bold text-neutral-800 tabular-nums">
                      ★ {rec.rating} / 5.0
                    </span>
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
