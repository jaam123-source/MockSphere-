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
  type: 'REGISTRATION_WELCOME' | 'TEST_EMAIL' | 'INTERVIEW_STARTED';
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
