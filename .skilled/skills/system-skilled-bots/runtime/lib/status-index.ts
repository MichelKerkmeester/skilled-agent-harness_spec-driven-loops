// ───────────────────────────────────────────────────────────────────
// MODULE: Status Index
// ───────────────────────────────────────────────────────────────────
//
// `bots status` must answer without opening a run folder, and it must say
// when its answer is old. So it reads one derived SQLite file under the
// user-level state root, built only from the run records and needs-you items
// that already live there, and the retired identities kept in the
// registered-roots file. The file holds nothing a rebuild cannot restore.
//
// A run row is written once and never updated, because a summary that can
// change after the run ended cannot be trusted as history. What does change
// after a run (its delivery outcome, an item's answer) lives in tables of its
// own. Retention is a count bound per identity and per bot, applied the same
// way on every write and every rebuild, so a rebuild lands on the same rows.
// A build plans its deletions and carries them out only after the new file
// is in place, so a build that fails deletes nothing.

import { accessSync, chmodSync, constants, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, renameSync, rmSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join, sep } from 'node:path';

import { identityKey } from './identity.js';
import { listNeedsYouItems, resumeRequestPending } from './needs-you.js';
import { DEFAULT_RETENTION, IDENTITY_PATTERN, readRepoConfig } from './repo-config.js';
import { validateRunRecord } from './run-record.js';
import {
  generationStampFile,
  identityStatePaths,
  needsYouFile,
  readRegisteredRoots,
  readRetiredIdentities,
  RUN_ROOT_RELATIVE,
  sharedStatePaths,
  STATE_DIR_MODE,
  statusIndexFile,
} from './state-root.js';

import type BetterSqlite3 from 'better-sqlite3';

import type { NeedsYouItem } from './needs-you.js';
import type { Result, RetentionConfig } from './repo-config.js';
import type { RunRecord } from './run-record.js';

// ───────────────────────────────────────────────────────────────────
// 1. TYPES & CONSTANTS
// ───────────────────────────────────────────────────────────────────

/** Owner-only, like every other file under the state root. */
export const INDEX_FILE_MODE = 0o600;

/** A concurrent writer (a run landing during a status call) waits this long before the read fails. */
export const INDEX_BUSY_TIMEOUT_MS = 5000;

const SCHEMA_VERSION = '2';

type DatabaseCtor = typeof BetterSqlite3;
type Db = BetterSqlite3.Database;

/** An open index. Always close it, so its write-ahead files do not outlive the process. */
export interface StatusIndex {
  db: Db;
  path: string;
  close(): void;
}

/** The fields one run row keeps. No run output and no question text, only what status shows. */
export interface RunSummary {
  runId: string;
  botId: string;
  identity: string;
  repositoryPath: string;
  definitionDigest: string;
  source: string;
  scheduledAt: string | null;
  dispatchedAt: string;
  latenessClass: string | null;
  skippedSlots: { count: number; slots: string[]; first: string | null; last: string | null } | null;
  heldSlot: { at: string; reason: string } | null;
  exitReason: string;
  exitClass: string | null;
  needsYouItemId: string | null;
  refusalCause: string | null;
  runFolder: string;
  requestId: string | null;
  /** Who the run was recorded as. Null for a record written before records named anyone. */
  actor: string | null;
  /** The tree the run worked in. Null for a run in the shared checkout, and absent on a summary written before the field existed. */
  worktreePath?: string | null;
  /** The branch the run worked on. Null on a detached HEAD or a failed read, and absent on an older summary. */
  branch?: string | null;
}

export interface RunRow {
  identityKey: string;
  runId: string;
  identity: string;
  repositoryPath: string;
  botId: string;
  dispatchedAt: string;
  runFolder: string;
  summary: string;
}

export interface DeliveryRow {
  identityKey: string;
  runId: string;
  position: number;
  channel: string;
  state: string;
}

