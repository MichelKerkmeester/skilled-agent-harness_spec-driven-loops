# Review Iteration 004 — Traceability (`spec_code`, sixth fix round and its decisions)

## Dispatcher

- Lineage `review/lineages/deepseek-max-1`, iteration 4 of 7, session `fanout-deepseek-max-1-1795550334883-gjbarh`
- Dimension: D3 traceability. Operator focus, taken literally this iteration: every REQ in the sixth fix round (REQ-023 to REQ-034) against the code that implements it or the decision that records it, including ADR-005 and ADR-006.
- Method: each REQ was matched to a named symbol in `command-attach.ts`, `scorer/fusion.ts`, `explicit.ts`, `skill_advisor.py` or `reduce-state.cjs`, then the decision record was read to see whether the requirement states the same contract the code has.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:247` (REQ-023 to REQ-034)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412` (ADR-005, read in full) and `:508` (ADR-006, read in full)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:172`, `:252`, `:257`, `:259`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:944` (`isRunRefused`), `:1147` (`namesLoopSubject`), `:1245` (`isLoopQuestion`), `:1693` (`routedLoopMode`), `RUN_ASK_REFUSAL_VERBS`, `RUN_ASK_REFUSAL_CANCEL_LEADS`, `DEFECT_CHECK`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074` (`withholdDeepLoopDoctorWithoutRun`), `:1487` (its call site)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5141` (`is_stuck_run_complaint`), and its `_RUN_ASK_REFUSAL_VERB_LIST`, `_RUN_ASK_REFUSAL_CANCEL_LEAD_LIST`, `_loop_ask_cues`, `_is_loop_workflow_request`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` (`$comment`, `typedReviewKept`, `servedReviewKept`, `servedRun`)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:103`, `:207`, `:263`, `:324`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2875`, `:2905`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:895`, `:919`, `:991`, `:1085`
- `.skilled/changelog/skilled/v4.2.0.0.md:482`, `:484`
- `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md:123`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Level | Status this iteration | Evidence |
| --- | --- | --- | --- |
| `spec_code` | core | partial | REQ-023: `RUN_ASK_REFUSAL_VERBS` in `command-attach.ts` and `_RUN_ASK_REFUSAL_VERB_LIST` in `skill_advisor.py`, both compared by the guard. REQ-024: `withholdDeepLoopDoctorWithoutRun` (`scorer/fusion.ts:1074`, called at `:1487`) plus `is_stuck_run_complaint` in each copy (`skill_advisor.py:5141`). REQ-025: `typedCommandsIn` and `typedCommandForTop` (`command-attach.ts:274`, `:304`). REQ-026: `loopAskCues` and `DEFECT_CHECK` (`command-attach.ts`). REQ-027: the stage-one lane file `scorer/lanes/explicit.ts` and the Python `_is_loop_workflow_request`. REQ-028: the degraded renderer and its golden file. REQ-029: `attachTypedCommand` after `enrichCompiledRoutes` (iteration 1). REQ-030: iteration 2. REQ-031: `VOCABULARY_PAIRS` (iteration 1, with the AC-038 count drift). REQ-032: `refinesSameLocation` (`reduce-state.cjs:1011`). REQ-033: this run is the rerun the requirement names, and its own terminal gates are decided at synthesis, so the row is carried, not asserted. REQ-034: read below. REQ-035 to REQ-051 remain, so the protocol stays `partial`. |
| `checklist_evidence` | core | partial | AC-030, AC-031, AC-032, AC-033, AC-034, AC-035, AC-036, AC-037, AC-038 and AC-042 were read against their named fixtures and tests. The fixture columns those cells rely on exist and are read the way the cells say: `typedReviewKept` and `servedReviewKept` appear together on 5 cases and are asserted by `deep-loop-offer-cases.vitest.ts:263` and `:269` and by `test_skill_advisor.py:2875`, while `servedRun` appears on 31 cases and is asserted by `:324` and `:2905`. AC-038 remains the one stale cell (DR1-P2-001). |

## Integration Evidence

