import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const DebugWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  background: #1a1a2e;
  border-radius: 8px;
  overflow: hidden;
  min-height: 500px;
  display: flex;
  flex-direction: column;
`;

const DebugInfo = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
  max-width: 300px;
`;

const MapContainer = styled.div`
  flex: 1;
  width: 100%;
  min-height: 500px;
  background: #1a1a2e;
`;

const MapDebug: React.FC = () => {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebug = (msg: string) => {
    console.log(`[MAP DEBUG] ${msg}`);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    addDebug('Componente montado');

    if (!containerRef.current) {
      addDebug('❌ Container ref não encontrado');
      return;
    }
    addDebug('✅ Container ref encontrado');

    // Verificar se Leaflet está disponível
    const L = (window as any).L;
    if (!L) {
      addDebug('❌ Leaflet (window.L) não está disponível!');
      addDebug('Verifique se o script está carregado no HTML');
      return;
    }
    addDebug('✅ Leaflet disponível globalmente');
    addDebug(`Versão do Leaflet: ${L.version || 'desconhecida'}`);

    try {
      // Criar mapa
      addDebug('Criando instância do mapa...');
      const map = L.map(containerRef.current, {
        center: [-15.7801, -47.9292],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
      });
      addDebug('✅ Mapa criado');

      // Adicionar tile layer
      addDebug('Adicionando tile layer...');
      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      });
      tileLayer.addTo(map);
      addDebug('✅ Tile layer adicionado');

      // Adicionar marcador de teste
      addDebug('Adicionando marcador de teste...');
      const marker = L.marker([-15.7801, -47.9292]).addTo(map);
      marker.bindPopup('<b>Centro do Brasil</b><br>Mapa SOLARIS funcionando!').openPopup();
      addDebug('✅ Marcador adicionado');

      mapRef.current = map;
      addDebug('🎉 Mapa totalmente inicializado!');

      // Forçar invalidação do tamanho do mapa após 100ms
      setTimeout(() => {
        map.invalidateSize();
        addDebug('Tamanho do mapa invalidado (forçar redraw)');
      }, 100);

    } catch (error: any) {
      addDebug(`❌ ERRO: ${error.message}`);
      console.error('Erro ao criar mapa:', error);
    }

    return () => {
      if (mapRef.current) {
        addDebug('Limpando mapa...');
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <DebugWrapper>
      <DebugInfo>
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>🔍 Debug do Mapa</div>
        {debugInfo.slice(-10).map((info, i) => (
          <div key={i} style={{ fontSize: '10px', marginBottom: '2px' }}>
            {info}
          </div>
        ))}
      </DebugInfo>
      <MapContainer ref={containerRef} />
    </DebugWrapper>
  );
};

export default MapDebug;

