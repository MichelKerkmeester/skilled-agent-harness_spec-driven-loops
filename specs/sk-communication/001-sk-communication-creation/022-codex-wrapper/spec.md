---
title: "Feature Specification: Phase 022 Codex Wrapper"
description: "Wire Codex output projection through the Phase 020 CLI-output wrapper: run codex exec in its non-interactive JSON-stream mode, map the stream through the Codex runtime adapter into projectMessage(), gate on isProjectionEnabled(), and fail open to the byte-exact original."
trigger_phrases:
  - "codex-wrapper"
  - "codex output projection"
  - "codex cli wrapper"
  - "codex exec json stream"
  - "runtime wrapper projection"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/022-codex-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Confirm the Codex headless/JSON-stream flag from its CLI, then author the adapter."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-022-codex-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Phase 022 Codex Wrapper

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
| **Phase** | 22 of 28 |
| **Predecessor** | `021-claude-code-wrapper` |
| **Successor** | `023-pi-wrapper` |
| **Handoff Criteria** | With the flag on, a headless `codex exec` run shows projected output; with the flag off or on any failure it shows the byte-exact original; the Codex envelope mapping, enablement gate, and fail-open fallback tests pass; and this phase passes strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This planned phase wires Codex through the Phase 020 CLI-output wrapper. Codex exposes only input, tool, and lifecycle hooks and none of them can rewrite the rendered answer, so projection must wrap the CLI process and its output stream instead of hooking a rendered message.

**Scope boundary**: Wire only the Codex executor into the Phase 020 wrapper and the Codex runtime adapter. The wrapper, the shared `projectMessage()` entrypoint, and the `isProjectionEnabled()` gate belong to Phase 020; the Claude wiring belongs to Phase 021; the other runtime wrappers belong to phases 023 through 025.

**Dependencies**:

- Phase 020 CLI-output wrapper (predecessor), which owns `projectMessage()`, `isProjectionEnabled()`, and the fail-open byte-exact fallback
- The Codex runtime adapter in `cli-communication-projection` (`src/runtimes/codex.ts`), which maps Codex events onto the shared assembler envelope
- The pinned Codex CLI reference, so the headless and JSON-stream flags are identified from the CLI before the wrapper relies on them

**Deliverables**:

- A Codex executor entry on the Phase 020 wrapper that runs `codex exec` in its non-interactive JSON-stream mode
- A mapping from Codex's output envelope onto the assembler event shape through the Codex runtime adapter
- Projection routed through `projectMessage()`, gated on `isProjectionEnabled()`, fail-open to the byte-exact original
- Tests covering the adapter mapping, the enablement gate, and the fail-open fallback
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

- Codex exposes only input, tool, and lifecycle hooks, and none of them can rewrite the rendered answer, so there is no native seam to project Codex output in place.
- The wrapper-based approach must capture the `codex exec` output stream, map its envelope onto the assembler event shape, and re-render through `projectMessage()` before the answer is shown.
- The headless and JSON-stream flags must be identified from the actual Codex CLI before the wrapper relies on them, because an assumed flag set would silently no-op or corrupt the captured stream.

### Purpose

Make a headless Codex run show projected output when the enablement flag is on, and the byte-exact original when the flag is off or on any failure, through the Phase 020 wrapper and the Codex runtime adapter.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A Codex executor entry on the Phase 020 wrapper that runs `codex exec` in its non-interactive JSON-stream mode and captures the output stream.
- A mapping from Codex's output envelope onto the assembler event shape through the Codex runtime adapter, verified against a captured stream fixture.
- Routing the mapped events through the Phase 020 `projectMessage()` entrypoint and re-rendering the accepted answer.
- Gating projection on `isProjectionEnabled()`, with the byte-exact original returned when the gate is off.
- Failing open to the byte-exact original on any parse failure, adapter rejection, or projection error.
- Tests covering the adapter mapping, the enablement gate, and the fail-open fallback.
- A pre-implementation step that identifies Codex's actual headless and JSON-stream flags from the CLI before the wrapper relies on them.

### Out of Scope

- Any change to the Phase 020 wrapper, the `projectMessage()` entrypoint, the `isProjectionEnabled()` gate, or the Phase 021 Claude wiring.
- Building the Pi, Devin, or Cursor wrappers, which belong to phases 023 through 025.
- Rewriting canonical transcripts, events, tool inputs, or tool results.
- Any hosted projection egress beyond what `projectMessage()` already performs.

### Technical Approach

