#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const REPO_ROOT = path.resolve(__dirname, '../../..');
const COMMAND_PATH = path.join(REPO_ROOT, '.opencode/commands/deep/command-benchmark.md');
const AUTO_PATH = path.join(REPO_ROOT, '.opencode/commands/deep/assets/deep-command-benchmark-auto.yaml');
const CONFIRM_PATH = path.join(REPO_ROOT, '.opencode/commands/deep/assets/deep-command-benchmark-confirm.yaml');
const PRESENTATION_PATH = path.join(REPO_ROOT, '.opencode/commands/deep/assets/deep-command-benchmark-presentation.txt');
const MATRIX_PATH = path.join(REPO_ROOT, '.opencode/skills/system-deep-loop/deep-alignment/assets/command-benchmark/command-benchmark-matrix.json');
const SCHEDULER_PATH = path.join(REPO_ROOT, '.opencode/skills/system-deep-loop/deep-alignment/scripts/command-benchmark/run-command-behavior-matrix.cjs');
const PILOT_IDS = ['DAB-012', 'DAB-013', 'DAB-014', 'DAB-015'];
const SCOPING_PATH = path.join(REPO_ROOT, '.opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs');
const LANE_CONFIG_PATH = path.join(REPO_ROOT, '.opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/lane-config.json');
const BROKEN_LANE_CONFIG_PATH = path.join(REPO_ROOT, '.opencode/skills/system-deep-loop/deep-alignment/assets/conformance-benchmark/command-surface/__missing-lane-config__.json');

