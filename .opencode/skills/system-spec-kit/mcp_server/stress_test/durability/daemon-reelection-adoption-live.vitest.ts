// ───────────────────────────────────────────────────────────────
// DURABILITY: daemon re-election LIVE two-session ADOPTION (real launchers)
// ───────────────────────────────────────────────────────────────
//
// The sibling release-integration test proves the OS-level release-vs-kill
// DECISION with a sleeper stand-in. This test proves the END-TO-END behavior the
// feature actually promises: with the flag ON, when an OWNER session disposes the
// shared daemon SURVIVES and a SECONDARY session keeps its MCP transport; with the
// flag OFF the daemon DIES with its owner and the secondary loses transport.
//
// It runs TWO real mk-spec-memory launchers as MCP stdio servers against ONE
// isolated fake-root, speaks real MCP JSON-RPC to each, disposes the owner with
// SIGTERM (what a host does on session end), and observes the shared daemon's pid
// and the secondary's next call.
//
// SAFETY: everything runs in a throwaway fake-root under the OS temp dir. The
// launcher is REAL-COPIED (so its __dirname-derived lease/db dir is isolated) and
// the daemon's dist is REAL-COPIED (so the daemon's workspace-root/DB boundary
// guard resolves to the fake root, never the production tree); node_modules and
// scripts are symlinked; the IPC socket lives in a short isolated dir. No
// production lease, DB, or socket is read or written. Only processes this test
// starts are signalled, tracked by pid, and force-reaped in teardown.

