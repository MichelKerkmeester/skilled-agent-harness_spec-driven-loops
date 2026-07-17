DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 8
Questions: 0/5 reducer-resolved | Last focus: Current Router and Concrete Resource Inventory
Last ratio: 1.00 | Stuck count: 0
Resource map: resource-map.md not present; skipping input coverage gate.
Next focus: What canonical singleton `workflowMode` should identify this standalone skill, and should the typed contract permit `feature_catalog/` and `manual_testing_playbook/` leaves or project them through aliases?

Research Topic: Diagnose system-code-graph skill-routing and apply the sk-doc typed-pair routing optimizations. Investigate explicit `INTENT_SIGNALS` + `RESOURCE_MAP`, benchmark scoring, typed gold, and concrete optimizations. Produce findings and a resource-map.
Iteration: 2 of 8
Focus Area: Resolve typed identity semantics for the standalone skill and its feature-catalog/playbook resources using existing repository precedents. Do not invent an unsupported current-state mode; distinguish diagnosis from recommendation.
Remaining Key Questions:
- Can every prefix/stem target become a discrete typed leaf set under a durable namespace?
- What canonical singleton `workflowMode` should identify this standalone skill?
- Should `feature_catalog/` and `manual_testing_playbook/` be legal leaf roots or aliases?
- How should the first benchmark baseline be established?
- Which 28 scenarios deserve typed gold, and what optimizations follow?
Carried-Forward Open Questions:
- How should the first skill-benchmark baseline be established?
- What canonical singleton mode and leaf namespace should be proposed?
Last 3 Iterations Summary: run 1: current router/inventory (1.00)
Pivot Lineage: none
Saturated Directions: Do not assign an inferred current workflow mode; do not treat selectors as leaves; do not count package indexes as leaves.

## STATE FILES

- Config: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-config.json
- State Log: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-strategy.md
- Registry: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/iterations/iteration-002.md
- Write per-iteration delta to: .opencode/specs/sk-doc/031-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deltas/iter-002.jsonl

## CONSTRAINTS AND OUTPUT CONTRACT

- Load `.opencode/agents/deep-research.md`; execute exactly one LEAF iteration; no sub-agents.
- Read config, state, strategy, and registry before research. Perform 3-5 focused actions, max 12 tool calls.
- Research only; all researched files are read-only. Reducer-owned files are read-only.
- Allowed writes are only iteration-002.md, one append-only canonical iteration record in the state log, and iter-002.jsonl.
- Every finding needs `[SOURCE: path:line]` or `[INFERENCE: ...]`.
- Both canonical records require `type:"iteration"`, `iteration:2`, `run:2`, `mode:"research"`, `target_agent:"deep-research"`, `agent_definition_loaded:true`, `resolved_route:"Resolved route: mode=research target_agent=deep-research"`, plus newInfoRatio, noveltyJustification, status, focus, findingsCount, keyQuestions, answeredQuestions, ruledOut, toolsUsed, sourcesQueried, timestamp, durationMs, and optional valid graphEvents.
- The delta's first line must match the state-log iteration record. Verify the narrative, exact append count, route proof, citations, and packet boundary before returning.
