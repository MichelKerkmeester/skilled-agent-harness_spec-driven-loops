## Edit 1

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts`

OLD:

~~~~text
// Normalizes backend-native workspace paths to the canonical repo-local
// .opencode anchor so native session capture can match equivalent roots
// across different CLI transcript formats.

import * as fs from 'fs';
import * as path from 'path';

/** Canonical workspace paths and every raw/realpath variant that should match it. */
~~~~

NEW:

~~~~text
// Normalizes backend-native workspace paths to the canonical repo-local
// source-root anchor so native session capture can match equivalent roots
// across different CLI transcript formats. The source tree sits under
// .skilled or .opencode, and a checkout may link one name to the other, so
// either name anchors a workspace and two paths match by workspace root.

import * as fs from 'fs';
import * as path from 'path';

import { SOURCE_ROOT_NAMES } from '@spec-kit/runtime/hooks/lib/workspace/repo-root.mjs';

/** Canonical workspace paths and every raw/realpath variant that should match it. */
~~~~

## Edit 2

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts`

OLD:

~~~~text
}

function findNearestOpencodeDirectoryRaw(candidatePath: string): string | null {
~~~~

NEW:

~~~~text
}

function isSourceRootName(name: string): boolean {
  return SOURCE_ROOT_NAMES.includes(name);
}

function findNearestOpencodeDirectoryRaw(candidatePath: string): string | null {
~~~~

## Edit 3

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts`

OLD:

~~~~text
  while (true) {
    if (path.posix.basename(current) === '.opencode') {
      return current;
    }

    const nestedOpencode = path.join(current, '.opencode');
    const nestedStats = safeStat(nestedOpencode);
    if (nestedStats?.isDirectory()) {
      return normalizeRequestedPath(nestedOpencode);
    }
~~~~

NEW:

~~~~text
  while (true) {
    if (isSourceRootName(path.posix.basename(current))) {
      return current;
    }

    for (const name of SOURCE_ROOT_NAMES) {
      const nestedSourceRoot = path.join(current, name);
      if (safeStat(nestedSourceRoot)?.isDirectory()) {
        return normalizeRequestedPath(nestedSourceRoot);
      }
    }
~~~~

## Edit 4

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts`

OLD:

~~~~text
  while (true) {
    if (path.posix.basename(current) === '.opencode') {
      return current;
    }

    const nestedOpencode = path.join(current, '.opencode');
    const nestedStats = safeStat(nestedOpencode);
    if (nestedStats?.isDirectory()) {
      return normalizeAbsolutePath(nestedOpencode);
    }
~~~~

NEW:

~~~~text
  while (true) {
    if (isSourceRootName(path.posix.basename(current))) {
      return current;
    }

    for (const name of SOURCE_ROOT_NAMES) {
      const nestedSourceRoot = path.join(current, name);
      if (safeStat(nestedSourceRoot)?.isDirectory()) {
        return normalizeAbsolutePath(nestedSourceRoot);
      }
    }
~~~~

## Edit 5

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts`

OLD:

~~~~text
}

/** Resolve a workspace path to its canonical .opencode anchor plus every path variant that should match it. */
export function buildWorkspaceIdentity(workspacePath: string): WorkspaceIdentity {
~~~~

NEW:

~~~~text
}

/** Resolve a workspace path to its canonical source-root anchor plus every path variant that should match it. */
export function buildWorkspaceIdentity(workspacePath: string): WorkspaceIdentity {
~~~~

## Edit 6

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts`

OLD:

~~~~text
  const canonicalOpencodePath = findNearestOpencodeDirectory(inputPath) ?? inputPath;
  const rawWorkspaceRoot = path.posix.basename(rawCanonicalOpencodePath) === '.opencode'
    ? normalizeRequestedPath(path.dirname(rawCanonicalOpencodePath))
    : rawCanonicalOpencodePath;
  const workspaceRoot = path.posix.basename(canonicalOpencodePath) === '.opencode'
    ? normalizeAbsolutePath(path.dirname(canonicalOpencodePath))
~~~~

NEW:

~~~~text
  const canonicalOpencodePath = findNearestOpencodeDirectory(inputPath) ?? inputPath;
  const rawWorkspaceRoot = isSourceRootName(path.posix.basename(rawCanonicalOpencodePath))
    ? normalizeRequestedPath(path.dirname(rawCanonicalOpencodePath))
    : rawCanonicalOpencodePath;
  const workspaceRoot = isSourceRootName(path.posix.basename(canonicalOpencodePath))
    ? normalizeAbsolutePath(path.dirname(canonicalOpencodePath))
~~~~

## Edit 7

File: `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts`

OLD:

~~~~text
  }

  const candidateIdentity = findNearestOpencodeDirectory(normalizedCandidate) ?? findNearestOpencodeDirectoryRaw(requestedCandidate);
  return candidateIdentity !== null && normalizeAbsolutePath(candidateIdentity) === identity.canonicalOpencodePath;
}
~~~~

NEW:

~~~~text
  }

  // A linked checkout reaches one tree through two anchor names, so anchors can differ
  // while the workspace is the same. The root above the anchor is what must agree.
  const candidateAnchor = findNearestOpencodeDirectory(normalizedCandidate) ?? findNearestOpencodeDirectoryRaw(requestedCandidate);
  return candidateAnchor !== null && normalizeAbsolutePath(path.dirname(candidateAnchor)) === identity.workspaceRoot;
}
~~~~
