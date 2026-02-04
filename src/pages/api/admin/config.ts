import type { APIRoute } from 'astro';
import { getSiteConfig, setSiteConfig } from '../../../lib/db';
import { hashPassword, verifyPassword, parseCookies } from '../../../lib/auth';

export const GET: APIRoute = async ({ locals }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database;

  const config = await getSiteConfig(db);

  return new Response(JSON.stringify(config), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PUT: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database;

  const data = await request.json();

  // Update allowed config keys
  const allowedKeys = ['active_theme', 'tasa_bcv_fallback', 'whatsapp_number', 'business_hours'];

  for (const key of allowedKeys) {
    if (data[key] !== undefined) {
      await setSiteConfig(db, key, String(data[key]).trim());
    }
  }

  // Handle password change separately
  if (data.new_password && data.current_password) {
    const passwordHash = runtime?.env?.ADMIN_PASSWORD_HASH as string;
    const valid = await verifyPassword(data.current_password, passwordHash);
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Contraseña actual incorrecta' }), { status: 400 });
    }
    // Note: Password hash is stored as env var, can't update it from here.
    // The admin would need to update it via wrangler CLI.
    return new Response(JSON.stringify({ error: 'Para cambiar la contraseña, usa: npx wrangler secret put ADMIN_PASSWORD_HASH' }), { status: 400 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
