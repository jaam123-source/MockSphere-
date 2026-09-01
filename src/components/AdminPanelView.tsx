import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sliders,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Lock,
  Unlock,
  Layers,
  Award,
  Code2,
  Users2,
  ArrowLeft,
  ShieldCheck,
  Play,
  LogOut,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { AdminSettings, User, UserDashboardState } from '../types';
import { ApiService } from '../services/api';

interface AdminPanelViewProps {
  dashboard: UserDashboardState;
  onBack: () => void;
  onRefreshDashboard: () => void;
  onSwitchUser?: (user: User) => void;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  dashboard,
  onBack,
  onRefreshDashboard,
  onSwitchUser,
}) => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    // If current session is demo or already authenticated
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });
  const [adminPasscode, setAdminPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [settings, setSettings] = useState<AdminSettings>({
    levelCutoff: 70,
    testCutoff: 70,
    finalTestCutoff: 70,
    technicalCutoff: 60,
    hrCutoff: 60,
    levelTimerMinutes: 10,
    testTimerMinutes: 20,
    finalTestTimerMinutes: 30,
    aiModel: 'gemini-3.7-flash',
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [demoActionLoading, setDemoActionLoading] = useState<boolean>(false);

  const isCurrentDemoUser = dashboard?.user?.email?.toLowerCase() === 'demo@interview.com';

  useEffect(() => {
    async function load() {
      try {
        const s = await ApiService.getAdminSettings();
        setSettings(s);
      } catch (err) {
        console.error('Error loading admin settings:', err);
      }
    }
    load();
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default college presentation passcode
    if (adminPasscode === 'admin' || adminPasscode === 'ADMIN2026' || adminPasscode === 'Admin@123' || adminPasscode === '1234') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setAuthError(null);
    } else {
      setAuthError('Incorrect admin key. (Default: ADMIN2026 or Admin@123)');
    }
  };

  const handleEnableDemoMode = async () => {
    setDemoActionLoading(true);
    try {
      const res = await ApiService.enableDemoMode();
      if (onSwitchUser) {
        onSwitchUser(res.user);
      }
      onRefreshDashboard();
      alert('Demo Mode Activated! Logged in as demo@interview.com with full aptitude journey completed.');
    } catch (err: any) {
      alert(`Failed to activate demo mode: ${err.message}`);
    } finally {
      setDemoActionLoading(false);
    }
  };

  const handleResetDemoData = async () => {
    if (!confirm('Reset demo dataset for demo@interview.com to the starting presentation state? (All real student data remains untouched).')) {
      return;
    }
    setDemoActionLoading(true);
    try {
      await ApiService.resetDemoMode();
      onRefreshDashboard();
      alert('Demo candidate data has been reset to starting qualified state (Technical Round unlocked & ready).');
    } catch (err: any) {
      alert(`Failed to reset demo data: ${err.message}`);
    } finally {
      setDemoActionLoading(false);
    }
  };

  const handleExitDemoMode = async () => {
    setDemoActionLoading(true);
    try {
      // Revert to demo student or prompt logout
      await ApiService.logout();
      window.location.reload();
    } catch (err: any) {
      alert(`Exit demo error: ${err.message}`);
    } finally {
      setDemoActionLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const updated = await ApiService.updateAdminSettings(settings);
      setSettings(updated);
      onRefreshDashboard();
      alert('Progression settings updated successfully!');
    } catch (err: any) {
      alert(`Save error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickUnlock = async (milestone: string) => {
    setIsSimulating(true);
    try {
      await ApiService.quickUnlock(milestone);
      onRefreshDashboard();
      alert(`Simulation Applied: Unlocked ${milestone}!`);
    } catch (err: any) {
      alert(`Unlock error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetProgress = async () => {
    if (!confirm('Are you sure you want to reset current user test progress, attempts, and interview history?')) {
      return;
    }
    setIsSimulating(true);
    try {
      await ApiService.resetProgress();
      onRefreshDashboard();
      alert('Progress has been reset to starting state.');
    } catch (err: any) {
      alert(`Reset error: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  // If Admin protection is required and not verified
  if (!isAdminAuthenticated && !isCurrentDemoUser) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-fadeIn">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Admin Verification Required</h2>
          <p className="text-xs text-slate-400 mt-1">
            Enter Admin Access Key to configure system thresholds or activate College Project Demo Mode.
          </p>
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              autoFocus
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value)}
              placeholder="Enter Admin Key (e.g. ADMIN2026)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onBack}
              className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition-all"
            >
              Authenticate Admin
            </button>
          </div>
        </form>

        <div className="text-[11px] text-slate-500 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 text-left space-y-1">
          <div className="font-semibold text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" /> Evaluation Passcode:
          </div>
          <div>Use <code className="text-cyan-300 font-mono font-bold">ADMIN2026</code> or <code className="text-cyan-300 font-mono font-bold">Admin@123</code></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-1">
              <Settings className="w-3.5 h-3.5" /> System Controls & Presentation Manager
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Admin & Demonstration Control Center
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage the College Presentation Demo Mode, customize progression cutoffs, and monitor evaluation metrics.
            </p>
          </div>
        </div>
      </div>

      {/* College Project Presentation: ADMIN DEMO MODE BOX */}
      <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-indigo-950/40 border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">College Project Presentation: Demo Mode</h2>
                <span
                  className={`text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isCurrentDemoUser
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {isCurrentDemoUser ? 'DEMO MODE ACTIVE' : 'INACTIVE (STANDALONE)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Bypasses lengthy aptitude tests during live demonstration using a segregated account (<code>demo@interview.com</code>).
              </p>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-300 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            Active Session: <strong className="text-cyan-400">{dashboard.user.email}</strong>
          </div>
        </div>

        {/* Demo Mode Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={handleEnableDemoMode}
            disabled={demoActionLoading || isCurrentDemoUser}
            className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between gap-2 ${
              isCurrentDemoUser
                ? 'bg-slate-900/60 border-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/30'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs flex items-center gap-1.5">
                <Play className="w-4 h-4" /> Enable Demo Mode
              </span>
              {isCurrentDemoUser && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </div>
            <p className="text-[11px] opacity-90 leading-tight">
              Switches to <code>demo@interview.com</code> with all 40 levels passed, 8 tests passed, Final Aptitude passed (88%), and Technical Round unlocked!
            </p>
          </button>

          <button
            onClick={handleResetDemoData}
            disabled={demoActionLoading}
            className="p-4 rounded-xl text-left bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-200 transition-all flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-amber-400 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4" /> Reset Demo Data
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Clears previous interview recordings and resets <code>demo@interview.com</code> back to the clean Technical Round start.
            </p>
          </button>

          <button
            onClick={handleExitDemoMode}
            disabled={demoActionLoading}
            className="p-4 rounded-xl text-left bg-slate-950/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/40 text-slate-200 transition-all flex flex-col justify-between gap-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-rose-400 flex items-center gap-1.5">
                <LogOut className="w-4 h-4" /> Exit Demo Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Exits presentation mode and returns to standard student login / session. Real candidate data is never affected.
            </p>
          </button>
        </div>

        {/* Live Presentation Step Walkthrough Guide */}
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-2.5">
          <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Recommended Live Presentation Sequence for Faculty Evaluators:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 text-[11px] text-slate-300">
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <div className="font-bold text-indigo-400">1. Dashboard View</div>
              <p className="text-[10px] text-slate-400">Showcase completed 4-topic progression & 10/10 level meters.</p>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <div className="font-bold text-amber-400">2. Final Aptitude</div>
              <p className="text-[10px] text-slate-400">Review 25-question passed score (88%) & explanation review.</p>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <div className="font-bold text-cyan-400">3. Technical Round</div>
              <p className="text-[10px] text-slate-400">Pick domain (e.g. Full-Stack), answer via voice/text, get AI evaluation.</p>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <div className="font-bold text-emerald-400">4. HR Behavioral</div>
              <p className="text-[10px] text-slate-400">Answer STAR leadership question, get AI communication scoring.</p>
            </div>
            <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <div className="font-bold text-purple-400">5. Final Dossier</div>
              <p className="text-[10px] text-slate-400">Review full radar dossier & AI diagnostic personalized action plan.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Quick Simulation & Unlock Buttons (for active user) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Unlock className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Manual Progress Manipulation (Current Session)</h2>
          </div>
          <span className="text-xs text-slate-400">Applies to active user: {dashboard.user.name}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => handleQuickUnlock('level5')}
            disabled={isSimulating}
            className="p-3 bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-left text-xs space-y-1 transition-all"
          >
            <div className="font-bold text-indigo-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Unlock Test 1 Checkpoints
            </div>
            <p className="text-slate-400 text-[11px]">Clears Levels 1-5 across all 4 topics to take Test 1.</p>
          </button>

          <button
            onClick={() => handleQuickUnlock('all_topics')}
            disabled={isSimulating}
            className="p-3 bg-slate-950/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/40 rounded-xl text-left text-xs space-y-1 transition-all"
          >
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Unlock Final Aptitude Test
            </div>
            <p className="text-slate-400 text-[11px]">Marks all 40 levels & 8 tests as passed to unlock 25-question Final Test.</p>
          </button>

          <button
            onClick={() => handleQuickUnlock('technical')}
            disabled={isSimulating}
            className="p-3 bg-slate-950/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-left text-xs space-y-1 transition-all"
          >
            <div className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Unlock AI Technical Round
            </div>
            <p className="text-slate-400 text-[11px]">Directly unlocks the Multimodal AI Technical Interview.</p>
          </button>

          <button
            onClick={() => handleQuickUnlock('hr')}
            disabled={isSimulating}
            className="p-3 bg-slate-950/80 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-left text-xs space-y-1 transition-all"
          >
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Users2 className="w-3.5 h-3.5" /> Unlock AI HR Round
            </div>
            <p className="text-slate-400 text-[11px]">Directly unlocks the Behavioral STAR leadership interview.</p>
          </button>

          <button
            onClick={() => handleQuickUnlock('complete')}
            disabled={isSimulating}
            className="p-3 bg-slate-950/80 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 rounded-xl text-left text-xs space-y-1 transition-all"
          >
            <div className="font-bold text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Full Pipeline Complete
            </div>
            <p className="text-slate-400 text-[11px]">Completes all stages and prepares comprehensive candidate dossier.</p>
          </button>

          <button
            onClick={handleResetProgress}
            disabled={isSimulating}
            className="p-3 bg-slate-950/80 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 rounded-xl text-left text-xs space-y-1 transition-all"
          >
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Reset Current Session
            </div>
            <p className="text-slate-400 text-[11px]">Resets all topic levels and interview history back to zero.</p>
          </button>
        </div>
      </div>

      {/* Passing Cutoffs Configuration */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white">Passing Cutoffs & Time Limits</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Level Cutoff */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Aptitude Level Passing Cutoff</span>
              <span className="text-cyan-400">{settings.levelCutoff}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={90}
              step={5}
              value={settings.levelCutoff}
              onChange={(e) => setSettings({ ...settings, levelCutoff: Number(e.target.value) })}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Test Cutoff */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">5-Level Topic Test Cutoff</span>
              <span className="text-cyan-400">{settings.testCutoff}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={90}
              step={5}
              value={settings.testCutoff}
              onChange={(e) => setSettings({ ...settings, testCutoff: Number(e.target.value) })}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Final Test Cutoff */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Final Aptitude Assessment Cutoff</span>
              <span className="text-amber-400">{settings.finalTestCutoff}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={90}
              step={5}
              value={settings.finalTestCutoff}
              onChange={(e) => setSettings({ ...settings, finalTestCutoff: Number(e.target.value) })}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Technical Round Cutoff */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">AI Technical Interview Cutoff</span>
              <span className="text-cyan-400">{settings.technicalCutoff}%</span>
            </div>
            <input
              type="range"
              min={40}
              max={80}
              step={5}
              value={settings.technicalCutoff}
              onChange={(e) => setSettings({ ...settings, technicalCutoff: Number(e.target.value) })}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* HR Round Cutoff */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">AI HR Behavioral Cutoff</span>
              <span className="text-emerald-400">{settings.hrCutoff}%</span>
            </div>
            <input
              type="range"
              min={40}
              max={80}
              step={5}
              value={settings.hrCutoff}
              onChange={(e) => setSettings({ ...settings, hrCutoff: Number(e.target.value) })}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Timers */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Level Practice Timer (Minutes)</span>
              <span className="text-indigo-400">{settings.levelTimerMinutes} min</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={settings.levelTimerMinutes}
              onChange={(e) => setSettings({ ...settings, levelTimerMinutes: Number(e.target.value) })}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
          >
            {isSaving ? 'Saving...' : 'Save Configuration Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
