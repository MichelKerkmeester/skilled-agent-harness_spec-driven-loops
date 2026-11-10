---
title: "Tasks: Phase 2: table-row-matching"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "table row matching tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: table-row-matching

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

Shell variables used below, set from the repository root:
- `RT` is `.skilled/skills/system-spec-kit/runtime`.
- `BR` is `barter/ai-speckit/specs/barter-framework/001-coder-skilled-v4-conversion/decision-record.md`, read-only.
- `CL` is `.skilled/skills/.state/decision-capture/consumed.jsonl`.
- `SID` is `fe0c9990-06d3-454e-a8e7-7c7bc649bc49`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Rerun the Measured Behavior command and log the start count (`goal.md`). Verify: records 29 and 30 print `consumed`, records 1 to 28 print `pending`, and the counts are in `goal.md` section 4. Records after 30 belong to other children.
- [x] T002 Record the Barter record's hash before any matcher run (`goal.md`). Verify: `shasum -a 256 "$BR"` prints one hash, and the same hash is in `goal.md` section 4.
- [x] T003 Calibrate the weights, threshold and tie margin on the 27 known pairs and record 12 (`scratch/calibration.md`). Verify: the table in that file shows all 27 pairs above the threshold by more than the tie margin and record 12 below it.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 [P] Create the redacted fixture of rows Q67 to Q95 with the real nine-column header inside an `adr-001-decision` anchor, plus one row whose answer no record carries and one extra row that repeats the answer of Q69 to force a tie (`$RT/cli/test-fixtures/decision-table/hand-written-record.md`). Verify: `rg -c '^\| Q[0-9]+ \|' <fixture>` prints 31 and `rg -n '/Users/' <fixture>` prints nothing.
- [x] T005 Create the matcher: table discovery by first-cell Q id, header-driven column lookup, the normalization and scoring from plan.md, refusal on ties, read-only file access (`$RT/lib/continuity/decision-table-matcher.ts`). Verify: `cd $RT && npm run typecheck` exits 0.
- [x] T006 Create the CLI with `--record`, `--session`, `--project-root` and `--apply`, dry by default, appending through `recordConsumedKeys` (`$RT/cli/continuity/match-decision-table.ts`). Verify: a dry run on the fixture with a temp queue prints one line per record and `ls` of the temp consumed log reports no such file.
- [x] T007 Re-export the matcher beside the writer (`$RT/api/index.ts`). Verify: `rg -n 'decision-table-matcher' $RT/api/index.ts` prints one line.
- [x] T008 Write the tests: parse, answer gate, line-break answer, shortened option, tie refusal, no-row answer stays pending, second `--apply` adds nothing, fixture hash unchanged (`$RT/cli/tests/decision-table-matcher.vitest.ts`). Verify: `cd $RT && npx vitest run cli/tests/decision-table-matcher.vitest.ts` exits 0 with 0 failed.
- [x] T009 [P] Add the matcher step to the save docs (`.skilled/commands/speckit/save.md` and `$RT/../references/memory/save-workflow.md`). Verify: `rg -l 'match-decision-table' .skilled/commands/speckit/save.md .skilled/skills/system-spec-kit/references/memory/save-workflow.md` prints both paths.
- [x] T010 Build the runtime so the CLI exists in `dist` (`$RT/dist/`). Verify: `cd $RT && npm run build` exits 0 and `ls $RT/dist/cli/continuity/match-decision-table.js` prints the path.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T011 Dry-run the CLI on the real session against `$BR` (`$RT/dist/cli/continuity/match-decision-table.js`). Verify: records 1 to 11 and 13 to 28 print Q67 to Q93 in order, record 12 prints `pending`, and `shasum -a 256 "$BR"` matches T002.
- [x] T012 Run the same command with `--apply` (`$CL`). Verify: `rg -c "$SID" "$CL"` rises by 27, every new row's `packet` is the Barter folder, and the `$BR` hash still matches T002.
- [x] T013 Save record 12 through a full-auto `/speckit:save` targeted at 001, once the operator has confirmed its disposition (`specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/001-decision-capture-build/decision-record.md`). Verify: `rg -c '^\| Q008 \|' <that file>` prints 1 and `rg -c '^### Q008$' <that file>` prints 1.
- [x] T014 Rerun the Measured Behavior command and end a Claude session (`$RT/hooks/claude/session-stop.ts`). Verify: records 1 to 30 all print `consumed`, and once no later record is pending the Stop output holds no `operator answer(s) captured this session` line.
- [x] T015 Run the `--apply` command and the record 12 save a second time (`$CL`). Verify: `wc -l "$CL"` is unchanged, and both record hashes match the ones taken after T012 and T013.
- [x] T017 Add the one-row-one-answer refusal, the summary line and the rebuild case (REQ-011 to REQ-013) to the matcher and its tests (`$RT/lib/continuity/decision-table-matcher.ts`). Verify: the vitest file's refusal, summary and rebuild cases pass.
- [x] T018 Add `--scan-orphans` and `--release <key>` to the CLI, and change the nudge text to name the sweep and the matcher (`$RT/cli/continuity/match-decision-table.ts`, `$RT/hooks/claude/session-stop.ts`). Verify: the scan and release cases pass and `rg -n 'match-decision-table' $RT/hooks/claude/session-stop.ts` prints a line.
- [x] T019 Accept bolded or indented `Question:` labels in appendix parsing, with a test (`$RT/lib/continuity/decision-record-writer.ts`). Verify: the writer's vitest suite passes with the new case.
- [x] T020 Harden the save-writer scenario: count consumed rows, call `pendingRecords`, add `--ignored` (`.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md`). Verify: `validate-playbook-package.cjs --package system-spec-kit` reports no new finding.
- [x] T021 Rewrite the appendix item when a re-save changes an answer, with a test (`$RT/lib/continuity/decision-record-writer.ts`). Verify: the AC-020 case passes and the writer suite stays green.
- [x] T016 Re-prove the change with the series harness (`../006-live-conversation-test/`). Verify: the 006 results matrix row for 002 shows the matched answer consumed under its row's Q id, no duplicate row and a nudge count of 0. Evidence 2026-11-02: 006 re-proof row 002 reads pass; the sibling S6 check printed `n=Q050 amber_rows=1 chat_rows=1 pending=0 process_rows=0` and S14 `n=0` (`../006-live-conversation-test/scratch/live-runs/claude-run1/runner/sibling/`).
- [x] T022 Refuse a `--project-root` that is not a directory in every mode, with a test (`$RT/cli/continuity/match-decision-table.ts`). Verify: the new case fails before the change and passes after it. Evidence 2026-11-02: before, `--scan-orphans` on a file root exited 0 and the case failed (`expected +0 to be 2`); after, 62 of 62 pass across the matcher, CLI, writer and save suites, and the rebuilt CLI prints `--project-root is not a directory` with exit 2.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed Evidence: the real-session run and the 006 sibling run.
- [x] The Measured Behavior command shows records 1 to 30 of session `fe0c9990-06d3-454e-a8e7-7c7bc649bc49` as `consumed`. Evidence 2026-11-02: rerun today, records 1 to 30 each print `consumed`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Build packet**: See `../001-decision-capture-build/`
- **Live harness**: See `../006-live-conversation-test/`
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

