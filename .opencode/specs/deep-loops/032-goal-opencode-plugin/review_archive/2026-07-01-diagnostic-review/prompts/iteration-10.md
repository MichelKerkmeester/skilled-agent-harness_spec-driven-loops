DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## Context

LEAF deep-review iteration agent, iteration 10 of 10 -- FINAL content iteration (max_iterations reached; the orchestrator performs review-report.md synthesis separately after this iteration, so do NOT write review-report.md yourself -- your job is the final adversarial claim-adjudication and traceability closure pass). Read before writing:
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/deep-review-strategy.md` in FULL
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/deep-review-findings-registry.json` in FULL
  - All 9 prior iteration files under `review/iterations/` (at least skim each for its Verdict section)

## Objective

This is the closing iteration. Perform:

1. **Formal claim adjudication for every active P0/P1 finding** (per iterations so far: D4-P0-001 "deriveStatus false-complete, systemic, 213 corrupted on-disk" and D1-P1-001 "no validator cross-checks derived.status against completion signals"). For EACH, write a complete adjudication packet: claim, evidenceRefs (cite iteration numbers + file:line), counterevidenceSought (what would refute it -- and whether you looked), alternativeExplanation (the strongest good-faith alternative reading), finalSeverity, confidence, downgradeTrigger. This satisfies the workflow's claimAdjudicationGate requirement before the loop can legally stop.
2. **Full traceability protocol closure.** Go through core (`spec_code`, `checklist_evidence`) and overlay (`skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`) protocols and mark each definitively `pass`/`partial`/`fail`/`notApplicable` with one-line justification, reconciling any inconsistency across iterations 1-9.
3. **Dimension coverage confirmation.** Explicitly confirm all 4 custom dimensions (D1-D4) have genuine, non-duplicate coverage across the 10 iterations -- cite which iteration(s) covered each, and confirm none was a rubber-stamp repeat.
4. **Holistic verdict for the whole diagnostic audit.** Render ONE overall verdict (PASS / CONDITIONAL / FAIL, with hasAdvisories=true if only P2s remain open) for THIS DIAGNOSTIC REVIEW ITSELF (not for phase 009's own unfinished implementation work, which is explicitly out of scope to judge pass/fail on) -- i.e., judge whether the phase-009 folder + its metadata tooling are release-safe to leave as-is, need a scoped fix, or block on something. Recommend the single next action for the operator (e.g., "run the live graph-metadata backfill with statusOverride, independent of D2" vs "wait for D2 confirmation first").
5. Do NOT write `review/review-report.md` (orchestrator does that next). Do NOT modify anything under the 009 phase folder outside `review/`.

## Style

Precise, closing-argument tone. Cite iteration numbers liberally instead of re-deriving.

## Tone

Final adversarial pass -- if any P0/P1 does not survive counterevidence-seeking, downgrade it here, now, before synthesis locks it in.

## Audience

The orchestrator, who will read this iteration file plus the findings registry to compile the final review-report.md.

## Response

Produce THREE required artifacts:
1. `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/iterations/iteration-10.md` (headings: Claim Adjudication -- D4-P0-001, Claim Adjudication -- D1-P1-001, Traceability Protocol Closure, Dimension Coverage Confirmation, Holistic Verdict, Recommended Next Action).
2. Append one `"type":"iteration"` line (iteration:10, focus:"final-claim-adjudication-and-closure", sessionId "rv-phase009-audit-20260701-184748", generation 1, lineageMode "new", status "complete") to `review/deep-review-state.jsonl`. Also append a `{"type":"claim_adjudication","passed":true|false,...}` event line if the adjudication for both P0/P1 findings holds (or explicitly false with reasons if either fails adjudication).
3. `review/deltas/iter-010.jsonl`.

Update `review/deep-review-strategy.md` (mark ALL of D1-D4 checkboxes closed, final RUNNING FINDINGS tally, set NEXT FOCUS to "synthesis") and `review/deep-review-findings-registry.json` in place (final tally, any last downgrades). ALLOWED WRITE PATHS: only those 4 under `review/`. BANNED: any write/rename/delete anywhere under the 009 phase folder outside `review/`, and do not create `review-report.md` yourself. Reading is unrestricted repo-wide. Record any near-violation as `scope_violation`.

Target ~9-12 tool calls, 15-20 min.
