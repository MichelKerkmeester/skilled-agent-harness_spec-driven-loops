# Embedding Worker Diagnostic - Convergence

## Root-Cause Hypotheses

1. Medium-high confidence: stale multi-daemon llama-cpp/SQLite contention triggered embedding timeouts and circuit-breaker flapping; after cleanup, the system is no longer fully wedged but is recovery-rate limited. Anchors: provider singleton in `shared/embeddings.ts:365-417`, llama-cpp runtime singleton in `shared/embeddings/providers/llama-cpp.ts:71-73` and `:195-229`, shared circuit breaker in `shared/embeddings.ts:47-99`, retry circuit in `mcp_server/lib/providers/retry-manager.ts:365-399`.
2. High confidence as a secondary cause: the retry backlog cannot drain fast enough with the current background configuration. The hard-coded 5 items per 5 minutes in `retry-manager.ts:342-347` caps steady recovery at 60/hour before failures, while the observed queue is about 443.

Lower-confidence alternate: llama-cpp inference compatibility is failing in the current Node/native/GGUF stack. `canLoad()` checks import and readability, not inference (`llama-cpp.ts:294-305`), and package metadata pins `node-llama-cpp` `^3.15.1` while the install hint names 3.17.1 (`package.json:63-65`, `llama-cpp.ts:162-164`).

## Minimum-Blast-Radius Repair Sequence

1. Verify live process and lock state only:
   ```bash
   pgrep -af 'context-server|system-spec-kit.*mcp|node.*mcp_server|node-llama-cpp'
   lsof /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite*
   lsof ~/.cache/huggingface/gguf/embeddinggemma-300m/embeddinggemma-300M-Q8_0.gguf
   ```
   Rollback: none, read-only.

2. If step 1 shows stale Memory MCP daemons older than the active session and holding the target DB or GGUF, terminate only those stale PIDs:
   ```bash
   kill -TERM <stale_pid>
   sleep 5
   pgrep -af 'context-server|system-spec-kit.*mcp|node.*mcp_server|node-llama-cpp'
   ```
   Rollback: restart the affected MCP client/session. Do not kill the current active daemon.

3. Falsify provider incompatibility before code changes:
   ```bash
   cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server
   EMBEDDINGS_PROVIDER=llama-cpp LLAMA_CPP_EMBEDDINGS_GPU_LAYERS=0 node --input-type=module -e "const m=await import('../shared/dist/embeddings.js'); const v=await m.generateQueryEmbedding('health check'); console.log(v && v.length); process.exit(v && v.length===768 ? 0 : 2)"
   ```
   Rollback: none, read-only. If `shared/dist/embeddings.js` is absent, run the equivalent built entrypoint already used by the MCP daemon; do not rebuild as part of this diagnostic step.

4. If step 3 passes, apply a reversible retry-throughput patch: make `BACKGROUND_JOB_CONFIG.intervalMs` and `batchSize` environment-configurable in `mcp_server/lib/providers/retry-manager.ts:342-347`, then run the daemon with `SPECKIT_RETRY_INTERVAL_MS=60000` and `SPECKIT_RETRY_BATCH_SIZE=25` for recovery. Rollback: revert the code edit and unset both env vars.

5. Improve observability without changing behavior: route `memory_save` embedding/DB errors away from generic E081 by preserving sanitized `EMBEDDING_PROVIDER_ERROR`, `EMBEDDING_TIMEOUT`, `SQLITE_BUSY`, and `SQLITE_LOCKED` detail in the MCP error `details.requestId` path. Anchor: generic tool default in `lib/errors/core.ts:52-58` and unmatched generic message at `core.ts:180-198`. Rollback: revert this small error-mapping edit.

6. Post-fix verification:
   ```bash
   # run via MCP client
   memory_health({ autoRepair: true })
   # then sample again after 10 minutes
   memory_health({ autoRepair: false })
   ```
   Success condition: provider healthy, circuit closed, queue below 100 or falling by at least 20 rows per 10 minutes, and failed count not rising materially.

## Kill-Switch

Abort the repair and escalate if the single-process smoke test fails twice with llama-cpp inference errors, if failed embeddings increase by more than 50 within 10 minutes after the retry-throughput patch, if the active MCP process RSS exceeds 1.5 GB, or if `lsof` still shows multiple stale DB/GGUF holders after step 2.

## Risk Note

Increasing retry throughput can expose a genuinely broken provider faster, so it must follow the one-shot inference smoke test. Killing stale daemons can interrupt old MCP clients; restrict it to clearly stale PIDs holding the target DB/GGUF.
