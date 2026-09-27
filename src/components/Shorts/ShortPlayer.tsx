import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Play,
  ShoppingBag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Music2,
  Check,
  Plus,
} from 'lucide-react';
import { ShortVideo, User, Product } from '../../types';
import { CommentsDrawer } from './CommentsDrawer';
import { ShareSheet } from './ShareSheet';
import { TaggedProductsDrawer } from './TaggedProductsDrawer';
import { UserProfileModal } from '../Common/UserProfileModal';
import { ClickableTextWithLinks } from '../Common/ClickableTextWithLinks';
import { Settings, Users, MapPin } from 'lucide-react';

interface ShortPlayerProps {
  video: ShortVideo;
  currentUser: User;
  onSwipeLeftToFull: (video: ShortVideo) => void;
  onSwipeRightToDiscovery: () => void;
  onNextShort: () => void;
  onPrevShort: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenCreatorProfile: (creator: User) => void;
  onOpenStudio?: () => void;
  onOpenOrders?: () => void;
  onOpenPlace?: () => void;
  onOpenSaveToCollection?: (item: any) => void;
  onOpenRequestQuote?: (pro: any) => void;
  onOpenBooking?: (targetName: string, targetHandle: string, sector?: any, spec?: any) => void;
}

export const ShortPlayer: React.FC<ShortPlayerProps> = ({
  video,
  currentUser,
  onSwipeLeftToFull,
  onSwipeRightToDiscovery,
  onNextShort,
  onPrevShort,
  onSelectProduct,
  onAddToCart,
  onOpenCreatorProfile,
  onOpenStudio,
  onOpenOrders,
  onOpenPlace,
  onOpenSaveToCollection,
  onOpenRequestQuote,
  onOpenBooking,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(video.isLiked || false);
  const [likesCount, setLikesCount] = useState(video.likesCount);
  const [isSaved, setIsSaved] = useState(video.isSaved || false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showHeartSplash, setShowHeartSplash] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Drawers & Modals
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  // Gesture handling state
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [gestureHint, setGestureHint] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTapRef = useRef<number>(0);

  // Reset states when video changes
  useEffect(() => {
    setIsLiked(video.isLiked || false);
    setLikesCount(video.likesCount);
    setIsSaved(video.isSaved || false);
    setIsDescExpanded(false);
    setProgress(0);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: mute first
        setIsMuted(true);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [video.id]);

  // Video progress tracking
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
    }
  };

  // Tap to pause/play & double-tap to like
  const handleContainerClick = (e: React.MouseEvent) => {
    // Ignore clicks if clicking drawer buttons or interactive pills
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('.no-tap-propagate')) return;

    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // Double tap!
      if (!isLiked) {
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
      setShowHeartSplash(true);
      setTimeout(() => setShowHeartSplash(false), 900);
    } else {
      // Single tap
      togglePlay();
    }
    lastTapRef.current = now;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Keyboard navigation for desktop users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        onPrevShort();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onNextShort();
      } else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (video.linkedLongVideo) {
          e.preventDefault();
          onSwipeLeftToFull(video);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onSwipeRightToDiscovery();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [video, isPlaying, isMuted, onNextShort, onPrevShort, onSwipeLeftToFull, onSwipeRightToDiscovery]);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    if (onOpenSaveToCollection) {
      onOpenSaveToCollection({
        id: video.id,
        itemType: 'flick',
        title: video.title,
        subtitle: `${video.creator.name} • Short`,
        imageUrl: video.thumbnailUrl,
      });
    }
  };

  const toggleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
  };

  // Touch gesture listeners for 4-direction navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    setDragOffset({ x: dx, y: dy });

    // Show visual gesture hint if dragging horizontally
    if (dx < -40 && video.linkedLongVideo) {
      setGestureHint('Release to Launch Full Video ▯›▭');
    } else if (dx > 40) {
      setGestureHint('Release to Open Long Discovery Feed');
    } else {
      setGestureHint(null);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStartRef.current) return;
    const dx = dragOffset.x;
    const dy = dragOffset.y;
    touchStartRef.current = null;
    setDragOffset({ x: 0, y: 0 });
    setGestureHint(null);

    const threshold = 65;

    // Check horizontal swipes first
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx < -threshold) {
        // Swipe LEFT -> Watch Attached Full Video
        if (video.linkedLongVideo) {
          onSwipeLeftToFull(video);
        }
      } else if (dx > threshold) {
        // Swipe RIGHT -> Open Long Video Discovery Home
        onSwipeRightToDiscovery();
      }
    } else {
      // Vertical swipes
      if (dy < -threshold) {
        // Swipe UP -> Next short
        onNextShort();
      } else if (dy > threshold) {
        // Swipe DOWN -> Prev short
        onPrevShort();
      }
    }
  };

  return (
    <div
      className="relative w-full h-full bg-black select-none overflow-hidden touch-pan-y"
      onClick={handleContainerClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Subtle cinematic gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60 pointer-events-none" />

      {/* Paused indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-110 transition-transform">
            <Play className="w-8 h-8 ml-1 fill-white" />
          </div>
        </div>
      )}

      {/* Double Tap Heart Animation */}
      {showHeartSplash && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="animate-bounce">
            <Heart className="w-24 h-24 fill-red-500 text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.9)]" />
          </div>
        </div>
      )}

      {/* Gesture drag cue overlay */}
      {gestureHint && (
        <div className="absolute top-16 inset-x-4 z-40 flex justify-center pointer-events-none">
          <div className="px-4 py-2 rounded-full bg-red-600/90 text-white font-bold text-xs shadow-[0_0_25px_rgba(220,38,38,0.6)] backdrop-blur-xl border border-red-400/40 flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-300" />
            {gestureHint}
          </div>
        </div>
      )}

      {/* Top Bar Quick Controls */}
      <div className="absolute top-3 inset-x-4 z-20 flex items-center justify-between">
        {/* Subtle Gesture guide indicator */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xl border border-red-500/20 text-[10px] text-neutral-200 font-medium flex items-center gap-1.5 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shadow-[0_0_8px_#ef4444]" />
            30s Trailer
          </div>
        </div>

        {/* Audio Mute toggle */}
        <button
          onClick={toggleMute}
          className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-xl border border-rose-500/20 text-white flex items-center justify-center hover:bg-black/80 hover:border-[#2B5C92]/40 shadow-sm transition-all"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
        </button>
      </div>

      {/* Right Action Rail */}
      <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center gap-4 text-white">
        {/* Creator Avatar with Follow Button */}
        <div className="relative mb-2">
          <button
            onClick={() => onOpenCreatorProfile(video.creator)}
            className="w-11 h-11 rounded-full border-2 border-rose-500/40 overflow-hidden shadow-sm hover:scale-105 transition-transform"
          >
            <img
              src={video.creator.avatar}
              alt={video.creator.name}
              className="w-full h-full object-cover"
            />
          </button>
          {!isFollowing && (
            <button
              onClick={toggleFollow}
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-r from-rose-600 to-[#0356C5] text-white flex items-center justify-center shadow-sm border border-white/30 hover:scale-110 transition-transform"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
          {isFollowing && (
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shadow-sm">
              <Check className="w-2.5 h-2.5" />
            </span>
          )}
        </div>

        {/* Like Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={toggleLike}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl border border-rose-500/20 hover:border-cyan-400/40 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            <Heart
              className={`w-5 h-5 ${
                isLiked ? 'fill-rose-500 text-rose-500 scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'text-white'
              } transition-transform`}
            />
          </button>
          <span className="text-[11px] font-semibold text-white/90 mt-1 drop-shadow">
            {likesCount >= 1000 ? `${(likesCount / 1000).toFixed(1)}k` : likesCount}
          </span>
        </div>

        {/* Comments Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCommentsOpen(true);
            }}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl border border-rose-500/20 hover:border-cyan-400/40 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </button>
          <span className="text-[11px] font-semibold text-white/90 mt-1 drop-shadow">
            {video.commentsCount >= 1000
              ? `${(video.commentsCount / 1000).toFixed(1)}k`
              : video.commentsCount}
          </span>
        </div>

        {/* Save / Bookmark Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={toggleSave}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl border border-rose-500/20 hover:border-cyan-400/40 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            <Bookmark
              className={`w-5 h-5 ${
                isSaved ? 'fill-amber-400 text-amber-400 scale-110' : 'text-white'
              } transition-colors`}
            />
          </button>
          <span className="text-[11px] font-semibold text-white/90 mt-1 drop-shadow">
            {video.savesCount >= 1000
              ? `${(video.savesCount / 1000).toFixed(1)}k`
              : video.savesCount}
          </span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsShareOpen(true);
            }}
            className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-xl border border-rose-500/20 hover:border-cyan-400/40 shadow-sm flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
            <Share2 className="w-5 h-5 text-white" />
          </button>
          <span className="text-[11px] font-semibold text-white/90 mt-1 drop-shadow">Share</span>
        </div>

        {/* Tagged Products Badge */}
        {video.taggedProducts && video.taggedProducts.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsProductsOpen(true);
            }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-600/85 to-[#0356C5]/85 border border-white/30 flex items-center justify-center text-white shadow-[0_4px_16px_rgba(3,86,197,0.3)] hover:scale-110 transition-transform animate-pulse-subtle"
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Bottom Content Overlay */}
      <div
        key={video.id}
        className="absolute inset-x-0 bottom-4 z-20 px-4 pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-300"
      >
        {/* Tagged products horizontal preview pill */}
        {video.taggedProducts && video.taggedProducts.length > 0 && (
          <div className="mb-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsProductsOpen(true);
              }}
              className="no-tap-propagate inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-xl border border-red-500/30 text-xs text-white hover:bg-black/90 transition-all shadow-[0_4px_20px_rgba(220,38,38,0.2)] hover:scale-105"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-red-400" />
              <span className="font-semibold">{video.taggedProducts.length} Products Tagged</span>
              <span className="text-neutral-400">· From ₹{video.taggedProducts[0].price}</span>
            </button>
          </div>
        )}

        {/* Intent Action Button on Content */}
        {video.intentAction && (
          <div className="mb-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (video.intentAction?.type === 'save_place' && onOpenSaveToCollection) {
                  onOpenSaveToCollection({
                    id: video.id,
                    itemType: 'place',
                    title: video.intentAction.targetTitle || video.title,
                    subtitle: 'Saved from Flick',
                    imageUrl: video.thumbnailUrl,
                  });
                } else if (video.intentAction?.type === 'get_directions' && onOpenPlace) {
                  onOpenPlace();
                } else if (video.intentAction?.type === 'view_product') {
                  setIsProductsOpen(true);
                } else if (video.intentAction?.type === 'request_quote' && onOpenRequestQuote) {
                  onOpenRequestQuote({
                    name: video.creator.name,
                    handle: video.creator.handle,
                    avatar: video.creator.avatar,
                    role: 'Video Editor & Colorist',
                  });
                } else if (video.intentAction?.type === 'book_appointment' && onOpenBooking) {
                  onOpenBooking(video.creator.name, video.creator.handle, 'doctor_clinic');
                } else if (video.intentAction?.type === 'watch_full_video' && video.linkedLongVideo) {
                  onSwipeLeftToFull(video);
                }
              }}
              className="no-tap-propagate inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-['Syne'] shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-red-400 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{video.intentAction.label}</span>
              {video.intentAction.targetTitle && (
                <span className="text-[11px] font-normal text-white/80 font-mono">
                  • {video.intentAction.targetTitle}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Creator Handle, Highlighted Title & Expandable Caption */}
        <div className="max-w-[80%]">
          {/* VISIBLE & HIGHLIGHTED VIDEO TITLE (Strictly one line only with ellipsis) */}
          <div className="mb-1.5 inline-flex items-center max-w-full">
            <div className="px-2.5 py-1 rounded-xl bg-black/85 backdrop-blur-xl border border-rose-500/40 shadow-[0_0_14px_rgba(244,63,94,0.35)] flex items-center gap-1.5 min-w-0 max-w-full overflow-hidden">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_6px_#f43f5e] shrink-0" />
              <h2
                className="text-xs sm:text-[13px] font-bold text-white font-['Syne'] tracking-wide drop-shadow truncate whitespace-nowrap overflow-hidden text-ellipsis max-w-full"
                title={video.title}
              >
                {video.title}
              </h2>
            </div>
          </div>

          {/* Creator Profile & Verified Badge */}
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <button
              onClick={() => onOpenCreatorProfile(video.creator)}
              className="font-bold text-sm text-white hover:underline drop-shadow flex items-center gap-1 cursor-pointer"
            >
              @{video.creator.handle}
              {video.creator.verifiedCreator && (
                <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white inline-flex items-center justify-center text-[8px] font-bold shadow-[0_0_6px_#ef4444]">
                  ✓
                </span>
              )}
            </button>

            {video.collaborator && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-purple-950/60 border border-purple-500/30 text-[10px] text-purple-300 font-medium">
                <Users className="w-2.5 h-2.5 text-purple-400" />
                <span>with @{video.collaborator.handle}</span>
              </span>
            )}
          </div>

          {/* SHORT VIDEO DESCRIPTION: Always hidden by default. Revealed only when user clicks "...more" */}
          <div className="mt-1">
            {isDescExpanded ? (
              <div className="bg-black/80 backdrop-blur-xl rounded-xl p-2.5 border border-rose-500/30 text-xs text-neutral-100 leading-snug space-y-1.5 animate-in fade-in duration-200">
                <ClickableTextWithLinks
                  text={video.description}
                  linkClassName="text-rose-300 hover:text-white underline font-semibold"
                />
                <div className="pt-1 flex items-center justify-between border-t border-white/10">
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {video.tags?.map((t) => (t.startsWith('#') ? t : `#${t}`)).join(' ')}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDescExpanded(false);
                    }}
                    className="no-tap-propagate text-[11px] font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
                  >
                    ...hide
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDescExpanded(true);
                }}
                className="no-tap-propagate inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-black/65 hover:bg-black/85 backdrop-blur-md text-[11px] font-semibold text-neutral-300 hover:text-white border border-white/15 hover:border-rose-500/30 transition-all cursor-pointer shadow-sm"
                title="Click to view video description"
              >
                <span>...more</span>
                <ChevronDown className="w-3 h-3 text-rose-400" />
              </button>
            )}
          </div>

          {/* Audio track marquee & Location Pin (Sections 35, 39, 102) */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-300 drop-shadow">
              <Music2 className="w-3.5 h-3.5 text-red-400 shrink-0 animate-pulse" />
              <span className="truncate max-w-[140px]">{video.audioTrack.title}</span>
            </div>

            {onOpenPlace && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenPlace();
                }}
                className="no-tap-propagate inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
                title="View Place Page & Navigation Directions"
              >
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Jubilee Hills • 2.8 km</span>
                <span className="text-[9px] font-mono text-emerald-400/80">›</span>
              </button>
            )}
          </div>
        </div>

        {/* SIGNATURE USP: ▯ › ▭ "Watch Full Video" CTA Banner + User Profile Icon */}
        <div className="mt-3 flex items-center gap-2">
          {video.linkedLongVideo ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSwipeLeftToFull(video);
              }}
              className="no-tap-propagate relative overflow-hidden flex-1 py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-between shadow-[0_4px_25px_rgba(220,38,38,0.5)] border border-red-300/40 active:scale-[0.98] transition-all group backdrop-blur-xl animate-glow-pulse"
            >
              {/* Animated light reflection shimmer */}
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              <div className="flex items-center gap-2 relative z-10 min-w-0">
                {/* ▯ › ▭ glyph */}
                <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-lg font-mono text-[10px] border border-red-500/30 shrink-0">
                  <span>▯</span>
                  <span className="text-red-300">›</span>
                  <span>▭</span>
                </div>
                <div className="text-left truncate">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="truncate">Watch Full Video</span>
                    <span className="text-[10px] text-red-200 font-normal shrink-0">
                      ({video.linkedLongVideo.durationFormatted})
                    </span>
                  </div>
                  <div className="text-[10px] text-white/70 font-normal truncate">
                    Swipe left or tap to open
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-white/90 group-hover:translate-x-1 transition-transform relative z-10 shrink-0 ml-1">
                <span className="text-[10px] font-mono font-medium hidden xs:inline">FULL STORY</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ) : (
            <div className="flex-1 py-2.5 px-3.5 rounded-2xl bg-black/50 backdrop-blur-md border border-red-500/20 text-[10px] text-neutral-300 flex items-center justify-between animate-in fade-in duration-300 shadow-sm">
              <span className="flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-red-400" />
                Standalone Short
              </span>
              <span className="text-neutral-400">Swipe up for next</span>
            </div>
          )}

          {/* User Profile Details Icon beside Watch Full Video button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsUserProfileOpen(true);
            }}
            className="no-tap-propagate relative p-1 rounded-2xl bg-rose-950/40 hover:bg-[#07193f]/60 border border-rose-500/25 backdrop-blur-xl transition-all active:scale-95 group shadow-[0_4px_16px_rgba(0,0,0,0.5)] shrink-0"
            title="My Profile & Settings"
            aria-label="User Profile & Settings"
          >
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-xl object-cover border border-rose-500/30 group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-rose-600 to-[#0356C5] text-white flex items-center justify-center border border-black shadow-sm">
                <Settings className="w-2.5 h-2.5" />
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 30s Progress Bar at Bottom with Dual-Tone gradient */}
      <div className="absolute bottom-0 inset-x-0 h-1 bg-white/15 z-30">
        <div
          className="h-full bg-gradient-to-r from-rose-500 via-[#0356C5] to-[#38bdf8] shadow-[0_0_6px_rgba(3,86,197,0.4)] transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating Swipe Cue Side Pill (Left/Right guides) */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 hover:opacity-100 transition-opacity">
        <div className="p-1 rounded-full bg-black/50 text-white/70">
          <ChevronLeft className="w-4 h-4" />
        </div>
      </div>
      <div className="absolute right-2 top-1/3 -translate-y-1/2 pointer-events-none opacity-30 hover:opacity-100 transition-opacity">
        <div className="p-1 rounded-full bg-black/50 text-white/70">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>

      {/* Drawers & Modals */}
      <CommentsDrawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        videoTitle={video.title}
        commentsCount={video.commentsCount}
        currentUser={currentUser}
        uploaderId={video.creatorId}
      />

      <ShareSheet
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        video={video}
        onReport={() => {
          setIsShareOpen(false);
        }}
        onBlock={() => {
          setIsShareOpen(false);
        }}
      />

      <TaggedProductsDrawer
        isOpen={isProductsOpen}
        onClose={() => setIsProductsOpen(false)}
        products={video.taggedProducts}
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
      />

      {/* User Profile & Settings Modal */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        user={currentUser}
        onOpenStudio={onOpenStudio}
        onOpenOrders={onOpenOrders}
        onOpenStore={() => onOpenCreatorProfile(currentUser)}
      />
    </div>
  );
};
