import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  ExternalLink,
  ShieldCheck,
  Inbox,
  Clock,
  User,
  Info,
  Zap,
  Smartphone,
} from 'lucide-react';
import { ApiService } from '../services/api';
import { User as UserType } from '../types';

interface EmailOutboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserType | null;
}

interface EmailItem {
  id: string;
  to: string;
  userName: string;
  subject: string;
  type: string;
  sentAt: string;
  status: 'SENT' | 'SIMULATED' | 'FAILED';
  error?: string;
  messageId?: string;
  htmlContent?: string;
  provider?: string;
}

export const EmailOutboxModal: React.FC<EmailOutboxModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [smtpStatus, setSmtpStatus] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [resendStatus, setResendStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState<boolean>(false);
  const [targetEmail, setTargetEmail] = useState<string>(currentUser?.email || '');

  const loadEmails = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getEmailLogs();
      setEmails(data.emails || []);
      setSmtpStatus(data.smtp || null);
      if (data.emails && data.emails.length > 0 && !selectedEmail) {
        setSelectedEmail(data.emails[0]);
      }
    } catch (err: any) {
      console.error('Failed to load email logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadEmails();
      if (currentUser?.email) {
        setTargetEmail(currentUser.email);
      }
    }
  }, [isOpen, currentUser]);

  const handleResend = async () => {
    if (!targetEmail.trim()) return;
    setIsResending(true);
    setResendStatus(null);
    try {
      const res = await ApiService.resendRegistrationEmail({
        email: targetEmail.trim(),
        name: currentUser?.name || 'Candidate',
      });
      if (res.details?.status === 'SENT') {
        setResendStatus({
          type: 'success',
          text: `Delivered via Gmail SMTP to ${targetEmail.trim()}! Please check your mobile Gmail app or inbox.`,
        });
      } else if (res.details?.status === 'FAILED') {
        setResendStatus({
          type: 'error',
          text: `Delivery failed: ${res.details?.error || 'SMTP Error'}`,
        });
      } else {
        setResendStatus({
          type: 'success',
          text: `Registration email dispatched and logged for ${targetEmail.trim()}.`,
        });
      }
      await loadEmails();
    } catch (err: any) {
      setResendStatus({
        type: 'error',
        text: `Failed to dispatch: ${err.message || 'Error'}`,
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleTestSmtp = async () => {
    setIsTestingSmtp(true);
    setResendStatus(null);
    try {
      const res = await ApiService.testSmtpConnection({
        email: targetEmail.trim() || undefined,
      });
      setResendStatus({
        type: 'success',
        text: res.message || 'Gmail SMTP connection verified successfully!',
      });
      await loadEmails();
    } catch (err: any) {
      setResendStatus({
        type: 'error',
        text: `Gmail SMTP Verification Failed: ${err.message || 'Invalid credentials or host unreachable'}`,
      });
    } finally {
      setIsTestingSmtp(false);
    }
  };

  if (!isOpen) return null;

  const isLiveSmtp = smtpStatus?.configured === true;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Candidate Email Delivery & Gmail SMTP Outbox
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    isLiveSmtp
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {isLiveSmtp ? 'Gmail SMTP Active (smtp.gmail.com:587)' : 'In-App Delivery Active'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Official candidate registration confirmations and automated platform communications.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className={`w-4 h-4 shrink-0 ${isLiveSmtp ? 'text-emerald-400' : 'text-cyan-400'}`} />
            <span>
              Provider:{' '}
              <strong className="text-white">
                {smtpStatus?.provider || 'smtp.gmail.com (Port 587 TLS)'}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="email"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              placeholder="candidate@gmail.com"
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-48 sm:w-56"
            />
            <button
              onClick={handleResend}
              disabled={isResending || !targetEmail.trim()}
              title="Send real email to candidate Gmail address"
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isResending ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>Send to Gmail</span>
            </button>
            <button
              onClick={handleTestSmtp}
              disabled={isTestingSmtp}
              title="Test connection to smtp.gmail.com:587"
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 hover:text-white rounded-lg text-xs font-medium border border-slate-700 flex items-center gap-1 transition-colors"
            >
              {isTestingSmtp ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Zap className="w-3 h-3 text-amber-400" />
              )}
              <span>Verify SMTP</span>
            </button>
          </div>
        </div>

        {/* Live notification feedback banner */}
        {resendStatus && (
          <div
            className={`px-6 py-2.5 border-b text-xs flex items-center gap-2 animate-fadeIn ${
              resendStatus.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
            }`}
          >
            {resendStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span className="font-medium">{resendStatus.text}</span>
          </div>
        )}

        {/* Content Body: Left List + Right Preview */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          
          {/* Email List */}
          <div className="md:col-span-4 border-r border-slate-800/80 overflow-y-auto p-3 space-y-2 bg-slate-950/30">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              Dispatched Emails ({emails.length})
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Loading emails...</span>
              </div>
            ) : emails.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                <Inbox className="w-6 h-6 text-slate-600" />
                <span>No emails sent yet. Register a new candidate to generate your first welcome email.</span>
              </div>
            ) : (
              emails.map((em) => (
                <button
                  key={em.id}
                  onClick={() => setSelectedEmail(em)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all ${
                    selectedEmail?.id === em.id
                      ? 'bg-indigo-600/10 border-indigo-500/40 text-slate-100'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-xs truncate max-w-[170px] text-white">
                      {em.userName}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(em.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mb-1">
                    {em.subject}
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-cyan-400 truncate max-w-[140px] font-mono">
                      {em.to}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md font-bold uppercase text-[9px] ${
                        em.status === 'SENT'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : em.status === 'FAILED'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      }`}
                    >
                      {em.status === 'SENT' ? 'Delivered (Gmail)' : em.status === 'FAILED' ? 'Failed' : 'In-App Ready'}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Email Preview */}
          <div className="md:col-span-8 overflow-y-auto p-4 sm:p-6 bg-slate-900/50 flex flex-col space-y-4">
            {selectedEmail ? (
              <div className="space-y-4">
                {/* Meta Header */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {selectedEmail.subject}
                    </h3>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(selectedEmail.sentAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500">Recipient Gmail: </span>
                      <strong className="text-cyan-400 font-mono">{selectedEmail.to}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Candidate: </span>
                      <strong className="text-slate-200">{selectedEmail.userName}</strong>
                    </div>
                    {selectedEmail.messageId && (
                      <div className="sm:col-span-2 text-[11px] text-slate-500 truncate font-mono">
                        Message ID: {selectedEmail.messageId}
                      </div>
                    )}
                    {selectedEmail.error && (
                      <div className="sm:col-span-2 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[11px] text-rose-300">
                        <strong>Error:</strong> {selectedEmail.error}
                      </div>
                    )}
                  </div>
                </div>

                {/* Mobile inbox preview indicator */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
                  <Smartphone className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    When delivered via Gmail SMTP, this responsive message appears directly in the candidate's mobile Gmail app.
                  </span>
                </div>

                {/* HTML Rendered Content */}
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 shadow-inner">
                  {selectedEmail.htmlContent ? (
                    <iframe
                      srcDoc={selectedEmail.htmlContent}
                      title="Email Preview"
                      className="w-full min-h-[420px] bg-slate-950 border-0"
                    />
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400">
                      Email body registered in log.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                <Mail className="w-10 h-10 text-slate-700 mb-2" />
                <p className="text-xs">Select an email on the left to view the full rendered message.</p>
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-indigo-400 shrink-0" />
            Every newly registered candidate automatically triggers this welcome confirmation email to their Gmail address.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold transition-colors cursor-pointer shrink-0"
          >
            Close Outbox
          </button>
        </div>

      </div>
    </div>
  );
};
