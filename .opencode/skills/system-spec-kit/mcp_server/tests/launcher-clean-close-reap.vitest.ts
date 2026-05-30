import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

// End-to-end coverage of the F2 clean-close barrier: reapLeaseChildBeforeRespawn must SIGTERM a live
// incumbent, escalate to SIGKILL only if it ignores SIGTERM, and report cleanClose=true only when the
// child both exited gracefully AND removed the .unclean-shutdown marker. The pure helpers are unit-
// tested elsewhere; this exercises the real reap orchestration against actual child processes and a
// real marker file, with the marker location pinned via MEMORY_DB_PATH (the production resolution).
const require = createRequire(import.meta.url);
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const launcher = require(join(repoRoot, '.opencode/bin/mk-spec-memory-launcher.cjs')) as {
  reapLeaseChildBeforeRespawn: (childPid: number) => Promise<{
    allowed: boolean;
    reaped?: boolean;
    cleanClose?: boolean;
    reason: string;
  }>;
  uncleanShutdownMarkerPath: () => string;
  processLiveness: (pid: number) => string;
};

const tempDirs: string[] = [];
const children: ChildProcess[] = [];
const savedMemoryDbPath = process.env.MEMORY_DB_PATH;

// The grace before SIGKILL escalation is 7s; the ignore-SIGTERM case needs room for grace + the 1s
// post-kill wait, so the suite uses a generous per-test deadline rather than a fixed sleep.
const KILL_CASE_TIMEOUT_MS = 20_000;

// A child whose liveness we cannot prove (hardened-sandbox EPERM) makes the reap return
// child-liveness-unknown-eperm, which is a legitimate refusal, not the behavior under test. Detect it
// once up front and skip-with-reason rather than assert the wrong branch.
let livenessReadable = true;

function setMarkerDir(dir: string): void {
  // uncleanShutdownMarkerPath() uses dirname(MEMORY_DB_PATH); point it at our temp dir.
  process.env.MEMORY_DB_PATH = join(dir, 'context-index.sqlite');
}

function markerPath(dir: string): string {
  return join(dir, '.unclean-shutdown');
}

function newTempDir(): string {
  const dir = mkdtempSync(join(tmpdir(), 'mk-reap-'));
  tempDirs.push(dir);
  return dir;
}

// Spawn a throwaway child that stays alive until signalled. `mode` controls how it reacts to SIGTERM,
// which is what drives the clean/unclean/killed branches of the reap.
async function spawnChild(mode: 'graceful-clean' | 'graceful-dirty' | 'ignore-sigterm', marker: string): Promise<number> {
  let script: string;
  if (mode === 'graceful-clean') {
    // Exit on SIGTERM AND remove the marker => a verified clean close.
    script = `const fs=require('fs');process.on('SIGTERM',()=>{try{fs.rmSync(${JSON.stringify(marker)},{force:true});}catch{}process.exit(0);});setInterval(()=>{},1000);`;
  } else if (mode === 'graceful-dirty') {
    // Exit on SIGTERM but leave the marker => exited cleanly yet DB not confirmed closed.
    script = `process.on('SIGTERM',()=>process.exit(0));setInterval(()=>{},1000);`;
  } else {
    // Ignore SIGTERM => forces the SIGKILL escalation (killed=true).
    script = `process.on('SIGTERM',()=>{});setInterval(()=>{},1000);`;
  }
  const child = spawn(process.execPath, ['-e', script], { stdio: 'ignore' });
  children.push(child);
  await new Promise<void>((res, rej) => {
    child.once('spawn', () => res());
    child.once('error', rej);
  });
  if (typeof child.pid !== 'number') throw new Error('child did not get a pid');
  return child.pid;
}

beforeAll(async () => {
  // One-shot liveness probe on a known-live child; if the platform hides it, skip the live-child cases.
  const probe = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000);'], { stdio: 'ignore' });
  children.push(probe);
  await new Promise<void>((res, rej) => { probe.once('spawn', () => res()); probe.once('error', rej); });
  livenessReadable = launcher.processLiveness(probe.pid as number) === 'alive';
  probe.kill('SIGKILL');
});

