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
  ShieldAlert,
  Play,
  AlertTriangle,
  Info,
  Power,
  ToggleLeft,
  ToggleRight,
  Check,
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
}) => {
  const currentUserEmail = (dashboard?.user?.email || '').trim().toLowerCase();
  const isAdmin = currentUserEmail === 'jaammaaj123@gmail.com';

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
    globalDemoMode: false,
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [isTogglingDemo, setIsTogglingDemo] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const s = await ApiService.getAdminSettings();
        setSettings(s);
      } catch (err: any) {
        console.error('Error loading admin settings:', err);
      }
    }
    load();
  }, []);

  const handleToggleGlobalDemo = async (targetState: boolean) => {
    setIsTogglingDemo(true);
    setStatusMessage(null);
    try {
      const res = await ApiService.toggleGlobalDemoMode(targetState);
      setSettings(res.settings);
      onRefreshDashboard();
      setStatusMessage({
        type: 'success',
        text: res.message || (targetState ? 'Global Demo Mode enabled for all users.' : 'Global Demo Mode disabled.'),
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Failed to toggle Demo Mode: ${err.message}`,
      });
    } finally {
      setIsTogglingDemo(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setStatusMessage(null);
    try {
      const updated = await ApiService.updateAdminSettings(settings);
      setSettings(updated);
      onRefreshDashboard();
      setStatusMessage({
        type: 'success',
        text: 'System progression settings and cutoffs updated successfully!',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Save error: ${err.message}`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickUnlock = async (milestone: string) => {
    setIsSimulating(true);
    setStatusMessage(null);
    try {
      await ApiService.quickUnlock(milestone);
      onRefreshDashboard();
      setStatusMessage({
        type: 'success',
        text: `Simulation Applied: Unlocked ${milestone}!`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Unlock error: ${err.message}`,
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleResetProgress = async () => {
    if (!confirm('Are you sure you want to reset current candidate test progress and interview history?')) {
      return;
    }
    setIsSimulating(true);
    setStatusMessage(null);
    try {
      await ApiService.resetProgress();
      onRefreshDashboard();
      setStatusMessage({
        type: 'success',
        text: 'Current candidate test progress has been reset to initial baseline.',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Reset error: ${err.message}`,
      });
    } finally {
      setIsSimulating(false);
    }
  };

  // If NOT the verified administrator (jaammaaj123@gmail.com), deny access strictly
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Administrator Access Restricted</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Only the designated administrator account (<strong>jaammaaj123@gmail.com</strong>) has permission to access system settings, thresholds, and Demo Mode controls.
          </p>
        </div>

        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 text-left">
          <span className="text-slate-500">Current Logged-in Account:</span>
          <div className="font-semibold text-slate-200 truncate mt-0.5">{dashboard?.user?.email || 'Guest / Unauthenticated'}</div>
        </div>

        <button
          onClick={onBack}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Administrator Portal
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Admin & Demonstration Control Center
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorized Account: <strong className="text-amber-300 font-mono">jaammaaj123@gmail.com</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 self-start sm:self-auto transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Status feedback message */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-fadeIn ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* SECTION 1: GLOBAL DEMO MODE CONTROL */}
      <div className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-indigo-950/30 border-2 border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Power className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">Global Demo Mode for All Users</h2>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    settings.globalDemoMode
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {settings.globalDemoMode ? '● ACTIVE FOR ALL USERS' : '○ DISABLED (STANDARD QUALIFICATION)'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                When enabled, all logged-in Google users have prerequisite checks bypassed, unlocking the Final Aptitude Test, AI Technical Round, and AI HR Behavioral Interview for live presentation and testing.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {settings.globalDemoMode ? (
              <button
                id="btn-disable-global-demo"
                onClick={() => handleToggleGlobalDemo(false)}
                disabled={isTogglingDemo}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs font-bold flex items-center gap-2 shadow-lg transition-all"
              >
                <ToggleRight className="w-5 h-5 text-emerald-400" />
                <span>{isTogglingDemo ? 'Updating...' : 'Disable Demo Mode'}</span>
              </button>
            ) : (
              <button
                id="btn-enable-global-demo"
                onClick={() => handleToggleGlobalDemo(true)}
                disabled={isTogglingDemo}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white border border-amber-500/50 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-600/30 transition-all"
              >
                <ToggleLeft className="w-5 h-5 text-amber-300" />
                <span>{isTogglingDemo ? 'Activating...' : 'Enable Demo Mode for All'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Demo Mode Details Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> When Demo Mode is Enabled:
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              All 4 aptitude domains (40 levels + 8 topic tests) and Final Aptitude are marked as qualified, enabling instant demonstration of multimodal speech interview features.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="font-bold text-cyan-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> When Demo Mode is Disabled:
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Strict sequential qualification is enforced: Candidates must pass each level (cutoffs below) and topic tests in order before accessing advanced interview stages.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: MILESTONE QUICK UNLOCKS (SIMULATOR) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Unlock className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Manual Candidate Progress Manipulation</h2>
          </div>
          <span className="text-xs text-slate-400">Applies to: {dashboard?.user?.email}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => handleQuickUnlock('level5')}
            disabled={isSimulating}
            className="p-3.5 bg-slate-950/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 rounded-xl text-left text-xs space-y-1 transition-all"
          >
            <div className="font-bold text-indigo-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Unlock Test 1 Checkpoints
            </div>
            <p className="text-slate-400 text-[11px]">Clears Levels 1-5 across all 4 topics to take Test 1.</p>
          </button>

          <button
            onClick={() => handleQuickUnlock('all_topics')}
            disabled={isSimulating}
            className="p-3.5 bg-slate-950/80 hover:bg-amber-950/60 border border-slate-800 hover:border-amber-500/40 rounded-xl text-left text-xs space-y-1 transition-all"
          >
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Unlock Final Aptitude Test
            </div>
            <p className="text-slate-400 text-[11px]">Marks all 40 levels & 8 tests as passed to unlock Final Test.</p>
          </button>

          <button
            onClick={() => handleQuickUnlock('technical')}
            disabled={isSimulating}
            className="p-3.5 bg-slate-950/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-500/40 rounded-xl text-left text-xs space-y-1 transition-all"
          >
            <div className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> Unlock AI Technical Round
            </div>
            <p className="text-slate-400 text-[11px]">Directly unlocks the Multimodal AI Technical Interview (5 tracks).</p>
          </button>

          <button
            onClick={() => handleQuickUnlock('hr')}
            disabled={isSimulating}
            className="p-3.5 bg-slate-950/80 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-left text-xs space-y-1 transition-all"
          >
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <Users2 className="w-3.5 h-3.5" /> Unlock AI HR Round
            </div>
            <p className="text-slate-400 text-[11px]">Directly unlocks the Behavioral STAR leadership interview.</p>
          </button>

          <button
            onClick={() => handleQuickUnlock('complete')}
            disabled={isSimulating}
            className="p-3.5 bg-slate-950/80 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-500/40 rounded-xl text-left text-xs space-y-1 transition-all"
          >
            <div className="font-bold text-purple-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Full Pipeline Complete
            </div>
            <p className="text-slate-400 text-[11px]">Completes all stages and prepares comprehensive candidate report.</p>
          </button>

          <button
            onClick={handleResetProgress}
            disabled={isSimulating}
            className="p-3.5 bg-slate-950/80 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 rounded-xl text-left text-xs space-y-1 transition-all"
          >
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5" /> Reset Session Progress
            </div>
            <p className="text-slate-400 text-[11px]">Resets all topic levels and interview history back to zero.</p>
          </button>
        </div>
      </div>

      {/* SECTION 3: PASSING CUTOFFS & TIMERS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Passing Cutoffs & Time Limits</h2>
          </div>
          <span className="text-xs text-slate-400">System-wide scoring rules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Level Cutoff */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Aptitude Level Passing Cutoff</span>
              <span className="text-cyan-400 font-mono">{settings.levelCutoff}%</span>
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
              <span className="text-cyan-400 font-mono">{settings.testCutoff}%</span>
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
              <span className="text-amber-400 font-mono">{settings.finalTestCutoff}%</span>
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
              <span className="text-cyan-400 font-mono">{settings.technicalCutoff}%</span>
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
              <span className="text-emerald-400 font-mono">{settings.hrCutoff}%</span>
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
              <span className="text-indigo-400 font-mono">{settings.levelTimerMinutes} min</span>
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
