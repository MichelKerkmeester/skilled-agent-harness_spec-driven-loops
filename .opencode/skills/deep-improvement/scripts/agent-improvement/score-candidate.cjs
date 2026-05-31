// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Candidate Scorer — 5-Dimension Evaluation Framework                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// Usage:
//   node score-candidate.cjs --candidate=<path> [--baseline=<path>] [--output=<path>]
//
// When --baseline is present, the scorer evaluates both files and emits:
//   baselineScore: weighted baseline score
//   delta: total and per-dimension candidate-minus-baseline score deltas
//   thresholdDelta: comparison threshold from --thresholdDelta, manifest scoring,
//     or the default value of 2.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const {
  ERROR_TYPES,
  EXIT_CODES,
  makeTypedError,
  parseTypedError,
  serializeTypedError,
} = require('../lib/typed-errors.cjs');
const {
  WEIGHTED_SCORE_GATE,
  PROMOTION_GATES,
  evaluatePromotionGates,
} = require('../lib/promotion-gates.cjs');

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

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

// 015 P2 (dedup): dedupe the repeated infra-failure emission. Each early-exit failure site built the
// same infra_failure object and ran the identical outputPath/writeJson/stdout/exit branch.
// emitInfraFailure centralizes the standard fields plus the write-or-stdout + exit code,
// taking only the per-site variable fields.
function emitInfraFailure(outputPath, fields) {
  const failure = {
    status: 'infra_failure',
    evaluationMode: 'dynamic-5d',
    mode: 'agent-improvement',
    ...fields,
  };
  if (outputPath) {
    writeJson(outputPath, failure);
  } else {
    process.stdout.write(`${JSON.stringify(failure, null, 2)}\n`);
  }
  process.exit(1);
}

function stableJson(value) {
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableJson(entry)).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

function stripVolatileFields(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => stripVolatileFields(entry));
  }
  if (value && typeof value === 'object') {
    const result = {};
    for (const [key, entry] of Object.entries(value)) {
      if (key === 'timestamp' || key === 'generatedAt') {
        continue;
      }
      result[key] = stripVolatileFields(entry);
    }
    return result;
  }
  return value;
}

function safeRead(filePath) {
  try {
    return readUtf8(filePath);
  } catch (error) {
    return { error: error.message };
  }
}

function stripJsonComments(content) {
  return content
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
}

function loadManifest(manifestPath) {
  if (!manifestPath) {
    return null;
  }
  const raw = safeRead(manifestPath);
  if (typeof raw !== 'string') {
    return { error: raw.error };
  }
  try {
    return JSON.parse(stripJsonComments(raw));
  } catch (error) {
    return { error: `Manifest parse failed: ${error.message}` };
  }
}

function inferProfileId(targetPath, explicitProfile, manifest) {
  if (explicitProfile) {
    return explicitProfile;
  }
  const manifestTarget = manifest?.targets?.find((entry) => entry.path === targetPath);
  if (manifestTarget?.profileId) {
    return manifestTarget.profileId;
  }
  return 'dynamic';
}

