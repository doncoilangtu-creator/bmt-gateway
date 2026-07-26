import { useState } from 'react';

export type LowriseProduct = {
  id: string;
  index: string;
  name: string;
  type: string;
  model: string;
  format: string;
  description: string;
  image: string;
  source: string;
  planImage: string;
  planSource: string;
  planLabel: string;
  planDescription: string;
  floors: Array<{
    id: string;
    label: string;
    image: string;
    pdf: string;
    architectureImage: string;
    architectureSource: string;
    architectureLabel: string;
  }>;
};

export default function TownhouseCollection({ products }: { products: LowriseProduct[] }) {
  const [activeId, setActiveId] = useState(products[0]?.id);
  const active = products.find((item) => item.id === activeId) || products[0];
  const [activeFloorId, setActiveFloorId] = useState(active?.floors[0]?.id);
  const activeFloor = active.floors.find((floor) => floor.id === activeFloorId) || active.floors[0];

  const selectProduct = (id: string) => {
    const item = products.find((product) => product.id === id) || products[0];
    setActiveId(item.id);
    setActiveFloorId(item.floors[0]?.id);
  };

  const selectByOffset = (offset: number) => {
    const current = products.findIndex((item) => item.id === active.id);
    const next = (current + offset + products.length) % products.length;
    selectProduct(products[next].id);
    document.getElementById(`lowrise-tab-${products[next].id}`)?.focus();
  };

  return (
    <div className="residence-collection lowrise-collection">
      <div className="residence-tabs lowrise-tabs" role="tablist" aria-label="Bộ sưu tập mặt bằng nhà phố">
        {products.map((item) => (
          <button
            id={`lowrise-tab-${item.id}`}
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active.id === item.id}
            aria-controls="lowrise-panel"
            tabIndex={active.id === item.id ? 0 : -1}
            className={active.id === item.id ? 'is-active' : ''}
            onClick={() => selectProduct(item.id)}
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
          >
            <span>{item.index}</span>
            <strong>{item.name}</strong>
            <small>{item.type} · {item.floors.length} mặt bằng</small>
          </button>
        ))}
      </div>

      <div className="lowrise-floor-tabs" role="tablist" aria-label={`Các tầng ${active.name}`}>
        {active.floors.map((floor) => (
          <button
            key={floor.id}
            type="button"
            role="tab"
            aria-selected={activeFloor.id === floor.id}
            className={activeFloor.id === floor.id ? 'is-active' : ''}
            onClick={() => setActiveFloorId(floor.id)}
          >
            {floor.label}
          </button>
        ))}
      </div>

      <div id="lowrise-panel" className="residence-panel lowrise-panel" role="tabpanel" aria-labelledby={`lowrise-tab-${active.id}`}>
        <div className="residence-plan-wrap lowrise-plan-wrap">
          <p className="residence-plan-label">MẶT BẰNG {active.name} · {activeFloor.label}</p>
          <a className="residence-plan lowrise-plan" href={activeFloor.pdf} target="_blank" rel="noreferrer" aria-label={`Mở PDF mặt bằng ${active.name} ${activeFloor.label}`}>
            <img src={activeFloor.image} alt={`Mặt bằng ${active.name} ${activeFloor.label}`} />
            <span>Mở mặt bằng chi tiết ↗</span>
          </a>
          <div className="residence-plan-meta lowrise-plan-meta" aria-label={`Thông tin ${active.name} ${activeFloor.label}`}>
            <strong>{active.type}</strong>
            <span>Bản vẽ <b>{activeFloor.label}</b></span>
            <span>Nguồn <b>StudioMilou</b></span>
          </div>
        </div>

        <a className="residence-perspective lowrise-perspective" href={activeFloor.architectureSource} target="_blank" rel="noreferrer" aria-label={`Mở ${activeFloor.architectureLabel}`}>
          <img src={activeFloor.architectureImage} alt={activeFloor.architectureLabel} />
          <span className="lowrise-architecture-label">{activeFloor.architectureLabel}</span>
        </a>
      </div>
    </div>
  );
}


/* end */
