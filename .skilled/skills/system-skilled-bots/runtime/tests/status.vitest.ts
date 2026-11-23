// ───────────────────────────────────────────────────────────────────
// MODULE: Status Tests
// ───────────────────────────────────────────────────────────────────
//
// Every row state status can show, from fixtures in temp folders: a bot
// installed and never run, one that died at launchd, a missing and an
// unreadable checkout, a moved checkout and two live clones, a run folder
// that vanished, open and expired needs-you items, a held bot and a stale
// schedule. launchctl is a stand-in that answers `print` from a table; the
// CLI cases load the intercept, so nothing reaches the real scheduler.

import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { identityKey } from '../lib/identity.js';
import { parseLaunchctlPrint, printLabel } from '../lib/launchctl-print.js';
import { identityStatePaths, needsYouFile, registerRoot, runRoot, statusIndexFile, writeGenerationStamp } from '../lib/state-root.js';
import { checkPath, formatStatus, statusReport, unregisterIdentity } from '../lib/status.js';
import { rebuildIndex } from '../lib/status-index.js';
import { BOTS_CLI, filesUnder } from './runner-support.js';
import { fakeInstall, linkedCheckout, printOutput, skilledTreeWithRunner, statusCheckout, statusWorld, writeRecord, writeStatusItem } from './status-support.js';
import { cleanupTemp, tempDir } from './support.js';

import type { BotStatusRow, ItemStatusRow, StatusReport } from '../lib/status.js';
import type { StatusWorld } from './status-support.js';

const INTERCEPT = resolve(import.meta.dirname, 'fixtures', 'launchctl-intercept.cjs');

// Permissions a test takes away are given back before the temp folders are removed.
const locked: string[] = [];
afterEach(() => {
  for (const path of locked.splice(0)) chmodSync(path, 0o755);
  cleanupTemp();
});

function lock(path: string): void {
  chmodSync(path, 0o000);
  locked.push(path);
}

function at(minute: number): string {
  return new Date(Date.UTC(2026, 10, 20, 9, minute)).toISOString();
}

function report(world: StatusWorld, extra: { includeRetired?: boolean; now?: Date } = {}): StatusReport {
  const result = statusReport({ stateRoot: world.stateRoot, seams: world.seams, env: { PATH: process.env.PATH, HOME: world.home }, ...extra });
  if (!result.ok) throw new Error(`${result.reason} ${result.detail ?? ''}`);
  return result.value;
}

function rebuild(world: StatusWorld, now?: Date): void {
  const built = rebuildIndex(world.stateRoot, now === undefined ? {} : { now });
  if (!built.ok) throw new Error(built.reason);
}

function bots(value: StatusReport): BotStatusRow[] {
  return value.rows.filter((row): row is BotStatusRow => row.kind === 'bot');
}

function bot(value: StatusReport, identity: string, botId: string): BotStatusRow {
  const found = bots(value).find((row) => row.identity === identity && row.botId === botId);
  if (found === undefined) throw new Error(`no row for ${identity} ${botId}`);
  return found;
}

function hashFolder(folder: string): string {
  const hash = createHash('sha256');
  for (const file of filesUnder(folder).sort()) hash.update(file).update(readFileSync(file));
  return hash.digest('hex');
}

/** Run the real CLI's status verb with launchctl intercepted and the account home in a temp folder. */
function cli(world: StatusWorld, checkout: string, args: string[]) {
  const run = spawnSync(process.execPath, ['--require', INTERCEPT, BOTS_CLI, 'status', ...args, '--repo', checkout], {
    cwd: checkout,
    encoding: 'utf8',
    timeout: 60_000,
    env: {
      PATH: process.env.PATH,
      HOME: world.home,
      GIT_CONFIG_NOSYSTEM: '1',
      BOTS_TEST_LAUNCHCTL_LOG: join(tempDir('bots-launchctl-log-'), 'calls.jsonl'),
      BOTS_TEST_ACCOUNT_HOME: world.home,
    },
  });
  return { status: run.status, stdout: run.stdout, stderr: run.stderr };
}

