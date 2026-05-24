// ───────────────────────────────────────────────────────────────
// MODULE: CocoIndex Binary Path Resolver
// ───────────────────────────────────────────────────────────────

import { existsSync, realpathSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isWithinWorkspace } from '../utils/workspace-path.js';

const COCOINDEX_RELATIVE_PATH = '.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc';

function resolveProjectRoot(): string {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  let current = moduleDir;
  for (let i = 0; i < 10; i++) {
    if (existsSync(resolve(current, '.opencode'))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return process.cwd();
}

let cachedRoot: string | null = null;

function getProjectRoot(): string {
  if (!cachedRoot) {
    cachedRoot = resolveProjectRoot();
  }
  return cachedRoot;
}

export function getCocoIndexBinaryPath(workspaceRoot: string = getProjectRoot()): string {
  const root = resolve(workspaceRoot);
  const configured = process.env.COCOINDEX_BIN_PATH?.trim();
  const candidate = resolve(root, configured || COCOINDEX_RELATIVE_PATH);
  const canonicalWorkspace = realpathSync.native(root);
  const canonicalCandidate = existsSync(candidate) ? realpathSync.native(candidate) : candidate;
  if (!isWithinWorkspace(canonicalWorkspace, canonicalCandidate)) {
    throw new Error(`COCOINDEX_BIN_PATH must stay within the workspace root: ${canonicalWorkspace}`);
  }
  if (configured && canonicalCandidate !== resolve(root, COCOINDEX_RELATIVE_PATH)) {
    const expected = resolve(root, COCOINDEX_RELATIVE_PATH);
    const canonicalExpected = existsSync(expected) ? realpathSync.native(expected) : expected;
    if (canonicalCandidate !== canonicalExpected && process.env.SPECKIT_ALLOW_UNSAFE_COCOINDEX_BIN_PATH !== '1') {
      throw new Error(`COCOINDEX_BIN_PATH must resolve to ${COCOINDEX_RELATIVE_PATH}`);
    }
  }
  return canonicalCandidate;
}

export function isCocoIndexAvailable(): boolean {
  return existsSync(getCocoIndexBinaryPath());
}

export function _resetCachedRoot(): void {
  cachedRoot = null;
}
