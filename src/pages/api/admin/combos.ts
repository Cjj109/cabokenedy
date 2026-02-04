import type { APIRoute } from 'astro';
import { getAllCombos } from '../../../lib/db';

export const GET: APIRoute = async ({ locals }) => {
  const runtime = (locals as any).runtime;
  const db = runtime?.env?.DB as D1Database;

  const combos = await getAllCombos(db);

  return new Response(JSON.stringify(combos), {
    headers: { 'Content-Type': 'application/json' },
  });
};
