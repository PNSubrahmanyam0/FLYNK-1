export type AccountType = 'personal' | 'creator' | 'business';

export type SocialPlatformType =
  | 'instagram'
  | 'youtube'
  | 'linkedin'
  | 'x'
  | 'tiktok'
  | 'facebook'
  | 'portfolio';

export interface SocialLinkItem {
  id: string;
  platform: SocialPlatformType;
  title: string;
  usernameOrUrl: string;
  url: string;
  isVisible: boolean;
  order: number;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: AccountType;
  verifiedSeller: boolean;
  verifiedCreator: boolean;
  followersCount: number;
  followingCount: number;
  bio: string;
  location?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    portfolio?: string;
  };
  customLinks?: SocialLinkItem[];
  collaborationsCount?: number;
  storeThemeColor?: string;
  trustMetrics?: {
    rating: number;
    deliveredOrders: number;
    deliverySuccessRate: number; // e.g. 98%
    joinedYear: number;
  };
  verificationAudit?: {
    identityVerified?: boolean;
    businessVerified?: boolean;
    sellerVerified?: boolean;
    credentialVerified?: boolean;
    credentialTitle?: string;
    officialLocationVerified?: boolean;
  };
  reputationMetrics?: {
    completedOrders?: number;
    successfulBookingsRate?: number; // e.g. 96
    responseTime?: string; // e.g. 'Responds within 15m'
    sinceYear?: number;
    verifiedReviewsCount?: number;
    rating?: number;
  };
  profileCompleteness?: {
    percentage: number;
    checklist: { id: string; label: string; done: boolean }[];
  };
}

export interface ProductVariant {
  sizes: string[];
  colors: { name: string; hex: string }[];
}

export interface ProductReview {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  comment: string;
  isVerifiedPurchase: boolean;
  productVariant?: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerHandle: string;
  sellerAvatar?: string;
  sellerVerified: boolean;
  title: string;
  price: number; // In INR ₹
  originalPrice: number;
  discountPct: number;
  images: string[];
  rating: number;
  reviewsCount: number;
  deliveredOrdersCount: number;
  stock: number;
  category: string;
  variants: ProductVariant;
  description: string;
  shippingDays: number;
  returnPolicy: string;
  isEscrowProtected: boolean;
  reviews: ProductReview[];
}

export interface HeatmapPoint {
  timestamp: number; // in seconds
  timestampFormatted: string;
  retentionPct: number; // 0 - 100
}

export interface LongVideo {
  id: string;
  creatorId: string;
  creator: User;
  collaborator?: User;
  title: string;
  description: string;
  durationSeconds: number;
  durationFormatted: string;
  videoUrl: string;
  thumbnailUrl: string;
  viewsCount: number;
  likesCount: number;
  publishedAt: string;
  category: string;
  tags?: string[];
  chapters: { title: string; time: string; timestamp: number }[];
  linkedShortIds: string[];
  taggedProducts: Product[];
  visibility?: 'public' | 'unlisted' | 'private';
  attachedProofDocument?: string;
  copyrightStatus?: 'clean' | 'under_review' | 'disputed' | 'temporarily_hidden';
  copyrightReport?: {
    reporterName: string;
    reporterHandle: string;
    originalSourceUrl: string;
    infringementProofText: string;
    reportedAt: string;
    disputeDeadline: string;
    status: 'pending_review' | 'counter_submitted' | 'withheld' | 'cleared';
  };
  heatmap?: HeatmapPoint[];
  peakEngagementMoment?: {
    startSeconds: number;
    endSeconds: number;
    startFormatted: string;
    endFormatted: string;
    label: string;
    retention: number;
  };
  intentAction?: {
    type:
      | 'save_place'
      | 'get_directions'
      | 'view_product'
      | 'hire'
      | 'request_quote'
      | 'book_site_visit'
      | 'book_appointment'
      | 'watch_full_video'
      | 'reserve_table';
    label: string;
    secondaryLabel?: string;
    targetTitle?: string;
    targetId?: string;
    priceOrFee?: string;
  };
  geoTag?: {
    placeName: string;
    locality: string;
    city: string;
    distanceKm?: number;
    latitude?: number;
    longitude?: number;
  };
}

