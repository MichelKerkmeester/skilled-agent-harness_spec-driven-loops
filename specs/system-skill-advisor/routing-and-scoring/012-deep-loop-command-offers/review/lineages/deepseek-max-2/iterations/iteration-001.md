# Review Iteration 001

## Dispatcher

- Lineage: `deepseek-max-2`, session `fanout-deepseek-max-2-1795544069299-46zw3s`, generation 6, mode `review`, execution `AUTONOMOUS`.
- Iteration 1 of 7. `stopPolicy: max-iterations`, `convergenceThreshold: 0.10` (telemetry only on this run).
- Dimension: **correctness**. Operator review focus carried in addition: **traceability**, with this iteration taking the gate-layer slice of the focus (REQ-023 to REQ-031 against `command-attach.ts`, `skill_advisor.py` and the shared fixture).
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (`spec-folder`), pre-bound 51-file scope.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` - the offer gate: refusal, stuck-run, mode-cue, typed-command and degraded-route predicates, read in full at `:1` to `:1735`.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:442` to `:463` - `attachTypedCommand`, the served-head override.
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187` to `:255` - `parseRecommendations`, `typedCommandForRecommendation`, `withTypedCommand` (the Python subprocess degraded path).
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1503` to `:1594` - `degradedRecommendations` and the supplied-command branch.
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1` to `:353` - all 347 shared cases and the header that pins each typed column.
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:1` to `:400` - the vocabulary drift guard, the per-entry guard and the column assertions.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:232` to `:245` - REQ-020, REQ-029, REQ-030, REQ-031, REQ-033.
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:84` to `:95` - AC-027, AC-030 to AC-038.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **REQ-031 and AC-038 describe fifteen compared lists and ten per-entry lists; the drift guard compares twenty-two and pins twelve** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:243`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:95` -- REQ-031 states "All fifteen compared lists are exported arrays in `command-attach.ts`" and names exactly ten lists as carrying a per-entry case, with "the other five" compared without one. `VOCABULARY_PAIRS` holds twenty-two pairs (`.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:81` to `:102`), and the per-entry guard covers twelve lists across nine `it.each` blocks (`:300`, `:308`, `:315`, `:324`, `:333`, `:338`, `:346`, `:355`, `:365`), so ten lists carry no per-entry case. The seven lists neither counted nor described are `LOOP_EFFORT_CHANGE_VERBS`, `RERUN_PRONOUNS`, `DEFECT_CHECK_VERBS`, `DEFECT_CHECK_NOUNS`, `MODE_CUE_WORDS.research`, `MODE_CUE_WORDS.review` and `READ_ONLY_LOOP_MODES`; two of them (`LOOP_EFFORT_CHANGE_VERBS`, `RERUN_PRONOUNS`) do carry per-entry cases, so the "other five" sentence is wrong in the direction that hides coverage. AC-038 repeats both counts and pins them to `deep-loop-offer-cases.vitest.ts:68` (a blank line inside the import block) and `:303` (a per-entry `expect`), while the pairs begin at `:80` and the comparison assertions are at `:448` and `:458`.
Case: a maintainer reads REQ-031 to decide whether adding a word to `DEFECT_CHECK_VERBS` needs a fixture row; the requirement says only five lists lack per-entry cases and does not name that list, so the answer it gives is wrong for ten of the twenty-two compared lists.
Finding class: specification-accuracy
Scope proof: both cited cells are inside the declared spec-folder target; the counter-evidence is the test file the cells cite, read at the line ranges named.
Affected surface hints: `spec.md` REQ-031; `acceptance-criteria.md` AC-038; `deep-loop-offer-cases.vitest.ts` drift guard.

