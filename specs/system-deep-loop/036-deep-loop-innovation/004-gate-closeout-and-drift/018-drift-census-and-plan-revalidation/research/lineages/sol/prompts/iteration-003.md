DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 3 of 10
Questions: 0/5 formally resolved | Last focus: first-order census and clean control
Last 2 ratios: 0.90 -> 0.78 | Stuck count: 0
Resolved evidence: phase 004 is the clean first-order negative control. Do not repeat that search.
Next focus: second-order premise drift in phase 013 taxonomy and phase 005 live-tools capability.

Research Topic: Revalidate packet 036 phases 003-017 against `0ce43ff589..HEAD`, separating first-order path drift from second-order premise drift and producing an explicit evidence-backed verdict for every phase.
Iteration: 3 of 10
Focus Area: Resolve the registered-mode/workstream taxonomy assumed by phase 013 and test whether phase 005's planned live-tools capability already shipped. Independently inspect commits `6cd8ab14e4e`, `708d25acf04`, and `908efde8d8f`, current mode registries/defaultMode routing, and current `fanout-run.cjs` behavior.
Remaining Key Questions:
- Which phase premises are now false because registered-mode counts, routing defaults, taxonomy, or planned capabilities changed or already shipped?
- What is the explicit verdict for each phase 003-010, with commit SHA and path:line evidence?
- What is the explicit verdict for each phase 011-017, including at least one genuinely clean negative control, with commit SHA and path:line evidence?

## STATE FILES

- Config: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-strategy.md
- Registry: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/findings-registry.json
- Prior iterations: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/iterations/iteration-001.md and iteration-002.md
- Narrative: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/iterations/iteration-003.md
- Delta: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deltas/iter-003.jsonl

## CONSTRAINTS

- LEAF agent, one iteration, no sub-agents or nested loops.
- State-first. Perform 3-5 focused actions, max 12 tool calls.
- Research surfaces are read-only. Allowed writes are only narrative, state append, and delta for iteration 3.
- Separate public registered workflow modes, implementation workflow families, benchmark variants, and phase 013's eight research workstreams. Do not infer counts from labels alone; inspect registries and the named commits.
- For phase 005, distinguish partial supporting infrastructure from the exact requested top-level web-search propagation capability.
- Every claim needs commit SHA and current `path:line` evidence.

## OUTPUT CONTRACT

Write all three required artifacts. Append exactly one canonical iteration/run 3 record with route proof exactly `Resolved route: mode=research target_agent=deep-research`; include findings count, novelty justification, questions, ruled-out directions, tools, sources, timestamp, and duration. The delta first line must be the same JSON data. Do not add executor provenance; the workflow patches it after return. Verify before responding.
