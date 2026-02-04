import type { APIRoute } from 'astro';
import { parseCookies, deleteSession, clearSessionCookieHeader } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database | undefined;

  if (db) {
    const cookies = parseCookies(request);
    const sessionId = cookies['admin_session'];
    if (sessionId) {
      await deleteSession(db, sessionId);
    }
  }

  const isSecure = new URL(request.url).protocol === 'https:';
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/admin/login',
      'Set-Cookie': clearSessionCookieHeader(isSecure),
    },
  });
};
