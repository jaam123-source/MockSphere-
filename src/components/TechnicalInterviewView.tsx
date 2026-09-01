import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Code2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  ArrowRight,
  Layers,
  Layout,
  Server,
  Terminal,
  BarChart2,
  Brain,
  Cpu,
  Shield,
  Database,
  Cloud,
  GitBranch,
  Network,
  HardDrive,
  Smartphone,
  Radio,
  Boxes,
  Lock,
  CheckCircle2,
  AlertCircle,
  Trophy,
  ArrowLeft,
  Check,
  RotateCcw,
  BookOpen,
  Search,
  Video,
  VideoOff,
  Clock,
  Zap,
  HelpCircle,
  Lightbulb,
  Award,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import {
  AIQuestionEvaluation,
  ResponseMode,
  TechnicalDomainId,
  TechnicalDomainInfo,
  TechnicalInterviewSession,
  TechnicalQuestion,
  UserDashboardState,
} from '../types';
import { ApiService } from '../services/api';
import { SpeechService } from '../utils/speech';

interface TechnicalInterviewViewProps {
  dashboard: UserDashboardState;
  onBack: () => void;
  onProceedHR: () => void;
  onRefreshDashboard: () => void;
}

// Icon helper for domain badges
const getDomainIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Layout':
      return Layout;
    case 'Server':
      return Server;
    case 'Terminal':
      return Terminal;
    case 'BarChart2':
      return BarChart2;
    case 'Brain':
      return Brain;
    case 'Cpu':
      return Cpu;
    case 'Shield':
      return Shield;
    case 'Database':
      return Database;
    case 'Cloud':
      return Cloud;
    case 'GitBranch':
      return GitBranch;
    case 'Network':
      return Network;
    case 'HardDrive':
      return HardDrive;
    case 'Smartphone':
      return Smartphone;
    case 'Radio':
      return Radio;
    case 'Boxes':
      return Boxes;
    case 'Lock':
      return Lock;
    case 'Sparkles':
      return Sparkles;
    default:
      return Layers;
  }
};

