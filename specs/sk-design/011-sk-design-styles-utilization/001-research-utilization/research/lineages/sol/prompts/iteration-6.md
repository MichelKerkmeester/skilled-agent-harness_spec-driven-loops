DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 6 of 10
Questions: 2/5 answered | Last focus: anti-slop proof gate
Last 2 ratios: 0.85 -> 0.93 | Stuck count: 0
Next focus: Specify a minimal repository-native build/query/refresh/validation toolchain: canonical generated manifest, optional disposable lexical projection, incremental hash invalidation, check mode, mode-aware query output, stale-index fallback, and proof-gate fixtures.

Research Topic: Tooling and lifecycle for sk-design style retrieval.
Iteration: 6 of 10
Focus Area: Index build, query, refresh, validation, and corpus-change handling.
Remaining Key Questions:
- Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance?
- What index build, query, refresh, validation, and corpus-change tooling is justified by the repository's existing patterns?
- How should utilization strategies rank by leverage versus build cost after accounting for size, staleness, licensing, provenance, and extraction fidelity risks?
Answered: per-mode consumption; anti-slop proof gate.
Last 3 Iterations Summary: run 3 relevance ablation (0.83); run 4 consumption (0.85); run 5 anti-slop gate (0.93).
Saturated Directions: hand-maintained index, DB as source of truth, semantic-only ranking, and silent stale-index use are ruled out.

## STATE FILES

- Config: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-strategy.md
- Registry: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-006.md
- Write per-iteration delta file to: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deltas/iter-006.jsonl

## CONSTRAINTS

- Execute one LEAF iteration with no delegation; read state first.
- Write only the three iteration artifacts inside the lineage. Researched and reducer-owned files are read-only.
- Use 3-5 focused actions, maximum 12 tool calls.
- Ground every tooling recommendation in actual repository generator/check/index/freshness patterns and the existing styles capture harness. Prefer the smallest build that can satisfy the evidence.
- Define inputs, generated outputs, source-of-truth boundary, deterministic schema, content/generation hashes, incremental rebuild behavior, quiescence or atomic publish, query API/CLI result shape, optional FTS projection, stale/unavailable fallback, validation fixtures, and CI/check cadence.
- Include rough implementation effort by component and identify what should be deferred.
- Show how each mode asks for candidate cards and hydration without embedding per-mode taste logic in the hub or query engine.
- If the tooling key question is fully answered, include its exact full text in `answeredQuestions`.
- Cite every finding and rule out unjustified complexity.

## OUTPUT CONTRACT

Write `iteration-006.md`, append exactly one canonical route-proven iteration-6 state record, and create matching `deltas/iter-006.jsonl` with the identical iteration record first. Include exact question arrays, honest novelty, structured recommendations, cost evidence, ruled-out directions, sources, and next focus.
