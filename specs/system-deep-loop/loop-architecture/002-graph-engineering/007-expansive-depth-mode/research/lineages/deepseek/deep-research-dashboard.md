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
- Started: 2026-11-20T01:21:20Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-deepseek-1795137583671-xybhyk
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
| 1 | Frontier node F-1-002 (depth 1, scope .skilled/commands/deep/research.md, .skilled/commands/deep/review.md, .skilled/commands/deep/assets/deep-research-presentation.txt, .skilled/commands/deep/assets/deep-review-presentation.txt): Operator UX: how discoverable are the expansive-depth flags and defaults, how is the budget sized, and how clear are the warnings, dashboards, reports and the fan-out dry-run preview? How does an operator recover mid-run from a provider quota failure, resume, extend, or rerun one failed lineage? | operator-ux | 1.00 | 5 | complete |
| 2 | Frontier node F-1-004 (depth 1, scope .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs, .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts): Cross-CLI parity: where do cli-claude-code, cli-opencode, cli-codex, cli-pi, cli-devin, cli-cursor, cli-deepseek-harness and cli-mistral-vibe lineages still differ in permissions, effort flags, failure classes, resume and log shape, and what single executor contract would remove the differences? | parity | 1.00 | 5 | complete |
| 3 | Frontier node F-1-006 (depth 1, scope specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review, specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review-archive): Cost and latency: what do the 8-11 minute setup, the cost per iteration, the 24-iteration ceiling and the 50/35/15 depth-band split cost in the measured runs under the spec folder's review/ and review-archive/ and the live playbook logs, and which change cuts the most time or money? | cost | 1.00 | 5 | complete |
| 4 | Frontier node F-1-002 (depth 1, scope .skilled/commands/deep/research.md, .skilled/commands/deep/review.md, .skilled/commands/deep/assets/deep-research-presentation.txt, .skilled/commands/deep/assets/deep-review-presentation.txt): Operator UX: how discoverable are the expansive-depth flags and defaults, how is the budget sized, and how clear are the warnings, dashboards, reports and the fan-out dry-run preview? How does an operator recover mid-run from a provider quota failure, resume, extend, or rerun one failed lineage? | operator-ux | 1.00 | 5 | complete |
| 5 | Frontier node F-1-004 (depth 1, scope .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs, .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts): Cross-CLI parity: where do cli-claude-code, cli-opencode, cli-codex, cli-pi, cli-devin, cli-cursor, cli-deepseek-harness and cli-mistral-vibe lineages still differ in permissions, effort flags, failure classes, resume and log shape, and what single executor contract would remove the differences? | parity | 1.00 | 4 | complete |
| 6 | Frontier node F-2-007 (depth 2, scope .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs, .skilled/commands/deep/assets/deep-research.yaml): What does a partially complete fan-out run tell the operator: does the summary name the failed lineage, its failure class and the exact command to rerun just that lineage? | operator-ux | 1.00 | 3 | complete |
| 7 | Frontier node F-2-008 (depth 2, scope .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-deep-loop/deep-review/scripts/reduce-state.cjs): Do the research and review dashboards expose per-frontier-node budget spend and visit counts, or only lineage-wide iteration totals? | operator-ux | 1.00 | 3 | complete |
| 8 | Q1 restraint: which lines and concepts can be deleted, merged or collapsed across frontier-admit.cjs, both reduce-state.cjs reducers, convergence.cjs, fanout-run.cjs and the two workflow YAMLs while every promise stays kept? | restraint | 1.00 | 5 | complete |
| 9 | Q5 design questions: should research count stuck passes per frontier node as review now does, does the lineage completion check break resume and extend for older committed research lineages, and is there a cheap design that makes pivot admission into the frontier work? | design | 1.00 | 5 | complete |
| 10 | Q6 prior art: how do other agentic research and code-review systems handle frontier growth, stuck detection, stop rules and multi-executor fan-out? | prior-art | 1.00 | 4 | complete |

