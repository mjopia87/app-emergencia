// Worker de APP Emergencia Illapel
// Sirve los archivos estáticos de la app y expone una API mínima
// respaldada por Cloudflare KV para compartir los datos entre dispositivos.

const ALLOWED_KEYS = ['illapel_db', 'illapel_users_db', 'illapel_activity_log'];

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

  if (!ALLOWED_KEYS.includes(key)) {
    return jsonResponse({ error: 'Clave no permitida' }, 400);
  }

  if (request.method === 'GET') {
    const value = await env.APP_KV.get(key);
    if (value === null) {
      return jsonResponse(null, 200);
    }
    return new Response(value, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (request.method === 'PUT') {
    let body;
    try {
      body = await request.text();
      JSON.parse(body); // validar que sea JSON válido
    } catch (err) {
      return jsonResponse({ error: 'JSON inválido' }, 400);
    }

    await env.APP_KV.put(key, body);
    return jsonResponse({ ok: true }, 200);
  }

  return jsonResponse({ error: 'Método no permitido' }, 405);
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
