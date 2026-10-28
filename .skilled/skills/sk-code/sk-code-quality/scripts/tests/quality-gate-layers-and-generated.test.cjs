// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Runner Tests — Hygiene Layers and Generated Rows
// ───────────────────────────────────────────────────────────────────
'use strict';

// Each case seeds a hook, a workflow job or a generated row the repository declares, so the
// group covers the spellings that make a layer read present, and the paths a generated row
// owns wherever the file sits.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { ADR_LABEL, withRepo, check, hygieneFindings } = require('./quality-gate-helpers.cjs');
const { assertSnapshotUnchanged, trustRepoChecks } = require('./fixtures.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS AND HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// A hook that names the checker outright is the plainest spelling there is, and a plain name is
// not a broken one. Each line a case names below is a whole hook body, so the case states one
// spelling and nothing else beside it.
function hookLayer(repo, line) {
  const hook = path.join(repo.root, '.git', 'hooks', 'pre-commit');
  fs.writeFileSync(hook, `#!/bin/sh\n${line}\n`);
  fs.chmodSync(hook, 0o755);
  return repo.run(['--files', 'app.go']).verdict.layers.pre_commit_hygiene;
}

// The checker a hook names is proven by the file the path lands on, so a case seeds that file at
// the folder shape a hook builds its path from and lets each spelling speak for itself.
function runnableChecker(repo) {
  const file = path.join(repo.root, 'tools', 'check-comment-hygiene.sh');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, '#!/bin/sh\nexit 0\n');
  fs.chmodSync(file, 0o755);
  return file;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CASES
// ─────────────────────────────────────────────────────────────────────────────

test('F04 touched-file debt with a whole-file layer: the CI job makes the old label block', () => withRepo({
  base: {
    'app.go': 'package a\n\n// see ' + ADR_LABEL + '\nfunc A() {}\n',
    '.github/workflows/hygiene.yml': 'name: hygiene\non: push\njobs:\n  scan:\n    runs-on: ubuntu-latest\n    steps:\n      - run: python3 scripts/check-comment-hygiene.sh app.go\n',
  },
  change: { 'app.go': 'package a\n\n// see ' + ADR_LABEL + '\nfunc A() {}\nfunc B() {}\n' },
}, (repo) => {
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run([]));
  assert.equal(status, 1);
  assert.equal(verdict.layers.ci_hygiene, 'present');
  const [entry] = hygieneFindings(verdict);
  assert.equal(entry.origin, 'touched-file');
  assert.equal(entry.blocking, true);
  assert.match(entry.reason, /CI hygiene job/);
}));

test('F34 plain checker spellings: a hook naming the path outright reads present', () => withRepo({
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  runnableChecker(repo);
  for (const line of [
    'tools/check-comment-hygiene.sh',
    './tools/check-comment-hygiene.sh',
    'sh tools/check-comment-hygiene.sh',
    'bash tools/check-comment-hygiene.sh',
    'tools/check-comment-hygiene.sh || true',
    'cd "$(dirname "$0")/../.." && tools/check-comment-hygiene.sh',
  ]) assert.equal(hookLayer(repo, line), 'present', line);
}));

// A substitution nests, so a spelling that closes more than one of them before the path is
// still one path. A parameter default puts a brace pair in the prefix, and a hook that climbs
// out of the folder it runs in still lands on the same file.
test('F35 substitution spellings: a hook that builds the path reads present', () => withRepo({
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  runnableChecker(repo);
  for (const line of [
    '${ROOT:-.}/tools/check-comment-hygiene.sh',
    '"${ROOT:-.}/tools/check-comment-hygiene.sh"',
    '"$(dirname "$0")/../../tools/check-comment-hygiene.sh"',
    '$(cd "$(dirname "$0")" && pwd)/../../tools/check-comment-hygiene.sh',
  ]) assert.equal(hookLayer(repo, line), 'present', line);
}));

// The spellings that already read present keep it, and a hook whose path lands on no file is
// still installed and unable to run rather than installed and working.
test('F36 variable spellings: the shapes that read present keep it and a missing checker stays broken', () => withRepo({
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  const root = path.join(repo.root, 'check-comment-hygiene.sh');
  fs.writeFileSync(root, '#!/bin/sh\nexit 0\n');
  fs.chmodSync(root, 0o755);
  const tools = runnableChecker(repo);
  for (const line of [
    'bash "$ROOT/check-comment-hygiene.sh"',
    '"$ROOT"/tools/check-comment-hygiene.sh',
    '$(git rev-parse --show-toplevel)/tools/check-comment-hygiene.sh',
    '"$(git rev-parse --show-toplevel)/tools/check-comment-hygiene.sh"',
  ]) assert.equal(hookLayer(repo, line), 'present', line);

  fs.rmSync(tools);
  assert.equal(hookLayer(repo, 'tools/check-comment-hygiene.sh'), 'broken');
  assert.equal(hookLayer(repo, '"$(dirname "$0")/../../tools/check-comment-hygiene.sh"'), 'broken');
}));

