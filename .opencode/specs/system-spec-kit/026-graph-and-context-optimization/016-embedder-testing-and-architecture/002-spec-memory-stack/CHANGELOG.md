---
title: "Changelog: 002-spec-memory-stack (pluggable embedder architecture + retrieval-rescue closure)"
description: "Consolidated plain-English changelog of all code changes in the mk-spec-memory stack. Covers the pluggable EmbedderAdapter contract, Ollama backend with multi-dim schema, MCP tools and re-index orchestrator, the 6-candidate bake-off that closed cat-24/409, byte-aware telemetry, byte-bounded cache, sidecar execution, lazy startup gating, canonical vector shard split, BM25-to-FTS5 fusion investigation, FTS5 default with guardrails, local-first cascade reorder, vec_memories backfill, factory audit, constitutional gate exemption and the lineage and metadata repair runner."
trigger_phrases:
  - "002-spec-memory-stack changelog"
  - "mk-spec-memory stack changelog"
  - "embedder architecture changelog"
  - "spec-memory stack root changelog"
  - "016/002 consolidated changelog"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

# Changelog: 002-spec-memory-stack

> Plain-English changelog covering all 19 sub-phases of the mk-spec-memory stack. Read this if you want to understand what shipped without diving into implementation details.
>
> **Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/` (phase parent, 19 sub-phases)
>
> **Stack:** `.opencode/skills/system-spec-kit/mcp_server/` plus `shared/embeddings/`. The TypeScript MCP server that powers `memory_save`, `memory_search`, `memory_context` and related continuity tools.

---

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/002-spec-memory-stack/` (Phase Parent)

### Summary

This stack delivers a pluggable embedder architecture for mk-spec-memory that lets operators swap text-embedding models with one MCP tool call instead of editing source code. The headline win is closing packet 008 cat-24/409 at 9 out of 10 top-3 recall under jina-embeddings-v3 with a retrieval-rescue layer, after a 6-candidate bake-off proved no pure dense embedder could reach the gate alone. The architecture separates concerns through an adapter interface, an Ollama HTTP backend, a dim-tagged vector schema, MCP tools for embedder management and a background re-index orchestrator that handles model swaps safely.

Operator-visible payoff is simple: install Ollama, pull the chosen model and call `embedder_set` to switch. The system handles re-index and pointer flip automatically. Later phases added memory optimizations including byte-aware telemetry, profile-aware caching, sidecar execution for local backends, lazy startup gating and a canonical vector shard split that isolates profile-specific payloads from shared metadata.

