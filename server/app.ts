import express from 'express';
import dotenv from 'dotenv';
import { db, ADMIN_EMAIL } from './db';
import { AptitudeTopicId, TechnicalDomainId } from '../src/types';
import { TECHNICAL_DOMAINS_LIST } from './technicalQuestionBank';
import {
  sendRegistrationWelcomeEmail,
  getEmailLogs,
  isSmtpConfigured,
  testGmailSmtpConnection,
} from './emailService';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));

// Helper to get authenticated user ID from Authorization header
export function getAuthUserId(req: express.Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer token_')) {
    const raw = authHeader.replace('Bearer token_', '').trim();
    return raw || null;
  }
  return null;
}

// Strict backend middleware to verify Administrator privileges (jaammaaj123@gmail.com only)
export function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required. Please sign in with your Google administrator account.' });
    }
    const user = db.getUserById(userId);
    if (!user) {
      return res.status(401).json({ error: 'User session not found. Please sign in again.' });
    }
    const userEmail = (user.email || '').trim().toLowerCase();
    const adminEmail = ADMIN_EMAIL.trim().toLowerCase();
    if (userEmail !== adminEmail || user.role !== 'admin') {
      return res.status(403).json({
        error: `Access Denied. Only the designated administrator (${ADMIN_EMAIL}) has access to these settings.`,
      });
    }
    next();
  } catch (err: any) {
    return res.status(403).json({ error: 'Admin authorization check failed.' });
  }
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get Google OAuth Client ID config (safe for frontend)
app.get('/api/auth/config', (req, res) => {
  res.json({
    clientId: process.env.GOOGLE_CLIENT_ID || '866683821439-rwus45cfiomfvtyer4atma.apps.googleusercontent.com',
  });
});

