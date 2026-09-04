---
title: "Embedder Pluggability"
description: "Canonical pluggable-embedder reference for the shared embedding stack, covering defaults, swap flows, rollback, and the out-of-box support matrix."
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
version: 3.6.0.14
---

# Embedder Pluggability

Canonical reference for the shared embedding stack at `.opencode/skills/system-spec-kit/shared/embeddings/`. Read this when a new user asks "which embedder do you use", before swapping embedders, or when triaging vector retrieval-quality regressions.

> **Scope.** Spec-folder retrieval does not use any of this. It is lexical: a trigger-index lookup plus the ripgrep recipes in `../retrieval/retrieval-conventions.md`. Embedders serve the skill advisor and the retained model-server consumers, and an embedder problem can never explain a spec-folder retrieval miss.

---

## 1. OVERVIEW

### Purpose

Explain shared-stack embedder pluggability, including defaults, swap flows, rollback, and supported candidates.

### When to Use

Load this reference when changing the shared text embedder, diagnosing vector retrieval-quality regressions, or answering operator questions about out-of-box support.

### Core Principle

The shared stack has a pluggable text embedder. The current default is `nomic-embed-text-v1.5` through the local-first cascade described below.

### Scope after 014

The consumers of this stack index prose: spec docs, decision records, continuity frontmatter, conversation summaries. Prose recall benefits from text-tuned embedders that handle paraphrase, multilingual prefixes, and synonym overlap.


### What "out-of-box for any embedder" means

The promise is operator-facing: a new install picks the default without configuration, and swapping to a different text embedder from the vetted list never requires code changes. Schema migrations and dim-mismatch handling are automatic.

The promise does NOT mean any HuggingFace model just works. Only vetted candidates in `shared/embeddings/registry.ts` are guaranteed first-class. Adding a new candidate is a one-row append (see §2) — not a new code path.

---

## 2. SHARED EMBEDDING STACK

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

### MANIFESTS registry pattern

Source of truth: `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts`. A consumer's local `mcp-server/lib/embedders/registry.ts` — the skill advisor keeps one — is only a re-export shim pointing at `@spec-kit/shared`. The `MANIFESTS` constant is a frozen `ReadonlyArray<EmbedderManifest>`. Each manifest declares:

```typescript
{
  name: string,           // canonical name; matches the consumer's active-embedder pointer
  dim: number,            // vector dimension; routes to the consumer's dim-tagged table
  backend: BackendKind,   // 'ollama' | 'api' | 'sentence-transformers'
  ollamaName?: string,    // Ollama model tag (when backend === 'ollama')
  apiUrl?: string,        // endpoint URL (when backend === 'api')
  prefixQuery?: string,   // optional query-time prefix (e.g. "search_query: ")
  prefixDocument?: string,// optional document-time prefix
  maxInputChars?: number, // cap to keep inputs under model context window
  notes: string,
}
```

One candidate is registered today: `nomic-embed-text-v1.5` (`ollama` backend, 768d). A swap rejects any other name with `UNKNOWN_EMBEDDER`. Additional models can be added by appending manifests to `shared/embeddings/registry.ts`.

Adding a new candidate is a single registry row plus, if the backend is new, a single adapter file under `.opencode/skills/system-spec-kit/shared/embeddings/adapters/`. No call sites change. The adapter contract is small (see §2: EmbedderAdapter interface).

### Administration surface

Three operations wrap the registry: list the registered manifests with their `ready()` state, set the active embedder, and read the active pointer plus the most recent swap-job status.

| Operation | Purpose |
|---|---|
| List | Return all registered manifests plus their `ready()` state. |
| Set | Swap active embedder; re-embeds the consumer's store and updates its active-embedder pointer on success. |
| Status | Return the current active name, dimension, and the most recent swap-job status. |

Operator flow is "list, set, watch." The set operation is asynchronous: it returns a job ID, the orchestrator re-embeds every row through the new adapter, and the active pointer flips only when the job reaches `completed`.

**The spec kit exposes no tool for any of this, and `shared/` owns no store.** The stack produces vectors; the consuming service owns the pointer, the tables, and the swap. The skill advisor is that consumer today, holding the registry shim, the dim-tagged schema and its `skill-graph.sqlite`. Configure the stack through the environment variables in `../config/environment-variables.md`, and read health from the advisor's own status surface: `node .opencode/bin/skill-advisor.cjs advisor_status --format json`.

### EmbedderAdapter interface

Contract every backend honors, defined in `shared/embeddings/adapter.ts`:

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

A vector retrieval pipeline only calls `embed()` and `ready()`. It does not know which backend is underneath. Implementations live under the shared embedding adapters.

### Dim-tagged schema — no migration when swapping dim

The convention a consumer's store follows is one sqlite-vec table per dimension, named `vec_<dim>` and created lazily on first reference. `shared/embeddings/profile.ts` derives a matching shard filename that encodes provider, model and dimension, so two profiles can coexist on disk without colliding.

