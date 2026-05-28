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
    recent_action: "Parallel 5-agent fan-out + convergence; root-caused recurring daemon failures"
    next_safe_action: "Plan/implement the ranked durable fixes (RSS watchdog + auto-respawn first)"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000300"
      session_id: "030-mcp-daemon-reliability-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "RSS growth is native ONNX/ORT memory + undisposed provider swaps, not JS caches (all bounded)"
      - "Forced reconnects = bridge-to-dead-socket (existsSync check, no liveness probe)"
      - "No supervised auto-respawn; recovery is manual /mcp reconnect"
---
# Deep Research: MCP daemon reliability

## 1. Executive summary

The recurring MCP failures this session are **four distinct, independently-fixable defects**, not one. In impact order:

1. **OOM deaths (~1–2 GB RSS).** The RSS is dominated by **native (non-V8) memory**: the in-process transformers.js/ONNX model (hf-local) plus **orphaned model instances** left behind on every provider swap because `invalidateProviderSingleton()` never disposes the old provider. `--max-old-space-size` cannot cap native ORT memory, and there is **no RSS-ceiling watchdog**, so the kernel OOM-kills the daemon.
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
