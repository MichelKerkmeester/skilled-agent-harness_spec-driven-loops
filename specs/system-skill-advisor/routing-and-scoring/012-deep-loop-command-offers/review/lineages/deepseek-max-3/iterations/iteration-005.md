# Review Iteration 5

## Dispatcher

- Resolved route: mode=review target_agent=deep-review
- Run: `fanout-deepseek-max-3-1795552859377-13gxwk`, lineage `deepseek-max-3`, generation 1
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Dimension: traceability
- Steer file: absent at dispatch time
- Operator review focus addressed: the second traceability batch. It checks `REQ-020` to `REQ-039` against the two gate copies, the kept corpus and the tests that pin them, and `AC-030` to `AC-043` against the fixture fields, test titles and artifacts they name.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:230-270`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:87-100`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:131-186`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:317-700`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/ac034-served-head.jsonl:1-2`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:120-160, 269-340`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:630-660, 1115-1160`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts:18-30`
- `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:105-160`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts:348-370`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2854-2880, 3050-3060`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:445-472`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1056-1095`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:557-580, 1150-1250, 1630-1705`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5230-5440, 5743-5860`
- `.skilled/changelog/skilled/v4.2.0.0.md:480-490`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new in this iteration. Iteration 1's active P1 keeps the verdict at CONDITIONAL.

### P2 Findings

None new in this iteration. The four open P2s from iterations 1 to 4 remain active.

## Traceability Checks

