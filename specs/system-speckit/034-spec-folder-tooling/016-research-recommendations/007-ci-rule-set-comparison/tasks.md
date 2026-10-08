---
title: "Tasks: Phase 7: ci-rule-set-comparison"
description: "The task list for Phase 7: ci-rule-set-comparison, each task naming its file. All ten tasks are done. The verification tasks ran as local tests against the workflows' own run blocks, not as runs on GitHub."
trigger_phrases:
  - "ci rule set comparison tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: ci-rule-set-comparison

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
## Phase 1: Implementation

- [x] T001 [P0] Extract rule names from the changed-packet validator output at base and head (`.github/workflows/changed-packet-validation.yml` lines 131-147). Done: `failing_rules()` (`changed-packet-validation.yml:98-114`) reads the validator's `--json` report and prints the sorted, unique rule names whose entry status is `error`. The head run feeds it at `:121-127` and the base run at `:167-169`. Warnings are not counted, because a strict run fails only on `error` entries. The real report shape (`entries[].rule`, `entries[].status`) was confirmed with `validate.sh --strict --no-recursive --json` on a throwaway packet
- [x] T002 [P0] Compare rule sets instead of verdicts to detect regressions (lines 131-147) (`.github/workflows/changed-packet-validation.yml`). Done: `comm -23` prints the head rules the base did not fail (`:176-178`). A non-empty result is a regression that names those rules (`:179-183`); an empty one prints `pre-existing` with the failing rules (`:184-187`)
- [x] T003 [P0] Add logic to detect when rule sets differ, even if both pass or both fail (lines 131-147) (`.github/workflows/changed-packet-validation.yml`). Done differently from the wording: two passing sides have empty sets, so nothing differs and the packet never enters the comparison (`:131`). For two failing sides the gate flags the head rules that are absent from the base, so a base of `rule-alpha, rule-shared` and a head of `rule-beta, rule-gamma, rule-shared` names `rule-beta,rule-gamma`. A head set that is a subset of the base set prints nothing from `comm -23` and is not flagged; no test pins that case
- [x] T004 [P0] Pass the previous sweep artifact as `--baseline` to the weekly sweep (line 56) (`.github/workflows/strict-pass-freshness-report.yml`). Done: a new step, `Fetch the previous baseline report` (`:53-103`), finds the last successful run of this workflow on the same branch with `gh run list`, downloads its report with `gh run download` and exports `BASELINE_REPORT` through `$GITHUB_ENV`. The sweep step builds `--baseline "$BASELINE_REPORT"` (`:111-117`) and passes it to the sweep (`:125`). The job gains `actions: read` (`:19`). The sweep script and the upload step are unchanged
- [x] T005 [P0] Handle the case when no previous artifact exists (first run) (`.github/workflows/strict-pass-freshness-report.yml`). Done: three paths print `::notice::No baseline report found; this run records the baseline`, exit 0 and set no `BASELINE_REPORT`: no successful previous run (`:73-76`), a failed download (`:80-85`), and a missing or unparseable report (`:90-98`). The sweep then runs without `--baseline`
- [x] T006 [P1] Update the gate documentation with examples (`.github/workflows/README.md`). Done differently from the wording: the README describes each workflow in one table row, so the comparison and the baseline are described in four rows (`README.md:28`, `:49`, `:62`, `:64`) and no worked example was added. Confirmed against `git diff` on the README
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Verification

- [x] T007 [P0] Create a test PR with a packet that fails different rules at base and head, verify it is reported as a regression. Done locally, not as a PR on GitHub: the test `names only the head rules that the base was not already failing` runs the gate's own run block against a fixture repo with a base commit and a head commit and stub validator reports (base `rule-alpha, rule-shared`, head `rule-beta, rule-gamma, rule-shared`). The gate named `rule-beta,rule-gamma` as the new rules and exited 1. `reports a regression when a packet passes at the base and fails at the head` covers pass-to-fail
- [x] T008 [P0] Run the weekly sweep with a baseline and verify it compares with the previous artifact. Done locally with the real sweep script and a baseline file, not against GitHub: a folder that passed in the baseline and fails now reported `regression` (exit 1), and a folder that failed in the baseline and still fails reported `known-failure` (exit 0). The download of the previous artifact ran against a stub `gh`
- [x] T009 [P0] Verify the first run of the weekly sweep handles missing baseline gracefully. Done locally: the fetch step exits 0 with the notice and no `BASELINE_REPORT` when the stub `gh` finds no run, and when the downloaded report does not parse. The real sweep script without `--baseline` reports the failing folder as `first-run` and exits 0. The sweep step's empty `baseline_args` expansion was not run on a bash that supports it, see implementation-summary.md
- [x] T010 [P1] Verify the extraction and comparison logic with multiple failure scenarios. Done: 11 tests (5 gate, 3 sweep, 3 baseline fetch) pass; each scenario and its observed outcome is in implementation-summary.md. Against the pre-change workflow the 5 gate tests failed (build note, not rerun at close)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 tasks marked `[x]`
- [x] All Phase 2 verification tasks marked `[x]`
- [x] Acceptance criteria in `acceptance-criteria.md` show all rows passing
<!-- /ANCHOR:completion -->

---
