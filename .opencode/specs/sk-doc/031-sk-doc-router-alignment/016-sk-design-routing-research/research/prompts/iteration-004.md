DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE
STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 4 of 8
Questions: reducer reconciliation pending; state records claim three answered | Last focus: typed-gold scenario eligibility
Last 3 ratios: 1.00 -> 1.00 -> 1.00 | Stuck count: 0
Resource map final emission enabled; memory and graph accelerators unavailable.
Next focus: Attribute the approximately 69 CONDITIONAL baseline across benchmark dimensions, separating unmeasured typed-pair dimensions from actual routing faults.

Research Topic: Diagnose sk-design routing benchmark faults and measurement gaps.
Iteration: 4 of 8
Focus Area: Fresh benchmark execution and per-dimension loss attribution.
Remaining Key Questions: baseline attribution; dependency-ordered optimization plan.
Last 3 Iterations Summary: mode/leaf classification; manifest feasibility; scenario typed-gold partition.
Saturated Directions: do not modify sources, fixtures, manifests, or gold; do not infer score drivers from aggregate alone.

## STATE FILES
- Config: .opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/deep-research-config.json
- State Log: .opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/deep-research-strategy.md
- Registry: .opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/findings-registry.json
- Iteration narrative: .opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/iterations/iteration-004.md
- Delta: .opencode/specs/sk-doc/031-sk-doc-router-alignment/016-sk-design-routing-research/research/deltas/iter-004.jsonl

## CONSTRAINTS
- Exactly one `deep-research` LEAF iteration; load `.opencode/agents/deep-research.md`; no sub-agents.
- State-first. Use 3-5 bounded evidence actions, max 12 calls.
- Running existing read-only benchmark/check commands is allowed. Do not update snapshots, baselines, fixtures, gold, manifests, or source.
- Capture actual command/result evidence and distinguish unavailable/unmeasured dimensions from scored failures.
- Write only the iteration narrative, one canonical state append, and one delta file listed above.
- Include citations, command evidence, ruled-out directions, novelty justification, and exact route proof in state and delta.
- Route proof: `mode: "research"`, `target_agent: "deep-research"`, `agent_definition_loaded: true`, `resolved_route: "Resolved route: mode=research target_agent=deep-research"`.

## OUTPUT CONTRACT
Produce and verify all three iteration-004 artifacts. Return only the standard iteration completion report.
