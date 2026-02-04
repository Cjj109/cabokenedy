import type { APIRoute } from 'astro';
import { verifyPassword, createSession, sessionCookieHeader, checkBruteForce, recordLoginAttempt } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database | undefined;
  const passwordHash = runtime?.env?.ADMIN_PASSWORD_HASH as string | undefined;

  if (!db || !passwordHash) {
    return redirect('/admin/login?error=no-db');
  }

  // Get client IP
  const ip = request.headers.get('CF-Connecting-IP') ||
             request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
             '0.0.0.0';

  // Check brute force
  const blocked = await checkBruteForce(db, ip);
  if (blocked) {
    return redirect('/admin/login?error=blocked');
  }

  // Parse form data
  const formData = await request.formData();
  const password = formData.get('password') as string;

  if (!password) {
    return redirect('/admin/login?error=wrong');
  }

  // Verify password
  const valid = await verifyPassword(password, passwordHash);

  // Record attempt
  await recordLoginAttempt(db, ip, valid);

  if (!valid) {
    return redirect('/admin/login?error=wrong');
  }

  // Create session
  const sessionId = await createSession(db);

  // Redirect to dashboard with session cookie
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/admin/dashboard',
      'Set-Cookie': sessionCookieHeader(sessionId),
    },
  });
};
