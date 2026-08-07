# Deep-Research Strategy — Rust Backend Rewrite (Packet 030 / Phase 001)

> Charter the deep-research loop reads at the start of every round. Single lineage, GPT-5.5 (`xhigh`, `fast`) via `cli-codex`, up to 20 rounds. Research-only: **no Rust is written and no backend source is modified.**

## Objective

Decide, with file-cited evidence, what a Rust rewrite of the `system-spec-kit` backend would (a) **improve** and where, (b) make **newly possible** feature-wise, and (c) unlock that is genuinely **hard or impossible in TypeScript** — ending in a ranked, decision-ready recommendation: full rewrite / targeted native module (napi-rs or WASM) / Rust sidecar / do-not-rewrite.

## Subject under study

The current backend under `.opencode/skills/system-spec-kit/`:
- `mcp_server/` — MCP runtime (`context-server.ts` long-lived `StdioServerTransport`), `handlers/`, `lib/search/` (~90 modules), `schemas/` (Zod), `tool-schemas.ts`.
- `shared/` — neutral compute: `algorithms/` (rrf/adaptive/mmr fusion), `ranking/` (learned-combiner, matrix-math), `embeddings/` (hf-local ONNX, openai, voyage, ollama), `chunking.ts`, `trigger-extractor.ts`.
- `scripts/` — CLI generation, validation, and `evals/run-performance-benchmarks.ts`.
- Native deps (`mcp_server/package.json`): `better-sqlite3`, `sqlite-vec` (+ `sqlite-vec-darwin-arm64`), `@huggingface/transformers`, `web-tree-sitter`, `tree-sitter-wasms`, `@modelcontextprotocol/sdk`, `zod`.

## Framing invariant (REQ-004 — enforce every round)

The backend's hot primitives are **already native**: vector search (`sqlite-vec` C on `better-sqlite3`), local embeddings (`@huggingface/transformers` ONNX), parsing (`web-tree-sitter` WASM). **Rust cannot speed up work that already runs outside V8.** Every latency claim must state whether the work is JS-resident (rewrite can help) or FFI-resident (rewrite cannot). No "big win" may count already-native work.

## The 16 predefined angles

**Survey (A1–A8):**
- A1 Baseline hot-path inventory — `context-server.ts`, `handlers/memory-save.ts`, `handlers/memory-search.ts`, `lib/search/hybrid-search.ts`, `scripts/evals/run-performance-benchmarks.ts`.
- A2 Native-primitive boundary — `mcp_server/package.json` native deps; JS-resident vs FFI-resident per hot path.
- A3 Ranking/fusion compute core — `shared/algorithms/rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts`, `shared/ranking/learned-combiner.ts`, `matrix-math.ts`.
- A4 Vector index & quantization headroom — `lib/search/vector-index-{schema,store,queries,impl}.ts`.
- A5 Local embeddings runtime — `shared/embeddings/providers/hf-local.ts` vs `openai`/`voyage`/`ollama`.
- A6 Indexing / write path — `handlers/memory-save.ts`, `shared/chunking.ts`, `shared/trigger-extractor.ts`, `lib/ops/file-watcher.ts`.
- A7 Search pipeline & concurrency — `lib/search/pipeline/stage1..stage4`, `orchestrator.ts`, `query-decomposer.ts`, `query-router.ts`.
- A8 MCP transport, schema & determinism — `context-server.ts`, `tool-schemas.ts`, `schemas/`, `description.json`/`graph-metadata.json` validation.

**Deep-validation (A9–A16):**
- A9 Neural cross-encoder reranking (NEW) — absent today (`lib/search/rerank/retrieval-rescue.ts`; heuristic `stage3-rerank.ts`); `ort`/`candle` feasibility.
- A10 Quantized million-scale ANN (NEW) — `hnsw_rs`/`usearch`/FAISS + PQ/binary vs `sqlite-vec` brute force.
- A11 Real-time incremental indexing (NEW) — `rayon` pipeline vs `file-watcher.ts` + batch write path.
- A12 Learned-sparse (SPLADE) & late-interaction (ColBERT) (NEW) — vs `bm25-index.ts`, `sqlite-fts.ts`, fusion stack.
- A13 SIMD / GPU acceleration (TS-hard) — `portable-simd`/`wide`, `candle`/`wgpu`.
- A14 Memory footprint & tail-latency envelope — V8 heap/GC vs deterministic RSS; anytime/streaming search under a hard SLA.
- A15 Packaging & distribution — single binary (`rusqlite`+`sqlite-vec`+native tree-sitter) vs `node_modules`/`dist`; stale-`dist` drift + prebuild fragility.
- A16 Interop + correctness/parity + migration — napi-rs vs WASM vs sidecar vs full port; byte-for-byte structured-JSON determinism; MCP Rust SDK maturity; ~244K-LOC / thin-test-corpus risk; strangler-fig path; **synthesis + ranked recommendation**.

## Round → angle allocation

Rounds 1–8 → A1–A8 (one each). Rounds 9–15 → A9–A15 (one each). Round 16 → A3 second pass (quantify). Round 17 → A4/A10 second pass (index+ANN quantify). Round 18 → A9 second pass (reranker seam in `stage3-rerank.ts`). Round 19 → A16 part 1 (interop + correctness/parity). Round 20 → A16 part 2 (synthesis + recommendation). See `../plan.md` §3 for the full table.

## Deliverables (must exist in `research.md` at convergence)

1. **Improvement matrix** — current TS component × {latency / memory / tail-latency / concurrency / packaging} → {big win / marginal / none / already-native} + evidence.
2. **New-feature-feasibility matrix** — candidate feature × {possible-in-TS / impractical-in-TS / Rust-unlocks} + enabling primitive.
3. **Risk register** — correctness/determinism, MCP/ecosystem parity, migration cost, team velocity, test-coverage gap.
4. **Ranked recommendation** — target + reasoning + first concrete step.

## Non-goals

- Writing Rust, scaffolding a crate, or wiring any native module.
- Editing the current TypeScript backend.
- Live A/B benchmarking against a real Rust build (deferred to a later PoC phase).

## Stop conditions

- `newInfoRatio` sustained below the convergence threshold, OR
- 20 rounds reached, OR
- All 16 angles answered with cited evidence and the four deliverables written.

## Evidence discipline

- Every finding carries `[SOURCE: file:line]` (backend) or `[SOURCE: url]` (external crate/technique).
- Estimates are labelled as estimates; ground latency claims in `scripts/evals/run-performance-benchmarks.ts` where possible.
- Confirmed-vs-inferred is stated explicitly; the native-vs-JS split (REQ-004) is stated on every latency claim.
- Cross-check every "new feature" against the `lib/search/` inventory before tagging it new (much is already implemented).
