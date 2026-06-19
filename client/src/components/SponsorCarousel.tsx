import React, { useState, useEffect, useRef } from 'react';
import { Banner } from '../types';

interface Props { banners: Banner[] }

const SLIDE_DURATION = 4500;

function LuxuryBanner({ banner }: { banner: Banner }) {
  const isGold = banner.accentColor === '#C9A84C' || banner.accentColor === '#F5D77B';
  const isMint = banner.accentColor === '#00E676';

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: banner.backgroundGradient }}
    >
      {/* Diagonal shimmer lines */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, ${banner.accentColor} 0px, ${banner.accentColor} 1px, transparent 1px, transparent 28px)`,
      }} />

      {/* Large decorative circle — top right */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-[0.06]"
        style={{ background: `radial-gradient(circle, ${banner.accentColor}, transparent 70%)` }} />
      {/* Small decorative circle — bottom left */}
      <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full opacity-[0.08]"
        style={{ background: `radial-gradient(circle, ${banner.accentColor}, transparent 70%)` }} />

      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${banner.accentColor}, transparent)` }} />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between px-5 py-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Monogram */}
            <div className="w-7 h-7 rounded-full flex items-center justify-center border"
              style={{ borderColor: banner.accentColor + '60', background: banner.accentColor + '18' }}>
              <span className="text-[10px] font-bold" style={{ color: banner.accentColor }}>LP</span>
            </div>
            <span className="text-[10px] tracking-[0.18em] font-medium"
              style={{ color: banner.accentColor + 'CC' }}>
              {banner.subtitle}
            </span>
          </div>
          {isGold && <span className="text-base">✦</span>}
          {isMint && <span className="text-base">⚡</span>}
        </div>

        {/* Main title */}
        <div>
          <div className="font-cool leading-none mb-1.5"
            style={{
              fontSize: banner.title.length > 8 ? '28px' : '36px',
              background: `linear-gradient(135deg, #ffffff 0%, ${banner.accentColor} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
            {banner.title}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${banner.accentColor}80, transparent)` }} />
            <div className="w-1 h-1 rounded-full" style={{ background: banner.accentColor }} />
          </div>

          <div className="text-[11px] tracking-[0.08em] font-medium text-white/60">
            {banner.tagline}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SponsorCarousel({ banners }: Props) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const touchStartX = useRef(0);

  const list = banners.length > 0 ? banners : [{
    _id: 'default',
    title: 'LA PERFUMES',
    subtitle: 'OFFICIAL PARTNER',
    tagline: 'Where Luxury Meets Sport',
    backgroundGradient: 'linear-gradient(135deg, #0A0A14 0%, #12121F 40%, #0D1F12 100%)',
    accentColor: '#C9A84C',
    imageUrl: '',
    isActive: true,
    order: 1,
  }];

  useEffect(() => {
    if (list.length <= 1) return;
    const interval = setInterval(() => goTo((current + 1) % list.length), SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [current, list.length]);

  const goTo = (idx: number) => {
    if (animating || idx === current) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 350);
  };

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) goTo(diff > 0 ? (current + 1) % list.length : (current - 1 + list.length) % list.length);
  };

  return (
    <div className="mx-4 flex flex-col gap-2">
      <div
        className="rounded-2xl overflow-hidden relative cursor-pointer"
        style={{ height: '52vw', maxHeight: '224px', boxShadow: '0 8px 32px rgba(0,0,0,0.28)' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {list.map((banner, i) => (
          <div
            key={banner._id || i}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            <LuxuryBanner banner={banner} />
          </div>
        ))}
      </div>

      {/* Indicator dots */}
      {list.length > 1 && (
        <div className="flex justify-center items-center gap-1.5">
          {list.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === current ? '20px' : '6px',
                height: '4px',
                background: i === current
                  ? (list[current]?.accentColor || '#00E676')
                  : '#D1D5DB',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
