import React, { useState } from 'react';
import {
  X,
  Laptop,
  Check,
  Copy,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
} from 'lucide-react';

interface MacM4SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MacM4SetupGuideModal: React.FC<MacM4SetupGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-t-3xl sm:rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Laptop className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">
                Apple MacBook Air M4 Setup Guide
              </h2>
              <p className="text-[11px] text-neutral-400">
                Step-by-step installation, autonomous AI connection & multi-device testing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-neutral-800 text-neutral-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Guide Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-neutral-300">
          {/* Hardware summary */}
          <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-sky-400" />
              <div>
                <span className="font-bold text-white block">
                  MacBook Air (Apple Silicon M4)
                </span>
                <span className="text-[11px] text-neutral-400">
                  ARM64 Native Execution: Ultra-fast Flutter compilation & iOS/Android emulation
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-sky-500/20 text-sky-300 font-mono font-bold px-2 py-0.5 rounded">
              PERFECT SPEC
            </span>
          </div>

          {/* STEP 1: WHAT APPS TO INSTALL */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white inline-flex items-center justify-center text-[10px]">
                1
              </span>
              Applications to Install on your Mac
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-white block">1. ChatGPT Desktop App</span>
                <p className="text-[11px] text-neutral-400">
                  Download from OpenAI site. Sign in with your current account to access Work / Codex Mode.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-white block">2. Visual Studio Code</span>
                <p className="text-[11px] text-neutral-400">
                  Download the "Apple Silicon Universal" build. Install Dart + Flutter extensions.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-white block">3. Xcode (Mac App Store)</span>
                <p className="text-[11px] text-neutral-400">
                  Free from Apple Mac App Store. Gives you the iPhone 16 Pro simulator and iOS compiler.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
                <span className="font-bold text-white block">4. Android Studio</span>
                <p className="text-[11px] text-neutral-400">
                  Download for Mac with Apple Chip. Gives you Android Virtual Device (AVD) emulators.
                </p>
              </div>
            </div>
          </div>

          {/* STEP 2: TERMINAL QUICK SETUP */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white inline-flex items-center justify-center text-[10px]">
                2
              </span>
              Terminal Setup (Run in Mac Terminal)
            </h3>

            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-black border border-neutral-800 flex items-center justify-between font-mono text-[11px]">
                <span className="text-emerald-400 truncate">
                  brew install --cask flutter
                </span>
                <button
                  onClick={() =>
                    copyToClipboard('brew install --cask flutter', 'brew_cmd')
                  }
                  className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white"
                >
                  {copiedCmd === 'brew_cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-black border border-neutral-800 flex items-center justify-between font-mono text-[11px]">
                <span className="text-neutral-300 truncate">flutter doctor -v</span>
                <button
                  onClick={() => copyToClipboard('flutter doctor -v', 'doctor_cmd')}
                  className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white"
                >
                  {copiedCmd === 'doctor_cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* STEP 3: HOW AUTONOMOUS AI OPERATION WORKS */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white inline-flex items-center justify-center text-[10px]">
                3
              </span>
              How AI Operates Autonomously Without Interruption
            </h3>

            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <p className="leading-relaxed">
                When you open the FLYNK project folder in the ChatGPT desktop app in <strong>Work / Codex mode</strong> and grant permission to that folder:
              </p>
              <ul className="space-y-1.5 text-[11px] text-neutral-300 list-disc pl-4">
                <li>AI can create, modify, refactor, and delete project files autonomously.</li>
                <li>AI can execute terminal builds (`flutter run`, `pytest`, `npm test`) in background tasks.</li>
                <li>If a compile or layout error occurs, AI inspects the terminal error log and automatically patches the code without asking you to intervene.</li>
              </ul>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-start gap-2 mt-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  <strong>Only Interrupts You For:</strong> Apple Developer ID approval, physical phone connection, or payment/KYC legal signatures. Everything else runs autonomously.
                </span>
              </div>
            </div>
          </div>

          {/* STEP 4: 4-LEVEL TESTING MATRIX */}
          <div className="space-y-2.5">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white inline-flex items-center justify-center text-[10px]">
                4
              </span>
              4-Level Real-World Testing Protocol
            </h3>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <strong className="text-white block">Level 1: Automated Unit Tests</strong>
                <span className="text-neutral-400">Short-to-Full linking IDs, escrow math, discounts.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <strong className="text-white block">Level 2: Simulator Testing</strong>
                <span className="text-neutral-400">iPhone 16 Pro, Galaxy S24, small/large screens.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <strong className="text-white block">Level 3: Edge Case Chaos</strong>
                <span className="text-neutral-400">Network loss at 98% upload, rapid double taps.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                <strong className="text-white block">Level 4: Real User Trial</strong>
                <span className="text-neutral-400">Hand phone to 20 users without instructions.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-md shadow-rose-500/25 transition-all"
          >
            Ready to Build on Mac M4
          </button>
        </div>
      </div>
    </div>
  );
};
