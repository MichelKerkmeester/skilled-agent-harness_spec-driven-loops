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

- [ ] T001 Build the in-scope file list with `grep -rIln '^title:.*\[template:level' specs`, then subtract the four excluded groups and confirm the remaining count against the exclusion audit (specs/)
- [ ] T002 [P] Grep the fixture tree for the token to confirm the full affected set (.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/)
- [ ] T003 [P] Grep every test file that treats `002-valid-level1`, `003-valid-level2` or `004-valid-level3` as an unconditional pass baseline (.opencode/skills/system-spec-kit/runtime/cli/tests/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Write and run the title-strip sweep over the in-scope file list, rewriting only the `title:` line's bracket token (specs/)
- [ ] T005 Regenerate `description.json` and `graph-metadata.json` for every packet whose title changed (.opencode/skills/system-spec-kit/runtime/cli/dist/spec-folder/generate-description.js, .../graph/backfill-graph-metadata.js)
- [ ] T006 Add the third hard `PLACEHOLDER_FILLED` class matching `^[0-9]+:[[:space:]]*title:.*\[template:level` (.opencode/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh)
- [ ] T007 Sweep the three fixtures the extended suite and the progressive-validation tests read as valid, leaving `072-scaffold-never-touched-violation` untouched (.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/002-valid-level1, 003-valid-level2, 004-valid-level3)
- [ ] T008 Add or update the isolated-rule test case for the third class alongside the existing two (.opencode/skills/system-spec-kit/runtime/cli/tests/test-validation-extended.sh)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run the extended validation suite, the progressive-validation vitest project, `test-validation-system.cjs` and the scaffold golden snapshots (.opencode/skills/system-spec-kit/runtime/cli/tests/)
- [ ] T010 Run the full runtime and CLI vitest projects and `npm run check` (.opencode/skills/system-spec-kit/runtime/)
- [ ] T011 Run `validate.sh --strict` on a sample of touched packets across every in-scope track, and spot-check the four excluded groups are byte-unchanged (.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh)
- [ ] T012 Re-run `grep -rIl '\[template:level' specs` and confirm every returned path sits under one of the four excluded groups (specs/)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: REQ-001 through REQ-005 present in spec.md §4]
- [ ] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md §3 Architecture and the Affected Surfaces table name the sweep script and the rule addition]
- [ ] CHK-003 [P1] Dependencies identified and available [EVIDENCE: 035-.../018-.../implementation-summary.md confirmed Complete and shipped]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: `bash -n` on check-placeholders.sh and the sweep script both exit 0]
- [ ] CHK-011 [P0] No console errors or warnings [EVIDENCE: sweep script run output has zero unmatched-file warnings]
- [ ] CHK-012 [P1] Error handling implemented [EVIDENCE: sweep script aborts on a title line that does not match either token shape instead of skipping it silently]
- [ ] CHK-013 [P1] Code follows project patterns [EVIDENCE: third class mirrors the two existing PLACEHOLDER_FILLED classes' grep-and-dedup structure in check-placeholders.sh]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md every row Met]
- [ ] CHK-021 [P0] Manual testing complete [EVIDENCE: validate.sh --strict run and read on the sampled touched packets]
- [ ] CHK-022 [P1] Edge cases tested [EVIDENCE: a title carrying the older underscore `[template:level_N/doc]` shape is confirmed stripped and confirmed caught by the new class]
- [ ] CHK-023 [P1] Error scenarios validated [EVIDENCE: the reverted first attempt's failure mode, `002-valid-level1` failing PLACEHOLDER_FILLED, is re-run and now passes because the fixture was swept in step with the rule]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: this finding is class-of-bug, since the same token shape recurs across ~930 titles rather than one instance]
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: the 929-file in-scope list from `grep -rIln '^title:.*\[template:level' specs` minus the exclusion groups]
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: T003's grep of every test file reading the three fixtures, and description.json/graph-metadata.json regeneration per touched packet]
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not applicable. The change is a title string edit and a grep-based validator class, no path or parser boundary]
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: plan.md's Affected Surfaces matrix axes row: exclusion group by token shape]
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: not applicable. Check-placeholders.sh reads only the files validate.sh passes it, no process-wide state]
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md's Files Changed table names the sweep-and-rule commit SHA once it lands]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets [EVIDENCE: diff review of the sweep script and the rule change contains no credential-shaped string]
- [ ] CHK-031 [P0] Input validation implemented [EVIDENCE: sweep script validates each candidate path resolves under `specs/` before writing]
- [ ] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable. No auth surface touched]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: requirement IDs in spec.md match the AC-ID to REQ-ID mapping in acceptance-criteria.md]
- [ ] CHK-041 [P1] Code comments adequate [EVIDENCE: check-placeholders.sh's header comment updated to describe three classes instead of two]
- [ ] CHK-042 [P2] README updated (if applicable) [EVIDENCE: rules/README.md's rule inventory checked for a PLACEHOLDER_FILLED description that would need the third-class note]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: sweep script's working list written under this packet's scratch/, not the repo root]
- [ ] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `git status` on scratch/ shows no residue at close]
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
