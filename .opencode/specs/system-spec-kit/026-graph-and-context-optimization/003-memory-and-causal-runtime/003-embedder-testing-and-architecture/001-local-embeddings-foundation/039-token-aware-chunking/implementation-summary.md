---
title: "Implementation Summary: Token-Aware Chunking for LlamaCppProvider"
description: "Implemented token-aware llama-cpp truncation so provider input is bounded by model token budget before getEmbeddingFor."
trigger_phrases:
  - "039 token-aware chunking summary"
  - "llama-cpp token budget summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/039-token-aware-chunking"
    last_updated_at: "2026-05-14T14:30:00Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast"
    recent_action: "Implemented and verified token-aware llama-cpp truncation"
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
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 039-token-aware-chunking |
| **Completed** | 2026-05-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`LlamaCppProvider` now bounds embedding input by the loaded model's token budget before calling `getEmbeddingFor`. The existing character cap still runs first, but the final guard is token-aware, which addresses the live context-size overflow reproduced with normalized checklist content.

### Provider Guard

The provider derives `trainContextSize` from the loaded GGUF model, creates an auto embedding context bounded by that size, and truncates post-chunking text through the model tokenizer before inference. The runtime state now carries both `contextSize` and a 90 percent `tokenBudget`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` | Modified | Add bounded auto context creation, tokenizer-aware truncation, and a test seam. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/llama-cpp-token-budget.vitest.ts` | Created | Verify truncation and context options without requiring a real GGUF model. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/039-token-aware-chunking/` | Created | Track this implementation packet. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered in the working tree with a focused provider patch and a targeted Vitest file. The real-runtime smoke case follows the existing llama-cpp test convention and skips unless the default GGUF model exists and `EMBEDDINGS_PROVIDER=llama-cpp` is set; staging and commit are blocked by `.git/index.lock` EPERM in this sandbox.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `MAX_TEXT_LENGTH=8000` unchanged | It remains a useful provider-neutral first pass and avoids broadening this packet into shared chunking behavior. |
| Use local llama-cpp interface extensions | The provider only needs a small type shape and should not couple shared code to optional dependency types. |
| Use bounded `contextSize: 'auto'` | It lets the model use its real context window while preserving a 512-token floor for constrained hosts. |
| Add `__llamaCppTestables` | The test can inject a runtime and loader without mocking the optional native dependency through the module system. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skills/system-spec-kit/mcp_server && npx tsc --noEmit` | PASS, exit 0; output saved to `/tmp/030-typecheck.txt`. |
| `npx vitest run tests/llama-cpp-token-budget.vitest.ts` | PASS, exit 0; 3 passed and 1 skipped. |
| `validate.sh --strict` on 039 | PASS after compacting `next_safe_action`. |
| Real-model smoke (T030-04 with `EMBEDDINGS_PROVIDER=llama-cpp`) | Initially FAIL (TypeError, see Cross-References). Closed by 037 API hotfix; subsequent run PASS 4/4. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:cross-references -->
## Cross-References (added 2026-05-14)

039 shipped the source patch and the 4-case vitest. Packet `../037-llama-cpp-embedding-worker-deep-dive/` then ran the real-model smoke (T030-04) under `EMBEDDINGS_PROVIDER=llama-cpp` and surfaced an API mismatch: the patch used `runtime.model.tokenizer.tokenize(inputText)`, but `LlamaModel.tokenizer` in `node-llama-cpp@3.17.1` is a *callable* (a function with a `.detokenize` property attached), not an object with a `.tokenize` method. The fix swapped to `runtime.model.tokenize(inputText)` — the documented direct method on `LlamaModel` (`LlamaModel.d.ts:181`). The mock in `llama-cpp-token-budget.vitest.ts` was likewise switched from `model.tokenizer.tokenize(...)` to `model.tokenize(...)`, and T030-04 now PASSes against the real GGUF.

037 also ships:
- The Phase 1 reproduction harness and TSV evidence at `_sandbox/37--llama-cpp-context-size/`.
- ADR-003 (`../037-llama-cpp-embedding-worker-deep-dive/decision-record.md`) capturing the rationale, four alternatives weighed, and the API hotfix narrative.

039 is functionally complete; 037 is its companion evidence + hotfix packet.
<!-- /ANCHOR:cross-references -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Auto context can use more memory.** Low-memory hosts may fail where the old fixed 512-token context loaded, so failures remain explicit and the real-runtime smoke test is conditional.
2. **Git staging is blocked.** The code and packet files are uncommitted because `.git/index.lock` creation returns EPERM.
3. **API hotfix lived in 037.** The original 039 patch shipped the wrong call (`model.tokenizer.tokenize`) and would have crashed the real model at runtime. Future maintainers should treat 037 + 039 as a single fix when reviewing or reverting.
<!-- /ANCHOR:limitations -->