// A call inside a comment is a call nobody makes, so a hook whose only mention of the checker
// is commented out names no checker at all. A # inside a quote is text, so the mention there
// still counts as one.
test('F37 a commented-out call names no checker and a quoted # stays text', () => withRepo({
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  assert.equal(hookLayer(repo, '# tools/check-comment-hygiene.sh is disabled'), 'absent');
  assert.equal(hookLayer(repo, '# exec sh "$(dirname "$0")/../../tools/check-comment-hygiene.sh"'), 'absent');
  runnableChecker(repo);
  assert.equal(hookLayer(repo, 'echo "# tools/check-comment-hygiene.sh"'), 'present');
}));

// A generated row the repository declares carries its own command and its own paths, so the
// path it names is that row's input even though the base layer marks the path as built output
// and the exclude list hides it. A required P0 row that fails blocks the run.
test('F38 a repository generated row runs on its declared path and blocks', () => withRepo({
  change: { '.skilled/skills/sk-design/sk-design-md-generator/backend/dist/cli.js': 'module.exports = 7;\n' },
}, (repo) => {
  const declared = '.skilled/skills/sk-design/sk-design-md-generator/backend/dist/cli.js';
  trustRepoChecks(repo);
  repo.write({
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': `${JSON.stringify({
      schemaVersion: 1,
      generated: [{
        id: 'own-gen',
        argv: [process.execPath, '-e', 'process.exit(7)', '{files}'],
        paths: [declared],
        severity: 'P0',
        required: true,
      }],
    })}\n`,
  });
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', declared]));
  const row = check(verdict, 'own-gen');
  assert.deepEqual([row.origin, row.state, row.files], ['generated', 'RAN_FAIL', 1]);
  assert.equal(row.runs[0].exit, 7);
  assert.equal(verdict.gate, 'BLOCKED');
  assert.equal(status, 1);
}));

// A generated row the repository declares is a command with its own paths, so a source path
// it names is that row's input wherever the file sits. A required P0 row that fails blocks.
test('F39 a repository generated row runs on a path outside every declared folder', () => withRepo({
  change: { 'gen/schema.js': 'module.exports = 7;\n' },
}, (repo) => {
  trustRepoChecks(repo);
  repo.write({
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': `${JSON.stringify({
      schemaVersion: 1,
      generated: [{
        id: 'own-gen',
        argv: [process.execPath, '-e', 'process.exit(7)', '{files}'],
        paths: ['gen/schema.js'],
        severity: 'P0',
        required: true,
      }],
    })}\n`,
  });
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', 'gen/schema.js']));
  const row = check(verdict, 'own-gen');
  assert.deepEqual([row.origin, row.state, row.files], ['generated', 'RAN_FAIL', 1]);
  assert.equal(row.runs[0].exit, 7);
  assert.equal(verdict.gate, 'BLOCKED');
  assert.equal(status, 1);
}));

// A path no built-in check reads is still that row's input, so a file the sensors leave
// unchecked does not hide a failing command.
test('F40 a repository generated row runs on a path no built-in check reads', () => withRepo({
  change: { 'gen/out.txt': 'built output\n' },
}, (repo) => {
  trustRepoChecks(repo);
  repo.write({
    '.skilled/skills/sk-code/sk-code-quality/repository/quality.json': `${JSON.stringify({
      schemaVersion: 1,
      generated: [{
        id: 'own-gen',
        argv: [process.execPath, '-e', 'process.exit(7)', '{files}'],
        paths: ['gen/out.txt'],
        severity: 'P0',
        required: true,
      }],
    })}\n`,
  });
  const { status, verdict } = assertSnapshotUnchanged(repo, () => repo.run(['--files', 'gen/out.txt']));
  const row = check(verdict, 'own-gen');
  assert.deepEqual([row.origin, row.state, row.files], ['generated', 'RAN_FAIL', 1]);
  assert.equal(verdict.gate, 'BLOCKED');
  assert.equal(status, 1);
}));

// An escaped quote outside quotes opens no quote, so the comment line after it is still a
// comment and names no checker.
test('F41 an escaped quote opens no quote and the comment below it stays a comment', () => withRepo({
  change: { 'app.go': 'package a\n' },
}, (repo) => {
  runnableChecker(repo);
  const hook = path.join(repo.root, '.git', 'hooks', 'pre-commit');
  fs.writeFileSync(hook, "#!/bin/sh\necho don\\'t\n# tools/check-comment-hygiene.sh\n");
  fs.chmodSync(hook, 0o755);
  assert.equal(repo.run(['--files', 'app.go']).verdict.layers.pre_commit_hygiene, 'absent');
}));

test('unit: layers', () => {
  const hookText = '#!/bin/sh\nexec python3 "$ROOT/check-comment-hygiene.sh" "$@"\n';
  const checkerText = '#!/bin/sh\nexit 0\n';
  withRepo({
    change: {
      'app.go': 'package a\n',
      'check-comment-hygiene.sh': checkerText,
      '.claude/settings.json': JSON.stringify({ hooks: { PostToolUse: [{ command: 'node .skilled/hooks/post-edit-quality/claude/adapter.cjs' }] } }),
    },
    modes: { 'check-comment-hygiene.sh': 0o755 },
  }, (repo) => {
    const hook = path.join(repo.root, '.git', 'hooks', 'pre-commit');
    const checker = path.join(repo.root, 'check-comment-hygiene.sh');
    fs.writeFileSync(hook, hookText);
    fs.chmodSync(hook, 0o755);
    fs.mkdirSync(path.join(repo.root, '.github'));
    fs.writeFileSync(path.join(repo.root, '.github', 'workflows'), 'a file where a folder belongs\n');
    const first = assertSnapshotUnchanged(repo, () => repo.run(['--files', 'app.go'])).verdict.layers;
    assert.deepEqual(first, { pre_commit_hygiene: 'present', ci_hygiene: 'unknown', post_edit: 'broken' });

    // A hook that spells the checker from a quoted variable, or from a command
    // substitution, puts a quote or a closing parenthesis between the variable and the
    // path, so the token read alone looks absolute at the filesystem root. Both forms
    // still resolve under the repository root.
    const toolsChecker = path.join(repo.root, 'tools', 'check-comment-hygiene.sh');
    fs.mkdirSync(path.dirname(toolsChecker), { recursive: true });
    fs.writeFileSync(toolsChecker, checkerText);
    fs.chmodSync(toolsChecker, 0o755);
    for (const quoted of ['"$ROOT"/tools/check-comment-hygiene.sh', '"$(git rev-parse --show-toplevel)/tools/check-comment-hygiene.sh']) {
      fs.writeFileSync(hook, `#!/bin/sh\nexec python3 ${quoted} "$@"\n`);
      fs.chmodSync(hook, 0o755);
      assert.equal(repo.run(['--files', 'app.go']).verdict.layers.pre_commit_hygiene, 'present', quoted);
    }
    fs.writeFileSync(hook, hookText);

    // A hook naming a path no file sits at, and one naming a file git could not run,
    // both read installed and unable to run rather than installed and working.
    fs.rmSync(checker);
    assert.equal(repo.run(['--files', 'app.go']).verdict.layers.pre_commit_hygiene, 'broken');
    fs.writeFileSync(checker, checkerText);
    fs.chmodSync(checker, 0o644);
    assert.equal(repo.run(['--files', 'app.go']).verdict.layers.pre_commit_hygiene, 'broken');
    fs.chmodSync(checker, 0o755);

    fs.chmodSync(hook, 0o644);
    fs.rmSync(path.join(repo.root, '.github', 'workflows'));
    repo.write({
      '.github/workflows/hygiene.yml': 'on: push\njobs:\n  a:\n    runs-on: ubuntu-latest\n    steps:\n      - run: python3 check-comment-hygiene.sh\n',
      '.skilled/hooks/post-edit-quality/claude/adapter.cjs': 'module.exports = 1;\n',
    });
    const second = repo.run(['--files', 'app.go']).verdict.layers;
    assert.deepEqual(second, { pre_commit_hygiene: 'broken', ci_hygiene: 'present', post_edit: 'present' });

    const other = path.join(repo.parent, 'other');
    fs.mkdirSync(path.join(other, 'hooks'), { recursive: true });
    repo.git(['-C', other, 'init', '-q']);
    fs.writeFileSync(path.join(other, 'hooks', 'pre-commit'), `${hookText}# gated by skilled.trustRepoHooks\n`);
    fs.chmodSync(path.join(other, 'hooks', 'pre-commit'), 0o755);
    repo.git(['config', 'core.hooksPath', path.join(other, 'hooks')]);
    assert.equal(repo.run(['--files', 'app.go']).verdict.layers.pre_commit_hygiene, 'untrusted');
    repo.git(['config', '--local', 'skilled.trustRepoHooks', 'true']);
    // The foreign hook names a checker that resolves in this repository, so the trust
    // gate is the only thing that decided the earlier reading and the checker then
    // proves runnable here.
    assert.equal(repo.run(['--files', 'app.go']).verdict.layers.pre_commit_hygiene, 'present');
  });
  withRepo({ change: { 'app.go': 'package a\n' } }, (repo) => {
    assert.deepEqual(repo.run(['--files', 'app.go']).verdict.layers, { pre_commit_hygiene: 'absent', ci_hygiene: 'absent', post_edit: 'absent' });
  });
});