function cliJson(world: StatusWorld, checkout: string, args: string[] = []): StatusReport {
  const run = cli(world, checkout, ['--json', ...args]);
  if (run.status !== 0) throw new Error(`exit ${String(run.status)}: ${run.stderr}`);
  return JSON.parse(run.stdout) as StatusReport;
}

// ───────────────────────────────────────────────────────────────────
// launchctl print
// ───────────────────────────────────────────────────────────────────

describe('reading launchctl print', () => {
  it('reads state, runs and last exit code for a loaded, a never-run and a failed label', () => {
    expect(parseLaunchctlPrint(printOutput('a', { state: 'running', runs: '4', lastExit: '0' }))).toEqual({ state: 'running', runs: 4, lastExitCode: 0 });
    expect(parseLaunchctlPrint(printOutput('b', {}))).toEqual({ state: 'not running', runs: 0, lastExitCode: null });
    expect(parseLaunchctlPrint(printOutput('c', { runs: '1', lastExit: '78: EX_CONFIG' }))).toEqual({ state: 'not running', runs: 1, lastExitCode: 78 });
  });

  it('answers unknown for truncated, reordered or unfamiliar output and never guesses ok or failed', () => {
    const full = printOutput('a', { runs: '2', lastExit: '1' });
    expect(parseLaunchctlPrint(full.split('\n').slice(0, 4).join('\n'))).toEqual({ state: 'unknown', runs: 'unknown', lastExitCode: 'unknown' });
    expect(parseLaunchctlPrint('garbage that is not a service block')).toEqual({ state: 'unknown', runs: 'unknown', lastExitCode: 'unknown' });
    expect(parseLaunchctlPrint(full.replace('last exit code = 1', 'last exit code = something new'))).toMatchObject({ runs: 2, lastExitCode: 'unknown' });
    const reordered = full.replace('\truns = 2\n', '').replace('\ttype = LaunchAgent\n', '\ttype = LaunchAgent\n\truns = 2\n');
    expect(parseLaunchctlPrint(reordered)).toEqual({ state: 'not running', runs: 2, lastExitCode: 1 });
  });

  it('calls only print, through the seam, and reads status 113 as not loaded', () => {
    const world = statusWorld();
    expect(printLabel('com.skilled.bots.acme_2ftool.tick.0', world.seams)).toMatchObject({ presence: 'not-loaded', lastExitCode: null });
    expect(world.calls).toEqual([['print', 'gui/501/com.skilled.bots.acme_2ftool.tick.0']]);
  });
});

// ───────────────────────────────────────────────────────────────────
// Row states
// ───────────────────────────────────────────────────────────────────

