DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## State

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 10
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: unavailable; use local packet and repository evidence.
Next focus: Map all seven workflow modes to their owning child packets and current flat leaf-resource paths, then express the implied typed-pair surface.

Research Topic: Diagnose system-deep-loop skill routing and derive packet-qualified typed-pair optimizations for its seven workflow modes across five child packets, including benchmark scoring, scenario classification, and concrete routing-config changes.
Iteration: 1 of 10
Focus Area: Map all seven workflow modes to their owning child packets and current flat leaf-resource paths, then express the implied typed-pair surface.
Remaining Key Questions:
- How do the seven workflow modes currently route across the five child packets, and what typed pairs do they imply?
- Which flat child-relative leaf IDs collide, and what packet-qualified coordinate scheme removes ambiguity?
- How does the skill-benchmark discover, validate, and score routing gold and typed pairs?
- Which of the roughly 319 scenarios are genuine routing decisions, and which must remain outside typed-gold scoring?
- What dependency-ordered configuration and router changes can raise the routing score without weakening fallback behavior?
Carried-Forward Open Questions: none yet.
Last 3 Iterations Summary: none yet.
Pivot Lineage: none yet.
Saturated Directions: none yet.

## State Files

All paths are relative to the repo root.

- Config: .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/deep-research-config.json
- State Log: .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/deep-research-strategy.md
- Registry: .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/sk-doc/031-sk-doc-router-alignment/018-system-deep-loop-routing-research/research/deltas/iter-001.jsonl

## Constraints

- Execute exactly one research iteration as the `deep-research` LEAF agent. Do not dispatch sub-agents.
- Read config, state log, strategy, and registry before research.
- Target 3-5 focused research actions and stay within 12 tool calls.
- Research target files are read-only. Do not implement fixes.
- The only allowed writes are the iteration narrative, one append-only canonical iteration record in the state log, and the per-iteration delta listed above.
- Treat strategy, registry, dashboard, config, and researched source files as read-only.
- Every finding needs a file-and-line source or an explicit inference marker.
- Document dead ends, ambiguity, contradictions, missing dependencies, partial success, and a recommended next focus.

## Output Contract

Produce all three required artifacts:

1. `iterations/iteration-001.md` with Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Ruled Out/Dead Ends, Sources Consulted, Assessment, Reflection, and Next Focus.
2. Append exactly one canonical single-line iteration record to the state log. It must include `type:"iteration"`, `iteration:1`, `run:1`, `mode:"research"`, `target_agent:"deep-research"`, `agent_definition_loaded:true`, `resolved_route:"Resolved route: mode=research target_agent=deep-research"`, `status`, `focus`, `findingsCount`, `newInfoRatio`, `noveltyJustification`, `keyQuestions`, `answeredQuestions`, `ruledOut`, `toolsUsed`, `sourcesQueried`, `timestamp`, `durationMs`, and valid optional `graphEvents`.
3. Create `deltas/iter-001.jsonl`; its first row must be the same canonical iteration record, followed by structured finding, source, edge, invariant, observation, or ruled-out rows.

Verify all three artifacts and route-proof fields before returning. The workflow reducer, not this leaf, will update strategy, registry, dashboard, synthesis, convergence, and memory state.
