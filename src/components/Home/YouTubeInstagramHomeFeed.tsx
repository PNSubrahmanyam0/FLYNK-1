import React, { useState, useMemo } from 'react';
import {
  Play,
  Heart,
  Share2,
  Bookmark,
  MoreVertical,
  ChevronRight,
  Search,
  Plus,
  Film,
  ShieldAlert,
  Copy,
  Users,
} from 'lucide-react';
import { LongVideo, ShortVideo, Product, User } from '../../types';

interface YouTubeInstagramHomeFeedProps {
  currentUser: User;
  followingCreators: User[];
  longVideos: LongVideo[];
  shorts: ShortVideo[];
  products: Product[];
  onSelectLongVideo: (video: LongVideo) => void;
  onSelectShort: (short: ShortVideo) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOpenCreatorProfile: (creator: User) => void;
  onOpenComments: (videoTitle: string, commentsCount: number, uploaderId: string) => void;
  onOpenReportCopyright: (video: LongVideo | ShortVideo) => void;
  onOpenUpload: () => void;
}

export const YouTubeInstagramHomeFeed: React.FC<YouTubeInstagramHomeFeedProps> = ({
  currentUser,
  followingCreators,
  longVideos,
  shorts,
  onSelectLongVideo,
  onSelectShort,
  onOpenCreatorProfile,
  onOpenReportCopyright,
  onOpenUpload,
}) => {
  // Filter pill state: 'all' | 'following' | 'watched_high' | 'shorts'
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [feedSearchQuery, setFeedSearchQuery] = useState('');
  const [activeStoryCreatorId, setActiveStoryCreatorId] = useState<string | null>(null);
  const [openMenuVideoId, setOpenMenuVideoId] = useState<string | null>(null);

  // Liked and saved state for interactive feel
  const [likedShortIds, setLikedShortIds] = useState<string[]>([]);
  const [savedShortIds, setSavedShortIds] = useState<string[]>([]);

  const handleToggleLikeShort = (shortId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedShortIds((prev) =>
      prev.includes(shortId) ? prev.filter((id) => id !== shortId) : [...prev, shortId]
    );
  };

  const handleToggleSaveShort = (shortId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedShortIds((prev) =>
      prev.includes(shortId) ? prev.filter((id) => id !== shortId) : [...prev, shortId]
    );
  };

  const handleShareShort = (shortId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://flynk.tv/s/${shortId}`);
    }
  };

  // Stories rail with verified badges matching image.png
  const storiesList = useMemo(() => {
    return [
      {
        id: 'usr_nikhil_1',
        name: 'Nikhil Sharma',
        handle: 'nikhil_cinema',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        ringGradient: 'from-amber-500 via-rose-500 to-sky-500',
      },
      {
        id: 'usr_aria',
        name: 'Aria Vance',
        handle: 'aria_vance',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        ringGradient: 'from-cyan-400 via-blue-500 to-indigo-600',
      },
      {
        id: 'usr_nikhil_sen',
        name: 'Nikhil Sen',
        handle: 'nikhil_sen',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        ringGradient: 'from-sky-400 via-blue-600 to-purple-600',
      },
      {
        id: 'usr_maya',
        name: 'Maya Tech Labs',
        handle: 'mayat_styles',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        ringGradient: 'from-amber-400 via-orange-500 to-rose-600',
      },
      {
        id: 'usr_kabir',
        name: 'Chef Kabir Rao',
        handle: 'kabir_kitchen',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        ringGradient: 'from-blue-400 via-indigo-500 to-cyan-400',
      },
    ];
  }, []);

  // Filter chips: only All as requested by user
  const filterPills = [
    { id: 'all', label: 'All' },
  ];

  // Curated vertical short cards exactly as displayed in image.png
  const curatedShorts = useMemo(() => {
    return [
      {
        id: 'short_mountain_lake',
        title: 'The ice under us shattered at -24°C in Zanskar 😱',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
        likesCountFormatted: '52.4K',
        savesCountFormatted: '1.2K',
        creator: {
          name: 'Nikhil Sharma',
          handle: 'nikhil_cinema',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        },
        linkedLongVideo: longVideos[0],
      },
      {
        id: 'short_golden_retriever',
        title: 'A day with my best creative partner 🐶',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
        likesCountFormatted: '38.9K',
        savesCountFormatted: '892',
        creator: {
          name: 'Aria Vance',
          handle: 'aria_vance',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        linkedLongVideo: longVideos[1],
      },
      {
        id: 'short_rain_supercar',
        title: 'Midnight rain test with the 50mm anamorphic prime 🏎️',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
        likesCountFormatted: '38.9K',
        savesCountFormatted: '450',
        creator: {
          name: 'Maya Tech Labs',
          handle: 'mayat_styles',
          avatar:
            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        },
        linkedLongVideo: longVideos[1],
      },
      {
        id: 'short_frozen_falls',
        title: 'Drone shot through frozen waterfall in Ladakh',
        thumbnailUrl:
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
        likesCountFormatted: '44.2K',
        savesCountFormatted: '930',
        creator: {
          name: 'Nikhil Sen',
          handle: 'nikhil_sen',
          avatar:
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        },
        linkedLongVideo: longVideos[0],
      },
    ];
  }, [longVideos]);

  // Curated full videos matching image.png exactly
  const curatedFullVideos = useMemo(() => {
    return [
      {
        id: longVideos[0]?.id || 'long_himalaya',
        title: 'Crossing Zanskar in Winter | A Journey Beyond Limits',
        creator: {
          name: 'Nikhil Sharma',
          handle: 'nikhil_cinema',
          avatar:
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        },
        thumbnailUrl:
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        durationFormatted: '19:00',
        viewsFormatted: '248,900 views',
        publishedAt: '3 days ago',
        progressPct: 25,
        originalVideo: longVideos[0],
      },
      {
        id: longVideos[1]?.id || 'long_creative_space',
        title: 'A Day in My Creative Space | Productivity & Routine',
        creator: {
          name: 'Aria Vance',
          handle: 'aria_vance',
          avatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
        thumbnailUrl:
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        durationFormatted: '14:00',
        viewsFormatted: '184,600 views',
        publishedAt: '5 days ago',
        progressPct: 33,
        originalVideo: longVideos[1] || longVideos[0],
      },
    ];
  }, [longVideos]);

  // Filter full videos if user searches or filters
  const displayFullVideos = useMemo(() => {
    if (!feedSearchQuery) return curatedFullVideos;
    const q = feedSearchQuery.toLowerCase();
    return curatedFullVideos.filter(
      (v) =>
        v.title.toLowerCase().includes(q) ||
        v.creator.name.toLowerCase().includes(q) ||
        v.creator.handle.toLowerCase().includes(q)
    );
  }, [curatedFullVideos, feedSearchQuery]);

  return (
    <div className="w-full h-full bg-[#050204] text-neutral-100 flex flex-col overflow-y-auto font-['Plus_Jakarta_Sans'] select-none">
      {/* Top Ambient Subtle Crimson Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-36 bg-red-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto px-3 sm:px-4 py-3 space-y-4">
        {/* ================= 1. TOP STORIES RAIL ================= */}
        <div className="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-1">
          {/* Circular Red + Button */}
          <button
            onClick={onOpenUpload}
            className="w-14 h-14 rounded-full border-2 border-red-500/80 bg-red-950/40 flex items-center justify-center text-red-500 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(239,68,68,0.35)] shrink-0 cursor-pointer"
            title="Post Story or Video"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Following Creators' Circles with Glowing Gradient Rings & Verified Badges */}
          {storiesList.map((story) => {
            const isSelected = activeStoryCreatorId === story.id;
            return (
              <div
                key={story.id}
                onClick={() => {
                  setActiveStoryCreatorId(isSelected ? null : story.id);
                }}
                className="relative shrink-0 cursor-pointer group"
              >
                {/* Glowing Outer Ring */}
                <div
                  className={`w-14 h-14 rounded-full p-[2.5px] transition-all bg-gradient-to-tr ${story.ringGradient} ${
                    isSelected
                      ? 'scale-105 shadow-[0_0_14px_rgba(239,68,68,0.5)]'
                      : 'group-hover:scale-105 shadow-[0_0_10px_rgba(11,92,255,0.3)]'
                  }`}
                >
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="w-full h-full rounded-full object-cover border-2 border-black"
                  />
                </div>

                {/* Blue Verified Checkmark Badge at Bottom Right */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0b5cff] text-white flex items-center justify-center text-[8px] font-extrabold border-2 border-black shadow-sm">
                  ✓
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= 2. SEARCH BAR ================= */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={feedSearchQuery}
            onChange={(e) => setFeedSearchQuery(e.target.value)}
            placeholder="Search creators, keywords, or topics..."
            className="w-full bg-[#0c0507] border border-neutral-800/80 rounded-full pl-11 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/60 transition-colors shadow-inner"
          />
          {feedSearchQuery && (
            <button
              onClick={() => setFeedSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* ================= 3. FILTER PILLS (Exact 4 Pills matching image.png) ================= */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {filterPills.map((pill) => {
            const isActive = activeFilter === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setActiveFilter(pill.id)}
                className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-400/40'
                    : 'bg-[#120508] border border-neutral-800 text-neutral-300 hover:text-white'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* ================= 4. FLICKS SECTION (Exact Header & Vertical Cards) ================= */}
        <section className="space-y-3 pt-1">
          {/* Header: Red squircle with Play + "Flicks" title + chevron right */}
          <div
            onClick={() => onSelectShort(shorts[0])}
            className="flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-[0_0_10px_#ef4444]">
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Syne'] tracking-tight group-hover:text-red-400 transition-colors">
                Flicks
              </h2>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
          </div>

          {/* Horizontal Carousel of 9:16 Short Cards */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {curatedShorts.map((short) => {
              const isLiked = likedShortIds.includes(short.id);
              const isSaved = savedShortIds.includes(short.id);

              return (
                <div
                  key={short.id}
                  onClick={() => {
                    const matchedShort = shorts.find((s) => s.id === short.id) || shorts[0];
                    onSelectShort(matchedShort);
                  }}
                  className="w-44 sm:w-52 shrink-0 aspect-[9/16] relative rounded-2xl overflow-hidden border border-neutral-800/80 hover:border-red-500/40 shadow-lg group cursor-pointer transition-all"
                >
                  <img
                    src={short.thumbnailUrl}
                    alt={short.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/25 pointer-events-none" />

                  {/* Top Right: Three Vertical Dots Menu */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(`https://flynk.tv/s/${short.id}`);
                        }
                      }}
                      className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/80 transition-colors shadow-sm"
                      title="More Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Right Vertical Action Column: Heart, Bookmark, Share */}
                  <div className="absolute right-2.5 bottom-8 z-10 flex flex-col items-center gap-3">
                    {/* Like */}
                    <button
                      onClick={(e) => handleToggleLikeShort(short.id, e)}
                      className="flex flex-col items-center gap-0.5 text-white cursor-pointer active:scale-90 transition-transform"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isLiked ? 'fill-red-500 text-red-500' : 'fill-white/20 text-white'
                        }`}
                      />
                      <span className="text-[10px] font-semibold drop-shadow font-mono">
                        {short.likesCountFormatted}
                      </span>
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={(e) => handleToggleSaveShort(short.id, e)}
                      className="flex flex-col items-center gap-0.5 text-white cursor-pointer active:scale-90 transition-transform"
                    >
                      <Bookmark
                        className={`w-5 h-5 ${
                          isSaved ? 'fill-amber-400 text-amber-400' : 'fill-white/20 text-white'
                        }`}
                      />
                      <span className="text-[10px] font-semibold drop-shadow font-mono">
                        {short.savesCountFormatted}
                      </span>
                    </button>

                    {/* Share */}
                    <button
                      onClick={(e) => handleShareShort(short.id, e)}
                      className="flex flex-col items-center gap-0.5 text-white cursor-pointer active:scale-90 transition-transform"
                      title="Share Short"
                    >
                      <Share2 className="w-5 h-5 text-white drop-shadow" />
                    </button>
                  </div>

                  {/* Bottom Left: Creator Avatar & Handle */}
                  <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-2 max-w-[70%]">
                    <img
                      src={short.creator.avatar}
                      alt={short.creator.name}
                      className="w-7 h-7 rounded-full object-cover border-2 border-red-500/60 shrink-0 shadow-sm"
                    />
                    <span className="text-xs font-semibold text-white truncate drop-shadow">
                      @{short.creator.handle}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 5. FULL VIDEO SECTION (Exact Header & Cinema Cards) ================= */}
        <section className="space-y-3 pt-2">
          {/* Header: Red squircle with Film + "Full Video" title + chevron right */}
          <div
            onClick={() => onSelectLongVideo(longVideos[0])}
            className="flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-[0_0_10px_#ef4444]">
                <Film className="w-3.5 h-3.5 fill-white" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Syne'] tracking-tight group-hover:text-red-400 transition-colors">
                Full Video
              </h2>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
          </div>

          {/* Full Video Cinema Cards List */}
          <div className="space-y-4">
            {displayFullVideos.map((video) => (
              <article
                key={video.id}
                onClick={() => onSelectLongVideo(video.originalVideo)}
                className="bg-[#0e0406]/90 rounded-2xl border border-red-500/20 overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.7)] hover:border-red-500/40 transition-all p-3 space-y-3 cursor-pointer group"
              >
                {/* 16:9 Video Thumbnail Container with Center Play & Duration Badge */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black select-none border border-white/5">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25 pointer-events-none" />

                  {/* Center Dark Circular Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 active:scale-95 transition-all">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Top Right: Duration Badge & 3-Dots Button */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
                    <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-xs font-mono font-bold text-white border border-white/10 shadow-sm">
                      {video.durationFormatted}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuVideoId(openMenuVideoId === video.id ? null : video.id);
                      }}
                      className="p-1 rounded-lg bg-black/75 backdrop-blur-md text-white hover:bg-black border border-white/10 transition-colors shadow-sm"
                      title="Options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  {openMenuVideoId === video.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-2.5 top-11 w-48 rounded-xl bg-[#140608]/95 border border-red-500/30 shadow-2xl p-1.5 z-30 backdrop-blur-xl space-y-1 text-xs"
                    >
                      <button
                        onClick={() => {
                          setOpenMenuVideoId(null);
                          onOpenReportCopyright(video.originalVideo);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-300 hover:bg-rose-950/50 transition-colors text-left"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        <span>Report Video</span>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(`https://flynk.tv/v/${video.id}`);
                          setOpenMenuVideoId(null);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-neutral-200 hover:bg-white/10 transition-colors text-left"
                      >
                        <Copy className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Copy Link</span>
                      </button>
                    </div>
                  )}

                  {/* Bottom: Thin Red Progress Bar Line */}
                  <div className="absolute bottom-0 inset-x-0 h-1 bg-neutral-900">
                    <div
                      className="h-full bg-red-600 shadow-[0_0_8px_#ef4444]"
                      style={{ width: `${video.progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Metadata Container: Creator Avatar on Left, Title & Info on Right */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCreatorProfile({
                        id: video.creator.handle,
                        name: video.creator.name,
                        handle: video.creator.handle,
                        avatar: video.creator.avatar,
                        role: 'creator',
                        verifiedCreator: true,
                        verifiedSeller: false,
                        followersCount: 25400,
                        followingCount: 310,
                        bio: 'Visual director & digital craftsman creating on FLYNK.',
                      });
                    }}
                    className="cursor-pointer hover:scale-105 transition-transform"
                    title={`View ${video.creator.name}'s Identity Card`}
                  >
                    <img
                      src={video.creator.avatar}
                      alt={video.creator.name}
                      className="w-10 h-10 rounded-full object-cover border border-red-500/40 shrink-0 shadow-sm"
                    />
                  </button>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    {/* STRICTLY 1-LINE VIDEO TITLE */}
                    <h3
                      className="font-bold text-sm text-white font-['Syne'] truncate whitespace-nowrap overflow-hidden text-ellipsis block max-w-full group-hover:text-red-400 transition-colors"
                      title={video.title}
                    >
                      {video.title}
                    </h3>

                    {/* Metadata line: @handle • views • date */}
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono truncate">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCreatorProfile({
                            id: video.creator.handle,
                            name: video.creator.name,
                            handle: video.creator.handle,
                            avatar: video.creator.avatar,
                            role: 'creator',
                            verifiedCreator: true,
                            verifiedSeller: false,
                            followersCount: 25400,
                            followingCount: 310,
                            bio: 'Visual director & digital craftsman creating on FLYNK.',
                          });
                        }}
                        className="text-neutral-300 font-medium hover:text-white underline cursor-pointer"
                      >
                        @{video.creator.handle}
                      </button>
                      <span>•</span>
                      <span>{video.viewsFormatted}</span>
                      <span>•</span>
                      <span>{video.publishedAt}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
