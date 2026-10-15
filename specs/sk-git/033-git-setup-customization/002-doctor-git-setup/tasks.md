---
title: "Tasks: Phase 2: doctor-git-setup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "doctor git setup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: doctor-git-setup

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

- [ ] T001 Write the test skeleton with a temporary `git init` fixture, `GIT_CONFIG_GLOBAL` and `GIT_CONFIG_NOSYSTEM=1` isolation and a before-and-after tree and config snapshot helper (`.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs`)
- [ ] T002 Confirm each read-only entry point's output on this checkout: `install-git-hooks.sh --status`, `git-hook-gates.cjs list --json`, `resolveContractDir` and `loadContract`, `cip_repo_wants_ids`, `worktree-naming.sh next` and `GIT_CHECKS` (scratch notes only)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Write the battery skeleton: own-root resolution, argv-only spawning, the result row shape, human output, `--json`, exit 0, 1 or 2 and the `STATUS=` line (`.skilled/commands/doctor/scripts/git-setup-check.cjs`)
- [ ] T004 Add the install, hooks, trust and gates checks (`git-setup-check.cjs`)
- [ ] T005 Add the standards check with absent, enforced and malformed states per kind (`git-setup-check.cjs`)
- [ ] T006 Add the allowlist, worktrees and Commit-Id checks, calling only `next`, `validate-*` and the policy reader (`git-setup-check.cjs`)
- [ ] T007 Add the advisory rules, suppression and active AI tool hook checks (`git-setup-check.cjs`)
- [ ] T008 Fill the tests: one fixture per failure case, the no-write test and a planted-helper test for an untrusted clone (`git-setup-check.test.cjs`)
- [ ] T009 Add the `setup` route row and header entry (`.skilled/commands/doctor/_routes.yaml`)
- [ ] T010 Write the one-step read-only workflow (`.skilled/commands/doctor/assets/doctor-git-setup.yaml`)
- [ ] T011 Update the router and presentation: argument hint, target tables, menu, help, valid targets and result templates (`git.md`, `doctor-git-presentation.txt`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 [P] Update the target lists: `scripts/README.md`, `scripts/tests/README.md`, `command-contract.json`, `.skilled/commands/README.txt` and the spec-kit doctor-commands catalog
- [ ] T013 [P] Add one sk-git playbook scenario for the setup battery with its index rows, `leaf-manifest.json` and `leaf-aliases.json` entries and the scenario counts
- [ ] T014 [P] Name the setup target in `.skilled/skills/sk-git/README.md` and add an sk-git section to the root `README.md` adaptation guide
- [ ] T015 Run `run-all.sh`, `route-validate.sh`, the HVR scan on changed docs and `/doctor:git setup` on this checkout and on an untrusted clone
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
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
- [ ] CHK-032 [P1] The battery never runs code from the inspected repository and never grants trust
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
| P0 Items | 12 | 2/12 |
| P1 Items | 13 | 1/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-15
<!-- /ANCHOR:summary -->

---



