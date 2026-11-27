// ───────────────────────────────────────────────────────────────────
// MODULE: Bots Status
// ───────────────────────────────────────────────────────────────────
//
// Run records alone miss a bot that is installed and never ran, and launchd
// alone says nothing about what ran or whether it was delivered. Status joins
// the two: rows from the status index, the install records and checks the
// installer already owns, and `launchctl print` for each installed label. It
// never opens a run folder; it only asks whether a run folder's path still
// exists, so a folder lost to a re-pin shows as gone instead of crashing.
//
// A checkout path is judged three ways: present, missing, or unreadable. An
// unreadable path judges nothing, so it is never reported as missing and is
// never relinked. A missing path is relinked only when exactly one other
// registered checkout of the same identity is present, so the history of one
// clone is never moved onto another. Status writes nothing but the index. A
// read brings a stale identity's run rows and item rows up to date and
// applies no retention, so only a build of the index (the first call and
// --rebuild) applies it, which deletes run folders and closed needs-you item
// files past their bounds. The one other write is --unregister, which records
// the retired identity in the registered-roots file.

import { accessSync, constants, existsSync, lstatSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { processAlive } from '../../../system-deep-loop/runtime/lib/deep-loop/loop-lock.js';
import { buildActivity } from './activity.js';
import { translateCron } from './cron-translator.js';
import { identityGuard, identityKey } from './identity.js';
import { checkInstalls, checkInstallsFor, defaultSeams, DRAIN_ID, jobCheckout, jobEnv, readInstallRecord } from './installer.js';
import { printLabel, UNKNOWN } from './launchctl-print.js';
import { parseLabel } from './label.js';
import { DEFAULT_RETENTION, IDENTITY_PATTERN } from './repo-config.js';
import { validateRequest } from './request-record.js';
import { describeStart } from './routine.js';
import { listSlots } from './slot-lister.js';
import { identityStatePaths, isSafeSegment, readRegisteredRoots, readRetiredIdentities, recordFile, retireIdentityRoots } from './state-root.js';
import { readSwitch } from './switches.js';
import {
  identityKeys,
  indexRunRecord,
  openIndex,
  readGeneration,
  readIndex,
  readRecords,
  rebuildIndex,
  recordGeneration,
  recordUpdatedAt,
  refreshItemRows,
  retentionFor,
  retireIdentity,
} from './status-index.js';

import type { ActivityPayload, DescribeStart, LiveRun, QueuedRequest as ActivityQueuedRequest, ScheduleFire } from './activity.js';
import type { InstallCheck, InstallerSeams, InstallRecord } from './installer.js';
import type { LaunchdPrint } from './launchctl-print.js';
import type { Result } from './repo-config.js';
import type { LeaseSideFile } from './runner.js';
import type { BuildReport, IndexOptions, IndexSnapshot, RunRow, RunSummary, StatusIndex } from './status-index.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────────

/** Every state a row can show. A bot row shows the first that applies, in this order, and lists all of them in `flags`. */
export const BOT_ROW_STATES = [
  'retired',
  'missing',
  'unreadable',
  'needs-reinstall',
  'held',
  'completed',
  'launchd-failed',
  'run-folder-gone',
  'unknown',
  'never-run',
  'ok',
] as const;

export type BotRowState = (typeof BOT_ROW_STATES)[number];

export type PathState = 'present' | 'missing' | 'unreadable';

export interface LastRun {
  runId: string;
  dispatchedAt: string;
  exitReason: string;
  exitClass: string | null;
  needsYouItemId: string | null;
  delivery: Array<{ channel: string; state: string }>;
}

export interface BotStatusRow {
  kind: 'bot';
  identity: string;
  botId: string;
  state: BotRowState;
  flags: BotRowState[];
  path: string | null;
  pathState: PathState | null;
  /** The last known path a relinked row moved from. */
  previousPath: string | null;
  installed: boolean;
  labels: string[];
  launchd: LaunchdPrint[];
  /** Why the schedule needs a reinstall, from the installer's check. */
  reinstall: string[];
  /** The command that repairs a stale schedule. Status never runs it. */
  fix: string | null;
  /** The open needs-you item that holds the bot. */
  heldBy: string | null;
  lastRun: LastRun | null;
}

export interface ItemStatusRow {
  kind: 'needs-you';
  identity: string;
  itemId: string;
  botId: string;
  runId: string;
  state: 'needs-you' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export type StatusRow = BotStatusRow | ItemStatusRow;

export interface StatusReport {
  /** The payload version, so a reader can refuse a shape it does not know. */
  version: 1;
  indexPath: string;
  builtAt: string | null;
  /** When the index was last brought up to date: its build, or the last refresh that indexed new rows. */
  updatedAt: string | null;
  stale: boolean;
  /** Identities whose generation stamp is newer than the one the index consumed. */
  staleIdentities: string[];
  rows: StatusRow[];
  /** Identities with two present registered checkouts; no row moves between them. */
  duplicateRoots: Array<{ identity: string; paths: string[] }>;
  /** Install checks that could not run, and why. */
  notes: string[];
}

export interface StatusInput extends IndexOptions {
  stateRoot: string;
  /** The caller's environment, passed to the installer's own resolution. */
  env?: NodeJS.ProcessEnv;
  seams?: Partial<InstallerSeams>;
  /** Show retired identities too. */
  includeRetired?: boolean;
}

export interface ActivityInput extends StatusInput {
  /** Phrases a schedule's start. Absent means the routine layer's describeStart. */
  describe?: DescribeStart;
}

// ───────────────────────────────────────────────────────────────────
// 2. PATH CHECKS
// ───────────────────────────────────────────────────────────────────

/** Judge a checkout path. Only a path that is not there is missing; any other failure is unreadable. */
export function checkPath(path: string): PathState {
  try {
    statSync(path);
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException | null)?.code;
    return code === 'ENOENT' || code === 'ENOTDIR' ? 'missing' : 'unreadable';
  }
  try {
    accessSync(path, constants.R_OK | constants.X_OK);
  } catch {
    return 'unreadable';
  }
  return 'present';
}

/** Whether a run folder is gone. A folder that cannot be checked is not gone. It never reads inside the folder. */
function runFolderGone(path: string): boolean {
  try {
    lstatSync(path);
    return false;
  } catch (error: unknown) {
    const code = (error as NodeJS.ErrnoException | null)?.code;
    return code === 'ENOENT' || code === 'ENOTDIR';
  }
}

/** The present registered checkouts of an identity, other than one path, that still resolve to that identity. */
function relinkCandidates(input: StatusInput, key: string, roots: string[], from: string): string[] {
  return roots.filter((root) => {
    if (root === from || checkPath(root) !== 'present') return false;
    const resolved = identityGuard(root, jobEnv({ checkoutRoot: root, env: input.env, seams: input.seams }));
    return resolved.ok && identityKey(resolved.value.identity) === key;
  });
}

// ───────────────────────────────────────────────────────────────────
// 3. INSTALLED STATE
// ───────────────────────────────────────────────────────────────────

interface Installed {
  checks: InstallCheck[];
  records: Map<string, InstallRecord>;
}

function installedFor(input: StatusInput, identity: string, agentsDir: string, notes: string[]): Installed {
  const records = new Map<string, InstallRecord>();
  const folder = identityStatePaths(input.stateRoot, identity).installs;
  let names: string[] = [];
  try {
    names = readdirSync(folder).filter((name) => name.endsWith('.json')).sort();
  } catch {
    names = [];
  }
  for (const name of names) {
    const record = readInstallRecord(input.stateRoot, identity, name.slice(0, -'.json'.length));
    if (record !== null) records.set(record.botId, record);
  }
  const checks = checkInstalls({ stateRoot: input.stateRoot, identity, agentsDir });
  // What only a present checkout can show: a job whose label or state root drifted from what resolves there now.
  const checkouts = new Set([...records.values()].map((record) => record.checkoutRoot).filter((path) => checkPath(path) === 'present'));
  for (const checkoutRoot of checkouts) {
    const drift = checkInstallsFor({ checkoutRoot, env: input.env, seams: input.seams });
    if (!drift.ok) {
      notes.push(`install check for ${checkoutRoot}: ${drift.reason}`);
      continue;
    }
    for (const row of drift.value) {
      const extra = row.reasons.filter((reason) => reason === 'identity-changed' || reason === 'state-root-changed');
      if (extra.length === 0) continue;
      const target = checks.find((check) => check.labels.some((label) => row.labels.includes(label)));
      if (target === undefined) {
        checks.push({ ...row, reasons: extra });
        continue;
      }
      target.status = 'needs-reinstall';
      for (const reason of extra) if (!target.reasons.includes(reason)) target.reasons.push(reason);
    }
  }
  return { checks, records };
}

// ───────────────────────────────────────────────────────────────────
// 4. ROWS
// ───────────────────────────────────────────────────────────────────

function isBotLabel(label: string): boolean {
  const parsed = parseLabel(label);
  return parsed.ok && parsed.value.kind === 'bot';
}

function lastRunOf(runs: RunRow[], snapshot: IndexSnapshot): LastRun | null {
  const last = runs[runs.length - 1];
  if (last === undefined) return null;
  const summary = JSON.parse(last.summary) as RunSummary;
  return {
    runId: last.runId,
    dispatchedAt: last.dispatchedAt,
    exitReason: summary.exitReason,
    exitClass: summary.exitClass,
    needsYouItemId: summary.needsYouItemId,
    delivery: snapshot.deliveries
      .filter((entry) => entry.identityKey === last.identityKey && entry.runId === last.runId)
      .map((entry) => ({ channel: entry.channel, state: entry.state })),
  };
}

function botRow(
  input: StatusInput,
  context: { key: string; identity: string; retired: boolean; roots: string[]; snapshot: IndexSnapshot; installed: Installed; now: Date },
  botId: string,
): BotStatusRow {
  const { key, snapshot, installed, now } = context;
  const runs = snapshot.runs.filter((run) => run.identityKey === key && run.botId === botId);
  const lastRow = runs[runs.length - 1];
  const lastRun = lastRunOf(runs, snapshot);
  const check = installed.checks.find((candidate) => candidate.botId === botId);
  const record = installed.records.get(botId);
  const labels = check?.labels ?? record?.labels ?? [];
  const isInstalled = labels.length > 0;

  // An installed job's checkout is the one its job file runs against.
  const jobPath = labels.map((label) => jobCheckout(label, input.seams)).find((path): path is string => path !== null) ?? null;
  let path = isInstalled ? jobPath ?? record?.checkoutRoot ?? lastRow?.repositoryPath ?? null : lastRow?.repositoryPath ?? null;
  let previousPath: string | null = null;
  let pathState = path === null ? null : checkPath(path);
  if (path !== null && pathState === 'missing') {
    const candidates = relinkCandidates(input, key, context.roots, path);
    if (candidates.length === 1 && candidates[0] !== undefined) {
      previousPath = path;
      path = candidates[0];
      pathState = 'present';
    }
  }

  // The drain job is the repository's queue agent, never a bot row.
  const launchd = labels.filter(isBotLabel).map((label) => printLabel(label, input.seams));
  const openItem = snapshot.items.find(
    (item) => item.identityKey === key && item.botId === botId && item.answeredAt === null && now.getTime() < Date.parse(item.expiresAt),
  );

  const flags: BotRowState[] = [];
  if (context.retired) flags.push('retired');
  if (pathState === 'missing') flags.push('missing');
  if (pathState === 'unreadable') flags.push('unreadable');
  if (check?.status === 'needs-reinstall') flags.push('needs-reinstall');
  if (openItem !== undefined) flags.push('held');
  // The completed switch is set when a routine's until check exits 0, so the row reads from the switch itself.
  if (isSafeSegment(botId) && readSwitch(input.stateRoot, context.identity, botId, 'completed') !== null) flags.push('completed');
  if (lastRow === undefined && isInstalled) {
    const failed = launchd.some((entry) => entry.presence === 'loaded' && typeof entry.lastExitCode === 'number' && entry.lastExitCode !== 0);
    const unreadable = launchd.some((entry) => entry.presence === UNKNOWN || entry.lastExitCode === UNKNOWN);
    flags.push(failed ? 'launchd-failed' : unreadable ? 'unknown' : 'never-run');
  }
  if (lastRow !== undefined && runFolderGone(lastRow.runFolder)) flags.push('run-folder-gone');
  const state = BOT_ROW_STATES.find((candidate) => flags.includes(candidate)) ?? 'ok';

  return {
    kind: 'bot',
    identity: context.identity,
    botId,
    state,
    flags: flags.length === 0 ? ['ok'] : BOT_ROW_STATES.filter((candidate) => flags.includes(candidate)),
    path,
    pathState,
    previousPath,
    installed: isInstalled,
    labels,
    launchd,
    reinstall: check?.status === 'needs-reinstall' ? [...check.reasons] : [],
    fix: check?.status === 'needs-reinstall' ? `bots schedule install ${botId}` : null,
    heldBy: openItem?.itemId ?? null,
    lastRun,
  };
}

function itemRows(snapshot: IndexSnapshot, key: string, identity: string, now: Date): ItemStatusRow[] {
  return snapshot.items
    .filter((item) => item.identityKey === key && item.answeredAt === null)
    .map((item) => ({
      kind: 'needs-you' as const,
      identity,
      itemId: item.itemId,
      botId: item.botId,
      runId: item.runId,
      state: now.getTime() >= Date.parse(item.expiresAt) ? ('expired' as const) : ('needs-you' as const),
      createdAt: item.createdAt,
      expiresAt: item.expiresAt,
    }));
}

// ───────────────────────────────────────────────────────────────────
// 5. REPORT
// ───────────────────────────────────────────────────────────────────

/** The hint every index failure carries, so the operator knows the one safe repair. */
export const REBUILD_HINT = 'run bots status --rebuild';

/** Identity keys whose generation stamp is newer than the one the index consumed. */
function staleKeys(stateRoot: string, snapshot: IndexSnapshot): string[] {
  return identityKeys(stateRoot).filter((key) => {
    const generation = readGeneration(stateRoot, key);
    const consumed = snapshot.generations[key];
    return generation !== null && (consumed === undefined || generation > consumed);
  });
}

/**
 * Bring the index up to date for every identity whose generation stamp is
 * ahead of the one the index consumed. For each such key it reads the stamp
 * and skips the key when there is none, lists the identity's run records,
 * resolves the retention bound the run summary needs, then in one transaction
 * indexes every record, replaces the item rows, records the stamp and records
 * the time. A transaction that throws leaves that identity stale and the next
 * key is still tried. No retention is applied and the index is never rebuilt.
 *
 * @returns Whether at least one key's transaction committed.
 */
function refreshStale(index: StatusIndex, stateRoot: string, snapshot: IndexSnapshot, now: Date): boolean {
  let refreshed = false;
  for (const key of staleKeys(stateRoot, snapshot)) {
    const generation = readGeneration(stateRoot, key);
    if (generation === null) continue;
    const { records } = readRecords(stateRoot, key);
    const retention = retentionFor(stateRoot, key, records.map((record) => record.identity.repositoryPath));
    const slots = retention?.skippedSlotsPerSummary ?? DEFAULT_RETENTION.skippedSlotsPerSummary;
    try {
      index.db.transaction(() => {
        // Every record, not only the new ones: a delivery rewrite changes the rows of a run already indexed.
        for (const record of records) indexRunRecord(index, record, { skippedSlotsPerSummary: slots });
        if (!refreshItemRows(index, stateRoot, key, now)) throw new Error(`item folder for ${key} could not be listed`);
        recordGeneration(index, key, generation);
        recordUpdatedAt(index, now.toISOString());
      })();
      refreshed = true;
    } catch {
      // A busy index past its timeout leaves this identity stale, and the next key is still tried.
    }
  }
  return refreshed;
}

/**
 * Read the index. For an identity whose stamp moved, its run rows and its
 * needs-you item rows are both brought up to date from the files, so a run
 * that ended after the build shows at once and an answer clears a hold. No
 * retention is applied here and the index is never rebuilt.
 */
function readSnapshot(input: StatusInput, now: Date): Result<{ path: string; snapshot: IndexSnapshot }> {
  const opened = openIndex(input.stateRoot, input);
  if (!opened.ok) return opened;
  try {
    let snapshot = readIndex(opened.value);
    const refreshed = refreshStale(opened.value, input.stateRoot, snapshot, now);
    if (refreshed) snapshot = readIndex(opened.value);
    return { ok: true, value: { path: opened.value.path, snapshot } };
  } catch (error: unknown) {
    return { ok: false, reason: 'index-unreadable', detail: `${opened.value.path}: ${error instanceof Error ? error.message : String(error)}` };
  } finally {
    opened.value.close();
  }
}

/** The rebuild hint appended to a refusal's detail, so the one safe repair is named once. */
function hinted(detail: string | undefined): string {
  return `${detail ?? ''}${detail ? '; ' : ''}${REBUILD_HINT}`;
}

/** Name the file and the repair on every index refusal. */
function withHint<T>(result: Result<T>): Result<T> {
  if (result.ok) return result;
  return { ok: false, reason: result.reason, detail: hinted(result.detail) };
}

/**
 * Open the index and read it, building it once when it does not exist yet. An
 * existing index is never rebuilt here, so a read applies no retention. Both
 * reports open the index through this one path, so neither can drift from the
 * other about when a build happens or what a refusal says.
 *
 * @returns The index path and its snapshot, or the refusal naming the rebuild.
 */
function openSnapshot(input: StatusInput, now: Date): Result<{ path: string; snapshot: IndexSnapshot }> {
  let read = readSnapshot(input, now);
  if (!read.ok && read.reason === 'index-missing') {
    const built = rebuildIndex(input.stateRoot, input);
    if (!built.ok) return { ok: false, reason: built.reason, detail: hinted(built.detail) };
    read = readSnapshot(input, now);
  }
  return read.ok ? read : withHint(read);
}

/** Every identity key the index knows, plus every key the state root holds, sorted. */
function snapshotKeys(stateRoot: string, snapshot: IndexSnapshot): string[] {
  return [...new Set([...identityKeys(stateRoot), ...snapshot.runs.map((run) => run.identityKey), ...snapshot.items.map((item) => item.identityKey)])].sort();
}

/** The identity a key names, taken from the index when it holds a row and from the key itself otherwise. */
function identityForKey(snapshot: IndexSnapshot, key: string): string {
  const fromIndex = snapshot.runs.find((run) => run.identityKey === key)?.identity ?? snapshot.items.find((item) => item.identityKey === key)?.identity;
  return fromIndex ?? decodeURIComponent(key);
}

/**
 * Build the status report. The index is built once when it does not exist
 * yet. An existing index is never rebuilt by a read. Instead a stale
 * identity's run rows and item rows are both brought up to date from its
 * files, with no retention applied, so a run that ended after the build shows
 * and an answer clears a hold. Only a build applies retention.
 *
 * @returns The report, or `index-unreadable`, `index-binding-failed` or `index-build-failed`, each naming the rebuild.
 */
export function statusReport(input: StatusInput): Result<StatusReport> {
  const now = input.now ?? new Date();
  const read = openSnapshot(input, now);
  if (!read.ok) return read;
  const { path, snapshot } = read.value;
  const agentsDir = input.seams?.agentsDir ?? defaultSeams().agentsDir;
  const notes: string[] = [];
  let registered: Record<string, string[]> = {};
  try {
    registered = readRegisteredRoots(input.stateRoot);
  } catch (error: unknown) {
    notes.push(`registered roots did not read: ${error instanceof Error ? error.message : String(error)}`);
  }

  const keys = snapshotKeys(input.stateRoot, snapshot);
  const rows: StatusRow[] = [];
  const duplicateRoots: StatusReport['duplicateRoots'] = [];
  const staleIdentities: string[] = [];

  for (const key of keys) {
    const identity = identityForKey(snapshot, key);
    if (!IDENTITY_PATTERN.test(identity)) continue;
    const generation = readGeneration(input.stateRoot, key);
    if (generation !== null && (snapshot.generations[key] === undefined || generation > (snapshot.generations[key] ?? 0))) staleIdentities.push(identity);

    const retired = snapshot.retired.some((row) => row.identityKey === key);
    if (retired && input.includeRetired !== true) continue;
    const roots = registered[key] ?? [];
    const present = roots.filter((root) => checkPath(root) === 'present');
    if (present.length > 1) duplicateRoots.push({ identity, paths: present });

    const installed = installedFor(input, identity, agentsDir, notes);
    const botIds = new Set<string>(snapshot.runs.filter((run) => run.identityKey === key).map((run) => run.botId));
    for (const check of installed.checks) if (check.botId !== DRAIN_ID) botIds.add(check.botId);
    const context = { key, identity, retired, roots, snapshot, installed, now };
    for (const botId of [...botIds].sort()) rows.push(botRow(input, context, botId));
    rows.push(...itemRows(snapshot, key, identity, now));
  }

  return {
    ok: true,
    value: {
      version: 1,
      indexPath: path,
      builtAt: snapshot.builtAt,
      updatedAt: snapshot.updatedAt,
      stale: staleIdentities.length > 0,
      staleIdentities,
      rows,
      duplicateRoots,
      notes,
    },
  };
}

/** The translator's output, named through the lister's own signature so no second import is needed. */
type Translation = Parameters<typeof listSlots>[0];

/** The windows a calendar schedule is searched in, shortest first, so a daily schedule is found without walking years. */
const CALENDAR_WINDOWS_DAYS = [1, 32, 366, 1462];

/** The summary a run row carries, or null when its JSON does not parse. */
function runSummaryOf(row: RunRow): RunSummary | null {
  try {
    return JSON.parse(row.summary) as RunSummary;
  } catch {
    return null;
  }
}

/**
 * The live runs of one identity: a lease side file whose owner is still alive
 * and whose run has no record yet. A side file that does not parse, names no
 * whole-number owner, names no seed, has no lease file beside it or belongs to
 * a run already recorded is skipped with no message, so a half-written or
 * abandoned file never draws a row. A folder that cannot be listed gives none.
 */
function liveRunsFor(input: ActivityInput, identity: string): LiveRun[] {
  const folder = identityStatePaths(input.stateRoot, identity).leases;
  let names: string[];
  try {
    names = readdirSync(folder).filter((name) => name.endsWith('.lock.run.json')).sort();
  } catch {
    return [];
  }
  const live: LiveRun[] = [];
  for (const name of names) {
    const sidePath = join(folder, name);
    let side: LeaseSideFile;
    try {
      side = JSON.parse(readFileSync(sidePath, 'utf8')) as LeaseSideFile;
    } catch {
      continue;
    }
    if (!Number.isSafeInteger(side.ownerPid)) continue;
    const seed: Partial<LeaseSideFile['seed']> | undefined = side.seed;
    if (seed === undefined) continue;
    if (typeof seed.identity !== 'string' || typeof seed.botId !== 'string' || typeof seed.runId !== 'string' || typeof seed.dispatchedAt !== 'string') continue;
    if (!existsSync(sidePath.slice(0, -'.run.json'.length))) continue;
    if (!processAlive(side.ownerPid)) continue;
    let recorded: boolean;
    try {
      recorded = existsSync(recordFile(input.stateRoot, seed.identity, seed.runId));
    } catch {
      // A run id that cannot name a record file names no live run either.
      continue;
    }
    if (recorded) continue;
    live.push({
      identity: seed.identity,
      botId: seed.botId,
      runId: seed.runId,
      dispatchedAt: seed.dispatchedAt,
      actor: typeof seed.actor === 'string' ? seed.actor : null,
    });
  }
  return live;
}

/**
 * The queued requests of one identity: every inbox file that validates as a
 * request record. A file that does not parse or does not validate is skipped
 * with no message, so a half-written request never draws a row. A folder that
 * cannot be listed gives none.
 */
function queuedRequestsFor(input: ActivityInput, identity: string): ActivityQueuedRequest[] {
  const folder = identityStatePaths(input.stateRoot, identity).requests.inbox;
  let names: string[];
  try {
    names = readdirSync(folder).filter((name) => name.endsWith('.json')).sort();
  } catch {
    return [];
  }
  const queued: ActivityQueuedRequest[] = [];
  for (const name of names) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(join(folder, name), 'utf8'));
    } catch {
      continue;
    }
    const request = validateRequest(parsed);
    if (!request.ok) continue;
    queued.push({ identity: request.value.target.identity, botId: request.value.workflowId, enqueuedAt: request.value.enqueuedAt });
  }
  return queued;
}

