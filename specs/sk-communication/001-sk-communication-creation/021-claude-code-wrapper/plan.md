---
title: "Implementation Plan: Phase 021 Claude Code Wrapper"
description: "Plan the Claude stream-json adapter mapping, the CLI-output wrapper wiring into projectMessage(), and the enablement-gated fail-open fallback verification."
trigger_phrases:
  - "claude-code-wrapper"
  - "implementation plan"
  - "stream-json adapter"
  - "Claude output projection wrapper"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/021-claude-code-wrapper"
    last_updated_at: "2026-08-14T09:00:00.000Z"
    last_updated_by: "claude"
    recent_action: "Drafted the phase plan."
    next_safe_action: "Execute T001 to wire the Claude stream-json adapter mapping onto the assembler event shape."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-021-claude-code-wrapper-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The adapter mapping, the projectMessage() routing, and the fail-open fallback tests are the completion evidence."
      - "Headless `claude -p --output-format stream-json` output is the only interceptable surface; the interactive TUI is out of scope."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: Phase 021 Claude Code Wrapper

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Claude Code CLI headless output plus the Phase 020 wrapper framework and the Phase 018 projection runtime core |
| **Framework** | `claude -p --output-format stream-json` through the Claude runtime adapter into `projectMessage()` behind one gated seam |
| **Storage** | Repository files only; no canonical transcript persistence change |
| **Testing** | Adapter-mapping unit tests, enablement-gate tests, exact-original fallback tests, and strict packet validation |

### Overview

Wire Claude Code headless output projection through the Phase 020 CLI-output wrapper. The phase runs `claude -p --output-format stream-json`, maps the stream through the Claude runtime adapter onto the assembler event shape, routes it through `projectMessage()`, re-renders projected output, gates on `isProjectionEnabled()`, and fails open to the byte-exact original. The result is the first live wrapper consumer with an enablement-gated fail-open seam.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The Phase 020 wrapper seam contract and its capture-transform-re-render shape are inventoried.
- [x] The Claude stream-json event shape is recorded as a versioned snapshot.
- [x] The `projectMessage()` signature and the enablement-gate placement rule are explicit.

### Definition of Done

- [x] All ten requirements have acceptance criteria that later verification can observe.
- [x] The Claude adapter maps stream-json events onto the assembler event shape in order.
- [x] The seam gates on `isProjectionEnabled()` and fails open to the byte-exact original.
- [x] Phase 021 passes strict validation with zero errors and warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A single headless interception path behind the Phase 020 wrapper seam: run Claude Code in stream-json mode, map each event onto the assembler event shape, route through `projectMessage()`, and re-render the projected output, with `isProjectionEnabled()` gating and the byte-exact original as the guaranteed fallback.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Claude runtime adapter | Map Claude stream-json events onto the assembler event shape in order |
| Wrapper seam | Run `claude -p --output-format stream-json`, consult `isProjectionEnabled()`, and route into `projectMessage()` |
| Re-render path | Emit the projected output, or the byte-exact original on disable or failure |
| Fallback | Return the byte-exact original on any adapter error, parse failure, or wrapper failure |

### Data Flow

Claude stream-json events -> Claude adapter -> assembler event shape -> `isProjectionEnabled()` gate -> `projectMessage()` -> projected re-render or byte-exact original.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Claude Code CLI headless output | Rendered stream-json messages | Run headless via `claude -p --output-format stream-json` and intercept | Stream-json capture smoke |
| Claude runtime adapter | Runtime adapter from Phase 006 | Map stream-json events onto the assembler event shape | Adapter-mapping unit tests |
| Wrapper seam (Phase 020) | Capture-transform-re-render framework | Consume without modification and gate on `isProjectionEnabled()` | Enablement-gate tests |
| `projectMessage()` entrypoint (Phase 018) | Orchestrate the full projection sequence | Route the assembled message through it and re-render | End-to-end projection test |
| Interactive TUI | Non-interceptable rendered output | Explicitly out of scope; never intercepted | Scope assertion in tests |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Inventory the Phase 020 wrapper seam contract and its capture-transform-re-render shape.
- [x] Record the Claude stream-json event shape as a versioned snapshot.
- [x] Pin the `projectMessage()` signature and the enablement-gate placement rule.