2. **AC-036 cites evidence lines that do not hold the typed-on-stuck evidence it claims** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:93` -- AC-036 (REQ-029) says the serving-layer test asserts the native result at `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:107` and that the Python gate keeps and marks the run row at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5482`. Line 107 of that test file is the closing `} else {` of the compiled-routing flag restore, and the test that asserts the typed `/deep:review` over the diagnosis begins at `:111` with its first assertion at `:114`. Line 5482 of `skill_advisor.py` is `_command_lead(_CMD_ASK_NAMED_WORDS, _CMD_ASK_TARGET),`, part of the command-ask lead construction, and carries no typed-run-row logic.
Case: a reviewer auditing REQ-029 opens the two cited lines to confirm the exception is pinned and finds neither the assertion nor the typed marker, so the row's `Met` status is asserted by evidence that does not exist where the cell says it does.
Finding class: evidence-traceability
Scope proof: the AC cell and both cited files are inside the declared scope; both lines were printed and read whole.
Affected surface hints: `acceptance-criteria.md` AC-036; `typed-on-stuck-serving.vitest.ts`; `skill_advisor.py` typed gate.

3. **AC-037 cites the wrong lines for the bounded window and the fixture-parity suite** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:94` -- AC-037 (REQ-030) states both copies read a 400-character lead window and cites `command-attach.ts:641` and `skill_advisor.py:5009`. `command-attach.ts:641` is a comment line inside `namesDeepRun` ("it to read, however many of its keywords the prompt shares"); `LEAD_WINDOW = 400` is declared at `:748`. `skill_advisor.py:5009` is the word `"did"` inside a question-auxiliary tuple; the fallback's window is `_LEAD_WINDOW = 400` at `:5181`, read at `:5186` and `:5559`. The cell also pins the fixture-parity evidence to `tests/python/test_skill_advisor.py:3017`, which is the `except` clause of an unrelated test; the parity test is `test_deep_loop_offer_gate_parity` at `:2854`.
Case: someone changing `LEAD_WINDOW` follows the cell's two pointers to check the Python copy and lands on a comment and a vocabulary word, so the parity they are told is pinned looks unpinned and the wrong conclusion (drift, or no drift) is equally reachable.
Finding class: evidence-traceability
Scope proof: the cell and all four cited files are inside the declared target; each cited line and each correct line was printed.
Affected surface hints: `acceptance-criteria.md` AC-037; `command-attach.ts` `LEAD_WINDOW`; `skill_advisor.py` `_LEAD_WINDOW`; `test_skill_advisor.py` parity test.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | REQ-023 to REQ-031 were mapped to code this iteration. REQ-023, REQ-024, REQ-025, REQ-026, REQ-027, REQ-028, REQ-029 and REQ-030 hold at the gate layer and on both degraded paths; REQ-031's count statements do not hold (finding 1). The remaining REQs (REQ-001 to REQ-022, REQ-032 to REQ-046) are not yet checked, so the protocol stays `partial`. |
| `checklist_evidence` | partial | AC-030 to AC-038 were opened against the tree. AC-030, AC-031, AC-032, AC-033, AC-034 and AC-035 hold on the cited files; AC-036, AC-037 and AC-038 cite anchors that do not hold their evidence (findings 1 to 3). AC-039 to AC-054 not yet checked. |

Observed measurements behind the two rows (read-only, run from a probe under the lineage):

- The TypeScript gate and the 347-case shared fixture agree on every column the fixture pins: `asksForLoopRun`, `stuckRun`, `writingAbout`, `typedReviewKept`, `typedRunsKept`, `doctorWithheld` and `servedRun` produced `cases=347 mismatches=0` against `attachCommand` and the predicates at `command-attach.ts:1132`, `:667` and `:842`.
- The Python copy agrees with the same fixture on the three predicates and on `servedReviewKept` and `typedRunsKept`: `cases=347 mismatches=0` through `asks_for_loop_run`, `is_stuck_run_complaint`, `is_writing_about_topic` and `_apply_deep_loop_offer_gate`.
- Sixteen extra prompts outside the fixture were read through the gate. The ones the REQ table pins behaved as written: "my deep review run is stuck, run 5 more iterations" gives `/deep:review` (REQ-018's shape), "the deep review run is stuck, run it again" gives `/deep:review`, "deep research: how do vector databases handle hybrid search" gives `/deep:research`, "how many passes does the deep review do" gives no command, "not asking for a deep review, just explain" and "without running deep research, summarize the cache" give none.

## Integration Evidence

None recorded. This iteration reviewed no command, workflow or mirror surface beyond the offer gate's own callers, which are listed under Files Reviewed rather than claimed as integration coverage.

## Edge Cases

- **Ambiguity kept open (stuck complaint plus a no-edit clause).** "my deep research run is stuck, don't change anything" and "my deep research run is stuck, don't touch the code" withhold `/doctor:deep-loop`, because `attachCommand` treats a no-edit request as a reason to withhold the diagnosis (`command-attach.ts:1554`). REQ-024 only requires withholding when the reader refuses a run or a fix, and the doctor's first half is read-only, so both readings are defensible. The tree is conservative, the REQ table does not pin either, and no severity is claimed. Chosen interpretation: recorded as an edge case, not a finding.
- **Ambiguity kept open (stuck complaint plus a typed run command).** "the deep research run is stuck; /deep:review the parser" answers `/doctor:deep-loop` at the `attachCommand` layer and `/deep:review` on the served head through `attachTypedCommand`. This is the ADR-005 rule applied to a command other than the one the REQ table's example names; consistent with the decision, so no finding, but the decision text is checked again in the traceability pass.
- **Partial success recorded honestly.** The three findings above are documentation and evidence defects. Nothing this iteration found is a behaviour defect in the gate, and no surface was skipped silently: the scorer lane (`explicit.ts`) and the fusion withholds are deferred to the correctness slice of iteration 5.

## Confirmed-Clean Surfaces

- `attachCommand` (`command-attach.ts:1537`) on a single review route, a single research route and a deferred route: 60 fixture-derived prompts plus 16 probe prompts produced the REQ-023 to REQ-030 outcomes, with no uncaught throw and no command offered on a refusal, question or past-run prompt.
- `commandOnlyMentioned` (`:1475`): every refusal and question shape the fixture pins reads as a mention, and the typed control `/deep:review the parser` reads as a request.
- `typedCommandForTop` (`:304`) over `typedCommandsIn` (`:274`): the first typed command the leading skill owns wins, so `/create:changelog` after a typed `/deep:review` does not hide the review command (REQ-025).
- `attachTypedCommand` (`advisor-recommend.ts:442`): the typed command replaces the top row's command, policy and owner and sets `typed: true`, which is the served-head half of REQ-029.
- `degradedRecommendations` (`skill-advisor-cli.ts:1503`) and `trackedCommandForOwner` (`:1489`): a supplied command string survives only when the tracked table names it for that row's own skill (REQ-038), and a tracked typed row prints its plain command with no option text (REQ-028's degraded half).

## Ruled Out

- **A refusal-verb gap in the gate.** Hunted for a common refusal verb the fixture misses; the nineteen `RUN_ASK_REFUSAL_LEADS` entries plus the `do not even think about` idiom cover the six REQ-023 prompts and the three keep controls, and the conjunction rule (`command-attach.ts:735`) keeps "skip it and deep review the parser" a request. No gap reached the gate.
- **A lost typed command when two commands are typed.** `typedCommandIn` returns the longest key by design, and the served head reads the ordered list instead, so the "longest wins" behaviour is not a defect. REQ-025 states this split explicitly.
- **A Python/TypeScript predicate divergence.** Both copies agree on all 347 fixture cases; the divergence class that earlier rounds found is not present at the gate layer.

## Next Focus

- Dimension: traceability (`spec_code`).
- Focus area: the REQ table itself, REQ-001 to REQ-022, each mapped to the code or decision that records it; then REQ-032 to REQ-046 in the later passes.
- Reason: `spec_code` is a core protocol and only the sixth-round slice (REQ-023 to REQ-031) has been checked; the earlier requirements carry the measurement claims that the probe rerun recorded.
- Rotation status: correctness is complete for the gate layer; the scorer and fusion slices move to iteration 5.
- Blocked/productive carry-forward: productive - reading a REQ paragraph beside the test that pins it surfaces count drift cheaply; keep that shape for the remaining requirements.
- Required evidence: one `file:line` per REQ for the code that implements it, or the named decision record when the REQ records a decision; the probe output only where a REQ's claim is a measurement.
- Recovery note: none.

Review verdict: PASS
