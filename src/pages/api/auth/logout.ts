import type { APIRoute } from 'astro';

export const POST: APIRoute = async () => {
  const expiredCookie = 'eracity_admin_token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
  return new Response(JSON.stringify({ ok: true, message: 'Đã đăng xuất.' }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': expiredCookie,
    },
  });
};
