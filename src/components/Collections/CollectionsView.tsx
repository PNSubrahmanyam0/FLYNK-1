import React, { useState } from 'react';
import {
  Folder,
  Globe,
  Lock,
  Share2,
  Plus,
  Play,
  ShoppingBag,
  MapPin,
  Briefcase,
  Building2,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Collection, CollectionItem } from '../../types';

interface CollectionsViewProps {
  collections: Collection[];
  onSelectCollectionItem?: (item: CollectionItem) => void;
  onSelectFlick?: (shortId: string) => void;
  onSelectLongVideo?: (videoId: string) => void;
  onSelectProduct?: (prodId: string) => void;
  onSelectPlace?: (placeId: string) => void;
  onUpdateCollections?: (collections: Collection[]) => void;
  onShareCollection?: (collection: Collection) => void;
  onCreateCollection?: () => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  collections,
  onSelectCollectionItem,
  onSelectFlick,
  onSelectLongVideo,
  onSelectProduct,
  onSelectPlace,
  onUpdateCollections,
  onShareCollection,
  onCreateCollection,
}) => {
  const [activeCollection, setActiveCollection] = useState<Collection | null>(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleShare = (col: Collection) => {
    setCopiedId(col.id);
    if (onShareCollection) {
      onShareCollection(col);
    }
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'flick':
        return <Play className="w-3.5 h-3.5 text-rose-400" />;
      case 'long_video':
        return <Play className="w-3.5 h-3.5 text-red-500" />;
      case 'product':
        return <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />;
      case 'place':
        return <MapPin className="w-3.5 h-3.5 text-emerald-400" />;
      case 'business':
        return <Building2 className="w-3.5 h-3.5 text-sky-400" />;
      case 'professional':
        return <Briefcase className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Folder className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  // If a collection is opened
  if (activeCollection) {
    const filteredItems = activeCollection.items.filter((item) => {
      if (activeTypeFilter === 'all') return true;
      return item.itemType === activeTypeFilter;
    });

    return (
      <div className="space-y-6 font-['Plus_Jakarta_Sans'] text-white">
        {/* Top Back & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveCollection(null)}
            className="flex items-center gap-2 text-xs font-bold font-['Syne'] text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Collections</span>
          </button>

          <button
            onClick={() => handleShare(activeCollection)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-neutral-300 hover:text-white"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedId === activeCollection.id ? 'Link Copied!' : 'Share Collection'}</span>
          </button>
        </div>

        {/* Collection Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 p-6 flex flex-col justify-end min-h-[160px]">
          {activeCollection.coverImage && (
            <img
              src={activeCollection.coverImage}
              alt={activeCollection.name}
              className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-[2px]"
            />
          )}
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{activeCollection.emoji}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 font-bold ${
                  activeCollection.isPublic
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                }`}
              >
                {activeCollection.isPublic ? (
                  <>
                    <Globe className="w-3 h-3" />
                    <span>Public Collection</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3 h-3" />
                    <span>Private Collection</span>
                  </>
                )}
              </span>
            </div>
            <h2 className="text-2xl font-bold font-['Syne'] text-white">{activeCollection.name}</h2>
            {activeCollection.description && (
              <p className="text-xs text-neutral-300 max-w-lg">{activeCollection.description}</p>
            )}
            <div className="text-[11px] text-neutral-400 font-mono">
              {activeCollection.items.length} items • Updated {activeCollection.updatedAt}
            </div>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {['all', 'place', 'flick', 'product', 'business', 'professional'].map((type) => (
            <button
              key={type}
              onClick={() => setActiveTypeFilter(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Syne'] capitalize transition-all cursor-pointer ${
                activeTypeFilter === type
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              {type === 'all' ? 'All Items' : type.replace('_', ' ') + 's'}
            </button>
          ))}
        </div>

        {/* Collection Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <p className="text-xs text-neutral-400">No items match this filter in this collection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectCollectionItem?.(item);
                  const targetId = item.itemId || item.id;
                  if (item.itemType === 'flick' && onSelectFlick) onSelectFlick(targetId);
                  else if (item.itemType === 'long_video' && onSelectLongVideo) onSelectLongVideo(targetId);
                  else if (item.itemType === 'product' && onSelectProduct) onSelectProduct(targetId);
                  else if (item.itemType === 'place' && onSelectPlace) onSelectPlace(targetId);
                }}
                className="group p-3 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-red-500/40 transition-all cursor-pointer flex items-center gap-3.5"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-1 left-1 p-1 rounded-md bg-black/70 backdrop-blur-md">
                    {getItemIcon(item.itemType)}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs sm:text-sm text-white font-['Syne'] truncate">
                    {item.title}
                  </h4>
                  {item.subtitle && (
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">{item.subtitle}</p>
                  )}
                  {item.metadata && (
                    <div className="mt-1 text-[10px] text-neutral-500 font-mono truncate">
                      {item.metadata}
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // All Collections Overview
  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans'] text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Folder className="w-5 h-5 text-red-500" />
            <h2 className="text-xl font-bold font-['Syne'] text-white">My Collections</h2>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Curated spaces for places, food spots, creative inspiration & gear
          </p>
        </div>

        {onCreateCollection && (
          <button
            onClick={onCreateCollection}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-['Syne'] flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Collection</span>
          </button>
        )}
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collections.map((col) => (
          <div
            key={col.id}
            onClick={() => setActiveCollection(col)}
            className="group rounded-3xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-red-500/50 p-4 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            {/* Background preview stack */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 border border-neutral-700/80 flex items-center justify-center text-2xl shadow-inner shrink-0">
                {col.emoji}
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1 font-bold ${
                    col.isPublic
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                  }`}
                >
                  {col.isPublic ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  <span>{col.isPublic ? 'Public' : 'Private'}</span>
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(col);
                  }}
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  title="Share collection"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1 mb-4">
              <h3 className="font-bold text-base font-['Syne'] text-white group-hover:text-red-400 transition-colors truncate">
                {col.name}
              </h3>
              {col.description && (
                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {col.description}
                </p>
              )}
            </div>

            {/* Thumbnail Stack Preview */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-800/70">
              <div className="flex -space-x-2">
                {col.items.slice(0, 4).map((it, idx) => (
                  <img
                    key={it.id || idx}
                    src={it.imageUrl}
                    alt={it.title}
                    className="w-7 h-7 rounded-lg object-cover border border-neutral-900"
                  />
                ))}
                {col.items.length === 0 && (
                  <span className="text-[10px] text-neutral-500">Empty collection</span>
                )}
              </div>

              <div className="text-[11px] font-mono font-bold text-neutral-300">
                {col.items.length} {col.items.length === 1 ? 'item' : 'items'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
