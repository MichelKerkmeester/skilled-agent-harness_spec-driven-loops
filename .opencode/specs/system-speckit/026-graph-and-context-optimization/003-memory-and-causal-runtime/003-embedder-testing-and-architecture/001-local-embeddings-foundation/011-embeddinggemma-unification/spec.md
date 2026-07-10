---
title: "Feature Specification: Phase 11 - EmbeddingGemma Unification"
description: "Make EmbeddingGemma-300m the default embedding model for Spec Kit Memory and CocoIndex, purge active Qwen3 references from committed source/config/docs, and update prior 014 packet docs to the final local-embedding state."
trigger_phrases:
  - "011 embeddinggemma unification"
  - "EmbeddingGemma default both surfaces"
  - "Qwen3 purge"
  - "google embeddinggemma cocoindex"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/011-embeddinggemma-unification"
    last_updated_at: "2026-05-13T07:35:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "All edits shipped + .codex/config.toml fixed by main agent"
    next_safe_action: "Use 012 for v3 remediation follow-up"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0140110c2a9e0000000000000000000000000000000000000000000000000001"
      session_id: "014-011-embeddinggemma-2026-05-13"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 folder? -> User pre-answered existing 014/011"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11 - EmbeddingGemma Unification

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete (shipped 2026-05-13 in commit d76f3b795) |
| **Created** | 2026-05-13 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 12 |
| **Predecessor** | 004-vec-store-rebuild + 009-cocoindex-ipc-fix + 010-cocoindex-code-only-patterns |
| **Successor** | None |
| **Handoff Criteria** | Both embedding surfaces default to EmbeddingGemma; Qwen3 active references are purged except recognized-model registries; strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Phase 11** of `014-local-embeddings-setup-a`. Earlier Setup A work landed EmbeddingGemma on the memory side and used a heavier code-side model for CocoIndex. That split became noisy during indexing and inconsistent with the now-working lightweight Gemma profile. The terminal state is a unified EmbeddingGemma profile across both embedding surfaces.

**Scope Boundary**: source defaults, committed runtime notes, packet docs, and Qwen3 reference cleanup. No cache deletion, no live daemon restart, no mutation of `~/.cocoindex_code/global_settings.yml`.

**Dependencies**: 004 established the memory-side 768-dim Gemma store, 009 unblocked the CocoIndex query path, and 010 separated code search from documentation search.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Setup A ended in a split-model state: Spec Kit Memory used `onnx-community/embeddinggemma-300m-ONNX` while CocoIndex used a heavier code-side model. The code-side model was heavier than needed for the current code-search target and kept older packet docs/config comments pointing future clones at the wrong default.

### Purpose
Make EmbeddingGemma the default everywhere new clones read their embedding defaults: memory via the ONNX transformers.js port, CocoIndex via the canonical sentence-transformers/safetensors model. Purge active Qwen3 references so the repo's current-state docs and config tell one story.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Set CocoIndex source defaults to `sbert/google/embeddinggemma-300m` and `google/embeddinggemma-300m`
- Set Spec Kit Memory hf-local source defaults to `onnx-community/embeddinggemma-300m-ONNX`
- Update committed MCP runtime config notes to describe EmbeddingGemma as the default
- Update `.env.example`, `SETUP_A_RECIPE.md`, `handover.md`, parent metadata, and prior 014 child packet docs to the final state
- Keep historical model registry entries that allow explicit user opt-in to Qwen-family models
- Strict-validate every updated packet and the 014 parent

### Out of Scope
- Deleting any files under `~/.cache/huggingface/`
- Touching the live CocoIndex daemon or `~/.cocoindex_code/global_settings.yml`
- Removing recognized-model entries from `PREFIX_REGISTRY`, `VALID_PROVIDER_DIMENSIONS`, or `_QUERY_PROMPT_MODELS`
- Editing `008/scratch/commit-message.txt`, which is preserved as historical committed-message material

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Modify | Default model becomes `sbert/google/embeddinggemma-300m` |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` | Modify | Default user settings become `google/embeddinggemma-300m` + sentence-transformers |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` | Modify | hf-local default becomes ONNX EmbeddingGemma |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modify | provider-default map and metadata fallback become ONNX EmbeddingGemma |
| Runtime configs | Modify | Default notes describe Gemma |
| 014 packet docs | Modify/Create | Current-state docs and 011 Level-1 packet docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Memory source default is EmbeddingGemma ONNX | `hf-local.ts` and `factory.ts` default hf-local to `onnx-community/embeddinggemma-300m-ONNX` |
| REQ-002 | CocoIndex source default is EmbeddingGemma | `config.py` uses `sbert/google/embeddinggemma-300m`; `settings.py` uses `google/embeddinggemma-300m` with `sentence-transformers` |
| REQ-003 | Runtime notes match the new defaults | All five committed MCP runtime configs describe `google/embeddinggemma-300m` for CocoIndex and ONNX Gemma for hf-local |
| REQ-004 | Active legacy model references are purged | The targeted model-string sweep finds no active legacy code-side default references outside allowed registries and the preserved 008 commit-message |
| REQ-005 | Prior packet docs reflect the terminal state | 004/007/008 post-merge/010/handover/SETUP_A_RECIPE/parent docs say EmbeddingGemma both sides |
| REQ-006 | Validation passes | Updated child packets and parent strict validation exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Dist artifacts rebuilt | `cd .opencode/skills/system-spec-kit/shared && npx tsc --build` exits 0 and updates `dist` |
| REQ-008 | Limitation documented | 011 implementation summary records query prompt support and doc-prompt asymmetry |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New clones default to EmbeddingGemma on both memory and CocoIndex surfaces without user-specific local config
- **SC-002**: Memory uses `onnx-community/embeddinggemma-300m-ONNX`, q8 default after 012, 768 dims
- **SC-003**: CocoIndex uses `google/embeddinggemma-300m`, sentence-transformers bf16 safetensors load, 768 dims
- **SC-004**: CocoIndex applies the `InstructionRetrieval` query prompt mode and does not apply a document prompt
- **SC-005**: Strict validation exits 0 for 011 and parent 014
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Gemma recall is lower than Qwen3 on code | Med | Acceptable trade-off for quiet local default; Qwen entries stay recognized for explicit opt-in |
| Risk | CocoIndex lacks asymmetric doc prompts | Med | Query prompt is applied; doc side remains unprefixed and documented as known suboptimal |
| Risk | Repo-local `.codex/` is write-blocked | Resolved | Main agent patched `.codex/config.toml` outside the prior sandbox on 2026-05-13 |
| Dependency | TypeScript build available | Med | Run `npx tsc --build` from shared package after source edits |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none)
<!-- /ANCHOR:questions -->
