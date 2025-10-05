declare module 'leaflet' {
  export interface LatLngBoundsExpression {
    [index: number]: [number, number];
  }
}

declare module 'react-leaflet' {
  import { ComponentType } from 'react';
  import { LatLngBoundsExpression } from 'leaflet';

  export interface MapContainerProps {
    center: [number, number];
    zoom: number;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export interface TileLayerProps {
    url: string;
    attribution?: string;
  }

  export interface CircleProps {
    center: [number, number];
    radius: number;
    pathOptions?: {
      color: string;
      fillColor: string;
      fillOpacity: number;
    };
  }

  export interface RectangleProps {
    bounds: LatLngBoundsExpression;
    pathOptions?: {
      color: string;
      fillColor: string;
      fillOpacity: number;
    };
  }

  export const MapContainer: ComponentType<MapContainerProps>;
  export const TileLayer: ComponentType<TileLayerProps>;
  export const Circle: ComponentType<CircleProps>;
  export const Rectangle: ComponentType<RectangleProps>;
  export const useMapEvents: (events: any) => void;
}