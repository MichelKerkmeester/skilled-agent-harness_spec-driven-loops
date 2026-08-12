#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: goal manage CLI (runtime-neutral)                             ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Thin router over goal-core.cjs for runtimes with no plugin      ║
// ║          tool surface. Preserves `/goal-opencode`'s base actions,       ║
// ║          STATUS=/ACTION= envelope, --budget parsing, and error codes,   ║
// ║          while adding explicit legacy quarantine actions.               ║
// ║          benchmarks can compare the manage CLI against the OpenCode      ║
// ║          plugin router 1:1. Never writes goal state directly -- every    ║
// ║          mutation goes through the shared core.                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const core = require('../lib/goal-core.cjs');
const { isHookEnabled } = require('../../shared/hook-flags.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. ARGUMENT PARSING
// ─────────────────────────────────────────────────────────────────────────────

function parseArgv(argv) {
  const action = (argv[0] || 'show').toLowerCase();
  const rest = argv.slice(1);
  return { action, rest };
}

/**
 * Remove explicit scope flags from CLI arguments and validate flag values.
 *
 * @param {string[]} argv - Raw command arguments.
 * @returns {Object} Remaining arguments, parsed binding, and any stable parse error.
 */
function parseScopeArgs(argv) {
  const rest = [];
  const binding = { runtime: null, sessionId: null, workspace: null };
  const bindings = new Map([
    ['--runtime', 'runtime'],
    ['--session', 'sessionId'],
    ['--workspace', 'workspace'],
  ]);

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const bindingKey = bindings.get(token);
    if (!bindingKey) {
      rest.push(token);
      continue;
    }
    const value = argv[index + 1];
    if (typeof value !== 'string' || !value.trim() || value.startsWith('--')) {
      const missingCodes = {
        runtime: 'MISSING_RUNTIME',
        sessionId: 'MISSING_SESSION_ID',
        workspace: 'MISSING_WORKSPACE',
      };
      return {
        argv: rest,
        binding,
        error: new core.GoalError(missingCodes[bindingKey], `${token.slice(2)} value is required`),
      };
    }
    binding[bindingKey] = value;
    index += 1;
  }
  return { argv: rest, binding, error: null };
}

function goalOptions(binding) {
  return {
    scope: {
      runtime: binding.runtime,
      sessionId: binding.sessionId,
      workspace: binding.workspace || process.cwd(),
    },
  };
}

/**
 * Parse a trailing `--budget N` off the objective tokens, mirroring the
 * `/goal-opencode` command's Step 3 parsing rules exactly.
 */
