import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar, Download, Play, Filter, Settings, Thermometer, Droplets, Sun, TreePine, Building, Users } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { useClimateData } from '../context/ClimateDataContext';
import 'react-datepicker/dist/react-datepicker.css';

interface ControlPanelProps {
  selectedArea: { bounds: any; name: string } | null;
  onLoadingChange: (loading: boolean) => void;
  onOpenDataAnalysis?: () => void;
}

const PanelContainer = styled.div`
  background: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow);
  height: fit-content;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const Section = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 16px;
`;

const DateRangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-color);
`;

// const DateInput = styled(DatePicker)`
//   padding: 8px 12px;
//   border: 1px solid var(--border-color);
//   border-radius: 6px;
//   background: var(--card-background);
//   color: var(--text-color);
//   font-size: 0.875rem;
//   
//   &:focus {
//     outline: none;
//     border-color: var(--primary-color);
//   }
// `;

const VariableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
`;

const VariableCard = styled.div<{ selected: boolean }>`
  background: ${props => props.selected ? 'var(--primary-color)' : 'var(--card-background)'};
  color: ${props => props.selected ? 'white' : 'var(--text-color)'};
  border: 1px solid ${props => props.selected ? 'var(--primary-color)' : 'var(--border-color)'};
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
  }
`;

const VariableIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  color: white;
`;

const VariableName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 4px;
`;

const VariableDesc = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
`;

const FilterSection = styled.div`
  background: var(--background-color);
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  width: 100%;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-color);
  margin: 0;
  flex: 1;
  min-width: 0;
  word-wrap: break-word;
  
  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

const DefaultButton = styled.button`
  padding: 6px 12px;
  background: linear-gradient(45deg, var(--primary-color), var(--color-max));
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(255, 140, 0, 0.3);
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 480px) {
    flex-wrap: wrap;
    gap: 6px;
  }
`;

const FilterInput = styled.input`
  flex: 1;
  min-width: 60px;
  max-width: 100px;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background: var(--card-background);
  color: var(--text-color);
  font-size: 0.875rem;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
  
  @media (max-width: 480px) {
    font-size: 0.8125rem;
    padding: 6px;
    min-width: 50px;
    max-width: 80px;
  }
`;

const ActionButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  width: 100%;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  ${props => props.$variant === 'primary' ? `
    background: linear-gradient(45deg, var(--primary-color), var(--color-max));
    color: white;
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 15px rgba(255, 140, 0, 0.3);
    }
    
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  ` : `
    background: var(--background-color);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    
    &:hover {
      background: var(--card-background);
    }
  `}
`;

const DownloadSection = styled.div`
  border-top: 1px solid var(--border-color);
  padding-top: 20px;
`;

const DownloadButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const VARIABLES = [
  {
    id: 'lst',
    name: 'LST',
    description: 'Temperatura da Superfície',
    icon: Thermometer,
    color: '#ef4444',
    defaultMin: 20,
    defaultMax: 45
  },
  {
    id: 'ndvi',
    name: 'NDVI',
    description: 'Índice de Vegetação',
    icon: TreePine,
    color: '#10b981',
    defaultMin: 0.3,
    defaultMax: 1.0
  },
  {
    id: 'ndbi',
    name: 'NDBI',
    description: 'Índice de Construção',
    icon: Building,
    color: '#f59e0b',
    defaultMin: 0.0,
    defaultMax: 0.8
  },
  {
    id: 'ndwi',
    name: 'NDWI',
    description: 'Índice de Água',
    icon: Droplets,
    color: '#3b82f6',
    defaultMin: 0.2,
    defaultMax: 1.0
  },
  {
    id: 'popDens',
    name: 'POP_DENS',
    description: 'Densidade Populacional',
    icon: Users,
    color: '#8b5cf6',
    defaultMin: 0,
    defaultMax: 10000
  },
  {
    id: 'nightLights',
    name: 'NIGHT_LIGHTS',
    description: 'Luzes Noturnas',
    icon: Sun,
    color: '#f59e0b',
    defaultMin: 20,
    defaultMax: 255
  }
];