export const TechnicalInterviewView: React.FC<TechnicalInterviewViewProps> = ({
  dashboard,
  onBack,
  onProceedHR,
  onRefreshDashboard,
}) => {
  // Domain listing state
  const [domainsList, setDomainsList] = useState<TechnicalDomainInfo[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<TechnicalDomainId>('fullstack');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Interview state
  const [session, setSession] = useState<TechnicalInterviewSession | null>(null);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Response inputs
  const [responseMode, setResponseMode] = useState<ResponseMode>('voice');
  const [textResponse, setTextResponse] = useState<string>('');
  const [codeSnippet, setCodeSnippet] = useState<string>('');
  const [diagramDescription, setDiagramDescription] = useState<string>('');

  // Audio / Voice AI
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechRecognizer, setSpeechRecognizer] = useState<any>(null);
  const [isSpeakingInterviewer, setIsSpeakingInterviewer] = useState<boolean>(false);
  const [voiceVolumeLevel, setVoiceVolumeLevel] = useState<number>(0);
  const [isAudioFeedbackEnabled, setIsAudioFeedbackEnabled] = useState<boolean>(true);

  // Webcam stream & status
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Timer & pacing
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Step feedback & modal state
  const [latestEval, setLatestEval] = useState<AIQuestionEvaluation | null>(null);
  const [showStepFeedbackModal, setShowStepFeedbackModal] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {}
      });
      mediaStreamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  // Start / Request Camera Stream
  const startCamera = useCallback(async () => {
    setIsCameraLoading(true);
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported on this browser device.');
      }

      // Stop any existing tracks before requesting fresh stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => {
          try {
            t.stop();
          } catch {}
        });
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          facingMode: 'user',
        },
        audio: false,
      });

      mediaStreamRef.current = stream;
      setIsCameraActive(true);
      setCameraError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Video auto-play catch:', playErr);
        }
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      setCameraError(
        isDenied
          ? 'Camera permission denied. Please allow camera in browser settings.'
          : 'Camera device unavailable or busy.'
      );
      setIsCameraActive(false);
    } finally {
      setIsCameraLoading(false);
    }
  }, []);

  // Callback ref for <video> element to immediately attach stream upon DOM mount
  const bindVideoElement = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element && mediaStreamRef.current && mediaStreamRef.current.active) {
      element.srcObject = mediaStreamRef.current;
      element.muted = true;
      element.play().catch((err) => {
        console.warn('Video play error on element bind:', err);
      });
    }
  }, []);

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
      setIsCameraActive(false);
      setCameraError(null);
    } else {
      setIsCameraActive(true);
      startCamera();
    }
  };

  // Automatically start camera when an active in-progress session is present and camera is enabled
  useEffect(() => {
    if (session && session.status === 'IN_PROGRESS' && isCameraActive) {
      const activeStream = mediaStreamRef.current;
      const hasActiveTracks = activeStream && activeStream.active && activeStream.getVideoTracks().some((t) => t.readyState === 'live');

      if (!hasActiveTracks) {
        startCamera();
      } else if (videoRef.current && videoRef.current.srcObject !== activeStream) {
        videoRef.current.srcObject = activeStream;
        videoRef.current.muted = true;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [session?.status, isCameraActive, startCamera]);

  // Load domains on mount & check active session
  useEffect(() => {
    let isMounted = true;
    ApiService.getTechnicalDomains()
      .then((res) => {
        if (isMounted && res.domains && res.domains.length > 0) {
          setDomainsList(res.domains);
        }
      })
      .catch((err) => console.error('Failed to load domains:', err));

    ApiService.getActiveTechnicalInterview()
      .then((res) => {
        if (isMounted && res.session) {
          setSession(res.session);
          setSelectedDomain(res.session.domain);
        }
      })
      .catch((err) => console.error('Failed to check active technical session:', err));

    return () => {
      isMounted = false;
      stopCamera();
      SpeechService.stopSpeaking();
    };
  }, []);

  // Sync starter code and speak new question when session or index updates
  useEffect(() => {
    if (session && session.status === 'IN_PROGRESS') {
      const q = session.questions[session.current_question_index];
      if (q) {
        setTextResponse('');
        setCodeSnippet(q.code_template || '');
        setDiagramDescription('');
        setShowHint(false);
        setQuestionStartTime(Date.now());

        // Default mode based on question type:
        // Coding questions default to 'code' (Code Editor workspace)
        // Theory / Conceptual / System Design / Scenario questions default to 'voice' and remove the code editor
        if (q.type === 'coding') {
          setResponseMode('code');
        } else {
          setResponseMode('voice');
        }

        // Auto-speak interviewer question if audio is enabled
        if (isAudioFeedbackEnabled) {
          speakInterviewerQuestion(q.question);
        }
      }
    }
  }, [session?.current_question_index, session?.session_id]);

  // Question timer interval
  useEffect(() => {
    if (session && session.status === 'IN_PROGRESS' && !showStepFeedbackModal) {
      const interval = setInterval(() => {
        setTimeSpentSeconds(Math.floor((Date.now() - questionStartTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [session?.status, session?.current_question_index, showStepFeedbackModal, questionStartTime]);

  // Interviewer TTS voice
  const speakInterviewerQuestion = (text: string) => {
    SpeechService.stopSpeaking();
    setIsSpeakingInterviewer(true);
    SpeechService.speak(
      text,
      () => setIsSpeakingInterviewer(false),
      () => setIsSpeakingInterviewer(false)
    );
  };

  // Voice recording logic
  const toggleRecording = () => {
    if (isRecording) {
      if (speechRecognizer) {
        try {
          speechRecognizer.stop();
        } catch {}
      }
      setIsRecording(false);
      setVoiceVolumeLevel(0);
    } else {
      if (!SpeechService.isSpeechRecognitionSupported()) {
        alert('Speech recognition is not natively supported in this browser. Please type your response.');
        return;
      }
      try {
        const recognizer = SpeechService.createSpeechRecognizer(
          (transcript, isFinal) => {
            setTextResponse((prev) => (isFinal ? (prev ? prev + ' ' + transcript : transcript) : prev));
            setVoiceVolumeLevel(Math.min(100, Math.floor(transcript.length * 4) % 100));
          },
          (err) => {
            console.warn('Voice error:', err);
            setIsRecording(false);
            setVoiceVolumeLevel(0);
          },
          () => {
            setIsRecording(false);
            setVoiceVolumeLevel(0);
          }
        );
        if (recognizer) {
          recognizer.start();
          setSpeechRecognizer(recognizer);
          setIsRecording(true);
        }
      } catch (err) {
        console.error('Failed to start voice recognition:', err);
        setIsRecording(false);
      }
    }
  };

  // Start interview handler
  const handleStartInterview = async (isRetake = false) => {
    setIsStarting(true);
    SpeechService.stopSpeaking();
    try {
      const newSession = await ApiService.startTechnicalInterview(selectedDomain, isRetake);
      setSession(newSession);
      setLatestEval(null);
      setShowStepFeedbackModal(false);
      startCamera();
    } catch (err: any) {
      alert(err.message || 'Failed to start interview.');
    } finally {
      setIsStarting(false);
    }
  };

  // Reset interview
  const handleResetInterview = async () => {
    if (!window.confirm('Are you sure you want to reset this interview? Your progress will be cleared.')) return;
    setIsResetting(true);
    try {
      await ApiService.resetTechnicalInterview();
      setSession(null);
      setLatestEval(null);
      stopCamera();
      SpeechService.stopSpeaking();
    } catch (err: any) {
      alert(err.message || 'Failed to reset interview.');
    } finally {
      setIsResetting(false);
    }
  };

  // Submit response handler
  const handleSubmitAnswer = async () => {
    if (!session) return;
    const currentQ = session.questions[session.current_question_index];
    if (!currentQ) return;

    if (isRecording) {
      toggleRecording();
    }

    const payloadText = textResponse.trim();
    const payloadCode = codeSnippet.trim();
    const payloadDiag = diagramDescription.trim();

    const isCodingQ = currentQ.type === 'coding';

    if (isCodingQ) {
      if (!payloadCode && !payloadText) {
        alert('Please write your code implementation in the Code Editor before submitting.');
        return;
      }
    } else {
      if (!payloadText) {
        alert('Please provide your theoretical explanation via Voice or Written response before submitting.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result = await ApiService.evaluateTechnicalAnswer({
        session_id: session.session_id,
        question_id: currentQ.question_id,
        domain: session.domain,
        response_type: isCodingQ ? responseMode : (responseMode === 'code' ? 'voice' : responseMode),
        response_text: payloadText,
        code_snippet: isCodingQ ? payloadCode || undefined : undefined,
        diagram_data: payloadDiag || undefined,
        time_taken_seconds: timeSpentSeconds,
      });

      setLatestEval(result.currentEvaluation);
      setShowStepFeedbackModal(true);

      // Spoken AI Interviewer reaction
      if (isAudioFeedbackEnabled && result.currentEvaluation?.spoken_response) {
        SpeechService.speak(
          result.currentEvaluation.spoken_response,
          () => {},
          () => {}
        );
      }

      // Update session in state
      setSession(result.session);

      // If completed and passed, celebrate with confetti
      if (result.session.status === 'COMPLETED' && result.session.passed) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        onRefreshDashboard();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit response.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Proceed to next question after reviewing feedback
  const handleProceedNext = () => {
    SpeechService.stopSpeaking();
    setShowStepFeedbackModal(false);
    setLatestEval(null);
  };

  // Unique categories for filtering
  const categories: string[] = ['All', ...Array.from(new Set<string>(domainsList.map((d) => d.category)))];

  const filteredDomains = domainsList.filter((d) => {
    const matchCat = selectedCategory === 'All' || d.category === selectedCategory;
    const matchSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const selectedDomainMeta =
    domainsList.find((d) => d.id === selectedDomain) || domainsList[0] || {
      id: 'fullstack',
      name: 'Full Stack Development',
      category: 'Software Engineering',
      description: 'End-to-end web architectures, APIs, and microservices.',
      topics: ['React', 'Node.js', 'REST & GraphQL'],
      icon: 'Layers',
    };

  // ----------------------------------------------------
  // VIEW 1: DOMAIN SELECTION & INTERVIEW BRIEFING
  // ----------------------------------------------------
  if (!session) {
    return (
      <div id="technical-domain-selector" className="space-y-6 sm:space-y-8 max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <button
                id="btn-back-dashboard"
                onClick={onBack}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Technical Interview Round
              </h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm md:text-base max-w-3xl">
              Experience a realistic, 3-level AI-powered live technical interview. Select your engineering domain, answer conceptual questions, analyze code snippets, and solve practical architectural challenges.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Final Aptitude Cleared
            </span>
          </div>
        </div>

        {/* 3-Level Progressive Flow Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 bg-slate-50 dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
              L1
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Level 1 — Basic</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                10 Questions: Fundamentals, primitives, core syntax, definitions & standard lifecycles.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm shrink-0">
              L2
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Level 2 — Intermediate</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                10 Questions: Architecture comparisons, code output tracing, debugging & performance tradeoffs.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
              L3
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Level 3 — Practical</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                10 Questions: Real-world coding problems, system design scenarios & production edge cases.
              </p>
            </div>
          </div>
        </div>

        {/* Domain Search & Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Choose Your Technical Domain</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select from the top 5 high-demand industry domains widely running in tech companies.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="input-domain-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search domain or topic..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-nowrap">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`btn-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 20-Domain Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredDomains.map((dom) => {
            const IconComp = getDomainIcon(dom.icon);
            const isSelected = selectedDomain === dom.id;
            return (
              <div
                key={dom.id}
                id={`domain-card-${dom.id}`}
                onClick={() => setSelectedDomain(dom.id)}
                className={`cursor-pointer p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/30 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {dom.category}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 dark:text-white text-base mb-1.5">{dom.name}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">{dom.description}</p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {dom.topics.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400"
                      >
                        {t}
                      </span>
                    ))}
                    {dom.topics.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md text-slate-400">
                        +{dom.topics.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">30 Live Questions</span>
                    <span
                      className={`font-semibold flex items-center gap-1 ${
                        isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select'} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selection Confirmation Bar */}
        <div className="sticky bottom-6 z-20 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ready for Live AI Technical Round</p>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedDomainMeta.name}</h3>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="btn-start-technical-interview"
              onClick={() => handleStartInterview(false)}
              disabled={isStarting}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isStarting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Live AI Interviewer...</span>
                </>
              ) : (
                <>
                  <span>Begin Live Technical Interview</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: INTERVIEW COMPLETED / FINAL EVALUATION SCREEN
  // ----------------------------------------------------
  if (session.status === 'COMPLETED') {
    const isPassed = !!session.passed;
    const scores = session.level_scores || { level1: 80, level2: 75, level3: 70 };
    const metrics = session.metrics_breakdown || {
      technical_knowledge: 82,
      concept_understanding: 80,
      problem_solving: 78,
      communication: 85,
      confidence_level: 84,
    };

    return (
      <div id="technical-completed-view" className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8 pb-28 sm:pb-8 space-y-6 sm:space-y-8">
        {/* Outcome Header */}
        <div
          className={`p-8 rounded-3xl border text-center space-y-4 ${
            isPassed
              ? 'bg-linear-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-slate-900 border-emerald-200 dark:border-emerald-800/60'
              : 'bg-linear-to-b from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-900 border-amber-200 dark:border-amber-800/60'
          }`}
        >
          <div
            className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
              isPassed
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
            }`}
          >
            {isPassed ? <Trophy className="w-8 h-8" /> : <TrendingUp className="w-8 h-8" />}
          </div>

          <div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                isPassed
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300'
              }`}
            >
              {isPassed ? 'TECHNICAL INTERVIEW CLEARED' : 'INTERVIEW REVIEW & RETAKE AVAILABLE'}
            </span>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {isPassed ? 'Outstanding Engineering Performance!' : 'Good Effort — Target Weak Areas on Retake'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mt-1">
              Domain: <span className="font-semibold text-slate-900 dark:text-white">{selectedDomainMeta.name}</span> | Completed 30 Multi-Level Live Questions.
            </p>
          </div>

          <div className="inline-flex items-center justify-center gap-6 px-8 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white">
                {session.overall_score || 80}%
              </div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Composite Score</div>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
            <div>
              <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                {session.responses.length}/30
              </div>
              <div className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Questions Answered</div>
            </div>
          </div>
        </div>

        {/* 3-Level Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Level 1: Basic
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{scores.level1}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: `${scores.level1}%` }} />
            </div>
            <p className="text-[11px] text-slate-500">Core definitions, basic syntax & lifecycles</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Level 2: Intermediate
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{scores.level2}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full transition-all" style={{ width: `${scores.level2}%` }} />
            </div>
            <p className="text-[11px] text-slate-500">Architecture reasoning, output & debugging</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Level 3: Practical
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{scores.level3}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${scores.level3}%` }} />
            </div>
            <p className="text-[11px] text-slate-500">Practical coding problems & production design</p>
          </div>
        </div>

        {/* 5-Dimensional Competency Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Candidate Evaluation Competency Matrix</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-1">Technical Knowledge</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{metrics.technical_knowledge}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-1">Concept Mastery</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{metrics.concept_understanding}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-1">Problem Solving</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{metrics.problem_solving}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-1">Communication</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{metrics.communication}%</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-1">Confidence Score</div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{metrics.confidence_level}%</div>
            </div>
          </div>
        </div>

        {/* Question Review Accordion */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Complete Interview Step-by-Step Transcript</h3>
          <div className="space-y-3">
            {session.responses.map((resp, idx) => {
              const qObj = session.questions[idx];
              const evalObj = resp.evaluation;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          Q{idx + 1} ({qObj?.level_name || (idx < 10 ? 'Level 1' : idx < 20 ? 'Level 2' : 'Level 3')})
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">{qObj?.topic || 'Core Concept'}</span>
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{resp.question}</h4>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                        (evalObj?.score || 0) >= 75
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : (evalObj?.score || 0) >= 45
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}
                    >
                      {evalObj?.score || 0}% • {evalObj?.verbal_status || 'EVALUATED'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">Your Submission ({resp.response_type}): </span>
                    <pre className="mt-1 font-mono text-xs whitespace-pre-wrap">{resp.response}</pre>
                  </div>

                  {evalObj?.improved_answer && (
                    <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300">
                      <span className="font-semibold text-blue-950 dark:text-blue-200">Senior Model Answer: </span>
                      <p className="mt-0.5">{evalObj.improved_answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <button
            id="btn-retake-technical"
            onClick={() => handleStartInterview(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Interview (Target Weak Areas)</span>
          </button>

          {isPassed ? (
            <button
              id="btn-proceed-hr-round"
              onClick={onProceedHR}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Proceed to HR Behavioral Round</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-back-domain-selector"
              onClick={() => setSession(null)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition flex items-center justify-center space-x-2"
            >
              <span>Switch Domain / Try Again</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 3: LIVE AI INTERVIEW ROOM (ACTIVE SESSION)
  // ----------------------------------------------------
  const currentIdx = session.current_question_index;
  const currentQ: TechnicalQuestion = session.questions[currentIdx] || session.questions[0];
  const isCodingQuestion = currentQ.type === 'coding';
  const currentLevel = session.current_level || (currentIdx < 10 ? 1 : currentIdx < 20 ? 2 : 3);
  const currentLevelName =
    currentLevel === 1 ? 'Level 1 — Basic' : currentLevel === 2 ? 'Level 2 — Intermediate' : 'Level 3 — Practical';
  const levelProgressIndex = (currentIdx % 10) + 1;

  return (
    <div id="live-technical-interview-room" className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 pb-20 sm:pb-6 space-y-4 sm:space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
            {selectedDomainMeta.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{selectedDomainMeta.name}</h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {currentLevelName}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Question {currentIdx + 1} of 30 ({levelProgressIndex}/10 in this level)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Audio Feedback Toggle */}
          <button
            id="btn-toggle-interviewer-audio"
            onClick={() => setIsAudioFeedbackEnabled(!isAudioFeedbackEnabled)}
            className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
              isAudioFeedbackEnabled
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400'
                : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
            title="Toggle AI Interviewer Spoken Voice"
          >
            {isAudioFeedbackEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">{isAudioFeedbackEnabled ? 'Voice ON' : 'Voice Muted'}</span>
          </button>

          {/* Time indicator */}
          <div className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {Math.floor(timeSpentSeconds / 60)}:{(timeSpentSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>

          <button
            id="btn-reset-interview"
            onClick={handleResetInterview}
            disabled={isResetting}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            title="Reset Interview Session"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split Grid: Interviewer + Candidate Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column: AI Interviewer Video & Live Question Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* AI Interviewer Avatar & Speech Stream */}
          <div className="relative p-4 sm:p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white overflow-hidden shadow-lg">
            {/* Animated Glow Halo when speaking */}
            <div
              className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-3xl transition-opacity duration-700 ${
                isSpeakingInterviewer ? 'bg-blue-500/20 opacity-100' : 'bg-slate-500/10 opacity-30'
              }`}
            />

            <div className="relative z-10 flex items-start space-x-3 sm:space-x-4">
              {/* Interviewer Visual Pulse Avatar */}
              <div className="relative shrink-0">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
                    isSpeakingInterviewer
                      ? 'bg-linear-to-tr from-blue-600 to-cyan-500 ring-4 ring-blue-500/30 scale-105'
                      : 'bg-slate-800 border border-slate-700'
                  }`}
                >
                  <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                {isSpeakingInterviewer && (
                  <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500" />
                  </span>
                )}
              </div>

              {/* Interviewer Status & Question Content */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Senior AI Interviewer
                    </span>
                    {isSpeakingInterviewer && (
                      <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 animate-pulse">
                        Speaking...
                      </span>
                    )}
                    {isCodingQuestion ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                        <Code2 className="w-3 h-3" /> Coding Question
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" /> Theory Question
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => speakInterviewerQuestion(currentQ.question)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition text-xs flex items-center gap-1 shrink-0"
                    title="Replay Audio Question"
                  >
                    <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-[10px] sm:text-[11px]">Replay</span>
                  </button>
                </div>

                <div className="text-sm sm:text-base md:text-lg font-medium text-slate-100 leading-relaxed">
                  {currentQ.question}
                </div>
              </div>
            </div>

            {/* Code Snippet Display (if intermediate code output / debugging) */}
            {currentQ.code_snippet_display && (
              <div className="mt-4 p-3 sm:p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-[11px] sm:text-xs text-cyan-300 overflow-x-auto">
                <pre>{currentQ.code_snippet_display}</pre>
              </div>
            )}

            {/* Expected Focus Point Drawer */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition text-xs"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Hide Key Focus Points' : 'View Key Focus Points'}</span>
              </button>

              <span className="text-[11px] text-slate-500">
                Difficulty: <span className="text-slate-300 font-medium">{currentQ.difficulty}</span>
              </span>
            </div>

            {showHint && currentQ.expected_key_points && currentQ.expected_key_points.length > 0 && (
              <div className="mt-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-1">
                <div className="font-semibold text-cyan-300 text-[11px] uppercase tracking-wider">
                  Target Competencies for this Question:
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                  {currentQ.expected_key_points.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Candidate Webcam & Audio Preview */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="relative w-28 h-20 sm:w-32 sm:h-22 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0 flex items-center justify-center">
                {isCameraLoading ? (
                  <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400 text-[10px] space-y-1">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span>Connecting cam...</span>
                  </div>
                ) : isCameraActive ? (
                  <video
                    ref={bindVideoElement}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-[10px] p-2 text-center">
                    <VideoOff className="w-4 h-4 mb-0.5" />
                    <span>Camera Off</span>
                  </div>
                )}
                {isCameraActive && !isCameraLoading && (
                  <div className="absolute bottom-1 left-1.5 flex items-center space-x-1 bg-slate-950/70 px-1 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[8px] font-semibold text-white/90">LIVE</span>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">Candidate Video Stream</h4>
                  {isCameraActive && !isCameraLoading && (
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                      ON
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[220px] sm:max-w-xs">
                  {cameraError ? (
                    <span className="text-amber-500 dark:text-amber-400">{cameraError}</span>
                  ) : isRecording ? (
                    'Listening to speech...'
                  ) : (
                    'Proctored candidate video feed'
                  )}
                </p>
                <div className="flex items-center space-x-2 mt-1.5">
                  <button
                    id="btn-toggle-candidate-camera"
                    onClick={toggleCamera}
                    disabled={isCameraLoading}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 ${
                      isCameraActive
                        ? 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'
                    }`}
                  >
                    {isCameraActive ? (
                      <>
                        <VideoOff className="w-3 h-3" /> Turn Off Cam
                      </>
                    ) : (
                      <>
                        <Video className="w-3 h-3 text-blue-500" /> Enable Camera
                      </>
                    )}
                  </button>
                  {cameraError && (
                    <button
                      onClick={startCamera}
                      className="text-[10px] text-blue-500 hover:underline font-medium"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Voice Audio Waveform */}
            <div className="flex items-center justify-between sm:justify-end space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Microphone</span>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {isRecording ? 'Active Stream' : 'Ready'}
                </div>
              </div>
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center ${
                  isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                <Mic className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Candidate Interactive Workspace & Submit (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-auto sm:min-h-[480px]">
            <div className="space-y-4">
              {/* Mode Selector Tabs */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none w-full sm:w-auto">
                  {/* Code Editor Tab - EXCLUSIVELY rendered for hands-on coding questions */}
                  {isCodingQuestion && (
                    <button
                      id="tab-mode-code"
                      onClick={() => setResponseMode('code')}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                        responseMode === 'code'
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Code Editor</span>
                    </button>
                  )}

                  <button
                    id="tab-mode-voice"
                    onClick={() => setResponseMode('voice')}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                      responseMode === 'voice' || (!isCodingQuestion && responseMode === 'code')
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>{isCodingQuestion ? 'Voice Notes' : 'Voice Answer'}</span>
                  </button>

                  <button
                    id="tab-mode-text"
                    onClick={() => setResponseMode('text')}
                    className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                      responseMode === 'text'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{isCodingQuestion ? 'Written Notes' : 'Written Explanation'}</span>
                  </button>
                </div>

                {/* Question Type Indicator */}
                <div className="hidden sm:flex items-center text-[11px]">
                  {isCodingQuestion ? (
                    <span className="px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <Code2 className="w-3 h-3" /> Coding Question
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Theory Question
                    </span>
                  )}
                </div>
              </div>

              {/* Workspace Content based on active tab */}
              {(responseMode === 'voice' || (!isCodingQuestion && responseMode === 'code')) && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {isCodingQuestion ? 'Voice Audio Notes & Logic' : 'Live Speech Transcript (Voice Answer)'}
                    </span>
                    <button
                      id="btn-toggle-recording"
                      onClick={toggleRecording}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                        isRecording
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-3.5 h-3.5" />
                          <span>Stop Recording</span>
                        </>
                      ) : (
                        <>
                          <Mic className="w-3.5 h-3.5" />
                          <span>Start Voice</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <textarea
                      id="textarea-voice-transcript"
                      value={textResponse}
                      onChange={(e) => setTextResponse(e.target.value)}
                      placeholder={
                        isRecording
                          ? 'Listening to your microphone... Speak clearly and articulate your technical reasoning...'
                          : 'Click Start Voice to speak, or edit your transcript text directly here.'
                      }
                      rows={6}
                      className="w-full p-3.5 text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none font-sans"
                    />
                    {isRecording && (
                      <div className="absolute bottom-3 right-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-[10px] font-bold text-rose-600 dark:text-rose-400 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>RECORDING</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {responseMode === 'text' && (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isCodingQuestion ? 'Written Notes & Edge Cases' : 'Comprehensive Theoretical & Technical Explanation'}
                  </label>
                  <textarea
                    id="textarea-text-response"
                    value={textResponse}
                    onChange={(e) => setTextResponse(e.target.value)}
                    placeholder={
                      isCodingQuestion
                        ? 'Explain your algorithm complexity, assumptions, and edge case handling...'
                        : 'Write a clear, structured technical explanation detailing principles, tradeoffs, and execution steps...'
                    }
                    rows={6}
                    className="w-full p-3.5 text-sm rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                  />
                </div>
              )}

              {responseMode === 'code' && isCodingQuestion && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Code Workspace ({currentQ.language || 'TypeScript / JavaScript'})
                    </span>
                    <button
                      onClick={() => setCodeSnippet(currentQ.code_template || '')}
                      className="text-[11px] text-slate-400 hover:text-blue-500 transition"
                    >
                      Reset Template
                    </button>
                  </div>
                  <textarea
                    id="textarea-code-editor"
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    placeholder="// Write your algorithmic or systems implementation..."
                    rows={8}
                    className="w-full p-3.5 font-mono text-xs rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-cyan-300 placeholder:text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 resize-none"
                  />
                </div>
              )}
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between gap-2">
              <span className="text-[11px] text-slate-400 truncate">
                {currentIdx < 29 ? `Next: Q${currentIdx + 2}` : 'Final Submission'}
              </span>

              <button
                id="btn-submit-answer"
                onClick={handleSubmitAnswer}
                disabled={isSubmitting}
                className="px-5 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white shadow-md transition flex items-center space-x-2 disabled:opacity-50 shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Answer</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* REAL-TIME AI INTERVIEWER FEEDBACK MODAL / DRAWER     */}
      {/* ---------------------------------------------------- */}
      {showStepFeedbackModal && latestEval && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-7 md:p-8 space-y-4 sm:space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Status Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-bold text-sm ${
                    latestEval.verbal_status === 'CORRECT'
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                      : latestEval.verbal_status === 'PARTIALLY CORRECT'
                      ? 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                      : 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
                  }`}
                >
                  {latestEval.score}%
                </div>
                <div>
                  <span
                    className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                      latestEval.verbal_status === 'CORRECT'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : latestEval.verbal_status === 'PARTIALLY CORRECT'
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {latestEval.verbal_status || 'EVALUATED'}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                    Live Interviewer Evaluation
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[11px] font-semibold text-slate-500">Confidence</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">
                  {latestEval.confidence_score || 80}%
                </div>
              </div>
            </div>

            {/* Natural Interviewer Spoken Reaction */}
            {latestEval.spoken_response && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-start space-x-3">
                <Brain className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] sm:text-[11px] font-bold uppercase text-blue-700 dark:text-blue-300">
                    Interviewer Remarks:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
                    "{latestEval.spoken_response}"
                  </p>
                </div>
              </div>
            )}

            {/* What you got right / what you missed */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Points Covered</span>
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc list-inside space-y-1">
                  {(latestEval.what_you_got_right && latestEval.what_you_got_right.length > 0
                    ? latestEval.what_you_got_right
                    : latestEval.strengths || ['Demonstrated sound understanding']
                  ).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>Missed Nuances / Edge Cases</span>
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-300 list-disc list-inside space-y-1">
                  {(latestEval.what_you_missed && latestEval.what_you_missed.length > 0
                    ? latestEval.what_you_missed
                    : latestEval.weaknesses || ['Could elaborate on asymptotic complexity']
                  ).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Improved Senior Model Answer */}
            {latestEval.improved_answer && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 text-cyan-300 font-sans text-xs space-y-1">
                <div className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                  Senior Engineer Model Answer:
                </div>
                <p className="text-slate-200 leading-relaxed">{latestEval.improved_answer}</p>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-end pt-2">
              <button
                id="btn-proceed-feedback-next"
                onClick={handleProceedNext}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-500 text-white shadow-md transition flex items-center justify-center space-x-2"
              >
                <span>{currentIdx < 29 ? 'Proceed to Next Question' : 'View Final Interview Evaluation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
