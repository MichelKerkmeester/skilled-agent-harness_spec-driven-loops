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
});

test('normalizeRemote tolerates a trailing slash and any host', () => {
  assert.equal(normalizeRemote('https://git.example.com/example/widget.git/'), 'example/widget');
  assert.equal(normalizeRemote('https://git.example.com/example/widget/'), 'example/widget');
  assert.equal(normalizeRemote('ssh://git@git.example.com/example/widget.git/'), 'example/widget');
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
