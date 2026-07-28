---
title: "Implementation Plan: Cursor goal hooks"
description: "Build sessionStart prebind-style injection, an optional preToolUse refresh gated on phase 002, and sessionEnd verify, all wired to .cursor/hooks.json with mandatory fail-open behavior since Cursor hooks are shared with the editor."
trigger_phrases:
  - "cursor goal hooks plan"
  - "cursor prebind injection"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/004-cursor-goal-hooks"
    last_updated_at: "2026-07-28T20:30:00Z"
    last_updated_by: "claude"
    recent_action: "Authored phase spec, plan, tasks, checklist, implementation-summary"
    next_safe_action: "Wait for phase 002's capability matrix before starting Phase 1"
    blockers:
      - "Depends on phase 002's capability-probe matrix for the preToolUse refresh cadence decision."
    key_files:
      - ".opencode/hooks/goal/lib/goal-core.cjs"
      - ".cursor/hooks.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether phase 002 confirms preToolUse agent_message refresh is worth adding."
    answered_questions:
      - "sessionStart uses the prebind workaround pattern, matching spec-gate-prebind."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cursor goal hooks

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS, `.cjs`), matching phase 001's `lib/goal-core.cjs` |
| **Runtime** | Cursor (`.cursor/hooks.json` hook wiring) |
| **Testing** | Co-located `node --test`, plus a live smoke proof |

### Overview

Build three adapters at `.opencode/hooks/goal/cursor/` on top of phase 001's runtime-neutral goal core: `sessionStart` for prebind-style injection (the only reliable injection surface, since `beforeSubmitPrompt` is confirmed non-delivery), `sessionEnd` for the ported heuristic verifier, and an optional `preToolUse` `agent_message` refresh gated entirely on phase 002's capability matrix. Every adapter is wrapped so a goal-core failure degrades to a silent no-op rather than any block or visible editor impact, since Cursor hooks fire for the shared editor experience, not only CLI dispatch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phase 001's `lib/goal-core.cjs` has shipped and is importable.
- [ ] Phase 002's capability matrix has resolved the `preToolUse` refresh cadence question for Cursor.
- [ ] `.cursor/hooks.json`'s current schema/shape has been read and confirmed.

### Definition of Done

- [ ] `sessionStart` adapter built, tested, and live-verified injecting the goal brief.
- [ ] `sessionEnd` adapter built and tested against a met and an unmet goal.
- [ ] `preToolUse` refresh adapter built and tested, OR its omission is documented per phase 002's finding.
- [ ] Fail-open behavior explicitly tested per adapter via a simulated goal-core error.
- [ ] `.cursor/hooks.json` registration confirmed correct and live-firing.
- [ ] All docs (`spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) reconciled with the actual built state.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Per-runtime adapter folder on top of a shared runtime-neutral core, matching the established `.opencode/hooks/<concern>/<runtime>/` pattern used by the other relocated hook concerns in this repo.

### Key Components

- **`session-start.cjs`**: reads shared `active-goal.json` via `goal-core.cjs`, renders the `[active_goal]` block with the Cursor Role line ("Focused Cursor execution agent…"), returns it as prebind-style injected content.
- **`pre-tool-use.cjs`** (conditional): if built, re-reads state on `agent_message` tool events and re-injects a refreshed block at whatever cadence phase 002 proves realistic.
- **`session-end.cjs`**: runs the ported heuristic verifier against the shared state, records the verify outcome via `goal-core.cjs`'s write path.
- **Fail-open wrapper**: a shared `try/catch` pattern (or a tiny local helper, kept dependency-free) around every adapter's entry point that swallows goal-core errors and returns a no-op success shape Cursor expects.

### Data Flow

1. Cursor fires `sessionStart` → adapter calls `goal-core.cjs` read → on success, renders and returns the injection block; on any error, returns no-op.
2. (Optional) Cursor fires `preToolUse` for an `agent_message` event → adapter re-reads state → returns a refreshed block or no-op.
3. Cursor fires `sessionEnd` → adapter calls the ported heuristic verifier against current state → writes the verify result back via `goal-core.cjs`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Confirm phase 001's `lib/goal-core.cjs` API surface (read/write/render functions) by reading the shipped module.
- [ ] Read phase 002's capability matrix for the Cursor `preToolUse` cadence finding.
- [ ] Read the current `.cursor/hooks.json` schema and confirm the hook-entry shape expected.

### Phase 2: Implementation

- [ ] Build `session-start.cjs` with prebind-style injection and fail-open wrapping.
- [ ] Build `session-end.cjs` with the ported heuristic verifier and fail-open wrapping.
- [ ] Build `pre-tool-use.cjs` only if phase 002 confirms cadence support; otherwise document the narrowing.
- [ ] Register all built adapters in `.cursor/hooks.json`.

### Phase 3: Verification

- [ ] Co-located `node --test` per adapter, including a forced-error fail-open case.
- [ ] Live smoke proof via `cursor-agent -p` (fallback: editor session, documented honestly if used).
- [ ] Confirm `.cursor/hooks.json` hooks actually fire live, not just parse.
- [ ] Update `spec.md`/`tasks.md`/`checklist.md`/`implementation-summary.md` with real evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Adapter injection rendering, verify logic | `node --test` |
| Unit (fail-open) | Simulated goal-core error per adapter | `node --test`, forced-exception fixture |
| Live smoke | Real goal text reaching the model | `cursor-agent -p`, or editor session fallback |
| Config | `.cursor/hooks.json` validity and live firing | JSON parse + live session observation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 001 `lib/goal-core.cjs` | Internal | Planned | No injection/verify possible without it. |
| Phase 002 capability matrix | Internal | Planned | REQ-005's `preToolUse` scope stays unresolved. |
| `.cursor/hooks.json` | Internal (config) | Available | Cannot register adapters without confirming its schema. |
| `cursor-agent -p` CLI auth | External | Unconfirmed | Live smoke proof falls back to an editor session; documented if so. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A live Cursor session is found to block, error, or visibly degrade due to a goal-hook adapter.
- **Procedure**: Remove the offending hook entry from `.cursor/hooks.json` immediately (this alone disables the adapter without touching editor behavior further); then fix or revert the adapter file.
- **Data impact**: None — the shared `active-goal.json` state file is untouched by rollback; only Cursor's hook registration changes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 + phase 002 shipped | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Shape |
|-------|------------|------------------|
| Setup | Low | Read 2-3 existing files/specs |
| Implementation | Medium | 2-3 adapter files + fail-open wrapper |
| Verification | Medium | Unit tests per adapter + 1 live smoke proof |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Implementation Controls

- [ ] Work stays scoped to `.opencode/hooks/goal/cursor/` and `.cursor/hooks.json` only; no edits to `mk-goal.js` or its OpenCode-only state.
- [ ] Fail-open wrapper written and tested before any adapter is registered live in `.cursor/hooks.json`.

### Rollback Procedure

1. Remove the hook entry from `.cursor/hooks.json`.
2. Confirm a fresh Cursor session shows no regression.
3. Fix or revert the adapter file on a clean branch/worktree before re-registering.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: N/A — no data migrations; shared goal state file is owned by phase 001, not this phase.
<!-- /ANCHOR:enhanced-rollback -->
