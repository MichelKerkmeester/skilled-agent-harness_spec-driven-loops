// ───────────────────────────────────────────────────────────────
// MODULE: Spec Document Paths
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';

import { shouldIndexForMemory } from '../utils/index-scope.js';

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

export const SPEC_DOCUMENT_FILENAMES = new Set([
  'spec.md',
  'plan.md',
  'tasks.md',
  'acceptance-criteria.md',
  'decision-record.md',
  'implementation-summary.md',
  'research.md',
  'resource-map.md',
  'handover.md',
  'review-report.md',
  'description.json',
]);

export const GRAPH_METADATA_FILENAME = 'graph-metadata.json';

const WORKING_ARTIFACT_SEGMENTS = [
  '/scratch/',
  '/temp/',
  '/research/iterations/',
  '/review/iterations/',
] as const;

// '/review/' as a whole is NOT excluded: the workflow-owned verdict document
// review-report.md lives at <packet>/review/review-report.md and is a
// first-class retrieval document. The filename allowlist keeps the review
// machinery (state JSONL, strategy, dashboard, registry) out, and iteration
// working files stay excluded by segment below.
const SPEC_DOCUMENT_ONLY_EXCLUDED_SEGMENTS = [
  '/memory/',
  '/scratch/',
  '/temp/',
  '/research/iterations/',
  '/review/iterations/',
  '/node_modules/',
] as const;

const GRAPH_METADATA_ONLY_EXCLUDED_SEGMENTS = [
  '/memory/',
  '/scratch/',
  '/temp/',
  '/research/iterations/',
  '/review/iterations/',
  '/node_modules/',
] as const;

// 'iterations' directories ARE descended: the research-metadata backfill
// deliberately creates description.json/graph-metadata.json inside
// <NNN-pack>/iterations/ so iteration packs share the packet metadata
// contract, and discovery must be able to see what the backfill writes.
// Iteration working files (iteration-NNN.md, deltas, logs) never match the
// document filename allowlist, so descending stays metadata-only.
const SPEC_DISCOVERY_ONLY_EXCLUDE_DIRS = new Set([
  'scratch',
  'memory',
  'node_modules',
]);

// Accept both canonical packet leaves like "010-feature" and numeric leaves like "010".
const SPEC_LEAF_SEGMENT_PATTERN = /^\d{3}(?:[-_].+)?$/;

// ───────────────────────────────────────────────────────────────
// 3. PATH CLASSIFICATION
// ───────────────────────────────────────────────────────────────

/** Normalize a path to forward slashes and lowercase for case/platform-stable comparisons. */
export function normalizeSpecPath(filePath: string | null | undefined): string {
  if (!filePath || typeof filePath !== 'string') {
    return '';
  }

  return filePath.replace(/\\/g, '/').toLowerCase();
}

/** Whether a path sits anywhere under a `specs/` directory. */
export function isSpecsScopedPath(filePath: string | null | undefined): boolean {
  const normalizedPath = normalizeSpecPath(filePath);
  return normalizedPath.includes('/specs/') || normalizedPath.startsWith('specs/');
}

/** Whether a path falls under a scratch/temp/iteration working-artifact segment. */
export function isWorkingArtifactPath(filePath: string | null | undefined): boolean {
  const normalizedPath = normalizeSpecPath(filePath);
  return WORKING_ARTIFACT_SEGMENTS.some((segment) => normalizedPath.includes(segment));
}

/** Whether a path is excluded from spec-document discovery (index-ignored or a known working segment). */
export function isSpecDocumentExcludedPath(filePath: string | null | undefined): boolean {
  const normalizedPath = normalizeSpecPath(filePath);
  return !shouldIndexForMemory(normalizedPath)
    || SPEC_DOCUMENT_ONLY_EXCLUDED_SEGMENTS.some((segment) => normalizedPath.includes(segment));
}

/** Whether a path is the canonical `research/research.md` location. */
export function isCanonicalResearchDocumentPath(filePath: string | null | undefined): boolean {
  const normalizedPath = normalizeSpecPath(filePath);
  return normalizedPath.endsWith('/research/research.md') || normalizedPath === 'research/research.md';
}

/** Whether a path is a `research.md` document, canonical or legacy leaf-level location. */
export function isLegacyOrCanonicalResearchDocumentPath(filePath: string | null | undefined): boolean {
  const normalizedPath = normalizeSpecPath(filePath);
  return normalizedPath.endsWith('/research.md')
    || normalizedPath === 'research.md'
    || isCanonicalResearchDocumentPath(normalizedPath);
}

