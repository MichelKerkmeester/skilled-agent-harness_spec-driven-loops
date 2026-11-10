// A stand-in OpenAI-compatible endpoint: records each request body to a JSONL
// file and answers chat completions with a fixed short reply, so no real model
// is ever called.
const http = require('node:http');
const fs = require('node:fs');

const [port, logFile] = process.argv.slice(2);
const REPLY = 'CAPTURE-OK';

http.createServer((req, res) => {
  let raw = '';
  req.on('data', (c) => { raw += c; });
  req.on('end', () => {
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { body = { unparsed: raw.slice(0, 500) }; }
    fs.appendFileSync(logFile, JSON.stringify({ at: Date.now(), method: req.method, url: req.url, body }) + '\n');
    if (req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ object: 'list', data: [{ id: 'fake', object: 'model' }] }));
      return;
    }
    const id = 'chatcmpl-capture';
    const created = Math.floor(Date.now() / 1000);
    const model = body?.model || 'fake';
    if (body?.stream) {
      res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive' });
      const chunk = (delta, finish) => `data: ${JSON.stringify({ id, object: 'chat.completion.chunk', created, model, choices: [{ index: 0, delta, finish_reason: finish }] })}\n\n`;
      res.write(chunk({ role: 'assistant', content: REPLY }, null));
      res.write(chunk({}, 'stop'));
      res.write(`data: ${JSON.stringify({ id, object: 'chat.completion.chunk', created, model, choices: [], usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } })}\n\n`);
      res.end('data: [DONE]\n\n');
    } else {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ id, object: 'chat.completion', created, model, choices: [{ index: 0, message: { role: 'assistant', content: REPLY }, finish_reason: 'stop' }], usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 } }));
    }
  });
}).listen(Number(port), '127.0.0.1', () => console.log(`capture listening on ${port}`));
