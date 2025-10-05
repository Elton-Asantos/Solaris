import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { GOOGLE_MAPS_API_KEY, MAP_CONFIG } from '../config/maps.config';

const MapWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  min-height: 500px;
`;

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
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
  max-width: 300px;
`;

const ApiKeyWarning = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 59, 48, 0.95);
  color: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  text-align: center;
  z-index: 1000;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);

  h3 {
    margin: 0 0 15px 0;
    font-size: 20px;
  }

  p {
    margin: 10px 0;
    line-height: 1.6;
  }

  code {
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
  }

  a {
    color: #fff;
    text-decoration: underline;
    font-weight: bold;
  }
`;

interface GoogleMapComponentProps {
  onAreaSelect?: (area: any) => void;
  selectedArea?: any;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ onAreaSelect, selectedArea }) => {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const addDebug = (msg: string) => {
    console.log(`[GOOGLE MAPS] ${msg}`);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    addDebug('Componente montado');

    // Verificar se a API Key está configurada
    const isKeyMissing = !GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY.includes('YOUR_GOOGLE_MAPS_API_KEY');
    if (isKeyMissing) {
      addDebug('❌ API Key não configurada!');
      setApiKeyMissing(true);
      return;
    }
    addDebug('✅ API Key configurada');

    if (!containerRef.current) {
      addDebug('❌ Container ref não encontrado');
      return;
    }

    // Verificar se Google Maps está disponível
    if (!(window as any).google) {
      addDebug('❌ Google Maps não carregado!');
      addDebug('Carregando script do Google Maps...');
      
      // Carregar script do Google Maps (com loading=async para melhor performance)
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=drawing,geometry&loading=async`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        addDebug('✅ Google Maps carregado!');
        initMap();
      };
      script.onerror = () => {
        addDebug('❌ Erro ao carregar Google Maps');
        addDebug('Verifique sua API Key');
      };
      document.head.appendChild(script);
      
      return;
    }

    initMap();

    function initMap() {
      const google = (window as any).google;
      
      addDebug('Criando mapa Google Maps...');
      
      const map = new google.maps.Map(containerRef.current, {
        center: { lat: MAP_CONFIG.defaultCenter.lat, lng: MAP_CONFIG.defaultCenter.lng },
        zoom: MAP_CONFIG.defaultZoom,
        mapTypeId: MAP_CONFIG.googleMapType as any,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
          position: google.maps.ControlPosition.TOP_RIGHT,
        },
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
      });

      addDebug('✅ Mapa criado!');

      // Adicionar marcador (usar AdvancedMarkerElement se disponível)
      if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: MAP_CONFIG.defaultCenter.lat, lng: MAP_CONFIG.defaultCenter.lng },
          map: map,
          title: 'SOLARIS - Centro do Brasil',
        });
        addDebug('✅ Marcador moderno adicionado');
      } else {
        // Fallback para Marker antigo
        const marker = new google.maps.Marker({
          position: { lat: MAP_CONFIG.defaultCenter.lat, lng: MAP_CONFIG.defaultCenter.lng },
          map: map,
          title: 'SOLARIS - Centro do Brasil',
          animation: google.maps.Animation.DROP,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: '<h3 style="color: #333; margin: 0;">SOLARIS</h3><p style="color: #666; margin: 5px 0 0 0;">Centro do Brasil<br>Google Maps + Google Earth Engine</p>',
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        addDebug('✅ Marcador adicionado');
      }

      // Adicionar ferramentas de desenho
      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.RECTANGLE,
            google.maps.drawing.OverlayType.CIRCLE,
            google.maps.drawing.OverlayType.POLYGON,
          ],
        },
        rectangleOptions: {
          fillColor: '#3b82f6',
          fillOpacity: 0.2,
          strokeColor: '#3b82f6',
          strokeWeight: 2,
          clickable: false,
          editable: true,
          zIndex: 1,
        },
      });

      drawingManager.setMap(map);
      addDebug('✅ Ferramentas de desenho adicionadas');

      mapRef.current = map;
      addDebug('🎉 Google Maps totalmente inicializado!');
    }

    return () => {
      if (mapRef.current) {
        addDebug('Limpando mapa...');
      }
    };
  }, []);

  return (
    <MapWrapper>
      {apiKeyMissing ? (
        <ApiKeyWarning>
          <h3>🔑 API Key do Google Maps não configurada</h3>
          <p>
            Para usar o Google Maps, você precisa configurar uma API Key.
          </p>
          <p>
            <strong>Passo a passo:</strong>
          </p>
          <ol style={{ textAlign: 'left', paddingLeft: '20px' }}>
            <li>Acesse: <a href="https://console.cloud.google.com/google/maps-apis/start" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
            <li>Ative a <strong>Maps JavaScript API</strong></li>
            <li>Crie uma <strong>Chave de API</strong></li>
            <li>Cole a chave em: <code>client/src/config/maps.config.ts</code></li>
          </ol>
          <p style={{ marginTop: '20px', fontSize: '12px' }}>
            💡 <strong>Plano gratuito:</strong> $200 créditos/mês (~28k carregamentos)
          </p>
          <p style={{ fontSize: '10px', opacity: 0.8, marginTop: '10px' }}>
            Ou volte para Leaflet Debug mudando <code>MAP_LIBRARY</code> em <code>App.tsx</code>
          </p>
        </ApiKeyWarning>
      ) : (
        <>
          <InfoPanel>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              🗺️ Google Maps - SOLARIS
            </div>
            {debugInfo.slice(-8).map((info, i) => (
              <div key={i} style={{ fontSize: '10px', marginBottom: '2px' }}>
                {info}
              </div>
            ))}
          </InfoPanel>
          <MapContainer ref={containerRef} />
        </>
      )}
    </MapWrapper>
  );
};

export default GoogleMapComponent;

