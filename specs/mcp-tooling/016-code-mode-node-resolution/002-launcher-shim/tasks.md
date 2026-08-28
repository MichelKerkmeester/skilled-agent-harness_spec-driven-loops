---
title: "Tasks: code_mode launcher shim"
description: "Ordered work for building the launcher and proving it preserves protocol behavior and process identity."
trigger_phrases:
  - "code mode launcher tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: code_mode launcher shim

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

- [ ] T001 Capture the initialize response from a direct launch under the pinned interpreter, as the comparison baseline
- [ ] T002 Record the exact cleanup and sweeper matcher patterns so the identity test asserts against the shipped ones
- [ ] T003 [P] Confirm the repository-root resolution used by the two existing launchers, and reuse it
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Locate the server manifest and entrypoint from the launcher's own position (`.opencode/bin/mcp-code-mode-launcher.cjs`)
- [ ] T005 Ask the resolver for an interpreter and exit non-zero with the required range when none satisfies (`.opencode/bin/mcp-code-mode-launcher.cjs`)
- [ ] T006 Start the server with the resolved interpreter and the entrypoint path, keeping that path in the command line (`.opencode/bin/mcp-code-mode-launcher.cjs`)
- [ ] T007 Wire standard streams straight through so the protocol stream is unmodified (`.opencode/bin/mcp-code-mode-launcher.cjs`)
- [ ] T008 Pass the server's exit status and termination signals back to the host (`.opencode/bin/mcp-code-mode-launcher.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Assert the launcher's initialize response matches the captured direct-launch baseline (`.opencode/bin/mcp-code-mode-launcher.test.cjs`)
- [ ] T010 Assert the shipped cleanup matcher classifies a launcher-started command line (`.opencode/bin/mcp-code-mode-launcher.test.cjs`)
- [ ] T011 Assert a forced-unsatisfiable range exits non-zero, names the range, and starts no server (`.opencode/bin/mcp-code-mode-launcher.test.cjs`)
- [ ] T012 Assert a terminated server returns its own exit status through the launcher (`.opencode/bin/mcp-code-mode-launcher.test.cjs`)
- [ ] T013 Run the workspace node gate and confirm the new tests are collected and green
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] The launcher is proven equivalent to the direct launch and visible to the cleanup matchers
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
- [ ] CHK-003 [P1] The direct-launch initialize response is captured as the comparison baseline
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The launcher hands off rather than supervising, so no process layer is added beneath the server
- [ ] CHK-011 [P0] Standard streams pass through unmodified
- [ ] CHK-012 [P1] Refusal names the required range and the candidates rejected
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria in spec.md are met
- [ ] CHK-021 [P0] The launcher's initialize response matches the captured direct-launch baseline
- [ ] CHK-022 [P1] A terminated server returns its own exit status through the launcher
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] The shipped cleanup matcher classifies a launcher-started command line
- [ ] CHK-FIX-002 [P0] A forced-unsatisfiable range starts no server, asserted as absence rather than as a caught error
- [ ] CHK-FIX-003 [P1] Evidence is pinned to the commit that shipped this phase, not a moving range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] The launcher passes no new environment or arguments to the server beyond what the host supplied
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks stay synchronized with what shipped
- [ ] CHK-041 [P1] The refusal message is quoted in the phase summary so its wording is reviewable
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
