import React from 'react';
import styled from 'styled-components';

interface HeatIslandAnalysisProps {
  vulnerabilityData: any;
  predictionData: any;
  selectedArea: { bounds: any; name: string } | null;
}

const AnalysisContainer = styled.div`
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  box-shadow: var(--shadow);
`;

const AnalysisTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 2px solid var(--primary-color);
  padding-bottom: 0.5rem;
  width: fit-content;
`;

const RiskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const RiskCard = styled.div<{ riskLevel: string }>`
  background: ${props => {
    switch (props.riskLevel) {
      case 'muito_alto': return 'rgba(239, 68, 68, 0.1)';
      case 'alto': return 'rgba(255, 140, 0, 0.1)';
      case 'médio': return 'rgba(255, 255, 0, 0.1)';
      default: return 'rgba(34, 197, 94, 0.1)';
    }
  }};
  border: 2px solid ${props => {
    switch (props.riskLevel) {
      case 'muito_alto': return '#ef4444';
      case 'alto': return '#ff8c00';
      case 'médio': return '#ffff00';
      default: return '#22c55e';
    }
  }};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

const RiskTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RiskValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 4px;
`;

const RiskDescription = styled.div`
  font-size: 12px;
  color: var(--text-color);
  opacity: 0.8;
`;

const PredictionSection = styled.div`
  margin-top: 24px;
`;

const TrendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const TrendCard = styled.div`
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 12px;
  text-align: center;
`;

const TrendName = styled.div`
  font-size: 12px;
  color: var(--text-color);
  margin-bottom: 4px;
`;

const TrendCount = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
`;

const HeatIslandAnalysis: React.FC<HeatIslandAnalysisProps> = ({ 
  vulnerabilityData, 
  predictionData, 
  selectedArea 
}) => {
  if (!vulnerabilityData || !predictionData || !selectedArea) {
    return null;
  }

  // Mock data para demonstração
  const mockRiskLevels = {
    'muito_alto': 15,
    'alto': 25,
    'médio': 35,
    'baixo': 25
  };

  const mockTrends = {
    'crescimento_acelerado': 20,
    'crescimento_moderado': 30,
    'crescimento_lento': 25,
    'estável': 25
  };

  const getRiskDescription = (level: string) => {
    switch (level) {
      case 'muito_alto': return 'Risco crítico de ilha de calor';
      case 'alto': return 'Alto risco de formação de ilha de calor';
      case 'médio': return 'Risco moderado de aquecimento';
      default: return 'Baixo risco de aquecimento';
    }
  };

  const getTrendDescription = (trend: string) => {
    switch (trend) {
      case 'crescimento_acelerado': return 'Crescimento acelerado';
      case 'crescimento_moderado': return 'Crescimento moderado';
      case 'crescimento_lento': return 'Crescimento lento';
      default: return 'Estável';
    }
  };

  return (
    <AnalysisContainer>
      <AnalysisTitle>
        🌡️ Análise Preditiva de Ilhas de Calor
      </AnalysisTitle>

      <RiskGrid>
        {Object.entries(mockRiskLevels).map(([level, count]) => (
          <RiskCard key={level} riskLevel={level}>
            <RiskTitle>{level.replace('_', ' ')}</RiskTitle>
            <RiskValue>{count}</RiskValue>
            <RiskDescription>{getRiskDescription(level)}</RiskDescription>
          </RiskCard>
        ))}
      </RiskGrid>

      <PredictionSection>
        <AnalysisTitle>
          📈 Tendências de Crescimento
        </AnalysisTitle>
        <TrendGrid>
          {Object.entries(mockTrends).map(([trend, count]) => (
            <TrendCard key={trend}>
              <TrendName>{getTrendDescription(trend)}</TrendName>
              <TrendCount>{count}</TrendCount>
            </TrendCard>
          ))}
        </TrendGrid>
      </PredictionSection>
    </AnalysisContainer>
  );
};

export default HeatIslandAnalysis;