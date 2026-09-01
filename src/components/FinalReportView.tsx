import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Calendar,
  Layers,
  Award,
  Code2,
  Users2,
  Target,
  CheckSquare,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
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

  if (loading || !report) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Synthesizing Comprehensive Candidate Dossier...</p>
      </div>
    );
  }

  const radarData = [
    { subject: 'Quantitative', score: report.aptitude.quantitative, fullMark: 100 },
    { subject: 'Logical Reasoning', score: report.aptitude.logical, fullMark: 100 },
    { subject: 'Verbal Ability', score: report.aptitude.verbal, fullMark: 100 },
    { subject: 'Specialized Tech', score: report.aptitude.specialized, fullMark: 100 },
    { subject: 'Tech Interview', score: report.technical.score, fullMark: 100 },
    { subject: 'HR Behavioral', score: report.hr.score, fullMark: 100 },
  ];

  const pillarData = [
    { name: 'Aptitude Composite', score: report.aptitude.final_aptitude_score, fill: '#8b5cf6' },
    { name: 'Technical Depth', score: report.technical.score, fill: '#06b6d4' },
    { name: 'HR Leadership', score: report.hr.score, fill: '#10b981' },
    { name: 'Overall Readiness', score: report.overall.score, fill: '#f59e0b' },
  ];

  const isQualified = report.overall.qualification_status === 'QUALIFIED';

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8 space-y-6 sm:space-y-8 animate-fadeIn print:p-0">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl print:hidden">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-1">
              <Trophy className="w-3.5 h-3.5" /> Official Candidate Qualification Dossier
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Comprehensive AI Assessment Report
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

      {/* Main Dossier Container (Print friendly) */}
      <div
        id="printable-candidate-dossier"
        className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-slate-100"
      >
        {/* Candidate Profile Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Candidate Dossier</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{report.user_name}</h2>
            <p className="text-xs text-slate-400">{report.user_email} • Specialization: {report.selected_domain}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Evaluation Date</div>
              <div className="text-sm font-semibold text-slate-200 flex items-center gap-1.5 justify-end mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {report.date}
              </div>
            </div>

            <div
              className={`px-4 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-2 ${
                isQualified
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}
            >
              {isQualified ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{report.overall.badge}</span>
            </div>
          </div>
        </div>

        {/* 3-Pillar Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4 text-purple-400" /> 1. Aptitude Mastery</span>
              <span className="text-purple-400">{report.aptitude.status}</span>
            </div>
            <div className="text-3xl font-extrabold text-white">{report.aptitude.final_aptitude_score}%</div>
            <p className="text-[11px] text-slate-400">Quantitative, Logical, Verbal & Tech</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><Code2 className="w-4 h-4 text-cyan-400" /> 2. Technical Interview</span>
              <span className="text-cyan-400">{report.technical.status}</span>
            </div>
            <div className="text-3xl font-extrabold text-white">{report.technical.score}%</div>
            <p className="text-[11px] text-slate-400">{report.selected_domain} Multimodal Round</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span className="flex items-center gap-1.5"><Users2 className="w-4 h-4 text-emerald-400" /> 3. HR Behavioral</span>
              <span className="text-emerald-400">{report.hr.status}</span>
            </div>
            <div className="text-3xl font-extrabold text-white">{report.hr.score}%</div>
            <p className="text-[11px] text-slate-400">STAR Leadership Framework</p>
          </div>
        </div>

        {/* Visual Charts: Radar Chart & Pillar Bar Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Radar Chart */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" /> Competency Radar Profile
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                  <Radar name="Candidate" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" /> Assessment Score Distribution
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pillarData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Career Coach Executive Synthesis */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-950 to-purple-950/30 border border-indigo-500/30 space-y-6 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Gemini AI Executive Evaluation Summary</h3>
              <p className="text-xs text-slate-400">Intelligent synthesis of candidate problem solving & communication</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            {report.ai_feedback.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-2">
              <div className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Core Candidate Strengths:
              </div>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                {report.ai_feedback.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-xl space-y-2">
              <div className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Growth & Improvement Areas:
              </div>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                {report.ai_feedback.weaknesses.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3-Step Action Plan */}
          <div className="space-y-3 pt-2">
            <div className="font-bold text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4" /> Personalized 3-Step Career Action Plan:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {report.ai_feedback.action_plan.map((step, idx) => (
                <div key={idx} className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="font-bold text-cyan-400 text-[11px]">Step {idx + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
