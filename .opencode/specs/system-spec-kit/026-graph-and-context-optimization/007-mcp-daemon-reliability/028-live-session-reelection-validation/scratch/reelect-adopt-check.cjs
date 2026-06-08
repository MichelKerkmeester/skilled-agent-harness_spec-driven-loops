#!/usr/bin/env node
'use strict';
// Fresh-adopter check: reads the holder state, starts a BRAND-NEW launcher
// (a fresh "session") against the same isolated paths, does MCP initialize +
// memory_stats, and reports which daemon pid it ended up bound to (so we can
// tell adoption of the surviving daemon apart from a fresh respawn).
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const STATE = '/tmp/reelect-holder-state.json';
const role = process.argv[2] || 'session';

function rpcClient(child) {
  let buf = ''; const pending = new Map(); let nextId = 1;
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (c) => { buf += c; let nl; while ((nl = buf.indexOf('\n')) >= 0) { const l = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1); if (!l) continue; let m; try { m = JSON.parse(l); } catch { continue; } if (m.id != null && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } } });
  if (process.env.VERBOSE) { child.stderr.setEncoding('utf8'); child.stderr.on('data', (d) => process.stdout.write(`    [launcher-stderr] ${String(d).trimEnd()}\n`)); } else { child.stderr.resume(); }
  return {
    request: (method, params, t = 20000) => new Promise((res, rej) => { const id = nextId++; const timer = setTimeout(() => { pending.delete(id); rej(new Error(method + ' timeout')); }, t); pending.set(id, (m) => { clearTimeout(timer); res(m); }); child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n'); }),
    notify: (method, params) => child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n'),
  };
}

async function main() {
  const st = JSON.parse(fs.readFileSync(STATE, 'utf8'));
  const child = spawn(process.execPath, [st.launcher], { cwd: st.base, env: { ...process.env, ...st.env, SPECKIT_LAUNCHER_LOG: '1' }, stdio: ['pipe', 'pipe', 'pipe'] });
  const c = rpcClient(child);
  let ok = false, statsOk = false;
  try {
    const init = await c.request('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'adopt-' + role, version: '1.0' } }, 30000);
    ok = !!init.result;
    if (ok) { c.notify('notifications/initialized', {}); const r = await c.request('tools/call', { name: 'memory_stats', arguments: {} }, 15000); statsOk = !r.error; }
  } catch (e) { process.stdout.write(`[${role}] ERROR ${e.message}\n`); }
  let boundDaemon = null;
  try { boundDaemon = JSON.parse(fs.readFileSync(st.dbDir + '/.mk-spec-memory-launcher.json', 'utf8')).childPid; } catch {}
  const sameAsOriginal = boundDaemon === st.daemonPid;
  process.stdout.write(`[${role}] initialize=${ok ? 'OK' : 'FAIL'} memory_stats=${statsOk ? 'SUCCESS' : 'FAIL'} boundDaemonPid=${boundDaemon} original=${st.daemonPid} adoptedSameDaemon=${sameAsOriginal}\n`);
  try { process.kill(child.pid, 'SIGKILL'); } catch {}
  process.exit(statsOk ? 0 : 1);
}
main();
