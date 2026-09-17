// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Git Preflight Advisory Rule Checks                           ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Parse direct git commands and evaluate repository-aware rules. ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Each check answers one question: given this command and the repository as it stands right now,
// will the command quietly do something other than what it appears to say? A check returns true
// when the command is fine and false when the advisory should fire.
//
// The organising principle, which measurement forced rather than taste: gate on state, never on
// the verb. Roughly one in seven operations in this repository is a `reset`, but the overwhelming
// majority merely unstage — old and new commit are identical. A rule keyed to the word `reset`
// fires constantly and trains the reader to skim; the same rule keyed to the commit actually
// moving fires about a hundredth as often and stays worth reading. Every check below is written
// to that standard, and a check that cannot find a discriminator does not belong here.
//
// All checks fail open. Uncertainty means silence, because a false positive spends the one thing
// this system cannot rebuild once lost, which is the reader's attention.

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

import path from 'node:path';

// Adapters share this narrow gate so unrelated shell commands never collect repository state.
export const GIT_SHAPE = /(?:^|[;&|]\s*)(?:\w+=\S+\s+)*git\s+(?:-C\s+\S+\s+)?[a-z-]+/;

const GIT_INVOCATION = /(?:^|[;&|]\s*)(?:\w+=\S+\s+)*git\s+(?:-C\s+(\S+)\s+)?([a-z-]+)((?:\s+[^;&|]*)?)/;

// `cd <dir> && git ...` moves the directory of the invocation just as `git -C <dir>` does, so
// both resolve to one effective directory. Only a `cd` immediately before the invocation counts:
// a `cd` earlier in a longer pipeline may not be the one the git command inherits.
const CD_BEFORE_GIT = /(?:^|[;&|]\s*)cd\s+(?:"([^"]*)"|'([^']*)'|(\S+))\s*&&\s*(?:\w+=\S+\s+)*git\s/;

// Flags whose value is a separate argument. Without this list a commit message lands in the
// pathspec, and every path-sensitive check below then reasons about a word from the message.
const VALUE_FLAGS = new Set([
  '-m', '--message', '-F', '--file', '-C', '--reuse-message', '-c', '--reedit-message',
  '--author', '--date', '--cleanup', '-t', '--template', '--chmod', '--pathspec-from-file',
  '-s', '--strategy', '-X', '--strategy-option', '--source', '-b', '-B', '--orphan', '-u',
]);

// `-u` takes a value for `push` (upstream) but is a bare flag for `add` (update). Subcommand
// decides, so the ambiguous ones are listed per subcommand rather than globally.
const BARE_IN_SUBCOMMAND = { add: new Set(['-u']), restore: new Set(['-s']) };

// ─────────────────────────────────────────────────────────────────────────────
// 2. COMMAND PARSING
// ─────────────────────────────────────────────────────────────────────────────
//
// Deliberately narrow: only a directly visible `git ...` invocation is classified. Aliases,
// wrapper scripts and anything behind a shell variable are left alone, because guessing at
// their expansion would produce advisories about commands the operator never typed.

