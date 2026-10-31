---
title: "Tasks: Phase 15: compiled-serving-admission-research"
description: "Ordered tasks for the two-lineage compiled-serving admission research, from charter to validated synthesis."
trigger_phrases:
  - "compiled-serving admission tasks"
  - "phase 15 tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 15: compiled-serving-admission-research

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

- [x] T001 Write the charter: five questions over three paths (`spec.md`)
- [x] T002 Write the research config with the two-lineage fan-out block (`research/deep-research-config.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P] Run five iterations on SWE 2 Max through cli-devin (`research/lineages/swe2/`)
- [x] T004 [P] Run five iterations on DeepSeek V4.1 Flash through cli-pi (`research/lineages/deepseek/`)
- [x] T005 Merge the lineages and emit the resource map (`research/findings-registry.json`, `research/resource-map.md`)
- [x] T006 Re-check the claims the recommendation depends on against the tree
- [x] T007 Compile the synthesis (`research/research.md`)
- [x] T008 Write the findings block back into the spec and mark the config complete (`spec.md`, `research/deep-research-config.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Validate the phase strictly
- [x] T010 Save continuity through `generate-context.js`
- [x] T011 Correct the charter's hub count from seven to five (`spec.md`)
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
- **Research**: See `research/research.md`
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
- [x] CHK-003 [P1] Dependencies identified and available. Both executors passed preflight
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Not applicable: no code changed
- [x] CHK-011 [P0] No console errors or warnings introduced. Not applicable: no code changed
- [x] CHK-012 [P1] Error handling implemented. Not applicable: no code changed
- [x] CHK-013 [P1] Code follows project patterns. Not applicable: no code changed
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete. The three deciding claims were re-checked by hand
- [x] CHK-022 [P1] Edge cases tested. Where the lineages disagreed, the tree decided
- [x] CHK-023 [P1] Error scenarios validated. Both lineages completed, so the one-lineage fallback was not needed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a class. Not applicable: research only, no fix
- [x] CHK-FIX-002 [P0] Same-class producer inventory. Not applicable: research only
- [x] CHK-FIX-003 [P0] Consumer inventory. Not applicable: research only
- [x] CHK-FIX-004 [P0] Adversarial table tests. Not applicable: research only
- [x] CHK-FIX-005 [P1] Matrix axes listed. Not applicable: research only
- [x] CHK-FIX-006 [P1] Hostile env variant. Not applicable: research only
- [x] CHK-FIX-007 [P1] Evidence pinned to a SHA. The retired code is read at `b45ea54cea3^`. The lineages started on `bb1d36a431`, and no commit since has touched compiled routing
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] No private home-derived path in any tracked file. One lineage config was rewritten to a repo-relative path
- [x] CHK-032 [P1] No gate bypass variable used
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] No ephemeral ids in code comments. Not applicable: no code changed
- [x] CHK-042 [P2] README updated (if applicable). Not applicable
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
