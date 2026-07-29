---
title: "Implementation Plan: Runtime-neutral goal core + shared active-goal state + manage CLI"
description: "Port mk-goal.js's portable logic (block render, hardening, verifier) into a new runtime-neutral core reading/writing a shared active-goal.json state file, then build a manage CLI mirroring /goal:goal-opencode's router contract, verified with a co-located node --test suite."
trigger_phrases:
  - "goal core plan"
  - "shared active goal plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/001-goal-core-and-state"
    last_updated_at: "2026-07-28T17:38:00Z"
    last_updated_by: "claude"
    recent_action: "Build goal core, CLI and tests; 27/27 pass"
    next_safe_action: "Run capability probes for phase 002"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/lib/goal-core.cjs"
      - ".opencode/hooks/goal/bin/goal.cjs"
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/commands/goal/goal-opencode.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No native token feeds outside OpenCode; usageSource recorded honestly, not fabricated."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Runtime-neutral goal core + shared active-goal state + manage CLI

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | Direct implementation on `skilled/v4.0.0.0` (operator choice, no worktree) |
| **Authority** | `cli-external-orchestration`; new concern `.opencode/hooks/goal/` |
| **Reference Implementation** | `.opencode/plugins/mk-goal.js` (block render, hardening, verifier logic) |
| **Contract Target** | `.opencode/commands/goal/goal-opencode.md` (manage CLI router-contract parity) |
| **Verification** | Co-located `node --test` suite; byte-diff test against a captured mk-goal.js reference render |

### Overview

Read `mk-goal.js` and `goal-opencode.md` to trace their real behavior, then build `.opencode/hooks/goal/lib/goal-core.cjs` (shared-state read/write, block renderer, hardening, verifier, turn/time accounting) and `.opencode/hooks/goal/bin/goal.cjs` (manage CLI), with tests co-located beside each. No runtime hook wiring in this phase — that is phases 003-005, gated on phase 002's capability probes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] `mk-goal.js` read in full for the block-render, hardening, and verifier logic to be ported.
- [x] `goal-opencode.md` read in full for the router contract (actions, `--budget` parsing, error codes) to be mirrored.
- [x] Shared state file path confirmed as `.opencode/skills/.goal-state/active-goal.json`, distinct from mk-goal's per-session files.

### Definition of Done

- [x] `goal-core.cjs` implemented: shared-state atomic read/write, block renderer, ported hardening, ported verifier, turn/time accounting with honest `usageSource` [evidence: `goal-core.cjs`, 686 lines].
- [x] `goal.cjs` (manage CLI) implemented: `set/show/history/clear/complete/pause/resume/doctor`, matching `/goal:goal-opencode`'s envelope and error codes [evidence: `bin/goal.cjs`, 222 lines].
- [x] Co-located `node --test` suite passing for both files [evidence: `goal-core.test.cjs`, 304 lines, 27/27 tests pass].
- [x] Byte-diff test confirms the rendered block matches `mk-goal.js`'s template outside the Role line [evidence: byte-shape render test in the 27-test suite].
- [x] `mk-goal.js` and `goal-opencode.md` confirmed unmodified (`git diff` shows zero changes to either).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Concern-organized module under `.opencode/hooks/goal/`, following the established `.opencode/hooks/<concern>/lib/` pattern used by the other portable hook cores (dispatch, mcp-route-guard, post-edit-quality, task-dispatch): a dependency-free `lib/` core plus a thin CLI entrypoint.

### Key Components

- **`lib/goal-core.cjs`**: shared-state I/O (atomic temp+rename, `0600`), `[active_goal]` block renderer (parameterized Role line), ported `normalizeUserAuthoredText` hardening, ported heuristic verifier, turn/wall-clock accounting.
- **`bin/goal.cjs`** (or `lib/goal-cli.cjs`): manage CLI wrapping `goal-core.cjs`, mirroring `/goal:goal-opencode`'s action set and output envelope.
- **`.opencode/skills/.goal-state/active-goal.json`**: new shared state file, sibling to (not touching) mk-goal's per-session `<hex-session-id>.json` files.

### Control Flow

Read `mk-goal.js` + `goal-opencode.md` -> implement `goal-core.cjs` (state I/O, renderer, hardening, verifier, accounting) -> implement `goal.cjs` CLI wrapping the core -> write co-located tests -> byte-diff the rendered block against a captured mk-goal.js reference -> parity-test the CLI against the router contract -> confirm zero changes to mk-goal.js/goal-opencode.md.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Reference Reading & State Design

- [x] Read `mk-goal.js` in full; extract the exact `[active_goal]` block template, the `normalizeUserAuthoredText` hardening steps, and the heuristic verifier logic.
- [x] Read `goal-opencode.md` in full; extract the router contract (actions, `--budget` parsing, `STATUS=…`/`ACTION=…` envelope, error codes).
- [x] Design the shared `active-goal.json` schema (fields, `usageSource` labeling for non-OpenCode accounting).

### Phase 2: Core Implementation

