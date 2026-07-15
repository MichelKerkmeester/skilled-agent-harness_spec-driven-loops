# Iteration 008 - RQ-B3 Session-trace bounded causal-edge inference

## Focus

RQ-B3 asks whether causal edges can be auto-inferred from session traces, e.g. a session that first sees record A in search results and later cites record B can emit a weak `ENABLED(A -> B)` edge, while staying inside existing NFR-R01 bounds.

Verdict: ADAPT. The design fits the existing causal graph better than a new graph subsystem would, but it should be an explicit deferred reducer, not a live per-event side effect. It also needs two guard fixes: `created_by='auto-session'` is not currently treated as an auto edge by the caps, and the existing `insertEdge` upsert can overwrite manual edge provenance unless the reducer checks first.

## Actions Taken

- Read `causal-edges.ts` for relation types, strength constants, edge caps, `insertEdge`, batch insert, `createSpecDocumentChain`, weight history, stale-edge lookup, and exports.
- Read `causal-boost.ts` for how causal edges affect retrieval. Boost uses top seed results, graph walk, sparse-first 1-hop mode when graph density is low, intent-aware relation priorities, injected neighbor rows, and a combined boost cap.
- Read `feedback-ledger.ts`, `memory-search.ts`, and `query-flow-tracker.ts` for event source shape. The ledger records `search_shown`, `result_cited`, `query_reformulated`, `same_topic_requery`, and `follow_on_tool_use` events with `memory_id`, `query_id`, `timestamp`, and `session_id`.
- Read XCE README sections for transferability. XCE claims traceability and impact analysis over a knowledge graph, but it does not describe session-trace learning; its relevance here is directional, not a direct precedent.
- Read prior Pt-03 continuity through iteration 007 and the strategy/config/state files.

## Findings

### F-iter008-001 - The edge vocabulary already has the right weak relation, but the proposed `created_by` value would bypass auto caps

Verdict: ADAPT_WITH_AUTO_PROVENANCE_FIX. LOC estimate: ~20-35 production LOC plus ~25-45 tests.

Evidence: `RELATION_TYPES` already includes `ENABLED`, and relation weights explicitly treat `enabled` as a weak causal link (`causal-edges.ts:18-39`). NFR-R01 constants exist: `MAX_EDGES_PER_NODE = 20`, `MAX_AUTO_STRENGTH = 0.5`, `MAX_STRENGTH_INCREASE_PER_CYCLE = 0.05`, and `CAP_PER_WINDOW = 100` by default (`causal-edges.ts:45-53`). But `insertEdge` only applies the auto strength cap and edge-count check when `createdBy === 'auto'` (`causal-edges.ts:269-288`). The same exact string check appears in Hebbian strengthening, where only `created_by === 'auto'` stays capped at `MAX_AUTO_STRENGTH` (`consolidation.ts:352-359`).

Implication: do not ship the reducer with `created_by='auto-session'` unless the auto predicate changes first, e.g. `isAutoEdgeCreator(createdBy) => createdBy === 'auto' || createdBy.startsWith('auto-')`. Otherwise a nominally auto-session edge can exceed the 0.5 cap through insert/upsert or later strengthening. If the system wants no storage/schema change, use `createdBy='auto'` and put `source=session-trace` in `evidence`, but that loses source-specific filtering.

### F-iter008-002 - Existing auto-inference precedent exists, but it is not actually tagged as auto

Verdict: ADAPT_WITH_PRECEDENT_CAVEAT. LOC estimate: included in reducer design.

Evidence: `createSpecDocumentChain` programmatically creates the spec -> plan -> tasks -> implementation-summary `CAUSED` chain and several `SUPPORTS` edges (`causal-edges.ts:853-896`). Those edges are inserted through `insertEdgesBatch` (`causal-edges.ts:896`), and `insertEdgesBatch` defaults missing `createdBy` to `manual` (`causal-edges.ts:405-432`). The chain uses high strengths, e.g. 0.8-0.9 for `CAUSED`, 0.7-0.8 for `SUPPORTS` (`causal-edges.ts:872-891`).

Implication: this is a precedent for code-created edges, not for NFR-R01 auto-bounded edges. Session-trace inference should be more conservative than the spec-document chain: `enabled`, `strength=0.3`, auto provenance, no manual overwrite, and caps enforced through the same `insertEdge` path.

