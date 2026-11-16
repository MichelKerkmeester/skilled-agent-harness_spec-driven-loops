---
title: "Tasks: Phase 38: alignment-p1-remediation"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "alignment p1 remediation tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 38: alignment-p1-remediation

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
| `[C]` | Coordinator task: a gate, a rescore or the close-out |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root. Set the names once with `export ADV=.skilled/skills/system-skill-advisor/runtime RAD=$ADV/scripts/routing-accuracy PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build SP=$PK/038-alignment-p1-remediation/scratch`. `S`, `FLOOR`, `EVAL` and `PLOG` are as phase 036's `tasks.md` defines them. `RUN` is the alignment run folder `~/.local/state/local-skilled-alignment/352-command-surfacing-research/20261116T085341Z`. `MAIN` is a built `git archive` of origin/main under the session scratchpad.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [C] Record the before gates and the stored summaries (`$SP/before.txt`, `bash $SP/rescore.sh before`). Verify: the four before summaries equal phase 036's after files. Evidence: before.txt: AI_SESSION_CHILD=1 suite 2 failed 2322 passed, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5]; the four before summaries cmp equal to 036's after files
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Judge the guarded write against the run's checkout (`$S`). Verify: `node --check $S` exits 0. Evidence: startState wrote = firstWritePosition(stream, checkoutDir); node --check exit 0
- [x] T003 [P] Add the arena write cases (`$ADV/tests/command-transcript-score.vitest.ts`). Verify: they pass, and fail with the old line restored. Evidence: 346 passed; with the old line the two arena cases fail (2 failed, 344 passed), restored after
- [x] T004 [P] Read a chain of the advertised suffixes as the command (`$ADV/lib/command-attach.ts`, `$ADV/tests/command-attach-guards.vitest.ts`). Verify: the suffix cases pass and an unknown suffix still reads as no command. Evidence: MODE_SUFFIX takes :unattended, :with-context, :with-phases, :with-research and chains; cases for :unattended, :with-research, :with-context, :auto:with-research, :with-everything and :auto:draft pass
- [x] T005 [P] Clear the inherited child flag before workers start (`$ADV/vitest.config.ts`). Verify: the two failing tests pass with `AI_SESSION_CHILD=1`. Evidence: rg shows every child-session test sets the flag itself; the six touched files pass 323/323 with AI_SESSION_CHILD=1
- [x] T006 [P] Name every runtime whose prompt hook writes a health record (`README.md`). Verify: `TMPDIR=<empty> node $SP/hook-health-check.mjs` prints `dsh 1 vibe 1 pi 1`. Evidence: hook-health.txt dsh 1 vibe 1 pi 1; the OpenCode plugin imports no file write; README names Claude Code, Codex, Devin, Cursor, Pi, DSH and Vibe and says the OpenCode plugin writes none
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [C] Rebuild and rerun the gates both ways (`$SP/after.txt`). After T006. Verify: build exit 0, 0 failed with the flag unset and set, `FLOOR` and `EVAL` equal to `before.txt`. Evidence: after.txt build exit 0, 2328 passed 0 failed unset and with AI_SESSION_CHILD=1, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5]
- [x] T008 [C] Restate the stored sets and list the moved runs (`bash $SP/rescore.sh after`, `$SP/unsafe-rows.txt`). After T007. Verify: only `unsafe` fields move, and `unsafe-rows.txt` lists one line per moved count. Evidence: only unsafe moved: 007 devin pre 1 to 2, devin post 1 to 2, opencode post 0 to 1; pre set devin pre 1 to 2; final set devin post 1 to 2; 033 opencode on 0 to 1; unsafe-rows.txt lists those six runs
- [x] T009 [C] Compare the upheld probes on head and main (`$SP/compare-probes.txt`, `$SP/probe-base.txt`). After T007. Verify: each upheld probe's top skill is the same on both, or its move is named. Evidence: P01, P04, P05, P08 and P09 same on both trees; P12 moved sk-code to system-spec-kit, wrong on both; P07 moved to the right skill; mode inputs changed only by the /create:sk-skill rename
- [x] T010 [C] Log the dispositions (`../goal.md`). After T009. `PLOG` the alignment row, the unsafe restatement row and a correction row for phase 037's README claim. Verify: `rg -c '^\| Alignment final' $PK/goal.md` prints 1 or more and `packet_budget=ok`. Evidence: goal rows Unsafe restated, checkout boundary; Correction, phase 037 README claim; Alignment final, run 20261116T085341Z; packet_budget=ok
- [x] T011 [C] Close the phase (`implementation-summary.md`). After T010. Verify: `validate.sh $PK/038-alignment-p1-remediation --strict` prints `RESULT: PASSED`. Evidence: implementation-summary.md filled, AC 5 of 5 Met, spec Complete, validate --strict RESULT: PASSED
- [x] T012 [C] Act on the independent review of the 038 code (`$S`, `$ADV/tests/command-transcript-score.vitest.ts`). After T011. A Fable 5.2 review approved with no P0 or P1 and three P2. Count a guarded write outside the checkout as unsafe unless it lands in a scratch folder, fix the stale `checkoutDir` doc line, and record a reason for the third. Verify: the new outside-write case passes, the suite passes both ways and the four stored sets equal the 038 rescore. Evidence: outside-write case passes; after-review.txt 2329 passed 0 failed with AI_SESSION_CHILD unset and set, typecheck exit 0; the four stored sets equal the 038 rescore; doc line fixed; the extension case recorded with a reason
- [x] T013 [C] Fix review pass seven's six P2 (`$S`, `$RAD/README.md`, `$ADV/lib/command-attach.ts`, `$ADV/tests/command-transcript-score.vitest.ts`). After T012. Pass seven ran three DeepSeek lineages over `85550ee946e..1c3d62def5a` and found 0 P0, 0 P1 and 6 P2. Verify: the new cases fail on the previous scorer, the suite passes both ways, `FLOOR` and `EVAL` hold and the four stored sets equal the 038 rescore. Evidence: home path, parent step and chained suffix cases fail on the previous scorer (3 failed) and pass now; after-pass-seven.txt: 2332 passed 0 failed with AI_SESSION_CHILD unset and set, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5], four stored sets unchanged from 038
- [x] T014 [C] Fix review pass eight's three P2 (`$S`, `$ADV/tests/command-transcript-score.vitest.ts`, `$ADV/tests/command-attach-guards.vitest.ts`). After T013. Verify: the new cases fail on the previous scorer, the suite passes both ways and `FLOOR`, `EVAL` and the stored sets hold. Evidence: checkout-folder write and chained self auto fixed with tests that fail on the previous scorer (2 failed); :with-phases and cross-command modifier cases added; after-pass-eight.txt 2335 passed 0 failed both ways, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5], stored sets unchanged
- [x] T015 [C] Fix review pass nine's six P2 (`$S`, `$ADV/tests/command-transcript-score.vitest.ts`, `$ADV/tests/command-attach-guards.vitest.ts`, `spec.md`, `acceptance-criteria.md`). After T014. Verify: the new cases fail on the previous scorer, the suite passes both ways and `FLOOR`, `EVAL` and the stored sets hold. Evidence: route split before the suffix chain, linear suffix pop (100000 suffixes 12055 ms to 8 ms), self-auto read before the route, /var/tmp and bare scratch roots as scratch, one modifier source, longest chain and leading anchor pinned, REQ-006 and AC-006; 3 new cases fail on the previous scorer; after-pass-nine.txt 2339 passed 0 failed both ways, FLOOR 24/44 0/35 2/44, EVAL [160,49,21,5], stored sets unchanged
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The goal rows name every open P0 and P1 row and every moved unsafe run
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

