// ───────────────────────────────────────────────────────────────────
// MODULE: Workspace Identity
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. WORKSPACE IDENTITY
// ───────────────────────────────────────────────────────────────────
// Normalizes backend-native workspace paths to the canonical repo-local
// source-root anchor so native session capture can match equivalent roots
// across different CLI transcript formats. The source tree sits under
// .skilled or .opencode, and a checkout may link one name to the other, so
// either name anchors a workspace and two paths match by workspace root.

import * as fs from 'fs';
import * as path from 'path';

import { SOURCE_ROOT_NAMES } from '@spec-kit/runtime/hooks/lib/workspace/repo-root.mjs';

/** Canonical workspace paths and every raw/realpath variant that should match it. */
export interface WorkspaceIdentity {
  canonicalOpencodePath: string;
  workspaceRoot: string;
  inputPath: string;
  matchPaths: string[];
}

function normalizeRequestedPath(filePath: string): string {
  return path.resolve(filePath).replace(/\\/g, '/').replace(/\/+$/, '') || '/';
}

function normalizeAbsolutePath(filePath: string): string {
  const resolved = path.resolve(filePath);

  try {
    return fs.realpathSync.native(resolved).replace(/\\/g, '/').replace(/\/+$/, '') || '/';
  } catch {
    const suffix: string[] = [];
    let probe = resolved;

    while (!fs.existsSync(probe)) {
      const parent = path.dirname(probe);
      if (parent === probe) {
        return resolved.replace(/\\/g, '/').replace(/\/+$/, '') || '/';
      }

      suffix.unshift(path.basename(probe));
      probe = parent;
    }

    try {
      const canonicalBase = fs.realpathSync.native(probe);
      return path.join(canonicalBase, ...suffix).replace(/\\/g, '/').replace(/\/+$/, '') || '/';
    } catch {
      return resolved.replace(/\\/g, '/').replace(/\/+$/, '') || '/';
    }
  }
}

function safeStat(filePath: string): fs.Stats | null {
  try {
    return fs.statSync(filePath);
  } catch {
    return null;
  }
}

function isSourceRootName(name: string): boolean {
  return SOURCE_ROOT_NAMES.includes(name);
}

const SOURCE_TREE_SENTINEL = path.join('skills', 'system-spec-kit', 'SKILL.md');

// Today's checkout holds the real tree under one name beside an empty directory
// under the other, so a child tree that carries the spec-kit skill wins, and a
// bare directory anchors only when no child tree carries it.
function nestedSourceRoot(current: string): string | null {
  let bare: string | null = null;
  for (const name of SOURCE_ROOT_NAMES) {
    const candidate = path.join(current, name);
    if (!safeStat(candidate)?.isDirectory()) continue;
    if (fs.existsSync(path.join(candidate, SOURCE_TREE_SENTINEL))) return candidate;
    bare ??= candidate;
  }
  return bare;
}

// A directory named like a source root may itself be a checkout, such as a clone
// kept in a folder named .skilled. It is the workspace only when the tree inside it
// carries the spec-kit skill. Otherwise its own name makes it the source root, so a
// stray tree written directly inside a real source root stays a leak once the walk
// reaches that source root.
function anchorAt(current: string): string | null {
  const nested = nestedSourceRoot(current);
  if (!isSourceRootName(path.posix.basename(current))) return nested;
  return nested !== null && fs.existsSync(path.join(nested, SOURCE_TREE_SENTINEL)) ? nested : current;
}

