---
title: "Tasks: Phase 9: existing-issue-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "existing issue fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: existing-issue-fixes

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

- [x] T001 Confirm each defect in the code
- [x] T002 Write the brief (`scratch/brief-wu1.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 WU1: pattern fix and test, doc sentence, CI steps (DeepSeek, `scratch/brief-wu1.md`)
- [x] T004 Check the diff against `scratch/files.txt`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 `check-source-tags.vitest.ts` passes with the new case
- [x] T006 `test-cite-drift-scan.mjs` matches its baseline
- [x] T007 Workflow parses as YAML
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Gates match or beat the baseline
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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 to REQ-003 in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in plan.md — `plan.md` §1 and §3
- [x] CHK-003 [P1] Dependencies identified and available — `deep-loop-runtime.yml` build pattern reused
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — vitest transforms the changed test; module loads in the cite-drift suite
- [x] CHK-011 [P0] No console errors or warnings — Both suites print no warnings
- [x] CHK-012 [P1] Error handling implemented — N/A: no new error path
- [x] CHK-013 [P1] Code follows project patterns — Test follows the file's `makeRepo`/`write` pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 to AC-003 Met
- [x] CHK-021 [P0] Manual testing complete — Orchestrator reran both suites
- [x] CHK-022 [P1] Edge cases tested — Lookbehind case: a match cannot start after `+`
- [x] CHK-023 [P1] Error scenarios validated — Old pattern makes the new case fail
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — class-of-bug: one shared pattern
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — `rg CITATION_RE` finds one definition
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — Consumers `cite-drift-scan.mjs` and `check-source-tags-helper.mjs` covered by their suites
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — Plus-sign path and the lookbehind boundary covered; pattern has no path-safety role
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — N/A: no matrix
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — N/A: no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Snapshot `1731c459c` to tree `b675aec1a`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — No secrets
- [x] CHK-031 [P0] Input validation implemented — N/A: no input handling changed
- [x] CHK-032 [P1] Auth/authz working correctly — N/A: no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — spec, plan, tasks and summary agree
- [x] CHK-041 [P1] Code comments adequate — Workflow step comment states why the build runs
- [x] CHK-042 [P2] README updated (if applicable) — N/A: no README affected
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — Brief kept in `scratch/`
- [x] CHK-051 [P1] scratch/ cleaned before completion — `scratch/` holds only the brief and file list
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-10
<!-- /ANCHOR:summary -->

---



