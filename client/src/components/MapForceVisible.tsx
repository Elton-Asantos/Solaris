import React, { useEffect, useRef, useState } from 'react';

const MapForceVisible: React.FC = () => {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const [status, setStatus] = useState<string[]>([]);

  const addStatus = (msg: string) => {
    console.log(`[MAP FORCE] ${msg}`);
    setStatus(prev => {
      // Limitar a 10 mensagens mais recentes
      const newStatus = [...prev, msg];
      return newStatus.slice(-10);
    });
  };

  useEffect(() => {
    // Evitar inicialização dupla (React StrictMode)
    if (initializedRef.current) {
      addStatus('⚠️ Componente já inicializado, ignorando');
      return;
    }
    initializedRef.current = true;

    addStatus('1. Componente montado');
    addStatus(`   Viewport: ${window.innerWidth}x${window.innerHeight}px`);
    
    if (!containerRef.current) {
      addStatus('❌ Container não encontrado');
      return;
    }
    
    const rect = containerRef.current.getBoundingClientRect();
    addStatus('2. ✅ Container encontrado');
    addStatus(`   Container: ${Math.round(rect.width)}x${Math.round(rect.height)}px`);

    const google = (window as any).google;
    if (!google?.maps) {
      // Verificar se o script já está sendo carregado
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      
      if (!existingScript) {
        addStatus('3. Carregando Google Maps...');
        
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB_pvDeDjx-zx9agq7BtgeNAmjGv8e33oQ&libraries=drawing,geometry`;
        script.async = true;
        
        script.onload = () => {
          addStatus('4. ✅ Script carregado!');
          initMap();
        };
        
        script.onerror = (error) => {
          addStatus(`❌ ERRO ao carregar: ${error}`);
        };
        
        document.head.appendChild(script);
      } else {
        addStatus('3. Script já existe, aguardando...');
        // Esperar o script carregar
        const checkInterval = setInterval(() => {
          if ((window as any).google?.maps) {
            clearInterval(checkInterval);
            addStatus('4. ✅ Script carregado!');
            initMap();
          }
        }, 100);
        
        // Timeout de 10 segundos
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!(window as any).google?.maps) {
            addStatus('❌ Timeout ao aguardar Google Maps');
          }
        }, 10000);
      }
    } else {
      addStatus('3. ✅ Google Maps já carregado');
      initMap();
    }

    function initMap() {
      // Aguardar 100ms para garantir que o DOM está pronto
      setTimeout(() => {
        const google = (window as any).google;
        
        if (!google?.maps) {
          addStatus('❌ Google Maps não disponível');
          return;
        }

        if (!containerRef.current) {
          addStatus('❌ Container perdido');
          return;
        }

        addStatus('4. Criando mapa...');
        
        // Log detalhado do objeto google.maps
        addStatus(`   google.maps: ${typeof google.maps}`);
        addStatus(`   google.maps.Map: ${typeof google.maps.Map}`);

        try {
          const map = new google.maps.Map(containerRef.current, {
          center: { lat: -15.7801, lng: -47.9292 },
          zoom: 5,
          mapTypeId: 'hybrid',
          disableDefaultUI: false,
        });

        addStatus('5. ✅ MAPA CRIADO!');
        const mapDiv = containerRef.current;
        if (mapDiv) {
          const mapRect = mapDiv.getBoundingClientRect();
          addStatus(`   Map div: ${Math.round(mapRect.width)}x${Math.round(mapRect.height)}px`);
        }

        // Usar AdvancedMarkerElement (novo padrão do Google Maps)
        if (google.maps.marker && google.maps.marker.AdvancedMarkerElement) {
          const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: -15.7801, lng: -47.9292 },
            map: map,
            title: 'SOLARIS - Centro do Brasil',
          });
          addStatus('6. ✅ Marcador moderno adicionado!');
        } else {
          // Fallback para Marker antigo se AdvancedMarker não estiver disponível
          const marker = new google.maps.Marker({
            position: { lat: -15.7801, lng: -47.9292 },
            map: map,
            title: 'SOLARIS - Centro do Brasil',
          });
          addStatus('6. ✅ Marcador adicionado!');
        }
        addStatus('🎉 SUCESSO TOTAL!');

        mapRef.current = map;

        // Listener para resize
        const handleResize = () => {
          if (mapRef.current) {
            google.maps.event.trigger(mapRef.current, 'resize');
            const w = window.innerWidth;
            const h = window.innerHeight;
            addStatus(`↔️ Resize: ${w}x${h}px`);
          }
        };

        window.addEventListener('resize', handleResize);

        // Forçar resize inicial após 500ms
        setTimeout(() => {
          handleResize();
        }, 500);

        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (error: any) {
        addStatus(`❌ ERRO: ${error.message}`);
      }
      }, 100); // Timeout de 100ms
    }

    return () => {
      if (mapRef.current) {
        addStatus('Limpando...');
      }
    };
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      background: 'transparent',
      minHeight: '600px',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0
    }}>
      {/* Badge Status - Responsivo */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: 'rgba(0,0,0,0.75)',
        color: '#4ade80',
        padding: '6px 10px',
        borderRadius: '6px',
        zIndex: 10000,
        fontSize: '10px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(74, 222, 128, 0.3)',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        whiteSpace: 'nowrap',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        🗺️ <span style={{ display: window.innerWidth < 480 ? 'none' : 'inline' }}>Google Maps</span>
      </div>

      {/* Container do Mapa - Responsivo */}
      <div 
        ref={containerRef}
        style={{
          flex: 1,
          width: '100%',
          height: '100%',
          minHeight: '400px',
          background: 'var(--card-background)',
          margin: 0,
          padding: 0
        }}
      />

    </div>
  );
};

export default MapForceVisible;

