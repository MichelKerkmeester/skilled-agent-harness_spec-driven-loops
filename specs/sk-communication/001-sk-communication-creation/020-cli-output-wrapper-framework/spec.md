---
title: "Feature Specification: Phase 020 CLI-Output Wrapper Framework"
description: "Build the shared CLI-output wrapper framework that projects output for every runtime without a native output-transform hook (Claude Code, Codex, Devin, Cursor, and Pi if its turn_end cannot mutate) by running the target runtime in headless, stream, or print mode, capturing the assistant output stream incrementally, feeding it through the Phase 018 projectMessage() entrypoint, and re-rendering the projected text with the enablement gate and a fail-open exact-original fallback."
trigger_phrases:
  - "cli-output-wrapper-framework"
  - "cli output wrapper"
  - "wrapper framework projection"
  - "headless stream print capture"
  - "shared output wrapper seam"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/020-cli-output-wrapper-framework"
    last_updated_at: "2026-08-14T07:56:00.000Z"
    last_updated_by: "claude"
    recent_action: "Shipped the CLI-output wrapper framework and verified the package gate."
    next_safe_action: "Proceed to phase 021 Claude Code wrapper wiring."
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
      session_id: "phase-020-cli-output-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The parameterized wrapper, capture-normalize-project-render seam, launcher, and wrapper test suite ship and pass the package gate."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 020 CLI-Output Wrapper Framework

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

OpenCode proved the projection on the only native output-transform hook in Phase 019, but the wrapper-based runtimes still have no projection path. This phase builds the shared CLI-output wrapper framework that serves every runtime lacking a native output-transform hook: Claude Code, Codex, Devin, Cursor, and Pi if its `turn_end` cannot mutate. The wrapper runs the target runtime in its headless, stream, or print mode, captures the assistant output stream incrementally, normalizes each runtime's output envelope through the package's existing per-runtime adapters, feeds the captured message through the Phase 018 `projectMessage()` entrypoint, and re-renders the projected text. The enablement gate `isProjectionEnabled()` governs every activation path, and a fail-open exact-original fallback passes the byte-exact original through whenever projection is disabled, failed, or the runtime is incapable.

**Key decision**: one wrapper entrypoint parameterized by runtime owns the capture-normalize-project-render stage order, reusing the existing per-runtime adapters under `src/runtimes` so no runtime-specific projection logic lives in the wrapper.

**Critical dependency**: the Phase 018 `projectMessage()` entrypoint and the Phase 017 runtime-wiring feasibility and contract (both predecessors), plus the Phase 016 enablement gate and the Phase 019 native plugin as the proven seam.

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
| **Phase** | 20 of 28 |
| **Predecessor** | `019-opencode-native-plugin` |
| **Successor** | `021-claude-code-wrapper` |
| **Handoff Criteria** | The wrapper projects one wrapper-target runtime end-to-end, the byte-exact original passes through on every disabled, failed, or incapable state, the wrapper test suite and the package gate pass, canonical bytes stay unchanged, and this phase passes strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This planned phase delivers the reusable projection surface for every runtime that lacks a native output-transform hook. Phase 019 proved the projection on OpenCode's native `chat.message` hook; this phase generalizes the capture-transform-render path so Claude Code, Codex, Devin, and Cursor, plus Pi when its `turn_end` cannot mutate, project through one shared wrapper.

**Scope boundary**: Build the wrapper framework, its launch or registration pattern, and its tests only. Do not wire a specific wrapper-target runtime end-to-end; that single-runtime validation belongs to Phase 021. Do not change the Phase 018 entrypoint, the Phase 017 contract, the Phase 016 gate, or the Phase 019 plugin.

**Dependencies**:

