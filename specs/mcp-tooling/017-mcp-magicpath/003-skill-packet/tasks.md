---
title: "Tasks: The mcp-magicpath mode packet"
description: "Ordered work for authoring the MagicPath mode packet in the hub-member shape."
trigger_phrases:
  - "mcp-magicpath packet tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: The mcp-magicpath mode packet

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

- [ ] T001 Enumerate a sibling packet's real file set as the hub-member shape to match
- [ ] T002 Name the root-level metadata files forbidden at a mode sublevel, from the contract rather than from memory
- [ ] T003 [P] Capture the registered tool list from the phase 002 configuration as the catalog's only source
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author the entry contract, stating when to route here and when not to (`.opencode/skills/mcp-tooling/mcp-magicpath/SKILL.md`)
- [ ] T005 Author the packet readme (`.opencode/skills/mcp-tooling/mcp-magicpath/README.md`)
- [ ] T006 Author the references: command surface, credential setup, mutation boundary
- [ ] T007 [P] Document the registered manual as an asset
- [ ] T008 Author one catalog entry per registered tool
- [ ] T009 [P] Write the first changelog entry
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the create-skill packaging gate and record its result
- [ ] T011 Reconcile every catalog entry against the registration, and remove any that has no registered tool
- [ ] T012 [P] Confirm the packet carries no root-level metadata file
- [ ] T013 Confirm the packet names no capability the registration does not provide
- [ ] T014 Confirm nothing outside the packet directory changed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The packet passes its gate and documents only what phase 002 registered
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:protocol -->
## Verification Checklist

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
- [ ] CHK-003 [P0] The hub-member shape is confirmed against a sibling, not assumed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The packet carries no metadata file reserved for a hub root
- [ ] CHK-011 [P0] Every documented tool exists in the registration
- [ ] CHK-012 [P1] The entry contract names the cases this route does not serve
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria in spec.md are met
- [ ] CHK-021 [P0] The packaging gate reports the packet clean
- [ ] CHK-022 [P1] The catalog is reconciled entry by entry against the registration
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Nothing outside the packet directory changed
- [ ] CHK-FIX-002 [P1] No document quotes the vendor readme in place of the registration
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No credential value appears in any document or example
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [ ] CHK-041 [P1] The credential path is documented where an operator will meet it
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
| P0 Items | 9 | 0/9 |
| P1 Items | 7 | 0/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
