# Iteration 001 — Full-coverage pass (D1–D4)

**Target:** `020-maintenance-grace-background-embedding` (spec-folder)
**Executor:** cli-claude-code model=claude-opus-4-8
**Lineage:** p020-opus-1 | Iteration 1 of 1
**Dimensions covered:** correctness, security, traceability, maintainability

---

## Scope confirmation

The change is small and surgical: one new module (`maintenance-marker.ts`, 92 lines) plus two narrow wirings (scan IIFE in `memory-index.ts`, `runBackgroundJob` in `retry-manager.ts`) and a unit test. The 019 launcher-side adopt/reap guard is unchanged. All reviewed against `spec.md` REQ-001..004, SC-001/SC-002, and the In/Out scope tables.

---

## D1 — Correctness

### Reference-count lifecycle (verified)

`beginMaintenance(label)` [SOURCE: lib/storage/maintenance-marker.ts:58-84]:
- Increments `activeCount`, pushes `label`, writes the marker, lazily creates a single 20s refresh interval (`unref`'d so it never pins the process). ✓
- Returns a per-handle closure with its own `ended` guard. `end()` is idempotent: early-returns when already ended, decrements with `Math.max(0, …)` underflow protection, prunes its label, and only at `activeCount === 0` clears the timer and `rmSync`es the file. ✓

Traced the overlap scenarios by hand:
- A begin (count 1, timer created) → B begin (count 2, timer reused, NOT recreated) → A.end (count 1, file persists) → B.end (count 0, file removed, timer cleared). ✓ Matches REQ-003 "neither one's `end()` removes the file while the other still holds it."
- Double-`end()` on a non-sole holder decrements once only (guarded by `ended`), so it cannot wrongly drop another holder's count. ✓
- Double-`end()` on the sole holder removes the file exactly once and does not throw. ✓ [SOURCE: tests/maintenance-marker.vitest.ts:111-121]

### TTL / refresh correctness (verified, with one forward-looking caveat → P2-1)

- TTL 180s, refresh 20s [SOURCE: maintenance-marker.ts:25-26]; `writeMarker` recomputes `activeUntilMs = Date.now() + TTL` on every write, so the TTL is monotonic-forward on refresh. ✓ [SOURCE: tests:123-139]
- The scan path explicitly calls `maintenance.refresh()` at each phase boundary [SOURCE: handlers/memory-index.ts:1507-1512] because a long synchronous tail phase blocks the event loop and cannot fire the interval timer. Correct mitigation for the synchronous scan.
- The embedding path does NOT call `refresh()` explicitly; it relies on the 20s interval firing between async provider calls. This is correct *today* because `processRetryQueue` embeddings are network-bound async work that yields the loop. See P2-1 for the forward-looking risk.

### Idle-tick guard (verified) — REQ-004

`runBackgroundJob` returns at `stats.queue_size === 0` BEFORE `beginMaintenance('embedding-queue')` [SOURCE: lib/providers/retry-manager.ts:1032-1038]. An idle tick never creates a handle, so it never writes or leaves a lingering marker. The `finally` calls `maintenanceHandle?.end()` which is a safe no-op when null [SOURCE: retry-manager.ts:1052-1055]. ✓

### Inline-writer removal (verified)

The 019 inline marker writer is fully removed from the scan path; `memory-index.ts` now only references the shared module (`beginMaintenance` at :1502, `refresh` at :1510, `end` at :1540) with no residual `.maintenance-active` write. ✓ (grep over `memory-index.ts` for marker writes returns only the shared-module calls.)

**D1 result:** No correctness defect found. The reference-count, TTL, idempotency, and idle-guard contracts all hold.

---

## D2 — Security

- Marker payload is `{ childPid, activeUntilMs, labels, refreshedAtIso }` [SOURCE: maintenance-marker.ts:44-51] — no secrets, no credentials.
- `markerPath()` is a fixed filename joined to `DATABASE_DIR` [SOURCE: maintenance-marker.ts:40-42]; `label` is never interpolated into a path. All call-site labels are hardcoded constants (`'index_scan'`, `'embedding-queue'`, test-only `'scan'`/`'checkpoint'`). No path traversal, no injection surface.
- Writes go through `atomicWriteFile` [SOURCE: lib/storage/transaction-manager.ts:177,452]; cleanup is `rmSync(..., { force: true })` wrapped in try/catch. No untrusted input reaches either.

**D2 result:** No security finding.

---

## D3 — Traceability (spec_code core protocol)

| Claim | Evidence | Status |
|-------|----------|--------|
| REQ-001 shared ref-counted module, `{refresh, end}`, present while ≥1 holder, removed at 0, idempotent `end()`, TTL 180s/20s refresh | maintenance-marker.ts:25-26,58-84 | pass |
| REQ-002 `runBackgroundJob` calls `beginMaintenance('embedding-queue')` only after empty-queue guard, `end()` in existing `finally` | retry-manager.ts:1032-1038,1052-1055 | pass |
| REQ-003 scan + embedding queue overlap without clobbering (ref counting) | maintenance-marker.ts:74-82; tests:82-109 | pass |
| REQ-004 idle tick never marks | retry-manager.ts:1032-1034 | pass |
| Scope: scan IIFE refactored onto shared module, inline writer replaced | memory-index.ts:1502,1540 (no residual writer) | pass |
| SC-001 marker unit test + existing scan-job/launcher-guard suites pass | tests/maintenance-marker.vitest.ts present & well-formed; impl-summary records PASS | pass (claimed; not re-run in this read-only review) |
| SC-002 live reindex + post-scan burst survives | impl-summary Verification: PASS (deploy verification) | pass (deploy-time, out of code scope) |

Test validity spot-check: the unit test redirects writes by setting `SPEC_KIT_DB_DIR` and calling `resolveDatabasePaths()`, relying on `DATABASE_DIR` being a live ESM binding. Confirmed `export let DATABASE_DIR` is reassigned by `resolveDatabasePaths()` [SOURCE: core/config.ts:97,103], and the marker reads it live via `markerPath()` [SOURCE: maintenance-marker.ts:41]. The test's central assumption is sound. ✓

**D3 result:** Full spec↔code alignment. `checklist_evidence` is n/a (Level 1, no checklist.md); `feature_catalog_code` and `playbook_capability` overlays are n/a for this target.

---

## D4 — Maintainability

- Comments are durable WHY (TTL margin rationale, phase-boundary refresh rationale, ref-count rationale) with no ephemeral artifact IDs. Comment hygiene clean.
- Leak bound is explicit and correct: a missed `end()` is bounded by the 180s TTL because a wedged daemon cannot refresh [SOURCE: maintenance-marker.ts:10-14], matching the spec Risk row.
- Minor: stale on-disk `labels` after a non-final `end()` until the next write event — intentional and documented in the test [SOURCE: tests:91-104]; harmless because the launcher adopt decision keys on `activeUntilMs`/`childPid`, not `labels`. Recorded as P2-2.

---

## Findings

### P2-1 (advisory, maintainability/correctness-forward) — Embedding path TTL freshness depends on async yielding, not explicit refresh

`runBackgroundJob` holds the marker across `await processRetryQueue(batchSize)` with no explicit `refresh()` call [SOURCE: lib/providers/retry-manager.ts:1038-1041]. TTL freshness during the embedding drain relies entirely on the 20s `setInterval` firing between async provider calls. This is correct today because embeddings are network-bound async work that yields the event loop — unlike the scan, which adds explicit phase-boundary `refresh()` calls precisely because its synchronous tail blocks the loop. If a future change introduces a synchronous/CPU-bound embedding phase (e.g., local on-device embedding) that blocks for >180s, the marker would lapse mid-drain with no explicit-refresh safety net. The existing impl-summary "make heaviest phases cooperative" limitation partially covers this. Advisory: consider a phase-boundary `refresh()` in the drain loop if a synchronous embedding backend is ever added.
- `finding_class`: forward-compatibility
- `category`: maintainability
- `content_hash`: p020-emb-refresh-async-dependency

### P2-2 (advisory, observability) — On-disk `labels` set is stale after a non-final `end()`

After a non-final holder `end()`, the on-disk `labels` array is not re-serialized until the next write event (begin/refresh/timer) [SOURCE: lib/storage/maintenance-marker.ts:72-82; tests:91-104]. The in-memory ref count is always correct, and the launcher ignores `labels`, so this never affects adopt/reap. Purely an observability nuance if an operator inspects `.maintenance-active.json` between writes. Documented and intentional; no action required.
- `finding_class`: observability
- `category`: maintainability
- `content_hash`: p020-stale-labels-on-disk

### P2-3 (advisory, scope-acknowledged) — Inter-tick marker gap with the stock retry interval

After each embedding batch, `runBackgroundJob`'s `finally` ends the handle; if no other holder is active the marker is removed between ticks. With the stock 300s `SPECKIT_RETRY_INTERVAL_MS`, there is a window between batches where the daemon holds no marker even though pending rows remain, so a re-election in that idle gap could still recycle the daemon mid-reindex (the successor resumes the queue, so no data loss; search stays up). This is explicitly acknowledged in plan.md §6 and spec.md problem framing ("the gap drained on a later queue pass") and is within the declared scope ("un-reaped while busy", not between-tick idleness). No action required for this packet; noted for the cooperative-phase follow-on.
- `finding_class`: scope-boundary
- `category`: correctness
- `content_hash`: p020-inter-tick-marker-gap

---

## Adversarial self-check

No P0/P1 findings were raised, so no severity escalation packets are required. I actively tried to escalate each P2 to P1:
- P2-1: would be P1 only if a synchronous embedding path existed today — it does not (`processRetryQueue` is async I/O). Cannot confirm an active defect. Stays P2.
- P2-3: would be P1 if data loss or search downtime occurred in the gap — neither does (successor resumes; search stays up). Explicitly in-scope-acknowledged. Stays P2.
- P2-2: launcher ignores `labels`; no behavioral impact. Stays P2.

## Coverage / convergence

- All 4 dimensions covered in one pass. Core traceability protocols (`spec_code`) executed; `checklist_evidence` n/a (Level 1). No new P0/P1; `newFindingsRatio` for blocking severities = 0.0. maxIterations=1 reached.
- Provisional verdict: PASS (hasAdvisories=true; 3 × P2).

Review verdict: PASS
