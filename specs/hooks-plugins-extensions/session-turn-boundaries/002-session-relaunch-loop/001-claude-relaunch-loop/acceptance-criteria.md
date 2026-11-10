---
title: "Acceptance Criteria: Claude relaunch loop"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "Claude relaunch acceptance criteria"
  - "phase 001 closure gate"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Claude relaunch loop

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is Met, Waived or Superseded. A Waived or Superseded row must
> name an ADR that exists in decision-record.md.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop
**Level:** 3
**Status:** Complete
**Date:** 2026-10-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. AC-ID is stable once written. Supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | S1 answers (a) to (d) are recorded, with no blank verdict. (seed AC-1.1) | Implementation summary, S1 Answers. Evidence: run-ledger.md, Lane 1.0 and D1 result. Sources: specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:22 and specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:31. | Met | - |
| AC-002 | REQ-002 | a red run of the new tests (non-zero exit, assertion failures rather than syntax or import errors) is in the ledger before lane 1.3 starts. (seed AC-1.2) | node --test .skilled/hooks/session-relaunch/tests/*.test.cjs: exit 1, 65 tests, 64 assertion failures, 0 syntax or import errors, before lane 1.3. Evidence: run-ledger.md, Red run. Source: specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:55. | Met | - |
| AC-003 | REQ-003 | node --test <explicit test files> ends with # fail 0. Every bullet in section 9 maps to at least one named test. (seed AC-1.3) | node --test .skilled/hooks/session-relaunch/tests/*.test.cjs: 102 tests, 102 pass, 0 fail, exit 0. Named test mapping follows this table. Evidence: lane 1.10 test run. Sources: specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:84 and .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:262 and .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:306 and .skilled/hooks/session-relaunch/tests/context-usage.test.cjs:40 and .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:265 and .skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts:48. | Met | - |
| AC-004 | REQ-004 | a named killer test proves SIGTERM reaches only descendants of the wrapper and only when SKILLED_LOOP_ID matches. (seed AC-1.4) | `killer signals an idle target and releases its lock` confirms the descendant case. `killer never signals a target that is not a descendant of SKILLED_LOOP_ID` at .skilled/hooks/session-relaunch/tests/killer.test.cjs:219 confirms refusal for a live sibling target. The full suite passed with 102 tests, 102 pass, 0 fail and exit 0. The new test asserts the target stays alive. It also checks the refusal log and armed record. Without the ancestry check, the armed-record path would send SIGTERM to the idle target and `target.signalCode` would fail its assertion. Evidence: lane 1.10 test run and .skilled/hooks/session-relaunch/tests/killer.test.cjs:198 and .skilled/hooks/session-relaunch/tests/killer.test.cjs:219. | Met | - |
| AC-005 | REQ-005 | sync-hook-registrations.cjs --check exits 0. The delta against baseline is only the Claude rows. hook-registration-sync.vitest.ts passes. (seed AC-1.5) | sync-hook-registrations.cjs --check: PASS, 32 hooks against baseline 31, session-relaunch registry object only, settings diff has three commands, exit 0. Registry vitest: 7/7. Its exit code was not recorded. Evidence: run-ledger.md, Gate PG, PG2 and PG5. Sources: specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:85 and specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:89. | Met | - |
| AC-006 | REQ-006 | the command passes check_authored_name_kebab.py and validate_document.py --type command (exit 0). Mirror checks are at baseline or better. (seed AC-1.6) | check_authored_name_kebab.py and validate_document.py --type command: exit 0. sync-runtime-mirrors.cjs --check recheck passed at 189 mirrors against baseline 185. Recheck exit code was not recorded. Evidence: run-ledger.md, D7 and Gate PG, PG3. Sources: specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:51 and specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:86. | Met | - |
| AC-007 | REQ-007 | the section 10 gates pass and no spec paths or ids appear in new code comments. (seed AC-1.7) | run-all-drift-guards.sh: exit 0, 4/4 guards passed, 278 warnings equal baseline. Hygiene grep was clean. Evidence: run-ledger.md, D15 and Gate PG, PG4. Sources: specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:73 and specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:87. | Met | - |
| AC-008 | REQ-008 | every doc above exists and passes its validators (section 11, item 6). (seed AC-1.8) | validate_document.py passed with exit 0 on all eight phase documents. Final hvr_scan passed on the four edited docs with exit 0 and 0 em dashes. Strict child validation is recorded in CHK-009 after its run. Evidence: run-ledger.md, D21 and D24. Sources: specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:79 and specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:90. | Met | - |
| AC-009 | REQ-009 | live relaunch on Claude (procedure below). (seed AC-1.9) | SESSION_RELAUNCH_THRESHOLD=0.05 /bin/bash .skilled/bin/skilled-loop claude -n relaunch-live: one Claude hop in the same pane, name preserved, note open to claimed to done, wrapper exit 0. Evidence: run-ledger.md, Live run 1 and scratch/live-run-1-note.md and scratch/live-run-1-relaunch.log. Sources: specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:98 and specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:100 and specs/hooks/023-session-relaunch-loop/001-claude-relaunch-loop/scratch/live-run-1-note.md:2. | Met | - |
| AC-010 | REQ-010 | every Claude playbook scenario has a recorded result (pass, fail or not-run with the reason). (seed AC-1.10) | P, L1 and scenarios 01 to 10 have recorded final results. All passed. Scenario 03's initial assertion failure and corrected rerun are recorded. Evidence: run-ledger.md, PG7 playbook results and scratch/playbook-run/. Sources: specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:112 and specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:114 and specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:118 and specs/hooks/023-session-relaunch-loop/scratch/run-ledger.md:123. | Met | - |
<!-- /ANCHOR:criteria -->

### AC-003 Named Test Mapping

The named tests below map the required test bullets to the recorded suite. The registry vitest lives outside the session-relaunch tests directory.

| Test bullet | Named test |
|-------------|------------|
| Core | relaunch-core.test.cjs: `arm changes pending to armed, records the live cwd, and is idempotent` and `completeHandoff moves a claimed note to done with completion metadata` (.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:262 and .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:203) |
| CLI | session-relaunch-cli.test.cjs: `should-relaunch prints one no-file JSON line for a corrupt record` (.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:306) |
| Context reader | context-usage.test.cjs: `readClaudeFill uses the last main-chain assistant usage, not a later sidechain or a cumulative sum` (.skilled/hooks/session-relaunch/tests/context-usage.test.cjs:40) |
| Wrapper | skilled-loop.test.cjs: `SESSION_RELAUNCH_MAX_HOPS=2 permits only two relaunches after the initial run` (.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:265) |
| Killer | killer.test.cjs: `killer signals an idle target and releases its lock` (.skilled/hooks/session-relaunch/tests/killer.test.cjs:198) and `killer never signals a target that is not a descendant of SKILLED_LOOP_ID` (.skilled/hooks/session-relaunch/tests/killer.test.cjs:219). |
| Registry vitest | .skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts: `reproduces the committed registration files byte for byte` (.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts:48). Evidence for the 7/7 suite result: run-ledger.md, Gate PG, PG5. |

Test names and locations were confirmed in the listed test files. The earlier 101-test suite result is in run-ledger.md, Gate PG, PG1. Lane 1.10's full-suite run passed 102 tests with exit 0.

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All ten acceptance criteria are Met. AC-004 now has both the descendant signal test and a named non-descendant refusal test. Strict child validation reports RESULT: PASSED from the final state (2026-10-18, 0 errors), which closes the last tasks.md item. Evidence: .skilled/hooks/session-relaunch/tests/killer.test.cjs:198 and .skilled/hooks/session-relaunch/tests/killer.test.cjs:219.
<!-- /ANCHOR:closure -->
