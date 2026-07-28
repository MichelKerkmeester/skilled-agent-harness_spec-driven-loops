// Tests for the git preflight advisory checks. Run: node --test <this file>
//
// Every check is exercised against a real temporary repository rather than a stubbed context.
// The checks exist because git's actual behaviour surprises people; asserting against a mock of
// that behaviour would encode the same misunderstanding the checks are meant to catch.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import { GIT_CHECKS, parseGitCommand } from './git-rule-checks.mjs';
import { createGitContext } from './git-context.mjs';
import { readHardRules, evaluate } from '../../../cli-external-orchestration/cli-opencode/scripts/lib/dispatch-rule-checks.mjs';

const SKILL_MD = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../SKILL.md');

function git(repo, ...args) {
  return execFileSync('git', args, { cwd: repo, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

/**
 * Create a throwaway repository with one commit, so HEAD exists.
 *
 * Hooks are pointed at an empty path deliberately. A global `core.hooksPath` applies the host's
 * commit-message and pre-commit gates to every repository on the machine, including this one,
 * which would make the suite fail for reasons that have nothing to do with what it is testing.
 */
function makeRepo() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'git-advisory-'));
  git(dir, 'init', '-q');
  git(dir, 'config', 'core.hooksPath', path.join(dir, '.no-hooks'));
  git(dir, 'config', 'user.email', 'test@example.invalid');
  git(dir, 'config', 'user.name', 'Test');
  git(dir, 'config', 'commit.gpgsign', 'false');
  fs.writeFileSync(path.join(dir, 'seed.txt'), 'seed\n');
  git(dir, 'add', 'seed.txt');
  git(dir, 'commit', '-q', '-m', 'seed');
  return dir;
}

const cleanup = [];
const repo = () => { const d = makeRepo(); cleanup.push(d); return d; };
process.on('exit', () => cleanup.forEach((d) => fs.rmSync(d, { recursive: true, force: true })));

const check = (id, cmd, dir) => GIT_CHECKS[id](cmd, createGitContext(dir));

// ── The original incident ────────────────────────────────────────────────────

test('a directory-scoped commit silently drops untracked files inside that scope', () => {
  const dir = repo();
  fs.mkdirSync(path.join(dir, 'src'));
  fs.writeFileSync(path.join(dir, 'src', 'tracked.txt'), 'a\n');
  git(dir, 'add', 'src/tracked.txt');
  git(dir, 'commit', '-q', '-m', 'add tracked');
  fs.writeFileSync(path.join(dir, 'src', 'tracked.txt'), 'b\n');
  fs.writeFileSync(path.join(dir, 'src', 'untracked.txt'), 'never committed\n');

  // Establish what git actually does before asserting the check, because the premise this rule
  // was first written from turned out to be wrong: naming an untracked file errors loudly, but
  // naming its parent directory succeeds and leaves the file behind without a word.
  git(dir, 'commit', '-q', '--only', 'src', '-m', 'scoped');
  const landed = git(dir, 'show', '--name-only', '--format=', 'HEAD').split('\n').filter(Boolean);
  assert.deepEqual(landed, ['src/tracked.txt'], 'git committed silently, omitting the untracked file');
  assert.match(git(dir, 'status', '--porcelain'), /\?\? src\/untracked\.txt/, 'the file is still uncommitted');

  assert.equal(check('commit-scope-drops-untracked', 'git commit --only src -m x', dir), false);
  assert.equal(check('commit-scope-drops-untracked', 'git commit -a -m x', dir), false);
});

test('naming an untracked file directly needs no advisory because git refuses it', () => {
  const dir = repo();
  fs.writeFileSync(path.join(dir, 'untracked.txt'), 'new\n');
  let failed = false;
  try { git(dir, 'commit', '--only', 'untracked.txt', '-m', 'x'); } catch { failed = true; }
  assert.ok(failed, 'git rejects a pathspec naming only an untracked file');
  assert.equal(check('commit-scope-drops-untracked', 'git commit --only untracked.txt -m x', dir), true);
});

test('a scoped commit with no untracked files in scope stays silent', () => {
  const dir = repo();
  fs.writeFileSync(path.join(dir, 'seed.txt'), 'modified\n');
  assert.equal(check('commit-scope-drops-untracked', 'git commit --only seed.txt -m x', dir), true);
  assert.equal(check('commit-scope-drops-untracked', 'git commit -a -m x', dir), true);
});

test('commit --only flags a named path with nothing to contribute', () => {
  const dir = repo();
  assert.equal(check('commit-pathspec-empty-change', 'git commit --only seed.txt -m x', dir), false);
  fs.writeFileSync(path.join(dir, 'seed.txt'), 'modified\n');
  assert.equal(check('commit-pathspec-empty-change', 'git commit --only seed.txt -m x', dir), true);
});

// ── Staging that does less than it appears to ────────────────────────────────