- `spec_code` (partial, `REQ-020` to `REQ-039`):
  - `REQ-020`: the fallback gate drops the run row on `don't run /deep:review, explain the review loop`, `what does /deep:review do?` and `see (/deep:review.md) for the flags`, and keeps it on `run /deep:review on the parser`; the fixture pins the native side with `typedReviewKept` and the typed-stuck case with `typedReviewKept: false`. Evidence: `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:123`.
  - `REQ-021`: every `REQ-015` to `REQ-020` prompt is a fixture row, and iteration 1 replayed all 359 rows through the fallback with zero mismatches; the corpus `false_offer` is 0 of 57. Evidence: `tests/fixtures/deep-loop-offer-cases.json:1`.
  - `REQ-022`: the changelog states the refusal rule as built (`v4.2.0.0.md:484`), names the brief options and the typed `(ask)` (`:483`), and its suite row quotes 186 files / 3,518 passed (`:759`); AC-008 reads `Waived` with ADR-003. Evidence: `.skilled/changelog/skilled/v4.2.0.0.md:482`.
  - `REQ-023`: all six refusal prompts return `False` from the fallback gate and the three controls return `True`; the same engine reads the `refusal-verb-*` fixture rows, which number 12 as AC-030 says. Evidence: `tests/fixtures/deep-loop-offer-cases.json:129`.
  - `REQ-024`: the fallback gate returns no diagnostic row for both run-refusing stuck prompts and keeps it for the plain stuck prompt; the fixture's `doctorWithheld` column is 47 rows, 27 true and 20 false, as AC-031 says. Evidence: `tests/fixtures/deep-loop-offer-cases.json:145`.
  - `REQ-025`: the fixture carries four `typedRunsKept` rows, including `typed-two-commands-changelog` and `typed-two-commands-doctor`, each keeping `/deep:review`; `typedCommandIn` still returns its longest key and `typedCommandsIn` the ordered list. Evidence: `command-attach.ts:252-292`.
  - `REQ-026` and `REQ-042`: the fallback's `_asked_loop_mode` returns `review` for both deferred prompts and for the routed single-target prompt, and `routedLoopMode` reads the same ask in the native branch (`command-attach.ts:1694`). Evidence: `command-attach.ts:1694`.
  - `REQ-027`: `passesAsked` reads the passes wording only when `asksForLoopRun` or `isStuckRunComplaint` holds (`explicit.ts:454`), and the kept served-head artifact shows both prompts' outcomes (`scratch/probes/ac034-served-head.jsonl:1-2`). Evidence: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454`.
  - `REQ-028`: both degraded paths are pinned by test titles that exist (`command-brief-golden.vitest.ts:353` prints a typed deep command plainly; `:364` keeps the offer options on an unmarked row). Evidence: `tests/command-brief-golden.vitest.ts:353`.
  - `REQ-029`: the fixture row `typed-stuck` reads `typedReviewKept: false` and `servedReviewKept: true`; `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:112` pins the served head and `:153` the untyped complaint; `test_deep_loop_typed_run_row_marked` pins the Python `typed` field. Evidence: `tests/fixtures/deep-loop-offer-cases.json:123`.
  - `REQ-030`: the fallback reads the same 10,000-code-unit head as the schema (`skill_advisor.py:888`, `advisor-tool-schemas.ts:257`) and both lead reads use 400 code units (`command-attach.ts:784`, `skill_advisor.py:5230`); observed this run, a 96,000-character prompt cuts in 1 ms and a 10,000-character repeated refusal gates in 17 ms. Evidence: `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888`.
  - `REQ-031`: every exported gate list is compared or documented out (iteration 3), including the numeric pairs and the four quantifier pairs, and `_LOOP_DIGIT_COUNT_RE` is compared with `ITERATION_COUNT` (`deep-loop-offer-cases.vitest.ts:506`). Evidence: `tests/deep-loop-offer-cases.vitest.ts:120`.
  - `REQ-032`: `refinesSameLocation` keeps a refinement at another file or declared dimension as its own entry and folds one at the same file (`reduce-state.cjs:1011`). Evidence: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1011`.
  - `REQ-033`: this run is the rerun the requirement names; `spec_code` and `checklist_evidence` are recorded as partial here and are raised to pass in iteration 7 once the full REQ and AC ranges are traced. Evidence: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:257`.
  - `REQ-034`: the fixture header names the layer each typed column pins, limitations 6, 7 and 8 carry the typed-on-stuck exception and the served-brief gap, the changelog carries the refusal and typed-on-stuck lines, packet 013's `Reopened: degraded paths` row carries its evidence, and the `Verification Summary` matches its boxes. Evidence: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:285`.
  - `REQ-035` to `REQ-037`: every prompt the requirements name returns its stated result from the fallback gate, including the thirteen plural rows, the two how-do/how-can questions plus the run-after-question control, and the thirteen effort complaints plus four manner controls. The one exception is the interaction finding 1 records: a how-to question with a later digit count. Evidence: `tests/fixtures/deep-loop-offer-cases.json:269`.
  - `REQ-038`: the degraded path renders only a tracked command the row's own skill owns (`skill-advisor-cli.ts:1489-1493`), and the three test titles AC-047 cites exist. Evidence: `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489`.
  - `REQ-039`: the committed baseline records `false_offer` 0 of 57 and its capture SHA, and the near-miss rows are recorded individually. Evidence: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:1`.
- `checklist_evidence` (partial, `AC-030` to `AC-043`):
  - `AC-030`: fixture `refusal-verb-` rows number 12; seven refusals read `false`, three controls plus two conjunction controls read `true`. Observed in the fixture. Evidence: `tests/fixtures/deep-loop-offer-cases.json:129`.
  - `AC-031`: 47 `doctorWithheld` rows, 27 true and 20 false; the three named rows read true, true and false. Observed in the fixture.
  - `AC-032`: four `typedRunsKept` rows exist, the two named ones carry `/deep:review`; the guard test file exists.
  - `AC-033`: the `names the review mode on a deferred route` case exists at `command-attach-guards.vitest.ts:1125`, and the no-command control at `:1151`.
  - `AC-034`: the stage-one test titles exist at `stage-one-loop-subject.vitest.ts:20` and `:26`, and the served-head artifact repeats both outcomes.
  - `AC-035` to `AC-037`: the named test titles exist in `command-brief-golden.vitest.ts`, `subprocess-typed-fields.vitest.ts`, `cli-degraded-command-contract.vitest.ts`, `typed-on-stuck-serving.vitest.ts` and the Python suite (`DEEP-LOOP-LONG` at `test_skill_advisor.py:3054`).
  - `AC-038` and `AC-059`: the drift guard tables and the coverage test exist; iteration 3 records the one accounting gap in the coverage test (finding 3).
  - `AC-039`: `refinesSameLocation` and the two unit test files exist; the code matches `REQ-032`.
  - `AC-040`: reads `Unmet` and names the archived reports; the status is accurate for the run before this one, and this rerun is the one that decides it. No change is made to the row by this read-only review.
  - `AC-041`: the closure docs named in the cell all carry the built behaviour (see `REQ-034`), and the `Verification Summary` matches the boxes (iteration 3).
  - `AC-042`: the cell's counts match the rows it cites; the current tree's suite was not rerun because a build would write outside the lineage.
  - `AC-043`: both hub files carry the two aliases and neither carries `autonomous research` (iteration 4).

Both protocols remain `partial`; iteration 6 carries `REQ-040` to `REQ-053` and `AC-044` to `AC-061`, and iteration 7 raises both to `pass` with the full-range evidence.

## Integration Evidence

- `PYTHONDONTWRITEBYTECODE=1 python3` evaluated the fallback gate for every `REQ-020`, `REQ-023`, `REQ-024`, `REQ-025`, `REQ-026`, `REQ-035`, `REQ-036`, `REQ-037`, `REQ-040`, `REQ-041`, `REQ-043` and `REQ-044` prompt named in the requirement text.
- The shared fixture was read as data (359 cases) for the `typedRunsKept`, `doctorWithheld`, `servedReviewKept` and `servedRun` columns.
- The stage-one lane was read in `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` and matched against `REQ-027` and `AC-034`.

## Edge Cases

- `AC-042`'s suite count cannot be reproduced without `npm run build`, which would write to the gitignored `dist/` outside this lineage; the cell's count is read as a recorded observation and its cited rows are verified instead.
- `REQ-033` is a requirement about this review rather than about a file, so its status is the one this run records: partial until iteration 7 raises both protocols to pass.
- The Python `_apply_deep_loop_offer_gate` keeps the doctor row beside the typed run row on the typed-stuck prompt; the served head leads with the typed row because `_order_deep_loop_rows` orders by the typed command first. That matches ADR-005's "both served heads keep the typed command".

## Confirmed-Clean Surfaces

- Every fixture column count the acceptance rows quote matches the file exactly (12 refusal rows, 47 doctor rows with 27/20, 4 typed-run rows, 4 `servedRun: none` rows).
- The fallback gate returns the stated result for every requirement prompt named in `REQ-023`, `REQ-024`, `REQ-035`, `REQ-036`, `REQ-037`, `REQ-040`, `REQ-041`, `REQ-043` and `REQ-044`.
- `REQ-020`'s gate-layer parity holds in both directions on the four typed prompts plus the control.
- `REQ-034`'s closure docs are consistent with the tree: limitations 6 to 8, the changelog lines, packet 013's degraded-path row and the verification summary.

## Ruled Out

- A fixture-count drift in `AC-030` to `AC-032`: every count matches the file.
- A missing test title behind `AC-033` to `AC-037`: each named title exists.
- A regression in `REQ-023` to `REQ-029` and `REQ-035` to `REQ-037`: every named prompt returns its stated result except the interaction recorded as finding 1.
- A missing reducer refinement rule (`REQ-032`): the implementation matches the wording.

## Next Focus

- Dimension: traceability
- Focus area: `spec_code` over `REQ-040` to `REQ-053` and `checklist_evidence` over `AC-044` to `AC-061`, including the twelfth fix round (`T112` to `T114`) and the ADR-008 mode-free amendment
- Reason: the last requirements and acceptance rows, including the newest code change (`REQ-053`) and the focus rewrite (`T114`)
- Rotation status: traceability in progress; iteration 7 closes the protocols
- Blocked/productive carry-forward: the fallback gate, the fixture and the corpus are productive; the newest commit needs its own read
- Required evidence: each requirement's stated prompts, the twelfth-round diff, and the closure rows that cite the twelfth round

Review verdict: CONDITIONAL
