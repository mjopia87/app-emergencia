# Guía de Integración - Datos de Vehículos

## 📋 Datos Preparados

**Archivo:** `vehiculos_datos.json`  
**Total de vehículos:** 69  
**Campos:** ppu, tipoVehiculo, combustible, marca, modelo, anio

---

## 🚀 Opciones de Integración

### Opción 1: Carga de JSON en Frontend (React/Vue)

```javascript
// Importar datos
import vehiculosData from './vehiculos_datos.json';

// Usar en el componente
const cargarVehiculos = () => {
  const { vehiculos } = vehiculosData;
  // Guardar en estado o base de datos
  setVehiculos(vehiculos);
};

// Ejemplo de renderización en tabla
<tbody>
  {vehiculos.map((v) => (
    <tr key={v.ppu}>
      <td>{v.tipoVehiculo}</td>
      <td>{v.ppu}</td>
      <td>{v.combustible}</td>
      <td>{v.marca}</td>
      <td>{v.modelo}</td>
      <td>{v.anio}</td>
    </tr>
  ))}
</tbody>
```

---

### Opción 2: Carga de JSON vía API (Node/Express)

```javascript
// routes/vehiculos.js
const vehiculosData = require('./vehiculos_datos.json');

app.get('/api/vehiculos', (req, res) => {
  res.json(vehiculosData.vehiculos);
});

// Insertar en BD
app.post('/api/vehiculos/importar', (req, res) => {
  vehiculosData.vehiculos.forEach(async (v) => {
    await Vehiculo.create({
      ppu: v.ppu,
      tipoVehiculo: v.tipoVehiculo,
      combustible: v.combustible,
      marca: v.marca,
      modelo: v.modelo,
      anio: v.anio
    });
  });
  res.json({ mensaje: 'Vehículos importados' });
});
```

---

### Opción 3: Importar a Base de Datos (MongoDB, PostgreSQL)

**MongoDB:**
```javascript
const vehiculos = require('./vehiculos_datos.json').vehiculos;
db.vehiculos.insertMany(vehiculos);
```

**PostgreSQL:**
```sql
INSERT INTO vehiculos (ppu, tipo_vehiculo, combustible, marca, modelo, anio)
SELECT ppu, tipoVehiculo, combustible, marca, modelo, anio
FROM json_each_text('vehiculos_datos.json');
```

---

### Opción 4: Script de Importación Manual (CLI)

```bash
# Ejecutar en Node
node importar_vehiculos.js

// importar_vehiculos.js
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./vehiculos_datos.json'));

data.vehiculos.forEach((v, index) => {
  console.log(`${index + 1}. ${v.ppu} - ${v.tipoVehiculo}`);
  // Guardar en BD aquí
});
```

---

## 📊 Formato de los Datos

Cada vehículo tiene esta estructura:

```json
{
  "ppu": "TVKJ-21",
  "tipoVehiculo": "Mini bus",
  "combustible": "DIESEL",
  "marca": "Maxus",
  "modelo": "G90 2.0 AUT",
  "anio": 2025
}
```

---

## ✅ Pasos Recomendados

1. **Validar PPU único** - Asegurar que no hay duplicados
2. **Normalizar combustible** - Estandarizar a DIESEL/BENCINA/GAS
3. **Verificar años válidos** - Rango 1990-2026
4. **Guardar en BD** - Usar la opción según tu stack
5. **Mostrar en tabla** - Renderizar con los 69 registros

---

## 🔍 Validaciones Aplicadas

✓ 69 vehículos con PPU válida  
✓ Espacios en blanco limpiados  
✓ Combustible normalizado a mayúscula  
✓ Años convertidos a número entero  
✓ Campos requeridos validados  

---

## 📱 Para Móvil (React Native / Flutter)

**JSON importado:**
```javascript
const vehiculos = require('./vehiculos_datos.json').vehiculos;

// Guardar en AsyncStorage o SQLite
await AsyncStorage.setItem('vehiculos', JSON.stringify(vehiculos));

// Recuperar cuando sea necesario
const stored = await AsyncStorage.getItem('vehiculos');
const lista = JSON.parse(stored);
```

---

## 🆘 Troubleshooting

- **No se cargan los datos:** Verificar ruta correcta del archivo JSON
- **Errores de mapeo:** Asegurar que los nombres de campos coinciden exactamente
- **Duplicados en BD:** Usar `unique: true` en el campo PPU
- **Año inválido:** Validar que sea número entre 1990-2026
