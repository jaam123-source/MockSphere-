import React from 'react';
import { AptitudeTopicId } from '../types';

import quantImg from '../assets/images/quant_aptitude_icon_1788876548260.jpg';
import logicalImg from '../assets/images/logical_icon_1788876563933.jpg';
import verbalImg from '../assets/images/verbal_icon_1788876582816.jpg';
import specializedImg from '../assets/images/specialized_icon_1788876598395.jpg';

export const TOPIC_IMAGE_URLS: Record<AptitudeTopicId, string> = {
  quantitative: quantImg,
  logical: logicalImg,
  verbal: verbalImg,
  specialized: specializedImg,
};

// Custom SVG Icons matching the reference image layout precisely
export const QuantitativeVectorIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Glow Background */}
    <circle cx="50" cy="50" r="45" fill="#E0F2FE" opacity="0.6" />
    
    {/* Ruler */}
    <path d="M15 80 L40 80 L15 35 Z" fill="#F59E0B" />
    <path d="M22 70 L30 70 L22 55 Z" fill="#FEF3C7" />
    <line x1="18" y1="75" x2="22" y2="75" stroke="#D97706" strokeWidth="2" />
    <line x1="18" y1="70" x2="25" y2="70" stroke="#D97706" strokeWidth="2" />
    <line x1="18" y1="65" x2="22" y2="65" stroke="#D97706" strokeWidth="2" />

    {/* Bar Chart */}
    <rect x="72" y="55" width="6" height="25" rx="3" fill="#10B981" />
    <rect x="80" y="45" width="6" height="35" rx="3" fill="#F59E0B" />
    <rect x="88" y="38" width="6" height="42" rx="3" fill="#EF4444" />
    <path d="M68 62 Q 78 48 88 30" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
    <path d="M82 28 L90 28 L88 36" fill="#2563EB" stroke="#2563EB" strokeWidth="2" strokeLinejoin="round" />

    {/* Main Blue Calculator */}
    <rect x="28" y="18" width="42" height="62" rx="10" fill="#1E3A8A" />
    <rect x="31" y="21" width="36" height="56" rx="8" fill="#2563EB" />
    {/* Screen */}
    <rect x="35" y="26" width="28" height="13" rx="4" fill="#93C5FD" />
    {/* Buttons */}
    <rect x="35" y="44" width="12" height="12" rx="3" fill="#3B82F6" />
    <text x="41" y="53" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">+</text>

    <rect x="49" y="44" width="12" height="12" rx="3" fill="#10B981" />
    <text x="55" y="52" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">-</text>

    <rect x="35" y="58" width="12" height="12" rx="3" fill="#F59E0B" />
    <text x="41" y="67" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">×</text>

    <rect x="49" y="58" width="12" height="12" rx="3" fill="#8B5CF6" />
    <text x="55" y="66" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">÷</text>
  </svg>
);

