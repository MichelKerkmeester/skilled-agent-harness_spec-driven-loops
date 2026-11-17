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
- Topic: Design an expansive-depth sub-mode for system-deep-loop deep-research and deep-review: a mode that smartly widens and deepens its scope instead of staying narrowly focused. Example targets the mode must handle well: (1) 'research the last 100 commits and find bugs, drifts and improvement opportunities'; (2) 'analyze system-skill-advisor and find improvement opportunities for auto-utilization of skills and commands when a user is just chatting'. Diagnose why the current loops do not extend depth enough, converge early or stay narrowly focused (convergence.cjs stop decision, newInfoRatio, minIterations, focus selection, strategy Next Focus, coverage graph, divergent mode, wave_orchestration appendix). Mine the graph-engineering research in specs/system-deep-loop/loop-architecture/002-graph-engineering (children 001-006, research/, reference/, context/) for graph-loop principles (frontier expansion, node/edge discovery, coverage-driven traversal, swarm fan-out) usable here. Propose how the sub-mode integrates into the existing agents (.skilled/agents/deep-research.md, deep-review.md), commands (.skilled/commands/deep/), workflow YAMLs, mode registry and convergence logic without replacing the current deep-loop logic; it must be an additive, opt-in sub-mode. Known defect to record as a finding: dispatch-iteration.cjs honors --claude-config-dir / CLAUDE_CONFIG_DIR only for --loop-type review, so a research run with --executor=cli-claude-code --config-dir is silently not routed to that account.
- Started: 2026-11-17T07:52:43.000Z
- Status: INITIALIZED
- Iteration: 7 of 10
- Session ID: 2026-11-17T07:52:43.000Z
- Parent Session: 2026-11-17T07:52:43.000Z
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: trace the stop decision in convergence.cjs and the minIterations floor; establish why runs stop early. | convergence | 0.91 | 11 | complete |
| 2 | Primary: Q2 focus selection end to end (Next Focus, least_explored, stuck recovery, rejected-pattern cache, ideas backlog, inbox.jsonl). Secondary: close Q7 config-dir routing for research and fan-out. | focus-selection | 0.89 | 9 | complete |
| 3 | Q3 - audit the existing breadth levers: divergent pivot, coverage graph, sliding-window, off/max-iterations, native fan-out, wave_orchestration appendix, and the deep-review dimension model. | breadth-levers | 0.80 | 10 | complete |
| 4 | Q4 - mine the 002-graph-engineering program for graph-loop principles usable by a widening sub-mode (frontier expansion, node/edge discovery, coverage-driven traversal, swarm fan-out, budgets, stop rules) and map them onto the deep-loop runtime; secondary: confirm the gateway field drop. | - | 0.86 | 14 | complete |
| 5 | Q5 - design the expansive-depth sub-mode: frontier schema and storage, decompositions of both targets, admission and pruning, depth budget and frontier-exhaustion stop veto | design | 0.85 | 13 | complete |
| 6 | Q6 - file-by-file integration map for the expansive-depth sub-mode across flag, config, YAMLs, agents, reducer, mode registry, convergence.cjs, gateway, fan-out, with default behavior unchanged | integration | 0.86 | 18 | complete |
| 7 | RECOVERY source_diversity_guard: quality_class persistence trace, class-tagged re-citation of Q1-Q7 sources, and closing the review Next Focus twin, fanout config-dir and stale carry-forward items | - | 0.63 | 8 | complete |