export interface ItemRow {
  identityKey: string;
  itemId: string;
  identity: string;
  botId: string;
  runId: string;
  createdAt: string;
  expiresAt: string;
  answeredAt: string | null;
  resumeRequestId: string | null;
}

export interface RetiredRow {
  identityKey: string;
  identity: string;
  retiredAt: string;
}

/** Everything the index holds, in a stable order. */
export interface IndexSnapshot {
  builtAt: string | null;
  /** When the index was last brought up to date. Null for an index built before this row existed, until its first refresh. */
  updatedAt: string | null;
  generations: Record<string, number>;
  runs: RunRow[];
  deliveries: DeliveryRow[];
  items: ItemRow[];
  retired: RetiredRow[];
}

export interface BuildReport {
  path: string;
  builtAt: string;
  identities: number;
  runs: number;
  items: number;
  /** Record and item files that did not read and were left out, by path. */
  skipped: string[];
  retention: RetentionReport;
  /** Identities whose checkout could not be read, so no bound was applied to them. */
  retentionSkipped: string[];
}

export interface RetentionReport {
  rowsDeleted: number;
  runFoldersDeleted: string[];
  /** Run folder paths retention would not delete because they sit outside the identity's runs folder. */
  runFoldersRefused: string[];
  itemsDeleted: string[];
}

export interface IndexOptions {
  /** Loads the SQLite binding; a test passes a failing one. */
  loader?: () => DatabaseCtor;
  now?: Date;
}

const requireCjs = createRequire(import.meta.url);

const SCHEMA = `
CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS generations (identity_key TEXT PRIMARY KEY, generation INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS runs (
  identity_key TEXT NOT NULL,
  run_id TEXT NOT NULL,
  identity TEXT NOT NULL,
  repository_path TEXT NOT NULL,
  bot_id TEXT NOT NULL,
  dispatched_at TEXT NOT NULL,
  run_folder TEXT NOT NULL,
  summary TEXT NOT NULL,
  PRIMARY KEY (identity_key, run_id)
);
CREATE TABLE IF NOT EXISTS deliveries (
  identity_key TEXT NOT NULL,
  run_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  channel TEXT NOT NULL,
  state TEXT NOT NULL,
  PRIMARY KEY (identity_key, run_id, position)
);
CREATE TABLE IF NOT EXISTS items (
  identity_key TEXT NOT NULL,
  item_id TEXT NOT NULL,
  identity TEXT NOT NULL,
  bot_id TEXT NOT NULL,
  run_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  answered_at TEXT,
  resume_request_id TEXT,
  PRIMARY KEY (identity_key, item_id)
);
CREATE TABLE IF NOT EXISTS retired (identity_key TEXT PRIMARY KEY, identity TEXT NOT NULL, retired_at TEXT NOT NULL);
`;

// ───────────────────────────────────────────────────────────────────
// 2. OPEN
// ───────────────────────────────────────────────────────────────────

function defaultLoader(): DatabaseCtor {
  return requireCjs('better-sqlite3') as DatabaseCtor;
}

/**
 * Load the SQLite binding. A native module can fail to load after a Node
 * upgrade; that is reported by name, never answered from the run folders.
 */
export function loadBinding(loader: () => DatabaseCtor = defaultLoader): Result<DatabaseCtor> {
  try {
    return { ok: true, value: loader() };
  } catch (error: unknown) {
    return { ok: false, reason: 'index-binding-failed', detail: error instanceof Error ? error.message : String(error) };
  }
}

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/** Set the three pragmas every connection carries. The timeout goes first, so the mode change can wait for a lock. */
function setPragmas(db: Db): void {
  db.pragma(`busy_timeout = ${INDEX_BUSY_TIMEOUT_MS}`);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = FULL');
}

/**
 * Open the existing index in WAL mode with a five-second busy timeout and
 * full sync. A file that is not a database, or holds another schema, is a
 * refusal that names the file and the rebuild, never an empty answer.
 *
 * @returns The open index, or `index-missing`, `index-binding-failed` or `index-unreadable`.
 */
