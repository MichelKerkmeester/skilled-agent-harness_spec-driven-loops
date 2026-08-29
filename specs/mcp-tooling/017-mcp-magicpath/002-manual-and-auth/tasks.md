---
title: "Tasks: MagicPath manual and authentication"
description: "Ordered work for registering the MagicPath command surface and resolving its credential."
trigger_phrases:
  - "magicpath manual tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: MagicPath manual and authentication

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

- [x] T001 Capture the installed build's authoritative command surface — evidence: `magicpath-ai --help` on 2.6.1 lists 25 commands; `info -o json` claims 22 and omits `create-project` and `skills`, so `--help` is authoritative and `info` carries a stale list
- [x] T002 Settle the version question — evidence: `npm install -g magicpath-ai@latest` moved 2.3.2 to 2.6.1 (75 packages changed); the bridge re-read it with no re-registration, returning `version_through_bridge 2.6.1`; rollback is `npm install -g magicpath-ai@2.3.2`
- [ ] T003 [P] Read the secret-resolution convention from a registered manual that already uses it
- [ ] T004 [P] Record the machine's starting authentication state, so a later credentialed result is a change rather than a coincidence
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Declare the read-only tools in `.utcp_config.json`, each requesting structured output
- [ ] T006 Confirm every declared command appears in the installed build's command list
- [ ] T007 Act on the mutating-family decision, and record the reason in the phase summary
- [ ] T008 Express the mutation boundary so a reader of the config can see it without consulting prose
- [ ] T009 Reference the token through the established convention, resolved at call time
- [ ] T010 [P] Record the variable name and where to obtain it in `.env.example`, never its value
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Call a read-only tool without a credential and record the failure verbatim
- [ ] T012 Call the same tool with a credential and confirm it returns real account data
- [ ] T013 [P] Confirm `selection` and `active-project` behave sanely with no browser session open
- [ ] T014 Scan the working tree and the diff for any token value before close
- [ ] T015 Confirm the config parses and the manuals this packet did not touch are unchanged
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] A read-only tool returns real data with a credential and names what is missing without one
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
- [ ] CHK-003 [P0] The authoritative command list comes from the installed build
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No declared tool names a command the installed build lacks
- [ ] CHK-011 [P0] The mutation boundary is readable from the config alone
- [ ] CHK-012 [P1] Structured output is requested wherever the CLI supports it
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria in spec.md are met
- [ ] CHK-021 [P0] Both credential states are exercised and recorded
- [ ] CHK-022 [P1] A mutating tool, if registered, is exercised against a disposable target
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The manuals this packet did not touch are unchanged
- [ ] CHK-FIX-002 [P1] The phase 001 probe is promoted or gone, not orphaned
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] No token value appears in any tracked file or in the diff
- [ ] CHK-032 [P1] Any remote state created while testing a mutating tool is removed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [ ] CHK-041 [P1] The credential setup an operator must perform is written down
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
| P1 Items | 8 | 0/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
