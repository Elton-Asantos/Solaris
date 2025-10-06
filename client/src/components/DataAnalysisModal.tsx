import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { X, BarChart3, Filter, Download, Minus } from 'lucide-react';
import { useClimateData } from '../context/ClimateDataContext';

interface DataAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedArea: { bounds: any; name: string } | null;
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  background: var(--card-background);
  border-radius: 12px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border-color);
  max-width: 90vw;
  max-height: 90vh;
  width: 1200px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--background-color);
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  
  &:hover {
    background: #dc2626;
  }
`;

const ModalContent = styled.div`
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: var(--text-color);
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  background: var(--background-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  color: var(--text-color);
  opacity: 0.5;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: var(--background-color);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
`;

const PredictionSection = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  color: white;
`;

const PredictionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
`;

const PredictionContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const PredictionCard = styled.div`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const PredictionTitle = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
  margin-bottom: 8px;
`;

const PredictionValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 4px;
`;

const PredictionSubtext = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 1.5rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--text-color)'};
  border: none;
  padding: 12px 24px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
      : 'var(--hover-background)'};
    transform: translateY(-2px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.$active ? '#667eea' : 'transparent'};
  }
`;

const TabContent = styled.div`
  animation: fadeIn 0.3s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const StatName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
`;

const StatIcon = styled.div<{ trend: 'up' | 'down' | 'neutral' }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  
  ${props => {
    switch (props.trend) {
      case 'up': return 'background: #10b981;';
      case 'down': return 'background: #ef4444;';
      default: return 'background: #6b7280;';
    }
  }}
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.25rem;
`;

const StatRange = styled.div`
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.7;
`;

const TableControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--background-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--card-background);
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--card-background);
`;

const TableHead = styled.thead`
  background: var(--background-color);
`;

const TableRow = styled.tr`
  &:hover {
    background: var(--background-color);
  }
  
  &:nth-child(even) {
    background: var(--background-color);
  }
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
`;

const TableBody = styled.tbody``;

const TableCell = styled.td`
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
`;

const NumberCell = styled(TableCell)`
  text-align: right;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
