---
title: "Tasks: Vibe sender history lookup at claim"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe history locator tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Vibe sender history lookup at claim

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

`H` is `.skilled/hooks/session-handover`. `G` is `HOOKDIR=session-handover bash ../044-in-session-handover-rename/scratch/gate.sh`, run from this packet's parent.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the gate baseline in the worktree (`scratch/gate-baseline.txt`). Verify: `G` exits 0 and the file lists the relaunch, Vibe and tsc counts.
- [x] T002 Write one short brief per change for the builder (`scratch/briefs/`). Verify: `ls scratch/briefs` lists the briefs and the dispatch script.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the Vibe session folder and recorded working folder to the mint (`H/lib/relaunch-core.cjs`). Verify: the Measured Behavior probe prints a locator and a section.
- [x] T004 Add Vibe claim tests: section printed, printed command redeems, another checkout and a missing folder give none (`H/tests/session-handover-cli.test.cjs`). Verify: `node --test H/tests/session-handover-cli.test.cjs` passes with the new tests.
- [x] T005 Name Vibe among the senders that get a locator (`H/README.md` and the docs that list them). Verify: `rg -n 'Only Claude Code and Codex senders' .skilled` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Rerun the gate from the final state (`scratch/gate-final.txt`). Verify: `G` exits 0 and every count is the baseline or above.
- [x] T007 Review the diff with a fresh Opus medium agent (`scratch/review.md`). Verify: the review lists no P0 or P1 finding left open.
- [x] T008 Run one live Vibe hop and redeem the printed lookup in the receiver (`scratch/runs/`). Verify: the receiver's claim output holds `## History Lookup` and the lookup it runs exits 0 with the sender's turns.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The live hop's receiver redeemed the printed lookup
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 5
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -n 'vibeSessionFolder' plan.md` prints a line
- [x] CHK-003 [P1] The history lookup phase 007 is on main: `git log --oneline main | rg -c 'offer the handoff history lookup only when it can answer'` prints 1
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check H/lib/relaunch-core.cjs` exits 0
- [x] CHK-011 [P0] No code comment names a spec path, phase or task id: `rg -n '046|specs/' H/lib/relaunch-core.cjs` prints no new line
- [x] CHK-012 [P1] Every Vibe failure returns null inside the mint's existing catch
- [x] CHK-013 [P1] The path is built the way `storeRootFor` builds it
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is Met
- [x] CHK-021 [P0] The live hop is recorded under `scratch/runs/`
- [x] CHK-022 [P1] The other-checkout and missing-folder cases are tested
- [x] CHK-023 [P1] A `meta.json` that is not JSON gives no section
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The change reads no credential and writes no dotenv file
- [x] CHK-031 [P0] A session id outside `[A-Za-z0-9._-]` builds no path
- [x] CHK-032 [P1] A Vibe folder recorded in another checkout writes no hook state
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec, plan and tasks name the same two helpers
- [x] CHK-041 [P1] The new helpers carry a WHY comment with no ephemeral ids
- [x] CHK-042 [P2] The handover README names Vibe senders
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Briefs, gate output and run logs live in `scratch/`
- [x] CHK-051 [P1] No temporary Vibe home is left outside `scratch/` after the live hop
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---
