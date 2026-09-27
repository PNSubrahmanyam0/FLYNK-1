import React, { useState } from 'react';
import { X, Heart, Send, Sparkles, EyeOff, Eye, Pin, ShieldCheck } from 'lucide-react';
import { Comment, User } from '../../types';
import { ClickableTextWithLinks } from '../Common/ClickableTextWithLinks';

interface CommentsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  commentsCount: number;
  currentUser: User;
  uploaderId?: string;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  isOpen,
  onClose,
  videoTitle,
  commentsCount,
  currentUser,
  uploaderId,
}) => {
  const isUploader = uploaderId === currentUser.id || currentUser.role === 'creator';

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c_1',
      userId: 'u_101',
      user: {
        id: 'u_101',
        name: 'Tara Rao',
        handle: 'tararao_design',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        role: 'personal',
        verifiedCreator: false,
        verifiedSeller: false,
        followersCount: 890,
        followingCount: 120,
        bio: '',
      },
      content: 'That ice cracking sound gave me chills!! Swiping left to see the full documentary right now at https://flynk.app/c/himalayas-ice',
      likesCount: 342,
      createdAt: '3 hours ago',
      isLiked: true,
      isPinned: true,
      isHidden: false,
    },
    {
      id: 'c_2',
      userId: 'u_102',
      user: {
        id: 'u_102',
        name: 'Arnav Kapoor',
        handle: 'arnav_cuts',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        role: 'creator',
        verifiedCreator: true,
        verifiedSeller: false,
        followersCount: 14200,
        followingCount: 300,
        bio: '',
      },
      content: 'The 30-sec trailer is cut so sharply. What focal length was that drone flyby at 0:18? Check my portfolio at https://arnav.film',
      likesCount: 128,
      createdAt: '5 hours ago',
      isLiked: false,
      isHidden: false,
    },
    {
      id: 'c_3',
      userId: 'u_103',
      user: {
        id: 'u_103',
        name: 'Ritu Varma',
        handle: 'ritu_styles',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        role: 'personal',
        verifiedCreator: false,
        verifiedSeller: false,
        followersCount: 450,
        followingCount: 90,
        bio: '',
      },
      content: 'Bought the tagged gear from the shop tab. Arrived in 2 days with escrow status, super smooth.',
      likesCount: 84,
      createdAt: '1 day ago',
      isLiked: false,
      isHidden: false,
    },
    {
      id: 'c_4',
      userId: 'u_spammer',
      user: {
        id: 'u_spammer',
        name: 'Bot Account',
        handle: 'free_crypto_promo',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role: 'personal',
        verifiedCreator: false,
        verifiedSeller: false,
        followersCount: 2,
        followingCount: 500,
        bio: '',
      },
      content: 'Spam promotional link: http://sketchy-free-tokens.com/win-1000 - do not click',
      likesCount: 0,
      createdAt: '2 days ago',
      isLiked: false,
      isHidden: true,
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'hidden_only'>('all');

  if (!isOpen) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: Comment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      user: currentUser,
      content: newComment.trim(),
      likesCount: 1,
      createdAt: 'Just now',
      isLiked: true,
      isHidden: false,
    };

    setComments([added, ...comments]);
    setNewComment('');
  };

  const toggleLike = (id: string) => {
    setComments(
      comments.map((c) =>
        c.id === id
          ? {
              ...c,
              isLiked: !c.isLiked,
              likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1,
            }
          : c
      )
    );
  };

  // Uploader Moderation: Hide / Unhide bad comments
  const toggleHideComment = (id: string) => {
    setComments(
      comments.map((c) =>
        c.id === id ? { ...c, isHidden: !c.isHidden } : c
      )
    );
  };

  // Uploader Moderation: Pin / Unpin comment
  const togglePinComment = (id: string) => {
    setComments(
      comments.map((c) =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c
      )
    );
  };

  // Filter comments for public vs uploader view
  const visibleComments = comments.filter((c) => {
    if (filterMode === 'hidden_only') return c.isHidden;
    // If user is uploader, they can see all (including hidden flagged ones); normal users only see unhidden
    return isUploader ? true : !c.isHidden;
  });

  const hiddenCount = comments.filter((c) => c.isHidden).length;

  return (
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
      {/* Backdrop tap to close */}
      <div className="flex-1" onClick={onClose} />

      <div className="bg-[#0e0406]/90 border-t border-red-500/30 rounded-t-3xl max-h-[75%] h-[540px] flex flex-col shadow-[0_-10px_40px_rgba(220,38,38,0.25)] backdrop-blur-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-red-500/20 bg-[#140508]/80">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base font-['Syne']">Comments & Notes</h3>
              <span className="text-xs text-neutral-400 font-mono tabular-nums">
                · {visibleComments.length}
              </span>
              {isUploader && hiddenCount > 0 && (
                <span className="text-[10px] bg-red-950/70 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-mono font-semibold">
                  {hiddenCount} hidden by you
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 truncate max-w-[280px] mt-0.5">
              {videoTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-red-950/50 border border-red-500/20 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Uploader Moderation Controls Bar */}
        {isUploader && (
          <div className="px-4 py-2 bg-red-950/40 border-b border-red-500/20 flex items-center justify-between text-xs">
            <span className="text-[11px] text-neutral-300 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              <span>Creator Moderation Mode</span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-950/50 text-neutral-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterMode('hidden_only')}
                className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  filterMode === 'hidden_only'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-950/50 text-neutral-400 hover:text-white'
                }`}
              >
                <EyeOff className="w-3 h-3" />
                <span>Hidden ({hiddenCount})</span>
              </button>
            </div>
          </div>
        )}

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {visibleComments.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs">
              {filterMode === 'hidden_only'
                ? 'No comments currently hidden.'
                : 'No comments yet. Start the conversation!'}
            </div>
          ) : (
            visibleComments.map((comment) => (
              <div
                key={comment.id}
                className={`flex gap-3 items-start group p-2.5 rounded-2xl transition-all ${
                  comment.isHidden
                    ? 'bg-red-950/30 border border-red-500/30 opacity-75'
                    : comment.isPinned
                    ? 'bg-red-950/20 border border-red-500/25'
                    : ''
                }`}
              >
                <img
                  src={comment.user.avatar}
                  alt={comment.user.name}
                  className="w-9 h-9 rounded-full object-cover border border-red-500/30 shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-xs text-neutral-200">
                      @{comment.user.handle}
                    </span>
                    {comment.user.verifiedCreator && (
                      <span className="text-[11px] text-red-400 font-medium">
                        · Creator
                      </span>
                    )}
                    {comment.isPinned && (
                      <span className="text-[10px] bg-red-600/30 text-red-300 border border-red-500/40 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                        <Pin className="w-2.5 h-2.5" /> Pinned
                      </span>
                    )}
                    {comment.isHidden && (
                      <span className="text-[10px] bg-neutral-800 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-mono font-bold flex items-center gap-0.5">
                        <EyeOff className="w-2.5 h-2.5" /> Hidden by Uploader
                      </span>
                    )}
                    <span className="text-neutral-600 text-xs">·</span>
                    <span className="text-[11px] text-neutral-500">{comment.createdAt}</span>
                  </div>

                  {/* Comment Text with clickable URLs and mentions */}
                  <p className="text-neutral-200 text-xs mt-1 leading-relaxed break-words">
                    <ClickableTextWithLinks text={comment.content} />
                  </p>

                  {/* Uploader Moderation Action Buttons */}
                  {isUploader && (
                    <div className="flex items-center gap-2 mt-2 pt-1 border-t border-red-500/15 text-[11px]">
                      <button
                        onClick={() => toggleHideComment(comment.id)}
                        className={`inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                          comment.isHidden
                            ? 'text-emerald-400 hover:text-emerald-300'
                            : 'text-neutral-400 hover:text-red-400'
                        }`}
                        title={comment.isHidden ? 'Unhide comment' : 'Hide bad comment from public'}
                      >
                        {comment.isHidden ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Unhide for Public</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Hide Bad Comment</span>
                          </>
                        )}
                      </button>

                      <span className="text-neutral-700">·</span>

                      <button
                        onClick={() => togglePinComment(comment.id)}
                        className={`inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                          comment.isPinned ? 'text-red-400' : 'text-neutral-400 hover:text-white'
                        }`}
                        title="Pin comment to top"
                      >
                        <Pin className="w-3 h-3" />
                        <span>{comment.isPinned ? 'Unpin' : 'Pin'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => toggleLike(comment.id)}
                  className="flex flex-col items-center gap-1 text-neutral-400 hover:text-red-400 pt-1 shrink-0 cursor-pointer"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      comment.isLiked
                        ? 'fill-red-500 text-red-500 scale-110'
                        : 'text-neutral-400'
                    } transition-transform`}
                  />
                  <span className="text-[10px]">{comment.likesCount}</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Input bar */}
        <form
          onSubmit={handleAddComment}
          className="p-3 border-t border-red-500/20 bg-[#0e0406]/95 backdrop-blur-xl flex items-center gap-2"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-red-500/30"
          />
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a remark (links https://... will be clickable)..."
            className="flex-1 bg-red-950/20 border border-red-500/25 rounded-full px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-colors"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-red-600 to-rose-600 disabled:opacity-40 text-white flex items-center justify-center hover:from-red-500 hover:to-rose-500 transition-all shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.4)] cursor-pointer"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
