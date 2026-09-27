import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Settings,
  Sparkles,
  Camera,
  Check,
  Users,
  User as UserIcon,
  ShoppingBag,
  Play,
  Film,
  MoreVertical,
  Heart,
  MapPin,
  Sliders,
  Edit3,
  X,
  Link2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  AlertCircle,
  ExternalLink,
  ShieldAlert,
  ShieldCheck,
  BadgeCheck,
  Award,
  Building2,
  Star,
  CheckCircle2,
  Layers,
  ListOrdered,
  Lock,
  Globe,
  Radio,
  Shield,
  UserCheck,
  UserPlus,
  MessageSquare,
  Share2,
  Grid,
  Calendar,
  Briefcase,
  Clock,
  Phone,
  Bookmark,
} from 'lucide-react';
import {
  User,
  Product,
  ShortVideo,
  LongVideo,
  SocialPlatformType,
  SocialLinkItem,
  Series,
  Moment,
  Frame,
} from '../../types';
import { MOCK_LONG_VIDEOS, MOCK_SHORTS, MOCK_SERIES, MOCK_PRODUCTS } from '../../data/mockData';
import { MOCK_MOMENTS, MOCK_FRAMES } from '../../data/mockMomentsAndFrames';
import { VerificationLevelsModal } from './VerificationLevelsModal';
import { MomentViewerModal } from './MomentViewerModal';
import { CreateMomentModal } from './CreateMomentModal';
import { FrameViewerModal } from './FrameViewerModal';
import { CreateFrameModal } from './CreateFrameModal';

export type FlynkAccountMode = 'personal' | 'creator' | 'business' | 'shop' | 'professional';
export type FlynkProfilePerspective = 'owner' | 'visitor';

interface UserProfileViewProps {
  user: User;
  isCurrentUser?: boolean;
  products?: Product[];
  shorts?: ShortVideo[];
  longVideos?: LongVideo[];
  series?: Series[];
  activeMoments?: Moment[];
  initialTab?: string;
  onBack?: () => void;
  onOpenStudio?: () => void;
  onOpenOrders?: () => void;
  onOpenStore?: () => void;
  onOpenAuth?: () => void;
  onOpenEarnings?: () => void;
  onUpdateUser?: (updated: User) => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onSelectShort?: (short: ShortVideo) => void;
  onSelectLongVideo?: (longVideo: LongVideo) => void;
  onStartChat?: (creator: User) => void;
  isModal?: boolean;
  onOpenBooking?: (targetName: string, targetHandle: string, sector?: any, spec?: any) => void;
  onOpenSingTogether?: () => void;
  onOpenRequestQuote?: (pro: any) => void;
}

interface PlatformConfig {
  type: SocialPlatformType;
  label: string;
  iconBg: string;
  iconGlyph: React.ReactNode;
  formatDisplay: (input: string) => string;
}

