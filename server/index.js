// Minimal API server: holds OPENAI_API_KEY so the page never sees it. /api/generate calls OpenAI Chat Completions.
const path = require('path');
const express = require('express');
const cors = require('cors');

try { process.loadEnvFile(path.join(__dirname, '.env')); } // built-in .env loader (Node >= 20.12)
catch (e) { if (e.code !== 'ENOENT') throw e; }            // no .env: fall back to the real environment

const apiKey = process.env.OPENAI_API_KEY; // never sent to the client or logged
const model = process.env.OPENAI_MODEL;
const PORT = Number(process.env.PORT) || 8787;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_TIMEOUT_MS = 30000;
const TTS_URL = 'https://api.openai.com/v1/audio/speech';
const ttsModel = process.env.OPENAI_TTS_MODEL || 'tts-1';
const TTS_VOICE = 'sage'; // calm, lower female voice for the judge's verdict
const TTS_MAX_CHARS = 4096; // OpenAI input limit

const CASE_SYSTEM = [
  'You write cases for "Love Trial", a light courtroom game inside a dating app.',
  'Reply with a single JSON object only: no markdown, no code fences, no text outside the JSON.',
  'Schema: {"title": string, "positionA": string, "positionB": string, "issues": string[]}',
  '- title: a short Korean case name about an everyday couple conflict, in the tone of "12시간 연락두절 사건".',
  '- positionA: one Korean sentence for the side that says the accused is not guilty / did nothing wrong.',
  '- positionB: one Korean sentence for the side that says the accused is guilty / the complaint is justified.',
  '- issues: 2 or 3 Korean one-line points the trial argues about.',
  'Keep it playful and fair to both sides; no real names, no explicit or hateful content.',
].join('\n');

// Thrown with the HTTP status and message the client should get
class ApiError extends Error { constructor(status, message) { super(message); this.status = status; } }

async function chat(messages) {
  let r;
  try {
    r = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages, response_format: { type: 'json_object' } }),
      signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS),
    });
  } catch (e) {
    throw new ApiError(502, `OpenAI request failed: ${e.name === 'TimeoutError' ? 'timed out' : e.message}`);
  }
  const body = await r.json().catch(() => null);
  if (!r.ok) { // details stay in the server log: OpenAI's message can quote part of the key
    console.error(`[server] OpenAI ${r.status}:`, body?.error?.message ?? r.statusText);
    throw new ApiError(502, `OpenAI error ${r.status}${r.status === 401 ? ' (check OPENAI_API_KEY)' : ''}`);
  }
  return body?.choices?.[0]?.message?.content ?? '';
}

// Parsed case, or null when the text is not JSON of the expected shape
function parseCase(text) {
  let c;
  try { c = JSON.parse(text); } catch { return null; }
  const line = v => typeof v === 'string' && v.trim() !== '';
  const ok = c && line(c.title) && line(c.positionA) && line(c.positionB)
    && Array.isArray(c.issues) && c.issues.length >= 2 && c.issues.length <= 3 && c.issues.every(line);
  return ok ? { title: c.title, positionA: c.positionA, positionB: c.positionB, issues: c.issues } : null;
}

async function generateCase(payload) {
  const messages = [{ role: 'system', content: CASE_SYSTEM },
    { role: 'user', content: payload == null || payload === '' ? 'Write one new case.' : `Write one new case. Hints: ${JSON.stringify(payload)}` }];
  for (let attempt = 0; attempt < 2; attempt++) { // one retry on bad JSON
    const c = parseCase(await chat(messages));
    if (c) return c;
  }
  throw new ApiError(502, 'OpenAI returned invalid case JSON twice');
}

const app = express();
// Local dev only: pages served from localhost / 127.0.0.1 on any port
app.use(cors({ origin: /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/ }));
app.use(express.json({ limit: '16kb' }));

app.post('/api/generate', async (req, res) => {
  const { type, payload } = req.body ?? {};
  if (typeof type !== 'string' || !type || payload === undefined) {
    return res.status(400).json({ error: 'body must be { type: string, payload }' });
  }
  if (type !== 'generate_case') return res.status(400).json({ error: `unknown type: ${type}` });
  if (!apiKey || !model) return res.status(500).json({ error: 'server is missing OPENAI_API_KEY or OPENAI_MODEL' });
  try {
    res.json({ type, result: await generateCase(payload) });
  } catch (e) {
    console.error('[server] generate_case:', e.message);
    res.status(e.status ?? 500).json({ error: e.status ? e.message : 'internal error' });
  }
});

// Text to speech: { text } -> audio/mpeg from OpenAI
app.post('/api/tts', async (req, res) => {
  const { text, voice = TTS_VOICE } = req.body ?? {};
  if (typeof text !== 'string' || !text.trim() || text.length > TTS_MAX_CHARS) {
    return res.status(400).json({ error: `body must be { text: non-empty string up to ${TTS_MAX_CHARS} chars }` });
  }
  if (typeof voice !== 'string' || !/^[a-z]{1,20}$/.test(voice)) { // OpenAI checks the name itself; this only keeps junk out
    return res.status(400).json({ error: 'voice must be a lowercase voice name, e.g. "sage"' });
  }
  if (!apiKey) return res.status(500).json({ error: 'server is missing OPENAI_API_KEY' });
  let r;
  try {
    r = await fetch(TTS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: ttsModel, voice, input: text, response_format: 'mp3' }),
      signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS),
    });
  } catch (e) {
    console.error('[server] tts:', e.message);
    return res.status(502).json({ error: `OpenAI request failed: ${e.name === 'TimeoutError' ? 'timed out' : e.message}` });
  }
  if (!r.ok) { // details stay in the server log
    const body = await r.json().catch(() => null);
    console.error(`[server] OpenAI TTS ${r.status}:`, body?.error?.message ?? r.statusText);
    return res.status(502).json({ error: `OpenAI error ${r.status}${r.status === 401 ? ' (check OPENAI_API_KEY)' : ''}` });
  }
  res.type('audio/mpeg').send(Buffer.from(await r.arrayBuffer()));
});

// Bound to loopback: CORS only limits browsers, this keeps the port off the network
app.listen(PORT, '127.0.0.1', () => console.log(`[server] http://127.0.0.1:${PORT} (OPENAI_API_KEY ${apiKey ? 'set' : 'missing'}, OPENAI_MODEL ${model || 'missing'})`));
