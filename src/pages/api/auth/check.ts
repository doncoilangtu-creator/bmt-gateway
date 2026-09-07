import type { APIRoute } from 'astro';
import { verifyAuthToken, getTokenFromRequest } from '../../../lib/auth';

export const GET: APIRoute = async ({ request }) => {
  const token = getTokenFromRequest(request);
  const auth = verifyAuthToken(token);

  if (!auth.valid) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ authenticated: true, username: auth.username }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
