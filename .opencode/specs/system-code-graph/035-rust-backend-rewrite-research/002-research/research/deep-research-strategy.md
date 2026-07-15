# Deep-Research Strategy - Rust Query & Serving Backend (Packet 011 / Phase 002)

> Charter the future deep-research loop reads at the start of every round. Single lineage, GPT-5.6-sol (`xhigh`, `fast`) via `cli-codex`, up to 16 rounds. Research-only: **no Rust is written, no research loop is run during charter authoring, and no backend source is modified.**

## Objective

Decide, with file-cited evidence, whether Rust should replace or augment the `system-code-graph` **query-and-serving half**: what it would improve, what new query capabilities it would make practical, and what remains better as TypeScript glue around native SQLite. End with a ranked recommendation: full rewrite / targeted native module (napi-rs or WASM) / Rust sidecar / do-not-rewrite.

## Subject under study

The serving surface under `.opencode/skills/system-code-graph/`:
- `mcp_server/handlers/query.ts` - outline, callers/callees, imports, transitive traversal, blast radius, ambiguity, ordering, and response assembly [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/query.ts:1358-1853].
- `mcp_server/handlers/context.ts` and `mcp_server/lib/code-graph-context.ts` - LLM context modes, edge ranking, bounded PPR, deadlines, traces, partial output, and token-budget formatting [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/context.ts:169-356] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts:230-356].
- `mcp_server/lib/graph/bfs-traversal.ts`, `symbol-bm25-resolver.ts`, and `query-intent-classifier.ts` - JS-resident traversal, fallback symbol scoring, and routing heuristics [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/graph/bfs-traversal.ts:75-183] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/symbol-bm25-resolver.ts:207-388].
- `mcp_server/lib/readiness-contract.ts`, `handlers/detect-changes.ts`, `handlers/status.ts`, `handlers/verify.ts`, and the thin `handlers/apply.ts` boundary - refusal/trust semantics and structural checks [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/readiness-contract.ts:68-118] [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:230-384].
- `mcp_server/tool-schemas.ts`, `tools/code-graph-tools.ts`, `index.ts`, and `code-index-cli.ts` - eight-tool MCP schemas, dispatch, stdio/IPC serving, CLI fallback, timeouts, and parity [SOURCE: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:188-200] [SOURCE: .opencode/skills/system-code-graph/mcp_server/index.ts:74-154].
- Tests and references that define byte/semantic stability and tool ownership [SOURCE: .opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts:134-162] [SOURCE: .opencode/skills/system-code-graph/references/runtime/tool_surface.md:55-101].

Excluded sibling scope: source parsing/tree-sitter, AST extraction, node/edge construction, graph-store and SQLite persistence, bitemporal modeling, and incremental write/index paths.

## Framing invariant - enforce every round

The package's hottest primitives may already run **outside V8**. SQLite queries run through `better-sqlite3`; parsing uses `web-tree-sitter` WASM [SOURCE: .opencode/skills/system-code-graph/package.json:14-20]. **Rust cannot speed up work that already runs in native/FFI code merely by replacing its caller.**

Every latency, memory, or tail-latency claim must classify the work:
1. **JS-resident** - Rust may help: BFS queues, path copying, Map/Set assembly, confidence reduction, sorting, BM25 scoring/index construction, RRF/reliability ranking, bounded PageRank, provenance aggregation, formatting, JSON preparation.
2. **FFI/native-resident** - rewrite gets no credit: SQLite execution. Parser WASM is also already outside V8 and is excluded with sibling phase 001.
3. **I/O wait** - rewrite only helps if it changes the I/O or batching design.
4. **Transport/serialization** - measure separately; a sidecar may worsen it.

No "big win" may include already-native work. Thin SQL handoffs default to **none/already-native** unless evidence shows JS-to-SQL chattiness, copying, or result assembly is the actual bottleneck.

## The 12 predefined angles

**Survey (A1-A6):**
- **A1 Serving topology and workload baseline** - `index.ts`, `tool-schemas.ts`, `tools/code-graph-tools.ts`, query/context handlers, CLI, metrics, query/context/CLI tests. Establish workloads, candidate sizes, current instrumentation, and benchmark gaps.
- **A2 Native/FFI boundary and SQL chattiness** - `package.json`, query/context DB call sites. Separate SQLite time from JS compute and count crossings/batching opportunities per operation.
- **A3 Traversal and blast-radius compute** - `lib/graph/bfs-traversal.ts`, `handlers/query.ts`. Quantify queue/path/Map/Set/sort/confidence work, depth/limit behavior, traces, and multi-seed union.
- **A4 Context expansion, ranking, PPR, and budget assembly** - `lib/code-graph-context.ts`, `handlers/context.ts`. Quantify RRF/reliability sort, bounded PPR, provenance, deadlines, partial outputs, and text formatting.
- **A5 Symbol/file/outline/caller resolution and intent** - `handlers/query.ts`, `symbol-bm25-resolver.ts`, `query-intent-classifier.ts`. Evaluate exact/ambiguous resolution, fallback-index rebuild/scoring, footprint, and deterministic ordering.
- **A6 Readiness, structural checks, transport, and determinism** - readiness contract, detect-changes/status/verify/apply handlers, schema dispatcher, MCP/IPC server, CLI, and parity tests. Inventory semantics a port must preserve and glue that gains little from Rust.

