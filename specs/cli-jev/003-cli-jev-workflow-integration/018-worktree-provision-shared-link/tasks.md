---
title: "Tasks: Phase 18: worktree-provision-shared-link"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "worktree provision spec-kit link tasks"
  - "wn deps satisfied fix tasks"
  - "sk-doc link repair tasks"
  - "worktree naming harness fixture tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 18: worktree-provision-shared-link

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

- [ ] T001 Read `sk-git` SKILL.md rule 8 and `scripts/tests/README.md`, and `sk-code`'s OpenCode shell style guide and checklist (`.skilled/skills/sk-git/SKILL.md`)
- [ ] T002 Rerun `git log -5` and `git status --short` on the three `sk-git` script paths and record any change newer than `b946bc9e95` (`.skilled/skills/sk-git/scripts/`)
- [ ] T003 Run the harness and record the baseline summary line (`.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`)
- [ ] T004 [P] Run the read-only per-package survey from AC-002 and record that every package reads satisfied (`.skilled/skills/sk-git/scripts/worktree-provision-paths.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Change the name choice in `_wn_deps_satisfied` to fall back to the first declared dependency when none is outside `@spec-kit/` (`.skilled/skills/sk-git/scripts/worktree-naming.sh`)
- [ ] T006 Add one sentence to the comment block above `_wn_deps_satisfied` stating the rule for `@spec-kit/*` entries, with no spec path or id (`.skilled/skills/sk-git/scripts/worktree-naming.sh`)
- [ ] T007 Add fixtures `spec-kit-only` and `spec-kit-and-real` to the fixture tree and path list, and make the stub `npm` also create `node_modules/@spec-kit/shared` (`.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`)
- [ ] T008 Add three assertions: `spec-kit-only` logs one install line after both runs, `spec-kit-and-real` logs one install line although its link was present, and `needs-build` logs no install line (`.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run `bash -n` and `shellcheck` on both changed files
- [ ] T010 Run the harness and confirm `FAIL=0` with three more passes than T003
- [ ] T011 Revert only T005 and confirm the `spec-kit-only` case fails, then restore it
- [ ] T012 Rerun the survey and confirm only `.skilled/skills/sk-doc` reads unsatisfied
- [ ] T013 Confirm `git status --porcelain -- .skilled` lists only the two changed files
- [ ] T014 [B] Ask the operator for the repair install, naming the rollback `rm -rf .skilled/skills/sk-doc/node_modules`. Blocked until the yes
- [ ] T015 [B] After the yes, check `shared/dist/frontmatter/parse-frontmatter.js` exists, run `provision` (or `npm ci` in `sk-doc` if the survey names more than `sk-doc`), then check the link's real path and run `parent-skill-check.cjs .skilled/skills/sk-doc`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
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
| P0 Items | 13 | 0/13 |
| P1 Items | 14 | 0/14 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-27
<!-- /ANCHOR:summary -->

---



