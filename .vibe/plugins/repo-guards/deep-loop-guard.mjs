#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: deep-loop-guard Vibe Hook
// ───────────────────────────────────────────────────────────────────
// A strict pre_tool hook over the runtime-neutral deep-loop dispatch-guard
// core. It refuses a subagent spawn to a deep-loop agent whose Deep Route
// header declares a mode the registry does not give that agent, or a repeated
// loop-like hand-off to a command-owned loop executor, and allows every other
// spawn. The core owns registry indexing, target resolution, the repeat
// counters and their thresholds; this file only maps Vibe's agents_spawn
// payload onto it.
//
// The core's blocking decision is opt-in through its reject switches. A
// pre_tool hook's only channel is a deny, so this hook supplies the opt-in
// when the operator has not set a value; an explicit value still decides.
// Warnings stay advisory: Vibe ignores additional_context on pre_tool, so they
// are persisted by the core's log and reported on stderr. A core error allows
// and is reported on stderr, so a guard bug never blocks a spawn it could not
// judge.

import { createRequire } from 'node:module';

import { isHookEnabled } from '../../../.skilled/hooks/shared/hook-flags.mjs';
import { allow, deny, readPayload, runGuard, REPO_ROOT } from './lib/hook-io.mjs';

const require = createRequire(import.meta.url);
const guardCore = require('../../../.skilled/hooks/subagent-dispatch-guard/lib/subagent-dispatch-guard.cjs');

// Vibe publishes the spawn tool as agents.spawn in the payload and as
// agents_spawn in a match selector; the deprecated subagent spelling is kept
// so a replayed call is still judged.
const SPAWN_TOOLS = new Set(['agents.spawn', 'agents_spawn', 'subagent.spawn', 'agent_spawn']);

/**
 * Pick the first non-blank string from a list of candidate fields.
 * @param {...unknown} values - Candidate values.
 * @returns {string|undefined} The first usable string.
 */
function firstNonBlankString(...values) {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value;
  }
  return undefined;
}

/**
 * The text a Deep Route header can live in. A spawn's message is the task the
 * child receives; its instructions are the agent's own system text and are
 * scanned only when no task text is present.
 * @param {object} input - The spawn tool's arguments.
 * @returns {string} Prompt text for the core.
 */
function dispatchPrompt(input) {
  return firstNonBlankString(input.message, input.instructions) ?? '';
}

/**
 * Strip the core's own module name from its detail. Vibe wraps a pre_tool
 * reason as "Tool 'X' was denied by hook 'Y': <reason>", so keeping the name
 * inside the reason would print the guard twice.
 * @param {unknown} detail - The core's decision detail.
 * @returns {string} The operator-facing reason.
 */
function operatorReason(detail) {
  return String(detail ?? '').replace(/^(?:system-deep-loop-guard|deep-loop-guard):\s*/i, '');
}

/**
 * The environment the core reads. A pre_tool hook cannot ask the operator, so
 * the core's blocking policy is supplied unless the operator chose a value.
 * @returns {NodeJS.ProcessEnv} A copy safe to hand to the core.
 */
function guardEnv() {
  const env = { ...process.env };
  if (env[guardCore.REJECT_MODE_ENV] === undefined) env[guardCore.REJECT_MODE_ENV] = '1';
  if (env[guardCore.REJECT_LOOP_ENV] === undefined) env[guardCore.REJECT_LOOP_ENV] = '1';
  return env;
}

/**
 * Report advisory warnings without changing the verdict.
 * @param {string[]} warnings - The core's warnings.
 * @returns {void}
 */
function reportWarnings(warnings) {
  if (!warnings || warnings.length === 0) return;
  try {
    process.stderr.write(`deep-loop-guard advisory:\n${warnings.join('\n')}\n`);
  } catch {
    // A closed stderr must not change the verdict.
  }
}

async function main() {
  const payload = await readPayload();
  if (!payload || !isHookEnabled('task-dispatch')) return allow();
  if (!SPAWN_TOOLS.has(String(payload.tool_name ?? '').toLowerCase())) return allow();

  const input = payload.tool_input && typeof payload.tool_input === 'object' ? payload.tool_input : {};
  // The registry and the shared loop-state live in the checkout that owns this
  // hook, not in the session's working directory, which may be anywhere.
  const projectDir = REPO_ROOT;

  const result = guardCore.evaluateDispatch({
    subagentType: firstNonBlankString(input.config_name),
    prompt: dispatchPrompt(input),
    sessionID: firstNonBlankString(payload.session_id),
    projectDir,
    env: guardEnv(),
  });

  const { stateDir } = guardCore.resolveGuardPaths(projectDir);
  for (const audit of result.audits ?? []) guardCore.appendRejectModeDegradedAudit(stateDir, audit);
  for (const warning of result.warnings ?? []) guardCore.appendWarningLog(stateDir, warning);
  reportWarnings(result.warnings);

  if (result.decision !== 'reject') return allow();
  const reason = operatorReason(result.detail);
  return deny(reason || 'The deep-loop dispatch policy refused this spawn.');
}

await runGuard(main, 'deep-loop-guard');
