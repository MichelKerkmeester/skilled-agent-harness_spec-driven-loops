# Fix plan

Target: topic expansive-depth; head: 1e350ae863f1d4fe433e4b708ab58a3eabb6ac46

## In scope

### docs:.claude/agents

- [x] L1-1 P1 .claude/agents/deep-research.md:286 The frontier-proposal paragraph presents the budget cap as an admission outcome ("would exceed the depth, fan-out or budget caps") and the row shape above it constrains `budget` to "never above the pa [handed off]
- [x] L1-2 P1 .claude/agents/deep-review.md:253 Same inert budget claim in the review mirror: the list of admission prunes names "would exceed the depth, fan-out or budget caps" and the row shape constrains `budget` to "never above the parent's". R [handed off]

### docs:.skilled/commands

- [x] L2-1 P2 .skilled/commands/deep/assets/deep-research-presentation.txt:70 The `maxIterations` resolution row states the expansive derived budget only as `min(24, max(10, 2·c·(S + maxDepth − 1)))`. `expansiveBudget` returns the loop default before that formula whenever no de [handed off]
  fix: with S the depth-1 nodes the seed admitted and c 1; any other source is kept as given -> with S the depth-1 nodes the seed admitted, c 1, and the budget kept at `10` when S is 0; any other source is kept as gi
- [x] L4-1 P2 .skilled/commands/deep/research.md:107 The `--depth-mode` row enumerates the admission caps as "depth, fan-out, budget, dedupe and cycle". frontier-admit.cjs runs six checks in one fixed order and records the first failing check's name as  [handed off]
  fix: under depth, fan-out, budget, dedupe and cycle caps -> under relevance, dedupe, depth, fan-out, budget and cycle caps
- [x] L3-2 P2 .skilled/commands/deep/assets/deep-review.yaml:367 The fan-out spawn step tells the executor to skip "phase_init and phase_main_loop", but this workflow has no phase_main_loop: its phases are phase_init, phase_loop, phase_synthesis and phase_save, so  [handed off]
  fix: phase_main_loop entirely -> phase_loop entirely
- [x] L4-2 P2 .skilled/commands/deep/review.md:100 The `--depth-mode` row enumerates the admission caps as "depth, fan-out, budget, dedupe and cycle" and omits the relevance check, which is the one check that keeps a review node inside the review targ [handed off]
  fix: under depth, fan-out, budget, dedupe and cycle caps -> under relevance, dedupe, depth, fan-out, budget and cycle caps
- [x] L4-3 P2 .skilled/commands/deep/review.md:100 The row states "the ceiling of 24 binds from two seeds on". expansiveBudget derives min(24, max(7, 2 × D × (S + maxDepth − 1))), and with the four canonical dimensions (D = 4) and maxDepth 3 a single  [rebutted]
  fix: the ceiling of 24 binds from two seeds on -> the ceiling of 24 is reached from one seed on
- [x] L3-1 P1 .skilled/commands/deep/assets/deep-review-presentation.txt:446 The Convergence Detection list claims review's STOP is gated by "Three binary quality gates (evidence, scope, coverage)". The review stop path evaluates nine legal-stop gates before a candidate become [handed off]
- [x] L2-2 P2 .skilled/commands/deep/assets/deep-research.yaml:356 The fan-out seed step tells the operator that "frontier-admit.cjs is the only writer of the node store and the frontier inbox rows", in the very step whose next act is `fanout-run.cjs` splitting the s [handed off]

### docs:.pi/agents

- [x] L1-3 P1 .pi/agents/deep-research.md:294 Same inert budget claim in the pi mirror of the research leaf: admission is said to prune a row that "would exceed the depth, fan-out or budget caps", and the row shape says `budget` must be "never ab [handed off]
- [x] L1-4 P1 .pi/agents/deep-review.md:260 Same inert budget claim in the pi mirror of the review leaf: the admission-prune enumeration includes "would exceed the depth, fan-out or budget caps" and the row shape says `budget` must be "never ab [handed off]

### docs:.skilled/skills

