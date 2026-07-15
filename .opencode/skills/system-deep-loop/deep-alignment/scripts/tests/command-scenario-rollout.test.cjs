// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Command Scenario Rollout Reconciliation                      ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Reconcile authored command contracts and frozen v1 behavior    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const runner = require('../../../shared/behavior-benchmark/behavior-bench-run.cjs');

const REPO_ROOT = path.resolve(__dirname, '../../../../../..');
const PACKAGE_ROOT = path.resolve(__dirname, '../../behavior_benchmark');
const SCENARIO_ROOT = path.join(PACKAGE_ROOT, 'scenarios');
const INDEX_PATH = path.join(PACKAGE_ROOT, 'behavior_benchmark.md');
const BASELINE_PATH = path.join(PACKAGE_ROOT, 'baselines/claude-baseline.md');
const GOLDEN_PATH = path.join(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/shared/behavior-benchmark/tests/fixtures/dab-v1-golden.json',
);
const RUNNER_PATH = path.join(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs',
);
const PILOT_FIXTURE_ROOT = '.opencode/specs/system-deep-loop/066-command-surface-benchmark/006-command-topology-pilot/behavior_benchmark/fixtures';
const ROLLOUT_FIXTURE_ROOT = '.opencode/specs/system-deep-loop/066-command-surface-benchmark/007-command-scenario-rollout/behavior_benchmark/fixtures';
const PENDING = 'pending (deferred live capture)';
const EXPECTED_RUNNER_SHA256 = 'f568f79f98c1ccb72924bbee6cb0d742f82bdf34fc65318aff4471148882595b';
const ALLOWED_PROBES = new Set([
  'file_exists',
  'json_field_equals',
  'text_contains',
  'changed_paths_within',
]);
const EXPECTED = [
  ['DAB-012', 'DAB-012-workflow-router-deep-review.md', 'workflow router', 'task_dispatch'],
  ['DAB-013', 'DAB-013-subaction-router-doctor-parent-skill.md', 'subaction router', 'task_dispatch'],
  ['DAB-014', 'DAB-014-direct-tool-router-memory-search.md', 'direct-tool/plugin router', 'direct_dispatch'],
  ['DAB-015', 'DAB-015-monolithic-prompt-improve.md', 'monolithic', 'task_dispatch'],
  ['DAB-016', 'DAB-016-workflow-router-create-benchmark.md', 'workflow router', 'task_dispatch'],
  ['DAB-017', 'DAB-017-workflow-router-design-audit.md', 'workflow router', 'task_dispatch'],
  ['DAB-018', 'DAB-018-subaction-router-doctor-mcp-install.md', 'subaction router', 'task_dispatch'],
  ['DAB-019', 'DAB-019-subaction-router-doctor-mcp-debug.md', 'subaction router', 'task_dispatch'],
  ['DAB-020', 'DAB-020-subaction-router-doctor-mcp-conflict.md', 'subaction router', 'task_dispatch'],
  ['DAB-021', 'DAB-021-direct-tool-router-memory-learn-list.md', 'direct-tool/plugin router', 'direct_dispatch'],
  ['DAB-022', 'DAB-022-direct-tool-router-memory-learn-budget.md', 'direct-tool/plugin router', 'direct_dispatch'],
  ['DAB-023', 'DAB-023-direct-tool-router-memory-manage-health.md', 'direct-tool/plugin router', 'direct_dispatch'],
  ['DAB-024', 'DAB-024-direct-tool-router-memory-checkpoint-list.md', 'direct-tool/plugin router', 'direct_dispatch'],
  ['DAB-025', 'DAB-025-direct-tool-router-memory-save-apply.md', 'direct-tool/plugin router', 'direct_dispatch'],
  ['DAB-026', 'DAB-026-direct-plugin-router-goal-show.md', 'direct-tool/plugin router', 'direct_dispatch'],
  ['DAB-027', 'DAB-027-monolithic-agent-router-bare.md', 'monolithic', 'task_dispatch'],
].map(([id, file, topology, evidenceKind]) => ({ id, file, topology, evidenceKind }));

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

function tableRows(markdown) {
  const rows = new Map();
  for (const line of markdown.split(/\r?\n/)) {
    const match = /^\| (DAB-(\d{3})) \|/.exec(line);
    if (!match || Number(match[2]) < 12) continue;
    assert.ok(!rows.has(match[1]), `duplicate table row ${match[1]}`);
    rows.set(match[1], line);
  }
  return rows;
}

