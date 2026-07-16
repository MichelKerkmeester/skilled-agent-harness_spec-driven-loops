DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/system-code-graph/025-code-graph-core/010-edge-confidence-and-ppr-revisit (pre-approved, already scaffolded and validated this session -- skip Gate 3, do not ask about spec folder documentation, proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 9 of a batch covering 8-11). To avoid write collisions with sibling iterations, your ALLOWED WRITE PATHS are NARROWER than a normal iteration: you may ONLY write `review/iterations/iteration-9.md` and `review/deltas/iter-009.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json` -- the orchestrator will merge your delta file into shared state after this batch completes. Put your full canonical `{"type":"iteration",...}` JSONL record as the FIRST line of your delta file, exactly as you normally would append to state.jsonl.

## STATE (established findings as of iteration 7, read-only context)

Prior Findings: P0=0 P1=3 P2=3
- P1-001: `code-graph-context.ts` has a top-level `await import()` of the compiled Memory MCP dist module (`system-spec-kit/mcp_server/dist/lib/graph/bfs-traversal.js`) that runs unconditionally at MCP SERVER STARTUP, before the seeded-PPR flag is checked. If that dist artifact is absent (default in a clean checkout), the entire code-graph MCP server fails to start.
- P1-002: Seeded-PPR trace output (`why_included.edgeChain`) loses the multi-hop provenance chain when `includeTrace` and the seeded-PPR flag are both enabled.
- P1-003: `checklist.md` claims full completion but `tasks.md`/`plan.md` still show sync/doc-update/validate.sh tasks and Completion Criteria as unchecked, even though that work was actually done.
- P2-004: Eval harness (`score-seeded-ppr-retrieval.mjs`) cleanup is not failure-safe.
- P2-005: Feature catalog and manual playbook omit the new gated `code_graph_context` capability.
- P2-006: Focused PPR regression tests miss both P1-001 and P1-002 scenarios.

Do NOT re-emit any of the above findings as new. You MAY note if your review strengthens, weakens, or finds something directly adjacent to one of them, but frame it as a note referencing the existing finding ID, not a duplicate new finding.

## YOUR ASSIGNED DIMENSION FOR THIS ITERATION

Full line-by-line correctness audit of `.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts`, focused specifically on the parts THIS SESSION modified (the `buildDifferentiatedCallsEdgeMetadata` function and its call site, gated behind `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION`). Read the ENTIRE function and its immediate call site. Look specifically for: whether the candidate-cardinality check (`matchingCandidates.length > 1`) correctly excludes the caller's own symbol from the candidate count (verify `candidate.symbolId !== callerSymbolId` actually does this correctly, including for recursive functions calling themselves), whether the confidence value (0.75 single / 0.35 multi) and evidenceClass (INFERRED/AMBIGUOUS) assignments are internally consistent with the `EdgeEvidenceClass` type definition, whether this function is called for EVERY same-file CALLS edge or only some, and whether there's any double-counting or missed-edge scenario when a file has multiple functions with the same name in different scopes (e.g. nested closures, class methods with the same name in different classes).

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two, per parallel batch mode above)**: `review/iterations/iteration-9.md`, `review/deltas/iter-009.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the two allowed paths above (this includes `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, and `review/deep-review-findings-registry.json` in this batch mode).

## OUTPUT CONTRACT

Produce TWO artifacts (not three, per parallel batch mode):

1. **Iteration narrative markdown** at `review/iterations/iteration-9.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension. The ABSOLUTE FINAL LINE MUST be exactly one of: `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL`.

2. **Delta file** at `review/deltas/iter-009.jsonl`. FIRST line MUST be the canonical `{"type":"iteration",...}` record (do NOT append this to state.jsonl yourself). Include BOTH `findingsNew` (rich claim-adjudication shape: id, severity, title, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger, findingClass, contentHash) AND `findingDetails` (shape per finding: id, severity, status, title, file, line, findingClass, scopeProof, affectedSurfaceHints, contentHash), both populated in parallel. If zero new findings, both may be `[]`. Then per-event structured records after the first line.

Required schema for the first line:
```json
{"type":"iteration","iteration":9,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-009","status":"complete","focus":"<dimension-or-focus>","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-01T13:37:25.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back in your final text response: the verdict, the count and titles of any new findings, and confirmation that both files were written.
