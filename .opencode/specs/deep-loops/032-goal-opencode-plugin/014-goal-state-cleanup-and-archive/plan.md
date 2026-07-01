---
title: "Implementation Plan: Phase 14: goal-state-cleanup-and-archive [template:level_1/plan.md]"
description: "Archive-then-prune goal state on session.deleted; throttled orphan sweep on session.created for sessions that never fire session.deleted."
trigger_phrases:
  - "implementation"
  - "plan"
  - "goal state cleanup"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/014-goal-state-cleanup-and-archive"
    last_updated_at: "2026-07-01T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan for the goal-state cleanup/archive finding"
    next_safe_action: "Run /speckit:implement on this phase"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-032-014"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 14: goal-state-cleanup-and-archive

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (ESM), OpenCode plugin runtime |
| **Framework** | `.opencode/plugins/mk-goal.js` (single-file plugin) |
| **Storage** | Flat per-session JSON goal state (`.opencode/skills/.goal-state/`), new `.archive/` subdirectory |
| **Testing** | `.opencode/plugins/__tests__/mk-goal-lifecycle.test.cjs` (existing event-lifecycle test file) |

### Overview
Three new helpers reusing existing primitives (`rename`, already imported; the `ENOENT`-tolerant try/catch pattern from `deleteGoalFile`; the in-memory `runtimeState` volatile-lock pattern for the sweep throttle), wired into the two lifecycle events that already exist (`session.deleted`, `session.created`). No new files, no new scheduler, no new state-store schema.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (filesystem-inspection tests, no operator decision needed)
- [x] Dependencies identified (none — independent of 010-013)

### Definition of Done
- [ ] REQ-001 through REQ-004 met
- [ ] Existing test suite (6 files + phase 012's additions) still green
- [ ] `implementation-summary.md` cites fresh execution evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three additive helper functions plus two call-site wirings; no new components or files beyond the runtime-created `.archive/` subdirectory.

### Key Components
- **`archiveGoalStateFile(sessionID, rawOptions)`**: new. Mirrors `deleteGoalFile`'s (`mk-goal.js:769`) `ENOENT`-tolerant try/catch, but uses `rename` (already imported at the top of the file) to move the file into `.goal-state/.archive/` instead of `unlink`-ing it. Ensures `.archive/` exists via the same `mkdir(..., {recursive: true, mode: 0o700})` pattern `ensureGoalStateDir` (`mk-goal.js:607`) already uses.
- **`pruneArchive(rawOptions)`**: new. Lists `.archive/` entries, `unlink`s any whose mtime exceeds `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS` (new env var, default 90). Called at the end of `archiveGoalStateFile` (piggyback, no separate scheduler).
- **`sweepOrphanedActiveStates(rawOptions)`**: new. Lists active `.goal-state/*.json` entries (excluding `.archive/`), archives any whose stored `updatedAtMs` exceeds `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS` (new env var, default 30). Throttled via a new `runtimeState.lastSweepAtMs` in-memory timestamp checked against `MK_GOAL_STATE_SWEEP_INTERVAL_MS` (new env var, default 3,600,000ms/1hr) — same in-memory, restart-resets pattern already used for `inFlightVerifications`/`blockedByPromptSessions` etc.
- **`session.deleted` handler** (`mk-goal.js:1672`): call `archiveGoalStateFile` alongside the existing `flushVolatileLocks(sessionID)`.
- **`session.created` handler** (`mk-goal.js:1611`): call `sweepOrphanedActiveStates` (throttle-gated) alongside the existing `restoreActiveGoal`.

### Data Flow
`session.deleted` → archive file → prune archive (piggyback) → (existing) flush in-memory locks.
`session.created` → (existing) restore active goal → if sweep due, scan active dir → archive orphans.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

New finding (operator-reported), not from either audit. Touches persistence (state-file lifecycle) — table below follows the fix-addendum format since it's a persistence-affecting change.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `session.deleted` handler (`mk-goal.js:1672`) | Only calls `flushVolatileLocks` (in-memory only) | Add `archiveGoalStateFile` call | Test: state file present before, absent from `.goal-state/`, present in `.goal-state/.archive/` after |
| `session.created` handler (`mk-goal.js:1611`) | Only calls `restoreActiveGoal` | Add throttled `sweepOrphanedActiveStates` call | Test: stale active file gets archived on a due sweep; a second `session.created` inside the throttle window does not re-scan |
| `deleteGoalFile` (`mk-goal.js:769`) | Existing delete-on-clear helper | Unchanged — pattern reused, not modified | Existing `/goal clear` tests stay green |
| `.opencode/skills/.goal-state/` | Active state directory, grows unboundedly today | New `.archive/` subdirectory added under it | `ls .goal-state/.archive/` after a `session.deleted` test |

Required inventories:
- Same-class producers: `rg -n 'deleteGoalFile|flushVolatileLocks|ensureGoalStateDir' .opencode/plugins/mk-goal.js` to confirm the exact patterns being mirrored.
- Consumers of changed symbols: `rg -n 'session\.deleted|session\.created' .opencode/plugins/__tests__/*.test.cjs` to find every existing test exercising these two event branches, so none regress.
- Matrix axes: (a) archive-on-delete with vs without a pre-existing state file, (b) archive entries inside vs outside the retention window, (c) active states inside vs outside the active-retention window, (d) sweep due vs throttled (inside the interval).
- Algorithm invariant: a session actively being mutated (recent `updatedAtMs`) must never be swept as an orphan — retention windows are set in days, mutation activity is measured in the same run, so there is no overlap; verify with an explicit "recent active state survives the sweep" test case.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-read `deleteGoalFile`, `ensureGoalStateDir`, `flushVolatileLocks`, and the `session.deleted`/`session.created` handler bodies to confirm exact line numbers and signatures before editing.

### Phase 2: Core Implementation
- [ ] REQ-001: add `archiveGoalStateFile`, wire into `session.deleted`.
- [ ] REQ-002: add `pruneArchive`, called from `archiveGoalStateFile`.
- [ ] REQ-003: add `sweepOrphanedActiveStates` with throttling, wire into `session.created`.
- [ ] REQ-004: wrap all three in fail-open try/catch (no throw out of `event()`).

### Phase 3: Verification
- [ ] New tests for REQ-001 through REQ-004 land in `mk-goal-lifecycle.test.cjs`.
- [ ] Existing 6-file suite (+ phase 012's additions) still passes, freshly executed.
- [ ] `implementation-summary.md` filled with fresh evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression (existing) | All 6 `mk-goal-*.test.cjs` files must stay green | `node` direct execution |
| New unit/integration | Archive-on-delete, retention prune, orphan sweep, throttle, fail-open | Synthetic mtimes/`updatedAtMs` via direct file writes in temp `stateDir`s (no real multi-day waits) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| None — fully independent of phases 010-013 | N/A | Green | N/A |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: archiving/pruning/sweeping regresses an existing test, or introduces observable latency on session teardown/creation.
- **Procedure**: all changes are additive and isolated to `.opencode/plugins/mk-goal.js` plus one test file; `git checkout -- <files>` cleanly reverts with no state-file migration to undo (the `.archive/` subdirectory, if created, can simply be left in place or removed — it holds no data the plugin depends on for correctness).
<!-- /ANCHOR:rollback -->
