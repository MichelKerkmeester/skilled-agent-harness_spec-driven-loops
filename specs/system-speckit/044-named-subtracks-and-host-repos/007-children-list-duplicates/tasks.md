---
title: "Tasks: Phase 7: children-list-duplicates"
description: "Ordered tasks for the repeated children_ids fix: record the baseline, add the duplicate check to the track reader, the sweep and the writer, add three tests and one catalog sentence, empty Skilled's specs root list, then run the tests and sweep the Barter host."
trigger_phrases:
  - "children list duplicates tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: children-list-duplicates

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

`K` is `.skilled/skills/system-spec-kit/runtime`. `B` is `barter/ai-speckit/specs`. `T` is `npx vitest run tests/track-roots.vitest.ts --config ../../vitest.config.ts --project cli`, run from `K/cli`.

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Record the test baseline before any change (`K/cli/tests/track-roots.vitest.ts`). Verify: `T` prints 25 passed of 25. Evidence: orchestrator run before the change, 25 passed of 25.
- [x] T002 Confirm the Barter repeats pass today (`B`). Verify: `node K/cli/spec/sweep-track-roots.mjs --specs B --rev HEAD` prints `backend-system/partners-billing: declared=12 actual=11` and exits 0. Evidence: it printed that line and exited 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T003 Return a sorted `duplicates` list from `compareTrackChildren`, hold each name once in `declared` and set `matches` to false on a repeat (`K/cli/lib/track-roots.mjs`). Verify: `node --check K/cli/lib/track-roots.mjs` exits 0. Evidence: `lib/track-roots.mjs exit=0`, and four direct calls gave `matches:false` with `duplicates:["001-a"]` for a repeat (`scratch/evidence.txt`, since removed).
- [x] T004 Print `    declared more than once: <names>` and count the root as drifted (`K/cli/spec/sweep-track-roots.mjs`). Verify: the sweep over a track that repeats a packet exits 1 and prints that line. Evidence: `reports a packet declared more than once` passes, and the line is printed at `sweep-track-roots.mjs:119`.
- [x] T005 Name the duplicates in the dry run and write each packet once under `--apply` (`K/cli/spec/refresh-track-roots.mjs`). Verify: after `--apply` on that track, the sweep exits 0. Evidence: `drops a repeated entry on --apply and leaves the sweep clean` passes.
- [x] T006 Add the three tests: the sweep flags a repeat, the writer removes it and the sweep then passes, and an unsorted list still matches (`K/cli/tests/track-roots.vitest.ts`). Verify: `T` prints 28 passed of 28. Evidence: `Tests 28 passed (28)`, exit 0.
- [x] T007 [P] Add one sentence on repeated entries to section 2 (`.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/track-root-children-lists.md`). Verify: `rg -n 'more than once'` on the file prints one line. Evidence: one line, line 45.
- [x] T008 [P] Empty `children_ids` in Skilled's specs root (`specs/graph-metadata.json`). Verify: `node -e "console.log(require('./specs/graph-metadata.json').children_ids.length)"` from the repository root prints 0. Evidence: it printed 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T009 Run the track-root tests with the 25 existing tests unchanged (`K/cli/tests/track-roots.vitest.ts`). Verify: `T` prints 28 passed of 28. Evidence: `Tests 28 passed (28)`, exit 0, rerun at close with the same result. The wider run over six track files printed `Tests 141 passed (141)`, and `pre-push.test.sh` printed `pre-push tests: PASS=50 FAIL=0`.
- [x] T010 Check that an unsorted list naming each packet once still matches (`scratch/`). Verify: the sweep exits 0 and the writer dry run prints `up to date`. Evidence: two packets listed in reverse order gave `demo: declared=2 actual=2` with `sweep exit=0`, then `demo: up to date` with `refresh exit=0`. The fixture is removed.
- [x] T011 Run the fixed writer with `--apply` over the Barter host, recorded as evidence only (`B`). Verify: the working-tree sweep over `B` prints no `declared more than once` line. Evidence: the dry run named 17 repeats in seven sub-tracks, and `--apply --track <each>` exited 0 for all seven. The sweep afterwards printed no such line, with `backend-system/partners-billing: declared=11 actual=11` and `fe-backoffice-app/auth-access: declared=6 actual=6`. It still exits 1 for the `skilled` mirror only, see `implementation-summary.md` Known Limitations.
- [x] T012 Add track metadata to the overlays folder, recorded as evidence only (`B/skilled-barter-overlays/description.json`, `B/skilled-barter-overlays/graph-metadata.json`). Verify: the sweep prints `skilled-barter-overlays: declared=4 actual=4`. Evidence: it printed that line.
- [x] T013 Validate this phase (`specs/system-speckit/044-named-subtracks-and-host-repos/007-children-list-duplicates`). Verify: `validate.sh` on the folder with `--strict` prints `RESULT: PASSED`. Evidence: `implementation-summary.md` Verification.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `T` prints 28 passed of 28, and the Barter working-tree sweep prints no `declared more than once` line
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task is marked `[B]` with the reason on its line. A blocked P0 task blocks close.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -n 'REQ-00' spec.md` prints six rows. Evidence: `rg -c` prints 6.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Verify: `rg -n '^## 3' plan.md` prints one line. Evidence: `53:## 3. ARCHITECTURE`.
- [x] CHK-003 [P1] Dependencies identified and available. Verify: T001 prints 25 passed of 25. Evidence: T001.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `node --check` exits 0 for `track-roots.mjs`, `sweep-track-roots.mjs` and `refresh-track-roots.mjs`. Evidence: `exit=0` for all three.
- [x] CHK-011 [P0] `T` prints no warning or error from the changed files. Evidence: the only warning is Vite's `configLoader` notice about `vitest.config.ts`, a file this phase did not touch, and the run exits 0.
- [x] CHK-012 [P1] Unreadable metadata is reported and the sweep's exit status for it does not change. Evidence: the existing `reports unreadable metadata, writes nothing to it and fails` still passes.
- [x] CHK-013 [P1] The sweep and the writer read `duplicates` from `compareTrackChildren` and do not compute it again. Evidence: both read `result.duplicates`, at `sweep-track-roots.mjs:118` and `refresh-track-roots.mjs:74`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] A track that repeats a packet makes the sweep exit 1 and print `declared more than once`. Evidence: T004.
- [x] CHK-021 [P0] The writer with `--apply` writes each packet once, and the sweep then exits 0. Evidence: T005.
- [x] CHK-022 [P0] An unsorted list naming each packet once still matches: sweep exit 0, writer `up to date`. Evidence: T010.
- [x] CHK-023 [P1] `T` prints 28 passed of 28. Evidence: T009.
- [x] CHK-024 [P1] The Barter working-tree sweep prints no `declared more than once` line after the writer ran. Evidence: T011.
- [x] CHK-025 [P1] The sweep prints `skilled-barter-overlays: declared=4 actual=4`. Evidence: T012.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. The repeated entry is `cross-consumer`, because the reader, the sweep, the writer and the pre-push gate all see it. The stale specs-root list is `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Verify: `rg -n 'compareTrackChildren' K` lists every caller. Evidence: the only callers are `sweep-track-roots.mjs:106` and `refresh-track-roots.mjs:126`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for `compareTrackChildren`, its new `duplicates` field, the feature-catalog entry and the tests. The table in `plan.md` lists each one. Evidence: CHK-FIX-002 and CHK-013.
- [x] CHK-FIX-004 [P0] Comparison cases cover the empty list, one packet repeated many times, an unsorted list with no repeat and unreadable metadata. Evidence: the empty list matched, four repeats of `001-a` gave `duplicates:["001-a"]` and `matches:false`, the unsorted list matched, and a repeat plus a missing packet did not match. Unreadable metadata is CHK-012.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed: repeated or not, sorted or not, empty or not. Evidence: three axes, four rows run (CHK-FIX-004).
- [x] CHK-FIX-006 [P1] N/A: the change reads no environment variable or process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: nothing is committed, so the evidence is pinned to base commit `3378c36a06` plus the uncommitted diff of the six files in `spec.md` section 3.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] The three scripts read no credential. Verify: `rg -n 'token|secret|password'` on them prints nothing. Evidence: no output, `rg exit=1`.
- [x] CHK-031 [P0] The writer writes only the `graph-metadata.json` of the track roots under the `--specs` folder it was given. Evidence: the writer's diff adds one line to `describeChange` and a comment, and adds no write path, so it writes where it wrote before.
- [x] CHK-032 [P1] N/A: the scripts have no authentication or authorization surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name the `declared more than once` line. Evidence: `rg -n 'declared more than once'` counts 6 in `spec.md`, 2 in `plan.md` and 6 in `tasks.md`.
- [x] CHK-041 [P1] Code comments state why a repeat counts as drift and carry no packet or phase label. Evidence: the added comments in `git diff` explain that a repeat leaves the set equal and name no packet.
- [x] CHK-042 [P2] The feature-catalog entry for track-root children lists names the repeated-entry check. Evidence: T007.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] The unsorted-list fixture for T010 lives under `scratch/` only. Evidence: the orchestrator built and removed it there.
- [x] CHK-051 [P1] `scratch/` is cleaned before completion. Evidence: `ls -A scratch/` prints only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-09
<!-- /ANCHOR:summary -->

---
