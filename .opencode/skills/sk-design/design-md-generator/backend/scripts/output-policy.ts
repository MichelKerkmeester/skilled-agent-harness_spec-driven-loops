// ────────────────────────────────────────────────────────────────
// MODULE: Output Path Policy
// ────────────────────────────────────────────────────────────────
//
// Single enforcement point for where md-generator scripts may write. Every
// script that writes generated artifacts (extract, guided-run, report-gen,
// preview-gen, proof) resolves its output path through here instead of its
// own ad-hoc blocklist check, so the boundary and overwrite rules can never
// drift apart between callers.

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

const PACKAGE_ROOT = path.resolve(__dirname, '..', '..');
const SKILLS_ROOT = path.resolve(PACKAGE_ROOT, '..', '..');
const SANDBOX_PREFIX = path.join(os.tmpdir(), 'skd-');

function findRepoRoot(startDir: string): string {
  let dir = startDir;
  for (;;) {
    if (fs.existsSync(path.join(dir, '.git'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return startDir;
    dir = parent;
  }
}

const REPO_ROOT = findRepoRoot(PACKAGE_ROOT);
const SPECS_ROOT = path.join(REPO_ROOT, '.opencode', 'specs');

function isInsideOrEqual(target: string, root: string): boolean {
  const relative = path.relative(root, target);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

export interface OutputPolicyResult {
  ok: boolean;
  resolvedPath: string;
  boundary: 'spec-folder' | 'sandbox' | null;
  reason?: string;
}

// Positive allowlist (spec-folder or approved sandbox) instead of a blocklist:
// a bare "not inside the skill" check lets any other path through unchecked.
export function resolveOutputPath(requestedPath: string, cwd: string = process.cwd()): OutputPolicyResult {
  if (!requestedPath) {
    return { ok: false, resolvedPath: '', boundary: null, reason: 'output path is required' };
  }
  const resolvedPath = path.resolve(cwd, requestedPath);

  if (isInsideOrEqual(resolvedPath, SKILLS_ROOT)) {
    return {
      ok: false,
      resolvedPath,
      boundary: null,
      reason: `refusing to write inside the skills directory (${SKILLS_ROOT})`,
    };
  }
  if (isInsideOrEqual(resolvedPath, SPECS_ROOT)) {
    return { ok: true, resolvedPath, boundary: 'spec-folder' };
  }
  if (resolvedPath.startsWith(SANDBOX_PREFIX)) {
    return { ok: true, resolvedPath, boundary: 'sandbox' };
  }
  return {
    ok: false,
    resolvedPath,
    boundary: null,
    reason: `output path must be inside a spec folder (${SPECS_ROOT}) or an approved sandbox (${SANDBOX_PREFIX}*)`,
  };
}

export function requireOutputPath(requestedPath: string, cwd?: string): string {
  const result = resolveOutputPath(requestedPath, cwd);
  if (!result.ok) {
    throw new Error(result.reason ?? `invalid output path: ${requestedPath}`);
  }
  return result.resolvedPath;
}

// Every generated artifact (report.html, preview.html, proof.html,
// proof-data.json) is a fixed name in the output directory, so a second run
// against the same directory would otherwise clobber the first silently.
export function ensureWritableFile(filePath: string, options: { force?: boolean } = {}): void {
  if (!options.force && fs.existsSync(filePath)) {
    throw new Error(`refusing to overwrite existing file without --force: ${filePath}`);
  }
}

export const outputPolicyRoots = { PACKAGE_ROOT, SKILLS_ROOT, REPO_ROOT, SPECS_ROOT, SANDBOX_PREFIX };