// Google OAuth Authorization Code Callback (Production Vercel & general support)
app.get('/api/auth/callback/google', async (req, res) => {
  try {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).send('Missing authorization code from Google.');
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || '866683821439-rwus45cfiomfvtyer4atma.apps.googleusercontent.com';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return res.status(500).send('Google OAuth server credentials (GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET) are not configured.');
    }

    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const redirectUri = host?.includes('mock-sphere.vercel.app')
      ? 'https://mock-sphere.vercel.app/api/auth/callback/google'
      : `${protocol}://${host}/api/auth/callback/google`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[Server] Google token exchange failed:', errText);
      return res.status(400).send(`Google authentication failed: ${errText}`);
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return res.status(400).send('Failed to obtain access token from Google.');
    }

    const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userInfoRes.ok) {
      return res.status(400).send('Failed to retrieve user profile from Google.');
    }

    const userInfo = await userInfoRes.json();
    const email = userInfo.email;
    const name = userInfo.name || email.split('@')[0];
    const picture = userInfo.picture;
    const googleId = userInfo.sub;

    if (!email) {
      return res.status(400).send('Google account did not provide an email address.');
    }

    const result = db.loginOrRegisterGoogleUser(email, name, picture, googleId);

    if (result.isNewUser) {
      try {
        await sendRegistrationWelcomeEmail({
          to: result.user.email,
          userName: result.user.name,
          appUrl: process.env.APP_URL,
        });
      } catch (e) {
        console.warn('[Server] Welcome email warning:', e);
      }
    }

    const htmlResponse = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authenticating with Google - Mock-Sphere</title>
          <style>
            body { background: #020617; color: #f8fafc; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: #0f172a; border: 1px solid #1e293b; padding: 32px; border-radius: 16px; text-align: center; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.5); }
            .spinner { width: 40px; height: 40px; border: 4px solid #3b82f6; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
            @keyframes spin { to { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="spinner"></div>
            <h2>Successfully Authenticated with Google!</h2>
            <p>Signing you in as ${result.user.name} (${result.user.email})...</p>
          </div>
          <script>
            try {
              localStorage.setItem('auth_token', ${JSON.stringify(result.token)});
              localStorage.setItem('auth_user', ${JSON.stringify(JSON.stringify(result.user))});
            } catch (e) {}
            window.location.href = '/';
          </script>
        </body>
      </html>
    `;
    res.setHeader('Content-Type', 'text/html');
    res.send(htmlResponse);
  } catch (err: any) {
    console.error('[Server] Google OAuth callback error:', err);
    res.status(500).send(`Google OAuth error: ${err.message}`);
  }
});

// Authentication Routes
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential, email, name, avatar_url, google_id } = req.body;
    let resolvedEmail = email;
    let resolvedName = name;
    let resolvedAvatar = avatar_url;
    let resolvedGoogleId = google_id;

    // If Google ID token JWT was provided, decode its payload
    if (credential && typeof credential === 'string') {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          if (payload.email) resolvedEmail = payload.email;
          if (payload.name) resolvedName = payload.name;
          if (payload.picture) resolvedAvatar = payload.picture;
          if (payload.sub) resolvedGoogleId = payload.sub;
        }
      } catch (e) {
        console.warn('[Server] Could not parse Google ID token JWT:', e);
      }
    }

    if (!resolvedEmail || typeof resolvedEmail !== 'string' || !resolvedEmail.includes('@')) {
      return res.status(400).json({ error: 'A valid Google email address is required to sign in.' });
    }

    const result = db.loginOrRegisterGoogleUser(
      resolvedEmail,
      resolvedName,
      resolvedAvatar,
      resolvedGoogleId
    );

    // If new user registered, attempt to send welcome email
    let emailResult: any = null;
    if (result.isNewUser) {
      try {
        emailResult = await sendRegistrationWelcomeEmail({
          to: result.user.email,
          userName: result.user.name,
          appUrl: process.env.APP_URL,
        });
      } catch (emailErr: any) {
        console.warn('[Server] Google sign-in welcome email dispatch warning:', emailErr.message);
      }
    }

    res.json({
      user: result.user,
      token: result.token,
      isNewUser: result.isNewUser,
      emailResult,
      message: result.isNewUser
        ? `Account registered with Google! Welcome email sent to ${result.user.email}.`
        : `Signed in as ${result.user.name}`,
    });
  } catch (err: any) {
    console.error('[Server] Google auth error:', err);
    res.status(400).json({ error: err.message || 'Google authentication failed' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    const result = db.registerUser(name, email, password);

    // Send confirmation welcome email upon finishing registration directly to candidate's Gmail
    let emailResult: any = null;
    try {
      emailResult = await sendRegistrationWelcomeEmail({
        to: result.user.email,
        userName: result.user.name,
        appUrl: process.env.APP_URL,
      });
    } catch (emailErr: any) {
      console.error('[Server] Registration welcome email error:', emailErr.message);
      emailResult = {
        success: false,
        status: 'FAILED',
        error: emailErr.message,
        sentTo: result.user.email,
      };
    }

    const isLiveSent = emailResult?.status === 'SENT';
    const isFailed = emailResult?.status === 'FAILED';

    res.status(201).json({
      ...result,
      emailResult,
      message: isLiveSent
        ? `Registration completed! An official welcome email was sent to ${result.user.email} via Gmail SMTP.`
        : isFailed
        ? `Account registered! (Note: Email delivery failed: ${emailResult.error})`
        : `Registration completed! Welcome email logged for ${result.user.email}.`,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Registration failed' });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const result = db.loginUser(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message || 'Invalid credentials' });
  }
});

app.post('/api/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/me', (req, res) => {
  const userId = getAuthUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required. Please sign in with Google.' });
  }
  const user = db.getUserById(userId);
  if (!user) {
    return res.status(401).json({ error: 'User session expired or not found. Please sign in.' });
  }
  res.json({ user });
});

app.post('/api/update-profile', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    const { name, email } = req.body;
    const updatedUser = db.updateUserProfile(userId, name, email);
    res.json({ user: updatedUser, message: 'Profile updated successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update profile' });
  }
});

// Dashboard State
app.get('/api/dashboard', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required. Please sign in with Google.' });
    }
    const state = db.getDashboardState(userId);
    res.json(state);
  } catch (err: any) {
    const isAuthErr = err.message?.includes('not found') || err.message?.includes('log in');
    res.status(isAuthErr ? 401 : 500).json({ error: err.message });
  }
});

// Aptitude Topics & Levels
app.get('/api/aptitude/topics', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const state = db.getDashboardState(userId);
    res.json({ topics: state.topics });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/aptitude/topic/:topic_id', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { topic_id } = req.params;
    const state = db.getDashboardState(userId);
    const topic = state.topics[topic_id as AptitudeTopicId];
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    const prog = db.getUserProgress(userId);
    res.json({
      topic,
      passed_levels: prog.topic_levels_passed[topic_id as AptitudeTopicId] || [],
      test1_passed: prog.topic_test1_passed[topic_id as AptitudeTopicId] || false,
      test2_passed: prog.topic_test2_passed[topic_id as AptitudeTopicId] || false,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Level Questions & Submissions
app.get('/api/aptitude/level/:topic_id/:level_id', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { topic_id, level_id } = req.params;
    const isRetry = req.query.retry === 'true' || req.query.new_attempt === 'true';
    const questions = db.getQuestionsForLevel(userId, topic_id as AptitudeTopicId, parseInt(level_id, 10), isRetry);
    res.json({
      topic_id,
      level_id: parseInt(level_id, 10),
      total_questions: questions.length,
      time_limit_minutes: db.getSettings().levelTimerMinutes,
      questions: questions.map((q) => ({
        question_id: q.question_id,
        category: q.category,
        concept: q.concept || q.category,
        difficulty: q.difficulty,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
      })),
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/aptitude/level/:topic_id/:level_id/submit', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { topic_id, level_id } = req.params;
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers array is required' });
    }
    const result = db.submitLevel(userId, topic_id as AptitudeTopicId, parseInt(level_id, 10), answers);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// 5-Level Topic Tests (Test 1 & Test 2)
app.get('/api/aptitude/test/:topic_id/:test_number', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { topic_id, test_number } = req.params;
    const testNum = parseInt(test_number, 10) as 1 | 2;
    const questions = db.getQuestionsForTopicTest(userId, topic_id as AptitudeTopicId, testNum);
    res.json({
      topic_id,
      test_number: testNum,
      total_questions: questions.length,
      time_limit_minutes: db.getSettings().testTimerMinutes,
      questions: questions.map((q) => ({
        question_id: q.question_id,
        category: q.category,
        concept: q.concept || q.category,
        difficulty: q.difficulty,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
      })),
    });
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
});

app.post('/api/aptitude/test/:topic_id/:test_number/submit', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { topic_id, test_number } = req.params;
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers array is required' });
    }
    const result = db.submitTopicTest(userId, topic_id as AptitudeTopicId, parseInt(test_number, 10) as 1 | 2, answers);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Final Aptitude Test (25 Mixed Questions)
app.get('/api/aptitude/final', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const questions = db.getQuestionsForFinalTest(userId);
    res.json({
      total_questions: questions.length,
      time_limit_minutes: db.getSettings().finalTestTimerMinutes,
      questions: questions.map((q) => ({
        question_id: q.question_id,
        topic_id: q.topic_id,
        category: q.category,
        concept: q.concept || q.category,
        difficulty: q.difficulty,
        question: q.question,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
      })),
    });
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
});

// Concept Mastery & Attempt History Endpoint
app.get('/api/aptitude/concept-mastery', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const prog = db.getUserProgress(userId);
    res.json({
      concept_performance: prog.concept_performance || {},
      total_attempt_logs: (prog.question_attempts || []).length,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/aptitude/final/submit', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Answers array is required' });
    }
    const result = db.submitFinalTest(userId, answers);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Technical Round (Realistic Multimodal AI Live Interview)
app.get('/api/technical/domains', (req, res) => {
  res.json({ domains: TECHNICAL_DOMAINS_LIST });
});

app.get('/api/technical/active', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const session = db.getActiveTechnicalInterview(userId);
    res.json({ session });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/technical/reset', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    db.resetTechnicalInterview(userId);
    res.json({ success: true, message: 'Technical interview reset successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/technical/start', async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { domain, is_retake } = req.body;
    if (!domain) {
      return res.status(400).json({ error: 'Selected domain is required' });
    }
    const session = await db.startTechnicalInterview(userId, domain as TechnicalDomainId, !!is_retake);
    res.json(session);
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
});

app.post('/api/technical/evaluate', async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { session_id, question_id, response_type, response_text, code_snippet, diagram_data, time_taken_seconds, attempt_number } = req.body;
    if (!session_id || !question_id) {
      return res.status(400).json({ error: 'session_id and question_id are required' });
    }
    const result = await db.evaluateTechnicalStep(
      userId,
      session_id,
      question_id,
      response_type || 'text',
      response_text || '',
      code_snippet,
      diagram_data,
      time_taken_seconds,
      typeof attempt_number === 'number' ? attempt_number : 1
    );
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// HR Round (AI Behavioral & Culture Interview)
app.post('/api/hr/start', async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const session = db.startHRInterview(userId);
    res.json(session);
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
});

app.post('/api/hr/evaluate', async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { session_id, question_id, response_type, response_text } = req.body;
    if (!session_id || !question_id) {
      return res.status(400).json({ error: 'session_id and question_id are required' });
    }
    const result = await db.evaluateHRStep(
      userId,
      session_id,
      question_id,
      response_type || 'text',
      response_text || ''
    );
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Final Report & Performance History
app.get('/api/report', async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const report = await db.getFinalReport(userId);
    res.json(report);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/history', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const history = db.getPerformanceHistory(userId);
    res.json(history);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Configuration & Inspection (Secured for jaammaaj123@gmail.com)
app.get('/api/admin/settings', (req, res) => {
  res.json(db.getSettings());
});

app.post('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/quick-unlock', requireAdmin, (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const { milestone } = req.body;
    const updatedState = db.quickUnlockMilestone(userId, milestone || 'all_topics');
    res.json(updatedState);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/reset-progress', requireAdmin, (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const reset = db.resetUserProgress(userId);
    res.json(reset);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// --- ADMIN DEMO MODE (Global & College Presentation) ---
app.post('/api/admin/demo-mode/toggle-global', requireAdmin, (req, res) => {
  try {
    const { enabled } = req.body;
    const updatedSettings = db.setGlobalDemoMode(enabled);
    res.json({
      success: true,
      globalDemoMode: !!updatedSettings.globalDemoMode,
      message: updatedSettings.globalDemoMode
        ? 'Global Demo Mode ENABLED: All users can now access full testing and interview rounds.'
        : 'Global Demo Mode DISABLED: Standard sequential qualification enforced for all candidates.',
      settings: updatedSettings,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/demo-mode/enable', requireAdmin, (req, res) => {
  try {
    const demoData = db.getOrCreateDemoUser();
    res.json({
      success: true,
      user: demoData.user,
      token: demoData.token,
      isDemoMode: true,
      message: 'Admin Demo Mode activated for demo@interview.com',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/demo-mode/reset', requireAdmin, (req, res) => {
  try {
    const resetDashboard = db.resetDemoProgress();
    res.json({
      success: true,
      message: 'Demo dataset reset to initial qualified aptitude state (ready for live technical & HR presentation).',
      dashboard: resetDashboard,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/admin/demo-mode/status', (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const user = db.getUserById(userId);
    const globalDemo = db.isGlobalDemoMode();
    const isDemo = globalDemo || (user ? db.isDemoUser(user.user_id) : false);
    res.json({
      isDemoMode: isDemo,
      globalDemoMode: globalDemo,
      user: isDemo ? user : null,
    });
  } catch {
    res.json({ isDemoMode: false, globalDemoMode: false, user: null });
  }
});

// Candidate Notification & Outbox Routes
app.get('/api/notifications/emails', (req, res) => {
  try {
    const logs = getEmailLogs();
    const smtpStatus = isSmtpConfigured();
    res.json({ emails: logs, smtp: smtpStatus });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/notifications/smtp-status', (req, res) => {
  res.json(isSmtpConfigured());
});

app.post('/api/notifications/resend-registration', async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    const user = db.getUserById(userId);
    const targetEmail = req.body.email || user.email;
    const targetName = req.body.name || user.name;

    const dispatchResult = await sendRegistrationWelcomeEmail({
      to: targetEmail,
      userName: targetName,
      appUrl: process.env.APP_URL,
    });

    res.json({
      success: true,
      message: `Welcome registration email dispatched to ${targetEmail}`,
      details: dispatchResult,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to dispatch registration email' });
  }
});

app.post('/api/notifications/test-smtp', async (req, res) => {
  try {
    const targetEmail = req.body.email;
    const testResult = await testGmailSmtpConnection(targetEmail);
    if (!testResult.connected) {
      return res.status(400).json(testResult);
    }
    res.json(testResult);
  } catch (err: any) {
    res.status(500).json({
      connected: false,
      message: 'SMTP Test Failed',
      error: err.message,
    });
  }
});

// Fallback for any unmatched /api/* requests so they return clean JSON instead of HTML
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: `API endpoint ${req.method} ${req.path} not found` });
});

export default app;
