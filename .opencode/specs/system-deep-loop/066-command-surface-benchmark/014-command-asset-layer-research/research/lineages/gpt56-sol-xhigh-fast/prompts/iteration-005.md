DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 5 of 5

STATE SUMMARY: 4/5 questions answered. Ratios: 0.90, 0.90, 0.90, 0.90; rolling average 0.90; MAD floor 0.00; question coverage 0.80. The max-iterations policy requires this final pass before synthesis. RQ1-RQ4 are saturated. Next focus is RQ5.

Research Topic: Command asset-layer schemas across create, design, speckit, memory, doctor, and deep.

Focus Area: Define how one typed command contract generates OWNED ASSETS, PRESENTATION BOUNDARY, and mode/default/EXECUTION TARGETS tables; establish evidence-based thresholds for moving overgrown display/workflow blocks out of fat `deep/*` routers; and correct/prevent mislabeled `.txt` ownership entries. Produce candidate deltas mapped to target paths with acceptance criteria.

State files:
- Config: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-config.json`
- State: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-state.jsonl`
- Strategy: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-strategy.md`
- Registry: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/findings-registry.json`

Allowed writes only:
- `.../iterations/iteration-005.md`
- append exactly one canonical iteration record to `.../deep-research-state.jsonl`
- `.../deltas/iter-005.jsonl`

Read `.opencode/agents/deep-research.md`, then follow its one-iteration protocol. Do not dispatch sub-agents. Use 3-5 focused research actions and no more than 12 total tool calls. Read state first. Compare generated-section candidates with current templates and representative fat/thin routers; quantify or structurally classify what belongs in router versus workflow versus presentation asset. Every finding needs `[SOURCE: file:line]`. Include target paths and testable acceptance criteria. Do not implement or edit researched source. Required route proof: `target_agent: "deep-research"`, `agent_definition_loaded: true`, `resolved_route: "Resolved route: mode=research target_agent=deep-research"`, `mode: "research"`.
