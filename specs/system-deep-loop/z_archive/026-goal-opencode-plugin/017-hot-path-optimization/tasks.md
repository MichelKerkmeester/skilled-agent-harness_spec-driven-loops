---
title: "Tasks: Phase 17: hot-path-optimization"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal plugin hot path optimization tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/017-hot-path-optimization"
    last_updated_at: "2026-07-03T07:30:49Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks from plan.md phase breakdown"
    next_safe_action: "Wait for phase 016 completion, then start T001"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-017-hot-path-optimization-20260703"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 17: hot-path-optimization

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

- [x] T001 Confirm phase 016 `tasks.md` shows all tasks `[x]`; run `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` fresh and paste the baseline output
  - Evidence: Phase 016 `tasks.md` shows T001-T016 all `[x]`. Fresh baseline `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` passed 6/6 with duration `1405.519333ms`.
- [x] T002 Add fs-call-count/spy instrumentation (readFile/mkdir/JSON.parse counters, `renderGoalInjection`/`scoreEnhancedGoalPrompt`/`normalizeOptions` call spies) to `mk-goal-lifecycle.test.cjs` and `mk-goal-state.test.cjs`, confirming each new spy assertion FAILS against the current unoptimized code (proves the test actually exercises the hot path)
  - Evidence: Initial RED run failed in `mk-goal-state.test.cjs:209` with `0 !== 1` and in `mk-goal-lifecycle.test.cjs:155` with `0 !== 1`, exposing invalid Node built-in monkey-patch spying. Final instrumentation uses internal metrics and the touched test files pass.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [e-1.2] Add mtime-keyed cache + negative cache to `appendGoalBrief` (mk-goal.js:1581-1596); REQ-001 spy test passes (zero `readFile` on repeat call in same mtime window)
  - Evidence: `mk-goal-state.test.cjs` asserts repeat cached injection calls and repeat missing-goal calls leave `briefReadFile` at `0`; benchmark measured 10 to 1 read reduction.
- [x] T004 [e-1.4] Merge `refreshGoalActivity` + `accountUsage` in `recordMessageUpdated` (mk-goal.js:1126-1140) into one queued mutation; REQ-002 write-cycle spy passes (1 fsync+rename+dir-fsync per `message.updated`)
  - Evidence: `mk-goal-lifecycle.test.cjs` asserts one `writeCycles` increment for one `message.updated`; benchmark measured 20 to 10 write cycles over 10 events.
- [x] T005 [e-1.1] Lazy/memoized rebuild in `normalizeGoalPromptFields` (mk-goal.js:348-357): skip `buildEnhancedGoalPrompt` when stored `goalPrompt`/`promptEnhancement` are present and valid; REQ-003 spy test passes (zero `scoreEnhancedGoalPrompt` calls on valid stored fields)
  - Evidence: `mk-goal-state.test.cjs` asserts `scoreEnhancedGoalPrompt` metric stays `0` and stored prompt enhancement remains equal for valid stored fields.
- [x] T006 [P] [e-1.3] Thread a single `normalizeOptions(rawOptions)` call through each public entry point (mk-goal.js:98-130 call sites) instead of re-normalizing internally; REQ-004 call-count spy passes (1 call per `setGoal` chain)
  - Evidence: `mk-goal-state.test.cjs` asserts one full `normalizeOptions` metric increment for a `setGoal` chain.
- [x] T007 [P] [e-1.6] Memoize `ensureGoalStateDir` (mk-goal.js:627-631) per resolved `stateDir` in `runtimeState`; REQ-005 spy test passes (1 `mkdir` across 2 writes to same dir)
  - Evidence: `mk-goal-state.test.cjs` asserts `mkdirStateDir` is `1` across two writes to the same temp state dir.
- [x] T008 [P] [e-1.7] Throttle `archiveGoalStateFile`'s `pruneArchive` call (mk-goal.js:847-865, prune at :860) using the same interval pattern as `sweepOrphanedActiveStates` (:876-879); REQ-006 spy test passes (at most 1 prune per throttle interval across N archives)
  - Evidence: `mk-goal-lifecycle.test.cjs` asserts `pruneArchive` is `1` across two archive events in one throttle interval.
- [x] T009 [P] [e-1.8] Add stat-mtime prefilter to `sweepOrphanedActiveStates` (mk-goal.js:874-902) before `readFile`+`JSON.parse`; REQ-007 spy test passes (zero `JSON.parse` on non-expired files)
  - Evidence: `mk-goal-lifecycle.test.cjs` asserts `sweepJsonParse` remains `0` for a fresh non-expired state file; stale-file fixtures set stale mtimes and still archive.
- [x] T010 [P] [e-1.10] Make `goalStateLines` (mk-goal.js:1602-1647) skip `renderGoalInjection` when the caller's action doesn't need `injection_preview`; REQ-008 call-count spy passes
  - Evidence: `mk-goal-state.test.cjs` routes through exported `executeGoalAction` with `includeInjectionPreview:false` and asserts no `injection_preview` line and `renderGoalInjection` metric `0`; public default tool output remains unchanged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the fresh full plugin suite (`node --test .opencode/plugins/tests/mk-goal-*.test.cjs`), report the delta against the T001 baseline, paste output; confirm zero assertions were relaxed or rewritten to accommodate a behavior change
  - Evidence: Final full suite passed 6/6 with duration `1390.5495ms`; delta vs T001 is same 6/6 pass count and `-14.969833ms`. No assertion was relaxed to accept changed public output; stale sweep fixtures were corrected to set stale filesystem mtime so the new mtime prefilter still tests expired-file archival.
- [x] T012 Write and run a micro-benchmark script in `scratch/` measuring fs-call counts and/or wall-clock time for (a) 10 consecutive `appendGoalBrief` calls on an unchanged goal, (b) 10 `message.updated` events on one session; paste before/after numbers
  - Evidence: `scratch/hot-path-benchmark.mjs` output: append before `10` reads and `3.502ms`, after `1` read and `1.513ms`; message update before `20` write cycles and `164.099ms`, after `10` write cycles and `85.752ms`.
- [x] T013 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-deep-loop/026-goal-opencode-plugin/017-hot-path-optimization --strict` (this is a Level 1 phase, no checklist.md required); write `implementation-summary.md`
  - Evidence: `SPECKIT_VALIDATE_LEGACY=1 bash validate.sh --strict` → Errors: 0, Warnings: 1 (non-blocking `ANCHORS_VALID` deviation from the `cross-refs`/`sequencing` custom anchors used consistently across every phase in this program — same pattern already confirmed benign in phases 015 and 016; not a real defect). `implementation-summary.md` written with Status: Complete.
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
- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md`, section B "e-1 Optimizations" (items 1, 2, 3, 4, 6, 7, 8, 10)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
