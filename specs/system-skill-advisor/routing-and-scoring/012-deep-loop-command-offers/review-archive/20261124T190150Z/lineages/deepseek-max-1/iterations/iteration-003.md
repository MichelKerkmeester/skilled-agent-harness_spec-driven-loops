# Iteration 003 - Traceability (sixth-round slice: REQ-023 to REQ-034, AC-030 to AC-042)

## Dispatcher

- Mode: review, lineage `deepseek-max-1`, generation 1, iteration 3 of 7.
- Dimension: traceability, third slice: the sixth fix round the operator focus names - REQ-023 to REQ-034 against the gate, AC-030 to AC-042 against their cells, and ADR-005 / ADR-006 read as the decisions that record the two exceptions.
- Operator review focus: the focus names this round explicitly ("including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006)"), so this iteration checks the behaviour those ten requirements state rather than the citation layer alone.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235` to `:246` (REQ-023 to REQ-034), `:277`, `:300`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:87` to `:99` (AC-030 to AC-042)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412` (ADR-005), `:508` (ADR-006), `:833`, `:834`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2` (header), `:120`, `:123`, `:129`, `:138`, and the parsed case table (347 rows)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:494` (`DEFECT_CHECK_VERBS`), `:528`, `:897`, `:899`, `:1554`, `:1666` (`loopAskCues`), `:1682` (`namesLoopSubject` skip), `:1693` (`askedLoopMode`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454` (`passesAsked`), `:457`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074`, `:1084`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257` (`ADVISOR_PROMPT_MAX_CHARS = 10_000`), `:262`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888` (`_advisor_prompt_head`), `:5181`, `:5646`, `:5745`, `:6561`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts:206`, `:253`; `tests/scorer/stage-one-loop-subject.vitest.ts:20`, `:26`; `tests/command-attach-guards.vitest.ts:808`, `:1135`; `tests/python/test_skill_advisor.py:2854`, `:2875`
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995`; `runtime/tests/unit/reduce-state-refinement-other-file.vitest.ts`, `runtime/tests/unit/synthesis-closeout-refinements.vitest.ts`, `runtime/tests/unit/fanout-merge.vitest.ts` (existence)
- `.skilled/changelog/skilled/v4.2.0.0.md:482` to `:484`, `:759`; `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md:123`; `implementation-summary.md:236`, `:238`, `:266`, `:267`, `:268`

## Findings - New

### P0 Findings

None.

### P1 Findings

None. Every behavioural claim in the sixth-round slice holds on the tree; the two findings are counts in cells that measured an earlier case table.

### P2 Findings

1. **AC-030's fixture-grep count no longer matches the fixture** -- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:129` -- AC-030 states "`rg -c 'refusal-verb-' tests/fixtures/deep-loop-offer-cases.json` prints 11"; the search prints 12 (`refusal-verb-skip`, `-avoid`, `-no-need-for`, `-instead-of`, `-refuse`, `-even-think`, `-skip-to-control`, `-hesitate-control`, `-forget-control`, `-conjunction-skip`, `-conjunction-avoid`, `-refused-to`). The six refusal rows the criterion is about still read `asksForLoopRun: false` and the five controls still read `true`, so the criterion holds and only its count is stale.
   Finding class: closure-count drift.
   Scope proof: `rg -c 'refusal-verb-'` over the cited file returned 12; the parsed table shows 18 rows in the refusal family with the expected true/false split.
   Affected surface hints: `acceptance-criteria.md` AC-030 cell.
   Case: a reader re-running the row's own command gets 12 and cannot tell whether a case was added or a case changed value.

2. **AC-031's `doctorWithheld` population is 47 rows, not 26** -- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:138` -- AC-031 says "26 fixture rows carry `doctorWithheld`"; the table carries 47 (27 `true`, 20 `false`), because the ninth round added the refusal-cue, typed-doctor and no-edit families that also carry the column. The three prompts the criterion names - the two run-refusing stuck prompts and the plain control - still agree across `attachCommand`, the fused row and the Python gate.
   Finding class: closure-count drift.
   Scope proof: a parse of the fixture counts `doctorWithheld` on 47 cases and prints the true/false split.
   Affected surface hints: `acceptance-criteria.md` AC-031 cell.
   Case: a reader checking the row's "26" against the table counts 47 and must guess whether the extra rows weaken the claim.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` (sixth-round slice: REQ-023 to REQ-034) | partial | Every stated behaviour is present in the gate, the scorer, the reducer and the closure docs; two AC cells record a count the case table no longer holds. |

Requirement by requirement:

