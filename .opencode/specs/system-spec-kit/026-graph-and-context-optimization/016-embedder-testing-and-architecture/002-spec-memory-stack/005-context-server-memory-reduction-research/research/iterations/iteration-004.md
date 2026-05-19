# Iteration 4 — SQLite pragma tuning (mmap_size, cache_size, wal_autocheckpoint, page_size) for memory vs perf trade-off

## Summary

The post-POST-006 baseline has moved the largest avoidable in-process pressure from model weights to SQLite residency policy: the active Ollama/Jina DB is about 121 MB, but each opened connection still gets a 64 MiB SQLite page-cache target and a 256 MiB mmap ceiling. The highest-confidence pragma change is an env-backed memory profile applied at connection open, with a balanced default of `cache_size=-16384`, `mmap_size=67108864`, `temp_store=DEFAULT`, and explicit low-memory/throughput overrides.

## Findings

### Finding 1: The current fixed cache/mmap budget is oversized for the 121 MB active DB
- Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:800-806` hard-codes `journal_mode = WAL`, `cache_size = -64000`, `mmap_size = 268435456`, `synchronous = NORMAL`, and `temp_store = MEMORY` for every vector-index connection. The active DB file `.opencode/skills/system-spec-kit/mcp_server/database/context-index__ollama__jina-embeddings-v3__1024.sqlite` was 121,110,528 bytes with a 7,584,952 byte WAL; `PRAGMA page_size=4096`, `page_count≈30037-31688`, `freelist_count=125`, `memory_index=28,000,256 bytes`, `memory_lineage=34,926,592 bytes`, `embedding_cache=16,576,512 bytes`, and `vec_memories_vector_chunks00=12,599,296 bytes`.
- Memory impact: current `cache_size=-64000` is a 64,000 KiB page-cache target per connection, and `mmap_size=268435456` allows the full active DB to become mapped resident. A read-only probe that repeatedly scanned recent `memory_index` rows and `embedding_cache` blobs showed current pragmas at `+166 MB RSS / 746 ms`; `cache_size=-16384,mmap_size=67108864,temp_store=DEFAULT` at `+133 MB RSS / 970 ms`; `cache_size=-8192,mmap_size=33554432,temp_store=DEFAULT` at `+112 MB RSS / 1256 ms`; and `cache_size=-8192,mmap_size=0,temp_store=DEFAULT` at `+87 MB RSS / 1325 ms`. Treat the timings as directional because they are cold single-process probes, but the RSS ordering is clear.
- Proposed change: in `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:800-806`, replace the fixed pragma block with an `applySqliteRuntimePragmas(new_db)` helper colocated in `vector-index-store.ts`. Use `parseBoundedEnv()` from `.opencode/skills/system-spec-kit/mcp_server/lib/util/env.ts:5-18` and defaults:
  - `SPECKIT_SQLITE_MEMORY_PROFILE=balanced`
  - balanced: `SPECKIT_SQLITE_CACHE_KIB=16384`, `SPECKIT_SQLITE_MMAP_BYTES=67108864`, `SPECKIT_SQLITE_TEMP_STORE=DEFAULT`
  - low-memory: `8192`, `33554432`, `DEFAULT`
  - throughput: current-equivalent `64000`, `268435456`, `MEMORY`
  Keep `journal_mode=WAL`, `busy_timeout=10000`, `foreign_keys=ON`, and `synchronous=NORMAL` unchanged unless the env explicitly overrides.
- Trade-off: balanced saves roughly 30-35 MB RSS in the probe but made the synthetic scan about 30% slower; low-memory saves roughly 50-55 MB but was about 65-70% slower. Real `memory_search` may be less affected because it returns smaller result sets than the blob-heavy probe.
- Effort: S

### Finding 2: `mmap_size` is the dominant SQLite RSS lever; lowering only `cache_size` is not enough
- Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:376-380` keeps a process-level `db_connections` map, and `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:751-756` reuses already-open connections by resolved path. Each connection receives the same mmap/cache pragmas at `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:800-806`. Profile DB filenames are per embedder at `.opencode/skills/system-spec-kit/shared/embeddings/profile.ts:76-83`, so active and historical profile stores can coexist on disk.
- Memory impact: in the read-only active-DB probe, `cache_size=-8192` with the current 256 MiB mmap still landed at `+138 MB RSS`, essentially the same class as current. Keeping `cache_size=-64000` but lowering mmap to 32 MiB landed at `+92 MB RSS` for the shorter probe. Disabling mmap with an 8 MiB cache landed at `+52 MB RSS` in the shorter probe, but with the largest latency cost. The map means these budgets also multiply if custom-path or profile-switch workflows leave more than one DB handle open.
- Proposed change: make `SPECKIT_SQLITE_MMAP_BYTES` the primary exposed knob and log it per connection. Add a small telemetry line after applying pragmas:
  `sqlite_runtime_pragmas path=<basename> cache_kib=<n> mmap_bytes=<n> wal_autocheckpoint_pages=<n> temp_store=<mode> page_size=<n> page_count=<n>`.
  Also add a test in `.opencode/skills/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts` asserting that `initializeDb(customPath)` applies the configured pragma helper to every newly cached connection, not only the singleton.
- Trade-off: lower mmap moves hot pages out of process RSS and into normal file I/O/page-cache behavior, which can increase repeated scan latency. The feature set and embedder pluggability do not change.
- Effort: S

