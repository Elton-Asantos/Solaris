// Configuração dos ícones padrão do Leaflet
// Este código resolve o problema dos ícones não aparecerem
export const configureLeafletIcons = () => {
  // Importação dinâmica do Leaflet para evitar problemas de TypeScript
  const L = require('leaflet');
  
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  });
};

