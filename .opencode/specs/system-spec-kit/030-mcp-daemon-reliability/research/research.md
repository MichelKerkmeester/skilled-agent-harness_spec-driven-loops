---
title: "Deep Research: MCP daemon reliability — why the daemons keep dying/disconnecting and durable fixes"
description: "Hybrid parallel-fan-out + convergence investigation into recurring mk-spec-memory/mk_code_index failures: native ONNX/ORT RSS growth + undisposed provider swaps, no RSS watchdog or auto-respawn, bridge-to-dead-socket on reconnect, and rebuild-while-running crashes. Ranked durable fixes with file:line evidence."
trigger_phrases:
  - "mcp daemon reliability"
  - "mk-spec-memory OOM 1-2GB RSS"
  - "bridge to dead daemon reconnect"
  - "daemon auto-respawn watchdog"
  - "rebuild crashes running daemon"
  - "invalidateProviderSingleton dispose leak"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-mcp-daemon-reliability"
    last_updated_at: "2026-05-28T18:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Opus iters 2-3 corrected RC-1 to sidecar; hardened roadmap; refuted RC-5"
    next_safe_action: "Implement the §6 hardened roadmap (sidecar-scoped F2 + graceful-exit F1 first)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000300"
      session_id: "030-mcp-daemon-reliability-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Dominant RC-1 RSS is in the FORKED SIDECAR process, not the daemon singleton (auto policy) — corrected in iter 2-3"
      - "Forced reconnects = bridge-to-dead-socket (existsSync check, no liveness probe)"
      - "No supervised auto-respawn; recovery is manual /mcp reconnect"
      - "Transparent daemon respawn breaks the MCP initialize session — use graceful-exit-then-relaunch instead"
      - "RC-5 IPC per-connection leak is REFUTED (objects are GC-eligible); do not build F5"
---
# Deep Research: MCP daemon reliability

## 1. Executive summary

The recurring MCP failures this session are **four distinct, independently-fixable defects**, not one. In impact order:

1. **OOM deaths (~1–2 GB RSS).** The RSS is dominated by **native (non-V8) memory**: the transformers.js/ONNX model (hf-local) plus **orphaned model instances** left behind on every provider swap because `invalidateProviderSingleton()` never disposes the old provider. `--max-old-space-size` cannot cap native ORT memory, and there is **no RSS-ceiling watchdog**, so the kernel OOM-kills the process. **⚠ Corrected in iter 2-3 (§6.1): under the default `auto` policy the dominant model RSS lives in a FORKED SIDECAR process, not the daemon — so the OOM fix must target the sidecar, not (only) the daemon's in-process singleton.**
2. **No supervision / auto-restart.** When the daemon dies (crash/OOM) the launcher just clears its lease and exits — recovery is a **manual `/mcp` reconnect** every time.
3. **Bridge-to-dead-socket on reconnect.** The IPC bridge bridges if the socket *file* exists (`fs.existsSync`), never checking that anything is *listening*. A SIGKILL/OOM'd daemon leaves a stale socket, so reconnects "succeed" into a dead socket → `ECONNREFUSED` → exits 0 serving nothing → another forced reconnect.
4. **Rebuild-while-running crashes.** The mcp_server build deletes `dist/` in place; lazy-loaded modules and the forked sidecar then hit `MODULE_NOT_FOUND` mid-rebuild.

All in-process JS caches are already correctly bounded — they are **not** the leak. (The mk_code_index socket-dir `-32000` was a fifth symptom, already fixed in packet 029.)

## 2. Root causes (file:line evidence)

<!-- ANCHOR:findings -->
### RC-1 — Native model memory + undisposed provider swaps (OOM driver)
- The hf-local provider loads an ONNX model + ORT runtime into the daemon's native memory: `shared/embeddings/factory.ts:788` (`new HfLocalProvider`), `shared/embeddings/providers/hf-local.ts:241` (`getModel()` dynamic-imports `@huggingface/transformers`). Held as a process-lifetime singleton via `shared/embeddings.ts:387` (`getProvider`).
- **`invalidateProviderSingleton()` (`shared/embeddings.ts`) nulls `providerInstance` with NO `.dispose()`/`.unload()`** (verified — the function only nulls fields + resets `MODEL_NAME`). Each self-heal swap (the provider-flap fix added this session) and every `embedder_set` reindex can orphan a full model's native memory. ORT rarely releases it to the OS. **Unbounded across swaps.**
- `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB` is **unset by default** (`ENV_REFERENCE.md`), so the launcher (`mk-spec-memory-launcher.cjs:305-318`) never passes `--max-old-space-size`; and even if set it caps only V8 heap, not native ORT memory.
- Minor JS-heap accumulator: `bootstrapRecords` array (`lib/session/context-metrics.ts:76`, pushed `:127`) is unbounded (low frequency).
- **Ruled out (bounded):** trigger-matcher LRU(100), tool cache (1000+TTL), embedding cache (100MB LRU), constitutional cache (50+TTL), retry queue (SQLite, capped), graph/access caches (10k clear), session/working-memory (SQLite + cleanup). The leak is **not** the caches.

