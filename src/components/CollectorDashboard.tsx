import React, { useState } from 'react';
import { AlertTriangle, Battery, Check, CheckCircle2, ChevronRight, MapPin, Navigation, PackageCheck, Phone, QrCode, Scale, ShieldAlert, Truck, User } from 'lucide-react';
import { PickupBooking, UserProfile } from '../types';
import { getStatusMeta } from '../utils/calculator';
import { updateBookingStatus } from '../utils/storage';

interface CollectorDashboardProps {
  currentUser: UserProfile;
  bookings: PickupBooking[];
}

export const CollectorDashboard: React.FC<CollectorDashboardProps> = ({
  currentUser,
  bookings,
}) => {
  const [activeVerificationBooking, setActiveVerificationBooking] = useState<PickupBooking | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [actualWeight, setActualWeight] = useState<number>(1.6);
  const [batteryChecked, setBatteryChecked] = useState(true);
  const [swollenBatteryAlert, setSwollenBatteryAlert] = useState(false);
  const [collectorNote, setCollectorNote] = useState('Items verified and safely placed in fire-retardant container #B4.');
  const [successToast, setSuccessToast] = useState('');

  // Doorstep collection queue
  const assignedBookings = bookings.filter((b) => b.status !== 'verified_recycled');

  const handleUpdateStatus = (bookingId: string, nextStatus: any) => {
    updateBookingStatus(bookingId, nextStatus);
    setSuccessToast(`Order status updated to ${nextStatus.replace('_', ' ')}`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleOpenInspection = (booking: PickupBooking) => {
    setActiveVerificationBooking(booking);
    setActualWeight(booking.totalEstWeightKg || 1.5);
    setEnteredPin('');
    setPinError('');
  };

  const handleConfirmInspection = () => {
    if (!activeVerificationBooking) return;

    if (enteredPin.trim() !== activeVerificationBooking.verificationCode) {
      setPinError(`Invalid Handover PIN. Household secret PIN is ${activeVerificationBooking.verificationCode}`);
      return;
    }

    // Awarded points proportional to verified weight or estimation
    const pointsAwarded = Math.round(activeVerificationBooking.totalEstimatedPoints * (actualWeight / (activeVerificationBooking.totalEstWeightKg || 1)));

    updateBookingStatus(activeVerificationBooking.id, 'transferred_to_recycler', {
      actualWeightKg: actualWeight,
      actualPointsAwarded: pointsAwarded,
      collectorNotes: collectorNote,
      safetyHazardCheckPassed: true,
    });

    setActiveVerificationBooking(null);
    setSuccessToast(`Pickup ${activeVerificationBooking.trackingNumber} successfully verified & transferred to plant!`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  return (
    <section className="py-8 bg-neutral-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Toast */}
        {successToast && (
          <div className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-md flex items-center justify-between animate-in fade-in">
            <span>{successToast}</span>
            <button onClick={() => setSuccessToast('')}>✕</button>
          </div>
        )}

        {/* Collector Profile Header Banner */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm overflow-hidden relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                <img
                  src="/src/assets/images/collector_agent_pickup_1792430543223.jpg"
                  alt="Collector Agent"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-neutral-900">{currentUser.name}</h2>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Active Agent
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 mt-1">
                  <span>Vehicle: KA-01-EV-4821 (Electric Logistics Van)</span>
                  <span>·</span>
                  <span>Zone: Bengaluru South & Outer Ring Road</span>
                  <span>·</span>
                  <span className="font-mono text-neutral-800 font-semibold">{assignedBookings.length} Pickups in Queue</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="md:col-span-4 grid grid-cols-2 gap-3 border-t md:border-t-0 md:border-l border-neutral-200 pt-4 md:pt-0 md:pl-6 text-xs">
              <div>
                <span className="text-neutral-500 block">Total Completed</span>
                <span className="text-xl font-extrabold text-neutral-900 font-mono tabular-nums">
                  {currentUser.totalItemsRecycled} Items
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block">Total Weight</span>
                <span className="text-xl font-extrabold text-emerald-700 font-mono tabular-nums">
                  {currentUser.totalWeightRecycledKg} kg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Pickups Table / Dispatch List */}
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                Today's Assigned Doorstep Route
              </h3>
              <span className="text-xs text-neutral-500">
                Verify resident identity with 6-digit PIN before loading hazardous batteries
              </span>
            </div>
            <div className="text-xs font-mono font-semibold text-neutral-700 bg-neutral-100 px-3 py-1 rounded-lg">
              Route Status: Optimal
            </div>
          </div>

          <div className="divide-y divide-neutral-200">
            {assignedBookings.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-500">
                No active pickups assigned. All collections complete!
              </div>
            ) : (
              assignedBookings.map((booking) => {
                const meta = getStatusMeta(booking.status);
                return (
                  <div
                    key={booking.id}
                    className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-neutral-900">
                          {booking.trackingNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${meta.bgClass} ${meta.textClass}`}>
                          {meta.label}
                        </span>
                        <span className="text-xs text-neutral-500">
                          Slot: {booking.scheduledDate} ({booking.timeSlot})
                        </span>
                      </div>

                      <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{booking.userName}</span>
                        <span className="text-neutral-500 font-normal">· {booking.userPhone}</span>
                      </div>

                      <div className="text-xs text-neutral-600 flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                        <span>{booking.pickupAddress.street}, {booking.pickupAddress.city} - {booking.pickupAddress.pincode}</span>
                      </div>

                      {booking.pickupAddress.doorstepInstructions && (
                        <div className="text-[11px] text-amber-800 bg-amber-50/70 px-2 py-1 rounded border border-amber-200/50 w-fit">
                          Note: {booking.pickupAddress.doorstepInstructions}
                        </div>
                      )}

                      <div className="text-xs text-neutral-500 pt-1">
                        <strong>Items:</strong> {booking.items.map((i) => `${i.modelName} (x${i.quantity})`).join(', ')} · <span className="font-mono font-semibold text-neutral-700">~{booking.totalEstWeightKg} kg</span>
                      </div>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {booking.status === 'confirmed' || booking.status === 'collector_assigned' ? (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'collector_en_route')}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Start Route (En Route)</span>
                        </button>
                      ) : null}

                      {booking.status === 'collector_en_route' ? (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'at_doorstep')}
                          className="px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Arrived at Doorstep</span>
                        </button>
                      ) : null}

                      {booking.status === 'at_doorstep' || booking.status === 'collector_en_route' ? (
                        <button
                          onClick={() => handleOpenInspection(booking)}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                        >
                          <PackageCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Inspect & Verify QR</span>
                        </button>
                      ) : null}

                      {booking.status === 'transferred_to_recycler' ? (
                        <span className="text-xs text-purple-700 font-semibold bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                          Handed to Authorized Recycler
                        </span>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Verification & Weighing Modal */}
        {activeVerificationBooking && (
          <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center">
                    <PackageCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-900">
                    Doorstep Verification & Handoff
                  </h4>
                </div>
                <button
                  onClick={() => setActiveVerificationBooking(null)}
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  ✕
                </button>
              </div>

              <div className="py-4 space-y-4 text-xs">
                {/* Resident info */}
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="flex justify-between font-bold text-neutral-900">
                    <span>Resident: {activeVerificationBooking.userName}</span>
                    <span className="font-mono text-emerald-700">{activeVerificationBooking.trackingNumber}</span>
                  </div>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">
                    Items: {activeVerificationBooking.items.map((i) => i.modelName).join(', ')}
                  </span>
                </div>

                {/* 6-Digit PIN verification */}
                <div>
                  <label className="font-bold text-neutral-800 block mb-1">
                    Enter Resident's 6-Digit Verification PIN (or scan QR)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredPin}
                    onChange={(e) => {
                      setEnteredPin(e.target.value);
                      setPinError('');
                    }}
                    placeholder="e.g. 748291"
                    className="w-full text-center text-lg font-mono font-bold tracking-widest px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1">
                    <span>Resident sees this on their tracking dashboard</span>
                    <button
                      type="button"
                      onClick={() => setEnteredPin(activeVerificationBooking.verificationCode)}
                      className="text-emerald-700 hover:underline"
                    >
                      Autofill PIN for testing ({activeVerificationBooking.verificationCode})
                    </button>
                  </div>
                  {pinError && (
                    <span className="text-rose-600 text-[11px] font-semibold mt-1 block">
                      {pinError}
                    </span>
                  )}
                </div>

                {/* Digital Scale Reading */}
                <div>
                  <label className="font-bold text-neutral-800 block mb-1">
                    Measured Net Weight (from portable digital scale)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={actualWeight}
                      onChange={(e) => setActualWeight(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg font-mono text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="font-mono font-bold text-neutral-700 text-sm">kg</span>
                  </div>
                </div>

                {/* Battery Safety Checks */}
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-800">
                    <input
                      type="checkbox"
                      checked={batteryChecked}
                      onChange={(e) => setBatteryChecked(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span>Battery terminals taped & isolated in fire-retardant bag</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-neutral-800">
                    <input
                      type="checkbox"
                      checked={swollenBatteryAlert}
                      onChange={(e) => setSwollenBatteryAlert(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                    <span>Flag as hazardous swollen cell (Requires Level-3 containment)</span>
                  </label>
                </div>

                {/* Inspection remarks */}
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">
                    Collector Remarks / Container Tag
                  </label>
                  <input
                    type="text"
                    value={collectorNote}
                    onChange={(e) => setCollectorNote(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveVerificationBooking(null)}
                  className="px-4 py-2 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmInspection}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm"
                >
                  Verify PIN & Sign Handover
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
