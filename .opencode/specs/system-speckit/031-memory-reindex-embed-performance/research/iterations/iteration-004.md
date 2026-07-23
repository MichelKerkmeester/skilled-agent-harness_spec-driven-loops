# Iteration 4: Database Writer Lock and Silent Scan

## Focus

Determine what the `context-index.sqlite` single-writer lock represents, whether a packet-scoped `memory_index_scan` can legitimately run for 30 minutes, why other daemon calls remained responsive, and which hardening fits the existing architecture with the smallest change.

## Actions Taken

1. Traced the process-level database-instance lock from acquisition before database open through release after database close.
2. Traced the foreground and background `memory_index_scan` paths, including the scan lease, file batching, global repair tails, progress hooks, cancellation points, and response boundary.
3. Traced the daemon IPC bridge and MCP handler registration to test whether independent client requests are globally serialized.
4. Located the `026/004/012` corruption report and the later graceful-close and boot-integrity mitigations that cite it.

## Findings

### F-017: The logged single-writer lock is a process-lifetime sidecar SQLite lock, not a per-scan mutex

`acquire_db_instance_lock()` opens `<context-index.sqlite>.lock`, forces that sidecar to rollback-journal mode, selects `locking_mode=EXCLUSIVE`, and executes `BEGIN IMMEDIATE`. SQLite's Unix VFS retains the resulting kernel `fcntl` lock for the life of the sidecar connection. The JSON `lock-info` file is diagnostic only; its PID and timestamp produce the exact "held by pid ... since ..." refusal text but do not arbitrate ownership. A killed process cannot leak the kernel lock because the kernel releases it when the connection/process dies. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/db-instance-lock.ts:4-23] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/db-instance-lock.ts:145-192]

The lock is acquired before the main better-sqlite3 database is opened and before restore recovery or file migration. It is not released after a scan; `close_db()` releases it only after tracked database connections are checkpointed/detached/closed, normally at daemon teardown. Therefore PID 59687 holding this lock for 30 minutes is normal if PID 59687 is the live daemon. The separate standalone retry correctly refused to become a second writer, but that refusal does not identify which operation the daemon was running. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-store.ts:2079-2103] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-store.ts:2272-2324]

The main database currently opens in `journal_mode=DELETE`, not WAL. WAL is deliberately avoided because its memory-mapped `-shm` state caused platform instability. The sidecar lock also uses DELETE because WAL would permit concurrent connections and defeat its exclusivity. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-store.ts:2146-2154] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/db-instance-lock.ts:154-160]

### F-018: `memory_index_scan` adds a second, shorter application-level scan lease

After runtime initialization and a database-update check, the scan atomically acquires a config-table scan lease. A contending scan returns immediately as `coalesced` or `contended`; the acquired lease is refreshed on an interval and released in a `finally`. This prevents two scans inside the one daemon from overlapping, but it is distinct from the process-lifetime sidecar lock that prevents another process from opening the database as a writer. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:658-705] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:711-732] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:2067-2078]

This distinction resolves the apparent contradiction in the logs: `generate-context.js` saw a daemon and skipped its standalone second-writer path; another standalone process reached database initialization and was rejected by the sidecar lock; the already-owning daemon could still execute `memory_index_scan` reentrantly on its existing database handle.

### F-019: A normal incremental scan of this packet is not plausibly a 30-minute database operation

The requested `specFolder` limits document discovery to this packet. The current packet has seven eligible canonical surfaces: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `handover.md`, and `graph-metadata.json`. The default batch size is five. File indexing uses `asyncEmbedding: true`, so the primary scan persists pending embeddings rather than waiting for a full corpus embedding backfill. [SOURCE: packet-local file inventory on 2026-07-23] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/core/config.ts:122-123] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:1510-1543]

An unscoped global maintenance tail still runs despite the `specFolder` filter, but its normal work is bounded:

- Orphan sweeping is cursor-resumable and defaults to 45 seconds, hard-clamped to at most 90 seconds. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:303-315] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:914-970]
- Post-insert enrichment repair and near-duplicate repair each use `BATCH_SIZE`; near-duplicate repair may make up to five sequential embedding calls. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:1121-1187]
- Trigger-embedding backfill is default-off. If explicitly enabled, it reads all memories with trigger phrases in one projection, synchronizes them in yielding transactions, and then performs up to 100 sequential embedding generations per invocation. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/trigger-embedding-backfill.ts:260-294] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/search/trigger-embedding-backfill.ts:382-432]
- A checkpoint-derived rebuild runs only when its sentinel is present, before scan instrumentation begins. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:451-473] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:707-724]

