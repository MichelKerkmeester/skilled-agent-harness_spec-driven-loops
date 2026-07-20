DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 4 of 10
Questions: 0/5 formally resolved | Ratios: 0.90 -> 0.78 -> 0.64
Convergence: CONTINUE; rolling average remains above 0.05 and verdict coverage is incomplete.
Completed: phase 003 controls/dependency, first-order census 004-017, clean control phase 004, mode taxonomy, and phase 005 capability premise.
Next focus: Build the explicit phase-by-phase verdict matrix for 003-017 from iterations 1-3 and isolate unsupported second-order verdicts.

Research Topic: Revalidate packet 036 phases 003-017 against `0ce43ff589..HEAD`, with explicit verdict, commit SHA, and path:line evidence for every phase.
Iteration: 4 of 10
Focus Area: Produce a complete provisional 15-row verdict matrix for phases 003-017 by reconciling iterations 1-3 with each phase's current purpose. Every row must say `still valid`, `needs refinement`, or `invalidated`, cite a post-baseline commit or the verified no-drift comparison commit, and cite current path:line evidence. Flag the smallest unresolved second-order evidence gap for each low-confidence row.

## STATE FILES

- Config: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-strategy.md
- Registry: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/findings-registry.json
- Prior narratives: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/iterations/iteration-001.md through iteration-003.md
- Phase specs: .opencode/specs/system-deep-loop/036-deep-loop-innovation/003-baseline-taxonomy-and-state-census/spec.md through 017-integrate-latest-and-closeout/spec.md
- Narrative: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/iterations/iteration-004.md
- Delta: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deltas/iter-004.jsonl

## CONSTRAINTS

- LEAF agent, one iteration, no sub-agents.
- Read state first. Use 3-5 focused actions, max 12 calls.
- Research surface read-only. Allowed writes only narrative, state append, and delta for iteration 4.
- No phase may be omitted or labeled unknown. A provisional verdict is allowed only if its remaining evidence gap is explicit.
- Do not convert absence of first-order drift into proof that a phase premise is still valid; identify second-order gaps separately.
- `invalidated` requires the phase's core purpose to be obsolete or contradicted, not merely stale paths or partial overlap.
- Preserve phase 004 as the clean negative control unless contrary evidence is found.

## OUTPUT CONTRACT

Write all three artifacts. The narrative must contain a 15-row phase table plus separate First-Order Drift, Second-Order Drift, and Evidence Gaps sections. Append exactly one canonical iteration/run 4 record with route proof exactly `Resolved route: mode=research target_agent=deep-research`; include findings count, novelty justification, questions, ruled-out directions, tools, sources, timestamp, and duration. Delta first line must match. Do not add executor provenance; the workflow patches it.
