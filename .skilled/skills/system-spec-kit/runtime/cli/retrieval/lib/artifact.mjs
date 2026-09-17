// ───────────────────────────────────────────────────────────────────
// MODULE: Deterministic Artifact Serialization
// ───────────────────────────────────────────────────────────────────
// JSON.stringify orders integer-like object keys ahead of everything else, and
// several trigram windows are integer-like ("123"). A hand-rolled writer keeps
// one invariant instead — every object's keys are in code-unit order — which is
// what makes `stableStringify(JSON.parse(text)) === text` a usable validation
// of a freshly written artifact.
// ───────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { compareCodeUnits } from './normalize.mjs';

const INDENT = '  ';

// ───────────────────────────────────────────────────────────────────
// 1. SERIALIZATION
// ───────────────────────────────────────────────────────────────────

/**
 * Serializes a value the way `JSON.stringify(value, null, 2)` formats it, but
 * with every object's keys sorted by code unit.
 *
 * @param {unknown} value Plain JSON-compatible value.
 * @returns {string} Deterministic JSON text without a trailing newline.
 */
export function stableStringify(value) {
  /** @type {string[]} */
  const chunks = [];
  writeValue(value, 0, chunks);
  return chunks.join('');
}

/**
 * @param {unknown} value Value to emit.
 * @param {number} depth Current indent depth.
 * @param {string[]} chunks Output accumulator.
 * @returns {void}
 */
function writeValue(value, depth, chunks) {
  if (value === null || typeof value !== 'object') {
    chunks.push(JSON.stringify(value === undefined ? null : value));
    return;
  }

  const pad = INDENT.repeat(depth);
  const padInner = INDENT.repeat(depth + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) {
      chunks.push('[]');
      return;
    }
    chunks.push('[\n');
    for (let i = 0; i < value.length; i += 1) {
      chunks.push(padInner);
      writeValue(value[i], depth + 1, chunks);
      chunks.push(i === value.length - 1 ? '\n' : ',\n');
    }
    chunks.push(`${pad}]`);
    return;
  }

  const keys = Object.keys(value).sort(compareCodeUnits);
  if (keys.length === 0) {
    chunks.push('{}');
    return;
  }
  chunks.push('{\n');
  for (let i = 0; i < keys.length; i += 1) {
    chunks.push(padInner, JSON.stringify(keys[i]), ': ');
    writeValue(value[keys[i]], depth + 1, chunks);
    chunks.push(i === keys.length - 1 ? '\n' : ',\n');
  }
  chunks.push(`${pad}}`);
}

// ───────────────────────────────────────────────────────────────────
// 2. HASHING
// ───────────────────────────────────────────────────────────────────

/**
 * @param {string | Buffer} data Content to digest.
 * @returns {string} Lowercase hex SHA-256.
 */
export function sha256(data) {
  return createHash('sha256').update(data).digest('hex');
}

// ───────────────────────────────────────────────────────────────────
// 3. PUBLICATION
// ───────────────────────────────────────────────────────────────────

/**
 * Writes a JSON artifact through a same-directory temporary file, re-reads and
 * validates it, then renames over the target. A failure at any step removes the
 * temporary file and leaves the previous artifact in place, because a rename
 * within one directory is the only step that is atomic.
 *
 * @param {string} targetPath Absolute destination path.
 * @param {unknown} value Value to serialize.
 * @param {(parsed: unknown, text: string) => void} [validate] Throws to abort publication.
 * @returns {{ bytes: number, sha256: string, text: string }} Published artifact facts.
 */
export function publishJson(targetPath, value, validate) {
  const directory = path.dirname(targetPath);
  fs.mkdirSync(directory, { recursive: true });

  const text = `${stableStringify(value)}\n`;
  const temporaryPath = path.join(directory, `.${path.basename(targetPath)}.tmp-${process.pid}`);

  try {
    fs.writeFileSync(temporaryPath, text, 'utf8');

    const readBack = fs.readFileSync(temporaryPath, 'utf8');
    if (readBack !== text) {
      throw new Error(`temporary artifact did not round-trip: ${temporaryPath}`);
    }
    const parsed = JSON.parse(readBack);
    if (`${stableStringify(parsed)}\n` !== readBack) {
      throw new Error(`temporary artifact is not in canonical form: ${temporaryPath}`);
    }
    if (validate) validate(parsed, readBack);

    fs.renameSync(temporaryPath, targetPath);
    return { bytes: Buffer.byteLength(text), sha256: sha256(text), text };
  } catch (error) {
    try {
      fs.rmSync(temporaryPath, { force: true });
    } catch {
      // The temporary file is best-effort cleanup; the publication failure is
      // the error worth surfacing.
    }
    throw error;
  }
}

// ───────────────────────────────────────────────────────────────────
// TRIGGER INDEX SHAPE
// ───────────────────────────────────────────────────────────────────

/** Schema the committed trigger index is written and read at. */
export const TRIGGER_INDEX_SCHEMA_VERSION = 2;

/**
 * Structural invariant of a trigger index, shared by the generator's publish
 * gate and the reader's load gate so both ends refuse the same shapes. A
 * posting is a subscript into the path table, so a non-array posting, an empty
 * posting, or an out-of-range id would resolve to the wrong document or drop a
 * result silently at lookup time; a parseable artifact that violates this is a
 * corrupt artifact, and the only safe answer is to refuse it and regenerate.
 *
 * @param {unknown} parsed Artifact as parsed from JSON.
 * @param {string} [label] Name used in error messages.
 * @returns {{ paths: string[], phrases: Record<string, number[]> }} The validated tables.
 */
export function assertTriggerIndexShape(parsed, label = 'index') {
  if (!parsed || typeof parsed !== 'object') throw new Error(`${label} did not parse as an object`);
  const candidate = /** @type {Record<string, unknown>} */ (parsed);

  if (candidate.schemaVersion !== TRIGGER_INDEX_SCHEMA_VERSION) {
    throw new Error(
      `${label} schemaVersion is ${String(candidate.schemaVersion)}, expected ${TRIGGER_INDEX_SCHEMA_VERSION}`,
    );
  }
  if (!candidate.normalization || typeof candidate.normalization !== 'object') {
    throw new Error(`${label} is missing its normalization block`);
  }
  const paths = candidate.paths;
  const phrases = candidate.phrases;
  if (!Array.isArray(paths)) throw new Error(`${label} is missing its path table`);
  if (!phrases || typeof phrases !== 'object' || Array.isArray(phrases)) {
    throw new Error(`${label} is missing its phrases map`);
  }
  for (const [id, documentPath] of paths.entries()) {
    if (typeof documentPath !== 'string' || documentPath.length === 0) {
      throw new Error(`${label} path table entry ${id} is not a path`);
    }
  }
  for (const [normalized, posting] of Object.entries(phrases)) {
    if (!Array.isArray(posting)) throw new Error(`${label} phrase posting is not an array: ${normalized}`);
    if (posting.length === 0) throw new Error(`${label} phrase entry ${normalized} has no owning path`);
    for (const id of posting) {
      if (!Number.isInteger(id) || id < 0 || id >= paths.length) {
        throw new Error(`${label} phrase entry ${normalized} references path id ${String(id)} outside the table`);
      }
    }
  }
  return { paths: /** @type {string[]} */ (paths), phrases: /** @type {Record<string, number[]>} */ (phrases) };
}
