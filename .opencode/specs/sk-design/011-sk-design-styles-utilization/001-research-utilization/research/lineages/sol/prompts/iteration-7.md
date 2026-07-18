DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 7 of 10
Questions: 3/5 answered | Last focus: build/query/refresh tooling
Last 2 ratios: 0.93 -> 0.93 | Stuck count: 0
Next focus: Rank the utilization strategies by leverage, build/operating cost, and risk, with a corpus-wide provenance/license/fidelity analysis and explicit ship-now, validate-next, and defer decisions.

Research Topic: Ranked utilization strategies and corpus risks.
Iteration: 7 of 10
Focus Area: Leverage-versus-cost ranking, provenance, licensing, staleness, size, and extraction fidelity.
Remaining Key Questions:
- Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance?
- How should utilization strategies rank by leverage versus build cost after accounting for size, staleness, licensing, provenance, and extraction fidelity risks?
Answered: per-mode consumption; anti-slop proof gate; tooling lifecycle.
Last 3 Iterations Summary: run 4 consumption (0.85); run 5 anti-slop (0.93); run 6 tooling (0.93).
Saturated Directions: do not revive hand-maintained indexes, canonical databases, unbounded synthesis, or semantic-only ranking.

## STATE FILES

- Config: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-strategy.md
- Registry: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-007.md
- Write per-iteration delta file to: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deltas/iter-007.jsonl

## CONSTRAINTS

- Execute one LEAF iteration, no delegation. Read state first.
- Write only the three iteration artifacts within the lineage; all source and reducer files are read-only.
- Use 3-5 focused actions and at most 12 tool calls.
- Rank concrete strategies, not abstract principles. Score leverage, initial build cost, recurring cost, distinctiveness benefit, mode coverage, dependency burden, staleness exposure, provenance/license exposure, and reversibility. Give rough engineer-day ranges grounded in iteration-6 component evidence.
- Separate a minimum viable utilization layer from optional accelerators and evaluation infrastructure. Identify sequencing dependencies.
- Inspect corpus-wide provenance/source metadata patterns and extraction confidence/version fields where feasible. Distinguish confirmed metadata absence from legal conclusions that cannot be inferred.
- State policy controls for unknown license/allowed-use, copying risk, source attribution, screenshot/source URLs, stale captures, extraction confidence, malformed tokens, and moving corpus generations.
- Include at least one strategy that is intentionally rejected and why.
- If the risk/ranking key question is fully evidence-backed, include its exact full text in `answeredQuestions`.
- Cite every finding and keep legal claims qualified.

## OUTPUT CONTRACT

Write `iteration-007.md`, append exactly one canonical route-proven iteration-7 record, and create matching `deltas/iter-007.jsonl` with the identical iteration record first. Include a ranked table with costs/risks, exact question arrays, novelty, sources, ruled-out directions, and next focus.
