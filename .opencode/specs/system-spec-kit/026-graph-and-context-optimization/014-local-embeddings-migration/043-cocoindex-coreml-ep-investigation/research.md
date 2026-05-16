---
title: "Feature Research: CocoIndex CoreML EP Investigation"
description: "Research findings on CocoIndex's current embedding backend, ONNX Runtime CoreML provider availability, and search latency baseline."
trigger_phrases:
  - "cocoindex coreml"
  - "onnxruntime execution provider"
  - "sentence-transformers backend"
importance_tier: "important"
contextType: "general"
---
# Feature Research: CocoIndex CoreML EP Investigation

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Research ID**: RESEARCH-043
- **Feature/Spec**: `043-cocoindex-coreml-ep-investigation`
- **Status**: Complete
- **Date Started**: 2026-05-14
- **Date Completed**: 2026-05-14
- **Researcher(s)**: Codex GPT-5.5
- **Reviewers**: Pending maintainer review
- **Last Updated**: 2026-05-14

**Related Documents**:
- Spec: `spec.md`
- ADR: `decision-record.md`
- Evidence: `scratch/`
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:file-organization -->
## FILE ORGANIZATION

- Research findings: `research.md`
- Decision: `decision-record.md`
- Raw command output: `scratch/*.txt`
- Packet summary: `implementation-summary.md`
<!-- /ANCHOR:file-organization -->

---

<!-- ANCHOR:investigation-report -->
## 2. INVESTIGATION REPORT

### Request Summary

The user asked whether CocoIndex can use Apple acceleration the way llama-cpp can use Metal. The specific investigation was whether ONNX Runtime's CoreML Execution Provider is installed, whether CocoIndex uses it, and what path would enable it without changing source in this packet.

### Current Behavior

CoreML EP is bundled in the installed ONNX Runtime package, but CocoIndex does not currently use ONNX Runtime for embeddings. The fork builds `SentenceTransformerEmbedder(model_name, device=settings.device, trust_remote_code=True)` in `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py`, and the installed CocoIndex package then calls `SentenceTransformer(..., device=..., trust_remote_code=...)` without `backend="onnx"` or `model_kwargs={"provider": ...}`.

The current environment also reports Torch MPS as built but unavailable. `sentence_transformers.util.get_device_name()` returns `cpu`, so the measured query path is CPU in this session.

### Key Findings

1. **CoreML EP is bundled**: `onnxruntime==1.26.0` reports `['CoreMLExecutionProvider', 'AzureExecutionProvider', 'CPUExecutionProvider']`.
2. **CoreML EP is not in use**: CocoIndex fork source has no `InferenceSession`, no provider list, and no CoreML/CPU provider configuration.
3. **The active embedder path is Torch, not ONNX**: `SentenceTransformer` supports `backend="torch" | "onnx" | "openvino"`, but the wrapper does not pass a backend. The default is Torch.
4. **ONNX backend prerequisites are incomplete**: `optimum`, `onnx`, and `coremltools` are not installed in the venv. `onnxruntime` alone is present.
5. **Warm query latency is already low**: The in-process query probe measured 3850.9 ms cold, then 80.4 ms and 79.5 ms warm. The three-trial average is 1337.0 ms and median is 80.4 ms.

### Recommendations

**Primary Recommendation**:
- Choose Option C from the ADR: defer CoreML adoption until CocoIndex search or reindexing becomes a measured bottleneck. Current warm query latency is about 80 ms, and enabling CoreML is not a one-line provider-list change in this fork.

**Alternative Approaches**:
- Source patch: expose `backend="onnx"` and ONNX provider settings through CocoIndex settings, then test `CoreMLExecutionProvider`.
- Package mutation: add ONNX backend dependencies, likely `optimum` and `onnx`, then rerun search/reindex benchmarks.
- Architecture change: evaluate Apple-native embedding stacks only if CocoIndex's current architecture becomes limiting.
<!-- /ANCHOR:investigation-report -->

---

