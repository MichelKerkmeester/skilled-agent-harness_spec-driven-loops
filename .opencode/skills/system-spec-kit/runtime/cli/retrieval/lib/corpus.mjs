// ───────────────────────────────────────────────────────────────────
// MODULE: Corpus Walker
// ───────────────────────────────────────────────────────────────────
// Deterministic markdown discovery over the two documentation roots. The walk
// is sorted at every level and dedupes by real path, so a document reachable
// through more than one route is indexed exactly once and two runs on the same
// tree visit files in the same order.
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

import { compareCodeUnits } from './normalize.mjs';

// ───────────────────────────────────────────────────────────────────
// 1. CONTRACT
// ───────────────────────────────────────────────────────────────────

/**
 * Walk roots, in the order they are visited. `.opencode/install-guides`
 * carries well-formed `trigger_phrases` frontmatter and is already reachable
 * by the ripgrep lane's broader `.opencode` root, so leaving it out here would
 * be a pure asymmetry rather than a deliberate scope choice. Root `README.md`
 * and the five runtime mirrors (`.claude`, `.codex`, `.cursor`, `.devin`,
 * `.pi`) are deliberately excluded from both lanes; see
 * `references/retrieval/retrieval-conventions.md` for the full coverage table
 * and the reason for every root decision.
 */
export const CORPUS_ROOTS = Object.freeze(['specs', '.opencode/skills', '.opencode/install-guides']);

/** Human-readable exclusion list recorded in the manifest. */
export const EXCLUSIONS = Object.freeze([
  '**/z_archive/**',
  '**/node_modules/**',
  '**/scratch/**',
  '**/research/lineages/**',
  '**/tests/fixtures/**',
  '**/{fixtures,__fixtures__,test-fixtures,*-fixtures}/** outside specs/',
  '.git',
]);

/**
 * Documents that are walked and hashed like any other, but whose untrusted
 * trigger declaration must not fail publication closed. Every entry carries the
 * reason it is exempt, because an exemption nobody can justify later is how a
 * fail-closed gate quietly becomes advisory. The exemption covers the refusal
 * only: the document still produces its diagnostic row, and any phrase it did
 * parse is still indexed.
 *
 * @type {ReadonlyArray<{ path: string, reason: string }>}
 */
export const IGNORED_PATHS = Object.freeze([
  Object.freeze({
    path: 'specs/sk-doc/016-create-diff-mode/014-skill-readme-standardization/012-mcp-chrome-devtools-readme/context/seats/iter-002/deepseek.extracted.md',
    reason: 'captured model transcript whose leading rule pair is not frontmatter',
  }),
]);

/**
 * Directory names pruned wherever they appear. Exported so the retrieval
 * parity harness can walk the real policy instead of a hand-copied guess —
 * an exclusion added here without a matching divergence-table entry is
 * exactly what that test exists to catch.
 */
export const EXCLUDED_DIR_NAMES = Object.freeze(new Set(['z_archive', 'node_modules', 'scratch', '.git', 'dist']));

/**
 * Test-fixture directory names. A fixture tree holds documents written to be
 * wrong on purpose, so indexing one is harmful twice over: the deliberately
 * unparseable frontmatter fails publication closed for the whole corpus, and
 * the parseable fixtures inject test phrases into real postings, where a
 * lookup cannot tell them from an author's. Exported for the same reason as
 * EXCLUDED_DIR_NAMES above.
 */
export const FIXTURE_DIR_PATTERN = /^(?:fixtures|__fixtures__|test-fixtures|[a-z][a-z0-9]*(?:-[a-z0-9]+)*-fixtures)$/;

/**
 * The root under which a directory is a document rather than tooling. Inside a
 * spec packet, a folder named `fixtures` is part of what the packet documents
 * and belongs in the index; the same name inside the skills tree is test data.
 * Scoping the fixture rule this way is not a nicety — an unscoped rule prunes
 * packet directories such as `002-contracts-and-fixtures` and silently drops
 * real specification documents out of retrieval.
 */
