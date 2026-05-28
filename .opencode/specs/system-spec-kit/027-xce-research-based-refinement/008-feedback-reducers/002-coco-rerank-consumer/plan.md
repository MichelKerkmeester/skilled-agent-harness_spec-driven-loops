---
title: "Plan — 002 Coco Rerank Consumer"
description: "Implementation plan for the Python coco rerank feedback consumer."
trigger_phrases:
  - "009 coco rerank plan"
importance_tier: "important"
contextType: "plan"
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
# Implementation Plan: Coco Rerank Feedback Consumer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python + SQLite |
| **Target Modules** | `feedback_reducer.py`, rerank table helper, `query.py` |
| **Testing** | Pytest |

Implement a deferred reducer that learns small path-class/intent deltas from aggregate coco feedback.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Strict child validation exits 0.
- Pytest covers cold start, support threshold, clamping, privacy, and flag-off parity.
- No raw comments copied into SQLite learned weights.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

JSONL audit events feed a reducer that writes aggregate rows to SQLite. Query ranking reads a cached delta only when `SPECKIT_COCOINDEX_FEEDBACK_RERANK=1`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Persistence
- Define `feedback_rerank_weights` schema and lookup helper.

### Phase 2: Reducer
- Read JSONL line-by-line.
- Aggregate by `(intent_tag, path_class)`.
- Compute support and clamped delta.

### Phase 3: Ranking Integration
- Apply delta in `_ranked_result()`.
- Emit rerank signal.
- Add flag-off parity tests.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Unit | Formula and support threshold | Pytest |
| Integration | SQLite schema + lookup | Pytest |
| Regression | Flag-off parity | Pytest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-aggregator` | Hard internal | Required | Aligns shared feedback math. |
| `028/006-coco-intent-steering` | Soft sibling | Optional | Improves intent dimension; fallback is `general`. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Set `SPECKIT_COCOINDEX_FEEDBACK_RERANK=0` to restore existing ranking behavior. SQLite learned rows can remain dormant.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001-aggregator -> persistence -> reducer -> query integration -> tests
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimated Effort |
|-------|------------------|
| Persistence | 2 hours |
| Reducer | 3 hours |
| Ranking integration/tests | 3 hours |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Default-off flag is the primary rollback. If schema removal is required, drop only `feedback_rerank_weights`.
<!-- /ANCHOR:enhanced-rollback -->
