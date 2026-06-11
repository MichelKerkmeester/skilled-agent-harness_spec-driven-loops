---
title: "Embedder Pluggability: mk-spec-memory"
description: "Canonical mk-spec-memory pluggable-embedder reference, covering defaults, swap flows, rollback, and the out-of-box support matrix."
trigger_phrases:
  - "embedder pluggability"
  - "embedder swap"
  - "which embedder do we use"
  - "out-of-box embedder support"
  - "any embedder works"
  - "embedder rollback"
  - "embedder device selection"
importance_tier: important
contextType: implementation
---

# Embedder Pluggability: mk-spec-memory

Canonical reference for mk-spec-memory embedder pluggability. Read this when a new user asks "which embedder do you use", before swapping memory embedders, or when triaging memory retrieval-quality regressions.

---

## 1. OVERVIEW

### Purpose

Explain mk-spec-memory embedder pluggability, including defaults, swap flows, rollback, and supported candidates.

### When to Use

Load this reference when changing the mk-spec-memory text embedder, diagnosing memory retrieval-quality regressions, or answering operator questions about out-of-box support.

### Core Principle

mk-spec-memory has a pluggable text embedder. The current default is `nomic-embed-text-v1.5` through the local-first cascade described below.

### Scope after 014

`mk-spec-memory` indexes prose: spec docs, decision records, continuity frontmatter, conversation summaries. Prose recall benefits from text-tuned embedders that handle paraphrase, multilingual prefixes, and synonym overlap.

`system-code-graph` was a separate code-embedder MCP until the 014 deprecation; after 014 it became a structural tree-sitter indexer with no embeddings, so embedder pluggability now applies to mk-spec-memory only.

### What "out-of-box for any embedder" means

The promise is operator-facing: a new install picks the mk-spec-memory default without configuration, and swapping to a different text embedder from the vetted list never requires code changes. Schema migrations and dim-mismatch handling are automatic.

The promise does NOT mean any HuggingFace model just works. Only vetted candidates in the memory registry are guaranteed first-class. Adding a new candidate is a one-row append (see §2) — not a new code path.

---

## 2. MK-SPEC-MEMORY SIDE

### Provider cascade (ADR-014, local-first)

Before any within-Ollama choice, the outer provider cascade decides which backend wins:

```text
Ollama (tier 1, local)  ->  hf-local (tier 2, pure-Node @huggingface/transformers model server)  ->  OpenAI (tier 3, cloud)  ->  Voyage (tier 4, cloud)
```

ADR-014 (2026-05-19) supersedes the cascade clause of ADR-013 — earlier cascade was cloud-first (`voyage > openai > ollama > hf-local`); the new order keeps embeddings local by default unless the operator explicitly chooses a cloud tier (`EMBEDDINGS_PROVIDER=openai|voyage`).

Within tier 1 (Ollama), the priority order is ADR-013: `nomic-embed-text-v1.5`, `jina-embeddings-v3`, `bge-m3`, `mxbai-embed-large-v1`. Within tier 2 (hf-local), the default fallback model is `nomic-ai/nomic-embed-text-v1.5` (same family as the Ollama default — ADR-014).

### Current default: nomic-embed-text-v1.5 (768d via Ollama; ADR-013)

Production active pointer per ADR-013 (within-Ollama priority):

```text
active_embedder_name -> nomic-embed-text-v1.5
active_embedder_dim  -> 768
ollama tag           -> nomic-embed-text:v1.5
maxInputChars        -> 8000
```

> **History.** ADR-012 originally ratified `jina-embeddings-v3` (1024d Q4_K_M); ADR-013 made `nomic-embed-text-v1.5` the within-Ollama default; ADR-014 reorders the outer cascade so Ollama beats cloud APIs by default.

Rescue layer is default-on (`SPECKIT_RERANK_LAYER` unset or `true`). Kill switch: `SPECKIT_RERANK_LAYER=false`.

### MANIFESTS registry pattern

Source of truth: `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts`. The `mcp_server/lib/embedders/registry.ts` path is only a re-export shim that points at `@spec-kit/shared`. The `MANIFESTS` constant is a frozen `ReadonlyArray<EmbedderManifest>`. Each manifest declares:

```typescript
{
  name: string,           // canonical name; matches active_embedder_name
  dim: number,            // vector dimension; routes to vec_<dim> table
  backend: BackendKind,   // 'ollama' | 'api' | 'sentence-transformers'
  ollamaName?: string,    // Ollama model tag (when backend === 'ollama')
  apiUrl?: string,        // endpoint URL (when backend === 'api')
  prefixQuery?: string,   // optional query-time prefix (e.g. "search_query: ")
  prefixDocument?: string,// optional document-time prefix
  maxInputChars?: number, // cap to keep inputs under model context window
  notes: string,
}
```

One candidate is registered today: `nomic-embed-text-v1.5` (`ollama` backend, 768d). `embedder_set` rejects any other name with `UNKNOWN_EMBEDDER`. Additional models can be added by appending manifests to `shared/embeddings/registry.ts`.

