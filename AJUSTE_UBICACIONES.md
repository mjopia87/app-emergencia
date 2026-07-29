# 🎯 Guía: Ajustar Ubicaciones Inexactas

## 📍 Problema: Geocoding Aproximado

A veces el geocoding de Nominatim (OpenStreetMap) devuelve una ubicación **aproximada pero no exacta**, especialmente en calles pequeñas o direcciones muy específicas.

**Ejemplo**: "Constitución 24, Illapel" puede ubicarse en la calle Constitución, pero no en el número exacto.

## ✅ Solución: Ajustar Manualmente

Tenemos 3 formas de corregir ubicaciones inexactas:

---

## Opción 1: Ajustar Después de Geocoding ⭐ (RECOMENDADO)

### Flujo
1. En "Dirección/Sector", ingresa: `Constitución 24, Illapel`
2. Click 🔍 (botón buscar)
3. Selecciona el resultado
4. ✅ Ubicación se llena automáticamente
5. **Ves mensaje**: "Ubicación encontrada" con botón **"📍 Ajustar en mapa"**
6. Click en "📍 Ajustar en mapa"
7. El modal se achica (derecha)
8. **Haz click EXACTO en el mapa** donde está Constitución 24
9. Marcador verde aparece
10. Lat/Lon se actualizan con precisión exacta
11. Guardar

**Ventaja**: Rápido y preciso
**Tiempo**: ~30 segundos

---

## Opción 2: Click Directo en Mapa

### Flujo
1. En "Dirección/Sector", ingresa: `Constitución 24`
2. Click 📍 "Click en mapa"
3. Modal se achica
4. Zoom en el mapa satelital hasta ver Constitución 24
5. **Haz click exacto** en ese punto
6. Marcador verde aparece
7. Lat/Lon se llenan automáticamente
8. Guardar

**Ventaja**: Total control, muy preciso
**Tiempo**: ~1 minuto (si buscas bien en el mapa)

---

## Opción 3: Búsqueda + Ajuste Manual

### Flujo
1. Geocoding con "Constitución" (sin número)
2. Selecciona resultado
3. Click "📍 Ajustar en mapa"
4. Zoom en mapa satelital
5. Busca el edificio/punto exacto visualmente
6. Haz click ahí
7. Guardar

**Ventaja**: Buena combinación de búsqueda + precisión visual
**Tiempo**: ~45 segundos

---

## 🗺️ Usar la Vista Satelital

La vista satelital es tu mejor aliada para ubicación exacta:

1. **Zoom In** - Rueda del mouse para acercar (zoom 17-18 ideal)
2. **Arrastra** - Click y arrastra para mover la vista
3. **Visualiza** - Puedes ver:
   - Números de casas
   - Edificios específicos
   - Esquinas exactas
   - Referencias visuales (plazas, iglesias, etc.)

### Ejemplo: Encontrar Constitución 24
1. Zoom nivel 16-17
2. Busca la calle "Constitución"
3. Cuenta los números de casas
4. Encuentra el número 24
5. **Haz click exactamente ahí**

---

## 📋 Checklist para Precisión

- [ ] ¿Ves el número de la casa en el mapa?
- [ ] ¿Es la calle correcta?
- [ ] ¿Es el lado correcto de la calle?
- [ ] ¿Zoom está en nivel 17-18?
- [ ] ¿El marcador rojo/verde está EN el punto, no cerca?

Si respondiste "Sí" a todo → **Ubicación precisa ✅**

---

## 🚨 Casos Problemáticos

### ❌ Dirección no existe
**Solución**: Ingresa la calle sin número
- Intenta: "Calle O'Higgins, Illapel"
- O busca punto de referencia: "Plaza de Armas, Illapel"

### ❌ Número de casa aproximado
**Solución**: Usa click en mapa
- Geocoding te lleva a la calle
- Tú ajustas al número exacto con click

### ❌ Sector/Zona desconocida
**Solución**: Describe con referencia
- "Sector Centro cerca de Río"
- "Zona Norte frente a escuela"
- O directamente: click en mapa y busca visualmente

---

## 💾 Datos Guardados con Precisión

Cuando ajustas con click en mapa, se guarda:
```json
{
  "direccion": "Constitución 24, Illapel",
  "lat": -31.632793,
  "lon": -71.168328,
  "metodo": "Geocoding + Click Ajuste"
}
```

**Precisión**: ±1-2 metros (excelente para emergencias)

---

## 🎓 Tips Profesionales

### Para Emergencias Reales
1. **Si tienes tiempo**: Usa geocoding + ajuste en mapa
2. **Si es urgente**: Click directo en mapa (más rápido)
3. **De día**: Usa vista satelital, ves más detalles
4. **De noche**: Ten la dirección escrita y busca números iluminados

### Para Mejorar Nominatim
- Usa nombre de calles (no números)
- Agrega referencias: "Constitución cerca de Plaza"
- Especifica zona: "Constitución Sector Centro"

---

## ✨ Nuevas Mejoras (v2.1)

✅ Geocoding con contexto localizado (región, provincia)  
✅ Búsqueda limitada a bounding box de Illapel  
✅ Botón "Ajustar en mapa" integrado  
✅ Modal flotante para ver mapa mientras ajustas  
✅ Mensajes de ayuda si no hay resultados  

---

## 📞 Referencia Rápida

| Tarea | Método | Tiempo | Precisión |
|-------|--------|--------|-----------|
| Dirección conocida | Geocoding | 10s | Media-Alta |
| Dirección + ajuste | Geocoding → Click | 30s | Muy alta |
| Punto desconocido | Click en mapa | 60s | Perfecta |
| Zona aproximada | Click con zoom | 45s | Muy alta |

---

**Estado**: Optimizado para Illapel  
**Última actualización**: 25 Julio 2026  
**Versión**: 2.1
