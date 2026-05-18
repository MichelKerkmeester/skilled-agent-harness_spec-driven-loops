---
title: "Embedder Pluggability: mk-spec-memory + CocoIndex"
description: "Canonical reference for the two-MCP / two-embedder / two-mechanism embedder architecture, covering defaults, swap flows, device selection, and the out-of-box support matrix."
trigger_phrases:
  - "embedder pluggability"
  - "embedder swap"
  - "which embedder do we use"
  - "out-of-box embedder support"
  - "any embedder works"
  - "embedder rollback"
  - "embedder device selection"
importance_tier: "important"
contextType: "reference"
---

<!-- canonical narrative; cite ADRs + commit SHAs -->

# Embedder Pluggability: mk-spec-memory + CocoIndex

Canonical reference for the two-MCP embedder architecture. Read this when a new user asks "which embedder do you use", before swapping models, or when triaging retrieval-quality regressions across either MCP.

---

## 1. OVERVIEW

### The two-MCP, two-embedder, two-mechanism picture

Two MCP servers each run their own vector index and pick their own embedder:

| MCP server | Default embedder | Dim | Backend | Pluggable via | Index store |
|---|---|---:|---|---|---|
| `mk-spec-memory` (Spec Kit Memory) | `jina-embeddings-v3` | 1024 | Ollama (GGUF Q4_K_M) | MCP tools + MANIFESTS registry | sqlite-vec `vec_<dim>` tables |
| `mcp-coco-index` (CocoIndex Code) | `sbert/jinaai/jina-embeddings-v2-base-code` | 768 | sentence-transformers (PyTorch) | `COCOINDEX_CODE_EMBEDDING_MODEL` env var + registered_embedders.py | sqlite-vec inside `.cocoindex_code/` |

Both are pluggable. They use different mechanisms because they index different content classes and have different runtime constraints.

### Why two embedders (text vs code)

`mk-spec-memory` indexes prose: spec docs, decision records, continuity frontmatter, conversation summaries. Prose recall benefits from text-tuned embedders that handle paraphrase, multilingual prefixes, and synonym overlap.

`mcp-coco-index` indexes source code: function bodies, import graphs, identifiers, doc-comments. Code recall benefits from code-tuned embedders trained on `<query, source-snippet>` pairs across languages.

Trying to share one embedder across both was rejected empirically. The pre-018 baseline used `embeddinggemma-300m` (general-text) for both, and CocoIndex code recall lagged measurably. Packet 018 swapped CocoIndex to a code-tuned model; packet 016/004 settled mk-spec-memory on a text-tuned Jina variant after a five-candidate sweep.

### What "out-of-box for any embedder" means

The promise is operator-facing: a new install picks the right default for each MCP without configuration, and swapping to a different embedder from the vetted list never requires code changes — only an MCP tool call (memory) or an env var plus reindex (CocoIndex). Schema migrations, device probing, and dim-mismatch handling are automatic.

The promise does NOT mean any HuggingFace model just works. Only vetted candidates in the two registries are guaranteed first-class. Adding a new candidate is a one-row append (see §2 and §3) — not a new code path.

---

## 2. MK-SPEC-MEMORY SIDE

### Current default: jina-embeddings-v3 (1024d Q4_K_M via Ollama)

Production active pointer per ADR-012:

```text
active_embedder_name -> jina-embeddings-v3
active_embedder_dim  -> 1024
ollama tag           -> hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M
maxInputChars        -> 8000
```

Rescue layer is default-on (`SPECKIT_RERANK_LAYER` unset or `true`). Kill switch: `SPECKIT_RERANK_LAYER=false`.

### MANIFESTS registry pattern