/**
 * The first calendar slot after now, searched in widening windows so a
 * schedule that fires once a year is still found without walking every day. A
 * window the lister refuses is skipped and the next one is tried.
 */
function nextCalendarFire(translation: Translation, now: Date): Date | null {
  for (const days of CALENDAR_WINDOWS_DAYS) {
    const slots = listSlots(translation, now, new Date(now.getTime() + days * 86400000));
    if (!slots.ok) continue;
    const first = slots.value[0];
    if (first !== undefined) return first;
  }
  return null;
}

/**
 * The next fire of an interval schedule: one step after the newest scheduled
 * run of this bot, or one step after now when it never ran. Whole steps are
 * added until the instant is after now, so a host that slept through several
 * fires still names the next one rather than a past one.
 */
function nextIntervalFire(snapshot: IndexSnapshot, key: string, botId: string, startInterval: number, now: Date): Date | null {
  const step = startInterval * 1000;
  if (!Number.isFinite(step) || step <= 0) return null;
  let newest: number | null = null;
  for (const run of snapshot.runs) {
    if (run.identityKey !== key || run.botId !== botId) continue;
    const summary = runSummaryOf(run);
    if (summary === null || summary.source !== 'schedule') continue;
    const at = Date.parse(run.dispatchedAt);
    if (Number.isNaN(at)) continue;
    if (newest === null || at > newest) newest = at;
  }
  if (newest === null) return new Date(now.getTime() + step);
  let next = newest + step;
  while (next <= now.getTime()) next += step;
  return new Date(next);
}