const ControlPanel: React.FC<ControlPanelProps> = ({ selectedArea, onLoadingChange, onOpenDataAnalysis }) => {
  const { fetchSatelliteData, downloadData, isLoading } = useClimateData();
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedVariables, setSelectedVariables] = useState<string[]>(['lst', 'ndvi']);
  const [filters, setFilters] = useState<{ [key: string]: { min: string; max: string } }>({});

  useEffect(() => {
    onLoadingChange(isLoading);
  }, [isLoading, onLoadingChange]);

  const handleVariableToggle = (variableId: string) => {
    setSelectedVariables(prev => 
      prev.includes(variableId) 
        ? prev.filter(id => id !== variableId)
        : [...prev, variableId]
    );
  };

  const handleFilterChange = (variableId: string, field: 'min' | 'max', value: string) => {
    setFilters(prev => ({
      ...prev,
      [variableId]: {
        ...prev[variableId],
        [field]: value
      }
    }));
  };

  const handleUseDefaults = () => {
    const defaultFilters: { [key: string]: { min: string; max: string } } = {};
    
    selectedVariables.forEach(variableId => {
      const variable = VARIABLES.find(v => v.id === variableId);
      if (variable && variable.defaultMin !== undefined && variable.defaultMax !== undefined) {
        defaultFilters[variableId] = {
          min: variable.defaultMin.toString(),
          max: variable.defaultMax.toString()
        };
      }
    });
    
    setFilters(defaultFilters);
  };

  const handleAnalyze = async () => {
    if (!selectedArea) {
      alert('Por favor, selecione uma área no mapa primeiro.');
      return;
    }

    if (selectedVariables.length === 0) {
      alert('Por favor, selecione pelo menos uma variável para análise.');
      return;
    }

    await fetchSatelliteData(selectedArea);
  };

  const handleDownload = async (format: string) => {
    if (!selectedArea) {
      alert('Por favor, selecione uma área no mapa primeiro.');
      return;
    }

    if (selectedVariables.length === 0) {
      alert('Por favor, selecione pelo menos uma variável para download.');
      return;
    }

    await downloadData(format, 'solaris_data');
  };

  return (
    <PanelContainer>
      <Section>
        <SectionTitle>
          <Calendar size={20} />
          Período de Análise
        </SectionTitle>
        <DateRangeContainer>
          <FormGroup>
            <Label>Data Inicial</Label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => {
                if (date) setStartDate(date);
              }}
              dateFormat="dd/MM/yyyy"
              maxDate={endDate}
              placeholderText="Selecione a data inicial"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
            />
          </FormGroup>
          <FormGroup>
            <Label>Data Final</Label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => {
                if (date) setEndDate(date);
              }}
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              placeholderText="Selecione a data final"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
            />
          </FormGroup>
        </DateRangeContainer>
      </Section>

      <Section>
        <SectionTitle>
          <Filter size={20} />
          Variáveis Ambientais
        </SectionTitle>
        <VariableGrid>
          {VARIABLES.map(variable => {
            const IconComponent = variable.icon;
            return (
              <VariableCard
                key={variable.id}
                selected={selectedVariables.includes(variable.id)}
                onClick={() => handleVariableToggle(variable.id)}
              >
                <VariableIcon style={{ background: variable.color }}>
                  <IconComponent size={16} />
                </VariableIcon>
                <VariableName>{variable.name}</VariableName>
                <VariableDesc>{variable.description}</VariableDesc>
              </VariableCard>
            );
          })}
        </VariableGrid>
      </Section>

      {selectedVariables.length > 0 && (
        <Section>
          <SectionTitle>
            <Settings size={20} />
            Filtros de Valores
          </SectionTitle>
          <FilterSection>
            <FilterHeader>
              <FilterTitle>Configure os valores mínimos e máximos para cada variável</FilterTitle>
              <DefaultButton onClick={handleUseDefaults}>
                Usar Valores Padrão
              </DefaultButton>
            </FilterHeader>
            {selectedVariables.map(variableId => {
              const variable = VARIABLES.find(v => v.id === variableId);
              if (!variable) return null;
              
              return (
                <FilterRow key={variableId}>
                  <div style={{ 
                    minWidth: '55px', 
                    fontSize: '0.875rem', 
                    fontWeight: '500',
                    flexShrink: 0
                  }}>
                    {variable.name}:
                  </div>
                  <FilterInput
                    type="number"
                    placeholder="Min"
                    value={filters[variableId]?.min || ''}
                    onChange={(e) => handleFilterChange(variableId, 'min', e.target.value)}
                  />
                  <FilterInput
                    type="number"
                    placeholder="Max"
                    value={filters[variableId]?.max || ''}
                    onChange={(e) => handleFilterChange(variableId, 'max', e.target.value)}
                  />
                </FilterRow>
              );
            })}
          </FilterSection>
        </Section>
      )}

      <Section>
        <ActionButton
          $variant="primary"
          onClick={handleAnalyze}
          disabled={!selectedArea || selectedVariables.length === 0 || isLoading}
        >
          <Play size={20} />
          {isLoading ? 'Analisando...' : 'Analisar Área'}
        </ActionButton>
      </Section>

      <DownloadSection>
        <SectionTitle>
          <Download size={20} />
          Download de Dados
        </SectionTitle>
        <DownloadButtons>
          <ActionButton
            $variant="secondary"
            onClick={() => handleDownload('csv')}
            disabled={!selectedArea || selectedVariables.length === 0}
          >
            CSV
          </ActionButton>
          <ActionButton
            $variant="secondary"
            onClick={() => handleDownload('json')}
            disabled={!selectedArea || selectedVariables.length === 0}
          >
            JSON
          </ActionButton>
        </DownloadButtons>
      </DownloadSection>
    </PanelContainer>
  );
};

export default ControlPanel;