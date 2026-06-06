# Iteration 009 — recall ranking / activation / decay

**Status:** insight · **Findings:** 5 · **newInfoRatio:** 0.78 · **tokens:** 120702 · **exit:** 0 · executor: cli-opencode openai/gpt-5.5-fast(high)

---

## Mechanism
MemClaw’s active recall path is pipeline search: `ResolveSearchProfile` builds `search_params`, `ExecuteScoredSearch` delegates scoring to storage, `PostFilterResults` applies a vector-similarity gate, and `TrackRecalls` increments activation after filtered results are chosen. Evidence: `core-api/src/core_api/pipeline/compositions/search.py:17`, `core-api/src/core_api/pipeline/compositions/search.py:21`, `core-api/src/core_api/pipeline/compositions/search.py:25`, `core-api/src/core_api/pipeline/compositions/search.py:26`, `core-api/src/core_api/pipeline/compositions/search.py:29`.

Full scored-search formula in storage:

```text
vec_sim =
  has_embedding ? 1.0 - cosine_distance(query_embedding, memory.embedding) : 0.0

fts_score =
  ts_rank_cd(search_vector, plainto_tsquery(query)) / (1.0 + raw_fts)

similarity =
  has_embedding
    ? (1.0 - fts_weight) * vec_sim + fts_weight * fts_score
    : fts_score

anchor =
  greatest(created_at, coalesce(ts_valid_start, created_at))

type_decay_days =
  TYPE_DECAY_DAYS[memory_type] else freshness_decay_days

freshness =
  if ts_valid_end exists and ts_valid_end < now: freshness_floor
  else if ts_valid_end exists: 1.0
  else if age_days < type_decay_days:
    1.0 - (age_days / type_decay_days) * (1.0 - freshness_floor)
  else freshness_floor

recency_factor =
  max(0.0, 1.0 - days_since_last_recall_or_created / recall_decay_window_days)

recall_boost =
  if enabled:
    1.0 + (recall_boost_cap - 1.0)
      * recency_factor
      * recall_count / (recall_count + RECALL_BOOST_SCALE)
  else 1.0

base_score =
  similarity_blend * similarity + (1.0 - similarity_blend) * weight

temporal_boost =
  if query temporal_window exists and created_at >= now - temporal_window: 1.3
  else 1.0

date_range_boost =
  if query date-range exists and anchor date is inside range: date_range_boost_factor
  else 1.0

currency_factor =
  if valid_at exists and ts_valid_end exists and ts_valid_end < valid_at: expired_currency_factor
  else 1.0

status_penalty =
  if status in ("outdated", "conflicted"): 0.5
  else 1.0

entity_boost =
  best graph/entity boost for memory, else 1.0

score =
  base_score
  * freshness
  * entity_boost when present
  * recall_boost
  * temporal_boost
  * date_range_boost
  * currency_factor
  * status_penalty
```

Evidence: vector and FTS handling are in `core-storage-api/src/core_storage_api/services/postgres_service.py:895`, `core-storage-api/src/core_storage_api/services/postgres_service.py:904`, `core-storage-api/src/core_storage_api/services/postgres_service.py:905`, `core-storage-api/src/core_storage_api/services/postgres_service.py:906`, `core-storage-api/src/core_storage_api/services/postgres_service.py:919`, `core-storage-api/src/core_storage_api/services/postgres_service.py:921`, `core-storage-api/src/core_storage_api/services/postgres_service.py:922`, `core-storage-api/src/core_storage_api/services/postgres_service.py:924`; freshness is in `core-storage-api/src/core_storage_api/services/postgres_service.py:927`, `core-storage-api/src/core_storage_api/services/postgres_service.py:931`, `core-storage-api/src/core_storage_api/services/postgres_service.py:933`, `core-storage-api/src/core_storage_api/services/postgres_service.py:938`, `core-storage-api/src/core_storage_api/services/postgres_service.py:944`, `core-storage-api/src/core_storage_api/services/postgres_service.py:946`, `core-storage-api/src/core_storage_api/services/postgres_service.py:948`, `core-storage-api/src/core_storage_api/services/postgres_service.py:949`, `core-storage-api/src/core_storage_api/services/postgres_service.py:951`; recall activation is in `core-storage-api/src/core_storage_api/services/postgres_service.py:954`, `core-storage-api/src/core_storage_api/services/postgres_service.py:958`, `core-storage-api/src/core_storage_api/services/postgres_service.py:962`, `core-storage-api/src/core_storage_api/services/postgres_service.py:963`, `core-storage-api/src/core_storage_api/services/postgres_service.py:965`, `core-storage-api/src/core_storage_api/services/postgres_service.py:967`, `core-storage-api/src/core_storage_api/services/postgres_service.py:968`; final score composition is in `core-storage-api/src/core_storage_api/services/postgres_service.py:973`, `core-storage-api/src/core_storage_api/services/postgres_service.py:979`, `core-storage-api/src/core_storage_api/services/postgres_service.py:980`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1004`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1010`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1017`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1018`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1029`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1035`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1049`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1050`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1052`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1054`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1055`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1056`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1057`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1058`.

