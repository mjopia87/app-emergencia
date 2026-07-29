# 🎯 INSTRUCCIONES FINALES PARA DIAGNOSTICAR

## Paso 1: Recarga
```
Ctrl+Shift+R
```

## Paso 2: Abre Consola
```
F12 → Pestaña "Console"
```

## Paso 3: Limpia la Consola
Presiona el botón 🚫 (limpiar consola) para que solo veas mensajes nuevos.

## Paso 4: Crea Un Reporte
1. Click "Reportar Emergencia"
2. Rellena:
   - Contacto: "Test"
   - Teléfono: "123"
   - Tipo: "Prueba"
   - Urgencia: "Crítico"
   - Ubicación: "Centro"
   - Descripción: "Test"
3. Click "Guardar"

## Paso 5: Busca Estos Mensajes en Consola

Deberías ver:
```
✅ Emergencia guardada: {...}
📍 updateMapMarkers() - emergencias: 1
  Emergencia 0: Test en [-31.8215, -71.1722]
  ✅ Marcador creado y agregado
✅ FINAL: 1 marcadores en mapa
```

---

## Si Ves Esto ✅
**EL MAPA DEBERÍA FUNCIONAR** - busca el punto ROJO en el mapa

## Si Ves Error ❌
Copia TODO LO QUE DICE EN ROJO y envíame.

---

## Alternativa: Botones Panel Izquierdo

Si los botones del sidebar NO funcionan:

1. Abre Consola (F12)
2. Haz click en "Emergencias"
3. Busca mensajes de error en rojo
4. Cópiamelos

---

**ACCIÓN**: Haz estos pasos y dime exactamente QUÉ VES en la consola (solo los mensajes de updateMapMarkers y errores en rojo).
