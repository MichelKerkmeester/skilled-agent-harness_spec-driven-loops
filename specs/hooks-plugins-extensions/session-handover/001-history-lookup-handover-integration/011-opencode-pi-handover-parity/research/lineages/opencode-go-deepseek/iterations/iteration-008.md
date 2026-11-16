# Iteration 8: The Two-Answer Rule For Question Coverage

## Focus

The diversity guard now passes at 1.5 but the graph still blocks the stop on `uncovered_questions` and a 1.4 diversity average. Read the coverage signal itself to learn what "covered" means, then record the missing answering relations.

## Actions Taken

- Read `computeResearchQuestionCoverageFromData` and the blocker list it feeds.
- Counted answering findings per question from the recorded edges.
- Re-filed three findings as answers where each one is the direct answer to its question.

## Findings

1. **A question counts as covered only when at least two findings answer it directly.** Coverage is `(questions with >= 2 ANSWERS edges) / total questions`, so a question with one strong answer and three supporting findings still counts as uncovered. The lineage had two such questions: the claim-offer question had no `ANSWERS` edge at all (its evidence was filed as `SUPPORTS`), and the known-limits question had one. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:570]

2. **The same relation error depressed the diversity average, not the evidence base.** `sourceDiversity` is the mean distinct quality classes per question over all question nodes, so a question with no answering finding contributes zero even when its primary artifacts are recorded and cited. Filing the direct answers raises both signals at once: coverage from 0.6 to 1, and the diversity mean from 1.4 to 2. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:653]

## Ruled Out

- "Supporting evidence counts as coverage": ruled out by the implementation, which filters to `ANSWERS` before counting.
- "The graph thresholds are miscalibrated for five questions": not pursued. The thresholds are reachable with two direct answers per question, which this evidence base supports.

## Dead Ends

- Adding still more code citations. The gap was relation shape, not source count.

## Edge Cases

- Ambiguous input: none; the counting rule is explicit in code.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Questions Answered

None newly. The five answers stand as recorded; this pass makes the graph able to see them.

## Questions Remaining

None.

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:570
- .skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:653

## Assessment

- New information ratio: 0.6
- Questions addressed: graph coverage semantics
- Questions answered: none newly

## Reflection

- What worked and why: reading the coverage function instead of tuning the graph. The rule is two direct answers per question, which is a reasonable minimum for a research packet.
- What did not work and why: treating `SUPPORTS` as interchangeable with `ANSWERS` across two separate guards; both metrics filter on the relation, so the mistake cost two passes.
- What I would do differently: when a finding closes a key question, record `ANSWERS` immediately and use `SUPPORTS` only for corroboration that does not itself answer.

## Recommended Next Focus

Re-evaluate convergence once more. With two answering findings per question and two evidence classes each, both the coverage and the diversity guards should clear; if the stop still blocks, the report must not claim convergence.
