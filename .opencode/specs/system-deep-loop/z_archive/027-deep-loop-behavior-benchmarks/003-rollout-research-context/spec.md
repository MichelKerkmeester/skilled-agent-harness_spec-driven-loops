---
title: "Feature Specification: Rollout Behavioral Benchmarks -- deep-research + deep-context"
description: "Author and execute the deep-research (RSB-001..008) and deep-context (CXB-001..006) behavior_benchmark packages against the pilot-calibrated framework: Claude baselines plus both GPT-5.5-fast legs (28 GPT runs), scored and classified."
trigger_phrases:
  - "research context behavior benchmark"
  - "deep loop behavior benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/027-deep-loop-behavior-benchmarks/003-rollout-research-context"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase charter authored; not started"
    next_safe_action: "Blocked on predecessor phase"
    blockers:
      - "Phase 002 calibration retro must land first"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-003-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rollout Behavioral Benchmarks -- deep-research + deep-context

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-02 |
| **Parent Packet** | `027-deep-loop-behavior-benchmarks` |
| **Successor** | `../004-rollout-council-improvement/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Roll the calibrated framework out to the two remaining runtime-loop modes. deep-research (RSB-001..008) and deep-context (CXB-001..006) share deep-review's dispatch shape (runtime-loop-type backend, LEAF iteration agents), so the pilot's calibration transfers directly. Research scenarios bind self-contained research topics; context scenarios target the frozen fixtures. Both sets keep the realistic-prompt weighting (>=50% vague/concise) and include unprompted-delegation and role-absorption probes.

### Purpose

Deliver this phase's slice of the program defined in the parent packet's phase map, under the framework and calibration produced by its predecessors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `deep-research/behavior_benchmark/` package: index, `scenarios/RSB-001..008`, `baselines/`.
- `deep-context/behavior_benchmark/` package: index, `scenarios/CXB-001..006`, `baselines/`.
- Claude baselines (14 runs) -> budgets; both GPT legs (28 runs); all scored + classified.
- Natural-language ambiguity scenario: a vague ask legitimately matching BOTH research and context, with the acceptable route set pre-declared (either scores pass; anything else scores route_mismatch).

### Out of Scope

- Fixing behavioral defects found (remediation backlog, phase 005 output).
- Any change to the measured command surfaces themselves.

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/deep-loop-workflows/deep-research/behavior_benchmark/**` | Create | RSB package |
| `.opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/**` | Create | CXB package |
| This phase folder (`runs/`) | Create | Transcripts + result JSONs (42 runs) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Calibrated framework only | Authoring starts only after phase 002's retro amendments are landed; contracts cite the amended reference version. |
| REQ-002 | Axis coverage per package | Both packages cover E1-E4/C1-C3; >=50% scenarios at C1/C2; delegation + role-absorption probes in each. |
| REQ-003 | Every run fully scored | 42/42 runs carry one bucket + one 5-dimension score + checkpoints + delegation evidence. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both packages shipped, schema-valid, axis coverage verified.
- **SC-002**: 42/42 runs complete with zero fixture-isolation violations.
- **SC-003**: Per-mode scorecards published; the cross-mode ambiguity scenario adjudicated per its pre-declared route set.
- **SC-004**: `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Predecessor phase gate (Phase 002 calibration retro) | Everything here | Hard blocker in frontmatter |
| Risk | Live-run cost/flakiness | Budget or schedule slip | Iteration caps, budgets, watchdog, single-sample policy from the framework |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at planning time.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: A failed/killed run still yields a scored record -- no silent gaps in the run matrix.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Claude baseline failing a scenario quarantines it as framework-suspect rather than scoring GPT against a broken reference.

### Error Scenarios
- Executor refusal of a legitimate invocation classifies `refused`; the refusal is the data.

### State Transitions
- Fixture git-clean restore between every run.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Package authoring + bounded run matrix (or aggregation, for the closing phase) |
| Risk | 10/25 | Framework controls carry the risk |
| Research | 6/20 | Calibrated framework removes the unknowns |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Framework**: `../001-framework-and-harness/`
- **Pilot**: `../002-pilot-deep-review/`
