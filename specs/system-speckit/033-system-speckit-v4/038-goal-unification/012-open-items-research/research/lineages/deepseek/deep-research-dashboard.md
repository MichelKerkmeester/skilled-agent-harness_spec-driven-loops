# Deep Research Dashboard: the goal items left open

Session: `fanout-deepseek-1789201017494-mped3v` · executor `cli-pi model=deepseek-v4.1-flash`
Stop policy: `max-iterations` · status: complete (`maxIterationsReached`)

## Iteration Table

| # | Ring | Status | newInfoRatio | Findings | Recommendation |
|---|---|---|---|---|---|
| 1 | Line length | complete | 1.00 | 6 | Retire the 100-character prose standard; add no lint |
| 2 | Unowned surfaces | complete | 0.85 | 8 | Keep consistent duplication under owners; repair two drifted surfaces |
| 3 | Root README goal section | complete | 0.90 | 5 | Cover by contract test; keep out of both retrieval lanes |
| 4 | Naming collision | complete | 0.80 | 5 | Rename the deep-review scope manifest and its checker |
| 5 | Machine checks | complete | 0.90 | 5 | Add three checks plus one assertion; decline four facts |

## Question Status

| Question | Status | Where answered |
|---|---|---|
| Is the 100-character limit live, dead, or needing an exemption? | Answered (retire) | iteration-001, research.md §2 |
| Who owns each unowned surface, and which duplications drifted? | Answered | iteration-002, research.md §3 |
| README goal section: tested, retrievable, or outside both? | Answered (test it) | iteration-003, research.md §4 |
| Rename, note, or nothing for the word "goal"? | Answered (rename) | iteration-004, research.md §5 |
| Which facts earn a test, with what shape? | Answered | iteration-005, research.md §6 |

## Convergence Trend

newInfoRatio per iteration: 1.00, 0.85, 0.90, 0.80, 0.90 · average 0.89 · threshold 0.05 not
reached, and not the stop condition (the cap was).

## Dead Ends

- Repo-wide 100-character lint: ~216,500 failing lines; tables and links cannot be rewrapped.
- Goal-docs-only line budget: nothing breaks at 104 characters, so it fails for no reason.
- Joining the root README to a retrieval lane: needs frontmatter on an 87 KB marketing file and
  reverses a documented exclusion.
- Renaming the session-goal vocabulary: the session goal and the packet goal are one system.
- Per-copy prose checks of the support story: rephrasing becomes a false failure.
- Checking the state-directory README or historical citations: a check that cannot fail for a real
  reason.

## Blocked Stops

None. No iteration was blocked; no recovery path was entered.

## Graph Convergence

No graph events. This lineage ran five read-only evidence iterations with no graph traversal.

## New Defects Found

| # | Defect | Severity | Source |
|---|---|---|---|
| 1 | Three `OPENCODE_GOAL_*` env vars read by the plugin, documented nowhere | high | iteration-005 |
| 2 | Live spec-kit test depends on a checker script inside a spec packet | high | iteration-002 |
| 3 | `OPENCODE_GOAL_RUNTIME_LABEL` documented only in `.env.example` | medium | iteration-002 |
| 4 | Two parsers of `goal-file-manifest.txt` enforce different contracts | medium | iteration-002 |
| 5 | The cited 365-line count does not reproduce | medium | iteration-001 |

## Next Focus

Operator decision on the five recommendations. If accepted, the implementation order that shifts
the least at once: (1) the ring 5 check file plus the three env-var doc lines; (2) the README
contract-test coverage; (3) the checker relocation and manifest rename as one change; (4) record
the line-length retirement; (5) the ring 2 doc line for `RUNTIME_LABEL`.
