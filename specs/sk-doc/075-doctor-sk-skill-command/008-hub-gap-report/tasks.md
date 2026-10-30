---
title: "Tasks: Phase 8: hub-gap-report"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hub gap report tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: hub-gap-report

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`DOC` is `.skilled/commands/doctor`. `CK` is `node .skilled/commands/doctor/scripts/sk-skill-check.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the phase 2 check script exists (`DOC/scripts/sk-skill-check.cjs`). Verify: `CK check --help` exits 0. Observed: the script runs; `--help` is not an option, and an unknown option prints `USAGE: Unknown option: --help` and exits 2 as `parseArguments` specifies.
- [x] T002 Pick a shipped hub and mode whose `parent-skill-check.cjs` run is clean (`scratch/hub-choice.md`). Verify: `node DOC/scripts/parent-skill-check.cjs .skilled/skills/<hub>` exits 0. Observed: `cli-classifier` exits 0 with `OK: parent-skill-check — all hard invariants passed, 0 warnings`, and its one mode `cli-jev` is the happy path; `sk-doc` and `system-deep-loop` are also clean and cover the `FULL_INVENTORY` and lexical cases. The choice is recorded in the test (`cli-classifier`) rather than a scratch note.
- [x] T003 [P] Build an invented fixture hub with one mode lacking `routerSignals` (`DOC/scripts/tests/fixtures/`). Verify: `node DOC/scripts/parent-skill-check.cjs <fixture>` reports the missing signal. Observed: `fixtures/sk-skill-check/hubs/hub-gap` registers `fixture-gap-mode` and `fixture-gap-mute` while only the first carries `routerSignals`; `fixtures/sk-skill-check/hubs/hub-inventory` adds a `FULL_INVENTORY` block and a lexical mode. The invented hub cannot pass the full hub contract by construction, so the signal is read from its own `hub-router.json` in the unit test and the whole-hub checker is stubbed there.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the hub probes for rows 4 to 8 and 10 (`DOC/scripts/lib/sk-skill-surface.cjs`). Verify: unit cases for each probe pass. Observed: `readHubStageTwo`, `stageTwoIntentProbe`, `stageTwoInventoryProbe`, `hubVocabularyProbe`, `hubModeTableProbe`, `hubDescriptionProbe` and `runAdvisorProjection` report PASS, FINDING and N/A across both fixture hubs.
- [x] T005 Add `--into-hub <hub>` with text and JSON output (`DOC/scripts/sk-skill-check.cjs`). Verify: `CK check <mode> --into-hub <hub> --json` prints 11 rows. Observed: `CK check cli-jev --into-hub cli-classifier --json` exits 0 with `mode: "hub"` and rows H1 to H11.
- [x] T006 Print n/a for row 5 without `FULL_INVENTORY` and row 10 for a `metadata` mode; print UNKNOWN for row 10 on advisor exit 75. Verify: the three cases pass in `sk-skill-check.test.cjs`. Observed: `H5` N/A and `H10` N/A on `hub-gap`, `H5` PASS on `hub-inventory`, and `advisor exit 75 leaves the projection row UNKNOWN and never a pass` passes.
- [x] T007 Add the flag through the sk-create-command mode to `_routes.yaml` `allowed_flags`, `DOC/assets/doctor-sk-skill-check.yaml`, `DOC/sk-skill.md` and `DOC/assets/doctor-sk-skill-presentation.txt`. Verify: `bash DOC/scripts/route-validate.sh` exits 0. Observed: exit 0 with `OK: route-validate — 19 routes validated, 3 warnings`. The frontmatter `argument-hint` is unchanged because `command-contract.json`, outside this phase's file list, pins that exact string; see `implementation-summary.md`.
- [x] T008 Add the tests (`DOC/scripts/tests/sk-skill-check.test.cjs`). Verify: `node --test DOC/scripts/tests/sk-skill-check.test.cjs` passes. Observed: exit 0 with `tests 53 / pass 53 / fail 0`; twenty-two of them are hub-gap cases, including one that copies a fixture hub, deletes its `hub-router.json` and runs the real `parent-skill-check.cjs`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run against the chosen shipped hub. Verify: every applicable row prints present and the exit code is 0. Observed: `CK check cli-jev --into-hub cli-classifier` exits 0 with `Rows: 11; 9 pass, 0 finding(s), 0 unknown, 2 n/a` and `Result: PASS`; `CK check sk-create-command --into-hub sk-doc` exits 0 with `10 pass, 1 n/a`; `CK check sk-create-skill-parent --into-hub sk-doc --json` exits 0 with `skill: "sk-create-skill-parent"` on every mode-scoped row; `CK check review --into-hub system-deep-loop` exits 0 with `H10 PASS` from the live advisor. All 42 modes across the 7 shipped hubs report 0 findings and 0 unknown.
- [x] T010 Run against the fixture hub. Verify: row 2 prints missing and the exit code is 1. Observed: the test `the hub gap report carries all eleven rows and finds the mode with no stage-one signal` asserts `H2 FINDING` and exit 1; a CLI run against the invented hub also prints `H2  FINDING  Stage-one signals: hub-router.json routerSignals has no entry for fixture-gap-mute` and exits 1, alongside the hub-contract findings the invented hub deliberately has. The copied-hub case with `hub-router.json` deleted asserts `H2` and `H3` are findings carrying the real `FAIL: 5a` line.
- [x] T011 Prove the run writes nothing. Verify: `git status --porcelain` before and after a run is identical. Observed: 14 porcelain entries before and 14 after `CK check sk-create-skill-parent --into-hub sk-doc --json`; `diff` prints nothing and the run exits 0.
- [x] T012 Run the doctor suite. Verify: `bash DOC/scripts/tests/run-all.sh` prints every suite PASS. Observed: exit 0 with `[run-all] 7 suite(s) passed, 0 failed`.
- [x] T013 [P] Add the shared-packet and copied-hub fixtures (`DOC/scripts/tests/fixtures/sk-skill-check/hubs/hub-shared-packet/`). Verify: the two-mode fixture's registry registers both modes on one packet. Observed: `hub-shared-packet` registers `fixture-shared-mode` and `fixture-shared-mode-parent` on packet `fixture-shared-mode`; the copied-hub case builds its hub from `hub-gap` at run time and deletes only `hub-router.json`.
- [x] T014 Confirm each row against its checker's PASS line instead of its silence, and stop counting `FULL_INVENTORY` as a mode's own stage-two intent (`DOC/scripts/sk-skill-check.cjs`, `DOC/scripts/lib/sk-skill-surface.cjs`). Verify: the new tests fail on the previous code and pass now. Observed: on the previous code "a hub whose hub-router.json is gone" reported `H2 PASS` and "a row whose confirming PASS line is absent" reported `H1 PASS`; both now report `FINDING` and `UNKNOWN` respectively, and 53 of 53 tests pass.
- [x] T015 Report the mode that was named, not another mode sharing its packet, and read the human-facing table and the advisor projection strictly (`DOC/scripts/sk-skill-check.cjs`, `DOC/scripts/lib/sk-skill-surface.cjs`). Verify: `CK check sk-create-skill-parent --into-hub sk-doc --json` names the parent mode. Observed: exit 0, `skill: "sk-create-skill-parent"`, H1 `Registered as sk-create-skill-parent`, H4 intent list `SKILL_CREATION, PARENT_HUB` without `FULL_INVENTORY`, and every row PASS or `N/A`.
- [x] T016 Accept the inline hub form and make the text renderer name an unfinished table (`DOC/scripts/sk-skill-check.cjs`, `DOC/assets/doctor-sk-skill-check.yaml`, `DOC/sk-skill.md`, `DOC/assets/doctor-sk-skill-presentation.txt`). Verify: `CK check sk-create-skill-parent --into-hub=sk-doc` runs the report; a run with an unreachable checker prints `Unverified:` lines and `Result: INCOMPLETE`. Observed: the inline form exits 0 with the same eleven rows; the render test asserts one `Unverified:` line per entry and `Result: INCOMPLETE`; the workflow's first step and the router name `--into-hub <hub>` as the value form.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: one `/doctor:sk-skill check --into-hub` run in an agent runtime renders the table — deferred: no agent runtime is reachable from this non-interactive worker. The render path is covered by `renderHubText` assertions in the test suite and by the CLI runs pasted in `implementation-summary.md`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design**: `../scratch/design.md` sections 1 and 5 (phase 8)
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

A blocked task is marked `[B]` with the blocking phase named; a P0 item never closes blocked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — evidence: REQ-001 to REQ-006, each mapped to an AC row
- [x] CHK-002 [P0] Technical approach defined in plan.md — evidence: section 3 names the row sources, the probes and the data flow
- [x] CHK-003 [P1] Phase 2 closed and the shipped hub chosen — evidence: `cli-classifier` runs parent-skill-check clean; `sk-doc` and `system-deep-loop` cover the `FULL_INVENTORY` and lexical cases
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on both changed scripts — evidence: both exit 0
- [x] CHK-011 [P0] No row is reported present without a probe that ran — evidence: every PASS is computed from a child-process result, a parsed invariant line or a file read; an absent probe yields UNKNOWN, and a row that folds in `parent-skill-check.cjs` needs that checker's confirming PASS line, asserted by the exit-75, unreadable-mirror, parent-check-exit-2, copied-hub and confirming-PASS tests
- [x] CHK-012 [P1] A checker that cannot run gives UNKNOWN and exit 2 — evidence: `parent-skill-check that cannot run leaves its rows UNKNOWN and exits 2` and `mirror drift is a finding and an unreadable mirror checker exits 2`
- [x] CHK-013 [P1] Code follows the existing doctor script patterns — evidence: `CheckError` codes, `runChild` with `PYTHONDONTWRITEBYTECODE`, `readJsonFile`, and the `PASS`/`FINDING`/`UNKNOWN`/`N/A` row vocabulary the deep report uses
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — evidence: AC-001 to AC-006 `Met` with command output
- [x] CHK-021 [P0] Shipped-hub and fixture-hub runs give the expected rows — evidence: `the shipped hub and its mode report every applicable row present` and `the hub gap report carries all eleven rows and finds the mode with no stage-one signal`
- [x] CHK-022 [P1] n/a and UNKNOWN cases tested — evidence: H5 N/A, H10 N/A, H10 UNKNOWN on exit 75, H11 UNKNOWN on a broken checker, and H1, H2, H3 and H9 UNKNOWN when their confirming PASS line is absent
- [x] CHK-023 [P1] `run-all.sh` passes — evidence: `7 suite(s) passed, 0 failed`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

A review of the `--into-hub` report named one P0, two P1 and seven P2 defects. Every P0 and P1 landed with a test that failed on the previous code first; the failure text is recorded here as the observed pre-fix state.

| Finding | Class | Fix | Evidence |
|---------|-------|-----|----------|
| H2 and H3 passed by absence when `parent-skill-check.cjs` stopped before its 5b, 5e or 5i line | P0 | `5a` joined both failure patterns, a row now requires its confirming PASS line, and H1 and H9 carry the same guard | The copied-hub test reported `H2 PASS` before the fix and `H2 FINDING` with `5a` after; the truncated-transcript test reported `H1 PASS` before and `H1 UNKNOWN` after |
| `FULL_INVENTORY` counted as a mode's own stage-two intent | P1 | The full-toolkit key is excluded from both the text map and the parsed router map | The new unit test reported `PASS` before the fix and `FINDING` after; the live `sk-create-skill-parent` run no longer lists `FULL_INVENTORY` among its intents |
| A requested mode was reported as another mode sharing its packet | P1 | The registry entry carries its `workflowMode`, and `findHubMode` prefers an exact `workflowMode` before the packet fallback | The shared-packet fixture reported `skill: fixture-shared-mode` before the fix and `fixture-shared-mode-parent` after; the live `sk-create-skill-parent` run names the parent mode on every row |
| Advisor vocabulary matched substrings | P2 | Whole-token matching through the shared token pattern | The `"go"` against `"google docs"` unit case reported `PASS` before and `FINDING` after |
| Any table row counted as a mode-table row, and the stated counts were never read | P2 | Rows come only from the mode-axis table, and the stated "N modes across M packets" is compared with the registry's distinct counts | The decoy-table case and the overstated-count case both reported `PASS` before and `FINDING` after |
| A projection hit could come from another hub's `workflowMode` field | P2 | Only `entry.skill` names a recommendation, matched against the hub id or the mode's `legacyAdvisorId` | The foreign-recommendation test reported `PASS` before and `FINDING` after; the live `review` run still reports `H10 PASS` |
| Text mode printed a result line that hid an unfinished table | P2 | `renderHubText` prints each unverified entry and `Result: INCOMPLETE` on exit 2 | The render test found no `Unverified:` line and `NO FINDINGS (4 UNKNOWN)` before, and one line per entry plus `INCOMPLETE` after |
| `--into-hub=<hub>` was rejected as an unknown option | P2 | The inline form is parsed as the option's own value | The parse test threw `USAGE` before and returns `intoHub: "hub-gap"` after |
| The workflow step never passed `--into-hub` to the engine | P2 | Step 1 names the flag beside the name and `--json`; the input line names the inline form | `doctor-sk-skill-contract.test.cjs` passes and `route-validate.sh` still resolves every invocation |
| The router did not say the flag consumes the next token | P2 | One routing line says the hub is the value, never a second skill argument | The router template test still finds six headings and no inline status line |

- [x] CHK-FIX-010 [P0] No row passes without its confirming invariant line — evidence: `a hub whose hub-router.json is gone reports H2 and H3 as findings, never a pass by absence` and `a row whose confirming PASS line is absent stays UNKNOWN instead of passing` fail on the previous code and pass now
- [x] CHK-FIX-020 [P1] The report describes the mode that was asked for — evidence: `two modes that share one packet are reported as the mode that was named`, plus the live `sk-create-skill-parent` run
- [x] CHK-FIX-021 [P1] The full-toolkit intent cannot stand in for a mode's stage-two intent — evidence: `a stage-two intent that reaches the mode only through FULL_INVENTORY is a finding`
- [x] CHK-FIX-030 [P2] Advisor vocabulary and projection hits are scoped — evidence: `advisor vocabulary matches whole tokens, so a short phrase cannot match inside a word` and `a projection recommendation counts only when it names the hub or the mode legacy advisor id`
- [x] CHK-FIX-031 [P2] The human-facing contract reads the mode table and the stated counts — evidence: `the mode table probe reads only the table whose header names Mode and checks the stated counts`
- [x] CHK-FIX-032 [P2] An unfinished table reads as unfinished in both outputs — evidence: `the hub gap text prints each unverified entry and INCOMPLETE when the table is unfinished`
- [x] CHK-FIX-033 [P2] The inline hub form parses — evidence: `the hub gap argument accepts the inline --into-hub=<hub> form`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The option writes nothing — evidence: identical `git status --porcelain` before and after a live run; the route stays `mutating: read-only` and `route-validate.sh` accepts it
- [x] CHK-031 [P0] Hub and skill arguments are validated; a `local-` prefix is refused — evidence: `HUB_NOT_A_HUB`, `HUB_NOT_FOUND`, a repeated, valueless or inline-empty `--into-hub`, and `PRIVATE_ROOT_REFUSED` are asserted in `a path that is not a hub and a private hub name are refused with exit 2` and `the hub gap argument parses its hub and rejects a missing or repeated hub`, and the inline `--into-hub=<hub>` form is asserted in `the hub gap argument accepts the inline --into-hub=<hub> form`
- [x] CHK-032 [P1] Fixtures use invented names only — evidence: `fixture-hub-gap`, `fixture-gap-mode`, `fixture-gap-mute`, `fixture-hub-inventory` and `fixture-inventory-mode`; no private prefix in the fixtures
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — evidence: spec status Complete, every task ticked, AC rows Met, implementation summary filled
- [x] CHK-041 [P1] The presentation footer lists which rows have no CI gate — evidence: the Hub Gap Report section states that no gate covers H4, H5, H6, H8 and H10 and that H7 is name-only; the engine footer repeats it and the render test asserts it; an unfinished table is described as `Result: INCOMPLETE` with one `Unverified:` line per probe
- [x] CHK-042 [P2] README lines for the option added if phase 7 already closed — N/A: phase 007 owns the README, the Doctor section and the changelogs, and has not closed, so the option's prose lands there rather than in this phase
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working notes live in `scratch/` only; fixtures live under `DOC/scripts/tests/fixtures/` — evidence: the packet `scratch/` folder is empty and both fixture hubs live under `scripts/tests/fixtures/sk-skill-check/hubs/`
- [x] CHK-051 [P1] scratch/ cleaned before completion — evidence: `ls` on the packet `scratch/` prints nothing
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 12 | 12/12 |
| P2 Items | 5 | 5/5 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---



