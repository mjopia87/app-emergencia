# Plan de Mejoras - APP Emergencia Illapel
## Integración QGIS y Territorio

**Fecha**: Julio 2026  
**Versión**: 1.0  
**Estado**: Propuesta

---

## 1. DIAGNÓSTICO ACTUAL

### Fortalezas
- ✅ App funciona completamente offline
- ✅ Sincronización automática de datos
- ✅ Interfaz intuitiva y rápida
- ✅ Gestión integral de emergencias, beneficiarios, equipos y recursos
- ✅ Historial y bitácora detallada

### Brechas Identificadas
- ❌ Sin visualización geográfica de casos y equipos
- ❌ Sin integración cartográfica (QGIS)
- ❌ Sin seguimiento de rutas/desplazamientos de equipos
- ❌ Información territorial limitada a texto ("Sector")
- ❌ Sin análisis espacial de distribución de ayudas
- ❌ Difícil ver concentración de emergencias por zona

---

## 2. OBJETIVOS

### Objetivo General
Integrar capacidades geoespaciales con QGIS para optimizar la respuesta a emergencias mediante visualización territorial, seguimiento de equipos en tiempo real y análisis de distribución de recursos.

### Objetivos Específicos
1. **Visualizar** ubicación de emergencias, beneficiarios y equipos en un mapa interactivo
2. **Integrar** datos de QGIS (capas: calles, sectores, puntos de acopio, rutas)
3. **Rastrear** movimiento de equipos en terreno y registrar rutas
4. **Analizar** distribución espacial de ayudas y cobertura de equipos
5. **Mejorar** bitácora con registros geolocalizados

---

## 3. ALCANCE DEL PROYECTO

### Fase 1: Mapeo Básico (Semana 1-2)
- [x] Crear módulo de mapa interactivo (Leaflet.js)
- [x] Integrar capa base de QGIS con WMS (Web Map Service)
- [x] Mostrar emergencias como puntos en mapa
- [x] Mostrar equipos como iconos con estado
- [x] Filtros por urgencia y estado

### Fase 2: Geolocalización y Seguimiento (Semana 3-4)
- [ ] Captura de GPS para ubicación de equipos
- [ ] Historial de posiciones (bitácora geoespacial)
- [ ] Cálculo de distancias a emergencias
- [ ] Rutas sugeridas (integración con Open Route Service)
- [ ] Heatmap de emergencias por sector

### Fase 3: Análisis Territorial (Semana 5-6)
- [ ] Reporte de cobertura por sector
- [ ] Distribución espacial de ayudas entregadas
- [ ] Zona de influencia de equipos (buffer analysis)
- [ ] Exportación de capas a QGIS Desktop
- [ ] Análisis de accesibilidad

### Fase 4: Integración QGIS Avanzada (Semana 7-8)
- [ ] Sincronización bidireccional con QGIS Server
- [ ] Edición de límites de sectores desde app
- [ ] Importación de shapefiles de QGIS
- [ ] Permisos por sector/usuario
- [ ] Auditoría geoespacial

---

## 4. REQUERIMIENTOS TÉCNICOS

### Datos de QGIS Necesarios
```
Capas Requeridas:
├── Límites administrativos (sectores/barrios)
├── Red vial (calles principales)
├── Puntos críticos (hospitales, centros de acopio)
├── Zonas de riesgo (si aplica)
└── Puntos de referencia (escuelas, plazas)
```

### Stack Tecnológico

| Componente | Actual | Propuesto | Razón |
|-----------|--------|-----------|-------|
| Mapas | Ninguno | Leaflet.js + OpenStreetMap | Lightweight, offline-capable |
| Capas QGIS | N/A | GeoServer WMS | Estándar, integración QGIS |
| Geolocalización | N/A | Geolocation API + GPS | Nativo, sin dependencias |
| Análisis Spatial | N/A | Turf.js | Análisis ligero en browser |
| Almacenamiento | localStorage | IndexedDB (mejorado) | Mayor capacidad para datos geo |
| Sincronización | JSON | GeoJSON | Formato estándar geo |

### Dependencias a Agregar
```html
<!-- Mapas -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Análisis espacial -->
<script src="https://unpkg.com/@turf/turf@6/turf.min.js"></script>

<!-- Proyecciones cartográficas -->
<script src="https://unpkg.com/proj4@2.9.2/dist/proj4.js"></script>

<!-- Descarga GeoJSON -->
<script src="https://unpkg.com/file-saver@2.0.5/dist/FileSaver.min.js"></script>
```

---

## 5. ARQUITECTURA DE SOLUCIÓN

### Estructura de Datos Mejorada

#### Emergencias (Actual → Mejorado)
```javascript
// ACTUAL
{
  id: "001",
  nombre: "Juan Pérez",
  tipo: "Terremoto",
  sector: "Centro"  // ← Solo texto
}

// MEJORADO
{
  id: "001",
  nombre: "Juan Pérez",
  tipo: "Terremoto",
  sector: "Centro",
  ubicacion: {
    lat: -31.8215,
    lon: -71.1722,
    direccion: "Calle Las Heras 456, Centro"
  },
  timestamp: "2026-07-25T14:30:00Z",
  ruta: [                    // Nueva: historial de posición
    {lat: -31.82, lon: -71.17, hora: "14:30"},
    {lat: -31.83, lon: -71.18, hora: "15:00"}
  ]
}
```

