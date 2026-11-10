// Whole-system gate. Measures a frozen commit and writes a receipt.
// Changes nothing: no runtime code, no protocol document, no authority record.
// Verdict is PASS only if every check that ran passed; any failing check => FAIL.
// There is no advisory tier — a warning that lets a failure through would defeat
// the purpose, which is to be believed at the exact moment someone wants to ship.
// A check that throws is reported as `error`, never as `fail`. The two mean
// opposite things: `fail` is a measurement of the system, `error` is a defect in
// this harness that measured nothing. Collapsing them lets a broken check pose as
// a diligent one, which is the more dangerous direction — a permanent red reads
// as rigour and stops being questioned.
// The receipt is written whether the gate passes or fails: a gate that only
// reports good news is not a gate.

import { registerHooks, createRequire } from 'node:module';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync, statSync, mkdtempSync, rmSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

// The runtime's sources are TypeScript that import each other with the `.js`
// specifiers the TS-ESM convention requires. Node strips types from a `.ts`
// entry file but does not rewrite those specifiers, so every internal import
// resolves to a `.js` that was never emitted. Mapping the miss back to `.ts`
// keeps resolution a property of this harness rather than of the command line
// used to start it: an invocation-dependent gate silently reports a defect in
// itself as a defect in the system.
registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (err) {
      if (specifier.endsWith('.js')) {
        return nextResolve(`${specifier.slice(0, -3)}.ts`, context);
      }
      throw err;
    }
  },
});

// Absolute runtime directory.
const RUNTIME =
  '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/022-012-runtime-enablement-build/.opencode/skills/system-deep-loop/runtime';

// Suite logs from a real full-suite run captured as artifacts the gate reads,
// rather than re-running the multi-minute suite inline on every gate. Co-located
// with the gate so they travel with the receipt and are trivial to repoint when
// a run moves.
const BASELINE_LOG = join(SCRIPT_DIR, 'baseline-raw.txt');
const CANDIDATE_LOG = join(SCRIPT_DIR, 'candidate-raw.txt');

// The commit whose tree the suite was measured against. The candidate must be
// byte-identical to this tree on the runtime path, or the suite numbers are
// numbers about a different commit than the one we are shipping.
const SUITE_TREE_REF = '1169b3d5bc';
const DEFAULT_BASELINE_REF = '8c9f0b6944';

// A nonexistent path used to force git commands to fail for --break falsifiability.
// The point is to prove the gate can actually turn red and still write its receipt.
const NONEXISTENT_DIR = '/dev/null/does-not-exist-gate-break';
const NONEXISTENT_REF = '0000000000000000000000000000000000000001';

// Negative-control toggle for the reader-contract check. When true, one
// materialized file's bytes are corrupted before the real read so the check
// observes a genuine read failure and returns 'fail'. Left false in
// production: the false branch is the load-bearing one. Flipping this true
// must turn the reader-contracts row red.
const READER_CONTRACT_CORRUPT_INJECT = false;

// ---------------------------------------------------------------- argv parsing

function parseArgs(argv) {
  const out = { candidate: null, baseline: null, out: null, break: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--candidate') out.candidate = argv[++i];
    else if (a === '--baseline') out.baseline = argv[++i];
    else if (a === '--out') out.out = argv[++i];
    else if (a === '--break') out['break'] = argv[++i];
  }
  return out;
}

// Resolve a SHA by executing git, never by trusting a typed literal as the
// source of truth. A receipt that names a commit nobody verified is a receipt
// about nothing: the literal could be a typo, a stale ref, or a SHA that never
// existed in this repository. Only git's own resolution counts as evidence.
function resolveSha(ref) {
  return execFileSync('git', ['rev-parse', ref], { encoding: 'utf8' }).trim();
}

// ---------------------------------------------------------------- check helpers

function gitStatusPorcelain(cwd) {
  return execFileSync('git', ['status', '--porcelain'], { encoding: 'utf8', cwd });
}

function gitDiffStat(candidate, treeRef, pathspec) {
  return execFileSync(
    'git',
    ['diff', '--stat', candidate, treeRef, '--', pathspec],
    { encoding: 'utf8' }
  );
}

// Parse a vitest-style summary file. Returns null if the file is missing or the
// summary lines cannot be found — a missing/unparseable log is a hard fail,
// never silently treated as a pass.
function parseSuiteLog(path) {
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    return null;
  }
  const testsRe = /Tests\s+(?:(\d+) failed \| )?(\d+) passed(?: \| (\d+) skipped)?\s+\((\d+)\)/;
  const filesRe = /Test Files\s+(?:(\d+) failed \| )?(\d+) passed\s+\((\d+)\)/;
  const testsMatch = text.match(testsRe);
  const filesMatch = text.match(filesRe);
  if (!testsMatch || !filesMatch) return null;
  return {
    testsFailed: testsMatch[1] ? parseInt(testsMatch[1], 10) : 0,
    testsPassed: parseInt(testsMatch[2], 10),
    testsSkipped: testsMatch[3] ? parseInt(testsMatch[3], 10) : 0,
    testsTotal: parseInt(testsMatch[4], 10),
    filesFailed: filesMatch[1] ? parseInt(filesMatch[1], 10) : 0,
    filesPassed: parseInt(filesMatch[2], 10),
    filesTotal: parseInt(filesMatch[3], 10),
  };
}

function deltaSuite(candidate, baseline) {
  return {
    failed: candidate.testsFailed - baseline.testsFailed,
    passed: candidate.testsPassed - baseline.testsPassed,
    skipped: candidate.testsSkipped - baseline.testsSkipped,
    total: candidate.testsTotal - baseline.testsTotal,
    files: candidate.filesTotal - baseline.filesTotal,
  };
}

// ---------------------------------------------------------------- the checks

// check 1 — the working tree must be clean. The gate must not measure a tree
// that is drifting under it: a dirty tree means the SHAs name one commit while
// the actual bytes on disk are something else.
function checkTreeClean(forcedBreak) {
  if (forcedBreak === 'tree-clean') {
    // Force the real evaluation to be impossible (run git in a nonexistent cwd)
    // rather than faking the output. Proves the gate can turn red honestly.
    let out;
    try {
      out = gitStatusPorcelain(NONEXISTENT_DIR);
    } catch (e) {
      return { id: 'tree-clean', description: 'Working tree is clean', status: 'fail', detail: `forced break: ${e.message}` };
    }
    return { id: 'tree-clean', description: 'Working tree is clean', status: 'fail', detail: `forced break: unexpected output: ${out}` };
  }
  // The gate writes its receipt (and the script itself lives) inside the very
  // tree it measures, so its own footprint would appear here and make the check
  // report the measuring instrument instead of the system being measured.
  // Exclude the gate's own output directory by exact repo-root-relative path
  // comparison, not a loose filename substring that could match elsewhere.
  const repoRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  const gateDirRel = relative(repoRoot, SCRIPT_DIR);
  const raw = gitStatusPorcelain(repoRoot);
  // Porcelain v1 lines are "XY <path>" (two status chars, one space, then the
  // repo-root-relative path). Run from repoRoot so the paths are guaranteed
  // repo-root-relative regardless of where the gate was invoked from.
  const remaining = [];
  for (const line of raw.split('\n')) {
    if (line.length === 0) continue;
    const entryPath = line.slice(3);
    const finalPath = entryPath.includes(' -> ') ? entryPath.split(' -> ')[1] : entryPath;
    const rel = relative(gateDirRel, finalPath);
    const insideGateDir = rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
    if (!insideGateDir) remaining.push(line);
  }
  const excludedName = gateDirRel;
  if (remaining.length === 0) {
    return {
      id: 'tree-clean',
      description: 'Working tree is clean',
      status: 'pass',
      detail: `tree clean apart from the gate's own artifacts; excluded ${excludedName} (gate output directory); nothing remained after exclusion`,
    };
  }
  return {
    id: 'tree-clean',
    description: 'Working tree is clean',
    status: 'fail',
    detail: `excluded ${excludedName} (gate output directory); remaining after exclusion:\n${remaining.join('\n').trim()}`,
  };
}

