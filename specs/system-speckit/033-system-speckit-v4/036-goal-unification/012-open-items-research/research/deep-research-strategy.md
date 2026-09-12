# Deep Research Strategy: the goal items left open

## Charter

Five iterations, no early convergence, one open item per iteration. Every claim about current
behaviour carries a `file:line` that was opened. Design conclusions are marked CLAIM; anything
unconfirmed is INFERRED or UNKNOWN with the action that would settle it. Each iteration ends
with a recommendation the operator can accept or reject, not a survey.

## What is actually open

The repo-wide research closed fourteen of fifteen contradictions and the remediation built them.
These are what it left behind, deliberately or for want of a decision.

| # | Open item | Why it is still open |
|---|---|---|
| 1 | Line length | 365 lines across the four goal files exceed the style guide's 100-character limit, 89 of them written this session. No lint rule enforces it and every shipped plugin breaks it at a similar rate. |
| 2 | Unowned surfaces | Five hand-copied flag rosters, six copies of the runtime support story, a state-directory README describing two engines, a spec-kit contract test living in the plugin test folder and listed in no goal document, two environment variables that exist only in an example file. |
| 3 | Untested and unreachable prose | The root README goal section is covered by no test and sits outside both retrieval lanes. |
| 4 | Naming collision | The word "goal" names four unrelated things, one of them a deep-review scope manifest with its own parsers and a packet-resident gate. |
| 5 | Machine checks | One contract test now pins cited paths, suite counts and the disable variable. The rot it caught suggests more is pinnable, and the question is what earns a check versus what is cheaper to let drift. |

## Rings, one per iteration

1. **Line length.** Measure the real distribution across the repository, not just these files.
   Decide whether the limit is a live standard, a dead one, or one that needs a stated exemption.
   Recommend: enforce, exempt, or retire, with the change that implements the recommendation.
2. **Unowned surfaces.** For each, name the owner it should have, or say it should be deleted or
   generated. Distinguish duplication that is cheap and consistent from duplication that has
   already drifted.
3. **Untested and unreachable prose.** Decide whether the root README goal section should be
   covered by the contract test, joined to a retrieval lane, or left as marketing prose that
   deliberately sits outside both. Say which, and why the other two are wrong.
4. **Naming collision.** Judge the real cost. Recommend rename, disambiguating note, or nothing,
   and name every file a rename would touch.
5. **Machine checks.** Given rings 1 to 4, say exactly which facts are worth pinning with a test
   and which are not, with the test shape for each one you recommend. A check that cannot fail
   for a real reason is not a recommendation.

## Output

`research/research.md` is the canonical record: one section per ring, each ending in a single
recommendation with its cost and its blast radius.
