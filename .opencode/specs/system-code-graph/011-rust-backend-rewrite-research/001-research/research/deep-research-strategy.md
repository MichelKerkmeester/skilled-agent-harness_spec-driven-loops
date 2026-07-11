# Deep-Research Strategy — Rust Ingestion & Storage Backend Rewrite (Packet 011 / Phase 001)

> Charter the future deep-research loop reads at the start of every round. Single lineage, GPT-5.6-sol (`xhigh`, `fast`) via `cli-codex`, up to 16 rounds. Research-only: **do not run implementation, write Rust, modify backend source, or absorb phase-002 query work.**

## Objective

Decide, with file-cited evidence, what a Rust rewrite of the `system-code-graph` **ingestion and storage half** would (a) improve and where, (b) make newly possible, and (c) unlock that is genuinely difficult to achieve safely or practically in the current TypeScript runtime. End with a ranked recommendation: full rewrite / targeted native module (napi-rs or WASM) / Rust sidecar / do-not-rewrite.

## Subject under study

The current backend under `.opencode/skills/system-code-graph/`, bounded to ingestion and storage:
- Scan orchestration and promotion: `mcp_server/handlers/scan.ts` validates scope, invokes indexing, persists per-file results, resolves cross-file calls, prunes dangling edges, bumps generations, and promotes metadata [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:336] [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:591].
- Discovery and extraction: `mcp_server/lib/structural-indexer.ts` (~2,523 LOC) performs recursive discovery, stale-file selection, parser dispatch, capture→node/edge construction, module resolution, import/test reconciliation, and reverse-dependency force parsing [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1427] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:1915] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts:2231].
- Parser adapter: `mcp_server/lib/tree-sitter-parser.ts` (~907 LOC) initializes `web-tree-sitter`, loads WASM grammars, walks AST nodes in JavaScript, and hands captures to JS node/edge builders [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:171] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:610] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:819].
- Storage/lifecycle: `mcp_server/lib/code-graph-db.ts` (~2,519 LOC) owns SQLite schema, WAL setup, file/node/edge replacement, tombstones, `SUPERSEDES`, `valid_at`/`invalid_at`, generations, staleness, and deletion [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:214] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1034] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1494].
- Atomic write seam and recovery: `mcp_server/lib/ensure-ready.ts`, `parser-skip-list.ts`, `cross-file-edge-resolver.ts`, `apply-orchestrator.ts`, and `recovery-procedures.ts` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:607] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:166] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:430].
- Incremental change attribution: `mcp_server/handlers/detect-changes.ts` and `mcp_server/lib/diff-parser.ts`; this is currently a read-only preflight, not a write trigger [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:230] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/diff-parser.ts:108].
- Native dependency boundary: `better-sqlite3`, `web-tree-sitter`, and `tree-sitter-wasms`; JS support dependencies include `ignore`, MCP SDK, and Zod [SOURCE: .opencode/skills/system-code-graph/package.json:14].

Excluded sibling subject: query execution, traversal, impact/context retrieval, result ranking, seed resolution, and MCP query transport belong to `../002-research/` and must not contribute benefit claims here.

## Framing invariant (enforce every round)

The hottest primitives may already run **outside V8**. `parserInstance.parse(content)` runs through `web-tree-sitter` WASM [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:819]. SQL statements, transactions, and WAL execute in SQLite through `better-sqlite3` [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:10] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1034]. **Rust cannot speed up work already performed by those native/FFI engines merely by replacing their TypeScript callers.**

Every latency, memory, tail-latency, throughput, or concurrency claim MUST state one of:
- **JS-resident**: discovery loops, AST walking, captures, hashes, maps/sets, regex edge scans, module resolution, invalidation selection, JSON serialization, or transaction orchestration. A rewrite may help, subject to measurement.
- **FFI/native-resident**: tree-sitter parser execution, SQLite query/transaction engine, filesystem kernel work. A rewrite cannot claim this work as a win; only measured boundary-copy, scheduling, or call-overhead reduction may count.
- **Mixed/unknown**: evidence is insufficient. Define the instrumentation needed; do not upgrade the claim to a win.

No "big win" may count already-native work. Separate genuine JS-resident CPU from glue in front of native code. Track rejected benefit credit explicitly in the synthesis.

## The 12 predefined angles

**Survey (A1–A6):**
- **A1 End-to-end stage/timing inventory** — `handlers/scan.ts`, `lib/structural-indexer.ts`, `lib/tree-sitter-parser.ts`, `lib/ensure-ready.ts`. Produce a stage diagram and measurement-gap ledger [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:408].
- **A2 Native/FFI boundary and copy costs** — `package.json`, `tree-sitter-parser.ts`, `code-graph-db.ts`. Partition WASM/native execution from JS wrappers and boundary materialization [SOURCE: .opencode/skills/system-code-graph/package.json:14].
- **A3 JS AST walk and AST→graph extraction** — `tree-sitter-parser.ts:610-744`, `structural-indexer.ts:968-1247`, `indexer-types.ts`. Quantify allocations, hashing, scans, maps/sets, and edge metadata after excluding parser execution.
- **A4 Discovery, hashing, and incremental invalidation** — `structural-indexer.ts:1427-1549`, `structural-indexer.ts:2231-2449`, `code-graph-db.ts:1708-1776`. Evaluate repeated traversal, content hashing, stale checks, and reverse-dependency expansion.
- **A5 SQLite write model and amplification** — `code-graph-db.ts`, `ensure-ready.ts:607-647`, `handlers/scan.ts:610-760`. Separate native SQL time from JS statement preparation, serialization, orchestration, replacement, and sweeps.
- **A6 Edge builders and cross-file reconciliation** — `structural-indexer.ts:1740-2089`, `cross-file-edge-resolver.ts`. Quantify module probes, recursive exports, global maps/nested loops, and post-persist call resolution.

