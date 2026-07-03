---
title: "Plan: Step-Transition Progress Records (P1)"
description: "Lean plan for phase 005 of packet 035; authored fully at execution. Closes F-015, F-016, F-017, F-018, F-031, F-043; effort M."
trigger_phrases:
  - "plan"
  - "035 005 plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-gpt-reliability-fixes/005-progress-records"
    last_updated_at: "2026-07-03T13:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Plan stub scaffolded from 034 synthesis"
    next_safe_action: "Author full plan when this phase starts"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-005-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Step-Transition Progress Records (P1)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Implement the fix package that closes F-015, F-016, F-017, F-018, F-031, F-043 (effort M), applying the ready designs from the 034 research packet. Full step-by-step plan is authored when this phase is picked up; the requirements and acceptance cells are fixed in `spec.md`.
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

Per `spec.md` §3 SCOPE and §4 REQUIREMENTS. The change surfaces and their evidence are named in the closed findings (F-015, F-016, F-017, F-018, F-031, F-043) and the corresponding 034 design iterations.
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

Acceptance is the 033 behavior benchmark: ACB-004, ACB-005, CXB-004; IMB-001-high partial credit. Re-run gpt-fast-med + gpt-fast-high on the affected cells after the change; baseline leg must not regress.
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
