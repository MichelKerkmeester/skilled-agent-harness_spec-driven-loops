#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ codex-executor — Mode B live executor, codex transport (thin adapter)     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * codex-executor.cjs — Mode B live executor over the codex transport.
 *
 * Same executor contract as live-executor.cjs (cli-opencode), but dispatches the
 * routing-analysis scenario through the runtime-owned codex helper instead of
 * spawning codex here. cli-codex forbids a packet-local codex adapter, so the
 * actual `codex exec` spawn lives in the deep-loop runtime
 * (../../../runtime/scripts/codex-dispatch.cjs); this file only builds the
 * prompt, calls that helper, and normalizes the reply into the observed-result
 * shape the scorer consumes.
 *
 * The prompt builder and JSON/declaration parsers are REUSED from live-executor
 * so both transports pose the identical routing question and parse identically —
 * the only difference is the dispatch channel.
 *
 * Fidelity: codex exec emits no opencode-style tool_use event stream, so
 * activation and observed file-reads are not observable on this transport. They
 * are recorded as unmeasured (activation: null — the same convention the
 * deterministic router mode uses), NOT as misses, so codex scores are not
 * artificially depressed on a channel it cannot report. Scoring here rests on
 * the model's STATED routing (surface / resources / intents / workflowMode),
 * which is directly comparable to the opencode transport; the report flags the
 * activation/observed-read dimensions as opencode-only.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('path');
