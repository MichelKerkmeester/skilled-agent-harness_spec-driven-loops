---
title: "Implementation Plan: Phase 022 Codex Wrapper"
description: "Wire Codex output projection through the Phase 020 CLI-output wrapper, map the JSON-stream envelope through the Codex runtime adapter, and verify the enablement gate and fail-open fallback."
trigger_phrases:
  - "codex-wrapper"
  - "implementation plan"
  - "codex output projection"
  - "codex json stream envelope"
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
      - "plan.md"
      - "spec.md"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 022 Codex Wrapper

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript wrapper and adapter on the `cli-communication-projection` package |
| **Framework** | Phase 020 CLI-output wrapper; Codex runtime adapter; headless `codex exec` JSON-stream capture |
| **Storage** | Captured in-memory stream only; no transcript persistence change |
| **Testing** | Adapter mapping, enablement gate, and fail-open fallback tests plus the wrapper test gate |

### Overview

Wire Codex as the second wrapper-based runtime. Run `codex exec` in its non-interactive JSON-stream mode, map the output envelope through the Codex runtime adapter onto the assembler event shape, re-render through `projectMessage()`, gate on `isProjectionEnabled()`, and fail open to the byte-exact original. Keep the Phase 020 wrapper, the entrypoint, and canonical bytes unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Codex's actual headless and JSON-stream flags are identified from its CLI and pinned.
- [x] A captured `codex exec --json` stream fixture records the event envelope shape.
- [x] The Phase 020 wrapper entry, the adapter surface, and the test gate are inventoried.

### Definition of Done

- [x] All eight requirements have observed evidence.
- [x] A headless Codex run projects when enabled and shows the byte-exact original otherwise.
- [x] The adapter, gate, and fallback tests pass and strict packet validation reports zero errors and warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A wrapper capture path around the headless Codex process: capture the JSON-stream output, map each event through the Codex runtime adapter, assemble, re-render through `projectMessage()`, gate on `isProjectionEnabled()`, and fail open to the byte-exact original.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Codex executor entry | Runs `codex exec` in non-interactive JSON-stream mode and captures the output stream |
| Codex runtime adapter | Maps Codex's output envelope onto the assembler event shape |
| Phase 020 wrapper | Owns `projectMessage()`, `isProjectionEnabled()`, and the fail-open byte-exact fallback |
| Codex wrapper tests | Cover the adapter mapping, the enablement gate, and the fail-open fallback |

### Data Flow

`codex exec --json` stream -> captured events -> Codex runtime adapter mapping -> assembler event shape -> `projectMessage()` re-render -> `isProjectionEnabled()` gate -> projected output or byte-exact original.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Phase 020 wrapper | Owns projection entry and gate | Add the Codex executor entry that routes the captured stream | Wrapper test gate |
| `src/runtimes/codex.ts` | Maps Codex events onto the envelope | Verify and extend the mapping to the CLI JSON-stream shape | Adapter mapping tests |
| Codex wrapper tests | Cover the integration | Add mapping, gate, and fallback coverage | Wrapper test gate |
| Phase and parent packet docs | Record and route completion state | Create Phase 022 and wire parent links | Strict validation and graph backfill |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Identify the actual headless and JSON-stream flags from the Codex CLI and pin them.
- [x] Capture a `codex exec --json` stream fixture and record its event envelope shape.
- [x] Inventory the Phase 020 wrapper entry, the Codex adapter surface, and the test gate.

### Phase 2: Implementation

- [x] Author the Codex executor entry on the Phase 020 wrapper.
- [x] Verify and extend the Codex runtime adapter mapping to the CLI JSON-stream envelope.
- [x] Route the assembled message through `projectMessage()`, gated on `isProjectionEnabled()`, fail-open to the byte-exact original.

### Phase 3: Verification

- [x] Run the adapter mapping, enablement gate, and fail-open fallback tests.
- [x] Confirm a headless Codex run projects when enabled and shows the byte-exact original when off or on failure.
- [x] Run the wrapper test gate and strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Adapter mapping | Codex JSON-stream envelope to assembler event shape | Adapter unit tests against the captured fixture |
| Enablement gate | `isProjectionEnabled()` on and off paths | Gate tests through the wrapper |
| Fail-open fallback | Malformed events, rejected mappings, and projection errors | Fallback tests asserting byte-exact output |
| Regression | Canonical bytes, transcripts, and wrapper behavior | Existing fidelity and wrapper suites |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 020 CLI-output wrapper | Internal | Predecessor | Codex cannot route through `projectMessage()` or the gate |
| Phase 021 Claude Code wrapper | Internal | Predecessor | The wrapper seam precedent is unavailable to mirror |
| Codex runtime adapter | Internal | Available | The envelope cannot be mapped onto the assembler shape |
| Codex CLI headless and JSON-stream flags | External | To confirm | An assumed flag set silently no-ops or corrupts the stream |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The wrapper corrupts a Codex stream, projects when disabled, or changes canonical bytes.
- **Procedure**: Disable the Codex executor entry so Codex runs unfiltered, rerun the wrapper test gate, and confirm the captured stream and canonical bytes stay byte-exact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Flag identification and fixture capture -> Executor and adapter wiring -> Gate and fallback verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Flag identification and fixture capture | Codex CLI and the Phase 020 wrapper | Executor and adapter wiring |
| Executor and adapter wiring | Pinned flags and fixture | Gate and fallback verification |
| Gate and fallback verification | Completed wiring | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Flag identification and fixture capture | Medium | 0.5-1 day |
| Executor and adapter wiring | Medium | 1-2 days |
| Gate and fallback verification | Low | 0.5-1 day |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Record the pinned Codex CLI version and the identified flags.
- [x] Capture the byte-exact `codex exec --json` stream baseline.
- [x] Confirm the Phase 020 wrapper and canonical bytes are unchanged.

### Procedure

1. Remove or disable the Codex executor entry on the wrapper.
2. Restore the Codex runtime adapter mapping only if it regressed.
3. Replay the captured stream fixture and the wrapper test gate.
4. Confirm the stream and canonical bytes match the baseline.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Revert the Codex executor entry and adapter mapping only.
<!-- /ANCHOR:enhanced-rollback -->
