import React from 'react';
import { User, Product, ShortVideo, LongVideo, Series, Moment } from '../../types';
import { UserProfileView } from './UserProfileView';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  isCurrentUser?: boolean;
  products?: Product[];
  shorts?: ShortVideo[];
  longVideos?: LongVideo[];
  series?: Series[];
  activeMoments?: Moment[];
  initialTab?: 'flicks' | 'long' | 'series' | 'shop' | 'reviews';
  onOpenStudio?: () => void;
  onOpenOrders?: () => void;
  onOpenStore?: () => void;
  onOpenAuth?: () => void;
  onOpenEarnings?: () => void;
  onUpdateUser?: (updated: User) => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  onSelectShort?: (short: ShortVideo) => void;
  onSelectLongVideo?: (longVideo: LongVideo) => void;
  onStartChat?: (creator: User) => void;
  onOpenBooking?: (targetName: string, targetHandle: string, sector?: any, spec?: any) => void;
  onOpenSingTogether?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  isCurrentUser = true,
  products = [],
  shorts = [],
  longVideos = [],
  series = [],
  activeMoments,
  initialTab,
  onOpenStudio,
  onOpenOrders,
  onOpenStore,
  onOpenAuth,
  onOpenEarnings,
  onUpdateUser,
  onSelectProduct,
  onAddToCart,
  onSelectShort,
  onSelectLongVideo,
  onStartChat,
  onOpenBooking,
  onOpenSingTogether,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full sm:max-w-xl max-h-[92vh] sm:max-h-[88vh] bg-[#080205] border border-neutral-800/80 sm:rounded-[32px] rounded-t-[32px] shadow-[0_20px_70px_rgba(0,0,0,0.85),0_0_30px_rgba(244,63,94,0.15)] backdrop-blur-2xl flex flex-col overflow-y-auto z-10 animate-in slide-in-from-bottom-3 duration-200 no-scrollbar">
        <UserProfileView
          user={user}
          isCurrentUser={isCurrentUser}
          products={products}
          shorts={shorts}
          longVideos={longVideos}
          series={series}
          activeMoments={activeMoments}
          initialTab={initialTab}
          onBack={onClose}
          onOpenStudio={() => {
            onClose();
            onOpenStudio?.();
          }}
          onOpenOrders={() => {
            onClose();
            onOpenOrders?.();
          }}
          onOpenStore={() => {
            onClose();
            onOpenStore?.();
          }}
          onOpenAuth={() => {
            onClose();
            onOpenAuth?.();
          }}
          onOpenEarnings={() => {
            onClose();
            onOpenEarnings?.();
          }}
          onUpdateUser={onUpdateUser}
          onSelectProduct={(p) => {
            onClose();
            onSelectProduct?.(p);
          }}
          onAddToCart={onAddToCart}
          onSelectShort={(s) => {
            onClose();
            onSelectShort?.(s);
          }}
          onSelectLongVideo={(lv) => {
            onClose();
            onSelectLongVideo?.(lv);
          }}
          onStartChat={(c) => {
            onClose();
            onStartChat?.(c);
          }}
          onOpenBooking={(name, handle, sector, spec) => {
            onClose();
            onOpenBooking?.(name, handle, sector, spec);
          }}
          onOpenSingTogether={() => {
            onClose();
            onOpenSingTogether?.();
          }}
          isModal={true}
        />
      </div>
    </div>
  );
};
