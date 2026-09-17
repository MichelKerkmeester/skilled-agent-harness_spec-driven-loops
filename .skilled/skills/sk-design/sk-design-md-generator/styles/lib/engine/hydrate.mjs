// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Generation-Guarded Style Hydration                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';

import {
  MANIFEST_ERROR_CODES,
  buildManifest,
  isManifestBuildError,
  serializeManifest,
  snapshotManifest,
} from './manifest.mjs';
import { compareRawStrings } from './ordering.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_HYDRATION_BYTES = 16 * 1024;
const MAX_HYDRATION_BYTES = 128 * 1024;
const HASH_PREFIX = 'sha256:';
const HYDRATION_REQUEST_KEYS = Object.freeze([
  'id',
  'generationHash',
  'cardGenerationHash',
  'mode',
  'includes',
  'maxBytes',
  'usage',
]);
const HYDRATION_USAGES = Object.freeze(['reference', 'exact-reuse']);
const HYDRATION_FAILURE_CODES = Object.freeze([
  'generation-mismatch',
  'invalid-input',
  'invalid-mode',
  'manifest-stale',
  'path-escape',
  'rights-restricted',
  'unavailable',
]);
const VERIFIED_BINDINGS = new WeakSet();

const MODE_INCLUDES = Object.freeze({
  interface: ['DESIGN.md', 'source.md'],
  foundations: ['design-tokens.json', 'DESIGN.md', 'source.md'],
  motion: ['DESIGN.md', 'source.md'],
  audit: ['DESIGN.md', 'design-tokens.json', 'source.md'],
  'md-generator': ['DESIGN.md', 'source.md'],
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. PATH AND BYTE GUARDS
// ─────────────────────────────────────────────────────────────────────────────

function digest(buffer) {
  return `${HASH_PREFIX}${createHash('sha256').update(buffer).digest('hex')}`;
}

function isContained(rootPath, candidatePath) {
  const relative = path.relative(rootPath, candidatePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function hasTraversal(artifactPath) {
  return path.isAbsolute(artifactPath)
    || artifactPath.split(/[\\/]+/).some((segment) => segment === '..');
}

async function resolveContainedArtifact(
  corpusRoot,
  corpusRealPath,
  styleSlug,
  artifactPath,
) {
  if (
    typeof artifactPath !== 'string'
    || hasTraversal(artifactPath)
    || !artifactPath.startsWith(`${styleSlug}/`)
  ) {
    const error = new Error('Hydration artifact path escapes the corpus root.');
    error.code = 'path-escape';
    throw error;
  }
  let styleRealPath;
  try {
    styleRealPath = await realpath(path.join(corpusRoot, styleSlug));
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
      const unavailable = new Error(`Hydration style is unavailable: ${styleSlug}`);
      unavailable.code = 'unavailable';
      throw unavailable;
    }
    throw error;
  }
  const candidatePath = path.resolve(corpusRoot, artifactPath);
  let candidateRealPath;
  try {
    candidateRealPath = await realpath(candidatePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const unavailable = new Error(`Hydration artifact is unavailable: ${artifactPath}`);
      unavailable.code = 'unavailable';
      throw unavailable;
    }
    throw error;
  }
  if (
    !isContained(corpusRealPath, candidateRealPath)
    || !isContained(styleRealPath, candidateRealPath)
  ) {
    const error = new Error('Hydration artifact path escapes the corpus root.');
    error.code = 'path-escape';
    throw error;
  }
  return candidateRealPath;
}

function sliceUtf8(buffer, maxBytes) {
  if (buffer.byteLength <= maxBytes) return buffer.toString('utf8');
  let low = 0;
  let high = Math.min(buffer.byteLength, maxBytes);
  let best = '';
  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    const candidate = buffer.subarray(0, middle).toString('utf8');
    const candidateBytes = Buffer.byteLength(candidate, 'utf8');
    if (candidateBytes <= maxBytes) {
      best = candidate;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }
  return best;
}

function selectArtifacts(style, request, allowedIncludes) {
  const requestedIncludes = Array.isArray(request.includes) && request.includes.length > 0
    ? request.includes
    : allowedIncludes;
  const permitted = new Set(allowedIncludes);
  const selectedNames = requestedIncludes.filter((name) => permitted.has(name));
  return style.artifacts
    .filter((artifact) => selectedNames.some((name) => (
      artifact.path === name || artifact.path.endsWith(`/${name}`)
    )))
    .sort((left, right) => compareRawStrings(left.path, right.path));
}

function failure(error, message = null) {
  if (!HYDRATION_FAILURE_CODES.includes(error)) {
    throw new TypeError(`Unknown hydration failure code: ${error}`);
  }
  return Object.freeze({ ok: false, error, ...(message ? { message } : {}) });
}

function isPlainDataObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) return false;
  return Reflect.ownKeys(value).every((key) => {
    if (typeof key !== 'string' || !HYDRATION_REQUEST_KEYS.includes(key)) return false;
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    return descriptor?.enumerable === true && Object.hasOwn(descriptor, 'value');
  });
}

function deepFreeze(value, seen = new Set()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) deepFreeze(child, seen);
  return Object.freeze(value);
}

