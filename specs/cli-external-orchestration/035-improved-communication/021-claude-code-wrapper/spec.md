---
title: "Feature Specification: Phase 021 Claude Code Wrapper"
description: "Record the planned wiring of Claude Code headless output projection through the CLI-output wrapper, the Claude stream-json adapter mapping, and the enablement-gated fail-open exact-original fallback."
trigger_phrases:
  - "claude-code-wrapper"
  - "claude code headless projection"
  - "stream-json adapter"
  - "Claude output projection wrapper"
  - "claude -p output projection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/021-claude-code-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Execute T001 to wire the Claude stream-json adapter mapping onto the assembler event shape."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-021-claude-code-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Claude Code exposes no output-transform hook, so headless output is intercepted through the Phase 020 CLI-output wrapper."
      - "The interactive TUI is explicitly out of scope; only headless and print output are interceptable."
      - "The phase wires the Claude runtime adapter, routes the stream through projectMessage(), gates on isProjectionEnabled(), and fails open to the byte-exact original."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Phase 021 Claude Code Wrapper

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

This planned phase wires Claude Code output projection through the CLI-output wrapper from Phase 020. Claude Code exposes no output-transform hook, so the phase runs it headless via `claude -p --output-format stream-json`, routes the stream through the Claude runtime adapter into `projectMessage()`, re-renders the projected output, gates on `isProjectionEnabled()`, and fails open to the byte-exact original. The interactive TUI is explicitly out of scope: only headless and print output are interceptable.

**Key decision**: intercept Claude Code headless stream-json output at the wrapper seam and route it through the Phase 018 `projectMessage()` entrypoint, with the interactive TUI explicitly excluded from interception.

**Critical dependency**: the completed Phase 020 CLI-output wrapper framework, the Phase 018 projection runtime core `projectMessage()` entrypoint, and the Phase 016 default-off enablement gate.

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
| **Phase** | 21 of 28 |
| **Predecessor** | `020-cli-output-wrapper-framework` |
| **Successor** | `022-codex-wrapper` |
| **Handoff Criteria** | The Claude adapter maps `claude -p --output-format stream-json` events onto the assembler event shape, the stream routes through `projectMessage()` and re-renders projected output, `isProjectionEnabled()` gates the seam with a byte-exact original when off, any failure emits the byte-exact original, the tests cover the adapter mapping, the enablement gate, and the exact-original fallback, and this phase passes strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This planned phase wires the first CLI-output wrapper consumer: Claude Code headless output. Phase 020 built the wrapper framework that captures, transforms, and re-renders headless, stream, or print output for runtimes without a native output hook. This phase consumes that framework for Claude Code specifically.

**Scope boundary**: Wire the Claude Code runtime adapter and its stream-json mapping, the wrapper seam into `projectMessage()`, and the enablement-gated fail-open fallback. The interactive TUI is explicitly out of scope because its rendered output is not interceptable. Do not change the wrapper framework, the projection runtime core, or the Phase 016 enablement gate.

**Dependencies**:

- The completed Phase 020 CLI-output wrapper framework and its capture-transform-re-render seam
- The Phase 018 projection runtime core `projectMessage()` entrypoint and the client presentation functions
- The Phase 016 default-off enablement gate `isProjectionEnabled()`
- The Phase 017 seam contract rules for the fail-open exact-original fallback and per-runtime pre-checks

**Deliverables**:

- A Claude runtime adapter that maps Claude's stream-json events onto the assembler event shape
- The wrapper wiring that runs `claude -p --output-format stream-json`, routes the stream through `projectMessage()`, and re-renders projected output
- An enablement-gated seam with a byte-exact exact-original fallback on disable or failure
- Tests covering the adapter mapping, the enablement gate, and the exact-original fallback
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Claude Code exposes no output-transform hook, so its rendered assistant output cannot be rewritten natively. The only interceptable surface is headless and print output, which the Phase 020 wrapper framework can capture, transform, and re-render. Without this phase, Claude Code headless output is never projected even when projection is enabled.

### Purpose

Wire Claude Code headless output projection through the CLI-output wrapper so that, with the enablement flag on, Claude Code headless output is projected, and with the flag off or on any failure, the byte-exact original shows.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Running Claude Code headless via `claude -p --output-format stream-json` and routing the stream through the Claude runtime adapter.
- Mapping Claude's stream-json events onto the assembler event shape that `projectMessage()` consumes.
- Re-rendering the projected output at the wrapper seam and emitting it to stdout.
- Gating the seam on `isProjectionEnabled()` and returning the byte-exact original when projection is disabled.
- Failing open to the byte-exact original on any adapter error, parse failure, or wrapper failure.
- Preserving canonical event bytes and never mutating canonical transcripts.
- Tests for the adapter mapping, the enablement gate, and the exact-original fallback.

### Out of Scope

