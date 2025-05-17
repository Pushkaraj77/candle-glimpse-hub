
/// <reference types="vite/client" />

// Augment the Window interface to include ApexCharts
declare global {
  interface Window {
    ApexCharts: any; // This tells TypeScript that window.ApexCharts can exist and be of any type.
                     // A more specific type could be used, but 'any' will resolve the error.
  }
}

