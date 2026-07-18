// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Generation-Guarded Style Hydration                                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';

import { buildManifest } from './manifest.mjs';
import { compareRawStrings } from './ordering.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_HYDRATION_BYTES = 16 * 1024;
const MAX_HYDRATION_BYTES = 128 * 1024;
const HASH_PREFIX = 'sha256:';

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
  const styleRealPath = await realpath(path.join(corpusRoot, styleSlug));
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
  return { ok: false, error, ...(message ? { message } : {}) };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

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
  if (!manifest || !request || !options?.corpusRoot) {
    return failure('invalid-input');
  }
  const generationHash = request.generationHash ?? request.cardGenerationHash;
  if (!generationHash || generationHash !== manifest.generationHash) {
    return failure('generation-mismatch');
  }
  const mode = request.mode;
  const allowedIncludes = MODE_INCLUDES[mode];
  if (!allowedIncludes) return failure('invalid-mode');

  let liveManifest;
  try {
    liveManifest = await buildManifest(options.corpusRoot);
  } catch (error) {
    if (error.code === 'corpus-changing') return failure('generation-mismatch');
    throw error;
  }
  if (liveManifest.generationHash !== generationHash) {
    return failure('generation-mismatch');
  }
  const style = manifest.styles.find((candidate) => candidate.id === request.id);
  const liveStyle = liveManifest.styles.find((candidate) => candidate.id === request.id);
  if (!style) return failure('unavailable');
  const rightsStyle = liveStyle ?? style;
  if (request.usage === 'exact-reuse' && (
    rightsStyle.provenance?.rightsKnown !== true
    || !['allowed', 'licensed', 'public-domain'].includes(rightsStyle.provenance?.licenseStatus)
  )) {
    return failure('rights-restricted');
  }

  const selectedArtifacts = selectArtifacts(style, request, allowedIncludes);
  if (selectedArtifacts.length === 0) return failure('unavailable');
  const maxBytes = Math.min(
    MAX_HYDRATION_BYTES,
    Math.max(1, Number.isInteger(request.maxBytes) ? request.maxBytes : DEFAULT_HYDRATION_BYTES),
  );
  const corpusRealPath = await realpath(options.corpusRoot);
  const loaded = [];
  let totalBytes = 0;
  for (const artifact of selectedArtifacts) {
    let artifactRealPath;
    try {
      artifactRealPath = await resolveContainedArtifact(
        options.corpusRoot,
        corpusRealPath,
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
  return {
    ok: true,
    id: style.id,
    generationHash,
    mode,
    totalBytes,
    artifacts: loaded,
  };
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
