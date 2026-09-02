import React, { useState } from 'react';
import { X, Check, User, ArrowRight, ShieldCheck, Mail, Sparkles, AlertCircle } from 'lucide-react';
import { ApiService } from '../services/api';
import { User as UserType } from '../types';

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: (reason?: string) => void;
  onSuccess: (user: UserType, message?: string) => void;
  onError: (errorMsg: string) => void;
}

interface DemoGoogleProfile {
  name: string;
  email: string;
  avatar: string;
  sub: string;
}

const DEFAULT_GOOGLE_PROFILES: DemoGoogleProfile[] = [
  {
    name: 'Alex Johnson',
    email: 'alex.johnson@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    sub: 'g_alex_johnson_1',
  },
  {
    name: 'Sarah Connor',
    email: 'sarah.connor@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    sub: 'g_sarah_connor_2',
  },
  {
    name: 'Placement Candidate',
    email: 'candidate@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    sub: 'g_candidate_demo_3',
  },
];

export const GoogleAccountChooserModal: React.FC<GoogleAccountChooserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<DemoGoogleProfile | 'custom'>(DEFAULT_GOOGLE_PROFILES[0]);
  const [customName, setCustomName] = useState<string>('');
  const [customEmail, setCustomEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCancel = () => {
    onClose('cancelled');
    onError('Google sign-in was cancelled.');
  };

  const handleAuthenticate = async () => {
    setLoading(true);
    setFormError(null);

    let authPayload: { email: string; name: string; avatar_url?: string };

    if (selectedProfile === 'custom') {
      const emailTrimmed = customEmail.trim().toLowerCase();
      const nameTrimmed = customName.trim();

      if (!emailTrimmed || !emailTrimmed.includes('@')) {
        setFormError('Please enter a valid Google / Gmail address.');
        setLoading(false);
        return;
      }

      authPayload = {
        email: emailTrimmed,
        name: nameTrimmed || emailTrimmed.split('@')[0],
        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameTrimmed || emailTrimmed)}`,
      };
    } else {
      authPayload = {
        email: selectedProfile.email,
        name: selectedProfile.name,
        avatar_url: selectedProfile.avatar,
      };
    }

    try {
      const res = await ApiService.googleAuth(authPayload);
      onSuccess(res.user, res.message);
      onClose();
    } catch (err: any) {
      const msg = err.message || 'Google authentication failed. Please try again.';
      setFormError(msg);
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl relative space-y-5 text-left">
        
        {/* Top Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md">
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Sign in with Google</h3>
              <p className="text-xs text-slate-400">Choose a Google Account to continue</p>
            </div>
          </div>

          <button
            onClick={handleCancel}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Cancel Google Sign-In"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Account Selector List */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Select Google Account
          </label>

          {DEFAULT_GOOGLE_PROFILES.map((profile) => {
            const isSelected = selectedProfile !== 'custom' && selectedProfile.email === profile.email;
            return (
              <button
                key={profile.email}
                type="button"
                onClick={() => {
                  setSelectedProfile(profile);
                  setFormError(null);
                }}
                className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between text-left cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500/80 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                      <span>{profile.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{profile.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/20">
                    Google
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {/* Use Another Google Account Option */}
          <button
            type="button"
            onClick={() => {
              setSelectedProfile('custom');
              setFormError(null);
            }}
            className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between text-left cursor-pointer ${
              selectedProfile === 'custom'
                ? 'bg-indigo-600/15 border-indigo-500/80 text-white shadow-md'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100">Use another Google Account</div>
                <div className="text-[11px] text-slate-400">Enter your custom Google / Gmail ID</div>
              </div>
            </div>

            {selectedProfile === 'custom' && (
              <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                <Check className="w-3.5 h-3.5" />
              </div>
            )}
          </button>
        </div>

        {/* Custom Google Account Inputs */}
        {selectedProfile === 'custom' && (
          <div className="p-3.5 bg-slate-950/80 border border-indigo-500/30 rounded-2xl space-y-2.5 animate-fadeIn">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Your Full Name</label>
              <input
                type="text"
                placeholder="e.g. Rachel Zane"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">Google Email Address</label>
              <input
                type="email"
                required
                placeholder="your.name@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Secure Google OAuth 2.0. No duplicate accounts will be created for the same email.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleAuthenticate}
            disabled={loading}
            className="w-2/3 py-2.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span>Sign in as {selectedProfile === 'custom' ? (customName || 'Google User') : selectedProfile.name.split(' ')[0]}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