Default constants: `fts_weight=0.3`, boosted FTS for short specific queries `0.6`, `similarity_blend=0.85`, `recall_boost_cap=1.5`, `recall_decay_window_days=90`, `freshness_decay_days=90`, `freshness_floor=0.7`, `min_similarity=0.3`, `search_overfetch_factor=2`, direct/1-hop/2-hop graph boost `1.3/1.2/1.1`, max boosted memories `50`, date-range boost `2.0`, expired-currency factor `0.5`, and `RECALL_BOOST_SCALE=10`. Evidence: `core-api/src/core_api/constants.py:127`, `core-api/src/core_api/constants.py:128`, `core-api/src/core_api/constants.py:129`, `core-api/src/core_api/constants.py:444`, `core-api/src/core_api/constants.py:445`, `core-api/src/core_api/constants.py:446`, `core-api/src/core_api/constants.py:447`, `core-api/src/core_api/constants.py:449`, `core-api/src/core_api/constants.py:468`, `core-api/src/core_api/constants.py:469`, `core-api/src/core_api/constants.py:472`, `core-api/src/core_api/constants.py:473`, `core-api/src/core_api/constants.py:474`, `core-api/src/core_api/constants.py:475`, `core-storage-api/src/core_storage_api/config.py:85`, `core-storage-api/src/core_storage_api/config.py:89`, `core-storage-api/src/core_storage_api/config.py:91`, `core-storage-api/src/core_storage_api/config.py:95`, `common/constants.py:37`, `common/constants.py:38`.

Per-type freshness decay windows are linear-to-floor, not exponential: `preference/rule=365`, `decision=180`, `fact/semantic/commitment=120`, `outcome/insight=90`, `plan/intention=60`, `episode=45`, `task/action=30`, `cancellation=14`. Evidence: `common/constants.py:40`, `common/constants.py:41`, `common/constants.py:42`, `common/constants.py:43`, `common/constants.py:44`, `common/constants.py:45`, `common/constants.py:46`, `common/constants.py:47`, `common/constants.py:48`, `common/constants.py:49`, `common/constants.py:50`, `common/constants.py:51`, `common/constants.py:52`, `common/constants.py:53`, `common/constants.py:54`, `common/constants.py:55`.

Weight does not decay in the scored-search formula; it is a stored prior blended into `base_score` and stored on `Memory.weight`. Evidence: `common/models/memory.py:25`, `core-storage-api/src/core_storage_api/services/postgres_service.py:973`. Activation state is stored as `recall_count` and `last_recalled_at`; MemClaw increments them only after returned memories are filtered, using a background task in the active pipeline. Evidence: `common/models/memory.py:68`, `common/models/memory.py:69`, `common/models/memory.py:72`, `core-api/src/core_api/pipeline/steps/search/track_recalls.py:1`, `core-api/src/core_api/pipeline/steps/search/track_recalls.py:20`, `core-api/src/core_api/pipeline/steps/search/track_recalls.py:27`, `core-api/src/core_api/pipeline/steps/search/track_recalls.py:28`, `core-api/src/core_api/pipeline/steps/search/track_recalls.py:29`, `core-api/src/core_api/pipeline/steps/search/track_recalls.py:40`, `core-api/src/core_api/pipeline/steps/search/track_recalls.py:42`, `core-api/src/core_api/repositories/memory_repository.py:1008`, `core-api/src/core_api/repositories/memory_repository.py:1015`, `core-api/src/core_api/repositories/memory_repository.py:1016`.

