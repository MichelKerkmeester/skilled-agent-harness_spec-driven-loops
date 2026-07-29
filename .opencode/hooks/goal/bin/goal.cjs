#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: goal manage CLI (runtime-neutral)                             ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Thin router over goal-core.cjs for runtimes with no plugin      ║
// ║          tool surface. Mirrors the `/goal-opencode` command         ║
// ║          contract exactly: same action names, same STATUS=/ACTION=      ║
// ║          envelope, same --budget parsing and error codes, so behavior   ║
// ║          benchmarks can compare the manage CLI against the OpenCode      ║
// ║          plugin router 1:1. Never writes goal state directly -- every    ║
// ║          mutation goes through the shared core.                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const core = require('../lib/goal-core.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. ARGUMENT PARSING
// ─────────────────────────────────────────────────────────────────────────────

function parseArgv(argv) {
  const action = (argv[0] || 'show').toLowerCase();
  const rest = argv.slice(1);
  return { action, rest };
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

function runShow(runtimeLabel) {
  const goal = core.showGoal();
  printOk('show', goalLines(goal, runtimeLabel));
}

function runSet(rest, runtimeLabel) {
  const { objective, tokenBudget, error } = parseSetArgs(rest);
  if (error) return printFail('set', new core.GoalError(error.code, error.message));
  if (!objective) return printFail('set', new core.GoalError('INVALID_OBJECTIVE', 'Objective is required'));
  try {
    const { record, mutation } = core.setGoal({ objective, tokenBudget, runtime: runtimeLabel });
    printOk('set', goalLines(record, runtimeLabel), mutation);
  } catch (error_) {
    printFail('set', error_);
  }
}

function runClear() {
  try {
    core.clearGoal();
    printOk('clear', goalLines(null));
  } catch (error) {
    printFail('clear', error);
  }
}

function runComplete(runtimeLabel) {
  try {
    const record = core.completeGoal();
    printOk('complete', goalLines(record, runtimeLabel));
  } catch (error) {
    printFail('complete', error);
  }
}

function runPause(rest, runtimeLabel) {
  try {
    const record = core.pauseGoal({ reason: rest.join(' ').trim() });
    printOk('pause', goalLines(record, runtimeLabel));
  } catch (error) {
    printFail('pause', error);
  }
}

function runResume(runtimeLabel) {
  try {
    const record = core.resumeGoal();
    printOk('resume', goalLines(record, runtimeLabel));
  } catch (error) {
    printFail('resume', error);
  }
}

function runHistory() {
  try {
    const records = core.listArchivedGoals();
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

function runDoctor() {
  try {
    const stats = core.doctorStats();
    printOk('doctor', [
      `state_dir=${core.quoteValue(stats.stateDir)}`,
      `active_state_file_count=${stats.activeStateFileCount}`,
      `archive_file_count=${stats.archiveFileCount}`,
      `plugin_disabled=${stats.pluginDisabled}`,
    ]);
  } catch (error) {
    printFail('doctor', error);
  }
}

function runHealth() {
  runDoctor();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ROUTER
// ─────────────────────────────────────────────────────────────────────────────

function main(argv) {
  const runtimeLabel = process.env.MK_GOAL_RUNTIME_LABEL || 'cli';
  if (core.isPluginDisabled()) {
    const { action } = parseArgv(argv);
    const normalizedAction = core.ACTIONS.includes(action) ? action : 'show';
    return printFail(normalizedAction, new core.GoalError('PLUGIN_DISABLED', `${core.DISABLED_ENV}=1 disables goal plugin execution`));
  }

  const { action, rest } = parseArgv(argv);
  switch (action) {
    case 'show': return runShow(runtimeLabel);
    case 'set': return runSet(rest, runtimeLabel);
    case 'history': return runHistory();
    case 'doctor': return runDoctor();
    case 'health': return runHealth();
    case 'clear': return runClear();
    case 'complete': return runComplete(runtimeLabel);
    case 'pause': return runPause(rest, runtimeLabel);
    case 'resume': return runResume(runtimeLabel);
    default: {
      // Bare text (no recognized action token) falls through to `set`, mirroring
      // the /goal-opencode router's "any other non-empty QUERY" rule.
      const objective = argv.join(' ').trim();
      if (!objective) return printFail('show', new core.GoalError('INVALID_OBJECTIVE', 'Objective is required'));
      return runSet(argv, runtimeLabel);
    }
  }
}

if (require.main === module) {
  main(process.argv.slice(2));
}

module.exports = { main, parseSetArgs, parseArgv };
