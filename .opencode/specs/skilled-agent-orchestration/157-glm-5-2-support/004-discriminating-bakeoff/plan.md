---
title: "Implementation Plan: Phase 4: discriminating-bakeoff (contingency)"
description: "Contingency re-run of the GLM-5.2 framework bakeoff on harder adversarial validators if phase 2 saturated."
trigger_phrases:
  - "glm-5.2 discriminating bakeoff plan"
  - "framework bakeoff contingency"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/157-glm-5-2-support/004-discriminating-bakeoff"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Contingency phase plan scaffolded; not started"
    next_safe_action: "Execute only if phase 2 saturated"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/004-discriminating-bakeoff"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: discriminating-bakeoff (contingency)

<!-- SPECKIT_LEVEL: 1 -->

> **CONTINGENCY** — run only if phase 2 saturated (TIE with no separation).

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON benchmark profile + deep-loop model-benchmark machinery |
| **Framework** | `/deep:model-benchmark` lane |
| **Storage** | Run outputs under `sk-prompt-models/benchmarks/<run-label>/` |
| **Testing** | Correctness gate must separate (not uniform 1.0) |

### Overview
Clone the phase-2 bakeoff profile to a harder, more adversarial invalid-dominant fixture set (more samples/cell if needed), re-run `/deep:model-benchmark` with a non-GLM judge, and capture a verdict that SEPARATES correctness. Hand the separable verdict to a 003-style promotion step. Mirrors 149/004 (run 007 rescuing the saturated run 006).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 2 returned a saturated TIE (the trigger)
- [ ] Harder fixtures identified

### Definition of Done
- [ ] Run separates correctness; winner named
- [ ] Synthesis refutes the saturated phase-2 run
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Same model-benchmark lane as phase 2, harder fixtures. The only variable changed is fixture difficulty (and sample count), isolating the saturation cause.

### Key Components
- **glm-5.2-frameworks-discriminating.json**: the harder bakeoff profile.
- **`/deep:model-benchmark`**: the runner.
- **benchmarks/<run-label>/**: results, aggregate, synthesis (with refutation note).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Build `glm-5.2-frameworks-discriminating.json` (harder validators, more samples/cell)

### Phase 2: Run
- [ ] Run the discriminating bakeoff with a non-GLM judge
- [ ] Confirm correctness is no longer uniform 1.0

### Phase 3: Verdict
- [ ] Record the separable winner + leaderboard; refute the saturated run
- [ ] Hand off to a 003-style promotion; write implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Benchmark | Per-framework correctness separation | `/deep:model-benchmark` |
| Judge | Non-GLM grading | `--grader=llm` non-GLM model |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 2 saturation | Internal | Trigger | Phase does not run unless saturated |
| model-benchmark lane | Internal | Available | No runner |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Run misconfigured.
- **Procedure**: Delete the discriminating profile + run folder; re-create. No production surface touched.
<!-- /ANCHOR:rollback -->
