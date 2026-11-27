#!/usr/bin/env node

// ───────────────────────────────────────────────────────────────────
// MODULE: Synthesis Close-Out
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

'use strict';

const {
  existsSync,
  lstatSync,
  readdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} = require('node:fs');
const {
  basename,
  dirname,
  isAbsolute,
  join,
  normalize,
  relative,
  resolve,
  sep,
} = require('node:path');
const {
  latestIterationRecords,
  findingKeys,
  normalizeFindingKey,
} = require('../lib/deep-loop/iteration-findings.cjs');
const { activeReviewSeverityCounts } = require('./review-verdict.cjs');

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

// Per-mode structured finding fields, in the order a record is searched.
const FINDING_FIELDS = Object.freeze({
  research: Object.freeze(['keyFindings', 'findings']),
  review: Object.freeze(['findingDetails']),
});
const REPOSITORY_ROOT = resolve(__dirname, '../../../../..');

const FLAG_KEYS = Object.freeze({
  '--mode': 'mode',
  '--event-dir': 'eventDir',
  '--artifact-dir': 'artifactDir',
  '--state-log': 'stateLog',
  '--registry': 'registry',
  '--output': 'output',
  '--dashboard': 'dashboard',
  '--stop-reason': 'stopReason',
  '--answered-count': 'answeredCount',
  '--total-questions': 'totalQuestions',
  '--active-p0': 'activeP0',
  '--active-p1': 'activeP1',
  '--active-p2': 'activeP2',
  '--dimension-coverage': 'dimensionCoverage',
  '--verdict': 'verdict',
  '--release-readiness-state': 'releaseReadinessState',
});

const PATH_FLAGS = Object.freeze([
  ['eventDir', '--event-dir'],
  ['artifactDir', '--artifact-dir'],
  ['stateLog', '--state-log'],
  ['registry', '--registry'],
  ['output', '--output'],
  ['dashboard', '--dashboard'],
]);

// ───────────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!Object.prototype.hasOwnProperty.call(FLAG_KEYS, token)) {
      throw new Error(token.startsWith('--') ? `unknown flag: ${token}` : `unknown argument: ${token}`);
    }
    const value = argv[index + 1];
    if (value === undefined || value.startsWith('--')) {
      const label = PATH_FLAGS.some(([, flag]) => flag === token)
        ? 'missing required path'
        : 'missing required flag';
      throw new Error(`${label}: ${token}`);
    }
    args[FLAG_KEYS[token]] = value;
    index += 1;
  }
  return args;
}

function assertRequired(args) {
  if (args.mode !== 'research' && args.mode !== 'review') {
    throw new Error(args.mode === undefined ? 'missing required flag: --mode' : `unknown mode: ${args.mode}`);
  }
  for (const [key, flag] of PATH_FLAGS) {
    if (args[key] === undefined || args[key] === '') {
      throw new Error(`missing required path: ${flag}`);
    }
  }
  if (args.stopReason === undefined) {
    throw new Error('missing required flag: --stop-reason');
  }
  const modeFlags = args.mode === 'research'
    ? [['answeredCount', '--answered-count'], ['totalQuestions', '--total-questions']]
    : [
      ['activeP0', '--active-p0'],
      ['activeP1', '--active-p1'],
      ['activeP2', '--active-p2'],
      ['dimensionCoverage', '--dimension-coverage'],
      ['verdict', '--verdict'],
      ['releaseReadinessState', '--release-readiness-state'],
    ];
  for (const [key, flag] of modeFlags) {
    if (args[key] === undefined) {
      throw new Error(`missing required flag: ${flag}`);
    }
  }
}

// A symlink is not a synthesis artifact. Following it would let a file outside
// the run satisfy the close.
function hasFile(filePath) {
  try {
    return existsSync(filePath)
      && !lstatSync(filePath).isSymbolicLink()
      && lstatSync(filePath).isFile();
  } catch {
    return false;
  }
}

function readJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function readJsonl(filePath) {
  if (!hasFile(filePath)) return { records: [], parseFailures: 0 };
  const records = [];
  let parseFailures = 0;
  for (const line of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      records.push(JSON.parse(trimmed));
    } catch {
      parseFailures += 1;
    }
  }
  return { records, parseFailures };
}


// Lineage logs are the iteration record when a run fans out. The root log then
// holds compatibility rows, so it is read only when no lineage log exists.
function lineageStateLogs(artifactDir, mode) {
  const lineagesDir = join(artifactDir, 'lineages');
  if (!existsSync(lineagesDir)) return [];
  if (lstatSync(lineagesDir).isSymbolicLink() || !lstatSync(lineagesDir).isDirectory()) {
    throw new Error(`lineages must be a real directory: ${lineagesDir}`);
  }
  const root = realpathSync(resolve(artifactDir));
  return readdirSync(lineagesDir, { withFileTypes: true })
    .map((entry) => {
      if (entry.isSymbolicLink()) {
        throw new Error(`lineage must be a real directory: ${join(lineagesDir, entry.name)}`);
      }
      return entry;
    })
    .filter((entry) => entry.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name, undefined, { numeric: true }))
    .flatMap((entry) => {
      const candidate = join(lineagesDir, entry.name, `deep-${mode}-state.jsonl`);
      if (!hasFile(candidate)) return [];
      const candidatePath = realpathSync(candidate);
      const rel = relative(root, candidatePath);
      if (rel === '..' || rel.startsWith(`..${sep}`) || isAbsolute(rel)) {
        throw new Error(`lineage state resolves outside the artifact directory: ${candidate}`);
      }
      return [candidatePath];
    });
}

function countIterationFindings(record, fields) {
  if (!record || record.type !== 'iteration') return 0;
  const numeric = Number(record.findingsCount);
  if (Number.isFinite(numeric) && numeric > 0) return Math.floor(numeric);
  for (const field of fields) {
    if (Array.isArray(record[field])) return record[field].length;
  }
  return 0;
}

// A finding whose refinement target resolves is identified by that target first,
// so it counts once with the finding it sharpens and is present wherever the
// target is.
function collectIterationFindingGroups(record, fields, refinedTarget) {
  if (!record || record.type !== 'iteration') return [];
  const structured = fields
    .map((field) => record[field])
    .find((value) => Array.isArray(value) && value.length > 0);
  if (!Array.isArray(structured)) return [];
  return structured
    .map((finding) => {
      const keys = findingKeys(finding);
      const target = refinedTarget(finding, record);
      const findingId = normalizeFindingKey(finding?.id || finding?.findingId);
      return {
        keys: target ? [target.id, ...keys.filter((key) => key !== target.id)] : keys,
        identityId: target?.id || findingId || keys[0],
        identityFile: target ? target.file : finding?.file || '',
      };
    })
    .filter((group) => group.keys.length > 0);
}

function normalizeFindingPath(value) {
  if (typeof value !== 'string') return '';
  const withoutLocation = value.trim()
    .replace(/\\/g, '/')
    .replace(/:\d+(?:[:-].*)?$/, '');
  if (!withoutLocation) return '';
  const normalized = normalize(withoutLocation).replace(/\\/g, '/');
  if (!isAbsolute(normalized)) return normalized.replace(/^(?:\.\/)+/, '');
  const repositoryRelative = relative(REPOSITORY_ROOT, normalized);
  if (repositoryRelative && repositoryRelative !== '..'
    && !repositoryRelative.startsWith(`..${sep}`) && !isAbsolute(repositoryRelative)) {
    return repositoryRelative.split(sep).join('/');
  }
  return normalized;
}