/**
 * The next fire of every installed, unheld bot schedule of one identity. A
 * record that is not a bot, holds no schedule or is held draws no row, and so
 * does a schedule the translator refuses or the lister finds no slot for. The
 * actor is the operator who installed it, so a scheduled row names who asked
 * for it rather than the path it runs in.
 */
function scheduleFiresFor(input: ActivityInput, identity: string, key: string, snapshot: IndexSnapshot, now: Date): ScheduleFire[] {
  const folder = identityStatePaths(input.stateRoot, identity).installs;
  let names: string[];
  try {
    names = readdirSync(folder).filter((name) => name.endsWith('.json')).sort();
  } catch {
    return [];
  }
  const fires: ScheduleFire[] = [];
  for (const name of names) {
    const record = readInstallRecord(input.stateRoot, identity, name.slice(0, -'.json'.length));
    if (record === null) continue;
    if (record.agent !== 'bot' || record.schedule === null || record.hold !== null) continue;
    const translation = translateCron(record.schedule.expression);
    if (!translation.ok) continue;
    const nextFire = translation.value.kind === 'interval'
      ? nextIntervalFire(snapshot, key, record.botId, translation.value.startInterval, now)
      : nextCalendarFire(translation.value, now);
    if (nextFire === null) continue;
    fires.push({
      identity,
      botId: record.botId,
      at: nextFire.toISOString(),
      actor: typeof record.operator === 'string' ? record.operator : null,
      expression: record.schedule.expression,
    });
  }
  return fires;
}

