# Iteration 001: Correctness + Traceability

## Focus
Combined review of correctness (does the marker mechanism work?) and traceability (does implementation match spec?), covering all files in the review scope.

Dimensions addressed: correctness, traceability
Files reviewed: 7

## Scorecard
- Dimensions covered: correctness, traceability
- Files reviewed: 7
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.55

## Findings

### P0, Blocker
None found.

### P1, Required
- **F001**: Spec file-to-change table diverges from actual compiled file locations, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md:116-118`, The spec.md "Files to Change" table lists `mcp_server/bin/lib/model-server-supervision.cjs` and `mcp_server/bin/mk-spec-memory-launcher.cjs` as the paths for the supervision predicate and launcher. The actual compiled files shipped with the daemon reside at `.opencode/bin/lib/model-server-supervision.cjs` and `.opencode/bin/mk-spec-memory-launcher.cjs` respectively (`model-server-supervision.cjs` exports `readMaintenanceMarker` and `shouldAdoptDespiteProbe` at lines 611-640; `mk-spec-memory-launcher.cjs` exports at lines 1845-1847). The test file `launcher-maintenance-guard.vitest.ts:13` correctly requires from `../../../../bin/mk-spec-memory-launcher.cjs`, confirming the actual location. This path drift means the spec table is not an accurate find-the-shipped-file reference for operators or follow-on auditors.

### P2, Suggestion
- **F002**: implementation-summary.md "Known Limitations" (line 104) states the embedding queue is not marker-protected and suggests extending protection as follow-on work, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/implementation-summary.md:104`, The current code at `retry-manager.ts:1038` already calls `beginMaintenance('embedding-queue')` and releases in a `finally` block at line 1055, so the embedding queue IS protected via the reference-counted marker. The limitation document is stale and should be updated to reflect the shipped state.

- **F003**: Spec and plan reference 60s TTL; implementation uses 180s TTL, `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md:76`, The spec.md (line 76 requirement description) and plan.md (line 55) specify a 60s TTL. The implementation at `maintenance-marker.ts:25` defines `MAINTENANCE_MARKER_TTL_MS = 180_000` (180s). The implementation-summary.md (line 56) documents the TTL increase was driven by a live issue where a ~79s blocking tail phase exhausted a 60s TTL. The divergence is justified and documented in the implementation summary, but the canonical spec and plan docs should be updated to reflect the shipped value for accuracy.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:116-118 vs bin/mk-spec-memory-launcher.cjs:1845-1847 | File paths in spec table diverge from actual locations; REQ-001/002/003/004 all verified in shipped code; TTL value differs (60s vs 180s) |
| checklist_evidence | n/a | hard | - | Level 1 spec, no checklist.md required |

## Assessment
- New findings ratio: 0.55 (3 new findings across 2 dimensions in single iteration; weighted by severity: 1*P1 + 2*P2 = 1*5.0 + 2*1.0 = 7.0 out of max)
- Dimensions addressed: correctness, traceability
- Novelty justification: All 3 findings are first-seen in this review lineage; F001 is a spec/code path mismatch not previously recorded; F002 identifies a stale limitation document; F003 is a known deviation but not previously recorded as a spec-maintenance item

## Adjudication

### F001 Claim Adjudication
```json
{
  "findingId": "F001",
  "claim": "Spec file-to-change table lists paths under mcp_server/bin/ but the actual compiled files reside under .opencode/bin/.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md:116-118",
    ".opencode/bin/lib/model-server-supervision.cjs:611-640",
    ".opencode/bin/mk-spec-memory-launcher.cjs:1845-1847",
    ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-maintenance-guard.vitest.ts:13"
  ],
  "counterevidenceSought": "Searched for model-server-supervision.cjs and mk-spec-memory-launcher.cjs under mcp_server/bin/ using Glob; no results. Searched for files under .opencode/bin/ and found both. Confirmed the test file correctly resolves the actual path.",
  "alternativeExplanation": "The spec was written before the source files were compiled/merged; in the TypeScript source tree the paths might have differed, but the shipped .cjs files ended up at a different location after the build/merge.",
  "finalSeverity": "P1",
  "confidence": 0.90,
  "downgradeTrigger": "If the spec table is updated to reflect actual compiled-file locations, downgrade to resolved.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Ruled Out
- **Marker write race between daemon and launcher**: The daemon writes the marker, the launcher reads it. The write uses `atomicWriteFile` (write-to-tmp-then-rename) which prevents partial reads. The reader is a simple `readFileSync` with JSON parse; a corrupt parse returns null and falls through to reap, which is fail-safe. No race condition that would cause false positives (incorrect adopt).
- **Interval timer preventing process exit**: The refresh timer uses `unref()` at `maintenance-marker.ts:64`, so it does not keep the event loop alive. The daemon exits cleanly when the scan finishes and the timer is cleared.

## Dead Ends
- None.

## Recommended Next Focus
All reviewable dimensions covered in this single-iteration fan-out lineage. Remaining dimensions (security, maintainability beyond F002/F003) would require additional iterations but maxIterations=1 is exhausted.

Review verdict: CONDITIONAL
