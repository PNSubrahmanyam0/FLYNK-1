import React, { useState } from 'react';
import {
  X,
  Image,
  Plus,
  MapPin,
  Tag,
  Globe,
  Users,
  Lock,
  ChevronDown,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { Frame, Product, User } from '../../types';
import { MOCK_PRODUCTS } from '../../data/mockData';

interface CreateFrameModalProps {
  isOpen: boolean;
  user: User;
  accountMode: 'personal' | 'creator' | 'business' | 'shop' | 'professional';
  onClose: () => void;
  onPublishFrame: (frame: Frame) => void;
}

export const CreateFrameModal: React.FC<CreateFrameModalProps> = ({
  isOpen,
  user,
  accountMode,
  onClose,
  onPublishFrame,
}) => {
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
  ]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('Hyderabad, Telangana');
  const [selectedAudience, setSelectedAudience] = useState<'public' | 'followers' | 'friends' | 'only_me'>('public');
  const [showAudienceMenu, setShowAudienceMenu] = useState(false);
  const [isTaggingProduct, setIsTaggingProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (!isOpen) return null;

  const sampleLibrary = [
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
  ];

  const handleToggleSample = (url: string) => {
    if (images.includes(url)) {
      if (images.length > 1) {
        setImages(images.filter((img) => img !== url));
      }
    } else {
      if (images.length < 10) {
        setImages([...images, url]);
      }
    }
  };

  const handlePublish = () => {
    if (images.length === 0) return;

    const newFrame: Frame = {
      id: `frame_${Date.now()}`,
      authorId: user.id,
      authorName: user.name,
      authorHandle: user.handle.replace('@', ''),
      authorAvatar: user.avatar,
      authorRole: accountMode,
      caption: caption || 'New permanent Frame update #FLYNK',
      images,
      location: location || undefined,
      taggedProducts: selectedProduct ? [selectedProduct] : undefined,
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      savesCount: 0,
      isSaved: false,
      createdAt: 'Just now',
      audience: selectedAudience,
    };

    onPublishFrame(newFrame);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#181B22] rounded-3xl border border-[#292E38] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="p-4 border-b border-[#292E38] flex items-center justify-between bg-[#101217]">
          <div>
            <h3 className="font-bold text-sm sm:text-base text-[#F7F8FA] font-['Syne'] flex items-center gap-1.5">
              <span>Create Frame</span>
              <span className="text-[10px] text-[#A7ADB8] font-normal font-sans">(Photo / Post)</span>
            </h3>
            <p className="text-[11px] text-[#A7ADB8]">
              Permanent visual portfolio & lifestyle post
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#181B22] text-[#A7ADB8] hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Composer Body */}
        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar flex-1">
          {/* Selected Media Carousel Strip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#A7ADB8] font-mono">
              <span>Selected Images ({images.length}/10)</span>
              <span className="text-[10px] text-[#326BFF]">Square Aspect Ratio Recommended</span>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {images.map((url, idx) => (
                <div
                  key={idx}
                  className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/20 group"
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-black/75 text-[10px] font-mono text-white flex items-center justify-center">
                    {idx + 1}
                  </span>
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Picker from samples */}
            <div className="pt-1 space-y-1">
              <span className="text-[11px] text-[#A7ADB8] font-mono">Tap to add/remove photos:</span>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
                {sampleLibrary.map((url, i) => {
                  const isSelected = images.includes(url);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleToggleSample(url)}
                      className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        isSelected ? 'border-[#326BFF] ring-2 ring-[#326BFF]/40' : 'border-transparent opacity-60'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Caption Field */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#A7ADB8] font-mono uppercase tracking-wider">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption for this Frame... Include story, technical notes, or hashtags"
              rows={3}
              className="w-full p-3 rounded-xl bg-[#101217] border border-[#292E38] text-xs text-[#F7F8FA] placeholder-[#707681] focus:outline-none focus:border-[#326BFF] resize-none"
            />
          </div>

          {/* Location Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#A7ADB8] font-mono uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#326BFF]" />
              <span>Location (City / Area)</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Hyderabad, Telangana"
              className="w-full py-2 px-3 rounded-xl bg-[#101217] border border-[#292E38] text-xs text-[#F7F8FA] placeholder-[#707681] focus:outline-none focus:border-[#326BFF]"
            />
          </div>

          {/* Tag Commerce Product if Creator / Shop / Business */}
          {(accountMode === 'creator' || accountMode === 'shop' || accountMode === 'business') && (
            <div className="p-3 rounded-xl bg-[#101217] border border-[#292E38] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#F7F8FA]">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#326BFF]" />
                  <span>Tag Commerce Product</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTaggingProduct(!isTaggingProduct)}
                  className="text-xs text-[#326BFF] font-bold"
                >
                  {isTaggingProduct ? 'Close' : '+ Select Product'}
                </button>
              </div>

              {isTaggingProduct && (
                <div className="space-y-1.5 pt-1">
                  {MOCK_PRODUCTS.slice(0, 3).map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => {
                        setSelectedProduct(prod);
                        setIsTaggingProduct(false);
                      }}
                      className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer ${
                        selectedProduct?.id === prod.id
                          ? 'bg-[#326BFF]/20 border-[#326BFF]'
                          : 'bg-[#181B22] border-[#292E38] hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={prod.images[0]} alt="" className="w-7 h-7 rounded object-cover" />
                        <span className="text-xs text-white truncate">{prod.title}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#22C55E]">
                        ₹{prod.price}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {selectedProduct && !isTaggingProduct && (
                <div className="flex items-center justify-between text-xs text-[#22C55E] font-mono">
                  <span>Tagged: {selectedProduct.title}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="text-neutral-400 hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions: Audience + Publish Frame */}
        <div className="p-4 border-t border-[#292E38] bg-[#101217] flex items-center justify-between gap-3">
          {/* Audience Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAudienceMenu(!showAudienceMenu)}
              className="px-3 py-2 rounded-xl bg-[#181B22] border border-[#292E38] text-xs font-bold text-[#F7F8FA] flex items-center gap-1.5"
            >
              {selectedAudience === 'public' && <Globe className="w-3.5 h-3.5 text-[#326BFF]" />}
              {selectedAudience === 'followers' && <Users className="w-3.5 h-3.5 text-[#22C55E]" />}
              {selectedAudience === 'friends' && <Users className="w-3.5 h-3.5 text-[#F59E0B]" />}
              {selectedAudience === 'only_me' && <Lock className="w-3.5 h-3.5 text-[#FF3D52]" />}
              <span className="capitalize">{selectedAudience}</span>
              <ChevronDown className="w-3 h-3 text-[#A7ADB8]" />
            </button>

            {showAudienceMenu && (
              <div className="absolute bottom-12 left-0 w-44 rounded-xl bg-[#181B22] border border-[#292E38] p-1.5 shadow-2xl z-30 space-y-1">
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
                    setSelectedAudience('only_me');
                    setShowAudienceMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs font-semibold text-[#F7F8FA] flex items-center gap-2 hover:bg-[#20242E]"
                >
                  <Lock className="w-3.5 h-3.5 text-[#FF3D52]" />
                  <span>Only Me</span>
                </button>
              </div>
            )}
          </div>

          {/* Publish Frame CTA Button */}
          <button
            type="button"
            onClick={handlePublish}
            className="flex-1 h-11 px-5 rounded-xl bg-[#326BFF] hover:bg-[#467BFF] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(50,107,255,0.4)] transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Publish Frame</span>
            <Sparkles className="w-4 h-4 fill-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