const PLATFORM_CONFIGS: Record<SocialPlatformType, PlatformConfig> = {
  instagram: {
    type: 'instagram',
    label: 'Instagram',
    iconBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600',
    iconGlyph: <span className="text-white text-[10px] font-bold">IG</span>,
    formatDisplay: (h) => (h.startsWith('@') ? h : `@${h}`),
  },
  youtube: {
    type: 'youtube',
    label: 'YouTube',
    iconBg: 'bg-red-600',
    iconGlyph: <Play className="w-3.5 h-3.5 fill-white text-white" />,
    formatDisplay: (h) => (h.startsWith('@') ? h : `@${h}`),
  },
  linkedin: {
    type: 'linkedin',
    label: 'LinkedIn',
    iconBg: 'bg-[#0a66c2]',
    iconGlyph: <span className="text-white text-[10px] font-bold">in</span>,
    formatDisplay: (h) => h.replace(/^@/, ''),
  },
  x: {
    type: 'x',
    label: 'X (Twitter)',
    iconBg: 'bg-black border border-white/20',
    iconGlyph: <span className="text-white text-[11px] font-mono">𝕏</span>,
    formatDisplay: (h) => (h.startsWith('@') ? h : `@${h}`),
  },
  tiktok: {
    type: 'tiktok',
    label: 'TikTok',
    iconBg: 'bg-black border border-white/10',
    iconGlyph: <span className="text-white text-[11px]">🎵</span>,
    formatDisplay: (h) => (h.startsWith('@') ? h : `@${h}`),
  },
  facebook: {
    type: 'facebook',
    label: 'Facebook',
    iconBg: 'bg-[#1877f2]',
    iconGlyph: <span className="text-white text-xs font-bold font-serif">f</span>,
    formatDisplay: (h) => (h.startsWith('@') ? h : `@${h}`),
  },
  portfolio: {
    type: 'portfolio',
    label: 'Portfolio / Website',
    iconBg: 'bg-[#1e0a2e] border border-blue-500/40',
    iconGlyph: <ExternalLink className="w-3.5 h-3.5 text-blue-300" />,
    formatDisplay: (u) => u.replace(/^https?:\/\//, '').replace(/\/$/, ''),
  },
};

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user,
  isCurrentUser = true,
  products = [],
  shorts = [],
  longVideos = [],
  series = [],
  activeMoments: activeMomentsProp,
  initialTab,
  onBack,
  onOpenStudio,
  onOpenStore,
  onUpdateUser,
  onSelectProduct,
  onAddToCart,
  onSelectShort,
  onSelectLongVideo,
  onStartChat,
  onOpenBooking,
  onOpenSingTogether,
  onOpenRequestQuote,
}) => {
  // ================= DYNAMIC FLYNK PROFILE SYSTEM STATES =================
  // Account Modes: Personal | Creator | Business | Shop | Professional
  const [accountMode, setAccountMode] = useState<FlynkAccountMode>(() => {
    if (user.role === 'business') return 'business';
    if (user.handle?.includes('vfx') || user.handle?.includes('tech')) return 'professional';
    return 'creator';
  });

  // Perspective: Owner View vs Visitor View
  const [viewPerspective, setViewPerspective] = useState<FlynkProfilePerspective>(
    isCurrentUser ? 'owner' : 'visitor'
  );

  // Privacy Toggle: Public vs Private Account
  const [isPrivateAccount, setIsPrivateAccount] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  // Dynamic Tabs (Defaults according to mode)
  const defaultTabForMode = (mode: FlynkAccountMode) => {
    switch (mode) {
      case 'personal':
        return 'flicks';
      case 'creator':
        return 'flicks';
      case 'shop':
        return 'shop';
      case 'business':
        return 'services';
      case 'professional':
        return 'portfolio';
      default:
        return 'flicks';
    }
  };

  const [activeTab, setActiveTab] = useState<string>(initialTab || defaultTabForMode(accountMode));
  const [bioExpanded, setBioExpanded] = useState(false);
  const [expandedSeriesId, setExpandedSeriesId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Moments and Frames State
  const [momentsList, setMomentsList] = useState<Moment[]>(MOCK_MOMENTS);
  const [framesList, setFramesList] = useState<Frame[]>(MOCK_FRAMES);

  // Modals
  const [isMomentViewerOpen, setIsMomentViewerOpen] = useState(false);
  const [momentViewerIndex, setMomentViewerIndex] = useState(0);
  const [isCreateMomentOpen, setIsCreateMomentOpen] = useState(false);

  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [isCreateFrameOpen, setIsCreateFrameOpen] = useState(false);

  const [showModeSwitcherModal, setShowModeSwitcherModal] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  // Toast feedback helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Switch tabs when account mode changes if current tab is not applicable
  useEffect(() => {
    setActiveTab(defaultTabForMode(accountMode));
  }, [accountMode]);

  // Dynamic Mode Persona Setup
  const currentProfileData = useMemo(() => {
    switch (accountMode) {
      case 'personal':
        return {
          displayName: 'Devin Subbu',
          handle: 'devinsubbu',
          category: 'Personal Lifestyle',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          avatarShape: 'circle' as const,
          avatarSize: 88,
          bio: 'Weekend hiker, specialty coffee explorer & amateur analogue photography enthusiast. Exploring heritage trails & monsoon soundscapes across Bengaluru and Hyderabad ☕️🌿',
          location: 'Hyderabad, Telangana',
          stats: [
            { label: 'Frames', value: framesList.filter((f) => f.authorRole === 'personal').length || 6 },
            { label: 'Followers', value: '842' },
            { label: 'Following', value: '318' },
          ],
          verifiedTitle: 'Identity Verified',
          badgeType: 'identity' as const,
        };
      case 'creator':
        return {
          displayName: user.name || 'Devin Subbu',
          handle: user.handle?.replace('@', '') || 'devin_creator',
          category: 'Travel & Film Creator',
          avatarUrl: user.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          avatarShape: 'circle' as const,
          avatarSize: 96,
          bio: user.bio || 'Visual director & digital craftsman. Exploring cinematic short trailers & high-end apparel at devin.studio',
          location: user.location || 'Bengaluru / Hyderabad',
          stats: [
            { label: 'Followers', value: '14.3K' },
            { label: 'Following', value: '318' },
            { label: 'Full Videos', value: longVideos.length || 6 },
          ],
          verifiedTitle: 'Creator Verified',
          badgeType: 'creator' as const,
        };
      case 'business':
        return {
          displayName: 'Pulse Health & Cardiology',
          handle: 'pulsehealth',
          category: 'Cardiology Clinic',
          avatarUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80',
          avatarShape: 'rounded_square' as const, // 88dp, corner radius 20-22dp
          avatarSize: 88,
          bio: 'NABH accredited advanced cardiology & preventive diagnostics. Same-day 3T digital cardiac scans, verified clinical audit & specialist consultations.',
          location: 'Road No. 2, Banjara Hills, Hyderabad',
          publicHours: 'Open Now · Closes 8:00 PM',
          stats: [
            { label: 'Followers', value: '54.2K' },
            { label: 'Reviews', value: '1,280' },
            { label: 'Trust Metric', value: '99.4%' },
          ],
          verifiedTitle: 'Business Verified',
          badgeType: 'business' as const,
        };
      case 'shop':
        return {
          displayName: 'Aria Vance Couture',
          handle: 'aria_vance',
          category: "Women's Fashion & Bespoke Streetwear",
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
          avatarShape: 'rounded_square' as const, // 88dp, corner radius 20dp
          avatarSize: 88,
          bio: 'Minimalist street aesthetic & bespoke tailored silhouettes. Ethically handspun 100-count organic cotton with waterproof ripstop filaments. Handcrafted in Mumbai.',
          location: 'Kala Ghoda, Mumbai, MH',
          publicHours: 'Atelier Open · 11 AM - 8 PM',
          stats: [
            { label: 'Followers', value: '184K' },
            { label: 'Products', value: products.length || 42 },
            { label: 'Rating', value: '4.9 ★' },
          ],
          verifiedTitle: 'Seller Verified',
          badgeType: 'seller' as const,
        };
      case 'professional':
        return {
          displayName: 'Nikhil Sen',
          handle: 'nikhil_cinema',
          category: 'Video Editor & Colorist',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          avatarShape: 'circle' as const,
          avatarSize: 92,
          bio: 'DaVinci Resolve certified master colorist & high-altitude FPV operator. 12+ feature documentaries, Netflix ACES tone curve mastery & commercial grade delivery.',
          location: 'Bengaluru / New Delhi',
          stats: [
            { label: 'Followers', value: '320K' },
            { label: 'Works', value: '38' },
            { label: 'Rating', value: '4.9 ★ (142)' },
          ],
          verifiedTitle: 'Credential Verified',
          badgeType: 'credential' as const,
        };
    }
  }, [accountMode, user, products.length, longVideos.length, framesList]);

  // Filter Active Moments for the current profile across all category types
  const userMoments = useMemo(() => {
    // If activeMoments prop is provided, use it directly (filtering out any expired moments)
    if (activeMomentsProp !== undefined) {
      return activeMomentsProp.filter((m) => {
        if (m.expiresAt && m.expiresAt.toLowerCase().includes('expired')) {
          return false;
        }
        return true;
      });
    }

    return momentsList.filter((m) => {
      const matchesProfile =
        m.authorHandle === currentProfileData.handle ||
        m.accountMode === accountMode ||
        (user && (m.userId === user.id || m.authorHandle === user.handle?.replace('@', ''))) ||
        (accountMode === 'personal' && (m.authorHandle === 'devinsubbu' || m.accountMode === 'personal')) ||
        (accountMode === 'creator' && (m.authorHandle === 'devin_creator' || m.accountMode === 'creator')) ||
        (accountMode === 'business' && (m.authorHandle === 'pulsehealth' || m.accountMode === 'business')) ||
        (accountMode === 'shop' && (m.authorHandle === 'aria_vance' || m.accountMode === 'shop')) ||
        (accountMode === 'professional' && (m.authorHandle === 'nikhil_cinema' || m.accountMode === 'professional'));

      if (!matchesProfile) return false;

      // Filter out any explicitly expired moments (Moments are temporary 24h)
      if (m.expiresAt && m.expiresAt.toLowerCase().includes('expired')) {
        return false;
      }
      return true;
    });
  }, [activeMomentsProp, momentsList, currentProfileData.handle, accountMode, user]);

  // Check if current user has active 'Moments'
  const hasActiveMoments = userMoments.length > 0;

  // Check if all active moments have already been viewed
  const allMomentsViewed = hasActiveMoments && userMoments.every((m) => m.isViewed);

  // Check if any active moments are unseen (unviewed)
  const hasUnseenMoments = hasActiveMoments && !allMomentsViewed;

  // Filter Frames for the current profile
  const userFrames = useMemo(() => {
    const list = framesList.filter(
      (f) =>
        f.authorHandle === currentProfileData.handle ||
        f.authorRole === accountMode ||
        (accountMode === 'personal' && f.authorHandle === 'devinsubbu') ||
        (accountMode === 'creator' && f.authorHandle === 'devin_creator')
    );
    return list.length > 0 ? list : framesList.slice(0, 6);
  }, [framesList, currentProfileData.handle, accountMode]);

  // Series catalog for current creator
  const effectiveSeries = useMemo(() => {
    return series && series.length > 0 ? series : MOCK_SERIES;
  }, [series]);

  const creatorSeries = useMemo(() => {
    const list = effectiveSeries.filter(
      (s) =>
        s.creatorId === user.id ||
        s.creatorId === user.handle?.replace('@', '') ||
        (user.handle?.includes('devin') && (s.creatorId === 'usr_me' || s.creatorId === 'devin_creator')) ||
        (user.handle?.includes('nikhil') && s.creatorId === 'usr_nikhil') ||
        (user.handle?.includes('aria') && s.creatorId === 'usr_aria')
    );
    return list.length > 0 ? list : effectiveSeries;
  }, [effectiveSeries, user]);

  const resolveSeriesItem = (id: string) => {
    const lv = (longVideos.length ? longVideos : MOCK_LONG_VIDEOS).find((v) => v.id === id);
    if (lv) {
      return {
        id: lv.id,
        title: lv.title,
        type: 'long' as const,
        typeLabel: 'Full Video (▭)',
        duration: lv.durationFormatted,
        thumbnailUrl: lv.thumbnailUrl,
        video: lv,
      };
    }
    const sh = (shorts.length ? shorts : MOCK_SHORTS).find((s) => s.id === id);
    if (sh) {
      return {
        id: sh.id,
        title: sh.title,
        type: 'short' as const,
        typeLabel: 'Flick (▯)',
        duration: '0:30',
        thumbnailUrl: sh.thumbnailUrl,
        short: sh,
      };
    }
    return {
      id,
      title: 'Linked Video Item',
      type: 'long' as const,
      typeLabel: 'Video',
      duration: '',
      thumbnailUrl: '',
    };
  };

  const getSeriesThumbnail = (s: Series): string => {
    if (s.contentItems && s.contentItems.length > 0) {
      for (const itemId of s.contentItems) {
        const item = resolveSeriesItem(itemId);
        if (item && item.thumbnailUrl) {
          return item.thumbnailUrl;
        }
      }
    }
    return s.coverImage || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80';
  };

  // Mock Services for Business
  const businessServices = [
    {
      id: 'svc_cardio_eval',
      title: 'Comprehensive Cardiovascular Health Screen',
      duration: '45 mins',
      fee: '₹2,499',
      description: 'Resting 12-lead ECG, 2D echocardiography, lipid profile & specialist doctor review.',
      badge: 'Most Popular',
    },
    {
      id: 'svc_cardiac_mri',
      title: '3T Digital Cardiac MRI with Perfusion',
      duration: '60 mins',
      fee: '₹8,500',
      description: 'Zero radiation high-contrast myocardial viability & arterial mapping.',
      badge: 'Advanced Imaging',
    },
    {
      id: 'svc_tele_consult',
      title: 'Senior Specialist Video Consultation',
      duration: '25 mins',
      fee: '₹1,200',
      description: 'Private 1-on-1 digital review of test reports, prescriptions & lifestyle plan.',
      badge: 'Instant Slot',
    },
  ];

  // Mock Portfolio for Professional
  const professionalWorks = [
    {
      id: 'work_1',
      title: 'Zanskar: The Ice That Speaks',
      category: 'Documentary Feature Film',
      year: '2026',
      cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      tools: ['RED 8K', 'ACEScc', 'DaVinci Resolve Studio'],
      award: 'Best Cinematography Award',
    },
    {
      id: 'work_2',
      title: 'Matrix Runway Paris 2026',
      category: 'Commercial Lookbook & Color Grade',
      year: '2026',
      cover: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      tools: ['ARRI Alexa Mini LF', 'Film Emulation 2383'],
      award: 'Vogue Selection',
    },
    {
      id: 'work_3',
      title: 'Direct Sunlight Monitor Stress Test',
      category: 'Creator Tech Deep-Dive',
      year: '2025',
      cover: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      tools: ['SDI Spectroradiometer', 'Wireless 6GHz'],
      award: '142K Views',
    },
  ];

  // Verified Reviews
  const verifiedReviews = [
    {
      id: 'rev_1',
      author: 'Rohit Verma',
      rating: 5,
      date: '2 days ago',
      comment: 'Prompt delivery of the Matrix Trench. Escrow was released instantly upon unboxing verification.',
      verifiedType: 'Verified Purchase',
    },
    {
      id: 'rev_2',
      author: 'Dr. Anita Desai',
      rating: 5,
      date: '1 week ago',
      comment: 'Exceptional diagnostic care at the clinic. Scans were delivered directly to the FLYNK portal in 2 hours.',
      verifiedType: 'Verified Appointment',
    },
    {
      id: 'rev_3',
      author: 'Vikram Mehta (Producer)',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Nikhil delivered flawless cinema LUTs with 48h turnaround. Seamless communication on FLYNK.',
      verifiedType: 'Verified Project',
    },
  ];

  return (
    <div className="w-full h-full bg-[#101217] text-[#F7F8FA] flex flex-col overflow-y-auto select-none font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
          <div className="px-4 py-2 rounded-2xl bg-[#181B22]/95 border border-[#326BFF]/40 text-[#F7F8FA] text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in slide-in-from-top-2">
            <Sparkles className="w-4 h-4 text-[#326BFF]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ================= 1. FLYNK PROFILE SPECIFICATION DEMO & TEST DOCK ================= */}
      <div className="sticky top-0 z-40 bg-[#181B22]/95 backdrop-blur-md border-b border-[#292E38] px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-[10px] text-[#A7ADB8] font-mono mr-1 hidden sm:inline">Mode:</span>
          {(['personal', 'creator', 'business', 'shop', 'professional'] as FlynkAccountMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setAccountMode(m);
                showToast(`Switched profile to: ${m.toUpperCase()}`);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                accountMode === m
                  ? 'bg-[#326BFF] text-white shadow-[0_0_12px_rgba(50,107,255,0.4)]'
                  : 'bg-[#101217] text-[#A7ADB8] hover:text-white border border-[#292E38]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Perspective, Ring State and Privacy Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Moments Ring State Indicator / Toggle */}
          <button
            type="button"
            onClick={() => {
              if (hasUnseenMoments) {
                // Mark all moments as viewed
                setMomentsList((prev) =>
                  prev.map((m) =>
                    userMoments.some((um) => um.id === m.id) ? { ...m, isViewed: true } : m
                  )
                );
                showToast(`Moments viewed: Muted Grey (#555B65) Ring active`);
              } else if (allMomentsViewed) {
                // Reset moments to unviewed
                setMomentsList((prev) =>
                  prev.map((m) =>
                    userMoments.some((um) => um.id === m.id) ? { ...m, isViewed: false } : m
                  )
                );
                showToast(`Moments unviewed: Branded Blue-Violet-Red Gradient Ring (3dp) active`);
              } else {
                setIsCreateMomentOpen(true);
              }
            }}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              hasActiveMoments
                ? hasUnseenMoments
                  ? 'bg-gradient-to-r from-[#326BFF]/25 via-[#8B5CF6]/20 to-[#FF3D52]/25 border border-[#326BFF]/50 text-white shadow-sm'
                  : 'bg-[#555B65]/30 border border-[#555B65] text-[#A7ADB8]'
                : 'bg-[#101217] border border-[#292E38] text-[#707681]'
            }`}
            title="Click to toggle Moment ring state between Unseen (Gradient Ring) and Viewed (#555B65 Grey Ring)"
          >
            <Sparkles className="w-3 h-3 text-[#326BFF]" />
            <span>
              {hasActiveMoments
                ? hasUnseenMoments
                  ? 'Ring: Active Gradient'
                  : 'Ring: Viewed (#555B65)'
                : 'Ring: None'}
            </span>
          </button>

          {/* Owner vs Visitor Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = viewPerspective === 'owner' ? 'visitor' : 'owner';
              setViewPerspective(next);
              showToast(`View perspective: ${next === 'owner' ? 'Owner (Self)' : 'Visitor (Public)'}`);
            }}
            className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              viewPerspective === 'owner'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>{viewPerspective === 'owner' ? 'Owner' : 'Visitor'}</span>
          </button>

          {/* Privacy Toggle (Public vs Private) */}
          <button
            type="button"
            onClick={() => {
              setIsPrivateAccount(!isPrivateAccount);
              showToast(!isPrivateAccount ? 'Account set to PRIVATE' : 'Account set to PUBLIC');
            }}
            className={`p-1 rounded-lg border text-xs cursor-pointer ${
              isPrivateAccount
                ? 'bg-[#FF3D52]/20 border-[#FF3D52]/40 text-[#FF3D52]'
                : 'bg-[#101217] border-[#292E38] text-[#A7ADB8]'
            }`}
            title={isPrivateAccount ? 'Private Account Active' : 'Public Account'}
          >
            {isPrivateAccount ? <Lock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Profile Frame (Reference 390x844 responsive) */}
      <div className="w-full max-w-[440px] sm:max-w-lg md:max-w-xl mx-auto flex flex-col min-h-screen relative pb-16 px-4">
        {/* ================= 2. PROFILE TOP BAR (56dp Height) ================= */}
        <div className="h-14 flex items-center justify-between z-30 pt-1">
          {/* Left: Username with chevron for Mode Switcher */}
          <div className="flex items-center gap-2">
            {viewPerspective === 'visitor' && onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-10 h-10 -ml-2 rounded-full hover:bg-[#181B22] text-[#F7F8FA] flex items-center justify-center cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowModeSwitcherModal(true)}
              className="flex items-center gap-1.5 text-left group cursor-pointer"
            >
              <span className="text-[17px] sm:text-[18px] font-bold text-[#F7F8FA] font-['Syne'] tracking-tight group-hover:text-[#326BFF] transition-colors">
                @{currentProfileData.handle}
              </span>
              <ChevronDown className="w-4 h-4 text-[#A7ADB8] group-hover:text-white transition-transform" />
            </button>
          </div>

          {/* Right Actions: Owner (Share + Settings) vs Visitor (Share + More) */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => showToast('Profile link copied to clipboard')}
              className="w-10 h-10 rounded-full hover:bg-[#181B22] text-[#F7F8FA] flex items-center justify-center cursor-pointer transition-colors"
              title="Share Profile"
            >
              <Share2 className="w-5 h-5" />
            </button>

            {viewPerspective === 'owner' ? (
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="w-10 h-10 rounded-full hover:bg-[#181B22] text-[#F7F8FA] flex items-center justify-center cursor-pointer transition-colors"
                title="Profile Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => showToast('Visitor options: Block, Report, Mute')}
                className="w-10 h-10 rounded-full hover:bg-[#181B22] text-[#F7F8FA] flex items-center justify-center cursor-pointer transition-colors"
                title="More Actions"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* ================= 3. IDENTITY HEADER + STATS ================= */}
        <div className="pt-2 flex items-center justify-between gap-4">
          {/* Avatar with Dynamic Shape and Signature FLYNK Moment Ring */}
          <div className="relative shrink-0">
            <div
              onClick={() => {
                if (hasActiveMoments) {
                  setMomentViewerIndex(0);
                  setIsMomentViewerOpen(true);
                } else if (viewPerspective === 'owner') {
                  setIsCreateMomentOpen(true);
                }
              }}
              className={`relative cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 ${
                /* Moment Ring: 3dp thickness. Branded Blue-Violet-Red gradient when active unseen; #555B65 muted grey when viewed; no ring when no active moments */
                hasActiveMoments
                  ? allMomentsViewed
                    ? 'p-[3px] bg-[#555B65]'
                    : 'p-[3px] bg-gradient-to-tr from-[#326BFF] via-[#8B5CF6] to-[#FF3D52] shadow-[0_0_18px_rgba(50,107,255,0.35)]'
                  : 'p-0 bg-transparent'
              } ${
                currentProfileData.avatarShape === 'rounded_square'
                  ? accountMode === 'business'
                    ? 'rounded-[22px]'
                    : 'rounded-[20px]'
                  : 'rounded-full'
              }`}
              style={{
                width: hasActiveMoments ? currentProfileData.avatarSize + 6 : currentProfileData.avatarSize,
                height: hasActiveMoments ? currentProfileData.avatarSize + 6 : currentProfileData.avatarSize,
              }}
            >
              <div
                className={`w-full h-full ${
                  hasActiveMoments ? 'p-[2px] bg-[#101217]' : ''
                } ${
                  currentProfileData.avatarShape === 'rounded_square'
                    ? accountMode === 'business'
                      ? 'rounded-[19px]'
                      : 'rounded-[17px]'
                    : 'rounded-full'
                }`}
              >
                <img
                  src={currentProfileData.avatarUrl}
                  alt={currentProfileData.displayName}
                  className={`w-full h-full object-cover ${
                    currentProfileData.avatarShape === 'rounded_square'
                      ? accountMode === 'business'
                        ? 'rounded-[17px]'
                        : 'rounded-[15px]'
                      : 'rounded-full'
                  }`}
                />
              </div>
            </div>

            {/* Owner Add Moment (+) Badge (26dp circle, Blue fill) */}
            {viewPerspective === 'owner' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCreateMomentOpen(true);
                }}
                className="absolute bottom-0 right-0 w-[26px] h-[26px] rounded-full bg-[#326BFF] hover:bg-[#467BFF] text-white flex items-center justify-center border-2 border-[#101217] shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-90"
                title="Add Moment (24h)"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            )}
          </div>

          {/* Three Distributed Stat Columns */}
          <div className="flex-1 grid grid-cols-3 gap-1 text-center py-2">
            {currentProfileData.stats.map((s, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-base sm:text-lg font-bold text-[#F7F8FA] font-mono leading-tight">
                  {s.value}
                </span>
                <span className="text-[12px] text-[#A7ADB8] mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 4. DISPLAY NAME, CATEGORY & VERIFICATION ================= */}
        <div className="pt-3 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[17px] sm:text-[18px] font-bold text-[#F7F8FA] font-['Syne'] tracking-tight">
              {currentProfileData.displayName}
            </h1>

            {/* Verification Badge */}
            <button
              type="button"
              onClick={() => setIsVerificationModalOpen(true)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#326BFF]/15 border border-[#326BFF]/30 text-[#326BFF] text-[11px] font-bold cursor-pointer hover:bg-[#326BFF]/25 transition-colors"
              title="Verified by FLYNK - Tap to view credentials audit"
            >
              <BadgeCheck className="w-3.5 h-3.5 fill-[#326BFF] text-[#101217]" />
              <span>{currentProfileData.verifiedTitle}</span>
            </button>
          </div>

          {/* Category Label */}
          <div className="text-[13px] sm:text-[14px] text-[#A7ADB8] font-medium flex items-center gap-1.5">
            {accountMode === 'creator' && <Film className="w-3.5 h-3.5 text-[#326BFF]" />}
            {accountMode === 'business' && <Building2 className="w-3.5 h-3.5 text-[#326BFF]" />}
            {accountMode === 'shop' && <ShoppingBag className="w-3.5 h-3.5 text-[#326BFF]" />}
            {accountMode === 'professional' && <Briefcase className="w-3.5 h-3.5 text-[#326BFF]" />}
            <span>{currentProfileData.category}</span>
          </div>
        </div>

        {/* ================= 5. BIO & DESCRIPTION (Collapsible after 3 lines) ================= */}
        <div className="pt-2 text-[14px] text-[#F7F8FA] leading-[20px] space-y-1">
          <p className={bioExpanded ? '' : 'line-clamp-3'}>
            {currentProfileData.bio}
          </p>
          {currentProfileData.bio.length > 120 && (
            <button
              type="button"
              onClick={() => setBioExpanded(!bioExpanded)}
              className="text-xs font-bold text-[#A7ADB8] hover:text-white transition-colors"
            >
              {bioExpanded ? 'less' : 'more'}
            </button>
          )}

          {/* Business / Shop Public Hours */}
          {currentProfileData.publicHours && (
            <div className="flex items-center gap-1.5 text-xs text-[#22C55E] font-medium pt-0.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentProfileData.publicHours}</span>
            </div>
          )}

          {/* Location & Verified Address */}
          <div className="flex items-center gap-1.5 text-xs text-[#A7ADB8] pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-[#326BFF] shrink-0" />
            <span className="truncate">{currentProfileData.location}</span>
          </div>

          {/* External Links */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <a
              href="https://devin.studio"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#326BFF] hover:underline"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>devin.studio</span>
            </a>
            <span className="text-[11px] text-[#707681]">•</span>
            <span className="text-xs text-[#A7ADB8]">
              {accountMode === 'business' ? 'Consultations available' : 'Inquiries via FLYNK DM'}
            </span>
          </div>
        </div>

        {/* ================= 6. PRIMARY CTA AREA (Dynamic by Mode) ================= */}
        <div className="pt-3">
          {viewPerspective === 'owner' ? (
            /* Owner Actions: Edit Profile (Primary) + Share Profile (Secondary) */
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsEditProfileModalOpen(true)}
                className="h-11 rounded-xl bg-[#181B22] hover:bg-[#20242E] border border-[#292E38] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
              >
                <Edit3 className="w-4 h-4 text-[#A7ADB8]" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={() => showToast('Share profile sheet opened')}
                className="h-11 rounded-xl bg-[#181B22] hover:bg-[#20242E] border border-[#292E38] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
              >
                <Share2 className="w-4 h-4 text-[#A7ADB8]" />
                <span>Share Profile</span>
              </button>
            </div>
          ) : (
            /* Visitor Actions (Tailored by Account Mode) */
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {/* Mode-Specific Primary CTA */}
                {accountMode === 'shop' ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('shop')}
                    className="flex-1 h-11 rounded-xl bg-[#326BFF] hover:bg-[#467BFF] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(50,107,255,0.4)] transition-all active:scale-98 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shop Now</span>
                  </button>
                ) : accountMode === 'business' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenBooking) {
                        onOpenBooking(currentProfileData.displayName, `@${currentProfileData.handle}`, 'doctor_clinic');
                      } else {
                        showToast(`Booking appointment with ${currentProfileData.displayName}`);
                      }
                    }}
                    className="flex-1 h-11 rounded-xl bg-[#326BFF] hover:bg-[#467BFF] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(50,107,255,0.4)] transition-all active:scale-98 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>
                ) : accountMode === 'professional' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenRequestQuote) {
                        onOpenRequestQuote({
                          name: currentProfileData.displayName,
                          handle: `@${currentProfileData.handle}`,
                        });
                      } else {
                        showToast(`Requesting quote from ${currentProfileData.displayName}`);
                      }
                    }}
                    className="flex-1 h-11 rounded-xl bg-[#326BFF] hover:bg-[#467BFF] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(50,107,255,0.4)] transition-all active:scale-98 cursor-pointer"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Hire Me / Request Quote</span>
                  </button>
                ) : (
                  /* Personal & Creator: Primary Follow CTA */
                  <button
                    type="button"
                    onClick={() => {
                      setIsFollowing(!isFollowing);
                      showToast(!isFollowing ? 'Following account' : 'Unfollowed');
                    }}
                    className={`flex-1 h-11 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-98 cursor-pointer ${
                      isFollowing
                        ? 'bg-[#181B22] border border-[#292E38] text-white hover:bg-[#20242E]'
                        : 'bg-[#326BFF] hover:bg-[#467BFF] text-white shadow-[0_0_20px_rgba(50,107,255,0.4)]'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4 text-[#22C55E]" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}

                {/* Secondary: Message */}
                <button
                  type="button"
                  onClick={() => {
                    if (onStartChat) onStartChat(user);
                    else showToast(`Opening direct conversation with ${currentProfileData.displayName}`);
                  }}
                  className="px-4 h-11 rounded-xl bg-[#181B22] hover:bg-[#20242E] border border-[#292E38] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-[#A7ADB8]" />
                  <span>Message</span>
                </button>

                {/* Optional Tertiary */}
                {accountMode === 'creator' && onOpenSingTogether && (
                  <button
                    type="button"
                    onClick={onOpenSingTogether}
                    className="px-3 h-11 rounded-xl bg-[#181B22] hover:bg-[#20242E] border border-[#292E38] text-white text-xs font-semibold flex items-center justify-center"
                    title="Sing Together"
                  >
                    🎵
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================= 7. MOMENTS ROW (Temporary 24h Updates) ================= */}
        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#A7ADB8]">
            <span className="font-['Syne'] uppercase tracking-wider text-[11px]">
              Moments · 24h
            </span>
            <span className="text-[10px] text-[#707681] font-mono">
              Temporary Everyday Updates
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {/* Item 1: Your Moment (Own Avatar with Blue + Badge) */}
            <div
              className="flex flex-col items-center gap-1 shrink-0 w-[74px] cursor-pointer group"
              onClick={() => {
                if (userMoments.length > 0) {
                  setMomentViewerIndex(0);
                  setIsMomentViewerOpen(true);
                } else {
                  setIsCreateMomentOpen(true);
                }
              }}
            >
              <div className="relative w-16 h-16 rounded-full p-[2.5px] border border-dashed border-[#326BFF]/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                <img
                  src={currentProfileData.avatarUrl}
                  alt="Your Moment"
                  className="w-full h-full rounded-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCreateMomentOpen(true);
                  }}
                  className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#326BFF] text-white flex items-center justify-center border border-[#101217] shadow-sm"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                </button>
              </div>
              <span className="text-[11px] text-[#A7ADB8] group-hover:text-white truncate max-w-[72px]">
                Your Moment
              </span>
            </div>

            {/* Other Active Moments in Current Sequence */}
            {userMoments.map((m, idx) => (
              <div
                key={m.id}
                onClick={() => {
                  setMomentViewerIndex(idx);
                  setIsMomentViewerOpen(true);
                }}
                className="flex flex-col items-center gap-1 shrink-0 w-[74px] cursor-pointer group"
              >
                <div
                  className={`w-16 h-16 rounded-full p-[2.5px] flex items-center justify-center group-hover:scale-105 transition-transform ${
                    !m.isViewed
                      ? 'bg-gradient-to-tr from-[#326BFF] via-[#8B5CF6] to-[#FF3D52] shadow-[0_0_12px_rgba(50,107,255,0.3)]'
                      : 'bg-[#555B65]'
                  }`}
                >
                  <img
                    src={m.mediaUrl || m.authorAvatar}
                    alt=""
                    className="w-full h-full rounded-full object-cover border-2 border-[#101217]"
                  />
                </div>
                <span className="text-[11px] text-[#F7F8FA] group-hover:text-[#326BFF] truncate max-w-[72px] text-center">
                  {m.textContent ? m.textContent.slice(0, 10) + '...' : m.categoryLabel || 'Update'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= 8. PRIVATE ACCOUNT VISITOR LOCK SCREEN ================= */}
        {isPrivateAccount && viewPerspective === 'visitor' && !isFollowing ? (
          <div className="mt-6 p-8 rounded-3xl bg-[#181B22] border border-[#292E38] text-center space-y-3 animate-in fade-in">
            <div className="w-12 h-12 rounded-2xl bg-[#FF3D52]/15 text-[#FF3D52] border border-[#FF3D52]/30 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-['Syne']">
                This Account is Private
              </h4>
              <p className="text-xs text-[#A7ADB8] max-w-xs mx-auto mt-1">
                Follow this account to see their Moments, Frames, Flicks and Full Videos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsFollowing(true);
                showToast('Follow request sent / Approved');
              }}
              className="px-5 py-2 rounded-xl bg-[#326BFF] hover:bg-[#467BFF] text-white text-xs font-bold shadow-md cursor-pointer"
            >
              Follow to Unlock
            </button>
          </div>
        ) : (
          /* ================= 9. DYNAMIC CONTENT TABS & MEDIA GRIDS ================= */
          <div className="pt-5 space-y-4">
            {/* Dynamic Tabs Navigation Bar */}
            <div className="flex items-center gap-1.5 border-b border-[#292E38] pb-2 overflow-x-auto no-scrollbar">
              {/* Tab 1: Flicks (Shorts) */}
              <button
                type="button"
                onClick={() => setActiveTab('flicks')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  activeTab === 'flicks'
                    ? 'bg-[#326BFF]/20 text-[#326BFF] border border-[#326BFF]/40 shadow-sm'
                    : 'text-[#A7ADB8] hover:text-white'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Flicks</span>
              </button>

              {/* Tab 2: Frames (Permanent Visual Posts) */}
              <button
                type="button"
                onClick={() => setActiveTab('frames')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                  activeTab === 'frames'
                    ? 'bg-[#326BFF]/20 text-[#326BFF] border border-[#326BFF]/40 shadow-sm'
                    : 'text-[#A7ADB8] hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Frames</span>
                <span className="text-[10px] text-[#A7ADB8] font-normal hidden sm:inline">(Posts)</span>
              </button>

              {/* Tab 3: Full Videos (Long Form) */}
              {(accountMode === 'creator' || accountMode === 'personal' || accountMode === 'professional') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('full')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'full'
                      ? 'bg-[#326BFF]/20 text-[#326BFF] border border-[#326BFF]/40 shadow-sm'
                      : 'text-[#A7ADB8] hover:text-white'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Full Videos</span>
                </button>
              )}

              {/* Tab 4: Series */}
              {accountMode === 'creator' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('series')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'series'
                      ? 'bg-[#326BFF]/20 text-[#326BFF] border border-[#326BFF]/40 shadow-sm'
                      : 'text-[#A7ADB8] hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Series</span>
                  {creatorSeries.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-[#326BFF]/20 text-[#326BFF] text-[9px] font-mono font-bold">
                      {creatorSeries.length}
                    </span>
                  )}
                </button>
              )}

              {/* Tab 5: Shop (Commerce) */}
              {(accountMode === 'shop' || accountMode === 'creator') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('shop')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'shop'
                      ? 'bg-[#326BFF]/20 text-[#326BFF] border border-[#326BFF]/40 shadow-sm'
                      : 'text-[#A7ADB8] hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Shop</span>
                </button>
              )}

              {/* Tab 6: Services (Business) */}
              {accountMode === 'business' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('services')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'services'
                      ? 'bg-[#326BFF]/20 text-[#326BFF] border border-[#326BFF]/40 shadow-sm'
                      : 'text-[#A7ADB8] hover:text-white'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Services</span>
                </button>
              )}

              {/* Tab 7: Portfolio (Professional) */}
              {accountMode === 'professional' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('portfolio')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'portfolio'
                      ? 'bg-[#326BFF]/20 text-[#326BFF] border border-[#326BFF]/40 shadow-sm'
                      : 'text-[#A7ADB8] hover:text-white'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Portfolio</span>
                </button>
              )}

              {/* Tab 8: Reviews */}
              {(accountMode === 'business' || accountMode === 'shop' || accountMode === 'professional') && (
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    activeTab === 'reviews'
                      ? 'bg-[#326BFF]/20 text-[#326BFF] border border-[#326BFF]/40 shadow-sm'
                      : 'text-[#A7ADB8] hover:text-white'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-[#22C55E] text-[#22C55E]" />
                  <span>Reviews</span>
                </button>
              )}
            </div>

            {/* TAB CONTENT: FRAMES (3-Column Square Grid) */}
            {activeTab === 'frames' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-[#A7ADB8] font-mono">
                    Permanent Frames ({userFrames.length})
                  </div>
                  {viewPerspective === 'owner' && (
                    <button
                      type="button"
                      onClick={() => setIsCreateFrameOpen(true)}
                      className="px-3 py-1 rounded-xl bg-[#326BFF]/20 hover:bg-[#326BFF]/30 border border-[#326BFF]/40 text-[#326BFF] text-xs font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Create Frame</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                  {userFrames.map((fr) => (
                    <div
                      key={fr.id}
                      onClick={() => setSelectedFrame(fr)}
                      className="relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-[#292E38] hover:border-[#326BFF] cursor-pointer group transition-all"
                    >
                      <img
                        src={fr.images[0]}
                        alt={fr.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Carousel Indicator Icon if multiple images */}
                      {fr.images.length > 1 && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-black/75 backdrop-blur-sm text-white flex items-center justify-center">
                          <Layers className="w-3 h-3" />
                        </div>
                      )}
                      {/* Likes count on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 text-white font-mono text-xs font-bold transition-opacity">
                        <Heart className="w-4 h-4 fill-white" />
                        <span>{fr.likesCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: FLICKS (9:16 Vertical Video Grid) */}
            {activeTab === 'flicks' && (
              <div className="space-y-3">
                <div className="text-xs text-[#A7ADB8] font-mono">
                  Short-form Flicks ({shorts.length || MOCK_SHORTS.length})
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(shorts.length ? shorts : MOCK_SHORTS).map((s) => (
                    <div
                      key={s.id}
                      onClick={() => onSelectShort?.(s)}
                      className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-[#292E38] hover:border-[#FF3D52] shadow-md cursor-pointer group transition-all"
                    >
                      <img
                        src={s.thumbnailUrl}
                        alt={s.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-[10px] font-mono font-bold">
                        <Play className="w-3 h-3 fill-white" />
                        <span>{s.likesCount || '12K'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: FULL VIDEOS (16:9 Cinema Widescreen) */}
            {activeTab === 'full' && (
              <div className="space-y-3">
                <div className="text-xs text-[#A7ADB8] font-mono">
                  Full Cinema Videos (Flick → Watch Full)
                </div>
                <div className="space-y-3">
                  {(longVideos.length ? longVideos : MOCK_LONG_VIDEOS).map((video) => (
                    <div
                      key={video.id}
                      onClick={() => onSelectLongVideo?.(video)}
                      className="p-3 rounded-2xl bg-[#181B22] border border-[#292E38] hover:border-[#326BFF]/40 shadow-lg cursor-pointer transition-all space-y-2 group"
                    >
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 font-mono text-[10px] font-bold text-white">
                          {video.durationFormatted}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-11 h-11 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-4 h-4 fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs sm:text-sm text-white font-['Syne'] truncate">
                          {video.title}
                        </h4>
                        <span className="text-[10px] text-[#A7ADB8] font-mono shrink-0 ml-2">
                          {video.viewsCount?.toLocaleString()} views
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: SERIES (Horizontal Card Layout) */}
            {activeTab === 'series' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#A7ADB8] font-mono">
                  <span>Curated Series ({creatorSeries.length})</span>
                  {viewPerspective === 'owner' && onOpenStudio && (
                    <button
                      type="button"
                      onClick={onOpenStudio}
                      className="text-[#326BFF] hover:underline"
                    >
                      + Studio
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {creatorSeries.map((s) => {
                    const isExpanded = expandedSeriesId === s.id;
                    const seriesThumbnail = getSeriesThumbnail(s);
                    const itemCount = s.contentItems ? s.contentItems.length : 0;

                    return (
                      <div
                        key={s.id}
                        className="rounded-2xl bg-[#181B22] border border-[#292E38] hover:border-[#326BFF]/40 shadow-xl overflow-hidden transition-all group"
                      >
                        <div
                          onClick={() => setExpandedSeriesId(isExpanded ? null : s.id)}
                          className="p-3 sm:p-4 flex flex-row items-center gap-3 sm:gap-4 cursor-pointer"
                        >
                          <div className="relative w-28 h-18 sm:w-36 sm:h-24 rounded-xl overflow-hidden bg-neutral-900 border border-white/10 shrink-0 shadow-md">
                            <img
                              src={seriesThumbnail}
                              alt={s.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/85 text-[10px] font-mono font-bold text-[#326BFF]">
                              {itemCount} items
                            </div>
                          </div>

                          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 space-y-1">
                            <span className="px-2 py-0.5 rounded-full bg-[#326BFF]/15 text-[#326BFF] text-[9px] font-mono font-bold w-fit">
                              {itemCount} items · {s.category || 'Series'}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-white font-['Syne'] truncate">
                              {s.title}
                            </h4>
                            <p className="text-[11px] text-[#A7ADB8] line-clamp-1">
                              {s.description}
                            </p>
                          </div>
                        </div>

                        {/* Expandable Episode List */}
                        {isExpanded && (
                          <div className="p-3 border-t border-[#292E38] bg-[#101217] space-y-1.5 text-xs">
                            {s.contentItems.map((cId, epIdx) => {
                              const it = resolveSeriesItem(cId);
                              return (
                                <div
                                  key={cId}
                                  onClick={() => {
                                    if (it.type === 'long' && it.video) onSelectLongVideo?.(it.video);
                                    else if (it.type === 'short' && it.short) onSelectShort?.(it.short);
                                  }}
                                  className="p-2 rounded-xl bg-[#181B22] flex items-center justify-between gap-2 cursor-pointer hover:bg-[#20242E]"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 rounded-full bg-[#326BFF]/20 text-[#326BFF] flex items-center justify-center font-mono font-bold text-[10px]">
                                      {epIdx + 1}
                                    </span>
                                    <span className="text-white truncate">{it.title}</span>
                                  </div>
                                  <span className="text-[10px] text-[#A7ADB8] font-mono">
                                    {it.typeLabel}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT: SHOP (Commerce Catalog) */}
            {activeTab === 'shop' && (
              <div className="space-y-3">
                <div className="text-xs text-[#A7ADB8] font-mono">
                  Verified Escrow Store ({products.length || MOCK_PRODUCTS.length} Items)
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {(products.length ? products : MOCK_PRODUCTS).map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => onSelectProduct?.(prod)}
                      className="p-2.5 rounded-2xl bg-[#181B22] border border-[#292E38] hover:border-[#326BFF]/40 cursor-pointer space-y-2 group transition-all"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-900">
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono font-bold text-[#22C55E]">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-bold text-white font-['Syne'] truncate">
                          {prod.title}
                        </h5>
                        <div className="flex items-center justify-between text-[11px] text-[#A7ADB8] mt-1">
                          <span>{prod.category}</span>
                          <span className="text-[#22C55E] font-bold">Escrow ✓</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: SERVICES (Business Appointments) */}
            {activeTab === 'services' && (
              <div className="space-y-3">
                <div className="text-xs text-[#A7ADB8] font-mono">
                  Direct Clinic Appointments & Diagnostics
                </div>
                <div className="space-y-2.5">
                  {businessServices.map((svc) => (
                    <div
                      key={svc.id}
                      className="p-3.5 rounded-2xl bg-[#181B22] border border-[#292E38] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-[#326BFF]/15 text-[#326BFF] text-[10px] font-bold font-mono">
                          {svc.badge}
                        </span>
                        <span className="text-sm font-bold font-mono text-[#22C55E]">
                          {svc.fee}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white font-['Syne']">{svc.title}</h4>
                        <p className="text-xs text-[#A7ADB8] mt-0.5">{svc.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-[#292E38]">
                        <span className="text-xs text-[#A7ADB8] font-mono flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{svc.duration}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenBooking) onOpenBooking(currentProfileData.displayName, `@${currentProfileData.handle}`);
                            else showToast(`Booking slot for ${svc.title}`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#326BFF] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-[#467BFF]"
                        >
                          Book Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: PORTFOLIO (Professional Works) */}
            {activeTab === 'portfolio' && (
              <div className="space-y-3">
                <div className="text-xs text-[#A7ADB8] font-mono">
                  Selected Works & Color Finishing
                </div>
                <div className="space-y-3">
                  {professionalWorks.map((work) => (
                    <div
                      key={work.id}
                      className="p-3.5 rounded-2xl bg-[#181B22] border border-[#292E38] space-y-2.5"
                    >
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black">
                        <img src={work.cover} alt={work.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-mono font-bold text-amber-300 border border-amber-500/30">
                          {work.award}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-white font-['Syne']">{work.title}</h4>
                          <span className="text-xs text-[#A7ADB8] font-mono">{work.year}</span>
                        </div>
                        <p className="text-xs text-[#A7ADB8]">{work.category}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {work.tools.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#101217] text-[#A7ADB8] text-[10px] font-mono border border-[#292E38]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-3">
                <div className="text-xs text-[#A7ADB8] font-mono">
                  Verified Transaction Reviews
                </div>
                <div className="space-y-2.5">
                  {verifiedReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-2xl bg-[#181B22] border border-[#292E38] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{rev.author}</span>
                          <span className="px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] text-[10px] font-mono font-bold">
                            {rev.verifiedType} ✓
                          </span>
                        </div>
                        <span className="text-[10px] text-[#A7ADB8] font-mono">{rev.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-[#F7F8FA] leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL: MOMENT VIEWER ================= */}
      {isMomentViewerOpen && (
        <MomentViewerModal
          isOpen={isMomentViewerOpen}
          moments={userMoments}
          initialMomentIndex={momentViewerIndex}
          isOwner={viewPerspective === 'owner'}
          onClose={() => setIsMomentViewerOpen(false)}
          onWatchFullVideo={onSelectLongVideo}
          onSelectProduct={onSelectProduct}
          onBookAppointment={(tId) => onOpenBooking?.(currentProfileData.displayName, `@${currentProfileData.handle}`)}
          onRequestQuote={() => onOpenRequestQuote?.({ name: currentProfileData.displayName, handle: `@${currentProfileData.handle}` })}
          onDeleteMoment={(mId) => {
            setMomentsList((prev) => prev.filter((m) => m.id !== mId));
          }}
          onReplyMoment={(mId, text) => {
            showToast(`Reply sent as private DM to @${currentProfileData.handle}`);
          }}
          onMomentViewed={(mId) => {
            setMomentsList((prev) =>
              prev.map((m) => (m.id === mId ? { ...m, isViewed: true } : m))
            );
          }}
        />
      )}

      {/* ================= MODAL: CREATE MOMENT ================= */}
      {isCreateMomentOpen && (
        <CreateMomentModal
          isOpen={isCreateMomentOpen}
          user={user}
          accountMode={accountMode}
          isPrivateAccount={isPrivateAccount}
          onClose={() => setIsCreateMomentOpen(false)}
          onPublishMoment={(m) => {
            setMomentsList((prev) => [m, ...prev]);
            showToast('Moment shared to profile (24h)');
          }}
        />
      )}

      {/* ================= MODAL: FRAME VIEWER ================= */}
      {selectedFrame && (
        <FrameViewerModal
          isOpen={!!selectedFrame}
          frame={selectedFrame}
          isOwner={viewPerspective === 'owner'}
          onClose={() => setSelectedFrame(null)}
          onToggleLike={(fId) => {
            setFramesList((prev) =>
              prev.map((f) =>
                f.id === fId
                  ? { ...f, isLiked: !f.isLiked, likesCount: f.isLiked ? f.likesCount - 1 : f.likesCount + 1 }
                  : f
              )
            );
          }}
          onSelectProduct={onSelectProduct}
        />
      )}

      {/* ================= MODAL: CREATE FRAME ================= */}
      {isCreateFrameOpen && (
        <CreateFrameModal
          isOpen={isCreateFrameOpen}
          user={user}
          accountMode={accountMode}
          onClose={() => setIsCreateFrameOpen(false)}
          onPublishFrame={(f) => {
            setFramesList((prev) => [f, ...prev]);
            showToast('Frame published permanently');
          }}
        />
      )}

      {/* ================= MODAL: MODE SWITCHER ================= */}
      {showModeSwitcherModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowModeSwitcherModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[#181B22] border border-[#292E38] p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#292E38] pb-3">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-white font-['Syne']">
                  FLYNK Profile Modes
                </h3>
                <p className="text-[11px] text-[#A7ADB8]">
                  Dynamic layout tailored per account persona
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModeSwitcherModal(false)}
                className="w-8 h-8 rounded-full bg-[#101217] text-[#A7ADB8] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'personal' as FlynkAccountMode,
                  title: 'Personal',
                  desc: '88dp circle avatar, Friends & Lifestyle updates, Flicks & Frames',
                  icon: <UserIcon className="w-4 h-4 text-[#326BFF]" />,
                },
                {
                  id: 'creator' as FlynkAccountMode,
                  title: 'Creator',
                  desc: '96dp avatar, Full Videos, Series, Private analytics',
                  icon: <Film className="w-4 h-4 text-[#8B5CF6]" />,
                },
                {
                  id: 'business' as FlynkAccountMode,
                  title: 'Business',
                  desc: '88dp rounded-square logo (22dp radius), Appointments & Reviews',
                  icon: <Building2 className="w-4 h-4 text-[#22C55E]" />,
                },
                {
                  id: 'shop' as FlynkAccountMode,
                  title: 'Shop',
                  desc: '88dp rounded-square (20dp radius), Products & Escrow checkout',
                  icon: <ShoppingBag className="w-4 h-4 text-[#FF3D52]" />,
                },
                {
                  id: 'professional' as FlynkAccountMode,
                  title: 'Professional',
                  desc: '92dp portrait, Portfolio Works, Request Quote & Rating',
                  icon: <Briefcase className="w-4 h-4 text-[#F59E0B]" />,
                },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    setAccountMode(m.id);
                    setShowModeSwitcherModal(false);
                    showToast(`Switched to: ${m.title}`);
                  }}
                  className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    accountMode === m.id
                      ? 'bg-[#326BFF]/15 border-[#326BFF]'
                      : 'bg-[#101217] border-[#292E38] hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#181B22] flex items-center justify-center shrink-0">
                      {m.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-['Syne']">{m.title}</div>
                      <div className="text-[11px] text-[#A7ADB8] leading-tight mt-0.5">{m.desc}</div>
                    </div>
                  </div>
                  {accountMode === m.id && (
                    <Check className="w-4 h-4 text-[#326BFF] shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: VERIFICATION AUDIT ================= */}
      {isVerificationModalOpen && (
        <VerificationLevelsModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          user={user}
        />
      )}

      {/* ================= MODAL: SETTINGS ================= */}
      {isSettingsModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsSettingsModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-[#181B22] border border-[#292E38] p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#292E38] pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#326BFF]" />
                <span>Profile & Content Settings</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsSettingsModalOpen(false)}
                className="text-[#A7ADB8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#101217]">
                <div>
                  <div className="font-bold text-white">Private Account</div>
                  <div className="text-[11px] text-[#A7ADB8]">Only approved followers see media</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPrivateAccount(!isPrivateAccount)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    isPrivateAccount ? 'bg-[#326BFF]' : 'bg-[#292E38]'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      isPrivateAccount ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-[#101217]">
                <div>
                  <div className="font-bold text-white">Save Moments to Archive</div>
                  <div className="text-[11px] text-[#A7ADB8]">Private backup after 24h expiration</div>
                </div>
                <span className="text-[11px] font-mono text-[#22C55E]">Active</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-[#326BFF] text-white font-bold text-xs shadow-md cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT PROFILE ================= */}
      {isEditProfileModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsEditProfileModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-[#181B22] border border-[#292E38] p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#292E38] pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#326BFF]" />
                <span>Edit Profile</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditProfileModalOpen(false)}
                className="text-[#A7ADB8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] text-[#A7ADB8] uppercase font-mono font-bold">Display Name</label>
                <input
                  type="text"
                  defaultValue={currentProfileData.displayName}
                  className="w-full p-2.5 rounded-xl bg-[#101217] border border-[#292E38] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#A7ADB8] uppercase font-mono font-bold">Bio</label>
                <textarea
                  defaultValue={currentProfileData.bio}
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-[#101217] border border-[#292E38] text-white resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-[#A7ADB8] uppercase font-mono font-bold">Location</label>
                <input
                  type="text"
                  defaultValue={currentProfileData.location}
                  className="w-full p-2.5 rounded-xl bg-[#101217] border border-[#292E38] text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditProfileModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-[#101217] text-[#A7ADB8] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditProfileModalOpen(false);
                  showToast('Profile updated successfully');
                }}
                className="flex-1 py-2 rounded-xl bg-[#326BFF] text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