### F-iter008-003 - The feedback ledger already has enough signal fields for a reducer

Verdict: ADOPT_SIGNAL_SOURCE. LOC estimate: ~55-90 production LOC for query/session grouping and candidate extraction.

Evidence: The feedback ledger stores event type, memory ID, query ID, confidence, timestamp, and session ID (`feedback-ledger.ts:35-68`, `feedback-ledger.ts:115-127`). It indexes type, memory ID, query ID, confidence, timestamp, and session ID (`feedback-ledger.ts:130-137`). `getFeedbackEvents` already supports filtering by type, memory ID, query ID, confidence, session ID, and time range, and returns rows ordered by timestamp ascending (`feedback-ledger.ts:231-279`). `memory-search` logs `search_shown` rows for returned result IDs, with query ID and session ID (`memory-search.ts:1529-1556`), and logs `result_cited` when `includeContent` loads result content (`memory-search.ts:1595-1598`; `query-flow-tracker.ts:201-224`).

Implication: no new event table is needed for the first version. The reducer can read `feedback_events` by `session_id` and time window, then infer edges only when a cited memory appears after earlier shown memories in the same session, ideally same `query_id` first and cross-query session sequence second.

### F-iter008-004 - Live inference would violate the ledger's current shadow-only contract and create immediate ranking side effects

Verdict: ADAPT_DEFERRED_REDUCER. LOC estimate: ~35-60 production LOC for scheduling/integration plus ~25-50 tests.

Evidence: `feedback-ledger.ts` states feedback events are shadow-only and have no ranking side effects (`feedback-ledger.ts:4-6`, `feedback-ledger.ts:161-169`). `memory-search` repeats that feedback logging is shadow-only and fail-safe (`memory-search.ts:1529-1530`, `memory-search.ts:1561-1562`). Causal edges do affect retrieval: causal boost walks edges from top seed IDs (`causal-boost.ts:417-502`), applies sparse-first traversal and intent-aware scoring (`causal-boost.ts:518-614`), boosts existing results, and injects graph-discovered neighbor rows (`causal-boost.ts:620-673`).

Implication: per-event live insertion would turn a passive search/citation telemetry write into a ranking mutation. Fire the session-trace reducer at a deferred boundary: session close, stale session cleanup, explicit consolidation cycle, or an opt-in maintenance command. Start under a flag such as `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE=false`, then graduate only after shadow audit shows low noise.

### F-iter008-005 - Existing upsert behavior is useful for de-duplication but unsafe for "no manual override"

Verdict: ADAPT_WITH_MANUAL_EDGE_GUARD. LOC estimate: ~25-45 production LOC plus ~40-70 tests.

Evidence: `insertEdge` detects an existing edge by source, target, relation, and anchors (`causal-edges.ts:313-324`). On conflict it updates `strength`, `evidence`, and `created_by` (`causal-edges.ts:326-338`) and logs weight history if strength changed (`causal-edges.ts:382-385`). The schema uniqueness constraint is exactly the same tuple: source, target, relation, source anchor, target anchor (`vector-index-schema.ts:610-621`).

Implication: naive reducer calls can overwrite manual provenance on an existing manual `enabled` edge. The reducer should query the existing edge first and skip if `created_by` is not auto/session-derived. For auto-session duplicates, either keep strength stable at 0.3 or bump by a small banded amount, e.g. `min(0.5, old + 0.05)`, with a per-session/per-pair idempotency guard so the same session does not re-emit forever.

### F-iter008-006 - Retrieval pollution risk is real but bounded if the reducer stays sparse, weak, and typed

Verdict: ADAPT_WITH_BOOST_GUARDS. LOC estimate: ~35-60 production LOC plus ~50-80 tests.

Evidence: Causal boost is intentionally subtle: per-hop boost cap is 0.05 and combined causal + session boost cap is 0.20 (`causal-boost.ts:21-30`). Sparse mode constrains traversal to one hop when graph density is below 0.5 (`causal-boost.ts:35-44`, `causal-boost.ts:538-561`). Intent priorities already place `enabled` high for `add_feature` and mid-to-low elsewhere (`causal-boost.ts:59-71`). But inserted edges can inject neighbor rows into results, not merely nudge already-returned rows (`causal-boost.ts:647-673`).

