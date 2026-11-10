// Runs one cheap OpenCode 2 dispatch per case against a private server in a
// throwaway workspace, then reads each new session's messages to see which
// agent served it. The server password never leaves this process tree.
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');

const [ws, outDir] = process.argv.slice(2);
const MODEL = 'llmgateway/deepseek-v4.1-flash';
const REPLY = 'Reply with exactly AGENT-PROBE-OK and nothing else. Do not use any tool.';
const cases = [
  { label: 'agent-orchestrate', args: ['--agent', 'orchestrate'], prompt: REPLY },
  { label: 'agent-review', args: ['--agent', 'review'], prompt: REPLY },
  { label: 'agent-general', args: ['--agent', 'general'], prompt: REPLY },
  { label: 'agent-unknown', args: ['--agent', 'no-such-agent-xyz'], prompt: REPLY },
  { label: 'body-at-review', args: [], prompt: `As @review: ${REPLY}` },
];

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agentrun-'));
const env = { ...process.env, OPENCODE_DB: path.join(temp, 'private.db'), XDG_DATA_HOME: path.join(temp, 'data') };
fs.mkdirSync(env.XDG_DATA_HOME, { recursive: true });
fs.mkdirSync(outDir, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const freePort = () => new Promise((resolve, reject) => {
  const s = net.createServer(); s.on('error', reject);
  s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => resolve(port)); });
});

(async () => {
  const port = await freePort();
  const url = `http://127.0.0.1:${port}`;
  const child = spawn('opencode2', ['serve', '--port', String(port)], { cwd: ws, env, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stderr.on('data', () => {});
  const password = await new Promise((resolve) => {
    let buf = '';
    const t = setTimeout(() => resolve(null), 30000);
    child.stdout.on('data', (c) => {
      buf += c;
      const m = /server password (\S+)/.exec(buf);
      if (m && buf.includes(`server listening on ${url}`)) { clearTimeout(t); resolve(m[1]); }
    });
    child.on('exit', () => resolve(null));
  });
  const summary = [];
  try {
    if (!password) throw new Error('server did not start');
    const cenv = { ...env, OPENCODE_PASSWORD: password };
    const api = (p, extra = []) => {
      const r = spawnSync('opencode2', ['api', '--server', url, 'GET', p, '--param', `location[directory]=${ws}`, ...extra],
        { cwd: ws, env: cenv, encoding: 'utf8', timeout: 30000, maxBuffer: 64 * 1024 * 1024 });
      try { return JSON.parse(r.stdout); } catch { return { unparsed: (r.stdout || '').slice(0, 300), status: r.status, err: (r.stderr || '').slice(0, 300) }; }
    };
    // Let the instance finish loading the agent list before the first run.
    for (let i = 0; i < 15; i++) { const b = api('/api/agent'); if ((b?.data || []).length >= 18) break; await sleep(2000); }
    for (const c of cases) {
      const args = ['run', '--server', url, '-m', MODEL, ...c.args, '--format', 'json', c.prompt];
      const r = spawnSync('opencode2', args, { cwd: ws, env: cenv, encoding: 'utf8', timeout: 240000, input: '', maxBuffer: 64 * 1024 * 1024 });
      fs.writeFileSync(path.join(outDir, `${c.label}.stdout.jsonl`), r.stdout || '');
      fs.writeFileSync(path.join(outDir, `${c.label}.stderr.txt`), r.stderr || '');
      const events = (r.stdout || '').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
      const sid = events.find((e) => e.sessionID)?.sessionID || null;
      const text = events.filter((e) => e.type === 'text').map((e) => e.part?.text).join('');
      const tools = events.filter((e) => e.type === 'tool_use').map((e) => e.part?.tool);
      const cost = events.filter((e) => e.type === 'step_finish').reduce((s, e) => s + (e.part?.cost || 0), 0);
      let messages = null;
      if (sid) {
        messages = api(`/api/session/${sid}/message`);
        fs.writeFileSync(path.join(outDir, `${c.label}.messages.json`), JSON.stringify(messages, null, 2));
      }
      summary.push({ label: c.label, argv: ['opencode2', ...args.slice(0, -1), '<prompt>'], exit: r.status, signal: r.signal, sessionID: sid, text, tools, cost, stderrHead: (r.stderr || '').slice(0, 300) });
    }
  } finally {
    child.kill('SIGTERM');
    await sleep(1500);
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    fs.rmSync(temp, { recursive: true, force: true });
  }
  fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
  for (const s of summary) console.log(JSON.stringify({ label: s.label, exit: s.exit, sid: !!s.sessionID, text: (s.text || '').slice(0, 60), tools: s.tools, cost: s.cost, stderr: s.stderrHead.slice(0, 120) }));
})().catch((e) => { console.error(e.message); process.exit(1); });
