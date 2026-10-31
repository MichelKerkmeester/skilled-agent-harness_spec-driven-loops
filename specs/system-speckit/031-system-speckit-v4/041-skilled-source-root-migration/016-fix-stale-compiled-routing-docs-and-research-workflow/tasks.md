---
title: "Tasks: Phase 16: fix-stale-compiled-routing-docs-and-research-workflow"
description: "Ordered tasks for correcting the stale compiled-routing text and the retired validator rule in the research workflows."
trigger_phrases:
  - "stale compiled routing text tasks"
  - "phase 16 tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 16: fix-stale-compiled-routing-docs-and-research-workflow

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

- [x] T001 Inventory the stale hub count and renamed directories across compiled-routing code and docs
- [x] T002 Inventory every live caller of `TEMPLATE_HEADERS` and confirm when and why it was retired (`fd33222d92b`)
- [x] T003 Confirm how the promotion step and the route guard treat the two resolver copies
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Correct the cohort comment in both resolver copies, identically (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` and its authored source)
- [x] T005 [P] Correct the advisor cohort comment and its resolver path (`.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts`)
- [x] T006 [P] Correct the foundation test header (`.skilled/bin/compiled-routing-foundation.vitest.ts`)
- [x] T007 Correct the architecture reference: hub count, directory names, model build and the admission step (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/compiled-routing-architecture.md`)
- [x] T008 [P] Correct the phase 13 summary (`../013-clear-pre-existing-ci-and-doc-debt/implementation-summary.md`)
- [x] T009 Drop the retired rule from four rule lists (`.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml`)
- [x] T010 Recompile the deep research command contract (`.skilled/commands/deep/assets/compiled/deep-research.contract.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the bin vitest suite, the route guard and the contract drift check
- [x] T012 Run the node gate and the standalone deep-loop suite
- [x] T013 Run the corrected rule list against a real spec folder
- [x] T014 Rerun the same-class searches and confirm only out-of-scope hits remain
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
- **Research**: See `../015-compiled-serving-admission-research/research/research.md`
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

- [x] CHK-010 [P0] Code passes lint/format checks. Every commit passes the pre-commit gates
- [x] CHK-011 [P0] No console errors or warnings introduced
- [x] CHK-012 [P1] Error handling implemented. Not applicable: comments only
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete. The corrected rule list ran against a real folder
- [x] CHK-022 [P1] Edge cases tested. The promotion path: both resolver copies are byte-identical
- [x] CHK-023 [P1] Error scenarios validated. The old rule list fails with the validator's unknown-rule error; the new one runs
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding has a class. Seven-hub text: `class-of-bug`. Resolver copies: `cross-consumer`. Retired rule: `class-of-bug`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed with the searches in `plan.md`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the promotion tool and the contract compiler.
- [x] CHK-FIX-004 [P0] Adversarial table tests. Not applicable: no path, parser or security logic changed
- [x] CHK-FIX-005 [P1] Matrix axes listed. Two workflow files by two rule-list sites.
- [x] CHK-FIX-006 [P1] Hostile env variant. Not applicable: no process-wide state read
- [x] CHK-FIX-007 [P1] Evidence pinned to `0512505ab7..HEAD` on the phase branch.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No private home-derived path in any tracked file
- [x] CHK-032 [P1] No gate bypass variable used
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] No ephemeral ids in code comments
- [x] CHK-042 [P2] Reference updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only
- [x] CHK-051 [P1] scratch/ holds nothing but its placeholder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-19
<!-- /ANCHOR:summary -->

---
