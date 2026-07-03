---
title: "Changelog: Phase 13: design-fidelity-and-polish [032-goal-opencode-plugin/013-design-fidelity-and-polish]"
description: "Chronological changelog for wiring the usage_limited detector and closing the packet's remaining design-fidelity gaps."
trigger_phrases:
  - "phase changelog"
  - "usage limited detector"
  - "design fidelity polish"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-01

> Spec folder: `.opencode/specs/deep-loops/032-goal-opencode-plugin/013-design-fidelity-and-polish` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/032-goal-opencode-plugin`
> Commit: `ea9a45d649` feat(mk-goal): wire usage_limited detector + fingerprint/observability polish

### Summary

The goal plugin now treats provider rate limiting as a real lifecycle stop instead of a dormant enum value, following the operator's decision to wire a real detector rather than collapse the `usage_limited` status. This phase also removed stale continuity fingerprint placeholders from phases 001-008, corrected phase 006's overstated completion claim, and added two lightweight observability signals.

### Added

- `recordProviderUsageLimit`, mirroring the existing budget-stop mutation pattern: sets `status: 'usage_limited'`, `continuationSuppressed: true`, `continuationSuppressedReason: 'usage_limited'`
- `store_health=state_age_ms:<ms>` and `store_health=no_active_goal` status output fields
- `MK_GOAL_DEBUG=1`-gated `fsync_directory_error` log row when `fsyncDirectory` swallows a real fsync failure

### Changed

- `recordMessageUpdated` now reads the assistant message error field from the same payload/property candidates used for usage extraction, triggering the detector only when the error is exactly `APIError` with `data.statusCode === 429`
- Phases 001-008's `session_dedup.fingerprint` values replaced with real computed hashes (previously a shared all-zero placeholder)
- Phase 006's `implementation-summary.md` completion downgraded from 100% to 90%, with `recent_action` now stating that live idle-smoke verification remains pending

### Fixed

- F-003/F-014: `usage_limited` was declared in `VALID_STATUSES` and documented as first-class but had zero production writers; the operator's wire-the-detector decision (over collapsing the enum) closes that gap
- F-012: phases 001-008 hardcoded all-zero fingerprints were universally failing `SPECKIT_COMPLETION_FRESHNESS`'s freshness gate
- F-010: phase 006 claimed 100% completion despite `MK_GOAL_AUTONOMY=smoke` session.idle behavior never being exercised end-to-end
- F-016: `fsyncDirectory` silently swallowed all fsync errors with no observability

### Verification

- `for f in .opencode/plugins/tests/mk-goal-*.test.cjs; do node "$f"; echo "exit: $?"; done` (baseline and post-edit) - PASS: 6/6 exit 0
- `node --check .opencode/plugins/mk-goal.js` - PASS: no output
- Placeholder grep across phases 001-008 for the all-zero fingerprint - PASS: no output (zero hits)
- Manual status smoke - PASS: output contained `store_health=state_age_ms:1500`
- Manual fsync debug smoke under `MK_GOAL_DEBUG=1` - PASS: output contained a `fsync_directory_error` JSON row with the real EACCES error

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/plugins/mk-goal.js` | Modified | `usage_limited` provider detection, debug fsync logging, status store-health output. |
| `.opencode/plugins/tests/mk-goal-lifecycle.test.cjs` | Modified | 429-detector test and the non-429 non-trigger test. |
| Phases 001-008 `{spec,plan,tasks,implementation-summary}.md` | Modified | Real continuity fingerprints replacing the zero placeholder. |
| `006-active-continuation/implementation-summary.md` | Modified | Completion percentage downgraded; live idle-smoke gap disclosed. |

### Follow-Ups

- None recorded for this scoped phase.
