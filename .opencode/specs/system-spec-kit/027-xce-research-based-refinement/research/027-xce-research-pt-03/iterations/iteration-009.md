# Iteration 009 - RQ-B4 Feedback-ledger-driven learned retention/decay

## Focus

RQ-B4 asks whether `feedback-ledger.ts` signals can modulate existing memory and causal-edge lifetimes: extending TTLs for frequently cited memories, protecting constitutional/critical records from decay, and feeding those decisions into the current retention sweep and Hebbian edge decay paths.

Verdict: ADAPT. The signal source is real enough, and the retention/decay surfaces already have the needed columns and sweep hooks. The proposed design should not use raw `hit_count`, though. It should use a bounded feedback-retention reducer that counts strong positive signals, treats weak exposure separately, gates boosts by quality/tier, and runs in shadow before mutating `delete_after`, `decay_half_life_days`, or edge strength floors.

## Actions Taken

- Read `feedback-ledger.ts` for event schema, confidence mapping, indices, query filters, and per-memory summary helpers.
- Read `shadow-scoring.ts` for the existing holdout, weekly-cycle, promotion-gate precedent.
- Read `memory-retention-sweep.ts` for current `delete_after` selection and governed deletion behavior.
- Read `causal-edges.ts` and `storage/consolidation.ts` for edge bounds, stale-edge detection, and 30-day strength decay.
- Read `tier-classifier.ts`, `importance-tiers.ts`, `fsrs-scheduler.ts`, `vector-index-schema.ts`, and vector query decay paths for tier and decay baselines.
- Read iteration 008 and Pt-03 state/strategy continuity.

## Findings

### F-iter009-001 - The ledger can support learned retention, but raw total hits would reward exposure instead of usefulness

Verdict: ADAPT_WITH_STRONG_SIGNAL_WEIGHTING. LOC estimate: ~40-70 production LOC plus ~35-60 tests.

Evidence: `feedback-ledger.ts` records five event types with an explicit confidence hierarchy: `result_cited` and `follow_on_tool_use` are strong, `query_reformulated` is medium, and `search_shown` plus `same_topic_requery` are weak (`feedback-ledger.ts:19-33`, `feedback-ledger.ts:74-84`). The table stores `memory_id`, `query_id`, `confidence`, `timestamp`, and `session_id`, with indexes across those dimensions (`feedback-ledger.ts:115-137`). `getFeedbackEvents` supports memory, query, confidence, session, and time-window filters ordered by timestamp (`feedback-ledger.ts:231-276`), and `getMemoryFeedbackSummary` aggregates counts by confidence (`feedback-ledger.ts:305-338`).

Implication: the reducer should not use `summary.total` as `hit_count`, because a memory that is often shown but never cited would accumulate weak events and get retained. Use weighted positives instead: `strong_hits = result_cited + follow_on_tool_use`, optionally `medium_penalty = query_reformulated`, and `weak_exposure = search_shown + same_topic_requery` only as a denominator or audit field. A safer score is `weightedHitCount = strong + 0.25 * same_topic_requery - 0.5 * query_reformulated`, clamped at zero, then apply `ttlMultiplier = min(2, 1 + log10(max(1, weightedHitCount)))`.

### F-iter009-002 - The retention sweep has a clean insertion point, but it currently lacks the tier fields needed to make safe keep/delete decisions

Verdict: ADAPT_SWEEP_SELECT_AND_DECISION_REDUCER. LOC estimate: ~45-85 production LOC plus ~50-80 tests.

Evidence: `memory-retention-sweep.ts` currently selects only expired rows where `delete_after IS NOT NULL` and `datetime(delete_after) < datetime('now')` (`memory-retention-sweep.ts:52-68`). The selected row type does not include `importance_tier`, `decay_half_life_days`, `is_pinned`, `access_count`, or `last_accessed` (`memory-retention-sweep.ts:17-28`). Once a candidate is selected, the sweep deletes through `vectorIndex.deleteMemory`, records history, writes governance audit metadata, and appends a mutation-ledger delete entry (`memory-retention-sweep.ts:152-195`). The underlying schema already has `decay_half_life_days`, `is_pinned`, access counters, `importance_tier`, `retention_policy`, and `delete_after` (`vector-index-schema.ts:2375-2393`).

Implication: implement retention learning as a decision reducer before deletion, not as a post-delete correction. Extend `RetentionExpiredRow` and `selectExpiredRows` to include `importance_tier`, `decay_half_life_days`, `is_pinned`, `access_count`, and `last_accessed`. For each expired candidate, compute a `RetentionDecision` of `delete`, `extend`, or `protect`; update `delete_after` for `extend`, preserve and audit for `protect`, and only call `deleteMemory` for final `delete`.

### F-iter009-003 - Constitutional and critical records already have no-decay semantics in scoring, but the delete-after sweep can still remove them

