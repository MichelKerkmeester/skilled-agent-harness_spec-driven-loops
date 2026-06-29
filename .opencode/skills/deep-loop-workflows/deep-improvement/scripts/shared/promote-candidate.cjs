// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ promote-candidate — guarded canonical promotion helper                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const {
  BENCHMARK_AGGREGATE_GATE,
  PROMOTION_GATES,
  WEIGHTED_SCORE_GATE,
  evaluateMirrorSyncGate,
  evaluatePromotionGates,
} = require('../lib/promotion-gates.cjs');
const {
  inferAgentNameFromPath,
  verifyMirrorSync,
} = require('../lib/mirror-sync-verify.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PROMOTION_PHASES = Object.freeze({
  promote: 'promote',
  accept: 'accept',
  ship: 'ship',
});

const DEFAULT_BRANCH_PRESERVATION_POLICY = 'preserve-on-failure';

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (const entry of argv) {
    if (!entry.startsWith('--')) {
      continue;
    }
    const [key, ...rest] = entry.slice(2).split('=');
    args[key] = rest.length > 0 ? rest.join('=') : true;
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readOptionalJson(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }
  return readJson(filePath);
}

function readJsonc(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw.replace(/^\s*\/\/.*$/gm, ''));
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeJson(filePath, data) {
  ensureParent(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function appendJsonl(filePath, data) {
  ensureParent(filePath);
  fs.appendFileSync(filePath, `${JSON.stringify(data)}\n`, 'utf8');
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function safeTimestamp() {
  return new Date().toISOString().replace(/[:]/g, '-');
}

function normalizePhase(value) {
  const phase = value || PROMOTION_PHASES.promote;
  if (!Object.values(PROMOTION_PHASES).includes(phase)) {
    process.stderr.write(`Usage error: --phase must be one of ${Object.values(PROMOTION_PHASES).join(', ')}\n`);
    process.exit(2);
  }
  return phase;
}

function currentGitBranch() {
  try {
    const branch = execFileSync('git', ['branch', '--show-current'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return branch || null;
  } catch (error) {
    return null;
  }
}

function resolveBranchPreservationPolicy(config) {
  return config?.branchPreservationPolicy || DEFAULT_BRANCH_PRESERVATION_POLICY;
}

function resolvePreservedBranch(args, config, acceptedState = null) {
  const configuredBranch = config?.promotion?.preservedBranch;
  const explicitBranch = args['preserved-branch'] || args.branch || acceptedState?.preservedBranch || configuredBranch;
  if (explicitBranch && explicitBranch !== true) {
    return explicitBranch;
  }
  return currentGitBranch();
}

function resolveEventLogPath(args, config) {
  return args['event-log']
    || args['state-file']
    || config?.promotion?.eventLog
    || config?.journal?.path
    || null;
}

function emitBlockedBranchPreserved(eventLogPath, blockedContext, message, details = {}) {
  if (!eventLogPath || blockedContext.phase === PROMOTION_PHASES.promote) {
    return;
  }
  if (blockedContext.branchPreservationPolicy !== DEFAULT_BRANCH_PRESERVATION_POLICY) {
    return;
  }
  appendJsonl(eventLogPath, {
    type: 'promotion_blocked_branch_preserved',
    eventType: 'promotion_blocked_branch_preserved',
    timestamp: new Date().toISOString(),
    phase: blockedContext.phase,
    target: blockedContext.target,
    candidate: blockedContext.candidate,
    acceptanceFile: blockedContext.acceptanceFile || null,
    preservedBranch: blockedContext.preservedBranch || null,
    branchPreservationPolicy: blockedContext.branchPreservationPolicy,
    message,
    details,
  });
}

function readAcceptanceState(filePath) {
  if (!filePath) {
    return null;
  }
  return readJson(filePath);
}

function resolveAcceptanceFilePath(args, archiveDir, target, timestamp) {
  if (args['acceptance-file'] && args['acceptance-file'] !== true) {
    return args['acceptance-file'];
  }
  return path.join(archiveDir, `${path.basename(target)}.${timestamp}.accepted.json`);
}

function createAcceptanceState(context) {
  const timestamp = safeTimestamp();
  const targetBase = path.basename(context.target);
  const candidateBase = path.basename(context.candidate);
  const preAcceptBackupPath = path.join(context.archiveDir, `${targetBase}.${timestamp}.preaccept.bak`);
  const candidateSnapshotPath = path.join(context.archiveDir, `${candidateBase}.${timestamp}.accepted`);
  const acceptanceFile = resolveAcceptanceFilePath(context.args, context.archiveDir, context.target, timestamp);

  fs.copyFileSync(context.target, preAcceptBackupPath);
  fs.copyFileSync(context.candidate, candidateSnapshotPath);

  const acceptedState = {
    status: 'accepted',
    phase: PROMOTION_PHASES.accept,
    target: context.target,
    candidate: context.candidate,
    candidateSnapshotPath,
    preAcceptBackupPath,
    preAcceptTargetHash: sha256File(preAcceptBackupPath),
    candidateHash: sha256File(candidateSnapshotPath),
    preservedBranch: context.preservedBranch || null,
    branchPreservationPolicy: context.branchPreservationPolicy,
    archiveDir: context.archiveDir,
    scorePath: context.scorePath || null,
    benchmarkReportPath: context.benchmarkReportPath,
    repeatabilityReportPath: context.resolvedRepeatabilityReportPath,
    configPath: context.configPath,
    manifestPath: context.manifestPath,
    acceptedAt: new Date().toISOString(),
  };
  writeJson(acceptanceFile, acceptedState);
  return { acceptanceFile, acceptedState };
}

function assertShipPreconditions(acceptedState, context, failGate) {
  if (!acceptedState || acceptedState.status !== 'accepted') {
    failGate('Cannot ship: acceptance file is not in accepted state', {
      errorType: 'acceptance_state_invalid',
    });
  }

  const expectedTargetHash = acceptedState.preAcceptTargetHash;
  if (expectedTargetHash && !fs.existsSync(context.target)) {
    if (acceptedState.preAcceptBackupPath && fs.existsSync(acceptedState.preAcceptBackupPath)) {
      fs.copyFileSync(acceptedState.preAcceptBackupPath, context.target);
    }
    failGate('Cannot ship: canonical target missing after acceptance; restored pre-acceptance target', {
      errorType: 'canonical_target_missing',
      expectedHash: expectedTargetHash,
      restoredFrom: acceptedState.preAcceptBackupPath || null,
    });
  }

  if (expectedTargetHash && fs.existsSync(context.target) && sha256File(context.target) !== expectedTargetHash) {
    if (acceptedState.preAcceptBackupPath && fs.existsSync(acceptedState.preAcceptBackupPath)) {
      fs.copyFileSync(acceptedState.preAcceptBackupPath, context.target);
    }
    failGate('Cannot ship: canonical target changed after acceptance; restored pre-acceptance target', {
      errorType: 'canonical_target_changed',
      expectedHash: expectedTargetHash,
      restoredFrom: acceptedState.preAcceptBackupPath || null,
    });
  }

  const shipCandidate = acceptedState.candidateSnapshotPath || context.candidate;
  if (!fs.existsSync(shipCandidate)) {
    failGate(`Cannot ship: accepted candidate snapshot not found: ${shipCandidate}`, {
      errorType: 'missing-accepted-candidate',
    });
  }

  if (acceptedState.candidateHash && sha256File(shipCandidate) !== acceptedState.candidateHash) {
    failGate('Cannot ship: accepted candidate snapshot hash changed after acceptance', {
      errorType: 'accepted_candidate_changed',
    });
  }

  return shipCandidate;
}

// Dual-shape contract: current producers always emit the primitive number shape;
// the object shape ({value}) is legacy-tolerated. New score producers MUST emit
// a number.
function readScoreDelta(score) {
  if (score && typeof score.delta === 'object' && score.delta !== null) {
    return score.delta.total;
  }
  return score ? score.delta : null;
}

function finiteNumberOrNull(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function hasBenchmarkDeltaContract(report) {
  return Object.prototype.hasOwnProperty.call(report, 'outcomeScoreDelta')
    || Object.prototype.hasOwnProperty.call(report?.totals || {}, 'outcomeScoreDelta')
    || Array.isArray(report.fixtureDeltas);
}

function readOutcomeScoreDelta(report) {
  return finiteNumberOrNull(report.outcomeScoreDelta ?? report.totals?.outcomeScoreDelta);
}

function hurtFixtureDeltas(report) {
  if (!Array.isArray(report.fixtureDeltas)) {
    return [];
  }
  return report.fixtureDeltas.filter((entry) => {
    const delta = finiteNumberOrNull(entry?.delta);
    return entry?.hurt === true || (delta !== null && delta < 0);
  });
}

function isAgentDefinitionTarget(target) {
  const normalized = (path.isAbsolute(target) ? path.relative(process.cwd(), target) : target)
    .split(path.sep)
    .join('/');
  return /^(\.\/)?\.(opencode|claude)\/agents\/[^/]+\.md$/.test(normalized)
    || /^(\.\/)?\.codex\/agents\/[^/]+\.toml$/.test(normalized);
}

function expectedFormatForTarget(target) {
  const normalized = (path.isAbsolute(target) ? path.relative(process.cwd(), target) : target)
    .split(path.sep)
    .join('/');
  return normalized.includes('.codex/agents/') ? 'codex-toml' : 'markdown';
}

function writeMirrorSyncState(stateFilePath, state) {
  if (!stateFilePath) {
    return;
  }
  const payload = {
    type: 'mirror_sync_state',
    timestamp: new Date().toISOString(),
    ...state,
  };
  if (stateFilePath.endsWith('.jsonl')) {
    appendJsonl(stateFilePath, payload);
  } else {
    writeJson(stateFilePath, payload);
  }
}

function rejectWithStructuredError(errorType, message, details, stateFilePath, blockedContext, eventLogPath) {
  if (details?.mirror_sync_state) {
    writeMirrorSyncState(stateFilePath, details);
  }
  if (blockedContext && eventLogPath) {
    emitBlockedBranchPreserved(eventLogPath, blockedContext, message, { errorType, ...details });
  }
  process.stderr.write(`${JSON.stringify({
    status: 'error',
    errorType,
    message,
    details,
  }, null, 2)}\n`);
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VALIDATION CHECKS
// ─────────────────────────────────────────────────────────────────────────────

function resolveAllowedCanonicalTarget(manifestPath) {
  const manifest = readJsonc(manifestPath);
  const canonicalTargets = (manifest.targets || [])
    .filter((target) => target.classification === 'canonical')
    .map((target) => target.path);
  if (canonicalTargets.length !== 1) {
    throw new Error(`Cannot promote: expected exactly one canonical target in manifest, found ${canonicalTargets.length}`);
  }
  return canonicalTargets[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const phase = normalizePhase(args.phase);
  const acceptedState = phase === PROMOTION_PHASES.ship
    ? readAcceptanceState(args['acceptance-file'])
    : null;
  const candidate = args.candidate || acceptedState?.candidateSnapshotPath || acceptedState?.candidate;
  const target = args.target || acceptedState?.target;
  const scorePath = args.score || acceptedState?.scorePath;
  const benchmarkReportPath = args['benchmark-report'] || acceptedState?.benchmarkReportPath;
  const repeatabilityReportPath = args['repeatability-report'] || acceptedState?.repeatabilityReportPath;
  const configPath = args.config || acceptedState?.configPath;
  const manifestPath = args.manifest || acceptedState?.manifestPath;
  const archiveDir = args['archive-dir'] || acceptedState?.archiveDir;
  const approve = args.approve === true || args.approve === 'true';
  const allowHurtFixtures = args['allow-hurt-fixtures'] === true || args['allow-hurt-fixtures'] === 'true';
  const noBaselineOk = args['no-baseline-ok'] === true || args['no-baseline-ok'] === 'true';

  // Lane B (model-benchmark) produces report.json with
  // status=benchmark-complete and never a scored agent file. Promotion mode is
  // therefore selected by the presence of --score: when --score is supplied this
  // is the Lane A agent path (scored candidate + agent dimension gates, byte-
  // behavior unchanged); when --score is omitted and --benchmark-report points at
  // a benchmark-complete + benchmark-pass report this is the Lane B benchmark path,
  // which promotes on benchmark evidence alone and bypasses the agent scored-file
  // requirement and agent dimension gates. The shared guards (config promotion
  // flags, benchmark/repeatability gates, single canonical target, and agent-
  // definition mirror sync) apply to both modes.
  const benchmarkMode = !scorePath;

  if (!candidate || !target || !benchmarkReportPath || !configPath || !manifestPath || !archiveDir || !approve) {
    process.stderr.write('Usage (Lane A / agent): node promote-candidate.cjs --phase=accept|ship --candidate=... --target=... --score=... --benchmark-report=... [--repeatability-report=...] --config=... --manifest=... --archive-dir=... --approve [--acceptance-file=...] [--event-log=...] [--allow-hurt-fixtures] [--no-baseline-ok]\n');
    process.stderr.write('Usage (Lane B / benchmark): node promote-candidate.cjs --phase=accept|ship --candidate=... --target=... --benchmark-report=... [--repeatability-report=...] --config=... --manifest=... --archive-dir=... --approve [--acceptance-file=...] [--event-log=...] [--allow-hurt-fixtures] [--no-baseline-ok]\n');
    process.exit(2);
  }

  const score = benchmarkMode ? null : readJson(scorePath);
  const benchmarkReport = readJson(benchmarkReportPath);
  const resolvedRepeatabilityReportPath = repeatabilityReportPath || path.join(path.dirname(benchmarkReportPath), 'repeatability.json');
  const repeatabilityReport = readOptionalJson(resolvedRepeatabilityReportPath);
  const config = readJson(configPath);
  const branchPreservationPolicy = resolveBranchPreservationPolicy(config);
  const preservedBranch = resolvePreservedBranch(args, config, acceptedState);
  const eventLogPath = resolveEventLogPath(args, config);
  const mirrorStateFilePath = args['state-file'] || config?.promotion?.mirrorSyncStateFile || null;
  const blockedContext = {
    phase,
    target,
    candidate,
    acceptanceFile: args['acceptance-file'] || null,
    preservedBranch,
    branchPreservationPolicy,
  };
  const failGate = (message, details = {}) => {
    emitBlockedBranchPreserved(eventLogPath, blockedContext, message, details);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  };
  let allowedCanonicalTarget;
  try {
    allowedCanonicalTarget = resolveAllowedCanonicalTarget(manifestPath);
  } catch (error) {
    failGate(error.message, { errorType: 'boundary_gate_failed' });
  }
  const threshold = Number(config?.scoring?.thresholdDelta ?? 1);
  const proposalOnly = config?.proposalOnly;
  const promotionEnabled = config?.promotionEnabled;
  if (!benchmarkMode && score.status !== 'scored') {
    failGate('Cannot promote: score file is not in scored state', { errorType: 'score_gate_failed' });
  }

  if (proposalOnly !== false) {
    failGate('Cannot promote: runtime config is still in proposal-only mode', { errorType: 'config_gate_failed' });
  }

  if (promotionEnabled !== true) {
    failGate('Cannot promote: promotionEnabled is not true in runtime config', { errorType: 'config_gate_failed' });
  }

  if (config?.target && target !== config.target) {
    failGate(`Cannot promote: target ${target} does not match runtime config target ${config.target}`, { errorType: 'config_gate_failed' });
  }

  if (config?.targetProfile && benchmarkReport.profileId !== config.targetProfile) {
    failGate(`Cannot promote: benchmark profile ${benchmarkReport.profileId} does not match runtime config target profile ${config.targetProfile}`, { errorType: 'benchmark_gate_failed' });
  }

  if (benchmarkReport.status !== 'benchmark-complete') {
    failGate('Cannot promote: benchmark report is not in benchmark-complete state', { errorType: 'benchmark_gate_failed' });
  }

  if (benchmarkReport.target !== target) {
    failGate(`Cannot promote: benchmark report target ${benchmarkReport.target} does not match requested target ${target}`, { errorType: 'benchmark_gate_failed' });
  }

  if (benchmarkReport.recommendation !== 'benchmark-pass') {
    failGate(`Cannot promote: benchmark recommendation is ${benchmarkReport.recommendation}`, { errorType: 'benchmark_gate_failed' });
  }

  if (Number(benchmarkReport.aggregateScore || 0) < BENCHMARK_AGGREGATE_GATE) {
    failGate(`Cannot promote: benchmark aggregate ${benchmarkReport.aggregateScore} below gate ${BENCHMARK_AGGREGATE_GATE}`, { errorType: 'benchmark_gate_failed' });
  }

  const benchmarkHasDeltaContract = hasBenchmarkDeltaContract(benchmarkReport);
  const outcomeScoreDelta = readOutcomeScoreDelta(benchmarkReport);
  if (benchmarkHasDeltaContract && outcomeScoreDelta === null && !noBaselineOk) {
    failGate('Cannot promote: outcomeScoreDelta is undefined because a baseline score is missing; pass --no-baseline-ok only when this is explicitly reviewed', { errorType: 'benchmark_gate_failed' });
  }

  if (outcomeScoreDelta !== null && outcomeScoreDelta < 0) {
    failGate(`Cannot promote: regression: outcomeScoreDelta < 0 (${outcomeScoreDelta})`, { errorType: 'benchmark_gate_failed' });
  }

  const hurtFixtures = hurtFixtureDeltas(benchmarkReport);
  if (hurtFixtures.length > 0 && !allowHurtFixtures) {
    const fixtureIds = hurtFixtures.map((entry) => entry.id || 'unknown').join(', ');
    failGate(`Cannot promote: hurt fixtures detected (${fixtureIds}); pass --allow-hurt-fixtures only when this trade-off is explicitly reviewed`, { errorType: 'benchmark_gate_failed' });
  }

  if (!repeatabilityReport) {
    failGate(`Cannot promote: repeatability report not found at ${resolvedRepeatabilityReportPath}`, { errorType: 'repeatability_gate_failed' });
  }

  if (repeatabilityReport.profileId !== benchmarkReport.profileId) {
    failGate(`Cannot promote: repeatability profile ${repeatabilityReport.profileId} does not match benchmark profile ${benchmarkReport.profileId}`, { errorType: 'repeatability_gate_failed' });
  }

  if (repeatabilityReport.passed !== true) {
    failGate('Cannot promote: repeatability check did not pass', { errorType: 'repeatability_gate_failed' });
  }

  if (!fs.existsSync(candidate)) {
    rejectWithStructuredError('missing-candidate', `Cannot promote: candidate file not found: ${candidate}`, {}, mirrorStateFilePath, blockedContext, eventLogPath);
  }

  // The optimizer must never alter the scoring surface it is being measured by.
  const allowRubricEdit = args['allow-rubric-edit'] === true || args['allow-rubric-edit'] === 'true';
  if (fs.existsSync(target) && fs.existsSync(candidate)) {
    const { rubricMutated } = require('./rubric-guard.cjs');
    const verdict = rubricMutated(fs.readFileSync(target, 'utf8'), fs.readFileSync(candidate, 'utf8'));
    if (verdict.mutated && !allowRubricEdit) {
      rejectWithStructuredError(
        'rubric-mutation',
        'Cannot promote: candidate mutates the target\'s own scoring-relevant regions (rubric/floors/gates). '
        + 'Re-run with --allow-rubric-edit only if a rubric change is the explicit, reviewed intent.',
        { baselineRegions: verdict.baselineRegions, candidateRegions: verdict.candidateRegions },
        mirrorStateFilePath,
        blockedContext,
        eventLogPath,
      );
    }
  }

  if (target !== allowedCanonicalTarget) {
    failGate(`Cannot promote: target ${target} is not the single allowed canonical target ${allowedCanonicalTarget}`, { errorType: 'boundary_gate_failed' });
  }

  // The agent scored-file gates (candidate-better
  // recommendation, weighted score gate, 5-dimension gates, score delta) only
  // apply to Lane A. Lane B has no scored agent file, so it promotes on the
  // benchmark report gates verified above (benchmark-complete + benchmark-pass +
  // aggregate gate + repeatability) and skips these agent-only checks.
  let scoreDelta = null;
  if (!benchmarkMode) {
    if (score.recommendation !== 'candidate-better') {
      failGate(`Cannot promote: recommendation is ${score.recommendation}`, { errorType: 'score_gate_failed' });
    }

    if (Number(score.score || 0) < WEIGHTED_SCORE_GATE) {
      failGate(`Cannot promote: score ${score.score} below weighted gate ${WEIGHTED_SCORE_GATE}`, { errorType: 'score_gate_failed' });
    }

    const dimensionGate = evaluatePromotionGates(score.dimensions);
    if (!dimensionGate.passed) {
      failGate(`Cannot promote: dimension gates failed ${dimensionGate.failed.concat(dimensionGate.unscored).join(', ')}; thresholds ${JSON.stringify(PROMOTION_GATES)}`, { errorType: 'dimension_gate_failed' });
    }

    scoreDelta = readScoreDelta(score);
    if (Number(scoreDelta || 0) < threshold) {
      failGate(`Cannot promote: delta ${scoreDelta} below threshold ${threshold}`, { errorType: 'score_gate_failed' });
    }
  }

  let runtimeMirrorSync = null;
  if (isAgentDefinitionTarget(target)) {
    const agentName = inferAgentNameFromPath(target);
    // Pre-mutation invariant: verify the runtime mirrors against the CURRENT
    // canonical body (the state being replaced), not the candidate. Comparing
    // against the candidate flags every real body change as drift and blocks
    // legitimate in-sync promotions; only genuine mirror drift should block.
    const canonicalContent = fs.existsSync(target)
      ? fs.readFileSync(target, 'utf8')
      : fs.readFileSync(candidate, 'utf8');
    const syncResult = verifyMirrorSync(agentName, canonicalContent, {
      repoRoot: process.cwd(),
      expectedFormat: expectedFormatForTarget(target),
    });
    const mirrorGate = evaluateMirrorSyncGate(syncResult);
    runtimeMirrorSync = mirrorGate.result;

    if (!mirrorGate.passed) {
      rejectWithStructuredError(
        'MIRROR_SYNC_GATE_FAILED',
        'Cannot promote: 4-runtime agent mirror sync verification failed',
        {
          target,
          candidate,
          agentName,
          mirror_sync_state: mirrorGate.mirror_sync_state,
          recoveryAction: mirrorGate.recoveryAction,
          defaultRecovery: 'rollback partial mirrors before resume to maintain 4-runtime invariant',
          presentRuntimes: syncResult.presentRuntimes,
          missingRuntimes: syncResult.missingRuntimes,
          driftRuntimes: syncResult.driftRuntimes,
          verification: syncResult,
        },
        mirrorStateFilePath,
        blockedContext,
        eventLogPath,
      );
    }

    writeMirrorSyncState(mirrorStateFilePath, {
      target,
      candidate,
      agentName,
      mirror_sync_state: mirrorGate.mirror_sync_state,
      recoveryAction: mirrorGate.recoveryAction,
      defaultRecovery: null,
      verification: syncResult,
    });
  }

  ensureParent(path.join(archiveDir, 'placeholder'));
  if (phase === PROMOTION_PHASES.accept) {
    const acceptance = createAcceptanceState({
      args,
      target,
      candidate,
      archiveDir,
      scorePath,
      benchmarkReportPath,
      resolvedRepeatabilityReportPath,
      configPath,
      manifestPath,
      preservedBranch,
      branchPreservationPolicy,
    });
    const result = {
      status: 'accepted',
      phase,
      mode: benchmarkMode ? 'benchmark' : 'agent',
      target,
      candidate,
      acceptanceFile: acceptance.acceptanceFile,
      candidateSnapshotPath: acceptance.acceptedState.candidateSnapshotPath,
      preAcceptBackupPath: acceptance.acceptedState.preAcceptBackupPath,
      preservedBranch,
      branchPreservationPolicy,
      benchmarkReport: benchmarkReportPath,
      repeatabilityReport: resolvedRepeatabilityReportPath,
      runtimeMirrors: runtimeMirrorSync,
      mirror_sync_state: runtimeMirrorSync ? 'all_landed' : null,
      timestamp: acceptance.acceptedState.acceptedAt,
    };
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  const timestamp = safeTimestamp();
  const backupPath = path.join(archiveDir, `${path.basename(target)}.${timestamp}.bak`);

  let promotedCandidate = candidate;
  let effectiveBackupPath = backupPath;
  if (phase === PROMOTION_PHASES.ship) {
    promotedCandidate = assertShipPreconditions(acceptedState, {
      target,
      candidate,
    }, failGate);
    effectiveBackupPath = acceptedState.preAcceptBackupPath || backupPath;
    try {
      fs.copyFileSync(promotedCandidate, target);
    } catch (error) {
      if (effectiveBackupPath && fs.existsSync(effectiveBackupPath)) {
        fs.copyFileSync(effectiveBackupPath, target);
      }
      failGate(`Cannot ship: mutation failed: ${error.message}`, {
        errorType: 'mutation_failed',
        restoredFrom: effectiveBackupPath || null,
      });
    }
  } else {
    fs.copyFileSync(target, backupPath);
    fs.copyFileSync(candidate, target);
  }

  // Lane A output shape is unchanged (byte-behavior
  // contract). Lane B emits mode=benchmark plus the benchmark aggregate/delta so
  // the promotion result is self-describing for the model-benchmark loop.
  const result = phase === PROMOTION_PHASES.ship
    ? {
        status: 'shipped',
        phase,
        mode: benchmarkMode ? 'benchmark' : 'agent',
        target,
        candidate: promotedCandidate,
        acceptanceFile: args['acceptance-file'],
        backupPath: effectiveBackupPath,
        preservedBranch,
        branchPreservationPolicy,
        benchmarkReport: benchmarkReportPath,
        repeatabilityReport: resolvedRepeatabilityReportPath,
        runtimeMirrors: runtimeMirrorSync,
        mirror_sync_state: runtimeMirrorSync ? 'all_landed' : null,
        timestamp: new Date().toISOString(),
      }
    : benchmarkMode
    ? {
        status: 'promoted',
        mode: 'benchmark',
        target,
        candidate,
        backupPath: effectiveBackupPath,
        benchmarkReport: benchmarkReportPath,
        repeatabilityReport: resolvedRepeatabilityReportPath,
        runtimeMirrors: runtimeMirrorSync,
        mirror_sync_state: runtimeMirrorSync ? 'all_landed' : null,
        aggregateScore: benchmarkReport.aggregateScore,
        benchmarkDelta: benchmarkReport.totals?.delta ?? null,
        outcomeScoreDelta: benchmarkHasDeltaContract ? outcomeScoreDelta : null,
        fixtureDeltaSummary: benchmarkReport.fixtureDeltaSummary || benchmarkReport.totals?.fixtureDeltaSummary || null,
        recommendation: benchmarkReport.recommendation,
        timestamp: new Date().toISOString(),
      }
    : {
        status: 'promoted',
        target,
        candidate,
        backupPath: effectiveBackupPath,
        benchmarkReport: benchmarkReportPath,
        repeatabilityReport: resolvedRepeatabilityReportPath,
        runtimeMirrors: runtimeMirrorSync,
        mirror_sync_state: runtimeMirrorSync ? 'all_landed' : null,
        delta: scoreDelta,
        threshold,
        timestamp: new Date().toISOString(),
      };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main();
