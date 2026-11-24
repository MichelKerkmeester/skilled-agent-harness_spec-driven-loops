# Iteration 002 - Traceability (checklist_evidence, T065 to T101)

## Dispatcher

- Mode: review, lineage `deepseek-max-1`, generation 1, iteration 2 of 7.
- Dimension: traceability. Protocol under test: `checklist_evidence` - every ticked task from T065 to T101 against the line its `Observed` cell names, plus the Verification Summary and the Completion Criteria counts.
- Operator review focus: this is the second half of the traceability ask; the first half (`spec_code` over REQ-001..REQ-022) ran in iteration 1.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md` (T065 to T101, Completion Criteria, CHK rows, Verification Summary)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688`, `:736`, `:897`, `:899`, `:1102`, `:1455`, `:1551`, `:1554`, `:1615`, `:1682`; exported arrays at `:215`, `:330`, `:354`, `:413`, `:450`, `:581`, `:874`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074`, `:1084`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4639`, `:5165`, `:5181`, `:5646`, `:5745`, `:6561`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:808`, `:852`, `:919`, `:1000`, `:1174`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80`, `:103`, `:110`, `:111`, `:300`, `:308`, `:315`, `:324`, `:333`, `:338`, `:346`, `:355`, `:448`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (347 cases, parsed)
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2854`, `:2875`, `:2999`, `:3047`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:232`, `:241`, `:277`, `:299`; `acceptance-criteria.md:84`; `implementation-summary.md` (limitations)

## Findings - New

### P0 Findings

None.

### P1 Findings

None. The behaviour each task cell describes holds; the cells that miss name a line the ninth round moved, and one names a measurement another row contradicts.

### P2 Findings

1. **T066's three anchors all point above the code they name** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:581` -- T066 says the refusal leads sit in `RUN_ASK_REFUSAL_LEADS` (`command-attach.ts:581`), which builds `RUN_ASK_NEGATED_SOURCE` (`:629`), and in `_RUN_ASK_NEGATED_RE` (`skill_advisor.py:4993`). The list is at `:688`, the source at `:736`, and the Python pattern at `:5165`; `:581` holds `LOOP_RUN_SYMPTOMS` and `:629` a comment.
   Finding class: evidence-pointer drift.
   Scope proof: `rg -n "export const RUN_ASK_REFUSAL_LEADS|RUN_ASK_NEGATED_SOURCE"` plus direct reads of the three cited lines.
   Affected surface hints: `tasks.md` T066 cell.
   Case: a reader checking the refusal vocabulary at `:581` lands in the run-symptom list.

2. **T067's `RUN_REFUSED` anchors miss the export, the read site and the Python copy** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:790` -- T067 cites `:790` for the export, `:1404` for the stuck branch and `skill_advisor.py:5404` for `_RUN_REFUSED_RE`. `RUN_REFUSED` is at `:897` with `isRunRefused` at `:899`, the doctor branch reads it at `:1554`, and `_RUN_REFUSED_RE` is at `:5646`. The fused-row claim does resolve: `withholdDeepLoopDoctorWithoutRun` is at `fusion.ts:1074` and calls `isRunRefused` at `:1084`.
   Finding class: evidence-pointer drift.
   Scope proof: `rg -n "RUN_REFUSED|isRunRefused"` over the three files; direct reads of `:790` and `:1404`.
   Affected surface hints: `tasks.md` T067 cell.
   Case: a reader opening `:790` finds a closing brace, not the exported refusal pattern.

3. **T069's deep-gate read site is a comment** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1453` -- T069 says "the deep gate reads it (`:1453`)". `:1453` is a comment about the lead window; the deep gate's read is `typedCommandsIn(prompt).includes(commands[servedMode])` at `:1615`, and the doctor branch's read is at `:1551`. `typedCommandsIn` `:274` and `typedCommandForTop` `:304` do resolve.
   Finding class: evidence-pointer drift.
   Scope proof: `rg -n "typedCommandsIn\("` over the file; direct read of `:1453`, `:1551`, `:1615`.
   Affected surface hints: `tasks.md` T069 cell.
   Case: a reader verifying that the deep gate reads every typed key lands on prose about the lead window.

4. **T070's two anchors name a different function body and a different list** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1483` -- T070 cites `:1483` for the `namesLoopSubject` skip in the deferred cue and `:492` for `DEFECT_CHECK`. `:1483` is a whitespace `.replace(...)` call, `namesLoopSubject` is defined at `:1102` and called from the cue loops at `:1120` and `:1682`, and `DEFECT_CHECK` is at `:528`, with its verb and noun lists at `:494` and `:508`.
   Finding class: evidence-pointer drift.
   Scope proof: `rg -n "function namesLoopSubject|namesLoopSubject\(|export const DEFECT_CHECK"`; direct reads of `:1483` and `:492`.
   Affected surface hints: `tasks.md` T070 cell.
   Case: a reader checking the -ing defect cue opens a string-normalisation line.