Source of truth: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` (commit `4a4e166ab`). The `MANIFESTS` constant is a frozen `ReadonlyArray<EmbedderManifest>`. Each manifest declares:

```typescript
{
  name: string,           // canonical name; matches active_embedder_name
  dim: number,            // vector dimension; routes to vec_<dim> table
  backend: BackendKind,   // 'llama-cpp' | 'ollama' | 'sentence-transformers' | 'api'
  ollamaName?: string,    // Ollama model tag (when backend === 'ollama')
  modelPath?: string,     // GGUF path (when backend === 'llama-cpp')
  prefixQuery?: string,   // optional query-time prefix (e.g. "search_query: ")
  prefixDocument?: string,// optional document-time prefix
  maxInputChars?: number, // cap to keep inputs under model context window
  notes: string,
}
```

Eight candidates are registered today (in declaration order): `embeddinggemma-300m` (legacy baseline, `llama-cpp` backend), `nomic-embed-text-v1.5`, `mxbai-embed-large-v1`, `bge-small-en-v1.5`, `bge-large-en-v1.5`, `jina-embeddings-v3` (active default), `bge-m3`, `snowflake-arctic-embed-l-v2.0`.

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
interface EmbedderAdapter {
  readonly name: string;
  readonly dim: number;
  readonly backend: BackendKind;
  readonly prefixQuery?: string;
  readonly prefixDocument?: string;
  embed(texts: ReadonlyArray<string>): Promise<Float32Array[]>;
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

## 3. COCOINDEX SIDE

### Current default: sbert/jinaai/jina-embeddings-v2-base-code (768d code-tuned)

Production default per packet 018 ADR-001 (commit `8f909d229`):

```python
# .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py
_DEFAULT_MODEL = "sbert/jinaai/jina-embeddings-v2-base-code"
```

768 dimensions, code-tuned (Python/JS/Go/Java/Ruby/PHP), 8192-token context, ~280 MB on disk, Metal-accelerated on Apple Silicon. The dim matches the pre-swap gemma baseline (also 768), so the existing CocoIndex index schema did not need migration when the default flipped.

### registered_embedders.py pattern (mirrors MANIFESTS)

Source of truth: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py` (commit `49e3338ff`). Six candidates registered today, each as a frozen `EmbedderMetadata` dataclass with seven fields:

```python
@dataclass(frozen=True)
class EmbedderMetadata:
    name: str           # "sbert/" or "litellm/" prefixed model string
    dim: int
    ram_mb: int         # approximate resident memory
    disk_mb: int        # approximate HuggingFace cache footprint
    mps_compatible: bool
    category: Literal["text", "code"]
    hf_url: str         # authoritative model card URL
    notes: str          # operator-facing "when to prefer"
```

Public API:

| Function | Returns |
|---|---|
| `list_embedders()` | Frozen tuple of all registered candidates. |
| `get_embedder_metadata(name)` | One candidate by sbert/ string; `None` if unregistered. |
| `default_embedder()` | The candidate whose `name` matches `_DEFAULT_MODEL`; raises if drift detected. |

This is intentionally NOT full 016 parity. There are no MCP tools (`cocoindex_embedder_set` etc.) and no daemon hot-reload. The registry is consumed by `INSTALL_GUIDE.md` §4 (operator-facing chooser table) and by the parity unit test that catches `config.py` ↔ `registered_embedders.py` drift.

### Swap mechanism: env var + ccc reset + ccc index

Three-step operator runbook (mirrors INSTALL_GUIDE §4):

```bash
# 1. Choose a model name from the registry
export COCOINDEX_CODE_EMBEDDING_MODEL="sbert/nomic-ai/CodeRankEmbed"

# 2. Restart the daemon (graceful kill; supervisor auto-respawns on next ccc call)
ps -eo pid,command | grep "ccc run-daemon" | grep -v grep \
  | awk '{print $1}' | xargs kill

# 3. Purge old vectors + reindex with new embedder
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc reset --force
.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc index
```

`reset --force` is required because CocoIndex's on-disk vectors must match the live model's dimensionality. Skipping reset on a dim-changing swap (e.g., 768→2048 to SFR-2B) leaves a stale table and silently corrupts retrieval. `reset` clears the table; `index` rebuilds it.

First-use note: sentence-transformers downloads the model from HuggingFace on first instantiation (~270-340 MB for the small candidates, ~4 GB for SFR-2B). Cached at `~/.cache/huggingface/hub/`.

### MPS auto-detect (_resolve_device): CUDA → MPS → CPU

