// ───────────────────────────────────────────────────────────────────
// MODULE: Divergent Pivot IO
// ───────────────────────────────────────────────────────────────────

// Mode-neutral read and text helpers shared by the research and review pivot
// input builders. Not part of any barrel; mode-specific candidate shaping stays
// in each mode's script.

import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import type { PivotCandidate } from './pivot-candidates.js';

/** Plain JSON object read from a pivot input file. */
export type JsonRecord = Record<string, unknown>;

// ───────────────────────────────────────────────────────────────────
// 1. TEXT HELPERS
// ───────────────────────────────────────────────────────────────────

/** True for a non-null, non-array object. */
export function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Collapse whitespace in a string value; any other value becomes ''. */
export function normalizeText(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/gu, ' ').trim() : '';
}

/** Comparison key: normalized text, NFKC-folded and lower-cased. */
export function normalizedKey(value: unknown): string {
  return normalizeText(value).normalize('NFKC').toLowerCase();
}

/** Stable sha256 fingerprint of a title and focus pair. */
export function fingerprint(title: string, focus: string): string {
  return createHash('sha256')
    .update(`${normalizedKey(title)}|${normalizedKey(focus)}`)
    .digest('hex');
}

// ───────────────────────────────────────────────────────────────────
// 2. FILE READERS
// ───────────────────────────────────────────────────────────────────

/** Read a JSON file that must hold an object; throws otherwise. */
export function readJson(path: string): JsonRecord {
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as unknown;
  if (!isRecord(parsed)) {
    throw new TypeError(`${path} must contain a JSON object.`);
  }
  return parsed;
}

/** Read a JSONL file of objects; a missing file reads as empty, a bad line throws with its line number. */
export function readJsonl(path: string): JsonRecord[] {
  if (!existsSync(path)) return [];
  return readFileSync(path, 'utf8')
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        const parsed = JSON.parse(line) as unknown;
        if (!isRecord(parsed)) throw new TypeError('record must be a JSON object');
        return parsed;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Invalid JSONL at ${path}:${index + 1}: ${message}`);
      }
    });
}

/** Every prior pivot's council state events, in pivot-directory name order. */
export function readPivotEvents(artifactRoot: string): JsonRecord[] {
  const pivotsRoot = join(artifactRoot, 'divergent', 'pivots');
  if (!existsSync(pivotsRoot)) return [];
  return readdirSync(pivotsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((entry) => readJsonl(join(pivotsRoot, entry.name, 'council', 'state.jsonl')));
}

// ───────────────────────────────────────────────────────────────────
// 3. CANDIDATE HELPERS
// ───────────────────────────────────────────────────────────────────

/** Drop repeat candidates by id plus normalized fingerprint, keeping the first. */
export function uniqueCandidates(candidates: readonly PivotCandidate[]): PivotCandidate[] {
  const seen = new Set<string>();
  return candidates.filter((candidate) => {
    const key = `${candidate.id}|${normalizedKey(candidate.fingerprint)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