const DOCUMENT_ROOT = 'specs';

/**
 * Paths under this prefix are the same documents as the corresponding `specs/`
 * paths; the repository exposes it as a convenience symlink.
 */
const ALIAS_PREFIX = '.opencode/specs/';
const ALIAS_TARGET = 'specs/';

// ───────────────────────────────────────────────────────────────────
// 2. HELPERS
// ───────────────────────────────────────────────────────────────────

/**
 * Folds the `.opencode/specs` alias onto its canonical `specs` form.
 *
 * @param {string} relativePath Repo-relative POSIX path.
 * @returns {string} Canonical repo-relative path.
 */
export function canonicalRelativePath(relativePath) {
  if (relativePath === '.opencode/specs') return 'specs';
  if (relativePath.startsWith(ALIAS_PREFIX)) {
    return `${ALIAS_TARGET}${relativePath.slice(ALIAS_PREFIX.length)}`;
  }
  return relativePath;
}

/**
 * Directory pruning rule. `research/lineages` is pruned only under a `research`
 * parent so an unrelated directory named `lineages` still gets walked, and a
 * fixture directory is pruned only outside the document root for the reason
 * recorded at DOCUMENT_ROOT.
 *
 * @param {string} name Directory name.
 * @param {string} parentName Parent directory name.
 * @param {string} [relativePath] Repo-relative path of the directory.
 * @returns {boolean} True when the directory must not be walked.
 */
export function isExcludedDirectory(name, parentName, relativePath = '') {
  if (EXCLUDED_DIR_NAMES.has(name)) return true;
  if (name === 'lineages' && parentName === 'research') return true;
  return FIXTURE_DIR_PATTERN.test(name) && relativePath.split('/')[0] !== DOCUMENT_ROOT;
}

// ───────────────────────────────────────────────────────────────────
// 3. WALK
// ───────────────────────────────────────────────────────────────────

/**
 * Collects every markdown document in the corpus.
 *
 * @param {string} repoRoot Absolute repository root.
 * @param {{ roots?: readonly string[] }} [options] Root override for fixtures.
 * @returns {{ files: string[], skipped: Array<{ path: string, reason: string }> }}
 *   Sorted canonical relative paths plus everything deliberately not walked.
 */
export function walkCorpus(repoRoot, options = {}) {
  const roots = options.roots ?? CORPUS_ROOTS;
  /** @type {Map<string, { canonical: string, isLink: boolean }>} */
  const byRealPath = new Map();
  /** @type {Array<{ path: string, reason: string }>} */
  const skipped = [];

  for (const root of roots) {
    const absoluteRoot = path.join(repoRoot, root);
    if (!fs.existsSync(absoluteRoot)) {
      skipped.push({ path: root, reason: 'root does not exist' });
      continue;
    }
    walkDirectory(repoRoot, absoluteRoot, byRealPath, skipped);
  }

  const files = Array.from(byRealPath.values(), (entry) => entry.canonical).sort(compareCodeUnits);
  skipped.sort((a, b) => compareCodeUnits(a.path, b.path) || compareCodeUnits(a.reason, b.reason));
  return { files, skipped };
}

/**
 * @param {string} repoRoot Absolute repository root.
 * @param {string} directory Absolute directory being walked.
 * @param {Map<string, { canonical: string, isLink: boolean }>} byRealPath Accumulator keyed by resolved path.
 * @param {Array<{ path: string, reason: string }>} skipped Accumulator for pruned entries.
 * @returns {void}
 */
