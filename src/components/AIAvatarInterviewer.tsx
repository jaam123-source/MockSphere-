import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, UserCheck, Radio, Mic } from 'lucide-react';
import { SpeechService } from '../utils/speech';

interface AIAvatarInterviewerProps {
  interviewerName?: string;
  interviewerTitle?: string;
  isSpeaking: boolean;
  isListening?: boolean;
  isThinking?: boolean;
  questionText: string;
  onRepeatQuestion?: () => void;
}

export const AIAvatarInterviewer: React.FC<AIAvatarInterviewerProps> = ({
  interviewerName = 'AI Virtual Interviewer',
  interviewerTitle = 'Automated Technical & Behavioral Assessment Agent',
  isSpeaking,
  isListening = false,
  isThinking = false,
  questionText,
  onRepeatQuestion,
}) => {
  const [localSpeaking, setLocalSpeaking] = useState<boolean>(isSpeaking);

  useEffect(() => {
    setLocalSpeaking(isSpeaking);
  }, [isSpeaking]);

  const handleSpeakToggle = () => {
    if (localSpeaking) {
      SpeechService.stopSpeaking();
      setLocalSpeaking(false);
    } else {
      setLocalSpeaking(true);
      SpeechService.speak(
        questionText,
        () => setLocalSpeaking(false),
        () => setLocalSpeaking(true)
      );
    }
    if (onRepeatQuestion) onRepeatQuestion();
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center gap-5 relative overflow-hidden">
      {/* Background glow & subtle scanlines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

      {/* AI Interviewer Avatar Portrait Container */}
      <div className="relative shrink-0">
        <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-1 bg-gradient-to-tr ${
          localSpeaking ? 'from-emerald-500 via-cyan-400 to-indigo-600 animate-pulse' : 'from-indigo-600 via-purple-600 to-slate-800'
        } shadow-xl shadow-indigo-600/20`}>
          <div className="w-full h-full rounded-xl bg-slate-950 overflow-hidden relative flex items-center justify-center">
            {/* Professional AI Interviewer Avatar Image / SVG Portrait */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/60 to-slate-950 flex flex-col items-center justify-center text-center p-2">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 mb-1 shadow-inner">
                <UserCheck className="w-7 h-7" />
              </div>
              <div className="text-[10px] font-bold text-slate-200 tracking-wide uppercase">AI Lead</div>
            </div>

            {/* Live Status Badge */}
            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-center gap-1 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-800">
              <span className={`w-2 h-2 rounded-full ${
                localSpeaking ? 'bg-emerald-400 animate-ping' : isThinking ? 'bg-amber-400 animate-pulse' : 'bg-indigo-400'
              }`} />
              <span className="text-[9px] font-extrabold text-white tracking-wider uppercase">
                {localSpeaking ? 'Speaking' : isThinking ? 'Thinking' : isListening ? 'Listening' : 'Ready'}
              </span>
            </div>
          </div>
        </div>

        {/* Audio Waveform Effect when speaking */}
        {localSpeaking && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-emerald-500/95 text-slate-950 px-2 py-0.5 rounded-full text-[9px] font-extrabold shadow-lg">
            <Radio className="w-3 h-3 animate-spin" />
            <span>LIVE AUDIO</span>
          </div>
        )}
      </div>

      {/* Interviewer Details & Question Preview */}
      <div className="flex-1 min-w-0 text-center md:text-left space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">{interviewerName}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-300" /> AI Virtual Interviewer
              </span>
            </div>
            <p className="text-xs text-slate-400">{interviewerTitle}</p>
          </div>

          <button
            onClick={handleSpeakToggle}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              localSpeaking
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 animate-pulse'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {localSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{localSpeaking ? 'Stop Audio' : 'Play Question Aloud'}</span>
          </button>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-3.5 rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          <p className="italic text-slate-300">"{questionText}"</p>
        </div>
      </div>
    </div>
  );
};
