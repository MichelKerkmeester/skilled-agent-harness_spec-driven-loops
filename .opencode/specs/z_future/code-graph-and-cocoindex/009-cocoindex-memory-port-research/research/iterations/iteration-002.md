# Iteration 002 - K1.1 memoization and dependency-DAG transfer

## Focus

K1.1 asks whether CocoIndex's memoized execution model transfers to the spec_kit_memory MCP port: canonical input fingerprints plus code or logic fingerprints, stable-path memo records, and dependency-aware invalidation over changed source or derived state.

Verdict preview: yes with adaptation. The principles transfer cleanly, but the runtime substrate does not. The TypeScript and SQLite port should model the same state explicitly in relational tables rather than attempt to recreate heed's encoded-key KV layout or Rust/PyO3 execution callbacks.

## Actions Taken

- Read CocoIndex state schema in `external/cocoindex-main/rust/core/src/state/db_schema.rs`.
- Read CocoIndex execution and commit path in `external/cocoindex-main/rust/core/src/engine/execution.rs`.
- Located Rust-side Python fingerprint entry point in `external/cocoindex-main/rust/py/src/memo_fingerprint.rs`.
- Read our incremental indexer in `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts`.
- Read parser/hash extraction in `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`.
- Read our indexing mutation path in `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts` and `handlers/memory-save.ts`.
- Read the current `memory_index` schema in `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`.

## Findings

### Transfers cleanly

Canonical input hashing transfers. CocoIndex already separates the Python canonicalization layer from a Rust byte-level fingerprinter. The Rust entry point is `fingerprint_simple_object`, which builds a `Fingerprinter`, writes typed Python values, and returns a digest (`memo_fingerprint.rs:136-143`). The typing discipline is the portable part: booleans, integers, floats, strings, bytes, sequences, mappings, sets, fingerprints, and UUIDs all receive explicit type tags (`memo_fingerprint.rs:13-133`). In our stack, the equivalent should be a deterministic TypeScript canonicalizer over parser inputs and tool parameters, hashed with SHA-256 or a fixed-width digest.

Content-hash skip logic already exists and maps directly to memo input fingerprints. Our incremental path computes a SHA-256 over file bytes (`incremental-index.ts:139-143`) and uses mtime as a fast path, only checking the hash when stored metadata has a content hash (`incremental-index.ts:172-186`). The parser also computes content hashes over normalized parsed content (`memory-parser.ts:342-370`, `memory-parser.ts:888-890`). This is enough to seed first-generation fingerprints for file-level indexing.

Code or logic hash invalidation transfers as a concept. CocoIndex stores logic dependencies next to both component and function memo entries (`db_schema.rs:181-190`, `db_schema.rs:198-216`). On lookup, it rejects a memo if the stored logic dependencies are not present in the active environment (`execution.rs:101-108`, `execution.rs:249-252`). In our stack, this can become `code_hash` plus optional `logic_deps_json` or a normalized dependency edge table keyed by component or transform name.

Value-level diff detection transfers. CocoIndex target-state reconciliation receives previous states and a `prev_may_be_missing` flag, then decides whether an action is needed (`execution.rs:1029-1065`, `execution.rs:1196-1204`). The transferable idea is not the exact handler trait; it is "compare desired derived value to previous tracked value before writing downstream rows." SQLite can do this with stored `output_fingerprint`, `tracking_record_blob`, and per-dependent rows.

Atomic per-record mutation also transfers. CocoIndex commits tracking updates, memo writes, and stale memo cleanup in a write transaction (`execution.rs:418-429`, `execution.rs:509-535`). Our side already uses SQLite transactions for `index_memory`, `update_memory`, and deletes (`vector-index-mutations.ts:260-296`, `vector-index-mutations.ts:417-563`, `vector-index-mutations.ts:591-631`) and the save path wraps dedup plus insert in an immediate transaction (`memory-save.ts:2421-2532`). The port can extend these transactions rather than introduce a new storage engine.

### Transfers with adaptation

The heed KV schema should become relational SQLite tables. CocoIndex multiplexes state through typed encoded keys in one heed database: stable path entries, target state ownership, and ID sequencing (`db_schema.rs:20-42`, `db_schema.rs:94-132`). That layout is elegant for prefix iteration but opaque for SQL. The adapted shape should use separate tables:

