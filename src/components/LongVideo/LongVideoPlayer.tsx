import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  Heart,
  Share2,
  Bookmark,
  ShoppingBag,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  Star,
  Film,
  Users,
  ShieldAlert,
  ShieldCheck,
  MessageCircle,
  Send,
  Pin,
  Trash2,
  ArrowRight,
  ExternalLink,
  Layers,
  Copy,
} from 'lucide-react';
import { LongVideo, ShortVideo, Product, User } from '../../types';
import { ClickableTextWithLinks } from '../Common/ClickableTextWithLinks';

interface LongVideoPlayerProps {
  video: LongVideo;
  allShorts: ShortVideo[];
  allLongVideos: LongVideo[];
  currentUser: User;
  onBackToShorts: () => void;
  onSelectShort: (short: ShortVideo) => void;
  onSelectLongVideo: (longVideo: LongVideo) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenCreatorProfile: (creator: User) => void;
  onOpenReportCopyright?: (video: LongVideo) => void;
}

export const LongVideoPlayer: React.FC<LongVideoPlayerProps> = ({
  video,
  allShorts,
  allLongVideos,
  currentUser,
  onBackToShorts,
  onSelectShort,
  onSelectLongVideo,
  onSelectProduct,
  onAddToCart,
  onOpenCreatorProfile,
  onOpenReportCopyright,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.durationSeconds || 840);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [quality, setQuality] = useState<string>('1080p HD');
  const [showSettings, setShowSettings] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likesCount);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Default to 'products' if video has products (matching image.png) or 'comments'
  const [activeTab, setActiveTab] = useState<'products' | 'shorts' | 'comments' | 'related'>(
    video.taggedProducts && video.taggedProducts.length > 0 ? 'products' : 'comments'
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Interactive full video comments state
  const [commentsList, setCommentsList] = useState<{
    id: string;
    user: { name: string; handle: string; avatar: string };
    text: string;
    timestamp: string;
    likes: number;
    isLiked?: boolean;
    isPinned?: boolean;
  }[]>([
    {
      id: 'c1',
      user: {
        name: video.creator.name,
        handle: video.creator.handle,
        avatar: video.creator.avatar,
      },
      text: 'Thanks everyone for watching! Links to the full apparel collection & behind-the-scenes lookbook are tagged in the Products tab below. All direct orders protected by FLYNK Escrow 🎥✨',
      timestamp: '1 hour ago',
      likes: 84,
      isLiked: false,
      isPinned: true,
    },
    {
      id: 'c2',
      user: {
        name: 'Kabir Verma',
        handle: 'kabir_vfx',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      },
      text: 'The tailoring sequence at minute 03:15 with the magnetic storm flap is cinematic perfection. Already ordered the trench coat!',
      timestamp: '45 mins ago',
      likes: 38,
      isLiked: true,
    },
    {
      id: 'c3',
      user: {
        name: 'Aanya Sharma',
        handle: 'aanya_travels',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      },
      text: 'Saw the 30-sec trailer on Shorts and swiped right into this full 14-min story. The 2-way reverse link works so smoothly!',
      timestamp: '15 mins ago',
      likes: 19,
      isLiked: false,
    },
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newC = {
      id: `c_${Date.now()}`,
      user: {
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
      },
      text: newCommentText.trim(),
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };
    setCommentsList([newC, ...commentsList]);
    setNewCommentText('');
    showToast('Comment posted to video discussion!');
  };

  const handleToggleLikeComment = (commentId: string) => {
    setCommentsList((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
          : c
      )
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setCommentsList((prev) => prev.filter((c) => c.id !== commentId));
    showToast('Comment deleted');
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Filter linked short clips for this video
  const linkedShortClips = allShorts.filter(
    (s) => s.linkedLongVideoId === video.id || video.linkedShortIds?.includes(s.id)
  );

  // Other related long videos
  const relatedVideos = allLongVideos.filter((v) => v.id !== video.id);

  // Active products in video (fallback to creator products if empty)
  const displayProducts =
    video.taggedProducts && video.taggedProducts.length > 0
      ? video.taggedProducts
      : [];

  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(true);
    setLikesCount(video.likesCount);
    setIsLiked(false);
    if (video.taggedProducts && video.taggedProducts.length > 0) {
      setActiveTab('products');
    }
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = playbackRate;
      videoRef.current.play().catch(() => {});
    }
  }, [video.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current) return;
    const target = Math.max(
      0,
      Math.min(videoRef.current.duration || duration, videoRef.current.currentTime + seconds)
    );
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = pct * (videoRef.current.duration || duration);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const changeSpeed = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettings(false);
  };

  const handleShare = () => {
    const url = `https://flynk.tv/watch/${video.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Video link copied to clipboard!');
    } else {
      showToast('Sharing link: ' + url);
    }
  };

  return (
    <div className="w-full h-full bg-[#080204] flex flex-col overflow-y-auto text-neutral-100 font-['Plus_Jakarta_Sans'] select-none">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-16 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
          <div className="px-4 py-2 rounded-2xl bg-neutral-900/95 border border-red-500/40 text-white text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ================= 1. TOP HEADER (Only Back Option Icon and Text) ================= */}
      <header className="sticky top-0 z-30 bg-[#0e0406]/90 backdrop-blur-2xl px-3 sm:px-5 py-2.5 flex items-center border-b border-red-500/20 shadow-[0_4px_25px_rgba(220,38,38,0.12)] shrink-0">
        <button
          onClick={onBackToShorts}
          className="flex items-center gap-2.5 text-neutral-300 hover:text-white transition-all cursor-pointer group active:scale-95"
          title="Back"
        >
          <div className="w-10 h-10 rounded-full bg-[#180f14]/90 hover:bg-[#25151f] border border-neutral-800 hover:border-red-500/40 text-neutral-300 group-hover:text-white flex items-center justify-center transition-all shadow-md shrink-0">
            <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-sm font-bold text-white group-hover:text-red-400 transition-colors font-['Syne']">
            Back
          </span>
        </button>
      </header>

      {/* Main Content Scrollable Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-4 space-y-4">
        {/* ================= 2. CINEMATIC 16:9 VIDEO PLAYER (Rounded corners + Crimson glow) ================= */}
        <div className="relative group">
          {/* Ambient Glow behind player */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-red-600/25 via-rose-500/15 to-red-900/25 rounded-3xl blur-xl opacity-70 pointer-events-none group-hover:opacity-90 transition-opacity" />

          {/* Rounded 16:9 Cinema Container */}
          <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden bg-black border border-red-500/30 shadow-[0_8px_35px_rgba(220,38,38,0.25),0_0_20px_rgba(0,0,0,0.8)] select-none">
            <video
              ref={videoRef}
              src={video.videoUrl}
              poster={video.thumbnailUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer"
            />

            {/* Video Gradient Overlays for controls readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

            {/* Center Big Play/Pause Button on Pause or Click */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center shadow-[0_0_35px_rgba(239,68,68,0.7)] hover:scale-110 active:scale-95 transition-all border border-red-400/50">
                  <Play className="w-8 h-8 sm:w-9 sm:h-9 fill-white ml-1" />
                </div>
              </div>
            )}

            {/* Top Right Floating Badge */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-red-500/30 text-[10px] font-mono text-red-300 font-bold shadow-md">
                {video.durationFormatted}
              </span>
            </div>

            {/* Player Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 flex flex-col gap-2 z-20 bg-gradient-to-t from-black/95 via-black/50 to-transparent backdrop-blur-[2px]">
              {/* Progress / Scrub bar with Retention Peaks */}
              <div
                ref={progressBarRef}
                onClick={handleSeek}
                className="relative w-full h-1.5 hover:h-2.5 bg-red-950/50 border border-red-500/20 rounded-full cursor-pointer transition-all flex items-center group/bar backdrop-blur-sm"
              >
                {/* Heatmap preview peaks under the bar */}
                {video.heatmap?.map((pt, idx) => (
                  <div
                    key={idx}
                    className="absolute top-0 bottom-0 bg-red-400/40 rounded-full pointer-events-none"
                    style={{
                      left: `${(pt.timestamp / (video.durationSeconds || duration)) * 100}%`,
                      width: '4px',
                      opacity: pt.retentionPct / 100,
                    }}
                  />
                ))}

                {/* Played line */}
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full relative shadow-[0_0_12px_rgba(239,68,68,0.8)]"
                  style={{
                    width: `${Math.min(100, (currentTime / (duration || 1)) * 100)}%`,
                  }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_8px_rgba(239,68,68,0.8)] scale-0 group-hover/bar:scale-100 transition-transform" />
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between text-white text-xs pt-0.5">
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Skip Back 10s */}
                  <button
                    onClick={() => skipTime(-10)}
                    title="Skip back 10 seconds"
                    className="p-1.5 sm:p-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/20 text-neutral-200 hover:text-white transition-colors flex items-center gap-0.5 backdrop-blur-md active:scale-95 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-red-300" />
                    <span className="text-[10px] font-mono">10</span>
                  </button>

                  {/* Play / Pause Toggle */}
                  <button
                    onClick={togglePlay}
                    className="p-2 sm:p-2.5 rounded-full bg-gradient-to-tr from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400/30 active:scale-95 cursor-pointer"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5 fill-white" />
                    )}
                  </button>

                  {/* Skip Forward 10s */}
                  <button
                    onClick={() => skipTime(10)}
                    title="Skip forward 10 seconds"
                    className="p-1.5 sm:p-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/20 text-neutral-200 hover:text-white transition-colors flex items-center gap-0.5 backdrop-blur-md active:scale-95 cursor-pointer"
                  >
                    <span className="text-[10px] font-mono">10</span>
                    <RotateCw className="w-3.5 h-3.5 text-red-300" />
                  </button>

                  {/* Volume Control */}
                  <button
                    onClick={toggleMute}
                    className="p-1.5 sm:p-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/20 text-neutral-200 hover:text-white transition-colors backdrop-blur-md active:scale-95 cursor-pointer"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-neutral-200" />
                    )}
                  </button>

                  {/* Timestamp */}
                  <span className="text-[11px] font-mono text-neutral-300 ml-1 tabular-nums">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Settings / Speed Popover */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSettings(!showSettings)}
                      className="px-2.5 py-1 sm:py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/20 text-[11px] font-medium flex items-center gap-1 transition-colors backdrop-blur-md text-neutral-200 active:scale-95 cursor-pointer"
                    >
                      <Settings className="w-3.5 h-3.5 text-red-300" />
                      <span>{playbackRate}x</span>
                    </button>

                    {showSettings && (
                      <div className="absolute right-0 bottom-11 z-30 w-40 bg-[#120406]/95 border border-red-500/30 rounded-2xl p-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.85)] space-y-1.5 text-xs backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-2 duration-150">
                        <div className="text-[10px] font-semibold text-red-400 px-2 py-0.5 uppercase tracking-wider font-mono">
                          Speed
                        </div>
                        {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            onClick={() => changeSpeed(s)}
                            className={`w-full text-left px-2 py-1 rounded-lg flex items-center justify-between transition-colors ${
                              playbackRate === s
                                ? 'bg-red-600/30 text-red-300 font-bold border border-red-500/40'
                                : 'hover:bg-red-950/40 text-neutral-300'
                            }`}
                          >
                            <span>{s === 1 ? '1x (Normal)' : `${s}x`}</span>
                            {playbackRate === s && <Check className="w-3.5 h-3.5 text-red-400" />}
                          </button>
                        ))}
                        <div className="border-t border-red-500/20 my-1" />
                        <div className="text-[10px] font-semibold text-red-400 px-2 py-0.5 uppercase tracking-wider font-mono">
                          Quality
                        </div>
                        {['4K Ultra', '1080p HD', '720p'].map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setQuality(q);
                              setShowSettings(false);
                              showToast(`Switched quality to ${q}`);
                            }}
                            className={`w-full text-left px-2 py-1 rounded-lg flex items-center justify-between transition-colors ${
                              quality.startsWith(q.split(' ')[0])
                                ? 'bg-red-600/30 text-red-300 font-bold border border-red-500/40'
                                : 'hover:bg-red-950/40 text-neutral-300'
                            }`}
                          >
                            <span>{q}</span>
                            {quality.startsWith(q.split(' ')[0]) && (
                              <Check className="w-3.5 h-3.5 text-red-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Fullscreen Button */}
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        if (videoRef.current.requestFullscreen) {
                          videoRef.current.requestFullscreen();
                        }
                      }
                    }}
                    className="p-1.5 sm:p-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/20 text-neutral-200 hover:text-white backdrop-blur-md active:scale-95 cursor-pointer"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3. TITLE & METADATA (STRICT SINGLE LINE TRUNCATION) ================= */}
        <div className="min-w-0 max-w-full space-y-1">
          <h1
            className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight font-['Syne'] truncate whitespace-nowrap overflow-hidden text-ellipsis block max-w-full"
            title={video.title}
          >
            {video.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-neutral-400 flex-wrap">
            <span className="font-semibold text-neutral-300 tabular-nums">
              {video.viewsCount.toLocaleString()} views
            </span>
            <span>•</span>
            <span>{video.publishedAt}</span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-full bg-red-950/60 border border-red-500/30 text-red-300 font-semibold text-[10px] uppercase font-mono tracking-wider">
              {video.category}
            </span>
          </div>
        </div>

        {/* ================= 4. CREATOR PROFILE ROW (Avatar, Handle, Verified, Follow) ================= */}
        <div className="flex items-center justify-between py-3 px-3.5 rounded-2xl bg-[#16090f]/90 border border-neutral-800/80 hover:border-red-500/30 backdrop-blur-xl shadow-sm transition-all">
          <div
            onClick={() => onOpenCreatorProfile(video.creator)}
            className="flex items-center gap-3 cursor-pointer group min-w-0"
          >
            <div className="relative shrink-0">
              <img
                src={video.creator.avatar}
                alt={video.creator.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-red-500/40 group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(239,68,68,0.25)]"
              />
              {video.collaborator && (
                <img
                  src={video.collaborator.avatar}
                  alt={video.collaborator.name}
                  className="w-6 h-6 rounded-full object-cover border-2 border-purple-500 absolute -bottom-1 -right-1 shadow-sm"
                  title={`Co-directed with @${video.collaborator.handle}`}
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-xs sm:text-sm text-white group-hover:text-red-400 transition-colors truncate">
                  {video.creator.name}
                </span>
                {video.creator.verifiedCreator && (
                  <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white inline-flex items-center justify-center text-[8px] font-bold shadow-[0_0_8px_#ef4444]">
                    ✓
                  </span>
                )}
                {video.collaborator && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-[10px] text-purple-300 font-semibold font-mono">
                    <Users className="w-2.5 h-2.5" />
                    <span>with @{video.collaborator.handle}</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                {(video.creator.followersCount / 1000).toFixed(1)}k followers • @{video.creator.handle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenReportCopyright && (
              <button
                onClick={() => onOpenReportCopyright(video)}
                className="p-2 rounded-full bg-red-950/40 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400 border border-red-500/20 transition-colors active:scale-95 cursor-pointer"
                title="Report Copyright Infringement / DMCA"
              >
                <ShieldAlert className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => {
                setIsFollowing(!isFollowing);
                showToast(isFollowing ? `Unfollowed @${video.creator.handle}` : `Now following @${video.creator.handle}!`);
              }}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer active:scale-95 ${
                isFollowing
                  ? 'bg-[#201018] text-neutral-300 hover:bg-[#2a1420] border border-red-500/30'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-400/30'
              }`}
            >
              {isFollowing ? 'Following' : '+ Follow'}
            </button>
          </div>
        </div>

        {/* ================= 5. ACTION ROW (Round Pill Buttons with Crimson Accents) ================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {/* Like */}
          <button
            onClick={() => {
              setIsLiked(!isLiked);
              setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border transition-all cursor-pointer active:scale-95 ${
              isLiked
                ? 'bg-red-600/25 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.4)] font-bold'
                : 'bg-red-950/30 border-red-500/20 text-neutral-300 hover:bg-red-900/30 hover:border-red-500/40'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span className="tabular-nums font-semibold">{likesCount.toLocaleString()}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-950/30 border border-red-500/20 text-neutral-300 hover:bg-red-900/30 hover:border-red-500/40 transition-colors cursor-pointer active:scale-95"
          >
            <Share2 className="w-4 h-4 text-red-300" />
            <span>Share</span>
          </button>

          {/* Save / Bookmark */}
          <button
            onClick={() => {
              setIsSaved(!isSaved);
              showToast(isSaved ? 'Removed from saved collection' : 'Saved to your private library');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border transition-all cursor-pointer active:scale-95 ${
              isSaved
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)] font-bold'
                : 'bg-red-950/30 border-red-500/20 text-neutral-300 hover:bg-red-900/30 hover:border-red-500/40'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
            <span>Save</span>
          </button>

          {/* Comments Quick Access */}
          <button
            onClick={() => {
              setActiveTab('comments');
              const el = document.getElementById('long-video-tabs-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border transition-all cursor-pointer active:scale-95 ${
              activeTab === 'comments'
                ? 'bg-red-600/30 border-red-500 text-red-300 shadow-[0_0_12px_rgba(239,68,68,0.4)] font-bold'
                : 'bg-red-950/30 border-red-500/20 text-neutral-300 hover:bg-red-900/30 hover:border-red-500/40'
            }`}
          >
            <MessageCircle className="w-4 h-4 text-red-400" />
            <span>Comments ({commentsList.length})</span>
          </button>

          {/* Tagged Products Indicator */}
          {displayProducts.length > 0 && (
            <button
              onClick={() => {
                setActiveTab('products');
                const el = document.getElementById('long-video-tabs-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full border transition-all cursor-pointer active:scale-95 ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-red-600/30 to-rose-600/30 border-red-500 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.4)] font-bold'
                  : 'bg-red-950/40 border-red-500/30 text-red-300 hover:bg-red-900/40'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-red-400" />
              <span>{displayProducts.length} Products</span>
            </button>
          )}
        </div>

        {/* ================= 6. COLLAPSIBLE DESCRIPTION & CHAPTERS ================= */}
        <div className="bg-[#180f14]/75 border border-neutral-800/80 rounded-2xl p-4 backdrop-blur-xl space-y-2.5">
          <div
            className={`text-xs text-neutral-300 leading-relaxed ${
              isDescExpanded ? '' : 'line-clamp-2'
            }`}
          >
            <ClickableTextWithLinks
              text={
                isDescExpanded
                  ? video.description
                  : video.description.replace(/#\S+/g, '').replace(/\s{2,}/g, ' ').trim()
              }
            />
          </div>

          {/* Hashtags visible when expanded */}
          {isDescExpanded && video.tags && video.tags.length > 0 && (
            <div className="pt-2 border-t border-red-500/20">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5 font-mono">
                Tags & Topics
              </span>
              <div className="flex flex-wrap gap-1.5">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono font-medium text-red-300 bg-red-950/60 border border-red-500/30 px-2.5 py-0.5 rounded-lg shadow-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Chapters list if expanded */}
          {isDescExpanded && video.chapters && video.chapters.length > 0 && (
            <div className="pt-3 border-t border-red-500/20 space-y-2">
              <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-red-400" />
                Chapters & Heatmap Peaks
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {video.chapters.map((chap, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = chap.timestamp;
                        setCurrentTime(chap.timestamp);
                        showToast(`Jumped to chapter: ${chap.title}`);
                      }
                    }}
                    className="w-full text-left flex items-center justify-between p-2.5 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/20 text-xs transition-colors cursor-pointer group"
                  >
                    <span className="text-neutral-200 group-hover:text-white font-medium truncate mr-2">
                      {chap.title}
                    </span>
                    <span className="text-[10px] font-mono text-red-300 font-semibold bg-red-600/20 border border-red-500/30 px-2 py-0.5 rounded-md shrink-0">
                      {chap.time}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer pt-1"
          >
            {isDescExpanded ? (
              <>
                Show Less <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Read More & Chapters <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* ================= 7. TABBED CONTENT SECTION (Products | Trailers | Comments | Related) ================= */}
        <div id="long-video-tabs-section" className="space-y-4 pt-2">
          {/* Tab Navigation */}
          <div className="flex border-b border-red-500/20 overflow-x-auto no-scrollbar gap-2 sm:gap-4">
            {/* TAB: Products (Highlight as seen in image.png) */}
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'products'
                  ? 'border-red-500 text-red-400 shadow-[0_4px_12px_rgba(239,68,68,0.2)]'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Products</span>
              {displayProducts.length > 0 && (
                <span className="text-[10px] bg-red-600/25 text-red-300 border border-red-500/30 px-2 py-0.2 rounded-full font-mono">
                  {displayProducts.length}
                </span>
              )}
            </button>

            {/* TAB: Trailers (Shorts) */}
            <button
              onClick={() => setActiveTab('shorts')}
              className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'shorts'
                  ? 'border-red-500 text-red-400 shadow-[0_4px_12px_rgba(239,68,68,0.2)]'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Trailers</span>
              <span className="text-[10px] bg-red-950/60 text-red-300 border border-red-500/20 px-2 py-0.2 rounded-full font-mono">
                {linkedShortClips.length}
              </span>
            </button>

            {/* TAB: Comments */}
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'comments'
                  ? 'border-red-500 text-red-400 shadow-[0_4px_12px_rgba(239,68,68,0.2)]'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Comments</span>
              <span className="text-[10px] bg-red-950/60 text-red-300 border border-red-500/20 px-2 py-0.2 rounded-full font-mono">
                {commentsList.length}
              </span>
            </button>

            {/* TAB: More Full Videos */}
            <button
              onClick={() => setActiveTab('related')}
              className={`pb-3 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'related'
                  ? 'border-red-500 text-red-400 shadow-[0_4px_12px_rgba(239,68,68,0.2)]'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>More Full Videos</span>
              <span className="text-[10px] bg-red-950/60 text-red-300 border border-red-500/20 px-2 py-0.2 rounded-full font-mono">
                {relatedVideos.length}
              </span>
            </button>
          </div>

          {/* ----------------- TAB CONTENT 1: PRODUCTS IN VIDEO (FAITHFUL TO image.png) ----------------- */}
          {activeTab === 'products' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-semibold text-neutral-200 font-['Syne']">
                  Featured Products Worn & Used in this Video
                </span>
                <span className="text-[11px] text-red-400 font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  FLYNK Escrow Protected
                </span>
              </div>

              {displayProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-3.5">
                  {displayProducts.map((product) => (
                    <div
                      key={product.id}
                      className="p-3.5 sm:p-4 rounded-2xl bg-[#14060b]/90 border border-red-500/25 hover:border-red-500/50 transition-all shadow-[0_4px_25px_rgba(0,0,0,0.6)] flex flex-col sm:flex-row gap-4 sm:items-center justify-between group"
                    >
                      {/* Product Thumbnail & Core Info */}
                      <div
                        onClick={() => onSelectProduct(product)}
                        className="flex gap-3.5 items-center cursor-pointer min-w-0 flex-1"
                      >
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-red-500/20 shrink-0 shadow-md">
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.discountPct && (
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-red-600 text-white font-mono text-[9px] font-bold shadow-sm">
                              {product.discountPct}% OFF
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1 space-y-1">
                          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider font-mono block">
                            {product.category}
                          </span>

                          {/* STRICT 1-LINE PRODUCT TITLE */}
                          <h4
                            className="text-xs sm:text-sm font-bold text-white truncate max-w-full font-['Syne'] group-hover:text-red-300 transition-colors block"
                            title={product.title}
                          >
                            {product.title}
                          </h4>

                          {/* Price & Rating */}
                          <div className="flex items-center gap-2 flex-wrap pt-0.5">
                            <span className="text-sm font-extrabold text-white">
                              ₹{product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-xs text-neutral-500 line-through">
                                ₹{product.originalPrice.toLocaleString()}
                              </span>
                            )}
                            <span className="text-[11px] text-amber-400 flex items-center gap-0.5 font-bold">
                              <Star className="w-3 h-3 fill-amber-400" />
                              {product.rating}
                            </span>
                          </div>

                          <div className="text-[10px] text-neutral-400 flex items-center gap-1 font-mono">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>Escrow Protected • {product.shippingDays || 3}-day courier</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons: + Cart & Buy Now */}
                      <div className="flex items-center sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-red-500/10">
                        <button
                          onClick={() => {
                            onAddToCart(product);
                            showToast(`Added ${product.title.slice(0, 20)}... to Cart!`);
                          }}
                          className="flex-1 sm:w-28 px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-neutral-200 hover:text-white text-xs font-semibold transition-all active:scale-95 text-center cursor-pointer shadow-sm"
                        >
                          + Cart
                        </button>
                        <button
                          onClick={() => onSelectProduct(product)}
                          className="flex-1 sm:w-28 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.35)] transition-all active:scale-95 text-center cursor-pointer"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-red-950/15 rounded-2xl border border-red-500/20 text-xs text-neutral-400 space-y-2">
                  <ShoppingBag className="w-8 h-8 text-neutral-500 mx-auto" />
                  <p>No tagged products for this video yet.</p>
                  <button
                    onClick={() => setActiveTab('related')}
                    className="text-red-400 font-semibold hover:underline text-xs"
                  >
                    Browse related videos
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ----------------- TAB CONTENT 2: 30-SEC TRAILERS (2-Way Reverse Linking) ----------------- */}
          {activeTab === 'shorts' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-semibold text-neutral-200 font-['Syne']">
                  30-Second Trailers Linked to this Full Video
                </span>
                <span className="text-[11px] text-red-400 font-mono">2-Way Reverse Linking</span>
              </div>

              {linkedShortClips.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {linkedShortClips.map((short) => (
                    <div
                      key={short.id}
                      onClick={() => onSelectShort(short)}
                      className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-900 border border-red-500/20 cursor-pointer group hover:border-red-500/60 transition-all shadow-lg hover:shadow-[0_8px_25px_rgba(220,38,38,0.25)]"
                    >
                      <img
                        src={short.thumbnailUrl}
                        alt={short.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

                      {/* Trailer Badge with Pulsing Red Dot */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[9px] font-mono text-white flex items-center gap-1 border border-red-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        30s Trailer
                      </div>

                      {/* Single Line Truncated Title & Likes */}
                      <div className="absolute bottom-2.5 inset-x-2.5">
                        <p
                          className="text-white text-xs font-bold truncate whitespace-nowrap overflow-hidden text-ellipsis leading-tight drop-shadow font-['Syne'] block max-w-full"
                          title={short.title}
                        >
                          {short.title}
                        </p>
                        <span className="text-[10px] text-neutral-400 mt-0.5 block font-mono">
                          {(short.likesCount / 1000).toFixed(1)}k likes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-red-950/15 rounded-2xl border border-red-500/20 text-xs text-neutral-400">
                  <Film className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                  No short trailers linked to this episode yet.
                </div>
              )}
            </div>
          )}

          {/* ----------------- TAB CONTENT 3: INTERACTIVE COMMENTS ----------------- */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-semibold text-neutral-200 flex items-center gap-1.5 font-['Syne']">
                  <MessageCircle className="w-4 h-4 text-red-400" />
                  <span>{commentsList.length} Discussion Comments on Full Video</span>
                </span>
                <span className="text-[11px] text-red-400 font-mono">Community Feed</span>
              </div>

              {/* Add Comment Input Form */}
              <form
                onSubmit={handleAddComment}
                className="p-3.5 rounded-2xl bg-[#14060b]/90 border border-red-500/30 backdrop-blur-xl space-y-2.5 shadow-sm"
              >
                <div className="flex items-start gap-2.5">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-red-500/30 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Add a comment to this full-length video..."
                      className="w-full bg-red-950/20 border border-red-500/20 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Quick Emoji Bar & Submit Button */}
                <div className="flex items-center justify-between pt-1 border-t border-white/5">
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {['🔥', '👏', '🎥', '❤️', '😮', '💯', '✨'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewCommentText((prev) => prev + emoji)}
                        className="px-2 py-1 rounded-lg hover:bg-white/10 text-xs transition-colors cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={!newCommentText.trim()}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(239,68,68,0.4)] cursor-pointer active:scale-95"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-2.5">
                {commentsList.map((comm) => (
                  <div
                    key={comm.id}
                    className={`p-3 sm:p-3.5 rounded-2xl border transition-all ${
                      comm.isPinned
                        ? 'bg-[#18080f]/90 border-red-500/40 shadow-sm'
                        : 'bg-[#100408]/80 border-red-500/15 hover:border-red-500/30'
                    }`}
                  >
                    {/* Pinned by Creator Badge */}
                    {comm.isPinned && (
                      <div className="flex items-center gap-1 text-[10px] text-red-400 font-bold font-mono mb-1.5">
                        <Pin className="w-3 h-3 text-red-400 fill-red-400" />
                        <span>Pinned by creator</span>
                      </div>
                    )}

                    <div className="flex items-start gap-2.5">
                      <img
                        src={comm.user.avatar}
                        alt={comm.user.name}
                        className="w-8 h-8 rounded-full object-cover border border-red-500/25 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">
                            {comm.user.name}
                          </span>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            @{comm.user.handle}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            • {comm.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-200 mt-1 leading-relaxed">
                          {comm.text}
                        </p>

                        <div className="flex items-center gap-4 mt-2 text-[11px] text-neutral-400">
                          <button
                            type="button"
                            onClick={() => handleToggleLikeComment(comm.id)}
                            className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer"
                          >
                            <Heart
                              className={`w-3.5 h-3.5 ${
                                comm.isLiked ? 'fill-red-500 text-red-500' : ''
                              }`}
                            />
                            <span>{comm.likes}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setNewCommentText(`@${comm.user.handle} `)}
                            className="hover:text-white transition-colors cursor-pointer"
                          >
                            Reply
                          </button>

                          {comm.user.handle === currentUser.handle && (
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comm.id)}
                              className="hover:text-rose-400 transition-colors cursor-pointer ml-auto"
                              title="Delete comment"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------- TAB CONTENT 4: MORE FULL VIDEOS (RELATED) ----------------- */}
          {activeTab === 'related' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-semibold text-neutral-200 font-['Syne']">
                  More Cinema-Grade Full Episodes
                </span>
                <span className="text-[11px] text-red-400 font-mono">Curated Library</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedVideos.map((rVideo) => (
                  <div
                    key={rVideo.id}
                    onClick={() => onSelectLongVideo(rVideo)}
                    className="p-2.5 rounded-2xl bg-[#14060b]/80 hover:bg-[#1a070f] border border-red-500/20 hover:border-red-500/50 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-white/5">
                      <img
                        src={rVideo.thumbnailUrl}
                        alt={rVideo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-sm font-mono text-[10px] text-white border border-white/10 font-bold">
                        {rVideo.durationFormatted}
                      </span>
                    </div>

                    <div className="pt-2 min-w-0">
                      {/* STRICT 1-LINE TITLE TRUNCATION */}
                      <h4
                        className="text-xs sm:text-sm font-bold text-white truncate whitespace-nowrap overflow-hidden text-ellipsis leading-tight group-hover:text-red-400 transition-colors font-['Syne'] block max-w-full"
                        title={rVideo.title}
                      >
                        {rVideo.title}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
                        <span className="truncate text-neutral-300 font-mono">
                          @{rVideo.creator.handle}
                        </span>
                        <span>
                          {(rVideo.viewsCount / 1000).toFixed(0)}k views • {rVideo.publishedAt}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
