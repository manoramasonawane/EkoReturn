import React, { useState } from 'react';
import { AlertCircle, Award, CheckCircle2, ChevronRight, Clock, Download, ExternalLink, FileCheck, Leaf, MapPin, Navigation, Phone, QrCode, RotateCcw, ShieldCheck, Truck, User, Zap } from 'lucide-react';
import { PickupBooking, PickupStatus } from '../types';
import { getStatusMeta } from '../utils/calculator';
import { updateBookingStatus } from '../utils/storage';

interface TrackingViewProps {
  bookings: PickupBooking[];
  onSelectBooking: (bookingId: string) => void;
  onOpenBookingModal: () => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  bookings,
  onSelectBooking,
  onOpenBookingModal,
}) => {
  const [selectedBookingId, setSelectedBookingId] = useState<string>(
    bookings.length > 0 ? bookings[0].id : ''
  );
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const activeBooking = bookings.find((b) => b.id === selectedBookingId) || bookings[0];

  const handleSimulateNextStep = () => {
    if (!activeBooking) return;
    const flow: PickupStatus[] = [
      'confirmed',
      'collector_assigned',
      'collector_en_route',
      'at_doorstep',
      'collected',
      'transferred_to_recycler',
      'verified_recycled',
    ];
    const currentIndex = flow.indexOf(activeBooking.status);
    if (currentIndex >= 0 && currentIndex < flow.length - 1) {
      const nextStatus = flow[currentIndex + 1];
      updateBookingStatus(activeBooking.id, nextStatus, {
        actualWeightKg: activeBooking.totalEstWeightKg,
        actualPointsAwarded: activeBooking.totalEstimatedPoints,
      });
    }
  };

  const statusMeta = activeBooking ? getStatusMeta(activeBooking.status) : null;

  return (
    <section className="py-8 bg-neutral-50/60 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-semibold text-emerald-800 tracking-wider uppercase block mb-1">
              Live Logistics & Chain of Custody
            </span>
            <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
              Doorstep Pickup & Recycling Status
            </h2>
            <p className="text-xs text-neutral-600">
              Track collection couriers, verify item handover with PIN/QR, and access government-compliant disposal certificates.
            </p>
          </div>

          <button
            onClick={onOpenBookingModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all whitespace-nowrap self-start sm:self-auto"
          >
            + Book New Pickup
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center max-w-lg mx-auto">
            <Truck className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-900">No active pickups</h3>
            <p className="text-xs text-neutral-500 mt-1 mb-5">
              You haven't booked any e-waste pickups yet. Schedule your first doorstep collection to earn rewards.
            </p>
            <button
              onClick={onOpenBookingModal}
              className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-emerald-700"
            >
              Book First Doorstep Pickup
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Pickups List */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide block">
                Your Pickup Orders ({bookings.length})
              </span>

              {bookings.map((b) => {
                const isSelected = b.id === activeBooking?.id;
                const meta = getStatusMeta(b.status);
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBookingId(b.id)}
                    className={`w-full p-4 text-left rounded-xl border transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'border-emerald-600 bg-white ring-2 ring-emerald-600/20 shadow-sm'
                        : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-neutral-900">
                        {b.trackingNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${meta.bgClass} ${meta.textClass}`}>
                        {meta.label}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-600 line-clamp-1">
                      {b.items.map((i) => `${i.modelName} (x${i.quantity})`).join(', ')}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-neutral-100">
                      <span>{b.scheduledDate} · {b.timeSlot.split(' ')[0]}</span>
                      <span className="font-mono font-bold text-emerald-700">+{b.totalEstimatedPoints} pts</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Active Booking Live Journey & Details */}
            {activeBooking && (
              <div className="lg:col-span-8 space-y-5">
                {/* Status Hero Card */}
                <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-neutral-900 font-mono">
                          {activeBooking.trackingNumber}
                        </h3>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${statusMeta?.bgClass} ${statusMeta?.textClass}`}>
                          {statusMeta?.label}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500 mt-0.5 block">
                        Dispatched with {activeBooking.authorizedRecyclerName}
                      </span>
                      {activeBooking.isSmartRouteEcoSlot && (
                        <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800">
                          <Zap className="w-3 h-3 text-emerald-600 fill-current" />
                          <span>Smart Eco-Route Group (+{activeBooking.greenRouteBonusPoints || 50} pts · {activeBooking.co2FuelSavedKg || 1.9} kg van fuel CO₂ saved)</span>
                        </div>
                      )}
                    </div>

                    {/* Simulation / Workflow controls */}
                    <div className="flex items-center gap-2">
                      {activeBooking.status !== 'verified_recycled' && (
                        <button
                          onClick={handleSimulateNextStep}
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                          title="Simulate progression of courier steps"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Simulate Next Stage</span>
                        </button>
                      )}

                      {activeBooking.status === 'verified_recycled' && (
                        <button
                          onClick={() => setShowCertificateModal(true)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>View Green Certificate</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progressive Timeline */}
                  <div className="py-6">
                    <div className="relative">
                      {/* Timeline bar */}
                      <div className="absolute top-4 left-4 right-4 h-0.5 bg-neutral-200 -z-0" />
                      
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 text-center relative z-10">
                        {[
                          { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
                          { key: 'collector_assigned', label: 'Assigned', icon: User },
                          { key: 'collector_en_route', label: 'En Route', icon: Truck },
                          { key: 'at_doorstep', label: 'Inspection', icon: ShieldCheck },
                          { key: 'transferred_to_recycler', label: 'At Plant', icon: FileCheck },
                          { key: 'verified_recycled', label: 'Recycled', icon: Award },
                        ].map((step, idx) => {
                          const stages: PickupStatus[] = [
                            'confirmed',
                            'collector_assigned',
                            'collector_en_route',
                            'at_doorstep',
                            'transferred_to_recycler',
                            'verified_recycled',
                          ];
                          const activeIdx = stages.indexOf(activeBooking.status as PickupStatus);
                          const isDone = activeIdx >= idx || activeBooking.status === 'collected';
                          const isCurrent = activeIdx === idx;
                          const IconComp = step.icon;

                          return (
                            <div key={step.key} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                  isDone
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border-2 border-neutral-300 text-neutral-400'
                                } ${isCurrent ? 'ring-4 ring-emerald-100 scale-110' : ''}`}
                              >
                                <IconComp className="w-4 h-4" />
                              </div>
                              <span className={`text-[11px] mt-2 font-medium ${isDone ? 'text-neutral-900 font-bold' : 'text-neutral-400'}`}>
                                {step.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Courier Live GPS Simulator Map */}
                  <div className="mt-2 bg-neutral-900 rounded-xl overflow-hidden p-4 text-white relative">
                    <div className="flex items-center justify-between text-xs mb-3 border-b border-neutral-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold">Live Doorstep Logistics Visualizer</span>
                      </div>
                      <span className="font-mono text-emerald-400 text-[11px]">
                        {activeBooking.status === 'collector_en_route' ? 'ETA: ~12 Mins away' : activeBooking.status === 'at_doorstep' ? 'At Residence' : 'Route Verified'}
                      </span>
                    </div>

                    {/* Canvas simulation of Map & Courier Route */}
                    <div className="h-44 bg-neutral-950 rounded-lg relative overflow-hidden border border-neutral-800 flex items-center justify-center">
                      {/* Grid background representing city blocks */}
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />
                      
                      {/* Road lines */}
                      <svg className="absolute inset-0 w-full h-full text-neutral-800" stroke="currentColor" strokeWidth="3" fill="none">
                        <path d="M 20 80 Q 140 30 260 80 T 480 90" strokeDasharray="6 6" />
                        <path d="M 60 140 L 260 80 L 420 30" />
                      </svg>

                      {/* Recycler Depot Pin */}
                      <div className="absolute left-8 top-16 flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border-2 border-neutral-400 text-neutral-300 flex items-center justify-center text-[10px] font-bold">
                          DP
                        </div>
                        <span className="text-[9px] text-neutral-400 mt-1 font-mono">Hub Depot</span>
                      </div>

                      {/* Courier Vehicle Pin (animated) */}
                      <div className="absolute left-1/2 top-14 -translate-x-1/2 flex flex-col items-center animate-bounce duration-1000">
                        <div className="px-2 py-1 rounded-full bg-emerald-500 text-neutral-950 text-[10px] font-extrabold flex items-center gap-1 shadow-lg">
                          <Truck className="w-3 h-3" />
                          <span>KA-01-EV-4821</span>
                        </div>
                        <span className="text-[9px] text-emerald-300 font-mono mt-0.5">Vikram P. (Courier)</span>
                      </div>

                      {/* Household Destination Pin */}
                      <div className="absolute right-12 top-10 flex flex-col items-center">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white text-white flex items-center justify-center shadow-md">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span className="text-[9px] text-emerald-200 mt-1 font-semibold">Your Flat 402</span>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-neutral-400 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">Assigned Collector:</span>
                        <span>{activeBooking.assignedCollector?.name || 'Vikram Patel'} ({activeBooking.assignedCollector?.vehiclePlate || 'KA-01-EV-4821'})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <a
                          href={`tel:${activeBooking.assignedCollector?.phone || '+919123456789'}`}
                          className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Agent</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* 2-Column: Handoff Verification PIN & Items Inspected */}
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Handoff QR Card */}
                    <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                            Doorstep Handover Verification
                          </span>
                          <QrCode className="w-4 h-4 text-neutral-600" />
                        </div>
                        <p className="text-[11px] text-neutral-600 mb-3">
                          To protect against unauthorized pickups, share this PIN or show the QR code when the collector arrives.
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-neutral-200 text-center">
                        <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                          6-Digit Secret Handover PIN
                        </span>
                        <span className="text-2xl font-extrabold text-neutral-900 font-mono tracking-widest tabular-nums">
                          {activeBooking.verificationCode}
                        </span>
                      </div>
                    </div>

                    {/* Booking Items summary */}
                    <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70">
                      <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide block mb-2">
                        Registered E-Waste Items
                      </span>
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {activeBooking.items.map((item, idx) => (
                          <div key={idx} className="p-2 rounded bg-white border border-neutral-200 text-xs flex justify-between items-center">
                            <div>
                              <span className="font-bold text-neutral-900">{item.modelName}</span>
                              <div className="text-[10px] text-neutral-500">
                                {item.condition.replace('_', ' ')} · {item.batteryStatus === 'swollen' ? '⚠️ Swollen Battery' : 'Stable'}
                              </div>
                            </div>
                            <span className="font-mono font-bold text-emerald-700 tabular-nums">
                              +{item.estimatedPoints} pts
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 pt-2 border-t border-neutral-200 flex justify-between text-xs">
                        <span className="text-neutral-500">Total Est. Cash Payout:</span>
                        <span className="font-bold font-mono text-neutral-900 tabular-nums">
                          ₹{activeBooking.totalEstimatedCash}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Certificate Modal */}
        {showCertificateModal && activeBooking && (
          <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-xl w-full p-8 relative animate-in fade-in zoom-in-95">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700"
              >
                ✕
              </button>

              {/* Certificate Header */}
              <div className="text-center pb-6 border-b-2 border-emerald-600">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold text-emerald-800 tracking-widest uppercase">
                  Government & CPCB Compliant E-Waste Manifest
                </span>
                <h3 className="text-xl font-extrabold text-neutral-900 mt-1">
                  Certificate of Green Disposal
                </h3>
                <span className="font-mono text-xs text-neutral-500">
                  ID: {activeBooking.certificateId || 'CERT-EKR-2026-9810'}
                </span>
              </div>

              {/* Certificate Content */}
              <div className="py-6 space-y-4 text-xs text-neutral-700">
                <p>
                  This document certifies that the electronic items listed below have been collected from{' '}
                  <strong className="text-neutral-900">{activeBooking.userName}</strong> and officially processed through R2v3 / e-Stewards authorized recycling streams, ensuring zero landfill disposal and safe extraction of toxic heavy metals.
                </p>

                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Recycling Facility:</span>
                    <span className="font-bold text-neutral-900">{activeBooking.authorizedRecyclerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Certified Net Weight:</span>
                    <span className="font-mono font-bold text-neutral-900">{activeBooking.actualWeightKg || activeBooking.totalEstWeightKg} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Estimated CO₂ Avoided:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      ~{((activeBooking.actualWeightKg || activeBooking.totalEstWeightKg) * 4.4).toFixed(1)} kg CO₂
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Reward Eco-Points Credited:</span>
                    <span className="font-mono font-bold text-emerald-800">
                      +{activeBooking.actualPointsAwarded || activeBooking.totalEstimatedPoints} Points
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200 text-[11px] text-neutral-500">
                  <div>
                    <span>Authorized Digital Signature</span>
                    <div className="font-mono font-bold text-neutral-800">DR. ARIS THORNE (Auditor)</div>
                  </div>
                  <div className="text-right">
                    <span>Issued Date:</span>
                    <div className="font-mono text-neutral-800">{new Date().toISOString().split('T')[0]}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-neutral-200 hover:bg-neutral-100 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Print Manifest</span>
                </button>
                <button
                  onClick={() => setShowCertificateModal(false)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