#### Equipos (Actual → Mejorado)
```javascript
// MEJORADO
{
  id: "AM-001",
  tipo: "Ambulancia",
  lider: "Carlos López",
  sector: "Centro",
  posicion: {                 // Nueva
    lat: -31.8215,
    lon: -71.1722,
    timestamp: "2026-07-25T14:35:00Z"
  },
  ruta_diaria: [...],        // Nueva: movimientos del día
  radio_cobertura: 2000      // Nueva: en metros
}
```

#### Bitácora Mejorada
```javascript
{
  id: "REG-001",
  tipo: "Asignación",
  timestamp: "2026-07-25T14:30:00Z",
  usuario: "Op-01",
  ubicacion: {lat, lon},     // Nueva
  evento: "Equipo AM-001 enviado a emergencia",
  distancia: "2.3 km",       // Nueva: calculada
  referencia_emergencia: "EM-001"
}
```

---

## 6. MÓDULOS A DESARROLLAR

### Módulo 1: Visor de Mapas
**Archivo**: `modules/map-viewer.js`

```javascript
Features:
├── Mapa interactivo Leaflet
├── Capas QGIS como WMS
├── Carusel de capas (activar/desactivar)
├── Búsqueda geográfica (dirección, sector)
├── Zoom a ubicación actual
├── Controles de herramientas (zoom, pan, medida)
└── Exportar vista como imagen
```

### Módulo 2: Rastreador de Equipos
**Archivo**: `modules/equipment-tracker.js`

```javascript
Features:
├── Posición actual con GPS
├── Historial de movimiento (últimas 24h)
├── Velocidad y dirección
├── Distancia a emergencias cercanas
├── ETA calculado
└── Alertas de proximidad (<500m)
```

### Módulo 3: Análisis Territorial
**Archivo**: `modules/spatial-analysis.js`

```javascript
Features:
├── Heatmap de emergencias
├── Cobertura de equipos por sector
├── Distribución de ayudas (mapa de egresos)
├── Matriz origen-destino (emergencia → equipo)
├── Accesibilidad y tiempo de respuesta
└── Reportes geoespaciales
```

### Módulo 4: Integración QGIS
**Archivo**: `modules/qgis-connector.js`

```javascript
Features:
├── Conexión a GeoServer/QGIS Server
├── Carga de capas WMS
├── Importar shapefiles
├── Sincronización de datos
├── Control de permisos por capa
└── Exportación a formato QGIS
```

---

## 7. CAMBIOS EN INTERFAZ

### Nueva Pestaña: "Mapa de Emergencia"
```
┌─────────────────────────────────────────────┐
│ Dashboard | Centro | Beneficiarios | ...   │
│          📍 MAPA  | Reportes                │
├─────────────────────────────────────────────┤
│                                             │
│         [MAPA INTERACTIVO]                 │
│         - Emergencias: 🔴                  │
│         - Equipos: 🚗                      │
│         - Beneficiarios: 👥                │
│                                             │
│  Layers:    ☑ Emergencias                  │
│             ☑ Equipos                      │
│             ☑ Beneficiarios                │
│             ☑ Sectores (QGIS)              │
│             ☑ Calles (QGIS)                │
│                                             │
│  Filtros:   [Por Urgencia ▼] [Por Equipo ▼]
│                                             │
│  Detalles:  [Mostrar en lista]              │
└─────────────────────────────────────────────┘
```

### Mejora: Paneles Laterales
```
Lado Izquierdo: Capas de QGIS (árbol expandible)
Lado Derecho: Detalles de elemento seleccionado
Inferior: Info de distancia y ETA
```

---

## 8. FLUJOS DE TRABAJO MEJORADOS

### Flujo: Despacho de Equipo Optimizado
```
1. Emergencia ingresa al sistema
   ↓
2. Sistema muestra en mapa
   ↓
3. Operador selecciona equipo más cercano
   ↓
4. Sistema calcula distancia, ruta y ETA
   ↓
5. Asigna y notifica al equipo
   ↓
6. Equipo actualiza posición en mapa
   ↓
7. Bitácora registra: hora, distancia, ruta
   ↓
8. Reporte: tiempo de respuesta por sector
```

### Flujo: Análisis de Cobertura
```
1. Operador abre "Análisis Territorial"
   ↓
2. Selecciona: [Tipo de análisis ▼] → Cobertura por Sector
   ↓
3. Sistema calcula:
   - Radio de cobertura de cada equipo
   - Zonas sin cobertura
   - Tiempo de respuesta por sector
   ↓
4. Visualiza en mapa (color: rojo=sin cobertura, verde=óptima)
   ↓
5. Exporta reporte en PDF o QGIS
```

---

## 9. INTEGRACIÓN CON QGIS PASO A PASO

