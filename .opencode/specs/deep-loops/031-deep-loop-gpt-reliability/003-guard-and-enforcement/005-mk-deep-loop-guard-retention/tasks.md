---
title: "Tasks: mk-deep-loop-guard-retention"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mk-deep-loop-guard retention tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/003-guard-and-enforcement/005-mk-deep-loop-guard-retention"
    last_updated_at: "2026-07-04T20:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Executed and verified the implementation"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: mk-deep-loop-guard-retention

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run `node --test .opencode/plugins/tests/*.test.cjs` fresh. Evidence: baseline `# tests 110`, `# pass 110`, `# fail 0`.
- [x] T002 Read the full current `mk-deep-loop-guard.js` and `mk-deep-loop-guard.test.cjs` to confirm hook shape (`tool.execute.before` only, sync fs API throughout, no shared util module with `mk-goal.js`) before designing the mirror.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [REQ-005] Add `positiveIntFromEnv`, `LOOP_GUARD_ACTIVE_RETENTION_DAYS_ENV`/`LOOP_GUARD_ARCHIVE_RETENTION_DAYS_ENV`/`LOOP_GUARD_SWEEP_INTERVAL_MS_ENV` constants + defaults (2 days / 90 days / 1 hour). Evidence: constants added, `node --check` clean.
- [x] T004 Add `ensureLoopGuardArchiveDir`, `pruneLoopGuardArchive`, `sweepStaleLoopGuardStates`. Evidence: functions added, mirroring `mk-goal.js`'s sweep/archive/prune shape adapted to sync I/O (single mtime check, no content-level re-validation -- documented rationale in the function's JSDoc).
- [x] T005 Add `pruneStaleWarningLog`; wire it into `appendWarningLog` before the append. Evidence: whole-file rotation added, mirrors `pruneJsonlLog`.
- [x] T006 Declare `runtimeState` in `MkDeepLoopGuardPlugin`; add the `event` hook triggering `sweepStaleLoopGuardStates` on `session.created`. Evidence: hook added alongside `tool.execute.before` in the returned hooks object.
- [x] T007 [REQ-001] Add the sweep/archive regression test (backdated fixture archived, fresh fixture untouched). Evidence: test passes GREEN.
- [x] T008 [REQ-001] Mutation-prove T007: temporarily disable the sweep call in `event`, confirm the test fails with the exact expected assertion, restore. Evidence: RED = `AssertionError: a state file untouched past the active-retention window should be archived out of the active dir`, `# pass 0, # fail 1`; GREEN after restore = `# pass 1, # fail 0`.
- [x] T009 [REQ-002] Add the throttle regression test (second `session.created` on the same plugin instance does not re-sweep). Evidence: test passes.
- [x] T010 [REQ-003] Add the archive-prune regression test (fresh plugin instance's unthrottled first sweep deletes a backdated archived fixture). Evidence: test passes.
- [x] T011 [REQ-004] Add the event-type regression test (`session.idle` on a fresh instance does not archive a backdated fixture). Evidence: test passes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Full plugin suite fresh. Evidence: `# tests 110`, `# pass 110`, `# fail 0` (aggregate unchanged -- this test file has no internal `test()` registrations, so it counts as one file regardless of how many assertions it contains).
- [x] T013 `node --check` on both modified files; comment hygiene (current path: `sk-code/code-quality/scripts/check-comment-hygiene.sh`); alignment drift (current path: `sk-code/code-verify/assets/scripts/verify_alignment_drift.py`). Evidence: all clean/PASS, 0 findings/errors/warnings/violations.
- [x] T014 [REQ-005] Sync `ENV_REFERENCE.md` (new "DEEP-LOOP GUARD PLUGIN" section, all 5 env vars including the 2 pre-existing undocumented ones), the feature catalog entry (new retention subsection, version 1.1.0.0 -> 1.2.0.0), and the manual testing playbook entry (new test step + failure mode, version 1.0.0.0 -> 1.1.0.0). Evidence: grep confirms all 5 variable names present in `ENV_REFERENCE.md`; retention section present in both plugin docs.
- [x] T016 Repo-wide doc-completeness sweep: `rg -rl "mk-deep-loop-guard"` and `rg -rl "\.loop-guard-state"` across all `*.md`/`*.json` to find every reference point. Evidence: found and updated 3 additional stale summaries -- `.opencode/plugins/README.md`'s plugin-list row (added the new `event` hook + retention line), `feature_catalog/feature_catalog.md`'s master-index "How It Works" summary, and `manual_testing_playbook/manual_testing_playbook.md`'s master-index "Description"/"Expected signals". Confirmed 3 other references (`sk-code` javascript quality_standards.md's stderr-diagnostic-pattern citation, the dist-freshness-guard spec's `tool.execute.before`-shape precedent citation, and `descriptions.json`'s auto-generated historical phase-016 snapshot) describe precedent/history rather than current living behavior and do not need updating.
- [x] T015 Write `implementation-summary.md`; set this phase's spec.md Status to Complete.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