import { spawn, execSync, type ChildProcess } from 'node:child_process';
import { cpSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

// stress_test/durability/<file> -> repo root is six levels up.
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../..');
const realBin = join(repoRoot, '.opencode/bin');
const realKit = join(repoRoot, '.opencode/skills/system-spec-kit');
const realMcp = join(realKit, 'mcp_server');

const trackedPids = new Set<number>();
const tempDirs = new Set<string>();

function track(pid: number | undefined): void {
  if (typeof pid === 'number' && pid > 0) trackedPids.add(pid);
}
function isAlive(pid: number): boolean {
  try { process.kill(pid, 0); return true; }
  catch (e) { return (e as NodeJS.ErrnoException).code === 'EPERM'; }
}
function delay(ms: number): Promise<void> { return new Promise((r) => setTimeout(r, ms)); }

function pgrepContains(needle: string): number[] {
  try {
    const out = execSync(`pgrep -f "${needle}" || true`).toString().trim();
    return out ? out.split('\n').map(Number).filter(Boolean) : [];
  } catch { return []; }
}

// Distinct pids holding any *.sqlite* file open under dbDir. One = single writer.
function sqliteOpenerPids(dbDir: string): number[] {
  try {
    const out = execSync(
      `lsof +D "${dbDir}" 2>/dev/null | awk 'NR>1 && ($9 ~ /\\.(db|sqlite|sqlite3)/) {print $2}' | sort -u`,
    ).toString().trim();
    return out ? out.split('\n').map(Number).filter(Boolean) : [];
  } catch { return []; }
}

// Build an isolated fake-root: real-copied launcher + daemon dist, symlinked deps,
// fresh lease/db dir. Returns the paths the two sessions share.
function buildFakeRoot(): { base: string; sockDir: string; dbDir: string; launcher: string } {
  const base = mkdtempSync(join(tmpdir(), 'rladopt.'));
  tempDirs.add(base);
  const fbin = join(base, '.opencode/bin');
  const fkit = join(base, '.opencode/skills/system-spec-kit');
  const fmcp = join(fkit, 'mcp_server');
  mkdirSync(fbin, { recursive: true });
  mkdirSync(fmcp, { recursive: true });
  copyFileSync(join(realBin, 'mk-spec-memory-launcher.cjs'), join(fbin, 'mk-spec-memory-launcher.cjs'));
  symlinkSync(join(realBin, 'lib'), join(fbin, 'lib'));
  cpSync(join(realMcp, 'dist'), join(fmcp, 'dist'), { recursive: true });
  symlinkSync(join(realMcp, 'node_modules'), join(fmcp, 'node_modules'));
  if (existsSync(join(realKit, 'node_modules'))) symlinkSync(join(realKit, 'node_modules'), join(fkit, 'node_modules'));
  symlinkSync(join(realMcp, 'package.json'), join(fmcp, 'package.json'));
  symlinkSync(join(realKit, 'scripts'), join(fkit, 'scripts'));
  const dbDir = join(fmcp, 'database');
  mkdirSync(dbDir, { recursive: true, mode: 0o700 });
  const sockDir = mkdtempSync(join(tmpdir(), 'rladsk.'));
  tempDirs.add(sockDir);
  return { base, sockDir, dbDir, launcher: join(fbin, 'mk-spec-memory-launcher.cjs') };
}

type RpcResponse = { result?: unknown; error?: unknown; id?: number | null };

// A minimal newline-delimited MCP JSON-RPC client over a launcher's stdio.
function makeClient(child: ChildProcess) {
  let buf = '';
  const pending = new Map<number, (m: RpcResponse) => void>();
  child.stdout!.setEncoding('utf8');
  child.stdout!.on('data', (chunk: string) => {
    buf += chunk;
    let nl: number;
    while ((nl = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line) continue;
      let msg: RpcResponse;
      try { msg = JSON.parse(line); } catch { continue; }
      if (msg.id != null && pending.has(msg.id)) { pending.get(msg.id)!(msg); pending.delete(msg.id); }
    }
  });
  child.stderr!.setEncoding('utf8');
  child.stderr!.on('data', () => { /* swallow launcher stderr */ });
  let nextId = 1;
  function request(method: string, params: unknown, timeoutMs = 30_000): Promise<RpcResponse> {
    const id = nextId++;
    return new Promise((resolveReq, rejectReq) => {
      const timer = setTimeout(() => { pending.delete(id); rejectReq(new Error(`${method} timed out`)); }, timeoutMs);
      pending.set(id, (m) => { clearTimeout(timer); resolveReq(m); });
      try { child.stdin!.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n'); }
      catch (e) { clearTimeout(timer); pending.delete(id); rejectReq(e as Error); }
    });
  }
  function notify(method: string, params: unknown): void {
    try { child.stdin!.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n'); } catch { /* gone */ }
  }
  return { request, notify };
}

async function startSession(
  paths: { base: string; sockDir: string; dbDir: string; launcher: string },
  enabled: boolean,
): Promise<{ child: ChildProcess; client: ReturnType<typeof makeClient> }> {
  const child = spawn(process.execPath, [paths.launcher], {
    cwd: paths.base,
    env: {
      ...process.env,
      SPECKIT_DAEMON_REELECTION: enabled ? '1' : '0',
      SPECKIT_IPC_SOCKET_DIR: paths.sockDir,
      SPEC_KIT_DB_DIR: paths.dbDir,
      SPECKIT_LAUNCHER_LOG: '1',
      AI_SESSION_CHILD: '1',
    },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  track(child.pid);
  const client = makeClient(child);
  const init = await client.request('initialize', {
    protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'reelect-adopt', version: '1.0' },
  }, 30_000);
  if (!init.result) throw new Error(`initialize failed: ${JSON.stringify(init.error)}`);
  client.notify('notifications/initialized', {});
  return { child, client };
}

function leaseDaemonPid(base: string): number | null {
  const f = join(base, '.opencode/skills/system-spec-kit/mcp_server/database/.mk-spec-memory-launcher.json');
  try { return (JSON.parse(readFileSync(f, 'utf8')).childPid as number) ?? null; } catch { return null; }
}
async function statsOk(client: ReturnType<typeof makeClient>, timeoutMs = 15_000): Promise<boolean> {
  try {
    const r = await client.request('tools/call', { name: 'memory_stats', arguments: {} }, timeoutMs);
    return !r.error;
  } catch { return false; }
}
async function waitForExit(pid: number, timeoutMs: number): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (isAlive(pid) && Date.now() < deadline) await delay(50);
}

afterEach(async () => {
  for (const pid of trackedPids) { try { process.kill(pid, 'SIGKILL'); } catch { /* gone */ } }
  await delay(150);
  // Sweep any detached daemon / embed sidecar that reparented to init.
  for (const dir of tempDirs) {
    for (const pid of pgrepContains(dir)) { try { process.kill(pid, 'SIGKILL'); } catch { /* gone */ } }
  }
  await delay(150);
  trackedPids.clear();
  for (const dir of tempDirs) { try { rmSync(dir, { recursive: true, force: true }); } catch { /* best effort */ } }
  tempDirs.clear();
});

describe('daemon re-election: live two-session adoption', () => {
  it('flag ON: owner disposal RELEASES the shared daemon; secondary keeps transport', async () => {
    const paths = buildFakeRoot();

    const owner = await startSession(paths, true);
    expect(await statsOk(owner.client)).toBe(true);
    const daemonPid = leaseDaemonPid(paths.base);
    expect(daemonPid).toBeTypeOf('number');
    track(daemonPid!);
    expect(isAlive(daemonPid!)).toBe(true);

    // Secondary joins while the owner holds the lease and the socket is live.
    const secondary = await startSession(paths, true);
    expect(await statsOk(secondary.client)).toBe(true);
    // The secondary must BRIDGE to the owner's daemon, not spawn its own.
    expect(leaseDaemonPid(paths.base)).toBe(daemonPid);

    // Dispose the owner.
    owner.child.kill('SIGTERM');
    await waitForExit(owner.child.pid!, 8_000);
    expect(isAlive(owner.child.pid!)).toBe(false);
    await delay(1_200);

    // The released daemon outlives its owner and the secondary keeps transport.
    expect(isAlive(daemonPid!)).toBe(true);
    expect(await statsOk(secondary.client)).toBe(true);
  });

  it('flag ON: a FRESH session after owner disposal reaps the released daemon (single writer)', async () => {
    const paths = buildFakeRoot();

    const owner = await startSession(paths, true);
    expect(await statsOk(owner.client)).toBe(true);
    const orphanPid = leaseDaemonPid(paths.base);
    expect(orphanPid).toBeTypeOf('number');
    track(orphanPid!);

    // Dispose the owner: the daemon is RELEASED (survives), not killed.
    owner.child.kill('SIGTERM');
    await waitForExit(owner.child.pid!, 8_000);
    await delay(1_200);
    expect(isAlive(orphanPid!)).toBe(true);

    // A brand-new session starts AFTER disposal. Without the reap-before-respawn fix it
    // reclaims the stale lease and spawns a SECOND daemon on the same DB (double writer);
    // with the fix it reaps the orphan first, so exactly one daemon writes the DB.
    const fresh = await startSession(paths, true);
    expect(await statsOk(fresh.client)).toBe(true);
    const newPid = leaseDaemonPid(paths.base);
    expect(newPid).toBeTypeOf('number');
    track(newPid!);
    await delay(800);

    // Single-writer invariant: the orphan is reaped and only the new daemon survives.
    expect(isAlive(orphanPid!)).toBe(false);
    expect(newPid).not.toBe(orphanPid);
    expect(isAlive(newPid!)).toBe(true);

    // Airtight co-residency check: exactly one pid holds the sqlite open under the DB dir.
    const dbWriters = sqliteOpenerPids(paths.dbDir);
    expect(dbWriters.length).toBe(1);
  });

  it('flag OFF: owner disposal KILLS the shared daemon; secondary loses transport', async () => {
    const paths = buildFakeRoot();

    const owner = await startSession(paths, false);
    expect(await statsOk(owner.client)).toBe(true);
    const daemonPid = leaseDaemonPid(paths.base);
    expect(daemonPid).toBeTypeOf('number');
    track(daemonPid!);
    expect(isAlive(daemonPid!)).toBe(true);

    const secondary = await startSession(paths, false);
    expect(await statsOk(secondary.client)).toBe(true);
    expect(leaseDaemonPid(paths.base)).toBe(daemonPid);

    owner.child.kill('SIGTERM');
    await waitForExit(owner.child.pid!, 8_000);
    expect(isAlive(owner.child.pid!)).toBe(false);
    await delay(1_200);

    // With the flag off, the daemon dies with its owner and the secondary's next
    // call fails (no surviving daemon to serve it) within a short window.
    expect(isAlive(daemonPid!)).toBe(false);
    expect(await statsOk(secondary.client, 6_000)).toBe(false);
  });
});
