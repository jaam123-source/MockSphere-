import React, { useState, useEffect } from 'react';
import { Sparkles, RotateCcw, LogOut, ShieldCheck } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { LoginGateView } from './components/LoginGateView';
import { DashboardView } from './components/DashboardView';
import { TopicLevelMapView } from './components/TopicLevelMapView';
import { QuizEngine } from './components/QuizEngine';
import { RevisionModeView } from './components/RevisionModeView';
import { FinalAptitudeTestView } from './components/FinalAptitudeTestView';
import { TechnicalInterviewView } from './components/TechnicalInterviewView';
import { HRInterviewView } from './components/HRInterviewView';
import { FinalReportView } from './components/FinalReportView';
import { PerformanceHistoryView } from './components/PerformanceHistoryView';
import { AdminPanelView } from './components/AdminPanelView';
import { AuthModal } from './components/AuthModal';
import { EmailOutboxModal } from './components/EmailOutboxModal';
import { ApiService } from './services/api';
import { SpeechService } from './utils/speech';
import {
  AptitudeTopicId,
  QuizMode,
  User,
  UserDashboardState,
} from './types';

type ActiveView =
  | 'dashboard'
  | 'topic-levels'
  | 'quiz'
  | 'revision'
  | 'final-test'
  | 'technical-interview'
  | 'hr-interview'
  | 'final-report'
  | 'history'
  | 'admin';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(ApiService.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isOutboxOpen, setIsOutboxOpen] = useState<boolean>(false);
  const [dashboard, setDashboard] = useState<UserDashboardState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isResettingDemo, setIsResettingDemo] = useState<boolean>(false);

  // Active View State
  const [currentView, setCurrentView] = useState<ActiveView>('dashboard');
  const [selectedTopicId, setSelectedTopicId] = useState<AptitudeTopicId>('quantitative');

  // Quiz context
  const [quizMode, setQuizMode] = useState<QuizMode>('level');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [activeTestNumber, setActiveTestNumber] = useState<1 | 2>(1);

  // Fetch Dashboard State
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadDashboard = async () => {
    const user = ApiService.getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }
    // Only set loading spinner if dashboard has not been fetched yet
    if (!dashboard) {
      setLoading(true);
    }
    setLoadError(null);
    try {
      const state = await ApiService.getDashboardState();
      setDashboard(state);
      if (state.user) {
        setCurrentUser(state.user);
      }
    } catch (err: any) {
      console.error('Failed to load dashboard state:', err);
      // Only clear session if initial load failed with explicit auth error
      if (
        !dashboard &&
        err.message &&
        (err.message.includes('401') ||
          err.message.includes('Authentication required') ||
          err.message.includes('User not found'))
      ) {
        ApiService.logout();
        setCurrentUser(null);
      } else if (!dashboard) {
        setLoadError(err.message || 'Failed to connect to backend server');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Stop speech synthesis whenever changing views
  useEffect(() => {
    SpeechService.stopSpeaking();
  }, [currentView]);

  const handleSelectTopic = (topicId: AptitudeTopicId) => {
    setSelectedTopicId(topicId);
    setCurrentView('topic-levels');
  };

  const handleStartLevel = (topicId: AptitudeTopicId, levelId: number) => {
    const numLevel = typeof levelId === 'number' ? levelId : parseInt(String(levelId), 10) || 1;
    setSelectedTopicId(topicId);
    setActiveLevelId(numLevel);
    setQuizMode('level');
    setCurrentView('quiz');
  };

  const handleStartTopicTest = (topicId: AptitudeTopicId, testNumber: 1 | 2) => {
    const numTest = Number(testNumber) === 2 ? 2 : 1;
    setSelectedTopicId(topicId);
    setActiveTestNumber(numTest);
    setQuizMode('test');
    setCurrentView('quiz');
  };

  const handleOpenRevision = (topicId: AptitudeTopicId) => {
    setSelectedTopicId(topicId);
    setCurrentView('revision');
  };

  const handleLogout = () => {
    ApiService.logout();
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleResetDemoData = async () => {
    if (!confirm('Reset demo dataset for demo@interview.com to the starting presentation state? (Real student data is untouched).')) {
      return;
    }
    setIsResettingDemo(true);
    try {
      await ApiService.resetDemoMode();
      await loadDashboard();
      alert('Demo candidate dataset has been reset! Ready for live Technical and HR presentation.');
    } catch (err: any) {
      alert(`Error resetting demo data: ${err.message}`);
    } finally {
      setIsResettingDemo(false);
    }
  };

  const isDemoMode = currentUser?.email?.toLowerCase() === 'demo@interview.com' || currentUser?.user_id === 'user_demo_presentation';

  // If candidate is not authenticated, require login / register gate before accessing dashboard
  if (!currentUser) {
    return (
      <LoginGateView
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          loadDashboard();
        }}
      />
    );
  }

  if (loading || !dashboard) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 space-y-4">
        {loadError ? (
          <div className="max-w-md w-full p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Connection Error</h3>
              <p className="text-xs text-slate-400 mt-1">{loadError}</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={loadDashboard}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/20"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Connection</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Sign In Again
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-white tracking-wide">
                AI Multimodal Interview Assessment System
              </p>
              <p className="text-xs text-slate-400">Loading candidate progress and diagnostic engines...</p>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Banner when in DEMO MODE (Admin only) */}
      {isDemoMode && currentUser?.email?.toLowerCase() === 'jaammaaj123@gmail.com' && (
        <aside
          id="demo-mode-top-banner"
          aria-label="Demo Mode Notification"
          className="bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 border-b border-amber-500/40 px-4 py-2 sm:px-6 shadow-lg z-50 sticky top-0"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500 text-slate-950 tracking-wider shadow-sm animate-pulse">
                DEMO MODE
              </span>
              <span className="text-xs font-medium text-amber-200">
                College Project Presentation • Candidate: <span className="font-mono text-cyan-300 font-bold">{currentUser.email}</span> • Aptitude Complete ✓ (Technical & HR Live Ready)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="banner-btn-reset-demo"
                onClick={handleResetDemoData}
                disabled={isResettingDemo}
                className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 border border-amber-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isResettingDemo ? 'animate-spin' : ''}`} />
                <span>{isResettingDemo ? 'Resetting...' : 'Reset Demo Data'}</span>
              </button>
              <button
                id="banner-btn-exit-demo"
                onClick={handleLogout}
                className="px-3 py-1 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Demo Mode</span>
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Global Navigation Bar */}
      <Navbar
        user={currentUser}
        dashboard={dashboard}
        activeView={currentView}
        onNavigate={(view) => setCurrentView(view as ActiveView)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenOutbox={() => setIsOutboxOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-8 min-w-0 overflow-x-hidden">
        {currentView === 'dashboard' && (
          <DashboardView
            dashboard={dashboard}
            onSelectTopic={handleSelectTopic}
            onStartLevel={handleStartLevel}
            onStartTopicTest={handleStartTopicTest}
            onStartFinalTest={() => setCurrentView('final-test')}
            onStartTechnicalInterview={() => setCurrentView('technical-interview')}
            onStartHRInterview={() => setCurrentView('hr-interview')}
            onViewFinalReport={() => setCurrentView('final-report')}
            onOpenAdmin={() => setCurrentView('admin')}
            onOpenHistory={() => setCurrentView('history')}
          />
        )}

        {currentView === 'topic-levels' && (
          <TopicLevelMapView
            topicId={selectedTopicId}
            dashboard={dashboard}
            onBack={() => setCurrentView('dashboard')}
            onStartLevel={(topic, lvl) => handleStartLevel(topic || selectedTopicId, lvl)}
            onStartTest={(topic, testNum) => handleStartTopicTest(topic || selectedTopicId, testNum)}
            onOpenRevision={() => handleOpenRevision(selectedTopicId)}
            onStartFinalTest={() => setCurrentView('final-test')}
            onStartTechnicalInterview={() => setCurrentView('technical-interview')}
            onSelectTopic={handleSelectTopic}
          />
        )}

        {currentView === 'quiz' && (
          <QuizEngine
            topicId={selectedTopicId}
            mode={quizMode}
            levelId={activeLevelId}
            testNumber={activeTestNumber}
            dashboard={dashboard}
            onBack={() => setCurrentView('topic-levels')}
            onRefreshDashboard={loadDashboard}
            onProceedNextLevel={(nextLvl) => {
              setActiveLevelId(nextLvl);
              setQuizMode('level');
              setCurrentView('quiz');
            }}
            onProceedTest={(testNum) => {
              setActiveTestNumber(testNum);
              setQuizMode('test');
              setCurrentView('quiz');
            }}
            onOpenRevision={() => handleOpenRevision(selectedTopicId)}
            onStartFinalTest={() => setCurrentView('final-test')}
            onStartTechnicalInterview={() => setCurrentView('technical-interview')}
          />
        )}

        {currentView === 'revision' && (
          <RevisionModeView
            topicId={selectedTopicId}
            dashboard={dashboard}
            onBack={() => setCurrentView('topic-levels')}
            onRetakeLevel={(lvl) => handleStartLevel(selectedTopicId, lvl)}
            onRetakeTest={(testNum) => handleStartTopicTest(selectedTopicId, testNum)}
          />
        )}

        {currentView === 'final-test' && (
          <FinalAptitudeTestView
            dashboard={dashboard}
            onBack={() => setCurrentView('dashboard')}
            onProceedTechnical={() => setCurrentView('technical-interview')}
            onRefreshDashboard={loadDashboard}
          />
        )}

        {currentView === 'technical-interview' && (
          <TechnicalInterviewView
            dashboard={dashboard}
            onBack={() => setCurrentView('dashboard')}
            onProceedHR={() => setCurrentView('hr-interview')}
            onRefreshDashboard={loadDashboard}
          />
        )}

        {currentView === 'hr-interview' && (
          <HRInterviewView
            dashboard={dashboard}
            onBack={() => setCurrentView('dashboard')}
            onProceedReport={() => setCurrentView('final-report')}
            onRefreshDashboard={loadDashboard}
          />
        )}

        {currentView === 'final-report' && (
          <FinalReportView
            dashboard={dashboard}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'history' && (
          <PerformanceHistoryView
            dashboard={dashboard}
            onBack={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'admin' && (
          <AdminPanelView
            dashboard={dashboard}
            onBack={() => setCurrentView('dashboard')}
            onRefreshDashboard={loadDashboard}
            onSwitchUser={(user) => {
              setCurrentUser(user);
              loadDashboard();
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-4 px-4 sm:px-6 mb-16 lg:mb-0 text-center text-xs text-slate-400 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI-Powered Multimodal Interview Learning & Assessment System</span>
          <span>4-Topic Aptitude • Multimodal Technical Round • Behavioral STAR HR • Gemini Evaluation</span>
        </div>
      </footer>

      {/* Candidate Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          loadDashboard();
        }}
      />

      {/* Candidate Email Outbox & Notification Inspector */}
      <EmailOutboxModal
        isOpen={isOutboxOpen}
        onClose={() => setIsOutboxOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}
