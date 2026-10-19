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
const AGENTS_DIR = path.join(REPO_ROOT, '.skilled', 'agents');
const ALLOWED_PERMISSION_VALUES = new Set(['allow', 'ask', 'deny']);
const AGENT_DENIALS_PATH = path.join(__dirname, 'fixtures', 'agent-permission-denials.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

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

function checkNoV2NativeKeys(configPath) {
  const config = readJson(configPath);
  const keys = Object.keys(config);

  assert.equal(keys.includes('providers'), false, 'opencode.json must not define top-level providers');
  if (config.mcp !== null && typeof config.mcp === 'object') {
    assert.equal(
      Object.keys(config.mcp).includes('servers'),
      false,
      'opencode.json must not define mcp.servers',
    );
  }
}

function assertPermissionLeaf(value, location) {
  assert.equal(
    typeof value === 'string' && ALLOWED_PERMISSION_VALUES.has(value),
    true,
    `${location} must be one of allow, ask or deny (got ${JSON.stringify(value)})`,
  );
}

function checkPermissionLeaves(value, location) {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) {
      checkPermissionLeaves(child, `${location}.${key}`);
    }
    return;
  }

  assertPermissionLeaf(value, location);
}

function checkPermissionShape(configPath) {
  const config = readJson(configPath);
  assert.equal(
    Object.keys(config).includes('permission'),
    true,
    'opencode.json must define top-level permission',
  );
  checkPermissionLeaves(config.permission, 'permission');
}

function frontmatterLines(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  if (lines[0].trim() !== '---') return null;

  const end = lines.indexOf('---', 1);
  if (end === -1) return null;
  return lines.slice(1, end);
}

function permissionLeaves(lines) {
  const leaves = [];
  const parents = [];
  let blockIndent = null;

  for (const line of lines) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue;

    const indent = line.length - line.trimStart().length;
    const match = /^([^:#][^:]*):\s*(.*)$/.exec(line.trim());
    if (match === null) continue;

    const key = match[1].trim();
    const value = match[2].trim();

    if (blockIndent === null) {
      if (indent === 0 && key === 'permission') blockIndent = indent;
      continue;
    }
    if (indent <= blockIndent) break;

    while (parents.length > 0 && parents[parents.length - 1].indent >= indent) {
      parents.pop();
    }

    if (value === '') {
      parents.push({ indent, key });
      continue;
    }

    leaves.push({
      key: [...parents.map((parent) => parent.key), key].join('.'),
      value,
    });
  }

  return leaves;
}

function checkAgentPermissions(agentsDir) {
  const agents = fs.readdirSync(agentsDir).filter((name) => name.endsWith('.md')).sort();

  for (const name of agents) {
    const lines = frontmatterLines(path.join(agentsDir, name));
    if (lines === null) continue;

    for (const leaf of permissionLeaves(lines)) {
      assert.equal(
        ALLOWED_PERMISSION_VALUES.has(leaf.value),
        true,
        `${name}: permission.${leaf.key} is ${JSON.stringify(leaf.value)}, expected allow, ask or deny`,
      );
    }
  }
}

function agentPermissionMap(lines) {
  const values = new Map();
  for (const leaf of permissionLeaves(lines)) {
    values.set(leaf.key, leaf.value);
  }
  return values;
}

function checkAgentPermissionDenials(agentsDir, fixturePath) {
  const expectedDenials = readJson(fixturePath);

  for (const [name, keys] of Object.entries(expectedDenials)) {
    const agentPath = path.join(agentsDir, name);
    assert.equal(
      fs.existsSync(agentPath),
      true,
      `${name}: agent file is gone; update ${path.relative(REPO_ROOT, fixturePath)}`,
    );

    const lines = frontmatterLines(agentPath);
    const values = lines === null ? new Map() : agentPermissionMap(lines);

    for (const key of keys) {
      assert.equal(
        values.get(key),
        'deny',
        `${name}: permission.${key} is ${JSON.stringify(values.get(key))}, expected deny`,
      );
    }
  }
}

test('repo opencode.json defines no OpenCode 2-native keys', () => {
  checkNoV2NativeKeys(CONFIG_PATH);
});

test('repo opencode.json permission leaves are allow, ask or deny', () => {
  checkPermissionShape(CONFIG_PATH);
});

test('repo agent permission blocks are allow, ask or deny', () => {
  checkAgentPermissions(AGENTS_DIR);
});

// Changing a denial is a deliberate act, so it has to show up as a fixture edit in review.
test('repo agent permission denials stay denied', () => {
  checkAgentPermissionDenials(AGENTS_DIR, AGENT_DENIALS_PATH);
});
