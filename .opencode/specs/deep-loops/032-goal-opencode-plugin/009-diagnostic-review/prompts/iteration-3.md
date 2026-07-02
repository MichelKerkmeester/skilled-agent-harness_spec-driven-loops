DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## Context

LEAF deep-review iteration agent, iteration 3 of 10, DIAGNOSTIC-ONLY (stop_policy=max-iterations -- do not converge early). Read before writing:
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/deep-review-strategy.md` in FULL (Known Context D3 section, iterations 1-2 results)
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `handover.md` -- ALL in full
  - `.opencode/commands/goal_opencode.md` (the live /goal command)

Iterations 1-2 established: the graph-metadata.json defect is isolated (D1), and the "owned by a separate concurrent session" claim is unverifiable-from-this-machine, leaning local-negative but not refutable (D2). Seeded Known Context for D3 claims: spec.md/plan.md/tasks.md/implementation-summary.md are 100% unfilled scaffold templates (literal placeholders, `completion_pct: 0`); only handover.md has real phase-009-specific content; handover.md:95's cold-read order cites `.opencode/commands/goal.md` which does not exist (actual file is `goal_opencode.md`) -- already independently confirmed by BOTH iteration investigations and a separate prior completed review (DR-006-P2-001).

## Objective

Your dimension is **D3: completeness of the phase's own plan**. Verify independently:
1. Confirm (or refute) that spec/plan/tasks/implementation-summary are genuinely unfilled scaffolds -- quote the exact placeholder strings you find.
2. Is the plan (as described in handover.md §3, "Priority Tasks Remaining" and "Recommended Starting Point") coherent and buildable, or does it have gaps/contradictions beyond the known goal.md/goal_opencode.md stale reference? Specifically check: do the 4 cited `/speckit:*` presentation-contract files still exist at their described paths (`speckit_plan_presentation.txt`, `speckit_complete_presentation.txt`, plus `/speckit:implement` and `/speckit:resume` equivalents mentioned in handover.md §3.2 item 2)? Does `.opencode/commands/goal_opencode.md`'s actual tool contract (mk_goal / mk_goal_status args) match what handover.md assumes it will interact with?
3. Given zero real spec/plan/tasks content exists, is "phase 9 of 9... [Phase 9 scope]" (spec.md's own placeholder) even a coherent scope statement, or does the packet-root spec.md's OWN phase-map (from D2's iteration-2 read) already describe phase 009's scope in more concrete terms than phase 009's own spec.md does? Cross-check for consistency/contradiction between the two.
4. Do NOT implement or fill in any of these scaffolds -- diagnosis only.

## Style

Evidence-cited, CONFIRMED vs INFERRED labeled.

## Tone

Terse, adversarial toward the seeded claims -- verify, don't parrot.

## Audience

A senior engineer deciding whether phase 009, if picked up today, has a usable plan to build from.

## Response

Produce THREE required artifacts:
1. `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/iterations/iteration-3.md` (Dimension D3, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension recommend D4).
2. Append one `"type":"iteration"` line (iteration:3, focus:"D3-plan-completeness", sessionId "rv-phase009-audit-20260701-184748", generation 1, lineageMode "new") to `review/deep-review-state.jsonl`.
3. `review/deltas/iter-003.jsonl`.

Update `review/deep-review-strategy.md` (D3 checkbox, RUNNING FINDINGS, NEXT FOCUS to D4, FILES UNDER REVIEW) and `review/deep-review-findings-registry.json` in place. ALLOWED WRITE PATHS: only those 4, under `review/`. BANNED: any write/rename/delete under the 009 phase folder outside `review/` (spec.md/plan.md/tasks.md/implementation-summary.md/handover.md are READ-ONLY), and anywhere else. Record any near-violation as `scope_violation` in the narrative instead of executing it.

Target ~9-12 tool calls, 15-20 min. Every new P0/P1 needs claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.
