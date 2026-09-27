import React, { useState } from 'react';
import {
  Globe,
  X,
  Layers,
  Check,
  Eye,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Store,
  Palette,
  ArrowUpRight,
} from 'lucide-react';
import { BusinessWebsiteSection } from '../../types/account';

interface BusinessWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  businessHandle: string;
}

const DEFAULT_SECTIONS: BusinessWebsiteSection[] = [
  { id: 'sec_hero', type: 'hero', title: 'Hero Banner & Tagline', enabled: true },
  { id: 'sec_about', type: 'about', title: 'Brand Story & About', enabled: true },
  { id: 'sec_products', type: 'products', title: 'Featured Shop Products', enabled: true },
  { id: 'sec_flicks', type: 'flicks', title: 'Latest Brand Flicks', enabled: true },
  { id: 'sec_location', type: 'location', title: 'Store Location & Hours', enabled: true },
  { id: 'sec_contact', type: 'contact', title: 'Contact & Live Chat', enabled: true },
];

export const BusinessWebsiteModal: React.FC<BusinessWebsiteModalProps> = ({
  isOpen,
  onClose,
  businessName,
  businessHandle,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'customize'>('preview');
  const [sections, setSections] = useState<BusinessWebsiteSection[]>(DEFAULT_SECTIONS);
  const [themeColor, setThemeColor] = useState<string>('#e11d48');
  const [customDomain, setCustomDomain] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const toggleSection = (id: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const newSecs = [...sections];
    const [moved] = newSecs.splice(index, 1);
    newSecs.splice(targetIndex, 0, moved);
    setSections(newSecs);
  };

  const siteUrl = `brand.app/b/${businessHandle.replace('@', '')}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none font-['Plus_Jakarta_Sans']">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
          <div className="px-4 py-2 rounded-2xl bg-neutral-900 border border-red-500/50 text-white text-xs font-bold shadow-2xl flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span>{toast}</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl bg-[#0b0408] border border-red-500/40 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.25)] flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800/80 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center shadow">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-['Syne'] flex items-center gap-1.5">
                <span>Business Webpage Builder</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Live Sync
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Safe modular customization connected directly to your FLYNK store & flicks
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 py-2.5 bg-neutral-950 border-b border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Live Website Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('customize')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'customize'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Section Builder & Colors</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-mono bg-black/60 px-3 py-1 rounded-xl border border-neutral-800">
            <Globe className="w-3 h-3 text-red-400" />
            <span>https://{siteUrl}</span>
          </div>
        </div>

        {/* TAB 1: PREVIEW */}
        {activeTab === 'preview' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            {/* Mock Browser Frame */}
            <div className="rounded-2xl border border-neutral-800 bg-[#0e0a10] overflow-hidden shadow-2xl">
              {/* Browser Bar */}
              <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="text-[11px] font-mono text-neutral-400 bg-black/50 px-3 py-0.5 rounded-full border border-neutral-800">
                  https://{siteUrl}
                </div>
                <button
                  onClick={() => showToast('Link copied to clipboard!')}
                  className="text-neutral-400 hover:text-white"
                  title="Copy link"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Webpage Content */}
              <div className="p-4 sm:p-6 space-y-6">
                {/* Hero Section */}
                {sections.find((s) => s.type === 'hero')?.enabled && (
                  <div
                    className="p-6 rounded-2xl text-center space-y-3 relative overflow-hidden border border-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${themeColor}22 0%, #000 100%)`,
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white text-xl font-bold shadow-lg"
                      style={{ backgroundColor: themeColor }}
                    >
                      <Store className="w-7 h-7" />
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-extrabold text-white font-['Syne']">
                        {businessName}
                      </h1>
                      <p className="text-xs text-neutral-300 max-w-md mx-auto mt-1">
                        Luxury handloom apparel & bespoke couture collections directly from our atelier.
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <button
                        className="px-4 py-1.5 rounded-xl text-white text-xs font-bold shadow-md cursor-pointer"
                        style={{ backgroundColor: themeColor }}
                      >
                        Explore Catalog
                      </button>
                      <button className="px-4 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white text-xs font-bold border border-neutral-700">
                        Chat with Us
                      </button>
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {sections.find((s) => s.type === 'products')?.enabled && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-bold text-white font-['Syne']">
                        Trending Releases
                      </h2>
                      <span className="text-[11px] text-neutral-400">View All (12)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { title: 'Oversized Silk Kimono', price: '₹3,499', rating: '4.9' },
                        { title: 'Raw Cotton Kurta', price: '₹1,899', rating: '4.8' },
                        { title: 'Indigo Drape Scarf', price: '₹899', rating: '5.0' },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 space-y-1.5"
                        >
                          <div className="aspect-square rounded-lg bg-neutral-800/50 flex items-center justify-center text-neutral-500 text-xs font-mono">
                            Photo #{idx + 1}
                          </div>
                          <div className="font-bold text-xs text-white truncate">{item.title}</div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-red-400 font-bold">{item.price}</span>
                            <span className="text-neutral-400">★ {item.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location & Hours Section */}
                {sections.find((s) => s.type === 'location')?.enabled && (
                  <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">Madhapur Boutique</div>
                      <div className="text-[11px] text-neutral-400">
                        Open Daily 10:00 AM – 9:30 PM • 2.8 km away
                      </div>
                    </div>
                    <button className="px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold border border-neutral-700">
                      Get Directions
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-neutral-400">
                Any update to your FLYNK store or flicks updates this site instantly.
              </span>
              <button
                onClick={() => showToast('Website configuration published!')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-bold shadow-lg"
              >
                Publish Site Updates
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SECTION BUILDER & CUSTOMIZATION (Rule 15) */}
        {activeTab === 'customize' && (
          <div className="p-5 space-y-5 overflow-y-auto">
            {/* Color Palette Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-red-400" />
                <span>Primary Brand Color</span>
              </label>
              <div className="flex items-center gap-2">
                {[
                  { color: '#e11d48', name: 'Crimson' },
                  { color: '#6366f1', name: 'Indigo' },
                  { color: '#0ea5e9', name: 'Sky Blue' },
                  { color: '#10b981', name: 'Emerald' },
                  { color: '#f59e0b', name: 'Amber' },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => setThemeColor(c.color)}
                    className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center cursor-pointer"
                    style={{
                      backgroundColor: c.color,
                      borderColor: themeColor === c.color ? '#ffffff' : 'transparent',
                    }}
                  >
                    {themeColor === c.color && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Domain Option */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-sky-400" />
                <span>Custom Domain (Optional)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. boutique.com"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={() => showToast('DNS CNAME verified!')}
                  className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold border border-neutral-700 cursor-pointer"
                >
                  Connect Domain
                </button>
              </div>
              <p className="text-[10px] text-neutral-400">
                Default free domain is always available at {siteUrl}
              </p>
            </div>

            {/* Reorderable Approved Sections */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Modular Sections (Reorder & Toggle)</span>
              </label>
              <div className="space-y-2">
                {sections.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={sec.enabled}
                        onChange={() => toggleSection(sec.id)}
                        className="rounded accent-red-600 cursor-pointer"
                      />
                      <span
                        className={`text-xs font-bold ${
                          sec.enabled ? 'text-white' : 'text-neutral-500 line-through'
                        }`}
                      >
                        {sec.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveSection(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveSection(idx, 'down')}
                        disabled={idx === sections.length - 1}
                        className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
