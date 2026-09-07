import crypto from 'node:crypto';

const AUTH_SECRET = process.env.ADMIN_SECRET || 'eracity-secret-key-2026-bmt';
const DEFAULT_USER = process.env.ADMIN_USER || 'admin';
const DEFAULT_PASS = process.env.ADMIN_PASSWORD || 'eracity2026';

export function validateCredentials(user: string, pass: string): boolean {
  return user === DEFAULT_USER && pass === DEFAULT_PASS;
}

export function createAuthToken(username: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 ngày
  const data = `${username}:${expiresAt}`;
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('hex');
  return Buffer.from(`${data}:${sig}`).toString('base64');
}

export function verifyAuthToken(token: string | null | undefined): { valid: boolean; username?: string } {
  if (!token) return { valid: false };
  try {
    const raw = Buffer.from(token, 'base64').toString('utf-8');
    const [username, expiresAtStr, sig] = raw.split(':');
    if (!username || !expiresAtStr || !sig) return { valid: false };

    const expiresAt = parseInt(expiresAtStr, 10);
    if (Date.now() > expiresAt) return { valid: false };

    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(`${username}:${expiresAtStr}`).digest('hex');
    if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
      return { valid: true, username };
    }
    return { valid: false };
  } catch (e) {
    return { valid: false };
  }
}

export function getTokenFromRequest(request: Request): string | null {
  // 1. Kiểm tra header Authorization
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }

  // 2. Kiểm tra Cookie
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/eracity_admin_token=([^;]+)/);
    if (match) return match[1];
  }

  return null;
}
