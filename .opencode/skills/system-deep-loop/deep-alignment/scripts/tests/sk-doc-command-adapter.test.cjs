#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Alignment Command Adapter — deterministic fixture regression       ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const adapter = require('../adapters/sk-doc-command.cjs');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..', '..');
const EXPECTATION_INDEX = path.join(
  REPO_ROOT,
  '.opencode',
  'specs',
  'system-deep-loop',
  '066-command-surface-benchmark',
  '002-deterministic-fixtures-oracle',
  'expectations',
  'index.json',
);
const SYNC_PROMPTS = path.join(
  REPO_ROOT,
  '.opencode',
  'skills',
  'system-spec-kit',
  'scripts',
  'codex',
  'sync-prompts.cjs',
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function testStandardSource() {
  const sources = adapter.standardSource('sk-doc');
  assert.equal(sources.authority, 'sk-doc');
  assert.equal(sources.adapter, 'sk-doc-command');
  assert.ok(fs.existsSync(sources.validators.referenceChecks.path));
  assert.ok(fs.existsSync(sources.validators.syncInventory.path));
  assert.ok(fs.existsSync(sources.templates.commandCanon));
  assert.ok(fs.existsSync(sources.rules.topologyTaxonomy));
  assert.ok(fs.existsSync(sources.rules.knownDeviationsDocument));
  assert.deepEqual(sources.knownDeviations, []);
  assert.throws(() => adapter.standardSource('other'));
}

function testDiscoverMatchesSyncInventory() {
  const sync = spawnSync(process.execPath, [SYNC_PROMPTS, '--check'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  assert.equal(sync.status, 0, sync.stderr || sync.stdout);
  const match = sync.stdout.match(/PASS:\s+(\d+) prompts are in sync/);
  assert.ok(match, 'prompt-sync output must expose the canonical inventory count');
  const expectedCount = Number(match[1]);
  const discovered = adapter.discover({
    type: 'paths',
    values: ['.opencode/commands'],
  });
  assert.equal(discovered.artifacts.length, expectedCount);
  assert.equal(discovered.nodes.length, expectedCount);
  assert.deepEqual(
    discovered.artifacts.map((artifact) => artifact.path),
    [...new Set(discovered.artifacts.map((artifact) => artifact.path))].sort(),
    'discovery must return one sorted canonical source entry per command',
  );
  return expectedCount;
}

function testFixtureExpectations() {
  const index = readJson(EXPECTATION_INDEX);
  const outcomes = [];
  for (const fixture of index.fixtures) {
    const expected = readJson(path.join(REPO_ROOT, fixture.expectationPath)).findings;
    const actual = adapter.check(
      { path: '.' },
      { rootDir: path.join(REPO_ROOT, fixture.path), fullCorpus: true },
    );
    assert.deepEqual(actual, expected, `${fixture.id} must match its frozen finding set`);
    assert.ok(
      actual.every((finding) => /^CMD-S[1-5]-/.test(finding.code)),
      `${fixture.id} emitted a finding outside the command adapter vocabulary`,
    );
    outcomes.push({
      id: fixture.id,
      classification: fixture.classification,
      findings: actual.length,
    });
  }

  const clean = outcomes.find((outcome) => outcome.id === index.cleanControlId);
  assert.ok(clean, 'clean control must be present in the fixture index');
  assert.equal(clean.findings, 0, 'clean control must produce zero findings');
  return outcomes;
}

testStandardSource();
const discoverCount = testDiscoverMatchesSyncInventory();
const outcomes = testFixtureExpectations();
for (const outcome of outcomes) {
  console.log(
    `[sk-doc-command] PASS ${outcome.id} (${outcome.classification}): ${outcome.findings} finding(s)`,
  );
}
console.log(
  `[sk-doc-command] PASS fixtures=${outcomes.length} clean=0 discover=${discoverCount}`,
);
