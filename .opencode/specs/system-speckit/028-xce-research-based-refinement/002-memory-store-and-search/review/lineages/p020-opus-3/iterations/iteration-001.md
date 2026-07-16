# Iteration 001 — Consolidated Review (all 4 dimensions)

**Lineage:** p020-opus-3 (fan-out) · **Executor:** cli-claude-code model=claude-opus-4-8 · **maxIterations:** 1

**Target:** `020-maintenance-grace-background-embedding` — extract the maintenance-active marker writer into a shared, reference-counted module so both the reindex scan and the post-scan background-embedding queue hold it through their overlap (closes the 019 gap where a re-election interrupted the unprotected embedding burst).

**Scope under review (3 source + 1 test):**
- `mcp_server/lib/storage/maintenance-marker.ts` (new shared module)
- `mcp_server/handlers/memory-index.ts` (scan IIFE refactored onto the module)
- `mcp_server/lib/providers/retry-manager.ts` (`runBackgroundJob` wired in)
- `mcp_server/tests/maintenance-marker.vitest.ts` (new unit test)

This is a single-iteration fan-out lineage. Breadth over depth: all four dimensions are covered in one pass.

---

## D1 — Correctness

**Reference-counting lifecycle — SOUND.**
- `beginMaintenance(label)` increments `activeCount`, pushes the label, writes the marker, and lazily creates the 20s refresh timer only when none exists (`maintenance-marker.ts:58-65`). [SOURCE: maintenance-marker.ts:58]
- `end()` is guarded by a per-handle `ended` flag (idempotent), decrements with `activeCount = Math.max(0, activeCount - 1)` (defensive floor against double-decrement), prunes the label, and only at `activeCount === 0` clears the timer and `rmSync`s the marker (`maintenance-marker.ts:72-82`). [SOURCE: maintenance-marker.ts:72]
- Overlap is correct: scan begins (count 1) → embedding begins (count 2) → either ends (count 1, marker + timer retained) → last ends (count 0, timer cleared, file removed). Symmetric regardless of end order. Satisfies REQ-003. [SOURCE: maintenance-marker.ts:78]
- All marker mutators (`beginMaintenance`, `refresh`, `end`) are synchronous with no `await` between the `activeCount` read and the timer/file ops, so in single-threaded Node there is no interleaving race. [SOURCE: maintenance-marker.ts:58]

**Idle-tick guard — CORRECT (REQ-004).**
- In `runBackgroundJob` the empty-queue guard `if (stats.queue_size === 0) return { processed: 0, queue_empty: true }` (`retry-manager.ts:1032-1034`) returns *before* `beginMaintenance('embedding-queue')` at `retry-manager.ts:1038`. An idle tick never creates a handle and never writes the marker. The prior early returns (retention enforcement, shutdown check) likewise precede the mark. [SOURCE: retry-manager.ts:1032]
- `maintenanceHandle?.end()` sits in the `finally` (`retry-manager.ts:1055`); the empty-queue path leaves the handle `null`, so the optional-chain end is a safe no-op there. [SOURCE: retry-manager.ts:1055]

**Scan wiring — CORRECT.**
- `beginMaintenance('index_scan')` is taken before the `try`, `maintenance.refresh()` fires on each phase boundary (covers long synchronous tail phases that cannot fire the interval timer), and `maintenance.end()` is in the `finally` covering complete/cancelled/failed/thrown (`memory-index.ts:1502-1540`). [SOURCE: memory-index.ts:1502]
- No leftover inline 019 marker writer remains in `memory-index.ts` (grep for `maintenance-active`/`activeUntilMs` returns only unrelated `leaseHeartbeat`/`loopLagTimer` timers). The refactor replaced the inline writer cleanly. [SOURCE: memory-index.ts:1502]

**Refuted hypothesis (recorded for the audit trail):** an "increment-before-write" reference-count leak in `beginMaintenance` — if `writeMarker()` threw after `activeCount += 1`, the count could be pinned and (combined with the always-on refresh timer) permanently shield a wedged daemon, defeating the documented 180s-TTL mitigation. **Refuted:** `writeMarker` → `atomicWriteFile` (`transaction-manager.ts:177-200`) wraps all fs work in try/catch, logs a warning, and returns `false` — it never throws. So `beginMaintenance` cannot throw from the write; the only other operations are an integer increment and an array push. The increment-before-write ordering is therefore safe. [SOURCE: transaction-manager.ts:177]

**P2-D1-01 — `writeMarker` ignores the `atomicWriteFile` boolean failure signal.**
`writeMarker()` discards the `boolean` returned by `atomicWriteFile` (`maintenance-marker.ts:44-51`). If a marker write fails, `beginMaintenance`/`refresh` still believe the marker is present (count incremented, timer running) while no file exists on disk. Impact is *fail-open and self-healing*: the launcher sees no marker and may reap the daemon (the safe direction, not permanent shielding), and the 20s timer retries the write so a transient failure recovers on the next tick. `atomicWriteFile` already emits its own `console.warn` on failure, so it is observable. Low impact; recorded as a robustness advisory, not a behavior defect. [SOURCE: maintenance-marker.ts:44]

---

## D2 — Security

