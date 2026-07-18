// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Style Library Retrieval Manifest                                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { createHash } from 'node:crypto';
import {
  lstat,
  mkdir,
  readFile,
  readdir,
  realpath,
  rename,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';

import { compareRawStrings } from './ordering.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const MANIFEST_SCHEMA_VERSION = 1;
export const MANIFEST_FILE_NAME = '_retrieval-manifest.json';

const CRAWL_MANIFEST_FILE_NAME = '_manifest.json';
const HASH_PREFIX = 'sha256:';
const HASH_PATTERN = /^sha256:[0-9a-f]{64}$/;
const MAX_CONCURRENCY = 256;
const MANIFEST_KEYS = Object.freeze([
  'schemaVersion',
  'generationHash',
  'crawlManifestHash',
  'recordCount',
  'styles',
]);
const STYLE_KEYS = Object.freeze([
  'id',
  'slug',
  'status',
  'title',
  'thesis',
  'theme',
  'tokenAxes',
  'capabilities',
  'facets',
  'availableSections',
  'sectionPointers',
  'provenance',
  'artifacts',
  'estimatedHydrationBytes',
  'contentHash',
]);
const TOKEN_AXIS_KEYS = Object.freeze(['axis', 'count']);
const SECTION_POINTER_KEYS = Object.freeze(['name', 'line']);
const PROVENANCE_KEYS = Object.freeze([
  'status',
  'sourceUrl',
  'originalUrl',
  'screenshotUrl',
  'uuid',
  'capturedAt',
  'licenseStatus',
  'rightsKnown',
  'evidenceScope',
]);
const ARTIFACT_KEYS = Object.freeze(['path', 'bytes', 'sha256']);
const UNAVAILABLE_FILE_CODES = Object.freeze(['ENOENT', 'ENOTDIR', 'ESTALE']);
const WARM_SURFACE_PATTERN = /\b(warm|cream|beige|bone|ivory|linen|sand|tan)\b/i;
const MOTION_PATTERN = /\b(motion|animation|animated|transition|kinetic|scroll)\b/i;
const SERIF_PATTERN = /(^|[^a-z])serif([^a-z]|$)/i;
const SANS_SERIF_PATTERN = /sans[- ]serif/i;
const RESTRICTED_LICENSE_PATTERN = /\b(unlicensed trial|license[- ]restricted)\b/i;

// ─────────────────────────────────────────────────────────────────────────────
// 3. ERRORS AND HASHING
// ─────────────────────────────────────────────────────────────────────────────

export const MANIFEST_ERROR_CODES = Object.freeze({
  CORPUS_CHANGING: 'corpus-changing',
  INVALID_ARTIFACT: 'invalid-artifact',
  INVALID_MANIFEST: 'invalid-manifest',
  PATH_ESCAPE: 'path-escape',
  UNAVAILABLE: 'unavailable',
});

const MANIFEST_ERROR_CODE_VALUES = Object.freeze(Object.values(MANIFEST_ERROR_CODES));

/**
 * Represent a retrieval-manifest failure with a closed, machine-readable code.
 */
export class ManifestBuildError extends Error {
  constructor(code, message, options = {}) {
    if (!MANIFEST_ERROR_CODE_VALUES.includes(code)) {
      throw new TypeError(`Unknown manifest error code: ${code}`);
    }
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = 'ManifestBuildError';
    this.code = code;
  }
}

export class CorpusChangingError extends ManifestBuildError {
  constructor() {
    super(
      MANIFEST_ERROR_CODES.CORPUS_CHANGING,
      'Corpus changed while the retrieval manifest was being built.',
    );
    this.name = 'CorpusChangingError';
  }
}

/**
 * Identify errors carrying the retrieval engine's closed error vocabulary.
 *
 * @param {unknown} error - Candidate error.
 * @returns {boolean} Whether the error is a typed manifest build failure.
 */
export function isManifestBuildError(error) {
  return error instanceof ManifestBuildError
    && MANIFEST_ERROR_CODE_VALUES.includes(error.code);
}

/**
 * Convert a typed build failure into a closed negative result.
 *
 * @param {unknown} error - Candidate error.
 * @returns {{ok:false,error:string}|null} Immutable normalized result when recognized.
 */
export function manifestErrorResult(error) {
  if (!isManifestBuildError(error)) return null;
  return Object.freeze({ ok: false, error: error.code });
}

function sha256(parts) {
  const hash = createHash('sha256');
  for (const part of parts) {
    hash.update(part);
  }
  return `${HASH_PREFIX}${hash.digest('hex')}`;
}

function hashArtifacts(artifacts) {
  const parts = [];
  for (const artifact of artifacts) {
    parts.push(artifact.path, '\0', artifact.buffer, '\0');
  }
  return sha256(parts);
}

function hashGeneration(crawlManifestHash, styles) {
  const parts = [
    `schema:${MANIFEST_SCHEMA_VERSION}\n`,
    `crawl:${crawlManifestHash}\n`,
  ];
  for (const style of styles) {
    parts.push(`${style.id}\0${style.contentHash}\n`);
  }
  return sha256(parts);
}

function hashInputFingerprint(crawlManifestHash, styles) {
  const parts = [`crawl:${crawlManifestHash}\n`];
  const sortedStyles = styles.slice().sort(
    (left, right) => compareRawStrings(left.slug, right.slug),
  );
  for (const style of sortedStyles) {
    parts.push(`${style.slug}\0${style.contentHash}\n`);
  }
  return sha256(parts);
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactDataKeys(value, expectedKeys) {
  if (!isPlainObject(value)) return false;
  const keys = Reflect.ownKeys(value);
  if (keys.length !== expectedKeys.length || keys.some((key) => typeof key !== 'string')) {
    return false;
  }
  if (keys.some((key) => !expectedKeys.includes(key))) return false;
  return expectedKeys.every((key) => {
    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    return descriptor?.enumerable === true
      && Object.hasOwn(descriptor, 'value')
      && !Object.hasOwn(descriptor, 'get')
      && !Object.hasOwn(descriptor, 'set');
  });
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isNullableString(value) {
  return value === null || typeof value === 'string';
}

function isTokenAxis(value) {
  return hasExactDataKeys(value, TOKEN_AXIS_KEYS)
    && typeof value.axis === 'string'
    && Number.isInteger(value.count)
    && value.count >= 0;
}

function isSectionPointer(value) {
  return hasExactDataKeys(value, SECTION_POINTER_KEYS)
    && typeof value.name === 'string'
    && Number.isInteger(value.line)
    && value.line > 0;
}

function isProvenance(value) {
  return hasExactDataKeys(value, PROVENANCE_KEYS)
    && typeof value.status === 'string'
    && isNullableString(value.sourceUrl)
    && isNullableString(value.originalUrl)
    && isNullableString(value.screenshotUrl)
    && isNullableString(value.uuid)
    && isNullableString(value.capturedAt)
    && typeof value.licenseStatus === 'string'
    && typeof value.rightsKnown === 'boolean'
    && isStringArray(value.evidenceScope);
}

function isArtifactRecord(value) {
  return hasExactDataKeys(value, ARTIFACT_KEYS)
    && typeof value.path === 'string'
    && Number.isInteger(value.bytes)
    && value.bytes >= 0
    && typeof value.sha256 === 'string'
    && HASH_PATTERN.test(value.sha256);
}

function isStyleRecord(value) {
  return hasExactDataKeys(value, STYLE_KEYS)
    && typeof value.id === 'string'
    && typeof value.slug === 'string'
    && typeof value.status === 'string'
    && typeof value.title === 'string'
    && typeof value.thesis === 'string'
    && isNullableString(value.theme)
    && Array.isArray(value.tokenAxes)
    && value.tokenAxes.every(isTokenAxis)
    && isStringArray(value.capabilities)
    && isStringArray(value.facets)
    && isStringArray(value.availableSections)
    && Array.isArray(value.sectionPointers)
    && value.sectionPointers.every(isSectionPointer)
    && isProvenance(value.provenance)
    && Array.isArray(value.artifacts)
    && value.artifacts.every(isArtifactRecord)
    && Number.isInteger(value.estimatedHydrationBytes)
    && value.estimatedHydrationBytes >= 0
    && typeof value.contentHash === 'string'
    && HASH_PATTERN.test(value.contentHash);
}

function deepFreeze(value, seen = new Set()) {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) deepFreeze(child, seen);
  return Object.freeze(value);
}

function normalizeBuildError(error) {
  if (isManifestBuildError(error)) return error;
  if (UNAVAILABLE_FILE_CODES.includes(error?.code)) {
    return new ManifestBuildError(
      MANIFEST_ERROR_CODES.UNAVAILABLE,
      'A corpus input became unavailable while the retrieval manifest was being built.',
      { cause: error },
    );
  }
  return error;
}

/**
 * Validate and freeze a detached retrieval-manifest snapshot.
 *
 * @param {unknown} manifest - Candidate retrieval manifest.
 * @returns {Object} Immutable manifest snapshot.
 * @throws {ManifestBuildError} When the manifest does not match the closed schema.
 */
export function snapshotManifest(manifest) {
  const hasValidShape = hasExactDataKeys(manifest, MANIFEST_KEYS)
    && manifest.schemaVersion === MANIFEST_SCHEMA_VERSION
    && typeof manifest.generationHash === 'string'
    && HASH_PATTERN.test(manifest.generationHash)
    && typeof manifest.crawlManifestHash === 'string'
    && HASH_PATTERN.test(manifest.crawlManifestHash)
    && Number.isInteger(manifest.recordCount)
    && manifest.recordCount >= 0
    && Array.isArray(manifest.styles)
    && manifest.styles.length === manifest.recordCount
    && manifest.styles.every(isStyleRecord)
    && new Set(manifest.styles.map((style) => style.id)).size === manifest.styles.length
    && new Set(manifest.styles.map((style) => style.slug)).size === manifest.styles.length;
  if (!hasValidShape) {
    throw new ManifestBuildError(
      MANIFEST_ERROR_CODES.INVALID_MANIFEST,
      'Retrieval manifest does not match the closed schema.',
    );
  }
  return deepFreeze(structuredClone(manifest));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. DERIVED METADATA
// ─────────────────────────────────────────────────────────────────────────────

function countTokenLeaves(value) {
  if (!value || typeof value !== 'object') {
    return 0;
  }
  if (Object.hasOwn(value, '$value')) {
    return 1;
  }
  return Object.values(value).reduce((sum, child) => sum + countTokenLeaves(child), 0);
}

function deriveTokenAxes(tokenDocument, designSystem) {
  const counts = new Map();
  if (tokenDocument && typeof tokenDocument === 'object') {
    for (const [axis, value] of Object.entries(tokenDocument)) {
      const count = countTokenLeaves(value);
      if (count > 0) {
        counts.set(axis, count);
      }
    }
  }

  const fallbacks = {
    color: Array.isArray(designSystem.colors) ? designSystem.colors.length : 0,
    spacing: designSystem.spacing ? Object.keys(designSystem.spacing).length : 0,
    typography: Array.isArray(designSystem.typography)
      ? designSystem.typography.length
      : 0,
  };
  for (const [axis, count] of Object.entries(fallbacks)) {
    if (count > 0 && !counts.has(axis)) {
      counts.set(axis, count);
    }
  }

  return [...counts]
    .map(([axis, count]) => ({ axis, count }))
    .sort((left, right) => compareRawStrings(left.axis, right.axis));
}

function deriveSections(designMarkdown) {
  const sections = [];
  for (const [index, line] of designMarkdown.split(/\r?\n/).entries()) {
    const match = /^(##)\s+(.+?)\s*$/.exec(line);
    if (match) {
      sections.push({ name: match[2], line: index + 1 });
    }
  }
  return sections;
}

function deriveCapabilities(designSystem, tokenAxes, sections, provenanceStatus) {
  const capabilities = new Set();
  if (tokenAxes.length > 0) capabilities.add('tokens');
  if (Array.isArray(designSystem.components) && designSystem.components.length > 0) {
    capabilities.add('components');
  }
  if (designSystem.layout) capabilities.add('layout');
  if (designSystem.imagery) capabilities.add('imagery');
  if (designSystem.spacing) capabilities.add('spacing');
  if ((designSystem.dos?.length ?? 0) + (designSystem.donts?.length ?? 0) > 0) {
    capabilities.add('constraints');
  }
  if (provenanceStatus === 'known') capabilities.add('provenance');
  if (sections.some((section) => MOTION_PATTERN.test(section.name))) {
    capabilities.add('motion');
  }
  return [...capabilities].sort(compareRawStrings);
}

function deriveFacets(canonical, capabilities, tokenAxes, searchableText, licenseStatus) {
  const designSystem = canonical.designSystem ?? {};
  const facets = new Set(capabilities);
  for (const { axis } of tokenAxes) facets.add(axis);
  if (designSystem.theme) facets.add(String(designSystem.theme).toLowerCase());
  if (designSystem.industry) {
    facets.add(String(designSystem.industry).toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  }
  if (SERIF_PATTERN.test(searchableText) && !SANS_SERIF_PATTERN.test(searchableText)) {
    facets.add('serif-role');
  }
  if (WARM_SURFACE_PATTERN.test(searchableText)) facets.add('warm-surface');
  if (MOTION_PATTERN.test(searchableText)) facets.add('motion');
  if (licenseStatus === 'restricted') facets.add('license-restricted');
  return [...facets].sort(compareRawStrings);
}

function deriveLicenseStatus(searchableText) {
  if (RESTRICTED_LICENSE_PATTERN.test(searchableText)) {
    return { licenseStatus: 'restricted', rightsKnown: true };
  }
  return { licenseStatus: 'unknown', rightsKnown: false };
}

function excerpt(value, maxLength = 240) {
  const normalized = String(value ?? '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

function parseJsonArtifact(artifact, fallback = {}) {
  if (!artifact) return fallback;
  try {
    return JSON.parse(artifact.buffer.toString('utf8'));
  } catch (error) {
    throw new ManifestBuildError(
      MANIFEST_ERROR_CODES.INVALID_ARTIFACT,
      `Invalid JSON artifact: ${artifact.path}`,
      { cause: error },
    );
  }
}

function createStyleRecord(slug, crawlRecord, artifacts, contentHash) {
  const canonicalArtifact = artifacts.find(
    (artifact) => artifact.path.endsWith('-canonical.json'),
  );
  const tokensArtifact = artifacts.find(
    (artifact) => artifact.path.endsWith('/design-tokens.json'),
  );
  const designArtifact = artifacts.find((artifact) => artifact.path.endsWith('/DESIGN.md'));
  const canonical = parseJsonArtifact(canonicalArtifact);
  const tokenDocument = parseJsonArtifact(tokensArtifact);
  const designMarkdown = designArtifact?.buffer.toString('utf8') ?? '';
  const designSystem = canonical.designSystem ?? {};
  const sections = deriveSections(designMarkdown);
  const tokenAxes = deriveTokenAxes(tokenDocument, designSystem);
  const provenanceStatus = canonical.source && canonical.uuid && canonical.meta?.url
    ? 'known'
    : 'missing';
  const searchableText = [
    canonical.name,
    canonical.northStar,
    designSystem.description,
    designSystem.theme,
    designSystem.industry,
    designSystem.layout,
    designSystem.imagery,
    ...(designSystem.typography ?? []).map?.((entry) => `${entry.family ?? ''} ${entry.role ?? ''}`)
      ?? [],
    designMarkdown.slice(0, 16_384),
  ].join(' ');
  const { licenseStatus, rightsKnown } = deriveLicenseStatus(searchableText);
  const capabilities = deriveCapabilities(
    designSystem,
    tokenAxes,
    sections,
    provenanceStatus,
  );
  const facets = deriveFacets(
    canonical,
    capabilities,
    tokenAxes,
    searchableText,
    licenseStatus,
  );
  const artifactRecords = artifacts.map(({ path: artifactPath, bytes, digest }) => ({
    path: artifactPath,
    bytes,
    sha256: digest,
  }));

  return {
    id: canonical.uuid ?? crawlRecord?.uuid ?? slug,
    slug,
    status: crawlRecord?.status ?? 'unknown',
    title: excerpt(canonical.name ?? slug, 120),
    thesis: excerpt(canonical.northStar ?? designSystem.northStar ?? designSystem.description),
    theme: designSystem.theme ?? null,
    tokenAxes,
    capabilities,
    facets,
    availableSections: sections.map((section) => section.name),
    sectionPointers: sections,
    provenance: {
      status: provenanceStatus,
      sourceUrl: canonical.source ?? crawlRecord?.url ?? null,
      originalUrl: canonical.meta?.url ?? null,
      screenshotUrl: canonical.screenshot?.url ?? null,
      uuid: canonical.uuid ?? crawlRecord?.uuid ?? null,
      capturedAt: canonical.capturedAt ?? crawlRecord?.capturedAt ?? null,
      licenseStatus,
      rightsKnown,
      evidenceScope: licenseStatus === 'restricted'
        ? ['reference', 'rationale']
        : ['reference', 'rationale'],
    },
    artifacts: artifactRecords,
    estimatedHydrationBytes: artifactRecords
      .filter((artifact) => /\/(DESIGN\.md|source\.md|design-tokens\.json)$/.test(artifact.path))
      .reduce((sum, artifact) => sum + artifact.bytes, 0),
    contentHash,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORPUS SCANNING
// ─────────────────────────────────────────────────────────────────────────────

function isContained(rootPath, candidatePath) {
  const relative = path.relative(rootPath, candidatePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

async function readContainedTopLevelFile(corpusRoot, corpusRealPath, fileName) {
  const candidatePath = path.resolve(corpusRoot, fileName);
  const candidateRealPath = await realpath(candidatePath);
  if (!isContained(corpusRealPath, candidateRealPath)) {
    throw new ManifestBuildError(
      MANIFEST_ERROR_CODES.PATH_ESCAPE,
      `Top-level corpus file escapes the corpus root: ${fileName}`,
    );
  }
  return readFile(candidateRealPath);
}

async function mapConcurrent(items, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }
  const workerCount = Math.min(MAX_CONCURRENCY, Math.max(items.length, 1));
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

async function readStyleArtifacts(corpusRoot, corpusRealPath, slug) {
  const stylePath = path.join(corpusRoot, slug);
  const names = (await readdir(stylePath)).sort(compareRawStrings);
  const artifacts = [];
  for (const name of names) {
    const artifactPath = path.join(stylePath, name);
    const linkInfo = await lstat(artifactPath, { bigint: true });
    if (!linkInfo.isFile() && !linkInfo.isSymbolicLink()) continue;
    const artifactRealPath = await realpath(artifactPath);
    if (!isContained(corpusRealPath, artifactRealPath)) {
      throw new ManifestBuildError(
        MANIFEST_ERROR_CODES.PATH_ESCAPE,
        `Artifact escapes the corpus root: ${slug}/${name}`,
      );
    }
    const targetInfo = await stat(artifactRealPath, { bigint: true });
    const buffer = await readFile(artifactRealPath);
    const relativePath = `${slug}/${name}`;
    const digest = sha256([buffer]);
    artifacts.push({
      path: relativePath,
      bytes: buffer.byteLength,
      digest,
      buffer,
      inputMetadata: `${relativePath}\0${targetInfo.size}\0${targetInfo.mtimeNs}`
        + `\0${targetInfo.ctimeNs}\0${digest}\n`,
    });
  }
  artifacts.sort((left, right) => compareRawStrings(left.path, right.path));
  return artifacts;
}

async function scanCorpus(corpusRoot, previousManifest = null, deriveRecords = true) {
  const corpusRealPath = await realpath(corpusRoot);
  const crawlBuffer = await readContainedTopLevelFile(
    corpusRoot,
    corpusRealPath,
    CRAWL_MANIFEST_FILE_NAME,
  );
  const crawlManifestHash = sha256([crawlBuffer]);
  const crawlRecords = JSON.parse(crawlBuffer.toString('utf8'));
  const crawlBySlug = new Map(crawlRecords.map((record) => [record.slug, record]));
  const previousBySlug = new Map(
    (previousManifest?.styles ?? []).map((record) => [record.slug, record]),
  );
  const entries = await readdir(corpusRoot, { withFileTypes: true });
  const slugs = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => entry.name)
    .sort(compareRawStrings);

  const scannedStyles = await mapConcurrent(slugs, async (slug) => {
    const artifacts = await readStyleArtifacts(corpusRoot, corpusRealPath, slug);
    const contentHash = hashArtifacts(artifacts);
    const inputMetadata = artifacts.map((artifact) => artifact.inputMetadata);
    if (!deriveRecords) return { record: { slug, contentHash }, inputMetadata };
    const previous = previousBySlug.get(slug);
    if (previous?.contentHash === contentHash) {
      return { record: {
        ...previous,
        id: crawlBySlug.get(slug)?.uuid ?? previous.id,
        slug,
        status: crawlBySlug.get(slug)?.status ?? previous.status,
        contentHash,
      }, inputMetadata };
    }
    return {
      record: createStyleRecord(slug, crawlBySlug.get(slug), artifacts, contentHash),
      inputMetadata,
    };
  });
  const styles = scannedStyles.map((entry) => entry.record);
  styles.sort((left, right) => (
    deriveRecords
      ? compareRawStrings(left.id, right.id)
      : compareRawStrings(left.slug, right.slug)
  ));
  return {
    crawlManifestHash,
    styles,
    inputFingerprint: hashInputFingerprint(crawlManifestHash, styles),
    metadataFingerprint: sha256([
      `crawl:${crawlManifestHash}\n`,
      ...scannedStyles.flatMap((entry) => entry.inputMetadata),
    ]),
  };
}

async function scanMetadataFingerprint(corpusRoot) {
  const corpusRealPath = await realpath(corpusRoot);
  const crawlBuffer = await readContainedTopLevelFile(
    corpusRoot,
    corpusRealPath,
    CRAWL_MANIFEST_FILE_NAME,
  );
  const parts = [`crawl:${sha256([crawlBuffer])}\n`];
  const entries = await readdir(corpusRoot, { withFileTypes: true });
  const slugs = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .map((entry) => entry.name)
    .sort(compareRawStrings);
  const styleParts = await mapConcurrent(slugs, async (slug) => {
    const artifactParts = [];
    const stylePath = path.join(corpusRoot, slug);
    const names = (await readdir(stylePath)).sort(compareRawStrings);
    for (const name of names) {
      const artifactPath = path.join(stylePath, name);
      const linkInfo = await lstat(artifactPath, { bigint: true });
      if (!linkInfo.isFile() && !linkInfo.isSymbolicLink()) continue;
      const artifactRealPath = await realpath(artifactPath);
      if (!isContained(corpusRealPath, artifactRealPath)) {
        throw new ManifestBuildError(
          MANIFEST_ERROR_CODES.PATH_ESCAPE,
          `Artifact escapes the corpus root: ${slug}/${name}`,
        );
      }
      const targetInfo = await stat(artifactRealPath, { bigint: true });
      const buffer = await readFile(artifactRealPath);
      artifactParts.push(
        `${slug}/${name}\0${targetInfo.size}\0${targetInfo.mtimeNs}`
          + `\0${targetInfo.ctimeNs}\0${sha256([buffer])}\n`,
      );
    }
    return artifactParts;
  });
  for (const artifactParts of styleParts) parts.push(...artifactParts);
  return sha256(parts);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a deterministic retrieval manifest and reject a moving corpus.
 *
 * @param {string} corpusRoot - Styles corpus root.
 * @param {Object} [options] - Build controls.
 * @param {Object|null} [options.previousManifest] - Prior manifest for derived-field reuse.
 * @param {Function} [options.beforeVerification] - Test hook before the post-build fingerprint.
 * @returns {Promise<Object>} Byte-stable manifest data.
 */
export async function buildManifest(corpusRoot, options = {}) {
  try {
    const previousManifest = options.previousManifest
      ? snapshotManifest(options.previousManifest)
      : null;
    const firstScan = await scanCorpus(corpusRoot, previousManifest);
    if (options.beforeVerification) await options.beforeVerification();
    const verificationFingerprint = await scanMetadataFingerprint(corpusRoot);
    if (firstScan.metadataFingerprint !== verificationFingerprint) {
      throw new CorpusChangingError();
    }
    const generationHash = hashGeneration(firstScan.crawlManifestHash, firstScan.styles);
    return snapshotManifest({
      schemaVersion: MANIFEST_SCHEMA_VERSION,
      generationHash,
      crawlManifestHash: firstScan.crawlManifestHash,
      recordCount: firstScan.styles.length,
      styles: firstScan.styles,
    });
  } catch (error) {
    throw normalizeBuildError(error);
  }
}

/**
 * Serialize the committed manifest with stable indentation and a terminal newline.
 *
 * @param {Object} manifest - Manifest data.
 * @returns {string} Stable JSON bytes represented as text.
 */
export function serializeManifest(manifest) {
  return `${JSON.stringify(snapshotManifest(manifest), null, 2)}\n`;
}

/**
 * Publish a manifest through an adjacent temporary file and atomic rename.
 *
 * @param {string} manifestPath - Destination path.
 * @param {Object} manifest - Manifest data.
 * @returns {Promise<void>}
 */
export async function writeManifestAtomic(manifestPath, manifest) {
  await mkdir(path.dirname(manifestPath), { recursive: true });
  const temporaryPath = `${manifestPath}.tmp-${process.pid}`;
  try {
    await writeFile(temporaryPath, serializeManifest(manifest), { flag: 'wx' });
    await rename(temporaryPath, manifestPath);
  } finally {
    await rm(temporaryPath, { force: true });
  }
}

/**
 * Load a manifest when present without treating absence as an error.
 *
 * @param {string} manifestPath - Manifest path.
 * @param {Object} [options] - Read controls.
 * @param {string} [options.corpusRoot] - Root that must contain the resolved file.
 * @returns {Promise<Object|null>} Immutable parsed manifest or null.
 */
export async function loadManifest(manifestPath, options = {}) {
  try {
    const corpusRoot = options.corpusRoot ?? path.dirname(manifestPath);
    const corpusRealPath = await realpath(corpusRoot);
    const manifestRealPath = await realpath(manifestPath);
    if (!isContained(corpusRealPath, manifestRealPath)) {
      throw new ManifestBuildError(
        MANIFEST_ERROR_CODES.PATH_ESCAPE,
        `Top-level corpus file escapes the corpus root: ${path.basename(manifestPath)}`,
      );
    }
    let parsed;
    try {
      parsed = JSON.parse(await readFile(manifestRealPath, 'utf8'));
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new ManifestBuildError(
          MANIFEST_ERROR_CODES.INVALID_MANIFEST,
          'Retrieval manifest is not valid JSON.',
          { cause: error },
        );
      }
      throw error;
    }
    return snapshotManifest(parsed);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

/**
 * Report style identities added, changed, or removed between generations.
 *
 * @param {Object|null} committed - Existing manifest.
 * @param {Object} generated - Newly generated manifest.
 * @returns {{added:string[],changed:string[],removed:string[]}} Deterministic diff.
 */
export function diffManifests(committed, generated) {
  const oldById = new Map((committed?.styles ?? []).map((style) => [style.id, style]));
  const newById = new Map(generated.styles.map((style) => [style.id, style]));
  const added = [...newById.keys()]
    .filter((id) => !oldById.has(id))
    .sort(compareRawStrings);
  const removed = [...oldById.keys()]
    .filter((id) => !newById.has(id))
    .sort(compareRawStrings);
  const changed = [...newById.keys()]
    .filter((id) => {
      const oldStyle = oldById.get(id);
      const newStyle = newById.get(id);
      return oldStyle && JSON.stringify(oldStyle) !== JSON.stringify(newStyle);
    })
    .sort(compareRawStrings);
  return { added, changed, removed };
}