Switching embedders does not migrate vectors. It re-embeds into the table matching the new manifest's `dim`. The previous table stays as evidence and can be referenced by rollback. Active reads always go through the table for the currently active dimension.

This is why a 768→1024 swap is reversible without data loss, and why a swap orchestrator can be made crash-resumable: it tracks per-row progress and restarts from the last persisted offset.

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

## 3. OPERATING MODES

### First-install flow

| Step | Action |
|---|---|
| 1 | Install the consuming service (per its install guide). |
| 2 | Pull the default Ollama model: `ollama pull nomic-embed-text:v1.5`. |
| 3 | Start the consumer; the active profile reads back as `nomic-embed-text-v1.5`. |
| 4 | Confirm health: `node .opencode/bin/skill-advisor.cjs advisor_status --format json`. |

No code changes. No schema migrations. A fresh clone reaches a ready state from the documented commands above.

### Swap flow

```text
1. list      // confirm candidate is registered + ready
2. set       // returns job ID; runs async
3. (poll)    // watch the active pointer flip
4. probe     // sanity-check a known-good vector query
```

The swap is a single call and crash-resumable.

> **The advisor owns this now.** These four steps ran through the retired memory MCP surface, and the shared embedding stack moved to the skill advisor with the model server. Read them as the shape of the operation and drive it through the advisor's surface, not through a spec-kit tool.

### Rollback flow

Rollback is a same-shape set call that re-points active back to the prior embedder. The previous dim-tagged table is preserved, so rollback is fast when same-to-same: the orchestrator can short-circuit if the destination table already holds fresh vectors for the current corpus. Eight rollbacks executed cleanly across ADR-001..ADR-008.

---

## 4. OUT-OF-BOX SUPPORT MATRIX

The table below lists the embedder that works without code changes because the registry already includes the candidate. Only one manifest is registered today (`MANIFESTS` in `shared/embeddings/registry.ts`); a swap throws `UNKNOWN_EMBEDDER` for any name not in this list.

| Embedder | Backend | Dim | Approx RAM | Notes |
|---|---|---:|---:|---|
| `nomic-embed-text-v1.5` | ollama | 768 | ~600 MB | Current default text retrieval specialist; local-first cascade default. |

The candidates evaluated during the 016/004 bake-off (`jina-embeddings-v3`, `bge-base-en-v1.5`, `bge-small-en-v1.5`, `bge-large-en-v1.5`, `bge-m3`, `mxbai-embed-large-v1`, `snowflake-arctic-embed-l-v2.0`) are historical/removed and are NOT registered; restore them to `shared/embeddings/registry.ts` to make them selectable again.

---

## 5. TRADE-OFFS

### Fit guidance

The consumers of this stack index prose: spec docs, decision records, meeting notes, conversation summaries. Text-tuned embedders are the right class when queries are paraphrase-heavy ("how do we handle X" rather than literal symbol lookups), or when multilingual or cross-domain recall matters.

### Size vs quality

Larger embedders trade RAM and disk for stronger recall on long-tail queries. Use the registry's `ram_mb` / `disk_mb` fields as your starting filter:

- **Small** (≤500 MB): `bge-small-en-v1.5` (384d). Fast indexing; weaker paraphrase capacity. Use only when you are RAM-bound.
- **Mid** (500 MB–1 GB): all current defaults plus most registered alternatives. Best general trade-off.
- **Large** (>1 GB): `bge-large-en-v1.5`, `bge-m3`, `snowflake-arctic-embed-l-v2.0`, `mxbai-embed-large-v1`. Pick one of these only after measuring on a fixture; empirically none beat the production defaults on the cat-24/409 sweep.

### Latency vs recall

Embedder choice is rarely the dominant latency term. The 016/004 bake-off measured swings of a few hundred milliseconds between candidates while the retrieval stages around them moved the number by more. Measure the consumer's whole query path before blaming the model: a swap that trades 100 ms for worse recall is a bad trade, and one made without a baseline is not a trade at all.

---

## 6. APPENDIX: VALIDATED AGAINST

This document was authored against the following source files. If they drift, this document needs updating.

| Source | Path |
|---|---|
| Adapter interface | `.opencode/skills/system-spec-kit/shared/embeddings/adapter.ts` |
| MANIFESTS registry | `.opencode/skills/system-spec-kit/shared/embeddings/registry.ts` |
| Provider cascade | `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts` |
| ADR trail (001–012) | Internal design notes, commit `1aa46e523` |

### Cross-links

- Registry source: [`registry.ts`](../../shared/embeddings/registry.ts)
- Adapter interface: [`adapter.ts`](../../shared/embeddings/adapter.ts)
- Provider cascade: [`auto-select.ts`](../../shared/embeddings/auto-select.ts)
