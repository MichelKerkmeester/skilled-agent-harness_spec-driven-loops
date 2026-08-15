---
title: "Implementation Plan: Phase 020 CLI-Output Wrapper Framework"
description: "Plan the shared CLI-output wrapper framework: a parameterized entrypoint that runs the target runtime in headless, stream, or print mode, captures the assistant output stream incrementally, normalizes it through the per-runtime adapters, feeds the Phase 018 projectMessage() entrypoint, and re-renders the projected text with a fail-open byte-exact original passthrough."
trigger_phrases:
  - "cli-output-wrapper-framework"
  - "implementation plan"
  - "wrapper framework plan"
  - "headless stream print capture plan"
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
      - "plan.md"
      - "spec.md"
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
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 020 CLI-Output Wrapper Framework

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript package plus Node child-process execution |
| **Framework** | Package `src/runtimes` adapters, Phase 018 `projectMessage()`, Phase 017 seam contract |
| **Storage** | In-memory incremental capture; no persistence |
| **Testing** | Wrapper suite under `test/wrapper/` plus the package gate `npm run check` |

### Overview

Build the shared wrapper framework that projects output for every runtime without a native output-transform hook. The wrapper runs the target runtime in its headless, stream, or print mode, captures the assistant output stream incrementally, normalizes each runtime's envelope through the existing per-runtime adapters, feeds each accepted message through the Phase 018 `projectMessage()` entrypoint, and re-renders the projected text. The enablement gate `isProjectionEnabled()` governs every activation path, and a fail-open byte-exact original passthrough preserves the captured output on every disabled, failed, or incapable state. The framework is the seam that phases 021 through 025 validate on their assigned runtimes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The headless, stream, and print launch modes are inventoried for every wrapper-target runtime.
- [x] The per-runtime adapter envelope shapes and the Phase 018 entrypoint contract are inventoried.
- [x] The Phase 017 wrapper seam contract and the Phase 016 enablement gate are reviewed.

### Definition of Done

- [x] All ten requirements have observed evidence.
- [x] The wrapper projects one wrapper-target runtime end-to-end with the exact-original fallback intact.
- [x] The wrapper test suite and the package gate pass and strict packet validation reports zero errors and warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A parameterized fail-open wrapper that adapts each runtime's headless, stream, or print output into the Phase 018 `projectMessage()` entrypoint, with incremental capture and a byte-exact original passthrough.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Wrapper entrypoint | Accepts a runtime id, resolves the declared mode and adapter, and runs the stage order |
| Runtime launcher | Spawns the target runtime in its declared headless, stream, or print mode |
| Stream capture | Captures the assistant output stream incrementally, chunk by chunk |
| Envelope normalizer | Reuses the per-runtime adapters to map each runtime's output into the assembler's event shape |
| `projectMessage()` call | The Phase 018 entrypoint that produces a projection or the exact original |
| Render seam | Re-renders the projected text or passes the byte-exact original through |
| Launch/registration pattern | The alias or launcher script operators invoke |

### Data Flow

Operator launch -> target runtime in headless/stream/print mode -> incremental stream capture -> per-runtime adapter normalization -> `isProjectionEnabled()`? -> `projectMessage()` -> accept? -> re-render projected text : byte-exact original passthrough.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `src/wrapper/` | Absent | Create the parameterized wrapper entrypoint, launcher, capture, normalizer, and render seam | Wrapper suite plus `npm run check` |
| `src/runtimes/` | Normalizes each runtime's envelope | Consumed read-only by the wrapper | Adapter suites stay green |
| Phase 018 `projectMessage()` | Owns the projection stage order | Called, never modified | Entrypoint tests stay green |
| Phase 016 gate | Default-off enablement | Consulted before any projection | Disabled-matrix wrapper tests |
| `bin/` or package alias | Launch surface | Add the launch/registration pattern operators invoke | Invocation smoke |
| Phase and parent packet docs | Record and route completion state | Create Phase 020 packet | Strict validation and graph backfill |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Inventory the headless, stream, and print launch modes and the adapter envelope shapes for the wrapper-target runtimes.
- [x] Review the Phase 017 seam contract, the Phase 018 entrypoint, and the Phase 016 enablement gate.

### Phase 2: Implementation

- [x] Author the wrapper entrypoint parameterized by runtime.
- [x] Author the runtime launcher, incremental stream capture, and envelope normalization through the per-runtime adapters.
- [x] Wire the `isProjectionEnabled()` gate, the `projectMessage()` feed, and the fail-open byte-exact original passthrough.
- [x] Author the launch/registration pattern operators invoke.

### Phase 3: Verification

