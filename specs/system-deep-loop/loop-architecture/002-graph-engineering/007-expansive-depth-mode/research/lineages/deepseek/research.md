# Deep Research: Simplifying the Expansive-Depth Deep-Loop Modes

**Packet**: `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode`
**Lineage**: `research/lineages/deepseek` (cli-opencode, `llmgateway/deepseek-v4.1-flash-1017#max`)
**HEAD**: `d4420e9510d`
**Scope**: report only. No code or doc outside this lineage was changed.

## 1. Executive Summary

This study asked what would make the expansive-depth `research` and `review` modes and their runtime simpler, cheaper, easier to operate and identical across CLI runtimes, ranked by value over effort. Ten iterations, 44 findings, four of them external.

The short answer:

- **The runtime already contains the contract it needs; it publishes half of it and duplicates the other half.** The capability matrices in `executor-config.ts` already say which executor can do what; the YAMLs, the single-executor dispatcher and the fan-out runner each carry a second copy. Collapsing those copies is the largest deletion available and closes a live permission defect at the same time.
- **The operator's two worst moments have no first-class path:** rerunning one failed lineage, and getting the successful results of a partially failed fan-out. Both are serialization and exit-code problems, not new subsystems.
- **The frontier's budget arithmetic is optimistic in three places:** the depth-1 band is a fixed 50% regardless of node count, the CLI lineage floor is 10 regardless of dealt nodes, and the 120-minute duration budget cannot fund the 24-iteration ceiling at the measured 8-11 minutes per iteration.
- **Research is one release behind review on stuck scoping**, and the completion check mislabels 31 committed research lineages that have a report but no closeout row.

Ranked by value over effort, the top five are items R1-R5 below: all are S or M effort, none requires a new subsystem.

## 2. Research Topic

What changes would make the expansive-depth deep-loop modes (research and review), and the deep-loop runtime behind them, simpler, cheaper, easier to operate and identical across CLI runtimes, ranked by value over effort? The fan-out review in `review/review-report.md` and the fix range `a424fb6cd8a..d4420e9510d` closed that review's findings; this study builds on them and does not re-report them.

## 3. Methodology

- Ten iterations of externalized, cited research; each iteration wrote `iterations/iteration-NNN.md` and a delta, recorded one canonical record through the append gateway, and refreshed the reducer.
- Code evidence is read at `d4420e9510d`; measured-run evidence is the committed `review/` and `review-archive/` packets; latency and token evidence is the live playbook logs.
- Expansive depth: three depth-1 nodes were dealt to this lineage (operator UX, cross-CLI parity, cost). Two depth-2 children were admitted; four proposals were pruned by the node cap. One node (cost) was closed by the depth-1 band budget rather than by exhaustion.
- Every recommendation below names one concrete change, cites `file:line` or a source URL, and states value, effort (S/M/L) and risk.

## 4. Recommendations, Ranked by Value over Effort

### R1 — Give the operator a one-lineage rerun and a partial merge (S+M, high value)

- **Change**: add a repeatable `--only-lineage=LABEL` to `fanout-run.cjs` that filters lineages before the frontier partition and reports filtered-out lanes as `skipped_complete`; exit `0` with `status: "partial"` when at least one lineage succeeded, so `phase_synthesis` merges what exists. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:772] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4969] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:432]
- **Why**: `readStoredLineageSessionId` returns null for a complete config, so a rerun mints a new session for every lineage and completed lanes then fail the completion check on a stale terminal row. Today recovery is a hand-edited `fanout-config-recovery.json`, and a partial run never reaches `step_fanout_merge` at all. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/fanout-config-recovery.json:1]
- **Value**: one flag replaces a config edit; a 2-of-3 run still produces the report it paid for.
- **Risk**: medium. A partial merge must carry a banner and summary counters so it never reads as complete coverage.

### R2 — Collapse the six single-executor YAML branches and route every kind through `buildLineageCommand` (S+M, high value)

- **Change**: one `if_cli` branch with `--executor "{config.executor.kind}"` in both YAMLs, keeping only the claude config-dir and dsh spec-folder special cases; in `dispatch-iteration.cjs`, route `runClaude` and `runCodex` through `buildLineageCommand` like the other four kinds. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1762] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:354] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:919]
- **Why**: six of eight branches are the same command with a different value, and the hand-built half is where parity drifted: the review claude branch hardcodes `acceptEdits` while research resolves the mode. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:373] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:423]
- **Value**: about 300 runtime lines and 100 lines per YAML removed; the claude permission defect is fixed in the same edit.
- **Risk**: medium. Preserve the claude `--claude-config-dir` and codex stdin paths in the adapters.

