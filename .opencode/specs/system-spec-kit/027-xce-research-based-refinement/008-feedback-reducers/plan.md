---
title: "Plan — Phase 008 Shared Feedback Reducers"
description: "Technical plan: 5 sub-phases. Sub-Phase 1 = 3 P0 fixes (preconditions). Sub-Phase 2 = shared aggregation. Sub-Phases 3/4/5 = 3 independent consumers (coco rerank, session-trace causal, learned retention)."
trigger_phrases:
  - "027 phase 008 plan"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-feedback-reducers"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan.md with 5 sub-phases including 3 P0 precondition fixes"
    next_safe_action: "Begin Sub-Phase 1 P0 fixes"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.0 -->
# Plan: Shared Feedback Reducers (3 P0 Fixes + Aggregation + 3 Consumers)

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Implement pt-03 RQ-A3 + RQ-B3 + RQ-B4 as one packet with shared aggregation + three independent consumers, plus 3 P0 precondition fixes. Five sub-phases; Sub-Phase 1 MUST land before Sub-Phases 4/5 (which depend on the auto-provenance + manual-guard + tier-basement fixes). ~400-650 production LOC + ~480-810 tests.

---

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

- Strict spec validation passes (`bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0).
- All P0 checklist items green.
- All ADR commitments upheld with file:line evidence in `implementation-summary.md`.
- Phase-005 eval gate documented (when applicable for active-mode promotion).
<!-- /ANCHOR:quality-gates -->

---


<!-- ANCHOR:technical-context -->
## TECHNICAL CONTEXT

### Current state (verified file:line)
- `mcp_server/lib/storage/causal-edges.ts:18-39` — 6 RELATION_TYPES; relation weights (`enabled` weak).
- `mcp_server/lib/storage/causal-edges.ts:45-53` — NFR-R01 caps: `MAX_EDGES_PER_NODE=20`, `MAX_AUTO_STRENGTH=0.5`, `MAX_STRENGTH_INCREASE_PER_CYCLE=0.05`, `CAP_PER_WINDOW=100`.
- `mcp_server/lib/storage/causal-edges.ts:269-288` — `insertEdge` cap enforcement; ONLY checks `createdBy === 'auto'` (P0-1 bug surface).
- `mcp_server/lib/storage/causal-edges.ts:313-338` — `insertEdge` upsert; overwrites `created_by` on conflict (P0-2 bug surface).
- `mcp_server/lib/storage/causal-edges.ts:853-896` — `createSpecDocumentChain` precedent (manual-default `createdBy`).
- `mcp_server/lib/storage/consolidation.ts:330-379` — Hebbian decay cycle.
- `mcp_server/lib/storage/consolidation.ts:352-359` — Hebbian creation gating; same `createdBy === 'auto'` check (P0-1 bug surface).
- `mcp_server/lib/feedback/feedback-ledger.ts:35-137` — Event schema, confidence hierarchy, indexes.
- `mcp_server/lib/feedback/feedback-ledger.ts:231-279` — `getFeedbackEvents` filter API (memory_id, query_id, confidence, session_id, time-range, ordered ASC).
- `mcp_server/lib/feedback/feedback-ledger.ts:305-338` — `getMemoryFeedbackSummary` aggregation by confidence.
- `mcp_server/lib/feedback/shadow-scoring.ts:1-15` — Promotion-gate weekly-cycle pattern.
- `mcp_server/lib/feedback/batch-learning.ts:34-48` — `MAX_BOOST_DELTA = 0.10` precedent.
- `mcp_server/lib/governance/memory-retention-sweep.ts:17-28` — `RetentionExpiredRow` type (P0-3 schema gap).
- `mcp_server/lib/governance/memory-retention-sweep.ts:52-68` — `selectExpiredRows` query (P0-3 fix target).
- `mcp_server/lib/governance/memory-retention-sweep.ts:152-195` — Deletion path: `vectorIndex.deleteMemory` + history + governance audit + mutation ledger.
- `mcp_server/lib/cognitive/tier-classifier.ts:185-303` — Constitutional/critical = null half-life.
- `mcp_server/lib/cognitive/importance-tiers.ts:32-119` — Tier `decay: false` policy.
- `mcp_server/lib/cognitive/fsrs-scheduler.ts:286-304` — Constitutional/critical = Infinity stability.
- `mcp_server/lib/storage/vector-index-schema.ts:2375-2393` — `decay_half_life_days`, `is_pinned`, `access_count`, etc. columns.
- `mcp_server/code_graph/handlers/ccc-feedback.ts:11-60` — CCC feedback writer (write-only telemetry).
- `mcp_server/code_graph/feature_catalog/07--ccc-integration/02-ccc-feedback.md:22-32` — Catalog entry: "does not alter ranking immediately".
- `mcp_server/handlers/memory-search.ts:1529-1598` — Feedback logging (search_shown, result_cited).
- `mcp_server/lib/feedback/query-flow-tracker.ts:201-224` — Query flow tracker (result_cited via includeContent).

### XCE source
- `external/README.md:240-245` — Public mention of "graph store" + impact analysis (general direction; no implementation transfer).

### Adjacent precedents
- Spec-document chain (`createSpecDocumentChain`) is the existing auto-edge precedent BUT defaults to `createdBy='manual'` so it's not a clean NFR-R01 example.
- `shadow-scoring.ts` weekly cycle is the promotion-gate template.
- `batch-learning.ts` `MAX_BOOST_DELTA=0.10` is the precedent for clamped rerank deltas (REQ-010 reuse).
<!-- /ANCHOR:technical-context -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

```
                          ┌──────────────────────┐
                          │   feedback_events    │
                          │  (existing, ledger)  │
                          │   shadow-only writes │
                          └──────────────────────┘
                                     │
                                     ▼
              ┌──────────────────────────────────────────┐
              │  Sub-Phase 2: feedback-aggregation.ts    │
              │  reads {since, until} window             │
              │  → strong/medium/weak counts             │
              │  → sessions, queries, weighted positives │
              │  → idempotent for identical inputs       │
              └──────────────────────────────────────────┘
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        ▼                            ▼                            ▼
┌────────────────────┐  ┌────────────────────┐  ┌────────────────────────┐
│ Sub-Phase 3:       │  │ Sub-Phase 4:       │  │ Sub-Phase 5:           │
│ Consumer A         │  │ Consumer B         │  │ Consumer C             │
│ (Python)           │  │ (TypeScript)       │  │ (TypeScript)           │
│                    │  │                    │  │                        │
│ feedback_reducer.py│  │ session-trace-     │  │ feedback-retention-    │
│  → SQLite reweight │  │ causal-reducer.ts  │  │ reducer.ts             │
│  → ±0.10 clamped   │  │  → ENABLED edges   │  │  → RetentionDecision   │
│    delta in        │  │    at strength 0.3 │  │    {delete|extend|     │
│    _ranked_result()│  │  → DEFERRED ONLY   │  │     protect}           │
│                    │  │  → manual-guard    │  │  → tier basement       │
│ FLAG: COCOINDEX_   │  │  → auto-provenance │  │  → narrow edge floor   │
│ FEEDBACK_RERANK    │  │    cap (P0-1)      │  │  → dryRun shadow path  │
│                    │  │  → manual overwrite│  │                        │
│                    │  │    guard (P0-2)    │  │ FLAG: FEEDBACK_        │
│                    │  │                    │  │   RETENTION_LEARNING   │
│                    │  │ FLAG: SESSION_     │  │   _MODE=shadow|active  │
│                    │  │ TRACE_CAUSAL_      │  │  → tier extend (P0-3)  │
│                    │  │ INFERENCE          │  │                        │
└────────────────────┘  └────────────────────┘  └────────────────────────┘
```

Sub-Phase 1 (3 P0 fixes) lands FIRST — Sub-Phases 4 and 5 fail-closed without them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Sub-Phase 1 — 3 P0 Precondition Fixes (~50-80 prod + 60-100 tests)

**Files (modified):**
- `mcp_server/lib/storage/causal-edges.ts` — broaden auto predicate (P0-1) + manual-edge overwrite guard (P0-2).
- `mcp_server/lib/storage/consolidation.ts` — broaden auto predicate (P0-1).
- `mcp_server/lib/governance/memory-retention-sweep.ts` — extend `RetentionExpiredRow` schema + `selectExpiredRows` query (P0-3).

**Files (created):**
- `mcp_server/__tests__/storage/causal-edges-auto-provenance.vitest.ts` — P0-1 verification.
- `mcp_server/__tests__/storage/insert-edge-manual-guard.vitest.ts` — P0-2 verification.
- `mcp_server/__tests__/governance/retention-sweep-tier.vitest.ts` — P0-3 verification.

**Approach:**
- P0-1: introduce `isAutoEdgeCreator(createdBy: string): boolean` helper; replace exact-match checks with helper. Keep `'auto'` working; add prefix match for `'auto-*'` family.
- P0-2: in `insertEdge` upsert path, query existing edge by `(source, target, relation, source_anchor, target_anchor)`; if exists AND `created_by` does not match `isAutoEdgeCreator(...)`, return early with `{updated: false, reason: 'manual-edge-protected'}`.
- P0-3: extend `RetentionExpiredRow` interface with new fields; rewrite `selectExpiredRows` SQL to JOIN/include extra columns.

**Acceptance:**
- All three test files green.
- No regression in existing causal-edges tests / consolidation tests / retention-sweep tests.

### Sub-Phase 2 — Shared Aggregation (~40-70 prod + 35-60 tests)

**Files (created):**
- `mcp_server/lib/feedback/feedback-aggregation.ts` — Reducer.
- `mcp_server/__tests__/feedback/aggregation.vitest.ts` — Tests.

**Approach:**
- Pure function: `aggregateFeedback(db, {since, until}): Map<memory_id, FeedbackSummary>`.
- `FeedbackSummary` shape: `{strong, medium, weak, sessions: Set<sessionId>, queries: Set<queryId>, firstSeen, lastSeen, weightedHitCount}`.
- Strong = `result_cited + follow_on_tool_use`.
- Medium = `query_reformulated`.
- Weak = `search_shown + same_topic_requery`.
- `weightedHitCount = max(0, strong + 0.25 * same_topic_requery - 0.5 * query_reformulated)`.
- Idempotent: same `{since, until}` always produces identical output.

**Acceptance:**
- Formula edge cases tested (all-positive, all-negative, mixed, zero, large windows).
- Run-twice idempotency test green.

### Sub-Phase 3 — Consumer A: Coco Rerank Weights (~250-370 prod + 90-150 tests)

**Files (created):**
- `mcp-coco-index/mcp_server/cocoindex_code/feedback_reducer.py` — Python reducer.
- `mcp-coco-index/mcp_server/cocoindex_code/feedback_rerank_table.py` — SQLite schema + lookup helper.
- `mcp-coco-index/tests/test_feedback_reducer.py` — Tests.

**Files (modified):**
- `mcp-coco-index/mcp_server/cocoindex_code/query.py` — Apply clamped delta in `_ranked_result()` at line 177-223.

**Approach:**
- Reducer reads `.opencode/skills/mcp-coco-index/feedback/search-feedback.jsonl` line-by-line; parses JSON; aggregates by `(intent_tag, path_class)`.
- `path_class` derived from `resultFile` via `classify_path()` reuse from `indexer.py:53-91`.
- `intent_tag` derived from RQ-A1 classifier (Phase 006 dependency for intent-tagged learning); path-class-only MVP uses `intent_tag='general'` if Phase 006 not shipped.
- SQLite table `feedback_rerank_weights` updated atomically per reducer run.
- Min support: 5 rated events OR 3 distinct queries.
- `delta = clamp(weighted_signal / sample_count * 0.10, -0.10, +0.10)`.
- Apply: `_ranked_result()` reads delta from cached lookup; adds to score; emits signal `feedback_rerank_delta:+0.04:path_class=implementation:intent=general`.

**Acceptance:**
- Cold start (no JSONL file) → `delta=0`; no behavior change.
- Below-min-support buckets → `delta=0`.
- Above-min-support buckets → clamped delta applied.
- Rerank signal present in output.

### Sub-Phase 4 — Consumer B: Session-Trace Causal Edges (~170-265 prod + 165-275 tests)

**Files (created):**
- `mcp_server/lib/feedback/session-trace-causal-reducer.ts` — Reducer.
- `mcp_server/__tests__/feedback/session-trace-causal.vitest.ts` — Tests.

**Approach:**
- Reducer signature: `runSessionTraceCausalReducer(db, {sessionId | since, until, maxSourcesPerCitation=5, baseStrength=0.3, dryRun=false})`.
- Reads `feedback_events` ordered by `(session_id, timestamp)` ASC.
- Builds rolling shown-set per session.
- For each `result_cited(B)` in session:
  - Eligible sources: prior `search_shown(A)` IDs in same session where `A !== B`.
  - Prefer same-`query_id` sources first (within last 5).
  - Fall back to recent prior session-shown (within last 5 by timestamp).
  - Cap at `maxSourcesPerCitation=5`.
- For each (A, B) pair:
  - Manual-edge guard (P0-2): query existing; skip if non-auto exists.
  - Idempotency: query existing auto-session edge; if exists, optionally bump strength by 0.05 clamped to 0.5.
  - `insertEdge(A, B, RELATION_TYPES.ENABLED, baseStrength, evidence, false, 'auto-session')`.
  - `evidence` string: `"Session trace: search_shown before result_cited; session=<id>; query=<id>"`.

**Deferred invocation only:**
- Hooks: `consolidation.ts` end-of-cycle path; explicit MCP tool `runSessionTraceReducer`.
- NEVER called from `logFeedbackEvent` or `memory_search` hot paths.

**Acceptance:**
- Idempotent per `(session_id, A, B)` across re-runs.
- Caps enforced (max 5 sources, MAX_EDGES_PER_NODE=20, CAP_PER_WINDOW=100).
- P0-1 + P0-2 dependencies verified (auto-session strength capped at 0.5; manual edges not overwritten).
- Strength stable at 0.3 for first run; bumped ≤0.05 on subsequent runs.

### Sub-Phase 5 — Consumer C: Learned Retention/Decay (~215-385 prod + 225-385 tests)

**Files (created):**
- `mcp_server/lib/feedback/feedback-retention-reducer.ts` — Reducer.
- `mcp_server/lib/feedback/edge-tier-basement.ts` — Edge floor helper.
- `mcp_server/__tests__/feedback/retention-reducer.vitest.ts` — Reducer tests.
- `mcp_server/__tests__/feedback/edge-floor-narrow.vitest.ts` — Floor scope tests.

**Files (modified):**
- `mcp_server/lib/governance/memory-retention-sweep.ts` — Sweep integration; consumes reducer decisions.

**Approach:**
- Reducer signature: `decideRetention(db, {since, until, dryRun=false}): RetentionDecision[]`.
- Per expired candidate (from `selectExpiredRows` post-P0-3):
  - `tier === 'constitutional' || tier === 'critical'` → `protect`
  - `is_pinned === 1` → `protect`
  - `tier === 'important' && weightedHitCount > 0` → `extend` by `baseTtl × min(2, 1 + log10(weightedHitCount))`
  - `tier === 'normal' || tier === 'temporary'` → no positive boost in v1; `delete` if expired
  - `query_reformulated` dominates → reduce or block extension
- Edge floor helper (separate module):
  - `getEdgeTierBasement(edge, db): {hasFloor: boolean, floor: number}`
  - Joins source + target memory tier
  - Floor `0.7` ONLY when:
    - `created_by === 'manual'` (or any non-auto), AND
    - BOTH endpoint tiers ∈ {constitutional, critical}, OR
    - explicit `evidence` marker like `"constitutional-chain:..."`
  - Otherwise `floor=0` (no protection from existing decay).

**Sweep integration:**
- `memory-retention-sweep.ts` calls `decideRetention(db)` before deletion phase.
- For each `RetentionDecision`:
  - `delete` → existing `vectorIndex.deleteMemory(id)` path.
  - `extend` → `UPDATE memory_index SET delete_after = ?` + audit `retention_sweep:extend`.
  - `protect` → `UPDATE memory_index SET delete_after = NULL OR <far-future>` + audit `retention_sweep:protect`.

**Promotion gate (live mutation):**
- Copy `shadow-scoring.ts:1-15` weekly-cycle pattern.
- Active mode requires shadow eval window with metrics: prevented-then-cited deletes; extended-then-unused records; stale retained ratio; constitutional delete-prevention count.

**Acceptance:**
- All 5 decision rules tested.
- Edge floor narrow scope verified (auto-derived edges NOT floored; one-end-only constitutional NOT floored; both-endpoints constitutional manual edges floored).
- `dryRun=true` returns decisions without writes.
- Sweep integration writes audit ledger entries for each action.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## TESTING STRATEGY

- Unit tests per sub-phase (vitest TypeScript / pytest Python).
- Integration tests for cross-component code paths.
- Diff tests for backward-compat (flag-off output bit-identical to current).
- Phase-005 paired comparison harness for active-mode promotion gating.
- Per-checklist verification commands for repeatable green-field checks.
<!-- /ANCHOR:testing -->

---


---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

### Hard preconditions (within phase)
- Sub-Phase 1 (3 P0 fixes) → Sub-Phase 4 (Consumer B requires P0-1 + P0-2).
- Sub-Phase 1 (3 P0 fixes) → Sub-Phase 5 (Consumer C requires P0-3).
- Sub-Phase 2 (aggregation) → Sub-Phase 5 (consumes shared aggregation).

### Hard preconditions (external)
None.

### Soft preconditions (external)
- **Phase 005** (adoption eval harness) — for promotion gate measurements (live mutation in C).
- **Phase 006** (coco intent steering) — for `intent_tag` dimension in Consumer A; path-class-only MVP works without 006.

### Internal sub-phase order
- Sub-Phase 1 BEFORE 4, 5.
- Sub-Phase 2 BEFORE 3, 5 (3 also reads JSONL directly so could run with 2-aggregation as helper only).
- Sub-Phase 3 independent of 4, 5 (Python-side, separate process).
- Sub-Phases 4, 5 can run in parallel after their preconditions.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:risk-matrix -->
## RISK MATRIX

| ID | Risk | Severity | Likelihood | Mitigation | Verification |
|----|------|----------|------------|------------|--------------|
| R-008-01 | Auto-provenance bypass — RQ-B3 ships without P0-1 | **P0** | High if not gated | Sub-Phase 1 mandatory | Test: auto-session caps at 0.5 |
| R-008-02 | Manual edge overwrite — RQ-B3 reducer wipes manual edges | **P0** | High if not gated | Sub-Phase 1 manual-guard (P0-2) | Test: pre-existing manual NOT overwritten |
| R-008-03 | Constitutional record deletion via TTL expiry | **P0** | High in production | Sub-Phase 1 P0-3 + Consumer C basement | Test: constitutional `protect` action |
| R-008-04 | Feedback-driven retention rewards exposure | P1 | Med | Weighted-positives (REQ-005, REQ-024) | Formula tests cover exposure-only memories |
| R-008-05 | Edge floor protects noisy auto-derived edges | P1 | Med | Narrow floor scope (REQ-025, ADR-007) | Floor scope tests |
| R-008-06 | Live reducer turns telemetry into ranking mutation | P1 | Low (DEFERRED only) | REQ-018 + ADR-004; no live invocation paths | Code review + grep for `logFeedbackEvent` callers |
| R-008-07 | Cross-system coordination (Python + TS) | P2 | Low | Independent decision-makers; only Sub-Phase 2 shared | Integration test runs both sides |
| R-008-08 | Reducer cron + manual maintenance race | P2 | Low | All reducers idempotent | Concurrency stress test |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:success-metrics -->
## SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| P0-1 / P0-2 / P0-3 fix tests pass | 100% | Sub-Phase 1 dedicated tests |
| Aggregation reducer idempotency | 100% | Run-twice test |
| Consumer A delta clamped at ±0.10 | 100% | Boundary tests |
| Consumer B caps enforced | 100% | Cap tests |
| Consumer C `protect` for constitutional | 100% | Tier basement test |
| Edge floor narrow scope | 100% | Floor scope test (auto, one-endpoint-high-tier, both-endpoint-high-tier) |
| Phase 005 retention quality (live mutation gate) | prevented-then-cited deletes ≤ 0.05 | Phase-005 paired comparison |
| Phase 005 retention quality (shadow vs live) | extended-then-unused ratio < 0.20 | Phase-005 retention metrics |
<!-- /ANCHOR:success-metrics -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

If Consumer A produces precision regressions:
- Set `SPECKIT_COCOINDEX_FEEDBACK_RERANK=0` → reverts to today's behavior.

If Consumer B produces causal-edge noise:
- Set `SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE=false` → no new edges.
- Existing auto-session edges remain (subject to Hebbian decay).
- Optional: explicit maintenance command `causal-edges:cleanup --created-by=auto-session` to remove if needed.

If Consumer C produces wrong retention decisions:
- Set `SPECKIT_FEEDBACK_RETENTION_LEARNING=false` → reverts to rule-based sweep.
- `extend` decisions already applied are NOT auto-reverted (they updated `delete_after`); manual sweep can re-tighten.

P0 fixes are NOT rollback candidates — they're correctness fixes for existing bugs.
<!-- /ANCHOR:rollback -->

---

<!-- L3 STRUCTURAL APPENDIX -->



<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

See "DEPENDENCIES" section above (hard preconditions, soft preconditions, internal sub-phase order, downstream consumers).
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

LOC budget in `spec.md` Section 1 Metadata. Per-sub-phase LOC estimates in "SUB-PHASES" section above. Wall-time estimates in `tasks.md` "TOTAL EFFORT" section.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

See "ROLLBACK PLAN" section above. All flags reversible per-phase; no schema rollback needed for forward-only migrations. Each consumer / sub-phase has its own flag for fine-grained rollback.
<!-- /ANCHOR:enhanced-rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

See sub-phase task dependency diagrams in `tasks.md` "TASK DEPENDENCIES" section.
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

See sub-phase ordering in `tasks.md` task dependency diagrams. Hard-blocking dependencies (e.g. Sub-Phase 1 → Sub-Phase 4 in Phase 008) are explicit in the dep diagram.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

- **M1**: Sub-Phase 1 complete (foundational schema/precondition/extraction).
- **M2..MN**: Each subsequent sub-phase complete per `tasks.md` group.
- **MFinal**: All checklist items green; implementation-summary filled; Phase-005 eval gate ready (when applicable).
<!-- /ANCHOR:milestones -->
