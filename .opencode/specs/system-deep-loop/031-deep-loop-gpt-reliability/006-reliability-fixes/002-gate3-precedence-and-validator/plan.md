---
title: "Plan: Gate-3 Precedence and Validator"
description: "Lean plan for phase 002 of packet 035 (unified command-contract architecture); authored fully at execution. Closes F-001, F-002, F-003, F-004, F-005, F-028, F-030, F-040; effort L."
trigger_phrases:
  - "plan"
  - "035 002 plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-deep-loop-gpt-reliability/006-reliability-fixes/002-gate3-precedence-and-validator"
    last_updated_at: "2026-07-03T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Plan stub scaffolded from plan-review restructure"
    next_safe_action: "Author full plan when this phase starts"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-002-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Gate-3 Precedence and Validator

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Implement the fix package that closes F-001, F-002, F-003, F-004, F-005, F-028, F-030, F-040 (effort L). The full step-by-step plan is authored when this phase is picked up; requirements and acceptance cells are fixed in `spec.md`, and the packet-wide gap mapping in `../context-index.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|---|---|
| Design fidelity | Applied edits match the 034 design / plan-review amendment; quoted current-text verified before change |
| Claude-native regression | Baseline benchmark leg stays green (per parent REQ-006 exceptions); feature flag + fallback in place |
| Acceptance | The phase's 033 cells re-run and move to the expected verdict (N>=3 for contested stalls) |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Per `spec.md` §3 SCOPE and §4 REQUIREMENTS. Change surfaces and evidence are named in the closed findings and the corresponding 034 design iterations / plan-review gaps.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | Work | Gate |
|---|---|---|
| Apply | Land the requirement edits from spec.md §4, behind the per-command feature flag | design fidelity |
| Verify | Re-run the acceptance cells + baseline leg; CI comparator green | acceptance |
| Close | Update docs, validate strict, scoped commit | validation clean |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Acceptance is the 033 behavior benchmark: RVB-008, RSB-008, ACB-004-med, IMB-004, IMB-005. Re-run gpt-fast-med + gpt-fast-high on the affected cells; baseline leg must not regress beyond the parent REQ-006 exceptions.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Parent dependency order (`../spec.md` §8): 001 foundation (harness + rollout) before any flip; 002 (Gate-3 + validator) before the contract phases are verified; 003 contract before 004/005 consume it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each command ships behind its phase-001 feature flag with a byte-identical pre-035 fallback; flip the flag off to roll back. Edits are scoped and reversible via git; the benchmark cells + CI comparator are the regression check.
<!-- /ANCHOR:rollback -->