function fixedObservation() {
  return {
    spawnError: null,
    exitCode: 0,
    killedBy: 'none',
    stdoutNonEmptyLines: 2,
    stdoutText: 'alignment lane conformance run complete',
    taskEvents: [{ t: 100, line: '{"tool":"task","subagent_type":"deep-alignment"}' }],
    routeProofRecords: [{ target_agent: 'deep-alignment' }],
    seatArtifacts: 0,
    candidateArtifacts: 0,
    markerHits: [],
    fixtureGained: true,
    checkpoints: {
      tFirstOutputMs: 10,
      tSetupMs: null,
      tFirstDispatchMs: 100,
      tTerminalMs: 1000,
    },
  };
}

test('command suite is exactly DAB-012 through DAB-027 with valid schema-v2 contracts', () => {
  const expectedIds = EXPECTED.map(({ id }) => id);
  const expectedFiles = EXPECTED.map(({ file }) => file).sort();
  const commandFiles = fs.readdirSync(SCENARIO_ROOT)
    .filter((name) => {
      const match = /^DAB-(\d{3})-.*\.md$/.exec(name);
      return match && Number(match[1]) >= 12;
    })
    .sort();
  const indexRows = tableRows(fs.readFileSync(INDEX_PATH, 'utf8'));
  const baselineRows = tableRows(fs.readFileSync(BASELINE_PATH, 'utf8'));
  const ids = new Set();
  const fixtures = new Set();

  assert.deepEqual(commandFiles, expectedFiles);
  assert.deepEqual([...indexRows.keys()], expectedIds);
  assert.deepEqual([...baselineRows.keys()], expectedIds);

  for (const expected of EXPECTED) {
    const scenarioPath = path.join(SCENARIO_ROOT, expected.file);
    const markdown = fs.readFileSync(scenarioPath, 'utf8');
    const contract = runner.parseScenario(scenarioPath);
    const fixtureRoot = Number(expected.id.slice(-3)) <= 15
      ? PILOT_FIXTURE_ROOT
      : ROLLOUT_FIXTURE_ROOT;

    assert.equal(contract.schema_version, 2, `${expected.id} schema version`);
    assert.equal(contract.id, expected.id);
    assert.equal(contract.mode, 'alignment');
    assert.equal(contract.invocation.kind, 'command');
    assert.equal(contract.command_topology, expected.topology);
    assert.equal(contract.expected_delegation.evidence_kind, expected.evidenceKind);
    assert.ok(!ids.has(contract.id), `duplicate contract id ${contract.id}`);
    ids.add(contract.id);
    assert.ok(Array.isArray(contract.expected_delegation.expected_targets));
    assert.ok(Array.isArray(contract.expected_delegation.forbidden_targets));
    assert.ok(Array.isArray(contract.postconditions) && contract.postconditions.length > 0);
    assert.ok(contract.postconditions.every((probe) => ALLOWED_PROBES.has(probe.kind)));
    assert.ok(contract.boundary && Array.isArray(contract.boundary.allow_prefixes));
    assert.ok(contract.boundary.allow_prefixes.length > 0, `${expected.id} boundary is non-empty`);
    for (const probe of contract.postconditions.filter(({ kind }) => kind === 'changed_paths_within')) {
      assert.ok(contract.boundary.allow_prefixes.includes(probe.prefix));
    }
    assert.ok(contract.fixture.startsWith(`${fixtureRoot}/`));
    assert.ok(!fixtures.has(contract.fixture), `fixture reused by ${contract.id}`);
    fixtures.add(contract.fixture);
    assert.ok(fs.statSync(path.join(REPO_ROOT, contract.fixture)).isDirectory());
    assert.match(markdown, /\*\*Rationale\.\*\*/);
    assert.match(markdown, /\*\*Pass shape\.\*\*/);
    assert.match(markdown, /\*\*Failure modes\.\*\*/);

    const baselineCells = baselineRows.get(expected.id)
      .split('|')
      .map((cell) => cell.trim())
      .filter(Boolean);
    assert.equal(baselineCells.length, 7);
    assert.ok(baselineCells.slice(2).every((cell) => cell === PENDING));
  }

  assert.equal(ids.size, 16);
  assert.equal(fixtures.size, 16);

  for (const id of ['DAB-018', 'DAB-019', 'DAB-020']) {
    const expected = EXPECTED.find((entry) => entry.id === id);
    const contract = runner.parseScenario(path.join(SCENARIO_ROOT, expected.file));
    assert.ok(contract.postconditions.some((probe) => probe.binds_setup === true));
  }

  for (const id of ['DAB-014', 'DAB-021', 'DAB-022', 'DAB-023', 'DAB-024', 'DAB-025', 'DAB-026']) {
    const expected = EXPECTED.find((entry) => entry.id === id);
    const contract = runner.parseScenario(path.join(SCENARIO_ROOT, expected.file));
    assert.ok(contract.expected_delegation.expected_targets.length > 0);
    assert.ok(contract.expected_delegation.forbidden_targets.length > 0);
  }
});

