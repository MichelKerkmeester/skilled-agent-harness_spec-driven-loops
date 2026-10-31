---
title: "Tasks: Doc path, strict-mode and retired-capability fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "remediation tasks"
  - "confirmed row application"
  - "strict mode warning semantics doc fix"
  - "retired vector search docs cleanup"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Doc path, strict-mode and retired-capability fixes

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

- [x] T001 Read the confirmed table and every cited line (../025-docs-reality-alignment-research/research/confirmed-findings.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Fix the strict-mode and freshness passages (references/validation/validation-rules.md, runtime/cli/spec/validate.sh)
- [x] T003 Repoint stale paths and counts (README.md, phase-definitions.md, session-capturing playbook)
- [x] T004 Replace phantom rule scripts and retired capabilities (level-selection-guide.md, template-composition-system.md, execution-methods.md, runtime-config-contract.md, description-discovery, enforcement playbook)
- [x] T005 Correct enumerations (doctor category-overview and dispatch, memory-handback.md, spec-validation-rule-engine.md, environment-variables.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Ripgrep the retired names across the skill docs and confirm no live hit
- [x] T007 Regenerate the trigger index and confirm zero malformed documents
- [x] T008 Validate this child strict, regenerate metadata, commit by pathspec
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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Gates rerun from the final state with output read
- [x] CHK-022 [P1] Residue scan clean
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Implementation summary records every judgment decision
- [x] CHK-042 [P2] Parent map row and timeline entry updated
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
| P0 Items | 4 | 4/4 |
| P1 Items | 6 | 6/6 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-06
<!-- /ANCHOR:summary -->

---