function parseArgs(argv) {
  const values = {};
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag !== '--spec-folder' && flag !== '--run-id') {
      throw new Error(`Unknown argument: ${flag}`);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${flag}`);
    values[flag === '--spec-folder' ? 'specFolder' : 'runId'] = value;
    index += 1;
  }
  values.specFolder ||= process.env.COMMAND_BENCH_SMOKE_SPEC_FOLDER;
  values.runId ||= process.env.COMMAND_BENCH_SMOKE_RUN_ID;
  if (!values.specFolder || !values.runId) {
    throw new Error('Usage: smoke-command-benchmark.cjs --spec-folder <folder> --run-id <id>');
  }
  if (!/^(?:\.opencode\/)?specs\//.test(values.specFolder)) {
    throw new Error('--spec-folder must be inside specs/ or .opencode/specs/');
  }
  if (/[\\/]/.test(values.runId) || values.runId.trim() !== values.runId) {
    throw new Error('--run-id must be one path-safe segment');
  }
  return values;
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readScenarioContract(filePath) {
  const fenced = read(filePath).match(/```json\s*([\s\S]*?)```/);
  assert.ok(fenced, `scenario contract missing: ${filePath}`);
  return JSON.parse(fenced[1]);
}

function assertRouterWiring() {
  const command = read(COMMAND_PATH);
  const auto = read(AUTO_PATH);
  const confirm = read(CONFIRM_PATH);
  const presentation = read(PRESENTATION_PATH);
  const headings = [...command.matchAll(/^## (\d+)\. ([A-Z -]+)$/gm)]
    .map((match) => `${match[1]}. ${match[2]}`);
  assert.deepEqual(headings, [
    '1. ROUTER CONTRACT',
    '2. OWNED ASSETS',
    '3. MODE ROUTING',
    '4. EXECUTION TARGETS',
    '5. PRESENTATION BOUNDARY',
    '6. WORKFLOW SUMMARY',
  ]);
  assert.match(command, /MANDATORY INPUT GATE/);
  assert.match(command, /<spec-folder>/);
  assert.match(command, /--axis=conformance\|behavior\|all/);
  for (const workflow of [auto, confirm]) {
    assert.match(workflow, /deep-alignment-(?:auto|confirm)\.yaml/);
    assert.match(workflow, /command-surface\/lane-config\.json/);
    assert.match(workflow, /run-command-behavior-matrix\.cjs/);
    assert.match(workflow, /command-benchmark-matrix\.json/);
    assert.doesNotMatch(workflow, /(?:opencode\s+run[^\n]*deep\/alignment|\/deep:alignment)/);
  }
  assert.match(presentation, /STATUS=<OK\|FAIL> INSTRUMENT=<VALID\|INVALID> CONFORMANCE=/);
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function buildPilotManifest(tempRoot) {
  const source = JSON.parse(read(MATRIX_PATH));
  const requiredCells = [];
  const fixtures = {};
  const topologies = new Set();

  for (const scenarioId of PILOT_IDS) {
    const cell = source.requiredCells.find((candidate) => (
      candidate.scenarioId === scenarioId
      && candidate.legName === 'claude-cli'
      && candidate.skip
    ));
    assert.ok(cell, `predeclared-skip pilot cell missing: ${scenarioId}`);
    const scenarioPath = path.join(REPO_ROOT, cell.scenarioPath);
    const contract = readScenarioContract(scenarioPath);
    topologies.add(contract.command_topology);
    requiredCells.push(cell);
    fixtures[cell.fixtureRef] = source.fixtures[cell.fixtureRef];
  }

  assert.deepEqual([...topologies].sort(), [
    'direct-tool/plugin router',
    'monolithic',
    'subaction router',
    'workflow router',
  ]);
  assert.ok(source.requiredCells.every((cell) => !cell.scenarioPath.includes('command-benchmark')),
    'launcher must stay outside the behavioral scenario matrix');

  const manifestPath = path.join(tempRoot, 'pilot-matrix.json');
  writeJson(manifestPath, {
    schemaVersion: 1,
    matrixId: 'command-benchmark-hermetic-smoke',
    runnerPath: source.runnerPath,
    fixtures,
    requiredCells,
  });
  return { manifestPath, topologies: [...topologies].sort() };
}

function runBehaviorPilot(tempRoot, runRoot) {
  const { manifestPath, topologies } = buildPilotManifest(tempRoot);
  const behavioralDir = path.join(runRoot, 'behavioral');
  const harmlessSpawn = [process.execPath, '-e', 'process.stdout.write("hermetic-spawn\\n")'];
  const child = spawnSync(process.execPath, [
    SCHEDULER_PATH,
    '--matrix', manifestPath,
    '--out-dir', behavioralDir,
  ], {
    cwd: REPO_ROOT,
    env: { ...process.env, BEHAVIOR_BENCH_SPAWN_JSON: JSON.stringify(harmlessSpawn) },
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
  });
  assert.equal(child.status, 0, child.stderr || child.stdout);
  const reconciliationPath = path.join(
    behavioralDir,
    'command-behavior-matrix.reconciliation.json',
  );
  const reconciliation = JSON.parse(read(reconciliationPath));
  assert.equal(reconciliation.status, 'reconciled');
  assert.equal(reconciliation.requiredCellCount, 4);
  assert.equal(reconciliation.skipCount, 4);
  assert.equal(reconciliation.resultCount, 0);
  assert.equal(reconciliation.failureCount, 0);
  fs.mkdirSync(path.join(behavioralDir, 'cells'), { recursive: true });
  fs.copyFileSync(reconciliationPath, path.join(behavioralDir, 'matrix-results.json'));
  return { result: 'SKIPPED', topologies, reconciliation };
}

// Instrument validity is resolved for real by the same lane-config parser the
// production resolve-lanes step runs, so a broken instrument is detected
// deterministically and hermetically (no live alignment run). The subject verdict
// itself (PASS/FAIL) still owes a live alignment capture and is stood in for by the
// injected-defect switch; only the instrument's validity is executed here.
function resolveConformanceInstrument(laneConfigPath) {
  const child = spawnSync(process.execPath, [
    SCOPING_PATH, '--lane-config', laneConfigPath, '--json',
  ], { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  return {
    instrument: child.status === 0 ? 'VALID' : 'INVALID',
    exitCode: child.status,
    diagnostic: (child.stderr || '').trim(),
  };
}

function runConformance(specRoot, runRoot, { defect, laneConfigPath }) {
  const alignmentDir = path.join(specRoot, 'alignment');
  const deterministicDir = path.join(runRoot, 'deterministic');
  const probe = resolveConformanceInstrument(laneConfigPath);
  if (probe.instrument === 'INVALID') {
    // A failed instrument is published as INVALID with its diagnostic pointer and
    // never translated into a subject verdict.
    writeJson(path.join(deterministicDir, 'alignment-evidence.json'), {
      instrument: 'INVALID',
      result: 'NOT_EVALUATED',
      exitCode: probe.exitCode,
      diagnostic: probe.diagnostic,
    });
    return { instrument: 'INVALID', result: 'NOT_EVALUATED' };
  }
  const verdict = defect ? 'FAIL' : 'PASS';
  const registryPath = path.join(alignmentDir, 'deep-alignment-findings-registry.json');
  const reportPath = path.join(alignmentDir, 'alignment-report.md');
  writeJson(registryPath, {
    schemaVersion: 1,
    instrument: 'VALID',
    overallVerdict: verdict,
    lanes: [{ laneId: 'sk-doc::docs::commands', verdict }],
  });
  fs.writeFileSync(reportPath, `# Hermetic Alignment Result\n\nVerdict: ${verdict}\n`);
  writeJson(path.join(deterministicDir, 'alignment-evidence.json'), {
    instrument: 'VALID',
    verdict,
    registryPath,
    reportPath,
    subjectMocked: true,
  });
  return { instrument: 'VALID', result: verdict };
}

