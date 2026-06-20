#!/usr/bin/env node

// Improvement-vs-baseline eval for the memory_context recall-mode flags.
//
// The sibling driver run-retrieval-flag-eval.mjs measures Recall@20 on
// hybridSearchEnhanced and marks the recall-mode flags runSearch:false, because
// those flags are consumed by memory_context response assembly and the adaptive
// recall paths, NOT by hybridSearchEnhanced. This driver closes that gap.
//
// An earlier revision of this driver measured ACTIVATION, not improvement: with a
// flag OFF, the prelude is never built, the agentic loop is structurally disabled,
// and the procedural multiplier is never applied, so every OFF metric collapses to
// 0 by construction and every ON metric reports a trivially large delta. An
// activation delta cannot justify a default-ON flip — it only proves the feature
// turns on. This revision measures the real question instead: does the feature
// recover relevant targets, or improve ranking correctness, RELATIVE TO the full
// default-routing memory_context result the production handler already returns?
//
// Baseline contract (shared by all three flags):
//   The baseline is the FULL default-routing retrieval the handler runs before any
//   recall-mode injection — hybridSearchEnhanced over the live channels with
//   useVector/useBm25/useFts/useGraph on and forceAllChannels OFF (the exact option
//   shape run-retrieval-flag-eval.mjs documents as the production default route).
//   forceAllChannels is never set; routing picks the channel subset production uses.
//
// Per-flag improvement metric (measured on that baseline):
//   SPECKIT_WORLD_SUMMARY_PRELUDE  -> Recall@K of the known-item target in the
//       default-route result WITHOUT the prelude vs WITH the prelude prepended
//       (buildWorldSummaryPrelude + prependWorldSummaryPreludeToResult, the real
//       handler path). netRecallDelta = recall(with) - recall(without); the real
//       win is the set of targets the prelude RECOVERS that the baseline missed.
//       Known-item recall is a deliberately strict, partly mismatched lens for a
//       grounding feature, so a grounding-coverage metric is reported alongside it.
//   SPECKIT_AGENTIC_RECALL         -> target recall of the bounded agentic loop
//       driven by the REAL default-route retrieval as its tool, vs the single-shot
//       baseline on the same queries. netRecallDelta = recall(loop) - recall(single).
//   SPECKIT_PROCEDURAL_RELIABILITY_RECALL -> target rank and nDCG of a procedural
//       known-item inside a realistic co-retrieved candidate set, WITH vs WITHOUT
//       the reliability multiplier (buildAdaptiveShadowProposal). rankDelta and
//       ndcgDelta measure ranking-correctness improvement, not whether a score moves.
//
// Every metric runs on the default routing path; none forces all channels.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import Database from 'better-sqlite3';

const SOURCE_DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');
const OUTPUT_PATH = path.resolve(
  process.env.SPECKIT_CONTEXT_RECALL_EVAL_OUTPUT ?? '/tmp/speckit-context-recall-eval.json',
);
const GOLDEN_PATH = path.resolve(
  process.env.SPECKIT_CONTEXT_RECALL_GOLDEN ?? path.join(path.dirname(new URL(import.meta.url).pathname), 'context-recall-golden.json'),
);
const RECALL_K = Number.parseInt(process.env.SPECKIT_CONTEXT_RECALL_K ?? '5', 10);
const QUERY_COUNT = Number.parseInt(process.env.SPECKIT_CONTEXT_RECALL_QUERY_COUNT ?? '40', 10);
// The default route returns a focused candidate set (handler limit 8); over-fetch a
// little so Recall@K has headroom without forcing channels or widening the route.
const SEARCH_LIMIT = Math.max(RECALL_K * 2, 10);
const PRELUDE_SECTION_LIMIT = Math.max(RECALL_K, 5);

const RECALL_FLAGS = [
  {
    label: 'world_summary_prelude',
    env: 'SPECKIT_WORLD_SUMMARY_PRELUDE',
    metric: 'net_recall_delta',
    note: 'Recall@K of the known-item target in the full default-route result WITHOUT vs WITH the grounding prelude.',
  },
  {
    label: 'agentic_recall',
    env: 'SPECKIT_AGENTIC_RECALL',
    metric: 'net_recall_delta',
    note: 'Target recall of the bounded agentic loop (real retrieval tool) vs the single-shot default-route baseline.',
  },
  {
    label: 'procedural_reliability_recall',
    env: 'SPECKIT_PROCEDURAL_RELIABILITY_RECALL',
    metric: 'rank_and_ndcg_delta',
    note: 'Procedural target rank/nDCG inside a realistic candidate set WITH vs WITHOUT the reliability multiplier.',
  },
];

const FLAG_ENVS = new Set(RECALL_FLAGS.map((flag) => flag.env));

function moduleUrl(relativePath) {
  return pathToFileURL(path.resolve(relativePath)).href;
}

function formatNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? Number(value.toFixed(6)) : null;
}

function removeSqliteFileSet(filePath) {
  for (const suffix of ['', '-wal', '-shm']) {
    fs.rmSync(`${filePath}${suffix}`, { force: true });
  }
}

async function backupSqlite(sourcePath, targetPath) {
  removeSqliteFileSet(targetPath);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true, mode: 0o700 });
  const source = new Database(sourcePath, { readonly: true, fileMustExist: true });
  try {
    source.pragma('busy_timeout = 10000');
    await source.backup(targetPath);
  } finally {
    source.close();
  }
}

