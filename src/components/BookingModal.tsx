import React, { useEffect, useState } from 'react';
import { AlertCircle, Calendar, Check, CheckCircle2, Clock, Fuel, Info, Leaf, MapPin, Navigation, Network, Phone, QrCode, Shield, Sparkles, Trash2, Truck, Users, X, Zap } from 'lucide-react';
import { AUTHORIZED_RECYCLERS } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import { EWasteItemDraft, PickupBooking, UserProfile } from '../types';
import { getSmartRouteSuggestion, RouteClusterNode } from '../utils/smartRouting';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  cartItems: EWasteItemDraft[];
  onRemoveCartItem: (id: string) => void;
  onAddQuickItem: (item: EWasteItemDraft) => void;
  onBookingCreated: (booking: PickupBooking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  cartItems,
  onRemoveCartItem,
  onAddQuickItem,
  onBookingCreated,
}) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [address, setAddress] = useState(currentUser.address);
  const [city, setCity] = useState(currentUser.city || 'Bengaluru');
  const [pincode, setPincode] = useState(currentUser.pincode || '560103');
  const [phone, setPhone] = useState(currentUser.phone);
  const [name, setName] = useState(currentUser.name);
  const [doorstepNotes, setDoorstepNotes] = useState('Please ring door bell. Items are packed safely in an eco-box.');

  // Smart Routing States
  const [useSmartSchedule, setUseSmartSchedule] = useState<boolean>(true);
  const [showClusterMap, setShowClusterMap] = useState<boolean>(false);

  const smartRoutingData = getSmartRouteSuggestion(pincode, address);
  const { suggestion, clusterNodes, alternativeEcoSlots } = smartRoutingData;

  const [selectedDate, setSelectedDate] = useState(() => suggestion.recommendedDate);
  const [timeSlot, setTimeSlot] = useState(() => suggestion.recommendedTimeSlot);
  const [selectedRecyclerId, setSelectedRecyclerId] = useState(AUTHORIZED_RECYCLERS[0].id);
  const [gpsDetecting, setGpsDetecting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<PickupBooking | null>(null);

  // Update schedule if smart schedule toggle changes
  useEffect(() => {
    if (useSmartSchedule) {
      setSelectedDate(suggestion.recommendedDate);
      setTimeSlot(suggestion.recommendedTimeSlot);
    }
  }, [useSmartSchedule, suggestion.recommendedDate, suggestion.recommendedTimeSlot]);

  if (!isOpen) return null;

  const basePoints = cartItems.reduce((acc, i) => acc + i.estimatedPoints, 0);
  const bonusPoints = useSmartSchedule ? suggestion.bonusEcoPoints : 0;
  const totalPoints = basePoints + bonusPoints;
  const totalCash = cartItems.reduce((acc, i) => acc + i.estimatedCash, 0);
  const totalEstWeight = Number(
    cartItems.reduce((acc, i) => acc + (i.hasBattery ? 0.35 : 0.8) * i.quantity, 0).toFixed(1)
  );

  const handleDetectGPS = () => {
    setGpsDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsDetecting(false);
          setAddress(`GPS Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)} - Ring Road Sector`);
        },
        () => {
          setGpsDetecting(false);
          setAddress('Flat 304, Palm Grove Towers, Koramangala 4th Block');
        },
        { timeout: 4000 }
      );
    } else {
      setTimeout(() => {
        setGpsDetecting(false);
        setAddress('Flat 304, Palm Grove Towers, Koramangala 4th Block');
      }, 500);
    }
  };

  const handleAddDefaultSample = () => {
    onAddQuickItem({
      id: `item_quick_${Date.now()}`,
      categoryId: 'cat_phone',
      categoryName: 'Smartphones & Mobile Phones',
      modelName: 'Old OnePlus 6T (Battery intact)',
      brand: 'OnePlus',
      condition: 'minor_defect',
      quantity: 1,
      hasBattery: true,
      batteryStatus: 'normal',
      dataWiped: true,
      estimatedPoints: 320,
      estimatedCash: 650,
    });
  };

  const handleSelectAlternativeEcoSlot = (slot: typeof alternativeEcoSlots[0]) => {
    setSelectedDate(slot.date);
    setTimeSlot(slot.time);
    setUseSmartSchedule(true);
  };

  const handleSubmitBooking = () => {
    const recycler = AUTHORIZED_RECYCLERS.find((r) => r.id === selectedRecyclerId) || AUTHORIZED_RECYCLERS[0];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const verificationPin = Math.floor(100000 + Math.random() * 900000).toString();

    const booking: PickupBooking = {
      id: `bk_${Date.now()}`,
      trackingNumber: `EKR-2026-${randomSuffix}`,
      userId: currentUser.id,
      userName: name,
      userPhone: phone,
      userEmail: currentUser.email,
      pickupAddress: {
        street: address,
        city: city,
        state: 'Karnataka',
        pincode: pincode,
        coordinates: { lat: 12.9279, lng: 77.6821 },
        addressType: 'apartment',
        doorstepInstructions: doorstepNotes,
      },
      scheduledDate: selectedDate,
      timeSlot: timeSlot,
      items: [...cartItems],
      totalEstimatedPoints: totalPoints,
      totalEstimatedCash: totalCash,
      totalEstWeightKg: totalEstWeight || 1.2,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorizedRecyclerId: recycler.id,
      authorizedRecyclerName: `${recycler.name} (${recycler.certification})`,
      verificationCode: verificationPin,
      safetyHazardCheckPassed: true,
      isSmartRouteEcoSlot: useSmartSchedule,
      greenRouteBonusPoints: useSmartSchedule ? suggestion.bonusEcoPoints : 0,
      co2FuelSavedKg: useSmartSchedule ? suggestion.co2SavedKg : 0,
      routeClusterZone: suggestion.zoneName,
      assignedCollector: {
        id: 'usr_collector_404',
        name: 'Vikram Patel',
        phone: '+91 91234 56789',
        vehiclePlate: 'KA-01-EV-4821',
        etaMinutes: 25,
      },
    };

    setCreatedBooking(booking);
    onBookingCreated(booking);
    setStep(4);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-emerald-600 text-white flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900">
                {step === 4 ? t('modalTitleSuccess') : t('modalTitle')}
              </h3>
              <span className="text-[11px] text-neutral-500">
                {step === 4 ? t('stepSuccessSubtitle') : t('stepSubtitle', { step })}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* STEP 1: Review Items */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                  {t('step1Title')}
                </span>
                <span className="text-xs font-mono text-neutral-500 tabular-nums">
                  {t('configuredItems', { count: cartItems.length })}
                </span>
              </div>

              {cartItems.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-neutral-200 rounded-lg p-6 bg-neutral-50">
                  <p className="text-xs text-neutral-600 mb-3">
                    {t('emptyBox')}
                  </p>
                  <button
                    onClick={handleAddDefaultSample}
                    className="px-3 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    {t('addSampleBtn')}
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-bold text-neutral-900">
                          {item.modelName} <span className="text-neutral-500 font-normal">({item.categoryName})</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-1">
                          <span className="capitalize">Condition: {item.condition.replace('_', ' ')}</span>
                          <span>·</span>
                          <span className="font-mono tabular-nums">Qty: {item.quantity}</span>
                          <span>·</span>
                          <span className="text-emerald-700 font-bold font-mono tabular-nums">+{item.estimatedPoints} pts (₹{item.estimatedCash})</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveCartItem(item.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Total estimation bar */}
              <div className="p-3.5 rounded-lg bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-emerald-900 font-bold block">{t('estimatedReturnVal')}</span>
                  <span className="text-[11px] text-emerald-700">{t('valFormulaNote')}</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-emerald-950 font-mono tabular-nums block">
                    ₹{totalCash} <span className="text-xs font-semibold text-emerald-700">(+{basePoints} pts)</span>
                  </span>
                </div>
              </div>

              {/* Safety notice */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-neutral-100 text-neutral-700 text-[11px]">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {t('batterySafetyNotice')}
                </span>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-end">
                <button
                  disabled={cartItems.length === 0}
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all"
                >
                  {t('continueToAddress')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Address & Household Contact */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
                  {t('step2Title')}
                </span>
                <button
                  type="button"
                  onClick={handleDetectGPS}
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{gpsDetecting ? t('detectingGps') : t('useGpsBtn')}</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">
                    {t('streetLabel')}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t('streetPlaceholder')}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-neutral-700 block mb-1">{t('cityLabel')}</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-neutral-700 block mb-1">{t('pincodeLabel')}</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-medium text-neutral-700 block mb-1">{t('nameLabel')}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="font-medium text-neutral-700 block mb-1">{t('phoneLabel')}</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">
                    {t('notesLabel')}
                  </label>
                  <input
                    type="text"
                    value={doorstepNotes}
                    onChange={(e) => setDoorstepNotes(e.target.value)}
                    placeholder={t('notesPlaceholder')}
                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-lg"
                >
                  {t('backBtn')}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all"
                >
                  {t('continueToSchedule')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Smart Schedule Suggestion & Time Slot */}
          {step === 3 && (
            <div className="space-y-4">
              {/* SMART SCHEDULE SUGGESTION FEATURE BANNER */}
              <div className="p-4 rounded-xl border border-emerald-300 bg-gradient-to-br from-emerald-50/90 via-emerald-50/40 to-teal-50/70 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
                      {t('smartScheduleBannerTitle')}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    {suggestion.clusterDensityLabel}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <span className="text-sm font-bold text-neutral-900">
                      {t('recommendedLabel')} {suggestion.recommendedDate} ({suggestion.recommendedTimeSlot})
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                      {t('bonusEcoPtsBadge', { pts: suggestion.bonusEcoPoints })}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {t('smartRouteDesc', {
                      count: suggestion.existingPickupsCount,
                      zone: suggestion.zoneName.split('·')[0],
                      km: suggestion.fuelSavedKm,
                      co2: suggestion.co2SavedKg,
                    })}
                  </p>
                </div>

                {/* Smart Route Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-emerald-200/60">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setUseSmartSchedule(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        useSmartSchedule
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {useSmartSchedule ? <Check className="w-3.5 h-3.5" /> : null}
                      <span>
                        {useSmartSchedule
                          ? t('ecoSlotActive', { pts: suggestion.bonusEcoPoints })
                          : t('selectEcoSlot')}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseSmartSchedule(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        !useSmartSchedule
                          ? 'bg-neutral-800 text-white font-bold'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-emerald-100/50'
                      }`}
                    >
                      {t('chooseCustomSlot')}
                    </button>
                  </div>

                  {/* Toggle Mini Cluster Map */}
                  <button
                    type="button"
                    onClick={() => setShowClusterMap(!showClusterMap)}
                    className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>{showClusterMap ? t('hideClusterMap') : t('viewClusterMap')}</span>
                  </button>
                </div>

                {/* High-Density Neighborhood Cluster Route Visualizer */}
                {showClusterMap && (
                  <div className="mt-2 p-3 bg-neutral-900 rounded-lg text-white space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px] border-b border-neutral-800 pb-1.5">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <Fuel className="w-3.5 h-3.5" />
                        {t('clusterMapHeader', { km: suggestion.fuelSavedKm })}
                      </span>
                      <span className="font-mono text-neutral-400">
                        {t('stopsInSector', { count: suggestion.existingPickupsCount + 1 })}
                      </span>
                    </div>

                    {/* Visual 2D cluster map */}
                    <div className="h-32 bg-neutral-950 rounded relative overflow-hidden border border-neutral-800 flex items-center justify-center">
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px]" />

                      {/* Route Path Connector */}
                      <svg className="absolute inset-0 w-full h-full text-emerald-500/60" stroke="currentColor" strokeWidth="2" strokeDasharray="4 3" fill="none">
                        <path d="M 120 40 L 220 25 L 340 45 L 280 85 L 180 70 Z" />
                      </svg>

                      {/* Neighboring Household Pins */}
                      {clusterNodes.map((node) => (
                        <div
                          key={node.id}
                          style={{ left: `${node.coordinates.xPercent}%`, top: `${node.coordinates.yPercent}%` }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                        >
                          <div className="w-3.5 h-3.5 rounded-full bg-slate-700 border border-emerald-400 text-[8px] flex items-center justify-center font-bold text-emerald-300">
                            ✓
                          </div>
                          <span className="text-[8px] text-neutral-300 font-mono whitespace-nowrap bg-black/80 px-1 rounded opacity-75 mt-0.5">
                            {node.name}
                          </span>
                        </div>
                      ))}

                      {/* User's House Pin */}
                      <div className="absolute left-[52%] top-[45%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-500/50 animate-pulse" />
                        <span className="text-[8px] text-emerald-200 font-bold bg-emerald-950 px-1 rounded mt-0.5 whitespace-nowrap">
                          {t('yourDoorstep')}
                        </span>
                      </div>
                    </div>

                    <div className="text-[10px] text-neutral-400 flex items-center justify-between">
                      <span>{t('clusterProof', { count: suggestion.existingPickupsCount })}</span>
                      <span className="text-emerald-400 font-mono">{t('zeroMileage')}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Alternative Clustered Eco-Windows */}
              {useSmartSchedule && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-neutral-600 block">
                    {t('otherEcoWindows')}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {alternativeEcoSlots.map((slot, idx) => {
                      const isChosen = selectedDate === slot.date && timeSlot === slot.time;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectAlternativeEcoSlot(slot)}
                          className={`p-2 rounded-lg border text-left text-xs transition-colors ${
                            isChosen
                              ? 'border-emerald-600 bg-emerald-50/80 font-bold text-emerald-950 ring-1 ring-emerald-600'
                              : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">{slot.date}</span>
                            <span className="font-mono text-[10px] text-emerald-700 font-bold">+{slot.bonusPts} pts</span>
                          </div>
                          <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">{slot.time}</span>
                          <span className="text-[10px] text-emerald-800 block mt-0.5">
                            {t('nearbyPickupsCount', { count: slot.existingCount })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* MANUAL DATE & TIME SLOT PICKER (If custom chosen or overriding) */}
              {!useSmartSchedule && (
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
                  <span className="text-xs font-bold text-neutral-800 block">
                    {t('customScheduleHeading')}
                  </span>

                  <div>
                    <label className="text-xs font-medium text-neutral-700 block mb-1">
                      {t('selectDateLabel')}
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg bg-white focus:ring-1 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-neutral-700 block mb-1">
                      {t('preferredSlotLabel')}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: t('morningSlot'), time: '09:00 AM - 12:00 PM' },
                        { label: t('afternoonSlot'), time: '12:00 PM - 03:00 PM' },
                        { label: t('eveningSlot'), time: '03:00 PM - 06:00 PM' },
                      ].map((s) => (
                        <button
                          key={s.time}
                          type="button"
                          onClick={() => setTimeSlot(s.time)}
                          className={`p-2 rounded-lg border text-xs text-left transition-colors ${
                            timeSlot === s.time
                              ? 'border-neutral-900 bg-neutral-900 text-white font-bold'
                              : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          <span className="block font-semibold">{s.label}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">{s.time}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Authorized Recycler routing */}
              <div>
                <label className="text-xs font-medium text-neutral-700 block mb-1.5">
                  {t('dispatchedPartnerLabel')}
                </label>
                <div className="space-y-2">
                  {AUTHORIZED_RECYCLERS.map((rec) => (
                    <label
                      key={rec.id}
                      className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                        selectedRecyclerId === rec.id
                          ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                          : 'border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="recyclerPartner"
                        checked={selectedRecyclerId === rec.id}
                        onChange={() => setSelectedRecyclerId(rec.id)}
                        className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-neutral-900">{rec.name}</span>
                          <span className="font-mono text-[11px] text-emerald-800 font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                            {rec.certification}
                          </span>
                        </div>
                        <span className="text-neutral-500 text-[11px] block mt-0.5">
                          {rec.address} · {t('recoveryRate', { rate: rec.materialRecoveryRatePercent })}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Summary of points including smart route bonus */}
              <div className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-neutral-600 font-medium">{t('totalPtsCredited')}</span>
                  {useSmartSchedule && (
                    <span className="text-[11px] text-emerald-700 block font-semibold">
                      {t('includesSmartBonus', { pts: suggestion.bonusEcoPoints })}
                    </span>
                  )}
                </div>
                <span className="text-base font-extrabold text-emerald-800 font-mono tabular-nums">
                  +{totalPoints} pts
                </span>
              </div>

              <div className="pt-3 border-t border-neutral-200 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-lg"
                >
                  {t('backBtn')}
                </button>
                <button
                  type="button"
                  onClick={handleSubmitBooking}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                >
                  {t('confirmBookingBtn')}
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & QR Code Display */}
          {step === 4 && createdBooking && (
            <div className="space-y-4 text-center py-1">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-neutral-900">
                  {t('bookingSuccessHeading')}
                </h4>
                <p className="text-xs text-neutral-600 max-w-md mx-auto mt-0.5">
                  {t('bookingSuccessDesc')}
                </p>
              </div>

              {/* Smart Eco-Route Applied Badge */}
              {createdBooking.isSmartRouteEcoSlot && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-center gap-2 max-w-sm mx-auto">
                  <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-[11px]">
                    {t('smartEcoActiveBadge', {
                      pts: createdBooking.greenRouteBonusPoints || 50,
                      co2: createdBooking.co2FuelSavedKg || 1.9,
                    })}
                  </span>
                </div>
              )}

              {/* QR Code Handover Card */}
              <div className="max-w-xs mx-auto p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs border-b border-neutral-200 pb-2">
                  <span className="text-neutral-500">{t('trackingCodeLabel')}</span>
                  <span className="font-mono font-bold text-neutral-900">{createdBooking.trackingNumber}</span>
                </div>

                {/* SVG QR Code Simulation */}
                <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-lg border border-neutral-300 shadow-sm flex items-center justify-center">
                  <svg className="w-full h-full text-neutral-900" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M0,0 h30 v30 h-30 z M6,6 v18 h18 v-18 z M10,10 h10 v10 h-10 z" />
                    <path d="M70,0 h30 v30 h-30 z M76,6 v18 h18 v-18 z M80,10 h10 v10 h-10 z" />
                    <path d="M0,70 h30 v30 h-30 z M6,76 v18 h18 v-18 z M10,80 h10 v10 h-10 z" />
                    <rect x="36" y="10" width="8" height="8" />
                    <rect x="52" y="10" width="8" height="8" />
                    <rect x="36" y="26" width="8" height="8" />
                    <rect x="44" y="38" width="12" height="12" />
                    <rect x="64" y="44" width="8" height="8" />
                    <rect x="20" y="44" width="8" height="8" />
                    <rect x="70" y="70" width="10" height="10" />
                    <rect x="85" y="85" width="10" height="10" />
                    <rect x="40" y="75" width="8" height="18" />
                    <rect x="56" y="65" width="12" height="8" />
                  </svg>
                </div>

                <div className="bg-emerald-100/70 p-2 rounded text-xs text-emerald-950 font-mono font-bold">
                  {t('handoffPinLabel')} {createdBooking.verificationCode}
                </div>
                <p className="text-[10px] text-neutral-500">
                  {t('pinInstruction')}
                </p>
              </div>

              {/* Scheduled details */}
              <div className="text-xs text-neutral-600 space-y-0.5">
                <div>
                  <strong>{t('scheduledForLabel')}</strong> {createdBooking.scheduledDate} ({createdBooking.timeSlot})
                </div>
                <div>
                  <strong>{t('partnerRecyclerLabel')}</strong> {createdBooking.authorizedRecyclerName}
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  {t('viewActiveTrackingBtn')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