Verdict: ADAPT_WITH_RETENTION_BASEMENT. LOC estimate: ~25-45 production LOC plus ~30-55 tests.

Evidence: `tier-classifier.ts` returns `null` half-life for `constitutional` or `critical`, which is then treated as effectively infinite stability and HOT retrievability (`tier-classifier.ts:185-213`, `tier-classifier.ts:291-303`). `importance-tiers.ts` marks `constitutional`, `critical`, and `important` as `decay: false` with no auto-expiration (`importance-tiers.ts:32-55`). `fsrs-scheduler.ts` likewise assigns `Infinity` stability to constitutional and critical tiers, and important gets slower decay (`fsrs-scheduler.ts:286-304`). But `memory-retention-sweep.ts` selects expired rows solely by `delete_after`, without checking those tier rules (`memory-retention-sweep.ts:52-68`).

Implication: the first implementation target should be the delete-after safety gap, not an aggressive learned TTL system. Constitutional and critical records need a hard retention basement: never delete due only to expired `delete_after`; instead clear or extend `delete_after` and record a governance audit decision. Important records can receive feedback-based extensions, but normal and temporary records should not be promoted by feedback alone.

### F-iter009-004 - The causal-edge strength floor needs endpoint-tier joins and must not protect noisy auto-derived edges

Verdict: ADAPT_EDGE_FLOOR_NARROWLY. LOC estimate: ~50-90 production LOC plus ~60-100 tests.

Evidence: causal edge constants define the current bounds: max 20 edges per node, auto strength cap 0.5, stale threshold 90 days, and 0.1 decay per 30-day period (`causal-edges.ts:45-53`). The Hebbian cycle decays any edge not accessed within `DECAY_PERIOD_DAYS` by subtracting `DECAY_STRENGTH_AMOUNT`, with no tier or provenance floor (`consolidation.ts:330-379`). Stale-edge detection separately flags edges at 90 days without deletion (`consolidation.ts:395-400`; `causal-edges.ts:1023-1032`). Edge rows store source/target IDs and `created_by`, but no importance tier (`causal-edges.ts:71-84`).

Implication: a blanket `strength >= 0.7` floor for any edge touching a constitutional memory is too broad. It could keep low-quality or auto-session edges alive just because one endpoint is important. Add a reducer helper that joins edge endpoints to `memory_index.importance_tier` and applies the 0.7 floor only to manual/authored edges where both endpoints are `constitutional` or `critical`, or to edges whose evidence/provenance explicitly marks a constitutional rule chain. Auto-derived feedback edges from RQ-B3 should remain capped at 0.5 and should decay normally unless later validated.

### F-iter009-005 - Shadow-scoring provides the promotion model; learned retention should copy that gate before mutating live lifetimes

Verdict: DEFER_LIVE_MUTATION_UNTIL_SHADOW_EVAL. LOC estimate: ~55-95 production LOC plus ~50-90 tests.

Evidence: `shadow-scoring.ts` is explicitly designed to compare would-have-changed outcomes against live behavior, use deterministic holdout selection, require two stable improvement weeks, and log audit results (`shadow-scoring.ts:1-15`, `shadow-scoring.ts:28-35`). It records cycle aggregates and exposes consecutive-improvement and promotion checks (`shadow-scoring.ts:421-494`). `logRankDelta` is shadow-only and does not mutate live ranking (`shadow-scoring.ts:320-369`). Feedback logging itself has the same no-side-effect contract (`feedback-ledger.ts:161-169`).

Implication: learned retention should start with a `retention_decision_shadow_log` or reuse a generic reducer audit table before modifying production TTLs. A live TTL extension silently changes future memory availability; that is a governance mutation, not telemetry. Promotion should require an evaluation window showing fewer useful-memory deletions without increasing stale/low-quality retained records.

### F-iter009-006 - The proposed TTL formula is usable only after tier and quality guards

Verdict: ADAPT_FORMULA_WITH_GUARDS. LOC estimate: included in reducer design.

Evidence: search-time decay already uses a half-life fallback when FSRS review data is missing (`vector-index-store.ts:7-14`; `vector-index-queries.ts:202-213`). The schema exposes `decay_half_life_days` and `delete_after` as separate fields, so search-time decay and governance deletion can be tuned independently (`vector-index-schema.ts:2375-2393`). Tier policy says normal and temporary decay, while important/critical/constitutional do not (`importance-tiers.ts:32-68`, `importance-tiers.ts:110-119`).

Implication: keep the user's proposed cap, but change the input and target:

