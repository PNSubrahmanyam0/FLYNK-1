import { PlaceEntity, BusinessSector, ProfessionalSpecialization } from '../types/masterFlynk';
import { ShortVideo, Product } from '../types';

export interface LocalEvent {
  id: string;
  title: string;
  organizer: string;
  category: string;
  date: string;
  time: string;
  location: string;
  distanceKm: number;
  price: string;
  coverImage: string;
  attendeesCount: number;
  isVerifiedHost: boolean;
  intentActionText: string;
}

export interface ThingToDo {
  id: string;
  title: string;
  category: string;
  locality: string;
  distanceKm: number;
  duration: string;
  price: string;
  rating: number;
  coverImage: string;
  badge: string;
  description: string;
}

export const NEARBY_PRESETS = [
  { id: 'loc_jubilee', name: 'Jubilee Hills, Hyderabad', lat: 17.4319, lng: 78.4074, zone: 'Central West' },
  { id: 'loc_banjara', name: 'Banjara Hills, Hyderabad', lat: 17.4156, lng: 78.4347, zone: 'Central' },
  { id: 'loc_gachibowli', name: 'Gachibowli Financial Dist', lat: 17.4401, lng: 78.3489, zone: 'Tech Hub' },
  { id: 'loc_oldcity', name: 'Charminar / Old City', lat: 17.3616, lng: 78.4747, zone: 'Heritage Zone' },
  { id: 'loc_indiranagar', name: 'Indiranagar, Bengaluru', lat: 12.9784, lng: 77.6408, zone: 'East Hub' },
  { id: 'loc_bandra', name: 'Bandra West, Mumbai', lat: 19.0596, lng: 72.8295, zone: 'Coastal Zone' },
];

export const NEARBY_RADIUS_OPTIONS = [
  { id: 1, label: 'Within 1 km' },
  { id: 5, label: 'Within 5 km' },
  { id: 10, label: 'Within 10 km' },
  { id: 25, label: 'Within 25 km' },
  { id: 999, label: 'Entire City' },
];

export const NEARBY_EVENTS: LocalEvent[] = [
  {
    id: 'evt_1',
    title: 'Hyderabad Indie Rooftop Acoustic Night',
    organizer: 'Moonlight Collective',
    category: 'Live Music & Arts',
    date: 'Tonight',
    time: '08:00 PM – 11:00 PM',
    location: 'Tabula Rasa, Road 67, Jubilee Hills',
    distanceKm: 2.4,
    price: '₹499 (Includes beverage)',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    attendeesCount: 142,
    isVerifiedHost: true,
    intentActionText: 'Reserve Pass',
  },
  {
    id: 'evt_2',
    title: 'Heritage Handloom Silk & Indigo Pop-up Flea',
    organizer: 'Craft Council of Telangana',
    category: 'Fashion & Handloom',
    date: 'This Saturday & Sunday',
    time: '11:00 AM – 09:00 PM',
    location: 'State Gallery of Art, Madhapur',
    distanceKm: 3.8,
    price: 'Free Entry',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    attendeesCount: 520,
    isVerifiedHost: true,
    intentActionText: 'Save Event',
  },
  {
    id: 'evt_3',
    title: 'Midnight Biryani Heritage Photowalk',
    organizer: 'Hyderabad Lens Guild (Nikhil Sen)',
    category: 'Creator & Photography Walk',
    date: 'Friday Night',
    time: '11:30 PM – 02:30 AM',
    location: 'Nayab Hotel, Madina Circle, Old City',
    distanceKm: 6.8,
    price: '₹650 (Includes food tasting)',
    coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    attendeesCount: 28,
    isVerifiedHost: true,
    intentActionText: 'Join Walk',
  },
  {
    id: 'evt_4',
    title: 'Founders & Creator Coffee Meetup (M4 Setup & D2C)',
    organizer: 'FLYNK Hyderabad Chapter',
    category: 'Tech & Networking',
    date: 'Sunday Morning',
    time: '10:00 AM – 12:30 PM',
    location: 'Roastery Coffee House, Banjara Hills',
    distanceKm: 1.8,
    price: 'Free RSVP',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    attendeesCount: 85,
    isVerifiedHost: true,
    intentActionText: 'RSVP Now',
  },
];

export const NEARBY_THINGS_TO_DO: ThingToDo[] = [
  {
    id: 'ttd_1',
    title: 'Sunset Kayaking at Durgam Cheruvu Lake',
    category: 'Outdoor & Adventure',
    locality: 'Madhapur / Hitech City',
    distanceKm: 2.3,
    duration: '45 mins session',
    price: '₹350 / person',
    rating: 4.8,
    coverImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
    badge: 'Trending Activity',
    description: 'Paddle beneath the illuminated Hyderabad Cable Bridge with trained life safety guides.',
  },
  {
    id: 'ttd_2',
    title: 'Studio Clay Wheel Pottery Masterclass',
    category: 'Creative Workshop',
    locality: 'Road No. 45, Jubilee Hills',
    distanceKm: 1.6,
    duration: '2 hours hands-on',
    price: '₹1,200 (Take home your piece)',
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80',
    badge: 'Verified Studio',
    description: 'Work with natural red clay and learn throwing, trimming, and glaze basics with master potters.',
  },
  {
    id: 'ttd_3',
    title: 'Golconda Fort Acoustic Clapping Dome Tour',
    category: 'Heritage Wonder',
    locality: 'Ibrahim Bagh',
    distanceKm: 7.2,
    duration: '2.5 hours walk',
    price: '₹150 entry + guide',
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
    badge: 'Historic Landmark',
    description: 'Experience medieval acoustic engineering where a handclap at the gateway echoes 1 km uphill to the citadel.',
  },
  {
    id: 'ttd_4',
    title: 'Specialty Coffee Cupping & Manual Pour-over Bar',
    category: 'Culinary Experience',
    locality: 'Road No. 14, Banjara Hills',
    distanceKm: 2.1,
    duration: '1 hour cupping flight',
    price: '₹450 / flight',
    rating: 5.0,
    coverImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    badge: 'Barista Certified',
    description: 'Taste micro-lot coffees from Araku Valley and Chikmagalur with sensory aroma scorecards.',
  },
];