export const LogicalVectorIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Glow Background */}
    <circle cx="50" cy="50" r="45" fill="#F3E8FF" opacity="0.6" />

    {/* Purple Puzzle Piece (Left) */}
    <path d="M12 40 h10 v-4 a4 4 0 0 1 8 0 v4 h10 v10 a4 4 0 0 1 0 8 v10 h-28 z" fill="#8B5CF6" />

    {/* Green Puzzle Piece (Right) */}
    <path d="M68 50 h20 v10 a4 4 0 0 1 0 8 v10 h-10 v4 a4 4 0 0 1-8 0 v-4 h-2 z" fill="#10B981" />

    {/* Pink Brain */}
    <path
      d="M32 55 C25 50 25 38 35 36 C35 30 45 28 50 34 C55 28 65 30 65 36 C75 38 75 50 68 55 C72 65 62 75 50 72 C38 75 28 65 32 55 Z"
      fill="#F43F5E"
    />
    <path d="M50 35 V 70" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M40 45 Q 46 52 40 60" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M60 45 Q 54 52 60 60" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Lightbulb (Top) */}
    <circle cx="50" cy="22" r="10" fill="#FBBF24" />
    <rect x="47" y="30" width="6" height="4" rx="1" fill="#D97706" />
    <line x1="50" y1="8" x2="50" y2="4" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="38" y1="12" x2="34" y2="9" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="62" y1="12" x2="66" y2="9" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const VerbalVectorIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Glow Background */}
    <circle cx="50" cy="50" r="45" fill="#ECFDF5" opacity="0.6" />

    {/* Open Book */}
    <path d="M18 45 C 32 40, 48 44, 50 48 C 52 44, 68 40, 82 45 L 82 78 C 68 73, 52 77, 50 80 C 48 77, 32 73, 18 78 Z" fill="#1D4ED8" />
    <path d="M21 47 C 33 43, 47 46, 49 49 L 49 77 C 47 74, 33 71, 21 75 Z" fill="#FFFFFF" />
    <path d="M79 47 C 67 43, 53 46, 51 49 L 51 77 C 53 74, 67 71, 79 75 Z" fill="#F8FAFC" />

    {/* Book lines */}
    <line x1="26" y1="54" x2="43" y2="52" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    <line x1="26" y1="60" x2="41" y2="58" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    <line x1="26" y1="66" x2="38" y2="64" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

    {/* Speech Bubble */}
    <rect x="52" y="16" width="30" height="20" rx="8" fill="#2563EB" />
    <path d="M58 36 L 54 42 L 64 36 Z" fill="#2563EB" />
    <circle cx="61" cy="26" r="2" fill="white" />
    <circle cx="67" cy="26" r="2" fill="white" />
    <circle cx="73" cy="26" r="2" fill="white" />

    {/* Pencil */}
    <g transform="rotate(-30 65 65)">
      <rect x="58" y="50" width="8" height="24" rx="2" fill="#F59E0B" />
      <path d="M58 74 L 62 82 L 66 74 Z" fill="#FDBA74" />
      <path d="M61 79 L 62 82 L 63 79 Z" fill="#1E293B" />
      <rect x="58" y="46" width="8" height="5" rx="1" fill="#F43F5E" />
    </g>
  </svg>
);

export const SpecializedVectorIcon: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Glow Background */}
    <circle cx="50" cy="50" r="45" fill="#FFF7ED" opacity="0.6" />

    {/* Gear Cog (Bottom Right) */}
    <path
      d="M78 62 L82 58 L86 60 L86 65 L91 67 L94 63 L98 67 L95 71 L97 76 L102 78 L100 84 L95 84 L93 89 L96 93 L91 97 L87 93 L82 94 L80 99 L74 97 L75 92 L70 90 L66 94 L62 90 L65 85 L63 80 L58 78 L60 72 L65 72 L67 67 L64 63 Z"
      fill="#4338CA"
    />
    <circle cx="80" cy="80" r="6" fill="#EEF2FF" />

    {/* Target Bullseye */}
    <circle cx="45" cy="50" r="32" fill="#EF4444" />
    <circle cx="45" cy="50" r="23" fill="#FFFFFF" />
    <circle cx="45" cy="50" r="14" fill="#EF4444" />
    <circle cx="45" cy="50" r="5" fill="#FFFFFF" />

    {/* Dart / Arrow */}
    <path d="M45 50 L 78 20" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" />
    <path d="M72 18 L 84 14 L 80 26 Z" fill="#1D4ED8" />
  </svg>
);

interface TopicIconProps {
  topicId: AptitudeTopicId;
  className?: string;
  useVectorFallback?: boolean;
}

export const AptitudeTopicIcon: React.FC<TopicIconProps> = ({
  topicId,
  className = 'w-10 h-10',
  useVectorFallback = false,
}) => {
  const [imgError, setImgError] = React.useState(false);

  if (useVectorFallback || imgError) {
    switch (topicId) {
      case 'quantitative':
        return <QuantitativeVectorIcon className={className} />;
      case 'logical':
        return <LogicalVectorIcon className={className} />;
      case 'verbal':
        return <VerbalVectorIcon className={className} />;
      case 'specialized':
        return <SpecializedVectorIcon className={className} />;
      default:
        return null;
    }
  }

  return (
    <img
      src={TOPIC_IMAGE_URLS[topicId]}
      alt={`${topicId} icon`}
      onError={() => setImgError(true)}
      referrerPolicy="no-referrer"
      className={`${className} object-contain filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105`}
    />
  );
};
