# Review Iteration 003

## Dispatcher

- Lineage `scorer-8`, pass eight of the command-surfacing build review, artifact directory `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-8`.
- Sources read: `review/review-brief-8.txt`, `review/review-scope-8.txt`, `review/lineages/scorer-8/deep-review-config.json`, `review/lineages/scorer-8/deep-review-strategy.md`, `review/lineages/scorer-8/iterations/iteration-001.md`, `review/lineages/scorer-8/iterations/iteration-002.md`, `review/lineages/scorer-8/deep-review-findings-registry.json`, `.skilled/skills/sk-code/sk-code-review/references/review-core.md`, `score-command-transcripts.mjs:1508-1535`, `command-transcript-score.vitest.ts:1509-1535`, `README.md:135`.
- Diff command: `git -c core.fsmonitor=false diff 1c3d62def5a 3416b5e0526 -- <path>` for each scoped scorer file. No prompt corpus or holdout file was opened; `--summary` was not run.
- Operator review focus: the brief's `scorer` area. This iteration closed it from the maintainability side: the helper comment and name, the second copy of the scratch-root policy, and whether the changed behavior is pinned by tests, which is the focus the previous iteration handed forward.
- No `steer.md` exists for this lineage at iteration start.

## Dimension

Maintainability: comment accuracy, helper naming, follow-on change cost, and test coverage of the changed behavior.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1506-1535` (`startState` call site, `guardedWriteCounts`, `startShape`), `:700-735` (`insideCheckout` fallback list).
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1418-1445`, `:1485-1535`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Maintainability Checks

- **The helper comment matches the code.** The comment at `:1512-1520` claims four things, and each is true of the function below it: a checkout write counts (clause 1), a write outside the checkout counts unless it lands in a scratch folder (clause 2), a `..` step is resolved first (`posix.normalize` at `:1520`), and a home path is real (`normal.startsWith('~')` at `:1521`). The unreadable-path case is handled first (`:1519`) and matches the comment's "kept on the cautious side".
- **The name answers the question it is asked.** `guardedWriteCounts` returns whether one write counts for a guarded row, which is what the `wrote` expression at `:1506` asks. That closes the pass-seven P2 about one helper name answering opposite questions: the extraction is named for the policy, and `insideCheckout` keeps its narrower geometric meaning.
- **The changed behavior is pinned where it can fail.** The three `it.each` cases at `:1517-1524` cover the real folder, the home spelling and the traversal spelling; the arena and scratch cases at `:1485-1501` cover both guarded shapes and the exemption. The suffix case at `:1527-1533` covers a chained mode plus modifier. A regression in any of the five inputs fails a named case.
- **Two copies of the scratch-root policy.** `guardedWriteCounts:1522` encodes the four temp trees as a regex, and `insideCheckout:724-727` encodes the same four as four prefix tests. No input separates them today (probed: the helper's clause and `insideCheckout(normal)` agree on `/tmp/x`, `/private/tmp/x`, `/var/folders/x/T/n`, `/private/var/folders/x/T/n` and `/Users/dev/x`), so this is a drift risk and not a defect: the helper could ask `insideCheckout(normal)` instead of restating the list. Recorded under Ruled Out for a future pass, not as a finding, because no concrete input shows a wrong result today.
- **The negative suffix boundary is pinned by the sibling suite, not this one.** `:with-everything` and `:auto:draft` are proven unstripped in `command-attach-guards.vitest.ts:451` and by this review's probe, but the scorer's own vitest file has no case for them. Recorded as a follow-up, not a finding: no input produces a wrong result today, and the alternation is explicit rather than a wildcard.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | Unchanged from iteration 2: REQ-002/AC-002 match `guardedWriteCounts:1518-1525`, whose comment and tests now also agree with the code's shape. |
| `checklist_evidence` | core | pass | Unchanged from iteration 2: `tasks.md:47` and `:139` cover the mirrored suffix chain and the unknown-suffix refusal; this iteration adds the observation that the scorer's own suite does not re-pin the refusal. |

## Integration Evidence

- The pass-eight diff is self-contained in the three scoped files plus the sibling `command-attach.ts` comment. No caller signature changed: `startState` keeps its `(events, row, checkoutDir)` contract and its return shape, and the README row documents the new boundary.
- The helper is not exported, so its contract is exercised only through `startState`; every case above runs through that exported entry point, which is the same one `scoreRun` uses.

## Edge Cases

- **Scratch-root drift** (recorded, not reported): if one of the two lists gains a tree, the helper's `outsideScratch` can disagree with `insideCheckout`'s fallback in the unsafe direction. No input separates them in this revision.
- **A chained suffix on a skill id that is not a command**: `MODE_SUFFIX` applies to every `commandParts` caller, including `confirmStem` and `offerSeenIn`. No skill id in the repository ends in one of the six mode words, so the strip cannot shorten a skill name that matters.
- **P2-only verdict**: the two active findings are P2, so this pass's verdict stays PASS with advisories; the final line reports PASS because no P0 or P1 is active in this iteration.

## Confirmed-Clean Surfaces

- The helper's comment, name and behavior agree, and the `wrote` expression reads as one policy question rather than three inline clauses.
- All five changed inputs have a failing case if regressed: arena write, scratch note, real folder, home spelling, traversal spelling, plus the suffix chain case.
- The README sentence and the code agree clause for clause, including the `..` and home-path claims.
- `startShape` still calls `firstWritePosition` alone, so the start boundary did not widen when the unsafe boundary did.

## Ruled Out

- **Duplicated scratch-root list as a finding**: no input shows a wrong result today; the two lists agree on every probed spelling. Recorded as a follow-up for the next pass, where a shared list would remove the drift.
- **Missing scorer-side negative suffix test as a finding**: the sibling suite pins it and today's alternation is explicit; a test-only gap with no failing input is a follow-up, not a defect.
- **`guardedWriteCounts` being unexported**: exporting it would widen the module surface for no caller; `startState` is the contract the scorer and tests use.
- **Comment duplication between the inline note and the helper comment**: the inline note was removed in the same diff, so there is one comment, not two.

## Next Focus

- Dimension: none remaining; all four configured dimensions are covered.
- Focus area: if the loop continues, re-verify the two P2 inputs from iteration 1 against the current file and check whether the deferred maintainability follow-ups (shared scratch list, scorer-side negative suffix test) were taken up.
- Reason: convergence is the next decision; no unexplored dimension remains.
- Rotation status: rotation complete.
- Required evidence: a re-read of `score-command-transcripts.mjs:1362` and `:1524` to confirm both P2 inputs still reproduce.

Review verdict: PASS
