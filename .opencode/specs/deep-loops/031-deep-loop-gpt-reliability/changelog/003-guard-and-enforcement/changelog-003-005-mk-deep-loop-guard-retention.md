---
title: "Changelog: mk-deep-loop-guard Retention [031-deep-loop-gpt-reliability/003-guard-and-enforcement/005-mk-deep-loop-guard-retention]"
description: "Chronological changelog for the mk-deep-loop-guard state-retention phase (sweep/archive/prune)."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability/003-guard-and-enforcement/005-mk-deep-loop-guard-retention` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability`

### Summary

`mk-deep-loop-guard.js`'s `.loop-guard-state` directory had no cleanup logic — per-session state files and `guard-warnings.log` grew unbounded. Added a sweep/archive/prune retention system mirroring the `mk-goal.js` pattern (2-day active retention, 90-day archive retention, hourly-throttled sweep on `session.created`), but without a mutation queue: the plugin's fully synchronous I/O already makes the sweep atomic with respect to concurrent dispatches. Landed with a mutation-proved test.

### Added

- A `session.created` event hook that sweeps `.loop-guard-state/` for per-session state files untouched past `MK_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS` (default 2) and archives them into `.loop-guard-state/.archive/`.
- Prune of archived files untouched past `MK_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS` (default 90).
- Whole-file rotation of `guard-warnings.log` reusing `mk-goal.js`'s mtime-gate logic.
- In-memory per-instance throttle (`MK_DEEP_LOOP_GUARD_SWEEP_INTERVAL_MS`, default 1 hour).

### Note

- This phase shipped as top-level packet `deep-loops/037-mk-deep-loop-guard-retention` (parked at top-level because 031 was mid-restructure at the time) and was re-homed into `003-guard-and-enforcement/005-mk-deep-loop-guard-retention` on 2026-07-05 as the guard/enforcement track's retention phase.
