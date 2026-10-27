import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Radio, Mic, RotateCcw, User, Check, Bot } from 'lucide-react';
import { SpeechService } from '../utils/speech';

export interface AIAvatarInterviewerProps {
  interviewerName?: string;
  interviewerTitle?: string;
  isSpeaking: boolean;
  isListening?: boolean;
  isThinking?: boolean;
  questionText: string;
  onRepeatQuestion?: () => void;
}

type PersonaId = 'sarah' | 'david' | 'elena';

interface Persona {
  id: PersonaId;
  name: string;
  title: string;
  gender: 'female' | 'male';
  accent: string;
}

const PERSONAS: Persona[] = [
  {
    id: 'sarah',
    name: 'Sarah Vance',
    title: 'Senior Talent Acquisition Lead',
    gender: 'female',
    accent: 'Warm & Professional',
  },
  {
    id: 'david',
    name: 'David Chen',
    title: 'Principal Technical Recruiter',
    gender: 'male',
    accent: 'Analytical & Direct',
  },
  {
    id: 'elena',
    name: 'Elena Torres',
    title: 'VP of People Operations',
    gender: 'female',
    accent: 'Executive & Strategic',
  },
];

export const AIAvatarInterviewer: React.FC<AIAvatarInterviewerProps> = ({
  interviewerName,
  interviewerTitle,
  isSpeaking,
  isListening = false,
  isThinking = false,
  questionText,
  onRepeatQuestion,
}) => {
  const [localSpeaking, setLocalSpeaking] = useState<boolean>(isSpeaking);
  const [selectedPersonaId, setSelectedPersonaId] = useState<PersonaId>('sarah');
  const [showPersonaSelector, setShowPersonaSelector] = useState<boolean>(false);

  const activePersona = PERSONAS.find((p) => p.id === selectedPersonaId) || PERSONAS[0];
  const displayName = interviewerName || activePersona.name;
  const displayTitle = interviewerTitle || activePersona.title;

  useEffect(() => {
    setLocalSpeaking(isSpeaking);
  }, [isSpeaking]);

  const handleSpeakToggle = () => {
    if (localSpeaking) {
      SpeechService.stopSpeaking();
      setLocalSpeaking(false);
    } else {
      setLocalSpeaking(true);
      if (onRepeatQuestion) {
        onRepeatQuestion();
      } else {
        SpeechService.speak(
          questionText,
          () => setLocalSpeaking(false),
          () => setLocalSpeaking(true)
        );
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-500/15 via-purple-500/5 to-transparent pointer-events-none" />

      {/* Embedded CSS for realistic avatar facial expressions and speech lip-sync */}
      <style>{`
        @keyframes avatarBlink {
          0%, 92%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.08); }
        }
        @keyframes avatarMouthTalk {
          0% { transform: scaleY(0.2) scaleX(0.8); }
          25% { transform: scaleY(1.3) scaleX(1.1); }
          50% { transform: scaleY(0.5) scaleX(0.9); }
          75% { transform: scaleY(1.4) scaleX(1.15); }
          100% { transform: scaleY(0.2) scaleX(0.8); }
        }
        @keyframes avatarSubtleBreathe {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }
        @keyframes soundWaveBar {
          0%, 100% { height: 4px; }
          50% { height: 18px; }
        }
        @keyframes pulseGlowRing {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.08); opacity: 0.3; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .animate-avatar-blink {
          animation: avatarBlink 4.2s infinite ease-in-out;
          transform-origin: center;
        }
        .animate-avatar-mouth-talking {
          animation: avatarMouthTalk 0.28s infinite ease-in-out;
          transform-origin: center;
        }
        .animate-avatar-breathe {
          animation: avatarSubtleBreathe 3.5s infinite ease-in-out;
        }
        .animate-soundwave-1 { animation: soundWaveBar 0.5s infinite ease-in-out; }
        .animate-soundwave-2 { animation: soundWaveBar 0.7s infinite ease-in-out 0.1s; }
        .animate-soundwave-3 { animation: soundWaveBar 0.4s infinite ease-in-out 0.2s; }
        .animate-soundwave-4 { animation: soundWaveBar 0.65s infinite ease-in-out 0.15s; }
        .animate-soundwave-5 { animation: soundWaveBar 0.45s infinite ease-in-out 0.05s; }
      `}</style>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-5 relative z-10">
        {/* Virtual Person Interactive Portrait Container */}
        <div className="relative shrink-0 flex flex-col items-center">
          {/* Outer Pulsing Aura when speaking */}
          {localSpeaking && (
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-indigo-500/30 blur-md animate-pulse pointer-events-none" />
          )}

          <div
            onClick={handleSpeakToggle}
            title="Click avatar to hear question aloud"
            className={`w-32 h-36 sm:w-36 sm:h-40 rounded-2xl p-1 cursor-pointer transition-all duration-300 group bg-gradient-to-tr ${
              localSpeaking
                ? 'from-emerald-500 via-cyan-400 to-indigo-600 shadow-xl shadow-emerald-500/30 ring-2 ring-emerald-400/50 scale-[1.02]'
                : isListening
                ? 'from-blue-500 via-cyan-400 to-indigo-600 shadow-xl shadow-cyan-500/20'
                : isThinking
                ? 'from-amber-500 via-purple-500 to-slate-800'
                : 'from-indigo-600 via-purple-600 to-slate-800 hover:shadow-indigo-500/25'
            }`}
          >
            <div className="w-full h-full rounded-xl bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 overflow-hidden relative flex flex-col items-center justify-between border border-white/5">
              {/* Virtual Interviewer Studio Background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900/60 to-slate-950 pointer-events-none" />
              <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[8px] font-mono font-bold text-slate-400 tracking-wider">HD LIVE</span>
              </div>

              {/* High-Fidelity Animated Virtual Person Avatar */}
              <div className="w-full h-full flex items-center justify-center pt-2 animate-avatar-breathe relative">
                {selectedPersonaId === 'sarah' && (
                  <svg
                    viewBox="0 0 160 170"
                    className="w-full h-full max-h-[140px] drop-shadow-2xl"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Soft Studio Lighting Backdrop */}
                    <circle cx="80" cy="70" r="62" fill="url(#sarahGlow)" opacity="0.4" />

                    {/* Defs for Gradients */}
                    <defs>
                      <radialGradient id="sarahGlow" cx="0.5" cy="0.4" r="0.6">
                        <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="sarahBlazer" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                      <linearGradient id="sarahLapel" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#059669" />
                        <stop offset="100%" stopColor="#047857" />
                      </linearGradient>
                      <linearGradient id="sarahSkin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fde2d0" />
                        <stop offset="100%" stopColor="#f0bda2" />
                      </linearGradient>
                      <linearGradient id="sarahHair" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#451a03" />
                        <stop offset="100%" stopColor="#290e03" />
                      </linearGradient>
                    </defs>

                    {/* Shoulders & Business Blazer */}
                    <path
                      d="M20 170 L20 142 C20 128 35 120 54 116 L80 128 L106 116 C125 120 140 128 140 142 L140 170 Z"
                      fill="url(#sarahBlazer)"
                    />
                    {/* Blouse & Teal/Emerald Lapel Collar */}
                    <path d="M60 117 L80 144 L100 117 L92 114 L80 128 L68 114 Z" fill="url(#sarahLapel)" />
                    <path d="M68 115 L80 138 L92 115 Z" fill="#ffffff" opacity="0.9" />

                    {/* Neck */}
                    <path d="M66 88 L66 118 L94 118 L94 88 Z" fill="url(#sarahSkin)" />
                    <path d="M66 104 C74 112 86 112 94 104 L94 118 L66 118 Z" fill="#e2a88e" opacity="0.4" />

                    {/* Back Hair */}
                    <path d="M42 54 C42 30 58 18 80 18 C102 18 118 30 118 54 C118 82 114 112 110 124 C104 100 100 78 100 78 L60 78 C60 78 56 100 50 124 C46 112 42 82 42 54 Z" fill="url(#sarahHair)" />

                    {/* Face Base */}
                    <path
                      d="M52 56 C52 40 64 34 80 34 C96 34 108 40 108 56 C108 80 98 100 80 100 C62 100 52 80 52 56 Z"
                      fill="url(#sarahSkin)"
                    />

                    {/* Eyebrows */}
                    <path d="M59 52 Q67 48 74 53" stroke="#290e03" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M86 53 Q93 48 101 52" stroke="#290e03" strokeWidth="2.2" strokeLinecap="round" />

                    {/* Left Eye with Blinking Animation */}
                    <g className="animate-avatar-blink">
                      <ellipse cx="67" cy="60" rx="5.5" ry="3.5" fill="#ffffff" />
                      <circle cx="67.5" cy="60" r="2.8" fill="#1e3a8a" />
                      <circle cx="68.5" cy="59" r="1" fill="#ffffff" />
                      <path d="M61 58 Q67 55 73 58" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
                    </g>

                    {/* Right Eye with Blinking Animation */}
                    <g className="animate-avatar-blink">
                      <ellipse cx="93" cy="60" rx="5.5" ry="3.5" fill="#ffffff" />
                      <circle cx="92.5" cy="60" r="2.8" fill="#1e3a8a" />
                      <circle cx="93.5" cy="59" r="1" fill="#ffffff" />
                      <path d="M87 58 Q93 55 99 58" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
                    </g>

                    {/* Nose */}
                    <path d="M80 62 L78 72 L83 72" stroke="#d99275" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                    {/* Cheeks - Warm Glow */}
                    <circle cx="61" cy="71" r="5" fill="#fb7185" opacity="0.3" />
                    <circle cx="99" cy="71" r="5" fill="#fb7185" opacity="0.3" />

                    {/* Mouth: Talking Lip-Sync vs Natural Smile */}
                    {localSpeaking ? (
                      <g className="animate-avatar-mouth-talking" style={{ transformOrigin: '80px 84px' }}>
                        <ellipse cx="80" cy="84" rx="7" ry="5.5" fill="#7f1d1d" />
                        <rect x="76" y="80.5" width="8" height="2.5" rx="1" fill="#ffffff" />
                        <ellipse cx="80" cy="86" rx="4.5" ry="2" fill="#e11d48" />
                        <path d="M72 83 Q80 81 88 83" stroke="#b91c1c" strokeWidth="1.2" fill="none" />
                      </g>
                    ) : (
                      <g>
                        <path d="M73 83 Q80 88 87 83" stroke="#b91c1c" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                        <path d="M75 83 Q80 86 85 83" fill="#ffffff" opacity="0.8" />
                      </g>
                    )}

                    {/* Stylized Modern Haircut & Fringe */}
                    <path
                      d="M44 50 C44 28 60 16 80 16 C100 16 116 28 116 50 C116 56 115 65 113 74 C110 52 104 38 92 34 C80 30 68 35 56 44 C48 50 45 60 44 74 C44 65 44 56 44 50 Z"
                      fill="url(#sarahHair)"
                    />
                    <path d="M52 38 Q74 24 94 38" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" fill="none" />

                    {/* Professional Wireless Headset with Mic */}
                    <path d="M47 52 C45 36 60 22 80 22 C100 22 115 36 113 52" stroke="#475569" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                    <rect x="44" y="52" width="6" height="12" rx="3" fill="#334155" />
                    <rect x="110" y="52" width="6" height="12" rx="3" fill="#334155" />
                    {/* Headset Mic Boom curving toward mouth */}
                    <path d="M47 62 Q50 82 72 84" stroke="#64748b" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <circle cx="73" cy="84" r="2.8" fill={localSpeaking ? '#10b981' : '#38bdf8'} />
                    {localSpeaking && <circle cx="73" cy="84" r="4.5" stroke="#34d399" strokeWidth="1" className="animate-ping" opacity="0.75" />}
                  </svg>
                )}

                {selectedPersonaId === 'david' && (
                  <svg
                    viewBox="0 0 160 170"
                    className="w-full h-full max-h-[140px] drop-shadow-2xl"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="80" cy="70" r="62" fill="url(#davidGlow)" opacity="0.4" />
                    <defs>
                      <radialGradient id="davidGlow" cx="0.5" cy="0.4" r="0.6">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="davidSuit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1e293b" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                      <linearGradient id="davidSkin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fed7aa" />
                        <stop offset="100%" stopColor="#fba779" />
                      </linearGradient>
                      <linearGradient id="davidHair" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#18181b" />
                        <stop offset="100%" stopColor="#09090b" />
                      </linearGradient>
                    </defs>

                    {/* Shoulders & Charcoal Blazer */}
                    <path d="M18 170 L18 142 C18 126 34 118 54 114 L80 128 L106 114 C126 118 142 126 142 142 L142 170 Z" fill="url(#davidSuit)" />
                    {/* Oxford Shirt & Deep Navy Tie */}
                    <path d="M66 114 L80 144 L94 114 Z" fill="#e0f2fe" />
                    <path d="M77 122 L83 122 L84 148 L80 156 L76 148 Z" fill="#2563eb" />

                    {/* Neck */}
                    <path d="M66 86 L66 116 L94 116 L94 86 Z" fill="url(#davidSkin)" />
                    <path d="M66 102 C74 110 86 110 94 102 L94 116 L66 116 Z" fill="#ea9264" opacity="0.4" />

                    {/* Head / Face */}
                    <path d="M52 54 C52 38 64 32 80 32 C96 32 108 38 108 54 C108 78 98 98 80 98 C62 98 52 78 52 54 Z" fill="url(#davidSkin)" />

                    {/* Hair - Modern Side Fade */}
                    <path d="M48 48 C48 24 62 16 80 16 C98 16 112 24 112 48 C112 52 110 58 108 58 C108 42 104 30 80 30 C56 30 52 42 52 58 C50 58 48 52 48 48 Z" fill="url(#davidHair)" />

                    {/* Eyebrows */}
                    <path d="M58 50 Q66 46 73 50" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M87 50 Q94 46 102 50" stroke="#09090b" strokeWidth="2.5" strokeLinecap="round" />

                    {/* Eyes with blink */}
                    <g className="animate-avatar-blink">
                      <ellipse cx="66" cy="58" rx="5" ry="3.2" fill="#ffffff" />
                      <circle cx="66.5" cy="58" r="2.5" fill="#262626" />
                      <circle cx="67.5" cy="57" r="1" fill="#ffffff" />
                    </g>
                    <g className="animate-avatar-blink">
                      <ellipse cx="94" cy="58" rx="5" ry="3.2" fill="#ffffff" />
                      <circle cx="93.5" cy="58" r="2.5" fill="#262626" />
                      <circle cx="94.5" cy="57" r="1" fill="#ffffff" />
                    </g>

                    {/* Modern Framed Glasses */}
                    <rect x="58" y="52" width="16" height="12" rx="3" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.8" />
                    <rect x="86" y="52" width="16" height="12" rx="3" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.8" />
                    <path d="M74 57 L86 57" stroke="#38bdf8" strokeWidth="1.5" />
                    <path d="M58 56 L51 54" stroke="#38bdf8" strokeWidth="1.2" />
                    <path d="M102 56 L109 54" stroke="#38bdf8" strokeWidth="1.2" />

                    {/* Nose */}
                    <path d="M80 60 L78 70 L83 70" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                    {/* Mouth */}
                    {localSpeaking ? (
                      <g className="animate-avatar-mouth-talking" style={{ transformOrigin: '80px 82px' }}>
                        <ellipse cx="80" cy="82" rx="6.5" ry="5" fill="#7f1d1d" />
                        <rect x="76" y="79" width="8" height="2" rx="1" fill="#ffffff" />
                        <ellipse cx="80" cy="84" rx="4" ry="1.8" fill="#ef4444" />
                      </g>
                    ) : (
                      <path d="M74 81 Q80 86 86 81" stroke="#991b1b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                    )}

                    {/* Headset */}
                    <path d="M47 50 C45 34 60 20 80 20 C100 20 115 34 113 50" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <rect x="44" y="50" width="5" height="11" rx="2.5" fill="#1e293b" />
                    <path d="M46 58 Q49 78 72 82" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                    <circle cx="73" cy="82" r="2.5" fill={localSpeaking ? '#10b981' : '#38bdf8'} />
                  </svg>
                )}

                {selectedPersonaId === 'elena' && (
                  <svg
                    viewBox="0 0 160 170"
                    className="w-full h-full max-h-[140px] drop-shadow-2xl"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="80" cy="70" r="62" fill="url(#elenaGlow)" opacity="0.4" />
                    <defs>
                      <radialGradient id="elenaGlow" cx="0.5" cy="0.4" r="0.6">
                        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id="elenaBlazer" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4c1d95" />
                        <stop offset="100%" stopColor="#2e1065" />
                      </linearGradient>
                      <linearGradient id="elenaSkin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fcd34d" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                      <linearGradient id="elenaHair" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#311005" />
                        <stop offset="100%" stopColor="#1a0701" />
                      </linearGradient>
                    </defs>

                    {/* Blazer & Silk Camisole */}
                    <path d="M20 170 L20 142 C20 128 35 120 54 116 L80 128 L106 116 C125 120 140 128 140 142 L140 170 Z" fill="url(#elenaBlazer)" />
                    <path d="M64 116 L80 140 L96 116 Z" fill="#fdf4ff" />
                    {/* Pearl Necklace */}
                    <circle cx="73" cy="120" r="2.2" fill="#ffffff" />
                    <circle cx="80" cy="123" r="2.5" fill="#ffffff" />
                    <circle cx="87" cy="120" r="2.2" fill="#ffffff" />

                    {/* Neck */}
                    <path d="M67 88 L67 116 L93 116 L93 88 Z" fill="#fde68a" />

                    {/* Face */}
                    <path d="M52 56 C52 40 64 34 80 34 C96 34 108 40 108 56 C108 80 98 100 80 100 C62 100 52 80 52 56 Z" fill="#fde68a" />

                    {/* Eyes with blink */}
                    <g className="animate-avatar-blink">
                      <ellipse cx="67" cy="60" rx="5.2" ry="3.5" fill="#ffffff" />
                      <circle cx="67.5" cy="60" r="2.6" fill="#15803d" />
                      <circle cx="68.5" cy="59" r="1" fill="#ffffff" />
                      <path d="M61 58 Q67 55 73 58" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                    <g className="animate-avatar-blink">
                      <ellipse cx="93" cy="60" rx="5.2" ry="3.5" fill="#ffffff" />
                      <circle cx="92.5" cy="60" r="2.6" fill="#15803d" />
                      <circle cx="93.5" cy="59" r="1" fill="#ffffff" />
                      <path d="M87 58 Q93 55 99 58" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
                    </g>

                    {/* Nose */}
                    <path d="M80 62 L78 72 L83 72" stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" fill="none" />

                    {/* Mouth */}
                    {localSpeaking ? (
                      <g className="animate-avatar-mouth-talking" style={{ transformOrigin: '80px 84px' }}>
                        <ellipse cx="80" cy="84" rx="7" ry="5" fill="#831843" />
                        <rect x="76" y="81" width="8" height="2" rx="1" fill="#ffffff" />
                        <ellipse cx="80" cy="85.5" rx="4" ry="2" fill="#ec4899" />
                      </g>
                    ) : (
                      <path d="M73 83 Q80 88 87 83" stroke="#9d174d" strokeWidth="2.4" strokeLinecap="round" fill="none" />
                    )}

                    {/* Updo Elegant Hair */}
                    <circle cx="80" cy="22" r="16" fill="url(#elenaHair)" />
                    <path d="M46 54 C46 30 60 20 80 20 C100 20 114 30 114 54 C114 62 110 72 108 72 C108 50 102 36 80 34 C58 36 52 50 52 72 C50 72 46 62 46 54 Z" fill="url(#elenaHair)" />

                    {/* Headset */}
                    <path d="M47 52 C45 36 60 22 80 22 C100 22 115 36 113 52" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <circle cx="73" cy="84" r="2.5" fill={localSpeaking ? '#10b981' : '#c084fc'} />
                  </svg>
                )}
              </div>

              {/* Status Ribbon at bottom of avatar */}
              <div className="w-full bg-slate-950/90 backdrop-blur-md px-2 py-1 flex items-center justify-center gap-1.5 border-t border-slate-800/80 z-20">
                <span
                  className={`w-2 h-2 rounded-full ${
                    localSpeaking
                      ? 'bg-emerald-400 animate-ping'
                      : isThinking
                      ? 'bg-amber-400 animate-pulse'
                      : isListening
                      ? 'bg-cyan-400 animate-pulse'
                      : 'bg-indigo-400'
                  }`}
                />
                <span className="text-[10px] font-extrabold text-white tracking-wider uppercase">
                  {localSpeaking ? 'Speaking' : isThinking ? 'Thinking' : isListening ? 'Listening' : 'Ready'}
                </span>
              </div>
            </div>
          </div>

          {/* Audio Visualizer Wave Bars when speaking */}
          {localSpeaking ? (
            <div className="mt-2 flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-full shadow-lg shadow-emerald-500/20">
              <div className="w-1 bg-emerald-400 rounded-full animate-soundwave-1" />
              <div className="w-1 bg-cyan-400 rounded-full animate-soundwave-2" />
              <div className="w-1 bg-emerald-300 rounded-full animate-soundwave-3" />
              <div className="w-1 bg-cyan-300 rounded-full animate-soundwave-4" />
              <div className="w-1 bg-emerald-400 rounded-full animate-soundwave-5" />
              <span className="text-[9px] font-extrabold text-emerald-300 uppercase tracking-wider ml-1">Live Voice</span>
            </div>
          ) : (
            <button
              onClick={handleSpeakToggle}
              className="mt-2 text-[10px] font-semibold text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <Volume2 className="w-3 h-3" />
              <span>Click avatar to speak</span>
            </button>
          )}

          {/* Quick Persona Switcher Toggle */}
          <div className="mt-2 relative">
            <button
              onClick={() => setShowPersonaSelector(!showPersonaSelector)}
              className="text-[10px] font-medium text-slate-400 hover:text-slate-200 bg-slate-800/60 hover:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700/60 transition-all flex items-center gap-1"
            >
              <Bot className="w-2.5 h-2.5 text-indigo-400" />
              <span>Change Avatar</span>
            </button>

            {showPersonaSelector && (
              <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 z-50 w-44 bg-slate-900 border border-slate-700 rounded-xl p-1.5 shadow-2xl space-y-1">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">Select AI Interviewer</div>
                {PERSONAS.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => {
                      setSelectedPersonaId(persona.id);
                      setShowPersonaSelector(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition-all ${
                      selectedPersonaId === persona.id
                        ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold leading-tight">{persona.name}</div>
                      <div className="text-[9px] text-slate-400">{persona.title.split(' ')[0]} Recruiter</div>
                    </div>
                    {selectedPersonaId === persona.id && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Interviewer Details & Speech Bubble */}
        <div className="flex-1 min-w-0 space-y-3 w-full">
          {/* Header Row: Name, Badge & Audio Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight">{displayName}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" /> Virtual Human AI
                </span>
                {localSpeaking && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 animate-pulse">
                    <Radio className="w-3 h-3 text-emerald-400" /> Speaking Now
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{displayTitle}</p>
            </div>

            {/* Voice Control Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSpeakToggle}
                className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                  localSpeaking
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 shadow-emerald-500/10'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/40 shadow-indigo-600/25 active:scale-95'
                }`}
              >
                {localSpeaking ? <VolumeX className="w-4 h-4 text-emerald-400" /> : <Volume2 className="w-4 h-4" />}
                <span>{localSpeaking ? 'Stop Voice' : 'Ask Question Aloud'}</span>
              </button>

              {onRepeatQuestion && (
                <button
                  onClick={onRepeatQuestion}
                  title="Repeat Question from Start"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Question Speech Bubble with Visual Pointer */}
          <div className="relative">
            <div className="bg-slate-950/90 border border-indigo-500/25 p-4 rounded-2xl shadow-inner relative group">
              {/* Interviewer Speech Tag */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Mic className="w-3 h-3" /> Interviewer Prompt
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {localSpeaking ? 'Audio Playing...' : 'Voice Ready'}
                </span>
              </div>

              {/* The Question Text */}
              <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-serif sm:font-sans font-medium italic">
                "{questionText}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
