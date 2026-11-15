---
title: "Tasks: Phase 4: Commit-Id in every toolchain repo"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "commit id in every toolchain repo tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: Commit-Id in every toolchain repo

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

- [x] T001 Record the baseline of every hook suite (nine suites, 381 cases, all passing)
- [x] T002 Reproduce the gap on the current stamper: an untrusted clone with the allocator and a repository with ids in its history both stay unstamped
- [x] T003 Probe the source git passes for a continued revert, a squash and a real merge
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the policy helper (`.skilled/scripts/git-hooks/lib/commit-id-policy.sh`)
- [x] T005 Mint through the hooks' own allocator and stamp continued reverts and squashes (`.skilled/scripts/git-hooks/prepare-commit-msg`)
- [x] T006 Refuse a covered message without an id (`.skilled/scripts/git-hooks/commit-msg`)
- [x] T007 Add Gate 7 for pushed commits without an id (`.skilled/scripts/git-hooks/pre-push`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add cases for every policy branch and exempt the fixtures that test other gates (`tests/*.test.sh`)
- [x] T009 Run each new case against the hooks at HEAD to confirm it fails there
- [x] T010 Update the hook, lib and tests READMEs
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [`bash -n` on all four scripts; `shellcheck -S warning` exit 0]
- [x] CHK-011 [P0] No console errors or warnings [suites print only PASS lines]
- [x] CHK-012 [P1] Error handling implemented [missing helper, failed allocator and unreadable range each named]
- [x] CHK-013 [P1] Code follows project patterns [helper shaped like `message-contract-gate.sh`]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [see acceptance-criteria.md]
- [x] CHK-021 [P0] Manual testing complete [policy answer read for 16 local repositories]
- [x] CHK-022 [P1] Edge cases tested [merge, continued revert, squash, command-scope flag]
- [x] CHK-023 [P1] Error scenarios validated [allocator failure, fake push sha]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `class-of-bug`, the trust gate hid every toolchain-owned path the stamper used.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the stamper was the only producer of the id, and merge and squash sources were two more unstamped paths in it.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the contract validator, pre-push Gate 6 and the three READMEs.
- [x] CHK-FIX-004 [P0] Adversarial cases: a clone's allocator that would print and fail never runs, and a command-scope flag never opts in.
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md, five axes.
- [x] CHK-FIX-006 [P1] Hostile env variant: `GIT_CONFIG_COUNT` setting the flag is ignored.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the working tree against HEAD `e07bb13573` for the negative control.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented [the flag is read as a bool from local scope only]
- [x] CHK-032 [P1] Auth/authz working correctly [the trust gate is unchanged]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-13
<!-- /ANCHOR:summary -->

---
