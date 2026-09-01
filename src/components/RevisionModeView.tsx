import React, { useState } from 'react';
import {
  BookOpen,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Lightbulb,
  Play,
  Award,
  Layers,
} from 'lucide-react';
import { AptitudeTopicId, UserDashboardState } from '../types';

interface RevisionModeViewProps {
  topicId: AptitudeTopicId;
  dashboard: UserDashboardState;
  onBack: () => void;
  onRetakeTest?: (testNumber: 1 | 2) => void;
  onRetakeLevel?: (levelId: number) => void;
}

const REVISION_TOPIC_DRILLS: Record<
  AptitudeTopicId,
  Array<{ title: string; concept: string; formula: string; sample: string; solution: string }>
> = {
  verbal: [
    {
      title: 'Subject-Verb Agreement & Syntactic Rules',
      concept:
        'A singular subject takes a singular verb; plural takes plural. Intervening prepositional phrases (e.g., "of the roses", "along with his colleagues") do not change the number of the subject. Expressions like "Each of", "Neither of", and "Everyone" take singular verbs.',
      formula:
        'Singular Subject + [Prepositional Modifier] + Singular Verb; Neither/Nor agrees with the nearest subject.',
      sample: 'Each of the participating candidates [has / have] submitted their project documentation.',
      solution: '"Each" is grammatically singular -> "has submitted" is the correct form.',
    },
    {
      title: 'Contextual Vocabulary & Antonyms/Synonyms',
      concept:
        'Decipher word meanings using prefixes (un-, in-, dis-, anti-), suffixes (-ous, -ful, -ible), and roots (bene = good, mal = bad, luc/lum = light). Look for contrast conjunctions ("however", "nonetheless") versus corroborating conjunctions ("moreover", "consequently").',
      formula:
        'Root Meaning + Prefix/Suffix deciphering + Surrounding Sentence Context Tone (Positive vs Negative).',
      sample:
        'Despite the hostile questioning, the witness remained lucid and unflappable throughout the cross-examination.',
      solution:
        '"Lucid" = clear and easily understood; "Unflappable" = having or showing calm in the face of crisis.',
    },
    {
      title: 'Sentence Completion & Transition Triggers',
      concept:
        'Identify signal keywords: Cause & Effect ("because", "thus", "therefore"), Contrast ("although", "despite", "yet"), Similarity ("likewise", "analogous"). Eliminate options that alter the core syntactic logic or create awkward redundancy.',
      formula:
        'Identify Clue Word -> Determine Required Connotation (+/-) -> Match Precise Logical Word.',
      sample:
        'Because the initial trials yielded ____ results, the lead researcher requested additional funding to expand the sample size.',
      solution:
        '"Promising" or "compelling" fits because the cause ("because...") led to expanding the research.',
    },
    {
      title: 'Error Spotting: Modifiers, Pronouns & Tenses',
      concept:
        'Common traps in error analysis: 1) Dangling modifiers (the modifying phrase must describe the immediate noun following the comma); 2) Correlative pairs ("Either... or", "Neither... nor", "No sooner... than", "Scarcely... when"); 3) Parallelism in lists.',
      formula:
        'Correlatives: "No sooner had [Subject] [Verb-ed] THAN..."; "Scarcely had [Subject] [Verb-ed] WHEN..."',
      sample:
        'No sooner had the keynote speaker begun when the audio connection lost clarity.',
      solution:
        'Error is "when" -> The correct correlative conjunction pair for "No sooner" is "than" ("begun than the audio...").',
    },
    {
      title: 'Idiomatic Usage, Prepositions & Collocations',
      concept:
        'Certain verbs and adjectives require fixed prepositions: "congratulate on", "insist on", "prefer X to Y", "capable of", "senior/junior to", "prevent from + gerund". Double comparatives ("more better", "more quicker") are strictly ungrammatical.',
      formula:
        'Prefer [Noun/Gerund A] TO [Noun/Gerund B]; Congratulate [Person] ON [Achievement].',
      sample: 'She prefers reading technical architecture documents [than / to] attending introductory webinars.',
      solution: '"Prefer" takes "to", not "than" -> "prefers reading ... to attending" is correct.',
    },
  ],
  quantitative: [
    {
      title: 'Time, Speed & Distance / Relative Motion',
      concept:
        'When two objects move in opposite directions, relative speed is (S1 + S2). In the same direction, relative speed is |S1 - S2|.',
      formula: 'Distance = Speed × Time; Average Speed = 2S1S2 / (S1 + S2)',
      sample: 'A train 150m long travels at 54 km/h. How long does it take to cross a pole?',
      solution: 'Convert speed: 54 × (5/18) = 15 m/s. Time = Distance / Speed = 150 / 15 = 10 seconds.',
    },
    {
      title: 'Work, Pipes & Efficiency Systems',
      concept:
        'If A completes work in n days, 1 day work = 1/n. Efficiency is inversely proportional to time taken.',
      formula: 'Total Work = Rate × Time; (M1 × D1 × H1) / W1 = (M2 × D2 × H2) / W2',
      sample: 'Pipe A fills in 12 min, Pipe B in 18 min. If opened together, how long to fill?',
      solution: 'Combined rate = 1/12 + 1/18 = (3+2)/36 = 5/36 per min. Time = 36/5 = 7.2 minutes (7 min 12 sec).',
    },
    {
      title: 'Profit, Loss, Markup & Successive Discounts',
      concept:
        'Profit% is always computed on Cost Price (CP) unless stated otherwise. Discount% is computed on Marked Price (MP).',
      formula: 'SP = CP × (1 + P/100); Net Discount = d1 + d2 - (d1×d2)/100',
      sample: 'Find single equivalent discount for successive discounts of 20% and 10%.',
      solution: 'Net discount = 20 + 10 - (200/100) = 30 - 2 = 28%.',
    },
  ],
  logical: [
    {
      title: 'Syllogisms & Categorical Logic',
      concept:
        'Follow Venn diagram boundaries strictly. Do not assume real-world facts—rely solely on premises.',
      formula: 'All A are B + All B are C => All A are C. Some A are B != All A are B.',
      sample: 'Statements: All pens are books. Some books are pencils. Conclusion: Some pens are pencils.',
      solution: 'False / Does not follow necessarily. Overlap between Pens and Pencils is not guaranteed.',
    },
    {
      title: 'Circular & Linear Seating Arrangements',
      concept:
        'In circular tables facing center: Left is clockwise, Right is counter-clockwise. Anchor the most constrained person first.',
      formula: 'Total permutations around circle = (n - 1)!',
      sample: '6 friends sit around a circular table facing center. A is opposite to D, B is immediately right of A.',
      solution: 'Fix D at bottom, A at top. Place B counter-clockwise immediately adjacent to A.',
    },
  ],
  specialized: [
    {
      title: 'Algorithm Complexities & Big-O Notation',
      concept:
        'Master the Master Theorem for divide-and-conquer recurrence relations T(n) = aT(n/b) + f(n).',
      formula: 'T(n) = 2T(n/2) + O(n) => O(n log n)',
      sample: 'What is the worst-case time complexity of QuickSelect to find the kth smallest element?',
      solution: 'Worst-case is O(n²) if poorly partitioned, but average-case is O(n).',
    },
    {
      title: 'ACID Properties & Database Isolation Levels',
      concept:
        'Atomicity, Consistency, Isolation, Durability. Isolation prevents Dirty Reads, Non-Repeatable Reads, and Phantom Reads.',
      formula: 'Read Uncommitted < Read Committed < Repeatable Read < Serializable',
      sample: 'Which isolation level prevents Dirty Reads and Non-Repeatable Reads, but may allow Phantom Reads?',
      solution: 'Repeatable Read isolation level.',
    },
  ],
};

