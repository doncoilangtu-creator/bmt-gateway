import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(2, 'Vui lòng nhập họ tên.'),
  phone: z
    .string()
    .regex(/^(0|\+84)[0-9\s.-]{8,13}$/, 'Số điện thoại khong hop le.'),
  interest: z.string().optional().default('Chua chon'),
  note: z.string().optional().default(''),
  source: z.string().optional().default('unknown'),
  company: z.string().optional().default(''),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const lead = leadSchema.parse(body);

    if (lead.company) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    }

    const host = import.meta.env.SMTP_HOST;
    const port = Number(import.meta.env.SMTP_PORT || 465);
    const user = import.meta.env.SMTP_USER;
    const pass = import.meta.env.SMTP_PASS;
    const to = import.meta.env.LEAD_TO_EMAIL || user;

    if (!host || !user || !pass || !to) {
      return new Response(
        JSON.stringify({ message: 'Chưa cấu hình SMTP trong file .env.' }),
        { status: 500 },
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const submittedAt = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const text = [
      'Lead moi tu EraCity',
      '',
      `Ho ten: ${lead.name}`,
      `Số điện thoại: ${lead.phone}`,
      `Nhu cau: ${lead.interest}`,
      `Ghi chú: ${lead.note || '-'}`,
      `Nguon form: ${lead.source}`,
      `Thoi gian: ${submittedAt}`,
    ].join('\n');

    await transporter.sendMail({
      from: `EraCity <${user}>`,
      to,
      subject: `Lead moi EraCity - ${lead.phone}`,
      text,
      replyTo: user,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    const message = error instanceof z.ZodError
      ? error.issues[0]?.message || 'Thông tin không hợp lệ.'
      : 'Không gửi được thông tin.';
    return new Response(JSON.stringify({ message }), { status: 400 });
  }
};
