DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 8 of 10
Questions: 4/5 answered | Last focus: strategy ranking and corpus risks
Last 2 ratios: 0.93 -> 0.85 | Stuck count: 0
Next focus: Close the substrate question with a generation-bound, human-auditable holdout containing known positives and hard negatives for the weak prior modes; compare deterministic eligibility and BM25 top K, quantify context/cost, and decide whether semantic reranking is required, optional, or unjustified.

Research Topic: Final evidence for the sk-design style retrieval substrate.
Iteration: 8 of 10
Focus Area: Human-auditable relevance holdout and substrate decision closure.
Remaining Key Question:
- Which retrieval substrate, or layered combination of substrates, best balances relevance, determinism, runtime cost, context size, and maintenance?
Answered: per-mode consumption; anti-slop proof gate; tooling lifecycle; leverage/cost/risk ranking.
Last 3 Iterations Summary: run 5 anti-slop (0.93); run 6 tooling (0.93); run 7 strategy/risk ranking (0.85).
Saturated Directions: mechanical substring labels as final gold standard, semantic-only ranking, static-only final ranking, database-as-source-of-truth, and broad grep as default are ruled out.

## STATE FILES

- Config: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deep-research-strategy.md
- Registry: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/findings-registry.json
- Write iteration narrative to: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/iterations/iteration-008.md
- Write per-iteration delta file to: .opencode/specs/sk-design/011-sk-design-styles-utilization/001-research-utilization/research/lineages/sol/deltas/iter-008.jsonl

## CONSTRAINTS

- Execute exactly one LEAF iteration; no delegation. Read state before research.
- Write only the three iteration artifacts in this lineage. All source and reducer files are read-only.
- Use 3-5 focused actions, maximum 12 tool calls.
- Pin one stable snapshot/generation. Build a small human-auditable holdout with manually inspected known positives and hard negatives for foundations, motion, and md-generator, the modes whose prior mechanical labels were zero or near-universal. Reuse prior interface/audit evidence rather than repeating it unless needed for comparison.
- Compare deterministic eligibility/filter ranking and BM25 top-K against those labels. Report top-K precision/recall or another transparent metric, context bytes, latency/build cost, and failure behavior. Do not create a persistent index.
- Semantic reranking is not mandatory evidence if no generation-bound semantic index exists. Decide from evidence whether it is required for the baseline, an optional later ablation, or unjustified; never fabricate semantic lift.
- Select a concrete baseline substrate and fallback. Separate confirmed facts, engineering judgment, and remaining non-blocking uncertainty.
- If the remaining key question is fully answered, include its exact text in `answeredQuestions` so the reducer can authorize legal convergence.
- Cite every finding.

## OUTPUT CONTRACT

Write `iteration-008.md`, append one canonical route-proven iteration-8 state record, and create matching `deltas/iter-008.jsonl` with the identical record first. Include the holdout, results, final substrate verdict, exact question arrays, novelty, sources, ruled-out directions, and next focus or legal-stop recommendation.
