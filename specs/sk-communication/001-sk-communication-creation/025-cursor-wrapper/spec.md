---
title: "Feature Specification: Phase 025 Cursor Output Wrapper"
description: "Wire Cursor output projection through the Phase 020 CLI-output wrapper: run cursor-agent non-interactively, capture its stdout, route it through the Cursor runtime adapter into projectMessage(), re-render, gate on isProjectionEnabled(), and fail open to the byte-exact original."
trigger_phrases:
  - "cursor-wrapper"
  - "cursor output wrapper"
  - "cursor-agent stdout projection"
  - "CLI-output wrapper cursor"
  - "cursor runtime adapter seam"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/025-cursor-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Execute T001 by confirming the cursor-agent non-interactive print flag from its CLI."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-025-cursor-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "Cursor exposes only input, tool, and lifecycle hooks, so it must route through the Phase 020 CLI-output wrapper."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Phase 025 Cursor Output Wrapper

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

Cursor is the last supported runtime with no native output-transform hook: it exposes only input, tool, and lifecycle hooks, so none of them can rewrite the rendered assistant answer. It therefore uses the Phase 020 CLI-output wrapper. This phase wires Cursor into that wrapper seam: run `cursor-agent` in its non-interactive mode, capture its rendered stdout as the canonical original, route the capture through the Cursor runtime adapter (`cursorRuntimeAdapter`) so it maps onto the assembler event shape, hand the adapted event to the Phase 018 `projectMessage()` entrypoint, re-render the projected message when accepted, and fail open to the byte-exact original on any off, error, or non-accept terminal.

**Key decision**: the Phase 020 CLI-output wrapper is the integration seam, and the capture, adapt, project, re-render path follows the Phase 017 seam contract exactly, with the exact-original fallback held through `cursorRuntimeAdapter`.

**Critical dependency**: the Phase 020 CLI-output wrapper (the seam that the other wrapper-based runtimes already use) and the Cursor runtime adapter plus the Phase 018 `projectMessage()` entrypoint. The cursor-agent non-interactive print flag must be confirmed from the CLI before the wrapper relies on it.

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
| **Phase** | 25 of 28 |
| **Predecessor** | `024-devin-wrapper` |
| **Successor** | `026-capability-and-privacy-gating` |
| **Handoff Criteria** | With the flag on, a non-interactive `cursor-agent` run renders the projected output; with the flag off or on any capture, adapter, gate, or entrypoint failure it renders the byte-exact original; the adapter, gate, and fallback tests pass; and this phase passes strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This planned phase delivers the Cursor integration of the CLI-output wrapper and the reference wrapper pattern for a runtime with no native output-transform hook.

**Scope boundary**: Wire Cursor into the existing Phase 020 CLI-output wrapper and its seam only. The wrapper, the Phase 018 entrypoint, the Cursor runtime adapter, and the Phase 016 enablement gate are consumed, never modified. This packet does not build the wrapper itself or the other wrapper-based runtimes.

**Dependencies**:

- Phase 020 CLI-output wrapper (hard blocker), which owns the capture and re-render seam that this phase wires Cursor into
- The Phase 006 Cursor runtime adapter `cursorRuntimeAdapter`, which maps cursor-agent stdout onto the assembler event shape
- The Phase 018 `projectMessage()` entrypoint, which owns the projection stage order and the exact-original fallback
- The Phase 016 default-off enablement gate `isProjectionEnabled()` and the Phase 017 seam contract
- The cursor-agent CLI surface, whose non-interactive print flag must be confirmed before the wrapper relies on it

**Deliverables**:

- The Cursor seam wiring that captures non-interactive `cursor-agent` stdout and routes it through the Cursor runtime adapter
- Projection gated by `isProjectionEnabled()`, re-rendered when accepted, and failing open to the byte-exact original on any off, error, or non-accept terminal
- Tests covering the adapter mapping, the enablement gate, and the fail-open fallback
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

- Cursor exposes only input, tool, and lifecycle hooks, and none of them rewrite the rendered assistant answer, so projection cannot hook the rendered output natively. [SOURCE: Phase 017 feasibility matrix, runtime-wiring-feasibility-and-contract]
- The Cursor runtime adapter maps Cursor ACP events onto the assembler event envelope, but no seam yet captures `cursor-agent` rendered stdout, so the adapter's mapping is never exercised against real wrapper output. [SOURCE: packages/runtime cursor adapter and Phase 006 evidence]
- The wrapper relies on `cursor-agent` running non-interactively and printing the rendered message, but that flag is assumed rather than confirmed, so the capture could silently rely on an unsupported invocation. [SOURCE: Phase 017 seam contract pre-check rule]

### Purpose

Make a non-interactive `cursor-agent` run project its rendered output through the Phase 020 wrapper seam, gated by `isProjectionEnabled()`, re-rendered when accepted, and failing open to the byte-exact original on any off, error, or non-accept terminal.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The Cursor seam wiring into the Phase 020 CLI-output wrapper that captures non-interactive `cursor-agent` stdout as the canonical original.
- Routing the captured stdout through the Cursor runtime adapter so it maps onto the assembler event shape for `projectMessage()`.
- A pre-implementation step that confirms the `cursor-agent` non-interactive print flag from its CLI before the wrapper relies on it.
- Projection gated by `isProjectionEnabled()`, re-rendered when accepted, and failing open to the byte-exact original on any off, error, or non-accept terminal.
- Tests covering the adapter mapping, the enablement gate, and the fail-open fallback.

### Out of Scope

- Any change to the Phase 020 wrapper, the Phase 018 entrypoint, the Cursor runtime adapter, or the Phase 016 enablement gate.
- Building the other wrapper-based runtimes (Claude, Codex, Pi, Devin), which belong to their own phases.
- Rewriting canonical transcripts, events, tool inputs, or tool results.
- Any hosted projection egress beyond what `projectMessage()` already performs.

