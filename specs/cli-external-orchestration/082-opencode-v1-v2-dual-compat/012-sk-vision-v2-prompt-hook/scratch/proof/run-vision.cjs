// Starts a private OpenCode 2 server (own port, DB and data dir) in the given
// workspace, with automatic image inspection on or off, sends one cheap prompt
// with an image attached, and records whether the stored user message carries
// sk-vision evidence. The server password never leaves this process tree.
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');

const [ws, image, outDir, mode] = process.argv.slice(2);
const MODEL = 'llmgateway/deepseek-v4.1-flash';
const PROMPT = 'Reply with exactly VISION-PROBE-OK and nothing else. Do not use any tool.';

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'visionprobe-'));
const env = { ...process.env, OPENCODE_DB: path.join(temp, 'private.db'), XDG_DATA_HOME: path.join(temp, 'data') };
if (mode === 'on') env.SK_VISION_AUTOINSPECT = '1';
else delete env.SK_VISION_AUTOINSPECT;
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
  const summary = { mode, serverPid: child.pid };
  try {
    if (!password) throw new Error('server did not start');
    const cenv = { ...env, OPENCODE_PASSWORD: password };
    const api = (p) => {
      const r = spawnSync('opencode2', ['api', '--server', url, 'GET', p, '--param', `location[directory]=${ws}`],
        { cwd: ws, env: cenv, encoding: 'utf8', timeout: 30000, maxBuffer: 64 * 1024 * 1024 });
      try { return JSON.parse(r.stdout); } catch { return { unparsed: (r.stdout || '').slice(0, 300), status: r.status }; }
    };
    let plugins = null;
    for (let i = 0; i < 15; i++) {
      plugins = api('/api/plugin');
      if ((plugins?.data || []).length >= 16) break;
      await sleep(2000);
    }
    fs.writeFileSync(path.join(outDir, `${mode}.plugins.json`), JSON.stringify(plugins, null, 2));
    const vision = (plugins?.data || []).filter((p) => JSON.stringify(p).includes('sk-vision'));
    summary.pluginCount = (plugins?.data || []).length;
    summary.skVision = vision.map((p) => ({ id: p.id, status: p.status ?? p.state }));
    const args = ['run', '--server', url, '-m', MODEL, '--file', image, '--format', 'json', PROMPT];
    const started = Date.now();
    const r = spawnSync('opencode2', args, { cwd: ws, env: cenv, encoding: 'utf8', timeout: 420000, input: '', maxBuffer: 64 * 1024 * 1024 });
    summary.runMs = Date.now() - started;
    fs.writeFileSync(path.join(outDir, `${mode}.stdout.jsonl`), r.stdout || '');
    fs.writeFileSync(path.join(outDir, `${mode}.stderr.txt`), r.stderr || '');
    const events = (r.stdout || '').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
    const sid = events.find((e) => e.sessionID)?.sessionID || null;
    summary.exit = r.status;
    summary.signal = r.signal;
    summary.reply = events.filter((e) => e.type === 'text').map((e) => e.part?.text).join('').slice(0, 80);
    if (sid) {
      const messages = api(`/api/session/${sid}/message`);
      fs.writeFileSync(path.join(outDir, `${mode}.messages.json`), JSON.stringify(messages, null, 2));
      const raw = JSON.stringify(messages);
      summary.sessionID = true;
      summary.hasVisionEvidence = raw.includes('SK-VISION');
      summary.visionTags = [...new Set(raw.match(/<SK-VISION[^>\\]*/g) || [])];
      summary.hasPrompt = raw.includes('VISION-PROBE-OK');
    }
  } catch (e) {
    summary.error = e.message;
  } finally {
    child.kill('SIGTERM');
    await sleep(1500);
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    fs.rmSync(temp, { recursive: true, force: true });
  }
  fs.writeFileSync(path.join(outDir, `${mode}.summary.json`), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary));
})().catch((e) => { console.error(e.message); process.exit(1); });
