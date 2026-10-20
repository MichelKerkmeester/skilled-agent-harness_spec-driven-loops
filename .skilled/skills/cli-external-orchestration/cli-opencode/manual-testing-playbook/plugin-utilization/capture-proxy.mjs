// ───────────────────────────────────────────────────────────────
// MODULE: Model Request Capture Proxy
// ───────────────────────────────────────────────────────────────
// A plugin's system-prompt injection never reaches the run's event stream, so
// the only place to see it is the request OpenCode sends to the model. This
// proxy forwards every request to the gateway unchanged and appends one JSON
// line per chat request holding the system prompt, the offered tool names and
// the tool results. Request headers, which carry the API key, are never
// written.
//
// Usage: node capture-proxy.mjs <port> <capture.jsonl> [upstream-origin]
'use strict';

import http from 'node:http';
import https from 'node:https';
import { appendFileSync } from 'node:fs';

const port = Number(process.argv[2]);
const capturePath = process.argv[3];
const upstream = new URL(process.argv[4] || 'https://api.llmgateway.io');
// Forwarded requests carry the API key, so plain HTTP is allowed only to a local
// test upstream on this machine.
const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(upstream.hostname);
if (upstream.protocol !== 'https:' && !(upstream.protocol === 'http:' && loopback)) {
  process.stderr.write(`refusing a non-HTTPS upstream: ${upstream.origin}\n`);
  process.exit(2);
}
const transport = upstream.protocol === 'http:' ? http : https;

if (!Number.isInteger(port) || !capturePath) {
  process.stderr.write('usage: node capture-proxy.mjs <port> <capture.jsonl> [upstream-origin]\n');
  process.exit(2);
}

function messageText(message) {
  if (typeof message?.content === 'string') return message.content;
  if (Array.isArray(message?.content)) return message.content.map((part) => part?.text || '').join('\n');
  return '';
}

function record(url, body) {
  let request;
  try {
    request = JSON.parse(body.toString('utf8'));
  } catch {
    return;
  }
  if (!Array.isArray(request?.messages)) return;
  const messages = request.messages;
  appendFileSync(capturePath, `${JSON.stringify({
    ts: new Date().toISOString(),
    path: url,
    model: request.model,
    system: messages.filter((m) => m.role === 'system').map(messageText),
    tools: (request.tools || []).map((t) => t.function?.name || t.name),
    roles: messages.map((m) => m.role),
    toolResults: messages.filter((m) => m.role === 'tool').map((m) => messageText(m).slice(0, 4000)),
  })}\n`);
}

http.createServer((req, res) => {
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    // A capture failure must never break the run it observes.
    try { record(req.url, body); } catch { /* keep forwarding */ }
    const headers = { ...req.headers, host: upstream.host, 'content-length': String(body.length) };
    const forward = transport.request(
      { hostname: upstream.hostname, port: upstream.port || (transport === https ? 443 : 80), path: req.url, method: req.method, headers },
      (upstreamRes) => {
        res.writeHead(upstreamRes.statusCode, upstreamRes.headers);
        upstreamRes.pipe(res);
      },
    );
    forward.on('error', (error) => {
      res.writeHead(502);
      res.end(String(error.message));
    });
    forward.end(body);
  });
}).listen(port, '127.0.0.1', () => appendFileSync(`${capturePath}.ready`, 'ready\n'));
