---
title: "Tasks: Fix the six P2 findings of the second epic review"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "second epic review fixes tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Fix the six P2 findings of the second epic review

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

`R` is `.skilled/skills/system-skill-advisor/runtime`. `E` is the parent epic folder, `016-pi-context-decisions-based-research-refinement`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Build the worktree's skill graph (`R/database/skill-graph.sqlite`). Verify: `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format text` prints `skill_graph_scan: completed`.
- [x] T002 Take the baseline gate set. Verify: advisor suite `180 passed (180)`, `2564 passed | 4 skipped`; Python `DEEP-LOOP-GATE` at `cases=27`; the three ratchets and the corpus scorer exit 0.
- [x] T003 Reproduce each finding at HEAD. Verify: the early-exit probe prints `UNCAUGHT EPIPE write EPIPE`, and the curly prompt returns false in both runtimes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add three shared offer cases (`R/tests/fixtures/deep-loop-offer-cases.json`). Verify: before the fix, `deep-loop-offer-cases.vitest.ts` prints `1 failed | 30 passed (31)` on the curly case and Python prints `FAIL: DEEP-LOOP-GATE` naming it.
- [x] T005 Fold quotes in `asksForLoopRun` (`R/lib/command-attach.ts`) and `asks_for_loop_run` (`R/scripts/skill_advisor.py`). Verify: `31 passed (31)` and `PASS: DEEP-LOOP-GATE ... (cases=30)`.
- [x] T006 Rewrite the `ITERATION_COUNT` comment (`R/lib/command-attach.ts`). Verify: the named-loop and bare spelled-count cases pass in both runtimes before and after.
- [x] T007 Add the early-exit subprocess case (`R/tests/subprocess-output-cap.vitest.ts`). Verify: against HEAD's `subprocess.ts` vitest reports `Unhandled Errors` with `write EPIPE`.
- [x] T008 Add the stdin error listener (`R/lib/subprocess.ts`). Verify: `6 passed (6)` and no errors.
- [x] T008a Make the legacy suite's mock stdin an event emitter (`R/tests/legacy/advisor-subprocess.vitest.ts`). The first full run failed 8 cases there with `child.stdin?.on is not a function`, because the mock had only `write` and `end`. Verify: both subprocess files print `15 passed (15)`.
- [x] T009 Set children 007 to 010 to Complete (`E/007-*` to `E/010-*` `spec.md` and `graph-metadata.json`). Verify: each prints `| **Status** | Complete |` and `"status": "complete"`.
- [x] T010 Rewrite the receipt-guard catalog entry (`.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md`). Verify: Source Files lists the DSH, Vibe and Pi adapters and the DSH test.
- [x] T011 Correct AC-006 (`E/027-epic-review-fixes/acceptance-criteria.md`). Verify: `git grep score-outcome-rerank -- ':!specs/' ':!*changelog/*'` exits 1 with no output.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rerun the gate set from the final tree (`plan.md` section 5). Verify: every gate exits 0 and the advisor suite prints `180 passed (180)` and `2601 passed | 4 skipped (2605)`. The first final run failed one case in `R/tests/hooks/vibe-prompt-advisor.vitest.ts`, whose state folder was made at mode 0755 and is now refused, so the test makes it owner-only like the live default.
- [x] T013 Validate the touched folders. Verify: `validate.sh --strict` prints `RESULT: PASSED` for 007 to 010, 012, 024/005, 025, 027, 028 and the recursive parent.
- [x] T014 Rerun the five-pass review of the epic (`E/review/`). Verify: `review-verdict.cjs` prints `PASS` with `failed_required_gate_ids: []` and `search_debt: 0`, and seven new P2 advisories.
- [x] T015 Add sixteen shared offer cases (`R/tests/fixtures/deep-loop-offer-cases.json`): two negated loop questions, a curly writing-about prompt and one run case per untested vocabulary entry. Verify: before the fixes, vitest prints `3 failed | 44 passed (47)` and Python `FAIL: DEEP-LOOP-GATE` naming the same three.
- [x] T016 Read negated auxiliaries as a loop question and fold quotes in the writing-about check, in both runtimes (`R/lib/command-attach.ts`, `R/scripts/skill_advisor.py`). Verify: `PASS: DEEP-LOOP-GATE ... (cases=46)` and the offer-cases file passes.
- [x] T017 Export the want leads as a list and add a vocabulary check (`R/lib/command-attach.ts`, `R/tests/deep-loop-offer-cases.vitest.ts`). Verify: `64 passed (64)`, and adding `deep audit` to `LOOP_WORDING` alone fails the new case `has a run case that uses "deep audit"`.
- [x] T018 Check the Vibe head-receipt folder and write by temp file and rename (`.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs`). Verify: both new cases fail before the fix and `turn-start.test.mjs` prints `pass 15`, `fail 0` after.
- [x] T019 Bring completion metadata in line: save `completion_pct: 100` for 012, 025 and 024/005 through the continuity writer, and reword 012's ticked line that quoted an unticked checkbox. Verify: all three read `completion_pct: 100` and 012's `graph-metadata.json` derives `complete`.
- [x] T020 Rewrite the epic's Status cell through phase 028 and set row 22 Complete (`E/spec.md`). Verify: the cell names phases 023 to 028 and row 22 reads `| Complete |`.
- [x] T021 List every strip call site, the Python copy and the shared fixture (`.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md`). Verify: the table names all seven `stripLeadingPastedReply` callers found by `rg -n "stripLeadingPastedReply\("`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The review rerun's report exists at `E/review/review-report.md` with its verdict
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source review**: the second review's report, archived by the rerun under `E/review-archive/`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 to REQ-006 map to the six findings and the rerun, and REQ-007 to REQ-010 to the rerun's seven advisories.
- [x] CHK-002 [P0] Technical approach defined in plan.md section 3.
- [x] CHK-003 [P1] Dependencies available: the skill-graph scan printed `skill_graph_scan: completed` and the baseline went green.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npm run typecheck` and `npm run clean && npm run build` exit 0 in `R`.
- [x] CHK-011 [P0] The advisor suite reports no unhandled error: `grep -ci unhandled` over its log prints 0.
- [x] CHK-012 [P1] Error handling: the stdin listener swallows only the pipe error, and the close handler still reports the exit code.
- [x] CHK-013 [P1] Code follows project patterns: the fold uses the same `[\u2018\u2019]` replace as `isNoEditRequest`, and Python reuses `_fold_quotes`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met in `acceptance-criteria.md`.
- [x] CHK-021 [P0] Each new check failed before its fix: the curly case in both runtimes, the early-exit case against HEAD's `subprocess.ts`.
- [x] CHK-022 [P1] Edge cases: both spelled-count questions are pinned, the named-loop one false and the bare one true.
- [x] CHK-023 [P1] Error scenario: an 8 MiB prompt to a child that exits with code 3 returns `ok: false` and `exitCode: 3`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding classes: R2-P2-001 `instance-only`, R4-P2-001 `cross-consumer` (two runtimes), R4-P2-002 `instance-only`, R3-P2-001 `matrix/evidence`, R3-P2-002 `instance-only`, R3-P2-003 `matrix/evidence`.
- [x] CHK-FIX-002 [P0] Same-class producers: the only other prompt write to a spawned advisor child, `hooks/lib/skill-advisor-cli-fallback.ts:278`, already has the listener. Every other gate helper in `command-attach.ts` already folds quotes, at lines 443 and 607.
- [x] CHK-FIX-003 [P0] Consumers of `asksForLoopRun`: both offer paths read it, and the shared fixture covers both runtimes.
- [x] CHK-FIX-004 [P0] Parser cases: straight and curly apostrophe, named-loop and bare spelled-count questions.
- [x] CHK-FIX-005 [P1] Matrix: two runtimes by three new prompts, six rows, all agree.
- [x] CHK-FIX-006 [P1] Hostile state: the Vibe receipt cases plant a symlink at the receipt path and open the folder to mode 0777, and neither is written through.
- [x] CHK-FIX-007 [P1] Evidence pinned to the packet's commit: every citation is a file:line in this commit's tree.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets: the diff adds no credential or token.
- [x] CHK-031 [P0] Input handling: the fold changes two code points only, before pattern matching.
- [x] CHK-032 [P1] Auth: N/A, no auth surface touched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec and tasks name the same thirteen findings and files.
- [x] CHK-041 [P1] The new comments state the durable reason and carry no packet or finding id.
- [x] CHK-042 [P2] The receipt-guard and pasted-reply catalog entries are the docs this packet updates.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probe scripts live in the session scratchpad, outside the repository.
- [x] CHK-051 [P1] `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-23
<!-- /ANCHOR:summary -->

---
