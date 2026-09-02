import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Users, AlertCircle, Loader2 } from 'lucide-react';
import { User as UserType } from '../types';
import { promptGoogleSignIn } from '../services/googleAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleClick = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await promptGoogleSignIn();
      setSuccessMsg(`Signed in successfully as ${result.user.name}`);
      setTimeout(() => {
        onSuccess(result.user);
        onClose();
      }, 400);
    } catch (err: any) {
      setError(err?.message || 'Google sign-in was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-6 text-left">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-md shadow-indigo-500/20 border border-indigo-500/30 shrink-0">
              <img src="/logo.png" alt="Mock-Sphere" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Official Google OAuth</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Sign In to Mock-Sphere
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Authenticate securely with your official Google account to synchronize your assessment and interview records.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-4 pt-1">
          <button
            type="button"
            id="auth-modal-google-btn"
            onClick={handleGoogleClick}
            disabled={loading}
            className="w-full py-4 px-4 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-center gap-2.5 text-xs text-slate-400">
            <Users className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-[11px]">Opens the official Google account chooser. Only verified Google accounts can sign in.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
