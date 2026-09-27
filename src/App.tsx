import React, { useState } from 'react';
import {
  Home,
  PlaySquare,
  Plus,
  ShoppingBag,
  User as UserIcon,
  MessageSquare,
  Smartphone,
  Maximize2,
  BarChart3,
  Presentation,
  Laptop,
  Package,
  Sparkles,
  CheckCircle2,
  Film,
  SlidersHorizontal,
  TrendingUp,
  LogIn,
  Search,
  Compass,
  Bookmark,
  Inbox,
  LayoutDashboard,
  Briefcase,
} from 'lucide-react';
import {
  CURRENT_USER,
  CREATORS,
  MOCK_SHORTS,
  MOCK_LONG_VIDEOS,
  ADDITIONAL_MOCK_LONG_VIDEOS,
  generateMockLongVideosBatch,
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_CONVERSATIONS,
  MOCK_SERIES,
} from './data/mockData';
import { INITIAL_COLLECTIONS } from './data/mockCollections';
import { INITIAL_LEADS } from './data/mockLeads';
import { MOCK_PLACES } from './data/mockPlaces';
import { MOCK_MOMENTS } from './data/mockMomentsAndFrames';
import { PlaceEntity } from './types/masterFlynk';
import {
  ShortVideo,
  LongVideo,
  Product,
  User,
  CartItem,
  Order,
  Conversation,
  Collection,
  CollectionItem,
  UniversalLead,
  ProjectQuoteRequest,
  Series,
} from './types';
import { FlynkLogo } from './components/Common/FlynkLogo';
import { PortalTransition } from './components/Common/PortalTransition';
import { SquircleIcon, SquircleHomeGlyph } from './components/Common/SquircleIcon';
import { AuthModal } from './components/Auth/AuthModal';
import { UserProfileModal } from './components/Common/UserProfileModal';
import { UserProfileView } from './components/Common/UserProfileView';
import { ShortPlayer } from './components/Shorts/ShortPlayer';
import { LongVideoPlayer } from './components/LongVideo/LongVideoPlayer';
import { LongVideoDiscovery } from './components/LongVideo/LongVideoDiscovery';
import { StorefrontView } from './components/Shop/StorefrontView';
import { ProductDetailModal } from './components/Shop/ProductDetailModal';
import { CartAndCheckoutModal } from './components/Shop/CartAndCheckoutModal';
import { OrdersTrackerModal } from './components/Orders/OrdersTrackerModal';
import { MessagingDrawer } from './components/Messaging/MessagingDrawer';
import { CreatorStudioModal } from './components/Creator/CreatorStudioModal';
import { AnalyticsDashboardModal } from './components/Analytics/AnalyticsDashboardModal';
import { PitchDeckModal } from './components/PitchDeck/PitchDeckModal';
import { MacM4SetupGuideModal } from './components/Common/MacM4SetupGuideModal';
import { YouTubeInstagramHomeFeed } from './components/Home/YouTubeInstagramHomeFeed';
import { CopyrightReportModal } from './components/Common/CopyrightReportModal';
import { CommentsDrawer } from './components/Shorts/CommentsDrawer';
import { ChatPageView } from './components/Messaging/ChatPageView';
import { BusinessLocationModal } from './components/Business/BusinessLocationModal';
import { BusinessWebsiteModal } from './components/Business/BusinessWebsiteModal';
import { UniversalCreateModal } from './components/Common/UniversalCreateModal';
import { AccountSwitcherModal } from './components/Common/AccountSwitcherModal';
import { SingTogetherModal } from './components/Sing/SingTogetherModal';
import { UniversalBookingModal } from './components/Booking/UniversalBookingModal';
import { PlacePageModal } from './components/Places/PlacePageModal';
import { UnifiedSearchModal } from './components/Search/UnifiedSearchModal';
import { UniversalIdentityCardModal } from './components/Common/UniversalIdentityCardModal';
import { ExploreView } from './components/Explore/ExploreView';
import { CollectionsView } from './components/Collections/CollectionsView';
import { SaveToCollectionModal } from './components/Collections/SaveToCollectionModal';
import { LeadInboxModal } from './components/Business/LeadInboxModal';
import { CreatorBusinessDashboardModal } from './components/Creator/CreatorBusinessDashboardModal';
import { RequestQuoteModal } from './components/Booking/RequestQuoteModal';
import { FloatingStickyChatButton } from './components/Navigation/FloatingStickyChatButton';
import { PromoteProductModal } from './components/Shop/PromoteProductModal';
import { AccountContext } from './types/account';

const INITIAL_CONTEXTS: AccountContext[] = [
  {
    id: 'ctx_nani_personal',
    mode: 'personal',
    name: 'Nani Kumar',
    handle: '@nanikumar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    publicationStatus: 'published',
    capabilities: {
      can_create_flick: true,
      can_create_long_video: true,
      can_link_flick_to_long: false,
      can_host_sing: true,
      can_join_sing: true,
      can_add_products: false,
      can_tag_products: false,
      can_manage_business_page: false,
      can_manage_organization: false,
    },
  },
  {
    id: 'ctx_nani_creator',
    mode: 'creator',
    name: 'Nani The Visionary',
    handle: '@nanicreator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    roleBadge: 'CREATOR',
    publicationStatus: 'published',
    capabilities: {
      can_create_flick: true,
      can_create_long_video: true,
      can_link_flick_to_long: true,
      can_host_sing: true,
      can_join_sing: true,
      can_add_products: true,
      can_tag_products: true,
      can_manage_business_page: false,
      can_manage_organization: false,
    },
  },
  {
    id: 'ctx_dr_arjun_clinic',
    mode: 'business',
    name: 'Dr. Arjun Reddy, MD',
    handle: '@drarjunclinic',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    roleBadge: 'DOCTOR / CLINIC',
    sector: 'doctor_clinic',
    publicationStatus: 'published',
    capabilities: {
      can_create_flick: true,
      can_create_long_video: true,
      can_link_flick_to_long: true,
      can_host_sing: false,
      can_join_sing: false,
      can_add_products: false,
      can_tag_products: false,
      can_manage_business_page: true,
      can_manage_organization: false,
      can_accept_bookings: true,
    },
    businessLocation: {
      businessName: 'Dr. Arjun Reddy Cardiology Clinic',
      address: 'Suite 204, Apollo Health City, Road No. 92, Jubilee Hills, Hyderabad 500033',
      distanceKm: 3.1,
      latitude: 17.4285,
      longitude: 78.4112,
      openingHours: '09:00 AM – 06:00 PM (Mon – Sat)',
      phone: '+91 40 2360 7777',
    },
  },
  {
    id: 'ctx_abc_business',
    mode: 'shop',
    name: 'SNAG LUCHI VASTRA',
    handle: '@snagluchivastra',
    avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
    roleBadge: 'OFFICIAL STORE',
    publicationStatus: 'published',
    isStorePaused: false,
    capabilities: {
      can_create_flick: true,
      can_create_long_video: true,
      can_link_flick_to_long: true,
      can_host_sing: false,
      can_join_sing: false,
      can_add_products: true,
      can_tag_products: true,
      can_manage_business_page: true,
      can_manage_organization: false,
    },
    businessLocation: {
      businessName: 'SNAG LUCHI VASTRA',
      address: 'Plot 42, Road No. 36, Jubilee Hills / Madhapur, Hyderabad, Telangana 500033',
      distanceKm: 2.8,
      latitude: 17.4319,
      longitude: 78.4074,
      openingHours: '10:00 AM – 9:30 PM (Daily)',
      phone: '+91 98490 12345',
    },
  },
  {
    id: 'ctx_kavya_vfx',
    mode: 'professional',
    name: 'Kavya Sharma',
    handle: '@kavyavfx',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    roleBadge: 'VIDEO EDITOR',
    specialization: 'video_editor',
    publicationStatus: 'published',
    capabilities: {
      can_create_flick: true,
      can_create_long_video: true,
      can_link_flick_to_long: true,
      can_host_sing: false,
      can_join_sing: false,
      can_add_products: false,
      can_tag_products: false,
      can_manage_business_page: false,
      can_manage_organization: false,
      can_show_portfolio: true,
      can_accept_bookings: true,
    },
  },
  {
    id: 'ctx_abc_company',
    mode: 'organization',
    name: 'ABC Fashion Pvt Ltd',
    handle: '@abcfashioncorp',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
    roleBadge: 'ENTERPRISE',
    orgRole: 'ceo',
    publicationStatus: 'published',
    capabilities: {
      can_create_flick: true,
      can_create_long_video: true,
      can_link_flick_to_long: true,
      can_host_sing: false,
      can_join_sing: false,
      can_add_products: true,
      can_tag_products: true,
      can_manage_business_page: true,
      can_manage_organization: true,
    },
  },
];

