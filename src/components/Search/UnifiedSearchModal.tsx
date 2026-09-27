import React, { useState } from 'react';
import {
  Search,
  X,
  User,
  Sparkles,
  Store,
  Building2,
  Briefcase,
  Play,
  Film,
  ShoppingBag,
  MapPin,
  Compass,
  ArrowRight,
  TrendingUp,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { ShortVideo, LongVideo, Product, User as UserType } from '../../types';
import { PlaceEntity } from '../../types/masterFlynk';

export type SearchVertical =
  | 'all'
  | 'people'
  | 'creators'
  | 'flicks'
  | 'long'
  | 'businesses'
  | 'shops'
  | 'professionals'
  | 'places'
  | 'products';

interface SearchResultItem {
  id: string;
  type:
    | 'person'
    | 'creator'
    | 'business'
    | 'shop'
    | 'professional'
    | 'flick'
    | 'long_video'
    | 'place'
    | 'product';
  title: string;
  subtitle: string;
  avatarOrThumb: string;
  badgeLabel: string;
  badgeColor: string;
  data: any;
}

interface UnifiedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  shorts: ShortVideo[];
  longVideos: LongVideo[];
  products: Product[];
  places: PlaceEntity[];
  onSelectShort: (short: ShortVideo) => void;
  onSelectLongVideo: (video: LongVideo) => void;
  onSelectProduct: (product: Product) => void;
  onSelectPlace: (place: PlaceEntity) => void;
  onSelectCreator: (user: UserType) => void;
  onOpenBooking?: (targetName: string, targetHandle: string, sector?: any, spec?: any) => void;
}

