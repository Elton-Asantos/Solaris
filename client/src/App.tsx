import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import Header from './components/Header';
import MapContainer from './components/MapContainer';
import MapDebug from './components/MapDebug';
import MapboxMap from './components/MapboxMap';
import GoogleMapComponent from './components/GoogleMapComponent';
// MapDiagnostics removido para economizar espaço
import MapForceVisible from './components/MapForceVisible';
import ControlPanel from './components/ControlPanel';
import LoadingSpinner from './components/LoadingSpinner';
import ResponsiveLayout from './components/ResponsiveLayout';
import DataAnalysisModal from './components/DataAnalysisModal';
import { ClimateDataProvider } from './context/ClimateDataContext';
import { ThemeProvider } from './context/ThemeContext';
import { configureLeafletIcons } from './utils/leafletConfig';

// Configurar ícones do Leaflet uma vez na inicialização
configureLeafletIcons();

// 🗺️ ESCOLHA A BIBLIOTECA DE MAPA:
// 'leaflet-debug'  → Leaflet puro com logs de debug (MAIS SIMPLES) ✅ TESTE
// 'leaflet-react'  → React-Leaflet original (padrão)
// 'mapbox'         → Mapbox GL JS (MAIS BONITO, requer token)
// 'google'         → Google Maps (INTEGRAÇÃO GEE, requer API key)
type MapLibrary = 'leaflet-debug' | 'leaflet-react' | 'mapbox' | 'google';
const MAP_LIBRARY: MapLibrary = 'google' as MapLibrary;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--background-color);
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  gap: 0;
  min-height: 0;
  flex-direction: row;
  height: 100%;
  margin: 0;
  padding: 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MapSection = styled.div`
  flex: 1;
  position: relative;
  background: var(--card-background);
  overflow: hidden;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  
  /* Desktop grande (> 1200px) */
  @media (min-width: 1201px) {
    min-width: 600px;
  }
  
  /* Desktop médio (769px - 1200px) */
  @media (min-width: 769px) and (max-width: 1200px) {
    min-width: 400px;
  }
  
  /* Tablet (481px - 768px) */
  @media (min-width: 481px) and (max-width: 768px) {
    min-height: 500px;
    height: 500px;
    flex: 0 0 500px;
  }
  
  /* Mobile (< 480px) */
  @media (max-width: 480px) {
    min-height: 400px;
    height: 400px;
    flex: 0 0 400px;
  }
`;

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedArea, setSelectedArea] = useState<{
    bounds: any;
    name: string;
  } | null>(null);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebar = (
    <ControlPanel 
      selectedArea={selectedArea}
      onLoadingChange={setIsLoading}
      onOpenDataAnalysis={() => setIsDataModalOpen(true)}
    />
  );

  return (
    <ThemeProvider>
      <ClimateDataProvider>
        <AppContainer>
          <Header onOpenDataAnalysis={() => setIsDataModalOpen(true)} />
          <MainContent>
            <MapSection>
              {/* Google Maps - Ocupa todo espaço à esquerda */}
              <MapForceVisible onAreaSelected={setSelectedArea} />
            </MapSection>
            
            {/* Sidebar - Renderizada diretamente (sem ResponsiveLayout wrapper) */}
            {isMobile ? (
              <ResponsiveLayout 
                isMobile={isMobile}
                sidebar={sidebar}
              >
                <></>
              </ResponsiveLayout>
            ) : (
              <div style={{ 
                width: '420px', 
                minWidth: '420px', 
                maxWidth: '420px',
                height: '100%',
                background: 'var(--card-background)',
                borderLeft: '1px solid var(--border-color)',
                overflowY: 'auto',
                flexShrink: 0
              }}>
                {sidebar}
              </div>
            )}
          </MainContent>
          <ToastContainer 
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          
          <DataAnalysisModal
            isOpen={isDataModalOpen}
            onClose={() => setIsDataModalOpen(false)}
            selectedArea={selectedArea}
          />
        </AppContainer>
      </ClimateDataProvider>
    </ThemeProvider>
  );
};

export default App;