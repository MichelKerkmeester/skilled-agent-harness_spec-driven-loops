# Review Iteration 002 - hook-confirm-3b

## Dispatcher

- Lineage: `hook-confirm-3b`, session `fanout-hook-confirm-3b-1794595021404-69frey`, iteration 2 of 3.
- Review focus (binding): the no-edit half of commit `860610d783` is checked once here; every finding needs file:line and a concrete input run.
- How this iteration addressed the focus: it reads `NO_EDIT_REQUEST` and `isNoEditRequest` in full, reads all three callers, and runs the same prompts through the pre-commit module (`git show 860610d783^:...`) and the current module side by side, so the before/after delta is measured rather than asserted.

## Dimension

Correctness.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:283-295` — `NO_EDIT_REQUEST`, `isNoEditRequest`.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:326-345` — `attachCommand` and its no-edit early return.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:675-690` — `readOnlyRouteAllowed`.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:877-886` — `commandMeaningEligible`.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:147-160` — `isReadOnlyExplainer`.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:30-77` — `NOEDIT4` and the scope-limit table.
- Pre-commit module extracted with `git show 860610d783^:.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` into `probes/command-attach-pre.ts` for the before/after comparison.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **The `make no changes` lookahead is over-broad: a genuine no-edit request that names its object loses the guard** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289` -- the added `(?! (?:to|in)\b)` makes the shared no-edit predicate return `false` for every sentence of the form `make no changes to <object>`, including sentences that rule out all changes and merely say what the object is. The guard then stops withholding a mutating command, so a reader who explicitly ruled out a change is handed `/create:agent`.
   Finding class: correctness (regression introduced by `860610d783`; the fix's own test table covers only the direction it fixed).
   Scope proof: line 289 is the changed line in a declared-scope file; `attachCommand` at `command-attach.ts:335` and both scorer callers consume the same predicate, so the regression reaches every no-edit gate.
   Affected surface hints: `attachCommand` hub-command gate, `readOnlyRouteAllowed` (`fusion.ts:677`), `commandMeaningEligible` (`fusion.ts:881`), `isReadOnlyExplainer` (`text.ts:150`).
   Case: the prompt `make no changes to any file, just report what you find` is a plain no-edit request. Before the commit the predicate matched `make no changes` and `attachCommand` returned `undefined`; after the commit the predicate returns `false` and `attachCommand` returns `'/create:agent'` for a single-mode mutating route.

   Concrete inputs run (current module vs pre-commit module, node v26.13.0):

   ```
   prompt: "make no changes to any file, just report what you find"
     post-fix isNoEditRequest = false   attachCommand = "/create:agent"
     pre-fix  isNoEditRequest = true    attachCommand = undefined
   prompt: "make no changes to the code, just analyze the parser"
     post-fix isNoEditRequest = false   attachCommand = "/create:agent"
     pre-fix  isNoEditRequest = true    attachCommand = undefined
   ```

   Why P1: a prompt a person would plausibly type is misrouted, which is exactly the operator guide's P1 bar. The old wording (`make no changes` alone) is covered by `NOEDIT4` at `tests/command-attach-guards.vitest.ts:30-34`; the new exclusion removes the object-bearing form from the same class, and no replacement phrase (`just show`, `just list`, `do not change`) is required to be present. The suite still passes 26/26 because no test row exercises a genuine no-edit request that names its object.

   Claim adjudication:

   ```json
   {
     "type": "correctness-regression",
     "claim": "The added negative lookahead at command-attach.ts:289 disables the shared no-edit gate for genuine no-edit requests phrased as 'make no changes to <object>', so a mutating hub command is offered where it was withheld before the commit.",
     "evidenceRefs": ["command-attach.ts:289", "command-attach.ts:335", "fusion.ts:677", "fusion.ts:881", "text.ts:150", "iterations/iteration-002.md probe output"],
     "counterevidenceSought": "Checked every other alternative in NO_EDIT_REQUEST against the failing prompt ('no edits?', 'no changes yet', 'without making changes', 'do not change', 'read-only only', 'only; do not', 'just show', 'just list'); none matches, and no other caller re-checks a scope noun. Also ran the pre-commit module to confirm the guard fired before the change.",
     "alternativeExplanation": "The change may be intended to treat every 'make no changes to X' as a scope limit. Rejected: the predicate's own contract is 'Wording that asks for an answer and rules out a change', and the existing NOEDIT4 table treats bare 'make no changes' as that wording. Only a change verb elsewhere in the prompt distinguishes the two readings, and the predicate cannot see one.",
     "finalSeverity": "P1",
     "confidence": 0.9,
     "downgradeTrigger": "Downgrade to P2 if the no-edit gate's contract is amended to exclude every object-bearing 'make no changes' form, or if a caller is shown to re-add a change-verb check before offering a mutating command."
   }
   ```

### P2 Findings

1. **The lookahead's word list is too narrow: an adverb or a different preposition keeps the old false no-edit reading** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289` -- the exclusion covers only a directly following `to` or `in`, so `make no changes whatsoever to ...` (and `make no changes on ...`) still matches inside a change request and withholds the command. That is the `AR3-P2-001` failure mode the commit set out to close, still reachable.
   Finding class: correctness (incomplete fix).
   Scope proof: same changed line; the input is a change request of the same shape as the two rows the commit added.
   Affected surface hints: `attachCommand` hub-command gate; scorer no-edit gates.
   Case: `refactor the parser and make no changes whatsoever to its public api` is a change request with a scope limit; it is read as a no-edit request and loses its command.

   Concrete inputs run:

   ```
   prompt: "make no changes whatsoever to the public api"
     post-fix isNoEditRequest = true   attachCommand = undefined
     pre-fix  isNoEditRequest = true   attachCommand = undefined   (unchanged)
   prompt: "make no changes to its public api"       -> false  (fix target holds)
   prompt: "make no changes in the tests"            -> false  (fix target holds)
   ```

   Why P2 and not P1: the wording needs an intervening adverb to fail, and the consequence is a withheld command rather than a mutation offered against an explicit instruction. The operator guide rates the plausible-but-narrower misroute as advisory, and the pass-three finding it mirrors (`AR3-P2-001`) was itself P2.

