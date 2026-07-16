# Iteration 001: Correctness + Security + Traceability + Maintainability

## Focus
Single-iteration fan-out review (`maxIterations=1`) covering all four dimensions in one pass: does the maintenance-grace marker mechanism actually work and fail safe (correctness/security), and does the shipped code match the 019 packet docs (traceability/maintainability)? Findings were derived from the shipped source, not from the packet docs alone.

Dimensions addressed: correctness, security, traceability, maintainability
Files reviewed: 8

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 8
- New findings: P0=0 P1=1 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.50

## Files Under Review (resolved, shipped locations)
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts` — the reference-counted marker module (NOT listed in the spec's Files-to-Change table)
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1496-1543` — scan IIFE marker usage
- `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1012-1062` — embedding-queue marker usage (NOT listed in the spec's Files-to-Change table)
- `.opencode/bin/lib/model-server-supervision.cjs:609-640` — pure adopt predicate
- `.opencode/bin/mk-spec-memory-launcher.cjs:329-333, 820-825, 1688-1694` — marker-dir resolver + both guard sites
- `.opencode/skills/system-spec-kit/mcp_server/core/config.ts:63-107` — daemon `DATABASE_DIR` resolution (parity check)
- `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-maintenance-guard.vitest.ts` — predicate unit test
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts` — isolated harness (existence + scope confirmed)

## Correctness & Security Assessment (no P0/P1)

The shipped mechanism is sound and the four requirements (REQ-001..004) are met in code:

- **REQ-001 (daemon advertises a live scan)** — `beginMaintenance('index_scan')` at `memory-index.ts:1502` writes `.maintenance-active.json` via `atomicWriteFile`, refreshes on a 20s `setInterval` (`maintenance-marker.ts:63`, `unref()`'d so it never pins the event loop) plus an explicit `maintenance.refresh()` at every scan phase boundary (`memory-index.ts:1510`), and `maintenance.end()` in a `finally` (`memory-index.ts:1540`) clears the timer and removes the marker on every terminal exit. Reference-counted (`activeCount`), so an overlapping embedding drain keeps it held. CORRECT.
- **REQ-002 (adopt at both guard sites)** — `shouldAdoptDespiteProbe` is called at the dead-socket respawn path (`mk-spec-memory-launcher.cjs:820-824`, refuses respawn) and the stale-reclaim adopt path (`:1688-1693`, adopts after the JSON-RPC probe fails). Both pass `childLiveness: processLiveness(childPid)`. CORRECT.
- **REQ-003 (fail-safe toward reaping)** — `shouldAdoptDespiteProbe` (`model-server-supervision.cjs:632-640`) returns `true` only when: marker present, `childPid` is a positive integer, `marker.childPid === childPid`, `activeUntilMs > now`, AND `childLiveness === 'alive'`. Every other branch falls through to reap. `readMaintenanceMarker` returns `null` on missing/corrupt JSON or invalid `childPid`/`activeUntilMs`. CORRECT and verified by 7 predicate + 5 reader unit cases.
- **REQ-004 (identical marker-dir precedence)** — daemon: `config.ts:69-75` resolves `SPEC_KIT_DB_DIR || SPECKIT_DB_DIR` via `path.resolve(cwd, override)` then realpath; launcher: `maintenanceMarkerDir()` (`mk-spec-memory-launcher.cjs:329-333`) resolves the same env precedence via `canonicalizePath(path.resolve(cwd, override))`, else `resolvedDbDir()`. Same cwd-relative override resolution on both sides; the non-override branch reuses the already-shared lease dir. CONSISTENT (the isolated harness exercises this under a fake root).

**Security**: the marker is a local JSON file inside the boundary-checked DB dir (`config.ts:81` rejects dirs outside project/home/tmp). It carries only `childPid`, timestamps, and `labels` — no secrets. It cannot pin a foreign process: adoption requires the marker's `childPid` to equal the lease's recorded child AND that child to be `processLiveness === 'alive'`. Corrupt input degrades to reap. No injection or privilege surface. No P0/P1.

## Findings

### P0, Blocker
None found.

### P1, Required
- **F001**: 019 packet docs materially diverge from the shipped implementation; the spec's "Files to Change" table does not resolve to shipped files — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md:112-121`. The spec (§3 table, §Phase-Context, §Architecture) and `plan.md:55,64` describe the marker writer as living **inline in `handlers/memory-index.ts`'s background-scan IIFE** with a marker shape `{ childPid, activeUntilMs, jobId, refreshedAtIso }`. The shipped code instead places all marker logic in a dedicated reference-counted module **`lib/storage/maintenance-marker.ts`** (verified to exist; exports `beginMaintenance`/`MaintenanceMarkerHandle`), which the spec's Files-to-Change table never lists. The shipped marker shape is `{ childPid, activeUntilMs, labels, refreshedAtIso }` — `jobId` became a `labels` string array (`maintenance-marker.ts:44-50`). The table also (a) lists the supervision/launcher `.cjs` under `mcp_server/bin/...`, but both ship at `.opencode/bin/lib/model-server-supervision.cjs` and `.opencode/bin/mk-spec-memory-launcher.cjs` (the `mcp_server/bin/` paths do not exist), and (b) omits `lib/providers/retry-manager.ts`, which was modified to add a second `beginMaintenance` call site. The `spec_code` hard-gate is therefore **partial**: every REQ is implemented and working, but an auditor following the spec cannot locate the primary shipped module. Fix is doc-side (update the Files-to-Change table, §3/§Architecture prose, and marker-shape description to the shipped reality).

### P2, Suggestion
- **F002**: `implementation-summary.md` "Known Limitations" item 4 is stale — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/implementation-summary.md:104`. It states "The marker is scoped to the scan job, so it protects the scan but not the POST-scan work... that queue is busy-but-unprotected" and frames marker coverage of the embedding queue as the unfinished follow-on. The shipped code at `retry-manager.ts:1038` already calls `beginMaintenance('embedding-queue')` inside `runBackgroundJob`, released in a `finally` (`:1055`), so the embedding-drain tick IS marker-protected via the reference-counted handle. NOTE (kept honest): protection is per `runBackgroundJob` tick, and a tick processes only `batchSize` of the queue, so multi-batch drains still have unprotected gaps between ticks — the spirit of the limitation ("not yet re-election-proof end to end") is not fully eliminated. But as written the doc denies that any embedding-queue protection exists, which the code contradicts. Update the limitation to describe the per-tick protection and the residual between-tick gap.
- **F003**: TTL value in spec/plan/tasks (60s) diverges from the shipped 180s — `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md:103` (also REQ-001 `:132`, `plan.md` 60s TTL). The implementation defines `MAINTENANCE_MARKER_TTL_MS = 180_000` (`maintenance-marker.ts:25`). The divergence is justified and documented in `implementation-summary.md:56` (a 60s TTL lapsed during a ~79s blocking tail phase), but the canonical spec/plan/tasks still state 60s and should be updated for accuracy.
- **F004**: The predicate unit test fixture encodes the obsolete marker shape — `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-maintenance-guard.vitest.ts:5-10,28-33,127-137`. The `MaintenanceMarker` type and `freshMarker()`/valid-marker fixtures use `jobId: 'index-scan-1'`, not the shipped `labels: string[]`. The test still passes (the predicate and reader only consult `childPid`/`activeUntilMs`), so this is not a correctness defect, but the test no longer documents the real marker contract and would mislead a reader using it as the shape reference. Align the fixture with `labels`.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:112-121 vs lib/storage/maintenance-marker.ts, .opencode/bin/{lib/model-server-supervision,mk-spec-memory-launcher}.cjs, retry-manager.ts:1038 | REQ-001..004 all implemented and working in shipped code; Files-to-Change table points to non-existent `mcp_server/bin/` paths, omits the primary module `maintenance-marker.ts` and `retry-manager.ts`; marker field `jobId`→`labels`; TTL 60s→180s |
| checklist_evidence | n/a | hard | - | Level 1 spec, no checklist.md required (exempt) |

## Adjudication

### F001 Claim Adjudication
```json
{
  "findingId": "F001",
  "claim": "The 019 spec's Files-to-Change table and architecture prose do not match the shipped implementation: marker logic lives in lib/storage/maintenance-marker.ts (unlisted), the .cjs ship under .opencode/bin/ not mcp_server/bin/, retry-manager.ts is an unlisted modified site, the marker field jobId is shipped as labels, so spec_code is partial.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/019-maintenance-grace-daemon-survives-reelection/spec.md:112-121",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:22-50",
    ".opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1038",
    ".opencode/bin/lib/model-server-supervision.cjs:609-640",
    ".opencode/bin/mk-spec-memory-launcher.cjs:329-333"
  ],
  "counterevidenceSought": "Checked whether mcp_server/bin/lib/model-server-supervision.cjs and mcp_server/bin/mk-spec-memory-launcher.cjs exist (ls: No such file or directory); located the real .cjs at .opencode/bin/. Confirmed lib/storage/maintenance-marker.ts exists and is imported by both memory-index.ts:13 and retry-manager.ts:15. Confirmed the predicate ignores the renamed field, so the rename is not a runtime defect.",
  "alternativeExplanation": "The 019 docs were written against an earlier inline design; the marker was subsequently extracted into a shared reference-counted module (likely to also cover the embedding queue) and the docs were not re-synced. The shipped behavior is correct; only the descriptive traceability map is stale.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If the spec Files-to-Change table, §3/§Architecture prose, and marker-shape description are updated to the shipped module/paths/fields, downgrade to resolved.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery; spec_code hard-gate partial because the file map does not resolve to shipped files" }
  ]
}
```

## Ruled Out
- **Reference-count leak pinning a dead daemon**: `beginMaintenance` increments `activeCount`; each handle's `end()` is idempotent (`ended` flag) and decremented to a floor of 0; the marker is removed and the timer cleared at zero (`maintenance-marker.ts:67-83`). A process crash leaves a stale marker, but `activeUntilMs` expiry (≤180s) + the `childLiveness === 'alive'` gate then reaps it. No permanent pin.
- **Marker-write / launcher-read race**: writer uses `atomicWriteFile` (tmp+rename); reader is `readFileSync`+`JSON.parse` with corrupt→null→reap. No torn-read adopt.
- **Refresh timer keeping the process alive**: `refreshTimer.unref?.()` (`maintenance-marker.ts:64`) — the timer never blocks clean exit.
- **Cross-side marker-dir divergence (REQ-004)**: both daemon and launcher resolve `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` via `path.resolve(cwd, override)` and canonicalize; agreement holds under shared cwd (the normal launcher-spawns-daemon topology and the isolated fake-root harness).
- **Security: foreign-pid pin**: adoption requires `marker.childPid === childPid` (the lease's recorded child) AND a live child; a marker cannot pin an unrelated process.

## Dead Ends
- None.

## Recommended Next Focus
All four dimensions covered in this single-iteration fan-out lineage (`maxIterations=1` exhausted). If extended: a live multi-batch embedding-drain test to quantify the between-tick unprotected window noted in F002, and a doc-resync pass to clear F001/F003/F004.

Review verdict: CONDITIONAL
