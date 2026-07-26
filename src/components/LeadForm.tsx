import { useState } from 'react';

const interests = ['Căn hộ 1BR+', 'Căn hộ 2BR', 'Căn hộ 3BR', 'Townhouse', 'Shophouse', 'Nhà ở xã hội', 'Nhận brochure / bảng giá'];

export default function LeadForm({ source = 'lead-section' }: { source?: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    setMessage('');
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Không gửi được thông tin.');
      setStatus('success');
      setMessage('Đã nhận thông tin. Đội ngũ tư vấn sẽ liên hệ lại sớm.');
      form.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra.');
    }
  }

  return (
    <form className="lead-form" onSubmit={onSubmit}>
      <input name="company" className="hp" tabIndex={-1} autoComplete="off" />
      <label>
        Họ và tên
        <input name="name" required placeholder="Nguyễn Văn A" />
      </label>
      <label>
        Số điện thoại
        <input name="phone" required inputMode="tel" placeholder="0900 000 000" />
      </label>
      <label>
        Nhu cầu quan tâm
        <select name="interest" defaultValue="" required>
          <option value="" disabled>Chọn nhu cầu</option>
          {interests.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label>
        Ghi chú
        <textarea name="note" rows={4} placeholder="Anh/chị muốn nhận mặt bằng, chính sách hay brochure?" />
      </label>
      <button disabled={status === 'sending'} type="submit">
        {status === 'sending' ? 'Đang gửi...' : 'Gửi thông tin'}
      </button>
      {message && <p className={status}>{message}</p>}
    </form>
  );
}
