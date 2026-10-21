import { EWasteCategory, ItemCondition, PickupStatus } from '../types';

export const calculateItemValuation = (
  category: EWasteCategory,
  condition: ItemCondition,
  quantity: number = 1
) => {
  let multiplier = 0.5;
  if (condition === 'working') {
    multiplier = 1.0;
  } else if (condition === 'minor_defect') {
    multiplier = 0.75;
  } else if (condition === 'scrap_dead') {
    multiplier = 0.45;
  }

  const pointsPerUnit = Math.round(category.baseRewardPoints * multiplier);
  const cashPerUnit = Math.round(category.baseCashValue * multiplier);

  return {
    points: pointsPerUnit * quantity,
    cash: cashPerUnit * quantity,
    weightKg: Number((category.avgWeightKg * quantity).toFixed(2)),
  };
};

export const calculateEnvironmentalImpact = (totalWeightKg: number) => {
  // Approximate standard circular electronics recovery factors:
  // 1 kg e-waste diverted ≈ 4.4 kg CO2 prevented compared to virgin mining
  // 1 kg e-waste diverted ≈ 140 mg gold, 320 mg silver, 130g copper, 25g cobalt
  // 1 kg e-waste diverted avoids 12g toxic lead/cadmium landfill leaching
  return {
    co2Kg: Number((totalWeightKg * 4.4).toFixed(1)),
    goldMg: Math.round(totalWeightKg * 140),
    copperG: Math.round(totalWeightKg * 130),
    cobaltG: Math.round(totalWeightKg * 25),
    toxicPreventedG: Math.round(totalWeightKg * 12),
    treesEquivalent: Number((totalWeightKg * 0.22).toFixed(1)),
  };
};

export const getStatusMeta = (status: PickupStatus): { label: string; textClass: string; bgClass: string; stepIndex: number } => {
  switch (status) {
    case 'pending':
      return { label: 'Pending Review', textClass: 'text-amber-800', bgClass: 'bg-amber-50 border-amber-200', stepIndex: 0 };
    case 'confirmed':
      return { label: 'Pickup Confirmed', textClass: 'text-blue-800', bgClass: 'bg-blue-50 border-blue-200', stepIndex: 1 };
    case 'collector_assigned':
      return { label: 'Partner Assigned', textClass: 'text-indigo-800', bgClass: 'bg-indigo-50 border-indigo-200', stepIndex: 2 };
    case 'collector_en_route':
      return { label: 'Collector En Route', textClass: 'text-emerald-800', bgClass: 'bg-emerald-50 border-emerald-200', stepIndex: 3 };
    case 'at_doorstep':
      return { label: 'At Doorstep (Inspecting)', textClass: 'text-teal-800', bgClass: 'bg-teal-50 border-teal-200', stepIndex: 4 };
    case 'collected':
      return { label: 'Collected & Sealed', textClass: 'text-slate-800', bgClass: 'bg-slate-100 border-slate-300', stepIndex: 5 };
    case 'transferred_to_recycler':
      return { label: 'At Authorized Facility', textClass: 'text-purple-800', bgClass: 'bg-purple-50 border-purple-200', stepIndex: 6 };
    case 'verified_recycled':
      return { label: 'Certified Recycled & Paid', textClass: 'text-emerald-900', bgClass: 'bg-emerald-100 border-emerald-300', stepIndex: 7 };
    case 'cancelled':
      return { label: 'Cancelled', textClass: 'text-rose-800', bgClass: 'bg-rose-50 border-rose-200', stepIndex: -1 };
    default:
      return { label: status, textClass: 'text-neutral-800', bgClass: 'bg-neutral-100 border-neutral-300', stepIndex: 0 };
  }
};
