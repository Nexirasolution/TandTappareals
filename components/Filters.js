'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

const BLACK = '#141414';
const BLACK_FAINT = '#5C5C5C';
const RED = '#E30613';
const HAIRLINE = '#ECECEC';
const PAPER = '#FFFFFF';

export default function Filters({ sort, onSortChange }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (value) => {
    if (typeof onSortChange === 'function') {
      onSortChange(value);
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set('sort', value);
      params.set('page', '1');
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div
      className="flex items-center justify-end py-3 px-1"
      style={{ background: PAPER, borderBottom: `1px solid ${HAIRLINE}` }}
    >
      <div className="flex items-center gap-2.5 shrink-0">
        <span
          className="text-[11px] font-normal tracking-[1.5px] uppercase"
          style={{ color: BLACK_FAINT }}
        >
          Sort
        </span>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => handleChange(e.target.value)}
            className="appearance-none bg-transparent outline-none text-[12px] tracking-wide pr-6 py-1"
            style={{ color: BLACK, borderBottom: `1px solid ${HAIRLINE}` }}
            onFocus={(e) => (e.currentTarget.style.borderBottomColor = RED)}
            onBlur={(e) => (e.currentTarget.style.borderBottomColor = HAIRLINE)}
          >
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="newarrival">New Arrival</option>
            <option value="bestselling">Best Selling</option>
          </select>
          <ChevronDown
            size={12}
            strokeWidth={1.5}
            className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: BLACK_FAINT }}
          />
        </div>
      </div>
    </div>
  );
}