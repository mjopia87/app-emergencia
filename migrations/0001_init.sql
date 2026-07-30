-- Tabla clave-valor: reemplaza a Workers KV con el mismo modelo de datos
-- (una fila por clave "illapel_*", con el JSON completo de esa sección
-- como texto). No es una migración a tablas relacionales; es un cambio
-- de backend de almacenamiento manteniendo intacta la lógica del
-- cliente (guardarSeccion, apiGetKey/apiPutKey en app.html).
CREATE TABLE IF NOT EXISTS kv_store (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
