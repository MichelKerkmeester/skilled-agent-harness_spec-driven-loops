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
function scoreScenario({ scenarioId, tier, routerResult, expected, advisorResult }) {
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

  return { scenarioId, tier, dims, firstFailingStage, modeAScore, applicable: true };
}

/**
 * Aggregate scenario rows + the D5 connectivity result into a report object.
 */
function aggregate({ skillId, skillRoot, scenarioRows, connectivity, traceMode }) {
  const rows = scenarioRows.filter(Boolean);
  const avg = (sel) => {
    const vals = rows.map(sel).filter((v) => typeof v === 'number');
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : null;
  };
  // Funnel attrition: count first-failing-stage occurrences.
  const funnel = {};
  for (const r of rows) {
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
  const d1interAvg = avg((r) => (r.dims.d1inter && typeof r.dims.d1inter.score === 'number'
    ? Math.round(r.dims.d1inter.score * 100) : null));
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
    scoringMethod: 'mode-a-router-replay',
    traceMode: traceMode || 'router',
    targetSkill: { id: skillId, root: skillRoot },
    verdict,
    aggregateScore,
    gate: { d5Score: d5, gateFailed, reason: gateFailed ? 'D5 structural hard-gate failure' : null },
    dimensionScores: {
      D1inter: d1interAvg === null
        ? { points: WEIGHTS.d1inter, score: null, status: 'unscored-mode-a' }
        : { points: WEIGHTS.d1inter, score: d1interAvg },
      D1intra: { points: WEIGHTS.d1intra, score: avg((r) => Math.round(r.dims.d1intra.score * 100)) },
      D2: { points: WEIGHTS.d2, score: avg((r) => Math.round(r.dims.d2.score * 100)) },
      D3: { points: WEIGHTS.d3, score: avg((r) => Math.round(r.dims.d3.score * 100)) },
      D4: { points: WEIGHTS.d4, score: null, status: 'unscored-mode-a' },
      D5: { points: WEIGHTS.d5, score: d5, hardGate: true },
    },
    unscoredDimensions: d1interAvg === null ? ['D1inter', 'D4'] : ['D4'],
    funnel,
    headlineBottleneck: headlineBottleneck ? headlineBottleneck[0] : null,
    bottlenecks,
    scenarioRows: rows,
    runQuality: {
      scenarioCount: rows.length,
      traceMode: traceMode || 'router',
      note: 'Mode A is the deterministic CI gate; D1-inter (advisor) + D4 (ablation) need live mode.',
    },
  };
}

module.exports = { scoreScenario, aggregate, WEIGHTS };
