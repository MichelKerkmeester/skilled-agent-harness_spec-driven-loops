DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 1 of 20

STATE SUMMARY: Segment 1. No prior iterations. Convergence is telemetry only; max-iterations policy requires all 20 passes.

Research Topic: Doctrine and completeness-check study of graph-engineering-master, grounded in the orientation seed, studies 1-3, the complete documentary teaching package, all 12 blog posts, the system-deep-loop runtime, and the 036 authority plane.

Focus Area: Establish the orientation baseline and inventory studies 1-3. Extract their accepted design claims, unresolved gaps, and comparison vocabulary before testing GEM doctrine against them.

Read these state files first:
- Config: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/deep-research-config.json
- State log: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/deep-research-state.jsonl
- Strategy: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/deep-research-strategy.md
- Registry: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/findings-registry.json

Required outputs:
- Narrative: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/iterations/iteration-001.md
- Append one canonical iteration record to: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/deep-research-state.jsonl
- Delta: specs/system-deep-loop/037-graph-engineering/004-graph-engineering-master/research/lineages/gem-sol-high/deltas/iter-001.jsonl

Constraints:
- You are the deep-research LEAF agent for exactly one iteration. Do not dispatch sub-agents or run nested loops.
- Perform 3-5 focused research actions, max 12 tool calls.
- Read-only research surface. Write only the three required output paths above.
- Every finding carries `[SOURCE: file:line]` or `[INFERENCE: ...]`.
- Distinguish TEXT-CLAIMED doctrine from inference. Do not invent code mechanisms.
- Frame implications as confirm, refine, extend, or contradict.
- Include headings: Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Ruled Out, Edge Cases, Sources Consulted, Assessment, Reflection, Recommended Next Focus.
- JSONL record requires: `type:"iteration"`, `iteration:1`, `mode:"research"`, `target_agent:"deep-research"`, `agent_definition_loaded:true`, `resolved_route:"Resolved route: mode=research target_agent=deep-research"`, `newInfoRatio`, `noveltyJustification`, `status`, `focus`, and optional valid graphEvents.
- Write the same canonical iteration record as the first line of the delta file, followed by structured finding/invariant/ruled_out records.
- Do not modify strategy, registry, dashboard, research.md, source documents, runtime, or any path outside the bound lineage directory.
