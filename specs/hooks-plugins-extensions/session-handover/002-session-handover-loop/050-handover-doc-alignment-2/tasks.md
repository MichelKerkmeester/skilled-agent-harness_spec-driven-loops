---
title: "Tasks: Hand-over doc alignment, second pass: fix the 50 findings of the full 86-doc check"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "handover doc alignment 2 tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Hand-over doc alignment, second pass: fix the 50 findings of the full 86-doc check

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the doc alignment on session-handover with six lanes from a checkout of origin/main (`/local-doc-alignment session-handover --lane-count=6`). Verify: `aggregate-findings.cjs` prints `findings=50 P0=4 P1=13 P2=33`.
- [x] T002 Create the worktree and this packet (`worktrees/431-handover-doc-alignment-2`). Verify: `git worktree list` shows 431.
- [x] T003 Write five fix briefs grouped by doc area (G1 to G5). Verify: the briefs hold 15, 10, 8, 14 and 3 findings.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the five briefs on DeepSeek V4.1 Flash max one at a time. Verify: each lane prints `ok`, 24 docs change, and only L6-1 to L6-5 come back as already fixed.
- [x] T005 Confirm the five root README findings are gone on main. Verify: `grep -c -i "history-lookup\|compiled helper\|Use it for a detail" README.md` prints 0.
- [x] T006 Commit and merge main. Verify: commit `2b2d5a089c8`, merge `237bcc36854` with no conflict.
- [x] T007 Review every changed line with a fresh Opus medium agent. Verify: it reports no P0 or P1, all 50 findings addressed, and 7 P2.
- [x] T008 Apply the seven review fixes through DeepSeek (G6). Verify: lane prints `ok` with none left unapplied; commit `10ec30a0f97`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the hand-over suites on the final tree. Verify: 1045 of 1045 and OpenCode plugin 75 of 75.
- [x] T010 Run the drift guards and the hook registration check. Verify: all 4 guards pass and registrations are in sync.
- [x] T011 Validate this packet. Verify: `validate.sh <packet> --strict` prints `RESULT: PASSED`.
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

- [x] CHK-010 [P0] Code passes lint/format checks: N/A, no code changed; the diff has no em dash
- [x] CHK-011 [P0] No console errors or warnings: the suites print `fail 0`
- [x] CHK-012 [P1] Error handling implemented: N/A, docs only
- [x] CHK-013 [P1] Code follows project patterns: each doc keeps its structure and voice
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: the Opus review read every changed line against the code
- [x] CHK-022 [P1] Edge cases tested: the CL-6 and CX-4 probes ran in a sandbox with eleven PASS lines each
- [x] CHK-023 [P1] Error scenarios validated: `opencode --help` (2.3.0) lists no `-m`, so the edited quick start runs
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: all are `instance-only` doc statements.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the review searched for other copies of each fixed claim and found the three hooks README sentences and the runtime table cell, fixed in G6.
- [x] CHK-FIX-003 [P0] Consumer inventory completed: N/A, no code symbol changed.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial cases: N/A, no such fix in this packet.
- [x] CHK-FIX-005 [P1] Matrix axes listed: runtime by claim (arm event, model carry, withdraw, command name).
- [x] CHK-FIX-006 [P1] Hostile env variant executed: N/A, docs only.
- [x] CHK-FIX-007 [P1] Evidence pinned to commits `2b2d5a089c8` and `10ec30a0f97`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented: N/A, docs only
- [x] CHK-032 [P1] Auth/authz working correctly: N/A, no auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: N/A, no code changed
- [x] CHK-042 [P2] README updated: hand-over, bin, hooks and runtime READMEs
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only: briefs and lane output live in the session scratchpad
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-16
<!-- /ANCHOR:summary -->

---
