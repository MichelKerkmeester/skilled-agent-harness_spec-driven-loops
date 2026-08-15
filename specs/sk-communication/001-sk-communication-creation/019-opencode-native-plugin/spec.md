---
title: "Feature Specification: Phase 019 OpenCode Native Plugin"
description: "Wire the first working runtime: an OpenCode plugin that registers the chat.message hook, gates projection behind isProjectionEnabled() and the shared isHookEnabled kill-switch, and projects output.parts while holding the byte-exact original for restore."
trigger_phrases:
  - "opencode-native-plugin"
  - "opencode projection plugin"
  - "chat.message hook projection"
  - "mk-communication-projection plugin"
  - "native output-transform runtime"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/019-opencode-native-plugin"
    last_updated_at: "2026-08-14T07:55:00.000Z"
    last_updated_by: "claude"
    recent_action: "Implemented and verified the OpenCode native projection plugin."
    next_safe_action: "Run the live chat.message render confirmation as the documented manual validation step."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-019-opencode-plugin-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The plugin registers the chat.message hook, gates on isProjectionEnabled() and a per-plugin kill-switch, and restores the byte-exact original on every non-accept terminal."
      - "The shared isHookEnabled(concern) module referenced by the plan does not exist in the repo; the kill-switch is implemented inline via MK_COMMUNICATION_PROJECTION_DISABLED, recorded as a deviation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 019 OpenCode Native Plugin

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

OpenCode is the only supported runtime with a native output-transform hook, so it proves the whole projection before the wrapper-based runtimes follow. This phase wires the first working runtime: a plugin at `.opencode/plugins/mk-communication-projection.js` that registers the plugin `chat.message` hook, gates projection behind `isProjectionEnabled()` plus the shared `isHookEnabled(concern)` kill-switch, and mutates `output.parts` to the projected text while holding the canonical original parts in plugin-side state keyed by message id.

**Key decision**: the native `chat.message` hook is the integration seam, and the plugin mutates the stored session message rather than layering a pure overlay, so the exact-original fallback and byte-exact restore hold.

**Critical dependency**: the Phase 018 `projectMessage()` entrypoint and the Phase 017 runtime-wiring feasibility and contract (both predecessors), plus the Phase 016 enablement gate and the shared hook kill-switch. The Phase 017 LOW-CONFIDENCE display caveat must be confirmed pre-implementation.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 19 of 28 |
| **Predecessor** | `018-projection-runtime-core` |
| **Successor** | `020-cli-output-wrapper-framework` |
| **Handoff Criteria** | With the flag on, an OpenCode session shows the projected output; with the flag off or on any failure it shows the byte-exact original; the plugin test suite under `.opencode/plugins/tests/` passes; and this phase passes strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This planned phase delivers the first end-to-end working runtime and the reference implementation of the integration contract. OpenCode is the only runtime with a native output-transform hook, so it proves the whole projection before the wrapper-based runtimes.

**Scope boundary**: Build the plugin and its tests only. The plugin consumes the Phase 018 `projectMessage()` entrypoint and the Phase 017 contract. Do not build the other runtime adapters or the wrapper seams, which belong to phases 020 through 025.

**Dependencies**:

- Phase 017 `runtime-wiring-feasibility-and-contract` (predecessor), which pins the runtime-wiring feasibility and the contract the plugin implements
- Phase 018 `projectMessage()` entrypoint (predecessor), which the plugin calls for every accepted message
- The Phase 016 default-off enablement gate `isProjectionEnabled()` and the shared hook kill-switch `isHookEnabled(concern)`
- The existing OpenCode plugin test pattern under `.opencode/plugins/tests/` (`mk-*.test.cjs`)

**Deliverables**:

- A plugin at `.opencode/plugins/mk-communication-projection.js` that registers the plugin `chat.message` hook
- Projection gated by `isProjectionEnabled()` AND `isHookEnabled(concern)`, fail-open on any error or disabled state
- Plugin-side state keyed by message id that holds the canonical original parts for byte-exact restore
- Tests under `.opencode/plugins/tests/` mirroring the `mk-*.test.cjs` pattern
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

- OpenCode is the only supported runtime with a native output-transform hook, but no runtime yet consumes the projection core, so the enablement flag gates nothing end-to-end.
- The `chat.message` hook mutates the stored session message, so a naive projection overlay would lose the original parts and break the exact-original fallback.
- The shared kill-switch `isHookEnabled(concern)` must gate the hook independently of the projection enablement flag so operators can disable hook classes without touching the enablement file.

