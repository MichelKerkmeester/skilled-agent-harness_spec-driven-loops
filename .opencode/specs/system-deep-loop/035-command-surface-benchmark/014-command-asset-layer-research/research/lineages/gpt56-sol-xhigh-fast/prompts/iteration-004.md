DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 4 of 5

STATE SUMMARY: 3/5 questions answered. Ratios: 0.90, 0.90, 0.90; rolling average 0.90; question coverage 0.60. Stop policy is max-iterations, so continue. RQ1-RQ3 are saturated. Next focus is RQ4.

Research Topic: Command asset-layer schemas across create, design, speckit, memory, doctor, and deep.

Focus Area: Define the doctor route-manifest shape (`_routes.yaml` plus per-route YAML and loader gating), name it in the topology taxonomy, and specify schema-aware executable-edge traversal so YAML comments cannot create false route cycles while genuine direct, subaction, and workflow dispatch cycles still fail.

State files:
- Config: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-config.json`
- State: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-state.jsonl`
- Strategy: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-strategy.md`
- Registry: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/findings-registry.json`

Allowed writes only:
- `.../iterations/iteration-004.md`
- append exactly one canonical iteration record to `.../deep-research-state.jsonl`
- `.../deltas/iter-004.jsonl`

Read `.opencode/agents/deep-research.md`, then follow its one-iteration protocol. Do not dispatch sub-agents. Use 3-5 focused research actions and no more than 12 total tool calls. Read state first. Inspect doctor manifests, route YAMLs, router loader gates, current raw-text edge extraction, and representative comment-only and genuine edge forms. Every finding needs `[SOURCE: file:line]`. Include candidate deltas with target path and acceptance criterion. Do not implement or edit researched source. Required route proof: `target_agent: "deep-research"`, `agent_definition_loaded: true`, `resolved_route: "Resolved route: mode=research target_agent=deep-research"`, `mode: "research"`.
