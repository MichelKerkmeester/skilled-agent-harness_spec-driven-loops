---
title: "Feature Specification: Phase 024 Devin Wrapper"
description: "Wire Devin output projection through the CLI-output wrapper: run Devin non-interactively via `devin -p`, route the printed output through the Devin runtime adapter into projectMessage(), re-render under the isProjectionEnabled() gate, and fail open to the byte-exact original."
trigger_phrases:
  - "devin-wrapper"
  - "devin cli output wrapper"
  - "devin -p print projection"
  - "devin runtime adapter wiring"
  - "devin projectMessage routing"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/024-devin-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Confirm the `devin -p` print-mode capture shape, then wire the adapter."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-024-devin-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Phase 024 Devin Wrapper

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 24 of 28 |
| **Predecessor** | `023-pi-wrapper` |
| **Successor** | `025-cursor-wrapper` |
| **Handoff Criteria** | With the flag on, a `devin -p` run shows the projected print output; with the flag off or on any failure it shows the byte-exact original; the adapter, gate, and fallback tests pass; Devin's single-turn print behaviour is confirmed from its CLI; and this phase passes strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This planned phase wires Devin through the Phase 020 CLI-output wrapper. Devin exposes only input, tool, and session-lifecycle hooks, and none of them rewrite the rendered answer, so the wrapper is the only integration path. The phase runs Devin non-interactively via `devin -p`, routes the captured print output through the Devin runtime adapter into `projectMessage()`, re-renders the result, gates projection on `isProjectionEnabled()`, and fails open to the byte-exact original.

**Scope boundary**: Wire the Devin runtime surface only. The phase consumes the Phase 020 wrapper seam, the Phase 018 `projectMessage()` entrypoint, and the Phase 016 enablement gate. Do not build the other wrapper-based runtimes or the wrapper seam itself, which belong to the surrounding runtime-wiring phases.

**Dependencies**:

- Phase 020 `cli-output-wrapper` (prerequisite), which owns the capture, re-render, and fail-open seam this phase adapts
- Phase 018 `projectMessage()` entrypoint, which the wrapper calls for every accepted print output
- The Phase 016 default-off enablement gate `isProjectionEnabled()`
- The existing Devin runtime adapter at `.opencode/skills/sk-communication/cli-communication-projection/src/runtimes/devin.ts`, which maps Devin ACP events onto the assembler event envelope shape

**Deliverables**:

- A `devin -p` print-mode capture that runs non-interactively, single-turn, with a `--` prompt separator and `/dev/null` stdin
- Devin print output routed through `devinRuntimeAdapter.adapt()` into the assembler event envelope and then into `projectMessage()`
- Re-render gated on `isProjectionEnabled()`, failing open to the byte-exact original on any non-accept terminal
- Tests covering the adapter mapping, the gate matrix, and the fallback path
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

- Devin exposes only input, tool, and session-lifecycle hooks, so no hook rewrites the rendered assistant answer; the CLI-output wrapper is the only integration path.
- A naive wrapper that projects the printed output would lose the byte-exact original, breaking the exact-original fallback that the projection contract requires.
- Devin's single-turn print behaviour is a real constraint: the wrapper must confirm how `devin -p` prints and exits before it relies on the captured shape.

### Purpose

Make Devin the next working wrapper runtime: with the flag on, a `devin -p` run shows the projected print output; with the flag off or on any failure it shows the byte-exact original.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A `devin -p` print-mode capture in the wrapper that runs non-interactively and single-turn, uses `--` before the prompt, redirects stdin from `/dev/null`, and captures stdout.
- Routing the captured print output through the Devin runtime adapter (`devinRuntimeAdapter.adapt()`) onto the assembler event envelope shape.
- Feeding the adapted event into the Phase 018 `projectMessage()` entrypoint and re-rendering the accepted projection.
- Gating projection on `isProjectionEnabled()` and failing open to the byte-exact original on any error, throw, timeout, or non-accept terminal.
- A pre-implementation probe that confirms Devin's single-turn print behaviour from its CLI before the adapter mapping is relied on.
- Tests covering the adapter mapping, the gate matrix, and the fallback path.

### Out of Scope

- Any change to the Phase 020 wrapper seam, the Phase 018 entrypoint, or the Phase 016 enablement gate.
- Building the other wrapper-based runtimes (Claude, Codex, Pi, Cursor), which belong to the surrounding runtime-wiring phases.
- Rewriting canonical transcripts, events, tool inputs, or tool results.
- Any hosted projection egress beyond what `projectMessage()` already performs.

### Technical Approach

