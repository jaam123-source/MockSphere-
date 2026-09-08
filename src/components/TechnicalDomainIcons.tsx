import React, { useState } from 'react';
import { TechnicalDomainId } from '../types';

import fullstackImg from '../assets/images/fullstack_domain_icon_1788877559806.jpg';
import genaiImg from '../assets/images/genai_domain_icon_1788877577749.jpg';
import cloudImg from '../assets/images/cloud_domain_icon_1788877593926.jpg';
import datascienceImg from '../assets/images/datascience_domain_icon_1788877609326.jpg';
import cybersecurityImg from '../assets/images/cybersecurity_domain_icon_1788877624292.jpg';

const DOMAIN_IMAGE_MAP: Record<TechnicalDomainId, string> = {
  fullstack: fullstackImg,
  genai: genaiImg,
  cloud: cloudImg,
  datascience: datascienceImg,
  cybersecurity: cybersecurityImg,
};

// Vector SVG Fallbacks designed after the colorful reference image
export const FullStackVectorIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="48" fill="#EBF5FF" />
    {/* Tech Badges */}
    <rect x="22" y="22" width="16" height="16" rx="4" fill="#FF5722" />
    <text x="30" y="33" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">5</text>
    <rect x="42" y="16" width="16" height="16" rx="4" fill="#2196F3" />
    <text x="50" y="27" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle">3</text>
    <rect x="62" y="22" width="16" height="16" rx="4" fill="#FFC107" />
    <text x="70" y="33" fill="#1E293B" fontSize="8" fontWeight="bold" textAnchor="middle">JS</text>
    <rect x="14" y="44" width="16" height="16" rx="4" fill="#61DAFB" />
    <circle cx="22" cy="52" r="4" stroke="#1E293B" strokeWidth="1.5" />
    <rect x="70" y="44" width="16" height="16" rx="4" fill="#4CAF50" />
    <text x="78" y="55" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">JS</text>
    {/* Blue Laptop Base */}
    <rect x="22" y="40" width="56" height="38" rx="5" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
    <rect x="26" y="44" width="48" height="30" rx="3" fill="#1E1B4B" />
    <text x="50" y="63" fill="#60A5FA" fontSize="14" fontStyle="italic" fontWeight="extrabold" textAnchor="middle">&lt;/&gt;</text>
    <path d="M15 80C15 78.3431 16.3431 77 18 77H82C83.6569 77 85 78.3431 85 80V82H15V80Z" fill="#3B82F6" />
  </svg>
);

export const GenAIVectorIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="48" fill="#F3E8FF" />
    {/* Glowing Brain Fans */}
    <path d="M25 45C22 35 30 20 50 20C70 20 78 35 75 45Z" fill="url(#genaiGrad)" />
    <defs>
      <linearGradient id="genaiGrad" x1="25" y1="20" x2="75" y2="45" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3B82F6" />
        <stop offset="0.5" stopColor="#A855F7" />
        <stop offset="1" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <circle cx="36" cy="30" r="2" fill="white" />
    <line x1="36" y1="30" x2="36" y2="40" stroke="white" strokeWidth="2" />
    <circle cx="50" cy="26" r="2" fill="white" />
    <line x1="50" y1="26" x2="50" y2="38" stroke="white" strokeWidth="2" />
    <circle cx="64" cy="30" r="2" fill="white" />
    <line x1="64" y1="30" x2="64" y2="40" stroke="white" strokeWidth="2" />
    {/* Cute Robot Head */}
    <rect x="28" y="44" width="44" height="34" rx="14" fill="#FFFFFF" stroke="#3B82F6" strokeWidth="3" />
    <rect x="34" y="50" width="32" height="22" rx="10" fill="#1E293B" />
    {/* Happy Cute Eyes */}
    <path d="M40 60 Q 44 54 48 60" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M52 60 Q 56 54 60 60" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" fill="none" />
    {/* Antenna */}
    <circle cx="50" cy="40" r="4" fill="#3B82F6" />
    <line x1="50" y1="40" x2="50" y2="44" stroke="#3B82F6" strokeWidth="2" />
    {/* Sparkle Stars */}
    <path d="M80 30L82 35L87 37L82 39L80 44L78 39L73 37L78 35Z" fill="#F59E0B" />
    <path d="M20 50L21 53L24 54L21 55L20 58L19 55L16 54L19 53Z" fill="#F59E0B" />
  </svg>
);