The stack also includes a BM25 to FTS5 (SQLite's full-text-search engine) investigation with guardrails, a local-first cascade reorder that lets new users run all-local without API keys, constitutional indexing exemptions, KNN (k-nearest-neighbour) backfill into the legacy `vec_memories` table after the shard split and a metadata repair runner that cleaned up 503 scan failures down to 3.

### Included Phases

| Phase | Slug | Status | Shipped |
|---|---|---|---|
| 001 | [adapter-interface](./001-adapter-interface/) | Scaffolded | 2026-05-17 |
| 002 | [ollama-backend-and-multi-dim-schema](./002-ollama-backend-and-multi-dim-schema/) | Implemented | 2026-05-17 |
| 003 | [mcp-tools-and-reindex](./003-mcp-tools-and-reindex/) | Shipped | 2026-05-17 |
| 004 | [spec-memory-embedder-bake-off](./004-spec-memory-embedder-bake-off/) | Shipped | 2026-05-17 |
| 005 | [context-server-memory-reduction-research](./005-context-server-memory-reduction-research/) | Research-only | 2026-05-18 |
| 006 | [ollama-encode-path-wiring](./006-ollama-encode-path-wiring/) | Implemented | 2026-05-18 |
| 007 | [auto-embedder-selection-and-llama-cpp-purge](./007-auto-embedder-selection-and-llama-cpp-purge/) | Implemented | 2026-05-18 |
| 008 | [byte-aware-health-telemetry](./008-byte-aware-health-telemetry/) | Complete | 2026-05-18 |
| 009 | [byte-bounded-embedding-cache](./009-byte-bounded-embedding-cache/) | Complete | 2026-05-18 |
| 010 | [embedder-sidecar-execution](./010-embedder-sidecar-execution/) | Complete | 2026-05-19 |
| 011 | [lazy-startup-gating](./011-lazy-startup-gating/) | Implemented | 2026-05-19 |
| 012 | [canonical-vector-shard-split](./012-canonical-vector-shard-split/) | Implemented | 2026-05-19 |
| 013 | [bm25-fts5-rag-fusion-investigation](./013-bm25-fts5-rag-fusion-investigation/) | Complete | 2026-05-19 |
| 014 | [fts5-default-lexical-with-guardrails](./014-fts5-default-lexical-with-guardrails/) | Implemented | 2026-05-19 |
| 015 | [cascade-reorder-and-nomic-hf-local-default](./015-cascade-reorder-and-nomic-hf-local-default/) | Shipped | 2026-05-19 |
| 016 | [reindex-populates-vec-memories-knn-table](./016-reindex-populates-vec-memories-knn-table/) | Complete | 2026-05-19 |
| 017 | [factory-shard-fallback-for-hf-voyage-openai](./017-factory-shard-fallback-for-hf-voyage-openai/) | Complete | 2026-05-19 |
| 018 | [constitutional-quality-gate-exemption](./018-constitutional-quality-gate-exemption/) | Complete | 2026-05-19 |
| 019 | [lineage-and-metadata-repair-runner](./019-lineage-and-metadata-repair-runner/) | Complete | 2026-05-19 |

### Added

New subsystems and capabilities that did not exist before this stack.

#### Pluggable embedder interface (001)

The MCP server used to bake `embeddinggemma-300m` into the code through `llama.cpp`. Swapping models meant editing source. Phase 001 introduced the `EmbedderAdapter` interface and an `EmbedderManifest` registry, plus a `BackendKind` enum so every future backend (Ollama, sentence-transformers, hosted API) honours the same five-property contract. This was pure type design with no runtime wiring, but it gave phase 002 a stable surface to implement against.

&nbsp;

#### Embedder MCP tools and re-index orchestrator (003)

Before this work, swapping a model required editing source and restarting the daemon. Phase 003 added three MCP tools: `embedder_list` enumerates registered manifests and marks which one is active, `embedder_set` validates the manifest name and kicks off a background re-index and `embedder_status` reports progress and last result. The orchestrator runs in batches with crash recovery and an atomic pointer flip so a swap never leaves the corpus half-indexed.

&nbsp;

#### Byte-aware health telemetry (008)

The context-server health probe previously reported only `ok` or `degraded`. Phase 008 added V8 (JavaScript engine) heap, external memory, ArrayBuffers and cache byte estimates to the `memory_crud_health` handler, plus optional heap snapshots and an old-space cap. Both heavy options are opt-in via environment flags so the default boot path stays fast.

&nbsp;

#### Embedder sidecar execution (010)

Heavy local embedder runtimes were keeping the MCP process resident long after the last query. Phase 010 isolated them into lazy child-process sidecars over JSONL stdio, with vector cache and SQLite writes staying in the parent. An execution router supports auto, direct and sidecar policies. Health telemetry now reports live worker state so an operator can evict idle workers without touching the daemon.

&nbsp;

#### Lineage and metadata repair runner (019)

Stale `graph-metadata.json` files and orphaned lineage rows were causing scan failures at a rate that masked real issues. Phase 019 added `repair-graph-metadata.mjs`, a direct-run migration runner that upgrades stale graph metadata to v1 schema, normalises invalid importance tiers, compacts V8-rejected archived metadata and realigns stale lineage keys with current memory identities. The first pass touched 172 graph-metadata files and repaired 337 lineage rows. Idempotent on re-runs.

### Changed

Structural or behavioural changes to existing systems.

#### Ollama backend and dim-tagged schema (002)

The vector store assumed a single 768-dimension table named `vec_memories`. Phase 002 added the first concrete adapter (Ollama HTTP, with `/api/embed` preferred and `/api/embeddings` fallback) plus `vec_<dim>` schema helpers with lazy table creation, so the server can now write 1024-dim vectors into `vec_1024` while older 768-dim vectors stay in their original table. An active-embedder pointer lives in the existing `vec_metadata` table under two keys so the choice survives daemon restart.

&nbsp;

#### Ollama encode-path wiring (006)

After phase 002 the index path could write 1024-dim Jina vectors, but the search path's shared embeddings factory could still instantiate `llama-cpp` and produce 768-dim vectors at query time. Phase 006 wired the shared factory to the Ollama-backed active embedder so query encoding always matches the table the re-index just wrote. A live probe confirmed 1024-dim provider resolution end-to-end.

&nbsp;

#### Auto-embedder selection (007)

`embeddinggemma-300m` was the hardcoded default. Phase 007 replaced it with a precedence-chain probe that checks Voyage API key, then OpenAI API key, then a running Ollama daemon with jina-v3, then a local Hugging Face install with nomic-embed-text-v1.5. The fallback `auto` sentinel is now the persisted default and all `llama-cpp` and `embeddinggemma` code, scripts and docs were purged from the tree.

&nbsp;

#### Byte-bounded embedding cache (009)

The persistent embedding cache used a global row-count cap that did not bound actual SQLite residency. Keys ignored which profile or input kind (document versus query) produced them. Phase 009 converted the cache to byte-bounded storage with profile-aware and input-kind-aware keys. Document writes and search queries now use scoped cache keys and the full health report shows real bytes per profile.

&nbsp;

#### Lazy startup gating (011)

Daemon startup used to open the database, warm BM25, resume re-index and other heavy work before any tool was called. Phase 011 introduced a single-flight runtime guard so all that work is deferred until the first memory-owning tool runs. Lightweight health probes still work without booting the runtime.

&nbsp;

#### Canonical vector shard split (012)

A single SQLite database held metadata, lineage, FTS, session state, vector payloads and cache. Switching profiles meant duplicating metadata and keeping hot pages from the old profile resident. Phase 012 split storage into a canonical metadata database plus per-profile attached vector and cache shards. The canonical database keeps the parts that should not duplicate (memories, lineage, FTS5 indexes, sessions). The shards hold per-profile vector payloads and embedding cache.

&nbsp;

#### BM25 FTS5 fusion investigation (013)

Read-only research evaluating whether the in-memory JavaScript BM25 (exact word matching) lane could be replaced by SQLite FTS5 without degrading hybrid retrieval-augmented-generation fusion quality. The five-iteration deep-research run recommended Option B with guardrails: switch the default to FTS5, keep the JavaScript query-expansion layer and require a golden-query parity test before promotion. ADR-001 documents the trade-off and rollback path.

&nbsp;

#### FTS5 default lexical with guardrails (014)

Phase 014 implemented packet 013's recommendation. SQLite FTS5 is now the default BM25 provider via the `SPECKIT_BM25_ENGINE` flag (auto, sqlite, packed-inmemory, legacy-inmemory). A 30-query golden fixture asserts `overlap@5 >= 0.8` across prose, synonym, RRF (reciprocal rank fusion), title, trigger and file-path query groups. The legacy in-memory engine stays selectable as a rollback path.

&nbsp;

#### Local-first cascade reorder (015)

The auto-select cascade was cloud-first (Voyage, OpenAI, Ollama, hf-local). Phase 015 reordered it to local-first (Ollama, hf-local, OpenAI, Voyage) and changed the hf-local fallback model from `BAAI/bge-base-en-v1.5` to `nomic-ai/nomic-embed-text-v1.5` so cascade tiers 1 and 2 use the same model family. New users get all-local embeddings without configuring any API keys.

&nbsp;

#### Reindex populates vec_memories KNN table (016)

The shard split (012) routed new writes into per-profile shard databases but the legacy `vec_memories` table was still consulted for some retrieval paths, so search confidence dropped. Phase 016 made re-index dual-write into both `vec_<dim>` and `vec_memories`, taught the factory to follow the shard split when resolving the active Ollama embedder and ran a one-shot backfill of 3,808 rows so search confidence was restored immediately.

&nbsp;

#### Factory shard fallback audit (017)

Follow-up audit asking whether hf-local, Voyage and OpenAI need shard-aware active-embedder resolvers like Ollama got. Phase 017 confirmed only Ollama persists an active-embedder pointer through `readActiveOllamaEmbedderFromDb`, so no other provider needs the same path. The packet ships docs only and closes the follow-up cleanly.

&nbsp;

#### Constitutional quality gate exemption (018)

Constitutional policy markdown lacks the ANCHOR tags that evidence-bearing memory uses, because the files are policy text rather than retrieval-bearing notes. The strict sufficiency gate was rejecting them. Phase 018 added `isConstitutional` to the warn-only branch in `memory-index.ts` so constitutional files index like spec docs without forced structural changes.

### Fixed

Specific bugs and failure modes closed by this stack.

#### Cat-24/409 retrieval closure (004)

Packet 008 left scenario cat-24/409 (a paraphrase-heavy retrieval test) failing under every dense embedder tried. The bake-off in phase 004 ran six candidates (mxbai, jina-v3, nomic-embed-text-v1.5, bge-m3, snowflake-arctic-embed-l-v2.0 and gemma) and proved no pure dense embedder reached the 8/10 PASS threshold. The fix was a retrieval-rescue layer added on top of the existing pipeline. Jina-embeddings-v3 with rescue reaches 9/10 top-3 on cat-24/409 and preserves the 008 PASS sample at 20 of 20. ADR-012 ratified the production default.

&nbsp;

#### Search confidence post-shard-split (016)

Right after the canonical shard split (012) memory-search Z-score confidence dropped because the legacy `vec_memories` table was still consulted on some paths but the new writes were going only into the shard `vec_<dim>` table. Phase 016 fixed this through dual-write at re-index time plus a one-shot backfill of 3,808 rows. The factory was also taught to follow the shard split when resolving the active Ollama embedder.

&nbsp;

#### Stale lineage and graph metadata (019)

A full scan reported 503 failures across stale `graph-metadata.json` shapes, invalid importance tiers, V8-rejected archived metadata and orphaned lineage rows. The repair runner reduced this to 3 residual failures by upgrading 172 metadata files to v1 schema, normalising tiers, compacting archived metadata and repairing 337 lineage rows against current memory identities.

### Verification

Cross-phase tests, benchmarks and probes that gate the stack.

- **6-candidate bake-off (004)** -- 6 dense embedder candidates compared on the 008 PASS sample plus cat-24/409, full benchmark table at `004-spec-memory-embedder-bake-off/benchmark-results.md`, ADR-001 through ADR-012 in `decision-record.md`.
- **Golden-query overlap gate (014)** -- `lexical-overlap-quality-gate.vitest.ts` enforces `overlap@5 >= 0.8` for FTS5 versus legacy in-memory BM25 across 30 queries in 6 categories.
- **KNN self-probe (016)** -- post-backfill probe confirms `vec_memories` returns valid neighbours after the dual-write change.
- **Auto-selection cascade tests (007, 015)** -- `embedder-auto-selection.vitest.ts` covers Voyage, OpenAI, Ollama jina/nomic priority, hf-local, failure diagnostics, metadata persistence and lock serialisation.
- **Sidecar execution coverage (010)** -- `embedder-sidecar.vitest.ts` covers lazy fork, JSONL framing and policy routing across 10 tests, plus 64 tests across 10 embedder test files all pass.
- **Lazy runtime guard (011)** -- `memory-runtime-guard.vitest.ts` covers single-flight semantics across 6 tests, `context-server.vitest.ts` runs 414 tests against the bootstrapped server.
- **Canonical shard tests (012)** -- `canonical-vector-shard.vitest.ts` covers fresh creation, migration and idempotency. `embedding-cache.vitest.ts` covers 24 tests across 2 files.
- **Llama-cpp purge gate (007)** -- `git grep` for `llama-cpp`, `node-llama-cpp`, `embeddinggemma` and `LlamaCppProvider` across the skill tree returns no output.
- **Repair runner idempotency (019)** -- second dry-run after the first repair pass reports 0 changes. Final scan shows target classes clear.
- **Strict spec validation** -- every phase that shipped ran `validate.sh --strict` against its packet folder.

### Files Changed

High-signal source files touched across the 19 phases. The table groups by area. Test files and packet documentation are not enumerated individually.

| File | What changed |
|---|---|
| `mcp_server/lib/embedders/adapter.ts` | EmbedderAdapter interface contract (001) |
| `mcp_server/lib/embedders/registry.ts` | Name-to-adapter factory lookup, `LlamaCppBaselineAdapter` shim removed in 007 (001, 002, 007) |
| `mcp_server/lib/embedders/types.ts` | `BackendKind`, `EmbedderManifest` (001) |
| `mcp_server/lib/embedders/adapters/ollama.ts` | Full Ollama HTTP adapter, `/api/embed` preferred, fallback to `/api/embeddings` (002) |
| `mcp_server/lib/embedders/schema.ts` | `vec_<dim>` table helpers, active-embedder pointer in `vec_metadata`, `auto` sentinel (002, 007) |
| `mcp_server/handlers/embedder-list.ts` | MCP tool listing available embedders with active flag (003) |
| `mcp_server/handlers/embedder-set.ts` | MCP tool to swap and start background re-index (003) |
| `mcp_server/handlers/embedder-status.ts` | MCP tool to poll re-index progress (003) |
| `mcp_server/lib/embedders/reindex.ts` | Background re-index orchestrator, dual-write into `vec_<dim>` plus `vec_memories` (003, 016) |
| `shared/embeddings/factory.ts` | Ollama provider, runtime fallback chain, shard-aware active Ollama resolution (006, 015, 016) |
| `shared/embeddings/providers/ollama.ts` | `IEmbeddingProvider` for Ollama in shared factory (006) |
| `shared/embeddings/auto-select.ts` | Bootstrap probe cascade, local-first reorder (007, 015) |
| `shared/embeddings/profile.ts` | Profile metadata for shard naming (006, 012) |
| `mcp_server/lib/retrieval-rescue/` | Rescue layer that closed cat-24/409 (004) |
| `mcp_server/lib/telemetry/heap-profiler.ts` | V8 heap, external memory, ArrayBuffer telemetry (008) |
| `mcp_server/handlers/memory-crud-health.ts` | `includeFullReport` gating for opt-in heavy fields (008) |
| `mk-spec-memory-launcher.cjs` | `SPECKIT_CONTEXT_SERVER_MAX_OLD_SPACE_MB` support (008) |
| `mcp_server/lib/cache/embedding-cache.ts` | Profile-aware byte-bounded cache schema migration (009) |
| `mcp_server/handlers/save/embedding-pipeline.ts` | Document cache key wiring (009) |
| `mcp_server/lib/search/vector-index-queries.ts` | Query embedding cache wiring (009) |
| `mcp_server/lib/embedders/sidecar-client.ts` | JSONL stdio client with lazy fork (010) |
| `mcp_server/lib/embedders/sidecar-worker.ts` | Child-process provider runner (010) |
| `mcp_server/lib/embedders/execution-router.ts` | Direct or sidecar policy router (010) |
| `mcp_server/lib/runtime/memory-runtime-guard.ts` | Single-flight lazy runtime guard (011) |
| `mcp_server/context-server.ts` | Thin bootstrap, registered init callback (011) |
| `mcp_server/lib/search/vector-index-store.ts` | Canonical and shard path helpers, `tryGetDb` non-initialising accessor (011, 012) |
| `mcp_server/lib/search/db-shard-migration.ts` | Legacy database migration helper (012) |
| `mcp_server/lib/search/lexical-normalizer.ts` | Shared lexical normalisation (014) |
| `mcp_server/lib/search/bm25-index.ts` | `SPECKIT_BM25_ENGINE` policy helpers (014) |
| `mcp_server/handlers/memory-index.ts` | Constitutional warn-only exemption (018) |
| `mcp_server/scripts/repair-graph-metadata.mjs` | Direct-run repair runner with `--dry-run`, `--scan-log`, `--root`, `--no-lineage` (019) |
| `mcp_server/INSTALL_GUIDE.md` | Cascade documentation and recommended new-user setup (007, 015) |
| Database schema | `vec_<dim>` tables, `vec_metadata` pointer keys, `embedding_cache` profile keys, canonical and shard split (002, 009, 012) |

### Follow-Ups

- **Phase 005** ended after 8 of 10 deep-research iterations without producing actionable context-server memory reduction recommendations. A follow-up packet should re-frame the question with a tighter scope before the next iteration run.
- **Phase 011** is marked Implemented with handler verification blocked. A live daemon smoke covering memory-owning tool first-call latency should close the verification.
- **Phase 015** ran one partial edit pre-scaffold. Confirm no leftover cloud-first references in install guides or onboarding docs through a final case-insensitive grep sweep.
- **Phase 007** documents an operator migration path that keeps the legacy database and GGUF artifacts until the new auto-selected database is verified. A short retention guidance note in the install guide would help operators decide when to delete the legacy files.
- **Phase 013** identified golden-query parity tests as a guardrail. Phase 014 shipped one such test. A second parity test covering RRF behaviour under the SQLite engine specifically would harden the swap.
- **Phase 019** left 3 residual scan failures unrepaired. They are below the runner's target classes and need manual triage.