- ADR-005's contract is implemented where the decision says it is: the decision names two fixture columns, `typedReviewKept` for the `attachCommand` layer and `servedReviewKept` for the served head, and the fixture reads exactly that way in its `$comment` ("typedReviewKept ... at the attachCommand layer in TypeScript, on a single review route and before the typed-command override"; "servedReviewKept ... attachTypedCommand over the attachCommand result in TypeScript"). The TypeScript suite reads the served column through `attachTypedCommand` (`deep-loop-offer-cases.vitest.ts:268` to `:269`) and the Python suite reads the gate (`test_skill_advisor.py:2875` to `:2887`).
- ADR-006's contract is implemented where the decision says it is: the decision names `LOOP_NAMES` read only through the verb-led alternations of `LOOP_REQUEST`, pins the row "deep loop: audit the payments flow" as no ask, and the fixture's `servedRun` column carries `"none"` for the mode-free asks (`deep-loop-offer-cases.vitest.ts:324`).
- REQ-034's closure-doc claims were read rather than assumed: the fixture `$comment` names the layer each typed column pins; `implementation-summary.md:252` states the typed-on-stuck exception and says the native and fallback split limitation 6 recorded is gone; `:257` records limitation 8 as the untyped loop ask; the fifth-round sentence "A stuck run drops the run row" no longer appears anywhere in the file; `.skilled/changelog/skilled/v4.2.0.0.md:482` carries the run-or-fix exception and `:484` the refusal verbs; packet 013 records the degraded-path evidence at `implementation-summary.md:123`.

## Edge Cases

- REQ-033 is a requirement about this run. Its owning row, AC-040, reads `Unmet` (`acceptance-criteria.md:97`) and the task behind it, T084, is open (`tasks.md:166`). This iteration does not mark it met: only the synthesis's terminal gates can, and the cross-lineage merge decides the merged gate. Recorded so synthesis reads the row as carried, not as failed.
- REQ-034's claim that limitation 6 and limitation 7 were rewritten is only partly checkable by grep: the two limitations exist and the typed-on-stuck exception is stated at `implementation-summary.md:252`, but "rewritten" is a claim about a previous text that is not in the tree. It is accepted on the strength of the current text and the changelog, not on the diff.

## Confirmed-Clean Surfaces

- Every symbol REQ-023 to REQ-032 names exists with the name the requirement uses, in both the native copy and the Python copy, and the cross-copy pairs are the same pairs `VOCABULARY_PAIRS` compares.
- The typed-column contract ADR-005 states and the fixture header states agree word for word about which layer each column pins, so a reader cannot take `typedReviewKept` for a served-head claim.
- The refusal-verb and cancel-lead lists exist on both sides, which is the shape REQ-050 requires for a negation to cancel a refusal.

## Ruled Out

- ADR-005 recorded but not implemented: eliminated, the served head applies the typed command after the diagnosis on both handler paths and the fixture pins it in a column the Python suite also reads.
- ADR-006 recorded but not implemented: eliminated, the loop names are read only behind a use, continue or want verb, and the mode-free asks carry `servedRun: "none"`.
- REQ-034's changelog clause unfulfilled: eliminated, the changelog carries both the run-or-fix exception and the refusal-verb sentence.
- A "stuck run drops the run row" sentence left behind in the implementation summary: eliminated, no line in `implementation-summary.md` holds it.

## Review Focus

This iteration is the block the operator focus names first: REQ-023 to REQ-034, with ADR-005 and ADR-006 read as the records the focus asks for. All twelve requirements are traced to a named symbol or a named decision; the two decisions state the same contract the code has. The only defect in the block is the AC-038 count already carried from iteration 1.

## Next Focus

- Dimension: D3 traceability, `checklist_evidence` — every ticked task in `tasks.md` and every `Met` row of `acceptance-criteria.md`
- Focus area: the task checklist (T001 to T093) and the acceptance rows not yet opened, AC-001 to AC-008 and AC-043 to AC-059
- Reason: the second core protocol has to be finished by evidence, and the task checklist has more boxes than the acceptance list has rows
- Rotation status: `spec_code` covers REQ-001 to REQ-034; `checklist_evidence` covers AC-009 to AC-047 partially
- Blocked/productive carry-forward: the recorded-probe limitation applies to AC-001 to AC-008, which rest on the same probe file
- Required evidence: for a ticked task, the artifact or command result it names; for a `Met` row, the line or artifact that holds the observation

Review verdict: PASS
