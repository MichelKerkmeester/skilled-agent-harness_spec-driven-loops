---
title: "Resource Map — Rust opportunities for the sk-design styles database"
description: "Evidence inventory for the sol-codex detached 10-iteration deep-research lineage."
---

# Resource Map

## Summary

- Scope: net-new Rust-enabled features, optimizations, automations, and integrations for the sk-design styles database; like-for-like ports excluded.
- Snapshot date: 2026-07-20.
- Evidence posture: repository source and standards plus primary papers/upstream project documentation. Vendor benchmark numbers were not used as repository performance evidence.
- Coverage: 10 verified iterations, 10/10 research questions, 29 local-source observations, 2 primary papers, 19 upstream-source observations.

## Primary Local Sources

| Resource | Status | Iterations | Evidence use |
|---|---|---:|---|
| `.opencode/skills/sk-design/styles/_db/retrieval.mjs` | Analyzed | 1, 2, 3, 7, 8 | Exact residency: FTS SQL, vector JSON parse/cosine/sort, filters, RRF, tie-breaks, cursors |
| `.opencode/skills/sk-design/styles/_db/vectors.mjs` | Analyzed | 1, 4, 5, 8 | Profile identity, queue/cache lifecycle, serial embedding drain, vector validation |
| `.opencode/skills/sk-design/styles/_db/indexer.mjs` | Analyzed | 1, 4, 5, 6, 8, 9 | Incremental hashing, corpus discovery, embedder seam, canonical visual metadata, generation publication |
| `.opencode/skills/sk-design/styles/_db/schema.mjs` | Analyzed | 1, 3, 4, 6 | FTS5 schema, vector/profile tables, screenshot URL, connection/extension seam |
| `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs` | Analyzed | 9 | `legacy|shadow|persistent`, default/fallback authority, shadow comparison |
| `.opencode/skills/sk-design/styles/_engine/style-library.mjs` | Analyzed | 9 | TypeScript command/query shell and adapter entrypoints |
| `.opencode/skills/system-spec-kit/shared/embeddings/README.md` | Analyzed | 7 | Existing provider-neutral profile/provider architecture |
| `.opencode/skills/system-spec-kit/shared/embeddings/adapter.ts` | Analyzed | 7 | Shared batch embedder DTO contract |
| `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts` | Analyzed | 7 | Existing shared TypeScript registry/fallback surface |
| `.opencode/skills/system-spec-kit/mcp-server/lib/search/pipeline/README.md` | Analyzed | 7 | Memory-specific candidate/fusion/rerank/filter semantics |
| `.opencode/specs/system-code-graph/035-rust-backend-rewrite/001-research/spec.md` | Analyzed | 7 | Code-graph-specific native/JS residency and domain boundary |
| `.opencode/skills/sk-code/code-opencode/references/rust/quick-reference/overview-and-boundary-template.md` | Analyzed | 8, 9 | Pure-core/thin-adapter/TypeScript-shell contract |
| `.opencode/skills/sk-code/code-opencode/references/rust/quality-standards/overview-and-data-ownership.md` | Analyzed | 9 | Behavior authority, owned DTOs, error/safety boundaries |
| `.opencode/skills/sk-code/code-opencode/references/rust/quality-standards/determinism-and-parity.md` | Analyzed | 4, 8, 9 | Pinned TypeScript oracle and byte-for-byte release gate |
| `.opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-errors-and-parity.md` | Analyzed | 9 | AsyncTask, fallback ownership, native/WASM parity fixtures |
| Styles corpus under `.opencode/skills/sk-design/styles/` | Counted | 1 | 1,290 non-internal directories, 1,290 canonical JSON files, ~135 MiB tree |

## External Primary and Upstream Sources

