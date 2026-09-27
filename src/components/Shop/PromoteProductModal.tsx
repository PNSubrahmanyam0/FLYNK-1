import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Eye,
  MessageSquare,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Info,
  DollarSign,
  BarChart2,
  Target,
  ArrowRight,
  Radio,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { Product } from '../../types';

export interface PromotionCampaign {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  planName: 'Starter' | 'Growth' | 'Boost';
  budgetRupees: number;
  durationDays: number;
  objective: 'views' | 'visits' | 'enquiries' | 'conversions';
  status: 'active' | 'pending_review' | 'completed' | 'paused';
  startedAt: string;
  expiresAt: string;
  spentRupees: number;
  impressions: number;
  uniqueReach: number;
  productViews: number;
  shopVisits: number;
  enquiries: number;
  conversions: number;
}

interface PromoteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onCampaignCreated?: (campaign: PromotionCampaign) => void;
}

export const PromoteProductModal: React.FC<PromoteProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onCampaignCreated,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'growth' | 'boost'>('growth');
  const [selectedObjective, setSelectedObjective] = useState<'views' | 'visits' | 'enquiries'>('views');
  const [audienceType, setAudienceType] = useState<'auto' | 'custom'>('auto');
  const [selectedCategory, setSelectedCategory] = useState<string>(product.category || 'Fashion');
  const [step, setStep] = useState<'config' | 'review' | 'success'>('config');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'dashboard'>('create');

  // Existing mock campaigns for this product/shop
  const [campaigns, setCampaigns] = useState<PromotionCampaign[]>([
    {
      id: 'camp_prior_01',
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
      planName: 'Starter',
      budgetRupees: 299,
      durationDays: 3,
      objective: 'views',
      status: 'completed',
      startedAt: '12 Sep 2026',
      expiresAt: '15 Sep 2026',
      spentRupees: 299,
      impressions: 3410,
      uniqueReach: 2890,
      productViews: 412,
      shopVisits: 148,
      enquiries: 24,
      conversions: 8,
    },
  ]);

  if (!isOpen) return null;

  // Rules 103 & 110: Configurable promotion plans (Starter ₹299, Growth ₹599, Boost ₹999)
  const PLANS = {
    starter: {
      name: 'Starter' as const,
      price: 299,
      duration: 3,
      estimatedReachMin: 1500,
      estimatedReachMax: 3500,
      estimatedViewsMin: 180,
      estimatedViewsMax: 420,
      badge: 'QUICK TEST',
      desc: '3-day pilot test in Category Explore and Search discovery placements',
    },
    growth: {
      name: 'Growth' as const,
      price: 599,
      duration: 5,
      estimatedReachMin: 4000,
      estimatedReachMax: 9000,
      estimatedViewsMin: 480,
      estimatedViewsMax: 1100,
      badge: 'RECOMMENDED',
      desc: '5-day balanced campaign across Similar Products and Feed commerce modules',
    },
    boost: {
      name: 'Boost' as const,
      price: 999,
      duration: 7,
      estimatedReachMin: 10000,
      estimatedReachMax: 25000,
      estimatedViewsMin: 1200,
      estimatedViewsMax: 3000,
      badge: 'MAXIMUM VISIBILITY',
      desc: '7-day premium distribution with top sponsored placement eligibility',
    },
  };

  const currentPlan = PLANS[selectedPlan];

  const handleLaunchCampaign = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const newCamp: PromotionCampaign = {
        id: `camp_${Date.now()}`,
        productId: product.id,
        productTitle: product.title,
        productImage: product.images[0] || '',
        planName: currentPlan.name,
        budgetRupees: currentPlan.price,
        durationDays: currentPlan.duration,
        objective: selectedObjective,
        status: 'active',
        startedAt: 'Just now',
        expiresAt: `In ${currentPlan.duration} days`,
        spentRupees: 0,
        impressions: 48,
        uniqueReach: 42,
        productViews: 6,
        shopVisits: 2,
        enquiries: 0,
        conversions: 0,
      };

      setCampaigns([newCamp, ...campaigns]);
      onCampaignCreated?.(newCamp);
      setIsProcessing(false);
      setStep('success');
    }, 900);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none font-['Plus_Jakarta_Sans']"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-xl max-h-[92vh] flex flex-col bg-[#101217] border border-[#292E38] rounded-t-[28px] sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#292E38] bg-[#181B22]/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#326BFF]/15 text-[#326BFF] flex items-center justify-center border border-[#326BFF]/30">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white font-['Syne']">
                FLYNK Product Promotion
              </h2>
              <p className="text-[11px] text-[#A7ADB8]">
                Self-service verified reach & discovery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher: Promote vs Performance Dashboard */}
            <div className="flex bg-[#101217] p-0.5 rounded-xl border border-[#292E38] text-[11px] font-bold">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('create');
                  setStep('config');
                }}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeTab === 'create'
                    ? 'bg-[#326BFF] text-white shadow-sm'
                    : 'text-[#A7ADB8] hover:text-white'
                }`}
              >
                Promote
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                  activeTab === 'dashboard'
                    ? 'bg-[#326BFF] text-white shadow-sm'
                    : 'text-[#A7ADB8] hover:text-white'
                }`}
              >
                <BarChart2 className="w-3 h-3" />
                <span>Dashboard ({campaigns.length})</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#181B22] text-[#A7ADB8] hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'dashboard' ? (
            /* ================= MARKETING & ANALYTICS DASHBOARD ================= */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Campaign History & Real-Time Performance
                </h3>
                <span className="text-[11px] text-[#22C55E] font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                  Live Attribution Active
                </span>
              </div>

              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="p-4 rounded-2xl bg-[#181B22] border border-[#292E38] space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={camp.productImage}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover border border-[#292E38]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white line-clamp-1">
                            {camp.productTitle}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                              camp.status === 'active'
                                ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40'
                                : 'bg-[#707681]/20 text-[#A7ADB8]'
                            }`}
                          >
                            {camp.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#A7ADB8] mt-0.5">
                          {camp.planName} Plan (₹{camp.budgetRupees}) • {camp.durationDays} Days • Started {camp.startedAt}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Grid (Rule 116 & 117) */}
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#292E38] text-center">
                    <div className="p-2 rounded-xl bg-[#101217]">
                      <div className="text-xs sm:text-sm font-bold text-white font-mono">
                        {camp.impressions.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#A7ADB8]">Impressions</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#101217]">
                      <div className="text-xs sm:text-sm font-bold text-white font-mono">
                        {camp.productViews.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#A7ADB8]">Views</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#101217]">
                      <div className="text-xs sm:text-sm font-bold text-[#326BFF] font-mono">
                        {camp.enquiries}
                      </div>
                      <div className="text-[10px] text-[#A7ADB8]">Enquiries</div>
                    </div>
                    <div className="p-2 rounded-xl bg-[#101217]">
                      <div className="text-xs sm:text-sm font-bold text-[#22C55E] font-mono">
                        {camp.conversions}
                      </div>
                      <div className="text-[10px] text-[#A7ADB8]">Orders</div>
                    </div>
                  </div>

                  {camp.status === 'completed' && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('create');
                        setStep('config');
                      }}
                      className="w-full py-2 rounded-xl bg-[#101217] hover:bg-[#20242E] text-white text-xs font-bold border border-[#292E38] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#326BFF]" />
                      <span>Promote Again</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : step === 'success' ? (
            /* ================= CAMPAIGN LAUNCHED CONFIRMATION ================= */
            <div className="py-6 text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 text-[#22C55E] border-2 border-[#22C55E]/40 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(34,197,94,0.3)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-['Syne']">
                  Campaign Activated & Live
                </h3>
                <p className="text-xs text-[#A7ADB8] max-w-sm mx-auto mt-1">
                  Your product is now entering eligible sponsored placements across Similar Products, Search, and Category Explore.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#181B22] border border-[#292E38] text-left text-xs space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span className="text-[#A7ADB8]">Plan:</span>
                  <span className="font-bold text-white">{currentPlan.name} (₹{currentPlan.price})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7ADB8]">Duration:</span>
                  <span className="font-bold text-white">{currentPlan.duration} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7ADB8]">Estimated Reach:</span>
                  <span className="font-bold text-[#326BFF]">
                    {currentPlan.estimatedReachMin.toLocaleString()} – {currentPlan.estimatedReachMax.toLocaleString()} users
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A7ADB8]">Label:</span>
                  <span className="font-mono text-[#F59E0B]">Promoted / Sponsored</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="w-full max-w-sm py-3 rounded-2xl bg-[#326BFF] hover:bg-[#2558E8] text-white font-bold text-xs shadow-lg cursor-pointer"
              >
                View Live Performance in Dashboard
              </button>
            </div>
          ) : (
            /* ================= CAMPAIGN BUILDER (Rules 101-115) ================= */
            <>
              {/* Product Preview Card */}
              <div className="p-3.5 rounded-2xl bg-[#181B22] border border-[#292E38] flex items-center gap-3">
                <img
                  src={product.images[0]}
                  alt=""
                  className="w-14 h-14 rounded-xl object-cover border border-[#292E38]"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono uppercase text-[#326BFF] font-bold">
                    {product.category}
                  </span>
                  <h3 className="text-xs font-bold text-white truncate">{product.title}</h3>
                  <div className="text-xs font-mono font-bold text-white mt-0.5">
                    ₹{product.price.toLocaleString('en-IN')}
                    {product.stock && (
                      <span className="text-[10px] text-[#22C55E] font-normal ml-2 font-sans">
                        • {product.stock} in stock
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 1: Objective */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-1.5 font-['Syne']">
                  <Target className="w-4 h-4 text-[#326BFF]" />
                  <span>1. Choose Campaign Objective</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'views', title: 'Product Views', icon: Eye, desc: 'Maximize detail page clicks' },
                    { id: 'visits', title: 'Shop Visits', icon: ShoppingBag, desc: 'Drive storefront traffic' },
                    { id: 'enquiries', title: 'More Enquiries', icon: MessageSquare, desc: 'Attract direct buyer DMs' },
                  ].map((obj) => (
                    <div
                      key={obj.id}
                      onClick={() => setSelectedObjective(obj.id as any)}
                      className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                        selectedObjective === obj.id
                          ? 'bg-[#326BFF]/15 border-[#326BFF] text-white shadow-sm'
                          : 'bg-[#181B22] border-[#292E38] text-[#A7ADB8] hover:border-neutral-700'
                      }`}
                    >
                      <obj.icon className="w-4 h-4 mx-auto mb-1 text-[#326BFF]" />
                      <div className="text-xs font-bold">{obj.title}</div>
                      <div className="text-[10px] text-[#A7ADB8] mt-0.5 leading-tight">{obj.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Configurable Plans (Rules 103, 104) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5 font-['Syne']">
                    <DollarSign className="w-4 h-4 text-[#326BFF]" />
                    <span>2. Select Budget & Duration Plan</span>
                  </label>
                  <span className="text-[10px] text-[#A7ADB8] font-mono">No auto-renewals</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['starter', 'growth', 'boost'] as const).map((planKey) => {
                    const p = PLANS[planKey];
                    const isSelected = selectedPlan === planKey;
                    return (
                      <div
                        key={planKey}
                        onClick={() => setSelectedPlan(planKey)}
                        className={`p-3.5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#326BFF]/15 border-[#326BFF] text-white shadow-[0_0_15px_rgba(50,107,255,0.25)]'
                            : 'bg-[#181B22] border-[#292E38] text-[#A7ADB8] hover:border-neutral-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white">{p.name}</span>
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#326BFF]/20 text-[#326BFF]">
                              {p.duration}D
                            </span>
                          </div>
                          <div className="text-base sm:text-lg font-black text-white font-mono mt-1">
                            ₹{p.price}
                          </div>
                          <div className="text-[10px] text-[#22C55E] font-medium mt-1">
                            ~{p.estimatedReachMin.toLocaleString()} – {p.estimatedReachMax.toLocaleString()} reach
                          </div>
                        </div>

                        <div className="text-[9px] text-[#A7ADB8] mt-2 leading-tight">
                          {p.badge}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Audience Strategy (Rules 107 & 108) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white flex items-center gap-1.5 font-['Syne']">
                  <Radio className="w-4 h-4 text-[#326BFF]" />
                  <span>3. Audience Targeting</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    onClick={() => setAudienceType('auto')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      audienceType === 'auto'
                        ? 'bg-[#326BFF]/15 border-[#326BFF] text-white'
                        : 'bg-[#181B22] border-[#292E38] text-[#A7ADB8]'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-[#326BFF]" />
                      <span>Automatic Audience</span>
                    </div>
                    <p className="text-[10px] text-[#A7ADB8] mt-0.5">
                      FLYNK matches buyers actively searching {product.category}
                    </p>
                  </div>

                  <div
                    onClick={() => setAudienceType('custom')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      audienceType === 'custom'
                        ? 'bg-[#326BFF]/15 border-[#326BFF] text-white'
                        : 'bg-[#181B22] border-[#292E38] text-[#A7ADB8]'
                    }`}
                  >
                    <div className="text-xs font-bold">Category Specific</div>
                    <p className="text-[10px] text-[#A7ADB8] mt-0.5">
                      Target specific subcategories and regional shoppers
                    </p>
                  </div>
                </div>
              </div>

              {/* STRICT COMPLIANCE & LEGAL NOTICE (Rules 80, 104, 190) */}
              <div className="p-3.5 rounded-2xl bg-[#181B22] border border-[#292E38] space-y-1.5 text-xs text-[#A7ADB8]">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>FLYNK Promotion Policy & Integrity Disclosures</span>
                </div>
                <ul className="text-[11px] space-y-1 pl-4 list-disc text-[#A7ADB8] leading-relaxed">
                  <li>
                    <strong className="text-white">Promotion ≠ Verification:</strong> Paying for reach does <span className="text-amber-400 underline">not</span> grant "Verified Seller", "Verified Product", or authenticity endorsements (Rule 80).
                  </li>
                  <li>
                    <strong className="text-white">Clear Labeling:</strong> All promoted product cards are openly tagged with a <span className="font-mono text-white bg-black/40 px-1 py-0.5 rounded">Promoted</span> badge.
                  </li>
                  <li>
                    <strong className="text-white">Out of Stock Guard:</strong> If product inventory reaches zero, campaign delivery automatically pauses to protect your budget (Rule 146).
                  </li>
                  <li>
                    <strong className="text-white">Estimates:</strong> Reach figures are model projections based on historical category volume, not guaranteed sales leads (Rule 104).
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer CTA */}
        {activeTab === 'create' && step !== 'success' && (
          <div className="p-4 border-t border-[#292E38] bg-[#181B22] flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-[#A7ADB8]">Total Campaign Cost</div>
              <div className="text-base font-bold text-white font-mono">
                ₹{currentPlan.price} <span className="text-[11px] font-normal text-[#A7ADB8]">(Inclusive of taxes)</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              onClick={handleLaunchCampaign}
              className="py-3 px-6 rounded-xl bg-[#326BFF] hover:bg-[#2558E8] text-white font-bold text-xs shadow-[0_0_20px_rgba(50,107,255,0.4)] flex items-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying & Activating...</span>
                </>
              ) : (
                <>
                  <span>Activate {currentPlan.name} (₹{currentPlan.price})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
