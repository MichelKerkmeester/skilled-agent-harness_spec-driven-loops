// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Style Database Migration Adapter                                         ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import { createHash } from 'node:crypto';
import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';

import { queryPersistentStyles, retrievalInternals } from '../_db/retrieval.mjs';
import {
  DEFAULT_STYLE_DATABASE_PATH,
  openStyleDatabase,
  resolvePublishedDatabasePath,
} from '../_db/schema.mjs';
import { modeIncludes } from './hydrate.mjs';

export const STYLE_DATABASE_MODES = Object.freeze(['legacy', 'shadow', 'persistent']);

export { DEFAULT_STYLE_DATABASE_PATH };
const DEFAULT_HYDRATION_BYTES = 16 * 1024;
const MAX_HYDRATION_BYTES = 128 * 1024;
const EXACT_REUSE_LICENSES = new Set(['allowed', 'licensed', 'public-domain']);
const HYDRATION_REQUEST_KEYS = new Set([
  'id',
  'generationHash',
  'cardGenerationHash',
  'mode',
  'includes',
  'maxBytes',
  'usage',
]);

function digest(buffer) {
  return `sha256:${createHash('sha256').update(buffer).digest('hex')}`;
}

function isContained(rootPath, candidatePath) {
  const relative = path.relative(rootPath, candidatePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function sliceUtf8(buffer, maxBytes) {
  if (buffer.byteLength <= maxBytes) return buffer.toString('utf8');
  let high = Math.min(buffer.byteLength, maxBytes);
  while (high > 0) {
    const text = buffer.subarray(0, high).toString('utf8');
    if (Buffer.byteLength(text, 'utf8') <= maxBytes) return text;
    high -= 1;
  }
  return '';
}

function persistentOptions(options) {
  return {
    ...(options.database ? { database: options.database } : {}),
    databasePath: options.databasePath ?? DEFAULT_STYLE_DATABASE_PATH,
  };
}

function deepFreeze(value, seen = new Set()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) deepFreeze(child, seen);
  return Object.freeze(value);
}

function snapshotHydrationRequest(request) {
  if (!request || typeof request !== 'object' || Array.isArray(request)) return false;
  const prototype = Object.getPrototypeOf(request);
  if (prototype !== Object.prototype && prototype !== null) return null;
  const keys = Reflect.ownKeys(request);
  if (keys.some((key) => typeof key !== 'string' || !HYDRATION_REQUEST_KEYS.has(key))) {
    return null;
  }
  if (keys.some((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(request, key);
    return descriptor?.enumerable !== true
      || !Object.hasOwn(descriptor, 'value')
      || Object.hasOwn(descriptor, 'get')
      || Object.hasOwn(descriptor, 'set');
  })) return null;
  const isValid = typeof request.id === 'string'
    && request.id.length > 0
    && typeof request.mode === 'string'
    && (request.generationHash === undefined || typeof request.generationHash === 'string')
    && (request.cardGenerationHash === undefined
      || typeof request.cardGenerationHash === 'string')
    && (request.includes === undefined || (
      Array.isArray(request.includes)
      && request.includes.every((item) => typeof item === 'string')
    ))
    && (request.maxBytes === undefined
      || (Number.isInteger(request.maxBytes) && request.maxBytes > 0))
    && (request.usage === undefined || ['reference', 'exact-reuse'].includes(request.usage));
  return isValid ? deepFreeze(structuredClone(request)) : null;
}

/**
 * Resolve the explicit migration mode while keeping the legacy engine default.
 *
 * @param {Object} [options] - Adapter controls.
 * @returns {'legacy'|'shadow'|'persistent'} Selected backend.
 */
export function resolveStyleDatabaseMode(options = {}) {
  const mode = options.styleDatabaseMode ?? process.env.SK_DESIGN_STYLE_DB_MODE ?? 'legacy';
  if (!STYLE_DATABASE_MODES.includes(mode)) {
    const error = new Error(`Unknown style database mode: ${mode}`);
    error.code = 'invalid-database-mode';
    throw error;
  }
  return mode;
}

function compareQueryResults(legacy, persistent) {
  const projectCard = (card) => ({
    id: card.id,
    title: card.title,
    thesis: card.thesis,
    capabilities: card.capabilities,
    availableSections: card.availableSections,
    tokenAxes: card.tokenAxes,
    provenance: card.provenance,
    estimatedHydrationBytes: card.estimatedHydrationBytes,
    warnings: card.warnings,
    scoreFields: Object.keys(card.score ?? {}).sort(),
  });
  const legacyCards = legacy.cards?.map(projectCard) ?? [];
  const persistentCards = persistent.cards?.map(projectCard) ?? [];
  const eligibilityMatches = JSON.stringify(legacy.eligibility) === JSON.stringify(
    persistent.eligibility,
  );
  const cardsMatch = JSON.stringify(legacyCards) === JSON.stringify(persistentCards);
  return {
    ok: legacy.ok === persistent.ok && eligibilityMatches && cardsMatch,
    eligibilityMatches,
    cardsMatch,
    legacyCards,
    persistentCards,
    persistentGenerationHash: persistent.generationHash,
    persistentRankingMode: persistent.rankingMode,
    toleratedDifferences: ['generationHash', 'contentHash', 'scoreValues', 'rankingMode'],
  };
}

/**
 * Route query traffic without allowing normal persistent reads to walk the corpus.
 *
 * @param {Object} request - Existing retrieval request.
 * @param {Object} options - Adapter and database controls.
 * @param {Function} runLegacy - Unchanged flat-file implementation.
 * @returns {Promise<Object>} Existing response shape with optional shadow evidence.
 */
export async function dispatchStyleQuery(request, options, runLegacy) {
  const mode = resolveStyleDatabaseMode(options);
  if (mode === 'legacy') return runLegacy(request, options);
  if (mode === 'persistent') return queryPersistentStyles(request, persistentOptions(options));
  const legacy = await runLegacy(request, options);
  try {
    const persistent = queryPersistentStyles(request, persistentOptions(options));
    return { ...legacy, shadow: compareQueryResults(legacy, persistent) };
  } catch (error) {
    return {
      ...legacy,
      shadow: { ok: false, error: error.code ?? 'internal-error', message: error.message },
    };
  }
}

/**
 * Hydrate DB-selected artifacts from authoritative flat files under all legacy guards.
 *
 * @param {Object} request - Existing hydration request.
 * @param {Object} options - Corpus and database paths.
 * @returns {Promise<Object>} Existing hydration success or refusal shape.
 */
export async function hydratePersistentStyle(request, options = {}) {
  const requestSnapshot = snapshotHydrationRequest(request);
  if (!requestSnapshot) {
    return { ok: false, error: 'invalid-input' };
  }
  request = requestSnapshot;
  const allowedIncludes = modeIncludes(request.mode);
  if (allowedIncludes.length === 0) return { ok: false, error: 'invalid-mode' };
  const database = options.database ?? openStyleDatabase(
    resolvePublishedDatabasePath(options.databasePath ?? DEFAULT_STYLE_DATABASE_PATH),
  );
  const ownsDatabase = !options.database;
  database.exec('BEGIN');
  try {
    let generation;
    try {
      generation = retrievalInternals.validateGeneration(database);
    } catch {
      database.exec('ROLLBACK');
      return { ok: false, error: 'manifest-stale' };
    }
    const requestedGeneration = request.generationHash ?? request.cardGenerationHash;
    if (requestedGeneration !== generation.generation_hash) {
      database.exec('ROLLBACK');
      return { ok: false, error: 'generation-mismatch' };
    }
    const style = database.prepare(`
      SELECT s.style_rowid, s.style_id, s.slug, p.license_status, p.rights_known
      FROM styles s JOIN style_provenance p ON p.style_rowid = s.style_rowid
      WHERE s.style_id = ? AND s.lifecycle_state = 'active'
    `).get(request.id);
    if (!style) {
      database.exec('ROLLBACK');
      return { ok: false, error: 'unavailable' };
    }
    if (request.usage === 'exact-reuse' && (
      Number(style.rights_known) !== 1 || !EXACT_REUSE_LICENSES.has(style.license_status)
    )) {
      database.exec('ROLLBACK');
      return { ok: false, error: 'rights-restricted' };
    }
    const requestedIncludes = Array.isArray(request.includes) && request.includes.length > 0
      ? request.includes.filter((name) => allowedIncludes.includes(name))
      : allowedIncludes;
    const artifacts = database.prepare(`
      SELECT relative_path, byte_length, sha256 FROM style_artifacts
      WHERE style_rowid = ? ORDER BY relative_path ASC
    `).all(style.style_rowid).filter((artifact) => requestedIncludes.some((name) => (
      artifact.relative_path.endsWith(`/${name}`)
    )));
    if (artifacts.length === 0) {
      database.exec('ROLLBACK');
      return { ok: false, error: 'unavailable' };
    }
    const corpusRoot = options.corpusRoot;
    if (!corpusRoot) {
      database.exec('ROLLBACK');
      return { ok: false, error: 'invalid-input' };
    }
    const corpusRealPath = await realpath(corpusRoot);
    const styleRealPath = await realpath(path.join(corpusRoot, style.slug));
    if (!isContained(corpusRealPath, styleRealPath)) {
      database.exec('ROLLBACK');
      return { ok: false, error: 'path-escape' };
    }
    const maxBytes = Math.min(
      MAX_HYDRATION_BYTES,
      Math.max(1, request.maxBytes ?? DEFAULT_HYDRATION_BYTES),
    );
    const loaded = [];
    let totalBytes = 0;
    for (const artifact of artifacts) {
      const candidatePath = path.resolve(corpusRoot, artifact.relative_path);
      const artifactRealPath = await realpath(candidatePath);
      if (!isContained(corpusRealPath, artifactRealPath)
        || !isContained(styleRealPath, artifactRealPath)) {
        database.exec('ROLLBACK');
        return { ok: false, error: 'path-escape' };
      }
      const buffer = await readFile(artifactRealPath);
      if (digest(buffer) !== artifact.sha256) {
        database.exec('ROLLBACK');
        return { ok: false, error: 'unavailable' };
      }
      const remainingBytes = maxBytes - totalBytes;
      if (remainingBytes <= 0) break;
      const content = sliceUtf8(buffer, remainingBytes);
      const outputBytes = Buffer.byteLength(content, 'utf8');
      loaded.push({
        path: artifact.relative_path,
        sha256: artifact.sha256,
        bytes: outputBytes,
        truncated: outputBytes < buffer.byteLength,
        content,
      });
      totalBytes += outputBytes;
    }
    database.exec('COMMIT');
    return {
      ok: true,
      id: style.style_id,
      generationHash: generation.generation_hash,
      mode: request.mode,
      totalBytes,
      artifacts: loaded,
    };
  } catch (error) {
    try {
      database.exec('ROLLBACK');
    } catch {
      // The refusal below remains stable even when SQLite already ended the snapshot.
    }
    if (['ENOENT', 'ENOTDIR'].includes(error.code)) return { ok: false, error: 'unavailable' };
    throw error;
  } finally {
    if (ownsDatabase) database.close();
  }
}

function compareHydrationResults(legacy, persistent) {
  if (!legacy.ok || !persistent.ok) {
    return {
      ok: legacy.ok === persistent.ok && legacy.error === persistent.error,
      legacyError: legacy.error ?? null,
      persistentError: persistent.error ?? null,
    };
  }
  const legacyProjection = {
    id: legacy.id,
    mode: legacy.mode,
    totalBytes: legacy.totalBytes,
    artifacts: legacy.artifacts,
  };
  const persistentProjection = {
    id: persistent.id,
    mode: persistent.mode,
    totalBytes: persistent.totalBytes,
    artifacts: persistent.artifacts,
  };
  return {
    ok: JSON.stringify(legacyProjection) === JSON.stringify(persistentProjection),
    legacyProjection,
    persistentProjection,
    persistentGenerationHash: persistent.generationHash ?? null,
    toleratedDifferences: ['generationHash'],
  };
}

/**
 * Route hydration through legacy, shadow, or persistent behavior.
 *
 * @param {Object} request - Existing hydration request.
 * @param {Object} options - Adapter controls.
 * @param {Function} runLegacy - Unchanged flat-file implementation.
 * @returns {Promise<Object>} Existing response shape with optional shadow evidence.
 */
export async function dispatchStyleHydrate(request, options, runLegacy) {
  const mode = resolveStyleDatabaseMode(options);
  if (mode === 'legacy') return runLegacy(request, options);
  if (mode === 'persistent') return hydratePersistentStyle(request, options);
  const legacy = await runLegacy(request, options);
  try {
    const database = options.database ?? openStyleDatabase(
      resolvePublishedDatabasePath(options.databasePath ?? DEFAULT_STYLE_DATABASE_PATH),
    );
    const ownsDatabase = !options.database;
    const currentGeneration = database.prepare(`
      SELECT generation_hash FROM current_corpus_generation WHERE singleton = 1
    `).get()?.generation_hash;
    if (ownsDatabase) database.close();
    const persistent = await hydratePersistentStyle({
      ...request,
      generationHash: currentGeneration,
      cardGenerationHash: undefined,
    }, options);
    return { ...legacy, shadow: compareHydrationResults(legacy, persistent) };
  } catch (error) {
    return {
      ...legacy,
      shadow: { ok: false, error: error.code ?? 'internal-error', message: error.message },
    };
  }
}
