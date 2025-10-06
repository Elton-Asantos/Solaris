/**
 * SOLARIS - Google Maps TypeScript Definitions
 * Garante que os tipos do Google Maps estão disponíveis globalmente
 */

/// <reference types="google.maps" />

declare global {
  interface Window {
    google: typeof google;
  }
}

export {};

