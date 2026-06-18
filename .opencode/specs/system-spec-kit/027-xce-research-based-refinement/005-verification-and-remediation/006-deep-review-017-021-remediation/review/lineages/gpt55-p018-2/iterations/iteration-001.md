# Iteration 001: Correctness

## Focus

- Dimension: correctness
- Target: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation`
- Files reviewed: target spec docs, `batch-processor.ts`, `memory-index.ts`, `job-store.ts`, and cancellation tests.
- Graph status: stale; used direct reads and exact search evidence.

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 9
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P0, Blocker

- None.

### P1, Required

- **F001**: Cancel still waits through the inter-batch delay when cancellation arrives after a batch. `processBatches` checks `shouldAbort` at the top of the batch loop, then after a batch completes it always awaits the pacing delay when more items remain. If cancellation is requested during the batch or immediately after it, the next abort check does not run until after that sleep, so the code does not satisfy the plan's claim that cancellation skips the inter-batch pacing delay. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts:149-173] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation/plan.md:55]

```json
{
  "findingId": "F001",
  "claim": "processBatches still awaits the inter-batch pacing delay when a cancellation request becomes true after a batch has started, so it does not fully implement the documented early-abort contract.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts:149-173",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation/plan.md:55",
    ".opencode/skills/system-spec-kit/mcp_server/tests/job-store-cancel-lifecycle.vitest.ts:42-73"
  ],
  "counterevidenceSought": "Read the real processBatches loop, memory-index call site, and the cancellation tests. The existing unit test proves top-of-next-batch abort with delayMs=0, but it intentionally does not exercise a nonzero inter-batch delay.",
  "alternativeExplanation": "The default delay is only 100ms, so the user-visible impact may be bounded for default settings. That does not satisfy the explicit no pacing-delay drain contract, and delayMs is configurable by callers.",
  "finalSeverity": "P1",
  "confidence": 0.87,
  "downgradeTrigger": "Downgrade to P2 if an abort check or abortable delay is added before the inter-batch sleep and a regression test with nonzero delay proves cancellation returns without waiting for that delay.",
  "transitions": [
    {
      "iteration": 1,
      "from": null,
      "to": "P1",
      "reason": "Initial discovery"
    }
  ]
}
```

### P2, Suggestion

- None.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `plan.md:55`, `batch-processor.ts:149-173` | Early-abort exists, but inter-batch delay is not skipped when cancel arrives after a batch starts. |
| checklist_evidence | pass | hard | `spec.md:35` | Level 1 target has no checklist; AC coverage is exempt. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: one new contract-safety finding with direct source and spec evidence.

## Ruled Out

- Fast cancel mirror missing: rejected. `requestCancel` sets the in-process Set before DB persistence and `isCancelRequestedFast` reads it without SQLite I/O. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:324-349]
- Tail-loop cancel checks missing entirely: rejected. The metadata promoter and causal-chain loops both check cancellation at their configured yield intervals. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1191-1206] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1311-1324]

## Dead Ends

- Code graph structural analysis: skipped because graph readiness was stale; direct file reads were sufficient for this finding.

## Recommended Next Focus

Add or verify an abort check immediately before the inter-batch delay in `processBatches`, then add a regression test that uses a nonzero `delayMs` and flips `shouldAbort` after the first batch.

Review verdict: CONDITIONAL
