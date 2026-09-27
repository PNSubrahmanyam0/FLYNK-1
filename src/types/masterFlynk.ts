import { User, Product, ShortVideo, LongVideo } from './index';

export type MasterAccountMode =
  | 'personal'
  | 'creator'
  | 'business'
  | 'shop'
  | 'professional'
  | 'organization';

export type PublicationStatus =
  | 'draft'
  | 'published'
  | 'hidden'
  | 'paused'
  | 'suspended'
  | 'archived';

export type BusinessSector =
  | 'doctor_clinic'
  | 'real_estate'
  | 'restaurant'
  | 'hotel'
  | 'salon_beauty'
  | 'education'
  | 'gym_fitness'
  | 'manufacturing_b2b'
  | 'consulting'
  | 'other';

export type ProfessionalSpecialization =
  | 'video_editor'
  | 'developer'
  | 'photographer'
  | 'ui_ux_designer'
  | 'architect'
  | 'consultant'
  | 'musician'
  | 'animator'
  | 'writer'
  | 'other';

export interface PlaceEntity {
  id: string;
  name: string;
  category: string;
  formattedAddress: string;
  city: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  openingHours: string;
  phone: string;
  isVerifiedOfficial: boolean;
  coverImage: string;
  rating?: number;
  reviewsCount?: number;
  claimedByBusinessId?: string;
}

export interface BookingService {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  price?: number;
  isOnlineAvailable?: boolean;
  isInPersonAvailable?: boolean;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  coverUrl: string;
  videoUrl?: string;
  client?: string;
  description: string;
  toolsUsed: string[];
  year: number;
}

export interface BookingAppointment {
  id: string;
  type:
    | 'doctor_appointment'
    | 'site_visit'
    | 'table_reservation'
    | 'salon_service'
    | 'project_quote'
    | 'consultation';
  targetEntityId: string;
  targetEntityName: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  timeSlot: string;
  mode: 'in_person' | 'online' | 'on_site';
  notes?: string;
  guestsCount?: number;
  budgetRange?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export type ProfileViewPerspective = 'owner' | 'public_visitor' | 'follower' | 'friend';