function terminalLine(envelope) {
  return `STATUS=${envelope.status} INSTRUMENT=${envelope.instrument} `
    + `CONFORMANCE=${envelope.conformance} BEHAVIOR=${envelope.behavior}`;
}

function runAxis({ tempRoot, logicalSpecFolder, runId, axis, defect = false, laneConfigPath = LANE_CONFIG_PATH }) {
  const badInstrument = laneConfigPath !== LANE_CONFIG_PATH;
  const caseName = `${axis}${defect ? '-defect' : ''}${badInstrument ? '-badinstrument' : ''}`;
  const specRoot = path.join(tempRoot, 'cases', caseName, 'spec-folder');
  const runRoot = path.join(specRoot, 'evidence', 'command-benchmark', runId);
  fs.mkdirSync(path.join(runRoot, 'scorecard'), { recursive: true });
  let conformance = 'NOT_RUN';
  let behavior = 'NOT_RUN';
  let behaviorEvidence = null;
  let instrument = 'VALID';

  if (axis === 'conformance' || axis === 'all') {
    const conformanceRun = runConformance(specRoot, runRoot, { defect, laneConfigPath });
    conformance = conformanceRun.result;
    if (conformanceRun.instrument === 'INVALID') instrument = 'INVALID';
  }
  if (axis === 'behavior' || axis === 'all') {
    behaviorEvidence = runBehaviorPilot(tempRoot, runRoot);
    behavior = behaviorEvidence.result;
  }

  const envelope = {
    status: instrument === 'INVALID' ? 'FAIL' : 'OK',
    instrument,
    conformance,
    behavior,
  };
  writeJson(path.join(runRoot, 'run-manifest.json'), {
    runId,
    specFolder: logicalSpecFolder,
    axis,
    hermetic: true,
    liveModelSpawned: false,
    instrument: envelope.instrument,
    pointers: {
      deterministic: 'deterministic/alignment-evidence.json',
      behavioral: 'behavioral/matrix-results.json',
      scorecard: 'scorecard/command-benchmark-scorecard.json',
    },
  });
  writeJson(path.join(runRoot, 'scorecard', 'command-benchmark-scorecard.json'), envelope);
  fs.writeFileSync(
    path.join(runRoot, 'scorecard', 'command-benchmark-scorecard.md'),
    `${terminalLine(envelope)}\n`,
  );
  return { envelope, behaviorEvidence };
}

function main() {
  const { specFolder, runId } = parseArgs(process.argv.slice(2));
  assertRouterWiring();
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'command-benchmark-smoke-'));
  try {
    const conformance = runAxis({ tempRoot, logicalSpecFolder: specFolder, runId, axis: 'conformance' });
    const behavior = runAxis({ tempRoot, logicalSpecFolder: specFolder, runId, axis: 'behavior' });
    const all = runAxis({ tempRoot, logicalSpecFolder: specFolder, runId, axis: 'all' });
    const defect = runAxis({ tempRoot, logicalSpecFolder: specFolder, runId, axis: 'conformance', defect: true });
    const badInstrument = runAxis({
      tempRoot, logicalSpecFolder: specFolder, runId, axis: 'conformance',
      laneConfigPath: BROKEN_LANE_CONFIG_PATH,
    });

    assert.equal(conformance.envelope.instrument, 'VALID');
    assert.equal(conformance.envelope.conformance, 'PASS');
    assert.equal(behavior.behaviorEvidence.topologies.length, 4);
    assert.equal(all.envelope.conformance, 'PASS');
    assert.equal(all.envelope.behavior, 'SKIPPED');
    // A subject failure keeps the instrument valid.
    assert.equal(defect.envelope.status, 'OK');
    assert.equal(defect.envelope.instrument, 'VALID');
    assert.equal(defect.envelope.conformance, 'FAIL');
    // A failed instrument is reported invalid without inventing a subject verdict.
    assert.equal(badInstrument.envelope.instrument, 'INVALID');
    assert.equal(badInstrument.envelope.status, 'FAIL');
    assert.equal(badInstrument.envelope.conformance, 'NOT_EVALUATED');

    console.log(`[smoke] conformance ${terminalLine(conformance.envelope)}`);
    console.log(`[smoke] behavior ${terminalLine(behavior.envelope)} topologies=${behavior.behaviorEvidence.topologies.join(',')}`);
    console.log(`[smoke] all ${terminalLine(all.envelope)}`);
    console.log(`[smoke] injected-defect ${terminalLine(defect.envelope)}`);
    console.log(`[smoke] instrument-failure ${terminalLine(badInstrument.envelope)}`);
    console.log('[smoke] PASS hermetic=true live-model-spawns=0 matrix-cells=4');
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  console.error(`[smoke] FAIL ${error.message}`);
  process.exitCode = 1;
}
