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
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/007-learning-feedback-reducers/001-aggregator"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Implement tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 0
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
| **Status** | Spec-Scaffolded |
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement/007-learning-feedback-reducers` |
| **Depends On** | `system-spec-kit/027-xce-research-based-refinement/001-memory-write-safety` |
| **Estimated LOC** | ~70 production LOC |
| **Language** | TypeScript |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The three learning reducers need a shared interpretation of `feedback_events`. Without a common aggregation layer, each consumer can drift on confidence mapping, weighted-positive math, and window semantics.

This child creates the foundation reducer in `mcp_server/lib/feedback/feedback-aggregation.ts`. It reads a bounded `{ since, until }` feedback window and returns deterministic per-memory summaries for downstream consumers.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `mcp_server/lib/feedback/feedback-aggregation.ts`.
- Aggregate by `memory_id`.
- Track strong, medium, weak counts plus sessions, queries, firstSeen, lastSeen, and `weightedHitCount`.
- Implement `weightedHitCount = max(0, strong + 0.25 * same_topic_requery - 0.5 * query_reformulated)`.
- Add focused tests for formula behavior and run-twice idempotency.

### Out of Scope
- Python coco rerank persistence.
- Causal-edge creation.
- Retention mutation or sweep integration.
- ENV_REFERENCE flag documentation.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add `feedback-aggregation.ts` reducer reading `feedback_events` by `{ since, until }`. | API is stable and filters by window. |
| REQ-002 | Aggregate by `memory_id` with strong/medium/weak counts, sessions, queries, and first/last timestamps. | Unit tests cover each field. |
| REQ-003 | Implement weighted-positive formula with zero floor. | Tests cover positive-only, negative-only, mixed, and zero-event cases. |
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
- Consumer children: `../002-coco-rerank-consumer/`, `../003-causal-reducer/`, `../004-retention-reducer/`
<!-- /ANCHOR:related-docs -->
