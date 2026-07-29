/**
 * Debug Console para Mapa - APP Emergencia
 * Ayuda a diagnosticar problemas con el mapa y los datos
 *
 * CÓMO USAR:
 * 1. Abre la consola (F12)
 * 2. Usa los comandos: debugMap(), debugData(), debugGPS(), etc.
 */

// ===== FUNCIONES DE DEBUG =====

function debugMap() {
  console.log('=== DEBUG: ESTADO DEL MAPA ===');

  if (window.mapViewerInstance) {
    console.log('✅ MapViewer inicializado:', window.mapViewerInstance);
    console.log('   - Mapa:', window.mapViewerInstance.map);
    console.log('   - Marcadores Emergencias:', window.mapViewerInstance.marcadores.emergencias.size);
    console.log('   - Marcadores Equipos:', window.mapViewerInstance.marcadores.equipos.size);
    console.log('   - Marcadores Beneficiarios:', window.mapViewerInstance.marcadores.beneficiarios.size);
    console.log('   - Filtros activos:', window.mapViewerInstance.filtros);
  } else {
    console.error('❌ MapViewer NO inicializado');
  }
}

function debugData() {
  console.log('=== DEBUG: DATOS EN LOCALSTORAGE ===');

  const emergencias = JSON.parse(localStorage.getItem('emergencias') || '[]');
  const equipos = JSON.parse(localStorage.getItem('equipos') || '[]');
  const beneficiarios = JSON.parse(localStorage.getItem('beneficiaries') || '[]');

  console.log(`\n📍 EMERGENCIAS (${emergencias.length}):`);
  emergencias.forEach((e, i) => {
    console.log(`  [${i}] ${e.nombre || e.contacto}`);
    console.log(`      Tipo: ${e.tipo} | Urgencia: ${e.urgencia}`);
    console.log(`      Ubicación: ${e.lat}, ${e.lon} (${e.ubicacion})`);
    console.log(`      GPS Disponible: ${e.lat ? '✅' : '❌'}`);
  });

  console.log(`\n🚗 EQUIPOS (${equipos.length}):`);
  equipos.forEach((eq, i) => {
    console.log(`  [${i}] ${eq.tipo} - ${eq.lider}`);
    console.log(`      Ubicación: ${eq.lat}, ${eq.lon}`);
    console.log(`      Estado: ${eq.estado}`);
  });

  console.log(`\n👥 BENEFICIARIOS (${beneficiarios.length}):`);
  beneficiarios.forEach((b, i) => {
    console.log(`  [${i}] ${b.nombre}`);
    console.log(`      Ubicación: ${b.lat}, ${b.lon}`);
    console.log(`      Urgencia: ${b.urgencia}`);
  });
}

function debugGPS() {
  console.log('=== DEBUG: CONFIGURACIÓN GPS ===');

  if (typeof GIS_CONFIG !== 'undefined') {
    console.log('✅ GIS_CONFIG cargado');
    console.log('   - GPS Habilitado:', GIS_CONFIG.gps.enableGPS);
    console.log('   - Ubicación por defecto:', GIS_CONFIG.center);
    console.log('   - Timeout GPS:', GIS_CONFIG.gps.timeout, 'ms');
  } else {
    console.error('❌ GIS_CONFIG NO cargado');
  }

  if (navigator.geolocation) {
    console.log('✅ Geolocation API disponible');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log(`✅ GPS FUNCIONA: ${pos.coords.latitude}, ${pos.coords.longitude}`);
        console.log(`   Precisión: ±${Math.round(pos.coords.accuracy)}m`);
      },
      (err) => {
        console.warn(`⚠️ GPS error: ${err.message}`);
      },
      { timeout: 5000 }
    );
  } else {
    console.error('❌ Geolocation API NO disponible');
  }
}

function debugConfig() {
  console.log('=== DEBUG: CONFIGURACIÓN ===');

  console.log('GIS_CONFIG:', typeof GIS_CONFIG !== 'undefined' ? '✅ Cargado' : '❌ NO cargado');
  console.log('MapViewer:', typeof MapViewer !== 'undefined' ? '✅ Cargado' : '❌ NO cargado');
  console.log('Leaflet:', typeof L !== 'undefined' ? '✅ Cargado' : '❌ NO cargado');
  console.log('Turf:', typeof turf !== 'undefined' ? '✅ Cargado' : '❌ NO cargado');

  if (typeof GIS_CONFIG !== 'undefined') {
    console.log('\nCentro del mapa:', GIS_CONFIG.center);
    console.log('Zoom inicial:', GIS_CONFIG.initialZoom);
    console.log('Bounds:', GIS_CONFIG.bounds);
  }
}

