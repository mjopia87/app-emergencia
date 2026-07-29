# 🔍 Guía de Diagnóstico - Mapa No Muestra Datos

## Problema Identificado & Corregido

El problema era que **dos sistemas de mapa estaban compitiendo**:
- `initMap()` creaba su propio mapa (antiguo)
- `initMapViewer()` creaba otro mapa (nuevo)

**CORREGIDO**: Ahora `initMap()` solo delega a `initMapViewer()`.

---

## Verificación Paso a Paso

### Paso 1: Abrir Consola de Desarrollo
```
Presiona: F12
Selecciona: Pestaña "Console"
```

### Paso 2: Verificar Configuración
```javascript
debugConfig()
```

Debe mostrar:
```
✅ GIS_CONFIG Cargado
✅ MapViewer Cargado
✅ Leaflet Cargado
✅ Turf Cargado
```

**Si ves ❌**, significa que los scripts NO cargaron:
- Verifica en DevTools → Network tab
- Busca archivos: `gis-config.js`, `modules/map-viewer.js`
- Si aparecen como "404 Not Found", revisa las rutas

### Paso 3: Verificar Mapa
```javascript
debugMap()
```

Debe mostrar:
```
✅ MapViewer inicializado
   - Mapa: [object Object]
   - Marcadores Emergencias: 0
   - Marcadores Equipos: 0
   - Marcadores Beneficiarios: 0
```

**Si ves error de MapViewer**, significa que `initMapViewer()` no se ejecutó:
- Verifica que hayas hecho login correctamente
- Revisa console para ver si hay errores JavaScript

### Paso 4: Crear Emergencia de Test
```
1. Haz clic en "Reportar Emergencia"
2. Rellena:
   - Contacto: "Test"
   - Teléfono: "123456789"
   - Tipo: "Prueba"
   - Urgencia: "Crítico"
   - Ubicación: "Centro"
   - Descripción: "Test"
3. Presiona "Guardar"
4. Se abrirá popup de GPS
```

### Paso 5: Verificar Datos Guardados
```javascript
debugData()
```

Debe mostrar algo como:
```
📍 EMERGENCIAS (1):
  [0] Test
      Tipo: Prueba | Urgencia: critico
      Ubicación: -31.8215, -71.1722 (Centro)
      GPS Disponible: ✅
```

**Si ves 0 emergencias**, significa que `saveEmergencia()` no guardó correctamente:
- Revisa console para errores de GPS
- Verifica que el formulario se cerró

**Si ves emergencia pero sin lat/lon**, significa que la captura de GPS falló:
- Eso es normal si deniegaste permiso GPS
- Debe haber fallback a: -31.8215, -71.1722

### Paso 6: Forzar Sincronización Mapa
```javascript
debugSync()
```

Debe mostrar:
```
🔄 Forzando sincronización...
📍 Renderizando 1 emergencias...
🚗 Renderizando 0 equipos...
👥 Renderizando 0 beneficiarios...
✅ Sincronización completada
```

Después de esto, **deberías ver el punto rojo en el mapa**.

### Paso 7: Verificar Estado Final
```javascript
debugMap()
```

Ahora debe mostrar:
```
✅ MapViewer inicializado
   - Mapa: [object Object]
   - Marcadores Emergencias: 1  ← CAMBIÓ DE 0 A 1
   - Marcadores Equipos: 0
   - Marcadores Beneficiarios: 0
```

---

## Prueba de Test Automática

```javascript
debugTest()
```

Esto:
1. Crea una emergencia de prueba en memoria
2. La guarda en localStorage
3. La renderiza en el mapa

Deberías ver un punto rojo aparecer en Illapel en el mapa.

---

## Troubleshooting

### ❌ "Cannot read property 'map' of undefined"
**Problema**: MapViewer no se inicializó
**Solución**:
1. Verifica que hayas hecho login
2. Busca en console errores de scripts
3. Ejecuta `debugConfig()` para ver si está cargado

### ❌ "GIS_CONFIG is not defined"
**Problema**: gis-config.js no cargó
**Solución**:
1. Verifica ruta del archivo: `gis-config.js` (raíz del proyecto)
2. Abre DevTools → Network y busca `gis-config.js`
3. Si no aparece o está en rojo, revisa la ruta

### ❌ "MapViewer is not defined"
**Problema**: map-viewer.js no cargó
**Solución**:
1. Verifica ruta: `modules/map-viewer.js`
2. Verifica que la carpeta `modules/` existe
3. En Network tab, busca `map-viewer.js`

### ⚠️ GPS siempre pide permiso o falla
**Normal**: La primera vez que usas GPS, el navegador pide permiso
**Soluciones**:
- **Permitir GPS**: Presiona "Permitir" en el popup
- **Sin GPS**: Si niegas, usa fallback (Illapel center)
- **Forzar GPS**: En Chrome, Settings → Privacy → Site Settings → Location → Permitir

### ❌ Mapa no se ve
**Problema**: Contenedor `<div id="map">` tiene altura 0
**Verificar**:
```javascript
document.getElementById('map').style.height
```
Debe ser "500px" o mayor
**Solución**: Cambia altura en HTML:
```html
<div id="map" style="width: 100%; height: 500px; border-radius: 8px;"></div>
```

### ❌ Puntos aparecen pero en lugar equivocado
**Problema**: lat/lon guardados incorrectamente
**Verificar**:
```javascript
debugData()
```
Revisa que lat/lon sean números cercanos a:
- Illapel: -31.8215, -71.1722

---

## Orden de Ejecución

```
1. Página carga
   ↓
2. Scripts se cargan (Leaflet, Turf, gis-config, map-viewer, debug)
   ↓
3. Usuario hace login
   ↓
4. initMap() es llamado → delega a initMapViewer()
   ↓
5. MapViewer crea mapa en <div id="map">
   ↓
6. loadAllData() carga datos existentes
   ↓
7. mapViewer.render*() dibuja marcadores en mapa
   ↓
8. Usuario ve mapa listo
```

---

## Verificación Final

✅ Todos estos pasos deben ejecutarse sin errores:

```javascript
// 1. Scripts cargados
debugConfig()

// 2. Mapa inicializado
debugMap()

// 3. Crear test
debugTest()

// 4. Ver en mapa
// (Deberías ver punto rojo en Illapel)

// 5. Verificar conteos
debugMap()
// Debe mostrar "Marcadores Emergencias: 1"
```

---

## Si Aún No Funciona

Ejecuta esto y comparte la salida:
```javascript
console.log('=== DUMP COMPLETO ===');
console.log('URL:', window.location.href);
console.log('LocalStorage size:', Object.keys(localStorage).length);
console.log('Files:', {
  gis_config: typeof GIS_CONFIG,
  map_viewer: typeof MapViewer,
  leaflet: typeof L,
  turf: typeof turf,
  mapViewer_instance: typeof window.mapViewerInstance
});
console.log('Data:', {
  emergencias: JSON.parse(localStorage.getItem('emergencias') || '[]').length,
  equipos: JSON.parse(localStorage.getItem('equipos') || '[]').length,
  beneficiarios: JSON.parse(localStorage.getItem('beneficiaries') || '[]').length
});
debugMap();
debugData();
```

---

**Nota**: Los archivos han sido corregidos. Ahora:
1. Recarga `app.html` (Ctrl+Shift+R para limpiar caché)
2. Sigue los pasos de diagnóstico arriba
3. Reporta qué paso falla

El mapa debería funcionar correctamente ahora.
