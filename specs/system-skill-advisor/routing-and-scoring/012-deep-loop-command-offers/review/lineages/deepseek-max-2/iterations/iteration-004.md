# Review Iteration 004

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Executor: `cli-pi` model `deepseek-v4.1-flash-1017`, run inline by lineage `deepseek-max-2` (generation 1, lineage mode `new`).
- Iteration 4 of 7, stop policy `max-iterations`.
- Dimension: **maintainability**. Operator focus applied: no `gateClass` on protocol results, findings only on review-scope files, no `terminal_gates` row. This closes the fourth canonical dimension inside the window the focus sets, so iterations 5 to 7 return to traceability.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:146` (the `command-attach.ts` row)
- `.skilled/skills/system-skill-advisor/runtime/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:32,63,106,111,123`
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:14,801,803,822,1030,1650,1653,1676`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52,888,5245,5253`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:122,153,504,562,660,694,715`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257,262`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` (`passesAsked`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None this iteration.

### P2 Findings

1. **The module README states the stuck-run doctor rule without the run-refusing exception REQ-024 built, so the document describes a broader rule than the code implements** -- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:146` -- The `command-attach.ts` row says "A complaint about a stuck, non-converging or stale run (`isStuckRunComplaint()`) gets `/doctor:deep-loop` instead of a new run", with no mention of a complaint that also refuses a run or a fix. The code withholds the command in exactly that case: `attachCommand`'s stuck branch returns `undefined` when `isRunRefused` holds (`.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1653`), and `withholdDeepLoopDoctorWithoutRun` withholds the fused row through the same predicate. The row does name the no-edit exception in the same sentence family, so a reader has no signal that a second exception exists. A maintainer following the README would restore the doctor row on "the deep research run is stuck. please don't run anything", which REQ-024 and AC-031 both forbid.
   Finding class: `doc-drift`
   Scope proof: `lib/README.md` is a review-scope file; the rule it omits sits at a review-scope code line, and AC-031's waiver-free `Met` row states the built behavior.
   Affected surface hints: `lib/README.md` row `command-attach.ts`; the same omission in `feature-catalog/cli-surface/advisor-recommend.md` if that file describes the doctor row (it does not name it); `command-attach.ts` `attachCommand` stuck branch and `fusion.ts` `withholdDeepLoopDoctorWithoutRun`.
   Case: a maintainer edits the stuck branch to always answer `/doctor:deep-loop`, citing the README's unconditional sentence; the guard tests fail, but the doc that motivated the edit still reads as correct, and the next reader repeats the mistake.

## Traceability Checks

| Protocol | Level | Status | Evidence | Summary |
|---|---|---|---|---|
| `spec_code` | core | pass | `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:694]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5245]` | The two numbers REQ-031 pins are equal in both copies (`ADVISOR_PROMPT_MAX_CHARS` 10,000 at `schemas/advisor-tool-schemas.ts:257` and `skill_advisor.py:52`; `LEAD_WINDOW` 400 at `command-attach.ts:801` and `skill_advisor.py:5245`), and the fallback's head counts UTF-16 units the way the native schema does (`skill_advisor.py:888`). |
| `checklist_evidence` | core | partial | `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:95]` | Carried: AC-038 states the drift guard without a list count, which is what the guard now does. Full ticked-task sweep is iteration 5. |

## Integration Evidence

- `deep-loop-offer-cases.vitest.ts:694` accounts for every pattern the fallback compiles inside its gate slice, and `:715` checks the reverse direction (a compared pattern is still compiled, an excused name is still assigned), so a one-sided edit on either side fails.
- `deep-loop-offer-cases.vitest.ts:122` holds the vocabulary pairs and `:504` the pattern pairs; the gate slice the accounting reads runs from `_DEFECT_CHECK_PATTERN` to `_apply_deep_loop_offer_gate` (`skill_advisor.py:4765`, `:5783`), and no pattern compiled outside that slice is referenced inside it.
- `command-attach.ts:14` still claims one import, and the file's import block holds exactly `mergedSkillForAlias` from `./scorer/aliases.js`.
- `manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:111` names `NO_EDIT_REQUEST` and `isNoEditRequest()` as the place to look when a no-edit request still carries a command, which matches the code path.

## Edge Cases

- **`_spawn`-free pattern comparison.** The fallback builds `_command_naming_patterns` at call time from command strings rather than compiling a module-level object, so the gate accounting cannot see it; its inputs are the tracked commands, which are covered by the shared fixture rows instead. Not filed.
- **The `LEAD_CONTEXT` difference between the copies.** The native window keeps 16 characters of left context so a word boundary at the cut reads the real preceding character; the Python copy passes `pos` to `pattern.search`, which keeps `\b` semantics and refuses `^` at the cut. The two are equivalent for the patterns each copy compiles, which is why the sweep in AC-053 agreed. Not filed.
- **The `dist` tree.** The packet declares it regenerated and `T111` records it as gitignored, so no maintainability claim here rests on it.

## Confirmed-Clean Surfaces

- `lib/README.md` no longer carries the old unconditional no-edit sentence: it states the read-only deep-loop exception in the same row, which is the T121 fix.
- `rg -n 'convene' lib/README.md` prints nothing, so CHK-042's check still holds.
- The drift guard's excuse table (`PATTERNS_NOT_COMPARED`) is read in both directions, so an excuse that outlives its pattern fails a test.
- `VOCABULARY_PAIRS` compares each exported list with its named Python tuple, and `NUMERIC_PAIRS` compares the two numbers, so a one-sided vocabulary edit fails.

## Ruled Out

- **A one-sided gate-pattern edit outside the guard's slice** -- ruled out by reading: no pattern compiled before `_DEFECT_CHECK_PATTERN` is referenced inside the gate slice.
- **A stale module import claim in the README** -- ruled out: the file has exactly one import.
- **A divergence between the native and fallback prompt heads** -- ruled out: both cut at 10,000 UTF-16 units.

## Next Focus

- Dimension: traceability
- Focus area: `checklist_evidence`, protocol 2 of 2: every ticked task from T001 to T122 and every `Met` row from AC-001 to AC-067 against evidence that exists in the tree
- Reason: the operator focus says to finish `spec_code` and `checklist_evidence`, and the first four iterations have covered the other three dimensions
- Rotation status: all four canonical dimensions have one iteration; traceability takes iterations 5 to 7
- Blocked/productive carry-forward: `spec_code` is `pass`; `checklist_evidence` must reach `pass` or the run's coverage gate keeps failing
- Required evidence: the tree artefact each tick claims (a test file, a symbol, a fixture row, a command line), cited by name and line

Review verdict: CONDITIONAL