describe('row states', () => {
  it('shows never-run, launchd-failed, missing and unreadable, with the row count unchanged', () => {
    const world = statusWorld();
    const never = statusCheckout(world, 'acme/never');
    fakeInstall(world, 'acme/never', 'tick', never);
    const failed = statusCheckout(world, 'acme/failed');
    const failedLabel = fakeInstall(world, 'acme/failed', 'tick', failed);
    world.prints.set(failedLabel, { status: 0, stdout: printOutput(failedLabel, { runs: '1', lastExit: '78: EX_CONFIG' }), stderr: '' });
    const gone = statusCheckout(world, 'acme/gone');
    writeRecord(world.stateRoot, { identity: 'acme/gone', botId: 'manual', runId: 'g1', dispatchedAt: at(1), repositoryPath: gone, skilledTree: world.skilledTree });
    const unreadable = statusCheckout(world, 'acme/locked');
    writeRecord(world.stateRoot, { identity: 'acme/locked', botId: 'manual', runId: 'l1', dispatchedAt: at(2), repositoryPath: unreadable, skilledTree: world.skilledTree });
    rebuild(world);

    const before = report(world);
    expect(bots(before)).toHaveLength(4);
    rmSync(gone, { recursive: true, force: true });
    lock(unreadable);
    const after = report(world);
    expect(bots(after)).toHaveLength(4);
    expect(bot(after, 'acme/never', 'tick')).toMatchObject({ state: 'never-run', installed: true, lastRun: null });
    expect(bot(after, 'acme/failed', 'tick')).toMatchObject({ state: 'launchd-failed', lastRun: null });
    expect(bot(after, 'acme/gone', 'manual')).toMatchObject({ state: 'missing', pathState: 'missing', path: gone, previousPath: null });
    expect(bot(after, 'acme/locked', 'manual')).toMatchObject({ state: 'unreadable', pathState: 'unreadable', previousPath: null });
    // Only print ever reached the stand-in.
    expect(world.calls.every((call) => call[0] === 'print')).toBe(true);
  });

  it('judges a checkout under a locked parent unreadable, never missing', () => {
    const parent = tempDir('bots-parent-');
    const checkout = join(parent, 'repo');
    mkdirSync(checkout);
    expect(checkPath(checkout)).toBe('present');
    lock(parent);
    expect(checkPath(checkout)).toBe('unreadable');
    expect(checkPath(join(tempDir('bots-empty-'), 'never-made'))).toBe('missing');
  });

  it('shows unknown, not ok and not failed, for a label whose print output does not parse', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, 'acme/odd');
    const label = fakeInstall(world, 'acme/odd', 'tick', checkout);
    world.prints.set(label, { status: 0, stdout: 'a format from a future launchctl', stderr: '' });
    rebuild(world);
    expect(bot(report(world), 'acme/odd', 'tick')).toMatchObject({ state: 'unknown' });
  });

  it('relinks a moved checkout by identity and shows the new and the previous path', () => {
    const world = statusWorld();
    const first = statusCheckout(world, 'acme/moved');
    writeRecord(world.stateRoot, { identity: 'acme/moved', botId: 'manual', runId: 'm1', dispatchedAt: at(1), repositoryPath: first, skilledTree: world.skilledTree });
    rebuild(world);
    const moved = `${first}-moved`;
    renameSync(first, moved);
    registerRoot(world.stateRoot, 'acme/moved', moved);
    const row = bot(report(world), 'acme/moved', 'manual');
    expect(row).toMatchObject({ state: 'ok', path: moved, previousPath: first, pathState: 'present' });
  });

  it('flags two present clones of one identity, names both, and moves no row', () => {
    const world = statusWorld();
    const one = statusCheckout(world, 'acme/clones');
    const two = statusCheckout(world, 'acme/clones');
    const vanished = tempDir('bots-vanished-');
    writeRecord(world.stateRoot, { identity: 'acme/clones', botId: 'here', runId: 'c1', dispatchedAt: at(1), repositoryPath: one, skilledTree: world.skilledTree });
    writeRecord(world.stateRoot, { identity: 'acme/clones', botId: 'away', runId: 'c2', dispatchedAt: at(2), repositoryPath: vanished, skilledTree: world.skilledTree });
    rmSync(vanished, { recursive: true });
    rebuild(world);
    const value = report(world);
    expect(value.duplicateRoots).toEqual([{ identity: 'acme/clones', paths: [one, two] }]);
    expect(bot(value, 'acme/clones', 'here')).toMatchObject({ path: one, previousPath: null });
    // A missing path with two candidates stays missing rather than guessing a clone.
    expect(bot(value, 'acme/clones', 'away')).toMatchObject({ state: 'missing', path: vanished, previousPath: null });
    expect(formatStatus(value).join('\n')).toContain(`two checkouts for acme/clones: ${one} and ${two}`);
  });

  it('shows run-folder-gone for a vanished run folder, keeps the row through a rebuild, and never opens a run folder', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, 'acme/tool');
    const lost = writeRecord(world.stateRoot, { identity: 'acme/tool', botId: 'lost', runId: 'x1', dispatchedAt: at(1), repositoryPath: checkout, skilledTree: world.skilledTree });
    writeRecord(world.stateRoot, { identity: 'acme/tool', botId: 'kept', runId: 'x2', dispatchedAt: at(2), repositoryPath: checkout, skilledTree: world.skilledTree });
    rebuild(world);
    rmSync(lost.evidence.runFolder, { recursive: true });
    expect(bot(report(world), 'acme/tool', 'lost')).toMatchObject({ state: 'run-folder-gone', lastRun: { runId: 'x1' } });
    rebuild(world);
    expect(bot(report(world), 'acme/tool', 'lost')).toMatchObject({ state: 'run-folder-gone', lastRun: { runId: 'x1' } });

    // With the runs folder unreadable, every row still prints and none reads as gone.
    lock(join(runRoot(world.skilledTree), identityKey('acme/tool'), 'runs'));
    const value = report(world);
    expect(bots(value).map((row) => row.botId)).toEqual(['kept', 'lost']);
    expect(bot(value, 'acme/tool', 'kept').flags).toEqual(['ok']);
  });
});

