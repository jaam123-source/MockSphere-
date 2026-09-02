import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Mail,
  User,
  Trash2,
  Users,
  Check,
  ChevronDown,
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

  const [customEmail, setCustomEmail] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [showEmailDropdown, setShowEmailDropdown] = useState<boolean>(false);
  const [savedDeviceAccounts, setSavedDeviceAccounts] = useState<GoogleUserProfile[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowEmailDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
        department: 'Candidate',
        tag: 'Personal Account',
        avatarBg: 'from-indigo-600 to-purple-600',
        avatarText: (result.user.name || result.user.email).slice(0, 2).toUpperCase(),
      });

      setSuccessInfo(`Signed in as ${result.user.name} (${result.user.email})`);
      setTimeout(() => {
        onSelectUser(result.user);
        onClose();
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

  const handlePickEmailSuggestion = (profile: GoogleUserProfile) => {
    setCustomEmail(profile.email);
    setCustomName(profile.name);
    setShowEmailDropdown(false);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setError('Please enter a valid Google Gmail address.');
      return;
    }

    await handleSelectAccount(customEmail, customName);
  };

  const filteredSuggestions = customEmail
    ? savedDeviceAccounts.filter(
        (p) =>
          p.email.toLowerCase().includes(customEmail.toLowerCase()) ||
          p.name.toLowerCase().includes(customEmail.toLowerCase())
      )
    : savedDeviceAccounts;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
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
          <h2 className="text-xl font-bold text-white tracking-tight">
            Sign In with Google
          </h2>
          <p className="text-xs text-slate-400">
            to continue to <span className="font-semibold text-slate-200">Mock-Sphere AI Interview Trainer</span>
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

        {/* Personal Google Account Entry Form */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          
          <form onSubmit={handleCustomSubmit} className="space-y-4 pt-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
              Enter Your Personal Google Gmail Account
            </div>

            {/* Email Input Field with Auto-Suggest Dropdown for Device Saved Accounts */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Google Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  ref={emailInputRef}
                  type="email"
                  id="input-user-google-email"
                  required
                  placeholder="Enter your personal Gmail address (e.g. yourname@gmail.com)"
                  value={customEmail}
                  onFocus={() => setShowEmailDropdown(true)}
                  onClick={() => setShowEmailDropdown(true)}
                  onChange={(e) => {
                    setCustomEmail(e.target.value);
                    setShowEmailDropdown(true);
                  }}
                  className="w-full pl-10 pr-9 py-3 bg-slate-950 border border-slate-700/80 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 cursor-text"
                />
                {savedDeviceAccounts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowEmailDropdown(!showEmailDropdown)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${showEmailDropdown ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

              {/* Dropdown for previously saved device accounts */}
              {showEmailDropdown && savedDeviceAccounts.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-30 max-h-52 overflow-y-auto p-1.5 space-y-1 animate-fadeIn">
                  <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                    <span>Saved Accounts on This Device</span>
                    <span>{filteredSuggestions.length} saved</span>
                  </div>

                  {filteredSuggestions.map((profile) => {
                    const isSelected = customEmail.toLowerCase() === profile.email.toLowerCase();

                    return (
                      <div
                        key={profile.email}
                        onClick={() => handlePickEmailSuggestion(profile)}
                        className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-600/30 border border-indigo-500/40 text-white'
                            : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-full bg-gradient-to-tr ${profile.avatarBg} flex items-center justify-center font-bold text-white text-[10px] shrink-0`}
                          >
                            {profile.avatarText}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold truncate flex items-center gap-1.5">
                              <span>{profile.name}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                                Saved
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">{profile.email}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAccount(profile.email, profile.name);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Sign In
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Full Name Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  id="input-user-google-name"
                  required
                  placeholder="Enter your Full Name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-950 border border-slate-700/80 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25"
                />
              </div>
            </div>

            {/* Saved Accounts List if any */}
            {savedDeviceAccounts.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  Quick Sign-In with Saved Device Accounts
                </div>
                <div className="space-y-1">
                  {savedDeviceAccounts.map((account) => (
                    <div
                      key={account.email}
                      onClick={() => handleSelectAccount(account.email, account.name)}
                      className="w-full p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-800/80 transition-all flex items-center justify-between text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-full bg-gradient-to-tr ${account.avatarBg} flex items-center justify-center font-bold text-white text-[10px] shrink-0`}
                        >
                          {account.avatarText}
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
                          className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loadingEmail === customEmail}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loadingEmail === customEmail ? (
                  <span>Signing in with Google...</span>
                ) : (
                  <>
                    <span>Continue with Google</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 border-t border-slate-800/80">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          <span>Mock-Sphere AI Virtual Interview Trainer</span>
        </div>

      </div>
    </div>
  );
};
