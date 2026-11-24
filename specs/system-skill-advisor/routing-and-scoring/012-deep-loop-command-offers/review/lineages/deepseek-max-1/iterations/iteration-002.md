# Review Iteration 002

## Dispatcher

LEAF deep-review iteration 2 of 5, lineage `deepseek-max-1`, session `fanout-deepseek-max-1-1795514074741-gl47kr`, generation 4, lineageMode `new`.
Mode review; dimension `traceability`; core protocols `spec_code` and `checklist_evidence`.
Operator review focus: finish the `spec_code` and `checklist_evidence` protocols; check every REQ against the code or decision that implements it, and every `Met` row against evidence that exists.

This iteration carried the focus into the second band: REQ-013 to REQ-022 against the shared fixture, the two gate copies and the recorded corpus, and AC-020 to AC-033 against those surfaces.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:225-234` (REQ-013 to REQ-022)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:77-91` (AC-020 to AC-033)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:124-167,294-300`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:93-310` (ADR-001, ADR-002, ADR-003)
- `.skilled/changelog/skilled/v4.2.0.0.md:478-486,755-762`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (split census, 92 holdout rows)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:675-735`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:470-485`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1-254` (all 248 cases, read programmatically)
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2855-2975,3013-3060`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5227-5272,5343-5388`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts:190-245`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts:1-60`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json` (rows N9, H3b, R2, V2, V4, H7, H10, K2)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:153-160`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The closure docs disagree on the final advisor suite counts** -- `tasks.md:163` -- `refines iter1-P2-fixture-count`. AC-042 and T081 record the sixth-round run as 184 files, 3,029 passed and `cases=203`; T087 and the changelog record the seventh-round run as 184 files, 3,126 passed; the shared fixture now holds 248 cases. The three numbers describe three different trees, but AC-042 and the changelog both call their run the final one, so a reader cannot tell which count certifies the built tree.
   Finding class: matrix/evidence (closure-doc count drift across three documents).
   Scope proof: `tasks.md:163` states 3,029; `tasks.md:174` states 3,126; `.skilled/changelog/skilled/v4.2.0.0.md:759` states 3,126; `acceptance-criteria.md:99` states 3,029 with `cases=203`; `tests/fixtures/deep-loop-offer-cases.json` holds 248 cases.
   Affected surface hints: `tasks.md:163`, `tasks.md:174`, `acceptance-criteria.md:99`, `.skilled/changelog/skilled/v4.2.0.0.md:759`, `tests/fixtures/deep-loop-offer-cases.json`.
   Case: an operator asks which suite run closed the packet, and the packet answers 3,029 in two places and 3,126 in two others, with the fixture the suite reads at neither stated size.

## Traceability Checks

### spec_code

- REQ-013: the corpus holds 92 `holdout` rows; the three deep-family rows are the `-04` generation (`cmd-deep-review-plain-holdout-04`, `cmd-deep-research-plain-holdout-04`, `cmd-doctor-deep-loop-plain-holdout-04`), and every builder that reads `split === 'holdout'` skips or labels it rather than tuning on it (`run-command-behaviour.mjs:682,727`, `capture-command-routing-baseline.mjs:474-477`, `score-command-transcripts.mjs:1792`). [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:682]
- REQ-014: N9 reads `system-deep-loop cmd=- pol=- fresh=live exit=0` in the 69-probe file; no `/deep:*` command. REQ-014's clause holds.
- REQ-015: all six refusal prompts are fixture rows with `asksForLoopRun: false` (`refused-do-deep-research`, `refused-never-run`, `refused-no-need-to-run`, `refused-not-asking-for`, `refused-bare-no`, `refused-not-needed-after`), and the control `refusal-control-do` reads `true`.
- REQ-016: `question-how-many-iterations` and `question-how-many-passes` both read `false`.
- REQ-017: `hyphen-deep-review` reads `true`, and the curly-apostrophe row `want-research-loop-curly-apostrophe` reads `true`.
- REQ-018: `negated-symptom-counted-ask` reads `true`, so the negated symptom keeps the run ask.
- REQ-019: the nine subject prompts are fixture rows reading `false` (`subject-code-noun`, `subject-result-verb`, `subject-config-noun`, `subject-standing-loop-for-every`, `subject-iterations-of-model`, `subject-hyphen-pass-compilers`, `subject-passes-failed`, `subject-multi-pass-compiler`), and the three controls read `true`.
- REQ-020: the four typed rows carry `typedReviewKept` (`false` on refused, question and doc-path; `true` on the control) and the typed-stuck row carries `typedReviewKept: false` with `servedReviewKept: true`; `_apply_deep_loop_offer_gate` reads the same clauses through `_deep_command_only_mentioned` and marks a kept typed row at `skill_advisor.py:5384`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5343]
- REQ-021: the 69-probe file holds every gain, keep and negative row with `live`/`exit 0`; the corpus `false_offer` counts are the recorded `implementation-summary.md:155,160` rows (0 of 57), not recomputed here.
- REQ-022: the changelog states the refusal rule, names the brief change and the typed `(ask)` head (`v4.2.0.0.md:482-486`), quotes the seventh-round suite at `:759`, and AC-008 reads `Waived` with ADR-003 recorded at `decision-record.md:223,308`.

### checklist_evidence

- AC-020 to AC-033 read against their cited lines: 14 rows, 14 evidence cells resolve, and 13 hold what the row says they hold. AC-030's `cases=203` is the one stale cell, folded into finding 1; its `rg -c 'refusal-verb-'` census still prints 11 on the current fixture.
- The `tasks.md` Verification Summary agrees with the boxes it counts: 12 P0 CHK items with CHK-020 open (11/12), 13 P1 (13/13), 1 P2 (1/1); the T-task list holds 87 tasks of which 86 are ticked and T084 is the one open item, which matches CHK-020's AC-040 note.

## Integration Evidence

- The fixture is the shared parity surface: `tests/deep-loop-offer-cases.vitest.ts` reads it for the native gate and `tests/python/test_skill_advisor.py:2857` reads the same file for the fallback, so REQ-021's parity claim has one source of truth.
- `run-command-behaviour.mjs` and `capture-command-routing-baseline.mjs` are the builders that read `split`; both skip holdout rows for tuning and publishing, which is what REQ-013's no-builder clause means.

## Edge Cases

- The fixture's `typedReviewKept` and `servedReviewKept` columns disagree on the typed-stuck row by design (ADR-005). A reader who treats the two columns as duplicates will report a false parity failure.
- Three holdout rows and 89 other holdout rows are `holdout`, but only the three deep-family `-04` rows are in REQ-013's scope; counting all 92 would overstate the requirement.
- The changelog line 759 is the seventh-round count while line 482-486 describes the sixth-round behaviour; both are true statements about different rounds, which is why the count drift is a documentation defect rather than a behaviour contradiction.

## Confirmed-Clean Surfaces

- Every REQ-015 to REQ-019 prompt is present in the shared fixture with the stated boolean; no prompt is missing and no stated result is inverted.
- The Python gate's doctor branch and the native fused doctor row agree on the refused, questioned and bare namings of `/doctor:deep-loop`.
- The stage-one lane's `passesAsked` gate and the deferred-route `namesLoopSubject` blanking both read the same `asksForLoopRun` predicate as the command gate, so no second reading of the loop vocabulary exists.

## Ruled Out

- A missing fixture row for any REQ-015 to REQ-019 prompt: ruled out by prompt-substring search over all 248 cases.
- A TypeScript/Python divergence on the typed-stuck, typed-refused, typed-question or typed-doc-path rows: ruled out at the gate layer by the shared `typedReviewKept`/`servedReviewKept` columns and the Python `_apply_deep_loop_offer_gate` clauses.
- A builder that tunes on a holdout row: ruled out by reading the three split readers; each skips or labels holdout rows.
- A Verification Summary miscount: ruled out by counting the CHK boxes and matching 12/13/1 with 11/13/1 verified.

## Next Focus

- Dimension: traceability
- Focus area: REQ-023 to REQ-034 and AC-030 to AC-043, including ADR-005 and ADR-006, with the sixth-round refusal, stuck, typed, long-prompt and drift-guard clauses read against both copies.
- Reason: the second band is settled; the sixth round is the newest code and carries the operator's named ADRs.
- Rotation status: traceability pass 2 of 3 complete.
- Blocked/productive carry-forward: the fixture-row comparison is productive and continues; the count sweep is productive and produced finding 1.
- Required evidence: both gate copies for REQ-023 to REQ-032, ADR-005/ADR-006 text, and the reducer refinement test for REQ-032.

Review verdict: PASS
