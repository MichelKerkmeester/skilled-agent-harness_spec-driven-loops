#!/usr/bin/env node
'use strict';

// Starts a private OpenCode 2 server (own port, own database, own data home) in
// <dir>, reads each GET path once it answers, prints the JSON bodies, then kills
// the server and removes its folder. The server password is handed to the API
// client through the environment only and is never printed.
//
// Usage: node v2-api-probe.cjs <dir> <apiPath> [<apiPath> ...]
// A path may contain {DIR}, replaced with the percent-encoded <dir>.

const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');

const [dir, ...paths] = process.argv.slice(2);
if (!dir || paths.length === 0) {
  process.stderr.write('usage: v2-api-probe.cjs <dir> <apiPath>...\n');
  process.exit(2);
}

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.on('error', reject);
    probe.listen(0, '127.0.0.1', () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

function waitForPassword(child, port, ms) {
  return new Promise((resolve) => {
    let buffer = '';
    const timer = setTimeout(() => resolve(null), ms);
    child.stdout.on('data', (chunk) => {
      buffer += chunk.toString();
      const password = /server password (\S+)/.exec(buffer);
      if (buffer.includes(`server listening on http://127.0.0.1:${port}`) && password) {
        clearTimeout(timer);
        resolve(password[1]);
      }
    });
    child.on('exit', () => { clearTimeout(timer); resolve(null); });
  });
}

(async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'v2-api-probe-'));
  const env = {
    ...process.env,
    OPENCODE_DB: path.join(temp, 'private.db'),
    XDG_DATA_HOME: path.join(temp, 'data'),
  };
  fs.mkdirSync(env.XDG_DATA_HOME, { recursive: true });
  const port = await freePort();
  const child = spawn('opencode2', ['serve', '--port', String(port)], { cwd: dir, env, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stderr.on('data', () => {});
  try {
    const password = await waitForPassword(child, port, 30000);
    if (!password) {
      console.log(JSON.stringify({ error: 'private server did not start' }));
      process.exitCode = 1;
      return;
    }
    const apiEnv = { ...env, OPENCODE_PASSWORD: password };
    for (const raw of paths) {
      const apiPath = raw.replace('{DIR}', encodeURIComponent(dir));
      // The listing fills in after start-up, so read until two consecutive
      // non-empty reads agree on the entry count, as the doctor battery does.
      let body = null;
      const counts = [];
      for (let attempt = 0; attempt < 15; attempt += 1) {
        const result = spawnSync('opencode2', ['api', '--server', `http://127.0.0.1:${port}`, 'GET', apiPath], {
          cwd: dir, env: apiEnv, maxBuffer: 64 * 1024 * 1024, timeout: 20000,
        });
        const text = result.stdout?.toString() ?? '';
        try { body = JSON.parse(text.slice(text.indexOf('{'))); } catch { body = null; }
        const count = Array.isArray(body?.data) ? body.data.length : -1;
        counts.push(count);
        const n = counts.length;
        if (n >= 2 && count > 0 && counts[n - 2] === count) break;
        await new Promise((r) => setTimeout(r, 2000));
      }
      console.log(JSON.stringify({ path: raw, counts, body }));
    }
  } finally {
    child.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 1500));
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
    fs.rmSync(temp, { recursive: true, force: true });
  }
})();
