---
title: "Tasks: Phase 1: pi-opencode-history-lookup"
description: "Ordered tasks for the Pi and OpenCode locator mint, each built by one Vibe CLI brief and checked by a test and a mutation."
trigger_phrases:
  - "pi opencode history lookup tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: pi-opencode-history-lookup

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

- [x] T001 Record the baseline (`H/tests`). Verify: the suite prints `fail 0` and its test count. Evidence: the handover suite printed `tests 1026`, `fail 0` before any change.
- [x] T002 Write the briefs for this phase (`../scratch/briefs/`). Verify: one brief per change. Evidence: `../scratch/briefs/01-mint-pi-opencode.md` and `02-tests-pi-opencode-claim.md`, one change each.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Pi and OpenCode arms in the mint (`H/lib/relaunch-core.cjs`). Verify: the new claim tests pass and fail with the branch removed. Evidence: `readerFindsSession` and the `readsBySession` branch in `mintHandoverLocator`. With the branch forced off, the two redeem tests fail; with the reader check dropped, the four refusal tests fail.
- [x] T004 Claim and redeem tests (`H/tests/`). Verify: the printed command exits 0 and returns the sender's turns. Evidence: two redeem tests run the printed command and find `probe-ok`; four refusal tests cover another folder and a missing session on each runtime.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Run the suite from the final state (`H/tests`). Verify: `fail 0` above the baseline count. Evidence: `tests 1039`, `pass 1039`, `fail 0` from the final state, against a baseline of 1026.
- [x] T006 Update the docs (`H/README.md`, `.skilled/hooks/injection-contract.md`). Verify: drift guards pass. Evidence: the hand-over README, `injection-contract.md`, the root README, both feature-catalog files and the four playbook lines now list Pi and OpenCode senders; `run-all-drift-guards.sh` prints `all 4 guards PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: the phase 003 live hops recover a side word
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
- [x] CHK-003 [P1] Dependencies identified and available Evidence: the shared readers `shared/session-readers/pi.mjs` and `opencode.mjs` exist and load under Node 26.13.0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Drift guards pass Evidence: `run-all-drift-guards.sh` prints `all 4 guards PASSED`.
- [x] CHK-011 [P0] No test prints an error Evidence: the handover suite prints `fail 0`.
- [x] CHK-012 [P1] A failure in the new branch prints no section and never fails the claim Evidence: the reader call sits inside the mint's existing try, so a throw returns null and the claim prints what it printed before; the review confirmed it.
- [x] CHK-013 [P1] Code follows the Vibe arm's shape Evidence: the branch reuses the Vibe arm's placement and handle path, and only swaps the transcript proof for the reader proof.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: every row in `acceptance-criteria.md` is Met.
- [x] CHK-021 [P0] Manual testing complete Evidence: live hop `../scratch/runs/live1-pi`: the receiver's claim printed `## History Lookup` with `SPECKIT_RUNTIME=pi`, and that command returned the sender's turns. Live hop `../scratch/runs/live1-opencode`: the receiver loaded the side word through the lookup.
- [x] CHK-022 [P1] Edge cases tested: missing session, another folder Evidence: refusal tests for a missing session and for a session recorded in another folder, on Pi and on OpenCode.
- [x] CHK-023 [P1] Error scenarios validated: a reader error prints no section Evidence: a reader that throws is caught by the mint's try and returns null; the review confirmed this path.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class Evidence: Pi and OpenCode lookup gap: `cross-consumer`, since the mint must agree with the lookup's reader.
- [x] CHK-FIX-002 [P0] Same-class producers checked Evidence: every runtime in `HISTORY_LOCATOR_KINDS` now has a mint branch: Claude, Codex and Vibe by transcript, Pi and OpenCode by reader.
- [x] CHK-FIX-003 [P0] Consumers checked Evidence: the consumer `bin/history-lookup.mjs` redeems the minted handle in both redeem tests and in the live Pi check.
- [x] CHK-FIX-004 [P0] Security or path fix reviewed, or N/A Evidence: path check reviewed: the mint never takes a path from the note, and the reader refuses a session recorded for another folder whenever the store records one. An OpenCode store with no directory column cannot be checked, and the lookup accepts the same session, so the two still agree.
- [x] CHK-FIX-005 [P1] Matrix axes named Evidence: axes: runtime (Pi, OpenCode) by store state (session here, another folder, missing).
- [x] CHK-FIX-006 [P1] Hostile environment considered Evidence: a missing build, an unreadable store and a throwing reader each leave the claim output as it was.
- [x] CHK-FIX-007 [P1] Evidence pinned to the feature commit Evidence: evidence is pinned to the phase's feature commit on branch `worktrees/420-cross-runtime-handover-parity-fixes`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets Evidence: no secret in code or tests.
- [x] CHK-031 [P0] Input validation: the session id passes the reader's shape check before any read Evidence: the session id is checked by the mint's existing shape check before any reader runs.
- [x] CHK-032 [P1] N/A: no authentication surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same files Evidence: spec, plan and tasks name `relaunch-core.cjs`, the CLI tests and the README.
- [x] CHK-041 [P1] Code comments carry no spec or phase ids Evidence: a grep of the added comment lines for ticket, phase and spec ids finds none.
- [x] CHK-042 [P2] README lists Pi and OpenCode senders Evidence: the README lists Pi and OpenCode among the senders that get a locator.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned Evidence: only the run folders and briefs stay in `../scratch/`.
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
