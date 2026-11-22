---
title: "Tasks: Phase 2: playbook-marker-backfill"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "playbook marker backfill tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: playbook-marker-backfill

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

- [x] T001 Record each root's doc-validator count (`<root>/manual-testing-playbook.md`). Verify: one count per root. Evidence: 0 on seven roots, 3 on `mcp-tooling`, `sk-design`, `sk-doc` and `deep-research`.
- [x] T002 Check each root's shape (`<root>/manual-testing-playbook.md`). Verify: `---` then `## 1. OVERVIEW`, no fence before it. Evidence: all 11 match.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Insert the Result persistence block (`<root>/manual-testing-playbook.md`, 11 roots). Verify: each root contains the marker once. Evidence: the script printed `inserted` for all 11.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Rerun the fleet (`validate-playbook-package.cjs --json`). Verify: exit 0, no marker code. Evidence: exit 0, 55 PASS and 4 SKIP. Every other count equals the baseline.
- [x] T005 Rerun the doc validator on the 11 roots. Verify: counts unchanged. Evidence: `diff` of the before and after lists is empty.
- [x] T006 Run the commit gates for each touched skill (`generate-leaf-manifest.cjs --check`, `parent-skill-check.cjs`, `generate-router-intent-signals.cjs --check`). Verify: every check passes. Evidence: leaf manifests OK on all seven skills, the five hubs `OK` and `RESULT: PASSED`.
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

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `validate_document.py --type playbook` counts unchanged on all 11 roots.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the fleet run printed no violation.
- [x] CHK-012 [P1] Error handling implemented. Evidence: the insertion script asserts each root's shape before writing.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: the block matches the root template word for word except the path.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested. Evidence: the four routing-gold roots took the block too, though their SKIP status hid the error.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: before this phase the fleet exited 1 with the 11 violations.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: the missing marker is `cross-consumer`, one per root.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: the fleet validator walked all 59 roots and named exactly these 11.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: CI's fleet step reads every root.
- [x] CHK-FIX-004 [P0] Adversarial cases. N/A: no parser or path code changed.
- [x] CHK-FIX-005 [P1] Matrix axes listed. Evidence: operator roots and routing-gold roots.
- [x] CHK-FIX-006 [P1] Hostile env variant. N/A: documentation only.
- [x] CHK-FIX-007 [P1] Evidence pinned. Evidence: worktree 514 from `920be184c8c` with this phase's changes.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the block holds a command and placeholders only.
- [x] CHK-031 [P0] Input validation implemented. N/A: no input surface changed.
- [x] CHK-032 [P1] Auth/authz. N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. N/A: no code changed.
- [x] CHK-042 [P2] README updated. N/A: no README describes the roots' blocks.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files outside the repository. Evidence: the baseline files sat in the session scratch folder.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-22
<!-- /ANCHOR:summary -->

---
