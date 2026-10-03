---
title: "Tasks: Doctor scripts conformance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doctor scripts tasks"
  - "doctor scripts verification"
  - "doctor test runner tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Doctor scripts conformance

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

- [x] T001 Run the objective checks over `.skilled/commands/doctor/scripts/` (`verify_alignment_drift.py` with every opt-in check, shellcheck, `node --check`, `bash -n`, `py_compile`, tsc unused-locals) Evidence: 15 drift findings (13 errors, 2 warnings); shellcheck 3 unused variables plus notes; tsc 4 unused locals; every syntax check clean.
- [x] T002 [P] Map every caller and test of each script with `git grep` Evidence: every script has at least one caller; tests exist for `parent-skill-check`, `release-update`, `skill-graph-freshness` and the route contract; no CI step or npm script runs `scripts/tests/`.
- [x] T003 [P] Run four read-only reviews against the sk-code OpenCode checklists, one per file group (`release-update.cjs`; `parent-skill-check.cjs`; the four small checks; the shell and Python scripts) Evidence: no P0; the P1 findings are listed in `spec.md` section 2 and reproduced by the reviewers in scratch fixtures; the parent session re-read the bootstrap migration order, the `flock` branch and the catalog substring match before dispatch.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Fix `parent-skill-check.cjs`: characterisation tests over every invariant, then the verified findings, then split `main()` into per-invariant functions (`parent-skill-check.cjs`, `tests/parent-skill-check-*.test.cjs`) Evidence: 91-case invariants suite plus the three older suites pass; every hub keeps its exit code; 3k now compares 21 commands.
- [x] T005 [P] Fix `release-update.cjs`: the changelog crash, worktree reads in `align`, repeat apply, unit key collision, error context, prerelease ordering, dead options and fields, apply safety (`release-update.cjs`, `tests/release-update.test.cjs`) Evidence: suite 22 to 56 tests, all pass; each regression test observed failing first; units keyed `kind:name` with name-only records still readable.
- [x] T006 [P] Fix the four small checks: exact catalog matching, two-way group table, crash exit codes, roster `--root`, fable-mode honest status, freshness MISSING and degraded handling (`command-catalog-mirror-check.cjs`, `agent-roster-mirror-check.cjs`, `fable-mode-check.cjs`, `skill-graph-freshness.cjs`, their tests) Evidence: 33 node tests and 11 vitest cases pass; all four checks exit 0 on the real tree.
- [x] T007 [P] Fix the shell and Python scripts: guard coverage and `command -v` exclusion, bootstrap migration order and lock, remove `mcp-doctor.sh --fix`, exit codes, route-validate argument handling and self-test rule ids, audit constants from the contract (`*.sh`, `*.py`, `mcp-mutation-class-manifest.yaml`, their tests) Evidence: 110 new tests across four bash suites and one unittest suite pass; guard covers 21 scripts; real-tree verdicts unchanged.
- [x] T008 Add one runner for every doctor test and call it from CI (`tests/run-all.sh`, `.github/workflows/spec-kit-check.yml`) Evidence: `run-all.sh` exit 0 under bash 3.2 with 8 suites; `doctor-scripts` job added; Pi mirror checks added to the mirrors job.
- [x] T009 Update the shared docs the fixes make untrue (`.skilled/commands/doctor/_routes.yaml`, `scripts/README.md`, `tests/README.md`) Evidence: scripts README and new tests README validate with 0 issues; `_routes.yaml` needed no change; install workflow comment corrected.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Rerun every worker's regression tests and the full runner from the final state Evidence: runner exit 0 from the final state; old-code swap fails 7 and 19 tests, then all pass.
- [x] T011 Rerun the objective checks from T001 and confirm zero findings Evidence: verifier 28 files 0 findings; shellcheck exit 0; tsc 0 unused names; syntax checks clean.
- [x] T012 Run every doctor gate on the real tree and compare exit codes with the baseline Evidence: before-and-after table in `implementation-summary.md`; every gate keeps its exit code.
- [x] T013 Run the pre-commit hook suite and the vitest suites that read doctor sources Evidence: pre-commit 69 passed 0 failed; advisor vitest 23 of 23.
- [x] T014 Validate this packet with `validate.sh --strict` Evidence: `validate.sh specs/system-speckit/049-doctor-audit-followups --strict --recursive` printed `RESULT: PASSED` for all 5 folders.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T001 to T014)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (real-tree gate table in `implementation-summary.md`)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (`spec.md` sections 2 to 4)
- [x] CHK-002 [P0] Technical approach defined in plan.md (`plan.md`)
- [x] CHK-003 [P1] Dependencies identified and available (`plan.md` section 6)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (verifier 0 findings, shellcheck exit 0)
- [x] CHK-011 [P0] No console errors or warnings (runner and gates exit 0; `mcp-doctor.sh` exit 1 is the documented credential warning)
- [x] CHK-012 [P1] Error handling implemented (every crash path exits with the checker-error code and a status line)
- [x] CHK-013 [P1] Code follows project patterns (OpenCode headers and numbered sections in every script)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (`acceptance-criteria.md`)
- [x] CHK-021 [P0] Manual testing complete (real-tree gate runs)
- [x] CHK-022 [P1] Edge cases tested (prefix ids, `null` JSON, broken symlinks, bash 3.2 empty arrays)
- [x] CHK-023 [P1] Error scenarios validated (malformed-input tests per script)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. (class-of-bug for the exit-code and substring families, instance-only for the rest)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (same-class search across all twelve scripts by the four reviews)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. (callers listed with `git grep` before dispatch; workflow YAML updated where codes changed)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. (plan-path confinement, outside-root and tampered-plan tests in `release-update.test.cjs`)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (per-subcommand coverage table from the review, closed in the suite)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. (env overrides tested; credential sentinel never appears in output)
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. (evidence pinned to the commit that lands this phase)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (credential tests use sentinels only)
- [x] CHK-031 [P0] Input validation implemented (argument and manifest validation in every script)
- [x] CHK-032 [P1] Auth/authz working correctly (no auth surface: not applicable)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (no ephemeral ids in code comments, checked by grep)
- [x] CHK-042 [P2] README updated (if applicable) (scripts README and tests README)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (worker scratch under the session scratchpad, removed)
- [x] CHK-051 [P1] scratch/ cleaned before completion (no scratch files left in the packet)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 15 | 15/15 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-03
<!-- /ANCHOR:summary -->

---



