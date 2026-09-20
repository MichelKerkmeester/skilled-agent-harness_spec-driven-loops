---
title: "Tasks: Phase 17: guard-index-and-parent-doc-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "guard index fixes tasks"
  - "lineage rule verification checklist"
  - "drift guard fix tasks"
  - "parent document fix tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 17: guard-index-and-parent-doc-fixes

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

- [x] T001 Trace the drift-guard failures to generated Hermes copies and the marker they carry
- [x] T002 Trace the trigger-index pollution to the research-parent pruning rule and locate all 380 `lineages` directories
- [x] T003 Measure the parent goal's durable slice and list every template leftover in the parent spec
- [x] T004 Baseline the verifier (18), plugin (42) and retrieval (75) suites
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the generated-copy test, watch it fail, add the skip (`verify_alignment_drift.py`)
- [x] T006 Add the house-style shebang the cleared guard exposed (`.hermes/plugins/repo-guards/__init__.py`)
- [x] T007 Add the lineage probes, watch them fail, widen the rule with its manifest text (`retrieval/lib/corpus.mjs`)
- [x] T008 [P] Update the divergence entry and the conventions document's Section 9 row
- [x] T009 [P] Replace the parent spec's template leftovers and bring the parent goal within budget
- [x] T010 Regenerate the trigger index and its fixtures after this phase's documents exist
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Re-run every touched suite and the drift-guard wrapper
- [x] T012 Audit every added, removed and untracked path in the regenerated index
- [x] T013 Smoke-test a lookup against the regenerated index
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (not applicable; every check is automated)
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
- [x] CHK-003 [P1] Dependencies identified and available (checkout confirmed quiet)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`py_compile` and `node --check` exit 0)
- [x] CHK-011 [P0] No console errors or warnings introduced
- [x] CHK-012 [P1] Error handling implemented (not applicable; both changes add a condition to an existing branch)
- [x] CHK-013 [P1] Code follows project patterns (module-level regex constant; existing pruning function)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete (not applicable; automated)
- [x] CHK-022 [P1] Edge cases tested (`lineages` outside `specs/` still walked; a real dead route still reported)
- [x] CHK-023 [P1] Error scenarios validated (regenerated index audited path by path)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding classes: `class-of-bug` for the guard and the corpus rule, `instance-only` for the shebang and the parent documents.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: all 68 marked `SKILL.md` copies, all 380 `lineages` directories, and every template leftover in the parent spec.
- [x] CHK-FIX-003 [P0] Consumer inventory: every importer of the corpus policy exports, and both retrieval lanes in the divergence table.
- [x] CHK-FIX-004 [P0] Adversarial cases: a copy with a dead route, a real skill with a dead route, `lineages` under `specs/` with three parents, and `lineages` outside `specs/`.
- [x] CHK-FIX-005 [P1] Matrix axes listed: inside or outside `specs/`, research parent or not.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant (not applicable; no process-wide state is read)
- [x] CHK-FIX-007 [P1] Evidence pinned to the working-tree diff against `HEAD` 78419bddb3a on `skilled/v4.0.0.0`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented (not applicable; no new input)
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (each change carries its reason; comment hygiene clean)
- [x] CHK-042 [P2] README updated (not applicable; the conventions document is updated)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (session scratchpad, outside the repository)
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

**Verification Date**: 2026-09-16
<!-- /ANCHOR:summary -->
