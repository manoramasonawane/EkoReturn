import React, { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, ChevronRight, Cpu, Eye, EyeOff, Globe, Leaf, Lock, Mail, MapPin, Navigation, Phone, Recycle, ShieldCheck, Sparkles, Truck, User, X } from 'lucide-react';
import { SUPPORTED_LANGUAGES, useLanguage } from '../i18n/LanguageContext';
import { UserProfile, UserRole } from '../types';
import { loginUser, registerUser } from '../utils/storage';

interface AccountAuthPageProps {
  onAuthenticated: () => void;
  onExploreAsGuest: () => void;
  onClose?: () => void;
}

export const AccountAuthPage: React.FC<AccountAuthPageProps> = ({
  onAuthenticated,
  onExploreAsGuest,
  onClose,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('household');

  // Sign In State
  const [loginIdentifier, setLoginIdentifier] = useState('priya.sharma@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Sign Up State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560103');
  const [password, setPassword] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [formError, setFormError] = useState('');
  const [detectingGps, setDetectingGps] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!loginIdentifier.trim()) {
      setFormError('Please enter your email or registered mobile number.');
      return;
    }

    loginUser(role);
    onAuthenticated();
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please provide a valid email address.');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number for pickup OTPs.');
      return;
    }
    if (!address.trim()) {
      setFormError('Please enter your residential or pickup address.');
      return;
    }
    if (!agreedTerms) {
      setFormError('Please accept the battery safety and environmental compliance agreement.');
      return;
    }

    registerUser({
      name,
      email,
      phone,
      address,
      city,
      pincode,
      role,
    });

    onAuthenticated();
  };

  const handleQuickDemoLogin = (demoRole: UserRole) => {
    loginUser(demoRole);
    onAuthenticated();
  };

  const handleDetectGPS = () => {
    setDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDetectingGps(false);
          setAddress(`Sector GPS: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        () => {
          setDetectingGps(false);
          setAddress('Flat 304, Palm Grove Towers, Outer Ring Road');
        },
        { timeout: 4000 }
      );
    } else {
      setTimeout(() => {
        setDetectingGps(false);
        setAddress('Flat 304, Palm Grove Towers, Outer Ring Road');
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Visual Storytelling & Trust Proof */}
        <div className="lg:col-span-5 bg-gradient-to-br from-neutral-900 via-slate-900 to-emerald-950 text-white p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Brand header */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-neutral-950 flex items-center justify-center font-bold shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight block leading-tight">
                  EkoReturn
                </span>
                <span className="text-[11px] font-medium text-emerald-400">
                  Circular E-Waste Network
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed pt-2">
              "Recycle your electronics. Earn rewards. Protect the planet." Doorstep pickup for old smartphones, dead laptops, swollen batteries, and tangled cables.
            </p>
          </div>

          {/* Visual Image Banner */}
          <div className="my-6 relative z-10 rounded-xl overflow-hidden border border-neutral-800 shadow-lg">
            <img
              src="/src/assets/images/hero_ewaste_recycling_1792430542218.jpg"
              alt="E-waste circular economy recovery"
              referrerPolicy="no-referrer"
              className="w-full h-44 object-cover object-center"
            />
            <div className="p-3 bg-neutral-900/90 backdrop-blur-sm text-[11px] text-neutral-300 flex items-center justify-between border-t border-neutral-800">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                CPCB & R2v3 Certified
              </span>
              <span className="font-mono text-[10px]">Zero Landfill Guaranteed</span>
            </div>
          </div>

          {/* Real-time Tonnage Impact Stats */}
          <div className="relative z-10 pt-4 border-t border-neutral-800/80 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-400 block text-[11px]">CO₂ Avoided</span>
              <span className="text-lg font-extrabold font-mono text-white tabular-nums">
                18,450 kg
              </span>
            </div>
            <div>
              <span className="text-neutral-400 block text-[11px]">Payouts Awarded</span>
              <span className="text-lg font-extrabold font-mono text-emerald-400 tabular-nums">
                ₹3,42,800+
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Form & Profiles */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
          {/* Top Bar: Language & Mode Switcher */}
          <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-4">
            {/* Mode Switch Tabs */}
            <div className="flex items-center bg-neutral-100 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setFormError('');
                }}
                className={`px-4 py-1.5 rounded-md transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setFormError('');
                }}
                className={`px-4 py-1.5 rounded-md transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Regional Language Dropdown & Optional Close */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="text-xs font-medium pl-2 pr-6 py-1.5 border border-neutral-200 rounded-lg bg-neutral-50 hover:bg-white text-neutral-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeLabel} ({lang.label})
                    </option>
                  ))}
                </select>
              </div>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                  title="Close and return to app"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Form Header */}
          <div>
            <h3 className="text-xl font-bold text-neutral-900">
              {mode === 'signin'
                ? 'Welcome back to EkoReturn'
                : 'Create your EkoReturn Account'}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              {mode === 'signin'
                ? 'Sign in to access your recycling wallet, book pickups, and view environmental impact.'
                : 'Join thousands of responsible households recycling old gadgets and earning cash rewards.'}
            </p>
          </div>

          {/* Form Error Toast */}
          {formError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 animate-in fade-in">
              {formError}
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              {/* Role selection radio strip */}
              <div>
                <label className="font-semibold text-neutral-700 block mb-1.5">
                  Select Portal Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { r: 'household' as UserRole, label: 'Household', sub: 'Citizen' },
                    { r: 'collector' as UserRole, label: 'Collector', sub: 'Logistics' },
                    { r: 'admin_recycler' as UserRole, label: 'Recycler', sub: 'Auditor' },
                  ].map((item) => (
                    <button
                      key={item.r}
                      type="button"
                      onClick={() => setRole(item.r)}
                      className={`p-2 rounded-lg border text-left transition-colors ${
                        role === item.r
                          ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold ring-1 ring-emerald-600'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span className="block text-xs">{item.label}</span>
                      <span className="text-[10px] text-neutral-400 font-normal">{item.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="name@example.com or mobile"
                    className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg text-xs bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-neutral-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setLoginPassword('password123')}
                    className="text-[11px] text-emerald-700 hover:underline"
                  >
                    Forgot passcode?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 border border-neutral-300 rounded-lg text-xs bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Sign In to EkoReturn</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* 1-Click Pre-configured Demo Accounts */}
              <div className="pt-4 border-t border-neutral-100 space-y-2">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Or One-Click Demo Profiles:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('household')}
                    className="p-2 border border-neutral-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-lg text-left text-xs transition-colors"
                  >
                    <span className="font-bold text-neutral-900 block truncate">Priya Sharma</span>
                    <span className="text-[10px] text-emerald-700">Household · 1,450 pts</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('collector')}
                    className="p-2 border border-neutral-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-lg text-left text-xs transition-colors"
                  >
                    <span className="font-bold text-neutral-900 block truncate">Vikram Patel</span>
                    <span className="text-[10px] text-slate-700">Courier Logistics</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin_recycler')}
                    className="p-2 border border-neutral-200 hover:border-emerald-500 hover:bg-emerald-50/50 rounded-lg text-left text-xs transition-colors"
                  >
                    <span className="font-bold text-neutral-900 block truncate">Dr. Aris Thorne</span>
                    <span className="text-[10px] text-teal-800">Recycler Auditor</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleSignUp} className="space-y-3 text-xs">
              {/* Role selection */}
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Account Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { r: 'household' as UserRole, label: 'Household Citizen' },
                    { r: 'collector' as UserRole, label: 'Doorstep Courier' },
                    { r: 'admin_recycler' as UserRole, label: 'Authorized Plant' },
                  ].map((item) => (
                    <button
                      key={item.r}
                      type="button"
                      onClick={() => setRole(item.r)}
                      className={`p-2 rounded-lg border text-center transition-colors ${
                        role === item.r
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                          : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                      }`}
                    >
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Mobile Number (For OTP)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Pickup Address with GPS */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-neutral-700">Residential / Pickup Address</label>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>{detectingGps ? 'Detecting...' : 'Use GPS'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat No, Building Name, Street / Sector"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Postal Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* Welcome Bonus Callout */}
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-[11px]">
                  Welcome Bonus: +250 Eco-Points (₹250 credit) awarded instantly upon registration!
                </span>
              </div>

              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-neutral-600 pt-1">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500"
                />
                <span>
                  I agree to follow battery thermal safety guidelines and certify all disposed electronics belong to my household.
                </span>
              </label>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Create Account & Open EkoReturn</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Guest bypass */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
            <span>Want to test or inspect the catalog first?</span>
            <button
              type="button"
              onClick={onExploreAsGuest}
              className="text-xs font-semibold text-neutral-800 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Explore as Guest</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
