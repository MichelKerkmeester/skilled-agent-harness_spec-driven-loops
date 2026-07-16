#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ executor-dispatch — orchestrator-to-executor seam, normalized results    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * executor-dispatch.cjs — the seam between the orchestrator and the three
 * scenario executors. It normalizes every executor's output into ONE observed
 * result the scorer consumes, so the orchestrator never branches on executor
 * internals.
 *
 *   classKind routing/advisor + trace-mode router          → routeSkillResources (deterministic)
 *   classKind routing/advisor + trace-mode live            → live-executor.cjs (cli-opencode)
 *   classKind routing/advisor + trace-mode live + codex    → codex-executor.cjs (cli-codex via runtime)
 *   classKind browser                                      → browser-executor.cjs (bdg)
 *
 * The live/browser executors are lazy-required so router mode stays
 * dependency-free and CI-safe even before those siblings ship.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const path = require('path');
const { routeSkillResources } = require('./router-replay.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Selected-map union bundle cap: a normal query stays inside the top two
// selected workflow modes, mirroring validate-playbook-topology.cjs's own
// simultaneous-mode cap. A fixed numeric cap on resource COUNT would break a
// legitimate wide-bundle scenario (a mode can legitimately carry many leaves),
// so the cap is structural (mode count) and bypassed only by the named
// `fullInventoryIntent` flag below, never inferred from the resource count.
const MAX_WORKFLOW_MODES = 2;

// ─────────────────────────────────────────────────────────────────────────────
// 3. RESOURCE-CONTRACT HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cap the router's selected workflow modes to the union bundle limit, in the
 * router's own scored order, unless the scenario explicitly opts into the
 * full-inventory intent.
 *
 * @param {Object} args - Cap inputs.
 * @param {string[]} args.intents - Router-selected intents (workflowModes for a manifest-bearing skill).
 * @param {boolean} args.fullInventoryIntent - Explicit bypass flag; never inferred.
 * @returns {string[]} The capped (or full, when bypassed) workflow-mode selection.
 */
function cappedWorkflowModes({ intents, fullInventoryIntent }) {
  const modes = Array.isArray(intents) ? intents : [];
  return fullInventoryIntent ? modes : modes.slice(0, MAX_WORKFLOW_MODES);
}

/**
 * Re-key the router's uncapped typed-pair bundle onto the capped workflow-mode
 * selection. A no-op (returns null) unless the target skill produced a
 * resourceContract at all, i.e. it ships a leaf-manifest.json — every other
 * skill's dispatch stays exactly as it was before this contract existed.
 *
 * @param {Object} args - Bundle inputs.
 * @param {Object} args.router - The routeSkillResources() result.
 * @param {Object} args.scenario - The scenario being dispatched.
 * @returns {{resourceContractVersion:number,workflowModes:string[],fullInventoryIntent:boolean,pairs:Array,unresolved:string[]}|null} Capped bundle, or null when not applicable.
 */
function buildTypedResourceContract({ router, scenario }) {
  const uncapped = router && router.resourceContract;
  if (!uncapped) return null;
  const fullInventoryIntent = !!(scenario && scenario.fullInventoryIntent === true);
  const workflowModes = cappedWorkflowModes({ intents: router.intents, fullInventoryIntent });
  const selected = new Set(workflowModes);
  return {
    resourceContractVersion: uncapped.resourceContractVersion,
    workflowModes,
    fullInventoryIntent,
    pairs: uncapped.pairs.filter((pair) => selected.has(pair.workflowMode)),
    unresolved: uncapped.unresolved,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Normalized observed-result the scorer consumes regardless of executor:
 * {
 *   mode, executor, classKind,
 *   parseable: bool,
 *   observedIntents: string[],
 *   observedResources: string[],   // router: routed refs; live: stated/observed refs
 *   observedSurface: string|null,
 *   statedRoutingCorrect: bool|null,
 *   activation: { activated: bool, topSkill: string|null } | null,
 *   missingResources: string[],
 *   routedOut?: bool, reason?: string, error?: string,
 *   raw: object
 * }
 *
 * @param {Object} [args] - Dispatch inputs.
 * @param {Object} args.scenario - Scenario to execute.
 * @param {string} args.skillRoot - Absolute path to the skill root.
 * @param {string} args.traceMode - Trace mode ('live' or router/CI default).
 * @param {string} [args.executor] - Optional executor override for live mode.
 * @returns {Object} Normalized observed-result for the scorer.
 */
function dispatchScenario({ scenario, skillRoot, traceMode, executor } = {}) {
  const classKind = scenario.classKind || 'routing';

  if (classKind === 'browser') {
    // Browser scenarios need a real browser (bdg). Run them only in live mode;
    // in router (CI) mode keep them routed-out so the gate stays deterministic
    // and offline.
    if (traceMode !== 'live') {
      return {
        mode: 'browser', classKind, executor: 'browser-executor',
        parseable: false, observedIntents: [], observedResources: [], observedSurface: null,
        statedRoutingCorrect: null, activation: null, missingResources: [],
        routedOut: true, reason: 'browser scenario — run in live mode (needs bdg)', raw: null,
      };
    }
    return runOptionalExecutor('./browser-executor.cjs', 'executeBrowserScenario',
      { scenario, skillRoot }, { mode: 'browser', classKind });
  }

  if (traceMode === 'live') {
    // The codex transport dispatches through the runtime-owned helper (cli-codex
    // single-adapter rule); the opencode transport spawns opencode directly.
    if (executor === 'codex') {
      return runOptionalExecutor('./codex-executor.cjs', 'runCodexScenario',
        { scenario, skillRoot }, { mode: 'live', classKind, executor: 'codex-executor' });
    }
    return runOptionalExecutor('./live-executor.cjs', 'runLiveScenario',
      { scenario, skillRoot, executor }, { mode: 'live', classKind });
  }

  // Default: deterministic router-replay (the CI gate path).
  const router = routeSkillResources({ skillRoot, taskText: scenario.prompt || '' });
  const resourceContract = buildTypedResourceContract({ router, scenario });
  return {
    mode: 'router',
    executor: 'router-replay',
    classKind,
    parseable: router.parseable,
    observedIntents: router.intents || [],
    observedResources: router.resources || [],
    observedSurface: null,
    statedRoutingCorrect: null,
    activation: null,
    missingResources: router.missingResources || [],
    raw: router,
    ...(resourceContract ? { resourceContract } : {}),
  };
}

// Lazy-load a sibling executor; if it is not built yet, degrade to a recorded
// "executor-unavailable" observation rather than crashing the run.
function runOptionalExecutor(moduleRel, fnName, callArgs, base) {
  let mod;
  try {
    // eslint-disable-next-line global-require
    mod = require(path.join(__dirname, moduleRel));
  } catch (err) {
    const reason = base.mode === 'browser'
      ? 'browser harness not yet built (Phase 3)'
      : 'live executor not yet built (Phase 2)';
    return {
      ...base, executor: moduleRel.replace(/^\.\/|\.cjs$/g, ''),
      parseable: false, observedIntents: [], observedResources: [], observedSurface: null,
      statedRoutingCorrect: null, activation: null, missingResources: [],
      routedOut: base.mode === 'browser', reason, error: err.message,
      raw: null,
    };
  }
  const result = mod[fnName](callArgs);
  // Trust the sibling to return the normalized shape; backfill base fields.
  return { ...base, ...result };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { dispatchScenario, cappedWorkflowModes, buildTypedResourceContract, MAX_WORKFLOW_MODES };
