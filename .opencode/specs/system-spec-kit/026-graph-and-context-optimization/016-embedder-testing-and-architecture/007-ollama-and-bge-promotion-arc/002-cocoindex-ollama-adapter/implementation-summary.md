---
title: "Implementation Summary: CocoIndex Ollama Adapter"
description: "CocoIndex now has a registered Ollama embedder path backed by LiteLLM, with daemon readiness checks, mocked route tests, and operator setup docs."
trigger_phrases:
  - "cocoindex ollama adapter implementation"
  - "ollama embedder registry summary"
  - "litellm ollama handoff"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/002-cocoindex-ollama-adapter"
    last_updated_at: "2026-05-18T17:41:16Z"
    last_updated_by: "codex"
    recent_action: "Completed CocoIndex Ollama adapter"
    next_safe_action: "Review scoped diff and commit handoff paths"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_ollama_routing.py"
      - ".opencode/skills/mcp-coco-index/INSTALL_GUIDE.md"
    session_dedup:
      fingerprint: "sha256:4444444444444444444444444444444444444444444444444444444444444444"
      session_id: "codex-2026-05-18-cocoindex-ollama-adapter"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "LiteLLM path exists through cocoindex[litellm] and shared.py's LiteLLMEmbedder branch."
      - "Direct LiteLLM Ollama embedding returned a 768-dimensional vector."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/002-cocoindex-ollama-adapter/` |
| **Completed** | 2026-05-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

CocoIndex now has a real Ollama entry point instead of a comment-level promise. `ollama/nomic-embed-text` is registered in the Python embedder manifest, config accepts it through the same registry gate as existing models, and the runtime factory routes it through CocoIndex's existing LiteLLM embedder path after checking the local Ollama daemon.

### LiteLLM Ollama Path Verification

The first finding: LiteLLM was already present through `cocoindex[litellm]==1.0.0a33`, and `shared.py` already had a `LiteLLMEmbedder` branch for non-`sentence-transformers` providers. The missing pieces were registry admission, an Ollama manifest, and a clear readiness gate before indexing.

### Ollama Registry And Runtime Gate

`EmbedderMetadata` now carries `requires_ollama_daemon`, defaulting to `False` for existing sbert entries. The Ollama manifest uses `ollama/nomic-embed-text`, `dim=768`, `disk_mb=270`, `mps_compatible=True`, `category="text"`, and `requires_ollama_daemon=True`.

`shared.py` now checks `OLLAMA_API_BASE` or `http://localhost:11434`, reads `/api/tags`, accepts implicit `:latest` tags, and raises an actionable error when the daemon or model is missing. After that gate, it constructs `LiteLLMEmbedder(settings.model, api_base=...)`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py` | Modified | Add daemon metadata and register `ollama/nomic-embed-text`. |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Modified | Add Ollama daemon/model readiness checks and pass `api_base` into LiteLLM. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_ollama_routing.py` | Created | Mock `litellm.aembedding` and exercise the Ollama-prefix route. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_registered_embedders.py` | Modified | Accept the `ollama/` prefix and assert Ollama metadata. |
| `.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py` | Modified | Assert registered Ollama model names do not fall back to default. |
| `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` | Modified | Add "Using Ollama" setup commands and registry table row. |
| `.opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md` | Modified | Add the Ollama adapter to the indexing pipeline inventory. |
| `.opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/04-embedding-provider-selection.md` | Modified | Document Ollama as a LiteLLM-backed provider-selection variant. |
| `.opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/07-ollama-embedding-adapter.md` | Created | Add a dedicated feature catalog entry. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/002-cocoindex-ollama-adapter/plan.md` | Created | Complete Level 2 packet docs for strict validation. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/002-cocoindex-ollama-adapter/tasks.md` | Created | Track completed work and verification tasks. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/002-cocoindex-ollama-adapter/checklist.md` | Created | Record verification checklist evidence. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/002-cocoindex-ollama-adapter/spec.md` | Modified | Mark packet complete and add continuity metadata. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/002-cocoindex-ollama-adapter/implementation-summary.md` | Created | Capture implementation, smoke result, and commit handoff. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change reused CocoIndex's existing LiteLLM abstraction instead of adding a new embedder backend. That keeps the default sbert path untouched while making Ollama a manifest-level provider option with a narrow runtime preflight.

Commit handoff path list:

```text
.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py
.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py
.opencode/skills/mcp-coco-index/mcp_server/tests/test_ollama_routing.py
.opencode/skills/mcp-coco-index/mcp_server/tests/test_registered_embedders.py
.opencode/skills/mcp-coco-index/mcp_server/tests/test_config.py
.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md
.opencode/skills/mcp-coco-index/feature_catalog/feature_catalog.md
.opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/04-embedding-provider-selection.md
.opencode/skills/mcp-coco-index/feature_catalog/03--indexing-pipeline/07-ollama-embedding-adapter.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/002-cocoindex-ollama-adapter/spec.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/002-cocoindex-ollama-adapter/plan.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/002-cocoindex-ollama-adapter/tasks.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/002-cocoindex-ollama-adapter/checklist.md
.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/002-cocoindex-ollama-adapter/implementation-summary.md
```
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `LiteLLMEmbedder` for Ollama | CocoIndex already imports and constructs this embedder for non-sentence-transformer providers, so a separate adapter would duplicate provider logic. |
| Gate with `/api/tags` | The TS adapter uses model-readiness semantics, and this gives operators a clear failure before a long indexing run starts. |
| Register `nomic-embed-text` as text-tuned | It is not a code model, but it is a common Ollama embedding starter and keeps the first Ollama candidate dimension-compatible with the 768d default schema. |
| Keep existing sbert defaults unchanged | This packet adds operator choice without changing production default retrieval behavior. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `from cocoindex.ops.litellm import LiteLLMEmbedder` and signature inspection | PASS. Existing venv imports `LiteLLMEmbedder(model: str, **kwargs)` and `embed(text, input_type=None)`. |
| `import litellm; hasattr(litellm, "embedding")` | PASS. LiteLLM is installed through the existing dependency path. |
| `.venv/bin/python -m pytest tests/test_ollama_routing.py tests/test_registered_embedders.py tests/test_config.py` | PASS. 37 passed. |
| `.venv/bin/python -m ruff check cocoindex_code/registered_embedders.py cocoindex_code/shared.py tests/test_ollama_routing.py tests/test_registered_embedders.py tests/test_config.py` | PASS. |
| `.venv/bin/python -m compileall -q ...` | PASS. |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/mcp-coco-index` | PASS with 24 pre-existing warnings, no errors. |
| `curl http://localhost:11434/api/tags` | PASS. Ollama reachable and `nomic-embed-text:latest` plus `nomic-embed-text:v1.5` were present. |
| Direct LiteLLM smoke: `litellm.aembedding(model="ollama/nomic-embed-text", input=["CocoIndex Ollama smoke check"], api_base="http://localhost:11434")` | PASS. Returned `dim=768`. |
| Isolated temp-project `ccc init && ccc reset && ccc index && ccc search` with `COCOINDEX_CODE_DIR=/private/tmp/...` | FAIL. `ccc index` returned `Daemon error: Operation not permitted (os error 1)` before search. Daemon was stopped and the failure is recorded as an environment-level full smoke blocker. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict --verbose` | PASS. 0 errors, 0 warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full `ccc index` smoke blocked in this sandbox.** The isolated temp-project run failed with `Operation not permitted (os error 1)` from the CocoIndex daemon. The direct LiteLLM Ollama call works and unit coverage exercises the route, but a clean local end-to-end smoke should be rerun outside this sandbox before broad rollout.
2. **`ollama/nomic-embed-text` is text-tuned.** It gives Ollama users an immediate local path, but it should be benchmarked against code-tuned defaults before becoming a recommended replacement.
<!-- /ANCHOR:limitations -->