export const CloudVectorIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="48" fill="#E0F2FE" />
    {/* Cloud Body */}
    <path d="M32 50C25 50 20 44 20 37C20 30 25 25 32 25C34 18 42 14 50 14C59 14 67 19 69 27C76 27 82 33 82 40C82 48 76 50 70 50H32Z" fill="#3B82F6" />
    {/* Sync Arrows */}
    <path d="M44 38L44 28M44 28L40 32M44 28L48 32" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M56 28L56 38M56 38L52 34M56 38L60 34" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    {/* Server Hardware Box */}
    <rect x="26" y="56" width="48" height="26" rx="6" fill="#1E293B" stroke="#0284C7" strokeWidth="2" />
    <line x1="26" y1="69" x2="74" y2="69" stroke="#334155" strokeWidth="2" />
    <circle cx="34" cy="62" r="2" fill="#22C55E" />
    <circle cx="40" cy="62" r="2" fill="#3B82F6" />
    <circle cx="34" cy="75" r="2" fill="#22C55E" />
    <circle cx="40" cy="75" r="2" fill="#EAB308" />
  </svg>
);

export const DataScienceVectorIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="48" fill="#DCFCE7" />
    {/* Blue Laptop Screen */}
    <rect x="20" y="24" width="52" height="36" rx="4" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
    <rect x="24" y="28" width="44" height="28" rx="2" fill="#0F172A" />
    {/* Bar Chart Bars */}
    <rect x="28" y="44" width="5" height="8" rx="1" fill="#3B82F6" />
    <rect x="36" y="38" width="5" height="14" rx="1" fill="#22C55E" />
    <rect x="44" y="34" width="5" height="18" rx="1" fill="#EAB308" />
    <rect x="52" y="30" width="5" height="22" rx="1" fill="#F97316" />
    {/* Line Trend */}
    <path d="M28 42L38 36L46 32L54 28" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="54" cy="28" r="2.5" fill="#A855F7" />
    {/* Laptop Base */}
    <path d="M15 60C15 58.5 16.5 57 18 57H74C75.5 57 77 58.5 77 60V62H15V60Z" fill="#3B82F6" />
    {/* 3D Database Cylinders */}
    <ellipse cx="68" cy="62" rx="12" ry="5" fill="#0EA5E9" />
    <rect x="56" y="62" width="24" height="14" fill="#0EA5E9" />
    <ellipse cx="68" cy="76" rx="12" ry="5" fill="#0284C7" />
    <ellipse cx="68" cy="62" rx="12" ry="5" fill="#38BDF8" />
    {/* Magnifying Glass */}
    <circle cx="76" cy="72" r="7" stroke="#6366F1" strokeWidth="3" fill="none" />
    <line x1="81" y1="77" x2="88" y2="84" stroke="#6366F1" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const CybersecurityVectorIcon: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="48" fill="#FCE7F3" />
    {/* Shield Outer */}
    <path d="M50 16L78 28V50C78 68 64 80 50 86C36 80 22 68 22 50V28L50 16Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="2" />
    <path d="M50 20L74 30V49C74 65 62 76 50 81C38 76 26 65 26 49V30L50 20Z" fill="#3B82F6" />
    {/* White Padlock */}
    <rect x="38" y="48" width="24" height="20" rx="4" fill="white" />
    <path d="M43 48V41C43 37.134 46.134 34 50 34C53.866 34 57 37.134 57 41V48" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
    <circle cx="50" cy="56" r="2.5" fill="#1E293B" />
    <line x1="50" y1="58.5" x2="50" y2="63" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
    {/* Orbiting Ring */}
    <ellipse cx="50" cy="54" rx="38" ry="14" stroke="#8B5CF6" strokeWidth="2.5" transform="rotate(-20 50 54)" fill="none" />
    <circle cx="20" cy="62" r="4" fill="#A855F7" />
    <circle cx="80" cy="46" r="4" fill="#A855F7" />
  </svg>
);

interface TechnicalDomainIconProps {
  domainId: TechnicalDomainId;
  className?: string;
}

export const TechnicalDomainIcon: React.FC<TechnicalDomainIconProps> = ({ domainId, className = 'w-full h-full' }) => {
  const [hasError, setHasError] = useState(false);
  const imgSrc = DOMAIN_IMAGE_MAP[domainId];

  if (hasError || !imgSrc) {
    switch (domainId) {
      case 'fullstack':
        return <FullStackVectorIcon className={className} />;
      case 'genai':
        return <GenAIVectorIcon className={className} />;
      case 'cloud':
        return <CloudVectorIcon className={className} />;
      case 'datascience':
        return <DataScienceVectorIcon className={className} />;
      case 'cybersecurity':
        return <CybersecurityVectorIcon className={className} />;
      default:
        return <FullStackVectorIcon className={className} />;
    }
  }

  return (
    <img
      src={imgSrc}
      alt={`${domainId} icon`}
      onError={() => setHasError(true)}
      className={`${className} object-cover`}
      loading="eager"
    />
  );
};
