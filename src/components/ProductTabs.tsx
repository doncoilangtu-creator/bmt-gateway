import { useMemo, useState } from 'react';
import type { Product } from '../data/products';

const formatIndex = (index: number) => String(index + 1).padStart(2, '0');

export default function ProductTabs({ products }: { products: Product[] }) {
  const [activeId, setActiveId] = useState(products[0]?.id);
  const activeIndex = Math.max(0, products.findIndex((product) => product.id === activeId));
  const active = products[activeIndex] || products[0];
  const meta = useMemo(() => [
    active.usableArea && ['Diện tích sử dụng', active.usableArea],
    active.wallArea && ['Diện tích tim tường', active.wallArea],
    active.bedrooms && ['Loại căn', active.bedrooms],
  ].filter(Boolean) as string[][], [active]);

  return (
    <div className="product-tabs product-gallery">
      <div className="product-index" aria-hidden="true">
        <span>{formatIndex(activeIndex)}</span>
        <i />
        <span>{formatIndex(products.length)}</span>
      </div>

      <div className="tab-list" role="tablist" aria-label="Loại sản phẩm">
        {products.map((product, index) => (
          <button
            key={product.id}
            className={product.id === active.id ? 'active' : ''}
            onClick={() => setActiveId(product.id)}
            type="button"
          >
            <small>{formatIndex(index)}</small>
            {product.name}
          </button>
        ))}
      </div>

      <div className="product-panel" key={active.id}>
        <div className="plan-frame">
          <a className="plan-zoom" href={active.planImage} target="_blank" rel="noreferrer" aria-label={`Mở mặt bằng ${active.name} độ phân giải cao`}>
            <img src={active.planImage} alt={active.name} loading="eager" />
          </a>
          <div className="plan-gate" aria-hidden="true">
            <span>Private preview</span>
            <strong>Nhận bộ mặt bằng đầy đủ</strong>
          </div>
        </div>

        <article className="product-story">
          <p className="eyebrow">Bộ sưu tập sản phẩm</p>
          <h3>{active.name}</h3>
          <p>{active.description}</p>

          <dl>
            {meta.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>

          <div className="chips">
            {active.highlights.slice(0, 3).map((item) => <span key={item}>{item}</span>)}
          </div>

          <a className="btn btn-primary" href="#lead">Nhận bộ mặt bằng đầy đủ</a>
        </article>
      </div>
    </div>
  );
}
