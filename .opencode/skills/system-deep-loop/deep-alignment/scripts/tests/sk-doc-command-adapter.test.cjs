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

function testExecutableEdges() {
  const src = '.opencode/commands/create/readme.md';
  // Comment references — whole-line and inline — are never executable edges.
  assert.deepEqual(
    adapter.executableCommandEdges(`# The setup phase in ${src} determines the operation`),
    [],
    'a whole-line comment must yield zero edges',
  );
  assert.deepEqual(
    adapter.executableCommandEdges(`role: Expert Creator  # mirrors ${src}`),
    [],
    'an inline comment must yield zero edges',
  );
  // Structural value positions are edges, each carrying a kind and a source line.
  const mapping = adapter.executableCommandEdges(`back_edge: "${src}"`);
  assert.deepEqual(
    mapping,
    [{ target: src, line: 1, kind: 'direct' }],
    'a mapping value must be a direct edge with its source line',
  );
  const listItem = adapter.executableCommandEdges(`steps:\n  - ${src}`);
  assert.deepEqual(
    listItem,
    [{ target: src, line: 2, kind: 'direct' }],
    'a sequence item must be a direct edge with its source line',
  );
  const workflow = adapter.executableCommandEdges(
    'workflow: .opencode/commands/doctor/assets/doctor_mcp_install.yaml',
  );
  assert.deepEqual(
    workflow,
    [{ target: '.opencode/commands/doctor/assets/doctor_mcp_install.yaml', line: 1, kind: 'workflow' }],
    'a .yaml mapping value must be a workflow edge',
  );
  const arrow = adapter.executableCommandEdges(
    '  - `install` -> `.opencode/commands/doctor/assets/doctor_mcp_install.yaml`',
  );
  assert.deepEqual(
    arrow,
    [{ target: '.opencode/commands/doctor/assets/doctor_mcp_install.yaml', line: 1, kind: 'subaction' }],
    'a route arrow must be a subaction edge',
  );
  for (const edge of [...mapping, ...listItem, ...workflow, ...arrow]) {
    assert.ok(
      ['direct', 'subaction', 'workflow'].includes(edge.kind),
      'every edge kind must be in the direct/subaction/workflow taxonomy',
    );
    assert.equal(typeof edge.line, 'number', 'every edge must carry a numeric source line');
  }
  console.log('[sk-doc-command] PASS executable-edges: comment=0, direct/subaction/workflow typed');
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
    const coreFindings = actual.map(({ code, severity, dimension, location }) => ({
      code,
      severity,
      dimension,
      location,
    }));
    assert.deepEqual(coreFindings, expected, `${fixture.id} must match its frozen finding set`);
    assert.ok(
      actual.every((finding) => /^CMD-S[1-5]-/.test(finding.code)),
      `${fixture.id} emitted a finding outside the command adapter vocabulary`,
    );
    for (const finding of actual) {
      assert.ok(
        typeof finding.type === 'string' && finding.type.length > 0,
        `${fixture.id} emitted a finding without a reducer-compatible type`,
      );
      assert.ok(
        typeof finding.artifactPath === 'string' && finding.artifactPath.length > 0,
        `${fixture.id} emitted a finding without a reducer-compatible artifactPath`,
      );
      assert.ok(
        typeof finding.message === 'string' && finding.message.length > 0,
        `${fixture.id} emitted a finding without a reducer-compatible message`,
      );
      assert.equal(
        finding.type,
        finding.code,
        `${fixture.id} finding type must preserve its code`,
      );
      assert.equal(
        finding.artifactPath,
        finding.location.replace(/:\d+$/, ''),
        `${fixture.id} finding artifactPath must preserve its POSIX location path`,
      );
      assert.ok(
        finding.message.includes(finding.code)
          && finding.message.includes(finding.location),
        `${fixture.id} finding message must render its code and location`,
      );
      assert.equal(
        /[\r\n]/.test(finding.message),
        false,
        `${fixture.id} finding message must remain one line`,
      );
    }
    if (fixture.id === 'held-out-compound-multi-defect') {
      const dedupKeys = actual.map((finding) => (
        `fl:${finding.severity}|${finding.type}|${finding.artifactPath}|${finding.message}`
      ));
      assert.equal(actual.length, 3, 'compound fixture must emit three findings');
      assert.equal(
        new Set(dedupKeys).size,
        3,
        'compound fixture findings must retain three distinct reducer fallback keys',
      );
    }
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
testExecutableEdges();
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