- Phase 018 `projectMessage()` entrypoint (predecessor), which the wrapper calls for every accepted captured message
- Phase 017 runtime-wiring feasibility and contract (predecessor), which pins the headless/stream/print wrapper seam and the fail-open exact-original rule
- The Phase 016 default-off enablement gate `isProjectionEnabled()`
- The package's existing per-runtime adapters under `src/runtimes`, which normalize each runtime's output envelope into the assembler's event shape

**Deliverables**:

- A single wrapper entrypoint parameterized by runtime
- Headless, stream, and print mode execution of the target runtime with incremental stream capture
- Envelope normalization through the per-runtime adapters into the assembler's event shape
- A `projectMessage()` feed with a fail-open byte-exact original passthrough on every disabled, failed, or incapable state
- A launch/registration pattern operators invoke (alias or launcher script)
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

- The wrapper-based runtimes have no native output-transform hook, so the Phase 019 plugin cannot be reused; each of Claude Code, Codex, Devin, Cursor, and Pi currently has no projection path at all.
- A naive wrapper that buffers the whole session before transforming adds latency and risks losing the byte-exact original that the Phase 017 fail-open contract requires.
- Every activation path must consult `isProjectionEnabled()` and preserve the exact original, but no shared capture-transform-render framework exists to make that rule uniform.

### Purpose

Make projection available to every runtime without a native output hook through one reusable wrapper that captures the assistant output stream incrementally, projects it through the Phase 018 entrypoint, and re-renders the projected text, with a byte-exact original guaranteed on every disabled, failed, or incapable path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A single wrapper entrypoint parameterized by runtime that owns the capture-normalize-project-render stage order.
- Headless, stream, and print mode execution of the target runtime with incremental capture of the assistant output stream.
- Envelope normalization through the package's existing per-runtime adapters (`src/runtimes`) into the assembler's event shape.
- A `projectMessage()` feed for every captured assistant message, honouring the entrypoint's exact-original fallback.
- The enablement gate `isProjectionEnabled()` consulted before any projection, and a fail-open byte-exact original passthrough on every disabled, failed, or incapable state.
- A launch/registration pattern operators invoke, delivered as an alias or a launcher script.
- Tests covering the wrapper stage order, the gate matrix, the fallback paths, and envelope normalization.

### Out of Scope

- Any change to the Phase 018 entrypoint, the Phase 017 contract, the Phase 016 gate, or the Phase 019 plugin.
- End-to-end wiring and validation of one specific wrapper-target runtime, which belongs to Phase 021.
- Rewriting canonical transcripts, events, tool inputs, or tool results.
- Any hosted projection egress beyond what `projectMessage()` already performs.

### Technical Approach

