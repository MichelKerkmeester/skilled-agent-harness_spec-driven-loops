#!/usr/bin/env node
'use strict';

/**
 * executor-dispatch.cjs — the seam between the orchestrator and the three
 * scenario executors. It normalizes every executor's output into ONE observed
 * result the scorer consumes, so the orchestrator never branches on executor
 * internals.
 *
 *   classKind routing/advisor + trace-mode router → routeSkillResources (deterministic)
 *   classKind routing/advisor + trace-mode live   → live-executor.cjs (cli-opencode)
 *   classKind browser                             → browser-executor.cjs (bdg)
 *
 * The live/browser executors are lazy-required so router mode stays
 * dependency-free and CI-safe even before those siblings ship.
 */

const path = require('path');
const { routeSkillResources } = require('./router-replay.cjs');

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
    return runOptionalExecutor('./live-executor.cjs', 'runLiveScenario',
      { scenario, skillRoot, executor }, { mode: 'live', classKind });
  }

  // Default: deterministic router-replay (the CI gate path).
  const router = routeSkillResources({ skillRoot, taskText: scenario.prompt || '' });
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

module.exports = { dispatchScenario };
