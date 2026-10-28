---
title: "Tasks: Phase 5: sk-code hub and mode packets"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "sk-code hub and mode packets tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: sk-code hub and mode packets

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

- [x] T001 Read the phase 001 research findings this phase acts on (`../001-deep-research/research/research.md`). Verify: each finding used here is marked Confirmed or rechecked. Evidence: findings 1 and 2 rechecked at the baseline (`scratch/baseline.md` §3): the three routing-authority claims, and §2's keyword table disagreeing with §9 in both directions. §8's routing shares are marked unconfirmed there, so the phase measured the sections itself (`scratch/baseline.md` §2, `scratch/after.md` §3).
- [x] T002 Record the starting output of every gate in scope (`scratch/before.md`). Verify: the file lists each gate with its exit status. Evidence: recorded in `scratch/baseline.md`, the name the phase brief set (Deviation 2): 34 of 34 gates exit 0, with accuracy 155/195, 49/66, 19/24.
- [x] T003 Detail these tasks with `/speckit:plan` before implementation. Verify: each task below names its file and its verify command. Evidence: `plan.md` §4 fixes the five-step order, and the verify command for every step is the runner `scratch/gates.sh`. No separate `/speckit:plan` run was made (Deviation 3).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Restructure sk-code-quality and run the gates. Evidence: SMART ROUTING 102 lines / 1,760 words to 8 / 147, and the machine block moved into `## 9. MACHINE ROUTER`, last (`scratch/after.md` §3). `verify-router-sync` 5/5, `pkg-sk-code-quality` PASS and `rule-copies` OK (`scratch/after.md` §1, §4).
- [x] T005 Restructure sk-code-ci and run the gates. Evidence: already at the canon shape, so it was not edited: 3 lines / 99 words with `MACHINE ROUTER` last and no ledger entry (`scratch/after.md` §3). `pkg-sk-code-ci` PASS (`scratch/after.md` §2). Recorded as Deviation 4.
- [x] T006 Restructure sk-code-skilled and run the gates. Evidence: 118 lines / 327 words to 3 / 112, and the python block moved into `## 6. MACHINE ROUTER`, last (`scratch/after.md` §3). `verify-router-sync` 5/5 and `pkg-sk-code-skilled` PASS.
- [x] T007 Restructure sk-code-review, keeping the pinned lines, and run the gates. Evidence: 312 lines / 2,104 words to 8 / 130; the packet is 4,297 words, down from 5,676; `## 3. HOW IT WORKS` starts at line 63. The override algorithm is `references/review-core.md` §9. The Extension Floors section is byte-identical, and `check-rule-copies.js` and its canary pass (`scratch/after.md` §4).
- [x] T008 Shorten the hub routing statement, re-mint and run the guard. Evidence: §2 is 3 lines / 143 words, down from 67 / 787, and it names `compiled-route.cjs`; the pseudocode and fallback sit in `## 6. MACHINE ROUTER`. `compiled-route-guard.cjs --json` reports 7 of 7 fresh after the re-mint (`scratch/after.md` §1, §3).
- [x] T011 Align section 2 with the section 9 authority and remove the stale `testing` boost (`.skilled/skills/sk-code/ROUTER.md`). Verify: section 2 is generated from section 9 or points to it without a keyword table, and the boost no longer names `testing`. Evidence: §2 points at the `INTENT_SIGNALS` block in §9 and carries no table; the boost reads `verification, debugging, code quality`. §9 is unchanged (`scratch/after.md` §5).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun every gate in scope (`scratch/after.md`). Verify: no gate is worse than in `scratch/before.md`. Evidence: `scratch/after.md` §1; 35 of 35 exit 0, accuracy 155/195, 49/66, 19/24, router reach allowed 9, all unchanged.
- [x] T010 Validate this folder. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `validate.sh specs/sk-doc/072-skill-routing-and-clarity --recursive --strict` prints `RESULT: PASSED` for every folder (`scratch/after.md` §1).
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
- **Research**: See `../001-deep-research/research/research.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md §4, REQ-001 to REQ-004.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md §3 and §4.
- [x] CHK-003 [P1] Dependencies identified and available Evidence: phase 003 canon and phase 004 vocabulary read; phase 004's stage-gap probe is cited in `scratch/baseline.md` §2.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed script passes its own tests Evidence: no script changed. The checks the phase relies on pass: `check-rule-copies.js` and its canary, `verify-router-sync` 5/5, and parent-skill-check 12b with an empty ledger (`scratch/after.md` §2, §4).
- [x] CHK-011 [P0] Every gate in scope passes Evidence: `scratch/after.md` §1, 35 of 35 exit 0.
- [x] CHK-012 [P1] No operator-local surface is named in a tracked file Evidence: the only added `local-` text is the generic `local-*` redaction pattern in `review-core.md` §9 and a test filename (`local-native-divergence-ratchet`); no private skill is named, and `router-reach` reports operator-local 0.
- [x] CHK-013 [P1] Changes follow the phase 003 canon Evidence: parent-skill-check 12b prints `hub and 4 packet(s) follow the routing canon (0 known debt)` with an empty ledger.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md: 4 of 4 Met.
- [x] CHK-021 [P0] Gate output recorded before and after Evidence: `scratch/baseline.md` and `scratch/after.md`.
- [x] CHK-022 [P1] The largest file in scope was changed last Evidence: review, the largest packet at 729 lines and 5,676 words, was restructured last of the packets (T007); the hub edit and the re-mint followed it (T008).
- [x] CHK-023 [P1] A reverted change leaves the gates as they were Evidence: the three transform scripts assert their target lines before editing and abort otherwise, and each verifier diffs the moved block against `git show HEAD:`; a failed assert leaves the file untouched. No revert was needed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any changed file Evidence: no secrets; Markdown, JSON and changelog text only.
- [x] CHK-031 [P1] N/A unless a script changes: input handling is tested Evidence: no script changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree Evidence: spec.md, plan.md and tasks.md agree on the five steps and the gate set.
- [x] CHK-041 [P2] Changelog and version bumped for each changed skill Evidence: sk-code 3.9.20.0, sk-code-quality 1.13.13.0, sk-code-skilled 2.1.12.0, sk-code-review 1.9.11.0; sk-code-ci was not edited and carries no entry.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: temporary files in `.scratch-dc90/072-005/` only; the runner and the two gate tables live under `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->