// check 2 — the candidate's runtime tree must be byte-identical to the tree the
// suite was measured against. If it differs, the suite numbers describe a
// different commit than the one being shipped.
function checkCandidateFrozen(candidateSha, forcedBreak) {
  if (forcedBreak === 'candidate-frozen') {
    let out;
    try {
      out = gitDiffStat(candidateSha, NONEXISTENT_REF, '.opencode/skills/system-deep-loop/runtime/');
    } catch (e) {
      return { id: 'candidate-frozen', description: 'Candidate runtime tree matches the measured tree', status: 'fail', detail: `forced break: ${e.message}` };
    }
    return { id: 'candidate-frozen', description: 'Candidate runtime tree matches the measured tree', status: 'fail', detail: `forced break: unexpected output: ${out}` };
  }
  const out = gitDiffStat(candidateSha, SUITE_TREE_REF, '.opencode/skills/system-deep-loop/runtime/');
  if (out.trim() === '') {
    return { id: 'candidate-frozen', description: 'Candidate runtime tree matches the measured tree', status: 'pass', detail: 'identical' };
  }
  return { id: 'candidate-frozen', description: 'Candidate runtime tree matches the measured tree', status: 'fail', detail: out.trim() };
}

// check 3 — every mode's durable authority record must show the authority has
// actually moved to a ledger-authoritative state (reversible or final). Any
// mode still on legacy is a FAIL; do not soften this. The whole point of the
// gate is that authority actually moved, not that the files exist.
async function checkAuthorityState() {
  const { AuthorityRegistry, AUTHORITY_FLIP_MODE_ORDER } = await import(
    `${RUNTIME}/lib/per-mode-authority-flip/index.ts`
  );
  const { resolveAuthorityRoot } = await import(
    `${RUNTIME}/lib/authority-root/resolve-authority-root.ts`
  );
  const authorityRoot = resolveAuthorityRoot();
  const registry = new AuthorityRegistry(authorityRoot);
  const records = [];
  for (const mode of AUTHORITY_FLIP_MODE_ORDER) {
    // A read of an absent record returns a synthesized legacy default rather
    // than failing, so the value alone cannot say whether a mode was ever
    // written. Record the provenance next to it: today an absent record and a
    // stored legacy record agree, but a record that is deleted later would read
    // as ordinary legacy instead of as the corruption it is, and this is the
    // only place that distinction is still visible.
    const stored = existsSync(join(authorityRoot, `authority-${mode}.json`));
    const rec = registry.read(mode); // pure read; writes nothing
    records.push({
      mode,
      state: rec.state,
      epoch: rec.epoch,
      selectedWriter: rec.selectedWriter,
      source: stored ? 'stored' : 'default',
    });
  }
  const storedCount = records.filter((r) => r.source === 'stored').length;
  const count = records.length;
  const byState = {};
  for (const r of records) byState[r.state] = (byState[r.state] || 0) + 1;
  const allMoved = records.every(
    (r) => r.state === 'new_authoritative_reversible' || r.state === 'new_authoritative_final',
  );
  const stateSummary = Object.entries(byState)
    .map(([s, n]) => `${n} on ${s}`)
    .join(', ');
  const detail =
    `read ${count} modes; ${stateSummary}; ` +
    `${storedCount} from a stored record, ${count - storedCount} from the absent-record default`;
  return {
    id: 'authority-state',
    description: 'Every mode authority is on new_authoritative_reversible or new_authoritative_final',
    status: allMoved ? 'pass' : 'fail',
    detail,
    records,
  };
}

// check 4 — read the captured suite logs, do not re-run. Pass when the
// candidate's failed-test count is <= the baseline's. Reported as a delta,
// never as a bare number: a bare 'passed' hides whether anything regressed.
function checkRuntimeSuite() {
  const baseline = parseSuiteLog(BASELINE_LOG);
  const candidate = parseSuiteLog(CANDIDATE_LOG);
  if (!baseline) {
    return {
      id: 'runtime-suite',
      description: 'Candidate suite failures <= baseline (read from captured logs)',
      status: 'fail',
      detail: `baseline log missing or unparseable: ${BASELINE_LOG}`,
      suite: { baseline: null, candidate, delta: null },
    };
  }
  if (!candidate) {
    return {
      id: 'runtime-suite',
      description: 'Candidate suite failures <= baseline (read from captured logs)',
      status: 'fail',
      detail: `candidate log missing or unparseable: ${CANDIDATE_LOG}`,
      suite: { baseline, candidate: null, delta: null },
    };
  }
  const delta = deltaSuite(candidate, baseline);
  const passed = candidate.testsFailed <= baseline.testsFailed;
  const deltaDetail =
    `failed ${candidate.testsFailed} vs ${baseline.testsFailed} (Δ${delta.failed >= 0 ? '+' : ''}${delta.failed}); ` +
    `passed ${candidate.testsPassed} vs ${baseline.testsPassed} (Δ${delta.passed >= 0 ? '+' : ''}${delta.passed}); ` +
    `skipped ${candidate.testsSkipped} vs ${baseline.testsSkipped} (Δ${delta.skipped >= 0 ? '+' : ''}${delta.skipped}); ` +
    `total ${candidate.testsTotal} vs ${baseline.testsTotal} (Δ${delta.total >= 0 ? '+' : ''}${delta.total}); ` +
    `files ${candidate.filesTotal} vs ${baseline.filesTotal} (Δ${delta.files >= 0 ? '+' : ''}${delta.files})`;
  return {
    id: 'runtime-suite',
    description: 'Candidate suite failures <= baseline (read from captured logs)',
    status: passed ? 'pass' : 'fail',
    detail: deltaDetail,
    suite: { baseline, candidate, delta },
  };
}