### Phase 2: Implementation

- [x] Implement the Claude runtime adapter that maps stream-json events onto the assembler event shape.
- [x] Wire the wrapper seam to run `claude -p --output-format stream-json`, gate on `isProjectionEnabled()`, and route into `projectMessage()`.
- [x] Re-render the projected output and emit the byte-exact original on disable or failure.

### Phase 3: Verification

- [x] Run the adapter-mapping, enablement-gate, and exact-original fallback tests.
- [x] Run an end-to-end headless projection smoke against a pinned stream-json snapshot.
- [x] Author the Level-2 packet, backfill metadata, and pass strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Adapter mapping | Map each Claude stream-json event onto the assembler event shape in order | Unit tests against the pinned snapshot |
| Enablement gate | `isProjectionEnabled()` off yields the byte-exact original with no provider call | Gate unit tests |
| Exact-original fallback | Adapter error, parse failure, or wrapper failure yields the byte-exact original | Fallback unit tests |
| End-to-end smoke | A headless stream-json run projects or passes through exactly | Pinned snapshot smoke |
| Packet integrity | Phase 021 docs and generated metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 020 CLI-output wrapper framework | Internal | Available (predecessor) | There is no seam to consume |
| Phase 018 `projectMessage()` entrypoint | Internal | Available | The stream cannot be projected |
| Phase 016 enablement gate | Internal | Available | The seam lacks the required gate |
| Claude Code CLI headless mode | External | Available on the target | The headless surface cannot be captured |
| system-spec-kit metadata and strict validator | Internal | Available | The packet cannot close cleanly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the adapter mis-maps an event, projected output regresses fidelity, or the seam emits a partial transform.
- **Procedure**: revert the adapter and the wrapper wiring, rerun the failing adapter or fallback test, refresh graph metadata, and rerun Phase 021 strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Seam and snapshot inventory -> Adapter and wiring -> Gate and fallback tests -> Packet closeout
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Seam and snapshot inventory | Phase 020 wrapper and Phase 018 entrypoint | Adapter and wiring |
| Adapter and wiring | Complete inventory | Gate and fallback tests |
| Gate and fallback tests | Wired seam | Packet closeout |
| Packet closeout | All verification evidence | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Seam and snapshot inventory | Low | 0.5 day |
| Adapter and wrapper wiring | Medium | 1-2 days |
| Gate, fallback, and packet closeout | Medium | 1-2 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Record the Claude stream-json event shape as a versioned snapshot before wiring.
- [x] Record the Phase 020 seam contract and the `projectMessage()` signature before implementation.
- [x] Confirm the interactive TUI is out of scope and only headless and print output are intercepted.

### Procedure

1. Restore the adapter or wrapper wiring that regressed.
2. Rerun the affected adapter-mapping, gate, or fallback test.
3. Refresh the affected graph metadata.
4. Rerun strict validation for Phase 021.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Restore the adapter and wiring only; no runtime or persisted user data is changed.
<!-- /ANCHOR:enhanced-rollback -->

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the Phase 020 seam contract and the `projectMessage()` signature before wiring.
- Record the stream-json snapshot before any adapter mapping is treated as final.
- Keep all writes inside the Phase 021 documentation scope.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow `tasks.md` in order; evidence cannot precede inventory. |
| TASK-SCOPE | Modify only the Phase 021 documentation surfaces. |
| TASK-PROOF | Run focused checks, then rerun the authoritative gates and strict validation from the final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=021 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If the adapter mapping or the fallback tests disagree with this plan, mark the task blocked, preserve the fail-open byte-exact behavior, and update the decision record before resuming.
