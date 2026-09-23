'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Design tokens — shared with Navbar / CouponMarquee for a consistent system
const COFFEE = '#000000';
const LIGHT_PEACH = '#FBE9EB';
const HAIRLINE = '#E0E0E0';
const PAPER = '#FFFFFF';

export default function BannerCarousel({ banners }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!banners?.length) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % banners.length), 4500);
    return () => clearInterval(t);
  }, [banners]);

  if (!banners?.length) return null;

  return (
    <section className="relative w-full overflow-hidden" style={{ background: PAPER }}>
      {/*
        Single image per banner now (admin only uploads one desktop-oriented
        image). object-cover + object-position center keeps it responsive:
        on mobile the box is taller/narrower so the crop favors the middle
        of the image, on desktop it's the wide 2.4:1-ish box as before.
      */}
      <div className="relative w-full h-[220px] xs:h-[260px] sm:h-0 sm:pb-[42.1%]">

        {banners.map((b, i) => (
          <Link
            key={b._id}
            href={b.link || '#'}
            className={`absolute inset-0 block transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            } ${!b.link ? 'pointer-events-none' : ''}`}
            tabIndex={i === index ? 0 : -1}
            aria-hidden={i !== index}
          >
            <img
              src={b.image}
              alt={b.title || 'Banner'}
              className="absolute inset-0 w-full h-full object-cover object-center"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
          </Link>
        ))}

        {banners.length > 1 && (
          <>
            {/* Arrows — flat, no border, quiet until hovered */}
            <button
              onClick={() => setIndex((i) => (i - 1 + banners.length) % banners.length)}
              className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full transition z-10"
              style={{ background: PAPER, color: COFFEE, border: `1px solid ${HAIRLINE}` }}
              aria-label="Previous"
            >
              <ChevronLeft size={15} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % banners.length)}
              className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full transition z-10"
              style={{ background: PAPER, color: COFFEE, border: `1px solid ${HAIRLINE}` }}
              aria-label="Next"
            >
              <ChevronRight size={15} strokeWidth={1.5} />
            </button>

            {/* Thin dash indicators — bottom-anchored on both mobile and desktop */}
            <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className="rounded-full transition-all"
                  style={{
                    height: '3px',
                    width: i === index ? '22px' : '10px',
                    background: i === index ? LIGHT_PEACH : 'rgba(255,255,255,0.7)',
                    boxShadow: i === index ? `0 0 0 1px ${COFFEE}20` : '0 0 0 1px rgba(0,0,0,0.15)',
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}