- iterationsCompleted: 10
- keyFindings: 44
- openQuestions: 3
- resolvedQuestions: 8

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 8/11
- [x] What can be deleted, merged or collapsed across runtime/scripts/frontier-admit.cjs, both reduce-state.cjs reducers, runtime/scripts/convergence.cjs, runtime/scripts/fanout-run.cjs and the two workflow YAMLs while every promise stays kept?
- [x] Should research count stuck passes per frontier node as review now does, does the lineage completion check break resume and extend for older committed research lineages, and is there a cheap design that makes pivot admission into the frontier work?
- [x] How do other agentic research and code-review systems handle frontier growth, stuck detection, stop rules and multi-executor fan-out?
- [x] Operator UX: how discoverable are the expansive-depth flags and defaults, how is the budget sized, and how clear are the warnings, dashboards, reports and the fan-out dry-run preview? How does an operator recover mid-run from a provider quota failure, resume, extend, or rerun one failed lineage?
- [x] Cross-CLI parity: where do cli-claude-code, cli-opencode, cli-codex, cli-pi, cli-devin, cli-cursor, cli-deepseek-harness and cli-mistral-vibe lineages still differ in permissions, effort flags, failure classes, resume and log shape, and what single executor contract would remove the differences?
- [x] Cost and latency: what do the 8-11 minute setup, the cost per iteration, the 24-iteration ceiling and the 50/35/15 depth-band split cost in the measured runs under the spec folder's review/ and review-archive/ and the live playbook logs, and which change cuts the most time or money?
- [x] What does a partially complete fan-out run tell the operator: does the summary name the failed lineage, its failure class and the exact command to rerun just that lineage?
- [x] Do the research and review dashboards expose per-frontier-node budget spend and visit counts, or only lineage-wide iteration totals?
- [ ] How discoverable are the expansive-depth flags and defaults, how is the budget sized, and how clear are the warnings, dashboards, reports and the fan-out dry-run preview, and how does an operator recover mid-run from a provider quota failure, resume, extend, or rerun one failed lineage? [legacy-import]
- [ ] Where do the cli-claude-code, cli-opencode, cli-codex, cli-pi, cli-devin, cli-cursor, cli-deepseek-harness and cli-mistral-vibe lineages still differ in permissions, effort flags, failure classes, resume and log shape, and what single executor contract would remove the differences? [legacy-import]
- [ ] What do the 8-11 minute setup, the cost per iteration, the 24-iteration ceiling and the 50/35/15 depth-band split cost in the measured runs under the spec folder's review/ and review-archive/ and the live playbook logs, and which change cuts the most time or money? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 3
- [ ] How discoverable are the expansive-depth flags and defaults, how is the budget sized, and how clear are the warnings, dashboards, reports and the fan-out dry-run preview, and how does an operator recover mid-run from a provider quota failure, resume, extend, or rerun one failed lineage?
- [ ] Where do the cli-claude-code, cli-opencode, cli-codex, cli-pi, cli-devin, cli-cursor, cli-deepseek-harness and cli-mistral-vibe lineages still differ in permissions, effort flags, failure classes, resume and log shape, and what single executor contract would remove the differences?
- [ ] What do the 8-11 minute setup, the cost per iteration, the 24-iteration ceiling and the 50/35/15 depth-band split cost in the measured runs under the spec folder's review/ and review-archive/ and the live playbook logs, and which change cuts the most time or money?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- score sparkline: ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"arxiv.org":2,"code":92,"github.com":1,"other":2,"www.anthropic.com":1}
- WARNING event: novelty_signal_inert metric=newInfoRatio run=10 window=3 sparkline=▄▄▄ — newInfoRatio held flat at 1 across 3 iterations — the novelty signal is uninformative, so convergence and "not exhausted" claims derived from it are untrustworthy.
- Advisory event: trend_flatline metric=score run=10 window=3 sparkline=▄▄▄

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Reading the presentation assets as an independent intake surface: they restate the same long-form budget prose as `research.md`, so collapsing `research.md:107` to a pointer does not remove the last copy, it moves the copy to the asset that already owns setup detail. (iteration 1)
- Searching for a literal "8-11 minute setup" string: the only match is a retired tool-call budget in a changelog; the setup-time reading has no textual anchor. The cost node must measure per-iteration wall clock instead. (iteration 1)
- Treating `--frontier-max-depth`/`--frontier-max-nodes` refusal as an undocumented trap: both command docs and both presentation assets state the fan-out refusal at the flag row, so the surface is documented even though the refusal is only visible by running a dry run. (iteration 1)
- Proposing a new config schema: `executor-config.ts` is already the single schema; the gap is that two derived facts (enforcement class, effort application) are not carried into the output. (iteration 2)
- Searching for per-kind resume flags: resume is config-driven for every kind through `readStoredLineageSessionId`, so there is nothing to unify. (iteration 2)
- Treating log shape as a parity gap: all kinds already write the same rotated `fanout-lineage.out/.err` pair, so no change is needed there. (iteration 2)
- Blaming fan-out concurrency for the 429: the review run used concurrency 2 and the quota failure hit one lineage; the recovery gap is the real defect, and iteration 1 already records it. (iteration 3)
- Searching for a measured setup time in the playbooks: the only figure recorded is per-iteration cost, so setup had to be measured from the committed `createdAt` and first-iteration timestamps. (iteration 3)
- Treating model price as the main lever: the measured cost is dominated by cache-read of unchanged context and by wall-clock latency, not by output tokens, so a cheaper model changes the multiplier, not the shape. (iteration 3)
- Claiming the dashboard hides band spend: it prints all three bands and their allotments; the missing dimension is per-node detail, not the band budget. (iteration 4)
- Proposing a new summary file: `orchestration-summary.json` is already the operator's terminal artifact; it only needs the per-lineage array. (iteration 4)
- Searching for a documented fan-out resume procedure in `research.md`: the command doc covers `--lineage-mode=resume` and `--extend` for a single run, but has no fan-out recovery section; the only evidence of the real procedure is the committed recovery config. (iteration 4)
- Claiming the six YAML branches need different arguments: only claude (config dir) and dsh (spec folder) add a flag, and both are already optional in the shared script. (iteration 5)
- Looking for a review-specific claude builder in the fan-out path: there is one builder for both loops, which is exactly why the single-executor branch diverged unnoticed. (iteration 5)
- Treating the forced `workspace-write` as a bug in the builder: the builder honors what it is given; the silent narrowing happens in the caller. (iteration 5)
- Looking for an `on_failure` branch in `step_fanout_spawn`: there is none, so the parent has no partial path to take. (iteration 6)
- Requiring a new recovery command: the runner already holds every input a rerun needs, so the fix is serialization, not a new workflow. (iteration 6)
- Treating exit 2 as a deliberate safety stop: it protects the merge from partial input but gives the operator no merge at all, which is the opposite of the failure's cost. (iteration 6)
- Adding a new registry file: the projection is the right carrier; it already has the visit function. (iteration 7)
- Claiming both dashboards hide band spend: both print the three bands and their allotments; the missing piece is per-node detail and the active-node line. (iteration 7)
- Searching for a review-side per-node table in the committed review dashboard: it reports the same aggregate size and revisits, so the per-node table is absent on both sides, not only in research. (iteration 7)
- Collapsing the two reducers into one file: the review reducer carries dimension coverage and the research reducer carries novelty questions; the shared part is the frontier projection, not the whole reducer. (iteration 8)
- Deleting `frontier-admit.cjs` as a whole: it is shared by both reducers and both loops, so it is the one place the frontier rules already live; the duplication is around it, not inside it. (iteration 8)
- Looking for a shared YAML macro system: the workflow format has no include mechanism, so duplication must be collapsed at the step level, not by templating. (iteration 8)
- Searching for dead `if_cli_*` branches: all eight are reachable, so the deletion is a merge, not a dead-code removal. (iteration 8)
- Admitting pivot candidates with a full reworked transaction: the three D-011-10 blockers each have a one-line answer; a transaction rewrite is not needed. (iteration 9)
- Looking for a research `activeNodeId` in the registry: the research projection does not emit one, which is why the node-scoped counter cannot be enabled by a flag alone. (iteration 9)
- Weakening the live completion check to fix the audit: a live attempt that writes nothing must still fail, so the fallback has to be scoped to a completed historical config. (iteration 9)
- Adopting a full MCTS search (LATS-style) for the frontier: the measured runs are 10-24 iterations, too shallow for tree search to pay for its branching overhead; a priority field is the cheap 80%. (iteration 10)
- Copying Anthropic's synchronous lead-agent loop: this runtime already has the fan-out pool and per-lineage state, so the transferable part is the effort-scaling table and the checkpoint/resume discipline, not the topology. (iteration 10)
- Looking for a published stuck-detection rule in these systems: Anthropic handles failure with retries and checkpoints, LangChain with iteration caps, ToT with evaluation; none publishes a per-node stuck counter, so this runtime's per-node counter is ahead of the public prior art and should be kept. (iteration 10)

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
- Frontier size: 10 nodes (0 open, 0 active, 4 answered, 1 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 5
- Revisits: 2
- Budget depth1: 5 of 5 iterations spent
- Budget depth2: 2 of 3.5 iterations spent
- Budget depth3: 0 of 3 iterations spent

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Synthesis: rank the recommendations by value over effort, merge duplicates, and state the one change that buys the most for the least.

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