export interface ShortVideo {
  id: string;
  creatorId: string;
  creator: User;
  collaborator?: User;
  title: string;
  description: string;
  durationSeconds: number; // <= 30
  videoUrl: string;
  thumbnailUrl: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  savesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  visibility?: 'public' | 'unlisted' | 'private';
  attachedProofDocument?: string;
  copyrightStatus?: 'clean' | 'under_review' | 'disputed' | 'temporarily_hidden';
  copyrightReport?: {
    reporterName: string;
    reporterHandle: string;
    originalSourceUrl: string;
    infringementProofText: string;
    reportedAt: string;
    disputeDeadline: string;
    status: 'pending_review' | 'counter_submitted' | 'withheld' | 'cleared';
  };
  audioTrack: {
    title: string;
    artist: string;
    isOriginal: boolean;
  };
  linkedLongVideoId?: string;
  linkedLongVideo?: LongVideo;
  taggedProducts: Product[];
  tags: string[];
  intentAction?: {
    type:
      | 'save_place'
      | 'get_directions'
      | 'view_product'
      | 'hire'
      | 'request_quote'
      | 'book_site_visit'
      | 'book_appointment'
      | 'watch_full_video'
      | 'reserve_table';
    label: string;
    secondaryLabel?: string;
    targetTitle?: string;
    targetId?: string;
    priceOrFee?: string;
  };
  geoTag?: {
    placeName: string;
    locality: string;
    city: string;
    distanceKm?: number;
    latitude?: number;
    longitude?: number;
  };
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  likesCount: number;
  createdAt: string;
  isLiked?: boolean;
  isPinned?: boolean;
  isHidden?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export type OrderDeliveryStatus =
  | 'confirmed'
  | 'packed'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered';

export type PaymentMethod = 'UPI' | 'CARD' | 'COD';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  paymentMethod: PaymentMethod;
  escrowStatus: 'held_in_escrow' | 'released_to_seller' | 'refunded';
  deliveryStatus: OrderDeliveryStatus;
  awbNumber: string;
  courierName: string;
  estimatedDeliveryDate: string;
  timeline: {
    status: OrderDeliveryStatus;
    title: string;
    description: string;
    timestamp: string;
    completed: boolean;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    pincode: string;
    state: string;
  };
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text?: string;
  product?: Product;
  timestamp: string;
  isEphemeral24h: boolean;
  expiresIn?: string;
  isMine: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
  inboxCategory?: 'messages' | 'orders' | 'bookings' | 'business_enquiries' | 'collaborations';
}

export type CollectionItemType =
  | 'flick'
  | 'long_video'
  | 'product'
  | 'place'
  | 'business'
  | 'professional';

export interface CollectionItem {
  id: string;
  itemType: CollectionItemType;
  itemId?: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  metadata?: string;
  addedAt?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  emoji: string;
  isPublic: boolean;
  coverImage?: string;
  items: CollectionItem[];
  itemCount?: number;
  updatedAt?: string;
  createdAt?: string;
}

export type LeadType = 'quote' | 'appointment' | 'site_visit' | 'enquiry' | 'service';
export type LeadStatus = 'new' | 'in_progress' | 'completed' | 'declined';

export interface UniversalLead {
  id: string;
  type: LeadType;
  title: string;
  clientName: string;
  clientHandle?: string;
  clientAvatar: string;
  clientPhone?: string;
  clientEmail?: string;
  details: string;
  serviceCategory: string;
  dateOrDeadline: string;
  budgetOrFee?: string;
  referenceUrl?: string;
  status: LeadStatus;
  createdAt: string;
  unread?: boolean;
}

export interface ProjectQuoteRequest {
  id: string;
  professionalId: string;
  professionalName: string;
  professionalHandle: string;
  clientName: string;
  clientContact: string;
  projectType: string;
  deadline: string;
  budgetRange: string;
  referenceUrl?: string;
  description: string;
  status: 'new' | 'quoted' | 'accepted' | 'declined' | 'completed';
  submittedAt: string;
}

export type VerifiedReviewType =
  | 'verified_purchase'
  | 'verified_booking'
  | 'verified_appointment'
  | 'verified_service';

export interface TransactionReview {
  id: string;
  targetId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  rating: number;
  reviewType: VerifiedReviewType;
  serviceOrItemName: string;
  date: string;
  comment: string;
  verifiedTransactionProof?: string;
}

export interface SeriesContentItemSummary {
  id: string; // LongVideo or ShortVideo ID
  contentType: 'long' | 'flick' | 'short';
  title?: string;
  thumbnailUrl?: string;
  duration?: string;
  order: number;
}

export interface Series {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  contentItems: string[]; // Can contain either LongVideo or ShortVideo IDs in sequence order
  coverImage?: string;
  category?: string;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
  totalDuration?: string;
}

export interface Moment {
  id: string;
  userId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  categoryLabel?: string;
  accountMode: 'personal' | 'creator' | 'business' | 'shop' | 'professional';
  mediaType: 'photo' | 'video' | 'text';
  mediaUrl?: string;
  textContent?: string;
  bgGradient?: string;
  createdAt: string;
  expiresAt: string;
  durationSeconds?: number;
  isViewed?: boolean;
  audience: 'public' | 'followers' | 'friends' | 'selected';
  ctaType?: 'watch_full' | 'view_product' | 'book' | 'reserve' | 'hire_me' | 'directions' | 'reply';
  ctaLabel?: string;
  ctaTargetId?: string;
  ctaTargetData?: any;
  viewsCount?: number;
  repliesCount?: number;
}

export interface Frame {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  authorRole?: 'personal' | 'creator' | 'business' | 'shop' | 'professional';
  caption: string;
  images: string[];
  location?: string;
  taggedUsers?: string[];
  taggedProducts?: Product[];
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  savesCount: number;
  isSaved?: boolean;
  createdAt: string;
  audience: 'public' | 'followers' | 'friends' | 'only_me';
}


