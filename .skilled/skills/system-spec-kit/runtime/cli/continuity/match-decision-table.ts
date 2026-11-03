#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Match Decision Table
// ───────────────────────────────────────────────────────────────────
// A captured operator answer normally reaches a decision record through a save.
// When the record was written by hand, the answer is already in it as a table
// row, and a save would append a second row for a decision the record already
// states. This command proves each queued answer against that table, prints the
// row it belongs to, and on request records the row ids as consumed so the save
// stops offering them.
//
// Read-only unless --apply is given, and even then the record itself is never
// written: the consumed log is the only file this command touches.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

import {
  consumedLogPath,
  legacyConsumedLogPath,
  matchRecords,
  parseDecisionTables,
  readConsumedRows,
  recordConsumedKeys,
  summaryLine,
  stateDirPath,
  type ConsumedLogRow,
  type DecisionMatchResult,
  type DecisionQueueRecord,
} from '@spec-kit/runtime/api';
import { isMainModule } from '../lib/esm-entry.js';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

// A session id can hold characters a filename should not, so the capture
// producers name each queue file after the hex of the id. The pattern is narrow
// on purpose: every other file in the state folder is not a queue.
const QUEUE_FILENAME_RE = /^([0-9a-f]+)\.jsonl$/u;

/** Usage text, printed on `--help` and after a bad argument. */
export const USAGE = [
  'match-decision-table: match captured operator answers to a hand-written decision table',
  '',
  'Usage:',
  '  match-decision-table --session <id> --record <path> [--project-root <dir>] [--apply]',
  '  match-decision-table --scan-orphans [--project-root <dir>]',
  '  match-decision-table --release <key> [--project-root <dir>]',
  '',
  'Without --apply nothing is written: one line per queued answer, then a summary.',
  '--apply also records the matched row ids as consumed. The record is never written.',
].join('\n');

// ───────────────────────────────────────────────────────────────────
// 3. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

interface MatchRun {
  readonly mode: 'match';
  readonly projectRoot: string;
  readonly sessionId: string;
  readonly recordPath: string;
  readonly apply: boolean;
}

interface ScanRun {
  readonly mode: 'scan';
  readonly projectRoot: string;
}

interface ReleaseRun {
  readonly mode: 'release';
  readonly projectRoot: string;
  readonly key: string;
}

interface HelpRun {
  readonly mode: 'help';
}

type CliOptions = MatchRun | ScanRun | ReleaseRun | HelpRun;

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

/** A bad argument or an unusable path named by an argument; reported with the usage. */
class UsageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UsageError';
  }
}

function writeLine(value: string): void {
  process.stdout.write(`${value}\n`);
}

function sessionToken(sessionId: string): string {
  return Buffer.from(sessionId, 'utf8').toString('hex');
}

function queuePath(projectRoot: string, sessionId: string): string {
  return path.join(stateDirPath(projectRoot), `${sessionToken(sessionId)}.jsonl`);
}

function legacyQueuePath(projectRoot: string, sessionId: string): string {
  return path.join(path.dirname(stateDirPath(projectRoot)), `${sessionToken(sessionId)}.jsonl`);
}

/**
 * Recover the session id from a queue file name. A name that does not survive
 * the round trip is shown as it stands, because a guessed id is worse than the
 * file name the reader can look up.
 */
function decodeSessionId(token: string): string {
  const decoded = Buffer.from(token, 'hex').toString('utf8');
  return sessionToken(decoded) === token ? decoded : token;
}

