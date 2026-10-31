---
title: "Tasks: Add a quiet flag to recommend-level.sh"
description: "Task Format: T### [P?] Description (file path). Capture the pre-change output first, add the flag and its dispatch branch, then prove nothing else moved."
trigger_phrases:
  - "recommend level quiet flag tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Add a quiet flag to recommend-level.sh

<!-- SPECKIT_LEVEL: 3 -->

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

- [ ] T001 Capture stdout, stderr and the exit code of every default-mode invocation in the matrix into `scratch/baseline/`, before touching the script (`recommend-level.sh`)
- [ ] T002 [P] Write the five cases: one line per level band, default output unchanged, `--quiet` with `--json` refused in both orders, error path under `--quiet`, and `--quiet` named in `--help` (`runtime/cli/tests/recommend-level-quiet.vitest.ts`)
- [ ] T003 [P] Run the new file against the current script and record that every case fails for the intended reason (`runtime/cli/tests/recommend-level-quiet.vitest.ts`)
- [ ] T004 [P] Run the existing `runtime/cli` suite and record the pre-change pass count as the baseline (`runtime/cli`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add `QUIET=false` beside `JSON_OUTPUT=false` in the globals block (`recommend-level.sh:116-142`)
- [ ] T006 Add the `--quiet` case arm, one assignment and a `shift`, matching the `--auth` arm (`recommend-level.sh:656-719`)
- [ ] T007 Add the conflict check for `--quiet` with `--json` beside the numeric validations, reporting on stderr and exiting 1 (`recommend-level.sh:722-742`)
- [ ] T008 Add `output_quiet`, printing the same `Recommended Level:` string as `output_text` with no leading blank line (`recommend-level.sh:508-558`)
- [ ] T009 Make `QUIET` the first branch of the output dispatch, ahead of `JSON_OUTPUT` (`recommend-level.sh:770-774`)
- [ ] T010 Name `--quiet` in the header OPTIONS comment and in `show_help()`, with one example line in each (`recommend-level.sh:16-27`, `:171-182`)
- [ ] T011 Run `bash -n` on the script and confirm the five cases from T002 now pass (`recommend-level.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Rerun T001's matrix without `--quiet` and diff against `scratch/baseline/`; the diff must be empty for every invocation (`scratch/baseline/`)
- [ ] T013 Run `--quiet` for one input per level band and confirm each line matches the `Recommended Level:` line its default-mode run prints (`recommend-level.sh`)
- [ ] T014 Run the error axis under `--quiet`: no inputs, a non-numeric `--loc`, `--quiet --json` and `--json --quiet`; each exits 1, writes only to stderr and leaves stdout empty (`recommend-level.sh`)
- [ ] T015 Run the full `runtime/cli` suite from the final state and account for the delta against T004 (`runtime/cli`)
- [ ] T016 Run `validate.sh --strict` on this folder and record the result, the matrix diff and the suite delta in `implementation-summary.md` (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every acceptance row Met
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Target script**: `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `bash -n recommend-level.sh` reports no syntax error
- [ ] CHK-011 [P0] A `--quiet` run writes exactly one line to stdout and nothing to stderr
- [ ] CHK-012 [P1] The conflict error is raised before scoring, so a refused run prints nothing on stdout
- [ ] CHK-013 [P1] The new arm and branch follow the file's existing shape: a `case` arm, a boolean global, an `if` in the dispatch
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Each new case failed against the pre-change script before the edit
- [ ] CHK-022 [P1] Edge cases tested: repeated flag, `--quiet` with `--no-recommend-phases`, `--quiet` with `--help`
- [ ] CHK-023 [P1] Error scenarios validated: no inputs, non-numeric `--loc`, conflicting output modes in both orders
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed: `JSON_OUTPUT` is the only existing output-mode global, and `QUIET` follows its shape.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the output: both YAML callers use `--json`, and no consumer parses the text output.
- [ ] CHK-FIX-004 [P0] The argument parser has adversarial cases: repeated flag, flag before and after `--json`, flag with `--help`, flag with no inputs.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed: the script is run from a different working directory and through a relative path.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] The flag adds no input path: it takes no value and reads no file
- [ ] CHK-032 [P1] No auth or authorization surface is touched by this script
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] `--quiet` is named in both the header comment and `show_help()`
- [ ] CHK-042 [P2] The skill README and `assets/level-decision-matrix.md` name the flag, if either is the place a reader looks first
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 23 | 0/23 |
| P2 Items | 9 | 0/9 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented: ADR-001 and ADR-002 in `plan.md`
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented: none needed, the flag is opt-in
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] `--quiet` prints one line instead of more than a dozen, so it is not slower than the default (NFR-P01)
- [ ] CHK-111 [P1] No scoring function is called more often in quiet mode than in default mode
- [ ] CHK-112 [P2] Load testing: not applicable, the script is a single process that exits in under 100 ms
- [ ] CHK-113 [P2] Performance benchmarks documented: not applicable for a one-shot CLI
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested: revert the commit, rerun the matrix
- [ ] CHK-121 [P0] Feature flag: not applicable, the option is opt-in and the default path is unchanged
- [ ] CHK-122 [P1] Monitoring: not applicable, the script reports to the terminal it was run from
- [ ] CHK-123 [P1] Runbook: the plan's rollback section is the runbook for a script with no state
- [ ] CHK-124 [P2] Deployment runbook reviewed
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed: the flag reads nothing and writes nothing
- [ ] CHK-131 [P1] Dependency licenses compatible: no dependency is added
- [ ] CHK-132 [P2] OWASP Top 10 checklist: not applicable, no network, storage or auth surface
- [ ] CHK-133 [P2] Data handling compliant with requirements: no data is handled
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] CLI documentation complete: `--help` names the flag and shows one example
- [ ] CHK-142 [P2] User-facing documentation updated: the header comment and `--help` are the user-facing surface
- [ ] CHK-143 [P2] Knowledge transfer documented in `implementation-summary.md`
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Packet owner | Technical Lead | [ ] Approved | |
| Packet owner | Product Owner | [ ] Approved | |
| Packet owner | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

