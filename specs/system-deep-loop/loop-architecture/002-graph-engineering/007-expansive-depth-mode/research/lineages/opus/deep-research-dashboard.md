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
- Topic: What changes would make the expansive-depth deep-loop modes (research and review), and the deep-loop runtime behind them, simpler, cheaper, easier to operate and identical across CLI runtimes, ranked by value over effort?

Read the code at HEAD d4420e9510d. The spec folder is specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode (SPEC below). Its fan-out review (SPEC/review/review-report.md) and the fix commits a424fb6cd8a..d4420e9510d already closed that review's findings: build on them and do not re-report them. Every recommendation names one concrete change, cites file:line (or a source URL for prior art), and states value, effort (S/M/L) and risk.

Q1 Restraint: what can be deleted, merged or collapsed across runtime/scripts/frontier-admit.cjs, both reduce-state.cjs reducers, runtime/scripts/convergence.cjs, runtime/scripts/fanout-run.cjs and the two workflow YAMLs (.skilled/commands/deep/assets/deep-research.yaml and deep-review.yaml) while every promise stays kept? Name concrete deletions.

Q2 Operator UX: flag discoverability, defaults, budget sizing, warnings, dashboards, reports, the dry-run preview, and recovery mid-run (provider quota, resume, extend, rerunning one failed lineage).

Q3 Cross-CLI parity: where cli-claude-code, cli-opencode, cli-codex, cli-pi, cli-devin, cli-cursor, cli-deepseek-harness and cli-mistral-vibe still differ in permissions, effort flags, failure classes, resume and log shape (fanout-run.cjs LINEAGE_COMMAND_ADAPTERS, runtime/lib/deep-loop/executor-config.ts). What single contract would remove the differences?

Q4 Cost and latency: the 8-11 minute setup, the cost per iteration, the 24-iteration ceiling and the 50/35/15 depth-band split, each checked against the measured runs in SPEC/review/, SPEC/review-archive/ and the live playbook logs.

Q5 Open design questions. (a) Should research count stuck passes per frontier node, as review now does? Research still counts lineage-wide at deep-research.yaml:1488 and keeps its own node-marker regex. (b) The lineage completion check (fanout-run.cjs TERMINAL_STOP_EVENTS_BY_LOOP_TYPE and checkLineageCompletion) marks 3 of 12 older committed research lineages as failed, because they predate the closeout row. Is that a backward-compatibility break for resume and extend, and what is the right rule? (c) Pivot admission into the frontier was dropped for structural reasons (D-011-10 in SPEC/011-review-frontier-mode/decision-record.md). Is there a cheap design that makes it work?

Q6 Prior art: how other agentic research and code-review systems handle frontier growth, stuck detection, stop rules and multi-executor fan-out. This is the only question that needs the web; cite source URLs, and never put personal data such as an email address in a search query or request.

Report only: change no code or doc outside your own lineage directory.
- Started: 2026-11-20T01:20:59.380Z
- Status: COMPLETE
- Iteration: 5 of 10
- Session ID: fanout-opus-1795137583671-xybhyk
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Frontier node F-1-001 (depth 1, scope .skilled/skills/system-deep-loop/runtime/scripts, .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/commands/deep/assets): Restraint: what can be deleted, merged or collapsed across frontier-admit.cjs, the deep-research and deep-review reduce-state.cjs reducers, convergence.cjs, fanout-run.cjs and the two deep workflow YAMLs while every promise of the expansive-depth modes stays kept? Name concrete deletions with file:line. | restraint | 0.93 | 7 | complete |
| 2 | Frontier node F-1-003 (depth 1, scope .skilled/commands/deep/assets/deep-research.yaml, .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs, specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode): Open design questions: should research count stuck passes per frontier node as review now does (deep-research.yaml:1488)? Does the lineage completion check break resume and extend for older committed research lineages that predate the closeout row, and what is the right rule? Is there a cheap design that makes pivot admission into the frontier work despite D-011-10? | design | 0.88 | 4 | complete |
| 3 | Frontier node F-1-005 (depth 1, scope web sources on agentic deep-research and code-review systems, compared against .skilled/skills/system-deep-loop): Prior art: how do other agentic research and code-review systems handle frontier growth, stuck detection, stop rules and multi-executor fan-out, and which of their ideas would simplify or harden this program? Cite source URLs. | prior-art | 0.75 | 6 | complete |
| 4 | Frontier node F-1-001 (depth 1, scope .skilled/skills/system-deep-loop/runtime/scripts, .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/commands/deep/assets): Restraint: what can be deleted, merged or collapsed across frontier-admit.cjs, the deep-research and deep-review reduce-state.cjs reducers, convergence.cjs, fanout-run.cjs and the two deep workflow YAMLs while every promise of the expansive-depth modes stays kept? Name concrete deletions with file:line. | restraint | 0.83 | 6 | complete |
| 5 | BLOCKED on: source_diversity_guard, evidence_depth_guard, uncovered_questions. Recovery: give the answered questions second sources and record question-to-finding-to-source coverage in the graph. | recovery | 0.55 | 4 | insight |