/**
 * Build the activity report: the seven groups, every row naming the source it
 * came from. The index is opened and refreshed exactly as status reads it, so
 * a run that ended after the build shows at once. Then three live sources are
 * gathered per identity: the lease side files of runs still in flight, the
 * queued requests not yet claimed, and the next fire of each installed
 * schedule. A retired identity draws nothing, since activity has no --all.
 *
 * @returns The payload, or the same index refusals status reports, each naming the rebuild.
 */
export function activityReport(input: ActivityInput): Result<ActivityPayload> {
  const now = input.now ?? new Date();
  const read = openSnapshot(input, now);
  if (!read.ok) return read;
  const { snapshot } = read.value;
  const live: LiveRun[] = [];
  const queued: ActivityQueuedRequest[] = [];
  const fires: ScheduleFire[] = [];
  for (const key of snapshotKeys(input.stateRoot, snapshot)) {
    const identity = identityForKey(snapshot, key);
    if (!IDENTITY_PATTERN.test(identity)) continue;
    if (snapshot.retired.some((row) => row.identityKey === key)) continue;
    live.push(...liveRunsFor(input, identity));
    queued.push(...queuedRequestsFor(input, identity));
    fires.push(...scheduleFiresFor(input, identity, key, snapshot, now));
  }
  return { ok: true, value: buildActivity({ snapshot, live, queued, fires, now, describe: input.describe ?? describeStart }) };
}

