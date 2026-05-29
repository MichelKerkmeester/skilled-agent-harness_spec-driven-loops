# Iteration 010 — Completeness/Maintainability

**Verdict:** CONDITIONAL | **Findings:** P0=0 P1=3 P2=1 | **newFindingsRatio:** 1.0 | **adversarial P0 replays:** 0

## Findings

### [P1] CMP-01 — cross-consumer reliability / silent cascade failure  (confidence 0.78)
- **[SOURCE: .opencode/bin/mk-code-index-launcher.cjs + .opencode/skills/system-code-graph/mcp_server/index.ts + lib/owner-lease.ts:launcher.cjs:778-786; index.ts:46-58; owner-lease.ts:442-451]** · finding_class: `cross-consumer`
- **Evidence:**
```
launcher.cjs:783-785 `if (!refreshed) { log('owner lease refresh to child pid failed; launcher pid remains the recorded owner'); }`  — then index.ts:48-51 `const refreshed = refreshOwnerLease(DATABASE_DIR, process.pid); if (!refreshed && !ownerLeaseMismatchShutdownStarted) { ...; void shutdownCodeIndex('owner lease moved to another process').finally(() => process.exit(0)); }` and owner-lease.ts:443-444 `const holder = ... readOwnerLease(...) : null; if (!holder || holder.ownerPid !== ownerPid) return false;`
```
- **Why:** The launcher hands the lease off to the child PID via refreshOwnerLeaseFile(process.pid,{ownerPid:childProcess.pid}) at launcher.cjs:778. If that handoff returns false (concurrent reclaim, lease moved, or transient lock-miss), the failure is ONLY logged and the lease keeps the LAUNCHER pid. The child then starts its TS heartbeat with its OWN pid; on the first tick (OWNER_LEASE_REFRESH_INTERVAL_MS = 60000/3 = 20000ms) refreshOwnerLease finds holder.ownerPid (launcher) !== process.pid (child) and returns false, so the child self-shuts-down ~20s after a successful start. The launcher's childProcess.on('exit') then clearAllLeaseFiles()+exits — the whole server dies from a transient, non-fatal-looking handoff miss with no retry and only one log line. This is a known-possible path that rounds 1-9 did not flag as a completeness gap.
- **Fix:** Make the launcher handoff failure recoverable: retry refreshOwnerLeaseFile to childPid (bounded) or treat persistent handoff failure as fatal at launch (kill child + report) rather than logging and continuing into a 20s-delayed silent suicide.

### [P1] CMP-02 — dead code / duplicated single-writer implementation  (confidence 0.82)
- **[SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts:326-429 (acquireOwnerLease), 457-473 (releaseOwnerLease)]** · finding_class: `docs-vs-code`
- **Evidence:**
```
owner-lease.ts exports `export function acquireOwnerLease(...)` (326) and `export function releaseOwnerLease(...)` (457), but a repo-wide grep for call sites returns ZERO production callers in any .ts source (only dist/.d.ts, vitest, and README). The real production lease lifecycle is a PARALLEL CommonJS reimplementation in `.opencode/bin/mk-code-index-launcher.cjs` (`acquireOwnerLeaseFile()` at :347, `refreshOwnerLeaseFile()` at :389). index.ts only imports/uses `refreshOwnerLease`.
```
- **Why:** Two independent single-writer lease implementations (TS owner-lease.ts vs CJS launcher) must be kept behaviorally identical, but only the CJS one is on the production path. Spec 011 already documented one drift (DR-002-01: launcher reclaim was last-writer-wins while the TS CAS fix was not mirrored). acquireOwnerLease/releaseOwnerLease being exported-but-uncalled is a maintenance trap: future fixes to owner-lease.ts (the 'canonical' module per lib/README.md:236) silently never reach production, and the explicit open question in spec 011 (`Are the dead-code owner-lease functions intended to stay exported, or be removed?`) is still unresolved.
- **Fix:** Either delete the unused acquireOwnerLease/releaseOwnerLease (keep only refreshOwnerLease + helpers actually used) OR have the TS server/launcher consume them so a single implementation is authoritative; document the CJS launcher as the production lease owner if duplication is intentional.

