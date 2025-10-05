import React from 'react';
import styled from 'styled-components';
import { useClimateData } from '../context/ClimateDataContext';

interface HeatIslandDashboardProps {
  selectedArea: { bounds: any; name: string } | null;
}

const DashboardContainer = styled.div`
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: var(--shadow);
`;

const SectionTitle = styled.h3`
  color: var(--text-color);
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const MetricCard = styled.div`
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
`;

const MetricTitle = styled.h4`
  color: var(--text-color);
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MetricValue = styled.div`
  color: var(--text-color);
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const MetricSubtitle = styled.div`
  color: var(--text-color);
  font-size: 12px;
  opacity: 0.7;
`;

const MetricTrend = styled.div<{ trend: 'up' | 'down' | 'stable' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch (props.trend) {
      case 'up': return 'color: #ef4444;';
      case 'down': return 'color: #10b981;';
      default: return 'color: var(--text-color);';
    }
  }}
`;

const PredictionSection = styled.div`
  margin-top: 24px;
`;

const PredictionTimeline = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  padding: 16px 0;
`;

const TimelineItem = styled.div`
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  min-width: 120px;
  text-align: center;
`;

const TimelineYear = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 4px;
`;

const TimelineValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-color);
`;

const HeatIslandDashboard: React.FC<HeatIslandDashboardProps> = ({ selectedArea }) => {
  const { climateData } = useClimateData();

  if (!climateData || !selectedArea) {
    return null;
  }

  // Mock data para demonstração
  const mockVulnerability = {
    currentRisk: 65.5,
    factors: {
      temperature: 75,
      vegetation: 45,
      construction: 80,
      population: 60
    }
  };

  const mockPrediction = [
    { timeframe: '2024', value: 65.5 },
    { timeframe: '2025', value: 68.2 },
    { timeframe: '2026', value: 71.8 },
    { timeframe: '2027', value: 75.3 },
    { timeframe: '2028', value: 79.1 }
  ];

  // Calcular fatores médios
  const avgFactors = Object.keys(mockVulnerability.factors).reduce((acc, key) => {
    acc[key] = mockVulnerability.factors[key as keyof typeof mockVulnerability.factors];
    return acc;
  }, {} as any);

  const avgFutureRisk = mockPrediction.reduce((sum, d) => sum + d.value, 0) / mockPrediction.length;
  const riskCounts = mockPrediction.reduce((counts, d) => {
    const riskLevel = d.value < 25 ? 'baixo' : d.value < 50 ? 'moderado' : d.value < 75 ? 'alto' : 'critico';
    counts[riskLevel] = (counts[riskLevel] || 0) + 1;
    return counts;
  }, {} as any);

  return (
    <DashboardContainer>
      <SectionTitle>
        🌡️ Análise de Ilhas de Calor
      </SectionTitle>

      <MetricsGrid>
        <MetricCard>
          <MetricTitle>Vulnerabilidade Atual</MetricTitle>
          <MetricValue>{mockVulnerability.currentRisk.toFixed(1)}%</MetricValue>
          <MetricSubtitle>Risco de Ilha de Calor</MetricSubtitle>
          <MetricTrend trend={mockVulnerability.currentRisk > 50 ? 'up' : 'down'}>
            {mockVulnerability.currentRisk > 50 ? '📈' : '📉'}
            {mockVulnerability.currentRisk > 50 ? 'Alto Risco' : 'Baixo Risco'}
          </MetricTrend>
        </MetricCard>

        <MetricCard>
          <MetricTitle>Temperatura</MetricTitle>
          <MetricValue>{avgFactors.temperature}%</MetricValue>
          <MetricSubtitle>Fator de Risco</MetricSubtitle>
          <MetricTrend trend={avgFactors.temperature > 70 ? 'up' : 'down'}>
            {avgFactors.temperature > 70 ? '🔥' : '❄️'}
            {avgFactors.temperature > 70 ? 'Quente' : 'Frio'}
          </MetricTrend>
        </MetricCard>

        <MetricCard>
          <MetricTitle>Vegetação</MetricTitle>
          <MetricValue>{avgFactors.vegetation}%</MetricValue>
          <MetricSubtitle>Índice de Cobertura</MetricSubtitle>
          <MetricTrend trend={avgFactors.vegetation > 50 ? 'down' : 'up'}>
            {avgFactors.vegetation > 50 ? '🌳' : '🏗️'}
            {avgFactors.vegetation > 50 ? 'Boa' : 'Baixa'}
          </MetricTrend>
        </MetricCard>

        <MetricCard>
          <MetricTitle>Construção</MetricTitle>
          <MetricValue>{avgFactors.construction}%</MetricValue>
          <MetricSubtitle>Densidade Urbana</MetricSubtitle>
          <MetricTrend trend={avgFactors.construction > 70 ? 'up' : 'down'}>
            {avgFactors.construction > 70 ? '🏢' : '🌱'}
            {avgFactors.construction > 70 ? 'Alta' : 'Baixa'}
          </MetricTrend>
        </MetricCard>

        <MetricCard>
          <MetricTitle>População</MetricTitle>
          <MetricValue>{avgFactors.population}%</MetricValue>
          <MetricSubtitle>Densidade Populacional</MetricSubtitle>
          <MetricTrend trend={avgFactors.population > 60 ? 'up' : 'down'}>
            {avgFactors.population > 60 ? '👥' : '🏠'}
            {avgFactors.population > 60 ? 'Alta' : 'Baixa'}
          </MetricTrend>
        </MetricCard>

        <MetricCard>
          <MetricTitle>Risco Futuro</MetricTitle>
          <MetricValue>{avgFutureRisk.toFixed(1)}%</MetricValue>
          <MetricSubtitle>Projeção 5 Anos</MetricSubtitle>
          <MetricTrend trend={avgFutureRisk > mockVulnerability.currentRisk ? 'up' : 'down'}>
            {avgFutureRisk > mockVulnerability.currentRisk ? '📈' : '📉'}
            {avgFutureRisk > mockVulnerability.currentRisk ? 'Crescendo' : 'Estável'}
          </MetricTrend>
        </MetricCard>
      </MetricsGrid>

      <PredictionSection>
        <SectionTitle>📊 Projeção Temporal</SectionTitle>
        <PredictionTimeline>
          {mockPrediction.map((item, index) => (
            <TimelineItem key={index}>
              <TimelineYear>{item.timeframe}</TimelineYear>
              <TimelineValue>Risco: {item.value.toFixed(1)}%</TimelineValue>
            </TimelineItem>
          ))}
        </PredictionTimeline>
      </PredictionSection>
    </DashboardContainer>
  );
};

export default HeatIslandDashboard;
