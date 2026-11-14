---
title: "Tasks: Phase 12: purpose-reader-precision"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "purpose reader precision tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 12: purpose-reader-precision

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Shell variables, set from the worktree root before the first task:
- `C=specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/012-purpose-reader-precision`
- `RT=.skilled/skills/system-spec-kit/runtime`
- `P=$RT/lib/spec/packet-purpose.ts`, `S=$RT/hooks/claude/session-prime.ts`, `PI=$RT/hooks/pi/session-compact-context.ts`, `CI=$RT/hooks/claude/compact-inject.ts`
- `T=$RT/tests/packet-purpose.vitest.ts`, `ST=$RT/tests/hook-session-start.vitest.ts`, `PCT=$RT/tests/hook-precompact.vitest.ts`, `PT=$RT/tests/history-locator-adapters.vitest.ts`
- `N=.skilled/hooks/session-relaunch/lib/nudge.cjs`, `NT=.skilled/hooks/session-relaunch/tests/nudge.test.cjs`, `H=.skilled/commands/speckit/handoff.md`
- `PP=specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers`

Edit tasks name the edit in `plan.md` section 4, which holds each search text and replacement. Every `Verify:` runs from the worktree root unless it says `(runtime)`, which means from `$RT`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Confirm the operator answered or let stand the four defaults (`$C/spec.md`). Verify: `rg -c 'Default taken' $C/spec.md` prints `4` and `goal.md` section 4 records the answer. Evidence: four `Default taken` lines, each now carries the operator's answer of 2026-11-14, recorded in `goal.md` section 4.
- [x] T002 Capture every baseline in `plan.md` section 5, plus `thin-continuity-record.vitest.ts` and `authored-continuity-snapshot.vitest.ts` (`$C/plan.md`). Verify: each command prints its baseline value, and the probe line and the two continuity counts are written to `goal.md` section 4. Evidence: every section 5 baseline reproduced: 9, 28, 19 and 18 tests, nudge pass 89, relaunch pass 1028, workflow passed=150, `yaml ok`, 256 mirrors, three prompt syncs at 45, typecheck and eslint exit 0, continuity 42 and 1. The probe printed `own purpose read: 2931 of 2984` with combined 203, layout 8 and short 7, three more packets than at planning.
- [x] T003 Count every search text (`$C/plan.md`). Verify: `rg -c -F` or `rg -U -c -F` prints the count `plan.md` states for each search text of E1 to E24, `1` unless the edit names `2` or `6`. Evidence: a parser over `plan.md` section 4 counted all 59 search texts, each at its stated count, including 2 and 6.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 Apply E1, the two layout sentences (`$P`). Verify: `rg -c -F 'This phase groups the related child phases below so parent-level context' $P` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T005 Apply E2, the two constants (`$P`). Verify: `rg -c '^const (COMBINED_SECTION_HEADING|MAX_LEAD_IN_WORDS) ' $P` prints `2`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T006 Apply E3, no purpose from a combined opening paragraph (`$P`). Verify: `rg -c -F "if (COMBINED_SECTION_HEADING.test(trimmed[section])) return '';" $P` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T007 Apply E4, the clean authored text (`$P`). Verify: `rg -c -F 'MAX_LEAD_IN_WORDS && rest' $P` prints `1` and `rg -c -F '[\uD800-\uDBFF]$' $P` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T008 Apply E5, the problem from a combined section (`$P`). Verify: `rg -c -F 'return PURPOSE_LABEL.test(opening) ? null : authoredSentence(opening);' $P` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T009 Apply E6, the packet's own problem (`$P`). Verify: `rg -c 'ownProblem' $P` prints `4`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T010 Apply E7, `enclosingPacketFolder` (`$P`). Verify: `rg -c '^export function enclosingPacketFolder\(' $P` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T011 Apply E8, the Claude hook imports (`$S`). Verify: `rg -c -F "import { join, resolve } from 'node:path';" $S` prints `1` and `rg -c 'existsSync|dirname' $S` prints nothing. Evidence: the worker applied E8 as written, then eslint failed with `'join' is defined but never used` at `session-prime.ts:9`, because E10 removed the last `join` call. The orchestrator changed the import to `import { resolve } from 'node:path';`, so this line now counts 0, and eslint exits 0. `existsSync|dirname` counts nothing.
- [x] T012 Apply E9, the accepted-brief title (`$S`). Verify: `rg -c 'RECOVERED_CONTEXT_TITLE' $S` prints `2`. Evidence: 3, because E11 adds the third use after this task's check point.
- [x] T013 Apply E10, the shared resolver in the Claude hook (`$S`). Verify: `rg -c -F 'const folder = enclosingPacketFolder(lastSpecFolder, root);' $S` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T014 Apply E11, the project root and the accepted brief (`$S`). Verify: `rg -c -F 'const briefAccepted = sections[0]?.title === RECOVERED_CONTEXT_TITLE;' $S` prints `1` and `rg -c -F 'projectRoot: string = process.cwd(),' $S` prints `2`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T015 Apply E12, the Pi hook (`$PI`). Verify: `rg -c 'enclosingPacketFolder' $PI` prints `2`, `rg -c 'type PacketPurpose =' $PI` prints nothing and `rg -c -F 'packet purpose unavailable' $PI` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T016 Apply E13, the line suffix (`$CI`). Verify: `rg -c -F ".replace(/(?::\d+){1,2}$/u, '')" $CI` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T017 Apply E14, the reader tests (`$T`). Verify: `rg -c "^  it\(" $T` prints `14`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T018 Apply E15, the session-start tests (`$ST`). Verify: `rg -c -F 'process.cwd()' $ST` prints `1`, `rg -c -F '.tmp-session-prime' $ST` prints nothing and `rg -c -F "it('takes no purpose from the folder a stale brief names'" $ST` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T019 Apply E16, the line-suffix test (`$PCT`). Verify: `rg -c -F "it('counts a path with a line suffix toward its folder'" $PCT` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T020 Apply E17, the Pi walk-up test (`$PT`). Verify: `rg -c -F "it('walks up from a packet subfolder to the packet purpose'" $PT` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T021 Apply E18, the nudge rule (`$N`). Verify: `rg -c -F '## PURPOSE or ## ROOT PURPOSE section' $N` prints `2` and `rg -c -F 'Parent purpose (<repo-relative parent folder>)' $N` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T022 Apply E19, the nudge assertions (`$NT`). Verify: `rg -c -F "'This phase groups the related child phases below'," $NT` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T023 Apply E20, the handoff rule (`$H`). Verify: `rg -c -F 'states the problem, so it is never the purpose' $H` prints `1` and `rg -c -F 'This phase groups the related child phases below' $H` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T024 Apply E21 to both resume assets (`.skilled/commands/speckit/assets/speckit-resume-auto.yaml`). Verify: `rg -c -F 'states the problem, so it is never the purpose' .skilled/commands/speckit/assets/speckit-resume-auto.yaml .skilled/commands/speckit/assets/speckit-resume-confirm.yaml` prints `1` for each file. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T025 Apply E22, the README rows (`$RT/lib/spec/README.md`). Verify: `rg -c -F '| `enclosingPacketFolder(folder, projectRoot)` | Function |' $RT/lib/spec/README.md` prints `1`. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T026 Apply E23 to the six `goal.md` files (`$PP/006-purpose-carry-follow-ups/goal.md`). Verify: `rg -c '^    completion_pct: 100$' $PP/0{06,07,08,09,10,11}-*/goal.md` prints `1` for each of the six files. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
- [x] T027 Apply E24 to the six summaries (`$PP/006-purpose-carry-follow-ups/implementation-summary.md`). Verify: `rg -c -F 'next_safe_action: "None. The phase is built and merged"' $PP/0{06,07,08,09,10,11}-*/implementation-summary.md` prints `1` for each of the six files. Evidence: applied by the worker `run-012` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify count matches.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T028 Build the runtime, which the Pi test and the probe read (`$RT/dist/lib/spec/packet-purpose.js`). Verify: `(runtime) npm run build; echo "EXIT=$?"` prints `EXIT=0` and `rg -c 'enclosingPacketFolder' $RT/dist/lib/spec/packet-purpose.js` prints `1`. Evidence: `npm run build` exit 0, rerun after the T011 fix, and `rg -c 'enclosingPacketFolder' dist/lib/spec/packet-purpose.js` prints 1.
- [x] T029 REQ-001, REQ-003 to REQ-007: run the four purpose suites (`$T`). Verify: the first command in `plan.md` section 5 prints `(14 tests)`, `(29 tests)`, `(20 tests)`, `(19 tests)` and `Tests  82 passed (82)`. Evidence: `(14 tests)`, `(29 tests)`, `(20 tests)`, `(19 tests)`, run with the continuity suites as `Tests  125 passed (125)`.
- [x] T030 REQ-001 and SC-001: rerun the probe (`$C/scratch/probe-purpose-origin.mjs`). Verify: it prints `combinedOpening":0`, `layout sentence as own purpose: 0` and `own purpose of three words or fewer: 0`, and `own purpose read` equals the T002 value minus the T002 combined and layout counts. Record both lines in `goal.md` section 4. Evidence: `combinedOpening":0`, layout 0, short 0 and `own purpose read: 2721 of 2985`. The T002 value 2931 of 2984 minus 203 and 8 is 2720 of 2984, and the first rc.3 repin phase's `spec.md`, since folded into `017-dsh-rc3-repin`, added one packet that states its own purpose.
- [x] T031 REQ-002: run the nudge test and the relaunch suite (`$NT`). Verify: `node --test $NT; echo "EXIT=$?"` prints `pass 89`, `fail 0`, `EXIT=0`, and the relaunch command in `plan.md` section 5 prints `pass 1028`, `fail 0`, `EXIT=0`. Evidence: nudge `pass 89`, `fail 0`, and `env -u AI_SESSION_CHILD` relaunch `pass 1028`, `fail 0`, `EXIT=0`.
- [x] T032 REQ-002 and REQ-010: run the command workflow test, the YAML load and the four mirror checks (`.skilled/commands/speckit/handoff.md`). Verify: each prints its unchanged value from `plan.md` section 5. Evidence: `Result: passed=150 failed=0`, `yaml ok`, `PASS: 256 mirrors across 10 trees are in sync.` and the three prompt syncs at 45.
- [x] T033 REQ-010: typecheck and lint (`$P`). Verify: `(runtime) npm run typecheck; echo "EXIT=$?"` prints `EXIT=0`, and the eslint command in `plan.md` section 5 prints the T002 value. Evidence: typecheck `EXIT=0`, eslint exit 0 with no output after the `join` import fix in T011.
- [x] T034 REQ-010: the continuity suites keep their counts (`$RT/tests/thin-continuity-record.vitest.ts`). Verify: `(runtime) ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/thin-continuity-record.vitest.ts runtime/tests/authored-continuity-snapshot.vitest.ts` prints the two counts T002 recorded, all passing. Evidence: `thin-continuity-record.vitest.ts (42 tests)` and `authored-continuity-snapshot.vitest.ts (1 test)`, unchanged.
- [x] T035 REQ-009: the six phases read as done (`$PP/011-empty-parent-purpose-backfill/goal.md`). Verify: `rg -l '^    completion_pct: 0$' $PP/0{06,07,08,09,10,11}-*/goal.md` prints nothing. Evidence: the search prints nothing.
- [x] T036 Confirm only the planned files changed (`git status`). Verify: `git status --short` lists the files in `spec.md` section 3 and this packet's own docs, nothing under `$PP/review/` and no `.tmp-session-prime-` folder. Evidence: `git status --short` lists the 14 `.skilled` files in `spec.md` section 3, the twelve phase docs and this packet, nothing under `review/` and no `.tmp-session-prime-` folder.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] T029 prints `Tests  82 passed (82)` and T030 prints `combinedOpening":0`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`, section 3 for the findings and their sources and section 10 for the operator's four defaults
- **Plan**: See `plan.md`, section 4 for the 24 edits and section 5 for the baselines
- **Review**: `../review/review-report.md` for the deep-review findings, read only
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

A task that cannot run is marked `[B]` with the blocking command and its output in `goal.md` section 4.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] The baselines and the start commit are in `goal.md` section 4 (T002)
- [x] CHK-002 [P0] Every search text counts as `plan.md` states (T003)
- [x] CHK-003 [P1] The operator's answers to `spec.md` section 10 are recorded (T001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per quality gate, each with the command that answers it. GOOD: CHK-010 [P0] `eslint lib/` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] The eslint command in `plan.md` section 5 prints its T002 value (T033)
- [x] CHK-011 [P0] `npm run typecheck` exits 0 (T033)
- [x] CHK-012 [P1] The Pi hook logs a failed helper import on stderr (E12)
- [x] CHK-013 [P1] No comment names a spec path, phase or finding id: `rg -n 'phase 0|R1-P|A-P1|specs/' $P $S $PI $CI` prints nothing new Evidence: no new match. The two `specs/` hits in `session-prime.ts` are older user-facing strings.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per test command and its expected count. GOOD: CHK-020 [P0] `vitest run` prints 14 passed. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`
- [x] CHK-021 [P0] The four purpose suites print `Tests  82 passed (82)` (T029)
- [x] CHK-022 [P1] The relaunch suite prints `pass 1028` with `env -u AI_SESSION_CHILD` (T031)
- [x] CHK-023 [P1] The probe prints `combinedOpening":0` (T030)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write one check per finding class this fix covers. GOOD: CHK-FIX-002 [P0] `rg -n 'keep' scripts/` lists every producer. WEAK: The fix is complete. -->

