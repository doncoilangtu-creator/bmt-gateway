import { useState } from 'react';
import type { ResidenceUnit } from '../data/narrative';

export default function ResidenceCollection({ units }: { units: ResidenceUnit[] }) {
  const [activeId, setActiveId] = useState(units[0]?.id);
  const active = units.find((unit) => unit.id === activeId) || units[0];

  const selectByOffset = (offset: number) => {
    const current = units.findIndex((unit) => unit.id === active.id);
    const next = (current + offset + units.length) % units.length;
    setActiveId(units[next].id);
    document.getElementById(`unit-tab-${units[next].id}`)?.focus();
  };

  return (
    <div className="residence-collection">
      <div className="residence-tabs" role="tablist" aria-label="Bộ sưu tập căn hộ">
        {units.map((unit) => (
          <button
            id={`unit-tab-${unit.id}`}
            key={unit.id}
            role="tab"
            aria-selected={active.id === unit.id}
            aria-controls="residence-panel"
            tabIndex={active.id === unit.id ? 0 : -1}
            className={active.id === unit.id ? 'is-active' : ''}
            onClick={() => setActiveId(unit.id)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                event.preventDefault();
                selectByOffset(1);
              }
              if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                event.preventDefault();
                selectByOffset(-1);
              }
            }}
            type="button"
          >
            <span>{unit.index}</span>
            <strong>{unit.name}</strong>
            <small>{unit.code} · {unit.usableArea}</small>
          </button>
        ))}
      </div>

      <div id="residence-panel" className="residence-panel" role="tabpanel" aria-labelledby={`unit-tab-${active.id}`} key={active.id}>
        <div className="residence-plan-wrap">
          <p className="residence-plan-label">MẶT BẰNG {active.name}</p>
          <a className="residence-plan" href={active.pdf} target="_blank" rel="noreferrer" aria-label={`Mở PDF gốc ${active.name} ${active.code}`}>
            <img src={active.image} alt={`Mặt bằng ${active.name} ${active.code}`} />
            <span>Mở mặt bằng chi tiết ↗</span>
          </a>
          <div className="residence-plan-meta" aria-label={`Thông số ${active.code}`}>
            <strong>{active.code}</strong>
            <span>Diện tích sử dụng <b>{active.usableArea}</b></span>
            <span>Diện tích tim tường <b>{active.wallArea}</b></span>
          </div>
        </div>
        <a
          className="residence-perspective residence-locator"
          href={active.pdf}
          target="_blank"
          rel="noreferrer"
          aria-label={`Mở PDF nguồn ${active.locatorLabel}`}
        >
          <img src={active.locatorImage} alt={active.locatorLabel} />
          <span className="residence-locator-code">VÙNG TÔ MÀU · {active.code}</span>
          <span className="residence-locator-label">{active.locatorLabel}</span>
        </a>
      </div>
    </div>
  );
}
