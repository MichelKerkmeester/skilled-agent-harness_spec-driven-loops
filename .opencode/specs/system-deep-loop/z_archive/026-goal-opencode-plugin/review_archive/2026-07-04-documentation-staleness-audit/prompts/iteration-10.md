DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/deep-loops/032-goal-opencode-plugin (pre-approved, skip Gate 3 -- proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 10 of a batch covering 8-10 -- this is the FINAL iteration of a 10-iteration forced-depth review). Your ALLOWED WRITE PATHS are NARROWER than a normal iteration: you may ONLY write `review/iterations/iteration-010.md` and `review/deltas/iter-010.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json`.

**FINDING ID NAMESPACE:** prefix every new finding ID you mint with `I10-`, e.g. `I10-P1-1`, `I10-P2-1`.

## STATE (established findings as of iteration 7, read-only context -- iterations 8-9 are running concurrently with you and may add more)

Prior Findings: P0=0 P1=3 P2=3
- P1-001: `ENV_REFERENCE.md:646-660` omits the 3 new `MK_GOAL_STATE_*` env vars.
- P1-002: `references/hooks/goal_plugin.md:33-52` (already touched this session) omits the same 3 env vars plus `store_health`/`mutation=` output coverage.
- P1-003: Root `README.md:1230-1233` delegates the `/goal` plugin contract to `.opencode/plugins/README.md`, which does not define that contract.
- P2-001: `system-skill-advisor/README.md:85` contradicts its own feature catalog on live OpenCode-tool verification status.
- P2-002: Manual testing playbooks can pass without checking `store_health=`/`mutation=` output.
- DR-006-P2-001: Packet-history docs contain current-and-wrong stale `goal.md` operational claims (phase 009/011); phase 003 changelog + archived review README are historical (lower priority).

Do NOT re-emit any of the above as new.

## YOUR ASSIGNED FOCUS FOR THIS ITERATION (final dimension-coverage wrap-up + broaden pass)

This is the 10th and final forced iteration (the operator required exactly 10 iterations, no early convergence, until every doc class is genuinely covered). Your job:

1. **Confirm all 4 review dimensions have real coverage**, not just nominal touches: correctness (iterations 1, 3, 6), security (iteration 2 -- clean negative), traceability (iterations 3, 4, 5, 7, 9), maintainability (iteration 8). If you judge any dimension is still thin, do a focused pass on it now using whatever doc surface has NOT yet been read by any prior iteration.
2. **Broaden, don't repeat**: pick at least one doc surface or angle that no prior iteration (1-9) touched. Candidates: the root `README.md` sections OTHER than the `/goal` line (does the rest of the README reference the goal plugin consistently elsewhere?); `.opencode/AGENTS.md` or top-level behavioral framework docs for any goal-plugin mention; any OpenCode plugin-loading/config doc (`.opencode/opencode.json` comments, plugin registration docs) that might describe `mk-goal.js` inline; whether `.opencode/plugins/tests/mk-goal-state.test.cjs` (mentioned in this packet's own spec.md continuity block as a key file) has test coverage gaps relevant to the NEW functions (`recordProviderUsageLimit`, `archiveGoalStateFile`, `pruneArchive`, `sweepOrphanedActiveStates`) that a documentation reviewer would want to flag as an indirect traceability risk (code changed, docs partially updated, but were tests updated too?).
3. **Produce a closing per-finding summary table** in your iteration narrative covering ALL 6 established findings (P1-001, P1-002, P1-003, P2-001, P2-002, DR-006-P2-001) plus any new ones from this iteration or reported by iterations 8-9 (you will not have their live output, but structure your table so the orchestrator can append rows during synthesis): columns Finding ID | Severity | One-line description | Verdict (this review's own P0/P1/P2, confirming/adjusting the companion research severity) | Confidence.
4. State explicitly whether you believe the 10-iteration forced-depth mandate was satisfied (genuine broadening happened across iterations, not repeated ground) or whether you think a specific doc class was never actually reached -- this is your own honest assessment, not a rubber stamp.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two)**: `review/iterations/iteration-010.md`, `review/deltas/iter-010.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the two allowed paths above.

## OUTPUT CONTRACT

Produce TWO artifacts:

1. **Iteration narrative markdown** at `review/iterations/iteration-010.md`. Structure: Dimension, Files Reviewed, Dimension Coverage Confirmation, Broadened Surfaces Checked, Closing Per-Finding Summary Table, Findings by Severity, Traceability Checks, Forced-Depth Mandate Self-Assessment, Verdict. ABSOLUTE FINAL LINE exactly one of: `Review verdict: PASS` / `CONDITIONAL` / `FAIL`.

2. **Delta file** at `review/deltas/iter-010.jsonl`. FIRST line is the canonical `{"type":"iteration",...}` record (do NOT append to state.jsonl). Include `findingsNew` and `findingDetails` (IDs prefixed `I10-`), both populated in parallel (or both `[]`). Then per-event structured records.

Required schema for the first line:
```json
{"type":"iteration","iteration":10,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-010","status":"complete","focus":"final dimension-coverage wrap-up + broaden pass","dimensions":["correctness","security","traceability","maintainability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"rv-goal-docs-audit-032-20260701-161615","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back: verdict, count/titles of new findings, confirmation both files written, plus your forced-depth mandate self-assessment.
