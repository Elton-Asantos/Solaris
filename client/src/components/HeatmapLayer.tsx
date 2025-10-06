/**
 * SOLARIS - Heatmap Layer Component
 * Renderiza dados de clima como heatmap no Google Maps
 */
import { useEffect, useRef } from 'react';
import { ClimateData } from '../context/ClimateDataContext';
import { getColorForValue, generateHeatmapGradient } from '../utils/colorUtils';

interface HeatmapLayerProps {
  map: google.maps.Map | null;
  data: ClimateData | null;
  activeVariable: string;
  filters?: {
    [variable: string]: {
      min?: number;
      max?: number;
    };
  };
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ 
  map, 
  data, 
  activeVariable,
  filters 
}) => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const heatmapRef = useRef<google.maps.visualization.HeatmapLayer | null>(null);
  
  useEffect(() => {
    if (!map || !data || !activeVariable) {
      return;
    }
    
    // Limpar markers anteriores
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Limpar heatmap anterior
    if (heatmapRef.current) {
      heatmapRef.current.setMap(null);
      heatmapRef.current = null;
    }
    
    const variableData = data[activeVariable];
    
    if (!variableData || variableData.length === 0) {
      console.log(`Nenhum dado para ${activeVariable}`);
      return;
    }
    
    console.log(`🎨 Renderizando ${variableData.length} pontos de ${activeVariable}`);
    
    // Aplicar filtros se existirem
    const filter = filters?.[activeVariable];
    const filteredData = variableData.filter(point => {
      if (filter) {
        if (filter.min !== undefined && point.value < filter.min) return false;
        if (filter.max !== undefined && point.value > filter.max) return false;
      }
      return true;
    });
    
    console.log(`📊 ${filteredData.length} pontos após filtros`);
    
    // OPÇÃO 1: Markers coloridos (melhor para poucos pontos)
    if (filteredData.length < 200) {
      filteredData.forEach((point, index) => {
        const color = getColorForValue(activeVariable, point.value);
        
        const marker = new google.maps.Marker({
          position: { lat: point.lat, lng: point.lon },
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: color,
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 1,
          },
          title: `${activeVariable}: ${point.value.toFixed(2)}`,
          optimized: true,
        });
        
        // InfoWindow ao clicar
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; font-family: Arial, sans-serif;">
              <h4 style="margin: 0 0 8px 0; color: #333; font-size: 14px;">
                ${activeVariable}
              </h4>
              <p style="margin: 4px 0; color: #666; font-size: 12px;">
                <strong>Valor:</strong> ${point.value.toFixed(2)}
              </p>
              <p style="margin: 4px 0; color: #666; font-size: 12px;">
                <strong>Lat:</strong> ${point.lat.toFixed(4)}
              </p>
              <p style="margin: 4px 0; color: #666; font-size: 12px;">
                <strong>Lon:</strong> ${point.lon.toFixed(4)}
              </p>
            </div>
          `,
        });
        
        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
        
        markersRef.current.push(marker);
      });
      
      console.log(`✅ ${markersRef.current.length} markers renderizados`);
    }
    // OPÇÃO 2: Heatmap Layer (melhor para muitos pontos)
    else {
      const heatmapData = filteredData.map(point => ({
        location: new google.maps.LatLng(point.lat, point.lon),
        weight: point.value,
      }));
      
      const gradient = generateHeatmapGradient(activeVariable);
      
      const heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map,
        radius: 20,
        opacity: 0.7,
        gradient: gradient,
      });
      
      heatmapRef.current = heatmap;
      
      console.log(`✅ Heatmap layer renderizado com ${heatmapData.length} pontos`);
    }
    
    // Ajustar zoom/centro para mostrar todos os pontos
    if (filteredData.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      filteredData.forEach(point => {
        bounds.extend(new google.maps.LatLng(point.lat, point.lon));
      });
      
      // Só ajustar se o bounds for válido
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
        
        // Limitar zoom máximo
        const listener = google.maps.event.addListenerOnce(map, 'idle', () => {
          const currentZoom = map.getZoom();
          if (currentZoom && currentZoom > 15) {
            map.setZoom(15);
          }
        });
      }
    }
    
    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      
      if (heatmapRef.current) {
        heatmapRef.current.setMap(null);
        heatmapRef.current = null;
      }
    };
  }, [map, data, activeVariable, filters]);
  
  return null; // Este é um componente lógico, não renderiza UI
};

export default HeatmapLayer;