A task blocked on the operator's record 12 answer or on the 006 harness is marked `[B]` with the reason in `goal.md` section 4, and the packet cannot close while it stays `[B]`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] The start pending count and the Barter hash are in `goal.md` section 4 (T001, T002). Evidence: goal.md section 4 row "Start count and Barter hash (T001, T002)".
- [x] CHK-002 [P0] `scratch/calibration.md` holds the threshold and tie margin (T003). Evidence: `scratch/calibration.md` line 7, threshold 0.40 and tie margin 0.05.
- [x] CHK-003 [P1] The operator's answer on record 12 is recorded in `spec.md` section 10. Evidence 2026-11-02: "Answered 2026-11-02: record 12 stays in 001 as Q008."
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `cd $RT && npm run lint` exits 0. Evidence 2026-11-02: `npm run lint` exit 0.
- [x] CHK-011 [P0] `cd $RT && npm run typecheck` exits 0. Evidence 2026-11-02: `npm run typecheck` exit 0, and the CLI package typecheck exit 0.
- [x] CHK-012 [P1] A table the matcher cannot read is skipped, exits 0 and writes nothing, tested in the CLI suite. Amended 2026-11-02 on the operator's answer (was: exits 2). Evidence: the case "leaves answers pending and exits 0 when no table in the record can be read" covers a record with no table and one with no answer column; 64 of 64 pass.
- [x] CHK-013 [P1] `rg -n 'writeFileSync|appendFileSync' $RT/lib/continuity/decision-table-matcher.ts` prints nothing. Evidence 2026-11-02: the `rg` prints nothing.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is Met with its evidence. Evidence 2026-11-02: AC-001 to AC-020 all read Met.
- [x] CHK-021 [P0] T011 to T014 ran on the real session and their output is in `goal.md` section 4. Evidence: goal.md section 4 row "Real run T011-T014".
- [x] CHK-022 [P1] The tie and no-row cases pass in `decision-table-matcher.vitest.ts`. Evidence 2026-11-02: "refuses a tie between rows with the same answer" and "keeps records pending when the answer gate has no row" pass.
- [x] CHK-023 [P1] A missing record path exits 2, and a record without a Q-id table exits 0 with its answers pending, each in the tests. Amended 2026-11-02 on the operator's answer. Evidence: "exits 2 when the record path does not exist" and the no-table case pass.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: classed `cross-consumer`: a hand-written table and the save writer both put rows into one record, so the save duplicated hand-written answers.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence 2026-11-02: the `rg` for `consumed.jsonl|CONSUMED_FILE` lists the writer, the capture core and the new CLI, and their tests; no other producer.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence 2026-11-02: the consumer `rg` lists `api/index.ts` and the matcher test; the CLI does not call `writeDecisionRecord`. The matcher, CLI, writer and save suites pass 62 of 62.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: escaped pipes inside cells, a line break shown as a slash, quotes and recommendation notes, a tie, a no-row answer and a second `--apply` that adds nothing each have a case; a root that is a file or missing now exits 2 (T022). A record outside the root is only ever read.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: plan.md lists the four axes and the eight fixture rows that cover them.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: N/A. Neither the matcher nor the CLI reads `process.env`, and every CLI case runs against a fresh temporary root.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] The fixture holds no absolute user path: `rg -n '/Users/' <fixture>` prints nothing. Evidence 2026-11-02: the `rg` prints nothing.
- [x] CHK-031 [P0] The CLI rejects a `--project-root` that is not a directory and writes only `$CL` under it. Evidence 2026-11-02: T022. Every mode exits 2 on a file or missing root and writes nothing there; the CLI writes only the consumed log.
- [x] CHK-032 [P1] N/A: the matcher has no auth surface. It runs locally on files you pass it.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `spec.md`, `plan.md` and `tasks.md` all name `match-decision-table` and the consumed-log route. Evidence 2026-11-02: `match-decision-table` appears in spec.md (1), plan.md (2) and tasks.md (6), and each names the consumed log.
- [x] CHK-041 [P1] The matcher's comments state why it never writes the record, with no packet or task ids in them. Evidence: the CLI header says the record is never written and that the consumed log is the only file it touches, because the answer already sits in the hand-written row; `rg` for packet, task or requirement ids in both files prints nothing.
- [x] CHK-042 [P2] `.skilled/hooks/decision-capture/` docs mention the matcher, if they list save-time tools. Evidence: N/A. `.skilled/hooks/decision-capture/` holds no doc of its own, and the hooks README tree lists only files inside that folder; the matcher lives in the spec-kit runtime.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] The calibration table lives in `scratch/calibration.md`, and no copy of the live Barter file sits in this packet. Evidence 2026-11-02: no file in this packet holds a Barter table row verbatim.
- [x] CHK-051 [P1] scratch/ holds the calibration table and the run evidence the criteria cite, with no absolute user path and no copy of the Barter record. Amended 2026-11-02 on the operator's answer (was: only the calibration table). Evidence: `rg -l '/Users/' scratch` prints nothing; no Barter row sits verbatim in any file.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-01
<!-- /ANCHOR:summary -->

---



