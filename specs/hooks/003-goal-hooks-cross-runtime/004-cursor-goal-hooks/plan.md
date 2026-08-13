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
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/004-cursor-goal-hooks"
    last_updated_at: "2026-07-29T04:52:51Z"
    last_updated_by: "claude"
    recent_action: "Built, tested, live-smoked, and registered the sessionStart-only adapter"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - ".opencode/hooks/goal/cursor/goal-inject.mjs"
      - ".cursor/hooks.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "sessionStart uses the prebind workaround pattern, matching spec-gate-prebind."
      - "preToolUse refresh and sessionEnd verify both dropped per phase 002's fixed sessionStart-only tier."
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

Build one adapter, `goal-inject.mjs`, at `.opencode/hooks/goal/cursor/` on top of phase 001's runtime-neutral goal core: `sessionStart` prebind-style injection, the only surface phase 002's capability matrix confirmed as usable for this runtime. `beforeSubmitPrompt` is confirmed non-delivery, `preToolUse`'s `agent_message` is confirmed not spliced into model context, and `stop` never fires — so both the originally-planned `preToolUse` refresh and `sessionEnd` verify adapters are dropped; `sessionStart`-only is Cursor's fixed ceiling, not a starting tier. The adapter is wrapped so a goal-core failure, or malformed/missing stdin, degrades to a silent no-op rather than any block or visible editor impact, since Cursor hooks fire for the shared editor experience, not only CLI dispatch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 001's `lib/goal-core.cjs` has shipped and is importable.
- [x] Phase 002's capability matrix has resolved the `preToolUse` refresh cadence question for Cursor (confirmed non-delivery) and additionally fixed the tier at sessionStart-only (no `sessionEnd` verify either).
- [x] `.cursor/hooks.json`'s current schema/shape has been read and confirmed (direct-run `.mjs` commands, `{permission, user_message, agent_message}` envelope).

### Definition of Done

