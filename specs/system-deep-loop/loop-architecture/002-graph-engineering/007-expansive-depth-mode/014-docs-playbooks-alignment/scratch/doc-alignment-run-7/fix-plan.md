# Fix plan

Target: topic expansive-depth; head: 0a845d0d8ef0b1d3c48a2b14560196358a38d961

## In scope

### docs:.claude/agents

- [ ] L1-1 P1 .claude/agents/deep-research.md:286 The frontier-proposal paragraph lists the budget cap among the admission prunes ("would exceed the depth, fan-out or budget caps") and the row shape above it constrains `budget` to "never above the pa
- [ ] L1-2 P1 .claude/agents/deep-review.md:253 The frontier-proposal paragraph lists the budget cap among the admission prunes ("would exceed the depth, fan-out or budget caps") and the row shape above it constrains `budget` to "never above the pa

### docs:.skilled/commands

- [x] L3-1 P1 .skilled/commands/deep/assets/deep-review-presentation.txt:446 The Convergence Detection list says review's STOP is gated by "Three binary quality gates (evidence, scope, coverage)". The review stop path evaluates nine legal-stop gates before a candidate becomes  [handed off]
  fix: - Three binary quality gates (evidence, scope, coverage) must pass before STOP -> - Nine legal-stop gates (convergence, dimension coverage, P0 resolution, evidence density, hotspot saturation, claim adj
- [ ] C1 P2 .skilled/commands/deep/research.md:107 The `--depth-mode` row enumerates the admission caps as "depth, fan-out, budget, dedupe and cycle", but `checkProposal` runs six checks in one fixed order and records the first failure as the prune re
  fix: under depth, fan-out, budget, dedupe and cycle caps -> under relevance, dedupe, depth, fan-out, budget and cycle caps
- [ ] C2 P2 .skilled/commands/deep/review.md:100 The `--depth-mode` row enumerates the admission caps as "depth, fan-out, budget, dedupe and cycle", omitting relevance and placing dedupe after budget. `checkProposal` runs relevance first (frontier-a
  fix: under depth, fan-out, budget, dedupe and cycle caps -> under relevance, dedupe, depth, fan-out, budget and cycle caps
- [x] L3-2 P2 .skilled/commands/deep/assets/deep-review.yaml:367 The fan-out spawn step tells the executor to skip "phase_init and phase_main_loop", but this workflow has no phase_main_loop: its phases are phase_init, phase_loop, phase_synthesis and phase_save (dee [handed off]
  fix: phase_main_loop -> phase_loop
- [ ] L2-1 P2 .skilled/commands/deep/assets/deep-research-presentation.txt:210 The section is headed "Parse response and store ALL results" but its list stops at depth_mode and omits lineage_mode and extend, the two bindings the completed-run extension sets. The review presentat
- [ ] L2-2 P2 .skilled/commands/deep/assets/deep-research.yaml:356 Both copies of step_frontier_seed (fan-out at line 356, init at line 765) state "frontier-admit.cjs is the only writer of the node store and the frontier inbox rows", but fanout-run.cjs's writeLineage

### docs:.skilled/skills

- [ ] L6-1 P1 .skilled/skills/system-deep-loop/deep-research/references/state/state-format.md:45 The file table declares `deep-research-config.json` as "Created at init; read-only after", and §4 (line 106) repeats the same claim as the meaning of the `immutable` protection class. The workflow rew
  fix: Created at init; read-only after -> Immutable after init, except the `step_frontier_budget` budget resize and the `--extend=N` rewrite, which resets `status
- [ ] L6-2 P1 .skilled/skills/system-deep-loop/deep-research/SKILL.md:228 The prohibition list tells the reader that "Research parameters are read-only after initialization; the terminal `step_update_config_status` flip to `status: complete` is the one permitted write". Two
  fix: Research parameters are read-only after initialization; the terminal `step_update_config_status` flip to `status: comple -> Research parameters are read-only after initialization, except the `step_frontier_budget` budget resize and the `--exten
- [ ] C3 P2 .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:96 The section 5 STATE FILES table presents itself as the packet's file list and omits `frontier-nodes.jsonl`, even though the same cheat sheet documents `--depth-mode=expansive` at line 59 and routes an
  fix: | Output | `research/research.md` | Markdown | Workflow-owned progressive synthesis output | -> | Output | `research/research.md` | Markdown | Workflow-owned progressive synthesis output | | Frontier nodes | `researc
- [ ] L8-1 P2 .skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:16 The overview states the run-wide frontier cap as half of `maxIterations` with the seed inside it. The code makes that cap configurable and exempts the seed pass: `runCap = capValue(expansive.maxFronti
  fix: Admission caps the live frontier at half of `maxIterations`, and the seed counts toward that cap, so a defaulted budget  -> Admission caps the live frontier at `expansiveDepth.maxFrontierNodes`, which defaults to half of `maxIterations` (10 whe
- [ ] L6-3 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md:29 The doc enumerates the optimizer manifest's invariant group as locking `antiConvergence.convergenceMode` and `convergenceMode` only. The manifest's group actually locks three fields: `["antiConvergenc
  fix: `antiConvergence.convergenceMode` and `convergenceMode` stay locked -> `antiConvergence.convergenceMode`, `convergenceMode` and `antiConvergence.depthMode` stay locked
- [ ] L5-2 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:868 The section 14 blurb says the category covers 4 scenarios but names only three, omitting DR-073 (`Fan-out deals seeded frontier nodes round-robin`), which is the expansive-depth fan-out partition scen
  fix: CLI lineage pool dispatch, native sequential agent dispatch, and single-executor parity -> CLI lineage pool dispatch, native sequential agent dispatch, single-executor parity, and round-robin frontier partition
- [ ] L5-3 P2 .skilled/skills/system-deep-loop/deep-research/README.md:107 The Packet Files table is presented as the inventory of on-disk artifacts but omits `frontier-nodes.jsonl`, the node store that `frontier-admit.cjs` reads and writes for every expansive run (seed, adm
  fix: | `.deep-research-pause` | Operator | The pause sentinel checked before each dispatch | -> | `.deep-research-pause` | Operator | The pause sentinel checked before each dispatch | | `frontier-nodes.jsonl` | Runti
- [ ] L5-5 P2 .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:106 The note enumerates the live lifecycle branches as `resume`, `restart` and `completed-continue`, then names `fork` as the deferred one, which reads as the complete live set. `new` is also live: the co
  fix: > **Live lifecycle branches:** `resume`, `restart`, and `completed-continue` through `--extend=N`. -> > **Live lifecycle branches:** `new`, `resume`, `restart`, and `completed-continue` through `--extend=N`.
- [ ] L7-2 P2 .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:98 The section 4 STATE FILES table presents itself as the packet's file list and omits the frontier node store, even though the same cheat sheet documents `--depth-mode=expansive` in sections 1 and 8. `s
  fix: | Pause | `review/.deep-review-pause` | Sentinel | Pause between iterations | -> | Pause | `review/.deep-review-pause` | Sentinel | Pause between iterations | | Frontier nodes | `review/frontier-nodes.
- [ ] L5-1 P2 .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:415 The doc says the FRONTIER block allowance is computed only from the node's remaining child slots. `renderFrontierBlock` takes the minimum of two bounds: the node's remaining child slots (`maxChildrenP
  fix: computes from the node's remaining child slots -> computes from the node's remaining child slots and the run-wide frontier node cap
- [ ] L7-3 P2 .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:514 The finding-registry field reference gives `dimension` a closed list of the four canonical names. The reducer derives each finding's `dimension` with `deriveDimension(..., universe)`, where `universe`
  fix: | dimension | string | Primary dimension: correctness, security, traceability, maintainability | -> | dimension | string | Primary dimension: correctness, security, traceability, maintainability, or any configured custom
- [x] L7-1 P1 .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:169 The doc says the persisted `blocked_stop` row carries `gateResults` as named sub-records keyed by `convergenceGate`, `dimensionCoverageGate`, `p0ResolutionGate` and the rest, each with a `pass` boolea [handed off]
- [ ] L8-2 P2 .skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:46 The Implementation table credits `fanout-run.cjs` only with passing `depthMode` to lineages and omits `runtime/scripts/fanout-merge.cjs`, which carries the other half of the fan-out partition the doc'
- [ ] L6-4 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:36 The doc says the divergent review pivot "seeds from terminal unanswered nodes", which reads as every terminal status that left the node unanswered. `divergent-review-pivot.ts:305` seeds only `exhauste
- [ ] L5-4 P2 .skilled/skills/system-deep-loop/deep-research/README.md:127 The derived-budget formula `min(24, max(10, 2 × (S + maxDepth − 1)))` is stated as the general rule, but the floor is not a constant 10: `fanout-run.cjs:339` passes `loopDefault: lineage.kind === 'nat

### docs:.pi/agents

- [ ] L1-3 P1 .pi/agents/deep-research.md:294 Same inert budget claim in the pi mirror of the research leaf: admission is said to prune a row that "would exceed the depth, fan-out or budget caps", and the row shape says `budget` must be "never ab
- [ ] L1-4 P1 .pi/agents/deep-review.md:260 Same inert budget claim in the pi mirror of the review leaf: the admission-prune enumeration includes "would exceed the depth, fan-out or budget caps" and the row shape says `budget` must be "never ab

### docs:.skilled/agents

- [ ] L1-5 P1 .skilled/agents/deep-research.md:302 The canonical research leaf lists the budget cap as an admission prune ("would exceed the depth, fan-out or budget caps") and constrains the row's `budget` to "never above the parent's" (line 301), bu
- [ ] L1-6 P1 .skilled/agents/deep-review.md:267 The canonical review leaf states admission prunes a row that "would exceed the depth, fan-out or budget caps" and constrains `budget` to "never above the parent's" (line 266). The budget comparison in

## Pre-existing or outside the scope

