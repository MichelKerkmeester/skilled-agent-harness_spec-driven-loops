// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Command Topology Pilot Reconciliation                        ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Reconcile authored contracts and activate captured-result gates ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const { parseScenario } = require('../../../shared/behavior-benchmark/behavior-bench-run.cjs');

const REPO_ROOT = path.resolve(__dirname, '../../../../../..');
const PACKAGE_ROOT = path.resolve(__dirname, '../../behavior-benchmark');
const SCENARIO_ROOT = path.join(PACKAGE_ROOT, 'scenarios');
const INDEX_PATH = path.join(PACKAGE_ROOT, 'behavior-benchmark.md');
const BASELINE_PATH = path.join(PACKAGE_ROOT, 'baselines/claude-baseline.md');
const SPEC_ROOT = path.join(
  REPO_ROOT,
  '.opencode/specs/system-deep-loop/066-command-surface-benchmark/006-command-topology-pilot',
);
const RESULT_ROOT = path.join(SPEC_ROOT, 'evidence');
const FIXTURE_ROOT = path.join(SPEC_ROOT, 'behavior-benchmark/fixtures');
const FIXTURE_ROOT_REL = path.relative(REPO_ROOT, FIXTURE_ROOT).split(path.sep).join('/');
const ALLOWED_PROBES = new Set([
  'file_exists',
  'json_field_equals',
  'text_contains',
  'changed_paths_within',
]);
const EXPECTED = [
  {
    id: 'DAB-012',
    file: 'DAB-012-workflow-router-deep-review.md',
    topology: 'workflow router',
    evidenceKind: 'task_dispatch',
  },
  {
    id: 'DAB-013',
    file: 'DAB-013-subaction-router-doctor-parent-skill.md',
    topology: 'subaction router',
    evidenceKind: 'task_dispatch',
  },
  {
    id: 'DAB-014',
    file: 'DAB-014-direct-tool-router-memory-search.md',
    topology: 'direct-tool/plugin router',
    evidenceKind: 'direct_dispatch',
  },
  {
    id: 'DAB-015',
    file: 'DAB-015-monolithic-prompt-improve.md',
    topology: 'monolithic',
    evidenceKind: 'task_dispatch',
  },
];

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function parseMarkerPins(markdown) {
  const pins = [];
  const rowPattern = /^\| `([^`]+)` \| `([^`]+)` \| `sha256:([a-f0-9]{64})` \|$/gm;
  let match;
  while ((match = rowPattern.exec(markdown)) !== null) {
    pins.push({ marker: match[1], source: match[2], hash: match[3] });
  }
  return pins;
}

function collectResultFiles(rootDir) {
  if (!fs.existsSync(rootDir)) return [];
  const found = [];
  const pending = [rootDir];
  while (pending.length > 0) {
    const current = pending.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const candidate = path.join(current, entry.name);
      if (entry.isDirectory()) pending.push(candidate);
      if (entry.isFile() && entry.name.endsWith('.result.json')) found.push(candidate);
    }
  }
  return found.sort();
}

function loadPilotResults() {
  const expectedIds = new Set(EXPECTED.map(({ id }) => id));
  return collectResultFiles(RESULT_ROOT)
    .map((filePath) => ({ filePath, result: JSON.parse(fs.readFileSync(filePath, 'utf8')) }))
    .filter(({ result }) => expectedIds.has(result.scenarioId));
}