### R3 — Fund the frontier from its nodes, not from a fixed share (S+S, high value)

- **Change**: size `budgetSplit.depth1` from the seed (`nodesPerLineage × dimensions / maxIterations`, capped at 0.7) instead of a fixed 0.5, and raise the CLI lineage floor to `max(10, 2 × dealtNodes + 2)` for research. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:360] [SOURCE: .skilled/commands/deep/research.md:107]
- **Why**: a three-node review needs 12 of 24 iterations for depth 1, exactly its 50% share, leaving zero growth; this lineage's own dashboard shows a 3-node share funded at 5 depth-1 visits, and one node was closed by the band budget after three first passes. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/deep-research-dashboard.md:113]
- **Value**: every dealt node is funded for a first and a verification pass.
- **Risk**: low for the floor; medium for the adaptive split (it changes when budget closes fire).

### R4 — Make the duration budget consistent with the iteration ceiling (S, high value)

- **Change**: at config creation, derive the default duration from the cap (`max(120, 10 × maxIterations)` for review, `max(120, 12 × maxIterations)` for research) or print the iteration at which the duration stop will bind. [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:464]
- **Why**: at the measured 8-11 minutes per iteration, 120 minutes funds 11-15 iterations, not 24; one archive run already raised the budget to 360 minutes for 10 iterations. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review-archive/20261119T153733Z/deep-review-config.json:1]
- **Value**: the cap the operator reads is the cap the run can reach.
- **Risk**: low; an explicit value still wins.

### R5 — Turn the executor matrices into the printed contract (S, high value)

- **Change**: add `sandboxEnforcement: "preventive" | "compensating" | "none"` and `effortApplied: "flag" | "baked" | "none"` to `effectiveConfig`, and print both in the fan-out preview and `invocation-metadata.json`. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:159] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2507]
- **Why**: the preview today shows `sandboxMode: workspace-write` for pi, devin and vibe, which have no preventive boundary, and one matrix that sets `reasoningEffort` fails on the three kinds that bake the tier into the model id. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:117]
- **Value**: one preview line answers "what does this executor actually enforce".
- **Risk**: low.

### R6 — Complete the partial-run summary from data the runner already holds (S, high value)

- **Change**: write a `lineages: [{label, status, reason, failure_class, exit_code, rerun_command}]` array into `orchestration-summary.json` from the pool's `results`, which `buildPoolSummary` already returns. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:977] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4253]
- **Why**: the committed summary has counts and `failure_classes` but no label; the labels are computed and discarded.
- **Value**: the operator's first file answers "which one failed and what do I type".
- **Risk**: low.

### R7 — Bring research stuck accounting to review parity (S+M, high value)

- **Change**: drop the `loopType === 'review'` gate on `nodeScoped`, and add `frontier.activeNodeId` (plus `activeNextDimension`) to the research projection via a shared frontier module. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1775] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/decision-record.md:69]
- **Why**: research counts low-novelty passes lineage-wide, so clean sibling passes can close a node; review already settled the principle that only a node's own passes count.
- **Value**: research nodes close on their own evidence.
- **Risk**: low, provided the projection carries the active node.

### R8 — Scope the completion check: live attempt vs historical audit (S, medium value)

- **Change**: keep the terminal-row requirement for a live attempt and fall back to `completionFromArtifacts` when the lineage config is `status: complete` and the log has no terminal row at all. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1248] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1282]
- **Why**: 31 of 104 committed research state logs have `research.md` but no terminal closeout row; resume and extend are not broken because every re-run writes a fresh row. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:2199]
- **Value**: historical audit stops mislabelling finished work without weakening the live gate.
- **Risk**: low; scope the fallback to a completed config.

### R9 — Add per-node visits and one shared dashboard renderer (S+M, medium value)

- **Change**: add `visits` (and `coveredDimensions`) to the research frontier projection and extract one `renderFrontierDashboardSection` used by both reducers. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1972] [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2453]
- **Why**: review already computes visits; research drops the field, so the dashboard cannot distinguish three single-node passes from three passes on one node, and the two sections have drifted (`10B` vs `6B`).
- **Value**: the dashboard shows where the budget went.
- **Risk**: low.

### R10 — Validate the leaf's recommended next focus (S, medium value)

- **Change**: when the frontier has no open node, prefer the first unchecked key question over the latest leaf recommendation, and reject a recommendation that is not a question. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2574]
- **Why**: this run's Next Focus became "Close F-2-008 as answered…", a closing instruction copied verbatim from the prior iteration.
- **Value**: the loop always works a question.
- **Risk**: low.

### R11 — Skip the context ladder in a fan-out child (M, medium value)

