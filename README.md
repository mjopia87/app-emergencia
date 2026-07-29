# APP Emergencia Illapel - Julio 2026

Sistema de gestión de emergencia para la comuna de Illapel, diseñado para funcionar sin conexión a internet y sincronizar datos cuando hay conectividad.

## 🎯 Características Principales

### 1. **Dashboard** 📊
- Resumen operacional en tiempo real
- Contadores de beneficiarios, recursos, equipos y emergencias
- Alertas de items con stock bajo
- Beneficiarios en estado crítico
- Emergencias sin resolver

### 2. **Centro de Acopio** 📦
- Registro y gestión de recursos (alimentos, agua, medicinas, etc.)
- Control de existencias (stock actual vs mínimo requerido)
- Seguimiento de egresos (distribución)
- Categorización por tipo de recurso
- Alertas automáticas de recursos críticos

### 3. **Beneficiarios** 👥
- Registro completo de personas que requieren asistencia
- Clasificación por urgencia (Crítico, Alto, Medio, Bajo)
- Seguimiento por sector geográfico
- Tipo de asistencia requerida
- Número de personas afectadas en cada caso
- Historial de actualizaciones

### 4. **Emergencias y Contactos** 📞
- Registro de emergencias con datos del contacto
- Clasificación por tipo (Terremoto, Incendio, Inundación, Accidente, Otro)
- Niveles de urgencia
- Estado del caso (Abierta, En Seguimiento, Resuelta)
- Ubicación precisa
- Historial de llamadas/reportes

### 5. **Equipos en Terreno** 🚗
- Gestión de personal y equipamiento en terreno
- Tipos: Ambulancias, Camiones de Suministros, Grupos de Rescate, Personal Médico, Voluntarios
- Asignación de sectores
- Seguimiento de tareas en ejecución
- Estado operativo (Activo, Inactivo, Mantenimiento)
- Información de contacto del líder

### 6. **Bitácora** 📝
- Registro detallado de todas las operaciones
- Seguimiento cronológico de eventos
- Rastreo de usuario/responsable
- Historial completo para auditoría
- Últimos 50 registros en pantalla

### 7. **Reportes** 📋
- Análisis de distribución por urgencia
- Desglose por sectores
- Tipos de asistencia requerida
- Gráficos y tablas dinámicas

## 🚀 Características Técnicas

- **Offline-First**: Funciona completamente sin conexión
- **Sincronización Automática**: Guarda datos cada 10 segundos a localStorage
- **PWA (Progressive Web App)**: Instalable como app nativa
- **Responsive**: Compatible con móviles, tablets y escritorio
- **Sin Base de Datos Remota**: Todos los datos se guardan localmente
- **Exportación/Importación**: Backup y restauración en JSON

## 📱 Instalación

### Opción 1: Abrir en Navegador
Simplemente abre `index.html` en tu navegador web.

### Opción 2: Instalar como App (PWA)
1. Abre la app en un navegador (Chrome, Edge, Firefox)
2. Busca el botón "Instalar app" o "Agregar a pantalla de inicio"
3. Se creará un acceso directo y podrá usarse offline

## 💾 Gestión de Datos

### Guardado Automático
- Los datos se guardan automáticamente cada 10 segundos en localStorage
- No requiere conexión a internet
- Se mantiene la información entre sesiones

### Exportar Datos
- Botón "Exportar" en la esquina superior derecha
- Descarga un archivo JSON con todos los datos
- Útil para backup o sincronización manual

### Importar Datos
- Botón "Importar" en la esquina superior derecha
- Selecciona un archivo JSON previamente exportado
- Reemplaza todos los datos actuales

### Limpiar Datos
- Botón "Limpiar" para eliminar todos los registros
- Requiere doble confirmación de seguridad
- ⚠️ Esta acción es irreversible

## 👤 Categorías de Urgencia

- 🔴 **Crítico**: Riesgo inmediato de vida, requiere intervención urgente
- 🟠 **Alto**: Situación grave que requiere atención pronta
- 🟡 **Medio**: Necesidad importante pero no inmediata
- 🟢 **Bajo**: Situación que puede esperar, requiere seguimiento

## 📍 Flujo de Trabajo Recomendado

1. **Inicio del Día**: Revisar Dashboard para alertas
2. **Recepción de Llamadas**: Registrar en "Emergencias"
3. **Evaluación de Necesidades**: Agregar a "Beneficiarios"
4. **Asignación de Recursos**: Usar "Equipos en Terreno"
5. **Distribución**: Registrar egresos en "Centro de Acopio"
6. **Seguimiento**: Actualizar Bitácora con cambios
7. **Cierre de Día**: Exportar datos como backup

## 🔧 Soporte Offline

La app mantiene su funcionalidad completa sin conexión:
- ✅ Crear registros
- ✅ Editar información
- ✅ Ver todos los datos
- ✅ Generar reportes
- ✅ Exportar datos

Indicador de estado en la esquina inferior izquierda:
- 🟢 **Online**: Conectado a internet
- 🟡 **Offline**: Sin conexión (pero funciona normalmente)

## 📊 Cálculos Automáticos

- **Stock Crítico**: Cuando stock ≤ mínimo requerido
- **Urgencia Beneficiarios**: Alertas en Dashboard
- **Estadísticas**: Se actualizan en tiempo real

## 🎓 Mejores Prácticas

1. **Mantén Datos Actualizados**: Actualiza el estado de beneficiarios regularmente
2. **Registra Todo**: Usa la Bitácora para documentar decisiones
3. **Backup Regular**: Exporta datos diariamente
4. **Cuidado con Datos**: Limpieza es irreversible
5. **Compartir Información**: Usa la exportación para sincronizar entre dispositivos

## 📱 Requisitos

- Navegador web moderno (Chrome 51+, Firefox 50+, Safari 11+, Edge 15+)
- No requiere instalación de software adicional
- 5MB de espacio en almacenamiento local mínimo

## 🔐 Privacidad y Seguridad

- Todos los datos se guardan localmente en el dispositivo
- No se envían datos a servidores externos
- No hay cuenta de usuario ni login
- Recomendable proteger el dispositivo con contraseña

## 📞 Números Importantes Illapel

*Agregar contactos de emergencia relevantes según municipalidad*

## 🤝 Contribuciones y Mejoras

Esta app fue diseñada para la emergencia de julio 2026 en Illapel. Se pueden agregar:
- Integración con bases de datos centrales
- Mapas GPS para ubicación de equipos
- Notificaciones push
- Sincronización en la nube
- Autenticación de usuarios
- Reportes PDF avanzados

---

**Versión**: 1.0  
**Última Actualización**: Julio 2026  
**Estado**: Operacional para emergencia
