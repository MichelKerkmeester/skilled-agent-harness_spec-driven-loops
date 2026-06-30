import { spawn, type ChildProcess, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';

// These paths are test fixtures coupled to the production launcher layout.
// If a launcher moves, update the fixture path and copied production file together.

interface LauncherRun {
  child: ChildProcessWithoutNullStreams;
  stdout: string;
  stderr: string;
}

interface OwnerLease {
  ownerPid?: unknown;
  startedAtIso?: unknown;
  childSpawnedAtIso?: unknown;
}

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../..');
const launcherRelativePath = '.opencode/bin/mk-code-index-launcher.cjs';
const launcherLibRelativePaths = [
  '.opencode/bin/lib/launcher-ipc-bridge.cjs',
  '.opencode/bin/lib/launcher-session-proxy.cjs',
] as const;
const pidFileRelativePath = '.opencode/skills/system-code-graph/mcp_server/database/.mk-code-index-launcher.json';
const ownerLeaseRelativePath = '.opencode/skills/system-code-graph/mcp_server/database/.code-graph-owner.json';
const tempDirs: string[] = [];
const launcherRuns: LauncherRun[] = [];
const require = createRequire(import.meta.url);
const launcherModule = require(join(repoRoot, launcherRelativePath)) as {
  configureLeaseMetricSinkForTesting: (sink: ((payload: Record<string, unknown>) => void) | null) => void;
  emitLeaseMetric: (leaseClass: string, details?: Record<string, unknown>) => void;
  leaseMetricClassForTransition: (transition: string) => string;
  leaseMetricCounterName: (leaseClass: string) => string;
};

function createWorkspace(options: { ignoreChildSigterm?: boolean } = {}): { root: string; launcherPath: string; pidFilePath: string } {
  const root = mkdtempSync(join(tmpdir(), 'mk-code-index-lease-'));
  tempDirs.push(root);

  const launcherPath = join(root, launcherRelativePath);
  mkdirSync(dirname(launcherPath), { recursive: true });
  copyFileSync(join(repoRoot, launcherRelativePath), launcherPath);
  for (const relativePath of launcherLibRelativePaths) {
    const destination = join(root, relativePath);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(join(repoRoot, relativePath), destination);
  }

  const directServer = join(root, '.opencode/skills/system-code-graph/mcp_server/dist/index.js');
  mkdirSync(dirname(directServer), { recursive: true });
  writeFileSync(
    directServer,
    options.ignoreChildSigterm
      ? "process.on('SIGTERM', () => {}); process.on('SIGINT', () => process.exit(0)); setTimeout(() => process.exit(0), 6500); setInterval(() => {}, 1000);\n"
      : "process.on('SIGTERM', () => process.exit(0)); process.on('SIGINT', () => process.exit(0)); setInterval(() => {}, 1000);\n",
    'utf8',
  );

  return { root, launcherPath, pidFilePath: join(root, pidFileRelativePath) };
}

function spawnLauncher(launcherPath: string, root: string, env: NodeJS.ProcessEnv = {}): LauncherRun {
  const baseEnv = { ...process.env };
  delete baseEnv.MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER;
  delete baseEnv.MK_CODE_INDEX_STRICT_SINGLE_WRITER;
  delete baseEnv.MK_SPEC_MEMORY_STRICT_SINGLE_WRITER;
  delete baseEnv.SPECKIT_CODE_GRAPH_DB_DIR;

  const run: LauncherRun = {
    child: spawn(process.execPath, [launcherPath], {
      cwd: root,
      env: { ...baseEnv, ...env },
      stdio: ['ignore', 'pipe', 'pipe'],
    }),
    stdout: '',
    stderr: '',
  };
  run.child.stdout.setEncoding('utf8');
  run.child.stderr.setEncoding('utf8');
  run.child.stdout.on('data', (chunk) => {
    run.stdout += chunk;
  });
  run.child.stderr.on('data', (chunk) => {
    run.stderr += chunk;
  });
  launcherRuns.push(run);
  return run;
}

async function waitFor(predicate: () => boolean, timeoutMs: number, label: string): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() <= deadline) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 25));
  }
  throw new Error(`Timed out waiting for ${label}`);
}

