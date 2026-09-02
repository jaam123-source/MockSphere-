import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Layers,
  Award,
  Target,
  CheckSquare,
  HelpCircle,
  XCircle,
  BookOpen,
} from 'lucide-react';
import { FinalReportData, UserDashboardState } from '../types';
import { ApiService } from '../services/api';

interface FinalReportViewProps {
  dashboard: UserDashboardState;
  onBack: () => void;
}

export const FinalReportView: React.FC<FinalReportViewProps> = ({ dashboard, onBack }) => {
  const [report, setReport] = useState<FinalReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await ApiService.getFinalReport();
        setReport(data);
      } catch (err: any) {
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Generating Aptitude Performance Report from actual test data...</p>
      </div>
    );
  }

  const comp = report?.comprehensive_aptitude;

  // Validation Before Report Generation (Requirement 10)
  if (!comp || !comp.has_data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white">Aptitude Performance Report</h1>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Unable to generate the report because complete test results are not available.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {comp?.missing_data_reason ||
                'No level attempts or aptitude tests have been completed yet. Please complete at least one aptitude level or test to generate your performance report.'}
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-colors shadow-lg shadow-indigo-600/20"
            >
              Go to Aptitude Dashboard & Attempt Level 1
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isPassedOverall = comp.overall_status === 'PASSED';

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8 space-y-6 sm:space-y-8 animate-fadeIn print:p-0">
      {/* Top Header & Print Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl print:hidden">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-1">
              <Trophy className="w-3.5 h-3.5" /> True Performance Assessment
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Aptitude Performance Report
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-print-report"
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Main Printable Report Container */}
      <div
        id="printable-candidate-dossier"
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-slate-100"
      >
        {/* 1. APTITUDE PERFORMANCE REPORT HEADER */}
        <div className="border-b border-slate-800 pb-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
                Aptitude Performance Report
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                {comp.student_name}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{comp.student_email}</p>
            </div>

            <div className="flex flex-col sm:items-end gap-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Test Date: {comp.test_date}
              </span>
              <div
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl border text-xs font-extrabold mt-1 ${
                  isPassedOverall
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {isPassedOverall ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>OVERALL STATUS: {comp.overall_status}</span>
              </div>
            </div>
          </div>

          {/* Overall Key Performance Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Overall Score</div>
              <div className="text-2xl font-black text-white mt-1">
                {comp.overall_score} <span className="text-xs font-semibold text-slate-400">/ {comp.total_questions}</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Overall Percentage</div>
              <div className={`text-2xl font-black mt-1 ${isPassedOverall ? 'text-emerald-400' : 'text-rose-400'}`}>
                {comp.overall_percentage}%
              </div>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Overall Accuracy</div>
              <div className="text-2xl font-black text-cyan-400 mt-1">
                {comp.overall_accuracy}%
              </div>
            </div>

            <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl">
              <div className="text-xs text-slate-400 font-medium">Required Cutoff</div>
              <div className="text-2xl font-black text-purple-400 mt-1">
                {comp.cutoff}%
              </div>
            </div>
          </div>
        </div>

        {/* 2. LEVEL-WISE PERFORMANCE */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Level-Wise Performance
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comp.level_performance.map((item, index) => {
              const isLevelPassed = item.status === 'PASSED';
              return (
                <div
                  key={index}
                  className={`p-5 rounded-2xl border transition-all ${
                    isLevelPassed
                      ? 'bg-slate-950/60 border-emerald-500/30'
                      : 'bg-slate-950/60 border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
                    <div>
                      <span className="text-[11px] font-black uppercase text-indigo-400 tracking-wider">
                        {item.topic_name}
                      </span>
                      <h4 className="text-base font-extrabold text-white">Level {item.level_id}</h4>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-black ${
                        isLevelPassed
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Score</div>
                      <div className="text-sm font-extrabold text-white mt-0.5">
                        {item.score} / {item.total_questions}
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Percentage</div>
                      <div className={`text-sm font-extrabold mt-0.5 ${isLevelPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.percentage}%
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Cutoff</div>
                      <div className="text-sm font-extrabold text-cyan-400 mt-0.5">
                        {item.cutoff}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. TOPIC-WISE PERFORMANCE */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Topic-Wise Performance
            </h3>
          </div>

          {comp.topic_performance.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No topic category data collected.</p>
          ) : (
            <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950/60">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Topic / Category</th>
                    <th className="py-3 px-4 text-center">Attempted</th>
                    <th className="py-3 px-4 text-center text-emerald-400">Correct</th>
                    <th className="py-3 px-4 text-center text-rose-400">Wrong</th>
                    <th className="py-3 px-4 text-right">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {comp.topic_performance.map((tp, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white">{tp.topic_name}</td>
                      <td className="py-3 px-4 text-center font-medium">{tp.attempted}</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-400">{tp.correct}</td>
                      <td className="py-3 px-4 text-center font-bold text-rose-400">{tp.wrong}</td>
                      <td className="py-3 px-4 text-right font-black text-cyan-400">{tp.accuracy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 4. STRENGTHS & 5. AREAS TO IMPROVE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Strengths */}
          <div className="p-6 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-sm uppercase tracking-wider text-emerald-400">
              <CheckCircle2 className="w-5 h-5" /> Strengths
            </div>
            <ul className="space-y-2 text-xs text-slate-200">
              {comp.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-emerald-500/10">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas to Improve */}
          <div className="p-6 bg-rose-950/20 border border-rose-500/20 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 font-extrabold text-sm uppercase tracking-wider text-rose-400">
              <AlertTriangle className="w-5 h-5" /> Areas to Improve
            </div>
            <ul className="space-y-2 text-xs text-slate-200">
              {comp.areas_to_improve.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-rose-500/10">
                  <span className="text-rose-400 font-bold mt-0.5">✗</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 6. WRONG ANSWER ANALYSIS */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              Wrong Answer Analysis
            </h3>
          </div>

          {comp.wrong_answers.length === 0 ? (
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs font-semibold text-center">
              ✓ Excellent work! Zero incorrect answers recorded in your assessment.
            </div>
          ) : (
            <div className="space-y-4">
              {comp.wrong_answers.map((wa, idx) => (
                <div key={idx} className="p-5 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      Question {idx + 1} {wa.category ? `• ${wa.category}` : ''}
                    </span>
                    {wa.level_id && (
                      <span className="text-[10px] text-slate-400 font-bold">Level {wa.level_id}</span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-white">{wa.question}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-xl text-rose-200">
                      <span className="font-extrabold uppercase text-[10px] text-rose-400 block mb-0.5">
                        Your Answer:
                      </span>
                      {wa.your_answer}
                    </div>

                    <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-200">
                      <span className="font-extrabold uppercase text-[10px] text-emerald-400 block mb-0.5">
                        Correct Answer:
                      </span>
                      {wa.correct_answer}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-1">
                    <span className="font-bold text-indigo-400 uppercase text-[10px] flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Step-by-Step Explanation:
                    </span>
                    <p className="text-slate-300 text-xs leading-relaxed">{wa.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. FINAL ANALYSIS */}
        <div className="p-6 bg-slate-950/80 border border-indigo-500/30 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 font-extrabold text-sm uppercase tracking-wider text-indigo-400">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Final Analysis
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {comp.final_analysis}
          </p>
        </div>

        {/* 8. RECOMMENDATIONS */}
        <div className="p-6 bg-slate-950/80 border border-cyan-500/30 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 font-extrabold text-sm uppercase tracking-wider text-cyan-400">
            <CheckSquare className="w-5 h-5 text-cyan-400" /> Recommendations
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
            {comp.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-cyan-400 font-bold mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
