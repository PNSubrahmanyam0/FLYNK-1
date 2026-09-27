import React, { useState } from 'react';
import {
  X,
  UserCheck,
  UserPlus,
  MessageSquare,
  Sparkles,
  Play,
  Film,
  Link as LinkIcon,
  Store,
  Building2,
  Briefcase,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Calendar,
  Share2,
} from 'lucide-react';
import { User, ShortVideo, LongVideo } from '../../types';
import { AccountContext } from '../../types/account';

export interface AlsoOnFlynkEntity {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  mode: 'personal' | 'creator' | 'business' | 'shop' | 'professional' | 'organization';
  badge: string;
  category: string;
  isPublished: boolean;
}

interface UniversalIdentityCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  flicks?: ShortVideo[];
  longVideos?: LongVideo[];
  alsoOnFlynk?: AlsoOnFlynkEntity[];
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  onStartMessage?: () => void;
  onSelectFlick?: (flick: ShortVideo) => void;
  onSelectLongVideo?: (video: LongVideo) => void;
  onOpenFullProfile?: () => void;
  onSelectAlsoEntity?: (entity: AlsoOnFlynkEntity) => void;
  onOpenBooking?: (targetName: string, targetHandle: string) => void;
}

export const UniversalIdentityCardModal: React.FC<UniversalIdentityCardModalProps> = ({
  isOpen,
  onClose,
  user,
  flicks = [],
  longVideos = [],
  alsoOnFlynk = [],
  isFollowing = false,
  onToggleFollow,
  onStartMessage,
  onSelectFlick,
  onSelectLongVideo,
  onOpenFullProfile,
  onSelectAlsoEntity,
  onOpenBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'flicks' | 'long' | 'links'>('flicks');
  const [localFollowing, setLocalFollowing] = useState(isFollowing);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleFollowClick = () => {
    setLocalFollowing(!localFollowing);
    onToggleFollow?.();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + '/@' + user.handle);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Default "Also on FLYNK" entities matching the exact platform specification
  const fallbackAlsoOnFlynk: AlsoOnFlynkEntity[] = alsoOnFlynk.length > 0 ? alsoOnFlynk : [
    {
      id: 'entity_abc_travels',
      name: 'ABC Travels',
      handle: '@abctravels',
      avatar: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400&q=80',
      mode: 'business',
      badge: 'TRAVEL',
      category: 'Curated Expeditions & Bespoke Tours',
      isPublished: true,
    },
    {
      id: 'entity_nani_photo',
      name: `${user.name.split(' ')[0]} Photography`,
      handle: `@${user.handle.replace(/^@/, '')}_photo`,
      avatar: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=400&q=80',
      mode: 'creator',
      badge: 'PHOTOGRAPHY',
      category: 'Commercial & Editorial Visuals',
      isPublished: true,
    },
  ];

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return Math.round(count / 1000) + 'K';
    return count.toString();
  };

  const modeBadge = user.role === 'business'
    ? 'Business • Healthcare'
    : user.role === 'creator'
    ? 'Creator • Travel'
    : 'Personal';

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none font-['Plus_Jakarta_Sans']"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-[#0c050a] border border-neutral-800 rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Pull Handle for mobile */}
        <div className="sm:hidden w-12 h-1.5 bg-neutral-800 rounded-full mx-auto mt-3" />

        {/* Identity Header */}
        <div className="p-5 pb-4 relative">
          {/* Action buttons (Share & Close) */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              title="Share Identity Card"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Basic Info */}
          <div className="flex items-start gap-3.5">
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-red-500/40 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-red-600 border-2 border-[#0c050a] flex items-center justify-center text-white">
                <Sparkles className="w-2.5 h-2.5" />
              </span>
            </div>

            <div className="min-w-0 flex-1 pr-14">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-base text-white font-['Syne'] truncate">
                  {user.name}
                </h3>
                {user.verifiedCreator && (
                  <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                )}
              </div>

              <div className="text-xs text-neutral-400 font-mono">
                @{user.handle}
              </div>

              {/* Mode & Category Badge */}
              <div className="mt-1 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-bold uppercase">
                  {modeBadge}
                </span>
                <span className="text-xs font-bold text-neutral-200">
                  {formatFollowers(user.followersCount || 25400)}{' '}
                  <span className="text-neutral-400 font-normal">followers</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bio Preview */}
          <p className="text-xs text-neutral-300 mt-3 line-clamp-2 leading-relaxed">
            {user.bio || 'Exploring cinematic short trailers, handloom garments & authentic local experiences on FLYNK.'}
          </p>

          {/* Follow | Message Primary Action Bar */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={handleFollowClick}
              className={`py-2.5 px-4 rounded-xl font-bold text-xs font-['Syne'] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 ${
                localFollowing
                  ? 'bg-neutral-800 text-neutral-200 border border-neutral-700 hover:bg-neutral-700'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
              }`}
            >
              {localFollowing ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Follow</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onClose();
                onStartMessage?.();
              }}
              className="py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold text-xs font-['Syne'] flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>Message</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation: Flicks · Full Videos · Links */}
        <div className="px-5 border-b border-neutral-800/80 flex items-center gap-6 text-xs font-bold font-['Syne'] bg-neutral-950/40">
          <button
            onClick={() => setActiveTab('flicks')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
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
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'long'
                ? 'border-sky-500 text-white shadow-sm'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Full Videos ({longVideos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('links')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'links'
                ? 'border-purple-500 text-white shadow-sm'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Links</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Tab 1: Flicks Grid */}
          {activeTab === 'flicks' && (
            <div>
              {flicks.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {flicks.slice(0, 6).map((flick) => (
                    <div
                      key={flick.id}
                      onClick={() => {
                        onClose();
                        onSelectFlick?.(flick);
                      }}
                      className="aspect-[9/16] rounded-xl overflow-hidden relative border border-neutral-800 hover:border-red-500/60 cursor-pointer group transition-all"
                    >
                      <img
                        src={flick.thumbnailUrl}
                        alt={flick.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-1.5 inset-x-1.5 text-[10px] text-white font-bold truncate">
                        {flick.title}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-neutral-500">
                  No Flicks posted yet.
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Long Videos List */}
          {activeTab === 'long' && (
            <div className="space-y-2">
              {longVideos.length > 0 ? (
                longVideos.slice(0, 4).map((video) => (
                  <div
                    key={video.id}
                    onClick={() => {
                      onClose();
                      onSelectLongVideo?.(video);
                    }}
                    className="p-2 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 flex items-center gap-2.5 cursor-pointer transition-all"
                  >
                    <div className="w-24 aspect-video rounded-lg overflow-hidden relative shrink-0">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 text-[8px] font-mono text-white">
                        {video.durationFormatted}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-white truncate font-['Syne']">
                        {video.title}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        {video.viewsCount.toLocaleString()} views
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-neutral-500">
                  No long-form videos published.
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Official Links */}
          {activeTab === 'links' && (
            <div className="space-y-2">
              <a
                href={user.website || 'https://devin.studio'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs text-white transition-all"
              >
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-medium">Official Website & Drops</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
              </a>

              {user.socialLinks?.instagram && (
                <a
                  href={`https://instagram.com/${user.socialLinks.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs text-white transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-pink-400 font-bold">IG</span>
                    <span className="font-medium">@{user.socialLinks.instagram}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                </a>
              )}

              {user.socialLinks?.youtube && (
                <a
                  href={`https://youtube.com/@${user.socialLinks.youtube}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 flex items-center justify-between text-xs text-white transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">YT</span>
                    <span className="font-medium">YouTube Channel</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                </a>
              )}
            </div>
          )}

          {/* "ALSO ON FLYNK" Multi-Entity Cross-Links (Master Architecture Rule 31) */}
          <div className="pt-2 border-t border-neutral-800/80">
            <div className="text-[10px] uppercase font-bold text-neutral-400 font-mono tracking-wider mb-2 flex items-center justify-between">
              <span>Also on FLYNK</span>
              <span className="text-emerald-400 font-normal">Active Identities</span>
            </div>

            <div className="space-y-1.5">
              {fallbackAlsoOnFlynk.map((entity) => (
                <div
                  key={entity.id}
                  onClick={() => {
                    onClose();
                    onSelectAlsoEntity?.(entity);
                  }}
                  className="p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800/90 hover:border-neutral-700 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={entity.avatar}
                      alt={entity.name}
                      className="w-9 h-9 rounded-xl object-cover border border-white/10 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white font-['Syne'] truncate">
                          {entity.name}
                        </span>
                        <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-black/60 text-amber-300 border border-amber-500/30 font-bold">
                          {entity.badge}
                        </span>
                      </div>
                      <div className="text-[10px] text-neutral-400 truncate">
                        {entity.category}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: View Full Profile CTA */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800/80 flex items-center justify-between text-xs">
          {copiedLink && (
            <span className="text-[11px] text-emerald-400 font-mono animate-in fade-in">
              Profile link copied!
            </span>
          )}
          {!copiedLink && (
            <span className="text-[11px] text-neutral-400 font-mono">
              Universal FLYNK Identity
            </span>
          )}

          <button
            onClick={() => {
              onClose();
              onOpenFullProfile?.();
            }}
            className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View Full Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