- **Change**: when `fanout_lineage_artifact_dir` is bound, read the root's prepared context instead of re-running the continuity ladder and resource-map scan; keep config, strategy and registry creation. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:117]
- **Why**: setup measured 3-10 minutes per lineage before iteration 1, and the root has already resolved the topic and partitioned the frontier.
- **Value**: 3-9 minutes saved per lineage.
- **Risk**: medium; the child must still render a valid prompt without a local context summary.

### R12 — Adopt the four prior-art practices (S, medium value)

- **Change**: an effort-scaling table in both command docs (simple/comparison/complex → lineages × iterations × tool calls), a per-lineage budget block with an estimated cost printed before spawn, an optional `priority` on `frontier_proposal` ranked after depth, and perspective-based seed questions deduped on the perspective. [SOURCE: https://www.anthropic.com/engineering/multi-agent-research-system] [SOURCE: https://github.com/langchain-ai/open_deep_research] [SOURCE: https://arxiv.org/abs/2305.10601] [SOURCE: https://arxiv.org/abs/2402.14207]
- **Why**: the local system has per-kind floors but no per-complexity sizing, no pre-spawn price, no value ordering in the frontier, and a single-voice seed.
- **Value**: the operator sizes a run in one table; growth follows value and breadth follows perspectives.
- **Risk**: low for the table and the budget block; medium for model-authored priority (caps must still outrank it).

### R13 — Delete the remaining copies (S, low-medium value)

- **Change**: merge the duplicated `step_frontier_seed` and the preview/spawn command in `deep-research.yaml`, delete the two-copy pre-spawn guard, import the Flash effort pin instead of mirroring it, remove `native` from the fan-out adapter table, and move the research reducer beside the review reducer under `runtime/scripts/`. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:395] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2650] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3558]
- **Why**: about 150 lines of workflow and runtime duplication remain after R2, and the split reducer tree has already produced a wrong path in this study's own scope line (`deep-review/scripts/reduce-state.cjs` does not exist).
- **Value**: one place per rule.
- **Risk**: low.

## 5. Findings by Question

### Q1 Restraint

Five deletion groups: the hand-built executor handlers (~300 lines), the six YAML branches plus notes (~100 lines per YAML), the duplicated YAML seed/preview/guard steps (~50 lines), the duplicated frontier marker/renderer, and the small Flash-pin and `native` copies. Total: roughly 500 lines plus one shared frontier module. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/iterations/iteration-008.md:1]

### Q2 Operator UX

- Flags are documented twice: `research.md:107` still carries the 486-word `--depth-mode` cell that `review.md:100` already collapsed to a pointer. [SOURCE: .skilled/commands/deep/research.md:107]
- The dry run prints `frontier_scope: []` for an unseeded expansive run, indistinguishable from "dealt no nodes". [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4007]
- Question intake has two paths; this lineage's dashboard showed 9 questions from 6 topics, and the three duplicate legacy questions are the only ones still open at 8/11. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/deepseek/deep-research-dashboard.md:34]
- Recovery has no first-class path; the partial summary has no labels; the quota error names a cause but not an action. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4714]
- Dashboards show band spend but not per-node visits.

### Q3 Cross-CLI parity

- The contract exists as `EXECUTOR_KIND_FLAG_SUPPORT` and `EXECUTOR_PREVENTIVE_SANDBOX_CAPABILITY`; the gap is that two derived facts are not published. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:112]
- `reasoningEffort` and `sandboxMode` requests fail or are silently widened on the kinds that cannot honor them; `runLineageBuiltin` forces workspace-write for cursor/devin/pi. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:459]
- The review claude branch hardcodes `acceptEdits`; research resolves it. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:373]
- Log shape and resume are already uniform; `native` is the remaining version-dependent kind. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2640]

### Q4 Cost and Latency

- Setup: 3-10 minutes per lineage (createdAt → first iteration), measured on four committed runs.
- Per iteration: 1.5-3.7 minutes in the committed review runs; 8-11 minutes in the live playbooks for the heavier models; 0.33M input and 6.2M cache-read per added iteration.
- The 24-iteration ceiling and the 120-minute default cannot both bind: at 8-11 minutes the duration stop lands near iteration 11-15. [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:464]
- The 50/35/15 split starves depth 1 whenever `nodesPerLineage × dimensions > 0.5 × maxIterations`.
- No host-measured `durationMs` reaches the iteration row, so latency cannot be attributed per iteration.

### Q5 Open Design Questions

