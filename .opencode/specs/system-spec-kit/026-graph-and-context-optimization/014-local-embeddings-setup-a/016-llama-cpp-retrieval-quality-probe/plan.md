---
title: "Implementation Plan: 016 llama-cpp retrieval quality probe"
description: "Methodology for sampling Memory MCP rows, embedding both provider spaces, computing retrieval metrics, and documenting the verdict."
trigger_phrases:
  - "016 retrieval probe plan"
  - "llama cpp retrieval methodology"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/016-llama-cpp-retrieval-quality-probe"
    last_updated_at: "2026-05-13T10:23:12Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Executed retrieval probe methodology"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "plan.md"
      - "scratch/probe-retrieval-quality.ts"
    session_dedup:
      fingerprint: "sha256:2160160160160160160160160160160160160160160160160160160160160160"
      session_id: "016-llama-cpp-retrieval-quality-probe-2026-05-13"
      parent_session_id: "016-llama-cpp-retrieval-quality-probe-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 016 llama-cpp retrieval quality probe

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript probe via `tsx` loader |
| **Data Source** | Existing Memory MCP sqlite DB opened read-only |
| **Providers** | `hf-local` and `llama-cpp` through `createEmbeddingsProvider()` |
| **Storage** | Packet-local `scratch/` artifacts only |
| **Validation** | Probe completion plus strict spec validation |

### Overview
Build a one-shot script that samples 200 indexed memories, derives 50 queries, embeds corpus and queries in each backend's own vector space, computes ranking agreement metrics, emits machine and human-readable results, then records the verdict in Level 1 packet docs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 folder pre-answered by orchestrator.
- [x] Existing DB path supplied and treated as read-only.
- [x] Provider files and factory surface inspected.
- [x] Prior 015 parity/latency numbers read for context.

### Definition of Done
- [x] `scratch/probe-corpus.json` contains 200 sampled docs.
- [x] `scratch/probe-queries.json` contains 50 Approach A derived queries.
- [x] `scratch/probe-embeddings.json` contains both providers' doc and query vectors.
- [x] `scratch/probe-results.json` contains metrics and verdict.
- [x] `scratch/probe-results.md` contains metrics plus five top-5 examples.
- [x] Packet docs and parent metadata validate strictly.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
The probe is an isolated packet-local harness. It imports the shared factory, asks for explicit `provider: "hf-local"` and `provider: "llama-cpp"`, and never touches production code or test surfaces.

### Key Components
- `sampleCorpus()` opens sqlite with `readonly: true` and samples active rows with `length(content_text) >= 50`.
- `buildQueries()` uses Approach A by deriving each query from the first one or two sentences of a sampled target document.
- `embedAll()` calls provider `embedDocument()` and `embedQuery()` to preserve provider-specific prefixes.
- `rankAll()` computes cosine similarity inside one backend vector space.
- Metric reducers compute recall overlap, Spearman rho, and MRR.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inspect and Sample
- Confirm sqlite schema and select `memory_index.content_text` as the content column.
- Join optional `memory_summaries.summary_text`.
- Generate corpus and query JSON artifacts.

### Phase 2: Embed and Score
- Create `hf-local` provider with `onnx-community/embeddinggemma-300m-ONNX`, `dim=768`, `dtype=q8`.
- Create `llama-cpp` provider with `unsloth/embeddinggemma-300m-GGUF`, `dim=768`.
- Use the same `maxTextLength=700` for both providers to fit llama-cpp's embedding context fairly.
- Score each query against the same corpus within each backend.

### Phase 3: Report and Validate
- Write `probe-results.json` and `probe-results.md`.
- Fill Level 1 docs and metadata from actual results.
- Update parent graph metadata.
- Run strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Probe run | Full sample/embed/score/report path | `node --import ...tsx... scratch/probe-retrieval-quality.ts` |
| Artifact check | Result JSON/Markdown and generated corpus/query files | `cat`, `sed`, `du` |
| Metadata validation | Packet docs and graph metadata | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |

Metric thresholds:
- `EQUIVALENT`: recall overlap `>=0.80`, Spearman `>=0.85`, MRR delta `<0.05`.
- `MILD_DIVERGENCE`: recall overlap `>=0.65`, Spearman `>=0.70`.
- `REAL_DIVERGENCE`: anything below mild thresholds.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Memory MCP sqlite DB | Data | Available read-only | No corpus sample |
| `@huggingface/transformers` | Runtime | Available | hf-local cannot embed |
| `node-llama-cpp` | Runtime | Available | llama-cpp cannot embed |
| Q8_0 GGUF model | Runtime | Available at packet 015 path | llama-cpp cannot embed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No production rollback is needed because the probe only writes packet-local artifacts and allowed parent metadata. Remove this packet folder and its parent child registration if the probe must be discarded.
<!-- /ANCHOR:rollback -->
