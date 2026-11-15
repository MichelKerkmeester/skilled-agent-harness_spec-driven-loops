---
title: "Tasks: Phase 13: purpose-docs-and-backfill"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "purpose docs and backfill tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: purpose-docs-and-backfill

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
- `C=specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/013-purpose-docs-and-backfill`
- `SK=.skilled/skills/system-spec-kit`
- `DL=specs/system-deep-loop/loop-architecture/001-deep-loop-innovation`
- `PB=$SK/manual-testing-playbook/plugins-and-hooks`

Edit tasks name the edit in `plan.md` section 4. Every `Verify:` runs from the worktree root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Confirm phase 012 is built (`$SK/runtime/lib/spec/packet-purpose.ts`). Verify: `rg -c '^export function enclosingPacketFolder\(' $SK/runtime/lib/spec/packet-purpose.ts` prints `1` and `rg -c 'enclosingPacketFolder' $SK/runtime/dist/lib/spec/packet-purpose.js` prints `1`. Evidence: both counts print 1, at `97085a45bf`.
- [x] T002 Record the operator's verdict on each sentence and rerun every baseline in `plan.md` section 5 (`$C/scratch/sentences.md`). Verify: `goal.md` section 4 holds one verdict per sentence, eleven in all, and each baseline command prints the value it records there. Evidence: all eleven sentences approved as written by the operator on 2026-11-14, recorded in `goal.md` section 4. Baselines: the catalog validator `PASS tier=fail violations=0` with 4 notes, the playbook validator `scenarios=119 ... violations=0 warnings=2`, the docs search printed nothing and all eleven parents passed strict. The parent check printed `0 of 11` with the eight on `ancestor`, because phase 012 now skips the layout sentence.
- [x] T003 Confirm which runtimes print the compaction line before the docs name them (`$SK/runtime/hooks/codex/session-start.ts`). Verify: `rg -l 'session-prime' $SK/runtime/hooks/codex $SK/runtime/hooks/dsh` lists a file in each, and `rg -c 'Packet Purpose' $SK/runtime/hooks/devin/post-compaction.cjs` prints nothing. Evidence: `codex/session-start.ts`, `codex/shared.ts` and the two `dsh` hooks call `session-prime`, and the Devin count prints nothing.
- [x] T004 Count every search text (`$C/plan.md`). Verify: `rg -c -F` prints `1` for each search text of E9, E10, E11, E13, E14, E15, E17, E18, E19 and E20 in its file, and for the E1 to E8 text in each of the eight parents. Evidence: all 24 search texts count 1, the E1 to E8 text in each of the eight parents included.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T005 Apply E1 to E8, the approved sentences in the eight parents (`$DL/001-research-inputs-and-architecture/spec.md`). Verify: `rg -l -F 'This phase groups the related child phases below' $DL -g spec.md` prints nothing, unless the operator rejected a sentence, and then it lists only that parent. Evidence: applied by the worker `run-013` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify command prints its expected value.
- [x] T006 Apply E9, the smart-rule-injection sentence (`specs/hooks-plugins-extensions/hook-platform/005-smart-rule-injection/spec.md`). Verify: `rg -c -F 'design the selectivity that keeps injection off most turns' <file>` prints nothing. Evidence: the purpose line was replaced as written. The old phrase also sat in the frontmatter description, an older wording of the same purpose, so the orchestrator set that description to the approved sentence. The count now prints nothing.
- [x] T007 Apply E10, the on-write-quality sentence (`specs/system-speckit/memory-search-and-knowledge/003-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/spec.md`). Verify: `rg -c -F 'navigable as one track' <file>` prints nothing. Evidence: applied by the worker `run-013` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify command prints its expected value.
- [x] T008 Apply E11, the chart-and-diagram sentence (`specs/sk-design/020-chart-and-diagram-review/spec.md`). Verify: `rg -n -F 'run on two models.' <file>` prints no line under `### Purpose`. Evidence: applied by the worker `run-013` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify command prints its expected value.
- [x] T009 Create the catalog entry, E12 (`$SK/feature-catalog/context-preservation/packet-purpose-carry.md`). Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py $SK/feature-catalog/context-preservation/packet-purpose-carry.md; echo "EXIT=$?"` prints `EXIT=0`. Evidence: applied by the worker `run-013` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify command prints its expected value.
- [x] T010 Apply E13, the root catalog section (`$SK/feature-catalog/feature-catalog.md`). Verify: `rg -c '^### Packet purpose carry$' $SK/feature-catalog/feature-catalog.md` prints `1`. Evidence: applied by the worker `run-013` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify command prints its expected value.
- [x] T011 Apply E14 and E15, the two links (`$SK/feature-catalog/context-preservation/session-relaunch-loop.md`). Verify: `rg -c -F '(packet-purpose-carry.md)' $SK/feature-catalog/context-preservation/session-relaunch-loop.md $SK/feature-catalog/context-preservation/compaction-history-lookup.md` prints `1` for each file. Evidence: applied by the worker `run-013` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify command prints its expected value.
- [x] T012 Create the five scenarios, E16 (`$PB/packet-purpose-resume.md`). Verify: `ls $PB/packet-purpose-*.md | wc -l` prints `5`, and `validate_document.py` exits 0 on each. Evidence: applied by the worker `run-013` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify command prints its expected value.
- [x] T013 Apply E17, the five root index rows (`$SK/manual-testing-playbook/manual-testing-playbook.md`). Verify: `rg -c '^\| packet-purpose-' $SK/manual-testing-playbook/manual-testing-playbook.md` prints `5`. Evidence: applied by the worker `run-013` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify command prints its expected value.
- [x] T014 Apply E18, the injection contract (`.skilled/hooks/injection-contract.md`). Verify: `rg -c 'Packet Purpose' .skilled/hooks/injection-contract.md` prints `2`. Evidence: applied by the worker `run-013` (DeepSeek V4.1 Flash `-1017` at max, dsh 0.2.2-rc.3), and the verify command prints its expected value.
- [x] T015 Apply E19, the six README sentences (`README.md`). Verify: `rg -c "packet's purpose" README.md` prints at least `6`, and each E19 search text still matches once. Evidence: each of the six appended sentences matches once. `rg -c "packet's purpose" README.md` prints 5, not 6, because the plan's own sentence for line 1175 says `Purpose row quoted from the packet's \`spec.md\`` and never holds that phrase. Each E19 search text still matches once.
- [x] T016 Apply E20, the library index row (`$SK/runtime/lib/README.md`). Verify: `rg -c -F 'for the post-compaction context' $SK/runtime/lib/README.md` prints nothing. Evidence: the count prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T017 REQ-001: rerun the parent check (`$C/scratch/check-parents.mjs`). Verify: `node $C/scratch/check-parents.mjs | tail -1` prints `layout sentence as purpose: 0 of 11`, and every line whose sentence the operator approved starts with `packet`. Evidence: `layout sentence as purpose: 0 of 11`, and all eleven lines start with `packet`.
- [x] T018 REQ-007: strict validate each parent (`$C/scratch/parents.txt`). Verify: `validate.sh <parent> --strict --quiet` prints `RESULT: PASSED (errors=0 warnings=0)` for all eleven. Evidence: after `repair-derived.cjs` refreshed each parent's `graph-metadata.json`, all eleven print `RESULT: PASSED (errors=0 warnings=0)`.
- [x] T019 REQ-002: the catalog package (`$SK/feature-catalog`). Verify: `validate_catalog_package.py --package system-spec-kit` prints `PASS tier=fail violations=0` with no new note. Evidence: `PACKAGE system-spec-kit: PASS tier=fail violations=0` with the same 4 notes.
- [x] T020 REQ-003: the playbook package (`$SK/manual-testing-playbook`). Verify: `validate-playbook-package.cjs --package $SK/manual-testing-playbook` prints `scenarios=124` and `violations=0`. Evidence: `PASS package=system-spec-kit tier=FAIL_CLOSED scenarios=124 categories=9 operator=110 routing_gold_excluded=14 violations=0 warnings=2`.
- [x] T021 REQ-002 and REQ-003: the naming guard on the six new files (`$C/scratch/staging`). Verify: copy the six new files into `$C/scratch/staging/` under their package paths, run `check_no_hyphenated_catalog_content.py $C/scratch/staging; echo "EXIT=$?"`, read `EXIT=0`, then delete `$C/scratch/staging`. Evidence: run on a staged copy in the orchestrator's temp scratch folder instead of `$C/scratch/staging`, so nothing was written into the packet. `PASS: catalog/playbook content is kebab-case.`, `EXIT=0`, six files, and the copy was deleted.
- [x] T022 REQ-004 to REQ-006 and SC-003: the docs name the line (`README.md`). Verify: the last command in `plan.md` section 5 lists the catalog entry, the root catalog, the five scenarios, the injection contract and `README.md`. Evidence: the search lists `README.md`, the injection contract, the root catalog, the catalog entry, `compaction-history-lookup.md`, the playbook index and the five scenarios.
- [x] T023 REQ-007: no doc names Devin or OpenCode as printing the line (`.skilled/hooks/injection-contract.md`). Verify: `rg -n 'Packet Purpose' README.md .skilled/hooks/injection-contract.md $SK/feature-catalog/context-preservation/packet-purpose-carry.md` shows no line that lists Devin or OpenCode as a runtime that prints it. Evidence: Devin and OpenCode appear only as printing none, in the catalog entry and the injection contract. README line 1052 names OpenCode as handing over, which is the relaunch hop, not the compaction line.
- [x] T024 Confirm only the planned files changed and stop for the operator (`git status`). Verify: `git status --short` lists the 25 files in `spec.md` section 3 and this packet's docs, nothing under `../review/`, and no commit is made before the operator says yes. Evidence: `git status --short` lists the planned files, the frontmatter fix in `005-smart-rule-injection/spec.md`, the eleven parents' refreshed `graph-metadata.json` and this packet, nothing under `../review/`. The operator directed the commit on 2026-11-14.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] T017 prints `0 of 11` and T020 prints `scenarios=124`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`, section 3 for the items and their sources and section 10 for the operator's questions
- **Plan**: See `plan.md`, section 4 for the twenty edits and section 5 for the baselines
- **Sentences**: See `scratch/sentences.md` for the eleven drafts the operator reviews
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

A sentence the operator rejects is not a blocked task. It is recorded in `goal.md` and its parent is left as it was.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Phase 012 is built (T001)
- [x] CHK-002 [P0] The operator's verdict on each sentence is in `goal.md` section 4 (T002)
- [x] CHK-003 [P1] Every search text counts 1 (T004)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per quality gate, each with the command that answers it. GOOD: CHK-010 [P0] `eslint lib/` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `validate_document.py` exits 0 on the six new files (T009, T012)
- [x] CHK-011 [P1] Each new sentence has no em dash, no semicolon and no serial comma: `rg -n '\x{2014}|;|, and |, or ' $C/scratch/sentences.md` prints no line inside a `Sentence:` line Evidence: the six new files hold no em dash or semicolon. The eight parents keep their existing second sentence, which has one.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per test command and its expected count. GOOD: CHK-020 [P0] `vitest run` prints 14 passed. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`
- [x] CHK-021 [P0] The playbook validator prints `scenarios=124 ... violations=0` (T020)
- [x] CHK-022 [P0] The catalog validator prints `violations=0` (T019)
- [x] CHK-023 [P1] Each of the eleven parents passes strict validation (T018)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write one check per finding class this fix covers. GOOD: CHK-FIX-002 [P0] `rg -n 'keep' scripts/` lists every producer. WEAK: The fix is complete. -->

- [x] CHK-FIX-001 [P0] Each item has a class: B1 `class-of-bug`, B2 to B6 `instance-only`, B7 `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producers: `rg -l -F 'This phase groups the related child phases below' specs -g spec.md -g '!**/z_archive/**'` lists only the eight parents before T005 and none after.
- [x] CHK-FIX-003 [P1] Every doc that names a runtime for the compaction line names only runtimes T003 confirmed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per trust boundary. GOOD: CHK-030 [P0] No path outside the root is read. WEAK: Secure. -->

- [x] CHK-030 [P0] No new doc prints a secret, a home path or a session id Evidence: the new docs name placeholders such as `<packet-with-purpose>` only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] The root catalog section, the catalog entry and the injection contract state the same rule as `.skilled/commands/speckit/handoff.md` after phase 012
- [x] CHK-041 [P1] Each scenario links back to `packet-purpose-carry.md` and the root index lists it once
- [x] CHK-042 [P2] The root README sentences follow the voice rules
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] `$C/scratch/staging` is deleted after T021 Evidence: T021 staged its copy outside the packet and deleted it, so `$C/scratch` holds only its planned files.
- [x] CHK-051 [P1] Nothing under `../review/` is edited or staged
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
