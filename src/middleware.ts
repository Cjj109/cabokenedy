import { defineMiddleware } from 'astro:middleware';
import { validateSession, parseCookies } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // Only protect admin routes
  if (!path.startsWith('/admin') && !path.startsWith('/api/admin')) {
    return next();
  }

  // Allow login page and login API without auth
  if (path === '/admin/login' || path === '/api/admin/login') {
    return next();
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

  return next();
});
