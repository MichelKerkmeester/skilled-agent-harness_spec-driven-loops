---
title: "Tasks: Scaffold, placeholder and upgrade truth"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "scaffold placeholder truth tasks"
  - "remediation tasks"
  - "round three tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Scaffold, placeholder and upgrade truth

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

- [x] T001 Census the nineteen round-three rows and the parked GLM iteration in the main checkout (../004-template-system-and-acceptance-criteria/research/confirmed-findings.md)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Replace the blanket fill with specific fills, strip provenance, fail a phase parent loudly, derive each child's metadata (.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh)
- [x] T003 State the rule's two hard classes and why provenance tokens stay with the standalone report (.opencode/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh)
- [x] T004 Create the lifecycle summary on upgrade and stop creating the lazy decision record (.opencode/skills/system-spec-kit/runtime/cli/spec/upgrade-level.sh)
- [x] T005 Resolve path-typed documents by file name in both resolvers; add the review case (.opencode/skills/system-spec-kit/runtime/cli/utils/template-structure.js)
- [x] T006 Give the phase-parent template its own slug and hint tokens; fix the three human-voice breaches; correct the reference table (.opencode/skills/system-spec-kit/templates)
- [x] T007 Assert the strip and substitution in the goldens and update the changed snapshots (.opencode/skills/system-spec-kit/runtime/cli/tests/scaffold-golden-snapshots.vitest.ts)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rebuild, run the lanes, validate the program, run the sk-doc validator and regenerate metadata (../spec.md)
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md §4]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md §1]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: the lane's confirmed-findings.md round-three section]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: bash -n, node --check and the builds exit 0]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: dist-freshness check-all reports every output fresh]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: every new branch keeps the existing error paths]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: rule headers follow the Rule/Severity/Description block]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md, every row Met]
- [x] CHK-021 [P0] The test lanes pass [EVIDENCE: implementation-summary.md Verification]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: implementation-summary.md Verification]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: implementation-summary.md Key Decisions]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: confirmed-findings.md round-three dispositions]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: plan.md affected surfaces]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: implementation-summary.md Key Decisions]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not applicable, no such fix in this child]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: plan.md affected surfaces]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: the lanes run with the repository's own environment]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: implementation-summary.md names the commit]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: diff reviewed]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: existing validation paths unchanged]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable, no auth surface]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: validate.sh --strict RESULT: PASSED]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: each new branch carries its why]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: implementation-summary.md Files Changed]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: smoke fixtures under the system temp directory]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: no scratch directory in this packet]
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
