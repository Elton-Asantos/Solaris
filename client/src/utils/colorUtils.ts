/**
 * SOLARIS - Color Utilities
 * Funções para mapear valores numéricos para cores (heatmap)
 */

export interface ColorRange {
  min: number;
  max: number;
  color: string;
  label: string;
}

/**
 * Escalas de cores pré-definidas para cada variável
 */
export const COLOR_SCALES: Record<string, ColorRange[]> = {
  LST: [
    { min: -Infinity, max: 20, color: '#0000FF', label: 'Muito Frio' },
    { min: 20, max: 25, color: '#00BFFF', label: 'Frio' },
    { min: 25, max: 30, color: '#00FF00', label: 'Normal' },
    { min: 30, max: 35, color: '#FFFF00', label: 'Morno' },
    { min: 35, max: 40, color: '#FFA500', label: 'Quente' },
    { min: 40, max: 45, color: '#FF4500', label: 'Muito Quente' },
    { min: 45, max: Infinity, color: '#FF0000', label: 'Ilha de Calor!' },
  ],
  NDVI: [
    { min: -1, max: -0.5, color: '#8B4513', label: 'Solo Exposto' },
    { min: -0.5, max: 0, color: '#D2691E', label: 'Baixa Vegetação' },
    { min: 0, max: 0.2, color: '#F4A460', label: 'Vegetação Esparsa' },
    { min: 0.2, max: 0.4, color: '#ADFF2F', label: 'Vegetação Moderada' },
    { min: 0.4, max: 0.6, color: '#32CD32', label: 'Vegetação Densa' },
    { min: 0.6, max: 0.8, color: '#228B22', label: 'Vegetação Muito Densa' },
    { min: 0.8, max: 1, color: '#006400', label: 'Floresta' },
  ],
  NDBI: [
    { min: -1, max: -0.5, color: '#00FF00', label: 'Área Natural' },
    { min: -0.5, max: -0.2, color: '#7FFF00', label: 'Pouca Construção' },
    { min: -0.2, max: 0, color: '#FFFF00', label: 'Construção Esparsa' },
    { min: 0, max: 0.2, color: '#FFA500', label: 'Área Urbana' },
    { min: 0.2, max: 0.4, color: '#FF6347', label: 'Área Muito Urbana' },
    { min: 0.4, max: 0.6, color: '#FF0000', label: 'Área Densamente Urbana' },
    { min: 0.6, max: 1, color: '#8B0000', label: 'Área Extremamente Urbana' },
  ],
  NDWI: [
    { min: -1, max: -0.5, color: '#8B4513', label: 'Solo Seco' },
    { min: -0.5, max: -0.2, color: '#D2B48C', label: 'Solo Úmido' },
    { min: -0.2, max: 0, color: '#F0E68C', label: 'Vegetação Úmida' },
    { min: 0, max: 0.2, color: '#ADD8E6', label: 'Água/Solo Úmido' },
    { min: 0.2, max: 0.4, color: '#87CEEB', label: 'Água Rasa' },
    { min: 0.4, max: 0.6, color: '#00BFFF', label: 'Água' },
    { min: 0.6, max: 1, color: '#0000FF', label: 'Água Profunda' },
  ],
  POP_DENS: [
    { min: 0, max: 100, color: '#FFFFCC', label: 'Muito Baixa' },
    { min: 100, max: 500, color: '#FFEDA0', label: 'Baixa' },
    { min: 500, max: 1000, color: '#FED976', label: 'Moderada' },
    { min: 1000, max: 2500, color: '#FEB24C', label: 'Alta' },
    { min: 2500, max: 5000, color: '#FD8D3C', label: 'Muito Alta' },
    { min: 5000, max: 10000, color: '#FC4E2A', label: 'Extremamente Alta' },
    { min: 10000, max: Infinity, color: '#E31A1C', label: 'Superpopulada' },
  ],
  NIGHT_LIGHTS: [
    { min: 0, max: 5, color: '#000033', label: 'Escuridão' },
    { min: 5, max: 15, color: '#000066', label: 'Muito Escuro' },
    { min: 15, max: 30, color: '#0000FF', label: 'Escuro' },
    { min: 30, max: 50, color: '#00FFFF', label: 'Iluminação Moderada' },
    { min: 50, max: 75, color: '#FFFF00', label: 'Bem Iluminado' },
    { min: 75, max: 100, color: '#FFA500', label: 'Muito Iluminado' },
    { min: 100, max: Infinity, color: '#FFFFFF', label: 'Extremamente Iluminado' },
  ],
};

/**
 * Obter cor para um valor específico de uma variável
 */
export function getColorForValue(variable: string, value: number): string {
  const scale = COLOR_SCALES[variable];
  
  if (!scale) {
    console.warn(`Escala de cores não encontrada para: ${variable}`);
    return '#808080'; // Cinza como fallback
  }
  
  for (const range of scale) {
    if (value >= range.min && value < range.max) {
      return range.color;
    }
  }
  
  // Fallback para última cor se valor exceder todos os ranges
  return scale[scale.length - 1].color;
}

/**
 * Interpolar entre duas cores (hex)
 */
export function interpolateColor(color1: string, color2: string, factor: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  
  if (!c1 || !c2) return color1;
  
  const r = Math.round(c1.r + factor * (c2.r - c1.r));
  const g = Math.round(c1.g + factor * (c2.g - c1.g));
  const b = Math.round(c1.b + factor * (c2.b - c1.b));
  
  return rgbToHex(r, g, b);
}

/**
 * Converter hex para RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

/**
 * Converter RGB para hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Gerar gradiente de cores para heatmap
 */
export function generateHeatmapGradient(variable: string): string[] {
  const scale = COLOR_SCALES[variable];
  if (!scale) return ['blue', 'cyan', 'lime', 'yellow', 'red'];
  
  // Retornar cores da escala
  return scale.map(range => range.color);
}

/**
 * Obter label para um valor
 */
export function getLabelForValue(variable: string, value: number): string {
  const scale = COLOR_SCALES[variable];
  
  if (!scale) return 'N/A';
  
  for (const range of scale) {
    if (value >= range.min && value < range.max) {
      return range.label;
    }
  }
  
  return scale[scale.length - 1].label;
}

/**
 * Obter unidade da variável
 */
export function getUnit(variable: string): string {
  const units: Record<string, string> = {
    LST: '°C',
    NDVI: '',
    NDBI: '',
    NDWI: '',
    POP_DENS: 'pessoas/km²',
    NIGHT_LIGHTS: 'nW/cm²/sr',
  };
  
  return units[variable] || '';
}

