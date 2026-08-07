# Iteration 5: Lease, Re-election, and Lock-Arbitration Synthesis

## Focus

This iteration answered Key Question 5 by tracing the launcher lease lifecycle from owner election through detached-daemon release, stale-lease adoption, deep-probe recovery, database-lock rejection, and signal disposal. It then cross-referenced the four prior findings to rank incremental hardening work for routine 3-4+ session storms.

## Findings

### 1. The safety model is layered, but owner-lease stale reclamation is not race-free

The overall design has a sound final safety barrier: a launcher lease coordinates expected ownership, while the daemon's process-lifetime SQLite sidecar lock prevents two context servers from becoming writers. The launcher also revalidates the daemon lease under the respawn lock before reaping a snapshotted child. This means a lease mistake should normally degrade into an exit-86/retry/bridge cycle rather than two active writers. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:892-927] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1503-1606] [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/deep-research-state.jsonl:6]

The owner-lease acquisition algorithm nevertheless contains a concrete time-of-check/time-of-use race. Two launchers can both read and classify the same stale owner lease. Launcher A can unlink it and create A's lease with `O_EXCL`; delayed launcher B can then execute its already-authorized unconditional `unlinkSync(currentOwnerLeasePath)`, remove A's new lease, and create B's lease. `O_EXCL` protects only the create, not the preceding stale-path removal. The comments at lines 512-515 therefore claim a stronger compare-and-swap property than the pathname operations provide. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:499-532]

Heartbeat refresh has the same missing-fencing shape: it verifies `ownerPid`, then atomically renames a replacement without an election token or shared mutation lock. A lease replacement between the read and rename can be overwritten by the old owner. PID identity alone also does not protect against PID reuse. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:535-547]

The least-invasive correction is to acquire the existing exclusive respawn/election lock before stale-owner classification and retain it through stale removal, owner-lease creation, daemon-lease revalidation, and spawn/adopt choice. Re-read the owner lease after acquiring the lock. Add a random `leaseId`/monotonic generation and require that token for heartbeat, release, and cleanup. A delayed contender must never unlink or overwrite a lease whose token differs from the one it classified. A process-lifetime kernel leader lock or a daemon-owned lease would be stronger, but costs more.

### 2. Re-election currently releases for discovery, not durable transfer of supervision

On normal signal disposal, the launcher detaches the context server, preserves the daemon PID/socket lease, clears only the owner lease, and exits. A new launcher that sees the stale daemon lease performs a deep liveness probe and bridges to the orphan, but then clears its newly acquired owner lease before bridging. It does not become a persistent supervisor or heartbeat owner. Subsequent sessions repeat owner acquisition, stale classification, and adoption probing against the same ownerless daemon. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1622-1644] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1741-1799]

This is data-safe while the daemon and sidecar lock remain healthy, but it is availability-fragile under session storms. The mechanism is better described as release-for-discovery than re-election. A releasing launcher crash is usually recoverable because stale owner and daemon leases retain the child PID and socket. The weaker edge is any non-signal exit path that clears both leases while the detached child survives: the unconditional process `exit` cleanup and `uncaughtException` cleanup can remove discovery metadata from a still-running detached daemon. The next launcher may spawn, learn about the old writer only through exit 86, and then retry/report rather than immediately bridge. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1481-1501] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1692-1717]

The medium-cost hardening is to move the authoritative runtime descriptor and heartbeat into the backend daemon, whose lifetime it describes. At minimum, distinguish `release` from `cleanup`: never delete a live detached child's daemon lease on launcher-only failure, and let one adopter hold a renewable supervisory lease while it is connected. A later iteration should verify how idle self-exit and proxy disconnects would interact with that transfer before implementation.

### 3. Deep probes and the database lock compound as an availability feedback loop, not as a lock deadlock

Iteration 2 established that a warm secondary can incur two serial deep-probe round trips, plus an unbounded synchronous macOS `ps`, before its MCP transport is ready. Every contender also calls owner classification, whose Darwin path runs synchronous `ps` with no timeout. [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/deep-research-state.jsonl:4] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:460-496]

After owner release, each contender can add a stale-adoption probe before entering the normal bridge/session-proxy sequence. Thus a 4-session storm can create many near-simultaneous control connections and deep JSON-RPC requests against one daemon. Socket-cap refusal, maintenance event-loop starvation, and genuine death can initially look alike. Fresh owner heartbeats and maintenance markers prevent the most dangerous false reap, but they do not prevent all launchers from spending their startup budgets and reporting retryable failures. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:814-833] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:861-871] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1769-1797]

The process-lifetime fcntl sidecar lock does not directly block probes and does not explain a live daemon's silent foreground scan. It compounds only after arbitration has already failed: a competing child is spawned, the sidecar lock rejects it, and the launcher enters exponential retry/bridge handling. The lock is therefore a necessary last-resort fence but a late, expensive source of ownership truth. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1554-1606] [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/deep-research-state.jsonl:6]

The immediate hardening is to make one readiness result flow through bridge and session-proxy startup instead of probing twice, coalesce concurrent probes per socket for a short window, cap probe concurrency below the daemon client cap, and bound or remove synchronous `ps` from the handshake. Maintenance should return an explicit busy/readiness state rather than forcing callers to infer it from timeout plus a marker.

