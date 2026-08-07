DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 5 of 10
Ratios: 0.90 -> 0.78 -> 0.64 -> 0.46 | Stuck count: 0
Convergence: CONTINUE; capability and authority evidence gaps remain.
Current provisional matrix: 003/006/013 need refinement; 004/005 and 007-012/014-017 still valid, many provisionally.
Next focus: current-runtime capability census for phases 006-012.

Research Topic: Revalidate packet 036 phases 003-017 against post-baseline commits with explicit verdict, commit SHA, and path:line evidence for every phase.
Iteration: 5 of 10
Focus Area: Inspect the current `.opencode/skills/system-deep-loop` runtime and map already-shipped event/ledger, receipts/effects, compatibility/shadow/rollback, durable fan-out/fan-in, novelty/claims/projections, and convergence/health capabilities onto phases 006-012. For each phase, decide whether overlap is absent, supporting/partial and requires refinement, or core-purpose-complete and invalidating.

## STATE FILES

- Config: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-strategy.md
- Prior matrix: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/iterations/iteration-004.md
- Phase specs: .opencode/specs/system-deep-loop/036-deep-loop-innovation/006-transition-authorized-ledger-core/spec.md through 012-shared-mode-contracts-and-fixtures/spec.md
- Narrative: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/iterations/iteration-005.md
- Delta: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deltas/iter-005.jsonl

## CONSTRAINTS

- LEAF agent, one iteration, no sub-agents.
- State-first; 3-5 focused actions, max 12 calls.
- Research files are read-only. Allowed writes only narrative, state append, delta for iteration 5.
- Use current symbols/modules/tests plus the commit that introduced each overlapping capability. Do not infer completion from filenames.
- Separate partial substrate that a phase can reuse from the phase's full acceptance contract.
- Reclassify a phase as `needs refinement` only when shipped overlap changes scope or starting assumptions. Use `invalidated` only if the full core purpose already shipped or is contradicted.
- Cite commit SHA and current path:line evidence for each of phases 006-012.

## OUTPUT CONTRACT

Write all three artifacts. Narrative must have a 7-row capability-overlap table for 006-012 and explicit verdict impact. Append one canonical iteration/run 5 record with exact route proof; include standard novelty, question, ruled-out, tool, source, timestamp, and duration fields. Delta first line must match. Do not add executor provenance; the workflow patches it.
