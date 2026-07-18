DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 1 of 10
Questions: 0/5 answered | Last focus: none yet
Last 2 ratios: N/A -> N/A | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: unavailable; use packet docs and direct repository evidence.
Next focus: Inventory the corpus shape and quantify representative token/document characteristics, then map those facts to the sk-design hub and mode contracts before judging retrieval substrates.

Research Topic: How should the sk-design skill and its five nested modes (interface, foundations, motion, audit, md-generator) smartly index, retrieve, and consume the ~1,290-style design-token library at .opencode/skills/sk-design/styles/? Investigate retrieval substrate, per-mode consumption and one-style-versus-synthesis rules, anti-slop discipline, build/refresh tooling, size/staleness/license/provenance risks, and ranked leverage-versus-cost strategies.
Iteration: 1 of 10
Focus Area: Inventory the corpus shape and quantify representative token/document characteristics, then map those facts to the sk-design hub and mode contracts before judging retrieval substrates.
Remaining Key Questions:
- Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance?
- What should the hub and each of the five modes consume, and when should a task reference one coherent real style versus synthesize selected attributes across several styles?
- Which anti-slop rules and proof gates keep outputs distinctive rather than averaging the corpus into a generic middle?
- What index build, query, refresh, validation, and corpus-change tooling is justified by the repository's existing patterns?
- How should utilization strategies rank by leverage versus build cost after accounting for size, staleness, licensing, provenance, and extraction fidelity risks?
Carried-Forward Open Questions: none yet.
Last 3 Iterations Summary: none yet.
Pivot Lineage: none yet.
Saturated Directions: none yet.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-strategy.md
- Registry: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deltas/iter-001.jsonl

## CONSTRAINTS

- Execute exactly ONE research iteration as the `deep-research` LEAF agent. Do not dispatch sub-agents.
- Read config, state log, strategy, and registry before research.
- Target 3-5 focused research actions and stay within 12 tool calls.
- Read the sk-design contracts and styles corpus as evidence. Do not modify them.
- The only allowed writes are the iteration narrative, one append-only canonical iteration record in the state log, and the per-iteration delta file named above.
- Do not create, modify, delete, rename, stage, or otherwise touch any path outside `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol`.
- Treat reducer-owned strategy, registry, and dashboard files as read-only.
- Every finding requires `[SOURCE: file:line]` or an explicit `[INFERENCE: ...]` marker.

## OUTPUT CONTRACT

Produce all three required artifacts. The canonical state-log and delta iteration record must include:

```json
{"type":"iteration","iteration":1,"run":1,"mode":"research","target_agent":"deep-research","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=research target_agent=deep-research","newInfoRatio":0.0,"status":"complete","focus":"...","findingsCount":0,"noveltyJustification":"...","keyQuestions":[],"answeredQuestions":[],"ruledOut":[],"toolsUsed":[],"sourcesQueried":[],"timestamp":"ISO-8601","durationMs":0,"graphEvents":[]}
```

The narrative must include Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Sources Consulted, Assessment, Reflection, Dead Ends or Ruled Out, and Next Focus. The delta file's first line must be the same canonical iteration record; add structured finding/source/ruled_out records after it.
