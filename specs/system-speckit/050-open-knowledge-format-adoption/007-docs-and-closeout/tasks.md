---
title: "Tasks: Phase 7: docs-and-closeout"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "docs and closeout tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: docs-and-closeout

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

- [x] T001 Confirm phases 003 to 005 are built
- [x] T002 Read the changelog contract and the hub version authority (`sk-create-changelog/SKILL.md`, `parent-skill-check.cjs` checks 13a and 13b)
- [x] T003 [P] Inventory every command surface the earlier phases changed
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Command docs name their new checks: `/speckit:plan`, `/speckit:implement`, `/speckit:complete`, `/speckit:save`, `/deep:research`, `/deep:review`, `/doctor:speckit`; contracts regenerated
- [x] T005 Key table and rule sections (`grep-convention.md`, `validation-rules.md`)
- [x] T006 Catalog entries and playbook scenarios in both skills, and the two older census docs brought up to date
- [x] T007 Six changelog entries and the matching `SKILL.md` versions, plus the four sk-doc hub artifacts
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Fix the two docs that said `--strict` fails on warnings (`ARCHITECTURE.md`, `spec-folder-write-recipe.md`)
- [x] T009 Add the missing test for the phase 003 rule (`check-frontmatter-values.vitest.ts`)
- [x] T010 Rerun the CLI suite and `validate.sh --strict --recursive` on the packet, then write the closure record
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

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-006 in spec.md section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md: plan.md
- [x] CHK-003 [P1] Dependencies identified and available: phases 003 to 005 closed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks: `npm run lint` exit 0; every changed code file parses (implementation-summary.md:132)
- [x] CHK-011 [P0] No console errors or warnings: the new tests pass 3/3 (implementation-summary.md:131)
- [x] CHK-012 [P1] Error handling implemented: not applicable: this phase adds no behavior
- [x] CHK-013 [P1] Code follows project patterns: the new test follows the source-tag rule tests' harness
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met: AC-004 waits for the commit (acceptance-criteria.md)
- [x] CHK-021 [P0] Manual testing complete: the agent's scenarios were rerun and every validator it named was rerun here
- [x] CHK-022 [P1] Edge cases tested: the test covers aliases, quoting, case and a value in the body
- [x] CHK-023 [P1] Error scenarios validated: the off-list case warns and never fails
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: the strict-mode claim is class-of-bug: the same wrong sentence in two docs
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.: a search for the claim across spec-kit and command docs found only those two
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.: not applicable: no code symbol changed
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.: not applicable: no security, path or parser fix
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.: not applicable: docs only, no input matrix
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.: not applicable: the new test reads no environment variable
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.: evidence is the uncommitted diff on `5285608745fe`; the commit is held by root D4
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: a pattern scan of the whole program diff found none
- [x] CHK-031 [P0] Input validation implemented: not applicable: this phase adds no input
- [x] CHK-032 [P1] Auth/authz working correctly: not applicable: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized: spec, plan and tasks describe the same closeout
- [x] CHK-041 [P1] Code comments adequate: the new test's header states why it exists
- [x] CHK-042 [P2] README updated (if applicable): catalogs, playbooks, ARCHITECTURE and the recipe updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: `scratch/` is empty
- [x] CHK-051 [P1] scratch/ cleaned before completion: `scratch/` is empty
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-04
<!-- /ANCHOR:summary -->

---



