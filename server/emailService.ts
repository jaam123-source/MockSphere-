import nodemailer from 'nodemailer';

export interface RegistrationEmailPayload {
  to: string;
  userName: string;
  appUrl?: string;
}

export interface EmailLogEntry {
  id: string;
  to: string;
  userName: string;
  subject: string;
  type: 'REGISTRATION_WELCOME' | 'TEST_EMAIL' | 'INTERVIEW_STARTED' | 'CONTACT_US';
  sentAt: string;
  status: 'SENT' | 'SIMULATED' | 'FAILED';
  error?: string;
  messageId?: string;
  htmlContent?: string;
  provider: string;
}

const emailLogs: EmailLogEntry[] = [];

export function getEmailLogs(): EmailLogEntry[] {
  return [...emailLogs].reverse();
}

/**
 * Checks if Gmail SMTP or custom SMTP is configured via environment variables.
 */
export function isSmtpConfigured(): {
  configured: boolean;
  provider: string;
  fromAddress: string;
  user: string;
} {
  const gmailUser = (process.env.GMAIL_USER || process.env.SMTP_USER || '').trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '').replace(/\s+/g, '');
  const smtpHost = (process.env.SMTP_HOST || '').trim();

  if (gmailUser && gmailPass) {
    return {
      configured: true,
      provider: 'Gmail SMTP (smtp.gmail.com:587 TLS)',
      fromAddress: process.env.SMTP_FROM || `"Placement Preparation AI" <${gmailUser}>`,
      user: gmailUser,
    };
  }

  if (smtpHost && gmailUser && gmailPass) {
    return {
      configured: true,
      provider: `SMTP Relay (${smtpHost})`,
      fromAddress: process.env.SMTP_FROM || `"Placement Preparation AI" <${gmailUser}>`,
      user: gmailUser,
    };
  }

  return {
    configured: false,
    provider: 'In-App Delivery (Add GMAIL_USER & GMAIL_APP_PASSWORD to enable live Gmail sending)',
    fromAddress: 'noreply@placementprepai.internal',
    user: '',
  };
}

/**
 * Creates Nodemailer Transporter using Gmail SMTP (smtp.gmail.com:587 TLS) or custom SMTP.
 */
