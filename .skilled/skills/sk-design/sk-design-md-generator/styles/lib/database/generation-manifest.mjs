// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Versioned Multi-Artifact Generation Manifest                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// A generation's published state is a single content-addressed pointer that can
// span more than one immutable artifact (the SQLite projection plus, when they
// exist, screenshot features, model profiles, and an optional index). Publishing
// is one atomic pointer flip; a reader either sees the whole prior manifest or
// the whole new one, never a torn mixture. Legacy single-file pointers still
// resolve so older publishers keep opening.

import {
  existsSync,
  readFileSync,
  realpathSync,
} from 'node:fs';
import { open, readFile, rename, rm } from 'node:fs/promises';
import path from 'node:path';

import { digest } from './canonical.mjs';

export const MANIFEST_VERSION = 1;
export const LEGACY_POINTER_VERSION = 1;

// Roles the manifest may span. `sqlite` is mandatory today; the rest are
// optional and additive so a sqlite-only publisher stays byte-compatible.
export const MANIFEST_ARTIFACT_ROLES = Object.freeze([
  'sqlite',
  'screenshotFeatures',
  'modelProfiles',
  'index',
]);

const ARTIFACT_SIDECAR_SUFFIXES = Object.freeze(['', '-wal', '-shm']);

function manifestError(code, message, cause) {
  const error = cause ? new Error(message, { cause }) : new Error(message);
  error.code = code;
  return error;
}