export const UnifiedSearchModal: React.FC<UnifiedSearchModalProps> = ({
  isOpen,
  onClose,
  shorts,
  longVideos,
  products,
  places,
  onSelectShort,
  onSelectLongVideo,
  onSelectProduct,
  onSelectPlace,
  onSelectCreator,
  onOpenBooking,
}) => {
  const [query, setQuery] = useState('');
  const [activeVertical, setActiveVertical] = useState<SearchVertical>('all');

  if (!isOpen) return null;

  // Mocked rich entities database for instant discovery
  const catalogEntities: SearchResultItem[] = [
    // Creators
    {
      id: 'c1',
      type: 'creator',
      title: 'Nani The Visionary',
      subtitle: '@nanicreator • Cinematic Visuals & Travel',
      avatarOrThumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      badgeLabel: 'CREATOR',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      data: { name: 'Nani The Visionary', handle: 'nanicreator', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', verifiedCreator: true },
    },
    // Businesses (Doctor / Clinic)
    {
      id: 'b1',
      type: 'business',
      title: 'Dr. Arjun Reddy, MD',
      subtitle: '@drarjunclinic • Cardiology & Preventive Medicine • Jubilee Hills',
      avatarOrThumb: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      badgeLabel: 'DOCTOR / CLINIC',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      data: { name: 'Dr. Arjun Reddy, MD', handle: 'drarjunclinic', sector: 'doctor_clinic' },
    },
    // Businesses (Real Estate)
    {
      id: 'b2',
      type: 'business',
      title: 'Aura Luxury Penthouses',
      subtitle: '@auraluxuryrealty • 3 & 4 BHK Sky Villas • Financial District',
      avatarOrThumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      badgeLabel: 'REAL ESTATE',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      data: { name: 'Aura Luxury Penthouses', handle: 'auraluxuryrealty', sector: 'real_estate' },
    },
    // Shops
    {
      id: 's1',
      type: 'shop',
      title: 'SNAG LUCHI VASTRA',
      subtitle: '@snagluchivastra • Authentic Handloom Silk & Haute Couture',
      avatarOrThumb: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
      badgeLabel: 'OFFICIAL SHOP',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      data: { name: 'SNAG LUCHI VASTRA', handle: 'snagluchivastra' },
    },
    // Professionals (Video Editor / Developer)
    {
      id: 'p1',
      type: 'professional',
      title: 'Kavya Sharma — Commercial Video Editor',
      subtitle: '@kavyavfx • 8+ Yrs Premiere/DaVinci • Bollywood & OTT trailers',
      avatarOrThumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      badgeLabel: 'VIDEO EDITOR',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      data: { name: 'Kavya Sharma', handle: 'kavyavfx', specialization: 'video_editor' },
    },
    {
      id: 'p2',
      type: 'professional',
      title: 'Vikram Sethi — Full-Stack Architect',
      subtitle: '@vikramtech • React, TypeScript, Cloud & Systems Architecture',
      avatarOrThumb: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      badgeLabel: 'DEVELOPER',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      data: { name: 'Vikram Sethi', handle: 'vikramtech', specialization: 'developer' },
    },
    // Places
    ...places.map((p) => ({
      id: p.id,
      type: 'place' as const,
      title: p.name,
      subtitle: `${p.formattedAddress} • ${p.distanceKm} km away`,
      avatarOrThumb: p.coverImage,
      badgeLabel: 'PLACE / MAPS',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      data: p,
    })),
    // Flicks
    ...shorts.map((s) => ({
      id: s.id,
      type: 'flick' as const,
      title: s.title,
      subtitle: `30s Flick by @${s.creator.handle}`,
      avatarOrThumb: s.thumbnailUrl,
      badgeLabel: 'FLICK',
      badgeColor: 'bg-rose-600/30 text-rose-300 border-rose-500/40',
      data: s,
    })),
    // Long Videos
    ...longVideos.map((lv) => ({
      id: lv.id,
      type: 'long_video' as const,
      title: lv.title,
      subtitle: `Full Video (${lv.durationFormatted}) by @${lv.creator.handle}`,
      avatarOrThumb: lv.thumbnailUrl,
      badgeLabel: 'FULL VIDEO',
      badgeColor: 'bg-sky-600/30 text-sky-300 border-sky-500/40',
      data: lv,
    })),
    // Products
    ...products.map((prd) => ({
      id: prd.id,
      type: 'product' as const,
      title: prd.title,
      subtitle: `₹${prd.price} • ${prd.sellerName} • Escrow Protected`,
      avatarOrThumb: prd.images[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
      badgeLabel: 'PRODUCT',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      data: prd,
    })),
  ];

  // Filtering by query & vertical
  const filtered = catalogEntities.filter((item) => {
    // Vertical filter
    if (activeVertical === 'people' && item.type !== 'person' && item.type !== 'creator') return false;
    if (activeVertical === 'creators' && item.type !== 'creator') return false;
    if (activeVertical === 'flicks' && item.type !== 'flick') return false;
    if (activeVertical === 'long' && item.type !== 'long_video') return false;
    if (activeVertical === 'businesses' && item.type !== 'business') return false;
    if (activeVertical === 'shops' && item.type !== 'shop') return false;
    if (activeVertical === 'professionals' && item.type !== 'professional') return false;
    if (activeVertical === 'places' && item.type !== 'place') return false;
    if (activeVertical === 'products' && item.type !== 'product') return false;

    // Search query filter
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.badgeLabel.toLowerCase().includes(q)
    );
  });

  const handleSelectItem = (item: SearchResultItem) => {
    onClose();
    if (item.type === 'flick') {
      onSelectShort(item.data);
    } else if (item.type === 'long_video') {
      onSelectLongVideo(item.data);
    } else if (item.type === 'product') {
      onSelectProduct(item.data);
    } else if (item.type === 'place') {
      onSelectPlace(item.data);
    } else if (item.type === 'creator') {
      onSelectCreator(item.data);
    } else if (item.type === 'business' || item.type === 'professional') {
      onOpenBooking?.(item.data.name, item.data.handle, item.data.sector, item.data.specialization);
    }
  };

  const verticals: { id: SearchVertical; label: string; icon: any }[] = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'creators', label: 'Creators', icon: Sparkles },
    { id: 'businesses', label: 'Businesses & Doctors', icon: Building2 },
    { id: 'professionals', label: 'Professionals', icon: Briefcase },
    { id: 'places', label: 'Places / Maps', icon: Compass },
    { id: 'flicks', label: 'Flicks', icon: Play },
    { id: 'long', label: 'Full Videos', icon: Film },
    { id: 'shops', label: 'Shops & Boutiques', icon: Store },
    { id: 'products', label: 'Products', icon: ShoppingBag },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center p-0 sm:p-4 select-none font-['Plus_Jakarta_Sans']"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl bg-[#0c050a] border border-neutral-800 sm:rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-top-4 duration-200 mt-0 sm:mt-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 border-b border-neutral-800 flex items-center gap-3 bg-neutral-950/80 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg">
            <Search className="w-5 h-5" />
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people, creators, doctors, editors, places, or products..."
              className="w-full bg-neutral-900 border border-neutral-700/80 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-red-500/80 shadow-inner"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Verticals Chips Row */}
        <div className="px-4 py-2.5 border-b border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 bg-neutral-950/40">
          {verticals.map((v) => {
            const Icon = v.icon;
            const isActive = activeVertical === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setActiveVertical(v.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-['Syne'] flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.4)] border border-red-400'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{v.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Stream */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className="p-3 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 flex items-center justify-between gap-3 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-neutral-700/60 relative">
                    <img
                      src={item.avatarOrThumb}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {item.type === 'flick' && (
                      <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded bg-red-600 flex items-center justify-center text-white">
                        <Play className="w-2 h-2 fill-white" />
                      </span>
                    )}
                    {item.type === 'place' && (
                      <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded bg-emerald-600 flex items-center justify-center text-white">
                        <MapPin className="w-2 h-2" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-xs sm:text-sm text-white font-['Syne'] truncate">
                        {item.title}
                      </h4>
                      <span
                        className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded-full border font-bold ${item.badgeColor}`}
                      >
                        {item.badgeLabel}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <div className="w-7 h-7 rounded-full bg-neutral-800 text-neutral-400 group-hover:text-white group-hover:bg-red-600 transition-all flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-neutral-500 space-y-2">
              <Search className="w-8 h-8 mx-auto text-neutral-600" />
              <p className="text-xs">No matching entities found in {activeVertical}.</p>
              <p className="text-[11px] text-neutral-600">
                Try searching for "Doctor", "Editor", "Jubilee Hills", or "Silk".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
