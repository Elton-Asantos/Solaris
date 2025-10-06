import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Calendar, Download, Play, Filter, Settings, Thermometer, Droplets, Sun, TreePine, Building, Users, BarChart2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { useClimateData } from '../context/ClimateDataContext';
import DataTableModal from './DataTableModal';
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
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  
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

const DatePickerWrapper = styled.div`
  position: relative;
  width: 100%;

  /* Estilização do input do DatePicker */
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker__input-container {
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;

    /* Ícone de calendário */
    &::before {
      content: '📅';
      position: absolute;
      left: 12px;
      font-size: 16px;
      pointer-events: none;
      z-index: 1;
    }

    input {
      width: 100%;
      padding: 10px 12px 10px 38px;
      border: 2px solid var(--border-color);
      border-radius: 8px;
      background: var(--card-background);
      color: var(--text-color);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
      box-sizing: border-box;

      &:hover {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
      }

      &::placeholder {
        color: var(--text-muted);
        opacity: 0.6;
      }
    }
  }

  /* Estilização do calendário popup */
  .react-datepicker {
    font-family: inherit;
    border: 2px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    background: var(--card-background);
    overflow: hidden;
  }

  .react-datepicker__header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-bottom: none;
    padding-top: 12px;
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: white;
    font-weight: 600;
  }

  .react-datepicker__day {
    color: var(--text-color);
    font-weight: 500;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover {
      background: var(--primary-color);
      color: white;
    }
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background: var(--primary-color);
    color: white;
    font-weight: 700;
  }

  .react-datepicker__day--today {
    font-weight: 700;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
  }

  .react-datepicker__day--disabled {
    color: var(--text-muted);
    opacity: 0.4;
    cursor: not-allowed;
  }

  .react-datepicker__navigation {
    top: 12px;
  }

  .react-datepicker__navigation-icon::before {
    border-color: white;
  }

  /* Dropdowns de mês e ano */
  .react-datepicker__month-dropdown,
  .react-datepicker__year-dropdown {
    background: var(--card-background);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .react-datepicker__month-option,
  .react-datepicker__year-option {
    color: var(--text-color);
    padding: 8px 12px;

    &:hover {
      background: var(--primary-color);
      color: white;
    }
  }

  .react-datepicker__month-option--selected,
  .react-datepicker__year-option--selected {
    background: var(--primary-color);
    color: white;
    font-weight: 700;
  }
`;

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
  const { fetchSatelliteData, downloadData, isLoading, climateData } = useClimateData();
  const [startDate, setStartDate] = useState<Date>(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedVariables, setSelectedVariables] = useState<string[]>(['lst', 'ndvi']);
  const [filters, setFilters] = useState<{ [key: string]: { min: string; max: string } }>({});
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

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

    // ✅ Converter IDs para formato esperado pelo backend (uppercase)
    const variablesUpperCase = selectedVariables.map(v => v.toUpperCase());
    
    console.log('📊 Variáveis selecionadas:', variablesUpperCase);

    // Passar variáveis selecionadas, datas e área
    await fetchSatelliteData(
      selectedArea,
      variablesUpperCase,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
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
      {/* Área Selecionada - Indicador Visual */}
      {selectedArea && (
        <Section style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontWeight: 600,
            marginBottom: '8px'
          }}>
            📍 Área Selecionada
          </div>
          <div style={{ 
            fontSize: '14px', 
            opacity: 0.95 
          }}>
            {selectedArea.name}
          </div>
        </Section>
      )}
      
      <Section>
        <SectionTitle>
          <Calendar size={20} />
          Período de Análise
        </SectionTitle>
        <DateRangeContainer>
          <FormGroup>
            <Label>Data Inicial</Label>
            <DatePickerWrapper>
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
            </DatePickerWrapper>
          </FormGroup>
          <FormGroup>
            <Label>Data Final</Label>
            <DatePickerWrapper>
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
            </DatePickerWrapper>
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
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <ActionButton
            $variant="primary"
            onClick={handleAnalyze}
            disabled={!selectedArea || selectedVariables.length === 0 || isLoading}
            style={{ flex: 1, minWidth: '200px' }}
          >
            <Play size={20} />
            {isLoading ? 'Analisando...' : 'Analisar Área'}
          </ActionButton>
          
          {climateData && (
            <ActionButton
              $variant="secondary"
              onClick={() => setIsDataModalOpen(true)}
              style={{ flex: 1, minWidth: '180px' }}
            >
              <BarChart2 size={20} />
              Ver Análise
            </ActionButton>
          )}
        </div>
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
      
      {/* Modal de Dados */}
      <DataTableModal 
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />
    </PanelContainer>
  );
};

export default ControlPanel;