**Deep-validation (A7–A12):**
- **A7 Parallel/streaming ingestion (NEW)** — worker threads vs targeted native extraction vs Rust sidecar; parser singleton/pool, ordering, memory bounds, backpressure, and per-file commit seams [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:67].
- **A8 Bitemporal lifecycle and generation parity** — `valid_at`/`invalid_at`, generation stamps, tombstones, `SUPERSEDES`, deferred dangling cleanup, and flag-off compatibility [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1127] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:1583].
- **A9 Atomic snapshot and crash-safe promotion (NEW)** — per-file transactions and staged mtime today vs shadow DB/bulk load/snapshot swap/whole-generation commit [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts:607] [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/scan.ts:661].
- **A10 Parser isolation and language extensibility (NEW)** — isolate WASM traps, parser quarantine, grammar pools, native tree-sitter comparison, and packaging. Value must be isolation/parallelism/operability unless measured parser speed differs [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/tree-sitter-parser.ts:96] [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/parser-skip-list.ts:135].
- **A11 Incremental diff-to-index pipeline (NEW)** — evolve read-only `detect_changes` attribution into safe affected-file/dependent ingestion, or prove TypeScript already suffices. Preserve stale-graph refusal and untrusted-path checks [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:260] [SOURCE: .opencode/skills/system-code-graph/mcp_server/handlers/detect-changes.ts:311].
- **A12 Interop, parity, migration, and recommendation** — compare full rewrite, targeted napi-rs/WASM extraction, sidecar, and do-not-rewrite; define DTOs, deterministic symbol IDs, storage ownership, WAL/locking, tests, rollback, packaging, and strangler sequence [SOURCE: .opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts:111] [SOURCE: .opencode/skills/system-code-graph/references/config/database_path_policy.md:88].

## Round → angle allocation

| Round | Angle | Required focus |
|-------|-------|----------------|
| 1 | A1 | Stage map, current metrics, missing timing seams |
| 2 | A2 | Residency table and boundary-copy/call inventory |
| 3 | A3 | JS AST walk/extraction cost and candidate native seam |
| 4 | A4 | Discovery/hash/staleness/reverse-dependency baseline |
| 5 | A5 | SQLite-native vs JS write orchestration and amplification |
| 6 | A6 | Module/import/test/call edge reconciliation cost |
| 7 | A7 | Parallel and streaming architecture feasibility |
| 8 | A8 | Bitemporal, tombstone, lineage, and generation parity |
| 9 | A9 | Whole-scan atomicity and crash-safe promotion options |
| 10 | A10 | Parser isolation, pools, language growth, packaging |
| 11 | A11 | Safe diff/change-stream-driven incremental indexing |
| 12 | A12 part 1 | Boundary options, parity harness, migration risks |
| 13 | A3 second pass | Benchmark design and quantified targeted-module case |
| 14 | A5/A8 second pass | Write-amplification model plus temporal invariant proof obligations |
| 15 | A4/A7/A11 second pass | Repository-scale incremental/parallel model and smallest safe PoC |
| 16 | A12 part 2 | Synthesis, matrices, risk register, ranking, first validation step |

## Deliverables (must exist in `research.md` at convergence)

1. **Improvement matrix** — component × {latency / memory / tail-latency / concurrency / correctness / packaging} → {big win / marginal / none / already-native / unknown} + residency + evidence. Include a rejected-credit column for already-native work.
2. **New-feature-feasibility matrix** — capability × {possible in TS today? / practical in TS? / Rust unlocks?} + enabling primitive + exact integration seam + parity obligations.
3. **Risk register** — graph equivalence/determinism, parser parity/quarantine, transaction and bitemporal semantics, WAL/single-writer ownership, migration/rollback, packaging, team velocity, and test gaps.
4. **Ranked recommendation** — rank full rewrite / targeted napi-rs or WASM module / Rust sidecar / do-not-rewrite; state reasoning, rejected native-work credit, first concrete validation step, and stop/rollback criteria.

## Non-goals

- Writing, scaffolding, compiling, or integrating Rust.
- Modifying any backend source, test, database, config, or generated dist.
- Running an ad hoc research loop; the future run must use the command-owned `/deep:research` workflow.
- Query engine, traversal, impact/context retrieval, ranking, seed resolution, or MCP query transport research (phase 002).
- Live A/B benchmarking against a Rust implementation.

## Stop conditions

- `newInfoRatio` sustained below the convergence threshold, OR
- 16 rounds reached, OR
- All 12 angles answered with cited evidence and all four deliverables written.

Do not stop merely because "Rust is faster" or "SQLite/tree-sitter are already native." The loop must quantify the remaining JS-resident envelope, document negative evidence, and produce a ranked recommendation.

## Evidence discipline

- Every backend finding uses `[SOURCE: .opencode/skills/system-code-graph/<relative-file>:line]`; every external crate/technique claim uses `[SOURCE: url]`.
- Read source before citing it. Do not invent paths, APIs, benchmark results, or LOC.
- Label each load-bearing statement **confirmed**, **inferred**, or **unknown**; unknown claims name the measurement that would resolve them.
- Every performance claim includes the residency label: JS-resident, FFI/native-resident, or mixed/unknown.
- Estimates are explicitly labelled and never promoted to benchmark results.
- Compare options against the current tests for atomic persistence, bitemporal schema/follow-ups, edge lifecycle, recovery, and incremental behavior before claiming parity.
- Record failed approaches and negative results each round; already-native work is a finding, not a Rust benefit.
- Keep phase-002 query/traversal/retrieval/ranking/transport work out of the improvement and feature matrices.