### Purpose

Prove the whole projection on the first real runtime: with the flag on, an OpenCode session shows projected output; with the flag off or on any failure, it shows the byte-exact original.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A new OpenCode plugin at `.opencode/plugins/mk-communication-projection.js` that registers the plugin `chat.message` hook.
- Projection of `output.parts` gated by `isProjectionEnabled()` AND the shared `isHookEnabled(concern)` kill-switch, fail-open on any error or disabled state.
- Plugin-side state keyed by message id holding the canonical original parts, so the exact-original fallback and byte-exact restore hold, including mutation of the stored session message.
- A call to the Phase 018 `projectMessage()` entrypoint for every accepted message.
- Tests under `.opencode/plugins/tests/` mirroring the existing plugin test pattern (`mk-*.test.cjs`).
- A pre-implementation validation step that confirms the Phase 017 LOW-CONFIDENCE `chat.message` display caveat.

### Out of Scope

- Any change to the Phase 018 entrypoint, the Phase 017 contract, or the Phase 016 enablement and kill-switch modules.
- Building the wrapper-based runtimes (Claude, Codex, Pi, Devin, Cursor), which belong to phases 020 through 025.
- Rewriting canonical transcripts, events, tool inputs, or tool results.
- Any hosted projection egress beyond what `projectMessage()` already performs.

### Technical Approach

