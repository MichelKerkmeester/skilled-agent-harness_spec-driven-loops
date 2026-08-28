---
title: "Tasks: Host configuration cutover"
description: "Ordered work for repointing six host configurations and proving every server still attaches."
trigger_phrases:
  - "mcp cutover tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Host configuration cutover

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

- [ ] T001 Record the attach behavior of all nineteen registrations as the pre-change baseline
- [ ] T002 Record the revert for each of the six files before editing any of them
- [ ] T003 [P] Confirm the launcher is executable from a working directory other than the repository root
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Repoint the code_mode registration at the launcher (`.mcp.json`)
- [ ] T005 [P] Repoint the code_mode registration at the launcher (`.claude/mcp.json`)
- [ ] T006 [P] Repoint the code_mode registration at the launcher (`.cursor/mcp.json`)
- [ ] T007 [P] Repoint the code_mode registration at the launcher (`.pi/mcp.json`)
- [ ] T008 [P] Repoint the code_mode registration at the launcher (`opencode.json`)
- [ ] T009 Repoint code_mode and normalize the memory and advisor interpreters (`.codex/config.toml`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Parse all six files and confirm each is still valid to its host
- [ ] T011 Exercise every registration with an initialize request through its configured command
- [ ] T012 Scan the six files for absolute interpreter paths and confirm none remain
- [ ] T013 Restart the hosts available here and confirm the servers attach from a cold start rather than an existing session
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every registration attaches and no configuration names an absolute interpreter
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
- [ ] CHK-003 [P1] The attach behavior of all nineteen registrations is recorded as the pre-change baseline
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each edited file still parses under its host's format
- [ ] CHK-011 [P0] Only the interpreter or fronting command changed in each registration
- [ ] CHK-012 [P1] The two unconstrained servers are declared identically across all six files
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria in spec.md are met
- [ ] CHK-021 [P0] Every registration responds to an initialize request through its configured command
- [ ] CHK-022 [P1] Servers attach from a cold host restart, not from an already-attached session
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] A scan of the six files finds no absolute interpreter path
- [ ] CHK-FIX-002 [P0] The revert for each file was recorded before any edit landed
- [ ] CHK-FIX-003 [P1] Evidence is pinned to the commit that shipped this phase, not a moving range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No configuration gained an environment value it did not previously carry
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [ ] CHK-041 [P1] The parent phase map records this phase as the first with live effect
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
