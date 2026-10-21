import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te';

export interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
];

export const translations = {
  en: {
    // Header
    brandTitle: 'EkoReturn',
    brandSubtitle: 'Circular E-Waste Network',
    navOverview: 'Overview',
    navCatalog: 'Item Catalog & Pricing',
    navTracking: 'Pickup Tracking',
    navImpact: 'Impact Dashboard',
    navRewards: 'Rewards & Wallet',
    navRecyclers: 'Authorized Recyclers',
    navSafety: 'Battery Safety',
    roleLabel: 'Role',
    roleHousehold: 'Household User',
    roleCollector: 'Doorstep Collector',
    roleAdmin: 'Authorized Recycler',
    bookPickupBtn: 'Book Pickup',
    collectorDispatchBtn: 'Collector Dispatch',
    recyclerConsoleBtn: 'Recycler Console',
    ptsLabel: 'pts',

    // Booking Modal
    modalTitle: 'Book Doorstep E-Waste Pickup',
    modalTitleSuccess: 'Doorstep Pickup Confirmed!',
    stepSubtitle: 'Step {step} of 3 · Zero pickup charges',
    stepSuccessSubtitle: 'Authorized Collector Dispatched',
    step1Title: 'Review Items in Your Pickup Box',
    configuredItems: '{count} items configured',
    emptyBox: 'Your pickup box is currently empty.',
    addSampleBtn: '+ Add Sample Smartphone (OnePlus 6T)',
    estimatedReturnVal: 'Estimated Return Value:',
    valFormulaNote: 'Calculated based on metal recovery & grade',
    batterySafetyNotice: 'Battery Safety: If you are disposing of lithium-ion batteries or bloated devices, our collection partner carries certified thermal insulation bags.',
    continueToAddress: 'Continue to Address & Contact',
    
    // Step 2 Address
    step2Title: 'Household Pickup Location',
    useGpsBtn: 'Use My GPS Location',
    detectingGps: 'Detecting Location...',
    streetLabel: 'Street Address / Apartment & Flat No.',
    streetPlaceholder: 'e.g. Flat 402, Green Meadows, Outer Ring Road',
    cityLabel: 'City',
    pincodeLabel: 'Postal Pincode',
    nameLabel: 'Resident Contact Name',
    phoneLabel: 'Mobile Number (For Verification SMS/OTP)',
    notesLabel: 'Doorstep Instructions / Gate Access Notes',
    notesPlaceholder: 'e.g. Call at security gate #1, ring doorbell',
    backBtn: 'Back',
    continueToSchedule: 'Continue to Smart Schedule',

    // Step 3 Smart Schedule
    step3Title: 'Pickup Slot & Certified Processing Partner',
    smartScheduleBannerTitle: 'Smart Eco-Schedule Suggestion',
    recommendedLabel: 'Recommended:',
    smartRouteDesc: 'Electric logistics van #KA-01-EV is already scheduled for {count} pickups in {zone}. Grouping your pickup on this high-density run eliminates {km} km of courier detour and prevents {co2} kg of vehicle fuel emissions!',
    bonusEcoPtsBadge: '+{pts} Bonus Eco-Points',
    ecoSlotActive: 'Eco-Slot Active (+{pts} Pts)',
    selectEcoSlot: 'Select Smart Eco-Slot',
    chooseCustomSlot: 'Choose Custom Slot',
    viewClusterMap: 'View Neighborhood Density Map',
    hideClusterMap: 'Hide Cluster Map',
    clusterMapHeader: 'Zone Route Clustered Nodes (Saves {km} km van detour)',
    stopsInSector: '{count} Stops in Sector',
    yourDoorstep: 'Your Doorstep (+50 Pts)',
    clusterProof: 'All {count} neighbors scheduled in same time window',
    zeroMileage: 'Zero empty courier mileage',
    otherEcoWindows: 'Other High-Density Routing Windows in Your Sector:',
    nearbyPickupsCount: '{count} nearby pickups',
    customScheduleHeading: 'Custom Schedule Selection (Standard Routing)',
    selectDateLabel: 'Select Pickup Date',
    preferredSlotLabel: 'Preferred Time Slot',
    morningSlot: 'Morning Slot',
    afternoonSlot: 'Afternoon Slot',
    eveningSlot: 'Evening Slot',
    dispatchedPartnerLabel: 'Dispatched to Authorized E-Waste Partner',
    recoveryRate: '{rate}% Recovery Rate',
    totalPtsCredited: 'Total Points Credited:',
    includesSmartBonus: 'Includes +{pts} Green Route Cluster Bonus',
    confirmBookingBtn: 'Confirm & Schedule Pickup',

    // Step 4 Confirmation
    bookingSuccessHeading: 'Pickup Successfully Booked!',
    bookingSuccessDesc: 'Your doorstep collection request has been registered and scheduled into our optimal circular route.',
    smartEcoActiveBadge: 'Smart Eco-Route Active: +{pts} Bonus Points · {co2} kg Courier Fuel CO₂ Saved!',
    trackingCodeLabel: 'Tracking Code:',
    handoffPinLabel: 'Handoff PIN:',
    pinInstruction: 'Show this PIN to the courier upon doorstep arrival to complete secure handover.',
    scheduledForLabel: 'Scheduled For:',
    partnerRecyclerLabel: 'Partner Recycler:',
    viewActiveTrackingBtn: 'View Active Tracking',
  },

  hi: {
    // Header
    brandTitle: 'इकोरिटर्न',
    brandSubtitle: 'सर्कुलर ई-कचरा नेटवर्क',
    navOverview: 'अवलोकन',
    navCatalog: 'सामग्री सूची और मूल्य',
    navTracking: 'पिकअप ट्रैकिंग',
    navImpact: 'प्रभाव डैशबोर्ड',
    navRewards: 'इनाम और वॉलेट',
    navRecyclers: 'अधिकृत रिसाइक्लर्स',
    navSafety: 'बैटरी सुरक्षा',
    roleLabel: 'भूमिका',
    roleHousehold: 'घरेलू उपयोगकर्ता',
    roleCollector: 'डोरस्टेप संग्रहकर्ता',
    roleAdmin: 'अधिकृत रिसाइक्लर',
    bookPickupBtn: 'पिकअप बुक करें',
    collectorDispatchBtn: 'कलेक्टर डिस्पैच',
    recyclerConsoleBtn: 'रिसाइक्लर कंसोल',
    ptsLabel: 'अंक',

    // Booking Modal
    modalTitle: 'डोरस्टेप ई-कचरा पिकअप बुक करें',
    modalTitleSuccess: 'डोरस्टेप पिकअप की पुष्टि हुई!',
    stepSubtitle: 'चरण {step} / 3 · कोई शुल्क नहीं',
    stepSuccessSubtitle: 'अधिकृत संग्रहकर्ता भेजा गया',
    step1Title: 'अपने पिकअप बॉक्स की समीक्षा करें',
    configuredItems: '{count} आइटम जोड़े गए',
    emptyBox: 'आपका पिकअप बॉक्स वर्तमान में खाली है।',
    addSampleBtn: '+ नमूना स्मार्टफोन जोड़ें (OnePlus 6T)',
    estimatedReturnVal: 'अनुमानित रिटर्न मूल्य:',
    valFormulaNote: 'धातु निष्कर्षण और स्थिति के आधार पर गणना',
    batterySafetyNotice: 'बैटरी सुरक्षा: यदि आप लिथियम-आयन बैटरी या फूले हुए उपकरणों का निपटान कर रहे हैं, तो हमारे पार्टनर विशेष थर्मल बैग लाएंगे।',
    continueToAddress: 'पता और संपर्क विवरण पर आगे बढ़ें',

    // Step 2 Address
    step2Title: 'घरेलू पिकअप का पता',
    useGpsBtn: 'जीपीएस स्थान का उपयोग करें',
    detectingGps: 'स्थान खोजा जा रहा है...',
    streetLabel: 'घर / फ्लैट नंबर और सड़क का पता',
    streetPlaceholder: 'उदा. फ्लैट 402, ग्रीन मीडोज, आउटर रिंग रोड',
    cityLabel: 'शहर',
    pincodeLabel: 'पिनकोड',
    nameLabel: 'निवासी का नाम',
    phoneLabel: 'मोबाइल नंबर (ओटीपी और सत्यापन हेतु)',
    notesLabel: 'दरवाजे के निर्देश / गेट का विवरण',
    notesPlaceholder: 'उदा. सुरक्षा गेट पर फोन करें, डोरबेल बजाएं',
    backBtn: 'पीछे',
    continueToSchedule: 'स्मार्ट शेड्यूल पर आगे बढ़ें',

    // Step 3 Smart Schedule
    step3Title: 'पिकअप समय और अधिकृत पार्टनर',
    smartScheduleBannerTitle: 'स्मार्ट इको-शेड्यूल सुझाव',
    recommendedLabel: 'अनुशंसित:',
    smartRouteDesc: 'इलेक्ट्रिक वैन #KA-01-EV पहले से ही {zone} में {count} पिकअप के लिए निर्धारित है। इस उच्च-घनत्व वाले स्लॉट को चुनने से {km} किमी का चक्कर बचेगा और {co2} किग्रा ईंधन उत्सर्जन रुकेगा!',
    bonusEcoPtsBadge: '+{pts} बोनस इको-अंक',
    ecoSlotActive: 'इको-स्लॉट सक्रिय (+{pts} अंक)',
    selectEcoSlot: 'स्मार्ट इको-स्लॉट चुनें',
    chooseCustomSlot: 'कस्टम स्लॉट चुनें',
    viewClusterMap: 'आस-पड़ोस घनत्व मानचित्र देखें',
    hideClusterMap: 'मानचित्र छुपाएं',
    clusterMapHeader: 'जोन क्लस्टर नोड्स ({km} किमी वाहन की बचत)',
    stopsInSector: 'सेक्टर में {count} स्टॉप',
    yourDoorstep: 'आपका घर (+50 अंक)',
    clusterProof: 'सभी {count} पड़ोसी समान समय स्लॉट में हैं',
    zeroMileage: 'शून्य अतिरिक्त माइलेज',
    otherEcoWindows: 'आपके क्षेत्र में अन्य उच्च-घनत्व इको-विंडो:',
    nearbyPickupsCount: '{count} नजदीकी पिकअप',
    customScheduleHeading: 'कस्टम शेड्यूल चयन (सामान्य रूटिंग)',
    selectDateLabel: 'पिकअप की तारीख चुनें',
    preferredSlotLabel: 'पसंदीदा समय स्लॉट',
    morningSlot: 'सुबह का स्लॉट',
    afternoonSlot: 'दोपहर का स्लॉट',
    eveningSlot: 'शाम का स्लॉट',
    dispatchedPartnerLabel: 'अधिकृत ई-कचरा पार्टनर को भेजा गया',
    recoveryRate: '{rate}% सामग्री रिकवरी दर',
    totalPtsCredited: 'कुल मिलने वाले अंक:',
    includesSmartBonus: '+{pts} ग्रीन रूट क्लस्टर बोनस शामिल है',
    confirmBookingBtn: 'पिकअप की पुष्टि और शेड्यूल करें',

    // Step 4 Confirmation
    bookingSuccessHeading: 'पिकअप सफलतापूर्वक बुक हुआ!',
    bookingSuccessDesc: 'आपका डोरस्टेप संग्रह अनुरोध दर्ज कर लिया गया है और हमारे सर्वश्रेष्ठ मार्ग में जोड़ दिया गया है।',
    smartEcoActiveBadge: 'स्मार्ट इको-रूट सक्रिय: +{pts} बोनस अंक · {co2} किग्रा वाहन ईंधन CO₂ की बचत!',
    trackingCodeLabel: 'ट्रैकिंग कोड:',
    handoffPinLabel: 'हैंडऑफ पिन:',
    pinInstruction: 'सुरक्षित हैंडओवर पूरा करने के लिए आगमन पर कूरियर को यह पिन दिखाएं।',
    scheduledForLabel: 'निर्धारित समय:',
    partnerRecyclerLabel: 'पार्टनर रिसाइक्लर:',
    viewActiveTrackingBtn: 'लाइव ट्रैकिंग देखें',
  },

  kn: {
    // Header
    brandTitle: 'ಎಕೋರಿಟರ್ನ್',
    brandSubtitle: 'ಸರ್ಕ್ಯುಲರ್ ಇ-ತ್ಯಾಜ್ಯ ಜಾಲ',
    navOverview: 'ಅವಲೋಕನ',
    navCatalog: 'ವಸ್ತು ಪಟ್ಟಿ ಮತ್ತು ಬೆಲೆ',
    navTracking: 'ಪಿಕಪ್ ಟ್ರ್ಯಾಕಿಂಗ್',
    navImpact: 'ಪರಿಣಾಮ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    navRewards: 'ಬಹುಮಾನಗಳು ಮತ್ತು ವಾಲೆಟ್',
    navRecyclers: 'ಅಧಿಕೃತ ರಿಸೈಕ್ಲರ್‌ಗಳು',
    navSafety: 'ಬ್ಯಾಟರಿ ಸುರಕ್ಷತೆ',
    roleLabel: 'ಪಾತ್ರ',
    roleHousehold: 'ಮನೆಬಳಕೆದಾರ',
    roleCollector: 'ಮನೆಬಾಗಿಲ ಸಂಗ್ರಾಹಕ',
    roleAdmin: 'ಅಧಿಕೃತ ರಿಸೈಕ್ಲರ್',
    bookPickupBtn: 'ಪಿಕಪ್ ಬುಕ್ ಮಾಡಿ',
    collectorDispatchBtn: 'ಸಂಗ್ರಾಹಕ ಡಿಸ್ಪ್ಯಾಚ್',
    recyclerConsoleBtn: 'ರಿಸೈಕ್ಲರ್ ಕನ್ಸೋಲ್',
    ptsLabel: 'ಅಂಕಗಳು',

    // Booking Modal
    modalTitle: 'ಮನೆಬಾಗಿಲ ಇ-ತ್ಯಾಜ್ಯ ಪಿಕಪ್ ಬುಕ್ ಮಾಡಿ',
    modalTitleSuccess: 'ಮನೆಬಾಗಿಲ ಪಿಕಪ್ ದೃಢಪಟ್ಟಿದೆ!',
    stepSubtitle: 'ಹಂತ {step} / 3 · ಯಾವುದೇ ಶುಲ್ಕವಿಲ್ಲ',
    stepSuccessSubtitle: 'ಅಧಿಕೃತ ಸಂಗ್ರಾಹಕರನ್ನು ನಿಯೋಜಿಸಲಾಗಿದೆ',
    step1Title: 'ನಿಮ್ಮ ಪಿಕಪ್ ಪೆಟ್ಟಿಗೆಯನ್ನು ಪರಿಶೀಲಿಸಿ',
    configuredItems: '{count} ವಸ್ತುಗಳನ್ನು ಸೇರಿಸಲಾಗಿದೆ',
    emptyBox: 'ನಿಮ್ಮ ಪಿಕಪ್ ಬಾಕ್ಸ್ ಖಾಲಿಯಾಗಿದೆ.',
    addSampleBtn: '+ ಮಾದರಿ ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಸೇರಿಸಿ (OnePlus 6T)',
    estimatedReturnVal: 'ಅಂದಾಜು ರಿಟರ್ನ್ ಮೌಲ್ಯ:',
    valFormulaNote: 'ಲೋಹದ ಮರುಬಳಕೆ ಮತ್ತು ಸಾಧನದ ಸ್ಥಿತಿಯ ಆಧಾರದ ಮೇಲೆ',
    batterySafetyNotice: 'ಬ್ಯಾಟರಿ ಸುರಕ್ಷತೆ: ನೀವು ಲಿಥಿಯಂ ಬ್ಯಾಟರಿಗಳನ್ನು ವಿಲೇವಾರಿ ಮಾಡುತ್ತಿದ್ದರೆ, ನಮ್ಮ ಸಂಗ್ರಾಹಕರು ಉಷ್ಣ ನಿರೋಧಕ ಬ್ಯಾಗ್ ತರುತ್ತಾರೆ.',
    continueToAddress: 'ವಿಳಾಸ ಮತ್ತು ಸಂಪರ್ಕಕ್ಕೆ ಮುಂದುವರಿಯಿರಿ',

    // Step 2 Address
    step2Title: 'ಮನೆಯ ಪಿಕಪ್ ಸ್ಥಳ',
    useGpsBtn: 'ನನ್ನ ಜಿಪಿಎಸ್ ಸ್ಥಳ ಬಳಸಿ',
    detectingGps: 'ಸ್ಥಳ ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತಿದೆ...',
    streetLabel: 'ಮನೆ / ಫ್ಲಾಟ್ ಸಂಖ್ಯೆ ಮತ್ತು ರಸ್ತೆ ವಿಳಾಸ',
    streetPlaceholder: 'ಉದಾ: ಫ್ಲಾಟ್ 402, ಗ್ರೀನ್ ಮೆಡೋಸ್, ಔಟರ್ ರಿಂಗ್ ರೋಡ್',
    cityLabel: 'ನಗರ',
    pincodeLabel: 'ಪಿನ್‌ಕೋಡ್',
    nameLabel: 'ನಿವಾಸಿಗಳ ಹೆಸರು',
    phoneLabel: 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ಪರಿಶೀಲನಾ ಒಟಿಪಿಗಾಗಿ)',
    notesLabel: 'ಮನೆಬಾಗಿಲ ಸೂಚನೆಗಳು / ಗೇಟ್ ಪ್ರವೇಶ ವಿವರ',
    notesPlaceholder: 'ಉದಾ: ಭದ್ರತಾ ಗೇಟ್‌ನಲ್ಲಿ ಕರೆ ಮಾಡಿ, ಡೋರ್‌ಬೆಲ್ ಬಾರಿಸಿ',
    backBtn: 'ಹಿಂದೆ',
    continueToSchedule: 'ಸ್ಮಾರ್ಟ್ ವೇಳಾಪಟ್ಟಿಗೆ ಮುಂದುವರಿಯಿರಿ',

    // Step 3 Smart Schedule
    step3Title: 'ಪಿಕಪ್ ಸಮಯ ಮತ್ತು ಅಧಿಕೃತ ಪಾಲುದಾರರು',
    smartScheduleBannerTitle: 'ಸ್ಮಾರ್ಟ್ ಇಕೋ-ವೇಳಾಪಟ್ಟಿ ಸಲಹೆ',
    recommendedLabel: 'ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ:',
    smartRouteDesc: 'ಎಲೆಕ್ಟ್ರಿಕ್ ವ್ಯಾನ್ #KA-01-EV ಈಗಾಗಲೇ {zone} ನಲ್ಲಿ {count} ಪಿಕಪ್‌ಗಳಿಗೆ ನಿಗದಿಯಾಗಿದೆ. ಈ ಸಮಯವನ್ನು ಆಯ್ಕೆ ಮಾಡುವುದರಿಂದ {km} ಕಿ.ಮೀ ವ್ಯರ್ಥ ಸಂಚಾರ ತಪ್ಪುತ್ತದೆ ಮತ್ತು {co2} ಕೆ.ಜಿ ಇಂಧನ ಮಾಲಿನ್ಯ ಕಡಿಮೆಯಾಗುತ್ತದೆ!',
    bonusEcoPtsBadge: '+{pts} ಬೋನಸ್ ಇಕೋ-ಅಂಕಗಳು',
    ecoSlotActive: 'ಇಕೋ-ಸ್ಲಾಟ್ ಸಕ್ರಿಯ (+{pts} ಅಂಕಗಳು)',
    selectEcoSlot: 'ಸ್ಮಾರ್ಟ್ ಇಕೋ-ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಿ',
    chooseCustomSlot: 'ಕಸ್ಟಮ್ ಸ್ಲಾಟ್ ಆಯ್ಕೆಮಾಡಿ',
    viewClusterMap: 'ಸ್ಥಳೀಯ ಸಾಂದ್ರತೆಯ ನಕ್ಷೆ ವೀಕ್ಷಿಸಿ',
    hideClusterMap: 'ನಕ್ಷೆ ಮರೆಮಾಡಿ',
    clusterMapHeader: 'ವಲಯ ಕ್ಲಸ್ಟರ್ ನೋಡ್‌ಗಳು ({km} ಕಿ.ಮೀ ಇಂಧನ ಉಳಿತಾಯ)',
    stopsInSector: 'ಸೆಕ್ಟರ್‌ನಲ್ಲಿ {count} ನಿಲುಗಡೆಗಳು',
    yourDoorstep: 'ನಿಮ್ಮ ಮನೆಬಾಗಿಲು (+50 ಅಂಕ)',
    clusterProof: 'ಎಲ್ಲಾ {count} ನೆರೆಹೊರೆಯವರು ಒಂದೇ ಸಮಯದಲ್ಲಿದ್ದಾರೆ',
    zeroMileage: 'ಶೂನ್ಯ ವ್ಯರ್ಥ ಸಂಚಾರ',
    otherEcoWindows: 'ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಇತರ ಹೈ-ಡೆನ್ಸಿಟಿ ವಿಂಡೋಗಳು:',
    nearbyPickupsCount: '{count} ಹತ್ತಿರದ ಪಿಕಪ್‌ಗಳು',
    customScheduleHeading: 'ಕಸ್ಟಮ್ ವೇಳಾಪಟ್ಟಿ ಆಯ್ಕೆ',
    selectDateLabel: 'ಪಿಕಪ್ ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ',
    preferredSlotLabel: 'ಆದ್ಯತೆಯ ಸಮಯದ ಸ್ಲಾಟ್',
    morningSlot: 'ಬೆಳಗಿನ ಸ್ಲಾಟ್',
    afternoonSlot: 'ಮಧ್ಯಾಹ್ನದ ಸ್ಲಾಟ್',
    eveningSlot: 'ಸಂಜೆಯ ಸ್ಲಾಟ್',
    dispatchedPartnerLabel: 'ಅಧಿಕೃತ ಇ-ತ್ಯಾಜ್ಯ ಪಾಲುದಾರರಿಗೆ ಕಳುಹಿಸಲಾಗಿದೆ',
    recoveryRate: '{rate}% ವಸ್ತು ಮರುಪ್ರಾಪ್ತಿ ದರ',
    totalPtsCredited: 'ಒಟ್ಟು ಜಮೆಯಾಗುವ ಅಂಕಗಳು:',
    includesSmartBonus: '+{pts} ಗ್ರೀನ್ ರೂಟ್ ಬೋನಸ್ ಒಳಗೊಂಡಿದೆ',
    confirmBookingBtn: 'ಪಿಕಪ್ ದೃಢೀಕರಿಸಿ ಮತ್ತು ನಿಗದಿಪಡಿಸಿ',

    // Step 4 Confirmation
    bookingSuccessHeading: 'ಪಿಕಪ್ ಯಶಸ್ವಿಯಾಗಿ ಬುಕ್ ಆಗಿದೆ!',
    bookingSuccessDesc: 'ನಿಮ್ಮ ಮನೆಬಾಗಿಲ ಸಂಗ್ರಹ ವಿನಂತಿಯನ್ನು ನೋಂದಾಯಿಸಲಾಗಿದೆ ಮತ್ತು ನಮ್ಮ ಅತ್ಯುತ್ತಮ ಮಾರ್ಗದಲ್ಲಿ ಸೇರಿಸಲಾಗಿದೆ.',
    smartEcoActiveBadge: 'ಸ್ಮಾರ್ಟ್ ಇಕೋ-ಮಾರ್ಗ ಸಕ್ರಿಯ: +{pts} ಬೋನಸ್ ಅಂಕಗಳು · {co2} ಕೆ.ಜಿ ಇಂಧನ CO₂ ಉಳಿತಾಯ!',
    trackingCodeLabel: 'ಟ್ರ್ಯಾಕಿಂಗ್ ಕೋಡ್:',
    handoffPinLabel: 'ಹಸ್ತಾಂತರ ಪಿನ್:',
    pinInstruction: 'ಸುರಕ್ಷಿತ ಹಸ್ತಾಂತರ ಪೂರ್ಣಗೊಳಿಸಲು ಕ್ಯೂರಿಯರ್ ಬಂದಾಗ ಈ ಪಿನ್ ತೋರಿಸಿ.',
    scheduledForLabel: 'ನಿಗದಿತ ದಿನಾಂಕ:',
    partnerRecyclerLabel: 'ಪಾಲುದಾರ ರಿಸೈಕ್ಲರ್:',
    viewActiveTrackingBtn: 'ಲೈವ್ ಟ್ರ್ಯಾಕಿಂಗ್ ವೀಕ್ಷಿಸಿ',
  },

  ta: {
    // Header
    brandTitle: 'எகோரிடர்ன்',
    brandSubtitle: 'வட்ட மின்-கழிவு நெட்வொர்க்',
    navOverview: 'கண்ணோட்டம்',
    navCatalog: 'பொருட்கள் & விலைப்பட்டியல்',
    navTracking: 'பிக்கப் டிராக்கிங்',
    navImpact: 'தாக்க டாஷ்போர்டு',
    navRewards: 'வெகுமதிகள் & வாலட்',
    navRecyclers: 'அங்கீகரிக்கப்பட்ட மறுசுழற்சியாளர்கள்',
    navSafety: 'பேட்டரி பாதுகாப்பு',
    roleLabel: 'பங்கு',
    roleHousehold: 'வீட்டுப் பயனர்',
    roleCollector: 'வீட்டுவாசல் சேகரிப்பாளர்',
    roleAdmin: 'அங்கீகரிக்கப்பட்ட மறுசுழற்சியாளர்',
    bookPickupBtn: 'பிக்கப் பதிவு செய்',
    collectorDispatchBtn: 'சேகரிப்பாளர் டிஸ்பாட்ச்',
    recyclerConsoleBtn: 'மறுசுழற்சி கன்சோல்',
    ptsLabel: 'புள்ளிகள்',

    // Booking Modal
    modalTitle: 'வீட்டுவாசல் மின்-கழிவு பிக்கப் பதிவு',
    modalTitleSuccess: 'பிக்கப் உறுதி செய்யப்பட்டது!',
    stepSubtitle: 'படி {step} / 3 · இலவச சேவை',
    stepSuccessSubtitle: 'அங்கீகரிக்கப்பட்ட சேகரிப்பாளர் நியமிக்கப்பட்டார்',
    step1Title: 'உங்கள் பிக்கப் பெட்டியை சரிபார்க்கவும்',
    configuredItems: '{count} பொருட்கள் சேர்க்கப்பட்டுள்ளன',
    emptyBox: 'உங்கள் பிக்கப் பெட்டி காலியாக உள்ளது.',
    addSampleBtn: '+ மாதிரி ஸ்மார்ட்போனைச் சேர்க்கவும் (OnePlus 6T)',
    estimatedReturnVal: 'மதிப்பிடப்பட்ட ரிட்டர்ன் மதிப்பு:',
    valFormulaNote: 'உலோக மீட்பு மற்றும் நிலை அடிப்படையில் கணக்கிடப்பட்டது',
    batterySafetyNotice: 'பேட்டரி பாதுகாப்பு: லித்தியம்-அயன் பேட்டரிகளை அப்புறப்படுத்தினால், எங்கள் குழுவினர் வெப்ப-பாதுகாப்பு பைகளை கொண்டு வருவார்கள்.',
    continueToAddress: 'முகவரி மற்றும் தொடர்புக்கு தொடரவும்',

    // Step 2 Address
    step2Title: 'வீட்டு பிக்கப் முகவரி',
    useGpsBtn: 'என் ஜிபிஎஸ் இருப்பிடத்தைப் பயன்படுத்து',
    detectingGps: 'இருப்பிடம் கண்டறியப்படுகிறது...',
    streetLabel: 'வீடு / பிளாட் எண் & தெரு முகவரி',
    streetPlaceholder: 'எ.கா: பிளாட் 402, கிரீன் மெடோஸ், அவுட்டர் ரிங் ரோடு',
    cityLabel: 'நகரம்',
    pincodeLabel: 'பின்கோடு',
    nameLabel: 'குடியிருப்பாளர் பெயர்',
    phoneLabel: 'மொபைல் எண் (சரிபார்ப்புக்காக)',
    notesLabel: 'வீட்டுவாசல் குறிப்புகள் / வாயில் அணுகல் விவரம்',
    notesPlaceholder: 'எ.கா: செக்யூரிட்டி வாயிலில் அழைக்கவும்',
    backBtn: 'பின்செல்',
    continueToSchedule: 'ஸ்மார்ட் அட்டவணைக்கு தொடரவும்',

    // Step 3 Smart Schedule
    step3Title: 'பிக்கப் நேரம் மற்றும் அங்கீகரிக்கப்பட்ட பங்குதாரர்',
    smartScheduleBannerTitle: 'ஸ்மார்ட் சுற்றுச்சூழல் அட்டவணை பரிந்துரை',
    recommendedLabel: 'பரிந்துரைக்கப்படுகிறது:',
    smartRouteDesc: 'மின்சார வேன் #KA-01-EV ஏற்கனவே {zone} பகுதியில் {count} பிக்கப்களுக்காக திட்டமிடப்பட்டுள்ளது. இந்த நேரத்தைத் தேர்ந்தெடுப்பது {km} கி.மீ பயணத்தையும் {co2} கிலோ எரிபொருள் உமிழ்வையும் மிச்சப்படுத்துகிறது!',
    bonusEcoPtsBadge: '+{pts} போனஸ் சூழல் புள்ளிகள்',
    ecoSlotActive: 'சுற்றுச்சூழல் ஸ்லாட் செயலில் உள்ளது (+{pts} புள்ளிகள்)',
    selectEcoSlot: 'ஸ்மார்ட் சூழல் ஸ்லாட்டைத் தேர்ந்தெடு',
    chooseCustomSlot: 'தனிப்பயன் ஸ்லாட்டைத் தேர்ந்தெடு',
    viewClusterMap: 'பகுதி அடர்த்தி வரைபடத்தைப் பார்க்கவும்',
    hideClusterMap: 'வரைபடத்தை மறைக்கவும்',
    clusterMapHeader: 'மண்டல கிளஸ்டர் முனையங்கள் ({km} கி.மீ மிச்சம்)',
    stopsInSector: 'பகுதியில் {count} நிறுத்தங்கள்',
    yourDoorstep: 'உங்கள் வீட்டுவாசல் (+50 புள்ளிகள்)',
    clusterProof: 'அனைத்து {count} அண்டை வீடுகளும் ஒரே நேரத்தில் உள்ளன',
    zeroMileage: 'பூஜ்ஜிய வெற்று மைலேஜ்',
    otherEcoWindows: 'உங்கள் பகுதியில் உள்ள பிற நேரங்கள்:',
    nearbyPickupsCount: '{count} அருகிலுள்ள பிக்கப்கள்',
    customScheduleHeading: 'தனிப்பயன் அட்டவணை தேர்வு',
    selectDateLabel: 'பிக்கப் தேதியைத் தேர்ந்தெடுக்கவும்',
    preferredSlotLabel: 'விருப்பமான நேர இடைவெளி',
    morningSlot: 'காலை நேரம்',
    afternoonSlot: 'மதிய நேரம்',
    eveningSlot: 'மாலை நேரம்',
    dispatchedPartnerLabel: 'அங்கீகரிக்கப்பட்ட பங்குதாரருக்கு அனுப்பப்பட்டது',
    recoveryRate: '{rate}% மீட்பு விகிதம்',
    totalPtsCredited: 'மொத்த வரவு புள்ளிகள்:',
    includesSmartBonus: '+{pts} பசுமைப் பாதை போனஸ் அடங்கும்',
    confirmBookingBtn: 'பிக்கப்பை உறுதிசெய்து திட்டமிடுங்கள்',

    // Step 4 Confirmation
    bookingSuccessHeading: 'பிக்கப் வெற்றிகரமாக பதிவு செய்யப்பட்டது!',
    bookingSuccessDesc: 'உங்கள் வீட்டுவாசல் சேகரிப்பு கோரிக்கை பதிவு செய்யப்பட்டு உகந்த பாதையில் இணைக்கப்பட்டுள்ளது.',
    smartEcoActiveBadge: 'பசுமைப் பாதை செயலில் உள்ளது: +{pts} போனஸ் புள்ளிகள் · {co2} கிலோ எரிபொருள் CO₂ மிச்சம்!',
    trackingCodeLabel: 'டிராக்கிங் குறியீடு:',
    handoffPinLabel: 'கைமாற்றும் பின்:',
    pinInstruction: 'பாதுகாப்பான கைமாற்றலை முடிக்க தூதுவர் வரும்போது இந்த பின்னை காட்டவும்.',
    scheduledForLabel: 'திட்டமிடப்பட்ட நேரம்:',
    partnerRecyclerLabel: 'பங்குதாரர் மறுசுழற்சியாளர்:',
    viewActiveTrackingBtn: 'நேரலை கண்காணிப்பைக் காண்க',
  },

  te: {
    // Header
    brandTitle: 'ఎకోరిటర్న్',
    brandSubtitle: 'సర్క్యులర్ ఇ-వ్యర్థాల నెట్‌వర్క్',
    navOverview: 'అవలోకనం',
    navCatalog: 'వస్తువుల జాబితా & ధరలు',
    navTracking: 'పికప్ ట్రాకింగ్',
    navImpact: 'ప్రభావ డ్యాష్‌బోర్డ్',
    navRewards: 'రివార్డులు & వాలెట్',
    navRecyclers: 'అధీకృత రీసైక్లర్లు',
    navSafety: 'బ్యాటరీ భద్రత',
    roleLabel: 'పాత్ర',
    roleHousehold: 'గృహ వినియోగదారు',
    roleCollector: 'డోర్‌స్టెప్ కలెక్టర్',
    roleAdmin: 'అధీకృత రీసైక్లర్',
    bookPickupBtn: 'పికప్ బుక్ చేయండి',
    collectorDispatchBtn: 'కలెక్టర్ డిస్పాచ్',
    recyclerConsoleBtn: 'రీసైక్లర్ కన్సోల్',
    ptsLabel: 'పాయింట్లు',

    // Booking Modal
    modalTitle: 'డోర్‌స్టెప్ ఇ-వ్యర్థాల పికప్ బుకింగ్',
    modalTitleSuccess: 'పికప్ ధృవీకరించబడింది!',
    stepSubtitle: 'దశ {step} / 3 · ఎటువంటి ఛార్జీలు లేవు',
    stepSuccessSubtitle: 'అధీకృత కలెక్టర్ కేటాయించబడ్డారు',
    step1Title: 'మీ పికప్ బాక్స్ సమీక్షించండి',
    configuredItems: '{count} వస్తువులు జోడించబడ్డాయి',
    emptyBox: 'మీ పికప్ బాక్స్ ప్రస్తుతం ఖాళీగా ఉంది.',
    addSampleBtn: '+ నమూనా స్మార్ట్‌ఫోన్ జోడించండి (OnePlus 6T)',
    estimatedReturnVal: 'అంచనా వేసిన రిటర్న్ విలువ:',
    valFormulaNote: 'లోహాల రికవరీ మరియు స్థితి ఆధారంగా లెక్కించబడింది',
    batterySafetyNotice: 'బ్యాటరీ భద్రత: మీరు లిథియం బ్యాటరీలను పారవేస్తుంటే, మా కలెక్టర్లు ఉష్ణ నిరోధక బ్యాగులను తీసుకువస్తారు.',
    continueToAddress: 'చిరునామా మరియు సంప్రదింపు వివరాలకు కొనసాగండి',

    // Step 2 Address
    step2Title: 'ఇంటి పికప్ చిరునామా',
    useGpsBtn: 'నా జీపీఎస్ లొకేషన్ ఉపయోగించండి',
    detectingGps: 'స్థానం గుర్తించబడుతోంది...',
    streetLabel: 'ఇంటి / ఫ్లాట్ నంబర్ & వీధి చిరునామా',
    streetPlaceholder: 'ఉదా: ఫ్లాట్ 402, గ్రీన్ మెడోస్, ఔటర్ రింగ్ రోడ్',
    cityLabel: 'నగరం',
    pincodeLabel: 'పిన్‌కోడ్',
    nameLabel: 'నివాసి పేరు',
    phoneLabel: 'మొబైల్ నంబర్ (ధృవీకరణ కోసం)',
    notesLabel: 'డోర్‌స్టెప్ సూచనలు / గేట్ ప్రవేశ గమనికలు',
    notesPlaceholder: 'ఉదా: సెక్యూరిటీ గేట్ వద్ద కాల్ చేయండి',
    backBtn: 'వెనుకకు',
    continueToSchedule: 'స్మార్ట్ షెడ్యూల్‌కు కొనసాగండి',

    // Step 3 Smart Schedule
    step3Title: 'పికప్ సమయం మరియు అధీకృత భాగస్వామి',
    smartScheduleBannerTitle: 'స్మార్ట్ ఎకో-షెడ్యూల్ సూచన',
    recommendedLabel: 'సిఫార్సు చేయబడింది:',
    smartRouteDesc: 'ఎలక్ట్రిక్ వ్యాన్ #KA-01-EV ఇప్పటికే {zone} లో {count} పికప్‌ల కోసం షెడ్యూల్ చేయబడింది. ఈ సమయాన్ని ఎంచుకోవడం వలన {km} కి.మీ వృధా ప్రయాణం తప్పుతుంది మరియు {co2} కిలోల ఇంధన ఉద్గారాలు ఆదా అవుతాయి!',
    bonusEcoPtsBadge: '+{pts} బోనస్ ఎకో-పాయింట్లు',
    ecoSlotActive: 'ఎకో-స్లాట్ సక్రియంగా ఉంది (+{pts} పాయింట్లు)',
    selectEcoSlot: 'స్మార్ట్ ఎకో-స్లాట్‌ను ఎంచుకోండి',
    chooseCustomSlot: 'కస్టమ్ స్లాట్‌ను ఎంచుకోండి',
    viewClusterMap: 'పరిసరాల సాంద్రత మ్యాప్‌ను చూడండి',
    hideClusterMap: 'మ్యాప్‌ను దాచండి',
    clusterMapHeader: 'రూట్ క్లస్టర్ నోడ్స్ ({km} కి.మీ ఆదా)',
    stopsInSector: 'సెక్టార్‌లో {count} స్టాప్‌లు',
    yourDoorstep: 'మీ డోర్‌స్టెప్ (+50 పాయింట్లు)',
    clusterProof: 'మొత్తం {count} ఇళ్ళు ఒకే సమయంలో ఉన్నాయి',
    zeroMileage: 'శూన్య ఖాళీ ప్రయాణం',
    otherEcoWindows: 'మీ ప్రాంతంలో ఇతర సమయాలు:',
    nearbyPickupsCount: '{count} సమీప పికప్‌లు',
    customScheduleHeading: 'కస్టమ్ షెడ్యూల్ ఎంపిక',
    selectDateLabel: 'పికప్ తేదీని ఎంచుకోండి',
    preferredSlotLabel: 'ఇష్టపడే సమయ స్లాట్',
    morningSlot: 'ఉదయం స్లాట్',
    afternoonSlot: 'మధ్యాహ్నం స్లాట్',
    eveningSlot: 'సాయంత్రం స్లాట్',
    dispatchedPartnerLabel: 'అధీకృత ఇ-వ్యర్థాల భాగస్వామికి పంపబడింది',
    recoveryRate: '{rate}% మెటీరియల్ రికవరీ రేటు',
    totalPtsCredited: 'మొత్తం క్రెడిట్ అయ్యే పాయింట్లు:',
    includesSmartBonus: '+{pts} గ్రీన్ రూట్ బోనస్ చేర్చబడింది',
    confirmBookingBtn: 'పికప్‌ను నిర్ధారించండి & షెడ్యూల్ చేయండి',

    // Step 4 Confirmation
    bookingSuccessHeading: 'పికప్ విజయవంతంగా బుక్ చేయబడింది!',
    bookingSuccessDesc: 'మీ డోర్‌స్టెప్ సేకరణ అభ్యర్థన నమోదు చేయబడింది మరియు సరైన మార్గంలో చేర్చబడింది.',
    smartEcoActiveBadge: 'స్మార్ట్ ఎకో-రూట్ సక్రియంగా ఉంది: +{pts} బోనస్ పాయింట్లు · {co2} కిలోల ఇంధన CO₂ ఆదా!',
    trackingCodeLabel: 'ట్రాకింగ్ కోడ్:',
    handoffPinLabel: 'హ్యాండ్‌ఆఫ్ పిన్:',
    pinInstruction: 'సురక్షితమైన బదిలీని పూర్తి చేయడానికి కొరియర్ వచ్చినప్పుడు ఈ పిన్‌ను చూపించండి.',
    scheduledForLabel: 'నిర్ణయించబడిన సమయం:',
    partnerRecyclerLabel: 'భాగస్వామి రీసైక్లర్:',
    viewActiveTrackingBtn: 'లైవ్ ట్రాకింగ్ చూడండి',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ekoreturn_lang') as Language;
      if (saved && ['en', 'hi', 'kn', 'ta', 'te'].includes(saved)) {
        return saved;
      }
    } catch (e) {
      console.error(e);
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('ekoreturn_lang', lang);
    } catch (e) {
      console.error(e);
    }
  };

  const t = (key: keyof typeof translations.en, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations.en;
    let template: string = (langDict as any)[key] || (translations.en as any)[key] || key;

    if (params) {
      Object.keys(params).forEach((paramKey) => {
        template = template.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(params[paramKey]));
      });
    }

    return template;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
