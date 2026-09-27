import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, X, Eye, EyeOff, Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { User } from '../../types';
import { CURRENT_USER, CREATORS } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, message: string) => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'login') {
        const foundUser = Object.values(CREATORS).find(
          (c) => c.handle.toLowerCase() === email.toLowerCase() || email.includes(c.handle)
        ) || CURRENT_USER;

        onLoginSuccess(foundUser, `Welcome back, ${foundUser.name}!`);
        onClose();
      } else {
        // Sign Up
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name: name.trim() || 'New Creator',
          handle: (name.trim().toLowerCase().replace(/\s+/g, '_') || 'creator_hub') + '_' + Math.floor(100 + Math.random() * 900),
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          role: 'creator',
          verifiedCreator: true,
          verifiedSeller: true,
          followersCount: 1,
          followingCount: 12,
          bio: 'Creator & video artist on FLYNK.',
          location: 'Mumbai, India',
          trustMetrics: {
            rating: 5.0,
            deliveredOrders: 0,
            deliverySuccessRate: 100,
            joinedYear: 2026,
          },
        };
        onLoginSuccess(newUser, `Account created successfully! Welcome to FLYNK, ${newUser.name}.`);
        onClose();
      }
    }, 700);
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(CURRENT_USER, `Signed in with ${provider === 'google' ? 'Google' : 'Facebook'} as Devin Subbu!`);
      onClose();
    }, 600);
  };

  const handleQuickDemoUser = (user: User) => {
    onLoginSuccess(user, `Switched session to ${user.name} (@${user.handle})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Outer ambient container matching Image 1: vibrant blue-violet-pink gradient backdrop */}
      <div className="relative w-full max-w-md rounded-[38px] p-1.5 sm:p-2.5 bg-gradient-to-br from-[#2b59ff] via-[#7c3aed] to-[#ec4899] shadow-[0_25px_60px_-10px_rgba(40,15,80,0.6)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors backdrop-blur-md"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Soft White Neumorphic Card matching Image 1 */}
        <div className="relative bg-white rounded-[32px] p-6 sm:p-8 text-neutral-900 shadow-[0_20px_45px_-12px_rgba(0,0,0,0.15)] overflow-hidden">
          {/* Top Circular Avatar Icon matching Image 1 */}
          <div className="flex flex-col items-center justify-center mb-5">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-[#8b5cf6] via-[#d946ef] to-[#ec4899] p-1 shadow-[0_8px_20px_rgba(217,70,239,0.35)] flex items-center justify-center mb-3">
              <div className="w-full h-full rounded-full bg-transparent flex items-center justify-center">
                <UserIcon className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-[2.2]" />
              </div>
            </div>

            {/* Title matching Image 1 */}
            <h2 className="text-2xl sm:text-[28px] font-bold text-neutral-900 tracking-tight">
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {mode === 'login'
                ? 'Access your creator earnings, studio & escrow'
                : 'Join FLYNK as a video creator & merchant'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Sign Up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Name
                </label>
                <div className="relative flex items-center rounded-2xl bg-[#f4f6fb] border border-[#e5e7eb] px-3.5 py-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
                  <UserIcon className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-700">Email</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setStatusMessage('Password reset link sent to registered email!')}
                    className="text-[11px] font-medium text-purple-600 hover:text-purple-700 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center rounded-2xl bg-[#f4f6fb] border border-[#e5e7eb] px-3.5 py-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
                <Mail className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center rounded-2xl bg-[#f4f6fb] border border-[#e5e7eb] px-3.5 py-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200 transition-all">
                <Lock className="w-4 h-4 text-neutral-400 mr-2.5 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'login' ? 'Enter your password' : 'Create a password'}
                  className="w-full bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-neutral-400 hover:text-neutral-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {statusMessage && (
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-medium text-center border border-purple-200 animate-in fade-in duration-150">
                {statusMessage}
              </div>
            )}

            {/* Main Action Button matching Image 1: vibrant gradient button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] hover:from-[#4f46e5] hover:via-[#7c3aed] hover:to-[#c026d3] text-white font-bold text-base shadow-[0_10px_25px_-5px_rgba(139,92,246,0.5)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>{mode === 'login' ? 'Log In' : 'Sign Up'}</span>
                )}
              </button>
            </div>
          </form>

          {/* "or continue with" divider matching Image 1 */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <span className="relative bg-white px-3 text-xs text-neutral-400 font-medium">
              or continue with
            </span>
          </div>

          {/* Social Auth circular buttons matching Image 1 */}
          <div className="flex items-center justify-center gap-4">
            {/* Google circular button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="w-12 h-12 rounded-full bg-white border border-neutral-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              title="Continue with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.27v3.14C3.25 21.31 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.6H1.27C.46 8.23 0 10.06 0 12s.46 3.77 1.27 5.4l4.01-3.14z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.6l4.01 3.14c.95-2.84 3.6-4.99 6.72-4.99z"
                />
              </svg>
            </button>

            {/* Facebook circular button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              className="w-12 h-12 rounded-full bg-white border border-neutral-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              title="Continue with Facebook"
            >
              <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
          </div>

          {/* Quick Demo Creator Accounts Switcher */}
          <div className="mt-4 pt-3 border-t border-neutral-100 text-center">
            <span className="text-[11px] text-neutral-400 block mb-1.5">
              1-Click Demo Profiles
            </span>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoUser(CURRENT_USER)}
                className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold transition-colors flex items-center gap-1"
              >
                <span>Devin (Creator)</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoUser(CREATORS.aria)}
                className="px-2.5 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-semibold transition-colors flex items-center gap-1"
              >
                <span>Aria (Seller)</span>
              </button>
            </div>
          </div>

          {/* Toggle between Login and Sign Up matching Image 1 */}
          <div className="mt-5 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-neutral-500">
                Not registered yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setStatusMessage(null);
                  }}
                  className="font-bold text-purple-600 hover:text-purple-700 hover:underline"
                >
                  Sign Up &gt;
                </button>
              </p>
            ) : (
              <p className="text-xs text-neutral-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setStatusMessage(null);
                  }}
                  className="font-bold text-purple-600 hover:text-purple-700 hover:underline"
                >
                  Log In &gt;
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
