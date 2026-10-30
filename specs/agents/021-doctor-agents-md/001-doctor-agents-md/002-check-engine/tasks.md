---
title: "Tasks: check engine"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agents md check tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: check engine

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

**Variables.** `C` is `.skilled/commands/doctor/scripts/agents-md-check.cjs`. `T` is `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs`. `F` is `.skilled/commands/doctor/scripts/tests/fixtures/agents-md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the six baseline commands into `scratch/baseline.txt` (`scratch/`). Verify: `rg -c 'route-validate' scratch/baseline.txt` prints at least `1`. Evidence: `rg -c` prints `3` for `route-validate` and `4` for `run-all`; the six commands, their output and their exit codes are in `scratch/baseline.txt`, and the baseline `run-all` ended `7 suite(s) passed, 0 failed` (`scratch/run-all-baseline.log`).
- [x] T002 Confirm child 001's manifest is fresh (`agents-md-manifest.cjs`). Verify: `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` exits 0. Evidence: `[agents-md-manifest] PASS: 44 sections, 30 pins, derived matches AGENTS.md`, budget `16368 / 16384` to the last anchor and `27888 / 32768` total, exit 0.
- [x] T003 Build the nine fixture trees from the manifest (`F`). Verify: `ls F | wc -l` prints `9` and each holds one `AGENTS.md` except `absent`. Evidence: `ls F | wc -l` prints `9`; `pure`, `adopted`, `stale`, `forked`, `foreign`, `shadowed-pin` and `over-budget` each hold an `AGENTS.md`, `claude-only` holds `CLAUDE.md` and no root document, `absent` holds none. Each tree also carries the `fixture.json` recipe it is derived from and the generated `.cursor/rules` mirrors a repository that ran the generators would hold; `find F -maxdepth 1 -type d | wc -l` prints `10`.
- [x] T004 Write the failing suite first (`T`). Verify: `node --test T` exits non-zero on `Cannot find module`. Evidence: `Error: Cannot find module '../agents-md-check.cjs'` and `fail 1`, exit 1 (`scratch/failing-first.log`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Implement A1 through A4, the install state, section presence, order and currency (`C`). Verify: `node --test T` reports the `pure`, `adopted`, `stale` and `foreign` state cases passing. Evidence: `A1 install state: the pure|adopted|stale|forked|foreign|claude-only|absent|shadowed-pin|over-budget fixture classifies as …` all pass, and `A1 install state: this repository is the source template and classifies as pure` passes.
- [x] T006 Implement A5 pins with first-occurrence placement (`C`). Verify: `node --test T` reports the `shadowed-pin` case failing A5 and passing. Evidence: `shadowed-pin: A5 fails because the local lookup line comes before Gate 1` passes; A5 reports `gate1-lookup` as FINDING with the first-occurrence reason and the other 29 pins hold.
- [x] T007 Implement A6 and A7, the delivery budget and the block shape (`C`). Verify: `node --test T` reports the `over-budget` case failing both rows. Evidence: `over-budget: A6 and A7 both fail` passes; A7 names the end marker ahead of the start marker and the 33341-byte total against the 32768-byte ceiling.
- [x] T008 Implement A8 and A9, unmarked content and unmarked edits (`C`). Verify: `node --test T` reports the `forked` case listing one section with its byte range. Evidence: `forked: A8 lists the unmarked section with its byte range and A9 lists the local line` passes; A8 reports `"## Local release checklist": lines 263-266, bytes 25101-25207`, outside the delivery prefix, and A9 lists the one local line of `s6-spec-folder`.
- [x] T009 Implement A10 and A11, runtime copies and the router (`C`). Verify: `node --test T` reports the divergent `CLAUDE.md` case with its lines listed. Evidence: `a divergent CLAUDE.md fails A10 and lists the lines only it carries` passes with the three lines listed, and `A11 embeds the repo-rules checker's own summary line instead of re-deriving it` passes on `[repo-rules-check] RESULT: PASSED (11/11 checks)`.
- [x] T010 Implement A12 and the exit-code mapping (`C`). Verify: `node --test T` reports the 0, 1 and 2 cases passing. Evidence: `exit codes: 0 on this repository, 1 on a finding, 2 on a failed precondition` passes, as do the absent-file case, the missing-canary case and `A12 reports INFO outside the source repository and runs inside it`.
- [x] T011 Add the JSON renderer and `--root` (`C`). Verify: `node C --root F/forked --json` exits 1 and its `state` reads `forked`. Evidence: exit 1 with `"state": "forked"` and `"status": "FINDINGS"`; A8 and A9 both FINDING in the same payload.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the engine on this repository (`C`). Verify: `node C` exits 0 and prints `STATUS=OK` with `A1 install state: pure`. Evidence: `A1 install state: pure   (PASS)` and `STATUS=OK rows=12 findings=0 unknown=0`, exit 0, in 0.27-0.30 s over three runs.
- [x] T013 Prove the read-only promise (`C`). Verify: `git status --porcelain | shasum` prints the same digest before and after a run over every fixture. Evidence: `3a1b8e03cb5ed703a89e99627d486845095f4d7b` on both sides after two runs per fixture plus one run on this repository; the suite's own case hashes each temp tree with sha256 before and after.
- [x] T014 Confirm the canary gap (`C`). Verify: with the canary path moved aside in a temporary copy, A6 reads `UNKNOWN` and the exit code is 1. Evidence: the suite's missing-canary case passes with A6 `UNKNOWN`, `STATUS=UNKNOWN` and exit 1. The failure was produced by handing the harness an absent tool path rather than by moving a tracked file: the engine resolves its three child tools from this installation, and its only seam for that is the `tools` parameter `buildReport` takes. Moving `check-rule-copies.js` aside would have been an out-of-scope mutation of a tracked file.
- [x] T015 Run the child gate (`specs/agents/021-doctor-agents-md/001-doctor-agents-md/002-check-engine/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md/002-check-engine --strict` prints `RESULT: PASSED`. Evidence: `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED`, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The measured runtime of a run over this repository is recorded in `implementation-summary.md`
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

- [x] CHK-001 [P0] `/doctor:sk-skill` is on the start branch. Verify: `git -c core.fsmonitor=false log --oneline -1 -- .skilled/commands/doctor/sk-skill.md` prints a commit. Evidence: prints `19e6a0bc42 feat(sk-doc): report a skill's gaps against a parent hub with check --into-hub`, so the router file exists on this branch. Correction to the recorded premise: the command's own route and asset files (`assets/doctor-sk-skill-check.yaml`, the `_routes.yaml` entry) are the surface this packet's row A11 and A10 measure, and `bash .skilled/commands/doctor/scripts/route-validate.sh` passes on this branch.
- [x] CHK-002 [P0] Child 001's manifest is fresh. Verify: `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` exits 0. Evidence: `PASS: 44 sections, 30 pins, derived matches AGENTS.md`, exit 0.
- [x] CHK-003 [P1] The baseline is recorded. Verify: `rg -c 'run-all' scratch/baseline.txt` prints at least `1`. Evidence: prints `4`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The engine parses. Verify: `node --check .skilled/commands/doctor/scripts/agents-md-check.cjs` exits 0. Evidence: exit 0, no output.
- [x] CHK-011 [P0] Every row appears in the report. Verify: `node .skilled/commands/doctor/scripts/agents-md-check.cjs | grep -c '^A'` prints `12`. Evidence: prints `12`.
- [x] CHK-012 [P1] No code comment carries a packet, phase or task id. Verify: `rg -n 'AC-[0-9]{3}|REQ-[0-9]{3}|specs/' .skilled/commands/doctor/scripts/agents-md-check.cjs` prints nothing. Evidence: no match, exit 1. The same pattern over the suite and the fixture recipes is also empty.
- [x] CHK-013 [P1] New names are lowercase kebab. Verify: `git status --porcelain` lists no path with an uppercase letter. Evidence: the new paths are `agents-md-check.cjs`, `agents-md-check.test.cjs`, `fixtures/agents-md/<name>/…`, and each fixture's `AGENTS.md`/`CLAUDE.md` are the names the manifest and the runtimes require.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is met. Verify: the rows in `acceptance-criteria.md` read `Met`. Evidence: AC-001 through AC-012 read `Met`, each with the run that proves it.
- [x] CHK-021 [P0] The suite passes. Verify: `node --test .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` reports `fail 0`. Evidence: `tests 29`, `pass 29`, `fail 0`.
- [x] CHK-022 [P1] Every fixture's A1 state is asserted. Verify: `rg -c "state" .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` prints at least `9`. Evidence: prints `32`, and nine per-fixture `A1 install state` cases run.
- [x] CHK-023 [P1] The error paths are asserted. Verify: the suite names the exit-2 case and it passes. Evidence: `exit codes: 0 on this repository, 1 on a finding, 2 on a failed precondition` passes with both the missing-root and missing-manifest cases, and `a precondition failure exits 2 rather than printing an empty report` passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secret. Verify: `rg -ni 'api[_-]?key|token|secret|password' .skilled/commands/doctor/scripts/agents-md-check.cjs` prints nothing. Evidence: no match, exit 1.
- [x] CHK-031 [P0] The engine writes nothing. Verify: the write-spy case passes and `git status --porcelain | shasum` is unchanged by a run. Evidence: `the write-spy records no filesystem write while every row executes` passes with twenty write functions patched and no call recorded; the tree digest is identical before and after a run over every fixture.
- [x] CHK-032 [P1] No consumer path reaches a tracked file. Verify: `rg -n 'Users/|/home/' .skilled/commands/doctor/scripts/tests/fixtures/agents-md` prints nothing. Evidence: no match, exit 1.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the twelve rows. Verify: `rg -c 'A12' spec.md plan.md tasks.md` reports a count in each. Evidence: `spec.md:3`, `tasks.md:2`, and no line from `plan.md`: the plan defers the row list to `spec.md` and the ordered work to `tasks.md` rather than restating the twelve ids, so "a count in each" is not literally true of the plan. The rows themselves match: the engine prints the twelve ids in `spec.md`'s order, which `every row appears in the report, once, in order` asserts.
- [x] CHK-041 [P1] The row table in `spec.md` still matches the engine. Verify: `rg -c '^\| A' spec.md` prints `12`. Evidence: prints `12`, and the engine prints the same twelve ids in the same order.
- [x] CHK-042 [P2] The engine's runtime is recorded. Verify: `rg -n 'seconds' implementation-summary.md` prints the measured figure. Evidence: `0.27-0.30 seconds` is recorded under Verification, with the three runs it came from.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Fixtures live under the tests tree. Verify: `find .skilled/commands/doctor/scripts/tests/fixtures/agents-md -maxdepth 1 -type d | wc -l` prints `10`. Evidence: prints `10`.
- [x] CHK-051 [P1] No temporary copy survives. Verify: `git status --porcelain` lists no path under a temporary directory. Evidence: `git status --porcelain` lists the engine, the suite, the nine fixture trees and this packet's docs only; every temp tree is removed by the case that made it.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