function isContained(rootPath, candidatePath) {
  const relative = path.relative(rootPath, candidatePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function isBasename(value) {
  return typeof value === 'string' && value.length > 0 && path.basename(value) === value;
}

/**
 * Content-address a single artifact file by SHA-256 and byte length.
 *
 * @param {string} filePath - Absolute or relative artifact path.
 * @returns {Promise<{sha256:string, bytes:number}>} Content identity.
 */
export async function hashArtifactFile(filePath) {
  const buffer = await readFile(filePath);
  return { sha256: digest([buffer]), bytes: buffer.byteLength };
}

/**
 * Assemble a validated, immutable manifest document.
 *
 * @param {Object} input - Manifest fields.
 * @param {string} input.generationHash - Generation identity hash.
 * @param {string} input.createdAt - ISO timestamp for the publish event.
 * @param {Object} input.artifacts - Role-keyed `{file, sha256, bytes}` entries.
 * @param {string|null} [input.parentGenerationHash] - Prior generation identity.
 * @returns {Object} Frozen manifest document.
 */
export function buildManifest({ generationHash, createdAt, artifacts, parentGenerationHash = null }) {
  if (typeof generationHash !== 'string' || generationHash.length === 0) {
    throw manifestError('manifest-invalid', 'Manifest requires a generation hash.');
  }
  if (!artifacts || typeof artifacts !== 'object' || !artifacts.sqlite) {
    throw manifestError('manifest-invalid', 'Manifest requires at least a sqlite artifact.');
  }
  const normalizedArtifacts = {};
  for (const role of MANIFEST_ARTIFACT_ROLES) {
    const entry = artifacts[role];
    if (!entry) continue;
    if (!isBasename(entry.file)) {
      throw manifestError('manifest-invalid', `Manifest artifact ${role} file must be a basename.`);
    }
    if (typeof entry.sha256 !== 'string' || !Number.isInteger(entry.bytes) || entry.bytes < 0) {
      throw manifestError('manifest-invalid', `Manifest artifact ${role} needs sha256 and byte length.`);
    }
    normalizedArtifacts[role] = { role, file: entry.file, sha256: entry.sha256, bytes: entry.bytes };
  }
  return Object.freeze({
    manifestVersion: MANIFEST_VERSION,
    generationHash,
    createdAt: typeof createdAt === 'string' ? createdAt : new Date(0).toISOString(),
    parentGenerationHash: parentGenerationHash ?? null,
    artifacts: normalizedArtifacts,
  });
}

/**
 * Render a manifest document as a stable, human-readable pointer payload.
 *
 * @param {Object} doc - Manifest document.
 * @returns {string} Serialized manifest with a trailing newline.
 */
export function serializeManifest(doc) {
  const artifacts = {};
  for (const role of MANIFEST_ARTIFACT_ROLES) {
    if (doc.artifacts[role]) artifacts[role] = doc.artifacts[role];
  }
  const ordered = {
    manifestVersion: doc.manifestVersion,
    generationHash: doc.generationHash,
    createdAt: doc.createdAt,
    parentGenerationHash: doc.parentGenerationHash ?? null,
    artifacts,
  };
  return `${JSON.stringify(ordered, null, 2)}\n`;
}

/**
 * Normalize a parsed pointer payload, accepting manifest and legacy shapes.
 *
 * @param {*} raw - Parsed pointer JSON.
 * @returns {{generationHash:string, sqliteFile:string, artifacts:Object, legacy:boolean}} Normalized pointer.
 */
export function normalizePointer(raw) {
  if (raw && raw.manifestVersion === MANIFEST_VERSION) {
    if (typeof raw.generationHash !== 'string'
      || !raw.artifacts
      || typeof raw.artifacts !== 'object'
      || !raw.artifacts.sqlite
      || !isBasename(raw.artifacts.sqlite.file)) {
      throw manifestError('generation-pointer-invalid', 'Generation manifest has an invalid shape.');
    }
    return {
      generationHash: raw.generationHash,
      sqliteFile: raw.artifacts.sqlite.file,
      artifacts: raw.artifacts,
      legacy: false,
    };
  }
  if (raw && raw.schemaVersion === LEGACY_POINTER_VERSION
    && typeof raw.generationHash === 'string'
    && isBasename(raw.databaseFile)) {
    return {
      generationHash: raw.generationHash,
      sqliteFile: raw.databaseFile,
      artifacts: { sqlite: { role: 'sqlite', file: raw.databaseFile } },
      legacy: true,
    };
  }
  throw manifestError('generation-pointer-invalid', 'Style database generation pointer has an invalid shape.');
}

/**
 * Resolve the published SQLite target selected by an atomic pointer file.
 *
 * Containment and existence are always enforced; the SQLite artifact is bound
 * to its generation hash by the caller rather than re-hashed on every open.
 *
 * @param {string} databasePath - Logical database path.
 * @param {string} pointerSuffix - Pointer filename suffix.
 * @returns {{databasePath:string, generationHash:string|null}} Resolved target.
 */
export function resolvePublishedTarget(databasePath, pointerSuffix) {
  const pointerPath = `${databasePath}${pointerSuffix}`;
  if (!existsSync(pointerPath)) return { databasePath, generationHash: null };
  let raw;
  try {
    raw = JSON.parse(readFileSync(pointerPath, 'utf8'));
  } catch (cause) {
    throw manifestError('generation-pointer-invalid', 'Style database generation pointer is invalid JSON.', cause);
  }
  const normalized = normalizePointer(raw);
  const publishedPath = path.join(path.dirname(databasePath), normalized.sqliteFile);
  if (!existsSync(publishedPath)) {
    throw manifestError('generation-unavailable', 'Published style database generation is unavailable.');
  }
  const generationDirectory = realpathSync(path.dirname(databasePath));
  const publishedRealPath = realpathSync(publishedPath);
  if (!isContained(generationDirectory, publishedRealPath)) {
    throw manifestError('generation-pointer-escape', 'Published style database generation escapes its directory.');
  }
  return { databasePath: publishedPath, generationHash: normalized.generationHash };
}

/**
 * Read and normalize a pointer file without opening any artifact.
 *
 * @param {string} pointerPath - Absolute pointer path.
 * @returns {Promise<Object>} Normalized pointer plus the manifest document.
 */
export async function readManifest(pointerPath) {
  let raw;
  try {
    raw = JSON.parse(await readFile(pointerPath, 'utf8'));
  } catch (cause) {
    throw manifestError('generation-pointer-invalid', 'Style database generation pointer is invalid JSON.', cause);
  }
  return { ...normalizePointer(raw), document: raw };
}

/**
 * Validate every artifact a manifest references for a reader that binds it.
 *
 * @param {string} pointerPath - Absolute pointer path.
 * @param {Object} [options] - Validation controls.
 * @param {boolean} [options.verifyDigests=false] - Re-hash each artifact file.
 * @returns {Promise<Object>} Resolved, validated artifact set.
 */
export async function resolveManifestArtifacts(pointerPath, { verifyDigests = false } = {}) {
  const { generationHash, artifacts, legacy } = await readManifest(pointerPath);
  const directory = path.dirname(pointerPath);
  const directoryRealPath = realpathSync(directory);
  const resolved = {};
  for (const [role, entry] of Object.entries(artifacts)) {
    const artifactPath = path.join(directory, entry.file);
    if (!existsSync(artifactPath)) {
      throw manifestError('generation-unavailable', `Manifest artifact ${role} is unavailable.`);
    }
    const artifactRealPath = realpathSync(artifactPath);
    if (!isContained(directoryRealPath, artifactRealPath)) {
      throw manifestError('generation-pointer-escape', `Manifest artifact ${role} escapes its directory.`);
    }
    if (verifyDigests && entry.sha256) {
      const { sha256 } = await hashArtifactFile(artifactRealPath);
      if (sha256 !== entry.sha256) {
        throw manifestError('generation-artifact-tampered', `Manifest artifact ${role} failed digest verification.`);
      }
    }
    resolved[role] = { role, file: entry.file, path: artifactPath, sha256: entry.sha256 ?? null };
  }
  return { generationHash, legacy, artifacts: resolved };
}

/**
 * Atomically flip the pointer to a new manifest with fsync durability.
 *
 * The payload is written to a fresh temp file, fsynced, then renamed over the
 * pointer, and the containing directory is fsynced so the flip survives crash.
 *
 * @param {string} pointerPath - Absolute pointer path.
 * @param {Object} doc - Manifest document to publish.
 * @param {Object} [options] - Hooks.
 * @param {Function} [options.afterRename] - Invoked after the atomic rename.
 * @returns {Promise<void>}
 */
export async function writeManifestPointer(pointerPath, doc, { afterRename } = {}) {
  const serialized = serializeManifest(doc);
  const temporaryPath = `${pointerPath}.tmp-${process.pid}-${Date.now()}`;
  let temporaryHandle;
  try {
    temporaryHandle = await open(temporaryPath, 'wx');
    await temporaryHandle.writeFile(serialized);
    await temporaryHandle.sync();
    await temporaryHandle.close();
    temporaryHandle = null;
    await rename(temporaryPath, pointerPath);
    afterRename?.({ pointerPath, generationHash: doc.generationHash });
    const directoryHandle = await open(path.dirname(pointerPath), 'r');
    try {
      await directoryHandle.sync();
    } finally {
      await directoryHandle.close();
    }
  } finally {
    if (temporaryHandle) await temporaryHandle.close();
    await rm(temporaryPath, { force: true });
  }
}

/**
 * List the artifact basenames a manifest document references.
 *
 * @param {Object} doc - Manifest document.
 * @returns {string[]} Artifact basenames.
 */
export function manifestArtifactFiles(doc) {
  return Object.values(doc.artifacts).map((artifact) => artifact.file);
}

/**
 * Prune whole generations, keeping every artifact of the retained manifests.
 *
 * An artifact file is removed only when no retained manifest references it, so a
 * generation is dropped as a unit rather than leaving orphaned artifacts.
 *
 * @param {Object} options - Retention inputs.
 * @param {string} options.directory - Directory holding the artifact files.
 * @param {Object[]} options.retain - Manifests to keep intact.
 * @param {Object[]} options.prune - Manifests eligible for removal.
 * @returns {Promise<{kept:string[], removed:string[]}>} Retention outcome.
 */
export async function pruneManifestGenerations({ directory, retain, prune }) {
  const keep = new Set(retain.flatMap(manifestArtifactFiles));
  const removed = [];
  for (const doc of prune) {
    for (const file of manifestArtifactFiles(doc)) {
      if (keep.has(file)) continue;
      for (const suffix of ARTIFACT_SIDECAR_SUFFIXES) {
        await rm(path.join(directory, `${file}${suffix}`), { force: true });
      }
      removed.push(file);
    }
  }
  return { kept: [...keep], removed };
}
