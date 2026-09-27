import React from 'react';
import { User, Product } from '../../types';
import { ChatPageView } from './ChatPageView';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'contact';
  senderName: string;
  text: string;
  timestamp: string;
  avatar?: string;
  product?: Product;
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: string;
  lastTime?: string;
  badge?: {
    count?: number | string;
    type: 'red' | 'blue' | 'grey';
  };
  isOnline?: boolean;
  role?: string;
  messages: ChatMessage[];
}

interface NeumorphicChatPageProps {
  currentUser: User;
  onBackToHome?: () => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  initialContactId?: string;
}

/**
 * NeumorphicChatPage redirects to the restored previous version of FLYNK Encrypted Chat
 * (Dark Luxury Starry Sapphire & 256-bit Encrypted messaging).
 */
export const NeumorphicChatPage: React.FC<NeumorphicChatPageProps> = ({
  currentUser,
  onBackToHome,
  onSelectProduct,
  onAddToCart,
}) => {
  return (
    <ChatPageView
      currentUser={currentUser}
      onBackToHome={onBackToHome}
      onSelectProduct={onSelectProduct}
      onAddToCart={onAddToCart}
    />
  );
};
