# Review Iteration 001

- Dimension: correctness
- Operator review focus: the no-edit pattern fix of commit `860610d783`. This iteration read the changed pattern, the helper that reads it, all three production call sites and the two new tests, then ran concrete prompts through the source to judge the fix and probe the class it guards. The focus's "does each fix hold, and did it introduce a defect" question is answered for the no-edit fix here, with the doctor hook check left to iteration 2.
- Budget profile: verify (11-13 calls)
- Base/HEAD: `860610d783cb75e496eb97cd0808355512e547a2` (the fix commit itself; parent `0a6638f2ab`)

## Dispatcher

`@deep-review` LEAF iteration driven by the fan-out lineage `noedit-confirm-3b`, session `fanout-noedit-confirm-3b-1794595021404-69frey`, generation 1, lineage mode `new`. Sources read this iteration: `review-instructions-3b.txt`, `git show 860610d783 -- .skilled`, `lib/command-attach.ts:240-339`, `lib/scorer/text.ts:147-163`, `lib/scorer/fusion.ts:674-690,876-887`, `tests/command-attach-guards.vitest.ts:25-80`, `handlers/advisor-recommend.ts:474`, the pass-three findings `AR3-P2-001` (advisor-runtime-3 iteration 1) and `DR3-P1-001` (doctor-docs-3 iteration 4), and `review/lineages/noedit-confirm-3b/steer.md` (absent at read, so no lead ruling applied).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:287-295` (changed), `:314-339` (`attachCommand`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:147-163` (caller, `isReadOnlyExplainer`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:674-690` (`readOnlyRouteAllowed`), `:876-887` (`commandMeaningEligible`)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:25-80`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:474` (the one production caller of `attachCommand`)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **`make no changes to` reads a genuine no-edit request as a change request** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289` -- The fix adds `(?! (?:to|in)\b)` after the `make no changes` alternative. The lookahead cannot tell a scope limit inside a change request from the object of a no-edit request, so it deletes the whole phrase whenever it is followed by `to` or `in`. `isNoEditRequest('make no changes to the tests')` now returns `false` where `isNoEditRequest('make no changes')` returns `true`, and the prompt is then treated as a change request: `attachCommand('sk-doc', {action:'route',selectionKind:'single',targets:[{workflowMode:'sk-create-agent'}]}, 'make no changes to the tests')` returns `/create:agent`. Before this commit the same prompt returned `undefined`. The two new tests at `tests/command-attach-guards.vitest.ts:73-74` pin only the change-request direction, so nothing in the suite fails for this regression.
   Finding class: class-of-bug (the mirror of the pass-three class: the same preposition pair decides the verdict in both directions).
   Scope proof: the lookahead is on the changed line `command-attach.ts:289`; the value is read at `command-attach.ts:335`, `scorer/text.ts:150`, `scorer/fusion.ts:677` and `scorer/fusion.ts:881`, all of which now see `false` for this prompt.
   Affected surface hints: hub command attachment (`handlers/advisor-recommend.ts:474`), read-only explainer gate (`scorer/text.ts:150`), read-only route gate and command-meaning eligibility (`scorer/fusion.ts:677,881`).
   Case: `make no changes to the tests` -> `isNoEditRequest` returns `false` and `attachCommand` with a single-mode `sk-create-agent` route returns `/create:agent`; the same prompt with the phrase left bare (`make no changes`) returns `true` and `undefined`. Run with `tsx` against the current source (probe under the lineage directory).
   ```json
   {
     "type": "claim-adjudication",
     "claim": "The to/in guard removes the make no changes phrase from genuine no-edit requests, so the safety gate keeps a mutating command for a reader who ruled out changes.",
     "evidenceRefs": [
       "command-attach.ts:289",
       "command-attach.ts:335",
       "scorer/text.ts:150",
       "scorer/fusion.ts:677",
       "scorer/fusion.ts:881",
       "tests/command-attach-guards.vitest.ts:73-74"
     ],
     "counterevidenceSought": "Looked for an earlier alternative in the same pattern that would still catch the prompt (only just show / just list / do not change / read-only only, none present), and for a caller-side guard that restores the no-edit verdict before a command is attached (attachCommand consults only isNoEditRequest).",
     "alternativeExplanation": "The reader may consider the phrase with an object a scope limit by construction. The gate has no grammatical analysis, so a standalone request that says what to leave alone is indistinguishable, and the commit's own bare case proves the phrase alone is a no-edit marker.",
     "finalSeverity": "P1",
     "confidence": 0.9,
     "downgradeTrigger": "Downgrade to P2 if a caller is shown to treat a prompt carrying make no changes to as read-only anyway, or if the pattern is shown to match another marker for this wording in a later revision."
   }
   ```

### P2 Findings

1. **The guard matches a literal single space, so line-break and punctuation variants keep the pass-three defect** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289` -- The lookahead is `(?! (?:to|in)\b)`, with a literal space and no allowance for a newline, tab, doubled space or punctuation between the phrase and its object. Those forms match `make no changes` and are read as no-edit requests, so the change request loses its command -- the exact class `AR3-P2-001` reported. Inputs run: `refactor the parser and make no changes\nto its public api`, `... make no changes  to its public api` (two spaces), `... make no changes\tto its public api`, `... make no changes: to its public api`, `... make no changes, to its public api` each return `true` from `isNoEditRequest` and `undefined` from `attachCommand`.
   Finding class: class-of-bug (a residual formatting window of the class the commit claims to close).
   Scope proof: only the changed line can widen the separator; no normalisation of the prompt happens before the pattern reads it (`command-attach.ts:294` lowercases and folds apostrophes only).
   Affected surface hints: hub command attachment, read-only explainer gate, command-meaning eligibility.
   Case: `refactor the parser and make no changes\nto its public api` returns `true` from `isNoEditRequest`, so `attachCommand` returns `undefined` for the single-mode route and the change request keeps no command.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The commit names the intended behavior (a change request that says what to leave alone keeps its command). It holds for the exact single-line, single-space form. The mirror direction (a genuine no-edit request with an object) is now read as a change request, and the formatting variants of the original class survive. Both gaps are recorded above. |
| `checklist_evidence` | partial | `env -u AI_SESSION_CHILD npx vitest run tests/command-attach-guards.vitest.ts` reported `Test Files 1 passed (1)`, `Tests 26 passed (26)`, exit 0. The two added cases (`tests/command-attach-guards.vitest.ts:73-74`) only assert the change-request direction; the suite has one genuine bare case at line 34 and none with an object, so it cannot fail for the P1 regression. |
| `skill_agent` | notApplicable | No agent file among the two changed files. |
| `feature_catalog_code` | notApplicable | No catalog page among the two changed files. |

## Integration Evidence

- `attachCommand` has one production caller, `handlers/advisor-recommend.ts:474`, which passes the raw prompt; the changed gate therefore governs every hub recommendation carrying a compiled single-mode route.
- `isReadOnlyExplainer` (`scorer/text.ts:150`) and the two gates in `scorer/fusion.ts:677,881` import the same helper, so one pattern change moves all four gates together -- the commit's stated design, and the reason the P1 reaches every gate at once.
- `tests/command-attach-guards.vitest.ts:16-17` imports both `isNoEditRequest` and the raw `NO_EDIT_REQUEST`, so the legacy export is still exercised.

## Edge Cases

- The `no edits?` alternative has no object guard, so `make no edits to the file` still reads as a no-edit request. This is the conservative direction (no command offered), not a defect; recorded so the asymmetry is visible.
- The lookahead only governs `make no changes`. A prompt containing `no changes yet` or `without making changes` keeps its existing verdict regardless of a following `to`.
- The review focus asks for a `mktemp` folder for the doctor fixture. This lineage's write boundary forbids writes outside the lineage directory, so the doctor fixture in iteration 2 is created under the lineage directory instead and removed after the run; recorded as a deviation with no effect on the result.

## Confirmed-Clean Surfaces

- The fixed direction holds: `refactor the parser and make no changes to its public api` and `rename the helper but make no changes in the tests` both return `false`, and `attachCommand` returns `/create:agent` for them. This is the case `AR3-P2-001` reported, and it is closed.
- The phrase still matches when it stands alone (`make no changes` -> `true`) and when followed by `yet` (`make no changes yet, just show the plan` -> `true`).
- The pattern is still a single regex with no `g` flag, so repeated `.test` calls carry no `lastIndex` state.

## Ruled Out

- A `lastIndex` defect from the new lookahead: ruled out by reading the literal at `command-attach.ts:289`; it has no `g` or `y` flag.
- A caller that bypasses the helper and reads the raw pattern: ruled out by `rg` over the runtime; the only non-test readers are the helper itself and its four call sites.
- An apostrophe-folding regression: ruled out because the fold at `command-attach.ts:294` is unchanged and `Don\u2019t touch any files` still returns `true` in the suite run above.

## Next Focus

- Dimension: correctness
- Focus area: the doctor hook check fix `nodeFlagSkipsScript` in `.skilled/commands/doctor/scripts/hook-wiring-check.cjs`, checked once
- Reason: this lineage owns the no-edit fix; the hook fix is the other half of the commit and needs one confirming pass with a real fixture.
- Rotation status: correctness stays current for the second file group.
- Required evidence: a fixture settings file under the lineage directory, the check's printed status for a working command and for the three attached-flag spellings, and the test suite result.
- Recovery note: none.

Review verdict: CONDITIONAL
