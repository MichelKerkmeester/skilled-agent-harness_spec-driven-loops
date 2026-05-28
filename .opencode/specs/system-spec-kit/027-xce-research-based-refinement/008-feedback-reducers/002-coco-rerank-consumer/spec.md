---
title: "002 Coco Rerank Consumer"
description: "Level 2 child packet for the Python coco feedback reducer and SQLite rerank weights table."
trigger_phrases:
  - "009 coco rerank consumer"
  - "002 coco rerank"
  - "feedback_reducer.py"
  - "feedback_rerank_weights"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-feedback-reducers/002-coco-rerank-consumer"
    last_updated_at: "2026-05-12T07:20:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffolded Level 2 child packet"
    next_safe_action: "Implement tasks.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md"]
    completion_pct: 0
---
# Feature Specification: Coco Rerank Feedback Consumer

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
| **Parent Packet** | `system-spec-kit/027-xce-research-based-refinement/008-feedback-reducers` |
| **Depends On** | `system-spec-kit/027-xce-research-based-refinement/008-feedback-reducers/001-aggregator` |
| **Estimated LOC** | ~370 production LOC |
| **Language** | Python |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`ccc_feedback` records useful search feedback but does not influence ranking. This child adds a bounded, aggregate-only rerank loop for coco-index results while preserving cold-start behavior and privacy.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `cocoindex_code/feedback_reducer.py`.
- Create the `feedback_rerank_weights` SQLite table and lookup helper.
- Read `.opencode/skills/mcp-coco-index/feedback/search-feedback.jsonl`.
- Aggregate by `(intent_tag, path_class)` and derive `path_class` via existing classifier behavior.
- Apply clamped `[-0.10, +0.10]` delta in `_ranked_result()`.
- Add default-off flag `SPECKIT_COCOINDEX_FEEDBACK_RERANK=0`.

### Out of Scope
- Raw comment ingestion into learned tables.
- TS session-trace or retention reducers.
- Active rollout without eval gate.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add Python reducer reading coco feedback JSONL line-by-line. | Missing or empty file is a no-op. |
| REQ-002 | Persist aggregate counts in `feedback_rerank_weights`. | Table has no raw comment fields. |
| REQ-003 | Use min support of 5 events or 3 distinct queries. | Below threshold returns delta 0. |
| REQ-004 | Clamp delta to `[-0.10, +0.10]`. | Boundary tests pass. |
| REQ-005 | Apply delta only when flag is enabled. | Flag-off output is unchanged. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Strict validation passes.
- Python reducer tests pass.
- Cold start, missing table, below support, and clamped positive/negative cases are covered.
- Learned table contains only aggregate counts and deltas.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `001-aggregator` | Shared formula alignment. | Hard dependency. |
| Soft dependency | `028/006-coco-intent-steering` | Intent tag quality. | Use `intent_tag='general'` fallback if absent. |
| Risk | Ranking precision regression | Bad learned deltas. | Default-off flag and clamped deltas. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Privacy: comments remain only in audit JSONL.
- Cold start must be behavior-preserving.
- Reducer must tolerate rotated or truncated JSONL input.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Missing JSONL file.
- Empty JSONL file.
- Malformed line in JSONL.
- Bucket below minimum support.
- Missing SQLite table before migration.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether `intent_tag` is sourced from 028/006-coco-intent-steering immediately or starts with `general` fallback is implementation-time dependent.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:complexity -->
## COMPLEXITY ASSESSMENT

Level 2 is appropriate: this child is implementation-sized, verification-focused, and bounded to one reducer surface.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `../001-aggregator/spec.md`
- `../005-env-tests-integration/spec.md`
<!-- /ANCHOR:related-docs -->