/** Drop the index and build it again from the run records and needs-you items. */
export function rebuildStatusIndex(input: StatusInput): Result<BuildReport> {
  return withHint(rebuildIndex(input.stateRoot, input));
}

export interface UnregisterResult {
  identity: string;
  /** True when no registered-roots file existed, so retiring wrote the first one. */
  createdFile: boolean;
}

/**
 * Retire an identity: its rows stop showing by default. The retirement is
 * written to the registered-roots file by temp file and rename, so a deleted
 * and rebuilt index still hides the identity. No index is built here, so no
 * retention runs: nothing is deleted, no run folder, item, record or job file.
 * An index already in place gets the same row, so status hides the identity
 * at once.
 *
 * @returns The identity retired, or `identity-invalid`, `registered-roots-unreadable` or an index refusal.
 */
export function unregisterIdentity(input: StatusInput & { identity: string }): Result<UnregisterResult> {
  if (!IDENTITY_PATTERN.test(input.identity)) return { ok: false, reason: 'identity-invalid', detail: 'expected owner/name' };
  let fileExisted: boolean;
  let retiredAt: string;
  try {
    fileExisted = retireIdentityRoots(input.stateRoot, input.identity, input.now).fileExisted;
    retiredAt = readRetiredIdentities(input.stateRoot)[identityKey(input.identity)]?.retiredAt ?? (input.now ?? new Date()).toISOString();
  } catch (error: unknown) {
    return { ok: false, reason: 'registered-roots-unreadable', detail: error instanceof Error ? error.message : String(error) };
  }
  const opened = openIndex(input.stateRoot, input);
  if (!opened.ok && opened.reason === 'index-missing') return { ok: true, value: { identity: input.identity, createdFile: !fileExisted } };
  if (!opened.ok) return withHint(opened);
  try {
    retireIdentity(opened.value, input.identity, retiredAt);
  } catch (error: unknown) {
    return withHint({ ok: false, reason: 'index-unreadable', detail: `${opened.value.path}: ${error instanceof Error ? error.message : String(error)}` });
  } finally {
    opened.value.close();
  }
  return { ok: true, value: { identity: input.identity, createdFile: !fileExisted } };
}

