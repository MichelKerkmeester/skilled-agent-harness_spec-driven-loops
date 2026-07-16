# Iteration 001 — All Dimensions (Correctness · Security · Traceability · Maintainability)

Lineage `fanout-p019-opus-1` · executor `cli-claude-code` model `claude-opus-4-8` · single-pass (maxIterations=1).

Target: `027/002/019-maintenance-grace-daemon-survives-reelection`. Observation-only.

## Scope read this iteration

- `handlers/memory-index.ts:1486-1554` (marker writer call site)
- `lib/storage/maintenance-marker.ts:1-92` (marker module)
- `.opencode/bin/lib/model-server-supervision.cjs:557-640` (pure predicate + `nowMsFromOptions`)
- `.opencode/bin/mk-spec-memory-launcher.cjs:320-347, 800-844, 1660-1709` (marker dir + both guard sites)
- `lib/providers/retry-manager.ts:1015-1066` (embedding-queue marker)
- `core/config.ts:55-109` (`DATABASE_DIR` resolution, for marker-dir parity)
- `tests/launcher-maintenance-guard.vitest.ts` (full), `stress_test/durability/daemon-reelection-adoption-live.vitest.ts:343-462`

---

## D1 — Correctness

The three-part design is logically sound and matches its stated intent.

- **Writer** (`maintenance-marker.ts:44-84`): `beginMaintenance(label)` increments a module-level `activeCount`, writes the marker (`childPid=process.pid`, `activeUntilMs=now+180s`, `labels`, `refreshedAtIso`) atomically, and starts a single 20s `setInterval(writeMarker)` that is `unref()`-ed. `end()` is per-handle idempotent (`ended` flag), decrements the count, splices its label, and only at `activeCount===0` clears the timer and removes the marker. Reference-counting is correct for the overlap case (scan defers embeddings → embedding queue holds the marker past scan end). [SOURCE: lib/storage/maintenance-marker.ts:36-84]
- **Phase-boundary refresh** (`memory-index.ts:1507-1511`): `onPhase` calls `maintenance.refresh()` so a long synchronous tail phase that cannot fire the 20s interval still re-enters with a full TTL ahead. The `finally` at 1536-1540 calls `maintenance.end()` on every terminal exit (complete/cancelled/failed/thrown). [SOURCE: handlers/memory-index.ts:1502-1541]
- **Predicate** (`model-server-supervision.cjs:632-640`): `shouldAdoptDespiteProbe` returns true only when a marker exists AND `childPid` is a positive integer AND `marker.childPid === childPid` AND `marker.activeUntilMs > now` AND `childLiveness === 'alive'`. Every other path returns false (fail-safe toward reaping). `nowMsFromOptions` supports both a number and a `() => number`, so the freshness comparison is injectable for tests. [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:557-561, 632-640]
- **Both guard sites present and correctly ordered.** Dead-socket respawn path checks the marker *before* taking the respawn lock and reaping, so a bail unwinds nothing (`launcher.cjs:820-825`). Stale-reclaim adopt path checks the marker *after* the live-probe fails but *before* reap+respawn (`launcher.cjs:1688-1694`). Both pass `childLiveness: processLiveness(childPid)`. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:814-825, 1685-1695]

No correctness defect found. The reference-counting, idempotent `end()`, and fail-safe gating all hold under the overlap, restart, and wedge scenarios. REQ-001/002/003 are satisfied by the shipped logic.

Marker-dir parity (REQ-004) holds for the override path that the isolated harness uses: the daemon resolves `DATABASE_DIR` as `path.resolve(cwd, SPEC_KIT_DB_DIR||SPECKIT_DB_DIR)` then realpath (`config.ts:67-75`), and the launcher's `maintenanceMarkerDir()` resolves the same env precedence as `canonicalizePath(path.resolve(cwd, override))` (`launcher.cjs:329-333`). The default (no-override) path relies on `dbDir === path.dirname(DB_PATH)`; this was not re-derived here but is corroborated by the live run where the marker drove adopt decisions. [SOURCE: core/config.ts:63-95; .opencode/bin/mk-spec-memory-launcher.cjs:321-333]

## D2 — Security

No new exposure. The marker is an untrusted on-disk file in `DATABASE_DIR`; `readMaintenanceMarker` wraps `JSON.parse` in try/catch and validates `childPid`/`activeUntilMs` types before returning, so corrupt/partial markers degrade to `null` (= no protection), not to a thrown error or a spoofed adopt. [SOURCE: .opencode/bin/lib/model-server-supervision.cjs:615-626] The strongest a forged marker can do is delay reaping for up to the TTL — and only if it also names a pid that is currently `alive`; it cannot pin a dead or wedged daemon. Writing the marker file and controlling a live matching pid is the same local-write trust boundary as the daemon itself, so no privilege boundary is crossed. No P0/P1 security finding.

## D3 — Traceability (spec_code core protocol)

The code satisfies every REQ, but five documentation/contract drifts exist where the shipped implementation diverges from (and in two cases is more complete than) the packet docs. All are doc-side; none change behavior.