### RC-2 — No supervised auto-respawn
- `mk-spec-memory-launcher.cjs:352-361`: the child `exit` handler calls `clearLeaseFile()` then `process.kill(self,signal)` / `process.exit(code)` — **no respawn, no backoff**. Crash/OOM → launcher dies → manual reconnect.
- No watchdog, RSS-ceiling self-restart, or health-probe recycle anywhere in `.opencode/bin/`. RSS is report-only (`memory_health` `rss_mb`, `heap-profiler.ts`); the only reaction is an advisory string.
- Idle-timeout (`SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN`, default 30 min → `fatalShutdown`, `context-server.ts:1980-1985`) is a clean shutdown the launcher mirrors — also leaves nothing running until reconnect.

### RC-3 — Bridge-to-dead-socket on reconnect
- `launcher-ipc-bridge.cjs:122` bridges when `fs.existsSync(socketPath)` is true; `:57` `net.createConnection(...)` — **no pre-bridge liveness/health probe**.
- The daemon unlinks the socket **only on graceful `close()`** (`socket-server.ts:195-204`). A SIGKILL/OOM'd daemon (launcher still alive, lease "held") leaves a stale `daemon-ipc.sock` → bridge connects → `ECONNREFUSED` → `onError` → exits 0 with no working MCP (`launcher-ipc-bridge.cjs:75-78,128-133`).
- The lease records the **launcher** pid (alive), not the daemon child pid, so `process.kill(pid,0)` liveness passes even when the daemon is dead (`mk-spec-memory-launcher.cjs:156,415`).
- mk-spec-memory's `acquireBootstrapLock` has **no stale-lockdir reclaim** (mk-code-index added one at `mk-code-index-launcher.cjs:545-571`); a SIGKILL mid-bootstrap can wedge startup for 120s then throw.

### RC-4 — Rebuild-while-running crash
- `@spec-kit/mcp-server` `prebuild` → `clean` does `rmSync('dist',{recursive,force})` **in place**, then `tsc --build` repopulates over seconds (mcp_server `package.json`).
- Lazy-loaded modules break in that window: dynamic `import()` at `context-server.ts:813,850,882,1039,1040,1097`, `vector-index-store.ts:111,115,119`, `composite-scoring.ts:51`, plus the **forked** sidecar `sidecar-client.ts:575` (`fork(workerPath)` re-reads `sidecar-worker.js` from disk every embed). Eager-loading fixes the `import()` cases but **not** the fork — so a temp-dir + atomic-rename build is the robust fix.

### RC-5 — IPC per-connection leak (slow growth)
- `socket-server.ts:133` creates a fresh MCP `Server` per secondary connection (`registerContextServerHandlers`), but disconnect (`:140-145`) only calls `transport.close()` — the `secondaryServer` and the per-socket `write` monkey-patch + `data` listener are never torn down, retaining handler graphs across reconnect churn.

<!-- /ANCHOR:findings -->

## 3. Ranked durable fixes

> **⚠ Superseded by §6.** Iterations 2-3 (Opus, adversarial) found every fix below unsafe **as framed here** and corrected RC-1's process scope. The table is kept for provenance; **implement from §6**, not §3.