Adding a new candidate is a single registry row plus, if the backend is new, a single adapter file under `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapters/`. No call sites change. The adapter contract is small (see §2: EmbedderAdapter interface).

### MCP tools

Three tools wrap the registry. They live in `mcp_server/handlers/` and are exposed through the standard MCP transport:

| Tool | Purpose |
|---|---|
| `embedder_list` | Return all registered manifests plus their `ready()` state. |
| `embedder_set({ name })` | Swap active embedder; queues a re-index job and updates `active_embedder_name` on success. |
| `embedder_status` | Return current `active_embedder_name`, `active_embedder_dim`, and the most recent swap-job status. |

Operator flow is "list, set, watch." The set call is asynchronous: it returns a job ID, the orchestrator re-indexes every `memory_index` row through the new adapter, and the active pointer flips only when the job reaches `completed`.

### EmbedderAdapter interface

Contract every backend honors, defined in `mcp_server/lib/embedders/adapter.ts` (commit `3d9e89d1f`):

```typescript
interface EmbedderOptions {
  readonly inputType?: 'document' | 'query'; // selects query vs document prefix
}

interface EmbedderAdapter {
  readonly name: string;
  readonly dim: number;
  readonly backend: BackendKind;
  readonly prefixQuery?: string;
  readonly prefixDocument?: string;
  embed(texts: ReadonlyArray<string>, options?: EmbedderOptions): Promise<Float32Array[]>;
  ready(): Promise<boolean>;
}
```

The retrieval pipeline (`hybrid-search`, `memory_search`, `memory_context`) only calls `embed()` and `ready()`. It does not know which backend is underneath. Implementations live in `mcp_server/lib/embedders/adapters/<backend>.ts`.

### Dim-tagged vec_<dim> schema — no migration when swapping dim

The vector store uses sqlite-vec tables named `vec_<dim>`. Today the schema includes `vec_384`, `vec_768`, and `vec_1024`. Each table is created lazily on first reference to that dimension.

Switching embedders does not migrate vectors. It runs a re-index that writes fresh embeddings into the table matching the new manifest's `dim`. The previous table remains in the database as evidence and can be referenced by rollback. Active reads always go through the `vec_<active_embedder_dim>` table.

This is why a 768→1024 swap is reversible without data loss and why the swap orchestrator is crash-resumable: it tracks per-row progress and can restart from the last persisted offset.

### Retrieval rescue layer (default-on per ADR-011)

The rescue layer is a runtime-gated stage 2b/3 that hydrates ranked candidates with same-folder siblings, lexical backfill from `memory_index`, and trigger-lane weighting that ignores generic one-token triggers. It is additive to the dense-embedding pipeline; the embedder itself is unchanged.

Path A (cross-encoder reranker) was explicitly rejected — unnecessary for the closure gate and would have added runtime/model complexity. Path B (trigger-lane weighting) and Path C (sibling/backfill rescue) shipped.

Cost profile measured on a 30-scenario stratified sample (ADR-011):
- Quality: OFF `27/30`, ON `28/30` (`+1` net, no regressions).
- Latency: median `426.5 ms` → `922.5 ms` (`2.16x`); p95 `1411 ms` → `3045 ms` (`2.16x`).

Verdict: GATE default-on. Document the latency cost; preserve `SPECKIT_RERANK_LAYER=false` as the explicit kill switch.

### ADR trail summary (016/004)

Source: internal design notes (commit `1aa46e523`).

| ADR | Verdict | Key finding |
|---|---|---|
| 001 | ROLLBACK | mxbai swap failed at activation: registry manifest name leaked into Ollama call. |
| 002 | n/a | Failure mode + rollback command isolated; diagnostic probe identified manifest-vs-tag mapping defect. |
| 003 | ROLLBACK | Manifest-name mapping fixed (`manifest.ollamaName ?? manifest.name`); retry still failed because full-document inputs exceeded model context. |
| 004 | ROLLBACK | `maxInputChars: 1200` bounded inputs; re-index completed; query-path wiring patched to read `vec_<dim>`; cat-24/409 still failed (2/10 top-3). |
| 005 | ROLLBACK | jina-embeddings-v3 reached 4/10 top-3. |
| 006 | ROLLBACK | nomic-embed-text-v1.5 became empirical leader at 5/10 top-3. |
| 007 | ROLLBACK | bge-m3 tied mxbai at 2/10. |
| 008 | ROLLBACK | snowflake-arctic-embed-l-v2.0 regressed to 1/10. Pure dense swaps exhausted; pivot to retrieval-stage changes. |
| 009 | FIXTURE-FIXED-BUT-409-OPEN | Cat-24 fixture surgery (orphan prune + deterministic `409-fixture.json`); nomic at 6/10; gate still open. |
| 010 | KEEP | Opt-in retrieval rescue layer (Paths B+C) lifted nomic to 8/10 PASS. |
| 011 | GATE DEFAULT-ON | 30-scenario sweep: +1 quality, ~2.16x latency; rescue layer kept default-on with documented kill switch. |
| 012 | KEEP | Production comparison with rescue ON: jina-v3 9/10 (893ms), nomic 8/10 (922ms), gemma 7/10 (787ms). Jina-v3 ratified as production default. |

