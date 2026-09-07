---
title: "Tasks: Phase 5: provenance-title-sweep"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "provenance sweep tasks"
  - "check placeholders third class task"
  - "fixture parity task"
  - "sweep verification checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: provenance-title-sweep

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

- [x] T001 Build the in-scope file list with `grep -rIln '^title:.*\[template:level' specs`, then subtract the four excluded groups and confirm the remaining count against the exclusion audit (specs/)
- [x] T002 [P] Grep the fixture tree for the token to confirm the full affected set (.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/)
- [x] T003 [P] Grep every test file that treats `002-valid-level1`, `003-valid-level2` or `004-valid-level3` as an unconditional pass baseline (.opencode/skills/system-spec-kit/runtime/cli/tests/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write and run the title-strip sweep over the in-scope file list, rewriting only the `title:` line's bracket token (specs/)
- [x] T005 Regenerate `description.json` and `graph-metadata.json` for every packet whose title changed (.opencode/skills/system-spec-kit/runtime/cli/dist/spec-folder/generate-description.js, .../graph/backfill-graph-metadata.js)
- [x] T006 Add the third hard `PLACEHOLDER_FILLED` class matching `^[0-9]+:[[:space:]]*title:.*\[template:level` (.opencode/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh)
- [x] T007 Sweep the three fixtures the extended suite and the progressive-validation tests read as valid, leaving `072-scaffold-never-touched-violation` untouched (.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1, 003-valid-level2, 004-valid-level3)
- [x] T008 Add or update the isolated-rule test case for the third class alongside the existing two (.opencode/skills/system-spec-kit/runtime/cli/tests/test-validation-extended.sh)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the extended validation suite, the progressive-validation vitest project, `test-validation-system.cjs` and the scaffold golden snapshots (.opencode/skills/system-spec-kit/runtime/cli/tests/)
- [x] T010 Run the full runtime and CLI vitest projects and `npm run check` (.opencode/skills/system-spec-kit/runtime/)
- [x] T011 Run `validate.sh --strict` on a sample of touched packets across every in-scope track, and spot-check the four excluded groups are byte-unchanged (.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh)
- [x] T012 Re-run `grep -rIl '\[template:level' specs` and confirm every returned path sits under one of the four excluded groups (specs/)
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: see implementation-summary.md Verification; CHK-001 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: see implementation-summary.md Verification; CHK-002 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: see implementation-summary.md Verification; CHK-003 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: see implementation-summary.md Verification; CHK-010 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: see implementation-summary.md Verification; CHK-011 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: see implementation-summary.md Verification; CHK-012 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: see implementation-summary.md Verification; CHK-013 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: see implementation-summary.md Verification; CHK-020 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: see implementation-summary.md Verification; CHK-021 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: see implementation-summary.md Verification; CHK-022 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]` shape is confirmed stripped and confirmed caught by the new class]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: see implementation-summary.md Verification; CHK-023 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: see implementation-summary.md Verification; CHK-FIX-001 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: see implementation-summary.md Verification; CHK-FIX-002 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: see implementation-summary.md Verification; CHK-FIX-003 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: see implementation-summary.md Verification; CHK-FIX-004 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: see implementation-summary.md Verification; CHK-FIX-005 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: see implementation-summary.md Verification; CHK-FIX-006 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: see implementation-summary.md Verification; CHK-FIX-007 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: see implementation-summary.md Verification; CHK-030 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: see implementation-summary.md Verification; CHK-031 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: see implementation-summary.md Verification; CHK-032 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: see implementation-summary.md Verification; CHK-040 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: see implementation-summary.md Verification; CHK-041 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: see implementation-summary.md Verification; CHK-042 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: see implementation-summary.md Verification; CHK-050 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: see implementation-summary.md Verification; CHK-051 holds by the title grep, the fixture case, the validation lane and the two vitest projects recorded there]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
