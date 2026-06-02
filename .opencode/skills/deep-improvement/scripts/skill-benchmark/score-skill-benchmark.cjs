#!/usr/bin/env node
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

const { scoreD1Inter } = require('./advisor-probe.cjs');

const WEIGHTS = { d1inter: 12, d1intra: 13, d2: 20, d3: 15, d4: 25, d5: 15 };

function setRecall(expected, actual) {
  if (!expected || expected.length === 0) return null; // not applicable
  const have = new Set(actual || []);
  const hit = expected.filter((e) => have.has(e)).length;
  return hit / expected.length;
}

/**
 * Score a single scenario from its router-replay result joined with private gold.
 * @returns {{ scenarioId, dims, firstFailingStage, modeAScore, applicable }}
 */
function scoreScenario(arg) {
  let { scenarioId, tier, routerResult, expected, advisorResult } = arg;
  // Back-compat adapter. Legacy callers pass {routerResult, expected}; the
  // playbook/live path passes {scenario, observed, traceMode}. Normalize the new
  // shape onto the legacy locals so the scoring body stays shared (and the
  // existing unit tests keep exercising it unchanged).
  let scenario = arg.scenario || null;
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
  // Surface correctness is meaningful only when an executor observed a surface
  // (live mode); router mode leaves observedSurface null. Computed up front so a
  // wrong observed surface can fail routing rather than passing on incidental
  // resource overlap.
  const obs = arg.observed || null;
  const expectedSurface = scenario ? scenario.expectedSurface : undefined;
  const observedSurface = obs ? (obs.observedSurface || null) : undefined;
  const surfaceMatch = (expectedSurface && observedSurface)
    ? (observedSurface === expectedSurface) : null;

  const dims = {};
  const negative = expected && expected.negativeActivation === true;

  // D1-intra: did the in-skill router select the expected intents + resources?
  const intentRecall = setRecall(expected && expected.intentKeys, routerResult.intents);
  const resourceRecall = setRecall(expected && expected.resources, routerResult.resources);
  if (negative) {
    // For a should-not-activate scenario, routing nothing relevant is success.
    const leakedExpected = (expected.resources || []).some((r) => routerResult.resources.includes(r));
    dims.d1intra = { score: leakedExpected ? 0 : 1, intentRecall, resourceRecall, negative: true };
  } else {
    const ir = intentRecall == null ? 1 : intentRecall;
    const rr = resourceRecall == null ? 1 : resourceRecall;
    dims.d1intra = { score: 0.4 * ir + 0.6 * rr, intentRecall, resourceRecall, negative: false };
  }
  // Live-only: a wrong observed surface is a routing failure regardless of any
  // incidental resource overlap, so cap D1-intra below the pass line.
  if (surfaceMatch === false && !negative) {
    dims.d1intra.surfaceMismatch = true;
    dims.d1intra.score = Math.min(dims.d1intra.score, 0.25);
  }

  // D2 proxy (Mode A): recall of expected resources in the routed set. In live
  // mode this is replaced by Hit@k/Recall@k/MRR over the observed load trace.
  dims.d2 = {
    score: negative ? (dims.d1intra.score) : (resourceRecall == null ? 1 : resourceRecall),
    proxy: 'router-replay-recall',
    note: 'Mode A proxy; live-mode replaces with observed-load Hit@k/Recall@k/MRR',
  };

  // D3 efficiency proxy (Mode A): penalize over-routing — resources routed that
  // are not in the expected set are "wasted loads". Live mode uses tool-call /
  // token cost to first expected resource.
  const routed = routerResult.resources.length;
  const wasted = expected && expected.resources
    ? routerResult.resources.filter((r) => !expected.resources.includes(r)).length
    : 0;
  // For a negative scenario the "expected" resources are the ones that must NOT
  // be routed, so the over-routing math inverts (routing them reads as zero
  // waste). Couple D3 to the suppression outcome instead, mirroring D2.
  dims.d3 = negative
    ? { score: dims.d1intra.score, routedCount: routed, wastedCount: routed, proxy: 'negative-activation', note: 'negative scenario: D3 tracks the suppression outcome, not over-routing' }
    : {
        score: routed === 0 ? 1 : Math.max(0, 1 - wasted / routed),
        routedCount: routed, wastedCount: wasted,
        proxy: 'router-overload', note: 'Mode A proxy; live-mode replaces with calls/tokens-to-first-expected',
      };

  // Asset support lane (advisory, not in the weighted aggregate). The router
  // defers assets/* on demand, so they are scored separately instead of inside
  // D2/D3. Router mode has no observed-asset channel (assets are not in the
  // first slice), so it reports deferred; live mode scores stated-asset recall.
  const expectedAssets = (expected && expected.assets) || [];
  const observedAssets = obs && Array.isArray(obs.observedAssets) ? obs.observedAssets : null;
  if (expectedAssets.length === 0) {
    dims.assetRecall = { score: null, note: 'no expected assets for this scenario' };
  } else if (observedAssets == null) {
    dims.assetRecall = { score: null, deferred: true, expectedAssets, note: 'assets deferred on-demand; not in the first slice (router mode)' };
  } else {
    dims.assetRecall = { score: setRecall(expectedAssets, observedAssets), expectedAssets, observedAssets, note: 'live stated-asset recall (advisory, not weighted)' };
  }

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

  // First failing stage (funnel): advisor activate -> router parse -> intra -> discovery.
  let firstFailingStage = null;
  if (dims.d1inter.score !== null && dims.d1inter.score < 0.5) firstFailingStage = 'activated-inter';
  else if (!routerResult.parseable) firstFailingStage = 'router-unparseable';
  else if (surfaceMatch === false) firstFailingStage = 'surface-mismatch';
  else if (dims.d1intra.score < 0.5) firstFailingStage = 'routed-intra';
  else if (dims.d2.score < 0.5) firstFailingStage = 'discovered';

  // Mode A scenario score: weight the measured dims, normalize over their weights.
  // D1-inter joins the measured set only when an advisor probe produced a score.
  const measured = [
    [dims.d1intra.score, WEIGHTS.d1intra],
    [dims.d2.score, WEIGHTS.d2],
    [dims.d3.score, WEIGHTS.d3],
  ];
  if (dims.d1inter.score !== null) measured.push([dims.d1inter.score, WEIGHTS.d1inter]);
  const wsum = measured.reduce((a, [, w]) => a + w, 0);
  const modeAScore = Math.round((measured.reduce((a, [s, w]) => a + s * w, 0) / wsum) * 100);

  // Trimmed live evidence so a live report is inspectable (what the model
  // actually did) without bloating the JSON with full transcripts.
  const liveEvidence = (obs && obs.raw) ? {
    eventCount: obs.raw.eventCount,
    activated: obs.activation ? obs.activation.activated : undefined,
    toolCalls: (obs.raw.toolCalls || []).map((t) => t.tool),
    observedReads: obs.raw.observedReads,
    statedRoutingParsed: !!(obs.raw.stated && Object.keys(obs.raw.stated).length),
    responseHead: (obs.raw.responseText || '').slice(0, 300),
  } : undefined;

  return {
    scenarioId, tier, dims, firstFailingStage, modeAScore, applicable: true,
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

module.exports = { scoreScenario, aggregate, computeDivergence, WEIGHTS };
