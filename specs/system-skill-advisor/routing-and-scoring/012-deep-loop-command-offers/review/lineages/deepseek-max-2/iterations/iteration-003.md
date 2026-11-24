# Review Iteration 003 - traceability (spec_code, REQ-035 to REQ-052)

## Dispatcher

- Mode: review, lineage `deepseek-max-2`, iteration 3 of 7, dimension traceability.
- Route: `Resolved route: mode=review target_agent=deep-review`.
- This iteration closed the operator focus's `spec_code` half: REQ-035 to REQ-052, the seventh to eleventh rounds, each against the gate copy, scorer lane, reducer function or fixture column it names. Every requirement in the table has now been checked once.
- Budget: 24 tool calls, used inside it.

## Files Reviewed

- `spec.md` REQ-035 to REQ-052, SC-004, SC-006, Open Questions.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:539-551,883-885,1693-1701,1489-1494`.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:10,455,479-493`.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:363-432`.
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489-1494`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5098-5106,5406,5767`.
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121-152,430-485,503-571,600-690,750-771`.
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json`.
- `.skilled/skills/system-deep-loop/hub-router.json` (`routerSignals`); `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227,2378,2395-2470,2570-2620,2880-2900`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (247 rows).
- `decision-record.md:603-900` (ADR-007, ADR-008, ADR-009).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | REQ-001 to REQ-052 resolved (52 of 52). Iterations 1 to 3 carried the slices; the last slice's symbols are cited below. |

What this iteration bound:

- **REQ-035 (as amended by ADR-008):** the plural rows carry the seven run prompts and the five past-run, symptom and question prompts in the shared fixture; the mode-free prompt `run two deep loops on the cache layer` appears twice, once pinning the ask (`plural-deep-loops`) and once the served result (`plural-deep-loops-served`), both `servedRun: "none"`.
- **REQ-036:** `LOOP_QUESTION_AUXILIARIES` and the how-to pattern are compared through `VOCABULARY_PAIRS`; the fixture rows `how-do-run-deep-review`, `how-can-research-loop-stop` read `false` and `how-do-then-run-deep-review` reads `true`.
- **REQ-037:** `LOOP_EFFORT_LEADS`, `LOOP_EFFORT_WORDS` and `LOOP_EFFORT_CHANGE_VERBS` are exported (`command-attach.ts`), each with an `it.each` case (`deep-loop-offer-cases.vitest.ts:388,393,401`).
- **REQ-038:** `trackedCommandForOwner` (`skill-advisor-cli.ts:1489-1494`) returns undefined unless the tracked table names the command for the row's own skill or its merged alias, which is what the requirement states.
- **REQ-039:** the corpus is one file (247 rows) and the baseline is the sibling JSON; the recapture claim is evidence-row only and is read in iteration 5.
- **REQ-040:** `READ_ONLY_LOOP_MODES` and the no-edit guard at `command-attach.ts:1620` keep a read-only loop; the three `no-edit-*` rows read `readOnlyRunKept` `review`, `review`, `research`.
- **REQ-041:** `loopAskCues` blanks a refused or subject-only loop phrase (`command-attach.ts:1703-1724`), and the five `refused-cue-*` rows are in the fixture.
- **REQ-042:** `routedLoopMode` (`command-attach.ts:1693-1701`) runs the same guard on the routed single-target route and keeps the routed mode when the ask does not name another.
- **REQ-043:** `hasUnrefusedPronounRerun` and the past-run read verbs are exported and pinned; eight `stuck-rerun-pronoun-*` rows carry the column.
- **REQ-044:** the manner rows read `asksForLoopRun: true` and the complaint rows `false`; the typed-doctor rows run from `typed-doctor-comma-joined` to `typed-doctor-period-joined`.
- **REQ-045:** `MODE_CUE_WORDS` and `MODE_CUES` key `research` and `review` (`command-attach.ts:539-551`), the hub router's `routerSignals` keys the same two modes, and `NAMED_LOOP_MODE` (`:1763`) is compared with `_NAMED_LOOP_MODE_RE` (`skill_advisor.py:5376`) through `PATTERN_PAIRS`; `EXCEPTION_GRAMMAR_CASES` (`deep-loop-offer-cases.vitest.ts:444-466`) names a case id per grammar shape and the test asserts each id resolves in the fixture.
- **REQ-046:** `MIN_BLOCKED_ATTEMPTS = 2` (`reduce-state.cjs:2378`) writes a one-pass ruling as `RULED OUT` with a reopen condition (`:2402-2408`) and only a two-attempt ruling as `BLOCKED`; `enrichCompiledRoutes` (`handlers/advisor-recommend.ts:363-432`) keeps one command per result, and its withhold branch destructures `command`, `policy`, `ownerSkillId` and `typed` off the row.
- **REQ-047:** the three named prompts all read `servedRun: "none"` in the fixture, and the Python gate reads `_asked_loop_mode` (`skill_advisor.py:5406`) at the point it decides the run row (`:5767`).
- **REQ-048:** `replaceAnchorSection` (`reduce-state.cjs:2421`) resolves the ordinal the file already carries and drops an authored heading above the marker, so a template-numbered strategy keeps one heading per number.
- **REQ-049:** `lowerFolded` (`command-attach.ts:883-885`) collapses `\s+` to one space and `_fold_quotes` (`skill_advisor.py:5098-5106`) does the same while keeping the prompt as typed.
- **REQ-050:** `RUN_ASK_REFUSAL_CANCEL_LEADS` (`command-attach.ts:715`) and `_RUN_ASK_REFUSAL_CANCEL_LEAD_LIST` (`skill_advisor.py:4666`) hold the cancelling leads; the seven `negated-refusal-*` rows read five `true` and two `false`.
- **REQ-051:** `PATTERN_PAIRS` 12, `ANCHORED_PATTERN_PAIRS` 8, `FRAGMENT_PAIRS` 16 and `QUANTIFIER_PAIRS` 4 compare 40 pairs; `PATTERNS_NOT_COMPARED` holds 38 names with a reason (`:571`), and the coverage test recomputes the 43 compiled gate patterns in the fallback's gate slice and requires each to be accounted for exactly once.
- **REQ-052:** `stripReviewVerdict` (`reduce-state.cjs:227`) ends the section before the `Review verdict:` line and joins the remaining lines, so the strategy and the dashboard keep the focus's own line breaks.

## Integration Evidence

- The drift guard's coverage test recomputes the compiled pattern set from the Python source (`deep-loop-offer-cases.vitest.ts:676-690`), so a new gate pattern fails the suite instead of going unaccounted.
- The hub router's `routerSignals` is the third surface (besides `MODE_CUES` and `MODE_CUE_WORDS`) that REQ-045 requires to key the same modes, and it keys exactly `research` and `review`.
- `routedLoopMode` is the one place the mode guard is applied on the routed route, and the requirement's guard is visible there rather than assumed.

## Edge Cases

- The profile of `pickReviewBaseFocus` (`reduce-state.cjs:2586`) is that a leaf's Next Focus is kept only when it names a dimension the registry still shows uncovered; a run whose operator focus stays on one dimension is steered back to the first uncovered one by each reduction. The strategy's Next Focus is therefore re-stated by the leaf after each reduction, and the focus this lineage actually executes remains the operator's traceability focus. Recorded here because it explains why the strategy's section 12 differs from the reducer's projection.
- Two fixture rows carry the identical mode-free prompt (`plural-deep-loops`, `plural-deep-loops-served`) on purpose: one pins the ask, the other the served result. That is not duplication.
- ADR-008's amendment is the reason REQ-035 does not require a command for the mode-free plural ask; the requirement, the decision and the fixture row agree.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` and `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` carry every vocabulary REQ-045 to REQ-051 names, and no code comment in either holds an ephemeral label or a spec path.
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` implements the four behaviours REQ-032, REQ-046, REQ-048 and REQ-052 name, each with a unit test named in the change-set table.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` implements both halves of REQ-046's enrichment clause.