// check 5 — each listed consumer script must exist on disk and be startable.
// A check that is structurally incapable of turning red is worse than no
// check at all: it prints a green that lulls an operator into believing a
// property was verified when nothing was. The previous shape only looked at
// whether spawn returned a numeric status, but node returns a numeric status
// even for a script that does not exist on disk — so the guard could never
// fire and the green was meaningless. This version fails on either a missing
// file or a spawn that could not start, which are the two things it can
// actually prove. A non-zero exit from a script invoked without its required
// arguments is expected and is NOT a failure here. This proves reachability
// only; it is not proof the consumers work end to end.
function checkConsumerReachability() {
  const scripts = [
    'scripts/reduce-state.cjs',
    'scripts/reduce-alignment-state.cjs',
    'scripts/verify-iteration.cjs',
    'scripts/fanout-merge.cjs',
    'scripts/fanout-salvage.cjs',
    'scripts/query.cjs',
    'scripts/status.cjs',
  ];
  const results = [];
  for (const rel of scripts) {
    const scriptPath = join(RUNTIME, rel);
    const exists = existsSync(scriptPath);
    const res = spawnSync(process.execPath, [scriptPath], { encoding: 'utf8', cwd: RUNTIME });
    const stdoutFirst = (res.stdout || '').split('\n').map((l) => l.trim()).find((l) => l.length > 0) || '';
    const stderrFirst = (res.stderr || '').split('\n').map((l) => l.trim()).find((l) => l.length > 0) || '';
    const firstLine = (stdoutFirst || stderrFirst || '').slice(0, 200);
    results.push({ script: rel, exists, exitCode: res.status, firstLine });
  }
  const missing = results.filter((r) => !r.exists);
  const notSpawned = results.filter((r) => r.exitCode === null || r.exitCode === undefined);
  const ok = missing.length === 0 && notSpawned.length === 0;
  return {
    id: 'consumer-reachability',
    description: 'Every listed consumer script exists on disk and can be started',
    status: ok ? 'pass' : 'fail',
    detail: ok
      ? `all ${results.length} scripts exist and spawned; non-zero exits are expected when required args are absent — this proves reachability only, not end-to-end correctness`
      : `${missing.length} script(s) missing on disk; ${notSpawned.length} script(s) could not be spawned`,
    results,
  };
}

