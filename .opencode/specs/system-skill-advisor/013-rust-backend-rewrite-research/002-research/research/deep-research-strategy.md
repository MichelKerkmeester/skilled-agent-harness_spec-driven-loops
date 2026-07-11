# Deep-Research Strategy — Skill Advisor Rust Backend: Embeddings, Vector & Serving (Packet 013 / Phase 002)

> Charter the future deep-research loop reads at the start of every round. Single lineage, GPT-5.6-sol (`xhigh`, `fast`) via `cli-codex`, up to 16 rounds. Research-only: **no Rust is written, no research loop is run by the charter-authoring task, and no backend source is modified.**

## Objective

Decide, with file-cited evidence, what a Rust rewrite of the `system-skill-advisor` **embedding, vector, skill-graph, and serving half** would improve, what new capabilities it would make practical, and whether the JS-resident remainder is large enough to justify any rewrite. End with a ranked recommendation: **full rewrite / targeted native module (napi-rs or WASM) / Rust sidecar / do-not-rewrite**.

## Subject under study

- **Serving and tools**: `mcp_server/advisor-server.ts`, `handlers/advisor-{recommend,status,rebuild}.ts`, `handlers/skill-graph/`, `mcp_server/skill-advisor-cli.ts`, `skill-advisor-cli-manifest.ts` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts:233].
- **Embedders and vector path**: `lib/embedders/`, `lib/scorer/lanes/semantic-shadow.ts`, and embedding/vector sections of `lib/skill-graph/skill-graph-db.ts` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:47].
- **Skill graph**: `lib/skill-graph/skill-graph-db.ts`, `skill-graph-queries.ts`, `bfs-traversal.ts`, and graph handlers [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:188].
- **Daemon and transports**: `lib/daemon/`, `lib/ipc/`, `.opencode/bin/skill-advisor.cjs`, `.opencode/bin/mk-skill-advisor-launcher.cjs`, and `.opencode/bin/hf-model-server.cjs` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts:280].
- **Shared embedding implementation**: `.opencode/skills/system-spec-kit/shared/embeddings/`, reached through advisor re-export shims and `@spec-kit/shared` imports [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/embedders/registry.ts:4].
- **Native dependency facts**: `@huggingface/transformers` and `better-sqlite3` are declared; `sqlite-vec` is not [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/package.json:13].

Excluded sibling half: scorer feature extraction, matcher/ranking math, lexical/trigger/vocabulary matching, threshold tuning, and fusion policy.

## Framing invariant (enforce every round)

The hottest primitives in this half are substantially **already native or external**:

- HF local model inference executes through `@huggingface/transformers` in the resident model server [SOURCE: .opencode/bin/hf-model-server.cjs:664].
- Ollama and cloud embedding providers execute out of process or remotely [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts:487].
- SQL execution runs in SQLite through `better-sqlite3` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:473].

**Rust cannot speed up work that already runs in native/FFI code, another native process, or a remote service merely by replacing the TypeScript caller.** Every latency, memory, throughput, and tail claim MUST classify the work as:

1. `JS-resident` — a rewrite can potentially help.
2. `FFI/native-resident` — a caller rewrite cannot accelerate the engine.
3. `out-of-process native` — only IPC/supervision can change unless the engine is replaced.
4. `remote-service-resident` — network/provider latency dominates.

No “big win” may count already-native or external work. The honest conclusion may be **little JS-resident compute to reclaim**. Conversely, the exact cosine loop, BLOB conversion, graph BFS/validation scans, file discovery, row-serial refresh, watcher state, lease coordination, and JSON-RPC framing are JS-resident and must be measured rather than assumed material [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:47] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/bfs-traversal.ts:57].

## The 14 predefined angles

**Survey (A1–A7):**
- **A1 End-to-end serving and latency inventory** — `advisor-server.ts`, `handlers/advisor-recommend.ts`, `bench/latency-bench.ts`, `skill-advisor-cli.ts`; trace cache/freshness/embed/serve and identify missing slices [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:369].
- **A2 Native/FFI/out-of-process boundary** — `mcp_server/package.json`, shared `auto-select.ts`, `hf-model-server.cjs`, `skill-graph-db.ts`; classify every operation and confirm `sqlite-vec` is absent.
- **A3 Embedder selection/provider/model residency** — `lib/embedders/schema.ts`, shared `registry.ts`, `auto-select.ts`, `providers/hf-local.ts`, `hf-model-server.cjs`; preserve dimensions, dtype, prefixes, health, and fallback semantics [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts:243].
- **A4 Vector persistence and refresh** — `skill-graph-db.ts`, `lib/embedders/schema.ts`, `handlers/skill-graph/scan.ts`; dimension tables, BLOBs, legacy fallback, hashing, serial refresh, and read-only loading [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:1174].
- **A5 Semantic vector serving** — `lib/scorer/lanes/semantic-shadow.ts`, `loadSkillEmbeddings()`; split prompt inference, SQLite read, BLOB decode/copy, JS cosine, filtering, and rounding [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:285].
- **A6 Skill-graph store/index/query/validation** — `skill-graph-db.ts`, `skill-graph-queries.ts`, `bfs-traversal.ts`, `handlers/skill-graph/`; SQL-native work vs JS scan/BFS/validation at actual scale.
- **A7 Daemon/MCP/IPC/CLI/determinism** — `advisor-server.ts`, `lib/daemon/`, `lib/ipc/socket-server.ts`, `skill-advisor-cli.ts`, `.opencode/bin/{skill-advisor,mk-skill-advisor-launcher}.cjs`, advisor handlers; startup, leases, watcher, warm-only, trust, stale-dist, exit, shutdown, and output parity.