### Finding 3: `wal_autocheckpoint` should be explicit but it is not a major RSS root
- Evidence: the startup code verifies WAL mode at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1642-1648`, but no source path sets `wal_autocheckpoint` (`rg wal_autocheckpoint` returns no production hits). The active DB reports `PRAGMA wal_autocheckpoint=1000`; at 4096 byte pages that is about 3.9 MiB. The active WAL file was 7,584,952 bytes and the `-shm` file was 32,768 bytes.
- Memory impact: WAL tuning is a small RSS lever compared with mmap/page cache. It can bound dirty file-cache and disk footprint by a few MB, but it will not explain a 246 MB process by itself.
- Proposed change: in the new `applySqliteRuntimePragmas()` helper, add `SPECKIT_SQLITE_WAL_AUTOCHECKPOINT_PAGES` with default `512` for balanced/low-memory and `1000` for throughput. Apply `new_db.pragma(\`wal_autocheckpoint = ${pages}\`)` after `journal_mode = WAL`. Do not disable WAL; the single-writer lease still benefits from WAL readers and the code already treats WAL as an operational concurrency guarantee.
- Trade-off: smaller autocheckpoints can move checkpoint work into more commits, so write-heavy save/reindex bursts may see occasional latency bumps. The upside is a smaller WAL steady state and more predictable file-cache pressure.
- Effort: S

### Finding 4: `temp_store = MEMORY` is throughput-biased and risky during schema/rebuild bursts
- Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:806` sets `temp_store = MEMORY` globally for the connection. Startup then runs integrity/dimension checks and initializes search consumers at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1597-1684`; BM25 can rebuild from the database at `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1706-1711`.
- Memory impact: the simple probe did not isolate a large temp-store delta because the scanned queries did not need large temp b-trees. The risk is burst memory: large sorts, rebuilds, migrations, or ad hoc diagnostics can allocate temp structures inside the process instead of spilling to SQLite's temp storage.
- Proposed change: default `SPECKIT_SQLITE_TEMP_STORE=DEFAULT` for balanced/low-memory profiles and keep `MEMORY` only for `SPECKIT_SQLITE_MEMORY_PROFILE=throughput` or explicit override. If a known migration/rebuild needs memory temp storage, set it in that narrow operation and restore the runtime default afterward.
- Trade-off: some rebuilds or sorted diagnostics may use temp files and get slower. That is a better default for a long-lived MCP daemon whose current goal is lower steady RSS.
- Effort: S

### Finding 5: `page_size` should stay 4096 for existing stores; changing it is an offline migration, not a runtime memory fix
- Evidence: neither `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:800-806` nor schema creation in `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2328-2485` sets `page_size`. Both active Ollama/Jina and historical llama-cpp DBs report `PRAGMA page_size=4096`. The active embedder dimensions remain pluggable: Ollama manifests include 384/768/1024 dimensional models at `.opencode/skills/system-spec-kit/shared/embeddings/providers/ollama.ts:26-68`, Voyage supports 1024 default with 256/512/1024/2048 variants at `.opencode/skills/system-spec-kit/shared/embeddings/providers/voyage.ts:31-44`, and llama-cpp defaults to 768 at `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts:19-32`.
- Memory impact: no immediate RSS win. `page_size` is persistent and only takes effect before table creation or after `VACUUM`; changing existing profile DBs would rewrite the store. Larger pages might help some 1024/2048-dim BLOB locality, but they can also waste space for metadata-heavy tables like `memory_index` and `memory_lineage`.
- Proposed change: do not set `page_size` in runtime startup. If benchmarking later proves a larger page helps vector-heavy profiles, add it only to an offline `speckit db compact --page-size=<4096|8192|16384>` maintenance command that creates a new profile DB, copies data, runs `VACUUM`, validates row/vector counts, and atomically swaps files. Keep runtime profile DB creation at SQLite's default 4096 until that evidence exists.
- Trade-off: this leaves possible vector BLOB locality gains on the table for now. It avoids a high-risk rewrite of production memory stores for an unmeasured RSS benefit.
- Effort: M for an offline compaction command; S for explicitly documenting "no runtime page_size change".

## Cross-references

This builds directly on Iteration 1 Finding 2, but updates the recommendation for the new 246 MB baseline and the active 121 MB Ollama/Jina DB rather than the old 716-751 MB llama-cpp store. It also sharpens Iteration 2 Finding 1: startup DB opening remains an important timing issue, but if the DB is opened eagerly, the connection should not immediately reserve throughput-biased cache/mmap budgets. It aligns with Iteration 3 Finding 3: persistent cache eviction needs `PRAGMA shrink_memory`/maintenance to make deletions visible in RSS, while this iteration focuses on the connection-level residency ceiling before and after such maintenance.

## Negative knowledge (ruled-out)

- Disabling WAL is the wrong lever. WAL is explicitly verified at startup and supports the daemon's concurrency model; its current disk footprint is single-digit MB, not the main RSS contributor.
- Lowering `cache_size` alone does not materially reduce RSS while `mmap_size` stays at 256 MiB. The probe with 8 MiB cache and 256 MiB mmap was still in the same RSS class as current.
- `page_size` is not a safe runtime pragma for existing profile stores. It requires an offline rebuild and should not be bundled with normal daemon startup.
- The active embedder choice does not require SQLite-specific model restrictions. The same cache/mmap policy works for Voyage, llama-cpp, Ollama, BGE, mxbai, and future providers because it acts on the DB connection, not on model dimensions or provider APIs.

## Open questions

- What is the measured p50/p95 for real `memory_search`, `memory_context`, `memory_save`, and embedder reindex under `balanced`, `low-memory`, and `throughput` profiles?
- Should the default be `balanced` (`16 MiB cache / 64 MiB mmap`) or `low-memory` (`8 MiB cache / 32 MiB mmap`) for Codex-launched daemons specifically?
- After the pragma helper lands, what is the live PID 4791 RSS delta after a daemon restart and a fixed search workload?
- Should profile-switch workflows close inactive `db_connections` handles after an idle period, or is lower per-connection cache/mmap enough for now?
