// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Lazy Git Repository Context                                  ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Cache repository state lazily for each advisory evaluation.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Advisories are worth nothing if they cost latency on every Bash command, and most commands
// are not git at all. So nothing here runs until a check actually asks for it, and each answer
// is cached for the lifetime of one hook invocation.
//
// Everything read here is state that exists BEFORE the command runs. That boundary is the whole
// design: a preflight advisory that needs the command's result is not a preflight advisory. Where
// a question can only be answered afterwards, there is deliberately no accessor for it.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const GIT_TIMEOUT_MS = 1500;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run a git command and return trimmed stdout, or null on any failure.
 *
 * Fails soft on purpose. A hook that throws because a repository is in an odd state would
 * block work for no safety gain, and the advisory it would have printed is never worth that.
 */
function git(args, cwd) {
  try {
    return execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      timeout: GIT_TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 8 * 1024 * 1024,
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Run a git command and report how it failed, not merely that it did.
 *
 * Some git failures are the answer rather than an obstacle: `add --dry-run` against a pathspec
 * matching nothing exits non-zero and says so. Collapsing that into null would make the check
 * fail open on exactly the case it exists to catch.
 *
 * @returns {{ok:boolean, stdout:string, stderr:string}}
 */
function gitTry(args, cwd) {
  try {
    const stdout = execFileSync('git', args, {
      cwd,
      encoding: 'utf8',
      timeout: GIT_TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 8 * 1024 * 1024,
    });
    return { ok: true, stdout: stdout.trim(), stderr: '' };
  } catch (err) {
    return {
      ok: false,
      stdout: String(err?.stdout || '').trim(),
      stderr: String(err?.stderr || '').trim(),
    };
  }
}

function lines(value) {
  if (!value) return [];
  return value.split('\n').filter((l) => l.length > 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CONTEXT FACTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Build a lazily-evaluated view of pre-execution repository state.
 *
 * @param {string} [cwd] - Directory to inspect. Defaults to the process working directory.
 * @returns {object} Accessors; each computes at most once.
 */
export function createGitContext(cwd = process.cwd()) {
  const cache = new Map();
  // Contexts for other directories, so a command carrying `-C <dir>` or a leading
  // `cd <dir> &&` reads that directory's state without rebuilding on every check.
  const rooted = new Map();

  const memo = (key, compute) => {
    if (!cache.has(key)) cache.set(key, compute());
    return cache.get(key);
  };

  const api = {
    cwd,

    /**
     * A context rooted at another directory, memoized per directory.
     *
     * A git command can move the directory it runs in with `-C <dir>` or a leading
     * `cd <dir> &&`, and the state a check must read belongs to that directory rather than the
     * session's. Only the directory changes: the same lazy, cached, fail-soft accessors apply.
     */
    forDir: (dir) => {
      if (!dir || dir === cwd) return api;
      if (!rooted.has(dir)) rooted.set(dir, createGitContext(dir));
      return rooted.get(dir);
    },

    /** True when cwd is inside a git work tree at all. Every other accessor assumes this. */
    isRepo: () => memo('isRepo', () => git(['rev-parse', '--is-inside-work-tree'], cwd) === 'true'),

    /** Raw porcelain v1 status lines, the substrate for the staged/untracked/modified splits. */
    porcelain: () => memo('porcelain', () => lines(git(['status', '--porcelain'], cwd))),

    /** Paths with staged content differing from HEAD. */
    stagedPaths: () => memo('stagedPaths', () => lines(git(['diff', '--cached', '--name-only'], cwd))),

    /** Paths git reports as untracked. These are the paths a pathspec commit silently skips. */
    untrackedPaths: () => memo('untrackedPaths', () =>
      api.porcelain().filter((l) => l.startsWith('??')).map((l) => l.slice(3))),

    /** Count of dirty entries, used to size the blast radius of sweeping operations. */
    dirtyCount: () => memo('dirtyCount', () => api.porcelain().length),

    /** Current branch name, or null when HEAD is detached. */
    branch: () => memo('branch', () => {
      const b = git(['rev-parse', '--abbrev-ref', 'HEAD'], cwd);
      return !b || b === 'HEAD' ? null : b;
    }),

    /** True when HEAD is detached; a push from here does not move any local branch. */
    isDetached: () => memo('isDetached', () => api.branch() === null),

    /**
     * True when this checkout is a linked worktree rather than the primary one.
     *
     * Distinguished structurally: a linked worktree's git dir differs from the common dir.
     * That is the same signal the session wrapper uses, so the two agree by construction.
     */
    isLinkedWorktree: () => memo('isLinkedWorktree', () => {
      const gitDir = git(['rev-parse', '--absolute-git-dir'], cwd);
      const commonDir = git(['rev-parse', '--path-format=absolute', '--git-common-dir'], cwd);
      if (!gitDir || !commonDir) return false;
      return gitDir !== commonDir;
    }),

    /** core.ignorecase, which decides whether a case-only pathspec can silently fold. */
    ignoreCase: () => memo('ignoreCase', () => git(['config', 'core.ignorecase'], cwd) === 'true'),

    /** Tracked paths, lowercased, for case-insensitive pathspec comparison. */
    trackedLowercase: () => memo('trackedLowercase', () =>
      new Set(lines(git(['ls-files'], cwd)).map((p) => p.toLowerCase()))),

    /** Tracked paths as written on disk. */
    tracked: () => memo('tracked', () => new Set(lines(git(['ls-files'], cwd)))),

    /**
     * Ask git what a pathspec would actually stage, without touching the index.
     *
     * `add --dry-run` is the only honest source: reimplementing pathspec expansion, gitignore
     * precedence and case folding would drift from git's behaviour, and a rule built on a
     * drifting model of git produces false positives.
     *
     * The status matters as much as the file list, because three very different situations all
     * produce no output: a pathspec matching nothing, a pathspec matching only ignored files,
     * and a pathspec naming a tracked file that simply has no pending change. The first two are
     * worth a word; the third is ordinary work. An earlier version collapsed them, and the
     * resulting advisory fired on every add of an unmodified file.
     *
     * @returns {{status:'ok'|'unmatched'|'ignored'|'error', added:string[]}}
     */
    addDryRun: (paths) => memo(`addDryRun:${paths.join(' ')}`, () => {
      const r = gitTry(['add', '--dry-run', '--', ...paths], cwd);
      if (r.ok) {
        return { status: 'ok', added: lines(r.stdout).map((l) => l.replace(/^add '(.*)'$/, '$1')) };
      }
      if (/did not match any file/.test(r.stderr)) return { status: 'unmatched', added: [] };
      if (/paths are ignored by/.test(r.stderr)) return { status: 'ignored', added: [] };
      return { status: 'error', added: [] };
    }),

    /** Paths under a pathspec that git considers ignored. */
    checkIgnore: (paths) => memo(`checkIgnore:${paths.join(' ')}`, () =>
      lines(git(['check-ignore', '--', ...paths], cwd))),

    /** Paths under a pathspec with changes staged relative to HEAD. */
    stagedUnder: (paths) => memo(`stagedUnder:${paths.join(' ')}`, () =>
      lines(git(['diff', '--cached', '--name-only', '--', ...paths], cwd))),

    /** Paths under a pathspec with unstaged working-tree changes. */
    unstagedUnder: (paths) => memo(`unstagedUnder:${paths.join(' ')}`, () =>
      lines(git(['diff', '--name-only', '--', ...paths], cwd))),

    /**
     * Attribute value for a path, used to detect content filters that rewrite what gets committed.
     *
     * A clean filter makes the committed blob differ from the file on disk, so the operator
     * reviews one thing and commits another. Nothing else in git behaves this way, which is
     * exactly why it is worth naming out loud.
     */
    filterFor: (path) => memo(`filter:${path}`, () => {
      const out = git(['check-attr', 'filter', '--', path], cwd);
      if (!out) return null;
      const m = out.match(/: filter: (.+)$/);
      if (!m || m[1] === 'unspecified' || m[1] === 'unset') return null;
      return m[1];
    }),

    /**
     * What `git clean` would actually delete, asked of git itself via its dry run.
     *
     * The extra flags matter: without -d directories are skipped and without -x ignored files
     * survive, so the danger of a clean invocation cannot be judged from the verb — only from
     * what this dry run returns for the exact flag combination on the table.
     */
    cleanDryRun: (withDirs, withIgnored) => memo(`cleanDryRun:${withDirs}:${withIgnored}`, () => {
      const args = ['clean', '-n'];
      if (withDirs) args.push('-d');
      if (withIgnored) args.push('-x');
      const out = git(args, cwd);
      if (out === null) return null;
      return lines(out).map((l) => l.replace(/^Would (remove|skip repository) /, ''));
    }),

    /**
     * Branches not merged into HEAD — the set where a forced delete destroys unique commits.
     *
     * This mirrors git's own `-d` guard exactly, which is the point: `-D` exists to bypass that
     * guard, so the advisory should fire precisely where the guard would have.
     */
    unmergedBranches: () => memo('unmergedBranches', () =>
      new Set(lines(git(['branch', '--no-merged', 'HEAD', '--format=%(refname:short)'], cwd)))),

    /** Number of stash entries — what `stash clear` would irreversibly discard. */
    stashCount: () => memo('stashCount', () => lines(git(['stash', 'list'], cwd)).length),
  };

  return api;
}
