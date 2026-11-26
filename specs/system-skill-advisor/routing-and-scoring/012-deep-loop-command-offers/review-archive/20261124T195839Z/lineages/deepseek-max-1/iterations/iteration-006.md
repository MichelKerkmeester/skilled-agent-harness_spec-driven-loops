# Review Iteration 006

## Dispatcher

- Mode: review; target agent `deep-review`; lineage `deepseek-max-1`; generation 7; session `fanout-deepseek-max-1-1795546920757-7pyjry`.
- Iteration 6 of 7 (stopPolicy `max-iterations`).
- Dimension: `maintainability`. Focus: the reducer's own strategy writer as it behaves in this lineage, and how well the two gate copies are held together by the drift guard after four rounds of additions.
- Operator review focus, carried: the traceability protocols stay closed; this iteration asks whether a reader of the packet - or the next deep-review run - can follow what the code does and what the strategy says, which is the property the packet's REQ-046 and REQ-048 already tried to protect.

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:217` (`extractSection`), `:369` (the `Next Focus` lookup), `:393` (`normalizeText` over the extracted section), `:2518` (`pickReviewBaseFocus`), `:2643` (`replaceAnchorSection` call).
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1/deep-review-strategy.md` (`## 12. NEXT FOCUS` as the reducer wrote it) and `deep-review-dashboard.md:146` (`## 11. NEXT FOCUS`).
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:434` (`PATTERN_PAIRS`), `:450` (the assertion that reads it), `:80` (`VOCABULARY_PAIRS`).
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` (the 18 `_..._RE = re.compile` templates the fallback hand-mirrors).
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330` to `:1155` (the exported vocabulary and the patterns built from it).

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R1-P1-001` and `R4-P1-001` remain active.

### P2 Findings

6. **The reducer's Next Focus projection captures the iteration verdict and flattens the focus block** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1/deep-review-strategy.md:171` -- `extractSection` (`reduce-state.cjs:217`) reads from a `##` heading to the next `##` heading or end of file, and the iteration contract puts `Review verdict: <X>` after `## Next Focus` with no heading behind it, so the verdict is inside the extracted section. `normalizeText` (`:393`) then collapses the whole block to one line. The result is visible in this lineage: `deep-review-strategy.md` `## 12. NEXT FOCUS` and `deep-review-dashboard.md:146` both end with "Review verdict: CONDITIONAL", and the seven focus fields read as one run-on paragraph. `pickReviewBaseFocus` (`:2518`) reads the same field back, so the text a reader and the next run treat as the focus carries a verdict statement, and the field the next iteration reads cannot be read at a glance.
   Finding class: `class-of-bug` (every iteration file ends with the verdict after Next Focus, so every projection of it is affected).
   Scope proof: `reduce-state.cjs` is in the seeded scope, and both artefacts that show the defect are inside this lineage's write surface.
   Affected surface hints: `extractSection` and the `Next Focus` lookup in `reduce-state.cjs`; the strategy template's section 12; the dashboard's section 11; the iteration prompt's Next Focus contract, which does not say the verdict must sit under a heading.
   Case: run any iteration whose narrative ends with the mandatory verdict line, reduce the state, and open the strategy's Next Focus section: the focus field now ends with the verdict of the iteration it came from. A reader looking for the next focus finds a verdict sentence inside it, and a model given the strategy as context can mistake the verdict for guidance about the next iteration.

