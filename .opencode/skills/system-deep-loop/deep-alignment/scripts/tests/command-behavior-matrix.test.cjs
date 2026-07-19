// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Command Behavior Matrix Hermetic Verification                ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Exercise scheduling, fixture guards, samples, and reconciliation║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const REPO_ROOT = path.resolve(__dirname, '../../../../../..');
const SCHEDULER_PATH = path.resolve(
  __dirname,
  '../command-benchmark/run-command-behavior-matrix.cjs',
);
const MATRIX_PATH = path.join(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/deep-alignment/assets/command-benchmark',
  'command-benchmark-matrix.json',
);
const RUNNER_PATH = path.join(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/shared/behavior-benchmark',
  'behavior-bench-run.cjs',
);
const RECONCILIATION_FILE = 'command-behavior-matrix.reconciliation.json';
const SPAWN_CODE = [
  'process.stdout.write("HERMETIC-MATRIX-LINE\\n");',
  'process.stdout.write("hermetic executor complete\\n");',
].join('');

function snapshotHashes(fixturePath) {
  const hashes = {};
  function visit(currentPath, relativePath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true })
      .sort((left, right) => left.name.localeCompare(right.name));
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      const itemPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      if (entry.isDirectory()) visit(fullPath, itemPath);
      else if (entry.isFile()) {
        hashes[itemPath] = crypto.createHash('sha256')
          .update(fs.readFileSync(fullPath))
          .digest('hex');
      }
    }
  }
  visit(fixturePath, '');
  return hashes;
}

function createWorkspace(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'command-behavior-matrix-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const fixturePath = path.join(root, 'fixture');
  const scenarioPath = path.join(root, 'HERMETIC-001.md');
  fs.mkdirSync(fixturePath, { recursive: true });
  fs.writeFileSync(path.join(fixturePath, 'FIXTURE.md'), 'frozen fixture\n');
  const contract = {
    id: 'HERMETIC-001',
    title: 'Hermetic matrix cell',
    mode: 'alignment',
    entry_surface: 'cli',
    clarity: 'explicit',
    prompt: 'Emit two deterministic output lines.',
    invocation: { kind: 'natural', command: null },
    fixture: fixturePath,
    expected_interaction: 'autonomous',
    expected_presentation_markers: ['HERMETIC-MATRIX-LINE'],
    expected_delegation: {
      leaf_agent: null,
      min_task_events: 0,
      route_proof_required: false,
      role_absorption_forbidden: false,
    },
    artifacts_required: false,
    budget_ms: 30000,
    watchdog_ms: 5000,
    notes: 'The executor is a local Node process supplied through the spawn seam.',
  };
  fs.writeFileSync(
    scenarioPath,
    `# HERMETIC-001\n\n\`\`\`json\n${JSON.stringify(contract, null, 2)}\n\`\`\`\n`,
  );
  return { root, fixturePath, scenarioPath };
}

function writeManifest(workspace, { samples = 1, skip = null, corruptHash = false } = {}) {
  const hashes = snapshotHashes(workspace.fixturePath);
  if (corruptHash) hashes['FIXTURE.md'] = '0'.repeat(64);
  const resultPointer = 'cells/HERMETIC-001-hermetic-leg.result.json';
  const cell = {
    id: 'hermetic:HERMETIC-001:hermetic-leg',
    cellKind: 'driver',
    scenarioId: 'HERMETIC-001',
    scenarioPath: workspace.scenarioPath,
    legName: 'hermetic-leg',
    samples,
    fixtureRef: 'HERMETIC-001',
    ...(skip ? { skip } : { resultPointer }),
  };
  const manifest = {
    schemaVersion: 1,
    matrixId: `hermetic-matrix-${samples}-${skip ? 'skip' : 'run'}`,
    runnerPath: RUNNER_PATH,
    fixtures: {
      'HERMETIC-001': {
        path: workspace.fixturePath,
        restorePolicy: 'verify-only',
        hashes,
      },
    },
    requiredCells: [cell],
  };
  const manifestPath = path.join(workspace.root, 'matrix.json');
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return { manifest, manifestPath, resultPointer };
}

function runScheduler(matrixPath, outDir, extraEnv = {}) {
  return spawnSync(
    process.execPath,
    [SCHEDULER_PATH, '--matrix', matrixPath, '--out-dir', outDir],
    {
      cwd: REPO_ROOT,
      env: { ...process.env, ...extraEnv },
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    },
  );
}

function readReconciliation(outDir) {
  return JSON.parse(fs.readFileSync(path.join(outDir, RECONCILIATION_FILE), 'utf8'));
}

function hermeticSpawnEnv() {
  return {
    BEHAVIOR_BENCH_SPAWN_JSON: JSON.stringify([process.execPath, '-e', SPAWN_CODE]),
  };
}