- REQ-023: `RUN_ASK_REFUSAL_LEADS` at `command-attach.ts:688` builds `RUN_ASK_NEGATED_SOURCE` at `:736` through `windowedPattern`; the fixture's six refusal rows read `false` and its three keep controls plus two conjunction controls read `true`.
- REQ-024: `RUN_REFUSED` at `:897` with `isRunRefused` at `:899`, read by the doctor branch at `:1554` and by `withholdDeepLoopDoctorWithoutRun` at `fusion.ts:1074`/`:1084`. The fused-row cases at `doctor-handoff-command.vitest.ts:206` and `:253` pass on the plain complaint and withhold on both refusing prompts.
- REQ-025: `typedCommandsIn` at `:274` lists every typed key, `typedCommandForTop` at `:304` walks it, and `typedCommandIn` at `:251` still answers its longest key. The two `typed-two-commands-*` rows carry `typedRunsKept: ["/deep:review"]`.
- REQ-026: `loopAskCues` at `:1666` blanks a refused phrase at its own length and then blanks a `NAMED_LOOP_MODE` match that `namesLoopSubject` reads as the subject (`:1682`); `DEFECT_CHECK_VERBS` at `:494` carries `checking`, `inspecting`, `scanning`, `examining`, `going over` and `looking over`. The routed case is at `command-attach-guards.vitest.ts:1135`.
- REQ-027: `explicit.ts:454` gates `passesAsked` on `asksForLoopRun(lower) || isStuckRunComplaint(lower)`; `stage-one-loop-subject.vitest.ts:20` keeps the lane and `:26` drops it.
- REQ-028: both degraded heads are pinned by `command-brief-golden.vitest.ts:353` (plain typed deep command) and `:364` (offer kept on an untyped row); `subprocess-typed-fields.vitest.ts:88` keeps command, policy, owner and marker.
- REQ-029: the fixture's `typed-stuck` row carries `typedReviewKept: false` and `servedReviewKept: true`, and the header at `:2` names the layer each column pins. Python reads `servedReviewKept` at `test_skill_advisor.py:2875`.
- REQ-030: `ADVISOR_PROMPT_MAX_CHARS = 10_000` at `advisor-tool-schemas.ts:257` and `:262`; `_advisor_prompt_head` at `skill_advisor.py:888` counts UTF-16 units the way JavaScript does, and the gate call is at `:6561`; `_LEAD_WINDOW = 400` at `:5181`.
- REQ-031: the vocabulary guard exists and is stricter than stated - 22 compared pairs rather than fifteen (iteration 2, R2-P2-007).
- REQ-032: `refinesSameLocation` at `reduce-state.cjs:995`, and the three test files the row names exist in `system-deep-loop/runtime/tests/unit/`.
- REQ-033: not met by this build; AC-040 reads `Unmet` and says so, which is what the closure statement at `acceptance-criteria.md:137` records. This run is the rerun that decides the row.
- REQ-034: the closure docs name the built behaviour - fixture header `:2`, `implementation-summary.md:236`, `:238`, `:266`, `:267`, `:268`, changelog `:482` to `:484` and `:759`, packet 013 `:123` - and the two counts above are the exceptions.

Decisions read as the record of the exceptions:

- ADR-005 (`decision-record.md:412`) records that a typed deep command outranks the stuck-run diagnosis on the served head, which is the REQ-029 exception; Q034 at `:833` traces it to limitation 6.
- ADR-006 (`:508`) records that a bare deep loop name is not a loop ask; the fixture row `bare-loop-name` pins it at `asksForLoopRun: false`, and Q035 at `:834` records the sixth round's autonomy.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074` is the fused-row producer REQ-024 names, and its refusal read at `:1084` is the exact hand-off from `command-attach.ts:899`.
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2` is the contract both suites read; its header is what makes the typed columns auditable, and it names the `attachCommand` layer, the `attachTypedCommand` head and the Python gate separately.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995` is the reducer REQ-032 changes, and `runtime/tests/unit/reduce-state-refinement-other-file.vitest.ts` is the test it names.

## Edge Cases

- AC-040 is `Unmet` by declaration. This run is its evidence, so it is not counted as a finding at any severity; the closure statement already blocks closure on it.
- The `doctorWithheld` and `refusal-verb` counts grew because the ninth round added families to the same table. The criterion each row states still holds; the finding is scoped to the count in the cell.
- REQ-033's gate result is decided at synthesis, not here: an iteration cannot certify its own coverage.

## Confirmed-Clean Surfaces

- REQ-023, REQ-024, REQ-025, REQ-026, REQ-027, REQ-028, REQ-029, REQ-030, REQ-032, REQ-034: every symbol, list entry and test line each requirement names exists as claimed.
- ADR-005 and ADR-006 exist, are numbered in sequence, and each names the requirement and acceptance row it governs.
- AC-032, AC-033, AC-034, AC-035, AC-036, AC-039, AC-041: the resolution of their anchors was recorded in iteration 1; their substance is confirmed here.

## Ruled Out

- "The refusal vocabulary is missing a lead the fixture pins": the list at `:688` builds the pattern at `:736`, and all six refusal rows read false.
- "The fused doctor row ignores a refusal": `withholdDeepLoopDoctorWithoutRun` calls `isRunRefused` at `fusion.ts:1084`, and the two withhold cases pass.
- "The Python head counts characters rather than UTF-16 units": `_advisor_prompt_head` adds two units above `0xFFFF` before comparing with `ADVISOR_PROMPT_MAX_CHARS`.

## SCOPE VIOLATIONS

None.

## Next Focus

- Dimension: traceability
- Focus: the seventh-to-ninth round - REQ-035 to REQ-046 against the gate and scorer, AC-043 to AC-054 against their cells, ADR-007 and ADR-008 read as the decisions
- Reason: the sixth-round slice is complete; the remaining requirements are the ones the last three review generations found gaps in, so they carry the highest residual risk.
- Rotation status: traceability continues; `spec_code` remains `partial` on the citation layer.

Review verdict: PASS
