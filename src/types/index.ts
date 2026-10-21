export type UserRole = 'household' | 'collector' | 'admin_recycler';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  role: UserRole;
  rewardPoints: number;
  totalItemsRecycled: number;
  totalWeightRecycledKg: number;
  co2SavedKg: number;
}

export type ItemCondition = 'working' | 'minor_defect' | 'scrap_dead';

export interface EWasteCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  avgWeightKg: number;
  baseRewardPoints: number;
  baseCashValue: number;
  hasBattery: boolean;
  preciousMetals: {
    goldMg: number;
    silverMg: number;
    copperG: number;
    cobaltG: number;
  };
}

export interface EWasteItemDraft {
  id: string;
  categoryId: string;
  categoryName: string;
  modelName: string;
  brand: string;
  condition: ItemCondition;
  quantity: number;
  hasBattery: boolean;
  batteryStatus: 'normal' | 'swollen' | 'missing' | 'none';
  dataWiped: boolean;
  estimatedPoints: number;
  estimatedCash: number;
  photoUrl?: string;
  notes?: string;
}

export type PickupStatus = 
  | 'pending'
  | 'confirmed'
  | 'collector_assigned'
  | 'collector_en_route'
  | 'at_doorstep'
  | 'collected'
  | 'transferred_to_recycler'
  | 'verified_recycled'
  | 'cancelled';

export interface PickupBooking {
  id: string;
  trackingNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  pickupAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: { lat: number; lng: number };
    addressType: 'home' | 'apartment' | 'office';
    doorstepInstructions?: string;
  };
  scheduledDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "10:00 AM - 01:00 PM"
  items: EWasteItemDraft[];
  totalEstimatedPoints: number;
  totalEstimatedCash: number;
  totalEstWeightKg: number;
  actualWeightKg?: number;
  actualPointsAwarded?: number;
  status: PickupStatus;
  createdAt: string;
  updatedAt: string;
  assignedCollector?: {
    id: string;
    name: string;
    phone: string;
    vehiclePlate: string;
    currentCoords?: { lat: number; lng: number };
    etaMinutes?: number;
  };
  authorizedRecyclerId?: string;
  authorizedRecyclerName?: string;
  verificationCode: string; // 6-digit or QR payload
  collectorNotes?: string;
  safetyHazardCheckPassed: boolean;
  certificateId?: string;
  isSmartRouteEcoSlot?: boolean;
  greenRouteBonusPoints?: number;
  co2FuelSavedKg?: number;
  routeClusterZone?: string;
}

export interface SmartRouteSuggestion {
  zoneId: string;
  zoneName: string;
  recommendedDate: string;
  recommendedTimeSlot: string;
  existingPickupsCount: number;
  fuelSavedKm: number;
  co2SavedKg: number;
  bonusEcoPoints: number;
  clusterDensityLabel: 'Optimal Density' | 'High Density Cluster' | 'Max Carbon Offset';
}

export interface AuthorizedRecycler {
  id: string;
  name: string;
  licenseNumber: string;
  certification: 'R2v3' | 'e-Stewards' | 'CPCB Authorized' | 'ISO 14001';
  address: string;
  city: string;
  coordinates: { lat: number; lng: number };
  acceptedCategories: string[];
  contactPhone: string;
  operatingHours: string;
  rating: number;
  materialRecoveryRatePercent: number;
}

export interface RewardOption {
  id: string;
  title: string;
  category: 'cash' | 'voucher' | 'eco_impact' | 'gadget_discount';
  pointsRequired: number;
  cashEquivalent: number;
  brand: string;
  description: string;
  expiryDays: number;
  iconName: string;
}

export interface RewardTransaction {
  id: string;
  userId: string;
  rewardId?: string;
  type: 'earned_pickup' | 'redeemed_cash' | 'redeemed_voucher' | 'tree_donation';
  points: number; // positive for earned, negative for redeemed
  amountCurrency?: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'processing';
  referenceId: string;
  couponCode?: string;
}

export interface GreenCertificate {
  certificateId: string;
  bookingId: string;
  userName: string;
  issuedDate: string;
  itemsSummary: string;
  totalWeightKg: number;
  co2DivertedKg: number;
  toxicLeadPreventedG: number;
  recyclerName: string;
  recyclerLicense: string;
}