5. **T072 repeats the two Python anchors iteration 1 found wrong in AC-036** -- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2969` -- T072 cites `:5482` for the marked row and the new test at `:2969`. The marker is `rec["typed"] = True` at `:5745` and the test is `test_deep_loop_typed_run_row_marked` at `:2999`; `:2969` holds `test_deep_loop_doctor_naming_reading()`. This sharpens R1-P2-005 with the task-side citation.
   Finding class: evidence-pointer drift (refines R1-P2-005).
   Scope proof: direct reads of `:2969`, `:2999`, `:5482`, `:5745`.
   Affected surface hints: `tasks.md` T072 cell.
   Case: a reader checking the served `typed: true` marker at `:5482` finds a command-lead helper call.

6. **T075's window anchors and its timings disagree with the tree and with AC-037** -- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:998` -- T075 cites `command-attach.ts:641` for `LEAD_WINDOW`, `skill_advisor.py:5009` for `_LEAD_WINDOW`, `:6298` for the head call and guards `:998` for the four long-prompt cases. `LEAD_WINDOW` is at `:748`, `_LEAD_WINDOW` at `:5181`, the head call at `:6561`, and the long-prompt block opens at `:1174` ("A pasted prompt can repeat a refusal or a loop name thousands of times"), with `:1000` holding four command-wrapping cases instead. T075 also records `DEEP-LOOP-LONG` as `counted=142ms, refused=111ms` while AC-037 records `counted=103ms, refused=100ms`; two rows cannot both quote the same run.
   Finding class: evidence-pointer drift plus a measurement contradiction.
   Scope proof: `rg -n "LEAD_WINDOW|_LEAD_WINDOW|_advisor_prompt_head"` over both files; `rg -n "repeat a refusal"` for the long-prompt block; direct comparison of the two timing strings.
   Affected surface hints: `tasks.md` T075 cell, `acceptance-criteria.md` AC-037 cell.
   Case: a reader tracing the bounded window from T075 opens a comment line at `:641` and finds a timing pair that contradicts the acceptance row.

7. **The drift-guard citations are stale and the pair count is five short** -- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80` -- T076, T087, T092 and AC-038 describe the guard as fifteen pairs whose numeric pair sits at `:90` and is asserted at `:313`, with per-entry cases at `:247`, `:255`, `:262`, `:271`, `:280`, `:285` and `:293`. The `VOCABULARY_PAIRS` block opens at `:80` and closes at `:103`, so the last pair (the refusal leads) is at `:103` rather than `:83`; the table holds 22 entries - 20 list pairs and the two numbers at `:110` and `:111` - and every pair, the numbers included, is asserted by the single `it.each(VOCABULARY_PAIRS...)` at `:448`. The per-entry cases are at `:300`, `:308`, `:315`, `:324`, `:333`, `:338`, `:346` and `:355`, and they pin eleven lists, not ten. REQ-031's "all fifteen compared lists" and its five-without-a-case paragraph therefore describe an earlier tree.
   Finding class: closure-count drift.
   Scope proof: a parse of the pair table and the `it.each` blocks in the cited file; direct reads of `:80`, `:103`, `:110`, `:111`, `:300`-`:355`, `:448`.
   Affected surface hints: `spec.md` REQ-031, `acceptance-criteria.md` AC-038, `tasks.md` T076, T087 and T092 cells.
   Case: a reader verifying that every compared list carries a per-entry case finds 22 pairs, two of them numeric, and eleven per-entry cases in different lines than the rows name.

8. **The packet records two fixture sizes and only the later one matches the tree** -- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2` -- the fixture parses to 347 cases. T101 records 347 shared cases; AC-028, AC-030, AC-037, AC-042, T088, T089, T090 and T092 record 285. AC-028 states "on the final tree ... `cases=285`", which the tree contradicts today.
   Finding class: closure-count drift.
   Scope proof: `JSON.parse` of the fixture returns 347 entries; the cited cells were read directly.
   Affected surface hints: `acceptance-criteria.md` AC-028, AC-030, AC-037, AC-042; `tasks.md` T088, T089, T090, T092.
   Case: a reader comparing the eighth-round counts with the ninth-round tree finds two sizes recorded and only T101's matching.

9. **T082's CHK-001 pointer no longer holds its number** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:245` -- T082 says "CHK-001's count then read 34, and 39 after the eighth round (`tasks.md:245`)"; `:245` now reads "`rg -c '^\| REQ-' spec.md` prints 46". The historical 34 and 39 are consistent, the parenthesised pointer is not.
   Finding class: evidence-pointer drift.
   Scope proof: direct read of `tasks.md:245`; `rg -c '^\| REQ-' spec.md` prints 46.
   Affected surface hints: `tasks.md` T082 cell.
   Case: a reader checking the eighth-round count at the cited line finds the ninth-round number.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `checklist_evidence` (T065 to T101, Completion Criteria, CHK rows, Verification Summary) | partial | Every ticked task's substance holds; nine cells name a moved line, a superseded count, or a measurement another row contradicts. |