### Paso 1: Preparar GeoServer
```bash
# Instalación de GeoServer (local o servidor)
1. Descargar GeoServer desde geoserver.org
2. Instalar en servidor local/remoto
3. Crear workspace "emergencias"
4. Importar capas:
   - Límites de sectores
   - Red vial
   - Puntos de interés
5. Publicar como WMS
   URL: http://servidor:8080/geoserver/wms
```

### Paso 2: Configurar en APP
```javascript
// En config.js
const QGIS_CONFIG = {
  wmsUrl: 'http://localhost:8080/geoserver/wms',
  layers: {
    sectores: 'emergencias:sectores',
    calles: 'emergencias:calles',
    puntos: 'emergencias:puntos_criticos'
  },
  bounds: [[-31.83, -71.18], [-31.82, -71.17]]
};
```

### Paso 3: Sincronización de Datos
```
APP → GeoJSON (actualización cada 10s)
      ↓
GeoServer (recibe features de emergencias)
      ↓
QGIS Desktop (se actualiza automáticamente)
```

---

## 10. PLAN DE IMPLEMENTACIÓN

### Timeline Estimado: 8 Semanas

| Semana | Fase | Tareas | Entregables |
|--------|------|--------|-------------|
| 1-2 | Mapeo Básico | Visor Leaflet, WMS QGIS, puntos emergencias | `map-viewer.js` + Demo |
| 3-4 | Geolocalización | GPS, historial rutas, cálculo distancias | `equipment-tracker.js` + Bitácora geo |
| 5-6 | Análisis | Heatmaps, reportes territoriales | `spatial-analysis.js` + Reportes |
| 7-8 | Integración QGIS | Sync bidireccional, permisos, auditoría | Integración completa + Docs |

### Equipo Requerido
- 1 Frontend Developer (JavaScript/Leaflet)
- 1 GIS Specialist (QGIS/GeoServer)
- 1 QA (pruebas offline, GPS)
- 1 DevOps (servidor QGIS, sincronización)

### Recursos
- Servidor para GeoServer (local o cloud)
- Datos QGIS de Illapel (shapefiles actualizados)
- Acceso GPS en dispositivos operacionales
- 5GB almacenamiento adicional (IndexedDB)

---

## 11. RIESGOS Y MITIGACIÓN

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| Conexión GPS inestable | Alto | Caché de posiciones, fallback a manual |
| GeoServer offline | Alto | Sincronización local, capas offline en Leaflet |
| Datos QGIS desactualizados | Medio | Validar datos antes, proceso de actualización |
| Performance con muchos puntos | Medio | Clustering, lazy-load, caché espacial |
| Compatibilidad navegador viejo | Bajo | Polyfills, versión legacy sin mapas |

---

## 12. CRITERIOS DE ÉXITO

✅ Mapa funciona offline y con conexión  
✅ Visualización de emergencias en <2s  
✅ GPS actualiza posición cada 30s  
✅ Análisis de cobertura con <5% error  
✅ Sincronización QGIS bidireccional  
✅ Sin degradación de performance con 500+ registros  
✅ Bitácora registra 100% de eventos geoespaciales  
✅ Usuarios entrenan en <30 min  

---

## 13. PRESUPUESTO APROXIMADO

| Item | Costo | Notas |
|------|-------|-------|
| GeoServer (setup + licencia) | $0-2000 | Open source, hosting variable |
| Desarrollo (320 horas @ $25/h) | $8000 | Depende equipo local |
| Datos SIG actualizados | $500-1000 | Municipalidad puede aportar |
| Servidor hosting | $100-300/mes | O usar servidor municipal |
| Capacitación | $1000 | Documentos + sesiones online |
| **TOTAL** | **$10,600 - $12,300** | Primera fase |

---

## 14. PRÓXIMOS PASOS

### Esta Semana
- [ ] Validar disponibilidad de datos QGIS con municipalidad
- [ ] Identificar servidor para GeoServer
- [ ] Conseguir acceso GPS en dispositivos

### Semana Próxima
- [ ] Iniciar desarrollo Módulo 1 (Visor de Mapas)
- [ ] Configurar ambiente de desarrollo
- [ ] Primera prueba de WMS

### Hito Mes 1
- [ ] Demostración funcional de mapa con emergencias
- [ ] Aprobación de interfaz con usuarios

---

## 15. DOCUMENTACIÓN NECESARIA

Se creará:
- `SETUP_GEOSERVER.md` - Instalación y configuración
- `API_GEOESPACIAL.md` - Referencia técnica para desarrolladores
- `USUARIO_MANUAL_MAPAS.md` - Guía para operadores
- `SINCRONIZACION_QGIS.md` - Procedimientos de sincronización
- `TROUBLESHOOTING_GIS.md` - Solución de problemas

---

## 16. CONSIDERACIONES NORMATIVAS

- ✓ Cumple RGPD (datos personales en dispositivo local)
- ✓ Auditoría completa con timestamp y usuario
- ✓ Sin envío de datos a terceros sin consentimiento
- ✓ Backup y recuperación ante desastres
- ✓ Permisos por rol/sector (future work)

---

**Aprobado por**: [Pendiente]  
**Fecha Inicio**: [A confirmar]  
**Contacto**: jopia.miguel@gmail.com
