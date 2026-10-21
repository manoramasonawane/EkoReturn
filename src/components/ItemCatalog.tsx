import React, { useState } from 'react';
import { AlertTriangle, Battery, Check, CheckCircle2, ChevronRight, Cpu, Info, Laptop, Plus, ShieldCheck, Smartphone, Sparkles, Trash2, Zap } from 'lucide-react';
import { EWASTE_CATEGORIES } from '../data/mockData';
import { EWasteCategory, EWasteItemDraft, ItemCondition } from '../types';
import { calculateEnvironmentalImpact, calculateItemValuation } from '../utils/calculator';

interface ItemCatalogProps {
  onAddItemToCart: (item: EWasteItemDraft) => void;
  cartItems: EWasteItemDraft[];
  onOpenBooking: () => void;
  onRemoveCartItem: (id: string) => void;
}

export const ItemCatalog: React.FC<ItemCatalogProps> = ({
  onAddItemToCart,
  cartItems,
  onOpenBooking,
  onRemoveCartItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<EWasteCategory>(EWASTE_CATEGORIES[0]);
  const [modelName, setModelName] = useState('');
  const [brand, setBrand] = useState('Apple');
  const [condition, setCondition] = useState<ItemCondition>('minor_defect');
  const [quantity, setQuantity] = useState(1);
  const [batteryStatus, setBatteryStatus] = useState<'normal' | 'swollen' | 'missing' | 'none'>('normal');
  const [dataWiped, setDataWiped] = useState(true);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentValuation = calculateItemValuation(selectedCategory, condition, quantity);
  const environmentalSavings = calculateEnvironmentalImpact(currentValuation.weightKg);

  const handleAddToCart = () => {
    const draft: EWasteItemDraft = {
      id: `item_cart_${Date.now()}`,
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      modelName: modelName.trim() || `${brand} ${selectedCategory.name.split(' ')[0]}`,
      brand: brand,
      condition: condition,
      quantity: quantity,
      hasBattery: selectedCategory.hasBattery,
      batteryStatus: selectedCategory.hasBattery ? batteryStatus : 'none',
      dataWiped: dataWiped,
      estimatedPoints: currentValuation.points,
      estimatedCash: currentValuation.cash,
    };

    onAddItemToCart(draft);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
    // Reset custom model input
    setModelName('');
  };

  const totalCartPoints = cartItems.reduce((acc, i) => acc + i.estimatedPoints, 0);
  const totalCartCash = cartItems.reduce((acc, i) => acc + i.estimatedCash, 0);
  const totalCartWeight = cartItems.reduce((acc, i) => {
    const cat = EWASTE_CATEGORIES.find((c) => c.id === i.categoryId);
    return acc + (cat ? cat.avgWeightKg * i.quantity : 0.5);
  }, 0);

  return (
    <section className="py-10 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold text-emerald-800 tracking-wider uppercase block mb-1">
              Transparent Electronics Valuation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              E-Waste Catalog & Valuation Calculator
            </h2>
            <p className="mt-1 text-sm text-neutral-600 max-w-2xl">
              Calculate points, cash payout, and raw material recovery for your obsolete electronics. Add items directly to your doorstep pickup box.
            </p>
          </div>

          {/* Quick Pickup Box Button */}
          {cartItems.length > 0 && (
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all whitespace-nowrap self-start md:self-auto"
            >
              <span>Review Pickup Box ({cartItems.length} items · ₹{totalCartCash})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 2-Column Grid: Configurator & Real-time Value breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Category Picker & Device Customizer */}
          <div className="lg:col-span-7 space-y-6">
            {/* Category horizontal selector */}
            <div className="bg-white p-4 rounded-xl border border-neutral-200">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block mb-3">
                1. Select Electronics Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {EWASTE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat);
                        if (!cat.hasBattery) setBatteryStatus('none');
                        else if (batteryStatus === 'none') setBatteryStatus('normal');
                      }}
                      className={`p-3 text-left rounded-lg border text-xs transition-all flex flex-col justify-between min-h-[90px] ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600 text-emerald-950 font-bold'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="line-clamp-2 leading-snug">{cat.name}</span>
                      <span className="text-[11px] font-mono text-neutral-500 font-normal mt-2 tabular-nums">
                        ~{cat.avgWeightKg} kg / unit
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Item Configuration Details */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-4">
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wide block">
                2. Specify Item Condition & Details
              </label>

              {/* Brand & Model Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-neutral-600 block mb-1">
                    Brand / Manufacturer
                  </label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Dell">Dell</option>
                    <option value="HP">HP / Lenovo</option>
                    <option value="Xiaomi">Xiaomi / Redmi</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Sony">Sony / LG</option>
                    <option value="Philips">Philips / Bajaj</option>
                    <option value="Generic">Other / Unbranded</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600 block mb-1">
                    Device Model or Description
                  </label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder={`e.g. ${selectedCategory.id === 'cat_phone' ? 'iPhone 11 128GB' : selectedCategory.id === 'cat_laptop' ? 'Inspiron 15 Core i5' : 'Model details'}`}
                    className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Physical Condition Selector */}
              <div>
                <label className="text-xs font-medium text-neutral-600 block mb-1">
                  Operating & Physical Condition
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCondition('working')}
                    className={`p-2.5 text-center rounded-lg border text-xs transition-colors ${
                      condition === 'working'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <span className="block font-semibold">Fully Working</span>
                    <span className="text-[10px] text-neutral-500">100% valuation</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition('minor_defect')}
                    className={`p-2.5 text-center rounded-lg border text-xs transition-colors ${
                      condition === 'minor_defect'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <span className="block font-semibold">Minor Defect</span>
                    <span className="text-[10px] text-neutral-500">Cracked screen / bad key (75%)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCondition('scrap_dead')}
                    className={`p-2.5 text-center rounded-lg border text-xs transition-colors ${
                      condition === 'scrap_dead'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                    }`}
                  >
                    <span className="block font-semibold">Dead / Scrap</span>
                    <span className="text-[10px] text-neutral-500">Refining value (45%)</span>
                  </button>
                </div>
              </div>

              {/* Battery Health & Safety Check if device contains battery */}
              {selectedCategory.hasBattery && (
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                      <Battery className="w-3.5 h-3.5 text-neutral-600" />
                      Lithium Battery Safety Declaration
                    </span>
                    <span className="text-[11px] text-neutral-500">Hazard assessment</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setBatteryStatus('normal')}
                      className={`p-2 text-center rounded text-xs border ${
                        batteryStatus === 'normal'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold'
                          : 'border-neutral-200 bg-white text-neutral-700'
                      }`}
                    >
                      Normal / Stable
                    </button>
                    <button
                      type="button"
                      onClick={() => setBatteryStatus('swollen')}
                      className={`p-2 text-center rounded text-xs border ${
                        batteryStatus === 'swollen'
                          ? 'border-rose-600 bg-rose-50 text-rose-900 font-bold'
                          : 'border-neutral-200 bg-white text-neutral-700'
                      }`}
                    >
                      Swollen / Bulging ⚠️
                    </button>
                    <button
                      type="button"
                      onClick={() => setBatteryStatus('missing')}
                      className={`p-2 text-center rounded text-xs border ${
                        batteryStatus === 'missing'
                          ? 'border-neutral-500 bg-neutral-100 text-neutral-900 font-semibold'
                          : 'border-neutral-200 bg-white text-neutral-700'
                      }`}
                    >
                      Battery Removed
                    </button>
                  </div>

                  {batteryStatus === 'swollen' && (
                    <div className="mt-2 p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Safety Alert: Thermal Runaway Risk</span>
                        <span>
                          Do NOT puncture, press, or charge this device. Our collector will bring a fire-retardant safety pouch with thermal insulation.
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Data Sanitization Agreement */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700">
                  <input
                    type="checkbox"
                    checked={dataWiped}
                    onChange={(e) => setDataWiped(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500"
                  />
                  <span>Personal data factory reset / will be erased by R2v3 certified partner</span>
                </label>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-neutral-600">Qty:</span>
                  <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-xs hover:bg-neutral-100 text-neutral-700 font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-mono font-bold text-neutral-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-xs hover:bg-neutral-100 text-neutral-700 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                className={`w-full py-3 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${
                  addedAnimation
                    ? 'bg-emerald-800 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-[0.99]'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Pickup Box!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>
                      Add {quantity}x {selectedCategory.name.split(' ')[0]} to Pickup Box (+{currentValuation.points} pts / ₹{currentValuation.cash})
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Valuation Card & Current Pickup Box Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Valuation Card */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-2">
                Estimated Value for Selected Item
              </span>

              <div className="flex items-baseline justify-between border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-3xl font-extrabold text-neutral-900 font-mono tabular-nums">
                    ₹{currentValuation.cash}
                  </span>
                  <span className="text-xs text-neutral-500 block">
                    Direct cash payout or UPI transfer
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-emerald-700 font-mono tabular-nums">
                    +{currentValuation.points}
                  </span>
                  <span className="text-xs text-neutral-500 block">Eco-Points credit</span>
                </div>
              </div>

              {/* Circular Material Extraction Breakdown */}
              <div className="mt-4">
                <span className="text-xs font-semibold text-neutral-800 block mb-2">
                  Estimated Circular Material Yield:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-neutral-50 border border-neutral-100">
                    <span className="text-neutral-500 block text-[11px]">Gold Recovery</span>
                    <span className="font-mono font-bold text-amber-700 tabular-nums">
                      ~{selectedCategory.preciousMetals.goldMg * quantity} mg
                    </span>
                  </div>
                  <div className="p-2 rounded bg-neutral-50 border border-neutral-100">
                    <span className="text-neutral-500 block text-[11px]">Copper Yield</span>
                    <span className="font-mono font-bold text-neutral-800 tabular-nums">
                      ~{selectedCategory.preciousMetals.copperG * quantity} g
                    </span>
                  </div>
                  <div className="p-2 rounded bg-neutral-50 border border-neutral-100">
                    <span className="text-neutral-500 block text-[11px]">Cobalt Recycled</span>
                    <span className="font-mono font-bold text-blue-700 tabular-nums">
                      ~{selectedCategory.preciousMetals.cobaltG * quantity} g
                    </span>
                  </div>
                  <div className="p-2 rounded bg-neutral-50 border border-neutral-100">
                    <span className="text-neutral-500 block text-[11px]">CO₂ Avoided</span>
                    <span className="font-mono font-bold text-emerald-700 tabular-nums">
                      ~{environmentalSavings.co2Kg} kg
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Pickup Box Sidebar Preview */}
            <div className="bg-white p-5 rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                  Items in Doorstep Pickup Box ({cartItems.length})
                </span>
                <span className="text-xs font-mono font-semibold text-neutral-500 tabular-nums">
                  ~{totalCartWeight.toFixed(1)} kg total
                </span>
              </div>

              {cartItems.length === 0 ? (
                <div className="py-6 text-center text-neutral-400 text-xs border border-dashed border-neutral-200 rounded-lg">
                  <span>Your pickup box is empty. Configure an item above and click "Add to Pickup Box".</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs"
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-neutral-900 truncate">{item.modelName}</span>
                          <span className="text-[11px] text-neutral-500 font-mono">x{item.quantity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
                          <span className="capitalize">{item.condition.replace('_', ' ')}</span>
                          <span>·</span>
                          <span className="text-emerald-700 font-semibold font-mono tabular-nums">+{item.estimatedPoints} pts</span>
                          <span>·</span>
                          <span className="font-mono tabular-nums">₹{item.estimatedCash}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveCartItem(item.id)}
                        className="p-1 text-neutral-400 hover:text-rose-600 rounded transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {cartItems.length > 0 && (
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-neutral-500 block">Total Est. Payout</span>
                    <span className="text-lg font-bold text-neutral-900 font-mono tabular-nums">
                      ₹{totalCartCash} <span className="text-xs font-normal text-emerald-700">(+{totalCartPoints} pts)</span>
                    </span>
                  </div>
                  <button
                    onClick={onOpenBooking}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                  >
                    Proceed to Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
