/**
 * SOLARIS - Map Legend Component
 * Legenda interativa para o mapa mostrando escalas de cores
 */
import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { COLOR_SCALES, getUnit } from '../utils/colorUtils';

interface MapLegendProps {
  activeVariables: string[];
  onToggleVariable?: (variable: string) => void;
}

const LegendContainer = styled.div<{ $isCollapsed: boolean }>`
  position: absolute;
  bottom: 80px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  padding: ${props => props.$isCollapsed ? '10px' : '15px'};
  min-width: 200px;
  max-width: 280px;
  z-index: 1000;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  @media (max-width: 480px) {
    bottom: 60px;
    right: 5px;
    min-width: 160px;
    max-width: 200px;
    font-size: 11px;
  }
`;

const LegendHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    opacity: 0.8;
  }
`;

const LegendTitle = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const VariableSection = styled.div`
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const VariableName = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #444;
  margin-bottom: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ColorScaleItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 11px;
  
  @media (max-width: 480px) {
    font-size: 10px;
    gap: 6px;
  }
`;

const ColorBox = styled.div<{ $color: string }>`
  width: 20px;
  height: 20px;
  background: ${props => props.$color};
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  
  @media (max-width: 480px) {
    width: 16px;
    height: 16px;
  }
`;

const ColorLabel = styled.span`
  color: #666;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NoDataMessage = styled.div`
  color: #999;
  font-size: 12px;
  font-style: italic;
  text-align: center;
  padding: 10px 0;
`;

const MapLegend: React.FC<MapLegendProps> = ({ activeVariables }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Variáveis com dados
  const variablesWithData = activeVariables.filter(v => COLOR_SCALES[v]);
  
  if (variablesWithData.length === 0) {
    return null;
  }
  
  return (
    <LegendContainer $isCollapsed={isCollapsed}>
      <LegendHeader onClick={() => setIsCollapsed(!isCollapsed)}>
        <LegendTitle>
          🗺️ Legenda
        </LegendTitle>
        <ToggleButton>
          {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </ToggleButton>
      </LegendHeader>
      
      {!isCollapsed && (
        <>
          {variablesWithData.length === 0 ? (
            <NoDataMessage>
              Nenhuma variável selecionada
            </NoDataMessage>
          ) : (
            variablesWithData.map(variable => {
              const scale = COLOR_SCALES[variable];
              const unit = getUnit(variable);
              
              return (
                <VariableSection key={variable}>
                  <VariableName>
                    <span>{variable}</span>
                    {unit && <span style={{ fontSize: '10px', color: '#999' }}>{unit}</span>}
                  </VariableName>
                  
                  {scale.slice(0, 5).map((range, index) => {
                    const rangeText = range.min === -Infinity 
                      ? `< ${range.max}`
                      : range.max === Infinity
                      ? `> ${range.min}`
                      : `${range.min}-${range.max}`;
                    
                    return (
                      <ColorScaleItem key={index}>
                        <ColorBox $color={range.color} />
                        <ColorLabel>
                          {rangeText} {range.label}
                        </ColorLabel>
                      </ColorScaleItem>
                    );
                  })}
                  
                  {scale.length > 5 && (
                    <ColorScaleItem>
                      <ColorLabel style={{ paddingLeft: '28px', fontSize: '10px' }}>
                        ... e mais {scale.length - 5} faixas
                      </ColorLabel>
                    </ColorScaleItem>
                  )}
                </VariableSection>
              );
            })
          )}
        </>
      )}
    </LegendContainer>
  );
};

export default MapLegend;