/** Whether a path can be classified as an indexable spec document. */
export function canClassifyAsSpecDocument(filePath: string | null | undefined): boolean {
  return isSpecsScopedPath(filePath)
    && shouldIndexForMemory(normalizeSpecPath(filePath))
    && !isSpecDocumentExcludedPath(filePath);
}

/** Whether a path can be classified as an indexable graph-metadata document. */
export function canClassifyAsGraphMetadataPath(filePath: string | null | undefined): boolean {
  const normalizedPath = normalizeSpecPath(filePath);
  return isSpecsScopedPath(filePath)
    && shouldIndexForMemory(normalizedPath)
    && !GRAPH_METADATA_ONLY_EXCLUDED_SEGMENTS.some((segment) => normalizedPath.includes(segment));
}

/** Whether a discovery walk should descend into a given directory entry. */
export function shouldDescendSpecDiscoveryDirectory(
  fullPath: string,
  entryName: string,
): boolean {
  return !entryName.startsWith('.')
    && shouldIndexForMemory(fullPath)
    && !SPEC_DISCOVERY_ONLY_EXCLUDE_DIRS.has(entryName.toLowerCase());
}

/** Whether a path segment looks like a spec-folder leaf (e.g. `010-feature` or `010`). */
export function isSpecLeafSegment(segment: string | null | undefined): boolean {
  return typeof segment === 'string' && SPEC_LEAF_SEGMENT_PATTERN.test(segment);
}

/** Whether a path is the given basename in a location the spec-document allowlist accepts. */
export function matchesSpecDocumentPath(
  filePath: string | null | undefined,
  basename: string,
): boolean {
  if (!canClassifyAsSpecDocument(filePath)) {
    return false;
  }

  const normalizedPath = normalizeSpecPath(filePath);
  const normalizedBasename = basename.toLowerCase();
  const segments = normalizedPath.split('/').filter(Boolean);
  const parent = segments[segments.length - 2] || '';
  const grandParent = segments[segments.length - 3] || '';

  if (normalizedBasename === 'research.md') {
    if (!isLegacyOrCanonicalResearchDocumentPath(normalizedPath)) {
      return false;
    }

    if (parent === 'research') {
      return isSpecLeafSegment(grandParent);
    }

    return isSpecLeafSegment(parent);
  }

  // The deep-review workflow owns <packet>/review/review-report.md as the
  // canonical verdict document; accept it there as well as directly in a leaf.
  if (normalizedBasename === 'review-report.md' && parent === 'review') {
    return isSpecLeafSegment(grandParent);
  }

  // The research-metadata backfill places description.json inside
  // <NNN-pack>/iterations/ so iteration packs carry packet metadata.
  if (normalizedBasename === 'description.json' && parent === 'iterations') {
    return isSpecLeafSegment(grandParent);
  }

  return (
    (normalizedPath.endsWith(`/${normalizedBasename}`) || normalizedPath === normalizedBasename)
    && isSpecLeafSegment(parent)
  );
}

/** Whether a path is a `graph-metadata.json` document in a location the allowlist accepts. */
export function isGraphMetadataPath(filePath: string | null | undefined): boolean {
  if (!canClassifyAsGraphMetadataPath(filePath)) {
    return false;
  }

  const normalizedPath = normalizeSpecPath(filePath);
  if (!normalizedPath.endsWith(`/${GRAPH_METADATA_FILENAME}`) && normalizedPath !== GRAPH_METADATA_FILENAME) {
    return false;
  }

  const segments = normalizedPath.split('/').filter(Boolean);
  const parent = segments[segments.length - 2] || '';
  if (parent === 'iterations') {
    // Iteration packs carry backfilled graph metadata one level below the leaf.
    const grandParent = segments[segments.length - 3] || '';
    return isSpecLeafSegment(grandParent);
  }
  return isSpecLeafSegment(parent);
}

/** Resolve the owning spec folder (specs-root-relative) for a spec-document path. */
export function extractSpecFolderFromSpecDocumentPath(
  filePath: string | null | undefined,
): string | null {
  if (!canClassifyAsSpecDocument(filePath)) {
    return null;
  }

  const normalizedPath = normalizeSpecPath(filePath);
  const segments = normalizedPath.split('/').filter(Boolean);
  const specsIndex = segments.findIndex((segment) => segment === 'specs');
  if (specsIndex < 0) {
    return null;
  }

  const basename = segments[segments.length - 1] || '';
  if (!matchesSpecDocumentPath(normalizedPath, basename)) {
    return null;
  }

  const parent = segments[segments.length - 2] || '';
  // research.md and review-report.md live one level below the packet leaf
  // (in research/ and review/), so strip that parent to resolve the doc to
  // its owning packet rather than a phantom '<packet>/research'|'/review'
  // folder that carries no metadata of its own.
  if ((basename === 'research.md' || basename === 'review-report.md')
    && (parent === 'research' || parent === 'review')) {
    return segments.slice(specsIndex + 1, segments.length - 2).join('/');
  }

  return segments.slice(specsIndex + 1, segments.length - 1).join('/');
}

