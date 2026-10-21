import { ADMIN_USER, AUTHORIZED_RECYCLERS, COLLECTOR_USER, INITIAL_BOOKINGS, INITIAL_TRANSACTIONS, INITIAL_USER, REWARD_OPTIONS } from '../data/mockData';
import { AuthorizedRecycler, EWasteItemDraft, PickupBooking, PickupStatus, RewardOption, RewardTransaction, UserProfile, UserRole } from '../types';

const STORAGE_KEYS = {
  USER: 'ekoreturn_user',
  ALL_USERS: 'ekoreturn_all_users',
  BOOKINGS: 'ekoreturn_bookings',
  TRANSACTIONS: 'ekoreturn_transactions',
  RECYCLERS: 'ekoreturn_recyclers',
  ACTIVE_ROLE: 'ekoreturn_active_role',
  IS_AUTHENTICATED: 'ekoreturn_is_authenticated',
};

const notifyChange = () => {
  window.dispatchEvent(new Event('ekoreturn_storage_update'));
};

export const getStoredUsers = (): Record<UserRole, UserProfile> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return {
    household: INITIAL_USER,
    collector: COLLECTOR_USER,
    admin_recycler: ADMIN_USER,
  };
};

export const getActiveRole = (): UserRole => {
  try {
    const role = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) as UserRole;
    if (role && ['household', 'collector', 'admin_recycler'].includes(role)) {
      return role;
    }
  } catch (e) {
    console.error(e);
  }
  return 'household';
};

export const setActiveRole = (role: UserRole) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
  notifyChange();
};

export const getCurrentUser = (): UserProfile => {
  const role = getActiveRole();
  const users = getStoredUsers();
  return users[role] || INITIAL_USER;
};

export const updateUserProfile = (updated: Partial<UserProfile>) => {
  const role = getActiveRole();
  const users = getStoredUsers();
  users[role] = { ...users[role], ...updated };
  localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));
  notifyChange();
};

export const getBookings = (): PickupBooking[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_BOOKINGS;
};

export const saveBookings = (bookings: PickupBooking[]) => {
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  notifyChange();
};

export const addBooking = (booking: Omit<PickupBooking, 'id' | 'trackingNumber' | 'createdAt' | 'updatedAt' | 'verificationCode' | 'safetyHazardCheckPassed'>): PickupBooking => {
  const bookings = getBookings();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newBooking: PickupBooking = {
    ...booking,
    id: `bk_${Date.now()}`,
    trackingNumber: `EKR-2026-${randomSuffix}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    verificationCode: Math.floor(100000 + Math.random() * 900000).toString(),
    safetyHazardCheckPassed: true,
  };

  const updatedBookings = [newBooking, ...bookings];
  saveBookings(updatedBookings);
  return newBooking;
};

export const updateBookingStatus = (
  id: string,
  newStatus: PickupStatus,
  extraUpdates?: Partial<PickupBooking>
) => {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return;

  const current = bookings[idx];
  const updated: PickupBooking = {
    ...current,
    status: newStatus,
    updatedAt: new Date().toISOString(),
    ...extraUpdates,
  };

  // If status is changed to verified_recycled, ensure rewards are credited to the user
  if (newStatus === 'verified_recycled' && current.status !== 'verified_recycled') {
    const pointsAwarded = updated.actualPointsAwarded || updated.totalEstimatedPoints;
    const finalWeight = updated.actualWeightKg || updated.totalEstWeightKg;
    const certId = `CERT-EKR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    updated.certificateId = certId;
    updated.actualPointsAwarded = pointsAwarded;
    updated.actualWeightKg = finalWeight;

    // Credit household user
    const users = getStoredUsers();
    const household = users.household;
    household.rewardPoints += pointsAwarded;
    household.totalItemsRecycled += updated.items.reduce((acc, i) => acc + i.quantity, 0);
    household.totalWeightRecycledKg = Number((household.totalWeightRecycledKg + finalWeight).toFixed(1));
    household.co2SavedKg = Number((household.co2SavedKg + finalWeight * 4.4).toFixed(1));
    localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));

    // Add transaction
    addTransaction({
      userId: updated.userId,
      type: 'earned_pickup',
      points: pointsAwarded,
      amountCurrency: updated.totalEstimatedCash,
      description: `E-waste verified & recycled: ${updated.trackingNumber} (${finalWeight} kg)`,
      referenceId: updated.id,
      status: 'completed',
    });
  }

  bookings[idx] = updated;
  saveBookings(bookings);
};

