import { SmartRouteSuggestion } from '../types';

export interface RouteClusterNode {
  id: string;
  name: string;
  addressSnippet: string;
  itemSummary: string;
  coordinates: { xPercent: number; yPercent: number };
}

export const getSmartRouteSuggestion = (pincode: string, address: string): {
  suggestion: SmartRouteSuggestion;
  clusterNodes: RouteClusterNode[];
  alternativeEcoSlots: { date: string; time: string; existingCount: number; fuelSavedKm: number; bonusPts: number }[];
} => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);
  const dayAfterStr = dayAfter.toISOString().split('T')[0];

  const threeDaysLater = new Date();
  threeDaysLater.setDate(threeDaysLater.getDate() + 3);
  const threeDaysStr = threeDaysLater.toISOString().split('T')[0];

  // Map pincodes to local density clusters
  const cleanPin = pincode.trim();
  let zoneName = 'Zone ORR-East · Outer Ring Road & Bellandur Cluster';
  let zoneId = 'ZONE_ORR_560103';

  if (cleanPin.startsWith('560034') || address.toLowerCase().includes('koramangala')) {
    zoneName = 'Zone KRM-South · Koramangala 4th-7th Block Sector';
    zoneId = 'ZONE_KRM_560034';
  } else if (cleanPin.startsWith('560066') || address.toLowerCase().includes('whitefield')) {
    zoneName = 'Zone WFD-Tech · Whitefield & ITPL Corridor';
    zoneId = 'ZONE_WFD_560066';
  } else if (cleanPin.startsWith('560037') || address.toLowerCase().includes('marathahalli')) {
    zoneName = 'Zone MRH-Central · Marathahalli Logistics Hub';
    zoneId = 'ZONE_MRH_560037';
  }

  const suggestion: SmartRouteSuggestion = {
    zoneId,
    zoneName,
    recommendedDate: tomorrowStr,
    recommendedTimeSlot: '10:00 AM - 01:00 PM',
    existingPickupsCount: 5,
    fuelSavedKm: 3.8,
    co2SavedKg: 1.9,
    bonusEcoPoints: 50,
    clusterDensityLabel: 'High Density Cluster',
  };

  const clusterNodes: RouteClusterNode[] = [
    {
      id: 'node_1',
      name: 'Aditi V.',
      addressSnippet: 'Green Meadows Tower B',
      itemSummary: '2 phones, 1 laptop',
      coordinates: { xPercent: 28, yPercent: 35 },
    },
    {
      id: 'node_2',
      name: 'Rohan M.',
      addressSnippet: 'Palm Grove Sector 3',
      itemSummary: '1 microwave, cables',
      coordinates: { xPercent: 45, yPercent: 22 },
    },
    {
      id: 'node_3',
      name: 'Sunil K.',
      addressSnippet: 'Outer Ring Rd Block 2',
      itemSummary: '3 power banks, tablet',
      coordinates: { xPercent: 72, yPercent: 40 },
    },
    {
      id: 'node_4',
      name: 'Kavita R.',
      addressSnippet: 'Silver Spring Villa 14',
      itemSummary: 'Old MacBook, printer',
      coordinates: { xPercent: 60, yPercent: 68 },
    },
    {
      id: 'node_5',
      name: 'Neighborhood Van Hub',
      addressSnippet: 'EV Route Dispatch #KA-01-EV',
      itemSummary: 'Active Electric Van In Transit',
      coordinates: { xPercent: 38, yPercent: 55 },
    },
  ];

  const alternativeEcoSlots = [
    {
      date: tomorrowStr,
      time: '10:00 AM - 01:00 PM',
      existingCount: 5,
      fuelSavedKm: 3.8,
      bonusPts: 50,
    },
    {
      date: dayAfterStr,
      time: '02:00 PM - 05:00 PM',
      existingCount: 4,
      fuelSavedKm: 2.9,
      bonusPts: 40,
    },
    {
      date: threeDaysStr,
      time: '09:00 AM - 12:00 PM',
      existingCount: 3,
      fuelSavedKm: 2.2,
      bonusPts: 30,
    },
  ];

  return { suggestion, clusterNodes, alternativeEcoSlots };
};
