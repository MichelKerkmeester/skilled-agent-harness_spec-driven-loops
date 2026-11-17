# Iteration 007 - fixture invariance

## Dimension

Correctness, fixture invariance: which of the suite's own invariants (wrapper matrix, retired-name parity, request/mention tables) the pass-fourteen rows join, and whether the two active boundaries would be caught by a row that does not exist yet.

## Dispatcher

```text
BINDING: target=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
BINDING: maxIterations=8
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
```

Resolved route: mode=review target_agent=deep-review; execution=single_review_iteration; state_source=externalized_files.

Operator review focus: pass fourteen, area `mention`. The pass read only the two scope files and honored the holdout rule.

Recovery note: the iteration-6 stop decision was `STUCK_RECOVERY` (stuckCount 5). This pass continues line-level fixture analysis.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:39-73`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:138-229`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:442-482`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R1-P1-001` and `R1-P1-002` remain active.

### P2 Findings

None new. `R1-P2-001` remains active.

## Traceability Checks

Not re-run; iteration 3's results stand.

## Integration Evidence

- `PLAIN_ROWS` (`tests:179-182`) is `REFUSE8 + QUESTION2 + REQUEST6 + CONTROL5` plus two or-list rows. The later-refusal rows (`202-208`) and the pass-fourteen request rows (`210-218`) are outside it, so neither the wrapper matrix nor the retired-name loop covers them.
- Wrapper invariance was re-checked by hand on two new rows (`run /speckit:save and don't run it twice`, `read the /deep:review docs, then do a thorough review of this diff`) across backticks, bold, brackets, curly quotes and code tags: every wrapped reading equals the plain reading. The invariant holds; it is simply not asserted for those rows.
- The two missing mention rows would fail if added: a `REFUSE8`-style row for `/create:readme keeps failing, never run it again` expects `true` and gets `false`, and a mention row for `read the /deep:review docs, then tell me what it does` expects `true` and gets `false`. Both are reproducible without editing the suite.

## Edge Cases

- `PLAIN_ROWS` membership is not a correctness requirement; it is a coverage choice. The fold runs before every branch, and the hand-check above found no wrapper-dependent difference, so the gap is low-risk and is folded into `R1-P2-001` rather than raised as a second P2.
- The retired-name loop only substitutes `/create:skill` for whatever command a row names; the new rows have no retired spelling, so excluding them costs nothing for that invariant.
- The two new request rows that pass through `COMMAND_ASKED_BY_PRONOUN` (`open the ... command file, then run it`) are still meaningful rows: they pin the pronoun rule, not the `then` guard.

## Confirmed-Clean Surfaces

- All five new request rows assert `false` and pass.
- The wrapper matrix still covers every row it lists, and the retired-name parity still holds for its own set.
- Adding the two missing mention rows would fail on the current code, so `R1-P2-001` is a real, test-detectable gap rather than a style preference.

## Ruled Out

- A separate P2 for `PLAIN_ROWS` membership: the hand-check found the invariant already holds, and `R1-P2-001` already asks for the rows that would matter.
- A finding against the fixture titles: each title matches its assertion for the five new rows.

## Next Focus

- Dimension: traceability (last under the cap)
- Focus area: re-record both core protocols with their file:line evidence, and confirm the remaining gate state before the cap ends the loop.
- Reason: the last iteration under `maxIterations` is reserved for the unfinished core protocols; both are `partial` because the two P1s are open, and the cap will stop the loop with them open.
- Rotation status: all four dimensions and the replay, consumer and fixture traces are covered.
- Blocked/productive carry-forward: `dimensionCoverageGate` stays closed by the two `partial` protocols; do not claim a legal STOP.
- Required evidence: `spec.md:57`, `implementation-summary.md:83`, `acceptance-criteria.md:60`, `tasks.md:131`, and the two code lines.

## Verdict

No new finding; both P1s and the P2 remain active.

Review verdict: CONDITIONAL
