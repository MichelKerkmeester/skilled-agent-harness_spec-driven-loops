---
title: "Tasks: Command surface contract realignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "command surface realignment tasks"
  - "workflow asset rewrite tasks"
  - "help printer tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Command surface contract realignment

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

- [x] T001 Re-measure every synthesis count in the main checkout: registry rows and severities, hook tree lines, help output, dashboards, symbolic names, optimizer reports, fixture and comment (../005-overengineering-simplification/research/confirmed-findings.md)
- [x] T002 Map every `checklist.md`, `level_contract_*` and ticket-id site across the command surface (.opencode/commands/speckit)
- [x] T003 [P] Search for readers of the asset keys the rewrite renames (.opencode/skills/system-spec-kit/runtime/cli/rules/check-level-match.sh)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Rewrite the eight workflow assets: required files, template paths, level note, the acceptance-criteria step and scaffold, the verification steps, evidence sources, comment labels (.opencode/commands/speckit/assets)
- [x] T005 Correct the three presentation assets, the command README and the two command documents (.opencode/commands/speckit)
- [x] T006 Derive the help printer's categories from the registry (.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh)
- [x] T007 Add the help test (.opencode/skills/system-spec-kit/runtime/cli/tests/validate-help-lists-every-rule.vitest.ts)
- [x] T008 Correct the strict-only count, the fingerprint clause, the optimizer adoption note and the resource-map link (.opencode/skills/system-spec-kit)
- [x] T009 Remove the readerless flag from the golden fixture and the drift-test comment (.opencode/skills/system-spec-kit/runtime/tests)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Parse the eight assets, syntax-check the printer, count the rules `--help` prints, parse the fixture (.opencode/commands/speckit/assets)
- [x] T011 Run the help test, the parity suite, the drift guard, the check gate and the full CLI project (.opencode/skills/system-spec-kit/runtime/cli/tests)
- [x] T012 Sweep residue and run the sk-doc validator on every touched document (.opencode)
- [x] T013 Run strict validation on this child, the lane and the parent, regenerate metadata, close the parent map row (../spec.md)
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

- [x] CHK-010 [P0] Code passes lint/format checks - `bash -n` on the printer exits 0; `npm run check` exits 0
- [x] CHK-011 [P0] No console errors or warnings - the eight assets parse; the fixture parses
- [x] CHK-012 [P1] Error handling implemented - the printer keeps its registry-unavailable and registry-unreadable fallbacks
- [x] CHK-013 [P1] Code follows project patterns - the test follows the parity suite beside it; the assets keep their key vocabulary
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Help test, parity suite and drift guard pass
- [x] CHK-022 [P1] Edge cases tested - the help output is asserted per rule id and per category, so a registry with a new category is covered
- [x] CHK-023 [P1] Error scenarios validated - the rewrite script aborted on its first run when the sk-code authoring-checklist name matched the residue probe; the probe was narrowed and the run repeated from a clean tree
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. - not applicable
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. - not applicable; the printer reads one file
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented - the printer still guards a missing or unreadable registry
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable
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
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
