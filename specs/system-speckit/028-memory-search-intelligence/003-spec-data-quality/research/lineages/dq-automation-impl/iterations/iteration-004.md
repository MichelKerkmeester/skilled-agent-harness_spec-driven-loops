# Iteration 004 — B3: the retrieval-learning feedback edge (never-retrieved → queued refinement)

Focus: the exact `learned-feedback.ts` seams, the queue/store for refinement actions, and how a never-retrieved signal becomes a queued action without falsely paying the floor. Reader class: R/A. Floor: SPLIT (see below — this is the key insight).

## The missing half of the feedback loop (confirmed by absence)

`learned-feedback.ts` implements only the POSITIVE edge: `recordSelection(queryId, memoryId, queryTerms, resultRank, db)` (`:257`) fires when a user SELECTS a result that was NOT in the top-3 (`:271 resultRank <= TOP_N_EXCLUSION` exclusion), and learns the query terms onto that memory's `learned_triggers` column. There is **no negative edge**: grep for `impression|never.retriev|times_retrieved|last_retrieved|retrieval_log` across `lib/` + `handlers/` returns EMPTY. The system can learn from a hit; it is blind to a miss. B3 is that missing half.

## Why this is harder than it looks: the floor splits the signal

A "never-retrieved" memory has two mutually-exclusive causes, and the truncation law makes them require OPPOSITE treatments:

- **Edge (a) — never appeared in ANY result set.** A real recall gap: the memory's `trigger_phrases`/embedding never match relevant queries at all. The fix (enrich triggers/description) is **write-time class → BYPASSES the 3-floor → can ship on cost** (it changes whether the doc enters candidate generation, upstream of truncation).
- **Edge (b) — appeared in candidate sets but always below the 3-floor.** A truncation casualty: the doc IS retrieved into the long tail, then cut by `DEFAULT_MIN_RESULTS=3`. The fix is **retrieval-class → PAYS the floor → C2-gated** (only a prod-mode completeRecall@3 read can confirm a reorder).

**B3's core design contribution: the queued action MUST carry which edge it is, because edge (a) suggestions can be acted on by B1/B2 immediately while edge (b) suggestions are report-only-until-C2.** Conflating them is exactly the "promote a retrieval candidate on the wrong evidence" trap the parent warns against. To distinguish them you need impression data, not just selection data — which is why B3 requires capturing a new signal.

## Build-ready seams

### Seam 1 — capture the impression signal (the new telemetry)

At the result-assembly seam (where `memory_search` returns its ranked list, the same place `confidence-truncation` applies the floor), record two per-memory facts into a NEW lightweight store, modeled exactly on the learned-feedback audit table:

