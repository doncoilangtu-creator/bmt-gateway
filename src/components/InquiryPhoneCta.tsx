import React from 'react';

export default function InquiryPhoneCta({ phone = '0877 700 089', tel = '0877700089' }: { phone?: string; tel?: string }) {
  return (
    <a href={`tel:${tel}`} className="v2-inquiry-sliding-cta group" aria-label={`Gọi hotline tư vấn: ${phone}`}>
      {/* Original text (slides down on hover) */}
      <span className="v2-cta-label-main" data-editable-key="settings.hotline">
        {phone}
      </span>

      {/* Clone text (slides in from top on hover) */}
      <span className="v2-cta-label-clone" aria-hidden="true">
        Gọi ngay {phone}
      </span>

      {/* ThreeUI copper bottom glow underline */}
      <span aria-hidden="true" className="v2-cta-glow-line" />

      {/* ThreeUI ambient bottom light gradient on hover */}
      <span aria-hidden="true" className="v2-cta-ambient" />
    </a>
  );
}
