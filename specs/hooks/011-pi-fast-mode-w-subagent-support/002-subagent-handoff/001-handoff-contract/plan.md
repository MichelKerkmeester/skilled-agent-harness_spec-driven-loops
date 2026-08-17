---
title: "Implementation Plan: Phase 1 handoff-contract"
description: "Implement and test the strict fork-owned environment contract."
trigger_phrases:
  - "handoff-contract plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/001-handoff-contract"
    last_updated_at: "2026-08-16T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented strict parser/writer; contract tests green"
    next_safe_action: "Continue the 002-subagent-handoff workstream"
    blockers: []
    key_files: ["../../context/pi-gpt-fast-mode/src/handoff.ts"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Phase 1 handoff-contract

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Pi Extension API types |
| **Storage** | Process environment |
| **Testing** | Vitest pure tests |

### Overview
Create one constant and two small helpers. `readHandoff` accepts only exact `1`/`0`; `writeHandoff` emits only those strings. Keep the module independent of Pi UI, config, and provider payloads.

The strict-parser contract mirrors `context/pi-gpt-fast-mode/src/handoff.ts:1-19`:

| Input | Result |
|-------|--------|
| `"1"` | `true` |
| `"0"` | `false` |
| unset / any other value | `undefined` (no opinion) |

`writeHandoff` emits only the normalized `"1"` or `"0"` string, so an invalid value can never enable a paid priority tier by accident.

A namespace scan across installed packages, pinned sources, and user `.pi` (research Section 6) found no existing `PI_FAST_MODE*` variable, so `PI_FAST_MODE_W_SUBAGENT_SUPPORT` is collision-free.


<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Namespace is approved and collision scan is planned.
- [x] Reference handoff behavior is cited.

### Definition of Done
- [x] Read/write and invalid-input tests pass.
- [x] Parent-only ownership is documented.
- [x] No runtime dependency is added.


<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pure env adapter with explicit normalization.

### Key Components
- `HANDOFF_ENV`: one stable name.
- `readHandoff`: `true`, `false`, or `undefined`.
- `writeHandoff`: normalized in-place write to a supplied env object.

### Data Flow
Boolean state → normalized env string → child process copy → strict read.


<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `src/handoff.ts` | No handoff module in the fork yet | Create strict `readHandoff`/`writeHandoff` helpers | Pure Vitest contract matrix |
| `src/types.ts` | Shared constants and types | Add the `HANDOFF_ENV` key constant and the `boolean \| undefined` preference type | `npm run typecheck` |

The parent-only-writer POLICY is documented in this leaf; its wiring (toggle/flag writes and `session_start` reads) is owned by `002-session-precedence`.

<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scan existing `PI_*` names and confirm no collision.

### Phase 2: Core Implementation
- [x] Add the constant and helpers.
- [x] Add pure unit tests.

### Phase 3: Verification
- [x] Run focused handoff tests and typecheck.
- [x] Record exact parser matrix.


<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `1`, `0`, unset, invalid, round-trip | Vitest |
| Static | Namespace and ownership | `rg` |


<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `pi-gpt-fast-mode` handoff reference | Internal snapshot | Green | Contract must be re-derived |
| Node/Vitest | Toolchain | Green | Unit gate unavailable |


<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Parser accepts unexpected values or tests reveal a naming conflict.
- **Procedure**: Remove the new helper/constant/test and return to the package baseline.
<!-- /ANCHOR:rollback -->
