import React, { useState } from 'react';
import {
  X,
  User,
  Sparkles,
  Store,
  Building2,
  ShieldCheck,
  CheckCircle,
  Plus,
  ChevronRight,
  Crown,
  Briefcase,
  Power,
  PauseCircle,
  Check,
  Globe,
  Lock,
} from 'lucide-react';
import { AccountContext } from '../../types/account';
import { MasterAccountMode, BusinessSector, ProfessionalSpecialization } from '../../types/masterFlynk';

interface AccountSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableContexts: AccountContext[];
  activeContextId: string;
  onSwitchContext: (context: AccountContext) => void;
  onAddNewEntity?: (newContext: AccountContext) => void;
  onToggleStorePause?: (contextId: string, isPaused: boolean) => void;
}

export const AccountSwitcherModal: React.FC<AccountSwitcherModalProps> = ({
  isOpen,
  onClose,
  availableContexts,
  activeContextId,
  onSwitchContext,
  onAddNewEntity,
  onToggleStorePause,
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newMode, setNewMode] = useState<MasterAccountMode>('professional');
  const [newName, setNewName] = useState('');
  const [newHandle, setNewHandle] = useState('');
  const [newSector, setNewSector] = useState<BusinessSector>('doctor_clinic');
  const [newSpecialization, setNewSpecialization] = useState<ProfessionalSpecialization>('video_editor');

  if (!isOpen) return null;

  const getModeIcon = (mode: string, orgRole?: string) => {
    switch (mode) {
      case 'personal':
        return User;
      case 'creator':
        return Sparkles;
      case 'business':
        return Building2;
      case 'organization':
        return orgRole === 'ceo' ? Crown : Building2;
      case 'shop':
        return Store;
      case 'professional':
        return Briefcase;
      default:
        return User;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'personal':
        return 'text-sky-400 bg-sky-500/20 border-sky-500/30';
      case 'creator':
        return 'text-rose-400 bg-rose-500/20 border-rose-500/30';
      case 'business':
        return 'text-amber-400 bg-amber-500/20 border-amber-500/30';
      case 'organization':
        return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'shop':
        return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
      case 'professional':
        return 'text-indigo-400 bg-indigo-500/20 border-indigo-500/30';
      default:
        return 'text-neutral-400 bg-neutral-800 border-neutral-700';
    }
  };

  const handleCreateEntity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newHandle.trim()) return;

    const formattedHandle = newHandle.startsWith('@') ? newHandle : `@${newHandle}`;
    const newContext: AccountContext = {
      id: `ctx_${Date.now()}`,
      mode: newMode,
      name: newName.trim(),
      handle: formattedHandle,
      avatar:
        newMode === 'shop'
          ? 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80'
          : newMode === 'professional'
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
          : newMode === 'business'
          ? 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      roleBadge:
        newMode === 'shop'
          ? 'STORE'
          : newMode === 'professional'
          ? newSpecialization.toUpperCase().replace('_', ' ')
          : newMode === 'business'
          ? newSector.toUpperCase().replace('_', ' ')
          : newMode.toUpperCase(),
      publicationStatus: 'published',
      sector: newMode === 'business' ? newSector : undefined,
      specialization: newMode === 'professional' ? newSpecialization : undefined,
      capabilities: {
        can_create_flick: true,
        can_create_long_video: true,
        can_link_flick_to_long: newMode === 'creator' || newMode === 'professional',
        can_host_sing: newMode === 'personal' || newMode === 'creator',
        can_join_sing: newMode === 'personal' || newMode === 'creator',
        can_add_products: newMode === 'shop' || newMode === 'creator',
        can_tag_products: newMode === 'shop' || newMode === 'creator',
        can_manage_business_page: newMode === 'business' || newMode === 'organization',
        can_manage_organization: newMode === 'organization',
        can_accept_bookings: newMode === 'business' || newMode === 'professional',
        can_show_portfolio: newMode === 'professional' || newMode === 'creator',
      },
    };

    onAddNewEntity?.(newContext);
    setIsCreatingNew(false);
    onSwitchContext(newContext);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 select-none font-['Plus_Jakarta_Sans']"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-lg bg-[#0c050a] border border-neutral-800 rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle */}
        <div className="sm:hidden w-12 h-1.5 bg-neutral-800 rounded-full mx-auto mt-3" />

        {/* Header */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-neutral-800/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center shadow">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-['Syne']">
                Account & Identity Switcher
              </h3>
              <p className="text-[11px] text-neutral-400">
                1 Permanent User • Adaptive Modes & Managed Entities
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Core Architecture Principle Notice (Rules 2, 3, 130) */}
        <div className="px-5 py-2.5 bg-neutral-950/80 border-b border-neutral-800 text-[11px] text-neutral-300 leading-snug flex items-center gap-2 shrink-0">
          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-white">Active Context vs Public Status:</strong> Switching
            to Personal retains all your creator, store, or doctor data. Your published entities
            remain live and open to customers.
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-2 overflow-y-auto flex-1">
          {!isCreatingNew ? (
            <>
              {availableContexts.map((ctx) => {
                const isCurrent = ctx.id === activeContextId;
                const Icon = getModeIcon(ctx.mode, ctx.orgRole);
                const colorClass = getModeColor(ctx.mode);
                const isPaused = ctx.isStorePaused || false;

                return (
                  <div
                    key={ctx.id}
                    onClick={() => {
                      onSwitchContext(ctx);
                      onClose();
                    }}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-red-950/40 border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                        : 'bg-[#13070f] border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <img
                          src={ctx.avatar}
                          alt={ctx.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-white/10"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 p-1 rounded-lg border ${colorClass}`}
                        >
                          <Icon className="w-2.5 h-2.5" />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-white font-['Syne'] truncate">
                            {ctx.name}
                          </span>
                          {ctx.roleBadge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/60 text-neutral-300 border border-neutral-700">
                              {ctx.roleBadge}
                            </span>
                          )}
                        </div>

                        <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5 truncate">
                          <span className="truncate">{ctx.handle}</span>
                          <span>•</span>
                          <span className="capitalize text-neutral-300 font-semibold">
                            {ctx.mode}
                          </span>
                        </div>

                        {/* Public status indicator (Rule 2) */}
                        <div className="mt-1 flex items-center gap-1 text-[10px]">
                          {ctx.mode === 'shop' || ctx.mode === 'business' || ctx.mode === 'professional' ? (
                            isPaused ? (
                              <span className="text-amber-400 flex items-center gap-1">
                                <PauseCircle className="w-3 h-3" /> Store Paused
                              </span>
                            ) : (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Published • Accepting {ctx.mode === 'shop' ? 'Orders' : 'Bookings'}
                              </span>
                            )
                          ) : (
                            <span className="text-neutral-400">Social Identity</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Pause / Live toggle for shop */}
                      {ctx.mode === 'shop' && onToggleStorePause && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleStorePause(ctx.id, !isPaused);
                          }}
                          className={`px-2 py-1 rounded-lg text-[9px] font-mono font-bold border transition-colors ${
                            isPaused
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}
                          title="Toggle store pause status"
                        >
                          {isPaused ? 'Paused' : 'Live'}
                        </button>
                      )}

                      {isCurrent ? (
                        <div className="flex items-center gap-1 text-red-400 text-xs font-bold font-mono">
                          <CheckCircle className="w-4 h-4" />
                          <span>Active</span>
                        </div>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-neutral-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            /* Progressive Adaptive Onboarding (Section 29) */
            <form onSubmit={handleCreateEntity} className="space-y-4 p-1">
              <div>
                <label className="block text-[11px] uppercase font-bold text-neutral-400 font-mono mb-2">
                  1. What will you use this identity for?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'creator', label: 'Creator Profile', icon: Sparkles, desc: 'Videos & Content' },
                    { id: 'business', label: 'Business & Doctor', icon: Building2, desc: 'Services & Bookings' },
                    { id: 'shop', label: 'Shop & Boutique', icon: Store, desc: 'Physical Commerce' },
                    { id: 'professional', label: 'Professional', icon: Briefcase, desc: 'Skills & Portfolios' },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setNewMode(m.id as MasterAccountMode)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                          newMode === m.id
                            ? 'bg-red-950/40 border-red-500 text-white shadow-md'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-red-400" />
                          <span className="font-bold text-xs">{m.label}</span>
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-1">{m.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sub-sector picker for Business */}
              {newMode === 'business' && (
                <div>
                  <label className="block text-[11px] uppercase font-bold text-neutral-400 font-mono mb-1.5">
                    Select Industry Sector
                  </label>
                  <select
                    value={newSector}
                    onChange={(e) => setNewSector(e.target.value as BusinessSector)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none"
                  >
                    <option value="doctor_clinic">Healthcare • Doctor / Clinic</option>
                    <option value="real_estate">Real Estate & Properties</option>
                    <option value="restaurant">Restaurant & Food Service</option>
                    <option value="hotel">Hospitality & Hotel</option>
                    <option value="salon_beauty">Salon, Spa & Beauty</option>
                    <option value="manufacturing_b2b">Manufacturing & B2B</option>
                  </select>
                </div>
              )}

              {/* Sub-specialization for Professional */}
              {newMode === 'professional' && (
                <div>
                  <label className="block text-[11px] uppercase font-bold text-neutral-400 font-mono mb-1.5">
                    Select Professional Specialization
                  </label>
                  <select
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value as ProfessionalSpecialization)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none"
                  >
                    <option value="video_editor">Commercial Video Editor / VFX</option>
                    <option value="developer">Full-Stack Software Engineer</option>
                    <option value="photographer">Fashion & Wedding Photographer</option>
                    <option value="ui_ux_designer">UI / UX Product Designer</option>
                    <option value="architect">Architect & Interior Designer</option>
                    <option value="consultant">Business & Strategy Consultant</option>
                  </select>
                </div>
              )}

              {/* Name & Handle */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] uppercase font-bold text-neutral-400 font-mono mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Dr. Arjun Clinic or Devin Filmworks"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-bold text-neutral-400 font-mono mb-1">
                    Public Handle (@)
                  </label>
                  <input
                    type="text"
                    required
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    placeholder="e.g. @drarjunclinic"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="flex-1 py-2.5 rounded-xl bg-neutral-900 text-neutral-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md"
                >
                  Launch Entity
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!isCreatingNew && (
          <div className="p-4 border-t border-neutral-800/80 bg-black/40 shrink-0">
            <button
              onClick={() => setIsCreatingNew(true)}
              className="w-full py-2.5 px-3 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 text-red-400" />
              <span>Configure New Purpose / Entity (Doctor, Shop, Pro)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
