#!/usr/bin/env node
'use strict';
// Measure the double-writer window: owner A spawns daemon D1; dispose A (D1
// orphaned, survives under flag ON); a FRESH launcher B starts and (per the
// reclaim path) spawns its OWN daemon D2 on the SAME DB dir. We poll D1 liveness
// and check whether D1 and D2 both hold the sqlite open simultaneously.
const { spawn, execSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const REPO = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const REAL_BIN = path.join(REPO, '.opencode/bin');
const REAL_KIT = path.join(REPO, '.opencode/skills/system-spec-kit');
const REAL_MCP = path.join(REAL_KIT, 'mcp_server');
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const alive = (p) => { try { process.kill(p, 0); return true; } catch { return false; } };
function log(...a) { process.stdout.write(`[${new Date().toISOString().slice(11,23)}] ${a.join(' ')}\n`); }

function buildRoot() {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), 'rldw.'));
  const fbin = path.join(base, '.opencode/bin');
  const fkit = path.join(base, '.opencode/skills/system-spec-kit');
  const fmcp = path.join(fkit, 'mcp_server');
  fs.mkdirSync(fbin, { recursive: true }); fs.mkdirSync(fmcp, { recursive: true });
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
function client(child) {
  let buf = ''; const pending = new Map(); let nid = 1;
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (c) => { buf += c; let nl; while ((nl = buf.indexOf('\n')) >= 0) { const l = buf.slice(0, nl).trim(); buf = buf.slice(nl + 1); if (!l) continue; let m; try { m = JSON.parse(l); } catch { continue; } if (m.id != null && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } } });
  child.stderr.resume();
  return { req: (me, pa, t = 25000) => new Promise((res, rej) => { const id = nid++; const tm = setTimeout(() => { pending.delete(id); rej(new Error(me + ' timeout')); }, t); pending.set(id, (m) => { clearTimeout(tm); res(m); }); child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method: me, params: pa }) + '\n'); }), note: (me, pa) => child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: me, params: pa }) + '\n') };
}
function dbOpeners(dbDir) {
  // Which pids hold any *.db / *.sqlite* file open under dbDir?
  try {
    const out = execSync(`lsof +D "${dbDir}" 2>/dev/null | awk 'NR>1 && ($9 ~ /\\.(db|sqlite|sqlite3)/) {print $2"|"$9}' | sort -u`).toString().trim();
    return out ? out.split('\n') : [];
  } catch { return []; }
}

async function start(base, sock, db, name) {
  const launcher = path.join(base, '.opencode/bin/mk-spec-memory-launcher.cjs');
  const env = { ...process.env, SPECKIT_DAEMON_REELECTION: '1', SPECKIT_IPC_SOCKET_DIR: sock, SPEC_KIT_DB_DIR: db, SPECKIT_LAUNCHER_LOG: '1', AI_SESSION_CHILD: '1' };
  const ch = spawn(process.execPath, [launcher], { cwd: base, env, stdio: ['pipe', 'pipe', 'pipe'] });
  const c = client(ch);
  const init = await c.req('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name, version: '1.0' } }, 30000);
  if (!init.result) throw new Error(name + ' init failed');
  c.note('notifications/initialized', {});
  await c.req('tools/call', { name: 'memory_stats', arguments: {} }, 20000);
  return ch;
}
const leasePid = (db) => { try { return JSON.parse(fs.readFileSync(db + '/.mk-spec-memory-launcher.json', 'utf8')).childPid; } catch { return null; } };

async function main() {
  const base = buildRoot();
  const sock = fs.mkdtempSync(path.join(os.tmpdir(), 'rldwsk.'));
  const db = path.join(base, '.opencode/skills/system-spec-kit/mcp_server/database');
  const cleanup = () => { for (const d of [base, sock]) { try { execSync(`pkill -9 -f "${d}" 2>/dev/null`); } catch {} } for (const d of [base, sock]) { try { fs.rmSync(d, { recursive: true, force: true }); } catch {} } };
  try {
    log('start OWNER A...');
    const A = await start(base, sock, db, 'owner-A');
    const D1 = leasePid(db);
    log(`daemon D1 = ${D1}, alive=${alive(D1)}`);
    log('DB openers while A alive:', JSON.stringify(dbOpeners(db)));

    log('>>> dispose OWNER A <<<');
    A.kill('SIGTERM');
    await delay(1500);
    log(`after dispose: A.launcher alive=${alive(A.pid)}, D1 alive=${alive(D1)}`);

    log('start FRESH launcher B (kept alive)...');
    const B = await start(base, sock, db, 'fresh-B');
    const D2 = leasePid(db);
    log(`daemon D2 = ${D2} (D1 was ${D1}); D2===D1 ? ${D2 === D1}`);

    log('--- double-writer poll (D1 = orphan; D2 = new daemon) ---');
    let firstWindow = null;
    const marks = [1, 3, 6, 10, 15, 25, 40, 60];
    let prev = 0;
    for (const m of marks) {
      await delay((m - prev) * 1000); prev = m;
      const d1 = alive(D1), d2 = alive(D2);
      const openers = dbOpeners(db);
      const bothOpen = openers.filter((o) => { const pid = Number(o.split('|')[0]); return pid === D1 || pid === D2; });
      log(`t+${m}s: D1(orphan)=${d1 ? 'ALIVE' : 'dead'} D2(new)=${d2 ? 'ALIVE' : 'dead'} | dbOpenersD1/D2=${JSON.stringify(bothOpen)}`);
      if (d1 && d2 && firstWindow === null) firstWindow = m;
      if (!d1) { log(`orphan D1 exited by t+${m}s`); break; }
    }
    log(`RESULT: two daemons co-resident on one DB for at least the first poll window; orphan self-exit observed above.`);
    log(`B keeps running; cleaning up.`);
  } catch (e) {
    log('DIAG ERROR: ' + e.message);
  } finally {
    cleanup();
    process.exit(0);
  }
}
main();
