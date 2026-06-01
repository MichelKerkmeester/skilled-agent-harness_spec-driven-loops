---
title: "Token-Aware Chunking for LlamaCppProvider"
description: "LlamaCppProvider was extended to bound embedding input by the loaded model's token budget before calling getEmbeddingFor. The change replaced the character-only cap with a tokenizer-aware truncation step, closing the live context-size overflow that normalized checklist content could trigger."
trigger_phrases:
  - "token-aware chunking"
  - "llama-cpp context overflow fix"
  - "llama-cpp token budget truncation"
  - "039 token-aware chunking"
  - "trainContextSize embedding guard"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/039-token-aware-chunking` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

`LlamaCppProvider` capped embedding input by character count, but a live reproduction confirmed that a 2831-byte normalized checklist could still overflow the llama-cpp embedding context because the real limit is token count, not raw characters. The provider was extended to derive a token budget from the loaded GGUF model's `trainContextSize`, create an auto-bounded embedding context and truncate the post-semantic-chunk text through the model tokenizer before calling `getEmbeddingFor`. The existing provider-neutral character cap is preserved as a first-pass guard. A targeted Vitest file covers token truncation, context creation bounds and a conditional real-model smoke case without requiring a real GGUF model at test time.

### Added

- `__llamaCppTestables` test seam on `LlamaCppProvider` for runtime injection and loader verification without requiring the native optional dependency
- `llama-cpp-token-budget.vitest.ts` with T030-01 through T030-04 covering truncation behavior, context creation options, the 8000-character fixture case and conditional real-model smoke
- `tokenBudget` and `contextSize` fields on `LlamaCppRuntimeState`

### Changed

- `loadRuntime` now creates an auto embedding context bounded by `trainContextSize` with `contextSize: 'auto'`, `minContextSize: 512`, `maxContextSize: trainContextSize` and a bounded batch size
- `LlamaModel` interface extended with `trainContextSize`, `tokenize` and a detokenize accessor
- Tokenizer truncation step inserted after semantic chunking and before `getEmbeddingFor`

### Fixed

- `LlamaCppProvider` could pass oversized token input to `getEmbeddingFor` when normalized text fit the 8000-character cap but exceeded the model's token context window. The token-budget truncation step eliminates that overflow path.

### Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS, exit 0. Output saved to `/tmp/030-typecheck.txt`. |
| `npx vitest run tests/llama-cpp-token-budget.vitest.ts` | PASS, exit 0. 3 passed, 1 skipped. |
| `validate.sh --strict` on 039 | PASS after compacting `next_safe_action`. |
| Real-model smoke T030-04 with `EMBEDDINGS_PROVIDER=llama-cpp` | Initially FAIL (TypeError on `model.tokenizer.tokenize`). Closed by companion packet 037 API hotfix swapping to `model.tokenize`. Subsequent run PASS 4/4. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` | Modified | Added bounded auto context creation, tokenizer-aware truncation, test seam and extended `LlamaModel` interface. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/llama-cpp-token-budget.vitest.ts` (NEW) | Created | Four-case Vitest covering token budget truncation, context creation bounds and optional real-runtime smoke. |

### Follow-Ups

- Treat packets 037 and 039 as a single logical fix when reviewing or reverting. The original 039 patch used `model.tokenizer.tokenize` which crashed the real model at runtime. Packet 037 shipped the corrected call `model.tokenize` and the API hotfix narrative in `decision-record.md`.
- Auto context can consume more VRAM than the prior fixed 512-token context. Document the `minContextSize: 512` floor and the explicit failure mode for memory-constrained hosts in the operator runbook.
