---
title: "Feature Specification: Cross-runtime goal hook capability probes (devin/cursor/pi)"
description: "Live per-runtime capability probes fixing the honest parity tier for the devin, cursor, and pi goal-hook adapters before any adapter code is written"
trigger_phrases:
  - "goal capability probes"
  - "devin stop hook blocking probe"
  - "cursor preToolUse refresh probe"
  - "pi turn end event probe"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/002-capability-probes"
    last_updated_at: "2026-07-28T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored Level 1 planning docs for phase 002 capability probes"
    next_safe_action: "Run the three live capability probes and record the matrix"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-002-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether Devin's Stop hook supports a blocking/continue decision (resolved by this phase)."
      - "Whether Pi's typed event surface offers a usable turn-end event (resolved by this phase)."
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Cross-runtime goal hook capability probes (devin/cursor/pi)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-28 |
| **Branch** | `skilled/v4.0.0.0` (direct, per parent packet) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `001-goal-core-and-state` |
| **Successor** | `003-devin-goal-hooks` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phases 003-005 of the parent packet each need to build a per-runtime goal-hook adapter (devin, cursor, pi), but two of the three verify/continue mechanisms they would rely on are unproven: Devin's `Stop` hook schema visually mirrors Claude's `decision:"block"` continuation contract, but this has never been tested against Devin live; Pi's installed `types.d.ts` event surface has not been read to confirm a usable turn-end/agent-loop event exists at all. Cursor's injection cadence is also only partially confirmed (`sessionStart` fires once; whether `preToolUse` can deliver an `agent_message` refresh is unconfirmed). Building adapter code against an assumed capability that turns out not to exist would waste the work and ship a hook that silently no-ops.

### Purpose

Run three concrete, live capability probes — one per runtime — and record their results as a capability matrix in this spec, fixing each of phases 003/004/005's honest parity tier (injection-only vs. injection-plus-verify/continue) before any adapter code is written.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Probe (a): read Pi's installed `types.d.ts` event-type list to identify a usable turn-end/agent-loop event for verify/continue logic.
- Probe (b): test live whether Devin's `Stop` hook supports a blocking/continue decision (whether `decision:"block"` forces continuation, mirroring Claude's schema — unproven for Devin, not to be assumed).
- Probe (c): confirm live whether Cursor's `preToolUse` hook can deliver an `agent_message` refresh beyond the one-shot `sessionStart` injection (prompt-submit is already confirmed non-delivery, same workaround class as `spec-gate-prebind`).
- Recording the three probe results as a capability matrix embedded in this spec.md.

### Out of Scope

- Writing any devin/cursor/pi adapter code (phases 003, 004, 005) — explicitly gated on this phase's matrix landing first.
- Modifying `mk-goal.js` or its OpenCode-only session state.
- Modifying the shared goal-core state file introduced in phase 001 (this phase only reads runtime capability surfaces, it does not touch goal state).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `002-capability-probes/spec.md` | Modify | Capability-matrix table populated with the three probe results |
| `002-capability-probes/implementation-summary.md` | Modify | Probe evidence and per-runtime tier decision recorded after probes run |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Probe (a): confirm Pi's turn-end/agent-loop event availability. | Pi's installed `types.d.ts` is read directly (not assumed from docs); a usable turn-end or agent-loop event is either named and cited by file:line, or the matrix records "no usable event" honestly. |
| REQ-002 | Probe (b): confirm Devin's `Stop` hook block/continue behavior live. | A live Devin `Stop` hook returning `decision:"block"` is exercised against a real Devin session; the matrix records whether continuation was actually forced, not assumed from schema similarity to Claude. |
| REQ-003 | Probe (c): confirm Cursor's realistic injection cadence live. | A live Cursor session with a `preToolUse` hook attempting an `agent_message` refresh is exercised; the matrix records whether the refresh was actually delivered, distinct from the already-confirmed `sessionStart`-once / prompt-submit-never baseline. |
| REQ-004 | No adapter code precedes this phase's matrix. | Phases 003/004/005 spec docs stay `Planned` and unscoped for verify/continue until this phase's matrix is recorded. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Record probe evidence, not just conclusions. | Each probe result cites what was actually run/read (command, file:line, or session transcript reference) in `implementation-summary.md`. |
| REQ-006 | Carry the fixed tiers back into phases 003/004/005. | Once this phase completes, phases 003/004/005 scope sections are updated to reference the fixed tier rather than the still-open question. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three probes (a, b, c) have been run live or read directly against the real runtime artifact, with results recorded honestly (including "not supported" or "unconfirmed" outcomes).
- **SC-002**: The capability matrix below is fully populated with no `TBD` cells remaining.

### Capability Matrix (populated once probes run)

| Runtime | Injection Surface | Verify/Continue Support | Source Probe |
|---------|--------------------|--------------------------|---------------|
| Devin | `UserPromptSubmit` + `SessionStart` (confirmed live, prior session) | TBD — depends on probe (b): `Stop` hook `decision:"block"` continuation | Probe (b) |
| Cursor | `sessionStart` (confirmed, fires once) | TBD — `sessionEnd` verify confirmed available; `preToolUse` `agent_message` refresh depends on probe (c) | Probe (c) |
| Pi | `input` + `session_start` (confirmed live, prior session) | TBD — depends on probe (a): usable turn-end/agent-loop event in `types.d.ts` | Probe (a) |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 (goal core + shared state) — shares vocabulary, not code. | None if 001 slips; this phase does not import 001's code. | Probes read runtime capability surfaces only, independent of goal-core implementation status. |
| Dependency | Live access to Devin and Cursor sessions/auth for probes (b) and (c). | Cannot complete REQ-002/REQ-003 without live session access. | If access is blocked, record the blocker explicitly and default that runtime's tier to injection-only (the conservative outcome) rather than guessing. |
| Risk | Pi's `types.d.ts` may not ship the full event surface used internally, understating what's actually available. | Probe (a) could under-report Pi's true capability. | Cross-check any promising event name against Pi's `dist/core/` runtime behavior if the type declaration alone is ambiguous. |
| Blocks | Phases 003 (devin), 004 (cursor), 005 (pi). | Their spec scope for verify/continue cannot be finalized until this phase's matrix lands. | This phase is explicitly ordered before 003-005 in the parent packet's phase map. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether Devin's `Stop` hook supports a blocking/continue decision (resolved by this phase's probe (b); determines 003's parity tier).
- Whether Pi's typed event surface offers a usable turn-end event for verify/continue (resolved by this phase's probe (a); determines 005's parity tier).
<!-- /ANCHOR:questions -->
