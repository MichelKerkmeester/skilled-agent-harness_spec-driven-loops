DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/system-speckit/028-memory-search-intelligence/002-code-graph/010-edge-confidence-and-ppr-revisit (pre-approved, already scaffolded and validated this session -- skip Gate 3, do not ask about spec folder documentation, proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 19 of a batch covering 17-20). Your ALLOWED WRITE PATHS are ONLY `review/iterations/iteration-19.md` and `review/deltas/iter-019.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json`. Put your full canonical `{"type":"iteration",...}` JSONL record as the FIRST line of your delta file.

## STATE (established findings through iteration 7, read-only context; read `review/deep-review-findings-registry.json` yourself for the true current list before starting)

Prior Findings (as of iteration 7): P0=0 P1=3 P2=3
- P1-001: `code-graph-context.ts` top-level `await import()` runs unconditionally at MCP SERVER STARTUP, before the seeded-PPR flag is checked.
- P1-002: Seeded-PPR trace output loses the multi-hop provenance chain.
- P1-003: `checklist.md` claims full completion but `tasks.md`/`plan.md` show items still unchecked.
- P2-004/005/006: eval cleanup, catalog/playbook gap, test-isolation gap.

Do NOT re-emit any active finding as new.

## YOUR ASSIGNED DIMENSION FOR THIS ITERATION

Rollback and flag-toggle correctness. Both new flags (`SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` and `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`) are meant to be a pure runtime `process.env` check with no caching, meaning toggling either flag between two calls (or between a restart) should change behavior immediately with no stale state. Verify this precisely: (a) are the flag-read functions (`isCodeGraphEdgeConfidenceDifferentiationEnabled`, `shouldUseSeededPprRanking` or equivalent) called FRESH on every relevant code path (every edge write, every impact query), or is the flag value ever cached/memoized at module load time in a `const` that would only pick up a NEW value after a full process restart, (b) if an operator flips the flag ON, runs a scan (writing differentiated confidence into the DB), then flips it OFF again, does any STALE differentiated-confidence data left in the database cause any different behavior on the flag-off path than if the scan had never happened with the flag on (i.e. does the flag-off path correctly ignore/normalize any confidence value it finds, or does it assume the constant 0.8 was always there), (c) is there a realistic scenario where a partially-completed reindex (interrupted mid-way with the flag on) could leave the database in a mixed state (some edges at the new differentiated values, some at the old constant) that neither the flag-on nor flag-off path handles correctly.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two)**: `review/iterations/iteration-19.md`, `review/deltas/iter-019.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the two allowed paths above (this includes the shared state/strategy/registry files in this batch mode).

## OUTPUT CONTRACT

Produce TWO artifacts:

1. **Iteration narrative markdown** at `review/iterations/iteration-19.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension. The ABSOLUTE FINAL LINE MUST be exactly one of: `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL`.

2. **Delta file** at `review/deltas/iter-019.jsonl`. FIRST line MUST be the canonical `{"type":"iteration",...}` record. Include BOTH `findingsNew` (id, severity, title, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger, findingClass, contentHash) AND `findingDetails` (id, severity, status, title, file, line, findingClass, scopeProof, affectedSurfaceHints, contentHash), both populated in parallel. If zero new findings, both may be `[]`. Then per-event structured records after the first line.

Required schema for the first line:
```json
{"type":"iteration","iteration":19,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-019","status":"complete","focus":"<dimension-or-focus>","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-01T13:37:25.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back in under 150 words: whether flag reads are fresh vs cached, whether mixed-state reindex is a real risk, the count and titles of any new findings, and confirmation both files were written.
