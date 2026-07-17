DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 3 of 8
Questions: 0/5 reducer-resolved | Last focus: Standalone Typed Identity and Native Resource Roots
Last 2 ratios: 1.00 -> 0.98 | Stuck count: 0
Resource map: absent at init; skip input coverage gate.
Next focus: Establish the first skill-benchmark baseline against the unmodified current router, then define how target typed-pair scoring would be computed without conflating baseline and optimized behavior.

Research Topic: Diagnose system-code-graph routing and apply the sk-doc typed-pair routing optimization model. Produce research findings and a resource map only.
Iteration: 3 of 8
Focus Area: Establish a reproducible first benchmark baseline for the current unmodified standalone router. Determine exact benchmark commands/data flow, expected current scoring behavior, and how a future typed-pair target should be compared.
Remaining Key Questions:
- How should the first skill-benchmark baseline be established with no committed baseline?
- How would skill-benchmark score current untyped output versus proposed typed gold?
- Which scenarios are eligible for typed gold?
- Which dependency-ordered optimizations close the gaps?
Carried-Forward Open Questions: benchmark baseline procedure and score interpretation.
Last 3 Iterations Summary: run 1 inventory/current router (1.00); run 2 typed identity/root contract (0.98)
Pivot Lineage: none
Saturated Directions: Do not re-litigate mode/root identity unless benchmark evidence contradicts iteration 2. Do not infer current typed output.

## STATE FILES

- Config: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-config.json
- State Log: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-strategy.md
- Registry: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/findings-registry.json
- Write narrative: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/iterations/iteration-003.md
- Write delta: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deltas/iter-003.jsonl

## CONSTRAINTS AND OUTPUT CONTRACT

- Load `.opencode/agents/deep-research.md`; run exactly one LEAF iteration; no Task/sub-agent use.
- State-first, 3-5 focused research actions, max 12 total tool calls, research-only.
- Researched files and reducer-owned files are read-only. Only the narrative, one state-log append, and delta above may be written.
- Every finding needs a source or inference marker.
- State and delta records require `type:"iteration"`, `iteration:3`, `run:3`, `mode:"research"`, `target_agent:"deep-research"`, `agent_definition_loaded:true`, `resolved_route:"Resolved route: mode=research target_agent=deep-research"`, and all canonical assessment fields.
- Delta first line must match the appended canonical record. Verify all outputs before return.