function inferFamily(profileId, manifest, targetPath) {
  const manifestTarget = manifest?.targets?.find((entry) => entry.path === targetPath);
  if (manifestTarget?.family) {
    return manifestTarget.family;
  }
  return profileId;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DYNAMIC 5-DIMENSION SCORING
// ─────────────────────────────────────────────────────────────────────────────

const DIMENSION_WEIGHTS = {
  structural: 0.20,
  ruleCoherence: 0.25,
  integration: 0.25,
  outputQuality: 0.15,
  systemFitness: 0.15,
};

const RUBRIC_VERSION = 'dynamic-5d/p126-reproducibility-v1';

// F-P1-11: scope the score cache under a packet-local directory rather than a shared,
// world-writable os.tmpdir() location whose contents are trusted before rescoring.
// Prefer the --output directory (the canonical packet-local outputs dir), then the
// candidate's own directory; only fall back to os.tmpdir() when neither is available.
function defaultCacheDir({ outputPath, candidatePath } = {}) {
  const anchorDir = outputPath
    ? path.dirname(path.resolve(outputPath))
    : candidatePath
      ? path.dirname(path.resolve(candidatePath))
      : null;
  if (anchorDir) {
    return path.join(anchorDir, '.score-cache');
  }
  return path.join(os.tmpdir(), 'deep-improvement-score-cache');
}

function computeInputHash(input) {
  return crypto
    .createHash('sha256')
    .update(stableJson(input))
    .digest('hex');
}

function cachePathFor(cacheDir, inputHash) {
  return path.join(cacheDir, `${inputHash}.json`);
}

// F017-P2-10 (017 review): the filename is the only thing binding a cache entry to its
// inputHash. Treat the embedded blob as untrusted on read: require cached.inputHash to
// equal the recomputed inputHash AND a scored status. Any mismatch (tampered or stale
// blob, wrong-key file dropped into the cache dir, parse failure) is a cache MISS so the
// caller recomputes rather than trusting an unverified payload.
function readCachedScore(cacheDir, inputHash) {
  const cachePath = cachePathFor(cacheDir, inputHash);
  if (!fs.existsSync(cachePath)) {
    return null;
  }
  let cached;
  try {
    cached = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  } catch (_err) {
    return null;
  }
  if (!cached || typeof cached !== 'object') {
    return null;
  }
  if (cached.inputHash !== inputHash || cached.status !== 'scored') {
    return null;
  }
  return cached;
}

function writeCachedScore(cacheDir, inputHash, result) {
  writeJson(cachePathFor(cacheDir, inputHash), result);
}

function runScript(scriptName, args) {
  const scriptPath = path.join(__dirname, scriptName);
  try {
    const out = execFileSync('node', [scriptPath, ...args], { encoding: 'utf8', timeout: 15000 });
    try {
      return JSON.parse(out);
    } catch (err) {
      return serializeTypedError(makeTypedError(ERROR_TYPES.PARSE_ERROR, `Failed to parse ${scriptName} output: ${err.message}`, { scriptName }));
    }
  } catch (err) {
    const childError = parseTypedError(err.stderr);
    if (childError) {
      return childError;
    }
    const errorType = err.status === EXIT_CODES[ERROR_TYPES.FILE_NOT_FOUND]
      ? ERROR_TYPES.FILE_NOT_FOUND
      : ERROR_TYPES.SCRIPT_CRASH;
    return serializeTypedError(makeTypedError(errorType, `${scriptName} failed: ${err.message}`, { scriptName, status: err.status || null }));
  }
}

function scoreDimStructural(profile, content) {
  const checks = profile.derivedChecks?.structural || [];
  if (checks.length === 0) { return { score: null, details: [], maxPossible: 0, unscored: true }; }
  const maxPossible = checks.reduce((s, c) => s + c.weight, 0);
  let earned = 0;
  const details = [];
  for (const check of checks) {
    const sectionName = check.description.replace('Agent has ', '').replace(' section', '').toUpperCase();
    const pass = new RegExp(`## \\d+\\.\\s+.*${sectionName.split(' ')[0]}`, 'i').test(content);
    if (pass) { earned += check.weight; }
    details.push({ id: check.id, pass, weight: check.weight });
  }
  return { score: maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100, details, maxPossible };
}

function scoreDimRuleCoherence(profile, content) {
  const rules = profile.derivedChecks?.ruleCoherence || [];
  if (rules.length === 0) { return { score: null, details: [], maxPossible: 0, unscored: true }; }
  const lower = content.toLowerCase();
  const maxPossible = rules.reduce((s, r) => s + r.weight, 0);
  let earned = 0;
  const details = [];
  for (const rule of rules) {
    const keywords = rule.rule.toLowerCase().split(/\s+/).filter((w) => w.length > 3).slice(0, 4);
    const matchCount = keywords.filter((kw) => lower.includes(kw)).length;
    const pass = keywords.length > 0 && matchCount >= Math.ceil(keywords.length * 0.5);
    if (pass) { earned += rule.weight; }
    details.push({ id: rule.id, type: rule.type, rule: rule.rule, pass, matchRatio: keywords.length > 0 ? matchCount / keywords.length : 0 });
  }
  return { score: maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100, details, maxPossible };
}

function analyzeRuntimeMirrorCoverage(report) {
  const mirrors = Array.isArray(report?.surfaces?.mirrors) ? report.surfaces.mirrors : [];
  const expectedCount = 4;
  const consideredCount = mirrors.length;
  const passed = consideredCount === expectedCount;
  return {
    checkpoint: 'runtime-mirror-coverage-considered',
    expectedCount,
    consideredCount,
    passed,
    paths: mirrors.map((mirror) => mirror.path).filter(Boolean),
    warning: passed
      ? null
      : `Expected ${expectedCount} runtime mirrors to be considered; saw ${consideredCount}`,
  };
}

function scoreDimIntegration(agentName, integrationReport) {
  const report = integrationReport || runScript('scan-integration.cjs', [`--agent=${agentName}`]);
  if (!report || report.status !== 'complete') {
    const runtimeMirrorCoverage = analyzeRuntimeMirrorCoverage(report);
    return {
      score: 0,
      details: [
        { id: 'scanner-failed', pass: false },
        { id: 'runtime-mirror-coverage-considered', pass: false, ...runtimeMirrorCoverage },
      ],
      maxPossible: 100,
      runtimeMirrorCoverage,
    };
  }
  const summary = report.summary;
  let mirrorScore = 100;
  for (const m of report.surfaces?.mirrors || []) {
    // F017-P2-06 (017 review): read mirror.status || mirror.syncStatus so this
    // lane normalizes the same field run-benchmark.cjs scoreIntegration does. The
    // scan-integration scanner emits syncStatus, so for every real input m.status
    // is undefined and this is byte-identical to reading m.syncStatus directly; the
    // fallback only removes the cross-lane field asymmetry the review flagged.
    const mStatus = m.status || m.syncStatus;
    if (mStatus === 'diverged') { mirrorScore -= 20; }
    else if (mStatus === 'missing') { mirrorScore -= 30; }
  }
  mirrorScore = Math.max(0, mirrorScore);
  const commandScore = summary.commandCount > 0 ? 100 : 0;
  const skillScore = summary.skillCount > 0 ? 100 : 0;
  const score = Math.round(mirrorScore * 0.6 + commandScore * 0.2 + skillScore * 0.2);
  return {
    score,
    details: [
      { id: 'mirror-parity', pass: mirrorScore === 100, score: mirrorScore },
      { id: 'command-coverage', pass: commandScore > 0, count: summary.commandCount },
      { id: 'skill-coverage', pass: skillScore > 0, count: summary.skillCount },
      { id: 'runtime-mirror-coverage-considered', pass: analyzeRuntimeMirrorCoverage(report).passed, ...analyzeRuntimeMirrorCoverage(report) },
    ],
    maxPossible: 100,
    raw: { mirrorScore, commandScore, skillScore, mirrorStatus: summary.mirrorSyncStatus },
    runtimeMirrorCoverage: analyzeRuntimeMirrorCoverage(report),
  };
}

function scoreDimOutputQuality(profile, content) {
  const checks = profile.derivedChecks?.outputChecks || [];
  if (checks.length === 0) { return { score: null, details: [], maxPossible: 0, unscored: true }; }
  const lower = content.toLowerCase();
  const maxPossible = checks.reduce((s, c) => s + c.weight, 0);
  let earned = 0;
  const details = [];
  for (const check of checks) {
    const keywords = check.check.toLowerCase().split(/\s+/).filter((w) => w.length > 3).slice(0, 3);
    const pass = keywords.length > 0 && keywords.filter((kw) => lower.includes(kw)).length >= Math.ceil(keywords.length * 0.5);
    if (pass) { earned += check.weight; }
    details.push({ id: check.id, pass, check: check.check });
  }
  // Penalty for placeholder content
  const placeholders = (content.match(/\[YOUR_VALUE_HERE\]|\[TODO\]|\[TBD\]|\[PLACEHOLDER\]/gi) || []).length;
  const placeholderPenalty = Math.min(30, placeholders * 10);
  const raw = maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100;
  return { score: Math.max(0, raw - placeholderPenalty), details, maxPossible, placeholders };
}

// F017-P2-13b (017 review): command/skill refs come from candidate-derived profile
// content, then get interpolated into fs.existsSync paths below. Without a charset guard
// a hostile ref (e.g. a skill "../../etc" or a command "/../../secret") turns
// resource-refs-valid into a traversal-based existence oracle and perturbs the score.
// Restrict each ref segment to a basename charset (mirrors run-benchmark SAFE_FIXTURE_ID)
// and reject '.'/'..' / separators before the ref ever reaches the filesystem. A command
// ref maps ':' to a path separator, so it is validated per segment after that split.
const SAFE_REF_SEGMENT = /^[A-Za-z0-9._-]+$/;

function isSafeRefSegment(segment) {
  return (
    typeof segment === 'string'
    && segment.length > 0
    && segment !== '.'
    && segment !== '..'
    && SAFE_REF_SEGMENT.test(segment)
  );
}

function isSafeCommandRef(cmd) {
  if (typeof cmd !== 'string' || cmd.length === 0) {
    return false;
  }
  const stripped = cmd.replace(/^\//, '');
  const segments = stripped.split(':');
  return segments.length > 0 && segments.every(isSafeRefSegment);
}

function scoreDimSystemFitness(profile, content) {
  const details = [];
  let earned = 0;
  let maxPossible = 0;

  // Check permission-capability alignment
  const mismatches = profile.derivedChecks?.capabilityMismatches || [];
  maxPossible += 40;
  if (mismatches.length === 0) {
    earned += 40;
    details.push({ id: 'perm-capability-align', pass: true });
  } else {
    details.push({ id: 'perm-capability-align', pass: false, mismatches });
  }

  // Check for orphaned resource references
  const integration = profile.derivedChecks?.integrationPoints || {};
  const commands = integration.commands || [];
  const skills = integration.skills || [];
  maxPossible += 30;
  let refsValid = 0;
  let refsTotal = 0;
  for (const cmd of commands) {
    refsTotal++;
    if (!isSafeCommandRef(cmd)) { continue; }
    const cmdPath = cmd.replace(/^\//, '').replace(/:/g, '/');
    if (fs.existsSync(`.opencode/commands/${cmdPath}.md`)) { refsValid++; }
  }
  for (const sk of skills) {
    refsTotal++;
    if (!isSafeRefSegment(sk)) { continue; }
    if (fs.existsSync(`.opencode/skills/${sk}/SKILL.md`)) { refsValid++; }
  }
  const refScore = refsTotal > 0 ? Math.round(30 * refsValid / refsTotal) : 30;
  earned += refScore;
  details.push({ id: 'resource-refs-valid', pass: refsValid === refsTotal, valid: refsValid, total: refsTotal });

  // Check frontmatter completeness
  maxPossible += 30;
  const hasFrontmatter = /^---\n[\s\S]*?\n---/.test(content);
  const hasName = /^name:\s+\S/m.test(content);
  const hasMode = /^mode:\s+\S/m.test(content);
  const hasPermission = /^permission:\s*$/m.test(content);
  const fmScore = [hasFrontmatter, hasName, hasMode, hasPermission].filter(Boolean).length * 7.5;
  earned += fmScore;
  details.push({ id: 'frontmatter-complete', pass: fmScore >= 30, score: fmScore });

  return { score: maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100, details, maxPossible };
}

function scoreDynamic(candidateContent, agentName, profile, weights, integrationReport) {
  // Accept optional weights override; fall back to hardcoded defaults for backward compat
  const effectiveWeights = weights || DIMENSION_WEIGHTS;

  const structural = scoreDimStructural(profile, candidateContent);
  const ruleCoherence = scoreDimRuleCoherence(profile, candidateContent);
  const integration = scoreDimIntegration(agentName, integrationReport);
  const outputQuality = scoreDimOutputQuality(profile, candidateContent);
  const systemFitness = scoreDimSystemFitness(profile, candidateContent);

  const dimensions = [
    { name: 'structural', score: structural.score, weight: effectiveWeights.structural, details: structural.details, maxPossible: structural.maxPossible },
    { name: 'ruleCoherence', score: ruleCoherence.score, weight: effectiveWeights.ruleCoherence, details: ruleCoherence.details, maxPossible: ruleCoherence.maxPossible },
    { name: 'integration', score: integration.score, weight: effectiveWeights.integration, details: integration.details, maxPossible: integration.maxPossible },
    { name: 'outputQuality', score: outputQuality.score, weight: effectiveWeights.outputQuality, details: outputQuality.details, maxPossible: outputQuality.maxPossible },
    { name: 'systemFitness', score: systemFitness.score, weight: effectiveWeights.systemFitness, details: systemFitness.details, maxPossible: systemFitness.maxPossible },
  ];

  const unscoredDimensions = dimensions
    .filter((d) => d.score === null)
    .map((d) => d.name);
  const weightedScore = unscoredDimensions.length > 0
    ? null
    : Math.round(dimensions.reduce((sum, d) => sum + d.score * d.weight, 0));

  return {
    weightedScore,
    dimensions,
    unscoredDimensions,
    runtimeMirrorCoverage: integration.runtimeMirrorCoverage,
  };
}

function dimensionDelta(candidateDimensions, baselineDimensions) {
  const baselineByName = new Map((baselineDimensions || []).map((entry) => [entry.name, entry]));
  return (candidateDimensions || []).map((entry) => {
    const baseline = baselineByName.get(entry.name);
    return {
      name: entry.name,
      score: entry.score,
      baselineScore: baseline ? baseline.score : null,
      delta: baseline && entry.score !== null && baseline.score !== null ? entry.score - baseline.score : null,
      weight: entry.weight,
    };
  });
}

function resolveThresholdDelta(args, manifest) {
  const raw = args.thresholdDelta ?? manifest?.scoring?.thresholdDelta ?? manifest?.scoring?.minimumDelta ?? 2;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 2;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const candidatePath = args.candidate;
  const baselinePath = args.baseline;
  const manifestPath = args.manifest;
  const targetPath = args.target || candidatePath;
  const outputPath = args.output;
  const cacheDisabled = args['no-cache'] === true || args['no-cache'] === 'true';
  const cacheDir = path.resolve(
    args['cache-dir'] || defaultCacheDir({ outputPath, candidatePath }),
  );

  if (!candidatePath) {
    process.stderr.write('Missing required --candidate argument\n');
    process.exit(2);
  }

  const candidateContent = safeRead(candidatePath);
  if (typeof candidateContent !== 'string') {
    emitInfraFailure(outputPath, {
      profileId: args.profile || null,
      family: null,
      target: targetPath,
      candidate: candidatePath,
      error: candidateContent.error,
      failureModes: ['profile-generation-failure'],
    });
  }

  // Dynamic mode is the only evaluation path. generate-profile.cjs + 5-dimension scoring.
  const manifest = loadManifest(manifestPath);
  if (manifest && manifest.error) {
    emitInfraFailure(outputPath, {
      profileId: args.profile || null,
      family: null,
      target: targetPath,
      candidate: candidatePath,
      error: manifest.error,
      failureModes: ['manifest-parse-failure'],
    });
  }

  const profile = runScript('generate-profile.cjs', [`--agent=${candidatePath}`]);
  if (!profile || !profile.id) {
    emitInfraFailure(outputPath, {
      target: targetPath,
      candidate: candidatePath,
      error: profile?.message || 'Failed to generate dynamic profile',
      errorType: profile?.errorType || 'UNKNOWN',
      failureModes: [`profile-generation-${(profile?.errorType || 'failure').toLowerCase()}`],
    });
  }

  const manifestProfileId = inferProfileId(targetPath, args.profile, manifest);
  const resolvedProfileId = manifestProfileId !== 'dynamic' ? manifestProfileId : profile.id;
  const family = inferFamily(resolvedProfileId, manifest, targetPath);
  const agentName = profile.id;

  // Accept optional --weights=<json> to override DIMENSION_WEIGHTS
  let weightsOverride = null;
  if (args.weights) {
    try {
      weightsOverride = JSON.parse(args.weights);
    } catch (_err) {
      process.stderr.write('Warning: failed to parse --weights JSON, using defaults\n');
    }
  }
  const candidateIntegrationReport = runScript('scan-integration.cjs', [`--agent=${agentName}`]);

  let baselineResult = null;
  let baselineProfile = null;
  let baselineContent = null;
  let baselineIntegrationReport = null;
  let delta = null;
  let baselineScore = null;
  const thresholdDelta = resolveThresholdDelta(args, manifest);

  if (baselinePath) {
    baselineContent = safeRead(baselinePath);
    if (typeof baselineContent !== 'string') {
      emitInfraFailure(outputPath, {
        profileId: args.profile || null,
        family: null,
        target: targetPath,
        candidate: candidatePath,
        baseline: baselinePath,
        error: baselineContent.error,
        failureModes: ['baseline-read-failure'],
      });
    }

    baselineProfile = runScript('generate-profile.cjs', [`--agent=${baselinePath}`]);
    if (!baselineProfile || !baselineProfile.id) {
      emitInfraFailure(outputPath, {
        target: targetPath,
        candidate: candidatePath,
        baseline: baselinePath,
        error: baselineProfile?.message || 'Failed to generate dynamic profile for baseline',
        errorType: baselineProfile?.errorType || 'UNKNOWN',
        failureModes: [`baseline-profile-generation-${(baselineProfile?.errorType || 'failure').toLowerCase()}`],
      });
    }

    baselineIntegrationReport = runScript('scan-integration.cjs', [`--agent=${baselineProfile.id}`]);
  }

  const effectiveWeights = weightsOverride || DIMENSION_WEIGHTS;
  const inputHash = computeInputHash({
    rubricVersion: RUBRIC_VERSION,
    // F-P1-12: bind candidate identity into the cache key. Previously the hash covered
    // candidateContent + targetPath but not the candidate/baseline paths, so a stale
    // cache entry for one candidate could be served for a different candidate whose
    // content/profile happened to hash the same. Keying on the paths makes a mismatch
    // miss the cache and rescore. Score/dimension outputs for a given candidate path are
    // unchanged (paths are part of the key, not the scoring math).
    candidatePath,
    baselinePath: baselinePath || null,
    candidateContent,
    baselineContent: typeof baselineContent === 'string' ? baselineContent : null,
    targetPath,
    manifest: manifest || null,
    profile: stripVolatileFields(profile),
    baselineProfile: stripVolatileFields(baselineProfile),
    dimensionConfig: {
      weights: effectiveWeights,
      promotionGates: PROMOTION_GATES,
    },
    integrationReports: {
      candidate: stripVolatileFields(candidateIntegrationReport),
      baseline: stripVolatileFields(baselineIntegrationReport),
    },
  });

  if (!cacheDisabled) {
    const cached = readCachedScore(cacheDir, inputHash);
    if (cached) {
      if (outputPath) {
        writeJson(outputPath, cached);
      } else {
        process.stdout.write(`${JSON.stringify(cached, null, 2)}\n`);
      }
      return;
    }
  }

  const dynamicResult = scoreDynamic(candidateContent, agentName, profile, weightsOverride, candidateIntegrationReport);

  if (baselinePath) {
    baselineResult = scoreDynamic(baselineContent, baselineProfile.id, baselineProfile, weightsOverride, baselineIntegrationReport);
    baselineScore = baselineResult.weightedScore;
    delta = {
      total: dynamicResult.weightedScore !== null && baselineResult.weightedScore !== null
        ? dynamicResult.weightedScore - baselineResult.weightedScore
        : null,
      dimensions: dimensionDelta(dynamicResult.dimensions, baselineResult.dimensions),
    };
  }

  const hasUnscoredDimensions = dynamicResult.unscoredDimensions.length > 0;
  const recommendation = hasUnscoredDimensions
    ? 'needs-improvement'
    : baselineResult
      ? (delta.total >= thresholdDelta
        ? 'candidate-better'
        : (dynamicResult.weightedScore >= WEIGHTED_SCORE_GATE ? 'candidate-acceptable' : 'keep-baseline'))
      : (dynamicResult.weightedScore >= WEIGHTED_SCORE_GATE ? 'candidate-acceptable' : 'needs-improvement');
  const promotionGateResult = evaluatePromotionGates(dynamicResult.dimensions);
  const warnings = [];
  if (dynamicResult.runtimeMirrorCoverage && !dynamicResult.runtimeMirrorCoverage.passed) {
    warnings.push(dynamicResult.runtimeMirrorCoverage.warning);
  }

  const result = {
    status: 'scored',
    rubricVersion: RUBRIC_VERSION,
    inputHash,
    profileId: resolvedProfileId,
    family: family || profile.family,
    evaluationMode: 'dynamic-5d',
    mode: 'agent-improvement',
    target: targetPath,
    candidate: candidatePath,
    baseline: baselinePath || null,
    score: dynamicResult.weightedScore,
    baselineScore,
    delta,
    thresholdDelta,
    dimensions: dynamicResult.dimensions,
    unscoredDimensions: dynamicResult.unscoredDimensions,
    runtimeMirrorCoverage: dynamicResult.runtimeMirrorCoverage,
    promotionGates: promotionGateResult,
    recommendation,
    warnings,
    failureModes: [
      ...dynamicResult.unscoredDimensions.map((name) => `unscored-${name}`),
      ...warnings.map(() => 'runtime-mirror-coverage-warning'),
      ...dynamicResult.dimensions
        .filter((d) => typeof d.score === 'number' && d.score < 60)
        .map((d) => `weak-${d.name}`),
    ],
  };

  if (!cacheDisabled) {
    writeCachedScore(cacheDir, inputHash, result);
  }

  if (outputPath) {
    writeJson(outputPath, result);
  } else {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  }
}

main();
