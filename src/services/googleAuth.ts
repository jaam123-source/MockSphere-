import { ApiService, setStoredAuth } from './api';
import { User } from '../types';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            prompt?: string;
            callback: (response: { access_token?: string; error?: string; error_description?: string }) => void;
            error_callback?: (err: any) => void;
          }) => {
            requestAccessToken: (options?: { prompt?: string }) => void;
          };
        };
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: any) => void) => void;
        };
      };
    };
  }
}

const DEFAULT_CLIENT_ID =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID || '866683821439-rwus45cfiomfvtyer4atma.apps.googleusercontent.com';

/**
 * Wait for Google Identity Services script to be ready
 */
export async function waitForGoogleScript(timeoutMs = 3000): Promise<boolean> {
  if (window.google?.accounts?.oauth2 || window.google?.accounts?.id) {
    return true;
  }

  const startTime = Date.now();
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window.google?.accounts?.oauth2 || window.google?.accounts?.id) {
        clearInterval(interval);
        resolve(true);
      } else if (Date.now() - startTime > timeoutMs) {
        clearInterval(interval);
        resolve(false);
      }
    }, 100);
  });
}

/**
 * Fetch verified Google user info directly from Google's OAuth API
 */
async function fetchGoogleUserInfo(accessToken: string): Promise<{
  email: string;
  name: string;
  picture?: string;
  sub: string;
}> {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Could not retrieve user details from Google. Please try again.');
  }

  return response.json();
}

/**
 * Initiates the Google Sign-In Account Chooser flow.
 * If Google OAuth Client ID is configured and popup succeeds, it uses verified Google OAuth.
 * Otherwise, it alerts the caller to fall back to direct Google Account entry.
 */
export async function promptGoogleSignIn(): Promise<{ user: User; token: string; message?: string }> {
  if (!DEFAULT_CLIENT_ID) {
    throw new Error('OAUTH_CLIENT_NOT_CONFIGURED');
  }

  const isScriptLoaded = await waitForGoogleScript();
  if (!isScriptLoaded) {
    throw new Error('GOOGLE_SCRIPT_UNAVAILABLE');
  }

  return new Promise((resolve, reject) => {
    let resolved = false;

    try {
      const tokenClient = window.google!.accounts.oauth2.initTokenClient({
        client_id: DEFAULT_CLIENT_ID,
        scope: 'email profile openid',
        prompt: 'select_account',
        callback: async (tokenResponse) => {
          if (resolved) return;

          if (tokenResponse.error) {
            resolved = true;
            if (tokenResponse.error === 'popup_closed_by_user' || tokenResponse.error === 'access_denied') {
              reject(new Error('Google sign-in popup was closed or cancelled.'));
            } else {
              reject(new Error(tokenResponse.error_description || tokenResponse.error));
            }
            return;
          }

          if (!tokenResponse.access_token) {
            resolved = true;
            reject(new Error('No access token received from Google.'));
            return;
          }

          try {
            const googleUserInfo = await fetchGoogleUserInfo(tokenResponse.access_token);
            if (!googleUserInfo.email) {
              throw new Error('Google did not return an email address.');
            }

            const authResult = await ApiService.googleAuth({
              credential: tokenResponse.access_token,
              email: googleUserInfo.email,
              name: googleUserInfo.name || googleUserInfo.email.split('@')[0],
              avatar_url: googleUserInfo.picture,
              google_id: googleUserInfo.sub,
            });

            setStoredAuth(authResult.token, authResult.user);
            resolved = true;
            resolve(authResult);
          } catch (err: any) {
            resolved = true;
            reject(new Error(err.message || 'Failed to authenticate Google account on server.'));
          }
        },
        error_callback: (err) => {
          if (!resolved) {
            resolved = true;
            reject(new Error(err?.message || 'Google account chooser window encountered an error.'));
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    } catch (err: any) {
      if (!resolved) {
        resolved = true;
        reject(new Error(err?.message || 'Could not launch Google Sign-In.'));
      }
    }
  });
}
