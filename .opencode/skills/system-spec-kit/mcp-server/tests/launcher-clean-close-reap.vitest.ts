import { spawn, type ChildProcess } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

// End-to-end coverage of the F2 clean-close barrier: reapLeaseChildBeforeRespawn must SIGTERM a live
// incumbent and report cleanClose=true only when no .unclean-shutdown marker remains at reap time.
// These cases exercise the real reap orchestration against actual child processes, with the marker
// location pinned via MEMORY_DB_PATH (the production resolution) and the marker itself owned by the
// test for determinism. The killed=true / SIGKILL-escalation branch is covered separately by the
// pure cleanCloseAfterReap unit test (launcher-clean-close-barrier.vitest.ts), because reliably
// forcing a child to ignore SIGTERM is environment-fragile.
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

// A graceful child exits on SIGTERM within the reap grace window. This is the deterministic primitive
// the live cases build on: the reap's clean/unclean determination then turns purely on the marker
// file the TEST owns, not on child-side filesystem timing. (The killed=true / SIGKILL-escalation
// branch is intentionally NOT exercised here — it depends on a child reliably IGNORING SIGTERM, which
// is environment-fragile; that branch is covered deterministically by the cleanCloseAfterReap pure
// unit test in launcher-clean-close-barrier.vitest.ts.)
async function spawnGracefulChild(): Promise<number> {
  const script = `process.on('SIGTERM',()=>process.exit(0));setInterval(()=>{},1000);`;
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

  it('reaps a live child via SIGTERM and reports a clean close when no marker remains', async () => {
    if (!livenessReadable) return;
    const dir = newTempDir();
    setMarkerDir(dir);
    // No marker present => the DB was closed cleanly before/at reap time. The graceful child exits on
    // SIGTERM within the grace window; the clean-close determination turns on the marker absence,
    // which the test owns deterministically (not on child-side fs timing).
    const pid = await spawnGracefulChild();

    const result = await launcher.reapLeaseChildBeforeRespawn(pid);
    expect(result.allowed).toBe(true);
    expect(result.reaped).toBe(true);
    expect(result.reason).toBe('child-reaped');
    expect(result.cleanClose).toBe(true); // exited gracefully + no marker => verified clean
    expect(launcher.processLiveness(pid)).toBe('dead'); // genuinely reaped
  });

  it('reaps a live child via SIGTERM but flags an unclean close when the marker survives', async () => {
    if (!livenessReadable) return;
    const dir = newTempDir();
    setMarkerDir(dir);
    writeFileSync(markerPath(dir), ''); // marker present at reap time => DB close not confirmed
    const pid = await spawnGracefulChild();

    const result = await launcher.reapLeaseChildBeforeRespawn(pid);
    expect(result.allowed).toBe(true);
    expect(result.reaped).toBe(true);
    expect(result.cleanClose).toBe(false); // marker present => not a verified clean close
    expect(existsSync(markerPath(dir))).toBe(true);
    expect(launcher.processLiveness(pid)).toBe('dead');
  });
});