7. **The drift guard compares one regex pattern while the fallback hand-mirrors eighteen** -- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:434` -- `PATTERN_PAIRS` holds a single entry, `['_NAMED_LOOP_MODE_RE', NAMED_LOOP_MODE]`, and `:450` asserts only that pair. `VOCABULARY_PAIRS` does hold the word lists together entry for entry, and `NUMERIC_PAIRS` holds the two numbers, but the grammar built from those lists is hand-written twice: `skill_advisor.py` carries 18 `_..._RE = re.compile` templates (the request alternation, the object gap, the count back-pointers, the passes grammar, the effort and question patterns, the mode cues) with no counterpart in `PATTERN_PAIRS`. A one-sided grammar edit therefore passes both suites unless a fixture row happens to exercise the exact sentence shape it changes, and AC-053's grammar rows cover four grammars (refusal gap, question lead, past-run read, stuck symptom), not eighteen. The two copies read alike today - the whitespace probe in iteration 4 returned the same six results from both copies' logic, and the 20-list comparison found no drift - so this is a guard-coverage gap, not an observed divergence.
   Finding class: `matrix/evidence` (the check covers one pair of eighteen).
   Scope proof: the test file is in the seeded scope and the claim rests on its two pair tables and on a count of the fallback's compiled patterns.
   Affected surface hints: `PATTERN_PAIRS` and `pythonPatternSource` in `tests/deep-loop-offer-cases.vitest.ts`; `_LOOP_REQUEST_RE`, `_LOOP_COUNT`, `_LOOP_MULTI_PASS`, `_ITERATIVE_ASK` and the mode-cue patterns in `scripts/skill_advisor.py`; REQ-045's "pins the grammar of each exception" clause.
   Case: change the object-gap quantifier from `{0,3}` to `{0,4}` in `command-attach.ts` only. Both suites keep passing, the 22 vocabulary pairs still match, the numeric pairs still match, and the two copies now answer a different set of prompts until a user happens to type one the four grammar rows do not cover.

## Traceability Checks

- `spec_code` and `checklist_evidence` stay `pass` from iteration 3. REQ-048's numbering clause is checked again here in the field: after two reducer passes this lineage's strategy still carries `## 12. NEXT FOCUS` once, so that requirement holds; the finding above is about the section's content, not its number.

## Integration Evidence

- Reducer: `runtime/scripts/reduce-state.cjs` `extractSection`, the `Next Focus` lookup, `normalizeText` and `replaceAnchorSection`, exercised on this lineage four times.
- Artifacts: `deep-review-strategy.md` and `deep-review-dashboard.md` in this lineage, read after each reducer pass.
- Drift guard: `tests/deep-loop-offer-cases.vitest.ts` `VOCABULARY_PAIRS`, `NUMERIC_PAIRS`, `PATTERN_PAIRS` and the `pythonPatternSource` reader, against `scripts/skill_advisor.py`.

## Edge Cases

- Ambiguity: the verdict line could be kept out of the extracted section either by a heading or by the extractor stopping at the first line that is not part of the block. The finding names the mechanism, not a preferred fix.
- Contradiction, adjudicated: AC-053 says the guard pins the grammar of each exception, which is true for the four grammars its fixture rows exercise, and REQ-045 says the guard compares "the mode vocabulary on every surface that carries it", which is true. Finding 7 is filed against the gap between those statements and the 18 hand-mirrored templates, not against either statement.
- Missing dependency: the Python templates were counted from source rather than executed.
- Partial success: the maintainability check is qualitative; the two findings are the ones with artefacts behind them, and weaker signals (seven exports referenced only inside their own module) were deliberately not filed.

## Confirmed-Clean Surfaces

- REQ-048's numbering clause holds in the field: two reducer passes later, section 12 still appears once, with the template's number.
- The vocabulary and numeric drift guards hold on the tree: 22 pairs and 2 numbers match between the copies.
- No in-scope code comment carries an artifact label (iteration 3's sweep), which is the maintainability property the repository's comment rule asks for.

## Ruled Out

- "The strategy file gains a second heading with the same number": ruled out. The reducer's heading absorption works; section 12 appears once after two passes.
- "Seven dead exports mean the module carries unused code": ruled out as a finding. `RUN_REFUSED` is read through `isRunRefused`, the pattern fragments are part of the exported surface the tests read by name, and none of them is unreachable code; calling them dead would be a phantom issue.
- "The two gate copies have already drifted": ruled out. Twenty vocabulary lists, two numbers and the whitespace probe all agree; finding 7 is about the guard's size, not a drift.

## Next Focus

- Dimension: `traceability` (close-out).
- Focus area: cross-reference verification of the in-scope integration surfaces (commands, skills, runtime mirrors) and a final consistency pass over this lineage's own artefacts - iterations 1 to 6, strategy, state log, deltas and registry.
- Reason: every dimension now has a full iteration; the last iteration under the cap is reserved for the cross-reference overlay and for proving the lineage's own state is coherent before synthesis.
- Rotation status: all four canonical dimensions covered; this is the close-out pass.
- Blocked/productive carry-forward: productive - the reducer artefacts and the guard tables both yielded findings a reading of the code alone would miss; carry the artefact-first method.
- Required evidence: one overlay `traceabilityChecks` result per protocol run (or `notApplicable` with a reason), and the artefact-consistency proof for this lineage.
- Recovery note: none.

Review verdict: CONDITIONAL