### 4. Unifying root cause: implicit context and authority are reconstructed at subsystem boundaries

All five findings share one architectural failure mode: execution context and lifecycle authority are implicit, so each boundary reconstructs policy from defaults, environment variables, files, or a second probe instead of consuming one canonical context/state transition.

- Async ingest reconstructs indexing origin and omits `fromScan`, enabling source write-back.
- The launcher bridge and session proxy reconstruct readiness independently, doubling probes.
- The advisor plugin reconstructs child environment and omits canonical socket inputs.
- Manual maintenance reconstructs execution mode as a foreground request even though it is unattended, long-running job work.
- Launcher, daemon lease, owner lease, socket probe, maintenance marker, and database lock each expose a partial ownership truth without a fenced canonical transition.

[SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/deep-research-state.jsonl:3-6]

The higher-leverage design principle is a canonical runtime context envelope plus one lifecycle state machine. The envelope should carry resolved database/socket paths, operation origin, attended/background mode, readiness evidence, and ownership generation. Boundary adapters may add data but should not independently default or recompute those fields. This does not require a daemon rewrite: the five direct fixes can land first, while shared resolvers and typed transition records prevent recurrence.

### 5. Ranked hardening changes

1. **Eliminate duplicate startup work and bound handshake latency (high impact, low-medium cost).** Reuse one successful deep-probe result through bridge and session proxy, coalesce per-socket probes during storms, cap probe concurrency, and add a hard timeout to Darwin process inspection. This directly addresses the observed MCP startup failures without changing storage semantics. [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/deep-research-state.jsonl:4]
2. **Fence owner election and stale reclamation (high impact, medium cost).** Move stale classify/remove/create under one election lock, re-read after lock acquisition, add `leaseId`/generation fencing, and require the token on refresh/release/cleanup. This closes a newly identified real race before the DB lock has to arbitrate competing children. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:499-547]
3. **Make daemon liveness authoritative across launcher disposal (high impact, medium-high cost).** Let the backend own its runtime descriptor/heartbeat, or transfer a renewable supervisory lease to exactly one adopter. Separate launcher cleanup from daemon-record cleanup so an exception cannot erase a live detached daemon's discovery path. [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1622-1644] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:1692-1717]
4. **Default maintenance scans to the existing background job API (medium-high impact, low cost).** Poll status and expose cancellation for manual/maintenance calls. Add bounded provider deadlines separately only where an unresolved provider promise is confirmed. [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/deep-research-state.jsonl:6]
5. **Fix the two concrete context-loss defects (medium impact, low cost).** Pass `fromScan: true` from async ingest and use one short, dbDir-independent model-socket default shared by launcher, model server, and plugin bridge. [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/deep-research-state.jsonl:3] [SOURCE: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/deep-research-state.jsonl:5]
6. **Introduce the canonical runtime context envelope incrementally (preventive impact, medium cost).** Start with resolved paths/readiness evidence in launcher-plugin boundaries and operation-origin/execution-mode fields in indexing boundaries; then delete local fallback reconstruction as each consumer migrates.
7. **Improve observability after arbitration is correct (supporting impact, low cost).** Emit structured transition timings and lease generation for classify, probe, adopt, lock wait, exit-86, and background maintenance. Diagnostics should identify the current authoritative holder without synchronous process-table work on the critical handshake.

## Sources Consulted

- `.opencode/bin/mk-spec-memory-launcher.cjs`, especially owner lease, stale adoption, respawn, DB-lock exit, and shutdown paths.
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/deep-research-state.jsonl`, canonical summaries for iterations 1-4.
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/deep-research-strategy.md`, topic, KQ5, boundaries, and stop conditions.
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/deep-research-config.json`, iteration limits and write ownership.

## Assessment

- `newInfoRatio`: 0.71
- Novelty justification: This pass found a specific stale-owner unlink/refresh fencing race, distinguished release-for-discovery from actual supervisory re-election, modeled the probe/DB-lock contention feedback loop, and unified all five findings into one boundary-context failure pattern with a cost-ranked fix sequence.
- Confidence: High for the static race and lifecycle claims because they follow directly from ordered filesystem/process operations. Medium for the storm amplification magnitude because no live multi-launcher load reproduction was performed in this findings-only iteration.

## Reflection

What worked: tracing all ownership mutations and shutdown branches in one file exposed interactions that isolated per-function review misses. Cross-referencing prior iteration records avoided re-investigating closed questions while still testing their interaction.

What failed or remained unavailable: the memory trigger lookup timed out, and the active OpenCode `mcp_timeout` remains unconfirmed. Neither blocks the code-level lease findings. No runtime storm was launched because this iteration is read-only and a shared production-like daemon is currently in use.

Ruled out: replacing the SQLite process-lifetime sidecar lock, treating that lock as the foreground scan hang, or redesigning the entire daemon. The sidecar lock should remain the final writer fence; earlier election and admission control should keep normal startup from reaching it.

## Recommended Next Focus

Verify proposal 2 first with deterministic interleaving tests around `acquireOwnerLeaseFile()` and `refreshOwnerLeaseFile()`: prove the stale-unlink and heartbeat-overwrite races, then evaluate the smallest lock-plus-`leaseId` protocol that prevents both without changing daemon architecture.

## SCOPE VIOLATIONS

None.