- [x] Implement `lib/goal-core.cjs` shared-state read/write with atomic temp+rename writes and `0600` permissions [evidence: state roundtrip/atomicity + mode-0600 tests, 27/27 pass].
- [x] Implement the `[active_goal]` block renderer with a parameterized Role line [evidence: byte-shape render + parameterized Role line test].
- [x] Port `normalizeUserAuthoredText` hardening with attribution comments [evidence: marker redaction / homoglyph fold / instruction-override redaction / backtick downgrade tests].
- [x] Port the heuristic verifier with attribution comments [evidence: heuristic verdict tests].
- [x] Implement turn/wall-clock accounting primitives with honest `usageSource` labeling [evidence: `usage: tokens n/a/<budget> (source: turn-count-estimate)`, no native token feed outside OpenCode].

### Phase 3: Manage CLI

- [x] Implement `bin/goal.cjs` actions: `set/show/history/clear/complete/pause/resume/doctor` [evidence: `bin/goal.cjs`, 222 lines].
- [x] Mirror `--budget` parsing and error codes (`INVALID_TOKEN_BUDGET`, `INVALID_OBJECTIVE`, `PLUGIN_DISABLED`) [evidence: CLI error-code tests].
- [x] Mirror the `STATUS=… ACTION=…` output envelope shape [evidence: CLI envelope tests + live CLI smoke test with isolated `MK_GOAL_STATE_DIR`].

### Phase 4: Verification

- [x] Write co-located `node --test` suite for `goal-core.cjs` (atomic-write hygiene, renderer, hardening, verifier, accounting) [evidence: `lib/goal-core.test.cjs`, 304 lines, 27 tests].
- [x] Write co-located `node --test` suite for `goal.cjs` (action coverage, error codes, envelope shape) [evidence: CLI envelope + error-code + `PLUGIN_DISABLED` + bare-text-falls-to-set cases within the 27-test suite].
- [x] Byte-diff test: rendered block vs. a captured `mk-goal.js` reference render, equal outside the Role line [evidence: byte-shape render test].
- [x] Parity test table: CLI actions vs. `goal-opencode.md`'s documented router contract [evidence: CLI envelope + error-code tests].
- [x] Confirm `git diff` shows zero changes under `.opencode/plugins/mk-goal.js` and `.opencode/commands/goal/goal-opencode.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool or Evidence |
|-----------|-------|-------------------|
| Unit | `goal-core.cjs` state I/O, renderer, hardening, verifier, accounting | `node --test`, co-located |
| Unit | `goal.cjs` manage CLI actions and error codes | `node --test`, co-located |
| Parity/Diff | Rendered `[active_goal]` block vs. `mk-goal.js`'s template | Byte-diff test outside the Role line |
| Parity | Manage CLI action set/envelope/error codes vs. `/goal:goal-opencode`'s router contract | Parity test table |
| Regression | `mk-goal.js` and `goal-opencode.md` unmodified | `git diff` scoped to those two paths |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `.opencode/plugins/mk-goal.js` | Internal (read-only reference) | Available | Cannot port block-render/hardening/verifier logic accurately. |
| `.opencode/commands/goal/goal-opencode.md` | Internal (read-only reference) | Available | Cannot mirror the manage CLI's router contract. |
| None (this is the foundation phase) | — | — | Phases 003, 004, 005 depend on this phase's core and CLI. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The byte-diff test against `mk-goal.js`'s template fails to converge, or the manage CLI cannot be made to match the router contract without changing `goal-opencode.md` itself.
- **Procedure**: This phase is additive only (new files under `.opencode/hooks/goal/`); rollback is deleting the new concern folder and the new shared state file, with zero impact on `mk-goal.js` or existing OpenCode goal behavior.
- **Data impact**: None. The shared `active-goal.json` file is new and unused by any other system until phases 003-005 wire adapters to it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Reference Reading & State Design | None | Core Implementation |
| Core Implementation | Reference Reading & State Design | Manage CLI |
| Manage CLI | Core Implementation | Verification |
| Verification | Manage CLI | Phases 003, 004, 005 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Notes |
|-------|------------|-------|
| Reference Reading & State Design | Low | Two files to read closely, one schema to design. |
| Core Implementation | Medium | Five sub-components (state I/O, renderer, hardening, verifier, accounting) ported/built. |
| Manage CLI | Medium | Eight actions mirroring an existing contract. |
| Verification | Medium | Two test suites plus a byte-diff parity test and a CLI parity test table. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Remediation Controls

- [ ] All new files confined to `.opencode/hooks/goal/` and the new `active-goal.json` state file; nothing under `.opencode/plugins/` or `.opencode/commands/goal/` is touched.

### Rollback Procedure

1. Delete `.opencode/hooks/goal/` and `.opencode/skills/.goal-state/active-goal.json` if this phase must be reverted.
2. No other system references this phase's outputs until phases 003-005 exist, so no cascading cleanup is required.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Delete the new shared state file; no shared-state cleanup elsewhere required.
<!-- /ANCHOR:enhanced-rollback -->
