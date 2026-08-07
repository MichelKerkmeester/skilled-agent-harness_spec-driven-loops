DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 3 of 10
Questions: 0/5 answered | Last focus: retrieval substrate architecture
Last 2 ratios: 1.00 -> 0.93 | Stuck count: 0
Resource map: absent at init.
Memory context refresh: unavailable; use packet and repository evidence.
Next focus: Run a bounded relevance ablation on one pinned corpus snapshot: define mode-specific queries with expected evidence, compare compact deterministic filters and BM25 at top K, evaluate optional semantic value only if available, and measure hydrated context bytes.

Research Topic: Smart retrieval and mode-specific consumption of the sk-design styles corpus.
Iteration: 3 of 10
Focus Area: Relevance and context-cost validation for the proposed layered substrate.
Remaining Key Questions:
- Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance?
- What should the hub and each of the five modes consume, and when should a task reference one coherent real style versus synthesize selected attributes across several styles?
- Which anti-slop rules and proof gates keep outputs distinctive rather than averaging the corpus into a generic middle?
- What index build, query, refresh, validation, and corpus-change tooling is justified by the repository's existing patterns?
- How should utilization strategies rank by leverage versus build cost after accounting for size, staleness, licensing, provenance, and extraction fidelity risks?
Carried-Forward Open Questions: substrate choice lacks labeled top-K relevance evidence.
Last 3 Iterations Summary: run 1 corpus baseline (1.00); run 2 substrate comparison (0.93).
Pivot Lineage: none.
Saturated Directions: static-only final ranking, database-as-canonical-truth, semantic-only ranking, and broad grep as default are ruled out.

## STATE FILES

- Config: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-strategy.md
- Registry: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-003.md
- Write per-iteration delta file to: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deltas/iter-003.jsonl

## CONSTRAINTS

- Execute exactly one LEAF iteration; no sub-agents.
- Read state first; reducer-owned files are read-only.
- Use 3-5 focused actions and at most 12 tool calls.
- Pin one read-only snapshot for all comparisons; do not repeat broad inventory except to identify the pinned generation.
- Create a small mode-representative query set and explicit expected-evidence rubric. Compare deterministic metadata/filtering and BM25 top-K; assess semantic reranking only from available verified infrastructure/evidence, never fabricate a run.
- Measure candidate-card and selected-hydration context bytes. Explain what the ablation can and cannot prove.
- If the first key question is now evidence-backed, include its exact full text in `answeredQuestions`; otherwise name the smallest remaining proof.
- Only write the three required artifacts inside the lineage directory. Touch no other path.
- Cite every finding.

## OUTPUT CONTRACT

Write the required narrative, append exactly one canonical route-proven `type:"iteration"` record for iteration 3, and create the matching delta file with the identical iteration record first. Include exact question texts in question arrays, honest novelty math, sources, ruled-out directions, and a specific next focus.