- TTL extension: `extension = baseTtlMs * min(2, 1 + log10(max(1, weightedHitCount)))`
- Apply only when `tier in {'important','critical','constitutional'}` or `is_pinned = 1`
- For `critical` and `constitutional`, prefer `protect` over repeated finite extensions
- For `important`, extend `delete_after` but cap cumulative extension per sweep/window
- For `normal` and `temporary`, record shadow decisions but do not extend in v1
- Never update `decay_half_life_days` from feedback until shadow evaluation passes; start by adjusting only future `delete_after` decisions

## Proposed Design

Add `lib/feedback/feedback-retention-reducer.ts` and keep it shared with the RQ-B3 reducer only at the aggregation layer.

Shared aggregation:

- Read `feedback_events` in a bounded `{ since, until }` window.
- Aggregate by `memory_id`.
- Track `strong`, `medium`, `weak`, `sessions`, `queries`, `firstSeen`, and `lastSeen`.
- Derive `weightedHitCount` from strong positives; do not let weak exposure boost retention by itself.

Retention decision:

```ts
type RetentionDecision =
  | { action: 'delete'; reason: 'expired_unprotected' }
  | { action: 'extend'; newDeleteAfter: string; reason: 'feedback_supported' }
  | { action: 'protect'; reason: 'tier_basement' };
```

Decision rules:

1. Constitutional or critical: `protect`, regardless of expired `delete_after`.
2. Pinned: `protect` or extend by policy.
3. Important + positive weighted hits: `extend` by `baseTtl * min(2, 1 + log10(max(1, weightedHitCount)))`.
4. Important + no positive hits: use existing delete-after policy.
5. Normal/temporary/deprecated: no positive TTL boost in v1; delete if expired unless existing governance says otherwise.
6. Medium negative signal (`query_reformulated`) reduces or blocks extension when it dominates strong positives.

Sweep integration:

- Extend `RetentionExpiredRow` with tier and decay metadata.
- Add a `dryRun` path that returns decisions without writes.
- For `extend`, update `memory_index.delete_after`, write history/audit as `retention_sweep:extend`, and exclude from `deletedIds`.
- For `protect`, clear or set distant `delete_after` according to governance policy, write audit as `retention_sweep:protect`, and exclude from deletion.
- Keep delete ledger entries only for rows actually deleted; add separate mutation ledger entries for extensions/protections.

Edge decay integration:

- Add `getEdgeTierBasement(edge)` in consolidation or causal edges.
- Join source and target memory rows to `importance_tier`.
- Apply `floor = 0.7` only for manual/authored edges with both endpoints critical/constitutional, or an explicit constitutional-chain evidence marker.
- Do not apply this floor to `created_by='auto'` or RQ-B3 `auto-session` edges.

Evaluation:

- Shadow log every decision for at least one evaluation window.
- Metrics: prevented deletions later cited, extended records never used again, stale retained ratio, constitutional delete-prevention count, and TTL extension distribution.
- Promotion: copy the shadow-scoring pattern of weekly cycles and consecutive improvement before live mutation.

## Questions Answered

- Can feedback-ledger signals drive learned retention/decay? Yes, but only as an ADAPT design with tier and quality guards.
- Should raw `hit_count` control TTL? No. Use strong positive feedback as the input; weak exposure is not evidence of usefulness.
- Should constitutional/critical records have a basement? Yes for delete-after retention, and narrowly for causal-edge strength. Existing scoring already treats these tiers as no-decay, but the retention sweep can still delete expired rows unless it checks tier.
- Should `memory-retention-sweep.ts` consume the ledger directly? It should call a reducer, not embed feedback math inline. The sweep owns action execution; the reducer owns decisions.
- Should RQ-B3 and RQ-B4 share code? Yes for feedback aggregation only. B3 emits new causal edges; B4 changes existing TTL/decay decisions, so reducers should stay separate after aggregation.
- Verdict? ADAPT with tier guard, strong-signal weighting, and shadow evaluation before live TTL mutation.
- LOC estimate? Approximately ~215-385 production LOC plus ~225-385 tests: feedback aggregation (~40-70), retention decision reducer (~45-85), sweep integration/audit (~45-85), edge floor endpoint-tier joins (~50-90), shadow/eval logging (~35-55), plus focused fixtures and regression tests.

## Questions Remaining

- Should `protect` clear `delete_after`, set it far future, or preserve the original value with a governance override marker?
- Should important records receive finite TTL extensions when strong hits exist, or only after a separate quality score threshold passes?
- Should query reformulation be treated as negative feedback for the shown records, or only for records cited before reformulation?
- Should edge strength floors key off both endpoints being high-tier, or should a one-endpoint floor exist for manually authored constitutional dependency edges?

## Next Focus

RQ-B5 - Cross-cutting coco+memory shared infra. Final iteration should also include synthesis-readiness: confirm all RQ-A1..A5 and RQ-B1..B5 have verdicts, check verdict diversity, identify shared reducers/infrastructure candidates, and prepare the packet for final synthesis.