function registryFindingMatchesIdentity(candidate, findingId, file) {
  if (!candidate || typeof candidate !== 'object') return false;
  const normalizedId = normalizeFindingKey(findingId);
  const candidateId = normalizeFindingKey(candidate.findingId || candidate.id);
  const conflictOf = normalizeFindingKey(candidate._conflictOf);
  if (!normalizedId || (candidateId !== normalizedId && conflictOf !== normalizedId)) return false;
  const expectedPath = normalizeFindingPath(file);
  if (!expectedPath) return true;
  const candidatePath = normalizeFindingPath(candidate.file);
  return Boolean(candidatePath && candidatePath === expectedPath);
}

// Cumulative review snapshots and repeatedFindings (a subset of openFindings) need
// one count per finding identity.
function countDistinctFindings(findings) {
  const identities = new Set();
  let unkeyedCount = 0;
  for (const finding of findings) {
    const identity = findingKeys(finding)[0];
    if (identity) identities.add(identity);
    else unkeyedCount += 1;
  }
  return identities.size + unkeyedCount;
}

function registryEvidence(mode, registry) {
  if (mode === 'research') {
    const present = Array.isArray(registry?.keyFindings);
    return {
      registryFindingCount: present ? countDistinctFindings(registry.keyFindings) : null,
      keys: present ? registry.keyFindings.flatMap(findingKeys) : [],
      missingCode: 'registry_missing_keyFindings',
    };
  }
  const openFindings = Array.isArray(registry?.openFindings) ? registry.openFindings : null;
  const registryFindings = [registry?.openFindings, registry?.resolvedFindings, registry?.repeatedFindings]
    .filter(Array.isArray)
    .flat();
  return {
    registryFindingCount: openFindings === null ? null : countDistinctFindings(registryFindings),
    keys: registryFindings.flatMap(findingKeys),
    missingCode: 'registry_missing_openFindings',
  };
}

// A single-executor review reads one registry, so the counts it reports and the
// counts the registry holds come from the same findings. A flag that disagrees
// would publish a verdict the open findings never supported.
function assertActiveSeverityCounts(registry, boundCounts) {
  const registryCounts = activeReviewSeverityCounts(registry);
  const bound = [
    ['--active-p0', 'P0', boundCounts.P0],
    ['--active-p1', 'P1', boundCounts.P1],
    ['--active-p2', 'P2', boundCounts.P2],
  ];
  for (const [flag, severity, given] of bound) {
    const expected = registryCounts[severity];
    if (given !== expected) {
      throw new Error(`${flag} ${given} does not match the registry's ${expected} active ${severity} findings`);
    }
  }
}

// Count-only rows carry a findingsCount and no structured list. Research
// reconstruction also treats a review-shaped list as structured so those rows
// are not asked to be rebuilt from the count.
function countOnlyFindings(records) {
  return records.reduce((sum, record) => {
    if (!record || record.type !== 'iteration') return sum;
    const structured = [record.keyFindings, record.findings, record.findingDetails]
      .find((value) => Array.isArray(value) && value.length > 0);
    if (structured) return sum;
    return sum + countIterationFindings(record, FINDING_FIELDS.research);
  }, 0);
}

// A run scopes every row it appends by the session id it opened with, so the
// close-out reads that id from the run config instead of the folder the
// artifacts happened to land in. Research records the lineage it inherits
// beside it, review its own session.
function runScope(mode, stateLog) {
  const configName = mode === 'research' ? 'deep-research-config.json' : 'deep-review-config.json';
  const config = readJson(join(dirname(stateLog), configName)) || {};
  const lineage = config.lineage || config;
  const sessionId = lineage.sessionId;
  // A run whose config is missing or unreadable still needs a run-stable id, and
  // the artifact folder name is the only one the state-log path carries.
  const runId = typeof sessionId === 'string' && sessionId !== ''
    ? sessionId
    : basename(dirname(stateLog)) || mode;
  if (mode === 'review') return { runId, sessionId: runId };
  const parentSessionId = typeof lineage.parentSessionId === 'string' && lineage.parentSessionId !== ''
    ? lineage.parentSessionId
    : runId;
  return { runId, lineageId: parentSessionId };
}