**No findings.**
- The marker payload is `{ childPid, activeUntilMs, labels, refreshedAtIso }` serialized via `JSON.stringify` — no secrets, credentials, or untrusted/user-controlled input; labels are caller-supplied constants (`'index_scan'`, `'embedding-queue'`). No injection surface. [SOURCE: maintenance-marker.ts:44]
- Writes go through `atomicWriteFile` (temp + `renameSync`) into the trusted `DATABASE_DIR`; `end()` uses `rmSync(..., { force: true })` wrapped in try/catch. No path traversal: the filename is a module constant joined to a resolved DB dir. [SOURCE: maintenance-marker.ts:40]
- The marker is advisory and read by the in-repo launcher guard only (019, unchanged, out of scope). No new trust boundary is crossed. [SOURCE: maintenance-marker.ts:1]

---

## D3 — Traceability / Spec-Alignment

**All requirements satisfied; file changes match declared scope exactly.**
- **REQ-001** (shared reference-counted module, `refresh()`/`end()`, present while ≥1, removed at 0, idempotent end, TTL 180s, refresh 20s): all present — `MAINTENANCE_MARKER_TTL_MS = 180_000`, `MAINTENANCE_MARKER_REFRESH_MS = 20_000`, idempotent `end()`. ✓ [SOURCE: maintenance-marker.ts:25]
- **REQ-002** (embedding queue protected, begin only after empty-queue guard, end in existing finally): ✓ `retry-manager.ts:1032/1038/1055`. [SOURCE: retry-manager.ts:1038]
- **REQ-003** (scan + queue overlap without clobbering): ✓ via reference counting. [SOURCE: maintenance-marker.ts:78]
- **REQ-004** (idle tick never marks): ✓ guard precedes the mark. [SOURCE: retry-manager.ts:1032]
- Files-to-change table (spec §3) lists exactly the four files touched (1 Add module, 2 Modify, 1 Add test) — no scope drift, no adjacent-file edits. [SOURCE: spec.md:113]
- Test-redirect soundness verified: `core/config.ts:97` declares `export let DATABASE_DIR` (a live, reassignable ESM binding) and `resolveDatabasePaths()` reassigns it (`config.ts:103`); the module reads `DATABASE_DIR` at call time inside `markerPath()`. The vitest `SPEC_KIT_DB_DIR`→`resolveDatabasePaths()` redirect therefore actually redirects the module's writes to a tmp dir and does not pollute the real DB dir. The test's own comment claiming "live ESM binding" is accurate. [SOURCE: config.ts:97]

**Verification-claim cross-check (advisory):** `implementation-summary.md` claims build PASS, marker-unit PASS, scan-job + launcher-guard suites PASS, and a live reindex-survival PASS, and explicitly flags the pre-existing `retry-manager.vitest.ts` T49 cross-file isolation flake as *not introduced*. The unit test's five cases exercise the documented contract (present-while-held, two-holder persistence, removal at zero, idempotent end, refresh monotonicity) and align with the module API; the verification rows are plausible and self-consistent. Re-running the build/suite is outside this read-only lineage's TCB; the live reindex-survival row is explicitly a deploy-time check, not a code deliverable (SC-002). [SOURCE: implementation-summary.md:86]

---

## D4 — Maintainability

**P2-D4-01 — On-disk `labels` can transiently lag the live holder set after a non-last `end()`.**
`end()` decrements the in-memory count but does not re-serialize the marker, so the on-disk `labels` array keeps the ended holder's label until the next write event (`refresh`, the 20s timer, or a new `begin`). This is explicitly documented and asserted as intentional in the unit test (`maintenance-marker.vitest.ts:91-104`) and the launcher reads only marker *presence + TTL*, never `labels`, so it is cosmetic/advisory metadata. No behavior impact. Recorded as a by-design advisory for future readers who might treat `labels` as authoritative. [SOURCE: maintenance-marker.vitest.ts:91]

**Positive observations:**
- Module-level singleton state (`activeCount`, `refreshTimer`, `activeLabels`) is the correct shape for a per-process marker and is well-commented (the header explains the reference-counting rationale and the wedged-daemon lapse behavior). [SOURCE: maintenance-marker.ts:1]
- `__resetMaintenanceMarkerForTest()` gives the suite a clean reset hook; vitest's per-file module isolation keeps the singleton from bleeding across the marker suite. The noted T49 flake is a *separate* file's cross-file concern, correctly attributed as pre-existing. [SOURCE: maintenance-marker.ts:87]
- `refreshTimer.unref?.()` prevents the timer from keeping the event loop alive — appropriate for a daemon background concern. [SOURCE: maintenance-marker.ts:64]

---

## Adversarial self-check

No P0 findings were raised, so no P0 replay is required. The one candidate that could have risen to P0 (the reference-count leak permanently shielding a wedged daemon) was actively pursued and **refuted** by reading `atomicWriteFile` — it cannot throw, so the leak path does not exist. Both remaining findings are P2 advisories with fail-safe or cosmetic impact.

## Severity tally (this iteration)

- P0: 0
- P1: 0
- P2: 2 (P2-D1-01 write-failure signal ignored; P2-D4-01 transient stale labels — by-design)

newFindingsRatio: 0.00 (no P0/P1; both findings are advisory) · All 4 dimensions covered · `spec_code` + `checklist_evidence` traceability executed.

Review verdict: PASS