// ───────────────────────────────────────────────────────────────────
// Needs-you rows and holds
// ───────────────────────────────────────────────────────────────────

describe('needs-you rows', () => {
  it('shows an open item as needs-you and a past-expiry one as expired, with no question text, leaving every item file unchanged', () => {
    const world = statusWorld();
    statusCheckout(world, 'acme/tool');
    writeStatusItem(world.stateRoot, { identity: 'acme/tool', botId: 'asker', id: 'open1', createdAt: at(1), expiresAt: '2026-12-30T00:00:00.000Z' });
    writeStatusItem(world.stateRoot, { identity: 'acme/tool', botId: 'asker', id: 'done1', createdAt: at(2), expiresAt: '2026-12-30T00:00:00.000Z', answer: 'merge' });
    writeStatusItem(world.stateRoot, { identity: 'acme/tool', botId: 'asker', id: 'late1', createdAt: at(3), expiresAt: '2026-11-21T00:00:00.000Z' });
    const folder = identityStatePaths(world.stateRoot, 'acme/tool').needsYou;
    const before = hashFolder(folder);
    const now = new Date('2026-11-23T12:00:00Z');
    rebuild(world, now);
    const value = report(world, { now });
    const items = value.rows.filter((row): row is ItemStatusRow => row.kind === 'needs-you');
    expect(items.map((row) => [row.itemId, row.state])).toEqual([['open1', 'needs-you'], ['late1', 'expired']]);
    expect(items[0]).toMatchObject({ botId: 'asker', runId: 'open1' });
    expect(JSON.stringify(value)).not.toContain('SECRET-QUESTION-TEXT');
    expect(formatStatus(value).join('\n')).not.toContain('SECRET-QUESTION-TEXT');
    expect(hashFolder(folder)).toBe(before);
  });

  it('shows held with the item id while an item is open, and clears it once the item is answered', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, 'acme/tool');
    writeRecord(world.stateRoot, {
      identity: 'acme/tool',
      botId: 'alpha',
      runId: 'h1',
      dispatchedAt: at(1),
      repositoryPath: checkout,
      skilledTree: world.skilledTree,
      exit: { reason: 'awaiting-decision', class: 'operator', needsYouItemId: 'h1' },
    });
    writeRecord(world.stateRoot, { identity: 'acme/tool', botId: 'beta', runId: 'h2', dispatchedAt: at(2), repositoryPath: checkout, skilledTree: world.skilledTree });
    const item = writeStatusItem(world.stateRoot, { identity: 'acme/tool', botId: 'alpha', id: 'h1', createdAt: at(1), expiresAt: '2026-12-30T00:00:00.000Z' });
    const now = new Date('2026-11-23T12:00:00Z');
    rebuild(world, now);
    const held = report(world, { now });
    expect(bot(held, 'acme/tool', 'alpha')).toMatchObject({ state: 'held', heldBy: 'h1' });
    expect(bot(held, 'acme/tool', 'beta')).toMatchObject({ state: 'ok', heldBy: null });

    // Answered the way bots answer does it: the item file changes and the generation stamp moves. No rebuild.
    writeFileSync(needsYouFile(world.stateRoot, 'acme/tool', 'h1'), JSON.stringify({ ...item, answer: { text: 'merge', answeredAt: now.toISOString() }, resumeRequestId: 'req-h1' }));
    writeGenerationStamp(world.stateRoot, 'acme/tool', now);
    const cleared = report(world, { now });
    expect(bot(cleared, 'acme/tool', 'alpha').flags).not.toContain('held');
    expect(bot(cleared, 'acme/tool', 'alpha').heldBy).toBeNull();
    expect(bot(cleared, 'acme/tool', 'beta').flags).not.toContain('held');
    // The runs were not re-read, so the index still says it is stale.
    expect(cleared.staleIdentities).toEqual(['acme/tool']);
  });
});

