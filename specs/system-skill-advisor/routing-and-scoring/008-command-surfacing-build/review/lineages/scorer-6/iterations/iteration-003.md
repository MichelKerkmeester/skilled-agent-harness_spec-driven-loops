# Review Iteration 003

## Dispatcher

- Lineage: `scorer-6`, area `scorer`, artifact dir `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-6`.
- Review focus (pass six): the scorer area's maintainability and the final cross-reference pass for a scorer-only area.
- Dimension: maintainability plus the overlay cross-reference resolutions.
- Sources read: the scoped scorer's new helper and its consumer, the scoped vitest file, the scoped README, and the packet registry for deduplication. `steer.md` does not exist in this lineage directory.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1479-1520` (`startState` contract and `startShape`), `:2029-2042` (`scoreRun` return declaration), `:2083-2110` (the object `scoreRun` builds), `:2166-2190` (tally initialisation), `:2250-2262` (tally block), `:2400-2415` (`addScored`'s shape read), `:2590-2602` (text summary).
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1490-1530`, `:2165-2195`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:115`, `:135`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`scoreRun`'s declared return type omits `startShape`, the field `addScored` reads** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2035` -- the `@returns` union lists `startRow` and `started` but not `startShape`, which the same branch added at line 2104 and `addScored` reads at line 2412 with an `!== null` guard.
   Finding class: maintainability.
   Scope proof: the declaration and its only consumer are both in the pass-six scoped scorer file, and the field was added by this branch's diff.
   Affected surface hints: `scoreRun` `@returns`, `addScored`, `startShapes`, `newTally`.
   Case: a maintainer who edits `scoreRun` against its documented return type drops `startShape`; `addScored` then evaluates `undefined !== null` as true and writes `tally.startShapes[undefined] += 1`, so the summary prints an `undefined` key with a `NaN` (serialised as `null`) and the shape split stops summing to `started`.
   Fix completeness: add `startShape: 'skill'|'reported'|'expanded'|'readWrite'|'readOnly'|null` to the `@returns` union, and key the tally from one exported shape list so the contract and the counters cannot drift.

## Traceability Checks

- `spec_code`: pass (carried). Phase 036 REQ-004 and REQ-001 map to `startState` and its cases as recorded in iteration 1.
- `checklist_evidence`: pass (carried). The 036 `scratch/` files carry the counts AC-001, AC-003 and AC-004 name, and `after.txt` records the mutation check of the new summary case.
- `skill_agent`: notApplicable. No skill file under `.skilled/skills/system-skill-advisor` names `score-command-transcripts`; only the folder README does.
- `agent_cross_runtime`: notApplicable. No agent definition in `.skilled/agents/` or a runtime mirror names the scorer.
- `feature_catalog_code`: notApplicable. The scorer is a measurement script, not a feature a catalog row describes.
- `playbook_capability`: notApplicable. No playbook capability names the scorer.

## Integration Evidence

- The changed producer/consumer pair is `scoreRun` → `addScored`/`tallyBlock`/`writeSummary`, all inside the scoped file; no runtime mirror or command wrapper reads `startShape`.
- The README row at line 135 and the paragraph at line 115 are the only documentation surfaces the change touches; both are in the scoped area.

## Edge Cases

- `tally.startShapes[undefined] += 1` would not throw, which is why the missing field is a silent corruption rather than a crash: `undefined !== null` is true, and the increment creates an `undefined` key holding `NaN`.
- A shape renamed in `startShape` alone would print a new key and leave the old key at zero; the same missing shared list is the root of both cases.

## Confirmed-Clean Surfaces

- `startShape`'s comment states its order and its output vocabulary; `startState`'s JSDoc repeats the five names and the null case, so the public contract is documented even though the private consumer's declaration is not.
- `tallyBlock` copies `startShapes` rather than sharing the tally object, so a printed block cannot mutate the tally.
- The text summary prints all five shapes in a fixed insertion order, so a reader can compare two arms without parsing.

## Ruled Out

- Raising the duplicated start rule (`startShape` versus `startedCommand`'s skill/report/expand/boundary sequence) as a finding: the two agree today, the comment in `readDocument` names both, and two instances do not justify a shared helper under the repository's restraint rule. Recorded as a follow-on risk, not a finding.
- Raising the missing shared shape-key constant twice (in `newTally` and in `startShape`'s literals): folded into the finding above as its fix rather than counted again.
- Calling the summary assertion `shapes.reduce(...) === 1` weak: its comment says it pins that the capped row adds no shape, and the same test's `startRate` assertion pins the started count, so it is fit for its stated purpose.

## Next Focus

- Dimension: none; all four dimensions are covered and this is the third of three permitted iterations.
- Focus area: synthesis.
- Reason: `maxIterations` is reached; the remaining findings are four P2 advisories.
- Rotation status: swept.
- Required evidence: none outstanding.
- Run verdict for this lineage: PASS with advisories (4 active P2, 0 P1, 0 P0).

Review verdict: PASS