Capture the `codex exec` output stream in its headless JSON-stream mode, split it into events, and map each event through the Codex runtime adapter onto the assembler event shape. Feed the assembled message to `projectMessage()` from the Phase 020 wrapper, gate the re-render on `isProjectionEnabled()`, and print the byte-exact original stream on any disabled gate, parse failure, adapter rejection, or projection error.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| Phase 020 wrapper Codex executor entry | Create | Runs `codex exec` headless in JSON-stream mode and routes the stream through the wrapper |
| `.opencode/skills/sk-communication/cli-communication-projection/src/runtimes/codex.ts` | Modify | Verify and extend the Codex envelope mapping to the CLI JSON-stream shape |
| Codex wrapper tests | Create | Cover the adapter mapping, the enablement gate, and the fail-open fallback |
| `022-codex-wrapper/` | Create | Record the planned Level-2 packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Wire Codex through the Phase 020 CLI-output wrapper. | A headless `codex exec` run is captured as an output stream and routed through the wrapper's `projectMessage()` re-render. |
| REQ-002 | Map Codex's output envelope onto the assembler event shape. | The Codex runtime adapter maps the Codex JSON-stream events onto the shared assembler envelope that `projectMessage()` consumes. |
| REQ-003 | Identify Codex's actual headless and JSON-stream flags from its CLI. | The exact headless and JSON-stream flags are confirmed from `codex exec --help` (or the pinned cli-reference) and recorded before the wrapper relies on them. |
| REQ-004 | Gate projection on `isProjectionEnabled()`. | The wrapper projects only when `isProjectionEnabled()` returns true; when it returns false the byte-exact original is shown. |
| REQ-005 | Fail open to the byte-exact original. | Any parse failure, adapter rejection, projection error, or disabled gate shows the byte-exact original output with no rewrite. |
| REQ-006 | Test the adapter, the gate, and the fallback. | Tests cover the Codex envelope mapping, the enablement gate, and the fail-open fallback, and pass as part of the wrapper test gate. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Keep canonical bytes unchanged. | The wrapper projects only the display surface; the captured Codex stream, canonical events, and transcripts remain byte-unchanged. |
| REQ-008 | Pin the identified flags to the tested runtime version. | The recorded headless and JSON-stream flags are verified against the pinned Codex CLI version, and any drift is recorded as an incompatibility. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the enablement flag on, a headless `codex exec` run shows projected output.
- **SC-002**: With the enablement flag off, the run shows the byte-exact original.
- **SC-003**: On any failure, the run shows the byte-exact original.
- **SC-004**: The adapter mapping, enablement gate, and fail-open fallback tests pass.

### Acceptance Scenarios

1. **Given** the enablement flag on and a headless `codex exec` JSON-stream run, **When** the output stream is routed through the wrapper, **Then** the rendered answer is projected.
2. **Given** the enablement flag off, **When** the wrapper runs, **Then** the exact original output is shown.
3. **Given** a malformed or unparseable stream event, **When** the wrapper completes, **Then** the exact original output is shown.
4. **Given** the Codex envelope mapping, **When** an event fails validation or compatibility, **Then** the exact-original fallback holds.
5. **Given** the wrapper test gate, **When** the adapter, gate, and fallback tests run, **Then** they pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 020 CLI-output wrapper | High | The phase wires Codex into the wrapper only; the wrapper owns `projectMessage()`, the gate, and the fallback. |
| Dependency | Codex headless and JSON-stream flags | High | Identify the actual flags from `codex exec --help` before relying on them and pin them to the tested CLI version. |
| Risk | An assumed flag silently no-ops or corrupts the stream | High | The REQ-003 identification step plus a captured stream fixture and byte-exact fallback. |
| Risk | The envelope mapping drifts from the assembler shape | Medium | Adapter validation and the exact-original fallback on any rejected event. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The wrapper must not block output beyond `projectMessage()`'s own bounded execution.
- **NFR-P02**: The captured stream is bounded to the running process and released when the run completes.

### Security and Privacy

- **NFR-S01**: No message content is persisted beyond the captured in-memory stream.
- **NFR-S02**: The wrapper and packet contain no credentials, message content, or protected spans.

### Reliability

- **NFR-R01**: Every terminal state maps deterministically to a projection or the byte-exact original, with no ambiguous fail-open state.
- **NFR-R02**: The wrapper fails open: any error prints the byte-exact original and never emits a partial rewrite.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- The enablement flag is off: byte-exact original, no entrypoint call.
- `codex exec` exits non-zero: byte-exact original.
- A stream event is malformed or unparseable: byte-exact original.
- An event fails envelope validation or compatibility: exact-original fallback.
- The final answer event is missing: byte-exact original.
- The enablement flag holds an unrecognized value: projection stays off.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | One runtime executor, the envelope mapping, and one test surface |
| Risk | 19/25 | Headless stream capture and byte-exact fallback guarantees |
| Research | 12/20 | The exact Codex CLI flags and stream event shape need live confirmation |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

No unresolved question blocks planning. The exact Codex headless and JSON-stream flags and the stream event shape are a pre-implementation identification step, not an open design question.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
