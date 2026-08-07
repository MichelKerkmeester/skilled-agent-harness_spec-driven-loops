DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

Segment: 1 | Iteration: 5 of 5
Evidence-complete focuses: Q1 through Q4.
Last 3 ratios: 1.00 -> 1.00 -> 1.00 | Stuck count: 0
Resource map: not present; coverage gate skipped.
Next focus: Q5 — minimum sequenced work and dependency split.

Research Topic: Decide the best next move for the compiled-routing subsystem.
Iteration: 5 of 5
Focus Area: Produce the minimum ordered work for reproducibility, self-reporting, and unattended safety, separating work safe before the concurrent `sk-design` restructure ends from work that must wait.
Remaining Key Question: Q5.
Carried-Forward Open Questions: reconcile the present checkout's resolver failures with the verified baseline, preserve justified publication safety, and avoid expanding into implementation.
Last Iterations Summary: derived source-authoritative/runtime-mirror ownership; live-input re-entry explains current failures; CI is the authoritative freshness gate with narrow exceptions; retain staging plus bounded rollback.
Pivot Lineage: none.
Saturated Directions: do not re-argue prior decisions; use them as constraints for the sequence.

## STATE FILES

- Config: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-config.json`
- State Log: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-state.jsonl`
- Strategy: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-strategy.md`
- Registry: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/findings-registry.json`
- Write narrative: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/iterations/iteration-005.md`
- Write delta: `.opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deltas/iter-005.jsonl`

## CONSTRAINTS

- Execute exactly one LEAF research iteration and do not dispatch sub-agents.
- Give a minimum sequence, explicit dependencies, rollback/escape points, and a safe-now versus wait-for-`sk-design` split.
- Separate confirmed evidence from inference and unverified historical claims.
- Research only. Do not implement fixes.
- Write only the narrative, one append-only canonical state record, and the delta file.
- In the canonical iteration record, include the exact full text of all five strategy questions in `answeredQuestions` when the accumulated evidence supports them, so the reducer can close coverage.
- Use exact file-and-line citations and explicitly mark unverified claims.
- Include route-proof fields required by the deep-research output contract.
