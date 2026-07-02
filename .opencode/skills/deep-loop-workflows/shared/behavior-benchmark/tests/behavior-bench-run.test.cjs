// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: behavior-bench-run Hermetic Tests                              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the pure scoring/classification functions against synthetic ║
// ║          inputs, and pin the live runner against a fake executor leg      ║
// ║          injected via BEHAVIOR_BENCH_SPAWN_JSON -- no live session        ║
// ║          required.                                                        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const RUNNER = path.join(__dirname, '..', 'behavior-bench-run.cjs');
const FAKE_LEG = path.join(__dirname, 'fixtures', 'fake-leg.js');
const SMOKE_SCENARIO = path.join(__dirname, 'fixtures', 'SMOKE-000-fake.md');

function loadSmokeContract() {
  const md = fs.readFileSync(SMOKE_SCENARIO, 'utf8');
  const fence = md.match(/```json\s*([\s\S]*?)```/);
  return JSON.parse(fence[1]);
}

function writeScenario(dir, contract) {
  const p = path.join(dir, 'scenario.md');
  fs.writeFileSync(p, '# ' + contract.id + '\n\n```json\n' + JSON.stringify(contract, null, 2) + '\n```\n');
  return p;
}

function runBench(args, env) {
  return spawnSync(process.execPath, [RUNNER, ...args], {
    env: { ...process.env, ...env },
    encoding: 'utf8',
    timeout: 30000,
  });
}

