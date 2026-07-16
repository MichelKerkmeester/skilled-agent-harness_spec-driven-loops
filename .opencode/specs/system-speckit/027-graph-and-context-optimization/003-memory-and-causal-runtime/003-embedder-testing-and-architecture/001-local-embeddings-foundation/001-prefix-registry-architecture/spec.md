---
title: "Feature Specification: Phase 1: prefix-registry-architecture"
description: "Replace hardcoded Nomic prefix in HfLocalProvider (TS) and cocoindex shared.py with a model-keyed PREFIX_REGISTRY + env-var override; eliminates ~5-8% silent recall loss when running any non-Nomic embedding model."
trigger_phrases:
  - "prefix registry"
  - "hf-local prefix"
  - "task prefix"
  - "embedding model prefix"
  - "getPrefixFor"
  - "PREFIX_REGISTRY"
  - "COCOINDEX_QUERY_PROMPT_NAME"
  - "embedding model swap"
  - "014/001"
  - "local-embeddings-setup-a 001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/001-prefix-registry-architecture"
    last_updated_at: "2026-05-12T18:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Source edits complete; build + tsc + 11 smoke assertions green"
    next_safe_action: "Proceed to sub-phase 002 (model installation)"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "implementation-summary.md"
      - "../../../../../skills/system-spec-kit/shared/embeddings/providers/hf-local.ts"
      - "../../../../../skills/system-spec-kit/shared/embeddings/factory.ts"
      - "../../../../../skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py"
    session_dedup:
      fingerprint: "sha256:0140014e6a6b6c6c6f0000000000000000000000000000000000000000000000"
      session_id: "014-001-prefix-registry-2026-05-12"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — Prefix Registry Architecture

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
| **Phase** | 1 of 8 |
| **Predecessor** | None |
| **Successor** | 002-model-installation-and-compat |
| **Handoff Criteria** | Build + type-check + smoke tests pass; PREFIX_REGISTRY exported from hf-local.ts; resolve_query_prompt_name() exported from cocoindex shared.py |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of `014-local-embeddings-setup-a`. It is the load-bearing architectural change that makes the rest of the packet's model swaps (sub-phases 002–008) work without silent recall loss.

**Scope Boundary**: 3 source files only — `hf-local.ts`, `factory.ts`, `shared.py` (cocoindex). No MCP config edits, no vec-store changes, no model downloads.

**Dependencies**: none. Independent of 002 (which can run in parallel).

**Deliverables**:
- `PREFIX_REGISTRY` + `getPrefixFor()` exported from `hf-local.ts`
- `VALID_PROVIDER_DIMENSIONS['hf-local']` extended with 5 new models
- `_QUERY_PROMPT_MODELS` dict + `resolve_query_prompt_name()` in cocoindex `shared.py`
- ADR in `decision-record.md`
- Build/type-check/smoke-test green
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`HfLocalProvider` (TS, transformers.js-backed) and `cocoindex_code/shared.py` both hardcode prefix conventions for ONE model family (Nomic). Every encode call prepends Nomic's `search_document: ` / `search_query: ` regardless of the actual model loaded. When the user swaps to EmbeddingGemma, Qwen3-Embedding, mxbai, or any non-Nomic model, the wrong prefix gets prepended → ~5-8% silent recall loss on retrieval benchmarks. This pre-existing bug becomes acute with Setup A (Voyage → local migration).

### Purpose
Replace the hardcoded prefix with a model-keyed registry + env-var escape hatch, so any future model swap is config-only and ships the correct prefix automatically. Common cases just work; unregistered models can opt in via env vars.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `PREFIX_REGISTRY` (Record<modelId, {document?, query?}>) in `hf-local.ts` with 6 initial entries
- `getPrefixFor(modelId, kind)` function with env > registry > empty fallback
- `VALID_PROVIDER_DIMENSIONS['hf-local']` entries for 5 new models (EmbeddingGemma, e5-large, mxbai-large, Snowflake-Arctic-L, bge-m3)
- `_QUERY_PROMPT_MODELS: dict` + `resolve_query_prompt_name()` in cocoindex `shared.py`
- Env overrides: `HF_EMBEDDINGS_PREFIX_DOC`, `HF_EMBEDDINGS_PREFIX_QUERY`, `COCOINDEX_QUERY_PROMPT_NAME`
- ADR documenting the registry-plus-override design

### Out of Scope
- Updating MCP runtime configs to use the env vars — that's 003
- Downloading the new models — that's 002
- Rebuilding vec stores — that's 004
- Q4 quantization plumbing (`HF_EMBEDDINGS_DTYPE`) — that's 005
- Refactoring the legacy `TASK_PREFIX` consumers in `shared/embeddings.ts`, `shared/index.ts`, `mcp_server/lib/providers/embeddings.ts` — kept back-compat; future cleanup

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` | Modify | Add `PREFIX_REGISTRY` + `getPrefixFor()`; rewire `embedDocument`/`embedQuery` |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modify | Extend `VALID_PROVIDER_DIMENSIONS['hf-local']` with 5 models |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Modify | Convert `_QUERY_PROMPT_MODELS` set → dict; add `resolve_query_prompt_name()` with env override |
| `.opencode/skills/system-spec-kit/mcp_server/dist/**` | Regenerate | `npm run build` output (`shared/dist/embeddings/providers/hf-local.js` etc.) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Model-keyed prefix registry in hf-local.ts | `PREFIX_REGISTRY` exported; 6 initial entries; resolution order env > registry > '' |
| REQ-002 | Env-override path | `HF_EMBEDDINGS_PREFIX_DOC` / `_QUERY` env vars override; empty string is a valid override |
| REQ-003 | Dimension registry extended | `VALID_PROVIDER_DIMENSIONS['hf-local']` includes 5 new model→dim entries |
| REQ-004 | cocoindex shared.py prompt registry | `_QUERY_PROMPT_MODELS` is a dict; Qwen3 entries added; env override via `COCOINDEX_QUERY_PROMPT_NAME` |
| REQ-005 | Build + type-check green | `npm run build` exit 0, `npx tsc --noEmit` exit 0 |
| REQ-006 | Smoke tests green | Node test (6 assertions) + Python test (5 assertions) all pass |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | ADR in decision-record.md | Problem, decision, alternatives (3), consequences documented |
| REQ-008 | Back-compat preserved | Existing `TASK_PREFIX` export retained for legacy consumers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Calling `getPrefixFor('google/embeddinggemma-300m', 'query')` returns `'task: search result | query: '`
- **SC-002**: Calling `getPrefixFor('made-up/model', 'query')` returns `''` (safe fallback)
- **SC-003**: Setting `HF_EMBEDDINGS_PREFIX_QUERY=''` makes `getPrefixFor(<any nomic model>, 'query')` return `''` (empty-string override distinguishes from undefined)
- **SC-004**: Strict-validate exits 0 on this packet
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Breaking the 3 legacy `TASK_PREFIX` consumers | Med | Keep `TASK_PREFIX` exported with Nomic values; legacy consumers unchanged |
| Risk | TS build break propagates to live MCP | Low | `tsc --noEmit` gate; MCP server already runs old `dist/` until restart |
| Risk | Python set→dict change breaks downstream | Low | All 92 lines of shared.py reviewed; only consumer is `create_embedder` at line 61 (now uses `resolve_query_prompt_name`) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none — sub-phase complete)
<!-- /ANCHOR:questions -->
