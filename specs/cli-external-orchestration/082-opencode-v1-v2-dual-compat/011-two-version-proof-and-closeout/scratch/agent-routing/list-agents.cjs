// Starts a private OpenCode 2 server (own port, DB and data dir), polls the agent
// endpoint for one directory until the list settles, and prints it. The server
// password stays in this process and its children's environment only.
const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');

const [root, outFile, ...paths] = process.argv.slice(2);
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'agentprobe-'));
const env = { ...process.env, OPENCODE_DB: path.join(temp, 'private.db'), XDG_DATA_HOME: path.join(temp, 'data') };
fs.mkdirSync(env.XDG_DATA_HOME, { recursive: true });

const freePort = () => new Promise((resolve, reject) => {
  const s = net.createServer(); s.on('error', reject);
  s.listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => resolve(port)); });
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const port = await freePort();
  const child = spawn('opencode2', ['serve', '--port', String(port)], { cwd: root, env, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stderr.on('data', () => {});
  const password = await new Promise((resolve) => {
    let buf = '';
    const t = setTimeout(() => resolve(null), 30000);
    child.stdout.on('data', (c) => {
      buf += c;
      const m = /server password (\S+)/.exec(buf);
      if (m && buf.includes(`server listening on http://127.0.0.1:${port}`)) { clearTimeout(t); resolve(m[1]); }
    });
    child.on('exit', () => resolve(null));
  });
  const results = {};
  try {
    if (!password) throw new Error('server did not start');
    const apiEnv = { ...env, OPENCODE_PASSWORD: password };
    const get = (p) => {
      const r = spawnSync('opencode2', ['api', '--server', `http://127.0.0.1:${port}`, 'GET', p, '--param', `location[directory]=${root}`],
        { cwd: root, env: apiEnv, encoding: 'utf8', timeout: 30000, maxBuffer: 64 * 1024 * 1024 });
      try { return JSON.parse(r.stdout); } catch { return { unparsed: (r.stdout || '').slice(0, 200), status: r.status }; }
    };
    for (const p of paths) {
      let last = null; let body = null;
      for (let i = 0; i < 15; i++) {
        body = get(p);
        const n = Array.isArray(body?.data) ? body.data.length : -1;
        if (n > 0 && n === last) break;
        last = n; await sleep(2000);
      }
      results[p] = body;
    }
  } finally {
    child.kill('SIGTERM');
    await sleep(1500);
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    fs.rmSync(temp, { recursive: true, force: true });
  }
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  for (const [p, b] of Object.entries(results)) console.log(p, Array.isArray(b?.data) ? `${b.data.length} entries` : JSON.stringify(b).slice(0, 200));
})().catch((e) => { console.error(e.message); process.exit(1); });
