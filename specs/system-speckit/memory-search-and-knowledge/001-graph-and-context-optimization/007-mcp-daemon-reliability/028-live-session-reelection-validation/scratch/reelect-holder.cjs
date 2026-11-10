#!/usr/bin/env node
'use strict';
// Holder: builds an isolated fake-root, starts a long-lived OWNER launcher (A)
// that spawns the shared daemon, writes a state file other processes (node
// adopt-check, real claude2 / opencode sessions) use to connect, then HOLDS.
// It does NOT tear down when A exits, so the released daemon can be adopted.
// On SIGTERM/SIGINT it reaps everything it started and removes the temp dirs.

const { spawn, execSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const REAL_BIN = path.join(REPO, '.opencode/bin');
const REAL_KIT = path.join(REPO, '.opencode/skills/system-spec-kit');
const REAL_MCP = path.join(REAL_KIT, 'mcp_server');
const STATE = '/tmp/reelect-holder-state.json';

function buildFakeRoot() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'rlhold.'));
  const fbin = path.join(base, '.opencode/bin');
  const fkit = path.join(base, '.opencode/skills/system-spec-kit');
  const fmcp = path.join(fkit, 'mcp_server');
  fs.mkdirSync(fbin, { recursive: true });
  fs.mkdirSync(fmcp, { recursive: true });
  fs.copyFileSync(path.join(REAL_BIN, 'mk-spec-memory-launcher.cjs'), path.join(fbin, 'mk-spec-memory-launcher.cjs'));
  fs.symlinkSync(path.join(REAL_BIN, 'lib'), path.join(fbin, 'lib'));
  fs.cpSync(path.join(REAL_MCP, 'dist'), path.join(fmcp, 'dist'), { recursive: true });
  fs.symlinkSync(path.join(REAL_MCP, 'node_modules'), path.join(fmcp, 'node_modules'));
  if (fs.existsSync(path.join(REAL_KIT, 'node_modules'))) fs.symlinkSync(path.join(REAL_KIT, 'node_modules'), path.join(fkit, 'node_modules'));
  fs.symlinkSync(path.join(REAL_MCP, 'package.json'), path.join(fmcp, 'package.json'));
  fs.symlinkSync(path.join(REAL_KIT, 'scripts'), path.join(fkit, 'scripts'));
  fs.mkdirSync(path.join(fmcp, 'database'), { recursive: true, mode: 0o700 });
  return base;
}

function rpcClient(child) {
  let buf = ''; const pending = new Map(); let nextId = 1;
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (c) => { buf += c; let nl; while ((nl = buf.indexOf('\n')) >= 0) { const l = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1); if (!l) continue; let m; try { m = JSON.parse(l); } catch { continue; } if (m.id != null && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } } });
  child.stderr.resume();
  return {
    request: (method, params, t = 30000) => new Promise((res, rej) => { const id = nextId++; const timer = setTimeout(() => { pending.delete(id); rej(new Error(method + ' timeout')); }, t); pending.set(id, (m) => { clearTimeout(timer); res(m); }); child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n'); }),
    notify: (method, params) => child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n'),
  };
}

async function main() {
  const base = buildFakeRoot();
  const sockDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rlhsk.'));
  const dbDir = path.join(base, '.opencode/skills/system-spec-kit/mcp_server/database');
  const launcher = path.join(base, '.opencode/bin/mk-spec-memory-launcher.cjs');
  const env = { ...process.env, SPECKIT_DAEMON_REELECTION: '1', SPECKIT_IPC_SOCKET_DIR: sockDir, SPEC_KIT_DB_DIR: dbDir, SPECKIT_LAUNCHER_LOG: '1', AI_SESSION_CHILD: '1' };

  const a = spawn(process.execPath, [launcher], { cwd: base, env, stdio: ['pipe', 'pipe', 'pipe'] });
  const ca = rpcClient(a);
  const init = await ca.request('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'holder-owner', version: '1.0' } }, 30000);
  if (!init.result) throw new Error('owner init failed: ' + JSON.stringify(init.error));
  ca.notify('notifications/initialized', {});
  await ca.request('tools/call', { name: 'memory_stats', arguments: {} }, 20000);

  const leaseFile = path.join(dbDir, '.mk-spec-memory-launcher.json');
  const daemonPid = JSON.parse(fs.readFileSync(leaseFile, 'utf8')).childPid;
  const state = { base, sockDir, dbDir, launcher, ownerLauncherPid: a.pid, daemonPid, env: { SPECKIT_DAEMON_REELECTION: '1', SPECKIT_IPC_SOCKET_DIR: sockDir, SPEC_KIT_DB_DIR: dbDir, AI_SESSION_CHILD: '1' } };
  fs.writeFileSync(STATE, JSON.stringify(state, null, 2));
  process.stdout.write('HOLDER READY\n' + JSON.stringify(state, null, 2) + '\n');

  // Do not tear down when A exits (the released daemon must outlive it).
  a.on('exit', (code, sig) => process.stdout.write(`[holder] owner launcher A exited code=${code} sig=${sig}; daemon ${daemonPid} alive=${(() => { try { process.kill(daemonPid, 0); return true; } catch { return false; } })()}\n`));

  function cleanup() {
    try { execSync(`pkill -9 -f "${base}" 2>/dev/null`); } catch {}
    try { execSync(`pkill -9 -f "${sockDir}" 2>/dev/null`); } catch {}
    for (const p of [a.pid, daemonPid]) { try { process.kill(p, 'SIGKILL'); } catch {} }
    try { fs.rmSync(base, { recursive: true, force: true }); } catch {}
    try { fs.rmSync(sockDir, { recursive: true, force: true }); } catch {}
    try { fs.unlinkSync(STATE); } catch {}
    process.exit(0);
  }
  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
  setInterval(() => {}, 2147483647); // hold
}

main().catch((e) => { process.stderr.write('HOLDER ERROR: ' + e.message + '\n'); process.exit(1); });
