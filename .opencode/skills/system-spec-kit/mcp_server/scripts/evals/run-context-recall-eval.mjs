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
    restoreEnv(originalEnv);
    delete process.env.SPECKIT_MEMORY_ADAPTIVE_RANKING;
    delete process.env.SPECKIT_MEMORY_ADAPTIVE_MODE;
    const flip = result.rankDelta > 0 && result.ndcgDelta > 0;
    flagRows.push({
      flag: 'procedural_reliability_recall',
      env: 'SPECKIT_PROCEDURAL_RELIABILITY_RECALL',
      metric: 'rank_and_ndcg_delta',
      baseline: formatNumber(result.ndcgWithout),
      withFeature: formatNumber(result.ndcgWith),
      delta: formatNumber(result.ndcgDelta),
      rankDelta: formatNumber(result.rankDelta),
      detail: result,
      rightMetricNote:
        'Target rank / nDCG WITH vs WITHOUT the multiplier is the right lens (ranking correctness, not '
        + 'whether a score merely moves). But the "reliability multiplier" is a beta-posterior mean in '
        + '[0,1] (computeWeightedReliability), so reliabilityDelta = score*mean - score is always <= 0: it '
        + 'can only DE-RATE a procedural item, never promote it. A relevant procedural target therefore '
        + 'cannot gain rank from this multiplier as wired — a likely implementation bug worth flagging.',
      flipRecommendation: flip
        ? 'flip-ON: procedural targets improve in rank and nDCG with the multiplier.'
        : 'keep-OFF: the multiplier is a [0,1] down-weight; it cannot improve a relevant procedural target\'s rank (rank/nDCG delta <= 0). Fix the multiplier semantics before reconsidering.',
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