## Ruled Out

- **A gate pattern the drift guard neither compares nor lists.** Ruled out: the coverage test recomputes the 43 `re.compile` assignments in the fallback's gate slice and requires the accounted set to equal it.
- **`MODE_CUES` and the hub router keying different modes.** Ruled out: both key `research` and `review`, and the test at `deep-loop-offer-cases.vitest.ts:743` asserts the four surfaces together.
- **A degraded row keeping a withheld command.** Ruled out by reading the withhold branch, which strips `command`, `policy`, `ownerSkillId` and `typed`.
- **A read-only loop lost to a no-edit clause.** Ruled out: the guard at `command-attach.ts:1620` exempts the read-only modes, and the three `no-edit-*` rows carry their mode.

## Next Focus

- Dimension: traceability (`checklist_evidence`).
- Focus area: the ticked tasks in `tasks.md`, T001 to T111, each against the evidence line its `Observed` clause names.
- Reason: `spec_code` is closed; `checklist_evidence` is the second core protocol the focus names, and it is the half the previous reruns left partial.
- Rotation status: traceability continues, now on the second core protocol.
- Blocked / productive carry-forward: productive. The evidence-line and anchor technique carries over directly.
- Required evidence: task id, the artefact the task names, and the line or row that holds the claim.

Review verdict: PASS
