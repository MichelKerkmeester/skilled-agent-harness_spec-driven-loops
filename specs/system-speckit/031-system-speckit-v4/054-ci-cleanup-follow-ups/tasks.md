---
title: "Tasks: CI Cleanup Follow-ups"
description: "Task list and verification checklist for phase 054, the spec-gate /tmp exemption removal, the CI TMPDIR workaround removal and the cli-jev pipefail fixes"
trigger_phrases:
  - "ci cleanup follow-ups"
  - "spec gate tmp exemption"
  - "cli-jev pipefail"
  - "tmpdir workaround removal"
  - "drift guard errors"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CI Cleanup Follow-ups

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

- [x] T001 Read the gate and its tests - **Evidence**: recorded before the change: `isExemptTargetPath` in `spec-gate-core.mjs` exempted every write under /tmp and /private/tmp by location through the helper `isUnderAnyRoot`, and with TMPDIR=/tmp the core spec-gate suite failed 16 tests, the devin suite 6 and the cursor suite 8.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 New /tmp test (red) - **Evidence**: recorded in wu1: the new test "a repository rooted under /tmp is gated like any other" expects deny under enforcement and it failed against the old gate before the change.
- [x] T003 Gate change - **Evidence**: recorded in wu2: `spec-gate-core.mjs` dropped the helper `isUnderAnyRoot` and the /tmp and /private/tmp clause in `isExemptTargetPath`, and the doc comment now says a repo under /tmp is gated like any other.
- [x] T004 Run the four gate suites under both temp dirs - **Evidence**: `node --experimental-test-module-mocks --test spec-gate-core.test.mjs` reports 108 of 108 pass with TMPDIR=/tmp and with the default temp dir, and the devin suite 15 of 15, the cursor suite 17 of 17 and the Pi suite 9 of 9 pass the same way.
- [x] T005 Root project under /tmp - **Evidence**: the runtime root vitest project run with TMPDIR=/tmp reported 1,291 passed and 1 failed on `opencode-plugins-folder-purity.vitest.ts`, which could not import the gitignored dist of `sk-communication/cli-communication-projection`, and after building that dist the project stands at 1,292 passed, 0 failed and 13 skipped.
- [x] T006 CI workaround removal - **Evidence**: `grep -c TMPDIR` on `.github/workflows/spec-kit-check.yml` returns 0 after the 4-line TMPDIR workaround was removed from the Runtime vitest project step (wu3).
- [x] T007 Playbook wording - **Evidence**: recorded in wu4 and wu5: step 3 of `spec-mutation-gate-enforce.md` now says any fixture location works, /tmp included, and step 1 of `codex-hook-parity.md` no longer says the core exempts /tmp.
- [x] T008 Playbook count - **Evidence**: recorded in wu7: step 2 of `spec-mutation-gate-enforce.md` now expects 108 tests instead of 107, and the repo-wide search found no other text describing the /tmp exemption or the old 107 count.
- [x] T009 cli-jev pipefail - **Evidence**: `bash -n` on the six cli-jev probe scripts reports all ok after `set -u` became `set -uo pipefail` in each (wu6).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Drift guards - **Evidence**: `run-all-drift-guards.sh` reports all 2 guards passed and Errors 0, down from the 6 errors the six probe scripts carried before.
- [x] T011 Commit - **Evidence**: recorded in the commit list: branch `worktrees/066-ci-cleanup-follow-ups` carries `7bde922cba` fix(system-spec-kit): gate a repository under /tmp like any other and `a06dba0800` fix(cli-jev): run the recorded probe scripts under pipefail.
- [x] T012 Packet docs and parent rows - **Evidence**: recorded in the identity section: this packet is phase 54 of 55 under `specs/system-speckit/033-system-speckit-v4` with predecessor `050-ci-cleanup-pi-proof`, and the evidence pack records all tasks done with status Complete.
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

