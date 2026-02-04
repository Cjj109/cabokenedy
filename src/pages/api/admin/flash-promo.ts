import type { APIRoute } from 'astro';
import { getFlashPromo, updateFlashPromo } from '../../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database;

  const flash = await getFlashPromo(db);

  return new Response(JSON.stringify(flash), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PUT: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database;

  const data = await request.json();

  if (data.price_usd !== undefined && (typeof data.price_usd !== 'number' || data.price_usd < 0 || data.price_usd > 9999)) {
    return new Response(JSON.stringify({ error: 'price_usd must be number 0-9999' }), { status: 400 });
  }

  await updateFlashPromo(db, {
    name: data.name?.trim(),
    description: data.description !== undefined ? String(data.description).trim().slice(0, 500) : undefined,
    price_usd: data.price_usd,
    availability: data.availability?.trim(),
    channels: data.channels?.trim(),
    icon: data.icon,
    image: data.image,
    active: data.active !== undefined ? (data.active ? 1 : 0) : undefined,
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