- [x] `sessionStart` adapter (`goal-inject.mjs`) built, tested, and live-verified injecting the goal brief (RECORDED-EVIDENCE: fires, reads state, returns `agent_message`; model-visibility unproven — see spec.md REQ-001).
- [x] ~~`sessionEnd` adapter built and tested against a met and an unmet goal.~~ DROPPED per phase 002's fixed tier.
- [x] ~~`preToolUse` refresh adapter built and tested, OR its omission is documented per phase 002's finding.~~ Omission documented (phase 002 confirmed non-delivery).
- [x] Fail-open behavior explicitly tested via 4 simulated-error/malformed-input cases.
- [x] `.cursor/hooks.json` registration confirmed correct and live-firing.
- [x] All docs (`spec.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) reconciled with the actual built state.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Per-runtime adapter folder on top of a shared runtime-neutral core, matching the established `.opencode/hooks/<concern>/<runtime>/` pattern used by the other relocated hook concerns in this repo.

### Key Components

- **`goal-inject.mjs`**: reads the shared `active-goal.json` via `goal-core.cjs`'s `readGoalRecord()`, renders the `[active_goal]` block via `renderGoalBrief({goal, runtimeLabel:'Cursor'})`, records the touch via `recordTurn({runtime:'cursor'})`, and returns the block as prebind-style `agent_message` content in Cursor's response envelope. (`renderGoalBrief`'s `goal_prompt` Role line is actually baked in once at `setGoal()` time from whichever runtime *created* the goal, not re-derived from this call's `runtimeLabel` — a shared `goal-core.cjs` detail this phase observed; RESOLVED afterward in a phase-001 core follow-up that relabels the Role line per reading runtime.)
- ~~`pre-tool-use.cjs`~~ — DROPPED (phase 002 confirmed non-delivery).
- ~~`session-end.cjs`~~ — DROPPED (phase 002 fixed the tier at sessionStart-only; no continuation mechanism exists for a verdict to act on).
- **Fail-open wrapper**: `goal-inject.mjs` wraps stdin parsing and the goal-core read/render/record call in `try/catch`, resolving every failure path (malformed/missing stdin, disabled plugin, goal-core throw) to a plain `{"permission":"allow"}` no-op via `process.exit(0)`.

### Data Flow

1. Cursor fires `sessionStart` → adapter reads stdin JSON (fail-open on parse failure) → checks `isPluginDisabled()` → calls `goal-core.cjs`'s `readGoalRecord({cwd})` → on an active goal, renders the brief, calls `recordTurn()`, and returns it as `agent_message`; on no goal, a paused/cleared goal, a disabled plugin, or any error, returns `{"permission":"allow"}` with no `agent_message`.
2. ~~Cursor fires `preToolUse` for an `agent_message` event~~ — not wired (confirmed non-delivery).
3. ~~Cursor fires `sessionEnd`~~ — not wired (no verify/continue mechanism exists to act on a verdict).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm phase 001's `lib/goal-core.cjs` API surface (read/write/render functions) by reading the shipped module.
- [x] Read phase 002's capability matrix for the Cursor `preToolUse` cadence finding — also found the Fixed Parity Tiers section dropping `sessionEnd` verify too.
- [x] Read the current `.cursor/hooks.json` schema and confirm the hook-entry shape expected.

### Phase 2: Implementation

- [x] Build `goal-inject.mjs` with prebind-style injection and fail-open wrapping.
- [x] ~~Build `session-end.cjs`~~ DROPPED per phase 002's fixed tier.
- [x] ~~Build `pre-tool-use.cjs`~~ DROPPED (phase 002 confirmed non-delivery); narrowing documented in spec.md.
- [x] Register the built adapter in `.cursor/hooks.json` (appended to existing `sessionStart` array, all prior entries preserved).

### Phase 3: Verification

- [x] Co-located `node --test` (`goal-cursor.test.mjs`), 10/10 passing, including 4 fail-open cases.
- [x] Live smoke proof via `cursor-agent -p` (Pro-tier authenticated; no editor fallback needed) — 2 isolated-`/tmp`-workspace dispatches, raw-transcript inspection.
- [x] Confirmed `.cursor/hooks.json` hook fires live (turn counter incremented on both dispatches; JSON-valid config).
- [x] Updated `spec.md`/`tasks.md`/`checklist.md`/`implementation-summary.md` with real evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Result |
|-----------|-------|-------|--------|
| Unit | Adapter injection rendering, no-op paths | `node --test` | 6/6 (active-goal injection, turn recording, 4 no-op cases) |
| Unit (fail-open) | Simulated goal-core error / malformed input | `node --test`, forced-exception fixture | 4/4 (malformed stdin, empty stdin, missing-field payload, corrupt state JSON) |
| Live smoke | Real goal text reaching the model | `cursor-agent -p`, isolated `/tmp` workspace, `--trust` | Hook fires + returns content (RECORDED-EVIDENCE); 0/2 dispatches showed the marker in raw model-visible transcript |
| Config | `.cursor/hooks.json` validity and live firing | JSON parse + live session observation | Valid JSON; entry appended after 6 pre-existing entries; fired live (turnsUsed 0→1→2) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 001 `lib/goal-core.cjs` | Internal | Shipped | No injection possible without it. |
| Phase 002 capability matrix | Internal | Shipped | Fixed REQ-005 (`preToolUse` dropped) and REQ-003 (`sessionEnd` dropped). |
| `.cursor/hooks.json` | Internal (config) | Available | Cannot register adapter without confirming its schema. |
| `cursor-agent -p` CLI auth | External | Confirmed (Pro tier, `mkerkmeester@proton.me`) | Not blocked; live smoke ran directly. |
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

- [x] Work stays scoped to `.opencode/hooks/goal/cursor/` and `.cursor/hooks.json` only; no edits to `mk-goal.js` or its OpenCode-only state.
- [x] Fail-open wrapper written and tested before the adapter was registered live in `.cursor/hooks.json`.

### Rollback Procedure

1. Remove the hook entry from `.cursor/hooks.json`.
2. Confirm a fresh Cursor session shows no regression.
3. Fix or revert the adapter file on a clean branch/worktree before re-registering.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: N/A — no data migrations; shared goal state file is owned by phase 001, not this phase.
<!-- /ANCHOR:enhanced-rollback -->
