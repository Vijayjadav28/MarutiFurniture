// Package options with rates per sqft (with material)
export const packageOptions = {
  essential: {
    label: "Essential setup",
    ratePerSqft: 950,
    baseWeeks: 6,
    note: "Best for practical homes, rentals, or a phased upgrade.",
  },
  comfort: {
    label: "Comfort plus",
    ratePerSqft: 1500,
    baseWeeks: 8,
    note: "Medium level finish - includes Veneer, MDF-Lacker, Glass Acrylic.",
  },
  luxury: {
    label: "Signature luxury",
    ratePerSqft: 2100,
    baseWeeks: 10,
    note: "Premium detailing for statement homes and designer finishes.",
  },
};

// Material options - Veneer (Veneer Polish), MDF (MDF-Lacker), Kitchen (Glass Acrylic)
export const materialOptions = {
  laminate: {
    label: "Laminate and ply",
    multiplier: 1,
    timelineWeeks: 0,
  },
  veneer: {
    label: "Veneer (Veneer Polish)",
    multiplier: 1.12,
    timelineWeeks: 1,
  },
  mdf_lacker: {
    label: "MDF (MDF-Lacker)",
    multiplier: 1.18,
    timelineWeeks: 1,
  },
  glass_acrylic: {
    label: "Glass Acrylic (Kitchen)",
    multiplier: 1.25,
    timelineWeeks: 2,
  },
  solidwood: {
    label: "Solid wood accents",
    multiplier: 1.35,
    timelineWeeks: 2,
  },
};

// Home options with specific furniture items
// 1BHK: 1 bed, 1 kabat (wardrobe), 1 dressing
// 2BHK: 2 bed, 2 kabat, 2 dressing  
// 3BHK: 3 bed, 3 kabat, 3 dressing + Living area (TV unit, sofa) + Kitchen (platform, storage, chimney box)
export const homeOptions = {
  compact: {
    label: "1 BHK",
    rooms: "1 BHK (1 Bedroom)",
    roomCount: 1,
    fixedCost: 85000,
    timelineWeeks: 4,
    furnitureItems: [
      "1 Bed",
      "1 Wardrobe (Kabat)",
      "1 Dressing Table",
    ],
  },
  family: {
    label: "2 BHK",
    rooms: "2 BHK (2 Bedrooms)",
    roomCount: 2,
    fixedCost: 165000,
    timelineWeeks: 6,
    furnitureItems: [
      "2 Beds",
      "2 Wardrobes (Kabat)",
      "2 Dressing Tables",
      "Living Area - TV Unit, Sofa",
    ],
  },
  premium: {
    label: "3 BHK",
    rooms: "3 BHK (3 Bedrooms)",
    roomCount: 3,
    fixedCost: 280000,
    timelineWeeks: 8,
    furnitureItems: [
      "3 Beds",
      "3 Wardrobes (Kabat)",
      "3 Dressing Tables",
      "Living Area - TV Unit, Sofa",
      "Kitchen - Platform, Storage, Chimney Box",
    ],
  },
  villa: {
    label: "4+ BHK / Villa",
    rooms: "4+ BHK / Villa / Duplex",
    roomCount: 4,
    fixedCost: 420000,
    timelineWeeks: 10,
    furnitureItems: [
      "4+ Beds",
      "4+ Wardrobes (Kabat)",
      "4+ Dressing Tables",
      "Living Area - TV Unit, Sofa",
      "Kitchen - Platform, Storage, Chimney Box",
      "Additional Rooms",
    ],
  },
};

export const urgencyOptions = {
  relaxed: {
    label: "Relaxed schedule",
    costMultiplier: 0.96,
    timelineMultiplier: 1.15,
    installationShift: 5,
  },
  standard: {
    label: "Standard (~70 days)",
    costMultiplier: 1,
    timelineMultiplier: 1,
    installationShift: 0,
  },
  fast: {
    label: "Fast-track execution",
    costMultiplier: 1.15,
    timelineMultiplier: 0.8,
    installationShift: -5,
  },
};