// check — end-to-end reader contract. For each of the eight authority-flip
// modes, folds a small but real ledger of that mode's events through the
// production projection contract, materializes the projected bytes to a temp
// dir, and runs the mode's REAL reader against them. A clean read (no
// corruption, no throw) is a pass; any read failure is a fail. The negative-
// control toggle corrupts one materialized file so the check can genuinely
// go red — a check that always passes is the defect this effort eliminates.
async function checkReaderContracts() {
  const require_ = createRequire(import.meta.url);
  const FIXED_TS = '2026-08-23T00:00:00.000Z';
  const GENESIS_HASH = '0'.repeat(64);
  const decoder = new TextDecoder();

  // Import the production projection library — the same entry the shadow-
  // parity harnesses and contract tests use.
  const {
    foldLegacyProjectionSurface,
    createDeepResearchDeltasProjectionContract,
    createDeepReviewDeltasProjectionContract,
    createDeepAiCouncilConfigStateProjectionContract,
    createDeepImprovementLedgersProjectionContract,
    createDeepAlignmentStateDeltasProjectionContract,
  } = await import(`${RUNTIME}/lib/legacy-projections/index.ts`);

  // Import the real CommonJS consumers — the actual shipped scripts, not
  // reimplementations.
  const { verify: verifyIteration } = require_(`${RUNTIME}/scripts/verify-iteration.cjs`);
  const { reduceReviewState } = require_(`${RUNTIME}/scripts/reduce-state.cjs`);
  const { reduceAlignmentState, laneKey } = require_(`${RUNTIME}/scripts/reduce-alignment-state.cjs`);
  const replayModule = require_(join(RUNTIME, '..', 'deep-ai-council', 'scripts', 'replay-graph-from-artifacts.cjs'));
  const adviseModule = require_(join(RUNTIME, '..', 'deep-ai-council', 'scripts', 'advise-council-completion.cjs'));
  const roundStateModule = require_(join(RUNTIME, 'lib', 'council', 'round-state-jsonl.cjs'));
  const IMPROVEMENT_REDUCE_SCRIPT = join(RUNTIME, '..', 'deep-improvement', 'scripts', 'shared', 'reduce-state.cjs');

  function fakeHead(ledgerId) {
    return Object.freeze({ ledgerId, sequence: 0, recordHash: GENESIS_HASH });
  }

  // Minimal event carrying only the fields the contracts' reduce() reads:
  // effective.envelope.{event_type, occurred_at, payload:{stem, scope, data}}.
  function ev(eventType, stem, scope, data, occurredAt) {
    return {
      effective: {
        envelope: {
          event_type: eventType,
          occurred_at: occurredAt || FIXED_TS,
          payload: { stem, scope, data },
        },
      },
    };
  }

  function decodeUtf8(bytes) {
    return decoder.decode(bytes);
  }

  function writeArtifact(specFolder, artifact) {
    const outputPath = join(specFolder, artifact.relativePath);
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, decodeUtf8(artifact.bytes));
    return outputPath;
  }

  const scratchDirs = [];
  const results = [];

  try {
    // ── Mode 1: deep-research → research-deltas contract + verify-iteration
    {
      const specFolder = mkdtempSync(join(tmpdir(), 'gate-reader-research-'));
      scratchDirs.push(specFolder);
      const researchDir = join(specFolder, 'research');
      const deltasDir = join(researchDir, 'deltas');
      const iterationsDir = join(researchDir, 'iterations');
      mkdirSync(deltasDir, { recursive: true });
      mkdirSync(iterationsDir, { recursive: true });

      const events = [
        ev('deep-research.ledger.iteration-started', 'deep_research.iteration_started',
          { runId: 'res-1', lineageId: 'lin-1', iteration: 1 },
          { focusRef: 'focus-1', stateTailDigest: 'd0', strategyDigest: 'd1', status: 'started' }),
        ev('deep-research.ledger.iteration-completed', 'deep_research.iteration_completed',
          { runId: 'res-1', lineageId: 'lin-1', iteration: 1 },
          { status: 'complete', rawNewInfoRatio: 0.7, trustedEvidenceYield: 0.5, outputDigest: 'd2', ruledOutApproachRefs: [], nextFocusCausationId: 'cf-1' }),
        ev('deep-research.ledger.iteration-completed', 'deep_research.iteration_completed',
          { runId: 'res-1', lineageId: 'lin-1', iteration: 2 },
          { status: 'insight', rawNewInfoRatio: 0.6, trustedEvidenceYield: 0.4, outputDigest: 'd3', ruledOutApproachRefs: ['approach-a'], nextFocusCausationId: 'cf-2' }),
      ];

      const surface = createDeepResearchDeltasProjectionContract();
      const folded = foldLegacyProjectionSurface(surface, events, fakeHead('deep-research-ledger'));
      const writtenPaths = folded.map((a) => writeArtifact(specFolder, a));

      // Companion files verify-iteration requires.
      writeFileSync(join(iterationsDir, 'iteration-001.md'), '# Iteration 1\n\nResearch iteration 1 narrative.\n');
      writeFileSync(join(iterationsDir, 'iteration-002.md'), '# Iteration 2\n\nResearch iteration 2 narrative.\n');
      const stateRecord1 = { type: 'iteration', iteration: 1, mode: 'research', target_agent: 'deep-research', agent_definition_loaded: true, resolved_route: 'deep-research-leaf-1', timestamp: FIXED_TS };
      const stateRecord2 = { type: 'iteration', iteration: 2, mode: 'research', target_agent: 'deep-research', agent_definition_loaded: true, resolved_route: 'deep-research-leaf-2', timestamp: FIXED_TS };
      writeFileSync(join(researchDir, 'deep-research-state.jsonl'), `${JSON.stringify(stateRecord1)}\n${JSON.stringify(stateRecord2)}\n`);

      // Negative control: corrupt ONE materialized file so the real reader
      // observes corruption and the check goes red. Only the first mode's
      // first artifact is corrupted — one file, one failure.
      if (READER_CONTRACT_CORRUPT_INJECT) {
        writeFileSync(writtenPaths[0], '{CORRUPTED BYTES NOT VALID JSONL\n');
      }

      let readOk = true;
      let readDetail = '';
      try {
        const r1 = verifyIteration('research', researchDir, 1);
        const r2 = verifyIteration('research', researchDir, 2);
        if (!r1.ok || !r2.ok) {
          readOk = false;
          readDetail = `verify-iteration: iter1 ok=${r1.ok} reason=${r1.reason}; iter2 ok=${r2.ok} reason=${r2.reason}`;
        } else {
          readDetail = `verify-iteration: iter1 ok, iter2 ok`;
        }
      } catch (e) {
        readOk = false;
        readDetail = `verify-iteration threw: ${e.message}`;
      }
      results.push({ mode: 'deep-research', reader: 'scripts/verify-iteration.cjs#verify', status: readOk ? 'pass' : 'fail', detail: readDetail });
    }

    // ── Mode 2: deep-review → review-deltas contract + reduce-state
    {
      const specFolder = mkdtempSync(join(tmpdir(), 'gate-reader-review-'));
      scratchDirs.push(specFolder);
      const reviewDir = join(specFolder, 'review');
      const deltasDir = join(reviewDir, 'deltas');
      mkdirSync(deltasDir, { recursive: true });

      const events = [
        ev('deep-review.ledger.finding-candidate-emitted', 'deep_review.finding_candidate_emitted',
          { runId: 'rev-1', sessionId: 's1', generation: 1, iterationId: '1', dimensionId: 'correctness', candidateId: 'C001' },
          { findingClass: 'logic', evidenceRefs: ['E001'], claimTextDigest: 'd1', impact: 0.5, rawConfidence: 0.8, rawCandidateScore: 0.7, actionability: 0.6, reachability: 0.5, exploitability: 0.4, evidenceType: 'inspection', evidenceScope: 'direct', rawObservationDigest: 'd2', semanticFingerprint: { algorithmVersion: '1', semanticAnchorDigest: 'd3', normalizedContextDigest: 'd4', programSliceDigest: 'd5', renameMapVersion: '1', baselineState: 'absent' }, sourcePassEventId: 'EVT-001' }),
        ev('deep-review.ledger.claim-adjudication-recorded', 'deep_review.claim_adjudication_recorded',
          { runId: 'rev-1', sessionId: 's1', generation: 1, iterationId: '1', dimensionId: 'correctness', candidateId: 'C001', findingId: 'F001' },
          { claimDigest: 'd6', evidenceRefs: ['E001'], counterevidenceSoughtRefs: [], alternativeExplanationDigest: 'd7', finalSeverity: 'P1', impact: 0.5, confidence: 0.8, downgradeTrigger: 'none', transition: 'candidate-to-finding', validatorFingerprint: 'd8', adjudicationOutcome: 'accepted', predecessorAdjudicationEventId: null }),
        ev('deep-review.ledger.claim-adjudication-recorded', 'deep_review.claim_adjudication_recorded',
          { runId: 'rev-1', sessionId: 's1', generation: 1, iterationId: '2', dimensionId: 'security', candidateId: 'C002', findingId: 'F002' },
          { claimDigest: 'd9', evidenceRefs: ['E002'], counterevidenceSoughtRefs: [], alternativeExplanationDigest: 'd10', finalSeverity: 'P0', impact: 0.9, confidence: 0.9, downgradeTrigger: 'none', transition: 'candidate-to-finding', validatorFingerprint: 'd11', adjudicationOutcome: 'accepted', predecessorAdjudicationEventId: null }),
      ];

      const surface = createDeepReviewDeltasProjectionContract();
      const folded = foldLegacyProjectionSurface(surface, events, fakeHead('deep-review-ledger'));
      const writtenPaths = folded.map((a) => writeArtifact(specFolder, a));

      // Companion files reduceReviewState requires to run.
      writeFileSync(join(reviewDir, 'deep-review-config.json'), JSON.stringify({ maxIterations: 5, reviewTarget: 'gate-reader-proof' }));
      writeFileSync(join(reviewDir, 'deep-review-state.jsonl'), '');

      let readOk = true;
      let readDetail = '';
      try {
        const result = reduceReviewState(specFolder, { write: false, artifactDir: reviewDir });
        if (result.hasCorruption) {
          readOk = false;
          readDetail = `reduceReviewState: hasCorruption=true, warnings=${JSON.stringify(result.corruptionWarnings)}`;
        } else {
          readDetail = `reduceReviewState: hasCorruption=false, openFindings=${result.registry.openFindingsCount}`;
        }
      } catch (e) {
        readOk = false;
        readDetail = `reduceReviewState threw: ${e.message}`;
      }
      results.push({ mode: 'deep-review', reader: 'scripts/reduce-state.cjs#reduceReviewState', status: readOk ? 'pass' : 'fail', detail: readDetail });
    }

    // ── Mode 3: deep-ai-council → council-config-state contract + real consumers
    {
      const specFolder = mkdtempSync(join(tmpdir(), 'gate-reader-council-'));
      scratchDirs.push(specFolder);

      const runScope = (roundId) => ({ runId: 'council-run-1', roundId });
      const seatScope = (roundId, seatId) => ({ runId: 'council-run-1', roundId, seatId });
      const events = [
        ev('deep-ai-council.ledger.run-initialized', 'ai_council.run_initialized',
          { runId: 'council-run-1', roundId: 'round-001' },
          { target: { targetId: 't1', targetType: 'file', artifactRef: 'a1', targetVersion: '1', contentDigest: GENESIS_HASH }, targetDigest: GENESIS_HASH, taskClass: 'code', configDigest: GENESIS_HASH, strategyDigest: GENESIS_HASH, convergencePolicyDigest: GENESIS_HASH, testGatePolicyDigest: GENESIS_HASH, maxRounds: 3, minSeatCount: 2, maxSeatCount: 5, planningOnly: true, initialReplayFingerprint: GENESIS_HASH }),
        ev('deep-ai-council.ledger.round-started', 'ai_council.round_started',
          runScope('round-001'),
          { roundNumber: 1, executorBoundaryRef: 'in-cli', seatRosterDigest: GENESIS_HASH, protocolVersion: '1', promptPackDigest: GENESIS_HASH, budgetRef: 'b1', priorRoundRef: null, exposurePolicyVersion: '1', informationSurface: { role: 'orchestrator', capabilityRefs: [], visibleDigests: [], generatorIdentityVisible: false, rationaleVisible: false, peerScoresVisible: false, voteCountsVisible: false, independentJudgmentsCommitted: true } }),
        ev('deep-ai-council.ledger.seat-returned', 'ai_council.seat_returned',
          seatScope('round-001', 'seat-001'),
          { targetVersion: '1', responseStatus: 'returned', proposalDigest: GENESIS_HASH, artifactRef: 'a1', artifactDigest: GENESIS_HASH, rawScores: { quality: 0.8, feasibility: 0.7, novelty: 0.6, risk: 0.3 }, rawConfidence: 0.9, usage: { receiptRef: 'r1', inputTokens: 100, outputTokens: 200, costMicros: 50 }, evidenceRefs: [], outputSchemaVersion: '1', observationDigest: GENESIS_HASH, informationSurface: { role: 'generator', capabilityRefs: [], visibleDigests: [], generatorIdentityVisible: false, rationaleVisible: false, peerScoresVisible: false, voteCountsVisible: false, independentJudgmentsCommitted: true }, failureReason: null, timeoutReason: null }),
        ev('deep-ai-council.ledger.seat-returned', 'ai_council.seat_returned',
          seatScope('round-001', 'seat-002'),
          { targetVersion: '1', responseStatus: 'returned', proposalDigest: GENESIS_HASH, artifactRef: 'a2', artifactDigest: GENESIS_HASH, rawScores: { quality: 0.7, feasibility: 0.8, novelty: 0.5, risk: 0.2 }, rawConfidence: 0.85, usage: { receiptRef: 'r2', inputTokens: 120, outputTokens: 180, costMicros: 45 }, evidenceRefs: [], outputSchemaVersion: '1', observationDigest: GENESIS_HASH, informationSurface: { role: 'generator', capabilityRefs: [], visibleDigests: [], generatorIdentityVisible: false, rationaleVisible: false, peerScoresVisible: false, voteCountsVisible: false, independentJudgmentsCommitted: true }, failureReason: null, timeoutReason: null }),
        ev('deep-ai-council.ledger.deliberation-synthesized', 'ai_council.deliberation_synthesized',
          runScope('round-001'),
          { inputEventRange: { firstEventId: 'e1', lastEventId: 'e4' }, candidateSetDigest: GENESIS_HASH, planDisposition: 'selected', selectedPlanDigest: GENESIS_HASH, disagreementRefs: [], minorityRefs: [], synthesisPolicyFingerprint: GENESIS_HASH, evaluatorFingerprint: GENESIS_HASH, reportDraftRef: 'rd1', synthesisReceiptRef: 'sr1' }),
        ev('deep-ai-council.ledger.round-ended', 'ai_council.round_ended',
          runScope('round-001'),
          { roundStatus: 'complete', convergenceEventId: 'e5', acceptedCandidateRefs: [], rejectedCandidateRefs: [], unresolvedCandidateRefs: [], seatOutcomeCounts: { selected: 2, dispatched: 2, returned: 2, failed: 0, timedOut: 0 }, lateResultDisposition: 'none', finalRoundTailDigest: GENESIS_HASH, continuationDecision: 'complete' }),
        ev('deep-ai-council.ledger.artifact-committed', 'ai_council.artifact_committed',
          { runId: 'council-run-1', roundId: 'round-001', artifactId: 'art-1' },
          { artifactKind: 'report', safeRelativePath: 'council-report.md', schemaVersion: '1', byteDigest: GENESIS_HASH, contentDigest: GENESIS_HASH, requiredSectionResults: [], sourceEventRange: { firstEventId: 'e1', lastEventId: 'e6' }, supersedesArtifactId: null, rollbackRef: null }),
        ev('deep-ai-council.ledger.council-complete', 'ai_council.council_complete',
          runScope('round-001'),
          { terminalStatus: 'completed', convergenceEventId: 'e5', finalDeliberationEventId: 'e5', artifactManifestRef: 'am1', councilTestGateEventId: 'tg1', finalLedgerTailDigest: GENESIS_HASH, counts: { rounds: 1, seats: 2, proposals: 2, judgments: 0 }, recommendationOrUserDecisionRef: 'rec1', terminalReason: 'converged' }),
      ];

      const surface = createDeepAiCouncilConfigStateProjectionContract();
      const folded = foldLegacyProjectionSurface(surface, events, fakeHead('deep-ai-council-ledger'));
      const writtenPaths = folded.map((a) => writeArtifact(specFolder, a));

      let readOk = true;
      let readDetail = '';
      try {
        const statePath = join(specFolder, 'ai-council', 'ai-council-state.jsonl');
        const parsedEvents = replayModule.parseJsonl(statePath);
        const payload = replayModule.derivePayload(specFolder, 'council-run-1', parsedEvents);
        const nodeKinds = payload.nodes.map((n) => n.kind);
        const advisories = adviseModule.collectAdvisories(specFolder);
        const sessionStatePath = join(specFolder, 'ai-council', 'session-state.jsonl');
        const sessionRecords = roundStateModule.readRoundStateRecords(sessionStatePath);
        const missingComplete = advisories.find((a) => a.includes('missing council_complete'));
        if (!nodeKinds.includes('SESSION') || !nodeKinds.includes('ROUND') || nodeKinds.filter((k) => k === 'SEAT').length !== 2) {
          readOk = false;
          readDetail = `graph replay: nodeKinds=${JSON.stringify(nodeKinds)}`;
        } else if (missingComplete) {
          readOk = false;
          readDetail = `advisor: missing council_complete advisory present`;
        } else if (sessionRecords.length === 0) {
          readOk = false;
          readDetail = `round-state reader: 0 session records`;
        } else {
          readDetail = `replay nodes=${payload.nodes.length}, advisories=${advisories.length}, session records=${sessionRecords.length}`;
        }
      } catch (e) {
        readOk = false;
        readDetail = `council consumers threw: ${e.message}`;
      }
      results.push({ mode: 'deep-ai-council', reader: 'deep-ai-council/scripts/replay-graph-from-artifacts.cjs + advise-council-completion.cjs + lib/council/round-state-jsonl.cjs', status: readOk ? 'pass' : 'fail', detail: readDetail });
    }

    // ── Modes 4-7: improvement family → improvement-ledgers contract + improvement reducer
    //    The four improvement modes share the same projection contract and
    //    real consumer; the variant field in the event scope distinguishes
    //    which workstream the events belong to.
    for (const [mode, variant] of [
      ['deep-improvement-common', 'agent-improvement'],
      ['agent-improvement', 'agent-improvement'],
      ['model-benchmark', 'model-benchmark'],
      ['skill-benchmark', 'skill-benchmark'],
    ]) {
      const specFolder = mkdtempSync(join(tmpdir(), `gate-reader-${mode}-`));
      scratchDirs.push(specFolder);

      const baseScope = (candidateId) => ({
        runId: 'improve-1', lineageId: 'lineage-1', variant, candidateId,
      });
      const events = [
        ev('deep-improvement-common.ledger.run-started', 'deep_improvement_common.run_started',
          { runId: 'improve-1', lineageId: 'lineage-1', variant },
          { generation: 1, charterDigest: GENESIS_HASH, configDigest: GENESIS_HASH, operatorRef: 'op', serviceContractVersion: '1', replayFingerprint: GENESIS_HASH, maxIterations: 5 }),
        ev('deep-improvement-common.ledger.evaluation-verification-recorded', 'deep_improvement_common.evaluation_verification_recorded',
          { ...baseScope('C001'), evaluationEpochId: 'epoch-1' },
          { requestEventId: 'E1', verifierRef: 'v', verificationOutcome: 'confirmed', verificationEvidenceRef: 'e', verificationEvidenceDigest: GENESIS_HASH, verificationReceiptRef: 'r' }),
        ev('deep-improvement-common.ledger.evaluation-verification-recorded', 'deep_improvement_common.evaluation_verification_recorded',
          { ...baseScope('C002'), evaluationEpochId: 'epoch-2' },
          { requestEventId: 'E2', verifierRef: 'v', verificationOutcome: 'disputed', verificationEvidenceRef: 'e', verificationEvidenceDigest: GENESIS_HASH, verificationReceiptRef: 'r' }),
        ev('deep-improvement-common.ledger.canary-gate-passed', 'deep_improvement_common.canary_gate_passed',
          { ...baseScope('C001'), canaryEpochId: 'ce-1', canarySuiteId: 'cs-1' },
          { executionEventIds: [], evidenceSetDigest: GENESIS_HASH, policyVersion: '1', policyFingerprint: 'f', decisionReceiptRef: 'r' }),
        ev('deep-improvement-common.ledger.run-completed', 'deep_improvement_common.run_completed',
          { runId: 'improve-1', lineageId: 'lineage-1', variant },
          { terminalOutcome: 'completed', stopReason: 'converged', sessionOutcome: 'keptBaseline', finalLedgerTailHash: GENESIS_HASH, counts: { candidates: 2, evaluations: 2, observations: 0, canaryRuns: 1, promotions: 0 }, completionEvidenceRefs: [] }),
      ];

      const surface = createDeepImprovementLedgersProjectionContract();
      const folded = foldLegacyProjectionSurface(surface, events, fakeHead('deep-improvement-ledger'));
      const writtenPaths = folded.map((a) => writeArtifact(specFolder, a));

      const runtimeRootArg = join(specFolder, 'improvement');

      let readOk = true;
      let readDetail = '';
      try {
        const stdout = execFileSync('node', [IMPROVEMENT_REDUCE_SCRIPT, runtimeRootArg], {
          cwd: RUNTIME, encoding: 'utf8',
        });
        const summary = JSON.parse(stdout.trim());
        if (summary.corruptionCount !== 0) {
          readOk = false;
          readDetail = `improvement reducer: corruptionCount=${summary.corruptionCount}`;
        } else {
          readDetail = `improvement reducer: corruptionCount=0, totalRecords=${summary.totalRecords}`;
        }
      } catch (e) {
        readOk = false;
        readDetail = `improvement reducer threw: ${e.message}`;
      }
      results.push({ mode, reader: 'deep-improvement/scripts/shared/reduce-state.cjs', status: readOk ? 'pass' : 'fail', detail: readDetail });
    }

    // ── Mode 8: deep-alignment → alignment-state-deltas contract + reduce-alignment-state
    {
      const specFolder = mkdtempSync(join(tmpdir(), 'gate-reader-alignment-'));
      scratchDirs.push(specFolder);
      const alignmentDir = join(specFolder, 'alignment');
      mkdirSync(alignmentDir, { recursive: true });

      const PROOF_LANE = Object.freeze({
        authority: 'sk-code', artifactClass: 'code', adapter: 'sk-code',
        scope: Object.freeze({ type: 'branchRange', from: 'main', to: 'feature/x' }),
      });
      const PROOF_LANE_ID = laneKey(PROOF_LANE);
      const baseScope = (iteration) => ({
        runId: 'align-1', sessionId: 's1', authorityEpochId: 'epoch-1', generation: 1,
        iterationId: String(iteration), laneId: PROOF_LANE_ID,
      });

      const events = [
        ev('deep-alignment.ledger.run-initialized', 'deep_alignment.run_initialized',
          { runId: 'align-1', sessionId: 's1', authorityEpochId: 'epoch-1', generation: 1 },
          { target: { kind: 'repository', ref: 'HEAD' }, lineageMode: 'fresh', maxIterations: 5, convergencePolicyVersion: '1', reviewModeContractDigest: GENESIS_HASH, initialReleaseReadinessState: 'not-assessed' }),
        ev('deep-alignment.ledger.lane-completed', 'deep_alignment.lane_completed',
          baseScope(1),
          { lanePlanEventId: 'EVT-LP-1', subjectSnapshotRef: 'snap-1', subjectSnapshotDigest: GENESIS_HASH, authorityValidationEventId: 'EVT-AV-1', applicabilityDecisionRefs: [], observationRefs: [], verificationRefs: [], status: 'complete', counts: { applicable: 0, notApplicable: 0, unresolved: 0, untested: 0, blocked: 0, nonConformant: 0 }, completionDigest: GENESIS_HASH, blockedReasonCode: null }),
        ev('deep-alignment.ledger.claim-adjudication-recorded', 'deep_alignment.claim_adjudication_recorded',
          { ...baseScope(1), candidateId: 'C001', findingId: 'F001', verificationId: 'V001' },
          { candidateEventId: 'EVT-C-1', verificationEventId: 'EVT-V-1', observationEventId: 'EVT-O-1', claimDigest: 'd1', evidenceReceiptRefs: ['E001'], proofWitnessRefs: [], counterevidenceRefs: [], verifierFingerprint: 'd2', assessorFingerprint: 'd3', authorityValidationEventId: 'EVT-AV-1', applicabilityDecisionId: 'EVT-AD-1', subjectSnapshotDigest: GENESIS_HASH, finalSeverity: 'P1', impact: 0.5, confidence: 0.8, outcome: 'accepted', transition: 'candidate-to-finding', adjudicationDigest: 'adj-d1', predecessorAdjudicationEventId: null }),
        ev('deep-alignment.ledger.lane-completed', 'deep_alignment.lane_completed',
          baseScope(2),
          { lanePlanEventId: 'EVT-LP-2', subjectSnapshotRef: 'snap-2', subjectSnapshotDigest: GENESIS_HASH, authorityValidationEventId: 'EVT-AV-2', applicabilityDecisionRefs: [], observationRefs: [], verificationRefs: [], status: 'complete', counts: { applicable: 0, notApplicable: 0, unresolved: 0, untested: 0, blocked: 0, nonConformant: 0 }, completionDigest: GENESIS_HASH, blockedReasonCode: null }),
        ev('deep-alignment.ledger.claim-adjudication-recorded', 'deep_alignment.claim_adjudication_recorded',
          { ...baseScope(2), candidateId: 'C002', findingId: 'F002', verificationId: 'V002' },
          { candidateEventId: 'EVT-C-2', verificationEventId: 'EVT-V-2', observationEventId: 'EVT-O-2', claimDigest: 'd4', evidenceReceiptRefs: ['E002'], proofWitnessRefs: [], counterevidenceRefs: [], verifierFingerprint: 'd5', assessorFingerprint: 'd6', authorityValidationEventId: 'EVT-AV-2', applicabilityDecisionId: 'EVT-AD-2', subjectSnapshotDigest: GENESIS_HASH, finalSeverity: 'P0', impact: 0.9, confidence: 0.9, outcome: 'accepted', transition: 'candidate-to-finding', adjudicationDigest: 'adj-d2', predecessorAdjudicationEventId: null }),
      ];

      const surface = createDeepAlignmentStateDeltasProjectionContract();
      const folded = foldLegacyProjectionSurface(surface, events, fakeHead('deep-alignment-ledger'));
      const writtenPaths = folded.map((a) => writeArtifact(specFolder, a));

      writeFileSync(join(alignmentDir, 'deep-alignment-config.json'), JSON.stringify({
        alignmentTarget: 'gate-reader-proof', lanes: [PROOF_LANE],
      }));

      let readOk = true;
      let readDetail = '';
      try {
        const result = reduceAlignmentState(specFolder, { write: false });
        if (result.hasCorruption) {
          readOk = false;
          readDetail = `reduceAlignmentState: hasCorruption=true, warnings=${JSON.stringify(result.corruptionWarnings)}`;
        } else {
          readDetail = `reduceAlignmentState: hasCorruption=false, lanes=${result.registry.lanes.length}`;
        }
      } catch (e) {
        readOk = false;
        readDetail = `reduceAlignmentState threw: ${e.message}`;
      }
      results.push({ mode: 'deep-alignment', reader: 'scripts/reduce-alignment-state.cjs#reduceAlignmentState', status: readOk ? 'pass' : 'fail', detail: readDetail });
    }
  } finally {
    // Clean up all temp dirs so the working tree is not dirtied.
    while (scratchDirs.length > 0) {
      const dir = scratchDirs.pop();
      if (dir) rmSync(dir, { recursive: true, force: true });
    }
  }

  const failures = results.filter((r) => r.status === 'fail');
  const notRun = results.filter((r) => r.status === 'not-run');
  const passed = results.filter((r) => r.status === 'pass');

  if (notRun.length > 0) {
    return {
      id: 'reader-contracts',
      description: 'End-to-end reader contract per mode (real ledger-projected read)',
      status: 'not-run',
      detail: `${notRun.length} mode(s) have no real read path: ${notRun.map((r) => r.mode).join(', ')} — stopping for the orchestrator`,
      results,
    };
  }
  if (failures.length > 0) {
    return {
      id: 'reader-contracts',
      description: 'End-to-end reader contract per mode (real ledger-projected read)',
      status: 'fail',
      detail: `${failures.length} of ${results.length} mode(s) failed: ${failures.map((r) => `${r.mode} (${r.detail})`).join('; ')}`,
      results,
    };
  }
  return {
    id: 'reader-contracts',
    description: 'End-to-end reader contract per mode (real ledger-projected read)',
    status: 'pass',
    detail: `all ${passed.length} modes read cleanly via their real consumers${READER_CONTRACT_CORRUPT_INJECT ? ' [CORRUPT-INJECT was true but no failure observed — check the toggle]' : ''}`,
    results,
  };
}

