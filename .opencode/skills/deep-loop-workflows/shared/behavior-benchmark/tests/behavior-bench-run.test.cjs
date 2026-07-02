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

  // ── D-010 delegation evidence kinds ──────────────────────────────────────
  // Seats are distinct canonical ids in the council's artifact CONTENT, not
  // separate files (the real council writes one deliberation.md per round with
  // per-seat sections plus a state JSONL naming each seat by canonical id).
  const seatSet = bench.countSeatIdsInText(
    'Round 1 deliberation. seat-001 favors token bucket. seat-002 favors sliding window. ' +
    'seat-003 favors concurrency cap. Composition: seat-001, seat-002, seat-003.'
  );
  assert.equal(seatSet.size, 3, 'three distinct council seats counted from content');
  // Candidate evidence needs BOTH a candidate and a score (real improvement layout:
  // improvement/candidates/*.md + baseline-score.json / .score-cache/*.json).
  const bothCounts = bench.countModeArtifacts(null, [
    'improvement/candidates/cand-iter1.md',
    'improvement/baseline-score.json',
    'src/untouched.js',
  ]);
  assert.equal(bothCounts.candidateArtifacts, 2, 'candidate + score -> 2');
  const candOnly = bench.countModeArtifacts(null, ['improvement/candidates/cand-iter1.md']);
  assert.equal(candOnly.candidateArtifacts, 1, 'candidate without score -> 1');
  const scoreCache = bench.countModeArtifacts(null, ['improvement/.score-cache/abc.json', 'improvement/candidates/x.md']);
  assert.equal(scoreCache.candidateArtifacts, 2, 'score-cache counts as score');
  const neither = bench.countModeArtifacts(null, ['improvement/dynamic-profile.json']);
  assert.equal(neither.candidateArtifacts, 0, 'profile alone is not candidate evidence');

  // seat_artifacts: council with enough persisted seats scores D3=2, is NOT absorption.
  const councilContract = {
    expected_interaction: 'autonomous',
    expected_delegation: { evidence_kind: 'seat_artifacts', min_seats: 2, role_absorption_forbidden: true },
  };
  const councilOk = {
    spawnError: null, exitCode: 0, killedBy: 'none', stdoutNonEmptyLines: 5, stdoutText: 'council',
    taskEvents: [], routeProofRecords: [], seatArtifacts: 3, candidateArtifacts: 0,
    fixtureGained: true, checkpoints: { tTerminalMs: 500000 },
  };
  assert.equal(bench.scoreD3(councilContract, councilOk), 2, 'in-CLI council with seats -> D3 2');
  assert.notEqual(bench.classify(councilContract, councilOk), 'role_absorption', 'in-CLI council NOT absorption');
  // A council that produced a plan (fixtureGained) with zero seats IS absorption.
  const councilAbsorbed = { ...councilOk, seatArtifacts: 0 };
  assert.equal(bench.classify(councilContract, councilAbsorbed), 'role_absorption', 'council, no seats -> absorption');
  assert.equal(bench.scoreD3(councilContract, councilAbsorbed), 0, 'no seats -> D3 0');
  // A council HALT cell (correct to convene no seats) scores D3 null, not 0.
  const councilHalt = { expected_interaction: 'question_halt', expected_delegation: { evidence_kind: 'seat_artifacts', min_seats: 2, role_absorption_forbidden: false } };
  assert.equal(bench.scoreD3(councilHalt, { seatArtifacts: 0 }), null, 'council halt -> D3 null');
  const impHalt = { expected_interaction: 'question_halt', expected_delegation: { evidence_kind: 'candidate_evidence', role_absorption_forbidden: false } };
  assert.equal(bench.scoreD3(impHalt, { candidateArtifacts: 0 }), null, 'improvement halt -> D3 null');

  // candidate_evidence: improvement with candidate + score scores D3=2, not absorption.
  const impContract = {
    expected_interaction: 'autonomous',
    expected_delegation: { evidence_kind: 'candidate_evidence', role_absorption_forbidden: true },
  };
  const impOk = { ...councilOk, seatArtifacts: 0, candidateArtifacts: 2 };
  assert.equal(bench.scoreD3(impContract, impOk), 2, 'improvement candidate+score -> D3 2');
  assert.notEqual(bench.classify(impContract, impOk), 'role_absorption', 'improvement with evidence NOT absorption');

  // task_dispatch stays byte-identical: same absorption gate as before D-010.
  const tdContract = {
    expected_interaction: 'autonomous',
    expected_delegation: { min_task_events: 1, role_absorption_forbidden: true },
  };
  const tdAbsorbed = {
    spawnError: null, exitCode: 0, killedBy: 'none', stdoutNonEmptyLines: 3, stdoutText: 'x',
    taskEvents: [], routeProofRecords: [], fixtureGained: true, checkpoints: { tTerminalMs: 60000 },
  };
  assert.equal(bench.classify(tdContract, tdAbsorbed), 'role_absorption', 'task_dispatch absorption unchanged');
  const tdOk = { ...tdAbsorbed, taskEvents: [{ t: 1, line: 'x' }] };
  assert.notEqual(bench.classify(tdContract, tdOk), 'role_absorption', 'task_dispatch with dispatch not absorption');

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
