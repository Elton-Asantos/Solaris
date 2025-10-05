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

  const fetchSatelliteData = useCallback(async (selectedArea: any) => {
    if (!selectedArea) {
      toast.error('Nenhuma área selecionada');
      return;
    }

    setIsLoading(true);
    try {
      // Nova API FastAPI na porta 8000
      const response = await axios.post('http://localhost:8000/api/solaris/fetchData', {
        bounds: selectedArea.bounds,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        variables: ['LST', 'NDVI', 'NDBI', 'NDWI', 'POP_DENS', 'NIGHT_LIGHTS']
      });

      if (response.data && response.data.data) {
        // Converter nomes de variáveis para lowercase para manter compatibilidade
        const data: any = {};
        Object.keys(response.data.data).forEach(key => {
          data[key.toLowerCase()] = response.data.data[key];
        });
        
        setClimateData(data);
        setRegionStats(response.data.regionStats || null);
        toast.success('✨ Dados carregados via FastAPI + Google Earth Engine!');
      }
    } catch (error: any) {
      console.error('Erro ao buscar dados de satélite:', error);
      toast.error(error.response?.data?.detail || 'Erro ao buscar dados de satélite');
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