- iterationsCompleted: 7
- keyFindings: 357
- openQuestions: 0
- resolvedQuestions: 7

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 7/7
- [x] Q1: Why do the current research and review loops stop early or stay narrow? Trace the stop decision in convergence.cjs (newInfoRatio, weighted vote, minIterations floor, quality guards, graph decision) and name which signals reward narrow depth.
- [x] Q2: How does focus selection (reducer-written Next Focus, least_explored, remaining questions, stuck recovery, rejected-pattern cache) choose the next iteration target, and does anything ever add new questions or scope beyond the init-time 3-5 questions?
- [x] Q3: What do the existing breadth levers actually provide and lack: divergent mode (Council pivot), the coverage graph, sliding-window mode, stop-policy=max-iterations, native fan-out, and the wave_orchestration reference-only appendix?
- [x] Q4: Which graph-loop principles in the 002-graph-engineering program (children 001-006, research/, reference/, context/) are usable for a widening sub-mode: frontier expansion, node/edge discovery, coverage-driven traversal, swarm fan-out, budgets and stop rules?
- [x] Q5: What should the expansive-depth sub-mode be (frontier data model, decomposition of a target into nodes, expansion and pruning rules, depth budget, stop rule) so it handles both example targets: last-100-commits bug/drift hunt and system-skill-advisor chat-time auto-utilization?
- [x] Q6: How does the sub-mode integrate additively and opt-in into the agents (deep-research.md, deep-review.md), commands (.skilled/commands/deep/), workflow YAMLs, mode registry and convergence.cjs without changing default behavior?
- [x] Q7: Confirm the dispatch-iteration.cjs defect: is --claude-config-dir / CLAUDE_CONFIG_DIR honored only for --loop-type review, and what is the blast radius for research runs and fan-out?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ████▇▆▅▆▆▇▇▇▇▇▇▇▆▅▃▁
- score sparkline: ████▇▆▅▆▆▇▇▇▇▇▇▇▆▅▃▁
- Last 3 ratios: 0.85 -> 0.86 -> 0.63
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.63
- coverageBySources: {"code":85,"other":43}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- `convergenceMode: off` and `stopPolicy: max-iterations` as a widening fix: duration only (finding 10). (iteration 1)
- Treating minIterations as the cause of early stopping: it only delays a stop, and raising it adds iterations without adding direction (finding 5). (iteration 1)
- Treating stuck recovery as a widening mechanism: "Widen scope" is prompt text only, and the target is still `least_explored` from the existing questions (finding 5). (iteration 2)
- Treating the ideas backlog as a scope source during the run: a promoted idea is used only when no other focus exists (findings 1 and 5). (iteration 2)
- Re-reading `off` and `max-iterations`. Iteration 1 finding 10 already covers them, and they should stay out of further breadth analysis. (iteration 3)
- Treating fan-out as scope partitioning. Every lineage gets the same topic (finding 8). (iteration 3)
- Treating sliding-window mode as a breadth lever. It only swaps the novelty measure (finding 7). (iteration 3)
- Making the sub-mode depend on 036 target-state components (graph compiler, sealing, belief projection). S6 P4 classifies them Missing. (iteration 4)
- None new. `wave`/`depends_on` scheduling remains a dead end for the sub-mode, because the program rejects approximating it (finding 6). (iteration 4)
- Reading the `context/` blog and paper corpus directly. The five study syntheses already cite it, and the budget favored the syntheses. (iteration 4)
- Fixing sourceDiversity by adding `metadata.quality_class` to this run's SOURCE nodes. The prompt contract mandates exact node shapes, and doing so would alter the live stop behavior of the run under study. (iteration 5)
- None new. (iteration 5)
- Storing frontier state on research iteration records. The gateway drops the fields, and `convergence.cjs` reads only those rows (finding 3, iteration 4 F12). (iteration 5)
- Treating leaf-emitted QUESTION graph events as the frontier's source of truth. Emission is inconsistent: 17, 20, 1 and 0 node events across the 4 deltas (finding 4). (iteration 5)
- **A fifth `--convergence-mode` value:** it would make the mode exclusive with divergent and sliding-window (finding 1). (iteration 6)
- **A mode-registry entry:** the loop-type enum and the one-to-one command/agent binding forbid it (finding 13). (iteration 6)
- **Promoting `wave_orchestration`:** fan-out already covers parallel execution (finding 9). (iteration 6)
- **Reordering stuck after the veto in `convergence.cjs`:** it would change default ordering (finding 6). (iteration 6)
- **Widening the gateway upcast:** it would change the default path (finding 14). (iteration 6)

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
### Iteration 7 — blocked by [source_diversity_guard]
- Recovery: Source diversity (0.00) is below the blocking threshold (1.5). STOP is blocked until diverse sources cover key questions.
- Gate results: none recorded
- Timestamp: 2026-11-17T08:28:44Z

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
