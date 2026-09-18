'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

const BLACK = '#141414';
const BLACK_FAINT = '#5C5C5C';
const LIGHT_RED = '#F8D3D5';
const HAIRLINE = '#ECECEC';

const TABS = [
  { key: 'new',  label: 'New Arrivals' },
  { key: 'best', label: 'Bestsellers' },
  { key: 'top',  label: 'Top Sellers' },
];

const NEW_ARRIVALS_LIMIT = 6;

export default function ProductTabs({ activeSellers, bestSellers, topSellers }) {
  const [active, setActive] = useState('new');

  const map = { new: activeSellers, best: bestSellers, top: topSellers };
  const rawProducts = map[active] || [];
  const products = active === 'new' ? rawProducts.slice(0, NEW_ARRIVALS_LIMIT) : rawProducts;

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      {/* Section heading */}
      <div className="text-center mb-8">
        <h2
          className="text-2xl sm:text-3xl font-semibold tracking-tight mb-6"
          style={{ color: BLACK, fontFamily: 'Georgia, serif' }}
        >
          Featured Collection
        </h2>

        {/* Tab buttons — plain underline style, no fills */}
        <div className="flex items-center justify-center gap-8" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className="shrink-0 pb-3 text-[12px] font-normal tracking-[1.5px] uppercase transition-colors border-b-2 -mb-px"
              style={{
                color: active === t.key ? BLACK : BLACK_FAINT,
                borderColor: active === t.key ? LIGHT_RED : 'transparent',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[12px] font-normal tracking-[2px] uppercase px-8 py-3 rounded-full transition-colors bg-[#F8D3D5] hover:bg-[#F0A9AD]"
          style={{ color: BLACK }}
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}