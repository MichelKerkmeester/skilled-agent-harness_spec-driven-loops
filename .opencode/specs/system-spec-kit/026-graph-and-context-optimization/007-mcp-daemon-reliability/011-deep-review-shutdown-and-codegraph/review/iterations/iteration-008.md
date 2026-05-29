# Iteration 008 — Correctness

**Verdict:** CONDITIONAL | **Findings:** P0=0 P1=1 P2=1 | **newFindingsRatio:** 1.0 | **adversarial P0 replays:** 0

## Findings

### [P1] CORR-1 — double-shutdown / competing signal handlers  (confidence 0.82)
- **[SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts:125-148 (vs context-server.ts 1547-1552)]** · finding_class: `class-of-bug`
- **Evidence:**
```
shutdown-hooks.ts:129  process.once('SIGTERM', () => { void handleShutdownSignal('SIGTERM', process.exit); });  /  shutdown-hooks.ts:132  process.once('SIGINT', () => { void handleShutdownSignal('SIGINT', process.exit); });  /  handleShutdownSignal: 141 const results = await runShutdownHooks(); ... 147 exitProcess(signal === 'SIGINT' ? 130 : 143);  --- AND context-server.ts:1547 process.on('SIGTERM', () => { void fatalShutdown('Received SIGTERM, shutting down...', 0); });
```
- **Why:** On SIGTERM/SIGINT TWO independent handlers fire. installProcessHooks() runs at first registerShutdownHook() call — which happens at module-import time in tool-cache.ts:603, retry-manager.ts:1047, shadow-evaluation-runtime.ts:507, access-tracker.ts:319, graph-lifecycle.ts:382, session-manager.ts:1420 (all imported by context-server). So shutdown-hooks' process.once('SIGTERM')->handleShutdownSignal->process.exit(143) is registered BEFORE context-server's process.on('SIGTERM')->fatalShutdown(...,0). handleShutdownSignal calls process.exit(143/1) after only runShutdownHooks(), which can fire BEFORE fatalShutdown's cleanup IIFE reaches the durability-critical closeDb() WAL TRUNCATE checkpoint at context-server.ts:1458. This races-out the checkpoint-on-close durability guarantee that commit 904204c272 / 008 exists to protect, and yields a nondeterministic exit code (143/1 vs 0). The double-handler predates the SIGHUP/SIGQUIT commit (pre-existing class-of-bug), but it remains a live correctness risk in the exact shutdown path under review.
- **Fix:** Make shutdown-hooks' installProcessHooks() NOT auto-register process-level SIGTERM/SIGINT handlers when context-server owns teardown (e.g. gate behind an opt-in flag, or have context-server be the sole signal owner and call runShutdownHooks() itself — which it already does at line 1474).

### [P2] CORR-2 — signal-vocabulary asymmetry  (confidence 0.9)
- **[SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts:38, 129-134]** · finding_class: `docs-vs-code`
- **Evidence:**
```
shutdown-hooks.ts:38  type ShutdownSignal = 'SIGINT' | 'SIGTERM';  / installProcessHooks only does process.once('SIGTERM') and process.once('SIGINT') — no SIGHUP/SIGQUIT. context-server.ts:1553-1558 newly added process.on('SIGHUP')/process.on('SIGQUIT') -> fatalShutdown.
```
- **Why:** Not a defect: the new SIGHUP/SIGQUIT handlers live ONLY in context-server, so for those two signals there is exactly ONE handler and teardown ordering is clean. Worth recording that the two signal subsystems intentionally diverge (CORR-1's double-fire is confined to SIGTERM/SIGINT). The SIGHUP/SIGQUIT additions did NOT introduce a new double-shutdown path.
- **Fix:** No change required; optionally document in shutdown-hooks.ts that SIGHUP/SIGQUIT are owned solely by context-server to prevent future drift.

## Coverage
COVERED: (1) fatalShutdown double-shutdown guard (shuttingDown at context-server.ts:1425-1426) — correct, idempotent, returns early on re-entry. (2) New SIGHUP/SIGQUIT handlers (1553-1558) — confirmed they route to fatalShutdown(...,0), single-handler, no new race introduced. (3) Teardown ordering — verified the invariant that closeDb() (1458) MUST run AFTER the fileWatcher drain (1452); the order on disk is correct and matches the commit's documented invariant comment. (4) Timer interaction — clearAllTimers() at 1476 also clears the deadlineTimer (both tracked in the same timer-registry Set), but this is BENIGN: line 1476 is only reached on the non-timeout path, the deadline callback being cleared then is harmless and the clearRegisteredTimer at 1487 is a no-op; on the timeout/hang path 1476 is never reached so the deadline still fires correctly. (5) checkpointAllWal interval (1994) — guards with `if (!db) return` (vector-index-store.ts:1314) so it no-ops after closeDb sets db=null; cleared by clearAllTimers; no post-close checkpoint race. (6) runCleanupStep/runAsyncCleanupStep error handling (cleanup-helpers.ts:8-23) — both catch-and-log without aborting the sequence; correct. (7) runShutdownHooks `running` guard (shutdown-hooks.ts:63) — prevents hooks running twice across the two competing handlers; hooks themselves execute once. MAIN FINDING: CORR-1 double SIGTERM/SIGINT handler race (context-server.fatalShutdown vs shutdown-hooks.handleShutdownSignal both calling process.exit independently) can terminate the process via exit(143/1) before the durability checkpoint completes. COULD NOT VERIFY: the launcher-side grace>deadline claim (RESPAWN_REAP_GRACE_MS=7000 > SHUTDOWN_DEADLINE_MS=5000) — the launcher file is outside the scoped files and grep did not surface RESPAWN_REAP_GRACE_MS in the daemon tree, so the 7000ms grace value and signal-forwarding could not be confirmed from disk this pass; SHUTDOWN_DEADLINE_MS=5000 (context-server.ts:1414) is confirmed. Did not run the test suites (read-only pass); lifecycle-shutdown.vitest.ts covers cleanup helpers + tool-cache only, NOT the integrated signal-handler/double-handler path, so CORR-1 is untested.

Review verdict: CONDITIONAL
