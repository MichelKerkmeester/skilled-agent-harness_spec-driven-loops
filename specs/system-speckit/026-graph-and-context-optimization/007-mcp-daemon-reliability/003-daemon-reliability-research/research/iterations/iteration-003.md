# Iteration 003 — Adversarial convergence (4 Opus skeptics, parallel)

Each iteration-002 design was handed to an Opus agent told to REFUTE it and list the guards it must have. Source: workflow `wf_60883ac5-906`, phase "Iteration B". **Verdict: all three top designs `designHoldsUp: false` (high confidence); RC-5 stays refuted.** The most consequential discovery is the sidecar process-scope error, which reframes RC-1 itself.

## ★ The reframing discovery — RC-1 memory lives in the SIDECAR, not the daemon
Under the default `auto` execution policy, hf-local/sentence-transformers run in a **forked sidecar worker process**: `shouldUseSidecar('hf-local') === true` (`execution-router.ts:35,80-91`, `SIDECAR_LOCAL_PROVIDERS = {hf-local, sentence-transformers}`), and the sidecar is `fork(workerPath)`'d at `sidecar-client.ts:575`. Bulk reindex embedding (`reindex.ts:404,427`) therefore grows the ~1–2 GB native ORT RSS **in the sidecar grandchild**, which holds its own process-lifetime `providerPromise` and only `process.exit(0)`s (`sidecar-worker.ts:460-461`) — it never disposes on swap. Consequence:
- **F2** disposes the daemon's *in-process* singleton (the search path, only used when `SPECKIT_EMBEDDER_EXECUTION=direct`) — it never frees the dominant sidecar RSS.
- **F1** samples the *daemon child* RSS — under the default policy the daemon stays small while the sidecar balloons, so the watchdog never fires.
Both fixes target the wrong process as originally framed.

## F2 — designHoldsUp: FALSE (high)
- **Scope error** (above): leaves the dominant sidecar RC-1 memory unmitigated.
- **Use-after-free:** `withTimeout` (`hf-local.ts:185-198`) rejects WITHOUT cancelling the native `model(...)` run; the `inFlight` finally decrements on that rejection, draining the gate to 0 while the native run still executes → dispose frees the session under a live run → native abort. Routinely triggered by self-heal (isHealthy=false set on timeout, `hf-local.ts:369`).
- **Full leak on swap-during-cold-load:** load can take `MODEL_LOAD_TIMEOUT=120000ms` but the drain timeout is `EMBEDDING_TIMEOUT≈30000ms`; the load resolves onto an already-disposed provider and is never freed.
- **Double native dispose** via the shared `loadingPromise` tail vs `dispose()` — a native double-free can't be caught by `void p.catch()`.
- **Required guards:** scope explicitly to in-daemon vs add a sidecar companion fix; track the RAW native-run promise (not the withTimeout wrapper) in the gate; drain timeout ≥ load timeout; single-owner dispose; assert single session; dispose in test-reset paths; add swap-during-inference + swap-during-load tests.

## F1 — designHoldsUp: FALSE (high)
- **B1 (blocking):** transparent respawn **breaks the MCP `initialize` session** — the handshake negotiates per-Server state once (`sdk/server/index.js:52,270-286`); a respawned child boots a fresh Server that never saw `initialize`, so re-piping stdio *bytes* leaves the client hung. **Worse than today** (today the whole launcher relaunches and re-initializes cleanly).
- **B2 (blocking):** samples the daemon child, but RC-1 RSS is in the sidecar (above) → watchdog never fires under default policy.
- SIGTERM grace (8s) conflicts with the daemon's own `SHUTDOWN_DEADLINE_MS=5000` self-exit (`context-server.ts:1414,1539-1540`).
- Re-pipe breaks the idle-monitor stdin co-tenancy → possible idle-shutdown misfire.
- **Keep:** the crash-loop/backoff supervision half is sound. **Required guards:** drop transparent primary-daemon respawn — on RSS breach do a graceful self-exit and let the host runtime relaunch (clean re-initialize); sample the sidecar pid / process-tree; reconcile SIGTERM grace > 5s; reap the sidecar process-group on give-up.

## F3 — designHoldsUp: FALSE (high)
- **Respawn never reaps the old (wedged) daemon** → two daemons, doubled native RSS; on `tcp://` transport the new daemon crashes on EADDRINUSE (`socket-server.ts:155` rethrows for tcp).
- **"accept-success = alive" mis-classifies the OOM-wedge case:** libuv accepts at the kernel backlog even when the JS event loop is blocked in a synchronous native run — the exact RC-1 wedge → bridges the client to a daemon that never services JSON-RPC.
- **Non-exclusive lease:** spec-memory `writeLeaseFile` is last-writer-wins (no `wx`), so the "no new lock needed" single-winner claim is false; async-probe refactor can let the lease-held branch fall through to a duplicate spawn.
- **Largely inert without F1:** the launcher-pid lease means "dead daemon + live launcher" only exists if F1 keeps the launcher alive across child death.
- **Required guards:** record the daemon **child pid + heartbeat** in the lease and reap-before-respawn; exclusive (`wx`) acquire on the respawn path; convert both launchers' call sites to await the async decision; **application-level handshake** probe (not raw accept); gate F3 on F1; tcp:// EADDRINUSE handling.

## Interactions (F1×F2×F3) — designHoldsUp: FALSE (high)
- **Double-daemon / socket-steal (F1×F3):** F1's in-launcher recycle keeps the lease "held" (launcher pid) while the child is dead with a stale socket; a concurrent F3 launcher probes dead → respawns → the EADDRINUSE unlink-and-relisten (`socket-server.ts:153-166`) **steals the socket** from F1's new child → split-brain over the SQLite DB/WAL. F1's recycle bypasses the only serializers (`acquireBootstrapLock`, post-lease reprobe).
- **F2 gate is mandatory, not optional, once F1 ships** (F1 adds a frequent SIGTERM-recycle dispose trigger).
- **Required cross-fix guards:** record child pid in the lease (the shared fix); a single shared respawn entrypoint behind one lock; an F1 "recycling" marker that F3 treats as starting (never dead); route SIGTERM into graceful close + confirm socket unlink before respawn; do NOT wire F2 dispose into the 5s fatalShutdown critical path (reserve dispose for the live self-heal/reindex swap).

## Net
The convergence pass converted a plausible-but-wrong roadmap into a corrected one: the dominant memory is in the sidecar; transparent daemon respawn is unsafe (use graceful-exit-then-relaunch); the IPC leak is a non-issue. See `research.md` §6 for the hardened, re-sequenced roadmap.
