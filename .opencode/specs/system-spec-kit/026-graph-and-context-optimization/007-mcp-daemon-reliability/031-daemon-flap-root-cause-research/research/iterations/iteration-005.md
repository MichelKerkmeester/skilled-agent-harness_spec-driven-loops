# Iteration 005 — Fix B: uniform launcher-hardening (no OS dependency)

- **Wave:** 3 (of 5) · **Executor:** `openai/gpt-5.5-fast --variant xhigh` (read-only, exit 0) · **Seat:** bz7ig68jx · **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-005.txt` · **Raw (full change-site tables):** `../raw/iter-005.out` · **Confidence:** medium-high

> Pure-Node fix within the existing launcher/lease model; no launchd/systemd. Cited concrete change sites.

---

## Design (concrete change sites)
- **Shared release/adopt:** move spec-memory's re-election predicates + detached-spawn + owner-lease manager + stale-lease adopt/reap + supervised child-exit into `model-server-supervision.cjs` (shared primitives already at `:251-272`, `:313-321`, `:705-724`); keep service paths/build/env/replay per-launcher.
- **Advisor + code-index:** replace kill-on-signal/child-exit (advisor `:1144-1200`, code-index `:893-928`) with the shared release/adopt path; spawn backend **detached** when re-election enabled; run a launcher-side `launcher-session-proxy` for the owning stdio; add a `SPECKIT_BACKEND_ONLY` equivalent (spec-memory reference `:1315-1328`). Code-index also: stop rewriting owner lease to child PID (`:881-890`) and add `childPid` to the lease (`:705-709`) so stale-reclaim can adopt/reap.
- **Active-client awareness:** add `onClientCountChange` to the shared socket server (`socket-server.ts:184-190,310-340`) + a per-service IPC stats file (`daemonPid/secondary_clients_count/socketPath/updatedAt`); launchers read it before destructive shutdown → **fail-open to release** when count >0 or unknown/stale.
- **Proactive stale-socket sweep:** add `unlinkDeadSameUidSocket()` beside `canUnlinkExistingSocket` (`socket-server.ts:146-182`); run it BEFORE `listenOnce` (not only on EADDRINUSE) AND at launcher start after resolving the socket — unlink only same-UID real sockets whose raw connect probe is dead/refused (still refuse symlink/non-socket/foreign/out-of-root).

## Resurrector without a fresh session (chosen: warm-kick)
**Option (a): the warm-only probe fires a detached cold-start, then still returns 75.** The existing `spawnLauncher()` is ALREADY detached/fire-and-forget in all 3 CLIs (spec-memory-cli `:770-778`, code-index-cli `:941-949`, advisor-cli `:1034-1042`); the warm/non-warm branch is identical (`:914-921`/`:1085-1092`/`:1188-1195`). Change: in `ensureDaemonReady()`, when `warmOnly && probe != alive`, call `kickColdStartFromWarmProbe()` (guarded by a short-lived per-service warm-kick lock to avoid a launcher storm) before throwing `CliRetryableError`. → after the first failed warm probe, the daemon heals for the NEXT call.
- Rejected: resident watchdog (becomes a 4th daemon with the same chicken-and-egg) and escalate-after-N (slower, needs persistent counters).
- **Honest boundary:** "pure Node cannot create a process from nothing" — no session, no prompt-hook, no CLI → no recovery.

## HF sidecar refcount + idle policy
- Sidecar is killed by spec-memory release (`:1453-1464`) AND advisor exit (`:962-969`) though both share it. Fix: `hf-embed.refs.json` + `acquire/release/pruneDead/shutdownIfUnused` ModelServerRef API in `createModelServerControl()`; replace direct kills with `releaseModelServerRef()` (reap only when no live refs); spawn detached/owner-agnostic; recycle stays serialized by the existing respawn lock.
- **Idle:** main daemons **stay warm by default** under Fix B (no external supervisor) — released/backend-only idle = none or a long (8h) window, `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` override (current default 30min, `launcher-idle-timeout.ts:3-45`); HF sidecar keeps shorter refcount-aware idle (it's the high-RSS component).

## Failure-mode map (honest)
1. re-election-only/idle-death → **Partial** (uniform adopt + long idle + warm-kick; can't resurrect with zero processes)
2. advisor/code-index kill-on-shutdown → **Fully fixed** (backend-only + proxy + release, fail-open)
3. warm-probe trap → **Mostly fixed** (first call still 75 but kicks recovery; no prompt/CLI = no kick)
4. stale sockets → **Fully fixed** for same-UID real sockets (proactive pre-bind sweep)
5. SIGKILL/OOM/no-resurrector → **Partial** (relaunch while a launcher lives; warm-kick recovers next invocation; crash-loop give-up stays bounded)
6. process-based lease → **Partially mitigated** (safe without runtime labels; observability still can't distinguish runtimes)

## Pros/cons vs Fix A (OS supervision)
- **B wins:** cross-platform (pure Node), low operational friction, high alignment with the 30-phase work.
- **A wins:** true resurrection (KeepAlive/Restart=always restarts after ANY death incl. SIGKILL/OOM/reboot); B is partial there.
- Both: medium-high complexity (B in-repo code+races; A operational/platform setup).

## Residual gaps (B cannot fix)
Reboot/logout/SIGKILL-OOM of the LAST resident process with no subsequent session/CLI; a truly always-on pure-Node watchdog (recreates the problem); first warm call still 75; crash-loop give-up remains a deliberate brake unless paired with external supervision.

## Confidence + unknowns
Medium-high. Unknowns: shared-vs-per-service `SPECKIT_BACKEND_ONLY`; test fallout of converting advisor/code-index to launcher-side proxy mode; idle default (reliability says stay-warm, resource is a product choice); whether to add runtime-aware lease metadata for diagnostics now.
