/**
 * SOLARIS - Data Table Modal
 * Modal para exibir tabela de dados de forma organizada
 */
import React from 'react';
import styled from 'styled-components';
import { X, Download } from 'lucide-react';
import { useClimateData } from '../context/ClimateDataContext';

interface DataTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
  backdrop-filter: blur(5px);
`;

const Modal = styled.div`
  background: var(--card-background);
  border-radius: 16px;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    max-width: 95vw;
    max-height: 95vh;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: var(--text-color);
  border-radius: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: var(--hover-background);
    transform: scale(1.1);
  }
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
  padding: 24px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
`;

const Thead = styled.thead`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
`;

const Tbody = styled.tbody`
  tr:nth-child(even) {
    background: rgba(0, 0, 0, 0.02);
  }
  
  tr:hover {
    background: var(--hover-background);
  }
`;

const Td = styled.td`
  padding: 12px 16px;
  font-size: 0.875rem;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
`;

const NoData = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 1rem;
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  opacity: 0.9;
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const ExportButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
`;

const DataTableModal: React.FC<DataTableModalProps> = ({ isOpen, onClose }) => {
  const { climateData, regionStats } = useClimateData();
  
  if (!climateData) {
    return (
      <Overlay $isOpen={isOpen} onClick={onClose}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <Header>
            <Title>📊 Dados da Análise</Title>
            <CloseButton onClick={onClose}>
              <X size={24} />
            </CloseButton>
          </Header>
          <Content>
            <NoData>Nenhum dado disponível. Execute uma análise primeiro.</NoData>
          </Content>
        </Modal>
      </Overlay>
    );
  }
  
  // Preparar dados para exibição
  const variables = Object.keys(climateData);
  const allPoints: any[] = [];
  
  // Combinar dados de todas as variáveis
  if (variables.length > 0 && climateData[variables[0]]) {
    climateData[variables[0]].forEach((point, index) => {
      const row: any = {
        lat: point.lat.toFixed(4),
        lon: point.lon.toFixed(4),
      };
      
      variables.forEach(variable => {
        if (climateData[variable] && climateData[variable][index]) {
          row[variable] = climateData[variable][index].value.toFixed(2);
        }
      });
      
      allPoints.push(row);
    });
  }
  
  const handleExportCSV = () => {
    if (allPoints.length === 0) return;
    
    // Criar CSV
    const headers = ['Latitude', 'Longitude', ...variables].join(',');
    const rows = allPoints.map(point => 
      [point.lat, point.lon, ...variables.map(v => point[v] || '')].join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solaris_dados_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  
  return (
    <Overlay $isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>📊 Dados da Análise ({allPoints.length} pontos)</Title>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <ExportButton onClick={handleExportCSV}>
              <Download size={16} />
              Exportar CSV
            </ExportButton>
            <CloseButton onClick={onClose}>
              <X size={24} />
            </CloseButton>
          </div>
        </Header>
        
        <Content>
          {/* Estatísticas */}
          {regionStats && (
            <StatsSection>
              {variables.map(variable => {
                const stats = regionStats[variable];
                if (!stats) return null;
                
                return (
                  <StatCard key={variable}>
                    <StatLabel>{variable}</StatLabel>
                    <StatValue>{stats.mean.toFixed(2)}</StatValue>
                    <div style={{ fontSize: '0.75rem', marginTop: '8px', opacity: 0.9 }}>
                      Min: {stats.min.toFixed(2)} | Max: {stats.max.toFixed(2)}
                    </div>
                  </StatCard>
                );
              })}
            </StatsSection>
          )}
          
          {/* Tabela */}
          <TableContainer>
            <Table>
              <Thead>
                <tr>
                  <Th>Latitude</Th>
                  <Th>Longitude</Th>
                  {variables.map(variable => (
                    <Th key={variable}>{variable}</Th>
                  ))}
                </tr>
              </Thead>
              <Tbody>
                {allPoints.slice(0, 100).map((point, index) => (
                  <tr key={index}>
                    <Td>{point.lat}</Td>
                    <Td>{point.lon}</Td>
                    {variables.map(variable => (
                      <Td key={variable}>{point[variable]}</Td>
                    ))}
                  </tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          
          {allPoints.length > 100 && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '16px', 
              color: '#999',
              fontSize: '0.875rem'
            }}>
              Mostrando 100 de {allPoints.length} pontos. Exporte o CSV para ver todos os dados.
            </div>
          )}
        </Content>
      </Modal>
    </Overlay>
  );
};

export default DataTableModal;