/** Strip one pair of surrounding quotes from a shell token. */
function unquote(token) {
  return typeof token === 'string' ? token.replace(/^["']|["']$/g, '') : '';
}

/**
 * Resolve a directory token to an absolute path without touching the filesystem.
 *
 * A shell expansion (`$DIR`), a home-relative path or an empty token has no statically known
 * target, and a relative one needs a known base. Each returns null so the caller fails open
 * rather than reason about the wrong repository's state.
 *
 * @param {string|null} baseDir - Directory the token is relative to, or null when unknown.
 * @param {string} token - Raw `-C` or `cd` argument.
 * @returns {string|null} Absolute directory, or null when it cannot be resolved.
 */
function resolveDir(baseDir, token) {
  const target = unquote(token);
  if (!target || /[$`]/.test(target) || target.startsWith('~')) return null;
  if (path.isAbsolute(target)) return path.resolve(target);
  return baseDir ? path.resolve(baseDir, target) : null;
}

/**
 * Split a git command into subcommand, flags and positional pathspec arguments.
 *
 * @param {string} command - Shell command containing a directly visible git invocation.
 * @param {string} [sessionCwd] - Directory relative `cd`/`-C` targets resolve against.
 * @returns {{sub: string, flags: string[], paths: string[], raw: string,
 *   afterSeparator: boolean, effectiveDir: string|null, cwdResolved: boolean}|null} Parsed
 *   command, or null when no git invocation is visible.
 */
export function parseGitCommand(command, sessionCwd = process.cwd()) {
  const cmd = String(command || '');
  const m = cmd.match(GIT_INVOCATION);
  if (!m) return null;
  const cwdTarget = m[1];
  const sub = m[2];
  const rest = (m[3] || '').trim();

  const tokens = rest.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
  const flags = [];
  const paths = [];
  let afterSeparator = false;
  let skipNext = false;
  const bare = BARE_IN_SUBCOMMAND[sub] || new Set();

  for (const raw of tokens) {
    const t = raw.replace(/^["']|["']$/g, '');
    if (skipNext) { skipNext = false; continue; }
    if (t === '--') { afterSeparator = true; continue; }
    if (!afterSeparator && t.startsWith('-')) {
      flags.push(t);
      if (VALUE_FLAGS.has(t) && !bare.has(t) && !t.includes('=')) skipNext = true;
      continue;
    }
    paths.push(t);
  }
  // The command's effective directory: a leading `cd <dir> &&` first, then a git-level
  // `-C <dir>` resolved against it. A token needing shell expansion cannot be resolved
  // statically, so the result is marked unresolved and the checks stay silent.
  const cdMatch = cmd.match(CD_BEFORE_GIT);
  const cdDir = cdMatch ? resolveDir(sessionCwd, cdMatch[1] ?? cdMatch[2] ?? cdMatch[3]) : sessionCwd;
  let effectiveDir = cdDir;
  let cwdResolved = cdDir !== null;
  if (cwdTarget !== undefined) {
    const target = resolveDir(effectiveDir, cwdTarget);
    if (target === null) {
      cwdResolved = false;
      effectiveDir = null;
    } else {
      effectiveDir = target;
    }
  }
  return { sub, flags, paths, raw: cmd, afterSeparator, effectiveDir, cwdResolved };
}

/**
 * The repository context a command's state reads must come from the directory the command
 * actually runs in, not the session's. Returns the session context when the command does not
 * move directory, a context rooted at the effective directory otherwise, and null when that
 * directory is unknowable. Callers treat null as silence, per the fail-open rule above.
 */
function contextFor(p, ctx) {
  if (!p || !ctx || !p.cwdResolved) return null;
  const dir = p.effectiveDir;
  if (!dir || dir === ctx.cwd) return ctx;
  return ctx.forDir(dir);
}

const has = (flags, ...names) => flags.some((f) => names.some((n) => f === n || f.startsWith(`${n}=`)));

// ─────────────────────────────────────────────────────────────────────────────
// 3. CHECKS
// ─────────────────────────────────────────────────────────────────────────────

export const GIT_CHECKS = {
  /**
   * A commit scoped to a directory, or to everything tracked, while untracked files sit inside
   * that scope. Those files are silently excluded and the commit still reports success.
   *
   * The distinction matters and was established by experiment rather than assumption. Naming an
   * untracked file directly is safe: git refuses the whole commit with "pathspec did not match".
   * Naming its *parent directory* is not, because the pathspec matches tracked files, so git has
   * no complaint to make and the new file is simply left behind. Exit code zero, a plausible file
   * list, nothing to notice.
   *
   * This is the failure that motivated the packet: work was committed, reported as done, and the
   * omission stayed invisible because the report was read as a count rather than a list.
   */
  'commit-scope-drops-untracked': (cmd, ctx) => {
    const p = parseGitCommand(cmd, ctx.cwd);
    if (!p || p.sub !== 'commit') return true;
    const scopedToDir = has(p.flags, '--only', '-o') && p.paths.length > 0;
    const scopedToAll = has(p.flags, '-a', '--all');
    if (!scopedToDir && !scopedToAll) return true;

    const c = contextFor(p, ctx);
    if (!c) return true;
    const untracked = c.untrackedPaths();
    if (untracked.length === 0) return true;
    if (scopedToAll) return false;

    // Only a pathspec that resolves to more than itself can hide a sibling. A file pathspec
    // naming an untracked file errors loudly, so it needs no advisory.
    return !p.paths.some((spec) => {
      const prefix = spec.endsWith('/') ? spec : `${spec}/`;
      return untracked.some((u) => u.startsWith(prefix));
    });
  },

  /**
   * A pathspec commit names a path with nothing staged or changed under it, so that path
   * contributes nothing to the commit while appearing in the command.
   */
  'commit-pathspec-empty-change': (cmd, ctx) => {
    const p = parseGitCommand(cmd, ctx.cwd);
    if (!p || p.sub !== 'commit') return true;
    if (!has(p.flags, '--only', '-o')) return true;
    if (p.paths.length === 0) return true;
    const c = contextFor(p, ctx);
    if (!c) return true;
    for (const path of p.paths) {
      const staged = c.stagedUnder([path]);
      const unstaged = c.unstagedUnder([path]);
      if (staged === null || unstaged === null) continue;
      if (staged.length === 0 && unstaged.length === 0) return false;
    }
    return true;
  },

  /**
   * An add whose pathspec matches nothing at all — a typo, the wrong directory, or a path
   * already removed. The operator believes their change is staged and commits without it.
   */
  'add-pathspec-matches-nothing': (cmd, ctx) => {
    const p = parseGitCommand(cmd, ctx.cwd);
    if (!p || p.sub !== 'add') return true;
    if (p.paths.length === 0) return true;
    if (p.paths.some((x) => x === '.' || x === '-A' || x === '--all')) return true;
    const c = contextFor(p, ctx);
    if (!c) return true;
    // Only a pathspec git could not resolve at all is worth saying something about. A tracked
    // file with no pending change also stages nothing, and that is simply a no-op, not a mistake.
    return c.addDryRun(p.paths).status !== 'unmatched';
  },

  /**
   * An add whose pathspec resolves only to ignored files. Silent by design in git, and easy to
   * hit here because the ignore rules cover the runtime, database and log paths that are most
   * often the subject of active work.
   */
  'add-pathspec-only-ignored': (cmd, ctx) => {
    const p = parseGitCommand(cmd, ctx.cwd);
    if (!p || p.sub !== 'add') return true;
    if (p.paths.length === 0 || has(p.flags, '-f', '--force')) return true;
    const c = contextFor(p, ctx);
    if (!c) return true;
    if (c.checkIgnore(p.paths).length === 0) return true;
    // Git refuses the add outright and names the ignore rule when EVERY matched path is ignored.
    // A pathspec covering both ignored and addable files succeeds, and needs no advisory.
    return c.addDryRun(p.paths).status !== 'ignored';
  },

  /**
   * `add -u` stages tracked modifications only. When untracked files are present, the new file
   * is precisely the thing being missed, and git says nothing.
   */
  'add-update-skips-untracked': (cmd, ctx) => {
    const p = parseGitCommand(cmd, ctx.cwd);
    if (!p || p.sub !== 'add') return true;
    if (!has(p.flags, '-u', '--update')) return true;
    const c = contextFor(p, ctx);
    if (!c) return true;
    return c.untrackedPaths().length === 0;
  },

  /**
   * A working-tree restore over a path that has staged content. The index copy survives, so the
   * operator sees the file revert and reasonably concludes the change is gone, while a stale
   * version remains staged and ready to commit.
   */
  'restore-discards-over-staged': (cmd, ctx) => {
    const p = parseGitCommand(cmd, ctx.cwd);
    if (!p) return true;
    const isRestore = p.sub === 'restore' && !has(p.flags, '--staged', '-S');
    const isCheckoutPath = p.sub === 'checkout' && p.afterSeparator;
    if (!isRestore && !isCheckoutPath) return true;
    if (p.paths.length === 0) return true;
    const c = contextFor(p, ctx);
    if (!c) return true;
    const staged = c.stagedUnder(p.paths);
    return staged === null || staged.length === 0;
  },

  /**
   * Restoring a path from another ref writes the index as well as the working tree, so content
   * is staged without an add. The staging is invisible in the command as written.
   */
  'checkout-from-ref-stages-silently': (cmd) => {
    const p = parseGitCommand(cmd);
    if (!p) return true;
    if (p.sub === 'checkout' && p.afterSeparator && p.paths.length >= 2) return false;
    if (p.sub === 'restore' && has(p.flags, '--source', '-s') && !has(p.flags, '--worktree', '-W')) return false;
    return true;
  },

  /**
   * A one-sided merge strategy option resolves every conflict automatically and reports a clean
   * merge. Nothing in the output distinguishes this from a merge that had no conflicts, so the
   * discarded side is never reviewed.
   */
  'merge-strategy-resolves-one-sided': (cmd) => {
    const p = parseGitCommand(cmd);
    if (!p) return true;
    if (!['merge', 'rebase', 'cherry-pick'].includes(p.sub)) return true;
    return !p.flags.some((f) => /^-X(ours|theirs)$/.test(f) || f === '-X');
  },

  /**
   * A pathspec differing from a tracked file only by case, while the filesystem folds case.
   * Git resolves it to the existing path, so a rename that looks applied silently is not.
   */
  'case-only-pathspec-folds': (cmd, ctx) => {
    const p = parseGitCommand(cmd, ctx.cwd);
    if (!p || !['add', 'mv', 'rm'].includes(p.sub)) return true;
    if (p.paths.length === 0) return true;
    const c = contextFor(p, ctx);
    if (!c || !c.ignoreCase()) return true;
    const tracked = c.tracked();
    const lower = c.trackedLowercase();
    return !p.paths.some((path) => !tracked.has(path) && lower.has(path.toLowerCase()));
  },

  /**
   * Staging a path whose content passes through a clean filter. The committed blob is not the
   * bytes on disk, so reviewing the working copy does not tell the operator what they are about
   * to commit. This is the only routine operation in git where reading the file misleads.
   */
  'staged-path-rewritten-by-filter': (cmd, ctx) => {
    const p = parseGitCommand(cmd, ctx.cwd);
    if (!p || !['add', 'commit'].includes(p.sub)) return true;
    const c = contextFor(p, ctx);
    if (!c) return true;
    const candidates = p.paths.length > 0 ? p.paths : c.stagedPaths();
    if (candidates.length === 0) return true;
    return !candidates.some((path) => c.filterFor(path) !== null);
  },

  // Destructive tier.
  // Retained by the research on the condition that each be narrowed to positive state — never
  // the verb. Where an operation is rare AND carries an explicit destructive token, firing on
  // the command shape alone is acceptable, because rarity keeps it inside the noise budget.

  /**
   * A hard reset while the working tree holds modifications. Those modifications are what gets
   * destroyed, unrecoverably — the reflog protects commits, never uncommitted work. A hard
   * reset on a clean tree destroys nothing on disk and stays silent.
   */
  'reset-hard-discards-changes': (cmd, ctx) => {
    const p = parseGitCommand(cmd, ctx.cwd);
    if (!p || p.sub !== 'reset' || !has(p.flags, '--hard')) return true;
    const c = contextFor(p, ctx);
    if (!c) return true;
    return c.dirtyCount() === 0;
  },

  /**
   * A forced clean that would actually delete something. With -x the blast radius jumps from
   * untracked work to everything gitignore protects — dependency trees, databases, logs — so
   * -x fires on any non-empty dry run, while the plain form is given headroom for the routine
   * few-file case.
   */
  'clean-force-deletes-files': (cmd, ctx) => {
    const p = parseGitCommand(cmd, ctx.cwd);
    if (!p || p.sub !== 'clean') return true;
    const forced = p.flags.some((f) => /^-[a-z]*f/.test(f) || f === '--force');
    if (!forced) return true;
    const c = contextFor(p, ctx);
    if (!c) return true;
    const withDirs = p.flags.some((f) => /^-[a-z]*d/.test(f));
    const withIgnored = p.flags.some((f) => /^-[a-z]*[xX]/.test(f));
    const would = c.cleanDryRun(withDirs, withIgnored);
    if (would === null || would.length === 0) return true;
    return withIgnored ? false : would.length < 10;
  },

  /**
   * A forced branch delete aimed at a branch with commits not merged into HEAD. This mirrors
   * git's own -d guard, because -D exists precisely to bypass it; the plain -d form stays
   * silent since git already refuses it on its own.
   */
  'branch-force-delete-unmerged': (cmd, ctx) => {
    const p = parseGitCommand(cmd, ctx.cwd);
    if (!p || p.sub !== 'branch') return true;
    const forcedDelete = has(p.flags, '-D') || (has(p.flags, '--delete', '-d') && has(p.flags, '--force', '-f'));
    if (!forcedDelete || p.paths.length === 0) return true;
    const c = contextFor(p, ctx);
    if (!c) return true;
    const unmerged = c.unmergedBranches();
    return !p.paths.some((name) => unmerged.has(name));
  },

  /**
   * Clearing the stash while entries exist. Dropped stashes are unreachable the moment the
   * command returns; a targeted `stash drop` names its victim and stays silent.
   */
  'stash-clear-drops-entries': (cmd, ctx) => {
    const p = parseGitCommand(cmd, ctx.cwd);
    if (!p || p.sub !== 'stash') return true;
    if (p.paths[0] !== 'clear') return true;
    const c = contextFor(p, ctx);
    if (!c) return true;
    return c.stashCount() === 0;
  },

  /**
   * Immediate history expiry. These two shapes delete the safety net every other recovery
   * relies on, are rare, and carry their destructive intent in the flags — the combination the
   * research allowed to fire on shape alone.
   */
  'history-expiry-defeats-recovery': (cmd) => {
    const p = parseGitCommand(cmd);
    if (!p) return true;
    if (p.sub === 'reflog' && p.paths[0] === 'expire' && p.flags.some((f) => /^--expire(-unreachable)?=now$/.test(f))) return false;
    if (p.sub === 'gc' && p.flags.some((f) => f === '--prune=now' || f === '--aggressive')) return false;
    return true;
  },

  /**
   * Deleting a ref on the remote. Destructive at a distance, invisible locally, and rare
   * enough that the shape alone stays inside the budget.
   */
  'push-deletes-remote-ref': (cmd) => {
    const p = parseGitCommand(cmd);
    if (!p || p.sub !== 'push') return true;
    if (has(p.flags, '--delete', '-d')) return false;
    return !p.paths.some((a) => /^:.+/.test(a));
  },

  /**
   * A force push without a lease. The lease form fails when the remote moved under you, which
   * is the entire difference between overwriting your own history and overwriting someone
   * else's; plain --force cannot tell those apart.
   */
  'force-push-without-lease': (cmd) => {
    const p = parseGitCommand(cmd);
    if (!p || p.sub !== 'push') return true;
    const plainForce = p.flags.some((f) => f === '--force' || f === '-f');
    const leased = p.flags.some((f) => f.startsWith('--force-with-lease'));
    return !plainForce || leased;
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. DERIVED EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const GIT_CHECK_IDS = Object.keys(GIT_CHECKS);