<!-- ANCHOR:executive-overview -->
## 3. EXECUTIVE OVERVIEW

### Executive Summary

CocoIndex can theoretically reach Apple acceleration through either PyTorch MPS or ONNX Runtime CoreML EP, but this installation currently uses neither path in the measured environment. ONNX Runtime lists CoreML EP as available, yet the CocoIndex embedding stack never constructs an ONNX Runtime session.

The shortest correct answer is: CoreML EP is bundled, but CocoIndex is not using it today. The practical answer is more cautious: enabling it requires a real CocoIndex/Sentence Transformers backend configuration change plus missing ONNX backend dependencies, and warm query latency is already about 80 ms.

### Architecture Diagram

```text
ccc / daemon
  |
  v
cocoindex_code.shared.create_embedder()
  |
  v
cocoindex.ops.sentence_transformers.SentenceTransformerEmbedder
  |
  v
SentenceTransformer(..., backend default "torch")
  |
  v
Torch CPU in this session

ONNX Runtime CoreML EP exists in venv, but this path does not call it.
```

### Quick Reference Guide

**When to use this approach**:
- Use this packet before changing CocoIndex acceleration code.
- Use the warm latency numbers as the baseline for a future source packet.

**When NOT to use this approach**:
- Do not treat `onnxruntime.get_available_providers()` as proof that CocoIndex uses ONNX Runtime.
- Do not install `onnxruntime-silicon`; this venv already exposes `CoreMLExecutionProvider` through `onnxruntime==1.26.0`.

**Key considerations**:
- `COCOINDEX_CODE_DEVICE` controls the Torch device setting, not ONNX Runtime providers.
- `opencode.json` registers CocoIndex with `COCOINDEX_CODE_ROOT_PATH=.` and describes the default embedding as `sentence-transformers`; it does not configure EP behavior.
- `.utcp_config.json`, `.gemini/.utcp_config.json`, and `.claude/.utcp_config.json` do not contain CocoIndex EP configuration.

### Research Sources

| Source Type | Description | Link/Reference | Credibility |
|-------------|-------------|----------------|-------------|
| Runtime probe | ONNX Runtime providers and package versions | `scratch/step1-venv-inventory.txt` | High |
| Source inspection | CocoIndex embedder factory | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | High |
| Dependency source | Installed `SentenceTransformerEmbedder` wrapper | `.venv/lib/python3.11/site-packages/cocoindex/ops/sentence_transformers.py` | High |
| Runtime probe | Torch MPS, backend signatures, missing packages | `scratch/step3-gap-probes.txt` | High |
| Baseline probe | Three-trial search query latency | `scratch/step4-search-baseline.txt` | High |
<!-- /ANCHOR:executive-overview -->

---

<!-- ANCHOR:core-architecture -->
## 4. CORE ARCHITECTURE

### System Components

#### Component 1: CocoIndex CLI and Daemon
**Purpose**: Provides `ccc search`, MCP server mode, daemon lifecycle, and project query dispatch.

**Responsibilities**:
- Resolve project root and settings.
- Hold a reusable embedder for daemon-backed queries.
- Query the existing SQLite vector index.

**Key APIs/Interfaces**:
```python
client.search(project_root=project_root, query=query, limit=limit)
```

#### Component 2: CocoIndex Embedder Factory
**Purpose**: Builds the local embedder from `EmbeddingSettings`.

**Responsibilities**:
- Select `sentence-transformers` or LiteLLM provider.
- Strip the legacy `sbert/` prefix.
- Pass `device=settings.device` to `SentenceTransformerEmbedder`.

**Key APIs/Interfaces**:
```python
SentenceTransformerEmbedder(model_name, device=settings.device, trust_remote_code=True)
```

#### Component 3: Sentence Transformers Backend
**Purpose**: Loads the actual model and computes embeddings.

**Responsibilities**:
- Default to the Torch backend.
- Optionally support ONNX when loaded with `backend="onnx"` and appropriate model kwargs.
- Select auto device when `device=None`.

### Data Flow

