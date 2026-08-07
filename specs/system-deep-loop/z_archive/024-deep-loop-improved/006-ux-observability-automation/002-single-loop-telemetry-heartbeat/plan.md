---
title: "Implementation Plan: Single-Loop Telemetry Heartbeat"
description: "Documents the completed single-executor telemetry heartbeat and serialized-diff gate work."
trigger_phrases:
  - "single loop telemetry"
  - "telemetry heartbeat"
  - "single executor telemetry"
  - "orchestration status parity"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/006-ux-observability-automation/002-single-loop-telemetry-heartbeat"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Single-Loop Telemetry Heartbeat

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research YAML command steps and TypeScript atomic-state helper |
| **Framework** | Deep-loop telemetry ledger compatible with fan-out status tooling |
| **Storage** | `orchestration-status.log` rows and serialized state-diff cache |
| **Testing** | Telemetry schema parity test, serialized-diff check, strict spec validation |

### Overview
This completed work added structured telemetry rows for single-executor deep-loop runs so lone research, review, and context passes appear in the same operational ledger as fan-out runs. It also added a serialized-diff gate in `atomic-state.ts` to suppress no-change telemetry writes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: single-executor runs were invisible to status-log tooling.
- [x] Success criteria measurable: `label:"single"` rows parse with the same schema as fan-out rows.
- [x] Dependencies identified: run-now control consumes the lifecycle event naming decided here.

### Definition of Done
- [x] `deep_research_auto.yaml` emits `started`, `progress`, and terminal rows for single runs.
- [x] Rows use `label:"single"` and fan-out-compatible gauges.
- [x] `atomic-state.ts` suppresses no-change telemetry writes through serialized diffing.
- [x] A parity test validates single-loop and fan-out rows through the same schema.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Producer parity: single-executor runs emit the same ledger-shaped lifecycle rows as fan-out runs, with a distinct `label` value and a state-diff guard to avoid duplicate noise.

### Key Components
- **`deep_research_auto.yaml`**: Adds `step_telemetry_heartbeat` rows for started, progress, and terminal states.
- **`atomic-state.ts`**: Serializes state and suppresses telemetry writes when the serialized state is unchanged.
- **Shared row schema**: Keeps single-loop rows parseable by existing fan-out status readers.

### Data Flow
At run start, progress checkpoints, and terminal completion, the YAML step emits status rows tagged `label:"single"`. Before a row is persisted, the atomic-state helper compares the serialized state with the last emitted representation and skips no-op writes. Dashboard tooling can then parse single-loop and fan-out rows through one schema.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep_research_auto.yaml` | Runs single-executor deep-research steps | Add `step_telemetry_heartbeat` | Ledger contains started, progress, terminal rows |
| `atomic-state.ts` | Persists atomic state updates | Add serialized-diff gate | No row emitted when serialized state is unchanged |
| Status ledger parser | Reads fan-out-shaped rows | Reuse schema for `label:"single"` rows | Single and fan-out fixtures both validate |
| Run-now successor | Consumes lifecycle event naming | Depend on this leaf's naming decision | Phase 004 can reuse the canonical event name |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and confirm telemetry producer scope.
- [x] Identify `deep_research_auto.yaml` and `atomic-state.ts` as changed surfaces.
- [x] Preserve fan-out row format and dashboard reader work as out of scope.

### Phase 2: Core Implementation
- [x] Add started telemetry rows for single-executor runs.
- [x] Add progress telemetry rows with fan-out-shaped gauges.
- [x] Add completed, failed, and stopped terminal rows.
- [x] Add `label:"single"` to distinguish producer mode.
- [x] Add serialized-diff gating in `atomic-state.ts`.

### Phase 3: Verification
- [x] Verify a one-iteration run emits a started row before first dispatch.
- [x] Verify single-loop and fan-out rows validate with the shared schema.
- [x] Verify no duplicate telemetry row is written when serialized state is unchanged.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Started/progress/terminal rows in the ledger | Deep-research YAML fixture |
| Parity | Single-loop and fan-out row schema | Shared JSON schema validator |
| State-diff | No-change telemetry suppression | `atomic-state.ts` unit fixture |
| Spec validation | Leaf packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing fan-out row schema | Internal | Complete | Single-loop rows cannot share dashboard tooling without schema parity |
| Canonical lifecycle event naming | Internal | Complete | Phase 004 run-now events depend on this naming decision |
| Unified envelope leaf 003 | Internal successor | Complete | Envelope normalization wraps these producer rows after parity exists |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Single-loop rows fail shared-schema validation, ledger noise increases from duplicate writes, or status tooling rejects the new rows.
- **Procedure**: Revert the `step_telemetry_heartbeat` additions and serialized-diff gate, restoring single-loop runs to their previous non-telemetry behavior.
<!-- /ANCHOR:rollback -->