- [x] CHK-FIX-001 [P0] Each item A1 to A12 has a class: A1, A2, A3, A4 and A11 are `cross-consumer`, A6 and A7 `algorithmic`, A8 `test-isolation`, A5, A9, A10 and A12 `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producers: `rg -n "Keep parent documentation lean" --hidden --glob '!specs/**' --glob '!.git/**' .` lists only the seven files E1 and E18 to E21 edit and the two test files. Evidence: the search lists seven files: `packet-purpose.ts`, `nudge.cjs`, `handoff.md`, both resume assets and the two tests.
- [x] CHK-FIX-003 [P0] Consumer inventory: `rg -n 'resolvePacketPurpose|enclosingPacketFolder' .skilled --glob '*.ts'` lists no caller outside `plan.md` FIX ADDENDUM. Evidence: besides the edited files it lists `api/index.ts` and `cli/core/workflow.ts`, both named in the addendum.
- [x] CHK-FIX-004 [P0] Path tests cover outside-root, a track folder with no spec.md and a subfolder (E14 last test, E15 edit ten, E17).
- [x] CHK-FIX-005 [P1] The matrix in `plan.md` FIX ADDENDUM is covered by the E14 tests.
- [x] CHK-FIX-006 [P1] The relaunch suite runs with `env -u AI_SESSION_CHILD`, the hostile env variant (T031).
- [x] CHK-FIX-007 [P1] The evidence in `goal.md` names the fix commit. Evidence: `implementation-summary.md` names the phase commit, the worker run and the start commit `26cfcdb603`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per trust boundary. GOOD: CHK-030 [P0] No path outside the root is read. WEAK: Secure. -->

- [x] CHK-030 [P0] No hardcoded secrets in the changed files
- [x] CHK-031 [P0] `enclosingPacketFolder` refuses a path outside the root before any read (E14 last test)
- [x] CHK-032 [P1] No control character reaches a printed line (E14 fourth new test)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] The nudge, `handoff.md` and both resume assets name the same shapes: `rg -c 'ROOT PURPOSE' $N $H .skilled/commands/speckit/assets/speckit-resume-*.yaml` prints a count for each of the four files
- [x] CHK-041 [P1] Each new function has a comment that says why it exists
- [x] CHK-042 [P2] `lib/spec/README.md` names `enclosingPacketFolder` (T025)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] The probe stays in `$C/scratch/`, and no test writes under the repository
- [x] CHK-051 [P1] Nothing under `$PP/review/` is edited or staged
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
