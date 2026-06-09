// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ promote-candidate — guarded canonical promotion helper                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');
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
// 2. HELPERS
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

function readScoreDelta(score) {
  if (score && typeof score.delta === 'object' && score.delta !== null) {
    return score.delta.total;
  }
  return score ? score.delta : null;
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

function rejectWithStructuredError(errorType, message, details, stateFilePath) {
  if (details?.mirror_sync_state) {
    writeMirrorSyncState(stateFilePath, details);
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
// 3. VALIDATION CHECKS
// ─────────────────────────────────────────────────────────────────────────────

function resolveAllowedCanonicalTarget(manifestPath) {
  const manifest = readJsonc(manifestPath);
  const canonicalTargets = (manifest.targets || [])
    .filter((target) => target.classification === 'canonical')
    .map((target) => target.path);
  if (canonicalTargets.length !== 1) {
    process.stderr.write(`Cannot promote: expected exactly one canonical target in manifest, found ${canonicalTargets.length}\n`);
    process.exit(1);
  }
  return canonicalTargets[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const candidate = args.candidate;
  const target = args.target;
  const scorePath = args.score;
  const benchmarkReportPath = args['benchmark-report'];
  const repeatabilityReportPath = args['repeatability-report'];
  const configPath = args.config;
  const manifestPath = args.manifest;
  const archiveDir = args['archive-dir'];
  const approve = args.approve === true || args.approve === 'true';

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
    process.stderr.write('Usage (Lane A / agent): node promote-candidate.cjs --candidate=... --target=... --score=... --benchmark-report=... [--repeatability-report=...] --config=... --manifest=... --archive-dir=... --approve\n');
    process.stderr.write('Usage (Lane B / benchmark): node promote-candidate.cjs --candidate=... --target=... --benchmark-report=... [--repeatability-report=...] --config=... --manifest=... --archive-dir=... --approve\n');
    process.exit(2);
  }

  const score = benchmarkMode ? null : readJson(scorePath);
  const benchmarkReport = readJson(benchmarkReportPath);
  const resolvedRepeatabilityReportPath = repeatabilityReportPath || path.join(path.dirname(benchmarkReportPath), 'repeatability.json');
  const repeatabilityReport = readOptionalJson(resolvedRepeatabilityReportPath);
  const config = readJson(configPath);
  const mirrorStateFilePath = args['state-file'] || config?.promotion?.mirrorSyncStateFile || null;
  const allowedCanonicalTarget = resolveAllowedCanonicalTarget(manifestPath);
  const threshold = Number(config?.scoring?.thresholdDelta ?? 1);   // iter-8 review: honor an explicit 0
  const proposalOnly = config?.proposalOnly;
  const promotionEnabled = config?.promotionEnabled;
  if (!benchmarkMode && score.status !== 'scored') {
    process.stderr.write('Cannot promote: score file is not in scored state\n');
    process.exit(1);
  }

  if (proposalOnly !== false) {
    process.stderr.write('Cannot promote: runtime config is still in proposal-only mode\n');
    process.exit(1);
  }

  if (promotionEnabled !== true) {
    process.stderr.write('Cannot promote: promotionEnabled is not true in runtime config\n');
    process.exit(1);
  }

  if (config?.target && target !== config.target) {
    process.stderr.write(`Cannot promote: target ${target} does not match runtime config target ${config.target}\n`);
    process.exit(1);
  }

  if (config?.targetProfile && benchmarkReport.profileId !== config.targetProfile) {
    process.stderr.write(`Cannot promote: benchmark profile ${benchmarkReport.profileId} does not match runtime config target profile ${config.targetProfile}\n`);
    process.exit(1);
  }

  if (benchmarkReport.status !== 'benchmark-complete') {
    process.stderr.write('Cannot promote: benchmark report is not in benchmark-complete state\n');
    process.exit(1);
  }

  if (benchmarkReport.target !== target) {
    process.stderr.write(`Cannot promote: benchmark report target ${benchmarkReport.target} does not match requested target ${target}\n`);
    process.exit(1);
  }

  if (benchmarkReport.recommendation !== 'benchmark-pass') {
    process.stderr.write(`Cannot promote: benchmark recommendation is ${benchmarkReport.recommendation}\n`);
    process.exit(1);
  }

  if (Number(benchmarkReport.aggregateScore || 0) < BENCHMARK_AGGREGATE_GATE) {
    process.stderr.write(`Cannot promote: benchmark aggregate ${benchmarkReport.aggregateScore} below gate ${BENCHMARK_AGGREGATE_GATE}\n`);
    process.exit(1);
  }

  if (!repeatabilityReport) {
    process.stderr.write(`Cannot promote: repeatability report not found at ${resolvedRepeatabilityReportPath}\n`);
    process.exit(1);
  }

  if (repeatabilityReport.profileId !== benchmarkReport.profileId) {
    process.stderr.write(`Cannot promote: repeatability profile ${repeatabilityReport.profileId} does not match benchmark profile ${benchmarkReport.profileId}\n`);
    process.exit(1);
  }

  if (repeatabilityReport.passed !== true) {
    process.stderr.write('Cannot promote: repeatability check did not pass\n');
    process.exit(1);
  }

  // iter-8 review: a missing candidate or target must fail closed with a structured
  // error, not crash later at copyFileSync.
  if (!fs.existsSync(candidate)) {
    rejectWithStructuredError('missing-candidate', `Cannot promote: candidate file not found: ${candidate}`, {}, mirrorStateFilePath);
  }

  // Spec 143 T2 (rubric guard): the optimizer must never write its own ruler.
  // When the TARGET file contains its own scoring-relevant sections (rubric,
  // floors, quality gates), a candidate that mutates them scores better for
  // free — reject unless the operator explicitly allows a rubric edit.
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
      );
    }
  }

  if (target !== allowedCanonicalTarget) {
    process.stderr.write(`Cannot promote: target ${target} is not the single allowed canonical target ${allowedCanonicalTarget}\n`);
    process.exit(1);
  }

  // The agent scored-file gates (candidate-better
  // recommendation, weighted score gate, 5-dimension gates, score delta) only
  // apply to Lane A. Lane B has no scored agent file, so it promotes on the
  // benchmark report gates verified above (benchmark-complete + benchmark-pass +
  // aggregate gate + repeatability) and skips these agent-only checks.
  let scoreDelta = null;
  if (!benchmarkMode) {
    if (score.recommendation !== 'candidate-better') {
      process.stderr.write(`Cannot promote: recommendation is ${score.recommendation}\n`);
      process.exit(1);
    }

    if (Number(score.score || 0) < WEIGHTED_SCORE_GATE) {
      process.stderr.write(`Cannot promote: score ${score.score} below weighted gate ${WEIGHTED_SCORE_GATE}\n`);
      process.exit(1);
    }

    const dimensionGate = evaluatePromotionGates(score.dimensions);
    if (!dimensionGate.passed) {
      process.stderr.write(`Cannot promote: dimension gates failed ${dimensionGate.failed.concat(dimensionGate.unscored).join(', ')}; thresholds ${JSON.stringify(PROMOTION_GATES)}\n`);
      process.exit(1);
    }

    scoreDelta = readScoreDelta(score);
    if (Number(scoreDelta || 0) < threshold) {
      process.stderr.write(`Cannot promote: delta ${scoreDelta} below threshold ${threshold}\n`);
      process.exit(1);
    }
  }

  let runtimeMirrorSync = null;
  if (isAgentDefinitionTarget(target)) {
    const agentName = inferAgentNameFromPath(target);
    const candidateContent = fs.readFileSync(candidate, 'utf8');
    const syncResult = verifyMirrorSync(agentName, candidateContent, {
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
        mirrorStateFilePath
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
  const timestamp = new Date().toISOString().replace(/[:]/g, '-');
  const backupPath = path.join(archiveDir, `${path.basename(target)}.${timestamp}.bak`);

  fs.copyFileSync(target, backupPath);
  fs.copyFileSync(candidate, target);

  // Lane A output shape is unchanged (byte-behavior
  // contract). Lane B emits mode=benchmark plus the benchmark aggregate/delta so
  // the promotion result is self-describing for the model-benchmark loop.
  const result = benchmarkMode
    ? {
        status: 'promoted',
        mode: 'benchmark',
        target,
        candidate,
        backupPath,
        benchmarkReport: benchmarkReportPath,
        repeatabilityReport: resolvedRepeatabilityReportPath,
        runtimeMirrors: runtimeMirrorSync,
        mirror_sync_state: runtimeMirrorSync ? 'all_landed' : null,
        aggregateScore: benchmarkReport.aggregateScore,
        benchmarkDelta: benchmarkReport.totals?.delta ?? null,
        recommendation: benchmarkReport.recommendation,
        timestamp: new Date().toISOString(),
      }
    : {
        status: 'promoted',
        target,
        candidate,
        backupPath,
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
