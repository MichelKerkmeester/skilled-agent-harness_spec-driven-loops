#!/usr/bin/env node
'use strict';
// ───────────────────────────────────────────────────────────────
// LIVE two-session daemon re-election ADOPTION test.
//
// Closes the gap the existing integration test left open (it used a sleeper
// stand-in, not a real daemon, and never touched the lease/socket). Here TWO
// REAL mk-spec-memory launchers run against ONE isolated fake-root: an OWNER
// (A) that spawns the shared daemon, and a SECONDARY (B) that bridges to it.
// Then A is disposed (SIGTERM, what a host does on session end) and we observe
// whether the shared daemon SURVIVES and B keeps MCP transport.
//
// flag ON  : A disposal RELEASES the daemon -> it survives, B's next call works.
// flag OFF : A disposal KILLS the daemon -> it dies, B's transport breaks.
//
// SAFETY: everything runs in a throwaway fake-root under the OS temp dir with a
// real-copied launcher + daemon dist (so the daemon's workspace-root/DB guard
// resolves to the fake root, never the production tree) and an isolated socket
// dir. No production lease, DB, or socket is read or written. Only processes
// this test starts are signalled, tracked by pid, force-reaped in teardown.
// ───────────────────────────────────────────────────────────────

const { spawn, execSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const REAL_BIN = path.join(REPO, '.opencode/bin');
const REAL_KIT = path.join(REPO, '.opencode/skills/system-spec-kit');
const REAL_MCP = path.join(REAL_KIT, 'mcp_server');

function ts() { return new Date().toISOString().slice(11, 23); }
function log(...a) { process.stdout.write(`[${ts()}] ${a.join(' ')}\n`); }
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function isAlive(pid) {
  try { process.kill(pid, 0); return true; }
  catch (e) { return e.code === 'EPERM'; }
}

function buildFakeRoot() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'rlroot.'));
  const fbin = path.join(base, '.opencode/bin');
  const fkit = path.join(base, '.opencode/skills/system-spec-kit');
  const fmcp = path.join(fkit, 'mcp_server');
  fs.mkdirSync(fbin, { recursive: true });
  fs.mkdirSync(fmcp, { recursive: true });
  fs.copyFileSync(path.join(REAL_BIN, 'mk-spec-memory-launcher.cjs'), path.join(fbin, 'mk-spec-memory-launcher.cjs'));
  fs.symlinkSync(path.join(REAL_BIN, 'lib'), path.join(fbin, 'lib'));
  fs.cpSync(path.join(REAL_MCP, 'dist'), path.join(fmcp, 'dist'), { recursive: true });
  fs.symlinkSync(path.join(REAL_MCP, 'node_modules'), path.join(fmcp, 'node_modules'));
  if (fs.existsSync(path.join(REAL_KIT, 'node_modules'))) {
    fs.symlinkSync(path.join(REAL_KIT, 'node_modules'), path.join(fkit, 'node_modules'));
  }
  fs.symlinkSync(path.join(REAL_MCP, 'package.json'), path.join(fmcp, 'package.json'));
  fs.symlinkSync(path.join(REAL_KIT, 'scripts'), path.join(fkit, 'scripts'));
  fs.mkdirSync(path.join(fmcp, 'database'), { recursive: true, mode: 0o700 });
  return base;
}

