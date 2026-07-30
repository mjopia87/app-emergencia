/**
 * Map Viewer Module - APP Emergencia
 * Módulo interactivo de mapas con Leaflet
 * Features: emergencias, equipos, beneficiarios, capas QGIS
 */

class MapViewer {
  constructor(config = GIS_CONFIG) {
    this.config = config;
    this.map = null;
    this.layers = {
      emergencias: null,
      equipos: null,
      beneficiarios: null,
      actividadesEquipo: null,
      moviles: null,
      actividadesMovil: null,
      wmsLayers: {}
    };
    this.filtros = {
      emergencias: {
        urgencia: 'todos',  // todos, critico, alto, medio, bajo
      },
      equipos: {
        tipo: 'todos',      // todos, ambulancia, camion, etc
        estado: 'todos'     // todos, activo, inactivo, mantenimiento
      },
      beneficiarios: {
        urgencia: 'todos'
      },
      moviles: {
        tipo: 'todos',      // todos, Auto, Camioneta, Maquinaria, Torreta, Generador
        estado: 'todos'
      }
    };
    this.marcadores = {
      emergencias: new Map(),
      equipos: new Map(),
      beneficiarios: new Map(),
      actividadesEquipo: new Map(),
      moviles: new Map(),
      actividadesMovil: new Map()
    };
    this.selectedFeature = null;
    this.heatmapLayer = null;
  }

