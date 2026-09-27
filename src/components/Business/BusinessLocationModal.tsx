import React, { useState } from 'react';
import { MapPin, Navigation, X, Clock, Phone, ExternalLink, Compass } from 'lucide-react';
import { BusinessLocation } from '../../types/account';

interface BusinessLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: BusinessLocation;
}

export const BusinessLocationModal: React.FC<BusinessLocationModalProps> = ({
  isOpen,
  onClose,
  location,
}) => {
  const [showInternalMap, setShowInternalMap] = useState(false);

  if (!isOpen) return null;

  const handleOpenDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 select-none font-['Plus_Jakarta_Sans']">
      <div
        className="w-full sm:max-w-md bg-[#0d070b] border border-neutral-800 rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Handle for mobile */}
        <div className="sm:hidden w-12 h-1.5 bg-neutral-800 rounded-full mx-auto mt-3" />

        {/* Header */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-neutral-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shadow">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-['Syne']">
                Store & Physical Location
              </h3>
              <p className="text-[11px] text-neutral-400">Verified official business address</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Main Info Card */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-white font-['Syne']">
                {location.businessName}
              </h4>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {location.distanceKm} km away
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">{location.address}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex items-center gap-2 text-neutral-300">
              <Clock className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="truncate">{location.openingHours}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 flex items-center gap-2 text-neutral-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{location.phone}</span>
            </div>
          </div>

          {/* Internal Interactive Map Preview */}
          {showInternalMap && (
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-neutral-700 bg-neutral-950 animate-in fade-in duration-200">
              {/* Stylized dark-mode map illustration */}
              <div className="absolute inset-0 bg-[#12161f] flex items-center justify-center">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                <div className="relative flex flex-col items-center">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-red-600/30 animate-ping absolute inset-0" />
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg relative z-10">
                      <MapPin className="w-5 h-5" />
                    </div>
                  </div>
                  <span className="mt-2 text-xs font-bold text-white bg-black/80 px-2.5 py-1 rounded-md border border-white/20">
                    {location.businessName}
                  </span>
                </div>
              </div>

              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-neutral-400">
                FLYNK Satellite Preview
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setShowInternalMap(!showInternalMap)}
              className="py-2.5 px-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-red-400" />
              <span>{showInternalMap ? 'Hide Map' : 'View Map'}</span>
            </button>

            <button
              onClick={handleOpenDirections}
              className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Directions</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