function makeClient(child, tag) {
  let buf = '';
  const pending = new Map();
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (chunk) => {
    buf += chunk;
    let nl;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      let msg; try { msg = JSON.parse(line); } catch { continue; }
      if (msg.id != null && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
    }
  });
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', () => {}); // swallow; enable for deep debug
  let nextId = 1;
  function request(method, params, timeoutMs = 20000) {
    const id = nextId++;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${tag} ${method} timed out`)); }, timeoutMs);
      pending.set(id, (m) => { clearTimeout(timer); resolve(m); });
      try { child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n'); }
      catch (e) { clearTimeout(timer); pending.delete(id); reject(e); }
    });
  }
  function notify(method, params) {
    try { child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n'); } catch {}
  }
  return { request, notify };
}

async function startSession(base, sockDir, dbDir, enabled, tag) {
  const launcher = path.join(base, '.opencode/bin/mk-spec-memory-launcher.cjs');
  const env = {
    ...process.env,
    SPECKIT_DAEMON_REELECTION: enabled ? '1' : '0',
    SPECKIT_IPC_SOCKET_DIR: sockDir,
    SPEC_KIT_DB_DIR: dbDir,
    SPECKIT_LAUNCHER_LOG: '1',
    AI_SESSION_CHILD: '1',
  };
  const child = spawn(process.execPath, [launcher], { cwd: base, env, stdio: ['pipe', 'pipe', 'pipe'] });
  const client = makeClient(child, tag);
  const init = await client.request('initialize', {
    protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: `reelect-${tag}`, version: '1.0' },
  }, 30000);
  if (!init.result) throw new Error(`${tag} initialize failed: ${JSON.stringify(init.error)}`);
  client.notify('notifications/initialized', {});
  return { child, client };
}

function readLeaseDaemonPid(base) {
  const leaseFile = path.join(base, '.opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json');
  try { return JSON.parse(fs.readFileSync(leaseFile, 'utf8')).childPid ?? null; } catch { return null; }
}
function pgrepIso(dbDir) {
  try {
    const out = execSync(`pgrep -f "${dbDir}" || true`).toString().trim();
    return out ? out.split('\n').map(Number).filter(Boolean) : [];
  } catch { return []; }
}

async function callStats(client, tag) {
  try {
    const r = await client.request('tools/call', { name: 'memory_stats', arguments: {} }, 15000);
    return r.error ? { ok: false, detail: JSON.stringify(r.error).slice(0, 160) } : { ok: true };
  } catch (e) { return { ok: false, detail: e.message }; }
}

async function runArm(enabled) {
  const label = enabled ? 'FLAG ON (re-election)' : 'FLAG OFF (kill-on-disposal)';
  log('');
  log(`================= ARM: ${label} =================`);
  const base = buildFakeRoot();
  const sockDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rlsk.'));
  const dbDir = path.join(base, '.opencode/skills/system-spec-kit/mcp_server/database');
  const tracked = new Set();
  const result = { label, enabled };
  let A, B;
  try {
    log('start OWNER (A)...');
    A = await startSession(base, sockDir, dbDir, enabled, 'A');
    tracked.add(A.child.pid);
    const aStats = await callStats(A.client, 'A');
    log(`A initialize+memory_stats: ${aStats.ok ? 'SUCCESS' : 'FAIL ' + aStats.detail}`);
    const daemonPid = readLeaseDaemonPid(base);
    if (daemonPid) tracked.add(daemonPid);
    log(`shared daemon pid (from lease): ${daemonPid}; alive=${daemonPid ? isAlive(daemonPid) : 'n/a'}`);

    log('start SECONDARY (B) while A holds the lease + socket is live...');
    B = await startSession(base, sockDir, dbDir, enabled, 'B');
    tracked.add(B.child.pid);
    const bStats = await callStats(B.client, 'B');
    log(`B initialize+memory_stats: ${bStats.ok ? 'SUCCESS' : 'FAIL ' + bStats.detail}`);
    const daemonPidAfterB = readLeaseDaemonPid(base);
    const daemonCount = pgrepIso(dbDir).filter(isAlive).length;
    log(`daemon pid after B joined: ${daemonPidAfterB} (B spawned its own? ${daemonPidAfterB !== daemonPid ? 'YES' : 'no'}); live daemon procs ~ ${daemonCount}`);
    result.bridged = bStats.ok && daemonPidAfterB === daemonPid;

    log('>>> DISPOSE OWNER A (SIGTERM) <<<');
    A.child.kill('SIGTERM');
    // Wait for A's launcher process to exit.
    const deadline = Date.now() + 8000;
    while (isAlive(A.child.pid) && Date.now() < deadline) await delay(50);
    log(`A launcher exited: ${!isAlive(A.child.pid)}`);
    await delay(1200); // let release/kill settle

    const daemonAliveAfterDisposal = daemonPid ? isAlive(daemonPid) : false;
    log(`ORIGINAL shared daemon pid ${daemonPid} alive after A disposal: ${daemonAliveAfterDisposal}`);
    result.daemonSurvived = daemonAliveAfterDisposal;

    log('B makes a post-disposal memory_stats call...');
    const bAfter = await callStats(B.client, 'B');
    log(`B post-disposal memory_stats: ${bAfter.ok ? 'SUCCESS' : 'FAIL ' + bAfter.detail}`);
    result.bTransportSurvived = bAfter.ok;
    const daemonPidAfter = readLeaseDaemonPid(base);
    result.daemonRespawned = daemonPidAfter && daemonPidAfter !== daemonPid;
    if (daemonPidAfter) tracked.add(daemonPidAfter);

    // Verdict per arm.
    if (enabled) {
      result.pass = result.bridged && result.daemonSurvived && result.bTransportSurvived;
    } else {
      // OFF: the ORIGINAL daemon must die on disposal (the core kill behavior).
      result.pass = result.bridged && !result.daemonSurvived;
    }
    log(`ARM VERDICT: ${result.pass ? 'PASS' : 'FAIL'}`);
  } catch (e) {
    log(`ARM ERROR: ${e.message}`);
    result.pass = false; result.error = e.message;
  } finally {
    for (const p of [A?.child?.pid, B?.child?.pid]) { if (p) { try { process.kill(p, 'SIGKILL'); } catch {} } }
    await delay(200);
    for (const p of [...tracked, ...pgrepIso(dbDir)]) { try { process.kill(p, 'SIGKILL'); } catch {} }
    await delay(200);
    try { fs.rmSync(base, { recursive: true, force: true }); } catch {}
    try { fs.rmSync(sockDir, { recursive: true, force: true }); } catch {}
  }
  return result;
}

async function main() {
  const results = [];
  results.push(await runArm(true));
  results.push(await runArm(false));
  log('');
  log('================= SUMMARY =================');
  for (const r of results) {
    log(`${r.label}: ${r.pass ? 'PASS' : 'FAIL'}`);
    log(`   bridged(secondary joined shared daemon)=${r.bridged} | originalDaemonSurvivedDisposal=${r.daemonSurvived} | bTransportSurvived=${r.bTransportSurvived} | daemonRespawned=${r.daemonRespawned ?? false}`);
    if (r.error) log(`   error=${r.error}`);
  }
  const allPass = results.every((r) => r.pass);
  log('');
  log(`OVERALL: ${allPass ? 'PASS — re-election adoption is live-proven across two real sessions' : 'FAIL'}`);
  process.exit(allPass ? 0 : 1);
}

main();
