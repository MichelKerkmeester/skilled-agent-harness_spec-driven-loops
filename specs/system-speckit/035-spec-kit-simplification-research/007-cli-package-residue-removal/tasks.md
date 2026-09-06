---
title: "Tasks: CLI package residue removal"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli residue removal tasks"
  - "dead file census tasks"
  - "spec kit check workflow tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CLI package residue removal

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

- [x] T001 Census every removal, merge and fix row of the synthesis against the whole repository (../002-cli-runtime-utilization/research/confirmed-findings.md)
- [x] T002 Read every test, fixture and document that names a removal candidate (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T003 [P] Time the full CLI vitest project as a baseline and read its one pre-existing failure (.opencode/skills/system-spec-kit/runtime/cli/tests)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Correct the package description, the CLI README, ARCHITECTURE and the rules README (.opencode/skills/system-spec-kit/ARCHITECTURE.md)
- [x] T005 Rename the save contract key and unify the phase-child regex across documents, comments and code (.opencode/commands/speckit/assets)
- [x] T006 Add the sibling-lane headers to the placeholder and hygiene checks (.opencode/skills/system-spec-kit/runtime/cli/rules)
- [x] T007 Remove the forty-six dead files and every row, tree entry, mock, test block and fixture entry that named them (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T008 Rewrite the ops README around the two helpers that remain (.opencode/skills/system-spec-kit/runtime/cli/ops/README.md)
- [x] T009 Repoint the deep-research playbook scenario at the command contract (.opencode/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/graph-convergence-signals.md)
- [x] T010 Create the spec-kit-check workflow (.github/workflows/spec-kit-check.yml)
- [x] T011 Re-apply the edits onto HEAD copies and stage them by object id so the other session's sweep stays out of the index (.opencode/skills/system-spec-kit)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rebuild the CLI package and run npm run check and the dist freshness check (.opencode/skills/system-spec-kit/runtime/cli)
- [x] T013 Run the six touched vitest files, the legacy module suite, the shared tests and the full CLI project (.opencode/skills/system-spec-kit/runtime/cli/tests)
- [x] T014 Sweep for residue of every removed name outside specs, changelogs and benchmark reports (.opencode)
- [x] T015 Run strict validation on this child and the parent, regenerate metadata, close the parent map row (../spec.md)
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

- [x] CHK-010 [P0] Code passes lint/format checks - `npm run check` exit 0 after rebuild
- [x] CHK-011 [P0] No console errors or warnings - dist freshness reports every watched output fresh
- [x] CHK-012 [P1] Error handling implemented - not applicable; removals and record corrections
- [x] CHK-013 [P1] Code follows project patterns - headers keep the divider style; the workflow mirrors the existing install steps
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Six touched vitest files pass (96 tests); legacy module suite prints all passed (289); shared tests exit 0
- [x] CHK-022 [P1] Edge cases tested - the folder-name regex rejects a leading hyphen; no such folder exists
- [x] CHK-023 [P1] Error scenarios validated - the export-contracts test's inability to run was reproduced before removal
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. - not applicable; no such fix in scope
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. - not applicable
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented - unchanged
- [x] CHK-032 [P1] Auth/authz working correctly - not applicable; the workflow is read-only
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

**Verification Date**: 2026-09-06
<!-- /ANCHOR:summary -->

---
