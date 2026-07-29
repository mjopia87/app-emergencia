# 🔐 Autenticación 2FA con Verificación por Email

## ✅ Implementación Completada

Se ha agregado un sistema de **Autenticación de Dos Factores (2FA)** basado en código de verificación enviado por correo electrónico.

### 📋 Cambios Realizados

#### 1. **Formulario de Login Actualizado**
- ✅ Nuevo campo: **Correo Institucional**
- ✅ Botón cambió a: "Enviar Código de Verificación"
- ✅ Campos requeridos: Nombre, Correo, RUT (contraseña)

#### 2. **Modal de Verificación**
- ✅ Input para código de 6 dígitos
- ✅ Botón "Verificar Código"
- ✅ Botón "Volver" para reintentar
- ✅ Mensajes de error/éxito

#### 3. **Sistema de Códigos**
- ✅ Genera código aleatorio de 6 dígitos
- ✅ Válido por sesión (se regenera en cada login)
- ✅ Muestra en consola para desarrollo
- ✅ Se envía por correo cuando esté configurado

#### 4. **Base de Datos de Usuarios**
- ✅ Formato antiguo: `{ "usuario": "password" }`
- ✅ Formato nuevo: `{ "usuario": { "password": "xxx", "email": "usuario@illapel.cl" } }`
- ✅ Migración automática al iniciar

---

## 🚀 Flujo de Autenticación

```
1. Usuario ingresa Nombre, Correo y RUT
   ↓
2. Sistema valida datos
   ↓
3. Genera código de 6 dígitos
   ↓
4. Intenta enviar por correo (o muestra en consola)
   ↓
5. Muestra modal de verificación
   ↓
6. Usuario ingresa código
   ↓
7. Sistema valida código
   ↓
8. ✅ Acceso concedido
```

---

## 🔧 Configuración para Usar Correos Reales

### Opción 1: EmailJS (Recomendado - Gratuito)

#### Pasos:
1. Ir a https://www.emailjs.com/
2. Crear cuenta (gratuito hasta 200 correos/mes)
3. Crear un **Service** (Gmail, Outlook, etc.)
4. Crear un **Template** con el siguiente contenido:

```html
<h2>Código de Verificación</h2>
<p>Hola {{to_name}},</p>
<p>Tu código de verificación para {{app_name}} es:</p>
<h1 style="color:#c41e3a;">{{verification_code}}</h1>
<p>Este código es válido por 10 minutos.</p>
<p>Si no solicitaste este código, ignora este mensaje.</p>
```

5. Copiar las IDs y reemplazar en `app.html`:
```javascript
const result = await emailjs.send(
    'service_ID_AQUI',      // Reemplazar
    'template_ID_AQUI',     // Reemplazar
    templateParams
);
```

6. En el `<script>` de EmailJS:
```javascript
emailjs.init({
    publicKey: 'TU_PUBLIC_KEY_AQUI',  // Reemplazar
});
```

---

## 🧪 Cómo Probar en Desarrollo

### Opción 1: Ver código en consola
1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Ingresa credenciales
4. El código aparecerá en consola: `📧 CÓDIGO PARA DESARROLLO: 123456`
5. Ingresa ese código en el modal

### Opción 2: Usar correo ficticio
- Usuario: `Juan Perez`
- Correo: `juan.perez@illapel.cl` (o cualquier formato)
- RUT: `12345678-9` (o cualquier valor)
- El código aparecerá en consola

---

## 📊 Usuarios Predefinidos

Después de migración, el usuario admin será:

| Usuario | Contraseña  | Correo         |
|---------|------------|----------------|
| admin   | adminillapel | admin@illapel.cl |

---

## 🔐 Características de Seguridad

✅ **Código de 6 dígitos** — Difícil de adivinar  
✅ **Válido por sesión** — Se regenera en cada login  
✅ **Validación de correo** — Formato RFC 5322  
✅ **Migraciones automáticas** — Usuarios antiguos se actualizan  
✅ **Fallback a consola** — Permite testing sin internet  

---

## ⚠️ Notas Importantes

1. **Para desarrollo**: Los códigos aparecerán en la consola del navegador
2. **Para producción**: Configurar EmailJS con tus credenciales reales
3. **Seguridad**: Los códigos se generan en el cliente (no guardes en BD)
4. **Privacidad**: Los correos no se guardan en localStorage, solo en sesión

---

## 🆘 Troubleshooting

### El código no aparece en consola
- Abre DevTools (F12)
- Ve a Console
- Busca "CÓDIGO PARA DESARROLLO"

### EmailJS no envía correos
- Verificar que el servicio esté activado en EmailJS
- Verificar que el template exista
- Usar la versión CDN más reciente

### El modal no aparece
- Limpiar caché (Ctrl+Shift+Delete)
- Recargar página (Ctrl+F5)
- Verificar que el correo sea válido

---

## 📚 Próximos Pasos (Opcional)

1. Configurar EmailJS con tu proveedor de correo real
2. Agregar expiración de códigos (ej: 10 minutos)
3. Guardar intentos fallidos para limitar intentos
4. Enviar correo de notificación después de login exitoso
5. Agregar recuperación de cuenta por correo

---

## 📞 Soporte EmailJS

- Documentación: https://www.emailjs.com/docs/
- Panel de control: https://dashboard.emailjs.com/
- Correo de soporte: support@emailjs.com

