---
title: "001 Aggregator — Shared Feedback Aggregation"
description: "Level 2 child packet for the shared TypeScript feedback aggregation reducer used by the feedback reducer consumers."
trigger_phrases:
  - "009 feedback aggregator"
  - "001 aggregator"
  - "feedback-aggregation.ts"
  - "shared feedback aggregation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/001-aggregator"
    last_updated_at: "2026-06-10T11:06:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Extended aggregateEvents with read-only reducer fields"
    next_safe_action: "Proceed to consumer reducers after shadow gates"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 100
---
# Feature Specification: Shared Feedback Aggregation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Implemented |
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers` |
| **Depends On** | `system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/001-memory-write-safety` |
| **Estimated LOC** | ~70 production LOC |
| **Language** | TypeScript |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The three learning reducers need a shared interpretation of `feedback_events`. Without a common aggregation layer, each consumer can drift on confidence mapping, weighted-positive math, and window semantics.

AUDIT 2026-06-05: `batch-learning.ts:195-241` already aggregates `feedback_events`; reuse it. `feedback_events` dependency confirmed present (`feedback-ledger.ts`).

This child provides the shared foundation aggregation by reusing/extending the existing `lib/feedback/batch-learning.ts:195-241` (`aggregateEvents`) rather than creating a duplicate `feedback-aggregation.ts`. The aggregation reads a bounded `{ since, until }` feedback window and returns deterministic per-memory summaries for downstream consumers; only what is missing for those consumers is added on top of the existing reducer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reuse/extend `lib/feedback/batch-learning.ts:195-241` (`aggregateEvents`) aggregation; avoid a duplicate `feedback-aggregation.ts`.
- Aggregate by `memory_id` (already done by `aggregateEvents`).
- Track strong, medium, weak counts plus sessions, queries, firstSeen, lastSeen, and `weightedHitCount`, adding only the fields not already produced by `aggregateEvents`.
- Reconcile the weighted formula `weightedHitCount = max(0, strong + 0.25 * same_topic_requery - 0.5 * query_reformulated)` with the existing `weightedScore`/`computedBoost` in `batch-learning.ts`: align with or extend the existing weighted formula rather than introduce a parallel one. Keep the non-negative floor.
- Add focused tests for formula behavior and run-twice idempotency.

### Out of Scope
- Causal-edge creation.
- Retention mutation or sweep integration.
- ENV_REFERENCE flag documentation.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reuse/extend `batch-learning.ts:195-241` (`aggregateEvents`) reading `feedback_events` by `{ since, until }` instead of creating a duplicate `feedback-aggregation.ts`. | API is stable, filters by window, and no parallel aggregator is added. |
| REQ-002 | Aggregate by `memory_id` with strong/medium/weak counts, sessions, queries, and first/last timestamps, adding only fields not already emitted by `aggregateEvents`. | Unit tests cover each field. |
| REQ-003 | Reconcile the weighted-positive formula with the existing `weightedScore`/`computedBoost` in `batch-learning.ts`, keeping the non-negative floor and not introducing a parallel formula. | Tests cover positive-only, negative-only, mixed, and zero-event cases; output aligns with the existing weighted formula. |
| REQ-004 | Reducer output is deterministic and idempotent for identical inputs. | Run-twice test returns equal output. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Strict validation passes for this child packet.
- Aggregation unit tests pass.
- Consumers can depend on a single typed summary shape.
- No hot-path mutation is introduced.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 002 correctness fixes | Consumers should not start before corrected safety preconditions land. | Hard dependency in metadata. |
| Risk | Formula drift | Consumers learn different meanings for positive feedback. | Keep formula centralized here. |
| Risk | Large feedback windows | Memory pressure during aggregation. | Page reads or bounded query windows in implementation. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Deterministic output for identical inputs.
- No writes; read-only aggregation only.
- Bounded memory behavior for large event windows.
- Typed return shape for consumer reuse.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Empty event window returns an empty summary.
- Events without `memory_id` are skipped or reported according to existing ledger semantics.
- Negative signals cannot drive `weightedHitCount` below zero.
- Duplicate events in the same window produce deterministic counts.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether the reducer should page internally or rely on caller-provided narrow windows is left to implementation, but the public API should remain window-based.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:complexity -->
## COMPLEXITY ASSESSMENT

Level 2 is appropriate: this child is implementation-sized, verification-focused, and bounded to one reducer surface.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- Parent phase map: `../spec.md`
- Preserved legacy context: `legacy-decision-record.md`, `legacy-resource-map.md`
- Consumer children: `../003-causal-reducer/`, `../004-retention-reducer/`
<!-- /ANCHOR:related-docs -->
