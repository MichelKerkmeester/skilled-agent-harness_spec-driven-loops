// ───────────────────────────────────────────────────────────────
// MODULE: Deep-Loop JSONL Repair
// ───────────────────────────────────────────────────────────────

import { appendFileSync, existsSync, readFileSync, truncateSync } from 'node:fs';

export type JsonlRepairResult = {
  repaired: boolean;
  droppedBytes: number;
};

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

export function appendJsonlRecord(path: string, record: Record<string, unknown>): void {
  appendFileSync(path, `${JSON.stringify(record)}\n`, { encoding: 'utf8', flag: 'a' });
}
