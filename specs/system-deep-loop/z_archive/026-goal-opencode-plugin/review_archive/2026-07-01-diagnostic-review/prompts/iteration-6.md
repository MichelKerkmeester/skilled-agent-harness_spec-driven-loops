DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## Context

LEAF deep-review iteration agent, iteration 6 of 10, DIAGNOSTIC-ONLY (stop_policy=max-iterations -- keep broadening, do not converge before iteration 10). Read before writing:
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/deep-review-strategy.md` in FULL
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/iterations/iteration-5.md` in full (D4-P0-001: `deriveStatus` in graph-metadata-parser.ts declares a folder `complete` on file-presence alone -- implementation-summary.md present + no checklist.md -- with no check of `completion_pct`/open tasks; 213 folders repo-wide are ALREADY corrupted on-disk today with a false `complete` status; 363 total mislabeled by the heuristic)

Iteration 5 escalated a genuine repo-wide P0 tooling finding as an unplanned but legitimate broadening of D4. Your job this iteration is NOT a new custom dimension -- all 4 (D1-D4) already have first-pass coverage plus D4's own escalation. This is a deepening/consumer-impact pass per iteration 5's own recommended next focus.

## Objective

1. **Quantify consumer blast radius (primary).** Grep/trace every place in the codebase that reads `derived.status` (or `graph-metadata.json` `.derived.status` / `.status`) from a graph-metadata.json file and BRANCHES on its value (e.g. `resume` ladders that skip "complete" phases, "open work" / dashboard rollups that filter by status, memory_search ranking/boosting, phase-parent `last_active_child_id` derivation). For each consumer found, state whether it would produce a WRONG user-facing result if `status` falsely reads `complete` (e.g. "resume skips this phase entirely, operator never sees it needs work" vs "cosmetic only, no behavior change"). This determines whether D4-P0-001 has a concrete functional failure mode or is "only" a data-accuracy P0.
2. **Patch-shape feasibility (read-only design, NO implementation).** Sketch (in prose, in the iteration narrative only -- do NOT edit any source file) the minimal `deriveStatus` fix: what additional signal(s) should gate `complete` (e.g. require `completion_pct >= 100` from spec.md frontmatter, or zero open `[ ]` tasks in tasks.md, or presence of a real checklist.md). Using iteration 5's own sweep data, would this fix's true-positive rate hold for the ~403 folders iteration 5 found plausibly complete (pct:100/open:0)? Any edge cases that would break (e.g. folders with no frontmatter at all, non-Level-1 folders without completion_pct)?
3. **Tertiary (if budget remains):** re-challenge D3's "BUILDABLE-BUT-UNAUTHORED" verdict from iteration 3 -- confirm the 4 `/speckit:*` presentation/router/YAML files handover.md cites are still unchanged since iteration 3 (quick mtime/hash spot-check, not a full re-read), i.e. no drift in the ~20-40 min since.
4. Do NOT implement the deriveStatus fix or modify any source file. Do NOT modify anything under the 009 phase folder outside `review/`.

## Style

Evidence-cited; name exact consumer file:line for each branch-on-status site found.

## Tone

Terse, rigorous -- this pass converts a plausible P0 into either a concretely user-facing P0 or a "real but currently inert" P0, both legitimate but differently actionable.

## Audience

A senior engineer deciding remediation priority for D4-P0-001.

## Response

Produce THREE required artifacts:
1. `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/iterations/iteration-6.md` (headings: Consumer Blast-Radius Findings, Patch-Shape Feasibility Sketch, D3 Drift Spot-Check, Findings by Severity, Verdict, Next Focus for iteration 7).
2. Append one `"type":"iteration"` line (iteration:6, focus:"D4-P0-consumer-blast-radius-and-patch-feasibility", sessionId "rv-phase009-audit-20260701-184748", generation 1, lineageMode "new") to `review/deep-review-state.jsonl`.
3. `review/deltas/iter-006.jsonl`.

Update `review/deep-review-strategy.md` and `review/deep-review-findings-registry.json` in place. ALLOWED WRITE PATHS: only those 4 under `review/`. BANNED: any write/rename/delete anywhere under the 009 phase folder outside `review/`, any edit to `graph-metadata-parser.ts` or any other source file (this is design-sketch only, not implementation). Reading is unrestricted repo-wide. Record any near-violation as `scope_violation`.

Target ~9-12 tool calls, 15-20 min. Every new/escalated P0/P1 needs claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.