function findNearestOpencodeDirectoryRaw(candidatePath: string): string | null {
  let current = normalizeRequestedPath(candidatePath);
  const initialStats = safeStat(current);

  if (initialStats?.isFile()) {
    current = normalizeRequestedPath(path.dirname(current));
  }

  while (true) {
    const anchor = anchorAt(current);
    if (anchor !== null) {
      return anchor === current ? current : normalizeRequestedPath(anchor);
    }

    const parent = normalizeRequestedPath(path.dirname(current));
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

function findNearestOpencodeDirectory(candidatePath: string): string | null {
  let current = normalizeAbsolutePath(candidatePath);
  const initialStats = safeStat(current);

  if (initialStats?.isFile()) {
    current = normalizeAbsolutePath(path.dirname(current));
  }

  while (true) {
    const anchor = anchorAt(current);
    if (anchor !== null) {
      return anchor === current ? current : normalizeAbsolutePath(anchor);
    }

    const parent = normalizeAbsolutePath(path.dirname(current));
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

function uniquePaths(paths: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const value of paths) {
    if (!value) {
      continue;
    }

    const normalized = normalizeRequestedPath(value);
    if (seen.has(normalized)) {
      continue;
    }

    seen.add(normalized);
    ordered.push(normalized);
  }

  return ordered;
}

// A linked checkout reaches one tree under both names, so every name whose tree carries
// the spec-kit skill is a variant, not only the name the walk anchored on.
function sourceTreeSpellings(root: string): string[] {
  return SOURCE_ROOT_NAMES
    .map((name) => path.join(root, name))
    .filter((candidate) => fs.existsSync(path.join(candidate, SOURCE_TREE_SENTINEL)));
}

/** Resolve a workspace path to its canonical source-root anchor plus every path variant that should match it. */
export function buildWorkspaceIdentity(workspacePath: string): WorkspaceIdentity {
  const requestedPath = normalizeRequestedPath(workspacePath);
  const inputPath = normalizeAbsolutePath(workspacePath);
  const rawCanonicalOpencodePath = findNearestOpencodeDirectoryRaw(requestedPath) ?? requestedPath;
  const canonicalOpencodePath = findNearestOpencodeDirectory(inputPath) ?? inputPath;
  const rawWorkspaceRoot = isSourceRootName(path.posix.basename(rawCanonicalOpencodePath))
    ? normalizeRequestedPath(path.dirname(rawCanonicalOpencodePath))
    : rawCanonicalOpencodePath;
  const workspaceRoot = isSourceRootName(path.posix.basename(canonicalOpencodePath))
    ? normalizeAbsolutePath(path.dirname(canonicalOpencodePath))
    : canonicalOpencodePath;

  return {
    canonicalOpencodePath,
    workspaceRoot,
    inputPath,
    matchPaths: uniquePaths([
      canonicalOpencodePath,
      workspaceRoot,
      inputPath,
      rawCanonicalOpencodePath,
      rawWorkspaceRoot,
      requestedPath,
      ...sourceTreeSpellings(workspaceRoot),
      ...sourceTreeSpellings(rawWorkspaceRoot),
    ]),
  };
}

/** Return every path variant that should match the given workspace path. */
export function getWorkspacePathVariants(workspacePath: string): string[] {
  return buildWorkspaceIdentity(workspacePath).matchPaths;
}

/** Check whether a candidate path resolves to the same workspace identity as workspacePath. */
export function isSameWorkspacePath(workspacePath: string, candidatePath: string | null | undefined): boolean {
  if (typeof candidatePath !== 'string' || candidatePath.trim().length === 0) {
    return false;
  }

  const identity = buildWorkspaceIdentity(workspacePath);
  const requestedCandidate = normalizeRequestedPath(candidatePath);
  const normalizedCandidate = normalizeAbsolutePath(candidatePath);

  if (identity.matchPaths.includes(requestedCandidate) || identity.matchPaths.includes(normalizedCandidate)) {
    return true;
  }

  // A linked checkout reaches one tree through two anchor names, so anchors can differ
  // while the workspace is the same. The root above the anchor is what must agree.
  const candidateAnchor = findNearestOpencodeDirectory(normalizedCandidate) ?? findNearestOpencodeDirectoryRaw(requestedCandidate);
  return candidateAnchor !== null && normalizeAbsolutePath(path.dirname(candidateAnchor)) === identity.workspaceRoot;
}

/** Make a file path relative to the workspace root when it falls under any known workspace path variant. */
export function toWorkspaceRelativePath(workspacePath: string, maybeFilePath: string): string {
  if (!maybeFilePath) {
    return '';
  }

  const normalizedInput = maybeFilePath.replace(/\\/g, '/');
  if (!path.isAbsolute(maybeFilePath)) {
    if (normalizedInput.startsWith('../')) {
      return '';
    }

    return normalizedInput.replace(/^\.\//, '').replace(/\/+$/, '');
  }

  const identity = buildWorkspaceIdentity(workspacePath);
  const normalizedAbsolute = normalizeAbsolutePath(maybeFilePath);
  const normalizedRoot = identity.workspaceRoot;

  if (normalizedAbsolute !== normalizedRoot && !normalizedAbsolute.startsWith(`${normalizedRoot}/`)) {
    return '';
  }

  return path.relative(normalizedRoot, normalizedAbsolute).replace(/\\/g, '/');
}

export {
  findNearestOpencodeDirectory,
  normalizeAbsolutePath,
};