Source: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` `_resolve_device()` (commit `8f909d229`). Resolution order is explicit:

1. If `COCOINDEX_CODE_DEVICE` env var is set and non-empty → trust as-is (operator override).
2. Otherwise lazy-import `torch` and probe in order:
   - `torch.cuda.is_available()` → `"cuda"`
   - `torch.backends.mps.is_available()` → `"mps"`
   - else → `"cpu"`
3. If torch is not importable → return `None` and let the downstream framework choose.

The lazy import keeps the config module cheap when the caller does not need a device hint. The MPS branch is the 018 patch: pre-018 only checked CUDA, so Apple Silicon hosts got CPU inference even though Metal was available.

### COCOINDEX_CODE_DEVICE=cpu kill switch

Set the env var to force any device:

```bash
# Force CPU (kill switch for MPS instability)
export COCOINDEX_CODE_DEVICE=cpu

# Force CUDA (skip MPS probe even on machines with both)
export COCOINDEX_CODE_DEVICE=cuda
```

The override is unconditional. It bypasses the probe and is passed straight through to sentence-transformers. Use `cpu` when MPS produces unstable embeddings on an older PyTorch build, or when you need bit-exact reproducibility across machines.

### Packet trail (018 + 019)

- **018/001** (`8f909d229`) — Default flip from `embeddinggemma-300m` to `jinaai/jina-embeddings-v2-base-code`; MPS auto-detect branch added; unit test covers the MPS fallback.
- **018/002** — Code-retrieval fixture (10–20 deterministic query→source pairs) for benchmarking the swap.
- **018/003** — Benchmark gemma baseline vs jina-code on the fixture; ADR-001 ratifies the production choice.
- **019/001** (`49e3338ff`) — `registered_embedders.py` declarative registry + parity test against `config.py`.
- **019/002** — `INSTALL_GUIDE.md` §4 "Choosing an embedder" + README cross-link, so a first-install operator can see the full chooser table without diving into Python.

The 019 packet is explicit about scope: minimal viable parity with 016. MCP-tool surface for CocoIndex is deferred until operator demand surfaces; the env-var + reset/reindex path is the canonical swap mechanism today.

---

## 4. OPERATING MODES

### First-install flow (per MCP)

| Step | mk-spec-memory | mcp-coco-index |
|---|---|---|
| 1 | Install the MCP server (per skill INSTALL_GUIDE). | Run `bash .opencode/skills/mcp-coco-index/scripts/install.sh`. |
| 2 | Pull the default Ollama model: `ollama pull hf.co/gaianet/jina-embeddings-v3-GGUF:Q4_K_M`. | First `ccc index` triggers sentence-transformers to download the default jina-code model (~280 MB) from HuggingFace. |
| 3 | Start the MCP server; first `embedder_status` call returns `jina-embeddings-v3 / 1024`. | `ccc init` creates `.cocoindex_code/`; `ccc index` builds the vector store. |
| 4 | Optional: confirm `SPECKIT_RERANK_LAYER` unset (default-on). | Optional: confirm `_resolve_device()` picked `mps` on Apple Silicon via `ccc status`. |

No code changes. No schema migrations. A fresh clone reaches a ready state from the documented commands above.

### Swap flow (per MCP)

mk-spec-memory:

```text
1. embedder_list({})                          // confirm candidate is registered + ready
2. embedder_set({ name: "<candidate-name>" }) // returns job ID; runs async
3. (poll) embedder_status                     // watch active_embedder_name flip
4. memory_search probe                        // sanity-check a known-good query
```

mcp-coco-index:

```text
1. Look up the candidate in registered_embedders.py (or INSTALL_GUIDE §4 chooser table)
2. export COCOINDEX_CODE_EMBEDDING_MODEL=<sbert-string>
3. kill the ccc run-daemon process
4. ccc reset --force && ccc index
5. ccc search "<known-good query>"            // sanity check
```

The mk-spec-memory swap is single-MCP-call and crash-resumable. The CocoIndex swap is operator-driven and requires a daemon restart and explicit reset.

### Rollback flow (per MCP)

mk-spec-memory rollback is a same-shape `embedder_set` call that re-points active back to the prior embedder. The previous `vec_<dim>` table is preserved, so rollback is fast when same-to-same (the re-index orchestrator can short-circuit if the destination table already has fresh vectors for the current corpus). Eight rollbacks executed cleanly across ADR-001..ADR-008.

mcp-coco-index rollback is the same three-step swap pointed back to the previous `sbert/` string. `ccc reset --force && ccc index` will rebuild with the prior embedder. There is no automatic preservation of prior vectors — the index store is single-dim, so a full reindex is required.

### Device selection logic (CocoIndex only)

```text
COCOINDEX_CODE_DEVICE set?
├─ YES → trust as-is (operator override; no probe)
└─ NO  → import torch
         ├─ cuda available?   → "cuda"
         ├─ mps available?    → "mps"   (Apple Silicon)
         └─ else              → "cpu"