test('add flags a pathspec matching nothing', () => {
  const dir = repo();
  assert.equal(check('add-pathspec-matches-nothing', 'git add does-not-exist.txt', dir), false);
  assert.equal(check('add-pathspec-matches-nothing', 'git add seed.txt', dir), true);
});

test('add flags a pathspec resolving only to ignored files', () => {
  const dir = repo();
  fs.writeFileSync(path.join(dir, '.gitignore'), 'build/\n');
  fs.mkdirSync(path.join(dir, 'build'));
  fs.writeFileSync(path.join(dir, 'build', 'out.js'), 'x\n');
  assert.equal(check('add-pathspec-only-ignored', 'git add build/', dir), false);
  assert.equal(check('add-pathspec-only-ignored', 'git add -f build/', dir), true, '--force is explicit intent');
});

test('add -u flags the untracked files it will leave behind', () => {
  const dir = repo();
  fs.writeFileSync(path.join(dir, 'seed.txt'), 'modified\n');
  fs.writeFileSync(path.join(dir, 'brand-new.txt'), 'new\n');
  assert.equal(check('add-update-skips-untracked', 'git add -u', dir), false);
  fs.rmSync(path.join(dir, 'brand-new.txt'));
  assert.equal(check('add-update-skips-untracked', 'git add -u', dir), true);
});

// ── The index-versus-worktree gap ────────────────────────────────────────────

test('restore flags a path whose staged copy will survive the revert', () => {
  const dir = repo();
  fs.writeFileSync(path.join(dir, 'seed.txt'), 'staged version\n');
  git(dir, 'add', 'seed.txt');
  fs.writeFileSync(path.join(dir, 'seed.txt'), 'working version\n');
  assert.equal(check('restore-discards-over-staged', 'git restore seed.txt', dir), false);
  assert.equal(check('restore-discards-over-staged', 'git restore --staged seed.txt', dir), true);
  assert.equal(check('restore-discards-over-staged', 'git checkout -- seed.txt', dir), false);
});

test('restore stays silent when nothing is staged for the path', () => {
  const dir = repo();
  fs.writeFileSync(path.join(dir, 'seed.txt'), 'working only\n');
  assert.equal(check('restore-discards-over-staged', 'git restore seed.txt', dir), true);
});

test('restoring from a ref is flagged because it stages without an add', () => {
  const dir = repo();
  assert.equal(check('checkout-from-ref-stages-silently', 'git checkout HEAD~0 -- seed.txt', dir), false);
  assert.equal(check('checkout-from-ref-stages-silently', 'git restore --source=HEAD seed.txt', dir), false);
  assert.equal(check('checkout-from-ref-stages-silently', 'git restore --source=HEAD --worktree seed.txt', dir), true);
  assert.equal(check('checkout-from-ref-stages-silently', 'git checkout -- seed.txt', dir), true);
});

// ── Command-shape checks ─────────────────────────────────────────────────────

test('one-sided merge strategies are flagged; ordinary merges are not', () => {
  const dir = repo();
  assert.equal(check('merge-strategy-resolves-one-sided', 'git merge -Xours topic', dir), false);
  assert.equal(check('merge-strategy-resolves-one-sided', 'git rebase -Xtheirs main', dir), false);
  assert.equal(check('merge-strategy-resolves-one-sided', 'git merge topic', dir), true);
});

test('case-only pathspec is flagged only where the filesystem folds case', () => {
  const dir = repo();
  const folds = git(dir, 'config', 'core.ignorecase') === 'true';
  const result = check('case-only-pathspec-folds', 'git add SEED.txt', dir);
  assert.equal(result, !folds, 'flagged exactly when core.ignorecase is on');
  assert.equal(check('case-only-pathspec-folds', 'git add seed.txt', dir), true, 'exact case is never flagged');
});

test('a clean filter on a staged path is flagged', () => {
  const dir = repo();
  fs.writeFileSync(path.join(dir, '.gitattributes'), 'config.json filter=redact\n');
  fs.writeFileSync(path.join(dir, 'config.json'), '{"k":"v"}\n');
  assert.equal(check('staged-path-rewritten-by-filter', 'git add config.json', dir), false);
  assert.equal(check('staged-path-rewritten-by-filter', 'git add seed.txt', dir), true);
});

// ── Destructive tier ─────────────────────────────────────────────────────────

test('reset --hard fires only when the tree holds modifications', () => {
  const dir = repo();
  assert.equal(check('reset-hard-discards-changes', 'git reset --hard HEAD~1', dir), true, 'clean tree destroys nothing on disk');
  fs.writeFileSync(path.join(dir, 'seed.txt'), 'modified\n');
  assert.equal(check('reset-hard-discards-changes', 'git reset --hard', dir), false);
  assert.equal(check('reset-hard-discards-changes', 'git reset --soft HEAD~1', dir), true, 'soft reset touches no files');
});

