// Minimal API server: holds OPENAI_API_KEY so the page never sees it. /api/generate echoes for now; the OpenAI call comes next.
const path = require('path');
const express = require('express');
const cors = require('cors');

try { process.loadEnvFile(path.join(__dirname, '.env')); } // built-in .env loader (Node >= 20.12)
catch (e) { if (e.code !== 'ENOENT') throw e; }            // no .env: fall back to the real environment

const apiKey = process.env.OPENAI_API_KEY; // never sent to the client or logged
const PORT = Number(process.env.PORT) || 8787;

const app = express();
// Local dev only: pages served from localhost / 127.0.0.1 on any port
app.use(cors({ origin: /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/ }));
app.use(express.json({ limit: '16kb' }));

app.post('/api/generate', (req, res) => {
  const { type, payload } = req.body ?? {};
  if (typeof type !== 'string' || !type || payload === undefined) {
    return res.status(400).json({ error: 'body must be { type: string, payload }' });
  }
  res.json({ type, payload, echo: true });
});

// Bound to loopback: CORS only limits browsers, this keeps the port off the network
app.listen(PORT, '127.0.0.1', () => console.log(`[server] http://127.0.0.1:${PORT} (OPENAI_API_KEY ${apiKey ? 'set' : 'missing'})`));
