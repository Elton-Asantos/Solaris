import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export interface ClimateDataPoint {
  lat: number;
  lon: number;
  value: number;
}

export interface ClimateData {
  [variable: string]: ClimateDataPoint[];
}

export interface RegionStats {
  [variable: string]: {
    min: number;
    max: number;
    mean: number;
    count: number;
  };
}

export interface ClimateDataContextType {
  climateData: ClimateData | null;
  regionStats: RegionStats | null;
  isLoading: boolean;
  fetchClimateData: (lat: number, lon: number, startDate: string, endDate: string, source?: string) => Promise<void>;
  fetchSatelliteData: (selectedArea: any) => Promise<void>;
  fetchRegionStats: (bounds: any, startDate: string, endDate: string, variables: string[]) => Promise<void>;
  downloadData: (format: string, filename: string) => Promise<void>;
  clearData: () => void;
}

const ClimateDataContext = createContext<ClimateDataContextType | undefined>(undefined);

export const useClimateData = () => {
  const context = useContext(ClimateDataContext);
  if (!context) {
    throw new Error('useClimateData deve ser usado dentro de ClimateDataProvider');
  }
  return context;
};

export const ClimateDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [regionStats, setRegionStats] = useState<RegionStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClimateData = useCallback(async (
    lat: number,
    lon: number,
    startDate: string,
    endDate: string,
    source: string = 'visualcrossing'
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/climate-data', {
        lat,
        lon,
        startDate,
        endDate,
        source
      });
      
      // Processar dados climáticos se necessário
      console.log('Dados climáticos:', response.data);
      toast.success('Dados climáticos carregados com sucesso!');
    } catch (error: any) {
      console.error('Erro ao buscar dados climáticos:', error);
      toast.error(error.response?.data?.error || 'Erro ao buscar dados climáticos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSatelliteData = useCallback(async (
    selectedArea: any,
    variables?: string[],
    startDate?: string,
    endDate?: string
  ) => {
    if (!selectedArea) {
      toast.error('Nenhuma área selecionada');
      return;
    }

    // 🗑️ LIMPAR DADOS ANTERIORES ANTES DE NOVA ANÁLISE
    setClimateData(null);
    setRegionStats(null);
    
    setIsLoading(true);
    
    try {
      console.log('🛰️ Buscando dados do Google Earth Engine...');
      console.log('📍 Área selecionada:', selectedArea);
      console.log('🔍 Variáveis solicitadas:', variables);
      
      // ⚠️ NÃO usar variáveis padrão se nenhuma for fornecida
      const requestVariables = variables || [];
      
      // Definir datas padrão (últimos 30 dias)
      const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const defaultEndDate = new Date().toISOString().split('T')[0];
      
      // Preparar payload
      const payload: any = {
        variables: requestVariables,
        startDate: startDate || defaultStartDate,
        endDate: endDate || defaultEndDate
      };
      
      // Adicionar coords ou bounds baseado no tipo de área
      const areaData = selectedArea.bounds;
      
      if (areaData.type === 'circle') {
        // Área de círculo
        payload.coords = {
          lat: areaData.center.lat,
          lng: areaData.center.lng
        };
        payload.radius = areaData.radius; // Raio em metros
      } else if (areaData.type === 'marker') {
        // Ponto único
        payload.coords = {
          lat: areaData.position.lat,
          lng: areaData.position.lng
        };
      } else if (areaData.type === 'rectangle') {
        // Área retangular
        payload.bounds = areaData.bounds;
      } else if (areaData.type === 'polygon') {
        // Polígono
        payload.polygon = areaData.coordinates;
      }
      
      console.log('📡 Enviando para backend:', payload);
      
      // Chamar API FastAPI
      const response = await axios.post('http://localhost:8000/api/solaris/fetchData', payload);
      
      console.log('✅ Resposta recebida:', response.data);
      
      if (response.data && response.data.data) {
        const geeData = response.data.data;
        
        // Processar dados e calcular estatísticas
        const processedData: ClimateData = {};
        const stats: RegionStats = {};
        
        Object.keys(geeData).forEach(variable => {
          const varData = geeData[variable];
          const features = varData.features?.features || [];
          
          // Converter GeoJSON para ClimateDataPoint[]
          const points: ClimateDataPoint[] = features.map((f: any) => {
            const coords = f.geometry?.coordinates || [0, 0];
            const props = f.properties || {};
            
            return {
              lat: coords[1],
              lon: coords[0],
              value: props[variable] || props.value || 0
            };
          });
          
          processedData[variable] = points;
          
          // Calcular estatísticas
          if (points.length > 0) {
            const values = points.map(p => p.value);
            stats[variable] = {
              min: Math.min(...values),
              max: Math.max(...values),
              mean: values.reduce((a, b) => a + b, 0) / values.length,
              count: points.length
            };
          }
        });
        
        setClimateData(processedData);
        setRegionStats(stats);
        
        // Verificar se dados são mockados
        const isMock = Object.values(geeData).some((v: any) => v.mock);
        
        if (isMock) {
          toast.info(`📊 Dados mockados carregados (${Object.keys(processedData).length} variáveis)`);
        } else {
          toast.success(`✅ Dados do Google Earth Engine carregados!`);
        }
        
        console.log('📊 Dados processados:', { processedData, stats });
      }
    } catch (error: any) {
      console.error('❌ Erro ao buscar dados:', error);
      toast.error(error.response?.data?.detail || 'Erro ao buscar dados do satélite');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRegionStats = useCallback(async (
    bounds: any,
    startDate: string,
    endDate: string,
    variables: string[]
  ) => {
    try {
      const response = await axios.post('/api/region-stats', {
        bounds,
        startDate,
        endDate,
        variables
      });
      
      setRegionStats(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar estatísticas da região:', error);
      toast.error(error.response?.data?.error || 'Erro ao buscar estatísticas da região');
    }
  }, []);

  const downloadData = useCallback(async (format: string, filename: string) => {
    if (!climateData) {
      toast.error('Nenhum dado para baixar.');
      return;
    }
    
    try {
      // Nova API FastAPI para exportação
      const response = await axios.post('http://localhost:8000/api/solaris/export', {
        data: climateData,
        format,
        filename: `${filename}.${format}`
      }, {
        responseType: format === 'pdf' ? 'blob' : 'json'
      });

      if (format === 'pdf') {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        // Para CSV e JSON, usar o conteúdo retornado pela API
        const content = format === 'json' ? JSON.stringify(climateData, null, 2) : response.data;
        const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${filename}.${format}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }

      toast.success(`📥 ${format.toUpperCase()} baixado com sucesso!`);
    } catch (error: any) {
      console.error('Erro ao fazer download:', error);
      toast.error(error.response?.data?.detail || 'Erro ao fazer download');
    }
  }, [climateData]);

  const clearData = useCallback(() => {
    setClimateData(null);
    setRegionStats(null);
  }, []);

  const value: ClimateDataContextType = {
    climateData,
    regionStats,
    isLoading,
    fetchClimateData,
    fetchSatelliteData,
    fetchRegionStats,
    downloadData,
    clearData
  };

  return (
    <ClimateDataContext.Provider value={value}>
      {children}
    </ClimateDataContext.Provider>
  );
};