---
title: "Tasks: Phase 9: doctor-git"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: doctor-git

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

- [x] T001 Inventory every `SPECKIT_SKIP_*` and `SPECKIT_ALLOW_*` variable the hook scripts read, and whether each gate blocks or warns (`scripts/git-hooks/*`)
- [x] T002 Trace sk-git's contract lookup, shape check and drift check (`sk-git/scripts/lib/message-contract.mjs`)
- [x] T003 Settle the split with `/doctor:env`: it keeps the whole-hook kill switches, `/doctor:git` owns the saved gate keys and `.sk-git/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the gate registry and the helper (`lib/gates.tsv`, `lib/gate-config.sh`)
- [x] T005 Wire the helper into the three hooks, in trusted toolchain repositories only (`pre-commit`, `prepare-commit-msg`, `pre-push`)
- [x] T006 Write the helper, parity and installed-hook suite (`tests/gate-config.test.sh`)
- [x] T007 Write the gate settings script and its suite (`git-hook-gates.cjs`, `tests/git-hook-gates.test.cjs`)
- [x] T008 Write the standards script and its suite, with a layout-keeping block writer (`git-standards.cjs`, `tests/git-standards.test.cjs`)
- [x] T009 Write the router, presentation and two workflows, and add the routes (`git.md`, `doctor-git-*`, `_routes.yaml`)
- [x] T010 Register the command in the contract and regenerate the runtime mirrors and prompts (`command-contract.json`)
- [x] T011 Update `/doctor:env`, `ENV-REFERENCE.md`, the hook, doctor and command READMEs and the root README
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run every hook suite and the doctor `run-all.sh`
- [x] T013 Remove the helper call from a scratch copy and confirm the installed-hook case fails
- [x] T014 Run the route validator, the router generator, the contract schema, the mirror, prompt and catalog checks, the route guard, the link checker and comment hygiene
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
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
- [x] CHK-003 [P1] Dependencies identified and available: `message-contract.mjs` exports `resolveContractDir`, `extractContract`, `contractShapeErrors`, `ruleIdsFor` and `templateDriftErrors`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: `bash -n` passes on the helper and the three hooks
- [x] CHK-011 [P0] No console errors or warnings: the route validator's two warnings are the informational `--dry-run` shared inside `/doctor:skill-advisor` and inside `/doctor:git`
- [x] CHK-012 [P1] Error handling implemented: both scripts exit 2 with a `STATUS=FAIL` line on a refused request, and the helper fails open when its registry is missing
- [x] CHK-013 [P1] Code follows project patterns: the router follows the thin-router shape and validates with 0 issues; comment hygiene exits 0 on every new and changed code file
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: the installed-hook case failed with the helper call removed
- [x] CHK-022 [P1] Edge cases tested: local over global, command scope ignored, an env skip already set, an untrusted repository
- [x] CHK-023 [P1] Error scenarios validated: refused keys, refused rules values and a broken rules block each exit 2 and write nothing
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: the missing persistent setting is `cross-consumer` (three hooks and `/doctor:env` name the variables)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the 12 variables in T001, each given a registry row
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the parity cases fail when a hook reads a variable with no row, or a row names a variable no hook reads
- [x] CHK-FIX-004 [P0] Security: command-scope config is ignored and the per-push approvals cannot be saved, each with a test
- [x] CHK-FIX-005 [P1] Matrix axes listed: 3 hooks by 12 gates by 2 scopes, plus 3 contract kinds by 3 mutating modes
- [x] CHK-FIX-006 [P1] Hostile env variant: `GIT_CONFIG_COUNT` command-scope values in both directions, and a repository outside the toolchain
- [x] CHK-FIX-007 [P1] Evidence is pinned to the phase commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: unknown keys, states, scopes, kinds, paths and non-JSON values are refused before any write
- [x] CHK-032 [P1] Writes happen only with `--apply`, which each workflow passes only after an approved plan
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: both scripts and the helper explain why the setting or override exists and what is refused
- [x] CHK-042 [P2] README updated: the hook, lib and test READMEs, both doctor script READMEs, the commands index and the root README
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: the mutation copy and scratch repositories lived in the session scratchpad and were removed
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-04
<!-- /ANCHOR:summary -->

---
