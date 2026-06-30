# Iteration 3: A3 Concurrency and Multi-Writer Correctness

## Focus

This iteration defines the multi-writer contract that should sit under the A1 idempotent scan-job API and the A2 lexical-first async worker model. The primary question is how concurrent callers, daemon IPC clients, background retry/vector drainers, and worktree-isolated sessions coordinate without raw `E429`, duplicate vector work, or corrupt index state.

## Actions Taken

- Read the current deep-research state, strategy, and prior iterations to preserve the A1/A2 answers and avoid re-deriving them.
- Traced the scan lease in `core/db-state.ts` and the caller-facing lease handling in `handlers/memory-index.ts`.
- Traced scan batching, save/write transactions, retry-manager embedding claims, SQLite WAL/busy-timeout setup, IPC secondary-client fan-in, launcher lease behavior, and worktree DB isolation.
- Designed the recommended scan-key, atomic coalescing, single-writer, stale-lease, and second-caller experience contract with tradeoffs.

## Findings (file:line evidence)

1. The current scan lease is global per opened memory DB, not scope-keyed, and it serializes all scan scopes behind two config keys.

   `db-state.ts` stores scan coordination in the `config` table using only `last_index_scan` and `scan_started_at` keys [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:87] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:88]. `DEFAULT_SCAN_LEASE_EXPIRY_MS` is derived as `INDEX_SCAN_COOLDOWN * 2`, so the default stale-active lease window is 60 seconds because `INDEX_SCAN_COOLDOWN` is 30000 ms [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:89] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/config.ts:126]. Lease acquisition reads only those two keys and does not include `specFolder`, include flags, force/incremental mode, tenant/user/agent/session scope, workspace, or DB profile in the lease state [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:423] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:427].

   The effect is a DB-global scan mutex: a scan of one folder blocks a scan of an unrelated folder in the same DB. Under the future job model, the lease should not be the coalescing identity. It should be replaced by a persisted `index_scan_jobs.scan_key` uniqueness contract, with a short worker-start lease per active job or per worker slot.

2. The current active-lease claim is transaction-backed and avoids an in-process check-then-set window, but it has fail-open behavior and no job identity to return.

   `acquireIndexScanLease()` wraps the read, stale-clear, cooldown checks, and `scan_started_at` write in a `db.transaction()` callback [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:423] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:469]. The handler comment correctly states the current intent: reserve `scan_started_at` up front to avoid check-then-set races [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:238] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:239]. However, an exception while acquiring the lease logs the error and returns `acquired: true`, which is a fail-open scan path [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:486] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/db-state.ts:490]. When the lease is not acquired, the handler still returns caller-visible `E429` with `waitSeconds` and a reason, not a job handle [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:245] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:253].

   Recommendation: atomic coalescing should be one transaction that either finds an active/recent reusable job by `scan_key` or inserts a new queued job. The write should use `UNIQUE(scan_key)` plus terminal-state filtering, with insert conflict fallback to `SELECT` the winner. Acquisition failures should fail closed into `status: 'blocked_internal'` or an MCP internal error, not silently launch unleased duplicate work.

3. Same-scope callers should coalesce on a normalized scan key; different-scope callers should not be rejected, but overlapping file work still needs row-level dedupe.

   The current scan request computes one merged file list from constitutional files, spec docs, and graph metadata, dedups by canonical path, and then batches every selected file [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:301] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:306] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:476] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:477]. Incremental filtering only changes `filesToIndex` for that scan invocation [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:444] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:449]. The save path has good transaction discipline for a single file: it uses `database.transaction()` and then executes it with `.immediate()` so the DB writer lock is acquired before same-path record mutation [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2499] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2586]. Inside that transaction it rechecks same-path existing memory before creating or superseding records [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2530] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts:2549].

   Recommended `scanKey`: stable hash of normalized DB identity, workspace root, canonical `specFolder` scope or root sentinel, include flags, `force`, `incremental`, governance scope fields, and active provider/profile dimensions if they change vector work. Same key means join the same job. Different key means create/queue a different job, but lexical workers must claim canonical file work items with a unique `(canonical_path, content_hash, scope_identity)` or equivalent active-work constraint so a broad root scan and a folder scan do not index the same file simultaneously. If a file is already claimed by another compatible job, the second job should link to that work item or mark `coalescedFileWork`, not duplicate parsing/embedding.

