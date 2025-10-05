// Configuração das APIs de Mapas - SOLARIS

// ============================================
// GOOGLE MAPS API KEY
// ============================================
// ✅ API Key configurada!
// Data: 05/10/2025
// ============================================

export const GOOGLE_MAPS_API_KEY = 'AIzaSyB_pvDeDjx-zx9agq7BtgeNAmjGv8e33oQ';

// ============================================
// MAPBOX TOKEN (Opcional)
// ============================================
// 1. Acesse: https://account.mapbox.com/auth/signup/
// 2. Copie seu token padrão
// 3. Cole abaixo substituindo 'YOUR_MAPBOX_TOKEN'
// ============================================

export const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN';

// ============================================
// CONFIGURAÇÕES DO MAPA
// ============================================

export const MAP_CONFIG = {
  // Centro padrão (Brasil)
  defaultCenter: {
    lat: -15.7801,
    lng: -47.9292
  },
  
  // Zoom padrão
  defaultZoom: 5,
  
  // Tipo de mapa padrão para Google Maps
  // 'roadmap' | 'satellite' | 'hybrid' | 'terrain'
  googleMapType: 'hybrid',
  
  // Estilo de mapa padrão para Mapbox
  // 'satellite' | 'streets' | 'dark'
  mapboxStyle: 'satellite',
};

