---
title: "Implementation Plan: 015 node-llama-cpp Memory MCP embedding evaluation"
description: "Plan for the opt-in llama-cpp provider, parity tests, benchmark harness, documentation, metadata, and default-flip decision."
trigger_phrases:
  - "015 llama cpp plan"
  - "node llama cpp provider plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/015-node-llama-cpp-evaluation"
    last_updated_at: "2026-05-13T09:56:14Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Executed llama-cpp evaluation plan"
    next_safe_action: "Keep llama-cpp opt-in; do not flip default after parity failure"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:1150150150150150150150150150150150150150150150150150150150150150"
      session_id: "015-node-llama-cpp-evaluation-2026-05-13"
      parent_session_id: "015-node-llama-cpp-evaluation-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: 015 node-llama-cpp Memory MCP embedding evaluation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node ESM, Vitest, Markdown |
| **Package** | Spec Kit Memory MCP under `.opencode/skills/system-spec-kit/mcp_server` |
| **Embedding Surface** | Shared `IEmbeddingProvider` implementations under `.opencode/skills/system-spec-kit/shared/embeddings` |
| **Models** | `onnx-community/embeddinggemma-300m-ONNX` q8 vs `unsloth/embeddinggemma-300m-GGUF` Q8_0 |
| **Testing** | Vitest, TypeScript build, benchmark harness, strict spec validation |

### Overview
Add and evaluate an opt-in `LlamaCppProvider` for Memory MCP. The provider uses dynamic `node-llama-cpp` import, lazy GGUF loading, prefix-registry compatibility, normalized 768-dimensional output, and a distinct embedding profile slug. Measurement decides whether a later packet should flip the default.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 folder pre-answered by orchestrator.
- [x] Allowed write scope supplied explicitly.
- [x] Existing factory/provider/test patterns read before edits.
- [x] `node-llama-cpp` dynamic import succeeds.
- [x] GGUF model path and SHA-256 recorded.

### Definition of Done
- [x] llama-cpp provider present and implements `IEmbeddingProvider`.
- [x] Factory supports explicit `llama-cpp` without changing default resolution.
- [x] Smoke and factory tests pass.
- [x] Parity test executed and records real metrics.
- [x] Benchmarks record load/query rows for both providers.
- [x] Docs and metadata record the no-flip decision.
- [x] Strict packet validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Keep provider selection centralized in `factory.ts`. `LlamaCppProvider` is isolated in `providers/llama-cpp.ts` and loaded only from the explicit `llama-cpp` case.

### Key Components
- `LlamaCppProvider`: native GGUF provider implementing `IEmbeddingProvider`.
- `loadNodeLlamaCpp()`: dynamic import plus workspace fallback and install hint.
- `loadRuntime()`: singleton `getLlama() -> loadModel({ embedding: true }) -> createEmbeddingContext()` path.
- `getPrefixFor()`: existing prefix registry from `hf-local.ts`, reused for document/query methods.
- `EmbeddingProfile`: slug source for separate sqlite file naming.
- Vitest files: smoke, parity, and factory coverage.
- Benchmark harness: `scratch/bench-llama-cpp-vs-hf-local.ts`.

### Data Flow
1. `EMBEDDINGS_PROVIDER=llama-cpp` resolves through `factory.ts`.
2. Factory lazy-imports `providers/llama-cpp.js`.
3. Provider constructor records model id/path but does not load native runtime.
4. First embedding call loads `node-llama-cpp`, the GGUF model, and an embedding context.
5. Text is optionally semantically chunked, embedded, dimension-coerced, and L2-normalized.
6. Profile metadata points at a llama-cpp-specific sqlite filename.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Pre-flight
- Probe `node-llama-cpp` with the requested CJS command and dynamic ESM import.
- Verify Metal dylibs under the installed package.
- Record GGUF model path, SHA-256, size, and substitution details.

