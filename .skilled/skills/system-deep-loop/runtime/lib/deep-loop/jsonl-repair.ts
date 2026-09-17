// MODULE: Deep-Loop JSONL Repair

import {
  appendFileSync,
  closeSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { randomUUID } from 'node:crypto';

const require = createRequire(import.meta.url);
const { acquireWriterLock } = require('../../scripts/lib/cli-guards.cjs') as {
  acquireWriterLock: (lockPath: string) => () => void;
};

// ───── TYPE DEFINITIONS ─────

export type JsonlRepairResult = {
  repaired: boolean;
  droppedBytes: number;
};

type JsonlRecord = Record<string, unknown>;

// ───── HELPERS ─────

function byteLength(value: string): number {
  return Buffer.byteLength(value, 'utf8');
}

type JsonlLineSpan = {
  raw: string;
  terminator: string;
};

/**
 * Split content into line spans (raw text + its original terminator). A
 * trailing chunk with no terminator (partial write) is included as a final
 * span with terminator ''.
 */
function splitJsonlLines(content: string): JsonlLineSpan[] {
  const spans: JsonlLineSpan[] = [];
  const newlineMatch = /\r?\n/g;
  let cursor = 0;

  while (cursor < content.length) {
    newlineMatch.lastIndex = cursor;
    const match = newlineMatch.exec(content);
    if (!match) {
      break;
    }
    spans.push({ raw: content.slice(cursor, match.index), terminator: match[0] });
    cursor = match.index + match[0].length;
  }

  if (cursor < content.length) {
    spans.push({ raw: content.slice(cursor), terminator: '' });
  }

  return spans;
}

function isValidJsonlLine(raw: string): boolean {
  if (raw.trim() === '') {
    return true;
  }
  try {
    JSON.parse(raw);
    return true;
  } catch {
    return false;
  }
}

/**
 * Quarantine only the malformed line spans and keep every valid one,
 * including valid records that appear after a corrupt line. Returns null
 * when nothing needs repair.
 */
function repairedJsonlContent(content: string): { content: string; droppedBytes: number } | null {
  const spans = splitJsonlLines(content);
  const keptSpans: JsonlLineSpan[] = [];
  let droppedAny = false;

  for (const span of spans) {
    if (isValidJsonlLine(span.raw)) {
      keptSpans.push(span);
    } else {
      droppedAny = true;
    }
  }

  if (!droppedAny) {
    return null;
  }

  const repairedText = keptSpans.map((span) => `${span.raw}${span.terminator}`).join('');
  const droppedBytes = byteLength(content) - byteLength(repairedText);
  if (droppedBytes <= 0) {
    return null;
  }

  return { content: repairedText, droppedBytes };
}

function readJsonlRecords(path: string): JsonlRecord[] {
  if (!existsSync(path)) {
    return [];
  }

  const content = readFileSync(path, 'utf8');
  if (content.trim() === '') {
    return [];
  }

  return content
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .map((line) => JSON.parse(line) as JsonlRecord);
}

function nestedEventId(record: JsonlRecord): unknown {
  const event = record['event'];
  if (!event || typeof event !== 'object' || Array.isArray(event)) {
    return undefined;
  }
  return (event as JsonlRecord)['id'];
}

function stableRecordIdentity(record: JsonlRecord): string {
  const identityParts = [
    record['type'],
    record['iteration'],
    record['focus'],
    record['id'] ?? nestedEventId(record),
  ];
  if (identityParts.every((part) => part === undefined || part === null)) {
    return `json:${JSON.stringify(record)}`;
  }
  return `key:${identityParts.map((part) => JSON.stringify(part ?? null)).join('|')}`;
}

function dedupeRecords(records: JsonlRecord[]): JsonlRecord[] {
  const seen = new Set<string>();
  const deduped: JsonlRecord[] = [];

  for (const record of records) {
    const identity = stableRecordIdentity(record);
    if (seen.has(identity)) {
      continue;
    }
    seen.add(identity);
    deduped.push(record);
  }

  return deduped;
}

function mergeRecords(existingRecords: JsonlRecord[], incomingRecords: JsonlRecord[]): JsonlRecord[] {
  return dedupeRecords([...existingRecords, ...incomingRecords]);
}

function fsyncPath(path: string): void {
  let fd: number | undefined;
  try {
    fd = openSync(path, 'r');
    fsyncSync(fd);
  } finally {
    if (typeof fd === 'number') {
      closeSync(fd);
    }
  }
}

function writeRawContentAtomic(path: string, content: string): void {
  mkdirSync(dirname(path), { recursive: true });
  const tempPath = `${path}.tmp.${process.pid}.${Date.now()}.${randomUUID()}`;

  try {
    writeFileSync(tempPath, content, 'utf8');
    fsyncPath(tempPath);
    renameSync(tempPath, path);
    try {
      fsyncPath(dirname(path));
    } catch {
    }
  } catch (err) {
    rmSync(tempPath, { force: true });
    throw err;
  }
}

function writeJsonlRecordsAtomic(path: string, records: JsonlRecord[]): void {
  const content = records.length > 0
    ? `${records.map((record) => JSON.stringify(record)).join('\n')}\n`
    : '';
  writeRawContentAtomic(path, content);
}

// ───── EXPORTS ─────

/**
 * Repair a JSONL file by quarantining malformed lines.
 *
 * Scans every line (not just the tail): a blank or parseable line is kept
 * as-is, a malformed line is dropped, and the scan continues past it so a
 * single corrupt line never discards the valid records that follow it.
 *
 * @param path - Path to the JSONL file.
 * @returns Repair result with whether repair occurred and bytes dropped.
 */
export function repairJsonlTail(path: string): JsonlRepairResult {
  if (!existsSync(path)) {
    return { repaired: false, droppedBytes: 0 };
  }

  const content = readFileSync(path, 'utf8');
  if (content.length === 0) {
    return { repaired: false, droppedBytes: 0 };
  }

  const repair = repairedJsonlContent(content);
  if (!repair) {
    return { repaired: false, droppedBytes: 0 };
  }

  writeRawContentAtomic(path, repair.content);
  return { repaired: true, droppedBytes: repair.droppedBytes };
}

/**
 * Append a JSON record as a new JSONL line.
 *
 * Takes the same writer lock `mergeJsonlUnderLock` uses so a plain append
 * can never land in the window between a merge's read and its atomic
 * rewrite, where it would otherwise be silently discarded.
 *
 * @param path - Path to the JSONL file.
 * @param record - Object to serialize and append.
 */
export function appendJsonlRecord(path: string, record: Record<string, unknown>): void {
  const releaseWriterLock = acquireWriterLock(`${path}.lock`);
  try {
    appendFileSync(path, `${JSON.stringify(record)}\n`, { encoding: 'utf8', flag: 'a' });
  } finally {
    releaseWriterLock();
  }
}

/**
 * Merge JSONL records under an exclusive writer lock.
 *
 * Incoming records are deduplicated before the critical section; the current
 * file is reread while holding the lock so racing writers converge instead of
 * overwriting each other.
 *
 * @param path - Path to the JSONL file.
 * @param incomingRecords - Records to union into the file.
 */
export function mergeJsonlUnderLock(path: string, incomingRecords: Array<Record<string, unknown>>): void {
  const uniqueIncomingRecords = dedupeRecords(incomingRecords);
  if (uniqueIncomingRecords.length === 0) {
    return;
  }

  mkdirSync(dirname(path), { recursive: true });
  const releaseWriterLock = acquireWriterLock(`${path}.lock`);
  try {
    repairJsonlTail(path);
    const currentRecords = readJsonlRecords(path);
    const mergedRecords = mergeRecords(currentRecords, uniqueIncomingRecords);
    const latestRecords = readJsonlRecords(path);
    writeJsonlRecordsAtomic(path, mergeRecords(latestRecords, mergedRecords));
  } finally {
    releaseWriterLock();
  }
}
