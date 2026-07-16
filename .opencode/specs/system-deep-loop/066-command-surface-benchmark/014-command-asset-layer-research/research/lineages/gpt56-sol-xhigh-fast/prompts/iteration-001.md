DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 1 of 5

STATE SUMMARY: 0/5 questions answered. Stop policy is max-iterations; convergence is telemetry only before iteration 5. Memory context is unavailable; use direct repository evidence. Next focus is RQ1.

Research Topic: Command asset-layer schemas across create, design, speckit, memory, doctor, and deep.

Focus Area: Derive the canonical `_auto.yaml` / `_confirm.yaml` schema (nodes, steps, bindings, placeholders), inventory family divergence, and specify what a machine-readable command contract must capture so router prose and YAML wiring cannot drift.

State files:
- Config: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-config.json`
- State: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-state.jsonl`
- Strategy: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/deep-research-strategy.md`
- Registry: `.opencode/specs/system-deep-loop/066-command-surface-benchmark/014-command-asset-layer-research/research/lineages/gpt56-sol-xhigh-fast/findings-registry.json`

Allowed writes only:
- `.../iterations/iteration-001.md`
- append exactly one canonical iteration record to `.../deep-research-state.jsonl`
- `.../deltas/iter-001.jsonl`

Read `.opencode/agents/deep-research.md`, then follow its one-iteration protocol. Do not dispatch sub-agents. Use 3-5 focused research actions and no more than 12 total tool calls. Read the state files first. Research the shipped command corpus and the 012 baseline. Every finding needs `[SOURCE: file:line]`. Include candidate deltas with target path and acceptance criterion. Do not implement or edit any researched source. Required route proof: `target_agent: "deep-research"`, `agent_definition_loaded: true`, `resolved_route: "Resolved route: mode=research target_agent=deep-research"`, `mode: "research"`.
