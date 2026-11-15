---
title: "Tasks: Phase 10: post-fix-research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "post fix research tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: post-fix-research

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

- [x] T001 Scaffold the phase folder with `create.sh --phase --parent` (this folder)
- [x] T002 Add the phase to the parent map, binding table and goal criteria (`../spec.md`, `../goal.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run one cli-pi lineage, `deepseek-v4.1-flash` at max, five iterations (`research/lineages/deepseek-pi/`)
- [x] T004 Merge the lineage with `fanout-merge.cjs` (`research/findings-registry.json`)
- [x] T005 Verify every finding at its cited line and write the report (`research/research.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Confirm no gateway refusal and a `fulfilled` lineage (`orchestration-summary.json`)
- [x] T007 Run recursive strict validation on the parent (RESULT: PASSED)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (every cited line read)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-003)
- [x] CHK-002 [P0] Technical approach defined in plan.md (fan-out route with one entry)
- [x] CHK-003 [P1] Dependencies identified and available (`pi`, the llmgateway route)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (no code changed)
- [x] CHK-011 [P0] No console errors or warnings (runner exit 0; one reducer-provenance warning recorded)
- [x] CHK-012 [P1] Error handling implemented (not applicable to a research phase)
- [x] CHK-013 [P1] Code follows project patterns (no code changed)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC 4/4)
- [x] CHK-021 [P0] Manual testing complete (cited lines read)
- [x] CHK-022 [P1] Edge cases tested (containment advisory traced to the orchestrator's own parent edits)
- [x] CHK-023 [P1] Error scenarios validated (no gateway refusal in this lineage)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Research only; classes are assigned when a fix phase opens.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Not applicable; nothing was fixed.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Not applicable; nothing was changed.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Not applicable.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Twenty findings, each with a verdict.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Not applicable.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Cited lines are pinned to `main` at `64a47e5157`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (none in the research artifacts)
- [x] CHK-031 [P0] Input validation implemented (not applicable)
- [x] CHK-032 [P1] Auth/authz working correctly (the lineage wrote through the gateway only)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate (no code changed)
- [x] CHK-042 [P2] README updated (if applicable): not applicable
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (run logs live in the session scratchpad)
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

**Verification Date**: 2026-10-19
<!-- /ANCHOR:summary -->

---
