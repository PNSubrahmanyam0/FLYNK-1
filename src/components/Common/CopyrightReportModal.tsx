import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  Upload,
  CheckCircle2,
  FileText,
  Lock,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { LongVideo, ShortVideo, User } from '../../types';

interface CopyrightReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: LongVideo | ShortVideo | null;
  currentUser: User;
  onReportSubmitted: (
    videoId: string,
    report: {
      reporterName: string;
      reporterHandle: string;
      originalSourceUrl: string;
      infringementProofText: string;
      reportedAt: string;
      disputeDeadline: string;
      status: 'pending_review' | 'counter_submitted' | 'withheld' | 'cleared';
    }
  ) => void;
}

export const CopyrightReportModal: React.FC<CopyrightReportModalProps> = ({
  isOpen,
  onClose,
  video,
  currentUser,
  onReportSubmitted,
}) => {
  const [originalSourceUrl, setOriginalSourceUrl] = useState('');
  const [infringementDetails, setInfringementDetails] = useState('');
  const [documentAttached, setDocumentAttached] = useState<string | null>(null);
  const [legalConfirmed, setLegalConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !video) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalSourceUrl || !legalConfirmed) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 7);

      onReportSubmitted(video.id, {
        reporterName: currentUser.name,
        reporterHandle: currentUser.handle,
        originalSourceUrl,
        infringementProofText: infringementDetails || 'Unauthorized 3rd-party rip and re-upload without creator license.',
        reportedAt: 'Just now',
        disputeDeadline: `${deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} (7 Days to Counter)`,
        status: 'withheld',
      });

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1800);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-['Plus_Jakarta_Sans']">
      <div className="relative w-full max-w-lg bg-[#0e0406]/95 border border-red-500/40 rounded-3xl shadow-[0_0_60px_rgba(220,38,38,0.35)] backdrop-blur-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-red-500/25 bg-[#140508]/90 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.4)]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-white text-sm font-['Syne']">
                DMCA & Copyright Takedown Notice
              </h2>
              <p className="text-[11px] text-neutral-400">
                Anti-piracy protection for original video creators
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-neutral-400 hover:text-white border border-red-500/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Target Card */}
        <div className="p-4 bg-red-950/20 border-b border-red-500/20 flex items-center gap-3">
          <img
            src={video.thumbnailUrl}
            alt=""
            className="w-16 h-12 rounded-xl object-cover border border-red-500/30 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono text-red-400 uppercase font-semibold">
              Reported Video
            </span>
            <h4 className="text-xs font-bold text-white truncate font-['Syne']">
              {video.title}
            </h4>
            <p className="text-[11px] text-neutral-400">
              Uploaded by @{video.creator.handle}
            </p>
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Automatic Temporary Withholding Explanation */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4" />
              <span>FLYNK Safe-Harbor Policy:</span>
            </div>
            <p className="text-[11px] text-neutral-300">
              Upon submitting valid proof of ownership, this video will be <strong>temporarily withheld</strong> from public feeds. The uploader has <strong>7 days</strong> to submit counter-evidence or original footage declaration before permanent removal.
            </p>
          </div>

          {/* Source Link to Original Work */}
          <div>
            <label className="text-xs font-bold text-neutral-200 block mb-1">
              Link to Your Original Work / Master Footage *
            </label>
            <input
              type="url"
              required
              value={originalSourceUrl}
              onChange={(e) => setOriginalSourceUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or https://flynk.app/..."
              className="w-full bg-red-950/30 border border-red-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-400 font-mono"
            />
          </div>

          {/* Description of Infringement */}
          <div>
            <label className="text-xs font-bold text-neutral-200 block mb-1">
              Specific Infringement Evidence / Timestamps
            </label>
            <textarea
              rows={2}
              value={infringementDetails}
              onChange={(e) => setInfringementDetails(e.target.value)}
              placeholder="e.g. Copied directly without license from my 4K documentary. Entire video from 00:00 to 05:30 is identical to my copyrighted release."
              className="w-full bg-red-950/30 border border-red-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-400"
            />
          </div>

          {/* Document / License Upload Simulation */}
          <div>
            <label className="text-xs font-bold text-neutral-200 block mb-1.5">
              Proof Document / Rights Clearance (Optional or PDF)
            </label>
            <div
              onClick={() =>
                setDocumentAttached(
                  documentAttached
                    ? null
                    : `FLYNK-Copyright-Declaration-Signed-${Date.now().toString().slice(-4)}.pdf`
                )
              }
              className="p-3 rounded-2xl bg-red-950/20 border border-dashed border-red-500/40 hover:border-red-500/70 cursor-pointer flex items-center justify-between text-xs transition-colors"
            >
              <div className="flex items-center gap-2 text-neutral-300">
                <FileText className="w-4 h-4 text-red-400" />
                <span>
                  {documentAttached || 'Attach Rights Declaration or RAW Footage Proof (PDF / PNG)'}
                </span>
              </div>
              <span className="text-[10px] text-red-400 font-bold underline font-mono">
                {documentAttached ? 'Remove' : 'Attach'}
              </span>
            </div>
          </div>

          {/* Legal Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-neutral-300 cursor-pointer select-none">
              <input
                type="checkbox"
                required
                checked={legalConfirmed}
                onChange={(e) => setLegalConfirmed(e.target.checked)}
                className="mt-0.5 accent-red-600 rounded"
              />
              <span className="text-[11px] leading-snug">
                I declare under penalty of perjury that I am the author or authorized copyright agent. I have a good-faith belief that the use of this content is not authorized by the copyright owner.
              </span>
            </label>
          </div>

          {/* Success feedback */}
          {isSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Report filed! Video temporarily withheld from public feed for 7 days.</span>
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !originalSourceUrl || !legalConfirmed}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(220,38,38,0.5)] border border-red-400/30 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Infringement Claim...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Submit Claim & Temporarily Withhold Video</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
