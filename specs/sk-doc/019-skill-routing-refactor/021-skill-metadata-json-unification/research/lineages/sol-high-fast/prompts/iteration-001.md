DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 1

## STATE
Segment: 1 | Iteration: 1 of 10
Questions: 0/5 answered | Last focus: none
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: absent; derive inventory from repository evidence.
Next focus: Build the exact 12-skill by eight-file root-level presence census and identify producer evidence for each file type.

Research Topic: Root-level skill metadata JSON contract for `.opencode/skills/` across all 12 skills.

## STATE FILES
- Config: `.opencode/specs/sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification/research/lineages/sol-high-fast/deep-research-config.json`
- State Log: `.opencode/specs/sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification/research/lineages/sol-high-fast/deep-research-state.jsonl`
- Strategy: `.opencode/specs/sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification/research/lineages/sol-high-fast/deep-research-strategy.md`
- Registry: `.opencode/specs/sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification/research/lineages/sol-high-fast/findings-registry.json`
- Write narrative: `.opencode/specs/sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification/research/lineages/sol-high-fast/iterations/iteration-001.md`
- Write delta: `.opencode/specs/sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification/research/lineages/sol-high-fast/deltas/iter-001.jsonl`

## FOCUS
Produce an exact root-level presence matrix for the eight named file types across the 12 actual skill roots. Identify the evidence that distinguishes hand-authored from generated files and name producer scripts or authoring templates where found. Stay at skill roots; nested packet/mode files may be cited only as producer/consumer evidence, never counted as fleet root metadata.

## CONSTRAINTS
- Read config, state log, and strategy first.
- You are the LEAF agent for exactly one iteration. Do not dispatch sub-agents.
- Perform 3-5 focused research actions, max 12 tool calls.
- Report findings only; do not implement fixes.
- Every finding needs `[SOURCE: file:line]` or an explicit inference marker.
- Treat researched files as read-only.
- The only write targets are the narrative, append-only state log, and delta paths above.
- Do not edit config, strategy, registry, dashboard, source files, or any path outside the detached lineage.
- Do not use destructive or Git operations.

## OUTPUT CONTRACT
Create the narrative, append exactly one canonical iteration record to the state log, and create the delta file. Both iteration records must include:
`"type":"iteration"`, `"iteration":1`, `"run":1`, `"mode":"research"`, `"target_agent":"deep-research"`, `"agent_definition_loaded":true`, `"resolved_route":"Resolved route: mode=research target_agent=deep-research"`, `newInfoRatio`, `noveltyJustification`, `status`, `focus`, `findingsCount`, `keyQuestions`, `answeredQuestions`, `ruledOut`, `toolsUsed`, `sourcesQueried`, `timestamp`, and `durationMs`.

The narrative must contain Focus, Actions Taken, Findings, Ruled Out, Dead Ends, Sources Consulted, Assessment, Reflection, Questions Answered, Questions Remaining, and Recommended Next Focus.