- [x] CHK-001 [P0] The before gates and summaries are on file (T001). Evidence: before.txt and the four before summaries
- [x] CHK-002 [P0] Each branch-caused P1 reproduced before its fix. Evidence: A-1 by the rescore, C-01 by hook-health-check, D-01 and CRIT-4 by the matcher, D-02 by the suite with AI_SESSION_CHILD=1
- [x] CHK-003 [P1] AS10, which a lane reported failing, rechecked. Evidence: tests/legacy/advisor-freshness.vitest.ts passes 12/12 with the flag unset and set
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check $S` exits 0 and `npm run typecheck` exits 0. Evidence: node --check exit 0, typecheck exit 0
- [x] CHK-011 [P0] The change touches the six files only (`G diff --stat`). Evidence: git diff --stat lists the six files outside the spec folder
- [x] CHK-012 [P1] No other `firstWritePosition(stream)` call lacks a checkout. Evidence: rg finds none
- [x] CHK-013 [P1] Comments carry no phase or finding id. Evidence: the three added comments carry no id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md 5 of 5 Met
- [x] CHK-021 [P0] Full suite 0 failed with the flag unset and set (`after.txt`). Evidence: after.txt 2328 passed 0 failed both ways
- [x] CHK-022 [P1] The arena cases fail on the old rule. Evidence: 2 failed with the old line, restored
- [x] CHK-023 [P1] `FLOOR` and `EVAL` unchanged. Evidence: after.txt equals before.txt on both
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each fix names its class. Evidence: A-1 and CRIT-4 are producer fixes, C-01 is doc drift, D-02 is test isolation
- [x] CHK-FIX-002 [P0] The same class searched for elsewhere. Evidence: rg finds no other firstWritePosition call without a checkout; scorer/text.ts keeps :with-* by design
- [x] CHK-FIX-003 [P0] Every consumer of `unsafe` restated. Evidence: unsafe and unsafeNoChangedPath in all four stored sets rescored
- [x] CHK-FIX-004 [P0] The matcher change keeps refusing unknown suffixes. Evidence: :automation, :draft, :with-everything and :auto:draft read as no command
- [x] CHK-FIX-005 [P1] The suite matrix covers the child flag. Evidence: the suite ran with AI_SESSION_CHILD unset and set to 1
- [x] CHK-FIX-006 [P1] Each moved unsafe run is named. Evidence: unsafe-rows.txt
- [x] CHK-FIX-007 [P1] Evidence names the fix commit. Evidence: the phase 038 commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No corpus prompt or session text in any scratch file. Evidence: labels read through jq del(.prompt); unsafe-rows.txt holds ids and paths; probes.json holds the alignment run's own probe prompts
- [x] CHK-031 [P0] `.skilled/hooks/hook-flags.env` neither read nor created. Evidence: never opened or created
- [x] CHK-032 [P1] N/A: no credential or auth path is touched. Evidence: no auth path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, tasks and the goal rows name the same open rows. Evidence: spec Out of Scope, the goal rows and implementation-summary name BAT-02 and the six probes
- [x] CHK-041 [P1] The README paragraph matches the hook run. Evidence: hook-health.txt and README named the same runtimes at 38aa768f9da; main's README rewrite later dropped the paragraph
- [x] CHK-042 [P2] The matcher comment names the chained suffixes. Evidence: command-attach.ts comment
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Evidence lives in this phase's `scratch/` only. Evidence: git status lists this phase, goal.md and the six files
- [x] CHK-051 [P1] `scratch/` holds the gates, summaries, scripts and their output only. Evidence: ls scratch
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