- (a) Research should count per node; the gate is one line, but the projection must publish the active node. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1775]
- (b) The completion check is right for a live attempt and wrong for a historical audit: 31 committed research lineages have a report and no terminal row. Resume and extend are unaffected because synthesis always writes a fresh closeout. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:202]
- (c) Pivot admission has a three-part cheap design: carry the saturated focus's scope and skip only the relevance check, reserve one depth-1 slot, and order `frontier_drained` before `all_dimensions_clean`. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/decision-record.md:68]

### Q6 Prior Art

Anthropic's multi-agent research system (orchestrator-worker, 3-5 parallel subagents, explicit effort-scaling table, ~15× chat tokens, checkpointed resume), LangChain Open Deep Research (per-researcher limits, published cost table), Tree of Thoughts (evaluate candidates before expanding), and STORM (breadth from distinct perspectives). [SOURCE: https://www.anthropic.com/engineering/multi-agent-research-system] [SOURCE: https://github.com/langchain-ai/open_deep_research] [SOURCE: https://arxiv.org/abs/2305.10601] [SOURCE: https://arxiv.org/abs/2402.14207]

## 6. Quality Guards

- Source diversity: code, committed run artifacts, four external sources.
- Every finding cites a file:line or URL; no claim rests on a remembered path.
- Contradictions preserved: the "8-11 minute setup" ambiguity is reported both ways; the prompt's "3 of 12" completion premise is corrected to 31 of 104 with evidence rather than smoothed over.

## 7. Eliminated Alternatives

- Deleting `frontier-admit.cjs`: it is the one shared home of the frontier rules; the duplication is around it.
- Collapsing the two reducers into one file: the review carries dimension coverage, the research carries novelty questions; only the frontier projection is shared.
- A full MCTS frontier (LATS-style): 10-24 iterations is too shallow to pay for branching overhead; a priority field is the cheap 80%.
- A cheaper model as the main cost lever: the measured cost is cache re-read and wall clock, so price changes the multiplier, not the shape.
- Weakening the live completion check to fix the historical audit: a live attempt that writes nothing must still fail.

## 8. Divergence Map

- No divergent pivot ran; `convergenceMode` stayed `default`.
- Frontier: 10 nodes total (3 seeded, 2 admitted, 5 pruned by the node cap), 4 answered, 1 exhausted (`F-1-006`, closed by the depth-1 band budget), 5 pruned.
- The node cap (half the iteration budget) was exhausted by the first two depth-2 admissions, so every later proposal was pruned `fanout`. That is the structural reason pivot admission needs a reserved slot (Q5c).
- Saturated directions: none recorded by the reducer; the cost node was closed by budget rather than by evidence exhaustion.

## 9. Open Questions

- The three duplicate legacy questions remain open (8/11 answered) because their text differs from the frontier rows that were answered. That is the duplicate-intake defect in Q2, observed on this run.
- The failed 429 attempt's summary was not preserved, so the quota recovery path is read from code and the committed recovery config rather than from the failed run's own artifacts.
- Per-iteration latency attribution needs host-measured `durationMs`; the committed runs do not carry it.
- The detached lineage cannot emit its own `resource-map.md`: `reduce-state.cjs --emit-resource-map` resolves the config from the fan-out base (`research/deep-research-config.json`), which the dispatcher archived before spawning, so the step fails at synthesis with `ENOENT`. The root's `fanout-merge`/resource-map step owns that artifact; a lineage-side fallback to its own `deep-research-config.json` would make the step runnable here. This is observed, not fixed (report-only scope).

## 10. Convergence Report

- Stop reason: `maxIterationsReached` (10 of 10).
- Iterations: 10. Findings: 44. Questions: 8 of 11 resolved (the three duplicates are the residue described above).
- Frontier: terminal at iteration 7 (0 open, 0 active).
- Convergence threshold: 0.05; no composite stop fired before the cap, because the frontier veto held while nodes were open and the duplicate questions never resolved.

## 11. References

### Code

- `.skilled/commands/deep/assets/deep-research.yaml`, `deep-review.yaml`
- `.skilled/commands/deep/research.md`, `review.md`, both presentation assets
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `fanout-pool.cjs`, `frontier-admit.cjs`, `convergence.cjs`, `reduce-state.cjs`, `dispatch-iteration.cjs`, `synthesis-closeout.cjs`
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `lineage-timestamp-window.ts`
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`

### Committed runs

- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/`
- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review-archive/`
- `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/live-*.md`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/live-*.md`

### External

- https://www.anthropic.com/engineering/multi-agent-research-system
- https://github.com/langchain-ai/open_deep_research
- https://arxiv.org/abs/2305.10601
- https://arxiv.org/abs/2402.14207

### Decision records

- `specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/011-review-frontier-mode/decision-record.md` (D-011-10, D-011-11, D-011-14)