| # | Fix | Addresses | File(s) | Impact / Effort |
|---|-----|-----------|---------|-----------------|
| F1 | **Launcher RSS-ceiling watchdog + supervised auto-respawn** (poll child RSS; on `SPECKIT_CONTEXT_SERVER_MAX_RSS_MB` → graceful SIGTERM + respawn, beating the OOM killer; on unexpected child exit → respawn with backoff, **keeping the lease**) | RC-1, RC-2 | `mk-spec-memory-launcher.cjs:343-367,352-361` | High / Med |
| F2 | **Dispose the provider on invalidate** (add `HfLocalProvider.dispose()` freeing the ORT session; call it in `invalidateProviderSingleton()` before nulling) | RC-1 | `shared/embeddings.ts` (invalidate), `shared/embeddings/providers/hf-local.ts` | High / Low |
| F3 | **Liveness-probe before bridging + auto-respawn on dead socket** (replace `fs.existsSync` with a connect-with-timeout; on refusal reclaim lease + `launchServer()` instead of exit 0) | RC-3 | `launcher-ipc-bridge.cjs:122,128-133` | High / Med |
| F4 | **Build to temp dir + atomic rename** (emit to `dist.next/`, finalize, then `rename` — never delete the live `dist/`) | RC-4 | mcp_server `package.json` clean/build, `finalize-dist.mjs` | Med / Low |
| F5 | **Close `secondaryServer` on disconnect** (+ restore `socket.write`, `socket.off('data')`) | RC-5 | `socket-server.ts:140-145` | Med / Low |
| F6 | Defense-in-depth: set `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB` (≈512–768); prefer the forked sidecar for hf-local (`SPECKIT_EMBEDDER_EXECUTION=sidecar`) so model RSS lives in a disposable child; cap `bootstrapRecords` (ring buffer); add stale-lockdir reclaim to mk-spec-memory; record the daemon child pid in the lease | RC-1, RC-3 | multiple | Low / Low |

**Recommended sequencing:** F2 (cheap, stops the worst leak) → F1 (the safety net that makes any residual growth self-heal instead of OOM-killing) → F3 (kills the forced-reconnect loop) → F4 → F5 → F6. F1+F3 together would have eliminated nearly all the manual `/mcp` reconnects this session.

## 4. Method & convergence

Hybrid: 5 parallel investigation agents (memory/OOM, lease+bridge, rebuild, supervision, timers/leaks) → convergence verification of the three highest-impact claims by direct read (`invalidateProviderSingleton` lacks dispose ✓; bridge uses `existsSync`+`createConnection` with no liveness check ✓; mcp_server build deletes dist in place ✓). Findings were mutually consistent (no contradictions); JS-cache-leak hypotheses were ruled out by all relevant agents. Scope corrected mid-investigation: native ORT memory, not JS caches, is the OOM driver.

## 5. Negative knowledge (ruled out)
- In-process JS caches are NOT the leak — all are bounded (LRU/TTL/SQLite caps).
- `--max-old-space-size` alone will NOT prevent the OOM — it cannot bound native ORT memory.
- Eager-loading modules alone will NOT fully fix the rebuild crash — the forked sidecar re-reads from disk.
- (iter 2-3) RC-5 IPC per-connection leak is REFUTED — the per-connection objects are GC-eligible after socket `close`; **do not build F5**.

## 6. Convergence iterations 2-3 (Opus, adversarial) — corrected findings + hardened roadmap

Two further Opus iterations deepened each fix into a concrete design (`research/iterations/iteration-002.md`) then adversarially refuted each one (`research/iterations/iteration-003.md`). **All three top fixes were `designHoldsUp: false` (high confidence) as framed in §3**, and one discovery corrects RC-1 itself. The roadmap below supersedes §3.

### 6.1 ★ Critical correction to RC-1 — the dominant memory is in the SIDECAR, not the daemon
Under the default `auto` execution policy, hf-local/sentence-transformers run in a **forked sidecar worker process**: `shouldUseSidecar('hf-local') === true` (`execution-router.ts:35,80-91`; `SIDECAR_LOCAL_PROVIDERS = {hf-local, sentence-transformers}`), and the sidecar is `fork(workerPath)`'d at `sidecar-client.ts:575`. Bulk reindex embedding (`reindex.ts:404,427`) grows the ~1–2 GB native ORT RSS **in the sidecar grandchild**, which holds its own process-lifetime `providerPromise` and never disposes on swap (only `process.exit(0)`, `sidecar-worker.ts:460-461`). So F2 (disposes the daemon's *in-process* singleton, used only when `SPECKIT_EMBEDDER_EXECUTION=direct`) and F1 (samples the *daemon child*) both target the wrong process as framed. **Any RC-1 fix must target the sidecar process** (recycle it / dispose its provider / RSS-roll-up over the process tree), or force `direct` execution.

### 6.2 Per-fix verdicts (all refuted as framed)

