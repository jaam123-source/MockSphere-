import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Mail,
  X,
  Send,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Globe,
  Lock,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { ApiService } from '../services/api';

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'contact' | null>(null);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);

    const nameTrimmed = contactName.trim();
    const emailTrimmed = contactEmail.trim().toLowerCase();
    const messageTrimmed = contactMessage.trim();

    // Frontend Validations
    if (!nameTrimmed || nameTrimmed.length < 2) {
      setContactError('Please enter your name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrimmed || !emailRegex.test(emailTrimmed)) {
      setContactError('Please enter a valid email address.');
      return;
    }

    if (!messageTrimmed || messageTrimmed.length < 10) {
      setContactError('Please write a message with at least 10 characters.');
      return;
    }

    setIsSending(true);

    try {
      const response = await ApiService.sendContactForm({
        name: nameTrimmed,
        email: emailTrimmed,
        subject: contactSubject,
        message: messageTrimmed,
      });

      if (response.success) {
        setContactSuccess(true);
        setContactName('');
        setContactEmail('');
        setContactMessage('');
      } else {
        setContactError(response.error || 'Failed to send message. Please check your network and try again.');
      }
    } catch (err: any) {
      console.error('Contact Form Send Error:', err);
      setContactError(err.message || 'Unable to connect to contact service. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleOpenModal = (modal: 'privacy' | 'terms' | 'contact') => {
    setActiveModal(modal);
    if (modal === 'contact') {
      setContactError(null);
    }
  };

  return (
    <>
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md py-6 px-4 sm:px-8 mb-16 lg:mb-0 print:hidden text-slate-600 dark:text-slate-400 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-5 sm:space-y-4">
          {/* Main Footer Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-5 md:gap-4 text-center md:text-left">
            {/* Left: Brand & Tagline */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs shrink-0">
                  M
                </div>
                <span className="font-extrabold text-lg sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  Mock Sphere
                </span>
              </div>
              <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 px-3.5 py-1.2 rounded-full inline-flex items-center gap-1.5 shadow-2xs max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">AI Virtual Interview Trainer</span>
              </span>
            </div>

            {/* Right: Essential Legal & Support Links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
              <button
                id="btn-footer-privacy"
                onClick={() => handleOpenModal('privacy')}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5 py-1 px-1.5 rounded-lg active:bg-slate-100 dark:active:bg-slate-800"
              >
                <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Privacy Policy</span>
              </button>

              <button
                id="btn-footer-terms"
                onClick={() => handleOpenModal('terms')}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5 py-1 px-1.5 rounded-lg active:bg-slate-100 dark:active:bg-slate-800"
              >
                <FileText className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                <span>Terms & Conditions</span>
              </button>

              <button
                id="btn-footer-contact"
                onClick={() => handleOpenModal('contact')}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1.5 py-1 px-1.5 rounded-lg active:bg-slate-100 dark:active:bg-slate-800"
              >
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Contact Us</span>
              </button>
            </nav>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-200/80 dark:bg-slate-800" />

          {/* Sub-Footer Row: Simple Centered Copyright Line */}
          <div className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide px-2">
            © 2026 Mock Sphere. All rights reserved.
          </div>
        </div>
      </footer>

      {/* PRIVACY POLICY MODAL */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Privacy Policy</h3>
                  <p className="text-xs text-slate-500">Effective Date: January 1, 2026</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <section className="space-y-1.5">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-500" /> Data Collection & Purpose
                </h4>
                <p>
                  Mock-Sphere collects assessment telemetry, aptitude responses, speech transcripts, and evaluation metrics solely to provide real-time interview feedback, skill proficiency breakdown, and score reports.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" /> Audio & Speech Privacy
                </h4>
                <p>
                  Voice inputs during technical and HR behavioral interviews are processed in real-time for speech-to-text conversion. Raw audio streams are never stored permanently or used for external model training without explicit consent.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Information Security
                </h4>
                <p>
                  Candidate assessment data and performance histories are stored with end-to-end encryption. You retain complete right to delete your assessment session logs at any time.
                </p>
              </section>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Close & Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TERMS & CONDITIONS MODAL */}
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Terms & Conditions</h3>
                  <p className="text-xs text-slate-500">Last Updated: 2026 Edition</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <section className="space-y-1.5">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">1. Acceptance of Platform Terms</h4>
                <p>
                  By accessing Mock-Sphere, candidates agree to engage in fair practice assessments. Our automated scoring algorithms provide diagnostic feedback designed for learning and skill development.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">2. AI Evaluation Guidelines</h4>
                <p>
                  Feedback generated during technical and HR interviews utilizes natural language evaluation powered by state-of-the-art AI models. Score reports are advisory benchmarks for career readiness.
                </p>
              </section>

              <section className="space-y-1.5">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">3. User Integrity & Academic Honesty</h4>
                <p>
                  Candidates are encouraged to complete level tests and timed assessments independently to achieve authentic readiness insights.
                </p>
              </section>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                I Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT US MODAL */}
      {activeModal === 'contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Contact Us</h3>
                  <p className="text-xs text-slate-500">We'd love to hear your feedback or inquiries</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {contactSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-white">Message sent successfully.</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Thank you for reaching out to Mock Sphere support. Our team will review your message and reply to your email shortly.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setContactSuccess(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                  >
                    Send Another Message
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-4 text-xs">
                {contactError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold block">Submission Error</span>
                      <span>{contactError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setContactError(null)}
                      className="text-rose-400 hover:text-rose-600 cursor-pointer p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    disabled={isSending}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="alex@example.com"
                    disabled={isSending}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject / Topic
                  </label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    disabled={isSending}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Feedback / Feature Request">Feedback / Feature Request</option>
                    <option value="Enterprise / Institutional Access">Enterprise / Institutional Access</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="How can we assist you with Mock Sphere?"
                    disabled={isSending}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-60"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 truncate">Direct Email: support@mock-sphere.com</span>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white rounded-xl font-bold flex items-center gap-2 transition cursor-pointer shadow-md shadow-blue-600/20 disabled:cursor-not-allowed shrink-0"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