function snapshotRequest(request) {
  if (!isPlainDataObject(request)
    || typeof request.id !== 'string'
    || request.id.length === 0
    || typeof request.mode !== 'string'
    || (request.generationHash !== undefined && typeof request.generationHash !== 'string')
    || (request.cardGenerationHash !== undefined
      && typeof request.cardGenerationHash !== 'string')
    || (request.includes !== undefined
      && (!Array.isArray(request.includes)
        || !request.includes.every((item) => typeof item === 'string')))
    || (request.maxBytes !== undefined
      && (!Number.isInteger(request.maxBytes) || request.maxBytes <= 0))
    || (request.usage !== undefined && !HYDRATION_USAGES.includes(request.usage))) {
    return null;
  }
  return deepFreeze(structuredClone(request));
}

function normalizeBindingError(error) {
  if (!isManifestBuildError(error)) throw error;
  if (error.code === MANIFEST_ERROR_CODES.CORPUS_CHANGING) {
    return failure('generation-mismatch');
  }
  if (error.code === MANIFEST_ERROR_CODES.PATH_ESCAPE) return failure('path-escape');
  if (error.code === MANIFEST_ERROR_CODES.UNAVAILABLE) return failure('unavailable');
  if (error.code === MANIFEST_ERROR_CODES.INVALID_MANIFEST) return failure('manifest-stale');
  return failure('unavailable');
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Bind a closed manifest snapshot to a freshly derived corpus snapshot.
 *
 * @param {Object} manifest - Checked retrieval manifest.
 * @param {Object} request - Closed hydration request.
 * @param {Object} options - Corpus path.
 * @param {string} options.corpusRoot - Styles corpus root.
 * @returns {Promise<Object>} Immutable verified binding or a stable refusal.
 */
export async function bindHydrationManifest(manifest, request, options) {
  if (!manifest || !options?.corpusRoot) return failure('invalid-input');
  const requestSnapshot = snapshotRequest(request);
  if (!requestSnapshot) return failure('invalid-input');

  let committedManifest;
  try {
    committedManifest = snapshotManifest(manifest);
  } catch (error) {
    return normalizeBindingError(error);
  }
  const generationHash = requestSnapshot.generationHash
    ?? requestSnapshot.cardGenerationHash;
  if (!generationHash || generationHash !== committedManifest.generationHash) {
    return failure('generation-mismatch');
  }
  const allowedIncludes = MODE_INCLUDES[requestSnapshot.mode];
  if (!allowedIncludes) return failure('invalid-mode');

  const committedStyle = committedManifest.styles.find(
    (candidate) => candidate.id === requestSnapshot.id,
  );
  if (!committedStyle) return failure('unavailable');
  const selectedArtifacts = selectArtifacts(
    committedStyle,
    requestSnapshot,
    allowedIncludes,
  );
  if (selectedArtifacts.length === 0) return failure('unavailable');

  let corpusRealPath;
  try {
    corpusRealPath = await realpath(options.corpusRoot);
    for (const artifact of selectedArtifacts) {
      await resolveContainedArtifact(
        options.corpusRoot,
        corpusRealPath,
        committedStyle.slug,
        artifact.path,
      );
    }
  } catch (error) {
    if (error.code === 'path-escape' || error.code === 'unavailable') {
      return failure(error.code, error.message);
    }
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return failure('unavailable');
    throw error;
  }

  let liveManifest;
  try {
    liveManifest = await buildManifest(options.corpusRoot);
  } catch (error) {
    return normalizeBindingError(error);
  }
  if (serializeManifest(liveManifest) !== serializeManifest(committedManifest)) {
    return failure('manifest-stale');
  }
  const binding = deepFreeze({
    corpusRealPath,
    generationHash,
    request: requestSnapshot,
    committedManifest,
    liveManifest,
  });
  VERIFIED_BINDINGS.add(binding);
  return Object.freeze({ ok: true, binding });
}

/**
 * Hydrate only from an unforgeable binding created from the live corpus.
 *
 * @param {Object} binding - Verified immutable hydration binding.
 * @param {Object} options - Corpus path.
 * @param {string} options.corpusRoot - Styles corpus root.
 * @returns {Promise<Object>} Hydration result or a stable refusal shape.
 */
export async function hydrateBoundStyle(binding, options) {
  if (!VERIFIED_BINDINGS.has(binding) || !options?.corpusRoot) {
    return failure('invalid-input');
  }
  let currentCorpusRealPath;
  try {
    currentCorpusRealPath = await realpath(options.corpusRoot);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return failure('unavailable');
    throw error;
  }
  if (currentCorpusRealPath !== binding.corpusRealPath) return failure('path-escape');

  const { request, liveManifest, generationHash } = binding;
  const style = liveManifest.styles.find((candidate) => candidate.id === request.id);
  if (!style) return failure('unavailable');
  if (request.usage === 'exact-reuse' && (
    style.provenance?.rightsKnown !== true
    || !['allowed', 'licensed', 'public-domain'].includes(style.provenance?.licenseStatus)
  )) {
    return failure('rights-restricted');
  }

  const allowedIncludes = MODE_INCLUDES[request.mode];
  const selectedArtifacts = selectArtifacts(style, request, allowedIncludes);
  const maxBytes = Math.min(
    MAX_HYDRATION_BYTES,
    Math.max(1, request.maxBytes ?? DEFAULT_HYDRATION_BYTES),
  );
  const loaded = [];
  let totalBytes = 0;
  for (const artifact of selectedArtifacts) {
    let artifactRealPath;
    try {
      artifactRealPath = await resolveContainedArtifact(
        options.corpusRoot,
        binding.corpusRealPath,
        style.slug,
        artifact.path,
      );
    } catch (error) {
      if (error.code === 'path-escape' || error.code === 'unavailable') {
        return failure(error.code, error.message);
      }
      throw error;
    }
    const buffer = await readFile(artifactRealPath);
    if (digest(buffer) !== artifact.sha256) return failure('unavailable');
    const remainingBytes = maxBytes - totalBytes;
    if (remainingBytes <= 0) break;
    const content = sliceUtf8(buffer, remainingBytes);
    const outputBytes = Buffer.byteLength(content, 'utf8');
    loaded.push({
      path: artifact.path,
      sha256: artifact.sha256,
      bytes: outputBytes,
      truncated: outputBytes < buffer.byteLength,
      content,
    });
    totalBytes += outputBytes;
  }
  return deepFreeze({
    ok: true,
    id: style.id,
    generationHash,
    mode: request.mode,
    totalBytes,
    artifacts: loaded,
  });
}

/**
 * Hydrate permitted artifacts only when the card and live corpus share a generation.
 *
 * @param {Object} manifest - Checked retrieval manifest.
 * @param {Object} request - Selected id, generation, mode, includes, and byte cap.
 * @param {Object} options - Corpus path and optional build controls.
 * @param {string} options.corpusRoot - Styles corpus root.
 * @returns {Promise<Object>} Hydration result or a stable refusal shape.
 */
export async function hydrateStyle(manifest, request, options) {
  const bound = await bindHydrationManifest(manifest, request, options);
  if (!bound.ok) {
    return bound.error === 'manifest-stale' ? failure('unavailable') : bound;
  }
  return hydrateBoundStyle(bound.binding, options);
}

/**
 * Return the immutable include allowlist for a mode.
 *
 * @param {string} mode - Consumer mode.
 * @returns {string[]} Permitted artifact basenames.
 */
export function modeIncludes(mode) {
  return [...(MODE_INCLUDES[mode] ?? [])];
}
