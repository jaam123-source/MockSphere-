import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Clock,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  AlertTriangle,
  Code2,
  BookOpen,
} from 'lucide-react';
import { AptitudeQuestion, FinalAptitudeResult, ReviewQuestionItem, UserDashboardState } from '../types';
import { ApiService } from '../services/api';
import { SpeechService } from '../utils/speech';

interface FinalAptitudeTestViewProps {
  dashboard: UserDashboardState;
  onBack: () => void;
  onProceedTechnical: () => void;
  onRefreshDashboard: () => void;
}

export const FinalAptitudeTestView: React.FC<FinalAptitudeTestViewProps> = ({
  dashboard,
  onBack,
  onProceedTechnical,
  onRefreshDashboard,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [questions, setQuestions] = useState<AptitudeQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<FinalAptitudeResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showReviewList, setShowReviewList] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'wrong' | 'correct'>('all');

  useEffect(() => {
    async function loadTest() {
      try {
        setLoading(true);
        const data = await ApiService.getFinalTestQuestions();
        setQuestions(data.questions);
        setTimeLeft(data.time_limit_minutes * 60);
      } catch (err: any) {
        alert(err.message || 'Could not load Final Aptitude Test');
        onBack();
      } finally {
        setLoading(false);
      }
    }
    loadTest();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (result || loading) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [result, loading]);

  const currentQ = questions?.[currentIndex] || questions?.[0];

  const handleSelectOption = (key: string) => {
    if (!currentQ || result) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.question_id]: key,
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    SpeechService.stopSpeaking();
    setIsSpeaking(false);

    try {
      const payload = questions.map((q) => ({
        question_id: q.question_id,
        selected_answer: answers[q.question_id] || '',
      }));

      const res = await ApiService.submitFinalTest(payload);
      setResult(res);
      onRefreshDashboard();

      if (res.status === 'QUALIFIED') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      alert(`Submission error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Assembling 25-Question Final Aptitude Evaluation...</p>
      </div>
    );
  }

  // ---------------- FINAL TEST RESULT ----------------
  if (result) {
    const isQualified = result.status === 'QUALIFIED';

    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8 space-y-6 animate-fadeIn">
        <div
          id="final-aptitude-result-card"
          className={`rounded-2xl border p-5 sm:p-8 shadow-2xl relative overflow-hidden ${
            isQualified
              ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40'
              : 'bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/40'
          }`}
        >
          <div className="relative z-10 space-y-6 text-center">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl flex items-center justify-center border shadow-lg ${
                isQualified
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              }`}
            >
              {isQualified ? <Trophy className="w-8 h-8 sm:w-10 sm:h-10" /> : <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />}
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border">
                {isQualified ? (
                  <span className="text-amber-400 border-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded-full">
                    Stage 2 Complete • Technical Round Unlocked
                  </span>
                ) : (
                  <span className="text-rose-400 border-rose-500/20 bg-rose-500/10 px-2 py-0.5 rounded-full">
                    Qualification Threshold Not Met
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {isQualified ? 'Congratulations! Aptitude Qualified' : 'Score Below Cutoff'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-1">
                {isQualified
                  ? 'You successfully cleared the 25-question cross-disciplinary Final Aptitude Assessment and unlocked the AI Technical Interview Round.'
                  : `You scored ${result.percentage}%. The qualification cutoff is ${result.cutoff}%. Review your topic breakdown below and re-attempt.`}
              </p>
            </div>

            {/* Score Stats */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-md mx-auto">
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Final Score</div>
                <div className="text-lg sm:text-xl font-bold text-white">
                  {result.score} <span className="text-xs text-slate-400">/ {result.total_questions}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Percentage</div>
                <div className={`text-lg sm:text-xl font-bold ${isQualified ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {result.percentage}%
                </div>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <div className="text-[11px] sm:text-xs text-slate-400 font-medium">Cutoff</div>
                <div className="text-lg sm:text-xl font-bold text-amber-400">{result.cutoff}%</div>
              </div>
            </div>

            {/* 4 Topic Breakdown Radar/Bars */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 text-left space-y-4 max-w-2xl mx-auto">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Multi-Topic Performance Breakdown</span>
                <span className="text-cyan-400 font-normal">70% Target</span>
              </div>

              <div className="space-y-3">
                {Object.entries(result.topic_scores).map(([tid, scoreData]) => {
                  const score = scoreData as { score: number; total: number; percentage: number };
                  const names: Record<string, string> = {
                    quantitative: 'Quantitative Aptitude',
                    logical: 'Logical Reasoning',
                    verbal: 'Verbal Ability',
                    specialized: 'Specialized & Technical',
                  };
                  return (
                    <div key={tid} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{names[tid]}</span>
                        <span className={score.percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'}>
                          {score.score}/{score.total} ({score.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            score.percentage >= 70
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : 'bg-gradient-to-r from-amber-500 to-rose-500'
                          }`}
                          style={{ width: `${score.percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800">
                <div>
                  <span className="text-slate-400 font-medium">Strongest Topic: </span>
                  <strong className="text-emerald-400">{result.strongest_topic}</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Weakest Topic: </span>
                  <strong className="text-rose-400">{result.weakest_topic}</strong>
                </div>
              </div>
            </div>

            {/* Stage 3 Technical Round Preview (When Qualified) */}
            {isQualified && (
              <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/60 border border-cyan-500/30 rounded-xl p-4 max-w-2xl mx-auto text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>NEXT STAGE: MULTIMODAL AI TECHNICAL INTERVIEW</span>
                </div>
                <p className="text-xs text-slate-300">
                  Choose from 5 trending industry domains: <strong>Full Stack</strong>, <strong>Generative AI & LLMs</strong>, <strong>Cloud & DevOps</strong>, <strong>Data Science & ML</strong>, or <strong>Cyber Security</strong> with 3-level progressive interview progression (30 questions) with live TTS interviewer & code evaluation.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              {isQualified ? (
                <button
                  id="btn-proceed-technical-round"
                  onClick={onProceedTechnical}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Code2 className="w-4 h-4" /> Enter AI Technical Interview Round <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setResult(null);
                    setAnswers({});
                    setCurrentIndex(0);
                    setTimeLeft(30 * 60);
                  }}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-transform hover:scale-105"
                >
                  <Sparkles className="w-4 h-4" /> Retake Final Aptitude Test
                </button>
              )}

              <button
                onClick={onBack}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl border border-slate-700 transition-colors"
              >
                Return to Dashboard
              </button>

              <button
                id="btn-toggle-final-review"
                onClick={() => {
                  const nextState = !showReviewList;
                  setShowReviewList(nextState);
                  if (nextState) {
                    setTimeout(() => {
                      document.getElementById('final-test-review-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }
                }}
                className={`px-5 py-3 font-semibold text-sm rounded-xl border transition-all flex items-center gap-2 ${
                  showReviewList
                    ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
                    : 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border-amber-500/30'
                }`}
              >
                <BookOpen className="w-4 h-4" /> {showReviewList ? 'Hide Explanations' : 'Review Explanations (25 Questions)'}
              </button>
            </div>
          </div>
        </div>

        {/* 25 Questions In-Depth Review Section */}
        {showReviewList && (() => {
          const reviewItems: ReviewQuestionItem[] = (result?.answers_review && result.answers_review.length > 0)
            ? result.answers_review
            : questions.map((q) => {
                const userAns = answers[q.question_id] || 'None';
                return {
                  question_id: q.question_id,
                  question: q.question,
                  your_answer: userAns,
                  correct_answer: (q as any).correct_answer || 'A',
                  explanation: (q as any).explanation || 'Step-by-step mathematical reasoning.',
                  category: q.category || 'General',
                  topic_id: q.topic_id,
                  difficulty: q.difficulty,
                  is_correct: userAns.toUpperCase() === ((q as any).correct_answer || 'A').toUpperCase(),
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
            <div id="final-test-review-section" className="space-y-6 pt-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-400" /> Final Aptitude Solutions & Step-by-Step Explanations
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Examine verified correct answers, your selections, and full conceptual walkthroughs for all 25 questions.
                  </p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setReviewFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      reviewFilter === 'all'
                        ? 'bg-amber-600 text-white shadow'
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                            Question {originalIndex || idx + 1}
                          </span>
                          {item.topic_id && (
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 capitalize">
                              {item.topic_id}
                            </span>
                          )}
                          <span className="text-xs font-medium text-slate-400">
                            Category: <span className="text-slate-300 font-semibold">{item.category}</span>
                          </span>
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
                      <div className="bg-slate-950/80 rounded-xl p-4 border border-amber-500/20 text-xs text-slate-300 space-y-2 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                        <div className="font-bold text-amber-400 flex items-center gap-1.5 tracking-wide text-xs">
                          <Sparkles className="w-4 h-4 text-amber-400" /> Step-by-Step Solution & Concept Explanation:
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

  // ---------------- ACTIVE TEST VIEW ----------------
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8 space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Final Aptitude Assessment</h1>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
              Stage 2 Milestone
            </span>
          </div>
          <p className="text-xs text-slate-400">25 Mixed Questions (Quant, Logic, Verbal, Specialized) • 70% Cutoff</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-mono font-bold bg-slate-800 text-amber-400 border-slate-700">
            <Clock className="w-4 h-4" />
            <span>{formatTime(timeLeft)}</span>
          </div>

          <button
            onClick={handleToggleSpeak}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSpeaking
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? 'Mute' : 'Listen'}</span>
          </button>
        </div>
      </div>

      {/* 25 Question Navigation Pills */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-1.5 overflow-x-auto">
        {questions.map((q, idx) => {
          const isAnswered = !!answers[q.question_id];
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q.question_id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-7 h-7 rounded-lg text-xs font-bold shrink-0 transition-all ${
                isCurrent
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/40 ring-2 ring-amber-400'
                  : isAnswered
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      {currentQ && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
              Question {currentIndex + 1} of {questions.length} • {currentQ.category}
            </span>
            <span className="text-xs text-slate-400">
              Topic: <strong className="text-slate-200 capitalize">{currentQ.topic_id || 'General'}</strong>
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
                  onClick={() => handleSelectOption(key)}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex items-center gap-4 ${
                    isSelected
                      ? 'bg-amber-600/20 border-amber-500 text-white shadow-md shadow-amber-500/10 ring-1 ring-amber-500'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                      isSelected ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {key}
                  </div>
                  <span className="text-sm font-medium">{text}</span>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Previous
            </button>

            <div className="text-xs text-slate-400">
              Answered <strong className="text-slate-200">{Object.keys(answers).length}</strong> of {questions.length}
            </div>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-600/30 transition-all flex items-center gap-1.5"
              >
                Next <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2"
              >
                {isSubmitting ? 'Evaluating 25 Answers...' : 'Submit Final Assessment'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
