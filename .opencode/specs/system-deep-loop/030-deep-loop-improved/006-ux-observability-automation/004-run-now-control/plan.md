---
title: "Implementation Plan: Run-Now Control (Forced-Run Sentinel)"
description: "Documents the completed consume-once run-now sentinel and lifecycle event work."
trigger_phrases:
  - "run now control"
  - "forced run sentinel"
  - "deep-research-run-now"
  - "run now sentinel"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/006-ux-observability-automation/004-run-now-control"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Run-Now Control (Forced-Run Sentinel)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research YAML command steps and JSONL lifecycle events |
| **Framework** | Cadence-scheduled deep-loop auto workflow |
| **Storage** | Consume-once `.deep-research-run-now` sentinel and status JSONL ledger |
| **Testing** | Sentinel consume fixture, pause-precedence fixture, strict spec validation |

### Overview
This completed work added an operator-controlled run-now sentinel for cadence-scheduled deep-loop runs. The YAML workflow checks for `.deep-research-run-now`, consumes it once before dispatch, respects pause precedence, and emits typed lifecycle events that separate forced-run intent from normal cadence state.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: operators could not force one immediate iteration without editing cadence or restarting.
- [x] Success criteria measurable: sentinel is consumed once and `run_now_accepted` appears in the ledger.
- [x] Dependencies identified: lifecycle event naming follows the single-loop telemetry leaf.

### Definition of Done
- [x] `deep_research_auto.yaml` checks the run-now sentinel before cadence wait.
- [x] Sentinel consume clears the latch before dispatch starts.
- [x] Pause precedence emits `run_now_rejected` rather than dispatching.
- [x] Lifecycle rows cover requested, accepted, rejected, and restored states.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Consume-once sentinel: operator intent is represented by a filesystem latch, the YAML loop consumes the latch at the dispatch boundary, and JSONL lifecycle rows record whether the forced run was accepted or rejected.

### Key Components
- **`state_paths.run_now_sentinel`**: Configurable path for `.deep-research-run-now`.
- **`step_run_now_check`**: Detects sentinel presence, performs pause-precedence checks, and dispatches only when accepted.
- **Lifecycle events**: `run_now_requested`, `run_now_accepted`, `run_now_rejected`, and `run_now_restored` make the control path auditable.
- **Pause guard**: Prevents forced dispatch while the loop is paused.

### Data Flow
An operator creates the sentinel file, the auto YAML checks it before cadence waiting, and the workflow either rejects it while paused or consumes it atomically before dispatch. The workflow emits a typed JSONL row for the outcome, and a recreated sentinel during a run is treated as restored intent for a later boundary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep_research_auto.yaml` | Controls cadence and dispatch flow | Add `step_run_now_check` | Sentinel triggers immediate dispatch |
| Sentinel file | Operator run-now latch | Consume once before dispatch | File absent at dispatch start after accept |
| Pause state | Blocks dispatch when paused | Reject forced run while paused | Ledger contains `run_now_rejected` |
| JSONL lifecycle ledger | Records operator control state | Add run-now events | Accepted and rejected rows are typed |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and confirm YAML-only scope.
- [x] Confirm run-now depends on the lifecycle event naming from the telemetry leaf.
- [x] Keep scheduler rewrite and fan-out forced-run support out of scope.

### Phase 2: Core Implementation
- [x] Add `state_paths.run_now_sentinel` for `.deep-research-run-now`.
- [x] Add `step_run_now_check` before cadence wait and dispatch.
- [x] Consume the sentinel once before dispatch starts.
- [x] Emit `run_now_accepted` for accepted forced runs.
- [x] Emit `run_now_rejected` with `loop_paused` when pause state wins.
- [x] Emit requested and restored lifecycle rows for auditability.

### Phase 3: Verification
- [x] Verify placing `.deep-research-run-now` triggers immediate dispatch and removes the file.
- [x] Verify paused loops reject run-now without consuming the sentinel.
- [x] Verify recreated sentinel intent is not consumed mid-run.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Sentinel accepted and consumed before dispatch | YAML run fixture |
| Pause precedence | Paused loop rejects run-now and keeps sentinel | Pause-state fixture |
| Race behavior | Sentinel recreated during run waits for next boundary | Sentinel fixture |
| Spec validation | Leaf packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Single-loop telemetry lifecycle naming | Internal predecessor | Complete | Run-now events must align with the chosen lifecycle vocabulary |
| Unified event envelope | Internal peer | Compatible | Run-now rows can flow through the envelope when present |
| Saved-schedule restore | Out of scope | Not required | This leaf only implements consume-once forced runs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Sentinel consumption races, paused loops dispatch anyway, or run-now events use the wrong lifecycle vocabulary.
- **Procedure**: Remove `step_run_now_check`, the sentinel path, and run-now lifecycle rows from `deep_research_auto.yaml`, restoring cadence-only dispatch.
<!-- /ANCHOR:rollback -->
