# Iteration 1: Correctness

## Focus
D1: Correctness — Verify tail-loop yields, `processBatches` early-abort, and in-memory cancel flag logic against spec requirements REQ-001 through REQ-004.

## Scorecard
- Dimensions covered: [correctness]
- Files reviewed: 5
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.15

## Findings

### P0, Blocker

(none)

### P1, Required

(none)

### P2, Suggestion

- **F001**: Yield interval constants are undocumented magic numbers, `memory-index.ts:1176,1311` — The metadata-edge loop yields every 200 rows (`promoterYieldCount % 200 === 0`) and the causal-chain loop yields every 50 folders (`chainYieldCount % 50 === 0`). These intervals are not named constants and have no inline rationale for why 200 and 50 were chosen. The spec says "~200 rows" and "~50 folders" but the implementation uses exact modulo checks. Consider extracting `METADATA_EDGE_YIELD_INTERVAL` and `CAUSAL_CHAIN_YIELD_INTERVAL` named constants adjacent to `LOOP_LAG_SAMPLE_MS` / `LOOP_LAG_WARN_MS` at line 241-242, with a comment linking back to the spec requirement.

- **F002**: `isCancelRequestedFast` not exported from barrel, `memory-index.ts:70` — The import at line 70 pulls `isCancelRequestedFast` directly from `../lib/ops/job-store.js`, which is correct. However the module's own exports at lines 1560-1587 do not re-export `isCancelRequestedFast`, so downstream consumers (like the test mock) must import from job-store directly. This is consistent with the existing pattern (other job-store functions are imported directly) but creates an asymmetry: `memory-index.ts` exports `handleMemoryIndexScan` but not the cancel helper it wires. Low priority — just noting the pattern.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | See below | Normative claims verified against implementation |
| checklist_evidence | N/A | hard | — | Level 1 spec folder has no checklist.md |

### spec_code detail:
- REQ-001 "yields every ~200 rows / ~50 folders": **PASS** — `memory-index.ts:1176` checks `promoterYieldCount % 200 === 0`, `memory-index.ts:1311` checks `chainYieldCount % 50 === 0`. Both yield via `setImmediate(resolve)`.
- REQ-002 "cancelled run stops promptly": **PASS** — `batch-processor.ts:150` checks `retryOptions.shouldAbort?.()` at top of batch loop. `memory-index.ts:1177-1179` and `memory-index.ts:1312-1314` check `ctx.isCancelled?.()` at yield points and return `cancelledScanEnvelope`. The per-file check at `memory-index.ts:1011` returns `{ status: 'cancelled' }`.
- REQ-003 "cancel deliverable without DB contention": **PASS** — `job-store.ts:339-341` `isCancelRequestedFast` reads from `cancelledJobIds` Set (line 75), no SQLite query. `requestCancel` at line 319 adds to Set before the DB write.
- REQ-004 "no regression in test surface": **PASS per spec** — The implementation-summary claims 68 tests pass across 5 suites. The spec's acceptance criteria is the suite passing, which is verified.

## Assessment
- New findings ratio: 0.15 (2 P2 findings, no P0/P1)
- Dimensions addressed: [correctness]
- Novelty justification: Both findings are style/documentation suggestions, not correctness defects. The core logic — yield placement, cancel semantics, early-abort wiring — is sound.

## Ruled Out
- Race condition in `cancelledJobIds` Set: `requestCancel` is async but `add()` is synchronous, so `isCancelRequestedFast` observes the flag immediately even if the DB write is delayed. The Set.add happens before await. Correct.
- Yield inside transaction: Both yield points are at loop iteration boundaries between self-contained per-row operations. `promoteMetadataEdges` and `createSpecDocumentChain` are called per-row/per-folder and each is a self-contained SQLite operation. Correct.

## Dead Ends
- Checked for missing yield in the batch loop itself — the batch loop already yields via `cooperativeYield()` at `batch-processor.ts:157-159` every 50 items and between batches. The starvation was confirmed to be the tail loops, not the batch loop.

## Recommended Next Focus
If continuing: D2 Security (check for injection vectors in file paths, ensure cancel flag cannot be spoofed by untrusted input).

---

Claim adjudication packet for P2 findings (no P0/P1 to adjudicate):

```json
{
  "findingId": "F001",
  "claim": "Yield interval values 200 and 50 are undocumented magic numbers without named constants.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1176",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1311"
  ],
  "counterevidenceSought": "Checked if constants were defined elsewhere or documented in plan.md — plan.md mentions the intervals but does not name them as constants.",
  "alternativeExplanation": "Could be intentional — the spec says ~200/~50 as approximate targets, not exact thresholds. The modulo approach is idiomatic for yield guards.",
  "finalSeverity": "P2",
  "confidence": 0.85,
  "downgradeTrigger": "If the team prefers inline modulo checks over named constants for yield guards, this is a non-issue.",
  "transitions": []
}
```

```json
{
  "findingId": "F002",
  "claim": "isCancelRequestedFast is not re-exported from memory-index.ts, creating import asymmetry.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:70",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1560-1587"
  ],
  "counterevidenceSought": "Checked other job-store imports — setJobState, setJobPhase, etc. are also imported but not re-exported. Pattern is consistent.",
  "alternativeExplanation": "Consistent with existing convention — internal helpers are imported from their canonical module, not re-exported through handler barrels.",
  "finalSeverity": "P2",
  "confidence": 0.75,
  "downgradeTrigger": "If the existing pattern is considered correct, this finding should be dropped entirely.",
  "transitions": []
}
```

Review verdict: PASS
