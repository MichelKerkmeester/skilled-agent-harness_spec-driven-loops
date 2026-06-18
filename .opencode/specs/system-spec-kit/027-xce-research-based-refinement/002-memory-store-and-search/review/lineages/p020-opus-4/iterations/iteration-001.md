# Iteration 1: Full-breadth review (correctness, security, traceability, maintainability)

## Focus
Single capped iteration (maxIterations=1) covering all four dimensions over the
020-maintenance-grace-background-embedding deliverables:
- `mcp_server/lib/storage/maintenance-marker.ts` (new shared reference-counted marker)
- `mcp_server/handlers/memory-index.ts` (scan IIFE refactor, lines ~1496–1543)
- `mcp_server/lib/providers/retry-manager.ts` (`runBackgroundJob`, lines ~1012–1062)
- `mcp_server/tests/maintenance-marker.vitest.ts` (unit coverage)
- Launcher read contract: `.opencode/bin/lib/model-server-supervision.cjs`
  (`readMaintenanceMarker`, `shouldAdoptDespiteProbe`)

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 5 (3 changed source + 1 test + 1 launcher consumer) plus 4 spec docs
- New findings: P0=0 P1=0 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.30

## Findings

### P0, Blocker
- None.

### P1, Required
- None.

### P2, Suggestion
- **F001**: Refcount increment precedes the throwable marker write with no rollback,
  `mcp_server/lib/storage/maintenance-marker.ts:59`, In `beginMaintenance` the order is
  `activeCount += 1` (line 59) → `activeLabels.push(label)` (line 60) → `writeMarker()`
  (line 61). `writeMarker` calls `atomicWriteFile` which can throw (disk-full /
  permission). On throw, the function propagates before returning a handle, so the
  caller never gets an `end()` to call, leaving `activeCount` stuck at a non-zero value.
  A later legitimate holder then creates the refresh timer (line 62-65) and `activeCount`
  never returns to 0, so the marker file is refreshed indefinitely and the daemon could
  stay un-reapable past its work. Low probability (requires an fs write fault) and it
  degrades to over-protection, not data loss; the 180s TTL only bounds it once a write
  actually lands. Suggest incrementing the count after a successful write, or rolling
  back the count/label in a catch. [SOURCE: mcp_server/lib/storage/maintenance-marker.ts:58-66]

- **F002**: Embedding-queue protection depends on the implicit per-await yield with no
  call-site note, `mcp_server/lib/providers/retry-manager.ts:1038`, The scan path refreshes
  explicitly at phase boundaries (`maintenance.refresh()` in `onPhase`,
  memory-index.ts:1510) because "a non-yielding phase cannot fire the interval timer"
  (marker module comment, lines 28-30). The embedding queue never calls `refresh()`; it
  relies solely on the 20s `setInterval` auto-refresh. That is correct ONLY because
  `processRetryQueue` awaits `retryEmbedding` → `generateDocumentEmbedding` per row
  (retry-manager.ts:903, 944, 714), yielding to the event loop so the interval can fire
  between items. The safety rests on that yield being preserved; a future change making
  embedding generation synchronous/CPU-bound in-process would silently break marker
  refresh during a long burst. The rationale is not documented at the queue call site.
  Suggest a one-line comment at retry-manager.ts:1038 noting the queue is refresh-free
  because it yields per await. [SOURCE: mcp_server/lib/providers/retry-manager.ts:1036-1047]

- **F003**: On-disk `labels` field goes stale between writes, `mcp_server/lib/storage/maintenance-marker.ts:72`,
  `end()` only decrements the in-memory `activeCount` and splices `activeLabels`; it does
  not re-serialize the file unless `activeCount` hits 0 (which removes it). So while a
  second holder remains, the persisted `.maintenance-active.json` still lists the ended
  holder's label until the next begin/refresh/timer write. The unit test explicitly
  documents and asserts this behavior (maintenance-marker.vitest.ts:92-104). Cosmetic
  only: the launcher consumes just `childPid` and `activeUntilMs`
  (model-server-supervision.cjs:619, 632-637), never `labels`. No action required beyond
  awareness. [SOURCE: mcp_server/lib/storage/maintenance-marker.ts:72-83]

