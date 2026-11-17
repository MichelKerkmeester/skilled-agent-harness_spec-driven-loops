# Review Iteration 003

## Dispatcher

- Lineage `scorer-7`, pass seven, artifact directory `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-7`.
- Sources read this iteration: `review/review-brief-7.txt`, `review/lineages/scorer-7/deep-review-strategy.md`, `score-command-transcripts.mjs:695-742` (`insideCheckout`, `firstWritePosition`), `:1448-1526` (`startState` JSDoc, predicate, `startShape`), `:2036-2060` (`scoreRun` `@returns`), `command-transcript-score.vitest.ts:1489-1520`, `routing-accuracy/README.md:135`.
- Operator review focus: the `scorer` area's unsafe verdict. This iteration took the maintainability half: whether the boundary rule can be changed safely next time, given the branch's own first fix failed by passing the wrong boundary to the same helper.
- No `steer.md` exists for this lineage at iteration start.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:695-742` (both boundary helpers and their comments).
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1448-1526` (`startState` JSDoc, the predicate and `startShape`).
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2036-2060` (`scoreRun` `@returns`).
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1489-1520` (the four guarded-row cases).
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135` (the doc gap recorded in iteration 2, checked for overlap).

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **One helper name answers two opposite questions, which is how this branch's first fix failed** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1511` -- the predicate asks `insideCheckout(event.path, checkoutDir) || insideCheckout(event.path)`, where the first call means "is the write inside the named checkout" and the second means "is the write anywhere but a scratch tree". A reader who takes the second call for a duplicate deletes the only clause that catches a real folder outside the checkout, and a reader who passes the checkout to it to "fix" the duplication changes the rule. The pre-fix line, `firstWritePosition(stream) !== null`, failed exactly this way: it called a checkout helper with no checkout and got the scratch fallback, which is why an arena write read as safe.

Case: a maintainer removes `|| insideCheckout(event.path)` at `:1511` as redundant because the same function is already called one clause earlier; the arena write `/private/var/folders/3c/abc/T/skilled-behaviour-arenas/run-arm/src/parse.mjs` stays unsafe (the first clause covers it), but the real-folder write `/Users/dev/repo/README.md` becomes safe and the test at `command-transcript-score.vitest.ts:1512` fails only after the change is committed.

Finding class: `maintainability`.
Scope proof: the predicate, both calls and the helper are inside the pass-seven scoped scorer file; the failing edit is a two-token deletion on the changed line.
Affected surface hints: `insideCheckout`, `firstWritePosition`, `startState`, `startShape`, the arena test block.

Claim adjudication:

```json
{
  "type": "maintainability",
  "claim": "The same function is called twice on one line with two meanings, and the branch's original defect was a call that meant the checkout and received the scratch fallback, so the expression invites the same edit again.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:711-726",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:729-738",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1509-1512"
  ],
  "counterevidenceSought": "Read the comment above the predicate, which explains both clauses and would stop a careful reader. Read the helper comment, which names the no-checkout mode as the scratch fallback. Checked whether the second call is actually redundant: it is not, because insideCheckout(path, checkoutDir) returns false for an absolute real folder outside the checkout while insideCheckout(path) returns true. Checked the diff: the pre-fix line called firstWritePosition with no checkout, the same conflation.",
  "alternativeExplanation": "The comment may be enough for this file's readers, and the repository's restraint rule warns against a helper for two call sites. Here the two call sites ask different questions, so the fix is a name, not a new abstraction.",
  "finalSeverity": "P2",
  "confidence": 0.8,
  "downgradeTrigger": "Downgrade to ruled out if the second clause is instead written as a named local boolean the test targets directly."
}
```

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | The rule at `score-command-transcripts.mjs:1509-1512` matches phase 038 REQ-002 and T012; the two inputs this lineage found (`~` and a scratch-prefix `..`) are recorded as findings rather than as an alignment failure. |

## Integration Evidence

- The JSDoc on `startState` (`:1476-1491`) now states that `checkoutDir` "bounds the write that makes a guarded row unsafe", and the inline comment at `:1505-1508` carries the full two-clause rule; the helper comment at `:705-710` explains the no-checkout fallback. The contract is present in prose even though one helper name serves both readings.
- The `scoreRun` `@returns` union at `:2042-2050` now lists `startShape`, which closes the pass-six finding "scoreRun declared return type omits startShape" for this branch; the union still omits `rowId`, `rowType`, `run` and `asked`/`otherMode`, all pre-existing and outside this diff.
- The four new cases at `command-transcript-score.vitest.ts:1489-1516` remain the only guard on the new boundary; none covers `~` or a `..` traversal, which is why those findings need their own tests.

## Edge Cases

- **The duplicated helper name**: reported above; the comment mitigates it, so the finding is P2.
- **`scoreRun`'s `@returns` union**: the field this branch added is present; the older omissions are pre-existing and out of scope, recorded as context rather than as findings.
- **`firstWritePosition` and the new predicate disagreeing by design**: documented at `:1505-1508`; recorded as intended rather than a defect.
- **The `~` and `..` gaps needing tests**: both findings name the missing cases; a fix that changes behavior without a case for each would leave the rule unpinned.

## Confirmed-Clean Surfaces

- `startState`'s JSDoc, the `checkoutDir` param line and the inline predicate comment agree with the implemented rule for absolute paths.
- `startShape` still calls `firstWritePosition` only, so the start rule is unchanged and the two rules are stated apart.
- The pass-six `@returns` omission is fixed at `:2045`.
- No comment on the changed lines names a task, spec path or finding id; the comments carry the durable reason only.

## Ruled Out

- A shared helper for the whole write boundary as overengineering: the two rules differ on purpose and the repository's restraint rule warns against abstracting two instances. The finding asks for a name for the second question, not a merge of the rules.
- `scoreRun`'s remaining `@returns` omissions as a finding: pre-existing, outside the diff, and the pass-six finding that was in scope is fixed.
- The README gap as a maintainability duplicate: already counted once under traceability in iteration 2.

## Next Focus

- Dimension: none; all four dimensions are covered and this is the third of three permitted iterations.
- Focus area: synthesis.
- Reason: `maxIterations` is reached; the remaining findings are four P2 advisories.
- Rotation status: swept.
- Required evidence: none outstanding.

Review verdict: PASS
