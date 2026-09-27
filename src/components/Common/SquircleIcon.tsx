import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SquircleIconProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  svgIcon?: React.ReactNode;
  label?: string;
  active?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'nav';
  variant?: 'purple' | 'red' | 'indigo' | 'emerald' | 'blue' | 'dual';
  badge?: number | string;
  className?: string;
  onClick?: () => void;
  title?: string;
  'aria-label'?: string;
}

/**
 * SquircleIcon replicates the exact squircle tile from image.png:
 * - When active (clicked): Rich crimson/ruby metallic glass background with red stroke,
 *   crisp white icon and white text label underneath.
 * - When inactive (not clicked): Pure black background with subtle glassy red stroke,
 *   crisp white icon and white text label without red over-color.
 */
export const SquircleIcon: React.FC<SquircleIconProps> = ({
  icon: Icon,
  svgIcon,
  label,
  active = false,
  size = 'md',
  variant = 'red',
  badge,
  className = '',
  onClick,
  title,
  'aria-label': ariaLabel,
}) => {
  // Dimension and padding scales
  const sizeClasses = {
    sm: 'w-9 h-9 rounded-[14px]',
    md: 'w-11 h-11 rounded-[18px]',
    lg: 'w-13 h-13 rounded-[22px]',
    xl: 'w-16 h-16 rounded-[26px]',
    nav: 'w-[54px] h-[54px] sm:w-[58px] sm:h-[58px] rounded-2xl flex-col p-1',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
    nav: 'w-5 h-5 sm:w-5.5 sm:h-5.5',
  };

  const getVariantStyles = () => {
    // BLUE VARIANT (For Shop & Chat)
    if (variant === 'blue') {
      return active
        ? 'bg-gradient-to-b from-[#0b3875] via-[#062452] to-[#021330] border border-cyan-400/70 shadow-[0_4px_16px_rgba(3,86,197,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.45)]'
        : 'bg-black border border-sky-600/30 hover:border-cyan-400/50 shadow-sm';
    }

    // RED VARIANT (Inactive: Pure black background with glassy red stroke without red fill. Active: Rich glassy red)
    if (variant === 'red' || variant === 'dual') {
      return active
        ? 'bg-gradient-to-b from-[#9e1526] via-[#650a16] to-[#250308] border border-rose-500/55 shadow-[0_4px_16px_rgba(220,38,38,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.45)]'
        : 'bg-black border border-rose-600/35 hover:border-rose-500/55 shadow-sm';
    }

    if (variant === 'purple' || variant === 'indigo') {
      return active
        ? 'bg-gradient-to-b from-[#2b1858] via-[#1c0e3d] to-[#120728] border border-purple-400/70 shadow-[0_4px_16px_rgba(168,85,247,0.35)]'
        : 'bg-black border border-purple-500/30 hover:border-purple-400/50 shadow-sm';
    }

    // Emerald
    return active
      ? 'bg-gradient-to-b from-[#063b28] via-[#032418] to-[#01140d] border border-emerald-400/70 shadow-[0_4px_16px_rgba(16,185,129,0.35)]'
      : 'bg-black border border-emerald-500/30 shadow-sm';
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      title={title}
      aria-label={ariaLabel || label || title}
      className={`relative inline-flex items-center justify-center shrink-0 transition-all duration-200 select-none ${
        onClick ? 'cursor-pointer active:scale-95 group' : ''
      } ${sizeClasses[size]} ${getVariantStyles()} ${className}`}
    >
      {/* Top subtle gloss specular line */}
      <span
        className="absolute top-0.5 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none rounded-full"
        aria-hidden="true"
      />

      {/* Center White Icon */}
      {svgIcon ? (
        <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center">
          {svgIcon}
        </span>
      ) : Icon ? (
        <Icon
          className={`${iconSizes[size]} text-white stroke-[2.2] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-transform duration-200 ${
            onClick ? 'group-hover:scale-105' : ''
          }`}
        />
      ) : null}

      {/* Label text directly inside squircle button below icon (matching image.png) */}
      {label && (
        <span
          className={`text-[10px] sm:text-[10.5px] font-bold tracking-tight text-white leading-none mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] select-none ${
            active ? 'text-white' : 'text-neutral-200 group-hover:text-white'
          }`}
        >
          {label}
        </span>
      )}

      {/* Numeric or dot badge with soft diffused glow */}
      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 px-1.5 min-w-[17px] h-[17px] rounded-full bg-gradient-to-r from-rose-600 to-[#0356C5] text-white text-[9px] font-bold font-mono flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.6)] border border-black/50">
          {badge}
        </span>
      )}
    </Component>
  );
};

/**
 * Dedicated Home glyph exactly shaped like the house icon in Image 2
 */
export const SquircleHomeGlyph: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`${className} text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]`}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Chimney */}
    <path d="M17 5V9L15 7.2V5H17Z" />
    {/* Roof & House Body with centered doorway */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3L2 12H5V21H11V15H13V21H19V12H22L12 3Z"
    />
  </svg>
);
