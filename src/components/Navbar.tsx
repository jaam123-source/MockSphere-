import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  User as UserIcon,
  LogOut,
  Settings,
  History,
  FileText,
  Award,
  Layers,
  Code2,
  Users2,
  Mail,
  Menu,
  X,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { User, UserDashboardState } from '../types';

interface NavbarProps {
  user: User | null;
  dashboard: UserDashboardState | null;
  currentView?: string;
  activeView?: string;
  onNavigate: (view: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenOutbox?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  dashboard,
  currentView,
  activeView,
  onNavigate,
  onOpenAuth,
  onLogout,
  onOpenOutbox,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const selectedView = activeView || currentView || 'dashboard';

  const handleMobileNav = (view: string) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <div
              id="nav-logo"
              onClick={() => handleMobileNav('dashboard')}
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none min-w-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
                <img src="/logo.png" alt="Mock Sphere" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold tracking-tight text-base sm:text-lg md:text-xl text-white group-hover:text-blue-400 transition-colors">
                    Mock-Sphere
                  </span>
                  <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> Pro
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium truncate">
                  AI Virtual Interview Trainer
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                id="nav-btn-dashboard"
                onClick={() => onNavigate('dashboard')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  selectedView === 'dashboard'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Dashboard
              </button>

              <button
                id="nav-btn-final-aptitude"
                onClick={() => onNavigate('final-test')}
                disabled={!dashboard?.progression.final_aptitude_unlocked}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  selectedView === 'final-test' || selectedView === 'final-aptitude'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : dashboard?.progression.final_aptitude_unlocked
                    ? 'text-amber-400 hover:bg-amber-500/10'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <Award className="w-3.5 h-3.5" /> Final Aptitude
              </button>

              <button
                id="nav-btn-technical"
                onClick={() => onNavigate('technical-interview')}
                disabled={!dashboard?.progression.technical_unlocked}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  selectedView === 'technical-interview' || selectedView === 'technical'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : dashboard?.progression.technical_unlocked
                    ? 'text-cyan-400 hover:bg-cyan-500/10'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" /> AI Technical
              </button>

              <button
                id="nav-btn-hr"
                onClick={() => onNavigate('hr-interview')}
                disabled={!dashboard?.progression.hr_unlocked}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  selectedView === 'hr-interview' || selectedView === 'hr'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : dashboard?.progression.hr_unlocked
                    ? 'text-emerald-400 hover:bg-emerald-500/10'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <Users2 className="w-3.5 h-3.5" /> AI HR Round
              </button>

              <button
                id="nav-btn-report"
                onClick={() => onNavigate('final-report')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  selectedView === 'final-report' || selectedView === 'report'
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Final Report
              </button>

              <button
                id="nav-btn-history"
                onClick={() => onNavigate('history')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  selectedView === 'history'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <History className="w-3.5 h-3.5" /> History
              </button>
            </nav>

            {/* Right Actions: User Profile / Admin / Outbox / Auth / Mobile Toggle */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {onOpenOutbox && (
                <button
                  id="nav-btn-email-outbox"
                  onClick={onOpenOutbox}
                  title="View Dispatched Emails"
                  className="p-2 rounded-lg text-xs font-medium text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all relative"
                >
                  <Mail className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                </button>
              )}

              {/* Admin Panel Button - Strictly restricted to jaammaaj123@gmail.com */}
              {user && user.email?.toLowerCase() === 'jaammaaj123@gmail.com' && (
                <button
                  id="nav-btn-admin"
                  onClick={() => onNavigate('admin')}
                  title="Admin Settings & Global Demo Mode"
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    selectedView === 'admin'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin</span>
                </button>
              )}

              {user ? (
                <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-slate-800">
                  {user.email?.toLowerCase() === 'jaammaaj123@gmail.com' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ADMIN
                    </span>
                  )}
                  <div className="hidden md:block text-right">
                    <div className="text-xs font-semibold text-slate-200 max-w-[110px] truncate">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[110px]">{user.email}</div>
                  </div>

                  <button
                    id="nav-btn-logout"
                    onClick={onLogout}
                    title="Sign Out"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  id="nav-btn-login"
                  onClick={onOpenAuth}
                  className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-500/30 flex items-center gap-1.5 transition-all"
                >
                  <UserIcon className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              {/* Hamburger Button for Mobile / Tablet Screen */}
              <button
                id="nav-btn-mobile-menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
                aria-label="Toggle Mobile Navigation"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-900/98 backdrop-blur-xl px-4 py-3 space-y-1.5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
            {user && (
              <div className="p-3 mb-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">{user.email}</div>
                </div>
                {user.email?.toLowerCase() === 'demo@interview.com' && (
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-slate-950 uppercase shrink-0">
                    DEMO
                  </span>
                )}
              </div>
            )}

            <button
              onClick={() => handleMobileNav('dashboard')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                selectedView === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Dashboard & 4 Aptitude Tracks</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => handleMobileNav('final-test')}
              disabled={!dashboard?.progression.final_aptitude_unlocked}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                selectedView === 'final-test'
                  ? 'bg-amber-600 text-white shadow-md'
                  : dashboard?.progression.final_aptitude_unlocked
                  ? 'text-amber-300 hover:bg-slate-800'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Stage 2: Final Aptitude Test</span>
              </div>
              {dashboard?.progression.final_aptitude_unlocked ? (
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>

            <button
              onClick={() => handleMobileNav('technical-interview')}
              disabled={!dashboard?.progression.technical_unlocked}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                selectedView === 'technical-interview'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : dashboard?.progression.technical_unlocked
                  ? 'text-cyan-300 hover:bg-slate-800'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>Stage 3: AI Technical Round (5 Tracks)</span>
              </div>
              {dashboard?.progression.technical_unlocked ? (
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>

            <button
              onClick={() => handleMobileNav('hr-interview')}
              disabled={!dashboard?.progression.hr_unlocked}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                selectedView === 'hr-interview'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : dashboard?.progression.hr_unlocked
                  ? 'text-emerald-300 hover:bg-slate-800'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users2 className="w-4 h-4 text-emerald-400" />
                <span>Stage 4: AI Behavioral HR Round</span>
              </div>
              {dashboard?.progression.hr_unlocked ? (
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>

            <button
              onClick={() => handleMobileNav('final-report')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                selectedView === 'final-report'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Final Candidate Performance Report</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => handleMobileNav('history')}
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                selectedView === 'history'
                  ? 'bg-slate-700 text-white shadow-md'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className="w-4 h-4 text-slate-400" />
                <span>History & Attempts Log</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            {user && user.email?.toLowerCase() === 'jaammaaj123@gmail.com' && (
              <button
                onClick={() => handleMobileNav('admin')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all border ${
                  selectedView === 'admin'
                    ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                    : 'text-amber-300 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-amber-400" />
                  <span>Admin Panel & Global Demo Mode</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>
            )}
          </div>
        )}
      </header>

      {/* Mobile Sticky Quick Navigation Bar at Bottom */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-1.5 px-3 flex items-center justify-around shadow-2xl safe-area-bottom"
      >
        <button
          onClick={() => handleMobileNav('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all ${
            selectedView === 'dashboard' || selectedView === 'topic-levels' || selectedView === 'quiz' || selectedView === 'revision'
              ? 'text-indigo-400 bg-indigo-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Aptitude</span>
        </button>

        <button
          onClick={() => handleMobileNav('final-test')}
          disabled={!dashboard?.progression.final_aptitude_unlocked}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all ${
            selectedView === 'final-test'
              ? 'text-amber-400 bg-amber-500/10'
              : dashboard?.progression.final_aptitude_unlocked
              ? 'text-slate-300 hover:text-amber-300'
              : 'text-slate-600 opacity-50 cursor-not-allowed'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Final Test</span>
        </button>

        <button
          onClick={() => handleMobileNav('technical-interview')}
          disabled={!dashboard?.progression.technical_unlocked}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all ${
            selectedView === 'technical-interview'
              ? 'text-cyan-400 bg-cyan-500/10'
              : dashboard?.progression.technical_unlocked
              ? 'text-slate-300 hover:text-cyan-300'
              : 'text-slate-600 opacity-50 cursor-not-allowed'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Technical</span>
        </button>

        <button
          onClick={() => handleMobileNav('hr-interview')}
          disabled={!dashboard?.progression.hr_unlocked}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all ${
            selectedView === 'hr-interview'
              ? 'text-emerald-400 bg-emerald-500/10'
              : dashboard?.progression.hr_unlocked
              ? 'text-slate-300 hover:text-emerald-300'
              : 'text-slate-600 opacity-50 cursor-not-allowed'
          }`}
        >
          <Users2 className="w-4 h-4" />
          <span>HR Round</span>
        </button>

        <button
          onClick={() => handleMobileNav('final-report')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-bold transition-all ${
            selectedView === 'final-report'
              ? 'text-purple-400 bg-purple-500/10'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Report</span>
        </button>
      </nav>
    </>
  );
};