export function App() {
  // App user state
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);

  // Multi-entity Account Context & Switcher State (Rules 2, 3, 4)
  const [availableContexts, setAvailableContexts] = useState<AccountContext[]>(INITIAL_CONTEXTS);
  const [activeContext, setActiveContext] = useState<AccountContext>(INITIAL_CONTEXTS[0]);

  // Account Switcher & Dynamic Capability Modals
  const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
  const [isUniversalCreateOpen, setIsUniversalCreateOpen] = useState(false);
  const [isBusinessLocationOpen, setIsBusinessLocationOpen] = useState(false);
  const [isBusinessWebsiteOpen, setIsBusinessWebsiteOpen] = useState(false);
  const [isSingTogetherOpen, setIsSingTogetherOpen] = useState(false);

  // Master Ecosystem Extensions (Search, Places, Booking, Identity Card)
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPlacePageOpen, setIsPlacePageOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceEntity>(MOCK_PLACES[0]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isIdentityCardOpen, setIsIdentityCardOpen] = useState(false);
  const [identityCardUser, setIdentityCardUser] = useState<User>(CURRENT_USER);
  const [bookingTarget, setBookingTarget] = useState<{
    targetName: string;
    targetHandle: string;
    targetAvatar: string;
    sector?: any;
    specialization?: any;
    serviceTitle?: string;
  }>({
    targetName: 'Dr. Arjun Reddy, MD',
    targetHandle: '@drarjunclinic',
    targetAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    sector: 'doctor_clinic',
  });

  const handleOpenBooking = (
    targetName: string,
    targetHandle: string,
    sector?: any,
    specialization?: any,
    serviceTitle?: string
  ) => {
    setBookingTarget({
      targetName,
      targetHandle,
      targetAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      sector: sector || 'doctor_clinic',
      specialization,
      serviceTitle,
    });
    setIsBookingModalOpen(true);
  };

  const handleOpenIdentityCard = (user: User) => {
    setIdentityCardUser(user);
    setIsIdentityCardOpen(true);
  };

  // App navigation state: 'home' | 'explore' | 'shorts' | 'long' | 'shop' | 'chat' | 'profile' | 'collections'
  const [activeTab, setActiveTab] = useState<
    'home' | 'explore' | 'shorts' | 'long' | 'shop' | 'chat' | 'profile' | 'collections'
  >('home');
  const [previousTab, setPreviousTab] = useState<
    'home' | 'explore' | 'shorts' | 'long' | 'shop' | 'chat' | 'profile' | 'collections'
  >('home');
  const [currentShortIndex, setCurrentShortIndex] = useState(0);

  // Active items
  const [activeLongVideo, setActiveLongVideo] = useState<LongVideo | null>(MOCK_LONG_VIDEOS[1]);
  const [activeStoreCreator, setActiveStoreCreator] = useState<User>(CURRENT_USER);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  // Core content lists
  const [shortsList, setShortsList] = useState<ShortVideo[]>(MOCK_SHORTS);
  const [longVideosList, setLongVideosList] = useState<LongVideo[]>(MOCK_LONG_VIDEOS);
  const [productsList, setProductsList] = useState<Product[]>(MOCK_PRODUCTS);
  const [ordersList, setOrdersList] = useState<Order[]>(MOCK_ORDERS);
  const [conversationsList, setConversationsList] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [collectionsList, setCollectionsList] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [leadsList, setLeadsList] = useState<UniversalLead[]>(INITIAL_LEADS);
  const [seriesList, setSeriesList] = useState<Series[]>(MOCK_SERIES);

  const handleCreateSeries = (newSeries: Series) => {
    setSeriesList((prev) => [newSeries, ...prev]);
    showToast(`Created series "${newSeries.title}"!`);
  };

  const handleUpdateSeries = (updated: Series) => {
    setSeriesList((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    showToast(`Updated series "${updated.title}"!`);
  };

  const handleDeleteSeries = (seriesId: string) => {
    setSeriesList((prev) => prev.filter((s) => s.id !== seriesId));
    showToast('Series deleted from catalog.');
  };

  const [cart, setCart] = useState<CartItem[]>([
    {
      product: MOCK_PRODUCTS[0],
      quantity: 1,
      selectedSize: 'M',
      selectedColor: 'Obsidian Black',
    },
  ]);

  // Modals & Drawers
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState(false);
  const [isMacGuideOpen, setIsMacGuideOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Architecture extensions: Collections, Leads, Dashboard, Quote Modals
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);
  const [isSaveToCollectionOpen, setIsSaveToCollectionOpen] = useState(false);
  const [itemToSave, setItemToSave] = useState<{
    id: string;
    itemType: any;
    title: string;
    subtitle?: string;
    imageUrl?: string;
  } | null>(null);
  const [isLeadInboxOpen, setIsLeadInboxOpen] = useState(false);
  const [isCreatorBusinessDashboardOpen, setIsCreatorBusinessDashboardOpen] = useState(false);
  const [isRequestQuoteOpen, setIsRequestQuoteOpen] = useState(false);
  const [quoteTargetPro, setQuoteTargetPro] = useState<{
    name: string;
    handle: string;
    avatar: string;
    role?: string;
  } | null>(null);

  // Self-Service Paid Product Promotion Modal (Rules 99-121, 155-159)
  const [isPromoteOpen, setIsPromoteOpen] = useState(false);
  const [productToPromote, setProductToPromote] = useState<Product | null>(null);

  const handleOpenPromoteProduct = (prod: Product) => {
    setProductToPromote(prod);
    setIsPromoteOpen(true);
  };

  const handleOpenSaveToCollection = (item: {
    id: string;
    itemType: any;
    title: string;
    subtitle?: string;
    imageUrl?: string;
  }) => {
    setItemToSave(item);
    setIsSaveToCollectionOpen(true);
  };

  const handleOpenRequestQuote = (pro: {
    name: string;
    handle: string;
    avatar: string;
    role?: string;
  }) => {
    setQuoteTargetPro(pro);
    setIsRequestQuoteOpen(true);
  };

  const handleQuoteSubmitted = (quoteReq: ProjectQuoteRequest) => {
    const newLead: UniversalLead = {
      id: `lead_${Date.now()}`,
      type: 'quote',
      title: `${quoteReq.projectType} • ${quoteReq.professionalName}`,
      clientName: quoteReq.clientName,
      clientHandle: currentUser.handle,
      clientAvatar: currentUser.avatar,
      serviceCategory: 'Professional Project',
      details: quoteReq.description,
      dateOrDeadline: quoteReq.deadline,
      budgetOrFee: quoteReq.budgetRange || 'Flexible',
      referenceUrl: quoteReq.referenceUrl,
      status: 'new',
      createdAt: 'Just now',
      unread: true,
    };
    setLeadsList([newLead, ...leadsList]);
    showToast(`Project Quote submitted to ${quoteReq.professionalName}! Added to Lead Inbox.`);
  };

  // DMCA Copyright Reporting Modal State
  const [reportingCopyrightVideo, setReportingCopyrightVideo] = useState<LongVideo | ShortVideo | null>(null);

  // Feed Comments Drawer State
  const [isFeedCommentsOpen, setIsFeedCommentsOpen] = useState(false);
  const [feedCommentsMeta, setFeedCommentsMeta] = useState<{
    title: string;
    commentsCount: number;
    uploaderId: string;
  }>({ title: '', commentsCount: 0, uploaderId: '' });

  // Device simulation wrapper: 'iphone' | 'android' | 'full' (default to full responsive view)
  const [deviceMode, setDeviceMode] = useState<'iphone' | 'android' | 'full'>('full');

  // Signature Portal Transition state
  const [isPortalActive, setIsPortalActive] = useState(false);
  const [portalTargetVideo, setPortalTargetVideo] = useState<LongVideo | null>(null);

  // Notifications feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Infinite scroll load more state for long videos
  const [isLoadingMoreLongVideos, setIsLoadingMoreLongVideos] = useState(false);
  const [longVideosBatchIndex, setLongVideosBatchIndex] = useState(1);
  const [hasMoreLongVideos, setHasMoreLongVideos] = useState(true);

  // Switch Account Context (Rules 2, 3, 4)
  const handleSwitchContext = (ctx: AccountContext) => {
    setActiveContext(ctx);
    setCurrentUser((prev) => ({
      ...prev,
      name: ctx.name,
      handle: ctx.handle,
      avatar: ctx.avatar,
      badge: (ctx.roleBadge || (ctx.mode === 'creator' ? 'CREATOR' : undefined)) as any,
    }));
    showToast(`Switched active context to ${ctx.name} (${ctx.mode.toUpperCase()})`);
  };

  // Dynamic Universal Create handler (Rules 10-16)
  const handleSelectCreateAction = (action: string) => {
    if (action === 'create_moment' || action === 'create_frame') {
      setActiveTab('profile');
      showToast(action === 'create_moment' ? 'Add Moment (24h) opened in Profile' : 'Create Frame (Photo/Post) opened in Profile');
    } else if (action === 'sing_together') {
      setIsSingTogetherOpen(true);
    } else if (action === 'create_flick' || action === 'create_long_video' || action === 'link_flick_to_long') {
      setIsStudioOpen(true);
      if (action === 'link_flick_to_long') {
        showToast('Flick-to-Long Video linker active in Studio');
      }
    } else if (action === 'create_series') {
      setIsStudioOpen(true);
      showToast('Series Management & Episode Sequencing active in Studio');
    } else if (action === 'add_product' || action === 'create_collection') {
      setActiveTab('shop');
      showToast(action === 'add_product' ? 'Store Inventory Manager active' : 'Collection Builder active');
    } else if (action === 'tag_product') {
      showToast('Select a video in Studio or Feed to pin shoppable products');
      setIsStudioOpen(true);
    } else if (action === 'business_update' || action === 'company_update') {
      showToast('Verified Official Announcement mode enabled');
      setIsStudioOpen(true);
    } else if (action === 'add_portfolio' || action === 'add_service') {
      setIsStudioOpen(true);
      showToast(action === 'add_portfolio' ? 'Add Portfolio Case Study in Studio' : 'Configure Service & Rate Card in Studio');
    } else if (action === 'collaboration') {
      setIsStudioOpen(true);
      showToast('Invite Co-Creator Collaboration in Studio');
    } else if (action === 'manage_drafts') {
      setIsStudioOpen(true);
      showToast('Opening Studio Offline Drafts');
    } else if (action === 'add_property' || action === 'add_menu_item') {
      showToast(action === 'add_property' ? 'Realty Listing Editor active' : 'Menu Item Catalog active');
      setIsStudioOpen(true);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleLoadMoreLongVideos = () => {
    if (isLoadingMoreLongVideos || !hasMoreLongVideos) return;
    setIsLoadingMoreLongVideos(true);

    setTimeout(() => {
      let newBatch: LongVideo[] = [];
      if (longVideosBatchIndex === 1) {
        newBatch = ADDITIONAL_MOCK_LONG_VIDEOS;
      } else {
        newBatch = generateMockLongVideosBatch(longVideosBatchIndex);
      }

      setLongVideosList((prev) => [...prev, ...newBatch]);
      setLongVideosBatchIndex((prev) => prev + 1);
      setIsLoadingMoreLongVideos(false);

      if (longVideosBatchIndex >= 8) {
        setHasMoreLongVideos(false);
      }

      showToast(`Loaded ${newBatch.length} more full videos!`);
    }, 650);
  };

  // SIGNATURE CORE: Launch attached full video with portal morphing animation
  const handleLaunchFullVideo = (short: ShortVideo) => {
    if (short.linkedLongVideo) {
      setPortalTargetVideo(short.linkedLongVideo);
      setIsPortalActive(true);
    } else {
      showToast('No attached full video for this standalone short.');
    }
  };

  const handlePortalComplete = () => {
    if (portalTargetVideo) {
      setActiveLongVideo(portalTargetVideo);
      setActiveTab('long');
    }
    setIsPortalActive(false);
  };

  // 4-Direction Gesture Callbacks
  const handleNextShort = () => {
    if (currentShortIndex < shortsList.length - 1) {
      setCurrentShortIndex((prev) => prev + 1);
    } else {
      setCurrentShortIndex(0); // loop back
    }
  };

  const handlePrevShort = () => {
    if (currentShortIndex > 0) {
      setCurrentShortIndex((prev) => prev - 1);
    } else {
      setCurrentShortIndex(shortsList.length - 1);
    }
  };

  // Cart Management
  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([
        ...cart,
        {
          product,
          quantity: 1,
          selectedSize: size || product.variants.sizes[0],
          selectedColor: color || product.variants.colors[0]?.name,
        },
      ]);
    }
    showToast(`Added ${product.title.slice(0, 24)}... to Cart!`);
  };

  const handleBuyNow = (product: Product, size?: string, color?: string) => {
    handleAddToCart(product, size, color);
    setActiveProduct(null);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCart(
      cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const handleOrderCreated = (order: Order) => {
    setOrdersList([order, ...ordersList]);
    setCart([]);
    setIsOrdersOpen(true);
  };

  // Simulate Next Courier Event
  const handleSimulateCourierStep = (orderId: string) => {
    setOrdersList((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id !== orderId) return ord;

        const flow: Order['deliveryStatus'][] = [
          'confirmed',
          'packed',
          'picked_up',
          'in_transit',
          'out_for_delivery',
          'delivered',
        ];
        const currentIdx = flow.indexOf(ord.deliveryStatus);
        const nextStatus = flow[Math.min(flow.length - 1, currentIdx + 1)];
        const isDelivered = nextStatus === 'delivered';

        return {
          ...ord,
          deliveryStatus: nextStatus,
          escrowStatus: isDelivered ? 'released_to_seller' : ord.escrowStatus,
        };
      })
    );
    showToast('Logistics webhook received: status updated in real-time!');
  };

  const handlePublishNewShort = (newShort: ShortVideo) => {
    setShortsList([newShort, ...shortsList]);
    setCurrentShortIndex(0);
    setActiveTab('shorts');
    showToast('Short trailer published with Full Video link!');
  };

  const handlePublishNewLongVideo = (newLong: LongVideo) => {
    setLongVideosList([newLong, ...longVideosList]);
    setActiveLongVideo(newLong);
    setActiveTab('long');
    showToast('Full-length video published to catalog!');
  };

  const handleDeleteVideo = (videoId: string, type: 'short' | 'long') => {
    if (type === 'short') {
      setShortsList((prev) => prev.filter((s) => s.id !== videoId));
      showToast('Short video permanently deleted.');
    } else {
      setLongVideosList((prev) => prev.filter((l) => l.id !== videoId));
      showToast('Full video permanently deleted.');
    }
  };

  const handleTogglePrivacy = (
    videoId: string,
    type: 'short' | 'long',
    visibility: 'public' | 'private'
  ) => {
    if (type === 'short') {
      setShortsList((prev) =>
        prev.map((s) => (s.id === videoId ? { ...s, visibility } : s))
      );
    } else {
      setLongVideosList((prev) =>
        prev.map((l) => (l.id === videoId ? { ...l, visibility } : l))
      );
    }
    showToast(`Video visibility changed to ${visibility.toUpperCase()}`);
  };

  const handleConnectShortToLong = (shortId: string, longId: string | null) => {
    const linkedLong = longId ? longVideosList.find((lv) => lv.id === longId) : undefined;
    setShortsList((prev) =>
      prev.map((s) =>
        s.id === shortId
          ? {
              ...s,
              linkedLongVideoId: longId || undefined,
              linkedLongVideo: linkedLong,
            }
          : s
      )
    );
    showToast(
      longId
        ? 'Short successfully connected to Full Video with 1 click!'
        : 'Short disconnected from Full Video.'
    );
  };

  const handleCopyrightReportSubmitted = (
    videoId: string,
    report: {
      reporterName: string;
      reporterHandle: string;
      originalSourceUrl: string;
      infringementProofText: string;
      reportedAt: string;
      disputeDeadline: string;
      status: 'pending_review' | 'counter_submitted' | 'withheld' | 'cleared';
    }
  ) => {
    setLongVideosList((prev) =>
      prev.map((v) =>
        v.id === videoId
          ? {
              ...v,
              copyrightStatus: 'temporarily_hidden',
              copyrightReport: report,
            }
          : v
      )
    );
    setShortsList((prev) =>
      prev.map((s) =>
        s.id === videoId
          ? {
              ...s,
              copyrightStatus: 'temporarily_hidden',
              copyrightReport: report,
            }
          : s
      )
    );
    setReportingCopyrightVideo(null);
    showToast('DMCA Infringement Claim Registered: Video temporarily withheld pending 7-day uploader review.');
  };

  const currentShort = shortsList[currentShortIndex] || shortsList[0];

  const isShopActive = activeTab === 'shop';
  const isChatActive = activeTab === 'chat';
  const isBlueTheme = isShopActive || isChatActive;

  return (
    <div
      className={`min-h-screen text-neutral-100 flex flex-col font-['Plus_Jakarta_Sans'] relative overflow-hidden transition-colors duration-500 ${
        isBlueTheme
          ? 'bg-[#02060E] selection:bg-[#0356C5] selection:text-white'
          : 'bg-[#080205] selection:bg-rose-500 selection:text-white'
      }`}
    >
      {/* Ambient Dynamic Lighting Nodes: Softened Dual-Tone Red & Blue (transparent glass, no harsh glare) */}
      {isBlueTheme ? (
        <>
          <div className="fixed top-0 left-1/4 w-[550px] h-[350px] bg-[#0356C5]/18 rounded-full blur-[140px] pointer-events-none -z-10 transition-all duration-500" />
          <div className="fixed -bottom-20 right-1/4 w-[500px] h-[400px] bg-[#0C1446]/50 rounded-full blur-[160px] pointer-events-none -z-10 transition-all duration-500" />
          <div className="fixed top-1/2 left-0 w-[400px] h-[400px] bg-[#2B5C92]/12 rounded-full blur-[140px] pointer-events-none -z-10 transition-all duration-500" />
        </>
      ) : (
        <>
          {/* Muted Dual-Tone Red & Sapphire Blue: Softened Crimson + Electric Sapphire */}
          <div className="fixed top-0 left-1/4 w-[500px] h-[350px] bg-rose-950/20 rounded-full blur-[140px] pointer-events-none -z-10 transition-all duration-500" />
          <div className="fixed top-1/3 right-1/4 w-[500px] h-[350px] bg-[#0356C5]/12 rounded-full blur-[140px] pointer-events-none -z-10 transition-all duration-500" />
          <div className="fixed -bottom-20 right-1/3 w-[450px] h-[350px] bg-rose-900/10 rounded-full blur-[150px] pointer-events-none -z-10 transition-all duration-500" />
          <div className="fixed bottom-10 left-10 w-[400px] h-[400px] bg-[#0C1446]/20 rounded-full blur-[150px] pointer-events-none -z-10 transition-all duration-500" />
        </>
      )}

      {/* GLOBAL TOP ACTION & TOOLBAR (Always sticky, hides ONLY during full-screen video) */}
      {!activeLongVideo && (
        <header
          className={`px-4 lg:px-6 h-14 flex items-center justify-between sticky top-0 z-40 backdrop-blur-2xl transition-all duration-300 ${
            isBlueTheme
              ? 'bg-[#02060E]/85 border-b border-[#2B5C92]/30 shadow-[0_4px_30px_rgba(3,86,197,0.18)]'
              : 'bg-[#090306]/80 border-b border-rose-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          }`}
        >
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setActiveLongVideo(null);
                setActiveTab('home');
              }}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
              title="FLYNK Home (YouTube + Instagram Hybrid Feed)"
            >
              <FlynkLogo size="sm" showText={true} />
            </button>
          </div>

          {/* Zone 2: Navigation Links / Segmented Control */}
          <nav
            className={`flex items-center gap-1.5 p-1 rounded-2xl backdrop-blur-xl transition-all ${
              isBlueTheme
                ? 'bg-[#0C1446]/70 border border-[#2B5C92]/40 shadow-[0_4px_20px_rgba(3,86,197,0.25)]'
                : 'bg-[#0f0408]/60 border border-rose-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
            }`}
          >
            {/* 1. Home Feed (YouTube + Instagram Algorithm) */}
            <SquircleIcon
              svgIcon={<SquircleHomeGlyph className="w-4 h-4" />}
              active={activeTab === 'home'}
              variant={isBlueTheme ? 'blue' : 'dual'}
              size="sm"
              onClick={() => {
                setActiveLongVideo(null);
                setActiveTab('home');
              }}
              title="Home Feed"
              aria-label="Home"
            />

            {/* 1.5. Intentional Explore Page */}
            <SquircleIcon
              icon={Compass}
              active={activeTab === 'explore'}
              variant={isBlueTheme ? 'blue' : 'dual'}
              size="sm"
              onClick={() => {
                setActiveLongVideo(null);
                setActiveTab('explore');
              }}
              title="Explore (Intentional Discovery)"
              aria-label="Explore"
            />

            {/* 2. 30s Shorts Feed */}
            <SquircleIcon
              icon={Film}
              active={activeTab === 'shorts' && !activeLongVideo}
              variant={isBlueTheme ? 'blue' : 'red'}
              size="sm"
              onClick={() => {
                setActiveLongVideo(null);
                setActiveTab('shorts');
              }}
              title="30s Shorts Feed"
              aria-label="Shorts"
            />

            {/* 3. Catalog Long Videos */}
            <SquircleIcon
              icon={PlaySquare}
              active={activeTab === 'long'}
              variant={isBlueTheme ? 'blue' : 'red'}
              size="sm"
              onClick={() => {
                if (!activeLongVideo) setActiveLongVideo(longVideosList[1] || longVideosList[0]);
                setActiveTab('long');
              }}
              title="Catalog Videos"
              aria-label="Catalog"
            />

            {/* 4. Creator Store */}
            <SquircleIcon
              icon={ShoppingBag}
              active={activeTab === 'shop'}
              variant="blue"
              size="sm"
              onClick={() => setActiveTab('shop')}
              title="Creator Store (Glassy Blue)"
              aria-label="Store"
            />

            {/* 5. Direct Messages / Chat (Image b206971a7cc9b224e23be6ae3fbf5593.jpg) */}
            <SquircleIcon
              icon={MessageSquare}
              active={activeTab === 'chat'}
              variant="blue"
              size="sm"
              badge="1"
              onClick={() => setActiveTab('chat')}
              title="Chat & Messages"
              aria-label="Chat"
            />

            {/* 6. Creator Earnings & Escrow */}
            <SquircleIcon
              icon={TrendingUp}
              active={isAnalyticsOpen}
              size="sm"
              onClick={() => setIsAnalyticsOpen(true)}
              title="Creator Earnings & Analytics"
              aria-label="Creator Earnings & Analytics"
            />

            {/* 7. Collections (Rule 14) */}
            <SquircleIcon
              icon={Bookmark}
              active={activeTab === 'collections'}
              variant={isBlueTheme ? 'blue' : 'dual'}
              size="sm"
              onClick={() => {
                setActiveLongVideo(null);
                setActiveTab('collections');
              }}
              title="Saved Collections (Trips, Outfits, Places)"
              aria-label="Collections"
            />
          </nav>

        {/* Zone 3: Actions & Utilities */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Primary Action: Post / Create with Universal Capability Adapter (Rules 20, 21) */}
          <button
            onClick={() => setIsUniversalCreateOpen(true)}
            className={`px-3.5 py-1.5 rounded-xl text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-md ${
              isShopActive
                ? 'bg-gradient-to-r from-[#0356C5] to-[#2B5C92] hover:opacity-95 shadow-[0_0_20px_rgba(3,86,197,0.4)] border border-[#B3CDE0]/30'
                : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.35)] border border-red-300/30'
            }`}
            title="Create content, products, or sing together"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Post</span>
          </button>

          {/* Unified Ecosystem Search (Section 43) */}
          <SquircleIcon
            icon={Search}
            variant={isShopActive ? 'blue' : 'red'}
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            title="Unified Search (People, Creators, Doctors, Editors, Places, Products)"
            aria-label="Search FLYNK"
          />

          {/* Universal Lead Inbox (Appointments, Quotes, Enquiries) */}
          <SquircleIcon
            icon={Inbox}
            variant="blue"
            size="sm"
            badge={leadsList.filter((l) => l.unread).length > 0 ? leadsList.filter((l) => l.unread).length : undefined}
            onClick={() => setIsLeadInboxOpen(true)}
            title="Universal Lead Inbox"
            aria-label="Leads"
          />

          {/* Creator & Business Dashboard Home Button */}
          <button
            onClick={() => setIsCreatorBusinessDashboardOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm"
            title="Creator & Business Dashboard Home"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden xl:inline">Dashboard</span>
          </button>

          {/* Encrypted Direct Messages (Glassy Blue Starry Theme) */}
          <SquircleIcon
            icon={MessageSquare}
            variant="blue"
            size="sm"
            badge="1"
            onClick={() => setIsMessagesOpen(true)}
            title="Encrypted Direct Messages (Glassy Blue)"
          />

          {/* Orders & Escrow Release */}
          <SquircleIcon
            icon={Package}
            variant={isShopActive ? 'blue' : 'red'}
            size="sm"
            badge={ordersList.length > 0 ? ordersList.length : undefined}
            onClick={() => setIsOrdersOpen(true)}
            title="Track Shipments & Escrow Release"
          />

          {/* Cart (Glassy Blue) */}
          <SquircleIcon
            icon={ShoppingBag}
            variant="blue"
            size="sm"
            badge={cart.length > 0 ? cart.length : undefined}
            onClick={() => setIsCartOpen(true)}
            title="Cart & Escrow Checkout (Glassy Blue)"
          />

          {/* Multi-Account Identity Switcher (Rules 2, 3, 4) */}
          <button
            onClick={() => setIsAccountSwitcherOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-white transition-all cursor-pointer shadow-sm active:scale-95"
            title="Switch identity mode (Personal / Creator / Business / Organization)"
          >
            <img
              src={activeContext.avatar}
              alt={activeContext.name}
              className="w-4 h-4 rounded-full object-cover border border-white/20"
            />
            <span className="hidden lg:inline text-xs font-bold font-['Syne'] max-w-[100px] truncate">
              {activeContext.name}
            </span>
            <span
              className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-bold ${
                activeContext.mode === 'business'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : activeContext.mode === 'organization'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : activeContext.mode === 'creator'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}
            >
              {activeContext.mode === 'organization'
                ? activeContext.orgRole?.toUpperCase() || 'ORG'
                : activeContext.mode}
            </span>
          </button>

          {/* Login / Sign Up CTA */}
          <button
            onClick={() => {
              setAuthInitialMode('login');
              setIsAuthOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] hover:opacity-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-[0_4px_15px_rgba(139,92,246,0.45)] border border-purple-200/30 active:scale-95 cursor-pointer"
            title="Log In / Sign Up"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log In</span>
          </button>

          {/* User Profile Avatar Squircle */}
          <SquircleIcon
            icon={UserIcon}
            size="sm"
            active={activeTab === 'profile' || isProfileModalOpen}
            onClick={() => {
              setActiveStoreCreator(currentUser);
              setActiveTab('profile');
            }}
            title={`Profile: ${currentUser.name}`}
          />

          {/* More Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className={`p-2 rounded-xl border transition-colors backdrop-blur-md cursor-pointer ${
                isMoreMenuOpen
                  ? isShopActive
                    ? 'bg-[#0356C5]/40 border-[#0356C5] text-white shadow-[0_0_15px_rgba(3,86,197,0.4)]'
                    : 'bg-red-900/60 border-red-500/40 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : isShopActive
                  ? 'bg-[#0C1446]/60 hover:bg-[#0C1446] border-[#2B5C92]/30 text-[#B3CDE0] hover:text-white'
                  : 'bg-red-950/40 hover:bg-red-900/40 border-red-500/20 text-neutral-400 hover:text-white'
              }`}
              title="Platform Menu & Viewport"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {isMoreMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#140608]/95 border border-red-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(220,38,38,0.2)] p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1 backdrop-blur-2xl">
                <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-red-400/80 font-mono">
                  Creative & Business Features
                </div>

                {/* Sing Together Studio */}
                <button
                  onClick={() => {
                    setIsSingTogetherOpen(true);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-red-950/60 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>Sing Together</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300">
                        STUDIO
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Live sync lyrics, dual-cam & pitch visualizer
                    </div>
                  </div>
                </button>

                {/* Business Store Location */}
                <button
                  onClick={() => {
                    setIsBusinessLocationOpen(true);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-red-950/60 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <Package className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>Store Physical Location</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                        MAPS
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      View verified boutique address & directions
                    </div>
                  </div>
                </button>

                {/* Business Webpage Builder */}
                <button
                  onClick={() => {
                    setIsBusinessWebsiteOpen(true);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-red-950/60 hover:text-white transition-colors text-left cursor-pointer"
                >
                  <Presentation className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>Webpage Builder</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300">
                        LIVE SYNC
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Modular site for brand.app/b/businessname
                    </div>
                  </div>
                </button>

                <div className="border-t border-red-500/20 my-1" />

                <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-red-400/80 font-mono">
                  Platform Documentation
                </div>

                <button
                  onClick={() => {
                    setIsPitchDeckOpen(true);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-red-950/60 hover:text-white transition-colors text-left"
                >
                  <Presentation className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white">Concept Presentation</div>
                    <div className="text-[10px] text-neutral-400">Interactive business deck</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsMacGuideOpen(true);
                    setIsMoreMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-red-950/60 hover:text-white transition-colors text-left"
                >
                  <Laptop className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white">Mac M4 Setup Guide</div>
                    <div className="text-[10px] text-neutral-400">High-bitrate pipeline config</div>
                  </div>
                </button>

                <div className="border-t border-red-500/20 my-1" />

                <div className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider text-red-400/80 font-mono">
                  Viewport Mode
                </div>

                <div className="grid grid-cols-3 gap-1 p-1 bg-red-950/40 rounded-xl border border-red-500/20">
                  <button
                    onClick={() => {
                      setDeviceMode('full');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`py-1.5 text-[11px] font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      deviceMode === 'full'
                        ? 'bg-red-600 text-white font-bold shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>Fluid</span>
                  </button>
                  <button
                    onClick={() => {
                      setDeviceMode('iphone');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`py-1.5 text-[11px] font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      deviceMode === 'iphone'
                        ? 'bg-gradient-to-r from-rose-600 to-[#0356C5] text-white font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>iPhone</span>
                  </button>
                  <button
                    onClick={() => {
                      setDeviceMode('android');
                      setIsMoreMenuOpen(false);
                    }}
                    className={`py-1.5 text-[11px] font-medium rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      deviceMode === 'android'
                        ? 'bg-gradient-to-r from-rose-600 to-[#0356C5] text-white font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Android</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      )}

      {/* MAIN VIEWPORT CONTAINER */}
      <main className="flex-1 flex items-center justify-center p-0 md:p-3 overflow-hidden relative">
        {/* Device Frame Wrapper (supports iPhone Mockup, Android Flagship, or Fluid View) */}
        <div
          className={`w-full transition-all duration-300 flex flex-col overflow-hidden relative ${
            deviceMode === 'iphone'
              ? 'max-w-[420px] h-[860px] max-h-[92vh] rounded-[48px] border-[8px] border-neutral-900 shadow-[0_0_60px_rgba(220,38,38,0.25)] ring-1 ring-red-500/30 bg-black'
              : deviceMode === 'android'
              ? 'max-w-[420px] h-[860px] max-h-[92vh] rounded-[36px] border-[6px] border-neutral-900 shadow-[0_0_60px_rgba(220,38,38,0.25)] ring-1 ring-red-500/30 bg-black'
              : 'h-[calc(100vh-80px)] max-w-7xl rounded-2xl border border-red-500/20 shadow-[0_0_50px_rgba(220,38,38,0.12)] bg-[#0a0305]/95 backdrop-blur-2xl'
          }`}
        >
          {/* Dynamic Notch / Island on iPhone frame */}
          {deviceMode === 'iphone' && (
            <div className="absolute top-2 inset-x-0 z-40 flex justify-center pointer-events-none">
              <div className="w-28 h-5 bg-black rounded-full border border-white/10 shadow flex items-center justify-between px-3">
                <span className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-700" />
                <span className="w-2 h-2 rounded-full bg-blue-900/60" />
              </div>
            </div>
          )}

          {/* Center Hole-punch camera on Android frame */}
          {deviceMode === 'android' && (
            <div className="absolute top-2.5 inset-x-0 z-40 flex justify-center pointer-events-none">
              <div className="w-4 h-4 rounded-full bg-black border border-neutral-800 flex items-center justify-center shadow">
                <span className="w-2 h-2 rounded-full bg-neutral-900 border border-blue-950/80" />
              </div>
            </div>
          )}

          {/* SCREEN CONTENT AREA */}
          <div className="flex-1 relative overflow-hidden bg-black flex flex-col">
            {/* VIEW 0: YOUTUBE & INSTAGRAM HYBRID ALGORITHMIC HOME FEED */}
            {activeTab === 'home' && (
              <div className="w-full h-full relative">
                <YouTubeInstagramHomeFeed
                  currentUser={currentUser}
                  followingCreators={Object.values(CREATORS)}
                  longVideos={longVideosList}
                  shorts={shortsList}
                  products={productsList}
                  onSelectLongVideo={(video) => {
                    setPreviousTab('home');
                    setActiveLongVideo(video);
                    setActiveTab('long');
                  }}
                  onSelectShort={(short) => {
                    const idx = shortsList.findIndex((item) => item.id === short.id);
                    if (idx > -1) setCurrentShortIndex(idx);
                    setActiveTab('shorts');
                  }}
                  onSelectProduct={(p) => setActiveProduct(p)}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onOpenCreatorProfile={(creator) => {
                    handleOpenIdentityCard(creator);
                  }}
                  onOpenComments={(title, count, uploaderId) => {
                    setFeedCommentsMeta({ title, commentsCount: count, uploaderId });
                    setIsFeedCommentsOpen(true);
                  }}
                  onOpenReportCopyright={(v) => setReportingCopyrightVideo(v)}
                  onOpenUpload={() => setIsStudioOpen(true)}
                />
              </div>
            )}

            {/* VIEW 0.5: POWERFUL EXPLORE PAGE (Intentional Discovery) */}
            {activeTab === 'explore' && (
              <div className="w-full h-full relative overflow-y-auto">
                <ExploreView
                  shorts={shortsList}
                  longVideos={longVideosList}
                  products={productsList}
                  places={MOCK_PLACES}
                  onSelectShort={(short) => {
                    const idx = shortsList.findIndex((item) => item.id === short.id);
                    if (idx > -1) setCurrentShortIndex(idx);
                    setActiveTab('shorts');
                  }}
                  onSelectLongVideo={(video) => {
                    setPreviousTab('explore');
                    setActiveLongVideo(video);
                    setActiveTab('long');
                  }}
                  onSelectProduct={(p) => setActiveProduct(p)}
                  onSelectPlace={(place) => {
                    setSelectedPlace(place);
                    setIsPlacePageOpen(true);
                  }}
                  onSelectCreator={(creator) => {
                    handleOpenIdentityCard(creator);
                  }}
                  onOpenIdentityCard={(user) => {
                    handleOpenIdentityCard(user);
                  }}
                  onOpenBooking={(name, handle, sector, spec) => {
                    handleOpenBooking(name, handle, sector, spec);
                  }}
                  onOpenSearch={() => setIsSearchOpen(true)}
                  onOpenSaveToCollection={handleOpenSaveToCollection}
                  onOpenRequestQuote={handleOpenRequestQuote}
                />
              </div>
            )}

            {/* VIEW 1: SHORT VIDEOS FEED */}
            {activeTab === 'shorts' && (
              <div className="w-full h-full relative flex overflow-hidden">
                {/* Center: Short Video Player */}
                <div className="flex-1 h-full relative flex items-center justify-center bg-black">
                  <ShortPlayer
                    video={currentShort}
                    currentUser={CURRENT_USER}
                    onSwipeLeftToFull={handleLaunchFullVideo}
                    onSwipeRightToDiscovery={() => {
                      setActiveLongVideo(null);
                      setActiveTab('long');
                    }}
                    onNextShort={handleNextShort}
                    onPrevShort={handlePrevShort}
                    onSelectProduct={(p) => setActiveProduct(p)}
                    onAddToCart={(p) => handleAddToCart(p)}
                    onOpenCreatorProfile={(creator) => {
                      handleOpenIdentityCard(creator);
                    }}
                    onOpenStudio={() => setIsStudioOpen(true)}
                    onOpenOrders={() => setIsOrdersOpen(true)}
                    onOpenPlace={() => setIsPlacePageOpen(true)}
                    onOpenSaveToCollection={handleOpenSaveToCollection}
                    onOpenRequestQuote={handleOpenRequestQuote}
                    onOpenBooking={handleOpenBooking}
                  />
                </div>

                {/* Right: Studio Companion Column for Desktop View */}
                {deviceMode === 'full' && (
                  <aside className="hidden lg:flex w-[380px] xl:w-[420px] h-full flex-col border-l border-red-500/20 bg-[#0c0305]/85 backdrop-blur-2xl p-5 overflow-y-auto space-y-4 shrink-0 select-none shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
                    {/* Attached Full Story Card */}
                    {currentShort.linkedLongVideo ? (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-red-950/40 via-[#140608]/70 to-black/80 backdrop-blur-xl border border-red-500/25 space-y-3 shadow-[0_8px_30px_rgba(220,38,38,0.15)]">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 font-mono flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
                            Attached Full Story
                          </span>
                          <span className="text-xs font-mono text-neutral-400 tabular-nums">
                            {currentShort.linkedLongVideo.durationFormatted}
                          </span>
                        </div>

                        <div
                          onClick={() => handleLaunchFullVideo(currentShort)}
                          className="group cursor-pointer relative aspect-video rounded-xl overflow-hidden bg-neutral-900 border border-red-500/20 shadow-inner"
                        >
                          <img
                            src={currentShort.linkedLongVideo.thumbnailUrl}
                            alt={currentShort.linkedLongVideo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-3">
                            <h4
                              className="font-bold text-xs text-white truncate whitespace-nowrap overflow-hidden text-ellipsis block max-w-full font-['Syne']"
                              title={currentShort.linkedLongVideo.title}
                            >
                              {currentShort.linkedLongVideo.title}
                            </h4>
                          </div>
                        </div>

                        <button
                          onClick={() => handleLaunchFullVideo(currentShort)}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(220,38,38,0.45)] border border-red-400/30 active:scale-[0.98] transition-all"
                        >
                          <span>Watch Full Cinema Story</span>
                          <span>▭</span>
                        </button>
                      </div>
                    ) : null}

                    {/* Tagged Products in Trailer */}
                    {currentShort.taggedProducts && currentShort.taggedProducts.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-200">
                            Tagged Gear & Apparel
                          </span>
                          <span className="text-[11px] text-emerald-400 font-medium">
                            Escrow Protected
                          </span>
                        </div>

                        <div className="space-y-2">
                          {currentShort.taggedProducts.map((p) => (
                            <div
                              key={p.id}
                              onClick={() => setActiveProduct(p)}
                              className="p-2.5 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 hover:border-red-500/40 backdrop-blur-md flex items-center gap-3 cursor-pointer transition-all group"
                            >
                              <img
                                src={p.images[0]}
                                alt={p.title}
                                className="w-12 h-12 rounded-lg object-cover bg-neutral-900 border border-red-500/20 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-semibold text-white truncate group-hover:text-red-300 transition-colors">
                                  {p.title}
                                </h5>
                                <div className="text-xs font-mono font-bold text-white tabular-nums">
                                  ₹{p.price.toLocaleString()}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(p);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold shadow-[0_0_12px_rgba(239,68,68,0.4)] transition-all shrink-0"
                              >
                                Add
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Creator Card */}
                    <div className="p-3.5 rounded-2xl bg-red-950/20 backdrop-blur-xl border border-red-500/20 flex items-center justify-between">
                      <div
                        onClick={() => {
                          setActiveStoreCreator(currentShort.creator);
                          setActiveTab('profile');
                        }}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <img
                          src={currentShort.creator.avatar}
                          alt={currentShort.creator.name}
                          className="w-10 h-10 rounded-full object-cover border border-red-500/30 group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-red-400 transition-colors flex items-center gap-1">
                            {currentShort.creator.name}
                            {currentShort.creator.verifiedCreator && (
                              <span className="w-3.5 h-3.5 rounded-full bg-red-500 text-white inline-flex items-center justify-center text-[7px] font-bold shadow-[0_0_8px_#ef4444]">
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            @{currentShort.creator.handle}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveStoreCreator(currentShort.creator);
                          setActiveTab('profile');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-white text-xs font-semibold transition-colors"
                      >
                        Profile
                      </button>
                    </div>

                    {/* Desktop Hotkeys Guide */}
                    <div className="pt-2 border-t border-red-500/15 text-[11px] text-neutral-500 space-y-1.5 font-mono">
                      <div className="font-sans font-bold text-neutral-400 text-xs mb-1">
                        Keyboard Navigation
                      </div>
                      <div className="flex justify-between">
                        <span>Previous / Next Short</span>
                        <span className="text-neutral-300">↑ / ↓</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Play / Pause</span>
                        <span className="text-neutral-300">Space</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Toggle Audio Mute</span>
                        <span className="text-neutral-300">M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Launch Attached Full Video</span>
                        <span className="text-neutral-300">→ or Enter</span>
                      </div>
                    </div>
                  </aside>
                )}
              </div>
            )}

            {/* VIEW 2: LONG VIDEOS (PLAYER OR DISCOVERY FEED) */}
            {activeTab === 'long' && (
              <div className="w-full h-full relative">
                {activeLongVideo ? (
                  <LongVideoPlayer
                    video={activeLongVideo}
                    allShorts={shortsList}
                    allLongVideos={longVideosList}
                    currentUser={CURRENT_USER}
                    onBackToShorts={() => {
                      setActiveLongVideo(null);
                      setActiveTab(previousTab || 'home');
                    }}
                    onSelectShort={(s) => {
                      const idx = shortsList.findIndex((item) => item.id === s.id);
                      if (idx > -1) setCurrentShortIndex(idx);
                      setActiveTab('shorts');
                    }}
                    onSelectLongVideo={(lv) => setActiveLongVideo(lv)}
                    onSelectProduct={(p) => setActiveProduct(p)}
                    onAddToCart={(p) => handleAddToCart(p)}
                    onOpenCreatorProfile={(creator) => {
                      handleOpenIdentityCard(creator);
                    }}
                    onOpenReportCopyright={(v) => setReportingCopyrightVideo(v)}
                  />
                ) : (
                  <LongVideoDiscovery
                    videos={longVideosList}
                    onSelectVideo={(video) => setActiveLongVideo(video)}
                    onOpenCreatorProfile={(creator) => {
                      handleOpenIdentityCard(creator);
                    }}
                    onBackToShorts={() => setActiveTab('shorts')}
                    onLoadMore={handleLoadMoreLongVideos}
                    isLoadingMore={isLoadingMoreLongVideos}
                    hasMore={hasMoreLongVideos}
                  />
                )}
              </div>
            )}

            {/* VIEW 3: SHOP / STOREFRONT */}
            {activeTab === 'shop' && (
              <div className="w-full h-full relative">
                <StorefrontView
                  creator={activeStoreCreator}
                  products={productsList}
                  shorts={shortsList}
                  longVideos={longVideosList}
                  isOwner={activeStoreCreator.id === currentUser.id}
                  orders={ordersList}
                  onSelectProduct={(p) => setActiveProduct(p)}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onSelectShort={(s) => {
                    const idx = shortsList.findIndex((item) => item.id === s.id);
                    if (idx > -1) setCurrentShortIndex(idx);
                    setActiveTab('shorts');
                  }}
                  onSelectLongVideo={(lv) => {
                    setActiveLongVideo(lv);
                    setActiveTab('long');
                  }}
                  onStartChat={(creator) => {
                    setIsMessagesOpen(true);
                  }}
                  onBackToShorts={() => setActiveTab('shorts')}
                  onPromoteProduct={handleOpenPromoteProduct}
                  onOpenOrders={() => setIsOrdersOpen(true)}
                />
              </div>
            )}

            {/* VIEW 4: CREATOR PROFILE */}
            {activeTab === 'profile' && (
              <div className="w-full h-full relative overflow-y-auto">
                <UserProfileView
                  user={activeStoreCreator}
                  isCurrentUser={activeStoreCreator.id === currentUser.id}
                  products={productsList.filter(
                    (p) =>
                      p.sellerId === activeStoreCreator.id ||
                      p.sellerHandle === activeStoreCreator.handle ||
                      p.sellerName === activeStoreCreator.name
                  )}
                  shorts={shortsList.filter((s) => s.creatorId === activeStoreCreator.id)}
                  longVideos={longVideosList.filter((v) => v.creatorId === activeStoreCreator.id)}
                  series={seriesList}
                  activeMoments={MOCK_MOMENTS}
                  onBack={() => setActiveTab('home')}
                  onOpenStudio={() => setIsStudioOpen(true)}
                  onOpenOrders={() => setIsOrdersOpen(true)}
                  onOpenStore={() => {
                    setActiveTab('shop');
                  }}
                  onOpenAuth={() => {
                    setAuthInitialMode('login');
                    setIsAuthOpen(true);
                  }}
                  onOpenEarnings={() => setIsAnalyticsOpen(true)}
                  onUpdateUser={(updated) => {
                    setCurrentUser(updated);
                    setActiveStoreCreator(updated);
                  }}
                  onSelectProduct={(p) => setActiveProduct(p)}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onSelectShort={(s) => {
                    const idx = shortsList.findIndex((item) => item.id === s.id);
                    if (idx > -1) setCurrentShortIndex(idx);
                    setActiveTab('shorts');
                  }}
                  onSelectLongVideo={(lv) => {
                    setActiveLongVideo(lv);
                    setActiveTab('long');
                  }}
                  onStartChat={(creator) => {
                    setIsMessagesOpen(true);
                  }}
                  onOpenBooking={(name, handle, sector, spec) => {
                    handleOpenBooking(name, handle, sector, spec);
                  }}
                  onOpenRequestQuote={handleOpenRequestQuote}
                  onOpenSingTogether={() => setIsSingTogetherOpen(true)}
                />
              </div>
            )}

            {/* VIEW 5: RESTORED PREVIOUS ENCRYPTED DIRECT CHAT PAGE */}
            {activeTab === 'chat' && (
              <div className="w-full h-full relative overflow-hidden">
                <ChatPageView
                  currentUser={currentUser}
                  onBackToHome={() => setActiveTab('home')}
                  onSelectProduct={(p) => setActiveProduct(p)}
                  onAddToCart={(p) => handleAddToCart(p)}
                />
              </div>
            )}

            {/* VIEW 6: USER SAVED COLLECTIONS (Rule 14) */}
            {activeTab === 'collections' && (
              <div className="w-full h-full relative overflow-y-auto">
                <CollectionsView
                  collections={collectionsList}
                  onUpdateCollections={(updated: Collection[]) => setCollectionsList(updated)}
                  onSelectFlick={(shortId: string) => {
                    const idx = shortsList.findIndex((s) => s.id === shortId);
                    if (idx > -1) setCurrentShortIndex(idx);
                    setActiveTab('shorts');
                  }}
                  onSelectLongVideo={(videoId: string) => {
                    const found = longVideosList.find((v) => v.id === videoId);
                    if (found) {
                      setActiveLongVideo(found);
                      setActiveTab('long');
                    }
                  }}
                  onSelectProduct={(prodId: string) => {
                    const found = productsList.find((p) => p.id === prodId);
                    if (found) setActiveProduct(found);
                  }}
                  onSelectPlace={(placeId: string) => {
                    const found = MOCK_PLACES.find((p) => p.id === placeId);
                    if (found) {
                      setSelectedPlace(found);
                      setIsPlacePageOpen(true);
                    }
                  }}
                />
              </div>
            )}

            {/* BOTTOM 6-DESTINATION STICKY NAVIGATION (Always sticky across all views as requested by user) */}
            <nav
              className={`backdrop-blur-2xl px-2 py-2 items-center justify-around z-30 select-none transition-all duration-300 sticky bottom-0 shrink-0 ${
                isBlueTheme
                  ? 'bg-[#020819]/95 border-t border-[#2B5C92]/35 shadow-[0_-4px_30px_rgba(3,86,197,0.2)]'
                  : 'bg-[#090306]/95 border-t border-rose-500/20 shadow-[0_-4px_30px_rgba(0,0,0,0.5)]'
              } flex`}
            >
              {/* 1. Home Feed */}
              <div className="flex flex-col items-center gap-1">
                <SquircleIcon
                  svgIcon={<SquircleHomeGlyph className="w-5 h-5" />}
                  active={activeTab === 'home'}
                  variant={isBlueTheme ? 'blue' : 'dual'}
                  size="md"
                  onClick={() => {
                    setActiveTab('home');
                  }}
                  title="Home Feed"
                />
                <span
                  className={`text-[10px] ${
                    activeTab === 'home'
                      ? isBlueTheme
                        ? 'text-[#38bdf8] font-bold'
                        : 'text-rose-400 font-bold'
                      : 'text-neutral-400'
                  }`}
                >
                  Home
                </span>
              </div>

              {/* 1.5. Intentional Explore */}
              <div className="flex flex-col items-center gap-1">
                <SquircleIcon
                  icon={Compass}
                  active={activeTab === 'explore'}
                  variant={isBlueTheme ? 'blue' : 'dual'}
                  size="md"
                  onClick={() => {
                    setActiveTab('explore');
                  }}
                  title="Explore"
                />
                <span
                  className={`text-[10px] ${
                    activeTab === 'explore'
                      ? isBlueTheme
                        ? 'text-[#38bdf8] font-bold'
                        : 'text-rose-400 font-bold'
                      : 'text-neutral-400'
                  }`}
                >
                  Explore
                </span>
              </div>

              {/* 2. 30s Shorts Feed */}
              <div className="flex flex-col items-center gap-1">
                <SquircleIcon
                  icon={PlaySquare}
                  active={activeTab === 'shorts'}
                  variant={isBlueTheme ? 'blue' : 'red'}
                  size="md"
                  onClick={() => {
                    setActiveTab('shorts');
                  }}
                  title="Shorts"
                />
                <span
                  className={`text-[10px] ${
                    activeTab === 'shorts'
                      ? isBlueTheme
                        ? 'text-[#38bdf8] font-bold'
                        : 'text-rose-400 font-bold'
                      : 'text-neutral-400'
                  }`}
                >
                  Shorts
                </span>
              </div>

              {/* 3. Global Create Button (+) per Rules 9-10 (52x52dp circle, FLYNK Blue, opens Create Bottom Sheet) */}
              <div className="flex flex-col items-center -mt-3.5">
                <button
                  type="button"
                  onClick={() => setIsUniversalCreateOpen(true)}
                  title="Create (Flick, Full Video, Frame, Moment, Inventory)"
                  className="w-[52px] h-[52px] rounded-full bg-[#326BFF] hover:bg-[#2558E8] border-2 border-[#101217] text-white flex items-center justify-center shadow-[0_0_22px_rgba(50,107,255,0.6)] active:scale-95 transition-all cursor-pointer"
                  style={{ width: '52px', height: '52px' }}
                >
                  <Plus className="w-6 h-6 stroke-[3]" />
                </button>
              </div>

              {/* 4. Creator Shop */}
              <div className="flex flex-col items-center gap-1">
                <SquircleIcon
                  icon={ShoppingBag}
                  active={activeTab === 'shop'}
                  variant={isBlueTheme ? 'blue' : 'red'}
                  size="md"
                  onClick={() => setActiveTab('shop')}
                  title="Shop"
                />
                <span
                  className={`text-[10px] ${
                    activeTab === 'shop' ? 'text-red-400 font-bold' : 'text-neutral-400'
                  }`}
                >
                  Shop
                </span>
              </div>

              {/* 5. Direct Messages / Chat with Red Notification Badge */}
              <div className="flex flex-col items-center gap-1">
                <div className="relative">
                  <SquircleIcon
                    icon={MessageSquare}
                    active={activeTab === 'chat'}
                    variant={isBlueTheme ? 'blue' : 'red'}
                    size="md"
                    onClick={() => setActiveTab('chat')}
                    title="Chat"
                  />
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center border border-black shadow-[0_0_8px_rgba(239,68,68,0.7)] pointer-events-none">
                    1
                  </span>
                </div>
                <span
                  className={`text-[10px] ${
                    activeTab === 'chat' ? 'text-red-400 font-bold' : 'text-neutral-400'
                  }`}
                >
                  Chat
                </span>
              </div>

              {/* 6. Creator Profile / Auth */}
              <div className="flex flex-col items-center gap-1">
                <SquircleIcon
                  icon={UserIcon}
                  active={activeTab === 'profile' || isProfileModalOpen}
                  variant={isBlueTheme ? 'blue' : 'dual'}
                  size="md"
                  onClick={() => {
                    setActiveStoreCreator(currentUser);
                    setActiveTab('profile');
                  }}
                  title="Profile"
                />
                <span
                  className={`text-[10px] ${
                    activeTab === 'profile' || isProfileModalOpen
                      ? isBlueTheme
                        ? 'text-[#38bdf8] font-bold'
                        : 'text-rose-400 font-bold'
                      : 'text-neutral-400'
                  }`}
                >
                  Profile
                </span>
              </div>
            </nav>
          </div>
        </div>
      </main>

      {/* SIGNATURE MORPHING PORTAL TRANSITION */}
      <PortalTransition
        isActive={isPortalActive}
        onComplete={handlePortalComplete}
        title={portalTargetVideo?.title}
        creatorName={portalTargetVideo?.creator.handle}
        duration={portalTargetVideo?.durationFormatted}
      />

      {/* PRODUCT DETAIL MODAL (Rule 149 Strict Sequencing) */}
      <ProductDetailModal
        product={activeProduct}
        allProducts={productsList}
        isOwner={activeProduct ? activeProduct.sellerId === currentUser.id : false}
        onClose={() => setActiveProduct(null)}
        onAddToCart={(product, size, color) => {
          handleAddToCart(product, size, color);
          setActiveProduct(null);
        }}
        onBuyNow={(product, size, color) => {
          handleBuyNow(product, size, color);
        }}
        onSelectProduct={(p) => setActiveProduct(p)}
        onOpenSellerProfile={() => {
          if (activeProduct) {
            const seller =
              Object.values(CREATORS).find(
                (c) => c.id === activeProduct.sellerId
              ) || CURRENT_USER;
            setActiveStoreCreator(seller);
            setActiveProduct(null);
            setActiveTab('profile');
          }
        }}
        onPromoteProduct={handleOpenPromoteProduct}
      />

      {/* CART & ESCROW CHECKOUT MODAL */}
      <CartAndCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        currentUser={CURRENT_USER}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onOrderCreated={handleOrderCreated}
      />

      {/* SHIPMENT & ESCROW TRACKER MODAL */}
      <OrdersTrackerModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={ordersList}
        onSimulateNextStep={handleSimulateCourierStep}
      />

      {/* ENCRYPTED MESSAGING DRAWER */}
      <MessagingDrawer
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        conversations={conversationsList}
        currentUser={CURRENT_USER}
        onSelectProduct={(p) => setActiveProduct(p)}
        onAddToCart={(p) => handleAddToCart(p)}
      />

      {/* CREATOR STUDIO MODAL (Short-to-Full upload, 1-Click Connect, Collaboration, Privacy & Copyright Verification) */}
      <CreatorStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        currentUser={currentUser}
        existingLongVideos={longVideosList}
        existingShorts={shortsList}
        products={productsList}
        allCreators={Object.values(CREATORS)}
        seriesList={seriesList}
        onPublishShort={handlePublishNewShort}
        onPublishLongVideo={handlePublishNewLongVideo}
        onDeleteVideo={handleDeleteVideo}
        onTogglePrivacy={handleTogglePrivacy}
        onConnectShortToLong={handleConnectShortToLong}
        onCreateSeries={handleCreateSeries}
        onUpdateSeries={handleUpdateSeries}
        onDeleteSeries={handleDeleteSeries}
      />

      {/* DMCA COPYRIGHT TAKEDOWN & DISPUTE REPORTING MODAL */}
      <CopyrightReportModal
        isOpen={!!reportingCopyrightVideo}
        onClose={() => setReportingCopyrightVideo(null)}
        video={reportingCopyrightVideo}
        currentUser={currentUser}
        onReportSubmitted={handleCopyrightReportSubmitted}
      />

      {/* FEED COMMENTS DRAWER (Uploader Moderation & Bad Comments Filter) */}
      <CommentsDrawer
        isOpen={isFeedCommentsOpen}
        onClose={() => setIsFeedCommentsOpen(false)}
        videoTitle={feedCommentsMeta.title}
        commentsCount={feedCommentsMeta.commentsCount}
        currentUser={currentUser}
        uploaderId={feedCommentsMeta.uploaderId}
      />

      {/* ANALYTICS STUDIO MODAL with Creator Earnings & Escrow */}
      <AnalyticsDashboardModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        currentUser={currentUser}
        featuredVideo={longVideosList[0]}
        onExtractShortFromMoment={() => {
          setIsAnalyticsOpen(false);
          setIsStudioOpen(true);
        }}
        onShowToast={showToast}
      />

      {/* AUTHENTICATION MODAL (Matching Image 1 Login & Sign Up UI) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authInitialMode}
        onLoginSuccess={(user, message) => {
          setCurrentUser(user);
          showToast(message);
        }}
      />

      {/* USER PROFILE & SETTINGS MODAL */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
        isCurrentUser={true}
        products={productsList.filter(
          (p) =>
            p.sellerId === currentUser.id ||
            p.sellerHandle === currentUser.handle ||
            p.sellerName === currentUser.name
        )}
        shorts={shortsList.filter((s) => s.creatorId === currentUser.id)}
        longVideos={longVideosList.filter((v) => v.creatorId === currentUser.id)}
        series={seriesList}
        activeMoments={MOCK_MOMENTS}
        onOpenStudio={() => setIsStudioOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenStore={() => {
          setActiveStoreCreator(currentUser);
          setActiveTab('shop');
        }}
        onOpenEarnings={() => setIsAnalyticsOpen(true)}
        onOpenAuth={() => {
          setAuthInitialMode('login');
          setIsAuthOpen(true);
        }}
        onUpdateUser={(updated) => setCurrentUser(updated)}
        onSelectProduct={(p) => setActiveProduct(p)}
        onAddToCart={(p) => handleAddToCart(p)}
        onSelectShort={(s) => {
          const idx = shortsList.findIndex((item) => item.id === s.id);
          if (idx > -1) setCurrentShortIndex(idx);
          setActiveTab('shorts');
        }}
        onSelectLongVideo={(lv) => {
          setActiveLongVideo(lv);
          setActiveTab('long');
        }}
        onStartChat={(creator) => {
          setIsMessagesOpen(true);
        }}
        onOpenBooking={(name, handle, sector, spec) => {
          handleOpenBooking(name, handle, sector, spec);
        }}
        onOpenSingTogether={() => {
          setIsSingTogetherOpen(true);
        }}
      />

      {/* 10-VERTICAL UNIFIED ECOSYSTEM SEARCH (Section 43) */}
      <UnifiedSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        shorts={shortsList}
        longVideos={longVideosList}
        products={productsList}
        places={MOCK_PLACES}
        onSelectShort={(s) => {
          const idx = shortsList.findIndex((item) => item.id === s.id);
          if (idx > -1) setCurrentShortIndex(idx);
          setActiveTab('shorts');
        }}
        onSelectLongVideo={(lv) => {
          setActiveLongVideo(lv);
          setActiveTab('long');
        }}
        onSelectProduct={(p) => setActiveProduct(p)}
        onSelectPlace={(place) => {
          setSelectedPlace(place);
          setIsPlacePageOpen(true);
        }}
        onSelectCreator={(creator) => {
          setActiveStoreCreator(creator);
          setActiveTab('profile');
        }}
        onOpenBooking={handleOpenBooking}
      />

      {/* UNIVERSAL FLYNK IDENTITY CARD MODAL (Compact Profile Sheet on Tap) */}
      <UniversalIdentityCardModal
        isOpen={isIdentityCardOpen}
        onClose={() => setIsIdentityCardOpen(false)}
        user={identityCardUser}
        flicks={shortsList.filter(
          (s) =>
            s.creatorId === identityCardUser.id ||
            s.creator?.id === identityCardUser.id ||
            s.creator?.handle === identityCardUser.handle
        )}
        longVideos={longVideosList.filter(
          (v) =>
            v.creatorId === identityCardUser.id ||
            v.creator?.id === identityCardUser.id ||
            v.creator?.handle === identityCardUser.handle
        )}
        isFollowing={false}
        onToggleFollow={() => showToast(`Updated follow status for ${identityCardUser.name}`)}
        onStartMessage={() => {
          setIsIdentityCardOpen(false);
          setIsMessagesOpen(true);
        }}
        onSelectFlick={(flick) => {
          setIsIdentityCardOpen(false);
          const idx = shortsList.findIndex((item) => item.id === flick.id);
          if (idx > -1) setCurrentShortIndex(idx);
          setActiveTab('shorts');
        }}
        onSelectLongVideo={(lv) => {
          setIsIdentityCardOpen(false);
          setActiveLongVideo(lv);
          setActiveTab('long');
        }}
        onOpenFullProfile={() => {
          setIsIdentityCardOpen(false);
          setActiveStoreCreator(identityCardUser);
          setActiveTab('profile');
        }}
        onOpenBooking={(name, handle) => {
          setIsIdentityCardOpen(false);
          handleOpenBooking(name, handle);
        }}
        onSelectAlsoEntity={(entity) => {
          setIsIdentityCardOpen(false);
          showToast(`Opening ${entity.name} on FLYNK`);
        }}
      />

      {/* UNIVERSAL LOCATION & PLACES ENGINE MODAL (Sections 35-42, 102) */}
      <PlacePageModal
        isOpen={isPlacePageOpen}
        onClose={() => setIsPlacePageOpen(false)}
        place={selectedPlace}
        flicks={shortsList}
        longVideos={longVideosList}
        onSelectFlick={(s) => {
          const idx = shortsList.findIndex((item) => item.id === s.id);
          if (idx > -1) setCurrentShortIndex(idx);
          setActiveTab('shorts');
        }}
        onSelectLongVideo={(lv) => {
          setActiveLongVideo(lv);
          setActiveTab('long');
        }}
        onOpenBusinessProfile={(bizId) => {
          const found = availableContexts.find((c) => c.id === bizId);
          if (found) {
            handleSwitchContext(found);
            setActiveTab('profile');
          }
        }}
      />

      {/* UNIVERSAL REUSABLE BOOKING / APPOINTMENT ENGINE MODAL (Section 52) */}
      <UniversalBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        targetName={bookingTarget.targetName}
        targetHandle={bookingTarget.targetHandle}
        targetAvatar={bookingTarget.targetAvatar}
        sector={bookingTarget.sector}
        specialization={bookingTarget.specialization}
        customServiceTitle={bookingTarget.serviceTitle}
        onBookingConfirmed={(apt) => {
          showToast(`Confirmed ${apt.serviceName} (#${apt.id})`);
        }}
      />

      {/* INTERACTIVE PITCH DECK PRESENTATION MODAL */}
      <PitchDeckModal
        isOpen={isPitchDeckOpen}
        onClose={() => setIsPitchDeckOpen(false)}
      />

      {/* MACBOOK AIR M4 SETUP GUIDE MODAL */}
      <MacM4SetupGuideModal
        isOpen={isMacGuideOpen}
        onClose={() => setIsMacGuideOpen(false)}
      />

      {/* MULTI-IDENTITY ACCOUNT SWITCHER MODAL (Rules 2, 3, 4) */}
      <AccountSwitcherModal
        isOpen={isAccountSwitcherOpen}
        onClose={() => setIsAccountSwitcherOpen(false)}
        availableContexts={availableContexts}
        activeContextId={activeContext.id}
        onSwitchContext={handleSwitchContext}
        onAddNewEntity={(newCtx) => {
          setAvailableContexts((prev) => [...prev, newCtx]);
          showToast(`Configured new identity: ${newCtx.name}`);
        }}
        onToggleStorePause={(ctxId, isPaused) => {
          setAvailableContexts((prev) =>
            prev.map((c) => (c.id === ctxId ? { ...c, isStorePaused: isPaused } : c))
          );
          showToast(isPaused ? 'Store paused' : 'Store is live & open');
        }}
      />

      {/* DYNAMIC UNIVERSAL CREATE ACTION MODAL (Rules 20, 21) */}
      <UniversalCreateModal
        isOpen={isUniversalCreateOpen}
        onClose={() => setIsUniversalCreateOpen(false)}
        activeContext={activeContext}
        onSelectAction={handleSelectCreateAction}
      />

      {/* VERIFIED BUSINESS PHYSICAL LOCATION MODAL (Rule 13) */}
      <BusinessLocationModal
        isOpen={isBusinessLocationOpen}
        onClose={() => setIsBusinessLocationOpen(false)}
        location={activeContext.businessLocation || INITIAL_CONTEXTS[2].businessLocation!}
      />

      {/* BRAND WEBPAGE BUILDER & PREVIEW MODAL (Rules 14, 15) */}
      <BusinessWebsiteModal
        isOpen={isBusinessWebsiteOpen}
        onClose={() => setIsBusinessWebsiteOpen(false)}
        businessName={activeContext.name}
        businessHandle={activeContext.handle}
      />

      {/* SING TOGETHER LIVE STUDIO MODAL (Rules 24, 25) */}
      <SingTogetherModal
        isOpen={isSingTogetherOpen}
        onClose={() => setIsSingTogetherOpen(false)}
        activeContext={activeContext}
        onPublishPerformance={(perf) => {
          showToast(`Performance "${perf.title}" published!`);
          setIsStudioOpen(true);
        }}
      />

      {/* SAVE TO MULTI-PURPOSE COLLECTION MODAL (Rule 14) */}
      <SaveToCollectionModal
        isOpen={isSaveToCollectionOpen}
        onClose={() => {
          setIsSaveToCollectionOpen(false);
          setItemToSave(null);
        }}
        item={itemToSave}
        collections={collectionsList}
        onSaveToCollection={(colId: string, item: CollectionItem) => {
          setCollectionsList((prev) =>
            prev.map((col) => {
              if (col.id === colId) {
                const alreadyExists = col.items.some((i) => i.id === item.id);
                if (alreadyExists) return col;
                return {
                  ...col,
                  items: [item, ...col.items],
                  itemCount: col.items.length + 1,
                  coverImage: item.imageUrl || col.coverImage,
                };
              }
              return col;
            })
          );
          showToast(`Saved to "${collectionsList.find((c) => c.id === colId)?.name || 'Collection'}"`);
        }}
        onCreateCollection={(name: string, isPublic: boolean, emoji?: string) => {
          const newId = `col_${Date.now()}`;
          const newCol: Collection = {
            id: newId,
            name,
            emoji: emoji || '📁',
            isPublic: Boolean(isPublic),
            createdAt: 'Just now',
            updatedAt: 'Just now',
            itemCount: itemToSave ? 1 : 0,
            coverImage: itemToSave?.imageUrl,
            items: itemToSave
              ? [
                  {
                    id: `ci_${Date.now()}`,
                    itemId: itemToSave.id,
                    itemType: itemToSave.itemType,
                    title: itemToSave.title,
                    subtitle: itemToSave.subtitle,
                    imageUrl: itemToSave.imageUrl,
                    addedAt: 'Just now',
                  },
                ]
              : [],
          };
          setCollectionsList([newCol, ...collectionsList]);
          showToast(`Created collection "${name}"`);
          return newId;
        }}
      />

      {/* UNIVERSAL LEAD INBOX MODAL (Rule 20) */}
      <LeadInboxModal
        isOpen={isLeadInboxOpen}
        onClose={() => setIsLeadInboxOpen(false)}
        leads={leadsList}
        onUpdateLeadStatus={(leadId: string, status: any) => {
          setLeadsList((prev) =>
            prev.map((l) => (l.id === leadId ? { ...l, status, unread: false } : l))
          );
          showToast(`Lead status updated to ${status.toUpperCase()}`);
        }}
        onStartMessageWithClient={(lead: UniversalLead) => {
          setIsLeadInboxOpen(false);
          setIsMessagesOpen(true);
          showToast(`Opening direct thread with ${lead.clientName}`);
        }}
      />

      {/* CREATOR & BUSINESS DASHBOARD HOME MODAL (Rule 22) */}
      <CreatorBusinessDashboardModal
        isOpen={isCreatorBusinessDashboardOpen}
        onClose={() => setIsCreatorBusinessDashboardOpen(false)}
        activeContext={activeContext}
        leadsCount={leadsList.length}
        ordersCount={ordersList.length}
        onOpenLeads={() => {
          setIsCreatorBusinessDashboardOpen(false);
          setIsLeadInboxOpen(true);
        }}
        onOpenStudio={() => {
          setIsCreatorBusinessDashboardOpen(false);
          setIsStudioOpen(true);
        }}
        onOpenOrders={() => {
          setIsCreatorBusinessDashboardOpen(false);
          setIsOrdersOpen(true);
        }}
        onOpenAnalytics={() => {
          setIsCreatorBusinessDashboardOpen(false);
          setIsAnalyticsOpen(true);
        }}
        onOpenStore={() => {
          setIsCreatorBusinessDashboardOpen(false);
          setActiveTab('shop');
        }}
        onOpenMessages={() => {
          setIsCreatorBusinessDashboardOpen(false);
          setIsMessagesOpen(true);
        }}
      />

      {/* REQUEST PROJECT QUOTE MODAL (Professional Work Engine) */}
      {quoteTargetPro && (
        <RequestQuoteModal
          isOpen={isRequestQuoteOpen}
          onClose={() => {
            setIsRequestQuoteOpen(false);
            setQuoteTargetPro(null);
          }}
          targetPro={quoteTargetPro}
          currentUser={currentUser}
          onSubmitQuote={handleQuoteSubmitted}
        />
      )}

      {/* SELF-SERVICE PAID PRODUCT PROMOTION MODAL (Rules 99-121, 155-159) */}
      {productToPromote && (
        <PromoteProductModal
          isOpen={isPromoteOpen}
          onClose={() => {
            setIsPromoteOpen(false);
            setProductToPromote(null);
          }}
          product={productToPromote}
          onCampaignCreated={(camp) => {
            showToast(`Campaign ${camp.planName} activated for ₹${camp.budgetRupees}`);
          }}
        />
      )}

      {/* GLOBAL PERSISTENT STICKY CHAT BUTTON (Rules 1-8, 191) */}
      <FloatingStickyChatButton
        activeContext={activeContext}
        unreadCount={2}
        activeTab={activeTab}
        isFlickFullscreen={activeTab === 'shorts'}
        isMomentViewerOpen={false}
        isFullVideoFullscreen={false}
        isCreateModalOpen={isUniversalCreateOpen || isStudioOpen}
        isCheckoutOpen={isCartOpen}
        onOpenInbox={(mode) => {
          if (mode === 'shop' || mode === 'business' || mode === 'professional') {
            setIsLeadInboxOpen(true);
          } else {
            setIsMessagesOpen(true);
          }
        }}
      />

      {/* FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-16 inset-x-4 z-50 flex justify-center pointer-events-none">
          <div className="px-4 py-2.5 rounded-2xl bg-neutral-900 border border-rose-500/40 text-white font-bold text-xs shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in slide-in-from-bottom duration-200">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
