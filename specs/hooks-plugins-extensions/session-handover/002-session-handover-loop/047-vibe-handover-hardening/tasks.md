---
title: "Tasks: Phase 47: vibe-handover-hardening"
description: "Ordered tasks for the eight Vibe hand-over fixes, each built by one Vibe CLI brief on deepseek-flash and checked by its own test and a mutation check."
trigger_phrases:
  - "vibe handover hardening tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 47: vibe-handover-hardening

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

`H` is `.skilled/hooks/session-handover`. `L` is `.skilled/hooks/session-lifecycle/vibe`. Briefs live in `scratch/briefs/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline (`H/tests`, `L`). Verify: the two suites print `tests 1009 ... fail 0` and `tests 34 ... fail 0`.
- [x] T002 Save and check the read-only analysis (`scratch/analysis.md`, `scratch/analysis-verification.md`). Verify: the checked citations resolve, as the verification file lists.
- [x] T003 Write one Vibe build brief per change (`scratch/briefs/01` to `14`). Verify: `ls scratch/briefs` lists 14 briefs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Stop-now prepare message for an armable Vibe session (`H/bin/session-handover.cjs`, brief 01). Verify: the new CLI test passes and fails with the condition reverted.
- [x] T005 [P] Withdraw first at turn start (`H/vibe/handover-parts.mjs`, `L/turn-start.mjs`, brief 02). Verify: the ordering and early-withdraw tests fail with the part removed.
- [x] T006 [P] Wrapper key warning (`.skilled/bin/skilled-loop`, brief 03). Verify: the warning test fails with the runtime check removed.
- [x] T007 [P] Compaction parity (`L/compaction-context.mjs`, brief 04). Verify: each of the three new assertions fails with its line removed.
- [x] T008 Deferred mark on a failed arm (`H/vibe/handover-parts.mjs`, brief 05). Verify: the deferred tests fail with the mark or the policy reverted.
- [x] T009 Fork and rewind keep the hand-over (`H/vibe/handover-parts.mjs`, brief 06). Verify: the fork test fails with the old subagent check restored.
- [x] T010 [P] Killer folder watch (`H/lib/killer.cjs`, brief 07) and adapter folder hand-off (brief 08). Verify: the killer and adapter tests fail with each reverted.
- [x] T011 Nudge claim (`H/vibe/handover-parts.mjs`, brief 09). Verify: the claim and re-decision tests fail with each check removed.
- [x] T012 Session id for a typed hand-over (`H/lib/relaunch-core.cjs`, `H/vibe/handover-parts.mjs`, `H/bin/session-handover.cjs`, `.skilled/commands/speckit/handoff.md`, briefs 10 and 11). Verify: the record and fallback tests fail with each reverted.
- [x] T013 Review fixes (briefs 12 to 14, docs by the orchestrator). Verify: each new test fails with its line reverted.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Run both suites from the final state (`H/tests`, `L`). Verify: `tests 1025 pass 1025 fail 0` and `tests 37 pass 37 fail 0`.
- [x] T015 Fresh Opus medium review of the diff. Verify: no P0 or P1; the seven P2 findings are fixed or recorded.
- [x] T016 Live Vibe hop on the operator's plan (`scratch/harness/live-hop.sh`). Verify: `score.cjs` prints `5/5`.
- [x] T017 Update the docs (`H/README.md`, `.skilled/commands/speckit/handoff.md`). Verify: drift guards print `all 4 guards PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the live hop scored 5/5
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: `vibe --version` prints 3.1.2 and the keychain holds the plan key
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Drift guards pass: `run-all-drift-guards.sh` prints `all 4 guards PASSED`
- [x] CHK-011 [P0] No test prints an error: both suites print `fail 0`
- [x] CHK-012 [P1] Every new step logs and never blocks the Vibe turn: each new adapter step sits in a try/catch that logs
- [x] CHK-013 [P1] Code follows project patterns: the deferred mark and compaction parity copy the Claude adapter's shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met, as `acceptance-criteria.md` records
- [x] CHK-021 [P0] Manual testing complete: two live hops, `scratch/runs/hard1-vibe` and `hard2-vibe`
- [x] CHK-022 [P1] Edge cases tested: made-up id, missing journal, missing transcript path, stale claim, removed segment
- [x] CHK-023 [P1] Error scenarios validated: each failed-arm branch marks the record deferred
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class: F1, F3, F5, F9 `instance-only`; F2, F7 `cross-consumer` (shared killer and withdraw helper); F4, F6 `algorithmic`.
- [x] CHK-FIX-002 [P0] Same-class producers checked: `rg -n "nothing ends this session"` finds only the Cursor and Devin route besides the changed Vibe line.
- [x] CHK-FIX-003 [P0] Consumers checked: the killer is spawned with a file by Claude, Codex and Pi, so only the Vibe folder path takes the new branch.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix.
- [x] CHK-FIX-005 [P1] Matrix axes: runtime (vibe, cursor, devin, claude) by session folder (present, absent) for the prepare message, four rows tested.
- [x] CHK-FIX-006 [P1] Hostile environment: the key-warning test runs with and without `MISTRAL_API_KEY` and `VIBE_CLI_OIDC_ENABLED`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the phase's feature commit on its worktree branch.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: the key-warning test uses a placeholder, and no key value appears in any brief
- [x] CHK-031 [P0] Input validation: the recorded session id must match `^[A-Za-z0-9._-]+$` and the loop id goes through `validLoopId`
- [x] CHK-032 [P1] N/A: no authentication surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files and fixes
- [x] CHK-041 [P1] Code comments carry the why and no spec or finding ids: `git diff | grep '^+' | grep -E 'F[0-9]|REQ-|047'` prints nothing
- [x] CHK-042 [P2] README updated with a Vibe paragraph and the `session-id` route
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned: the stray hook state folder is removed and the live-run Vibe homes are backed up outside the checkout
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---