afterEach(() => {
  while (children.length) {
    const c = children.pop();
    try { if (c && c.exitCode === null && c.signalCode === null) c.kill('SIGKILL'); } catch { /* already gone */ }
  }
  while (tempDirs.length) {
    const d = tempDirs.pop();
    try { if (d) rmSync(d, { recursive: true, force: true }); } catch { /* best effort */ }
  }
  if (savedMemoryDbPath === undefined) delete process.env.MEMORY_DB_PATH;
  else process.env.MEMORY_DB_PATH = savedMemoryDbPath;
});

describe('reapLeaseChildBeforeRespawn (F2 clean-close barrier, live)', () => {
  it('marker location follows MEMORY_DB_PATH', () => {
    const dir = newTempDir();
    setMarkerDir(dir);
    expect(launcher.uncleanShutdownMarkerPath()).toBe(markerPath(dir));
  });

  it('reports an already-dead child without reaping, deriving cleanClose from the marker', async () => {
    const dir = newTempDir();
    setMarkerDir(dir);
    // No marker present => a dead child that left a clean DB.
    const deadChild = spawn(process.execPath, ['-e', 'setInterval(()=>{},1000);'], { stdio: 'ignore' });
    await new Promise<void>((res, rej) => { deadChild.once('spawn', () => res()); deadChild.once('error', rej); });
    const pid = deadChild.pid as number;
    deadChild.kill('SIGKILL');
    await new Promise<void>((res) => deadChild.once('exit', () => res()));

    if (launcher.processLiveness(pid) === 'unknown-eperm') return; // platform hides liveness; nothing to assert
    const result = await launcher.reapLeaseChildBeforeRespawn(pid);
    expect(result.allowed).toBe(true);
    expect(result.reaped).toBe(false);
    expect(result.reason).toBe('child-already-dead');
    expect(result.cleanClose).toBe(true); // no marker => clean
  });

  it('reaps a live child via SIGTERM and reports a clean close when the marker is removed', async () => {
    if (!livenessReadable) return;
    const dir = newTempDir();
    setMarkerDir(dir);
    writeFileSync(markerPath(dir), ''); // DB-open marker, removed by the graceful-clean child on SIGTERM
    const pid = await spawnChild('graceful-clean', markerPath(dir));

    const result = await launcher.reapLeaseChildBeforeRespawn(pid);
    expect(result.allowed).toBe(true);
    expect(result.reaped).toBe(true);
    expect(result.reason).toBe('child-reaped');
    expect(result.cleanClose).toBe(true);
    expect(existsSync(markerPath(dir))).toBe(false); // child removed it
    expect(launcher.processLiveness(pid)).toBe('dead'); // genuinely reaped
  });

  it('reaps a live child via SIGTERM but flags an unclean close when the marker survives', async () => {
    if (!livenessReadable) return;
    const dir = newTempDir();
    setMarkerDir(dir);
    writeFileSync(markerPath(dir), ''); // marker left in place: exited but DB close not confirmed
    const pid = await spawnChild('graceful-dirty', markerPath(dir));

    const result = await launcher.reapLeaseChildBeforeRespawn(pid);
    expect(result.allowed).toBe(true);
    expect(result.reaped).toBe(true);
    expect(result.cleanClose).toBe(false); // marker present => not a verified clean close
    expect(existsSync(markerPath(dir))).toBe(true);
  });

  it('escalates to SIGKILL when the child ignores SIGTERM and reports an unclean close', async () => {
    if (!livenessReadable) return;
    const dir = newTempDir();
    setMarkerDir(dir);
    // Marker absent, but a SIGKILLed child can never confirm a clean close => cleanClose must be false.
    const pid = await spawnChild('ignore-sigterm', markerPath(dir));

    const result = await launcher.reapLeaseChildBeforeRespawn(pid);
    expect(result.allowed).toBe(true);
    expect(result.reaped).toBe(true);
    expect(result.cleanClose).toBe(false); // killed=true => never clean, even with no marker
    expect(launcher.processLiveness(pid)).toBe('dead'); // SIGKILL backstop worked
  }, KILL_CASE_TIMEOUT_MS);
});
