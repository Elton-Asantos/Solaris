import React, { useState } from 'react';
import { MapContainer as LeafletMap, TileLayer, useMapEvents, Rectangle } from 'react-leaflet';
import styled from 'styled-components';
import { MapPin, Square, Circle as CircleIcon } from 'lucide-react';
import { useClimateData } from '../context/ClimateDataContext';

interface MapContainerProps {
  onAreaSelect: (area: { bounds: any; name: string } | null) => void;
  selectedArea: { bounds: any; name: string } | null;
}

interface HeatmapData {
  lat: number;
  lon: number;
  value: number;
}

interface HeatmapLayerProps {
  data: HeatmapData[];
  variable: string;
  bounds: any;
}

// Componente para renderizar heatmaps
const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ data, variable, bounds }) => {
  
  // Função para obter cor baseada no valor
  const getColor = (value: number, variable: string) => {
    switch (variable) {
      case 'lst':
        // LST: Azul (frio) → Vermelho (quente)
        if (value < 20) return '#1e40af'; // Azul escuro
        if (value < 25) return '#3b82f6'; // Azul
        if (value < 30) return '#10b981'; // Verde
        if (value < 35) return '#f59e0b'; // Amarelo
        if (value < 40) return '#f97316'; // Laranja
        return '#ef4444'; // Vermelho
      
      case 'ndvi':
        // NDVI: Marrom (solo) → Verde (vegetação)
        if (value < 0.1) return '#8b5a2b'; // Marrom escuro
        if (value < 0.3) return '#d97706'; // Marrom claro
        if (value < 0.5) return '#eab308'; // Amarelo
        if (value < 0.7) return '#22c55e'; // Verde claro
        return '#16a34a'; // Verde escuro
      
      case 'ndbi':
        // NDBI: Verde (natural) → Cinza (construído)
        if (value < 0.1) return '#16a34a'; // Verde
        if (value < 0.3) return '#84cc16'; // Verde claro
        if (value < 0.5) return '#eab308'; // Amarelo
        if (value < 0.7) return '#f59e0b'; // Laranja
        return '#6b7280'; // Cinza
      
      case 'ndwi':
        // NDWI: Marrom (seco) → Azul (água)
        if (value < 0.1) return '#8b5a2b'; // Marrom
        if (value < 0.3) return '#d97706'; // Marrom claro
        if (value < 0.5) return '#06b6d4'; // Ciano
        if (value < 0.7) return '#0ea5e9'; // Azul claro
        return '#0284c7'; // Azul
      
      case 'popDens':
        // POP_DENS: Verde (baixa) → Vermelho (alta)
        if (value < 100) return '#16a34a'; // Verde
        if (value < 1000) return '#22c55e'; // Verde claro
        if (value < 5000) return '#eab308'; // Amarelo
        if (value < 10000) return '#f59e0b'; // Laranja
        return '#ef4444'; // Vermelho
      
      case 'nightLights':
        // NIGHT_LIGHTS: Preto (escuro) → Amarelo (iluminado)
        if (value < 20) return '#1f2937'; // Preto
        if (value < 50) return '#374151'; // Cinza escuro
        if (value < 100) return '#6b7280'; // Cinza
        if (value < 200) return '#f59e0b'; // Amarelo
        return '#fbbf24'; // Amarelo claro
      
      default:
        return '#6b7280'; // Cinza padrão
    }
  };

  // Função para obter tamanho do círculo baseado no valor
  const getRadius = (value: number, variable: string) => {
    const baseRadius = 8;
    const maxRadius = 20;
    
    switch (variable) {
      case 'lst':
        return Math.max(baseRadius, Math.min(maxRadius, baseRadius + (value - 20) * 0.5));
      case 'ndvi':
        return Math.max(baseRadius, Math.min(maxRadius, baseRadius + value * 10));
      case 'ndbi':
        return Math.max(baseRadius, Math.min(maxRadius, baseRadius + value * 15));
      case 'ndwi':
        return Math.max(baseRadius, Math.min(maxRadius, baseRadius + value * 12));
      case 'popDens':
        return Math.max(baseRadius, Math.min(maxRadius, baseRadius + (value / 1000) * 2));
      case 'nightLights':
        return Math.max(baseRadius, Math.min(maxRadius, baseRadius + (value / 50) * 2));
      default:
        return baseRadius;
    }
  };

  return (
    <>
      {data.map((point, index) => (
        <div key={`${variable}-${index}`}>
          {/* Renderizar pontos de dados como círculos simples */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: getRadius(point.value, variable) * 2,
              height: getRadius(point.value, variable) * 2,
              backgroundColor: getColor(point.value, variable),
              borderRadius: '50%',
              opacity: 0.6,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
        </div>
      ))}
    </>
  );
};

const MapWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  background: #1a1a2e;
  border-radius: 8px;
  overflow: hidden;
  min-height: 500px;
  
  .leaflet-container {
    height: 100% !important;
    width: 100% !important;
    min-height: 500px !important;
    background: #1a1a2e !important;
    border-radius: 8px;
    position: relative !important;
    z-index: 1 !important;
  }
  
  .leaflet-pane {
    z-index: auto !important;
  }
  
  .leaflet-tile-pane {
    z-index: 200 !important;
  }
`;

const MapControls = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    gap: 8px;
  }
`;

const ControlButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'linear-gradient(45deg, var(--primary-color), var(--color-max))' : 'var(--card-background)'};
  color: ${props => props.active ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.active ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  box-shadow: var(--shadow);
  transition: all 0.2s ease;
  white-space: nowrap;
  min-width: 120px;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(45deg, var(--color-max), var(--primary-color))' : 'var(--background-color)'};
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(255, 140, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 0.875rem;
    min-width: 100px;
  }
`;

const AreaInfo = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 10px;
    left: 10px;
    right: 10px;
    max-width: none;
    padding: 12px;
  }
`;

const AreaTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
`;

const AreaDetails = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const Legend = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 250px;
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
    padding: 12px;
  }
`;

const LegendTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px 0;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const LegendColor = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 1px solid #e5e7eb;
`;

const LegendText = styled.span`
  color: #64748b;
  font-weight: 500;
`;

interface MapEventsProps {
  onAreaSelect: (area: { bounds: any; name: string } | null) => void;
  selectionMode: 'point' | 'rectangle' | 'circle' | null;
  setSelectionMode: (mode: 'point' | 'rectangle' | 'circle' | null) => void;
}

const MapEvents: React.FC<MapEventsProps> = ({ onAreaSelect, selectionMode, setSelectionMode }) => {
  const [startPoint, setStartPoint] = useState<[number, number] | null>(null);
  const [center, setCenter] = useState<[number, number] | null>(null);

  useMapEvents({
    click: (e: any) => {
      if (selectionMode === 'point') {
        const latlng = e.latlng;
        onAreaSelect({
          bounds: {
            north: latlng.lat,
            south: latlng.lat,
            east: latlng.lng,
            west: latlng.lng
          },
          name: `Ponto: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`
        });
        setSelectionMode(null);
      } else if (selectionMode === 'rectangle') {
        if (!startPoint) {
          setStartPoint([e.latlng.lat, e.latlng.lng]);
        } else {
          const bounds = {
            north: Math.max(startPoint[0], e.latlng.lat),
            south: Math.min(startPoint[0], e.latlng.lat),
            east: Math.max(startPoint[1], e.latlng.lng),
            west: Math.min(startPoint[1], e.latlng.lng)
          };
          onAreaSelect({
            bounds,
            name: `Retângulo: ${bounds.south.toFixed(4)}-${bounds.north.toFixed(4)}, ${bounds.west.toFixed(4)}-${bounds.east.toFixed(4)}`
          });
          setStartPoint(null);
          setSelectionMode(null);
        }
      } else if (selectionMode === 'circle') {
        if (!center) {
          setCenter([e.latlng.lat, e.latlng.lng]);
        } else {
          const distance = e.latlng.distanceTo([center[0], center[1]]);
          const bounds = {
            north: center[0] + (distance / 111000),
            south: center[0] - (distance / 111000),
            east: center[1] + (distance / (111000 * Math.cos(center[0] * Math.PI / 180))),
            west: center[1] - (distance / (111000 * Math.cos(center[0] * Math.PI / 180)))
          };
          onAreaSelect({
            bounds,
            name: `Círculo: Centro ${center[0].toFixed(4)}, ${center[1].toFixed(4)}, Raio ${(distance / 1000).toFixed(2)}km`
          });
          setCenter(null);
          setSelectionMode(null);
        }
      }
    }
  });

  return null;
};

const MapContainer: React.FC<MapContainerProps> = ({ onAreaSelect, selectedArea }) => {
  const [selectionMode, setSelectionMode] = useState<'point' | 'rectangle' | 'circle' | null>(null);
  const { climateData } = useClimateData();

  const handleClearSelection = () => {
    onAreaSelect(null);
    setSelectionMode(null);
  };

  const getBoundsFromArea = (area: { bounds: any; name: string }) => {
    const { north, south, east, west } = area.bounds;
    return [
      [south, west] as [number, number],
      [north, east] as [number, number]
    ];
  };

  console.log('MapContainer renderizando...', { selectedArea, climateData });

  return (
    <MapWrapper>
      <LeafletMap
        center={[-15.7801, -47.9292]} // Centro do Brasil
        zoom={5}
        style={{ height: '100%', width: '100%', minHeight: '500px', position: 'relative', zIndex: 1 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapEvents
          onAreaSelect={onAreaSelect}
          selectionMode={selectionMode}
          setSelectionMode={setSelectionMode}
        />

        {selectedArea && (
          <Rectangle
            bounds={getBoundsFromArea(selectedArea)}
            pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.2 }}
          />
        )}

        {/* Renderizar heatmaps para cada variável */}
        {climateData && selectedArea && Object.entries(climateData).map(([variable, data]) => (
          <HeatmapLayer
            key={variable}
            data={data}
            variable={variable}
            bounds={selectedArea.bounds}
          />
        ))}
      </LeafletMap>

      <MapControls>
        <ControlButton
          active={selectionMode === 'point'}
          onClick={() => setSelectionMode(selectionMode === 'point' ? null : 'point')}
        >
          <MapPin size={20} />
          Ponto
        </ControlButton>
        <ControlButton
          active={selectionMode === 'rectangle'}
          onClick={() => setSelectionMode(selectionMode === 'rectangle' ? null : 'rectangle')}
        >
          <Square size={20} />
          Retângulo
        </ControlButton>
        <ControlButton
          active={selectionMode === 'circle'}
          onClick={() => setSelectionMode(selectionMode === 'circle' ? null : 'circle')}
        >
          <CircleIcon size={20} />
          Círculo
        </ControlButton>
        <ControlButton onClick={handleClearSelection}>
          Limpar
        </ControlButton>
      </MapControls>

      {selectedArea && (
        <AreaInfo>
          <AreaTitle>Área Selecionada</AreaTitle>
          <AreaDetails>
            <div><strong>Nome:</strong> {selectedArea.name}</div>
            <div><strong>Norte:</strong> {selectedArea.bounds.north.toFixed(4)}°</div>
            <div><strong>Sul:</strong> {selectedArea.bounds.south.toFixed(4)}°</div>
            <div><strong>Leste:</strong> {selectedArea.bounds.east.toFixed(4)}°</div>
            <div><strong>Oeste:</strong> {selectedArea.bounds.west.toFixed(4)}°</div>
          </AreaDetails>
        </AreaInfo>
      )}

      {climateData && selectedArea && (
        <Legend>
          <LegendTitle>Legenda dos Dados</LegendTitle>
          {Object.keys(climateData).map(variable => {
            const getVariableInfo = (varName: string) => {
              switch (varName) {
                case 'lst':
                  return { name: 'Temperatura (LST)', colors: ['#1e40af', '#ef4444'], labels: ['Frio', 'Quente'] };
                case 'ndvi':
                  return { name: 'Vegetação (NDVI)', colors: ['#8b5a2b', '#16a34a'], labels: ['Solo', 'Vegetação'] };
                case 'ndbi':
                  return { name: 'Construção (NDBI)', colors: ['#16a34a', '#6b7280'], labels: ['Natural', 'Construído'] };
                case 'ndwi':
                  return { name: 'Água (NDWI)', colors: ['#8b5a2b', '#0284c7'], labels: ['Seco', 'Água'] };
                case 'popDens':
                  return { name: 'População', colors: ['#16a34a', '#ef4444'], labels: ['Baixa', 'Alta'] };
                case 'nightLights':
                  return { name: 'Luzes Noturnas', colors: ['#1f2937', '#fbbf24'], labels: ['Escuro', 'Iluminado'] };
                default:
                  return { name: varName.toUpperCase(), colors: ['#6b7280', '#6b7280'], labels: ['Baixo', 'Alto'] };
              }
            };

            const info = getVariableInfo(variable);
            return (
              <LegendItem key={variable}>
                <LegendColor color={info.colors[0]} />
                <LegendText>{info.name}</LegendText>
              </LegendItem>
            );
          })}
        </Legend>
      )}
    </MapWrapper>
  );
};

export default MapContainer;