Per-row empirical results live in `evidence/embedder-comparison-with-rescue.jsonl` alongside the decision record.

---

## 3. CODE GRAPH (no embedder since 014)

`system-code-graph` had a pluggable code embedder before 014, including `CodeRankEmbed`, sentence-transformers, MPS device selection, and a `ccc reset/index` swap workflow. The 014 deprecation removed that semantic/vector layer completely. `system-code-graph` is now a structural tree-sitter indexer under `.opencode/skills/system-code-graph/`, storing nodes and edges with no embeddings, no embedder runtime, and no `ccc` CLI. Embedder pluggability now applies only to mk-spec-memory.

---

## 4. OPERATING MODES

### First-install flow

| Step | mk-spec-memory |
|---|---|
| 1 | Install the MCP server (per skill INSTALL_GUIDE). |
| 2 | Pull the default Ollama model: `ollama pull nomic-embed-text:v1.5`. |
| 3 | Start the MCP server; first `embedder_status` call returns the active `nomic-embed-text-v1.5` profile. |
| 4 | Optional: confirm `SPECKIT_RERANK_LAYER` unset (default-on). |

No code changes. No schema migrations. A fresh clone reaches a ready state from the documented commands above.

### Swap flow

```text
1. embedder_list({})                          // confirm candidate is registered + ready
2. embedder_set({ name: "<candidate-name>" }) // returns job ID; runs async
3. (poll) embedder_status                     // watch active_embedder_name flip
4. memory_search probe                        // sanity-check a known-good query
```

The mk-spec-memory swap is single-MCP-call and crash-resumable.

### Rollback flow

mk-spec-memory rollback is a same-shape `embedder_set` call that re-points active back to the prior embedder. The previous `vec_<dim>` table is preserved, so rollback is fast when same-to-same (the re-index orchestrator can short-circuit if the destination table already has fresh vectors for the current corpus). Eight rollbacks executed cleanly across ADR-001..ADR-008.

---

## 5. OUT-OF-BOX SUPPORT MATRIX

The table below lists the mk-spec-memory embedder that works without code changes because the registry already includes the candidate. Only one manifest is registered today (`MANIFESTS` in `shared/embeddings/registry.ts`); `embedder_set` throws `UNKNOWN_EMBEDDER` for any name not in this list.

| Embedder | mk-spec-memory backend | Dim | Approx RAM | Notes |
|---|---|---:|---:|---|
| `nomic-embed-text-v1.5` | ollama | 768 | ~600 MB | Current default text retrieval specialist; local-first cascade default. |

The candidates evaluated during the 016/004 bake-off (`jina-embeddings-v3`, `bge-base-en-v1.5`, `bge-small-en-v1.5`, `bge-large-en-v1.5`, `bge-m3`, `mxbai-embed-large-v1`, `snowflake-arctic-embed-l-v2.0`) are historical/removed and are NOT registered; restore them to `shared/embeddings/registry.ts` to make them selectable again.

---

## 6. TRADE-OFFS

### Fit guidance

mk-spec-memory indexes prose: spec docs, decision records, meeting notes, conversation summaries. Text-tuned embedders are the right class when queries are paraphrase-heavy ("how do we handle X" rather than literal symbol lookups), or when multilingual or cross-domain recall matters.

### Size vs quality

Larger embedders trade RAM and disk for stronger recall on long-tail queries. Use the registry's `ram_mb` / `disk_mb` fields as your starting filter:

- **Small** (≤500 MB): `bge-small-en-v1.5` (384d). Fast indexing; weaker paraphrase capacity. Use only when you are RAM-bound.
- **Mid** (500 MB–1 GB): all current defaults plus most registered alternatives. Best general trade-off.
- **Large** (>1 GB): `bge-large-en-v1.5`, `bge-m3`, `snowflake-arctic-embed-l-v2.0`, `mxbai-embed-large-v1`. Pick one of these only after measuring on a fixture; empirically none beat the production defaults on the cat-24/409 sweep.

### Latency vs recall

The rescue layer on the memory side is the clearest example of the trade. ADR-011 measured `+1` quality at `~2.16x` median latency. The verdict was GATE default-on with a documented kill switch. Embedder choice itself rarely produces latency that large; the dominant cost is the rescue stage when active. If you need to chase tail latency, the lever to pull first is `SPECKIT_RERANK_LAYER=false`, not the embedder.

## 7. APPENDIX: VALIDATED AGAINST

This document was authored against the following source files at the commits below. If the source files drift, this document needs updating.

| Source | Commit | Path |
|---|---|---|
| Memory adapter interface | `3d9e89d1f` | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapter.ts` |
| Memory MANIFESTS registry | `4a4e166ab` | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` |
| Memory ADR trail (001–012) | `1aa46e523` | Internal design notes |
| Memory ADR evidence | `1aa46e523` | (sibling) `evidence/embedder-comparison-with-rescue.jsonl` |

### Cross-links

- Memory registry source: [`registry.ts`](../../mcp_server/lib/embedders/registry.ts)
- Memory adapter interface: [`adapter.ts`](../../mcp_server/lib/embedders/adapter.ts)
