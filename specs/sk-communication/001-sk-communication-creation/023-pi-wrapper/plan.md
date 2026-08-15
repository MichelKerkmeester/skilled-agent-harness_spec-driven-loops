---
title: "Implementation Plan: Phase 023 Pi Wrapper"
description: "Validate whether a Pi turn_end handler can mutate the rendered bubble, then wire Pi output projection through the validated path (a turn_end extension or the Phase 020 CLI-output wrapper in pi print mode) gated on isProjectionEnabled() with the byte-exact original fallback."
trigger_phrases:
  - "pi-wrapper"
  - "implementation plan"
  - "pi output projection plan"
  - "turn_end mutation validation plan"
  - "pi print mode wrapper plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/023-pi-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Execute T001 to run the Pi turn_end-mutation probe and record the verdict."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-023-pi-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The turn_end-mutation probe verdict selects the integration path before any wiring."
      - "The conservative wrapper path in pi print mode is the expected outcome."
      - "Whichever path is chosen, projection is gated on isProjectionEnabled() and fails open to the byte-exact original."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 023 Pi Wrapper

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Pi extension API (`turn_end`) or Pi CLI print mode, plus the Phase 020 CLI-output wrapper framework |
| **Framework** | The Phase 017 seam contract and the Phase 018 `projectMessage()` entrypoint |
| **Storage** | In-memory at the seam; no transcript persistence change |
| **Testing** | Probe-verdict tests, path tests, gate tests, and exact-original fallback tests plus `npm run check` |

### Overview

Answer the Pi `turn_end`-mutation question with a recorded verdict, then wire the single validated path. If the probe shows mutation works, author a Pi extension that projects via `turn_end`. If it does not, which is expected, route Pi through the Phase 020 CLI-output wrapper in `pi` print mode with the Pi runtime adapter. Every seam entry consults `isProjectionEnabled()` and fails open to the byte-exact original.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The Phase 017 Pi feasibility note is read and the `turn_end` read-only finding is understood.
- [x] The Phase 020 wrapper seam contract and the Phase 018 `projectMessage()` entrypoint are inventoried.
- [x] The Pi version pinned for the mutation probe and the probe procedure are defined.

### Definition of Done

- [x] All six P0 requirements have observed evidence.
- [x] The `turn_end`-mutation question is answered with a recorded, observable verdict.
- [x] Pi projects on the validated path with the byte-exact original on disable or failure, and strict packet validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A probe-first wiring: validate the Pi `turn_end` mutation capability, then adapt the single validated path into the Phase 018 `projectMessage()` entrypoint behind the shared seam contract.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| `turn_end` mutation probe | Mutates a rendered Pi bubble through a `turn_end` handler and records the observable verdict |
| Pi extension (if mutation works) | Registers the `turn_end` handler that projects the delivered message when the gates pass |
| Pi runtime adapter | Maps `pi` print-mode output onto the assembler event shape when the wrapper path is chosen |
| CLI-output wrapper seam (Phase 020) | Captures, transforms, and re-renders `pi` print-mode output when the wrapper path is chosen |
| Enablement gate | `isProjectionEnabled()` consulted at every seam entry before projecting |

### Data Flow

Pi rendered message -> `turn_end` handler or `pi` print-mode capture -> seam (`isProjectionEnabled()`, capability and fidelity checks) -> `projectMessage()` -> projected render or byte-exact original.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Pi `turn_end` event | Delivers the ending assistant message, read-only | Probe whether a handler can mutate the rendered bubble | Recorded probe verdict |
| Pi extension surface | Registers Pi lifecycle handlers | Add the projection handler only if the probe verdict supports it | Extension registration tests |
| Pi CLI print mode | Surfaces the final assistant message for headless runs | Route captured output through the wrapper when the wrapper path is chosen | Wrapper path tests |
| Phase 020 wrapper framework | Owns the capture-transform-re-render seam | Consumed, never modified | Seam contract review |
| Phase 018 `projectMessage()` | Owns the projection stage order | Called, never modified | Entrypoint tests stay green |
| Shared gates | `isProjectionEnabled()` | Consulted before projecting | Disabled-matrix tests |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read the Phase 017 Pi feasibility note and inventory the Phase 020 wrapper seam, the Phase 018 entrypoint, and the Pi extension surface.
- [x] Define the `turn_end`-mutation probe procedure and pin the Pi version under test.

### Phase 2: Implementation

- [x] Run the `turn_end`-mutation probe and record the observable verdict.
- [x] Wire the single validated path: the `turn_end` extension if mutation works, else the Phase 020 wrapper in `pi` print mode with the Pi runtime adapter.
- [x] Gate the seam on `isProjectionEnabled()` and fail open to the byte-exact original on any error.

### Phase 3: Verification

- [x] Run the probe-verdict, path, gate, and exact-original fallback tests.
- [x] Confirm canonical bytes stay unchanged and the disabled matrix passes.
- [x] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Probe verdict | The `turn_end`-mutation probe records a reproducible observable verdict | Pi extension probe harness |
| Chosen path | The extension or wrapper path projects the delivered message | Path tests on the selected surface |
| Gate matrix | Flag on/off on the chosen seam | Gate tests |
| Fallback | Error, throw, timeout, and non-accept terminals restore the byte-exact original | Fallback tests |
| Boundary | No stdout or stderr writes from the extension; canonical bytes unchanged | Console capture and byte comparisons |
| Packet integrity | Planned Level-2 packet validates cleanly | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 020 CLI-output wrapper framework | Internal | Required by plan | The wrapper fallback path is unavailable |
| Phase 017 Pi feasibility note | Internal | Available | The `turn_end` read-only finding is unrecorded |
| Phase 018 `projectMessage()` | Internal | Required by plan | Pi cannot project without the entrypoint |
| Phase 016 enablement gate | Internal | Available | The seam cannot be gated |
| Pi extension API and print mode | External | Available | Neither the extension nor the wrapper path can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the probe verdict is wrong, Pi projects when disabled, the original is lost, or the extension or wrapper throws into the session.
- **Procedure**: stop the projection handler or wrapper, restore any Pi messages touched during the attempt, rerun the tests, and confirm canonical bytes and default-off behavior.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Feasibility read + inventory -> Mutation probe -> Validated-path wiring -> Gate and fallback verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Feasibility and inventory | Phase 017, 018, 020, and 016 deliverables | Mutation probe |
| Mutation probe | Complete inventory | Validated-path wiring |
| Validated-path wiring | Recorded probe verdict | Verification |
| Verification | Implemented path | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Feasibility read and inventory | Low | 0.5 day |
| Mutation probe and path wiring | Medium | 1-2 days |
| Verification and handoff | Medium | 1-2 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Record the Pi version pinned for the probe and the wrapper baseline.
- [x] Capture the Phase 018 entrypoint and gate contract references.
- [x] Confirm the Pi extension boundary (no terminal output) is preserved.

### Procedure

1. Stop the projection handler or wrapper and remove the new extension or adapter files.
2. Re-run the tests to confirm the baseline.
3. Confirm canonical transcripts, events, and tool results are byte-unchanged.
4. Rerun strict packet validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Remove the projection handler or wrapper files and restore any Pi messages touched during the attempt.
<!-- /ANCHOR:enhanced-rollback -->