// ───────────────────────────────────────────────────────────────────
// 6. TEXT
// ───────────────────────────────────────────────────────────────────

/** The report as terminal lines: a header, then one tab-separated line per row. No question text ever appears. */
export function formatStatus(report: StatusReport): string[] {
  const lines = [`index built ${report.builtAt ?? 'never'} (${report.indexPath})`];
  if (report.stale) lines.push(`stale: newer runs or items exist for ${report.staleIdentities.join(', ')} since ${report.builtAt ?? 'never'}; ${REBUILD_HINT}`);
  if (report.rows.length === 0) lines.push('no bots and no open needs-you items');
  for (const row of report.rows) {
    if (row.kind === 'needs-you') {
      lines.push(`${row.state}\t${row.identity}\t${row.botId}\titem ${row.itemId}\trun ${row.runId}\texpires ${row.expiresAt}\tsee bots inbox`);
      continue;
    }
    const parts = [row.state, row.identity, row.botId, row.path ?? '-'];
    if (row.previousPath !== null) parts.push(`previous ${row.previousPath}`);
    parts.push(row.lastRun === null ? 'no run' : `last ${row.lastRun.runId} ${row.lastRun.exitReason}`);
    if (row.lastRun !== null && row.lastRun.delivery.length > 0) parts.push(`delivery ${row.lastRun.delivery.map((entry) => `${entry.channel}:${entry.state}`).join(',')}`);
    if (row.flags.length > 1) parts.push(`flags ${row.flags.join(',')}`);
    if (row.heldBy !== null) parts.push(`held by ${row.heldBy}`);
    if (row.fix !== null) parts.push(`needs-reinstall (${row.reinstall.join(', ')}): ${row.fix}`);
    lines.push(parts.join('\t'));
  }
  for (const duplicate of report.duplicateRoots) lines.push(`two checkouts for ${duplicate.identity}: ${duplicate.paths.join(' and ')}; no row was moved`);
  for (const note of report.notes) lines.push(`note: ${note}`);
  return lines;
}