Post-filtering gates embedded rows by `vec_sim >= min_similarity`, but FTS-only/unembedded rows bypass that gate. Evidence: `core-api/src/core_api/pipeline/steps/search/post_filter_results.py:20`, `core-api/src/core_api/pipeline/steps/search/post_filter_results.py:21`, `core-api/src/core_api/pipeline/steps/search/post_filter_results.py:30`, `core-api/src/core_api/pipeline/steps/search/post_filter_results.py:33`, `core-api/src/core_api/pipeline/steps/search/post_filter_results.py:35`, `core-api/src/core_api/pipeline/steps/search/post_filter_results.py:37`, `core-api/src/core_api/pipeline/steps/search/post_filter_results.py:40`.

## Teachings for Spec Kit Memory (027/007 + recall scoring)
1. **Claim** · Use activation as a bounded, decaying multiplier, not as an additive rank term. **Evidence** · `recall_boost = 1 + (cap - 1) * recency_factor * recall_count/(recall_count + scale)`, with cap `1.5`, scale `10`, and 90-day linear recall recency window: `core-storage-api/src/core_storage_api/services/postgres_service.py:962`, `core-storage-api/src/core_storage_api/services/postgres_service.py:963`, `core-storage-api/src/core_storage_api/services/postgres_service.py:965`, `core-storage-api/src/core_storage_api/services/postgres_service.py:967`, `core-storage-api/src/core_storage_api/services/postgres_service.py:968`, `core-api/src/core_api/constants.py:474`, `core-api/src/core_api/constants.py:475`, `common/constants.py:37`, `common/constants.py:38`. **Maps-to** · 027/007 recall scoring; compare against Spec Kit’s existing co-activation and FSRS decay by treating “actual recall hit” as a separate activation channel from graph co-activation. **Verdict** · ADAPT. **Risk** · Popular-but-stale memories can become sticky if the decay window is too long or if recall increments include low-value automatic injections. **Confidence** · 0.86. **Why it transfers (or not)** · Single-user/local systems still need anti-rich-get-richer controls; the bounded saturating curve transfers, but the 90-day window should be calibrated to Spec Kit session cadence rather than copied.

2. **Claim** · Keep similarity dominant and blend stored importance as a prior, instead of multiplying similarity by weight. **Evidence** · MemClaw changed to `base_score = 0.85 * similarity + 0.15 * weight`; `SIMILARITY_BLEND` is documented as raised from `0.75` after a LoCoMo sweep: `core-storage-api/src/core_storage_api/services/postgres_service.py:973`, `core-storage-api/src/core_storage_api/services/postgres_service.py:974`, `core-api/src/core_api/constants.py:472`. **Maps-to** · 027/007 hybrid lexical+semantic trigger fallback plus existing importance tiers. **Verdict** · ADAPT. **Risk** · A linear prior can let high-tier but weakly related memories leak into results if candidate generation is broad; preserve Spec Kit’s lexical/semantic gates and min thresholds. **Confidence** · 0.82. **Why it transfers (or not)** · Spec Kit already has importance tiers; MemClaw’s teaching is the composition shape: importance should nudge within a relevant candidate set, not replace relevance.

3. **Claim** · Apply type-aware freshness as a read-time multiplier with floors, not by mutating stored weight. **Evidence** · `TYPE_DECAY_DAYS` drives per-type linear freshness down to `freshness_floor`; stored `Memory.weight` remains a separate field used in `base_score`: `common/constants.py:40`, `common/constants.py:41`, `common/constants.py:42`, `common/constants.py:43`, `common/constants.py:44`, `common/constants.py:48`, `common/constants.py:51`, `common/constants.py:53`, `common/models/memory.py:25`, `core-storage-api/src/core_storage_api/services/postgres_service.py:933`, `core-storage-api/src/core_storage_api/services/postgres_service.py:938`, `core-storage-api/src/core_storage_api/services/postgres_service.py:949`, `core-storage-api/src/core_storage_api/services/postgres_service.py:951`, `core-storage-api/src/core_storage_api/services/postgres_service.py:973`. **Maps-to** · New sub-packet for recall scoring calibration; compare with Spec Kit’s FSRS-style decay and tiers. **Verdict** · ADAPT. **Risk** · Spec Kit already has FSRS-style decay, so adding a second freshness multiplier can double-penalize old memories. **Confidence** · 0.80. **Why it transfers (or not)** · The transferable part is “durable prior + query-time decay factor”; the exact linear windows are less suitable than Spec Kit’s existing FSRS mechanics.

