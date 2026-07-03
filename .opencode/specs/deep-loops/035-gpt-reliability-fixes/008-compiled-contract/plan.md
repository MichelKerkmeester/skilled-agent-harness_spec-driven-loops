---
title: "Plan: Compiled Per-Command Contract + Setup Loader (P2)"
description: "Lean plan for phase 008 of packet 035; authored fully at execution. Closes F-035, F-036, F-037, F-038, F-009; effort L."
trigger_phrases:
  - "plan"
  - "035 008 plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/008-compiled-contract"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Plan stub scaffolded from 034 synthesis"
    next_safe_action: "Author full plan when this phase starts"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-008-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Compiled Per-Command Contract + Setup Loader (P2)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Implement the fix package that closes F-035, F-036, F-037, F-038, F-009 (effort L), applying the ready designs from the 034 research packet. Full step-by-step plan is authored when this phase is picked up; the requirements and acceptance cells are fixed in `spec.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|---|---|
| Design fidelity | Applied edits match the 034 design; quoted current-text verified before change |
| Claude-native regression | Baseline benchmark leg stays green |
| Acceptance | The phase's 033 cells re-run and move to the expected verdict |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Per `spec.md` §3 SCOPE and §4 REQUIREMENTS. The change surfaces and their evidence are named in the closed findings (F-035, F-036, F-037, F-038, F-009) and the corresponding 034 design iterations.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | Work | Gate |
|---|---|---|
| Apply | Land the requirement edits from spec.md §4 | design fidelity |
| Verify | Re-run the acceptance cells + baseline leg | acceptance |
| Close | Update docs, validate strict, scoped commit | validation clean |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Acceptance is the 033 behavior benchmark: Gate-inversion + render + absorbed-step classes together. Re-run gpt-fast-med + gpt-fast-high on the affected cells after the change; baseline leg must not regress.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Parent dependency order (`../spec.md` §3): phase 002 (Gate-3) lands before P1 phases are verified; phase 001 (harness) lands before any cell-flip claim is trusted.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each edit is scoped and reversible via git; the benchmark cells are the regression check. No destructive migrations in this phase's default scope.
<!-- /ANCHOR:rollback -->