```

mk-spec-memory inherits device selection from the underlying backend. The `llama-cpp` baseline (gemma) uses the local llama-cpp configuration; `ollama` backends inherit Ollama's own device handling, which already covers Metal/CUDA/CPU autonomously. There is no equivalent `_resolve_device` shim on the memory side because Ollama owns the runtime.

---

## 5. OUT-OF-BOX SUPPORT MATRIX

The table below lists embedders that work in either MCP without any code changes. "Yes" means the registry already includes the candidate; "No (env-var only)" means the candidate works but is not in the curated chooser.

| Embedder | mk-spec-memory backend | mcp-coco-index backend | Dim | Approx RAM | MPS | Notes |
|---|---|---|---:|---:|:---:|---|
| `embeddinggemma-300m` | llama-cpp (baseline) | sbert (legacy baseline) | 768 | ~600 MB | Yes | General-text; baseline on both sides pre-swap. |
| `jina-embeddings-v3` | ollama (DEFAULT) | — (not in registry) | 1024 | ~600 MB (GGUF Q4_K_M) | n/a | Text-tuned; production memory default per ADR-012. |
| `jinaai/jina-embeddings-v2-base-code` | — (not in registry) | sbert (DEFAULT) | 768 | ~600 MB | Yes | Code-tuned, 8192 ctx; production CocoIndex default per 018 ADR-001. |
| `jinaai/jina-embeddings-v2-base-en` | — | sbert | 768 | ~600 MB | Yes | English-text variant for docs-heavy repos. |
| `nomic-embed-text-v1.5` | ollama | — | 768 | ~600 MB | n/a | Text retrieval specialist; 5–8/10 on 409 leaderboard. |
| `nomic-ai/CodeRankEmbed` | — | sbert | 768 | ~550 MB | Yes | Code-tuned alternative; Python-leaning training. |
| `BAAI/bge-code-v1` | — | sbert | 768 | ~700 MB | Yes | Multilingual code coverage emphasis. |
| `bge-small-en-v1.5` | ollama | — | 384 | small | n/a | Compact 33M-param text baseline; `vec_384` schema. |
| `bge-large-en-v1.5` | ollama | — | 1024 | ~1.5 GB | n/a | BAAI flagship text retrieval. |
| `bge-m3` | ollama | — | 1024 | ~1.5 GB | n/a | Multilingual hybrid (dense+sparse+colbert), 8192 ctx. |
| `mxbai-embed-large-v1` | ollama | — | 1024 | ~1 GB | n/a | AnglE-loss paraphrase-tuned. |
| `snowflake-arctic-embed-l-v2.0` | ollama | — | 1024 | ~1.5 GB | n/a | Snowflake late-2024 flagship; multilingual, 8192 ctx. |
| `Salesforce/SFR-Embedding-Code-2B_R` | — | sbert | 2048 | ~4.5 GB | Yes | Large (2B params), top CoIR; needs GPU/RAM headroom; `ccc reset` required (dim mismatch). |

Read across the row to see whether a given embedder is registered in each MCP. An empty cell means the candidate is not in that MCP's vetted registry — it may still work via the env-var override path on CocoIndex, but it would not be first-class without a registry row.

**Cross-listing is intentional, not a bug.** `jina-embeddings-v3` is text-tuned and lives only in the memory registry; `jina-embeddings-v2-base-code` is code-tuned and lives only in the CocoIndex registry. Sharing one embedder across both was rejected empirically (see §1).

---

## 6. TRADE-OFFS

### Per-category guidance (when to prefer text vs code embedders)

Choose text-tuned embedders when:
- Indexing prose: spec docs, decision records, meeting notes, conversation summaries.
- Queries are paraphrase-heavy ("how do we handle X" rather than literal symbol lookups).
- Multilingual or cross-domain recall matters.

Choose code-tuned embedders when:
- Indexing source: function bodies, identifiers, comments, type signatures.
- Queries are intent-based ("find the auth middleware") on real codebases.
- Per-language nuance matters (Python imports vs Go imports vs JS imports).

The split is not optional. Pre-018 measurements showed material code-recall loss when CocoIndex ran the general-text gemma model, and packet 018/001 swapped it out. Conversely, mk-spec-memory tested a code-tuned variant during 016/004 and it did not help prose recall.

### Size vs quality

Larger embedders trade RAM and disk for stronger recall on long-tail queries. Use the registry's `ram_mb` / `disk_mb` fields as your starting filter:

- **Small** (≤500 MB): `bge-small-en-v1.5` (384d). Fast indexing; weaker paraphrase capacity. Use only when you are RAM-bound.
- **Mid** (500 MB–1 GB): all current defaults plus most registered alternatives. Best general trade-off.
- **Large** (>1 GB): `bge-large-en-v1.5`, `bge-m3`, `snowflake-arctic-embed-l-v2.0`, `mxbai-embed-large-v1`. Pick one of these only after measuring on a fixture; empirically none beat the production defaults on the cat-24/409 sweep.
- **Very large** (>4 GB): `Salesforce/SFR-Embedding-Code-2B_R`. Only when you have GPU/RAM headroom and need maximum code retrieval quality.

### Latency vs recall

The rescue layer on the memory side is the clearest example of the trade. ADR-011 measured `+1` quality at `~2.16x` median latency. The verdict was GATE default-on with a documented kill switch. Embedder choice itself rarely produces latency that large; the dominant cost is the rescue stage when active. If you need to chase tail latency, the lever to pull first is `SPECKIT_RERANK_LAYER=false`, not the embedder.

On the CocoIndex side, latency is dominated by:
- First-token model load (cold start, ~1–3 s after daemon restart).
- Per-query embed cost (~30–100 ms on MPS; ~5x higher on CPU).
- sqlite-vec search itself (sub-100 ms on indexes up to ~50k snippets).

Switching from CPU to MPS via `_resolve_device()` is the single biggest latency win on Apple Silicon — that is why the 018 patch landed.

### A brief note on API-backed embedders

CocoIndex supports LiteLLM-backed embedders in principle (Voyage, OpenAI, Gemini, Cohere) via the `litellm/` prefix. These are out of scope for this document by policy: the project is local-only by default to avoid API-key management, billing, and offline-mode regressions. If you need an API-backed embedder, see `.opencode/skills/mcp-coco-index/references/settings_reference.md` for the LiteLLM configuration surface and treat it as an unsupported escape hatch.

---

## 7. APPENDIX: VALIDATED AGAINST

This document was authored against the following source files at the commits below. If the source files drift, this document needs updating.

| Source | Commit | Path |
|---|---|---|
| Memory adapter interface | `3d9e89d1f` | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/adapter.ts` |
| Memory MANIFESTS registry | `4a4e166ab` | `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts` |
| Memory ADR trail (001–012) | `1aa46e523` | Internal design notes |
| Memory ADR evidence | `1aa46e523` | (sibling) `evidence/embedder-comparison-with-rescue.jsonl` |
| CocoIndex `_DEFAULT_MODEL` + `_resolve_device` | `8f909d229` | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` |
| CocoIndex `registered_embedders.py` | `49e3338ff` | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py` |
| CocoIndex INSTALL_GUIDE §4 | `49e3338ff` | `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` |
| Packet 018 (CocoIndex code-embedder swap) | (parent) | Internal design notes |
| Packet 019 (CocoIndex registry parity) | (parent) | Internal design notes |

### Cross-links

- CocoIndex installer chooser table: [`.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md`](../../mcp-coco-index/INSTALL_GUIDE.md) §4 "Choosing an embedder"
- CocoIndex registry source: [`registered_embedders.py`](../../mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py)
- Memory ADR trail: [`decision-record.md`](../../../<spec-folder>)
- Memory registry source: [`registry.ts`](../mcp_server/lib/embedders/registry.ts)
- Memory adapter interface: [`adapter.ts`](../mcp_server/lib/embedders/adapter.ts)