Verified as built, not merely as written:

- **Completion Criteria and Verification Summary arithmetic.** `tasks.md` holds 101 tasks with 100 `[x]` and T084 open (`:166`), 12 `[P0]` boxes with 11 checked and CHK-020 open (`:266`), 13 `[P1]` boxes all checked, and 1 `[P2]` box checked. The summary rows at `:322` to `:324` state exactly 12 / 11-of-12, 13 / 13-of-13 and 1 / 1. The stated counts agree with the boxes behind them.
- **CHK-001.** `rg -c '^\| REQ-' spec.md` prints 46, which is what the row says.
- **CHK-011 (comment hygiene).** `rg -n "REQ-[0-9]|specs/|ADR-00|\bD[0-9]\b|\bP[0-9]\b"` over `command-attach.ts`, `explicit.ts`, `fusion.ts`, `subprocess.ts` and `skill_advisor.py` prints nothing, so no ephemeral spec or decision label sits in the changed code.
- **CHK-030 (secrets).** The same `rg -i "api[_-]?key|token=|password"` over the three changed lib files prints nothing.
- **T065.** `ADR-005` is named in `spec.md:232`, `:241`, `:277` and `:299` and in `acceptance-criteria.md:84` (AC-027), which is what T065 asks for.
- **T067, T071, T077, T078, T091.** Substance confirmed: the fused row withholds through `isRunRefused` (`fusion.ts:1084`), `servedReviewKept` is read by the Python suite at `test_skill_advisor.py:2875`, the degraded paths are pinned at `command-brief-golden.vitest.ts:353`/`:364`, `explicit.ts:454` gates the passes reading, and `trackedCommandForOwner` is at `skill-advisor-cli.ts:1489` and read at `:1571`.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074` (`withholdDeepLoopDoctorWithoutRun`) is the fused-row surface REQ-024 names, and it reads `isRunRefused` from `command-attach.ts` at `:1084`.
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2854` (`test_deep_loop_offer_gate_parity`) is the Python entry point that reads the shared fixture, which is what AC-044 cites it for.

## Edge Cases

- **Suite counts cannot be verified from the tree.** T081, T092 and AC-042/AC-048 quote whole-suite totals (184 files 3,029; 184 files 3,188; 186 files 3,415). Re-running `vitest` writes cache outside the lineage's write surface, so these are recorded as unverified rather than as passes or findings; the ordering they describe is monotonic, which is consistent with three successive rounds.
- **A pointer that lands inside a list is not drift.** T076's `:518`, `:695`, `:811` and `:922` sit inside the lists they name, and `:215`, `:330`, `:354`, `:413`, `:450`, `:581` and `:874` land exactly on declarations. Those cells are counted clean; only the cells read above are reported.
- **T082's CHK-001 line is historical.** The "34 then 39" sequence is consistent with the rounds; only the parenthesised `:245` pointer is stale, so the finding is scoped to the pointer.

## Confirmed-Clean Surfaces

- `tasks.md` T065, T067 (substance), T071, T073, T074, T077, T078, T079 (substance), T080, T081 (substance), T083, T085, T088 to T101 (substance), CHK-001, CHK-002, CHK-010, CHK-011, CHK-012, CHK-013, CHK-020, CHK-021, CHK-022, CHK-023, CHK-FIX-001 to CHK-FIX-007, CHK-030, CHK-031, CHK-032, CHK-040, CHK-041, CHK-042, CHK-050, CHK-051.
- `spec.md` REQ-020, REQ-029, SC-005 and `acceptance-criteria.md` AC-027 all state the ADR-005 typed-on-stuck exception consistently.

## Ruled Out

- "The Verification Summary overstates what was verified": it states 11 of 12 P0, exactly matching the one open P0 box at `:266`.
- "A spec label or path leaked into the changed code comments": the hygiene search over five changed files prints nothing.
- "T076's whole array-anchor list is stale": ten of its fifteen anchors land on or inside the list they name.

## SCOPE VIOLATIONS

None.

## Next Focus

- Dimension: traceability
- Focus: the sixth-round slice - REQ-023 to REQ-034 against the gate, and AC-030 to AC-042 against their cited rows, with ADR-005 and ADR-006 read as the decisions that record the two exceptions
- Reason: the operator focus names the sixth round explicitly; iterations 1 and 2 covered the citation layer, this one covers the behaviour those ten requirements state.
- Rotation status: traceability continues; `checklist_evidence` recorded `partial`.

Review verdict: PASS
