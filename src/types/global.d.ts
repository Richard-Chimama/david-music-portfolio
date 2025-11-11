// Global type declarations
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export {};