test('new presentation markers remain pinned to their command sources', () => {
  for (const expected of EXPECTED.filter(({ id }) => Number(id.slice(-3)) >= 16)) {
    const scenarioPath = path.join(SCENARIO_ROOT, expected.file);
    const markdown = fs.readFileSync(scenarioPath, 'utf8');
    const contract = runner.parseScenario(scenarioPath);
    const pins = parseMarkerPins(markdown);

    assert.equal(pins.length, contract.expected_presentation_markers.length);
    assert.deepEqual(
      new Set(pins.map(({ marker }) => marker)),
      new Set(contract.expected_presentation_markers),
    );
    for (const pin of pins) {
      const sourcePath = path.join(REPO_ROOT, pin.source);
      assert.ok(fs.existsSync(sourcePath), `${pin.source} exists`);
      assert.equal(sha256(sourcePath), pin.hash, `${pin.source} hash drifted`);
      assert.ok(fs.readFileSync(sourcePath, 'utf8').includes(pin.marker));
    }
  }
});

test('frozen DAB-001 through DAB-011 scoring still matches the v1 golden', () => {
  assert.equal(sha256(RUNNER_PATH), EXPECTED_RUNNER_SHA256, 'runner bytes changed');
  const golden = JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));
  const files = fs.readdirSync(SCENARIO_ROOT)
    .filter((name) => /^DAB-0(0[1-9]|1[01])-.*\.md$/.test(name))
    .sort();

  assert.equal(files.length, 11);
  assert.equal(Object.keys(golden).length, 11);
  for (const file of files) {
    const contract = runner.parseScenario(path.join(SCENARIO_ROOT, file));
    assert.ok(contract.schema_version === undefined || contract.schema_version === 1);
    const observation = fixedObservation();
    const causes = runner.classificationCauses(contract, observation);
    const selected = runner.selectResultCauses(contract, causes);
    const fingerprint = {
      schemaVersion: contract.schema_version === 2 ? 2 : 1,
      dimensions: runner.score(contract, observation, null),
      classification: causes[0],
      primaryCause: selected.primaryCause,
      secondaryCause: selected.secondaryCause,
    };
    assert.deepEqual(fingerprint, golden[contract.id], `${contract.id} golden drift`);
  }
});

test('quotable Claude baseline values are present for all sixteen command cells', (t) => {
  const rows = tableRows(fs.readFileSync(BASELINE_PATH, 'utf8'));
  const pendingIds = EXPECTED
    .filter(({ id }) => rows.get(id).includes(PENDING))
    .map(({ id }) => id);

  if (pendingIds.length === EXPECTED.length) {
    t.skip('PENDING — live Claude baseline capture requires operator green-light');
    return;
  }

  assert.equal(pendingIds.length, 0, `partial baseline capture: ${pendingIds.join(', ')}`);
  for (const { id } of EXPECTED) {
    const cells = rows.get(id).split('|').map((cell) => cell.trim()).filter(Boolean);
    assert.equal(cells.length, 7);
    assert.ok(cells.slice(2, 6).every((cell) => /^(?:\d+(?:\.\d+)?(?:ms|s)|—)$/.test(cell)));
    assert.match(cells[6], /^(?:pass|partial|setup_misbind|route_mismatch|timeout_latency|stuck_no_progress|crash|boundary_violation)$/);
  }
});
