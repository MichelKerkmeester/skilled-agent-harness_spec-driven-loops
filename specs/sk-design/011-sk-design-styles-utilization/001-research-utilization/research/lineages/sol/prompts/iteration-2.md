DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 2 of 10
Questions: 0/5 answered | Last focus: corpus inventory and mode-contract mapping
Last 2 ratios: N/A -> 1.00 | Stuck count: 0
Resource map: resource-map.md not present; skipping coverage gate.
Memory context refresh: unavailable; use packet docs and direct repository evidence.
Next focus: Compare a layered retrieval design (committed manifest, deterministic filtering, lexical or semantic ranking, then mode-specific hydration) against static-index-only, query-store, and on-demand-grep alternatives using repository-native indexing patterns and measured corpus costs.

Research Topic: How should sk-design and its five modes index, retrieve, and consume the styles corpus while remaining distinctive, maintainable, and provenance-aware?
Iteration: 2 of 10
Focus Area: Retrieval substrate architecture and repository-native precedents.
Remaining Key Questions:
- Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance?
- What should the hub and each of the five modes consume, and when should a task reference one coherent real style versus synthesize selected attributes across several styles?
- Which anti-slop rules and proof gates keep outputs distinctive rather than averaging the corpus into a generic middle?
- What index build, query, refresh, validation, and corpus-change tooling is justified by the repository's existing patterns?
- How should utilization strategies rank by leverage versus build cost after accounting for size, staleness, licensing, provenance, and extraction fidelity risks?
Carried-Forward Open Questions: none yet.
Last 3 Iterations Summary: run 1: corpus inventory and mode mapping (1.00).
Pivot Lineage: none yet.
Saturated Directions: broad corpus counting and full-corpus context loading are ruled out; do not repeat them.

## STATE FILES

- Config: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-strategy.md
- Registry: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deltas/iter-002.jsonl

## CONSTRAINTS

- Execute exactly ONE research iteration as the `deep-research` LEAF agent; do not dispatch sub-agents.
- Read state first. Treat strategy, registry, and dashboard as reducer-owned read-only files.
- Perform 3-5 focused research actions within 12 tool calls.
- Inspect concrete repository indexing/query patterns and relevant sk-design contracts. Do not modify researched files.
- Compare at least these substrates: committed static manifest/index, queryable structured token store, on-demand grep over `DESIGN.md`, and a layered hybrid. Assess context size, determinism, freshness, query expressiveness, dependencies, and build cost.
- If evidence fully answers the first key question, put its exact text in `answeredQuestions`; otherwise leave it open and state the missing evidence.
- The only allowed writes are the iteration narrative, one append-only canonical iteration record, and the delta file above.
- Do not touch any path outside `.opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol`.
- Every finding requires a source citation or explicit inference marker.

## OUTPUT CONTRACT

Write the narrative with Focus, Actions Taken, Findings, Questions Answered, Questions Remaining, Sources Consulted, Assessment, Reflection, Dead Ends or Ruled Out, and Next Focus. Append exactly one canonical `type:"iteration"` state record with route proof, run/iteration 2, newInfoRatio, novelty justification, findings count, exact question text arrays, ruledOut, toolsUsed, sourcesQueried, timestamp, duration, and optional graphEvents. Create `deltas/iter-002.jsonl` with the identical iteration record first and structured evidence records after it.
