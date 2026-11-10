---
title: "Tasks: Quality resolver: multi-file explain with surface skill folders, checklist seats and rule overrides"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "quality resolver tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Quality resolver: multi-file explain with surface skill folders, checklist seats and rule overrides

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

`G` is `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs`. `T` is `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs`. The explain cases run with `node --test --test-name-pattern="^explain" T`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure the single-path explain (`G` at `HEAD`). Verify: `--explain README.md AGENTS.md` printed `USAGE: unknown argument AGENTS.md`, exit 3; `--explain README.md` top-level keys `schema,status,exit_code,file,language,language_source,unchecked,surfaces,config,checklists,checks,errors,note` and checklist keys `file,path,why`.
- [x] T002 Baseline the quality runner suite. Verify: `node --test *.test.cjs` printed `tests 123`, `pass 123`, `fail 0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Accept several paths after `--explain` and a repeated flag (`G` `parseArgs`). Verify: the several-files case passes with both forms giving equal `files`.
- [x] T004 Record each checklist row's seat and return a `seats` map beside the list (`G` `checklistRows`, `resolveChecklists`). Verify: the several-files case reads `default`, `hub-surface` and `repo-config`, and the outside quality-block case reads `outside-skill`.
- [x] T005 Name each detected surface's folder (`G` `surfaceSkills`). Verify: the outside-surface case names the trusted link's folder with `SPECKIT_PRIVATE_SKILL_ROOTS` set and reads `UNKNOWN` with no folder when it is unset.
- [x] T006 Read each checklist's override section through `lintOverrides` (`G` `overridesReader`). Verify: the overrides case reads two rows from the valid section and `refused: true` with a hard-floor error at line 7 from the floor section.
- [x] T007 Write the six explain cases (`T`). Verify: against the `HEAD` runner `tests 6`, `pass 0`, `fail 6`, exit 1; against the changed runner `pass 6`, `fail 0`.
- [x] T008 Document the multi-file shape (`runner-contract.md`). Verify: `validate_document.py --json` prints `"total_issues": 0`.
- [x] T009 Write the changelog entry, step the carrier and sync Hermes (`changelog/v1.13.3.0.md`, `SKILL.md`). Verify: `validate_document.py --json` prints `"total_issues": 0`; the sync prints `PASS: 67 Hermes skill copies in sync`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the full quality runner suite. Verify: `tests 129`, `pass 129`, `fail 0`, exit 0.
- [x] T011 Compare single-path output against the `HEAD` runner on four real files with the added fields removed. Verify: `SAME` for `quality-gate.cjs`, `README.md`, `.github/workflows/advisory-checks.yml` and the parent `spec.md`, both exit 2.
- [x] T012 Run the quality gate on the two code files. Verify: `gate=NO_BLOCKER_FOUND exit=0`, `findings: 0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The suite passes 129 of 129
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-009 in `spec.md` section 4.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` section 3.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: the linter, the declared-surfaces reader and the trusted-root rule load from the worktree.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `quality-gate.cjs --files` on the two code files prints `gate=NO_BLOCKER_FOUND exit=0`, `findings: 0`.
- [x] CHK-011 [P0] No new warnings in the test output.
- [x] CHK-012 [P1] Error handling: a linter that fails to load, or a checklist that cannot be read, marks that section refused with the reason instead of throwing.
- [x] CHK-013 [P1] Code follows the file's section headers and comment style, with no ephemeral labels in comments.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] CHK-021 [P0] Each new case fails before and passes after. Evidence: T007.
- [x] CHK-022 [P1] Edge cases: a missing path among several and a bare `--explain` both exit 3. Evidence: the single-file case.
- [x] CHK-023 [P1] The snapshot guard wraps every explain call in the new cases, so a written file fails them.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `instance-only`, one CLI path that could not answer several files or name folders, seats and overrides.
- [x] CHK-FIX-002 [P0] Same-class producers: `rg -l -- "--explain" .skilled` outside changelogs finds the quality runner's flag only in `runner-contract.md`, the runner and its two test files; the sk-git and doctor hits are another tool's flag.
- [x] CHK-FIX-003 [P0] Consumers: `runGate` destructures only `checklists`, `errors` and `warnings`; single-path output compares `SAME` against `HEAD` with the added fields removed.
- [x] CHK-FIX-004 [P0] Path and trust logic: the outside folder comes from `declaredSurfaces`, so the trusted-root rule decides it; the untrusted link case reads no folder.
- [x] CHK-FIX-005 [P1] Matrix: one and several paths, by hub, outside and unknown surfaces, by valid, floor and absent override sections, all in the six cases.
- [x] CHK-FIX-006 [P1] Process-wide state: `SPECKIT_PRIVATE_SKILL_ROOTS` is read through the existing rule only, and the test sets and unsets it per call.
- [x] CHK-FIX-007 [P1] Evidence is against base `6285986cd4` plus the uncommitted diff in worktree `232-private-guard-fixes`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; the quality gate's secrets check ran clean.
- [x] CHK-031 [P0] Input validation: a missing, outside or absent path still stops the call with exit 3.
- [x] CHK-032 [P1] No private skill is named in any tracked file this child wrote; the fixture name is the existing test constant.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same code files.
- [x] CHK-041 [P1] Code comments state why seats sit beside the list and why the linter comes from the runner's own hub.
- [x] CHK-042 [P2] Changelog entry written for sk-code-quality.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp output lived in the session scratchpad, and the temporary `HEAD` runner copy was removed.
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
