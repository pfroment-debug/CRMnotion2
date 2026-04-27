// api/auth.js — Google OAuth pour @pdj-conseil.fr
import { SignJWT, jwtVerify } from 'jose';

const GOOGLE_AUTH = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO = 'https://www.googleapis.com/oauth2/v2/userinfo';

const CLIENT_ID = () => process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = () => process.env.GOOGLE_CLIENT_SECRET;
const SECRET = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'fallback-secret-change-me-32chars!');
const APP_URL = () => process.env.APP_URL || 'https://cr-mnotion2.vercel.app';
const COOKIE_NAME = 'pdj_session';
const ALLOWED_DOMAIN = 'pdj-conseil.fr';

const SCOPES = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
].join(' ');

// Team mapping: email → Notion user id + role
const TEAM = {
  'p.froment@pdj-conseil.fr': { notionId: '7e764ade-b9b3-4cfe-a5ca-aadc7816660d', short: 'Paul', role: 'Président', color: '#2ECC71' },
  'c.froment@pdj-conseil.fr': { notionId: null, short: 'Christian', role: 'Dir. Financier', color: '#E67E22' },
  'a.hazoume@pdj-conseil.fr': { notionId: '03ee67d9-fca8-4672-a139-4880e4eb406b', short: 'Axel', role: 'Consultant', color: '#E74C3C' },
  'l.brun@pdj-conseil.fr': { notionId: '294d872b-594c-8191-920a-000216bb2c0c', short: 'Lucile', role: 'Consultante', color: '#9B59B6' },
  'g.hermosilla@pdj-conseil.fr': { notionId: 'af436357-51d5-4ae4-9052-f77950ec5c98', short: 'Guillaume', role: 'Consultant', color: '#3498DB' }
};

// Create encrypted JWT
async function createToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(SECRET());
}

// Verify JWT
async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, SECRET());
    return payload;
  } catch { return null; }
}

// Parse cookies from request
function getCookie(req, name) {
  const cookies = req.headers.cookie || '';
  const match = cookies.split(';').find(c => c.trim().startsWith(name + '='));
  return match ? match.split('=').slice(1).join('=').trim() : null;
}

// Set cookie header
function setCookie(name, value, maxAge = 7 * 24 * 3600) {
  return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export default async function handler(req, res) {
  const { action } = req.query;

  // ── TEST: Verify config ──
  if (action === 'test') {
    return res.json({
      hasClientId: !!CLIENT_ID(),
      clientIdStart: (CLIENT_ID()||'').slice(0,20),
      hasClientSecret: !!CLIENT_SECRET(),
      hasAuthSecret: !!process.env.AUTH_SECRET,
      appUrl: APP_URL(),
      redirectUri: `${APP_URL()}/api/auth?action=callback`
    });
  }

  // ── LOGIN: Redirect to Google OAuth ──
  if (action === 'login') {
    const redirect_uri = `${APP_URL()}/api/auth?action=callback`;
    const params = new URLSearchParams({
      client_id: CLIENT_ID(),
      redirect_uri,
      response_type: 'code',
      scope: SCOPES,
      access_type: 'offline',
      prompt: 'consent',
      hd: ALLOWED_DOMAIN // Restrict to @pdj-conseil.fr
    });
    return res.redirect(302, `${GOOGLE_AUTH}?${params}`);
  }

  // ── CALLBACK: Exchange code for tokens ──
  if (action === 'callback') {
    const { code, error } = req.query;
    if (error || !code) return res.redirect(302, `${APP_URL()}?error=auth_failed_${error||'no_code'}`);

    try {
      // Exchange code for tokens
      const redirect_uri = `${APP_URL()}/api/auth?action=callback`;
      const tokenRes = await fetch(GOOGLE_TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: CLIENT_ID(),
          client_secret: CLIENT_SECRET(),
          redirect_uri,
          grant_type: 'authorization_code'
        })
      });
      const tokens = await tokenRes.json();
      if (!tokens.access_token) {
        const errDetail = tokens.error_description || tokens.error || 'unknown';
        return res.redirect(302, `${APP_URL()}?error=${encodeURIComponent(errDetail)}`);
      }

      // Get user info
      const userRes = await fetch(GOOGLE_USERINFO, {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });
      const user = await userRes.json();

      // Verify domain
      if (!user.email?.endsWith('@' + ALLOWED_DOMAIN)) {
        return res.redirect(302, `${APP_URL()}?error=domain_not_allowed`);
      }

      // Create session JWT
      const jwt = await createToken({
        email: user.email,
        name: user.name,
        picture: user.picture,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expiry: Date.now() + (tokens.expires_in * 1000)
      });

      res.setHeader('Set-Cookie', setCookie(COOKIE_NAME, jwt));
      return res.redirect(302, APP_URL());

    } catch (e) {
      return res.redirect(302, `${APP_URL()}?error=${encodeURIComponent(e.message)}`);
    }
  }

  // ── ME: Return current user info ──
  if (action === 'me') {
    const token = getCookie(req, COOKIE_NAME);
    if (!token) return res.status(401).json({ error: 'Non connecté' });

    const session = await verifyToken(token);
    if (!session) return res.status(401).json({ error: 'Session expirée' });

    const teamInfo = TEAM[session.email] || null;

    return res.json({
      email: session.email,
      name: session.name,
      picture: session.picture,
      team: teamInfo,
      tokenValid: session.token_expiry > Date.now()
    });
  }

  // ── LOGOUT: Clear session ──
  if (action === 'logout') {
    res.setHeader('Set-Cookie', setCookie(COOKIE_NAME, '', 0));
    return res.redirect(302, APP_URL());
  }

  // ── REFRESH: Get fresh access token ──
  if (action === 'refresh') {
    const token = getCookie(req, COOKIE_NAME);
    if (!token) return res.status(401).json({ error: 'Non connecté' });

    const session = await verifyToken(token);
    if (!session?.refresh_token) return res.status(401).json({ error: 'Pas de refresh token' });

    try {
      const tokenRes = await fetch(GOOGLE_TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: CLIENT_ID(),
          client_secret: CLIENT_SECRET(),
          refresh_token: session.refresh_token,
          grant_type: 'refresh_token'
        })
      });
      const tokens = await tokenRes.json();
      if (!tokens.access_token) return res.status(401).json({ error: 'Refresh échoué' });

      // Update session with new token
      const jwt = await createToken({
        ...session,
        access_token: tokens.access_token,
        token_expiry: Date.now() + (tokens.expires_in * 1000)
      });

      res.setHeader('Set-Cookie', setCookie(COOKIE_NAME, jwt));
      return res.json({ ok: true });

    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── TOKEN: Return access token for API calls (internal use) ──
  if (action === 'token') {
    const token = getCookie(req, COOKIE_NAME);
    if (!token) return res.status(401).json({ error: 'Non connecté' });

    const session = await verifyToken(token);
    if (!session) return res.status(401).json({ error: 'Session expirée' });

    return res.json({ access_token: session.access_token, expiry: session.token_expiry });
  }

  return res.status(400).json({ error: 'Action inconnue: ' + action });
}
