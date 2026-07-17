# Embedding Worker Diagnostic - Cross Critique

All critiques are simulated inline by cli-codex, per the binding trace. No external CLI or subagent participated.

## Seat A critiques Seat B

Seat B's rate math is strong, but it risks treating the drain ceiling as the root cause instead of the recovery symptom. The code proves the retry loop cannot drain quickly, but it does not explain why every inline `memory_save` scenario returned E081. The missing evidence is stderr from the live MCP process around one failing save, especially whether the failure happened before indexing, during governance metadata, or after embedding deferred to pending.

## Seat A critiques Seat C

Seat C is right that `canLoad()` is not an inference test, and the package version mismatch deserves attention. The weakness is that a pure llama-cpp incompatibility does not fit the post-cleanup burst unless cache hits or non-llama paths were responsible. A direct 768-vector smoke test would change my mind quickly; without it, multi-process contention plus circuit breaker flapping still explains more facts.

## Seat B critiques Seat A

Seat A's contention theory fits the process history, but it leans on WAL pressure without direct lock evidence. The code sets WAL and `busy_timeout = 10000`, so stale readers alone should not block every write indefinitely. What would strengthen Seat A is `lsof` evidence tying old MCP processes to the target sqlite-wal file and timestamps showing E081 clustered with `SQLITE_BUSY`, provider timeouts, or circuit-open messages.

## Seat B critiques Seat C

Seat C's alternatives are useful, but some are lower probability given the data. Model corruption or hard GGUF incompatibility should produce near-zero successful vector growth, not a burst of more than 100 vector rows after cleanup. The cheapest test is still correct, but if that test passes once, I would deprioritize model corruption and shift back to retry throughput, circuit breaker thresholds, and process hygiene.

## Seat C critiques Seat A

Seat A assumes the 14 stale processes caused active failures, but the surviving daemon still flopped after cleanup. The code has an independent shared embedding circuit breaker at `shared/embeddings.ts:47-99` that can return `null` without any SQLite or mmap contention. If the only evidence is "many daemons existed", the diagnosis may overfit a visible mess and miss a simpler inference-time failure or circuit-state bug.

## Seat C critiques Seat B

Seat B correctly identifies the drain cap, but "queue drains at the cap" does not prove the queue is recoverable. A batch can process 5 items and still mark most as retry/failed, especially because `retryEmbedding()` increments retry count and eventually marks failed at `retry-manager.ts:681-741`. I would want a 10-minute sample of processed/succeeded/failed details from `runBackgroundJob()` or logs, not just vec_rows deltas.
