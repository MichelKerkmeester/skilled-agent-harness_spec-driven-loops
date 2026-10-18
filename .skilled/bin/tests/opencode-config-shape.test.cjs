#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Config Shape Tests
// ───────────────────────────────────────────────────────────────────
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');
const CONFIG_PATH = path.join(REPO_ROOT, 'opencode.json');

function checkConfigShape(configPath) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const keys = Object.keys(config);

  for (const key of ['permissions', 'plugins', 'disabled']) {
    assert.equal(keys.includes(key), false, `opencode.json must not define top-level ${key}`);
  }
  assert.equal(keys.includes('permission'), true, 'opencode.json must define top-level permission');
}

test('repo opencode.json keeps the v1 config shape', () => {
  checkConfigShape(CONFIG_PATH);
});

test('rejects a top-level plugins key', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'opencode-config-shape-'));

  try {
    const copyPath = path.join(tempDir, 'opencode.json');
    fs.copyFileSync(CONFIG_PATH, copyPath);
    const config = JSON.parse(fs.readFileSync(copyPath, 'utf8'));
    config.plugins = [];
    fs.writeFileSync(copyPath, `${JSON.stringify(config, null, 2)}\n`);

    assert.throws(() => checkConfigShape(copyPath), /plugins/);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
