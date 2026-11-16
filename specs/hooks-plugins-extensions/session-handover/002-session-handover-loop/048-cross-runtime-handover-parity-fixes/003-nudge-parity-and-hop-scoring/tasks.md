---
title: "Tasks: Phase 3: nudge-parity-and-hop-scoring"
description: "Ordered tasks for the shared nudge claim, the side-word score and the live Pi and OpenCode hops."
trigger_phrases:
  - "nudge parity and hop scoring tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: nudge-parity-and-hop-scoring

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

`H` is `.skilled/hooks/session-handover`. Briefs live in `../scratch/briefs/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline (`H/tests`). Verify: the suite prints `fail 0` and its test count. Evidence: before any change the handover suite printed `tests 1026`, `fail 0` and the Vibe lifecycle suite `tests 37`, `fail 0`.
- [x] T002 Write the briefs for this phase (`../scratch/briefs/`). Verify: one brief per change. Evidence: `../scratch/briefs/07-shared-nudge-commit.md` to `09-vibe-shared-commit.md`, one change each.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Shared claim and commit (`H/lib/nudge.cjs`). Verify: the race test delivers one nudge and fails with the claim removed. Evidence: `claimNudge` and `commitNudge` in `lib/nudge.cjs`. The race test delivers level 1 once. With the second decision skipped, two tests fail. With the held-claim check removed, four fail across the nudge, Vibe, Claude and Codex suites.
- [x] T004 Claude and Codex commit through the claim (`H/claude/context-nudge.mjs`, `H/codex/shared.mjs`). Verify: a held claim keeps each quiet, and the test fails with the old write restored. Evidence: Claude and Codex deliver through `commitNudge`. With `if (committed === null) return quiet();` removed, the held-claim test fails on each.
- [x] T005 Vibe uses the shared claim (`H/vibe/handover-parts.mjs`). Verify: the existing Vibe claim tests pass unchanged. Evidence: the Vibe adapter's own claim is gone. Its two existing claim tests pass unedited, and removing its null check fails two tests.
- [x] T006 [P] Side-word check (`../scratch/harness/score.cjs`). Verify: a saved 047 run scores the side word as found and absent from the note. Evidence: `score.cjs` on the saved 047 `hard2-vibe` run prints `sideWordStated: true` and `sideWordInNote: false`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the handover and Vibe lifecycle suites from the final state. Verify: `fail 0` above the baseline count. Evidence: handover `tests 1039`, `fail 0`; Vibe lifecycle `tests 37`, `fail 0`.
- [x] T008 Live Pi hop and live OpenCode hop (`../scratch/harness/live-hop.sh`). Verify: `score.cjs` prints `5/5` and the side word is reported and absent from the note. Evidence: `live1-opencode` scored 5/5 with the side word absent from the note and loaded through the lookup. `live3-pi`, on DeepSeek Flash at max thinking after the phase 004 preview fix, scored 5/5 the same way. Earlier Pi runs on GPT-6 Luna low: `live1-pi` leaked the word into the note, and `live2-pi` gave up on JSON previews.
- [x] T009 Fresh Opus medium review of the 048 diff. Verify: no P0 or P1 left open. Evidence: no P0 or P1. Four P2: the Codex retry wording and an overclaiming comment were fixed, a missing-session test was added, and the fallback on a thrown commit is documented as unchanged from before.
- [x] T010 Update the README nudge paragraphs (`H/README.md`). Verify: drift guards pass. Evidence: the README has a paragraph on the shared claim, and the Vibe paragraph points to it; drift guards print `all 4 guards PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the live Pi and OpenCode hops report the side word
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available Evidence: the 047 Vibe claim and its tests are in place on the base commit.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Drift guards pass Evidence: `run-all-drift-guards.sh` prints `all 4 guards PASSED`.
- [x] CHK-011 [P0] No test prints an error Evidence: the handover and Vibe lifecycle suites print `fail 0`.
- [x] CHK-012 [P1] A claim that cannot be made lets the hook deliver as before Evidence: with no state directory, or an open that fails for any reason other than an existing file, the claim returns a no-op release and the hook delivers.
- [x] CHK-013 [P1] Code follows the Claude adapter's shape Evidence: Claude and Codex share one block shape, and Vibe uses the same call.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: every row in `acceptance-criteria.md` is Met.
- [x] CHK-021 [P0] Manual testing complete Evidence: live hops `../scratch/runs/live1-pi` and `live1-opencode` both delivered their nudge and relaunched, 5/5.
- [x] CHK-022 [P1] Edge cases tested: a stale claim, a held claim, a spent level Evidence: tests cover a stale claim taken over, a held claim staying quiet, and a level already spent by the first hook.
- [x] CHK-023 [P1] Error scenarios validated: no state directory Evidence: the no-state-directory path is the existing guard that the Vibe claim tests already exercised.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class Evidence: duplicate nudge: `algorithmic`, a decide-then-write race in shared code.
- [x] CHK-FIX-002 [P0] Same-class producers checked Evidence: every nudge producer that can race now commits through the claim: Claude, Codex and Vibe. Pi and OpenCode deliver from one event loop and do not race.
- [x] CHK-FIX-003 [P0] Consumers checked Evidence: consumers: the stored nudge level read by the next decision, and the rearm floor, both unchanged.
- [x] CHK-FIX-004 [P0] Security or path fix reviewed, or N/A Evidence: the claim path is built from a session id that passes `validSessionId` first, inside the state directory.
- [x] CHK-FIX-005 [P1] Matrix axes named Evidence: axes: runtime (Claude, Codex, Vibe) by claim state (free, held, stale).
- [x] CHK-FIX-006 [P1] Hostile environment considered Evidence: a claim left by a dead hook is taken over after 10 seconds, and a claim that cannot be removed returns null rather than throwing.
- [x] CHK-FIX-007 [P1] Evidence pinned to the feature commit Evidence: evidence is pinned to the phase's feature commit on branch `worktrees/420-cross-runtime-handover-parity-fixes`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets Evidence: no secret in code or tests.
- [x] CHK-031 [P0] Input validation: the session id is checked before it names a claim file Evidence: `claimNudge` checks `validSessionId` before naming the claim file.
- [x] CHK-032 [P1] N/A: no authentication surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files Evidence: spec, plan and tasks name `nudge.cjs`, the three adapters and `score.cjs`.
- [x] CHK-041 [P1] Code comments carry no spec or phase ids Evidence: a grep of the added comment lines for ticket, phase and spec ids finds none.
- [x] CHK-042 [P2] README says Claude, Codex and Vibe share the claim Evidence: the README says Claude, Codex and Vibe share the claim.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned Evidence: only the run folders, the harness and briefs stay in `../scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---
