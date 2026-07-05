---
title: "Changelog: mk-deep-loop-guard Retention [031-deep-loop-gpt-reliability/003-guard-and-enforcement/005-mk-deep-loop-guard-retention]"
description: "Chronological changelog for the mk-deep-loop-guard retention phase moved in from packet 037."
trigger_phrases:
  - "phase changelog"
  - "mk-deep-loop-guard retention changelog"
  - "loop guard state cleanup changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-04

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability/003-guard-and-enforcement/005-mk-deep-loop-guard-retention` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability`

### Summary

Added age-based retention to `mk-deep-loop-guard.js`'s `.loop-guard-state` directory. The plugin now sweeps stale per-session JSON state, archives it, prunes old archives, and rotates `guard-warnings.log` when dormant, mirroring the `mk-goal.js` pattern while preserving the guard's synchronous I/O model.

### Added

- `session.created` event hook that triggers a throttled retention sweep.
- Active-state archive path under `.loop-guard-state/.archive/`.
- Three retention env vars: active-retention days, archive-retention days and sweep interval.
- Regression coverage for sweep/archive, throttle, archive prune and event-type filtering.

### Changed

- `mk-deep-loop-guard.js` now owns cleanup for its state directory instead of leaving session files and warning logs unbounded.
- `ENV_REFERENCE.md`, the feature catalog, the manual testing playbook and plugin summaries were updated to mention the retention behavior.

### Fixed

- Unbounded `.loop-guard-state` accumulation: direct inspection found per-session files and a warning log with no cleanup path.

### Verification

- Baseline full plugin suite: 110/110 pass.
- Mutation proof: disabling the sweep call made the archive test fail, restoring it returned the test to green.
- Final full plugin suite: 110/110 pass.
- `node --check` on modified files produced no output.
- Comment hygiene and alignment drift reported no findings.
- Doc sync confirmed all 5 plugin env vars in `ENV_REFERENCE.md` and retention sections in the catalog and playbook.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/plugins/mk-deep-loop-guard.js` | Modified | Added sweep/archive/prune functions, event hook, retention constants and warning-log rotation |
| `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` | Modified | Added mutation-proved retention coverage |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | Documented all 5 guard-plugin env vars |
| `.opencode/skills/deep-loop-runtime/feature_catalog/03--validation/mk-deep-loop-guard.md` | Modified | Added retention behavior |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/03--validation/mk-deep-loop-guard.md` | Modified | Added retention test step |
| `.opencode/plugins/README.md` | Modified | Updated plugin row for event hook and retention behavior |

### Follow-Ups

- Existing live `.loop-guard-state` files were not manually migrated. The automatic sweep reconciles them on the next `session.created` event.
- `guard-warnings.log` rotation reuses the mtime-gate pattern but was not independently regression-tested.