```text
query text
  -> embedder.embed(query)
  -> SentenceTransformer.encode(...)
  -> query embedding bytes
  -> sqlite-vec KNN lookup
  -> reranked results
```

**Flow Steps**:
1. The CLI or in-process probe sends a text query.
2. The embedder produces a query vector with the current backend.
3. SQLite vector search retrieves nearest chunks.
4. CocoIndex deduplicates and reranks results.

### Integration Points

**External Systems**:
- **ONNX Runtime**: Present, but not used by current embedder path.
- **Torch**: Active backend for `SentenceTransformer` in this installation.

**Internal Modules**:
- **`settings.py`**: Stores provider/model/device only.
- **`shared.py`**: Builds the embedder.
- **`query.py`**: Embeds query text and performs vector lookup.

### Dependencies

| Dependency | Version | Purpose | Critical? | Alternative |
|------------|---------|---------|-----------|-------------|
| `onnxruntime` | 1.26.0 | Potential ONNX Runtime provider stack | No for current path | Torch backend |
| `sentence-transformers` | 5.4.1 | Active local embedding API | Yes | LiteLLM provider |
| `torch` | 2.11.0 | Active model backend | Yes | ONNX backend via Optimum |
| `optimum` | Missing | Required by Sentence Transformers ONNX loader | Yes for ONNX adoption | Stay on Torch |
| `onnx` | Missing | ONNX model/export support | Yes for ONNX adoption | Stay on Torch |
<!-- /ANCHOR:core-architecture -->

---

## 5. HYPOTHESIS MATRIX

| Hypothesis | Evidence For | Evidence Against | Verdict |
|------------|--------------|------------------|---------|
| H1: CoreML EP is bundled and in providers list, so CocoIndex already uses Metal/ANE. | `onnxruntime.get_available_providers()` lists `CoreMLExecutionProvider`. | CocoIndex never constructs an ONNX Runtime session and uses the default Torch backend. | Rejected. |
| H2: CoreML EP is bundled but not in the providers list at the call site. | CoreML EP is bundled. | There is no providers-list call site in the fork. | Partially true but not actionable as written. |
| H3: CoreML EP is not bundled and CPU-only ONNX Runtime is installed. | None. | Runtime provider list includes `CoreMLExecutionProvider`. | Rejected. |
| H4: CocoIndex does not expose configurable ONNX providers and needs an upstream/source patch or equivalent configuration. | `SentenceTransformerEmbedder` exposes only `device` and `trust_remote_code`; `SentenceTransformer` default backend is Torch; ONNX prerequisites are missing. | CoreML EP is available if a future ONNX path is wired. | Leading hypothesis. |

## 6. BASELINE PERFORMANCE

| Trial | Latency | Notes |
|-------|---------|-------|
| 1 | 3850.9 ms | Cold model load, one result. |
| 2 | 80.4 ms | Warm query. |
| 3 | 79.5 ms | Warm query. |
| Average | 1337.0 ms | Includes cold load. |
| Median | 80.4 ms | Better representation of warm query-time search. |

The direct `ccc status` path failed with `Operation not permitted` on `~/.cocoindex_code/daemon.spawn-lock`. The baseline therefore used the same `query_codebase()` implementation in-process, avoiding daemon startup and process management.

## 7. PATH COMPARISON

| Path | Change Cost | Benefit | Risk | Recommendation |
|------|-------------|---------|------|----------------|
| Enable CoreML EP at call site | Medium | Could accelerate embeddings if ONNX backend works. | No current `InferenceSession` call site; requires source patch. | Do later only with benchmark need. |
| Enable CoreML EP at install level | Medium | Ensures provider availability. | Already bundled; missing pieces are ONNX/Optimum and backend config. | Not enough by itself. |
| Leave as-is | Low | Keeps current stable search behavior. | Misses possible indexing acceleration. | Recommended now. |
| Switch to MLX/native Apple embeddings | High | Potential best Apple Silicon fit. | Larger architecture and quality migration. | Not justified by current evidence. |
