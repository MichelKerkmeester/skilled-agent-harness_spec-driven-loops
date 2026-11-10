---
title: "Tasks: Phase 10: manifest-dead-fields-and-coaching-markers"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "manifest dead field tasks"
  - "scaffold marker removal tasks"
  - "extension guide edit task"
  - "golden snapshot verification task"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 10: manifest-dead-fields-and-coaching-markers

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

- [x] T001 Confirm the 32 `creationTrigger`/`absenceBehavior` occurrences and the two `create.sh` block line ranges (662-679, 683-696) against the current files
- [x] T002 [P] Run the three named suites once before any edit to record the pre-change baseline pass count
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove `creationTrigger` and `absenceBehavior` from all 16 `documents[]` entries in `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json`
- [x] T004 Remove the `SCAFFOLD_VALIDATION_COUNTS` append block and its guard from `.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh`
- [x] T005 Remove the `SCAFFOLD_AI_PROTOCOL_MARKERS` append block and its guard from `.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh`
- [x] T006 Edit `.opencode/skills/system-spec-kit/templates/EXTENSION-GUIDE.md` §1 to drop the `creationTrigger`/`absenceBehavior` description rows
- [x] T007 Re-read `.opencode/skills/system-spec-kit/templates/README.md`'s manifest description line and edit it only if it names the removed fields
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run a throwaway `create.sh` scaffold at Level 3+ and confirm neither marker string appears in the output `spec.md`/`plan.md`
- [x] T009 Run `scaffold-golden-snapshots.vitest.ts`, `template-version-parity.vitest.ts` and `level-contract-resolver.vitest.ts` and confirm the same pass count as the T002 baseline
- [x] T010 Grep the repo for `creationTrigger`, `absenceBehavior`, `SCAFFOLD_VALIDATION_COUNTS` and `SCAFFOLD_AI_PROTOCOL_MARKERS` and confirm no hit outside git history
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: REQ-001 through REQ-004 present in spec.md's Requirements section]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md's Architecture and Affected Surfaces sections name the manifest edit, the create.sh edit and the doc edit]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: the three named test suites confirmed present under runtime/cli/tests/]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: spec-kit-docs.json parses as valid JSON after the edit, and create.sh passes shellcheck if run in CI]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: T008's throwaway scaffold run completes with no stderr output]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: not applicable, no new error path added]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: the remaining documents[] entries keep the same template/owner shape used before]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md rows AC-001 through AC-004 all read Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: T008's throwaway scaffold output reviewed directly]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: a Level 1 and a Level 3+ scaffold both run, since the AI-protocol marker only appended at Level 3+]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: JSON parse of spec-kit-docs.json confirmed valid post-edit]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: F2-08 and f-iter002-003 classed as class-of-bug, the same dead-field pattern repeated across 16 entries and two marker blocks]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: the 32-occurrence count and two-block line-range citation in spec.md's Problem Statement is the complete producer inventory]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: T001's repo-wide grep confirmed zero readers of either field or marker before the edit]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not applicable, no path or parser logic changed]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: plan.md's Affected Surfaces section lists the field x document and marker x level matrices]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: not applicable, no process-wide state read]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md's Verification table names the closing commit SHA once implemented]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: not applicable, manifest and scaffolder-script edits only]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: not applicable, no input-handling code changed]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable, no auth surface touched]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: all three name the same four files and the same REQ-001 through REQ-004 requirement set]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: create.sh's remaining comments make no reference to the removed blocks]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: T007's re-read of templates/README.md decides whether an edit is needed]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: the throwaway scaffold run's output folder created under this packet's scratch/ directory]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: scratch/ directory listing empty or absent at completion]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