## Traceability Checks

- `spec_code` — **partial**. The commit message says: "The no-edit pattern read a change request that says what to leave alone ... as a request for no change at all. That wording now keeps its command." The named wording does keep its command (`make no changes to its public api` -> `false`, `make no changes in the tests` -> `false`), so the stated mechanism is present at `command-attach.ts:289`. The same sentence also implies the pattern still reads *genuine* no-edit wording as no-edit; that half is now false for the object-bearing form, which is P1 finding 1.
- `checklist_evidence` — **notApplicable**: no `checklist.md` in the packet.
- `skill_agent` — **pass**: `attachCommand`'s early return at `command-attach.ts:335` calls the shared predicate, so the hub-command gate inherits the same behaviour; no drift between the two gates.
- `agent_cross_runtime` — notApplicable (no runtime mirror in this diff).

## Integration Evidence

- Exact surfaces checked: `attachCommand` (`command-attach.ts:326-345`), `readOnlyRouteAllowed` (`fusion.ts:675-690`), `commandMeaningEligible` (`fusion.ts:877-886`), `isReadOnlyExplainer` (`text.ts:147-160`). All four consume `isNoEditRequest`, and no caller adds its own object/verb check.
- Exact surface exercised: `attachCommand('sk-doc', {action:'route',selectionKind:'single',targets:[{workflowMode:'sk-create-agent'}]}, <prompt>)`, the same route shape the guard tests use, run against both the current and the pre-commit module.
- Suite run permitted by the dispatch: `env -u AI_SESSION_CHILD npx vitest run tests/command-attach-guards.vitest.ts` from `.skilled/skills/system-skill-advisor/runtime` -> **26 passed, 0 failed**. A green suite with the P1 present is evidence that the table lacks a genuine-no-edit-with-object row, not evidence that the predicate is right.

## Confirmed-Clean Surfaces

The fix target itself holds (each prompt run through the current module):

| Prompt | `isNoEditRequest` |
|---|---|
| `make no changes to its public api` | false |
| `make no changes in the tests` | false |
| `refactor the parser and make no changes to its public api` | false |
| `rename the helper but make no changes in the tests` | false |

The unchanged no-edit forms still fire: `make no changes` -> true, `make no changes, just analyze` -> true, `do not change anything` -> true, `just show me the plan` -> true, curly-apostrophe `don’t touch any files` -> true.

## Edge Cases

- The pre-commit module was extracted into `probes/command-attach-pre.ts` rather than checked out, so the review target stayed read-only and the comparison module stayed inside the lineage. Both modules have no imports, so the two runs differ only in the pattern line.
- A prompt that combines a scope limit with another old no-edit phrase still reads as no-edit and still withholds the command: the P1 bites only when no other alternative matches. Recorded so the severity is not read as "every change request is now offered a command".
- A prompt that names the artifact surface as a genuine no-edit request and also names a change verb elsewhere in the sentence is genuinely ambiguous; the predicate cannot separate the readings, which is the root cause behind both findings.

## Ruled Out

- "The fix breaks the original `AR3-P2-001` case": ruled out — both commit-added rows and the predicate return `false`.
- "Another alternative in `NO_EDIT_REQUEST` catches the failing prompt": ruled out by enumerating all nine alternatives against `make no changes to any file, just report what you find`; none matches.
- "A caller compensates with a second check": ruled out by reading all three call sites — none inspects the sentence beyond the predicate.

## Next Focus

- Dimension: maintainability (then traceability).
- Focus area: test-table completeness for the no-edit predicate and the hook check, the commit's own claims, and whether the two P2s stay advisory at synthesis.
- Reason: correctness coverage is now complete on both halves of the diff; the remaining question is whether the tests would have caught the P1 and whether any packet doc claims otherwise.
- Rotation status: correctness rotates out.
- Required evidence: the two named test files run green, and the exact test-table gaps cited by line.

## Verdict

The no-edit fix holds for the case it targeted but introduced a P1 regression in the opposite direction and leaves the old class reachable through an adverb. Active P1 with no P0.

Review verdict: CONDITIONAL
