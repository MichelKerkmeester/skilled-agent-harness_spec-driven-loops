---
title: "Implementation Plan: CocoIndex CoreML EP Investigation"
description: "Research plan for verifying CocoIndex's embedding backend, ONNX Runtime provider availability, and the cost of enabling CoreML EP."
trigger_phrases:
  - "cocoindex coreml"
  - "onnxruntime execution provider"
  - "search latency baseline"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/043-cocoindex-coreml-ep-investigation"
    last_updated_at: "2026-05-14T16:20:00Z"
    last_updated_by: "codex-gpt5.5"
    recent_action: "Planned EP investigation"
    next_safe_action: "Use ADR before source work"
    blockers: []
    key_files:
      - "research.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:a33bb4bef5fdfd3569505047c40304469c1099e70a4a2cff89280ce49f3cfab7"
      session_id: "cli-codex-gpt5.5-xhigh-fast-043"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: CocoIndex CoreML EP Investigation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11, CocoIndex Code, `sentence-transformers`, ONNX Runtime |
| **Framework** | CocoIndex daemon and CLI package under `.opencode/skills/mcp-coco-index/mcp_server/` |
| **Storage** | Existing `.cocoindex_code/target_sqlite.db` vector store |
| **Testing** | Read-only Python probes, grep/source inspection, strict spec validation |

### Overview
This packet investigates acceleration state only. It inventories the installed venv, traces CocoIndex embedder construction, measures one query path, and records an ADR without changing CocoIndex source or package dependencies.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 folder pre-answered as the `043` packet.
- [x] Pre-check confirms no `043-` collision and no reserved `042-` collision.
- [x] Forbidden surfaces are understood: no mcp-coco-index source edits, no system-code-graph edits, no branch switch.

### Definition of Done
- [x] Venv and provider inventory captured in packet scratch evidence.
- [x] Source call sites for embedder creation documented.
- [x] Search latency baseline captured without killing daemon processes.
- [x] `research.md` and `decision-record.md` authored.
- [x] Strict spec validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Research-only evidence packet.

### Key Components
- **CocoIndex fork**: Owns CLI, daemon, settings, and embedder factory code.
- **CocoIndex package embedder**: Wraps `sentence-transformers` and lazy-loads the model.
- **Sentence Transformers**: Defaults to the Torch backend unless `backend="onnx"` is passed.
- **ONNX Runtime**: Installed with `CoreMLExecutionProvider` available, but not reached by the current embedder path.

### Data Flow
`ccc search` normally connects to a daemon, which owns an embedder and queries `target_sqlite.db`. The sandbox blocked the daemon lock path, so the baseline used the same `query_codebase()` function in-process with the existing SQLite index.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Builds `SentenceTransformerEmbedder` from settings. | Read-only inspection. | `scratch/step2-ep-config-search.txt` and source lines 86-104. |
| `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/ops/sentence_transformers.py` | Lazy-loads `SentenceTransformer`. | Read-only inspection. | Source lines 109-121 show no backend/provider arguments. |
| `.opencode/skills/mcp-coco-index/mcp_server/.venv/` | Runtime package state. | Read-only introspection. | `scratch/step1-venv-inventory.txt` and `scratch/step3-gap-probes.txt`. |
| `.cocoindex_code/target_sqlite.db` | Existing vector search index. | Read-only query probe. | `scratch/step4-search-baseline.txt`. |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Run parent collision pre-checks for `043` and reserved `042`.
- [x] Scaffold the L1 packet under the approved path.
- [x] Preserve raw probe output in packet scratch files.

### Phase 2: Core Implementation
- [x] Inventory `onnxruntime`, provider list, platform, and package state.
- [x] Locate CocoIndex embedder construction and prove whether ONNX providers are configured.
- [x] Probe Torch/MPS and Sentence Transformers backend/device behavior.
- [x] Measure current search latency.

### Phase 3: Verification
- [x] Write research findings and hypothesis matrix.
- [x] Write ADR with options A-D and one recommendation.
- [x] Run strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Runtime inventory | Installed EP/package/device state | `.venv/bin/python`, `pip show`, `onnxruntime.get_available_providers()` |
| Source inspection | Backend and provider call sites | `rg`, `nl`, `inspect.signature()` |
| Baseline probe | Single semantic search query, 3 trials | In-process `query_codebase()` equivalent to avoid daemon lock mutation |
| Spec validation | Packet structure and metadata | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <043-path> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `onnxruntime==1.26.0` | Local package | Green | Provider availability can be inspected. |
| `sentence-transformers==5.4.1` | Local package | Green | Backend/device signatures can be inspected. |
| `optimum` and `onnx` | Local packages | Missing | ONNX backend adoption would need package work before CoreML can be tried through Sentence Transformers. |
| `~/.cocoindex_code/daemon.spawn-lock` | Sandbox-visible lock | Red for CLI daemon | Use in-process query equivalent; do not kill or modify live daemon processes. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The packet contains incorrect evidence, invalid spec structure, or accidentally stages files outside `043`.
- **Procedure**: Remove or correct only files under the `043-cocoindex-coreml-ep-investigation` folder and rerun strict validation before staging.
<!-- /ANCHOR:rollback -->
