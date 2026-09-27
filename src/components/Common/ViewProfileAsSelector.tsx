import React from 'react';
import { Eye, Shield, Users, Globe, Lock, ArrowLeft } from 'lucide-react';
import { ProfileViewPerspective } from '../../types/masterFlynk';

interface ViewProfileAsSelectorProps {
  perspective: ProfileViewPerspective;
  onChangePerspective: (p: ProfileViewPerspective) => void;
  isAccountPrivate?: boolean;
}

export const ViewProfileAsSelector: React.FC<ViewProfileAsSelectorProps> = ({
  perspective,
  onChangePerspective,
  isAccountPrivate = false,
}) => {
  if (perspective === 'owner') return null;

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-950/90 via-orange-950/90 to-amber-950/90 border-b border-amber-500/40 px-4 py-2 text-white shadow-lg backdrop-blur-md flex items-center justify-between text-xs select-none font-['Plus_Jakarta_Sans'] animate-in slide-in-from-top duration-200">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold">
          <Eye className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="font-bold flex items-center gap-1.5 font-['Syne']">
            <span>Simulating Profile View As:</span>
            <span className="uppercase text-amber-300 font-mono tracking-wide underline">
              {perspective.replace('_', ' ')}
            </span>
          </div>
          <p className="text-[10px] text-amber-200/80">
            {perspective === 'public_visitor'
              ? isAccountPrivate
                ? 'Account is private: content & links are hidden from non-followers'
                : 'Showing publicly visible elements only'
              : perspective === 'follower'
              ? 'Showing approved follower content & public interactions'
              : 'Showing full mutual friend privileges'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="hidden sm:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-amber-500/30">
          <button
            onClick={() => onChangePerspective('public_visitor')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
              perspective === 'public_visitor'
                ? 'bg-amber-500 text-black shadow'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            Public
          </button>
          <button
            onClick={() => onChangePerspective('follower')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
              perspective === 'follower'
                ? 'bg-amber-500 text-black shadow'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            Follower
          </button>
          <button
            onClick={() => onChangePerspective('friend')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
              perspective === 'friend'
                ? 'bg-amber-500 text-black shadow'
                : 'text-neutral-300 hover:text-white'
            }`}
          >
            Friend
          </button>
        </div>

        <button
          onClick={() => onChangePerspective('owner')}
          className="px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 border border-amber-400/40 text-amber-200 hover:text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Exit Preview</span>
        </button>
      </div>
    </div>
  );
};