4. SQLite provides useful write serialization, but it is not a complete scheduling model for multiple MCP clients and background workers.

   The vector index opens the canonical DB with WAL mode, `busy_timeout = 10000`, foreign keys, cache/mmap tuning, `synchronous = NORMAL`, and `wal_autocheckpoint = 256` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1262] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1263] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:1268]. Runtime startup also verifies WAL mode and forces it if needed [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1810] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/context-server.ts:1815]. This protects DB integrity and read/write concurrency, but it only makes conflicting writes wait or fail after a busy timeout; it does not decide which scan job should run, coalesce duplicate work, or expose a good caller UX.

   The IPC bridge can fan multiple clients into one daemon: it defaults to 8 secondary clients [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts:13], resolves the socket path from the DB dir or `SPECKIT_IPC_SOCKET_DIR` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts:64] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts:68], and creates a separate MCP server/transport for each secondary socket [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts:157] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts:160]. The launcher bridges to an existing lease holder or respawns a dead-socket daemon rather than intentionally running many independent daemon writers for one DB [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:401] [SOURCE: .opencode/bin/mk-spec-memory-launcher.cjs:408].

   Recommendation: keep SQLite WAL/busy-timeout as the integrity floor, but add an application scheduler above it. One daemon should own scan-job execution for a shared DB, with all primary/secondary clients creating or joining jobs through the DB-backed job table. If multiple OS processes still open the same DB, the same unique constraints and `.immediate()` worker-claim transactions must remain correct.

5. The retry manager already has the row-level vector-claim pattern that scan/vector drain should reuse rather than bypass.

   `claimRetryCandidate()` atomically changes a `pending` row to `retry` only if the row is still `pending`, has the expected `retry_count`, and has the expected `last_retry_at` [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:303] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:314]. Retry rows are similarly claimed by updating `last_retry_at` only when status and retry metadata still match [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:315] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:323]. The queue prioritizes `pending` before `retry` and applies retry backoff only to retry rows [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:557] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:563] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:579] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:591].

   The current scan path does not run a separate vector claim; it calls `indexSingleFile()` for every selected file and relies on the save pipeline's default sync embedding path from A1/A2 [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:489] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:491]. Under the future A2 design, scan-created vector drain must use the same compare-and-swap claim discipline as the retry manager. It should not independently select `embedding_status IN ('pending','retry')` and update after provider work, because two drainers could embed the same row. Ideally the scan vector drain delegates to a shared claim function so retry-manager and scan-job drainer cannot diverge.

6. Worktree isolation makes cross-session contention disappear only when every top-level session uses the wrapper; shared-main sessions can still target the same DB.

   `worktree-session.sh` documents the goal: a top-level session gets its own worktree and isolated MCP databases so concurrent sessions do not share one working tree or contend on the single-writer DB lease [SOURCE: .opencode/bin/worktree-session.sh:5] [SOURCE: .opencode/bin/worktree-session.sh:8]. It sets per-worktree `SPEC_KIT_DB_DIR`, `SPECKIT_CODE_GRAPH_DB_DIR`, and a short `SPECKIT_IPC_SOCKET_DIR` [SOURCE: .opencode/bin/worktree-session.sh:106] [SOURCE: .opencode/bin/worktree-session.sh:110] [SOURCE: .opencode/bin/worktree-session.sh:149] [SOURCE: .opencode/bin/worktree-session.sh:151]. The shared config honors `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` [SOURCE: .opencode/skills/system-spec-kit/shared/config.ts:9] [SOURCE: .opencode/skills/system-spec-kit/shared/config.ts:10], and MCP core config re-resolves `SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` at call time, constrained to project, home, or temp boundaries [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/config.ts:63] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/core/config.ts:84]. The bin README confirms the wrapper is an isolation mechanism and that direct sessions can still need a detect-and-warn guard rather than automatic relocation [SOURCE: .opencode/bin/README.md:135] [SOURCE: .opencode/bin/README.md:143].

   Coordination model: in isolated topology, scan keys and leases are per DB, so two sessions scanning their own worktree DBs should proceed independently. In shared-DB topology, all clients must coordinate through the same DB-backed job table and daemon scheduler. The design must not rely on worktree isolation as the only safety mechanism, because shared-main/direct-launch sessions and intentional shared DB overrides remain valid operational modes.

