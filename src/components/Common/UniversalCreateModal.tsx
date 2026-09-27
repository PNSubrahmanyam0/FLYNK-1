import React from 'react';
import {
  X,
  PlaySquare,
  Film,
  Music,
  ShoppingBag,
  Tag,
  Briefcase,
  Layers,
  Sparkles,
  Link as LinkIcon,
  ChevronRight,
  Stethoscope,
  Building,
  Utensils,
  Image as ImageIcon,
  Calendar,
  Users,
  FileText,
  Clock,
  Award,
} from 'lucide-react';
import { AccountContext } from '../../types/account';

interface UniversalCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeContext: AccountContext;
  onSelectAction: (
    action:
      | 'create_flick'
      | 'create_long_video'
      | 'create_moment'
      | 'create_frame'
      | 'create_series'
      | 'link_flick_to_long'
      | 'sing_together'
      | 'add_product'
      | 'tag_product'
      | 'business_update'
      | 'company_update'
      | 'create_collection'
      | 'add_portfolio'
      | 'add_service'
      | 'add_property'
      | 'add_menu_item'
      | 'manage_drafts'
      | 'collaboration'
  ) => void;
}

export const UniversalCreateModal: React.FC<UniversalCreateModalProps> = ({
  isOpen,
  onClose,
  activeContext,
  onSelectAction,
}) => {
  if (!isOpen) return null;

  const mode = activeContext.mode;
  const sector = activeContext.sector;
  const specialization = activeContext.specialization;

  // Build the dynamic actions strictly per Account Mode according to Rules 11-16
  const actions: Array<{
    id: any;
    title: string;
    description: string;
    icon: any;
    badge?: string;
    gradient: string;
  }> = [];

  if (mode === 'personal') {
    // Rule 12: PERSONAL CREATE MENU
    // Flick, Full Video, Frame, Moment, Sing
    actions.push(
      {
        id: 'create_flick',
        title: 'Flick',
        description: 'Fast, vertical short-form video with audio & swipe velocity',
        icon: PlaySquare,
        badge: 'SHORT',
        gradient: 'from-[#326BFF] to-[#2558E8]',
      },
      {
        id: 'create_long_video',
        title: 'Full Video',
        description: 'Long-form cinema, vlog, or documentary',
        icon: Film,
        badge: 'FULL',
        gradient: 'from-amber-600 to-orange-600',
      },
      {
        id: 'create_frame',
        title: 'Frame',
        description: 'Permanent lifestyle photo, multi-image carousel, or graphic update',
        icon: ImageIcon,
        badge: 'POST',
        gradient: 'from-[#181B22] to-[#326BFF]',
      },
      {
        id: 'create_moment',
        title: 'Moment (24h)',
        description: 'Temporary story representing everyday activity on your avatar ring',
        icon: Sparkles,
        badge: '24H',
        gradient: 'from-[#326BFF] via-[#8B5CF6] to-[#FF3D52]',
      },
      {
        id: 'sing_together',
        title: 'Sing Together',
        description: 'Karaoke room with synced lyrics, transliteration & multicam jam',
        icon: Music,
        badge: 'SING',
        gradient: 'from-rose-600 to-pink-600',
      }
    );
  } else if (mode === 'creator') {
    // Rule 13: CREATOR CREATE MENU
    // Flick, Full Video, Frame, Moment, Series, Collaboration, Product Content, Drafts
    actions.push(
      {
        id: 'create_flick',
        title: 'Flick',
        description: 'Short vertical video trailer or standalone short',
        icon: PlaySquare,
        badge: 'SHORT',
        gradient: 'from-[#326BFF] to-[#2558E8]',
      },
      {
        id: 'create_long_video',
        title: 'Full Video',
        description: 'Cinematic deep-dive, film, or multi-episode premiere',
        icon: Film,
        badge: 'FULL',
        gradient: 'from-amber-600 to-orange-600',
      },
      {
        id: 'create_series',
        title: 'Series / Continuity',
        description: 'Group episodic videos & Flicks into a bingeable sequential series',
        icon: Layers,
        badge: 'SERIES',
        gradient: 'from-purple-600 to-indigo-600',
      },
      {
        id: 'create_frame',
        title: 'Frame',
        description: 'Permanent behind-the-scenes photography or editorial post',
        icon: ImageIcon,
        badge: 'PERMANENT',
        gradient: 'from-[#181B22] to-[#326BFF]',
      },
      {
        id: 'create_moment',
        title: 'Moment (24h)',
        description: 'Ephemeral 24h update linking directly to full videos or products',
        icon: Sparkles,
        badge: '24H',
        gradient: 'from-[#326BFF] via-[#8B5CF6] to-[#FF3D52]',
      },
      {
        id: 'collaboration',
        title: 'Invite Collaborator',
        description: 'Co-author content with another verified creator',
        icon: Users,
        badge: 'CO-AUTH',
        gradient: 'from-emerald-600 to-teal-600',
      },
      {
        id: 'tag_product',
        title: 'Tag Product Content',
        description: 'Attach purchasable merchandise to your Flicks and Fulls',
        icon: Tag,
        badge: 'COMMERCE',
        gradient: 'from-teal-600 to-cyan-600',
      },
      {
        id: 'manage_drafts',
        title: 'Manage Drafts',
        description: 'Resume saved offline video edits and unpublished works',
        icon: FileText,
        badge: 'DRAFTS',
        gradient: 'from-neutral-700 to-neutral-900',
      }
    );
  } else if (mode === 'shop') {
    // Rule 14: SHOP CREATE MENU
    // Add Product, Create Collection, Product Flick, Product Full Video, Product Frame, Shop Moment, Store Update
    actions.push(
      {
        id: 'add_product',
        title: 'Add Product',
        description: 'List store inventory with variants, fabrics, prices & stock levels',
        icon: ShoppingBag,
        badge: 'INVENTORY',
        gradient: 'from-emerald-600 to-teal-600',
      },
      {
        id: 'create_collection',
        title: 'Create Collection',
        description: 'Curate seasonal drops, lookbooks, and featured catalog edits',
        icon: Layers,
        badge: 'COLLECTION',
        gradient: 'from-[#326BFF] to-cyan-600',
      },
      {
        id: 'create_flick',
        title: 'Product Flick',
        description: 'Vertical product demonstration with instant tap-to-buy cart tagging',
        icon: PlaySquare,
        badge: 'COMMERCE FLICK',
        gradient: 'from-rose-600 to-red-600',
      },
      {
        id: 'create_long_video',
        title: 'Product Full Video',
        description: 'Atelier craft showcase, runway documentary, or lookbook walk',
        icon: Film,
        badge: 'LOOKBOOK',
        gradient: 'from-amber-600 to-orange-600',
      },
      {
        id: 'create_frame',
        title: 'Product Frame',
        description: 'Editorial photoshoot, fabric weave macro shots & lookbook carousel',
        icon: ImageIcon,
        badge: 'EDITORIAL',
        gradient: 'from-[#181B22] to-[#326BFF]',
      },
      {
        id: 'create_moment',
        title: 'Shop Moment',
        description: '24h Flash sale alert, restock announcement or behind-the-scenes',
        icon: Sparkles,
        badge: 'FLASH ALERT',
        gradient: 'from-[#326BFF] via-[#8B5CF6] to-[#FF3D52]',
      },
      {
        id: 'business_update',
        title: 'Store Update / Offer',
        description: 'Publish holiday hours, popup locations & verified escrow discounts',
        icon: Briefcase,
        badge: 'STORE UPDATE',
        gradient: 'from-sky-600 to-blue-600',
      }
    );
  } else if (mode === 'business') {
    // Rule 15: BUSINESS CREATE MENU (Sector-aware)
    if (sector === 'doctor_clinic') {
      actions.push({
        id: 'add_service',
        title: 'Add Medical Service / Slot',
        description: 'Configure consultation types, specialist timings and appointment fees',
        icon: Stethoscope,
        badge: 'CLINIC',
        gradient: 'from-sky-600 to-cyan-600',
      });
    } else if (sector === 'real_estate') {
      actions.push({
        id: 'add_property',
        title: 'Add Property Listing',
        description: 'List luxury penthouses, villas, or commercial units with site visits',
        icon: Building,
        badge: 'REALTY',
        gradient: 'from-emerald-600 to-teal-600',
      });
    } else if (sector === 'restaurant') {
      actions.push({
        id: 'add_menu_item',
        title: 'Add Signature Menu Item',
        description: 'Feature culinary items with photos, ingredients & prices',
        icon: Utensils,
        badge: 'MENU',
        gradient: 'from-amber-600 to-yellow-600',
      });
    } else {
      actions.push({
        id: 'add_service',
        title: 'Add Business Service',
        description: 'Configure consulting hours, service catalog, and verified terms',
        icon: Briefcase,
        badge: 'SERVICES',
        gradient: 'from-sky-600 to-blue-600',
      });
    }

    actions.push(
      {
        id: 'create_flick',
        title: 'Business Flick',
        description: 'Quick vertical walkthrough, patient guidance or facility tour',
        icon: PlaySquare,
        badge: 'TOUR',
        gradient: 'from-[#326BFF] to-[#2558E8]',
      },
      {
        id: 'create_long_video',
        title: 'Full Video',
        description: 'In-depth consultation breakdown, case overview or facility tour',
        icon: Film,
        badge: 'FULL',
        gradient: 'from-amber-600 to-orange-600',
      },
      {
        id: 'create_frame',
        title: 'Business Frame',
        description: 'Permanent credentials, clinic milestones or verified certifications',
        icon: ImageIcon,
        badge: 'CREDENTIALS',
        gradient: 'from-[#181B22] to-[#326BFF]',
      },
      {
        id: 'create_moment',
        title: 'Business Moment',
        description: 'Today’s walk-in slot availability or emergency consultation hours',
        icon: Sparkles,
        badge: 'AVAILABILITY',
        gradient: 'from-[#326BFF] via-[#8B5CF6] to-[#FF3D52]',
      },
      {
        id: 'business_update',
        title: 'Availability Update',
        description: 'Real-time schedule announcement or clinic holiday notification',
        icon: Calendar,
        badge: 'SCHEDULE',
        gradient: 'from-teal-600 to-emerald-600',
      }
    );
  } else if (mode === 'professional') {
    // Rule 16: PROFESSIONAL CREATE MENU
    // Add Portfolio Work, Add Service, Flick, Full Video, Frame, Moment, Availability Update, Series
    actions.push(
      {
        id: 'add_portfolio',
        title: 'Add Portfolio Work',
        description: 'Showcase client reels, ACES color grades, motion design or code',
        icon: Award,
        badge: specialization ? specialization.toUpperCase().replace('_', ' ') : 'PORTFOLIO',
        gradient: 'from-indigo-600 to-violet-600',
      },
      {
        id: 'add_service',
        title: 'Add Service / Rate Card',
        description: 'Define pricing packages (e.g. ₹15,000 / video cut, 3 days turnaround)',
        icon: Briefcase,
        badge: 'RATE CARD',
        gradient: 'from-purple-600 to-pink-600',
      },
      {
        id: 'create_flick',
        title: 'Flick',
        description: 'Quick editing breakdown, transition tip, or before/after color reel',
        icon: PlaySquare,
        badge: 'REEL',
        gradient: 'from-[#326BFF] to-[#2558E8]',
      },
      {
        id: 'create_long_video',
        title: 'Full Video',
        description: 'Deep-dive masterclass, DaVinci Resolve color tutorial, or breakdown',
        icon: Film,
        badge: 'MASTERCLASS',
        gradient: 'from-amber-600 to-orange-600',
      },
      {
        id: 'create_series',
        title: 'Educational Series',
        description: 'Structured multi-part chapter series for clients or apprentices',
        icon: Layers,
        badge: 'SERIES',
        gradient: 'from-purple-600 to-indigo-600',
      },
      {
        id: 'create_frame',
        title: 'Frame',
        description: 'Still comparison, node tree screenshot, or verified client delivery',
        icon: ImageIcon,
        badge: 'PROOF',
        gradient: 'from-[#181B22] to-[#326BFF]',
      },
      {
        id: 'create_moment',
        title: 'Professional Moment',
        description: 'Booking open announcement for Q4 client projects',
        icon: Sparkles,
        badge: 'BOOKING OPEN',
        gradient: 'from-[#326BFF] via-[#8B5CF6] to-[#FF3D52]',
      },
      {
        id: 'business_update',
        title: 'Availability Update',
        description: 'Publish calendar opening or direct quote request availability',
        icon: Clock,
        badge: 'CALENDAR',
        gradient: 'from-teal-600 to-cyan-600',
      }
    );
  } else {
    // Fallback default
    actions.push(
      {
        id: 'create_flick',
        title: 'Flick',
        description: 'Fast, vertical short-form video',
        icon: PlaySquare,
        gradient: 'from-[#326BFF] to-[#2558E8]',
      },
      {
        id: 'create_long_video',
        title: 'Full Video',
        description: 'Landscape cinema or long-form video',
        icon: Film,
        gradient: 'from-amber-600 to-orange-600',
      },
      {
        id: 'create_frame',
        title: 'Frame',
        description: 'Permanent photo or carousel post',
        icon: ImageIcon,
        gradient: 'from-[#181B22] to-[#326BFF]',
      },
      {
        id: 'create_moment',
        title: 'Moment (24h)',
        description: 'Temporary story update',
        icon: Sparkles,
        gradient: 'from-[#326BFF] via-[#8B5CF6] to-[#FF3D52]',
      }
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none font-['Plus_Jakarta_Sans']"
      onClick={onClose}
    >
      {/* Rule 10: Elevated Charcoal #181B22, Corner radius top 20-24dp, Top handle 32x4dp */}
      <div
        className="w-full sm:max-w-md bg-[#181B22] border border-[#292E38] rounded-t-[24px] sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top handle: 32x4dp (Rule 10) */}
        <div className="w-8 h-1 bg-[#292E38] rounded-full mx-auto mt-2.5" />

        {/* Header: "Create" (Rule 10) */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-[#292E38]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#326BFF] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white font-['Syne']">
                Create
              </h3>
              <p className="text-[11px] text-[#A7ADB8]">
                Mode: <span className="text-[#326BFF] font-semibold capitalize">{mode}</span> • {activeContext.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#101217] border border-[#292E38] text-[#A7ADB8] hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Action List strictly tailored per Account Mode (Rules 11-16) */}
        <div className="p-4 space-y-2 max-h-[70vh] overflow-y-auto">
          {actions.map((act) => {
            const IconComponent = act.icon;
            return (
              <div
                key={act.id}
                onClick={() => {
                  onSelectAction(act.id);
                  onClose();
                }}
                className="p-3 rounded-2xl bg-[#101217] border border-[#292E38] hover:border-[#326BFF] flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] group shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${act.gradient} text-white flex items-center justify-center shadow shrink-0 group-hover:scale-105 transition-transform`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-white font-['Syne']">
                        {act.title}
                      </span>
                      {act.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#181B22] text-[#326BFF] border border-[#326BFF]/30 font-bold">
                          {act.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#A7ADB8] line-clamp-1">
                      {act.description}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#707681] group-hover:text-[#326BFF] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
