// Z-index layer management
export const zIndex = {
  // Base layers
  base: 0,

  // UI Components
  dropdown: 100,
  sticky: 200,
  tooltip: 300,

  // Navigation
  navigation: 400,
  drawer: 500,

  // Overlays
  modal: 600,
  toast: 700,

  // Critical overlays
  loading: 800,
  alert: 900,

  // Maximum priority
  maximum: 999
} as const;

export type ZIndexLayer = keyof typeof zIndex;