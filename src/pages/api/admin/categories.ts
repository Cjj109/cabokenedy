import type { APIRoute } from 'astro';
import { getAllCategories, updateCategory } from '../../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database;

  const categories = await getAllCategories(db);

  return new Response(JSON.stringify(categories), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PUT: APIRoute = async ({ request, locals }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database;

  const data = await request.json();

  if (!data.id) {
    return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
  }

  await updateCategory(db, data.id, {
    title: data.title?.trim(),
    icon: data.icon,
    visible: data.visible !== undefined ? (data.visible ? 1 : 0) : undefined,
    sort_order: data.sort_order,
  });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
