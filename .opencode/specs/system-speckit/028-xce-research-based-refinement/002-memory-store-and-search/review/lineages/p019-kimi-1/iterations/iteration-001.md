# Iteration 001: Correctness

## Focus

- Dimension: correctness
- Files reviewed: maintenance-marker.ts, memory-index.ts, model-server-supervision.cjs, mk-spec-memory-launcher.cjs, retry-manager.ts, plus unit and stress tests
- Scope: runtime behavior of the maintenance-active marker writer and the launcher adopt-vs-reap predicate

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 7
- New findings: P0=0 P1=1 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P1, Required

- **F001**: Marker on-disk shape drifts from spec-mandated `jobId` field, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:45-50`. The writer serializes `{ childPid, activeUntilMs, labels, refreshedAtIso }`, while `spec.md:103` requires `{ childPid, activeUntilMs, jobId, refreshedAtIso }`. The launcher predicate only checks `childPid` and `activeUntilMs`, so the runtime path is currently intact, but the contract is drifted and the stress harness (`daemon-reelection-adoption-live.vitest.ts:363-368`) still writes `jobId`.

### P2, Suggestion

- **F002**: Spec docs reference stale `mcp_server/bin/` paths, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md:118`. The implementation actually ships under `.opencode/bin/`, making the spec, plan, and tasks stale.
- **F003**: Duplicate labels possible in maintenance marker, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:36-39`. `activeLabels` is a plain array without deduplication, so overlapping holders with the same label leave duplicate entries until the next refresh.
- **F004**: Marker write failures are silently dropped, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:44-51`. `writeMarker` ignores the boolean return value of `atomicWriteFile`, so a disk-write failure leaves the daemon unprotected without surfacing an error.
- **F005**: Implementation summary is stale about embedding-queue coverage, `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1038`. `implementation-summary.md:104` states the post-scan embedding queue is unprotected follow-on work, but `retry-manager.ts` already wraps embedding-queue bursts with `beginMaintenance('embedding-queue')`.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:103, maintenance-marker.ts:45-50 | Normative marker-shape claim partially met: runtime behavior matches, but serialized field name diverges. |
| checklist_evidence | pass | hard | implementation-summary.md:85-93 | Completion claims have supporting evidence; no unsupported marks observed. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: All five findings are new to this lineage. F001 is the highest-impact drift because it changes the on-disk contract that the launcher and tests both consume.

## Ruled Out

- N/A

## Dead Ends

- N/A

## Recommended Next Focus

security (not reachable in this lineage because maxIterations=1)

## Claim Adjudication Packet (F001)

```json
{
  "findingId": "F001",
  "claim": "The maintenance-active marker writer serializes `labels` instead of the spec-mandated `jobId`, creating a contract drift between spec.md and the shipped implementation.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:45-50",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md:103",
    ".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts:363-368"
  ],
  "counterevidenceSought": "Inspected the launcher predicate (shouldAdoptDespiteProbe) and the marker reader (readMaintenanceMarker); neither validates `jobId`/`labels`, so the runtime path is unaffected. The unit and stress tests still pass because the predicate ignores the extra/missing field.",
  "alternativeExplanation": "The field rename could be an intentional evolution from a single jobId to a reference-counted labels array; however, the spec and tests still speak `jobId`, so the drift is real and should be reconciled rather than ignored.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If the spec is updated to require `labels` instead of `jobId`, or if the reader is changed to validate `jobId` and tolerates its absence, downgrade to P2.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

Review verdict: CONDITIONAL
