---
title: "Tasks: Vibe automatic session handover"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe automatic handover tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Vibe automatic session handover

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

`H` is `.skilled/hooks/session-handover`. `G` is `HOOKDIR=session-handover bash ../044-in-session-handover-rename/scratch/gate.sh`, run from the worktree root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Measure interactive Vibe live (`scratch/spike/spike.sh`). Verify: the log showed the breakdown changing between turns and `VIBE_EXIT=0` one second after SIGTERM, and showed the breakdown holds characters, not tokens.
- [x] T002 Record the gate baseline (`scratch/gate-baseline.txt`). Verify: relaunch 1,567, flags 31, Pi 67, goal 203, Vibe 48, doctor 17, spec gate 107, writer 75, both syncs PASS.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `readVibeUsage` and `resolveVibeWindow` (`H/lib/context-usage.cjs`, brief `scratch/briefs/01-read-vibe-usage.md`). Verify: the reader returns 20,001 of 256,000 on the spike session, and the context-usage suite passes.
- [x] T004 Add the context part and the turn-end arm part (`H/vibe/handover-parts.mjs`, briefs `02-vibe-parts.md` and `03-wire-composers.md` step 0). Verify: `node --test H/tests/vibe-adapters.test.cjs` prints 0 fail.
- [x] T005 Run the parts from the turn-start composer, the post_tool binding and the turn-end composer, the arm part last, each loaded on demand (`session-lifecycle/vibe/`, briefs `03` and `03b`). Verify: the Vibe suite in `G` prints 53 pass, 0 fail.
- [x] T006 Say Vibe hands over automatically (`H/README.md`, `.skilled/hooks/README.md`, `.vibe/plugins/README.md`, the Vibe guards reference, the session-lifecycle Vibe README, brief `04-docs.md`). Verify: `rg "command trigger only, no automatic hop because Vibe"` prints nothing.
- [x] T007 Add the playbook scenarios (`VIB-HK-027`, the `VIB-HK-026` fallback note, spec-kit `session-handover-vibe.md`, the feature catalog line, brief `05-playbooks.md`). Verify: `validate_document.py` prints VALID with 0 issues for each.
- [x] T012 Fix the review findings: skip a compaction's summarizer call when reading the fill, and watch only numbered journal segments (brief `06a-review-fixes.md`). Verify: the compaction fixture reads 9,197, not the summarizer's 6,307.
- [x] T013 Add the composer tests the review asked for (brief `06b-composer-tests.md`). Verify: a deny before the hand-over part leaves the record pending, and the post_tool CLI prints the hand-off text with the switch on and nothing with it off.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the gate (`G`, `scratch/gate-final.txt`). Verify: relaunch 1,582 and Vibe 53, the baseline plus the new tests, every other suite at baseline, both syncs PASS, drift 4 of 4 PASS.
- [x] T009 Fresh Opus medium review of the diff. Verify: no P0 or P1. Two P2 fixes landed in T012 and T013, the rest are recorded as limitations.
- [x] T010 Live Vibe hops through `skilled-loop vibe` (`scratch/runs/hop1-vibe`, `hop2-vibe`) beside a Claude Code baseline (`base1-claude`). Verify: `score.cjs` printed `5/5` for all three.
- [x] T011 Live withdraw and switch-off runs (`wd1-vibe`, `off1-vibe`). Verify: `withdrawn reason=user-message` then `killer-no-armed-record`, and with the switch off no `prepare` and no `killer-signal`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The Vibe hop scored what the Claude Code baseline scored
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

- [x] CHK-001 [P0] The spike results are in `spec.md` Open Questions
- [x] CHK-002 [P0] The gate baseline is recorded in T002
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No part can deny a turn: `armHandoverTurnEnd` returns null on every path, confirmed by the review reading every path
- [x] CHK-011 [P0] No code comment carries a spec or phase id: the hygiene grep over the added lines and new files printed nothing
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every gate suite prints its baseline count plus the new tests
- [x] CHK-021 [P0] A live Vibe hop relaunched on its claim seed with no operator step, twice
- [x] CHK-022 [P1] A live withdraw kept the session going
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The parts read only the session folder Vibe names and the git-ignored state, and send nothing out
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The READMEs and the playbooks say Vibe hands over automatically
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Briefs, spike output and run logs live under `scratch/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 3 | 3/3 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-15
<!-- /ANCHOR:summary -->

---
