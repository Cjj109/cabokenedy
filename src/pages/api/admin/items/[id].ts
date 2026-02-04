import type { APIRoute } from 'astro';
import { updateMenuItem, deleteMenuItem, deleteItemVariant, createItemVariant } from '../../../../lib/db';

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database;
  const id = Number(params.id);

  if (!id) {
    return new Response(JSON.stringify({ error: 'invalid id' }), { status: 400 });
  }

  const data = await request.json();

  // Validate fields if present
  if (data.name !== undefined && (typeof data.name !== 'string' || data.name.length > 200)) {
    return new Response(JSON.stringify({ error: 'name must be string under 200 chars' }), { status: 400 });
  }

  if (data.price_usd !== undefined && (typeof data.price_usd !== 'number' || data.price_usd < 0 || data.price_usd > 9999)) {
    return new Response(JSON.stringify({ error: 'price_usd must be number 0-9999' }), { status: 400 });
  }

  await updateMenuItem(db, id, {
    name: data.name?.trim(),
    description: data.description !== undefined ? String(data.description).trim().slice(0, 500) : undefined,
    price_usd: data.price_usd,
    popular: data.popular !== undefined ? (data.popular ? 1 : 0) : undefined,
    badge: data.badge !== undefined ? String(data.badge).trim().slice(0, 50) : undefined,
    visible: data.visible !== undefined ? (data.visible ? 1 : 0) : undefined,
  });

  // Update variants if provided
  if (Array.isArray(data.variants)) {
    // Delete existing variants
    const { results: existing } = await db.prepare(
      'SELECT id FROM item_variants WHERE menu_item_id = ?'
    ).bind(id).all<{ id: number }>();

    for (const v of existing) {
      await deleteItemVariant(db, v.id);
    }

    // Create new variants
    for (let i = 0; i < data.variants.length; i++) {
      const v = data.variants[i];
      if (v.label && v.price_usd !== undefined) {
        await createItemVariant(db, {
          menu_item_id: id,
          label: String(v.label).trim().slice(0, 100),
          price_usd: Number(v.price_usd),
          sort_order: i + 1,
        });
      }
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database;
  const id = Number(params.id);

  if (!id) {
    return new Response(JSON.stringify({ error: 'invalid id' }), { status: 400 });
  }

  await deleteMenuItem(db, id);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
