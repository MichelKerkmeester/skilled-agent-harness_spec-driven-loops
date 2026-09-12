// Minimal stdio JSON-RPC client for the obsidian MCP server.
// Usage: node mcpcall.cjs <evidence-id> <list|call> [toolName] [jsonArgs]
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const EV = path.join(__dirname, 'evidence');
fs.mkdirSync(EV, { recursive: true });

const [, , id, mode, toolName, jsonArgs] = process.argv;
const env = { ...process.env };
for (const line of fs.readFileSync(process.env.ENVFILE, 'utf8').split('\n')) {
  const m = line.match(/^obsidian_(OBSIDIAN_[A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
}
const t0 = Date.now();
const p = spawn('npx', ['-y', 'obsidian-mcp-server@latest'], { env, stdio: ['pipe', 'pipe', 'pipe'] });
let out = '', err = '';
p.stdout.on('data', d => { out += d; });
p.stderr.on('data', d => { err += d; });

const send = o => p.stdin.write(JSON.stringify(o) + '\n');
send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'probe', version: '1' } } });

let phase = 0;
const tick = setInterval(() => {
  if (phase === 0 && out.includes('"id":1')) {
    phase = 1;
    send({ jsonrpc: '2.0', method: 'notifications/initialized' });
    if (mode === 'list') send({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
    else send({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: toolName, arguments: JSON.parse(jsonArgs || '{}') } });
  } else if (phase === 1 && out.includes('"id":2')) {
    phase = 2;
    finish(0);
  }
}, 50);

const timeout = setTimeout(() => finish(124), 120000);

function finish(rc) {
  clearInterval(tick); clearTimeout(timeout);
  const ms = Date.now() - t0;
  try { p.kill(); } catch {}
  fs.writeFileSync(path.join(EV, id + '.out'), out);
  fs.writeFileSync(path.join(EV, id + '.err'), err);
  fs.writeFileSync(path.join(EV, id + '.rc'), String(rc));
  fs.writeFileSync(path.join(EV, id + '.ms'), String(ms));
  fs.writeFileSync(path.join(EV, id + '.cmd'), `mcp ${mode} ${toolName || ''} ${jsonArgs || ''}`);
  console.log(`[${id}] rc=${rc} ms=${ms}`);
  const lines = out.split('\n').filter(Boolean);
  const last = lines[lines.length - 1] || '';
  console.log('--- last frame ---');
  console.log(last.slice(0, 4000));
  process.exit(0);
}
