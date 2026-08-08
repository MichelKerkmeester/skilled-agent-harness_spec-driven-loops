#!/usr/bin/env node
'use strict';

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

function buildReport({ skillRoot, variant, args, outcome }) {
  const contextInput = isObject(outcome.executionContext) ? outcome.executionContext : {};
  const executorArg = argValue(args, 'executor');
  const modelArg = argValue(args, 'model');
  const executor = contextInput.executor || (executorArg == null || executorArg === true
    ? null
    : String(executorArg));
  const model = contextInput.model || (modelArg == null || modelArg === true
    ? null
    : String(modelArg));
  const executionContext = {
    traceMode: TRACE_MODE,
    scenarioId: outcome.scenarioId,
    stage: outcome.stage,
    dispatch: outcome.verdict === 'SKIP' ? 'none' : 'manual',
    ...(executor ? { executor } : {}),
    ...(model ? { model } : {}),
    variant,
    ...contextInput,
  };

  return {
    schemaVersion: 'skill-benchmark-report.v1',
    traceMode: TRACE_MODE,
    scoringMethod: SCORING_METHOD,
    targetSkill: { id: path.basename(skillRoot), root: skillRoot },
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
    }],
    provenance: {
      note: 'Manual playbook scenario outcome captured by the canonical wrapper; no benchmark dimensions were scored.',
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
    const report = buildReport({ skillRoot, variant, args, outcome: finalOutcome });
    const rawNow = args.now == null ? new Date() : (args.now instanceof Date ? args.now : new Date(args.now));
    if (Number.isNaN(rawNow.getTime())) throw fail('BAD_LABEL', `invalid run timestamp: ${args.now}`);
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