Author the wrapper as a parameterized entrypoint that resolves the target runtime's declared launch mode and adapter, spawns the runtime in headless, stream, or print mode, captures the assistant output stream incrementally, maps the captured envelope through the per-runtime adapter into the assembler's event shape, gates on `isProjectionEnabled()`, calls `projectMessage()`, and either re-renders the projected text or passes the byte-exact original through.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/wrapper/` | Create | Wrapper entrypoint, runtime launcher, stream capture, envelope normalization, and render seam |
| `src/wrapper/index.ts` | Create | Parameterized wrapper entrypoint exported for all wrapper-target runtimes |
| `bin/` or package alias | Create | Launch/registration pattern operators invoke |
| `test/wrapper/` | Create | Wrapper suite covering stage order, gate matrix, fallback paths, and envelope normalization |
| `020-cli-output-wrapper-framework/` | Create | Record the planned Level-3 packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Provide a single wrapper entrypoint parameterized by runtime. | One entrypoint accepts a runtime id, resolves the declared launch mode and adapter, and runs the capture-normalize-project-render stage order for every wrapper-target runtime. |
| REQ-002 | Run the target runtime in its headless, stream, or print mode. | The wrapper launches Claude Code, Codex, Devin, Cursor, or Pi in the mode its per-runtime adapter declares and captures the assistant output stream. |
| REQ-003 | Capture the assistant output stream incrementally. | The wrapper emits captured chunks as they arrive and feeds each assembled assistant message to `projectMessage()` without buffering the whole session. |
| REQ-004 | Normalize each runtime's output envelope into the assembler's event shape. | The wrapper reuses the per-runtime adapters under `src/runtimes` so every runtime's captured stream maps to the event shape the Phase 018 entrypoint expects. |
| REQ-005 | Gate projection behind `isProjectionEnabled()`. | The wrapper calls `isProjectionEnabled()` before any projection and passes the byte-exact original through when the answer is `false`. |
| REQ-006 | Fail open on any disabled, failed, or incapable state. | Any error, disabled enablement, or incapable runtime yields the byte-exact original assistant output, never a partial or transformed stream. |
| REQ-007 | Re-render the projected text. | On an accept terminal the wrapper re-renders the projected text in place of the captured original; on every other outcome the byte-exact original renders. |
| REQ-008 | Provide a launch/registration pattern operators invoke. | An alias or launcher script starts the wrapper for a target runtime so operators enable projection without manual invocation. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Keep canonical bytes unchanged. | Canonical transcripts, events, tool inputs, and tool results remain byte-unchanged; the wrapper touches only the re-rendered display surface. |
| REQ-010 | Prepare single-runtime validation for Phase 021. | The wrapper exposes one runtime end-to-end through the entrypoint and its launch pattern so Phase 021 can validate the projection and the exact-original fallback on that runtime. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The wrapper exposes one entrypoint parameterized by runtime for every wrapper-target runtime.
- **SC-002**: The wrapper captures the assistant output stream incrementally and projects each accepted message through `projectMessage()`.
- **SC-003**: Every disabled, failed, or incapable state passes the byte-exact original through.
- **SC-004**: The framework projects one wrapper-target runtime end-to-end when Phase 021 validates it.
- **SC-005**: The wrapper test suite passes and strict packet validation reports zero errors and warnings.

### Acceptance Scenarios

1. **Given** a wrapper-target runtime and the enablement flag on, **When** the wrapper runs the runtime in its declared mode, **Then** the assistant output stream is captured incrementally, projected, and re-rendered.
2. **Given** the enablement flag off, **When** the wrapper runs, **Then** the byte-exact original output passes through untouched.
3. **Given** any error, incapable runtime, or non-accept terminal, **When** the wrapper resolves, **Then** the byte-exact original output renders.
4. **Given** a captured runtime stream, **When** the wrapper normalizes it, **Then** the envelope matches the assembler's event shape that `projectMessage()` expects.
5. **Given** the completed packet, **When** strict validation runs, **Then** it reports zero errors and zero warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 018 `projectMessage()` entrypoint | High | The wrapper calls the entrypoint only; the entrypoint owns the stage order and fallback. |
| Dependency | Phase 017 wrapper seam contract | High | The wrapper implements the pinned headless/stream/print seam and fail-open rule, not new decisions. |
| Risk | A buffering wrapper loses the byte-exact original | High | Incremental capture plus a fail-open passthrough restores the original on every non-accept path. |
| Risk | The wrapper projects when disabled | High | Gate on `isProjectionEnabled()`; test the disabled matrix. |
| Risk | Runtime-specific output shapes break normalization | Medium | Reuse the per-runtime adapters under `src/runtimes`, which already own each runtime's envelope mapping. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The wrapper must not block output beyond the Phase 018 entrypoint's own bounded execution.
- **NFR-P02**: Stream capture stays incremental and bounded; no whole-session buffering is required before projection.

### Security and Privacy

- **NFR-S01**: No captured message content is persisted beyond in-memory wrapper state.
- **NFR-S02**: The wrapper and packet contain no credentials, message content, or protected spans.

### Reliability

- **NFR-R01**: Every terminal state maps deterministically to a projection or the byte-exact original, with no ambiguous fail-open state.
- **NFR-R02**: The wrapper fails open: any error leaves the captured output byte-exact and never throws into the runtime session.

## 8. EDGE CASES

- The enablement flag is off: byte-exact original, no `projectMessage()` call.
- The runtime is incapable or undeclared in the adapter matrix: byte-exact original.
- `projectMessage()` throws, times out, or returns a non-accept terminal: byte-exact original.
- The runtime emits an unexpected output shape: the wrapper fails open and passes the raw stream through.
- The runtime process exits mid-stream: the wrapper flushes the captured message and resolves each terminal deterministically.
- The wrapper is invoked twice for the same runtime: each invocation runs an independent capture and render cycle.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
|-----------|-------|---------|
| Scope | 18/25 | One wrapper entrypoint, five target runtimes, stream capture, normalization, and a render seam |
| Risk | 20/25 | Byte-exact fallback and fail-open guarantees across heterogeneous runtime output |
| Research | 10/20 | Confirming each runtime's headless, stream, and print modes plus its adapter envelope shape |
| Multi-Agent | 6/15 | Wrapper authoring and adversarial verification can separate |
| Coordination | 12/15 | The framework is the shared seam for phases 021-025 |
| **Total** | **66/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The wrapper projects when disabled | High | Low | `isProjectionEnabled()` gate before any projection; disabled matrix tested |
| R-002 | A buffering wrapper loses the byte-exact original | High | Medium | Incremental capture and a fail-open passthrough restore the original |
| R-003 | Runtime output shape drifts from the adapter contract | High | Medium | Reuse the per-runtime adapters and fail open on any unexpected shape |
| R-004 | The wrapper throws into the runtime session | High | Low | Outer fail-open guard leaves the captured output byte-exact |

## 11. USER STORIES

### US-001: Shared projection surface (Priority: P0)

**As a** wrapper-runtime operator, **I want** one wrapper entrypoint that projects Claude Code, Codex, Devin, Cursor, and Pi output, **so that** every runtime without a native output hook gets the same projection path.

**Acceptance Criteria**:

1. **Given** any wrapper-target runtime, **When** the entrypoint resolves, **Then** it selects the runtime's declared mode and adapter.
2. **Given** the flag on, **When** the runtime emits output, **Then** the projected text re-renders in place.

### US-002: Byte-exact passthrough (Priority: P0)

**As a** privacy operator, **I want** the captured output to pass through byte-exactly whenever projection is disabled, fails, or the runtime is incapable, **so that** the wrapper never corrupts the runtime output.

**Acceptance Criteria**:

1. **Given** the flag off, **When** the wrapper runs, **Then** the byte-exact original passes through.
2. **Given** any error or non-accept terminal, **When** the wrapper resolves, **Then** the byte-exact original renders.

### US-003: Incremental capture (Priority: P0)

**As a** latency-sensitive operator, **I want** the assistant output stream captured incrementally, **so that** projection does not wait for the whole session to finish.

**Acceptance Criteria**:

1. **Given** a streaming runtime, **When** chunks arrive, **Then** each assembled assistant message feeds `projectMessage()` without whole-session buffering.
2. **Given** a mid-stream exit, **When** the wrapper flushes, **Then** each terminal resolves deterministically.

### US-004: Operator launch pattern (Priority: P0)

**As an** operator, **I want** an alias or launcher script to start the wrapper for a target runtime, **so that** projection is enabled through a documented invocation.

**Acceptance Criteria**:

1. **Given** the launch pattern, **When** it runs, **Then** it starts the wrapper for the named runtime.
2. **Given** an invoked wrapper, **When** the runtime emits output, **Then** the capture-project-render path runs.

## 12. OPEN QUESTIONS

No unresolved question blocks planning. The exact pinned headless, stream, and print modes per runtime and the precise adapter envelope shapes are recorded as versioned inventory at validation time, not open design questions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Parent Packet**: `../spec.md`
