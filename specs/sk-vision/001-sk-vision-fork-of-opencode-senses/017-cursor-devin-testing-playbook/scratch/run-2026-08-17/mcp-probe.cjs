#!/usr/bin/env node
// Standalone MCP-server probe: speaks JSON-RPC over stdio to the built sk-vision
// server, asserts the advertised tool count, then exercises status + OCR so the
// server's real OCR output is captured as the ground-truth the model dispatches
// are judged against.
const { spawn } = require('node:child_process');
const path = require('node:path');

const REPO = path.resolve(__dirname, '../../../../../..');
const SERVER = path.join(REPO, '.opencode/skills/sk-vision/vision-runtime/dist/mcp-server.js');
const IMG = path.join(__dirname, 'ocr-fixture.png');

const proc = spawn('node', [SERVER], { cwd: REPO, stdio: ['pipe', 'pipe', 'pipe'] });
let buf = '';
const pending = new Map();
let nextId = 1;
const out = { steps: [] };

proc.stdout.on('data', (d) => {
  buf += d.toString();
  let idx;
  while ((idx = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, idx).trim();
    buf = buf.slice(idx + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  }
});
proc.stderr.on('data', () => {});

function rpc(method, params, timeoutMs = 180000) {
  const id = nextId++;
  const req = { jsonrpc: '2.0', id, method, params };
  proc.stdin.write(JSON.stringify(req) + '\n');
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout ${method}`)), timeoutMs);
    pending.set(id, (m) => { clearTimeout(t); resolve(m); });
  });
}

function notify(method, params) {
  proc.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
}

(async () => {
  try {
    const init = await rpc('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'vsn-017-probe', version: '1.0.0' },
    });
    out.steps.push({ step: 'initialize', serverInfo: init.result?.serverInfo });
    notify('notifications/initialized', {});

    const tl = await rpc('tools/list', {});
    const tools = (tl.result?.tools || []).map((t) => t.name);
    out.steps.push({ step: 'tools/list', count: tools.length, tools });

    const st = await rpc('tools/call', { name: 'sk_vision_status', arguments: {} });
    out.steps.push({ step: 'sk_vision_status', text: textOf(st) });

    const oc = await rpc('tools/call', { name: 'sk_vision_ocr', arguments: { path: IMG } });
    out.steps.push({ step: 'sk_vision_ocr', image: IMG, text: textOf(oc) });

    console.log(JSON.stringify(out, null, 2));
    proc.kill('SIGKILL');
    process.exit(0);
  } catch (e) {
    out.error = String(e && e.message || e);
    console.log(JSON.stringify(out, null, 2));
    proc.kill('SIGKILL');
    process.exit(1);
  }
})();

function textOf(msg) {
  const c = msg.result?.content;
  if (Array.isArray(c)) return c.map((x) => x.text || '').join('\n');
  if (msg.error) return 'ERROR: ' + JSON.stringify(msg.error);
  return JSON.stringify(msg.result);
}
