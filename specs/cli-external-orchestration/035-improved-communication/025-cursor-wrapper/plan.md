---
title: "Implementation Plan: Phase 025 Cursor Output Wrapper"
description: "Wire Cursor into the Phase 020 CLI-output wrapper, confirm the cursor-agent print flag, route captured stdout through the Cursor runtime adapter and projectMessage(), and fail open to the byte-exact original."
trigger_phrases:
  - "cursor-wrapper"
  - "implementation plan"
  - "cursor output wrapper"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/025-cursor-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Execute T001 by confirming the cursor-agent non-interactive print flag from its CLI."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "plan.md"
      - "spec.md"
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
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 025 Cursor Output Wrapper

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript seam inside the Phase 020 CLI-output wrapper |
| **Framework** | Phase 020 wrapper seam consuming the Cursor runtime adapter and the Phase 018 `projectMessage()` entrypoint |
| **Storage** | Captured `cursor-agent` stdout retained as the exact original; no transcript persistence change |
| **Testing** | Adapter-mapping, enablement-gate, and fail-open-fallback tests plus the wrapper gate |

### Overview

Wire Cursor into the Phase 020 CLI-output wrapper. Capture non-interactive `cursor-agent` stdout, confirm the print flag from the CLI, route the capture through `cursorRuntimeAdapter` onto the assembler event shape, call `projectMessage()`, and re-render the projection only on an accept terminal. Every other terminal re-renders the byte-exact original.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The `cursor-agent` non-interactive print flag is confirmed from its CLI.
- [x] The Phase 020 wrapper seam, the Cursor adapter mapping, and the `projectMessage()` terminal set are inventoried.
- [x] The captured-stdout event shape is confirmed against the assembler event contract.

### Definition of Done

- [x] All ten requirements have observed evidence.
- [x] The flag-on run renders the projected output and the flag-off or failed run renders the byte-exact original.
- [x] The wrapper gate and strict packet validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A capture-adapt-project-render seam inside the Phase 020 CLI-output wrapper, honoring the Phase 017 seam contract.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Cursor capture | Run `cursor-agent` non-interactively and capture its rendered stdout as the canonical original |
| Cursor runtime adapter | Map the captured stdout onto the assembler event shape, retaining the exact original |
| Enablement gate | Gate projection behind `isProjectionEnabled()` before any entrypoint call |
| `projectMessage()` | Produce a projection or the exact original through the Phase 018 entrypoint |
| Re-render seam | Render the projected message on accept, or the byte-exact original on every other terminal |

### Data Flow

Non-interactive `cursor-agent` stdout -> capture as canonical original -> `cursorRuntimeAdapter` maps onto the assembler event shape -> `isProjectionEnabled()` gate -> `projectMessage()` -> accept? -> re-render projection : re-render byte-exact original.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Phase 020 wrapper Cursor seam | Renders Cursor output through the shared wrapper | Wire the Cursor adapter and the capture-to-project-to-render path | Wrapper gate and seam tests |
| Cursor runtime adapter | Maps Cursor ACP events onto the assembler shape | Consumed, not modified | Adapter-mapping tests against captured stdout |
| Phase 018 `projectMessage()` | Owns the projection stage order | Called, never modified | Entrypoint tests stay green |
| Enablement gate | Defaults projection off | Consulted before projecting | Disabled-matrix seam tests |
| Phase and packet docs | Record and route planned state | Create Phase 025 | Strict validation and graph backfill |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm the `cursor-agent` non-interactive print flag and the pinned version from its CLI.
- [x] Inventory the Phase 020 wrapper seam, the Cursor adapter mapping, and the `projectMessage()` terminal set.
- [x] Freeze the captured-stdout event shape against the assembler event contract.

### Phase 2: Implementation

- [x] Wire the Cursor seam into the Phase 020 wrapper: capture stdout and route it through `cursorRuntimeAdapter`.
- [x] Gate projection behind `isProjectionEnabled()` and call `projectMessage()` for every accepted capture.
- [x] Re-render the projected message on accept and the byte-exact original on every other terminal.

### Phase 3: Verification

- [x] Run the adapter-mapping, enablement-gate, and fail-open-fallback tests.
- [x] Run the wrapper gate and strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Adapter mapping | Captured cursor-agent stdout maps onto the assembler event shape | Wrapper seam tests using `cursorRuntimeAdapter` |
| Enablement gate | Flag-off returns the exact original without an entrypoint call | Disabled-matrix seam tests |
| Fail-open fallback | Capture, adapter, gate, and entrypoint error terminals re-render the byte-exact original | Error-terminal seam tests |
| Wrapper gate | Typecheck, build, tests, and seam smokes | Phase 020 wrapper gate |
| Packet integrity | Phase 025 metadata, navigation, and links | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 020 CLI-output wrapper | Internal | Required by plan | The Cursor seam cannot capture or re-render without the wrapper |
| Cursor runtime adapter | Internal | Available from Phase 006 | The captured stdout cannot map onto the assembler shape |
| Phase 018 `projectMessage()` | Internal | Available from Phase 018 | The seam cannot project without the entrypoint |
| Enablement gate | Internal | Available from Phase 016 | Projection would not default off |
| `cursor-agent` CLI | External | Version-pinned at setup | The confirmed print flag decides the capture invocation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The flag-on run fails to re-render the projection, the flag-off run mutates the output, or a seam error re-renders a partial transform.
- **Procedure**: Revert the Cursor seam wiring to the Phase 020 wrapper default, rerun the wrapper gate and seam tests, confirm the byte-exact original renders for every non-accept terminal, refresh graph metadata, and rerun strict packet validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Flag confirmation and inventory -> Seam wiring -> Adapter, gate, and fallback verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Flag confirmation and inventory | Phase 020 wrapper and `cursor-agent` CLI | Seam wiring |
| Seam wiring | Confirmed flag and event shape | Verification |
| Verification | Wired seam | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Flag confirmation and inventory | Low | 0.5 day |
| Seam wiring | Medium | 1-2 days |
| Verification and handoff | Medium | 0.5-1 day |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Record the pinned `cursor-agent` version and the confirmed print flag.
- [x] Capture the wrapper-gate baseline before the seam change.
- [x] Confirm no canonical or transcript change is planned.

### Procedure

1. Restore the Phase 020 wrapper Cursor seam to its pre-change state.
2. Rerun the wrapper gate and the seam tests.
3. Confirm the byte-exact original renders for every non-accept terminal.
4. Refresh graph metadata and rerun strict validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Revert the Cursor seam wiring only; no runtime or persisted user data is changed.
<!-- /ANCHOR:enhanced-rollback -->
