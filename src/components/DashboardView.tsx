import React from 'react';
import {
  Calculator,
  BrainCircuit,
  MessageSquareQuote,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
  Trophy,
  Award,
  Code2,
  Users2,
  TrendingUp,
  Target,
  FileCheck2,
  Play,
  Flame,
  Check,
} from 'lucide-react';
import { AptitudeTopicId, AptitudeTopicInfo, UserDashboardState } from '../types';
import { AptitudeTopicIcon } from './AptitudeTopicIcons';

interface DashboardViewProps {
  dashboard: UserDashboardState;
  onSelectTopic: (topicId: AptitudeTopicId) => void;
  onStartLevel?: (topicId: AptitudeTopicId, levelId: number) => void;
  onStartTopicTest?: (topicId: AptitudeTopicId, testNumber: 1 | 2) => void;
  onStartFinalTest: () => void;
  onStartTechnicalInterview: () => void;
  onStartHRInterview: () => void;
  onViewFinalReport: () => void;
  onOpenAdmin: () => void;
  onOpenHistory: () => void;
}

const TOPIC_ICONS: Record<AptitudeTopicId, React.ReactNode> = {
  quantitative: <Calculator className="w-6 h-6 text-white" />,
  logical: <BrainCircuit className="w-6 h-6 text-white" />,
  verbal: <MessageSquareQuote className="w-6 h-6 text-white" />,
  specialized: <Code2 className="w-6 h-6 text-white" />,
};