function readTextIfPresent(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

/**
 * Parse one log line. A torn line from a killed process, or a hand edit, must
 * not fail the run, and a line that records nothing cannot hide a key.
 */
function parseJsonLine(line: string): Record<string, unknown> | null {
  if (line.trim() === '') {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(line);
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function textField(row: Record<string, unknown>, name: string): string {
  const value = row[name];
  return typeof value === 'string' ? value : '';
}

function stringListField(row: Record<string, unknown>, name: string): string[] {
  const value = row[name];
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
}

function toQueueRecord(row: Record<string, unknown>): DecisionQueueRecord | null {
  const key = textField(row, 'key');
  if (key === '') {
    return null;
  }
  return {
    key,
    header: textField(row, 'header'),
    question: textField(row, 'question'),
    options: stringListField(row, 'options'),
    answer: textField(row, 'answer'),
    captured_at: textField(row, 'captured_at'),
  };
}

function readQueueFile(filePath: string): DecisionQueueRecord[] {
  const records: DecisionQueueRecord[] = [];
  for (const line of readTextIfPresent(filePath).split('\n')) {
    const row = parseJsonLine(line);
    const record = row === null ? null : toQueueRecord(row);
    if (record !== null) {
      records.push(record);
    }
  }
  return records;
}

function readQueueRecords(projectRoot: string, sessionId: string): DecisionQueueRecord[] {
  const records = [
    ...readQueueFile(queuePath(projectRoot, sessionId)),
    ...readQueueFile(legacyQueuePath(projectRoot, sessionId)),
  ];
  const byKey = new Map<string, DecisionQueueRecord>();
  for (const record of records) {
    if (!byKey.has(record.key)) {
      byKey.set(record.key, record);
    }
  }
  return [...byKey.values()];
}

/**
 * The packet a consumed row points at: the record's folder relative to the
 * project root, so the log reads the same way from any working directory.
 */
function packetFor(projectRoot: string, recordPath: string): string {
  const relative = path.relative(projectRoot, path.dirname(recordPath)).split(path.sep).join('/');
  return relative === '' ? '.' : relative;
}

/**
 * Temp file in the same folder, then rename, so a reader never sees a log with
 * some rows removed and the rest still to come.
 */
function writeTextAtomically(filePath: string, text: string): void {
  const tempPath = path.join(
    path.dirname(filePath),
    `.${path.basename(filePath)}.${process.pid}.${Date.now()}.tmp`,
  );
  fs.writeFileSync(tempPath, text, 'utf8');
  fs.renameSync(tempPath, filePath);
}

// ───────────────────────────────────────────────────────────────────
// 5. COMMANDS
// ───────────────────────────────────────────────────────────────────

/**
 * Print one outcome per queued answer, then the run summary. The queue position
 * is the record's own number, so a second run reports the same numbers for the
 * answers a first run consumed.
 */
function writeOutcomeLines(
  queueRecords: readonly DecisionQueueRecord[],
  consumedKeys: ReadonlySet<string>,
  result: DecisionMatchResult,
): void {
  const matched = new Map(result.matches.map((entry) => [entry.key, entry]));
  const refused = new Map(result.refused.map((entry) => [entry.key, entry.reason]));
  const pending = new Map(result.pending.map((entry) => [entry.key, entry.reason]));

  queueRecords.forEach((record, index) => {
    if (consumedKeys.has(record.key)) {
      return;
    }
    const position = index + 1;
    const match = matched.get(record.key);
    if (match !== undefined) {
      writeLine(`${position} ${match.id} ${match.score.toFixed(2)}`);
      return;
    }
    const refusal = refused.get(record.key);
    if (refusal !== undefined) {
      writeLine(`${position} refused ${refusal}`);
      return;
    }
    writeLine(`${position} pending ${pending.get(record.key) ?? 'no row'}`);
  });
}

function runMatch(run: MatchRun): number {
  const queueRecords = readQueueRecords(run.projectRoot, run.sessionId);
  const consumedLines: ConsumedLogRow[] = readConsumedRows(run.projectRoot);
  const consumedKeys = new Set(consumedLines.map((line) => line.key));
  const pendingRecords = queueRecords.filter((record) => !consumedKeys.has(record.key));

  const rows = parseDecisionTables(fs.readFileSync(run.recordPath, 'utf8'));
  const packet = packetFor(run.projectRoot, run.recordPath);
  // Every captured answer, not only the pending ones: a row already consumed
  // under a different answer has to be refused, and that needs the old answer.
  const answersByKey = new Map(queueRecords.map((record) => [record.key, record.answer] as const));

  const result = matchRecords(pendingRecords, rows, consumedLines, { packet, answersByKey });

  writeOutcomeLines(queueRecords, consumedKeys, result);
  writeLine(summaryLine(result));

  if (run.apply) {
    const ids = result.matches.map((entry) => ({ sourceKey: entry.key, id: entry.id }));
    recordConsumedKeys(run.projectRoot, packet, ids, new Date().toISOString());
  }

  return 0;
}

function runScan(projectRoot: string): number {
  const directory = stateDirPath(projectRoot);
  let entries: string[];
  try {
    entries = fs.readdirSync(directory);
  } catch {
    entries = [];
  }

  const consumedKeys = new Set(readConsumedRows(projectRoot).map((line) => line.key));
  let listed = 0;

  for (const entry of entries.sort()) {
    const token = QUEUE_FILENAME_RE.exec(entry)?.[1];
    if (token === undefined) {
      continue;
    }
    const pending = readQueueFile(path.join(directory, entry)).filter(
      (record) => !consumedKeys.has(record.key),
    );
    if (pending.length === 0) {
      continue;
    }
    writeLine(`${pending.length} ${decodeSessionId(token)}`);
    listed += 1;
  }

  if (listed === 0) {
    writeLine('no session queues with pending records');
  }
  return 0;
}

function runRelease(projectRoot: string, key: string): number {
  const removed: string[] = [];
  const filePaths = new Set([consumedLogPath(projectRoot), legacyConsumedLogPath(projectRoot)]);

  for (const filePath of filePaths) {
    const text = readTextIfPresent(filePath);
    if (text === '') {
      continue;
    }

    const kept: string[] = [];
    const fileRemoved: string[] = [];
    for (const line of text.split('\n')) {
      const row = parseJsonLine(line);
      if (row !== null && textField(row, 'key') === key) {
        fileRemoved.push(line);
        continue;
      }
      kept.push(line);
    }

    // Rewriting an unchanged log only moves its mtime, which tells a later reader
    // that something happened when nothing did.
    if (fileRemoved.length === 0) {
      continue;
    }

    writeTextAtomically(filePath, kept.join('\n'));
    removed.push(...fileRemoved);
  }

  for (const line of removed) {
    writeLine(line);
  }
  return 0;
}

// ───────────────────────────────────────────────────────────────────
// 6. CLI ENTRY
// ───────────────────────────────────────────────────────────────────

function parseArgs(argv: readonly string[]): CliOptions {
  let projectRoot = process.cwd();
  let sessionId = '';
  let recordPath = '';
  let releaseKey = '';
  let apply = false;
  let scanOrphans = false;
  let help = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index] ?? '';

    const takeValue = (): string => {
      const value = argv[index + 1];
      if (value === undefined || value === '') {
        throw new UsageError(`${arg} needs a value`);
      }
      index += 1;
      return value;
    };

    if (arg === '--help' || arg === '-h') {
      help = true;
      continue;
    }
    if (arg === '--apply') {
      apply = true;
      continue;
    }
    if (arg === '--scan-orphans') {
      scanOrphans = true;
      continue;
    }
    if (arg === '--project-root') {
      projectRoot = path.resolve(takeValue());
      continue;
    }
    if (arg === '--session') {
      sessionId = takeValue();
      continue;
    }
    if (arg === '--record') {
      recordPath = takeValue();
      continue;
    }
    if (arg === '--release') {
      releaseKey = takeValue();
      continue;
    }
    throw new UsageError(`Unknown argument: ${arg}`);
  }

  if (help) {
    return { mode: 'help' };
  }

  // A file or a missing path would let the scan report an empty state folder as
  // "nothing pending", which reads like a clean result, so refuse it in every mode.
  if (!fs.existsSync(projectRoot) || !fs.statSync(projectRoot).isDirectory()) {
    throw new UsageError(`--project-root is not a directory: ${projectRoot}`);
  }

  if (scanOrphans || releaseKey !== '') {
    if (scanOrphans && releaseKey !== '') {
      throw new UsageError('--scan-orphans and --release cannot be combined');
    }
    if (sessionId !== '' || recordPath !== '' || apply) {
      throw new UsageError('--scan-orphans and --release take no session, record or --apply');
    }
    return scanOrphans
      ? { mode: 'scan', projectRoot }
      : { mode: 'release', projectRoot, key: releaseKey };
  }

  if (sessionId === '') {
    throw new UsageError('--session is required');
  }
  if (recordPath === '') {
    throw new UsageError('--record is required');
  }

  // Every file path resolves against the project root, so the same argument
  // works from the repository root and from a packet subfolder.
  const resolvedRecord = path.resolve(projectRoot, recordPath);
  if (!fs.existsSync(resolvedRecord) || !fs.statSync(resolvedRecord).isFile()) {
    throw new UsageError(`No decision record at ${resolvedRecord}`);
  }

  return { mode: 'match', projectRoot, sessionId, recordPath: resolvedRecord, apply };
}

/**
 * Run the command and return its exit code.
 *
 * @param argv - Arguments after the script name
 * @returns 0 on success, 2 on a bad argument, 1 when a read or write fails
 */
export function main(argv: readonly string[]): number {
  let options: CliOptions;
  try {
    options = parseArgs(argv);
  } catch (error) {
    if (!(error instanceof UsageError)) {
      throw error;
    }
    process.stderr.write(`match-decision-table: ${error.message}\n\n${USAGE}\n`);
    return 2;
  }

  try {
    switch (options.mode) {
      case 'help':
        writeLine(USAGE);
        return 0;
      case 'scan':
        return runScan(options.projectRoot);
      case 'release':
        return runRelease(options.projectRoot, options.key);
      case 'match':
        return runMatch(options);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`match-decision-table: ${message}\n`);
    return 1;
  }
}

if (isMainModule(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
