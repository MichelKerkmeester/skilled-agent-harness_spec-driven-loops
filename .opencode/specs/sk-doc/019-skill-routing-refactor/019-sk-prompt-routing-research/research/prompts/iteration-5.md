DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 5 of 5
Questions: 0/5 reducer-resolved | Last focus: benchmark denominator and typed-score provenance
Last 2 ratios: 0.90 -> 0.92 | Stuck count: 0
Resource map: resource-map.md not present; workflow synthesis will emit it from deltas.
Memory context refresh: unavailable; use packet-local and repository evidence.
Next focus: Classify all 32 sk-prompt playbook scenarios and specify the smallest independently authored typed-gold seed with exact expected pairs.

Research Topic: Diagnose sk-prompt skill-routing and apply sk-doc typed-pair routing optimizations across `prompt-improve` and `prompt-models`.
Iteration: 5 of 5
Focus Area: Use the benchmark loader's actual discovery and eligibility rules to account for all 32 playbook scenarios. Separate genuine mode/leaf routing decisions from behavior, guard, failure, and command scenarios. For eligible routing cases, derive candidate gold from each scenario's authored intent, never router output. Specify exact scenario IDs/paths and expected `(workflowMode, leafResourceId)` pairs for the smallest useful seed. Close with a no-further-research implementation handoff and resource/dependency pointers.
Remaining Key Questions: scenario classification and typed-gold seed; consolidate any residual implementation constraints from prior iterations.
Last 3 Iterations Summary: run 2 plan (0.93); run 3 resource map (0.90); run 4 benchmark measurement (0.92).
Saturated Directions: do not infer typed gold from filenames/router output, type every scenario, promote supporting-only files, or predict a post-typed score.

## STATE FILES

- Config: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/019-sk-prompt-routing-research/research/deep-research-config.json`
- State Log: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/019-sk-prompt-routing-research/research/deep-research-state.jsonl`
- Strategy: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/019-sk-prompt-routing-research/research/deep-research-strategy.md`
- Registry: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/019-sk-prompt-routing-research/research/findings-registry.json`
- Prior iterations: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/019-sk-prompt-routing-research/research/iterations/iteration-001.md` through `iteration-004.md`
- Write narrative: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/019-sk-prompt-routing-research/research/iterations/iteration-005.md`
- Write delta: `.opencode/specs/sk-doc/019-sk-doc-router-alignment/019-sk-prompt-routing-research/research/deltas/iter-005.jsonl`

## CONSTRAINTS AND OUTPUT

- You are the `deep-research` LEAF agent. Run one iteration only, no sub-agents, at most 12 tool calls.
- Read state and strategy first. Research targets are read-only; do not implement fixes.
- Only write `iteration-005.md`, append one canonical iteration record to the state log, and create `iter-005.jsonl`.
- Cite every finding as `[SOURCE: file:line]`; provide deterministic counts, exact candidate IDs/paths/pairs, eliminated alternatives, and the final handoff order.
- Include mandatory route proof exactly, with `iteration: 5` and `run: 5`, metrics, questions, ruled-out directions, tools, sources, timestamp, and duration in both records.
- Validate all three artifacts before returning.
