DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/deep-loops/032-goal-opencode-plugin (pre-approved, skip Gate 3 -- proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 8 of a batch covering 8-10). Your ALLOWED WRITE PATHS are NARROWER than a normal iteration: you may ONLY write `review/iterations/iteration-008.md` and `review/deltas/iter-008.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json` -- the orchestrator will merge your delta file into shared state after this batch completes.

**FINDING ID NAMESPACE (IMPORTANT -- prevents collisions with sibling concurrent iterations):** prefix every new finding ID you mint with `I8-`, e.g. `I8-P1-1`, `I8-P2-1`. Do NOT use bare `P1-00N` / `P2-00N` style IDs this iteration -- a prior batch had two concurrent iterations both mint `P2-001` independently, causing a collision the orchestrator had to manually resolve.

## STATE (established findings as of iteration 7, read-only context)

Prior Findings: P0=0 P1=3 P2=3
- P1-001: `ENV_REFERENCE.md:646-660` omits the 3 new `MK_GOAL_STATE_*` env vars.
- P1-002: `references/hooks/goal_plugin.md:33-52` (already touched this session) omits the same 3 env vars plus `store_health`/`mutation=` output coverage.
- P1-003: Root `README.md:1230-1233` delegates the `/goal` plugin contract to `.opencode/plugins/README.md`, which does not actually define that contract (no mk-goal config/env/output subsection).
- P2-001: `.opencode/skills/system-skill-advisor/README.md:85` contradicts its own feature catalog on live OpenCode-tool verification status.
- P2-002: Manual testing playbooks (system-spec-kit + system-skill-advisor) can pass without checking `store_health=`/`mutation=` output.
- DR-006-P2-001: Packet-history docs (phase 009 handover.md, phase 011 tasks.md) contain current-and-wrong stale `goal.md` operational claims; phase 003 changelog + archived review README are historical narrative (lower priority).

Do NOT re-emit any of the above as new. You MAY note if your review strengthens, weakens, or finds something directly adjacent to one of them, framed as a note referencing the existing finding ID.

## YOUR ASSIGNED DIMENSION FOR THIS ITERATION (maintainability)

1. Given P1-003 confirms the root-README-to-plugins-README delegation is structurally broken, assess MAINTAINABILITY of the current doc topology for the goal plugin specifically: is authoritative env-var/output-field ownership split across too many docs (`ENV_REFERENCE.md`, `references/hooks/goal_plugin.md`, `.opencode/plugins/README.md`, feature catalogs, playbooks) in a way that makes future changes error-prone (i.e., is THIS the root cause of why 3+ docs independently drifted after the same code change)? This is a maintainability finding about doc STRUCTURE, not a re-statement of the traceability gaps already filed.
2. Read `.opencode/plugins/mk-goal.js` once more with fresh eyes for maintainability (not correctness) -- are the new functions (`recordProviderUsageLimit`, `archiveGoalStateFile`, `pruneArchive`, `sweepOrphanedActiveStates`) self-documenting (clear names, adequate inline comments) such that a future maintainer could infer the env-var contract from code alone if docs drift again? This informs whether the doc gaps are a one-off slip or a recurring risk pattern.
3. Assess whether `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`'s own internal structure (env table location, output-field section presence/absence) makes it easy or hard to keep current -- e.g., is there no dedicated "Output Fields" heading at all, forcing a maintainer to invent one, versus an existing heading that was simply not updated?
4. Report a maintainability verdict: is the DOC STRUCTURE itself (not just current content staleness, already covered by P1-001/P1-002/P1-003) a contributing root cause? If yes, file a new P1/P2 structural finding with the `I8-` prefix. If the structure is fine and this is purely a content-currency problem, say so explicitly (a clean structural verdict is a valid outcome).

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two)**: `review/iterations/iteration-008.md`, `review/deltas/iter-008.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the two allowed paths above.

## OUTPUT CONTRACT

Produce TWO artifacts:

1. **Iteration narrative markdown** at `review/iterations/iteration-008.md`. Structure: Dimension, Files Reviewed, Doc-Structure Maintainability Assessment, Code Self-Documentation Assessment, Findings by Severity, Traceability Checks, Verdict, Next Dimension. ABSOLUTE FINAL LINE exactly one of: `Review verdict: PASS` / `CONDITIONAL` / `FAIL`.

2. **Delta file** at `review/deltas/iter-008.jsonl`. FIRST line is the canonical `{"type":"iteration",...}` record (do NOT append to state.jsonl). Include `findingsNew` and `findingDetails` (IDs prefixed `I8-`), both populated in parallel (or both `[]`). Then per-event structured records.

Required schema for the first line:
```json
{"type":"iteration","iteration":8,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-008","status":"complete","focus":"maintainability (doc structure root-cause assessment)","dimensions":["maintainability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"rv-goal-docs-audit-032-20260701-161615","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back: verdict, count/titles of new findings, confirmation both files written.
