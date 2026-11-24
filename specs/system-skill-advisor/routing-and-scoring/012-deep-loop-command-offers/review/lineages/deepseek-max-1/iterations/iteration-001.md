# Iteration 001 - Traceability (spec_code, REQ-001 to REQ-022)

## Dispatcher

- Mode: review, lineage `deepseek-max-1`, generation 1, session `fanout-deepseek-max-1-1795544069299-46zw3s`.
- Dimension: traceability. Protocol under test: `spec_code`, first slice - REQ-001 to REQ-022 against the code that implements each claim and the evidence each `Met` row cites.
- Operator review focus: finish `spec_code` and `checklist_evidence`. This iteration ran the `spec_code` half over the first two requirement generations and read every evidence anchor the owning AC-001..AC-029 rows cite.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:251` (`typedCommandIn`), `:274` (`typedCommandsIn`), `:304` (`typedCommandForTop`), `:528` (`DEFECT_CHECK`), `:688` (`RUN_ASK_REFUSAL_LEADS`), `:736` (`RUN_ASK_NEGATED_SOURCE`), `:748` (`LEAD_WINDOW`), `:897` (`RUN_REFUSED`), `:1102` (`namesLoopSubject`), `:1682` (routed mode guard call)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454` (stage-one `passesAsked`), `:457` (plural loop noun)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074` (`withholdDeepLoopDoctorWithoutRun`)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489` (`trackedCommandForOwner`), `:1503` (`degradedRecommendations`), `:1571` (read site)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187` (`parseRecommendations`), `:236` (`typedCommandForRecommendation`)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:363` (`enrichCompiledRoutes`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888` (`_advisor_prompt_head`), `:4639` (`_RUN_ASK_REFUSAL_LEAD_LIST`), `:5165` (`_RUN_ASK_NEGATED_RE`), `:5181` (`_LEAD_WINDOW`), `:5646` (`_RUN_REFUSED_RE`), `:5745` (`rec["typed"] = True`), `:5820` (`_is_loop_workflow_request`), `:6561` (`_advisor_prompt_head` call)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:532`, `:538`, `:540`, `:808`, `:852`, `:859`, `:866`, `:919`, `:942`, `:963`, `:1123`, `:1135`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:68`, `:74`, `:80`, `:83`, `:90`, `:182`, `:204`, `:485`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2`, `:120`, `:123`, `:125`, `:129`, `:138`, `:157`
- `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:107`, `:148`; `tests/handlers/advisor-recommend-typed-command.vitest.ts:91`; `tests/command-brief-golden.vitest.ts:353`, `:364`; `tests/subprocess-typed-fields.vitest.ts:88`; `tests/cli-degraded-command-contract.vitest.ts:81`, `:152`, `:178`; `tests/scorer/stage-one-loop-subject.vitest.ts:20`, `:26`; `tests/scorer/doctor-handoff-command.vitest.ts:206`, `:253`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2854`, `:2902`, `:2969`, `:2999`, `:3017`, `:3047`
- `.skilled/commands/deep/research.md:86`, `.skilled/commands/deep/review.md:81`, `.skilled/commands/deep/assets/deep-research-presentation.txt:13`, `:58`, `:223`, `:236`, `:246`, `.skilled/commands/deep/assets/deep-review-presentation.txt:237`, `:267`, `:277`, `.skilled/commands/deep/assets/deep-research.yaml:663`, `.skilled/skills/system-deep-loop/SKILL.md:20`, `.skilled/skills/system-deep-loop/hub-router.json:34`, `.skilled/skills/system-deep-loop/ROUTER.md:63`, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:94`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md` (AC-001 to AC-029 rows), `implementation-summary.md:154` to `:157`, `scratch/probes/results-after.json` (69 array rows), `scratch/decisions.md` (11 `| D` rows)

## Findings - New

### P0 Findings

None.

### P1 Findings

None. The claims this slice covers hold in the tree; what does not hold is a set of evidence pointers, recorded below at P2 with the line that actually holds each one.

### P2 Findings

1. **AC-009's depth-word span starts on an unrelated case** -- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:532` -- AC-009 cites the depth-word `it.each` list as `:532` to `:541`; `:532` is `it('offers the review command when it is the command typed', ...)`, and the list opens at `:538` (`it.each([`), with `:540` and `:541` holding the two depth words the row quotes. The evidence exists five lines lower than the span claims.
   Finding class: evidence-pointer drift.
   Scope proof: `sed -n '532p;538p;540p;541p'` of the cited file read during this iteration.
   Affected surface hints: `acceptance-criteria.md` AC-009 cell only; the test content is unchanged.
   Case: a reader following the AC-009 cell to `:532` lands on a typed-command case and cannot confirm the depth-word list without searching.

2. **REQ-031 and AC-032 point the typed-suffix evidence at two lines that do not hold it** -- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:866` -- REQ-031 says "the typed-command cases in `command-attach-guards.vitest.ts:859` and `:866` read all seven of them" `MODE_SUFFIXES`; `:866` is blank, `:859` is the `expect` of the "keeps the %s command when the loop measures the work" group (`:852` to `:860`), and the suffix cases that read seven spellings are `typedCommandIn('/deep:review:auto ...')` at `:1022` through `:1051`.
   Finding class: evidence-pointer drift.
   Scope proof: `sed -n '852,866p'` and `rg -n "MODE_SUFFIXES|:auto|:confirm"` over the cited file.
   Affected surface hints: `spec.md` REQ-031 text, `acceptance-criteria.md` AC-032 cell.
   Case: a reader verifying that all seven `MODE_SUFFIXES` entries are read finds the cited second line empty and the named group absent.

3. **AC-033 cites a comment line for the deferred-route cases it describes** -- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:963` -- AC-033 says `:963` "puts both prompts on a deferred route and both return `/deep:review`"; `:963` is the comment "`// whichever mode a routed route names`", the deferred group closes at `:964`, and the two prompts are read at `:1123` (the deferred ask) and `:1135` (the routed ask, `'a subject loop name the route scored'`).
   Finding class: evidence-pointer drift.
   Scope proof: `sed -n '940,964p'` and `rg -n "research loop config"` over the cited file.
   Affected surface hints: `acceptance-criteria.md` AC-033 cell; the guard cases themselves pass as claimed.
   Case: a reviewer opening `:963` finds a comment, not the assertion the row rests on.

4. **AC-031's Python anchor is a comment** -- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2902` -- AC-031 says the fixture's `doctorWithheld` rows are "read at `.skilled/.../tests/python/test_skill_advisor.py:2902`"; `:2902` is the comment "`# A run ask that names a mode is served by that mode's row alone`".
   Finding class: evidence-pointer drift.
   Scope proof: direct read of `:2902` this iteration.
   Affected surface hints: `acceptance-criteria.md` AC-031 cell.
   Case: a reader checking that the Python suite reads `doctorWithheld` lands on a comment about mode rows.

5. **AC-036's two Python anchors name the wrong symbols** -- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2969` -- AC-036 cites `:5482` for the gate marking the kept row `typed` and the `typed-stuck` fixture read at `:123`; `:5482` is `_command_lead(_CMD_ASK_NAMED_WORDS, _CMD_ASK_TARGET)`, the marker is `rec["typed"] = True` at `:5745`, and `test_deep_loop_typed_run_row_marked` (which T072 also cites at `:2969`) is defined at `:2999`; `:2969` holds `def test_deep_loop_doctor_naming_reading()`.
   Finding class: evidence-pointer drift.
   Scope proof: direct reads of `:2969`, `:2999`, `:5482`, `:5745` this iteration.
   Affected surface hints: `acceptance-criteria.md` AC-036 cell, `tasks.md` T072 evidence cell.
   Case: a reader opening either cited line finds a different test or an unrelated helper call.

6. **AC-037's cost-register anchors do not hold the window or the head call** -- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:5009` -- AC-037 cites `:5009` for `_LEAD_WINDOW`, `:888` for `_advisor_prompt_head` and `:6298` for the call site, and `:3017` for the long-prompt case; `:5009` is `"did",` inside an auxiliary tuple, `_LEAD_WINDOW = 400` is at `:5181`, the head call is at `:6561`, and the long-prompt test is `test_deep_loop_gate_long_prompts` at `:3047`. `:888` does resolve.
   Finding class: evidence-pointer drift.
   Scope proof: `rg -n "_LEAD_WINDOW|def _advisor_prompt_head|test_deep_loop_gate_long_prompts"` plus direct reads of `:5009`, `:6298`, `:3017`.
   Affected surface hints: `acceptance-criteria.md` AC-037 cell.
   Case: a reader checking the 400-character window at `:5009` finds a word list entry.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` (this slice: REQ-001 to REQ-022) | partial | Claim-to-code mapping confirmed for every requirement in the slice; six evidence cells name a line that no longer holds the evidence. |

Requirement-by-requirement, REQ-001 to REQ-022:

- REQ-001, REQ-002, REQ-003, REQ-004: probe evidence exists - `scratch/probes/results-after.json` parses as a 69-element array, and AC-001..AC-005 quote its gain, lose, keep and negative lines. Confirmed by shape, not re-run.
- REQ-005: both presentation files carry `### Offer From an Advisor Brief` (`deep-research-presentation.txt:13`), the `--spec-folder=<the Gate 3 answer>` composed flag (`:58`), and both command documents carry step 0 (`research.md:86`, `review.md:81`).
- REQ-006: `command-attach.ts` exports the loop patterns at the cited symbols (`:688`, `:897`), the shared fixture holds the refusal, typed and read-only families, and the guard file holds the depth-word list at `:538`. The AC-009 span anchor is finding 1.
- REQ-007: the command documents and compiled assets are outside this slice's anchors; deferred to the maintainability slice.
- REQ-008: `explicit.ts:454` gates the passes reading on the two predicates and `:457` reads `loops?`, matching the requirement.
- REQ-009: `deep-research.yaml:663` names `--extend=N` and `--restart`. Confirmed.
- REQ-010: `deep-research-presentation.txt:223/236/246` and `deep-review-presentation.txt:237/267/277` hold the question tool, `Autonomous (Recommended)` and `Native (Recommended, default)`. Confirmed.
- REQ-011: `autonomous research` is absent from `hub-router.json` and `ROUTER.md`, both carry `iterative research` and `multi-round research` (`hub-router.json:34`, `ROUTER.md:63`), and `SKILL.md:20` names `/doctor:deep-loop`. Confirmed.
- REQ-012: `command-prompts.jsonl:94` is a holdout row of the deep family; the near-miss family exists. Confirmed at file level.
- REQ-013, REQ-014: corpus rows; deferred to the maintainability slice with the rest of the corpus claims.
- REQ-015 to REQ-020: the gate symbols exist as claimed (`RUN_ASK_REFUSAL_LEADS:688`, `RUN_ASK_NEGATED_SOURCE:736`, `RUN_REFUSED:897`, Python `_RUN_ASK_REFUSAL_LEAD_LIST:4639`, `_RUN_ASK_NEGATED_RE:5165`, `_RUN_REFUSED_RE:5646`, `rec["typed"]:5745`), and the fixture rows named (`:129`, `:138`, `:123`, `:125`, `:157`) exist. The Python evidence pointers in findings 4, 5 and 6 are the drift.
- REQ-021, REQ-022: docs and suite counts; deferred to the maintainability slice.

`checklist_evidence` is not recorded here; it is the next iteration's protocol, where every ticked task's `Observed` cell is read against the cited line.

## Integration Evidence

- `.skilled/commands/deep/research.md:86` and `.skilled/commands/deep/review.md:81` are the step-0 pointer the offer section depends on; both exist.
- `.skilled/skills/system-deep-loop/hub-router.json:34` feeds the stage-two router the tests read as `HUB_ROUTER`; the aliases REQ-011 names are present in one keyword array.
- The two served-head paths REQ-029 leans on were read at their producers only: `skill-advisor-cli.ts:1503` (`degradedRecommendations`) and `subprocess.ts:187` (`parseRecommendations`). The served assertions themselves are the correctness slice's.

## Edge Cases

- A cited line that moved five lines still resolves to the right subject (finding 1); a cited line that is blank or a comment does not (findings 2, 3, 4). Both are recorded as drift, neither as a code defect.
- The fixture holds 347 cases on this tree. The eighth-round cells say 285 and the ninth-round cell T101 says 347, so the count family is recorded in the maintainability slice rather than split across two iterations.
- AC-019 is `Superseded` by ADR-001 and AC-008 `Waived` by ADR-003; the ADR existence check belongs to the sixth-round slice and is not repeated here.

## Confirmed-Clean Surfaces

- AC-006, AC-007, AC-015, AC-018, AC-043: every cited document line resolves to the sentence the row quotes.
- AC-031, AC-034, AC-035, AC-051, AC-054: the test-file anchors resolve (`doctor-handoff-command.vitest.ts:206`/`:253`, `stage-one-loop-subject.vitest.ts:20`/`:26`, `command-brief-golden.vitest.ts:353`/`:364`, `subprocess-typed-fields.vitest.ts:88`, `cli-degraded-command-contract.vitest.ts:81`/`:152`/`:178`, `deep-loop-plural-noun.vitest.ts:26`, `deep-review-strategy-heading.vitest.ts:37`, `advisor-recommend-duplicate-command.vitest.ts:57`).
- AC-032, AC-036, AC-044, AC-045, AC-046, AC-048, AC-049, AC-051, AC-053: the fixture anchors resolve (`:125`, `:123`, `:266`, `:271`, `:310`, `:313`, `:318`, `:323`, `:332`).
- `hasUnrefusedPronounRerun` sits exactly at `command-attach.ts:634`, the one code anchor AC-052 cites.

## Ruled Out

- "REQ-001 to REQ-004 regressed into code": the probe artifact is a 69-row array and the keep/negative rows are quoted from it; nothing in the gate contradicts them.
- "The offer section is missing from one presentation file": both files carry the heading and the composed flag.
- "The deep-loop names in the hub router were dropped": both aliases are present in `hub-router.json:34` and mirrored at `ROUTER.md:63`.

## SCOPE VIOLATIONS

None.

## Next Focus

- Dimension: traceability
- Focus: `checklist_evidence` - every ticked task in `tasks.md` from T065 to T101 against the line its `Observed` cell names, plus the Verification Summary counts
- Reason: the first slice found the evidence-pointer class in the AC cells; `tasks.md` is where the same class compounds, because each round added `Observed` cells against a tree that later moved.
- Rotation status: traceability continues; `spec_code` recorded `partial` and is resumed for REQ-023..REQ-046 after the checklist pass.

Review verdict: PASS
