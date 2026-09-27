import React from 'react';

interface FlynkLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
}

export const FlynkLogo: React.FC<FlynkLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  animated = false,
}) => {
  const iconDimensions = {
    xs: 'w-5 h-5',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  const textDimensions = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Precision recreation of FLYNK custom 3D fluid ribbon "F" + play triangle + orbital nodes */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`w-full h-full drop-shadow-[0_4px_16px_rgba(244,63,94,0.35)] ${
            animated ? 'hover:scale-105 transition-transform duration-300' : ''
          }`}
        >
          <defs>
            {/* Top Cyan -> Blue Ribbon */}
            <linearGradient id="flynkCyanBlue" x1="25" y1="12" x2="88" y2="35" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="45%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            {/* Mid Violet -> Magenta Ribbon */}
            <linearGradient id="flynkVioletPink" x1="28" y1="36" x2="85" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            {/* Bottom Stem Sunset Coral */}
            <linearGradient id="flynkSunsetCoral" x1="28" y1="40" x2="48" y2="84" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="65%" stopColor="#fb7185" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>

            {/* Central Play Triangle */}
            <linearGradient id="flynkPlayGrad" x1="48" y1="52" x2="72" y2="72" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="40%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>

            {/* Orbital Ring gradient */}
            <linearGradient id="flynkOrbitGrad" x1="12" y1="30" x2="88" y2="70" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#c084fc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Thin Orbiting Halo Ellipse */}
          <ellipse
            cx="50"
            cy="50"
            rx="41"
            ry="41"
            transform="rotate(-25 50 50)"
            stroke="url(#flynkOrbitGrad)"
            strokeWidth="1.6"
            strokeDasharray="140 15 30 15"
            fill="none"
            className="opacity-75"
          />

          {/* Orbiting Satellite Beads */}
          <circle cx="17" cy="30" r="3.5" fill="#f43f5e" className="drop-shadow-[0_0_6px_#f43f5e]" />
          <circle cx="82" cy="65" r="3" fill="#38bdf8" className="drop-shadow-[0_0_6px_#38bdf8]" />

          {/* Main "F" - Lower Coral Curve */}
          <path
            d="M 28 50 C 28 65 32 80 44 84 C 42 76 43 68 45 60 C 37 58 31 54 28 50 Z"
            fill="url(#flynkSunsetCoral)"
          />

          {/* Main "F" - Middle Magenta / Violet Wave */}
          <path
            d="M 28 36 C 36 34 52 46 80 38 C 76 46 64 50 45 52 C 34 53 28 45 28 36 Z"
            fill="url(#flynkVioletPink)"
          />

          {/* Main "F" - Top Cyan Wing Feather */}
          <path
            d="M 28 36 C 27 20 40 13 60 14 C 74 15 88 12 90 10 C 88 22 76 34 50 36 C 38 37 30 36 28 36 Z"
            fill="url(#flynkCyanBlue)"
          />

          {/* Inner Highlight Fold / 3D Crease */}
          <path
            d="M 28 36 C 38 36 60 26 80 18 C 65 30 45 38 28 48 Z"
            fill="#ffffff"
            fillOpacity="0.22"
          />

          {/* The Glowing Play Triangle inside the "F" notch */}
          <path
            d="M 50 53 C 48.5 52.2 47 53.2 47 55 L 47 73 C 47 74.8 48.5 75.8 50 75 L 68 65.5 C 69.5 64.6 69.5 63.4 68 62.5 Z"
            fill="url(#flynkPlayGrad)"
            className="drop-shadow-[0_2px_8px_rgba(244,63,94,0.5)]"
          />

          {/* Inner Play Triangle Glint */}
          <path
            d="M 48 56 L 62 64 L 48 71 Z"
            fill="#ffffff"
            fillOpacity="0.25"
          />
        </svg>
      </div>

      {showText && (
        <span className={`font-extrabold tracking-wider text-white font-['Syne'] ${textDimensions}`}>
          FLYNK
        </span>
      )}
    </div>
  );
};