test('clean -x fires on any real deletion; the plain form gets headroom', () => {
  const dir = repo();
  fs.writeFileSync(path.join(dir, '.gitignore'), 'cache/\n');
  fs.mkdirSync(path.join(dir, 'cache'));
  fs.writeFileSync(path.join(dir, 'cache', 'db.sqlite'), 'x\n');
  fs.writeFileSync(path.join(dir, 'loose.txt'), 'x\n');
  assert.equal(check('clean-force-deletes-files', 'git clean -fdx', dir), false, '-x reaches ignored files');
  assert.equal(check('clean-force-deletes-files', 'git clean -f', dir), true, 'one loose file is routine');
  assert.equal(check('clean-force-deletes-files', 'git clean -n', dir), true, 'a dry run deletes nothing');
});

test('branch -D fires only for a branch with unmerged commits', () => {
  const dir = repo();
  git(dir, 'branch', 'merged-twin');
  git(dir, 'checkout', '-q', '-b', 'ahead');
  fs.writeFileSync(path.join(dir, 'extra.txt'), 'x\n');
  git(dir, 'add', 'extra.txt');
  git(dir, 'commit', '-q', '-m', 'unique');
  git(dir, 'checkout', '-q', '-');
  assert.equal(check('branch-force-delete-unmerged', 'git branch -D ahead', dir), false);
  assert.equal(check('branch-force-delete-unmerged', 'git branch -D merged-twin', dir), true, 'nothing unique to lose');
  assert.equal(check('branch-force-delete-unmerged', 'git branch -d ahead', dir), true, 'git refuses -d on its own');
});

test('stash clear fires only when entries exist', () => {
  const dir = repo();
  assert.equal(check('stash-clear-drops-entries', 'git stash clear', dir), true, 'nothing to drop');
  fs.writeFileSync(path.join(dir, 'seed.txt'), 'modified\n');
  git(dir, 'stash');
  assert.equal(check('stash-clear-drops-entries', 'git stash clear', dir), false);
  assert.equal(check('stash-clear-drops-entries', 'git stash drop stash@{0}', dir), true, 'a targeted drop names its victim');
});

test('shape-only destructive tokens fire regardless of state', () => {
  const dir = repo();
  assert.equal(check('history-expiry-defeats-recovery', 'git reflog expire --expire=now --all', dir), false);
  assert.equal(check('history-expiry-defeats-recovery', 'git gc --prune=now', dir), false);
  assert.equal(check('history-expiry-defeats-recovery', 'git gc', dir), true);
  assert.equal(check('push-deletes-remote-ref', 'git push origin --delete topic', dir), false);
  assert.equal(check('push-deletes-remote-ref', 'git push origin :topic', dir), false);
  assert.equal(check('push-deletes-remote-ref', 'git push origin main', dir), true);
  assert.equal(check('force-push-without-lease', 'git push --force origin main', dir), false);
  assert.equal(check('force-push-without-lease', 'git push --force-with-lease origin main', dir), true);
  assert.equal(check('force-push-without-lease', 'git push origin main', dir), true);
});

// ── Parsing and contract ─────────────────────────────────────────────────────

test('parser separates flags from pathspec across invocation shapes', () => {
  assert.equal(parseGitCommand('git commit --only a.txt -m x').sub, 'commit');
  assert.deepEqual(parseGitCommand('git add -u -- src/').paths, ['src/']);
  assert.equal(parseGitCommand('git -C /repo status').sub, 'status');
  assert.equal(parseGitCommand('FOO=1 git add x').sub, 'add');
  assert.equal(parseGitCommand('echo not-git'), null);
});

test('non-git and unparseable commands never fire a rule', () => {
  const dir = repo();
  for (const id of Object.keys(GIT_CHECKS)) {
    assert.equal(check(id, 'npm install', dir), true, `${id} fired on a non-git command`);
    assert.equal(check(id, '', dir), true, `${id} fired on an empty command`);
  }
});

test('every declared rule resolves to an implementation and never blocks', () => {
  const rules = readHardRules(SKILL_MD);
  assert.ok(rules.length >= 10, 'frontmatter declares the rule set');
  for (const r of rules) {
    assert.ok(GIT_CHECKS[r.check], `rule ${r.id} has no implementation`);
    assert.equal(r.severity, 'warn', `rule ${r.id} must advise, never block`);
    assert.ok(r.message.length > 40, `rule ${r.id} needs a message that explains itself`);
  }
});

test('a check that throws is swallowed, so a broken rule cannot stop work', () => {
  const violations = evaluate('git add x', [{ id: 'boom', check: 'boom', message: 'm', severity: 'warn' }], {
    checks: { boom: () => { throw new Error('deliberate'); } },
  });
  assert.deepEqual(violations, []);
});

test('the shared engine still evaluates command-only rules unchanged', () => {
  const violations = evaluate('opencode run --agent general "x"', [
    { id: 'no-bare-agent-general', check: 'no-bare-agent-general', message: 'm', severity: 'warn' },
  ]);
  assert.deepEqual(violations.map((v) => v.id), ['no-bare-agent-general']);
});