- `memoization_records(component_path TEXT, memo_kind TEXT, input_fingerprint BLOB, code_hash BLOB, output_fingerprint BLOB, output_blob BLOB, memo_state_blob BLOB, computed_at INTEGER, PRIMARY KEY(component_path, memo_kind, input_fingerprint, code_hash))`
- `memoization_logic_deps(component_path TEXT, input_fingerprint BLOB, logic_hash BLOB, PRIMARY KEY(component_path, input_fingerprint, logic_hash))`
- `dependency_edges(parent_component_path TEXT, child_component_path TEXT, edge_kind TEXT, child_key TEXT, child_fingerprint BLOB, PRIMARY KEY(parent_component_path, child_component_path, edge_kind, child_key))`
- `target_state_tracking(component_path TEXT, target_state_path TEXT, provider_id INTEGER, provider_schema_version INTEGER, state_fingerprint BLOB, tracking_record_blob BLOB, version INTEGER, deleted INTEGER DEFAULT 0, PRIMARY KEY(component_path, target_state_path, provider_id))`
- `target_state_owner(target_state_path TEXT PRIMARY KEY, component_path TEXT NOT NULL)`

Stable-path child existence should become path/dependency rows. CocoIndex tracks child existence under stable path keys (`db_schema.rs:35-41`, `db_schema.rs:311-319`) and updates/deletes children by prefix iteration (`execution.rs:575-720`). SQLite can represent this with `dependency_edges` and indexed `parent_component_path`, then delete or invalidate dependents by recursive CTE instead of KV prefix scans.

Function memo dependency propagation needs a DAG table. CocoIndex stores `dependency_memo_entries` in each function memo record (`db_schema.rs:207-216`) and transitively expands already-stored memo dependencies during finalization so their target states are not garbage-collected (`execution.rs:1581-1631`). Our equivalent should persist memo-to-memo or transform-to-transform edges. `memory_index_scan` should enqueue changed files, then walk dependent components before deciding skip versus reindex.

The parser/indexer API needs a fingerprint contract. Today `indexSingleFile` delegates to `indexMemoryFile` (`memory-index.ts:173-188`), and `indexMemoryFile` parses and validates a file before calling `processPreparedMemory` (`memory-save.ts:2645-2682`). The adapted API should return `inputFingerprint`, `parserCodeHash`, `derivedOutputFingerprint`, and `dependencies` from the parse/index pipeline. That keeps the existing handler shape while making skip decisions DAG-aware.

The existing schema has useful columns but not enough graph state. `memory_index` stores `content_hash`, `file_mtime_ms`, `canonical_file_path`, embedding status, and content text (`vector-index-schema.ts:2356-2419`), with indexes on content hash, canonical path, and file mtime (`vector-index-schema.ts:2507-2526`). These should stay as the front-door file cache. The memo/DAG tables should be additive so old indexed data remains valid.

Migration story:

1. Add the memoization and dependency tables behind a schema version bump.
2. Backfill file-level memo records from existing `memory_index` rows using `canonical_file_path`, `content_hash`, `document_type`, and `updated_at`.
3. Mark backfilled rows as `dependency_state = unknown` or equivalent so the first DAG-aware scan can populate dependency edges without deleting existing index data.
4. Keep mtime/content-hash fast path as a coarse filter. If a file changed, walk dependents; if unchanged and all dependency fingerprints match, skip.
5. Gradually move expensive derived work, especially parsing, graph metadata expansion, embedding generation, and post-mutation graph hooks, behind memo records.

### Does not transfer

The Rust/PyO3 callback model does not transfer. CocoIndex cache validation can call Python state handlers through Rust-owned component context and feed observed context dependencies back into `logic_deps` (`function.py:895-910`). A TypeScript MCP server should not emulate that shape. The equivalent is explicit dependency declaration from each parser/transform stage.

The heed prefix-key implementation does not transfer directly. CocoIndex relies on encoded prefix keys such as `FunctionMemoizationPrefix`, `ChildExistencePrefix`, and `ChildComponentTombstonePrefix` (`db_schema.rs:23-42`) and mutable prefix iteration for cleanup (`execution.rs:514-535`, `execution.rs:612-720`). SQLite should use tables and indexes; prefix iteration becomes indexed queries or recursive CTE traversal.

