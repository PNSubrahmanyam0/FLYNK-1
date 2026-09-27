import React from 'react';
import { ExternalLink } from 'lucide-react';

interface ClickableTextWithLinksProps {
  text: string;
  className?: string;
  linkClassName?: string;
  onMentionClick?: (handle: string) => void;
}

export const ClickableTextWithLinks: React.FC<ClickableTextWithLinksProps> = ({
  text,
  className = '',
  linkClassName = 'text-red-400 hover:text-red-300 underline font-medium inline-flex items-center gap-0.5',
  onMentionClick,
}) => {
  if (!text) return null;

  // Regex to detect URLs (http:// or https://) or @mentions
  const tokenRegex = /(https?:\/\/[^\s]+|@[a-zA-Z0-9_.-]+)/g;

  const parts = text.split(tokenRegex);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (!part) return null;

        // Is it a URL?
        if (part.startsWith('http://') || part.startsWith('https://')) {
          let displayUrl = part;
          try {
            const urlObj = new URL(part);
            displayUrl = urlObj.hostname + (urlObj.pathname.length > 1 ? urlObj.pathname.slice(0, 15) + '…' : '');
          } catch (e) {
            displayUrl = part.length > 25 ? part.slice(0, 22) + '…' : part;
          }

          return (
            <a
              key={index}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`${linkClassName} transition-colors mx-0.5`}
              title={part}
            >
              <span>{displayUrl}</span>
              <ExternalLink className="w-3 h-3 shrink-0 inline ml-0.5 opacity-80" />
            </a>
          );
        }

        // Is it an @mention?
        if (part.startsWith('@')) {
          const handle = part.slice(1);
          return (
            <span
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                if (onMentionClick) onMentionClick(handle);
              }}
              className="text-red-400 hover:text-red-300 font-semibold cursor-pointer transition-colors"
            >
              {part}
            </span>
          );
        }

        // Regular text
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
};
