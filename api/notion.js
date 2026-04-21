// api/notion.js — Proxy direct vers l'API Notion
const NOTION = 'https://api.notion.com/v1';
const TOKEN = () => process.env.NOTION_TOKEN;
const HDR = () => ({ 'Authorization': `Bearer ${TOKEN()}`, 'Content-Type': 'application/json', 'Notion-Version': '2022-06-28' });

// Flatten Notion property to simple value
function flatProp(name, prop) {
  const t = prop.type;
  if (t === 'title') return { [name]: (prop.title || []).map(t => t.plain_text).join('') };
  if (t === 'rich_text') return { [name]: (prop.rich_text || []).map(t => t.plain_text).join('') };
  if (t === 'number') return { [name]: prop.number };
  if (t === 'select') return { [name]: prop.select?.name || '' };
  if (t === 'multi_select') return { [name]: (prop.multi_select || []).map(s => s.name).join(', ') };
  if (t === 'status') return { [name]: prop.status?.name || '' };
  if (t === 'checkbox') return { [name]: prop.checkbox };
  if (t === 'url') return { ['userDefined:' + name]: prop.url || '' };
  if (t === 'email') return { [name]: prop.email || '' };
  if (t === 'phone_number') return { [name]: prop.phone_number || '' };
  if (t === 'date') {
    const d = prop.date;
    return { [`date:${name}:start`]: d?.start || '', [`date:${name}:end`]: d?.end || '', [`date:${name}:is_datetime`]: d?.start?.includes('T') ? 1 : 0 };
  }
  if (t === 'people') return { [name]: JSON.stringify((prop.people || []).map(p => 'user://' + p.id)) };
  if (t === 'relation') return { [name]: JSON.stringify((prop.relation || []).map(r => 'notion://' + r.id.replace(/-/g, ''))) };
  if (t === 'formula') {
    const f = prop.formula;
    return { [name]: f?.string || f?.number || f?.boolean || '' };
  }
  if (t === 'rollup') {
    const r = prop.rollup;
    if (r?.type === 'number') return { [name]: r.number };
    if (r?.type === 'array') return { [name]: r.array?.map(a => a?.title?.[0]?.plain_text || a?.select?.name || a?.number || '').join(', ') || '' };
    return { [name]: '' };
  }
  if (t === 'created_time') return { [name]: prop.created_time };
  if (t === 'last_edited_time') return { [name]: prop.last_edited_time };
  if (t === 'files') return { [name]: (prop.files || []).map(f => f.file?.url || f.external?.url || '').join(', ') };
  return { [name]: '' };
}

// Flatten a Notion page to simple key-value object
function flattenPage(page) {
  const row = { url: 'notion://' + page.id.replace(/-/g, '') };
  for (const [name, prop] of Object.entries(page.properties || {})) {
    Object.assign(row, flatProp(name, prop));
  }
  return row;
}

// Build Notion property object from flat form data
function buildNotionProps(data, schema) {
  const props = {};
  for (const [key, val] of Object.entries(data)) {
    if (val === undefined || val === null || val === '') continue;
    if (key.startsWith('date:') && key.endsWith(':start')) {
      const name = key.replace('date:', '').replace(':start', '');
      props[name] = { date: { start: val } };
      continue;
    }
    if (key.startsWith('date:') && (key.endsWith(':end') || key.endsWith(':is_datetime'))) continue;
    if (key.startsWith('place:')) continue;
    if (key.startsWith('person:')) {
      const name = key.replace('person:', '');
      if (val) props[name] = { people: [{ id: val }] };
      continue;
    }
    if (key.startsWith('userDefined:')) {
      const name = key.replace('userDefined:', '');
      props[name] = { url: String(val) };
      continue;
    }
    const s = schema?.[key];
    if (!s) continue;
    if (s.type === 'title') props[key] = { title: [{ text: { content: String(val) } }] };
    else if (s.type === 'rich_text' || s.type === 'text') props[key] = { rich_text: [{ text: { content: String(val) } }] };
    else if (s.type === 'number') props[key] = { number: parseFloat(val) || 0 };
    else if (s.type === 'select') props[key] = { select: { name: String(val) } };
    else if (s.type === 'status') props[key] = { status: { name: String(val) } };
    else if (s.type === 'checkbox') props[key] = { checkbox: val === true || val === '__YES__' };
    else if (s.type === 'url') props[key] = { url: String(val) };
    else if (s.type === 'email') props[key] = { email: String(val) };
    else if (s.type === 'phone_number') props[key] = { phone_number: String(val) };
    else if (s.type === 'date') props[key] = { date: { start: String(val) } };
    else if (s.type === 'relation') {
      try {
        const urls = JSON.parse(val);
        props[key] = { relation: urls.map(u => ({ id: u.replace('notion://', '') })) };
      } catch { }
    }
    else if (s.type === 'person') {
      try {
        const users = JSON.parse(val);
        props[key] = { people: users.map(u => ({ id: u.replace('user://', '') })) };
      } catch { }
    }
  }
  return props;
}

export default async function handler(req, res) {
  const { action } = req.query;

  // ── TEST (debug) ──
  if (action === 'test') {
    const t = TOKEN() || '';
    return res.json({ tokenLength: t.length, start: t.slice(0, 8), end: t.slice(-4), exists: !!t });
  }

  if (!TOKEN()) return res.status(500).json({ error: 'NOTION_TOKEN non configuré' });

  try {
    // ── QUERY DATABASE ──
    if (action === 'query' && req.method === 'POST') {
      const { database_id, page_size = 100 } = req.body;
      let all = [];
      let cursor = undefined;
      do {
        const body = { page_size: Math.min(page_size, 100) };
        if (cursor) body.start_cursor = cursor;
        const r = await fetch(`${NOTION}/databases/${database_id}/query`, {
          method: 'POST', headers: HDR(), body: JSON.stringify(body)
        });
        if (!r.ok) { const e = await r.json(); return res.status(r.status).json(e); }
        const data = await r.json();
        all = all.concat(data.results.map(flattenPage));
        cursor = data.has_more ? data.next_cursor : null;
      } while (cursor);
      return res.json({ results: all });
    }

    // ── CREATE PAGE ──
    if (action === 'create' && req.method === 'POST') {
      const { database_id, properties, schema } = req.body;
      const notionProps = buildNotionProps(properties, schema);
      const r = await fetch(`${NOTION}/pages`, {
        method: 'POST', headers: HDR(),
        body: JSON.stringify({ parent: { database_id }, properties: notionProps })
      });
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json(data);
      return res.json({ page: flattenPage(data) });
    }

    // ── UPDATE PAGE ──
    if (action === 'update' && req.method === 'PATCH') {
      const { page_id, properties, schema } = req.body;
      const notionProps = buildNotionProps(properties, schema);
      const r = await fetch(`${NOTION}/pages/${page_id}`, {
        method: 'PATCH', headers: HDR(),
        body: JSON.stringify({ properties: notionProps })
      });
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json(data);
      return res.json({ ok: true });
    }

    // ── ARCHIVE (DELETE) PAGE ──
    if (action === 'archive' && req.method === 'PATCH') {
      const { page_id } = req.body;
      const r = await fetch(`${NOTION}/pages/${page_id}`, {
        method: 'PATCH', headers: HDR(),
        body: JSON.stringify({ archived: true })
      });
      const data = await r.json();
      if (!r.ok) return res.status(r.status).json(data);
      return res.json({ ok: true });
    }

    return res.status(400).json({ error: 'Action inconnue: ' + action });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