### Phase 1: Provider Implementation
- Add `LlamaCppProvider`.
- Extend factory/provider metadata.
- Preserve default `hf-local` behavior.

### Phase 2: Tests
- Add smoke test for warmup and normalized vector shape.
- Add parity test against `HfLocalProvider`.
- Add factory wire-up test.

### Phase 3: Benchmark
- Add load/query benchmark harness.
- Run both providers with 1000 query iterations.
- Record RSS and powermetrics availability.

### Phase 4: Documentation
- Update `.env.example`.
- Update Memory MCP README.
- Fill packet docs with real numbers and outcome.

### Phase 5: Validation
- Run build, tests, benchmark, and strict validation.
- Update parent metadata after final verdict.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Command | Expected |
|------|---------|----------|
| Build | `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` | TypeScript exits 0 |
| Smoke/factory | `EMBEDDINGS_PROVIDER=llama-cpp npx vitest run tests/embeddings-llama-cpp-smoke.vitest.ts tests/embeddings-llama-cpp-factory.vitest.ts` | pass |
| Parity | `EMBEDDINGS_PROVIDER=llama-cpp npx vitest run tests/embeddings-llama-cpp-parity.vitest.ts` | metrics recorded; default flip only if thresholds pass |
| Bench load | `EMBEDDINGS_PROVIDER=<provider> node --import ../scripts/node_modules/tsx/dist/loader.mjs ... --mode=load` | one load row |
| Bench query | `EMBEDDINGS_PROVIDER=<provider> node --import ../scripts/node_modules/tsx/dist/loader.mjs ... --mode=query --iterations=1000` | one query row |
| Spec validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | exit 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `node-llama-cpp` installed under `mcp_server/node_modules`.
- `@node-llama-cpp/mac-arm64-metal` nested optional package for this host.
- GGUF model file at `~/.cache/huggingface/gguf/embeddinggemma-300m/embeddinggemma-300M-Q8_0.gguf`.
- Existing `@huggingface/transformers` baseline for `hf-local`.
- Existing `tsx` loader in `.opencode/skills/system-spec-kit/scripts/node_modules`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Leave `EMBEDDINGS_PROVIDER` unset or set it to `hf-local`.
- Remove `EMBEDDINGS_PROVIDER=llama-cpp` from any local `.env.local` experiment.
- Delete any llama-cpp-specific generated sqlite index only if deliberately cleaning experiment artifacts.
- No production rollback is required because the default path was not changed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

| Phase | Depends On | Notes |
|-------|------------|-------|
| Phase 1 | Phase 0 | Provider needs importable dependency and model path conventions |
| Phase 2 | Phase 1 | Tests import provider and factory |
| Phase 3 | Phase 1 | Benchmark imports providers directly |
| Phase 4 | Phase 2-3 | Docs need real parity and benchmark numbers |
| Phase 5 | Phase 4 | Strict validation requires final docs and metadata |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT

| Area | Actual Notes |
|------|--------------|
| Provider implementation | Provider and factory wiring already existed in the workspace and passed build after inspection |
| Pre-flight | CJS `require` probe failed on ESM TLA; dynamic import succeeded |
| Tests | Smoke/factory passed; parity failed hard threshold |
| Benchmarks | llama-cpp query was much faster than hf-local on this host |
| Docs/validation | Packet docs authored to Level 2 anchors with rejected default-flip verdict |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Risk | Rollback Action |
|------|-----------------|
| llama-cpp parity drift corrupts ranking | Do not use provider for production index; keep `hf-local` |
| Metal runtime unavailable | Keep `LLAMA_CPP_EMBEDDINGS_GPU_LAYERS=0` or avoid llama-cpp |
| Optional dependency missing on another host | Run `npm install node-llama-cpp@3.17.1 --save-optional` from `mcp_server`, then rebuild |
| Existing vector DB mixed by manual override | Use provider-specific profile DB and rebuild intentionally |
<!-- /ANCHOR:enhanced-rollback -->
