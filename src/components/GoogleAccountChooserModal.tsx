import React, { useState } from 'react';
import {
  X,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { User as UserType } from '../types';
import { directGoogleSignIn } from '../services/googleAuth';

export interface GoogleUserProfile {
  email: string;
  name: string;
  role: 'admin' | 'user';
  department: string;
  tag: string;
  avatarBg: string;
  avatarText: string;
}

export const APP_GOOGLE_USERS: GoogleUserProfile[] = [
  {
    email: 'arjun.sharma@gmail.com',
    name: 'Arjun Sharma',
    role: 'user',
    department: 'Computer Science & Engineering',
    tag: 'Placement Candidate',
    avatarBg: 'from-emerald-500 to-teal-600',
    avatarText: 'AS',
  },
  {
    email: 'priya.patel@gmail.com',
    name: 'Priya Patel',
    role: 'user',
    department: 'Information Technology',
    tag: 'Placement Candidate',
    avatarBg: 'from-violet-500 to-purple-600',
    avatarText: 'PP',
  },
  {
    email: 'rohan.mehta@gmail.com',
    name: 'Rohan Mehta',
    role: 'user',
    department: 'Electronics & Communication',
    tag: 'Placement Candidate',
    avatarBg: 'from-sky-500 to-blue-600',
    avatarText: 'RM',
  },
  {
    email: 'ananya.verma@gmail.com',
    name: 'Ananya Verma',
    role: 'user',
    department: 'AI & Data Science',
    tag: 'Placement Candidate',
    avatarBg: 'from-amber-500 to-orange-600',
    avatarText: 'AV',
  },
  {
    email: 'jaammaaj123@gmail.com',
    name: 'Jaam Maaj (Admin)',
    role: 'admin',
    department: 'Placement Cell & System Admin',
    tag: 'System Administrator',
    avatarBg: 'from-indigo-600 to-purple-700',
    avatarText: 'JM',
  },
];

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUser: (user: UserType) => void;
}

export const GoogleAccountChooserModal: React.FC<GoogleAccountChooserModalProps> = ({
  isOpen,
  onClose,
  onSelectUser,
}) => {
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Custom account entry mode
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customEmail, setCustomEmail] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectProfile = async (profile: GoogleUserProfile) => {
    setError(null);
    setLoadingEmail(profile.email);

    try {
      const result = await directGoogleSignIn(profile.email, profile.name);
      setSuccessInfo(`Signed in as ${result.user.name}`);
      setTimeout(() => {
        onSelectUser(result.user);
        onClose();
      }, 350);
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate with the selected account.');
      setLoadingEmail(null);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setError('Please enter a valid Google email address.');
      return;
    }

    setError(null);
    setLoadingEmail('custom');

    try {
      const result = await directGoogleSignIn(customEmail, customName);
      setSuccessInfo(`Signed in as ${result.user.name} (${result.user.email})`);
      setTimeout(() => {
        onSelectUser(result.user);
        onClose();
      }, 350);
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate account.');
      setLoadingEmail(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5 text-left">
        
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={!!loadingEmail}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Header */}
        <div className="text-center space-y-1 pb-3 border-b border-slate-800">
          <div className="flex justify-center mb-2">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
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
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Choose an account</h2>
          <p className="text-xs text-slate-400">
            to continue to <span className="font-semibold text-slate-200">Placement Assessment Portal</span>
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successInfo && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successInfo}</span>
          </div>
        )}

        {/* User Account List */}
        {!isCustomMode ? (
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {APP_GOOGLE_USERS.map((profile) => {
              const isSelectedLoading = loadingEmail === profile.email;
              const isAdmin = profile.role === 'admin';

              return (
                <button
                  key={profile.email}
                  type="button"
                  id={`account-select-${profile.email.split('@')[0]}`}
                  onClick={() => handleSelectProfile(profile)}
                  disabled={!!loadingEmail}
                  className={`w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between text-left group cursor-pointer ${
                    isAdmin
                      ? 'bg-indigo-950/30 hover:bg-indigo-900/40 border-indigo-500/30 hover:border-indigo-400'
                      : 'bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                  } disabled:opacity-60`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-tr ${profile.avatarBg} flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0`}
                    >
                      {isSelectedLoading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        profile.avatarText
                      )}
                    </div>

                    {/* Account Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-100 truncate group-hover:text-white">
                          {profile.name}
                        </span>
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            <ShieldCheck className="w-3 h-3 text-cyan-400" />
                            <span>Admin</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate">{profile.email}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {profile.department}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0 ml-2" />
                </button>
              );
            })}

            {/* Use Another Account Button */}
            <button
              type="button"
              id="btn-use-another-account"
              onClick={() => setIsCustomMode(true)}
              disabled={!!loadingEmail}
              className="w-full p-3 rounded-2xl border border-dashed border-slate-700 hover:border-indigo-500/60 bg-slate-950/30 hover:bg-slate-900/60 text-slate-300 hover:text-white transition-all flex items-center gap-3 text-xs font-semibold cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <UserPlus className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-slate-200">Use another Google account</div>
                <div className="text-[11px] text-slate-500 font-normal">
                  Sign in with any custom student or faculty Google email
                </div>
              </div>
            </button>
          </div>
        ) : (
          /* Custom Account Form */
          <form onSubmit={handleCustomSubmit} className="space-y-4 pt-1">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Google Email Address
                </label>
                <input
                  type="email"
                  id="custom-google-email"
                  required
                  placeholder="name@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Display Name (Optional)
                </label>
                <input
                  type="text"
                  id="custom-google-name"
                  placeholder="e.g. Candidate Name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCustomMode(false)}
                className="w-1/3 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loadingEmail === 'custom'}
                className="w-2/3 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loadingEmail === 'custom' ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Continue with Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          <span>Integrated with Campus Placement & AI Assessment Suite</span>
        </div>

      </div>
    </div>
  );
};