test('production manifest is the exact bounded 16-scenario and 52-cell matrix', () => {
  const manifest = JSON.parse(fs.readFileSync(MATRIX_PATH, 'utf8'));
  const scenarioIds = new Set(manifest.requiredCells.map(({ scenarioId }) => scenarioId));
  const cellIds = new Set(manifest.requiredCells.map(({ id }) => id));
  const drivers = manifest.requiredCells.filter(({ cellKind }) => cellKind === 'driver');
  const leaves = manifest.requiredCells.filter(
    ({ cellKind }) => cellKind === 'alignment-leaf-sentinel',
  );

  assert.equal(manifest.bounds.scenarioCount, 16);
  assert.equal(scenarioIds.size, 16);
  assert.equal(manifest.requiredCells.length, 52);
  assert.equal(cellIds.size, 52);
  assert.equal(drivers.length, 48);
  assert.equal(leaves.length, 4);
  assert.ok(manifest.requiredCells.every(({ samples }) => samples === 1));
  assert.ok(drivers.every(({ skip }) => (
    skip.code === 'deferred_live_capture_pending_operator_green_light'
  )));
  assert.ok(leaves.every(({ skip }) => skip.code === 'alignment_fanout_not_wired'));
});

test('scheduler enumerates every required cell and reconciles all predeclared skips', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'command-matrix-all-skip-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const outDir = path.join(root, 'out');
  const manifest = JSON.parse(fs.readFileSync(MATRIX_PATH, 'utf8'));
  const run = runScheduler(MATRIX_PATH, outDir);
  const reconciliation = readReconciliation(outDir);

  assert.equal(run.status, 0, run.stderr);
  assert.equal(reconciliation.status, 'reconciled');
  assert.equal(reconciliation.requiredCellCount, manifest.requiredCells.length);
  assert.equal(reconciliation.accountedCellCount, manifest.requiredCells.length);
  assert.equal(reconciliation.resultCount, 0);
  assert.equal(reconciliation.skipCount, 52);
  assert.deepEqual(
    reconciliation.cells.map(({ id }) => id),
    manifest.requiredCells.map(({ id }) => id),
  );
});

test('spawn seam drives one non-skip cell through the runner and records a result', (t) => {
  const workspace = createWorkspace(t);
  const outDir = path.join(workspace.root, 'out');
  const { manifestPath, resultPointer } = writeManifest(workspace);
  const run = runScheduler(manifestPath, outDir, hermeticSpawnEnv());
  const reconciliation = readReconciliation(outDir);
  const result = JSON.parse(fs.readFileSync(path.join(outDir, resultPointer), 'utf8'));

  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /behavior-bench-run: HERMETIC-001 \/ hermetic-leg/);
  assert.equal(reconciliation.status, 'reconciled');
  assert.equal(reconciliation.resultCount, 1);
  assert.equal(reconciliation.cells[0].state, 'result');
  assert.equal(result.scenarioId, 'HERMETIC-001');
  assert.equal(result.leg, 'hermetic-leg');
  assert.equal(result.singleSample, true);
});

test('fixture hash mismatch blocks the cell before the runner starts', (t) => {
  const workspace = createWorkspace(t);
  const outDir = path.join(workspace.root, 'out');
  const { manifestPath, resultPointer } = writeManifest(workspace, { corruptHash: true });
  const run = runScheduler(manifestPath, outDir, hermeticSpawnEnv());
  const reconciliation = readReconciliation(outDir);

  assert.equal(run.status, 2);
  assert.match(run.stderr, /fixture hash mismatch/);
  assert.doesNotMatch(run.stdout, /behavior-bench-run:/);
  assert.equal(reconciliation.status, 'failed');
  assert.equal(reconciliation.cells[0].state, 'fixture_hash_mismatch');
  assert.equal(fs.existsSync(path.join(outDir, resultPointer)), false);
});

test('contested cell passes three samples to the runner', (t) => {
  const workspace = createWorkspace(t);
  const outDir = path.join(workspace.root, 'out');
  const { manifestPath, resultPointer } = writeManifest(workspace, { samples: 3 });
  const run = runScheduler(manifestPath, outDir, hermeticSpawnEnv());
  const result = JSON.parse(fs.readFileSync(path.join(outDir, resultPointer), 'utf8'));
  const sampleDir = path.dirname(path.join(outDir, resultPointer));

  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /samples 3\/3/);
  assert.equal(result.samplesRequested, 3);
  assert.equal(result.samplesCompleted, 3);
  for (let index = 1; index <= 3; index += 1) {
    const suffix = String(index).padStart(3, '0');
    assert.ok(fs.existsSync(path.join(
      sampleDir,
      `HERMETIC-001-hermetic-leg.sample-${suffix}.result.json`,
    )));
  }
});

test('scheduler source contains no runner internals or dimensional logic', () => {
  const source = fs.readFileSync(SCHEDULER_PATH, 'utf8');
  assert.doesNotMatch(source, /require\([^)]*behavior-bench-run/);
  assert.doesNotMatch(source, /\b(score|classify|d[1-5])\b/i);
});
