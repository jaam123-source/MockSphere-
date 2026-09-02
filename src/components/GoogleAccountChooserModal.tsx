import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Mail,
  User,
  Trash2,
  Users,
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

export const APP_CANDIDATE_USERS: GoogleUserProfile[] = [
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
];

const SAVED_ACCOUNTS_STORAGE_KEY = 'ai_portal_saved_device_accounts';

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

  // 'candidates' = candidate list, 'another_account' = personal/device accounts & custom entry
  const [viewMode, setViewMode] = useState<'candidates' | 'another_account'>('candidates');
  const [customEmail, setCustomEmail] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [savedDeviceAccounts, setSavedDeviceAccounts] = useState<GoogleUserProfile[]>([]);

  // Load saved accounts from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_ACCOUNTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSavedDeviceAccounts(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectAccount = async (email: string, name?: string) => {
    setError(null);
    setLoadingEmail(email);

    try {
      const result = await directGoogleSignIn(email, name);
      
      // Save this account to device memory for this user's future logins
      saveAccountToDevice({
        email: result.user.email,
        name: result.user.name,
        role: result.user.role as 'admin' | 'user',
        department: 'Placement Portal User',
        tag: 'Saved Account',
        avatarBg: 'from-cyan-500 to-blue-600',
        avatarText: (result.user.name || result.user.email).slice(0, 2).toUpperCase(),
      });

      setSuccessInfo(`Signed in as ${result.user.name} (${result.user.email})`);
      setTimeout(() => {
        onSelectUser(result.user);
        onClose();
        setViewMode('candidates');
      }, 350);
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate with the selected account.');
      setLoadingEmail(null);
    }
  };

  const saveAccountToDevice = (account: GoogleUserProfile) => {
    try {
      const exists = savedDeviceAccounts.some((a) => a.email.toLowerCase() === account.email.toLowerCase());
      if (!exists) {
        const updated = [account, ...savedDeviceAccounts];
        setSavedDeviceAccounts(updated);
        localStorage.setItem(SAVED_ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      // ignore
    }
  };

  const handleRemoveSavedAccount = (e: React.MouseEvent, emailToRemove: string) => {
    e.stopPropagation();
    const updated = savedDeviceAccounts.filter((a) => a.email.toLowerCase() !== emailToRemove.toLowerCase());
    setSavedDeviceAccounts(updated);
    try {
      localStorage.setItem(SAVED_ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setError('Please enter a valid Google email address.');
      return;
    }

    await handleSelectAccount(customEmail, customName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative space-y-5 text-left">
        
        {/* Close button */}
        <button
          onClick={() => {
            onClose();
            setViewMode('candidates');
          }}
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
          <h2 className="text-xl font-bold text-white tracking-tight">
            {viewMode === 'candidates' ? 'Choose a Google account' : 'Sign In with Your Google Account'}
          </h2>
          <p className="text-xs text-slate-400">
            to continue to <span className="font-semibold text-slate-200">Placement Assessment Portal</span>
          </p>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successInfo && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successInfo}</span>
          </div>
        )}

        {/* View 1: Main Candidates List */}
        {viewMode === 'candidates' ? (
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
              Registered Candidate Accounts
            </div>

            {APP_CANDIDATE_USERS.map((profile) => {
              const isSelectedLoading = loadingEmail === profile.email;

              return (
                <button
                  key={profile.email}
                  type="button"
                  id={`candidate-select-${profile.email.split('@')[0]}`}
                  onClick={() => handleSelectAccount(profile.email, profile.name)}
                  disabled={!!loadingEmail}
                  className="w-full p-3.5 rounded-2xl border transition-all flex items-center justify-between text-left group cursor-pointer bg-slate-950/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700 disabled:opacity-60"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-tr ${profile.avatarBg} flex items-center justify-center font-bold text-white text-xs shadow-md shrink-0`}
                    >
                      {isSelectedLoading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        profile.avatarText
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-100 truncate group-hover:text-white">
                        {profile.name}
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

            {/* Use Another Google Account Button */}
            <button
              type="button"
              id="btn-use-another-account"
              onClick={() => setViewMode('another_account')}
              disabled={!!loadingEmail}
              className="w-full p-3.5 rounded-2xl border border-dashed border-indigo-500/40 hover:border-indigo-400 bg-indigo-950/20 hover:bg-indigo-950/40 text-indigo-300 hover:text-white transition-all flex items-center justify-between text-xs font-semibold cursor-pointer group mt-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 group-hover:text-white">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-200 group-hover:text-white">
                    Use another Google account
                  </div>
                  <div className="text-[11px] text-indigo-300/80 font-normal">
                    Sign in with your personal Google email
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors shrink-0" />
            </button>
          </div>
        ) : (
          /* View 2: User's Own Google Account Entry & Saved Accounts */
          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
            
            {/* Previously saved accounts on this device */}
            {savedDeviceAccounts.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  Your Saved Google Accounts
                </div>
                {savedDeviceAccounts.map((account) => {
                  const isSelectedLoading = loadingEmail === account.email;

                  return (
                    <div
                      key={account.email}
                      onClick={() => handleSelectAccount(account.email, account.name)}
                      className="w-full p-3 rounded-2xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-800/80 transition-all flex items-center justify-between text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-tr ${account.avatarBg} flex items-center justify-center font-bold text-white text-xs shrink-0`}
                        >
                          {isSelectedLoading ? (
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            account.avatarText
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-white">
                            {account.name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {account.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleRemoveSavedAccount(e, account.email)}
                          title="Remove account"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Enter Your Google Email */}
            <form onSubmit={handleCustomSubmit} className="space-y-3 pt-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                Enter Your Google Account Details
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Google Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    id="input-user-google-email"
                    required
                    placeholder="Enter your Gmail address (e.g. name@gmail.com)"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700/80 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    id="input-user-google-name"
                    placeholder="Your Full Name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950 border border-slate-700/80 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('candidates')}
                  className="w-1/3 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loadingEmail === customEmail}
                  className="w-2/3 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loadingEmail === customEmail ? (
                    <span>Signing in...</span>
                  ) : (
                    <>
                      <span>Sign In with Google</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        )}

        {/* Footer info */}
        <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 border-t border-slate-800/80">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          <span>Integrated with Campus Placement & AI Assessment Suite</span>
        </div>

      </div>
    </div>
  );
};
