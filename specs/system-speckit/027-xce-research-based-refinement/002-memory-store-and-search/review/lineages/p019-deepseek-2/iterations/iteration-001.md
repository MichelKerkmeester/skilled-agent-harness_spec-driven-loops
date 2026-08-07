# Iteration 001: Correctness — maintenance-grace marker & launcher guard

## Focus
D1 Correctness — verify the daemon marker writer (`lib/storage/maintenance-marker.ts`), the launcher supervision predicate (`bin/lib/model-server-supervision.cjs` L615-640), both launcher guard sites (`bin/mk-spec-memory-launcher.cjs` L820-824 dead-socket, L1688-1693 stale-reclaim), and the background scan integration (`handlers/memory-index.ts` L1496-1542) implement REQ-001 through REQ-004 faithfully and handle edge cases correctly.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 6
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.0

## Findings

### P2, Suggestion
- **F001**: Spec/implementation marker-shape drift: spec describes `{ childPid, activeUntilMs, jobId, refreshedAtIso }` but implementation writes `{ childPid, activeUntilMs, labels, refreshedAtIso }`. The `labels` array replaces `jobId` to support reference-counted overlapping maintenance sources (scan + embedding queue). The launcher correctly ignores extra fields and only reads `childPid`/`activeUntilMs`. Spec should be updated to reflect the `labels` design.
  - [SOURCE: spec.md:103, lib/storage/maintenance-marker.ts:44-51]
  - Category: traceability
  - Dimension: correctness

- **F002**: TTL divergence: spec says "60s TTL" (REQ-001), implementation uses 180s. This was an intentional live-learned correction (the longest blocking tail phase was ~79s, so 60s expired mid-scan and the daemon was reaped). Documented in implementation-summary.md L56 as a known deviation. Spec should be updated to match.
  - [SOURCE: spec.md:103, lib/storage/maintenance-marker.ts:25, implementation-summary.md:56]
  - Category: traceability
  - Dimension: correctness

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:103-104, maintenance-marker.ts:44-51, model-server-supervision.cjs:632-640, mk-spec-memory-launcher.cjs:820-824,1688-1693 | Core behavior verified: all 4 REQs satisfied. Two P2 spec-drifts identified (marker shape, TTL). |
| checklist_evidence | N/A | hard | — | Level 1 spec, no checklist.md |

## Assessment
- New findings ratio: 0.0 — no new P0/P1 issues surfaced
- Dimensions addressed: correctness
- Novelty justification: First iteration on this lineage. All 4 REQs verified against implementation with file:line evidence.

### REQ-001 (Daemon marker writer): VERIFIED
- `beginMaintenance('index_scan')` called at L1502 of memory-index.ts ✓
- Marker written with `{ childPid, activeUntilMs, labels, refreshedAtIso }` via `atomicWriteFile` at maintenance-marker.ts:44-51 ✓
- 20s refresh timer via `setInterval` at maintenance-marker.ts:63 ✓
- Phase-boundary `refresh()` on every `onPhase` callback at memory-index.ts:1510 ✓
- `end()` in `finally` block (L1540) covers all terminal exits ✓
- Reference-counted: marker persists until last holder ends (maintenance-marker.ts:58-84) ✓
- Marker removed on last `end()` via `rmSync` (maintenance-marker.ts:80) ✓

### REQ-002 (Launcher adopts at both guard sites): VERIFIED
- Dead-socket respawn path: `readMaintenanceMarker` + `shouldAdoptDespiteProbe` at L820-824, refuses respawn with `reason: 'maintenance-active'` ✓
- Stale-reclaim adopt path: same guard at L1688-1693, adopts via bridge when marker is fresh ✓
- Both sites log the decision with marker expiry time for auditability ✓

### REQ-003 (Fails safe toward reaping): VERIFIED
- No marker → `shouldAdoptDespiteProbe` returns `false` (L634) ✓
- Expired `activeUntilMs` → returns `false` (L637: `marker.activeUntilMs > nowMsFromOptions(options)`) ✓
- `childPid` mismatch → returns `false` (L636) ✓
- Non-`'alive'` liveness → returns `false` (L638) ✓
- Invalid `childPid` (0, negative, NaN) → returns `false` (L635) ✓
- All cases confirmed by unit test `launcher-maintenance-guard.vitest.ts` ✓

### REQ-004 (Marker dir resolution): VERIFIED
- `maintenanceMarkerDir()` at L329-333: `SPEC_KIT_DB_DIR || SPECKIT_DB_DIR` precedence, then `resolvedDbDir()` ✓
- Matches daemon's `DATABASE_DIR` from `core/config.js` ✓
- Testable under fake-root via `SPEC_KIT_DB_DIR` env ✓

## Ruled Out
- **TOCTOU between marker read and reap**: The guard reads the marker and decides adopt-vs-reap inline; if the marker expires between read and reap, the next probe cycle catches it. Purely advisory — the bounded window is the intended design.
- **Missing `finally` block in background scan**: Confirmed present (L1536-1541, memory-index.ts). Covers complete/cancelled/failed/thrown paths.

## Dead Ends
(None)

## Recommended Next Focus
D2 Security — review for any trust-boundary issues: can a malicious marker file pin a dead daemon? (No — validated. `readMaintenanceMarker` returns `null` for corrupt JSON, `shouldAdoptDespiteProbe` fails safe without a valid marker.) D3 Traceability can then reconcile the P2 spec-drifts.

## Claim Adjudication

No P0/P1 findings to adjudicate.

Review verdict: PASS
