# Respaldos automáticos

Cada noche a las 23:59 (hora Chile) el workflow `.github/workflows/backup.yml`
guarda acá un archivo `YYYY-MM-DD.json.enc` con una copia completa de todos
los datos de la app (todo lo que hay en la tabla `kv_store` de la base D1:
requerimientos, acopio, egresos, beneficiarios, equipos, móviles,
localidades, papelera, usuarios y el log de actividad).

Los archivos están **cifrados** con AES-256 usando una clave que solo
existe como secret de GitHub (`BACKUP_ENCRYPTION_KEY`) y en tu propio
respaldo personal de esa clave. Sin esa clave, estos archivos no sirven de
nada — ni siquiera con acceso al repositorio se puede leer el contenido.

## Cómo restaurar un respaldo

Necesitas `openssl` (viene instalado en Mac y Linux) y la clave de
cifrado (`BACKUP_ENCRYPTION_KEY`).

1. Descifrar el archivo:

   ```
   openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 \
     -pass pass:LA_CLAVE_AQUI \
     -in backups/2026-07-30.json.enc \
     -out backup_descifrado.json
   ```

2. `backup_descifrado.json` queda como un array de filas
   `{"key": "illapel_...", "value": "...", "updated_at": "..."}`, uno por
   cada sección de la app. El campo `value` es el JSON completo de esa
   sección (el mismo formato que devuelve `/api/kv/<clave>`).

3. Para restaurar una sección puntual en producción, se puede volver a
   subir su valor con:

   ```
   wrangler d1 execute app-emergencia-db --remote --command \
     "INSERT INTO kv_store (key, value, updated_at) VALUES ('illapel_acopio', '<value aquí>', '<fecha>') ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at"
   ```

   (Reemplazando `illapel_acopio` y el valor por la sección que se quiera
   restaurar, tomados del JSON descifrado.)

**Importante:** guarda `BACKUP_ENCRYPTION_KEY` en un lugar seguro fuera de
GitHub (por ejemplo, un gestor de contraseñas). GitHub no permite volver a
ver el valor de un secret una vez guardado -- si se pierde la clave, estos
respaldos quedan inutilizables.
