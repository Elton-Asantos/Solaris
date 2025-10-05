import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Toaster } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from './context/ThemeContext';
import { ClimateDataProvider } from './context/ClimateDataContext';
import Header from './components/Header';
import MapContainer from './components/MapContainer';
import ResponsiveLayout from './components/ResponsiveLayout';
import DataAnalysisModal from './components/DataAnalysisModal';
import LoadingSpinner from './components/LoadingSpinner';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
`;

const MainContent = styled.div`
  display: flex;
  height: calc(100vh - 60px);
  position: relative;
`;

const MapSection = styled.div`
  flex: 1;
  position: relative;
`;

function App() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectionMode, setSelectionMode] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sidebar = selectedArea ? (
    <ResponsiveLayout
      isMobile={isMobile}
      sidebar={
        <div style={{ padding: '20px' }}>
          <h3>Área Selecionada</h3>
          <p><strong>Nome:</strong> {selectedArea.name}</p>
          <p><strong>Tipo:</strong> {selectedArea.selectionType || 'retângulo'}</p>
          {selectedArea.selectionType === 'circle' && selectedArea.circleParams && (
            <p><strong>Raio:</strong> {selectedArea.circleParams.radiusKm.toFixed(2)} km</p>
          )}
          <button 
            onClick={() => setIsDataModalOpen(true)}
            style={{
              background: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Analisar Área
          </button>
        </div>
      }
    />
  ) : null;

  return (
    <ThemeProvider>
      <ClimateDataProvider>
        <AppContainer>
          <Header selectionMode={selectionMode} />
          <MainContent>
            <MapSection>
              <MapContainer 
                onAreaSelect={setSelectedArea}
                selectedArea={selectedArea}
                onSelectionModeChange={setSelectionMode}
              />
              {isLoading && <LoadingSpinner />}
            </MapSection>
            <ResponsiveLayout
              isMobile={isMobile}
              sidebar={sidebar}
            >
              <div style={{ flex: 1 }} />
            </ResponsiveLayout>
          </MainContent>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--card-background)',
                color: 'var(--text-color)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
              },
            }}
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
}

export default App;
