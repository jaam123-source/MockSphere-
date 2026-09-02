import React, { useState } from 'react';
import {
  BrainCircuit,
  Code2,
  Layers,
  Award,
  ShieldCheck,
  Users,
  Sparkles,
  Lock,
} from 'lucide-react';
import { User as UserType } from '../types';
import { GoogleAccountChooserModal } from './GoogleAccountChooserModal';

interface LoginGateViewProps {
  onAuthSuccess: (user: UserType) => void;
}

export const LoginGateView: React.FC<LoginGateViewProps> = ({ onAuthSuccess }) => {
  const [showChooser, setShowChooser] = useState<boolean>(false);

  return (
    <>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
          
          {/* Left Side: Product Branding & Overview */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-xl shadow-indigo-500/20 border-2 border-indigo-500/30 shrink-0">
                <img src="/logo.png" alt="Mock-Sphere" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <span>Campus Placement Preparation Portal</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Official AI Assessment Suite</p>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Mock-Sphere
              </h1>
              <p className="text-base sm:text-xl font-bold bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                AI Virtual Interview Trainer
              </p>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl">
                Prepare for Tier-1 technology companies and campus placements with diagnostic aptitude tests, multimodal code & speech evaluations, and intelligent STAR behavioral interviews.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-xl">
              <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-2xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <div className="font-bold text-slate-200">10-Level Topic Mastery</div>
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

          {/* Right Side: Clean Authentication Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6 text-left relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-2 pb-2 border-b border-slate-800/80">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Google Authentication</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Candidate Portal Sign In
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Sign in with your verified personal Google account to access practice tests, resume your learning progress, and launch AI interview rounds.
                </p>
              </div>

              <div className="space-y-4 pt-1">
                <button
                  type="button"
                  id="btn-continue-with-google"
                  onClick={() => setShowChooser(true)}
                  className="w-full py-4 px-4 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl shadow-xl shadow-indigo-950/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 cursor-pointer border border-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
                >
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
                </button>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-[11px] text-slate-400 leading-snug">
                    Enter your personal Google Gmail address to sign in instantly with zero configuration errors.
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" /> Secure SSL Session
                  </span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-cyan-400" /> AI Feedback Engine
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <GoogleAccountChooserModal
        isOpen={showChooser}
        onClose={() => setShowChooser(false)}
        onSelectUser={(user) => {
          setShowChooser(false);
          onAuthSuccess(user);
        }}
      />
    </>
  );
};