- **F004**: Residual unprotected window between scan-end and the first embedding tick when
  they do not overlap, `mcp_server/handlers/memory-index.ts:1540`, The scan holds
  `index_scan` and `end()`s when `runIndexScan` resolves (memory-index.ts:1540); the
  embedding queue only begins maintenance on a tick that finds pending rows
  (retry-manager.ts:1032-1038). If the scan completes before any embedding tick fires
  (fast scan, or interval gap), `activeCount` momentarily returns to 0 and the marker is
  removed until the next busy tick re-creates it. In that gap the daemon is idle (doing no
  embedding work), so a reap there loses no in-flight embedding and the deferred rows drain
  on a later queue pass — consistent with the documented "un-reaped, not responsive" and
  deferred-drain behavior. In practice the frequent background interval plus pending rows
  written during the scan make the overlap (refcount=2) the common case. Observational; no
  fix needed for this phase's stated scope. [SOURCE: mcp_server/lib/providers/retry-manager.ts:1032-1038]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | maintenance-marker.ts:58-84; retry-manager.ts:1032-1055; memory-index.ts:1502-1540; model-server-supervision.cjs:619,632-637 | Every REQ-001..004 normative claim resolves to shipped code; the "launcher reads the marker exactly as in 019" claim is confirmed (launcher consumes only childPid+activeUntilMs, both still written). |
| checklist_evidence | n/a | hard | spec.md SPECKIT_LEVEL:1 | Level 1 folder has no checklist.md; protocol is not applicable. Verification table in implementation-summary.md:84-93 records Build/test/deploy PASS. |
| feature_catalog_code | n/a | advisory | — | No feature-catalog entry in scope for this packet. |

## Requirement Traceability
- **REQ-001** (shared reference-counted module): PASS. `beginMaintenance(label) -> { refresh(), end() }`, `.maintenance-active.json`, 180s TTL (line 25), 20s self-refresh (line 26, 63), present while ≥1 holder, removed at 0 (line 78-81), idempotent `end()` (line 73 `ended` flag). [maintenance-marker.ts:22-84]
- **REQ-002** (embedding queue protected): PASS. `beginMaintenance('embedding-queue')` after the empty-queue guard (retry-manager.ts:1032-1038), `end()` in the existing `finally` (line 1055). [retry-manager.ts:1024-1061]
- **REQ-003** (scan + queue overlap without clobbering): PASS. Singleton module-level `activeCount`/`activeLabels` shared across both in-process sources; neither `end()` removes the file until the count reaches 0. [maintenance-marker.ts:36-83]
- **REQ-004** (idle tick never marks): PASS. Empty-queue guard returns before `beginMaintenance` (retry-manager.ts:1032-1034); `finally` `end()` is a safe no-op on the null handle. [retry-manager.ts:1024,1032-1034,1052-1055]

## Assessment
- New findings ratio: 0.30 (4 P2 advisories surfaced across 5 files; no P0/P1).
- Dimensions addressed: correctness (refcount lifecycle, overlap, idempotency, idle guard),
  security (no secrets, fixed path, internal-only labels, TTL-bounded leak), traceability
  (spec_code pass, all REQs mapped), maintainability (call-site rationale, stale-label
  cosmetics, write-fault robustness).
- Novelty justification: each finding is a distinct, separately-cited surface; none are
  refinements of a prior finding (single iteration).
- Verification note: the marker unit test could not be executed in this fan-out sandbox
  (command approval blocked `vitest run`); the iteration relies on static review of the
  test file plus the documented verification evidence in implementation-summary.md:84-93.

## Ruled Out
- "Schema change breaks the 019 launcher": ruled out. Launcher reads only `childPid` and
  `activeUntilMs` (model-server-supervision.cjs:619,632-637); dropping `jobId` and adding
  `labels` is read-compatible. [Evidence: model-server-supervision.cjs:615-637]
- "Idle embedding tick leaves a lingering marker": ruled out. begin is gated behind the
  empty-queue return. [Evidence: retry-manager.ts:1032-1038]
- "end() double-call throws or double-removes": ruled out by the `ended` guard and
  `rmSync({force:true})` in a try/catch. [Evidence: maintenance-marker.ts:72-81]

## Dead Ends
- Executing the test/build suite to confirm SC-001 live: blocked by sandbox command
  approval; not pursued further.

## Recommended Next Focus
None required for a PASS verdict. If a follow-on pass is desired, validate F001 by
fault-injecting an `atomicWriteFile` throw and asserting `activeCount` does not leak, and
confirm F002's yield assumption survives any future in-process embedder.

Review verdict: PASS
