---
title: "Implementation Summary: mk-deep-loop-guard-retention"
description: "mk-deep-loop-guard.js now sweeps, archives, and prunes its own .loop-guard-state directory on session.created, mirroring mk-goal.js's retention pattern but without a mutation queue -- this plugin's fully synchronous I/O already makes the sweep atomic with respect to concurrent dispatches."
trigger_phrases:
  - "mk-deep-loop-guard retention implemented"
  - "loop-guard sweep archive prune shipped"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/003-guard-and-enforcement/005-mk-deep-loop-guard-retention"
    last_updated_at: "2026-07-04T20:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Landed sweep/archive/prune with mutation-proved test and doc sync"
    next_safe_action: "Phase complete"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-deep-loop-guard.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "037-mk-deep-loop-guard-retention-20260704"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-mk-deep-loop-guard-retention |
| **Status** | Complete |
| **Completed** | 2026-07-04 |
| **Level** | 1 |
| **completion_pct** | 100 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`mk-deep-loop-guard.js`'s `.loop-guard-state` directory previously had zero cleanup logic -- confirmed by direct inspection (only one hook, `tool.execute.before`; no `session.deleted`/`session.idle` handler; no age check anywhere). It now sweeps, archives, and prunes on the same three-tier schedule as `mk-goal.js`.

### The Retention System

A new `event` hook fires `sweepStaleLoopGuardStates` on `session.created`, throttled to once per `MK_DEEP_LOOP_GUARD_SWEEP_INTERVAL_MS` (default 1 hour). Each pass moves per-session `.json` state files untouched past `MK_DEEP_LOOP_GUARD_ACTIVE_RETENTION_DAYS` (default 2 days) into `.loop-guard-state/.archive/`, then prunes archived files past `MK_DEEP_LOOP_GUARD_ARCHIVE_RETENTION_DAYS` (default 90 days). `guard-warnings.log` gets whole-file rotation on the same 90-day window, mirroring `pruneJsonlLog`.

### The One Deliberate Deviation From mk-goal.js

