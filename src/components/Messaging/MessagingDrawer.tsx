import React from 'react';
import { X } from 'lucide-react';
import { Conversation, User, Product } from '../../types';
import { ChatPageView } from './ChatPageView';

interface MessagingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  currentUser: User;
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const MessagingDrawer: React.FC<MessagingDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSelectProduct,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 font-['Plus_Jakarta_Sans'] animate-in fade-in duration-200">
      {/* Modal Container: Luxury Dark Obsidian & Starry Sapphire Theme */}
      <div className="w-full max-w-5xl h-[92vh] sm:h-[88vh] bg-[#02060E] rounded-t-[32px] sm:rounded-[36px] overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_30px_rgba(3,86,197,0.25)] flex flex-col relative border border-[#2B5C92]/40">
        {/* Floating Close Button at top right */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-4 z-40 p-2 rounded-2xl bg-[#0C1446]/80 hover:bg-rose-950/70 text-[#B3CDE0] hover:text-rose-400 shadow-lg border border-[#2B5C92]/40 transition-all cursor-pointer backdrop-blur-md"
          title="Close Messages"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Embedded Dark Glassy Chat Page */}
        <div className="flex-1 w-full h-full overflow-hidden">
          <ChatPageView
            currentUser={currentUser}
            onBackToHome={onClose}
            onSelectProduct={onSelectProduct}
            onAddToCart={onAddToCart}
            isDrawerMode={true}
          />
        </div>
      </div>
    </div>
  );
};
