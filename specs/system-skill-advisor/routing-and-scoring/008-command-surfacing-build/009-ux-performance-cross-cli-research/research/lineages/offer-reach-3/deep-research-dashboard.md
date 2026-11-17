---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: SEGMENT THREE offer-reach lane: what still limits command surfacing after phases 011, 012 and 013, measured from the built state. Lane offer-reach-3 owns (a) which plain tune rows of .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl still get no command after phase 012, and why, by row id, with the cause named per row (no command evidence, hub defers, below threshold, policy or cap, wrong top); and (b) intent-signal enrichment and re-embedding of the skill graph, declined in segment two at rank 15: which tune rows it would move, its risk to the floors, and the cost of keeping vectors in step with the metadata. Also carried, unassigned to a lane: (g) the degraded fallback path when the advisor daemon is unreachable, which runtimes hit it in practice, how often, and the smallest change that makes the fallback carry the same command as the live answer. Floors to protect: typed recall 24 of 44, false offers 0 of 35, scorer eval [160,50,21,5]. Do not re-recommend anything already ranked, built or declined in segment one or segment two.
- Started: 2026-11-13T06:12:04Z
- Status: COMPLETE
- Iteration: 6 of 6
- Session ID: fanout-offer-reach-3-1794550139177-nft9c6
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Which plain tune rows still get no command after phase 012, and why, by row id | offer-reach | 0.85 | 10 | complete |
| 2 | Intent-signal enrichment and re-embedding of the skill graph: rows moved, floor risk, vector drift cost | offer-reach | 0.80 | 9 | complete |
| 3 | Degraded fallback path: which runtimes reach it, how often, and the smallest change that carries the live command | offer-reach | 0.75 | 10 | complete |
| 4 | Validated candidate set ranked by gain per unit of floor risk, cross-checked against segments one and two | offer-reach | 0.45 | 7 | insight |
| 5 | Floor risk of the two leading candidates, measured on the 35 silent rows | offer-reach | 0.55 | 7 | complete |
| 6 | One measurement model for the plain-offer numbers, the final ranked list and the remaining gaps | offer-reach | 0.20 | 7 | insight |