// The fan-out runner reads a review lineage's terminal_gates row as its stop and fails a
// lineage that closes out without one. A lineage that counted its iterations to the cap and
// jumped to synthesis never ran that gate, so the close-out refuses here, while the lineage
// can still run the gate, instead of finishing a lineage the runner will reject.
function assertReviewLineageStopGate(mode, stateLog, lineageLogs) {
  if (mode !== 'review' || lineageLogs.length > 0) return;
  const lineageDir = dirname(resolve(stateLog));
  if (basename(dirname(lineageDir)) !== 'lineages') return;
  const hasStopGate = readJsonl(stateLog).records.some((record) => record
    && record.type === 'event'
    && record.event === 'terminal_gates');
  if (hasStopGate) return;
  throw new Error(
    `review lineage ${basename(lineageDir)} holds no terminal_gates row in ${stateLog}: run `
    + 'record_terminal_gates first (terminal-gates.cjs, then its deep_review.terminal_gates_recorded '
    + 'event through the append gateway), then rerun this close-out. The fan-out runner fails a '
    + 'review lineage whose state log holds no terminal stop row.',
  );
}

function buildStem(mode, eventName, scope) {
  const builders = {
    research: (name) => ({
      stem: `deep_research.${name}`,
      scope: { runId: scope.runId, lineageId: scope.lineageId },
    }),
    review: (name) => ({
      stem: `deep_review.${name}`,
      scope: { runId: scope.runId, sessionId: scope.sessionId },
    }),
  };
  return builders[mode](eventName);
}

// The state log is a projection the gateway rebuilds. The staged ledger event
// is what survives the next refresh.
function stage(eventDir, scope, mode, eventRecord) {
  const eventName = eventRecord.event;
  const data = { ...eventRecord };
  delete data.event;
  const built = buildStem(mode, eventName, scope);
  writeFileSync(
    join(eventDir, `${eventName}.json`),
    JSON.stringify({ stem: built.stem, scope: built.scope, data }),
    'utf8',
  );
}

// ───────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

