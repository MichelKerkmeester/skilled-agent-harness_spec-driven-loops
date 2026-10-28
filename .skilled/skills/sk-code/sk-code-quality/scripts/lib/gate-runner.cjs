// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code-quality Gate Runner
// ───────────────────────────────────────────────────────────────────
'use strict';

// One run, from the scope to the verdict. The order is the runner's contract: read the scope,
// classify it, resolve the checklists and the overrides, probe the layers, plan the checks, then
// run the in-process ones and every spawned one inside one workspace-guard window, with each
// configured command in a window of its own. A mutation a check makes stops the rest of the run,
// because a later check would read a tree the author did not write.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const { withGuard } = require('./run-check.cjs');

const {
  CHECKS, HYGIENE_CHECKER, JUDGMENT_REQUIRED, RAN_STATES, REPAIRS, RUN_SCHEMA, checkEntry,
} = require('./gate-core.cjs');
const { applyLayerRule, probeLayers } = require('./gate-layers.cjs');
const { authored, declaredSurfaces, fileFacts, fileLabels } = require('./gate-files.cjs');
const { collectScope, scopeFolders, untrackedListing } = require('./gate-context.cjs');
const { planChecks, runInProcessSyntax, runSensors, selected } = require('./gate-check-plan.cjs');
const {
  PARSE_CHECKS, hygieneFlags, runDistAdapter, runHygiene, runNodeCheck, runParseFloor, runShellCheck,
} = require('./gate-spawned-checks.cjs');
const { planConfigured, readSuggested, runConfigured } = require('./gate-configured-checks.cjs');
const { resolveChecklists } = require('./gate-checklists.cjs');
const { runOverrides } = require('./gate-overrides.cjs');
const { decideGate, redactSecrets, summarize } = require('./gate-verdict.cjs');
const { privateLabels } = require('./gate-render.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. SPAWNED CHECK ROWS
// ─────────────────────────────────────────────────────────────────────────────

function recordSpawnedCheck(id, files, context, run) {
  const tool = { 'comment-hygiene': context.python, 'syntax-node': process.execPath, 'syntax-shell': context.bash }[id];
  const argv = {
    'comment-hygiene': ['python3', '-B', '-I', HYGIENE_CHECKER, '--json', ...hygieneFlags(context), '--', '{files}'],
    'syntax-node': ['node', '--check', '{file}'],
    'syntax-shell': ['bash', '-n', '{file}'],
  }[id];
  const entry = checkEntry(id, { argv, files: files.length });
  if (files.length === 0) return { entry, run: null };
  if (!selected(context, id)) return { entry: { ...entry, state: 'SKIPPED_BY_FLAG' }, run: null };
  if (!tool) return { entry: { ...entry, state: 'SKIPPED_ABSENT', repair: `install ${entry.requires}` }, run: null };
  if (context.options.noRun) return { entry: { ...entry, state: 'LISTED' }, run: null };
  return { entry, run };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ORCHESTRATION
// ─────────────────────────────────────────────────────────────────────────────

function runGate(context) {
  const listing = untrackedListing(context);
  const scope = collectScope(context, listing);
  if (context.options.lines === 'file') for (const file of scope.files) file.changed = 'all';
  const surfaces = declaredSurfaces(context.declHub);
  const files = scope.files.map((file) => fileFacts(file, context));
  for (const facts of files) if (authored(facts)) facts.labels = fileLabels(facts, surfaces);
  const { checklists, errors: configErrors, warnings: configWarnings, seats } = resolveChecklists(files, context);
  const overrides = runOverrides(checklists, seats, surfaces);
  configErrors.push(...overrides.errors);
  const layers = probeLayers(context);
  const plan = planChecks(files, context);
  const checks = new Map();
  const errors = [];
  // A config fault found while a check runs reports the way a bad config file reports:
  // one summary error and one row per bad field, so the gate exits with the config code.
  const configFaults = [];
  let findings = [];
  const ranOn = new Map();

  const settle = (entry, applicable) => {
    checks.set(entry.id, entry);
    if (RAN_STATES.has(entry.state)) ranOn.set(entry.id, applicable);
  };

  for (const id of ['conflict-markers', 'secrets', 'debug-leftovers', 'syntax-json', 'syntax-cjs']) {
    const applicable = plan.get(id);
    const entry = checkEntry(id, { files: applicable.length });
    if (applicable.length === 0) settle(entry, applicable);
    else if (!selected(context, id)) settle({ ...entry, state: 'SKIPPED_BY_FLAG' }, applicable);
    else settle({ ...entry, state: 'RAN_CLEAN' }, applicable);
    if (checks.get(id).state !== 'RAN_CLEAN') plan.set(id, []);
  }
  const inProcess = [...runSensors(plan, context), ...runInProcessSyntax(plan)];
  for (const entry of inProcess) checks.get(entry.check).state = 'RAN_FAIL';
  findings.push(...inProcess);

  // Each spawned check is a step that runs and then settles its own row. All of them run
  // between one snapshot and the next, because listing the untracked files walks the
  // whole tree and a snapshot per check dominated the run in a large repository. A
  // mutation therefore names every check that ran in that window.
  const steps = [];
  const spawned = [
    ['comment-hygiene', () => runHygiene(plan.get('comment-hygiene'), context)],
    ['syntax-node', () => runNodeCheck(plan.get('syntax-node'), context)],
  ];
  for (const [id, work] of spawned) {
    const { entry, run } = recordSpawnedCheck(id, plan.get(id), context, work);
    if (!run) {
      settle(entry, plan.get(id));
      continue;
    }
    steps.push({ id, run, finish: (outcome) => {
      if (outcome.configFault) {
        configFaults.push({ code: 'CONFIG_INVALID', ...outcome.configFault, repair: REPAIRS.CONFIG_INVALID });
        const where = context.config.path || 'the repository config';
        errors.push({ code: 'CONFIG_INVALID', repair: REPAIRS.CONFIG_INVALID,
          message: `${where} has ${configFaults.length} config error(s), listed in config.errors` });
      }
      findings.push(...outcome.findings);
      settle({ ...entry, state: outcome.state, exit: outcome.exit === undefined ? null : outcome.exit,
        duration_ms: outcome.duration_ms || 0, repair: outcome.repair || null }, plan.get(id));
    } });
  }

  const parseArgv = ['python3', '-B', '-I', '-c', '<parse floor>'];
  const parseWanted = {};
  for (const id of Object.values(PARSE_CHECKS)) {
    const applicable = plan.get(id);
    const entry = checkEntry(id, { argv: parseArgv, files: applicable.length });
    if (applicable.length === 0) settle(entry, applicable);
    else if (!selected(context, id)) settle({ ...entry, state: 'SKIPPED_BY_FLAG' }, applicable);
    else if (!context.python) settle({ ...entry, state: 'SKIPPED_ABSENT', repair: 'install python3' }, applicable);
    else if (context.options.noRun) settle({ ...entry, state: 'LISTED' }, applicable);
    else parseWanted[id] = applicable;
  }
  if (Object.keys(parseWanted).length > 0) {
    steps.push({ id: Object.keys(parseWanted).join(','), run: () => runParseFloor(parseWanted, context), finish: (outcome) => {
      for (const id of Object.keys(parseWanted)) {
        const result = outcome[id] || { state: outcome.state || 'ERROR', findings: [], repair: outcome.repair };
        findings.push(...result.findings);
        settle(checkEntry(id, { argv: parseArgv, files: parseWanted[id].length, state: result.state,
          duration_ms: result.duration_ms || 0, repair: result.repair || null }), parseWanted[id]);
      }
    } });
  }

  const shell = recordSpawnedCheck('syntax-shell', plan.get('syntax-shell'), context, () => runShellCheck(plan.get('syntax-shell'), context));
  if (shell.run) {
    steps.push({ id: 'syntax-shell', run: shell.run, finish: (outcome) => {
      findings.push(...outcome.findings);
      settle({ ...shell.entry, state: outcome.state, duration_ms: outcome.duration_ms || 0, repair: outcome.repair || null }, plan.get('syntax-shell'));
    } });
  } else {
    settle(shell.entry, plan.get('syntax-shell'));
  }

  const generated = plan.get('dist-staleness');
  const distOptions = { env: context.env, timeoutMs: context.timeoutMs, noRun: context.options.noRun, workspaceRoot: context.root };
  const settleDist = (outcome) => {
    if (outcome.check) {
      findings.push(...outcome.findings);
      settle(outcome.check, generated);
    } else {
      settle(checkEntry('dist-staleness', { state: 'ERROR', files: generated.length, repair: outcome.repair || null }), generated);
    }
  };
  if (generated.length === 0) {
    settle(checkEntry('dist-staleness'), generated);
  } else if (!selected(context, 'dist-staleness')) {
    settle(checkEntry('dist-staleness', { state: 'SKIPPED_BY_FLAG', files: generated.length }), generated);
  } else if (context.options.noRun) {
    settleDist(runDistAdapter(generated, distOptions));
  } else {
    steps.push({ id: 'dist-staleness', run: () => runDistAdapter(generated, distOptions), finish: settleDist });
  }

  const finished = new Set();
  const failRest = (repair) => {
    for (const step of steps) if (!finished.has(step)) step.finish({ state: 'ERROR', findings: [], repair });
  };
  // The guard starts from the listing this run already took, and each window after it
  // re-lists inside the folders the scope reaches, so one run reads the tree once for
  // the scope instead of once per snapshot. A named-file scope took no listing of its
  // own, so its guard lists those folders at every snapshot.
  const guardContext = { root: context.root, git: context.git, files: files.map((facts) => facts.rel), env: context.env,
    untracked: listing === null ? undefined : listing, folders: scopeFolders(scope.files.map((file) => file.rel)) };
  let snapshot = null;
  let halted = null;
  if (steps.length > 0) {
    try {
      const outcome = withGuard(guardContext, () => {
        for (const step of steps) {
          const result = step.run();
          finished.add(step);
          step.finish(result);
        }
      });
      snapshot = outcome.after;
      if (outcome.mutated.length > 0) {
        const ids = steps.map((step) => step.id).join(',');
        errors.push({ code: 'CHECK_MUTATED_WORKSPACE', message: `the workspace changed while ${ids} ran`, check: ids,
          paths: outcome.mutated, repair: REPAIRS.CHECK_MUTATED_WORKSPACE });
        halted = `the workspace changed while ${ids} ran`;
      }
    } catch (error) {
      errors.push({ code: error.code === 'GUARD_FAILED' ? 'GUARD_FAILED' : 'INTERNAL_ERROR', message: error.message,
        repair: REPAIRS.GUARD_FAILED });
      failRest('not run, because the workspace guard or an earlier check failed');
      halted = 'the workspace guard failed';
    }
  }

  // Each repository command runs in its own guard window, chained from the last one,
  // so a mutation names the one command that made it. The first mutation stops the
  // rest, because a later command would read a tree the author did not write.
  const configured = planConfigured(files, context);
  const configuredRows = [];
  const configuredRan = new Set();
  for (const item of configured) {
    if (!item.pending) {
      configuredRows.push(item.row);
      continue;
    }
    if (halted) {
      configuredRows.push({ ...item.row, state: 'ERROR', repair: `not run, because ${halted}` });
      continue;
    }
    try {
      const outcome = withGuard(guardContext, () => runConfigured(item, context), snapshot);
      snapshot = outcome.after;
      configuredRows.push(outcome.value);
      if (RAN_STATES.has(outcome.value.state)) for (const facts of item.matched) configuredRan.add(facts.rel);
      if (outcome.mutated.length > 0) {
        errors.push({ code: 'CHECK_MUTATED_WORKSPACE', message: `the workspace changed while ${item.entry.id} ran`, check: item.entry.id,
          paths: outcome.mutated, repair: REPAIRS.CHECK_MUTATED_WORKSPACE });
        halted = `the workspace changed while ${item.entry.id} ran`;
      }
    } catch (error) {
      errors.push({ code: error.code === 'GUARD_FAILED' ? 'GUARD_FAILED' : 'INTERNAL_ERROR', message: error.message,
        repair: REPAIRS.GUARD_FAILED });
      configuredRows.push({ ...item.row, state: 'ERROR', repair: 'not run, because the workspace guard failed' });
      halted = 'the workspace guard failed';
    }
  }

  findings = redactSecrets(applyLayerRule(findings, layers), files)
    .sort((a, b) => (a.file < b.file ? -1 : a.file > b.file ? 1 : (a.line || 0) - (b.line || 0) || (a.rule < b.rule ? -1 : 1)));
  const orderedChecks = [...CHECKS.map((check) => checks.get(check.id)), ...configuredRows];
  // A file the language checks could not read stays unchecked, even when the sensors
  // scanned its raw text, so a change of such files alone never reads as checked. A
  // file a repository command ran on has that command's evidence, so it counts.
  const checked = new Set(configuredRan);
  for (const applicable of ranOn.values()) for (const facts of applicable) if (!facts.unchecked) checked.add(facts.rel);
  const allErrors = [...configErrors, ...configFaults, ...errors];
  const decision = decideGate({ errors: allErrors, findings, checks: orderedChecks, filesChecked: checked.size,
    openRules: [...new Set(overrides.conflicts.map((row) => row.id))] });
  const labels = [];
  for (const surface of surfaces) {
    if (files.some((facts) => facts.labels.includes(surface.label)) && !labels.includes(surface.label)) labels.push(surface.label);
  }
  return {
    schema: RUN_SCHEMA,
    status: 'advisory',
    gate: decision.gate,
    exit_code: decision.exit_code,
    scope: { mode: context.options.scope, base: scope.base, merge_base: scope.mergeBase, lines: context.options.lines,
      files: files.map((facts) => facts.rel) },
    config: { ...context.config, errors: [...context.config.errors, ...configErrors, ...configFaults],
      warnings: [...context.config.warnings, ...configWarnings] },
    resolved_surface: labels.length > 0 ? labels : ['unknown'],
    surfaces: files.filter(authored).map((facts) => ({ file: facts.rel, labels: facts.labels })),
    layers,
    checklists,
    rule_overrides: overrides.applied,
    rule_conflicts: overrides.conflicts,
    checks: orderedChecks,
    findings,
    suggested_checks: readSuggested(context),
    judgment_required: [...JUDGMENT_REQUIRED],
    coverage: {
      files_total: files.length,
      files_checked: checked.size,
      unchecked: files.filter((facts) => facts.unchecked && !checked.has(facts.rel))
        .map((facts) => ({ file: facts.rel, reason: facts.unchecked })),
    },
    summary: summarize(findings, decision.unverified),
    errors,
    private_labels: privateLabels(surfaces),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { runGate };
