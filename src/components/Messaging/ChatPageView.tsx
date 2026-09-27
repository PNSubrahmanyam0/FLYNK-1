import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Shield,
  ShieldCheck,
  Clock,
  Send,
  ShoppingBag,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCheck,
  Lock,
  Plus,
  X,
  ExternalLink,
  Smile,
  Package,
  Image as ImageIcon,
  Settings,
  Paperclip,
} from 'lucide-react';
import { User, Product, Conversation, Message } from '../../types';
import { MOCK_PRODUCTS, CREATORS } from '../../data/mockData';

interface ChatPageViewProps {
  currentUser: User;
  onBackToHome?: () => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  initialConversationId?: string;
  isDrawerMode?: boolean;
}

export const ChatPageView: React.FC<ChatPageViewProps> = ({
  currentUser,
  onBackToHome,
  onSelectProduct,
  onAddToCart,
  initialConversationId = 'conv_aria',
  isDrawerMode = false,
}) => {
  // Master list of conversations initialized exactly as seen in reference image
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv_aria',
      participant: CREATORS.aria,
      lastMessage: 'Your trench coat is on the flight to Bengaluru right now! ✈️',
      lastMessageTime: '10m ago',
      unreadCount: 1,
      isOnline: true,
      inboxCategory: 'orders',
      messages: [
        {
          id: 'msg_1',
          conversationId: 'conv_aria',
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: 'Hey Aria! Loved the 30-sec trailer of the Matrix Trench. Is Size M suitable for 5ft 10in?',
          timestamp: '11:10 AM',
          isEphemeral24h: false,
          isMine: true,
        },
        {
          id: 'msg_2',
          conversationId: 'conv_aria',
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          product: MOCK_PRODUCTS[0], // Aria Oversized Matrix Trench Coat
          timestamp: '11:11 AM',
          isEphemeral24h: false,
          isMine: true,
        },
        {
          id: 'msg_3',
          conversationId: 'conv_aria',
          senderId: CREATORS.aria.id,
          senderName: CREATORS.aria.name,
          senderAvatar: CREATORS.aria.avatar,
          text: 'Hi Devin! Yes, Size M gives that tailored streetwear drape with room for a hoodie underneath.',
          timestamp: '11:18 AM',
          isEphemeral24h: false,
          isMine: false,
        },
        {
          id: 'msg_4',
          conversationId: 'conv_aria',
          senderId: CREATORS.aria.id,
          senderName: CREATORS.aria.name,
          senderAvatar: CREATORS.aria.avatar,
          text: 'Your trench coat is on the flight to Bengaluru right now! ✈️',
          timestamp: '10m ago',
          isEphemeral24h: false,
          isMine: false,
        },
      ],
    },
    {
      id: 'conv_nikhil',
      participant: {
        ...CREATORS.nikhil,
        name: 'Nikhil Sen',
      },
      lastMessage: "Let's do a collab short next month in...",
      lastMessageTime: '2h ago',
      unreadCount: 0,
      isOnline: true,
      inboxCategory: 'collaborations',
      messages: [
        {
          id: 'msg_n1',
          conversationId: 'conv_nikhil',
          senderId: CREATORS.nikhil.id,
          senderName: 'Nikhil Sen',
          senderAvatar: CREATORS.nikhil.avatar,
          text: 'Hey Devin! Loved the drone sequence you color graded.',
          timestamp: '1:45 PM',
          isEphemeral24h: true,
          expiresIn: '22h left',
          isMine: false,
        },
        {
          id: 'msg_n2',
          conversationId: 'conv_nikhil',
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: "Let's do a collab short next month in Himachal!",
          timestamp: '2h ago',
          isEphemeral24h: true,
          expiresIn: '22h left',
          isMine: true,
        },
      ],
    },
    {
      id: 'conv_dr_arjun',
      participant: {
        id: 'usr_dr_arjun',
        name: 'Dr. Arjun Reddy, MD',
        handle: 'drarjunclinic',
        avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
        role: 'business',
        verifiedCreator: true,
        verifiedSeller: true,
        followersCount: 38200,
        followingCount: 42,
        bio: 'Cardiologist & Preventative Wellness Consultant',
      },
      lastMessage: 'Appointment Confirmed: Tomorrow at 10:30 AM at Apollo Health City Suite 204.',
      lastMessageTime: '1h ago',
      unreadCount: 1,
      isOnline: true,
      inboxCategory: 'bookings',
      messages: [
        {
          id: 'msg_b1',
          conversationId: 'conv_dr_arjun',
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: 'Hello Dr. Arjun, confirming my in-person consultation for cardiac wellness evaluation.',
          timestamp: '11:00 AM',
          isEphemeral24h: false,
          isMine: true,
        },
        {
          id: 'msg_b2',
          conversationId: 'conv_dr_arjun',
          senderId: 'usr_dr_arjun',
          senderName: 'Dr. Arjun Reddy, MD',
          senderAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
          text: 'Appointment Confirmed: Tomorrow at 10:30 AM at Apollo Health City Suite 204. Please bring prior ECG reports.',
          timestamp: '1h ago',
          isEphemeral24h: false,
          isMine: false,
        },
      ],
    },
    {
      id: 'conv_kabir',
      participant: CREATORS.kabir,
      lastMessage: 'Pre-seasoned the tandoori cast iron...',
      lastMessageTime: '3h ago',
      unreadCount: 0,
      isOnline: true,
      inboxCategory: 'messages',
      messages: [
        {
          id: 'msg_k1',
          conversationId: 'conv_kabir',
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: 'Chef Kabir, what is the best oil for seasoning the cast iron pan?',
          timestamp: '10:00 AM',
          isEphemeral24h: false,
          isMine: true,
        },
        {
          id: 'msg_k2',
          conversationId: 'conv_kabir',
          senderId: CREATORS.kabir.id,
          senderName: CREATORS.kabir.name,
          senderAvatar: CREATORS.kabir.avatar,
          text: 'Pre-seasoned the tandoori cast iron with triple cold-pressed mustard oil. Ready to cook right away!',
          timestamp: '3h ago',
          isEphemeral24h: false,
          isMine: false,
        },
      ],
    },
    {
      id: 'conv_maya',
      participant: {
        ...CREATORS.maya,
        name: 'Maya Tech Labs',
      },
      lastMessage: 'Quote Request: 4K Commercial Grade & Edit ($1,200)',
      lastMessageTime: '1d ago',
      unreadCount: 0,
      isOnline: false,
      inboxCategory: 'business_enquiries',
      messages: [
        {
          id: 'msg_m1',
          conversationId: 'conv_maya',
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderAvatar: currentUser.avatar,
          text: 'Maya, I submitted a project quote request for the commercial promo video.',
          timestamp: 'Yesterday',
          isEphemeral24h: true,
          expiresIn: '16h left',
          isMine: true,
        },
        {
          id: 'msg_m2',
          conversationId: 'conv_maya',
          senderId: CREATORS.maya.id,
          senderName: 'Maya Tech Labs',
          senderAvatar: CREATORS.maya.avatar,
          text: 'Quote Request received! Sent the scope proposal for 4K color grading and delivery by next Friday.',
          timestamp: '1d ago',
          isEphemeral24h: true,
          expiresIn: '16h left',
          isMine: false,
        },
      ],
    },
  ]);

  const [activeConversationId, setActiveConversationId] = useState<string>(initialConversationId);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<
    'all' | 'messages' | 'orders' | 'bookings' | 'business_enquiries' | 'collaborations' | 'unread'
  >('all');
  const [inputText, setInputText] = useState('');
  const [isEphemeralMode, setIsEphemeralMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAttachDrawerOpen, setIsAttachDrawerOpen] = useState(false);
  const [simulatedCall, setSimulatedCall] = useState<{ type: 'audio' | 'video'; active: boolean } | null>(null);
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isTyping]);

  // Filter conversations with universal categories
  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.participant.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'unread') {
      return conv.unreadCount > 0;
    }
    if (filterTab === 'all') {
      return true;
    }
    return conv.inboxCategory === filterTab;
  });

  // Handle sending a message
  const handleSendMessage = (textToSend?: string, attachedProduct?: Product) => {
    const text = textToSend !== undefined ? textToSend : inputText.trim();
    if (!text && !attachedProduct) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: text || undefined,
      product: attachedProduct,
      timestamp: 'Just now',
      isEphemeral24h: isEphemeralMode,
      expiresIn: isEphemeralMode ? '24h left' : undefined,
      isMine: true,
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversation.id) {
          return {
            ...conv,
            lastMessage: text || (attachedProduct ? `Shared ${attachedProduct.title}` : 'Attachment'),
            lastMessageTime: 'Just now',
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      })
    );

    setInputText('');
    setIsAttachDrawerOpen(false);

    // Simulate realistic creator reply
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let replyText = `Thanks for messaging! Got your inquiry. All communication and purchases are protected with Flynk Escrow.`;

      if (activeConversation.participant.id === CREATORS.aria.id) {
        replyText = `Hey ${currentUser.name}! The size is in stock and your order is expedited with doorstep tracking. Let me know if you need anything else!`;
      } else if (activeConversation.participant.name.includes('Nikhil')) {
        replyText = `Sounds great! Let's lock in the location for the short film shoot.`;
      } else if (activeConversation.participant.id === CREATORS.kabir.id) {
        replyText = `The seasoning process is key! Enjoy the handcrafted tawa.`;
      }

      const creatorReply: Message = {
        id: `reply_${Date.now()}`,
        conversationId: activeConversation.id,
        senderId: activeConversation.participant.id,
        senderName: activeConversation.participant.name,
        senderAvatar: activeConversation.participant.avatar,
        text: replyText,
        timestamp: 'Just now',
        isEphemeral24h: isEphemeralMode,
        expiresIn: isEphemeralMode ? '24h left' : undefined,
        isMine: false,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConversation.id) {
            return {
              ...c,
              lastMessage: replyText,
              lastMessageTime: 'Just now',
              messages: [...c.messages, creatorReply],
            };
          }
          return c;
        })
      );
    }, 1200);
  };

  // Quick inquiry action chips (Matching image.png)
  const quickChips = [
    { label: '📦 Track my order', text: 'Can you check my shipment dispatch status?' },
    { label: '👗 Sizing guidance', text: 'Is this true to size or should I size up?' },
    { label: '👥 Collab request', text: 'Hey! Loved your recent short. Would love to collaborate!' },
    { label: '🛡️ Escrow safety', text: 'How does the Flynk buyer protection escrow work?' },
  ];

  return (
    <div
      className={`w-full h-full flex flex-col bg-[#030712] text-neutral-100 font-['Plus_Jakarta_Sans'] select-none overflow-hidden relative ${
        isDrawerMode ? 'rounded-t-[28px] sm:rounded-[32px]' : ''
      }`}
    >
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-16 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
          <div className="px-4 py-2 rounded-2xl bg-neutral-900/95 border border-sky-500/40 text-white text-xs font-bold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-in slide-in-from-top-2 duration-200">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Responsive Split Layout */}
      <div className="flex-1 flex w-full h-full overflow-hidden">
        {/* ================= LEFT COLUMN: CONVERSATION LIST (Matching image.png) ================= */}
        <aside
          className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-[#142236] bg-[#030816] shrink-0 ${
            mobileShowThread ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Top Header: Circular Back, Messages Title, Subtitle, Green Dot */}
          <div className="p-4 border-b border-[#142236] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (onBackToHome) onBackToHome();
                  else window.history.back();
                }}
                className="w-10 h-10 rounded-full bg-[#0a1424] hover:bg-[#102038] border border-[#1b2b44] text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                title="Back"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.2]" />
              </button>

              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight font-['Syne']">
                  Messages
                </h2>
                <div className="text-[11px] text-[#64748b] flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3 text-[#64748b]" />
                  <span>End-to-End Encrypted</span>
                </div>
              </div>
            </div>

            {/* Green glowing status dot */}
            <div
              className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
              title="Encrypted Relay Online"
            />
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-[#142236]/80 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search creators or messages..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#07101f] border border-[#182a44] rounded-xl text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#0b5cff] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Universal Inbox Category Tabs (Rule 20) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'messages', label: 'Messages' },
                { id: 'orders', label: 'Orders' },
                { id: 'bookings', label: 'Bookings' },
                { id: 'business_enquiries', label: 'Enquiries' },
                { id: 'collaborations', label: 'Collabs' },
                { id: 'unread', label: 'Unread' },
              ].map((tab) => {
                const count =
                  tab.id === 'all'
                    ? conversations.length
                    : tab.id === 'unread'
                    ? conversations.filter((c) => c.unreadCount > 0).length
                    : conversations.filter((c) => c.inboxCategory === tab.id).length;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilterTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                      filterTab === tab.id
                        ? 'bg-[#0b5cff] text-white shadow-[0_0_15px_rgba(11,92,255,0.45)]'
                        : 'bg-[#0a1324] border border-[#1b2b44] text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {count > 0 && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversations List Scrollable */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {filteredConversations.map((conv) => {
              const isActive = conv.id === activeConversation.id;

              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    setMobileShowThread(true);
                    if (conv.unreadCount > 0) {
                      setConversations((prev) =>
                        prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
                      );
                    }
                  }}
                  className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0d2244] to-[#081730] border border-[#1d4ed8]/60 shadow-[0_4px_25px_rgba(13,34,68,0.6)]'
                      : 'hover:bg-[#071124] border border-transparent'
                  }`}
                >
                  {/* Avatar with Online Green Dot */}
                  <div className="relative shrink-0">
                    <img
                      src={conv.participant.avatar}
                      alt={conv.participant.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#1b2b44]"
                    />
                    {conv.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#030816] shadow-[0_0_8px_#10b981]" />
                    )}
                  </div>

                  {/* Middle Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs font-bold text-white truncate font-['Syne']">
                          {conv.participant.name}
                        </span>
                        {conv.inboxCategory === 'orders' && (
                          <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shrink-0">
                            ORDER
                          </span>
                        )}
                        {conv.inboxCategory === 'bookings' && (
                          <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30 shrink-0">
                            BOOKING
                          </span>
                        )}
                        {conv.inboxCategory === 'business_enquiries' && (
                          <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 shrink-0">
                            QUOTE
                          </span>
                        )}
                        {conv.inboxCategory === 'collaborations' && (
                          <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30 shrink-0">
                            COLLAB
                          </span>
                        )}
                        <span className="w-3.5 h-3.5 rounded-full bg-[#0b5cff] text-white flex items-center justify-center text-[8px] font-bold shrink-0">
                          ✓
                        </span>
                      </div>
                      <span className="text-[10px] text-[#64748b] font-mono shrink-0 ml-1">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1">
                      <p className="text-[11px] text-[#94a3b8] truncate font-medium">
                        {conv.lastMessage}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {conv.id === 'conv_nikhil' || conv.id === 'conv_maya' ? (
                          <Clock className="w-3.5 h-3.5 text-[#38bdf8]" />
                        ) : null}
                        {conv.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-[#0b5cff] text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(11,92,255,0.6)]">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* User Status Bar at Bottom of Left Sidebar */}
          <div className="p-3 border-t border-[#142236] bg-[#050b18] flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center gap-2.5 truncate">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-[#1b2b44]"
              />
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Online • Private Mode</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => showToast('Chat privacy preferences opened')}
              className="p-1.5 rounded-lg hover:bg-white/10 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* ================= RIGHT COLUMN: ACTIVE CONVERSATION THREAD (Matching image.png) ================= */}
        <section
          className={`flex-1 flex flex-col h-full bg-[#030712] relative overflow-hidden ${
            !mobileShowThread ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Thread Header: Aria Vance, Online, 24h Pill, Call Buttons */}
          <header className="h-16 px-4 border-b border-[#142236] bg-[#030816]/95 backdrop-blur-xl flex items-center justify-between shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile Back Button */}
              <button
                onClick={() => setMobileShowThread(false)}
                className="md:hidden p-1.5 rounded-xl bg-[#0a1424] text-white hover:bg-[#102038]"
                title="Back to conversation list"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="relative shrink-0">
                <img
                  src={activeConversation.participant.avatar}
                  alt={activeConversation.participant.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#1d4ed8]/40"
                />
                {activeConversation.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#030816]" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white truncate font-['Syne']">
                    {activeConversation.participant.name}
                  </span>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#0b5cff] text-white flex items-center justify-center text-[8px] font-bold shrink-0">
                    ✓
                  </span>
                </div>

                <div className="text-[11px] text-[#64748b] flex items-center gap-1.5 font-mono">
                  <span>@{activeConversation.participant.handle}</span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: 24h Ephemeral Pill, Phone Call, Video Call */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setIsEphemeralMode(!isEphemeralMode);
                  showToast(isEphemeralMode ? '24h Ephemeral Mode turned OFF' : '24h Ephemeral Mode turned ON');
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isEphemeralMode
                    ? 'bg-[#0b5cff] text-white shadow-[0_0_12px_rgba(11,92,255,0.4)]'
                    : 'bg-[#081a33] border border-[#1d4ed8]/40 text-[#38bdf8] hover:bg-[#0d274c]'
                }`}
                title="24h Ephemeral Disappearing Messages"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>24h</span>
              </button>

              <button
                onClick={() => setSimulatedCall({ type: 'audio', active: true })}
                className="w-10 h-10 rounded-full bg-[#0a1628] hover:bg-[#10223d] border border-[#1b2b44] text-neutral-200 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title="Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSimulatedCall({ type: 'video', active: true })}
                className="w-10 h-10 rounded-full bg-[#0a1628] hover:bg-[#10223d] border border-[#1b2b44] text-neutral-200 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title="Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Active Call Overlay if open */}
          {simulatedCall && (
            <div className="absolute inset-x-0 top-16 z-30 p-4 bg-gradient-to-r from-[#0356C5]/90 via-[#0C1446]/95 to-[#02060E]/90 border-b border-[#38bdf8]/40 backdrop-blur-xl flex items-center justify-between animate-in slide-in-from-top-4 duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center animate-pulse">
                  {simulatedCall.type === 'video' ? (
                    <Video className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Phone className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    Encrypted {simulatedCall.type === 'video' ? 'Video' : 'Voice'} Call with{' '}
                    {activeConversation.participant.name}
                  </div>
                  <div className="text-[10px] text-emerald-300 font-mono">
                    Connected (00:14) • 256-Bit P2P Relay
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSimulatedCall(null)}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all cursor-pointer"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>End Call</span>
              </button>
            </div>
          )}

          {/* Messages Feed Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {/* End-to-End Encryption Banner */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#061022]/80 border border-[#182b46] text-center space-y-1.5 shadow-sm">
              <div className="flex items-center justify-center gap-1.5 text-xs text-[#94a3b8]">
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
                <span>Messages and calls are end-to-end encrypted.</span>
              </div>
              <p className="text-[11px] text-[#64748b] leading-relaxed">
                Nobody outside of this chat, not even the app, can read them. Purchases in chat are automatically escrow-protected.
              </p>
            </div>

            {/* Date Pill: Today */}
            <div className="flex justify-center my-2">
              <span className="px-3 py-1 rounded-full bg-[#0b172a] border border-[#1b2b44] text-[#94a3b8] text-xs font-medium">
                Today
              </span>
            </div>

            {/* Render Messages */}
            {activeConversation.messages.map((msg) => {
              const isMine = msg.isMine;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div
                    className={`flex items-end gap-2.5 max-w-[85%] sm:max-w-[70%] ${
                      isMine ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Aria's Avatar on received messages */}
                    {!isMine && (
                      <img
                        src={msg.senderAvatar || activeConversation.participant.avatar}
                        alt={msg.senderName}
                        className="w-8 h-8 rounded-full object-cover border border-[#1b2b44] shrink-0 mb-1"
                      />
                    )}

                    {/* PRODUCT CARD IN CHAT (Faithfully matches image.png) */}
                    {msg.product ? (
                      <div className="p-4 rounded-2xl bg-[#071324] border border-[#1d4ed8]/40 shadow-[0_4px_30px_rgba(11,92,255,0.25)] space-y-3.5 w-full max-w-md">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={msg.product.images[0]}
                            alt={msg.product.title}
                            className="w-16 h-16 rounded-xl object-cover border border-[#1b2b44] shrink-0 shadow-md"
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1">
                              <span>✓</span>
                              <span>ESCROW PROTECTED GEAR</span>
                            </span>
                            <h4
                              className="text-xs sm:text-sm font-bold text-white truncate font-['Syne']"
                              title={msg.product.title}
                            >
                              {msg.product.title}
                            </h4>
                            <div className="text-sm font-extrabold text-[#38bdf8] font-mono">
                              ₹{msg.product.price.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons: View Details & Buy with Escrow */}
                        <div className="flex items-center gap-2 pt-0.5">
                          {onSelectProduct && (
                            <button
                              onClick={() => onSelectProduct(msg.product!)}
                              className="flex-1 py-2 px-3 rounded-xl bg-[#091a33] hover:bg-[#0d274c] border border-[#1e3a66] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span>View Details</span>
                            </button>
                          )}

                          {onAddToCart && (
                            <button
                              onClick={() => {
                                onAddToCart(msg.product!);
                                showToast(`Added ${msg.product!.title.slice(0, 20)}... to Escrow Cart!`);
                              }}
                              className="flex-1 py-2 px-3 rounded-xl bg-[#0b5cff] hover:bg-[#004ee8] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(11,92,255,0.4)] transition-all cursor-pointer active:scale-95"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Buy with Escrow</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-1 text-[10px] font-mono text-[#64748b]">
                          <span>11:11 AM</span>
                          <CheckCheck className="w-3.5 h-3.5 text-[#38bdf8]" />
                        </div>
                      </div>
                    ) : (
                      /* STANDARD CHAT BUBBLE */
                      <div
                        className={`p-3.5 sm:p-4 rounded-2xl relative shadow-md leading-relaxed ${
                          isMine
                            ? 'bg-[#0b5cff] text-white rounded-tr-sm shadow-[0_4px_25px_rgba(11,92,255,0.3)]'
                            : 'bg-[#0b1628] text-neutral-100 rounded-tl-sm border border-[#1b2b44]'
                        }`}
                      >
                        <p className="text-xs sm:text-[13px]">{msg.text}</p>
                        <div
                          className={`flex items-center justify-end gap-1 text-[10px] font-mono mt-1 ${
                            isMine ? 'text-blue-100' : 'text-[#64748b]'
                          }`}
                        >
                          <span>{msg.timestamp}</span>
                          {isMine && <CheckCheck className="w-3.5 h-3.5 text-[#38bdf8]" />}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Realistic Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <img
                  src={activeConversation.participant.avatar}
                  alt={activeConversation.participant.name}
                  className="w-7 h-7 rounded-full object-cover border border-[#1b2b44] shrink-0"
                />
                <div className="px-3.5 py-2 rounded-2xl rounded-bl-none bg-[#0b1628] border border-[#1b2b44] flex items-center gap-1.5 text-xs text-[#94a3b8]">
                  <span className="text-[11px] font-semibold">
                    {activeConversation.participant.name} is typing
                  </span>
                  <span className="inline-flex gap-1 ml-1">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#0b5cff] animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#0b5cff] animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[#0b5cff] animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Chips Row (Above Input Bar) */}
          <div className="px-4 py-2 border-t border-[#142236]/80 bg-[#030816]/70 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.text)}
                className="px-3.5 py-1.5 rounded-full bg-[#0b172a] hover:bg-[#10223d] border border-[#1b2b44] text-neutral-200 text-xs font-medium whitespace-nowrap transition-all cursor-pointer active:scale-95 flex items-center gap-1.5 shrink-0"
              >
                {chip.label}
              </button>
            ))}

            <button
              onClick={() => showToast('More creator quick actions available')}
              className="w-7 h-7 rounded-full bg-[#0b172a] border border-[#1b2b44] text-neutral-400 hover:text-white flex items-center justify-center shrink-0 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Product Attachment Selector Drawer (When user taps +) */}
          {isAttachDrawerOpen && (
            <div className="p-3 border-t border-[#142236] bg-[#050b18]/95 backdrop-blur-xl animate-in slide-in-from-bottom-2 duration-150 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#38bdf8]" />
                  Attach Store Product to Chat
                </span>
                <button
                  onClick={() => setIsAttachDrawerOpen(false)}
                  className="text-neutral-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto">
                {MOCK_PRODUCTS.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSendMessage(undefined, prod)}
                    className="p-2 rounded-xl bg-[#081534] hover:bg-[#0356C5]/40 border border-[#2B5C92]/40 flex items-center gap-2 cursor-pointer transition-all group"
                  >
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-10 h-10 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-white truncate group-hover:text-[#38bdf8]">
                        {prod.title}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400">
                        ₹{prod.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message Input Toolbar: + button, Gallery button, Capsule input, Send button */}
          <footer className="p-3 md:p-4 border-t border-[#142236] bg-[#030816]/95 backdrop-blur-xl shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2.5"
            >
              {/* Circular + Attachment Button */}
              <button
                type="button"
                onClick={() => setIsAttachDrawerOpen(!isAttachDrawerOpen)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0a1526] hover:bg-[#10223d] border border-[#1e2f47] text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0"
                title="Attach Product / File"
              >
                <Plus className="w-5 h-5" />
              </button>

              {/* Circular Gallery Button */}
              <button
                type="button"
                onClick={() => showToast('Image attachment tool opened')}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0a1526] hover:bg-[#10223d] border border-[#1e2f47] text-neutral-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0"
                title="Attach Photo"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              {/* Main Text Input Capsule */}
              <div className="flex-1 relative flex items-center bg-[#060e1c] border border-[#1a2b44] rounded-full px-4 py-2 sm:py-2.5 focus-within:border-[#0b5cff] transition-all shadow-inner">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type an encrypted message..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-[#64748b] focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => setInputText((prev) => prev + ' ✈️🔥')}
                  className="text-[#64748b] hover:text-white p-1 text-sm transition-colors cursor-pointer shrink-0"
                  title="Emoji"
                >
                  <Smile className="w-4 h-4" />
                </button>
              </div>

              {/* Vibrant Circular Send Button */}
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0b5cff] hover:bg-[#004ee8] disabled:opacity-40 text-white flex items-center justify-center shadow-[0_0_20px_rgba(11,92,255,0.5)] active:scale-95 transition-all cursor-pointer shrink-0 disabled:cursor-not-allowed"
                title="Send Message"
              >
                <Send className="w-4 h-4 fill-white stroke-[2]" />
              </button>
            </form>
          </footer>
        </section>
      </div>
    </div>
  );
};