4. **Claim** · Prefer soft temporal/currency/status multipliers over hard exclusion for stale-but-relevant memory. **Evidence** · MemClaw uses date-range boost `2.0`, expired-currency factor `0.5`, and status penalty `0.5`, and comments explicitly say date-range and expired validity moved from hard filters to soft scoring: `core-storage-api/src/core_storage_api/services/postgres_service.py:986`, `core-storage-api/src/core_storage_api/services/postgres_service.py:989`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1004`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1010`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1017`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1018`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1022`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1025`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1029`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1035`, `core-storage-api/src/core_storage_api/config.py:85`, `core-storage-api/src/core_storage_api/config.py:89`, `core-storage-api/src/core_storage_api/config.py:91`, `core-storage-api/src/core_storage_api/config.py:95`. **Maps-to** · 027/007 trigger fallback and new sub-packet for stale/conflicted packet recall. **Verdict** · ADOPT for soft penalties; ADAPT constants. **Risk** · If outdated/conflicted content is unsafe to surface, a soft penalty may be insufficient without UI labeling or answer-time caveats. **Confidence** · 0.84. **Why it transfers (or not)** · Single-user/local memory benefits from “do not hide evidence catastrophically”; fleet validity semantics do not transfer wholesale, but stale/conflicted status penalties do.

5. **Claim** · Use entity/co-activation boosts as bounded multiplicative context, but do not copy MemClaw’s graph-fanout machinery. **Evidence** · Direct/1-hop/2-hop graph boosts are `1.3/1.2/1.1`, relation weights multiply hop boosts, multi-entity overlap adds up to 40% extra but is capped by `RECALL_BOOST_CAP`, and boosted memories are capped at 50: `core-api/src/core_api/constants.py:444`, `core-api/src/core_api/constants.py:445`, `core-api/src/core_api/constants.py:446`, `core-api/src/core_api/constants.py:447`, `core-api/src/core_api/constants.py:449`, `core-api/src/core_api/pipeline/steps/search/parallel_embed_entity_boost.py:108`, `core-api/src/core_api/pipeline/steps/search/parallel_embed_entity_boost.py:109`, `core-api/src/core_api/pipeline/steps/search/parallel_embed_entity_boost.py:110`, `core-api/src/core_api/pipeline/steps/search/parallel_embed_entity_boost.py:111`, `core-api/src/core_api/pipeline/steps/search/parallel_embed_entity_boost.py:113`, `core-api/src/core_api/pipeline/steps/search/parallel_embed_entity_boost.py:116`, `core-api/src/core_api/pipeline/steps/search/parallel_embed_entity_boost.py:128`, `core-api/src/core_api/pipeline/steps/search/parallel_embed_entity_boost.py:129`, `core-api/src/core_api/pipeline/steps/search/parallel_embed_entity_boost.py:131`. **Maps-to** · Spec Kit’s existing co-activation; likely not 027/007 itself unless entity terms are part of lexical fallback. **Verdict** · ADAPT. **Risk** · Over-boosting co-activated packet docs can drown exact lexical matches in a small local corpus. **Confidence** · 0.78. **Why it transfers (or not)** · The bounded multiplier transfers; MemClaw’s multi-tenant entity graph, hop expansion, and fanout caps are fleet-scale machinery, not needed for local SQLite unless Spec Kit already has cheap co-activation edges.

