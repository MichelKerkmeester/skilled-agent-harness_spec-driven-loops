---
title: "Tasks: Phase 6: evidence-gated-provenance"
description: "The task list for Phase 6: evidence-gated-provenance, each task naming its file. Every task is open because the phase is planned, not built."
trigger_phrases:
  - "evidence gated provenance tasks"
  - "template version stamping tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: evidence-gated-provenance

<!-- SPECKIT_LEVEL: 2 -->

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

- [ ] T001 Trace matchesSignature logic in heal-spec-docs.cjs (around line 80) and understand superset checking
- [ ] T002 Trace the --auto-upgrade branch in check-template-staleness.sh (lines 171-186) and its caller in quality-audit.sh (lines 148-153)
- [ ] T003 [P] Review MIGRATION.md line 24 and understand the never-invent-history rule
- [ ] T004 Confirm no other in-repo caller: `rg -n "auto-upgrade" . --glob '!specs/**'`
- [ ] T014 [P] Locate the renderer that yields a level's anchor set (the validator's `renderedTemplate`) for the healer to reuse
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Retire or restrict decided 2026-10-08 by the operator: retire, with a one-release loud failure
- [ ] T006 Change matchesSignature to exact equality against the anchor set rendered for the document's level (.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs)
- [ ] T007 Replace the --auto-upgrade branch with a message "removed, use upgrade-legacy" and exit 2 (.skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh)
- [ ] T015 Remove the dead --fix branch, or point it at upgrade-legacy (.skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh)
- [ ] T008 [P] State the never-invent-history rule. Add no marker for unknown provenance (.skilled/skills/system-spec-kit/templates/MIGRATION.md)
- [ ] T009 Add tests: exact level match stamps, superset and subset do not, --auto-upgrade exits 2 and writes nothing
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run Vitest for heal-spec-docs signature matching tests
- [ ] T011 Run `validate.sh --strict` on this spec packet
- [ ] T012 Grep for every writer of SPECKIT_TEMPLATE_SOURCE and verify none stamps without an exact level match
- [ ] T013 Manual check: trace one markerless and one old-marker document through heal-spec-docs and verify neither gets a marker
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] validate.sh --strict shows no failures
- [ ] Tests pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: Section 8.5 and Section 11 recommendation SH-06 of ../../014-spec-auto-healing-research/research/research.md
<!-- /ANCHOR:cross-refs -->

---

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Code paths in heal-spec-docs.cjs, check-template-staleness.sh and quality-audit.sh traced
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes linter
- [ ] CHK-011 [P0] No new console.log or debug statements left in
- [ ] CHK-012 [P1] Changes follow existing code style
- [ ] CHK-013 [P1] Test additions use Vitest or Bash patterns from existing tests
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md)
- [ ] CHK-021 [P0] Level match tests pass (exact, superset and subset cases)
- [ ] CHK-022 [P1] Retired-flag test passes (message, exit 2, no write)
- [ ] CHK-023 [P1] All document types (spec, plan, tasks, impl-summary) tested
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Finding class: class-of-bug (two header writers stamp without exact evidence)
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: rg for SPECKIT_TEMPLATE_SOURCE writers
- [ ] CHK-FIX-003 [P0] Consumer inventory: quality-audit.sh, tests, upgrade-legacy.mjs
- [ ] CHK-FIX-004 [P0] Not a security fix, no adversarial cases needed
- [ ] CHK-FIX-007 [P1] Evidence pinned: heal-spec-docs.cjs line 80, check-template-staleness.sh line 181, MIGRATION.md line 24
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Inline code comments explain why the comparison uses the level's rendered anchor set
- [ ] CHK-042 [P2] MIGRATION.md clearly states policy
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | [ ]/7 |
| P1 Items | 10 | [ ]/10 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: 2026-10-08
<!-- /ANCHOR:summary -->

---

