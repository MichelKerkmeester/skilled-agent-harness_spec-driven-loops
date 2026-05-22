---
title: "Implementation Plan: 116/007 — Ledger-Led Graph Vocabulary"
description: "Plan for projecting stable ledger semantics into deep-review graph events."
trigger_phrases:
  - "116 graph vocabulary plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-review-complexity/007-ledger-led-graph-vocabulary"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Scaffolded phase 007 plan."
    next_safe_action: "Implement graph projection after phase 006."
    blockers: []
    key_files: ["spec.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:1160071000000000000000000000000000000000000000000000000000000000"
      session_id: "116-007-plan"
      parent_session_id: "116-007-ledger-led-graph-vocabulary"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: 116/007 — Ledger-Led Graph Vocabulary

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
Add graph projection for stable candidate-search semantics without weakening graphless fallback.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [ ] Phase 006 fallback tests pass.
- [ ] Graph vocabulary tests cover candidate node semantics.
- [ ] Graphless fallback tests still pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Ledger-led projection: graph events are derived from the durable search ledger, not a replacement for it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
- [ ] Inspect graph event allow-list and coverage graph tests.
- [ ] Add candidate vocabulary projection.
- [ ] Verify graph and graphless paths.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Run graph vocabulary tests, graphless fallback tests, and spec validation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Phase 006 graphless fallback gate | Convergence behavior | Planned |
| Coverage graph tests | Test convention | To inspect |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 6. ROLLBACK PLAN
Revert graph vocabulary changes while keeping text/JSON ledger phases intact.
<!-- /ANCHOR:rollback -->
