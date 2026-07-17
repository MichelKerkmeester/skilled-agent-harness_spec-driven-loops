---
title: "Feature Specification: Phase 2: model-installation-and-compat"
description: "Pre-download Setup A models (EmbeddingGemma-300m for code via sentence-transformers; EmbeddingGemma-300m via the ONNX-community port for transformers.js). Risk-gate transformers.js × Gemma3 ST-config compatibility before the live MCP swap."
trigger_phrases:
  - "002 model installation"
  - "EmbeddingGemma-300m download"
  - "EmbeddingGemma download"
  - "transformers.js gemma"
  - "onnx-community/embeddinggemma-300m-ONNX"
  - "huggingface gated repo"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/002-model-installation-and-compat"
    last_updated_at: "2026-05-12T19:25:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Models downloaded; both smoke tests green"
    next_safe_action: "Proceed to sub-phase 003 (MCP config rollout)"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "scratch/test-embeddinggemma.py"
      - "scratch/test-embeddinggemma.mjs"
    session_dedup:
      fingerprint: "sha256:01400290deba0000000000000000000000000000000000000000000000000002"
      session_id: "014-002-model-install-2026-05-12"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2 — Model Installation & Compatibility

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 8 |
| **Predecessor** | 001-prefix-registry-architecture |
| **Successor** | 003-mcp-config-rollout |
| **Handoff Criteria** | Both models on disk, both smoke tests green, fallback path documented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Phase 2** of `014-local-embeddings-setup-a`. Pulls the Setup A model weights to the local HF cache and verifies they actually load in their respective runtimes (sentence-transformers on Python for EmbeddingGemma; transformers.js on Node for EmbeddingGemma ONNX).

**Scope Boundary**: model downloads + load-time smoke tests only. No MCP config edits, no live-server swap, no vec-store changes.

**Dependencies**: independent of 001. Can run in parallel with 001 (and did, in this packet).

**Deliverables**:
- `google/embeddinggemma-300m` in `~/.cache/huggingface/hub/` (~~620MB)
- `onnx-community/embeddinggemma-300m-ONNX` in `~/.cache/huggingface/hub/` (~2.6GB; transformers.js-compatible ONNX port of `google/embeddinggemma-300m`)
- Python smoke test for EmbeddingGemma-300m (sentence-transformers, MPS, dim 768)
- Node smoke test for EmbeddingGemma (transformers.js v3.8.1, ONNX fp32, dim 768)
- Symlink bridging Python's `models--<org>--<name>/snapshots/<hash>/` cache layout to transformers.js's `<org>/<name>/` flat layout
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
HF cache was empty (48KB) post-reboot. The Setup A live swap (sub-phase 003) would block on first-use model downloads — ~~1.3GB combined — and risk hanging the MCP startup. We also did NOT know whether `@huggingface/transformers` v3.8.1 (the npm pkg HfLocalProvider uses) could actually load `google/embeddinggemma-300m`: Gemma3 architecture support in transformers.js is recent; the sentence-transformers config layer atop Gemma3 was the highest-risk unknown.

### Purpose
Pre-pull both models to disk so 003/004 don't hit network during the live swap, AND prove transformers.js can load EmbeddingGemma in the actual MCP runtime before we commit env-var changes. If transformers.js had failed, the packet would have switched to the documented fallback `mixedbread-ai/mxbai-embed-large-v1` (already in PREFIX_REGISTRY).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pre-download EmbeddingGemma-300m (~~620MB, 14 files)
- Pre-download EmbeddingGemma — canonical (`google/embeddinggemma-300m`, ~1.2GB sentence-transformers form) AND ONNX port (`onnx-community/embeddinggemma-300m-ONNX`, ~2.6GB with fp32/fp16/q4/q4f16/int8/no-gather-q4 variants)
- Python smoke test for EmbeddingGemma-300m
- Node smoke test for EmbeddingGemma (transformers.js compat — risk gate)
- Symlink Python cache → transformers.js flat layout
- HF auth via user-provided token (stored at `~/.cache/huggingface/token` with mode 600)

### Out of Scope
- MCP runtime config edits (sub-phase 003)
- Vec-store rebuild (004)
- Q4 quantization plumbing (005)
- bge-m3 evaluation (006)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `~/.cache/huggingface/token` | Create | User's HF token (mode 600) |
| `~/.cache/huggingface/hub/models--google--embeddinggemma-300m/**` | Create | EmbeddingGemma-300m weights via snapshot_download |
| `~/.cache/huggingface/hub/models--google--embeddinggemma-300m/**` | Create | Canonical sentence-transformers form (gated) |
| `~/.cache/huggingface/hub/models--onnx-community--embeddinggemma-300m-ONNX/**` | Create | ONNX port for transformers.js |
| `~/.cache/huggingface/hub/onnx-community/embeddinggemma-300m-ONNX` | Symlink | Bridge to snapshot dir for transformers.js |
| `scratch/test-embeddinggemma.py` | Create | Python smoke test |
| `scratch/test-embeddinggemma.mjs` | Create | Node smoke test (resides in `mcp_server/scratch/` for module resolution; mirrored here for evidence) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | EmbeddingGemma-300m on disk | `~/.cache/huggingface/hub/models--google--embeddinggemma-300m/` exists; model files present |
| REQ-002 | EmbeddingGemma ONNX on disk | `~/.cache/huggingface/hub/models--onnx-community--embeddinggemma-300m-ONNX/snapshots/<hash>/onnx/model.onnx` exists |
| REQ-003 | EmbeddingGemma-300m smoke test green | Python sentence-transformers loads model; dim=768; norm≈1.0 |
| REQ-004 | EmbeddingGemma smoke test green | Node transformers.js v3.8.1 loads ONNX; dims=[1,768]; norm=1.0 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Symlink bridge | `~/.cache/huggingface/hub/onnx-community/embeddinggemma-300m-ONNX` → snapshot dir |
| REQ-006 | Fallback path documented | If transformers.js had failed: switch to `mixedbread-ai/mxbai-embed-large-v1` (already in PREFIX_REGISTRY) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both models load from local cache in offline mode (no network round-trip during smoke test)
- **SC-002**: Encoded vector dims match expected (768 for Python EmbeddingGemma and 768 for ONNX Gemma)
- **SC-003**: Both vectors are unit-normalized (norm ≈ 1.0)
- **SC-004**: Strict-validate exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | transformers.js can't load Gemma3+ST | High | ✓ Mitigated: switched to `onnx-community/embeddinggemma-300m-ONNX` (purpose-built transformers.js port) |
| Risk | HF gated repo blocks download | Med | ✓ Mitigated: user generated HF token + accepted Gemma license |
| Risk | curl/Node fetch broken on this machine | Low | Confirmed: Python huggingface_hub succeeds; smoke test runs entirely offline from cache |
| Dependency | HF account + token (one-time user setup) | n/a | One-time; token stored at `~/.cache/huggingface/token` mode 600 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none — sub-phase complete)
<!-- /ANCHOR:questions -->