- **F-T1 [P2] File paths in spec/plan/tasks are wrong.** spec.md §3 "Files to Change", plan.md, and tasks.md name `mcp_server/bin/lib/model-server-supervision.cjs` and `mcp_server/bin/mk-spec-memory-launcher.cjs`. The actual files are repo-root `.opencode/bin/lib/model-server-supervision.cjs` and `.opencode/bin/mk-spec-memory-launcher.cjs` — there is no `mcp_server/bin/` directory. [SOURCE: spec.md:116-120; .opencode/bin/mk-spec-memory-launcher.cjs (exists); mcp_server/ has no bin/ subdir]
- **F-T2 [P2] Marker writer was extracted into an undocumented module.** spec.md §3 and plan.md §3-4 describe the marker writer as inline in the background-scan IIFE. The shipped code extracts it into a new module `lib/storage/maintenance-marker.ts` (`beginMaintenance`/`MaintenanceMarkerHandle`), which no packet doc lists in its "Files to Change". The extraction is reasonable (reusable, ref-counted, unit-testable) but is untracked. [SOURCE: plan.md:54-55, 74; lib/storage/maintenance-marker.ts:1-92; handlers/memory-index.ts:13]
- **F-T3 [P2] Marker schema drift (`jobId` → `labels`).** spec.md §3 and plan.md document the marker as `{ childPid, activeUntilMs, jobId, refreshedAtIso }`. The writer emits `{ childPid, activeUntilMs, labels, refreshedAtIso }` (`labels: string[]`, not `jobId`). The unit-test fixtures (`launcher-maintenance-guard.vitest.ts:28-33, 128-133`) still encode `jobId`, so the reader test proves only pass-through of arbitrary fields, not the real on-disk shape. The predicate reads neither field, so behavior is unaffected. [SOURCE: spec.md:103; lib/storage/maintenance-marker.ts:44-50; tests/launcher-maintenance-guard.vitest.ts:5-10,28-33]
- **F-T4 [P2] REQ-001 acceptance criterion TTL is stale (60s vs shipped 180s).** REQ-001 and spec.md §3 In Scope state a "60s TTL"; the shipped TTL is `180_000` ms. The implementation-summary explains the raise (a 60s TTL lapsed during a ~79s blocking tail phase on the first live run), but spec.md's REQ-001 acceptance criteria were not updated to match. The requirement *intent* (a TTL that lets a wedged daemon's marker expire) is met. [SOURCE: spec.md:103,132; lib/storage/maintenance-marker.ts:25; implementation-summary.md:56]
- **F-T5 [P2] "Known Limitations" understates what shipped; embedding queue IS protected.** implementation-summary.md §Known Limitations bullet 4 frames the post-scan background-embedding queue as "busy-but-unprotected" and the marker extension to cover it as an open follow-on "that closes the loop". The shipped code already does this: `retry-manager.ts:1038` calls `beginMaintenance('embedding-queue')` (held only when a tick has real work; `end()` in `finally`), and the marker module is reference-counted precisely so scan+embedding overlap keeps the marker present. So the documented "open" gap appears closed in the code. This is the most consequential drift because it labels a completed protection as missing. [SOURCE: implementation-summary.md:104; lib/providers/retry-manager.ts:1022-1061; lib/storage/maintenance-marker.ts:10-14]

Core `spec_code` verdict: **pass with advisories** — all four normative REQs resolve to shipped behavior; the drifts are in literal values, file paths, and forward-looking narrative, not in the requirements themselves. `checklist_evidence` is N/A (Level 1, no checklist.md).

## D4 — Maintainability

Clean. The pure predicate lives in the supervision lib and is re-exported through the launcher (established convention), making it unit-testable without spawning a daemon. Comments capture durable WHY (why TTL must exceed the longest blocking phase; why the guard is at both sites; why fail-safe toward reaping) with no spec-id/packet-path leakage. The module-level singleton state in `maintenance-marker.ts` is an appropriate daemon-singleton pattern and exposes a test-only reset. The unit test covers the adopt case plus all fail-safe branches (expired, pid-mismatch, dead, unknown-eperm, no-marker, invalid pid) and reader corruption cases; the isolated harness adds a real adopt case and a stale-marker negative control. No maintainability finding above P2 (the F-T3 test-fixture/schema mismatch is the only nit and is already counted under traceability).

---

## Claim Adjudication

No P0 or P1 findings were raised this iteration, so no typed claim-adjudication packet is required. All five findings are P2 documentation/traceability advisories. Each was confirmed by reading the cited code at the referenced file:line (not inferred); the counter-check for each was "does the code behavior actually differ from the doc?" — in every case the *behavior* is correct and the drift is doc-side only.

## Verification note

Build/syntax/test commands were **not** independently re-run in this review context (node execution is gated). The implementation-summary's PASS rows (build exit 0, `node --check` clean, unit + isolated-harness pass, live reindex 330s) are corroborated only by static inspection: the test files exist and assert the claimed cases, and `dist/lib/storage/maintenance-marker.js` is present. Treat the test/build PASS as inferred, not re-verified here.

## Coverage / convergence signal

All 4 dimensions covered in this single pass. Core traceability protocol (`spec_code`) executed; `checklist_evidence` N/A. New findings: 0 P0, 0 P1, 5 P2. No P0 override. `newFindingsRatio` for synthesis purposes: 0.0 (no blocking findings; advisory-only).

Review verdict: PASS
