---
title: "Implementation Plan: Pilot Behavioral Benchmark -- deep-review"
description: "Author RVB-001..008, capture Claude baselines, run both GPT-5.5-fast legs, score/classify, then calibrate the framework via retro before rollout."
trigger_phrases:
  - "implementation"
  - "plan"
  - "deep review behavior benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/033-deep-loop-behavior-benchmarks/002-pilot-deep-review"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Pilot executed and scored; retro landed"
    next_safe_action: "Phase 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-002-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Pilot Behavioral Benchmark -- deep-review

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown scenario contracts + the phase-001 runner |
| **Framework** | Framework reference (schema/rubric/taxonomy/budgets) from phase 001 |
| **Storage** | Package in `deep-review/behavior_benchmark/`; run evidence in this folder's `runs/` |
| **Testing** | Runner-enforced isolation + scoring against pre-declared contract expectations |

### Overview

Author the eight RVB scenario contracts sampling all axes with realistic weighting, capture the Claude baseline (which also proves each scenario is well-formed), execute both GPT-5.5-fast legs via cli-opencode, score/classify all 24 runs, and close with a calibration retro whose framework amendments land before any rollout authoring. Scenario sketch (finalized at authoring): RVB-001 E1/C3 fully-specified `:auto` run; RVB-002 E2/C2 bare invocation -> consolidated-question halt; RVB-003 E3/C1 vague natural-language ask ("can you review this?" with only a fixture folder open); RVB-004 E3/C2 concise ask naming the target but no command; RVB-005 E4/C2 orchestrate-routed; RVB-006 E1/C1 vague `:auto` -> fail-fast naming missing inputs; RVB-007 delegation probe (unprompted `@deep-review` LEAF dispatch + route-proof); RVB-008 role-absorption probe (does the executor do the review inline instead of dispatching).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 001 exit gate passed.
- [x] cli-opencode SKILL.md + GLM profile read in the executing session.

### Definition of Done
- [x] RVB-001..008 authored (GLM-5.2-max), schema-valid, axis coverage verified (6/8 at C1/C2).
- [x] Claude baselines final after 3 calibration rounds; budgets derived and tiered.
- [x] 16 GPT-leg runs complete; 24/24 scored; zero isolation violations.
- [x] scorecard.md published with the prior-benchmark comparison.
- [x] Retro: six amendments landed in-flight; one residual logged OPEN for phase 003.
- [x] `validate.sh --strict` run at closeout.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Contract-first: every scenario pre-declares its expected interaction outcome, presentation markers, and delegation evidence BEFORE any run — scoring is comparison, not judgment.

### Key Components

- **RVB scenario contracts** (verbatim prompts, axes, expectations, budget, fixture target).
- **Baselines file** (`baselines/`): Claude per-scenario checkpoint values.
- **Run evidence** (`runs/` here): transcript + result JSON per run, named `<scenario>-<leg>.json`.
- **Pilot scorecard**: bucket histogram, dimension means, per-checkpoint latency ratios per leg.

### Data Flow

Contract -> runner (leg) -> result JSON -> scorecard aggregation -> retro -> framework amendments.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Verify phase-001 exit gate; confirm fixture restore procedure works for the review fixture.

### Phase 2: Implementation
- [x] RVB package authored (GLM-5.2-max).
- [x] Baselines captured + recorded with caveats.
- [x] Both GPT legs run + scored (16 runs).

### Phase 3: Verification
- [x] scorecard.md published.
- [x] Retro landed (six in-flight amendments + one OPEN residual).
- [x] Strict validation at closeout.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live benchmark runs | 24 runs (8 baseline + 16 GPT) | Phase-001 runner |
| Contract conformance | Every result JSON validates against the framework schema | Runner schema check |
| Spec | Phase docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 001 exit gate | Predecessor | Pending | Hard blocker |
| Review fixture packet | Phase 001 artifact | Pending | No safe target for runs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Pilot shows the framework fundamentally mismeasures (not just needs calibration).
- **Procedure**: Delete the package directory; keep run evidence here as the record; redesign in phase 001 before retrying.
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
