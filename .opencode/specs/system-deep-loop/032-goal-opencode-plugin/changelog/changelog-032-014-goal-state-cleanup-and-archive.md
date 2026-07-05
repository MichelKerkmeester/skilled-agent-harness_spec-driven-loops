---
title: "Changelog: Phase 14: goal-state-cleanup-and-archive [032-goal-opencode-plugin/014-goal-state-cleanup-and-archive]"
description: "Chronological changelog for archiving, pruning and sweeping goal state so .goal-state/ stops growing unboundedly."
trigger_phrases:
  - "phase changelog"
  - "goal state cleanup"
  - "goal state archive"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/032-goal-opencode-plugin/014-goal-state-cleanup-and-archive` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/032-goal-opencode-plugin`
> Commit: `cba2d1e7fc` feat(mk-goal): archive-then-prune goal state, sweep orphaned sessions

### Summary

This phase did not originate from either the security/correctness or documentation-staleness audits; it was opened mid-session after the operator flagged that goal-state files had no cleanup path at all. Goal state files no longer accumulate indefinitely in the active `.goal-state/` directory: session teardown now archives then prunes, and a throttled sweep on session creation recovers state orphaned by crashed sessions.

### Added

- `archiveGoalStateFile(sessionID, rawOptions)`: moves a session's state file into `.goal-state/.archive/` via `rename` on `session.deleted`; tolerates a missing state file as a no-op
- `pruneArchive(rawOptions)`: removes archived files older than `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS` (default 90 days), run after every successful archive write
- `sweepOrphanedActiveStates(rawOptions, runtimeState)`: on a throttled `session.created` pass, archives active `.json` state files whose `updatedAtMs` is older than `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS` (default 30 days)
- `runtimeState.lastSweepAtMs`, gating the sweep to run at most once per `MK_GOAL_STATE_SWEEP_INTERVAL_MS` (default 3,600,000 ms / 1 hour)
- New env var constants: `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, `MK_GOAL_STATE_SWEEP_INTERVAL_MS`

### Changed

- `session.deleted` handling now archives the state file in addition to the existing volatile-lock flush
- `session.created` handling now runs the throttled orphan sweep before restoring any active goal

### Fixed

- Goal-state files previously stayed in the active directory forever with no archive, prune, or sweep path, a real gap the operator identified outside either prior audit

### Verification

- `for f in .opencode/plugins/tests/mk-goal-*.test.cjs; do node "$f"; echo "exit: $?"; done` (baseline and post-edit) - PASS: 6/6 exit 0
- `node --check .opencode/plugins/mk-goal.js` - PASS: no output
- New lifecycle coverage for archive-on-delete, no-file delete, archive retention, active orphan sweep and sweep throttling, all passing within the same green suite

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/plugins/mk-goal.js` | Modified | Archive, prune and throttled active-orphan-sweep behavior for goal state files. |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Modified | Coverage for archive-on-delete, no-file delete, retention, orphan sweep and sweep throttling. |

### Follow-Ups

- Archive-then-prune and sweep helpers stay private (not exposed on `__test`) to keep the export-contract test's fixed 15-key surface stable; lifecycle tests verify the behavior through real plugin events instead of direct helper calls.
