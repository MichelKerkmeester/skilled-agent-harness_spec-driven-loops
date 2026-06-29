#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ score-skill-benchmark — compute & aggregate Lane C skill-benchmark score ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * score-skill-benchmark.cjs — compute Lane C dimensions for one scenario and
 * aggregate across a scenario set.
 *
 * Mode A (router-replay, deterministic) scores the dimensions that need no live
 * model: D1-intra (in-skill routing), D2 (unprompted discovery proxy), D3
 * (efficiency proxy), D5 (structural connectivity, hard gate). D1-inter (advisor
 * selection) and D4 (usefulness ablation) require live dispatch / the advisor
 * scorer and are reported as unscored in Mode A rather than faked — the
 * aggregate is normalized over the dimensions actually measured so a Mode A
 * score is honest about its coverage.
 *
 * Converged point weights (for reference / live mode): D1=25 (inter12+intra13),
 * D2=20, D3=15, D4=25, D5=15 (gate).
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS/REQUIRES
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');
const { scoreD1Inter, scoreModePrecision, scoreRelativeAdvisorRanking } = require('./advisor-probe.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const WEIGHTS = { d1inter: 12, d1intra: 13, d2: 20, d3: 15, d4: 25, d5: 15 };
// D1-intra favors resource recall because useful skill routing depends more on
// loading the right guidance than on matching an internal intent label.
const D1_INTRA_INTENT_WEIGHT = 0.4;
const D1_INTRA_RESOURCE_WEIGHT = 0.6;
const SURFACE_MISMATCH_D1_CAP = 0.25;
const KNOWN_ROUTE_GAP_STATUS = 'known silent-default gap';
const MUTATING_TOOLS = new Set(['write', 'edit', 'bash']);
const MODE_REGISTRY_CACHE = new Map();
const FAILING_STAGE_ORDER = new Map([
  ['activated-inter', 1],
  ['router-unparseable', 2],
  ['surface-mismatch', 3],
  ['silent-default', 4],
  ['wrong-mode', 4],
  ['bundle-mismatch', 4],
  ['backend-tool-policy', 5],
  ['backend-kind-mismatch', 5],
  ['bash-allowlist', 5],
  ['routed-intra', 6],
  ['discovered', 7],
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function setRecall(expected, actual) {
  if (!expected || expected.length === 0) return null; // not applicable
  const have = new Set(actual || []);
  const hit = expected.filter((e) => have.has(e)).length;
  return hit / expected.length;
}

function scenarioObservationShape(arg) {
  return arg.scenario && arg.observed ? { scenario: arg.scenario, observed: arg.observed } : null;
}

function routeGapFromNotes(notes) {
  return !!(notes && notes.status === KNOWN_ROUTE_GAP_STATUS);
}

function hasRouteGold(expected) {
  return !!(expected && (expected.routeOutcome != null || expected.workflowMode != null));
}

function copyIfPresent(target, source, key) {
  if (target[key] === undefined && source && source[key] !== undefined) target[key] = source[key];
}

function normalizeExpectedRouteGold(expected, scenario, arg) {
  const out = expected ? { ...expected } : {};
  const scenarioExpected = scenario && scenario.expected ? scenario.expected : {};
  copyIfPresent(out, scenarioExpected, 'workflowMode');
  copyIfPresent(out, scenarioExpected, 'routeOutcome');
  copyIfPresent(out, scenarioExpected, 'forbiddenWorkflowModes');
  copyIfPresent(out, scenarioExpected, 'minimalPairGroup');
  copyIfPresent(out, scenarioExpected, 'knownRouteGap');
  copyIfPresent(out, scenarioExpected, 'toolSurface');
  copyIfPresent(out, scenarioExpected, 'rankBelowSkillIds');
  if (out.knownRouteGap !== true && !hasRouteGold(out)) {
    out.knownRouteGap = routeGapFromNotes(scenario && scenario.notes)
      || routeGapFromNotes(arg && arg.notes)
      || routeGapFromNotes(out.notes);
  }
  return out;
}

function expectedFromScenario(scenario, obs, arg) {
  const scenarioExpected = scenario.expected || {};
  return {
    skillId: scenario.expectedSkillId || scenario.skillId || arg.skillId,
    // Playbook gold is SURFACE + RESOURCES. Router intent keys are a different
    // vocabulary, so intent-key recall applies only to intent-gold skills
    // (sk-doc's expectedIntent); surface correctness is scored separately.
    intentKeys: scenario.expectedIntent ? [scenario.expectedIntent] : [],
    resources: scenario.expectedResources || [],
    // Assets are gold too, but scored on their own lane (assetRecall) — the
    // router defers assets/* on demand, so folding them into resource recall
    // would distort D2/D3.
    assets: scenario.expectedAssets || [],
    // Mode is the parent-skill routing target (advisory only); skill-id stays
    // the gate, so this rides a separate non-weighted lane.
    mode: scenario.expectedMode || (scenario.expected && scenario.expected.mode) || null,
    negativeActivation: scenario.negativeActivation === true,
    workflowMode: scenarioExpected.workflowMode,
    routeOutcome: scenarioExpected.routeOutcome,
    forbiddenWorkflowModes: scenarioExpected.forbiddenWorkflowModes,
    minimalPairGroup: scenarioExpected.minimalPairGroup,
    knownRouteGap: scenarioExpected.knownRouteGap === true,
    toolSurface: scenarioExpected.toolSurface,
    rankBelowSkillIds: scenario.expectedRankBelowSkillIds || scenarioExpected.rankBelowSkillIds,
  };
}

function routerResultFromObservation(obs) {
  return {
    parseable: obs.parseable !== false,
    intents: obs.observedIntents || [],
    resources: obs.observedResources || [],
    missingResources: obs.missingResources || [],
    routeTelemetry: (obs.raw && obs.raw.routeTelemetry) || null,
  };
}

function normalizeScenarioInput(arg) {
  let { scenarioId, tier, routerResult, expected, advisorResult } = arg;
  const shaped = scenarioObservationShape(arg);
  const scenario = shaped ? shaped.scenario : (arg.scenario || null);
  if (shaped) {
    const obs = shaped.observed;
    scenarioId = scenario.scenarioId;
    tier = scenario.tier || tier || (obs.mode === 'live' ? 'live' : 'playbook');
    routerResult = routerResultFromObservation(obs);
    expected = expectedFromScenario(scenario, obs, arg);
  }
  expected = normalizeExpectedRouteGold(expected, scenario, arg);
  return { scenarioId, tier, routerResult, expected, advisorResult, scenario };
}

function computeSurfaceMatch(scenario, obs) {
  const expectedSurface = scenario ? scenario.expectedSurface : undefined;
  const observedSurface = obs ? (obs.observedSurface || null) : undefined;
  const surfaceMatch = (expectedSurface && observedSurface)
    ? (observedSurface === expectedSurface) : null;
  return { expectedSurface, observedSurface, surfaceMatch };
}

function scoreD1Intra({ expected, routerResult, negative, surfaceMatch, intentRecall, resourceRecall }) {
  if (negative) {
    const leakedExpected = (expected.resources || []).some((r) => routerResult.resources.includes(r));
    return { score: leakedExpected ? 0 : 1, intentRecall, resourceRecall, negative: true };
  }
  const ir = intentRecall == null ? 1 : intentRecall;
  const rr = resourceRecall == null ? 1 : resourceRecall;
  const d1 = {
    score: D1_INTRA_INTENT_WEIGHT * ir + D1_INTRA_RESOURCE_WEIGHT * rr,
    intentRecall,
    resourceRecall,
    negative: false,
  };
  if (surfaceMatch === false) {
    d1.surfaceMismatch = true;
    d1.score = Math.min(d1.score, SURFACE_MISMATCH_D1_CAP);
  }
  return d1;
}

/**
 * Compute D2 discovery recall proxy for the resources surfaced by the router.
 *
 * @param {Object} params - Inputs from D1-intra and resource recall.
 * @returns {Object} D2 proxy score payload.
 */
function scoreD2({ negative, d1intra, resourceRecall }) {
  return {
    score: negative ? d1intra.score : (resourceRecall == null ? 1 : resourceRecall),
    proxy: 'router-replay-recall',
    note: 'Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR',
  };
}

/**
 * Compute D3 routing-efficiency proxy from unexpected routed resources.
 *
 * @param {Object} params - Router output and expected resources.
 * @returns {Object} D3 proxy score payload.
 */
function scoreD3({ negative, d1intra, routerResult, expected }) {
  const routed = routerResult.resources.length;
  const unexpectedRoutedCount = expected && expected.resources
    ? routerResult.resources.filter((r) => !expected.resources.includes(r)).length
    : 0;
  if (negative) {
    return {
      score: d1intra.score,
      routedCount: routed,
      // In negative scenarios, every routed resource is suppression waste.
      wastedCount: routed,
      proxy: 'negative-activation',
      note: 'negative scenario: D3 tracks the suppression outcome, not over-routing',
    };
  }
  return {
    score: routed === 0 ? 1 : Math.max(0, 1 - unexpectedRoutedCount / routed),
    routedCount: routed,
    wastedCount: unexpectedRoutedCount,
    proxy: 'router-overload',
    note: 'Mode A proxy; live-mode replaces with calls/tokens-to-first-expected',
  };
}

/**
 * Compute the advisory asset-recall lane; null scores are explicit unscored states.
 *
 * @param {Object} expected - Expected resources/assets for the scenario.
 * @param {Object} obs - Live observation, when available.
 * @returns {{score: (number|null), note: string}} Asset-recall score payload.
 */
function scoreAssetRecall(expected, obs) {
  const expectedAssets = (expected && expected.assets) || [];
  const observedAssets = obs && Array.isArray(obs.observedAssets) ? obs.observedAssets : null;
  if (expectedAssets.length === 0) {
    return { score: null, note: 'no expected assets for this scenario' };
  }
  if (observedAssets == null) {
    return { score: null, deferred: true, expectedAssets, note: 'assets deferred on-demand; not in the first slice (router mode)' };
  }
  return { score: setRecall(expectedAssets, observedAssets), expectedAssets, observedAssets, note: 'live stated-asset recall (advisory, not weighted)' };
}

function uniqueArray(values) {
  return [...new Set(Array.isArray(values) ? values : [])];
}

function sameSet(actual, expected) {
  if (actual.length !== expected.length) return false;
  const have = new Set(actual);
  return expected.every((item) => have.has(item));
}

function normalizeRouteModes(value) {
  if (value == null) return [];
  return uniqueArray(Array.isArray(value) ? value : [value]);
}

function loadModeRegistry(skillRoot) {
  if (!skillRoot) return null;
  const registryPath = path.join(skillRoot, 'mode-registry.json');
  if (MODE_REGISTRY_CACHE.has(registryPath)) return MODE_REGISTRY_CACHE.get(registryPath);
  let registry = null;
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  } catch (_) {
    registry = null;
  }
  MODE_REGISTRY_CACHE.set(registryPath, registry);
  return registry;
}

function toolSurfaceFromRegistry({ skillRoot, workflowMode }) {
  const modes = normalizeRouteModes(workflowMode);
  if (modes.length !== 1) return null;
  const registry = loadModeRegistry(skillRoot);
  const entries = registry && Array.isArray(registry.modes) ? registry.modes : [];
  const mode = entries.find((entry) => entry && entry.workflowMode === modes[0]);
  return mode && mode.toolSurface ? mode.toolSurface : null;
}

function resolveToolSurface({ expected, skillRoot }) {
  if (expected && expected.toolSurface) return expected.toolSurface;
  if (!expected || expected.workflowMode == null) return null;
  return toolSurfaceFromRegistry({ skillRoot, workflowMode: expected.workflowMode });
}

function toolCallsFromLiveEvidence(row) {
  const toolCalls = row && row.liveEvidence && Array.isArray(row.liveEvidence.toolCalls)
    ? row.liveEvidence.toolCalls : [];
  return toolCalls.map((tool) => ({ tool }));
}

function workflowModeFromScoredRow(row) {
  if (row && row.expectedWorkflowMode != null) return row.expectedWorkflowMode;
  const expected = row && row.dims && row.dims.hubRoute && row.dims.hubRoute.expected;
  return Array.isArray(expected) && expected.length === 1 ? expected[0] : null;
}

function earlierFailingStage(current, next) {
  if (!next) return current || null;
  if (!current) return next;
  const currentOrder = FAILING_STAGE_ORDER.get(current) || Number.POSITIVE_INFINITY;
  const nextOrder = FAILING_STAGE_ORDER.get(next) || Number.POSITIVE_INFINITY;
  return nextOrder < currentOrder ? next : current;
}

function applyAggregateToolSurface(row, skillRoot) {
  const current = row && row.dims && row.dims.toolSurface;
  if (!row || (current && current.applicable) || !skillRoot) return row;
  const workflowMode = workflowModeFromScoredRow(row);
  const toolCalls = toolCallsFromLiveEvidence(row);
  if (workflowMode == null || toolCalls.length === 0) return row;

  const toolSurface = resolveToolSurface({ expected: { workflowMode }, skillRoot });
  const resolved = scoreToolSurface({ toolSurface, toolCalls });
  if (!resolved.applicable) return row;

  return {
    ...row,
    dims: { ...row.dims, toolSurface: resolved },
    firstFailingStage: resolved.pass
      ? row.firstFailingStage
      : earlierFailingStage(row.firstFailingStage, resolved.firstFailingStage),
  };
}

function metricRate(numerator, denominator, counts = {}) {
  return {
    rate: denominator > 0 ? numerator / denominator : null,
    ...counts,
    numerator,
    denominator,
  };
}

function reduceRouteTelemetry(rows) {
  const routeRows = rows.filter((r) => r && r.dims && r.dims.hubRoute && r.dims.hubRoute.applicable);
  const total = routeRows.length;
  let unobserved = 0;
  let observed = 0;
  let observedWrong = 0;
  let aliasMisses = 0;
  let unobservedBundles = 0;
  let observedBundles = 0;
  let bundleMisses = 0;

  for (const row of routeRows) {
    const expectedModes = normalizeRouteModes(row.dims.hubRoute.expected);
    const telemetry = row.routeTelemetry;
    if (!telemetry || telemetry.observed === false) {
      unobserved += 1;
      if (expectedModes.length > 1) unobservedBundles += 1;
      continue;
    }

    observed += 1;
    const actualModes = normalizeRouteModes(telemetry.workflowMode);
    const routeMatches = sameSet(actualModes, expectedModes);
    if (!routeMatches) observedWrong += 1;

    const aliases = Array.isArray(telemetry.matchedAliases) ? telemetry.matchedAliases : [];
    if (expectedModes.length > 0 && aliases.length === 0) aliasMisses += 1;

    if (expectedModes.length > 1) {
      observedBundles += 1;
      if (!routeMatches) bundleMisses += 1;
    }
  }

  const counts = { unobserved, observed, observedWrong };
  return {
    telemetryMissingRate: metricRate(unobserved, total, counts),
    routeMissRate: metricRate(observedWrong, observed, counts),
    aliasMissRate: metricRate(aliasMisses, observed, counts),
    bundleMissRate: metricRate(bundleMisses, observedBundles, {
      unobserved: unobservedBundles,
      observed: observedBundles,
      observedWrong: bundleMisses,
    }),
    routeGoldRows: total,
  };
}

function scoreHubRoute({ expected, routerResult }) {
  if (!expected || expected.routeOutcome == null || expected.workflowMode == null) {
    return { applicable: false, pass: true };
  }

  const actual = uniqueArray(routerResult && routerResult.intents);
  const forbidden = uniqueArray(expected.forbiddenWorkflowModes);
  const forbiddenHit = forbidden.some((mode) => actual.includes(mode));
  const knownGap = expected.knownRouteGap === true;

  if (expected.routeOutcome === 'defer') {
    return {
      applicable: true,
      pass: actual.length === 0 && !forbiddenHit,
      firstFailingStage: actual.length === 0 && !forbiddenHit ? null : 'wrong-mode',
      expected: [],
      actual,
      forbiddenHit,
      knownGap,
    };
  }

  if (actual.length === 0) {
    return {
      applicable: true,
      pass: false,
      firstFailingStage: 'silent-default',
      expected: Array.isArray(expected.workflowMode) ? expected.workflowMode : [expected.workflowMode],
      actual,
      forbiddenHit,
      knownGap,
    };
  }

  if (expected.routeOutcome === 'orderedBundle') {
    const expectedModes = Array.isArray(expected.workflowMode) ? uniqueArray(expected.workflowMode) : [expected.workflowMode];
    const pass = sameSet(actual, expectedModes) && !forbiddenHit;
    return {
      applicable: true,
      pass,
      firstFailingStage: pass ? null : 'bundle-mismatch',
      expected: expectedModes,
      actual,
      forbiddenHit,
      knownGap,
    };
  }

  const expectedModes = Array.isArray(expected.workflowMode) ? uniqueArray(expected.workflowMode) : [expected.workflowMode];
  const pass = expected.routeOutcome === 'single'
    && expectedModes.length === 1
    && sameSet(actual, expectedModes)
    && !forbiddenHit;
  return {
    applicable: true,
    pass,
    firstFailingStage: pass ? null : 'wrong-mode',
    expected: expectedModes,
    actual,
    forbiddenHit,
    knownGap,
  };
}

function normalizeToolName(tool) {
  return String(tool || '').trim().toLowerCase();
}

function displayToolName(tool) {
  const normalized = normalizeToolName(tool);
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : '';
}

function normalizedToolSet(values) {
  return new Set((Array.isArray(values) ? values : [])
    .map(normalizeToolName)
    .filter(Boolean));
}

function commandTextFromInput(input) {
  if (typeof input === 'string') return input.trim();
  if (!input || typeof input !== 'object') return '';
  for (const key of ['command', 'cmd', 'script']) {
    if (typeof input[key] === 'string' && input[key].trim()) return input[key].trim();
  }
  if (Array.isArray(input.args) && input.args.length) {
    return input.args.map((arg) => String(arg)).join(' ').trim();
  }
  return '';
}

function bashCommandAllowed(command, allowlist) {
  if (!command) return true;
  return allowlist.some((entry) => command === entry || command.startsWith(`${entry} `));
}

function scoreToolSurface({ toolSurface, toolCalls }) {
  if (!toolSurface || !Array.isArray(toolCalls) || toolCalls.length === 0) {
    return { applicable: false, pass: true, firstFailingStage: null, violations: [] };
  }

  const allowed = normalizedToolSet(toolSurface.allowed);
  const forbidden = normalizedToolSet(toolSurface.forbidden);
  const observed = toolCalls
    .map((call) => ({
      tool: normalizeToolName(call && call.tool),
      displayTool: displayToolName(call && call.tool),
      input: call && call.input,
    }))
    .filter((call) => call.tool);
  if (observed.length === 0) {
    return { applicable: false, pass: true, firstFailingStage: null, violations: [] };
  }

  const policyViolations = observed
    .filter((call) => forbidden.has(call.tool) || (allowed.size > 0 && !allowed.has(call.tool)))
    .map((call) => ({
      class: 'backend-tool-policy',
      tool: call.displayTool,
      reason: forbidden.has(call.tool) ? 'forbidden tool used' : 'tool outside allowed surface',
    }));
  if (policyViolations.length) {
    return {
      applicable: true,
      pass: false,
      firstFailingStage: 'backend-tool-policy',
      violations: policyViolations,
    };
  }

  const kindViolations = observed
    .filter((call) => toolSurface.mutatesWorkspace === false && MUTATING_TOOLS.has(call.tool))
    .map((call) => ({
      class: 'backend-kind-mismatch',
      tool: call.displayTool,
      reason: 'non-mutating backend used a mutating tool',
    }));
  if (kindViolations.length) {
    return {
      applicable: true,
      pass: false,
      firstFailingStage: 'backend-kind-mismatch',
      violations: kindViolations,
    };
  }

  const bashAllowlist = (Array.isArray(toolSurface.bashAllowlist) ? toolSurface.bashAllowlist : [])
    .map((entry) => String(entry).trim())
    .filter(Boolean);
  const skippedBashAllowlistChecks = [];
  const bashViolations = [];
  if (bashAllowlist.length > 0) {
    observed
      .filter((call) => call.tool === 'bash')
      .forEach((call) => {
        const command = commandTextFromInput(call.input);
        if (!command) {
          skippedBashAllowlistChecks.push({ tool: call.displayTool, reason: 'missing command text' });
          return;
        }
        if (!bashCommandAllowed(command, bashAllowlist)) {
          bashViolations.push({
            class: 'bash-allowlist',
            tool: call.displayTool,
            command,
            reason: 'bash command outside allowlist',
          });
        }
      });
  }
  if (bashViolations.length) {
    return {
      applicable: true,
      pass: false,
      firstFailingStage: 'bash-allowlist',
      violations: bashViolations,
      skippedBashAllowlistChecks,
    };
  }

  return {
    applicable: true,
    pass: true,
    firstFailingStage: null,
    violations: [],
    skippedBashAllowlistChecks,
  };
}

function firstFailingStage({ dims, routerResult, surfaceMatch }) {
  if (dims.d1inter.score !== null && dims.d1inter.score < 0.5) return 'activated-inter';
  if (!routerResult.parseable) return 'router-unparseable';
  if (surfaceMatch === false) return 'surface-mismatch';
  if (dims.hubRoute && dims.hubRoute.applicable && !dims.hubRoute.pass) return dims.hubRoute.firstFailingStage;
  if (dims.toolSurface && dims.toolSurface.applicable && !dims.toolSurface.pass) return dims.toolSurface.firstFailingStage;
  if (dims.d1intra.score < 0.5) return 'routed-intra';
  if (dims.d2.score < 0.5) return 'discovered';
  return null;
}

function modeAScore(dims) {
  const measured = [
    [dims.d1intra.score, WEIGHTS.d1intra],
    [dims.d2.score, WEIGHTS.d2],
    [dims.d3.score, WEIGHTS.d3],
  ];
  if (dims.d1inter.score !== null) measured.push([dims.d1inter.score, WEIGHTS.d1inter]);
  const wsum = measured.reduce((a, [, w]) => a + w, 0);
  // Round once after weighted normalization so the row score stays stable.
  return Math.round((measured.reduce((a, [s, w]) => a + s * w, 0) / wsum) * 100);
}

function buildLiveEvidence(obs) {
  if (!obs || !obs.raw) return undefined;
  return {
    eventCount: obs.raw.eventCount,
    activated: obs.activation ? obs.activation.activated : undefined,
    toolCalls: (obs.raw.toolCalls || []).map((t) => t.tool),
    observedReads: obs.raw.observedReads,
    statedRoutingParsed: !!(obs.raw.stated && Object.keys(obs.raw.stated).length),
    responseHead: (obs.raw.responseText || '').slice(0, 300),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Score a single scenario from its router-replay result joined with private gold.
 * @param {Object} arg - Scenario input (legacy {scenarioId,tier,routerResult,expected,advisorResult} or new {scenario,observed,traceMode}).
 * @returns {{ scenarioId, dims, firstFailingStage, modeAScore, applicable }}
 */
function scoreScenario(arg) {
  const { scenarioId, tier, routerResult, expected, advisorResult, scenario } = normalizeScenarioInput(arg);
  // Surface correctness is meaningful only when an executor observed a surface
  // (live mode); router mode leaves observedSurface null. Computed up front so a
  // wrong observed surface can fail routing rather than passing on incidental
  // resource overlap.
  const obs = arg.observed || null;
  const { expectedSurface, observedSurface, surfaceMatch } = computeSurfaceMatch(scenario, obs);

  const dims = {};
  const negative = expected && expected.negativeActivation === true;

  // D1-intra: did the in-skill router select the expected intents + resources?
  const intentRecall = setRecall(expected && expected.intentKeys, routerResult.intents);
  const resourceRecall = setRecall(expected && expected.resources, routerResult.resources);
  dims.d1intra = scoreD1Intra({ expected, routerResult, negative, surfaceMatch, intentRecall, resourceRecall });

  // D2 proxy (Mode A): recall of expected resources in the routed set. In live
  // mode this is replaced by Hit@k/Recall@k/MRR over the observed load trace.
  dims.d2 = scoreD2({ negative, d1intra: dims.d1intra, resourceRecall });

  // D3 efficiency proxy (Mode A): penalize over-routing — resources routed that
  // are not in the expected set are "wasted loads". Live mode uses tool-call /
  // token cost to first expected resource.
  // For a negative scenario the "expected" resources are the ones that must NOT
  // be routed, so the over-routing math inverts (routing them reads as zero
  // waste). Couple D3 to the suppression outcome instead, mirroring D2.
  dims.d3 = scoreD3({ negative, d1intra: dims.d1intra, routerResult, expected });

  // Asset support lane (advisory, not in the weighted aggregate). The router
  // defers assets/* on demand, so they are scored separately instead of inside
  // D2/D3. Router mode has no observed-asset channel (assets are not in the
  // first slice), so it reports deferred; live mode scores stated-asset recall.
  dims.assetRecall = scoreAssetRecall(expected, obs);

  // D1-inter: scored deterministically when an advisor probe is supplied (the
  // Python advisor reads the SQLite graph, no LLM), else left unscored.
  if (advisorResult) {
    const inter = scoreD1Inter({ advisorResult, expectedSkillId: expected && expected.skillId, negative });
    dims.d1inter = inter.ok
      ? { score: inter.score, rank: inter.rank, topSkill: inter.topSkill }
      : { score: null, unscored: 'advisor probe failed', error: advisorResult.error };
  } else {
    dims.d1inter = { score: null, unscored: 'no advisor probe (run with --advisor-mode=python)' };
  }
  // D4 usefulness ablation: still needs live skill-on/off dispatch (follow-on).
  dims.d4 = { score: null, unscored: 'requires skill-on/off ablation (live mode)' };

  // Mode-precision (ADVISORY, never gated): for parent-skill fixtures the gate
  // is skill-id (D1-inter); this only reports whether the advisor's resolved
  // deep-loop mode matches the fixture's expected.mode. Scored when the
  // orchestrator supplies a mode-routing probe, else unscored. The parity
  // fixtures remain the authoritative mode-precision check.
  dims.modePrecision = scoreModePrecision({
    modeRouting: arg.modeRouting,
    expectedMode: expected && expected.mode,
  });
  dims.relativeRanking = scoreRelativeAdvisorRanking({
    advisorResult,
    expectedSkillId: expected && expected.skillId,
    rankBelowSkillIds: expected && expected.rankBelowSkillIds,
  });

  // Hard route-gold lane: fail closed only when route gold is present.
  dims.hubRoute = scoreHubRoute({ expected, routerResult });
  dims.toolSurface = scoreToolSurface({
    toolSurface: resolveToolSurface({ expected, skillRoot: arg.skillRoot }),
    toolCalls: obs && obs.raw && obs.raw.toolCalls,
  });

  // First failing stage (funnel): advisor activate -> router parse -> surface -> route gold -> tool surface -> intra -> discovery.
  const failingStage = firstFailingStage({ dims, routerResult, surfaceMatch });

  // Mode A scenario score: weight the measured dims, normalize over their weights.
  // D1-inter joins the measured set only when an advisor probe produced a score.
  const score = modeAScore(dims);

  // Trimmed live evidence so a live report is inspectable (what the model
  // actually did) without bloating the JSON with full transcripts.
  const liveEvidence = buildLiveEvidence(obs);

  return {
    scenarioId, tier, dims, firstFailingStage: failingStage, modeAScore: score, applicable: true,
    classKind: scenario ? scenario.classKind : undefined,
    expectedWorkflowMode: expected && expected.workflowMode,
    expectedSurface, observedSurface, surfaceMatch,
    traceMode: arg.traceMode || (obs ? obs.mode : undefined),
    liveEvidence,
    routeTelemetry: routerResult.routeTelemetry || null,
  };
}

/**
 * A↔B divergence: the 122-research finding class — the router can reach a
 * resource but the live model doesn't (the skill doesn't signpost it inline),
 * or vice versa. Compared per scenario from a router observation and a live
 * observation of the SAME scenario.
 * @param {Object} params - Comparison input.
 * @param {string} params.scenarioId - Scenario identifier.
 * @param {Object} params.routerObserved - Router-mode observation for the scenario.
 * @param {Object} params.liveObserved - Live-mode observation for the same scenario.
 * @returns {{ scenarioId, resourceDelta:{onlyRouter:string[],onlyLive:string[]}, surfaceAgree:boolean|null, severity:string }}
 */
function computeDivergence({ scenarioId, routerObserved, liveObserved }) {
  const rRefs = new Set((routerObserved && routerObserved.observedResources) || []);
  const lRefs = new Set((liveObserved && liveObserved.observedResources) || []);
  const onlyRouter = [...rRefs].filter((r) => !lRefs.has(r));
  const onlyLive = [...lRefs].filter((r) => !rRefs.has(r));
  const rSurface = routerObserved && routerObserved.observedSurface;
  const lSurface = liveObserved && liveObserved.observedSurface;
  const surfaceAgree = (rSurface && lSurface) ? (rSurface === lSurface) : null;
  const delta = onlyRouter.length + onlyLive.length;
  const severity = delta === 0 && surfaceAgree !== false ? 'none' : (delta > 4 || surfaceAgree === false ? 'high' : 'low');
  return { scenarioId, resourceDelta: { onlyRouter, onlyLive }, surfaceAgree, severity };
}

/**
 * Aggregate scenario rows + the D5 connectivity result into a report object.
 * @param {Object} params - Aggregation input.
 * @param {string} params.skillId - Target skill identifier.
 * @param {string} params.skillRoot - Target skill root path.
 * @param {Array} params.scenarioRows - Per-scenario score rows.
 * @param {Object} params.connectivity - D5 structural connectivity result.
 * @param {string} [params.traceMode] - Trace mode ('router' or 'live').
 * @param {Array} [params.lintFindings] - Lint findings to attach.
 * @param {Array} [params.divergence] - A↔B divergence rows to attach.
 * @returns {Object} Skill-benchmark report object.
 */
function aggregate({ skillId, skillRoot, scenarioRows, connectivity, traceMode, lintFindings, divergence }) {
  const rows = scenarioRows.filter(Boolean).map((row) => applyAggregateToolSurface(row, skillRoot));
  const avg = (sel) => {
    const vals = rows.map(sel).filter((v) => typeof v === 'number');
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  };
  // Per-classKind coverage. Browser scenarios are routed out of the text
  // executors; routed-out rows enter neither the funnel nor the score average.
  const coverage = { routing: 0, advisor: 0, browser: 0, routedOut: 0, scored: 0 };
  for (const r of rows) {
    const k = r.classKind || 'routing';
    if (coverage[k] !== undefined) coverage[k] += 1;
    if (r.routedOut) coverage.routedOut += 1;
    else if (typeof r.modeAScore === 'number') coverage.scored += 1;
  }
  // Funnel attrition: count first-failing-stage occurrences (scored rows only).
  const funnel = {};
  for (const r of rows) {
    if (r.routedOut) continue;
    const stage = r.firstFailingStage || 'passed';
    funnel[stage] = (funnel[stage] || 0) + 1;
  }
  const headlineBottleneck = Object.entries(funnel)
    .filter(([k]) => k !== 'passed')
    .sort((a, b) => b[1] - a[1])[0] || null;
  const hubRouteFailures = rows
    .filter((r) => r.dims && r.dims.hubRoute && r.dims.hubRoute.applicable && !r.dims.hubRoute.pass)
    .map((r) => r.dims.hubRoute);
  const hubRouteRegressions = hubRouteFailures.filter((h) => h.knownGap !== true).length;
  const hubRouteKnownGaps = hubRouteFailures.filter((h) => h.knownGap === true).length;
  const hubRouteGate = {
    failed: hubRouteRegressions > 0,
    regressions: hubRouteRegressions,
    knownGaps: hubRouteKnownGaps,
    reason: hubRouteRegressions > 0 ? 'route-gold regression' : null,
  };
  const toolSurfaceFailures = rows
    .filter((r) => r.dims && r.dims.toolSurface && r.dims.toolSurface.applicable && !r.dims.toolSurface.pass);
  const toolSurfaceViolations = toolSurfaceFailures.flatMap((r) => (r.dims.toolSurface.violations || [])
    .map((violation) => ({ scenarioId: r.scenarioId, ...violation })));
  const toolSurfaceGate = {
    failed: toolSurfaceViolations.length > 0,
    violations: toolSurfaceViolations,
    reason: toolSurfaceViolations.length > 0 ? 'tool-surface violation' : null,
  };

  const d5 = connectivity.score;
  const aggregateScore = avg((r) => r.modeAScore);
  // D1-inter is scored only when advisor probes ran; avg() returns null if no row
  // carried a numeric D1-inter score, so the dimension self-reports its coverage.
  const d1interAvg = avg((r) => (r.dims && r.dims.d1inter && typeof r.dims.d1inter.score === 'number'
    ? Math.round(r.dims.d1inter.score * 100) : null));
  // Advisory signals — surfaced but NOT folded into the weighted aggregate (so
  // the v1 dimension weights/verdict are unchanged). D4_task_outcome is attached
  // to rows by the orchestrator's opt-in D4-R ablation pass; assetRecall comes
  // from the per-scenario asset lane.
  const d4TaskAvg = avg((r) => (r.d4TaskOutcome && typeof r.d4TaskOutcome.score === 'number'
    ? Math.round(r.d4TaskOutcome.score * 100) : null));
  const assetRecallAvg = avg((r) => (r.dims && r.dims.assetRecall && typeof r.dims.assetRecall.score === 'number'
    ? Math.round(r.dims.assetRecall.score * 100) : null));
  // Mode-precision advisory: share of scored rows whose advisor-resolved mode
  // matched the fixture's expected.mode. Never folded into aggregateScore.
  const modePrecisionAvg = avg((r) => (r.dims && r.dims.modePrecision && typeof r.dims.modePrecision.score === 'number'
    ? Math.round(r.dims.modePrecision.score * 100) : null));
  const relativeRankingAvg = avg((r) => (r.dims && r.dims.relativeRanking && typeof r.dims.relativeRanking.score === 'number'
    ? Math.round(r.dims.relativeRanking.score * 100) : null));
  const relativeRankingSignal = relativeRankingAvg === null
    ? { score: null, status: 'unscored (no advisor probe or no rank-below gold)', note: 'advisor target rank relative to sibling transports; advisory, not weighted' }
    : { score: relativeRankingAvg, note: 'advisor target rank relative to sibling transports; advisory, not weighted' };
  const routeTelemetry = reduceRouteTelemetry(rows);
  const gateFailed = connectivity.gateFailed;
  let verdict;
  if (gateFailed) verdict = 'BLOCKED-BY-STRUCTURE';
  else if (hubRouteGate.failed) verdict = 'BLOCKED-BY-ROUTING';
  else if (toolSurfaceGate.failed) verdict = 'BLOCKED-BY-TOOL-SURFACE';
  else if (aggregateScore == null) verdict = 'NO-SCENARIOS';
  else if (aggregateScore >= 80) verdict = 'PASS';
  else if (aggregateScore >= 50) verdict = 'CONDITIONAL';
  else verdict = 'FAIL';

  // Bottlenecks: D5 findings + any scenario stage failures, ranked by severity.
  const bottlenecks = [...connectivity.findings];
  if (headlineBottleneck) {
    const onlyKnownRouteGaps = hubRouteGate.regressions === 0
      && hubRouteGate.knownGaps > 0
      && ['silent-default', 'wrong-mode', 'bundle-mismatch'].includes(headlineBottleneck[0]);
    bottlenecks.unshift({
      class: onlyKnownRouteGaps ? 'routing_known_gap' : 'funnel_attrition',
      severity: onlyKnownRouteGaps ? 'P3' : 'P1',
      stage: headlineBottleneck[0],
      detail: `${headlineBottleneck[1]} scenario(s) first fail at stage '${headlineBottleneck[0]}'`,
    });
  }

  return {
    schemaVersion: 'skill-benchmark-report.v1',
    status: 'skill-benchmark-complete',
    mode: 'skill-benchmark',
    scoringMethod: (traceMode || 'router') === 'live' ? 'mode-b-live' : 'mode-a-router-replay',
    traceMode: traceMode || 'router',
    targetSkill: { id: skillId, root: skillRoot },
    verdict,
    aggregateScore,
    gate: {
      d5Score: d5,
      gateFailed,
      reason: gateFailed ? 'D5 structural hard-gate failure' : null,
      hubRoute: hubRouteGate,
      toolSurface: toolSurfaceGate,
    },
    dimensionScores: {
      D1inter: d1interAvg === null
        ? { points: WEIGHTS.d1inter, score: null, status: 'unscored-mode-a' }
        : { points: WEIGHTS.d1inter, score: d1interAvg },
      D1intra: { points: WEIGHTS.d1intra, score: avg((r) => (r.dims && r.dims.d1intra ? Math.round(r.dims.d1intra.score * 100) : null)) },
      D2: { points: WEIGHTS.d2, score: avg((r) => (r.dims && r.dims.d2 ? Math.round(r.dims.d2.score * 100) : null)) },
      D3: { points: WEIGHTS.d3, score: avg((r) => (r.dims && r.dims.d3 ? Math.round(r.dims.d3.score * 100) : null)) },
      D4: { points: WEIGHTS.d4, score: null, status: 'unscored-mode-a' },
      D5: { points: WEIGHTS.d5, score: d5, hardGate: true },
    },
    unscoredDimensions: d1interAvg === null ? ['D1inter', 'D4'] : ['D4'],
    advisorySignals: {
      D4_task_outcome: d4TaskAvg === null
        ? { score: null, status: 'unscored (run --d4 in live mode)', note: 'task-outcome usefulness delta; separate from D4 hallucination, never summed into it' }
        : { score: d4TaskAvg, note: 'task-outcome usefulness delta (skill-on vs off), separate from D4 hallucination' },
      assetRecall: assetRecallAvg === null
        ? { score: null, status: 'deferred (router) or no asset gold', note: 'deferred-asset support recall; advisory, not weighted' }
        : { score: assetRecallAvg, note: 'deferred-asset support recall; advisory, not weighted' },
      modePrecision: modePrecisionAvg === null
        ? { score: null, status: 'unscored (no mode-routing probe or no expected.mode)', note: 'advisor deep-loop mode match vs fixture expected.mode; advisory, gate stays skill-id' }
        : { score: modePrecisionAvg, note: 'advisor deep-loop mode match vs fixture expected.mode; advisory, gate stays skill-id' },
      relativeRanking: relativeRankingSignal,
      routeTelemetry,
    },
    funnel,
    headlineBottleneck: headlineBottleneck ? headlineBottleneck[0] : null,
    bottlenecks,
    coverage,
    divergence: divergence || [],
    lintFindings: lintFindings || [],
    scenarioRows: rows,
    runQuality: {
      scenarioCount: rows.length,
      traceMode: traceMode || 'router',
      hubRouteKnownGaps,
      relativeRanking: relativeRankingSignal,
      routeTelemetry,
      note: 'Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.',
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { scoreScenario, aggregate, computeDivergence, reduceRouteTelemetry, scoreToolSurface, WEIGHTS };
