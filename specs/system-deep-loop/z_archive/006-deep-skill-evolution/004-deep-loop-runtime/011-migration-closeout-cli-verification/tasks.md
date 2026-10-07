---
title: "Tasks: deep-loop MCP→CLI migration closeout + CLI verification (011)"
description: "Reconstructed Level 2 task list for the migration closeout and CLI verification packet, derived from spec.md and git history. Task state was not recorded in those sources."
trigger_phrases:
  - "deep-loop migration closeout tasks"
  - "CLI verification closeout tasks"
  - "MCP remnant deletion tasks"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: deep-loop MCP→CLI migration closeout + CLI verification (011)

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

- [ ] T001 Confirm the verified tool-count ground truth (mk-spec-memory 35, mk_skill_advisor 9, mk_code_index 8, code_mode 7, sequential_thinking 1 = 60 across 5 servers) against `spec.md`
- [ ] T002 Identify the deprecated-MCP remnants (orphan README dirs and the relocated DB copy in the memory server)
- [ ] T003 Confirm the ~18 CLI-exercising playbook scenarios the verification will cover (deep-loop-runtime/07, deep-ai-council/08+09, deep-research graph-stop)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Reconcile the stale tool-count references across the runtime configs and READMEs to the verified ground truth
- [ ] T005 Reconcile the parent arc's child and parent statuses
- [ ] T006 Record the confirmed vitest result (32 files / 228 tests) in `009-verification-changelog-closeout`
- [ ] T007 Delete the orphan README dirs (`handlers/coverage-graph`, `lib/coverage-graph`, `lib/deep-loop`) and the relocated DB copy in the memory server
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run the ~18 CLI-exercising playbook scenarios dynamically via `cli-devin` SWE-1.6 and record the evidence in `cli-verification/`
- [ ] T009 Confirm the deep-loop skills invoke the new `.cjs` CLI and no removed-MCP tool references remain
- [ ] T010 Run `validate.sh --strict` for this folder
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Deliverable passes its structure checks
- [ ] CHK-011 [P0] No unresolved placeholders or scaffold markers
- [ ] CHK-012 [P1] Claims stay within the evidence the packet retained
- [ ] CHK-013 [P1] Documents follow the packet conventions
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual verification complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a recorded finding class
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed where a class exists
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed artifacts
- [ ] CHK-FIX-004 [P0] Boundary fixes include adversarial table cases
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed
- [ ] CHK-FIX-006 [P1] Hostile environment variant executed when process-wide state is read
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fixed revision, not a moving branch range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented where input exists
- [ ] CHK-032 [P1] Authority stays with the destination that owns it
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Document structure and anchors intact
- [ ] CHK-042 [P2] Related documents linked where they exist
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
| P0 Items | Not recorded | Not recorded |
| P1 Items | Not recorded | Not recorded |
| P2 Items | Not recorded | Not recorded |

**Verification Date**: Not recorded
<!-- /ANCHOR:summary -->
