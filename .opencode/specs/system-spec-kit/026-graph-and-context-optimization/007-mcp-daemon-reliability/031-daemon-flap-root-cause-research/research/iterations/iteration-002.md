# Iteration 002 — live supervision code trace

- **Wave:** 1 (of 5) · **Executor:** `openai/gpt-5.5-fast --variant xhigh` (read-only, exit 0) · **Seat:** b9vfj5114 · **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-002.txt` · **Raw (full file:line trace):** `../raw/iter-002.out` · **Confidence:** high (static), medium (live code-index×3 explanation)

> Orchestrator note: seat read the full `model-server-supervision.cjs`, all 3 launchers, `launcher-ipc-bridge.cjs`, `launcher-session-proxy.cjs`, the dist socket-server, and the runtime configs — with file:line citations throughout. I independently corroborated the re-election-is-release-for-adopt mechanism via config grep (`opencode.json:43`) and the supervision function inventory. Citations below are the seat's; ⚠️VERIFY = I will open before relying for the fix design.

---

## Root-cause-relevant findings

### No autonomous supervisor — liveness is session-coupled
`README.md:93`: **`mk-spec-memory` is the hardened reference** (persistent logging, detached re-election/adoption, owner-release-on-shutdown); **`mk-code-index` and `mk-skill-advisor` "currently stop with their child and rely on fresh-session reload plus bridge/respawn paths instead."** There is no always-on daemon manager — nothing supervises a daemon across the gap between sessions.

### Relaunch decision (exact predicate) — `model-server-supervision.cjs:251-272`
`superviseChildExit(event, actions)`: relaunch ONLY when `event.intentional === false` AND `decision.giveUp === false`. `giveUp = deathsInWindow >= maxDeaths` (crash-loop guard, L224-232). On giveUp → clearLease + reapProcessGroup + mirrorSignal/exit. Plus spec-memory's timer-fire guard `shouldAbortRelaunchOnFire()` (L319-321): aborts respawn when `shuttingDown || currentPpid !== initialPpid || currentPpid === 1` (owner disposing → don't flap). **Advisor + code-index do NOT use this relaunch path for their main child** — child exit → clear leases → exit.

### Re-election = adopt / reactive-respawn, NOT resurrect (spec-memory only)
- Wired only in `mk-spec-memory-launcher.cjs` (`daemonReelectionEnabled`/`shouldReleaseDaemonForReelection`, L196-215). Default ON in code (`SPECKIT_DAEMON_REELECTION` must be `0`/`off` to disable; `ENV_REFERENCE.md:179` confirms configs no longer set it — launcher code is source of truth).
- On owner shutdown: releases (detaches) context-server + exits launcher, leaving a detached daemon (L1449-1471). **"If that detached daemon later dies, no launcher remains to respawn it."**
- It ADOPTS an already-running released daemon, or REACTIVELY respawns a dead one — but **only when a NEW non-warm launcher starts and hits the stale-lease path** (L1570-1649). **"If there is no live owner and no new non-warm launcher invocation, fully-dead spec-memory is not resurrected."** Warm-only CLI probes exit 75, never cold-spawn (`README.md:161-164`).

### Stale-socket handling is reactive, never swept
- Reclaimed on bind: `startIpcSocketServer()` on `EADDRINUSE` unlinks only a same-UID socket under an allowed root, then retries (socket-server.js:320-335). Clean close unlinks (L356-379).
- Path existence alone doesn't block a reclaimable same-user socket; it DOES fail closed on symlink/non-socket/foreign-owned/out-of-root.
- **"If a daemon fully dies and leaves `/tmp/<service>/daemon-ipc.sock`, nothing reclaims it until another launcher or daemon bind path runs."** Failed connect does NOT unlink — `probeDaemon` reports `dead`; respawn is launcher-specific + reactive.

### Launcher divergence (why advisor/spec-memory dead, code-index ×3)
- spec-memory CAN relaunch its child while the launcher lives (L1337-1376), but on owner shutdown with re-election it exits leaving only the detached daemon → if that dies, nothing respawns.
- skill-advisor: **no re-election, no main-child relaunch**; child exit → `shutdownModelServerForLauncherExit` + clear leases + exit (L1156-1172); signal → kill child + exit (L1185-1200).
- code-index **×3 = per-session bridge/proxy launchers** (each secondary session detects the live owner and runs a reconnecting stdio proxy, L953-970 + `launcher-session-proxy.cjs:814-837`) — NOT 3 daemon owners. (Medium confidence; code supports it; live process tree not inspected.)

### Cross-session interaction
- **Kill-what-another-needs bug (advisor + code-index):** owner signal handlers "kill the child and exit **without checking active secondary IPC clients**" (advisor L1185-1200, code-index L911-928). One session's exit can kill a daemon another session is bridged to. Spec-memory's re-election is the exception (releases instead of kills).
- The old dead-owner-pid/live-childPid bug is addressed in spec-memory stale reclaim (keys on launcher pid, then adopts live childPid or serializes reap+respawn, L565-581 + L1570-1615).
- **HF sidecar cross-kill (⚠️ notable):** spec-memory re-election release KILLS the HF model-server as "non-adoptable" (L1454-1464), but that HF socket is **shared with skill-advisor** (`opencode.json:40,65`) → releasing spec-memory can recycle advisor's embedding sidecar.

## Emerging root cause (orchestrator synthesis so far)
Daemon liveness is **entirely session-coupled with no always-on supervisor**. spec-memory is hardened to *release-for-adopt* (not resurrect); advisor + code-index *die with their session*. When the last hosting/adopting session goes away — or a runtime (this Claude session) never spawns/​bridges the launcher — the daemon stays dead with a stale socket, and **only a fresh NON-WARM launcher invocation resurrects it** (warm CLI probes can't). Stale sockets are never proactively swept. This precisely matches the live state (advisor + spec-memory dead w/ stale sockets; code-index alive via per-session proxies).

## Confidence + unknowns
High on static lifecycle/predicate/socket/re-election. Medium on the live code-index×3 (per-session proxies — not process-tree-verified). Exact kill event unrecoverable (no persistent log for it). Dist not fully diffed vs TS source.
