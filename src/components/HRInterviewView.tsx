import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Users2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Trophy,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Video,
  VideoOff,
  Loader2,
} from 'lucide-react';
import { HRInterviewSession, HRQuestion, UserDashboardState } from '../types';
import { ApiService } from '../services/api';
import { SpeechService } from '../utils/speech';

interface HRInterviewViewProps {
  dashboard: UserDashboardState;
  onBack: () => void;
  onProceedReport: () => void;
  onRefreshDashboard: () => void;
}

export const HRInterviewView: React.FC<HRInterviewViewProps> = ({
  dashboard,
  onBack,
  onProceedReport,
  onRefreshDashboard,
}) => {
  const [session, setSession] = useState<HRInterviewSession | null>(null);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [responseMode, setResponseMode] = useState<'text' | 'voice'>('voice');
  const [textResponse, setTextResponse] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [speechRecognizer, setSpeechRecognizer] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [latestEval, setLatestEval] = useState<any>(null);

  // Webcam stream
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

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

  const startCamera = useCallback(async () => {
    setIsCameraLoading(true);
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported on this device.');
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => {
          try {
            t.stop();
          } catch {}
        });
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640, min: 320 }, height: { ideal: 480, min: 240 }, facingMode: 'user' },
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
        } catch {}
      }
    } catch (err: any) {
      console.warn('HR Camera error:', err);
      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      setCameraError(isDenied ? 'Camera permission denied.' : 'Camera unavailable.');
      setIsCameraActive(false);
    } finally {
      setIsCameraLoading(false);
    }
  }, []);

  const bindVideoElement = useCallback((element: HTMLVideoElement | null) => {
    videoRef.current = element;
    if (element && mediaStreamRef.current && mediaStreamRef.current.active) {
      element.srcObject = mediaStreamRef.current;
      element.muted = true;
      element.play().catch(() => {});
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

  useEffect(() => {
    return () => {
      stopCamera();
      SpeechService.stopSpeaking();
    };
  }, [stopCamera]);

  const handleStartHR = async () => {
    setIsStarting(true);
    try {
      const newSession = await ApiService.startHRInterview();
      setSession(newSession);
      setLatestEval(null);
      setTextResponse('');
      if (newSession?.questions?.[0]) {
        speakQuestion(newSession.questions[0].question);
      }
    } catch (err: any) {
      alert(`Could not start HR Round: ${err.message}`);
    } finally {
      setIsStarting(false);
    }
  };

  const speakQuestion = (text: string) => {
    setIsSpeaking(true);
    SpeechService.speak(
      text,
      () => setIsSpeaking(false),
      () => setIsSpeaking(true)
    );
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (speechRecognizer) {
        try {
          speechRecognizer.stop();
        } catch {}
      }
      setIsRecording(false);
    } else {
      if (!SpeechService.isSpeechRecognitionSupported()) {
        alert('Speech recognition is not natively supported in this browser. Please type your response.');
        return;
      }
      try {
        const recognizer = SpeechService.createSpeechRecognizer(
          (transcript, isFinal) => {
            setTextResponse((prev) => (isFinal ? (prev ? prev + ' ' + transcript : transcript) : prev));
          },
          (err) => {
            console.warn('Voice error:', err);
            setIsRecording(false);
          },
          () => setIsRecording(false)
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

  const currentQ: HRQuestion | undefined =
    session?.questions?.[session?.current_question_index ?? 0] || session?.questions?.[0];

  const handleSubmitStep = async () => {
    if (!session || !currentQ) return;
    if (!textResponse.trim()) {
      alert('Please provide your response before submitting for HR evaluation.');
      return;
    }

    setIsSubmitting(true);
    SpeechService.stopSpeaking();
    setIsSpeaking(false);
    if (isRecording && speechRecognizer) {
      try {
        speechRecognizer.stop();
      } catch {}
      setIsRecording(false);
    }

    try {
      const res = await ApiService.evaluateHRAnswer({
        session_id: session.session_id,
        question_id: currentQ.question_id,
        response_type: responseMode,
        response_text: textResponse,
      });

      setSession(res.session);
      setLatestEval(res.currentEvaluation);
      setTextResponse('');
      onRefreshDashboard();

      if (res.session.status === 'COMPLETED' && res.session.passed) {
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
        });
      } else if (res.session.status === 'IN_PROGRESS') {
        const nextQ = res.session.questions?.[res.session.current_question_index];
        if (nextQ) {
          speakQuestion(nextQ.question);
        }
      }
    } catch (err: any) {
      alert(`HR Evaluation error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------------- INITIAL LAUNCH VIEW ----------------
  if (!session) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8 space-y-6 animate-fadeIn">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={onBack}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
                <Sparkles className="w-3 h-3" /> Stage 4 • AI HR & Behavioral Interview
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Behavioral, Culture & Leadership Evaluation
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Evaluated against the STAR Leadership Framework (Situation, Task, Action, Result) with Voice Interaction.
              </p>
            </div>
          </div>
        </div>

        {/* STAR Framework Explanation Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-5 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Users2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">The STAR Response Methodology</h2>
              <p className="text-xs text-slate-300">Structure your voice/text answers using these 4 pillars:</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 sm:p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-emerald-400">1. Situation</div>
              <div className="text-xs text-slate-300">Set the scene and context of the challenge.</div>
            </div>
            <div className="p-3.5 sm:p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-emerald-400">2. Task</div>
              <div className="text-xs text-slate-300">Explain your specific responsibility & deliverable.</div>
            </div>
            <div className="p-3.5 sm:p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-emerald-400">3. Action</div>
              <div className="text-xs text-slate-300">Describe steps, collaboration, and initiatives you took.</div>
            </div>
            <div className="p-3.5 sm:p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-emerald-400">4. Result</div>
              <div className="text-xs text-slate-300">Highlight quantifiable business or technical outcomes.</div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              3 Structured Questions • Pass Cutoff: <strong className="text-slate-200">{dashboard?.cutoffs?.hrCutoff ?? 70}%</strong>
            </div>
            <button
              id="btn-start-hr-session"
              onClick={handleStartHR}
              disabled={isStarting}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              {isStarting ? (
                'Connecting AI HR Agent...'
              ) : (
                <>
                  <Users2 className="w-4 h-4" /> Start HR Interview <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- COMPLETED VIEW ----------------
  if (session.status === 'COMPLETED') {
    const isPassed = !!session.passed;

    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8 space-y-6 animate-fadeIn">
        <div
          id="hr-interview-complete-card"
          className={`rounded-2xl border p-6 sm:p-8 shadow-2xl text-center space-y-6 ${
            isPassed
              ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 border-emerald-500/40'
              : 'bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/40'
          }`}
        >
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl flex items-center justify-center border shadow-lg ${
              isPassed ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
            }`}
          >
            {isPassed ? <Trophy className="w-8 h-8 sm:w-10 sm:h-10" /> : <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10" />}
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border">
              {isPassed ? (
                <span className="text-emerald-400 border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Stage 4 Complete • Comprehensive Report Ready
                </span>
              ) : (
                <span className="text-rose-400 border-rose-500/20 bg-rose-500/10 px-2 py-0.5 rounded-full">
                  HR Cutoff Not Reached
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isPassed ? 'HR Round Successfully Cleared!' : 'HR Assessment Incomplete'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-1">
              {isPassed
                ? `You achieved an HR communication score of ${session.overall_score}%. All 4 qualification stages are now complete. View your Final Candidate Assessment Report.`
                : `You scored ${session.overall_score}%. Minimum required is ${dashboard?.cutoffs?.hrCutoff ?? 70}%. Review feedback and re-attempt.`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xs mx-auto">
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">HR Score</div>
              <div className={`text-xl sm:text-2xl font-bold ${isPassed ? 'text-emerald-400' : 'text-rose-400'}`}>
                {session.overall_score}%
              </div>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <div className="text-xs text-slate-400 font-medium">Verdict</div>
              <div className="text-xs sm:text-sm font-bold text-slate-200">
                {isPassed ? 'Recommended' : 'Needs Practice'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
            {isPassed ? (
              <button
                id="btn-view-final-report"
                onClick={onProceedReport}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                View Final Candidate Report <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setSession(null)}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <RotateCcw className="w-4 h-4" /> Retake HR Round
              </button>
            )}

            <button
              onClick={onBack}
              className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl border border-slate-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- ACTIVE HR INTERVIEW STEP ----------------
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-8 space-y-4 sm:space-y-6 animate-fadeIn">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <button
            onClick={() => setSession(null)}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Exit Interview
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">AI HR Behavioral Interview</h1>
            <span className="text-[11px] sm:text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
              Question {session.current_question_index + 1} of {session.total_questions}
            </span>
          </div>
        </div>

        <button
          onClick={() => currentQ && speakQuestion(currentQ.question)}
          className={`p-2 sm:p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
            isSpeaking
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
              : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isSpeaking ? 'Stop Audio' : 'Play Question'}</span>
        </button>
      </div>

      {/* AI HR Question Prompt */}
      {currentQ && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 sm:p-8 shadow-xl space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
              Category: {currentQ.category}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400">Response Mode: <strong>{responseMode.toUpperCase()}</strong></span>
          </div>

          <h2 className="text-base sm:text-xl font-bold text-white leading-relaxed">
            {currentQ.question}
          </h2>

          <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Interviewer Intent: </strong>{currentQ.intent}</span>
          </div>
        </div>
      )}

      {/* Candidate Webcam & Proctored Stream */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="relative w-28 h-20 sm:w-32 sm:h-22 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0 flex items-center justify-center">
            {isCameraLoading ? (
              <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400 text-[10px] space-y-1">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
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
              <h4 className="text-xs font-semibold text-white truncate">Candidate Video Stream</h4>
              {isCameraActive && !isCameraLoading && (
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  ON
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[220px] sm:max-w-xs">
              {cameraError ? (
                <span className="text-amber-400">{cameraError}</span>
              ) : isRecording ? (
                'Listening to speech...'
              ) : (
                'Proctored candidate video feed'
              )}
            </p>
            <div className="flex items-center space-x-2 mt-1.5">
              <button
                id="btn-toggle-hr-camera"
                onClick={toggleCamera}
                disabled={isCameraLoading}
                className={`px-2.5 py-1 rounded-md text-[10px] font-medium border transition flex items-center gap-1 ${
                  isCameraActive
                    ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                }`}
              >
                {isCameraActive ? (
                  <>
                    <VideoOff className="w-3 h-3" /> Turn Off Cam
                  </>
                ) : (
                  <>
                    <Video className="w-3 h-3 text-emerald-400" /> Enable Camera
                  </>
                )}
              </button>
              {cameraError && (
                <button
                  onClick={startCamera}
                  className="text-[10px] text-emerald-400 hover:underline font-medium"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Microphone</span>
            <div className="text-xs font-bold text-slate-300">
              {isRecording ? 'Active Stream' : 'Ready'}
            </div>
          </div>
          <div
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center ${
              isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Mic className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Response Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setResponseMode('voice')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            responseMode === 'voice'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Mic className="w-3.5 h-3.5" /> Voice Answer
        </button>

        <button
          onClick={() => setResponseMode('text')}
          className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            responseMode === 'text'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Written Response
        </button>
      </div>

      {/* Input Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
        {responseMode === 'voice' && (
          <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-b from-rose-950/20 to-slate-950 border border-rose-500/20 text-center space-y-3 sm:space-y-4">
            <div className="flex justify-center">
              <button
                id="btn-hr-voice-recorder"
                onClick={toggleRecording}
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-xl transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-bounce ring-4 ring-rose-500/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-rose-400 border border-rose-500/30'
                }`}
              >
                {isRecording ? <MicOff className="w-6 h-6 sm:w-7 sm:h-7" /> : <Mic className="w-6 h-6 sm:w-7 sm:h-7" />}
              </button>
            </div>

            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-100">
                {isRecording ? 'Recording your voice... Speak naturally' : 'Click microphone to record your spoken response'}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                Transcribed live in real-time. Edit or add further context below.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Your Response Transcript (STAR Structure):
          </label>
          <textarea
            id="hr-response-textarea"
            rows={5}
            value={textResponse}
            onChange={(e) => setTextResponse(e.target.value)}
            placeholder="Structure your answer: Situation -> Task -> Action -> Result..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 text-center sm:text-left">Evaluates storytelling, clarity, empathy, and leadership presence.</span>
          <button
            id="btn-submit-hr-step"
            onClick={handleSubmitStep}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            {isSubmitting ? (
              'AI Evaluating...'
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Submit Response
              </>
            )}
          </button>
        </div>
      </div>

      {/* Latest Evaluation Feedback Card */}
      {latestEval && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> HR Evaluation & Feedback
            </span>
            <div className="text-right">
              <span className="text-xs text-slate-400">Score: </span>
              <strong className="text-base sm:text-lg text-emerald-400">{latestEval.score}/100</strong>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-950/80 p-3.5 sm:p-4 rounded-xl border border-slate-800">
            {latestEval.feedback}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs">
            {latestEval.strengths?.length > 0 && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-1">
                <div className="font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Communication Strengths:
                </div>
                <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                  {latestEval.strengths.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {latestEval.weaknesses?.length > 0 && (
              <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl space-y-1">
                <div className="font-bold text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Improvement Opportunities:
                </div>
                <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                  {latestEval.weaknesses.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
