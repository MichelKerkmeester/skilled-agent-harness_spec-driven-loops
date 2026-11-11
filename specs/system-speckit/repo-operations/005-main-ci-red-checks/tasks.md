---
title: "Tasks: Repair the five checks that fail on main"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "main ci red checks tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Repair the five checks that fail on main

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create worktree 346 through sk-git (`worktrees/346-main-ci-red-checks`). Verify: `git worktree list` lists it.
- [x] T002 Read the five failed job logs for `5966aca389`. Verify: `gh run list --branch main` names the five failed workflows.
- [x] T003 [P] Reproduce each failure locally where the machine allows it. Verify: Node v22.23.4 prints `Cannot find module` for the directory form.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Pass the corpus test files as a glob (`.github/workflows/chart-corpus.yml`, `.github/workflows/diagram-corpus.yml`, three sk-design READMEs). Commit `6bb42a9f5a`.
- [x] T005 Refresh the two sk-doc README baselines with each test's `--write` mode (`.skilled/skills/sk-doc/scripts/tests/code-folder/`). Commit `c807a36cab`.
- [x] T006 Add "opencode go route" to the harness intent and regenerate the intent signals and compiled graph (`.skilled/skills/cli-external-orchestration/ROUTER.md`). Commit `f090583b7d`.
- [x] T007a Show the glob command in the three `sk-create-goal` READMEs (`.skilled/skills/sk-doc/sk-create-goal/scripts/`). Commit `1ffd2213e9`.
- [x] T007b Replace three bare `(( ))` counters in the staleness checker (`.skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh`). Commit `f15ba37e94`.
- [x] T007 Fix the binding count, the lock copy race and the array length expansion (`.skilled/skills/system-spec-kit/runtime/cli/`). Commit `72a2a0b3f4`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun each command that failed. Verify: the corpus suites pass 88 and 21 tests on Node 22, `run-script-tests.sh` prints `all sk-doc script tests passed`, the vocabulary guard prints `drift=0`, the three Spec-Kit files pass 18 tests.
- [x] T009 Rerun the rest of each workflow. Verify: every routing workflow step exits 0 and the scorer gates pass 53 tests.
- [ ] T010 [B] Confirm on CI after the push to main. Verify: `gh run list --branch main` shows no failed workflow on the new head. Blocked on the operator's push approval.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `bash -n spec/check-template-staleness.sh` exits 0 and the commit hooks passed on all four commits.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the three Spec-Kit test files print `Tests 18 passed (18)`.
- [x] CHK-012 [P1] Error handling implemented. N/A: no new control flow.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the copy filter matches `tests/helpers/upgrade-legacy-harness.ts:210`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met. AC-005 waits on the push to main.
- [x] CHK-021 [P0] Manual testing complete. Evidence: `compiled-route.cjs --hub cli-external-orchestration --prompt "run this review over the opencode go route"` routes to `cli-deepseek-harness`.
- [x] CHK-022 [P1] Edge cases tested. Evidence: "use cli-opencode with the opencode-go deepseek model" still routes to `cli-opencode`.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: the directory form still fails on Node 22, which is the failure the glob replaces.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. The Node 22 command is `class-of-bug`, the two baselines are `matrix/evidence`, the routing phrase is `cross-consumer`, the binding count is `instance-only`, the lock race is `test-isolation`, the array expansion is `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. `rg` found two workflows and six READMEs with the directory form, one other `cpSync` of the skill root that already filters the lock, and no other length expansion with a default.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. The phrase reaches the vocabulary guard, the intent signals, the compiled graph and the compiled route manifest, and each was regenerated and checked.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`: Node 22 and 26, Bash 3.2 and 5.
- [x] CHK-FIX-006 [P1] N/A: no test or code here reads process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to commits `6bb42a9f5a`, `c807a36cab`, `f090583b7d` and `72a2a0b3f4`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented. N/A: no new input.
- [x] CHK-032 [P1] Auth/authz working correctly. N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable). Evidence: three sk-design READMEs show the glob command.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-11
<!-- /ANCHOR:summary -->

---



