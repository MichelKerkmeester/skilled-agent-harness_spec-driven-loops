---
title: "Run-Now Control (Forced-Run Sentinel)"
description: "There is no mechanism for an operator to force an immediate iteration of a cadence-scheduled deep-loop run without editing the schedule or restarting the process: the only trigger is the configured cadence, and intent to force a run is conflated with cadence state."
trigger_phrases:
  - "run now control"
  - "forced run sentinel"
  - "004 run now control"
  - "deep-research-run-now"
  - "run now sentinel"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/006-ux-observability-automation/004-run-now-control"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored leaf spec for 004-run-now-control"
    next_safe_action: "Author plan.md and tasks.md after confirming lifecycle event name from 002"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Run-Now Control (Forced-Run Sentinel)

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-unified-observability-event-envelope |
| **Successor** | 005-per-iteration-memory-upsert |
| **Handoff Criteria** | `validate.sh --strict` passes; sentinel file consumed-once behavior verified; JSONL lifecycle events emitted correctly |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 4 of 6 within `006-ux-observability-automation`.

**Scope Boundary**: `deep_research_auto.yaml` only — sentinel check step and JSONL lifecycle events. No changes to the scheduler, fan-out pool, or other scripts.

**Dependencies**:
- Per research §6 dependency order: run-now must come **after** the lifecycle event naming decision from 002 (`iteration_started` vs `iteration_start`) — the sentinel check emits that event. Read 002's spec/decision-record to get the canonical name before authoring this plan.
- No hard blocking dependency on 003 (envelope), but sentinel events should flow through the envelope if 003 is already merged.

**Deliverables**:
- `step_run_now_check` in `deep_research_auto.yaml`: detect sentinel file → consume-once → emit `run_now_accepted` event → dispatch
- Pause-precedence check: if loop is paused, emit `run_now_rejected` instead of dispatching
- JSONL lifecycle events: `run_now_requested`, `run_now_accepted`, `run_now_rejected`, `run_now_restored`

**Changelog**:
- When this phase closes, refresh `../changelog/` using `156-ux-observability-004`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The only way to trigger an immediate deep-loop iteration is to wait for the configured cadence or restart the process. There is no operator-friendly way to force a one-shot iteration out-of-cadence. Forced-run intent is currently conflated with cadence state, making it impossible to separate "run now because the operator requested it" from "run now because the timer fired."

### Purpose
Add a `state_paths.run_now_sentinel` file (`.deep-research-run-now`) as a consume-once forced-run mechanism: the YAML loop checks for the file before each cadence wait, consumes it atomically if present, checks pause precedence, and emits typed JSONL lifecycle events so the run-now intent is separately auditable from cadence state.

> **Reference**: `external/loop-cli-main/src/core/loop-controller.ts:161,233,475`; `daemon/server.ts:151`; `manager.ts:213` — forced-run sentinel (`forceRunSentinel`) is checked pre-cadence-wait, consumed atomically before dispatch, preceded by pause check, and produces typed `forceRun:{requested,accepted,rejected}` events in the shared ledger. (Research: research.md §5.5, iters 3, 30)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `step_run_now_check` YAML step in `deep_research_auto.yaml`: detect `.deep-research-run-now` → consume atomically → check pause state → emit `run_now_accepted` or `run_now_rejected`
- Pause-precedence logic: if loop is paused at check time, emit `run_now_rejected` with reason `loop_paused`
- Consume-once: sentinel file deleted before dispatch start (latch cleared at dispatch start, not completion)
- JSONL lifecycle events: `run_now_requested` (when file appears), `run_now_accepted`, `run_now_rejected`, `run_now_restored` (if sentinel is recreated mid-run)
- Unit test: mock sentinel file existence → assert correct JSONL events emitted

### Out of Scope
- Saved-schedule restore (deep variant: restoring the original cadence schedule after a forced run) — tagged as deep variant in research §5.5
- Fan-out forced-run triggering (this leaf covers single-executor runs via YAML; fan-out is a separate concern)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modify | Add `step_run_now_check` with sentinel detect/consume/pause-check/event-emit logic |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Sentinel file is consumed atomically before dispatch (latch cleared at dispatch start, not completion) | Integration test: place sentinel → run one iteration → confirm sentinel file absent at dispatch start; re-place during run → confirm not consumed mid-run |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Pause takes precedence: if loop is paused, sentinel is not consumed and `run_now_rejected` is emitted | Unit test: loop in paused state → place sentinel → assert `run_now_rejected` in JSONL and sentinel still present |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Placing `.deep-research-run-now` triggers an immediate iteration; the file is consumed; `run_now_accepted` appears in the JSONL ledger
- **SC-002**: `validate.sh --strict` on this folder exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Race condition: sentinel file read and consumed between check and dispatch | Medium — concurrent operator could place it again | Consume atomically (rename then check rename succeeded); treat failed consume as no-op |
| Dependency | Lifecycle event name must match the name decided in 002 | Medium — wrong event name silently misroutes | Read 002's decision-record before authoring the YAML step |

> **Deep-variant note**: Saved-schedule restore (restoring original cadence after a forced run) is the deep variant. This leaf only covers the consume-once sentinel. (Research: research.md §5.5, iters 3, 30)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the canonical lifecycle event name from 002 — `iteration_started` or `iteration_start`? This determines the event name emitted alongside `run_now_accepted`.
- Should the sentinel file path be configurable via a `state_paths` config key, or hardcoded as `.deep-research-run-now` relative to the working directory?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