function closeOut(args) {
  const mode = args.mode;
  const fields = FINDING_FIELDS[mode];
  const scope = runScope(mode, args.stateLog);
  const registry = readJson(args.registry);
  const evidence = registryEvidence(mode, registry);
  const reviewRegistryFindings = mode === 'review'
    ? [registry?.openFindings, registry?.resolvedFindings, registry?.repeatedFindings]
      .filter(Array.isArray)
      .flat()
    : [];
  const lineageLogs = lineageStateLogs(args.artifactDir, mode);
  assertReviewLineageStopGate(mode, args.stateLog, lineageLogs);
  const parsedState = (lineageLogs.length > 0 ? lineageLogs : [args.stateLog])
    .map((stateLog) => ({ stateLog, ...readJsonl(stateLog) }))
    .map((entry) => ({ ...entry, records: latestIterationRecords(entry.records) }));
  const stateRecords = parsedState.flatMap((entry) => entry.records.map((record) => ({
    ...record,
    _stateLogPath: entry.stateLog,
  })));
  const stateParseFailureCount = parsedState.reduce((sum, entry) => sum + entry.parseFailures, 0);
  const totalIterations = stateRecords.filter((record) => record && record.type === 'iteration').length;
  const iterationFindingCount = stateRecords.reduce(
    (sum, record) => sum + countIterationFindings(record, fields),
    0,
  );
  const registryFindingKeys = new Set(evidence.keys);
  // The reducer folds a refinement only when the registered target and the
  // refinement identify the same normalized file without conflicting dimensions.
  // Kept refinements must be checked by their own id and location.
  const refinedTarget = (finding, record) => {
    if (mode !== 'review' || !finding || typeof finding !== 'object') return null;
    const targetId = normalizeFindingKey(finding.refines || finding.refinementOf);
    if (!targetId) return null;
    const currentIteration = Number(record?.iteration ?? record?.run);
    const lineage = parsedState.find((entry) => entry.stateLog === record?._stateLogPath);
    const targetStateFinding = lineage?.records
      .filter((candidateRecord) => candidateRecord && candidateRecord.type === 'iteration'
        && Number(candidateRecord.iteration ?? candidateRecord.run) < currentIteration)
      .flatMap((candidateRecord) => fields.flatMap((field) => (
        Array.isArray(candidateRecord[field]) ? candidateRecord[field] : []
      )))
      .find((candidate) => normalizeFindingKey(candidate?.id || candidate?.findingId) === targetId);
    if (!targetStateFinding) return null;
    const target = reviewRegistryFindings.find((candidate) => registryFindingMatchesIdentity(
      candidate,
      targetId,
      targetStateFinding.file,
    ));
    if (!target) return null;
    const targetFile = normalizeFindingPath(targetStateFinding.file || target.file);
    const refinementFile = normalizeFindingPath(finding.file);
    if (targetFile && refinementFile && targetFile !== refinementFile) return null;
    const targetDimensionValue = targetStateFinding.dimension || target.dimension;
    const targetDimension = typeof targetDimensionValue === 'string'
      ? targetDimensionValue.trim().toLowerCase()
      : '';
    const refinementDimension = typeof finding.dimension === 'string'
      ? finding.dimension.trim().toLowerCase()
      : '';
    if (targetDimension && refinementDimension && targetDimension !== refinementDimension) return null;
    return { id: targetId, file: targetStateFinding.file || target.file || '' };
  };
  const identifiableFindingGroups = stateRecords.flatMap(
    (record) => collectIterationFindingGroups(record, fields, refinedTarget),
  );
  const missingStructuredFindingGroups = identifiableFindingGroups
    .filter((group) => {
      const findingId = normalizeFindingKey(group.identityId);
      if (mode === 'review' && findingId) {
        return !reviewRegistryFindings.some((candidate) => registryFindingMatchesIdentity(
          candidate,
          findingId,
          group.identityFile,
        ));
      }
      return !group.keys.some((key) => registryFindingKeys.has(key));
    });
  const missingStructuredFindingCount = countDistinctFindings(
    missingStructuredFindingGroups.map((group) => group.identityId || group.keys[0]),
  );
  const identifiableFindingCount = countDistinctFindings(
    identifiableFindingGroups.map((group) => group.identityId || group.keys[0]),
  );
  // The root dashboard is a single-executor artifact. Fan-out stores one
  // beside each lineage, so it is required only when the close reads the root log.
  const missingArtifacts = [
    ['registry', args.registry],
    [mode, args.output],
    ...(lineageLogs.length > 0 ? [] : [['dashboard', args.dashboard]]),
  ].filter(([, filePath]) => !hasFile(filePath)).map(([name, filePath]) => ({ name, path: filePath }));

  const invariantFailures = [];
  if (missingArtifacts.length > 0) invariantFailures.push('missing_synthesis_artifacts');
  if (stateParseFailureCount > 0) invariantFailures.push('state_jsonl_parse_failure');
  if (evidence.registryFindingCount === null) invariantFailures.push(evidence.missingCode);
  if (iterationFindingCount > 0 && (evidence.registryFindingCount ?? 0) === 0) {
    invariantFailures.push('state_findings_not_reflected_in_registry');
  }
  if (
    identifiableFindingCount > 0
    && evidence.registryFindingCount !== null
    && evidence.registryFindingCount < identifiableFindingCount
  ) {
    invariantFailures.push('structured_state_findings_partially_reflected_in_registry');
  }
  if (missingStructuredFindingCount > 0) {
    invariantFailures.push('structured_state_findings_missing_from_registry');
  }

  const counts = {
    totalIterations,
    registryFindingCount: evidence.registryFindingCount,
    iterationFindingCount,
    identifiableFindingCount,
    missingStructuredFindingCount,
    stateParseFailureCount,
    missingArtifacts,
    invariantFailures,
  };

  if (mode === 'research') {
    const countOnlyFindingCount = countOnlyFindings(stateRecords);
    const sourceFindingCount = Number(registry?.metrics?.sourceFindings);
    const reconstructionGapCount = Number(registry?.metrics?.reconstructionGaps);
    if (
      countOnlyFindingCount > 0
      && (!Number.isFinite(sourceFindingCount) || sourceFindingCount < countOnlyFindingCount)
    ) {
      invariantFailures.push('count_only_state_findings_not_reconstructed');
    }
    if (Number.isFinite(reconstructionGapCount) && reconstructionGapCount > 0) {
      invariantFailures.push('state_finding_reconstruction_gap');
    }
    const answeredCount = Number(args.answeredCount);
    const totalQuestions = Number(args.totalQuestions);
    if (invariantFailures.length > 0) {
      stage(args.eventDir, scope, mode, {
        event: 'synthesis_incomplete',
        mode: 'research',
        severity: 'error',
        totalIterations: counts.totalIterations,
        answeredCount,
        totalQuestions,
        stopReason: args.stopReason,
        reason: 'synthesis_artifact_invariant_failed',
        invariantFailures,
        missingArtifacts,
        registryFindingCount: counts.registryFindingCount,
        iterationFindingCount,
        countOnlyFindingCount,
        identifiableFindingCount,
        missingStructuredFindingCount,
        sourceFindingCount: Number.isFinite(sourceFindingCount) ? sourceFindingCount : null,
        reconstructionGapCount: Number.isFinite(reconstructionGapCount) ? reconstructionGapCount : null,
        stateParseFailureCount,
      });
      // Research incompleteness is an error the workflow must surface.
      process.stderr.write(
        `synthesis-closeout: research synthesis incomplete, invariant failed: ${invariantFailures.join(', ')}\n`,
      );
      process.exitCode = 2;
      return;
    }
    stage(args.eventDir, scope, mode, {
      event: 'synthesis_complete',
      totalIterations: counts.totalIterations,
      answeredCount,
      totalQuestions,
      stopReason: args.stopReason,
    });
    return;
  }

  const activeP0 = Number(args.activeP0);
  const activeP1 = Number(args.activeP1);
  const activeP2 = Number(args.activeP2);
  // A fan-out root stages the merged lineage verdict, and no single registry
  // holds its totals, so only a single-executor run can be cross-checked here.
  if (lineageLogs.length === 0) {
    assertActiveSeverityCounts(registry, { P0: activeP0, P1: activeP1, P2: activeP2 });
  }
  const dimensionCoverage = Number(args.dimensionCoverage);
  if (invariantFailures.length > 0) {
    stage(args.eventDir, scope, mode, {
      event: 'synthesis_incomplete',
      mode: 'review',
      severity: 'warning',
      totalIterations: counts.totalIterations,
      activeP0,
      activeP1,
      activeP2,
      dimensionCoverage,
      verdict: args.verdict,
      releaseReadinessState: args.releaseReadinessState,
      stopReason: args.stopReason,
      reason: 'synthesis_artifact_invariant_failed',
      invariantFailures,
      missingArtifacts,
      registryFindingCount: counts.registryFindingCount,
      iterationFindingCount,
      identifiableFindingCount,
      missingStructuredFindingCount,
      stateParseFailureCount,
    });
    // Review incompleteness is a warning the workflow still records.
    return;
  }
  stage(args.eventDir, scope, mode, {
    event: 'synthesis_complete',
    mode: 'review',
    totalIterations: counts.totalIterations,
    activeP0,
    activeP1,
    activeP2,
    dimensionCoverage,
    verdict: args.verdict,
    releaseReadinessState: args.releaseReadinessState,
    stopReason: args.stopReason,
  });
}

// ───────────────────────────────────────────────────────────────────
// 5. CLI ENTRY
// ───────────────────────────────────────────────────────────────────

function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    assertRequired(args);
    closeOut(args);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
