DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Segment: 1 | Iteration: 7 of 10
Ratios: 0.90 -> 0.78 -> 0.64 -> 0.46 -> 0.34 -> 0.27
Convergence: CONTINUE; final matrix reconciliation and formal question closure remain.
Current final refinement set: 003, 006, 007, 010, 011, 012, 013, 016. Still valid: 004, 005, 008, 009, 014, 015, 017. Invalidated: none. Clean control: 004.
Next focus: convergence-ready final 15-row matrix.

Research Topic: Revalidate packet 036 phases 003-017 against `0ce43ff589..HEAD`, with no unknown phase and explicit verdict, commit SHA, path:line evidence, first-order/second-order classification, positive controls, negative control, packet-033 dependency, and mode-count resolution.
Iteration: 7 of 10
Focus Area: Reconcile iterations 1-6 into one final evidence table for all phases 003-017. Verify internal consistency, current HEAD and baseline-to-HEAD commit count, non-runtime commit triage method, refinement reasons, and source diversity. This is the convergence candidate.

## FORMAL KEY QUESTIONS

The canonical iteration record's `answeredQuestions` array MUST include these five strings exactly when the narrative evidence supports closure:

1. `Which paths, files, globs, symbols, and dependencies named by phases 003-017 no longer resolve, including phase 003's required positive controls?`
2. `Which phase premises are now false because registered-mode counts, routing defaults, taxonomy, or planned capabilities changed or already shipped?`
3. `Does the packet-033 benchmark dependency survive its renumber, and what exact benchmark location should phases 003 and 016 use now?`
4. `What is the explicit verdict for each phase 003-010, with commit SHA and path:line evidence?`
5. `What is the explicit verdict for each phase 011-017, including at least one genuinely clean negative control, with commit SHA and path:line evidence?`

## STATE FILES

- Config: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-config.json
- State Log: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-state.jsonl
- Strategy: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-strategy.md
- Prior evidence: iterations/iteration-001.md through iteration-006.md under this lineage
- Narrative: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/iterations/iteration-007.md
- Delta: .opencode/specs/system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation/research/lineages/sol/deltas/iter-007.jsonl

## CONSTRAINTS

- LEAF agent, one iteration, no sub-agents.
- State-first; 3-5 focused verification/reconciliation actions, max 12 calls.
- Research surface read-only. Allowed writes only narrative, state append, delta for iteration 7.
- All 15 phases must have one final verdict from the allowed enum. No unknown/provisional labels.
- Every row must include a commit SHA and current path:line citation. Clean rows must name surfaces checked and use the comparison HEAD plus relevant rename/history evidence.
- Separate first-order drift from second-order premise drift in dedicated columns.
- State the live commit count if it differs from the prompt's original 204 due to moving HEAD; do not force stale numbers.
- Explicitly resolve the three named mode-routing commits and packet-033 renumber.
- Source diversity gate: use phase docs plus current runtime/registry/benchmark/history evidence; do not rely on a single source class.

## OUTPUT CONTRACT

Write all three artifacts. Narrative must include: scope/count triage, 15-row final matrix, positive controls, negative control, packet-033 dependency, mode-count resolution, eliminated alternatives, and convergence assessment. Append one canonical iteration/run 7 record with exact route proof, all five exact formal questions in `answeredQuestions`, and standard metadata. Delta first line must match. Do not add executor provenance; workflow patches it.
