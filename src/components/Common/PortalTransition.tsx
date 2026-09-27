import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FlynkLogo } from './FlynkLogo';

interface PortalTransitionProps {
  isActive: boolean;
  onComplete: () => void;
  title?: string;
  creatorName?: string;
  duration?: string;
}

export const PortalTransition: React.FC<PortalTransitionProps> = ({
  isActive,
  onComplete,
  title,
  creatorName,
  duration,
}) => {
  const [phase, setPhase] = useState<'idle' | 'expanding' | 'cinematic'>('idle');

  useEffect(() => {
    if (isActive) {
      setPhase('expanding');
      const t1 = setTimeout(() => {
        setPhase('cinematic');
      }, 350);

      const t2 = setTimeout(() => {
        onComplete();
        setPhase('idle');
      }, 700);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      setPhase('idle');
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/90 backdrop-blur-md overflow-hidden"
        >
          {/* Radial expansion halo */}
          <motion.div
            initial={{ scale: 0.3, opacity: 0.8 }}
            animate={{ scale: phase === 'expanding' ? 1.4 : 3, opacity: phase === 'cinematic' ? 0.2 : 0.9 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-rose-500/40 via-purple-600/30 to-blue-500/40 blur-3xl"
          />

          {/* Morphing Frame ▯ -> ▭ */}
          <motion.div
            initial={{
              width: '260px',
              height: '460px',
              borderRadius: '24px',
              borderColor: '#f43f5e',
            }}
            animate={
              phase === 'expanding'
                ? {
                    width: '380px',
                    height: '380px',
                    borderRadius: '20px',
                    borderColor: '#a855f7',
                  }
                : {
                    width: '92vw',
                    height: '52vw',
                    maxWidth: '850px',
                    maxHeight: '480px',
                    borderRadius: '16px',
                    borderColor: '#38bdf8',
                  }
            }
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative border-2 border-dashed shadow-[0_0_50px_rgba(244,63,94,0.6)] bg-black/80 flex flex-col items-center justify-center p-6 text-center"
          >
            {/* Corner alignment markers */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-rose-400" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-rose-400" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-rose-400" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-rose-400" />

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-2"
            >
              <FlynkLogo size="lg" showText={true} />
              <div className="text-xs uppercase tracking-widest text-rose-400 font-semibold font-mono flex items-center gap-1.5 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                EXPANDING TO CINEMATIC FULL
              </div>
              <h3 className="text-white text-base md:text-lg font-bold line-clamp-1 max-w-sm mt-1">
                {title || 'Playing Full Story'}
              </h3>
              {creatorName && (
                <p className="text-neutral-400 text-xs">
                  by @{creatorName} • {duration || 'Full Video'}
                </p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
