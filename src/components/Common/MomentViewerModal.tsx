import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  MoreVertical,
  Play,
  ShoppingBag,
  Calendar,
  Send,
  Heart,
  Eye,
  Trash2,
  Share2,
  ShieldAlert,
  Volume2,
  VolumeX,
  ChevronRight,
  ExternalLink,
  Briefcase,
  MapPin,
  Clock,
} from 'lucide-react';
import { Moment, Product, LongVideo } from '../../types';

interface MomentViewerModalProps {
  isOpen: boolean;
  moments: Moment[];
  initialMomentIndex?: number;
  isOwner?: boolean;
  onClose: () => void;
  onWatchFullVideo?: (video: LongVideo) => void;
  onSelectProduct?: (product: Product) => void;
  onBookAppointment?: (targetId: string) => void;
  onRequestQuote?: () => void;
  onDeleteMoment?: (momentId: string) => void;
  onReplyMoment?: (momentId: string, text: string) => void;
  onMomentViewed?: (momentId: string) => void;
}

export const MomentViewerModal: React.FC<MomentViewerModalProps> = ({
  isOpen,
  moments,
  initialMomentIndex = 0,
  isOwner = false,
  onClose,
  onWatchFullVideo,
  onSelectProduct,
  onBookAppointment,
  onRequestQuote,
  onDeleteMoment,
  onReplyMoment,
  onMomentViewed,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialMomentIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentMoment = moments[currentIndex] || moments[0];

  useEffect(() => {
    setCurrentIndex(initialMomentIndex);
    setProgress(0);
  }, [initialMomentIndex, isOpen]);

  // Mark current moment as viewed
  useEffect(() => {
    if (isOpen && currentMoment) {
      onMomentViewed?.(currentMoment.id);
    }
  }, [isOpen, currentMoment, onMomentViewed]);

  // Timer loop for progress bar
  useEffect(() => {
    if (!isOpen || isPaused || showMoreMenu || showAnalytics) return;

    const duration = (currentMoment?.durationSeconds || 5) * 1000;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Advance to next
          if (currentIndex < moments.length - 1) {
            setCurrentIndex((idx) => idx + 1);
            return 0;
          } else {
            // Reached end of moments
            clearInterval(timer);
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, currentIndex, moments.length, showMoreMenu, showAnalytics, currentMoment, onClose]);

  // Reset progress when changing index
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleNext = () => {
    if (currentIndex < moments.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReplyMoment?.(currentMoment.id, replyText);
    showToast(`Reply sent to ${currentMoment.authorName} as private DM`);
    setReplyText('');
  };

  if (!isOpen || !currentMoment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl select-none animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 z-50 px-4 py-2 rounded-full bg-black/85 border border-[#326BFF]/50 text-white text-xs font-semibold shadow-2xl backdrop-blur-md animate-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Main 9:16 Moment Canvas */}
      <div
        className="relative w-full h-full max-w-[430px] max-h-[920px] bg-[#101217] sm:rounded-[32px] overflow-hidden flex flex-col justify-between shadow-[0_25px_80px_rgba(0,0,0,0.9)] border border-[#292E38]"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background Visual Media */}
        <div className="absolute inset-0 bg-[#101217]">
          {currentMoment.mediaUrl ? (
            <img
              src={currentMoment.mediaUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center p-8 bg-gradient-to-tr ${
                currentMoment.bgGradient || 'from-[#101217] via-[#1e1b4b] to-[#326BFF]'
              }`}
            >
              <p className="text-xl sm:text-2xl font-bold text-center text-white font-['Syne'] leading-relaxed">
                {currentMoment.textContent}
              </p>
            </div>
          )}
          {/* Gradients for UI legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/85 pointer-events-none" />
        </div>

        {/* ================= TOP SECTION: PROGRESS BARS & HEADER ================= */}
        <div className="relative z-20 pt-3 sm:pt-4 px-3 sm:px-4 space-y-2.5">
          {/* Multi-Segment Progress Bars */}
          <div className="flex items-center gap-1.5 w-full">
            {moments.map((m, idx) => {
              let fillWidth = '0%';
              if (idx < currentIndex) fillWidth = '100%';
              else if (idx === currentIndex) fillWidth = `${progress}%`;

              return (
                <div
                  key={m.id}
                  className="h-1 flex-1 bg-white/25 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-white transition-all duration-75"
                    style={{ width: fillWidth }}
                  />
                </div>
              );
            })}
          </div>

          {/* Moment Author Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Avatar with Moment Ring */}
              <div className="relative w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-[#326BFF] via-[#8B5CF6] to-[#FF3D52] shrink-0">
                <img
                  src={currentMoment.authorAvatar}
                  alt={currentMoment.authorName}
                  className="w-full h-full rounded-full object-cover border border-[#101217]"
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs sm:text-sm text-[#F7F8FA] truncate font-['Syne']">
                    {currentMoment.authorName}
                  </span>
                  <span className="text-[11px] text-[#A7ADB8] font-mono">
                    · {currentMoment.createdAt}
                  </span>
                </div>
                {currentMoment.categoryLabel && (
                  <div className="text-[10px] text-[#326BFF] font-medium truncate">
                    {currentMoment.categoryLabel}
                  </div>
                )}
              </div>
            </div>

            {/* Controls: Audio, More, Close */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="w-8 h-8 rounded-full bg-black/50 text-[#F7F8FA] hover:bg-black/70 flex items-center justify-center border border-white/10"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoreMenu(!showMoreMenu);
                }}
                className="w-8 h-8 rounded-full bg-black/50 text-[#F7F8FA] hover:bg-black/70 flex items-center justify-center border border-white/10"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-8 h-8 rounded-full bg-black/50 text-[#F7F8FA] hover:bg-black/70 flex items-center justify-center border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= INVISIBLE TAP ZONES FOR NAVIGATION ================= */}
        <div className="absolute inset-0 z-10 flex">
          {/* Left tap zone: Previous */}
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          />
          {/* Center zone: just pauses on hold */}
          <div className="w-1/3 h-full" />
          {/* Right tap zone: Next */}
          <div
            className="w-1/3 h-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          />
        </div>

        {/* ================= BOTTOM SECTION: CONTEXTUAL ACTIONS & DM REPLY ================= */}
        <div className="relative z-20 p-3 sm:p-4 space-y-2.5">
          {/* Contextual Text Overlay if photo has caption */}
          {currentMoment.mediaUrl && currentMoment.textContent && (
            <div className="p-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-xs sm:text-sm text-[#F7F8FA] leading-relaxed shadow-lg">
              {currentMoment.textContent}
            </div>
          )}

          {/* Context-Specific CTA Button */}
          {currentMoment.ctaType === 'watch_full' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (currentMoment.ctaTargetData) {
                  onWatchFullVideo?.(currentMoment.ctaTargetData);
                  onClose();
                } else {
                  showToast('Opening Full Video...');
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#326BFF] to-[#2557D6] hover:from-[#467BFF] hover:to-[#326BFF] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(50,107,255,0.4)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{currentMoment.ctaLabel || 'Watch Full Video'}</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          )}

          {currentMoment.ctaType === 'view_product' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (currentMoment.ctaTargetData) {
                  onSelectProduct?.(currentMoment.ctaTargetData);
                  onClose();
                } else {
                  showToast('Opening Product in Shop...');
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#326BFF] to-[#2557D6] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(50,107,255,0.4)] transition-all active:scale-[0.98] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{currentMoment.ctaLabel || 'View Product in Shop'}</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          )}

          {currentMoment.ctaType === 'book' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBookAppointment?.(currentMoment.ctaTargetId || 'clinic');
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#326BFF] hover:bg-[#467BFF] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>{currentMoment.ctaLabel || 'Book Appointment'}</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          )}

          {currentMoment.ctaType === 'hire_me' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRequestQuote?.();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#326BFF] hover:bg-[#467BFF] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              <Briefcase className="w-4 h-4" />
              <span>{currentMoment.ctaLabel || 'Request Project Quote'}</span>
              <ChevronRight className="w-4 h-4 ml-auto" />
            </button>
          )}

          {currentMoment.ctaType === 'directions' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showToast('Opening verified directions in Maps...');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#181B22] border border-[#292E38] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#20242E] transition-all cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#326BFF]" />
              <span>{currentMoment.ctaLabel || 'Get Directions'}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-auto text-[#A7ADB8]" />
            </button>
          )}

          {/* Visitor DM Reply Bar (Sends private DM as per specification) */}
          {!isOwner ? (
            <form onSubmit={handleSendReply} className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${currentMoment.authorName}...`}
                  className="w-full py-2.5 px-4 rounded-full bg-black/60 border border-white/20 text-[#F7F8FA] placeholder-[#707681] text-xs focus:outline-none focus:border-[#326BFF] backdrop-blur-md"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <button
                type="submit"
                disabled={!replyText.trim()}
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-full bg-[#326BFF] disabled:bg-[#181B22] text-white flex items-center justify-center disabled:opacity-40 transition-all shrink-0 cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Owner Actions Bar */
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAnalytics(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-white/15 text-xs font-mono font-bold text-[#F7F8FA] hover:bg-black/80"
              >
                <Eye className="w-3.5 h-3.5 text-[#326BFF]" />
                <span>{currentMoment.viewsCount || 142} Views</span>
              </button>

              <div className="flex items-center gap-1">
                <span className="text-[10px] text-[#A7ADB8] font-mono">
                  {currentMoment.audience === 'public' ? '🌐 Public' : '👥 Followers'} · 24h
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ================= MORE OPTIONS POPUP MENU ================= */}
        {showMoreMenu && (
          <div
            className="absolute inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-in fade-in"
            onClick={(e) => {
              e.stopPropagation();
              setShowMoreMenu(false);
            }}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-[#181B22] border border-[#292E38] p-3 space-y-1 shadow-2xl text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-2 border-b border-[#292E38] text-xs font-bold text-[#A7ADB8] uppercase tracking-wider">
                Moment Options
              </div>

              {isOwner ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowAnalytics(true);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-[#20242E] text-left text-xs font-semibold text-[#F7F8FA] flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4 text-[#326BFF]" />
                    <span>View Audience Analytics</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Moment saved to Camera Roll');
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-[#20242E] text-left text-xs font-semibold text-[#F7F8FA] flex items-center gap-2"
                  >
                    <Share2 className="w-4 h-4 text-[#A7ADB8]" />
                    <span>Save to Photos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDeleteMoment?.(currentMoment.id);
                      showToast('Moment deleted');
                      setShowMoreMenu(false);
                      onClose();
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-red-500/20 text-left text-xs font-semibold text-[#FF3D52] flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Moment</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      showToast(`Muted Moments from ${currentMoment.authorName}`);
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-[#20242E] text-left text-xs font-semibold text-[#F7F8FA] flex items-center gap-2"
                  >
                    <VolumeX className="w-4 h-4 text-[#A7ADB8]" />
                    <span>Mute Moments</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      showToast('Report submitted for review');
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-red-500/20 text-left text-xs font-semibold text-[#FF3D52] flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Report Moment</span>
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setShowMoreMenu(false)}
                className="w-full mt-2 py-2 rounded-xl bg-[#101217] text-[#A7ADB8] text-xs font-bold text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ================= OWNER ANALYTICS BOTTOM SHEET ================= */}
        {showAnalytics && (
          <div
            className="absolute inset-0 z-30 bg-black/75 backdrop-blur-sm flex items-end justify-center animate-in slide-in-from-bottom duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setShowAnalytics(false);
            }}
          >
            <div
              className="w-full rounded-t-3xl bg-[#181B22] border-t border-[#292E38] p-4 space-y-4 max-h-[70vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-[#292E38] pb-3">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#326BFF]" />
                  <h4 className="text-sm font-bold text-[#F7F8FA] font-['Syne']">
                    Moment Insights & Reach
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAnalytics(false)}
                  className="w-7 h-7 rounded-full bg-[#101217] text-[#A7ADB8] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="p-3 rounded-xl bg-[#101217] border border-[#292E38] text-center">
                  <div className="text-lg font-bold text-[#F7F8FA] font-mono">
                    {currentMoment.viewsCount || 142}
                  </div>
                  <div className="text-[10px] text-[#A7ADB8] mt-0.5">Total Views</div>
                </div>
                <div className="p-3 rounded-xl bg-[#101217] border border-[#292E38] text-center">
                  <div className="text-lg font-bold text-[#326BFF] font-mono">
                    {currentMoment.repliesCount || 8}
                  </div>
                  <div className="text-[10px] text-[#A7ADB8] mt-0.5">DM Replies</div>
                </div>
                <div className="p-3 rounded-xl bg-[#101217] border border-[#292E38] text-center">
                  <div className="text-lg font-bold text-[#22C55E] font-mono">
                    94.2%
                  </div>
                  <div className="text-[10px] text-[#A7ADB8] mt-0.5">Completion</div>
                </div>
              </div>

              {/* Recent Viewers List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#A7ADB8] uppercase tracking-wider font-mono">
                  Recent Viewers
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Nikhil Sen', handle: '@nikhil_cinema', time: '12m ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80' },
                    { name: 'Aria Vance', handle: '@aria_vance', time: '45m ago', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' },
                    { name: 'Chef Kabir Rao', handle: '@kabir_kitchen', time: '1h ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80' },
                  ].map((v) => (
                    <div key={v.handle} className="flex items-center justify-between p-2 rounded-xl bg-[#101217]">
                      <div className="flex items-center gap-2.5">
                        <img src={v.avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <div className="text-xs font-bold text-[#F7F8FA]">{v.name}</div>
                          <div className="text-[10px] text-[#A7ADB8] font-mono">{v.handle}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#707681] font-mono">{v.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
