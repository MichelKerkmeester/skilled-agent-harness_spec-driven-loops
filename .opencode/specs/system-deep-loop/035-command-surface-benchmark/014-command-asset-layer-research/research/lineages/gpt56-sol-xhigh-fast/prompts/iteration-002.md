DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 2 of 5

STATE SUMMARY: 1/5 questions answered. Iteration 1 established a semantic execution graph and discriminated topology variants (newInfoRatio 0.90). Stop policy is max-iterations; convergence is telemetry only before iteration 5. Next focus is RQ2.

Research Topic: Command asset-layer schemas across create, design, speckit, memory, doctor, and deep.

Focus Area: Inventory presentation ownership across all six command families. Determine who owns `_presentation.txt`, distinguish legitimate inline presentation (especially `memory/search`) from router leaks, and propose typed owner/exception declarations that make intentional exceptions auditable.

State files:
- Config: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-config.json`
- State: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-state.jsonl`
- Strategy: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-strategy.md`
- Registry: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/findings-registry.json`

Allowed writes only:
- `.../iterations/iteration-002.md`
- append exactly one canonical iteration record to `.../deep-research-state.jsonl`
- `.../deltas/iter-002.jsonl`

Read `.opencode/agents/deep-research.md`, then follow its one-iteration protocol. Do not dispatch sub-agents. Use 3-5 focused research actions and no more than 12 total tool calls. Read state first. Cover representative and exceptional presentation assets, router PRESENTATION BOUNDARY prose, and mislabeled ownership examples. Every finding needs `[SOURCE: file:line]`. Include candidate deltas with target path and acceptance criterion. Do not implement or edit researched source. Required route proof: `target_agent: "deep-research"`, `agent_definition_loaded: true`, `resolved_route: "Resolved route: mode=research target_agent=deep-research"`, `mode: "research"`.
