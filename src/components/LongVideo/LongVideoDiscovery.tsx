import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Film,
  Sparkles,
  Tag,
  User as UserIcon,
  RotateCcw,
  SlidersHorizontal,
  Check,
  Play,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import { LongVideo, User } from '../../types';
import { FlynkLogo } from '../Common/FlynkLogo';

interface LongVideoDiscoveryProps {
  videos: LongVideo[];
  onSelectVideo: (video: LongVideo) => void;
  onOpenCreatorProfile: (creator: User) => void;
  onBackToShorts: () => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

type SearchScope = 'all' | 'creator' | 'title' | 'tags';

export const LongVideoDiscovery: React.FC<LongVideoDiscoveryProps> = ({
  videos,
  onSelectVideo,
  onOpenCreatorProfile,
  onBackToShorts,
  onLoadMore,
  isLoadingMore = false,
  hasMore = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchScope, setSearchScope] = useState<SearchScope>('all');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver to trigger onLoadMore when user scrolls to bottom
  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoadingMore) return;

    const sentinelEl = sentinelRef.current;
    if (!sentinelEl) return;

    const rootEl = containerRef.current || null;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      {
        root: rootEl,
        rootMargin: '180px',
        threshold: 0.1,
      }
    );

    observer.observe(sentinelEl);

    return () => {
      observer.disconnect();
    };
  }, [onLoadMore, hasMore, isLoadingMore, videos.length]);

  const categories = [
    'All',
    'Cinema & Travel',
    'Fashion & Design',
    'Creator Tech',
    'Culinary Masterclass',
  ];

  // Curated popular tags extracted from the video collection
  const popularTags = useMemo(() => {
    const allTags = new Set<string>();
    videos.forEach((v) => {
      v.tags?.forEach((t) => allTags.add(t));
    });
    return Array.from(allTags);
  }, [videos]);

  // Curated popular creators from the video collection
  const uniqueCreators = useMemo(() => {
    const map = new Map<string, User>();
    videos.forEach((v) => {
      if (!map.has(v.creator.id)) {
        map.set(v.creator.id, v.creator);
      }
    });
    return Array.from(map.values());
  }, [videos]);

  // Filtering logic matching Creator, Title, or Tags based on scope
  const filteredVideos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase().replace(/^[@#]/, '');

    return videos.filter((v) => {
      // 1. Category Filter
      const matchesCat =
        selectedCategory === 'All' ||
        v.category.toLowerCase().includes(selectedCategory.toLowerCase());
      if (!matchesCat) return false;

      // 2. Search Query Filter
      if (!query) return true;

      const matchesCreator =
        v.creator.name.toLowerCase().includes(query) ||
        v.creator.handle.toLowerCase().includes(query) ||
        `@${v.creator.handle}`.toLowerCase().includes(query);

      const matchesTitle = v.title.toLowerCase().includes(query);

      const matchesTags =
        v.tags &&
        v.tags.some(
          (tag) =>
            tag.toLowerCase().includes(query) ||
            `#${tag}`.toLowerCase().includes(query)
        );

      const matchesDescription = v.description.toLowerCase().includes(query);

      if (searchScope === 'creator') {
        return matchesCreator;
      }
      if (searchScope === 'title') {
        return matchesTitle;
      }
      if (searchScope === 'tags') {
        return !!matchesTags;
      }

      // Default 'all' matches creator, title, tags, or description
      return matchesCreator || matchesTitle || !!matchesTags || matchesDescription;
    });
  }, [videos, selectedCategory, searchQuery, searchScope]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSelectTag = (tag: string) => {
    // If clicking tag again, toggle off; otherwise set search to tag
    if (searchQuery.toLowerCase() === tag.toLowerCase()) {
      setSearchQuery('');
    } else {
      setSearchQuery(tag);
      setSearchScope('tags');
    }
  };

  const handleSelectCreator = (creatorHandle: string) => {
    setSearchQuery(creatorHandle);
    setSearchScope('creator');
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-[#090304] flex flex-col text-neutral-100 overflow-y-auto"
    >
      {/* TOP STICKY HEADER & SEARCH BAR */}
      <div className="sticky top-0 z-30 bg-[#0e0406]/85 backdrop-blur-2xl px-4 lg:px-6 pt-3.5 pb-3 border-b border-red-500/20 space-y-3 shadow-[0_4px_30px_rgba(220,38,38,0.12)]">
        {/* Row 1: Brand & Back to Shorts Feed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-base tracking-tight text-white font-['Syne']">
              Cinema & Full Stories
            </h1>
            <span className="text-xs text-neutral-500 font-mono">
              · {filteredVideos.length} Available
            </span>
          </div>

          <button
            onClick={onBackToShorts}
            className="text-xs text-neutral-300 hover:text-white font-semibold transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 backdrop-blur-md"
          >
            <span>← Shorts Feed</span>
          </button>
        </div>

        {/* Row 2: SEARCH BAR (Creator, Title, Tags) */}
        <div className="space-y-1.5">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-red-300 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by creator (@handle), title, or tags..."
              className="w-full bg-red-950/20 border border-red-500/30 rounded-2xl pl-10 pr-20 py-2.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all shadow-inner backdrop-blur-xl"
            />

            <div className="absolute right-2.5 flex items-center gap-1">
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="p-1 rounded-full bg-red-950/60 hover:bg-red-900 text-neutral-300 hover:text-white transition-colors"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 rounded-xl border transition-colors backdrop-blur-md ${
                  showFilters || searchScope !== 'all'
                    ? 'bg-red-600 text-white border-red-400 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                    : 'bg-red-950/40 hover:bg-red-900/40 text-neutral-300 border-red-500/25'
                }`}
                title="Search Scope Filters"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Collapsible Search Scope Switcher (Creator / Title / Tags / All) */}
          {showFilters && (
            <div className="flex items-center gap-1.5 pt-1 text-[11px] animate-in fade-in slide-in-from-top-1 duration-150">
              <span className="text-neutral-400 font-medium mr-1">Search in:</span>
              {(['all', 'creator', 'title', 'tags'] as SearchScope[]).map((scope) => (
                <button
                  key={scope}
                  onClick={() => setSearchScope(scope)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors capitalize ${
                    searchScope === scope
                      ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)] border border-red-400/40'
                      : 'bg-red-950/30 text-neutral-400 hover:text-white border border-red-500/20'
                  }`}
                >
                  {scope === 'all' ? 'All Fields' : scope}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Row 3: Category Segmented Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-[0_0_18px_rgba(239,68,68,0.4)] border border-red-400/30'
                  : 'bg-red-950/25 text-neutral-400 hover:text-white border border-red-500/20 hover:border-red-500/40 backdrop-blur-md'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Row 4: Clickable Suggested Search Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[11px]">
          <span className="text-neutral-500 flex items-center gap-1 shrink-0 font-medium">
            <Tag className="w-3 h-3 text-red-400" />
            <span>Tags:</span>
          </span>
          {popularTags.map((tag) => {
            const isTagActive =
              searchQuery.toLowerCase().replace(/^[@#]/, '') === tag.toLowerCase();
            return (
              <button
                key={tag}
                onClick={() => handleSelectTag(tag)}
                className={`px-2 py-0.5 rounded-md font-mono text-[11px] shrink-0 transition-colors border ${
                  isTagActive
                    ? 'bg-red-600/30 text-red-200 border-red-500/60 font-bold shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                    : 'bg-red-950/20 hover:bg-red-950/40 text-neutral-400 hover:text-neutral-200 border-red-500/20'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Search & Filter Feedback Banner */}
      {(searchQuery || selectedCategory !== 'All' || searchScope !== 'all') && (
        <div className="px-4 pt-3">
          <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/25 flex items-center justify-between text-xs backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-2 truncate">
              <span className="text-neutral-300">
                Found <strong className="text-white">{filteredVideos.length}</strong> video{filteredVideos.length === 1 ? '' : 's'}
                {searchQuery && (
                  <>
                    {' '}for "<span className="text-red-400 font-semibold">{searchQuery}</span>"
                    {searchScope !== 'all' && (
                      <span className="text-neutral-400"> in {searchScope}</span>
                    )}
                  </>
                )}
                {selectedCategory !== 'All' && (
                  <span className="text-neutral-400"> in {selectedCategory}</span>
                )}
              </span>
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSearchScope('all');
              }}
              className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 font-semibold shrink-0 ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      )}

      {/* Discovery Banner: Explaining Swipe Right */}
      {!searchQuery && selectedCategory === 'All' && (
        <div className="p-4">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#140608]/60 to-black/70 border border-red-500/25 backdrop-blur-xl flex items-center justify-between text-xs shadow-[0_4px_25px_rgba(220,38,38,0.12)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white block">Long-Video Discovery Feed</span>
                <span className="text-[11px] text-neutral-400">
                  Search full-length cinematic stories by creator, title, or #tags.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIDEOS CATALOGUE OR EMPTY STATE */}
      <div className="px-4 lg:px-6 pb-8 mt-2">
        {filteredVideos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => onSelectVideo(video)}
                  className="group cursor-pointer bg-gradient-to-b from-[#140608]/80 via-neutral-950/90 to-black/95 rounded-2xl overflow-hidden border border-red-500/15 hover:border-red-500/45 transition-all shadow-xl hover:shadow-[0_10px_35px_rgba(220,38,38,0.22)] flex flex-col backdrop-blur-xl"
                >
                  {/* Thumbnail Aspect Video */}
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-900 shrink-0">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />

                    {/* Duration badge */}
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/85 backdrop-blur-md text-white font-mono text-xs font-semibold tabular-nums border border-white/10">
                      {video.durationFormatted}
                    </span>

                    {/* Short Trailers subtle overlay */}
                    {video.linkedShortIds && video.linkedShortIds.length > 0 && (
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-red-500/30 text-[11px] font-medium text-white flex items-center gap-1.5 shadow-lg">
                        <Film className="w-3.5 h-3.5 text-red-400" />
                        <span>{video.linkedShortIds.length} Trailer{video.linkedShortIds.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>

                  {/* Content Row */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="flex gap-3">
                      <img
                        src={video.creator.avatar}
                        alt={video.creator.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCreatorProfile(video.creator);
                        }}
                        className="w-10 h-10 rounded-full object-cover border border-red-500/30 hover:scale-105 transition-transform shrink-0 mt-0.5 shadow-sm"
                      />

                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-bold text-sm text-white font-['Syne'] leading-snug truncate whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-red-400 transition-colors block max-w-full"
                          title={video.title}
                        >
                          {video.title}
                        </h3>

                        {/* Unboxed metadata with typographic separators */}
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-neutral-400">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectCreator(video.creator.handle);
                            }}
                            className="text-neutral-300 font-medium hover:underline hover:text-red-400 transition-colors"
                          >
                            @{video.creator.handle}
                          </span>
                          {video.creator.verifiedCreator && (
                            <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white inline-flex items-center justify-center text-[7px] font-bold shadow-[0_0_6px_#ef4444]">
                              ✓
                            </span>
                          )}
                          <span aria-hidden="true" className="text-neutral-600">·</span>
                          <span className="tabular-nums">{(video.viewsCount / 1000).toFixed(0)}k views</span>
                          <span aria-hidden="true" className="text-neutral-600">·</span>
                          <span>{video.publishedAt}</span>
                        </div>

                        <p className="text-xs text-neutral-400 line-clamp-2 mt-1.5 leading-relaxed">
                          {video.description.replace(/#\S+/g, '').replace(/\s{2,}/g, ' ').trim()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          {/* INTERSECTION OBSERVER SENTINEL & INFINITE SCROLL LOADER */}
          <div className="pt-2 pb-6 flex flex-col items-center justify-center w-full">
            {isLoadingMore ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-950/40 border border-red-500/30 text-xs font-semibold text-red-400 shadow-[0_0_20px_rgba(220,38,38,0.2)] backdrop-blur-md">
                  <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                  <span>Loading more cinematic videos...</span>
                </div>
                <span className="text-[11px] text-neutral-500">
                  Retrieving high-bitrate full stories
                </span>
              </div>
            ) : hasMore ? (
              <div
                ref={sentinelRef}
                className="w-full py-4 flex flex-col items-center justify-center gap-1.5"
              >
                <div className="w-8 h-1 rounded-full bg-red-500/30 mb-1" />
                {onLoadMore && (
                  <button
                    onClick={onLoadMore}
                    className="text-[11px] text-neutral-300 hover:text-white px-3.5 py-1.5 rounded-xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/25 transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <TrendingUp className="w-3 h-3 text-red-400" />
                    <span>Scroll or tap to load more videos</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="py-6 text-center border-t border-red-500/15 w-full mt-2 space-y-1">
                <p className="text-xs text-neutral-400 font-semibold">
                  You've reached the end of the catalog
                </p>
                <p className="text-[11px] text-neutral-600">
                  All {videos.length} full-length stories loaded
                </p>
              </div>
            )}
          </div>
        </>
        ) : (
          /* EMPTY STATE */
          <div className="py-12 px-4 text-center space-y-4 bg-red-950/15 rounded-3xl border border-red-500/20 backdrop-blur-xl">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto border border-red-500/25 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Search className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-white text-sm">No videos found</h4>
              <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                No videos match your search for "{searchQuery}". Try searching for another creator, title keyword, or tag.
              </p>
            </div>

            {/* Quick Suggestions to explore */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] text-neutral-500 font-medium block">
                Try searching by popular tags:
              </span>
              <div className="flex flex-wrap justify-center gap-1.5 max-w-sm mx-auto">
                {popularTags.slice(0, 6).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSelectTag(tag)}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-red-950/30 hover:bg-red-900/40 text-neutral-300 border border-red-500/25 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear button */}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSearchScope('all');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
