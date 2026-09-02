import React from 'react';
import {
  Calculator,
  BrainCircuit,
  BookOpenCheck,
  Cpu,
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
} from 'lucide-react';
import { AptitudeTopicId, AptitudeTopicInfo, UserDashboardState } from '../types';

interface DashboardViewProps {
  dashboard: UserDashboardState;
  onSelectTopic: (topicId: AptitudeTopicId) => void;
  onStartFinalTest: () => void;
  onStartTechnicalInterview: () => void;
  onStartHRInterview: () => void;
  onViewFinalReport: () => void;
  onOpenAdmin: () => void;
  onOpenHistory: () => void;
}

const TOPIC_ICONS: Record<AptitudeTopicId, React.ReactNode> = {
  quantitative: <Calculator className="w-6 h-6 text-blue-400" />,
  logical: <BrainCircuit className="w-6 h-6 text-indigo-400" />,
  verbal: <BookOpenCheck className="w-6 h-6 text-emerald-400" />,
  specialized: <Cpu className="w-6 h-6 text-cyan-400" />,
};

const TOPIC_COLORS: Record<AptitudeTopicId, { bg: string; border: string; bar: string; text: string; badge: string }> = {
  quantitative: {
    bg: 'from-blue-950/40 to-slate-900',
    border: 'border-blue-500/20 hover:border-blue-500/50',
    bar: 'bg-gradient-to-r from-blue-600 to-cyan-500',
    text: 'text-blue-400',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  logical: {
    bg: 'from-indigo-950/40 to-slate-900',
    border: 'border-indigo-500/20 hover:border-indigo-500/50',
    bar: 'bg-gradient-to-r from-indigo-600 to-purple-500',
    text: 'text-indigo-400',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  verbal: {
    bg: 'from-emerald-950/40 to-slate-900',
    border: 'border-emerald-500/20 hover:border-emerald-500/50',
    bar: 'bg-gradient-to-r from-emerald-600 to-teal-400',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  specialized: {
    bg: 'from-cyan-950/40 to-slate-900',
    border: 'border-cyan-500/20 hover:border-cyan-500/50',
    bar: 'bg-gradient-to-r from-cyan-600 to-blue-500',
    text: 'text-cyan-400',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
};

export const DashboardView: React.FC<DashboardViewProps> = ({
  dashboard,
  onSelectTopic,
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

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8">
      {/* Welcome & Stage Banner */}
      <section
        id="dashboard-welcome-banner"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-indigo-500/20 p-6 sm:p-8 shadow-xl"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full Qualification Assessment Pathway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name || 'Candidate'}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Advance through 4 parallel aptitude domains (10 levels + 2 tests each), qualify in the Final Aptitude Assessment, then complete multimodal AI Technical and HR Behavioral interviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-quick-history"
              onClick={onOpenHistory}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all"
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Timeline & Logs</span>
            </button>
            {user && user.email?.toLowerCase() === 'jaammaaj123@gmail.com' && (
              <button
                id="btn-quick-simulation"
                onClick={onOpenAdmin}
                className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 flex items-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Admin & Demo Controls</span>
              </button>
            )}
          </div>
        </div>

        {/* 5-Stage Qualification Pipeline Progress Tracker */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>5-Stage Qualification Milestones</span>
            <span className="text-cyan-400 font-mono">{stats.overall_progress}% Overall Completion</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {/* Step 1: 4 Topics */}
            <div
              className={`p-3 rounded-xl border text-xs transition-all ${
                progression.all_topics_completed
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[11px]">STAGE 1</span>
                {progression.all_topics_completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="text-[10px] text-cyan-400 font-mono">{stats.total_levels_completed}/40</span>
                )}
              </div>
              <div className="font-semibold text-slate-200">4-Topic Mastery</div>
              <div className="text-[11px] text-slate-400 mt-0.5">40 Levels + 8 Tests</div>
            </div>

            {/* Step 2: Final Aptitude */}
            <div
              onClick={() => progression.final_aptitude_unlocked && onStartFinalTest()}
              className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                progression.final_aptitude_passed
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : progression.final_aptitude_unlocked
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-300 hover:scale-[1.02] shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[11px]">STAGE 2</span>
                {progression.final_aptitude_passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : progression.final_aptitude_unlocked ? (
                  <Award className="w-4 h-4 text-amber-400 animate-pulse" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
              <div className="font-semibold text-slate-200">Final Aptitude</div>
              <div className="text-[11px] mt-0.5">25 Mixed Questions ({cutoffs.finalTestCutoff}% Cutoff)</div>
            </div>

            {/* Step 3: AI Technical Interview */}
            <div
              onClick={() => progression.technical_unlocked && onStartTechnicalInterview()}
              className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                progression.technical_passed
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : progression.technical_unlocked
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300 hover:scale-[1.02] shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[11px]">STAGE 3</span>
                {progression.technical_passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : progression.technical_unlocked ? (
                  <Code2 className="w-4 h-4 text-cyan-400 animate-pulse" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
              <div className="font-semibold text-slate-200">AI Technical Round</div>
              <div className="text-[11px] mt-0.5">Multimodal (Voice/Code/Text)</div>
            </div>

            {/* Step 4: AI HR Round */}
            <div
              onClick={() => progression.hr_unlocked && onStartHRInterview()}
              className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                progression.hr_passed
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                  : progression.hr_unlocked
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 hover:scale-[1.02] shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[11px]">STAGE 4</span>
                {progression.hr_passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : progression.hr_unlocked ? (
                  <Users2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                )}
              </div>
              <div className="font-semibold text-slate-200">AI HR Round</div>
              <div className="text-[11px] mt-0.5">Behavioral & STAR Rubric</div>
            </div>

            {/* Step 5: Final Report */}
            <div
              onClick={onViewFinalReport}
              className={`p-3 rounded-xl border text-xs transition-all cursor-pointer col-span-2 sm:col-span-1 ${
                progression.final_report_available
                  ? 'bg-purple-950/40 border-purple-500/40 text-purple-300 hover:scale-[1.02] shadow-lg shadow-purple-500/10'
                  : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-[11px]">STAGE 5</span>
                <Trophy className="w-4 h-4 text-purple-400" />
              </div>
              <div className="font-semibold text-slate-200">Dossier & Report</div>
              <div className="text-[11px] mt-0.5">AI Coach Action Plan</div>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE PROMPT CALLOUT: Ready for Technical Round / Next Stage */}
      {progression.technical_unlocked ? (
        <section
          id="dashboard-technical-ready-banner"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/80 border border-cyan-500/40 p-6 sm:p-7 shadow-2xl shadow-cyan-950/50"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                <Code2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>STAGE 3 UNLOCKED • TECHNICAL ROUND</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {progression.technical_passed ? 'AI Technical Round Cleared' : 'Ready for the AI Technical Round'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                You have qualified the Aptitude Learning & Testing tracks. Advance into the multimodal AI Technical Interview featuring the top 5 trending tech domains with a 3-level progressive question flow (30 Questions Total: Basic → Intermediate → Practical) with live AI voice questioning, webcam streaming, and real-time code evaluation.
              </p>

              {/* 5 Trending Domains Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-bold text-slate-400 mr-1">Trending Tracks:</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-blue-500/15 border border-blue-500/30 text-blue-300">
                  Full Stack Development
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300">
                  Generative AI & LLMs
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  Cloud & DevOps
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  Data Science & ML
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-300">
                  Cyber Security
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 w-full lg:w-auto shrink-0">
              <button
                id="btn-launch-technical-round"
                onClick={onStartTechnicalInterview}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-black shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.03] cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                <span>{progression.technical_passed ? 'Review / Retake Technical Round' : 'Launch AI Technical Round'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="text-[11px] text-slate-400 text-center lg:text-right">
                30 Questions • Level 1, 2 & 3 • Audio & Video Ready
              </div>
            </div>
          </div>
        </section>
      ) : progression.final_aptitude_unlocked ? (
        <section
          id="dashboard-final-aptitude-ready-banner"
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-indigo-950/80 border border-amber-500/40 p-6 sm:p-7 shadow-2xl shadow-amber-950/40"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                <Award className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>STAGE 2 READY • APTITUDE MASTERY ACHIEVED</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Qualify Final Aptitude to Unlock Technical Round
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                All 4 aptitude tracks are cleared! Take the 25-question cross-topic Final Aptitude benchmark (≥70%) to immediately enter the AI Technical Interview Round.
              </p>
            </div>
            <button
              id="btn-start-final-aptitude-prompt"
              onClick={onStartFinalTest}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.03] cursor-pointer shrink-0 w-full sm:w-auto"
            >
              <Award className="w-4 h-4" />
              <span>Start Final Aptitude Test</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      ) : null}

      {/* 4 Parallel Aptitude Topics Grid */}
      <section id="dashboard-topics-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <span>Aptitude Learning & Testing Tracks</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Each topic contains 10 difficulty-ranked levels with mid-way (Test 1) and comprehensive (Test 2) checkpoints.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
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
                className={`relative rounded-2xl bg-gradient-to-br ${style.bg} border ${style.border} p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer group`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 shadow-inner">
                      {TOPIC_ICONS[topic.id]}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {topic.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${style.badge}`}>
                          {topic.isCompleted
                            ? 'Topic Completed ✓'
                            : `Current: Level ${topic.currentLevel} of 10`}
                        </span>
                        {topic.test1Passed && (
                          <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            Test 1 Passed
                          </span>
                        )}
                        {topic.test2Passed && (
                          <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            Test 2 Passed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-5">
                  {topic.description}
                </p>

                {/* Progress Bar & Level Markers */}
                <div className="space-y-2 mb-5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">Progression Completion</span>
                    <span className={style.text}>{topic.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900/80 rounded-full overflow-hidden border border-slate-800/80">
                    <div
                      className={`h-full ${style.bar} transition-all duration-700`}
                      style={{ width: `${topic.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>
                      <strong className="text-slate-200">{topic.completedLevels}</strong>/10 Levels
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-200">
                        {(topic.test1Passed ? 1 : 0) + (topic.test2Passed ? 1 : 0)}
                      </strong>
                      /2 Tests
                    </span>
                  </div>
                  <button
                    id={`btn-continue-topic-${topic.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors group-hover:border-cyan-500/50"
                  >
                    {topic.isCompleted ? 'Review Topic' : 'Open Level Map'}{' '}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
