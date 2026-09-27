import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Clock,
  ShoppingBag,
  Briefcase,
  Building2,
  Package,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  ChevronRight,
  Plus,
  Compass,
  Film,
  Play,
  IndianRupee,
} from 'lucide-react';
import { User, Product, LongVideo, ShortVideo, UniversalLead } from '../../types';

interface CreatorBusinessDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: User;
  activeContext?: any;
  leadsCount?: number;
  ordersCount?: number;
  onOpenStudio?: () => void;
  onOpenStore?: () => void;
  onOpenLeadInbox?: () => void;
  onOpenLeads?: () => void;
  onOpenOrders?: () => void;
  onOpenAnalytics?: () => void;
  onOpenMessages?: () => void;
  onSelectLongVideo?: (video: LongVideo) => void;
  onSelectShort?: (short: ShortVideo) => void;
  longVideos?: LongVideo[];
  shorts?: ShortVideo[];
  leads?: UniversalLead[];
}

export const CreatorBusinessDashboardModal: React.FC<CreatorBusinessDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  activeContext,
  leadsCount,
  ordersCount,
  onOpenStudio,
  onOpenStore,
  onOpenLeadInbox,
  onOpenLeads,
  onOpenOrders,
  onOpenAnalytics,
  onOpenMessages,
  onSelectLongVideo,
  onSelectShort,
  longVideos = [],
  shorts = [],
  leads = [],
}) => {
  const user = currentUser || {
    id: activeContext?.id || 'ctx_user',
    name: activeContext?.name || 'Creator & Business Partner',
    handle: activeContext?.handle || '@partner',
    avatar: activeContext?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    role: activeContext?.mode === 'shop' || activeContext?.mode === 'business' ? 'business' : 'creator',
  };

  const initialRole =
    activeContext?.mode === 'shop'
      ? 'shop'
      : activeContext?.mode === 'professional'
      ? 'professional'
      : user.role === 'business'
      ? 'shop'
      : 'creator';

  const [dashboardRole, setDashboardRole] = useState<'creator' | 'shop' | 'professional'>(initialRole);

  const leadsAction = onOpenLeads || onOpenLeadInbox;

  // Profile Completeness Checklist
  const [checklist, setChecklist] = useState([
    { id: 'logo', label: 'Profile avatar & high-res cover added', done: true },
    { id: 'location', label: 'Verified location & neighborhood set', done: true },
    { id: 'products', label: 'First product or service catalog listed', done: true },
    { id: 'policy', label: 'Return policy & escrow terms published', done: false },
    { id: 'business_verify', label: 'Verify business / professional credential', done: false },
    { id: 'hours', label: 'Configure weekly availability & opening hours', done: false },
  ]);

  if (!isOpen) return null;

  const completedCount = checklist.filter((item) => item.done).length;
  const completenessPercentage = Math.round((completedCount / checklist.length) * 100);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const pendingLeadsCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-4xl bg-[#090307] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-red-600/30">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-white font-['Syne']">
                  FLYNK Business & Creator Home
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold">
                  DASHBOARD
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Simple, actionable metrics — zero bloat or enterprise confusion
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="px-6 py-2.5 bg-neutral-900/40 border-b border-neutral-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {[
              { id: 'creator', label: 'Creator Mode', icon: Sparkles },
              { id: 'shop', label: 'Shop / Brand Mode', icon: ShoppingBag },
              { id: 'professional', label: 'Professional Mode', icon: Briefcase },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = dashboardRole === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setDashboardRole(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-['Syne'] flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-neutral-400 hidden sm:block">
            Logged in as <strong className="text-white">{user.name}</strong>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="p-6 overflow-y-auto no-scrollbar space-y-6 flex-1 text-white">
          {/* Welcome greeting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-['Syne'] text-white">
                Good morning, {user.name.split(' ')[0]} ☀️
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                {dashboardRole === 'creator'
                  ? 'Your content reached 428.5K viewers in the past 28 days.'
                  : dashboardRole === 'shop'
                  ? '14 new customer orders received today. ₹48,200 held safely in escrow.'
                  : 'You have 5 new prospective client project inquiries waiting in your Lead Inbox.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onOpenStudio && (
                <button
                  onClick={onOpenStudio}
                  className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-red-500" />
                  <span>Publish Flick</span>
                </button>
              )}

              {onOpenLeadInbox && (
                <button
                  onClick={onOpenLeadInbox}
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-['Syne'] flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Open Lead Inbox ({pendingLeadsCount})</span>
                </button>
              )}
            </div>
          </div>

          {/* Section: Profile Completeness Checklist */}
          <div className="p-4 sm:p-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white font-['Syne']">
                    Your {dashboardRole === 'shop' ? 'Shop' : dashboardRole === 'professional' ? 'Professional' : 'Creator'} Profile is {completenessPercentage}% complete
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold">
                    {completedCount} / {checklist.length} Done
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Complete profiles receive up to 4.2x higher discovery in Nearby search and booking conversions
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${completenessPercentage}%` }}
              />
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    item.done
                      ? 'bg-neutral-900/80 border-neutral-800 text-neutral-300'
                      : 'bg-neutral-900/30 border-neutral-800/60 text-neutral-400 hover:text-white hover:border-red-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs min-w-0">
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                        item.done
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'border-neutral-700 bg-neutral-800'
                      }`}
                    >
                      {item.done && <CheckCircle2 className="w-3 h-3" />}
                    </div>
                    <span className={`truncate ${item.done ? 'line-through opacity-70' : ''}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                    {item.done ? 'Done' : 'Pending'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Mode-Specific Metric Cards */}
          {dashboardRole === 'creator' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">28-Day Views</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">
                    428.5K
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                    +18.4% vs last month
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Followers</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">
                    14.2K
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                    +3,240 new followers
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Watch Time</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">
                    18.4K <span className="text-xs font-normal text-neutral-400">hrs</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">74% average retention</div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Creator Earnings</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                    ₹1,42,800
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                    Direct Escrow Payout
                  </div>
                </div>
              </div>

              {/* Action items */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-['Syne']">New Comments</div>
                    <div className="text-sm font-extrabold text-rose-400 font-mono mt-0.5">
                      12 Pending Reply
                    </div>
                  </div>
                  <MessageSquare className="w-5 h-5 text-neutral-500" />
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-['Syne']">Collab Requests</div>
                    <div className="text-sm font-extrabold text-purple-400 font-mono mt-0.5">
                      2 Brand Inquiries
                    </div>
                  </div>
                  <Sparkles className="w-5 h-5 text-neutral-500" />
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-['Syne']">Direct Messages</div>
                    <div className="text-sm font-extrabold text-blue-400 font-mono mt-0.5">
                      5 Unread Threads
                    </div>
                  </div>
                  <Users className="w-5 h-5 text-neutral-500" />
                </div>
              </div>

              {/* Recent Content Showcase */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white font-['Syne']">Recent Content Performance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {longVideos.slice(0, 2).map((vid) => (
                    <div
                      key={vid.id}
                      onClick={() => onSelectLongVideo && onSelectLongVideo(vid)}
                      className="p-3 rounded-2xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 flex items-center gap-3 cursor-pointer transition-all"
                    >
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-24 aspect-video rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-white truncate">{vid.title}</div>
                        <div className="text-[11px] text-neutral-400 mt-1 flex items-center gap-2 font-mono">
                          <span>{vid.viewsCount.toLocaleString()} views</span>
                          <span>•</span>
                          <span className="text-emerald-400">
                            {vid.likesCount.toLocaleString()} likes
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {dashboardRole === 'shop' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Today's Orders</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">14</div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">All Escrow Held</div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Today's Revenue</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                    ₹48,200
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">+12% vs yesterday</div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Pending Packing</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono mt-1">
                    6 Orders
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">Due for pickup today</div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Low Stock Alerts</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-rose-400 font-mono mt-1">
                    2 Items
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">Size M & L Trench</div>
                </div>
              </div>

              {/* Store CTAs */}
              <div className="flex items-center gap-3">
                {onOpenStore && (
                  <button
                    onClick={onOpenStore}
                    className="flex-1 py-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    <span>View Public Storefront</span>
                  </button>
                )}

                {onOpenOrders && (
                  <button
                    onClick={onOpenOrders}
                    className="flex-1 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Package className="w-4 h-4" />
                    <span>Manage Dispatch & Escrow Tracking</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {dashboardRole === 'professional' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">New Leads</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                    5
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">Awaiting your response</div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Active Bookings</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">3</div>
                  <div className="text-[10px] text-neutral-400 mt-1">Scheduled this week</div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Quote Requests</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-purple-400 font-mono mt-1">
                    2
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1">Est. value ₹95,000</div>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                  <div className="text-[10px] font-mono text-neutral-400 uppercase">Profile Views</div>
                  <div className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1">
                    1.2K
                  </div>
                  <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                    +34% from Nearby Explore
                  </div>
                </div>
              </div>

              {/* Lead preview card */}
              <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-white font-['Syne']">
                    Incoming Pipeline Snapshot
                  </h3>
                  <button
                    onClick={onOpenLeadInbox}
                    className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all {leads.length} leads</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  {leads.slice(0, 3).map((lead) => (
                    <div
                      key={lead.id}
                      onClick={onOpenLeadInbox}
                      className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-3 cursor-pointer hover:border-red-500/40 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-xs text-white truncate">{lead.title}</div>
                        <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                          {lead.clientName} • {lead.dateOrDeadline}
                        </div>
                      </div>
                      {lead.budgetOrFee && (
                        <span className="text-xs font-mono font-bold text-emerald-400 shrink-0">
                          {lead.budgetOrFee}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
