---
title: "Tasks: Let a second copy of the Pi fast-mode extension stand down, so cli-pi runs from a git worktree"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli pi worktree extension clash tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Let a second copy of the Pi fast-mode extension stand down, so cli-pi runs from a git worktree

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

- [x] T001 Reproduce the crash from the worktree and the clean run from the main checkout (`scratch/repro-worktree.txt`, `scratch/repro-main.txt`)
- [x] T002 Read Pi 1.3.0's dedup, conflict, event-bus and session-cwd rules from its installed source
- [x] T003 Provision the extension's dev dependencies in the worktree (`npm ci`) and capture the baselines: extension 77 tests and tsc 0, `fanout-run.vitest.ts`, the deep-loop suite (`scratch/base-*.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 First design, a cwd-based project-copy check (DeepSeek, briefs t1 to t3). Withdrawn after Luna's round-1 P1 and reverted to HEAD
- [x] T005 `claimPackage` and the early return in the factory (`src/index.ts`, DeepSeek brief t4)
- [x] T006 A synchronous fake bus in both test fakes and three second-copy tests (`tests/extension.test.ts`, `tests/precedence.test.ts`, DeepSeek brief t5)
- [x] T007 Test README count and coverage row (`tests/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Live runs through the real cli-pi builder (`scratch/pi-builder-smoke.cjs`, `scratch/smoke-*.json`)
- [x] T009 The same-bus test fails on the pre-change `index.ts` (1 failed, 11 passed in `extension.test.ts`)
- [x] T010 Luna review round 2 PASS, extension tests and typecheck, deep-loop suite against baseline
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` §4
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` §3
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: `plan.md` §6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `npx tsc --noEmit` exit 0 (`scratch/after-ext.txt`)
- [x] CHK-011 [P0] No console errors or warnings. Evidence: live run 2 stderr holds only the advisor status line
- [x] CHK-012 [P1] Error handling implemented. Evidence: the listener ignores a non-object payload
- [x] CHK-013 [P1] Code follows project patterns. Evidence: section layout and comment style of `src/index.ts` kept
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing complete. Evidence: `scratch/smoke-*.json`
- [x] CHK-022 [P1] Edge cases tested. Evidence: separate-bus and cleared-bus tests
- [x] CHK-023 [P1] Error scenarios validated. Evidence: run 3 control with an unfixed copy exits 1
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug` (any duplicated extension with a flag), fixed for the one repo package that has a user-scope twin.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `ls ~/.pi/agent/extensions` shows one repo package with a project twin.
- [x] CHK-FIX-003 [P0] Consumer inventory: `claimPackage` and `COPY_CLAIM_CHANNEL` are used only in `src/index.ts`; `fanout-run.cjs` is unchanged.
- [x] CHK-FIX-004 [P0] Not a security, path, parser or redaction fix: the check reads no path and parses nothing.
- [x] CHK-FIX-005 [P1] Matrix axes and rows listed in `plan.md` Fix Addendum: six rows, all run.
- [x] CHK-FIX-006 [P1] Hostile global state: a cleared bus (stale load) and an unfixed second copy both run.
- [x] CHK-FIX-007 [P1] Evidence pinned to the change commit named in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the smoke driver never prints the environment
- [x] CHK-031 [P0] Input validation implemented. Evidence: the listener checks the payload is an object
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: not applicable, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: all three describe the claim design
- [x] CHK-041 [P1] Code comments adequate. Evidence: one comment on `claimPackage` gives the reason
- [x] CHK-042 [P2] README updated (if applicable). Evidence: `tests/README.md` count and row
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the overlay and fixed copy live in the session scratchpad, outside the repo
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: scratch keeps only the cited evidence and the smoke driver
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-19
<!-- /ANCHOR:summary -->

---