async function waitForExit(
  child: ChildProcess,
  timeoutMs: number,
): Promise<{ code: number | null; signal: NodeJS.Signals | null }> {
  if (child.exitCode !== null || child.signalCode !== null) {
    return { code: child.exitCode, signal: child.signalCode };
  }
  return await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      child.off('exit', onExit);
      reject(new Error(`Timed out waiting for pid ${child.pid} to exit`));
    }, timeoutMs);
    const onExit = (code: number | null, signal: NodeJS.Signals | null) => {
      clearTimeout(timeout);
      resolve({ code, signal });
    };
    child.once('exit', onExit);
  });
}

async function waitForStdoutClose(run: LauncherRun): Promise<void> {
  if (run.child.stdout.closed) return;
  await new Promise<void>((resolve) => {
    run.child.stdout.once('close', () => resolve());
  });
}

async function terminate(run: LauncherRun): Promise<void> {
  if (run.child.exitCode !== null || run.child.signalCode !== null) return;
  run.child.kill('SIGTERM');
    try {
      await waitForExit(run.child, 1000);
    } catch {
      run.child.kill('SIGKILL');
      try {
        await waitForExit(run.child, 1000);
      } catch {
        // Best-effort teardown; the temp dir cleanup below is authoritative.
      }
    }
  }

function readLeasePid(pidFilePath: string): number | null {
  try {
    const parsed = JSON.parse(readFileSync(pidFilePath, 'utf8')) as { pid?: unknown };
    return typeof parsed.pid === 'number' ? parsed.pid : null;
  } catch {
    return null;
  }
}

function readOwnerLease(root: string): OwnerLease | null {
  try {
    return JSON.parse(readFileSync(join(root, ownerLeaseRelativePath), 'utf8')) as OwnerLease;
  } catch {
    return null;
  }
}

function readOwnerLeasePid(root: string): number | null {
  const parsed = readOwnerLease(root);
  return typeof parsed?.ownerPid === 'number' ? parsed.ownerPid : null;
}

async function waitForLeasePid(pidFilePath: string, pid: number | undefined): Promise<void> {
  if (typeof pid !== 'number') throw new Error('launcher pid was not assigned');
  await waitFor(() => readLeasePid(pidFilePath) === pid, 2000, `lease pid ${pid}`);
}

async function createDeadPid(): Promise<number> {
  const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000);'], {
    stdio: 'ignore',
  });
  await new Promise<void>((resolve, reject) => {
    child.once('spawn', () => resolve());
    child.once('error', reject);
  });
  if (typeof child.pid !== 'number') {
    throw new Error('dead-pid child did not get a pid');
  }
  const pid = child.pid;
  child.kill('SIGTERM');
  await waitForExit(child, 1000);
  return pid;
}

async function createLivePid(): Promise<ChildProcess> {
  const child = spawn(process.execPath, ['-e', 'setInterval(() => {}, 1000);'], {
    stdio: 'ignore',
  });
  await new Promise<void>((resolve, reject) => {
    child.once('spawn', () => resolve());
    child.once('error', reject);
  });
  if (typeof child.pid !== 'number') {
    throw new Error('live-pid child did not get a pid');
  }
  return child;
}

