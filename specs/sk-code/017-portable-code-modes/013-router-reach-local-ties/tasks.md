---
title: "Tasks: Router reach check scores the shipped fleet and notes operator-local ties"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "router reach local ties tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Router reach check scores the shipped fleet and notes operator-local ties

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

`R` is `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`. `T` is `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs`. `MAIN` is the main checkout `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, which links private surfaces; `WT` is this worktree, which links none.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the failure from `MAIN`. Verify: `node R --hub mcp-tooling` in `MAIN` printed `outranked  browser agent` with the private surface at 0.8200 ahead of `mcp-tooling=0.8200`, `RESULT: FAILED`, exit 1, at generation 1779; the whole-fleet run printed `outranked  css extraction` with the private surface at 0.8357 ahead of `sk-design=0.8248`.
- [x] T002 Attribute the tie. Verify: `advisor_recommend` with `includeAttribution` in `MAIN` gave the private surface explicit_author raw 1.0 from 2 evidence items against the shipped hub's 0.88 from 1; both phrases are already in the hubs' `graph-metadata.json` `intent_signals`.
- [x] T003 Check what an operator sees. Verify: in `MAIN`, "use the browser agent" ranks `mcp-tooling` first and "extract the css from this site" ranks `sk-design` first at 0.9036; in `WT`, both bare phrases rank the shipped hub first at the same scores as in `MAIN`.
- [x] T004 Record the a versus b decision (`decision-record.md`). Verify: ADR-001 is Accepted with the alternatives table and the scorer follow-up.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Rank the shipped fleet and add the `operator-local` note kind (`R`). Verify: `node --check R` exits 0.
- [x] T006 Add the stand-in advisor test (`T`). Verify: with `R` replaced by its `HEAD` copy, `node T` printed `a private tie must not fail the run`, `outranked= 75`, exit 1; with the changed `R`, `node T` printed `router reach shipped-fleet ranking passed`, exit 0.
- [x] T007 [P] Describe the new row kind (`doctor-router-reach.yaml`, the router-reach playbook scenario, the tests README). Verify: the YAML parses with PyYAML and `validate_document.py --json` prints `"total_issues": 0` for both markdown files.
- [x] T008 [P] Write the changelog entries, step the carriers and resync Hermes. Verify: `validate_document.py --json` prints `"total_issues": 0` for `v1.5.11.0.md` and `v0.17.13.0.md`, `hvr_scan.py` reports 0 hard blockers, and `sync-skills-hermes.cjs` prints `Wrote 2 of 67 Hermes skill copies`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the check from `MAIN` with the changed script. Verify: `ROUTER_REACH_ADVISOR=MAIN/.skilled/bin/skill-advisor.cjs node WT/R` in `MAIN` printed `outranked=0`, `operator-local=2`, `probe-error=0`, `RESULT: PASSED`, exit 0, at generation 1779.
- [x] T010 Rerun the check in `WT`, the CI-equivalent fleet. Verify: `node R` printed `wrong-hub=0, outranked=0`, `probe-error=0`, `operator-local=0`, `RESULT: PASSED`, exit 0.
- [x] T011 Run the doctor phrase probe. Verify: `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` printed `STATUS=OK phrases=118 bridges=22`, exit 0, in both `MAIN` and `WT`.
- [x] T012 Run the advisor suites. Verify: `npx vitest run` in the advisor runtime printed `Test Files 153 passed (153)`, `Tests 1301 passed | 8 skipped (1309)`, exit 0, before and after the change; `test_skill_advisor.py` printed `pass=87, fail=0`, exit 0.
- [x] T013 Run every sk-create-skill script test and the freshness checks. Verify: all 19 `*.test.cjs` files exit 0; `ci-leaf-manifest-freshness.cjs` printed `fresh=14 failed=0`, `ci-skill-derived-freshness.cjs` printed `fresh=14 stale=0`, `parent-skill-check.cjs .skilled/skills/sk-doc` printed `all hard invariants passed`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The check passes from `MAIN` and from `WT`, and the new test fails before and passes after
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision**: See `decision-record.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-006 in `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: the `MAIN` advisor answered live at generation 1779 and `ROUTER_REACH_ADVISOR` is read by `R`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `quality-gate.cjs --files R T` prints `"gate": "NO_BLOCKER_FOUND"`, `"exit_code": 0`, every summary count 0.
- [x] CHK-011 [P0] `check-comment-hygiene.sh R T` exits 0.
- [x] CHK-012 [P1] Error handling: a probe error still fails the run before any shipped-fleet ranking, unchanged.
- [x] CHK-013 [P1] Code follows the file's existing comment style and keeps its flat structure.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] The new test fails before and passes after. Evidence: T006.
- [x] CHK-022 [P1] Edge cases: a shipped winner behind a private surface still fails, and a private surface behind the hub adds no note. Evidence: `testPrivateSurfaceCannotMaskAShippedWinner` and `testPrivateSurfaceBehindIsSilent` in `T`.
- [x] CHK-023 [P1] Error scenarios: the first `WT` run of the changed script met an advisor that was regenerating and printed `probe-error=38` and `RESULT: FAILED`, exit 1, so a degraded advisor still fails the run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer`. The gate read untracked content that only one machine has.
- [x] CHK-FIX-002 [P0] Same-class producers: `doctor-phrase-reach.cjs` is the other live-advisor reach gate; it scores doctor bridges only and passed in `MAIN` with private links present (T011).
- [x] CHK-FIX-003 [P0] Consumers: the doctor router-reach workflow and its playbook scenario, both updated; `rg -n "probe-error=|outranked="` outside `R` finds no parser of the output.
- [x] CHK-FIX-004 [P0] N/A: no path, parser or redaction logic; the private id is never printed, proven by `T`.
- [x] CHK-FIX-005 [P1] Matrix: private surface ahead with the hub leading the shipped list, ahead of a shipped rival, behind the hub, text and `--json`, four cases in `T`, plus the two live advisors.
- [x] CHK-FIX-006 [P1] `T` deletes `CI` from the child environment, because `R` refuses sampling under CI.
- [x] CHK-FIX-007 [P1] Evidence is against base `b7b806a359` plus the uncommitted diff in worktree `244-router-reach-private-ties`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; the quality gate ran clean.
- [x] CHK-031 [P0] No private surface name in any tracked file or output line. Evidence: `T` asserts the id is absent from stdout and stderr.
- [x] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and the ADR name the same files and the same row kind.
- [x] CHK-041 [P1] Code comments state why the check judges the shipped fleet and why the note carries no name.
- [x] CHK-042 [P2] The tests README lists the new test.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files lived in the session scratchpad and in `os.tmpdir()` folders the test removes.
- [x] CHK-051 [P1] `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---
