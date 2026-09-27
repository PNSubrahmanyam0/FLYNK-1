import React, { useState } from 'react';
import { X, Download, Share2, Copy, Check, ShieldAlert, UserX, MessageSquare, CheckCircle2 } from 'lucide-react';
import { ShortVideo } from '../../types';

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  video: ShortVideo;
  onReport: () => void;
  onBlock: () => void;
}

export const ShareSheet: React.FC<ShareSheetProps> = ({
  isOpen,
  onClose,
  video,
  onReport,
  onBlock,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://flynk.app/s/${video.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateWatermarkDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadComplete(true);
      setTimeout(() => {
        setDownloadComplete(false);
        onClose();
      }, 1800);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col justify-end">
      <div className="flex-1" onClick={onClose} />

      <div className="bg-[#0e0406]/95 border-t border-red-500/30 rounded-t-3xl p-5 shadow-[0_-10px_40px_rgba(220,38,38,0.25)] backdrop-blur-2xl animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-red-500/20">
          <div>
            <h3 className="font-bold text-white text-base font-['Syne']">Share & Protect</h3>
            <p className="text-xs text-neutral-400">@{video.creator.handle}’s clip</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-red-950/50 border border-red-500/20 text-neutral-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Watermark Download Card */}
        <div className="mt-4 p-3.5 rounded-2xl bg-red-950/20 border border-red-500/25 flex items-center justify-between backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center border border-red-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5 font-['Syne']">
                Watermarked Save
                <span className="text-[10px] bg-red-600/20 text-red-300 border border-red-500/30 px-1.5 py-0.5 rounded font-mono">
                  FLYNK
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Stamps <span className="text-neutral-200">@{video.creator.handle}</span> & FLYNK watermark
              </p>
            </div>
          </div>

          <button
            onClick={handleSimulateWatermarkDownload}
            disabled={downloading || downloadComplete}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:bg-neutral-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(239,68,68,0.35)]"
          >
            {downloading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Stamping...
              </>
            ) : downloadComplete ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Saved!
              </>
            ) : (
              'Save Clip'
            )}
          </button>
        </div>

        {/* Quick Share buttons */}
        <div className="grid grid-cols-4 gap-2 mt-4 text-center">
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-red-950/30 transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center text-white">
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-red-300" />}
            </div>
            <span className="text-[11px] text-neutral-300">{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={() => {
              window.open(`https://api.whatsapp.com/send?text=Watch%20this%20on%20FLYNK:%20https://flynk.app/s/${video.id}`, '_blank');
            }}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-red-950/30 transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-neutral-300">WhatsApp</span>
          </button>

          <button
            onClick={onClose}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-red-950/30 transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-red-950/40 border border-red-500/30 flex items-center justify-center text-red-300">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-neutral-300">Direct DM</span>
          </button>

          <button
            onClick={onReport}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-red-950/30 transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className="text-[11px] text-neutral-300">Report</span>
          </button>
        </div>

        {/* Safety & moderation */}
        <div className="mt-4 pt-3 border-t border-red-500/20 flex justify-between items-center text-xs text-neutral-400 px-1">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-neutral-400" />
            Moderated Creator Environment
          </span>
          <button
            onClick={onBlock}
            className="text-neutral-400 hover:text-red-400 flex items-center gap-1 transition-colors"
          >
            <UserX className="w-3.5 h-3.5" />
            Block User
          </button>
        </div>
      </div>
    </div>
  );
};