| Resource | Status | Iterations | Evidence use |
|---|---|---:|---|
| `https://arxiv.org/abs/1603.09320` | Analyzed | 2 | HNSW algorithm and scaling rationale |
| `https://github.com/unum-cloud/USearch` | Analyzed | 2, 3 | Exact-vs-ANN guidance; JS/Rust/WASM/SQLite native surfaces |
| `https://github.com/nmslib/hnswlib` | Analyzed | 2 | Existing native HNSW and update/delete capabilities |
| `https://qdrant.tech/documentation/manage-data/indexing/` | Analyzed | 2 | Full-scan threshold and filterable HNSW design |
| `https://qdrant.tech/documentation/faq/qdrant-fundamentals/` | Analyzed | 2 | Approximate result/limit stability caveat |
| `https://nodejs.org/api/sqlite.html` | Analyzed | 3 | `node:sqlite` extension loading and default-off security boundary |
| `https://www.sqlite.org/loadext.html` | Analyzed | 3 | SQLite extension ABI and security model |
| `https://github.com/asg017/sqlite-vec` | Analyzed | 3 | Existing native SQLite vector capability and maturity |
| `https://github.com/asg017/sqlite-vec/releases` | Analyzed | 3 | ANN feature maturity/pre-release status |
| `https://github.com/asg017/sqlite-vec/issues/196` | Analyzed | 3 | Filtering/join limitation requiring proof |
| `https://onnxruntime.ai/docs/get-started/with-javascript/node.html` | Analyzed | 4, 6 | Native Node ONNX inference alternative |
| `https://huggingface.co/docs/transformers.js/en/index` | Analyzed | 4 | JavaScript-facing local model alternative |
| `https://github.com/huggingface/candle` | Analyzed | 4, 6 | Rust-native text/vision model breadth and target options |
| `https://github.com/pykeio/ort` | Analyzed | 4 | Rust wrapper over ONNX Runtime; language/engine distinction |
| `https://nodejs.org/api/fs.html#fswatchfilename-options-listener` | Analyzed | 5 | Raw watcher caveats and reconciliation need |
| `https://nodejs.org/api/worker_threads.html` | Analyzed | 5 | CPU-vs-I/O worker guidance |
| `https://github.com/paulmillr/chokidar` | Analyzed | 5 | TypeScript/Node cross-platform watcher alternative |
| `https://arxiv.org/abs/2103.00020` | Analyzed | 6 | CLIP text-image aligned retrieval capability |
| `https://github.com/lovell/sharp` | Analyzed | 6 | Native libvips Node image pipeline alternative |
| `https://github.com/libvips/libvips` | Analyzed | 6 | Native image-processing engine behind Sharp |
| `https://github.com/image-rs/image` | Analyzed | 6 | Rust image-processing option and capability parity |

## Lineage Artifacts

| Resource | Status | Evidence use |
|---|---|---|
| `deep-research-config.json` | Complete | Immutable run parameters plus terminal status/resource-map flag |
| `deep-research-strategy.md` | Complete | Ten-question charter and answered/ruled-out ledger |
| `deep-research-state.jsonl` | Complete | Append-only route-proof, convergence telemetry, and synthesis event |
| `findings-registry.json` | Complete | Reduced 21-finding registry and coverage metrics |
| `deep-research-dashboard.md` | Complete | 10/10 terminal dashboard and new-information trend |
| `iterations/iteration-001.md` … `iteration-010.md` | Verified | Narrative evidence for every forced-depth angle |
| `deltas/iter-001.jsonl` … `iter-010.jsonl` | Verified | Canonical per-iteration deltas and route proof |
| `research.md` | Complete | Final ranked matrix, recommendation, architecture, and phased adoption path |

## Coverage Gaps

- No generated production SQLite database or query trace was available for latency profiling.
- No production embeddings, dimensions, vector bytes, or filter-selectivity distribution were available.
- Screenshot coverage/fetchability/rights/mutability were not measured.
- No judged text/visual relevance set exists.
- No model, target hardware matrix, package-size budget, or native-platform matrix is selected.
- SQLite vector extension query plans/filter recall and ANN crossover require controlled spikes.
- ANN's exact interpretation under the repository byte-parity rule requires an explicit policy decision.
