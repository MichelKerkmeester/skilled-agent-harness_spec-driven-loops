# Iteration 027 - S4-03

## Focus

Where should a `current_iteration < minIterations` guard short-circuit STOP to CONTINUE, mirroring the quality-guard override path, in `.opencode/commands/deep/assets/deep_research_auto.yaml` around `step_graph_convergence` and `step_check_convergence`?

S4-02 already established `minIterations` as a config/backlog concept. This pass maps the exact stop-order placement.

## Actions Taken

1. Read the current deep-research YAML stop path around `step_graph_convergence` and `step_check_convergence`.
2. Mined kasper's minimum-observation threshold path as the reference analogue for lower-bound gating before acting.
3. Compared reference threshold filtering/early-return with our graph-assisted STOP and quality-guard override order.
4. Wrote the target mapping as three findings plus graph events for source, target, and mapping edges.

## Findings

### S4-03A - Min guard belongs after STOP candidate formation, before quality guards

Reference mechanism: kasper validates `min_observations_for_update` as a bounded config field at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/config.ts:36-46`, then filters improvement candidates below that threshold at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/handlers.ts:419-429`. A candidate can exist, but action is illegal until the minimum evidence count is reached.

Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml:507-516`. Insert the guard after the graph+inline composite branch assigns `decision = "STOP"` and `reason = "composite_converged"`, but before the existing quality guard block. The resulting order should be: terminal max cap, all-questions/stuck/composite decision, min-iterations STOP override, quality STOP override, then handle decision.

Port difficulty: easy. Tag: quick-win.

### S4-03B - Do not put minIterations inside step_graph_convergence

Reference mechanism: kasper's auto-update path looks up aggregate weakness state and passes `config.min_observations_for_update` into matching at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/evaluate.ts:1675-1680`, then returns before side effects when no threshold-qualified match exists at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/evaluate.ts:1682`. The threshold is a consumer/admission decision, not part of score generation.

Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml:458-471`. Keep `step_graph_convergence` as a snapshot producer that records `graph_decision`, signals, blockers, and score. Apply `current_iteration < minIterations` in `step_check_convergence`, where the graph decision is consumed together with the inline STOP candidate.

Port difficulty: easy. Tag: quick-win.

### S4-03C - Emit minIterations override state separately from quality failure

Reference mechanism: kasper's reusable helper treats the minimum as an explicit precondition at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/utils.ts:94-105`, and the manual command reports a threshold-specific no-op at `.opencode/specs/skilled-agent-orchestration/156-agent-loops-improved/external/kasper/src/handlers.ts:428-429`.

Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml:519-526`. Add outputs such as `min_iterations_guard_pass`, `min_iterations_required`, and `min_iterations_current`, or an equivalent JSONL event, so reducers can distinguish "too early to stop" from "quality guard failed". This is especially useful because both outcomes intentionally end as CONTINUE.

Port difficulty: med. Tag: quick-win.

## Questions Answered

S4-03 is answered: the `current_iteration < minIterations` guard should short-circuit in `step_check_convergence`, after a non-terminal STOP candidate exists and before `checkQualityGuards(state, strategy)`. It should not override `maxIterationsReached`, and it should not be folded into `step_graph_convergence` or `convergence.cjs`.

## Questions Remaining

- Whether `all_questions_answered` should also be age-gated. The current quality-guard pattern applies to every STOP except `maxIterationsReached`, so parity suggests yes, but product semantics may want all-questions completion to remain terminal.
- Whether the audit output should be a dedicated `stop_override` event or extra fields on the existing convergence decision outputs.

## Next Focus

Suggested S4-04: define the JSONL/reducer contract for STOP overrides so graph-blocked, min-iteration-blocked, and quality-guard-blocked paths remain distinguishable even when they all continue the loop.
