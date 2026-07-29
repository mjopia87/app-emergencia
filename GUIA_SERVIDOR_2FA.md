# 🚀 Configuración del Servidor 2FA

## 📋 Requisitos

- **Node.js** instalado (v14+)
- **npm** o **yarn**
- Las credenciales de EmailJS ya configuradas

---

## 🔧 Instalación

### 1. Instalar dependencias

```bash
cd "APP Emergencia"
npm install
```

Esto instala:
- `express` - Framework web
- `cors` - Habilitar acceso desde la app
- `axios` - Llamadas HTTP
- `dotenv` - Variables de entorno

### 2. Configurar variables de entorno (Opcional)

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

O crea `.env` manualmente con:

```
PORT=3001
EMAILJS_SERVICE_ID=service_f6xmqoa
EMAILJS_TEMPLATE_ID=template_5itxn0q
EMAILJS_PUBLIC_KEY=tUG7Nzla7OIiwTIDZ
```

---

## ▶️ Ejecutar el servidor

```bash
npm start
```

Deberías ver:

```
╔═════════════════════════════════════════╗
║  🚀 Servidor de Verificación Iniciado  ║
╚═════════════════════════════════════════╝

📍 Servidor: http://localhost:3001
✅ Salud: http://localhost:3001/health
📧 Enviar código: POST http://localhost:3001/send-verification
```

---

## 🧪 Probar el servidor

### Verificar que está activo

```bash
curl http://localhost:3001/health
```

Respuesta esperada:

```json
{
  "status": "✅ Servidor de verificación activo"
}
```

### Enviar correo de prueba

```bash
curl -X POST http://localhost:3001/send-verification \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "Juan Perez",
    "correo": "tu-correo@gmail.com",
    "codigo": "123456"
  }'
```

Respuesta esperada:

```json
{
  "success": true,
  "message": "Código enviado correctamente",
  "recipient": "tu-correo@gmail.com"
}
```

---

## 🔗 Integración con la app

La app ahora está configurada para:

1. Intentar enviar por el servidor backend
2. Si el servidor no está disponible → modo fallback (código en consola)
3. Mostrar instrucciones claras en la consola

**Al iniciar sesión:**
- Si el servidor está corriendo → **correo real** ✅
- Si el servidor no está → **código en consola** (para testing)

---

## 📊 Flujo de autenticación 2FA

```
App Frontend                Server Backend              EmailJS
     │                            │                        │
     ├─→ Login con correo ──→ POST /send-verification ────→│
     │                            │                        │
     │                            ├─→ Valida datos ────→   │
     │                            │                        │
     │                            ├─→ Llama EmailJS API   │
     │                            │                        │
     │                            │← Respuesta 200 OK ←────┤
     │                            │                        │
     │                            ├─→ Log de éxito        │
     │                            │                        │
     │←─── Respuesta JSON ←──────┤                        │
     │                            │                        │
     ├─→ Muestra modal verificación
     │
     ├─→ Usuario ingresa código
     │
     ├─→ Verifica código
     │
     └─→ ✅ Acceso concedido
```

---

## 🆘 Troubleshooting

### "Cannot find module 'express'"

Solución:
```bash
npm install
```

### "ECONNREFUSED: connection refused"

El servidor no está corriendo. Ejecuta:
```bash
npm start
```

### "Código enviado correctamente pero no llega correo"

Verifica:
1. El template en EmailJS esté bien configurado
2. El servicio de Gmail esté activado en EmailJS
3. Revisa spam/junk en tu correo

### "Error de CORS"

El servidor necesita estar corriendo en `http://localhost:3001`. Si accedes desde otra URL, puede haber problemas de CORS.

---

## 📦 Desplegar a Producción

Para desplegar en un servidor real (ej: Heroku, AWS, DigitalOcean):

1. Actualiza `app.html` con la URL del servidor:
```javascript
const apiUrl = 'https://tu-servidor.com/send-verification';
```

2. Configura las variables de entorno en tu servidor hosting

3. Ejecuta `npm start` en el servidor

---

## 📞 Soporte

Si hay problemas:
1. Abre DevTools (F12) → Console
2. Busca errores de red o validación
3. Verifica que el servidor esté corriendo
4. Verifica las credenciales de EmailJS

