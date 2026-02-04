import type { APIRoute } from 'astro';
import { createMenuItem, getAllMenuItems, getItemVariants, createItemVariant } from '../../../lib/db';

export const GET: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database;
  const url = new URL(request.url);
  const categoryId = url.searchParams.get('category');

  if (!categoryId) {
    return new Response(JSON.stringify({ error: 'category required' }), { status: 400 });
  }

  const items = await getAllMenuItems(db, categoryId);

  // Fetch variants for each item
  const itemsWithVariants = await Promise.all(items.map(async (item) => {
    const variants = await getItemVariants(db, item.id);
    return { ...item, variants };
  }));

  return new Response(JSON.stringify(itemsWithVariants), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database;

  const data = await request.json();

  // Validate
  if (!data.category_id || !data.name || data.price_usd === undefined) {
    return new Response(JSON.stringify({ error: 'category_id, name, and price_usd required' }), { status: 400 });
  }

  if (typeof data.name !== 'string' || data.name.length > 200) {
    return new Response(JSON.stringify({ error: 'name must be string under 200 chars' }), { status: 400 });
  }

  if (typeof data.price_usd !== 'number' || data.price_usd < 0 || data.price_usd > 9999) {
    return new Response(JSON.stringify({ error: 'price_usd must be number 0-9999' }), { status: 400 });
  }

  const itemId = await createMenuItem(db, {
    category_id: data.category_id,
    name: data.name.trim(),
    description: (data.description || '').trim().slice(0, 500),
    price_usd: data.price_usd,
    popular: data.popular ? 1 : 0,
    badge: (data.badge || '').trim().slice(0, 50),
    sort_order: data.sort_order || 0,
  });

  // Create variants if provided
  if (Array.isArray(data.variants)) {
    for (let i = 0; i < data.variants.length; i++) {
      const v = data.variants[i];
      if (v.label && v.price_usd !== undefined) {
        await createItemVariant(db, {
          menu_item_id: itemId,
          label: String(v.label).trim().slice(0, 100),
          price_usd: Number(v.price_usd),
          sort_order: i + 1,
        });
      }
    }
  }

  return new Response(JSON.stringify({ id: itemId }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
