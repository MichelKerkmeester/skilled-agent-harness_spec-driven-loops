---
title: "Implementation Plan: Phase 024 Devin Wrapper"
description: "Wire Devin through the CLI-output wrapper by capturing a non-interactive `devin -p` print run, mapping it through the Devin runtime adapter into projectMessage(), re-rendering under the enablement gate, and failing open to the byte-exact original."
trigger_phrases:
  - "devin-wrapper"
  - "implementation plan"
  - "devin -p print projection plan"
  - "devin runtime adapter wiring plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/024-devin-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Confirm the `devin -p` print-mode capture shape, then wire the adapter."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "plan.md"
      - "spec.md"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 024 Devin Wrapper

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript wrapper surface in the projection package plus the Devin CLI |
| **Framework** | Node child-process capture of `devin -p`; the existing Devin runtime adapter surface |
| **Storage** | In-memory wrapper-side state holding the exact original for byte-exact restore; no persistence |
| **Testing** | vitest adapter, gate, and fallback tests plus a live `devin -p` single-turn probe |

### Overview

Wire Devin as the next wrapper runtime. The wrapper runs `devin -p` non-interactively and single-turn, captures the printed stdout, routes it through the Devin runtime adapter onto the assembler event envelope shape, feeds the adapted event into the Phase 018 `projectMessage()` entrypoint, re-renders the accepted projection, and fails open to the byte-exact original on any error or disabled state.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Devin's single-turn print behaviour is confirmed from its CLI with a live `devin -p` probe.
- [x] The Phase 020 wrapper seam, the `devinRuntimeAdapter`, and the `projectMessage()` entrypoint are inventoried.
- [x] The fail-open and byte-exact-restore seam contract is reviewed.

### Definition of Done

- [x] All eight requirements have observed evidence.
- [x] With the flag on a `devin -p` run shows the projection; with the flag off or on any failure it shows the byte-exact original.
- [x] The adapter, gate, and fallback tests pass and strict packet validation reports zero errors and warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A fail-open Devin wrapper that adapts the Phase 020 CLI-output wrapper into the existing `devinRuntimeAdapter` and the Phase 018 `projectMessage()` entrypoint, with wrapper-side state holding the exact original for byte-exact restore.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Print-mode capture | Runs `devin -p` non-interactively and single-turn with a `--` separator and `/dev/null` stdin, capturing stdout |
| Devin runtime adapter | Maps the captured output, wrapped as a Devin ACP event, onto the assembler event envelope shape |
| `projectMessage()` call | The Phase 018 entrypoint that produces a validated projection or the exact original |
| Enablement gate | `isProjectionEnabled()` consulted before any provider call |
| Wrapper-side original state | Holds the byte-exact print output for restore on any non-accept terminal |

### Data Flow

`devin -p` stdout -> capture -> Devin runtime envelope -> `devinRuntimeAdapter.adapt()` -> assembler event envelope -> gate passes? -> `projectMessage()` -> accept? -> re-render the projection : restore the byte-exact original.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-communication/cli-communication-projection/src/runtime/wrappers/` | Hosts the wrapper-based runtime surfaces | Add `devin.ts` | Wrapper tests plus directory inventory |
| `.opencode/skills/sk-communication/cli-communication-projection/test/runtime/wrappers/` | Hosts wrapper regression suites | Add `devin.test.ts` | vitest suite passes |
| `src/runtimes/devin.ts` | Owns the Devin ACP adapter mapping | Called, never modified | Adapter tests stay green |
| Phase 018 `projectMessage()` | Owns the projection stage order | Called, never modified | Entrypoint tests stay green |
| Phase 016 `isProjectionEnabled()` | Default-off enablement gate | Consulted before projection | Disabled-matrix wrapper tests |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm Devin's single-turn print behaviour from its CLI with a live `devin -p` probe.
- [x] Inventory the Phase 020 wrapper seam, the `devinRuntimeAdapter`, and the `projectMessage()` entrypoint.

### Phase 2: Implementation

- [x] Author the print-mode capture running `devin -p` non-interactively and single-turn.
- [x] Route the captured output through `devinRuntimeAdapter.adapt()` onto the assembler event envelope shape.
- [x] Feed the adapted event into `projectMessage()` and re-render under `isProjectionEnabled()`.

### Phase 3: Verification

- [x] Run the adapter, gate, and fallback tests.
- [x] Confirm canonical bytes stay unchanged and the disabled matrix passes.
- [x] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Single-turn probe | `devin -p` prints once, exits, and honours `--` with `/dev/null` stdin | Live Devin CLI |
| Adapter mapping | Captured print output maps through `devinRuntimeAdapter.adapt()` to the assembler shape | vitest |
| Gate matrix | Flag on/off crossed with adapter accept/reject terminals | `devin.test.ts` |
| Fallback | Error, throw, timeout, and non-accept terminals restore byte-exact originals | vitest |
| Packet integrity | Planned Level-2 packet validates cleanly | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 020 CLI-output wrapper | Internal | Required by plan | The capture, re-render, and fail-open seam is unavailable |
| Phase 018 `projectMessage()` entrypoint | Internal | Required by plan | The wrapper cannot project without the entrypoint |
| Phase 016 `isProjectionEnabled()` gate | Internal | Available | Projection cannot be gated first |
| Devin runtime adapter | Internal | Available | Print output cannot map onto the assembler event shape |
| Devin CLI `-p` mode | External | Available | The single-turn print capture cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the wrapper projects when disabled, loses the exact original, throws into the session, or `devin -p` does not print in the captured shape.
- **Procedure**: remove the Devin wrapper and its test file, restore any rendered output touched during the attempt, rerun the wrapper and adapter suites, and confirm canonical bytes and default-off behavior.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Single-turn probe + inventory -> Wrapper capture and adapter route -> Gate, re-render, and fallback verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Probe and inventory | Phase 020, Phase 018, and Phase 016 deliverables | Wrapper implementation |
| Wrapper implementation | Confirmed probe and inventory | Verification |
| Verification | Implemented wrapper | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Single-turn probe and inventory | Low | 0.5 day |
| Wrapper capture and adapter route | Medium | 1-2 days |
| Verification and handoff | Medium | 1-2 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Record the current wrapper and adapter test baseline.
- [x] Capture the `devin -p` print-mode shape and the seam contract references.
- [x] Confirm the fail-open and byte-exact-restore behavior is preserved.

### Procedure

1. Remove the Devin wrapper and its test file.
2. Re-run the wrapper and adapter suites to confirm the baseline.
3. Confirm canonical transcripts, events, and tool results are byte-unchanged.
4. Rerun strict packet validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Remove the wrapper files and restore any rendered output touched during the attempt.
<!-- /ANCHOR:enhanced-rollback -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm Devin's `-p` single-turn print behaviour and the Phase 020 seam before authoring the wrapper.
- Re-read every target file before editing and keep writes inside the wrapper and packet surfaces.
- Translate each requirement into an observable check before claiming completion.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Do not build the adapter mapping before the single-turn probe is confirmed. |
| TASK-SCOPE | Modify only the Devin wrapper, its test file, and this packet. |
| TASK-PROOF | Run focused checks, then rerun the authoritative wrapper and adapter suites and strict validation from the final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=024 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If `devin -p` does not print in the captured shape, the Phase 020 seam is unavailable, or any fallback check disagrees with this plan, mark the task blocked, preserve the fail-open and byte-exact-restore behavior, and update the decision record before resuming.