function debugSync() {
  console.log('=== DEBUG: SINCRONIZACIÓN MAPA ===');

  if (!window.mapViewerInstance) {
    console.error('❌ MapViewer NO inicializado');
    return;
  }

  console.log('🔄 Forzando sincronización...');

  const emergencias = JSON.parse(localStorage.getItem('emergencias') || '[]');
  const equipos = JSON.parse(localStorage.getItem('equipos') || '[]');
  const beneficiarios = JSON.parse(localStorage.getItem('beneficiaries') || '[]');

  console.log(`\n📍 Renderizando ${emergencias.length} emergencias...`);
  window.mapViewerInstance.renderEmergencias(emergencias);

  console.log(`🚗 Renderizando ${equipos.length} equipos...`);
  window.mapViewerInstance.renderEquipos(equipos);

  console.log(`👥 Renderizando ${beneficiarios.length} beneficiarios...`);
  window.mapViewerInstance.renderBeneficiarios(beneficiarios);

  console.log('✅ Sincronización completada');
}

function debugTest() {
  console.log('=== DEBUG: TEST DE CREACIÓN ===');

  // Crear test emergencia
  const testEmergencia = {
    id: Date.now(),
    nombre: 'TEST Emergencia',
    contacto: 'TEST',
    telefono: '999999999',
    tipo: 'Prueba',
    urgencia: 'critico',
    ubicacion: 'Centro Illapel',
    descripcion: 'Esta es una emergencia de prueba',
    timestamp: new Date().toISOString(),
    usuario: 'debug',
    lat: -31.8215,
    lon: -71.1722
  };

  console.log('📍 Datos de test:', testEmergencia);

  // Guardar en localStorage
  const emergencias = JSON.parse(localStorage.getItem('emergencias') || '[]');
  emergencias.push(testEmergencia);
  localStorage.setItem('emergencias', JSON.stringify(emergencias));

  console.log('✅ Guardado en localStorage');

  // Renderizar
  if (window.mapViewerInstance) {
    window.mapViewerInstance.renderEmergencias(emergencias);
    console.log('✅ Renderizado en mapa');
  } else {
    console.error('❌ MapViewer no disponible');
  }
}

function debugClear() {
  console.log('🗑️ Limpiando todos los datos...');
  localStorage.removeItem('emergencias');
  localStorage.removeItem('equipos');
  localStorage.removeItem('beneficiaries');
  localStorage.removeItem('illapel_db');

  if (window.mapViewerInstance) {
    window.mapViewerInstance.renderEmergencias([]);
    window.mapViewerInstance.renderEquipos([]);
    window.mapViewerInstance.renderBeneficiarios([]);
  }

  console.log('✅ Datos limpiados');
  window.location.reload();
}

// ===== AYUDA =====

function debugHelp() {
  console.clear();
  console.log(`
╔════════════════════════════════════════════════╗
║     DEBUG CONSOLE - APP EMERGENCIA MAPAS       ║
╚════════════════════════════════════════════════╝

COMANDOS DISPONIBLES:

📊 ESTADO:
  debugMap()      - Estado del visor de mapas
  debugData()     - Datos en localStorage
  debugConfig()   - Configuración cargada
  debugGPS()      - Estado de GPS

🔧 ACCIONES:
  debugSync()     - Forzar sincronización mapa
  debugTest()     - Crear emergencia de test
  debugClear()    - Limpiar todos los datos

ℹ️ AYUDA:
  debugHelp()     - Mostrar este mensaje

FLUJO DE DIAGNÓSTICO RECOMENDADO:
1. debugConfig()  - Verificar scripts cargados
2. debugMap()     - Verificar MapViewer
3. debugData()    - Ver datos guardados
4. debugGPS()     - Probar GPS
5. debugSync()    - Forzar sincronización
6. debugTest()    - Crear emergencia de prueba

Si ves problemas, verifica:
✓ Consola sin errores (pestana "Console" F12)
✓ Network: todos scripts cargados (pestana "Network" F12)
✓ localStorage tiene datos (debugData())
✓ GPS funciona (debugGPS())
✓ MapViewer inicializado (debugMap())
  `);
}

// Auto-mostrar ayuda al cargar
console.log('%c🗺️ Debug Console Cargado - Escribe: debugHelp()', 'color: #c41e3a; font-size: 14px; font-weight: bold;');

// Exportar para uso global
window.debug = {
  map: debugMap,
  data: debugData,
  gps: debugGPS,
  config: debugConfig,
  sync: debugSync,
  test: debugTest,
  clear: debugClear,
  help: debugHelp
};

console.log('💡 ATAJOS: Usa debug.map(), debug.data(), debug.sync(), etc.');