Consequently, 30 minutes is not a credible normal duration for the seven-file incremental path or the bounded orphan sweep. It is possible only under an exceptional branch: an enabled trigger backfill with slow provider calls, one of the five near-duplicate provider calls that never resolves, a sentinel-triggered repair, or a long synchronous SQLite operation. The scan has no whole-operation deadline, and the embedding awaits shown here have no scan-level timeout wrapper. The evidence supplied for this iteration contains no daemon phase log, background job record, or stack sample, so the exact exceptional branch is **UNKNOWN**. Calling this a proven deadlock would exceed the evidence.

### F-020: Zero foreground progress and responsive health calls are expected together

The foreground handler calls `runIndexScan(args, {})`. Phase/progress hooks are absent by design, instrumentation is disabled, and the MCP call returns only after `runIndexScan` constructs its final envelope. MCP tool responses are not streamed, so a healthy long-running foreground call appears as zero response until completion. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:562-568] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:722-749] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:2081-2086]

The daemon does not impose one global request queue. Every IPC bridge socket receives its own `StdioServerTransport` and newly created MCP `Server`; each server registers an async call-tool handler that awaits only its own `dispatchTool()` promise. While a scan awaits provider I/O or reaches its cooperative `setImmediate` yields, the shared Node event loop can service `memory_health` from another client. [SOURCE: .opencode/skills/system-spec-kit/shared/ipc/socket-server.ts:370-410] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:1252-1279] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/context-server.ts:1373-1380]

The scan explicitly yields between batches and during large metadata/causal passes because non-yielding synchronous SQLite work would temporarily block health, status, and cancel calls. Therefore successful health responses during the 30-minute interval strongly rule out a process-wide event-loop deadlock. They are consistent with this one scan being suspended on an unresolved async provider operation. They do not rule out a logical hang in that one promise or intermittent synchronous stalls. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/utils/batch-processor.ts:149-176] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:1694-1710] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:1851-1863]

### F-021: The least-invasive hardening already exists: background scan jobs with polling

`memory_index_scan({ background: true })` immediately creates and returns a job ID, runs the same scan in `setImmediate`, persists `queued/running/complete/failed/cancelled` state, records phase and processed/total progress, refreshes the daemon's maintenance marker, and supports status polling and cancellation. The status response includes phase, progress percentage, timestamps, errors, and final result. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:2088-2147] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-scan-jobs.ts:41-60] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-scan-jobs.ts:74-142]

The smallest operational fix is to use `background:true` for manual/maintenance scans. The smallest product hardening is to make foreground scans opt into that existing job path by default, or reject foreground maintenance scans with an immediate hint to use it. This reuses current persistence, progress, crash recovery, and cancellation without changing single-writer arbitration.

Streaming progress is more invasive because the present MCP call-tool contract emits one final response. Queue position/ETA is also a poor fit: jobs are launched immediately and overlapping scans coalesce through a lease rather than wait in an ordered queue. A hard timeout is valuable only after provider-level abort/timeout propagation exists; otherwise returning a timeout while the unresolved operation continues would misrepresent ownership and partial completion. Per-file mtime updates and idempotent chunking already provide useful partial-completion checkpoints, so a later timeout can build on them rather than inventing a new checkpoint format. [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:1503-1509] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts:1684-1692]

### F-022: Incident `026/004/012` was corruption prevention context, not this contention root cause

The surviving bug report records an older 1 GB WAL-mode database whose FTS5 shadow pages were left half-written after abrupt daemon termination; a stale/desynchronized `-shm` prevented normal recovery. Concurrent-open churn was listed only as a plausible aggravator, and single-writer discipline as prevention. It did not prove that a 30-minute scan or lock wait caused the incident. [SOURCE: .opencode/specs/system-code-graph/z_archive/031-code-graph-buildout/012-empty-graph-first-time-auto-scan/bug-report-memory-db-corruption.md:62-85] [SOURCE: .opencode/specs/system-code-graph/z_archive/031-code-graph-buildout/012-empty-graph-first-time-auto-scan/bug-report-memory-db-corruption.md:110-123]

