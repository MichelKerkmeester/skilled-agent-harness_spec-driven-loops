// Starts a private OpenCode 2 server (own port, DB and data dir) in a throwaway
// workspace, waits for a plugin there to write its record, then optionally runs
// one cheap prompt and saves its event stream. The server password stays inside
// this process tree.
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');

const [ws, outDir, recordFile, prompt, model] = process.argv.slice(2);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'toolprobe-'));
const env = {
  ...process.env,
  OPENCODE_DB: path.join(temp, 'private.db'),
  XDG_DATA_HOME: path.join(temp, 'data'),
};
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
  let serverErr = '';
  child.stderr.on('data', (c) => { serverErr += c; });
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
  const summary = { port: 'private', record: null, run: null };
  try {
    if (!password) throw new Error('server did not start');
    const cenv = { ...env, OPENCODE_PASSWORD: password };
    const api = (p) => spawnSync('opencode2', ['api', '--server', url, 'GET', p, '--param', `location[directory]=${ws}`],
      { cwd: ws, env: cenv, encoding: 'utf8', timeout: 30000, maxBuffer: 64 * 1024 * 1024 });
    for (let i = 0; i < 20 && !fs.existsSync(recordFile); i++) { api('/api/plugin'); await sleep(2000); }
    const plugins = api('/api/plugin');
    fs.writeFileSync(path.join(outDir, 'plugins.json'), plugins.stdout || '');
    summary.record = fs.existsSync(recordFile) ? JSON.parse(fs.readFileSync(recordFile, 'utf8')) : null;
    if (prompt) {
      const args = ['run', '--server', url, '-m', model, '--format', 'json', prompt];
      const r = spawnSync('opencode2', args, { cwd: ws, env: cenv, encoding: 'utf8', timeout: 300000, input: '', maxBuffer: 64 * 1024 * 1024 });
      fs.writeFileSync(path.join(outDir, 'run.stdout.jsonl'), r.stdout || '');
      fs.writeFileSync(path.join(outDir, 'run.stderr.txt'), r.stderr || '');
      const events = (r.stdout || '').split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
      summary.run = {
        exit: r.status,
        tools: events.filter((e) => e.type === 'tool_use').map((e) => ({ tool: e.part?.tool, status: e.part?.state?.status, output: String(e.part?.state?.output ?? '').slice(0, 300) })),
        text: events.filter((e) => e.type === 'text').map((e) => e.part?.text).join('').slice(0, 400),
        cost: events.filter((e) => e.type === 'step_finish').reduce((s, e) => s + (e.part?.cost || 0), 0),
      };
    }
  } catch (e) {
    summary.error = e.message;
  } finally {
    child.kill('SIGTERM');
    await sleep(1500);
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    fs.writeFileSync(path.join(outDir, 'server.stderr.txt'), serverErr.replace(/password \S+/g, 'password <redacted>'));
    fs.rmSync(temp, { recursive: true, force: true });
  }
  fs.writeFileSync(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2).slice(0, 3000));
})().catch((e) => { console.error(e.message); process.exit(1); });
