import React from 'react';

interface ZorivaLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const ZorivaLogo: React.FC<ZorivaLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconDimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const textDimensions = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Proprietary ▯ › ▭ Brand Glyph: Vertical Trailer morphing into Cinematic Widescreen */}
      <div className={`relative flex items-center justify-center ${iconDimensions}`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]"
        >
          <defs>
            <linearGradient id="zorivaGrad" x1="2" y1="2" x2="34" y2="34" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f43f5e" />
              <stop offset="0.5" stopColor="#ec4899" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="portalGrad" x1="16" y1="12" x2="22" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#fbcfe8" />
            </linearGradient>
          </defs>

          {/* Left Vertical Short Frame (▯) */}
          <rect
            x="4"
            y="6"
            width="9"
            height="24"
            rx="3.5"
            stroke="url(#zorivaGrad)"
            strokeWidth="2.5"
            fill="rgba(244,63,94,0.15)"
          />

          {/* Center Morph Arrow / Portal Vector (›) */}
          <path
            d="M16 14L20 18L16 22"
            stroke="url(#portalGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Widescreen Cinema Frame (▭) */}
          <rect
            x="22"
            y="10"
            width="11"
            height="16"
            rx="3"
            stroke="url(#zorivaGrad)"
            strokeWidth="2.5"
            fill="rgba(139,92,246,0.2)"
          />
        </svg>
      </div>

      {showText && (
        <span className={`font-extrabold tracking-wider bg-gradient-to-r from-white via-neutral-100 to-rose-200 bg-clip-text text-transparent ${textDimensions} font-['Space_Grotesk']`}>
          ZORIVA
        </span>
      )}
    </div>
  );
};
