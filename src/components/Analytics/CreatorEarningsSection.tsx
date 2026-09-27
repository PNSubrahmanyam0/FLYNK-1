import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  DollarSign,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Sparkles,
  ChevronRight,
  Download,
  Building,
  Lock,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  Check,
  Copy,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { User } from '../../types';

interface CreatorEarningsSectionProps {
  currentUser: User;
  onShowToast: (message: string) => void;
}

export type PayoutTabType = 'released' | 'pending' | 'on_hold';

interface ReleasedPayoutItem {
  id: string;
  orderNumber: string;
  productName: string;
  buyerName: string;
  amount: number;
  settledDate: string;
  utrNumber: string;
  bankAccount: string;
  courier: string;
}

interface PendingEscrowItem {
  id: string;
  orderNumber: string;
  productName: string;
  buyerName: string;
  amount: number;
  deliveryStatus: 'in_transit' | 'out_for_delivery' | 'delivered_verifying' | 'ready_for_release';
  courier: string;
  awbNumber: string;
  estimatedRelease: string;
  hoursRemaining: number;
}

interface OnHoldPayoutItem {
  id: string;
  orderNumber: string;
  productName: string;
  buyerName: string;
  amount: number;
  holdReason: string;
  holdCategory: 'exchange_request' | 'address_issue' | 'buyer_dispute';
  flaggedDate: string;
  courier: string;
  awbNumber: string;
}

