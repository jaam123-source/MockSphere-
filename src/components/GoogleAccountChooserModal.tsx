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
  ShieldAlert,
  Sparkles,
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
  createdAt: string;
  usageCount: number;
}

const SAVED_ACCOUNTS_STORAGE_KEY = 'ai_portal_saved_device_accounts_v2';

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
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const [suggestedEmailCorrection, setSuggestedEmailCorrection] = useState<string | null>(null);

  const [customEmail, setCustomEmail] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [showEmailDropdown, setShowEmailDropdown] = useState<boolean>(false);
  const [savedDeviceAccounts, setSavedDeviceAccounts] = useState<GoogleUserProfile[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);

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

  // Real-time incorrect Gmail detection and typo correction
  const handleEmailChange = (val: string) => {
    setCustomEmail(val);
    setEmailWarning(null);
    setSuggestedEmailCorrection(null);

    const trimmed = val.trim().toLowerCase();
    if (!trimmed) return;

    // Check for common typos
    if (trimmed.includes('@gamil.com')) {
      const corrected = trimmed.replace('@gamil.com', '@gmail.com');
      setEmailWarning('Incorrect domain detected ("@gamil.com").');
      setSuggestedEmailCorrection(corrected);
    } else if (trimmed.includes('@gmial.com')) {
      const corrected = trimmed.replace('@gmial.com', '@gmail.com');
      setEmailWarning('Incorrect domain detected ("@gmial.com").');
      setSuggestedEmailCorrection(corrected);
    } else if (trimmed.includes('@gmal.com')) {
      const corrected = trimmed.replace('@gmal.com', '@gmail.com');
      setEmailWarning('Incorrect domain detected ("@gmal.com").');
      setSuggestedEmailCorrection(corrected);
    } else if (trimmed.includes('@hotnail.com')) {
      const corrected = trimmed.replace('@hotnail.com', '@hotmail.com');
      setEmailWarning('Incorrect domain detected ("@hotnail.com").');
      setSuggestedEmailCorrection(corrected);
    } else if (trimmed.includes('@yaho.com')) {
      const corrected = trimmed.replace('@yaho.com', '@yahoo.com');
      setEmailWarning('Incorrect domain detected ("@yaho.com").');
      setSuggestedEmailCorrection(corrected);
    } else if (!trimmed.includes('@')) {
      setEmailWarning('Incomplete email: missing "@" symbol.');
    } else if (!trimmed.includes('.')) {
      setEmailWarning('Incomplete email: missing domain extension (e.g. .com).');
    }
  };

  const applyEmailCorrection = () => {
    if (suggestedEmailCorrection) {
      setCustomEmail(suggestedEmailCorrection);
      setEmailWarning(null);
      setSuggestedEmailCorrection(null);
    }
  };

  if (!isOpen) return null;

  const handleSelectAccount = async (email: string, name?: string) => {
    setError(null);
    setEmailWarning(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setError('Please provide a valid and complete Google email address.');
      return;
    }

    setLoadingEmail(trimmedEmail);

    try {
      const result = await directGoogleSignIn(trimmedEmail, name);
      
      saveAccountToDevice({
        email: result.user.email,
        name: result.user.name,
        role: result.user.role as 'admin' | 'user',
        department: 'Candidate',
        tag: 'Personal Account',
        avatarBg: 'from-indigo-600 to-purple-600',
        avatarText: (result.user.name || result.user.email).slice(0, 2).toUpperCase(),
        createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
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

  const saveAccountToDevice = (account: Omit<GoogleUserProfile, 'usageCount'>) => {
    try {
      const existingIndex = savedDeviceAccounts.findIndex(
        (a) => a.email.toLowerCase() === account.email.toLowerCase()
      );

      let updated: GoogleUserProfile[];
      if (existingIndex >= 0) {
        // Update usage count and timestamp
        const existing = savedDeviceAccounts[existingIndex];
        updated = [...savedDeviceAccounts];
        updated[existingIndex] = {
          ...existing,
          name: account.name || existing.name,
          role: account.role || existing.role,
          usageCount: (existing.usageCount || 1) + 1,
        };
      } else {
        const newProfile: GoogleUserProfile = {
          ...account,
          usageCount: 1,
        };
        updated = [newProfile, ...savedDeviceAccounts];
      }

      setSavedDeviceAccounts(updated);
      localStorage.setItem(SAVED_ACCOUNTS_STORAGE_KEY, JSON.stringify(updated));
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
    setEmailWarning(null);
    setSuggestedEmailCorrection(null);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail || !customEmail.includes('@')) {
      setError('Please enter a valid Google Gmail address.');
      return;
    }

    if (emailWarning && suggestedEmailCorrection) {
      setError('Please correct the incorrect email address before continuing.');
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
        
        <button
          onClick={onClose}
          disabled={!!loadingEmail}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1 pb-3 border-b border-slate-800">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-md shadow-indigo-500/20 border border-indigo-500/30">
              <img src="/logo.png" alt="Mock-Sphere" className="w-full h-full object-cover" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Sign In with Google Account
          </h2>
          <p className="text-xs text-slate-400">
            to continue to <span className="font-semibold text-slate-200">Mock-Sphere AI Virtual Interview Trainer</span>
          </p>
        </div>

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

        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
          
          <form onSubmit={handleCustomSubmit} className="space-y-4 pt-1">
            <div className="flex items-center justify-between px-1">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Enter Your Personal Google Gmail Account
              </div>
              <div className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                {savedDeviceAccounts.length} Device Account{savedDeviceAccounts.length === 1 ? '' : 's'} Linked
              </div>
            </div>

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
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full pl-10 pr-9 py-3 bg-slate-950 border ${
                    emailWarning ? 'border-amber-500/80 focus:border-amber-500' : 'border-slate-700/80 focus:border-indigo-500'
                  } rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 cursor-text`}
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

              {/* Incorrect Gmail / Typo Detection Warning */}
              {emailWarning && (
                <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] flex items-center justify-between gap-2 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{emailWarning}</span>
                  </div>
                  {suggestedEmailCorrection && (
                    <button
                      type="button"
                      onClick={applyEmailCorrection}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] transition-colors shrink-0 cursor-pointer"
                    >
                      Fix to {suggestedEmailCorrection}
                    </button>
                  )}
                </div>
              )}

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
                                Used {profile.usageCount || 1}x
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

            {/* Comprehensive Device Account & Usage Audit Panel */}
            {savedDeviceAccounts.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between px-1">
                  <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    All Created & Used Emails on This Device ({savedDeviceAccounts.length})
                  </div>
                  <span className="text-[10px] text-slate-400">Active Audit List</span>
                </div>

                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {savedDeviceAccounts.map((account) => (
                    <div
                      key={account.email}
                      onClick={() => handleSelectAccount(account.email, account.name)}
                      className="w-full p-2.5 rounded-xl border border-slate-800 hover:border-indigo-500/50 bg-slate-950/70 hover:bg-slate-800/80 transition-all flex items-center justify-between text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-full bg-gradient-to-tr ${account.avatarBg} flex items-center justify-center font-bold text-white text-[10px] shrink-0`}
                        >
                          {account.avatarText}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-white flex items-center gap-2">
                            <span>{account.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              {account.usageCount || 1} session{account.usageCount === 1 ? '' : 's'} used
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate flex items-center gap-2">
                            <span>{account.email}</span>
                            <span className="text-[9px] text-slate-400">• Created: {account.createdAt || 'Recent'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => handleRemoveSavedAccount(e, account.email)}
                          title="Remove saved account"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={loadingEmail === customEmail}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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

        <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5 border-t border-slate-800/80">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
          <span>Mock-Sphere AI Virtual Interview Trainer</span>
        </div>

      </div>
    </div>
  );
};
