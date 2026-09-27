#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Loop Runtime: Synthesis Close-out                                   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Input:  CLI args.                                                        ║
// ║ Output: one staged event JSON file in --event-dir.                       ║
// ║ Exit:   0 staged, 1 script error, 2 research synthesis incomplete.       ║
// ╚══════════════════════════════════════════════════════════════════════════╝

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
  relative,
  resolve,
  sep,
} = require('node:path');

// Per-mode structured finding fields, in the order a record is searched.
const FINDING_FIELDS = Object.freeze({
  research: Object.freeze(['keyFindings', 'findings']),
  review: Object.freeze(['findingDetails']),
});

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

function normalizeFindingKey(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function findingKeys(candidate) {
  if (typeof candidate === 'string') {
    const key = normalizeFindingKey(candidate);
    return key ? [key] : [];
  }
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return [];
  return [...new Set([
    candidate.id,
    candidate.findingId,
    candidate.title,
    candidate.summary,
    candidate.text,
    candidate.finding,
    candidate.description,
  ].map(normalizeFindingKey).filter(Boolean))];
}

function collectIterationFindingGroups(record, fields) {
  if (!record || record.type !== 'iteration') return [];
  const structured = fields
    .map((field) => record[field])
    .find((value) => Array.isArray(value) && value.length > 0);
  if (!Array.isArray(structured)) return [];
  return structured
    .map(findingKeys)
    .filter((keys) => keys.length > 0);
}

function registryEvidence(mode, registry) {
  if (mode === 'research') {
    const present = Array.isArray(registry?.keyFindings);
    return {
      registryFindingCount: present ? registry.keyFindings.length : null,
      keys: present ? registry.keyFindings.flatMap(findingKeys) : [],
      missingCode: 'registry_missing_keyFindings',
    };
  }
  const openCount = Array.isArray(registry?.openFindings) ? registry.openFindings.length : null;
  const resolvedCount = Array.isArray(registry?.resolvedFindings) ? registry.resolvedFindings.length : 0;
  const repeatedCount = Array.isArray(registry?.repeatedFindings) ? registry.repeatedFindings.length : 0;
  return {
    registryFindingCount: openCount === null ? null : openCount + resolvedCount + repeatedCount,
    keys: [registry?.openFindings, registry?.resolvedFindings, registry?.repeatedFindings]
      .filter(Array.isArray)
      .flatMap((findings) => findings)
      .flatMap(findingKeys),
    missingCode: 'registry_missing_openFindings',
  };
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

// The artifact directory name is the run-stable token this step can derive
// from the state-log path it was handed.
function buildStem(mode, eventName, scopeRunId) {
  const builders = {
    research: (name) => ({
      stem: `deep_research.${name}`,
      scope: { runId: scopeRunId, lineageId: scopeRunId },
    }),
    review: (name) => ({
      stem: `deep_review.${name}`,
      scope: { runId: scopeRunId, sessionId: scopeRunId },
    }),
  };
  return builders[mode](eventName);
}

// The state log is a projection the gateway rebuilds. The staged ledger event
// is what survives the next refresh.
function stage(eventDir, scopeRunId, mode, eventRecord) {
  const eventName = eventRecord.event;
  const data = { ...eventRecord };
  delete data.event;
  const built = buildStem(mode, eventName, scopeRunId);
  writeFileSync(
    join(eventDir, `${eventName}.json`),
    JSON.stringify({ stem: built.stem, scope: built.scope, data }),
    'utf8',
  );
}

function closeOut(args) {
  const mode = args.mode;
  const fields = FINDING_FIELDS[mode];
  const scopeRunId = basename(dirname(args.stateLog)) || mode;
  const registry = readJson(args.registry);
  const evidence = registryEvidence(mode, registry);
  const lineageLogs = lineageStateLogs(args.artifactDir, mode);
  const parsedState = (lineageLogs.length > 0 ? lineageLogs : [args.stateLog]).map(readJsonl);
  const stateRecords = parsedState.flatMap((entry) => entry.records);
  const stateParseFailureCount = parsedState.reduce((sum, entry) => sum + entry.parseFailures, 0);
  const totalIterations = stateRecords.filter((record) => record && record.type === 'iteration').length;
  const iterationFindingCount = stateRecords.reduce(
    (sum, record) => sum + countIterationFindings(record, fields),
    0,
  );
  const identifiableFindingGroups = stateRecords.flatMap(
    (record) => collectIterationFindingGroups(record, fields),
  );
  const registryFindingKeys = new Set(evidence.keys);
  const missingStructuredFindingCount = identifiableFindingGroups
    .filter((keys) => !keys.some((key) => registryFindingKeys.has(key)))
    .length;
  const identifiableFindingCount = identifiableFindingGroups.length;
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
      stage(args.eventDir, scopeRunId, mode, {
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
      process.exitCode = 2;
      return;
    }
    stage(args.eventDir, scopeRunId, mode, {
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
  const dimensionCoverage = Number(args.dimensionCoverage);
  if (invariantFailures.length > 0) {
    stage(args.eventDir, scopeRunId, mode, {
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
  stage(args.eventDir, scopeRunId, mode, {
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
