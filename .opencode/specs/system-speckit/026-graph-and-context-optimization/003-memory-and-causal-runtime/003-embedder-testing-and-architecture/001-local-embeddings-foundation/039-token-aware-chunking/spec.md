---
title: "Token-Aware Chunking for LlamaCppProvider"
description: "Implementation packet for preventing llama-cpp embedding context overflow by bounding inputs with the model tokenizer and runtime train context size. The change keeps the cross-provider character cap as a first pass, then truncates by token budget before calling getEmbeddingFor."
trigger_phrases:
  - "039 token-aware chunking"
  - "llama-cpp context size"
  - "embeddinggemma token budget"
  - "token-aware truncation"
  - "context size overflow"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/039-token-aware-chunking"
    last_updated_at: "2026-05-14T14:30:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast"
    recent_action: "Implemented token-aware llama-cpp truncation and targeted tests"
    next_safe_action: "Manual stage and commit"
    blockers:
      - ".git/index.lock creation is EPERM in this sandbox"
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/llama-cpp-token-budget.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-039-token-aware-chunking"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Keep shared/chunking.ts and MAX_TEXT_LENGTH=8000 unchanged; the character cap remains the provider-agnostic first-pass guard."
      - "Use a local llama-cpp interface extension for trainContextSize, tokenizer, and detokenize instead of importing node-llama-cpp types."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Token-Aware Chunking for LlamaCppProvider

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`LlamaCppProvider` currently caps input by characters before passing text to `LlamaEmbeddingContext.getEmbeddingFor`. The live reproduction shows a 2,831-byte normalized checklist can still exceed the llama-cpp embedding context because the real limit is token count, not raw characters.

### Purpose

Use the loaded model's tokenizer and training context size to guarantee llama-cpp never receives oversized embedding input, while preserving the existing cross-provider character cap and local fallback behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Extend the local llama-cpp model interface with `trainContextSize`, `tokenizer.tokenize`, and `detokenize`.
- Load embedding contexts with `contextSize: 'auto'`, `minContextSize: 512`, `maxContextSize: trainContextSize`, and a bounded batch size.
- Store `tokenBudget` and `contextSize` on runtime state.
- Tokenize and truncate the post-semantic-chunk text before inference.
- Add targeted Vitest coverage for token truncation, context creation options, and conditional real-model smoke behavior.
- Generate this packet's metadata with the spec-kit memory JSON payload path.

### Out of Scope

- `.opencode/skills/system-code-graph/` because this packet does not own the code-graph skill.
- `.opencode/specs/system-spec-kit/014-*` because the shipped local embeddings packet is not being edited.
- `.opencode/specs/system-spec-kit/028-*` because the orphan cleanup packet is already shipped.
- `.opencode/skills/system-code-graph/dist/system-spec-kit/shared/` because that path contains an orchestrator-owned uncommitted patch.
- Live MCP child processes because this task forbids killing or restarting `spec-kit-memory-launcher`, `system-code-graph-launcher`, and `skill-advisor-launcher`.
- `shared/chunking.ts` and `MAX_TEXT_LENGTH=8000` because the character cap remains the first-pass provider-neutral guard.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` | Modify | Add tokenizer-aware truncation and train-context-bounded embedding context loading. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/llama-cpp-token-budget.vitest.ts` | Create | Cover token budget truncation, context creation options, and optional real-runtime smoke behavior. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/039-token-aware-chunking/` | Create | Track scope, plan, tasks, verification, and metadata for this packet. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Runtime state must derive budget from the loaded model | `loadRuntime` reads `model.trainContextSize ?? 2048`, stores `contextSize`, and computes `tokenBudget = Math.floor(trainContextSize * 0.9)`. |
| REQ-002 | Embedding context creation must use model-bounded auto context | Tests assert `createEmbeddingContext` receives `contextSize: 'auto'`, `minContextSize: 512`, `maxContextSize: trainContextSize`, and `batchSize: Math.min(512, trainContextSize)`. |
| REQ-003 | Inference input must be truncated by tokenizer budget | A mocked tokenizer producing more than `tokenBudget` tokens results in `getEmbeddingFor` receiving text with at most the budgeted token count. |
| REQ-004 | The live context-size overflow repro must not reach llama-cpp oversized | The 8,000-character fixture test resolves without throwing and passes a token-bounded string to the mocked embedding context. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Conditional real-runtime smoke must be present | If `DEFAULT_MODEL_PATH` exists, the new smoke test embeds the actual 027 checklist fixture and asserts a 768-dimensional `Float32Array`; otherwise the case is skipped. |
| REQ-006 | Existing provider-level character cap stays intact | `shared/chunking.ts` and `MAX_TEXT_LENGTH=8000` are untouched. |
| REQ-007 | Packet validation and TypeScript checks must pass | `npx tsc --noEmit`, targeted Vitest, and `validate.sh --strict` all exit 0 for packet 039. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: llama-cpp inference receives token-bounded input even when character length is below or equal to the existing provider cap.
- **SC-002**: `EmbeddingGemma-300M` can use its full model context window when host memory permits, with a 512-token floor for constrained hosts.
- **SC-003**: Unit coverage proves context creation bounds and truncation behavior without requiring the real GGUF model.
- **SC-004**: **Given** a mocked tokenizer that returns more than the configured token budget, **When** `generateEmbedding` runs, **Then** the text passed to `getEmbeddingFor` tokenizes to no more than that budget.
- **SC-005**: **Given** a host without the default GGUF model, **When** the real-runtime smoke case runs, **Then** it skips instead of failing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `node-llama-cpp` tokenizer and detokenizer shape | The local interface assumes tokenizer and detokenizer are available on loaded embedding models. | Keep the type extension local and covered by mock tests; smoke test runs only when the real model exists. |
| Risk | `contextSize: 'auto'` can request more VRAM on low-memory hosts | Runtime loading may fail where a fixed 512 context previously fit. | Bound with `minContextSize: 512`, `maxContextSize: trainContextSize`, and document the VRAM risk in the plan. |
| Risk | Dirty parallel-track worktree | Accidental staging can pollute the commit. | Stage only the 039 packet, llama-cpp provider, and new 030 test file. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->
