import React from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Play,
  Award,
  Sparkles,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Code2,
  ArrowRight,
} from 'lucide-react';
import { AptitudeTopicId, AptitudeTopicInfo, UserDashboardState } from '../types';

interface TopicLevelMapViewProps {
  topicId: AptitudeTopicId;
  dashboard: UserDashboardState;
  onBack: () => void;
  onStartLevel: (topicId: AptitudeTopicId, levelId: number) => void;
  onStartTest: (topicId: AptitudeTopicId, testNumber: 1 | 2) => void;
  onOpenRevision?: () => void;
  onStartFinalTest?: () => void;
  onStartTechnicalInterview?: () => void;
  onSelectTopic?: (topicId: AptitudeTopicId) => void;
}

const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: 'Fundamental formulas, arithmetic basics, and foundational pattern recognition.',
  2: 'Core principles, direct problem statements, and standard word applications.',
  3: 'Intermediate concepts, speed calculations, and multi-step reasoning.',
  4: 'Applied word problems, algebraic simplifications, and structural puzzles.',
  5: 'Milestone mastery challenges integrating all concepts from Levels 1 through 4.',
  6: 'Advanced analytical modeling, complex data relations, and combined rules.',
  7: 'Higher-order optimization, multi-variable logic, and speed deduction.',
  8: 'Comprehensive problem architectures and edge-case evaluation.',
  9: 'Challenging placement benchmarks and competitive examination formats.',
  10: 'Mastery capstone: intricate multi-domain integration and precision under time.',
};

