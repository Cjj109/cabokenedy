import type { APIRoute } from 'astro';
import { getAllPromos, updatePromo } from '../../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database;

  const promos = await getAllPromos(db);

  return new Response(JSON.stringify(promos), {
    headers: { 'Content-Type': 'application/json' },
  });
};
