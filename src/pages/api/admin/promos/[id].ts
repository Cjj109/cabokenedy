import type { APIRoute } from 'astro';
import { updatePromo } from '../../../../lib/db';

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database;
  const id = params.id!;

  const data = await request.json();

  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.length > 200)) {
    return new Response(JSON.stringify({ error: 'name must be string under 200 chars' }), { status: 400 });
  }

  if (data.price_usd !== undefined && (typeof data.price_usd !== 'number' || data.price_usd < 0 || data.price_usd > 9999)) {
    return new Response(JSON.stringify({ error: 'price_usd must be number 0-9999' }), { status: 400 });
  }

  await updatePromo(db, id, {
    name: data.name?.trim(),
    description: data.description !== undefined ? String(data.description).trim().slice(0, 500) : undefined,
    price_usd: data.price_usd,
    icon: data.icon,
    badge: data.badge !== undefined ? String(data.badge).trim().slice(0, 50) : undefined,
    image: data.image,
    visible: data.visible !== undefined ? (data.visible ? 1 : 0) : undefined,
    sort_order: data.sort_order,
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
