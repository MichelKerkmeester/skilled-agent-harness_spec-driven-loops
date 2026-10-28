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
- Topic: Skill routing shape and doc clarity across every skill and hub under .skilled/skills, plus the command and agent docs that teach routing. Starting hypothesis to test, not assume: the sk-code advisor report at specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/scratch/sk-code-advisor-report.md (JSON decides stage one, one hub ROUTER.md decides leaf files, script resolvers handle the rest, each mode SKILL.md keeps a short routing section with the machine block moved to an appendix, no ROUTER.md per mode, JSON-only viable only as a hybrid). Answer with path:line evidence: (a) per skill, every routing mechanism and every place one routing decision is restated, and where copies have drifted; (b) which checks, parsers, templates, generators, benchmarks and runtime mirrors enforce the current shape, and what each proposed change would break; (c) a verdict on per-mode ROUTER.md versus one hub ROUTER.md versus the advisor hybrid versus JSON-only, separately for hubs, mode packets and standalone skills; (d) readability findings per skill with quoted passages; (e) a phased implementation plan with order, risk and rollback. Read-only research: change no file outside your lineage directory.
- Started: 2026-10-28T06:26:11Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-devin-1793168730352-knacf5
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
| 1 | cli-external-orchestration and cli-classifier hubs with their mode packets | - | 0.90 | 7 | complete |
| 2 | mcp-tooling hub and mcp-code-mode | - | 0.85 | 7 | complete |
| 3 | standalone skills cli-orca, sk-git, sk-prompt, sk-vision | - | 0.80 | 7 | complete |
| 4 | system-skill-advisor, system-spec-kit, command and agent docs, runtime mirrors and generators | - | 0.90 | 8 | complete |
| 5 | verdicts per skill type, readability synthesis, phased plan | - | 0.55 | 7 | complete |

- iterationsCompleted: 5
- keyFindings: 36
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Per skill, which routing mechanisms exist, where is one routing decision restated, and where have the copies drifted?
- [x] Which checks, parsers, templates, generators, benchmarks and runtime mirrors enforce the current routing shape, and what would each proposed change break?
- [x] Should hubs, mode packets and standalone skills each use a per-mode ROUTER.md, one hub ROUTER.md, the advisor hybrid, or JSON-only?
- [x] Which readability problems does each skill show, and which quoted passages demonstrate them?
- [x] What phased implementation plan, with order, risk and rollback, follows from the evidence?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███▇▇▇▇▇▆▆▆▇▇▇█▇▅▄▂▁
- score sparkline: ███▇▇▇▇▇▆▆▆▇▇▇█▇▅▄▂▁
- Last 3 ratios: 0.80 -> 0.90 -> 0.55
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.55
- coverageBySources: {"code":1,"other":60}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Counting "keyword triggers" lines as a routing decision: the CLI packets have none; their triggers live in the `<!-- Keywords: -->` comment, which no parser in this iteration was found to read. (iteration 1)
- Treating `benchmark/reports/**` as live enforcement. The reports are frozen archives from an older worktree and the harness is retired (`benchmark/README.md:20`), so they are evidence of past behaviour only. (iteration 1)
- Treating the mode packets' `INTENT_SIGNALS` as a duplicate of the hub's. They encode a different decision (task intent inside one executor), so the duplicate is the leaf mapping, not the intent names. (iteration 1)
- Searching the mcp packets for a per-mode `ROUTER.md`: none exists. Every packet routes from its own SKILL.md block. (iteration 2)
- Treating `DEFAULT_RESOURCE = []` and `DEFAULT_RESOURCE = "references/x.md"` as a contradiction. Both declare fallback-only semantics; the difference is representation. (iteration 2)
- Treating the mcp hub as a copy of the CLI hub. Its stage-two contract is consistent with its packets, so the CLI drift is a packet-level defect, not a universal hub defect. (iteration 2)
- A per-mode `ROUTER.md` for standalone skills. Class S forbids the hub files outright, so the option is not available, not merely inadvisable. (iteration 3)
- Looking for `description.json` in the standalone roots: the contract forbids it, and none exists. (iteration 3)
- Treating the four standalone routers as interchangeable. Their scoring implementations differ; only `sk-git` handles word boundaries. (iteration 3)
- Counting `.hermes/skills` against `find .skilled/skills -name SKILL.md` without excluding `node_modules`: the three extra hits are Playwright's bundled skills, correctly not mirrored. (iteration 4)
- Treating all five phrase lists as live routing sources. Only `graph-metadata.json` feeds stage one; the rest are documentation or dead metadata. (iteration 4)
- Treating ROUTER.md as removable on the strength of the CLI hub's duplication alone. `router-reach` reads it and fails without it. (iteration 4)
- Treating the Hermes mirror as a text copy of routing prose that can be hand-edited. It is generated and `--check` enforces it. (iteration 4)
- A per-mode `ROUTER.md` for any class. Class S forbids the hub files; Class H's router is hub-root only; no packet carries one. (iteration 5)
- Deleting the packet task-intent maps. They answer a different question from the hub's executor map. (iteration 5)
- Pure JSON-only routing for hubs. `router-reach` reads `ROUTER.md` as stage-two vocabulary. (iteration 5)
- Treating the hypothesis report as confirmed wholesale. Its hub and standalone conclusions hold; its "remove the per-packet loading tables" needs the correction in finding 2. (iteration 5)
- Trying to express stage-two leaf choice in today's JSON without a script. The compiled router emits packets, not leaves (prior report), and no leaf resolver exists for hub routes. (iteration 5)

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