  /**
   * Inicializar mapa
   */
  init(containerId = 'map') {
    console.log('🗺️ Inicializando MapViewer...');

    // Si ya hay un mapa, no crear uno nuevo
    if (this.map) {
      console.log('✅ MapViewer usando mapa existente');
    } else {
      // Crear mapa Leaflet
      this.map = L.map(containerId).setView(
        [this.config.center.lat, this.config.center.lng],
        this.config.initialZoom
      );

      // Agregar capa base satelital (Esri WorldImagery)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri, DigitalGlobe, Earthstar Geographics',
        maxZoom: this.config.maxZoom,
        minZoom: this.config.minZoom
      }).addTo(this.map);
    }

    // Crear capas (group layers para toggle) solo si no existen
    if (!this.layers.emergencias) {
      this.layers.emergencias = L.featureGroup().addTo(this.map);
    }
    if (!this.layers.equipos) {
      this.layers.equipos = L.featureGroup().addTo(this.map);
    }
    if (!this.layers.beneficiarios) {
      this.layers.beneficiarios = L.featureGroup().addTo(this.map);
    }
    if (!this.layers.actividadesEquipo) {
      this.layers.actividadesEquipo = L.featureGroup().addTo(this.map);
    }
    if (!this.layers.moviles) {
      this.layers.moviles = L.featureGroup().addTo(this.map);
    }
    if (!this.layers.actividadesMovil) {
      this.layers.actividadesMovil = L.featureGroup().addTo(this.map);
    }

    // Event listeners
    this._setupEventListeners();

    console.log('✅ MapViewer inicializado correctamente');
  }

  /**
   * Configurar controles del mapa
   */
  _setupControls() {
    // Control de zoom (integrado)
    L.control.zoom({ position: 'topright' }).addTo(this.map);

    // Control de capas
    this._setupLayerControl();

    // Escala
    L.control.scale({ position: 'bottomleft' }).addTo(this.map);

    // Geolocación
    if (this.config.gps.enableGPS) {
      this._setupGPSControl();
    }
  }

  /**
   * Control de capas (toggle on/off)
   */
  _setupLayerControl() {
    const layerControl = L.control.layers(
      {},
      {
        '🔴 Emergencias': this.layers.emergencias,
        '🚗 Equipos': this.layers.equipos,
        '👥 Beneficiarios': this.layers.beneficiarios
      },
      { position: 'topright', collapsed: false }
    ).addTo(this.map);

    // Guardar referencia para actualizar later
    this.layerControl = layerControl;
  }

  /**
   * Control GPS (botón de geolocación)
   */
  _setupGPSControl() {
    const gpsButton = L.easyButton(
      'fa-location-arrow',
      () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              this.map.setView([lat, lng], 15);

              // Marcar posición actual
              L.circleMarker([lat, lng], {
                radius: 8,
                fillColor: '#3498db',
                color: '#2980b9',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8,
                zIndex: 1000
              }).addTo(this.map).bindPopup('Tu ubicación actual');
            },
            (error) => {
              console.warn('GPS error:', error);
              alert('No se pudo obtener la ubicación. Verifica permisos GPS.');
            }
          );
        }
      }
    );
    gpsButton.addTo(this.map);
  }

  /**
   * Cargar capas WMS de QGIS
   */
  _loadQGISLayers() {
    console.log('📡 Cargando capas QGIS...');

    if (this.config.qgis.offlineMode) {
      console.log('🔌 Modo offline: usando GeoJSON local');
      // En producción, cargar capas offline desde IndexedDB
      return;
    }

    // Intentar conectar a GeoServer
    try {
      for (const [key, layer] of Object.entries(this.config.qgis.layers)) {
        if (!layer.visible) continue;

        const wmsLayer = L.tileLayer.wms(this.config.qgis.wmsUrl, {
          layers: layer.wmsLayer,
          format: 'image/png',
          transparent: true,
          opacity: layer.opacity,
          version: '1.1.0'
        });

        this.layers.wmsLayers[key] = wmsLayer;

        // Agregar al mapa si está visible
        if (layer.visible) {
          wmsLayer.addTo(this.map);
        }

        console.log(`✅ Capa WMS cargada: ${layer.name}`);
      }
    } catch (error) {
      console.warn('⚠️ No se pudieron cargar capas WMS:', error);
    }
  }

  /**
   * Cargar datos del localStorage y renderizar
   */
  _loadDataFromLocalStorage() {
    console.log('💾 Cargando datos locales...');

    // Cargar emergencias
    const emergenciasData = JSON.parse(localStorage.getItem('emergencias')) || [];
    this.renderEmergencias(emergenciasData);

    // Cargar equipos
    const equiposData = JSON.parse(localStorage.getItem('equipos')) || [];
    this.renderEquipos(equiposData);

    // Cargar beneficiarios
    const beneficiariesData = JSON.parse(localStorage.getItem('beneficiaries')) || [];
    this.renderBeneficiarios(beneficiariesData);

    console.log(`✅ Datos cargados: ${emergenciasData.length} emergencias, ${equiposData.length} equipos`);
  }

  /**
   * Renderizar emergencias en el mapa
   */
  renderEmergencias(emergencias) {
    // Limpiar marcadores anteriores
    this.layers.emergencias.clearLayers();
    this.marcadores.emergencias.clear();

    emergencias.forEach((emergencia) => {
      // Saltar si no tiene ubicación
      if (!emergencia.lat || !emergencia.lon) {
        console.warn('Emergencia sin coordenadas:', emergencia.id);
        return;
      }

      // Aplicar filtros
      if (this.filtros.emergencias.urgencia !== 'todos' &&
          emergencia.urgencia !== this.filtros.emergencias.urgencia) {
        return;
      }

      // Obtener estilo según urgencia
      const urgencia = emergencia.urgencia || 'bajo';
      const iconConfig = this.config.iconos.emergencia[urgencia] || this.config.iconos.emergencia.bajo;
      const atendido = emergencia.estadoAtencion === 'atendido';

      // Si el requerimiento ya fue atendido, el marcador se transforma en un ticket
      const iconoHtml = atendido
        ? `<div style="font-size: ${iconConfig.size[0]}px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); filter: grayscale(35%); opacity:0.85;">🎫</div>`
        : `<div style="font-size: ${iconConfig.size[0]}px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">${iconConfig.icon}</div>`;

      // Crear marcador
      const marker = L.marker([emergencia.lat, emergencia.lon], {
        icon: L.divIcon({
          html: iconoHtml,
          iconSize: [40, 40],
          className: 'emergency-marker'
        }),
        zIndex: atendido ? 50 : 100
      }).addTo(this.layers.emergencias);

      // Popup con información
      const popupContent = this._createEmergenciaPopup(emergencia);
      marker.bindPopup(popupContent, this.config.popup);

      // Guardar referencia
      this.marcadores.emergencias.set(emergencia.id, marker);

      // Click para seleccionar
      marker.on('click', () => this._selectFeature('emergencia', emergencia));
    });

    console.log(`✅ ${this.marcadores.emergencias.size} emergencias renderizadas`);
  }

  /**
   * Renderizar equipos en el mapa
   */
  renderEquipos(equipos) {
    this.layers.equipos.clearLayers();
    this.marcadores.equipos.clear();

    let equiposRenderizados = 0;
    console.log(`🔍 Filtrando equipos con tipo: "${this.filtros.equipos.tipo}"`);

    // Función normalizar
    const normalizar = (str) => {
      return str.toLowerCase()
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u');
    };

    equipos.forEach((equipo) => {
      // Saltar si no tiene ubicación
      if (!equipo.lat || !equipo.lon) {
        return;
      }

      // Aplicar filtro de tipo PRIMERO (antes de cualquier otra lógica)
      if (this.filtros.equipos.tipo !== 'todos') {
        const equipoTipo = (equipo.tipo || '').trim();
        const filtroTipo = (this.filtros.equipos.tipo || '').trim();
        const equipoNorm = normalizar(equipoTipo);
        const filtroNorm = normalizar(filtroTipo);

        console.log(`  Equipo: "${equipoTipo}" (${equipoNorm}) vs Filtro: "${filtroTipo}" (${filtroNorm})`);

        if (equipoNorm !== filtroNorm) {
          console.log(`    ❌ No coincide, saltando`);
          return; // SALIR AQUÍ - no continuar con el equipo
        }
      }

      // Obtener icono según tipo de equipo nuevo
      const tipoLower = equipo.tipo?.toLowerCase() || 'otros';
      let iconConfig = { icon: '📌', size: [30, 30], color: '#3498db' };

      if (tipoLower.includes('entrega')) {
        iconConfig = { icon: '📦', size: [30, 30], color: '#27ae60' };
      } else if (tipoLower.includes('eléc') || tipoLower.includes('electr')) {
        iconConfig = { icon: '⚡', size: [30, 30], color: '#f39c12' };
      } else if (tipoLower.includes('poda')) {
        iconConfig = { icon: '✂️', size: [30, 30], color: '#e67e22' };
      } else if (tipoLower.includes('sac')) {
        iconConfig = { icon: '🚗', size: [30, 30], color: '#3498db' };
      } else if (tipoLower.includes('maquinar')) {
        iconConfig = { icon: '🏗️', size: [30, 30], color: '#95a5a6' };
      }

      // Color según estado
      let estadoColor = '#27ae60';
      if (equipo.estado === 'inactivo') estadoColor = '#95a5a6';
      if (equipo.estado === 'mantenimiento') estadoColor = '#e67e22';

      // Crear marcador
      const marker = L.marker([equipo.lat, equipo.lon], {
        icon: L.divIcon({
          html: `<div style="font-size: ${iconConfig.size[0]}px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); filter: brightness(1.2); display:flex; align-items:center; justify-content:center;">${iconConfig.icon}</div>`,
          iconSize: iconConfig.size,
          iconAnchor: [iconConfig.size[0] / 2, iconConfig.size[1] / 2],
          className: 'equipment-marker'
        }),
        zIndex: 200
      }).addTo(this.layers.equipos);

      // Agregar círculo de cobertura
      const radioCobertura = this.config.analisis.radioCoberturaEquipos[tipoLower] || 2000;
      L.circle([equipo.lat, equipo.lon], {
        radius: radioCobertura,
        color: estadoColor,
        weight: 1,
        opacity: 0.2,
        fillOpacity: 0.05,
        dashArray: '5, 5'
      }).addTo(this.layers.equipos);

      // Popup
      const popupContent = this._createEquipoPopup(equipo);
      marker.bindPopup(popupContent, this.config.popup);

      // Guardar referencia
      this.marcadores.equipos.set(equipo.id, marker);

      // Click
      marker.on('click', () => this._selectFeature('equipo', equipo));
    });

    console.log(`✅ ${this.marcadores.equipos.size} equipos renderizados en el mapa`);
  }

  /**
   * Renderizar beneficiarios en el mapa
   */
  renderBeneficiarios(beneficiarios) {
    this.layers.beneficiarios.clearLayers();
    this.marcadores.beneficiarios.clear();

    beneficiarios.forEach((beneficiary) => {
      if (!beneficiary.lat || !beneficiary.lon) {
        return;
      }

      if (this.filtros.beneficiarios.urgencia !== 'todos' &&
          beneficiary.urgencia !== this.filtros.beneficiarios.urgencia) {
        return;
      }

      // Obtener color según urgencia
      const urgenciaColors = {
        critico: '#e74c3c',  // Rojo
        medio: '#f1c40f',    // Amarillo
        bajo: '#27ae60'      // Verde
      };
      const color = urgenciaColors[beneficiary.urgencia] || '#95a5a6';

      // Crear SVG de cruz
      const svgCruz = `
        <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
          <!-- Fondo circular -->
          <circle cx="15" cy="15" r="14" fill="white" stroke="${color}" stroke-width="2"/>
          <!-- Cruz -->
          <line x1="15" y1="5" x2="15" y2="25" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
          <line x1="5" y1="15" x2="25" y2="15" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
        </svg>
      `;

      const marker = L.marker([beneficiary.lat, beneficiary.lon], {
        icon: L.divIcon({
          html: svgCruz,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          className: 'beneficiary-marker'
        }),
        zIndex: 50
      }).addTo(this.layers.beneficiarios);

      const popupContent = this._createBeneficiarioPopup(beneficiary);
      marker.bindPopup(popupContent, this.config.popup);

      this.marcadores.beneficiarios.set(beneficiary.id, marker);
      marker.on('click', () => this._selectFeature('beneficiary', beneficiary));
    });

    console.log(`✅ ${this.marcadores.beneficiarios.size} beneficiarios renderizados`);
  }

  /**
   * Renderizar actividades de equipos en el mapa
   */
  renderActividadesEquipo(actividades) {
    this.layers.actividadesEquipo.clearLayers();
    this.marcadores.actividadesEquipo.clear();

    // Función normalizar (idéntica a renderEquipos)
    const normalizar = (str) => {
      return str.toLowerCase()
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u');
    };

    actividades.forEach((actividad) => {
      // Saltar si no tiene ubicación
      if (!actividad.lat || !actividad.lon) {
        return;
      }

      // Aplicar filtro de tipo también para actividades
      if (this.filtros.equipos.tipo !== 'todos') {
        const actividadTipo = (actividad.tipo || '').trim();
        const filtroTipo = (this.filtros.equipos.tipo || '').trim();
        const actividadNorm = normalizar(actividadTipo);
        const filtroNorm = normalizar(filtroTipo);

        if (actividadNorm !== filtroNorm) {
          return; // Saltar si no coincide el tipo
        }
      }

      // Obtener icono según tipo de equipo (mismo que renderEquipos)
      const tipoLower = actividad.tipo?.toLowerCase() || 'otros';
      let iconConfig = { icon: '👥', size: [30, 30] }; // Default: personas trabajando

      if (tipoLower.includes('entrega')) {
        iconConfig = { icon: '📦', size: [30, 30] };
      } else if (tipoLower.includes('eléc') || tipoLower.includes('electr')) {
        iconConfig = { icon: '⚡', size: [30, 30] };
      } else if (tipoLower.includes('poda')) {
        iconConfig = { icon: '✂️', size: [30, 30] };
      } else if (tipoLower.includes('sac')) {
        iconConfig = { icon: '🚗', size: [30, 30] };
      } else if (tipoLower.includes('maquinar')) {
        iconConfig = { icon: '🏗️', size: [30, 30] };
      }

      // Crear marcador con el icono del tipo de equipo
      const marker = L.marker([actividad.lat, actividad.lon], {
        icon: L.divIcon({
          html: `<div style="font-size: ${iconConfig.size[0]}px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); filter: brightness(0.9); display:flex; align-items:center; justify-content:center;">${iconConfig.icon}</div>`,
          iconSize: iconConfig.size,
          iconAnchor: [iconConfig.size[0] / 2, iconConfig.size[1] / 2],
          className: 'activity-marker'
        }),
        zIndex: 75
      }).addTo(this.layers.actividadesEquipo);

      // Popup con información de la actividad
      const popupContent = this._createActividadPopup(actividad);
      marker.bindPopup(popupContent, this.config.popup);

      // Guardar referencia
      this.marcadores.actividadesEquipo.set(actividad.id, marker);

      // Click para seleccionar
      marker.on('click', () => this._selectFeature('actividad', actividad));
    });

    console.log(`✅ ${this.marcadores.actividadesEquipo.size} actividades de equipo renderizadas`);
  }

  /**
   * Crear HTML del popup para emergencia
   */
  _createEmergenciaPopup(emergencia) {
    const urgenciaEmoji = {
      critico: '🔴',
      alto: '🟠',
      medio: '🟡',
      bajo: '🟢'
    }[emergencia.urgencia] || '⚪';

    const atendido = emergencia.estadoAtencion === 'atendido';
    const estadoHtml = atendido
      ? `🎫 <strong style="color:#27ae60;">Atendido</strong>`
      : `⏳ <strong style="color:#e67e22;">Pendiente</strong>`;

    const accionHtml = !atendido && typeof window.marcarAtendido === 'function'
      ? `<button onclick="window.marcarAtendido(${emergencia.id})" style="margin-top:6px;padding:4px 8px;font-size:11px;background:#27ae60;color:#fff;border:none;border-radius:4px;cursor:pointer;">✅ Marcar como Atendido</button>`
      : '';

    return `
      <div style="font-size: 12px;">
        <strong>${urgenciaEmoji} ${emergencia.tipo || 'Emergencia'}</strong><br>
        <small>
          📞 ${emergencia.nombre || 'Sin nombre'}<br>
          📍 ${emergencia.ubicacion || 'Sin ubicación'}<br>
          🚨 ${emergencia.descripcion?.substring(0, 50) || 'Sin descripción'}...<br>
          ${estadoHtml}<br>
          ${emergencia.timestamp ? `⏰ ${new Date(emergencia.timestamp).toLocaleTimeString('es-CL')}` : ''}
        </small><br>
        ${accionHtml}
      </div>
    `;
  }

  /**
   * Crear HTML del popup para equipo
   */
  _createEquipoPopup(equipo) {
    const estadoEmoji = {
      activo: '🟢',
      inactivo: '⚪',
      mantenimiento: '🟡'
    }[equipo.estado] || '⚪';

    return `
      <div style="font-size: 12px;">
        <strong>🚗 ${equipo.tipo || 'Equipo'}</strong><br>
        <small>
          ${estadoEmoji} Estado: ${equipo.estado || 'Desconocido'}<br>
          👤 Líder: ${equipo.lider || 'Sin asignar'}<br>
          📞 ${equipo.telefono || 'Sin contacto'}<br>
          📋 Tarea: ${equipo.tarea || 'Disponible'}<br>
          👥 Personal: ${equipo.personal || '-'}
        </small>
      </div>
    `;
  }

  /**
   * Crear HTML del popup para beneficiario
   */
  _createBeneficiarioPopup(beneficiary) {
    const urgenciaEmoji = {
      critico: '🔴',
      alto: '🟠',
      medio: '🟡',
      bajo: '🟢'
    }[beneficiary.urgencia] || '⚪';

    return `
      <div style="font-size: 12px;">
        <strong>${urgenciaEmoji} ${beneficiary.nombre || 'Beneficiario'}</strong><br>
        <small>
          📞 ${beneficiary.telefono || 'Sin teléfono'}<br>
          🏠 ${beneficiary.sector || 'Sin sector'}<br>
          🆘 Necesidad: ${beneficiary.tipo_asistencia || 'No especificada'}<br>
          👨‍👩‍👧 Familia: ${beneficiary.num_personas || '1'} personas
        </small>
      </div>
    `;
  }

  /**
   * Crear HTML del popup para actividad de equipo
   */
  _createActividadPopup(actividad) {
    return `
      <div style="font-size: 12px;">
        <strong>👥 ${actividad.encargado}</strong><br>
        <small>
          📅 Fecha: ${actividad.fecha}<br>
          🔧 Tipo: ${actividad.tipo}<br>
          📍 Ubicación: ${actividad.ubicacion}<br>
          📋 Trabajo: ${actividad.descripcion?.substring(0, 40) || 'Sin descripción'}...
        </small>
      </div>
    `;
  }

  /**
   * Renderizar móviles en el mapa
   */
  renderMoviles(moviles) {
    this.layers.moviles.clearLayers();
    this.marcadores.moviles.clear();

    let movilesRenderizados = 0;

    moviles.forEach((movil) => {
      // Saltar si no tiene ubicación
      if (!movil.lat || !movil.lon) {
        return;
      }

      // Aplicar filtro de tipo
      if (this.filtros.moviles.tipo !== 'todos' && movil.tipo !== this.filtros.moviles.tipo) {
        return;
      }

      // Obtener icono según tipo de vehículo
      const tipoIcons = {
        'Auto': '🚗',
        'Camioneta': '🚙',
        'Maquinaria': '🚜',
        'Torreta': '💡',
        'Generador': '⚙️'
      };
      const icon = tipoIcons[movil.tipo] || '🚗';

      // Crear marcador
      const marker = L.marker([movil.lat, movil.lon], {
        icon: L.divIcon({
          html: `<div style="font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">${icon}</div>`,
          iconSize: [40, 40],
          className: 'movil-marker'
        }),
        zIndex: 80
      }).addTo(this.layers.moviles);

      // Popup con información
      const popupContent = this._createMovilPopup(movil);
      marker.bindPopup(popupContent, this.config.popup);

      // Guardar referencia
      this.marcadores.moviles.set(movil.id, marker);

      // Click para seleccionar
      marker.on('click', () => this._selectFeature('movil', movil));

      movilesRenderizados++;
    });

    console.log(`✅ ${movilesRenderizados} móviles renderizados`);
  }

  /**
   * Renderizar actividades de móviles en el mapa
   */
  renderActividadesMovil(actividades) {
    this.layers.actividadesMovil.clearLayers();
    this.marcadores.actividadesMovil.clear();

    console.log('🚗 renderActividadesMovil() - Actividades recibidas:', actividades);

    actividades.forEach((actividad) => {
      // Saltar si no tiene ubicación
      if (!actividad.lat || !actividad.lon) {
        console.warn('⚠️ Actividad sin coordenadas:', actividad);
        return;
      }

      console.log(`📋 Procesando actividad - tipoMovil: "${actividad.tipoMovil}", movilId: ${actividad.movilId}`);

      // Aplicar filtro de tipo
      if (this.filtros.moviles.tipo !== 'todos' && actividad.tipoMovil !== this.filtros.moviles.tipo) {
        return;
      }

      // Obtener icono según tipo
      const tipoIcons = {
        'Auto': '🚗',
        'Camioneta': '🚙',
        'Maquinaria': '🚜',
        'Torreta': '💡',
        'Generador': '⚙️'
      };
      const icon = tipoIcons[actividad.tipoMovil] || '🚗';
      console.log(`✅ Icono seleccionado para "${actividad.tipoMovil}": ${icon}`);

      // Crear marcador
      const marker = L.marker([actividad.lat, actividad.lon], {
        icon: L.divIcon({
          html: `<div style="font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">${icon}</div>`,
          iconSize: [36, 36],
          className: 'actividad-movil-marker'
        }),
        zIndex: 70
      }).addTo(this.layers.actividadesMovil);

      // Popup con información
      const popupContent = this._createActividadMovilPopup(actividad);
      marker.bindPopup(popupContent, this.config.popup);

      // Guardar referencia
      this.marcadores.actividadesMovil.set(actividad.id, marker);

      // Click para seleccionar
      marker.on('click', () => this._selectFeature('actividadMovil', actividad));
    });

    console.log(`✅ ${this.marcadores.actividadesMovil.size} actividades de móvil renderizadas`);
  }

  /**
   * Crear HTML del popup para móvil
   */
  _createMovilPopup(movil) {
    return `
      <div style="font-size: 12px;">
        <strong>🚗 ${movil.tipo || 'Móvil'}</strong><br>
        <small>
          🏷️ PPU: ${movil.ppu || 'N/A'}<br>
          👤 Chofer Base: ${movil.choferBase || 'Sin asignar'}<br>
          📍 Coordenadas: [${movil.lat?.toFixed(5)}, ${movil.lon?.toFixed(5)}]
        </small>
      </div>
    `;
  }

  /**
   * Crear HTML del popup para actividad de móvil
   */
  _createActividadMovilPopup(actividad) {
    return `
      <div style="font-size: 12px;">
        <strong>🚗 ${actividad.tipoMovil || 'Móvil'}</strong><br>
        <small>
          📅 Fecha: ${actividad.fecha}<br>
          👤 Chofer: ${actividad.choferNombre || 'Sin asignar'}<br>
          📍 Ubicación: ${actividad.ubicacion || 'Sin especificar'}<br>
          📋 Descripción: ${actividad.descripcion?.substring(0, 40) || 'Sin descripción'}...
        </small>
      </div>
    `;
  }

  /**
   * Seleccionar feature (para panel de detalles)
   */
  _selectFeature(type, feature) {
    this.selectedFeature = { type, feature };

    // Evento para actualizar panel lateral
    window.dispatchEvent(new CustomEvent('mapFeatureSelected', {
      detail: { type, feature }
    }));
  }

  /**
   * Configurar event listeners
   */
  _setupEventListeners() {
    // Escuchar cambios en emergencias
    window.addEventListener('emergenciasUpdated', (e) => {
      this.renderEmergencias(e.detail || JSON.parse(localStorage.getItem('emergencias')) || []);
    });

    // Escuchar cambios en equipos
    window.addEventListener('equiposUpdated', (e) => {
      this.renderEquipos(e.detail || JSON.parse(localStorage.getItem('equipos')) || []);
    });

    // Escuchar cambios en beneficiarios
    window.addEventListener('beneficiariesUpdated', (e) => {
      this.renderBeneficiarios(e.detail || JSON.parse(localStorage.getItem('beneficiaries')) || []);
    });

    // Click en mapa (deseleccionar)
    this.map.on('click', () => {
      this.selectedFeature = null;
    });
  }

  /**
   * Aplicar filtros y re-renderizar
   */
  setFiltro(tipo, campo, valor) {
    if (!this.filtros[tipo]) {
      console.warn(`Tipo de filtro desconocido: ${tipo}`);
      return;
    }

    this.filtros[tipo][campo] = valor;
    console.log(`✅ Filtro aplicado: ${tipo}.${campo} = ${valor}`, this.filtros[tipo]);

    // Re-renderizar según tipo - pasar datos completos, renderizar aplicará filtros
    if (typeof DB !== 'undefined') {
      if (tipo === 'emergencias') {
        this.renderEmergencias(DB.emergencias || []);
      } else if (tipo === 'equipos') {
        this.renderEquipos(DB.equipos || []);
      } else if (tipo === 'beneficiarios') {
        this.renderBeneficiarios(DB.beneficiarios || []);
      } else if (tipo === 'moviles') {
        this.renderMoviles(DB.moviles || []);
      }
    }
  }

  /**
   * Obtener datos de feature seleccionado
   */
  getSelectedFeature() {
    return this.selectedFeature;
  }

  /**
   * Zoom a ubicación específica
   */
  zoomTo(lat, lng, zoom = 15) {
    this.map.setView([lat, lng], zoom);
  }

  /**
   * Calcula distancia entre dos puntos (en metros)
   */
  calcularDistancia(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 1000); // retornar en metros
  }

  /**
   * Obtener estado del mapa
   */
  getMapState() {
    const center = this.map.getCenter();
    return {
      center: { lat: center.lat, lng: center.lng },
      zoom: this.map.getZoom(),
      bounds: this.map.getBounds()
    };
  }

  /**
   * Exportar vista actual como imagen
   */
  exportMapImage() {
    // Implementar con Leaflet-image o similar
    console.log('📸 Exportar mapa como imagen');
    alert('Funcionalidad de exportar imagen - próxima versión');
  }
}

// Crear instancia global
let mapViewer = null;

function initMapViewer() {
  if (!mapViewer) {
    mapViewer = new MapViewer(GIS_CONFIG);
    mapViewer.init('map');
  }
  return mapViewer;
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MapViewer, initMapViewer };
}