## Negative knowledge
- Do not copy Postgres/pgvector NULL-embedding handling as architecture. MemClaw has special CASE logic and FTS fallback because pgvector cosine can return NULL and PostgreSQL can sort NULL scores first; Spec Kit should keep the invariant “missing vector cannot outrank relevance” but not reproduce the pgvector-specific CTE shape. Evidence: `core-storage-api/src/core_storage_api/services/postgres_service.py:884`, `core-storage-api/src/core_storage_api/services/postgres_service.py:895`, `core-storage-api/src/core_storage_api/services/postgres_service.py:900`, `core-storage-api/src/core_storage_api/services/postgres_service.py:908`, `core-storage-api/src/core_storage_api/services/postgres_service.py:919`, `core-storage-api/src/core_storage_api/services/postgres_service.py:924`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1072`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1091`.

- Do not copy multi-tenant/fleet visibility, readable-tenant widening, cross-tenant audit, or per-tenant storage bulkheads into single-user local ranking. Evidence: `core-storage-api/src/core_storage_api/services/postgres_service.py:1101`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1107`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1120`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1123`, `core-api/src/core_api/mcp_server.py:525`, `core-api/src/core_api/mcp_server.py:532`, `core-api/src/core_api/mcp_server.py:546`, `core-api/src/core_api/mcp_server.py:548`, `core-api/src/core_api/mcp_server.py:554`.

- Do not copy per-agent tunable search profiles as a primary local-memory feature. MemClaw exposes tuning for `fts_weight`, freshness, recall cap/window, graph hops, and similarity blend because it serves multiple agents/tenants; Spec Kit should use one transparent local scoring policy unless evaluation shows profile switching is needed. Evidence: `core-api/src/core_api/mcp_server.py:1094`, `core-api/src/core_api/mcp_server.py:1098`, `core-api/src/core_api/mcp_server.py:1099`, `core-api/src/core_api/mcp_server.py:1100`, `core-api/src/core_api/mcp_server.py:1101`, `core-api/src/core_api/mcp_server.py:1102`, `core-api/src/core_api/mcp_server.py:1103`, `core-api/src/core_api/mcp_server.py:1104`, `core-api/src/core_api/pipeline/steps/search/resolve_search_profile.py:27`, `core-api/src/core_api/pipeline/steps/search/resolve_search_profile.py:33`.

- Do not copy the entity-lookup short-circuit that bypasses semantic/lexical scoring and ranks only by graph hop boost. That is useful for fleet entity search, but dangerous in local Spec Kit recall because packet/doc lexical relevance should remain visible. Evidence: `core-api/src/core_api/pipeline/steps/search/classify_query.py:283`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:305`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:314`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:322`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:338`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:340`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:378`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:381`, `core-api/src/core_api/pipeline/steps/search/classify_query.py:388`.

## Open questions
- What is Spec Kit’s current exact recall-score formula after semantic+lexical fusion, FSRS decay, importance tiers, recency, and co-activation, and where would a bounded activation multiplier fit without double-counting?
- Should Spec Kit increment activation on every retrieved candidate, only injected memories, or only memories actually used in an answer/handover?
- What decay half-life/window matches Spec Kit usage: session-scale, packet-scale, or calendar-scale?
- Should stale/conflicted packet docs be softly penalized, hard-filtered by default, or surfaced with labels depending on query intent?
- Can Spec Kit evaluate a small grid: `similarity_blend`, activation cap, activation scale, freshness floor, and co-activation cap against known resume/search tasks?

DELTA_JSON: {"iteration":"009","focus":"recall ranking / activation / decay","findingsCount":5,"newInfoRatio":0.78,"topVerdicts":["ADAPT: bounded decaying activation multiplier","ADAPT: similarity-dominant base score with importance prior","ADAPT: read-time type-aware freshness without mutating weight","ADOPT: soft stale/currency/status penalties over hard exclusion","ADAPT: bounded co-activation/entity boost, reject fleet graph machinery"],"sources":["core-storage-api/src/core_storage_api/services/postgres_service.py:895","core-storage-api/src/core_storage_api/services/postgres_service.py:919","core-storage-api/src/core_storage_api/services/postgres_service.py:938","core-storage-api/src/core_storage_api/services/postgres_service.py:963","core-storage-api/src/core_storage_api/services/postgres_service.py:973","core-storage-api/src/core_storage_api/services/postgres_service.py:1050","core-api/src/core_api/constants.py:468","core-api/src/core_api/constants.py:472","core-api/src/core_api/constants.py:474","common/constants.py:38","common/constants.py:41","common/models/memory.py:68"]}