export function createTransporter(): nodemailer.Transporter | null {
  const gmailUser = (process.env.GMAIL_USER || process.env.SMTP_USER || '').trim();
  const gmailPass = (process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || '').replace(/\s+/g, '');

  if (!gmailUser || !gmailPass) {
    return null;
  }

  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const isDirectGmail = host.toLowerCase().includes('gmail.com') || host === 'smtp.gmail.com';

  return nodemailer.createTransport({
    host: host || 'smtp.gmail.com',
    port: port || 587,
    secure: port === 465, // false for 587 (STARTTLS)
    requireTLS: true,
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

/**
 * Generates responsive HTML email template for newly registered candidates.
 */
export function generateRegistrationEmailHtml(payload: RegistrationEmailPayload): string {
  const { userName, to, appUrl } = payload;
  const targetUrl = appUrl || process.env.APP_URL || 'https://placement-prep-ai.internal';
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You are registered for Placement Preparation AI</title>
</head>
<body style="margin:0;padding:0;background-color:#090d16;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#e2e8f0;line-height:1.6;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#090d16;padding:30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:620px;background-color:#0f172a;border-radius:18px;border:1px solid #1e293b;overflow:hidden;box-shadow:0 25px 50px rgba(0,0,0,0.6);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background:linear-gradient(135deg, #4338ca 0%, #3b82f6 50%, #06b6d4 100%);padding:40px 32px;text-align:left;">
              <div style="font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#e0e7ff;margin-bottom:8px;">
                🎯 PLACEMENT PREPARATION AI PLATFORM
              </div>
              <h1 style="margin:0;font-size:28px;font-weight:900;color:#ffffff;line-height:1.2;">
                You are registered for this website!
              </h1>
              <p style="margin:10px 0 0;font-size:15px;color:#f1f5f9;font-weight:500;">
                Welcome to your comprehensive campus placement training and assessment portal.
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="font-size:16px;color:#f8fafc;margin-top:0;line-height:1.5;">
                Hello <strong style="color:#38bdf8;">${userName}</strong>,
              </p>
              
              <p style="font-size:14px;color:#cbd5e1;margin-bottom:20px;line-height:1.6;">
                Congratulations! You have successfully registered your candidate account for <strong>Placement Preparation AI</strong>. You now have full access to personalized aptitude diagnostic tracks, comprehensive benchmark tests, Gemini-powered multimodal technical rounds, and behavioral HR interviews.
              </p>

              <!-- Account Summary Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#1e293b;border-radius:14px;padding:20px;border:1px solid #334155;margin-bottom:24px;">
                <tr>
                  <td colspan="2" style="padding-bottom:12px;font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;border-bottom:1px solid #334155;">
                    📋 Candidate Registration Details
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0 4px;font-size:13px;color:#94a3b8;width:150px;"><strong>Candidate Name:</strong></td>
                  <td style="padding:10px 0 4px;font-size:13px;color:#f8fafc;font-weight:700;">${userName}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#94a3b8;"><strong>Registered Gmail:</strong></td>
                  <td style="padding:6px 0;font-size:13px;color:#38bdf8;font-family:monospace;font-weight:600;">${to}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#94a3b8;"><strong>Registration Date:</strong></td>
                  <td style="padding:6px 0;font-size:13px;color:#e2e8f0;">${formattedDate}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0 2px;font-size:13px;color:#94a3b8;"><strong>Account Status:</strong></td>
                  <td style="padding:6px 0 2px;font-size:13px;color:#34d399;font-weight:800;">
                    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background-color:#34d399;margin-right:6px;"></span>
                    Active &bull; Fully Provisioned
                  </td>
                </tr>
              </table>

              <!-- Roadmap Section -->
              <div style="background-color:rgba(15, 23, 42, 0.7);border:1px solid #334155;border-radius:14px;padding:22px;margin-bottom:28px;">
                <h3 style="margin:0 0 16px;font-size:14px;font-weight:800;color:#f1f5f9;text-transform:uppercase;letter-spacing:0.8px;">
                  🚀 Your Placement Qualification Journey:
                </h3>
                
                <div style="margin-bottom:14px;padding-left:12px;border-left:3px solid #6366f1;">
                  <strong style="color:#818cf8;font-size:13px;">Stage 1 &bull; 4-Topic Aptitude Progression (Levels 1-10):</strong>
                  <div style="color:#94a3b8;font-size:12px;margin-top:3px;">
                    Progress through Quantitative, Logical, Verbal, and Specialized tracks with Checkpoint Tests.
                  </div>
                </div>

                <div style="margin-bottom:14px;padding-left:12px;border-left:3px solid #f59e0b;">
                  <strong style="color:#fbbf24;font-size:13px;">Stage 2 &bull; Comprehensive Final Aptitude Test:</strong>
                  <div style="color:#94a3b8;font-size:12px;margin-top:3px;">
                    A 25-question benchmark assessment requiring &ge;70% to unlock technical interview rounds.
                  </div>
                </div>

                <div style="margin-bottom:14px;padding-left:12px;border-left:3px solid #06b6d4;">
                  <strong style="color:#22d3ee;font-size:13px;">Stage 3 &bull; Multimodal AI Technical Interview:</strong>
                  <div style="color:#94a3b8;font-size:12px;margin-top:3px;">
                    Voice speech synthesis & recognition, live code IDE sandbox, and system architecture assessment.
                  </div>
                </div>

                <div style="padding-left:12px;border-left:3px solid #10b981;">
                  <strong style="color:#34d399;font-size:13px;">Stage 4 &bull; AI Behavioral HR Round & Readiness Report:</strong>
                  <div style="color:#94a3b8;font-size:12px;margin-top:3px;">
                    STAR-method psychometric evaluation resulting in comprehensive placement diagnostic analytics.
                  </div>
                </div>
              </div>

              <!-- Action Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="text-align:center;margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <a href="${targetUrl}" style="display:inline-block;background:linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);color:#ffffff;text-decoration:none;font-weight:800;font-size:15px;padding:15px 36px;border-radius:12px;box-shadow:0 6px 20px rgba(79, 70, 229, 0.45);letter-spacing:0.3px;">
                      Open Candidate Portal &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size:12px;color:#64748b;margin:0;text-align:center;line-height:1.5;">
                This automated confirmation was dispatched to <span style="color:#94a3b8;">${to}</span> because you registered for the Placement Preparation AI website.<br>If you did not perform this registration, you may safely ignore this message.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#090d16;padding:24px 32px;border-top:1px solid #1e293b;text-align:center;">
              <p style="margin:0;font-size:12px;color:#64748b;">
                &copy; ${new Date().getFullYear()} Placement Preparation AI &bull; Intelligent Multi-Stage Campus Assessment Platform
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Generates plain text version of the welcome email for mobile notifications and text clients.
 */
export function generateRegistrationEmailText(payload: RegistrationEmailPayload): string {
  const { userName, to, appUrl } = payload;
  const targetUrl = appUrl || process.env.APP_URL || 'https://placement-prep-ai.internal';

  return `
Hello ${userName},

You are registered for Placement Preparation AI!

Registration Details:
- Candidate: ${userName}
- Registered Email: ${to}
- Portal Access URL: ${targetUrl}

Your Assessment Roadmap:
1. 4-Topic Aptitude Progression (Levels 1-10)
2. Comprehensive Final Aptitude Test (>=70% cutoff)
3. Multimodal AI Technical Interview (Voice + Code Sandbox)
4. AI Behavioral HR Round & Readiness Diagnostic Report

Log in to start your campus placement preparation:
${targetUrl}

Best regards,
Placement Preparation AI Team
  `.trim();
}

/**
 * Sends a welcome confirmation email upon candidate registration via Gmail SMTP.
 */
export async function sendRegistrationWelcomeEmail(payload: RegistrationEmailPayload): Promise<{
  success: boolean;
  messageId?: string;
  status: 'SENT' | 'SIMULATED' | 'FAILED';
  subject: string;
  sentTo: string;
  error?: string;
  deliveryProvider: string;
}> {
  const subject = `🎉 You're registered for Placement Preparation AI - Welcome, ${payload.userName}!`;
  const html = generateRegistrationEmailHtml(payload);
  const text = generateRegistrationEmailText(payload);
  const logId = `eml_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const smtpInfo = isSmtpConfigured();
  const transporter = createTransporter();

  const logEntry: EmailLogEntry = {
    id: logId,
    to: payload.to,
    userName: payload.userName,
    subject,
    type: 'REGISTRATION_WELCOME',
    sentAt: new Date().toISOString(),
    status: 'SIMULATED',
    htmlContent: html,
    provider: smtpInfo.provider,
  };

  if (transporter && smtpInfo.configured) {
    const fromAddress = smtpInfo.fromAddress;
    try {
      console.log(`[EmailService] Dispatching registration email via Gmail SMTP to: ${payload.to}`);
      const info = await transporter.sendMail({
        from: fromAddress,
        to: payload.to,
        subject,
        text,
        html,
      });

      logEntry.status = 'SENT';
      logEntry.messageId = info.messageId;
      emailLogs.push(logEntry);
      console.log(`[EmailService] ✅ Successfully delivered email to ${payload.to} via Gmail SMTP. MessageId: ${info.messageId}`);

      return {
        success: true,
        messageId: info.messageId,
        status: 'SENT',
        subject,
        sentTo: payload.to,
        deliveryProvider: smtpInfo.provider,
      };
    } catch (err: any) {
      console.error(`[EmailService] ❌ Gmail SMTP error sending to ${payload.to}:`, err.message);
      
      let userFriendlyError = err.message;
      if (err.message?.includes('535') || err.message?.toLowerCase().includes('badcredentials') || err.message?.toLowerCase().includes('username and password not accepted')) {
        userFriendlyError = 'Gmail SMTP authentication failed. Please ensure you are using a 16-character Google App Password (not your standard Gmail account password). Create one at: https://myaccount.google.com/apppasswords';
      }

      logEntry.status = 'FAILED';
      logEntry.error = userFriendlyError;
      emailLogs.push(logEntry);

      return {
        success: false,
        status: 'FAILED',
        error: userFriendlyError,
        subject,
        sentTo: payload.to,
        deliveryProvider: smtpInfo.provider,
      };
    }
  }

  // Fallback: In-app record when GMAIL_APP_PASSWORD is not configured
  logEntry.status = 'SIMULATED';
  emailLogs.push(logEntry);
  console.log(`[EmailService] In-App Outbox: Registration confirmation email recorded for ${payload.to}`);

  return {
    success: true,
    status: 'SIMULATED',
    subject,
    sentTo: payload.to,
    deliveryProvider: smtpInfo.provider,
  };
}

export interface ContactUsEmailPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sends a contact inquiry email to the designated support/admin address.
 */
export async function sendContactUsEmail(payload: ContactUsEmailPayload): Promise<{
  success: boolean;
  messageId?: string;
  status: 'SENT' | 'SIMULATED' | 'FAILED';
  error?: string;
  deliveryProvider: string;
}> {
  const recipientEmail = (
    process.env.CONTACT_RECEIVER_EMAIL ||
    process.env.GMAIL_USER ||
    process.env.SMTP_USER ||
    'supportmocksphere@gmail.com'
  ).trim();

  const userSubject = payload.subject?.trim() || 'General Inquiry';
  const mailSubject = `📩 [Mock Sphere Contact] ${userSubject} - from ${payload.name}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 24px; }
    .card { background-color: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 28px; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
    .header { border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px; }
    .title { color: #38bdf8; font-size: 20px; font-weight: bold; margin: 0 0 6px 0; }
    .sub { color: #94a3b8; font-size: 13px; margin: 0; }
    .field { margin-bottom: 16px; }
    .label { color: #94a3b8; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 4px; }
    .value { color: #f8fafc; font-size: 14px; font-weight: 600; }
    .msg-box { background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 16px; color: #e2e8f0; font-size: 14px; white-space: pre-wrap; line-height: 1.6; }
    .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #334155; text-align: center; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2 class="title">New Contact Inquiry — Mock Sphere</h2>
      <p class="sub">Submitted via the Mock Sphere website contact form</p>
    </div>
    <div class="field">
      <div class="label">Sender Name</div>
      <div class="value">${escapeHtml(payload.name)}</div>
    </div>
    <div class="field">
      <div class="label">Sender Email</div>
      <div class="value"><a href="mailto:${escapeHtml(payload.email)}" style="color: #38bdf8; text-decoration: none;">${escapeHtml(payload.email)}</a></div>
    </div>
    <div class="field">
      <div class="label">Subject Topic</div>
      <div class="value">${escapeHtml(userSubject)}</div>
    </div>
    <div class="field">
      <div class="label">Message</div>
      <div class="msg-box">${escapeHtml(payload.message)}</div>
    </div>
    <div class="footer">
      Sent via Mock Sphere Secure Contact System • Reply directly to this email to respond to ${escapeHtml(payload.name)}
    </div>
  </div>
</body>
</html>
  `;

  const text = `New Contact Inquiry from ${payload.name} (${payload.email}):\nSubject: ${userSubject}\n\n${payload.message}`;

  const smtpInfo = isSmtpConfigured();
  const transporter = createTransporter();

  if (transporter && smtpInfo.configured) {
    try {
      console.log(`[EmailService] Dispatching contact inquiry from ${payload.email} to ${recipientEmail}...`);
      const info = await transporter.sendMail({
        from: smtpInfo.fromAddress,
        to: recipientEmail,
        replyTo: payload.email,
        subject: mailSubject,
        text,
        html,
      });

      console.log(`[EmailService] ✅ Contact message from ${payload.email} sent to ${recipientEmail}. MessageId: ${info.messageId}`);
      return {
        success: true,
        messageId: info.messageId,
        status: 'SENT',
        deliveryProvider: smtpInfo.provider,
      };
    } catch (err: any) {
      console.error(`[EmailService] ❌ Contact email dispatch failed:`, err.message);
      return {
        success: false,
        status: 'FAILED',
        error: err.message || 'SMTP delivery failed',
        deliveryProvider: smtpInfo.provider,
      };
    }
  }

  // Fallback if SMTP credentials not provided in environment
  console.warn(`[EmailService] SMTP credentials not set. Contact inquiry from ${payload.name} (${payload.email}) recorded.`);
  return {
    success: true,
    status: 'SIMULATED',
    deliveryProvider: smtpInfo.provider,
  };
}

/**
 * Diagnostic test utility to verify Gmail SMTP connection and credentials.
 */
export async function testGmailSmtpConnection(targetTestEmail?: string): Promise<{
  connected: boolean;
  message: string;
  provider: string;
  error?: string;
}> {
  const smtpInfo = isSmtpConfigured();
  if (!smtpInfo.configured) {
    return {
      connected: false,
      provider: smtpInfo.provider,
      message: 'Gmail SMTP credentials (GMAIL_USER and GMAIL_APP_PASSWORD) are not set.',
      error: 'Missing environment credentials. Add GMAIL_USER and GMAIL_APP_PASSWORD to .env or environment secrets.',
    };
  }

  const transporter = createTransporter();
  if (!transporter) {
    return {
      connected: false,
      provider: smtpInfo.provider,
      message: 'Failed to initialize Gmail SMTP transporter.',
      error: 'Invalid transporter configuration.',
    };
  }

  try {
    await transporter.verify();
    
    // If target email is provided, send a quick test verification email
    if (targetTestEmail) {
      await transporter.sendMail({
        from: smtpInfo.fromAddress,
        to: targetTestEmail,
        subject: '🧪 Placement Prep AI - Gmail SMTP Connection Test',
        text: 'This is a verification email confirming that your Gmail SMTP connection is working correctly and ready to send registration emails to candidates.',
        html: `
          <div style="font-family: sans-serif; padding: 20px; background-color: #0f172a; color: #e2e8f0; border-radius: 12px;">
            <h2 style="color: #38bdf8;">Gmail SMTP Connection Verified!</h2>
            <p>Your Placement Preparation AI application successfully connected to <strong>smtp.gmail.com:587</strong> via TLS.</p>
            <p>Candidate welcome emails will be sent directly to registered Gmail inboxes and mobile devices.</p>
          </div>
        `,
      });
    }

    return {
      connected: true,
      provider: smtpInfo.provider,
      message: targetTestEmail
        ? `Gmail SMTP verified! A test verification email was sent to ${targetTestEmail}.`
        : `Connected to Gmail SMTP (smtp.gmail.com:587 TLS) successfully as ${smtpInfo.user}!`,
    };
  } catch (err: any) {
    let msg = err.message;
    if (msg.includes('535') || msg.toLowerCase().includes('badcredentials') || msg.toLowerCase().includes('username and password not accepted')) {
      msg = 'Gmail SMTP Authentication Failed: Incorrect Google App Password. Please generate a 16-character App Password at https://myaccount.google.com/apppasswords';
    }
    return {
      connected: false,
      provider: smtpInfo.provider,
      message: 'Gmail SMTP Connection verification failed.',
      error: msg,
    };
  }
}

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
  senderIp?: string;
}

/**
 * Sends Contact Us messages directly to support email (supportmocksphere@gmail.com).
 */
export async function sendContactFormEmail(payload: ContactFormPayload): Promise<{
  success: boolean;
  status: 'SENT' | 'SIMULATED' | 'FAILED';
  message: string;
  messageId?: string;
  error?: string;
}> {
  const receiverEmail = (process.env.CONTACT_RECEIVER_EMAIL || process.env.GMAIL_USER || 'supportmocksphere@gmail.com').trim();
  const smtpInfo = isSmtpConfigured();
  const transporter = createTransporter();

  const formattedDate = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const emailSubject = `📬 Mock Sphere Contact: [${payload.subject}] from ${payload.name}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Us Inquiry - Mock Sphere</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e2e8f0;line-height:1.6;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#0f172a;padding:30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#1e293b;border-radius:16px;border:1px solid #334155;overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.5);">
          <tr>
            <td style="background:linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);padding:28px 24px;text-align:left;">
              <div style="font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#dbeafe;margin-bottom:6px;">
                🌐 MOCK SPHERE WEBSITE CONTACT
              </div>
              <h2 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;">
                New Inquiry Received
              </h2>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#0f172a;border-radius:12px;padding:16px;border:1px solid #334155;margin-bottom:20px;">
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#94a3b8;width:120px;"><strong>Sender Name:</strong></td>
                  <td style="padding:6px 0;font-size:13px;color:#ffffff;font-weight:700;">${payload.name}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#94a3b8;"><strong>Sender Email:</strong></td>
                  <td style="padding:6px 0;font-size:13px;color:#60a5fa;font-family:monospace;font-weight:600;">
                    <a href="mailto:${payload.email}" style="color:#60a5fa;text-decoration:none;">${payload.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#94a3b8;"><strong>Topic / Subject:</strong></td>
                  <td style="padding:6px 0;font-size:13px;color:#fbbf24;font-weight:700;">${payload.subject}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;color:#94a3b8;"><strong>Submitted At:</strong></td>
                  <td style="padding:6px 0;font-size:13px;color:#cbd5e1;">${formattedDate}</td>
                </tr>
              </table>

              <div style="margin-bottom:20px;">
                <h3 style="margin:0 0 8px;font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">
                  💬 Message Content:
                </h3>
                <div style="background-color:#0f172a;border-radius:12px;padding:18px;border:1px solid #334155;color:#f8fafc;font-size:14px;white-space:pre-wrap;word-break:break-word;line-height:1.6;">
${payload.message}
                </div>
              </div>

              <div style="text-align:center;margin-top:24px;">
                <a href="mailto:${payload.email}?subject=Re: ${encodeURIComponent(payload.subject)}" style="display:inline-block;background-color:#2563eb;color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;">
                  Reply Direct to Sender &rarr;
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#0f172a;padding:16px 24px;border-top:1px solid #334155;text-align:center;">
              <p style="margin:0;font-size:11px;color:#64748b;">
                Mock Sphere Automated Contact Service &bull; Target Inbox: ${receiverEmail}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
New Contact Us Inquiry - Mock Sphere
-----------------------------------
Sender Name: ${payload.name}
Sender Email: ${payload.email}
Topic: ${payload.subject}
Submitted At: ${formattedDate}

Message:
${payload.message}

Reply to: ${payload.email}
  `.trim();

  const logId = `contact_log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const logEntry: EmailLogEntry = {
    id: logId,
    to: receiverEmail,
    userName: payload.name,
    subject: emailSubject,
    type: 'CONTACT_US',
    sentAt: new Date().toISOString(),
    status: 'SIMULATED',
    htmlContent: html,
    provider: smtpInfo.provider,
  };

  if (transporter && smtpInfo.configured) {
    try {
      console.log(`[EmailService] Sending Contact Us message to: ${receiverEmail} from ${payload.email}`);
      const info = await transporter.sendMail({
        from: smtpInfo.fromAddress,
        to: receiverEmail,
        replyTo: `"${payload.name}" <${payload.email}>`,
        subject: emailSubject,
        text,
        html,
      });

      logEntry.status = 'SENT';
      logEntry.messageId = info.messageId;
      emailLogs.push(logEntry);
      console.log(`[EmailService] ✅ Successfully delivered Contact Us message to ${receiverEmail}. MessageId: ${info.messageId}`);

      return {
        success: true,
        status: 'SENT',
        message: 'Message sent successfully.',
        messageId: info.messageId,
      };
    } catch (err: any) {
      console.error(`[EmailService] ❌ Error delivering contact email to ${receiverEmail}:`, err.message);

      let userFriendlyError = err.message || 'Email delivery failed.';
      if (err.message?.includes('535') || err.message?.toLowerCase().includes('badcredentials')) {
        userFriendlyError = 'SMTP authentication error on server. Please verify GMAIL_APP_PASSWORD credentials.';
      }

      logEntry.status = 'FAILED';
      logEntry.error = userFriendlyError;
      emailLogs.push(logEntry);

      return {
        success: false,
        status: 'FAILED',
        message: userFriendlyError,
        error: userFriendlyError,
      };
    }
  }

  // Fallback: If GMAIL_APP_PASSWORD is not set in environment yet
  logEntry.status = 'SIMULATED';
  emailLogs.push(logEntry);
  console.log(`[EmailService] Contact Us message logged in outbox for ${receiverEmail}.`);

  return {
    success: true,
    status: 'SIMULATED',
    message: 'Message sent successfully.',
  };
}
