DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/deep-loops/032-goal-opencode-plugin (pre-approved, skip Gate 3 -- proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 4 of a batch covering 4-7). To avoid write collisions with sibling iterations, your ALLOWED WRITE PATHS are NARROWER than a normal iteration: you may ONLY write `review/iterations/iteration-004.md` and `review/deltas/iter-004.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json` -- the orchestrator will merge your delta file into shared state after this batch completes. Put your full canonical `{"type":"iteration",...}` JSONL record as the FIRST line of your delta file, exactly as you normally would append to state.jsonl.

## STATE (established findings as of iteration 3, read-only context)

Prior Findings: P0=0 P1=2 P2=0
- P1-001: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:646-660` omits `MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS`, `MK_GOAL_STATE_ACTIVE_RETENTION_DAYS`, `MK_GOAL_STATE_SWEEP_INTERVAL_MS`.
- P1-002: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:33-52` (already touched this session for the filename fix) omits the same 3 env vars plus `store_health`/`mutation=` output coverage.

Do NOT re-emit either of the above as new. You may note if your review strengthens, weakens, or finds something directly adjacent to one of them, framed as a note referencing the existing finding ID.

## YOUR ASSIGNED FOCUS FOR THIS ITERATION (traceability + maintainability)

Companion research Findings #3 and #4 -- independently AUDIT both, do not merely re-cite:

**Finding #3 (P1 claim):** `.opencode/plugins/README.md` is too thin to be the "plugin contract" that root `README.md` explicitly delegates to it as (root README says "See `.opencode/plugins/README.md` for the plugin contract"). Read BOTH files. Check whether `.opencode/plugins/README.md`'s `mk-goal.js` coverage includes a real config/contract subsection (env vars, output fields, cleanup/archive behavior) or is just a one-line inventory row. Assign your own verdict with file:line evidence -- confirm, downgrade, or refute, and note whether the fix should be "expand plugins/README.md" or "retarget root README's pointer to references/hooks/goal_plugin.md" (report both options if genuinely undecided; do not implement).

**Finding #4 (P2 claim):** `.opencode/skills/system-skill-advisor/README.md:85` says the `/goal` plugin's live OpenCode-tool invocation is "still under investigation." Read that exact line and its surrounding context. Then read `.opencode/skills/system-skill-advisor/feature_catalog/07--hooks-and-plugin/goal-opencode-plugin.md` in full and check whether it documents a real verified `opencode serve` run showing `mk_goal`/`mk_goal_status` tool listing and a live model turn persisting state. If both are as research describes, this is a direct self-contradiction within the same skill (one doc says "verified," the sibling README says "still under investigation") -- confirm at P2 (or upgrade to P1 if you judge the contradiction is more severe than research assessed, with reasoning) or downgrade/refute with evidence.

Also spend brief attention on: does `.opencode/plugins/README.md`'s "Both plugins support" wording (~line 70) match the current five-entrypoint table that includes `mk-goal.js`? (research flagged this as P3 -- confirm or adjust).

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two, per parallel batch mode above)**: `review/iterations/iteration-004.md`, `review/deltas/iter-004.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the two allowed paths above (this includes `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, and `review/deep-review-findings-registry.json` in this batch mode -- do not touch them even though a normal iteration would).

## OUTPUT CONTRACT

Produce TWO artifacts (not three, per parallel batch mode):

1. **Iteration narrative markdown** at `review/iterations/iteration-004.md`. Structure: Dimension, Files Reviewed, Finding #3 Audit, Finding #4 Audit, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension. The ABSOLUTE FINAL LINE MUST be exactly one of: `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL`.

2. **Delta file** at `review/deltas/iter-004.jsonl`. FIRST line MUST be the canonical `{"type":"iteration",...}` record (do NOT append this to state.jsonl yourself -- write it only here). Include `findingsNew` with rich claim-adjudication shape (id, severity, title, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger, findingClass, contentHash) and `findingDetails` (id, severity, status, title, file, line, findingClass, scopeProof, affectedSurfaceHints, contentHash), both populated in parallel. If zero new findings, both may be `[]`. Then per-event structured records after the first line (one per finding/classification/traceability-check).

Required schema for the first line:
```json
{"type":"iteration","iteration":4,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-004","status":"complete","focus":"traceability+maintainability (Findings #3, #4)","dimensions":["traceability","maintainability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"rv-goal-docs-audit-032-20260701-161615","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back in your final text response: the verdict, the count and titles of any new findings, and confirmation that both files were written.