export const CreatorEarningsSection: React.FC<CreatorEarningsSectionProps> = ({
  currentUser,
  onShowToast,
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [breakdownTab, setBreakdownTab] = useState<PayoutTabType>('pending');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // 1. Released Payouts
  const [releasedPayouts, setReleasedPayouts] = useState<ReleasedPayoutItem[]>([
    {
      id: 'rel_1',
      orderNumber: '#FL-9032',
      productName: 'Minimalist Tech Trench',
      buyerName: 'Rohan Verma',
      amount: 6800,
      settledDate: '22 Sep 2026',
      utrNumber: 'HDFC0029104829',
      bankAccount: 'HDFC Bank •••• 4092',
      courier: 'Bluedart Express',
    },
    {
      id: 'rel_2',
      orderNumber: '#FL-9021',
      productName: 'Cyberpunk Cargo Trousers',
      buyerName: 'Sneha Kapoor',
      amount: 3499,
      settledDate: '20 Sep 2026',
      utrNumber: 'HDFC0028491024',
      bankAccount: 'HDFC Bank •••• 4092',
      courier: 'Delhivery Surface',
    },
    {
      id: 'rel_3',
      orderNumber: '#FL-9015',
      productName: 'Cinematic Soundscapes Vol. 1',
      buyerName: 'Amit Joshi',
      amount: 1850,
      settledDate: '18 Sep 2026',
      utrNumber: 'HDFC0027391039',
      bankAccount: 'HDFC Bank •••• 4092',
      courier: 'Digital Instant Signoff',
    },
    {
      id: 'rel_4',
      orderNumber: '#FL-9008',
      productName: 'Heavyweight Boxy Drop Tee',
      buyerName: 'Meera Nair',
      amount: 1450,
      settledDate: '16 Sep 2026',
      utrNumber: 'HDFC0026491823',
      bankAccount: 'HDFC Bank •••• 4092',
      courier: 'Shadowfax Prime',
    },
  ]);

  // 2. Pending Escrow Items
  const [pendingPayouts, setPendingPayouts] = useState<PendingEscrowItem[]>([
    {
      id: 'esc_1',
      orderNumber: '#FL-9082',
      productName: 'Obsidian Oversized Tech Bomber',
      buyerName: 'Vikram Mehta',
      amount: 4499,
      deliveryStatus: 'out_for_delivery',
      courier: 'Bluedart Express',
      awbNumber: 'BLU-88219401',
      estimatedRelease: 'Release in ~4 hrs (Post Doorstep OTP)',
      hoursRemaining: 4,
    },
    {
      id: 'esc_2',
      orderNumber: '#FL-9076',
      productName: 'Raw Indigo Selvedge Denim',
      buyerName: 'Ananya Roy',
      amount: 3200,
      deliveryStatus: 'in_transit',
      courier: 'Delhivery Surface',
      awbNumber: 'DEL-99120485',
      estimatedRelease: 'Release in ~22 hrs',
      hoursRemaining: 22,
    },
    {
      id: 'esc_3',
      orderNumber: '#FL-9065',
      productName: 'Minimalist Cyber Silk Gown',
      buyerName: 'Rohit Shenoy',
      amount: 5999,
      deliveryStatus: 'ready_for_release',
      courier: 'Shadowfax SameDay',
      awbNumber: 'SFX-11204938',
      estimatedRelease: 'Ready for Immediate Clearance',
      hoursRemaining: 0,
    },
    {
      id: 'esc_4',
      orderNumber: '#FL-9051',
      productName: 'Cinematic Soundscapes & LUT Bundle',
      buyerName: 'Pooja Iyer',
      amount: 1850,
      deliveryStatus: 'ready_for_release',
      courier: 'Digital Instant Signoff',
      awbNumber: 'DIG-00293481',
      estimatedRelease: 'Ready for Immediate Clearance',
      hoursRemaining: 0,
    },
    {
      id: 'esc_5',
      orderNumber: '#FL-9044',
      productName: 'Heavyweight Drop-Shoulder Tee',
      buyerName: 'Karthik Rao',
      amount: 1450,
      deliveryStatus: 'in_transit',
      courier: 'XpressBees Priority',
      awbNumber: 'XPB-44019283',
      estimatedRelease: 'Release in ~36 hrs',
      hoursRemaining: 36,
    },
  ]);

  // 3. On-Hold Items
  const [onHoldPayouts, setOnHoldPayouts] = useState<OnHoldPayoutItem[]>([
    {
      id: 'hold_1',
      orderNumber: '#FL-8994',
      productName: 'Cyber Matrix Utility Vest',
      buyerName: 'Tarun Mathur',
      amount: 4899,
      holdReason: 'Size exchange requested by customer (L -> XL). Awaiting return scan.',
      holdCategory: 'exchange_request',
      flaggedDate: '23 Sep 2026',
      courier: 'Bluedart Reverse Pick',
      awbNumber: 'BLU-REV-10928',
    },
    {
      id: 'hold_2',
      orderNumber: '#FL-8982',
      productName: 'Acid Wash Relaxed Hoodie',
      buyerName: 'Divya Patel',
      amount: 2800,
      holdReason: 'Courier delivery re-attempt requested (Customer uncontactable at doorstep).',
      holdCategory: 'address_issue',
      flaggedDate: '22 Sep 2026',
      courier: 'Delhivery Surface',
      awbNumber: 'DEL-RETRY-4482',
    },
  ]);

  const [settledBalance, setSettledBalance] = useState(134000);

  // Aggregates
  const totalReleased = releasedPayouts.reduce((sum, item) => sum + item.amount, 0);
  const totalPending = pendingPayouts.reduce((sum, item) => sum + item.amount, 0);
  const totalOnHold = onHoldPayouts.reduce((sum, item) => sum + item.amount, 0);

  // Revenue metrics by time range
  const metricsData = {
    '7d': {
      grossRevenue: 42800,
      netEarnings: 39376,
      rpm: 146.2,
      conversionRate: 5.1,
      ordersCount: 38,
      aov: 2840,
    },
    '30d': {
      grossRevenue: 148200,
      netEarnings: 136344,
      rpm: 142.8,
      conversionRate: 4.8,
      ordersCount: 142,
      aov: 2850,
    },
    '90d': {
      grossRevenue: 385000,
      netEarnings: 354200,
      rpm: 139.5,
      conversionRate: 4.6,
      ordersCount: 360,
      aov: 2790,
    },
    all: {
      grossRevenue: 482450,
      netEarnings: 443854,
      rpm: 141.0,
      conversionRate: 4.7,
      ordersCount: 456,
      aov: 2810,
    },
  }[timeRange];

  const handleWithdrawAllSettled = () => {
    if (settledBalance <= 0) {
      onShowToast('No settled balance available for withdrawal right now.');
      return;
    }

    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      const amountWithdrawn = settledBalance;
      setSettledBalance(0);
      onShowToast(
        `₹${amountWithdrawn.toLocaleString('en-IN')} initiated to HDFC Bank (•••• 4092) via Instant IMPS!`
      );
    }, 900);
  };

  const handleAcceleratePayout = (item: PendingEscrowItem) => {
    setPendingPayouts((prev) => prev.filter((p) => p.id !== item.id));
    const newReleased: ReleasedPayoutItem = {
      id: `rel_${Date.now()}`,
      orderNumber: item.orderNumber,
      productName: item.productName,
      buyerName: item.buyerName,
      amount: item.amount,
      settledDate: 'Just Now',
      utrNumber: `HDFC${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      bankAccount: 'HDFC Bank •••• 4092',
      courier: item.courier,
    };
    setReleasedPayouts((prev) => [newReleased, ...prev]);
    setSettledBalance((prev) => prev + item.amount);
    onShowToast(`Delivery confirmed for ${item.orderNumber}! Payout ₹${item.amount.toLocaleString('en-IN')} released to bank.`);
  };

  const handleResolveHold = (item: OnHoldPayoutItem) => {
    setOnHoldPayouts((prev) => prev.filter((h) => h.id !== item.id));
    const newPending: PendingEscrowItem = {
      id: `esc_${Date.now()}`,
      orderNumber: item.orderNumber,
      productName: item.productName,
      buyerName: item.buyerName,
      amount: item.amount,
      deliveryStatus: 'out_for_delivery',
      courier: item.courier,
      awbNumber: item.awbNumber,
      estimatedRelease: 'Release in ~6 hrs (Post Clearance)',
      hoursRemaining: 6,
    };
    setPendingPayouts((prev) => [newPending, ...prev]);
    onShowToast(`Dispute resolved for ${item.orderNumber}! Moved back to active Escrow.`);
  };

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    onShowToast(`Settlement UTR copied: ${utr}`);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Time Range Selector & Top Bar Contract */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-neutral-800">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Creator Earnings & Settlement Hub
          </h3>
          <p className="text-[11px] text-neutral-400">
            Escrow-guaranteed payouts, Short-to-Commerce RPM & direct bank settlements
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
          {(['7d', '30d', '90d', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                timeRange === r
                  ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-sm font-mono'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {r === 'all' ? 'All Time' : r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 4 PRIMARY METRIC CARDS (TOTAL REVENUE & ESCROW SUMMARY) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. Total Gross Revenue */}
        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 text-xs mb-1.5">
            <span className="font-semibold">Gross Merch Volume</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
              +24.5%
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">
            ₹{metricsData.grossRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2 flex items-center justify-between pt-2 border-t border-neutral-900">
            <span>Net Creator Cut (92%)</span>
            <span className="text-white font-mono font-bold">
              ₹{metricsData.netEarnings.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* 2. Escrow-Protected Pending Payouts */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/20 via-neutral-950 to-neutral-950 border border-amber-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between text-amber-300 text-xs mb-1.5">
            <span className="font-semibold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Pending Escrow
            </span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
              {pendingPayouts.length} orders
            </span>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono tracking-tight">
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2 flex items-center justify-between pt-2 border-t border-amber-500/15">
            <span>Dual-Verified Custody</span>
            <span className="text-amber-300 font-mono text-[10px]">Auto-releases 24h</span>
          </div>
        </div>

        {/* 3. Settled To Bank Available */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/20 via-neutral-950 to-neutral-950 border border-emerald-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-300 text-xs mb-1.5">
            <span className="font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Released / Settled
            </span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
              Cleared
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
            ₹{settledBalance.toLocaleString('en-IN')}
          </div>
          <button
            onClick={handleWithdrawAllSettled}
            disabled={isWithdrawing || settledBalance === 0}
            className="w-full mt-2 py-1 px-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            {isWithdrawing ? (
              <span>Initiating IMPS...</span>
            ) : (
              <>
                <Building className="w-3 h-3" />
                <span>Withdraw to Bank</span>
              </>
            )}
          </button>
        </div>

        {/* 4. On-Hold Payouts Overview */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/20 via-neutral-950 to-neutral-950 border border-rose-500/30 relative overflow-hidden">
          <div className="flex items-center justify-between text-rose-300 text-xs mb-1.5">
            <span className="font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              On-Hold Payouts
            </span>
            <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono font-bold">
              {onHoldPayouts.length} issues
            </span>
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono tracking-tight">
            ₹{totalOnHold.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2 flex items-center justify-between pt-2 border-t border-rose-500/15">
            <span>Customer Disputed</span>
            <span className="text-rose-300 text-[10px] font-semibold">Resolution Desk</span>
          </div>
        </div>
      </div>

      {/* PERFORMANCE METRICS DEEP-DIVE BANNER */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#180a1c] via-[#120718] to-neutral-950 border border-purple-500/30 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Ecosystem Performance Benchmarks
              </h4>
              <p className="text-[11px] text-neutral-400">
                How your content converts video attention directly into verified orders
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <span className="text-neutral-400">Avg Settlement Speed: </span>
            <span className="text-emerald-400 font-bold font-mono">28.4 hours</span>
          </div>
        </div>

        {/* 3 Metric Pills with Typographic Precision */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <div className="p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800">
            <div className="text-[11px] text-neutral-400">Commerce RPM (per 1k Views)</div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">₹{metricsData.rpm}</div>
            <div className="text-[10px] text-emerald-400 mt-1">3.1x higher than standard ad rev</div>
          </div>

          <div className="p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800">
            <div className="text-[11px] text-neutral-400">Escrow Dispute Rate</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">0.28%</div>
            <div className="text-[10px] text-neutral-400 mt-1">Industry standard is 2.4%</div>
          </div>

          <div className="p-3 bg-neutral-900/80 rounded-2xl border border-neutral-800">
            <div className="text-[11px] text-neutral-400">Trailer-to-Purchase Conversion</div>
            <div className="text-lg font-bold text-purple-400 font-mono mt-0.5">
              {metricsData.conversionRate}%
            </div>
            <div className="text-[10px] text-purple-300 mt-1">Avg Order: ₹{metricsData.aov}</div>
          </div>
        </div>
      </div>

      {/* SIGNATURE BREAKDOWN TOGGLE: RELEASED vs PENDING ESCROW vs ON-HOLD */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-purple-400" />
              Payout Settlement Breakdown
            </h4>
            <p className="text-[11px] text-neutral-400">
              Track the exact transit lifecycle of customer funds across all order checkpoints
            </p>
          </div>

          {/* 3-WAY BREAKDOWN TOGGLE BUTTONS */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900/90 rounded-2xl border border-neutral-800 text-xs w-full sm:w-auto overflow-x-auto">
            {/* 1. RELEASED TOGGLE */}
            <button
              onClick={() => setBreakdownTab('released')}
              className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                breakdownTab === 'released'
                  ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 border border-emerald-400/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Released</span>
              <span className="font-mono text-[10px] bg-black/40 px-1.5 py-0.2 rounded text-emerald-300 font-normal">
                {releasedPayouts.length}
              </span>
            </button>

            {/* 2. PENDING ESCROW TOGGLE */}
            <button
              onClick={() => setBreakdownTab('pending')}
              className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                breakdownTab === 'pending'
                  ? 'bg-gradient-to-r from-amber-600/30 to-orange-600/30 border border-amber-400/50 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Pending Escrow</span>
              <span className="font-mono text-[10px] bg-black/40 px-1.5 py-0.2 rounded text-amber-300 font-normal">
                {pendingPayouts.length}
              </span>
            </button>

            {/* 3. ON-HOLD TOGGLE */}
            <button
              onClick={() => setBreakdownTab('on_hold')}
              className={`flex-1 sm:flex-initial py-1.5 px-3 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                breakdownTab === 'on_hold'
                  ? 'bg-gradient-to-r from-rose-600/30 to-red-600/30 border border-rose-400/50 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>On-Hold</span>
              <span className="font-mono text-[10px] bg-black/40 px-1.5 py-0.2 rounded text-rose-300 font-normal">
                {onHoldPayouts.length}
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1 CONTENT: RELEASED PAYOUTS */}
        {breakdownTab === 'released' && (
          <div className="space-y-2 animate-in fade-in duration-150">
            <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Cleared to Bank Account: Funds transferred directly via Razorpay Route IMPS
                </span>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 font-bold">
                Total Cleared: ₹{totalReleased.toLocaleString('en-IN')}
              </div>
            </div>

            {releasedPayouts.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{item.orderNumber}</span>
                      <span className="text-neutral-500">·</span>
                      <span className="text-neutral-200 truncate max-w-[240px]">
                        {item.productName}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-neutral-400">
                      <span>Buyer: {item.buyerName}</span>
                      <span>·</span>
                      <span>Settled: {item.settledDate}</span>
                      <span>·</span>
                      <span className="text-neutral-400">{item.courier}</span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-2 text-[11px]">
                      <span className="text-neutral-400">UTR:</span>
                      <span className="font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {item.utrNumber}
                      </span>
                      <button
                        onClick={() => handleCopyUtr(item.utrNumber)}
                        className="text-neutral-400 hover:text-white p-0.5"
                        title="Copy UTR number"
                      >
                        {copiedUtr === item.utrNumber ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-900">
                  <div className="text-left sm:text-right">
                    <div className="font-mono font-black text-emerald-400 text-base">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">Released to Bank</div>
                  </div>

                  <button
                    onClick={() =>
                      onShowToast(
                        `GST Settlement Receipt generated for ${item.orderNumber} (UTR: ${item.utrNumber})`
                      )
                    }
                    className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  >
                    <Download className="w-3 h-3" />
                    <span>Receipt</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 2 CONTENT: PENDING ESCROW PAYOUTS */}
        {breakdownTab === 'pending' && (
          <div className="space-y-2 animate-in fade-in duration-150">
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Dual-Verification Custody: Released instantly upon courier doorstep OTP delivery
                </span>
              </div>
              <div className="text-[11px] font-mono text-amber-400 font-bold">
                Total in Escrow: ₹{totalPending.toLocaleString('en-IN')}
              </div>
            </div>

            {pendingPayouts.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      item.deliveryStatus === 'ready_for_release'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}
                  >
                    {item.deliveryStatus === 'ready_for_release' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Package className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white">{item.orderNumber}</span>
                      <span className="text-neutral-500">·</span>
                      <span className="text-neutral-300 truncate max-w-[200px]">
                        {item.productName}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-neutral-400">
                      <span>Buyer: {item.buyerName}</span>
                      <span>·</span>
                      <span className="font-mono text-neutral-500">{item.awbNumber}</span>
                      <span>·</span>
                      <span className="text-neutral-400">{item.courier}</span>
                    </div>

                    <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span
                        className={
                          item.deliveryStatus === 'ready_for_release'
                            ? 'text-emerald-400 font-semibold'
                            : 'text-amber-300'
                        }
                      >
                        {item.estimatedRelease}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-900">
                  <div className="text-left sm:text-right">
                    <div className="font-mono font-black text-amber-400 text-base">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-neutral-500 font-mono">Protected Escrow</div>
                  </div>

                  {item.deliveryStatus === 'ready_for_release' ? (
                    <button
                      onClick={() => handleAcceleratePayout(item)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
                    >
                      Release to Bank
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAcceleratePayout(item)}
                      className="px-2.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                      title="Simulate courier delivery confirmation webhook"
                    >
                      <RefreshCw className="w-3 h-3 text-neutral-400" />
                      <span>Verify Delivery</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3 CONTENT: ON-HOLD PAYOUTS */}
        {breakdownTab === 'on_hold' && (
          <div className="space-y-2 animate-in fade-in duration-150">
            <div className="p-3 rounded-2xl bg-rose-950/25 border border-rose-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-rose-300">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  Disputed or Retried Deliveries: Payout held until buyer signoff or return package scan
                </span>
              </div>
              <div className="text-[11px] font-mono text-rose-400 font-bold">
                Total on Hold: ₹{totalOnHold.toLocaleString('en-IN')}
              </div>
            </div>

            {onHoldPayouts.length === 0 ? (
              <div className="p-8 text-center bg-neutral-950 rounded-2xl border border-neutral-800 text-neutral-400 text-xs">
                No orders on hold! All transactions are moving through escrow smoothly.
              </div>
            ) : (
              onHoldPayouts.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-neutral-950 border border-rose-500/30 hover:border-rose-500/50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{item.orderNumber}</span>
                        <span className="text-neutral-500">·</span>
                        <span className="text-neutral-200 truncate max-w-[200px]">
                          {item.productName}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {item.holdCategory === 'exchange_request'
                            ? 'Exchange Requested'
                            : 'Delivery Address Issue'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-neutral-400">
                        <span>Buyer: {item.buyerName}</span>
                        <span>·</span>
                        <span>Flagged: {item.flaggedDate}</span>
                        <span>·</span>
                        <span className="font-mono text-neutral-500">{item.awbNumber}</span>
                      </div>

                      <div className="mt-1.5 p-2 rounded-xl bg-rose-950/20 border border-rose-500/20 text-[11px] text-rose-200">
                        <span className="font-semibold text-rose-300">Hold Reason: </span>
                        <span>{item.holdReason}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-900">
                    <div className="text-left sm:text-right">
                      <div className="font-mono font-black text-rose-400 text-base">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">Temporarily Frozen</div>
                    </div>

                    <button
                      onClick={() => handleResolveHold(item)}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Resolve & Resume</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* TOP PERFORMING REVENUE CONTENT */}
      <div className="p-4 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
          Top Video Revenue Drivers
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800">
            <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider">
              #1 Top Earner
            </span>
            <h5 className="font-bold text-white text-xs mt-1 truncate">
              Urban Cyberpunk Techwear Drop #4
            </h5>
            <div className="mt-2 flex items-baseline justify-between text-xs">
              <span className="text-neutral-400">124.5k Views</span>
              <span className="font-mono font-bold text-emerald-400">₹74,200 Sales</span>
            </div>
            <div className="mt-1 text-[10px] text-neutral-500">Linked: Obsidian Tech Bomber</div>
          </div>

          <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800">
            <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wider">
              #2 Top Earner
            </span>
            <h5 className="font-bold text-white text-xs mt-1 truncate">
              Neon Tokyo Rain: The Full Cut
            </h5>
            <div className="mt-2 flex items-baseline justify-between text-xs">
              <span className="text-neutral-400">98.2k Views</span>
              <span className="font-mono font-bold text-emerald-400">₹48,900 Sales</span>
            </div>
            <div className="mt-1 text-[10px] text-neutral-500">Linked: Cyber Silk Gown</div>
          </div>

          <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800">
            <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">
              #3 Top Earner
            </span>
            <h5 className="font-bold text-white text-xs mt-1 truncate">
              Minimalist Studio Presets & LUTs
            </h5>
            <div className="mt-2 flex items-baseline justify-between text-xs">
              <span className="text-neutral-400">64.0k Views</span>
              <span className="font-mono font-bold text-emerald-400">₹25,100 Sales</span>
            </div>
            <div className="mt-1 text-[10px] text-neutral-500">Linked: Creator Sound & LUT Pack</div>
          </div>
        </div>
      </div>
    </div>
  );
};
