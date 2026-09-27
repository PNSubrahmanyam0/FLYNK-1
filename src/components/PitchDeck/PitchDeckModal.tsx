import React, { useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Film,
  ShoppingBag,
  ShieldCheck,
  TrendingUp,
  Flame,
  Lock,
  Layers,
  Cpu,
  Laptop,
  CheckCircle2,
} from 'lucide-react';
import { FlynkLogo } from '../Common/FlynkLogo';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    // SLIDE 1: COVER
    {
      title: 'FLYNK',
      subtitle: 'The Next-Generation Creator Video & Commerce Ecosystem',
      badge: 'INVESTOR & PRODUCT BRIEF',
      content: (
        <div className="flex flex-col items-center justify-center text-center py-6 space-y-4">
          <FlynkLogo size="xl" showText={true} />
          <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full my-2" />
          <h2 className="text-xl sm:text-2xl font-black text-white max-w-lg leading-tight">
            Where 30-Sec Trailers Link Directly to Full Stories & Trusted Creator Stores
          </h2>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-md leading-relaxed">
            Uniting short-form discovery, cinematic long-form video, end-to-end encrypted messaging, and licensed escrow-backed commerce in one seamless application.
          </p>
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-mono font-semibold border border-rose-500/30">
              Short ▯ › ▭ Full Video
            </span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono font-semibold border border-indigo-500/30">
              Protected Escrow Shop
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-semibold border border-emerald-500/30">
              E2EE Direct Messaging
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 2: THE PROBLEM
    {
      title: 'The Fragmented Ecosystem Problem',
      subtitle: 'Why users and creators are exhausted with existing platforms',
      badge: 'MARKET OPPORTUNITY',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 py-4">
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Short Video Dead-Ends
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Instagram Reels and TikTok are algorithmic dead-ends. Creators write "Link in bio for full video", losing 85% of their audience during the jump.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Disconnected Commerce
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Users love products shown in videos, but finding them means searching Amazon or Meesho, risking fake sellers, duplicate items, and broken logistics.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              5 Separate Apps Needed
            </h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Today a creator must juggle YouTube for long video, Instagram for clips, WhatsApp for inquiries, and Shopify for store sales.
            </p>
          </div>
        </div>
      ),
    },

    // SLIDE 3: SIGNATURE DIFFERENTIATOR
    {
      title: 'Short-to-Full Video Linking',
      subtitle: 'Our primary differentiator: Short trailers morph into complete stories',
      badge: 'CORE INNOVATION',
      content: (
        <div className="py-2 space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-neutral-900 border border-rose-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="space-y-1">
              <div className="text-xs font-bold text-rose-400 font-mono">
                SIGNATURE INTERACTION
              </div>
              <h3 className="text-base font-bold text-white">
                "Swipe Left" or Tap "Watch Full Video"
              </h3>
              <p className="text-xs text-neutral-300 max-w-sm">
                No searching channels. No profile links. The 30s teaser stretches with an expanding portal transition into the exact full movie/documentary!
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-sm font-bold bg-black/60 p-3 rounded-2xl border border-white/10 shrink-0">
              <span className="text-rose-400">30s Short (▯)</span>
              <span className="text-white">--- SWIPE LEFT ---&gt;</span>
              <span className="text-indigo-400">Full Video (▭)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <h5 className="font-bold text-white">2-Way Reverse Connection</h5>
              <p className="text-[11px] text-neutral-400">
                Full-length videos showcase "Trailers & Highlights from this Video", allowing deep viewers to discover and share snackable clips.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1">
              <h5 className="font-bold text-white">Long Video Skip Controls</h5>
              <p className="text-[11px] text-neutral-400">
                &lt;&lt; 10s and &gt;&gt; 10s skip controls are reserved exclusively for long videos to maintain pure immersion on shorts.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 4: 4-DIRECTION GESTURE SYSTEM
    {
      title: '4-Direction Gesture Architecture',
      subtitle: 'Intuitive spatial navigation without cluttering the screen',
      badge: 'INTERACTION DESIGN',
      content: (
        <div className="py-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-3 rounded-2xl bg-neutral-900 border border-rose-500/40 space-y-1">
              <span className="text-lg font-bold text-rose-400 font-mono">← SWIPE LEFT</span>
              <h5 className="text-xs font-bold text-white">Attached Full Video</h5>
              <p className="text-[10px] text-neutral-400">Plays exact long video parent immediately</p>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-900 border border-purple-500/40 space-y-1">
              <span className="text-lg font-bold text-purple-400 font-mono">SWIPE RIGHT →</span>
              <h5 className="text-xs font-bold text-white">Long Discovery Home</h5>
              <p className="text-[10px] text-neutral-400">YouTube-style browse feed & categories</p>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="text-lg font-bold text-neutral-300 font-mono">↑ SWIPE UP</span>
              <h5 className="text-xs font-bold text-white">Next Short Trailer</h5>
              <p className="text-[10px] text-neutral-400">Smooth infinite vertical feed</p>
            </div>

            <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
              <span className="text-lg font-bold text-neutral-300 font-mono">↓ SWIPE DOWN</span>
              <h5 className="text-xs font-bold text-white">Previous Short</h5>
              <p className="text-[10px] text-neutral-400">Instantly rewind to previous clip</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Dual Discovery:</strong> Users also receive glowing on-screen CTA badges ("Watch Full Video") so first-time users discover the connection effortlessly.
            </span>
          </div>
        </div>
      ),
    },

    // SLIDE 5: 3-SIDED ECOSYSTEM
    {
      title: 'The Three-Sided Ecosystem',
      subtitle: 'Value creation across Viewers, Creators, and Businesses',
      badge: 'NETWORK EFFECTS',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3">
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
              1. Viewers
            </span>
            <ul className="text-[11px] text-neutral-300 space-y-1 list-disc pl-4">
              <li>Instant jump to complete stories</li>
              <li>Discover verified creator goods</li>
              <li>Escrow protected payments & tracked courier deliveries</li>
              <li>Spam-free 1-to-1 DMs</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
              2. Creators
            </span>
            <ul className="text-[11px] text-neutral-300 space-y-1 list-disc pl-4">
              <li>High-conversion trailers to long video</li>
              <li>1-tap AI moment extractor</li>
              <li>Tag merchandise directly in reels</li>
              <li>Direct monetization without sponsor middlemen</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
              3. Businesses
            </span>
            <ul className="text-[11px] text-neutral-300 space-y-1 list-disc pl-4">
              <li>Customizable in-app mini storefronts</li>
              <li>Automated multi-carrier logistics (Shiprocket)</li>
              <li>Tamper-proof trust ratings and delivered order counts</li>
              <li>High intent content-led buyers</li>
            </ul>
          </div>
        </div>
      ),
    },

    // SLIDE 6: E-COMMERCE & ESCROW ARCHITECTURE
    {
      title: 'Content-Led Commerce & Escrow',
      subtitle: 'Eliminating online purchase anxiety with regulated delayed settlement',
      badge: 'FINTECH & COMMERCE',
      content: (
        <div className="py-2 space-y-3.5">
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-neutral-300">
              <span className="font-bold text-white">The Regulated Escrow Settlement Flow:</span>
              <span className="text-emerald-400 font-mono">100% Compliant</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10px] font-mono">
              <div className="bg-neutral-900 p-2 rounded-xl">
                <span className="text-rose-400 block font-bold">1. Checkout</span>
                <span>Customer pays via UPI/Cards/COD</span>
              </div>
              <div className="bg-neutral-900 p-2 rounded-xl">
                <span className="text-amber-400 block font-bold">2. Escrow Hold</span>
                <span>Funds frozen in regulated PA account</span>
              </div>
              <div className="bg-neutral-900 p-2 rounded-xl">
                <span className="text-sky-400 block font-bold">3. Logistics</span>
                <span>Shiprocket assigns AWB & courier</span>
              </div>
              <div className="bg-neutral-900 p-2 rounded-xl">
                <span className="text-purple-400 block font-bold">4. Delivery Scan</span>
                <span>Courier webhook verifies handover</span>
              </div>
              <div className="bg-neutral-900 p-2 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-emerald-400 block font-bold">5. Payout</span>
                <span>Funds released to creator/seller</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <h5 className="font-bold text-white mb-1">Anti-Fraud Buyer Trust System</h5>
              <p className="text-[11px] text-neutral-400">
                Phone & email verified profiles, delivery track record, RTO scoring for COD orders.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <h5 className="font-bold text-white mb-1">Unchangeable Trust Metrics</h5>
              <p className="text-[11px] text-neutral-400">
                Sellers cannot manually alter ratings or delivered counts; metrics are purely generated by system order events.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 7: CREATOR ANALYTICS & HEATMAP AI
    {
      title: 'Creator Intelligence & Heatmap AI',
      subtitle: 'Actionable retention analysis that creates an automatic content loop',
      badge: 'CREATOR TOOLING',
      content: (
        <div className="py-2 space-y-3.5">
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                The Growth Flywheel:
              </span>
              <span className="text-rose-400 font-mono text-[11px]">Heatmap → Short → Full</span>
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-neutral-800 font-mono text-xs text-neutral-300 space-y-1">
              <p>1. Creator uploads 20-min documentary</p>
              <p>2. Heatmap detects peak retention: <span className="text-amber-400">04:12 - 04:42 (96%)</span></p>
              <p>3. AI prompts: <span className="text-rose-400">"1-Tap Extract 30s Trailer"</span></p>
              <p>4. Trailer appears in Short Feed → viewers swipe left into Full Video</p>
              <p>5. Measured metric: <span className="text-emerald-400">Short-to-Full Conversion Rate: 16.4%</span></p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-white font-bold block">Aggregated Data</span>
              <span className="text-[10px] text-neutral-400">DPDP Act compliant</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-white font-bold block">No Personal PII Leak</span>
              <span className="text-[10px] text-neutral-400">Privacy by design</span>
            </div>
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="text-white font-bold block">Watermark Engine</span>
              <span className="text-[10px] text-neutral-400">Auto-stamped handles</span>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 8: 1-TO-1 MESSAGING & CALL PERMISSIONS
    {
      title: 'Encrypted Messaging & Anti-Spam',
      subtitle: 'Private community without creator harassment',
      badge: 'COMMUNICATION & PRIVACY',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-3">
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <Lock className="w-4 h-4" />
              <span>1-to-1 Ephemeral Personal DMs</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              End-to-end encrypted chats with optional 24-hour disappearing mode for personal interactions, while keeping persistent records for verified store orders.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>Call Request Permission Shield</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Fans cannot spam video or voice call creators. Creators receive discrete Call Requests: Accept, Decline, or Always Allow for VIP collaborators.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
              <ShoppingBag className="w-4 h-4" />
              <span>In-Chat Product Inquiries</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Users can tap "Send Product Card" inside chat to ask sizing, custom tailoring, or wholesale questions with full context.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Safety & AI Moderation</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Automated image & text classification pipeline to detect adult content, hate speech, and spam before reaching creators.
            </p>
          </div>
        </div>
      ),
    },

    // SLIDE 9: TECH STACK & REVENUE
    {
      title: 'Scalable Architecture & Revenue Model',
      subtitle: 'Built for high throughput, low latency, and healthy unit economics',
      badge: 'ARCHITECTURE & BUSINESS',
      content: (
        <div className="py-2 space-y-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="font-bold text-white block">Frontend</span>
              <span className="text-[11px] text-rose-400">Flutter Mobile App</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="font-bold text-white block">Backend API</span>
              <span className="text-[11px] text-indigo-400">Python FastAPI</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="font-bold text-white block">Database</span>
              <span className="text-[11px] text-sky-400">PostgreSQL / Supabase</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
              <span className="font-bold text-white block">Video Delivery</span>
              <span className="text-[11px] text-emerald-400">Managed CDN / HLS</span>
            </div>
          </div>

          {/* Revenue Engines */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5 text-xs">
            <span className="font-bold text-white block">Diversified Revenue Engines:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-neutral-300">
              <div className="bg-neutral-900 p-2 rounded-lg">
                <strong className="text-rose-400 block">Marketplace Take Rate:</strong>
                5–10% commission on delivered escrow goods.
              </div>
              <div className="bg-neutral-900 p-2 rounded-lg">
                <strong className="text-indigo-400 block">Creator Pro Studio:</strong>
                Advanced heatmap clipping & theme customizations.
              </div>
              <div className="bg-neutral-900 p-2 rounded-lg">
                <strong className="text-amber-400 block">Sponsored Feeds:</strong>
                Native boosted shorts with clear verified disclosure.
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // SLIDE 10: MACBOOK M4 & 30-DAY SPRINT
    {
      title: '30-Day Closed Beta Sprint',
      subtitle: 'MacBook Air M4 workflow & autonomous AI iteration',
      badge: 'EXECUTION ROADMAP',
      content: (
        <div className="py-2 space-y-3.5">
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Laptop className="w-4 h-4 text-rose-400" />
              MacBook Air M4 Developer Environment:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-300">
              <div className="bg-neutral-900 p-2 rounded-xl">
                <strong>1. VS Code + Git</strong>
                <p className="text-neutral-400">Core editor & version control repository.</p>
              </div>
              <div className="bg-neutral-900 p-2 rounded-xl">
                <strong>2. Flutter + Xcode + Android Studio</strong>
                <p className="text-neutral-400">Simulators for multi-device screen tests.</p>
              </div>
              <div className="bg-neutral-900 p-2 rounded-xl">
                <strong>3. Autonomous AI Coding Loop</strong>
                <p className="text-neutral-400">AI creates files, runs builds, inspects & fixes.</p>
              </div>
              <div className="bg-neutral-900 p-2 rounded-xl">
                <strong>4. Real User Testing Loop</strong>
                <p className="text-neutral-400">Hands-on testing on 50 real phones without manual guide.</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-neutral-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Target Day 30:</strong> 50 active beta testers, 10 creators, verified Short-to-Full loop, sandbox escrow checkout, zero crashes.
            </span>
          </div>
        </div>
      ),
    },
  ];

  const slide = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Presentation Header */}
        <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FlynkLogo size="sm" showText={true} />
            <span className="text-xs bg-neutral-800 px-2 py-0.5 rounded-full text-neutral-400 font-mono">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800 text-neutral-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Slide Screen Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase bg-rose-500/20 text-rose-400 font-bold px-2.5 py-0.5 rounded-full border border-rose-500/30">
              {slide.badge}
            </span>
            <h1 className="text-lg sm:text-2xl font-black text-white mt-2 leading-tight">
              {slide.title}
            </h1>
            <p className="text-xs text-neutral-400 mt-1">{slide.subtitle}</p>

            <div className="mt-4">{slide.content}</div>
          </div>

          {/* Slide dots indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-rose-500' : 'w-1.5 bg-neutral-700 hover:bg-neutral-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Presentation Footer Navigation */}
        <div className="px-6 py-3.5 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-xs text-neutral-400 font-mono">
            {currentSlide + 1} / {slides.length}
          </span>

          <button
            onClick={() =>
              currentSlide === slides.length - 1
                ? onClose()
                : setCurrentSlide(currentSlide + 1)
            }
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-500/25 transition-all"
          >
            <span>{currentSlide === slides.length - 1 ? 'Close Pitch Deck' : 'Next Slide'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
