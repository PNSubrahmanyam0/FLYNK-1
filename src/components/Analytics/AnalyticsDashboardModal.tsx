import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  BarChart3,
  Flame,
  Sparkles,
  Users,
  ShieldCheck,
  ShoppingBag,
  ArrowUpRight,
  Clock,
  Film,
  DollarSign,
} from 'lucide-react';
import { LongVideo, User } from '../../types';
import { CreatorEarningsSection } from './CreatorEarningsSection';
import { SquircleIcon } from '../Common/SquircleIcon';

interface AnalyticsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  featuredVideo: LongVideo;
  onExtractShortFromMoment: () => void;
  onShowToast?: (msg: string) => void;
}

export const AnalyticsDashboardModal: React.FC<AnalyticsDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  featuredVideo,
  onExtractShortFromMoment,
  onShowToast,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<LongVideo>(featuredVideo);
  const [activeTab, setActiveTab] = useState<'earnings' | 'content' | 'store'>('earnings');
  const [internalToast, setInternalToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToast = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    } else {
      setInternalToast(msg);
      setTimeout(() => setInternalToast(null), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header with Squircle Icon */}
        <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SquircleIcon
              icon={TrendingUp}
              variant="purple"
              size="sm"
            />
            <div>
              <h2 className="font-bold text-white text-base">Creator Intelligence & Earnings</h2>
              <p className="text-[11px] text-neutral-400">
                Escrow Settlement Payouts, Heatmaps & Short-to-Full Metrics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/80 px-4 sm:px-5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('earnings')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'earnings'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Creator Earnings</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'content'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Content & Heatmap AI</span>
          </button>

          <button
            onClick={() => setActiveTab('store')}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'store'
                ? 'border-rose-500 text-rose-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Storefront Performance</span>
          </button>
        </div>

        {/* Internal Toast */}
        {internalToast && (
          <div className="bg-purple-600 text-white text-xs py-1.5 px-4 text-center font-bold">
            {internalToast}
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* TAB 1: CREATOR EARNINGS */}
          {activeTab === 'earnings' && (
            <CreatorEarningsSection
              currentUser={currentUser}
              onShowToast={handleToast}
            />
          )}

          {/* TAB 2: CONTENT & HEATMAP AI */}
          {activeTab === 'content' && (
            <>
              {/* PRIMARY SIGNATURE METRIC: SHORT-TO-FULL CONVERSION */}
              <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950/50 via-purple-950/40 to-neutral-900 border border-rose-500/40 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    Signature Metric: Short-to-Full Conversion
                  </span>
                  <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-mono font-bold">
                    +4.2% vs Industry
                  </span>
                </div>

                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                    16.4%
                  </span>
                  <span className="text-xs text-neutral-300">
                    of trailer viewers swiped directly into the full video
                  </span>
                </div>

                {/* Conversion Flow Breakdown */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-rose-500/20 text-center">
                  <div className="bg-black/40 rounded-xl p-2">
                    <span className="text-sm font-bold text-white font-mono">124.5k</span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">Short Impressions</span>
                  </div>
                  <div className="bg-black/40 rounded-xl p-2">
                    <span className="text-sm font-bold text-rose-400 font-mono">20,418</span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">Full Story Opens</span>
                  </div>
                  <div className="bg-black/40 rounded-xl p-2">
                    <span className="text-sm font-bold text-emerald-400 font-mono">9m 40s</span>
                    <span className="text-[10px] text-neutral-400 block mt-0.5">Avg Watch Time</span>
                  </div>
                </div>
              </div>

              {/* SIGNATURE USP: TIMESTAMP ENGAGEMENT HEATMAP */}
              <div className="p-4 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-400" />
                      Timestamp Retention Heatmap Analysis
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      Video: {selectedVideo.title} ({selectedVideo.durationFormatted})
                    </p>
                  </div>
                </div>

                {/* Visual Heatmap Bars & Peak Detection */}
                <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800/80 space-y-2">
                  <div className="space-y-1.5">
                    {(selectedVideo.heatmap ?? []).map((pt, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs font-mono">
                        <span className="w-12 text-neutral-400 text-[11px] shrink-0">
                          {pt.timestampFormatted}
                        </span>
                        <div className="flex-1 h-3 bg-neutral-800 rounded-full overflow-hidden relative">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pt.retentionPct >= 95
                                ? 'bg-gradient-to-r from-amber-400 to-rose-500'
                                : 'bg-rose-500/70'
                            }`}
                            style={{ width: `${pt.retentionPct}%` }}
                          />
                        </div>
                        <span
                          className={`w-12 text-right text-[11px] font-bold ${
                            pt.retentionPct >= 95 ? 'text-amber-400' : 'text-neutral-300'
                          }`}
                        >
                          {pt.retentionPct}%
                          {pt.retentionPct >= 95 && ' 🔥'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* High Engagement Moment Callout */}
                  {selectedVideo.peakEngagementMoment && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                          <Flame className="w-3.5 h-3.5" />
                          <span>
                            Peak Moment: {selectedVideo.peakEngagementMoment.startFormatted} -{' '}
                            {selectedVideo.peakEngagementMoment.endFormatted} (
                            {selectedVideo.peakEngagementMoment.retention}% Retention)
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-300 mt-0.5">
                          "{selectedVideo.peakEngagementMoment.label}"
                        </p>
                      </div>

                      <button
                        onClick={onExtractShortFromMoment}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex items-center gap-1 shadow-md transition-all shrink-0 cursor-pointer"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Create Short from this Scene</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Demographics & Discovery Origin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                    Discovery Funnel
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Non-Followers (Discovered via Short)</span>
                      <span className="text-white font-bold">68%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: '68%' }} />
                    </div>

                    <div className="flex justify-between text-neutral-400 pt-1">
                      <span>Existing Followers</span>
                      <span className="text-white font-bold">32%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: '32%' }} />
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                  <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                    Audience Demographics
                  </span>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>Age 18–24</span>
                      <span className="text-white font-mono">34%</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Age 25–34</span>
                      <span className="text-white font-mono">42%</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Top Country</span>
                      <span className="text-white font-mono">India (84%) • USA (8%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 3: STOREFRONT PERFORMANCE */}
          {activeTab === 'store' && (
            <div className="space-y-4">
              {/* Revenue & Escrow Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                  <span className="text-[10px] text-neutral-400 block">Gross Merch Value</span>
                  <span className="text-lg font-black text-white font-mono mt-0.5 block">
                    ₹1,48,200
                  </span>
                  <span className="text-[10px] text-emerald-400">+18% this month</span>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                  <span className="text-[10px] text-neutral-400 block">Orders Delivered</span>
                  <span className="text-lg font-black text-white font-mono mt-0.5 block">
                    412
                  </span>
                  <span className="text-[10px] text-emerald-400">98.4% On-Time</span>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                  <span className="text-[10px] text-amber-400 block font-semibold">
                    Escrow In Transit
                  </span>
                  <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block">
                    ₹14,200
                  </span>
                  <span className="text-[10px] text-neutral-400">Releases upon delivery</span>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                  <span className="text-[10px] text-emerald-400 block font-semibold">
                    Settled to Bank
                  </span>
                  <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">
                    ₹1,34,000
                  </span>
                  <span className="text-[10px] text-neutral-400">Via Razorpay Route</span>
                </div>
              </div>

              {/* Escrow Release explanation */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Settlement Security Architecture</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Every order is protected by FLYNK's dual-verification escrow protocol. When courier webhooks report confirmed delivery without dispute, settlement is automatically cleared into your creator account within 24 hours.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