export function openIndex(stateRoot: string, options: IndexOptions = {}): Result<StatusIndex> {
  const path = statusIndexFile(stateRoot);
  if (!existsSync(path)) return { ok: false, reason: 'index-missing', detail: path };
  const binding = loadBinding(options.loader);
  if (!binding.ok) return binding;
  let db: Db;
  try {
    db = new binding.value(path, { fileMustExist: true });
  } catch (error: unknown) {
    return { ok: false, reason: 'index-unreadable', detail: `${path}: ${errorText(error)}` };
  }
  try {
    setPragmas(db);
    const row = db.prepare("SELECT value FROM meta WHERE key = 'schemaVersion'").get() as { value?: string } | undefined;
    if (row?.value !== SCHEMA_VERSION) throw new Error(`schema version ${String(row?.value)} is not ${SCHEMA_VERSION}`);
  } catch (error: unknown) {
    db.close();
    return { ok: false, reason: 'index-unreadable', detail: `${path}: ${errorText(error)}` };
  }
  return { ok: true, value: { db, path, close: () => db.close() } };
}

// ───────────────────────────────────────────────────────────────────
// 3. ROWS
// ───────────────────────────────────────────────────────────────────

/** The summary a run row keeps, with the skipped-slot list cut to the bound. */
export function summarizeRecord(record: RunRecord, skippedSlotsPerSummary: number): RunSummary {
  const skipped = record.dispatch.skippedSlots;
  return {
    runId: record.identity.runId,
    botId: record.identity.botId,
    identity: record.identity.repository,
    repositoryPath: record.identity.repositoryPath,
    definitionDigest: record.identity.definitionDigest,
    source: record.dispatch.source,
    scheduledAt: record.dispatch.scheduledAt,
    dispatchedAt: record.dispatch.dispatchedAt,
    latenessClass: record.dispatch.latenessClass,
    skippedSlots: skipped === null || skipped === undefined
      ? null
      : {
          count: skipped.count,
          // The most recent slots are the ones worth showing; the count and the bounds keep the rest.
          slots: skipped.slots.slice(-skippedSlotsPerSummary),
          first: skipped.first ?? null,
          last: skipped.last ?? null,
        },
    heldSlot: record.dispatch.heldSlot ?? null,
    exitReason: record.exit.reason,
    exitClass: record.exit.class,
    needsYouItemId: record.exit.needsYouItemId,
    refusalCause: record.exit.refusal?.cause ?? null,
    runFolder: record.evidence.runFolder,
    requestId: record.request.requestId,
    actor: record.actor ?? null,
    worktreePath: record.evidence.worktreePath ?? null,
    branch: record.evidence.branch ?? null,
  };
}

/**
 * Add one run to the index. A run already indexed keeps its row exactly as
 * first written; only its delivery outcome, which a later pass may record,
 * is replaced.
 *
 * @returns Whether a new run row was written.
 */
