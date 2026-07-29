/**
 * GIS Configuration for APP Emergencia
 * Configuración de capas QGIS, WMS y parámetros geoespaciales
 */

const GIS_CONFIG = {
  // Centro de mapa (Illapel, Chile)
  center: {
    lat: -31.63292,
    lng: -71.16737
  },

  // Nivel de zoom inicial
  initialZoom: 13,
  minZoom: 10,
  maxZoom: 18,

  // Bounds (límites de la ciudad)
  bounds: [
    [-31.85, -71.20],  // SW
    [-31.80, -71.15]   // NE
  ],

  // Configuración WMS de GeoServer/QGIS
  // Modificar según tu servidor QGIS
  qgis: {
    // URL del servidor GeoServer (local o remoto)
    wmsUrl: 'http://localhost:8080/geoserver/wms',
    wfsUrl: 'http://localhost:8080/geoserver/wfs',

    // Capas disponibles desde QGIS
    layers: {
      sectores: {
        name: '🏘️ Sectores',
        wmsLayer: 'emergencias:sectores',
        visible: true,
        opacity: 0.4,
        zIndex: 1
      },
      calles: {
        name: '🛣️ Calles',
        wmsLayer: 'emergencias:calles',
        visible: true,
        opacity: 0.6,
        zIndex: 2
      },
      puntos_criticos: {
        name: '⛑️ Puntos Críticos',
        wmsLayer: 'emergencias:puntos_criticos',
        visible: true,
        opacity: 0.8,
        zIndex: 3
      }
    },

    // Usar GeoServer en offline (local GeoJSON como fallback)
    offlineMode: true,
    fallbackGeojson: {
      sectores: null,  // Se cargará desde IndexedDB
      calles: null
    }
  },

  // Estilos de iconos para emergencias
  iconos: {
    emergencia: {
      critico: {
        color: '#e74c3c',    // Rojo
        icon: '🔴',
        size: [40, 40]
      },
      alto: {
        color: '#f39c12',     // Naranja
        icon: '🟠',
        size: [35, 35]
      },
      medio: {
        color: '#f1c40f',     // Amarillo
        icon: '🟡',
        size: [30, 30]
      },
      bajo: {
        color: '#27ae60',     // Verde
        icon: '🟢',
        size: [25, 25]
      }
    },

    equipos: {
      ambulancia: {
        icon: '🚑',
        size: [35, 35],
        color: '#e74c3c'
      },
      camion: {
        icon: '🚚',
        size: [35, 35],
        color: '#3498db'
      },
      rescate: {
        icon: '👨‍🚒',
        size: [35, 35],
        color: '#f39c12'
      },
      personal_medico: {
        icon: '👨‍⚕️',
        size: [35, 35],
        color: '#9b59b6'
      },
      voluntarios: {
        icon: '👥',
        size: [30, 30],
        color: '#1abc9c'
      }
    },

    beneficiario: {
      icon: '👤',
      size: [25, 25],
      color: '#95a5a6'
    }
  },

  // Estilos de popup
  popup: {
    maxWidth: 300,
    minWidth: 200,
    closeButton: true,
    autoClose: false
  },

  // Configuración de análisis espacial
  analisis: {
    // Radio de cobertura por tipo de equipo (metros)
    radioCoberturaEquipos: {
      ambulancia: 2000,
      camion: 3000,
      rescate: 2500,
      personal_medico: 1500,
      voluntarios: 1000
    },

    // Distancia máxima para alertar cercanía (metros)
    distanciaAlerta: 500,

    // Heatmap
    heatmapRadius: 25,
    heatmapBlur: 15
  },

  // Almacenamiento local (IndexedDB)
  storage: {
    dbName: 'AppEmergenciaGIS',
    version: 1,
    objectStores: {
      emergenciasGeo: 'emergenciasGeo',
      equiposGeo: 'equiposGeo',
      beneficiariesGeo: 'beneficiariesGeo',
      rutasEquipos: 'rutasEquipos',
      capasOffline: 'capasOffline'
    }
  },

  // GPS y geolocalización
  gps: {
    enableGPS: true,
    updateInterval: 30000,  // 30 segundos
    highAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
    recordRoute: true,
    maxHistoryPoints: 100
  },

  // Colores y temas
  theme: {
    primary: '#c41e3a',
    success: '#27ae60',
    warning: '#f39c12',
    danger: '#e74c3c',
    info: '#3498db'
  }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GIS_CONFIG;
}
