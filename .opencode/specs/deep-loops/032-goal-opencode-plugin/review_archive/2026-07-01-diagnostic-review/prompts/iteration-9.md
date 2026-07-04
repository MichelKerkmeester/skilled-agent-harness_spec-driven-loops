DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## Context

LEAF deep-review iteration agent, iteration 9 of 10, DIAGNOSTIC-ONLY (stop_policy=max-iterations -- ONE more iteration after this, then synthesis). Read before writing:
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/deep-review-strategy.md` in FULL
  - Iteration 8's "Next Focus for iteration 9" section (`review/iterations/iteration-8.md`)
  - `.opencode/skills/system-spec-kit/mcp_server/lib/validation/generated-metadata-integrity.ts` around line 99 (`derived.status` enum-membership check) and the surrounding `validateGraphMetadataFile` function

## Objective

1. **Validator cross-field-gap check (primary, D4/D1 sibling).** Confirm whether `generated-metadata-integrity.ts` (or ANY other validator in the `validate.sh --strict` chain) has ANY consistency check between `derived.status` and (a) `completion_pct` in the corresponding spec.md/plan.md frontmatter, (b) open `[ ]` tasks in tasks.md, or (c) presence/absence of checklist.md beyond the bare existence check already known. If NO such cross-field check exists anywhere in the validation layer, this is the structural reason `validate.sh --strict` never catches the 213 files iteration 5/6 found corrupted -- state this as a new finding (P1 or P2, your call with justification) sibling to D1-P2-001 (loader/validator split) and D4-P0-001 (deriveStatus false-complete).
2. **Size the null-completion_pct edge case.** Count folders repo-wide that have a `graph-metadata.json` with `derived.status: "complete"` (or would derive complete per iteration 5's heuristic) but whose spec.md/plan.md frontmatter has NO `completion_pct` field at all (as opposed to `completion_pct: 0`). This is the edge case iteration 6 flagged as unfinished for the patch-shape sketch's true-positive rate.
3. **Consolidate, don't duplicate.** All 4 custom dimensions (D1-D4) plus the D4-P0-001 escalation have now had substantial coverage across 8 iterations. Do a QUICK pass (do not re-litigate) confirming: total distinct findings so far (read `review/deep-review-findings-registry.json`), and flag any that look like NEAR-DUPLICATES across iterations that should be merged before synthesis (e.g., are D1-P2-001 and the new cross-field-gap finding from objective 1 actually the same finding restated, or genuinely distinct? If distinct, say why).
4. Do NOT modify anything under the 009 phase folder outside `review/`. Do NOT implement any validator fix -- design/sizing only.

## Style

Evidence-cited counts and exact code-path citations.

## Tone

Terse, precise -- this is a closing-out iteration, avoid restating prior iterations' full narratives; cite them by iteration number instead.

## Audience

A senior engineer preparing to read the final review-report.md synthesis next.

## Response

Produce THREE required artifacts:
1. `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/iterations/iteration-9.md` (headings: Validator Cross-Field-Gap Check, Null-completion_pct Sizing, Findings Consolidation Pass, Findings by Severity, Verdict, Next Focus for iteration 10 -- final iteration).
2. Append one `"type":"iteration"` line (iteration:9, focus:"D4-validator-gap-and-consolidation", sessionId "rv-phase009-audit-20260701-184748", generation 1, lineageMode "new") to `review/deep-review-state.jsonl`.
3. `review/deltas/iter-009.jsonl`.

Update `review/deep-review-strategy.md` and `review/deep-review-findings-registry.json` in place, and dedupe the registry if objective 3 finds true duplicates. ALLOWED WRITE PATHS: only those 4 under `review/`. BANNED: any write/rename/delete anywhere under the 009 phase folder outside `review/`, no validator/source edits. Reading is unrestricted repo-wide. Record any near-violation as `scope_violation`.

Target ~9-12 tool calls, 15-20 min. Every new/escalated P0/P1 needs claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.
