DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit (pre-approved, already scaffolded and validated this session -- skip Gate 3, do not ask about spec folder documentation, proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 8 of a batch covering 8-11). To avoid write collisions with sibling iterations, your ALLOWED WRITE PATHS are NARROWER than a normal iteration: you may ONLY write `review/iterations/iteration-8.md` and `review/deltas/iter-008.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json` -- the orchestrator will merge your delta file into shared state after this batch completes. Put your full canonical `{"type":"iteration",...}` JSONL record as the FIRST line of your delta file, exactly as you normally would append to state.jsonl.

## STATE (established findings as of iteration 7, read-only context)

Prior Findings: P0=0 P1=3 P2=3
- P1-001: `code-graph-context.ts` has a top-level `await import()` of the compiled Memory MCP dist module (`system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js`) that runs unconditionally at MCP SERVER STARTUP (confirmed via full import chain trace), before the seeded-PPR flag is checked. If that dist artifact is absent (default in a clean checkout), the entire code-graph MCP server fails to start.
- P1-002: Seeded-PPR trace output (`why_included.edgeChain`) loses the multi-hop provenance chain when `includeTrace` and the seeded-PPR flag are both enabled. Confirmed reachable via the live advertised MCP tool schema (`queryMode:"impact"` + `includeTrace` are both real caller-settable args).
- P1-003: `checklist.md` claims full completion (10/10 P1 items) but `tasks.md`/`plan.md` still show T008 (sync), T010 (doc updates), T011 (validate.sh --strict) and the Completion Criteria as unchecked, even though that work was actually done.
- P2-004: Eval harness (`score-seeded-ppr-retrieval.mjs`) cleanup is not failure-safe (try/finally missing around workDir/child cleanup).
- P2-005: Feature catalog and manual playbook omit the new gated `code_graph_context` capability (seeded-PPR, edge-confidence differentiation).
- P2-006: Focused PPR regression tests miss both P1-001 (no test simulates missing dist) and P1-002 (no test exercises includeTrace+seeded-PPR together).

Do NOT re-emit any of the above findings as new. You MAY note if your review strengthens, weakens, or finds something directly adjacent to one of them, but frame it as a note referencing the existing finding ID, not a duplicate new finding.

## YOUR ASSIGNED DIMENSION FOR THIS ITERATION

Full line-by-line correctness audit of `.opencode/skills/system-code-graph/mcp_server/lib/cross-file-edge-resolver.ts`, focused specifically on the parts THIS SESSION modified (the confidence-differentiation write path added in `resolveCrossFileCallEdges`). Read the ENTIRE function this session touched, not just the lines already cited in prior iterations. Look specifically for: off-by-one or wrong-branch logic in the resolved/ambiguousSkipped/unresolved classification, whether the new confidence-write code path can ever run when the flag is off (it must not -- verify this precisely by reading the actual conditional, not by trusting the spec's claim), whether the SQL update statements for confidence/evidenceClass are parameterized safely, and whether there are any candidate-list edge cases (zero candidates, exactly one candidate with itself as a false match, candidates in a different file than expected) that could produce a wrong confidence value silently.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two, per parallel batch mode above)**: `review/iterations/iteration-8.md`, `review/deltas/iter-008.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the two allowed paths above (this includes `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, and `review/deep-review-findings-registry.json` in this batch mode -- do not touch them even though a normal iteration would).

## OUTPUT CONTRACT

Produce TWO artifacts (not three, per parallel batch mode):

1. **Iteration narrative markdown** at `review/iterations/iteration-8.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension. The ABSOLUTE FINAL LINE MUST be exactly one of: `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL`.

2. **Delta file** at `review/deltas/iter-008.jsonl`. FIRST line MUST be the canonical `{"type":"iteration",...}` record (do NOT append this to state.jsonl yourself -- write it only here). Include BOTH `findingsNew` (rich claim-adjudication shape: id, severity, title, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger, findingClass, contentHash) AND `findingDetails` (shape per finding: id, severity, status, title, file, line, findingClass, scopeProof, affectedSurfaceHints, contentHash), both populated in parallel. If zero new findings, both may be `[]`. Then per-event structured records after the first line (one per finding/classification/traceability-check).

Required schema for the first line:
```json
{"type":"iteration","iteration":8,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-008","status":"complete","focus":"<dimension-or-focus>","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-01T13:37:25.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back in your final text response: the verdict, the count and titles of any new findings, and confirmation that both files were written.