function walkDirectory(repoRoot, directory, byRealPath, skipped) {
  let entries;
  try {
    entries = fs.readdirSync(directory, { withFileTypes: true });
  } catch (error) {
    skipped.push({
      path: toRelative(repoRoot, directory),
      reason: `unreadable directory: ${error instanceof Error ? error.message : String(error)}`,
    });
    return;
  }

  entries.sort((a, b) => compareCodeUnits(a.name, b.name));
  const parentName = path.basename(directory);

  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    const relative = toRelative(repoRoot, absolute);

    if (entry.isSymbolicLink()) {
      let stats;
      try {
        stats = fs.statSync(absolute);
      } catch {
        skipped.push({ path: relative, reason: 'broken symlink' });
        continue;
      }
      if (stats.isDirectory()) {
        // Symlinked directories are never walked: their targets already appear
        // under a canonical route, and following them risks cycles.
        skipped.push({ path: relative, reason: 'symlinked directory' });
        continue;
      }
      if (stats.isFile() && entry.name.endsWith('.md')) {
        recordFile(repoRoot, absolute, relative, true, byRealPath, skipped);
      }
      continue;
    }

    if (entry.isDirectory()) {
      if (isExcludedDirectory(entry.name, parentName, relative)) {
        skipped.push({ path: relative, reason: 'excluded directory' });
        continue;
      }
      walkDirectory(repoRoot, absolute, byRealPath, skipped);
      continue;
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      recordFile(repoRoot, absolute, relative, false, byRealPath, skipped);
    }
  }
}

/**
 * Records a document under its resolved identity so the same bytes are never
 * indexed twice. When two routes reach one document the document's own
 * location wins over a link to it, and two routes of the same kind are settled
 * by the lower path, so the winner never depends on walk order.
 *
 * A link whose target resolves outside the repository is refused rather than
 * indexed: the generator reads bytes through the link, and a committed index
 * must never carry content that is not in the tree it describes.
 *
 * @param {string} repoRoot Absolute repository root.
 * @param {string} absolute Absolute file path.
 * @param {string} relative Repo-relative file path.
 * @param {boolean} isLink Whether this route is a symlink.
 * @param {Map<string, { canonical: string, isLink: boolean }>} byRealPath Accumulator keyed by resolved path.
 * @param {Array<{ path: string, reason: string }>} skipped Accumulator for pruned entries.
 * @returns {void}
 */
function recordFile(repoRoot, absolute, relative, isLink, byRealPath, skipped) {
  let realPath;
  try {
    realPath = fs.realpathSync(absolute);
  } catch {
    skipped.push({ path: relative, reason: 'unresolvable path' });
    return;
  }
  if (isLink && !isInsideRoot(repoRoot, realPath)) {
    skipped.push({ path: relative, reason: 'symlink target outside the repository' });
    return;
  }

  const canonical = canonicalRelativePath(relative);
  const existing = byRealPath.get(realPath);
  if (existing === undefined) {
    byRealPath.set(realPath, { canonical, isLink });
    return;
  }

  const incomingWins = (existing.isLink && !isLink)
    || (existing.isLink === isLink && compareCodeUnits(canonical, existing.canonical) < 0);
  if (incomingWins) {
    skipped.push({ path: existing.canonical, reason: 'duplicate of an already-indexed document' });
    byRealPath.set(realPath, { canonical, isLink });
    return;
  }
  skipped.push({ path: relative, reason: 'duplicate of an already-indexed document' });
}

/**
 * @param {string} repoRoot Absolute repository root.
 * @param {string} realPath Resolved absolute path.
 * @returns {boolean} Whether the resolved path sits under the resolved root.
 */
function isInsideRoot(repoRoot, realPath) {
  let rootReal;
  try {
    rootReal = fs.realpathSync(repoRoot);
  } catch {
    rootReal = repoRoot;
  }
  return realPath === rootReal || realPath.startsWith(rootReal + path.sep);
}

/**
 * @param {string} repoRoot Absolute repository root.
 * @param {string} absolute Absolute path.
 * @returns {string} Repo-relative POSIX path.
 */
function toRelative(repoRoot, absolute) {
  return path.relative(repoRoot, absolute).split(path.sep).join('/');
}
