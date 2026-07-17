// ───────────────────────────────────────────────────────────────────
// MODULE: Spec Root Canonical Resolver
// ───────────────────────────────────────────────────────────────────

import * as fs from 'node:fs';
import * as path from 'node:path';

// ───────────────────────────────────────────────────────────────────
// 1. HELPERS
// ───────────────────────────────────────────────────────────────────

function isQualifiedSpecPath(rawPath: string): boolean {
  const segments = rawPath.split(/[\\/]+/u);
  while (segments[0] === '.') segments.shift();

  return segments[0] === 'specs'
    || (segments[0] === '.opencode' && segments[1] === 'specs');
}

function isDirectory(candidatePath: string): boolean {
  try {
    return fs.statSync(candidatePath).isDirectory();
  } catch (_error: unknown) {
    return false;
  }
}

function assertWithinRoot(candidatePath: string, rootPath: string): void {
  const relativePath = path.relative(rootPath, candidatePath);
  if (
    relativePath === '..'
    || relativePath.startsWith(`..${path.sep}`)
    || path.isAbsolute(relativePath)
  ) {
    throw new Error(`Unqualified spec folder path escapes the canonical root: ${candidatePath}`);
  }
}

// ───────────────────────────────────────────────────────────────────
// 2. PUBLIC API
// ───────────────────────────────────────────────────────────────────

/** Resolve a spec-folder argument while preserving explicit root selection. */
export function resolveSpecFolderCanonical(rawArg: string, workspacePath: string): string {
  const trimmedArg = rawArg.trim();
  if (!trimmedArg) {
    throw new TypeError('A non-empty spec folder argument is required.');
  }

  const resolvedWorkspace = path.resolve(workspacePath);
  if (path.isAbsolute(trimmedArg)) {
    return path.resolve(trimmedArg);
  }
  if (isQualifiedSpecPath(trimmedArg)) {
    return path.resolve(resolvedWorkspace, trimmedArg);
  }

  const canonicalRoot = path.join(resolvedWorkspace, '.opencode', 'specs');
  const canonicalCandidate = path.resolve(canonicalRoot, trimmedArg);
  assertWithinRoot(canonicalCandidate, canonicalRoot);

  if (isDirectory(canonicalCandidate)) {
    return canonicalCandidate;
  }

  const legacyRoot = path.join(resolvedWorkspace, 'specs');
  const legacyCandidate = path.resolve(legacyRoot, trimmedArg);
  if (isDirectory(legacyCandidate)) {
    return legacyCandidate;
  }

  return canonicalCandidate;
}
