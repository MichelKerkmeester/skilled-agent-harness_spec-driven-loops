---
title: "Feature Specification: Phase 14: goal-state-cleanup-and-archive"
description: "session.deleted never touches the on-disk .goal-state/*.json file, so per-session goal state accumulates forever. Add archive-then-prune cleanup on session teardown plus a throttled sweep for orphaned states from sessions that never fire that event."
trigger_phrases:
  - "goal state cleanup"
  - "goal state archive"
  - "session deleted state file"
  - "orphaned goal state sweep"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/014-goal-state-cleanup-and-archive"
    last_updated_at: "2026-07-01T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from a new user-reported finding (not from either audit)"
    next_safe_action: "Run /speckit:plan or /speckit:implement on this phase"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:d77ab2762b75fd54de78218a12216846f3b92728357faf49f8b680df61cc9d3b"
      session_id: "scaffold-032-014"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 14: goal-state-cleanup-and-archive

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Branch** | `032-goal-opencode-plugin` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 |
| **Predecessor** | 013-design-fidelity-and-polish (independent — can run in either order) |
| **Successor** | 015-packet-hygiene-and-narrative-integrity |
| **Handoff Criteria** | `.opencode/skills/.goal-state/` no longer grows unboundedly across the session lifecycle; existing 6-file test suite plus new archive/sweep tests pass fresh |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

New finding, reported directly by the operator (not from either completed audit): per-session goal state files under `.opencode/skills/.goal-state/` accumulate indefinitely. `session.deleted`'s handler (`flushVolatileLocks`) only clears in-memory `runtimeState` locks — it never touches the on-disk `<hex(sessionID)>.json` file.

**Scope Boundary**: archive-then-delete on `session.deleted`, a retention-based prune of the archive itself, and a throttled sweep for orphaned active states (sessions that never fire `session.deleted`, e.g. crashes). No change to any other lifecycle event, no new scheduler/cron — cleanup piggybacks on existing event hooks (`session.deleted`, `session.created`).

**Dependencies**: none — independent of phases 010-013.

**Deliverables**: an `archiveGoalStateFile` helper wired into `session.deleted`, a `pruneArchive` helper wired to run after each archive write, a throttled `sweepOrphanedActiveStates` helper wired into `session.created`, and tests for all three.

**Changelog**: refresh `../changelog/changelog-032-014-goal-state-cleanup-and-archive.md` when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/.goal-state/*.json` files are created per session (`goalPathForSession`) but never removed by the plugin's own lifecycle handling. `deleteGoalFile` already exists (used by `clearGoal`/`/goal clear`) but is never invoked on session teardown. Over many sessions this directory grows without bound, and there is no cleanup path for sessions that crash or otherwise never emit `session.deleted`.

### Purpose
Stop unbounded growth of `.goal-state/` by archiving (not silently destroying) state on session teardown, pruning the archive on a retention window, and sweeping orphaned active states that missed teardown entirely.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- On `session.deleted`: move (not delete outright) the session's state file into a new `.opencode/skills/.goal-state/.archive/` subdirectory, preserving the goal's final state for audit/debugging. Reuses the existing fail-open pattern (`deleteGoalFile`'s `ENOENT`-tolerant try/catch) so a missing or already-cleared file is not an error.
- Prune `.archive/` of entries older than `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS` (default 90) each time a new file is archived — no separate scheduler needed, cleanup piggybacks on the archive-write event.
- Sweep the ACTIVE `.goal-state/` directory (not `.archive/`) for orphaned files whose `updatedAtMs` is older than `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS` (default 30) and archive those too — covers sessions that crashed or otherwise never fired `session.deleted`. Run this on `session.created`, throttled to at most once per `MK_GOAL_STATE_SWEEP_INTERVAL_MS` (default 1 hour, in-memory `runtimeState` timestamp — resets on OpenCode restart, consistent with this plugin's existing in-memory volatile-lock pattern) so a busy multi-session workflow doesn't re-scan the directory on every new session.
- All new I/O is best-effort: a permission error or race during archive/prune/sweep must not throw out of the `event()` handler or block session teardown (mirrors this plugin's existing fail-open philosophy for `fsyncDirectory`/`deleteGoalFile`).

### Out of Scope
- Changing `clearGoal`/`/goal clear`'s existing behavior (it already deletes via `deleteGoalFile`; this phase does not add archiving to the explicit-user-clear path, only the session-teardown path).
- A user-facing command to inspect or restore from `.archive/` — the archive exists for audit/debugging via direct file inspection, not as a product feature.
- Any change to `.opencode/skills/system-spec-kit`'s own memory/archive systems — this is scoped to `mk-goal.js`'s state store only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/plugins/mk-goal.js` | Modify | `archiveGoalStateFile`, `pruneArchive`, `sweepOrphanedActiveStates` helpers; wire into `session.deleted`/`session.created` |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Modify | Tests for archive-on-delete, retention-based prune, orphan sweep, and sweep throttling |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | On `session.deleted`, archive the session's state file instead of leaving it in the active directory forever. | Firing `session.deleted` for a session with an existing state file results in that file no longer present under `.goal-state/` and present (with identical content) under `.goal-state/.archive/`. A session with no state file (already cleared, or never had one) produces no error. |
| REQ-002 | Prune `.archive/` entries older than the configured retention window. | After archiving triggers a prune pass, any `.archive/` file whose mtime is older than `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS` is removed; files within the window are untouched. |
| REQ-003 | Sweep orphaned active states on `session.created`, throttled. | An active `.goal-state/*.json` file (not `.archive/`) whose `updatedAtMs` is older than `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS` gets archived when `session.created` fires and the sweep is due; a second `session.created` within `MK_GOAL_STATE_SWEEP_INTERVAL_MS` of the first does not re-scan the directory (verify via a scan-count/call-count assertion, not just timing). |
| REQ-004 | All new I/O fails open. | A simulated archive/prune/sweep failure (e.g. read-only `.archive/` parent directory) does not throw out of `plugin.event()` and does not prevent the normal `session.deleted`/`session.created` handling (existing behavior: `restoreActiveGoal`, `flushVolatileLocks`) from completing. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `session.deleted` on a session with state results in that state moving from `.goal-state/` to `.goal-state/.archive/`, verified via direct filesystem inspection in a test.
- **SC-002**: Archive retention pruning and active-state orphan sweep both have dedicated tests using synthetic mtimes (no real multi-day waits).
- **SC-003**: Existing 6-file test suite (plus phase 012's additions) still passes fresh after this phase's changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Archiving on every `session.deleted` adds filesystem I/O to a hot lifecycle path. | Low | The operation is a single `rename` (already imported, already used elsewhere in this file) — cheap, and best-effort (REQ-004). |
| Risk | The orphan sweep (REQ-003) could race with an in-progress `mutateGoal` write for the same session. | Low | Sweep only touches files whose `updatedAtMs` is already well past the active-retention window; a session actively being mutated has a recent `updatedAtMs` and is never a sweep candidate. |
| Dependency | None on phases 010-013 — this phase is fully independent. | Low | N/A |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — this phase's design (archive-then-delete on teardown, retention-based prune, throttled orphan sweep) is fully specified above; no operator decision is required before implementation.
<!-- /ANCHOR:questions -->