export const getTransactions = (): RewardTransaction[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_TRANSACTIONS;
};

export const addTransaction = (tx: Omit<RewardTransaction, 'id' | 'timestamp'>) => {
  const transactions = getTransactions();
  const newTx: RewardTransaction = {
    ...tx,
    id: `tx_${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([newTx, ...transactions]));
  notifyChange();
  return newTx;
};

export const redeemReward = (
  reward: RewardOption,
  payoutDestination: string
): { success: boolean; message: string; couponCode?: string } => {
  const users = getStoredUsers();
  const household = users.household;

  if (household.rewardPoints < reward.pointsRequired) {
    return {
      success: false,
      message: `Insufficient eco-points. You have ${household.rewardPoints} pts, but ${reward.pointsRequired} pts are required.`,
    };
  }

  household.rewardPoints -= reward.pointsRequired;
  localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));

  const randomCode = `${reward.brand.slice(0, 3).toUpperCase()}-EKR-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

  addTransaction({
    userId: household.id,
    rewardId: reward.id,
    type: reward.category === 'cash' ? 'redeemed_cash' : reward.category === 'eco_impact' ? 'tree_donation' : 'redeemed_voucher',
    points: -reward.pointsRequired,
    amountCurrency: reward.cashEquivalent,
    description: `Redeemed: ${reward.title} to ${payoutDestination}`,
    referenceId: `RED-${Date.now()}`,
    couponCode: randomCode,
    status: 'completed',
  });

  notifyChange();
  return {
    success: true,
    message: `Successfully redeemed! ₹${reward.cashEquivalent} equivalent credited.`,
    couponCode: randomCode,
  };
};

export const getRecyclers = (): AuthorizedRecycler[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECYCLERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return AUTHORIZED_RECYCLERS;
};

export const resetAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.ALL_USERS);
  localStorage.removeItem(STORAGE_KEYS.BOOKINGS);
  localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
  localStorage.removeItem(STORAGE_KEYS.RECYCLERS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_ROLE);
  localStorage.removeItem(STORAGE_KEYS.IS_AUTHENTICATED);
  notifyChange();
};

export const isUserAuthenticated = (): boolean => {
  const val = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
  if (val === null) {
    return false;
  }
  return val === 'true';
};

export const loginUser = (role: UserRole = 'household', userUpdates?: Partial<UserProfile>) => {
  setActiveRole(role);
  if (userUpdates) {
    updateUserProfile(userUpdates);
  }
  localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');
  notifyChange();
};

export const registerUser = (details: {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  role: UserRole;
}): UserProfile => {
  const users = getStoredUsers();
  const newUser: UserProfile = {
    id: `usr_${Date.now()}`,
    name: details.name,
    email: details.email,
    phone: details.phone,
    address: details.address,
    city: details.city || 'Bengaluru',
    pincode: details.pincode || '560103',
    role: details.role,
    rewardPoints: details.role === 'household' ? 250 : 0,
    totalItemsRecycled: 0,
    totalWeightRecycledKg: 0,
    co2SavedKg: 0,
  };

  users[details.role] = newUser;
  localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, details.role);
  localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'true');

  if (details.role === 'household') {
    addTransaction({
      userId: newUser.id,
      type: 'earned_pickup',
      points: 250,
      amountCurrency: 250,
      description: 'Welcome Sign-up Bonus: Joined the EkoReturn Circular Network',
      referenceId: 'WELCOME-BONUS',
      status: 'completed',
    });
  }

  notifyChange();
  return newUser;
};

export const logoutUser = () => {
  localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, 'false');
  notifyChange();
};