- [x] CHK-001 [P0] The problem is stated before any change, the gate exempts writes under /tmp and /private/tmp by location and six cli-jev scripts carry only `set -u` - **Evidence**: the problem section of `evidence/dispatch/evidence.md` records both facts with the measured failures of 16 core tests, 6 devin tests and 8 cursor tests under TMPDIR=/tmp.
- [x] CHK-002 [P0] A pre-change baseline is captured before the first edit - **Evidence**: with TMPDIR=/tmp the core spec-gate suite failed 16 tests, the devin suite 6 and the cursor suite 8, and the six probe scripts were the sk-code drift guard's 6 remaining errors (command N/A - insufficient source context).
- [x] CHK-003 [P1] The scope decision is recorded before the fix - **Evidence**: the decisions section of `evidence/dispatch/evidence.md` records the operator choice on 2026-09-23 to remove the location rule and keep the out-of-repo exemption.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The rule change lands at the gate that owns the wrong rule - **Evidence**: `spec-gate-core.mjs` dropped the helper `isUnderAnyRoot` and the /tmp and /private/tmp clause in `isExemptTargetPath`, and the doc comment now covers a repo under /tmp (wu2, command N/A - insufficient source context).
- [x] CHK-011 [P0] The new regression test turns from red to green - **Evidence**: the test "a repository rooted under /tmp is gated like any other" expects deny under enforcement, failed against the old gate and passes after the change (wu1, command N/A - insufficient source context).
- [x] CHK-012 [P1] All four spec-gate suites pass with the temp dir at /tmp and at the default - **Evidence**: `node --experimental-test-module-mocks --test spec-gate-core.test.mjs` reports 108 of 108 pass and the devin suite 15 of 15, the cursor suite 17 of 17 and the Pi suite 9 of 9 pass the same way.
- [x] CHK-013 [P1] The root runtime vitest project passes with TMPDIR=/tmp - **Evidence**: the project stands at 1,292 passed, 0 failed and 13 skipped after the gitignored communication-projection dist is built.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria are met, REQ-001 with AC-001, REQ-002 with AC-002, REQ-003 with AC-003, REQ-004 with AC-004 and REQ-005 with AC-005 - **Evidence**: the requirement and acceptance ids section of `evidence/dispatch/evidence.md` records every one of REQ-001 to REQ-005 as Met with its own evidence.
- [x] CHK-021 [P0] The CI workflow runs the runtime vitest step on the runner's default temp dir - **Evidence**: `grep -c TMPDIR` on `.github/workflows/spec-kit-check.yml` returns 0 after the 4-line workaround was removed (wu3).
- [x] CHK-022 [P1] The six cli-jev probe scripts parse and run under pipefail - **Evidence**: `bash -n` on the six scripts reports all ok and each now sets `set -uo pipefail` (wu6).
- [x] CHK-023 [P1] The drift guards report zero errors after the script change - **Evidence**: `run-all-drift-guards.sh` reports 2 guards passed and Errors 0, down from 6.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each fix lands at the surface that owns the wrong bytes rather than at a checker - **Evidence**: the rule left the gate, the workaround left the workflow, the wording changed in the two playbooks and the shell option changed in the six probe scripts (wu1 to wu7, command N/A - insufficient source context).
- [x] CHK-FIX-002 [P0] The same-class producer inventory is completed by search - **Evidence**: a repo-wide search found no other text describing the /tmp exemption or the old 107 count (rg over the tree outside specs/ for the exemption wording and for the old count, 0 hits).
- [x] CHK-FIX-003 [P0] The consumer inventory for the changed gate policy and the changed scripts is re-run - **Evidence**: the four spec-gate suites and the root runtime vitest project were run under both temp dirs and `bash -n` covers all six scripts, with the counts recorded above.
- [x] CHK-FIX-004 [P0] The path and policy fix is covered by a test at the new boundary - **Evidence**: the new core test expects deny under enforcement for a repository rooted under /tmp and the core suite passes 108 of 108 under both temp dirs with `node --experimental-test-module-mocks --test spec-gate-core.test.mjs`.
- [x] CHK-FIX-005 [P1] The comparison axes and row counts are listed before completion is claimed - **Evidence**: the axes are the four gate suites at 108, 15, 17 and 9 tests and the root project at 1,292 passed, 0 failed and 13 skipped.
- [x] CHK-FIX-006 [P1] The hostile environment variant runs because the suites read process-wide temp state - **Evidence**: every suite ran twice, once with TMPDIR=/tmp and once with the default temp dir, with the same results.
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit commits rather than a moving range - **Evidence**: the tree is pinned to commits `7bde922cba` and `a06dba0800` on branch `worktrees/066-ci-cleanup-follow-ups` and every claim above cites a recorded result.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The gate change widens enforcement only for repositories under /tmp and keeps the rest of the policy intact - **Evidence**: just the /tmp and /private/tmp clause and its helper left the gate and the out-of-repo exemption stayed (wu2 and the decisions section).
- [x] CHK-031 [P0] No failure is papered over at the checker or in CI - **Evidence**: the workaround left the workflow instead of staying and `grep -c TMPDIR` on it returns 0 (wu3).
- [x] CHK-032 [P1] The recorded probe scripts keep trustworthy exit codes after the shell option change - **Evidence**: every pipeline in them starts with printf so a recorded exit code only changes if printf itself fails, and `bash -n` is ok on all six (wu6).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `validate.sh --strict` passes on this packet - **Evidence**: `validate.sh --strict --no-recursive` on this packet printed Errors 0, Warnings 0 and RESULT: PASSED.
- [x] CHK-041 [P1] No doc still describes the /tmp exemption or the old 107 count - **Evidence**: a repo-wide search found no other text describing the /tmp exemption or the old 107 count, step 3 of `spec-mutation-gate-enforce.md` allows any fixture location with /tmp included and step 2 expects 108 tests (command N/A - insufficient source context).
- [x] CHK-042 [P2] The worktree build gap is recorded as an observation for later work - **Evidence**: the observation section of `evidence/dispatch/evidence.md` records that a fresh worktree does not build the gitignored dists the suites import and the tests fail to load until they are built.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The test workspaces stay under the system temp dir instead of inside the tree - **Evidence**: `makeWorkspace` in `spec-gate-core.test.mjs` takes a base directory with default `os.tmpdir()` and the suites ran under both temp dirs (wu1).
- [x] CHK-051 [P1] The change set holds only the recorded files and commits - **Evidence**: this phase's code landed in exactly two commits, `7bde922cba` and `a06dba0800`, and the what-changed section of `evidence/dispatch/evidence.md` lists every touched file.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-23
<!-- /ANCHOR:summary -->

---