- `impression`: this memory appeared in a candidate set for query Q at rank R (BEFORE the floor cut). This is what distinguishes edge (a) from (b): an edge-(a) memory has zero impressions; an edge-(b) memory has impressions all at rank > 3.
- Store: a `retrieval_impressions` table (mirror `learned_feedback_audit` DDL at `learned-feedback.ts:103-113`): `{id, memory_id, query_id, rank, below_floor INTEGER, timestamp}`. Separate table, NEVER FTS5 (Safeguard #1 reused). Write it async/non-blocking from the search path so it never adds query latency.
- Sampling: to bound write cost, sample impressions (e.g. 1-in-N queries) or aggregate to a rolling `impression_count` + `min_rank_seen` column on `memory_index` (cheaper, loses per-query detail). The aggregate column is the recommended v1 (one UPDATE per result set).

### Seam 2 — compute the never-retrieved set

A new `scripts/memory/detect-retrieval-gaps.ts` reads `memory_index` joined against impressions:
- edge (a) candidate: `impression_count == 0` AND `age > MIN_MEMORY_AGE_MS` (reuse `isMemoryEligible`, `learned-feedback.ts:181`) AND not in shadow period (reuse `isInShadowPeriod`, `:422`).
- edge (b) candidate: `impression_count > 0` AND `min_rank_seen > 3` (always truncated).
This is a pure read; it produces a list, it changes nothing.

### Seam 3 — queue the refinement action (never auto-apply)

A new `refinement_queue` table, schema mirrored from `learned_feedback_audit` plus a status column:
```
refinement_queue(id, memory_id, signal TEXT,          -- 'never_retrieved' | 'below_floor'
                 edge TEXT,                            -- 'a_recall_gap' | 'b_truncation'
                 suggested_action TEXT,                -- 'enrich_triggers' | 'review_description' | 'reindex_candidate'
                 floor_class TEXT,                     -- 'bypass' (edge a) | 'pays' (edge b)
                 status TEXT DEFAULT 'queued',         -- queued | applied | dismissed | expired
                 source TEXT, created_at INTEGER, expires_at INTEGER)
```
`detect-retrieval-gaps.ts` INSERTs rows; nothing here writes a doc. The queue is the deliverable. B1's sweep and B2's `/doctor data-quality` READ this queue:
- `floor_class == 'bypass'` (edge a) rows surface as `fixClass: risky` suggestions in DIAGNOSE (a human enriches triggers; this is judgment-bearing authoring, so NOT auto-safe even though it bypasses the floor).
- `floor_class == 'pays'` (edge b) rows surface as report-only with the explicit note "retrieval-class — promote only on a prod-mode completeRecall@3 read (see C2)."

## Reuse map (learned-feedback.ts is the template)

| B3 need | Reused mechanism (learned-feedback.ts) |
|---|---|
| separate non-FTS5 store | Safeguard #1 pattern (`:103-113, :398-402`) |
| memory-age eligibility (>72h) | `isMemoryEligible` (`:181`) |
| 1-week shadow before acting | `isInShadowPeriod` (`:422`) |
| TTL expiry of stale queue rows | `expireLearnedTerms` (`:523`) → `expireRefinementQueue` |
| nuclear rollback | `clearAllLearnedTriggers` (`:577`) → `clearRefinementQueue` |
| provenance/audit | `learned_feedback_audit` schema (`:103`) |
| feature gate | `isLearnedFeedbackEnabled` flag pattern (`:169`) → `SPECKIT_RETRIEVAL_GAP_DETECT` (default OFF, opt-in — it captures new telemetry) |

## On-write vs retroactive timing

- Impression capture (Seam 1): on-read (every search), async, never blocks.
- Gap detection + queueing (Seams 2-3): RETROACTIVE, runs inside the B1 scheduled sweep (it is one more detector the sweep invokes).
- Acting on the queue: human (B2 DIAGNOSE) or never-auto. B3 itself proposes; it does not refine.

## Rollback

- Impression capture: gated by `SPECKIT_RETRIEVAL_GAP_DETECT` (default OFF) — set false to stop capture; the column/table is inert.
- Queue: `clearRefinementQueue` (the `clearAllLearnedTriggers` analogue) purges it; rows are dismissible. No doc was ever mutated by B3, so there is nothing to revert in the corpus.

## Risks

- **RISK-B3a (false recall-gap from sampling):** if impressions are sampled 1-in-N, a memory can read as `impression_count==0` purely by sampling luck → false edge-(a). MITIGATION: use the aggregate `impression_count` UPDATE-per-result-set (full coverage, no sampling) in v1; require a multi-week window before flagging never-retrieved.
- **RISK-B3b (floor-class misattribution):** marking an edge-(b) truncation casualty as edge-(a) recall gap and "fixing" triggers that were never the problem. MITIGATION: `min_rank_seen` is the discriminator; if a memory has ANY impression it is edge (b), full stop. Edge (a) requires literally zero impressions over the window.
- **RISK-B3c (telemetry write amplification):** an UPDATE per result set on every query. MITIGATION: async/batched writes; or write only when `below_floor` to bound volume; the table is non-FTS5 so no index churn.
- **RISK-B3d (acting on the queue auto-promotes a retrieval change):** the whole point of the parent law. MITIGATION: the queue is report-only; `floor_class=='pays'` rows are explicitly C2-gated; nothing in B3 writes a doc or reindexes.

## Rollout order (B3 internal)

1. Add impression capture (aggregate column) behind `SPECKIT_RETRIEVAL_GAP_DETECT=false` default-off; let it accumulate a multi-week window with zero downstream effect.
2. Build `detect-retrieval-gaps.ts` + the `refinement_queue` table; run it read-only inside the B1 sweep, emitting queue rows.
3. Surface the queue in B2 `/doctor data-quality` DIAGNOSE as report-only suggestions, edge-tagged.
4. Edge-(a) suggestions become operator-actionable enrich-trigger tasks; edge-(b) stay frozen until C2 exists.

## Dead ends ruled out this iteration

- Deriving never-retrieved from `learned_feedback_audit` alone — selection ≠ impression; the audit only logs selected results, so it cannot distinguish a never-shown memory from a shown-but-not-selected one. Impression capture is mandatory. [evidence: `learned-feedback.ts:257-341` only records selections]
- Treating all never-retrieved memories as one fixable class — the floor splits them into edge (a) bypass vs edge (b) pays; conflation repeats the parent's promotion trap. [evidence: parent truncation law]
- Auto-applying any B3 suggestion — B3 queues, it never refines; retrieval-class actions are C2-gated. [design]

## Assessment

newInfoRatio: 0.74 — the edge-(a)/edge-(b) split keyed on impression-vs-selection, the new impression-capture seam (proven absent by grep), and the report-only queue mirrored on the learned-feedback governance are all net-new build design. Status: insight (reframes the never-retrieved signal as a floor-split, a conceptual sharpening of the parent law applied to a new edge). Sources: `learned-feedback.ts:103-113,169,181,257-341,398-402,422,523,577`; grep(impression/never-retrieved)=empty; parent truncation law.