const TOPIC_COLORS: Record<AptitudeTopicId, {
  bg: string;
  border: string;
  bar: string;
  text: string;
  badge: string;
  glow: string;
  cornerGlow: string;
  iconBg: string;
  titleHover: string;
}> = {
  quantitative: {
    bg: 'from-white/95 via-sky-50/80 to-blue-50/70',
    border: 'border-sky-200/90 hover:border-sky-400 shadow-[0_10px_30px_rgba(14,165,233,0.14)] hover:shadow-[0_16px_36px_rgba(14,165,233,0.28)]',
    bar: 'bg-gradient-to-r from-blue-600 to-sky-500',
    text: 'text-blue-700',
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    glow: 'sky',
    cornerGlow: 'from-sky-400/35 to-blue-400/20',
    iconBg: 'bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 shadow-md shadow-blue-500/35',
    titleHover: 'group-hover:text-blue-700',
  },

  logical: {
    bg: 'from-white/95 via-purple-50/80 to-violet-50/70',
    border: 'border-purple-200/90 hover:border-purple-400 shadow-[0_10px_30px_rgba(168,85,247,0.14)] hover:shadow-[0_16px_36px_rgba(168,85,247,0.28)]',
    bar: 'bg-gradient-to-r from-purple-600 to-violet-500',
    text: 'text-purple-700',
    badge: 'bg-purple-50 text-purple-800 border-purple-200',
    glow: 'purple',
    cornerGlow: 'from-purple-400/35 to-violet-400/20',
    iconBg: 'bg-gradient-to-br from-purple-600 via-purple-500 to-violet-400 shadow-md shadow-purple-500/35',
    titleHover: 'group-hover:text-purple-700',
  },

  verbal: {
    bg: 'from-white/95 via-cyan-50/80 to-teal-50/70',
    border: 'border-cyan-200/90 hover:border-cyan-400 shadow-[0_10px_30px_rgba(6,182,212,0.14)] hover:shadow-[0_16px_36px_rgba(6,182,212,0.28)]',
    bar: 'bg-gradient-to-r from-cyan-600 to-teal-500',
    text: 'text-teal-700',
    badge: 'bg-teal-50 text-teal-800 border-teal-200',
    glow: 'teal',
    cornerGlow: 'from-cyan-400/35 to-teal-400/20',
    iconBg: 'bg-gradient-to-br from-cyan-600 via-teal-500 to-teal-400 shadow-md shadow-teal-500/35',
    titleHover: 'group-hover:text-teal-700',
  },

  specialized: {
    bg: 'from-white/95 via-pink-50/80 to-rose-50/70',
    border: 'border-pink-200/90 hover:border-pink-400 shadow-[0_10px_30px_rgba(236,72,153,0.14)] hover:shadow-[0_16px_36px_rgba(236,72,153,0.28)]',
    bar: 'bg-gradient-to-r from-pink-500 to-violet-600',
    text: 'text-pink-700',
    badge: 'bg-pink-50 text-pink-800 border-pink-200',
    glow: 'pink',
    cornerGlow: 'from-pink-400/35 to-violet-400/20',
    iconBg: 'bg-gradient-to-br from-pink-500 via-rose-500 to-violet-600 shadow-md shadow-pink-500/35',
    titleHover: 'group-hover:text-pink-700',
  },
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  dashboard,
  onSelectTopic,
  onStartLevel,
  onStartTopicTest,
  onStartFinalTest,
  onStartTechnicalInterview,
  onStartHRInterview,
  onViewFinalReport,
  onOpenAdmin,
  onOpenHistory,
}) => {
  const {
    user,
    topics = {} as Record<AptitudeTopicId, AptitudeTopicInfo>,
    progression = {} as any,
    stats = {} as any,
    cutoffs = {
      levelCutoff: 70,
      testCutoff: 70,
      finalTestCutoff: 70,
      technicalCutoff: 70,
      hrCutoff: 70,
    },
  } = dashboard || {};
  const topicList: AptitudeTopicInfo[] = Object.values(topics);

  // Compute exact next action for the user based on saved progression
  const getNextAction = () => {
    const topicOrder: AptitudeTopicId[] = ['quantitative', 'logical', 'verbal', 'specialized'];

    // 1. Check Aptitude Topics (Stage 1)
    for (const tid of topicOrder) {
      const t = topics[tid];
      if (!t) continue;

      if (t.completedLevels < 10) {
        // If 5 levels completed and Test 1 is pending
        if (t.completedLevels >= 5 && !t.test1Passed) {
          return {
            stage: 'STAGE 1 • TOPIC TEST CHECKPOINT',
            stageNumber: 1,
            title: `${t.name}: 5-Level Test 1`,
            description: `You cleared Levels 1–5 in ${t.name}. Complete the 20-question checkpoint test (${cutoffs.testCutoff}% cutoff) to unlock Levels 6–10.`,
            badge: 'Test 1 Ready',
            badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
            buttonLabel: 'Continue Preparation: Take Test 1',
            icon: <Award className="w-5 h-5 text-amber-400" />,
            action: () => {
              if (onStartTopicTest) {
                onStartTopicTest(tid, 1);
              } else {
                onSelectTopic(tid);
              }
            },
          };
        }

        // Next Level to complete
        return {
          stage: 'STAGE 1 • APTITUDE MASTERY',
          stageNumber: 1,
          title: `${t.name}: Level ${t.currentLevel}`,
          description: `Resume practice in ${t.name} at Level ${t.currentLevel} of 10. Pass 10 questions with ≥${cutoffs.levelCutoff}% accuracy to unlock Level ${Math.min(10, t.currentLevel + 1)}.`,
          badge: `Level ${t.currentLevel} of 10`,
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          buttonLabel: `Continue Preparation: Start Level ${t.currentLevel}`,
          icon: <Play className="w-5 h-5 text-blue-400 fill-blue-400/30" />,
          action: () => {
            if (onStartLevel) {
              onStartLevel(tid, t.currentLevel);
            } else {
              onSelectTopic(tid);
            }
          },
        };
      }

      // If 10 levels completed and Test 2 is pending
      if (!t.test2Passed) {
        return {
          stage: 'STAGE 1 • COMPREHENSIVE TEST CHECKPOINT',
          stageNumber: 1,
          title: `${t.name}: Comprehensive Test 2`,
          description: `All 10 levels in ${t.name} completed! Clear the 20-question Test 2 checkpoint (${cutoffs.testCutoff}% cutoff) to complete this domain.`,
          badge: 'Test 2 Ready',
          badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          buttonLabel: 'Continue Preparation: Take Test 2',
          icon: <Award className="w-5 h-5 text-indigo-400" />,
          action: () => {
            if (onStartTopicTest) {
              onStartTopicTest(tid, 2);
            } else {
              onSelectTopic(tid);
            }
          },
        };
      }
    }

    // 2. Stage 2: Final Aptitude
    if (progression.final_aptitude_unlocked && !progression.final_aptitude_passed) {
      return {
        stage: 'STAGE 2 • FINAL APTITUDE QUALIFICATION',
        stageNumber: 2,
        title: 'Final Aptitude Assessment (25 Questions)',
        description: `All 4 aptitude tracks completed! Take the comprehensive 25-question cross-domain assessment (≥${cutoffs.finalTestCutoff}%) to qualify for the AI Technical Round.`,
        badge: 'Stage 2 Ready',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        buttonLabel: 'Continue Preparation: Start Final Assessment',
        icon: <Award className="w-5 h-5 text-amber-400" />,
        action: onStartFinalTest,
      };
    }

    // 3. Stage 3: Technical Round
    if (progression.technical_unlocked && !progression.technical_passed) {
      return {
        stage: 'STAGE 3 • AI MULTIMODAL TECHNICAL INTERVIEW',
        stageNumber: 3,
        title: 'AI Technical Interview Simulation',
        description: `Aptitude track cleared! Begin the progressive 3-level AI Technical Round (Basic → Intermediate → Practical) across your selected domain.`,
        badge: 'Stage 3 Ready',
        badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
        buttonLabel: 'Continue Preparation: Enter Technical Round',
        icon: <Code2 className="w-5 h-5 text-cyan-400" />,
        action: onStartTechnicalInterview,
      };
    }

    // 4. Stage 4: HR Round
    if (progression.hr_unlocked && !progression.hr_passed) {
      return {
        stage: 'STAGE 4 • AI HR BEHAVIORAL INTERVIEW',
        stageNumber: 4,
        title: 'AI HR Behavioral Round (STAR Method)',
        description: `Technical interview qualified! Complete the 5-question situational & behavioral evaluation with real-time AI scoring.`,
        badge: 'Stage 4 Ready',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        buttonLabel: 'Continue Preparation: Enter HR Round',
        icon: <Users2 className="w-5 h-5 text-emerald-400" />,
        action: onStartHRInterview,
      };
    }

    // 5. Stage 5: Final Placement Report
    return {
      stage: 'STAGE 5 • PLACEMENT READINESS REPORT',
      stageNumber: 5,
      title: 'Full Placement Diagnostic Report',
      description: `All preparation rounds completed! Review your comprehensive readiness score, strengths/weaknesses breakdown, and AI coach action plan.`,
      badge: 'All Stages Complete',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      buttonLabel: 'View Diagnostic Placement Report',
      icon: <Trophy className="w-5 h-5 text-purple-400" />,
      action: onViewFinalReport,
    };
  };

  const nextAction = getNextAction();

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8">
      {/* Welcome & Stage Banner */}
      <section
        id="dashboard-welcome-banner"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-indigo-50/40 to-sky-50/30 border border-slate-200 p-6 sm:p-8 shadow-lg"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Qualification Assessment Pathway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.name || 'Candidate'}
            </h1>
           
          </div>

         
        </div>

        {/* 5-Stage Qualification Pipeline Progress Tracker */}
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>5-Stage Qualification Milestones</span>
            <span className="text-indigo-600 font-mono font-bold">{stats.overall_progress}% Overall Completion</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {/* Step 1: 4 Topics */}
            <div
              className={`p-3 rounded-xl border text-xs transition-all ${
                progression.all_topics_completed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-white border-slate-200 text-slate-700 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[11px] text-slate-600">STAGE 1</span>
                {progression.all_topics_completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="text-[10px] text-indigo-600 font-mono font-bold">{stats.total_levels_completed}/40</span>
                )}
              </div>
              <div className="font-bold text-slate-900">4-Topic Mastery</div>
              <div className="text-[11px] text-slate-500 mt-0.5">40 Levels + 8 Tests</div>
            </div>

            {/* Step 2: Final Aptitude */}
            <div
              onClick={() => progression.final_aptitude_unlocked && onStartFinalTest()}
              className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                progression.final_aptitude_passed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : progression.final_aptitude_unlocked
                  ? 'bg-amber-50 border-amber-300 text-amber-900 hover:scale-[1.02] shadow-sm'
                  : 'bg-slate-100/80 border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[11px] text-slate-600">STAGE 2</span>
                {progression.final_aptitude_passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : progression.final_aptitude_unlocked ? (
                  <Award className="w-4 h-4 text-amber-600 animate-pulse" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
              <div className="font-bold text-slate-900">Final Aptitude</div>
              <div className="text-[11px] text-slate-500 mt-0.5">25 Mixed Questions ({cutoffs.finalTestCutoff}% Cutoff)</div>
            </div>

            {/* Step 3: AI Technical Interview */}
            <div
              onClick={() => progression.technical_unlocked && onStartTechnicalInterview()}
              className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                progression.technical_passed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : progression.technical_unlocked
                  ? 'bg-cyan-50 border-cyan-300 text-cyan-900 hover:scale-[1.02] shadow-sm'
                  : 'bg-slate-100/80 border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[11px] text-slate-600">STAGE 3</span>
                {progression.technical_passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : progression.technical_unlocked ? (
                  <Code2 className="w-4 h-4 text-cyan-600 animate-pulse" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
              <div className="font-bold text-slate-900">AI Technical Round</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Multimodal (Voice/Code/Text)</div>
            </div>

            {/* Step 4: AI HR Round */}
            <div
              onClick={() => progression.hr_unlocked && onStartHRInterview()}
              className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                progression.hr_passed
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : progression.hr_unlocked
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:scale-[1.02] shadow-sm'
                  : 'bg-slate-100/80 border-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[11px] text-slate-600">STAGE 4</span>
                {progression.hr_passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : progression.hr_unlocked ? (
                  <Users2 className="w-4 h-4 text-emerald-600 animate-pulse" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>
              <div className="font-bold text-slate-900">AI HR Round</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Behavioral & STAR Rubric</div>
            </div>

            {/* Step 5: Final Report */}
            <div
              onClick={onViewFinalReport}
              className={`p-3 rounded-xl border text-xs transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                progression.final_report_available
                  ? 'bg-purple-50 border-purple-300 text-purple-900 hover:scale-[1.02] shadow-sm'
                  : 'bg-slate-100/80 border-slate-200 text-slate-500 hover:bg-slate-200/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[11px] text-slate-600">STAGE 5</span>
                <Trophy className="w-4 h-4 text-purple-600" />
              </div>
              <div className="font-bold text-slate-900">Final Report</div>
              <div className="text-[11px] text-slate-500 mt-0.5">AI Coach Action Plan</div>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE PROMPT CALLOUT: Ready for Technical Round / Next Stage */}
      {progression.technical_unlocked && !progression.technical_passed && (
        <section
          id="dashboard-technical-ready-banner"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-50 via-white to-blue-50 border border-cyan-200 p-6 sm:p-7 shadow-lg"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-bold">
                <Code2 className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
                <span>STAGE 3 UNLOCKED • TECHNICAL ROUND</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Ready for the AI Technical Round
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You have qualified the Aptitude Learning & Testing tracks. Advance into the multimodal AI Technical Interview featuring the top 5 trending tech domains with a 3-level progressive question flow (30 Questions Total: Basic → Intermediate → Practical) with live AI voice questioning, webcam streaming, and real-time code evaluation.
              </p>

              {/* 5 Trending Domains Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-500 mr-1">Trending Tracks:</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700">
                  Full Stack Development
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700">
                  Generative AI & LLMs
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-cyan-50 border border-cyan-200 text-cyan-700">
                  Cloud & DevOps
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700">
                  Data Science & ML
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700">
                  Cyber Security
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 w-full lg:w-auto shrink-0">
              <button
                id="btn-launch-technical-round"
                onClick={onStartTechnicalInterview}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                <span>Launch AI Technical Round</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-[11px] text-slate-500 text-center lg:text-right">
                30 Questions • Level 1, 2 & 3 • Audio & Video Ready
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4 Parallel Aptitude Topics Grid */}
      <section id="dashboard-topics-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              <span>Aptitude Learning & Testing Tracks</span>
            </h2>
           
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" /> Pass Cutoff: {cutoffs.levelCutoff}%
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {topicList.map((topic) => {
            const style = TOPIC_COLORS[topic.id];
            return (
              <div
                key={topic.id}
                id={`topic-card-${topic.id}`}
                onClick={() => onSelectTopic(topic.id)}
                className={`relative rounded-3xl bg-gradient-to-br ${style.bg} border ${style.border} p-6 sm:p-7 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer group overflow-hidden backdrop-blur-2xl`}
              >
                {/* Decorative subtle corner gradient highlight */}
                <div className={`absolute -top-16 -right-16 w-36 h-36 rounded-full bg-gradient-to-br ${style.cornerGlow} opacity-60 blur-3xl pointer-events-none transition-opacity group-hover:opacity-100`} />

                <div className="relative z-10 flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white p-1.5 border border-slate-200/80 shadow-md group-hover:scale-105 transition-transform duration-300 shrink-0 flex items-center justify-center overflow-hidden">
                      <AptitudeTopicIcon topicId={topic.id} className="w-full h-full object-contain rounded-xl" />
                    </div>
                    <div>
                      <h3 className={`text-base sm:text-lg font-bold text-slate-900 ${style.titleHover} transition-colors`}>
                        {topic.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                          {topic.isCompleted
                            ? 'Topic Completed ✓'
                            : `Current: Level ${topic.currentLevel} of 10`}
                        </span>
                        {topic.test1Passed && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                            Test 1 Passed
                          </span>
                        )}
                        {topic.test2Passed && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                            Test 2 Passed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chevron indicator */}
                  <div className="w-9 h-9 rounded-2xl bg-white/90 border border-slate-200/80 flex items-center justify-center text-slate-500 group-hover:text-slate-900 group-hover:border-slate-300 group-hover:bg-white transition-all shadow-sm shrink-0">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                <p className="relative z-10 text-xs sm:text-sm text-slate-600 line-clamp-1 mb-5 font-normal">
                  {topic.description}
                </p>

                {/* Progress Bar & Level Markers */}
                <div className="relative z-10 space-y-2 mb-5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Progression Completion</span>
                    <span className={style.text}>{topic.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200/70 rounded-full overflow-hidden border border-slate-300/50">
                    <div
                      className={`h-full ${style.bar} transition-all duration-700`}
                      style={{ width: `${topic.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="relative z-10 pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-3 font-medium">
                    <span>
                      <strong className="text-slate-900 font-bold">{topic.completedLevels}</strong>/10 Levels
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-900 font-bold">
                        {(topic.test1Passed ? 1 : 0) + (topic.test2Passed ? 1 : 0)}
                      </strong>
                      /2 Tests
                    </span>
                  </div>
                  <span className={`font-bold text-xs ${style.text} flex items-center gap-1 group-hover:underline`}>
                    {topic.isCompleted ? 'Review Topic' : 'Open Level Map'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

