DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 4 of 8
Questions: baseline and typed identity addressed; scenario classification and optimization plan remain
Last 3 ratios: 1.00 -> 0.98 -> 1.00 | Stuck count: 0
Next focus: Classify all 28 manual-testing-playbook scenarios for typed-gold eligibility.

Research Topic: Diagnose system-code-graph routing and derive sk-doc typed-pair optimizations, benchmark expectations, findings, and resource map.
Iteration: 4 of 8
Focus Area: Inspect every one of the 28 playbook scenario files and classify it as a genuine resource-routing decision eligible for `(workflowMode, leafResourceId)` gold or as behavior/command/integration coverage that should not carry typed routing gold. Define objective eligibility criteria and provide a complete auditable partition.
Remaining Key Questions:
- Which 28 scenarios are genuine routing decisions eligible for typed gold?
- Which scenarios are non-routing behavior coverage, and why?
- Which dependency-ordered routing optimizations follow?
Last 3 Iterations Summary: run 1 current router/inventory; run 2 typed identity/root contract; run 3 baseline/scoring procedure.
Saturated Directions: Do not treat every scenario as routing gold merely because it is a routable resource. Distinguish the scenario's tested behavior from whether its invocation text should select that resource.

## STATE FILES

- Config: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-config.json
- State Log: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-strategy.md
- Registry: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/findings-registry.json
- Write narrative: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/iterations/iteration-004.md
- Write delta: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deltas/iter-004.jsonl

## CONSTRAINTS AND OUTPUT CONTRACT

- Load `.opencode/agents/deep-research.md`; execute one LEAF iteration only.
- Read state first; use 3-5 focused actions and no more than 12 tool calls.
- Research-only. All inspected source and reducer files are read-only.
- Allowed writes: iteration-004.md, exactly one canonical append to the state log, and iter-004.jsonl only.
- Cite every classification rule and every scenario group with file:line evidence; include the full 28-item partition in the narrative.
- Both canonical records require `type:"iteration"`, `iteration:4`, `run:4`, `mode:"research"`, `target_agent:"deep-research"`, `agent_definition_loaded:true`, `resolved_route:"Resolved route: mode=research target_agent=deep-research"`, plus all canonical assessment fields.
- Delta first line equals state append. Verify artifacts, route proof, citations, append count, and packet scope.
