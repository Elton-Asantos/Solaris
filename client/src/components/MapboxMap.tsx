import React, { useRef, useState, useEffect } from 'react';
// TEMPORARIAMENTE DESABILITADO - Problema de compatibilidade de versão
// import Map, { NavigationControl, GeolocateControl, ScaleControl, FullscreenControl, Marker, Source, Layer } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
import styled from 'styled-components';
import { MapPin } from 'lucide-react';

const MapWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  min-height: 500px;
`;

const InfoPanel = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 10;
  max-width: 250px;
`;

interface MapboxMapProps {
  onAreaSelect?: (area: any) => void;
  selectedArea?: any;
}

// Token público do Mapbox (você pode criar o seu em https://mapbox.com)
// Este é um token de exemplo - CRIE O SEU para produção
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.example';

const MapboxMap: React.FC<MapboxMapProps> = ({ onAreaSelect, selectedArea }) => {
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState({
    longitude: -47.9292,
    latitude: -15.7801,
    zoom: 4,
    pitch: 0,
    bearing: 0
  });
  const [mapStyle, setMapStyle] = useState<'satellite' | 'streets' | 'dark'>('satellite');

  const mapStyles = {
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
    streets: 'mapbox://styles/mapbox/streets-v12',
    dark: 'mapbox://styles/mapbox/dark-v11'
  };

  useEffect(() => {
    console.log('[MAPBOX] Componente montado');
    console.log('[MAPBOX] Token configurado:', MAPBOX_TOKEN ? '✅ Sim' : '❌ Não');
  }, []);

  return (
    <MapWrapper>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(255, 152, 0, 0.95)',
        color: 'white',
        padding: '30px',
        borderRadius: '12px',
        maxWidth: '500px',
        textAlign: 'center',
        zIndex: 1000,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '20px' }}>
          🗺️ Mapbox Temporariamente Indisponível
        </h3>
        <p style={{ margin: '10px 0', lineHeight: 1.6 }}>
          O Mapbox está desabilitado temporariamente devido a um problema de compatibilidade de versão.
        </p>
        <p style={{ margin: '10px 0', lineHeight: 1.6 }}>
          <strong>Use o Google Maps ou Leaflet:</strong>
        </p>
        <div style={{ textAlign: 'left', paddingLeft: '20px', fontSize: '14px' }}>
          • Google Maps → Melhor integração com GEE ✅<br />
          • Leaflet Debug → Funciona perfeitamente ✅
        </div>
        <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '15px' }}>
          Mude <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>MAP_LIBRARY</code> em <code style={{ background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>App.tsx</code>
        </p>
      </div>
    </MapWrapper>
  );
};

export default MapboxMap;