### [P1] CMP-03 — incomplete shutdown / lease leak on standalone run  (confidence 0.74)
- **[SOURCE: .opencode/skills/system-code-graph/mcp_server/index.ts:96-125, 139]** · finding_class: `instance-only`
- **Evidence:**
```
shutdownCodeIndex() (96-118) calls clearOwnerLeaseRefreshTimer() and closeDbWithAssertion() but never releaseOwnerLease(); SIGINT/SIGTERM (120-124) route to shutdownCodeIndex. The lease file is cleared only by the launcher's clearAllLeaseFiles() in launcher.cjs childProcess.on('exit'). index.ts also self-executes: it unconditionally `startOwnerLeaseRefreshTimer()` at :139 with no acquire.
```
- **Why:** The child server has no self-contained lease lifecycle: it never acquires and never releases — it depends entirely on the CJS launcher to create the lease (handoff) and to clean it up on exit. If index.js is ever started WITHOUT the launcher (direct `node dist/index.js`, a debug invocation, or a future runtime that points at index.js instead of the launcher.cjs), no lease exists, the heartbeat returns false on the first 20s tick, and the server silently self-terminates with the misleading message 'owner lease moved to another process'. The coupling is implicit and undocumented at the index.ts entrypoint.
- **Fix:** Either guard the heartbeat so a MISSING lease (vs a MOVED lease) does not trigger self-shutdown (only shut down when holder exists with a different pid), or have index.ts acquireOwnerLease on startup when no launcher handoff is detected so standalone runs are self-consistent.

### [P2] CMP-04 — error-swallowing / observability gap  (confidence 0.7)
- **[SOURCE: .opencode/skills/system-code-graph/mcp_server/index.ts:53-56]** · finding_class: `class-of-bug`
- **Evidence:**
```
startOwnerLeaseRefreshTimer catch block: `} catch (error: unknown) { const message = ...; console.error(`[owner-lease] heartbeat refresh failed: ${message}`); }` — the exception is logged but the timer continues and the false/throw distinction is collapsed.
```
- **Why:** A throwing refreshOwnerLease (e.g. fs/lock errors) is swallowed and the heartbeat keeps running, so a persistently failing heartbeat (lease file unwritable, disk full) is invisible beyond log noise and never escalates — the lease silently goes stale until another process reclaims it via stale-heartbeat, with no health signal surfaced to operators. Distinct from the false-return self-shutdown path (which is handled).
- **Fix:** Track consecutive heartbeat exception count and escalate (surface via health/marker or shutdown) after N failures instead of indefinitely swallowing.

## Coverage
COVERED: Full owner-lease lifecycle traced end-to-end across the cross-consumer boundary (launcher.cjs acquire+handoff -> index.ts heartbeat -> owner-lease.ts refresh/release semantics) — the surface rounds 1-9 most likely under-examined because the production lease owner is a CJS file OUTSIDE the scoped set. Disproved an initial P0 self-shutdown hypothesis by confirming the launcher hands the lease off to childPid (launcher.cjs:778-782), so the happy path is sound; the residual risk is the non-fatal handoff-failure cascade (CMP-01) and the dead/duplicated TS lease functions (CMP-02). ensure-ready.ts swept for error-swallowing and untested branches: the selective-reindex manifest-refresh ordering (744-753) is correct (manifest recorded BEFORE re-detectState, so no false self-heal 'failed'); best-effort catch blocks at 557-560/714-716/746-748 are intentional and documented (BUG-06/NFR-P01). context-server.ts shutdown ordering (fileWatcher drain BEFORE closeDb, 1444-1458) is correct per the 026/007/009 finding. vector-index-store.ts dimension-mismatch fail-closed paths (1236-1268) and WAL TRUNCATE-on-close (1299-1311) reviewed — no completeness gaps found there. NOT VERIFIED THIS PASS: (1) launcher.cjs reapOwnerBeforeRespawn/respawnAfterDeadSocket race semantics (509-580) — read only via grep, not line-by-line, so RC-3 single-winner respawn correctness is unverified; (2) the spec-memory-side launcher RSS-watchdog / childPid lease (F1'/RC-1/RC-2) — those modules are not in the scoped file set and were not opened; (3) query.ts full readiness->fallback payload completeness beyond the crash gate (1180-1265); (4) runtime test execution (READ-ONLY review, no build/test run). CMP-01/03 confidence is bounded by not having dynamically reproduced the 20s self-shutdown timing.

Review verdict: CONDITIONAL