const {
  buildLiveDispatchPrompt,
  extractRoutingJson,
  proseRoutingFallback,
  parseRoutedDeclaration,
  hasRouteGold,
} = require('./live-executor.cjs');
const { dispatchCodex } = require('../../../runtime/scripts/codex-dispatch.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const GRADED_RESPONSE_MAX_CHARS = 8000;
const SURFACE_VOCAB = ['WEBFLOW', 'OPENCODE', 'UNKNOWN', 'MOTION_DEV', 'NONE'];

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalize a codex reply into the observed-result the scorer consumes. Mirrors
 * live-executor.parseLiveResult's field construction, but reads from the plain
 * last-message text (codex has no NDJSON event stream). observedResources /
 * observedSurface / observedIntents / observedWorkflowMode all come from the
 * STATED routing declaration.
 *
 * @param {Object} disp - The dispatchCodex result.
 * @param {Object} [opts] - Parse options.
 * @param {string} [opts.skillId] - Skill id used for the best-effort read scan.
 * @param {boolean} [opts.requireRouteDeclaration] - Mark route-gold misses.
 * @returns observed-result consumed by score-skill-benchmark.scoreScenario
 */
function parseCodexResult(disp, { skillId, requireRouteDeclaration = false } = {}) {
  const responseText = (disp.lastMessage && disp.lastMessage.length)
    ? disp.lastMessage
    : String(disp.stdout || '');

  const stated = extractRoutingJson(responseText) || proseRoutingFallback(responseText) || {};
  const statedResources = Array.isArray(stated.resources) ? stated.resources : [];
  const statedAssets = Array.isArray(stated.assets) ? stated.assets : [];
  const surfaceRaw = (stated.surface || '').toString().toUpperCase();
  const statedSurface = SURFACE_VOCAB.includes(surfaceRaw) ? surfaceRaw : null;
  const routed = parseRoutedDeclaration(responseText);

  // Best-effort discovery corroboration from the raw exec log (weak on codex):
  // if the log names the skill and resource-shaped paths, record them. This is
  // diagnostic only — it does not feed the scored resource dimensions, which
  // read the stated declaration.
  const observedReads = [];
  const scanText = `${String(disp.stdout || '')}\n${responseText}`;
  if (skillId && scanText.includes(skillId)) {
    const m = scanText.match(/(?:code-[a-z]+|references|assets)\/[A-Za-z0-9_./*-]+/g);
    if (m) observedReads.push(...new Set(m));
  }

  const result = {
    mode: 'live',
    parseable: responseText.trim().length > 0,
    observedIntents: routed.present ? routed.intents : [],
    observedResources: [...new Set(statedResources)],
    observedAssets: [...new Set(statedAssets)],
    observedSurface: statedSurface,
    statedRoutingCorrect: null,
    // Unobservable on codex (no tool_use stream) — recorded null, not a miss.
    activation: null,
    missingResources: [],
    raw: {
      transport: 'codex',
      eventCount: 0,
      lastMessagePresent: !!(disp.lastMessage && disp.lastMessage.length),
      observedReads: [...new Set(observedReads)],
      stated,
      responseText: responseText.slice(0, GRADED_RESPONSE_MAX_CHARS),
    },
  };

  if (routed.present) {
    result.observedWorkflowMode = routed.workflowMode.length === 1 ? routed.workflowMode[0] : routed.workflowMode;
    result.routeDeclaration = { present: true };
    result.raw.routeTelemetry = {
      observed: true,
      source: 'codex-declaration',
      workflowMode: routed.workflowMode,
    };
  } else if (requireRouteDeclaration) {
    result.routeDeclaration = { present: false, reason: 'route-declaration-missing' };
    result.raw.routeTelemetry = { observed: false, reason: 'route-declaration-missing' };
  }

  return result;
}

/**
 * Executor entrypoint called by executor-dispatch.cjs (live branch, codex).
 * Dispatches the routing-analysis scenario through the runtime codex helper at
 * the configured effort; on a timeout it retries ONCE at a lower fallback effort
 * (default 'high') so an xhigh stall degrades to a scored result instead of a
 * null, with the fallback flagged in raw for the report.
 *
 * @param {Object} [args] - Scenario inputs.
 * @param {Object} args.scenario - Scenario to run live.
 * @param {string} args.skillRoot - Absolute path to the skill root.
 * @returns {Object} Normalized observed-result for the scorer.
 */
function runCodexScenario({ scenario, skillRoot } = {}) {
  const skillId = path.basename(skillRoot || '');
  const prompt = buildLiveDispatchPrompt(scenario, skillId);
  const requireRouteDeclaration = hasRouteGold(scenario && scenario.expected);
  // Mirror live-executor's project-dir computation exactly for cross-transport parity.
  const cwd = skillRoot ? path.resolve(skillRoot, '..', '..', '..') : process.cwd();

  let disp = dispatchCodex({ prompt, cwd });
  let usedFallback = false;
  const fallbackEffort = process.env.SKILL_BENCH_CODEX_EFFORT_FALLBACK || 'high';
  if (disp.timedOut && fallbackEffort && fallbackEffort !== disp.effort) {
    usedFallback = true;
    disp = dispatchCodex({ prompt, cwd, effort: fallbackEffort });
  }

  const dispatchFailed = disp.error
    || (disp.status !== 0 && disp.status !== null && disp.timedOut === false)
    || (!disp.lastMessage && !disp.stdout);
  if (dispatchFailed) {
    const result = {
      mode: 'live', parseable: false, observedIntents: [], observedResources: [],
      observedSurface: null, statedRoutingCorrect: null, activation: null,
      missingResources: [],
      error: disp.error || (disp.timedOut ? 'dispatch timed out' : `dispatch exit ${disp.status}`),
      raw: {
        transport: 'codex', model: disp.model, effort: disp.effort, tier: disp.tier,
        usedFallback, timedOut: disp.timedOut, stderr: (disp.stderr || '').slice(0, 500),
      },
    };
    if (requireRouteDeclaration) {
      result.routeDeclaration = { present: false, reason: disp.timedOut ? 'dispatch-timed-out' : 'dispatch-failed' };
      result.raw.routeTelemetry = { observed: false, reason: 'dispatch-failed' };
    }
    return result;
  }

  const result = parseCodexResult(disp, { skillId, requireRouteDeclaration });
  result.raw.model = disp.model;
  result.raw.effort = disp.effort;
  result.raw.tier = disp.tier;
  result.raw.usedFallback = usedFallback;
  result.raw.timedOut = disp.timedOut;
  // Cross-transport fidelity: codex has no tool_use stream, so activation and
  // observed-reads are diagnostic-only here; routing-declaration dims are the
  // comparable signal against the opencode transport.
  result.raw.fidelity = 'stated-declaration primary; codex emits no tool_use stream so activation/observed-reads are unmeasured';
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { runCodexScenario, parseCodexResult };

if (require.main === module) {
  const args = require('./_args.cjs').parse(process.argv.slice(2));
  if (args['parse-file']) {
    const fs = require('fs');
    const out = parseCodexResult(
      { lastMessage: fs.readFileSync(args['parse-file'], 'utf8'), stdout: '' },
      { skillId: args.skill || 'sk-code', requireRouteDeclaration: args['require-route'] === true },
    );
    process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
    process.exit(0);
  }
  process.stderr.write('usage: codex-executor.cjs --parse-file <last-message.txt> [--skill <id>] [--require-route]\n');
  process.exit(2);
}