function parseSetArgs(rest) {
  const budgetIndex = rest.findIndex((token) => token === '--budget');
  if (budgetIndex === -1) {
    const objective = rest.join(' ').trim();
    return { objective, tokenBudget: null, error: null };
  }
  const rawValue = rest[budgetIndex + 1];
  const isPositiveBaseTenInt = typeof rawValue === 'string' && /^[1-9][0-9]*$/.test(rawValue);
  if (!isPositiveBaseTenInt) {
    return { objective: null, tokenBudget: null, error: { code: 'INVALID_TOKEN_BUDGET', message: 'Token budget must be a positive integer' } };
  }
  const objective = rest.slice(0, budgetIndex).concat(rest.slice(budgetIndex + 2)).join(' ').trim();
  return { objective, tokenBudget: Number(rawValue), error: null };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. ENVELOPE FORMATTING
// ─────────────────────────────────────────────────────────────────────────────

function printOk(action, lines, mutation = null) {
  const out = [`STATUS=OK ACTION=${action}`];
  if (mutation) out.push(`mutation=${mutation}`);
  out.push(...lines);
  process.stdout.write(`${out.join('\n')}\n`);
}

function printFail(action, error) {
  const code = error?.code || 'GOAL_ERROR';
  const message = error?.message || 'Goal operation failed';
  process.stdout.write(`STATUS=FAIL ACTION=${action} ERROR=${core.quoteValue(message)}\ncode=${code}\n`);
}

function goalLines(goal, runtimeLabel = 'cli') {
  if (!goal) {
    return ['goal_present=false', 'store_health=no_active_goal'];
  }
  const injectionPreview = core.renderGoalBrief({ goal, runtimeLabel });
  return [
    'goal_present=true',
    `goal_id=${goal.goalId}`,
    `status=${goal.status}`,
    `objective=${core.quoteValue(goal.objective)}`,
    `goal_prompt=${core.quoteValue(goal.goalPrompt || '')}`,
    `token_budget=${goal.tokenBudget === null || goal.tokenBudget === undefined ? 'none' : goal.tokenBudget}`,
    `turns_used=${Number.isFinite(goal.turnsUsed) ? goal.turnsUsed : 0}`,
    `usage_source=${goal.usageSource || 'unavailable'}`,
    `created_at_ms=${goal.createdAtMs}`,
    `updated_at_ms=${goal.updatedAtMs}`,
    `runtime=${goal.runtime || 'unknown'}`,
    `last_check=${goal.lastVerifierVerdict || 'not_evaluated'}`,
    `verifier_reason=${core.quoteValue(goal.lastVerifierReason || '')}`,
    `injection_preview=${core.quoteValue(injectionPreview)}`,
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ACTION HANDLERS
// ─────────────────────────────────────────────────────────────────────────────

function runShow(runtimeLabel, options) {
  const goal = core.showGoal(options);
  printOk('show', goalLines(goal, runtimeLabel));
}

function runSet(rest, runtimeLabel, options) {
  const { objective, tokenBudget, error } = parseSetArgs(rest);
  if (error) return printFail('set', new core.GoalError(error.code, error.message));
  if (!objective) return printFail('set', new core.GoalError('INVALID_OBJECTIVE', 'Objective is required'));
  try {
    const { record, mutation } = core.setGoal({ objective, tokenBudget, runtimeLabel }, options);
    printOk('set', goalLines(record, runtimeLabel), mutation);
  } catch (error_) {
    printFail('set', error_);
  }
}

function runClear(options) {
  try {
    core.clearGoal(options);
    printOk('clear', goalLines(null));
  } catch (error) {
    printFail('clear', error);
  }
}

function runComplete(runtimeLabel, options) {
  try {
    const record = core.completeGoal(options);
    printOk('complete', goalLines(record, runtimeLabel));
  } catch (error) {
    printFail('complete', error);
  }
}

function runPause(rest, runtimeLabel, options) {
  try {
    const record = core.pauseGoal({ reason: rest.join(' ').trim() }, options);
    printOk('pause', goalLines(record, runtimeLabel));
  } catch (error) {
    printFail('pause', error);
  }
}

function runResume(runtimeLabel, options) {
  try {
    const record = core.resumeGoal(options);
    printOk('resume', goalLines(record, runtimeLabel));
  } catch (error) {
    printFail('resume', error);
  }
}

function runHistory(options) {
  try {
    const records = core.listArchivedGoals(options);
    const lines = [`archive_count=${records.length}`];
    records.forEach((entry, index) => {
      lines.push(
        `archive_${index}_file=${core.quoteValue(entry.filename)}`,
        `archive_${index}_goal_id=${core.quoteValue(entry.goal.goalId)}`,
        `archive_${index}_status=${core.quoteValue(entry.goal.status)}`,
        `archive_${index}_objective=${core.quoteValue(entry.goal.objective)}`,
        `archive_${index}_updated_at_ms=${entry.goal.updatedAtMs}`,
        `archive_${index}_size_bytes=${entry.sizeBytes}`,
      );
    });
    printOk('history', lines);
  } catch (error) {
    printFail('history', error);
  }
}

function runDoctor(action, options) {
  try {
    const stats = core.doctorStats(options);
    printOk(action, [
      `state_dir=${core.quoteValue(stats.stateDir)}`,
      `active_state_file_count=${stats.activeStateFileCount}`,
      `archive_file_count=${stats.archiveFileCount}`,
      `legacy_state_present=${stats.legacyStatePresent}`,
      `legacy_state_status=${stats.legacyStateStatus}`,
      `plugin_disabled=${stats.pluginDisabled}`,
    ]);
  } catch (error) {
    printFail(action, error);
  }
}

function runLegacyInspect(options) {
  try {
    const inspection = core.inspectLegacyGoal(options);
    const lines = [
      `legacy_state_present=${inspection.present}`,
      `legacy_state_status=${inspection.status}`,
      `legacy_size_bytes=${inspection.sizeBytes}`,
    ];
    if (inspection.status === 'valid') {
      lines.push(
        `legacy_goal_id=${core.quoteValue(inspection.goal.goalId)}`,
        `legacy_goal_status=${inspection.goal.status}`,
        `legacy_objective=${core.quoteValue(inspection.goal.objective)}`,
      );
    }
    printOk('legacy-inspect', lines);
  } catch (error) {
    printFail('legacy-inspect', error);
  }
}

function runLegacyMigrate(runtimeLabel, options) {
  try {
    const result = core.migrateLegacyGoal({ ...options, runtimeLabel });
    if (!result.migrated) {
      return printOk('legacy-migrate', [
        'legacy_migrated=false',
        `reason=${result.reason}`,
      ]);
    }
    printOk('legacy-migrate', [
      'legacy_migrated=true',
      `legacy_archive_file=${core.quoteValue(result.archiveFilename)}`,
      `legacy_archive_path=${core.quoteValue(result.archivePath)}`,
      ...goalLines(result.record, runtimeLabel),
    ]);
  } catch (error) {
    printFail('legacy-migrate', error);
  }
}

function runLegacyArchive(options) {
  try {
    const result = core.archiveLegacyGoal(options);
    const lines = [
      `legacy_archived=${result.archived}`,
      `legacy_state_status=${result.status}`,
    ];
    if (result.reason) lines.push(`reason=${result.reason}`);
    if (result.archiveFilename) {
      lines.push(
        `legacy_archive_file=${core.quoteValue(result.archiveFilename)}`,
        `legacy_archive_path=${core.quoteValue(result.archivePath)}`,
      );
    }
    printOk('legacy-archive', lines);
  } catch (error) {
    printFail('legacy-archive', error);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ROUTER
// ─────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const parsedScope = parseScopeArgs(argv);
  const { action, rest } = parseArgv(parsedScope.argv);
  const normalizedAction = core.ACTIONS.includes(action) ? action : 'set';
  if (parsedScope.error) return printFail(normalizedAction, parsedScope.error);

  const runtimeLabel = process.env.MK_GOAL_RUNTIME_LABEL || parsedScope.binding.runtime || 'cli';
  if (!isHookEnabled('goal')) {
    return printFail(normalizedAction, new core.GoalError('PLUGIN_DISABLED', `${core.DISABLED_ENV}=1 disables goal plugin execution`));
  }

  const options = goalOptions(parsedScope.binding);
  const actionsWithoutScope = new Set(['doctor', 'health', 'legacy-inspect', 'legacy-archive']);
  if (!actionsWithoutScope.has(action)) {
    try {
      core.resolveGoalScope(options);
    } catch (error) {
      return printFail(normalizedAction, error);
    }
  }

  switch (action) {
    case 'show': return runShow(runtimeLabel, options);
    case 'set': return runSet(rest, runtimeLabel, options);
    case 'history': return runHistory(options);
    case 'doctor': return runDoctor('doctor', options);
    case 'health': return runDoctor('health', options);
    case 'legacy-inspect': return runLegacyInspect(options);
    case 'legacy-migrate': return runLegacyMigrate(runtimeLabel, options);
    case 'legacy-archive': return runLegacyArchive(options);
    case 'clear': return runClear(options);
    case 'complete': return runComplete(runtimeLabel, options);
    case 'pause': return runPause(rest, runtimeLabel, options);
    case 'resume': return runResume(runtimeLabel, options);
    default: {
      // Bare text (no recognized action token) falls through to `set`, mirroring
      // the /goal-opencode router's "any other non-empty QUERY" rule.
      const objective = parsedScope.argv.join(' ').trim();
      if (!objective) return printFail('show', new core.GoalError('INVALID_OBJECTIVE', 'Objective is required'));
      return runSet(parsedScope.argv, runtimeLabel, options);
    }
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { main, parseSetArgs, parseArgv, parseScopeArgs };