- [x] Run the wrapper test suite and the package gate.
- [x] Confirm the byte-exact passthrough matrix, canonical-byte preservation, and the no-terminal-pollution boundary.
- [x] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Entrypoint resolution | Runtime id to mode and adapter resolution | Wrapper unit tests |
| Stream capture | Incremental capture and mid-stream flush | Wrapper unit tests with fixture streams |
| Envelope normalization | Each runtime's output maps to the assembler's event shape | Per-runtime adapter fixtures |
| Gate matrix | Flag on/off crossed with runtime states | Wrapper suite |
| Fail-open fallback | Error, throw, timeout, non-accept, and incapable terminals pass the byte-exact original | Wrapper suite |
| Boundary | No stdout or stderr pollution and canonical bytes unchanged | Console capture and canonical-byte assertions |
| Packet integrity | Planned Level-3 packet validates cleanly | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 018 `projectMessage()` | Internal | Required by plan | The wrapper cannot project without the entrypoint |
| Phase 017 wrapper seam contract | Internal | Required by plan | Headless/stream/print modes and the fail-open rule are unresolved |
| Phase 016 enablement gate | Internal | Available | The wrapper cannot be gated before projecting |
| Phase 019 native plugin | Internal | Available | The wrapper cannot reference a proven native seam as its model |
| Per-runtime adapters under `src/runtimes` | Internal | Available | Envelope normalization would be re-implemented in the wrapper |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the wrapper projects when disabled, loses the byte-exact original, pollutes the terminal, mutates canonical bytes, or throws into the runtime session.
- **Procedure**: remove the `src/wrapper/` files, the launch/registration pattern, and the wrapper tests, rerun the package gate, confirm canonical bytes and default-off behavior, and rerun strict packet validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Mode and adapter inventory -> Wrapper authoring -> Gate, capture, and fallback verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Mode and adapter inventory | Phase 017, Phase 018, and `src/runtimes` deliverables | Wrapper authoring |
| Wrapper authoring | Confirmed inventory | Verification |
| Verification | Implemented wrapper | Phase handoff to 021 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Mode and adapter inventory | Medium | 0.5-1 day |
| Wrapper authoring | Medium | 1-2 days |
| Verification and handoff | Medium | 1-2 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Record the current adapter and entrypoint baselines.
- [x] Capture the Phase 017 seam contract and Phase 018 entrypoint references.
- [x] Confirm the wrapper boundary (no terminal pollution, no canonical mutation) is preserved.

### Procedure

1. Remove the wrapper files and the launch/registration pattern.
2. Re-run the package gate to confirm the baseline.
3. Confirm canonical transcripts, events, and tool results are byte-unchanged.
4. Rerun strict packet validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Remove the wrapper files; no runtime or persisted user data is changed.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phase 017 contract + modes ----+
                                +-> Launcher and capture -> Normalizer -> projectMessage() -> Render and fallback
Phase 018 entrypoint -----------+                                   |
Phase 016 gate -----------------------------------------------------+
Phase 019 proven native seam --------------------------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Entrypoint resolution | Per-runtime adapters and Phase 017 contract | A resolved mode and adapter | Capture path |
| Capture and normalization | Runtime launcher and adapters | An assembler-shaped envelope | Projection feed |
| Projection and fallback | Phase 018 entrypoint and Phase 016 gate | A projection or a byte-exact original | Verification |
| Verification | Implemented wrapper | Gate, capture, normalization, and boundary evidence | Phase handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Inventory the modes, adapters, and contract** - 0.5-1 day - critical.
2. **Author the parameterized wrapper with incremental capture and fail-open fallback** - 1-2 days - critical.
3. **Prove gate, capture, normalization, and fallback behavior, then close the packet** - 1-2 days - critical.

**Parallel opportunities**:

- The wrapper test harness can be scaffolded while the mode inventory runs.
- The capture and normalization fixtures can be authored after the entrypoint shape is fixed.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Seam confirmed | Modes, adapters, and the Phase 017 contract inventoried | Stage 1 |
| M2 | Wrapper wired | Parameterized entrypoint captures, normalizes, projects, and falls back byte-exactly | Stage 2 |
| M3 | Framework proven | Wrapper suite and package gate green, strict validation passes | Stage 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION SUMMARY

**Decision**: adopt a parameterized wrapper entrypoint as the shared capture-normalize-project-render seam for every runtime without a native output hook, reusing the existing per-runtime adapters and the Phase 018 entrypoint.

**Status**: Proposed. Full rationale and alternatives are in `decision-record.md`.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the Phase 017 seam contract, the Phase 018 entrypoint, and the per-runtime adapter shapes before authoring the wrapper.
- Re-read every target file before editing and keep writes inside the wrapper and packet surfaces.
- Translate each requirement into an observable check before claiming completion.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Do not author the wrapper before the mode and adapter inventory is complete. |
| TASK-SCOPE | Modify only the `src/wrapper/` surfaces, the launch pattern, the wrapper tests, and this packet. |
| TASK-PROOF | Run focused checks, then rerun the authoritative package gate and strict validation from the final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=020 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If a launch mode is unavailable, the entrypoint disagrees with the Phase 017 contract, or any fallback check fails, mark the task blocked, preserve the fail-open behavior, and update the decision record before resuming.
