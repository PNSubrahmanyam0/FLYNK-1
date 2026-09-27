import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Users,
  Flame,
  MapPin,
  Store,
  Building2,
  Briefcase,
  ShoppingBag,
  Play,
  Film,
  Navigation,
  ArrowRight,
  Filter,
  CheckCircle,
  Eye,
  Star,
  Clock,
  ShieldCheck,
  Bookmark,
  Calendar,
  Utensils,
  Activity,
  Send,
} from 'lucide-react';
import { ShortVideo, LongVideo, Product, User } from '../../types';
import { PlaceEntity, BusinessSector, ProfessionalSpecialization } from '../../types/masterFlynk';
import {
  NEARBY_PRESETS,
  NEARBY_RADIUS_OPTIONS,
  NEARBY_EVENTS,
  NEARBY_THINGS_TO_DO,
} from '../../data/mockNearby';

export type ExploreTab =
  | 'for_you'
  | 'following'
  | 'trending'
  | 'nearby'
  | 'creators'
  | 'places'
  | 'products'
  | 'businesses'
  | 'professionals';

interface ExploreViewProps {
  shorts: ShortVideo[];
  longVideos: LongVideo[];
  products: Product[];
  places: PlaceEntity[];
  onSelectShort: (short: ShortVideo) => void;
  onSelectLongVideo: (video: LongVideo) => void;
  onSelectProduct: (product: Product) => void;
  onSelectPlace: (place: PlaceEntity) => void;
  onSelectCreator: (user: User) => void;
  onOpenIdentityCard: (user: User) => void;
  onOpenBooking: (targetName: string, targetHandle: string, sector?: any, spec?: any) => void;
  onOpenSearch: () => void;
  onOpenSaveToCollection?: (item: any) => void;
  onOpenRequestQuote?: (pro: any) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  shorts,
  longVideos,
  products,
  places,
  onSelectShort,
  onSelectLongVideo,
  onSelectProduct,
  onSelectPlace,
  onSelectCreator,
  onOpenIdentityCard,
  onOpenBooking,
  onOpenSearch,
  onOpenSaveToCollection,
  onOpenRequestQuote,
}) => {
  const [activeTab, setActiveTab] = useState<ExploreTab>('for_you');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Nearby states
  const [nearbyPreset, setNearbyPreset] = useState(NEARBY_PRESETS[0]);
  const [nearbyRadius, setNearbyRadius] = useState<number>(5);
  const [nearbyCategory, setNearbyCategory] = useState<
    'all' | 'flicks' | 'restaurants' | 'places' | 'events' | 'shops' | 'professionals' | 'things_to_do'
  >('all');
  const [isLocationPrivacyActive, setIsLocationPrivacyActive] = useState(true);

  const exploreTabs: { id: ExploreTab; label: string; icon: any }[] = [
    { id: 'for_you', label: 'For You', icon: Sparkles },
    { id: 'following', label: 'Following', icon: Users },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'nearby', label: 'Nearby (GPS)', icon: MapPin },
    { id: 'creators', label: 'Creators', icon: Eye },
    { id: 'places', label: 'Places & Maps', icon: Compass },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'businesses', label: 'Businesses & Doctors', icon: Building2 },
    { id: 'professionals', label: 'Professionals', icon: Briefcase },
  ];

  // Curated Discovery Creators
  const discoveryCreators = [
    {
      id: 'usr_nani_creator',
      name: 'Nani The Visionary',
      handle: 'nanicreator',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      role: 'creator' as const,
      category: 'Cinematic Travel & Heritage',
      followers: '25.4K',
      flicksCount: 18,
      verified: true,
      bio: 'Directing visual travelogues across India. Explorer of timeless architecture and handloom textiles.',
    },
    {
      id: 'usr_aria',
      name: 'Aria Vance',
      handle: 'aria_vance',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      role: 'creator' as const,
      category: 'Minimalist Fashion & Tailoring',
      followers: '184K',
      flicksCount: 42,
      verified: true,
      bio: 'Bespoke tailoring, street silhouettes & modern Indian luxury fashion.',
    },
    {
      id: 'usr_nikhil',
      name: 'Nikhil Sen',
      handle: 'nikhilsen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      role: 'creator' as const,
      category: 'Heritage Culinary & Street Gastronomy',
      followers: '92.1K',
      flicksCount: 31,
      verified: true,
      bio: 'Tracing hyper-local regional flavors from Hyderabad royal kitchens to coastal spices.',
    },
  ];

  // Curated Discovery Businesses (Doctors, Clinics, Real Estate)
  const discoveryBusinesses = [
    {
      id: 'biz_dr_arjun',
      name: 'Dr. Arjun Reddy, MD',
      handle: '@drarjunclinic',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      badge: 'DOCTOR / CLINIC',
      sector: 'doctor_clinic' as BusinessSector,
      location: 'Road No. 92, Jubilee Hills, Hyderabad',
      distance: '3.1 km',
      specialty: 'Cardiology Assessment & Preventive Care',
      consultationFee: '₹800',
      rating: 4.9,
    },
    {
      id: 'biz_aura_realty',
      name: 'Aura Luxury Penthouses',
      handle: '@auraluxuryrealty',
      avatar: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80',
      badge: 'REAL ESTATE',
      sector: 'real_estate' as BusinessSector,
      location: 'Financial District, Nanakramguda, Hyderabad',
      distance: '6.5 km',
      specialty: '3 & 4 BHK Sky Villas • Private Pools',
      consultationFee: 'Complimentary Site Visit',
      rating: 5.0,
    },
    {
      id: 'biz_snag_boutique',
      name: 'SNAG LUCHI VASTRA',
      handle: '@snagluchivastra',
      avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
      badge: 'HAUTE COUTURE STORE',
      sector: 'other' as BusinessSector,
      location: 'Road No. 36, Jubilee Hills, Hyderabad',
      distance: '2.8 km',
      specialty: 'Authentic Woven Silk & Designer Ensembles',
      consultationFee: 'In-Store Trial & Alteration',
      rating: 4.9,
    },
  ];

  // Curated Discovery Professionals (Editors, Developers, Architects)
  const discoveryProfessionals = [
    {
      id: 'pro_kavya',
      name: 'Kavya Sharma',
      handle: '@kavyavfx',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      badge: 'VIDEO EDITOR',
      specialization: 'video_editor' as ProfessionalSpecialization,
      experience: '8+ Years',
      skills: ['DaVinci Resolve', 'Premiere Pro', 'Film Colorist', 'Viral Reels Cut'],
      startingRate: '₹15,000 / pack',
      rating: 4.9,
    },
    {
      id: 'pro_vikram',
      name: 'Vikram Sethi',
      handle: '@vikramtech',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      badge: 'FULL-STACK DEVELOPER',
      specialization: 'developer' as ProfessionalSpecialization,
      experience: '6+ Years',
      skills: ['React', 'TypeScript', 'Cloud Systems', 'GraphQL'],
      startingRate: '₹60,000 / MVP',
      rating: 5.0,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#060205] text-white pb-24 font-['Plus_Jakarta_Sans'] select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#0c0409]/90 backdrop-blur-xl border-b border-neutral-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-red-500 animate-pulse" />
            <h1 className="text-lg sm:text-xl font-bold font-['Syne'] text-white">
              Explore FLYNK
            </h1>
          </div>
          <p className="text-[11px] text-neutral-400">
            Intentional Discovery • No Algorithmic Traps
          </p>
        </div>

        <button
          onClick={onOpenSearch}
          className="px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
        >
          <span>Search All</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 text-neutral-400 border border-neutral-800">
            ⌘K
          </span>
        </button>
      </div>

      {/* Explore Tabs Bar */}
      <div className="px-4 sm:px-6 pt-3 pb-2 overflow-x-auto no-scrollbar border-b border-neutral-800/60 bg-[#090307]/70 flex items-center gap-2 sticky top-[61px] z-20 backdrop-blur-md">
        {exploreTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-['Syne'] flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-400'
                  : 'bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-8">
        {/* ================= 1. FOR YOU (Curated Intentional Highlights) ================= */}
        {(activeTab === 'for_you' || activeTab === 'trending') && (
          <div className="space-y-8">
            {/* Featured Creators Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-rose-500" />
                  <h3 className="font-bold text-sm sm:text-base font-['Syne'] text-white">
                    Spotlight Creators
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('creators')}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {discoveryCreators.map((creator) => (
                  <div
                    key={creator.id}
                    onClick={() => {
                      onOpenIdentityCard({
                        id: creator.id,
                        name: creator.name,
                        handle: creator.handle,
                        avatar: creator.avatar,
                        role: creator.role,
                        verifiedCreator: creator.verified,
                        verifiedSeller: false,
                        followersCount: 25400,
                        followingCount: 310,
                        bio: creator.bio,
                      });
                    }}
                    className="p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-red-500/40 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-white font-['Syne'] truncate">
                          {creator.name}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          @{creator.handle}
                        </div>
                        <span className="inline-block mt-1 text-[9px] font-mono px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                          {creator.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending 30s Flicks Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <h3 className="font-bold text-sm sm:text-base font-['Syne'] text-white">
                    Trending 30s Flicks
                  </h3>
                </div>
                <span className="text-xs text-neutral-400">Linked to Long Videos</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {shorts.slice(0, 5).map((flick) => (
                  <div
                    key={flick.id}
                    onClick={() => onSelectShort(flick)}
                    className="aspect-[9/16] rounded-2xl overflow-hidden relative border border-neutral-800 hover:border-red-500/50 shadow-md group cursor-pointer transition-all"
                  >
                    <img
                      src={flick.thumbnailUrl}
                      alt={flick.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono text-red-300 font-bold border border-red-500/30">
                        30s
                      </span>
                    </div>

                    <div className="absolute bottom-2.5 inset-x-2.5 z-10 text-white">
                      <div className="text-xs font-bold font-['Syne'] truncate">
                        {flick.title}
                      </div>
                      <div className="text-[10px] text-neutral-300 truncate mt-0.5">
                        @{flick.creator.handle}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Local Places & Maps Showcase */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-bold text-sm sm:text-base font-['Syne'] text-white">
                    Verified Places in Hyderabad
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('places')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                >
                  <span>Explore Places</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {places.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => onSelectPlace(place)}
                    className="rounded-2xl overflow-hidden bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 cursor-pointer transition-all group"
                  >
                    <div className="h-28 overflow-hidden relative">
                      <img
                        src={place.coverImage}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono text-emerald-300 font-bold border border-emerald-500/30">
                        {place.distanceKm} km away
                      </span>
                    </div>
                    <div className="p-3">
                      <div className="font-bold text-xs sm:text-sm text-white font-['Syne'] truncate">
                        {place.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {place.category}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. FOLLOWING ================= */}
        {activeTab === 'following' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-['Syne'] text-white">
              Recent Activity from Accounts You Follow
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {longVideos.slice(0, 4).map((video) => (
                <div
                  key={video.id}
                  onClick={() => onSelectLongVideo(video)}
                  className="p-3 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 flex items-center gap-3 cursor-pointer transition-all"
                >
                  <div className="w-32 aspect-video rounded-xl overflow-hidden relative shrink-0">
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
                    <div className="font-bold text-xs sm:text-sm text-white font-['Syne'] truncate">
                      {video.title}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {video.creator.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 3. NEARBY (Full-Featured Intent Engine) ================= */}
        {activeTab === 'nearby' && (
          <div className="space-y-6">
            {/* Privacy-Preserving Location & Radius Control Bar */}
            <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900/80 border border-neutral-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-sm sm:text-base text-white font-['Syne']">
                        Nearby FLYNK
                      </h2>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        Hyper-Local
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      What's happening around you: food creator reviews, local events, boutiques & talent
                    </p>
                  </div>
                </div>

                {/* Location Preset Switcher */}
                <div className="flex items-center gap-2">
                  <select
                    value={nearbyPreset.id}
                    onChange={(e) => {
                      const found = NEARBY_PRESETS.find((p) => p.id === e.target.value);
                      if (found) setNearbyPreset(found);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {NEARBY_PRESETS.map((preset) => (
                      <option key={preset.id} value={preset.id} className="bg-neutral-900">
                        📍 {preset.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Distance Radius Pills */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-800 flex-wrap">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="text-[11px] font-mono text-neutral-400 mr-1 hidden sm:inline">
                    Distance:
                  </span>
                  {NEARBY_RADIUS_OPTIONS.map((rad) => (
                    <button
                      key={rad.id}
                      type="button"
                      onClick={() => setNearbyRadius(rad.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        nearbyRadius === rad.id
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                          : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {rad.label}
                    </button>
                  ))}
                </div>

                {/* Privacy Badge */}
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Privacy-Preserving • GPS never stored</span>
                </div>
              </div>
            </div>

            {/* Nearby Subcategory Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'All Highlights', icon: Sparkles },
                { id: 'flicks', label: 'Popular Flicks', icon: Film },
                { id: 'restaurants', label: 'Restaurants & Cafes', icon: Utensils },
                { id: 'places', label: 'Places & Maps', icon: MapPin },
                { id: 'events', label: 'Events & Happenings', icon: Calendar },
                { id: 'shops', label: 'Shops & Boutiques', icon: ShoppingBag },
                { id: 'professionals', label: 'Nearby Talent', icon: Briefcase },
                { id: 'things_to_do', label: 'Things to Do', icon: Activity },
              ].map((sub) => {
                const Icon = sub.icon;
                const isActive = nearbyCategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => setNearbyCategory(sub.id as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-['Syne'] flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-black font-extrabold shadow-md shadow-emerald-500/20'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{sub.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ================= NEARBY CONTENT FEED ================= */}

            {/* 1. Popular Geo-Tagged Flicks */}
            {(nearbyCategory === 'all' || nearbyCategory === 'flicks') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film className="w-4 h-4 text-rose-500" />
                    <h3 className="font-bold text-sm sm:text-base font-['Syne'] text-white">
                      Popular Local Flicks Around {nearbyPreset.name.split(',')[0]}
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">Food reviews & spots</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {shorts.slice(0, 4).map((short) => (
                    <div
                      key={short.id}
                      onClick={() => onSelectShort(short)}
                      className="group rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-rose-500/50 cursor-pointer transition-all flex flex-col justify-between relative aspect-[9/16]"
                    >
                      <img
                        src={short.thumbnailUrl}
                        alt={short.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/60" />

                      {/* Top Bar on Flick */}
                      <div className="relative z-10 p-2.5 flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[9px] font-mono text-emerald-300 font-bold border border-emerald-500/30">
                          📍 1.8 km
                        </span>
                        {onOpenSaveToCollection && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenSaveToCollection({
                                id: short.id,
                                itemType: 'flick',
                                title: short.title,
                                subtitle: `${short.creator.name} • Reel`,
                                imageUrl: short.thumbnailUrl,
                              });
                            }}
                            className="p-1.5 rounded-full bg-black/60 hover:bg-red-600 text-white backdrop-blur-md transition-colors"
                          >
                            <Bookmark className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* Bottom Info with Contextual Intent Button */}
                      <div className="relative z-10 p-3 space-y-2">
                        <p className="font-bold text-xs text-white line-clamp-2 leading-snug">
                          {short.title}
                        </p>

                        {/* Intent Action Button */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (short.intentAction?.type === 'get_directions') {
                              onSelectPlace(places[0]);
                            } else if (short.intentAction?.type === 'view_product') {
                              onSelectProduct(products[0]);
                            } else {
                              onSelectShort(short);
                            }
                          }}
                          className="w-full py-1.5 px-2 rounded-xl bg-white/15 hover:bg-rose-600 text-white backdrop-blur-md text-[10px] font-bold font-['Syne'] flex items-center justify-center gap-1.5 transition-colors border border-white/20"
                        >
                          <Navigation className="w-3 h-3 text-rose-400 group-hover:text-white" />
                          <span>{short.intentAction?.label || 'Explore Spot'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Restaurants & Cafes */}
            {(nearbyCategory === 'all' || nearbyCategory === 'restaurants') && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-500" />
                    <h3 className="font-bold text-sm sm:text-base font-['Syne'] text-white">
                      Restaurants & Cafes Within {nearbyRadius} km
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-400">Verified hyderabadi kitchens</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'rest_niloufer',
                      name: 'Cafe Niloufer & Premium Bakers',
                      area: 'Red Hills / Lakdikapul',
                      distance: '1.9 km',
                      specialty: 'Authentic Irani Chai, Osmania Biscuits & Bun Maska',
                      rating: 4.9,
                      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
                      action: 'View Menu & Directions',
                    },
                    {
                      id: 'rest_chutneys',
                      name: 'Chutneys Royal Heritage',
                      area: 'Road No. 1, Banjara Hills',
                      distance: '2.4 km',
                      specialty: '7-Chutney Guntur Idli & Ghee Roast Dosa',
                      rating: 4.8,
                      image: 'https://images.unsplash.com/photo-1584990347449-397a66ef838b?auto=format&fit=crop&w=600&q=80',
                      action: 'Reserve Table',
                    },
                    {
                      id: 'rest_shahghouse',
                      name: 'Shah Ghouse Royal Dum Biryani',
                      area: 'Tolichowki / Gachibowli',
                      distance: '3.8 km',
                      specialty: 'Slow-Cooked Mutton Dum Biryani & Mirchi Ka Salan',
                      rating: 4.9,
                      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
                      action: 'Directions',
                    },
                  ].map((rest) => (
                    <div
                      key={rest.id}
                      className="p-3.5 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={rest.image}
                          alt={rest.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-neutral-800"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-xs sm:text-sm text-white font-['Syne'] truncate">
                              {rest.name}
                            </h4>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                              {rest.distance}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 truncate mt-0.5">{rest.area}</p>
                          <p className="text-[10px] text-neutral-400 mt-1 line-clamp-1">{rest.specialty}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-neutral-800/80">
                        <button
                          onClick={() => onSelectPlace(places[0])}
                          className="flex-1 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-bold text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>{rest.action}</span>
                        </button>

                        {onOpenSaveToCollection && (
                          <button
                            onClick={() =>
                              onOpenSaveToCollection({
                                id: rest.id,
                                itemType: 'business',
                                title: rest.name,
                                subtitle: `${rest.area} • ${rest.specialty}`,
                                imageUrl: rest.image,
                              })
                            }
                            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            title="Save to Collection"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Verified Places & Landmarks */}
            {(nearbyCategory === 'all' || nearbyCategory === 'places') && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-sm sm:text-base font-['Syne'] text-white">
                      Places & Scenic Landmarks ({places.length})
                    </h3>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold cursor-pointer">
                    View on Map
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {places.map((place) => (
                    <div
                      key={place.id}
                      onClick={() => onSelectPlace(place)}
                      className="p-3.5 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 flex items-center gap-3.5 cursor-pointer transition-all group"
                    >
                      <img
                        src={place.coverImage}
                        alt={place.name}
                        className="w-20 h-20 rounded-xl object-cover border border-white/10 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-white font-['Syne'] truncate">
                            {place.name}
                          </h4>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            {place.distanceKm} km
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                          {place.formattedAddress}
                        </p>
                        <div className="mt-1 text-[10px] text-neutral-400 font-mono">
                          ⏱ {place.openingHours}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        {onOpenSaveToCollection && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenSaveToCollection({
                                id: place.id,
                                itemType: 'place',
                                title: place.name,
                                subtitle: place.formattedAddress,
                                imageUrl: place.coverImage,
                              });
                            }}
                            className="p-1.5 rounded-xl bg-neutral-800 hover:bg-emerald-600 text-neutral-400 hover:text-white transition-colors"
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <Navigation className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Local Events & Happenings */}
            {(nearbyCategory === 'all' || nearbyCategory === 'events') && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <h3 className="font-bold text-sm sm:text-base font-['Syne'] text-white">
                      Local Events & Pop-ups Around Hyderabad
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-400">Live community gatherings</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {NEARBY_EVENTS.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-3.5 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={evt.coverImage}
                          alt={evt.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-neutral-800"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                              {evt.category}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">
                              {evt.distanceKm} km
                            </span>
                          </div>
                          <h4 className="font-bold text-xs sm:text-sm text-white font-['Syne'] mt-1 truncate">
                            {evt.title}
                          </h4>
                          <p className="text-[11px] text-neutral-400 mt-0.5">
                            {evt.date} • {evt.time}
                          </p>
                          <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                            📍 {evt.location}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80">
                        <div className="text-xs font-mono font-bold text-neutral-200">
                          {evt.price}
                        </div>
                        <div className="flex items-center gap-2">
                          {onOpenSaveToCollection && (
                            <button
                              onClick={() =>
                                onOpenSaveToCollection({
                                  id: evt.id,
                                  itemType: 'place',
                                  title: evt.title,
                                  subtitle: `${evt.date} • ${evt.location}`,
                                  imageUrl: evt.coverImage,
                                })
                              }
                              className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              onOpenBooking(
                                evt.organizer,
                                '@events',
                                'other',
                                undefined
                              )
                            }
                            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-['Syne'] transition-colors cursor-pointer"
                          >
                            {evt.intentActionText}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Shops & Boutiques */}
            {(nearbyCategory === 'all' || nearbyCategory === 'shops') && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-sm sm:text-base font-['Syne'] text-white">
                      Boutiques & Retail Stores Nearby
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-400">Escrow protected shopping</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {products.slice(0, 4).map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => onSelectProduct(prod)}
                      className="p-3.5 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 transition-all flex items-center gap-3 cursor-pointer group"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-neutral-800"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-xs sm:text-sm text-white font-['Syne'] truncate">
                            {prod.title}
                          </h4>
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                          By @{prod.sellerHandle} • {prod.category}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                            ✓ Escrow Protected
                          </span>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            Road No. 36, Jubilee Hills
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Nearby Freelance Professionals */}
            {(nearbyCategory === 'all' || nearbyCategory === 'professionals') && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-purple-400" />
                    <h3 className="font-bold text-sm sm:text-base font-['Syne'] text-white">
                      Nearby Independent Professionals
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-400">Video editors, devs & designers</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {discoveryProfessionals.map((pro) => (
                    <div
                      key={pro.id}
                      className="p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={pro.avatar}
                          alt={pro.name}
                          className="w-14 h-14 rounded-2xl object-cover shrink-0 border border-neutral-800"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-sm text-white font-['Syne'] truncate">
                              {pro.name}
                            </h4>
                            <span className="text-xs font-mono font-bold text-emerald-400">
                              {pro.startingRate}
                            </span>
                          </div>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold inline-block mt-0.5">
                            {pro.badge}
                          </span>
                          <p className="text-[11px] text-neutral-400 mt-1">
                            {pro.experience} • {pro.skills.slice(0, 3).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                        <button
                          onClick={() => {
                            if (onOpenRequestQuote) {
                              onOpenRequestQuote(pro);
                            }
                          }}
                          className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-['Syne'] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>Request Project Quote</span>
                        </button>

                        <button
                          onClick={() =>
                            onOpenIdentityCard({
                              id: pro.id,
                              name: pro.name,
                              handle: pro.handle,
                              avatar: pro.avatar,
                              role: 'personal',
                              verifiedCreator: true,
                              verifiedSeller: false,
                              followersCount: 14200,
                              followingCount: 180,
                              bio: `Professional ${pro.badge}. 8+ years experience.`,
                            })
                          }
                          className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        >
                          Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. Things to Do */}
            {(nearbyCategory === 'all' || nearbyCategory === 'things_to_do') && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-sm sm:text-base font-['Syne'] text-white">
                      Curated Things to Do in Hyderabad
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-400">Experiences & workshops</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {NEARBY_THINGS_TO_DO.map((ttd) => (
                    <div
                      key={ttd.id}
                      className="p-3.5 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={ttd.coverImage}
                          alt={ttd.title}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-neutral-800"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                              {ttd.badge}
                            </span>
                            <span className="text-[10px] font-mono text-emerald-400 font-bold">
                              {ttd.distanceKm} km
                            </span>
                          </div>
                          <h4 className="font-bold text-xs sm:text-sm text-white font-['Syne'] mt-1">
                            {ttd.title}
                          </h4>
                          <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                            {ttd.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
                        <div>
                          <span className="font-mono font-bold text-emerald-400">{ttd.price}</span>
                          <span className="text-neutral-500 text-[10px] ml-1.5 font-mono">
                            • {ttd.duration}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            onOpenBooking(
                              ttd.title,
                              '@activity',
                              'other',
                              undefined
                            )
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-['Syne'] transition-colors cursor-pointer"
                        >
                          Book Activity
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 4. CREATORS ================= */}
        {activeTab === 'creators' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-['Syne'] text-white">
              Discover Independent Creators
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {discoveryCreators.map((c) => (
                <div
                  key={c.id}
                  onClick={() =>
                    onOpenIdentityCard({
                      id: c.id,
                      name: c.name,
                      handle: c.handle,
                      avatar: c.avatar,
                      role: c.role,
                      verifiedCreator: c.verified,
                      verifiedSeller: false,
                      followersCount: 25400,
                      followingCount: 310,
                      bio: c.bio,
                    })
                  }
                  className="p-4 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-red-500/40 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={c.avatar}
                      alt={c.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-white/10"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-white font-['Syne'] truncate">
                        {c.name}
                      </div>
                      <div className="text-xs text-neutral-400 font-mono">@{c.handle}</div>
                      <div className="text-[10px] text-red-400 mt-0.5">{c.category}</div>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-300 mt-2 line-clamp-2">{c.bio}</p>
                  <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                    <span className="font-bold text-white font-mono">{c.followers} Followers</span>
                    <span className="text-red-400 font-semibold flex items-center gap-1">
                      Identity Card <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 5. PLACES & MAPS ================= */}
        {activeTab === 'places' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-['Syne'] text-white">
              Official & Community Places
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {places.map((place) => (
                <div
                  key={place.id}
                  onClick={() => onSelectPlace(place)}
                  className="rounded-2xl overflow-hidden bg-neutral-900/70 border border-neutral-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
                >
                  <div className="h-40 relative">
                    <img
                      src={place.coverImage}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono font-bold text-emerald-300 border border-emerald-500/40">
                        {place.distanceKm} km away
                      </span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base text-white font-['Syne'] truncate">
                        {place.name}
                      </h4>
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{place.rating || 4.9}</span>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 line-clamp-1">
                      {place.formattedAddress}
                    </p>
                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-emerald-400 font-bold">
                      <span>Get Directions & View Flicks</span>
                      <Navigation className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 6. PRODUCTS ================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold font-['Syne'] text-white">
              Shoppable Store Merchandise (Escrow Protected)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p)}
                  className="rounded-2xl overflow-hidden bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-blue-500/50 cursor-pointer transition-all group"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-white font-bold">
                      ₹{p.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-2.5">
                    <div className="font-bold text-xs text-white truncate font-['Syne']">
                      {p.title}
                    </div>
                    <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                      {p.sellerName}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 7. BUSINESSES & DOCTORS ================= */}
        {activeTab === 'businesses' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-['Syne'] text-white">
                Verified Medical, Real Estate & Local Businesses
              </h3>
              <span className="text-xs text-neutral-400">Direct Appointments</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {discoveryBusinesses.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-sky-500/40 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.avatar}
                        alt={b.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                      />
                      <div>
                        <div className="font-bold text-sm text-white font-['Syne']">
                          {b.name}
                        </div>
                        <div className="text-xs text-neutral-400 font-mono">{b.handle}</div>
                        <span className="inline-block mt-0.5 text-[9px] font-mono px-2 py-0.2 rounded-full bg-sky-500/20 text-sky-300 font-bold">
                          {b.badge}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                      {b.distance}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-300 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/80 space-y-1">
                    <div>{b.specialty}</div>
                    <div className="text-neutral-400 text-[11px]">{b.location}</div>
                  </div>

                  <button
                    onClick={() => onOpenBooking(b.name, b.handle, b.sector)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98]"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Book Appointment / Site Visit</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 8. PROFESSIONALS ================= */}
        {activeTab === 'professionals' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-['Syne'] text-white">
                Independent Professionals & Skilled Creators
              </h3>
              <span className="text-xs text-neutral-400">Time & Expertise</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {discoveryProfessionals.map((pro) => (
                <div
                  key={pro.id}
                  className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 hover:border-indigo-500/40 transition-all space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={pro.avatar}
                      alt={pro.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                    />
                    <div>
                      <div className="font-bold text-sm text-white font-['Syne']">
                        {pro.name}
                      </div>
                      <div className="text-xs text-neutral-400 font-mono">{pro.handle}</div>
                      <span className="inline-block mt-0.5 text-[9px] font-mono px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
                        {pro.badge} • {pro.experience}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {pro.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-lg bg-neutral-800 text-[10px] text-neutral-300 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-mono font-bold text-sky-400">
                      Starting {pro.startingRate}
                    </span>
                    <button
                      onClick={() => onOpenBooking(pro.name, pro.handle, undefined, pro.specialization)}
                      className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow transition-all active:scale-95"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Hire / Request Quote</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
