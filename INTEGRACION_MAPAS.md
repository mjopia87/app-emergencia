# Integración de Módulo de Mapas - APP Emergencia

## Archivos Creados

✅ `gis-config.js` - Configuración centralizada de GIS  
✅ `modules/map-viewer.js` - Módulo principal de visor de mapas  
✅ `modules/map-styles.css` - Estilos CSS para el mapa  

## Paso 1: Agregar Dependencias a app.html

### 1.1 Agregar librerías en el `<head>` (después de Leaflet)

```html
<!-- En app.html, línea ~9-10, agregar después de Leaflet: -->

<!-- Turf.js para análisis espacial -->
<script src="https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js"></script>

<!-- Leaflet Easy Button -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2.4.0/dist/easy-button.css" />
<script src="https://cdn.jsdelivr.net/npm/leaflet-easybutton@2.4.0/dist/easy-button.js"></script>

<!-- Font Awesome (para iconos en botones) -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

<!-- Estilos del módulo de mapas -->
<link rel="stylesheet" href="modules/map-styles.css" />
```

### 1.2 Cargar scripts en el `</body>` (antes del cierre de body)

```html
<!-- En app.html, antes de </body>, agregar: -->

<!-- Configuración GIS -->
<script src="gis-config.js"></script>

<!-- Módulo de mapas -->
<script src="modules/map-viewer.js"></script>

<!-- Script de inicialización (crear nuevo archivo o agregar función) -->
<script>
  // Se ejecuta cuando user hace login
  function initMapViewer() {
    const mapViewer = new MapViewer(GIS_CONFIG);
    mapViewer.init('map');
    window.mapViewerInstance = mapViewer;
  }
</script>
```

## Paso 2: Agregar Pestaña de Mapa al Sidebar

En app.html, buscar la sección de navegación (sidebar) y agregar:

```html
<!-- Agregar esto en el sidebar, por ejemplo después de Emergencias: -->
<div class="nav-item" onclick="showSection('mapa', this)">📍 Mapa</div>
```

## Paso 3: Agregar Sección HTML para el Mapa

En app.html, buscar `<div id="mainArea" class="main-area">` y agregar:

```html
<!-- Sección de mapa (agregar en main-area después de otras secciones) -->
<div id="mapa" class="section hidden">
  <div class="card">
    <div class="card-title">📍 Mapa de Emergencia - Situación en Terreno</div>
    
    <!-- Toolbar -->
    <div class="map-toolbar">
      <button class="map-btn" onclick="window.mapViewerInstance?.exportMapImage()">
        📸 Exportar Vista
      </button>
      <button class="map-btn" onclick="document.getElementById('mapFiltersPanel').classList.toggle('hidden')">
        🔍 Filtros
      </button>
      <button class="map-btn" onclick="window.mapViewerInstance?.map.fitBounds(window.mapViewerInstance?.config.bounds)">
        🏙️ Ver Todo
      </button>
    </div>

    <!-- Panel de Filtros -->
    <div id="mapFiltersPanel" class="map-filters-panel hidden">
      <div class="filters-row">
        <div class="filter-group">
          <label>Emergencias por Urgencia</label>
          <select onchange="window.mapViewerInstance?.setFiltro('emergencias', 'urgencia', this.value)">
            <option value="todos">Todas</option>
            <option value="critico">🔴 Crítico</option>
            <option value="alto">🟠 Alto</option>
            <option value="medio">🟡 Medio</option>
            <option value="bajo">🟢 Bajo</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Equipos por Tipo</label>
          <select onchange="window.mapViewerInstance?.setFiltro('equipos', 'tipo', this.value)">
            <option value="todos">Todos</option>
            <option value="Ambulancia">🚑 Ambulancia</option>
            <option value="Camión">🚚 Camión</option>
            <option value="Grupo Rescate">👨‍🚒 Rescate</option>
            <option value="Personal Médico">👨‍⚕️ Médico</option>
            <option value="Voluntarios">👥 Voluntarios</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Equipos por Estado</label>
          <select onchange="window.mapViewerInstance?.setFiltro('equipos', 'estado', this.value)">
            <option value="todos">Todos</option>
            <option value="activo">🟢 Activo</option>
            <option value="inactivo">⚪ Inactivo</option>
            <option value="mantenimiento">🟡 Mantenimiento</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Beneficiarios por Urgencia</label>
          <select onchange="window.mapViewerInstance?.setFiltro('beneficiarios', 'urgencia', this.value)">
            <option value="todos">Todos</option>
            <option value="critico">🔴 Crítico</option>
            <option value="alto">🟠 Alto</option>
            <option value="medio">🟡 Medio</option>
            <option value="bajo">🟢 Bajo</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Contenedor del mapa -->
    <div class="map-container">
      <div id="map" style="width: 100%; height: 500px; border-radius: 8px;"></div>
    </div>

    <!-- Panel de detalles (feature seleccionado) -->
    <div id="mapDetailsPanel" class="map-details-panel">
      <div class="details-header">
        <span id="detailsTitle">Detalles</span>
        <button class="details-close-btn" onclick="document.getElementById('mapDetailsPanel').classList.remove('active')">✕</button>
      </div>
      <div id="detailsContent"></div>
    </div>
  </div>
</div>
```

