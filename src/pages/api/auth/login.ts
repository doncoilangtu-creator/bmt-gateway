import type { APIRoute } from 'astro';
import { validateCredentials, createAuthToken } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ message: 'Vui lòng nhập tài khoản và mật khẩu.' }), { status: 400 });
    }

    if (!validateCredentials(username, password)) {
      return new Response(JSON.stringify({ message: 'Tài khoản hoặc mật khẩu không chính xác.' }), { status: 401 });
    }

    const token = createAuthToken(username);
    const isProd = process.env.NODE_ENV === 'production';
    const cookie = `eracity_admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 3600}${isProd ? '; Secure' : ''}`;

    return new Response(
      JSON.stringify({ ok: true, username, token, message: 'Đăng nhập thành công!' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': cookie,
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Lỗi xử lý đăng nhập.' }), { status: 500 });
  }
};