Implication: the reducer should emit very few edges: source only from shown IDs that preceded a cited target, skip self-loops, cap per cited target per session, cap per source node, and prefer top-K shown IDs from the query result if rank is available later. Without rank in `feedback_events`, the first version should use at most a small fixed number of earlier shown IDs per citation, e.g. 3-5, to avoid every displayed result becoming an enabler.

## Proposed Design

Add `lib/feedback/session-trace-causal-reducer.ts`.

Reducer input:

- `db`
- `sessionId` or `{ since, until }`
- `maxSourcesPerCitation = 3`
- `baseStrength = 0.3`
- `maxStrength = 0.5`
- `createdBy = 'auto-session'` only after auto predicate is fixed

Reducer algorithm:

1. Read `feedback_events` ordered by timestamp for the session/window.
2. Build an ordered set of shown memory IDs per query and a rolling session-shown set.
3. For each `result_cited(B)`, select earlier shown IDs A where `A !== B`; prefer same-query shown IDs, then recent prior session-shown IDs.
4. Emit `ENABLED(A -> B)` with evidence like `Session trace: search_shown before result_cited; session=<id>; query=<id>`.
5. Before insert, check existing edge. If manual/non-auto exists, skip. If auto-session exists, bump by at most 0.05 or keep stable.
6. Call `insertEdge(A, B, RELATION_TYPES.ENABLED, nextStrength, evidence, false, createdBy)`.
7. Invalidate once after batch insert, or use `insertEdgesBatch` if it learns the same manual-guard semantics.

Scheduling:

- First choice: deferred consolidation/session cleanup path, not live `logFeedbackEvent`.
- Optional explicit tool/maintenance command for tests and backfills.
- Feature flag default-off until shadow metrics compare inferred edges against citations/follow-on tool use.

Tests:

- Reducer emits weak `enabled` edge from prior `search_shown(A)` to later `result_cited(B)`.
- Self-loops are skipped.
- Manual `enabled(A,B)` edge is not overwritten.
- Auto-session duplicate is idempotent or strength-bumped only once per session/pair and clamped to 0.5.
- Edge count cap rejects nodes at 20.
- Relation window cap rejects >100 `enabled` inserts per window.
- `created_by='auto-session'` is capped after the auto predicate fix.
- Stale auto-session edges decay through the existing Hebbian cycle.
- Causal boost metadata remains bounded; injected neighbors from reducer fixtures do not exceed combined boost caps.

## Questions Answered

- Can causal edges be auto-inferred from session traces? Yes, with an explicit bounded reducer.
- Should the edge be `ENABLED(A -> B)` at strength 0.3? Yes. That matches the weak relation semantics and keeps the boost layer from treating trace inference like authored causal evidence.
- Should it fire live? No. Live insertion breaks the current shadow-only feedback contract and immediately affects ranking.
- Can existing NFR-R01 caps be reused? Mostly, but the code must broaden auto provenance handling or use `createdBy='auto'`. `auto-session` is not capped today.
- How should duplicates work? Skip manual edges; for session-derived edges, make the reducer idempotent per session/pair and optionally bump by 0.05, clamped to 0.5.
- Does decay already apply? Yes. Existing consolidation decays edges not accessed in 30 days by 0.1 and logs via `weight_history`.
- Dependency on RQ-B4? Weak. RQ-B3 can ship independently as causal edge inference; RQ-B4 can later reuse the same ledger aggregation patterns for retention/decay.
- LOC estimate? Approximately ~170-265 production LOC plus ~165-275 tests: auto provenance helper (~20-35), reducer core (~55-90), manual guard/de-dup (~25-45), deferred scheduling/flag/metrics (~35-60), boost/cap integration polish (~35-60). Documentation/fixtures may add ~30-50.
- Verdict? ADAPT bounded session-trace inference, deferred and default-off.

## Questions Remaining

- Should session-derived edges store source metadata only in `evidence`, or should `created_by` support an auto subtype such as `auto-session`?
- Is `includeContent` a strong enough proxy for `result_cited`, or should true citation/tool-use events be logged separately?
- Should feedback events capture result rank so the reducer can choose the top shown IDs instead of arbitrary shown IDs from the response order?
- Should reducer output be previewable in shadow mode before writing `causal_edges`?

## Next Focus

RQ-B4 - Feedback-ledger-driven learned retention/decay. Investigate whether the same `feedback_events` signal family can safely tune memory retention and decay without violating constitutional-tier basements or introducing online re-embedding.
