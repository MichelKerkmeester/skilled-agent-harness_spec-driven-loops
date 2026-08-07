# Deep Review Report

## Executive Summary

- Verdict: CONDITIONAL
- hasAdvisories: false
- Active findings: P0=0, P1=1, P2=0
- Stop reason: maxIterationsReached
- Iterations: 1 of 1
- Scope: Level 1 spec packet for reindex-scan responsiveness and cancellation, plus the touched cancellation implementation and tests.
- Release-readiness state: in-progress

The review found one active P1: `processBatches` has a `shouldAbort` early-abort hook, but cancellation requested after a batch still waits through the inter-batch pacing delay before the next abort check.

## Planning Trigger

`/speckit:plan` is required for a narrow remediation unless the team intentionally accepts the bounded delay as a documented limitation.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "F001",
      "severity": "P1",
      "title": "Cancel still waits through the inter-batch delay when cancellation arrives after a batch",
      "file": ".opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts",
      "line": 172,
      "findingClass": "contract_safety"
    }
  ],
  "remediationWorkstreams": [
    {
      "id": "WS1",
      "title": "Make inter-batch pacing delay abortable",
      "findings": ["F001"]
    }
  ],
  "specSeed": [
    "Clarify whether cancellation must bypass an already-scheduled inter-batch delay or only stop before the next batch starts."
  ],
  "planSeed": [
    "Add a shouldAbort check immediately before the inter-batch delay in processBatches, or replace the delay with an abortable wait.",
    "Add a regression test with nonzero delayMs that flips shouldAbort after the first batch and asserts no delay wait occurs."
  ],
  "findingClasses": ["contract_safety"],
  "affectedSurfacesSeed": [
    ".opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts",
    ".opencode/skills/system-spec-kit/mcp_server/tests/job-store-cancel-lifecycle.vitest.ts"
  ],
  "fixCompletenessRequired": false
}
```

## Active Finding Registry

| ID | Severity | Title | Dimension | Evidence | Disposition |
|----|----------|-------|-----------|----------|-------------|
| F001 | P1 | Cancel still waits through the inter-batch delay when cancellation arrives after a batch | correctness | `.opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts:149-173`; `plan.md:55`; `job-store-cancel-lifecycle.vitest.ts:42-73` | active |

### F001 Detail

- Impact: cancellation may still pay `delayMs` after the current batch completes before the next top-of-loop `shouldAbort` check runs.
- Fix recommendation: check `shouldAbort` before the inter-batch delay or make the delay abortable.
- findingClass: contract_safety
- scopeProof: touched primitive is named directly in the target packet.
- affectedSurfaceHints: `memory_index_scan` cancellation latency; shared `processBatches` behavior.

## Remediation Workstreams

| Workstream | Priority | Findings | Action |
|------------|----------|----------|--------|
| WS1: Abortable pacing delay | P1 | F001 | Add the missing pre-delay abort check or abortable timer and cover with a nonzero-delay test. |

## Spec Seed

- If the intended contract is "stop before starting the next batch only," update the packet wording that currently says the inter-batch pacing delay is skipped.
- If the intended contract is immediate no-delay cancellation between batches, keep the spec as-is and patch `processBatches`.

## Plan Seed

1. Patch `processBatches` so `retryOptions.shouldAbort?.()` is evaluated after each batch and before `setTimeout(delayMs)`.
2. Add a regression test that uses `batchSize=2`, nonzero `delayMs`, and a `shouldAbort` predicate that flips true after the first batch.
3. Re-run the batch-processor and job-store cancellation suites.

## Traceability Status

| Protocol | Gate | Status | Evidence | Notes |
|----------|------|--------|----------|-------|
| spec_code | hard | partial | `plan.md:55`, `batch-processor.ts:149-173` | One cancellation-contract mismatch. |
| checklist_evidence | hard | exempt | `spec.md:35` | Level 1 packet has no checklist. |
| feature_catalog_code | advisory | not-run | - | Not reached due one-iteration cap. |
| playbook_capability | advisory | not-run | - | Not reached due one-iteration cap. |
| AC_COVERAGE | advisory | exempt | `spec.md:35` | Level 1 target and no checklist. |

## Deferred Items

- Security review not executed in this lineage because `config.maxIterations` is 1.
- Maintainability review not executed in this lineage because `config.maxIterations` is 1.
- Full traceability review not executed beyond the sampled core protocol evidence.
- Launcher lease-heartbeat re-election remains outside the target packet's closed scope.

## Search Ledger

- hasSearchDebt: true
- graphCoverageMode: graphless_fallback
- Code graph status: stale; direct reads and exact Grep were used.
- Candidate coverage: `contract_safety` covered by direct read and exact search.
- Search debt: security dimension, maintainability dimension, and full traceability coverage remain unreviewed under the one-iteration cap.
- Ruled out: fast cancel mirror missing. Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts:324-349`.

## Audit Appendix

### Iteration Table

| Iteration | Focus | Ratio | Findings | Verdict |
|-----------|-------|-------|----------|---------|
| 001 | correctness | 1.00 | P0=0 P1=1 P2=0 | CONDITIONAL |

### Convergence Replay

- Max iterations reached: yes, 1 of 1.
- Dimension coverage: 1/4 = 0.25.
- Active P0/P1/P2: 0/1/0.
- Terminal verdict from findings: CONDITIONAL.
- No blocked_stop event emitted because maxIterationsReached is a terminal ceiling.

### Core Protocols

- `spec_code`: partial, F001.
- `checklist_evidence`: exempt, no checklist.

### Overlay Protocols

- `feature_catalog_code`: not-run.
- `playbook_capability`: not-run.

### Sources Reviewed

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation/plan.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation/tasks.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/018-reindex-scan-responsiveness-and-cancellation/implementation-summary.md`
- `.opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/job-store-cancel-lifecycle.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/handler-memory-index-scan-jobs.vitest.ts`
