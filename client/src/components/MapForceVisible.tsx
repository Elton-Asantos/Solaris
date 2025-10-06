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
        addStatus('🎉 MAPA CRIADO COM SUCESSO!');

        // ============================================
        // DRAWING MANAGER - Ferramentas de Desenho
        // ============================================
        addStatus('7. Configurando Drawing Manager...');
        
        const drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: null, // Inicialmente sem modo ativo
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              google.maps.drawing.OverlayType.MARKER,
              google.maps.drawing.OverlayType.CIRCLE,
              google.maps.drawing.OverlayType.RECTANGLE,
              google.maps.drawing.OverlayType.POLYGON,
            ],
          },
          markerOptions: {
            draggable: true,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#ff6b6b',
              fillOpacity: 1,
              strokeColor: '#fff',
              strokeWeight: 2,
            },
          },
          circleOptions: {
            fillColor: '#3b82f6',
            fillOpacity: 0.3,
            strokeColor: '#3b82f6',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: true,
            editable: true,
            zIndex: 1,
          },
          rectangleOptions: {
            fillColor: '#10b981',
            fillOpacity: 0.3,
            strokeColor: '#10b981',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: true,
            editable: true,
            zIndex: 1,
          },
          polygonOptions: {
            fillColor: '#f59e0b',
            fillOpacity: 0.3,
            strokeColor: '#f59e0b',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: true,
            editable: true,
            zIndex: 1,
          },
        });

        drawingManager.setMap(map);
        addStatus('8. ✅ Drawing Manager adicionado!');
        
        // Array para armazenar todos os shapes desenhados
        const allShapes: any[] = [];
        
        // Listener para capturar shapes desenhados
        google.maps.event.addListener(drawingManager, 'overlaycomplete', (event: any) => {
          // Adicionar shape ao array
          allShapes.push(event.overlay);
          const shape = event.overlay;
          const type = event.type;
          
          addStatus(`✏️ Shape desenhado: ${type}`);
          
          // Capturar coordenadas baseado no tipo
          if (type === 'circle') {
            const center = shape.getCenter();
            const radius = shape.getRadius();
            addStatus(`   Centro: ${center.lat().toFixed(4)}, ${center.lng().toFixed(4)}`);
            addStatus(`   Raio: ${Math.round(radius)}m`);
            
            // TODO: Enviar para o ControlPanel
            console.log('CIRCLE DATA:', {
              type: 'circle',
              center: { lat: center.lat(), lng: center.lng() },
              radius: radius,
            });
          } else if (type === 'rectangle') {
            const bounds = shape.getBounds();
            const ne = bounds.getNorthEast();
            const sw = bounds.getSouthWest();
            addStatus(`   NE: ${ne.lat().toFixed(4)}, ${ne.lng().toFixed(4)}`);
            addStatus(`   SW: ${sw.lat().toFixed(4)}, ${sw.lng().toFixed(4)}`);
            
            console.log('RECTANGLE DATA:', {
              type: 'rectangle',
              bounds: {
                north: ne.lat(),
                south: sw.lat(),
                east: ne.lng(),
                west: sw.lng(),
              },
            });
          } else if (type === 'marker') {
            const position = shape.getPosition();
            addStatus(`   Posição: ${position.lat().toFixed(4)}, ${position.lng().toFixed(4)}`);
            
            console.log('MARKER DATA:', {
              type: 'marker',
              position: { lat: position.lat(), lng: position.lng() },
            });
          } else if (type === 'polygon') {
            const path = shape.getPath();
            const coordinates: any[] = [];
            path.forEach((latLng: any) => {
              coordinates.push({ lat: latLng.lat(), lng: latLng.lng() });
            });
            addStatus(`   Polígono com ${coordinates.length} pontos`);
            
            console.log('POLYGON DATA:', {
              type: 'polygon',
              coordinates: coordinates,
            });
          }
          
          addStatus('💾 Coordenadas capturadas!');
        });
        
        addStatus('🎉 DESENHO HABILITADO!');
        
        // ============================================
        // BOTÃO CUSTOMIZADO: LIMPAR SELEÇÃO
        // ============================================
        const clearButtonDiv = document.createElement('div');
        clearButtonDiv.style.margin = '10px 0 10px 10px'; // Alinhado com a barra
        clearButtonDiv.style.display = 'inline-block';
        
        const clearButton = document.createElement('button');
        clearButton.innerHTML = '🗑️ Limpar';
        clearButton.style.backgroundColor = '#ef4444';
        clearButton.style.color = 'white';
        clearButton.style.border = 'none';
        clearButton.style.borderRadius = '2px'; // Mesmo estilo do Google Maps
        clearButton.style.padding = '6px 12px'; // Menor, igual às ferramentas
        clearButton.style.fontSize = '13px';
        clearButton.style.fontWeight = '500';
        clearButton.style.cursor = 'pointer';
        clearButton.style.boxShadow = 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px';
        clearButton.style.transition = 'all 0.2s ease';
        clearButton.style.height = '40px'; // Mesma altura da barra do Google Maps
        clearButton.style.lineHeight = '1';
        clearButton.title = 'Remover todos os desenhos do mapa';
        
        clearButton.addEventListener('mouseover', () => {
          clearButton.style.backgroundColor = '#dc2626';
          clearButton.style.transform = 'translateY(-2px)';
          clearButton.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
        });
        
        clearButton.addEventListener('mouseout', () => {
          clearButton.style.backgroundColor = '#ef4444';
          clearButton.style.transform = 'translateY(0)';
          clearButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        });
        
        clearButton.addEventListener('click', () => {
          // Remover todos os shapes do mapa
          allShapes.forEach((shape) => {
            shape.setMap(null);
          });
          
          // Limpar array
          allShapes.length = 0;
          
          // Resetar drawing mode
          drawingManager.setDrawingMode(null);
          
          addStatus('🗑️ Todos os desenhos foram removidos!');
          console.log('CLEARED: Todos os shapes foram removidos');
        });
        
        clearButtonDiv.appendChild(clearButton);
        
        // Adicionar botão ao mapa (TOP_CENTER, ao lado das ferramentas de desenho)
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(clearButtonDiv);
        addStatus('9. ✅ Botão "Limpar" adicionado ao lado das ferramentas!');

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

