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

import { spawn, spawnSync, type ChildProcess } from 'node:child_process';
import { cpSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
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

// spawnSync (no shell) so the temp-dir argument is never interpreted by a shell. pgrep exits
// non-zero with empty stdout when nothing matches, which yields an empty list.
function pgrepContains(needle: string): number[] {
  const res = spawnSync('pgrep', ['-f', needle], { encoding: 'utf8' });
  const out = (res.stdout || '').trim();
  return out ? out.split('\n').map(Number).filter(Boolean) : [];
}

// Distinct pids holding any *.sqlite* file open under dbDir. One = single writer. spawnSync (no
// shell) plus JS parsing, so dbDir is never interpolated into a shell command. We parse stdout
// regardless of exit status because `lsof +D` often exits non-zero on benign warnings while still
// listing the open files.
function sqliteOpenerPids(dbDir: string): number[] {
  const res = spawnSync('lsof', ['+D', dbDir], { encoding: 'utf8' });
  const out = res.stdout || '';
  const pids = new Set<number>();
  for (const line of out.split('\n').slice(1)) {
    const cols = line.split(/\s+/);
    const name = cols[8] || '';
    if (/\.(db|sqlite|sqlite3)/.test(name)) {
      const pid = Number(cols[1]);
      if (Number.isInteger(pid) && pid > 0) pids.add(pid);
    }
  }
  return [...pids];
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
  extraEnv: Record<string, string> = {},
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
      ...extraEnv,
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

// Spawn a competing launcher and send it an initialize WITHOUT requiring a completed MCP handshake.
// When the marked daemon is busy-but-healthy, the launcher's contract is to refuse the respawn and
// report lease-held on stdout, then exit 0 — it does NOT bridge the contending session into a live
// transport (that session is told to back off, not adopted). So this helper observes the launcher's
// decision (its stdout report + exit) rather than driving real MCP calls through it.
async function spawnCompetingLauncher(
  paths: { base: string; sockDir: string; dbDir: string; launcher: string },
  extraEnv: Record<string, string> = {},
): Promise<{ child: ChildProcess; settled: () => { exited: boolean; code: number | null; stdout: string } }> {
  const child = spawn(process.execPath, [paths.launcher], {
    cwd: paths.base,
    env: {
      ...process.env,
      SPECKIT_DAEMON_REELECTION: '1',
      SPECKIT_IPC_SOCKET_DIR: paths.sockDir,
      SPEC_KIT_DB_DIR: paths.dbDir,
      SPECKIT_LAUNCHER_LOG: '1',
      AI_SESSION_CHILD: '1',
      ...extraEnv,
    },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  track(child.pid);
  let stdout = '';
  let exited = false;
  let code: number | null = null;
  child.stdout!.setEncoding('utf8');
  child.stdout!.on('data', (c: string) => { stdout += c; });
  child.stderr!.setEncoding('utf8');
  child.stderr!.on('data', () => { /* swallow launcher stderr */ });
  child.on('exit', (c) => { exited = true; code = c; });
  // A bare initialize so a launcher that DID hand us a transport would answer; under refusal it
  // instead emits its lease-held report and exits.
  try {
    child.stdin!.write(JSON.stringify({
      jsonrpc: '2.0', id: 1, method: 'initialize',
      params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'reelect-compete', version: '1.0' } },
    }) + '\n');
  } catch { /* launcher may already be exiting */ }
  return { child, settled: () => ({ exited, code, stdout }) };
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

  it('flag ON: a FRESH session after owner disposal ADOPTS the released daemon (single writer)', async () => {
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

    // A brand-new session starts AFTER disposal. With true adoption it bridges to the still-live
    // released daemon instead of reaping and respawning, so the warm daemon is reused and there is
    // never a second writer.
    const fresh = await startSession(paths, true);
    expect(await statsOk(fresh.client)).toBe(true);
    const newPid = leaseDaemonPid(paths.base);
    expect(newPid).toBeTypeOf('number');
    track(newPid!);
    await delay(800);

    // Adoption invariant: the released daemon is reused (same pid, still alive), not respawned.
    expect(isAlive(orphanPid!)).toBe(true);
    expect(newPid).toBe(orphanPid);

    // Airtight co-residency check: exactly one pid holds the sqlite open under the DB dir.
    const dbWriters = sqliteOpenerPids(paths.dbDir);
    expect(dbWriters.length).toBe(1);
  });

  it('flag ON: a FRESH session does NOT adopt a WEDGED released daemon; it reaps and respawns (single writer)', async () => {
    const paths = buildFakeRoot();

    const owner = await startSession(paths, true);
    expect(await statsOk(owner.client)).toBe(true);
    const orphanPid = leaseDaemonPid(paths.base);
    expect(orphanPid).toBeTypeOf('number');
    track(orphanPid!);

    // Dispose the owner: with reelection the daemon is RELEASED (survives), not killed.
    owner.child.kill('SIGTERM');
    await waitForExit(owner.child.pid!, 8_000);
    await delay(1_200);
    expect(isAlive(orphanPid!)).toBe(true);

    // WEDGE the released daemon. SIGSTOP freezes its event loop, so it stays 'alive' to kill(pid,0)
    // and still owns its listening socket, but it never services a JSON-RPC request — the exact
    // observable state of a busy-loop / deadlock. A pre-fix launcher adopts on socket-existence alone
    // and bridges the fresh session into a dead end; the fix must deep-probe, fail, and reap+respawn.
    process.kill(orphanPid!, 'SIGSTOP');

    // Fresh session with a short probe so the not-alive verdict is fast and deterministic. The reap
    // grace (SIGTERM is ignored by a stopped process, then SIGKILL) is a fixed 7s, so allow generous
    // startup time before the launcher answers initialize.
    const fresh = await startSession(paths, true, {
      SPECKIT_PROBE_TIMEOUT_MS: '800',
      SPECKIT_LEASE_PROBE_RETRY_TIMEOUT_MS: '800',
      SPECKIT_LEASE_PROBE_RETRIES: '0',
    });
    expect(await statsOk(fresh.client, 20_000)).toBe(true);
    const newPid = leaseDaemonPid(paths.base);
    expect(newPid).toBeTypeOf('number');
    track(newPid!);

    // Recovery invariant: the wedged daemon was reaped (not adopted) and a fresh daemon replaced it.
    expect(newPid).not.toBe(orphanPid);
    await waitForExit(orphanPid!, 10_000);
    expect(isAlive(orphanPid!)).toBe(false);
    await delay(800);

    // Single-writer invariant still holds: exactly one pid holds the sqlite open under the DB dir.
    const dbWriters = sqliteOpenerPids(paths.dbDir);
    expect(dbWriters.length).toBe(1);
  }, 60_000);

  it('a daemon holding a FRESH maintenance marker is ADOPTED, not reaped, despite a non-responsive probe', async () => {
    const paths = buildFakeRoot();

    const owner = await startSession(paths, true);
    expect(await statsOk(owner.client)).toBe(true);
    const orphanPid = leaseDaemonPid(paths.base);
    expect(orphanPid).toBeTypeOf('number');
    track(orphanPid!);

    // Dispose the owner: with reelection the daemon is RELEASED (survives), not killed.
    owner.child.kill('SIGTERM');
    await waitForExit(owner.child.pid!, 8_000);
    await delay(1_200);
    expect(isAlive(orphanPid!)).toBe(true);

    // Publish a FRESH maintenance marker naming the live child: the daemon is mid-scan and is
    // intentionally too busy to service the probe. The launcher resolves the marker dir from
    // SPEC_KIT_DB_DIR (paths.dbDir), the same dir leaseDaemonPid reads.
    writeFileSync(
      join(paths.dbDir, '.maintenance-active.json'),
      JSON.stringify({
        childPid: orphanPid,
        activeUntilMs: Date.now() + 60_000,
        jobId: 'test',
        refreshedAtIso: new Date().toISOString(),
      }),
    );

    // WEDGE the marked daemon so the ADOPTION probe will NOT reply: SIGSTOP freezes its event loop —
    // the exact observable shape of a daemon CPU-blocked mid index-scan. A pre-fix launcher that
    // probes on liveness alone would reap a daemon doing legitimate maintenance; the fix reads the
    // fresh marker, recognizes "busy, not dead", and REFUSES the respawn.
    process.kill(orphanPid!, 'SIGSTOP');

    // A competing launcher arrives with a short probe so its not-responsive verdict is fast and
    // deterministic. The maintenance-grace contract is to ADOPT/refuse-respawn the busy daemon (it is
    // reported lease-held and exits 0), NOT to bridge this contender into a live transport — so we
    // observe the launcher's decision and the daemon's survival, not a working MCP call through it.
    const compete = await spawnCompetingLauncher(paths, {
      SPECKIT_PROBE_TIMEOUT_MS: '800',
      SPECKIT_LEASE_PROBE_RETRY_TIMEOUT_MS: '800',
      SPECKIT_LEASE_PROBE_RETRIES: '0',
    });
    await waitForExit(compete.child.pid!, 20_000);
    const settled = compete.settled();
    // The competing launcher refused to respawn the busy daemon and reported lease-held, then exited 0.
    expect(settled.exited).toBe(true);
    expect(settled.code).toBe(0);
    expect(settled.stdout).toMatch(/LEASE_HELD_BY/);
    expect(settled.stdout).toMatch(/maintenance-active/);

    // Let the marked daemon run again so teardown and the writer checks see a normal process.
    process.kill(orphanPid!, 'SIGCONT');
    await delay(800);

    // Adoption invariant: the FRESH marker pins the busy daemon. It is reused (same pid, still alive),
    // never reaped and respawned, despite the probe failing while it was stopped.
    expect(leaseDaemonPid(paths.base)).toBe(orphanPid);
    expect(isAlive(orphanPid!)).toBe(true);

    // Airtight co-residency check: exactly one pid holds the sqlite open under the DB dir.
    const dbWriters = sqliteOpenerPids(paths.dbDir);
    expect(dbWriters.length).toBe(1);
  }, 60_000);

  it('a STALE maintenance marker does NOT block reaping a wedged daemon', async () => {
    const paths = buildFakeRoot();

    const owner = await startSession(paths, true);
    expect(await statsOk(owner.client)).toBe(true);
    const orphanPid = leaseDaemonPid(paths.base);
    expect(orphanPid).toBeTypeOf('number');
    track(orphanPid!);

    // Dispose the owner: with reelection the daemon is RELEASED (survives), not killed.
    owner.child.kill('SIGTERM');
    await waitForExit(owner.child.pid!, 8_000);
    await delay(1_200);
    expect(isAlive(orphanPid!)).toBe(true);

    // Publish a STALE maintenance marker (already expired): it names the live child but its
    // activeUntilMs is in the past, so the launcher must treat the daemon as unprotected.
    writeFileSync(
      join(paths.dbDir, '.maintenance-active.json'),
      JSON.stringify({
        childPid: orphanPid,
        activeUntilMs: Date.now() - 1_000,
        jobId: 'test',
        refreshedAtIso: new Date().toISOString(),
      }),
    );

    // WEDGE the released daemon. SIGSTOP freezes its event loop, so it never services a probe.
    process.kill(orphanPid!, 'SIGSTOP');

    // Fresh session with a short probe so the not-alive verdict is fast and deterministic.
    const fresh = await startSession(paths, true, {
      SPECKIT_PROBE_TIMEOUT_MS: '800',
      SPECKIT_LEASE_PROBE_RETRY_TIMEOUT_MS: '800',
      SPECKIT_LEASE_PROBE_RETRIES: '0',
    });
    expect(await statsOk(fresh.client, 20_000)).toBe(true);
    const newPid = leaseDaemonPid(paths.base);
    expect(newPid).toBeTypeOf('number');
    track(newPid!);

    // Recovery invariant: the STALE marker does NOT pin the wedged daemon. It was reaped (not adopted)
    // and a fresh daemon replaced it.
    expect(newPid).not.toBe(orphanPid);
    // The reap SIGKILLs the stopped orphan, so it may already be gone — SIGCONT only to be sure a
    // surviving stopped process is resumable for teardown; tolerate ESRCH when it is already reaped.
    try { process.kill(orphanPid!, 'SIGCONT'); } catch { /* already reaped */ }
    await waitForExit(orphanPid!, 10_000);
    expect(isAlive(orphanPid!)).toBe(false);
    await delay(800);

    // Single-writer invariant still holds: exactly one pid holds the sqlite open under the DB dir.
    const dbWriters = sqliteOpenerPids(paths.dbDir);
    expect(dbWriters.length).toBe(1);
  }, 60_000);

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