| Fix | Verdict | Blocking flaw(s) | Hardening required |
|-----|---------|------------------|--------------------|
| **F2** dispose-on-invalidate | refuted | (a) scopes to the daemon singleton, missing the dominant sidecar RSS; (b) `withTimeout` rejects without cancelling the native run, so the in-flight gate can drain to 0 and dispose under a live native run → segfault; (c) cold-load (120s) vs drain timeout (30s) leaves a freshly-loaded session never disposed; (d) double-dispose via the shared `loadingPromise` | Gate must track the RAW native-run promise (not the `withTimeout` wrapper); drain timeout ≥ `MODEL_LOAD_TIMEOUT`; single-owner dispose; add a **sidecar companion fix**; tests for swap-during-inference + swap-during-load |
| **F1** RSS watchdog + respawn | refuted | (a) transparent respawn **breaks the MCP `initialize` session** (re-piping bytes ≠ restoring per-Server session) → worse than today; (b) samples the daemon child, but RC-1 RSS is in the sidecar → never fires; (c) 8s SIGTERM grace conflicts with the daemon's own 5s `SHUTDOWN_DEADLINE_MS` self-exit; (d) re-pipe breaks idle-monitor stdin co-tenancy | **Drop transparent primary-daemon respawn** — on RSS breach do a graceful self-exit and let the host runtime relaunch (clean re-initialize); sample the **sidecar pid / process tree**; keep the crash-loop + backoff supervision; reap the sidecar process-group on give-up |
| **F3** liveness-probe bridge | refuted | (a) respawn never reaps the old wedged daemon → 2 daemons / doubled RSS; tcp:// EADDRINUSE crash; (b) "accept-success = alive" mis-classifies an OOM-wedged daemon (libuv accepts while the JS loop is blocked in a native run); (c) non-exclusive lease → not actually single-winner; (d) largely inert without F1 | Record the **daemon child pid + heartbeat** in the lease + **reap-before-respawn**; exclusive (`wx`) acquire on respawn; **application-level handshake** probe (not raw accept); convert both launchers' call sites to await; gate on F1; tcp:// handling |
| **F5** / RC-5 | **do not build** | RC-5 is refuted — the per-connection objects are GC-eligible after `close` (static reference-graph proof in iter-002) | none — building F5 is dead weight that could mask the real RCs |

### 6.3 Cross-fix interaction guards (mandatory if F1+F3 ship together)
- **Double-daemon / socket-steal (F1×F3):** F1's in-launcher recycle keeps the lease "held" (launcher pid) with a stale socket; a concurrent F3 launcher probes dead → respawns → EADDRINUSE unlink-and-relisten (`socket-server.ts:153-166`) **steals the socket** → split-brain over SQLite/WAL. Fixes: **record the child pid in the lease** (the single most important shared fix — port `mk-code-index-launcher.cjs:593-602`); a **single shared respawn entrypoint behind one lock**; an F1 "recycling" marker that F3 treats as *starting* (never dead); route SIGTERM into the graceful close and confirm socket-unlink before respawn.
- **F2 gate is mandatory, not optional, once F1 ships** — F1 adds a frequent SIGTERM-recycle dispose trigger; without F2's hardened gate every recycle that coincides with an in-flight inference is a native use-after-free.
- **Do NOT wire F2 dispose into the 5s `fatalShutdown` critical path** — reserve dispose for the live self-heal/reindex swap (process keeps running); on shutdown let the OS reclaim native memory.

### 6.4 Hardened, re-sequenced roadmap
1. **Decide execution-process scope first** (prerequisite for F1+F2): confirm whether the deployment uses sidecar (`auto`, default) or `direct`. The RC-1 fix follows the model's actual process.
2. **F2′ (sidecar-aware dispose):** dispose the provider on swap with a native-run-lifetime gate + single-owner dispose; **and** recycle/dispose the *sidecar* worker's provider (or the sidecar process) on swap — this is where the bulk RSS lives.
3. **F1′ (graceful-exit watchdog, no transparent respawn):** sample the sidecar/process-tree RSS; on breach, graceful self-exit → host relaunch (clean MCP re-initialize); keep crash-loop + backoff; record the daemon child pid in the lease.
4. **F3′ (reap-aware, app-level-probe bridge):** child-pid+heartbeat lease, reap-before-respawn, application-level handshake probe, exclusive acquire, shared respawn entrypoint; sequence after the child-pid lease lands.
5. **F4 (atomic-rename build):** unchanged — build to `dist.next/` + rename; never delete the live `dist/`.
6. **F6 defense-in-depth:** stale-lockdir reclaim for mk-spec-memory; `bootstrapRecords` ring buffer. (Drop the "prefer sidecar" item — sidecar is already the default and is itself the RC-1 surface.)

### 6.5 Method
Iteration A: 4 Opus agents designed F2/F1/F3 + verified RC-5 against the real code. Iteration B: 4 Opus skeptics adversarially refuted each design + the F1×F2×F3 interaction. All four B verdicts returned `designHoldsUp: false` (high confidence), surfacing the sidecar process-scope error, the MCP-session-break, the use-after-free in F2's gate, and the F1×F3 socket-steal — none of which the single-pass fan-out (§3) caught. This is the value the convergence iterations added.
