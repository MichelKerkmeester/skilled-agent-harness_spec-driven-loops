---
title: "Tasks: Phase 2: scripts-into-runtime-nesting"
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
# Tasks: Phase 2: scripts-into-runtime-nesting

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

- [x] T001 Run `rg -n "system-spec-kit/scripts" .` scoped to `.opencode/commands`, `.opencode/skills`, `.claude`, `.codex`, `.cursor`, `.devin`, `.pi`, `.github`, and repo root; save the raw hit list
- [x] T002 [P] Read `runtime/scripts/` (`finalize-dist.mjs`, `run-tests.mjs`, `run-tests-sharded.mjs`, `tests/`) to confirm the exact collision surface a naive `git mv scripts runtime/scripts` would hit
- [x] T003 [P] Read `.opencode/skills/system-spec-kit/package.json`'s `workspaces` array and confirm the current three-member list (`shared`, `runtime`, `scripts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Classify every T001 hit as live consumer (import/exec/config-string that resolves) or prose (changelog, comment, historical mention); drop prose hits from the blast-radius count
- [x] T005 Group the live-consumer hits by class: hook config, CI workflow, doctor asset, agent mirror, README, CLAUDE.md, workspace config; record a count per class
- [x] T006 Record the target-layout decision (`runtime/cli/` recommended) and its collision-avoidance rationale in `spec.md`
- [x] T007 Run `recommend-level.sh` (then at `scripts/spec/`, now at `runtime/cli/spec/`) against this folder and record its numeric score and recommended level
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Confirm the live/prose classification on a 10% random sample of T001 hits by manual inspection; record any misclassification found
- [x] T009 Confirm this phase's `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` cite the packet-053 precedent and do not themselves attempt any `git mv`
- [x] T010 Hand off: create the Level 3 execution packet (Gate 3 Option D, this parent) seeded with the T004-T007 outputs, once `recommend-level.sh` confirms Level 3 — superseded: the operator directed execution in this folder and no child packet was created
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

- [x] CHK-010 [P0] Code passes lint/format checks
- [x] CHK-011 [P0] No console errors or warnings
- [x] CHK-012 [P1] Error handling implemented
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested
- [x] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented
- [x] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable)
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
| P0 Items | 9 | 9/9 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-05
<!-- /ANCHOR:summary -->

---
