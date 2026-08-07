---
title: "Feature Specification: Cross-Skill Scorecard & Integration"
description: "Aggregate all rounds into the 5-mode x 3-executor scorecard (bucket histograms, per-checkpoint latency ratios, dimension means), confirm or refute packet 031's headline findings per mode, rank a remediation backlog, and wire discoverability pointers into all five sub-skills."
trigger_phrases:
  - "behavior benchmark scorecard"
  - "deep loop behavior benchmark"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/027-deep-loop-behavior-benchmarks/005-scorecard-and-integration"
    last_updated_at: "2026-07-02T07:45:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase charter authored; not started"
    next_safe_action: "Blocked on predecessor phase"
    blockers:
      - "Phases 003 and 004 must complete first"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-005-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Cross-Skill Scorecard & Integration

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
| **Predecessor** | `../004-rollout-council-improvement/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Close the program: aggregate every scored run from phases 002-004 into one cross-skill scorecard (5 modes x 3 executors), analyze per-checkpoint latency ratios and bucket distributions, and explicitly confirm or refute packet 031's three headline findings per mode (3-10x latency gap, role-absorption risk, inconsistent Command-only routing discipline). Confirmed behavioral defects become a ranked remediation backlog for future packets -- this phase fixes nothing itself. Finally, add README/SKILL.md pointers in all five sub-skills so the packages are discoverable, and run the full-packet strict validation.

### Purpose

Deliver this phase's slice of the program defined in the parent packet's phase map, under the framework and calibration produced by its predecessors.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Cross-skill scorecard: 5-mode x 3-executor matrix, bucket histograms, dimension means, per-checkpoint latency ratios (t_first_output / t_setup / t_first_dispatch / t_terminal vs baseline), single-sample provenance marked.
- Per-mode confirm/refute verdicts against packet 031's headline findings.
- Ranked remediation backlog (defect, evidence, affected mode(s), suggested owner packet).
- README/SKILL.md discoverability pointers in all five sub-skills.
- Full-packet `validate.sh --strict` + final verification sweep.

### Out of Scope

- Fixing behavioral defects found (remediation backlog, phase 005 output).
- Any change to the measured command surfaces themselves.

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| This phase folder (`scorecard.md`, `remediation-backlog.md`) | Create | Aggregated analysis |
| `.opencode/skills/deep-loop-workflows/<mode>/README.md` + `SKILL.md` (x5) | Modify | Discoverability pointers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No unmeasured cells | Every scenario x executor cell has a scored result or an explicit quarantine record -- silent gaps are failures. |
| REQ-002 | Findings tied to evidence | Every scorecard claim cites run IDs; every backlog entry cites the runs that evidence it. |
| REQ-003 | Fix-nothing discipline | This phase ships analysis + pointers only; defects route to the backlog, never inline fixes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Scorecard published covering all cells with provenance.
- **SC-002**: 031 headline findings explicitly confirmed/refuted per mode.
- **SC-003**: Ranked remediation backlog delivered; pointers landed in all five sub-skills.
- **SC-004**: Full-packet `validate.sh --strict` passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Predecessor phase gate (Phases 003 and 004) | Everything here | Hard blocker in frontmatter |
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
