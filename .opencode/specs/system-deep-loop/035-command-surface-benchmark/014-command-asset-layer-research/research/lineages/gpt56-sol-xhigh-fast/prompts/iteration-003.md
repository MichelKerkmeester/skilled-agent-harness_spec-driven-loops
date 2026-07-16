DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 3 of 5

STATE SUMMARY: 2/5 questions answered. Ratios: 0.90, 0.90. RQ1 normalized workflow semantics; RQ2 established asset ownership with bounded typed inline copies. Stop policy is max-iterations; any convergence vote remains telemetry. Next focus is RQ3.

Research Topic: Command asset-layer schemas across create, design, speckit, memory, doctor, and deep.

Focus Area: Derive the six-family mode matrix and default-resolution policies. Design a completeness check proving every declared `:auto` / `:confirm` mode has both its `_<mode>.yaml` asset and matching EXECUTION TARGETS row, closing the reachability-versus-completeness gap without imposing a single default.

State files:
- Config: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-config.json`
- State: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-state.jsonl`
- Strategy: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-strategy.md`
- Registry: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/findings-registry.json`

Allowed writes only:
- `.../iterations/iteration-003.md`
- append exactly one canonical iteration record to `.../deep-research-state.jsonl`
- `.../deltas/iter-003.jsonl`

Read `.opencode/agents/deep-research.md`, then follow its one-iteration protocol. Do not dispatch sub-agents. Use 3-5 focused research actions and no more than 12 total tool calls. Read state first. Inspect all family mode declarations, routing/default semantics, asset pairs, EXECUTION TARGETS tables, and current validator/benchmark coverage. Every finding needs `[SOURCE: file:line]`. Include candidate deltas with target path and acceptance criterion. Do not implement or edit researched source. Required route proof: `target_agent: "deep-research"`, `agent_definition_loaded: true`, `resolved_route: "Resolved route: mode=research target_agent=deep-research"`, `mode: "research"`.