Later packet `026/.../008` added a best-effort WAL `TRUNCATE` checkpoint before close, and `026/.../012` added unclean-shutdown markers, marker-gated integrity detection, and a deep JSON-RPC liveness probe. Those are mitigation attempts for crash durability and hung-daemon adoption. The current sidecar kernel lock is a stronger direct prevention for the second-writer risk, but none of these documents identifies the observed foreground scan phase. [SOURCE: .opencode/specs/system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/008-spec-memory-graceful-wal-checkpoint-on-close/implementation-summary.md:46-64] [SOURCE: .opencode/specs/system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/012-boot-integrity-retention-probe/implementation-summary.md:50-73]

## Questions Answered

1. **Lock mechanism:** answered. It is an application-owned sidecar SQLite connection using SQLite DELETE/exclusive locking to retain a kernel `fcntl` lock for the daemon process lifetime; it is not the main database's WAL lock or a per-scan JavaScript mutex.
2. **Thirty-minute legitimacy:** bounded. It is not normal for this seven-file incremental scan. An unresolved provider await or exceptional repair is plausible; a process-wide deadlock is contradicted by concurrent health responses. The exact phase remains unknown without foreground phase logs or a background job record.
3. **Zero response with concurrent health:** answered. Foreground scan calls have no progress response, while separate IPC clients have independent MCP server/transports and can run whenever the event loop yields.
4. **Most valuable hardening:** answered. Reuse the existing background job/status/cancel surface; default or strongly route maintenance scans to it before adding streaming, ETA, or a hard timeout.
5. **Incident linkage:** answered. `026/004/012` documents abrupt-kill FTS5 corruption and subsequent durability/liveness mitigations, not a proven scan-lock deadlock.

## Ruled-Out Directions

- A stale leaked sidecar lock after PID death: kernel locks are released by the OS, and the lock file's continued presence is intentional.
- The foreground scan waiting 30 minutes to acquire the process lock: the owning daemon acquires it at database initialization and reuses its open handle; acquisition itself defaults to a bounded 1.8-second busy timeout.
- A globally serialized MCP daemon: independent IPC clients get separate transports/servers, and the scan has cooperative yields.
- A normal 10,000-row synchronous embedding backfill on every scan: file indexing defers embeddings, near-duplicate work is limited to five, and trigger backfill is default-off and capped at 100 provider calls.
- Queue-position/ETA as the first fix: no ordered scan queue currently exists.

## Sources Consulted

- `.opencode/skills/system-spec-kit/mcp-server/lib/search/db-instance-lock.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/search/vector-index-store.ts`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-index-scan-jobs.ts`
- `.opencode/skills/system-spec-kit/mcp-server/lib/search/trigger-embedding-backfill.ts`
- `.opencode/skills/system-spec-kit/mcp-server/utils/batch-processor.ts`
- `.opencode/skills/system-spec-kit/mcp-server/context-server.ts`
- `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts`
- `.opencode/specs/system-code-graph/z_archive/031-code-graph-buildout/012-empty-graph-first-time-auto-scan/bug-report-memory-db-corruption.md`
- `.opencode/specs/system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/008-spec-memory-graceful-wal-checkpoint-on-close/implementation-summary.md`
- `.opencode/specs/system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/012-boot-integrity-retention-probe/implementation-summary.md`

## Assessment

- `newInfoRatio`: 0.74
- Novelty justification: this iteration separated the process-lifetime kernel lock from the scan lease, bounded every routine scan phase, showed why concurrent health calls disprove a process-wide deadlock, and identified an already-shipped progress/cancel path that can harden the operator experience without changing writer arbitration.
- Confidence: high for static lock lifetime, scan structure, bounded phases, foreground/background response behavior, IPC client concurrency, and incident history; medium for runtime diagnosis because the failed foreground call left no phase record, stack sample, or provider request timing.

## Reflection

- Worked: tracing lock acquisition and release first prevented treating a normal daemon-lifetime lock as a 30-minute scan-held critical section.
- Worked: separating packet-scoped discovery from unscoped maintenance tails exposed the only realistic long-await branches.
- Failed: the exact runtime phase could not be reconstructed from the supplied symptom because the foreground path deliberately emits no phase/progress and no daemon log excerpt was available.
- Ruled out: process-wide deadlock, stale kernel-lock leakage, ordinary seven-file indexing, and global MCP request serialization.

## SCOPE VIOLATIONS

None. No implementation or researched source file was modified.

## Next Focus

Investigate Key Question 5: rank incremental daemon lease, re-election, and lock-arbitration hardening by concurrency payoff, using the confirmed process-lock/scan-job distinction from this iteration.
