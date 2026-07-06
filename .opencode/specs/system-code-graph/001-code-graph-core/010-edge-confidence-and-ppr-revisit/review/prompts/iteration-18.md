DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (PARALLEL BATCH MODE)

Spec folder: .opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit (pre-approved, already scaffolded and validated this session -- skip Gate 3, do not ask about spec folder documentation, proceed directly to review).

## PARALLEL BATCH MODE NOTICE

You are one of several iterations running CONCURRENTLY in this batch (iteration 18 of a batch covering 17-20). Your ALLOWED WRITE PATHS are ONLY `review/iterations/iteration-18.md` and `review/deltas/iter-018.jsonl`. Do NOT touch `review/deep-review-state.jsonl`, `review/deep-review-strategy.md`, or `review/deep-review-findings-registry.json`. Put your full canonical `{"type":"iteration",...}` JSONL record as the FIRST line of your delta file.

## STATE (established findings through iteration 7, read-only context; read `review/deep-review-findings-registry.json` yourself for the true current list before starting, since batches 8-16 ran in the meantime)

Prior Findings (as of iteration 7): P0=0 P1=3 P2=3
- P1-001: `code-graph-context.ts` top-level `await import()` runs unconditionally at MCP SERVER STARTUP, before the seeded-PPR flag is checked.
- P1-002: Seeded-PPR trace output loses the multi-hop provenance chain.
- P1-003: `checklist.md` claims full completion but `tasks.md`/`plan.md` show items still unchecked.
- P2-004/005/006: eval cleanup, catalog/playbook gap, test-isolation gap.

Do NOT re-emit any active finding as new.

## YOUR ASSIGNED DIMENSION FOR THIS ITERATION

Confidence-value internal consistency audit. The new confidence differentiation writes one of four values: 0.9/EXTRACTED, 0.75/INFERRED, 0.35/AMBIGUOUS, 0.3/AMBIGUOUS. Check: (a) does the `EdgeEvidenceClass` type definition (likely in `indexer-types.ts` or similar) actually include `EXTRACTED`, `INFERRED`, and `AMBIGUOUS` as valid values, and are there any OTHER valid values in that enum that this new code should have considered but didn't, (b) does `contextEdgeReliability` (the existing trust-blend consumer mentioned in this packet's docs) have any hardcoded assumption about the RANGE or DISTRIBUTION of confidence values that these four new specific values might violate (e.g. does it assume confidence is always >= 0.5, or that AMBIGUOUS always implies a specific range), (c) are there any OTHER current consumers of edge confidence/evidenceClass in the code-graph codebase (besides contextEdgeReliability and the new seeded-PPR path) that read these fields and might behave unexpectedly now that CALLS edges have real variance instead of a constant, search broadly for reads of `.confidence` or `.evidenceClass` on edge objects across the mcp_server/lib directory.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (ONLY these two)**: `review/iterations/iteration-18.md`, `review/deltas/iter-018.jsonl`
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, and any write/rename/delete outside the two allowed paths above (this includes the shared state/strategy/registry files in this batch mode).

## OUTPUT CONTRACT

Produce TWO artifacts:

1. **Iteration narrative markdown** at `review/iterations/iteration-18.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension. The ABSOLUTE FINAL LINE MUST be exactly one of: `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL`.

2. **Delta file** at `review/deltas/iter-018.jsonl`. FIRST line MUST be the canonical `{"type":"iteration",...}` record. Include BOTH `findingsNew` (id, severity, title, claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger, findingClass, contentHash) AND `findingDetails` (id, severity, status, title, file, line, findingClass, scopeProof, affectedSurfaceHints, contentHash), both populated in parallel. If zero new findings, both may be `[]`. Then per-event structured records after the first line.

Required schema for the first line:
```json
{"type":"iteration","iteration":18,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-018","status":"complete","focus":"<dimension-or-focus>","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-01T13:37:25.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Both artifacts are REQUIRED. When done, report back in under 150 words: what you found about downstream confidence consumers, the count and titles of any new findings, and confirmation both files were written.