describe('mk-code-index launcher lease', () => {
  afterEach(async () => {
    launcherModule.configureLeaseMetricSinkForTesting(null);
    while (launcherRuns.length > 0) {
      const run = launcherRuns.pop();
      if (run) await terminate(run);
    }
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  });

  // Duplicate launcher exits before opening SQLite.
  it('classifies lease metric transitions and emits through a no-op-default sink', () => {
    expect(launcherModule.leaseMetricClassForTransition('heldByOther')).toBe('held-by-other');
    expect(launcherModule.leaseMetricClassForTransition('bridgedSecondary')).toBe('bridged-secondary');
    expect(launcherModule.leaseMetricClassForTransition('staleReclaimed')).toBe('stale-reclaimed');
    expect(launcherModule.leaseMetricClassForTransition('respawned')).toBe('respawned');
    expect(launcherModule.leaseMetricCounterName('stale-reclaimed')).toBe('mk_code_index_lease_stale_reclaimed_total');

    launcherModule.emitLeaseMetric('held-by-other', { ownerPid: 123 });
    const emitted: Array<Record<string, unknown>> = [];
    launcherModule.configureLeaseMetricSinkForTesting((payload) => emitted.push(payload));
    launcherModule.emitLeaseMetric('bridged-secondary', { ownerPid: 456, reason: 'bridge' });

    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toMatchObject({
      counter: 'mk_code_index_lease_bridged_secondary_total',
      class: 'bridged-secondary',
      count: 1,
      ownerPid: 456,
      reason: 'bridge',
    });
    expect(typeof emitted[0].at).toBe('string');
  });

  it('exits with LEASE_HELD_BY when a live owner exists', async () => {
    const workspace = createWorkspace();
    const first = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForLeasePid(workspace.pidFilePath, first.child.pid);

    const second = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForStdoutClose(second);
    const exit = await waitForExit(second.child, 8000);
    const ownerPid = readOwnerLeasePid(workspace.root);

    expect(exit.code).toBe(0);
    expect(ownerPid).not.toBeNull();
    expect(second.stdout).toContain(`LEASE_HELD_BY:${ownerPid}`);
    expect(second.stdout).toMatch(new RegExp(`^LEASE_HELD_BY:${ownerPid} startedAt=\\d{4}-\\d{2}-\\d{2}T`, 'm'));
  });

  it('stamps childSpawnedAtIso when the owner lease is patched to the child pid', async () => {
    const workspace = createWorkspace();
    const run = spawnLauncher(workspace.launcherPath, workspace.root);

    await waitFor(
      () => typeof readOwnerLease(workspace.root)?.childSpawnedAtIso === 'string',
      4000,
      'child spawn timestamp in owner lease',
    );

    const lease = readOwnerLease(workspace.root);
    expect(typeof lease?.startedAtIso).toBe('string');
    expect(typeof lease?.childSpawnedAtIso).toBe('string');
    expect(lease?.ownerPid).not.toBe(run.child.pid);

    const childSpawnedAtIso = lease?.childSpawnedAtIso as string;
    expect(Number.isFinite(Date.parse(childSpawnedAtIso))).toBe(true);
    expect(new Date(childSpawnedAtIso).toISOString()).toBe(childSpawnedAtIso);
  });

  it('lets exactly one concurrent launcher own the lease', async () => {
    const workspace = createWorkspace();
    const first = spawnLauncher(workspace.launcherPath, workspace.root);
    const second = spawnLauncher(workspace.launcherPath, workspace.root);

    await waitFor(() => readOwnerLeasePid(workspace.root) !== null, 2000, 'owner lease');
    await waitFor(
      () => first.child.exitCode !== null || second.child.exitCode !== null || first.stdout.includes('LEASE_HELD_BY') || second.stdout.includes('LEASE_HELD_BY'),
      8000,
      'one launcher to report lease held',
    );

    const ownerPid = readOwnerLeasePid(workspace.root);
    const runs = [first, second];
    const running = runs.filter((run) => run.child.exitCode === null && !run.stdout.includes('LEASE_HELD_BY:'));
    const blocked = runs.filter((run) => run.stdout.includes('LEASE_HELD_BY:'));

    expect(ownerPid).not.toBeNull();
    expect(running).toHaveLength(1);
    expect(blocked).toHaveLength(1);
  });

  // Live-owner diagnostics include the recorded startedAt value.
  it('reports the lease startedAt value for a live owner', async () => {
    const workspace = createWorkspace();
    const holder = await createLivePid();
    const startedAt = '2026-05-18T00:00:00.000Z';

    try {
      mkdirSync(dirname(workspace.pidFilePath), { recursive: true });
      writeFileSync(workspace.pidFilePath, JSON.stringify({ pid: holder.pid, startedAt }));

      const run = spawnLauncher(workspace.launcherPath, workspace.root);
      await waitForStdoutClose(run);
      const exit = await waitForExit(run.child, 8000);

      expect(exit.code).toBe(0);
      expect(run.stdout).toContain(`LEASE_HELD_BY:${holder.pid} startedAt=${startedAt}`);
    } finally {
      holder.kill('SIGTERM');
      try {
        await waitForExit(holder, 1000);
      } catch {
        holder.kill('SIGKILL');
      }
    }
  });

  // The launcher lease follows the resolved code-graph DB directory.
  it('stores the PID file next to SPECKIT_CODE_GRAPH_DB_DIR when overridden', async () => {
    const workspace = createWorkspace();
    const dbDir = join(workspace.root, 'shared-code-graph-db');
    const pidFilePath = join(dbDir, '.mk-code-index-launcher.json');

    const run = spawnLauncher(workspace.launcherPath, workspace.root, {
      SPECKIT_CODE_GRAPH_DB_DIR: dbDir,
    });
    await waitForLeasePid(pidFilePath, run.child.pid);

    expect(existsSync(pidFilePath)).toBe(true);
    expect(existsSync(workspace.pidFilePath)).toBe(false);
  });

  it('rejects SPECKIT_CODE_GRAPH_DB_DIR outside the workspace', async () => {
    const workspace = createWorkspace();
    const outsideDbDir = mkdtempSync(join(tmpdir(), 'mk-code-index-outside-db-'));
    tempDirs.push(outsideDbDir);

    const run = spawnLauncher(workspace.launcherPath, workspace.root, {
      SPECKIT_CODE_GRAPH_DB_DIR: outsideDbDir,
    });
    const exit = await waitForExit(run.child, 8000);

    expect(exit.code).toBe(1);
    expect(run.stderr).toContain('SPECKIT_CODE_GRAPH_DB_DIR must stay within workspace root');
    expect(existsSync(join(outsideDbDir, '.mk-code-index-launcher.json'))).toBe(false);
  });

  it('does not load NODE_OPTIONS from project dotenv', async () => {
    const workspace = createWorkspace();
    writeFileSync(join(workspace.root, '.env.local'), 'NODE_OPTIONS=--require ./pwn.js\nSPECKIT_CODE_GRAPH_MAINTAINER_MODE=true\n');

    const run = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForLeasePid(workspace.pidFilePath, run.child.pid);

    expect(run.stderr).toContain('env NODE_OPTIONS from .env.local is not allowlisted; skipping');
  });

  // Dead-PID lease files are reclaimable.
  it('reclaims a dead-pid lease file and logs staleReclaimed', async () => {
    const workspace = createWorkspace();
    mkdirSync(dirname(workspace.pidFilePath), { recursive: true });
    writeFileSync(workspace.pidFilePath, JSON.stringify({ pid: await createDeadPid(), startedAt: new Date().toISOString() }));

    const run = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitFor(() => /^.*staleReclaimed: true\b/m.test(run.stderr), 2000, 'stale reclaim log');
    expect(run.stderr).toMatch(/^.*staleReclaimed: true\b/m);
    await waitForLeasePid(workspace.pidFilePath, run.child.pid);

    expect(readLeasePid(workspace.pidFilePath)).toBe(run.child.pid);
  });

  // Two concurrent launchers migrating a former-location DB into the same target must
  // never clobber/truncate the live target. Exactly one launcher (the bootstrap-lock winner)
  // migrates, and the target byte-content stays stable. Fails against the un-fixed code, which
  // ran the migration before any lock with a plain copyFileSync (no COPYFILE_EXCL) — letting both
  // launchers copy and a lagging copier overwrite the now-live target.
  it('migrates a former-location DB exactly once under two concurrent launchers', async () => {
    const workspace = createWorkspace();

    // Seed the former shared standalone DB location with a code-graph.sqlite ONLY (no live PID
    // lease there, so formerLocationOwnerLive() is false and migration is allowed). The content
    // is a fixed, recognizable payload so we can assert byte-stability of the migrated target.
    const formerDbDir = join(
      workspace.root,
      '.opencode',
      '.spec-kit',
      'code-graph',
      'database',
    );
    mkdirSync(formerDbDir, { recursive: true });
    const formerSqlite = join(formerDbDir, 'code-graph.sqlite');
    // Deterministic, non-trivial payload (8 KiB of a fixed byte) so a partial/truncating
    // overwrite would change either the length or the content.
    const seededContent = Buffer.alloc(8 * 1024, 0x5a);
    writeFileSync(formerSqlite, seededContent);

    const targetSqlite = join(dirname(workspace.pidFilePath), 'code-graph.sqlite');

    // Spawn two launchers simultaneously; both will attempt migration in the un-fixed code.
    const first = spawnLauncher(workspace.launcherPath, workspace.root);
    const second = spawnLauncher(workspace.launcherPath, workspace.root);

    // Wait for an owner to be recorded and for one launcher to report lease-held (the loser).
    await waitFor(() => readOwnerLeasePid(workspace.root) !== null, 4000, 'owner lease');
    await waitFor(() => existsSync(targetSqlite), 4000, 'migrated target DB');
    await waitFor(
      () =>
        first.child.exitCode !== null ||
        second.child.exitCode !== null ||
        first.stdout.includes('LEASE_HELD_BY') ||
        second.stdout.includes('LEASE_HELD_BY'),
      8000,
      'one launcher to settle (lease held)',
    );

    // Snapshot the migrated target, then let everything settle and re-read: a lagging copier in
    // the un-fixed code could overwrite/truncate the live target between these two reads.
    const afterFirst = readFileSync(targetSqlite);
    await new Promise((r) => setTimeout(r, 400));
    const afterSettle = readFileSync(targetSqlite);

    // The migrated DB must equal the seeded source and never change (byte-stability).
    expect(afterFirst.equals(seededContent)).toBe(true);
    expect(afterSettle.equals(seededContent)).toBe(true);
    expect(afterSettle.length).toBe(seededContent.length);

    // Exactly one migration occurred across both launchers. The un-fixed code (no lock gate,
    // no COPYFILE_EXCL) can log this line twice; the fix gates migration on the single
    // bootstrap-lock winner, so it appears exactly once.
    const migrationLines = (first.stderr + second.stderr).match(/migrated DB from/g) ?? [];
    expect(migrationLines).toHaveLength(1);

    // Exactly one launcher owns the lease; the other bridges/reports.
    const ownerPid = readOwnerLeasePid(workspace.root);
    expect(ownerPid).not.toBeNull();
  });

  it('reclaims a stale-heartbeat owner lease with a live PID', async () => {
    const workspace = createWorkspace();
    const holder = await createLivePid();
    const ownerLeasePath = join(workspace.root, ownerLeaseRelativePath);
    const dbDir = dirname(ownerLeasePath);

    try {
      mkdirSync(dbDir, { recursive: true });
      writeFileSync(ownerLeasePath, JSON.stringify({
        ownerPid: holder.pid,
        ppid: process.pid,
        executablePath: process.execPath,
        startedAtIso: '2026-05-22T00:00:00.000Z',
        lastHeartbeatIso: '2026-05-22T00:00:00.000Z',
        ttlMs: 10,
        canonicalDbDir: resolve(dbDir),
      }, null, 2));

      const run = spawnLauncher(workspace.launcherPath, workspace.root);
      await waitFor(() => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(run.stderr), 2000, 'stale-heartbeat owner reclaim log');
      await waitForLeasePid(workspace.pidFilePath, run.child.pid);

      expect(run.stderr).toContain(`ownerLeaseReclaimed: stale-heartbeat-reclaim ownerPid=${holder.pid}`);
      expect(readOwnerLeasePid(workspace.root)).not.toBe(holder.pid);
    } finally {
      holder.kill('SIGTERM');
      try {
        await waitForExit(holder, 1000);
      } catch {
        holder.kill('SIGKILL');
      }
    }
  });

  // Two launchers reclaiming the SAME pre-existing stale-heartbeat owner lease at once.
  // Both read the identical stale lease and BOTH enter acquireOwnerLeaseFile's reclaim branch
  // (the acquire-time re-read CAS) — the path the existing concurrent-launcher test
  // never reaches, because it spawns from a FRESH workspace where both take the O_EXCL 'wx'
  // fresh-create path. This test seeds a stale-heartbeat owner lease owned by a LIVE helper pid
  // (so classifyOwnerLease returns 'stale-heartbeat-reclaim') and spawns two launchers at once so
  // both observe the same existing stale lease and both run the reclaim branch concurrently —
  // genuinely new coverage of the concurrent reclaim path.
  //
  // SCOPE / DETERMINISM NOTE (honest): at the launcher-spawn boundary the acquire-time re-read CAS
  // is NOT isolable from naive last-writer-wins, so this test does NOT claim to fail iff the
  // re-read is deleted. Measured against both the patched launcher and a launcher with ONLY the
  // acquire-time re-read removed, the spawned-process outcomes are statistically indistinguishable:
  // single-writer is independently enforced by the bootstrap lock (acquireBootstrapLock), the PID
  // lease, and the re-read-before-unlink guard in clearOwnerLeaseFile. The acquire-time
  // re-read only narrows a sub-syscall window already covered by those guards.
  //
  // Two further measured facts make stronger end-state assertions UNSOUND at this layer, so this
  // test deliberately does NOT assert them: (1) the concurrent reclaim does not reach a clean
  // LEASE_HELD_BY/exit terminal state within seconds — both launchers can stay alive (one
  // daemon-parent, one bridged-and-waiting); and (2) when both launchers pass the owner-lease gate,
  // the downstream PID-lease write is last-writer-wins, so the recorded PID lease can legitimately
  // flip between the two launchers' pids (observed clobber on the patched launcher too). These are
  // launcher-runtime characteristics outside this test's deterministic assertions and the
  // migration-block scenario.
  //
  // What this test asserts is what IS deterministically true and valuable as regression coverage:
  // both concurrent launchers exercise the stale-heartbeat reclaim branch (new coverage — the
  // existing concurrent test uses a FRESH workspace and only hits the O_EXCL fresh-create path),
  // neither launcher errors/crashes in that path, and the seeded stale holder is reclaimed away —
  // it never remains the recorded owner once both launchers have reclaimed.
  it('exercises the concurrent stale-heartbeat reclaim branch in both launchers without errors', async () => {
    const ROUNDS = 5;
    for (let round = 0; round < ROUNDS; round += 1) {
      const workspace = createWorkspace();
      const holder = await createLivePid();
      const ownerLeasePath = join(workspace.root, ownerLeaseRelativePath);
      const dbDir = dirname(ownerLeasePath);

      try {
        // Seed a stale-heartbeat owner lease owned by a LIVE helper pid so classifyOwnerLease
        // returns 'stale-heartbeat-reclaim' (live pid + heartbeat older than 2*ttlMs), forcing
        // both launchers down the reclaim branch rather than the fresh-create branch.
        mkdirSync(dbDir, { recursive: true });
        writeFileSync(ownerLeasePath, JSON.stringify({
          ownerPid: holder.pid,
          ppid: process.pid,
          executablePath: process.execPath,
          startedAtIso: '2026-05-22T00:00:00.000Z',
          lastHeartbeatIso: '2026-05-22T00:00:00.000Z',
          ttlMs: 10,
          canonicalDbDir: resolve(dbDir),
        }, null, 2));

        // Spawn both simultaneously so both observe the SAME existing stale lease and both enter
        // the reclaim re-read CAS.
        const first = spawnLauncher(workspace.launcherPath, workspace.root);
        const second = spawnLauncher(workspace.launcherPath, workspace.root);

        // BOTH must observe the stale lease and run the reclaim branch — the precondition that
        // gives this test its coverage value (the existing concurrent test never reaches it).
        await waitFor(
          () => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(first.stderr),
          4000,
          `first launcher stale-heartbeat reclaim (round ${round})`,
        );
        await waitFor(
          () => /ownerLeaseReclaimed: stale-heartbeat-reclaim/.test(second.stderr),
          4000,
          `second launcher stale-heartbeat reclaim (round ${round})`,
        );

        // The reclaim must actually take effect: the seeded stale holder is gone from the recorded
        // owner lease (a launcher reclaimed it). Once a launcher has reclaimed, the holder must
        // never remain the owner. This is deterministically true (the holder lease is stale).
        await waitFor(
          () => readOwnerLeasePid(workspace.root) !== holder.pid,
          4000,
          `seeded stale holder to be reclaimed out of the owner lease (round ${round})`,
        );

        // Neither launcher crashed in the reclaim path (no failure log / non-1 exit). The reclaim
        // either elects an owner or bridges; it must never raise an error.
        const reclaimErrored = (run: LauncherRun): boolean =>
          /^\[mk-code-index-launcher\] failed:/m.test(run.stderr) || run.child.exitCode === 1;
        expect(reclaimErrored(first), `first launcher must not error in reclaim (round ${round})`).toBe(false);
        expect(reclaimErrored(second), `second launcher must not error in reclaim (round ${round})`).toBe(false);

        // And the stale holder never re-asserts ownership after the reclaim.
        expect(readOwnerLeasePid(workspace.root), `seeded stale holder must not own the lease (round ${round})`).not.toBe(holder.pid);
      } finally {
        while (launcherRuns.length > 0) {
          const run = launcherRuns.pop();
          if (run) await terminate(run);
        }
        holder.kill('SIGTERM');
        try {
          await waitForExit(holder, 1000);
        } catch {
          holder.kill('SIGKILL');
        }
      }
    }
  });

  // Clean child exit removes the lease file.
  it('removes the PID file on clean exit', async () => {
    const workspace = createWorkspace();
    const run = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForLeasePid(workspace.pidFilePath, run.child.pid);

    run.child.kill('SIGTERM');
    await waitForExit(run.child, 5000);

    expect(existsSync(workspace.pidFilePath)).toBe(false);
  });

  // SIGQUIT follows the same lease cleanup path.
  it('removes the PID file on SIGQUIT', async () => {
    const workspace = createWorkspace();
    const run = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForLeasePid(workspace.pidFilePath, run.child.pid);

    run.child.kill('SIGQUIT');
    await waitForExit(run.child, 5000);

    expect(existsSync(workspace.pidFilePath)).toBe(false);
  });

  // Live legacy launcher lease blocks rolling-start duplicates.
  it('reports LEASE_HELD_BY from the legacy launcher lease path', async () => {
    const workspace = createWorkspace();
    const holder = await createLivePid();
    const startedAt = '2026-05-18T00:00:00.000Z';
    const legacyPath = join(
      workspace.root,
      '.opencode',
      '.spec-kit',
      'code-graph',
      'database',
      '.mk-code-index-launcher.json',
    );

    try {
      mkdirSync(dirname(legacyPath), { recursive: true });
      writeFileSync(legacyPath, JSON.stringify({ pid: holder.pid, startedAt }));

      const run = spawnLauncher(workspace.launcherPath, workspace.root);
      await waitForStdoutClose(run);
      const exit = await waitForExit(run.child, 8000);

      expect(exit.code).toBe(0);
      expect(run.stdout).toContain(`LEASE_HELD_BY:${holder.pid} startedAt=${startedAt} (legacy path)`);
    } finally {
      holder.kill('SIGTERM');
      try {
        await waitForExit(holder, 1000);
      } catch {
        holder.kill('SIGKILL');
      }
    }
  });

  // Parent SIGTERM cleanup clears launcher metadata without killing an ignored child.
  it('removes the PID file when the child ignores SIGTERM until launcher cleanup timeout', async () => {
    const workspace = createWorkspace({ ignoreChildSigterm: true });
    const run = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForLeasePid(workspace.pidFilePath, run.child.pid);

    run.child.kill('SIGTERM');
    await waitForExit(run.child, 8000);

    expect(existsSync(workspace.pidFilePath)).toBe(false);
  });

  // Strict single-writer can be disabled for intentional parallel runs.
  it('boots a sibling when strict single-writer is disabled', async () => {
    const workspace = createWorkspace();
    const first = spawnLauncher(workspace.launcherPath, workspace.root);
    await waitForLeasePid(workspace.pidFilePath, first.child.pid);

    const second = spawnLauncher(workspace.launcherPath, workspace.root, {
      MK_CODE_INDEX_STRICT_SINGLE_WRITER: '0',
    });
    await waitForLeasePid(workspace.pidFilePath, second.child.pid);

    expect(second.child.exitCode).toBeNull();
    expect(second.stderr).toContain('MK_CODE_INDEX_STRICT_SINGLE_WRITER is disabled; skipping lease check');
    expect(existsSync(workspace.pidFilePath)).toBe(true);
  });
});
