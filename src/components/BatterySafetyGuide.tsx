import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Battery, BatteryCharging, Check, CheckCircle2, ChevronDown, ChevronRight, Flame, HardDrive, KeyRound, Lock, ShieldAlert, ShieldCheck, Smartphone } from 'lucide-react';
import { BATTERY_SAFETY_CHECKLIST } from '../data/mockData';

export const BatterySafetyGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'battery' | 'data_wipe'>('battery');

  return (
    <section className="py-8 bg-neutral-50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div>
          <span className="text-xs font-semibold text-emerald-800 tracking-wider uppercase block mb-1">
            Safety & Compliance Guide
          </span>
          <h2 className="text-2xl font-extrabold text-neutral-900 tracking-tight">
            Lithium Battery Safety & Personal Data Sanitization
          </h2>
          <p className="text-xs text-neutral-600 max-w-2xl mt-1">
            Improper disposal of lithium batteries causes thousands of municipal waste truck fires annually. Learn how to isolate batteries and factory reset your private data before collection.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
          <button
            onClick={() => setActiveTab('battery')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'battery'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Lithium Battery Fire Prevention</span>
          </button>
          <button
            onClick={() => setActiveTab('data_wipe')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'data_wipe'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Data Sanitization Protocols</span>
          </button>
        </div>

        {/* TAB 1: Lithium Battery Safety */}
        {activeTab === 'battery' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Warning Callout */}
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Why E-Waste Cannot Go Into Regular Garbage</h4>
                <p className="mt-1 leading-relaxed">
                  Lithium-ion cells in smartphones, power banks, and laptops are pressurized chemical reservoirs. When crushed inside garbage compaction trucks, punctured cells ignite instantly at over 900°C (thermal runaway). Doorstep collection ensures specialized fire-retardant containment.
                </p>
              </div>
            </div>

            {/* Step-by-step battery precautions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BATTERY_SAFETY_CHECKLIST.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-xl border border-neutral-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">{item.title}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        item.importance === 'Critical'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.importance}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Visual Guide: Identifying Swollen Batteries */}
            <div className="bg-white p-6 rounded-xl border border-neutral-200 space-y-4">
              <h4 className="text-sm font-bold text-neutral-900">
                How to Spot a Swollen or Compromised Battery
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="font-bold text-neutral-900 block mb-1">Pillow / Cushion Effect</span>
                  <p className="text-neutral-600 text-[11px]">
                    The rear glass or plastic casing on your phone appears curved, pushed outward, or the display screen is lifting from the metal frame.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="font-bold text-neutral-900 block mb-1">Chemical Smell or Heat</span>
                  <p className="text-neutral-600 text-[11px]">
                    A faint sweet, metallic, or acetone odor radiating from the device, or the battery stays warm even when unplugged.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-neutral-50 border border-neutral-200">
                  <span className="font-bold text-neutral-900 block mb-1">Collector Action</span>
                  <p className="text-neutral-600 text-[11px]">
                    Check the "Swollen Battery" box during booking. Our courier will arrive with a vermiculite-insulated pouch to transport it safely.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Personal Data Wipe Guide */}
        {activeTab === 'data_wipe' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Hardware Data Sanitization Guarantee</h4>
                <p className="mt-1 leading-relaxed">
                  Before recycling, remove accounts from your devices. For broken or unbootable hardware, our authorized R2v3 recyclers perform certified physical shredding or electromagnetic degaussing complying with NIST 800-88 standards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Apple iOS */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Apple iPhone & iPad</span>
                </div>
                <ol className="list-decimal list-inside text-xs text-neutral-600 space-y-1.5 leading-relaxed">
                  <li>Open <strong>Settings</strong> &gt; tap your Apple ID profile at top.</li>
                  <li>Scroll down and select <strong>Sign Out</strong> (enter password to disable Find My).</li>
                  <li>Go to <strong>Settings &gt; General &gt; Transfer or Reset iPhone</strong>.</li>
                  <li>Tap <strong>Erase All Content and Settings</strong>.</li>
                </ol>
              </div>

              {/* Android */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Android Devices (Samsung, Xiaomi, Pixel, OnePlus)</span>
                </div>
                <ol className="list-decimal list-inside text-xs text-neutral-600 space-y-1.5 leading-relaxed">
                  <li>Go to <strong>Settings &gt; Accounts & Backup &gt; Manage Accounts</strong>.</li>
                  <li>Tap Google account and choose <strong>Remove Account</strong> (prevents FRP lock).</li>
                  <li>Go to <strong>Settings &gt; System &gt; Reset Options</strong>.</li>
                  <li>Select <strong>Erase all data (Factory Reset)</strong>.</li>
                </ol>
              </div>

              {/* Windows PC */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs">
                  <HardDrive className="w-4 h-4 text-emerald-600" />
                  <span>Windows Laptops & Desktop PCs</span>
                </div>
                <ol className="list-decimal list-inside text-xs text-neutral-600 space-y-1.5 leading-relaxed">
                  <li>Go to <strong>Settings &gt; System &gt; Recovery</strong>.</li>
                  <li>Click <strong>Reset PC</strong> &gt; select <strong>Remove everything</strong>.</li>
                  <li>Under Change Settings, enable <strong>Clean data</strong> (overwrites drive sectors).</li>
                </ol>
              </div>

              {/* Dead Drives */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-neutral-900 text-xs">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Dead / Unbootable Devices</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  If the laptop or phone does not turn on, you do not need to worry. Our recycling plants dismantle storage chips and pass them through high-torque industrial cross-cut shredders that turn silicon into 2mm fragments.
                </p>
                <span className="text-[11px] font-mono font-semibold text-emerald-700 block">
                  ✓ Certificate of Destruction generated upon request
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
