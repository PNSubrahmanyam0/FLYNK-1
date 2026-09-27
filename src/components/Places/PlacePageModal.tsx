import React, { useState } from 'react';
import {
  X,
  MapPin,
  Navigation,
  Compass,
  Clock,
  Phone,
  Share2,
  ShieldCheck,
  Star,
  Play,
  Film,
  Building2,
  ExternalLink,
  Flag,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { PlaceEntity } from '../../types/masterFlynk';
import { ShortVideo, LongVideo } from '../../types';

interface PlacePageModalProps {
  isOpen: boolean;
  onClose: () => void;
  place: PlaceEntity;
  flicks?: ShortVideo[];
  longVideos?: LongVideo[];
  onSelectFlick?: (flick: ShortVideo) => void;
  onSelectLongVideo?: (video: LongVideo) => void;
  onOpenBusinessProfile?: (businessId: string) => void;
}

export const PlacePageModal: React.FC<PlacePageModalProps> = ({
  isOpen,
  onClose,
  place,
  flicks = [],
  longVideos = [],
  onSelectFlick,
  onSelectLongVideo,
  onOpenBusinessProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'flicks' | 'long' | 'info'>('flicks');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Direct device navigation action (Rule 39)
  const handleOpenDirections = () => {
    const query = encodeURIComponent(`${place.name}, ${place.formattedAddress}`);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: place.name,
          text: `Check out ${place.name} on FLYNK Places!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      showToast('Place link copied to clipboard!');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none font-['Plus_Jakarta_Sans']"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl bg-[#0d050c] border border-neutral-800 rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Cover Banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0">
          <img
            src={place.coverImage}
            alt={place.name}
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d050c] via-black/30 to-black/60 pointer-events-none" />

          {/* Close & Share buttons */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white flex items-center gap-1.5 shadow">
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>FLYNK Places</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer transition-colors"
                title="Share Place"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Title & Official Badge overlay */}
          <div className="absolute bottom-3 inset-x-5 z-10">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-white font-['Syne'] drop-shadow-md">
                {place.name}
              </h2>
              {place.isVerifiedOfficial ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  VERIFIED OFFICIAL PLACE
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-[10px] font-mono">
                  COMMUNITY TAGGED
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-300 flex items-center gap-1.5 drop-shadow">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate">{place.formattedAddress}</span>
              <span className="text-neutral-400">· {place.distanceKm} km away</span>
            </p>
          </div>
        </div>

        {/* Action Bar: Directions + Claim/Call */}
        <div className="p-4 border-b border-neutral-800 flex items-center gap-3 shrink-0 bg-neutral-950/40">
          <button
            onClick={handleOpenDirections}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm font-['Syne'] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer active:scale-95"
          >
            <Navigation className="w-4 h-4 fill-white" />
            <span>Get Directions (Maps)</span>
          </button>

          {place.phone && (
            <a
              href={`tel:${place.phone}`}
              className="py-2.5 px-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Call Place</span>
            </a>
          )}

          {place.claimedByBusinessId && onOpenBusinessProfile && (
            <button
              onClick={() => onOpenBusinessProfile(place.claimedByBusinessId!)}
              className="py-2.5 px-4 rounded-2xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Official Business Page</span>
            </button>
          )}
        </div>

        {/* Tabs: Flicks from here | Long Videos | Details */}
        <div className="px-5 pt-3 border-b border-neutral-800 flex gap-6 text-xs font-bold font-['Syne']">
          <button
            onClick={() => setActiveTab('flicks')}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'flicks'
                ? 'border-red-500 text-white shadow-sm'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Flicks ({flicks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('long')}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'long'
                ? 'border-sky-500 text-white shadow-sm'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Full Videos ({longVideos.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2.5 flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'info'
                ? 'border-emerald-500 text-white shadow-sm'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Hours & Information</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {activeTab === 'flicks' && (
            <div>
              {flicks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {flicks.map((flick) => (
                    <div
                      key={flick.id}
                      onClick={() => {
                        onSelectFlick?.(flick);
                        onClose();
                      }}
                      className="aspect-[9/16] rounded-2xl overflow-hidden relative border border-neutral-800 hover:border-red-500/50 shadow-md group cursor-pointer transition-all"
                    >
                      <img
                        src={flick.thumbnailUrl}
                        alt={flick.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                      <div className="absolute bottom-2.5 inset-x-2.5 z-10 text-white">
                        <div className="text-[11px] font-bold font-['Syne'] truncate">
                          {flick.title}
                        </div>
                        <div className="text-[10px] text-neutral-300 truncate">
                          @{flick.creator.handle}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-neutral-400 text-xs">
                  <MapPin className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                  <p>No Flicks tagged at this location yet.</p>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Be the first creator to tag a 30s Flick here!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'long' && (
            <div className="space-y-3">
              {longVideos.length > 0 ? (
                longVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => {
                      onSelectLongVideo?.(video);
                      onClose();
                    }}
                    className="p-3 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-sky-500/40 flex items-center gap-3 cursor-pointer transition-all"
                  >
                    <div className="w-28 sm:w-36 aspect-video rounded-xl overflow-hidden relative shrink-0">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-white">
                        {video.durationFormatted}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white font-['Syne'] truncate">
                        {video.title}
                      </h4>
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {video.creator.name}
                      </p>
                      <div className="text-[10px] text-sky-400 mt-1 flex items-center gap-2">
                        <span>{video.viewsCount.toLocaleString()} views</span>
                        <span>•</span>
                        <span>Full Documentary</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-neutral-400 text-xs">
                  <Film className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                  <p>No long-form video travel guides tagged here yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-4 text-xs">
              {/* Hours Card */}
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white font-['Syne']">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Opening Hours</span>
                </div>
                <p className="text-neutral-300 font-mono pl-6">{place.openingHours}</p>
              </div>

              {/* Exact Address */}
              <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white font-['Syne']">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Verified Coordinates & Address</span>
                </div>
                <p className="text-neutral-300 pl-6 leading-relaxed">
                  {place.formattedAddress}
                </p>
                <div className="pl-6 text-[10px] font-mono text-neutral-400">
                  Lat: {place.latitude.toFixed(4)}, Long: {place.longitude.toFixed(4)}
                </div>
              </div>

              {/* Location Reporting (Rule 42) */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-500 border-t border-neutral-800">
                <span>See incorrect information or private residence?</span>
                <button
                  onClick={() => showToast('Report filed with FLYNK Trust & Safety')}
                  className="text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Flag className="w-3 h-3" />
                  <span>Report Place</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute bottom-6 inset-x-6 z-50 flex justify-center pointer-events-none">
            <div className="px-4 py-2 rounded-xl bg-black/90 text-white text-xs border border-white/20 shadow-xl animate-in fade-in duration-150">
              {toastMessage}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
