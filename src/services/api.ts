import {
  AdminSettings,
  AptitudeQuestion,
  AptitudeTopicId,
  FinalAptitudeResult,
  FinalReportData,
  HRInterviewSession,
  LevelAttemptResult,
  ResponseMode,
  TechnicalDomainId,
  TechnicalDomainInfo,
  TechnicalInterviewSession,
  TopicTestResult,
  User,
  UserDashboardState,
} from '../types';

const TOKEN_KEY = 'ai_interview_token';
const USER_KEY = 'ai_interview_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredAuth(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type') || '';
  let data: any;

  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = { error: 'Failed to parse JSON response' };
    }
  } else {
    const rawText = await res.text();
    if (!res.ok) {
      throw new Error(`Server returned error (${res.status})`);
    }
    try {
      data = JSON.parse(rawText);
    } catch {
      throw new Error('Received unexpected response format from server');
    }
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data as T;
}

export const ApiService = {
  getCurrentUser(): User | null {
    return getStoredUser();
  },

  // Auth
  async googleAuth(payload: {
    credential?: string;
    email?: string;
    name?: string;
    avatar_url?: string;
    google_id?: string;
  }): Promise<{ user: User; token: string; message?: string; isNewUser?: boolean }> {
    const res = await request<{ user: User; token: string; message?: string; isNewUser?: boolean }>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setStoredAuth(res.token, res.user);
    return res;
  },

  async register(name: string, email: string, password: string): Promise<{ user: User; token: string; email_dispatched?: boolean; message?: string }> {
    const res = await request<{ user: User; token: string; email_dispatched?: boolean; message?: string }>('/api/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    setStoredAuth(res.token, res.user);
    return res;
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredAuth(res.token, res.user);
    return res;
  },

  async updateProfile(name: string, email: string): Promise<{ user: User; message: string }> {
    const res = await request<{ user: User; message: string }>('/api/update-profile', {
      method: 'POST',
      body: JSON.stringify({ name, email }),
    });
    const token = getStoredToken();
    if (token && res.user) {
      setStoredAuth(token, res.user);
    }
    return res;
  },

  async logout(): Promise<void> {
    clearStoredAuth();
    await request('/api/logout', { method: 'POST' }).catch(() => {});
  },

  // Dashboard & Aptitude
  async getDashboard(): Promise<UserDashboardState> {
    return request<UserDashboardState>('/api/dashboard');
  },

  async getDashboardState(): Promise<UserDashboardState> {
    return request<UserDashboardState>('/api/dashboard');
  },

  async getLevelQuestions(
    topicId: AptitudeTopicId,
    levelId: number,
    isRetry: boolean = false
  ): Promise<{
    topic_id: AptitudeTopicId;
    level_id: number;
    total_questions: number;
    time_limit_minutes: number;
    questions: AptitudeQuestion[];
  }> {
    const query = isRetry ? '?retry=true' : '';
    return request(`/api/aptitude/level/${topicId}/${levelId}${query}`);
  },

  async submitLevel(
    topicId: AptitudeTopicId,
    levelId: number,
    answers: Array<{ question_id: string; selected_answer: string }>
  ): Promise<LevelAttemptResult> {
    return request<LevelAttemptResult>(`/api/aptitude/level/${topicId}/${levelId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  async getTopicTestQuestions(
    topicId: AptitudeTopicId,
    testNumber: 1 | 2
  ): Promise<{
    topic_id: AptitudeTopicId;
    test_number: number;
    total_questions: number;
    time_limit_minutes: number;
    questions: AptitudeQuestion[];
  }> {
    return request(`/api/aptitude/test/${topicId}/${testNumber}`);
  },

  async submitTopicTest(
    topicId: AptitudeTopicId,
    testNumber: 1 | 2,
    answers: Array<{ question_id: string; selected_answer: string }>
  ): Promise<TopicTestResult> {
    return request<TopicTestResult>(`/api/aptitude/test/${topicId}/${testNumber}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  async getFinalTestQuestions(): Promise<{
    total_questions: number;
    time_limit_minutes: number;
    questions: AptitudeQuestion[];
  }> {
    return request('/api/aptitude/final');
  },

  async submitFinalTest(
    answers: Array<{ question_id: string; selected_answer: string }>
  ): Promise<FinalAptitudeResult> {
    return request<FinalAptitudeResult>('/api/aptitude/final/submit', {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  // Technical Round
  async getTechnicalDomains(): Promise<{ domains: TechnicalDomainInfo[] }> {
    return request<{ domains: TechnicalDomainInfo[] }>('/api/technical/domains');
  },

  async getActiveTechnicalInterview(): Promise<{ session: TechnicalInterviewSession | null }> {
    return request<{ session: TechnicalInterviewSession | null }>('/api/technical/active');
  },

  async resetTechnicalInterview(): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/api/technical/reset', {
      method: 'POST',
    });
  },

  async startTechnicalInterview(domain: TechnicalDomainId, isRetake = false): Promise<TechnicalInterviewSession> {
    return request<TechnicalInterviewSession>('/api/technical/start', {
      method: 'POST',
      body: JSON.stringify({ domain, is_retake: isRetake }),
    });
  },

  async evaluateTechnicalAnswer(payload: {
    session_id: string;
    question_id: string;
    domain: TechnicalDomainId;
    response_type: ResponseMode;
    response_text: string;
    code_snippet?: string;
    diagram_data?: string;
    time_taken_seconds?: number;
  }): Promise<{ session: TechnicalInterviewSession; currentEvaluation: any }> {
    return request('/api/technical/evaluate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // HR Round
  async startHRInterview(): Promise<HRInterviewSession> {
    return request<HRInterviewSession>('/api/hr/start', {
      method: 'POST',
    });
  },

  async evaluateHRAnswer(payload: {
    session_id: string;
    question_id: string;
    response_type: 'text' | 'voice';
    response_text: string;
  }): Promise<{ session: HRInterviewSession; currentEvaluation: any }> {
    return request('/api/hr/evaluate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Final Report & History
  async getFinalReport(): Promise<FinalReportData> {
    return request<FinalReportData>('/api/report');
  },

  async getPerformanceHistory(): Promise<any> {
    return request('/api/history');
  },

  // Admin
  ADMIN_EMAIL: 'jaammaaj123@gmail.com',

  isAdminAccount(user?: User | null): boolean {
    const target = user || getStoredUser();
    if (!target || !target.email) return false;
    return target.email.trim().toLowerCase() === 'jaammaaj123@gmail.com';
  },

  async getAdminSettings(): Promise<AdminSettings> {
    return request<AdminSettings>('/api/admin/settings');
  },

  async updateAdminSettings(settings: Partial<AdminSettings>): Promise<AdminSettings> {
    return request<AdminSettings>('/api/admin/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    });
  },

  async toggleGlobalDemoMode(enabled: boolean): Promise<{ success: boolean; globalDemoMode: boolean; message: string; settings: AdminSettings }> {
    return request<{ success: boolean; globalDemoMode: boolean; message: string; settings: AdminSettings }>('/api/admin/demo-mode/toggle-global', {
      method: 'POST',
      body: JSON.stringify({ enabled }),
    });
  },

  async quickUnlock(milestone: string): Promise<UserDashboardState> {
    return request<UserDashboardState>('/api/admin/quick-unlock', {
      method: 'POST',
      body: JSON.stringify({ milestone }),
    });
  },

  async quickUnlockMilestone(milestone: string): Promise<UserDashboardState> {
    return this.quickUnlock(milestone);
  },

  async resetProgress(): Promise<UserDashboardState> {
    return request<UserDashboardState>('/api/admin/reset-progress', {
      method: 'POST',
    });
  },

  // Admin Demo Mode for College Project Presentation
  async enableDemoMode(): Promise<{ user: User; token: string; isDemoMode: boolean; message: string }> {
    const res = await request<{ user: User; token: string; isDemoMode: boolean; message: string }>('/api/admin/demo-mode/enable', {
      method: 'POST',
    });
    setStoredAuth(res.token, res.user);
    return res;
  },

  async resetDemoMode(): Promise<{ success: boolean; message: string; dashboard: UserDashboardState }> {
    return request<{ success: boolean; message: string; dashboard: UserDashboardState }>('/api/admin/demo-mode/reset', {
      method: 'POST',
    });
  },

  async getDemoModeStatus(): Promise<{ isDemoMode: boolean; globalDemoMode?: boolean; user: User | null }> {
    return request<{ isDemoMode: boolean; globalDemoMode?: boolean; user: User | null }>('/api/admin/demo-mode/status');
  },

  isDemoAccount(user?: User | null): boolean {
    const target = user || getStoredUser();
    if (!target) return false;
    return target.email?.toLowerCase() === 'demo@interview.com' || target.user_id === 'user_demo_presentation';
  },

  // Email Notification & Outbox Services
  async getEmailLogs(): Promise<{
    emails: Array<{
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
    }>;
    smtp: {
      configured: boolean;
      provider: string;
      fromAddress: string;
    };
  }> {
    return request('/api/notifications/emails');
  },

  async getSmtpStatus(): Promise<{
    configured: boolean;
    provider: string;
    fromAddress: string;
  }> {
    return request('/api/notifications/smtp-status');
  },

  async resendRegistrationEmail(payload?: { email?: string; name?: string }): Promise<{
    success: boolean;
    message: string;
    details: any;
  }> {
    return request('/api/notifications/resend-registration', {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    });
  },

  async testSmtpConnection(payload?: { email?: string }): Promise<{
    connected: boolean;
    message: string;
    provider: string;
    error?: string;
  }> {
    return request('/api/notifications/test-smtp', {
      method: 'POST',
      body: JSON.stringify(payload || {}),
    });
  },
};
