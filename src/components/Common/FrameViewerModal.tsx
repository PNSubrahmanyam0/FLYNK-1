import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Tag,
  ShoppingBag,
  MoreVertical,
  Send,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { Frame, Product } from '../../types';

interface FrameViewerModalProps {
  isOpen: boolean;
  frame: Frame | null;
  isOwner?: boolean;
  onClose: () => void;
  onToggleLike?: (frameId: string) => void;
  onToggleSave?: (frameId: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const FrameViewerModal: React.FC<FrameViewerModalProps> = ({
  isOpen,
  frame,
  isOwner = false,
  onClose,
  onToggleLike,
  onToggleSave,
  onSelectProduct,
}) => {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isLiked, setIsLiked] = useState(frame?.isLiked || false);
  const [likesCount, setLikesCount] = useState(frame?.likesCount || 0);
  const [isSaved, setIsSaved] = useState(frame?.isSaved || false);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<string[]>([
    'Amazing composition! The color grade is unreal 🔥',
    'Where exactly was this shot taken?',
  ]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen || !frame) return null;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((c) => Math.max(0, c - 1));
    } else {
      setIsLiked(true);
      setLikesCount((c) => c + 1);
    }
    onToggleLike?.(frame.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    showToast(isSaved ? 'Removed from Saved Frames' : 'Saved to Saved Frames');
    onToggleSave?.(frame.id);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setComments((prev) => [...prev, commentInput]);
    setCommentInput('');
    showToast('Comment posted');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-0 sm:p-4 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="absolute top-16 z-50 px-4 py-2 rounded-full bg-black/85 border border-[#326BFF]/50 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-top-2">
          {toastMsg}
        </div>
      )}

      <div className="relative w-full max-w-4xl h-full sm:h-auto max-h-[92vh] bg-[#101217] sm:rounded-[32px] overflow-hidden border border-[#292E38] shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col md:flex-row">
        {/* Close Button Mobile/Global */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/60 text-[#F7F8FA] hover:bg-black/90 flex items-center justify-center border border-white/10 md:hidden"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ================= LEFT / TOP: MEDIA CAROUSEL (DARK SURFACE) ================= */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[420px] md:min-h-[550px] overflow-hidden">
          <img
            src={frame.images[activeImageIdx] || frame.images[0]}
            alt={frame.caption}
            className="w-full h-full max-h-[600px] object-contain"
          />

          {/* Carousel Arrows if multiple images */}
          {frame.images.length > 1 && (
            <>
              {activeImageIdx > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveImageIdx((i) => i - 1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/15 shadow-md cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {activeImageIdx < frame.images.length - 1 && (
                <button
                  type="button"
                  onClick={() => setActiveImageIdx((i) => i + 1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center border border-white/15 shadow-md cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* Slide Counter Pill */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[11px] font-mono font-bold text-white border border-white/10">
                {activeImageIdx + 1} / {frame.images.length}
              </div>
            </>
          )}
        </div>

        {/* ================= RIGHT / BOTTOM: METADATA & COMMENTS ================= */}
        <div className="w-full md:w-[380px] bg-[#181B22] flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#292E38]">
          {/* Header */}
          <div className="p-3.5 sm:p-4 border-b border-[#292E38] flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={frame.authorAvatar}
                alt={frame.authorName}
                className="w-10 h-10 rounded-full object-cover border border-[#292E38]"
              />
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-sm text-[#F7F8FA] font-['Syne'] truncate">
                  {frame.authorName}
                </div>
                {frame.location && (
                  <div className="text-[11px] text-[#A7ADB8] flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-[#326BFF]" />
                    <span>{frame.location}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="hidden md:flex w-8 h-8 rounded-full bg-[#101217] text-[#A7ADB8] hover:text-white items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content: Caption + Tagged Products + Comments */}
          <div className="p-3.5 sm:p-4 flex-1 overflow-y-auto space-y-3.5 no-scrollbar max-h-[300px] md:max-h-[380px]">
            {/* Caption */}
            <div className="space-y-1">
              <div className="text-xs sm:text-sm text-[#F7F8FA] leading-relaxed">
                <span className="font-bold mr-1.5 text-white font-['Syne']">{frame.authorName}</span>
                {frame.caption}
              </div>
              <div className="text-[10px] text-[#707681] font-mono">{frame.createdAt} · Permanent Frame</div>
            </div>

            {/* Tagged Product Pill (If Frame has tagged commerce products) */}
            {frame.taggedProducts && frame.taggedProducts.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] text-[#A7ADB8] font-mono flex items-center gap-1">
                  <Tag className="w-3 h-3 text-[#326BFF]" />
                  <span>Featured Product in this Frame:</span>
                </div>
                {frame.taggedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct?.(prod);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-[#101217] hover:bg-[#13161d] border border-[#292E38] hover:border-[#326BFF]/40 flex items-center justify-between gap-2.5 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img src={prod.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#F7F8FA] truncate font-['Syne']">
                          {prod.title}
                        </div>
                        <div className="text-[11px] font-mono font-bold text-[#22C55E]">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-lg bg-[#326BFF] text-white text-[10px] font-bold flex items-center gap-1 shadow-sm shrink-0"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>View</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-2 pt-2 border-t border-[#292E38]">
              <div className="text-[11px] font-bold text-[#A7ADB8] uppercase tracking-wider font-mono">
                Comments ({comments.length})
              </div>
              {comments.map((c, i) => (
                <div key={i} className="text-xs text-[#F7F8FA] flex items-start gap-2">
                  <span className="font-bold text-neutral-400 font-mono text-[11px]">
                    user_{i + 1}:
                  </span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Bar & Comment Input */}
          <div className="p-3.5 sm:p-4 border-t border-[#292E38] bg-[#101217] space-y-2.5">
            {/* Social Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleLike}
                  className="flex items-center gap-1 text-white hover:text-[#FF3D52] transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isLiked ? 'fill-[#FF3D52] text-[#FF3D52]' : 'text-white'
                    }`}
                  />
                  <span className="text-xs font-mono font-bold">{likesCount}</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast('Share link copied to clipboard')}
                  className="flex items-center gap-1 text-white hover:text-[#326BFF] transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleSave}
                className="text-white hover:text-[#326BFF] transition-colors"
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    isSaved ? 'fill-[#326BFF] text-[#326BFF]' : 'text-white'
                  }`}
                />
              </button>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment to this Frame..."
                className="flex-1 py-2 px-3 rounded-xl bg-[#181B22] border border-[#292E38] text-xs text-[#F7F8FA] placeholder-[#707681] focus:outline-none focus:border-[#326BFF]"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="w-8 h-8 rounded-xl bg-[#326BFF] disabled:bg-[#181B22] text-white flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