**Deep-validation (A8–A14):**
- **A8 Residency-attributed benchmark/cost model** — existing advisor latency/watcher gates, HF timing, semantic health, graph status; define missing prompt-embed/SQLite/BLOB/cosine/BFS/IPC/rebuild slices and produce percentage budgets with confidence [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/bench/watcher-benchmark.ts:74].
- **A9 Native vector index/quantization feasibility** — sqlite-vec/usearch/HNSW/SIMD exact scan/int8/binary/napi-rs/WASM versus current BLOB + JS cosine; report node-count break-even and recall/memory trade.
- **A10 Embedding runtime replacement vs wrapper rewrite** — current Ollama/transformers/cloud versus ort/candle/fastembed-rs; distinguish inference-kernel replacement from supervision-only changes; include batching/load/device/dtype/output parity [SOURCE: .opencode/bin/hf-model-server.cjs:723].
- **A11 Rebuild and incremental embedding pipeline** — row-serial `refreshSkillEmbeddingsViaAdapter`, batching, parallel reads, transactions, background refresh, and single-writer safety [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:1270].
- **A12 Graph-scale and validation headroom** — current prepared SQL + JS BFS/status hashes/validation loops versus recursive SQL or Rust graph structures; model present and projected scale [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/status.ts:164].
- **A13 Serving reliability/startup/packaging architecture** — full binary vs napi-rs/WASM vs sidecar; dist freshness, launcher/owner lease, warm socket, watcher, model-server supervision, security, MCP SDK parity, and restart recovery [SOURCE: .opencode/bin/skill-advisor.cjs:49] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lifecycle.ts:72].
- **A14 Interop/determinism/migration/recommendation** — preserve score rounding/order, prompt privacy, fail-open behavior, read-only recommend access, trusted mutations, freshness/trust, CLI aliases/formats/exits, graph schema, and shared embedding consumers; rank all four target classes [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli-manifest.ts:22].

## Round → angle allocation

| Round | Angle | Required focus |
|-------|-------|----------------|
| 1 | A1 | Serving path and existing latency coverage |
| 2 | A2 | Operation-level execution-residency map |
| 3 | A3 | Provider cascade, model residency, and parity |
| 4 | A4 | Vector tables, BLOBs, refresh, and loading |
| 5 | A5 | Prompt inference vs JS exact semantic scan |
| 6 | A6 | Graph store, indexing, queries, BFS, status, validation |
| 7 | A7 | Daemon, MCP, IPC, CLI, lifecycle, determinism |
| 8 | A8 | Initial benchmark/cost model and missing slices |
| 9 | A9 | Native vector/index/quantization break-even |
| 10 | A10 | Embedding engine replacement versus wrapper rewrite |
| 11 | A11 | Rebuild and incremental embedding concurrency |
| 12 | A12 | Graph-scale and validation feasibility |
| 13 | A13 | Reliability, startup, packaging, architecture boundaries |
| 14 | A14 | Interop/determinism/migration and initial ranking |
| 15 | A8 second pass | Quantified end-to-end decision model with rejected native-work credits |
| 16 | A14 second pass | Final matrices, risk register, ranked recommendation, and first step |

## Deliverables (must exist in `research.md` at convergence)

1. **Improvement matrix** — current component × {latency / memory / tail-latency / concurrency / startup / packaging} → {big win / marginal / none / already-native-or-remote}, with residency class and evidence.
2. **New-feature-feasibility matrix** — candidate feature × {possible-in-TS / impractical-in-TS / Rust-unlocks}, with enabling primitive, corpus-scale assumption, and whether an existing native engine already supplies it.
3. **Risk register** — embedding parity, vector recall, graph correctness, SQLite concurrency, daemon lifecycle, MCP/CLI compatibility, migration cost, team velocity, and test gaps.
4. **Ranked recommendation** — full rewrite / targeted napi-rs or WASM module / Rust sidecar / do-not-rewrite, with reasoning, rejected benefits, first concrete step, and no-go threshold.

## Non-goals

- Writing Rust, scaffolding a crate, compiling a native module, or editing backend source.
- Running the research loop during charter authoring.
- Researching scorer feature extraction, matcher/ranking math, lexical/trigger/vocabulary matching, threshold tuning, or fusion policy.
- Crediting SQLite, ONNX/transformers, Ollama, or cloud execution as rewrite wins without replacing and measuring those engines.
- Live Rust-vs-TypeScript A/B benchmarks; defer to a later PoC only if recommended.

## Stop conditions

- `newInfoRatio` sustained below the convergence threshold, OR
- 16 rounds reached, OR
- All 14 angles answered with cited evidence and all four deliverables written.

Early convergence is invalid if A8 has no execution-residency cost model or A14 has not ranked all four target classes.

## Evidence discipline

- Every finding carries `[SOURCE: file:line]` for repository evidence or `[SOURCE: url]` for external technology evidence.
- Every performance claim states execution residency and separates engine time from caller/orchestration time.
- Estimates are labelled as estimates and include corpus-size, vector-dimension, provider, cold/warm, cache, and transport assumptions.
- A “big win” must name the exact JS-resident function/module replaced and its measured or bounded end-to-end share.
- Confirmed facts and inferences are distinguished. External crate capability claims require primary documentation and, where material, benchmark methodology.
- Cross-check current dependencies before naming a feature “already present”; this advisor declares no `sqlite-vec` dependency [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/package.json:13].
- Preserve the sibling boundary. Integration seams may be named, but scorer/matcher/ranking/trigger behavior is not re-investigated.