Rust async transaction batching does not transfer directly. CocoIndex uses environment-managed transaction batchers for deletion, memo updates, pre-commit, commit, and post-submit memo writes (`execution.rs:139-149`, `execution.rs:178-199`, `execution.rs:1332-1352`, `execution.rs:1460-1469`). Our equivalent is `better-sqlite3` synchronous transactions, already present in mutation paths. That is sufficient for local MCP indexing but not the same concurrency model.

Tree-sitter or language-aware source dependency extraction is not required for K1.1. If future phases want code-level dependency edges, that belongs in K1.2/K1.3. For memory docs, explicit parser outputs and canonical paths are enough.

## Verdict on K1.1

YES-WITH-ADAPTATION. CocoIndex's core idea transfers: cache derived work by canonical input fingerprint plus logic/code fingerprint, then invalidate downstream records by stable dependencies rather than rescanning everything. It does not require a Rust-equivalent runtime or heed-style KV store. The TypeScript and SQLite stack should port the invariants, not the substrate: deterministic TS fingerprinting, additive SQLite memo/dependency tables, and a DAG-aware `memory_index_scan` that walks dependents when file content, parser logic, or derived output fingerprints change.

Required SQLite additions:

```sql
CREATE TABLE IF NOT EXISTS memoization_records (
  component_path TEXT NOT NULL,
  memo_kind TEXT NOT NULL,
  input_fingerprint BLOB NOT NULL,
  code_hash BLOB NOT NULL,
  output_fingerprint BLOB,
  output_blob BLOB,
  memo_state_blob BLOB,
  computed_at INTEGER NOT NULL,
  PRIMARY KEY (component_path, memo_kind, input_fingerprint, code_hash)
);

CREATE TABLE IF NOT EXISTS memoization_logic_deps (
  component_path TEXT NOT NULL,
  input_fingerprint BLOB NOT NULL,
  logic_hash BLOB NOT NULL,
  PRIMARY KEY (component_path, input_fingerprint, logic_hash)
);

CREATE TABLE IF NOT EXISTS dependency_edges (
  parent_component_path TEXT NOT NULL,
  child_component_path TEXT NOT NULL,
  edge_kind TEXT NOT NULL,
  child_key TEXT NOT NULL,
  child_fingerprint BLOB,
  PRIMARY KEY (parent_component_path, child_component_path, edge_kind, child_key)
);

CREATE TABLE IF NOT EXISTS target_state_tracking (
  component_path TEXT NOT NULL,
  target_state_path TEXT NOT NULL,
  provider_id INTEGER DEFAULT 0,
  provider_schema_version INTEGER DEFAULT 0,
  state_fingerprint BLOB,
  tracking_record_blob BLOB,
  version INTEGER NOT NULL DEFAULT 1,
  deleted INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (component_path, target_state_path, provider_id)
);

CREATE TABLE IF NOT EXISTS target_state_owner (
  target_state_path TEXT PRIMARY KEY,
  component_path TEXT NOT NULL
);
```

Required API changes:

- Add a deterministic `fingerprintCanonical(value)` helper for parser inputs, tool args, and derived outputs.
- Add `codeHash` or `logicHash` registration for parser/transform stages.
- Extend `indexMemoryFile` or the prepared-memory pipeline to emit fingerprints and dependency edges.
- Extend `memory_index_scan` to: categorize changed files, load dependent edges, enqueue affected dependents, validate memo records, and only call embedding/vector mutation paths for invalidated units.
- Keep `content_hash` and `file_mtime_ms` as coarse file-level acceleration, not as the only invalidation source.

## Questions Answered

- K1.1 answered: memoization plus dependency-DAG indexing transfers to TypeScript and SQLite with adaptation.

## Questions Remaining

- K1.2: decide which CocoIndex source connector and target-state reconciliation ideas matter for memory database scans.
- K1.3: determine whether target-state/action-sink abstractions map to our embedding, BM25, graph, and cache mutation paths.
- K1.4: assess stable path identity across spec folder moves, phase renames, symlinks, and canonical path migrations.
- K1.5: assess code-hash or logic-hash generation strategy for TypeScript modules.
- K1.6: determine how much of the DAG should be exposed through MCP tool responses versus internal telemetry only.
- K2.1, K2.2, K2.3, K2.5 remain open from the strategy.

## Next Focus

Recommend K1.2 next: target-state reconciliation and source/target connector transfer. K1.1 establishes that memo records and dependency edges are viable; K1.2 should decide which downstream state changes deserve reconciliation handlers versus simple row updates.