// ───────────────────────────────────────────────────────────────────
// Reinstall flag
// ───────────────────────────────────────────────────────────────────

describe('the reinstall flag', () => {
  it('flags a deleted runner and a retargeted link, not an untouched install, and changes no job file', () => {
    const world = statusWorld();
    const deleted = statusCheckout(world, 'acme/deleted');
    fakeInstall(world, 'acme/deleted', 'tick', deleted);
    const linked = linkedCheckout(world, 'acme/linked');
    fakeInstall(world, 'acme/linked', 'tick', linked.checkout);
    const untouched = statusCheckout(world, 'acme/untouched');
    fakeInstall(world, 'acme/untouched', 'tick', untouched);
    rebuild(world);
    expect(bots(report(world)).map((row) => row.state)).toEqual(['never-run', 'never-run', 'never-run']);

    const jobsBefore = hashFolder(world.agentsDir);
    unlinkSync(join(deleted, '.skilled', 'bin', 'bots.cjs'));
    unlinkSync(join(linked.checkout, '.skilled'));
    symlinkSync(join(skilledTreeWithRunner(), '.skilled'), join(linked.checkout, '.skilled'));
    const value = report(world);
    expect(bot(value, 'acme/deleted', 'tick')).toMatchObject({ state: 'needs-reinstall', fix: 'bots schedule install tick' });
    expect(bot(value, 'acme/deleted', 'tick').reinstall).toContain('runner-missing');
    expect(bot(value, 'acme/linked', 'tick')).toMatchObject({ state: 'needs-reinstall', reinstall: ['runner-retargeted'] });
    expect(bot(value, 'acme/untouched', 'tick')).toMatchObject({ state: 'never-run', reinstall: [], fix: null });
    expect(hashFolder(world.agentsDir)).toBe(jobsBefore);
  });
});

// ───────────────────────────────────────────────────────────────────
// Unregister
// ───────────────────────────────────────────────────────────────────

describe('unregister', () => {
  it('hides an identity and deletes nothing; --all still shows it as retired', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, 'acme/tool');
    writeRecord(world.stateRoot, { identity: 'acme/tool', botId: 'nightly', runId: 'u1', dispatchedAt: at(1), repositoryPath: checkout, skilledTree: world.skilledTree });
    rebuild(world);
    expect(bots(report(world))).toHaveLength(1);
    const filesBefore = filesUnder(world.stateRoot).sort();
    expect(unregisterIdentity({ stateRoot: world.stateRoot, identity: 'acme/tool' })).toEqual({ ok: true, value: { identity: 'acme/tool', createdFile: false } });
    expect(report(world).rows).toEqual([]);
    expect(bot(report(world, { includeRetired: true }), 'acme/tool', 'nightly')).toMatchObject({ state: 'retired' });
    expect(filesUnder(world.stateRoot).sort()).toEqual(filesBefore);
    // The retirement lives in the registered-roots file, so deleting the index and rebuilding keeps it.
    rmSync(statusIndexFile(world.stateRoot));
    rebuild(world);
    expect(report(world).rows).toEqual([]);
    expect(filesUnder(world.stateRoot).sort()).toEqual(filesBefore);
    expect(unregisterIdentity({ stateRoot: world.stateRoot, identity: 'not an identity' })).toMatchObject({ ok: false, reason: 'identity-invalid' });
  });
});

