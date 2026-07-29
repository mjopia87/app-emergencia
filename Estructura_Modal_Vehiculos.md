# Estructura Modal - Registro de Vehículos

## Campos Principales del Modal

### 1. **PPU (Placa Patente)** - Campo Obligatorio
- Origen: Columna "Placa Patente"
- Formato: Texto (ej: TVKJ-21, BWHP-75)
- Validación: Máximo 10 caracteres, debe ser único
- Tipo de entrada: Text Input

### 2. **Tipo de Vehículo** - Campo Obligatorio
- Origen: Columna "Tipo"
- Ejemplos disponibles en datos:
  - Minibus
  - Rodillo
  - Motoniveladora
  - Retroexcavadora
  - Camión
  - Camión Recolector
  - Bus
  - Camioneta
  - Automóvil
  - Van
  - Station Wagon
  - Excavadora
  - Camión Pluma
  - Camión Aljibe
  - Clínica Vet
- Tipo de entrada: Dropdown/Select

### 3. **Combustible** - Campo Obligatorio
- Origen: Columna "Combustible"
- Valores únicos encontrados:
  - DIESEL
  - Diesel
  - BENCINA
  - SAC (algunos registros)
- Tipo de entrada: Dropdown/Select
- Nota: Requiere normalización (mayúscula/minúscula)

### 4. **Marca** - Campo Obligatorio
- Origen: Columna "Marca"
- Ejemplos: Maxus, Caterpillar, John Deere, Chevrolet, Hyundai, Mercedes Benz, Toyota, Mitsubishi, etc.
- Tipo de entrada: Dropdown/Autocomplete (lista predefinida o búsqueda)

### 5. **Modelo** - Campo Obligatorio
- Origen: Columna "MODELO"
- Ejemplos: G90 2.0 AUT, CS 533E, 770D, 416E, FVR 1723, etc.
- Tipo de entrada: Text Input

### 6. **Año** - Campo Obligatorio
- Origen: Columna "Año"
- Rango: 2001-2026
- Validación: Número de 4 dígitos
- Tipo de entrada: Dropdown o Number Input

---

## Campos Adicionales (Complementarios)

| Campo | Origen | Tipo | Validación |
|-------|--------|------|-----------|
| Estanque (lts) | Estanque | Number | Capacidad en litros |
| Cilindrada | Cilindrada | Decimal | Ej: 2.0, 4.4, 7.8 |
| Chasis | Chasis | Text | Número de chasis |
| Nº Motor | N° Motor | Text | Número de motor |
| VIN | VIN | Text | Número de identificación |
| Estado | MUNICIPAL/ARRENDADA | Dropdown | MUNICIPAL, ARRENDADA |

---

## Resumen de Datos

- **Total de vehículos**: 70 registros
- **Vehículos municipales**: 59
- **Vehículos arrendados**: 11
- **Tipos de combustible**: DIESEL, Diesel, BENCINA, SAC
- **Rango de años**: 2001 - 2026

---

## Validaciones Recomendadas

✓ PPU debe ser único  
✓ Campos obligatorios: PPU, Tipo, Combustible, Marca, Modelo, Año  
✓ Año debe estar entre 1990 y año actual + 1  
✓ Estanque debe ser > 0 si se ingresa  
✓ Cilindrada debe ser > 0 si se ingresa  

---

## Flujo del Modal

1. **Paso 1**: Ingreso de PPU (validar que no exista)
2. **Paso 2**: Selección de Tipo de Vehículo
3. **Paso 3**: Selección de Combustible
4. **Paso 4**: Selección/Ingreso de Marca
5. **Paso 5**: Ingreso de Modelo
6. **Paso 6**: Selección de Año
7. **Paso 7** (Opcional): Campos complementarios (Estanque, Cilindrada, Chasis, Motor, VIN, Estado)
8. **Guardado**: Guardar o seguir agregando más vehículos