/** Resolve the owning spec folder (specs-root-relative) for a `graph-metadata.json` path. */
export function extractSpecFolderFromGraphMetadataPath(
  filePath: string | null | undefined,
): string | null {
  if (!isGraphMetadataPath(filePath)) {
    return null;
  }

  const normalizedPath = normalizeSpecPath(filePath);
  const segments = normalizedPath.split('/').filter(Boolean);
  const specsIndex = segments.findIndex((segment) => segment === 'specs');
  if (specsIndex < 0) {
    return null;
  }

  return segments.slice(specsIndex + 1, segments.length - 1).join('/');
}

// ───────────────────────────────────────────────────────────────
// 4. SHARED SPEC-FOLDER IDENTITY
// ───────────────────────────────────────────────────────────────

/** Canonical identity for one spec folder, derived from a single specs-root anchor. */
export interface SpecFolderIdentity {
  /** Specs-root-relative path, the same shape graph metadata stores in spec_folder. */
  specFolder: string;
  /** Specs-root-relative parent packet, or null when the folder sits directly at a root. */
  parentId: string | null;
  /** Specs-root-relative direct children that look like spec leaves. */
  childrenIds: string[];
}

/**
 * Raised when an absolute path cannot be anchored to any supported specs root.
 *
 * Callers that must keep deriving for a non-specs path can catch this and fall back,
 * but the resolver itself refuses to fabricate a caller-base or `..`-prefixed value so
 * the two generators can never disagree on what "outside the tree" means.
 */
export class SpecFolderIdentityError extends Error {
  readonly code = 'SPEC_FOLDER_OUTSIDE_ROOT';

  constructor(absFolder: string) {
    super(`Path does not resolve under a supported specs root: ${absFolder}`);
    this.name = 'SpecFolderIdentityError';
  }
}

/**
 * Locate the specs-root anchor index within an absolute folder's path segments.
 *
 * Prefers the canonical `.opencode/specs` pair so a repo that nests the string "specs"
 * elsewhere still resolves against the real root, and falls back to a bare `specs`
 * segment for legacy roots. Returns -1 when no anchor leaves a folder below it.
 */
function findSpecsAnchorIndex(segments: string[]): number {
  let canonical = -1;
  for (let index = 1; index < segments.length; index += 1) {
    if (segments[index] === 'specs' && segments[index - 1] === '.opencode') {
      canonical = index;
    }
  }
  if (canonical >= 0) {
    return canonical;
  }
  return segments.lastIndexOf('specs');
}

/**
 * Resolve the canonical specs-root-relative identity for an absolute spec folder.
 *
 * One source of identity for both the description.json and graph-metadata.json
 * generators: the path shape stops drifting between a caller-base-relative discovery
 * value and the specs-root-relative graph value, and the merge guard gets a single
 * parent/children computation to reconcile against. Identity comes from path segments
 * only; the one filesystem touch is the direct-child enumeration the build already does.
 *
 * @param absFolder - Absolute path to the spec folder.
 * @returns The specs-root-relative specFolder, parentId, and childrenIds.
 * @throws {SpecFolderIdentityError} When the path resolves outside any supported root.
 */
export function resolveSpecFolderIdentity(absFolder: string): SpecFolderIdentity {
  const normalized = absFolder.replace(/\\/g, '/');
  const segments = normalized.split('/').filter(Boolean);
  const anchorIndex = findSpecsAnchorIndex(segments);
  if (anchorIndex < 0 || anchorIndex >= segments.length - 1) {
    throw new SpecFolderIdentityError(absFolder);
  }

  const specFolder = segments.slice(anchorIndex + 1).join('/');
  const specFolderSegments = specFolder.split('/').filter(Boolean);

  let parentId: string | null = null;
  if (specFolderSegments.length >= 2 && isSpecLeafSegment(specFolderSegments[specFolderSegments.length - 2])) {
    parentId = specFolderSegments.slice(0, -1).join('/');
  }

  let childrenIds: string[] = [];
  try {
    childrenIds = fs.readdirSync(absFolder, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && isSpecLeafSegment(entry.name))
      .map((entry) => `${specFolder}/${entry.name}`)
      .sort();
  } catch {
    childrenIds = [];
  }

  return { specFolder, parentId, childrenIds };
}
