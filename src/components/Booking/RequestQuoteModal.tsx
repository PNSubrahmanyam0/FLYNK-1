import React, { useState } from 'react';
import { X, Send, Sparkles, Clock, IndianRupee, Link2, FileText, CheckCircle2, ShieldCheck, Briefcase } from 'lucide-react';
import { ProjectQuoteRequest, UniversalLead } from '../../types';

interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalName?: string;
  professionalHandle?: string;
  professionalRole?: string;
  professionalAvatar?: string;
  startingRate?: string;
  targetPro?: {
    name: string;
    handle: string;
    avatar: string;
    role?: string;
  };
  currentUser?: any;
  onSubmitQuoteRequest?: (quote: ProjectQuoteRequest, lead: UniversalLead) => void;
  onSubmitQuote?: (quote: ProjectQuoteRequest) => void;
}

const PROJECT_TYPES = [
  'Viral Reels & Short Cut',
  'YouTube Long-Form Edit',
  'Cinematic Color Grading (DaVinci)',
  'Full-Stack Web App / MVP',
  'Brand Identity & 3D Logo',
  'Architectural 3D Render',
  'Commercial Photography',
  'Custom Consulting / Other',
];

const DEADLINES = [
  { id: 'urgent', label: 'Urgent (< 48 Hours)' },
  { id: '1week', label: 'Within 1 Week' },
  { id: '2weeks', label: '2 – 4 Weeks' },
  { id: 'flexible', label: 'Flexible / Ongoing' },
];

const BUDGET_RANGES = [
  'Under ₹15,000',
  '₹15,000 – ₹30,000',
  '₹30,000 – ₹60,000',
  '₹60,000 – ₹1,20,000',
  '₹1,20,000+ (Enterprise)',
  'To be discussed',
];

export const RequestQuoteModal: React.FC<RequestQuoteModalProps> = ({
  isOpen,
  onClose,
  professionalName: propName,
  professionalHandle: propHandle,
  professionalRole: propRole,
  professionalAvatar: propAvatar,
  startingRate = '₹15,000',
  targetPro,
  currentUser,
  onSubmitQuoteRequest,
  onSubmitQuote,
}) => {
  const professionalName = targetPro?.name || propName || 'Kavya Sharma';
  const professionalHandle = targetPro?.handle || propHandle || '@kavyavfx';
  const professionalRole = targetPro?.role || propRole || 'Video Editor & Colorist';
  const professionalAvatar =
    targetPro?.avatar ||
    propAvatar ||
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80';

  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [deadline, setDeadline] = useState(DEADLINES[1].label);
  const [budgetRange, setBudgetRange] = useState(BUDGET_RANGES[1]);
  const [referenceUrl, setReferenceUrl] = useState('');
  const [description, setDescription] = useState('');
  const [clientName, setClientName] = useState(currentUser?.name || 'Devin Subbu');
  const [clientContact, setClientContact] = useState('+91 98491 00234');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const quoteId = `quote_${Date.now()}`;
    const newQuote: ProjectQuoteRequest = {
      id: quoteId,
      professionalId: `pro_${professionalHandle.replace('@', '')}`,
      professionalName,
      professionalHandle,
      clientName,
      clientContact,
      projectType,
      deadline,
      budgetRange,
      referenceUrl: referenceUrl || undefined,
      description: description || `Looking for ${projectType} with ${deadline} timeline.`,
      status: 'new',
      submittedAt: 'Just now',
    };

    const newLead: UniversalLead = {
      id: `lead_${Date.now()}`,
      type: 'quote',
      title: `${projectType} (${deadline})`,
      clientName,
      clientHandle: currentUser?.handle || '@devin_creator',
      clientAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      clientPhone: clientContact,
      details: description || `Client requested quote for ${projectType}. Estimated budget: ${budgetRange}.`,
      serviceCategory: professionalRole,
      dateOrDeadline: deadline,
      budgetOrFee: budgetRange,
      referenceUrl: referenceUrl || undefined,
      status: 'new',
      createdAt: 'Just now',
    };

    if (onSubmitQuoteRequest) {
      onSubmitQuoteRequest(newQuote, newLead);
    } else if (onSubmitQuote) {
      onSubmitQuote(newQuote);
    }
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-lg bg-[#0c0409] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={professionalAvatar}
              alt={professionalName}
              className="w-10 h-10 rounded-full object-cover border border-neutral-700"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white font-['Syne']">{professionalName}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-500/20 text-red-400 font-bold">
                  {professionalHandle}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Request a Custom Project Quote • From {startingRate}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-lg text-white font-['Syne']">Quote Request Dispatched!</h4>
            <p className="text-xs text-neutral-300 max-w-sm mx-auto leading-relaxed">
              Sent directly to <strong>{professionalName}</strong>'s FLYNK Lead Inbox. You will receive a notification and message thread with the formal proposal.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto no-scrollbar flex-1">
            {/* Project Type */}
            <div>
              <label className="text-xs font-bold font-['Syne'] text-neutral-300 block mb-1.5">
                Project Deliverable Type
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                {PROJECT_TYPES.map((type) => (
                  <option key={type} value={type} className="bg-neutral-900 text-white">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline & Budget Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold font-['Syne'] text-neutral-300 block mb-1.5">
                  Target Deadline
                </label>
                <select
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  {DEADLINES.map((d) => (
                    <option key={d.id} value={d.label} className="bg-neutral-900 text-white">
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold font-['Syne'] text-neutral-300 block mb-1.5">
                  Estimated Budget Range
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  {BUDGET_RANGES.map((b) => (
                    <option key={b} value={b} className="bg-neutral-900 text-white">
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reference Upload / Link */}
            <div>
              <label className="text-xs font-bold font-['Syne'] text-neutral-300 block mb-1.5">
                Reference Link / Moodboard / Cloud Drive (Optional)
              </label>
              <div className="relative">
                <Link2 className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or Figma / YouTube URL"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Project Scope Description */}
            <div>
              <label className="text-xs font-bold font-['Syne'] text-neutral-300 block mb-1.5">
                Project Scope & Deliverable Details
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., Need 3 vertical 9:16 videos edited with captions, sound effects, and color grading. Raw footage is approx 45 mins total."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-neutral-400 block mb-1">
                  Phone / WhatsApp
                </label>
                <input
                  type="text"
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Trust badge */}
            <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2.5 text-[11px] text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Quotes are non-binding. Payments held safely in FLYNK Milestone Escrow upon contract agreement.</span>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-2 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs font-['Syne'] shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Quote Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
