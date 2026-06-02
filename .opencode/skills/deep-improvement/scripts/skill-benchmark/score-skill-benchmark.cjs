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

const { scoreD1Inter } = require('./advisor-probe.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const WEIGHTS = { d1inter: 12, d1intra: 13, d2: 20, d3: 15, d4: 25, d5: 15 };
// D1-intra favors resource recall because useful skill routing depends more on
// loading the right guidance than on matching an internal intent label.
const D1_INTRA_INTENT_WEIGHT = 0.4;
const D1_INTRA_RESOURCE_WEIGHT = 0.6;
const SURFACE_MISMATCH_D1_CAP = 0.25;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function setRecall(expected, actual) {
  if (!expected || expected.length === 0) return null; // not applicable
  const have = new Set(actual || []);
  const hit = expected.filter((e) => have.has(e)).length;
  return hit / expected.length;
}

function normalizeScenarioInput(arg) {
  let { scenarioId, tier, routerResult, expected, advisorResult } = arg;
  const scenario = arg.scenario || null;
  if (scenario && arg.observed) {
    const obs = arg.observed;
    scenarioId = scenario.scenarioId;
    tier = scenario.tier || tier || (obs.mode === 'live' ? 'live' : 'playbook');
    routerResult = {
      parseable: obs.parseable !== false,
      intents: obs.observedIntents || [],
      resources: obs.observedResources || [],
      missingResources: obs.missingResources || [],
    };
    expected = {
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
      negativeActivation: scenario.negativeActivation === true,
    };
  }
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

function scoreD2({ negative, d1intra, resourceRecall }) {
  return {
    score: negative ? d1intra.score : (resourceRecall == null ? 1 : resourceRecall),
    proxy: 'router-replay-recall',
    note: 'Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR',
  };
}

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

function firstFailingStage({ dims, routerResult, surfaceMatch }) {
  if (dims.d1inter.score !== null && dims.d1inter.score < 0.5) return 'activated-inter';
  if (!routerResult.parseable) return 'router-unparseable';
  if (surfaceMatch === false) return 'surface-mismatch';
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

  // First failing stage (funnel): advisor activate -> router parse -> surface -> intra -> discovery.
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
    expectedSurface, observedSurface, surfaceMatch,
    traceMode: arg.traceMode || (obs ? obs.mode : undefined),
    liveEvidence,
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
  const rows = scenarioRows.filter(Boolean);
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
  const gateFailed = connectivity.gateFailed;
  let verdict;
  if (gateFailed) verdict = 'BLOCKED-BY-STRUCTURE';
  else if (aggregateScore == null) verdict = 'NO-SCENARIOS';
  else if (aggregateScore >= 80) verdict = 'PASS';
  else if (aggregateScore >= 50) verdict = 'CONDITIONAL';
  else verdict = 'FAIL';

  // Bottlenecks: D5 findings + any scenario stage failures, ranked by severity.
  const bottlenecks = [...connectivity.findings];
  if (headlineBottleneck) {
    bottlenecks.unshift({
      class: 'funnel_attrition', severity: 'P1', stage: headlineBottleneck[0],
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
    gate: { d5Score: d5, gateFailed, reason: gateFailed ? 'D5 structural hard-gate failure' : null },
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
      note: 'Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.',
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = { scoreScenario, aggregate, computeDivergence, WEIGHTS };
