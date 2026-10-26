---
title: "Tasks: Session relaunch hooks off by default, opt in with SYSTEM_SESSION_RELAUNCH_ENABLED"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "default off opt in tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Session relaunch hooks off by default, opt in with SYSTEM_SESSION_RELAUNCH_ENABLED

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Record the baseline pass counts of the hook-flags tests and the three relaunch suites before any edit (scratch/). Evidence: `scratch/baseline-flags.txt` 21/21, `scratch/baseline-node.txt` 868/868, `scratch/baseline-vitest.txt` 54/54, each exit 0
- [x] T002 Write the failing resolver tests: default off, on from env, on from file, env beats file, kill switch beats enable, master switch beats enable, a default-on concern unchanged (`.skilled/hooks/shared/hook-flags.test.cjs`). Evidence: `hook-flags.test.cjs:141`, `:150`, `:159`, `:190`
- [x] T003 Write the failing cross-reader parity test that runs the same input table through the `.cjs`, `.mjs`, `.ts` and `.sh` readers (`.skilled/hooks/shared/hook-flags.test.cjs`). Evidence: `:208` runs a six-row table through `.cjs` and `.sh`, `:199` checks `.mjs` and `.ts`; the closeout probe runs one seven-row table through all four, 0 mismatches (`scratch/closeout-resolver.txt`)
- [x] T004 [P] Write the failing silent-when-not-enabled tests for the Claude context nudge and for `prepare` inside the loop (`.skilled/hooks/session-relaunch/tests/`). Evidence: `claude-adapters.test.cjs:349`, `session-relaunch-cli.test.cjs:419`
- [x] T005 [P] Write the failing Hermes arm test that opts in through the config file only (`.skilled/hooks/session-relaunch/tests/hermes-adapters.test.cjs`). Evidence: `hermes-adapters.test.cjs:606`, red with the `DEFAULT_OFF` entry removed (`scratch/red-hermes-arm.txt`, exit 1), restore confirmed by `cmp` exit 0
- [x] T006 Run T002 to T005 and confirm each fails for the expected reason (scratch/). Evidence: `scratch/red-flags.txt` 5 of 27 fail, exit 1; `scratch/red-adapters.txt` 2 of 3 fail, exit 1; `scratch/red-hermes-arm.txt` 1 of 1 fails on the empty-file case (armed instead of null), exit 1
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Add the default-off concern map and the enable check to the resolver (`.skilled/hooks/shared/hook-flags.cjs`). Evidence: `DEFAULT_OFF` and the check in `hook-flags.cjs` (`git diff`), exported
- [x] T008 [P] Carry the same rule into the other readers (`.skilled/hooks/shared/hook-flags.mjs`, `hook-flags.ts`, `hook-flags.sh`). Evidence: `.mjs` and `.ts` re-export the `.cjs` function (probe prints `true` for both identity checks); `.sh` adds a `session-relaunch` case in `hook_enabled`
- [x] T009 Make the Hermes arm path honour a file opt-in (`.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs`). No code change was needed: the entrypoint calls `armPendingRecord(payload)` with no env seam (`session-end-arm.mjs:159`), so the resolver reads the file; probe arms with the flag only in the file and stays null with an empty file (`scratch/closeout-hermes-arm.txt`)
- [x] T010 Opt the existing relaunch tests in, once per file or through one helper, with no assertion changed (`.skilled/hooks/session-relaunch/tests/*.test.cjs`, `.opencode/plugins/tests/session-relaunch.test.cjs`, `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts`). Evidence: each diff adds the enable variable to the sandbox env or the cleared-key list, no assertion line removed
- [x] T011 [P] Update the root README switch lines near 233 and 1016 and the Turn On Endless Sessions setup (`README.md`). Evidence: `README.md:87`, `:226`, `:239`, `:1022`, `:1023`, `:1545`, `:1618`
- [x] T012 [P] Update sections 8 and 18 and the hook-flags example (`.env.example`, `.skilled/hooks/hook-flags.env.example`). Evidence: `.env.example:286-287`, `:582`; `hook-flags.env.example:5`, `:49`
- [x] T013 [P] Add the `SYSTEM_SESSION_RELAUNCH_ENABLED` row and mark the destination eligible for `hook-flags.env` (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.skilled/commands/doctor/assets/doctor-env.yaml`). Evidence: `ENV-REFERENCE.md:99`, `doctor-env.yaml:119`
- [x] T014 [P] Update the switch tables and default lines (`.skilled/hooks/session-relaunch/README.md`, `.skilled/hooks/shared/README.md`, `.skilled/hooks/README.md`). Evidence: `session-relaunch/README.md:91`, `:265-266`; `shared/README.md:23`, `:93`; `hooks/README.md:30`, `:36`, `:69`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run `node --test .skilled/hooks/shared/hook-flags.test.cjs` and record output and exit status. Evidence: `scratch/closeout-flags.txt` 27 pass, 0 fail, exit 0
- [x] T016 Run `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/session-relaunch.test.cjs` and record output and exit status. Evidence: `scratch/closeout-node.txt` 872 pass, 0 fail, exit 0
- [x] T017 Run `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` and record output and exit status. Evidence: `scratch/closeout-vitest.txt` 54 passed, exit 0
- [x] T018 Grep the doc surfaces for wording that says the concern is on by default and record zero hits. Evidence: `scratch/closeout-docs-grep.txt`; every default-on hit is another concern or a line that excludes session-relaunch
- [x] T019 Compare pass counts against the T001 baseline and record the delta. Evidence: hook-flags 21 to 27 (+6), node 868 to 872 (+4), vitest 54 to 54 (0), no failures in either run
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row in `acceptance-criteria.md` is Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4, REQ-001 to REQ-009
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md, testing strategy in section 5
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: spec.md section 6; node, bash and vitest all ran (scratch/closeout-*.txt)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: syntax checks only, `node --check` on hook-flags.cjs, hook-flags.mjs, session-end-arm.mjs and `sh -n` on hook-flags.sh, all exit 0 (scratch/closeout-syntax.txt); no separate linter was run
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the only `warning` matches in scratch/closeout-node.txt are two test names; closeout-flags and closeout-vitest carry none
- [x] CHK-012 [P1] A missing or unreadable config file leaves the concern off. Evidence: an empty config gives off (`isHookEnabled("session-relaunch", {}, {})`, hook-flags.test.cjs:143) and `loadConfigFile` returns `{}` for a missing file ("a missing config file is fail-open" test, green)
- [x] CHK-013 [P1] The four readers share one rule and one truthy set. Evidence: `.mjs`/`.ts` export the `.cjs` function itself; the seven-row probe gives 0 mismatches including the `.sh` reader (scratch/closeout-resolver.txt)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md, AC-001 to AC-011 all Met
- [x] CHK-021 [P0] Each new test failed before the change and passes after it. Evidence: scratch/red-flags.txt (5 fail, exit 1) and scratch/red-adapters.txt (2 fail, exit 1) and scratch/red-hermes-arm.txt (1 fail, exit 1), all green in the closeout runs. The kill-switch test and the file opt-in prepare twin are guards that passed before too
- [x] CHK-022 [P1] Edge cases tested: empty enable value, env falsy over file truthy. Evidence: hook-flags.test.cjs:150-157 (empty string off) and :159-164 (env `0` and `""` over file `1` off)
- [x] CHK-023 [P1] No existing assertion weakened by the opt-in. Evidence: the test-file diffs add only the enable variable and the two new tests; no `-` line touches an assertion
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: `cross-consumer` (one resolver, four readers, about ten callers).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for the four readers. Evidence: `.cjs` holds the rule, `.mjs`/`.ts` re-export it, `.sh` mirrors it
- [x] CHK-FIX-003 [P0] Consumer inventory completed for every `isHookEnabled('session-relaunch')` caller. Evidence: spec.md section 2 inventory; callers ask the resolver, so none needed a change, Hermes arm confirmed by `hermes-adapters.test.cjs:606`
- [x] CHK-FIX-004 [P0] Resolver table test covers env, file, both, kill switch and master switch rows. Evidence: hook-flags.test.cjs:208 table, six rows
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: axes are enable source (none, env, file, env over file) by kill switch (none, concern, master) by concern (session-relaunch, one default-on); the test table has 6 rows, the closeout probe 7 rows over 4 readers
- [x] CHK-FIX-006 [P1] Hostile env variant run: a stray `SYSTEM_SESSION_RELAUNCH_ENABLED` in the shell does not leak into the default-off tests. Evidence: `SYSTEM_SESSION_RELAUNCH_ENABLED=1 node --test .skilled/hooks/shared/hook-flags.test.cjs` gives 27 pass, exit 0 (scratch/closeout-flags-hostile-env.txt)
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: uncommitted working tree on top of `933d71235f` in this worktree; nothing is committed yet
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the diff adds one flag name and test fixtures only
- [x] CHK-031 [P0] Config values parsed with the existing KEY=value rules. Evidence: the enable flag goes through the same `resolve` and `isTruthy` as the kill switches (hook-flags.cjs `isHookEnabled`)
- [x] CHK-032 [P1] No new file read outside `hook-flags.env`. Evidence: the resolver diff adds no file access
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: spec.md Files to Change now lists the two harness scripts; T009 records why the Hermes file needed no edit
- [x] CHK-041 [P1] No code comment names a spec, phase or task id. Evidence: a grep of the added lines in the code and test diffs for spec, phase, packet, REQ, AC and task ids found none
- [x] CHK-042 [P1] Every doc surface in scope names the enable flag. Evidence: scratch/closeout-docs-grep.txt, 1 to 8 hits in each of the 11 files
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the closeout probe ran from the session scratchpad and removed its temp dirs; outputs live in scratch/
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Kept on purpose: the red-before and closeout outputs are the evidence the AC rows cite
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 14 | 13/14 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---