- iterationsCompleted: 6
- keyFindings: 50
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which plain tune rows of command-prompts.jsonl still get no command after phase 012, and what is the cause per row id?
- [x] Would intent-signal enrichment and re-embedding of the skill graph move the remaining plain tune rows, and at what risk to the floors?
- [x] What does keeping the embedding vectors in step with the metadata cost, and how is drift detected?
- [x] Which runtimes hit the degraded fallback path in practice, and how often?
- [x] What is the smallest change that makes the fallback answer carry the same command as the live answer?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ████▇▇▇▇▇▆▅▄▄▄▄▅▄▃▂▁
- score sparkline: ████▇▇▇▇▇▆▅▄▄▄▄▅▄▃▂▁
- Last 3 ratios: 0.45 -> 0.55 -> 0.20
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.20
- coverageBySources: {"code":37,"other":31}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- `cmd-create-skill-parent-plain-tune-01`: no scorer row and no hub route, so no command can attach without new evidence; it is an alias or scorer-row question, not a table edit. (iteration 1)
- `cmd-doctor-skill-advisor-plain-tune-01`: the command has seven subcommands and no default, so no single command can be attached without a policy decision about which subcommand a bare request means. (iteration 1)
- Counting the whole top three as "offered". The renderer emits one head plus an optional doctor `Also:` line, so a rank-2 command is invisible in 16 of the 17 no-command rows. (iteration 1)
- Reading the committed `attachedMetrics.plain.tune` line as a brief-offer count. It measures expected-command reach through scorer row ids and hub attach at capture time; the live head disagrees on six rows, so it cannot enumerate the rows this iteration asks about. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:491] (iteration 1)
- Treating the six subcommand differences as wrong offers. All six are the expected command's own documented subcommand, so they are label granularity in the corpus, not a routing error. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:74] (iteration 1)
- Adding intent text to the 14 `SKILL.md` descriptions. That is an operator-facing document change in `sk-doc` scope, not a routing fix, and it changes bytes the model reads. (iteration 2)
- Measuring an enriched re-embedding without writing vectors. No read-only switch composes the enrichment, so the only honest statement is the bounded projection in finding 9. (iteration 2)
- Reopening rank 15 on the real-embedder numbers alone. The +5 tune rows are top-1 exactness on rows that already carried a command; they do not move a single no-command row, so the disposition does not change. (iteration 2)
- Treating the fixture capture's 23 and the real capture's 28 as a before/after pair. They are two scoring regimes at one commit. (iteration 2)
- Using the holdout delta (1 to 3 of 44) as evidence for enrichment: it is the same real-embedder effect, and holdout prompt text was not read. (iteration 2)
- Measuring the fallback rate from committed artifacts: no counter exists outside debug mode, so any frequency claim beyond the recorded arms would be invented. (iteration 3)
- Reusing `degradedRecommendations` alone. It has no command to preserve on an untyped prompt: the Python rows name bridge ids that the function intentionally reduces to their owner skill, so keeping the fields would still not produce the live command or the live skill. (iteration 3)
- Treating Codex as a degraded-path runtime. Its hook never runs on this checkout (unapproved), so its failure is a missing brief, a different defect with a different fix. (iteration 3)
- Treating cold start as a degraded-path trigger. The `--no-warm-only` flag and the 008 measurement rule it out. (iteration 3)
- Using the long lineage path as a socket dir: Darwin rejects it with exit 69 before any answer, so the probe was rerun on a loopback endpoint. (iteration 3)
- A second rendered head for candidate 5: it costs bytes on every prompt, which is the one budget the brief cannot grow. (iteration 4)
- Proving candidate 1's gain by editing the router: out of scope for this lineage. The compiled-route probe on the current wording plus the alias-class read is the strongest available evidence. (iteration 4)
- Proving candidate 4's gain without the code change: the daemon path cannot be forced through `runLocalScorer` without an unreachable endpoint, and the Python branch is what answers there. (iteration 4)
- Re-recommending the capture `offered` relabel. Phase 013 already built it and the remaining risk is a reader trusting the field, which iteration 1 documented. (iteration 4)
- Reopening rank 15 on this evidence. The measured brief-level gain is zero. (iteration 4)
- Treating candidate 2 as one change: its six rows split into five anchor rows and one missing-scorer-row row, with different files and different risk. (iteration 4)
- Adding a bare `rewrite` keyword to the human-voice class. It would steal a working diff row. (iteration 5)
- Estimating candidate 2's new scores without writing the anchors: no read-only switch scores a hypothetical anchor set, so the band is stated as a constraint on the implementing phase, not a predicted number. (iteration 5)
- Measuring candidate 1 with a whole-file alias rewrite. The two exact phrases are isolated, so a narrower edit carries the same gain with no canary exposure. (iteration 5)
- Treating the 0 of 35 floor as the whole risk test for candidate 2. The three doctor-top rows are the ones that move first, and the aggregate would only show the failure after the fact. (iteration 5)
- Closing the fallback-frequency gap from inside the lineage: it needs a persistent counter that only a build phase can add. (iteration 6)
- Counting the six subcommand rows as misses in the final ranking; they are reach, and only the label granularity differs. (iteration 6)
- Measuring OpenCode's degraded path: no delivery marker exists for the committed arm. (iteration 6)
- Reporting a single "plain recall" number without its definition. The four numbers differ by metric and regime, and quoting one alone would misstate the built state. (iteration 6)
- Treating the 4 needs-mode rows as fixable recall. They are a deliberate ask, and forcing a command on them would repeat the eliminated "default command for a deferring hub" item. (iteration 6)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
