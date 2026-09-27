import { User, Product, ShortVideo, LongVideo } from './index';
import {
  PublicationStatus,
  BusinessSector,
  ProfessionalSpecialization,
  BookingService,
  PortfolioProject,
  ProfileViewPerspective,
} from './masterFlynk';

export type AccountMode =
  | 'personal'
  | 'creator'
  | 'business'
  | 'organization'
  | 'shop'
  | 'professional';

export type OrganizationRole =
  | 'owner'
  | 'ceo'
  | 'admin'
  | 'content_manager'
  | 'shop_manager'
  | 'order_manager'
  | 'support'
  | 'staff';

export interface AccountCapabilities {
  can_create_flick: boolean;
  can_create_long_video: boolean;
  can_link_flick_to_long: boolean;
  can_host_sing: boolean;
  can_join_sing?: boolean;
  can_host_public_sing?: boolean;
  can_create_shop?: boolean;
  can_add_products: boolean;
  can_tag_products: boolean;
  can_manage_orders?: boolean;
  can_manage_business_page: boolean;
  can_manage_location?: boolean;
  can_manage_website?: boolean;
  can_manage_organization: boolean;
  can_invite_team?: boolean;
  can_view_analytics?: boolean;
  can_view_financials?: boolean;
  can_accept_bookings?: boolean;
  can_show_portfolio?: boolean;
}

export interface AccountContext {
  id: string;
  mode: AccountMode;
  name: string;
  handle: string;
  avatar: string;
  roleBadge?: string; // e.g. "CREATOR", "BUSINESS", "CEO", "STORE", "PROFESSIONAL"
  orgRole?: OrganizationRole;
  orgName?: string;
  capabilities: AccountCapabilities;
  isPrivate?: boolean;
  businessLocation?: BusinessLocation;
  publicationStatus?: PublicationStatus;
  sector?: BusinessSector;
  specialization?: ProfessionalSpecialization;
  services?: BookingService[];
  portfolio?: PortfolioProject[];
  isStorePaused?: boolean;
  viewPerspective?: ProfileViewPerspective;
  experienceYears?: number;
  consultationFee?: number;
  rating?: number;
}

export interface BusinessLocation {
  businessName: string;
  category?: string;
  address: string;
  city?: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  openingHours: string;
  phone: string;
  hasPhysicalStore?: boolean;
}

export interface BusinessWebsiteSection {
  id: string;
  type:
    | 'hero'
    | 'about'
    | 'products'
    | 'services'
    | 'gallery'
    | 'flicks'
    | 'opening_hours'
    | 'location'
    | 'contact'
    | 'social_links';
  title: string;
  enabled: boolean;
  content?: Record<string, any>;
}

export interface SingSong {
  id: string;
  title: string;
  artist: string;
  duration: string;
  durationSeconds: number;
  genre: string;
  coverUrl: string;
  audioUrl: string;
  languages: {
    code: string;
    label: string; // e.g. "Telugu (Transliteration)"
    lyrics: { timeMs: number; text: string; nextText?: string }[];
  }[];
}

export interface SingParticipant {
  id: string;
  name: string;
  avatar: string;
  handle: string;
  isHost: boolean;
  isMicOn: boolean;
  isCameraOn: boolean;
  avatarMode: 'camera' | 'cyber_avatar' | 'neon_mask' | 'anime' | 'audio_wave';
  audioLevel: number;
}
