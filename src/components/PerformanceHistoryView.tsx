import React, { useState, useEffect } from 'react';
import {
  History,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Award,
  Code2,
  Users2,
  Layers,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ApiService } from '../services/api';
import { UserDashboardState } from '../types';

interface PerformanceHistoryViewProps {
  dashboard: UserDashboardState;
  onBack: () => void;
}

export const PerformanceHistoryView: React.FC<PerformanceHistoryViewProps> = ({
  dashboard,
  onBack,
}) => {
  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'levels' | 'tests' | 'interviews'>('levels');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await ApiService.getPerformanceHistory();
        setHistory(data);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading performance timeline...</p>
      </div>
    );
  }

  const levelAttempts = history?.level_attempts || [];
  const testAttempts = history?.test_attempts || [];
  const techInterviews = history?.technical_interviews || [];
  const hrInterviews = history?.hr_interviews || [];

  // Chart data from attempts
  const chartData = levelAttempts.slice(-10).map((att: any, idx: number) => ({
    attempt: `Lvl ${att.level_id} (#${idx + 1})`,
    percentage: att.percentage,
    topic: att.topic_id,
  }));

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8 space-y-6 animate-fadeIn">
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-1">
              <History className="w-3.5 h-3.5" /> Longitudinal Progress Tracker
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Performance History & Learning Timeline
            </h1>
          </div>
        </div>
      </div>

      {/* Performance Trend Chart */}
      {chartData.length > 0 && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" /> Recent Level Score Trend (%)
          </h2>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="attempt" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="percentage" stroke="#06b6d4" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('levels')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'levels'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Level Attempts ({levelAttempts.length})
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'tests'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Topic Tests ({testAttempts.length})
        </button>

        <button
          onClick={() => setActiveTab('interviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'interviews'
              ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          AI Interviews ({techInterviews.length + hrInterviews.length})
        </button>
      </div>

      {/* Tab Content List */}
      <div className="space-y-3">
        {activeTab === 'levels' && (
          <div className="space-y-3">
            {levelAttempts.length === 0 ? (
              <div className="text-center p-12 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No level attempts recorded yet. Start practicing on the dashboard!
              </div>
            ) : (
              levelAttempts.map((att: any, idx: number) => (
                <div
                  key={att.attempt_id || idx}
                  className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        att.status === 'PASSED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {att.status === 'PASSED' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-slate-200 capitalize">
                        {att.topic_id} • Level {att.level_id}
                      </div>
                      <div className="text-[11px] text-slate-400">Score: {att.score}/{att.total_questions} ({att.percentage}%)</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        att.status === 'PASSED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {att.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="space-y-3">
            {testAttempts.length === 0 ? (
              <div className="text-center p-12 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No 5-Level Topic Tests attempted yet.
              </div>
            ) : (
              testAttempts.map((test: any, idx: number) => (
                <div
                  key={test.test_id || idx}
                  className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        test.status === 'PASSED'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-200 capitalize">
                        {test.topic_id} • Test {test.test_number}
                      </div>
                      <div className="text-[11px] text-slate-400">Score: {test.score}/{test.total_questions} ({test.percentage}%)</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-bold px-2 py-0.5 rounded ${
                        test.status === 'PASSED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'interviews' && (
          <div className="space-y-3">
            {techInterviews.map((sess: any, idx: number) => (
              <div
                key={sess.session_id || idx}
                className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-200 capitalize">Technical Round ({sess.domain})</div>
                    <div className="text-[11px] text-slate-400">Status: {sess.status} • Score: {sess.overall_score || 0}%</div>
                  </div>
                </div>

                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    sess.passed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {sess.passed ? 'PASSED' : 'IN_PROGRESS / FAILED'}
                </span>
              </div>
            ))}

            {hrInterviews.map((sess: any, idx: number) => (
              <div
                key={sess.session_id || idx}
                className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <Users2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-200">AI HR Round</div>
                    <div className="text-[11px] text-slate-400">Status: {sess.status} • Score: {sess.overall_score || 0}%</div>
                  </div>
                </div>

                <span
                  className={`font-bold px-2 py-0.5 rounded ${
                    sess.passed ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}
                >
                  {sess.passed ? 'PASSED' : 'IN_PROGRESS / FAILED'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
