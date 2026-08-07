DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 4 of 10
Questions: 0/5 answered | Last focus: retrieval relevance ablation
Last 2 ratios: 0.93 -> 0.83 | Stuck count: 0
Next focus: Define the mode-by-mode consumption contract and a decision procedure for one coherent reference versus bounded multi-style synthesis, using existing mode authority boundaries, measured hydration costs, and contrasting corpus examples.

Research Topic: Smart, distinctive consumption of the sk-design styles corpus.
Iteration: 4 of 10
Focus Area: Per-mode consumption and coherent-reference versus bounded-synthesis rules.
Remaining Key Questions:
- Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance?
- What should the hub and each of the five modes consume, and when should a task reference one coherent real style versus synthesize selected attributes across several styles?
- Which anti-slop rules and proof gates keep outputs distinctive rather than averaging the corpus into a generic middle?
- What index build, query, refresh, validation, and corpus-change tooling is justified by the repository's existing patterns?
- How should utilization strategies rank by leverage versus build cost after accounting for size, staleness, licensing, provenance, and extraction fidelity risks?
Last 3 Iterations Summary: run 1 corpus baseline (1.00); run 2 substrate comparison (0.93); run 3 relevance/context ablation (0.83).
Saturated Directions: universal payloads, full-corpus hydration, and mode flattening are ruled out.

## STATE FILES

- Config: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-strategy.md
- Registry: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-004.md
- Write per-iteration delta file to: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deltas/iter-004.jsonl

## CONSTRAINTS

- Execute one LEAF iteration; no delegation. Read state before research.
- Treat researched files and reducer-owned files as read-only. Write only the three iteration artifacts inside this lineage.
- Use 3-5 focused actions and no more than 12 tool calls.
- Cover the hub plus interface, foundations, motion, audit, and md-generator separately. State exactly which artifact class and slice each consumes, how many candidate cards or hydrated references it should receive, and what it must never treat as authority.
- Produce a deterministic decision procedure for ONE coherent reference versus synthesis across multiple styles. Include allowed synthesis dimensions, source caps, coherence locks, provenance handling, and cases where synthesis must be refused.
- Validate the rules against at least two contrasting real corpus styles and existing mode/hub contracts; do not average token values.
- If the second key question is fully evidence-backed, include its exact full text in `answeredQuestions`.
- Cite every finding and preserve unresolved uncertainty.

## OUTPUT CONTRACT

Create `iteration-004.md`, append exactly one canonical route-proven iteration-4 record to the state log, and create `deltas/iter-004.jsonl` whose first record is identical. Include exact question text arrays, novelty math, structured findings, ruled-out directions, sources, and a concrete next focus.
