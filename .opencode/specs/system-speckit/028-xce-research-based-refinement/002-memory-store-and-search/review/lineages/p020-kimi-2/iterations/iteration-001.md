# Iteration 1: Correctness and spec-alignment of the reference-counted maintenance marker

## Focus

- Dimension: Correctness (primary), Traceability (secondary)
- Files reviewed:
  - `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts`
  - `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts`
  - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/spec.md`
  - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/plan.md`
  - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/020-maintenance-grace-background-embedding/implementation-summary.md`

## Scorecard

- Dimensions covered: correctness, traceability
- Files reviewed: 7
- New findings: P0=0 P1=2 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.57

## Findings

### P1, Required

- **F001**: Synchronous foreground `memory_index_scan` path is not protected by the maintenance marker.
  - `handlers/memory-index.ts:1489-1491`
  - The synchronous branch (`args.background === false`) calls `runIndexScan(args, {})` directly without acquiring a maintenance marker. The background branch at `handlers/memory-index.ts:1502-1541` correctly calls `beginMaintenance('index_scan')` and ends it in a `finally`.
  - The spec states that "the scan IIFE in `handlers/memory-index.ts`" is refactored onto the shared module (`spec.md` §3, `plan.md` §3). While the background scan job is protected, the foreground/synchronous scan path—which is the default for callers that do not pass `background: true`—remains unprotected and could be reaped mid-scan during a launcher re-election.
  - Dimension: correctness / traceability
  - Category: correctness
  - Content hash: `sha256:memory-index.ts:1489:synchronous-scan-unprotected`

- **F002**: `writeMarker()` does not handle failures from `atomicWriteFile`.
  - `lib/storage/maintenance-marker.ts:44-51`
  - `writeMarker()` calls `atomicWriteFile` synchronously with no `try/catch`. The 20-second refresh timer (`lib/storage/maintenance-marker.ts:63`) invokes `writeMarker` unconditionally. If the write fails due to a transient disk or permission error, the unhandled exception in the timer callback will crash the daemon rather than letting the marker lapse gracefully.
  - Dimension: correctness
  - Category: correctness
  - Content hash: `sha256:maintenance-marker.ts:44:writeMarker-unhandled-errors`

### P2, Suggestion

- **F003**: `__resetMaintenanceMarkerForTest()` clears in-memory state but leaves the marker file on disk.
  - `lib/storage/maintenance-marker.ts:87-91`
  - The test-only reset helper resets counters and clears the timer but does not remove the marker file. If a test creates a marker and then resets without ending, the file persists until `afterEach` cleans the temp directory. This is a test-hygiene issue, not a production bug.
  - Dimension: maintainability
  - Category: maintainability
  - Content hash: `sha256:maintenance-marker.ts:87:test-reset-leaves-file`

- **F004**: Implementation summary frames verification as passed without clarifying the scope of marker coverage.
  - `implementation-summary.md:88-92`
  - The verification table lists "Existing scan-job + launcher-guard suites | PASS" but does not note that marker protection is currently limited to the background scan path. Adding a one-line scope note would reduce ambiguity when the synchronous-path gap is addressed.
  - Dimension: traceability
  - Category: traceability
  - Content hash: `sha256:implementation-summary.md:88:verification-scope-note`

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `handlers/memory-index.ts:1489-1491`, `handlers/memory-index.ts:1502-1541` | Most spec claims verified; synchronous scan path protection is ambiguous/missing relative to spec wording |
| checklist_evidence | notApplicable | hard | — | No `checklist.md` present in spec folder |
| feature_catalog_code | notApplicable | advisory | — | No feature catalog drift detected |
| playbook_capability | notApplicable | advisory | — | No playbook scenarios reviewed |

## Claim Adjudication Packets

```json
{
  "findingId": "F001",
  "claim": "The synchronous foreground memory_index_scan path does not acquire a maintenance marker, leaving it unprotected during launcher re-election.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1489-1491",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1502-1541"
  ],
  "counterevidenceSought": "Re-read the spec scope (spec.md §3) and plan (plan.md §3) to confirm whether 'scan IIFE' refers only to the background job. The background path does call beginMaintenance. Searched for other beginMaintenance calls in memory-index.ts; none found on the synchronous path.",
  "alternativeExplanation": "The spec authors may have intentionally scoped marker protection to background scans only, treating synchronous scans as short-lived and not worth marking. However, a force reindex can be long-running and the spec wording does not explicitly exclude the synchronous path.",
  "finalSeverity": "P1",
  "confidence": 0.78,
  "downgradeTrigger": "If the spec is amended to state explicitly that only background scans are protected, downgrade to P2 documentation gap.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F002",
  "claim": "An unhandled exception inside the marker refresh timer callback can crash the daemon when atomicWriteFile fails.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:44-51",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:63"
  ],
  "counterevidenceSought": "Checked whether atomicWriteFile is documented as never throwing (it is not). Checked for any uncaughtException handler in the mcp_server entry points that would absorb timer errors; none is guaranteed.",
  "alternativeExplanation": "The filesystem write could be considered infallible in production because DATABASE_DIR is always writable. Disk-full or permission-denied errors are rare, but if they occur a daemon crash is worse than a lapsed marker.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "If atomicWriteFile is made to swallow all errors or a global uncaughtException handler is added that specifically handles timer errors, downgrade to P2.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Assessment

- New findings ratio: 0.57
- Dimensions addressed: correctness, traceability
- Novelty justification: Four findings surfaced on the first correctness pass. Two are P1 (synchronous-path protection gap and unhandled marker-write errors). Two are P2 (test-hygiene and verification framing). No P0 findings. The new-info ratio is high because this is the first and only iteration.

## Ruled Out

- Security vulnerability in marker module: the module does not handle secrets or user input; no new exposure introduced.
- Race between scan and embedding queue: reference counting via `activeCount` is simple and correct for the current two-holder overlap.

## Dead Ends

- Searching for an inline marker writer leftover from 019 in memory-index.ts: no inline writer remains; only the shared module is used.

## Recommended Next Focus

Iteration budget exhausted. Synthesize findings and route to remediation planning.

Review verdict: CONDITIONAL
