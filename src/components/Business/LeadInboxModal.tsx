import React, { useState } from 'react';
import {
  Inbox,
  X,
  Filter,
  CheckCircle,
  Clock,
  IndianRupee,
  Calendar,
  MessageSquare,
  Building2,
  Briefcase,
  User,
  ExternalLink,
  ChevronRight,
  Send,
  Sparkles,
} from 'lucide-react';
import { UniversalLead, LeadType, LeadStatus } from '../../types';

interface LeadInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: UniversalLead[];
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  onOpenLeadChat?: (lead: UniversalLead) => void;
  onStartMessageWithClient?: (lead: UniversalLead) => void;
}

export const LeadInboxModal: React.FC<LeadInboxModalProps> = ({
  isOpen,
  onClose,
  leads,
  onUpdateLeadStatus,
  onOpenLeadChat,
  onStartMessageWithClient,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | LeadType | 'new' | 'completed'>('all');
  const [selectedLead, setSelectedLead] = useState<UniversalLead | null>(null);
  const [quoteResponseAmount, setQuoteResponseAmount] = useState('₹45,000');
  const [quoteResponseMessage, setQuoteResponseMessage] = useState(
    'Reviewed your requirements. We can deliver the DaVinci graded master and 6 flicks within 7 days.'
  );

  const handleChatOpen = onStartMessageWithClient || onOpenLeadChat;

  if (!isOpen) return null;

  const filteredLeads = leads.filter((lead) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'new') return lead.status === 'new';
    if (activeFilter === 'completed') return lead.status === 'completed';
    return lead.type === activeFilter;
  });

  const getLeadTypeBadge = (type: LeadType) => {
    switch (type) {
      case 'quote':
        return { label: 'PROJECT QUOTE', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'appointment':
        return { label: 'APPOINTMENT', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
      case 'site_visit':
        return { label: 'SITE VISIT', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'enquiry':
        return { label: 'STORE ENQUIRY', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' };
      default:
        return { label: 'SERVICE LEAD', color: 'bg-neutral-800 text-neutral-300 border-neutral-700' };
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'new':
        return { label: 'NEW', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
      case 'in_progress':
        return { label: 'IN PROGRESS', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' };
      case 'completed':
        return { label: 'COMPLETED', color: 'bg-neutral-800 text-neutral-400 border-neutral-700' };
      case 'declined':
        return { label: 'DECLINED', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' };
    }
  };

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-4xl bg-[#0b0409] border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-white font-['Syne']">
                  Universal Lead Inbox
                </h2>
                {newLeadsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-600 text-white font-mono text-[10px] font-bold">
                    {newLeadsCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">
                Single unified pipeline for quotes, appointments, site visits & customer enquiries
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

        {/* Filter Navigation Bar */}
        <div className="px-6 py-2.5 bg-neutral-900/40 border-b border-neutral-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'all', label: 'All Leads', count: leads.length },
            { id: 'new', label: 'New', count: newLeadsCount },
            { id: 'quote', label: 'Quotes', count: leads.filter((l) => l.type === 'quote').length },
            {
              id: 'appointment',
              label: 'Appointments',
              count: leads.filter((l) => l.type === 'appointment').length,
            },
            {
              id: 'site_visit',
              label: 'Site Visits',
              count: leads.filter((l) => l.type === 'site_visit').length,
            },
            {
              id: 'enquiry',
              label: 'Enquiries',
              count: leads.filter((l) => l.type === 'enquiry').length,
            },
            {
              id: 'completed',
              label: 'Completed',
              count: leads.filter((l) => l.status === 'completed').length,
            },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-['Syne'] flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 font-mono">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Two-pane layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left Column: Leads list */}
          <div className="w-full md:w-1/2 border-r border-neutral-800 overflow-y-auto no-scrollbar p-4 space-y-3">
            {filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 text-xs">
                No leads found under this filter.
              </div>
            ) : (
              filteredLeads.map((lead) => {
                const typeBadge = getLeadTypeBadge(lead.type);
                const statusBadge = getStatusBadge(lead.status);
                const isSelected = selectedLead?.id === lead.id;

                return (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-neutral-900 border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                        : 'bg-neutral-900/40 hover:bg-neutral-900 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${typeBadge.color}`}
                        >
                          {typeBadge.label}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${statusBadge.color}`}
                        >
                          {statusBadge.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono">{lead.createdAt}</span>
                    </div>

                    <div className="font-bold text-sm text-white font-['Syne'] line-clamp-1">
                      {lead.title}
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {lead.details}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-[11px]">
                      <div className="flex items-center gap-2">
                        <img
                          src={lead.clientAvatar}
                          alt={lead.clientName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-medium text-neutral-300">{lead.clientName}</span>
                      </div>

                      {lead.budgetOrFee && (
                        <div className="font-bold text-emerald-400 font-mono">
                          {lead.budgetOrFee}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Lead Detail & Quick Action */}
          <div className="w-full md:w-1/2 p-5 overflow-y-auto no-scrollbar flex flex-col justify-between bg-neutral-900/20">
            {selectedLead ? (
              <div className="space-y-5">
                {/* Detail Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        getLeadTypeBadge(selectedLead.type).color
                      }`}
                    >
                      {getLeadTypeBadge(selectedLead.type).label}
                    </span>
                    <h3 className="font-bold text-lg text-white font-['Syne'] mt-2">
                      {selectedLead.title}
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Category: <strong className="text-neutral-200">{selectedLead.serviceCategory}</strong>
                    </p>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      getStatusBadge(selectedLead.status).color
                    }`}
                  >
                    {getStatusBadge(selectedLead.status).label}
                  </span>
                </div>

                {/* Client Info Card */}
                <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedLead.clientAvatar}
                      alt={selectedLead.clientName}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                    />
                    <div>
                      <div className="font-bold text-sm text-white">{selectedLead.clientName}</div>
                      <div className="text-[11px] text-neutral-400">
                        {selectedLead.clientPhone || selectedLead.clientEmail || 'Verified User'}
                      </div>
                    </div>
                  </div>

                  {onOpenLeadChat && (
                    <button
                      onClick={() => onOpenLeadChat(selectedLead)}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  )}
                </div>

                {/* Key Lead Parameters */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase">Target Date / Due</div>
                    <div className="font-bold text-neutral-200 mt-1">{selectedLead.dateOrDeadline}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase">Budget / Fee</div>
                    <div className="font-bold text-emerald-400 font-mono mt-1">
                      {selectedLead.budgetOrFee || 'To be proposed'}
                    </div>
                  </div>
                </div>

                {/* Scope Description */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold font-['Syne'] text-neutral-300">
                    Client Requirements & Scope
                  </div>
                  <p className="text-xs text-neutral-300 p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 leading-relaxed">
                    {selectedLead.details}
                  </p>
                </div>

                {/* Interactive Action Suite */}
                <div className="space-y-3 pt-3 border-t border-neutral-800">
                  <div className="text-xs font-bold font-['Syne'] text-neutral-300">
                    Action Pipeline
                  </div>

                  {selectedLead.type === 'quote' && selectedLead.status !== 'completed' && (
                    <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2.5">
                      <div className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>Send Formal Quote Proposal</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={quoteResponseAmount}
                          onChange={(e) => setQuoteResponseAmount(e.target.value)}
                          placeholder="Amount (₹)"
                          className="w-28 px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs font-mono font-bold text-emerald-400"
                        />
                        <input
                          type="text"
                          value={quoteResponseMessage}
                          onChange={(e) => setQuoteResponseMessage(e.target.value)}
                          placeholder="Delivery terms..."
                          className="flex-1 px-2.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-neutral-300"
                        />
                      </div>
                      <button
                        onClick={() => {
                          onUpdateLeadStatus(selectedLead.id, 'completed');
                          setSelectedLead((prev) => (prev ? { ...prev, status: 'completed' } : null));
                        }}
                        className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Dispatch Quote to Client Inbox</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {selectedLead.status !== 'completed' && (
                      <button
                        onClick={() => {
                          onUpdateLeadStatus(selectedLead.id, 'completed');
                          setSelectedLead((prev) =>
                            prev ? { ...prev, status: 'completed' } : null
                          );
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark as Completed</span>
                      </button>
                    )}

                    {selectedLead.status !== 'declined' && (
                      <button
                        onClick={() => {
                          onUpdateLeadStatus(selectedLead.id, 'declined');
                          setSelectedLead((prev) =>
                            prev ? { ...prev, status: 'declined' } : null
                          );
                        }}
                        className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400 space-y-2">
                <Inbox className="w-10 h-10 text-neutral-600 mb-2" />
                <h4 className="font-bold text-sm text-white font-['Syne']">Select a Lead</h4>
                <p className="text-xs max-w-xs">
                  Tap any quote request, patient appointment, or site visit on the left to review details, counter-quote, or initiate direct chat.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
