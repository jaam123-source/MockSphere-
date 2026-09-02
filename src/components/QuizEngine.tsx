import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Clock,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Send,
  Sparkles,
  Trophy,
  Award,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import {
  AptitudeQuestion,
  AptitudeTopicId,
  LevelAttemptResult,
  TopicTestResult,
  ReviewQuestionItem,
  UserDashboardState,
} from '../types';
import { ApiService } from '../services/api';
import { SpeechService } from '../utils/speech';

interface QuizEngineProps {
  topicId: AptitudeTopicId;
  mode: 'level' | 'test';
  levelId?: number;
  testNumber?: 1 | 2;
  dashboard: UserDashboardState;
  onBack: () => void;
  onRefreshDashboard: () => void;
  onProceedNextLevel?: (nextLvl: number) => void;
  onProceedTest?: (testNum: 1 | 2) => void;
  onOpenRevision?: () => void;
  onStartFinalTest?: () => void;
  onStartTechnicalInterview?: () => void;
}

const TOPIC_TITLES: Record<AptitudeTopicId, string> = {
  quantitative: 'Quantitative Aptitude',
  logical: 'Logical Reasoning',
  verbal: 'Verbal Ability',
  specialized: 'Specialized & Technical Aptitude',
};

export const QuizEngine: React.FC<QuizEngineProps> = ({
  topicId,
  mode,
  levelId = 1,
  testNumber = 1,
  dashboard,
  onBack,
  onRefreshDashboard,
  onProceedNextLevel,
  onProceedTest,
  onOpenRevision,
  onStartFinalTest,
  onStartTechnicalInterview,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(mode === 'level' ? 10 : 20);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(10 * 60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<LevelAttemptResult | TopicTestResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showReviewList, setShowReviewList] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct'>('all');

  const topicName = TOPIC_TITLES[topicId] || 'Aptitude Assessment';
  const cutoff =
    mode === 'level'
      ? dashboard?.cutoffs?.levelCutoff ?? 70
      : dashboard?.cutoffs?.testCutoff ?? 70;
  const title =
    mode === 'level'
      ? `${topicName} • Level ${levelId}`
      : `${topicName} • Checkpoint Test ${testNumber}`;
  const subtitle =
    mode === 'level'
      ? `Sequential Level Assessment (10 Questions) • ${cutoff}% Required to Unlock Next Stage`
      : `Comprehensive Assessment (${testNumber === 1 ? 'Levels 1–5' : 'Levels 6–10'}, 20 Questions) • ${cutoff}% Cutoff Required`;

  // Fetch questions from API on mount / param change or retry
  const loadQuestions = useCallback(async (isRetry: boolean = false) => {
    setLoading(true);
    setFetchError(null);
    setResult(null);
    setAnswers({});
    setCurrentIndex(0);
    setShowReviewList(false);

    try {
      if (mode === 'level') {
        const res = await ApiService.getLevelQuestions(topicId, levelId, isRetry);
        setQuestions(res.questions || []);
        const mins = res.time_limit_minutes || 10;
        setTimeLimitMinutes(mins);
        setTimeLeft(mins * 60);
      } else {
        const tNum: 1 | 2 = testNumber === 2 ? 2 : 1;
        const res = await ApiService.getTopicTestQuestions(topicId, tNum);
        setQuestions(res.questions || []);
        const mins = res.time_limit_minutes || 20;
        setTimeLimitMinutes(mins);
        setTimeLeft(mins * 60);
      }
    } catch (err: any) {
      setFetchError(err.message || 'Failed to load assessment questions.');
    } finally {
      setLoading(false);
    }
  }, [topicId, mode, levelId, testNumber]);

  useEffect(() => {
    loadQuestions(false);

    return () => {
      SpeechService.stopSpeaking();
    };
  }, [loadQuestions]);

  useEffect(() => {
    if (result) {
      setShowReviewList(true);
    }
  }, [result]);

  const currentQ = questions?.[currentIndex] || questions?.[0];

  // Auto-countdown timer
  useEffect(() => {
    if (result || loading || fetchError) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [result, loading, fetchError, answers, questions]);

  const handleAutoSubmit = useCallback(() => {
    if (!result && !isSubmitting && questions.length > 0) {
      handleFinalSubmit();
    }
  }, [answers, questions, result, isSubmitting]);

  const handleSelectOption = (optionKey: string) => {
    if (!currentQ || result) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.question_id]: optionKey,
    }));
  };

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      SpeechService.stopSpeaking();
      setIsSpeaking(false);
    } else if (currentQ) {
      const textToSpeak = `${currentQ.question}. Option A: ${currentQ.option_a}. Option B: ${currentQ.option_b}. Option C: ${currentQ.option_c}. Option D: ${currentQ.option_d}.`;
      setIsSpeaking(true);
      SpeechService.speak(
        textToSpeak,
        () => setIsSpeaking(false),
        () => setIsSpeaking(true)
      );
    }
  };

  const handleFinalSubmit = async () => {
    if (questions.length === 0) return;
    setIsSubmitting(true);
    SpeechService.stopSpeaking();
    setIsSpeaking(false);

    try {
      const payload = questions.map((q) => ({
        question_id: q.question_id,
        selected_answer: answers[q.question_id] || '',
      }));

      let res: LevelAttemptResult | TopicTestResult;
      if (mode === 'level') {
        res = await ApiService.submitLevel(topicId, levelId, payload);
      } else {
        const tNum: 1 | 2 = testNumber === 2 ? 2 : 1;
        res = await ApiService.submitTopicTest(topicId, tNum, payload);
      }

      setResult(res);
      setShowReviewList(true);
      onRefreshDashboard();

      if (res.status === 'PASSED') {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
        });
      }

      // Scroll to result card / review section smoothly
      setTimeout(() => {
        document.getElementById('quiz-result-summary-card')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;

  // ---------------- LOADING STATE ----------------
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-12 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-base font-bold text-white tracking-wide">
            Assembling {mode === 'level' ? `Level ${levelId}` : `Test ${testNumber}`} Questions...
          </p>
          <p className="text-xs text-slate-400">Loading topic questions with full answer keys and explanations.</p>
        </div>
      </div>
    );
  }

  // ---------------- ERROR STATE ----------------
  if (fetchError || questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        <div className="bg-slate-900/90 border border-rose-500/40 rounded-2xl p-8 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Assessment Stage Restricted</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto mt-1">
              {fetchError || 'Unable to retrieve questions for this stage.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="btn-retry-load-questions"
              onClick={() => loadQuestions(true)}
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retry {mode === 'level' ? `Level ${levelId}` : `Test ${testNumber}`}
            </button>
            {onProceedNextLevel && (
              <button
                id="btn-start-unlocked-level1"
                onClick={() => onProceedNextLevel(1)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Start Unlocked Level 1
              </button>
            )}
            {onOpenRevision && (
              <button
                id="btn-error-open-revision"
                onClick={onOpenRevision}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" /> Diagnostic Revision Mode
              </button>
            )}
            <button
              id="btn-return-to-topic-map"
              onClick={onBack}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              Return to Topic Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- RESULT VIEW ----------------
  if (result) {
    const isPassed = result.status === 'PASSED';
    const isLevelAttempt = 'next_level_unlocked' in result;

    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8 space-y-6 animate-fadeIn">
        {/* Result Header Card */}
        <div
          id="quiz-result-summary-card"
          className={`rounded-2xl border p-5 sm:p-8 shadow-2xl text-center relative overflow-hidden ${
            isPassed
              ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40'
              : 'bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/40'
          }`}
        >
          <div className="relative z-10 space-y-4">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl flex items-center justify-center border shadow-lg ${
                isPassed
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              }`}
            >
              {isPassed ? <Trophy className="w-8 h-8 sm:w-10 sm:h-10" /> : <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border">
                {isPassed ? (
                  <span className="text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    Assessment Passed (≥{result.cutoff}% Cutoff Cleared)
                  </span>
                ) : (
                  <span className="text-rose-400 border-rose-500/20 bg-rose-500/10 px-2 py-0.5 rounded-full">
                    Cutoff Not Met (&lt;{result.cutoff}%)
                  </span>
                )}
              </div>

              <h2 className="text-3xl font-extrabold text-white">
                {isPassed ? `Level ${levelId} Cleared!` : 'Cutoff Not Reached'}
              </h2>
              <p className="text-sm text-slate-300 max-w-lg mx-auto mt-1">
                {isPassed
                  ? mode === 'level' && levelId === 5
                    ? `Level 5 Complete! You scored ${result.percentage}%. Checkpoint Test 1 is now unlocked. Clear Test 1 (≥70%) to unlock Level 6.`
                    : mode === 'level' && levelId < 10
                    ? `Great job! You scored ${result.percentage}% (Cutoff: ${result.cutoff}%). Level ${levelId + 1} is now unlocked.`
                    : 'You met the required proficiency standard and unlocked the next progression tier.'
                  : `You scored ${result.percentage}%. A minimum cutoff of ${result.cutoff}% is required to unlock Level ${levelId + 1}. Please review explanations below.`}
              </p>
            </div>

            {/* Prominent High-Visibility Progression Banner when passed */}
            {isPassed && mode === 'level' && levelId < 10 && levelId !== 5 && onProceedNextLevel && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/40 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left max-w-2xl mx-auto shadow-lg shadow-emerald-500/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      Level {levelId + 1} Unlocked!
                    </div>
                    <p className="text-xs text-slate-300">
                      You passed Level {levelId} with {result.percentage}% accuracy (Cutoff: {result.cutoff}%). Advance to Level {levelId + 1} now.
                    </p>
                  </div>
                </div>
                <button
                  id="btn-banner-proceed-next-level"
                  onClick={() => onProceedNextLevel(levelId + 1)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 shrink-0 transition-transform hover:scale-105 cursor-pointer"
                >
                  <span>Proceed to Level {levelId + 1}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Score Metrics Box */}
            <div className="grid grid-cols-3 gap-4 max-w-md mx-auto pt-4">
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Score</div>
                <div className="text-xl font-bold text-white">
                  {result.score} <span className="text-xs text-slate-400">/ {result.total_questions}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Percentage</div>
                <div
                  className={`text-xl font-bold ${
                    isPassed ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {result.percentage}%
                </div>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-400 font-medium">Passing Cutoff</div>
                <div className="text-xl font-bold text-cyan-400">{result.cutoff}%</div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
              {isPassed && mode === 'level' && levelId < 10 && levelId !== 5 && onProceedNextLevel ? (
                <button
                  id="btn-proceed-next-level"
                  onClick={() => onProceedNextLevel(levelId + 1)}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  Proceed to Level {levelId + 1} <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}

              {isPassed && mode === 'level' && levelId === 5 && onProceedTest ? (
                <button
                  id="btn-proceed-test-1"
                  onClick={() => onProceedTest(1)}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Award className="w-4 h-4 text-slate-950" /> Start Checkpoint Test 1 (Unlocks Level 6) <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}

              {isPassed && mode === 'level' && levelId === 10 && onProceedTest ? (
                <button
                  id="btn-proceed-test-2"
                  onClick={() => onProceedTest(2)}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  Start Checkpoint Test 2 <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}

              {/* Next Stage Unlocked: Technical Round or Final Test */}
              {isPassed && mode === 'test' && testNumber === 2 && dashboard.progression.technical_unlocked && onStartTechnicalInterview ? (
                <button
                  id="btn-quiz-proceed-technical"
                  onClick={onStartTechnicalInterview}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm rounded-xl shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Award className="w-4 h-4" /> Enter AI Technical Round (5 Domains) <ArrowRight className="w-4 h-4" />
                </button>
              ) : isPassed && mode === 'test' && testNumber === 2 && dashboard.progression.final_aptitude_unlocked && onStartFinalTest ? (
                <button
                  id="btn-quiz-proceed-final-test"
                  onClick={onStartFinalTest}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Award className="w-4 h-4" /> Take 25-Q Final Aptitude Test <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}

              {/* Retry button with non-repetitive fresh pool */}
              <button
                id="btn-retry-assessment"
                onClick={() => loadQuestions(true)}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-transform hover:scale-105"
              >
                <RotateCcw className="w-4 h-4" /> {isPassed ? 'Practice Again (New Questions)' : 'Retry Level (Fresh Questions)'}
              </button>

              {!isPassed && onOpenRevision ? (
                <button
                  id="btn-enter-revision-mode"
                  onClick={onOpenRevision}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <BookOpen className="w-4 h-4" /> Enter Revision Mode
                </button>
              ) : null}

              <button
                id="btn-return-map"
                onClick={onBack}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl border border-slate-700 transition-colors"
              >
                Return to Level Map
              </button>

              <button
                id="btn-toggle-review-answers"
                onClick={() => {
                  const nextState = !showReviewList;
                  setShowReviewList(nextState);
                  if (nextState) {
                    setTimeout(() => {
                      document.getElementById('quiz-review-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className={`px-5 py-3 font-semibold text-sm rounded-xl border transition-all flex items-center gap-2 ${
                  showReviewList
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                    : 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30'
                }`}
              >
                <BookOpen className="w-4 h-4" /> {showReviewList ? 'Hide Explanations' : 'Review Explanations'}
              </button>
            </div>
          </div>
        </div>

        {/* Concept Mastery & Adaptive Feedback */}
        {result.category_breakdown && Object.keys(result.category_breakdown).length > 0 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Concept-Wise Breakdown & Adaptive Insights
              </h3>
              {(result as LevelAttemptResult).attempt_number && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                  Attempt #{(result as LevelAttemptResult).attempt_number}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(result.category_breakdown).map(([cat, rawStats]) => {
                const stats = rawStats as { correct: number; total: number; percentage: number };
                const isCatPassed = (stats?.percentage ?? 0) >= 70;
                return (
                  <div
                    key={cat}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-2 ${
                      isCatPassed
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{cat}</span>
                      <span className="font-bold">{stats?.percentage ?? 0}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isCatPassed ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${stats?.percentage ?? 0}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {stats?.correct ?? 0} of {stats?.total ?? 0} correct
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Targeted Improvement Tips for Weak Concepts */}
            {(result as LevelAttemptResult).concept_improvement_tips &&
              Object.keys((result as LevelAttemptResult).concept_improvement_tips || {}).length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> High-Priority Concept Focus for Your Next Attempt:
                  </div>
                  <div className="space-y-2">
                    {Object.entries((result as LevelAttemptResult).concept_improvement_tips || {}).map(
                      ([concept, tip]) => (
                        <div key={concept} className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs">
                          <span className="font-bold text-amber-300">{concept}: </span>
                          <span className="text-slate-300">{tip}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Step-by-Step Question Review Drilldown */}
        {showReviewList && (() => {
          // Derive safe review items
          const reviewItems: ReviewQuestionItem[] = (result?.answers_review && result.answers_review.length > 0)
            ? result.answers_review
            : questions.map((q, idx) => {
                const userAns = answers[q.question_id] || 'None';
                const wrong = (result as LevelAttemptResult)?.wrong_answers?.find((w) => w.question === q.question);
                const isCorrect = !wrong && userAns !== 'None';
                return {
                  question_id: q.question_id,
                  question: q.question,
                  your_answer: userAns,
                  correct_answer: wrong?.correct_answer || (q as any).correct_answer || 'A',
                  explanation: wrong?.explanation || (q as any).explanation || 'Review conceptual rules and computational steps.',
                  category: q.category || 'General',
                  difficulty: q.difficulty,
                  is_correct: isCorrect,
                  option_a: q.option_a,
                  option_b: q.option_b,
                  option_c: q.option_c,
                  option_d: q.option_d,
                };
              });

          const totalCount = reviewItems.length;
          const correctCount = reviewItems.filter((item) => item.is_correct).length;
          const wrongCount = totalCount - correctCount;

          const filteredItems = reviewItems.filter((item) => {
            if (reviewFilter === 'wrong') return !item.is_correct;
            if (reviewFilter === 'correct') return item.is_correct;
            return true;
          });

          return (
            <div id="quiz-review-section" className="space-y-6 pt-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-400" /> Complete Question Solutions & Step-by-Step Explanations
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Study the correct logic, formulas, and reasoning behind every question to solidify concepts.
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setReviewFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      reviewFilter === 'all'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All ({totalCount})
                  </button>
                  <button
                    onClick={() => setReviewFilter('wrong')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                      reviewFilter === 'wrong'
                        ? 'bg-rose-600 text-white shadow'
                        : 'text-rose-400 hover:text-rose-300'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" /> Missed ({wrongCount})
                  </button>
                  <button
                    onClick={() => setReviewFilter('correct')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                      reviewFilter === 'correct'
                        ? 'bg-emerald-600 text-white shadow'
                        : 'text-emerald-400 hover:text-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct ({correctCount})
                  </button>
                </div>
              </div>

              {filteredItems.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-sm">
                  No questions match the selected filter.
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const originalIndex = reviewItems.findIndex((q) => q.question_id === item.question_id) + 1;
                  const userChoice = (item.your_answer || 'None').toUpperCase();
                  const correctChoice = (item.correct_answer || 'A').toUpperCase();

                  const renderOption = (letter: string, text?: string) => {
                    if (!text) return null;
                    const isCorrectOption = letter === correctChoice;
                    const isUserOption = letter === userChoice;

                    let style = 'border-slate-800 bg-slate-900/60 text-slate-300';
                    let badge = null;

                    if (isCorrectOption) {
                      style = 'border-emerald-500/80 bg-emerald-500/10 text-emerald-200 font-semibold ring-1 ring-emerald-500/40';
                      badge = (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 ml-auto">
                          <CheckCircle2 className="w-3 h-3" /> Correct Answer
                        </span>
                      );
                    } else if (isUserOption && !item.is_correct) {
                      style = 'border-rose-500/80 bg-rose-500/10 text-rose-200 font-medium ring-1 ring-rose-500/40';
                      badge = (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 ml-auto">
                          <XCircle className="w-3 h-3" /> Your Choice
                        </span>
                      );
                    }

                    return (
                      <div className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${style}`}>
                        <div className="flex items-start gap-2.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                            isCorrectOption
                              ? 'bg-emerald-500 text-slate-950'
                              : isUserOption && !item.is_correct
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {letter}
                          </span>
                          <span className="leading-snug">{text}</span>
                        </div>
                        {badge}
                      </div>
                    );
                  };

                  return (
                    <div
                      key={item.question_id || idx}
                      className={`p-6 rounded-2xl border shadow-lg space-y-4 transition-all ${
                        item.is_correct
                          ? 'bg-slate-900/90 border-emerald-500/30 ring-1 ring-emerald-500/10'
                          : 'bg-slate-900/90 border-rose-500/30 ring-1 ring-rose-500/10'
                      }`}
                    >
                      {/* Question Header */}
                      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            Question {originalIndex || idx + 1}
                          </span>
                          <span className="text-xs font-medium text-slate-400">
                            Category: <span className="text-slate-300 font-semibold">{item.category}</span>
                          </span>
                          {item.difficulty && (
                            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-cyan-400 font-mono">
                              {item.difficulty}
                            </span>
                          )}
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border shadow-sm ${
                            item.is_correct
                              ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {item.is_correct ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {item.is_correct ? 'Correct (+1 Mark)' : `Incorrect • Chose (${userChoice})`}
                        </span>
                      </div>

                      {/* Question Statement */}
                      <div className="text-sm font-semibold text-white leading-relaxed">
                        {item.question}
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {renderOption('A', item.option_a)}
                        {renderOption('B', item.option_b)}
                        {renderOption('C', item.option_c)}
                        {renderOption('D', item.option_d)}
                      </div>

                      {/* Step-by-Step Explanation Box */}
                      <div className="bg-slate-950/80 rounded-xl p-4 border border-cyan-500/20 text-xs text-slate-300 space-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                        <div className="font-bold text-cyan-400 flex items-center gap-1.5 tracking-wide text-xs">
                          <Sparkles className="w-4 h-4 text-cyan-400" /> Step-by-Step Solution & Concept Explanation:
                        </div>
                        <p className="leading-relaxed text-slate-200 text-xs font-normal whitespace-pre-line">
                          {item.explanation || 'Detailed solution and mathematical calculation applies core principles.'}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          );
        })()}
      </div>
    );
  }

  // ---------------- ACTIVE QUIZ VIEW ----------------
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8 space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Top Header Bar with Live Countdown & Progress */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Exit to Topic Map
          </button>
          <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Live Timer Pill */}
          <div
            id="quiz-timer-pill"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold shadow-md ${
              timeLeft < 120
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                : 'bg-slate-800 text-cyan-400 border-slate-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            id="btn-voice-read-aloud"
            onClick={handleToggleSpeak}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSpeaking
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Read question aloud using Voice Synthesis"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Mute' : 'Listen'}</span>
          </button>
        </div>
      </div>

      {/* Question Number Stepper Navigation */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-1.5 overflow-x-auto">
        {questions.map((q, idx) => {
          const isAnswered = !!answers[q.question_id];
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q.question_id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-lg text-xs font-bold shrink-0 transition-all ${
                isCurrent
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 ring-2 ring-indigo-400'
                  : isAnswered
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      {currentQ && (
        <div
          id={`quiz-question-card-${currentIndex + 1}`}
          className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/20 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
              Question {currentIndex + 1} of {questions.length} • {currentQ.category}
            </span>
            <span className="text-xs text-slate-400">
              Difficulty: <strong className="text-slate-200">{currentQ.difficulty || 'Medium'}</strong>
            </span>
          </div>

          <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
            {currentQ.question}
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3 pt-2">
            {[
              { key: 'A', text: currentQ.option_a },
              { key: 'B', text: currentQ.option_b },
              { key: 'C', text: currentQ.option_c },
              { key: 'D', text: currentQ.option_d },
            ].map(({ key, text }) => {
              const isSelected = answers[currentQ.question_id] === key;

              return (
                <div
                  key={key}
                  id={`quiz-option-${key}`}
                  onClick={() => handleSelectOption(key)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10 ring-1 ring-indigo-500'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {key}
                  </div>
                  <span className="text-sm font-medium">{text}</span>
                </div>
              );
            })}
          </div>

          {/* Bottom Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <div className="text-xs text-slate-400">
              Answered <strong className="text-slate-200">{answeredCount}</strong> of {questions.length}
            </div>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                id="btn-submit-quiz"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
              >
                {isSubmitting ? (
                  'Grading Answers...'
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Submit Assessment
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