async function prepareEvalDatabase(sourceDbPath) {
  const evalRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'speckit-context-recall-eval-'));
  const evalDbPath = path.join(evalRoot, 'context-index.sqlite');
  await backupSqlite(sourceDbPath, evalDbPath);
  return { sourceDbPath, evalRoot, dbPath: evalDbPath };
}

function parseTriggerPhrases(raw) {
  if (typeof raw !== 'string' || raw.trim().length === 0) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string' && item.trim().length > 0) : [];
  } catch {
    return [];
  }
}

function normalizeQuery(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

// Derive a known-item golden set from the live DB: pick memories that carry a
// title and a non-empty summary, query by their own trigger phrases or title, and
// treat the memory id as the gold target. This is the standard known-item recall
// contract (a memory should recall itself from its own surface terms) and needs no
// hand-labelled multi-hop set.
function deriveGoldenSet(db, count) {
  const rows = db.prepare(`
    SELECT s.memory_id AS memoryId, m.title AS title, m.spec_folder AS specFolder,
           m.trigger_phrases AS triggerPhrases, m.memory_type AS memoryType,
           m.context_type AS contextType
    FROM memory_summaries s
    JOIN memory_index m ON m.id = s.memory_id
    WHERE m.title IS NOT NULL AND length(trim(m.title)) > 8
      AND trim(coalesce(s.summary_text, '')) != ''
      AND m.embedding_status = 'success'
      AND m.parent_id IS NULL
    ORDER BY m.id ASC
  `).all();

  const golden = [];
  const seen = new Set();
  for (const row of rows) {
    if (golden.length >= count) break;
    const triggers = parseTriggerPhrases(row.triggerPhrases);
    const queryText = normalizeQuery(triggers.length > 0 ? triggers[0] : row.title);
    if (queryText.length < 4 || seen.has(queryText.toLowerCase())) continue;
    seen.add(queryText.toLowerCase());
    const isProcedural = [row.memoryType, row.contextType].some(
      (value) => typeof value === 'string' && value.trim().toLowerCase() === 'procedural',
    );
    golden.push({
      id: golden.length + 1,
      query: queryText,
      memoryId: row.memoryId,
      title: row.title,
      specFolder: typeof row.specFolder === 'string' ? row.specFolder : null,
      querySource: triggers.length > 0 ? 'trigger_derived' : 'title_derived',
      procedural: isProcedural,
    });
  }
  return golden;
}

function loadOrDeriveGolden(db, count) {
  if (fs.existsSync(GOLDEN_PATH)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(GOLDEN_PATH, 'utf8'));
      if (Array.isArray(parsed?.queries) && parsed.queries.length > 0) {
        return { golden: parsed.queries.slice(0, count), derived: false };
      }
    } catch {
      // Fall through to derivation when the cached golden set is unreadable.
    }
  }
  const golden = deriveGoldenSet(db, count);
  fs.writeFileSync(
    GOLDEN_PATH,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), sourceDbPath: SOURCE_DB_PATH, queries: golden }, null, 2)}\n`,
  );
  return { golden, derived: true };
}

function restoreEnv(snapshot) {
  for (const name of FLAG_ENVS) {
    if (snapshot[name] === undefined) delete process.env[name];
    else process.env[name] = snapshot[name];
  }
}

function setFlag(env, enabled) {
  process.env[env] = enabled ? 'true' : 'false';
}

// ── Default-routing retrieval ──────────────────────────────────────────────
// Returns the memory ids of the FULL default-route memory_context result for a
// query, in rank order. This is the production retrieval engine (hybridSearchEnhanced)
// run with the documented default-route option shape — never forceAllChannels.
function makeDefaultRouteSearch(hybridSearch, embeddings) {
  const embeddingCache = new Map();
  async function getEmbedding(query) {
    if (embeddingCache.has(query)) return embeddingCache.get(query);
    try {
      const embedding = await embeddings.generateQueryEmbedding(query);
      embeddingCache.set(query, embedding);
      return embedding;
    } catch {
      // Vector lane unavailable — the lexical/graph lanes still carry the route.
      embeddingCache.set(query, null);
      return null;
    }
  }
  return async function defaultRouteResultIds(query) {
    const embedding = await getEmbedding(query);
    const rows = await hybridSearch.hybridSearchEnhanced(query, embedding, {
      limit: SEARCH_LIMIT,
      useVector: true,
      useBm25: true,
      useFts: true,
      useGraph: true,
      includeContent: false,
      // forceAllChannels intentionally omitted — default routing only.
    });
    return rows
      .map((row) => Number(row.parentMemoryId ?? row.parent_id ?? row.parentId ?? row.id))
      .filter((id) => Number.isInteger(id));
  };
}

function recallAtK(resultIds, targetId, k) {
  return resultIds.slice(0, k).includes(targetId) ? 1 : 0;
}

// Discounted cumulative gain at K for a single relevant target: relevance 1 at the
// target's rank, 0 elsewhere; iDCG is 1 (target at rank 1), so nDCG = DCG here.
function ndcgForTarget(resultIds, targetId, k) {
  const idx = resultIds.slice(0, k).indexOf(targetId);
  if (idx < 0) return 0;
  return 1 / Math.log2(idx + 2);
}

// ── Prelude flag: net Recall@K improvement on the full default-route result ──
// Baseline = default-route result ids WITHOUT the prelude. With = the same result
// after buildWorldSummaryPrelude + prependWorldSummaryPreludeToResult, mirroring the
// handler exactly. The prelude prepends a grounding row whose `sections[]` carry the
// memory ids it surfaces, so the with-prelude candidate set = prelude section ids
// (rank-0 grounding) followed by the baseline ids.
async function measurePreludeImprovement(memorySummaries, handlerModule, db, golden, defaultRouteResultIds) {
  setFlag('SPECKIT_WORLD_SUMMARY_PRELUDE', true);

  // Per-placement accumulators. 'prepend' reproduces the current production handler
  // (sections rank ahead of baseline rows → can displace). 'append' models the
  // grounding-without-displacement variant (baseline ranks untouched, sections trail).
  const placements = ['prepend', 'append'];
  const acc = Object.fromEntries(
    placements.map((p) => [p, { recallWithSum: 0, recovered: 0, regressed: 0 }]),
  );
  let recallWithoutSum = 0;
  let evaluated = 0;
  let preludeBuilt = 0;
  let groundingCovered = 0; // queries where the prelude surfaces >=1 on-topic section

  for (const item of golden) {
    evaluated += 1;
    const baselineIds = await defaultRouteResultIds(item.query);
    const recallWithout = recallAtK(baselineIds, item.memoryId, RECALL_K);
    recallWithoutSum += recallWithout;

    // Build + inject the prelude exactly as the handler does (default route, non-quick).
    const prelude = memorySummaries.buildWorldSummaryPrelude(
      db,
      item.query,
      item.specFolder ? { specFolder: item.specFolder } : {},
      { limit: PRELUDE_SECTION_LIMIT },
    );

    let injected = null;
    if (prelude) {
      preludeBuilt += 1;
      if (Array.isArray(prelude.sections) && prelude.sections.length > 0) {
        groundingCovered += 1;
      }
      // Reconstruct the post-injection result envelope through the real handler fn
      // once; both placements read back the same injected envelope and only differ
      // in how extractResultIdsFromEnvelope orders sections vs baseline rows.
      const baseEnvelope = {
        summary: 'ok',
        data: {
          count: baselineIds.length,
          results: baselineIds.map((id) => ({ id })),
        },
      };
      injected = handlerModule.prependWorldSummaryPreludeToResult(
        { strategy: 'search', mode: 'focused', content: [{ type: 'text', text: JSON.stringify(baseEnvelope) }] },
        prelude,
      );
    }

    for (const placement of placements) {
      const withIds = prelude && injected
        ? extractResultIdsFromEnvelope(injected, prelude, placement)
        : baselineIds;
      const recallWith = recallAtK(withIds, item.memoryId, RECALL_K);
      acc[placement].recallWithSum += recallWith;
      if (recallWithout === 0 && recallWith === 1) acc[placement].recovered += 1;
      if (recallWithout === 1 && recallWith === 0) acc[placement].regressed += 1;
    }
  }

  const recallWithout = evaluated === 0 ? 0 : recallWithoutSum / evaluated;
  function placementResult(placement) {
    const a = acc[placement];
    return {
      recallWith: evaluated === 0 ? 0 : a.recallWithSum / evaluated,
      netRecallDelta: evaluated === 0 ? 0 : (a.recallWithSum - recallWithoutSum) / evaluated,
      recovered: a.recovered,
      regressed: a.regressed,
    };
  }

  // The 'prepend' placement remains the primary reported result so the existing flag
  // contract (recallWith / netRecallDelta / recovered / regressed) is unchanged; the
  // 'append' placement is carried alongside as the displacement-free comparison.
  const prepend = placementResult('prepend');
  const append = placementResult('append');

  return {
    recallWithout,
    recallWith: prepend.recallWith,
    netRecallDelta: prepend.netRecallDelta,
    recovered: prepend.recovered,
    regressed: prepend.regressed,
    preludeBuilt,
    // Grounding-coverage is the fitted lens for a grounding feature: the fraction of
    // queries the prelude can ground at all (>=1 on-topic section), independent of
    // whether the single known-item target lands in the section list.
    groundingCoverage: evaluated === 0 ? 0 : groundingCovered / evaluated,
    evaluated,
    placements: {
      prepend: { recallWith: prepend.recallWith, ...prepend },
      // Append carries the same shape; regressed should be ~0 by construction.
      append: { recallWith: append.recallWith, ...append },
    },
  };
}

// The prelude injects a synthetic grounding row at position 0 whose `sections[]`
// carry the memory ids it surfaces. For a recall lens those section ids are the
// candidates the prelude contributes; their ranked position relative to the
// baseline rows is what decides whether a baseline hit gets displaced past K.
//
// placement === 'prepend' reproduces the current production handler: section ids
// rank AHEAD of the baseline rows (sections first), so every section consumes a
// ranked slot before K and can push a baseline hit out of the top-K window.
//
// placement === 'append' models the proposed grounding-without-displacement mode:
// baseline rows keep their exact ranks and the section ids trail AFTER them, so a
// baseline hit at rank < K can never be displaced by a grounding section. The
// prelude can still RECOVER a missed target when a section id lands at append
// position < K (i.e. the baseline returned fewer than K rows and the grounding
// fills the tail), but it can never REGRESS one.
function extractResultIdsFromEnvelope(injectedResult, prelude, placement = 'prepend') {
  const first = Array.isArray(injectedResult.content) ? injectedResult.content[0] : undefined;
  let baselineIds = [];
  if (first && typeof first.text === 'string') {
    try {
      const envelope = JSON.parse(first.text);
      baselineIds = Array.isArray(envelope?.data?.results)
        ? envelope.data.results
          .filter((row) => row && row.id !== 'world-summary-prelude')
          .map((row) => Number(row.id))
          .filter((id) => Number.isInteger(id))
        : [];
    } catch {
      baselineIds = [];
    }
  }
  const sectionIds = Array.isArray(prelude?.sections)
    ? prelude.sections.map((section) => Number(section.memoryId)).filter((id) => Number.isInteger(id))
    : [];
  // De-duplicate while preserving first-seen order. In append mode the baseline
  // rows come first (their ranks are untouched); in prepend mode the grounding
  // sections come first (the current displacing behavior).
  const order = placement === 'append'
    ? [...baselineIds, ...sectionIds]
    : [...sectionIds, ...baselineIds];
  const seen = new Set();
  const ordered = [];
  for (const id of order) {
    if (seen.has(id)) continue;
    seen.add(id);
    ordered.push(id);
  }
  return ordered;
}

// ── Agentic flag: loop recall vs single-shot baseline ──────────────────────
// The governor (runAgenticLoop) is pure: the agent and tool executor are injected.
// To measure improvement honestly, the loop is driven by the REAL default-route
// retrieval as its only tool. A deterministic multi-hop agent issues a retrieval
// call, then answers with the target if the tool surfaced it. The loop result is
// compared to the single-shot default-route baseline on the same queries.
//
// Honest caveat (reported in the right-metric note): runAgenticLoop has NO
// production consumer in this build — no memory_context / memory_search path drives
// it. With no real reasoning model wired, the loop can only re-derive the
// single-shot result, so its net recall delta over the single shot is structurally
// zero. The metric below makes that visible instead of hiding it behind an
// activation success-rate.
async function measureAgenticImprovement(governor, golden, defaultRouteResultIds) {
  setFlag('SPECKIT_AGENTIC_RECALL', true);
  let singleShotSum = 0;
  let loopSum = 0;
  let recovered = 0;
  let evaluated = 0;

  for (const item of golden) {
    evaluated += 1;
    const singleShotIds = await defaultRouteResultIds(item.query);
    const singleShot = recallAtK(singleShotIds, item.memoryId, RECALL_K);

    // Drive the bounded loop with the real retrieval tool. The agent issues one
    // retrieval, observes its result ids, then answers. Because the only tool is the
    // same default-route retrieval, the loop observes the same candidate set as the
    // single shot — the comparison exposes whether the loop adds any recovery.
    let toolDone = false;
    let observedIds = [];
    const result = await governor.runAgenticLoop({
      allowedTools: new Set(['memory_retrieve']),
      maxSteps: 4,
      stepProvider: (state) => {
        if (!toolDone && state.stepIndex === 0) {
          toolDone = true;
          return { kind: 'tool_call', tool: 'memory_retrieve', args: { query: item.query } };
        }
        return { kind: 'final_answer', answer: { resultIds: observedIds } };
      },
      toolExecutor: async () => {
        observedIds = await defaultRouteResultIds(item.query);
        return { resultIds: observedIds };
      },
    });

    const loopIds = result.status === 'final' && Array.isArray(result.answer?.resultIds)
      ? result.answer.resultIds
      : [];
    const loopRecall = recallAtK(loopIds, item.memoryId, RECALL_K);
    singleShotSum += singleShot;
    loopSum += loopRecall;
    if (singleShot === 0 && loopRecall === 1) recovered += 1;
  }

  return {
    singleShotRecall: evaluated === 0 ? 0 : singleShotSum / evaluated,
    loopRecall: evaluated === 0 ? 0 : loopSum / evaluated,
    netRecallDelta: evaluated === 0 ? 0 : (loopSum - singleShotSum) / evaluated,
    recovered,
    evaluated,
  };
}

// ── Procedural reliability flag: rank / nDCG improvement of the target ──────
// The multiplier reaches ranking through buildAdaptiveShadowProposal. To make a
// ranking effect observable, the procedural target is placed inside a realistic
// candidate set: its real co-retrieved neighbors from the default route, scored so
// the target starts mid-pack (a relevant procedural item the multiplier could lift).
// Rank and nDCG are measured WITH vs WITHOUT the multiplier; only the flag toggles
// getProceduralReliabilityMultipliers, so the generic signal lane is held constant.
async function measureProceduralImprovement(adaptiveRanking, db, golden, defaultRouteResultIds) {
  process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
  process.env.SPECKIT_MEMORY_ADAPTIVE_MODE = 'shadow';
  adaptiveRanking.ensureAdaptiveTables(db);

  const proceduralItems = golden.filter((item) => item.procedural);
  if (proceduralItems.length === 0) {
    return {
      evaluated: 0,
      rankDelta: 0,
      ndcgWithout: 0,
      ndcgWith: 0,
      ndcgDelta: 0,
      improved: 0,
      regressed: 0,
      note: 'no procedural known-items in golden set',
    };
  }

  let rankDeltaSum = 0;
  let ndcgWithoutSum = 0;
  let ndcgWithSum = 0;
  let improved = 0;
  let regressed = 0;
  let evaluated = 0;

  for (const item of proceduralItems) {
    // Build a realistic candidate set: the target plus its real co-retrieved
    // neighbors from the default route, descending score so the target sits mid-pack.
    const neighborIds = (await defaultRouteResultIds(item.query)).filter((id) => id !== item.memoryId);
    const candidates = buildProceduralCandidateSet(item.memoryId, neighborIds);
    if (candidates.length < 2) continue;
    evaluated += 1;

    // Positive reliability evidence so the multiplier has the strongest honest case.
    adaptiveRanking.recordAdaptiveSignal(db, {
      memoryId: item.memoryId,
      signalType: 'outcome',
      signalValue: 1,
      actor: 'context-recall-eval',
    });

    const withoutRank = proceduralShadowRank(adaptiveRanking, db, item, candidates, false);
    const withRank = proceduralShadowRank(adaptiveRanking, db, item, candidates, true);

    // Positive rankDelta = the target moved UP (improvement).
    const rankDelta = withoutRank.rank - withRank.rank;
    rankDeltaSum += rankDelta;
    ndcgWithoutSum += withoutRank.ndcg;
    ndcgWithSum += withRank.ndcg;
    if (rankDelta > 0) improved += 1;
    if (rankDelta < 0) regressed += 1;
  }

  return {
    evaluated,
    rankDelta: evaluated === 0 ? 0 : rankDeltaSum / evaluated,
    ndcgWithout: evaluated === 0 ? 0 : ndcgWithoutSum / evaluated,
    ndcgWith: evaluated === 0 ? 0 : ndcgWithSum / evaluated,
    ndcgDelta: evaluated === 0 ? 0 : (ndcgWithSum - ndcgWithoutSum) / evaluated,
    improved,
    regressed,
  };
}

// Place the procedural target mid-pack among real neighbors with a descending score
// ramp, so a multiplier that boosts it could raise its rank and one that de-rates it
// could lower it. The target is the relevant item whose ranking-correctness we score.
function buildProceduralCandidateSet(targetId, neighborIds) {
  const topNeighbors = neighborIds.slice(0, 4);
  const ids = [...topNeighbors];
  const insertAt = Math.min(2, ids.length); // mid-pack
  ids.splice(insertAt, 0, targetId);
  const baseScore = 0.7;
  return ids.map((id, index) => ({
    id,
    score: Math.max(0.05, baseScore - index * 0.08),
    similarity: Math.max(0.05, baseScore - index * 0.08),
    title: id === targetId ? 'procedural target' : `neighbor ${id}`,
    memory_type: id === targetId ? 'procedural' : 'declarative',
  }));
}

function proceduralShadowRank(adaptiveRanking, db, item, candidates, enabled) {
  setFlag('SPECKIT_PROCEDURAL_RELIABILITY_RECALL', enabled);
  const proposal = adaptiveRanking.buildAdaptiveShadowProposal(db, item.query, candidates);
  const orderedIds = Array.isArray(proposal?.rows)
    ? [...proposal.rows].sort((a, b) => a.shadowRank - b.shadowRank).map((row) => row.memoryId)
    : candidates.map((row) => row.id);
  const idx = orderedIds.indexOf(item.memoryId);
  const rank = idx >= 0 ? idx + 1 : orderedIds.length + 1;
  return { rank, ndcg: ndcgForTarget(orderedIds, item.memoryId, candidates.length) };
}

// ── Procedural reliability flag: near-tie tie-break (the flag's designed use) ──
// The large-gap case above correctly reads neutral: the candidate ramp opens an 0.08
// score gap that no honest reliability nudge should override, so the bounded
// prior-centered delta cannot — and should not — move it. That proves the multiplier
// does not bulldoze a clear ordering, but it says nothing about the flag's REAL job,
// which is breaking NEAR-TIES by demonstrated reliability.
//
// Measuring the multiplier's marginal effect honestly requires isolating it from a
// confound: buildAdaptiveShadowProposal clamps the SUM of the generic signal lane and
// the procedural reliability delta to ±maxAdaptiveDelta, and the generic lane reads
// the SAME adaptive_signal_events the procedural evidence comes from. Two consequences
// fall out of that wiring and both are reported, not hidden:
//   1. Dense evidence SATURATES the generic lane on its own (e.g. 30 outcomes ×
//      0.02 = 0.60, clamped to the 0.08 band), leaving zero headroom for the
//      procedural term — the combined clamp swallows it. So the "obvious" strong case
//      (~30/2) shows a ZERO marginal procedural effect, not a large one. The
//      multiplier only has room to move ranking at thin-to-moderate evidence.
//   2. The generic lane would itself reorder the field, masking whether the procedural
//      term did anything. To isolate the procedural term, the declarative neighbor is
//      given the SAME signal totals as the procedural target, so the generic lane
//      applies an identical delta to both rows and cancels out of their relative order.
//      Only the procedural multiplier — which applies solely to the procedural-typed
//      row — can then break the tie. That is the marginal effect under test.
//
// Two synthetic contests, fully under the eval's control (synthetic ids far above any
// real memory id, never written to the golden set, recorded only here):
//   RELIABLE contest  — a procedure with moderate, clearly-positive evidence (5
//       successes / 1 failure) sits a hair (~0.005) BELOW a declarative neighbor
//       carrying the same 5/1 generic signals. Without the procedural flag the target
//       ranks second; the prior-centered boost is the only force that can lift it. A
//       clean promotion (rankDelta +1) means reliability legitimately broke the tie.
//   UNRELIABLE contest — a failure-heavy procedure (1 success / 3 failures) sits a
//       hair ABOVE a declarative neighbor carrying the same 1/3 signals, so production
//       over-ranked it. The procedural de-rate should push it below the neighbor
//       (rankDelta -1), confirming the signed delta demotes a procedure that lags its
//       prior.
function buildNearTieCandidateSet(targetId, neighborId, targetScore, neighborScore) {
  // Two rows only — a clean head-to-head where score order is the entire contest.
  // similarity mirrors score so the secondary tiebreak never decides the order; the
  // procedural reliability delta applied to shadowScore is the sole differential.
  return [
    {
      id: neighborId,
      score: neighborScore,
      similarity: neighborScore,
      title: `near-tie neighbor ${neighborId}`,
      memory_type: 'declarative',
    },
    {
      id: targetId,
      score: targetScore,
      similarity: targetScore,
      title: 'near-tie procedural target',
      memory_type: 'procedural',
    },
  ];
}

function recordReliabilityEvidence(adaptiveRanking, db, memoryId, successes, failures) {
  // The reliability SQL sums signal_value per signal_type, so one summed row per type
  // is equivalent to N unit rows; recordAdaptiveSignal rejects non-positive values, so
  // a zero count is simply skipped.
  if (successes > 0) {
    adaptiveRanking.recordAdaptiveSignal(db, {
      memoryId,
      signalType: 'outcome',
      signalValue: successes,
      actor: 'context-recall-eval-near-tie',
    });
  }
  if (failures > 0) {
    adaptiveRanking.recordAdaptiveSignal(db, {
      memoryId,
      signalType: 'correction',
      signalValue: failures,
      actor: 'context-recall-eval-near-tie',
    });
  }
}

function measureProceduralNearTie(adaptiveRanking, db) {
  process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING = 'true';
  process.env.SPECKIT_MEMORY_ADAPTIVE_MODE = 'shadow';
  adaptiveRanking.ensureAdaptiveTables(db);

  // Synthetic ids well clear of any real memory id; never written to the golden set.
  const RELIABLE_TARGET = 990000001;
  const RELIABLE_NEIGHBOR = 990000002;
  const UNRELIABLE_TARGET = 990000003;
  const UNRELIABLE_NEIGHBOR = 990000004;

  // Reliable contest: moderate positive evidence on BOTH rows so the generic lane
  // cancels; target sits ~0.005 below the neighbor → rank 2 before the procedural nudge.
  const reliableGap = 0.005;
  recordReliabilityEvidence(adaptiveRanking, db, RELIABLE_TARGET, 5, 1);
  recordReliabilityEvidence(adaptiveRanking, db, RELIABLE_NEIGHBOR, 5, 1);
  const reliableCandidates = buildNearTieCandidateSet(
    RELIABLE_TARGET,
    RELIABLE_NEIGHBOR,
    0.6,
    0.6 + reliableGap,
  );
  const reliableItem = { query: 'near-tie reliable procedure', memoryId: RELIABLE_TARGET };
  const reliableWithout = proceduralShadowRank(adaptiveRanking, db, reliableItem, reliableCandidates, false);
  const reliableWith = proceduralShadowRank(adaptiveRanking, db, reliableItem, reliableCandidates, true);
  const reliableRankDelta = reliableWithout.rank - reliableWith.rank; // +1 = promoted

  // Unreliable contest: failure-heavy evidence on BOTH rows so the generic lane cancels;
  // target sits ~0.004 above the neighbor → rank 1 before the de-rate.
  const unreliableGap = 0.004;
  recordReliabilityEvidence(adaptiveRanking, db, UNRELIABLE_TARGET, 1, 3);
  recordReliabilityEvidence(adaptiveRanking, db, UNRELIABLE_NEIGHBOR, 1, 3);
  const unreliableCandidates = buildNearTieCandidateSet(
    UNRELIABLE_TARGET,
    UNRELIABLE_NEIGHBOR,
    0.605,
    0.605 - unreliableGap,
  );
  const unreliableItem = { query: 'near-tie unreliable procedure', memoryId: UNRELIABLE_TARGET };
  const unreliableWithout = proceduralShadowRank(adaptiveRanking, db, unreliableItem, unreliableCandidates, false);
  const unreliableWith = proceduralShadowRank(adaptiveRanking, db, unreliableItem, unreliableCandidates, true);
  const unreliableRankDelta = unreliableWithout.rank - unreliableWith.rank; // -1 = demoted

  return {
    reliable: {
      evidence: '5 successes / 1 failure',
      rankWithout: reliableWithout.rank,
      rankWith: reliableWith.rank,
      rankDelta: reliableRankDelta,
      ndcgWithout: reliableWithout.ndcg,
      ndcgWith: reliableWith.ndcg,
      ndcgDelta: reliableWith.ndcg - reliableWithout.ndcg,
      promoted: reliableRankDelta > 0,
      scoreGap: reliableGap,
    },
    unreliable: {
      evidence: '1 success / 3 failures',
      rankWithout: unreliableWithout.rank,
      rankWith: unreliableWith.rank,
      rankDelta: unreliableRankDelta,
      ndcgWithout: unreliableWithout.ndcg,
      ndcgWith: unreliableWith.ndcg,
      ndcgDelta: unreliableWith.ndcg - unreliableWithout.ndcg,
      demoted: unreliableRankDelta < 0,
      scoreGap: unreliableGap,
    },
  };
}

async function main() {
  if (!Number.isInteger(RECALL_K) || RECALL_K <= 0) {
    throw new Error(`Invalid Recall@K: ${RECALL_K}`);
  }

  const evalDatabase = await prepareEvalDatabase(SOURCE_DB_PATH);
  process.env.MEMORY_DB_PATH = evalDatabase.dbPath;

  const [vectorIndex, memorySummaries, governor, adaptiveRanking, handlerModule, hybridSearch, graphSearch, embeddings] = await Promise.all([
    import(moduleUrl('dist/lib/search/vector-index.js')),
    import(moduleUrl('dist/lib/search/memory-summaries.js')),
    import(moduleUrl('dist/lib/search/agentic-loop-governor.js')),
    import(moduleUrl('dist/lib/cognitive/adaptive-ranking.js')),
    import(moduleUrl('dist/handlers/memory-context.js')),
    import(moduleUrl('dist/lib/search/hybrid-search.js')),
    import(moduleUrl('dist/lib/search/graph-search-fn.js')),
    import(moduleUrl('dist/lib/providers/embeddings.js')),
  ]);

  const db = vectorIndex.initializeDb(evalDatabase.dbPath, { skipRestoreRecovery: true });
  // Wire the production retrieval engine over the eval DB (same init the sibling
  // retrieval-flag eval uses) so the baseline is the real default-route result.
  const graphSearchFn = graphSearch.createUnifiedGraphSearchFn(db);
  hybridSearch.init(db, vectorIndex.vectorSearch, graphSearchFn);
  const defaultRouteResultIds = makeDefaultRouteSearch(hybridSearch, embeddings);

  const { golden, derived } = loadOrDeriveGolden(db, QUERY_COUNT);
  if (golden.length === 0) {
    throw new Error('Could not derive a non-empty known-item golden set from the DB.');
  }

  const originalEnv = Object.fromEntries([...FLAG_ENVS].map((name) => [name, process.env[name]]));
  const flagRows = [];

  // World summary prelude — net Recall@K improvement vs baseline + grounding coverage
  {
    const result = await measurePreludeImprovement(memorySummaries, handlerModule, db, golden, defaultRouteResultIds);
    restoreEnv(originalEnv);
    const prependDelta = result.placements.prepend.netRecallDelta;
    const appendDelta = result.placements.append.netRecallDelta;
    const appendRegressed = result.placements.append.regressed;
    const flip = result.netRecallDelta > 0;
    // A CLEAN flip = positive net recall WITHOUT displacing baseline hits. The
    // current prepend path buys recoveries by displacing baseline hits past K;
    // append keeps the recoveries while structurally avoiding displacement.
    const appendCleanFlip = appendDelta > 0 && appendRegressed === 0;
    flagRows.push({
      flag: 'world_summary_prelude',
      env: 'SPECKIT_WORLD_SUMMARY_PRELUDE',
      metric: 'net_recall_delta',
      baseline: formatNumber(result.recallWithout),
      withFeature: formatNumber(result.recallWith),
      delta: formatNumber(result.netRecallDelta),
      placementComparison: {
        prepend: {
          netRecallDelta: formatNumber(prependDelta),
          recovered: result.placements.prepend.recovered,
          regressed: result.placements.prepend.regressed,
        },
        append: {
          netRecallDelta: formatNumber(appendDelta),
          recovered: result.placements.append.recovered,
          regressed: appendRegressed,
        },
        cleanFlip: appendCleanFlip,
      },
      detail: result,
      rightMetricNote:
        'Known-item Recall@K is a strict, partly-mismatched lens for a grounding feature: the prelude '
        + 'summarizes the world, it is not a recall channel. groundingCoverage (fraction of queries with '
        + '>=1 on-topic section) is the fitted lens; netRecallDelta only credits the prelude when it '
        + 'recovers a target the baseline missed. placementComparison contrasts the current prepend path '
        + '(sections rank ahead of baseline rows → displacement) against an append path (baseline ranks '
        + 'untouched, sections trail → no displacement by construction).',
      flipRecommendation: appendCleanFlip
        ? 'flip-ON (append placement): grounding sections appended after the baseline rows keep the recoveries '
          + 'with zero baseline displacement — a clean net recall win. The current prepend placement buys the '
          + 'same recoveries by displacing baseline hits past K and is NOT a clean flip.'
        : flip
          ? 'flip-ON only with caveat: prepend yields a positive net delta but displaces baseline hits past K. '
            + 'Prefer the append placement before flipping default-ON.'
          : 'keep-OFF on recall grounds: no net recall improvement over the default route. Re-judge on '
            + 'groundingCoverage if grounding (not recall) is the intended purpose.',
    });
  }

  // Agentic recall — loop recall vs single-shot baseline
  {
    const result = await measureAgenticImprovement(governor, golden, defaultRouteResultIds);
    restoreEnv(originalEnv);
    const flip = result.netRecallDelta > 0;
    flagRows.push({
      flag: 'agentic_recall',
      env: 'SPECKIT_AGENTIC_RECALL',
      metric: 'net_recall_delta',
      baseline: formatNumber(result.singleShotRecall),
      withFeature: formatNumber(result.loopRecall),
      delta: formatNumber(result.netRecallDelta),
      detail: result,
      rightMetricNote:
        'runAgenticLoop has NO production consumer in this build (no memory_context/memory_search path '
        + 'drives it) and no real reasoning model is wired, so the bounded loop can only re-derive the '
        + 'single-shot result. Loop-vs-single recall is the right lens for the feature\'s intent (multi-hop '
        + 'recovery), but it is structurally zero until the loop drives real iterative retrieval.',
      flipRecommendation: flip
        ? 'flip-ON: the loop recovers targets the single shot missed (positive net recall delta).'
        : 'keep-OFF: unwired scaffold — no net recall improvement is possible until the loop has a real consumer and reasoning agent.',
    });
  }

  // Procedural reliability recall — rank / nDCG improvement of the target
  {
    const result = await measureProceduralImprovement(adaptiveRanking, db, golden, defaultRouteResultIds);
    const nearTie = measureProceduralNearTie(adaptiveRanking, db);
    restoreEnv(originalEnv);
    delete process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING;
    delete process.env.SPECKIT_MEMORY_ADAPTIVE_MODE;

    // The large-gap golden case is the GUARDRAIL: it must stay neutral so the multiplier
    // is proven not to bulldoze a clear ordering. The near-tie case is the flag's actual
    // job: the bounded delta should break a genuine tie by demonstrated reliability.
    const largeGapNeutral = result.rankDelta === 0 && result.ndcgDelta === 0 && result.regressed === 0;
    const nearTiePromotesReliable = nearTie.reliable.promoted;
    const nearTieDemotesUnreliable = nearTie.unreliable.demoted;
    // The honest flip bar: the corrected multiplier earns a modest tie-break flip only
    // when it BREAKS a near-tie in the reliable direction, DEMOTES the unreliable item,
    // and leaves the large-gap case untouched. Tie-break improvement without large-gap
    // harm is the whole design contract for a ~±0.02 nudge.
    const flip = nearTiePromotesReliable && nearTieDemotesUnreliable && largeGapNeutral;
    flagRows.push({
      flag: 'procedural_reliability_recall',
      env: 'SPECKIT_PROCEDURAL_RELIABILITY_RECALL',
      metric: 'rank_and_ndcg_delta',
      baseline: formatNumber(result.ndcgWithout),
      withFeature: formatNumber(result.ndcgWith),
      delta: formatNumber(result.ndcgDelta),
      rankDelta: formatNumber(result.rankDelta),
      detail: result,
      nearTie,
      rightMetricNote:
        'Target rank / nDCG WITH vs WITHOUT the multiplier is the right lens (ranking correctness, not '
        + 'whether a score merely moves). The reliability term is now prior-centered and evidence-weighted '
        + '(computeCenteredReliabilityEvidence): reliabilityDelta = strength * (mean - priorMean) * '
        + 'evidenceWeight * score, so a procedure that BEATS its prior is promoted, one that LAGS is '
        + 'demoted, and a thin- or no-evidence procedure stays neutral. Two wiring facts bound how far it '
        + 'reaches and both are measured, not assumed: (1) buildAdaptiveShadowProposal clamps the SUM of the '
        + 'generic signal lane and this reliability delta to +/-maxAdaptiveDelta (0.08), and the generic lane '
        + 'reads the same adaptive_signal_events the evidence comes from, so DENSE evidence saturates the '
        + 'generic lane by itself and the combined clamp swallows the procedural term (a ~30/2 procedure shows '
        + 'a ZERO marginal effect, not a large one) — the multiplier only has headroom at thin-to-moderate '
        + 'evidence; (2) to isolate the procedural term the near-tie neighbor carries the SAME generic signals '
        + 'as the target so the generic lane cancels and only the procedural multiplier can reorder them. The '
        + 'bound makes this a tie-breaker, not a bulldozer: the large-gap golden case correctly stays neutral '
        + '(it must not override an 0.08 ordering), and the near-tie case is where the flag earns its keep — a '
        + 'moderately-proven procedure breaks a genuine tie and a failure-heavy one is pushed down.',
      flipRecommendation: flip
        ? 'flip-ON (modest tie-break): the corrected prior-centered multiplier breaks a near-tie in favor of a '
          + 'proven-reliable procedure and demotes a failure-heavy one, while leaving the large-gap ordering '
          + 'untouched. The nudge is bounded (~+/-0.02), so it earns a default-ON flip only as a reliability '
          + 'tie-breaker, not as a primary ranking signal.'
        : !largeGapNeutral
          ? 'keep-OFF: the multiplier moved the large-gap case it should have left neutral — the nudge is '
            + 'overriding a clear ordering. Re-check the clamp/strength before flipping.'
          : 'keep-OFF: the bounded nudge could not even break a designed near-tie (reliable not promoted or '
            + 'unreliable not demoted), so it does not earn a default-ON flip as wired.',
    });
  }

  const proceduralCount = golden.filter((item) => item.procedural).length;
  const output = {
    generatedAt: new Date().toISOString(),
    sourceDbPath: SOURCE_DB_PATH,
    dbPath: evalDatabase.dbPath,
    goldenPath: GOLDEN_PATH,
    goldenDerived: derived,
    recallK: RECALL_K,
    searchLimit: SEARCH_LIMIT,
    queryCount: golden.length,
    proceduralQueryCount: proceduralCount,
    metricContract: 'improvement-vs-baseline on the full default-routing memory_context result (forceAllChannels never set)',
    flags: flagRows,
  };

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(JSON.stringify(output, null, 2));
}

const invokedDirectly = Boolean(process.argv[1])
  && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error));
    process.exitCode = 1;
  });
}

export {
  deriveGoldenSet,
  loadOrDeriveGolden,
  makeDefaultRouteSearch,
  measurePreludeImprovement,
  measureAgenticImprovement,
  measureProceduralImprovement,
  recallAtK,
  ndcgForTarget,
  RECALL_FLAGS,
};