`;

const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: var(--text-color);
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--card-background);
  color: var(--text-color);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: var(--background-color);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DataAnalysisModal: React.FC<DataAnalysisModalProps> = ({ isOpen, onClose, selectedArea }) => {
  const { climateData, regionStats } = useClimateData();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [activeTab, setActiveTab] = useState<'data' | 'prediction'>('prediction');

  const allData = useMemo(() => {
    if (!climateData) return [];
    
    const variables = Object.keys(climateData);
    if (variables.length === 0) return [];
    
    const firstVariable = climateData[variables[0]];
    if (!firstVariable || firstVariable.length === 0) return [];
    
    return firstVariable.map((point: any, index: number) => {
      const row: any = {
        lat: point.lat,
        lon: point.lon
      };
      
      variables.forEach(variable => {
        const data = climateData[variable];
        if (data && data[index]) {
          row[variable] = data[index].value;
        }
      });
      
      return row;
    });
  }, [climateData]);

  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return allData.slice(startIndex, endIndex);
  }, [allData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(allData.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, page)));
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay $isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <BarChart3 size={24} />
            Análise de Dados
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={16} />
          </CloseButton>
        </ModalHeader>
        
        <ModalContent>
          {!climateData || allData.length === 0 ? (
            <EmptyState>
              <EmptyIcon>
                <BarChart3 size={32} />
              </EmptyIcon>
              <h3>Nenhum dado disponível</h3>
              <p>Selecione uma área no mapa e clique em "Analisar Área" para ver os dados.</p>
            </EmptyState>
          ) : (
            <>
              {/* ABAS DE NAVEGAÇÃO */}
              <TabContainer>
                <Tab 
                  $active={activeTab === 'prediction'} 
                  onClick={() => setActiveTab('prediction')}
                >
                  🔮 Análise Preditiva
                </Tab>
                <Tab 
                  $active={activeTab === 'data'} 
                  onClick={() => setActiveTab('data')}
                >
                  📊 Dados Detalhados
                </Tab>
              </TabContainer>

              {/* CONTEÚDO DA ABA ANÁLISE PREDITIVA */}
              {activeTab === 'prediction' && (
                <TabContent>
                  {/* Estatísticas Gerais */}
                  {regionStats && (
                    <StatsGrid>
                      {Object.entries(regionStats).map(([variable, stats]: [string, any]) => (
                        <StatCard key={variable}>
                          <StatHeader>
                            <StatName>{variable.toUpperCase()}</StatName>
                            <StatIcon trend="neutral">
                              <Minus size={16} />
                            </StatIcon>
                          </StatHeader>
                          <StatValue>{stats.mean.toFixed(2)}</StatValue>
                          <StatRange>Min: {stats.min.toFixed(2)} | Max: {stats.max.toFixed(2)}</StatRange>
                        </StatCard>
                      ))}
                    </StatsGrid>
                  )}

                  {/* Dashboard de Análise Preditiva */}
                  {regionStats && regionStats.LST && (
                <PredictionSection>
                  <PredictionHeader>
                    🔮 Análise Preditiva - Ilha de Calor
                  </PredictionHeader>
                  <PredictionContent>
                    <PredictionCard>
                      <PredictionTitle>Risco de Ilha de Calor</PredictionTitle>
                      <PredictionValue>
                        {regionStats.LST.mean > 35 ? '🔴 ALTO' : regionStats.LST.mean > 30 ? '🟡 MODERADO' : '🟢 BAIXO'}
                      </PredictionValue>
                      <PredictionSubtext>
                        Baseado em LST médio de {regionStats.LST.mean.toFixed(2)}°C
                      </PredictionSubtext>
                    </PredictionCard>

                    <PredictionCard>
                      <PredictionTitle>Índice de Vegetação</PredictionTitle>
                      <PredictionValue>
                        {regionStats.NDVI ? (
                          regionStats.NDVI.mean < 0.3 ? '🔴 CRÍTICO' : regionStats.NDVI.mean < 0.5 ? '🟡 BAIXO' : '🟢 ADEQUADO'
                        ) : 'N/A'}
                      </PredictionValue>
                      <PredictionSubtext>
                        {regionStats.NDVI ? `NDVI médio: ${regionStats.NDVI.mean.toFixed(2)}` : 'Dados não disponíveis'}
                      </PredictionSubtext>
                    </PredictionCard>

                    <PredictionCard>
                      <PredictionTitle>Urbanização</PredictionTitle>
                      <PredictionValue>
                        {regionStats.NDBI ? (
                          regionStats.NDBI.mean > 0.3 ? '🔴 ALTA' : regionStats.NDBI.mean > 0.1 ? '🟡 MODERADA' : '🟢 BAIXA'
                        ) : 'N/A'}
                      </PredictionValue>
                      <PredictionSubtext>
                        {regionStats.NDBI ? `NDBI médio: ${regionStats.NDBI.mean.toFixed(2)}` : 'Dados não disponíveis'}
                      </PredictionSubtext>
                    </PredictionCard>

                    <PredictionCard>
                      <PredictionTitle>Vulnerabilidade Climática</PredictionTitle>
                      <PredictionValue>
                        {(() => {
                          const lstScore = regionStats.LST.mean > 35 ? 3 : regionStats.LST.mean > 30 ? 2 : 1;
                          const ndviScore = regionStats.NDVI ? (regionStats.NDVI.mean < 0.3 ? 3 : regionStats.NDVI.mean < 0.5 ? 2 : 1) : 2;
                          const ndbiScore = regionStats.NDBI ? (regionStats.NDBI.mean > 0.3 ? 3 : regionStats.NDBI.mean > 0.1 ? 2 : 1) : 2;
                          const totalScore = lstScore + ndviScore + ndbiScore;
                          
                          return totalScore > 7 ? '🔴 ALTA' : totalScore > 5 ? '🟡 MODERADA' : '🟢 BAIXA';
                        })()}
                      </PredictionValue>
                      <PredictionSubtext>
                        Análise combinada de temperatura, vegetação e urbanização
                      </PredictionSubtext>
                    </PredictionCard>
                  </PredictionContent>
                </PredictionSection>
                  )}
                </TabContent>
              )}

              {/* CONTEÚDO DA ABA DADOS DETALHADOS */}
              {activeTab === 'data' && (
                <TabContent>
              <TableControls>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--text-color)' }}>
                    Dados Detalhados
                  </h3>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-color)', fontSize: '0.875rem' }}>
                    {allData.length} pontos de dados encontrados
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <ControlButton>
                    <Filter size={16} />
                    Filtrar
                  </ControlButton>
                  <ControlButton>
                    <Download size={16} />
                    Exportar
                  </ControlButton>
                </div>
              </TableControls>

              <TableWrapper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Latitude</TableHeaderCell>
                      <TableHeaderCell>Longitude</TableHeaderCell>
                      {Object.keys(climateData).map(variable => (
                        <TableHeaderCell key={variable}>{variable.toUpperCase()}</TableHeaderCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentData.map((row: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{row.lat.toFixed(4)}</TableCell>
                        <TableCell>{row.lon.toFixed(4)}</TableCell>
                        {Object.keys(climateData).map(variable => (
                          <NumberCell key={variable}>{row[variable]?.toFixed(2) || 'N/A'}</NumberCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableWrapper>

              {totalPages > 1 && (
                <Pagination>
                  <PaginationInfo>
                    Mostrando {Math.min(currentData.length, itemsPerPage)} de {allData.length} pontos
                  </PaginationInfo>
                  <PaginationControls>
                    <PaginationButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                      Anterior
                    </PaginationButton>
                    <PaginationButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                      Próxima
                    </PaginationButton>
                  </PaginationControls>
                </Pagination>
              )}
                </TabContent>
              )}
            </>
          )}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DataAnalysisModal;