// ───────────────────────────────────────────────────────────────────
// MODULE: Graph Refresh
// ───────────────────────────────────────────────────────────────────
// @public — scripts should import from here, not handlers/ or lib/ internals.
// The save workflow names a spec folder however the caller wrote it (absolute
// path, cwd-relative, or bare folder id), so the resolver below has to try each
// shape before the parser can re-derive that folder's graph metadata.

import fs from 'node:fs';
import path from 'node:path';

import { findSpecDocuments } from '../lib/discovery/spec-document-finder.js';
import {
  refreshGraphMetadata as refreshGraphMetadataForResolvedFolder,
  type GraphMetadataRefreshOptions,
  type GraphMetadataRefreshResult,
} from '../lib/graph/graph-metadata-parser.js';

/** Resolves a caller-supplied spec folder name to an absolute directory; exported for tests. */
export function resolveSpecFolderPath(specFolder: string): string {
  if (path.isAbsolute(specFolder) && fs.existsSync(specFolder)) {
    return specFolder;
  }

  const cwd = process.cwd();
  const directCandidate = path.resolve(cwd, specFolder);
  if (fs.existsSync(directCandidate)) {
    return directCandidate;
  }

  const specsDirOverride = process.env.SPEC_KIT_SPECS_DIR?.trim() || process.env.SPECKIT_SPECS_DIR?.trim();
  if (specsDirOverride) {
    const overrideCandidate = path.resolve(cwd, specsDirOverride, specFolder);
    if (fs.existsSync(overrideCandidate)) {
      return overrideCandidate;
    }
  }

  const discoveredDocs = findSpecDocuments(cwd, { specFolder });
  if (discoveredDocs.length > 0) {
    return path.dirname(discoveredDocs[0]!);
  }

  // specs/ is canonical (top-level, post-flip); .opencode/specs is the legacy compat symlink.
  const canonicalCandidate = path.resolve(cwd, 'specs', specFolder);
  if (fs.existsSync(canonicalCandidate)) {
    return canonicalCandidate;
  }

  const legacyCandidate = path.resolve(cwd, '.opencode', 'specs', specFolder);
  if (fs.existsSync(legacyCandidate)) {
    return legacyCandidate;
  }

  throw new Error(`Unable to resolve spec folder path for ${specFolder}`);
}

/** Refreshes graph metadata for a spec folder using an explicit follow-up entry point. */
export function refreshGraphMetadata(
  specFolder: string,
  options: GraphMetadataRefreshOptions = {},
): GraphMetadataRefreshResult {
  return refreshGraphMetadataForResolvedFolder(resolveSpecFolderPath(specFolder), options);
}
