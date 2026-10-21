import React, { useState } from 'react';
import { Award, Box, Check, CheckCircle2, ChevronDown, Cpu, FileText, Globe, LogOut, MapPin, ShieldAlert, Sparkles, Truck, User } from 'lucide-react';
import { SUPPORTED_LANGUAGES, useLanguage } from '../i18n/LanguageContext';
import { UserProfile, UserRole } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartCount: number;
  onOpenBooking: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeRole,
  onRoleChange,
  activeTab,
  onTabChange,
  cartCount,
  onOpenBooking,
  onOpenAuth,
  onLogout,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  const roles: { role: UserRole; labelKey: any; badge: string }[] = [
    { role: 'household', labelKey: 'roleHousehold', badge: 'Citizen' },
    { role: 'collector', labelKey: 'roleCollector', badge: 'Logistics' },
    { role: 'admin_recycler', labelKey: 'roleAdmin', badge: 'Plant' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 lg:gap-6 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onTabChange('home')}
              className="group flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-md"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <Cpu className="w-5 h-5 text-white stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-neutral-900 leading-tight">
                  {t('brandTitle')}
                </span>
                <span className="text-[11px] font-medium text-emerald-700 tracking-wide">
                  {t('brandSubtitle')}
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-neutral-600">
            <button
              onClick={() => onTabChange('home')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'home'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {t('navOverview')}
            </button>
            <button
              onClick={() => onTabChange('catalog')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'catalog'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {t('navCatalog')}
            </button>
            <button
              onClick={() => onTabChange('tracking')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'tracking'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {t('navTracking')}
            </button>
            <button
              onClick={() => onTabChange('rewards')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                activeTab === 'rewards'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <span>{t('navRewards')}</span>
              {activeRole === 'household' && (
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded tabular-nums">
                  {currentUser.rewardPoints} {t('ptsLabel')}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('recyclers')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'recyclers'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {t('navRecyclers')}
            </button>
            <button
              onClick={() => onTabChange('safety')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'safety'
                  ? 'text-emerald-700 bg-emerald-50 font-semibold'
                  : 'hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {t('navSafety')}
            </button>
          </nav>

          {/* Zone 3: Primary Action, Language Switcher, Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-800 transition-colors"
                aria-expanded={langDropdownOpen}
                title="Change Regional Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold">{currentLangObj.nativeLabel}</span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {langDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 border-b border-neutral-100 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                      Regional Language
                    </div>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-neutral-50 transition-colors ${
                          language === lang.code ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{lang.nativeLabel}</span>
                          <span className="text-[11px] text-neutral-400">({lang.label})</span>
                        </div>
                        {language === lang.code && (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Role Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-medium text-neutral-800 transition-colors"
                aria-expanded={roleDropdownOpen}
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="hidden sm:inline font-semibold">{t('roleLabel')}:</span>
                <span className="capitalize">
                  {t(roles.find((r) => r.role === activeRole)?.labelKey || 'roleHousehold')}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {roleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setRoleDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 border-b border-neutral-100 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                      Switch Role (Multi-Portal MVP)
                    </div>
                    {roles.map((r) => (
                      <button
                        key={r.role}
                        onClick={() => {
                          onRoleChange(r.role);
                          setRoleDropdownOpen(false);
                          if (r.role === 'collector') onTabChange('collector');
                          else if (r.role === 'admin_recycler') onTabChange('admin');
                          else onTabChange('home');
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-neutral-50 transition-colors ${
                          activeRole === r.role ? 'bg-emerald-50/70 text-emerald-900 font-semibold' : 'text-neutral-700'
                        }`}
                      >
                        <span>{t(r.labelKey)}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-normal">
                          {r.badge}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* User Account / Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setRoleDropdownOpen(false);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-medium text-neutral-800 transition-colors"
                title="Account & Profile Management"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px]">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden md:inline font-semibold max-w-[90px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-400" />
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 pb-2 border-b border-neutral-100">
                      <div className="font-bold text-xs text-neutral-900 truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">
                        {currentUser.email}
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{currentUser.city || 'Bengaluru'} · {currentUser.pincode}</span>
                      </div>
                      {activeRole === 'household' && (
                        <div className="mt-1.5 px-2 py-1 bg-emerald-50 rounded border border-emerald-100 flex items-center justify-between text-[11px]">
                          <span className="text-emerald-800">Eco-Points Balance</span>
                          <span className="font-bold text-emerald-900 font-mono">{currentUser.rewardPoints} pts</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-1.5 pb-0.5">
                      {onOpenAuth && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenAuth();
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 font-medium"
                        >
                          <User className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Switch Account / Sign In</span>
                        </button>
                      )}
                      {onLogout && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full px-3 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Role Context Actions */}
            {activeRole === 'household' ? (
              <button
                onClick={onOpenBooking}
                className="relative inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{t('bookPickupBtn')}</span>
                {cartCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-emerald-800 text-[10px] font-bold rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            ) : activeRole === 'collector' ? (
              <button
                onClick={() => onTabChange('collector')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{t('collectorDispatchBtn')}</span>
              </button>
            ) : (
              <button
                onClick={() => onTabChange('admin')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>{t('recyclerConsoleBtn')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile secondary tab strip */}
        <div className="lg:hidden flex items-center gap-2 py-2 overflow-x-auto text-xs font-medium text-neutral-600 border-t border-neutral-100 scrollbar-none">
          <button
            onClick={() => onTabChange('home')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              activeTab === 'home' ? 'text-emerald-700 bg-emerald-50 font-bold' : ''
            }`}
          >
            {t('navOverview')}
          </button>
          <button
            onClick={() => onTabChange('catalog')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              activeTab === 'catalog' ? 'text-emerald-700 bg-emerald-50 font-bold' : ''
            }`}
          >
            {t('navCatalog')}
          </button>
          <button
            onClick={() => onTabChange('tracking')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              activeTab === 'tracking' ? 'text-emerald-700 bg-emerald-50 font-bold' : ''
            }`}
          >
            {t('navTracking')}
          </button>
          <button
            onClick={() => onTabChange('rewards')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              activeTab === 'rewards' ? 'text-emerald-700 bg-emerald-50 font-bold' : ''
            }`}
          >
            {t('navRewards')} ({currentUser.rewardPoints} {t('ptsLabel')})
          </button>
          <button
            onClick={() => onTabChange('recyclers')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              activeTab === 'recyclers' ? 'text-emerald-700 bg-emerald-50 font-bold' : ''
            }`}
          >
            {t('navRecyclers')}
          </button>
          <button
            onClick={() => onTabChange('safety')}
            className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap ${
              activeTab === 'safety' ? 'text-emerald-700 bg-emerald-50 font-bold' : ''
            }`}
          >
            {t('navSafety')}
          </button>
        </div>
      </div>
    </header>
  );
};
