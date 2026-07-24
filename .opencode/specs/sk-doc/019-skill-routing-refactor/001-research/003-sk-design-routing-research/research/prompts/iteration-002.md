DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE
STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 8
Questions: 0/5 reducer-resolved (iteration 1 claims one answer pending exact-text reconciliation) | Last focus: six-mode typed-pair classification
Last 2 ratios: N/A -> 1.00 | Stuck count: 0
Resource map: not present at init; final map emission remains enabled.
Memory context refresh: unavailable; use direct evidence.
Next focus: Verify whether one root leaf manifest can represent all six mode namespaces, including the nested transport, and whether generation/check behavior is byte-stable.

Research Topic: Diagnose sk-design skill-routing faults and apply the sk-doc typed-pair routing optimizations.
Iteration: 2 of 8
Focus Area: Leaf-manifest generator feasibility and byte stability for all six sk-design modes.
Remaining Key Questions: manifest feasibility; routing-scenario partition; score attribution; dependency-ordered optimizations.
Carried-Forward Open Questions: Reconcile shared-resource aliases and the transport packet boundary.
Last 3 Iterations Summary: run 1: six-mode typed-pair classification (1.00)
Pivot Lineage: none
Saturated Directions: do not flatten the transport into interface; do not invent a seventh hub mode; leaf IDs are packet-root-relative.

## STATE FILES
- Config: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/deep-research-config.json
- State Log: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/deep-research-strategy.md
- Registry: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/findings-registry.json
- Iteration narrative: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-002.md
- Delta: .opencode/specs/sk-doc/019-sk-doc-router-alignment/016-sk-design-routing-research/research/deltas/iter-002.jsonl

## CONSTRAINTS
- Execute exactly one `deep-research` LEAF iteration; load `.opencode/agents/deep-research.md`; no sub-agents.
- Read state first. Research 3-5 focused actions, max 12 tool calls.
- Research source is read-only. A generator may be inspected or run only in a non-mutating check/dry-run mode; do not create a real sk-design manifest or alter fixtures.
- Write only the narrative, one append-only state iteration row, and the delta listed above.
- Include complete citations, ruled-out paths, novelty justification, and exact route proof.
- Required route proof in both iteration records: `mode: "research"`, `target_agent: "deep-research"`, `agent_definition_loaded: true`, `resolved_route: "Resolved route: mode=research target_agent=deep-research"`.

## OUTPUT CONTRACT
Produce and verify the narrative, exactly one canonical state append, and the delta file for iteration 2. Return the standard iteration completion report only.