7. Second-caller experience should be deterministic and never expose raw `E429`.

   Recommended matrix:

   | Situation | 2nd caller receives | Worker behavior |
   |---|---|---|
   | Same `scanKey` active | Success envelope with existing `jobId`, `coalesced: true`, current `phase`, progress, and `nextPollAfterMs` | No new lexical/vector work is queued except optional subscriber metadata |
   | Same `scanKey` cooling down/recent complete | Existing recent job summary with `status: 'complete'` or `complete_with_pending_vectors`, `coalesced: true`, `coolingDown: true`, and `nextFreshScanAfterMs`; optional `forceNewAfterCooldown` hint | No worker start until cooldown expires unless caller changes the key with a true force/new generation option |
   | Different `scanKey` while another job active | New queued job with its own `jobId`, `coalesced: false`, `position`/`blockedByJobId`, and progress zero; no raw rejection | Scheduler either runs non-overlapping jobs concurrently only if row/file claims make it safe, or serializes workers per DB for simplicity |
   | Lease held by dead/stale worker | If heartbeat/lease age exceeds expiry, atomically steal/requeue stale `running` job and return that job with `recoveredFromStale: true`; before expiry, return active job with stale ETA warning | Stale work items move from `running` to `queued`; terminal items are not repeated |

   Reconcile this with today's 60s stale threshold by using `DEFAULT_SCAN_LEASE_EXPIRY_MS` as the initial stale-worker heartbeat expiry, not as a caller wait error. The job should expose `leaseExpiresAt` and `heartbeatAgeMs` for observability, but the caller still gets a job handle.

8. Recommended scheduler tradeoff: start with one lexical scan worker per DB, plus shared atomic vector claims; add parallelism later only when file/work-item constraints are proven.

   Correctness-first design: one active lexical worker per DB avoids overlapping root/folder scans mutating the same rows while still allowing unlimited callers to enqueue/coalesce. This has the lowest corruption risk and matches the current global lease behavior, but with much better UX. Latency tradeoff: different scopes may wait behind a long root scan. To compensate, Phase 1/2 should be bounded and checkpointed from A2, so queued jobs make progress fairly between ticks.

   More parallel design: allow different scan keys to run concurrently when they claim disjoint canonical file work items. This can improve latency but requires more schema, more claim states, dead-worker requeue logic, and careful interactions with stale cleanup. The recommendation is to implement the single lexical worker first, keep the scan-key/job model capable of reporting queue position, and later add safe parallel lexical workers if metrics prove it is needed. Vector drain can be parallel earlier because retry-manager-style compare-and-swap row claims already exist.

## Questions Answered

- A3 is answered. The current lease is DB-global, transaction-backed, and fail-open on acquisition exceptions; it should be replaced by a DB-backed scan-job coalescing model keyed by normalized scope/options/DB identity.
- Same-scope callers should join one active or recent job. Different-scope callers should get queued jobs, not `E429`; initial implementation should serialize lexical workers per DB while using atomic file/vector claims for correctness.
- SQLite WAL and busy timeout protect integrity but are not sufficient UX or scheduling primitives. A daemon/job scheduler plus DB uniqueness and immediate transactions should own coordination.
- Worktree-per-session isolation reduces contention when used, but shared-DB mode must remain safe because direct sessions and explicit DB overrides can still share one DB.
- Stale workers should be recovered by heartbeat/lease stealing after the existing 60s lease-expiry default, returning a recovered job handle instead of a retry error.

## Questions Remaining

- A4: define degraded-mode vector behavior in detail for cold/slow/unavailable embedders, circuit-open states, ENOSPC, provider timeouts, and backlog UX.
- A5: design move/rename reconciliation, orphan-row cleanup, freshness health metrics, and doctor/observability surfaces.
- Follow-up implementation planning should decide whether scan jobs require a new `index_scan_jobs`/`index_scan_work_items` schema or can initially reuse an existing job/progress table pattern with minimal new tables.

## Next Focus

A4 EMBEDDER RESILIENCE & DEGRADED-MODE INDEXING: build on the A2/A3 invariant that lexical indexing succeeds first, vectors drain separately, clean pending rows are not converted to retry during provider outages, and callers see a successful but degraded job state rather than scan failure.
