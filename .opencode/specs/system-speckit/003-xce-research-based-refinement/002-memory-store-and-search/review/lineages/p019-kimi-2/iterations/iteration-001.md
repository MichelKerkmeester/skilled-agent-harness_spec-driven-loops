# Iteration 1: Correctness — marker writer, predicate, and launcher guard sites

## Focus

- Dimension: Correctness (with spec_code traceability protocol execution).
- Files reviewed:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
  - `.opencode/bin/lib/model-server-supervision.cjs`
  - `.opencode/bin/mk-spec-memory-launcher.cjs`
  - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md`

## Scorecard

- Dimensions covered: correctness
- Files reviewed: 5
- New findings: P0=0 P1=1 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P1, Required

- **F001**: Maintenance marker payload omits required `jobId` field, `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:44-50`. The marker written by `beginMaintenance` contains `childPid`, `activeUntilMs`, `labels`, and `refreshedAtIso` but no `jobId`. REQ-001 in `spec.md:103` explicitly requires `{ childPid, activeUntilMs, jobId, refreshedAtIso }`. The launcher predicate ignores the field, so runtime behavior is unaffected, but the shipped artifact does not match the approved spec.

### P2, Suggestion

- **F002**: Spec TTL value is stale relative to implementation, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md:103`. The spec states a 60s TTL, but the shipped code uses `MAINTENANCE_MARKER_TTL_MS = 180_000` (`maintenance-marker.ts:25`). The implementation summary documents the rationale (a 60s TTL lapsed during a ~79s blocking tail phase), but the normative spec text was not updated to reflect the accepted value.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `maintenance-marker.ts:22-50`, `spec.md:103`, `spec.md:128-134` | Marker payload shape drifts from spec (jobId missing); TTL value drifts (60s vs 180s). Guard sites and predicate match spec. |
| checklist_evidence | pass | hard | — | Level-1 spec folder has no `checklist.md`; gate not applicable. |

## Claim Adjudication Packets

```json
{
  "findingId": "F001",
  "claim": "The maintenance marker payload written by beginMaintenance omits the jobId field that spec.md REQ-001 requires.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:44-50",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md:103"
  ],
  "counterevidenceSought": "Grepped maintenance-marker.ts for jobId, checked the launcher reader shouldAdoptDespiteProbe for any dependency on jobId, and confirmed the implementation summary does not mention removing jobId.",
  "alternativeExplanation": "The field may have been intentionally replaced by the labels array to support overlapping maintenance sources, but no spec amendment documents that change.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "If the spec is amended to require labels instead of jobId, or if jobId is added to the marker payload, downgrade to P2.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: Both findings are new. F001 is a spec/implementation mismatch on a required field. F002 is a documentation drift between the normative spec and the shipped TTL.

## Ruled Out

- Synchronous-path scan not protected: ruled out because the spec restricts the marker to background scans and the synchronous foreground path intentionally does not write it.
- Marker not cleared on failure: ruled out because the background scan IIFE wraps the marker in a `try/finally` covering complete, cancelled, failed, and thrown exits.

## Dead Ends

- None.

## Recommended Next Focus

Loop is capped at one iteration; proceed to synthesis.

Review verdict: CONDITIONAL
