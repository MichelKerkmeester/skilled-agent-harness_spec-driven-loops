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
const DAB_GOLDEN = path.join(__dirname, 'fixtures', 'dab-v1-golden.json');
const DAB_SCENARIOS = path.join(__dirname, '..', '..', '..', 'deep-alignment', 'behavior_benchmark', 'scenarios');

function loadSmokeContract() {
  const md = fs.readFileSync(SMOKE_SCENARIO, 'utf8');
  const fence = md.match(/```json\s*([\s\S]*?)```/);
  return JSON.parse(fence[1]);
}

function writeScenario(dir, contract) {
  const p = path.join(dir, contract.id + '.md');
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

function fixedDabObservation() {
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
    checkpoints: { tFirstOutputMs: 10, tSetupMs: null, tFirstDispatchMs: 100, tTerminalMs: 1000 },
  };
}

async function main() {
  const bench = require(RUNNER);
  assert.equal(typeof bench.classify, 'function');
  assert.equal(typeof bench.score, 'function');
  assert.equal(typeof bench.extractRenderedBlock, 'function');
  assert.equal(typeof bench.buildBudgetEdgeSignals, 'function');
  assert.equal(typeof bench.classifyVagueAsk, 'function');
  assert.equal(typeof bench.countTargetHits, 'function');
  assert.equal(typeof bench.evaluatePostconditions, 'function');
  assert.equal(typeof bench.scoreDirectDispatch, 'function');
  assert.equal(typeof bench.directDispatchEvidence, 'function');
  assert.equal(typeof bench.evaluateBoundary, 'function');
  assert.deepEqual(Object.keys(bench.LEG_TABLE).sort(), ['claude-cli', 'deepseek', 'glm-max', 'gpt-fast-high', 'gpt-fast-med']);
  assert.deepEqual(bench.LOCKED_MULTI_CAUSE_CELL_IDS, ['ACB-004', 'ACB-005', 'CXB-004']);
  const deepseekArgs = bench.buildSpawnArgs('deepseek', loadSmokeContract());
  assert.deepEqual(deepseekArgs.slice(0, 4), ['opencode', 'run', '--model', 'deepseek/deepseek-v4-pro']);
  assert.ok(deepseekArgs.includes('--format'), 'deepseek leg uses opencode JSON format');

  // ── frozen v1 regression map ────────────────────────────────────────────
  // The golden pins the original DAB-001..011 v1 scenarios. Higher-numbered DAB
  // scenarios are the schema-v2 command suite and are covered by their own
  // phase tests, so the v1 regression deliberately scopes to 001..011 only.
  const dabGolden = JSON.parse(fs.readFileSync(DAB_GOLDEN, 'utf8'));
  const dabFiles = fs.readdirSync(DAB_SCENARIOS)
    .filter((name) => /^DAB-0(0[1-9]|1[01])-.*\.md$/.test(name))
    .sort();
  assert.equal(dabFiles.length, 11, 'all eleven frozen v1 DAB scenarios are present');
  assert.equal(Object.keys(dabGolden).length, 11, 'golden contains all eleven DAB entries');
  for (const file of dabFiles) {
    const contract = bench.parseScenario(path.join(DAB_SCENARIOS, file));
    assert.ok(contract, file + ' parses');
    assert.ok(
      contract.schema_version === undefined || contract.schema_version === 1,
      contract.id + ' remains a v1 contract',
    );
    const obs = fixedDabObservation();
    const causes = bench.classificationCauses(contract, obs);
    const selected = bench.selectResultCauses(contract, causes);
    const fingerprint = {
      schemaVersion: contract.schema_version === 2 ? 2 : 1,
      dimensions: bench.score(contract, obs, null),
      classification: causes[0],
      primaryCause: selected.primaryCause,
      secondaryCause: selected.secondaryCause,
    };
    assert.deepEqual(fingerprint, dabGolden[contract.id], contract.id + ' matches the pre-edit golden');
  }

  // ── measurement helpers ─────────────────────────────────────────────────
  assert.equal(
    bench.extractRenderedBlock(['MARKER-B'], ['noise before', 'Setup Phase: choose scope', 'detail line', 'MARKER-B', '{"tool":"task"}']),
    'Setup Phase: choose scope\ndetail line\nMARKER-B\n',
    'rendered block spans the setup/marker lines verbatim',
  );
  const budgetSignals = bench.buildBudgetEdgeSignals({
    budgetMs: 1000,
    watchdogMs: 400,
    checkpoints: { tTerminalMs: 900 },
    fixtureMutationTimesMs: [250],
    progressTimestampsMs: [100, 250, 700],
  });
  assert.equal(budgetSignals.tFirstArtifactMs, 250);
  assert.equal(budgetSignals.firstArtifactDeadlineRemainingMs, 750);
  assert.equal(budgetSignals.progressCadence.maxGapMs, 450);
  assert.equal(budgetSignals.preCapFinalizerRemainingMs, 100);
  const vagueOfferContract = { title: 'Vague natural ask', clarity: 'C1', expected_interaction: 'question_halt', expected_delegation: {} };
  const vagueOfferObs = { killedBy: 'none', spawnError: null, taskEvents: [], routeProofRecords: [], markerHits: ['clarify'] };
  assert.equal(bench.classifyVagueAsk(vagueOfferContract, vagueOfferObs, 'pass'), 'offered');
  const vagueMisrouteObs = { ...vagueOfferObs, taskEvents: [{ t: 1, line: '{"tool":"task"}' }] };
  assert.equal(bench.classifyVagueAsk(vagueOfferContract, vagueMisrouteObs, 'setup_misbind'), 'misroute');
  const vagueRoutedContract = { clarity: 'C1', expected_interaction: 'autonomous', expected_delegation: { evidence_kind: 'candidate_evidence' } };
  assert.equal(bench.classifyVagueAsk(vagueRoutedContract, { ...vagueOfferObs, candidateArtifacts: 1 }, 'partial'), 'routed');
  assert.equal(bench.classifyVagueAsk(vagueRoutedContract, { ...vagueOfferObs, candidateArtifacts: 0 }, 'partial'), 'inline');

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
  const multiCauseContract = { id: 'CXB-004', expected_interaction: 'question_halt', expected_delegation: {} };
  const multiCauseObs = { ...stuckObs, taskEvents: [{ t: 1, line: '{"tool":"task"}' }] };
  const multiCauses = bench.classificationCauses(multiCauseContract, multiCauseObs);
  assert.deepEqual(multiCauses.slice(0, 2), ['stuck_no_progress', 'setup_misbind']);
  assert.deepEqual(bench.selectResultCauses(multiCauseContract, multiCauses), {
    primaryCause: 'stuck_no_progress',
    secondaryCause: 'setup_misbind',
    multiCauseLocked: true,
  });

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

  // ── delegation evidence kinds ────────────────────────────────────────────
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

  // task_dispatch keeps the established absorption gate.
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

  // direct_dispatch counts expected and forbidden stdout target events.
  const directContract = {
    schema_version: 2,
    expected_interaction: 'autonomous',
    artifacts_required: false,
    expected_delegation: {
      evidence_kind: 'direct_dispatch',
      expected_targets: ['deep-research'],
      forbidden_targets: ['/deep-review/i'],
      min_task_events: 1,
      role_absorption_forbidden: true,
    },
  };
  const directOk = {
    spawnError: null, exitCode: 0, killedBy: 'none', stdoutNonEmptyLines: 1,
    stdoutText: 'Dispatch target: DEEP-RESEARCH', taskEvents: [], routeProofRecords: [],
    fixtureGained: false, markerHits: [], postconditions: [], boundary: { clean: true, escapes: [] },
  };
  assert.equal(bench.countTargetHits(['deep-research'], directOk.stdoutText), 1, 'literal target matching is case-insensitive');
  assert.equal(bench.scoreD3(directContract, directOk), 2, 'expected target without forbidden target -> D3 2');
  const directForbidden = { ...directOk, stdoutText: directOk.stdoutText + '\nDispatch target: deep-review' };
  assert.equal(bench.scoreD3(directContract, directForbidden), 1, 'forbidden target caps D3 at 1');
  const directMissing = { ...directOk, stdoutText: 'no matching target' };
  assert.equal(bench.scoreD3(directContract, directMissing), 0, 'zero expected targets -> D3 0');
  const directAbsorbed = { ...directMissing, fixtureGained: true };
  assert.equal(bench.classify(directContract, directAbsorbed), 'role_absorption');
  const directHalt = { ...directContract, expected_interaction: 'question_halt' };
  assert.equal(bench.scoreD3(directHalt, directMissing), null, 'direct-dispatch halt -> D3 null');

  // Postcondition probes are allowlisted and fail closed.
  const probeTmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bench-probes-'));
  fs.mkdirSync(path.join(probeTmp, 'allowed'), { recursive: true });
  fs.writeFileSync(path.join(probeTmp, 'allowed', 'data.json'), JSON.stringify({ nested: { value: 7 } }));
  fs.writeFileSync(path.join(probeTmp, 'allowed', 'report.txt'), 'command completed successfully\n');
  const probeContract = {
    schema_version: 2,
    postconditions: [
      { kind: 'file_exists', path: 'allowed/report.txt' },
      { kind: 'file_exists', path: 'missing.txt' },
      { kind: 'json_field_equals', path: 'allowed/data.json', field: 'nested.value', value: 7 },
      { kind: 'json_field_equals', path: 'allowed/data.json', field: 'nested.value', value: 8 },
      { kind: 'text_contains', path: 'allowed/report.txt', substring: 'completed successfully' },
      { kind: 'text_contains', path: 'allowed/report.txt', substring: 'not present' },
      { kind: 'changed_paths_within', prefix: 'allowed' },
      { kind: 'changed_paths_within', prefix: 'restricted' },
      { kind: 'not_allowlisted' },
    ],
  };
  const probeResults = bench.evaluatePostconditions(probeContract, probeTmp, {
    changedFixturePaths: ['allowed/report.txt'],
  });
  assert.equal(probeResults[0].ok, true, 'file_exists passes for an existing path');
  assert.equal(probeResults[1].ok, false, 'file_exists fails for a missing path');
  assert.equal(probeResults[2].ok, true, 'json_field_equals passes for equal nested value');
  assert.equal(probeResults[3].ok, false, 'json_field_equals fails for a different value');
  assert.equal(probeResults[4].ok, true, 'text_contains passes for a present substring');
  assert.equal(probeResults[5].ok, false, 'text_contains fails for a missing substring');
  assert.equal(probeResults[6].ok, true, 'changed_paths_within passes inside its prefix');
  assert.equal(probeResults[7].ok, false, 'changed_paths_within fails outside its prefix');
  assert.deepEqual(probeResults[8], { kind: 'not_allowlisted', ok: false, reason: 'unknown probe kind' });

  const postconditionObs = {
    spawnError: null, exitCode: 0, killedBy: 'none', stdoutNonEmptyLines: 1, stdoutText: 'done',
    taskEvents: [], routeProofRecords: [], fixtureGained: false, markerHits: [],
    changedFixturePaths: [], boundary: { clean: true, escapes: [] },
  };
  const partialPostconditionContract = {
    schema_version: 2,
    expected_interaction: 'autonomous',
    artifacts_required: false,
    expected_delegation: {},
    postconditions: [{ kind: 'file_exists', path: 'missing.txt' }],
  };
  assert.equal(
    bench.classify(partialPostconditionContract, {
      ...postconditionObs,
      postconditions: [{ kind: 'file_exists', ok: false, reason: 'path does not exist' }],
    }),
    'partial',
    'a failing non-setup postcondition blocks pass',
  );
  const setupProbeContract = {
    ...partialPostconditionContract,
    postconditions: [{ kind: 'file_exists', path: 'missing.txt', binds_setup: true }],
  };
  assert.equal(
    bench.classify(setupProbeContract, {
      ...postconditionObs,
      postconditions: [{ kind: 'file_exists', ok: false, reason: 'path does not exist' }],
    }),
    'setup_misbind',
    'a failing setup-binding probe on an autonomous run is setup_misbind',
  );

  const boundaryContract = {
    schema_version: 2,
    expected_interaction: 'autonomous',
    artifacts_required: false,
    expected_delegation: {},
    boundary: { allow_prefixes: ['allowed'] },
  };
  const escapedBoundary = bench.evaluateBoundary(boundaryContract, {
    fixtureDir: probeTmp,
    changedFixturePaths: ['outside/leak.txt'],
  });
  assert.equal(
    bench.classify(boundaryContract, {
      ...postconditionObs,
      fixtureGained: true,
      changedFixturePaths: ['outside/leak.txt'],
      postconditions: [],
      boundary: escapedBoundary,
    }),
    'boundary_violation',
  );
  const cleanBoundary = bench.evaluateBoundary(boundaryContract, {
    fixtureDir: probeTmp,
    changedFixturePaths: ['allowed/result.txt'],
  });
  assert.equal(cleanBoundary.clean, true);
  assert.notEqual(
    bench.classify(boundaryContract, {
      ...postconditionObs,
      fixtureGained: true,
      changedFixturePaths: ['allowed/result.txt'],
      postconditions: [],
      boundary: cleanBoundary,
    }),
    'boundary_violation',
  );
  fs.rmSync(probeTmp, { recursive: true, force: true });

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
  assert.equal(normalResult.primaryCause, 'pass');
  assert.equal(normalResult.secondaryCause, null);
  assert.equal(normalResult.stuckNoProgressRate.mode, contract.mode);
  assert.equal(normalResult.stuckNoProgressRate.value, 0);
  assert.equal(normalResult.renderedBlock, 'BENCH-SMOKE-MARKER\n');
  assert.equal(normalResult.vagueAskOutcome, null);
  assert.equal(normalResult.budgetEdge.budgetMs, contract.budget_ms);
  assert.equal(normalResult.budgetEdge.watchdogMs, 60000);
  assert.equal(typeof normalResult.budgetEdge.tFirstArtifactMs, 'number');
  assert.equal(typeof normalResult.budgetEdge.firstArtifactDeadlineRemainingMs, 'number');
  assert.equal(typeof normalResult.budgetEdge.progressCadence.eventCount, 'number');
  assert.ok(normalResult.budgetEdge.progressCadence.gapsMs.length > 0, 'cadence includes observed gaps');
  assert.equal(typeof normalResult.budgetEdge.preCapFinalizerRemainingMs, 'number');
  assert.equal('postconditions' in normalResult, false, 'v1 result omits postconditions');
  assert.equal('directDispatch' in normalResult, false, 'v1 result omits directDispatch');
  assert.equal('boundary' in normalResult, false, 'v1 result omits boundary');

  // ── integration: schema v2 emits probe, dispatch, and boundary evidence ─
  const v2FixtureDir = path.join(rootTmp, 'fixture-v2');
  fs.mkdirSync(v2FixtureDir, { recursive: true });
  const v2Contract = loadSmokeContract();
  v2Contract.id = 'SMOKE-V2';
  v2Contract.schema_version = 2;
  v2Contract.fixture = v2FixtureDir;
  v2Contract.expected_delegation = {
    evidence_kind: 'direct_dispatch',
    expected_targets: ['deep-research'],
    forbidden_targets: ['deep-review'],
    min_task_events: 1,
    role_absorption_forbidden: true,
  };
  v2Contract.postconditions = [
    { kind: 'file_exists', path: 'artifact.txt' },
    { kind: 'text_contains', path: 'artifact.txt', substring: 'smoke' },
    { kind: 'changed_paths_within', prefix: 'artifact.txt' },
  ];
  v2Contract.boundary = { allow_prefixes: ['artifact.txt'] };
  const v2ScenarioPath = writeScenario(rootTmp, v2Contract);
  const v2Out = path.join(rootTmp, 'out-v2');
  const v2Run = runBench(
    ['--scenario', v2ScenarioPath, '--leg', 'smoke', '--out-dir', v2Out, '--repo-root', rootTmp, '--watchdog-ms', '60000'],
    { BEHAVIOR_BENCH_SPAWN_JSON: spawnJson, FAKE_LEG_FIXTURE: v2FixtureDir },
  );
  assert.equal(v2Run.status, 0, 'v2 runner must exit 0; stderr: ' + v2Run.stderr);
  const v2Result = JSON.parse(fs.readFileSync(path.join(v2Out, v2Contract.id + '-smoke.result.json'), 'utf8'));
  assert.equal(v2Result.schemaVersion, 2);
  assert.equal(v2Result.classification, 'pass');
  assert.equal(v2Result.dimensions.d3, 2);
  assert.equal(v2Result.postconditions.length, 3);
  assert.ok(v2Result.postconditions.every((probe) => probe.ok), 'all v2 probes pass');
  assert.deepEqual(v2Result.directDispatch, {
    expectedTargetHits: 1,
    forbiddenTargetHits: 0,
    expectedTargets: ['deep-research'],
    forbiddenTargets: ['deep-review'],
  });
  assert.deepEqual(v2Result.boundary, { clean: true, escapes: [] });

  // ── integration: vague-ask telemetry is written into result JSON ─────────
  const vagueContract = loadSmokeContract();
  vagueContract.id = 'SMOKE-VAGUE';
  vagueContract.title = 'Vague natural ask';
  vagueContract.clarity = 'C1';
  vagueContract.fixture = fixtureDir;
  vagueContract.expected_interaction = 'question_halt';
  vagueContract.expected_delegation = {
    leaf_agent: null,
    min_task_events: 0,
    route_proof_required: false,
    role_absorption_forbidden: false,
  };
  const vagueScenarioPath = writeScenario(rootTmp, vagueContract);
  const vagueOut = path.join(rootTmp, 'out-vague');
  const vague = runBench(
    ['--scenario', vagueScenarioPath, '--leg', 'smoke', '--out-dir', vagueOut, '--repo-root', rootTmp, '--watchdog-ms', '60000'],
    { BEHAVIOR_BENCH_SPAWN_JSON: spawnJson, FAKE_LEG_FIXTURE: fixtureDir },
  );
  assert.equal(vague.status, 0, 'runner must exit 0 for a vague scored run; stderr: ' + vague.stderr);
  const vagueResult = JSON.parse(fs.readFileSync(path.join(vagueOut, vagueContract.id + '-smoke.result.json'), 'utf8'));
  assert.equal(vagueResult.classification, 'setup_misbind');
  assert.equal(vagueResult.vagueAskOutcome, 'misroute');

  // ── integration: rewrite-only fixture artifact still counts as gained ────
  const artifactPath = path.join(fixtureDir, 'artifact.txt');
  fs.writeFileSync(artifactPath, 'before rewrite\n');
  const rewriteOut = path.join(rootTmp, 'out-rewrite');
  const rewrite = runBench(
    ['--scenario', scenarioPath, '--leg', 'smoke', '--out-dir', rewriteOut, '--repo-root', rootTmp, '--watchdog-ms', '60000'],
    { BEHAVIOR_BENCH_SPAWN_JSON: spawnJson, FAKE_LEG_FIXTURE: fixtureDir },
  );
  assert.equal(rewrite.status, 0, 'runner must exit 0 for a rewrite-only scored run; stderr: ' + rewrite.stderr);

  const rewriteResult = JSON.parse(fs.readFileSync(path.join(rewriteOut, contract.id + '-smoke.result.json'), 'utf8'));
  assert.equal(fs.readFileSync(artifactPath, 'utf8'), 'smoke\n');
  assert.equal(rewriteResult.classification, 'pass', 'rewrite-only fixture change must satisfy artifact gain');
  assert.equal(rewriteResult.dimensions.d4, 2, 'rewrite-only fixture change sets fixtureGained true');

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
  assert.equal(hangResult.primaryCause, 'stuck_no_progress');
  assert.equal(hangResult.secondaryCause, null);
  assert.equal(hangResult.stuckNoProgressRate.value, 1);

  // ── integration: sample mode writes per-sample verdicts and stability ─────
  const sampleFixtureDir = path.join(rootTmp, 'fixture-samples');
  fs.mkdirSync(sampleFixtureDir, { recursive: true });
  const sampleContract = loadSmokeContract();
  sampleContract.id = 'SMOKE-SAMPLES';
  sampleContract.fixture = sampleFixtureDir;
  const sampleScenarioPath = writeScenario(rootTmp, sampleContract);
  const sampleLeg = path.join(rootTmp, 'sample-leg.cjs');
  fs.writeFileSync(sampleLeg, [
    "'use strict';",
    "const fs = require('node:fs');",
    "const path = require('node:path');",
    "process.stdout.write('BENCH-SMOKE-MARKER\\n');",
    "process.stdout.write('{\"tool\":\"task\",\"subagent_type\":\"deep-research\"}\\n');",
    "fs.mkdirSync(process.env.FAKE_LEG_FIXTURE, { recursive: true });",
    "fs.writeFileSync(path.join(process.env.FAKE_LEG_FIXTURE, 'artifact.txt'), process.hrtime.bigint().toString() + '\\n');",
  ].join('\n'));
  const sampleOut = path.join(rootTmp, 'out-samples');
  const sampled = runBench(
    ['--scenario', sampleScenarioPath, '--leg', 'smoke', '--out-dir', sampleOut, '--repo-root', rootTmp, '--watchdog-ms', '60000', '--samples', '3'],
    { BEHAVIOR_BENCH_SPAWN_JSON: JSON.stringify([process.execPath, sampleLeg]), FAKE_LEG_FIXTURE: sampleFixtureDir },
  );
  assert.equal(sampled.status, 0, 'sample runner must exit 0; stderr: ' + sampled.stderr);
  const sampledResult = JSON.parse(fs.readFileSync(path.join(sampleOut, sampleContract.id + '-smoke.result.json'), 'utf8'));
  assert.equal(sampledResult.schemaVersion, 1);
  assert.equal('postconditions' in sampledResult, false);
  assert.equal('directDispatch' in sampledResult, false);
  assert.equal('boundary' in sampledResult, false);
  assert.equal(sampledResult.singleSample, false);
  assert.equal(sampledResult.samplesRequested, 3);
  assert.equal(sampledResult.samplesCompleted, 3);
  assert.equal(sampledResult.samples.length, 3);
  assert.deepEqual(sampledResult.samples.map((sample) => sample.verdict), ['pass', 'pass', 'pass']);
  assert.equal(sampledResult.stability.stable, true);
  assert.equal(sampledResult.stability.classificationCounts.pass, 3);
  assert.equal(sampledResult.stability.stuckNoProgressRate.value, 0);
  assert.ok(fs.existsSync(path.join(sampleOut, sampleContract.id + '-smoke.sample-001.result.json')));

  const sampleV2FixtureDir = path.join(rootTmp, 'fixture-samples-v2');
  fs.mkdirSync(sampleV2FixtureDir, { recursive: true });
  const sampleV2Contract = { ...v2Contract };
  sampleV2Contract.id = 'SMOKE-SAMPLES-V2';
  sampleV2Contract.fixture = sampleV2FixtureDir;
  sampleV2Contract.postconditions = [
    { kind: 'file_exists', path: 'artifact.txt' },
    { kind: 'changed_paths_within', prefix: 'artifact.txt' },
  ];
  const sampleV2ScenarioPath = writeScenario(rootTmp, sampleV2Contract);
  const sampleV2Out = path.join(rootTmp, 'out-samples-v2');
  const sampledV2 = runBench(
    ['--scenario', sampleV2ScenarioPath, '--leg', 'smoke', '--out-dir', sampleV2Out, '--repo-root', rootTmp, '--watchdog-ms', '60000', '--samples', '2'],
    { BEHAVIOR_BENCH_SPAWN_JSON: JSON.stringify([process.execPath, sampleLeg]), FAKE_LEG_FIXTURE: sampleV2FixtureDir },
  );
  assert.equal(sampledV2.status, 0, 'v2 sample runner must exit 0; stderr: ' + sampledV2.stderr);
  const sampledV2Result = JSON.parse(
    fs.readFileSync(path.join(sampleV2Out, sampleV2Contract.id + '-smoke.result.json'), 'utf8'),
  );
  assert.equal(sampledV2Result.schemaVersion, 2);
  assert.equal(sampledV2Result.postconditions.length, 2);
  assert.equal(sampledV2Result.directDispatch.expectedTargetHits, 2);
  assert.deepEqual(sampledV2Result.boundary, { clean: true, escapes: [] });
  assert.ok(sampledV2Result.samples.every((sample) => sample.directDispatch.expectedTargetHits === 1));

  fs.rmSync(rootTmp, { recursive: true, force: true });
  console.log('behavior-bench-run.test.cjs: all assertions passed');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
