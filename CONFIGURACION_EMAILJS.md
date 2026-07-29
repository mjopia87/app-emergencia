# ⚙️ Configuración EmailJS Actualizada

## ✅ Credenciales Integradas

- **Service ID:** `service_f6xmqoa`
- **Template ID:** `template_5itxn0q`
- **Public Key:** `tUG7Nzla7OIiwTIDZ`

## 📧 Variables del Template

Asegúrate de que tu template en EmailJS tenga estas variables:

```
{{to_email}}           - Correo del usuario
{{to_name}}            - Nombre del usuario
{{verification_code}}  - Código de 6 dígitos
{{app_name}}           - Nombre de la app
```

## 🧪 Cómo Probar

1. **Abre la app** y ve a login
2. **Ingresa:**
   - Nombre: `Juan Perez`
   - Correo: `tu-correo@gmail.com`
   - RUT: `12345678-9`

3. **Abre DevTools** (F12 → Console)
4. **Busca:** 
   - `✅ Correo enviado exitosamente` = Éxito
   - `❌ Error enviando correo` = Verifica la consola

5. **Si hay error**, verifica:
   - Service ID es correcto
   - Template ID es correcto
   - Variables del template coinciden
   - Email está habilitado en EmailJS

## 📝 Nombres de Variables Alternativos

Si tu template usa otros nombres, actualiza en `app.html` línea ~1762:

```javascript
const templateParams = {
    to_email: correo,          // Cambiar si usas otra variable
    to_name: usuario,           // Cambiar si usas otra variable
    verification_code: codigo,  // Cambiar si usas otra variable
    app_name: 'APP Emergencia'  // Cambiar si usas otra variable
};
```

## 🔍 Debugging

Los logs aparecerán en Console:
- ✅ `EmailJS inicializado correctamente`
- 📧 `Enviando correo a: usuario@correo.com`
- ✅ `Correo enviado exitosamente`
- ❌ `Error enviando correo: [mensaje]`

---

**Estado:** ✅ Listo para producción

Recarga la página y prueba. El código funcionará con correos reales.
