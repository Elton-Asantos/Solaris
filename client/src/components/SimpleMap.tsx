import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const MapWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  background: #1a1a2e;
  border-radius: 8px;
  overflow: hidden;
  min-height: 500px;
`;

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  min-height: 500px;
  background: #1a1a2e;
`;

interface SimpleMapProps {
  onAreaSelect?: (area: any) => void;
  selectedArea?: any;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ onAreaSelect, selectedArea }) => {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Verificar se Leaflet está disponível globalmente
    const L = (window as any).L;
    if (!L) {
      console.error('Leaflet não carregado! Verifique o script no HTML.');
      return;
    }

    console.log('Inicializando mapa Leaflet...');

    // Criar mapa
    const map = L.map(containerRef.current, {
      center: [-15.7801, -47.9292], // Centro do Brasil
      zoom: 5,
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
    });

    // Adicionar tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      minZoom: 3,
    }).addTo(map);

    // Adicionar controle de zoom personalizado
    L.control.zoom({
      position: 'topright'
    }).addTo(map);

    mapRef.current = map;

    console.log('Mapa Leaflet inicializado com sucesso!');

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Atualizar quando selectedArea mudar
  useEffect(() => {
    if (!mapRef.current || !selectedArea) return;

    const L = (window as any).L;
    const { north, south, east, west } = selectedArea.bounds;

    // Criar retângulo para área selecionada
    const bounds = [[south, west], [north, east]];
    const rectangle = L.rectangle(bounds, {
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.2,
      weight: 2
    }).addTo(mapRef.current);

    // Ajustar zoom para mostrar a área
    mapRef.current.fitBounds(bounds);

    return () => {
      rectangle.remove();
    };
  }, [selectedArea]);

  return (
    <MapWrapper>
      <MapContainer ref={containerRef} />
    </MapWrapper>
  );
};

export default SimpleMap;