- [ ] L7-1 P1 .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:186 The dimension-coverage vote is described as covering "every configured dimension, the four canonical ones plus any custom name". The code does not always require the four canonical names: `stopDecisio
  fix: - Dimension coverage reaches 100% across every configured dimension, the four canonical ones plus any custom name -> - Dimension coverage reaches 100% across every dimension named in `config.reviewDimensions` (the four canonical names by
- [ ] L7-2 P1 .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:304 The doc says a frontier node is `answered` "once every configured dimension is covered for it". The reducer does not use the configured list: `buildDimensionUniverse` starts from `REQUIRED_DIMENSIONS`
  fix: A node is `answered` once every configured dimension is covered for it. -> A node is `answered` once every dimension in the run's universe is covered for it: the four canonical dimensions plus ev
- [x] L5-1 P2 .skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:415 The protocol says the FRONTIER block's allowance is computed "from the node's remaining child slots". frontier-admit.cjs:612-615 takes the minimum of the node's remaining child slots and the run-wide  [handed off]
  fix: computes from the node's remaining child slots -> computes from the node's remaining child slots and the run's remaining nodes under the frontier cap
- [x] L5-2 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:868 The FAN-OUT section blurb says the section "covers 4 scenarios" and then enumerates only three: "CLI lineage pool dispatch, native sequential agent dispatch, and single-executor parity". The fourth is [handed off]
  fix: This category covers 4 scenarios validating the opt-in fan-out dispatch layer added in the research loop: CLI lineage po -> This category covers 4 scenarios validating the opt-in fan-out dispatch layer added in the research loop: CLI lineage po
- [x] L6-1 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/cross-mode-anti-convergence-contract.md:29 The doc enumerates the optimizer manifest's anti-convergence invariant group as locking only `antiConvergence.convergenceMode` and `convergenceMode`. The manifest's `anti-convergence-floor` group lock [handed off]
  fix: `antiConvergence.convergenceMode` and `convergenceMode` stay locked -> `antiConvergence.convergenceMode`, `convergenceMode` and `antiConvergence.depthMode` stay locked
- [x] L8-1 P2 .skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:16 The overview states the run-wide frontier cap as "half of `maxIterations`" with the seed inside it. The code makes that cap configurable and exempts the seed pass: `runCap = capValue(expansive.maxFron [handed off]
  fix: Admission caps the live frontier at half of `maxIterations`, and the seed counts toward that cap, so a defaulted budget  -> Admission caps the live frontier at `expansiveDepth.maxFrontierNodes`, which defaults to half of `maxIterations` (10 whe
- [x] L7-5 P2 .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:98 The cheat sheet's §4 STATE FILES table claims to list the packet's files and omits the frontier node store, even though its own §8 and §1 document `--depth-mode=expansive`. `state-format.md` counts `f [handed off]
  fix: | Pause | `review/.deep-review-pause` | Sentinel | Pause between iterations | -> | Pause | `review/.deep-review-pause` | Sentinel | Pause between iterations | | Frontier nodes | `review/frontier-nodes.
- [ ] L7-3 P2 .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:38 The config-mutability row lists the `--extend=N` rewrite as `maxIterations`, `maxDurationMinutes`, `lineageMode` and `continuedFromRun`, leaving out `status`. `step_extend_completed_run` replaces the 
  fix: the `--extend=N` rewrite of `maxIterations`, `maxDurationMinutes`, `lineageMode` and `continuedFromRun` -> the `--extend=N` rewrite of `status` (back to `initialized`), `maxIterations`, `maxDurationMinutes`, `lineageMode` and `
- [x] L7-6 P2 .skilled/skills/system-deep-loop/deep-review/references/state/state-format.md:514 The finding-registry field reference gives `dimension` a closed list of the four canonical names. The reducer derives each finding's `dimension` with `deriveDimension(..., universe)`, where `universe` [handed off]
  fix: | dimension | string | Primary dimension: correctness, security, traceability, maintainability | -> | dimension | string | Primary dimension: correctness, security, traceability, maintainability, or any configured custom
- [x] L4-4 P2 .skilled/skills/system-deep-loop/deep-research/assets/deep-research-strategy.md:179 RESEARCH BOUNDARIES lists the live lifecycle branches as `resume`, `restart` and `completed-continue`, and then names `fork` as the only deferred branch. `new` is also live: the config template's `lin [handed off]
  fix: Lifecycle branches: `resume`, `restart`, `completed-continue` through `--extend=N` (live) -> Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` through `--extend=N` (live)
- [x] L7-4 P1 .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:169 The doc states the persisted `blocked_stop` row carries `gateResults` as named sub-records keyed by `convergenceGate`/`dimensionCoverageGate`/... each with a `pass` boolean and gate-specific fields (s [handed off]
- [x] L8-2 P2 .skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:46 The Implementation table credits `fanout-run.cjs` only with passing `depthMode` to lineages, and omits `runtime/scripts/fanout-merge.cjs`, which carries the other half of the fan-out partition the doc [handed off]

### docs:.skilled/agents

- [x] L1-5 P1 .skilled/agents/deep-research.md:302 The canonical research leaf lists the budget cap as an admission prune ("would exceed the depth, fan-out or budget caps") and constrains the row's `budget` to "never above the parent's" (line 301), bu [handed off]
- [x] L1-6 P1 .skilled/agents/deep-review.md:267 The canonical review leaf states admission prunes a row that "would exceed the depth, fan-out or budget caps" and constrains `budget` to "never above the parent's" (line 266). The budget comparison in [handed off]

## Pre-existing or outside the scope

