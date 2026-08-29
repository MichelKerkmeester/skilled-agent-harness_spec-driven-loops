---
title: "Tasks: Hub integration for mcp-magicpath"
description: "Ordered work for routing the MagicPath mode through the mcp-tooling hub."
trigger_phrases:
  - "hub integration tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Hub integration for mcp-magicpath

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

- [ ] T001 Re-read the mutating-family decision from the live registration rather than from the phase 002 summary
- [ ] T002 Answer the axis question: transport, workflow, or a stated widening scoped to this mode
- [ ] T003 [P] Identify the generator that owns the leaf manifest, and confirm the manifest is never authored by hand
- [ ] T004 [P] Record the fleet audit's result before the change, as the baseline
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add exactly one mode entry (`.opencode/skills/mcp-tooling/mode-registry.json`)
- [ ] T006 Declare a backend value that distinguishes a CLI reached through Code Mode from the existing backends
- [ ] T007 Declare the tool surface and mutation posture to match what the registration permits
- [ ] T008 Bind the route (`.opencode/skills/mcp-tooling/hub-router.json`)
- [ ] T009 Regenerate the leaf manifest with its own tool
- [ ] T010 [P] Add the member to the hub readme and router prose
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run the fleet metadata audit and compare against the baseline
- [ ] T012 Observe a MagicPath request resolving to the mode through the hub
- [ ] T013 Exercise a sibling mode's routing, since a registry edit breaks neighbours before it breaks the new entry
- [ ] T014 Confirm the registry diff shows one added entry and no edits to existing ones
- [ ] T015 [P] Confirm the declared posture is true of every registered tool
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The hub routes to the mode and the audit passes with the manifest regenerated
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
- [ ] CHK-003 [P0] The axis question is answered before the entry is written
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The declared mutation posture is true of the registered surface
- [ ] CHK-011 [P0] The leaf manifest is generated, not hand-edited
- [ ] CHK-012 [P1] The backend value describes what actually runs
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria in spec.md are met
- [ ] CHK-021 [P0] The fleet metadata audit passes with the member present
- [ ] CHK-022 [P0] A real request is observed resolving to the mode
- [ ] CHK-023 [P1] Sibling routing still resolves after the change
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Exactly one registry entry was added and none edited
- [ ] CHK-FIX-002 [P1] Any axis widening is stated, scoped to this mode, and not applied silently
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P1] The tool surface grants no capability the packet does not document
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [ ] CHK-041 [P1] Hub prose names the member alongside its siblings
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
| P0 Items | 10 | 0/10 |
| P1 Items | 7 | 0/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