export const TopicLevelMapView: React.FC<TopicLevelMapViewProps> = ({
  topicId,
  dashboard,
  onBack,
  onStartLevel,
  onStartTest,
  onOpenRevision,
  onStartFinalTest,
  onStartTechnicalInterview,
  onSelectTopic,
}) => {
  const topic: AptitudeTopicInfo = dashboard?.topics?.[topicId];
  const cutoffs = dashboard?.cutoffs ?? {
    levelCutoff: 70,
    testCutoff: 70,
    finalTestCutoff: 70,
    technicalCutoff: 70,
    hrCutoff: 70,
  };

  // Derive level unlock statuses
  // Level 1: always unlocked
  // Levels 2..5: unlocked if previous level completed
  // Test 1: unlocked if Levels 1..5 all completed
  // Levels 6..10: unlocked only if Test 1 passed and previous level completed
  // Test 2: unlocked if Levels 6..10 all completed and Test 1 passed

  // In our dashboard, we know topic.completedLevels and test1Passed/test2Passed
  // We can determine which levels are passed (1 to topic.completedLevels)
  const isLevelPassed = (lvl: number) => {
    if (lvl <= 5) {
      return lvl <= topic.completedLevels;
    }
    // For level > 5, only if test1Passed
    if (!topic.test1Passed) return false;
    return lvl <= topic.completedLevels;
  };

  const isLevelUnlocked = (lvl: number) => {
    if (lvl === 1) return true;
    if (lvl <= 5) {
      return isLevelPassed(lvl - 1);
    }
    // Level 6 to 10 requires Test 1 passed
    if (!topic.test1Passed) return false;
    if (lvl === 6) return true;
    return isLevelPassed(lvl - 1);
  };

  const isTest1Unlocked = [1, 2, 3, 4, 5].every((l) => isLevelPassed(l));
  const isTest2Unlocked = topic.test1Passed && [6, 7, 8, 9, 10].every((l) => isLevelPassed(l));

  return (
    <div className="space-y-6 animate-fadeIn px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            id="btn-back-to-dashboard"
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{topic.name}</h1>
              {topic.isCompleted && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Cleared
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              10 Levels • 2 Checkpoint Tests • 70% Cutoff Required to Unlock Each Subsequent Stage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Topic Completion</div>
            <div className="text-lg font-bold text-cyan-400">{topic.progressPercentage}%</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-sm">
            {topic.completedLevels}/10
          </div>
        </div>
      </div>

      {/* Progressive Rule Reminder Card */}
      <div className="bg-gradient-to-r from-blue-950/30 via-slate-900 to-indigo-950/30 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-300">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-100">Progression Architecture: </strong>
          Levels 1-5 must be cleared sequentially to unlock <strong>Test 1</strong>. Passing Test 1 (≥70%) unlocks Levels 6-10. Clearing Levels 6-10 unlocks <strong>Test 2</strong>. Completing Test 2 awards complete topic mastery!
        </div>
      </div>

      {/* PHASE 1: Levels 1 through 5 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs flex items-center justify-center font-bold">1</span>
            Phase 1: Foundational Mastery (Levels 1 - 5)
          </h2>
          <span className="text-xs text-slate-400">10 Questions per level • 10 Mins</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[1, 2, 3, 4, 5].map((lvl) => {
            const passed = isLevelPassed(lvl);
            const unlocked = isLevelUnlocked(lvl);
            const isCurrent = unlocked && !passed;

            return (
              <div
                key={lvl}
                id={`level-card-${lvl}`}
                className={`relative rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                  passed
                    ? 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/60'
                    : isCurrent
                    ? 'bg-gradient-to-b from-indigo-950/60 to-slate-900 border-indigo-500 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-500/50'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300">Level {lvl}</span>
                    {passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : unlocked ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Active
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                    {LEVEL_DESCRIPTIONS[lvl]}
                  </p>
                </div>

                <button
                  id={`btn-start-level-${lvl}`}
                  onClick={() => unlocked && onStartLevel(topicId, lvl)}
                  disabled={!unlocked}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    passed
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      : isCurrent
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                  }`}
                >
                  {passed ? (
                    <>
                      <RefreshCw className="w-3 h-3" /> Practice Again
                    </>
                  ) : unlocked ? (
                    <>
                      <Play className="w-3 h-3 fill-current" /> Start Level
                    </>
                  ) : (
                    'Locked'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHECKPOINT 1: 5-Level Topic Test 1 */}
      <div
        id="test-1-checkpoint-card"
        className={`rounded-2xl border p-6 transition-all duration-300 ${
          topic.test1Passed
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : isTest1Unlocked
            ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border-amber-500/50 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30'
            : 'bg-slate-900/30 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl border ${
                topic.test1Passed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : isTest1Unlocked
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse'
                  : 'bg-slate-800/60 border-slate-700 text-slate-600'
              }`}
            >
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">Milestone Checkpoint</span>
                {topic.test1Passed && (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Test 1 Passed
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">Topic Test 1 (Levels 1 - 5 Assessment)</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                20 comprehensive questions covering all Phase 1 competencies. Scoring ≥{cutoffs.testCutoff}% unlocks Levels 6 through 10.
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
            <div className="text-xs text-slate-400">
              Cutoff: <strong className="text-slate-200">{cutoffs.testCutoff}%</strong> • 20 Mins
            </div>
            <button
              id="btn-start-test-1"
              onClick={() => isTest1Unlocked && onStartTest(topicId, 1)}
              disabled={!isTest1Unlocked}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                topic.test1Passed
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : isTest1Unlocked
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
              }`}
            >
              {topic.test1Passed ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" /> Retake Test 1
                </>
              ) : isTest1Unlocked ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> Take Test 1
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" /> Clear Levels 1-5 First
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* PHASE 2: Levels 6 through 10 */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs flex items-center justify-center font-bold">2</span>
            Phase 2: Advanced Proficiency (Levels 6 - 10)
          </h2>
          <span className="text-xs text-slate-400">Unlocked after passing Test 1</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[6, 7, 8, 9, 10].map((lvl) => {
            const passed = isLevelPassed(lvl);
            const unlocked = isLevelUnlocked(lvl);
            const isCurrent = unlocked && !passed;

            return (
              <div
                key={lvl}
                id={`level-card-${lvl}`}
                className={`relative rounded-xl border p-4 transition-all duration-200 flex flex-col justify-between ${
                  passed
                    ? 'bg-slate-900/90 border-emerald-500/30 hover:border-emerald-500/60'
                    : isCurrent
                    ? 'bg-gradient-to-b from-cyan-950/60 to-slate-900 border-cyan-500 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300">Level {lvl}</span>
                    {passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : unlocked ? (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Active
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
                    {LEVEL_DESCRIPTIONS[lvl]}
                  </p>
                </div>

                <button
                  id={`btn-start-level-${lvl}`}
                  onClick={() => unlocked && onStartLevel(topicId, lvl)}
                  disabled={!unlocked}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    passed
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      : isCurrent
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
                      : 'bg-slate-800/40 text-slate-500 cursor-not-allowed border border-slate-800/80'
                  }`}
                >
                  {passed ? (
                    <>
                      <RefreshCw className="w-3 h-3" /> Practice Again
                    </>
                  ) : unlocked ? (
                    <>
                      <Play className="w-3 h-3 fill-current" /> Start Level
                    </>
                  ) : !topic.test1Passed ? (
                    <>
                      <Lock className="w-3 h-3" /> Pass Test 1 First
                    </>
                  ) : (
                    'Locked'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHECKPOINT 2: 5-Level Topic Test 2 */}
      <div
        id="test-2-checkpoint-card"
        className={`rounded-2xl border p-6 transition-all duration-300 ${
          topic.test2Passed
            ? 'bg-emerald-950/20 border-emerald-500/30'
            : isTest2Unlocked
            ? 'bg-gradient-to-r from-cyan-950/40 via-slate-900 to-emerald-950/40 border-cyan-500/50 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/30'
            : 'bg-slate-900/30 border-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-xl border ${
                topic.test2Passed
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : isTest2Unlocked
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 animate-pulse'
                  : 'bg-slate-800/60 border-slate-700 text-slate-600'
              }`}
            >
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-400">Final Topic Milestone</span>
                {topic.test2Passed && (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Topic Fully Qualified
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">Topic Test 2 (Levels 6 - 10 Capstone)</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                20 rigorous evaluation questions covering Advanced Levels 6-10. Passing marks this topic as 100% Completed.
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3">
            <div className="text-xs text-slate-400">
              Cutoff: <strong className="text-slate-200">{cutoffs.testCutoff}%</strong> • 20 Mins
            </div>
            <button
              id="btn-start-test-2"
              onClick={() => isTest2Unlocked && onStartTest(topicId, 2)}
              disabled={!isTest2Unlocked}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
                topic.test2Passed
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : isTest2Unlocked
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
              }`}
            >
              {topic.test2Passed ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5" /> Retake Test 2
                </>
              ) : isTest2Unlocked ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> Take Test 2
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" /> Clear Levels 6-10 First
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* TOPIC CLEARED NEXT STEP PROMPT */}
      {topic.test2Passed && (
        <div
          id="topic-cleared-next-step-card"
          className="rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/40 p-6 shadow-xl space-y-4 animate-fadeIn"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{topic.name} Fully Completed</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {dashboard.progression.technical_unlocked
                  ? 'Stage 3 Unlocked: Proceed to AI Technical Interview Round'
                  : dashboard.progression.final_aptitude_unlocked
                  ? 'All 4 Topics Cleared! Proceed to Final Aptitude Assessment'
                  : 'Great Job! Continue to Your Next Aptitude Domain'}
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl">
                {dashboard.progression.technical_unlocked
                  ? 'You have qualified the aptitude phase. Select from 5 trending tech domains (Full Stack, Gen AI/LLM, Cloud/DevOps, Data Science, Cyber Security) to start your 3-level progressive multimodal interview.'
                  : dashboard.progression.final_aptitude_unlocked
                  ? 'All 4 aptitude topics (Quantitative, Logical, Verbal, Specialized) are 100% completed. Take the 25-question Final Aptitude Test to unlock the Technical Round.'
                  : 'Master remaining aptitude topics to unlock the 25-question cross-disciplinary Final Aptitude Assessment and advance to the Technical Round.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {dashboard.progression.technical_unlocked && onStartTechnicalInterview ? (
                <button
                  id="btn-map-go-technical"
                  onClick={onStartTechnicalInterview}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Code2 className="w-4 h-4" /> Start AI Technical Round <ArrowRight className="w-4 h-4" />
                </button>
              ) : dashboard.progression.final_aptitude_unlocked && onStartFinalTest ? (
                <button
                  id="btn-map-go-final-test"
                  onClick={onStartFinalTest}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Award className="w-4 h-4" /> Start Final Aptitude Test <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}

              <button
                id="btn-map-return-dashboard"
                onClick={onBack}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
