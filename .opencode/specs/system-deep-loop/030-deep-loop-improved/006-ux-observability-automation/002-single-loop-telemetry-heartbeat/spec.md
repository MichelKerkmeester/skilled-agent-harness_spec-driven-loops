---
title: "Single-Loop Telemetry Heartbeat"
description: "Single-executor deep-loop runs emit no structured telemetry rows: the status dashboard covers fan-out runs only, leaving lone-executor research, review, and context passes invisible to orchestration-status.log tooling."
trigger_phrases:
  - "single loop telemetry"
  - "telemetry heartbeat"
  - "single executor telemetry"
  - "002 single loop telemetry"
  - "orchestration status parity"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/006-ux-observability-automation/002-single-loop-telemetry-heartbeat"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored leaf spec for 002-single-loop-telemetry-heartbeat"
    next_safe_action: "Author plan.md and tasks.md before implementation"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Single-Loop Telemetry Heartbeat

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
| **Phase** | 2 of 6 |
| **Predecessor** | 001-dashboard-sparkline-trend |
| **Successor** | 003-unified-observability-event-envelope |
| **Handoff Criteria** | `validate.sh --strict` passes; single-loop telemetry rows parse like fan-out rows in a parity test; canonical lifecycle event name documented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 2 of 6 within `006-ux-observability-automation`. It can run in parallel with 001 (non-overlapping target files).

**Scope Boundary**: `deep_research_auto.yaml` step additions and a serialized-diff gate in `atomic-state.ts`. No changes to fan-out ledger format; rows are additive.

**Dependencies**:
- 003-unified-observability-event-envelope (successor) wraps these rows inside the canonical envelope. Rows must use a fan-out-compatible shape so the envelope can normalize them.
- **004-run-now-control depends on the lifecycle event name decided in this spec** (`iteration_started` vs `iteration_start`). This must be resolved before 004 is planned.

**Deliverables**:
- `step_telemetry_heartbeat` in `deep_research_auto.yaml` emitting `started`/`progress`/terminal rows with `label:"single"`
- Serialized-diff gate in `atomic-state.ts` suppressing no-change telemetry writes
- Parity test confirming single-loop rows parse identically to fan-out rows
- Canonical lifecycle event name decision documented in this spec or a companion decision-record

**Changelog**:
- When this phase closes, refresh `../changelog/` using `156-ux-observability-002`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop dashboard and status tooling reads `orchestration-status.log` rows emitted by fan-out runs. Single-executor runs (lone deep-research, deep-review, or deep-context without fan-out) emit no structured telemetry rows, so they are invisible to the dashboard and any tooling monitoring the log. There is no single view for both execution modes, making single runs operationally opaque.

### Purpose
Add a single-loop telemetry heartbeat step to `deep_research_auto.yaml` that emits `started`, periodic `progress`, and terminal (`completed | failed | stopped`) rows with `label:"single"` and fan-out-shaped gauges so both single and fan-out runs produce rows parseable by the same dashboard reader.

> **Reference**: `external/loop-cli-main/src/daemon/manager.ts:257,263`; `loop-controller.ts:333,372` — the daemon emits typed lifecycle rows (`started`, `progress`, `completed|failed`) into a shared status ledger that the unified reader indexes by `label` field regardless of execution mode. (Research: research.md §5.5, iter 28)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `step_telemetry_heartbeat` YAML step in `deep_research_auto.yaml` emitting `started`/`progress`/terminal rows
- Rows tagged `label:"single"` with fan-out-shaped gauges (iteration count, elapsed ms, score)
- Serialized-diff gating in `atomic-state.ts`: row emitted only when state has changed since last write
- Parity test (unit or integration) confirming single-loop rows validate with the same parser as fan-out rows
- Canonical lifecycle event name decision (`iteration_started` or `iteration_start`) documented here

### Out of Scope
- Changes to fan-out telemetry format — additive/parallel; existing fan-out ledger rows remain unchanged
- Dashboard reader changes — this leaf adds the producer only; 003 adds the envelope consumer

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modify | Add `step_telemetry_heartbeat` steps for started/progress/terminal lifecycle rows |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | Modify | Add serialized-diff gate suppressing no-change telemetry row writes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A `started` telemetry row with `label:"single"` appears in the ledger before the first iteration dispatch | Integration fixture: 1-iteration dry-run → assert row present in status ledger |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Single-loop rows parse identically to fan-out rows with a shared JSON schema validator | Parity test: validate a single-loop row and a fan-out row with the same schema → both pass without errors |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A single-executor deep-research run produces `started`, at least one `progress`, and a terminal row in the telemetry ledger; no duplicate writes when state is unchanged
- **SC-002**: `validate.sh --strict` on this folder exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Telemetry rows add ledger noise on high-frequency iteration steps | Low — serialized-diff gate suppresses no-change writes | Confirm gate is wired before shipping |
| Dependency | 004-run-now-control must use the lifecycle event name decided here | Medium — wrong name silently breaks run-now sentinel logic | Document canonical name explicitly in this spec before 004 is planned |

> **Note**: Tagged `med/quick-win` in research §5.5. No deep-rewrite variant. (Research: research.md §5.5, iter 28)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is the canonical lifecycle event name `iteration_started` (past tense, event-sourcing style) or `iteration_start` (present tense, command style)? Must be decided in this phase because 004-run-now-control depends on it.
- Should the `progress` row emit on every YAML step or only at iteration boundaries (start/end of each numbered iteration)?
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
