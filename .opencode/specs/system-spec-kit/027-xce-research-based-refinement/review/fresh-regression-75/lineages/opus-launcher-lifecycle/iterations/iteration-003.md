# Seat opus-launcher-lifecycle — iteration 3 (global #22)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-launcher-lifecycle
- Verdict: **PASS** · Findings: P0=0 P1=0 P2=1

## Analysis

## Review Analysis — seat `opus-launcher-lifecycle`

**Angle:** SIGTERM ↔ relaunch flap root cause in `shutdownLauncherForSignal` / child `kill(signal)` vs. relaunch. Verify owner SIGTERM no longer flaps.

### What I traced (real behavior, not names)

**1. The flap root cause is genuinely fixed.** The flap was: SIGTERM → launcher kills the context-server child → the child `exit` handler relaunches a fresh daemon under a session that is disposing → every bridged transport drops. The fix has two interlocking guards, and the ordering is correct:

- `shutdownLauncherForSignal` sets `launcherShutdownInProgress = true` **synchronously at the very top** (`mk-spec-memory-launcher.cjs:1442`), *before* any `child.kill()` (kill path at `:1493`, re-election release at `:1457`). Because Node is single-threaded, the child `exit` callback (`:1337`) runs as a later event-loop task and observes the flag, returning early at `:1338` — no relaunch.
- The deferred relaunch timer re-checks at *fire* time via `shouldAbortRelaunchOnFire({ shuttingDown, currentPpid, initialPpid })` (`:1361`), which aborts on shutdown **or** ppid change **or** reparent-to-1 (`model-server-supervision.cjs:319-321`). `LAUNCHER_INITIAL_PPID` is captured at module load (`:108`), so owner disposal that changes ppid is caught even if no SIGTERM was delivered.

**2. Re-election (default-on) SIGTERM path is correct.** `shouldReleaseDaemonForReelection` (`:1453`) releases the detached/`unref`'d daemon instead of killing it: it reaps only the non-adoptable model-server, detaches the `exit→clearAllLeaseFiles` listener (`:1468`) so the pid-lease+socket survive for adoption, clears only the owner lease, and exits 0. No child kill → no `exit` event → no relaunch. The daemon (spawned `detached:true`, `:1324`) is in its own process group, so a terminal SIGINT to the host's foreground group does not reach it.

**3. Non-re-election SIGTERM path is correct.** Kills children with `signal`, waits `RESPAWN_REAP_GRACE_MS` (7000ms), escalates to SIGKILL, then `clearAllLeaseFiles` + `exit(128)`. The `exit` handler returns early due to the shutdown flag → no flap.

**4. Reentrancy & interleaving are safe.** The `:1441` guard makes a second signal a no-op. An RSS-recycle (`recycleDaemonInPlace`) in flight when SIGTERM arrives has its pending `supervisorRelaunchTimer` cleared at `:1444`, and its kill relies on the exit handler that now returns early — no relaunch.

**5. Regression coverage exists.** `launcher-watchdog.vitest.ts:299-330` asserts the guard: no-abort when healthy, abort on shutting-down, abort on changed ppid, abort on reparent-to-1, no-abort for matching-ppid crash/RSS recovery. `launcher-daemon-reelection.vitest.ts:43-48` covers the release decision. The assigned flap is fixed and pinned.

### One consistency gap found (sibling relaunch path)

The `EXIT_DB_LOCK_HELD` (86) retry path `handleDbLockHeldChildExit` schedules `launchServer()` after a 2–8s backoff but its fire-time guard checks **only** `launcherShutdownInProgress` (`:1425`), not the ppid/owner-gone condition that the primary `scheduleRelaunch` path enforces via `shouldAbortRelaunchOnFire` (`:1361`). If the owning runtime disappears without delivering SIGTERM (host crash → orphaned launcher, ppid→1) at the moment a child exits 86, this path will relaunch the daemon under a disposed session — the same relaunch-under-disposal class the epic hardened, just on a different exit path. Impact is bounded (≤3 retries, then reports + `exit(0)`; daemon is detached) so it cannot sustain an infinite flap, which is why I rate it P2 hardening, not P1.

### Verdict
Core angle **verified fixed and regression-tested**; owner SIGTERM does not flap. One low-severity consistency gap on the db-lock retry path.

```json
{"seat":"opus-launcher-lifecycle","model":"claude-opus-4-8","angle":"SIGTERM handling: shutdownLauncherForSignal child.kill(signal) vs relaunch — the SIGTERM<->relaunch flap root cause. Verify owner SIGTERM no longer flaps.","verdict":"PASS","summary":"SIGTERM<->relaunch flap genuinely fixed: shutdown flag set before any child.kill + ppid-aware abort guard, both regression-tested. One P2 consistency gap on the db-lock-held retry path.","files_reviewed":[".opencode/bin/mk-spec-memory-launcher.cjs",".opencode/bin/lib/model-server-supervision.cjs",".opencode/skills/system-spec-kit/mcp_server/tests/launcher-watchdog.vitest.ts",".opencode/skills/system-spec-kit/mcp_server/tests/launcher-daemon-reelection.vitest.ts"],"findings":[{"severity":"P2","dimension":"correctness","title":"db-lock-held (86) retry relaunch lacks the ppid/owner-gone abort guard used by scheduleRelaunch","file":".opencode/bin/mk-spec-memory-launcher.cjs:1425","evidence":"handleDbLockHeldChildExit's retry timer at lines 1424-1428 fires launchServer() after a 2-8s backoff and gates only on `if (launcherShutdownInProgress) return;`. The primary backoff-relaunch path (line 1361) instead gates on shouldAbortRelaunchOnFire({shuttingDown, currentPpid, initialPpid}) which also aborts on ppid change / reparent-to-1.","why":"If the owning runtime disappears WITHOUT delivering SIGTERM (host crash -> launcher orphaned, ppid->1) at the moment the child exits with code 86, this retry path relaunches the daemon under a disposed session — the same relaunch-under-disposal class the epic hardened elsewhere. Bounded (<=3 retries, then report+exit) so it cannot sustain an infinite flap, but it is an inconsistent guard on a sibling relaunch path.","recommendation":"In the retry setTimeout, replace the bare launcherShutdownInProgress check with the same shouldAbortRelaunchOnFire({shuttingDown: launcherShutdownInProgress, currentPpid: process.ppid, initialPpid: LAUNCHER_INITIAL_PPID}) guard so both relaunch paths abort identically when the owning runtime is gone."}]}
```
