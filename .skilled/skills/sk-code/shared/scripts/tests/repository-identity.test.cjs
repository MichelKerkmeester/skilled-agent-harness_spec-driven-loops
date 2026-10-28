// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Repository Identity Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// A config file travels with the skill, so its `repository` field must be checked
// against the repository the caller is in. These cases prove the parser reads every
// remote form git accepts, that the environment wins over the remote, that an unknown
// repository is an answer rather than a throw, and that the match ignores case.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { REPOSITORY_PATTERN, currentRepository, normalizeRemote, repositoryMatches } = require('../lib/repository-identity.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const HAS_GIT = spawnSync('git', ['--version'], { encoding: 'utf8' }).status === 0;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

// A throwaway repository, with an origin remote when one is named.
function withRepo(remote, body) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'repository-identity-'));
  try {
    spawnSync('git', ['init', '--quiet', root], { encoding: 'utf8' });
    if (remote) spawnSync('git', ['-C', root, 'remote', 'add', 'origin', remote], { encoding: 'utf8' });
    return body(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('normalizeRemote reads https, ssh and scp-like remotes', () => {
  assert.equal(normalizeRemote('https://github.com/example/widget.git'), 'example/widget');
  assert.equal(normalizeRemote('https://github.com/example/widget'), 'example/widget');
  assert.equal(normalizeRemote('ssh://git@github.com/example/widget.git'), 'example/widget');
  assert.equal(normalizeRemote('git@github.com:example/widget.git'), 'example/widget');
  assert.equal(normalizeRemote('github.com:example/widget.git'), 'example/widget');
  assert.equal(normalizeRemote('github.com:o/n.git'), 'o/n');
});

test('normalizeRemote tolerates a trailing slash and any host', () => {
  assert.equal(normalizeRemote('https://git.example.com/example/widget.git/'), 'example/widget');
  assert.equal(normalizeRemote('https://git.example.com/example/widget/'), 'example/widget');
  assert.equal(normalizeRemote('ssh://git@git.example.com/example/widget.git/'), 'example/widget');
});

// The host part of the scp-like form is optional in front, so a drive letter must not be
// read as a host and a local path must not answer as a repository.
test('normalizeRemote does not read a Windows drive path or a URL as the scp-like form', () => {
  for (const value of ['C:/Users/me/repo', 'C:\\Users\\me\\repo', 'D:/work/example/widget']) {
    assert.equal(normalizeRemote(value), null, `"${value}" should not parse`);
  }
  assert.equal(normalizeRemote('https://github.com/example/widget.git'), 'example/widget');
});

test('normalizeRemote returns null for text that names no repository', () => {
  for (const value of ['', '   ', 'not a remote', 'https://github.com/only-one-segment', 'git@github.com:', null, undefined, 42]) {
    assert.equal(normalizeRemote(value), null, `"${String(value)}" should not parse`);
  }
});

test('REPOSITORY_PATTERN accepts owner/name and refuses anything else', () => {
  assert.ok(REPOSITORY_PATTERN.test('example/widget'));
  assert.ok(REPOSITORY_PATTERN.test('Example.Widget_1/name-with.dots'));
  assert.ok(!REPOSITORY_PATTERN.test('example'));
  assert.ok(!REPOSITORY_PATTERN.test('example/widget/extra'));
  assert.ok(!REPOSITORY_PATTERN.test('example widget'));
  assert.ok(!REPOSITORY_PATTERN.test('https://github.com/example/widget'));
});

// The remote read is a git call, so the caller's environment decides which configuration,
// and so which origin remote, the answer comes from. A stub git that answers only when the
// caller's PATH reaches it proves the environment was handed to the child.
test('currentRepository passes its environment to the git read', (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'repository-identity-git-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const log = path.join(dir, 'git-calls.log');
  fs.writeFileSync(log, '');
  fs.writeFileSync(path.join(dir, 'git'), `#!/usr/bin/env node
const fs = require('node:fs');
fs.appendFileSync(${JSON.stringify(log)}, process.argv.slice(2).join(' ') + '\\n');
process.stdout.write('github.com:acme/widgets.git\\n');
`, { mode: 0o755 });
  const env = { PATH: `${dir}${path.delimiter}${process.env.PATH}` };
  assert.deepEqual(currentRepository({ root: dir, env }), { identity: 'acme/widgets', source: 'origin' });
  const calls = fs.readFileSync(log, 'utf8');
  assert.ok(calls.includes(`-C ${dir}`), calls);
  assert.match(calls, /remote get-url origin$/m);
});

test('GITHUB_REPOSITORY wins over the origin remote', { skip: !HAS_GIT && 'git is not installed' }, () => {
  withRepo('https://github.com/other/place.git', (root) => {
    const result = currentRepository({ root, env: { GITHUB_REPOSITORY: 'Example/Widget' } });
    assert.deepEqual(result, { identity: 'Example/Widget', source: 'env' });
  });
});

test('a repository with an origin remote reports it as the source', { skip: !HAS_GIT && 'git is not installed' }, () => {
  withRepo('git@github.com:example/widget.git', (root) => {
    assert.deepEqual(currentRepository({ root, env: {} }), { identity: 'example/widget', source: 'origin' });
  });
});

test('a repository with no origin remote reports nothing', { skip: !HAS_GIT && 'git is not installed' }, () => {
  withRepo(null, (root) => {
    assert.deepEqual(currentRepository({ root, env: {} }), { identity: null, source: null });
    assert.deepEqual(
      currentRepository({ root, env: { GITHUB_REPOSITORY: 'not-a-repository' } }),
      { identity: null, source: null },
    );
  });
});

test('repositoryMatches accepts an absent field and a case-insensitive match', () => {
  assert.equal(repositoryMatches(undefined, 'example/widget'), true);
  assert.equal(repositoryMatches(null, 'example/widget'), true);
  assert.equal(repositoryMatches('example/widget', 'example/widget'), true);
  assert.equal(repositoryMatches('Example/Widget', 'example/widget'), true);
  assert.equal(repositoryMatches('example/widget', 'Example/Widget'), true);
});

test('repositoryMatches refuses a different repository or an unknown one', () => {
  assert.equal(repositoryMatches('example/widget', 'example/other'), false);
  assert.equal(repositoryMatches('example/widget', null), false);
  assert.equal(repositoryMatches('example/widget', undefined), false);
});