export const RevisionModeView: React.FC<RevisionModeViewProps> = ({
  topicId,
  dashboard,
  onBack,
  onRetakeTest,
  onRetakeLevel,
}) => {
  const topic = dashboard.topics[topicId];
  const drills = REVISION_TOPIC_DRILLS[topicId] || REVISION_TOPIC_DRILLS.verbal || REVISION_TOPIC_DRILLS.quantitative;
  const [activeTab, setActiveTab] = useState<number>(0);

  const completedCount = topic.completedLevels || 0;
  const currentLvl = topic.currentLevel || 1;
  const isTest1Unlocked = topic.test1Passed || completedCount >= 5;
  const isTest2Unlocked = topic.test2Passed || (topic.test1Passed && completedCount >= 10);

  // Determine the default retake action
  const handlePrimaryRetake = () => {
    if (topic.test2Passed) {
      if (onRetakeTest) onRetakeTest(2);
      else if (onRetakeLevel) onRetakeLevel(10);
    } else if (isTest2Unlocked && topic.test1Passed) {
      if (onRetakeTest) onRetakeTest(2);
      else if (onRetakeLevel) onRetakeLevel(currentLvl);
    } else if (isTest1Unlocked && !topic.test1Passed) {
      if (onRetakeTest) onRetakeTest(1);
      else if (onRetakeLevel) onRetakeLevel(currentLvl);
    } else {
      // Levels in progress (e.g. Levels 1–5 or 6–10)
      if (onRetakeLevel) onRetakeLevel(currentLvl);
      else if (onRetakeTest && isTest1Unlocked) onRetakeTest(1);
    }
  };

  const getPrimaryButtonLabel = () => {
    if (topic.test2Passed) {
      return { text: 'Retake Capstone Test 2', desc: 'Capstone Completed' };
    }
    if (isTest2Unlocked && topic.test1Passed) {
      return { text: 'Ready to Take Checkpoint Test 2', desc: 'Levels 6–10 Cleared' };
    }
    if (isTest1Unlocked && !topic.test1Passed) {
      return { text: 'Ready to Take Checkpoint Test 1', desc: 'Phase 1 Cleared (Levels 1–5)' };
    }
    return { text: `Ready to Retake Level ${currentLvl}`, desc: `Active Progression Stage` };
  };

  const primaryBtnInfo = getPrimaryButtonLabel();

  return (
    <div className="space-y-6 animate-fadeIn px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBack}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            title="Return to Level Map"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
              <Sparkles className="w-3 h-3" /> Diagnostic Revision & Practice
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {topic.name} – Revision Mode
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Review diagnostic formulas, rules, and worked problems before taking your assessment.
            </p>
          </div>
        </div>

        {/* Action buttons header */}
        <div className="flex flex-wrap items-center gap-2">
          {onRetakeLevel && (
            <button
              id="btn-revision-retake-level"
              onClick={() => onRetakeLevel(currentLvl)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Level {currentLvl}
            </button>
          )}

          {isTest1Unlocked && onRetakeTest && (
            <button
              id="btn-revision-retake-test1"
              onClick={() => onRetakeTest(1)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" /> {topic.test1Passed ? 'Retake Test 1' : 'Take Test 1'}
            </button>
          )}

          {isTest2Unlocked && onRetakeTest && (
            <button
              id="btn-revision-retake-test2"
              onClick={() => onRetakeTest(2)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs rounded-xl shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5" /> {topic.test2Passed ? 'Retake Test 2' : 'Take Test 2'}
            </button>
          )}
        </div>
      </div>

      {/* Concept Tabs & Drilldown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Module list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Diagnostic Study Modules
            </h2>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">
              {drills.length} Modules Available
            </span>
          </div>

          <div className="space-y-2">
            {drills.map((drill, idx) => (
              <div
                key={drill.title}
                onClick={() => setActiveTab(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  activeTab === idx
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-md ring-1 ring-indigo-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400">Module {idx + 1}</span>
                  {activeTab === idx && <Lightbulb className="w-4 h-4 text-amber-400" />}
                </div>
                <div className="font-semibold text-sm mt-1">{drill.title}</div>
              </div>
            ))}
          </div>

          {/* Quick status card */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/80 space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Current Stage
            </div>
            <div className="text-xs text-slate-300 flex items-center justify-between">
              <span>Active Level:</span>
              <strong className="text-white">Level {currentLvl}</strong>
            </div>
            <div className="text-xs text-slate-300 flex items-center justify-between">
              <span>Test 1 (Levels 1–5):</span>
              <strong className={topic.test1Passed ? 'text-emerald-400' : isTest1Unlocked ? 'text-amber-400' : 'text-slate-500'}>
                {topic.test1Passed ? 'Passed ✓' : isTest1Unlocked ? 'Unlocked (Ready)' : 'Locked'}
              </strong>
            </div>
            <div className="text-xs text-slate-300 flex items-center justify-between">
              <span>Test 2 (Levels 6–10):</span>
              <strong className={topic.test2Passed ? 'text-emerald-400' : isTest2Unlocked ? 'text-cyan-400' : 'text-slate-500'}>
                {topic.test2Passed ? 'Passed ✓' : isTest2Unlocked ? 'Unlocked (Ready)' : 'Locked'}
              </strong>
            </div>
          </div>
        </div>

        {/* Right Side: Active Module Detailed Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          {drills[activeTab] && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-md border border-cyan-500/20">
                  Concept Mastery Drill #{activeTab + 1}
                </span>
                <h3 className="text-xl font-bold text-white mt-2">
                  {drills[activeTab].title}
                </h3>
              </div>

              {/* Core Concept */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Key Theoretical Principle
                </div>
                <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-sm text-slate-200 leading-relaxed">
                  {drills[activeTab].concept}
                </div>
              </div>

              {/* Mathematical Formula / Grammar Rules */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Governing Principles & Syntax Rules
                </div>
                <div className="p-4 bg-indigo-950/30 rounded-xl border border-indigo-500/30 text-sm font-mono text-cyan-300 font-bold leading-relaxed">
                  {drills[activeTab].formula}
                </div>
              </div>

              {/* Worked Example */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Worked Practice Drill
                </div>
                <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="font-semibold text-slate-200 text-sm">
                    {drills[activeTab].sample}
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-emerald-400 text-xs leading-relaxed">
                    <strong className="text-white">Solution & Explanation: </strong>
                    {drills[activeTab].solution}
                  </div>
                </div>
              </div>

              {/* Ready to Retake Action Container */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-400 text-center sm:text-left">
                  Finished reviewing? Click below to resume your assessment with fresh questions.
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    id="btn-ready-to-retake-primary"
                    onClick={handlePrimaryRetake}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> {primaryBtnInfo.text}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

