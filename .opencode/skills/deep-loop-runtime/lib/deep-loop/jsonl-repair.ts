// MODULE: Deep-Loop JSONL Repair

import { appendFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, truncateSync, writeFileSync } from 'node:fs';
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

function newlineLengthAt(content: string, index: number): number {
  if (content[index] === '\r' && content[index + 1] === '\n') {
    return 2;
  }
  return 1;
}

function validPrefixByteLength(content: string): number {
  let cursor = 0;
  let validEnd = 0;

  while (cursor < content.length) {
    const newlineMatch = /\r?\n/g;
    newlineMatch.lastIndex = cursor;
    const match = newlineMatch.exec(content);
    if (!match) {
      break;
    }

    const lineEnd = match.index;
    const rawLine = content.slice(cursor, lineEnd);
    const nextCursor = lineEnd + newlineLengthAt(content, lineEnd);

    if (rawLine.trim() !== '') {
      try {
        JSON.parse(rawLine);
      } catch {
        break;
      }
    }

    validEnd = nextCursor;
    cursor = nextCursor;
  }

  const trailing = content.slice(cursor);
  if (trailing.trim() === '') {
    return byteLength(content);
  }

  try {
    JSON.parse(trailing);
    return byteLength(content);
  } catch {
    return byteLength(content.slice(0, validEnd));
  }
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

function writeJsonlRecordsAtomic(path: string, records: JsonlRecord[]): void {
  mkdirSync(dirname(path), { recursive: true });
  const tempPath = `${path}.tmp.${process.pid}.${Date.now()}.${randomUUID()}`;
  const content = records.length > 0
    ? `${records.map((record) => JSON.stringify(record)).join('\n')}\n`
    : '';

  try {
    writeFileSync(tempPath, content, 'utf8');
    renameSync(tempPath, path);
  } catch (err) {
    rmSync(tempPath, { force: true });
    throw err;
  }
}

// ───── EXPORTS ─────

/**
 * Repair a JSONL file by truncating any trailing malformed content.
 *
 * Scans from the beginning, keeps all complete valid JSON lines,
 * and truncates anything after the last valid record.
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

  const originalBytes = byteLength(content);
  const keepBytes = validPrefixByteLength(content);
  const droppedBytes = originalBytes - keepBytes;

  if (droppedBytes <= 0) {
    return { repaired: false, droppedBytes: 0 };
  }

  truncateSync(path, keepBytes);
  return { repaired: true, droppedBytes };
}

/**
 * Append a JSON record as a new JSONL line.
 *
 * @param path - Path to the JSONL file.
 * @param record - Object to serialize and append.
 */
export function appendJsonlRecord(path: string, record: Record<string, unknown>): void {
  appendFileSync(path, `${JSON.stringify(record)}\n`, { encoding: 'utf8', flag: 'a' });
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
    writeJsonlRecordsAtomic(path, mergeRecords(currentRecords, uniqueIncomingRecords));
  } finally {
    releaseWriterLock();
  }
}
