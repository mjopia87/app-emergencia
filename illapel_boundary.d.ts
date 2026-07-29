// Límite territorial de Illapel (TypeScript)

interface IllapelBoundary {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    properties: {
      FID: string;
      región: string;
      comuna: string;
      provincia: string;
      ine: string;
      área: string;
    };
    geometry: {
      type: 'Polygon';
      coordinates: number[][][];
    };
  }>;
}

interface IllapelInfo {
  nombre: string;
  región: string;
  provincia: string;
  ine: number;
  puntos: number;
}

// Importa desde: import { ILLAPEL_BOUNDARY, ILLAPEL_INFO } from './illapel_boundary';
