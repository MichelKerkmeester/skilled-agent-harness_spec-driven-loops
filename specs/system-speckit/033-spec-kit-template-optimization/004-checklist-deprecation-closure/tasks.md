---
title: "Tasks: Checklist Deprecation Closure"
description: "A present-file rule that checks a goal document's shape: its durable and log headings, a binding block on phase parents, listed child paths that exist, and a durable slice within its character budget."
trigger_phrases:
  - "goal validator"
  - "durable slice cap"
  - "binding block check"
  - "child path existence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped the canonical evidence read, the source precedence and the unit suite"
    next_safe_action: "Validate the packet and close it out"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-033-004-checklist-deprecation-closure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The cap applies to the durable slice only; a progress log is not a defect"
---

# Tasks: Checklist Deprecation Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Read where the total is counted from and where the evidence was read from - `scripts/rules/check-ac-coverage.sh:125` counts canonical rows while the evidence read scanned a separate table
- [x] T002 Read the merge that deprecated the standalone checklist and what it claimed to ship - `specs/system-speckit/036-spec-doc-template-reduction/002-tasks-checklist-merge/implementation-summary.md` says the merged document is preferred
- [x] T003 Capture the reported ratio before the change as the negative control - four packet-042 phases each reported `0/5 ACs have evidence; floor 5/5`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Read evidence from the canonical document's Verification column, columns bound by header - `_ac_analyze_canonical` in `scripts/rules/check-ac-coverage.sh:179`
- [x] T005 Exempt a retired criterion from citation, since its decision record carries it - Status matching waived or superseded counts as covered (`scripts/rules/check-ac-coverage.sh:220`)
- [x] T006 Prefer the merged tasks document over the pre-merge checklist - `_ac_traceability_file` in `scripts/rules/check-ac-coverage.sh:72`
- [x] T007 Activate the gate on the canonical document alone - `_ac_lifecycle_active` in `scripts/rules/check-ac-coverage.sh:50`
- [x] T008 Make the remediation name the cell an author must actually edit - canonical branch in `scripts/rules/check-ac-coverage.sh:350`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Write the rule's first unit suite, pinning the ratio rather than the severity - `scripts/tests/check-ac-coverage.sh` 14/14
- [x] T010 Confirm the negative control still scores zero after the fix - prose-only verification reports `0/2` (`scripts/tests/check-ac-coverage.sh:64`)
- [x] T011 Confirm a pre-merge packet resolves to the source it always did - `scripts/tests/check-ac-coverage.sh:125` returns `checklist.md`
- [x] T012 Confirm the live symptom is gone - four packet-042 phases now report `5/5 ACs have evidence`
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
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Parent spec**: See `../spec.md`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
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
| P0 Items | 0 | 0/0 |
| P1 Items | 0 | 0/0 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not yet
<!-- /ANCHOR:summary -->

---



