import { defineMiddleware } from 'astro:middleware';
import { validateSession, parseCookies } from './lib/auth';

/**
 * El HTML se arma en cada visita, pero sale sin cabecera de cache y el
 * navegador se queda con la copia vieja: la gente sigue viendo una version
 * anterior de la pagina hasta que recarga a la fuerza. El _headers de Pages
 * no llega hasta aqui porque estas rutas las sirve el Worker, no el manejador
 * de archivos estaticos, asi que la cabecera se pone aqui.
 */
async function frescoSiEsHtml(next: () => Promise<Response>): Promise<Response> {
  const respuesta = await next();
  const tipo = respuesta.headers.get('content-type') || '';
  if (!tipo.includes('text/html')) return respuesta;

  const cabeceras = new Headers(respuesta.headers);
  cabeceras.set('Cache-Control', 'public, max-age=0, must-revalidate');
  return new Response(respuesta.body, {
    status: respuesta.status,
    statusText: respuesta.statusText,
    headers: cabeceras,
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Only protect admin routes
  if (!path.startsWith('/admin') && !path.startsWith('/api/admin')) {
    return frescoSiEsHtml(next);
  }

  // Allow login page and login API without auth
  if (path === '/admin/login' || path === '/api/admin/login') {
    return frescoSiEsHtml(next);
  }

  // Get D1 binding
  const runtime = (context.locals as any).runtime;
  const db = runtime?.env?.DB as D1Database | undefined;

  if (!db) {
    // D1 not available - redirect to login
    return context.redirect('/admin/login');
  }

  // Check session cookie
  const cookies = parseCookies(context.request);
  const sessionId = cookies['admin_session'];

  if (!sessionId) {
    return context.redirect('/admin/login');
  }

  // Validate session in D1
  const valid = await validateSession(db, sessionId);
  if (!valid) {
    return context.redirect('/admin/login');
  }

  return frescoSiEsHtml(next);
});
