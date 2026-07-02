---
title: "Implementation Plan: Rollout Behavioral Benchmarks -- deep-ai-council + deep-improvement"
description: "Author and execute the deep-ai-council (ACB-001..005) and deep-improvement (IMB-001..005) behavior_benchmark packages -- the multi-seat and improvement-host dispatch shapes, most expensive modes, hardened 25-minute budgets, fewest scenarios (20 GPT runs)."
trigger_phrases:
  - "implementation"
  - "plan"
  - "council improvement behavior benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/033-deep-loop-behavior-benchmarks/004-rollout-council-improvement"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase plan authored; not started"
    next_safe_action: "Blocked on predecessor phase"
    blockers:
      - "Phase 002 calibration retro must land first"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-004-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Rollout Behavioral Benchmarks -- deep-ai-council + deep-improvement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown scenario contracts / analysis docs + the phase-001 runner |
| **Framework** | Calibrated framework reference (phase 002 retro) |
| **Storage** | Packages in the sub-skill folders; run evidence + analysis in this phase folder |
| **Testing** | Runner-enforced isolation + contract-schema conformance + strict spec validation |

### Overview

Extend the calibrated framework to the two non-runtime-loop dispatch shapes: deep-ai-council (multi-seat orchestration; delegation evidence = seat dispatches + round records rather than iteration LEAF dispatches) and deep-improvement (improvement-host backend; loop owned by loop-host.cjs). These are the most expensive modes per run, so they carry the fewest scenarios (5 each), hardened 25-minute budgets, and the framework's seat/host-specific delegation-evidence extensions authored in this phase against the phase-001 schema's extension points.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Predecessor gate passed (Phase 002 calibration retro).
- [ ] cli-opencode SKILL.md read in the executing session (for phases dispatching GPT legs).

### Definition of Done
- [ ] This phase's success criteria (spec.md SC-001..SC-004) met with evidence.
- [ ] `validate.sh --strict` passes for this phase folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Contract-first scenario execution over the shared runner (or evidence-first aggregation, for the closing phase); contract/evidence separation throughout.

### Key Components

- Scenario contracts / analysis docs per this phase's scope (see spec.md).
- The phase-001 runner + framework reference as the only measurement substrate.
- Run evidence (result JSON + transcript per run) in this folder.

### Data Flow

Contract -> runner (leg) -> result JSON -> per-mode scorecard -> (phase 005) cross-skill aggregation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm predecessor gate; verify fixture restore for this phase's targets.

### Phase 2: Core Implementation
- [ ] T002 Author the seat/host delegation-evidence extensions in the framework reference (backward-compatible).
- [ ] T003 [P] Author `deep-ai-council/behavior_benchmark/` (ACB-001..005; synthetic council topics; 25min budgets).
- [ ] T004 [P] Author `deep-improvement/behavior_benchmark/` (IMB-001..005; dry-run-defaulted improvement targets; 25min budgets).
- [ ] T005 Capture Claude baselines (10 runs); derive budgets.
- [ ] T006 Run `gpt-fast-med` + `gpt-fast-high` legs for both packages (20 runs); score + classify each.

### Phase 3: Verification
- [ ] T007 Publish per-mode scorecards.
- [ ] T008 `validate.sh --strict` on this phase folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live benchmark runs / aggregation checks | Per spec.md scope | Phase-001 runner / result-JSON schema |
| Spec | Phase docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 002 calibration retro | Predecessor | Pending | Hard blocker |
| Phase-001 runner + fixtures | Infrastructure | Pending | No measurement substrate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: This phase's outputs prove unusable or the program halts.
- **Procedure**: Delete this phase's additive package directories / analysis docs; run evidence stays as the record.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Predecessor phase gate | Core |
| Core | Setup | Verify |
| Verify | Core | Next program phase |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Setup | Low | Small |
| Core Implementation | Medium | Medium |
| Verification | Low-Medium | Small-Medium |
| **Total** | | **Medium** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Fixture-isolation assertion active before any live run this phase performs.
- [ ] All outputs land in additive-only locations (package dirs, this phase folder).

### Rollback Procedure
1. Delete this phase's additive package directories / analysis docs.
2. Run evidence in this folder remains as the record.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Directory/file deletion only.
<!-- /ANCHOR:enhanced-rollback -->

---