## Paso 4: Actualizar función de sincronización

Modificar las funciones que guardan emergencias, equipos, etc., para que disparen eventos:

```javascript
// Después de guardar emergencias en localStorage:
function saveEmergencias() {
  localStorage.setItem('emergencias', JSON.stringify(DB.emergencias));
  // ← Agregar esto:
  window.dispatchEvent(new CustomEvent('emergenciasUpdated', {
    detail: DB.emergencias
  }));
  // Si está activa la sección de mapa, re-renderizar
  if (window.mapViewerInstance) {
    window.mapViewerInstance.renderEmergencias(DB.emergencias);
  }
}

// Igual para equipos:
function saveEquipos() {
  localStorage.setItem('equipos', JSON.stringify(DB.equipos));
  window.dispatchEvent(new CustomEvent('equiposUpdated', {
    detail: DB.equipos
  }));
  if (window.mapViewerInstance) {
    window.mapViewerInstance.renderEquipos(DB.equipos);
  }
}

// Y para beneficiarios:
function saveBeneficiarios() {
  localStorage.setItem('beneficiaries', JSON.stringify(DB.beneficiarios));
  window.dispatchEvent(new CustomEvent('beneficiariesUpdated', {
    detail: DB.beneficiarios
  }));
  if (window.mapViewerInstance) {
    window.mapViewerInstance.renderBeneficiarios(DB.beneficiarios);
  }
}
```

## Paso 5: Agregar ubicación GPS al crear emergencias/equipos

En los formularios de emergencias y equipos, agregar:

```javascript
// En la función de crear emergencia:
async function addEmergencia() {
  const emergencia = {
    id: generateId(),
    nombre: document.getElementById('emergNombre').value,
    telefono: document.getElementById('emergTelefono').value,
    tipo: document.getElementById('emergTipo').value,
    urgencia: document.getElementById('emergUrgencia').value,
    ubicacion: document.getElementById('emergUbicacion').value,
    descripcion: document.getElementById('emergDescripcion').value,
    timestamp: new Date().toISOString(),
    // ← Agregar ubicación GPS automática:
    lat: null,
    lon: null,
    // Intentar obtener GPS
  };

  // Obtener GPS si está disponible
  if (navigator.geolocation && GIS_CONFIG.gps.enableGPS) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        emergencia.lat = position.coords.latitude;
        emergencia.lon = position.coords.longitude;
        emergencia.precisionMetros = Math.round(position.coords.accuracy);
        DB.emergencias.push(emergencia);
        saveEmergencias();
        showNotification('✅ Emergencia registrada con ubicación GPS');
      },
      (error) => {
        console.warn('GPS error:', error);
        // Permitir creación sin GPS
        emergencia.lat = GIS_CONFIG.center.lat;
        emergencia.lon = GIS_CONFIG.center.lng;
        DB.emergencias.push(emergencia);
        saveEmergencias();
        showNotification('✅ Emergencia registrada (sin GPS, ubic. por defecto)');
      },
      { timeout: 5000 }
    );
  } else {
    DB.emergencias.push(emergencia);
    saveEmergencias();
  }

  closeModal('addEmergencyModal');
}
```