// check 6 — the only check here that exercises the runtime end to end rather
// than reading a captured artifact, so it is the one that would notice the write
// path breaking in a way unit tests do not. A summary is a claim, so the check
// also requires observed iteration content before believing it: a summary that
// declares success while the lineage produced no iteration file would otherwise
// pass, and the check would be reporting a self-declared success rather than
// observed work.
function checkFanoutRealRun() {
  const summaryPath = join(SCRIPT_DIR, 'fanout-proof/research/orchestration-summary.json');
  const iterationPath = join(
    SCRIPT_DIR,
    'fanout-proof/research/lineages/ds-flash-min/iterations/iteration-001.md'
  );

  let summary;
  try {
    summary = JSON.parse(readFileSync(summaryPath, 'utf8'));
  } catch (e) {
    return {
      id: 'fanout-real-run',
      description: 'Real fan-out dispatch produced observed lineage work',
      status: 'fail',
      detail: `summary unreadable (${summaryPath}): ${e.message}`,
    };
  }

  if (typeof summary.total !== 'number' || summary.total < 1) {
    return {
      id: 'fanout-real-run',
      description: 'Real fan-out dispatch produced observed lineage work',
      status: 'fail',
      detail: `summary.total < 1 (got ${summary.total})`,
    };
  }
  if (typeof summary.succeeded !== 'number' || summary.succeeded < 1) {
    return {
      id: 'fanout-real-run',
      description: 'Real fan-out dispatch produced observed lineage work',
      status: 'fail',
      detail: `summary.succeeded < 1 (got ${summary.succeeded})`,
    };
  }
  if (summary.failed !== 0) {
    return {
      id: 'fanout-real-run',
      description: 'Real fan-out dispatch produced observed lineage work',
      status: 'fail',
      detail: `summary.failed !== 0 (got ${summary.failed})`,
    };
  }
  if (summary.all_failed !== false) {
    return {
      id: 'fanout-real-run',
      description: 'Real fan-out dispatch produced observed lineage work',
      status: 'fail',
      detail: `summary.all_failed !== false (got ${summary.all_failed})`,
    };
  }
  if (!Array.isArray(summary.orphaned_lineages) || summary.orphaned_lineages.length !== 0) {
    return {
      id: 'fanout-real-run',
      description: 'Real fan-out dispatch produced observed lineage work',
      status: 'fail',
      detail: `orphaned_lineages not an empty array (got ${JSON.stringify(summary.orphaned_lineages)})`,
    };
  }

  let iterSize;
  try {
    iterSize = statSync(iterationPath).size;
  } catch (e) {
    return {
      id: 'fanout-real-run',
      description: 'Real fan-out dispatch produced observed lineage work',
      status: 'fail',
      detail: `iteration artifact unreadable (${iterationPath}): ${e.message}`,
    };
  }
  if (!(iterSize > 0)) {
    return {
      id: 'fanout-real-run',
      description: 'Real fan-out dispatch produced observed lineage work',
      status: 'fail',
      detail: `iteration artifact empty or zero-size (${iterationPath}, size ${iterSize})`,
    };
  }

  return {
    id: 'fanout-real-run',
    description: 'Real fan-out dispatch produced observed lineage work',
    status: 'pass',
    detail:
      `run_id ${summary.run_id}: total ${summary.total}, succeeded ${summary.succeeded}, ` +
      `failed ${summary.failed}, all_failed ${summary.all_failed}, orphaned ${summary.orphaned_lineages.length}; ` +
      `iteration artifact ${iterationPath} size ${iterSize}`,
  };
}

