---
title: "Tasks: Installers, guides and diagnosis"
description: "Ordered work for making the portable registration survive installation and surfacing an unsatisfiable host."
trigger_phrases:
  - "code mode install tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Installers, guides and diagnosis

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

- [ ] T001 Run each installer against a scratch configuration and record what it writes today
- [ ] T002 Confirm the resolver reports the declared range alongside an absent answer, so the diagnosis can quote it
- [ ] T003 [P] Read the diagnostic route's MCP target and locate where a per-server check belongs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Emit the launcher-based registration (`.opencode/skills/mcp-code-mode/scripts/install.sh`)
- [ ] T005 [P] Emit the launcher-based registration (`.opencode/install-guides/install-scripts/install-code-mode.sh`)
- [ ] T006 Add a check that asks the resolver whether this host satisfies the declared range (`.opencode/commands/doctor/mcp.md`)
- [ ] T007 [P] State the supported range and the refusal behavior (`.opencode/install-guides/MCP - Code Mode.md`)
- [ ] T008 [P] State the supported range and the refusal behavior (`.opencode/skills/mcp-code-mode/INSTALL-GUIDE.md`)
- [ ] T009 Replace the restated path with the constraint and its consequence (`.opencode/skills/sk-code/sk-code-opencode/assets/checklists/mcp-server-authoring.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Re-run each installer against a scratch configuration and confirm no absolute interpreter path is written
- [ ] T011 Force the range unsatisfiable and confirm the diagnosis reports the gap rather than health
- [ ] T012 Scan the changed installers, guides and checklist for absolute interpreter paths and confirm none remain
- [ ] T013 Validate the changed markdown against its document type
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] A fresh install is portable and an unsatisfiable host is reported before a tool call finds it
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
- [ ] CHK-003 [P1] Each installer's current output is captured by running it against a scratch configuration
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The diagnosis reads the declared range through the resolver rather than restating a version
- [ ] CHK-011 [P0] Installers emit the same registration shape the cutover established
- [ ] CHK-012 [P1] No document names an absolute interpreter path for this server
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria in spec.md are met
- [ ] CHK-021 [P0] Each installer, re-run against a scratch configuration, writes no absolute interpreter path
- [ ] CHK-022 [P1] A forced-unsatisfiable range makes the diagnosis report the gap rather than health
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every installer was executed, not only edited
- [ ] CHK-FIX-002 [P0] The changed markdown validates against its document type
- [ ] CHK-FIX-003 [P1] Evidence is pinned to the commit that shipped this phase, not a moving range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Scratch configurations used for installer runs are removed afterwards
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [ ] CHK-041 [P1] Both guides state the supported range and the refusal behavior
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
| P0 Items | 8 | 0/8 |
| P1 Items | 7 | 0/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