`mk-goal.js` needs a per-session mutation queue because its I/O is fully async (`node:fs/promises`), creating interleaving windows at every `await` -- exactly the TOCTOU class fixed in the goal-plugin packet's phase 022. `mk-deep-loop-guard.js` uses only synchronous fs calls, and neither hook ever `await`s before touching a state file, so Node's single-threaded execution already makes a sweep pass atomic with respect to any concurrent dispatch write. No queue was added; this reasoning is documented in the sweep function's own JSDoc so a future reader does not mistake the omission for an oversight.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/mk-deep-loop-guard.js` | Modified | Sweep/archive/prune functions, `event` hook, retention constants, warn-log rotation |
| `.opencode/plugins/tests/mk-deep-loop-guard.test.cjs` | Modified | Mutation-proved sweep/archive test, throttle test, prune test, event-type test |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | New "DEEP-LOOP GUARD PLUGIN" section documenting all 5 of this plugin's env vars (the 3 new retention vars plus the 2 pre-existing `REJECT`/`REJECT_LOOP` vars, previously undocumented there) |
| `.opencode/skills/deep-loop-runtime/feature_catalog/validation/mk-deep-loop-guard.md` | Modified | New retention subsection, version 1.1.0.0 -> 1.2.0.0 |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/validation/mk-deep-loop-guard.md` | Modified | New retention test step and failure mode, version 1.0.0.0 -> 1.1.0.0 |
| `.opencode/plugins/README.md` | Modified | Plugin-list row updated to mention the new `event` hook and retention behavior |
| `.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md` | Modified | Master-index summary for this plugin updated to mention the retention sweep |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/manual_testing_playbook.md` | Modified | Master-index summary and expected-signals updated to mention the retention sweep |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented directly. Read the full existing plugin and test file first to confirm the exact hook-registration shape and I/O style before designing the mirror, rather than assuming the `mk-goal.js` pattern would transplant unchanged. After the code and its two dedicated docs landed, a repo-wide grep for every mention of `mk-deep-loop-guard` and `.loop-guard-state` found three additional stale summaries in master-index/README files that duplicate (older) per-feature content, and three precedent-citation references that describe history rather than current behavior and were correctly left untouched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No mutation queue | This plugin's synchronous I/O already prevents the interleaving that makes a queue necessary in `mk-goal.js`; adding one would be unneeded complexity copied from a different concurrency model |
| Single mtime check, no content-level re-validation | The two-stage check in `mk-goal.js`'s sweep exists specifically to support the TOCTOU-safe re-validation inside its mutation queue; with no queue here, a second content check adds cost without adding safety |
| Prune called from inside the sweep, not a separate timer | Mirrors `mk-goal.js`'s `maybePruneArchive`, which is itself only ever invoked as a side effect of the sweep/archive path, not on its own schedule |
| New top-level packet (037) rather than nesting under the natural sibling packet | That packet was mid-restructure by a concurrent session (folder renames/renumbering in flight, uncommitted) at the time of writing; nesting into it risked collision with in-progress work |
| Documented all 5 env vars, not just the 3 new ones | The 2 pre-existing `REJECT`/`REJECT_LOOP` vars from this same plugin had never been added to `ENV_REFERENCE.md`; adding only the 3 new ones next to them would have produced a confusing partial entry |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline full suite | PASS: `node --test .opencode/plugins/tests/*.test.cjs` reported `# tests 110`, `# pass 110`, `# fail 0`. |
| New tests, first run | PASS: sweep/archive, throttle, archive-prune, and event-type tests all green on first write. |
| Mutation proof | PASS: disabling the `sweepStaleLoopGuardStates` call in the `event` hook made the test fail with `AssertionError: a state file untouched past the active-retention window should be archived out of the active dir` (`# pass 0, # fail 1`); restoring the call returned it to green (`# pass 1, # fail 0`). |
| Final full suite | PASS: `# tests 110`, `# pass 110`, `# fail 0` -- aggregate count unchanged since this test file has no internal `test()` registrations (counts as one file regardless of assertion count). |
| Syntax | PASS: `node --check` on both modified files produced no output. |
| Comment hygiene | PASS: `sk-code`'s comment-hygiene checker (path relocated by the concurrent sk-code parent-hub conversion since earlier phases this session: now `code-quality/scripts/check-comment-hygiene.sh`) produced no output. |
| Alignment drift | PASS: `sk-code`'s alignment verifier (relocated path: `code-verify/assets/scripts/verify_alignment_drift.py`) reported `Findings: 0`, `Errors: 0`, `Warnings: 0`, `Violations: 0`. |
| Doc sync | PASS: all 5 env var names grep-confirmed present in the new `ENV_REFERENCE.md` section with matching defaults; retention subsection present in both the feature catalog and manual testing playbook entries. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live `.loop-guard-state` directory's existing 26 files were not manually migrated.** Unlike the earlier `.goal-state` retention change, no explicit operator request was made to backfill this directory by hand; the automatic sweep will reconcile it the next time any OpenCode session fires `session.created` in this repository.
2. **`guard-warnings.log`'s whole-file rotation was not independently regression-tested.** It reuses the exact same mtime-gate logic already covered by `mk-goal.js`'s equivalently-structured `pruneJsonlLog`, so a separate test was judged redundant; if this proves wrong in practice, add one.
3. **This packet was initially placed as top-level `system-deep-loop/037-mk-deep-loop-guard-retention`** because 031 was mid-restructure when it was written. It has since been re-homed into `025-deep-loop-gpt-reliability/003-guard-and-enforcement/005-mk-deep-loop-guard-retention` (2026-07-05) as the guard/enforcement track's retention phase, once that restructuring settled.
<!-- /ANCHOR:limitations -->
