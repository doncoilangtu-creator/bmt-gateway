import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { verifyAuthToken, getTokenFromRequest } from '../../lib/auth';

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sVal = source[key];
    const tVal = target[key];
    if (
      sVal &&
      typeof sVal === 'object' &&
      !Array.isArray(sVal) &&
      tVal &&
      typeof tVal === 'object' &&
      !Array.isArray(tVal)
    ) {
      result[key] = deepMerge(tVal as Record<string, unknown>, sVal as Record<string, unknown>);
    } else {
      result[key] = sVal;
    }
  }
  return result;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const token = getTokenFromRequest(request);
    const auth = verifyAuthToken(token);
    if (!auth.valid) {
      return new Response(
        JSON.stringify({ message: 'Bạn chưa đăng nhập quản trị viên. Vui lòng đăng nhập để lưu.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const body = await request.json();
    const { target, data } = body;

    const contentDir = path.resolve(process.cwd(), 'content');

    if (target === 'home') {
      const filePath = path.join(contentDir, 'pages', 'home.json');
      const existing = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      const updated = deepMerge(existing, data);
      await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');
      return new Response(JSON.stringify({ ok: true, message: 'Đã lưu trang chủ thành công!' }), { status: 200 });
    }

    if (target === 'settings') {
      const filePath = path.join(contentDir, 'settings', 'project.json');
      const existing = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      const updated = deepMerge(existing, data);
      await fs.writeFile(filePath, JSON.stringify(updated, null, 2), 'utf-8');
      return new Response(JSON.stringify({ ok: true, message: 'Đã lưu thông tin dự án thành công!' }), { status: 200 });
    }

    if (target === 'pins') {
      const filePath = path.join(contentDir, 'amenities', 'masterplan.json');
      const existing = JSON.parse(await fs.readFile(filePath, 'utf-8'));
      existing.pins = { ...(existing.pins || {}), ...data };
      await fs.writeFile(filePath, JSON.stringify(existing, null, 2), 'utf-8');
      return new Response(JSON.stringify({ ok: true, message: 'Đã lưu tọa độ pin tiện ích thành công!' }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'Target không hợp lệ.' }), { status: 400 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Lỗi không xác định khi lưu.';
    return new Response(JSON.stringify({ message: msg }), { status: 500 });
  }
};
