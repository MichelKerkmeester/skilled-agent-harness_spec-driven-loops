// ───────────────────────────────────────────────────────────────────
// MODULE: User Hook File Helpers
// ───────────────────────────────────────────────────────────────────
// A runtime's user-level hook file belongs to the operator, and a repo tool may
// only touch the entries it owns there. These helpers decide which entries a
// checkout owns, refuse to anchor a write at a linked worktree, and replace the
// file in one rename. The Codex installer and the Claude user-hook sync both use
// them, so the two read ownership the same way.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

// ───────────────────────────────────────────────────────────────────
// 2. HOOK IDENTITY
// ───────────────────────────────────────────────────────────────────

/**
 * The adapter a hook command runs: the first script passed to a supported
 * runner. Later fallback text is irrelevant.
 * @param {string} command - The hook's command string.
 * @returns {string} The script path, or the trimmed command when none matches.
 */
export function hookIdentity(command) {
  const match = String(command).match(
    /(?:^|[\s;&|])(?:[\w./~-]*\/)?(?:node|bash|python(?:3(?:\.\d+)?)?)\s+(?:"([^"]+\.(?:js|mjs|cjs|sh))"|'([^']+\.(?:js|mjs|cjs|sh))'|([^\s"';&|<>]+\.(?:js|mjs|cjs|sh)))/,
  );
  return match?.[1] || match?.[2] || match?.[3] || String(command).trim();
}

/**
 * Throw unless a parsed hook file is an object whose `hooks`, when present,
 * maps each event to an array.
 * @param {unknown} document - The parsed file.
 * @param {string} label - The name used in the error.
 */
export function validateHooksDocument(document, label) {
  if (!document || Array.isArray(document) || typeof document !== 'object') {
    throw new Error(`${label} hooks file must contain a JSON object`);
  }
  if (document.hooks === undefined) return;
  if (!document.hooks || Array.isArray(document.hooks) || typeof document.hooks !== 'object') {
    throw new Error(`${label} hooks property must contain an object`);
  }
  for (const [event, groups] of Object.entries(document.hooks)) {
    if (!Array.isArray(groups)) throw new Error(`${label} hook event ${event} must contain an array`);
  }
}

// The source tree sits under .skilled or .opencode, and a checkout may link one name to
// the other, so an adapter path spelled under either name is the same hook. An installed
// entry spelled under either name is the project's own.
const SOURCE_ROOT_NAMES = ['.skilled', '.opencode'];

/**
 * The adapter path below the source tree, or null for a path outside it.
 * @param {string} identity - A hook identity.
 * @returns {string|null} The path below `.skilled/` or `.opencode/`.
 */
export function sourceRootRelative(identity) {
  const name = SOURCE_ROOT_NAMES.find((candidate) => identity.startsWith(`${candidate}/`));
  return name ? identity.slice(name.length + 1) : null;
}

/**
 * A comparison key that spells the source tree one way, so both names compare equal.
 * @param {string} identity - A hook identity.
 * @returns {string} The key.
 */
export function ownershipKey(identity) {
  const relative = sourceRootRelative(identity);
  return relative === null ? identity : `.opencode/${relative}`;
}

/**
 * Whether an identity names a script under the source tree that no longer exists.
 * Identity is the adapter path, so renaming a script orphans its installed entry: it
 * no longer matches the project, and the preserve-third-party rule would keep a
 * command that can never run.
 * @param {string} identity - A hook identity.
 * @param {string} repoAbs - The checkout root.
 * @returns {boolean} True for a missing script under `.skilled/` or `.opencode/`.
 */
export function isRepoOrphan(identity, repoAbs) {
  if (typeof identity !== 'string' || sourceRootRelative(identity) === null) return false;
  return !fs.existsSync(path.join(repoAbs, identity));
}

// ───────────────────────────────────────────────────────────────────
// 3. REPOSITORY ANCHOR SAFETY
// ───────────────────────────────────────────────────────────────────

function canonicalPath(filePath) {
  try {
    return fs.realpathSync.native(filePath);
  } catch {
    return path.resolve(filePath);
  }
}

/**
 * Whether a checkout is a primary checkout rather than a linked worktree. A
 * folder git cannot inspect because git is missing counts as primary.
 * @param {string} repoAbs - The checkout root.
 * @returns {{primary: boolean, topLevel: string|null, primaryCheckout: string|null}} The answer and the paths behind it.
 */
export function checkoutKind(repoAbs) {
  const options = { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] };
  let commonDirOutput;
  let topLevelOutput;
  try {
    commonDirOutput = execFileSync('git', ['-C', repoAbs, 'rev-parse', '--git-common-dir'], options).trim();
    topLevelOutput = execFileSync('git', ['-C', repoAbs, 'rev-parse', '--show-toplevel'], options).trim();
  } catch (error) {
    if (error?.code === 'ENOENT') return { primary: true, topLevel: null, primaryCheckout: null };
    const detail = String(error?.stderr || '').trim();
    throw new Error(`Could not inspect Git checkout at ${repoAbs}${detail ? `: ${detail}` : ''}`);
  }
  const topLevel = canonicalPath(topLevelOutput);
  const commonDir = canonicalPath(path.resolve(repoAbs, commonDirOutput));
  const primaryGitDir = canonicalPath(path.join(topLevel, '.git'));
  return { primary: commonDir === primaryGitDir, topLevel, primaryCheckout: path.dirname(commonDir) };
}

/**
 * Throw when a write would anchor user hooks at a linked worktree, which may soon
 * be removed, unless the caller allows it.
 * @param {string} repoAbs - The checkout root.
 * @param {boolean} allowWorktree - Accept a linked worktree.
 */
export function assertSafeRepoAnchor(repoAbs, allowWorktree) {
  const kind = checkoutKind(repoAbs);
  if (kind.primary || allowWorktree) return;
  throw new Error(
    `Refusing to anchor hooks at linked worktree ${kind.topLevel}. `
      + `Primary checkout: ${kind.primaryCheckout}. Pass --allow-worktree to override.`,
  );
}

// ───────────────────────────────────────────────────────────────────
// 4. FILE OPERATIONS
// ───────────────────────────────────────────────────────────────────

/**
 * Replace a file through a temp file and one rename, so a reader never sees half a file.
 * @param {string} targetPath - The file to replace.
 * @param {string} content - The new content.
 * @param {number|null} existingMode - The mode to keep, or null for a new file.
 */
export function atomicWrite(targetPath, content, existingMode) {
  const targetDirectory = path.dirname(targetPath);
  fs.mkdirSync(targetDirectory, { recursive: true });
  const temporaryPath = path.join(
    targetDirectory,
    `.${path.basename(targetPath)}.tmp-${process.pid}-${Date.now()}`,
  );

  try {
    fs.writeFileSync(temporaryPath, content, {
      encoding: 'utf8',
      flag: 'wx',
      mode: existingMode ?? 0o666,
    });
    if (existingMode !== null) fs.chmodSync(temporaryPath, existingMode);
    fs.renameSync(temporaryPath, targetPath);
  } finally {
    if (fs.existsSync(temporaryPath)) fs.unlinkSync(temporaryPath);
  }
}

/**
 * Read and validate a hook file.
 * @param {string} filePath - The file.
 * @param {string} label - The name used in errors.
 * @returns {Object} The parsed document.
 */
export function readHooksFile(filePath, label) {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    throw new Error(`Could not read ${label} hooks file ${filePath}: ${error.message}`);
  }
  validateHooksDocument(parsed, label);
  return parsed;
}