test('contracts cover every command topology with pinned schema-v2 markers', () => {
  const indexText = fs.readFileSync(INDEX_PATH, 'utf8');
  const baselineText = fs.readFileSync(BASELINE_PATH, 'utf8');
  const topologies = new Set();

  for (const expected of EXPECTED) {
    const scenarioPath = path.join(SCENARIO_ROOT, expected.file);
    const markdown = fs.readFileSync(scenarioPath, 'utf8');
    const contract = parseScenario(scenarioPath);

    assert.ok(contract, `${expected.id} must parse`);
    assert.equal(contract.schema_version, 2);
    assert.equal(contract.id, expected.id);
    assert.equal(contract.mode, 'alignment');
    assert.equal(contract.command_topology, expected.topology);
    assert.equal(contract.expected_delegation.evidence_kind, expected.evidenceKind);
    assert.ok(Array.isArray(contract.expected_delegation.expected_targets));
    assert.ok(Array.isArray(contract.expected_delegation.forbidden_targets));
    assert.ok(Array.isArray(contract.postconditions) && contract.postconditions.length > 0);
    assert.ok(contract.postconditions.every((probe) => ALLOWED_PROBES.has(probe.kind)));
    assert.ok(contract.boundary && Array.isArray(contract.boundary.allow_prefixes));
    assert.ok(contract.fixture.startsWith(`${FIXTURE_ROOT_REL}/`));
    assert.ok(fs.statSync(path.join(REPO_ROOT, contract.fixture)).isDirectory());
    assert.match(indexText, new RegExp(`^\\| ${expected.id} \\|`, 'm'));
    assert.match(markdown, /\*\*Rationale\.\*\*/);
    assert.match(markdown, /\*\*Pass shape\.\*\*/);
    assert.match(markdown, /\*\*Failure modes\.\*\*/);

    const pins = parseMarkerPins(markdown);
    assert.equal(pins.length, contract.expected_presentation_markers.length);
    assert.deepEqual(
      new Set(pins.map(({ marker }) => marker)),
      new Set(contract.expected_presentation_markers),
    );
    for (const pin of pins) {
      const sourcePath = path.join(REPO_ROOT, pin.source);
      assert.ok(fs.existsSync(sourcePath), `${pin.source} must exist`);
      assert.equal(sha256(sourcePath), pin.hash, `${pin.source} hash drifted`);
      assert.ok(fs.readFileSync(sourcePath, 'utf8').includes(pin.marker));
    }

    topologies.add(contract.command_topology);
  }

  const pendingRows = baselineText
    .split(/\r?\n/)
    .filter((line) => /^\| DAB-01[2-5] \|/.test(line));
  assert.equal(pendingRows.length, 4);
  for (const row of pendingRows) {
    const cells = row.split('|').map((cell) => cell.trim()).filter(Boolean);
    assert.ok(cells.slice(2).every((cell) => cell === 'pending (deferred live capture)'));
  }

  assert.deepEqual(
    [...topologies].sort(),
    ['direct-tool/plugin router', 'monolithic', 'subaction router', 'workflow router'],
  );

  const setupContract = parseScenario(path.join(SCENARIO_ROOT, EXPECTED[1].file));
  assert.ok(setupContract.postconditions.some((probe) => probe.binds_setup === true));

  const directContract = parseScenario(path.join(SCENARIO_ROOT, EXPECTED[2].file));
  assert.ok(directContract.expected_delegation.expected_targets.length > 0);
  assert.ok(directContract.expected_delegation.forbidden_targets.length > 0);

  const monolithicContract = parseScenario(path.join(SCENARIO_ROOT, EXPECTED[3].file));
  assert.equal(monolithicContract.expected_delegation.role_absorption_forbidden, false);
  assert.ok(monolithicContract.expected_delegation.forbidden_targets.length > 0);
});

test('captured Claude and GPT records reconcile when present', (t) => {
  const records = loadPilotResults();
  if (records.length === 0) {
    t.skip('PENDING — live executor capture requires operator green-light');
    return;
  }

  assert.equal(records.length, 8, 'a partial result set must not pass reconciliation');
  const identities = new Set();
  const legs = new Set();
  const byScenario = new Map();

  for (const { filePath, result } of records) {
    assert.equal(result.schemaVersion, 2, `${filePath} must be schema v2`);
    assert.notEqual(result.classification, 'env_error', `${filePath} is retryable, not quotable`);
    assert.equal(typeof result.leg, 'string');
    assert.ok(result.leg.length > 0);
    assert.ok(Number.isFinite(Date.parse(result.startedAt)));
    assert.ok(Number.isFinite(Date.parse(result.endedAt)));
    assert.equal(typeof result.transcriptPath, 'string');
    assert.ok(result.transcriptPath.length > 0);
    assert.ok(result.terminal && Object.hasOwn(result.terminal, 'killedBy'));
    assert.ok(result.boundary && typeof result.boundary.clean === 'boolean');
    assert.ok(Array.isArray(result.boundary.escapes));
    assert.equal(result.boundary.clean, result.boundary.escapes.length === 0);

    const identity = `${result.scenarioId}:${result.leg}`;
    assert.ok(!identities.has(identity), `duplicate result ${identity}`);
    identities.add(identity);
    legs.add(result.leg);
    const scenarioRecords = byScenario.get(result.scenarioId) || [];
    scenarioRecords.push(result);
    byScenario.set(result.scenarioId, scenarioRecords);
  }

  assert.equal(legs.size, 2);
  assert.ok(legs.has('claude-cli'));
  const gptLegs = [...legs].filter((leg) => /^gpt(?:-|$)/i.test(leg));
  assert.equal(gptLegs.length, 1);

  for (const { id } of EXPECTED) {
    const scenarioRecords = byScenario.get(id) || [];
    assert.equal(scenarioRecords.length, 2, `${id} must have one result per driver`);
    assert.ok(scenarioRecords.some(({ leg }) => leg === 'claude-cli'));
    assert.ok(scenarioRecords.some(({ leg }) => /^gpt(?:-|$)/i.test(leg)));
  }

  const directRecords = byScenario.get('DAB-014');
  for (const result of directRecords) {
    assert.ok(result.directDispatch);
    assert.equal(typeof result.directDispatch.expectedTargetHits, 'number');
    assert.equal(typeof result.directDispatch.forbiddenTargetHits, 'number');
  }
});