## Paso 6: Función de listener para features seleccionados

Agregar a app.html:

```javascript
// Escuchar cuando se selecciona un feature en el mapa
window.addEventListener('mapFeatureSelected', (e) => {
  const { type, feature } = e.detail;
  const panel = document.getElementById('mapDetailsPanel');
  const titleEl = document.getElementById('detailsTitle');
  const contentEl = document.getElementById('detailsContent');

  let html = '';
  if (type === 'emergencia') {
    titleEl.textContent = `🔴 ${feature.tipo}`;
    html = `
      <div class="details-item">
        <span class="details-label">Nombre:</span>
        <span class="details-value">${feature.nombre}</span>
      </div>
      <div class="details-item">
        <span class="details-label">Teléfono:</span>
        <span class="details-value">${feature.telefono}</span>
      </div>
      <div class="details-item">
        <span class="details-label">Ubicación:</span>
        <span class="details-value">${feature.ubicacion}</span>
      </div>
      <div class="details-item">
        <span class="details-label">Urgencia:</span>
        <span class="details-value">${feature.urgencia}</span>
      </div>
      <div class="details-item">
        <span class="details-label">Descripción:</span>
        <span class="details-value">${feature.descripcion}</span>
      </div>
    `;
  } else if (type === 'equipo') {
    titleEl.textContent = `🚗 ${feature.tipo}`;
    html = `
      <div class="details-item">
        <span class="details-label">Estado:</span>
        <span class="details-value">${feature.estado}</span>
      </div>
      <div class="details-item">
        <span class="details-label">Líder:</span>
        <span class="details-value">${feature.lider}</span>
      </div>
      <div class="details-item">
        <span class="details-label">Contacto:</span>
        <span class="details-value">${feature.telefono}</span>
      </div>
      <div class="details-item">
        <span class="details-label">Tarea Actual:</span>
        <span class="details-value">${feature.tarea || 'Disponible'}</span>
      </div>
      <div class="details-item">
        <span class="details-label">Personal:</span>
        <span class="details-value">${feature.personal || '-'} personas</span>
      </div>
    `;
  }

  contentEl.innerHTML = html;
  panel.classList.add('active');
});
```

## Paso 7: Configurar GeoServer (opcional para QGIS integration)

Si quieres integrar capas QGIS reales:

1. Instalar GeoServer: http://geoserver.org
2. Crear workspace "emergencias"
3. Importar shapefiles de Illapel
4. Publicar como WMS en: `http://localhost:8080/geoserver/wms`
5. Actualizar `gis-config.js` con la URL correcta

Para modo offline (sin GeoServer), dejar `offlineMode: true` en `gis-config.js`.

## Verificación

✅ Todos los scripts cargados  
✅ Mapa visible en pestaña "Mapa"  
✅ Emergencias visibles como puntos rojo/naranja/amarillo/verde  
✅ Equipos visibles con iconos de tipo  
✅ Filtros funcionando  
✅ Click en marcadores muestra detalles  
✅ GPS captura ubicación (si disponible)  

## Troubleshooting

**Mapa no aparece:**
- Verificar que `<div id="map">` existe en HTML
- Verificar altura del contenedor (min 300px recomendado)
- Abrir console (F12) y buscar errores

**Marcadores no aparecen:**
- Verificar que emergencias/equipos tienen lat/lon
- Verificar console para warnings

**Filters no funcionan:**
- Verificar que `window.mapViewerInstance` existe
- Recargar página después de agregar nuevos datos

**GPS no funciona:**
- Necesita HTTPS en producción
- Verificar permisos del navegador
- En localhost funciona sin HTTPS

## Próximos pasos

- Fase 2: Geolocalización y seguimiento de rutas
- Fase 3: Análisis territorial (heatmaps, cobertura)
- Fase 4: Sincronización QGIS bidireccional
