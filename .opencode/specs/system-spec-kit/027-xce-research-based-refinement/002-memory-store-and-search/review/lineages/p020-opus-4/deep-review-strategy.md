# Deep Review Strategy — 020-maintenance-grace-background-embedding (lineage p020-opus-4)

<!-- ANCHOR:topic -->
## Topic
Review the 020 deliverables that widen the maintenance-active marker to cover the
post-scan background-embedding queue: a shared reference-counted marker module, the scan
IIFE refactored onto it, and the embedding queue wired in after its empty-queue guard.
Verdict-relevant question: is the daemon protected end-to-end through a reindex (scan +
deferred-embedding burst) without breaking the 019 launcher read contract or the
idle-tick-never-marks guarantee?
<!-- /ANCHOR:topic -->

<!-- ANCHOR:review-dimensions -->
## Review Dimensions (remaining)
- [x] Correctness
- [x] Security
- [x] Traceability
- [x] Maintainability

All four covered in the single capped iteration (config.maxIterations=1).
<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## Completed Dimensions
- [x] Correctness — refcount lifecycle, scan/queue overlap, idempotent end, idle guard. PASS (P2 advisories only).
- [x] Security — no secrets in marker, fixed path (no traversal), internal-only labels, TTL-bounded leak. PASS.
- [x] Traceability — spec_code PASS (REQ-001..004 mapped); checklist_evidence N/A (Level 1). PASS.
- [x] Maintainability — call-site rationale gap, stale-label cosmetics, write-fault robustness. PASS (P2 advisories).
<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## Running Findings
- P0: 0 (Δ0)
- P1: 0 (Δ0)
- P2: 4 (Δ+4) — F001 refcount-before-write rollback, F002 undocumented yield reliance, F003 stale labels (cosmetic), F004 non-overlap gap (observational)
<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:what-worked -->
## What Worked
- Tracing the launcher read contract (`model-server-supervision.cjs:619,632-637`) decisively confirmed the "reads the marker exactly as in 019" claim: only `childPid` + `activeUntilMs` are consumed, so the `jobId`→`labels` schema change is read-compatible.
- Reading `runBackgroundJob` end-to-end confirmed the empty-queue guard precedes `beginMaintenance`, closing REQ-004.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## What Failed
- Executing the marker unit test / build live (sandbox blocked `vitest run` on command approval). Fell back to static review of the test file plus the documented verification table.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## Exhausted Approaches
- Live test/build execution in this fan-out sandbox — not available.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## Ruled-Out Directions
- Schema-change-breaks-launcher: ruled out (launcher ignores `labels`/`jobId`).
- Idle tick leaves a lingering marker: ruled out (begin gated behind empty-queue return).
- end() double-call hazard: ruled out (`ended` guard + `rmSync({force:true})`).
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## Next Focus
None required for PASS. Optional follow-on: fault-inject an `atomicWriteFile` throw to
validate F001 (no refcount leak), and re-check F002's yield assumption if the embedder ever
moves in-process.
<!-- /ANCHOR:next-focus -->

<!-- ANCHOR:known-context -->
## Known Context
- Predecessor 019 protected only the scan; this phase widens the writer to the embedding queue.
- `resource-map.md` not present in the target folder. Skipping coverage gate.
- Tuned retry config (`SPECKIT_RETRY_BATCH_SIZE=100`, `SPECKIT_RETRY_INTERVAL_MS=5000`); protection does not depend on the tuned interval (per-tick re-mark).
<!-- /ANCHOR:known-context -->

<!-- ANCHOR:cross-reference-status -->
## Cross-Reference Status
| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | pass | REQ-001..004 all map to shipped code with file:line evidence |
| checklist_evidence | core | n/a | Level 1 folder, no checklist.md |
| feature_catalog_code | overlay | n/a | No catalog entry in scope |
<!-- /ANCHOR:cross-reference-status -->

<!-- ANCHOR:files-under-review -->
## Files Under Review
| File | Coverage | State |
|------|----------|-------|
| mcp_server/lib/storage/maintenance-marker.ts | full | reviewed (F001, F003) |
| mcp_server/handlers/memory-index.ts (scan IIFE) | full | reviewed |
| mcp_server/lib/providers/retry-manager.ts (runBackgroundJob) | full | reviewed (F002, F004) |
| mcp_server/tests/maintenance-marker.vitest.ts | full (static) | reviewed |
| .opencode/bin/lib/model-server-supervision.cjs (read contract) | targeted | reviewed |
<!-- /ANCHOR:files-under-review -->

<!-- ANCHOR:review-boundaries -->
## Review Boundaries
- Max iterations: 1 (fan-out cap). Convergence threshold 0.10. Severity floor P2.
- Observation-only: no target files modified.
- Non-Goals: re-reviewing the unchanged 019 launcher adopt/reap guard logic; running a live reindex (deploy-time check).
- Stop Conditions: maxIterations reached with all 4 dimensions covered and core traceability executed.
<!-- /ANCHOR:review-boundaries -->
