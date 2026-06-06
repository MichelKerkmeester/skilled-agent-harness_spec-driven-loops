# Fan-Out Lineage Diversity Experiment — Pre-Registered Design

- **Date:** 2026-06-06
- **Packet:** `system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/018-program-research-and-remediation`
- **Backlog item:** 4 (angles 31, 35)
- **Question:** Does heterogeneous N-model fan-out surface materially more findings than N runs of one model (31)? Do MiMo, DeepSeek, and MiniMax surface different findings or converge on the same input (35)?
- **Staged outside the repo** during execution to avoid cross-lineage contamination; copied into `research/experiments/fanout-diversity/` after the final dispatch.

## Method

The 028 run partitioned 50 angles across 3 model lanes (each angle answered by exactly one model), so it could not measure diversity. This experiment sends the SAME 5-question set through all three lanes, twice each.

### Run matrix (6 serial dispatches)

| Run | Model slug | Framework (per sk-prompt-small-model profile) | Flags |
|---|---|---|---|
| deepseek-r1, deepseek-r2 | `deepseek/deepseek-v4-pro` | RCAF, medium pre-plan | `--variant high --pure --format json` |
| minimax-r1, minimax-r2 | `minimax-coding-plan/MiniMax-M3` | TIDD-EC, dense pre-plan | `--variant high --format json` |
| mimo-r1, mimo-r2 | `xiaomi-token-plan-ams/mimo-v2.5-pro` | COSTAR, lean pre-plan | `--variant high --format json` |

All dispatches: `AI_SESSION_CHILD=1 gtimeout 2400 opencode run ... --dir <repo-root> "<prompt>" </dev/null > raw/<run>.json 2> raw/<run>.stderr`. Serial order: deepseek-r1, minimax-r1, mimo-r1, deepseek-r2, minimax-r2, mimo-r2. Run-2 prompts are byte-identical to run-1 prompts (repeat-sampling; run id lives only in output filenames + JSON envelope). The repo is frozen (no writes by the orchestrator) until all six complete.

### Question set (identical text in all three prompts)

Drawn from the 50-angle catalog; lightly expanded for standalone clarity (models do not see the catalog). Mapping:

| Prompt id | Catalog angle | Topic |
|---|---|---|
| Q1 | 8 | memory-index move-reconciliation correctness/races |
| Q2 | 17 | shared-daemon lease-holder death + re-election latency |
| Q3 | 26 | code-graph unionMode:'multi' + hotFileBreadcrumb value |
| Q4 | 30 | skill-graph enhancement-edge propagation discovery lift |
| Q5 | 40 | /doctor coverage gaps by subsystem |

Selection criteria: still-open questions (not remediated this week, so ground truth is not "verified fixed", which would compress diversity), one per theme cluster, all answerable read-only with code evidence, none self-referential about fan-out itself.

### Contamination controls

1. Prompts forbid reading anything under `.opencode/specs/` (the 018 packet contains written answers to all five questions; other packets carry related research).
2. Prompts forbid memory MCP tools (`memory_search` etc. index the saved research).
3. Outputs are staged in /tmp, never written into the repo mid-experiment, so a later lane cannot read an earlier lane's findings.
4. Post-hoc scan: any output citing `.opencode/specs/` or the 018 packet path voids that lineage (recorded, excluded from analysis).

### Known asymmetries (accepted, documented)

- **Framework confound:** each lane uses its profile-recommended framework (RCAF / TIDD-EC / COSTAR), mirroring the 028 method and production fan-out. The experiment therefore measures lane diversity (model + its tuned prompt), not pure model-identity diversity.
- **`--pure` asymmetry:** the DeepSeek direct API requires `--pure` (tool names with `:` are rejected), which strips plugins/MCP for that lane; the other lanes are instructed not to use memory tools instead.
- `opencode-go` is not configured on this host; the DeepSeek lane uses the direct `deepseek` provider — the configuration the backlog smoke-tested on 2026-06-06.

## Analysis protocol (fixed before any output is read)

- **Finding unit:** one discrete factual claim = (claim, evidence anchor, confidence) extracted from each (model, run, question).
- **Matching rule:** two findings from different lineages match when they assert the same fact about the same code surface — shared evidence anchor (same file/mechanism) OR clear same-claim paraphrase. Matching is done by the orchestrating agent in a published table; every match carries a one-line justification.
- **Metrics:**
  - Per question and aggregate, pairwise Jaccard between models (run 1 primary; per-model union of runs as a secondary view): J(X,Y) = |clusters in both| / |clusters in either|.
  - Same-model baseline: J(run1, run2) per model.
  - Unique-finding counts per lane; union sizes.
- **Pre-registered thresholds:**
  - **Angle 35:** mean cross-model J < 0.6 → models surface meaningfully different findings; > 0.8 → convergence (fan-out is pure parallelism); 0.6–0.8 → mixed. (Thresholds inherited from the D4 proposal.)
  - **Angle 31:** heterogeneous lift is *material* if |union(deepseek-r1, minimax-r1, mimo-r1)| ≥ 1.25 × max_model |union(run1, run2)|, AND cross-model J is clearly below same-model J. Otherwise heterogeneity adds little beyond resampling one model.
- **Secondary observables:** wall-clock + token counts per lane (from the JSON envelope), citation-accuracy spot-check (do cited anchors exist?), per-question coverage (did a lane skip a question?).

## Threats to validity

- N=2 runs per model is a thin same-model baseline; treat borderline results as provisional and extend with a third run if J lands in 0.6–0.8.
- The orchestrator performs matching manually; published per-match justifications mitigate but do not remove judge bias.
- Models may differ in finding granularity (one model's 1 finding = another's 3); clustering by asserted fact (not by list position) is the mitigation.
