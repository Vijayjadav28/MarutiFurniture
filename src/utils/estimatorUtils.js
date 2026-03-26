export const packageOptions = {
  essential: {
    label: "Essential setup",
    ratePerSqft: 950,
    baseWeeks: 2,
    note: "Best for practical homes, rentals, or a phased upgrade.",
  },
  comfort: {
    label: "Comfort plus",
    ratePerSqft: 1450,
    baseWeeks: 4,
    note: "Balanced finish, better hardware, and the most popular choice.",
  },
  luxury: {
    label: "Signature luxury",
    ratePerSqft: 2100,
    baseWeeks: 6,
    note: "Premium detailing for statement homes and designer finishes.",
  },
};

export const materialOptions = {
  laminate: {
    label: "Laminate and ply",
    multiplier: 1,
    timelineWeeks: 0,
  },
  veneer: {
    label: "Veneer finish",
    multiplier: 1.12,
    timelineWeeks: 1,
  },
  solidwood: {
    label: "Solid wood accents",
    multiplier: 1.28,
    timelineWeeks: 2,
  },
};

export const homeOptions = {
  compact: {
    label: "Compact home",
    rooms: "1 BHK / studio",
    roomCount: 1,
    fixedCost: 35000,
    timelineWeeks: 0,
  },
  family: {
    label: "Family home",
    rooms: "2 BHK",
    roomCount: 2,
    fixedCost: 85000,
    timelineWeeks: 1,
  },
  premium: {
    label: "Large family home",
    rooms: "3 BHK",
    roomCount: 3,
    fixedCost: 140000,
    timelineWeeks: 2,
  },
  villa: {
    label: "Villa or duplex",
    rooms: "4+ BHK",
    roomCount: 4,
    fixedCost: 220000,
    timelineWeeks: 3,
  },
};

export const urgencyOptions = {
  relaxed: {
    label: "Relaxed schedule",
    costMultiplier: 0.96,
    timelineMultiplier: 1.12,
    installationShift: 2,
  },
  standard: {
    label: "Standard delivery",
    costMultiplier: 1,
    timelineMultiplier: 1,
    installationShift: 0,
  },
  fast: {
    label: "Fast-track execution",
    costMultiplier: 1.1,
    timelineMultiplier: 0.82,
    installationShift: -3,
  },
};

export const addonOptions = {
  kitchen: {
    label: "Modular kitchen",
    timelineWeeks: 2,
    getCost: (area, roomCount) => 140000 + roomCount * 18000 + area * 45,
  },
  wardrobes: {
    label: "Bedroom wardrobes",
    timelineWeeks: 2,
    getCost: (area, roomCount) => roomCount * 52000 + area * 30,
  },
  entertainment: {
    label: "TV and display wall",
    timelineWeeks: 1,
    getCost: (area) => 48000 + area * 12,
  },
  study: {
    label: "Study or work nook",
    timelineWeeks: 1,
    getCost: (area) => 42000 + area * 15,
  },
  falseCeiling: {
    label: "False ceiling accents",
    timelineWeeks: 1,
    getCost: (area) => 65000 + area * 18,
  },
};

export const defaultEstimateForm = {
  length: "40",
  width: "30",
  homeType: "family",
  packageType: "comfort",
  material: "veneer",
  urgency: "standard",
  kitchen: true,
  wardrobes: true,
  entertainment: true,
  study: false,
  falseCeiling: true,
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

  const selectedHome = homeOptions[values.homeType] ?? homeOptions.family;
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
  const addonBudget = selectedAddons.reduce(
    (total, addon) => total + addon.cost,
    0
  );
  const designAndInstall = hasValidArea
    ? Math.max(planningArea * 110, 35000)
    : 0;

  const totalEstimate =
    packageBudget +
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

  const rawWeeks = hasValidArea
    ? (selectedPackage.baseWeeks +
        selectedHome.timelineWeeks +
        selectedMaterial.timelineWeeks +
        addOnWeeks +
        planningArea / 220) *
      selectedUrgency.timelineMultiplier
    : 0;

  const estimatedWeeks = hasValidArea ? Math.max(4, Math.round(rawWeeks)) : 0;
  const carpentryDays = hasValidArea
    ? Math.max(
        12,
        Math.round(estimatedWeeks * 5.5 + selectedUrgency.installationShift)
      )
    : 0;

  const rawBreakdown = [
    {
      label: "Living room and lounge",
      weight: 0.22,
    },
    {
      label: "Bedrooms and wardrobes",
      weight: values.wardrobes ? 0.31 : 0.18,
    },
    {
      label: "Kitchen and dining",
      weight: values.kitchen ? 0.24 : 0.1,
    },
    {
      label: "Work corners and utility",
      weight: values.study ? 0.11 : 0.07,
    },
    {
      label: "Finishing, transport and install",
      weight: 0.12 + (values.falseCeiling ? 0.04 : 0) + (values.entertainment ? 0.03 : 0),
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
    ? `${Math.max(4, estimatedWeeks - 1)}-${estimatedWeeks + 2} weeks`
    : "Add valid dimensions";
  const installRange = carpentryDays
    ? `${Math.max(8, carpentryDays - 4)}-${carpentryDays} working days`
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
    totalEstimate,
    estimatedLow,
    estimatedHigh,
    estimatedWeeks,
    weekRange,
    carpentryDays,
    installRange,
    startWindow,
    teamSize,
    budgetBreakdown,
    milestonePlan,
  };
};