**Deep-validation (A7-A12):**
- **A7 Targeted native traversal kernel** - napi-rs/WASM BFS/blast-radius feasibility, graph marshaling, copies, crossing break-even, stable ordering, and failure isolation.
- **A8 Targeted ranking/resolution kernel** - native BM25/RRF/PPR/top-k versus optimized TS and SQLite-side alternatives; include build/allocation costs and deterministic ties.
- **A9 Advanced graph-analysis capabilities** - SCC/cycles, dominators, k-shortest paths, path explanations, centrality/community, and weighted multi-hop ranking; verify absence/usefulness and whether Rust truly unlocks practicality.
- **A10 Concurrency, cancellation, streaming, and tail latency** - event-loop blocking, workers versus Rust parallelism, cancelable budgets, streaming partial results, IPC/MCP backpressure, and p95/p99 behavior.
- **A11 Interop and deployment architecture** - full service versus napi-rs versus WASM versus sidecar; copies, SDK/schema parity, daemon lifecycle, crash containment, cross-platform packaging, and operational complexity.
- **A12 Correctness, migration, verification, and recommendation** - parity fixtures, gold-battery gaps, strangler path, migration size, rollback, and final architecture ranking.

## Round -> angle allocation

| Round | Angle | Required focus |
|-------|-------|----------------|
| 1 | A1 | Topology, workloads, metrics, tests, and benchmark gaps |
| 2 | A2 | Native/FFI residency map and DB-crossing inventory |
| 3 | A3 | Traversal/blast-radius algorithm and scale model |
| 4 | A4 | Context ranking/PPR/deadline/formatting model |
| 5 | A5 | Resolution/BM25/intent behavior and footprint |
| 6 | A6 | Readiness, structural checks, schemas, MCP/IPC/CLI, determinism |
| 7 | A7 | Native traversal boundary and break-even hypothesis |
| 8 | A8 | Native ranking/resolution boundary and alternatives |
| 9 | A9 | Advanced query capabilities and actual Rust necessity |
| 10 | A10 | Concurrency, cancellation, streaming, and tail latency |
| 11 | A11 | Interop/deployment architecture comparison |
| 12 | A12 | Correctness/migration framework and preliminary ranking |
| 13 | A3/A7 | Traversal benchmark design and quantified break-even model |
| 14 | A4/A8 | Context/ranking benchmark design and quantified break-even model |
| 15 | A2 | End-to-end decomposition: SQLite, crossings, JS, copies, JSON, transport |
| 16 | A12 | Final matrices, risk register, recommendation, and first concrete step |

## Deliverables (must exist in `research.md` at convergence)

1. **Improvement matrix** - component x {latency / memory / tail latency / concurrency / determinism / packaging} -> {big win / marginal / none / already-native}; include residency and evidence.
2. **New-feature-feasibility matrix** - candidate capability x {possible in TS today? / practical in TS? / Rust unlocks?}; name algorithm/runtime primitive and integration seam.
3. **Risk register** - semantic parity, deterministic ordering, readiness/refusal safety, MCP/CLI parity, FFI overhead, migration cost, test gaps, operations, and rollback.
4. **Ranked recommendation** - full rewrite / targeted napi-rs or WASM native module / Rust sidecar / do-not-rewrite, with reasoning, confidence, disconfirming evidence, first measurement/PoC step, and explicit do-not-rewrite threshold.

## Non-goals

- Writing, scaffolding, compiling, or integrating Rust.
- Editing backend source or generating parent-process metadata.
- Running the loop during charter authoring.
- Researching parsing, AST extraction, storage/persistence, bitemporal, or incremental indexing beyond documenting their boundary.
- Crediting SQLite or parser execution as a Rust speedup.

## Stop conditions

- `newInfoRatio` remains below the configured convergence threshold, OR
- 16 rounds are reached, OR
- all 12 angles are answered with cited evidence and all four deliverables are complete.

Do not stop merely because "Rust is faster" or "TypeScript is sufficient" appears plausible. Stop only when the recommendation has residency-aware evidence, quantified uncertainty, and a concrete next step or closure rationale.

## Evidence discipline

- Every repository finding cites `[SOURCE: relative/path.ts:line]`; external technical claims cite `[SOURCE: url]`.
- State **confirmed**, **measured**, **inferred**, or **estimated**. Never present an estimate as a benchmark.
- Every performance claim includes residency classification and excludes already-native work from wins.
- Measure/estimate p50, p95, and p99 separately from completion/partiality; deadline-truncated context is not equivalent to a completed fast query.
- Record graph size, nodes/edges visited, degree, depth, seeds, trace mode, result limit, candidate count, PPR iterations, DB crossings, bytes copied, and output bytes for benchmark proposals.
- Compare Rust against optimized TypeScript, worker threads, query batching, SQL-side work, and algorithmic improvements; do not use current code as the only baseline.
- Preserve stable ordering and refusal/trust semantics in every architecture option; cite tests that prove current behavior.
- Cross-check every proposed "new" capability against current `code_graph_query` operations and `code_graph_context` modes before awarding novelty [SOURCE: .opencode/skills/system-code-graph/mcp_server/tool-schemas.ts:45-109].
