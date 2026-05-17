---
title: "Spec: 018/001 CocoIndex embedder swap to jina-code"
description: "Swap CocoIndex default embedder from gemma to nomic-ai/jina-code + MPS auto-detect patch"
trigger_phrases:
  - "018/001 cocoindex swap"
  - "jina-code activation"
  - "MPS auto-detect patch"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/018-code-embedder-coderank/001-cocoindex-swap"
    last_updated_at: "2026-05-17T18:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded swap implementation packet"
    next_safe_action: "Implement env-var contract + MPS auto-detect + reindex"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000018001"
      session_id: "018-001-cocoindex-swap"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 018/001 CocoIndex embedder swap to jina-code

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Planned |
| Level | 1 |
| Owner | main agent |
| Depends on | 018 parent spec.md §1 OVERVIEW |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

CocoIndex's `_DEFAULT_MODEL = "sbert/google/embeddinggemma-300m"` is a general-text embedder. Code search benefits from code-tuned embedders; gemma may be leaving recall on the table. CocoIndex's device auto-detection only covers CUDA — Mac users get CPU inference even when Metal is available.

Purpose: swap to a code-tuned embedder and unlock Apple Silicon acceleration without operator env-var setup.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope:
- Edit `cocoindex_code/config.py`: change `_DEFAULT_MODEL` to `sbert/jinaai/jina-embeddings-v2-base-code`
- Add MPS branch to device resolution (CUDA → MPS → CPU fallback chain)
- Add vitest assertion covering the MPS auto-detect branch
- Document reindex runbook for the operator

Out of scope:
- Fixture authoring (018/002)
- Benchmark + ADR-001 ratification (018/003)
- Alternative code-tuned embedders (jina-code, bge-code) — only enabled by env-var override
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| # | Requirement |
|---|---|
| R1 | `_DEFAULT_MODEL` defaults to jina-code when no env var set |
| R2 | `COCOINDEX_CODE_EMBEDDING_MODEL` env var continues to override default |
| R3 | Device resolution returns `"mps"` when `torch.backends.mps.is_available()` on Apple Silicon |
| R4 | `COCOINDEX_CODE_DEVICE=cpu` continues to force CPU as fallback |
| R5 | Reindex completes without errors after the swap |
| R6 | Code Graph's CocoIndex bridge continues to function post-swap |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 6 requirements met
- Reindex wall-clock + disk size captured in `evidence/swap-runbook.md`
- Smoke tests pass for both CocoIndex search and Code Graph context
- Strict-validate on this packet returns PASSED
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Risks:
- **jina-code first-time download (~270MB)** adds latency on cold start; document in runbook
- **MPS bug in older PyTorch versions** — we're on 2.11.0 (clean); `COCOINDEX_CODE_DEVICE=cpu` is the kill switch
- **Reindex cost** — repository-size dependent; operator must accept the one-time cold-start hit

Dependencies:
- Sentence-transformers library (already in venv)
- PyTorch 2.11.0 with MPS support (already in venv)
- 018/002 + 018/003 depend on this child shipping first
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None currently — open as discovered during implementation.
<!-- /ANCHOR:questions -->
