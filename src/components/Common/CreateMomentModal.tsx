import React, { useState } from 'react';
import {
  X,
  Camera,
  Video,
  Type,
  MapPin,
  Tag,
  Link2,
  Sparkles,
  Globe,
  Users,
  Lock,
  ChevronDown,
  Check,
  ShoppingBag,
  Film,
  Calendar,
  Briefcase,
} from 'lucide-react';
import { Moment, Product, LongVideo, User } from '../../types';
import { MOCK_PRODUCTS, MOCK_LONG_VIDEOS } from '../../data/mockData';

interface CreateMomentModalProps {
  isOpen: boolean;
  user: User;
  accountMode: 'personal' | 'creator' | 'business' | 'shop' | 'professional';
  isPrivateAccount?: boolean;
  onClose: () => void;
  onPublishMoment: (moment: Moment) => void;
}

export const CreateMomentModal: React.FC<CreateMomentModalProps> = ({
  isOpen,
  user,
  accountMode,
  isPrivateAccount = false,
  onClose,
  onPublishMoment,
}) => {
  const [mode, setMode] = useState<'photo' | 'video' | 'text'>('photo');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
  );
  const [textContent, setTextContent] = useState('');
  const [bgGradient, setBgGradient] = useState('from-[#101217] via-[#1e1b4b] to-[#326BFF]');
  const [selectedAudience, setSelectedAudience] = useState<'public' | 'followers' | 'friends' | 'selected'>(
    isPrivateAccount ? 'followers' : 'public'
  );
  const [showAudienceMenu, setShowAudienceMenu] = useState(false);
  const [attachedCta, setAttachedCta] = useState<'none' | 'watch_full' | 'view_product' | 'book' | 'hire_me'>('none');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(MOCK_PRODUCTS[0]);
  const [selectedLongVideo, setSelectedLongVideo] = useState<LongVideo | null>(MOCK_LONG_VIDEOS[0]);

  if (!isOpen) return null;

  const handlePublish = () => {
    let ctaLabel = '';
    let ctaTargetData: any = undefined;

    if (attachedCta === 'watch_full' && selectedLongVideo) {
      ctaLabel = 'Watch Full Video';
      ctaTargetData = selectedLongVideo;
    } else if (attachedCta === 'view_product' && selectedProduct) {
      ctaLabel = 'View Product in Shop';
      ctaTargetData = selectedProduct;
    } else if (attachedCta === 'book') {
      ctaLabel = 'Book Appointment';
    } else if (attachedCta === 'hire_me') {
      ctaLabel = 'Request Quote';
    }

    const newMoment: Moment = {
      id: `moment_${Date.now()}`,
      userId: user.id,
      authorName: user.name,
      authorHandle: user.handle.replace('@', ''),
      authorAvatar: user.avatar,
      accountMode,
      categoryLabel: accountMode === 'creator' ? 'Creator' : accountMode === 'business' ? 'Business' : accountMode === 'shop' ? 'Shop' : accountMode === 'professional' ? 'Professional' : 'Personal',
      mediaType: mode,
      mediaUrl: mode !== 'text' ? selectedPhoto : undefined,
      textContent: textContent || (mode === 'text' ? 'New Moment update' : ''),
      bgGradient: mode === 'text' ? bgGradient : undefined,
      createdAt: 'Just now',
      expiresAt: '24h left',
      durationSeconds: 5,
      isViewed: false,
      audience: selectedAudience,
      ctaType: attachedCta !== 'none' ? attachedCta : (accountMode === 'personal' ? 'reply' : undefined),
      ctaLabel: ctaLabel || (accountMode === 'personal' ? 'Send Reply' : undefined),
      ctaTargetData,
      viewsCount: 0,
      repliesCount: 0,
    };

    onPublishMoment(newMoment);
    onClose();
  };

  const samplePhotos = [
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
  ];

  const gradients = [
    { label: 'FLYNK Blue', val: 'from-[#101217] via-[#1e1b4b] to-[#326BFF]' },
    { label: 'Crimson Glow', val: 'from-[#101217] via-[#3b0713] to-[#FF3D52]' },
    { label: 'Violet Aura', val: 'from-[#101217] via-[#2e1065] to-[#8B5CF6]' },
    { label: 'Emerald Deep', val: 'from-[#101217] via-[#022c22] to-[#22C55E]' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full h-full max-w-[430px] max-h-[920px] bg-[#101217] sm:rounded-[32px] overflow-hidden flex flex-col justify-between border border-[#292E38] shadow-2xl">
        {/* Top Header Bar */}
        <div className="p-3 sm:p-4 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/60 text-[#F7F8FA] flex items-center justify-center border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181B22] border border-[#292E38]">
            <Sparkles className="w-3.5 h-3.5 text-[#326BFF]" />
            <span className="text-xs font-bold text-[#F7F8FA] font-['Syne']">
              Create Moment · 24h
            </span>
          </div>

          <div className="w-9" />
        </div>

        {/* Center Canvas Preview */}
        <div className="relative flex-1 flex flex-col justify-center items-center overflow-hidden mx-3 rounded-2xl border border-white/10 shadow-inner bg-black">
          {mode !== 'text' ? (
            <div className="relative w-full h-full">
              <img
                src={selectedPhoto}
                alt="Moment Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Caption Overlay */}
              <div className="absolute bottom-4 inset-x-4">
                <input
                  type="text"
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Add a caption or sticker..."
                  className="w-full py-2.5 px-4 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 text-[#F7F8FA] placeholder-[#A7ADB8] text-xs focus:outline-none focus:border-[#326BFF]"
                />
              </div>
            </div>
          ) : (
            <div className={`w-full h-full p-6 flex flex-col justify-center items-center bg-gradient-to-tr ${bgGradient}`}>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="What's happening right now?"
                className="w-full bg-transparent text-center text-white placeholder-white/50 text-xl font-bold font-['Syne'] resize-none focus:outline-none leading-relaxed"
                rows={4}
              />
            </div>
          )}
        </div>

        {/* Tools / Options Tray */}
        <div className="p-3 sm:p-4 space-y-3 z-20 bg-[#101217]">
          {/* Mode Switcher (Photo / Video / Text) */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#181B22] border border-[#292E38]">
            <button
              type="button"
              onClick={() => setMode('photo')}
              className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'photo' ? 'bg-[#326BFF] text-white shadow-md' : 'text-[#A7ADB8] hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('video')}
              className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'video' ? 'bg-[#326BFF] text-white shadow-md' : 'text-[#A7ADB8] hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('text')}
              className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'text' ? 'bg-[#326BFF] text-white shadow-md' : 'text-[#A7ADB8] hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>
          </div>

          {/* Quick Photo Selector or Gradient Switcher */}
          {mode !== 'text' ? (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] text-[#A7ADB8] font-mono shrink-0">Sample Media:</span>
              {samplePhotos.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPhoto(url)}
                  className={`w-10 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-transform ${
                    selectedPhoto === url ? 'border-[#326BFF] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] text-[#A7ADB8] font-mono shrink-0">Gradients:</span>
              {gradients.map((g) => (
                <button
                  key={g.label}
                  type="button"
                  onClick={() => setBgGradient(g.val)}
                  className={`w-8 h-8 rounded-full bg-gradient-to-tr ${g.val} border-2 transition-transform ${
                    bgGradient === g.val ? 'border-white scale-110' : 'border-transparent opacity-70'
                  }`}
                  title={g.label}
                />
              ))}
            </div>
          )}

          {/* Contextual CTA Attachment (Creator Watch Full, Shop Product, Business Book) */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] text-[#A7ADB8] font-mono flex items-center gap-1">
              <Link2 className="w-3 h-3 text-[#326BFF]" />
              <span>Attach Contextual Action Pill (Optional)</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setAttachedCta('none')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 border ${
                  attachedCta === 'none' ? 'bg-white/10 text-white border-white/30' : 'bg-[#181B22] text-[#A7ADB8] border-[#292E38]'
                }`}
              >
                None
              </button>

              {(accountMode === 'creator' || accountMode === 'professional') && (
                <button
                  type="button"
                  onClick={() => setAttachedCta('watch_full')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 border ${
                    attachedCta === 'watch_full' ? 'bg-[#326BFF]/20 text-[#326BFF] border-[#326BFF]' : 'bg-[#181B22] text-[#A7ADB8] border-[#292E38]'
                  }`}
                >
                  <Film className="w-3 h-3" />
                  <span>Watch Full Video</span>
                </button>
              )}

              {(accountMode === 'shop' || accountMode === 'creator') && (
                <button
                  type="button"
                  onClick={() => setAttachedCta('view_product')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 border ${
                    attachedCta === 'view_product' ? 'bg-[#326BFF]/20 text-[#326BFF] border-[#326BFF]' : 'bg-[#181B22] text-[#A7ADB8] border-[#292E38]'
                  }`}
                >
                  <ShoppingBag className="w-3 h-3" />
                  <span>Tag Product</span>
                </button>
              )}

              {accountMode === 'business' && (
                <button
                  type="button"
                  onClick={() => setAttachedCta('book')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 border ${
                    attachedCta === 'book' ? 'bg-[#326BFF]/20 text-[#326BFF] border-[#326BFF]' : 'bg-[#181B22] text-[#A7ADB8] border-[#292E38]'
                  }`}
                >
                  <Calendar className="w-3 h-3" />
                  <span>Book Appointment</span>
                </button>
              )}

              {accountMode === 'professional' && (
                <button
                  type="button"
                  onClick={() => setAttachedCta('hire_me')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shrink-0 border ${
                    attachedCta === 'hire_me' ? 'bg-[#326BFF]/20 text-[#326BFF] border-[#326BFF]' : 'bg-[#181B22] text-[#A7ADB8] border-[#292E38]'
                  }`}
                >
                  <Briefcase className="w-3 h-3" />
                  <span>Request Quote</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Bar: Audience + Publish CTA */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#292E38]">
            {/* Audience Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowAudienceMenu(!showAudienceMenu)}
                className="px-3 py-2 rounded-xl bg-[#181B22] border border-[#292E38] text-xs font-bold text-[#F7F8FA] flex items-center gap-1.5 hover:bg-[#20242E]"
              >
                {selectedAudience === 'public' && <Globe className="w-3.5 h-3.5 text-[#326BFF]" />}
                {selectedAudience === 'followers' && <Users className="w-3.5 h-3.5 text-[#22C55E]" />}
                {selectedAudience === 'friends' && <Users className="w-3.5 h-3.5 text-[#F59E0B]" />}
                {selectedAudience === 'selected' && <Lock className="w-3.5 h-3.5 text-[#FF3D52]" />}
                <span className="capitalize">{selectedAudience}</span>
                <ChevronDown className="w-3 h-3 text-[#A7ADB8]" />
              </button>

              {/* Audience Dropdown */}
              {showAudienceMenu && (
                <div className="absolute bottom-12 left-0 w-44 rounded-xl bg-[#181B22] border border-[#292E38] p-1.5 shadow-2xl z-30 space-y-1">
                  {!isPrivateAccount && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedAudience('public');
                        setShowAudienceMenu(false);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-[#F7F8FA] flex items-center gap-2 hover:bg-[#20242E]"
                    >
                      <Globe className="w-3.5 h-3.5 text-[#326BFF]" />
                      <span>Public</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAudience('followers');
                      setShowAudienceMenu(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-[#F7F8FA] flex items-center gap-2 hover:bg-[#20242E]"
                  >
                    <Users className="w-3.5 h-3.5 text-[#22C55E]" />
                    <span>Followers</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAudience('friends');
                      setShowAudienceMenu(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-[#F7F8FA] flex items-center gap-2 hover:bg-[#20242E]"
                  >
                    <Users className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>Friends / Mutuals</span>
                  </button>
                </div>
              )}
            </div>

            {/* Share Moment CTA (44-48dp in FLYNK Blue #326BFF) */}
            <button
              type="button"
              onClick={handlePublish}
              className="flex-1 h-11 px-5 rounded-xl bg-[#326BFF] hover:bg-[#467BFF] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(50,107,255,0.4)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Share Moment</span>
              <Sparkles className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