// ---------------------------------------------------------------- verdict

function computeVerdict(checks) {
  // `error` outranks `fail`: while a check is broken the gate cannot claim to
  // have measured the system at all, and repairing the harness has to happen
  // before any verdict about the system is worth reading. Each check keeps its
  // own status in the table, so a real failure alongside an error stays visible.
  const anyError = checks.some((c) => c.status === 'error');
  if (anyError) return 'ERROR';
  const anyFail = checks.some((c) => c.status === 'fail');
  if (anyFail) return 'FAIL';
  const anyNotRun = checks.some((c) => c.status === 'not-run');
  if (anyNotRun) return 'INCOMPLETE';
  return 'PASS';
}

// ---------------------------------------------------------------- receipt writers

function truncate(s, n) {
  if (s === null || s === undefined) return '';
  const str = String(s);
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

function writeReceipts(outDir, receipt) {
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n', 'utf8');

  const lines = [];
  lines.push('# Whole-System Gate Receipt');
  lines.push('');
  lines.push(`- Candidate SHA: \`${receipt.candidateSha}\``);
  lines.push(`- Baseline SHA: \`${receipt.baselineSha}\``);
  lines.push(`- Generated: ${receipt.generatedAt}`);
  if (receipt.forcedBreak) lines.push(`- Forced break: \`${receipt.forcedBreak}\``);
  lines.push('');
  lines.push('| Check | Status | Detail |');
  lines.push('| --- | --- | --- |');
  for (const c of receipt.checks) {
    lines.push(`| ${c.id} | ${c.status} | ${truncate(c.detail, 120).replace(/\|/g, '\\|')} |`);
  }
  lines.push('');
  if (receipt.suite && receipt.suite.delta) {
    const d = receipt.suite.delta;
    lines.push('## Suite delta (candidate − baseline)');
    lines.push('');
    lines.push(`- failed: ${d.failed >= 0 ? '+' : ''}${d.failed}`);
    lines.push(`- passed: ${d.passed >= 0 ? '+' : ''}${d.passed}`);
    lines.push(`- skipped: ${d.skipped >= 0 ? '+' : ''}${d.skipped}`);
    lines.push(`- total: ${d.total >= 0 ? '+' : ''}${d.total}`);
    lines.push(`- files: ${d.files >= 0 ? '+' : ''}${d.files}`);
    lines.push('');
  } else {
    lines.push('## Suite delta');
    lines.push('');
    lines.push('Suite logs unavailable; no delta computed.');
    lines.push('');
  }
  lines.push(`## Verdict: **${receipt.verdict}**`);
  lines.push('');
  writeFileSync(join(outDir, 'receipt.md'), lines.join('\n') + '\n', 'utf8');
}

// ---------------------------------------------------------------- main

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = args.out ? resolve(args.out) : SCRIPT_DIR;
  const forcedBreak = args['break'] || null;

  // SHAs are resolved by executing git even when a flag is supplied, so the
  // receipt always names a commit git itself verified exists in this repo.
  const candidateSha = resolveSha(args.candidate || 'HEAD');
  const baselineSha = resolveSha(args.baseline || DEFAULT_BASELINE_REF);

  const checks = [];
  let suite = { baseline: null, candidate: null, delta: null };

  // check 1
  try {
    checks.push(checkTreeClean(forcedBreak));
  } catch (e) {
    checks.push({ id: 'tree-clean', description: 'Working tree is clean', status: 'error', detail: e.message });
  }

  // check 2
  try {
    checks.push(checkCandidateFrozen(candidateSha, forcedBreak));
  } catch (e) {
    checks.push({ id: 'candidate-frozen', description: 'Candidate runtime tree matches the measured tree', status: 'error', detail: e.message });
  }

  // check 3
  try {
    const r = await checkAuthorityState();
    checks.push(r);
  } catch (e) {
    checks.push({ id: 'authority-state', description: 'Every mode authority is on new_authoritative_reversible or new_authoritative_final', status: 'error', detail: e.message });
  }

  // check 4
  try {
    const r = checkRuntimeSuite();
    checks.push(r);
    if (r.suite) suite = r.suite;
  } catch (e) {
    checks.push({ id: 'runtime-suite', description: 'Candidate suite failures <= baseline (read from captured logs)', status: 'error', detail: e.message });
  }

  // check 5
  try {
    checks.push(checkConsumerReachability());
  } catch (e) {
    checks.push({ id: 'consumer-reachability', description: 'Every listed consumer script exists on disk and can be started', status: 'error', detail: e.message });
  }

  // check — end-to-end reader contract per mode, immediately after consumer-reachability
  try {
    checks.push(await checkReaderContracts());
  } catch (e) {
    checks.push({ id: 'reader-contracts', description: 'End-to-end reader contract per mode (real ledger-projected read)', status: 'error', detail: e.message });
  }

  // check 6 — always not-run
  checks.push(checkFanoutRealRun());

  const verdict = computeVerdict(checks);

  const receipt = {
    generatedAt: new Date().toISOString(),
    candidateSha,
    baselineSha,
    forcedBreak,
    verdict,
    checks: checks.map((c) => ({
      id: c.id,
      description: c.description,
      status: c.status,
      detail: c.detail,
      // Per-mode authority states are carried verbatim, not folded into the
      // summary line. A count says how many modes are on legacy; only the
      // records say which, and a partially-flipped fleet is exactly the state
      // where that difference decides what is safe to do next.
      ...(c.records ? { records: c.records } : {}),
    })),
    suite,
  };

  // Always write the receipt before exiting, in every verdict branch. A gate
  // that only writes on success is not a gate.
  try {
    writeReceipts(outDir, receipt);
  } catch (e) {
    // Even the writer can fail (e.g. out dir unwritable). Print and exit non-zero
    // so the failure is never silent, but still attempt to report the verdict.
    console.error(`receipt write failed: ${e.message}`);
    process.exit(1);
  }

  console.log(`verdict: ${verdict}`);
  // 0 pass, 1 measured failure, 2 incomplete, 3 broken harness.
  process.exit(verdict === 'PASS' ? 0 : verdict === 'FAIL' ? 1 : verdict === 'INCOMPLETE' ? 2 : 3);
}

main().catch((e) => {
  // Last-resort: an unexpected throw outside any check's try/catch. Still try
  // to leave a receipt so the failure is legible rather than a bare stack.
  try {
    const receipt = {
      generatedAt: new Date().toISOString(),
      candidateSha: null,
      baselineSha: null,
      forcedBreak: null,
      verdict: 'FAIL',
      checks: [],
      suite: { baseline: null, candidate: null, delta: null },
      fatal: e.message,
    };
    const outDir = parseArgs(process.argv.slice(2)).out || SCRIPT_DIR;
    writeReceipts(resolve(outDir), receipt);
  } catch {
    /* nothing more we can do */
  }
  console.error(`gate fatal: ${e.message}`);
  process.exit(1);
});