export const addonOptions = {
  kitchen: {
    label: "Modular kitchen (Platform, Storage, Chimney Box)",
    timelineWeeks: 2,
    getCost: (area, roomCount) => 180000 + roomCount * 20000 + area * 50,
  },
  wardrobes: {
    label: "Bedroom wardrobes (Kabat)",
    timelineWeeks: 2,
    getCost: (area, roomCount) => roomCount * 55000 + area * 35,
  },
  entertainment: {
    label: "TV Unit and Sofa area",
    timelineWeeks: 1,
    getCost: (area) => 65000 + area * 15,
  },
  study: {
    label: "Study or work nook",
    timelineWeeks: 1,
    getCost: (area) => 45000 + area * 18,
  },
  falseCeiling: {
    label: "False ceiling accents",
    timelineWeeks: 1,
    getCost: (area) => 70000 + area * 20,
  },
  dressing: {
    label: "Dressing Tables",
    timelineWeeks: 1,
    getCost: (area, roomCount) => roomCount * 25000,
  },
};

// Labor only charge option - ₹350 per sqft
export const LABOR_ONLY_RATE = 350;

export const defaultEstimateForm = {
  length: "40",
  width: "38",
  homeType: "premium",
  packageType: "comfort",
  material: "veneer",
  urgency: "standard",
  kitchen: true,
  wardrobes: true,
  entertainment: true,
  study: false,
  falseCeiling: true,
  dressing: true,
  laborOnly: false,
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export const formatCurrency = (value) =>
  currencyFormatter.format(Math.round(value || 0));

const toNumber = (value) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

export const calculateEstimate = (formValues = defaultEstimateForm) => {
  const values = { ...defaultEstimateForm, ...formValues };
  const length = Math.max(0, toNumber(values.length));
  const width = Math.max(0, toNumber(values.width));
  const area = length * width;
  const hasValidArea = area > 0;
  const planningArea = hasValidArea ? Math.max(area, 450) : 0;
  const areaSquareMeters = area * 0.092903;

  const selectedHome = homeOptions[values.homeType] ?? homeOptions.premium;
  const selectedPackage =
    packageOptions[values.packageType] ?? packageOptions.comfort;
  const selectedMaterial =
    materialOptions[values.material] ?? materialOptions.veneer;
  const selectedUrgency =
    urgencyOptions[values.urgency] ?? urgencyOptions.standard;

  const selectedAddons = Object.entries(addonOptions)
    .filter(([key]) => Boolean(values[key]))
    .map(([key, addon]) => ({
      key,
      label: addon.label,
      timelineWeeks: addon.timelineWeeks,
      cost: addon.getCost(planningArea, selectedHome.roomCount),
    }));

  // Labor only calculation (₹350/sqft)
  const isLaborOnly = Boolean(values.laborOnly);
  const laborOnlyCost = hasValidArea ? planningArea * LABOR_ONLY_RATE : 0;

  // Full package calculation (₹1500/sqft with material for medium level)
  const packageBudget = hasValidArea
    ? planningArea * selectedPackage.ratePerSqft
    : 0;
  const materialBudget = hasValidArea
    ? packageBudget * (selectedMaterial.multiplier - 1)
    : 0;
  const urgencyBudget = hasValidArea
    ? (packageBudget + selectedHome.fixedCost) *
      (selectedUrgency.costMultiplier - 1)
    : 0;
  const addonBudget = isLaborOnly 
    ? 0 
    : selectedAddons.reduce((total, addon) => total + addon.cost, 0);
  const designAndInstall = hasValidArea
    ? Math.max(planningArea * 120, 40000)
    : 0;

  const totalEstimate = isLaborOnly
    ? laborOnlyCost
    : packageBudget +
      materialBudget +
      urgencyBudget +
      addonBudget +
      (hasValidArea ? selectedHome.fixedCost : 0) +
      designAndInstall;

  const estimatedLow = totalEstimate * 0.92;
  const estimatedHigh = totalEstimate * 1.11;

  const addOnWeeks = selectedAddons.reduce(
    (total, addon) => total + addon.timelineWeeks,
    0
  );

  // Timeline calculation - approximately 70 days (10 weeks) for standard
  const rawWeeks = hasValidArea
    ? (selectedPackage.baseWeeks +
        selectedHome.timelineWeeks +
        selectedMaterial.timelineWeeks +
        (isLaborOnly ? 0 : addOnWeeks) +
        planningArea / 300) *
      selectedUrgency.timelineMultiplier
    : 0;

  const estimatedWeeks = hasValidArea ? Math.max(6, Math.round(rawWeeks)) : 0;
  const estimatedDays = hasValidArea ? Math.round(estimatedWeeks * 7) : 0;
  const carpentryDays = hasValidArea
    ? Math.max(
        15,
        Math.round(estimatedWeeks * 6 + selectedUrgency.installationShift)
      )
    : 0;

  const rawBreakdown = [
    {
      label: "Bedrooms (Beds, Wardrobes, Dressing)",
      weight: values.wardrobes && values.dressing ? 0.35 : 0.20,
    },
    {
      label: "Living room (TV Unit, Sofa)",
      weight: values.entertainment ? 0.18 : 0.10,
    },
    {
      label: "Kitchen (Platform, Storage, Chimney)",
      weight: values.kitchen ? 0.25 : 0.08,
    },
    {
      label: "Work corners and utility",
      weight: values.study ? 0.10 : 0.05,
    },
    {
      label: "Finishing, transport and install",
      weight: 0.12 + (values.falseCeiling ? 0.05 : 0),
    },
  ];

  const totalWeight = rawBreakdown.reduce(
    (total, item) => total + item.weight,
    0
  );

  const budgetBreakdown = rawBreakdown.map((item) => ({
    label: item.label,
    share: totalWeight ? (item.weight / totalWeight) * 100 : 0,
    amount: totalWeight ? (totalEstimate * item.weight) / totalWeight : 0,
  }));

  const milestonePlan = [
    {
      label: "Design sign-off",
      share: "40%",
      amount: totalEstimate * 0.4,
      detail: "layout planning, site measurements, and material approvals",
    },
    {
      label: "Workshop production",
      share: "40%",
      amount: totalEstimate * 0.4,
      detail: "carpentry, polishing, fabrication, and hardware prep",
    },
    {
      label: "Installation handover",
      share: "20%",
      amount: totalEstimate * 0.2,
      detail: "final fitting, alignment, finishing touches, and clean-up",
    },
  ];

  const weekRange = estimatedWeeks
    ? `${Math.max(6, estimatedWeeks - 1)}-${estimatedWeeks + 2} weeks (~${estimatedDays} days)`
    : "Add valid dimensions";
  const installRange = carpentryDays
    ? `${Math.max(12, carpentryDays - 5)}-${carpentryDays} working days`
    : "Waiting for dimensions";
  const startWindow =
    values.urgency === "fast"
      ? "within 7 days"
      : values.urgency === "relaxed"
      ? "in 2-3 weeks"
      : "in 10-14 days";

  const teamSize = hasValidArea
    ? Math.min(14, Math.max(4, Math.ceil(planningArea / 180)))
    : 0;

  return {
    values,
    hasValidArea,
    length,
    width,
    area,
    planningArea,
    areaSquareMeters,
    selectedHome,
    selectedPackage,
    selectedMaterial,
    selectedUrgency,
    selectedAddons,
    packageBudget,
    materialBudget,
    urgencyBudget,
    addonBudget,
    designAndInstall,
    laborOnlyCost,
    isLaborOnly,
    totalEstimate,
    estimatedLow,
    estimatedHigh,
    estimatedWeeks,
    estimatedDays,
    weekRange,
    carpentryDays,
    installRange,
    startWindow,
    teamSize,
    budgetBreakdown,
    milestonePlan,
  };
};
