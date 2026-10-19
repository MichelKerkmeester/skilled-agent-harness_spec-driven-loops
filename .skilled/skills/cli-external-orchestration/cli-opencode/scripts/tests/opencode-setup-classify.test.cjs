#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Setup Classifier Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// The setup helper's classifier is a shell function inside a larger script, so
// the test extracts it and runs it against the shared corpus. Nothing installs
// and nothing under HOME is touched.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS AND PATHS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const { execFileSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const SCRIPT = path.resolve(__dirname, '..', 'opencode-setup.sh');
const CORPUS = path.resolve(
  __dirname, '..', '..', '..', '..', '..',
  'hooks', 'dispatch', 'lib', 'opencode-version-corpus.json',
);
const CORPUS_ENTRIES = JSON.parse(fs.readFileSync(CORPUS, 'utf8'));
const CLASSIFY_VERSION = execFileSync(
  'sed', ['-n', '/^classify_version()/,/^}/p', SCRIPT], { encoding: 'utf8' },
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function shellQuote(value) {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('the setup helper defines classify_version', () => {
  assert.match(CLASSIFY_VERSION, /^classify_version\(\) \{/m);
});

test('classify_version reads every shared corpus entry', () => {
  assert.ok(CORPUS_ENTRIES.length >= 12);
  for (const { output, family } of CORPUS_ENTRIES) {
    const script = `${CLASSIFY_VERSION}\nset -euo pipefail\nprintf '%s' ${shellQuote(output)} | classify_version`;
    const result = spawnSync('bash', ['-c', script], { encoding: 'utf8' });
    assert.equal(result.status, 0, `${JSON.stringify(output)}: ${result.stderr}`);
    assert.equal(result.stdout, `${family}\n`, JSON.stringify(output));
  }
});
