// api/google.js — Proxy Google Calendar, Gmail, Drive
import { jwtVerify } from 'jose';

const SECRET = () => new TextEncoder().encode(process.env.AUTH_SECRET || 'fallback-secret-change-me-32chars!');
const COOKIE_NAME = 'pdj_session';
const GCAL = 'https://www.googleapis.com/calendar/v3';
const GMAIL = 'https://gmail.googleapis.com/gmail/v1';
const GDRIVE = 'https://www.googleapis.com/drive/v3';

function getCookie(req, name) {
  const cookies = req.headers.cookie || '';
  const match = cookies.split(';').find(c => c.trim().startsWith(name + '='));
  return match ? match.split('=').slice(1).join('=').trim() : null;
}

async function getSession(req) {
  const token = getCookie(req, COOKIE_NAME);
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, SECRET());
    return payload;
  } catch { return null; }
}

export default async function handler(req, res) {
  const session = await getSession(req);
  if (!session) return res.status(401).json({ error: 'Non connecté' });

  const { service, action } = req.query;
  const token = session.access_token;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  try {
    // ══════════════════════════════
    // GOOGLE CALENDAR
    // ══════════════════════════════
    if (service === 'calendar') {

      // List upcoming events
      if (action === 'list') {
        const now = new Date().toISOString();
        const maxDate = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
        const r = await fetch(`${GCAL}/calendars/primary/events?timeMin=${now}&timeMax=${maxDate}&maxResults=20&orderBy=startTime&singleEvents=true`, { headers });
        if (!r.ok) { const e = await r.json(); return res.status(r.status).json(e); }
        const data = await r.json();
        const events = (data.items || []).map(e => ({
          id: e.id,
          title: e.summary || '',
          start: e.start?.dateTime || e.start?.date || '',
          end: e.end?.dateTime || e.end?.date || '',
          location: e.location || '',
          description: e.description || '',
          link: e.htmlLink || '',
          attendees: (e.attendees || []).map(a => a.email)
        }));
        return res.json({ events });
      }

      // Create event
      if (action === 'create' && req.method === 'POST') {
        const { summary, description, start, end, attendees, location } = req.body;
        const event = {
          summary,
          description: description || '',
          location: location || '',
          start: start.includes('T') ? { dateTime: start, timeZone: 'Europe/Paris' } : { date: start },
          end: end ? (end.includes('T') ? { dateTime: end, timeZone: 'Europe/Paris' } : { date: end }) : (start.includes('T') ? { dateTime: new Date(new Date(start).getTime() + 3600000).toISOString(), timeZone: 'Europe/Paris' } : { date: start }),
          attendees: (attendees || []).map(email => ({ email })),
          reminders: { useDefault: true }
        };
        const r = await fetch(`${GCAL}/calendars/primary/events?sendUpdates=all`, {
          method: 'POST', headers, body: JSON.stringify(event)
        });
        const data = await r.json();
        if (!r.ok) return res.status(r.status).json(data);
        return res.json({ id: data.id, link: data.htmlLink, summary: data.summary });
      }
    }

    // ══════════════════════════════
    // GMAIL
    // ══════════════════════════════
    if (service === 'gmail') {

      // Search emails
      if (action === 'search') {
        const { q, maxResults = 10 } = req.method === 'POST' ? req.body : req.query;
        if (!q) return res.status(400).json({ error: 'Paramètre q requis' });

        const r = await fetch(`${GMAIL}/users/me/messages?q=${encodeURIComponent(q)}&maxResults=${maxResults}`, { headers });
        if (!r.ok) { const e = await r.json(); return res.status(r.status).json(e); }
        const list = await r.json();

        // Fetch details for each message
        const messages = [];
        for (const msg of (list.messages || []).slice(0, 10)) {
          const mr = await fetch(`${GMAIL}/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`, { headers });
          if (!mr.ok) continue;
          const md = await mr.json();
          const hdrs = {};
          (md.payload?.headers || []).forEach(h => { hdrs[h.name] = h.value; });
          messages.push({
            id: md.id,
            threadId: md.threadId,
            from: hdrs.From || '',
            to: hdrs.To || '',
            subject: hdrs.Subject || '',
            date: hdrs.Date || '',
            snippet: md.snippet || ''
          });
        }
        return res.json({ messages });
      }
    }

    // ══════════════════════════════
    // GOOGLE DRIVE
    // ══════════════════════════════
    if (service === 'drive') {

      // Search files
      if (action === 'search') {
        const { q, maxResults = 10 } = req.method === 'POST' ? req.body : req.query;
        if (!q) return res.status(400).json({ error: 'Paramètre q requis' });

        const query = `name contains '${q.replace(/'/g, "\\'")}'`;
        const r = await fetch(`${GDRIVE}/files?q=${encodeURIComponent(query)}&pageSize=${maxResults}&fields=files(id,name,mimeType,webViewLink,modifiedTime,iconLink)&orderBy=modifiedTime desc`, { headers });
        if (!r.ok) { const e = await r.json(); return res.status(r.status).json(e); }
        const data = await r.json();
        const files = (data.files || []).map(f => ({
          id: f.id,
          name: f.name,
          type: f.mimeType,
          link: f.webViewLink,
          modified: f.modifiedTime,
          icon: f.iconLink
        }));
        return res.json({ files });
      }

      // List recent files
      if (action === 'recent') {
        const r = await fetch(`${GDRIVE}/files?pageSize=15&fields=files(id,name,mimeType,webViewLink,modifiedTime)&orderBy=viewedByMeTime desc`, { headers });
        if (!r.ok) { const e = await r.json(); return res.status(r.status).json(e); }
        const data = await r.json();
        return res.json({ files: data.files || [] });
      }
    }

    return res.status(400).json({ error: `Service/action inconnu: ${service}/${action}` });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
