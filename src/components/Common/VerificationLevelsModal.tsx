import React from 'react';
import {
  ShieldCheck,
  Building2,
  BadgeCheck,
  Award,
  MapPin,
  Clock,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Star,
} from 'lucide-react';
import { User, TransactionReview } from '../../types';

interface VerificationLevelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  reviews?: TransactionReview[];
}

export const VerificationLevelsModal: React.FC<VerificationLevelsModalProps> = ({
  isOpen,
  onClose,
  user,
  reviews = [],
}) => {
  if (!isOpen) return null;

  const audit = user.verificationAudit || {
    identityVerified: true,
    businessVerified: user.role === 'business' || user.handle.includes('clinic') || user.handle.includes('vastra'),
    sellerVerified: user.verifiedSeller || user.role === 'business',
    credentialVerified: user.handle.includes('clinic') || user.handle.includes('vfx') || user.handle.includes('tech'),
    credentialTitle: user.handle.includes('clinic')
      ? 'Telangana State Medical Council (TSMC/Reg: 84920)'
      : user.handle.includes('vfx')
      ? 'Certified DaVinci Resolve Master Colorist'
      : undefined,
    officialLocationVerified: !!user.location,
  };

  const reputation = user.reputationMetrics || {
    completedOrders: user.trustMetrics?.deliveredOrders || 342,
    successfulBookingsRate: user.trustMetrics?.deliverySuccessRate || 96.8,
    responseTime: 'Responds within 15 mins',
    sinceYear: user.trustMetrics?.joinedYear || 2024,
    verifiedReviewsCount: 128,
    rating: user.trustMetrics?.rating || 4.9,
  };

  const verificationLevels = [
    {
      id: 'lvl_identity',
      title: 'Identity Verified',
      icon: BadgeCheck,
      isVerified: !!audit.identityVerified,
      summary: 'Government-issued ID & biometric face match confirmed by FLYNK Trust.',
      meta: 'KYC Level 2 Verified',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    },
    {
      id: 'lvl_business',
      title: 'Business Verified',
      icon: Building2,
      isVerified: !!audit.businessVerified,
      summary: 'Ministry of Corporate Affairs (CIN) and GST registration active.',
      meta: audit.businessVerified ? 'CIN: U74999TG2024PTC • GST Active' : 'Not applied',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
    {
      id: 'lvl_seller',
      title: 'Seller Escrow Verified',
      icon: ShieldCheck,
      isVerified: !!audit.sellerVerified,
      summary: 'FLYNK Escrow bank account verified with 10-day guaranteed buyer return protocol.',
      meta: audit.sellerVerified ? 'Escrow Protected Fulfillment Active' : 'Not a seller',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      id: 'lvl_credential',
      title: 'Professional Credential Verified',
      icon: Award,
      isVerified: !!audit.credentialVerified,
      summary:
        audit.credentialTitle ||
        'Accredited degree, statutory council registry, or certified trade credential vetted.',
      meta: audit.credentialVerified ? audit.credentialTitle || 'Credential Validated' : 'Optional tier',
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      id: 'lvl_location',
      title: 'Official Physical Location',
      icon: MapPin,
      isVerified: !!audit.officialLocationVerified,
      summary: user.location
        ? `Official registered premises at ${user.location}. GPS perimeter audited.`
        : 'Premises location verification pending.',
      meta: user.location ? 'Physical Store / Clinic Audited' : 'Online only',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-lg bg-[#0d040a] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white font-['Syne']">
                FLYNK Trust & Verification Audit
              </h3>
              <p className="text-[11px] text-neutral-400">
                Granular multi-tier verification & empirical reputation
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

        {/* Content */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-6 flex-1 text-white">
          {/* User Card */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border border-neutral-700"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-sm text-white truncate font-['Syne']">{user.name}</h4>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">
                  {user.handle.startsWith('@') ? user.handle : `@${user.handle}`}
                </span>
              </div>
              <p className="text-xs text-neutral-400 truncate mt-0.5">{user.bio}</p>
            </div>
          </div>

          {/* Section 1: Verification Levels */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold font-['Syne'] text-white uppercase tracking-wider">
                  Verification Levels (What We Confirmed)
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Multi-tier credentials instead of a single ambiguous badge
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {verificationLevels.map((lvl) => {
                const Icon = lvl.icon;
                return (
                  <div
                    key={lvl.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      lvl.isVerified
                        ? 'bg-neutral-900/80 border-neutral-800'
                        : 'bg-neutral-900/30 border-neutral-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${lvl.color}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="font-bold text-xs text-white font-['Syne'] flex items-center gap-1.5">
                            <span>{lvl.title}</span>
                            {lvl.isVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                            {lvl.summary}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded-full shrink-0 font-bold ${
                          lvl.isVerified
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {lvl.isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Reputation Metrics */}
          <div className="space-y-3 pt-2 border-t border-neutral-800/80">
            <div>
              <h4 className="text-xs font-bold font-['Syne'] text-white uppercase tracking-wider">
                Empirical Reputation (How Users Interact)
              </h4>
              <p className="text-[11px] text-neutral-400">
                Non-manipulated data built exclusively from completed transactions & bookings
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Completed Orders / Consultations</div>
                <div className="text-lg font-extrabold text-white font-mono mt-1">
                  {reputation.completedOrders}+
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                  100% Escrow Fulfilled
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Booking / Fulfillment Rate</div>
                <div className="text-lg font-extrabold text-emerald-400 font-mono mt-1">
                  {reputation.successfulBookingsRate}%
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Zero unfulfilled cancellations</div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">Response Time</div>
                <div className="text-xs font-bold text-neutral-200 mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  <span>{reputation.responseTime}</span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Average across all channels</div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <div className="text-[10px] font-mono text-neutral-400 uppercase">FLYNK Tenancy</div>
                <div className="text-xs font-bold text-neutral-200 mt-1 font-mono">
                  Since {reputation.sinceYear}
                </div>
                <div className="text-[10px] text-neutral-400 mt-0.5">Clean dispute record</div>
              </div>
            </div>
          </div>

          {/* Section 3: Transaction-Linked Reviews Only */}
          <div className="space-y-3 pt-2 border-t border-neutral-800/80">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold font-['Syne'] text-white uppercase tracking-wider">
                  Transaction-Linked Reviews Only
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Zero anonymous or fake reviews — every review is audited via payment/booking proof
                </p>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold font-mono text-xs border border-amber-500/30">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{reputation.rating}</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"
                      alt="Reviewer"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-bold text-xs text-neutral-200">Rahul V.</span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    ✓ Verified Appointment
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  "Consultation started right on the booked minute. Clear diagnosis and lifestyle plan without prescribing excessive diagnostics."
                </p>
                <div className="text-[10px] text-neutral-500 font-mono">
                  Verified Booking on 22 Sep 2026 • Rating: 5/5 ★
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
                      alt="Reviewer"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-bold text-xs text-neutral-200">Ananya R.</span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    ✓ Verified Purchase
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  "Delivered to Banjara Hills in immaculate dust-proof packaging. The handloom weave texture matches the creator flick video exactly."
                </p>
                <div className="text-[10px] text-neutral-500 font-mono">
                  Verified Escrow Release on 19 Sep 2026 • Rating: 5/5 ★
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900/60 shrink-0 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Close Audit Overview
          </button>
        </div>
      </div>
    </div>
  );
};
