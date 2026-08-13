#!/usr/bin/env node
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { parse } = require('./_args.cjs');
const {
  renderReport,
  renderResultsCsv,
  renderFailedRuns,
  renderFindings,
  renderRunReadme,
  renderSource,
} = require('./build-report.cjs');
const { appendRunIndex } = require('./append-run-index.cjs');
const {
  resolveSkillRoot,
  runFolderName,
  slugField,
  MAX_OUTPUT_ORDINAL,
} = require('./run-skill-benchmark.cjs');

const SUBJECT = 'manual-testing-playbook';
const TRACE_MODE = 'doc';
const SCORING_METHOD = 'not-applicable-manual-outcome';
const MANUAL_DIMENSION_STATUS = 'not-applicable-manual-outcome';
const VERDICTS = new Set(['PASS', 'FAIL', 'SKIP']);
const EVIDENCE_CLASSES = new Set(['unit', 'adapter-driven', 'registered-path', 'native-host-delivered']);
const ARTIFACT_NAMES = [
  'skill-benchmark-report.json',
  'skill-benchmark-report.md',
  'results.csv',
  'README.md',
  'failed-runs.md',
  'findings-and-recommendations.md',
  'source.md',
];

function argValue(args, ...names) {
  for (const name of names) {
    if (Object.prototype.hasOwnProperty.call(args, name)) return args[name];
  }
  return undefined;
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function fail(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

function normalizeVerdict(value) {
  const verdict = String(value == null ? '' : value).toUpperCase();
  if (!VERDICTS.has(verdict)) {
    throw fail('BAD_OUTCOME', `verdict must be PASS, FAIL, or SKIP (got "${value}")`);
  }
  return verdict;
}

function normalizeEvidence(value) {
  if (value == null || value === '') return [];
  if (Array.isArray(value)) return value.map((entry) => String(entry));
  return String(value).split(',').map((entry) => entry.trim()).filter(Boolean);
}

function evidenceArtifacts(evidence, executionContext, requireDurable) {
  const requestedRoot = path.resolve(executionContext.evidenceRoot || process.cwd());
  let evidenceRoot;
  try {
    evidenceRoot = fs.realpathSync(requestedRoot);
  } catch {
    if (requireDurable) throw fail('BAD_EVIDENCE', `evidence root is unavailable: ${requestedRoot}`);
    return normalizeEvidence(evidence).map((source) => ({ path: source, status: 'unverified' }));
  }
  return normalizeEvidence(evidence).map((source) => {
    const absolute = path.resolve(path.isAbsolute(source) ? source : path.join(evidenceRoot, source));
    const relative = path.relative(evidenceRoot, absolute);
    const withinRoot = relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
    let descriptor = null;
    try {
      let current = evidenceRoot;
      for (const segment of relative.split(path.sep)) {
        current = path.join(current, segment);
        if (fs.lstatSync(current).isSymbolicLink()) throw new Error('symlink evidence path');
      }
      const canonical = fs.realpathSync(absolute);
      const canonicalRelative = path.relative(evidenceRoot, canonical);
      if (!withinRoot || canonicalRelative.startsWith('..') || path.isAbsolute(canonicalRelative)) {
        throw new Error('outside evidence root');
      }
      descriptor = fs.openSync(absolute, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
      const metadata = fs.fstatSync(descriptor);
      if (!metadata.isFile() || metadata.nlink !== 1) throw new Error('unsafe evidence file');
      const bytes = fs.readFileSync(descriptor);
      return {
        path: relative.split(path.sep).join('/'),
        status: 'verified',
        bytes: bytes.length,
        sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
      };
    } catch {
      if (requireDurable) {
        throw fail('BAD_EVIDENCE', `durable evidence must be an owned regular file beneath ${evidenceRoot}: ${source}`);
      }
      return { path: source, status: 'unverified' };
    } finally {
      if (descriptor !== null) fs.closeSync(descriptor);
    }
  });
}

function readOutcomeFile(args) {
  const outcomePath = argValue(args, 'outcome-json', 'outcomeJson');
  if (outcomePath == null || outcomePath === true) {
    if (outcomePath === true) throw fail('BAD_OUTCOME', '--outcome-json requires a path');
    return null;
  }
  const absolutePath = path.resolve(String(outcomePath));
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  } catch (error) {
    throw fail('BAD_OUTCOME', `could not read outcome JSON ${absolutePath}: ${error.message}`);
  }
  if (!isObject(parsed)) throw fail('BAD_OUTCOME', 'outcome JSON must contain an object');
  if (parsed.executionContext != null && !isObject(parsed.executionContext)) {
    throw fail('BAD_OUTCOME', 'outcome JSON executionContext must be an object');
  }
  if (parsed.evidence != null && !Array.isArray(parsed.evidence)) {
    throw fail('BAD_OUTCOME', 'outcome JSON evidence must be an array');
  }
  return parsed;
}

function flagOutcome(args) {
  return {
    scenarioId: argValue(args, 'scenario', 'scenarioId'),
    verdict: argValue(args, 'verdict'),
    reason: argValue(args, 'reason') == null ? '' : String(argValue(args, 'reason')),
    stage: argValue(args, 'stage') == null ? 'documentation' : String(argValue(args, 'stage')),
    evidence: normalizeEvidence(argValue(args, 'evidence')),
    executionContext: isObject(args.executionContext) ? { ...args.executionContext } : {},
  };
}

function mergeOutcome(base, override) {
  if (!override) return base;
  const merged = { ...base };
  for (const key of ['scenarioId', 'verdict', 'reason', 'stage', 'evidence', 'executionContext']) {
    if (Object.prototype.hasOwnProperty.call(override, key)) merged[key] = override[key];
  }
  if (merged.reason == null) merged.reason = '';
  if (merged.stage == null) merged.stage = 'documentation';
  merged.evidence = normalizeEvidence(merged.evidence);
  merged.executionContext = isObject(merged.executionContext) ? { ...merged.executionContext } : {};
  return merged;
}

function errorMessage(error) {
  return error && error.message ? error.message : String(error);
}

function executorFunction(args) {
  return [args.execute, args.executeScenario, args.scenarioRunner, args.runScenario]
    .find((candidate) => typeof candidate === 'function');
}

function applyExecutorResult(outcome, result) {
  if (result == null) return outcome;
  if (typeof result === 'number') {
    if (result !== 0) throw new Error(`scenario executor exited with code ${result}`);
    return outcome;
  }
  if (result === false) throw new Error('scenario executor returned false');
  if (!isObject(result)) throw new Error('scenario executor must return an outcome object');
  if (typeof result.exitCode === 'number' && result.exitCode !== 0) {
    throw new Error(`scenario executor exited with code ${result.exitCode}`);
  }
  return mergeOutcome(outcome, result);
}

function finalizeOutcome(outcome, executionError, hasExecutor) {
  const finalOutcome = mergeOutcome({}, outcome);
  if (executionError) {
    finalOutcome.verdict = 'FAIL';
    if (!finalOutcome.reason) finalOutcome.reason = `scenario execution threw: ${errorMessage(executionError)}`;
    finalOutcome.executionContext = {
      ...finalOutcome.executionContext,
      error: {
        name: executionError && executionError.name ? executionError.name : 'Error',
        message: errorMessage(executionError),
      },
    };
  } else if (finalOutcome.verdict == null && hasExecutor) {
    finalOutcome.verdict = 'PASS';
  }

  if (!finalOutcome.scenarioId) throw fail('BAD_OUTCOME', 'scenarioId is required');
  if (!finalOutcome.stage) finalOutcome.stage = 'documentation';
  finalOutcome.verdict = normalizeVerdict(finalOutcome.verdict);
  finalOutcome.reason = finalOutcome.reason == null ? '' : String(finalOutcome.reason);
  finalOutcome.evidence = normalizeEvidence(finalOutcome.evidence);
  return finalOutcome;
}

function dimensionScores() {
  return {
    D1inter: { score: null, status: MANUAL_DIMENSION_STATUS },
    D1intra: { score: null, status: MANUAL_DIMENSION_STATUS },
    D2: { score: null, status: MANUAL_DIMENSION_STATUS },
    D3: { score: null, status: MANUAL_DIMENSION_STATUS },
    D4: { score: null, status: MANUAL_DIMENSION_STATUS },
    D5: { score: null, status: MANUAL_DIMENSION_STATUS },
  };
}

function buildReport({ skillRoot, variant, args, outcome, capturedAt }) {
  const contextInput = isObject(outcome.executionContext) ? outcome.executionContext : {};
  const {
    executor: claimedExecutor,
    model: claimedModel,
    ...contextRest
  } = contextInput;
  const executorArg = argValue(args, 'executor');
  const modelArg = argValue(args, 'model');
  const requestedExecutorLabel = claimedExecutor
    || (executorArg == null || executorArg === true ? null : String(executorArg));
  const requestedModelLabel = claimedModel
    || (modelArg == null || modelArg === true ? null : String(modelArg));
  const executor = contextInput.executorObserved === true && claimedExecutor ? String(claimedExecutor) : null;
  const model = contextInput.modelObserved === true && claimedModel ? String(claimedModel) : null;
  const evidenceClass = typeof contextInput.evidenceClass === 'string' ? contextInput.evidenceClass : '';
  if (evidenceClass && !EVIDENCE_CLASSES.has(evidenceClass)) {
    throw fail('BAD_OUTCOME', `unknown evidence class: ${evidenceClass}`);
  }
  const strictPass = outcome.verdict === 'PASS';
  if (strictPass) {
    const requiredStrings = ['command', 'runtime'];
    for (const field of requiredStrings) {
      if (typeof contextInput[field] !== 'string' || !contextInput[field].trim()) {
        throw fail('BAD_OUTCOME', `PASS requires executionContext.${field}`);
      }
    }
    if (!EVIDENCE_CLASSES.has(evidenceClass)) throw fail('BAD_OUTCOME', 'PASS requires a controlled evidenceClass');
    if (contextInput.requireDurableEvidence !== true) throw fail('BAD_EVIDENCE', 'PASS requires durable evidence');
    if (!contextInput.nodeVersion && !contextInput.runtimeVersion) throw fail('BAD_OUTCOME', 'PASS requires an observed runtime or Node version');
    if (!contextInput.payloadFixture && !contextInput.payloadNotApplicableReason) throw fail('BAD_OUTCOME', 'PASS requires a payload fixture or reason');
    if (!executor && !contextInput.executorNotApplicableReason) throw fail('BAD_OUTCOME', 'PASS requires observed executor provenance or reason');
    if (!model && !contextInput.modelNotApplicableReason) throw fail('BAD_OUTCOME', 'PASS requires observed model provenance or reason');
  }
  const artifacts = evidenceArtifacts(outcome.evidence, contextInput, strictPass || contextInput.requireDurableEvidence === true);
  if (strictPass && (artifacts.length === 0 || artifacts.some((artifact) => artifact.status !== 'verified'))) {
    throw fail('BAD_EVIDENCE', 'PASS requires at least one verified evidence artifact');
  }
  const supersedes = normalizeEvidence(contextInput.supersedes);
  const executionContext = {
    traceMode: TRACE_MODE,
    scenarioId: outcome.scenarioId,
    stage: outcome.stage,
    dispatch: outcome.verdict === 'SKIP' ? 'none' : 'manual',
    evidenceClass: evidenceClass || null,
    ...(executor ? { executor } : {}),
    ...(model ? { model } : {}),
    ...(requestedExecutorLabel ? { requestedExecutorLabel } : {}),
    ...(requestedModelLabel ? { requestedModelLabel } : {}),
    variant,
    ...contextRest,
  };

  return {
    schemaVersion: 'skill-benchmark-report.v1',
    traceMode: TRACE_MODE,
    scoringMethod: SCORING_METHOD,
    targetSkill: {
      id: path.basename(skillRoot),
      rootRel: path.relative(process.cwd(), skillRoot).split(path.sep).join('/'),
    },
    executor,
    model,
    variant,
    verdict: outcome.verdict,
    aggregateScore: null,
    dimensionScores: dimensionScores(),
    runQuality: {
      note: 'Manual playbook outcome; no Lane C dimension scoring applies.',
      scenarioCount: 1,
    },
    scenarioRows: [{
      scenarioId: outcome.scenarioId,
      verdict: outcome.verdict,
      reason: outcome.reason,
      stage: outcome.stage,
      classKind: 'manual',
      providerModel: model,
      variant,
      evidence: outcome.evidence,
      evidenceArtifacts: artifacts,
    }],
    supersedes,
    provenance: {
      note: 'Manual playbook scenario outcome captured by the canonical wrapper; no benchmark dimensions were scored.',
      capturedAt,
      evidenceClass: executionContext.evidenceClass,
      evidenceArtifacts: artifacts,
    },
    executionContext,
  };
}

function explicitDestination(args, reportsDir) {
  const requestedLabel = argValue(args, 'run-label', 'runLabel');
  const destinationArg = argValue(args, 'destination', 'output-dir', 'outputs-dir', 'outputDir', 'outputsDir');
  if (requestedLabel != null) {
    if (requestedLabel === true) throw fail('BAD_LABEL', '--run-label requires a value');
    const label = String(requestedLabel);
    if (path.basename(label).toLowerCase() === 'baseline') {
      throw fail('BAD_LABEL', 'the frozen `baseline` label is never written');
    }
    return path.resolve(path.isAbsolute(label) ? label : path.join(reportsDir, label));
  }
  if (destinationArg == null) return null;
  if (destinationArg === true) throw fail('BAD_LABEL', 'explicit destination requires a path');
  const destination = String(destinationArg);
  if (path.basename(destination).toLowerCase() === 'baseline') {
    throw fail('BAD_LABEL', 'the frozen `baseline` label is never written');
  }
  return path.resolve(path.isAbsolute(destination) ? destination : path.join(reportsDir, destination));
}

function assertWithinReportsDir(reportsDir, targetDir) {
  const relative = path.relative(path.resolve(reportsDir), path.resolve(targetDir));
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw fail('BAD_LABEL', `destination must be a child of ${reportsDir}`);
  }
}

function reserveFolder({ reportsDir, base, args }) {
  const explicit = explicitDestination(args, reportsDir);
  if (explicit) {
    assertWithinReportsDir(reportsDir, explicit);
    if (fs.existsSync(explicit)) {
      throw fail('COLLISION', `destination already exists, refusing to overwrite: ${explicit}`);
    }
    fs.mkdirSync(path.dirname(explicit), { recursive: true });
    try {
      fs.mkdirSync(explicit);
    } catch (error) {
      if (error.code === 'EEXIST') {
        throw fail('COLLISION', `destination already exists, refusing to overwrite: ${explicit}`);
      }
      throw error;
    }
    return { folderName: path.basename(explicit), folderPath: explicit };
  }

  if (base.toLowerCase() === 'baseline') {
    throw fail('BAD_LABEL', 'the frozen `baseline` label is never written');
  }
  fs.mkdirSync(reportsDir, { recursive: true });
  for (let ordinal = 1; ordinal <= MAX_OUTPUT_ORDINAL; ordinal += 1) {
    const folderName = ordinal === 1 ? base : `${base}-${ordinal}`;
    const folderPath = path.join(reportsDir, folderName);
    try {
      fs.mkdirSync(folderPath);
      return { folderName, folderPath };
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
  throw fail('COLLISION', `no free output folder for "${base}" after ${MAX_OUTPUT_ORDINAL} attempts`);
}

function updateSupersessionManifest(reportsDir, replacementFolder, report) {
  if (!Array.isArray(report.supersedes) || report.supersedes.length === 0) return;
  const manifestPath = path.join(reportsDir, 'supersession-manifest.json');
  let manifest = { schemaVersion: 1, mappings: [] };
  if (fs.existsSync(manifestPath)) {
    const parsed = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (!isObject(parsed) || !Array.isArray(parsed.mappings)) throw fail('BAD_SUPERSESSION', 'invalid supersession manifest');
    manifest = parsed;
  }
  const existing = new Set(manifest.mappings.map((entry) => `${entry.superseded}\u0000${entry.replacement}`));
  for (const superseded of report.supersedes) {
    const mapping = {
      superseded,
      replacement: replacementFolder,
      capturedAt: report.provenance.capturedAt,
      scenarioId: report.scenarioRows[0].scenarioId,
    };
    const key = `${mapping.superseded}\u0000${mapping.replacement}`;
    if (!existing.has(key)) manifest.mappings.push(mapping);
  }
  manifest.mappings.sort((left, right) => left.superseded.localeCompare(right.superseded)
    || left.replacement.localeCompare(right.replacement));
  const temporary = `${manifestPath}.tmp-${process.pid}`;
  try {
    fs.writeFileSync(temporary, `${JSON.stringify(manifest, null, 2)}\n`, { encoding: 'utf8', mode: 0o600 });
    fs.renameSync(temporary, manifestPath);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

function persistReport({ reportsDir, report, variant, args, now, skillRoot }) {
  const base = runFolderName({ now, subject: SUBJECT, variant: slugField(variant) });
  const reserved = reserveFolder({ reportsDir, base, args });
  const corpus = fs.existsSync(path.join(skillRoot, SUBJECT)) ? SUBJECT : null;
  const context = {
    runLabel: reserved.folderName,
    reportStem: 'skill-benchmark-report',
    corpus,
  };

  const bodies = [
    ['skill-benchmark-report.json', JSON.stringify(report, null, 2)],
    ['skill-benchmark-report.md', renderReport(report)],
    ['results.csv', renderResultsCsv(report)],
    ['README.md', renderRunReadme(report, context)],
    ['failed-runs.md', renderFailedRuns(report)],
    ['findings-and-recommendations.md', renderFindings(report)],
    ['source.md', renderSource(report, context)],
  ];

  try {
    for (const [name, body] of bodies) fs.writeFileSync(path.join(reserved.folderPath, name), body, 'utf8');
  } catch (error) {
    fs.rmSync(reserved.folderPath, { recursive: true, force: true });
    throw error;
  }

  appendRunIndex({
    reportsDir,
    folderName: reserved.folderName,
    skillId: report.targetSkill.id,
    report,
    corpus,
  });
  updateSupersessionManifest(reportsDir, reserved.folderName, report);
  return {
    folderPath: reserved.folderPath,
    folderName: reserved.folderName,
    reportsDir,
    report,
    files: ARTIFACT_NAMES.map((name) => path.join(reserved.folderPath, name)),
  };
}

async function run(args = {}) {
  const skillArg = argValue(args, 'skill');
  const scenarioArg = argValue(args, 'scenario', 'scenarioId');
  const variantArg = argValue(args, 'variant');
  if (skillArg == null || skillArg === true) throw fail('USAGE', '--skill is required');
  if (scenarioArg == null || scenarioArg === true) throw fail('USAGE', '--scenario is required');
  if (variantArg == null || variantArg === true) throw fail('USAGE', '--variant is required');

  const skillRoot = resolveSkillRoot(String(skillArg));
  const variant = String(variantArg);
  if (!slugField(variant)) throw fail('BAD_LABEL', '--variant must contain an alphanumeric character');
  const outcomeFile = readOutcomeFile(args);
  let outcome = mergeOutcome(flagOutcome(args), outcomeFile);
  const executor = executorFunction(args);
  let executionError = null;
  let persisted;

  try {
    const isSkip = outcome.verdict != null && String(outcome.verdict).toUpperCase() === 'SKIP';
    if (!outcomeFile && executor && !isSkip) {
      try {
        const result = await executor({
          skillRoot,
          scenarioId: outcome.scenarioId,
          variant,
          verdict: outcome.verdict,
          reason: outcome.reason,
          stage: outcome.stage,
          evidence: outcome.evidence,
          executionContext: outcome.executionContext,
        });
        outcome = applyExecutorResult(outcome, result);
      } catch (error) {
        executionError = error;
      }
    }
  } finally {
    const finalOutcome = finalizeOutcome(outcome, executionError, Boolean(executor));
    const rawNow = args.now == null ? new Date() : (args.now instanceof Date ? args.now : new Date(args.now));
    if (Number.isNaN(rawNow.getTime())) throw fail('BAD_LABEL', `invalid run timestamp: ${args.now}`);
    const report = buildReport({
      skillRoot,
      variant,
      args,
      outcome: finalOutcome,
      capturedAt: rawNow.toISOString(),
    });
    const reportsDir = path.join(skillRoot, 'benchmark', 'reports');
    persisted = persistReport({ reportsDir, report, variant, args, now: rawNow, skillRoot });
  }

  if (executionError) {
    executionError.code = executionError.code || 'SCENARIO_FAILED';
    executionError.exitCode = 1;
    executionError.folderPath = persisted.folderPath;
    executionError.folderName = persisted.folderName;
    executionError.report = persisted.report;
    throw executionError;
  }
  return persisted;
}

module.exports = { run };

if (require.main === module) {
  const args = parse(process.argv.slice(2));
  if (!args.skill || !args.scenario || !args.variant) {
    process.stderr.write('usage: run-manual-playbook-scenario.cjs --skill <root-or-id> --scenario <id> --variant <feature-or-scenario-group> [--verdict PASS|FAIL|SKIP] [--reason <text>] [--stage <slug>] [--evidence <comma-paths>] [--executor <id>] [--model <id>] [--outcome-json <path>]\n');
    process.exitCode = 2;
  } else {
    run(args).then((result) => {
      process.stdout.write(`created folder: ${result.folderPath}\n`);
    }).catch((error) => {
      if (error.folderPath) process.stdout.write(`created folder: ${error.folderPath}\n`);
      process.stderr.write(`run-manual-playbook-scenario: ${error.message}\n`);
      process.exitCode = error.exitCode || 1;
    });
  }
}