- iterationsCompleted: 5
- keyFindings: 148
- openQuestions: 0
- resolvedQuestions: 3

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 3/3
- [x] Restraint: what can be deleted, merged or collapsed across frontier-admit.cjs, the deep-research and deep-review reduce-state.cjs reducers, convergence.cjs, fanout-run.cjs and the two deep workflow YAMLs while every promise of the expansive-depth modes stays kept? Name concrete deletions with file:line.
- [x] Open design questions: should research count stuck passes per frontier node as review now does (deep-research.yaml:1488)? Does the lineage completion check break resume and extend for older committed research lineages that predate the closeout row, and what is the right rule? Is there a cheap design that makes pivot admission into the frontier work despite D-011-10?
- [x] Prior art: how do other agentic research and code-review systems handle frontier growth, stuck detection, stop rules and multi-executor fan-out, and which of their ideas would simplify or harden this program? Cite source URLs.

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███▇▇▇▆▆▅▅▅▅▅▆▆▅▄▃▂▁
- score sparkline: ███▇▇▇▆▆▅▅▅▅▅▆▆▅▄▃▂▁
- Last 3 ratios: 0.75 -> 0.83 -> 0.55
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.55
- coverageBySources: {"arxiv.org":2,"code":64,"docs.gptr.dev":2,"docs.openhands.dev":1,"docsearch.algolia.com":1,"github.com":2,"hawk.metr.org":1,"inspect.aisi.org.uk":2,"langchain-ai.github.io":1,"other":6,"python.langchain.com":1,"raw.githubusercontent.com":1,"www.anthropic.com":1}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Merging the two reducers wholesale. Their registries, dashboards and answered predicates differ (question resolution versus dimension coverage), so only the frontier projection is shared code. [INFERENCE: based on the reducer comparison above] (iteration 1)
- Widening `TERMINAL_STOP_EVENTS_BY_LOOP_TYPE.research` to legacy names such as `phase_synthesis` and `maxIterationsReached`. That would loosen the strict post-attempt check for every new run to fix a classification problem that belongs before spawn. (iteration 2)
- Co-STORM as a source of stop rules (user-terminated). (iteration 3)
- mini-swe-agent limits: the search returned no primary source. (iteration 3)
- The mini-swe-agent `step_limit` and `cost_limit` search returned no mini-swe-agent docs. (iteration 3)
- Extracting the eight adapter builders (33-106 lines each, fanout-run.cjs:2533-3555) as a restraint move. Their divergence is the cross-CLI parity question (F-1-004), dealt to the other lineage, so it is only noted here. (iteration 4)
- Emitting `graphEvents` retroactively for iterations 1-4. Iteration records are write-once. This iteration's record carries the coverage for all three questions instead. (iteration 5)

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
<!-- ANCHOR:frontier -->
## 6B. FRONTIER
- Frontier size: 3 nodes (0 open, 0 active, 3 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 1
- Budget depth1: 4 of 5 iterations spent
- Budget depth2: 0 of 4.5 iterations spent
- Budget depth3: 0 of 6 iterations spent

<!-- /ANCHOR:frontier -->
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
### Iteration 5 — blocked by [source_diversity_guard, evidence_depth_guard, uncovered_questions]
- Recovery: Source diversity (0.00) is below the blocking threshold (1.5). STOP is blocked until diverse sources cover key questions.
- Gate results: none recorded
- Timestamp: 2026-11-20T01:34:29.000Z

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
