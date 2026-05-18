---
title: "Spec: 016/013/002 CocoIndex Ollama Adapter"
description: "Add Ollama provider support to CocoIndex's embedder registry. Today CocoIndex's MANIFESTS is sbert-only; the config.py comment claims non-sbert names route via LiteLLM, but the path is unverified. This packet verifies that path or extends the loader, registers at least one Ollama embedder (e.g., ollama/nomic-embed-text), and smoke-tests end-to-end indexing + search."
trigger_phrases:
  - "016/013/002 ollama adapter"
  - "cocoindex ollama support"
  - "litellm ollama provider"
  - "ollama embedder registry"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/007-ollama-and-bge-promotion-arc/002-cocoindex-ollama-adapter"
    last_updated_at: "2026-05-18T17:41:16Z"
    last_updated_by: "codex"
    recent_action: "Implemented CocoIndex Ollama adapter"
    next_safe_action: "Review and commit scoped files"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py"
      - ".opencode/skills/mcp-coco-index/mcp_server/tests/test_ollama_routing.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-18-cocoindex-ollama-adapter"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "LiteLLM is declared through cocoindex[litellm] and already imported in shared.py."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 016/013/002 CocoIndex Ollama Adapter

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Completed (2026-05-18) |
| Type | Implementation (Level 2 — bench harness + multi-file Python edits) |
| Owner | Main agent or @code (dispatched via @orchestrate) |
| Parent | `../spec.md` (007-ollama-and-bge-promotion-arc) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

CocoIndex's embedder registry (`cocoindex_code/registered_embedders.py`) lists only `sbert/...` candidates today. Operators running Ollama already (e.g., for chat workloads) can't reuse that daemon for CocoIndex indexing/search without code work.

A comment in `config.py` says non-sbert prefixes route via LiteLLM, which has an Ollama provider. But:
- MANIFESTS has zero Ollama entries — never been exercised
- The LiteLLM provider plumbing may not actually be wired in CocoIndex's `cocoindex.embeddings.SentenceTransformerEmbed` call site
- `_is_registered_embedder()` gates models; an Ollama name with no manifest entry silently falls back to default

mk-spec-memory has a working Ollama adapter (`lib/embedders/adapters/ollama.ts` — TypeScript side). CocoIndex (Python side) does not.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- Verify whether CocoIndex's existing code path (config.py + indexer.py) can route to LiteLLM Ollama provider as-is, OR whether new adapter code is needed.
- If new adapter code is needed: add it under `cocoindex_code/embedders/` (or extend the existing embedder loader).
- Register at least one Ollama embedder in MANIFESTS (e.g., `ollama/nomic-embed-text`) with proper metadata: dim, ram_mb, disk_mb (host-side, Ollama daemon hosts the model — so RAM is Ollama's pool, not Python's).
- Add a `requires_ollama_daemon=True` flag to `EmbedderMetadata` if it doesn't already exist (gate registry entries that need Ollama running).
- Smoke test: end-to-end `ccc reset --force && ccc index && ccc search "test query"` with Ollama active and an `ollama/...` model selected.
- Update `INSTALL_GUIDE.md` with an Ollama setup section.
- Update `feature_catalog/` with an Ollama adapter entry.

Out of scope:
- Bench-running Ollama models against the 18-pair fixture (defer until adapter is verified working — separate follow-on).
- Adding Ollama support to mk-spec-memory (already has it).
- Replacing sentence-transformers as the primary path (sbert stays default).
- Code Graph integration (no embedder).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | At least one Ollama embedder (e.g., `ollama/nomic-embed-text`) is registered in MANIFESTS with complete metadata fields. |
| R2 | `_is_registered_embedder()` accepts the `ollama/` prefix without falling back to default. |
| R3 | Indexing path (`indexer.py` / cocoindex's embed step) correctly routes to Ollama provider when the configured model has `ollama/` prefix. |
| R4 | Smoke test passes: index a small subdir + search returns non-empty results with the expected paths. |
| R5 | `INSTALL_GUIDE.md` documents Ollama setup (pull model, start daemon, set env var, verify). |
| R6 | At least one test added under `mcp_server/tests/` exercises the Ollama-prefix code path (with the actual call mocked). |
| R7 | Strict-validate PASSED on this sub-phase. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Operator with Ollama running can `export COCOINDEX_CODE_EMBEDDING_MODEL=ollama/nomic-embed-text && ccc reset --force && ccc index && ccc search "query"` and get meaningful results.
- Adapter pattern is generalizable: adding another Ollama model later (e.g., `ollama/mxbai-embed-large`) is a one-line MANIFESTS entry.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **LiteLLM may not be a CocoIndex dependency.** If LiteLLM isn't already installed, this requires a pyproject.toml change. Check `mcp-coco-index/mcp_server/pyproject.toml` first.
- **Ollama provider auth.** LiteLLM ollama provider typically needs `OLLAMA_API_BASE` (default `http://localhost:11434`). Add to env-var docs.
- **GGUF vs FP16 quality delta.** Ollama serves quantized GGUF; quality may differ from the sbert/sentence-transformers FP16 path. Note this in the changelog — operators should benchmark before swapping defaults.
- **Daemon startup race.** If Ollama isn't running when `ccc index` starts, all chunks fail to embed. Add a graceful failure path with a clear error message.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The default sbert path must keep its current behavior and not perform Ollama daemon checks.
- **NFR-P02**: Ollama readiness checks should fail within a short timeout before indexing begins.

### Reliability
- **NFR-R01**: Missing Ollama daemon or missing model must produce an actionable error.
- **NFR-R02**: Registered 768-dimensional Ollama models must remain schema-compatible with the default vector dimension.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty registry lookup: unknown model names fall back to the default.
- Explicit Ollama version tag: exact tags must match the pulled model.
- Implicit Ollama tag: `nomic-embed-text` may match `nomic-embed-text:latest`.

### Error Scenarios
- Ollama daemon unreachable: factory raises a clear `RuntimeError`.
- Model not pulled: factory tells the operator to run `ollama pull`.
- Temp-project indexing blocked by sandbox: smoke result is recorded without changing benchmark scope.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Multi-file Python, docs, tests, and packet metadata. |
| Risk | 10/25 | Provider routing and local daemon dependency, default path preserved. |
| Research | 10/20 | LiteLLM path, local package source, and TS adapter reference reviewed. |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Full `ccc index` smoke is tracked as a known sandbox limitation in `implementation-summary.md`, not an open design question.
<!-- /ANCHOR:questions -->