export function indexRunRecord(index: Pick<StatusIndex, 'db'>, record: RunRecord, retention: Pick<RetentionConfig, 'skippedSlotsPerSummary'>): boolean {
  const key = identityKey(record.identity.repository);
  const summary = summarizeRecord(record, retention.skippedSlotsPerSummary);
  const inserted = index.db
    .prepare(
      'INSERT OR IGNORE INTO runs (identity_key, run_id, identity, repository_path, bot_id, dispatched_at, run_folder, summary) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    )
    .run(key, summary.runId, summary.identity, summary.repositoryPath, summary.botId, summary.dispatchedAt, summary.runFolder, JSON.stringify(summary));
  index.db.prepare('DELETE FROM deliveries WHERE identity_key = ? AND run_id = ?').run(key, summary.runId);
  const add = index.db.prepare('INSERT INTO deliveries (identity_key, run_id, position, channel, state) VALUES (?, ?, ?, ?, ?)');
  // The target is left out: a webhook target can carry a token, and status only needs the channel and the outcome.
  record.delivery.forEach((entry, position) => add.run(key, summary.runId, position, entry.channel, entry.state));
  return inserted.changes > 0;
}

/** Add or refresh one needs-you item. Only its ids and times are kept, never the question or the answer text. */
export function indexNeedsYouItem(index: Pick<StatusIndex, 'db'>, item: NeedsYouItem): void {
  index.db
    .prepare(
      'INSERT OR REPLACE INTO items (identity_key, item_id, identity, bot_id, run_id, created_at, expires_at, answered_at, resume_request_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    )
    .run(identityKey(item.identity), item.id, item.identity, item.botId, item.runId, item.createdAt, item.expiresAt, item.answer?.answeredAt ?? null, item.resumeRequestId);
}

/**
 * Replace one identity's item rows with what its item files say now. Status
 * calls this for an identity whose generation stamp moved, so an answer
 * clears a hold without a full rebuild. The run rows and the consumed
 * generation are left alone, so the index still reads stale until a rebuild
 * indexes the runs. A folder that cannot be listed changes nothing.
 *
 * @returns Whether the rows were replaced.
 */
export function refreshItemRows(index: Pick<StatusIndex, 'db'>, stateRoot: string, key: string, now: Date = new Date()): boolean {
  const listed = listNeedsYouItems(stateRoot, decodeURIComponent(key), now);
  if (listed.listError !== null) return false;
  const replace = index.db.transaction(() => {
    index.db.prepare('DELETE FROM items WHERE identity_key = ?').run(key);
    for (const { item } of listed.items) if (identityKey(item.identity) === key) indexNeedsYouItem(index, item);
  });
  replace();
  return true;
}

/** Record the generation stamp the index now reflects for one identity. */
export function recordGeneration(index: Pick<StatusIndex, 'db'>, key: string, generation: number): void {
  index.db.prepare('INSERT OR REPLACE INTO generations (identity_key, generation) VALUES (?, ?)').run(key, generation);
}

/** Record when the index was last brought up to date. A refresh calls it inside the transaction that indexed the new rows. */
export function recordUpdatedAt(index: Pick<StatusIndex, 'db'>, at: string): void {
  index.db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)').run('updatedAt', at);
}

/**
 * Mirror one retirement from the registered-roots file into an index already
 * in place, with the file's own time, so the row matches what a rebuild
 * writes. Nothing is deleted, in the index or anywhere else.
 */
export function retireIdentity(index: Pick<StatusIndex, 'db'>, identity: string, retiredAt: string): void {
  index.db
    .prepare('INSERT OR REPLACE INTO retired (identity_key, identity, retired_at) VALUES (?, ?, ?)')
    .run(identityKey(identity), identity, retiredAt);
}

/** Read the whole index in a stable order. */
export function readIndex(index: Pick<StatusIndex, 'db'>): IndexSnapshot {
  const { db } = index;
  const built = db.prepare("SELECT value FROM meta WHERE key = 'builtAt'").get() as { value: string } | undefined;
  const updated = db.prepare("SELECT value FROM meta WHERE key = 'updatedAt'").get() as { value: string } | undefined;
  const generations: Record<string, number> = {};
  for (const row of db.prepare('SELECT identity_key, generation FROM generations ORDER BY identity_key').all() as Array<{ identity_key: string; generation: number }>) {
    generations[row.identity_key] = row.generation;
  }
  const runs = (db.prepare('SELECT * FROM runs ORDER BY identity_key, dispatched_at, run_id').all() as Array<Record<string, string>>).map((row) => ({
    identityKey: row.identity_key as string,
    runId: row.run_id as string,
    identity: row.identity as string,
    repositoryPath: row.repository_path as string,
    botId: row.bot_id as string,
    dispatchedAt: row.dispatched_at as string,
    runFolder: row.run_folder as string,
    summary: row.summary as string,
  }));
  const deliveries = (db.prepare('SELECT * FROM deliveries ORDER BY identity_key, run_id, position').all() as Array<Record<string, string | number>>).map((row) => ({
    identityKey: row.identity_key as string,
    runId: row.run_id as string,
    position: row.position as number,
    channel: row.channel as string,
    state: row.state as string,
  }));
  const items = (db.prepare('SELECT * FROM items ORDER BY identity_key, created_at, item_id').all() as Array<Record<string, string | null>>).map((row) => ({
    identityKey: row.identity_key as string,
    itemId: row.item_id as string,
    identity: row.identity as string,
    botId: row.bot_id as string,
    runId: row.run_id as string,
    createdAt: row.created_at as string,
    expiresAt: row.expires_at as string,
    answeredAt: row.answered_at ?? null,
    resumeRequestId: row.resume_request_id ?? null,
  }));
  const retired = (db.prepare('SELECT * FROM retired ORDER BY identity_key').all() as Array<Record<string, string>>).map((row) => ({
    identityKey: row.identity_key as string,
    identity: row.identity as string,
    retiredAt: row.retired_at as string,
  }));
  return { builtAt: built?.value ?? null, updatedAt: updated?.value ?? null, generations, runs, deliveries, items, retired };
}

// ───────────────────────────────────────────────────────────────────
// 4. RETENTION
// ───────────────────────────────────────────────────────────────────

/** A checkout folder that exists and can be read; anything else gives no config to trust. */
function readableFolder(path: string): boolean {
  try {
    if (!statSync(path).isDirectory()) return false;
    accessSync(path, constants.R_OK | constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * The retention bounds of one identity, read from `bots/config.json` in the
 * first registered checkout of that identity that is present and whose
 * config reads (a present checkout with no config file has the defaults).
 *
 * @returns The bounds, or null when no checkout of the identity can be read.
 *   The caller then prunes nothing: a missing or unreadable checkout may have
 *   raised its bounds, and the defaults could delete what it meant to keep.
 */
export function retentionFor(stateRoot: string, key: string, fallbackPaths: string[] = []): RetentionConfig | null {
  let roots: string[] = [];
  try {
    roots = readRegisteredRoots(stateRoot)[key] ?? [];
  } catch {
    roots = [];
  }
  for (const root of [...roots, ...fallbackPaths]) {
    if (!readableFolder(root)) continue;
    const config = readRepoConfig(root);
    if (config.ok) return config.value.retention;
  }
  return null;
}

type PruneOutcome = 'deleted' | 'absent' | 'refused';

/**
 * Delete one run folder, but only a real folder directly inside this
 * identity's runs folder in a Skilled tree. A link, a path into another
 * identity's runs folder, or anything else is refused and left alone, so
 * retention can never delete outside the folder it owns.
 */
export function pruneRunFolder(runFolder: string, identity: string): PruneOutcome {
  const runsDir = dirname(runFolder);
  const expectedTail = join(RUN_ROOT_RELATIVE, identityKey(identity), 'runs');
  if (!runsDir.endsWith(`${sep}${expectedTail}`)) return 'refused';
  let stat;
  try {
    stat = lstatSync(runFolder);
  } catch (error: unknown) {
    return (error as NodeJS.ErrnoException | null)?.code === 'ENOENT' ? 'absent' : 'refused';
  }
  if (!stat.isDirectory() || stat.isSymbolicLink()) return 'refused';
  try {
    const realRuns = realpathSync(runsDir);
    if (!realRuns.endsWith(`${sep}${expectedTail}`)) return 'refused';
    if (realpathSync(runFolder) !== join(realRuns, basename(runFolder))) return 'refused';
  } catch {
    return 'refused';
  }
  rmSync(runFolder, { recursive: true, force: true });
  return 'deleted';
}

/** What one retention pass will delete from disk. Its index rows are already gone when the plan is returned. */
export interface RetentionPlan {
  rowsDeleted: number;
  runFolders: Array<{ path: string; identity: string }>;
  itemFiles: Array<{ itemId: string; path: string }>;
}

/**
 * Plan every bound of one identity and delete the index rows it removes:
 * run folders past the per-bot bound, index rows past the per-identity bound
 * (oldest first), and closed needs-you items past their bound. Nothing on
 * disk is touched here, so a build can delete the files only after its new
 * index is in place.
 *
 * Never planned: an open item; an answered item whose resume has not run
 * (no resume request recorded yet, or its request still in the inbox or
 * claimed); and the run folder of a run such an item names, which the
 * operator may still need to read.
 */
export function planRetention(
  index: Pick<StatusIndex, 'db'>,
  stateRoot: string,
  key: string,
  retention: RetentionConfig,
  now: Date = new Date(),
): RetentionPlan {
  const { db } = index;
  const plan: RetentionPlan = { rowsDeleted: 0, runFolders: [], itemFiles: [] };

  const items = db
    .prepare('SELECT item_id, identity, run_id, expires_at, answered_at, resume_request_id FROM items WHERE identity_key = ? ORDER BY created_at DESC, item_id DESC')
    .all(key) as Array<{ item_id: string; identity: string; run_id: string; expires_at: string; answered_at: string | null; resume_request_id: string | null }>;
  const isOpen = (item: (typeof items)[number]) => item.answered_at === null && now.getTime() < Date.parse(item.expires_at);
  const awaitsResume = (item: (typeof items)[number]) =>
    item.answered_at !== null && (item.resume_request_id === null || resumeRequestPending(stateRoot, item.identity, item.resume_request_id));
  const kept = new Set(items.filter((item) => isOpen(item) || awaitsResume(item)).map((item) => item.run_id));

  const rows = db
    .prepare('SELECT run_id, identity, bot_id, run_folder FROM runs WHERE identity_key = ? ORDER BY dispatched_at DESC, run_id DESC')
    .all(key) as Array<{ run_id: string; identity: string; bot_id: string; run_folder: string }>;
  const perBot = new Map<string, number>();
  for (const row of rows) {
    const seen = (perBot.get(row.bot_id) ?? 0) + 1;
    perBot.set(row.bot_id, seen);
    if (seen <= retention.runFoldersPerBot || kept.has(row.run_id)) continue;
    plan.runFolders.push({ path: row.run_folder, identity: row.identity });
  }

  const deleteRun = db.prepare('DELETE FROM runs WHERE identity_key = ? AND run_id = ?');
  const deleteDeliveries = db.prepare('DELETE FROM deliveries WHERE identity_key = ? AND run_id = ?');
  for (const row of rows.slice(retention.indexRowsPerIdentity)) {
    deleteDeliveries.run(key, row.run_id);
    plan.rowsDeleted += deleteRun.run(key, row.run_id).changes;
  }

  const closed = items.filter((item) => !isOpen(item) && !awaitsResume(item));
  const deleteItem = db.prepare('DELETE FROM items WHERE identity_key = ? AND item_id = ?');
  for (const item of closed.slice(retention.closedNeedsYouPerIdentity)) {
    const file = needsYouFile(stateRoot, item.identity, item.item_id);
    if (dirname(file) !== identityStatePaths(stateRoot, item.identity).needsYou) continue;
    deleteItem.run(key, item.item_id);
    plan.itemFiles.push({ itemId: item.item_id, path: file });
  }
  return plan;
}

/** Delete what a plan names. Each run folder goes through the boundary check again at the moment of deletion. */
export function executeRetention(plan: RetentionPlan): RetentionReport {
  const report: RetentionReport = { rowsDeleted: plan.rowsDeleted, runFoldersDeleted: [], runFoldersRefused: [], itemsDeleted: [] };
  for (const target of plan.runFolders) {
    const outcome = pruneRunFolder(target.path, target.identity);
    if (outcome === 'deleted') report.runFoldersDeleted.push(target.path);
    if (outcome === 'refused') report.runFoldersRefused.push(target.path);
  }
  for (const target of plan.itemFiles) {
    rmSync(target.path, { force: true });
    report.itemsDeleted.push(target.itemId);
  }
  return report;
}

/** Plan and delete at once, for a writer that changes an index already in place. */
export function applyRetention(
  index: Pick<StatusIndex, 'db'>,
  stateRoot: string,
  key: string,
  retention: RetentionConfig,
  now: Date = new Date(),
): RetentionReport {
  return executeRetention(planRetention(index, stateRoot, key, retention, now));
}

// ───────────────────────────────────────────────────────────────────
// 5. SOURCES
// ───────────────────────────────────────────────────────────────────

/** The identity keys that have a folder under the state root. Shared entries never decode to `owner/name`. */
export function identityKeys(stateRoot: string): string[] {
  let names: string[];
  try {
    names = readdirSync(stateRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }
  return names
    .filter((name) => {
      try {
        const decoded = decodeURIComponent(name);
        return IDENTITY_PATTERN.test(decoded) && identityKey(decoded) === name;
      } catch {
        return false;
      }
    })
    .sort();
}

/** The generation stamp the runner last wrote for an identity key; null when none was written. */
export function readGeneration(stateRoot: string, key: string): number | null {
  try {
    const parsed = JSON.parse(readFileSync(generationStampFile(stateRoot, decodeURIComponent(key)), 'utf8')) as { generation?: unknown };
    return typeof parsed.generation === 'number' && Number.isSafeInteger(parsed.generation) ? parsed.generation : null;
  } catch {
    return null;
  }
}

/** Every run record of one identity that reads and validates, and the paths of the ones that do not. */
export function readRecords(stateRoot: string, key: string): { records: RunRecord[]; skipped: string[] } {
  const folder = identityStatePaths(stateRoot, decodeURIComponent(key)).records;
  let names: string[];
  try {
    names = readdirSync(folder).filter((name) => name.endsWith('.json')).sort();
  } catch {
    return { records: [], skipped: [] };
  }
  const records: RunRecord[] = [];
  const skipped: string[] = [];
  for (const name of names) {
    const path = join(folder, name);
    try {
      const valid = validateRunRecord(JSON.parse(readFileSync(path, 'utf8')));
      if (valid.ok && identityKey(valid.value.identity.repository) === key) records.push(valid.value);
      else skipped.push(path);
    } catch {
      skipped.push(path);
    }
  }
  return { records, skipped };
}

// ───────────────────────────────────────────────────────────────────
// 6. BUILD
// ───────────────────────────────────────────────────────────────────

/**
 * Build the index from the run records and needs-you items under the state
 * root, never from a run folder, and move it into place. The new file is
 * built beside the old one and renamed over it, so a crash mid-build leaves
 * the old index readable. Every build writes `builtAt` and the generation it
 * consumed per identity, read before the records so a run landing during the
 * build shows as stale rather than as missed.
 *
 * @returns What was built, or `index-binding-failed` or `index-build-failed`.
 */
export function rebuildIndex(stateRoot: string, options: IndexOptions = {}): Result<BuildReport> {
  const binding = loadBinding(options.loader);
  if (!binding.ok) return binding;
  const now = options.now ?? new Date();
  const path = statusIndexFile(stateRoot);
  const folder = sharedStatePaths(stateRoot).index;
  mkdirSync(folder, { recursive: true, mode: STATE_DIR_MODE });
  chmodSync(folder, STATE_DIR_MODE);

  // The durable retired list; a file that does not read fails the build rather than un-retiring anyone.
  const retired = Object.entries(readRetiredIdentities(stateRoot)).map(([identityKeyValue, entry]) => ({ identityKey: identityKeyValue, ...entry }));
  const temp = `${path}.build-${process.pid}`;
  rmSync(temp, { force: true });
  const report: BuildReport = {
    path,
    builtAt: now.toISOString(),
    identities: 0,
    runs: 0,
    items: 0,
    skipped: [],
    retention: { rowsDeleted: 0, runFoldersDeleted: [], runFoldersRefused: [], itemsDeleted: [] },
    retentionSkipped: [],
  };

  let db: Db | null = null;
  try {
    db = new binding.value(temp);
    // The temp file is built with a rollback journal, so closing it leaves one file to rename and no side file to strand.
    db.pragma(`busy_timeout = ${INDEX_BUSY_TIMEOUT_MS}`);
    db.pragma('journal_mode = DELETE');
    db.pragma('synchronous = FULL');
    db.exec(SCHEMA);
    const handle = { db };
    const keys = identityKeys(stateRoot);
    const plans: RetentionPlan[] = [];
    const build = db.transaction(() => {
      handle.db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run('schemaVersion', SCHEMA_VERSION);
      handle.db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run('builtAt', report.builtAt);
      handle.db.prepare('INSERT INTO meta (key, value) VALUES (?, ?)').run('updatedAt', report.builtAt);
      for (const row of retired) handle.db.prepare('INSERT INTO retired (identity_key, identity, retired_at) VALUES (?, ?, ?)').run(row.identityKey, row.identity, row.retiredAt);
      for (const key of keys) {
        const generation = readGeneration(stateRoot, key);
        if (generation !== null) recordGeneration(handle, key, generation);
        const { records, skipped } = readRecords(stateRoot, key);
        report.skipped.push(...skipped);
        const retention = retentionFor(stateRoot, key, records.map((record) => record.identity.repositoryPath));
        if (retention === null) report.retentionSkipped.push(decodeURIComponent(key));
        const slots = retention?.skippedSlotsPerSummary ?? DEFAULT_RETENTION.skippedSlotsPerSummary;
        for (const record of records) if (indexRunRecord(handle, record, { skippedSlotsPerSummary: slots })) report.runs += 1;
        const listed = listNeedsYouItems(stateRoot, decodeURIComponent(key), now);
        for (const id of listed.unreadable) report.skipped.push(needsYouFile(stateRoot, decodeURIComponent(key), id));
        for (const { item } of listed.items) {
          if (identityKey(item.identity) !== key) continue;
          indexNeedsYouItem(handle, item);
          report.items += 1;
        }
        if (retention !== null) {
          const plan = planRetention(handle, stateRoot, key, retention, now);
          report.runs -= plan.rowsDeleted;
          report.items -= plan.itemFiles.length;
          plans.push(plan);
        }
        if (records.length > 0 || listed.items.length > 0) report.identities += 1;
      }
    });
    build();
    db.close();
    db = null;
    chmodSync(temp, INDEX_FILE_MODE);
    // A write-ahead file left by a crashed reader belongs to the old database; replayed into the new one it would corrupt it.
    rmSync(`${path}-wal`, { force: true });
    rmSync(`${path}-shm`, { force: true });
    renameSync(temp, path);
    // Files go only once the index that no longer names them is in place, so a failed build deletes nothing.
    for (const plan of plans) {
      const pruned = executeRetention(plan);
      report.retention.rowsDeleted += pruned.rowsDeleted;
      report.retention.runFoldersDeleted.push(...pruned.runFoldersDeleted);
      report.retention.runFoldersRefused.push(...pruned.runFoldersRefused);
      report.retention.itemsDeleted.push(...pruned.itemsDeleted);
    }
  } catch (error: unknown) {
    db?.close();
    rmSync(temp, { force: true });
    return { ok: false, reason: 'index-build-failed', detail: `${path}: ${errorText(error)}` };
  }
  return { ok: true, value: report };
}
