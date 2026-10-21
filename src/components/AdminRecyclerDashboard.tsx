import React, { useState } from 'react';
import { AlertCircle, Award, CheckCircle2, Cpu, Factory, FileCheck, Filter, ShieldCheck, Sparkles, TrendingUp, Users } from 'lucide-react';
import { AUTHORIZED_RECYCLERS } from '../data/mockData';
import { PickupBooking, UserProfile } from '../types';
import { calculateEnvironmentalImpact, getStatusMeta } from '../utils/calculator';
import { updateBookingStatus } from '../utils/storage';

interface AdminRecyclerDashboardProps {
  currentUser: UserProfile;
  bookings: PickupBooking[];
}

export const AdminRecyclerDashboard: React.FC<AdminRecyclerDashboardProps> = ({
  currentUser,
  bookings,
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState(AUTHORIZED_RECYCLERS[0].id);
  const [successMsg, setSuccessMsg] = useState('');

  const activeFacility = AUTHORIZED_RECYCLERS.find((r) => r.id === selectedFacilityId) || AUTHORIZED_RECYCLERS[0];

  // Pickups delivered to this plant or needing plant certification
  const awaitingRecycling = bookings.filter(
    (b) => b.status === 'transferred_to_recycler' || b.status === 'collected'
  );
  const certifiedCompleted = bookings.filter((b) => b.status === 'verified_recycled');

  const totalCertifiedWeight = bookings.reduce(
    (acc, b) => acc + (b.actualWeightKg || b.totalEstWeightKg || 1.2),
    0
  );
  const impact = calculateEnvironmentalImpact(totalCertifiedWeight);

  const handleCertifyBatch = (booking: PickupBooking) => {
    updateBookingStatus(booking.id, 'verified_recycled', {
      actualPointsAwarded: booking.totalEstimatedPoints,
      actualWeightKg: booking.actualWeightKg || booking.totalEstWeightKg,
      authorizedRecyclerName: `${activeFacility.name} (${activeFacility.certification})`,
    });
    setSuccessMsg(`Order ${booking.trackingNumber} certified recycled! Green Certificate issued & household points released.`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <section className="py-8 bg-neutral-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {successMsg && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-md flex items-center justify-between animate-in fade-in">
            <span>{successMsg}</span>
            <button onClick={() => setSuccessMsg('')}>✕</button>
          </div>
        )}

        {/* Facility Overview Banner */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Visual asset */}
            <div className="lg:col-span-4 h-48 lg:h-auto bg-neutral-900 relative">
              <img
                src="/src/assets/images/recycling_facility_center_1792430542390.jpg"
                alt="Authorized e-waste processing facility"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-white font-mono text-xs font-bold bg-neutral-900/80 px-2 py-1 rounded">
                  ISO 14001 / R2v3 Certified CleanTech
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-8 p-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Factory className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-bold text-neutral-900">{activeFacility.name}</h2>
                  </div>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    License: {activeFacility.licenseNumber}
                  </span>
                </div>
                <p className="text-xs text-neutral-600">
                  {activeFacility.address}, {activeFacility.city}. Operating under strict zero-landfill protocols with secondary smelting and precious metals recovery.
                </p>
              </div>

              {/* Mass balance recovery stats */}
              <div className="mt-4 pt-4 border-t border-neutral-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-neutral-500 block">Diverted E-Waste</span>
                  <span className="text-base font-extrabold text-neutral-900 font-mono tabular-nums">
                    {totalCertifiedWeight.toFixed(1)} kg
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Gold Reclaimed</span>
                  <span className="text-base font-extrabold text-amber-700 font-mono tabular-nums">
                    {impact.goldMg} mg
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Copper Extracted</span>
                  <span className="text-base font-extrabold text-neutral-800 font-mono tabular-nums">
                    {(impact.copperG / 1000).toFixed(2)} kg
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">CO₂ Prevented</span>
                  <span className="text-base font-extrabold text-emerald-700 font-mono tabular-nums">
                    {impact.co2Kg} kg
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inbound Batches Pending Certification */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <span>Inbound Batches Awaiting Disassembly & Certification</span>
                {awaitingRecycling.length > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-900 rounded-full">
                    {awaitingRecycling.length} Pending
                  </span>
                )}
              </h3>
              <span className="text-xs text-neutral-500">
                Auditors must verify serial records, dismantle hazardous batteries, and release green certificates
              </span>
            </div>
          </div>

          <div className="divide-y divide-neutral-200">
            {awaitingRecycling.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No batches currently awaiting certification.
              </div>
            ) : (
              awaitingRecycling.map((booking) => {
                const meta = getStatusMeta(booking.status);
                return (
                  <div
                    key={booking.id}
                    className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-neutral-50/50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-900">
                          {booking.trackingNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${meta.bgClass} ${meta.textClass}`}>
                          {meta.label}
                        </span>
                        <span className="text-xs text-neutral-500">
                          Collected from: {booking.userName} ({booking.pickupAddress.city})
                        </span>
                      </div>

                      <div className="text-xs text-neutral-700">
                        <strong>Items Manifest:</strong> {booking.items.map((i) => `${i.modelName} (${i.condition})`).join(' · ')}
                      </div>

                      <div className="text-[11px] text-neutral-500">
                        <span>Net Weight: <strong className="text-neutral-800 font-mono">{booking.actualWeightKg || booking.totalEstWeightKg} kg</strong></span>
                        <span className="mx-2">·</span>
                        <span>Estimated Points: <strong className="text-emerald-700 font-mono">+{booking.totalEstimatedPoints} pts</strong></span>
                        <span className="mx-2">·</span>
                        <span>Collector: {booking.assignedCollector?.name} ({booking.collectorNotes || 'Verified safely'})</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCertifyBatch(booking)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Audit & Issue Green Certificate</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Processed & Certified Archival Records */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-200">
            <h3 className="text-sm font-bold text-neutral-900">
              Completed Regulatory Recycling Records ({certifiedCompleted.length})
            </h3>
            <span className="text-xs text-neutral-500">
              Auditable records backed by CPCB manifest numbers and digital certificates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 font-semibold">Tracking / Certificate</th>
                  <th className="px-6 py-3 font-semibold">Household Contributor</th>
                  <th className="px-6 py-3 font-semibold">Weight</th>
                  <th className="px-6 py-3 font-semibold">CO₂ Offset</th>
                  <th className="px-6 py-3 font-semibold text-right">Points Released</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {certifiedCompleted.map((booking) => (
                  <tr key={booking.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-3 font-mono font-bold text-neutral-900">
                      <div>{booking.trackingNumber}</div>
                      <span className="text-[10px] text-neutral-400 font-normal">{booking.certificateId || 'CERT-EKR-2026-00482'}</span>
                    </td>
                    <td className="px-6 py-3 text-neutral-700">
                      {booking.userName}
                    </td>
                    <td className="px-6 py-3 font-mono text-neutral-900">
                      {booking.actualWeightKg || booking.totalEstWeightKg} kg
                    </td>
                    <td className="px-6 py-3 font-mono text-emerald-700 font-bold">
                      ~{((booking.actualWeightKg || booking.totalEstWeightKg) * 4.4).toFixed(1)} kg
                    </td>
                    <td className="px-6 py-3 text-right font-mono font-bold text-emerald-800">
                      +{booking.actualPointsAwarded || booking.totalEstimatedPoints} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
