import React, { useState } from 'react';
import {
  BrainCircuit,
  GraduationCap,
  Code2,
  Layers,
  Award,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { User as UserType } from '../types';
import { GoogleAccountChooserModal } from './GoogleAccountChooserModal';

interface LoginGateViewProps {
  onAuthSuccess: (user: UserType) => void;
}

export const LoginGateView: React.FC<LoginGateViewProps> = ({ onAuthSuccess }) => {
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  const handleOpenGoogleAuth = () => {
    setError(null);
    setIsGoogleModalOpen(true);
  };

  const handleGoogleSuccess = (user: UserType, message?: string) => {
    setLoading(true);
    setSuccessInfo(message || `Authenticated as ${user.name}`);
    setError(null);
    setTimeout(() => {
      onAuthSuccess(user);
    }, 400);
  };

  const handleGoogleError = (errorMsg: string) => {
    setError(errorMsg);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        
        {/* Left Side: Product Branding & Overview */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Campus Placement Preparation Portal</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              AI Multimodal <br />
              <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Interview Assessment
              </span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Prepare for tier-1 tech and campus placements with automated diagnostic aptitude testing, multimodal speech & code evaluations, and intelligent STAR HR interviews.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-200">10-Level Topic Maps</div>
                <div className="text-slate-400 text-[11px]">Quant, Logical, Verbal & Special</div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Code2 className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-200">Multimodal Tech Round</div>
                <div className="text-slate-400 text-[11px]">Voice, code IDE & architecture</div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-200">STAR Behavioral AI</div>
                <div className="text-slate-400 text-[11px]">Culture fit and psychometrics</div>
              </div>
            </div>

            <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-200">Diagnostic Reports</div>
                <div className="text-slate-400 text-[11px]">Personalized improvement plans</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Google Authentication Box */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6 text-left">
            
            {/* Header */}
            <div className="space-y-1.5 pb-2 border-b border-slate-800/80">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Google OAuth 2.0 Authentication</span>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Candidate Sign In
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sign in with your Google account to access your personalized diagnostic assessment, live interview simulations, and placement preparation reports.
              </p>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Feedback Display */}
            {successInfo && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successInfo}</span>
              </div>
            )}

            {/* Single "Continue with Google" Action */}
            <div className="space-y-4 pt-1">
              <button
                type="button"
                id="btn-continue-with-google"
                onClick={handleOpenGoogleAuth}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl shadow-xl shadow-indigo-950/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
              >
                {loading ? (
                  <span className="flex items-center gap-2 text-slate-700">
                    <span className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <span>Signing in with Google...</span>
                  </span>
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

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-1 text-center">
                <div className="text-[11px] font-semibold text-slate-400">
                  Single Sign-On (SSO) with Google
                </div>
                <div className="text-[11px] text-slate-500">
                  New and existing accounts are linked seamlessly with no duplicate entries.
                </div>
              </div>
            </div>

            {/* Quick Profile Selection */}
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <button
                type="button"
                id="btn-choose-account"
                onClick={handleOpenGoogleAuth}
                className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-slate-700/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Switch / Select Google Account</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Google Account Chooser & Sign-In Dialog */}
      <GoogleAccountChooserModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
      />
    </div>
  );
};