async function main() {
  const bench = require(RUNNER);
  assert.equal(typeof bench.classify, 'function');
  assert.equal(typeof bench.score, 'function');
  assert.deepEqual(Object.keys(bench.LEG_TABLE).sort(), ['claude-cli', 'glm-max', 'gpt-fast-high', 'gpt-fast-med']);

  // ── classify unit cases ──────────────────────────────────────────────────

  // route_mismatch: route proof required, proofs exist, none match the leaf agent.
  const rmContract = {
    expected_interaction: 'autonomous',
    expected_delegation: { route_proof_required: true, leaf_agent: 'deep-research', min_task_events: 0 },
  };
  const rmObs = {
    spawnError: null, exitCode: 0, killedBy: 'none', stdoutNonEmptyLines: 1, stdoutText: 'ok',
    taskEvents: [], routeProofRecords: [{ target_agent: 'some-other-agent' }], fixtureGained: false,
  };
  assert.equal(bench.classify(rmContract, rmObs), 'route_mismatch');

  // setup_misbind: a halt was expected but the leg dispatched anyway.
  const smContract = { expected_interaction: 'question_halt', expected_delegation: { min_task_events: 0 } };
  const smObs = {
    spawnError: null, exitCode: 0, killedBy: 'none', stdoutNonEmptyLines: 1, stdoutText: 'q',
    taskEvents: [{ t: 1, line: 'subagent_type' }], routeProofRecords: [], fixtureGained: false,
  };
  assert.equal(bench.classify(smContract, smObs), 'setup_misbind');

  // crash: nonzero exit with zero stdout lines.
  const crashContract = { expected_interaction: 'autonomous', expected_delegation: {} };
  const crashObs = {
    spawnError: null, exitCode: 2, killedBy: 'none', stdoutNonEmptyLines: 0, stdoutText: '',
    taskEvents: [], routeProofRecords: [], fixtureGained: false,
  };
  assert.equal(bench.classify(crashContract, crashObs), 'crash');

  // stuck_no_progress: watchdog kill wins over everything but crash.
  const stuckObs = { spawnError: null, exitCode: null, killedBy: 'watchdog', stdoutNonEmptyLines: 1, stdoutText: '', taskEvents: [], routeProofRecords: [], fixtureGained: false };
  assert.equal(bench.classify({ expected_interaction: 'autonomous', expected_delegation: {} }, stuckObs), 'stuck_no_progress');

  // env_error: a genuine provider quota rejection is never scored as behavior.
  // The rejection is unescaped top-level stream text and the run dies fast having
  // done nothing.
  const envAuto = { expected_interaction: 'autonomous', expected_delegation: {} };
  const envObs = {
    spawnError: null, exitCode: 0, killedBy: 'none', stdoutNonEmptyLines: 2,
    stdoutText: '{"type":"result","result":"You\'ve hit your session limit · resets 3pm"}',
    taskEvents: [], routeProofRecords: [], fixtureGained: false,
    checkpoints: { tTerminalMs: 3200 },
  };
  assert.equal(bench.classify(envAuto, envObs), 'env_error');
  // A real run that merely mentions rate limits in its report keeps its bucket:
  // fixture writes prove the model actually ran.
  const envMentionObs = { ...envObs, fixtureGained: true, taskEvents: [{ t: 1, line: 'x' }] };
  assert.notEqual(bench.classify(envAuto, envMentionObs), 'env_error');
  // A long run that READ a file quoting the rejection is NOT env_error: the phrase
  // is backslash-escaped inside the tool result, and the run did real work.
  const envReadFileObs = {
    ...envObs,
    stdoutText: 'tool output: \\"You\'ve hit your session limit\\" (quoted from a prior transcript)',
    checkpoints: { tTerminalMs: 149000 },
  };
  assert.notEqual(bench.classify(envAuto, envReadFileObs), 'env_error');
  // Even with the unescaped phrase, a slow terminal blocks env_error — a genuine
  // rejection never runs for minutes.
  const envSlowObs = { ...envObs, checkpoints: { tTerminalMs: 149000 } };
  assert.notEqual(bench.classify(envAuto, envSlowObs), 'env_error');

  // ── score d5 baseline ratio cutoffs ──────────────────────────────────────
  const baseContract = { expected_interaction: 'autonomous', expected_delegation: { min_task_events: 1 }, expected_presentation_markers: [] };
  const makeObs = (terminalMs) => ({
    spawnError: null, exitCode: 0, killedBy: 'none', stdoutNonEmptyLines: 1, stdoutText: 'x',
    taskEvents: [{ t: 1, line: 'subagent_type' }], routeProofRecords: [], fixtureGained: true,
    markerHits: [], checkpoints: { tFirstOutputMs: 1, tSetupMs: null, tFirstDispatchMs: 2, tTerminalMs: terminalMs },
  });
  const baseline = { checkpoints: { tTerminalMs: 1000 } };
  assert.equal(bench.score(baseContract, makeObs(1400), baseline).d5, 2, 'ratio 1.4 -> 2');
  assert.equal(bench.score(baseContract, makeObs(2000), baseline).d5, 1, 'ratio 2.0 -> 1');
  assert.equal(bench.score(baseContract, makeObs(4000), baseline).d5, 0, 'ratio 4.0 -> 0');
  assert.equal(bench.score(baseContract, makeObs(1400), null).d5, null, 'no baseline -> null');

  // ── integration: normal mode -> pass ─────────────────────────────────────
  const rootTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bench-root-'));
  const fixtureDir = path.join(rootTmp, 'fixture');
  fs.mkdirSync(fixtureDir, { recursive: true });
  const outDir = path.join(rootTmp, 'out');

  const contract = loadSmokeContract();
  contract.fixture = fixtureDir;
  const scenarioPath = writeScenario(rootTmp, contract);
  const spawnJson = JSON.stringify([process.execPath, FAKE_LEG]);

  const normal = runBench(
    ['--scenario', scenarioPath, '--leg', 'smoke', '--out-dir', outDir, '--repo-root', rootTmp, '--watchdog-ms', '60000'],
    { BEHAVIOR_BENCH_SPAWN_JSON: spawnJson, FAKE_LEG_FIXTURE: fixtureDir },
  );
  assert.equal(normal.status, 0, 'runner must exit 0 for a scored run; stderr: ' + normal.stderr);

  const normalResult = JSON.parse(fs.readFileSync(path.join(outDir, contract.id + '-smoke.result.json'), 'utf8'));
  assert.equal(normalResult.schemaVersion, 1);
  assert.equal(normalResult.scenarioId, 'SMOKE-000');
  assert.equal(normalResult.leg, 'smoke');
  assert.equal(typeof normalResult.checkpoints.tFirstOutputMs, 'number');
  assert.equal(typeof normalResult.checkpoints.tFirstDispatchMs, 'number');
  assert.equal(typeof normalResult.checkpoints.tTerminalMs, 'number');
  assert.equal(normalResult.terminal.killedBy, 'none');
  assert.equal(normalResult.delegation.taskEvents.length, 1);
  assert.equal(normalResult.classification, 'pass');

  // ── integration: hang mode -> watchdog -> stuck_no_progress ──────────────
  const hangOut = path.join(rootTmp, 'out-hang');
  const hang = runBench(
    ['--scenario', scenarioPath, '--leg', 'smoke', '--out-dir', hangOut, '--repo-root', rootTmp, '--watchdog-ms', '1500'],
    { BEHAVIOR_BENCH_SPAWN_JSON: spawnJson, FAKE_LEG_FIXTURE: fixtureDir, FAKE_LEG_HANG: '1' },
  );
  assert.equal(hang.status, 0, 'runner must exit 0 even when it kills the leg; stderr: ' + hang.stderr);

  const hangResult = JSON.parse(fs.readFileSync(path.join(hangOut, contract.id + '-smoke.result.json'), 'utf8'));
  assert.equal(hangResult.terminal.killedBy, 'watchdog');
  assert.equal(hangResult.classification, 'stuck_no_progress');

  fs.rmSync(rootTmp, { recursive: true, force: true });
  console.log('behavior-bench-run.test.cjs: all assertions passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
