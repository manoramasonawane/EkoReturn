import React, { useEffect, useState } from 'react';
import { ArrowRight, Award, CheckCircle2, Cpu, ExternalLink, Factory, FileText, Heart, MapPin, Recycle, ShieldCheck, Sparkles, Truck, Wallet } from 'lucide-react';
import { AccountAuthPage } from './components/AccountAuthPage';
import { AdminRecyclerDashboard } from './components/AdminRecyclerDashboard';
import { BatterySafetyGuide } from './components/BatterySafetyGuide';
import { BookingModal } from './components/BookingModal';
import { CollectorDashboard } from './components/CollectorDashboard';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ItemCatalog } from './components/ItemCatalog';
import { RecyclerMap } from './components/RecyclerMap';
import { RewardsCenter } from './components/RewardsCenter';
import { TrackingView } from './components/TrackingView';
import { EWasteItemDraft, PickupBooking, UserRole } from './types';
import {
  getActiveRole,
  getBookings,
  getCurrentUser,
  getTransactions,
  isUserAuthenticated,
  loginUser,
  logoutUser,
  resetAllData,
  saveBookings,
  setActiveRole,
} from './utils/storage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isUserAuthenticated());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [activeRole, setActiveRoleState] = useState<UserRole>(getActiveRole());
  const [activeTab, setActiveTab] = useState<string>('home');
  const [bookings, setBookings] = useState<PickupBooking[]>(getBookings());
  const [transactions, setTransactions] = useState(getTransactions());
  const [cartItems, setCartItems] = useState<EWasteItemDraft[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Sync state on storage updates
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(isUserAuthenticated());
      setCurrentUser(getCurrentUser());
      setActiveRoleState(getActiveRole());
      setBookings(getBookings());
      setTransactions(getTransactions());
    };

    window.addEventListener('ekoreturn_storage_update', handleStorageChange);
    return () => window.removeEventListener('ekoreturn_storage_update', handleStorageChange);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    setActiveRoleState(role);
    setCurrentUser(getCurrentUser());
  };

  const handleAddItemToCart = (item: EWasteItemDraft) => {
    setCartItems((prev) => [...prev, item]);
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleBookingCreated = (newBooking: PickupBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    // Clear cart
    setCartItems([]);
    // Update local storage
    const updated = [newBooking, ...bookings];
    saveBookings(updated);
  };

  // Gate app: if not authenticated, show the Account Auth page to open the app
  if (!isAuthenticated) {
    return (
      <AccountAuthPage
        onAuthenticated={() => {
          setIsAuthenticated(true);
          setIsAuthModalOpen(false);
          setCurrentUser(getCurrentUser());
          setActiveRoleState(getActiveRole());
        }}
        onExploreAsGuest={() => {
          loginUser('household');
          setIsAuthenticated(true);
          setIsAuthModalOpen(false);
          setCurrentUser(getCurrentUser());
          setActiveRoleState('household');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        cartCount={cartItems.length}
        onOpenBooking={() => setIsBookingOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={() => {
          logoutUser();
          setIsAuthenticated(false);
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {/* Role: Collector Agent View */}
        {activeRole === 'collector' ? (
          <CollectorDashboard currentUser={currentUser} bookings={bookings} />
        ) : activeRole === 'admin_recycler' ? (
          <AdminRecyclerDashboard currentUser={currentUser} bookings={bookings} />
        ) : (
          /* Role: Household User Views */
          <>
            {activeTab === 'home' && (
              <>
                <Hero
                  onOpenBooking={() => setIsBookingOpen(true)}
                  onExploreCatalog={() => setActiveTab('catalog')}
                  onViewRecyclers={() => setActiveTab('recyclers')}
                />

                {/* Interactive Item Catalog on Homepage */}
                <ItemCatalog
                  onAddItemToCart={handleAddItemToCart}
                  cartItems={cartItems}
                  onOpenBooking={() => setIsBookingOpen(true)}
                  onRemoveCartItem={handleRemoveCartItem}
                />

                {/* How it Works Section */}
                <section className="py-12 bg-white border-t border-b border-neutral-200">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                      <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                        Convenient & Transparent
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                        How Doorstep E-Waste Recycling Works
                      </h3>
                      <p className="text-xs text-neutral-600 mt-2">
                        Turn unused gadgets and dangerous swollen batteries into real rewards through our 4-step verified process.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
                        <div>
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-4">
                            01
                          </div>
                          <h4 className="font-bold text-neutral-900 text-sm mb-1">
                            List Your Electronics
                          </h4>
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            Select old phones, dead laptops, chargers, or batteries. Receive instant cash valuation and material yield estimations.
                          </p>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
                        <div>
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-4">
                            02
                          </div>
                          <h4 className="font-bold text-neutral-900 text-sm mb-1">
                            Book Free Doorstep Pickup
                          </h4>
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            Pick a date and convenient morning/afternoon time window. Receive an encrypted 6-digit handover PIN and QR token.
                          </p>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
                        <div>
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-4">
                            03
                          </div>
                          <h4 className="font-bold text-neutral-900 text-sm mb-1">
                            Agent Verification & Weighing
                          </h4>
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            Our verified courier inspects devices on a digital scale and packages batteries in fire-retardant thermal pouches.
                          </p>
                        </div>
                      </div>

                      <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
                        <div>
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm mb-4">
                            04
                          </div>
                          <h4 className="font-bold text-neutral-900 text-sm mb-1">
                            Instant Rewards & Certificate
                          </h4>
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            Certified R2v3 partners process the items. Redeem cash via UPI or brand vouchers and download official Green Disposal Certificates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}

            {activeTab === 'catalog' && (
              <ItemCatalog
                onAddItemToCart={handleAddItemToCart}
                cartItems={cartItems}
                onOpenBooking={() => setIsBookingOpen(true)}
                onRemoveCartItem={handleRemoveCartItem}
              />
            )}

            {activeTab === 'tracking' && (
              <TrackingView
                bookings={bookings}
                onSelectBooking={() => {}}
                onOpenBookingModal={() => setIsBookingOpen(true)}
              />
            )}

            {activeTab === 'rewards' && (
              <RewardsCenter
                currentUser={currentUser}
                transactions={transactions}
              />
            )}

            {activeTab === 'recyclers' && <RecyclerMap />}

            {activeTab === 'safety' && <BatterySafetyGuide />}
          </>
        )}
      </main>

      {/* Doorstep Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        currentUser={currentUser}
        cartItems={cartItems}
        onRemoveCartItem={handleRemoveCartItem}
        onAddQuickItem={handleAddItemToCart}
        onBookingCreated={handleBookingCreated}
      />

      {/* Account / Switch Profile Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl">
            <AccountAuthPage
              onAuthenticated={() => {
                setIsAuthenticated(true);
                setIsAuthModalOpen(false);
                setCurrentUser(getCurrentUser());
                setActiveRoleState(getActiveRole());
              }}
              onExploreAsGuest={() => {
                setIsAuthModalOpen(false);
              }}
              onClose={() => setIsAuthModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-800">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-neutral-950 flex items-center justify-center font-bold">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="text-base font-bold text-white">EkoReturn</span>
              </div>
              <p className="text-neutral-400 text-xs leading-relaxed">
                "Recycle your electronics. Earn rewards. Protect the planet." Connecting households with authorized e-waste collection partners to eliminate toxic landfill leaching.
              </p>
              <div className="text-[11px] text-emerald-400 font-mono">
                CPCB & R2v3 Certified Partner Network
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3">
                Household Portal
              </span>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <button onClick={() => { setActiveTab('catalog'); handleRoleChange('household'); }} className="hover:text-white transition-colors">
                    Electronics Catalog & Value Estimator
                  </button>
                </li>
                <li>
                  <button onClick={() => { setIsBookingOpen(true); handleRoleChange('household'); }} className="hover:text-white transition-colors">
                    Book Doorstep Collection
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('tracking'); handleRoleChange('household'); }} className="hover:text-white transition-colors">
                    Live Status & Courier Tracking
                  </button>
                </li>
                <li>
                  <button onClick={() => { setActiveTab('rewards'); handleRoleChange('household'); }} className="hover:text-white transition-colors">
                    Eco-Points & UPI Cash Payouts
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3">
                Safety & Compliance
              </span>
              <ul className="space-y-2 text-neutral-400">
                <li>
                  <button onClick={() => setActiveTab('safety')} className="hover:text-white transition-colors">
                    Lithium Battery Fire Prevention
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('safety')} className="hover:text-white transition-colors">
                    Personal Data Sanitization Guide
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('recyclers')} className="hover:text-white transition-colors">
                    Authorized E-Waste Centers Map
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3">
                Logistics & Plant Access
              </span>
              <p className="text-neutral-400 text-xs mb-3">
                Switch roles in the top bar to inspect courier dispatch routes or certified processing plant consoles.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { handleRoleChange('collector'); setActiveTab('collector'); }}
                  className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-left text-neutral-300 hover:text-white flex items-center justify-between"
                >
                  <span>Collector Dispatch View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { handleRoleChange('admin_recycler'); setActiveTab('admin'); }}
                  className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-left text-neutral-300 hover:text-white flex items-center justify-between"
                >
                  <span>Plant Auditor Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
            <span>© 2026 EkoReturn Technologies. All rights reserved. Built for MCA Academic & Practical Implementation.</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  resetAllData();
                  window.location.reload();
                }}
                className="hover:text-neutral-300 underline"
              >
                Reset Demo Data
              </button>
              <span>·</span>
              <span>Central Pollution Control Board Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
