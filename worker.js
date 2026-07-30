// Worker de APP Emergencia Illapel
// Sirve los archivos estáticos de la app y expone una API mínima que
// guarda los datos compartidos en Cloudflare D1 (base de datos SQL),
// usada aquí como un almacén clave-valor simple (una fila por clave,
// con el JSON completo de esa sección). Se migró desde Workers KV
// porque el plan gratis de KV solo permite 1.000 escrituras/día, un
// límite que se agotaba en minutos con ~10 usuarios conectados a la
// vez. D1 gratis permite 100.000 escrituras/día, sin cambiar en nada
// el modelo de datos ni el código del cliente (app.html sigue
// llamando a /api/kv/<clave> exactamente igual).

// Cualquier clave que empiece con "illapel_" está permitida. Se usa un
// prefijo en vez de una lista fija porque la app sincroniza cada
// sección (emergencias, acopio, egresos, etc.) en su propia clave para que
// dos usuarios trabajando en secciones distintas no se pisen entre sí.
function esClavePermitida(key) {
  return typeof key === 'string' && key.startsWith('illapel_');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/kv/')) {
      return handleKvRequest(request, env, url);
    }

    // Cualquier otra ruta: servir los archivos estáticos de la app
    return env.ASSETS.fetch(request);
  }
};

async function handleKvRequest(request, env, url) {
  const key = decodeURIComponent(url.pathname.replace('/api/kv/', ''));

  if (!esClavePermitida(key)) {
    return jsonResponse({ error: 'Clave no permitida' }, 400);
  }

  if (request.method === 'GET') {
    return handleGet(key, env);
  }

  if (request.method === 'PUT') {
    return handlePut(key, request, env);
  }

  return jsonResponse({ error: 'Método no permitido' }, 405);
}

async function handleGet(key, env) {
  const row = await env.DB
    .prepare('SELECT value FROM kv_store WHERE key = ?')
    .bind(key)
    .first();

  if (row) {
    return new Response(row.value, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Respaldo temporal: si la clave todavía no existe en D1 (por ejemplo,
  // justo después de migrar), buscarla en el KV antiguo y copiarla a D1
  // para no tener que volver a consultar KV la próxima vez. Si el
  // binding APP_KV ya no está configurado en wrangler.toml, esto se
  // salta solo y responde null como antes.
  if (env.APP_KV) {
    const legacyValue = await env.APP_KV.get(key);
    if (legacyValue !== null) {
      await guardarEnD1(env, key, legacyValue);
      return new Response(legacyValue, {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return jsonResponse(null, 200);
}

async function handlePut(key, request, env) {
  let body;
  try {
    body = await request.text();
    JSON.parse(body); // validar que sea JSON válido
  } catch (err) {
    return jsonResponse({ error: 'JSON inválido' }, 400);
  }

  await guardarEnD1(env, key, body);
  return jsonResponse({ ok: true }, 200);
}

async function guardarEnD1(env, key, value) {
  await env.DB
    .prepare(
      `INSERT INTO kv_store (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
    )
    .bind(key, value, new Date().toISOString())
    .run();
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
