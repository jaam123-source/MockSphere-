import React, { useState } from 'react';
import {
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  BrainCircuit,
  GraduationCap,
  ShieldCheck,
  Code2,
  Layers,
  Award,
  Eye,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { User as UserType } from '../types';
import { EmailOutboxModal } from './EmailOutboxModal';

interface LoginGateViewProps {
  onAuthSuccess: (user: UserType) => void;
}

export const LoginGateView: React.FC<LoginGateViewProps> = ({ onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationSuccessData, setRegistrationSuccessData] = useState<{
    user: UserType;
    message: string;
  } | null>(null);
  const [isOutboxOpen, setIsOutboxOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRegistrationSuccessData(null);

    try {
      if (isRegister) {
        const res = await ApiService.register(name.trim(), email.trim(), password);
        setRegistrationSuccessData({
          user: res.user,
          message:
            res.message ||
            `Account created! Welcome registration email dispatched to ${email.trim()}.`,
        });
      } else {
        const res = await ApiService.login(email.trim(), password);
        onAuthSuccess(res.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ApiService.enableDemoMode();
      onAuthSuccess(res.user);
    } catch (err: any) {
      // Fallback direct demo login
      try {
        const loginRes = await ApiService.login('demo@interview.com', 'Demo@123');
        onAuthSuccess(loginRes.user);
      } catch (loginErr: any) {
        setError('Failed to log in with presentation demo credentials: ' + (loginErr.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const fillRegisterDemo = () => {
    setName('Sarah Connor');
    setEmail('sarah.connor@example.com');
    setPassword('Pass@word123');
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

        {/* Right Side: Authentication Box */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-6">
            
            {/* Header Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {registrationSuccessData
                    ? 'Registration Completed!'
                    : isRegister
                    ? 'Candidate Registration'
                    : 'Candidate Sign In'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {registrationSuccessData
                    ? 'Your confirmation email has been dispatched.'
                    : isRegister
                    ? 'Create your account to start diagnostics & receive confirmation mail.'
                    : 'Sign in to access your assessment dashboard & progression.'}
                </p>
              </div>
            </div>

            {/* Error & Registration Alerts */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Registration Success Confirmation Card */}
            {registrationSuccessData ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-3">
                  <div className="flex items-center gap-2.5 font-bold text-emerald-400 text-sm">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <span>Welcome Email Dispatched!</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    You are registered for <strong>Placement Preparation AI</strong>. A confirmation email with your candidate credentials, roadmaps, and next steps has been sent to your Gmail inbox:
                  </p>
                  <div className="p-2.5 bg-slate-950/80 border border-emerald-500/30 rounded-xl text-center font-mono font-bold text-cyan-400">
                    {registrationSuccessData.user.email}
                  </div>
                  <div className="text-[11px] text-slate-400 bg-slate-900/60 rounded-lg p-2 border border-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span>
                      The email is delivered via Gmail SMTP (smtp.gmail.com:587) and is accessible in your mobile Gmail app & inbox.
                    </span>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => onAuthSuccess(registrationSuccessData.user)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Assessment Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOutboxOpen(true)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>Inspect Email Delivery & Outbox</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Candidate Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Johnson"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Email Address (Gmail / Corporate)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="candidate@gmail.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    'Processing...'
                  ) : isRegister ? (
                    <>
                      Complete Registration & Send Mail <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Demo Login Option */}
            {!registrationSuccessData && (
              <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  disabled={loading}
                  className="w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700/80 transition-colors flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>One-Click Demo Candidate Login</span>
                </button>

                <div className="flex items-center justify-between text-xs pt-2">
                  {isRegister ? (
                    <button
                      type="button"
                      onClick={fillRegisterDemo}
                      className="text-cyan-400 hover:underline font-semibold"
                    >
                      Fill sample data
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsOutboxOpen(true)}
                      className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 text-[11px]"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Delivery Outbox</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(!isRegister);
                      setError(null);
                      setRegistrationSuccessData(null);
                    }}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    {isRegister ? 'Already registered? Sign In' : 'New candidate? Register'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Email Outbox & Preview Modal */}
      <EmailOutboxModal
        isOpen={isOutboxOpen}
        onClose={() => setIsOutboxOpen(false)}
        currentUser={registrationSuccessData?.user || null}
      />
    </div>
  );
};