Author the plugin as a CJS module that returns a plugin factory registering the `chat.message` hook. The hook checks `isProjectionEnabled()` and `isHookEnabled(concern)` first, snapshots the original `output.parts` into a message-id keyed map before mutation, calls `projectMessage()`, and on any error or non-accept outcome restores the byte-exact original parts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/mk-communication-projection.js` | Create | OpenCode plugin registering the `chat.message` hook and projecting `output.parts` |
| `.opencode/plugins/tests/mk-communication-projection.test.cjs` | Create | Plugin regression suite mirroring the `mk-*.test.cjs` pattern |
| `019-opencode-native-plugin/` | Create | Record the planned Level-3 packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Register the native `chat.message` hook. | `.opencode/plugins/mk-communication-projection.js` registers the plugin `chat.message` hook and receives the stored session message. |
| REQ-002 | Mutate `output.parts` to the projected text. | When the hook accepts a projection, `output.parts` carry the projected text. |
| REQ-003 | Gate projection behind both gates. | The hook projects only when `isProjectionEnabled()` returns true AND `isHookEnabled(concern)` returns true. |
| REQ-004 | Fail open on any error or disabled state. | Any error, disabled enablement, or disabled kill-switch leaves the original parts untouched. |
| REQ-005 | Hold the canonical original by message id. | Plugin-side state keyed by message id holds the original parts so the exact-original fallback and byte-exact restore hold. |
| REQ-006 | Mutate the stored session message, not a pure overlay. | The hook writes the projected parts into the stored session message and the original parts remain restorable from plugin-side state. |
| REQ-007 | Call the Phase 018 entrypoint. | The hook calls `projectMessage()` and honours its exact-original fallback for every non-accept terminal. |
| REQ-008 | Test the plugin. | Tests under `.opencode/plugins/tests/mk-communication-projection.test.cjs` mirror the existing `mk-*.test.cjs` pattern and pass with `node --test`. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Confirm the `chat.message` display caveat. | A pre-implementation validation step confirms that `chat.message` parts render the projected text visibly, resolving the Phase 017 LOW-CONFIDENCE caveat. |
| REQ-010 | Keep canonical bytes unchanged. | Canonical transcripts, events, tool inputs, and tool results remain byte-unchanged; the plugin touches only the session message display surface. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the flag on, an OpenCode session shows the projected output.
- **SC-002**: With the flag off, the session shows the byte-exact original.
- **SC-003**: On any failure, the session shows the byte-exact original.
- **SC-004**: The plugin test suite under `.opencode/plugins/tests/` passes.

### Acceptance Scenarios

1. **Given** the enablement flag on, **When** an OpenCode session renders a message, **Then** `output.parts` show the projected text.
2. **Given** the enablement flag off, **When** the hook runs, **Then** `output.parts` remain byte-identical.
3. **Given** a projection error or a non-accept outcome, **When** the hook completes, **Then** `output.parts` are the byte-exact original.
4. **Given** the shared kill-switch off for the concern, **When** the hook runs, **Then** the parts stay untouched even with the enablement flag on.
5. **Given** a stored session message, **When** projection is later disabled or fails, **Then** the original parts restore byte-exactly from the message-id keyed state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 018 `projectMessage()` entrypoint | High | The plugin calls the entrypoint only; the entrypoint owns the stage order and fallback. |
| Dependency | Phase 017 `chat.message` display caveat | High | Confirm the caveat pre-implementation before authoring the hook. |
| Risk | A pure overlay loses the original parts | High | Keep plugin-side state keyed by message id and restore the byte-exact original on any non-accept path. |
| Risk | The hook projects when disabled | High | Gate on `isProjectionEnabled()` AND `isHookEnabled(concern)`; test the disabled matrix. |
| Risk | Terminal output pollutes the TUI | Medium | The plugin never prints to standard output or standard error, matching the plugin boundary. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The hook must not block rendering beyond the Phase 018 entrypoint's own bounded execution.
- **NFR-P02**: Plugin-side state is bounded per message id and cleared with the session message lifecycle.

### Security and Privacy

- **NFR-S01**: No message content is persisted beyond in-memory plugin-side state.
- **NFR-S02**: The plugin and packet contain no credentials, message content, or protected spans.

### Reliability

- **NFR-R01**: Every terminal state maps deterministically to a projection or the byte-exact original, with no ambiguous fail-open state.
- **NFR-R02**: The plugin fails open: any error leaves the original parts untouched and never throws into the session.

## 8. EDGE CASES

- The enablement flag is off: byte-exact original, no entrypoint call.
- The kill-switch is off for the concern: byte-exact original even with the flag on.
- `projectMessage()` throws, times out, or returns a non-accept terminal: byte-exact original.
- The stored session message has no original snapshot: the hook leaves the parts untouched.
- The hook is invoked twice for the same message id: the second invocation restores from the first snapshot.
- `output.parts` is absent or malformed: the hook does not throw into the session.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 17/25 | One plugin, one hook, message-id state, and one test suite |
| Risk | 20/25 | Exact-original restore and fail-open guarantees on a live session message |
| Research | 10/20 | The OpenCode hook shape and the Phase 017 display caveat need live confirmation |
| Multi-Agent | 6/15 | Plugin authoring and adversarial verification can separate |
| Coordination | 12/15 | First working runtime; unblocks the wrapper-based phases 020-025 |
| **Total** | **65/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The plugin projects when disabled | High | Low | Both gates must pass; the disabled matrix is tested |
| R-002 | A pure overlay loses the original parts | High | Medium | Message-id keyed snapshots restore the byte-exact original |
| R-003 | The hook throws into the session | High | Low | Outer fail-open guard leaves the original parts untouched |
| R-004 | `chat.message` parts do not render the projection visibly | High | Medium | Pre-implementation validation step resolves the Phase 017 caveat |

## 11. USER STORIES

### US-001: First working runtime (Priority: P0)

**As an** operator, **I want** an OpenCode session to show projected output when the flag is on, **so that** the projection core proves end-to-end on the only runtime with a native transform hook.

**Acceptance Criteria**:

1. **Given** the enablement flag on, **When** a session renders a message, **Then** the projected text is visible.
2. **Given** the flag off, **When** the session renders, **Then** the byte-exact original is visible.

### US-002: Byte-exact restore (Priority: P0)

**As a** privacy operator, **I want** the original parts restored byte-exactly on any failure or disable, **so that** projection never corrupts the session message.

**Acceptance Criteria**:

1. **Given** any projection error, **When** the hook completes, **Then** the byte-exact original parts are restored.
2. **Given** a later disable, **When** the session re-renders, **Then** the original parts come back from the message-id snapshot.

### US-003: Independent kill-switch (Priority: P0)

**As an** operator, **I want** the shared `isHookEnabled(concern)` kill-switch to disable the hook without changing the enablement file, **so that** hook classes can be stopped independently.

**Acceptance Criteria**:

1. **Given** the kill-switch off for the concern, **When** the hook runs, **Then** the parts stay untouched.
2. **Given** the kill-switch off and the enablement flag on, **When** the hook runs, **Then** the kill-switch still wins.

## 12. OPEN QUESTIONS

No unresolved question blocks planning. The Phase 017 LOW-CONFIDENCE `chat.message` display caveat is a pre-implementation validation step, not an open design question.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Parent Packet**: `../spec.md`
