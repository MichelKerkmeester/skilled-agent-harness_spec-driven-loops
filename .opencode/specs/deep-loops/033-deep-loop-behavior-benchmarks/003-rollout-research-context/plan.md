---
title: "Implementation Plan: Rollout Behavioral Benchmarks -- deep-research + deep-context"
description: "Author and execute the deep-research (RSB-001..008) and deep-context (CXB-001..006) behavior_benchmark packages against the pilot-calibrated framework: Claude baselines plus both GPT-5.5-fast legs (28 GPT runs), scored and classified."
trigger_phrases:
  - "implementation"
  - "plan"
  - "research context behavior benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/033-deep-loop-behavior-benchmarks/003-rollout-research-context"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase plan authored; not started"
    next_safe_action: "Blocked on predecessor phase"
    blockers:
      - "Phase 002 calibration retro must land first"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-003-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Rollout Behavioral Benchmarks -- deep-research + deep-context

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

Roll the calibrated framework out to the two remaining runtime-loop modes. deep-research (RSB-001..008) and deep-context (CXB-001..006) share deep-review's dispatch shape (runtime-loop-type backend, LEAF iteration agents), so the pilot's calibration transfers directly. Research scenarios bind self-contained research topics; context scenarios target the frozen fixtures. Both sets keep the realistic-prompt weighting (>=50% vague/concise) and include unprompted-delegation and role-absorption probes.
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
- [ ] T002 [P] Author `deep-research/behavior_benchmark/` (RSB-001..008; self-contained research topics; iteration caps 1-2).
- [ ] T003 [P] Author `deep-context/behavior_benchmark/` (CXB-001..006; fixture targets).
- [ ] T004 Capture Claude baselines for both packages (14 runs); derive budgets.
- [ ] T005 Run `gpt-fast-med` + `gpt-fast-high` legs for both packages (28 runs); score + classify each.

### Phase 3: Verification
- [ ] T006 Publish per-mode scorecards; adjudicate the cross-mode ambiguity scenario.
- [ ] T007 `validate.sh --strict` on this phase folder.
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
