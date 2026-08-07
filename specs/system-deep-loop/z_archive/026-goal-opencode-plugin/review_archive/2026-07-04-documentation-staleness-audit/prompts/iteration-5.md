DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/deep-loops/032-goal-opencode-plugin (pre-approved, skip Gate 3 -- proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 5 of a batch covering 4-7). Your ALLOWED WRITE PATHS are NARROWER than a normal iteration: you may ONLY write `review/iterations/iteration-005.md` and `review/deltas/iter-005.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json` -- the orchestrator will merge your delta file into shared state after this batch completes. Put your full canonical `{"type":"iteration",...}` JSONL record as the FIRST line of your delta file.

## STATE (established findings as of iteration 3, read-only context)

Prior Findings: P0=0 P1=2 P2=0
- P1-001: `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:646-660` omits the 3 new `MK_GOAL_STATE_*` env vars.
- P1-002: `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md:33-52` (already touched this session) omits the same 3 env vars plus `store_health`/`mutation=` output coverage.

Do NOT re-emit either as new. Note if your review is directly adjacent to one of them, referencing the finding ID.

## YOUR ASSIGNED FOCUS FOR THIS ITERATION (traceability, Finding #5)

Companion research Finding #5 (P2 claim, "validation-coverage gap, not a factual error"): both goal-plugin manual testing playbooks --
- `.opencode/skills/system-spec-kit/manual_testing_playbook/ux-hooks/goal-opencode-plugin.md`
- `.opencode/skills/system-skill-advisor/manual_testing_playbook/cli-hooks-and-plugin/goal-opencode-plugin.md`

-- are claimed to be factually correct about command routing/tool names, but their pass criteria allegedly predate the new output fields: neither instructs the operator to verify `store_health=` output or `/goal set`'s `mutation=<created|refreshed|replaced>` output, meaning a manual test run could currently pass without ever exercising these newly-shipped status surfaces.

1. Read BOTH playbook files in full.
2. Independently verify: is there truly no step in either playbook that checks `store_health` or `mutation=`? Search for those exact strings and any semantically-equivalent step (e.g. "check goal status output", "verify /goal set response") that might already cover this without using the literal field names.
3. Assign your own verdict per playbook (they may differ from each other) -- confirm at P2, upgrade/downgrade, or refute with file:line evidence.
4. Check the two playbooks against EACH OTHER for consistency: do they test the same plugin the same way, or does one have more/different coverage than the other? Note any asymmetry.
5. If you find time, check whether either playbook references the retired `goal.md` filename anywhere (a quick negative-sweep sanity check, distinct from Finding #6 which other iterations cover in more depth) -- if so note it, but do not treat it as your primary focus.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger. (P2 findings should still cite evidence but the full adjudication packet is optional for P2.)

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two)**: `review/iterations/iteration-005.md`, `review/deltas/iter-005.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the two allowed paths above (including the shared state files in this batch mode).

## OUTPUT CONTRACT

Produce TWO artifacts:

1. **Iteration narrative markdown** at `review/iterations/iteration-005.md`. Structure: Dimension, Files Reviewed, Finding #5 Audit (both playbooks), Cross-Playbook Consistency, Findings by Severity, Traceability Checks, Verdict, Next Dimension. ABSOLUTE FINAL LINE exactly one of: `Review verdict: PASS` / `CONDITIONAL` / `FAIL`.

2. **Delta file** at `review/deltas/iter-005.jsonl`. FIRST line is the canonical `{"type":"iteration",...}` record (do NOT append to state.jsonl). Include `findingsNew` (rich claim-adjudication shape) and `findingDetails`, both populated in parallel (or both `[]`). Then per-event structured records.

Required schema for the first line:
```json
{"type":"iteration","iteration":5,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-005","status":"complete","focus":"traceability (Finding #5, manual playbooks)","dimensions":["traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"rv-goal-docs-audit-032-20260701-161615","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back: verdict, count/titles of new findings, confirmation both files written.