// ───────────────────────────────────────────────────────────────────
// The CLI verb
// ───────────────────────────────────────────────────────────────────

describe('bots status', () => {
  it('prints no rows and a builtAt over an empty state root, and exits 0', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, 'acme/tool');
    const value = cliJson(world, checkout);
    expect(value.rows).toEqual([]);
    expect(typeof value.builtAt).toBe('string');
    expect(value.indexPath).toBe(statusIndexFile(world.stateRoot));
  });

  it('prints the same rows before deleting the index and after --rebuild, then says stale with builtAt', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, 'acme/tool');
    for (const n of [1, 2, 3]) {
      writeRecord(world.stateRoot, { identity: 'acme/tool', botId: `bot${n}`, runId: `p${n}`, dispatchedAt: at(n), repositoryPath: checkout, skilledTree: world.skilledTree });
    }
    writeGenerationStamp(world.stateRoot, 'acme/tool');
    const before = cliJson(world, checkout);
    expect(bots(before)).toHaveLength(3);
    rmSync(statusIndexFile(world.stateRoot));
    const after = cliJson(world, checkout, ['--rebuild']);
    const { builtAt: _before, ...beforeRest } = before;
    const { builtAt: _after, ...afterRest } = after;
    expect(afterRest).toEqual(beforeRest);

    writeGenerationStamp(world.stateRoot, 'acme/tool');
    const text = cli(world, checkout, []);
    expect(text.status).toBe(0);
    expect(text.stdout).toContain('stale');
    expect(text.stdout).toContain(after.builtAt ?? 'missing builtAt');
  });

  it('shows run-folder-gone, needs-you, needs-reinstall and held from one state root, and exits 0', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, 'acme/tool');
    const lost = writeRecord(world.stateRoot, { identity: 'acme/tool', botId: 'lost', runId: 's1', dispatchedAt: at(1), repositoryPath: checkout, skilledTree: world.skilledTree });
    writeRecord(world.stateRoot, {
      identity: 'acme/tool',
      botId: 'asker',
      runId: 's2',
      dispatchedAt: at(2),
      repositoryPath: checkout,
      skilledTree: world.skilledTree,
      exit: { reason: 'awaiting-decision', class: 'operator', needsYouItemId: 's2' },
    });
    writeStatusItem(world.stateRoot, { identity: 'acme/tool', botId: 'asker', id: 's2', createdAt: at(2), expiresAt: '2099-01-01T00:00:00.000Z' });
    const linked = linkedCheckout(world, 'acme/linked');
    fakeInstall(world, 'acme/linked', 'tick', linked.checkout);
    rmSync(lost.evidence.runFolder, { recursive: true });
    unlinkSync(join(linked.checkout, '.skilled'));
    symlinkSync(join(skilledTreeWithRunner(), '.skilled'), join(linked.checkout, '.skilled'));
    const jobsBefore = hashFolder(world.agentsDir);

    const run = cli(world, checkout, ['--json']);
    expect(run.status).toBe(0);
    const value = JSON.parse(run.stdout) as StatusReport;
    expect(bot(value, 'acme/tool', 'lost').state).toBe('run-folder-gone');
    expect(bot(value, 'acme/tool', 'asker')).toMatchObject({ state: 'held', heldBy: 's2' });
    expect(bot(value, 'acme/linked', 'tick')).toMatchObject({ state: 'needs-reinstall', fix: 'bots schedule install tick' });
    expect(value.rows.find((row) => row.kind === 'needs-you')).toMatchObject({ state: 'needs-you', itemId: 's2' });
    expect(hashFolder(world.agentsDir)).toBe(jobsBefore);
  });

  it('unregisters with the state-root file count unchanged and hides the rows', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, 'acme/tool');
    writeRecord(world.stateRoot, { identity: 'acme/tool', botId: 'nightly', runId: 'q1', dispatchedAt: at(1), repositoryPath: checkout, skilledTree: world.skilledTree });
    const porcelain = (repo: string) => spawnSync('git', ['-C', repo, 'status', '--porcelain'], { encoding: 'utf8' }).stdout;
    const checkoutStatus = porcelain(checkout);
    const treeStatus = porcelain(world.skilledTree);
    expect(bots(cliJson(world, checkout))).toHaveLength(1);
    cliJson(world, checkout, ['--rebuild']);
    // Status and retention write nothing into a checkout, and run folders stay ignored in the Skilled tree.
    expect(porcelain(checkout)).toBe(checkoutStatus);
    expect(porcelain(world.skilledTree)).toBe(treeStatus);
    const count = () => spawnSync('sh', ['-c', `find "${world.stateRoot}" -type f | wc -l`], { encoding: 'utf8' }).stdout.trim();
    const before = count();
    const run = cli(world, checkout, ['--unregister', 'acme/tool']);
    expect(run.status).toBe(0);
    expect(run.stdout).toContain('nothing was deleted');
    expect(count()).toBe(before);
    expect(cliJson(world, checkout).rows).toEqual([]);
    expect(bots(cliJson(world, checkout, ['--all']))).toHaveLength(1);
  });

  it('keeps an identity hidden after unregister, a deleted index and --rebuild, with the file count unchanged', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, 'acme/tool');
    writeRecord(world.stateRoot, { identity: 'acme/tool', botId: 'nightly', runId: 'k1', dispatchedAt: at(1), repositoryPath: checkout, skilledTree: world.skilledTree });
    expect(bots(cliJson(world, checkout))).toHaveLength(1);
    const count = () => spawnSync('sh', ['-c', `find "${world.stateRoot}" -type f | wc -l`], { encoding: 'utf8' }).stdout.trim();
    const before = count();
    expect(cli(world, checkout, ['--unregister', 'acme/tool']).status).toBe(0);
    rmSync(statusIndexFile(world.stateRoot));
    expect(cliJson(world, checkout, ['--rebuild']).rows).toEqual([]);
    expect(count()).toBe(before);
  });

  it('unregisters over a missing index without building it, so no retention deletes anything', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, 'acme/tool', { retention: { runFoldersPerBot: 1, indexRowsPerIdentity: 1 } });
    for (const n of [1, 2, 3]) {
      writeRecord(world.stateRoot, { identity: 'acme/tool', botId: 'nightly', runId: `n${n}`, dispatchedAt: at(n), repositoryPath: checkout, skilledTree: world.skilledTree });
    }
    const runsFolder = join(runRoot(world.skilledTree), identityKey('acme/tool'), 'runs');
    const stateFiles = filesUnder(world.stateRoot).sort();
    const runFolders = readdirSync(runsFolder).sort();
    const run = cli(world, checkout, ['--unregister', 'acme/tool']);
    expect(run.status).toBe(0);
    expect(run.stdout).toContain('nothing was deleted');
    expect(readdirSync(runsFolder).sort()).toEqual(runFolders);
    expect(filesUnder(world.stateRoot).sort()).toEqual(stateFiles);
  });

  it('exits non-zero on a damaged index, naming the file and --rebuild, and recovers after --rebuild', () => {
    const world = statusWorld();
    const checkout = statusCheckout(world, 'acme/tool');
    writeRecord(world.stateRoot, { identity: 'acme/tool', botId: 'nightly', runId: 'z1', dispatchedAt: at(1), repositoryPath: checkout, skilledTree: world.skilledTree });
    cliJson(world, checkout);
    writeFileSync(statusIndexFile(world.stateRoot), 'not a database at all, just text');
    const broken = cli(world, checkout, []);
    expect(broken.status).not.toBe(0);
    expect(broken.stderr).toContain(statusIndexFile(world.stateRoot));
    expect(broken.stderr).toContain('--rebuild');
    expect(bots(cliJson(world, checkout, ['--rebuild']))).toHaveLength(1);
    expect(readdirSync(join(world.stateRoot, 'index'))).toEqual(['status.sqlite']);
  });
});
