---
title: "Tasks: Phase 4: alignment-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "alignment fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 4: alignment-fixes

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

`RUN` is `~/.local/state/local-skilled-alignment/315-frontend-reference-restructure/20261105T151115Z`. `RC` is the recheck folder `20261105T165214Z-recheck` beside it. `G` is `.skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `RUN/report.md`, `RUN/fix-plan.md` and `RUN/critic.json`, and list each finding the critic upheld. Verify: every listed finding has a file. Evidence: X-01, X-02, A-1, A-2, B-01, B-02, B-03, C-01 to C-06, C-10, C12, D-02 to D-07, D-09 and probes P02, P04, P13, P14.
- [x] T002 Scaffold this phase under the 014 parent. Verify: `ls 004-alignment-fixes` lists the six Level 2 docs. Evidence: `create.sh --phase` output, parent phase map row 4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Open the routing-shape and integrate fixture routers with an intro and OVERVIEW (X-01). Verify: both suites pass. Evidence: doctor run-all 7 passed.
- [x] T004 Build the converted description from section names, and point the convert test at a fixture ledger (X-02). Verify: `node --test sk-skill-convert.test.cjs` prints 69 pass, 0 fail. Evidence: commit 5263598754.
- [x] T005 Move the compiled-routing callout into MACHINE ROUTER in the sk-doc and mcp-tooling routers (B-01). Verify: `validate_skill_package.py` prints compiled-ready PASS for both. Evidence: commits 810a75b3aa, 55e59e9a32.
- [x] T006 Resolve the cited file in `G` and skip a citation renumbered with its section (A-1, D-03, D-05). Verify: the four new guard tests pass and fail on the old guard. Evidence: 28 guard tests pass.
- [x] T007 Read code-span and link citations in `validate_document.py` (B-03). Verify: `test_citation_through_a_link_or_code_span_is_resolved` passes. Evidence: 34 render tests pass.
- [x] T008 Add the render-ledger routing vocabulary to the sk-doc and sk-create-skill routers and `hub-router.json`, and rebuild the advisor (D-04, probes). Verify: `ci-router-vocabulary-reach.cjs --hub sk-doc` prints `outranked=0`. Evidence: advisor generation 622, reach outranked=0.
- [x] T009 [P] Fix the stale text in the cli-orca, cli-jev, sk-create-agent, human-voice scripts and style-reference READMEs, eleven sk-code-skilled scenarios, `javascript-checklist.md`, `validation-and-packaging.md`, `render-known-debt.json`, `v4.0.1.0.md` and the root README (A-2, B-02, C-01 to C-06, C-10, C12, D-02, D-06, D-07, D-09). Verify: the recheck reports C-01, C-02 and D-07 resolved. Evidence: `RC/recheck.md`.
- [x] T010 Write a changelog and hub bump per skill and commit each skill on its own. Verify: `git log --oneline 0e88ba257b..HEAD` lists one commit per skill. Evidence: 810a75b3aa, 55e59e9a32, 82a3f29456, 0031bd58d2, 561f65edae, 57000eae12, then 9dc28d279a (Hermes routers), 5263598754 (doctor) and eb91879758 (root docs).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the sk-doc suites, the leaf loop, the strict sweep, package validation of 13 skills, doctor run-all and README parity. Verify: each prints its pass line. Evidence: pytest 407 passed, node 108/0, compiled-route 101/0, leaf_fails=0, sweep 55 PASS 0 error, 13 skills 0 FAIL, doctor 7 passed, `PARITY PASS: verdict diff is empty`.
- [x] T012 Run the recheck and the probe replay. Verify: the recheck prints `new=0` and the probes print `fail=0`. Evidence: `resolved=8 still_open=6 new=0 needs_review=20`; probes `pass=18 fail=0`.
- [x] T013 Review each still-open row and each needs-review finding by hand. Verify: each is fixed in the tree or recorded as an artifact. Evidence: S14 replays print `0 error rules` with the symlink flags; S9 cites a database `.gitignore:146` ignores; every needs-review fix confirmed by grep (see `implementation-summary.md`).
- [x] T014 Run `G --base 0e88ba257b` over the phase's changed docs. Verify: every HARD finding is an intended change. Evidence: 4 HARD, all the edited router-map fences of D-04; 24 advisories, each a replaced line.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `RC/recheck.md` reports `new=0`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
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

A finding not fixed carries its reason in `spec.md` Out of Scope.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: run `20261105T151115Z` holds `report.md` and `critic.json`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/` prints 407 passed
- [x] CHK-011 [P0] `node --test .skilled/bin/tests/compiled-route-*.test.cjs` prints fail 0
- [x] CHK-012 [P1] A citation left on a renumbered section stays a HARD finding (`test_citation_left_on_a_renumbered_section_is_still_hard`)
- [x] CHK-013 [P1] New comments state the reason only, with no ticket or phase id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Recheck and probe replay run
- [x] CHK-022 [P1] Edge cases tested: a reference with no sections, and a sectioned one, in `sk-skill-convert.test.cjs`
- [x] CHK-023 [P1] Error scenarios validated: the four new guard tests fail on the old guard
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: X-01, X-02, B-01 `cross-consumer`; A-1, D-03, D-05, B-03 `algorithmic`; the doc findings `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producers checked: the callout placement in every hub router, by package validation of 13 skills.
- [x] CHK-FIX-003 [P0] Consumers checked: the strict sweep, README verdict parity and the Hermes mirrors.
- [x] CHK-FIX-004 [P0] Path resolution in the guard is tested for a same-named file in another skill, a path citation and a renumbered section.
- [x] CHK-FIX-005 [P1] Matrix: 13 skills for package validation, 55 SKILL.md files in the sweep, 18 probes.
- [x] CHK-FIX-006 [P1] The convert test sets `RENDER_DEBT_FILE` and `RENDER_SKILLS_ROOT` to its fixture, so the live ledger does not leak in.
- [x] CHK-FIX-007 [P1] Evidence pinned to `0e88ba257b..eb91879758`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any changed file
- [x] CHK-031 [P0] N/A: the guard reads repository files only and takes no outside input
- [x] CHK-032 [P1] N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same findings and commits
- [x] CHK-041 [P1] The guard, validator and transform comments state why
- [x] CHK-042 [P2] The sk-doc README and root README gained a render-checks bullet
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only
- [x] CHK-051 [P1] `scratch/` holds no file
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-05
<!-- /ANCHOR:summary -->

---
