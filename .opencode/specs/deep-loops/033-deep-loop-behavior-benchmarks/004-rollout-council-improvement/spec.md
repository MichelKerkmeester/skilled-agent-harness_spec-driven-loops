---
title: "Feature Specification: Rollout Behavioral Benchmarks -- deep-ai-council + deep-improvement"
description: "Author and execute the deep-ai-council (ACB-001..005) and deep-improvement (IMB-001..005) behavior_benchmark packages -- the multi-seat and improvement-host dispatch shapes, most expensive modes, hardened 25-minute budgets, fewest scenarios (20 GPT runs)."
trigger_phrases:
  - "council improvement behavior benchmark"
  - "deep loop behavior benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/033-deep-loop-behavior-benchmarks/004-rollout-council-improvement"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase charter authored; not started"
    next_safe_action: "Blocked on predecessor phase"
    blockers:
      - "Phase 002 calibration retro must land first"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-004-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Rollout Behavioral Benchmarks -- deep-ai-council + deep-improvement

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
| **Parent Packet** | `033-deep-loop-behavior-benchmarks` |
| **Predecessor** | `../003-rollout-research-context/` |
| **Successor** | `../005-scorecard-and-integration/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Extend the calibrated framework to the two non-runtime-loop dispatch shapes: deep-ai-council (multi-seat orchestration; delegation evidence = seat dispatches + round records rather than iteration LEAF dispatches) and deep-improvement (improvement-host backend; loop owned by loop-host.cjs). These are the most expensive modes per run, so they carry the fewest scenarios (5 each), hardened 25-minute budgets, and the framework's seat/host-specific delegation-evidence extensions authored in this phase against the phase-001 schema's extension points.

### Purpose

Deliver this phase's slice of the program defined in the parent packet's phase map, under the framework and calibration produced by its predecessors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `deep-ai-council/behavior_benchmark/` package: index, `scenarios/ACB-001..005`, `baselines/` (multi-seat dispatch expectations: seats dispatched unprompted, round records present, adjudicator verdict emitted).
- `deep-improvement/behavior_benchmark/` package: index, `scenarios/IMB-001..005`, `baselines/` (improvement-host expectations: proposal-only mutation discipline, evaluator-first flow).
- Delegation-evidence extensions for seat/host shapes (framework reference amendment, backward-compatible).
- Claude baselines (10 runs) -> budgets; both GPT legs (20 runs); all scored + classified.

### Out of Scope

- Fixing behavioral defects found (remediation backlog, phase 005 output).
- Any change to the measured command surfaces themselves.

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/deep-loop-workflows/deep-ai-council/behavior_benchmark/**` | Create | ACB package |
| `.opencode/skills/deep-loop-workflows/deep-improvement/behavior_benchmark/**` | Create | IMB package |
| Framework reference (phase 001 home) | Modify | Seat/host delegation-evidence extensions |
| This phase folder (`runs/`) | Create | Transcripts + result JSONs (30 runs) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Dispatch-shape-correct delegation evidence | ACB scoring verifies seat dispatches + round records; IMB scoring verifies improvement-host flow -- neither borrows the runtime-loop LEAF heuristics blindly. |
| REQ-002 | Hardened budgets respected | 25-minute per-scenario cap; watchdog active; no unattended overrun. |
| REQ-003 | Every run fully scored | 30/30 runs carry one bucket + one 5-dimension score + checkpoints + delegation evidence. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both packages shipped with dispatch-shape-correct expectations.
- **SC-002**: 30/30 runs complete with zero fixture-isolation violations and zero budget overruns past the cap.
- **SC-003**: Per-mode scorecards published.
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
