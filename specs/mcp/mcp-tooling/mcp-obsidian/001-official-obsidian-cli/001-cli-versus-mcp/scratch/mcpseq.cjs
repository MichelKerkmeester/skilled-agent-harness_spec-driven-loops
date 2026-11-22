// Runs a sequence of tool calls in ONE long-lived server session.
// Records per-call latency (warm) and the full response frame per call.
// Usage: node mcpseq.cjs <evidence-id> <calls.json>
const { spawn } = require('child_process');
const fs = require('fs'); const path = require('path');
const EV = path.join(__dirname, 'evidence'); fs.mkdirSync(EV, { recursive: true });
const [, , id, callsFile] = process.argv;
const calls = JSON.parse(fs.readFileSync(callsFile, 'utf8'));
const env = { ...process.env };
for (const line of fs.readFileSync(process.env.ENVFILE, 'utf8').split('\n')) {
  const m = line.match(/^obsidian_(OBSIDIAN_[A-Z_]+)=(.*)$/); if (m) env[m[1]] = m[2];
}
const t0 = Date.now();
const p = spawn('npx', ['-y', 'obsidian-mcp-server@latest'], { env, stdio: ['pipe', 'pipe', 'pipe'] });
let buf = ''; let err = ''; const pending = new Map(); const results = []; const elicits = [];
p.stderr.on('data', d => { err += d; });
p.stdout.on('data', d => {
  buf += d;
  let i;
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i); buf = buf.slice(i + 1);
    if (!line.trim()) continue;
    let msg; try { msg = JSON.parse(line); } catch { continue; }
    if (msg.method === 'elicitation/create') {
      elicits.push(msg.params);
      p.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: msg.id, result: { action: 'accept', content: { confirm: true } } }) + '\n');
      continue;
    }
    const rec = pending.get(msg.id);
    if (rec) { pending.delete(msg.id); rec.resolve({ ms: Date.now() - rec.t, frame: msg }); }
  }
});
const send = (id, method, params) => new Promise(res => {
  pending.set(id, { t: Date.now(), resolve: res });
  p.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
});
(async () => {
  const boot = await send(1, 'initialize', { protocolVersion: '2024-11-05', capabilities: { elicitation: {} }, clientInfo: { name: 'probe', version: '1' } });
  p.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
  const startupMs = Date.now() - t0;
  let n = 1;
  for (const c of calls) {
    n += 1;
    const r = await send(n, 'tools/call', { name: c.tool, arguments: c.args });
    const isErr = !!(r.frame.result && r.frame.result.isError);
    const text = r.frame.result && r.frame.result.content && r.frame.result.content[0] ? r.frame.result.content[0].text : JSON.stringify(r.frame);
    results.push({ label: c.label, tool: c.tool, args: c.args, ms: r.ms, isError: isErr, text });
    console.log(`### ${c.label} :: ${c.tool} isError=${isErr} ms=${r.ms}`);
    console.log(String(text).slice(0, 500)); console.log();
  }
  fs.writeFileSync(path.join(EV, id + '.json'), JSON.stringify({ startupMs, results, elicits }, null, 2));
  fs.writeFileSync(path.join(EV, id + '.err'), err);
  console.log(`[startup+initialize ms=${startupMs}] evidence: ${id}.json`);
  p.kill(); process.exit(0);
})();