### Technical Approach

Capture the rendered assistant message from a non-interactive `cursor-agent` run through the Phase 020 wrapper, adapt the captured stdout through `cursorRuntimeAdapter` onto the assembler event shape, call `projectMessage()`, and re-render the projection only on an accept terminal. Every other terminal returns the byte-exact original through the seam.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Phase 020 wrapper Cursor seam | Modify | Wire the Cursor runtime adapter and the capture-to-project-to-render path |
| Cursor seam tests | Create | Adapter mapping, enablement gate, and fail-open fallback coverage |
| `025-cursor-wrapper/` | Create | Record the planned Level-2 packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Wire Cursor into the Phase 020 CLI-output wrapper. | A non-interactive `cursor-agent` run captures its rendered stdout as the canonical original and routes it through the Cursor seam. |
| REQ-002 | Confirm the `cursor-agent` non-interactive print flag. | The wrapper relies only on a print/non-interactive flag confirmed from the `cursor-agent` CLI surface before implementation, not on an assumed flag. |
| REQ-003 | Map cursor-agent stdout onto the assembler event shape. | The Cursor runtime adapter maps the captured stdout event onto the assembler event envelope, retaining the stdout as the exact original. |
| REQ-004 | Gate projection behind `isProjectionEnabled()`. | The seam calls `isProjectionEnabled()` before projecting; when it returns `false`, the byte-exact original is re-rendered. |
| REQ-005 | Call the Phase 018 entrypoint. | The seam calls `projectMessage()` and honours its exact-original fallback for every non-accept terminal. |
| REQ-006 | Fail open on any error. | Any capture, adapter, gate, or entrypoint error re-renders the byte-exact original and never a partial transform. |
| REQ-007 | Re-render the projected output. | When the entrypoint accepts, the seam re-renders cursor-agent output with the projected message. |
| REQ-008 | Test the adapter, gate, and fallback. | Tests cover the Cursor adapter mapping, the `isProjectionEnabled()` gate, and the fail-open fallback. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Keep canonical bytes unchanged. | Canonical transcripts, events, tool inputs, and tool results remain byte-unchanged; the seam touches only the rendered display surface. |
| REQ-010 | Honor the Phase 017 seam contract. | The seam applies the enablement gate, the fail-open exact-original fallback, canonical-bytes preservation, and the per-runtime pre-checks from the Phase 017 contract. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the flag on, a non-interactive `cursor-agent` run renders the projected output.
- **SC-002**: With the flag off, the run renders the byte-exact original.
- **SC-003**: On any capture, adapter, gate, or entrypoint failure, the run renders the byte-exact original.
- **SC-004**: The adapter, gate, and fallback tests pass.

### Acceptance Scenarios

1. **Given** the enablement flag on, **When** a non-interactive `cursor-agent` run renders a message, **Then** the wrapper re-renders the projected output.
2. **Given** the enablement flag off, **When** the seam runs, **Then** the byte-exact original is re-rendered.
3. **Given** a capture, adapter, gate, or entrypoint error, **When** the seam completes, **Then** the byte-exact original is re-rendered and never a partial transform.
4. **Given** the `cursor-agent` CLI, **When** its non-interactive print flag is inspected, **Then** the wrapper relies only on the confirmed flag.
5. **Given** the Cursor adapter tests, **When** the seam is exercised, **Then** the adapter mapping, gate, and fallback are covered and pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 020 CLI-output wrapper | High | This phase is blocked until the wrapper lands; the seam consumes it, never rebuilds it. |
| Dependency | Confirmed `cursor-agent` print flag | High | Confirm the flag from the CLI in setup before implementation relies on it. |
| Risk | The adapter mapping misses real wrapper output | High | Exercise the mapping against captured stdout in tests, not only synthetic ACP events. |
| Risk | The seam projects when disabled | High | Gate on `isProjectionEnabled()` and test the disabled matrix. |
| Risk | A wrapper error re-renders a partial transform | High | Fail open: every error terminal re-renders the byte-exact original. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The Cursor seam must not add latency beyond the Phase 018 entrypoint's own bounded execution on the projection path.
- **NFR-P02**: The fallback path is local and synchronous with no network access.

### Security and Privacy

- **NFR-S01**: Capability and privacy pre-checks run before any hosted routing, matching the Phase 017 seam contract.
- **NFR-S02**: The seam and packet contain no credentials, message content, or protected spans.

### Reliability

- **NFR-R01**: Every terminal state maps deterministically to a projection or the byte-exact original, with no ambiguous fail-open state.
- **NFR-R02**: The seam fails open: any error re-renders the byte-exact original and never throws into the wrapper.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- The enablement flag is off: byte-exact original, no entrypoint call.
- The `cursor-agent` print flag is absent or renamed in the pinned version: capture is blocked until the flag is re-confirmed.
- `cursor-agent` produces no stdout or a malformed stream: the seam fails open to the byte-exact original.
- `projectMessage()` throws, times out, or returns a non-accept terminal: byte-exact original.
- The captured stdout does not map onto the assembler event shape: `cursorRuntimeAdapter` returns the exact-original terminal.
- The seam is invoked twice for the same session message: the original capture is retained for byte-exact restore.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | One wrapper seam, one adapter mapping, and one test suite |
| Risk | 18/25 | Exact-original fallback and a flag that must be confirmed from the CLI |
| Research | 11/20 | Confirming the cursor-agent non-interactive print flag and its stdout shape |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

No unresolved question blocks planning. The exact `cursor-agent` version and print-flag spelling are recorded as versioned seam inputs at validation time, not open design questions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
