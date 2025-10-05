import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { BarChart3, Download, Filter, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useClimateData } from '../context/ClimateDataContext';
import HeatIslandAnalysis from './HeatIslandAnalysis';

interface DataTableProps {
  selectedArea: { bounds: any; name: string } | null;
}

const TableContainer = styled.div`
  flex: 1;
  padding: 24px;
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow);
  height: fit-content;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
`;

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const TableTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TableControls = styled.div`
  display: flex;
  gap: 8px;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: var(--background-color);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
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
  margin-bottom: 4px;
`;

const StatRange = styled.div`
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.7;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid var(--border-color);
  border-radius: 8px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--card-background);
`;

const TableHead = styled.thead`
  background: var(--background-color);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const TableHeaderCell = styled.th`
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:hover {
    background: var(--background-color);
  }
  
  &:nth-child(even) {
    background: var(--background-color);
  }
`;

const TableCell = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
`;

const NumberCell = styled(TableCell)`
  text-align: right;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-color);
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  background: var(--background-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: var(--text-color);
  opacity: 0.5;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  padding: 16px 0;
  border-top: 1px solid var(--border-color);
`;

const PaginationInfo = styled.div`
  font-size: 0.875rem;
  color: var(--text-color);
`;

const PaginationControls = styled.div`
  display: flex;
  gap: 8px;
`;

const PaginationButton = styled.button<{ disabled?: boolean }>`
  padding: 8px 12px;
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

const DataTable: React.FC<DataTableProps> = ({ selectedArea }) => {
  const { climateData, regionStats } = useClimateData();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);

  const tableData = useMemo(() => {
    if (!climateData) return [];
    
    const variables = Object.keys(climateData);
    if (variables.length === 0) return [];
    
    const firstVariable = climateData[variables[0]];
    if (!firstVariable || firstVariable.length === 0) return [];
    
    return firstVariable.map((point: any, index: number) => {
      const row: any = {
        id: index,
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

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tableData.slice(startIndex, endIndex);
  }, [tableData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const getTrendIcon = (value: number, mean: number) => {
    if (value > mean * 1.1) return 'up';
    if (value < mean * 0.9) return 'down';
    return 'neutral';
  };

  const getTrendIconComponent = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} />;
      case 'down': return <TrendingDown size={16} />;
      default: return <Minus size={16} />;
    }
  };

  if (!climateData || tableData.length === 0) {
    return (
      <TableContainer>
        <TableHeader>
          <TableTitle>
            <BarChart3 size={20} />
            Dados da Análise
          </TableTitle>
        </TableHeader>
        <EmptyState>
          <EmptyIcon>
            <BarChart3 size={24} />
          </EmptyIcon>
          <div>
            <div style={{ fontWeight: '500', marginBottom: '4px' }}>
              Nenhum dado disponível
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              Selecione uma área e execute uma análise para visualizar os dados
            </div>
          </div>
        </EmptyState>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <TableHeader>
        <TableTitle>
          <BarChart3 size={20} />
          Dados da Análise
        </TableTitle>
        <TableControls>
          <ControlButton>
            <Filter size={16} />
            Filtrar
          </ControlButton>
          <ControlButton>
            <Download size={16} />
            Exportar
          </ControlButton>
        </TableControls>
      </TableHeader>

      {/* Análise Preditiva de Ilhas de Calor */}
      {climateData && (
        <HeatIslandAnalysis
          vulnerabilityData={climateData}
          predictionData={climateData}
          selectedArea={selectedArea}
        />
      )}

      {regionStats && (
        <StatsGrid>
          {Object.entries(regionStats).map(([variable, stats]: [string, any]) => (
            <StatCard key={variable}>
              <StatHeader>
                <StatName>{variable.toUpperCase()}</StatName>
                <StatIcon trend="neutral">
                  <BarChart3 size={16} />
                </StatIcon>
              </StatHeader>
              <StatValue>{stats.mean.toFixed(2)}</StatValue>
              <StatRange>
                {stats.min.toFixed(2)} - {stats.max.toFixed(2)}
              </StatRange>
            </StatCard>
          ))}
        </StatsGrid>
      )}

      <TableWrapper>
        <Table>
          <TableHead>
            <tr>
              <TableHeaderCell>Latitude</TableHeaderCell>
              <TableHeaderCell>Longitude</TableHeaderCell>
              {Object.keys(climateData).map(variable => (
                <TableHeaderCell key={variable}>{variable.toUpperCase()}</TableHeaderCell>
              ))}
            </tr>
          </TableHead>
          <TableBody>
            {paginatedData.map((row: any) => (
              <TableRow key={row.id}>
                <NumberCell>{row.lat.toFixed(4)}</NumberCell>
                <NumberCell>{row.lon.toFixed(4)}</NumberCell>
                {Object.keys(climateData).map(variable => {
                  const value = row[variable];
                  const mean = regionStats?.[variable]?.mean || 0;
                  const trend = getTrendIcon(value, mean);
                  
                  return (
                    <TableCell key={variable}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{value?.toFixed(2) || '-'}</span>
                        {regionStats && (
                          <StatIcon trend={trend}>
                            {getTrendIconComponent(trend)}
                          </StatIcon>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>

      {totalPages > 1 && (
        <Pagination>
          <PaginationInfo>
            Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, tableData.length)} de {tableData.length} registros
          </PaginationInfo>
          <PaginationControls>
            <PaginationButton
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Anterior
            </PaginationButton>
            <PaginationButton
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Próximo
            </PaginationButton>
          </PaginationControls>
        </Pagination>
      )}
    </TableContainer>
  );
};

export default DataTable;