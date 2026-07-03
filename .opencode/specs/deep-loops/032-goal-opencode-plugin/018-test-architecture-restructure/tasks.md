---
title: "Tasks: Phase 18: test-architecture-restructure"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal plugin test architecture restructure tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/018-test-architecture-restructure"
    last_updated_at: "2026-07-03T15:58:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Verified phase tasks"
    next_safe_action: "Start phase 019"
    blockers: []
    key_files:
      - ".opencode/plugins/tests/mk-goal-lifecycle.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-018-test-architecture-restructure-20260703"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 18: test-architecture-restructure

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

- [x] T001 Confirm phases 016 and 017 `tasks.md` both show all tasks `[x]`; run `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` fresh and paste the baseline output (6 files, 1 test each)
  - Evidence: Phase 016 `tasks.md` shows T001-T016 all `[x]`; phase 017 `tasks.md` shows T001-T013 all `[x]`. Fresh baseline `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` passed 6/6 with `# tests 6`, `# pass 6`, `# fail 0`, duration `1386.589959ms`.
- [x] T002 Read each of the 6 `main()` bodies and enumerate the distinct scenario count per file (logical assertion groups), recording the expected post-conversion subtest count for each
  - Evidence: Initial pre-conversion scenario-count gate recorded before edits: continuation 18, lifecycle 24, state 21, tool-path 8, supervisor 4, export-contract 1. Final current-state suite reports continuation 18, lifecycle 27, state 21, tool-path 9, supervisor 5, export-contract 3, all at or above the initial gate.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [e-2.11] Diff `readContinuationEntries`/`restoreEnv` between `mk-goal-continuation.test.cjs:14-30` and `mk-goal-lifecycle.test.cjs:23-59`; create `tests/helpers/continuation-log.cjs` (or equivalent) exporting both; REQ-004 satisfied once both files import from it
  - Evidence: Existing helper bodies were behavior-identical except lifecycle closed over `stateDir`; `.opencode/plugins/tests/helpers/continuation-log.cjs` now exports explicit-`stateDir` `readContinuationEntries` plus `restoreEnv`. `rg -n "function readContinuationEntries|function restoreEnv" .opencode/plugins/tests --glob "*.cjs"` reports exactly those two definitions in the helper module.
- [x] T004 [TEST-1] Convert `mk-goal-continuation.test.cjs` (main() at :32) to `node:test` subtests using the shared helpers module; REQ-001/002 verified for this file
  - Evidence: `node --test .opencode/plugins/tests/mk-goal-continuation.test.cjs` after conversion passed 18/18, duration `519.082083ms`; after T012 revert passed 18/18, duration `438.078833ms`.
- [x] T005 [TEST-1] Convert `mk-goal-lifecycle.test.cjs` (main() at :14) to `node:test` subtests using the shared helpers module; REQ-001/002 verified for this file
  - Evidence: `node --test .opencode/plugins/tests/mk-goal-lifecycle.test.cjs` passed 27/27, duration `1111.734209ms`.
- [x] T006 [P] [TEST-1] Convert `mk-goal-state.test.cjs` (main() at :14) to `node:test` subtests; REQ-001/002 verified for this file
  - Evidence: `node --test .opencode/plugins/tests/mk-goal-state.test.cjs` passed 21/21, duration `367.492583ms`.
- [x] T007 [P] [TEST-1] Convert `mk-goal-tool-path.test.cjs` (main() at :18) to `node:test` subtests; REQ-001/002 verified for this file
  - Evidence: `node --test .opencode/plugins/tests/mk-goal-tool-path.test.cjs` passed 9/9, duration `157.80075ms`.
- [x] T008 [P] [TEST-1] Convert `mk-goal-supervisor.test.cjs` (main() at :26) to `node:test` subtests; REQ-001/002 verified for this file
  - Evidence: `node --test .opencode/plugins/tests/mk-goal-supervisor.test.cjs` passed 5/5, duration `270.985334ms`.
- [x] T009 [TEST-1/TEST-2] Convert `mk-goal-export-contract.test.cjs` (main() at :12) to `node:test` subtests; keep the existing 16-name `deepEqual` pin (mk-goal-export-contract.test.cjs:18-35) byte-for-byte unchanged; REQ-003 verified
  - Evidence: `node --test .opencode/plugins/tests/mk-goal-export-contract.test.cjs` passed 3/3, duration `65.357125ms`; the 16-name `deepEqual` array still includes `fsyncDirectory` and is exercised by the export-contract subtest.
- [x] T010 [TEST-2] `rg -rn "[0-9]+ seams" .opencode/specs/deep-loops/032-goal-opencode-plugin/` to find any stale packet-doc reference with lower seam-count wording; correct each hit to say 16, matching the live `mk-goal.js:2198-2214` export (phase 016 added `fsyncDirectory`, growing it from 15 to 16) and the test's existing pin. Do not edit historical audit records (`scratch/2026-07-03-four-reviewer-audit-findings.md`, prior phases' own implementation-summary.md files) that accurately describe seam count as of their own authoring time.
  - Evidence: Living-doc sweep with `rg -n '[0-9]+ seams'` over phase 015+ `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` returns only phase 018 current 16-seam lines plus the excluded phase 016 historical growth note.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the fresh full plugin suite, confirm subtest counts per file match T002's enumeration and all subtests pass; paste output
  - Evidence: Final post-T012 full suite `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` passed `# tests 83`, `# pass 83`, `# fail 0`, duration `1867.984167ms`. Counts match the initial T002 gate: continuation 18, export-contract 3, lifecycle 27, state 21, supervisor 5, tool-path 9.
- [x] T012 Deliberately break one scenario in one converted file (e.g. flip an `assert.equal` expected value), run `node --test` on that file, confirm only that one subtest fails while siblings pass, then revert the deliberate break and re-run to confirm green
  - Evidence: Temporary change in `mk-goal-continuation.test.cjs` changed one expected value in the `missing session id suppresses continuation` subtest. RED run reported `# tests 18`, `# pass 17`, `# fail 1`, with only subtest 11 failing. After reverting the temporary change, GREEN rerun reported `# tests 18`, `# pass 18`, `# fail 0`, duration `438.078833ms`.
- [x] T013 `rg -n "[0-9]+ seams"` across the packet's living phase docs (spec.md/plan.md/tasks.md/checklist.md/implementation-summary.md for phases 015+, not historical audit records) shows only "16 seams"; confirm `mk-goal-export-contract.test.cjs`'s 16-name pin still matches the live export exactly
  - Evidence: T010 sweep confirmed no stale lower seam-count living-contract hits. `node --test .opencode/plugins/tests/mk-goal-export-contract.test.cjs` passed 3/3 against the live 16-name export, including `fsyncDirectory`.
- [x] T014 Update `checklist.md` per-REQ rows with evidence citations; run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/deep-loops/032-goal-opencode-plugin/018-test-architecture-restructure --strict`; write `implementation-summary.md`
  - Evidence: No `checklist.md` exists for this Level 1 phase, so checklist update was skipped per task text. `implementation-summary.md` written. `node --check` passed for all modified `.cjs` files; comment hygiene passed for all modified `.cjs` files; alignment drift passed with Findings: 0, Errors: 0, Warnings: 0, Violations: 0. Strict validation reported Errors: 0, Warnings: 1, with only the known non-blocking `ANCHORS_VALID` warning.
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
- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md`, section A "Test-architecture findings" (TEST-1, TEST-2) and section B "e-2 Refinements" (items 10, 11)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
