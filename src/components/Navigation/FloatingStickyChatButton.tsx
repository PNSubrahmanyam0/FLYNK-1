import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { AccountContext } from '../../types/account';

interface FloatingStickyChatButtonProps {
  activeContext: AccountContext;
  unreadCount?: number;
  activeTab: string;
  isFlickFullscreen?: boolean;
  isMomentViewerOpen?: boolean;
  isFullVideoFullscreen?: boolean;
  isCreateModalOpen?: boolean;
  isCheckoutOpen?: boolean;
  onOpenInbox: (contextMode: string) => void;
}

export const FloatingStickyChatButton: React.FC<FloatingStickyChatButtonProps> = ({
  activeContext,
  unreadCount = 2,
  activeTab,
  isFlickFullscreen = false,
  isMomentViewerOpen = false,
  isFullVideoFullscreen = false,
  isCreateModalOpen = false,
  isCheckoutOpen = false,
  onOpenInbox,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Rule 7 & 191: Suppress sticky chat button on fullscreen media, chat tab, creation, and checkout
  const shouldHide =
    activeTab === 'chat' ||
    activeTab === 'shorts' ||
    isFlickFullscreen ||
    isMomentViewerOpen ||
    isFullVideoFullscreen ||
    isCreateModalOpen ||
    isCheckoutOpen;

  if (shouldHide) return null;

  // Rule 5: Context-aware inbox label
  const getContextInboxLabel = () => {
    switch (activeContext.mode) {
      case 'personal':
        return 'Personal Inbox';
      case 'creator':
        return 'Creator Messages';
      case 'shop':
        return 'Customer Inquiries & Orders';
      case 'business':
        return 'Business Leads & Bookings';
      case 'professional':
        return 'Project Quotes & Inquiries';
      default:
        return 'Messages & Leads';
    }
  };

  return (
    <div
      className="fixed z-40 flex items-center gap-2 pointer-events-auto transition-all duration-200"
      style={{
        bottom: '88px', // Rules 2: 80-88dp above bottom safe edge
        right: '16px', // Rule 2: 16dp right margin
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Context tooltip on hover/focus */}
      {isHovered && (
        <div className="hidden sm:flex items-center px-3 py-1.5 rounded-xl bg-[#181B22] border border-[#292E38] text-white text-[11px] font-medium shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-right-2">
          <span>{getContextInboxLabel()}</span>
        </div>
      )}

      {/* Rules 3 & 4: 52x52dp circle, FLYNK Blue (#326BFF), 24dp white chat bubble, Red (#FF3D52) unread badge */}
      <div className="relative">
        <button
          type="button"
          onClick={() => onOpenInbox(activeContext.mode)}
          className="w-[52px] h-[52px] min-w-[52px] min-h-[52px] rounded-full bg-[#326BFF] hover:bg-[#2558E8] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(50,107,255,0.45)] hover:shadow-[0_6px_25px_rgba(50,107,255,0.6)] cursor-pointer active:scale-95 transition-all select-none focus:outline-none focus:ring-2 focus:ring-[#326BFF]/50"
          style={{ width: '52px', height: '52px' }}
          title={`${getContextInboxLabel()} (${unreadCount} unread)`}
          aria-label={getContextInboxLabel()}
        >
          <MessageSquare className="w-6 h-6 stroke-[2.2] text-white drop-shadow-sm" />
        </button>

        {/* Rule 4: Red Unread Badge (#FF3D52) */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1 rounded-full bg-[#FF3D52] text-white text-[10px] font-bold font-mono flex items-center justify-center border-2 border-[#101217] shadow-[0_2px_8px_rgba(255,61,82,0.6)] pointer-events-none animate-in zoom-in">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </div>
    </div>
  );
};