- The interactive Claude Code TUI, whose rendered output is not interceptable and is explicitly excluded.
- Changing the Phase 020 wrapper framework, the Phase 018 projection runtime core, or the Phase 016 enablement gate.
- Adding output-transform hooks to Claude Code, which are treated as a given absence.
- Rewriting canonical transcripts, events, tool inputs, or tool results.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `021-claude-code-wrapper/spec.md` | Create | Record the planned scope, requirements, and success criteria |
| `021-claude-code-wrapper/plan.md` | Create | Plan the adapter mapping, the wrapper wiring, and the verification path |
| `021-claude-code-wrapper/tasks.md` | Create | Break the phase into setup, implementation, and verification tasks |
| `021-claude-code-wrapper/checklist.md` | Create | Record planned verification gates for the adapter, gate, and fallback evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Intercept only headless and print output. | The seam intercepts `claude -p --output-format stream-json` output; the interactive TUI is explicitly out of scope and never intercepted. |
| REQ-002 | Map Claude stream-json events onto the assembler event shape. | The Claude runtime adapter translates every emitted stream-json event into the assembler event shape that `projectMessage()` consumes, preserving event ordering. |
| REQ-003 | Route the stream through `projectMessage()` and re-render. | The routed stream feeds `projectMessage()`, and the projected output is re-rendered at the seam. |
| REQ-004 | Gate on `isProjectionEnabled()` before projecting. | Every seam entry consults `isProjectionEnabled()`; when the answer is `false`, the byte-exact original is emitted with no provider call. |
| REQ-005 | Fail open to the byte-exact original. | Any adapter error, parse failure, or wrapper failure emits the byte-exact original, never a partial or transformed output. |
| REQ-006 | Preserve canonical bytes. | Canonical event bytes stay unchanged, and the original is available for exact restore. |
| REQ-007 | Cover the mapping, the gate, and the fallback with tests. | Tests prove the adapter mapping, the enablement gate behavior, and the exact-original fallback. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Run capability and privacy pre-checks before hosted routing. | The seam contract's pre-checks pass before any hosted routing; a failing pre-check keeps the projection local or falls back to the exact original. |
| REQ-009 | Keep the package gate green. | `npm run check` passes typecheck, build, and all tests, including the new Claude wrapper tests. |
| REQ-010 | Cover the edge cases. | Partial streams, malformed events, mid-stream disablement, and an absent `claude` binary resolve to the byte-exact original. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the enablement flag on, Claude Code headless output is projected.
- **SC-002**: With the flag off, the byte-exact original shows.
- **SC-003**: On any failure, the byte-exact original shows.
- **SC-004**: Claude stream-json events map onto the assembler event shape in order.
- **SC-005**: The wrapper tests pass, including the adapter mapping, the enablement gate, and the exact-original fallback.
- **SC-006**: Phase 021 strict validation reports `Errors: 0  Warnings: 0`.

### Acceptance Scenarios

1. **Given** the enablement flag on and a headless `claude -p --output-format stream-json` run, **When** the stream routes through the wrapper, **Then** the projected output is re-rendered.
2. **Given** the enablement flag off, **When** the seam runs, **Then** the byte-exact original is emitted and no provider call happens.
3. **Given** an adapter error, malformed event, or wrapper failure, **When** the seam resolves, **Then** the byte-exact original renders.
4. **Given** a Claude stream-json stream, **When** the adapter maps each event, **Then** each event lands on the assembler event shape in order.
5. **Given** a missing or failing `claude` binary, **When** the wrapper runs, **Then** the byte-exact original or a clear non-intercepted passthrough results.
6. **Given** the completed packet, **When** strict validation runs, **Then** it reports zero errors and zero warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 020 CLI-output wrapper framework | High | Freeze the wrapper seam contract and consume it without modification. |
| Dependency | Phase 018 `projectMessage()` entrypoint | High | Route through the single orchestration entrypoint with the frozen stage order. |
| Dependency | Phase 016 enablement gate | High | Consult `isProjectionEnabled()` at every seam entry before projecting. |
| Risk | The interactive TUI is mistaken as an interceptable surface | Medium | State the headless-only scope in the spec and test only headless and print output. |
| Risk | A partial or malformed stream produces partial output | High | The fail-open seam emits the byte-exact original on any non-accept terminal. |
| Risk | Claude's stream-json shape changes between versions | Medium | Pin the adapter to a recorded stream-json snapshot and re-validate on upgrade. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The seam resolves locally and synchronously, and the fallback path performs no network access.
- **NFR-P02**: Projection adds bounded latency with no blocking round trips before the enablement gate resolves.

### Security and Privacy

- **NFR-S01**: Capability and privacy pre-checks run before any hosted routing; a failing pre-check blocks hosted routing.
- **NFR-S02**: The packet contains no credentials, message content, or protected spans.

### Reliability

- **NFR-R01**: The seam is fail-open: any error yields the byte-exact original and never a partial transform.
- **NFR-R02**: Canonical bytes are preserved and restorable from retained originals at all times.

## 8. EDGE CASES

- The enablement flag is off, which yields the byte-exact original with no provider call.
- A partial stream ends before a full message assembles, which yields the byte-exact original.
- A malformed or unknown stream-json event arrives, which the adapter maps to the exact original fallback.
- The `claude` binary is absent or fails to start, which yields a clear non-intercepted passthrough.
- Projection is disabled mid-stream, which returns the exact original from the next seam entry.
- A newer Claude Code version changes the stream-json shape, which triggers an adapter re-validation.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 15/25 | One runtime adapter, one wrapper wiring path, and one gated seam |
| Risk | 16/25 | Fail-open fidelity and canonical-bytes preservation on a live CLI stream |
| Research | 8/20 | The stream-json shape is the main unknown and is pinned by a recorded snapshot |
| **Total** | **39/70** | **Level 2** |

## 10. OPEN QUESTIONS

No unresolved question blocks planning. The exact Claude Code version pinned for the stream-json snapshot and the exact stream-json event vocabulary are recorded as versioned inputs at implementation time, not open design questions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
