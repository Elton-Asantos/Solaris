export interface SelectedArea {
  bounds: any;
  name: string;
  selectionType?: string;
  circleParams?: {
    center: [number, number];
    radiusKm: number;
  };
}

export interface ClimateDataPoint {
  lat: number;
  lon: number;
  value: number;
  timestamp: string;
}

export interface HeatIslandVulnerability {
  currentRisk: number;
  factors: {
    temperature: number;
    vegetation: number;
    construction: number;
    population: number;
  };
}

export interface HeatIslandPrediction {
  timeframe: string;
  value: number;
}

export interface RegionStats {
  [key: string]: {
    min: number;
    max: number;
    mean: number;
    count: number;
  };
}