The wrapper captures a single `devin -p` run's stdout, wraps it in a Devin runtime envelope with an `agent-message-chunk` event, calls `devinRuntimeAdapter.adapt()` to map it onto the assembler event envelope, feeds the mapped event into `projectMessage()`, and re-renders the projection only when `isProjectionEnabled()` passes and every terminal is an accept. Any other outcome restores the byte-exact original.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-communication/cli-communication-projection/src/runtime/wrappers/devin.ts` | Create | Devin print-mode capture and adapter routing for the Phase 020 wrapper |
| `.opencode/skills/sk-communication/cli-communication-projection/test/runtime/wrappers/devin.test.ts` | Create | Adapter, gate, and fallback tests for the Devin wrapper |
| `024-devin-wrapper/` | Create | Record the planned Level-2 packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Map Devin's `-p` output onto the assembler event shape. | The captured print-mode stdout wrapped in a Devin runtime envelope maps through `devinRuntimeAdapter.adapt()` to a `mapped` event envelope in the assembler shape. |
| REQ-002 | Confirm Devin's single-turn print behaviour from its CLI before relying on it. | A live `devin -p` probe confirms non-interactive single-turn stdout and exit, the `--` prompt separator, and `/dev/null` stdin redirection before the adapter mapping is built on. |
| REQ-003 | Route the captured output into `projectMessage()`. | The adapted event is fed into the Phase 018 `projectMessage()` entrypoint in the frozen stage order. |
| REQ-004 | Gate projection on `isProjectionEnabled()`. | When `isProjectionEnabled()` is `false`, the wrapper returns the byte-exact original without any provider call. |
| REQ-005 | Fail open to the byte-exact original. | Any error, throw, timeout, or non-accept terminal leaves the print output byte-exact and never throws into the session. |
| REQ-006 | Test the adapter, gate, and fallback. | Tests under `test/runtime/wrappers/devin.test.ts` cover the adapter mapping, the gate matrix, and the fallback path and pass with the package gate. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Keep canonical bytes unchanged. | Canonical transcripts, events, tool inputs, and tool results remain byte-unchanged; the wrapper touches only the rendered print surface. |
| REQ-008 | Re-render the accepted projection into the Devin presentation surface. | The accepted projection replaces the rendered assistant output while the exact original remains restorable from wrapper-side state. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the flag on, a `devin -p` run shows the projected print output.
- **SC-002**: With the flag off, the run shows the byte-exact original print output.
- **SC-003**: On any failure, the run shows the byte-exact original.
- **SC-004**: The adapter, gate, and fallback tests pass.
- **SC-005**: Phase 024 strict validation reports zero errors and warnings.

### Acceptance Scenarios

1. **Given** the enablement flag on, **When** a `devin -p` run completes, **Then** the printed output is projected.
2. **Given** the enablement flag off, **When** the wrapper runs, **Then** the printed output remains byte-identical.
3. **Given** a projection error or a non-accept terminal, **When** the wrapper completes, **Then** the byte-exact original shows.
4. **Given** the Phase 020 wrapper seam unavailable or a malformed Devin event, **When** the wrapper runs, **Then** it fails open to the exact original.
5. **Given** a live Devin CLI, **When** the single-turn probe runs, **Then** `devin -p` prints once, exits, and honours the `--` separator.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 020 CLI-output wrapper | High | The wrapper is the only integration path for Devin; the phase consumes its seam without modifying it. |
| Dependency | Phase 018 `projectMessage()` entrypoint | High | The wrapper calls the entrypoint only; the entrypoint owns the stage order and fallback. |
| Dependency | Phase 016 `isProjectionEnabled()` gate | High | Gate first, so a disabled flag produces no provider call. |
| Risk | Devin's print-mode capture shape changes across versions | High | Confirm the single-turn print behaviour with a live probe before relying on the captured shape. |
| Risk | A naive projection loses the byte-exact original | High | Hold the exact original in wrapper-side state and restore it on any non-accept path. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The wrapper adds bounded latency: the capture, mapping, and re-render resolve locally with no blocking round trips before the seam decides.
- **NFR-P02**: Wrapper-side state is bounded per captured run and cleared when the run lifecycle ends.

### Security and Privacy

- **NFR-S01**: No message content is persisted beyond in-memory wrapper-side state.
- **NFR-S02**: The wrapper and packet contain no credentials, message content, or protected spans.

### Reliability

- **NFR-R01**: Every terminal state maps deterministically to a projection or the byte-exact original, with no ambiguous fail-open state.
- **NFR-R02**: The wrapper fails open: any error leaves the print output byte-exact and never throws into the session.

## 8. EDGE CASES

- The enablement flag is off: byte-exact original, no entrypoint call.
- `devin -p` exits non-zero or prints nothing: the wrapper fails open to the exact original.
- The Devin event does not map (unsupported path, invalid event, incompatible version): exact-original with the adapter reason code.
- `projectMessage()` throws, times out, or returns a non-accept terminal: byte-exact original.
- The captured output has no restorable original: the wrapper leaves the rendered surface untouched.
- A Devin version change breaks the single-turn print shape: the live probe is re-run before the adapter mapping is relied on.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 13/25 | One print-mode capture, one adapter route, one re-render path, and one test suite |
| Risk | 16/25 | Byte-exact restore and fail-open guarantees on a live Devin CLI |
| Research | 10/20 | Devin's single-turn print behaviour needs a live CLI probe before it is relied on |
| **Total** | **39/70** | **Level 2** |

## 10. OPEN QUESTIONS

No unresolved question blocks planning. Devin's `-p` print-mode capture shape is a pre-implementation validation step (REQ-002), not an open design question.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
