---
title: "Implementation Plan: Token-Aware Chunking for LlamaCppProvider"
description: "Plan for adding tokenizer-budget truncation to the llama-cpp embedding provider while preserving the existing character cap and adding focused Vitest coverage."
trigger_phrases:
  - "039 token-aware chunking plan"
  - "llama-cpp context size plan"
  - "embeddinggemma token budget plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/039-token-aware-chunking"
    last_updated_at: "2026-05-14T14:30:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast"
    recent_action: "Implemented scoped llama-cpp token-budget guard"
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
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Token-Aware Chunking for LlamaCppProvider

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, local llama-cpp embeddings |
| **Framework** | system-spec-kit shared embeddings provider plus Vitest under MCP server |
| **Storage** | None for provider change; optional smoke reads an existing markdown fixture |
| **Testing** | `npx tsc --noEmit`, targeted Vitest, strict spec validation |

### Overview

The provider will continue applying `semanticChunk(inputText, MAX_TEXT_LENGTH)` as a coarse character guard. After runtime load, it will tokenize the text with the loaded llama-cpp model, truncate to 90 percent of `trainContextSize`, detokenize, and only then call `getEmbeddingFor`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Live context overflow reproduction is documented.
- [x] Target files and forbidden paths are identified.
- [x] Gate 3 was pre-answered for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/039-token-aware-chunking`.

### Definition of Done

- [x] Provider loads embedding context with model-bounded auto context.
- [x] Provider truncates by tokenizer budget before inference.
- [x] Targeted token-budget tests pass.
- [x] Typecheck and strict packet validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Runtime-derived provider guard.

### Key Components

- **Local llama-cpp interface extension**: Adds only the shape this provider needs: `trainContextSize`, `tokenizer.tokenize`, and `detokenize`.
- **Runtime state**: Carries `contextSize` and `tokenBudget` with the loaded model and embedding context.
- **Generation path**: Applies character chunking first, token budget enforcement second, and inference last.

### Data Flow

`generateEmbedding` trims input, applies existing semantic chunking when the character cap is exceeded, loads runtime, tokenizes the resulting text, truncates and detokenizes when needed, and passes the bounded text into `runtime.context.getEmbeddingFor`.

### File List

| File | Lines | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` | 51-69 | Extend local model and runtime interfaces. |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` | 210-218 | Change embedding context loading to auto context bounded by `trainContextSize`. |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` | 318-350 | Add tokenizer-budget truncation before `getEmbeddingFor`. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/llama-cpp-token-budget.vitest.ts` | new | Verify token budget behavior and context options. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `LlamaCppProvider.loadRuntime` | Loads GGUF model and fixed 512-token embedding context | Bound auto context to `trainContextSize` and persist budget metadata | T030-03 plus TypeScript typecheck |
| `LlamaCppProvider.generateEmbedding` | Sends character-capped text to `getEmbeddingFor` | Tokenize, truncate to budget, detokenize before inference | T030-01 and T030-02 |
| `shared/chunking.ts` | Cross-provider character cap utilities | Unchanged | `git diff -- shared/chunking.ts` remains empty |
| Real llama-cpp runtime | Optional local smoke validation | Embed 027 checklist only when default model file exists | T030-04 skip-or-smoke behavior |

### Decision

Use `contextSize: 'auto'` with `minContextSize: 512` and `maxContextSize: trainContextSize`. This lets `EmbeddingGemma-300M` use its full roughly 2,048-token training window when VRAM permits, while keeping the prior 512-token floor for constrained hosts. The trade-off is real: auto context can require more memory than the old fixed setting on low-memory machines, so the smoke case is conditional and runtime failure remains explicit.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigation

- [x] Confirm live overflow happens after `normalizeContentForEmbedding`, below the 8,000-character cap.
- [x] Confirm `getEmbeddingFor` fails on context-size overflow.
- [x] Confirm the fix belongs in `LlamaCppProvider`, not shared chunking.

### Phase 2: Implementation

- [x] Extend local llama-cpp interfaces for model context and tokenizer shape.
- [x] Store `contextSize` and `tokenBudget` in runtime state.
- [x] Replace fixed context creation with bounded auto context.
- [x] Add tokenizer-aware truncation in `generateEmbedding`.
- [x] Add a minimal test seam for runtime override and loader access.
- [x] Create targeted Vitest coverage for mocked token budget behavior.

### Phase 3: Verification

- [x] Run `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit`.
- [x] Run `npx vitest run tests/llama-cpp-token-budget.vitest.ts`.
- [x] Run strict validation on the 039 packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | shared provider and MCP server imports | `npx tsc --noEmit` |
| Unit | mocked tokenizer budget and context options | `npx vitest run tests/llama-cpp-token-budget.vitest.ts` |
| Conditional smoke | real default GGUF model when present | T030-04 in the new Vitest file |
| Spec validation | 039 packet docs and metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `node-llama-cpp` runtime model APIs | Optional dependency | Yellow | Mock tests can still prove local behavior; smoke skips when the model is unavailable. |
| Default GGUF model path | Local file | Yellow | T030-04 skips if the model is absent. |
| Existing dirty worktree | Workflow | Yellow | Use path-specific staging only. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: llama-cpp model loading regresses on hosts that cannot satisfy bounded auto context.
- **Procedure**: Revert the 039 commit to restore fixed 512 context creation and remove the new token-budget test file and packet folder.
<!-- /ANCHOR:rollback -->
