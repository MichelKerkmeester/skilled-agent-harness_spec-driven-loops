DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 5 of 8
Questions: four research areas addressed; optimization design remains
Last 3 ratios: 0.98 -> 1.00 -> 1.00 | Stuck count: 0
Next focus: Design the explicit enumerable `INTENT_SIGNALS + RESOURCE_MAP` target and dependency-ordered rollout.

Research Topic: Diagnose and optimize system-code-graph skill routing using the sk-doc typed-pair measurement model.
Iteration: 5 of 8
Focus Area: Produce a concrete target router design that replaces `RESOURCE_DOMAINS` selectors with an explicit intent-to-leaf-path `RESOURCE_MAP` while preserving defaults, ambiguity behavior, deduplication, package indexes, discovery guards, and standalone topology. Enumerate proposed intent keys/resources at implementation-ready granularity and order the changes by dependency.
Remaining Key Questions:
- Which exact routing optimizations close the diagnosed gaps?
- What explicit resource map and invariants should implementation use?
- What must change before typed gold and benchmark promotion?
Last 3 Iterations Summary: typed identity/root contract; baseline/scoring procedure; 23/5 scenario typed-gold partition.
Saturated Directions: No selector-as-leaf IDs, no synthetic aliases, no forced parent-hub conversion, no package indexes as leaves.

## STATE FILES

- Config: .opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-config.json
- State Log: .opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deep-research-strategy.md
- Registry: .opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/findings-registry.json
- Write narrative: .opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/iterations/iteration-005.md
- Write delta: .opencode/specs/sk-doc/019-sk-doc-router-alignment/017-system-code-graph-routing-research/research/deltas/iter-005.jsonl

## CONSTRAINTS AND OUTPUT CONTRACT

- Load `.opencode/agents/deep-research.md`; exactly one LEAF iteration, state-first, max 12 calls.
- Research and design findings only; do not edit implementation sources.
- Only iteration-005.md, one canonical state append, and iter-005.jsonl may be written.
- Cite every design choice to current router, inventories, contract code, or prior packet evidence; mark recommendations as inference.
- Both canonical records require iteration/run 5 and complete deep-research route proof plus canonical assessment fields.
- Delta first line equals state append. Verify all three artifacts and packet scope.
